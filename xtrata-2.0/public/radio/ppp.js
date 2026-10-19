var ew = Object.defineProperty;
var nw = (t, e, n) => e in t ? ew(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var no = (t, e, n) => nw(t, typeof e != "symbol" ? e + "" : e, n);
var rn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function d0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function rc(t) {
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
      typeof rn < "u" && rn || {}, r = {
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
      function s(A) {
        return A && DataView.prototype.isPrototypeOf(A);
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
        ], o = ArrayBuffer.isView || function(A) {
          return A && i.indexOf(Object.prototype.toString.call(A)) > -1;
        };
      function a(A) {
        if (typeof A != "string" && (A = String(A)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(A) || A === "")
          throw new TypeError('Invalid character in header field name: "' + A + '"');
        return A.toLowerCase();
      }
      function c(A) {
        return typeof A != "string" && (A = String(A)), A;
      }
      function u(A) {
        var P = {
          next: function() {
            var M = A.shift();
            return { done: M === void 0, value: M };
          }
        };
        return r.iterable && (P[Symbol.iterator] = function() {
          return P;
        }), P;
      }
      function d(A) {
        this.map = {}, A instanceof d ? A.forEach(function(P, M) {
          this.append(M, P);
        }, this) : Array.isArray(A) ? A.forEach(function(P) {
          if (P.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + P.length);
          this.append(P[0], P[1]);
        }, this) : A && Object.getOwnPropertyNames(A).forEach(function(P) {
          this.append(P, A[P]);
        }, this);
      }
      d.prototype.append = function(A, P) {
        A = a(A), P = c(P);
        var M = this.map[A];
        this.map[A] = M ? M + ", " + P : P;
      }, d.prototype.delete = function(A) {
        delete this.map[a(A)];
      }, d.prototype.get = function(A) {
        return A = a(A), this.has(A) ? this.map[A] : null;
      }, d.prototype.has = function(A) {
        return this.map.hasOwnProperty(a(A));
      }, d.prototype.set = function(A, P) {
        this.map[a(A)] = c(P);
      }, d.prototype.forEach = function(A, P) {
        for (var M in this.map)
          this.map.hasOwnProperty(M) && A.call(P, this.map[M], M, this);
      }, d.prototype.keys = function() {
        var A = [];
        return this.forEach(function(P, M) {
          A.push(M);
        }), u(A);
      }, d.prototype.values = function() {
        var A = [];
        return this.forEach(function(P) {
          A.push(P);
        }), u(A);
      }, d.prototype.entries = function() {
        var A = [];
        return this.forEach(function(P, M) {
          A.push([M, P]);
        }), u(A);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(A) {
        if (!A._noBody) {
          if (A.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          A.bodyUsed = !0;
        }
      }
      function y(A) {
        return new Promise(function(P, M) {
          A.onload = function() {
            P(A.result);
          }, A.onerror = function() {
            M(A.error);
          };
        });
      }
      function p(A) {
        var P = new FileReader(), M = y(P);
        return P.readAsArrayBuffer(A), M;
      }
      function E(A) {
        var P = new FileReader(), M = y(P), q = /charset=([A-Za-z0-9_-]+)/.exec(A.type), at = q ? q[1] : "utf-8";
        return P.readAsText(A, at), M;
      }
      function b(A) {
        for (var P = new Uint8Array(A), M = new Array(P.length), q = 0; q < P.length; q++)
          M[q] = String.fromCharCode(P[q]);
        return M.join("");
      }
      function T(A) {
        if (A.slice)
          return A.slice(0);
        var P = new Uint8Array(A.byteLength);
        return P.set(new Uint8Array(A)), P.buffer;
      }
      function W() {
        return this.bodyUsed = !1, this._initBody = function(A) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = A, A ? typeof A == "string" ? this._bodyText = A : r.blob && Blob.prototype.isPrototypeOf(A) ? this._bodyBlob = A : r.formData && FormData.prototype.isPrototypeOf(A) ? this._bodyFormData = A : r.searchParams && URLSearchParams.prototype.isPrototypeOf(A) ? this._bodyText = A.toString() : r.arrayBuffer && r.blob && s(A) ? (this._bodyArrayBuffer = T(A.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(A) || o(A)) ? this._bodyArrayBuffer = T(A) : this._bodyText = A = Object.prototype.toString.call(A) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof A == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(A) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var A = l(this);
          if (A)
            return A;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var A = l(this);
            return A || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var A = l(this);
          if (A)
            return A;
          if (this._bodyBlob)
            return E(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(b(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var X = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function S(A) {
        var P = A.toUpperCase();
        return X.indexOf(P) > -1 ? P : A;
      }
      function N(A, P) {
        if (!(this instanceof N))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        P = P || {};
        var M = P.body;
        if (A instanceof N) {
          if (A.bodyUsed)
            throw new TypeError("Already read");
          this.url = A.url, this.credentials = A.credentials, P.headers || (this.headers = new d(A.headers)), this.method = A.method, this.mode = A.mode, this.signal = A.signal, !M && A._bodyInit != null && (M = A._bodyInit, A.bodyUsed = !0);
        } else
          this.url = String(A);
        if (this.credentials = P.credentials || this.credentials || "same-origin", (P.headers || !this.headers) && (this.headers = new d(P.headers)), this.method = S(P.method || this.method || "GET"), this.mode = P.mode || this.mode || null, this.signal = P.signal || this.signal || function() {
          if ("AbortController" in n) {
            var Y = new AbortController();
            return Y.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && M)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(M), (this.method === "GET" || this.method === "HEAD") && (P.cache === "no-store" || P.cache === "no-cache")) {
          var q = /([?&])_=[^&]*/;
          if (q.test(this.url))
            this.url = this.url.replace(q, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var at = /\?/;
            this.url += (at.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      N.prototype.clone = function() {
        return new N(this, { body: this._bodyInit });
      };
      function B(A) {
        var P = new FormData();
        return A.trim().split("&").forEach(function(M) {
          if (M) {
            var q = M.split("="), at = q.shift().replace(/\+/g, " "), Y = q.join("=").replace(/\+/g, " ");
            P.append(decodeURIComponent(at), decodeURIComponent(Y));
          }
        }), P;
      }
      function J(A) {
        var P = new d(), M = A.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(q) {
          return q.indexOf(`
`) === 0 ? q.substr(1, q.length) : q;
        }).forEach(function(q) {
          var at = q.split(":"), Y = at.shift().trim();
          if (Y) {
            var L = at.join(":").trim();
            try {
              P.append(Y, L);
            } catch (rt) {
              console.warn("Response " + rt.message);
            }
          }
        }), P;
      }
      W.call(N.prototype);
      function nt(A, P) {
        if (!(this instanceof nt))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (P || (P = {}), this.type = "default", this.status = P.status === void 0 ? 200 : P.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = P.statusText === void 0 ? "" : "" + P.statusText, this.headers = new d(P.headers), this.url = P.url || "", this._initBody(A);
      }
      W.call(nt.prototype), nt.prototype.clone = function() {
        return new nt(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, nt.error = function() {
        var A = new nt(null, { status: 200, statusText: "" });
        return A.ok = !1, A.status = 0, A.type = "error", A;
      };
      var K = [301, 302, 303, 307, 308];
      nt.redirect = function(A, P) {
        if (K.indexOf(P) === -1)
          throw new RangeError("Invalid status code");
        return new nt(null, { status: P, headers: { location: A } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(P, M) {
          this.message = P, this.name = M;
          var q = Error(P);
          this.stack = q.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function z(A, P) {
        return new Promise(function(M, q) {
          var at = new N(A, P);
          if (at.signal && at.signal.aborted)
            return q(new e.DOMException("Aborted", "AbortError"));
          var Y = new XMLHttpRequest();
          function L() {
            Y.abort();
          }
          Y.onload = function() {
            var I = {
              statusText: Y.statusText,
              headers: J(Y.getAllResponseHeaders() || "")
            };
            at.url.indexOf("file://") === 0 && (Y.status < 200 || Y.status > 599) ? I.status = 200 : I.status = Y.status, I.url = "responseURL" in Y ? Y.responseURL : I.headers.get("X-Request-URL");
            var F = "response" in Y ? Y.response : Y.responseText;
            setTimeout(function() {
              M(new nt(F, I));
            }, 0);
          }, Y.onerror = function() {
            setTimeout(function() {
              q(new TypeError("Network request failed"));
            }, 0);
          }, Y.ontimeout = function() {
            setTimeout(function() {
              q(new TypeError("Network request timed out"));
            }, 0);
          }, Y.onabort = function() {
            setTimeout(function() {
              q(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function rt(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (Y.open(at.method, rt(at.url), !0), at.credentials === "include" ? Y.withCredentials = !0 : at.credentials === "omit" && (Y.withCredentials = !1), "responseType" in Y && (r.blob ? Y.responseType = "blob" : r.arrayBuffer && (Y.responseType = "arraybuffer")), P && typeof P.headers == "object" && !(P.headers instanceof d || n.Headers && P.headers instanceof n.Headers)) {
            var Zt = [];
            Object.getOwnPropertyNames(P.headers).forEach(function(I) {
              Zt.push(a(I)), Y.setRequestHeader(I, c(P.headers[I]));
            }), at.headers.forEach(function(I, F) {
              Zt.indexOf(F) === -1 && Y.setRequestHeader(F, I);
            });
          } else
            at.headers.forEach(function(I, F) {
              Y.setRequestHeader(F, I);
            });
          at.signal && (at.signal.addEventListener("abort", L), Y.onreadystatechange = function() {
            Y.readyState === 4 && at.signal.removeEventListener("abort", L);
          }), Y.send(typeof at._bodyInit > "u" ? null : at._bodyInit);
        });
      }
      return z.polyfill = !0, n.fetch || (n.fetch = z, n.Headers = d, n.Request = N, n.Response = nt), e.Headers = d, e.Request = N, e.Response = nt, e.fetch = z, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : rn);
})();
const rw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function sw(t, e) {
  const n = {};
  return Object.assign(n, rw, e), await fetch(t, n);
}
function iw(t) {
  let e = sw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ow(...t) {
  const { fetchLib: e, middlewares: n } = iw(t);
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
var Ti;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ti || (Ti = {}));
var Ms;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ms || (Ms = {}));
var Nf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Nf || (Nf = {}));
const aw = "https://api.mainnet.hiro.so", cw = "https://api.testnet.hiro.so", lw = "http://localhost:3999", uw = ["mainnet", "testnet", "devnet", "mocknet"];
let Bi = class {
  constructor(e) {
    this.version = Ms.Mainnet, this.chainId = Ti.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ms.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ow();
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
Bi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new fl();
    case "testnet":
      return new fw();
    case "devnet":
      return new dw();
    case "mocknet":
      return new h0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${uw.join(", ")}`);
  }
};
Bi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Bi.fromName(t);
let fl = class extends Bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? aw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ms.Mainnet, this.chainId = Ti.Mainnet;
  }
}, fw = class extends Bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ms.Testnet, this.chainId = Ti.Testnet;
  }
}, h0 = class extends Bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ms.Testnet, this.chainId = Ti.Testnet;
  }
};
const dw = h0, p0 = "xtrata.wallet.bridge.v1", hw = (t) => typeof t == "object" && t !== null && t.protocol === p0, pw = (t) => hw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", gw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class ro extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Pf = 12e4;
class yw {
  constructor(e) {
    no(this, "pending", /* @__PURE__ */ new Map());
    no(this, "listenTarget");
    no(this, "closed", !1);
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
    no(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !pw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new ro("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new ro("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ro("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = gw(), i = { protocol: p0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ro(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Pf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Pf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new ro("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const ww = ["SP", "SM"], bw = ["ST", "SN"], mw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return ww.includes(n) ? "mainnet" : bw.includes(n) ? "testnet" : null;
}, xw = () => {
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
}, Sw = () => typeof window > "u" || !window.localStorage ? xw() : window.localStorage, _c = "xtrata.v15.1.wallet.session", _f = "mainnet", Ca = { isConnected: !1 }, Ew = (t) => t.address ? mw(t.address) ?? t.network : t.network, g0 = (t) => !t.isConnected || !t.address ? { ...Ca } : Ew(t) !== _f ? { ...Ca } : {
  isConnected: !0,
  address: t.address,
  network: _f,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Aw = (t) => {
  if (!t)
    return { ...Ca };
  try {
    const e = JSON.parse(t);
    return g0(e);
  } catch {
    return { ...Ca };
  }
}, vw = (t) => {
  const e = g0(t);
  return JSON.stringify(e);
}, $w = (t) => {
  const e = Sw();
  return {
    load: () => Aw(e.getItem(_c)),
    save: (n) => {
      e.setItem(_c, vw(n));
    },
    clear: () => {
      e.removeItem(_c);
    }
  };
}, kw = "https://browser.blockstack.org/auth", Iw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, y0 = ["store_write"], Lw = "blockstack-session", Cw = {
  logLevel: "debug"
}, Ys = {
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
Object.freeze(Ys);
class Wi extends Error {
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
class Tw extends Wi {
  constructor(e, n = "") {
    super({ code: Ys.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Uf extends Wi {
  constructor(e = "") {
    super({ code: Ys.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class zo extends Wi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ys.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Hf extends Wi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ys.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class dl extends Wi {
  constructor(e) {
    super({ code: Ys.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class w0 extends Wi {
  constructor(e) {
    super({ code: Ys.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Of = ["debug", "info", "warn", "error", "none"], hl = {};
for (let t = 0; t < Of.length; t++) {
  const e = Of[t];
  hl[e] = t;
}
class Ei {
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
    return hl[Cw.logLevel] <= hl[e];
  }
}
function Bw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Mw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Uc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Nw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Pw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function _w(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function yu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Pw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Ei.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = _w(s, t.toString(), n);
    throw Ei.error(i), new Error(i);
  }
  if (r)
    return {};
}
function us(t, e) {
  return wu(Qe(t), e);
}
function Qe(t) {
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
  if (dn(t, Uint8Array))
    return BigInt(`0x${xt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Uw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Df(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Bo(t, e = 8) {
  return (typeof t == "bigint" ? t : Qe(t)).toString(16).padStart(e * 2, "0");
}
function sc(t) {
  return parseInt(t, 16);
}
function wu(t, e = 16) {
  const n = Bo(t, e);
  return Jt(n);
}
function Hw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Ow(t, e) {
  return t & BigInt(1) << e;
}
function pl(t) {
  return Dw(BigInt(`0x${xt(t)}`), BigInt(t.byteLength * 8));
}
function Dw(t, e) {
  return Ow(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Fw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function xt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Fw[n];
  return e;
}
function Jt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Uw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Zs(t) {
  return new TextEncoder().encode(t);
}
function Mo(t) {
  return new TextDecoder().decode(t);
}
function jw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function zw(t) {
  return String.fromCharCode.apply(null, t);
}
function Rw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ff(t) {
  if (t.some(Rw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
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
function _e(t) {
  return ar(...t.map((e) => typeof e == "number" ? Ff([e]) : e instanceof Array ? Ff(e) : e));
}
function dn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const b0 = "https://api.mainnet.hiro.so", m0 = "https://api.testnet.hiro.so", x0 = "http://localhost:3999", Gw = "https://hub.blockstack.org", Kw = 33, Hc = 32;
function Vw(t) {
  if (t.length < Hc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Hc * 2), r = t.slice(2 + Hc * 2);
  return {
    recoveryId: sc(e),
    r: n,
    s: r
  };
}
function bu(t) {
  const e = typeof t == "string" ? Jt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function qw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Ww(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Xw(t, e) {
  return t[e];
}
function Yw(t, e, n = 0) {
  return t[n] = e, t;
}
function Zw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ns(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Qw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Jw(t, e) {
  const n = {};
  return Object.assign(n, Qw, e), await fetch(t, n);
}
function tb(t) {
  let e = Jw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function eb(...t) {
  const { fetchLib: e, middlewares: n } = tb(t);
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
class S0 {
  constructor(e = y0.slice(), n = ((a) => (a = yu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = kw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function gl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function nb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function E0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function rb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  gl(t.outputLen), gl(t.blockLen);
}
function sb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ib(t, e) {
  E0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Es = {
  number: gl,
  bool: nb,
  bytes: E0,
  hash: rb,
  exists: sb,
  output: ib
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Oc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Wn = (t, e) => t << 32 - e | t >>> e, ob = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ob)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ab(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function mu(t) {
  if (typeof t == "string" && (t = ab(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let A0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Qs(t) {
  const e = (r) => t().update(mu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let v0 = class extends A0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Es.hash(e);
    const r = mu(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const ic = (t, e, n) => new v0(t, e).update(n).digest();
ic.create = (t, e) => new v0(t, e);
function cb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let xu = class extends A0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Oc(this.buffer);
  }
  update(e) {
    Es.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = mu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Oc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Es.exists(this), Es.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    cb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Oc(e), c = this.outputLen;
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
const lb = (t, e, n) => t & e ^ ~t & n, ub = (t, e, n) => t & e ^ t & n ^ e & n, fb = new Uint32Array([
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
]), Nr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Pr = new Uint32Array(64);
let $0 = class extends xu {
  constructor() {
    super(64, 32, 8, !1), this.A = Nr[0] | 0, this.B = Nr[1] | 0, this.C = Nr[2] | 0, this.D = Nr[3] | 0, this.E = Nr[4] | 0, this.F = Nr[5] | 0, this.G = Nr[6] | 0, this.H = Nr[7] | 0;
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
      Pr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Pr[l - 15], p = Pr[l - 2], E = Wn(y, 7) ^ Wn(y, 18) ^ y >>> 3, b = Wn(p, 17) ^ Wn(p, 19) ^ p >>> 10;
      Pr[l] = b + Pr[l - 7] + E + Pr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Wn(a, 6) ^ Wn(a, 11) ^ Wn(a, 25), p = d + y + lb(a, c, u) + fb[l] + Pr[l] | 0, b = (Wn(r, 2) ^ Wn(r, 13) ^ Wn(r, 22)) + ub(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Pr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, db = class extends $0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Mi = Qs(() => new $0());
Qs(() => new db());
const hb = {}, k0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: hb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Yt = BigInt(0), me = BigInt(1), is = BigInt(2), fo = BigInt(3), jf = BigInt(8), ce = Object.freeze({
  a: Yt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: me,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), zf = (t, e) => (t + e / is) / e, Ro = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ce, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -me * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = zf(i * t, e), c = zf(-r * t, e);
    let u = st(t - a * n - c * s, e), d = st(-a * r - c * i, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, Rn = 32, Ps = 32, I0 = 32, Ta = Rn + 1, Ba = 2 * Rn + 1;
function Rf(t) {
  const { a: e, b: n } = ce, r = st(t * t), s = st(r * t);
  return st(s + e * t + n);
}
const Go = ce.a === Yt;
class Su extends Error {
  constructor(e) {
    super(e);
  }
}
function Gf(t) {
  if (!(t instanceof ee))
    throw new TypeError("JacobianPoint expected");
}
class ee {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Rt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Rt.ZERO) ? ee.ZERO : new ee(e.x, e.y, me);
  }
  static toAffineBatch(e) {
    const n = bb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ee.toAffineBatch(e).map(ee.fromAffine);
  }
  equals(e) {
    Gf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = st(s * s), u = st(a * a), d = st(n * u), l = st(i * c), y = st(st(r * a) * u), p = st(st(o * s) * c);
    return d === l && y === p;
  }
  negate() {
    return new ee(this.x, st(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = st(e * e), i = st(n * n), o = st(i * i), a = e + i, c = st(is * (st(a * a) - s - o)), u = st(fo * s), d = st(u * u), l = st(d - is * c), y = st(u * (c - l) - jf * o), p = st(is * n * r);
    return new ee(l, y, p);
  }
  add(e) {
    Gf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Yt || o === Yt)
      return this;
    if (n === Yt || r === Yt)
      return e;
    const c = st(s * s), u = st(a * a), d = st(n * u), l = st(i * c), y = st(st(r * a) * u), p = st(st(o * s) * c), E = st(l - d), b = st(p - y);
    if (E === Yt)
      return b === Yt ? this.double() : ee.ZERO;
    const T = st(E * E), W = st(E * T), X = st(d * T), S = st(b * b - W - is * X), N = st(b * (X - S) - y * W), B = st(s * a * E);
    return new ee(S, N, B);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ee.ZERO;
    if (typeof e == "bigint" && e === Yt)
      return n;
    let r = qf(e);
    if (r === me)
      return this;
    if (!Go) {
      let l = n, y = this;
      for (; r > Yt; )
        r & me && (l = l.add(y)), y = y.double(), r >>= me;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Ro.splitScalar(r), c = n, u = n, d = this;
    for (; i > Yt || a > Yt; )
      i & me && (c = c.add(d)), a & me && (u = u.add(d)), d = d.double(), i >>= me, a >>= me;
    return s && (c = c.negate()), o && (u = u.negate()), u = new ee(st(u.x * Ro.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Go ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(ee.BASE) && (n = Rt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && yl.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ee.normalizeZ(s), yl.set(n, s)));
    let i = ee.ZERO, o = ee.BASE;
    const a = 1 + (Go ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const p = y * c;
      let E = Number(e & u);
      e >>= l, E > c && (E -= d, e += me);
      const b = p, T = p + Math.abs(E) - 1, W = y % 2 !== 0, X = E < 0;
      E === 0 ? o = o.add(Ko(W, s[b])) : i = i.add(Ko(X, s[T]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = qf(e), s, i;
    if (Go) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Ro.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: p } = this.wNAF(u, n);
      d = Ko(o, d), y = Ko(c, y), y = new ee(st(y.x * Ro.beta), y.y, y.z), s = d.add(y), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ee.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ee.ZERO);
    e == null && (e = i ? jf : Xi(s));
    const o = e, a = st(o * o), c = st(a * o), u = st(n * a), d = st(r * c), l = st(s * o);
    if (i)
      return Rt.ZERO;
    if (l !== me)
      throw new Error("invZ was invalid");
    return new Rt(u, d);
  }
}
ee.BASE = new ee(ce.Gx, ce.Gy, me);
ee.ZERO = new ee(Yt, me, Yt);
function Ko(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const yl = /* @__PURE__ */ new WeakMap();
class Rt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, yl.delete(this);
  }
  hasEvenY() {
    return this.y % is === Yt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = En(n ? e : e.subarray(1));
    if (!xa(r))
      throw new Error("Point is not on curve");
    const s = Rf(r);
    let i = wb(s);
    const o = (i & me) === me;
    n ? o && (i = st(-i)) : (e[0] & 1) === 1 !== o && (i = st(-i));
    const a = new Rt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = En(e.subarray(1, Rn + 1)), r = En(e.subarray(Rn + 1, Rn * 2 + 1)), s = new Rt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = cr(e), r = n.length, s = n[0];
    if (r === Rn)
      return this.fromCompressedHex(n);
    if (r === Ta && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Ba && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ta} compressed bytes or ${Ba} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Rt.BASE.multiply(_s(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = T0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Eu(cr(e)), { n: a } = ce, c = r === 2 || r === 3 ? s + a : s, u = Xi(c, a), d = st(-o * u, a), l = st(i * u, a), y = r & 1 ? "03" : "02", p = Rt.fromHex(y + os(c)), E = Rt.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!E)
      throw new Error("Cannot recover signature: point at infinify");
    return E.assertValidity(), E;
  }
  toRawBytes(e = !1) {
    return as(this.toHex(e));
  }
  toHex(e = !1) {
    const n = os(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${os(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!xa(n) || !xa(r))
      throw new Error(e);
    const s = st(r * r), i = Rf(n);
    if (st(s - i) !== Yt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Rt(this.x, st(-this.y));
  }
  double() {
    return ee.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ee.fromAffine(this).add(ee.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ee.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = ee.fromAffine(this), i = n === Yt || n === me || this !== Rt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ee.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ee.ZERO) ? void 0 : a.toAffine();
  }
}
Rt.BASE = new Rt(ce.Gx, ce.Gy);
Rt.ZERO = new Rt(Yt, Yt);
function Kf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Vf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ni(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: En(n), left: t.subarray(e + 2) };
}
function pb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ni(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Vf(t.subarray(2)), { data: r, left: s } = Vf(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ni(s)}`);
  return { r: e, s: r };
}
class Sn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Ni(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Sn(Ma(s.slice(0, 64)), Ma(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = pb(n ? e : as(e));
    return new Sn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!_i(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!_i(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ce.n >> me;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Sn(this.r, st(-this.s, ce.n)) : this;
  }
  toDERRawBytes() {
    return as(this.toDERHex());
  }
  toDERHex() {
    const e = Kf(so(this.s)), n = Kf(so(this.r)), r = e.length / 2, s = n.length / 2, i = so(r), o = so(s);
    return `30${so(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return as(this.toCompactHex());
  }
  toCompactHex() {
    return os(this.r) + os(this.s);
  }
}
function rs(...t) {
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
const gb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ni(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += gb[t[n]];
  return e;
}
const yb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function os(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Yt <= t && t < yb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Pi(t) {
  const e = as(os(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function so(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ma(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function as(t) {
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
function En(t) {
  return Ma(Ni(t));
}
function cr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : as(t);
}
function qf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && _i(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function st(t, e = ce.P) {
  const n = t % e;
  return n >= Yt ? n : e + n;
}
function $n(t, e) {
  const { P: n } = ce;
  let r = t;
  for (; e-- > Yt; )
    r *= r, r %= n;
  return r;
}
function wb(t) {
  const { P: e } = ce, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = $n(u, fo) * u % e, l = $n(d, fo) * u % e, y = $n(l, is) * c % e, p = $n(y, r) * y % e, E = $n(p, s) * p % e, b = $n(E, o) * E % e, T = $n(b, a) * b % e, W = $n(T, o) * E % e, X = $n(W, fo) * u % e, S = $n(X, i) * p % e, N = $n(S, n) * c % e, B = $n(N, is);
  if (B * B % e !== t)
    throw new Error("Cannot find square root");
  return B;
}
function Xi(t, e = ce.P) {
  if (t === Yt || e <= Yt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = st(t, e), r = e, s = Yt, i = me;
  for (; n !== Yt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== me)
    throw new Error("invert: does not exist");
  return st(s, e);
}
function bb(t, e = ce.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Yt ? i : (n[a] = i, st(i * o, e)), me), s = Xi(r, e);
  return t.reduceRight((i, o, a) => o === Yt ? i : (n[a] = st(i * n[a], e), st(i * o, e)), s), n;
}
function mb(t) {
  const e = t.length * 8 - Ps * 8, n = En(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Eu(t, e = !1) {
  const n = mb(t);
  if (e)
    return n;
  const { n: r } = ce;
  return n >= r ? n - r : n;
}
let Li, ho;
class L0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Me.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ho(this.k, ...e);
  }
  checkSync() {
    if (typeof ho != "function")
      throw new Su("hmacSha256Sync needs to be set");
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
    return rs(...n);
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
    return rs(...n);
  }
}
function _i(t) {
  return Yt < t && t < ce.n;
}
function xa(t) {
  return Yt < t && t < ce.P;
}
function C0(t, e, n, r = !0) {
  const { n: s } = ce, i = Eu(t, !0);
  if (!_i(i))
    return;
  const o = Xi(i, s), a = Rt.BASE.multiply(i), c = st(a.x, s);
  if (c === Yt)
    return;
  const u = st(o * st(e + n * c, s), s);
  if (u === Yt)
    return;
  let d = new Sn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & me);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function _s(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ps)
      throw new Error("Expected 32 bytes of private key");
    e = Ma(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ps)
      throw new Error("Expected 32 bytes of private key");
    e = En(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!_i(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Au(t) {
  return t instanceof Rt ? (t.assertValidity(), t) : Rt.fromHex(t);
}
function T0(t) {
  if (t instanceof Sn)
    return t.assertValidity(), t;
  try {
    return Sn.fromDER(t);
  } catch {
    return Sn.fromCompact(t);
  }
}
function No(t, e = !1) {
  return Rt.fromPrivateKey(t).toRawBytes(e);
}
function xb(t, e, n, r = !1) {
  return Rt.fromSignature(t, e, n).toRawBytes(r);
}
function Wf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ta || r === Ba : n ? r === Ta * 2 || r === Ba * 2 : t instanceof Rt;
}
function vu(t, e, n = !1) {
  if (Wf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Wf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Au(e);
  return r.assertValidity(), r.multiply(_s(t)).toRawBytes(n);
}
function B0(t) {
  const e = t.length > Rn ? t.slice(0, Rn) : t;
  return En(e);
}
function Sb(t) {
  const e = B0(t), n = st(e, ce.n);
  return M0(n < Yt ? e : n);
}
function M0(t) {
  return Pi(t);
}
function N0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = cr(t), s = _s(e), i = [M0(s), Sb(r)];
  if (n != null) {
    n === !0 && (n = Me.randomBytes(Rn));
    const c = cr(n);
    if (c.length !== Rn)
      throw new Error(`sign: Expected ${Rn} bytes of extra data`);
    i.push(c);
  }
  const o = rs(...i), a = B0(r);
  return { seed: o, m: a, d: s };
}
function P0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Eb(t, e, n = {}) {
  const { seed: r, m: s, d: i } = N0(t, e, n.extraEntropy), o = new L0(I0, Ps);
  await o.reseed(r);
  let a;
  for (; !(a = C0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return P0(a, n);
}
function oc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = N0(t, e, n.extraEntropy), o = new L0(I0, Ps);
  o.reseedSync(r);
  let a;
  for (; !(a = C0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return P0(a, n);
}
const Ab = { strict: !0 };
function vb(t, e, n, r = Ab) {
  let s;
  try {
    s = T0(t), e = cr(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Eu(e);
  let c;
  try {
    c = Au(n);
  } catch {
    return !1;
  }
  const { n: u } = ce, d = Xi(o, u), l = st(a * d, u), y = st(i * d, u), p = Rt.BASE.multiplyAndAddUnsafe(c, l, y);
  return p ? st(p.x, u) === i : !1;
}
function Na(t) {
  return st(En(t), ce.n);
}
class Ui {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = cr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = En(n.subarray(0, 32)), s = En(n.subarray(32, 64));
    return new Ui(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!xa(e) || !_i(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return os(this.r) + os(this.s);
  }
  toRawBytes() {
    return as(this.toHex());
  }
}
function $b(t) {
  return Rt.fromPrivateKey(t).toRawX();
}
class _0 {
  constructor(e, n, r = Me.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = cr(e);
    const { x: s, scalar: i } = this.getScalar(_s(n));
    if (this.px = s, this.d = i, this.rand = cr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Rt.fromPrivateKey(e), r = n.hasEvenY() ? e : ce.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Pi(e ^ En(n));
  }
  finalizeNonce(e) {
    const n = st(En(e), ce.n);
    if (n === Yt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Ui(e.x, st(n + r * s, ce.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Me.taggedHash, o = this.initNonce(n, await i(ns.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(ns.nonce, o, r, e)), d = Na(await i(ns.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await O0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Me.taggedHashSync, o = this.initNonce(n, i(ns.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(ns.nonce, o, r, e)), d = Na(i(ns.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return D0(l, e, r) || this.error(), l;
  }
}
async function kb(t, e, n) {
  return new _0(t, e, n).calc();
}
function Ib(t, e, n) {
  return new _0(t, e, n).calcSync();
}
function U0(t, e, n) {
  const r = t instanceof Ui, s = r ? t : Ui.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: cr(e),
    P: Au(n)
  };
}
function H0(t, e, n, r) {
  const s = Rt.BASE.multiplyAndAddUnsafe(e, _s(n), st(-r, ce.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function O0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = U0(t, e, n), a = Na(await Me.taggedHash(ns.challenge, Pi(r), o.toRawX(), i));
    return H0(r, o, s, a);
  } catch {
    return !1;
  }
}
function D0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = U0(t, e, n), a = Na(Me.taggedHashSync(ns.challenge, Pi(r), o.toRawX(), i));
    return H0(r, o, s, a);
  } catch (r) {
    if (r instanceof Su)
      throw r;
    return !1;
  }
}
const Lb = {
  Signature: Ui,
  getPublicKey: $b,
  sign: kb,
  verify: O0,
  signSync: Ib,
  verifySync: D0
};
Rt.BASE._setWindowSize(8);
const gn = {
  node: k0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ns = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Vo = {}, Me = {
  bytesToHex: Ni,
  hexToBytes: as,
  concatBytes: rs,
  mod: st,
  invert: Xi,
  isValidPrivateKey(t) {
    try {
      return _s(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Pi,
  _normalizePrivateKey: _s,
  hashToPrivateKey: (t) => {
    t = cr(t);
    const e = Ps + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = st(En(t), ce.n - me) + me;
    return Pi(n);
  },
  randomBytes: (t = 32) => {
    if (gn.web)
      return gn.web.getRandomValues(new Uint8Array(t));
    if (gn.node) {
      const { randomBytes: e } = gn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Me.hashToPrivateKey(Me.randomBytes(Ps + 8)),
  precompute(t = 8, e = Rt.BASE) {
    const n = e === Rt.BASE ? e : new Rt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(fo), n;
  },
  sha256: async (...t) => {
    if (gn.web) {
      const e = await gn.web.subtle.digest("SHA-256", rs(...t));
      return new Uint8Array(e);
    } else if (gn.node) {
      const { createHash: e } = gn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (gn.web) {
      const n = await gn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = rs(...e), s = await gn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (gn.node) {
      const { createHmac: n } = gn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Vo[t];
    if (n === void 0) {
      const r = await Me.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = rs(r, r), Vo[t] = n;
    }
    return Me.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Li != "function")
      throw new Su("sha256Sync is undefined, you need to set it");
    let n = Vo[t];
    if (n === void 0) {
      const r = Li(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = rs(r, r), Vo[t] = n;
    }
    return Li(n, ...e);
  },
  _JacobianPoint: ee
};
Object.defineProperties(Me, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Li;
    },
    set(t) {
      Li || (Li = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ho;
    },
    set(t) {
      ho || (ho = t);
    }
  }
});
const Cb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ce,
  Point: Rt,
  Signature: Sn,
  getPublicKey: No,
  getSharedSecret: vu,
  recoverPublicKey: xb,
  schnorr: Lb,
  sign: Eb,
  signSync: oc,
  utils: Me,
  verify: vb
}, Symbol.toStringTag, { value: "Module" }));
var Po = {};
Po.byteLength = Pb;
var Tb = Po.toByteArray = Ub, Bb = Po.fromByteArray = Db, tr = [], Ln = [], Mb = typeof Uint8Array < "u" ? Uint8Array : Array, Dc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var yi = 0, Nb = Dc.length; yi < Nb; ++yi)
  tr[yi] = Dc[yi], Ln[Dc.charCodeAt(yi)] = yi;
Ln[45] = 62;
Ln[95] = 63;
function F0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Pb(t) {
  var e = F0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function _b(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Ub(t) {
  var e, n = F0(t), r = n[0], s = n[1], i = new Mb(_b(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Ln[t.charCodeAt(c)] << 18 | Ln[t.charCodeAt(c + 1)] << 12 | Ln[t.charCodeAt(c + 2)] << 6 | Ln[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Ln[t.charCodeAt(c)] << 2 | Ln[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Ln[t.charCodeAt(c)] << 10 | Ln[t.charCodeAt(c + 1)] << 4 | Ln[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Hb(t) {
  return tr[t >> 18 & 63] + tr[t >> 12 & 63] + tr[t >> 6 & 63] + tr[t & 63];
}
function Ob(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Hb(r));
  return s.join("");
}
function Db(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Ob(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    tr[e >> 2] + tr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    tr[e >> 10] + tr[e >> 4 & 63] + tr[e << 2 & 63] + "="
  )), s.join("");
}
function Fb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const jb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function zb() {
  if (Fb())
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
    throw new Error(jb);
  }
}
class Rb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(ar(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(ar(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Gb {
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
async function j0() {
  const t = await zb();
  return t.name === "subtleCrypto" ? new Gb(t.lib) : new Rb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Kb(t) {
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
    for (var E = 0, b = 0, T = 0, W = p.length; T !== W && p[T] === 0; )
      T++, E++;
    for (var X = (W - T) * u + 1 >>> 0, S = new Uint8Array(X); T !== W; ) {
      for (var N = p[T], B = 0, J = X - 1; (N !== 0 || B < b) && J !== -1; J--, B++)
        N += 256 * S[J] >>> 0, S[J] = N % o >>> 0, N = N / o >>> 0;
      if (N !== 0)
        throw new Error("Non-zero carry");
      b = B, T++;
    }
    for (var nt = X - b; nt !== X && S[nt] === 0; )
      nt++;
    for (var K = a.repeat(E); nt < X; ++nt)
      K += t.charAt(S[nt]);
    return K;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var E = 0, b = 0, T = 0; p[E] === a; )
      b++, E++;
    for (var W = (p.length - E) * c + 1 >>> 0, X = new Uint8Array(W); p[E]; ) {
      var S = p.charCodeAt(E);
      if (S > 255)
        return;
      var N = e[S];
      if (N === 255)
        return;
      for (var B = 0, J = W - 1; (N !== 0 || B < T) && J !== -1; J--, B++)
        N += o * X[J] >>> 0, X[J] = N % 256 >>> 0, N = N / 256 >>> 0;
      if (N !== 0)
        throw new Error("Non-zero carry");
      T = B, E++;
    }
    for (var nt = W - T; nt !== W && X[nt] === 0; )
      nt++;
    for (var K = new Uint8Array(b + (W - nt)), z = b; nt !== W; )
      K[z++] = X[nt++];
    return K;
  }
  function y(p) {
    var E = l(p);
    if (E)
      return E;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: y
  };
}
var z0 = Kb;
const Vb = z0, qb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Wb = Vb(qb);
const Xb = /* @__PURE__ */ d0(Wb), Yb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), R0 = Uint8Array.from({ length: 16 }, (t, e) => e), Zb = R0.map((t) => (9 * t + 5) % 16);
let $u = [R0], ku = [Zb];
for (let t = 0; t < 4; t++)
  for (let e of [$u, ku])
    e.push(e[t].map((n) => Yb[n]));
const G0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Qb = $u.map((t, e) => t.map((n) => G0[e][n])), Jb = ku.map((t, e) => t.map((n) => G0[e][n])), tm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), em = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qo = (t, e) => t << e | t >>> 32 - e;
function Xf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Wo = new Uint32Array(16);
let nm = class extends xu {
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
      Wo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, b = tm[p], T = em[p], W = $u[p], X = ku[p], S = Qb[p], N = Jb[p];
      for (let B = 0; B < 16; B++) {
        const J = qo(r + Xf(p, i, a, u) + Wo[W[B]] + b, S[B]) + l | 0;
        r = l, l = u, u = qo(a, 10) | 0, a = i, i = J;
      }
      for (let B = 0; B < 16; B++) {
        const J = qo(s + Xf(E, o, c, d) + Wo[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = qo(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Wo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const rm = Qs(() => new nm());
function sm(t) {
  return rm(t);
}
const Xo = BigInt(2 ** 32 - 1), wl = BigInt(32);
function K0(t, e = !1) {
  return e ? { h: Number(t & Xo), l: Number(t >> wl & Xo) } : { h: Number(t >> wl & Xo) | 0, l: Number(t & Xo) | 0 };
}
function im(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = K0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const om = (t, e) => BigInt(t >>> 0) << wl | BigInt(e >>> 0), am = (t, e, n) => t >>> n, cm = (t, e, n) => t << 32 - n | e >>> n, lm = (t, e, n) => t >>> n | e << 32 - n, um = (t, e, n) => t << 32 - n | e >>> n, fm = (t, e, n) => t << 64 - n | e >>> n - 32, dm = (t, e, n) => t >>> n - 32 | e << 64 - n, hm = (t, e) => e, pm = (t, e) => t, gm = (t, e, n) => t << n | e >>> 32 - n, ym = (t, e, n) => e << n | t >>> 32 - n, wm = (t, e, n) => e << n - 32 | t >>> 64 - n, bm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function mm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const xm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Sm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Em = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Am = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, vm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), $m = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: K0,
  split: im,
  toBig: om,
  shrSH: am,
  shrSL: cm,
  rotrSH: lm,
  rotrSL: um,
  rotrBH: fm,
  rotrBL: dm,
  rotr32H: hm,
  rotr32L: pm,
  rotlSH: gm,
  rotlSL: ym,
  rotlBH: wm,
  rotlBL: bm,
  add: mm,
  add3L: xm,
  add3H: Sm,
  add4L: Em,
  add4H: Am,
  add5H: $m,
  add5L: vm
}, [km, Im] = Pt.split([
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
].map((t) => BigInt(t))), _r = new Uint32Array(80), Ur = new Uint32Array(80);
let ac = class extends xu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: E, Hh: b, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = b | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      _r[S] = e.getUint32(n), Ur[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = _r[S - 15] | 0, B = Ur[S - 15] | 0, J = Pt.rotrSH(N, B, 1) ^ Pt.rotrSH(N, B, 8) ^ Pt.shrSH(N, B, 7), nt = Pt.rotrSL(N, B, 1) ^ Pt.rotrSL(N, B, 8) ^ Pt.shrSL(N, B, 7), K = _r[S - 2] | 0, z = Ur[S - 2] | 0, A = Pt.rotrSH(K, z, 19) ^ Pt.rotrBH(K, z, 61) ^ Pt.shrSH(K, z, 6), P = Pt.rotrSL(K, z, 19) ^ Pt.rotrBL(K, z, 61) ^ Pt.shrSL(K, z, 6), M = Pt.add4L(nt, P, Ur[S - 7], Ur[S - 16]), q = Pt.add4H(M, J, A, _r[S - 7], _r[S - 16]);
      _r[S] = q | 0, Ur[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: E, Gh: b, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = Pt.rotrSH(l, y, 14) ^ Pt.rotrSH(l, y, 18) ^ Pt.rotrBH(l, y, 41), B = Pt.rotrSL(l, y, 14) ^ Pt.rotrSL(l, y, 18) ^ Pt.rotrBL(l, y, 41), J = l & p ^ ~l & b, nt = y & E ^ ~y & T, K = Pt.add5L(X, B, nt, Im[S], Ur[S]), z = Pt.add5H(K, W, N, J, km[S], _r[S]), A = K | 0, P = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), M = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, at = s & o ^ s & c ^ o & c;
      W = b | 0, X = T | 0, b = p | 0, T = E | 0, p = l | 0, E = y | 0, { h: l, l: y } = Pt.add(u | 0, d | 0, z | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = Pt.add3L(A, M, at);
      r = Pt.add3H(Y, z, P, q), s = Y | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Pt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: E } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: b, l: T } = Pt.add(this.Gh | 0, this.Gl | 0, b | 0, T | 0), { h: W, l: X } = Pt.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, E, b, T, W, X);
  }
  roundClean() {
    _r.fill(0), Ur.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Lm = class extends ac {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Cm = class extends ac {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Tm = class extends ac {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Bm = Qs(() => new ac());
Qs(() => new Lm());
Qs(() => new Cm());
Qs(() => new Tm());
function V0(t) {
  return Mi(t);
}
function Mm(t) {
  return Bm(t);
}
const Nm = 0;
Me.hmacSha256Sync = (t, ...e) => {
  const n = ic.create(Mi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Pm() {
  return xt(Me.randomPrivateKey());
}
function _m(t) {
  const e = Mi(Mi(t));
  return Xb.encode(ar(t, e).slice(0, t.length + 4));
}
function Um(t, e) {
  return _m(ar(new Uint8Array([t]), e.slice(0, 20)));
}
function q0(t, e = Nm) {
  const n = typeof t == "string" ? Jt(t) : t, r = sm(V0(n));
  return Um(e, r);
}
function W0(t) {
  const e = bu(t);
  return xt(No(e.slice(0, 32), !0));
}
Me.hmacSha256Sync = (t, ...e) => {
  const n = ic.create(Mi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Pa;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Pa || (Pa = {}));
async function Hm(t, e, n) {
  return await (await j0()).encrypt("aes-256-cbc", e, t, n);
}
async function Om(t, e, n) {
  return await (await j0()).decrypt("aes-256-cbc", e, t, n);
}
function X0(t, e) {
  return ic(Mi, t, e);
}
function Dm(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Y0(t) {
  const e = Mm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Fm(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function jm(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Pa.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Pa.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Fm(t))
    return e;
  try {
    return Rt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function zm(t, e, n, r) {
  const s = jm(t);
  if (!s.result)
    throw s;
  const i = Me.randomPrivateKey(), o = No(i, !0);
  let a = vu(i, t, !0);
  a = a.slice(1);
  const c = Y0(a), u = Me.randomBytes(16), d = await Hm(u, c.encryptionKey, e), l = ar(u, o, d), y = X0(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = xt(d);
  else if (r === "base64")
    p = Bb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const E = {
    iv: xt(u),
    ephemeralPK: xt(o),
    cipherText: p,
    mac: xt(y),
    wasString: n
  };
  return r && r !== "hex" && (E.cipherTextEncoding = r), E;
}
async function Z0(t, e) {
  if (!e.ephemeralPK)
    throw new Hf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = vu(t, n, !0);
  r = r.slice(1);
  const s = Y0(r), i = Jt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Jt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Tb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ar(i, Jt(n), o), c = X0(s.hmacKey, a), u = Jt(e.mac);
  if (!Dm(u, c))
    throw new Hf("Decryption failed: failure in MAC check");
  const d = await Om(i, s.encryptionKey, o);
  return e.wasString ? Mo(d) : d;
}
function Rm(t, e) {
  const n = typeof e == "string" ? Zs(e) : e, r = W0(t), s = V0(n), i = oc(s, t);
  return {
    signature: xt(i),
    publicKey: r
  };
}
async function Gm(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = W0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Zs(t) : t, o = await zm(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Rm(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Km(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Z0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Xe = {}, Hi = {}, en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
en.decode = en.encode = en.unescape = en.escape = en.pad = void 0;
const Q0 = Po;
function Iu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
en.pad = Iu;
function J0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
en.escape = J0;
function tp(t) {
  return Iu(t).replace(/-/g, "+").replace(/_/g, "/");
}
en.unescape = tp;
function Vm(t) {
  return J0((0, Q0.fromByteArray)(new TextEncoder().encode(t)));
}
en.encode = Vm;
function qm(t) {
  return new TextDecoder().decode((0, Q0.toByteArray)(Iu(tp(t))));
}
en.decode = qm;
var cc = {}, lc = {}, ep = {}, np = {}, uc = {};
Object.defineProperty(uc, "__esModule", { value: !0 });
uc.crypto = void 0;
uc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = p, t.byteSwap = E, t.byteSwap32 = b, t.bytesToHex = X, t.hexToBytes = B, t.asyncLoop = nt, t.utf8ToBytes = K, t.bytesToUtf8 = z, t.toBytes = A, t.kdfInputToBytes = P, t.concatBytes = M, t.checkOpts = q, t.createHasher = Y, t.createOptHasher = L, t.createXOFer = rt, t.randomBytes = Zt;
  const e = uc;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function s(I, ...F) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (F.length > 0 && !F.includes(I.length))
      throw new Error("Uint8Array expected of length " + F + ", got length=" + I.length);
  }
  function i(I) {
    if (typeof I != "function" || typeof I.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(I.outputLen), r(I.blockLen);
  }
  function o(I, F = !0) {
    if (I.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (F && I.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(I, F) {
    s(I);
    const St = F.outputLen;
    if (I.length < St)
      throw new Error("digestInto() expects output buffer of length at least " + St);
  }
  function c(I) {
    return new Uint8Array(I.buffer, I.byteOffset, I.byteLength);
  }
  function u(I) {
    return new Uint32Array(I.buffer, I.byteOffset, Math.floor(I.byteLength / 4));
  }
  function d(...I) {
    for (let F = 0; F < I.length; F++)
      I[F].fill(0);
  }
  function l(I) {
    return new DataView(I.buffer, I.byteOffset, I.byteLength);
  }
  function y(I, F) {
    return I << 32 - F | I >>> F;
  }
  function p(I, F) {
    return I << F | I >>> 32 - F >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function E(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (I) => I : (I) => E(I), t.byteSwapIfBE = t.swap8IfBE;
  function b(I) {
    for (let F = 0; F < I.length; F++)
      I[F] = E(I[F]);
    return I;
  }
  t.swap32IfBE = t.isLE ? (I) => I : b;
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", W = /* @__PURE__ */ Array.from({ length: 256 }, (I, F) => F.toString(16).padStart(2, "0"));
  function X(I) {
    if (s(I), T)
      return I.toHex();
    let F = "";
    for (let St = 0; St < I.length; St++)
      F += W[I[St]];
    return F;
  }
  const S = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function N(I) {
    if (I >= S._0 && I <= S._9)
      return I - S._0;
    if (I >= S.A && I <= S.F)
      return I - (S.A - 10);
    if (I >= S.a && I <= S.f)
      return I - (S.a - 10);
  }
  function B(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (T)
      return Uint8Array.fromHex(I);
    const F = I.length, St = F / 2;
    if (F % 2)
      throw new Error("hex string expected, got unpadded hex of length " + F);
    const Nt = new Uint8Array(St);
    for (let Tt = 0, Qt = 0; Tt < St; Tt++, Qt += 2) {
      const ie = N(I.charCodeAt(Qt)), m = N(I.charCodeAt(Qt + 1));
      if (ie === void 0 || m === void 0) {
        const H = I[Qt] + I[Qt + 1];
        throw new Error('hex string expected, got non-hex character "' + H + '" at index ' + Qt);
      }
      Nt[Tt] = ie * 16 + m;
    }
    return Nt;
  }
  const J = async () => {
  };
  t.nextTick = J;
  async function nt(I, F, St) {
    let Nt = Date.now();
    for (let Tt = 0; Tt < I; Tt++) {
      St(Tt);
      const Qt = Date.now() - Nt;
      Qt >= 0 && Qt < F || (await (0, t.nextTick)(), Nt += Qt);
    }
  }
  function K(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function z(I) {
    return new TextDecoder().decode(I);
  }
  function A(I) {
    return typeof I == "string" && (I = K(I)), s(I), I;
  }
  function P(I) {
    return typeof I == "string" && (I = K(I)), s(I), I;
  }
  function M(...I) {
    let F = 0;
    for (let Nt = 0; Nt < I.length; Nt++) {
      const Tt = I[Nt];
      s(Tt), F += Tt.length;
    }
    const St = new Uint8Array(F);
    for (let Nt = 0, Tt = 0; Nt < I.length; Nt++) {
      const Qt = I[Nt];
      St.set(Qt, Tt), Tt += Qt.length;
    }
    return St;
  }
  function q(I, F) {
    if (F !== void 0 && {}.toString.call(F) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, F);
  }
  class at {
  }
  t.Hash = at;
  function Y(I) {
    const F = (Nt) => I().update(A(Nt)).digest(), St = I();
    return F.outputLen = St.outputLen, F.blockLen = St.blockLen, F.create = () => I(), F;
  }
  function L(I) {
    const F = (Nt, Tt) => I(Tt).update(A(Nt)).digest(), St = I({});
    return F.outputLen = St.outputLen, F.blockLen = St.blockLen, F.create = (Nt) => I(Nt), F;
  }
  function rt(I) {
    const F = (Nt, Tt) => I(Tt).update(A(Nt)).digest(), St = I({});
    return F.outputLen = St.outputLen, F.blockLen = St.blockLen, F.create = (Nt) => I(Nt), F;
  }
  t.wrapConstructor = Y, t.wrapConstructorWithOpts = L, t.wrapXOFConstructorWithOpts = rt;
  function Zt(I = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(I));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(np);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = np;
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
})(ep);
const wi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function rp(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function bl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Js(t, ...e) {
  if (!rp(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Wm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  bl(t.outputLen), bl(t.blockLen);
}
function ml(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sp(t, e) {
  Js(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Xm(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Ym(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function _a(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Sa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function On(t, e) {
  return t << 32 - e | t >>> e;
}
function Zm(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Lu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Cu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const ip = Lu ? (t) => t : (t) => Cu(t), Qm = ip;
function op(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Cu(t[e]);
  return t;
}
const Jm = Lu ? (t) => t : op, ap = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", t1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cp(t) {
  if (Js(t), ap)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += t1[t[n]];
  return e;
}
const br = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Yf(t) {
  if (t >= br._0 && t <= br._9)
    return t - br._0;
  if (t >= br.A && t <= br.F)
    return t - (br.A - 10);
  if (t >= br.a && t <= br.f)
    return t - (br.a - 10);
}
function e1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (ap)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Yf(t.charCodeAt(i)), a = Yf(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const lp = async () => {
};
async function n1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await lp(), r += i);
  }
}
function Tu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function r1(t) {
  return new TextDecoder().decode(t);
}
function _o(t) {
  return typeof t == "string" && (t = Tu(t)), Js(t), t;
}
function s1(t) {
  return typeof t == "string" && (t = Tu(t)), Js(t), t;
}
function i1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Js(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function o1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let up = class {
};
function fc(t) {
  const e = (r) => t().update(_o(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function fp(t) {
  const e = (r, s) => t(s).update(_o(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function dp(t) {
  const e = (r, s) => t(s).update(_o(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const a1 = fc, c1 = fp, l1 = dp;
function u1(t = 32) {
  if (wi && typeof wi.getRandomValues == "function")
    return wi.getRandomValues(new Uint8Array(t));
  if (wi && typeof wi.randomBytes == "function")
    return Uint8Array.from(wi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const f1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: up,
  abytes: Js,
  aexists: ml,
  ahash: Wm,
  anumber: bl,
  aoutput: sp,
  asyncLoop: n1,
  byteSwap: Cu,
  byteSwap32: op,
  byteSwapIfBE: Qm,
  bytesToHex: cp,
  bytesToUtf8: r1,
  checkOpts: o1,
  clean: _a,
  concatBytes: i1,
  createHasher: fc,
  createOptHasher: fp,
  createView: Sa,
  createXOFer: dp,
  hexToBytes: e1,
  isBytes: rp,
  isLE: Lu,
  kdfInputToBytes: s1,
  nextTick: lp,
  randomBytes: u1,
  rotl: Zm,
  rotr: On,
  swap32IfBE: Jm,
  swap8IfBE: ip,
  toBytes: _o,
  u32: Ym,
  u8: Xm,
  utf8ToBytes: Tu,
  wrapConstructor: a1,
  wrapConstructorWithOpts: c1,
  wrapXOFConstructorWithOpts: l1
}, Symbol.toStringTag, { value: "Module" }));
function d1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function h1(t, e, n) {
  return t & e ^ ~t & n;
}
function p1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class g1 extends up {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Sa(this.buffer);
  }
  update(e) {
    ml(this), e = _o(e), Js(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Sa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ml(this), sp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, _a(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    d1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Sa(e), c = this.outputLen;
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
const Hr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Or = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), y1 = /* @__PURE__ */ Uint32Array.from([
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
]), Dr = /* @__PURE__ */ new Uint32Array(64);
let Bu = class extends g1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Hr[0] | 0, this.B = Hr[1] | 0, this.C = Hr[2] | 0, this.D = Hr[3] | 0, this.E = Hr[4] | 0, this.F = Hr[5] | 0, this.G = Hr[6] | 0, this.H = Hr[7] | 0;
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
      Dr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Dr[l - 15], p = Dr[l - 2], E = On(y, 7) ^ On(y, 18) ^ y >>> 3, b = On(p, 17) ^ On(p, 19) ^ p >>> 10;
      Dr[l] = b + Dr[l - 7] + E + Dr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = On(a, 6) ^ On(a, 11) ^ On(a, 25), p = d + y + h1(a, c, u) + y1[l] + Dr[l] | 0, b = (On(r, 2) ^ On(r, 13) ^ On(r, 22)) + p1(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    _a(Dr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), _a(this.buffer);
  }
}, hp = class extends Bu {
  constructor() {
    super(28), this.A = Or[0] | 0, this.B = Or[1] | 0, this.C = Or[2] | 0, this.D = Or[3] | 0, this.E = Or[4] | 0, this.F = Or[5] | 0, this.G = Or[6] | 0, this.H = Or[7] | 0;
  }
};
const w1 = /* @__PURE__ */ fc(() => new Bu()), b1 = /* @__PURE__ */ fc(() => new hp()), m1 = Bu, pp = w1, x1 = hp, S1 = b1, E1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: x1,
  SHA256: m1,
  sha224: S1,
  sha256: pp
}, Symbol.toStringTag, { value: "Module" })), dc = /* @__PURE__ */ rc(E1), A1 = /* @__PURE__ */ rc(Cb);
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.joseToDer = Oi.derToJose = void 0;
const gp = Po, yp = en;
function Fc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const v1 = {
  ES256: Fc(256),
  ES384: Fc(384),
  ES512: Fc(521)
};
function wp(t) {
  const e = v1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Ua = 128, bp = 0, $1 = 32, k1 = 16, I1 = 2, mp = k1 | $1 | bp << 6, Ha = I1 | bp << 6;
function xp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, gp.toByteArray)((0, yp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function L1(t, e) {
  const n = xp(t), r = wp(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== mp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Ua | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Ha)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Ha)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const y = r - c, p = r - d, E = new Uint8Array(y + c + p + d);
  for (o = 0; o < y; ++o)
    E[o] = 0;
  E.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const b = o; o < b + p; ++o)
    E[o] = 0;
  return E.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, yp.escape)((0, gp.fromByteArray)(E));
}
Oi.derToJose = L1;
function Zf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ua && --r, r;
}
function C1(t, e) {
  t = xp(t);
  const n = wp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Zf(t, 0, n), i = Zf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Ua, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = mp, u ? d[l++] = c : (d[l++] = Ua | 1, d[l++] = c & 255), d[l++] = Ha, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = Ha, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
Oi.joseToDer = C1;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.InvalidTokenError = kr.MissingParametersError = void 0;
class T1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
kr.MissingParametersError = T1;
class B1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
kr.InvalidTokenError = B1;
const Uo = /* @__PURE__ */ rc(f1);
Object.defineProperty(lc, "__esModule", { value: !0 });
lc.SECP256K1Client = void 0;
const M1 = ep, N1 = dc, Ea = A1, Qf = Oi, Jf = kr, td = Uo;
Ea.utils.hmacSha256Sync = (t, ...e) => {
  const n = M1.hmac.create(N1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Sp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, td.bytesToHex)(Ea.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Jf.MissingParametersError("a signing input hash and private key are all required");
    const s = Ea.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, td.bytesToHex)(s);
    if (r === "jose")
      return (0, Qf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Qf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Jf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Ea.verify(n, e, r, { strict: !1 });
  }
}
lc.SECP256K1Client = Sp;
Sp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = lc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(cc);
var Us = {};
const P1 = /* @__PURE__ */ rc(k0);
var _1 = rn && rn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Us, "__esModule", { value: !0 });
Us.hashSha256Async = Us.hashSha256 = void 0;
const U1 = dc;
function Ep(t) {
  return (0, U1.sha256)(t);
}
Us.hashSha256 = Ep;
function H1(t) {
  return _1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = P1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Ep(t));
    }
  });
}
Us.hashSha256Async = H1;
var O1 = rn && rn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.TokenSigner = Hi.createUnsecuredToken = void 0;
const xl = en, ed = cc, D1 = kr, nd = Us;
function Sl(t, e) {
  const n = [], r = xl.encode(JSON.stringify(e));
  n.push(r);
  const s = xl.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function F1(t) {
  return Sl(t, { typ: "JWT", alg: "none" }) + ".";
}
Hi.createUnsecuredToken = F1;
class j1 {
  constructor(e, n) {
    if (!(e && n))
      throw new D1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !ed.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = ed.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Sl(e, s), o = (0, nd.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return O1(this, void 0, void 0, function* () {
      const s = this.header(r), i = Sl(e, s), o = yield (0, nd.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [xl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Hi.TokenSigner = j1;
var hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
hc.TokenVerifier = void 0;
const z1 = en, rd = cc, R1 = kr, Yo = Us;
class G1 {
  constructor(e, n) {
    if (!(e && n))
      throw new R1.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !rd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = rd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Yo.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Yo.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), z1.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Yo.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Yo.hashSha256)(r);
      return i(o);
    }
  }
}
hc.TokenVerifier = G1;
var pc = {};
Object.defineProperty(pc, "__esModule", { value: !0 });
pc.decodeToken = void 0;
const Zo = en;
function K1(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Zo.decode(e[0])), r = JSON.parse(Zo.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Zo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Zo.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
pc.decodeToken = K1;
(function(t) {
  var e = rn && rn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = rn && rn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Hi, t), n(hc, t), n(pc, t), n(kr, t), n(cc, t);
})(Xe);
function V1(t) {
  return `did:btc-addr:${t}`;
}
function q1(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Uf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Uf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Ap(t) {
  if (t)
    return q1(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const W1 = "1.4.0";
function X1() {
  return Pm();
}
function Y1(t, e, n, r = y0.slice(), s, i = Bw().getTime(), o = {}) {
  const a = (p) => {
    const E = yu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return E == null ? void 0 : E.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Nw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: W1,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Xe.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = q0(u);
  return c.iss = V1(d), new Xe.TokenSigner("ES256k", t).sign(c);
}
async function sd(t, e) {
  const n = Mo(Jt(e)), r = JSON.parse(n), s = await Z0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Z1(t) {
  const e = Xe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Xe.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Q1(t) {
  const e = Xe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Ap(e.iss);
  if (n.length === 1) {
    if (q0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function J1(t) {
  const e = Xe.decodeToken(t).payload;
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
function t2(t) {
  const e = Xe.decodeToken(t).payload;
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
function e2(t) {
  const e = [
    t2(t),
    J1(t),
    Z1(t),
    Q1(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const id = "1.0.0";
class cs {
  constructor(e) {
    this.version = id, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== id)
      throw new dl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new cs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class vp {
  constructor(e) {
    if (e) {
      const n = new cs(e);
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
class od extends vp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new cs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new w0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new cs({})), !0;
  }
}
class ad extends vp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Lw, !localStorage.getItem(this.key)) {
      const r = new cs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new w0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return cs.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new cs({})), !0;
  }
}
var mo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(mo || (mo = {}));
var Oa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Oa || (Oa = {}));
mo.Mainnet;
var vr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(vr || (vr = {}));
var rr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(rr || (rr = {}));
vr.Mainnet;
const $p = {
  chainId: mo.Mainnet,
  transactionVersion: vr.Mainnet,
  peerNetworkId: Oa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: rr.MainnetSingleSig,
    multiSig: rr.MainnetMultiSig
  },
  client: { baseUrl: b0 }
}, El = {
  chainId: mo.Testnet,
  transactionVersion: vr.Testnet,
  peerNetworkId: Oa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: rr.TestnetSingleSig,
    multiSig: rr.TestnetMultiSig
  },
  client: { baseUrl: m0 }
}, Aa = {
  ...El,
  addressVersion: { ...El.addressVersion },
  magicBytes: "id",
  client: { baseUrl: x0 }
}, n2 = {
  ...Aa,
  addressVersion: { ...Aa.addressVersion },
  client: { ...Aa.client }
};
function r2(t) {
  switch (t) {
    case "mainnet":
      return $p;
    case "testnet":
      return El;
    case "devnet":
      return Aa;
    case "mocknet":
      return n2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function kp(t) {
  return typeof t == "string" ? r2(t) : t;
}
var cd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ld || (ld = {}));
var Dn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Dn || (Dn = {}));
const jc = ["onChainOnly", "offChainOnly", "any"];
jc[0] + "", Dn.OnChainOnly, jc[1] + "", Dn.OffChainOnly, jc[2] + "", Dn.Any, Dn.OnChainOnly + "", Dn.OnChainOnly, Dn.OffChainOnly + "", Dn.OffChainOnly, Dn.Any + "", Dn.Any;
var ud;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(fd || (fd = {}));
var dd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(dd || (dd = {}));
var Ar;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ar || (Ar = {}));
var hd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(gd || (gd = {}));
var yd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(yd || (yd = {}));
var wd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(wd || (wd = {}));
var bd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(bd || (bd = {}));
var md;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(md || (md = {}));
var xd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(xd || (xd = {}));
var Sd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Sd || (Sd = {}));
function Al(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function s2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ip(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function i2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Al(t.outputLen), Al(t.blockLen);
}
function o2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function a2(t, e) {
  Ip(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const As = {
  number: Al,
  bool: s2,
  bytes: Ip,
  hash: i2,
  exists: o2,
  output: a2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const zc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xn = (t, e) => t << 32 - e | t >>> e, c2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!c2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function l2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Mu(t) {
  if (typeof t == "string" && (t = l2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Lp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ti(t) {
  const e = (r) => t().update(Mu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Cp = class extends Lp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, As.hash(e);
    const r = Mu(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Tp = (t, e, n) => new Cp(t, e).update(n).digest();
Tp.create = (t, e) => new Cp(t, e);
function u2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Nu = class extends Lp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = zc(this.buffer);
  }
  update(e) {
    As.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Mu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = zc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    As.exists(this), As.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    u2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = zc(e), c = this.outputLen;
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
const f2 = (t, e, n) => t & e ^ ~t & n, d2 = (t, e, n) => t & e ^ t & n ^ e & n, h2 = new Uint32Array([
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
]), Fr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), jr = new Uint32Array(64);
let Bp = class extends Nu {
  constructor() {
    super(64, 32, 8, !1), this.A = Fr[0] | 0, this.B = Fr[1] | 0, this.C = Fr[2] | 0, this.D = Fr[3] | 0, this.E = Fr[4] | 0, this.F = Fr[5] | 0, this.G = Fr[6] | 0, this.H = Fr[7] | 0;
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
      jr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = jr[l - 15], p = jr[l - 2], E = Xn(y, 7) ^ Xn(y, 18) ^ y >>> 3, b = Xn(p, 17) ^ Xn(p, 19) ^ p >>> 10;
      jr[l] = b + jr[l - 7] + E + jr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), p = d + y + f2(a, c, u) + h2[l] + jr[l] | 0, b = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + d2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    jr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, p2 = class extends Bp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Mp = ti(() => new Bp());
ti(() => new p2());
var ei = {}, Pu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Uo;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const E = n.indexOf(o[p]) >> u;
        let b = 0;
        p !== 0 && (b = n.indexOf(o[p - 1]));
        const T = 1 + u, W = b % (1 << T) << 5 - T, X = t.c32[E + W];
        u = T, c.unshift(X);
      } else
        u = 0;
    let d = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), y = l ? l[0].length : 0;
    for (let p = 0; p < y; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let E = 0; E < p; E++)
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
    for (let b = o.length - 1; b >= 0; b--) {
      y === 4 && (d.unshift(n[l]), y = 0, l = 0);
      const W = (t.c32.indexOf(o[b]) << y) + l, X = n[W % 16];
      if (y += 1, l = W >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      d.unshift(X);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let b = 0; b < d.length && d[b] === "0"; b++)
      p++;
    d = d.slice(p - p % 2);
    let E = d.join("");
    for (let b = 0; b < u; b++)
      E = `00${E}`;
    if (a) {
      const b = a * 2 - E.length;
      for (let T = 0; T < b; T += 2)
        E = `00${E}`;
    }
    return E;
  }
  t.c32decode = i;
})(Pu);
var Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.c32checkDecode = Hs.c32checkEncode = void 0;
const Ed = dc, Ad = Uo, po = Pu;
function Np(t) {
  const e = (0, Ed.sha256)((0, Ed.sha256)((0, Ad.hexToBytes)(t)));
  return (0, Ad.bytesToHex)(e.slice(0, 4));
}
function g2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Np(`${n}${e}`), s = (0, po.c32encode)(`${e}${r}`);
  return `${po.c32[t]}${s}`;
}
Hs.c32checkEncode = g2;
function y2(t) {
  t = (0, po.c32normalize)(t);
  const e = (0, po.c32decode)(t.slice(1)), n = t[0], r = po.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Np(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Hs.c32checkDecode = y2;
var Pp = {}, Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.decode = Di.encode = void 0;
const Da = dc, vd = Uo, _p = z0, Up = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function w2(t, e = "00") {
  const n = typeof t == "string" ? (0, vd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, vd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Da.sha256)((0, Da.sha256)(new Uint8Array([...r, ...n])));
  return _p(Up).encode([...r, ...n, ...s.slice(0, 4)]);
}
Di.encode = w2;
function b2(t) {
  const e = _p(Up).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Da.sha256)((0, Da.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Di.decode = b2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Hs, n = Di, r = Uo;
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
    const y = n.decode(d), p = (0, r.bytesToHex)(y.data), E = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let b;
    return l < 0 ? (b = E, s[E] !== void 0 && (b = s[E])) : b = l, o(b, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const y = a(d), p = y[0], E = y[1];
    let b;
    l < 0 ? (b = p, i[p] !== void 0 && (b = i[p])) : b = l;
    let T = b.toString(16);
    return T.length === 1 && (T = `0${T}`), n.encode(E, T);
  }
  t.c32ToB58 = u;
})(Pp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Pu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Hs;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Pp;
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
})(ei);
function m2(t, e) {
  switch (e = kp(e ?? $p), t) {
    case Ar.P2PKH:
      switch (e.transactionVersion) {
        case vr.Mainnet:
          return rr.MainnetSingleSig;
        case vr.Testnet:
          return rr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Ar.P2SH:
    case Ar.P2SHNonSequential:
    case Ar.P2WPKH:
    case Ar.P2WSH:
    case Ar.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case vr.Mainnet:
          return rr.MainnetMultiSig;
        case vr.Testnet:
          return rr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const x2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hp = Uint8Array.from({ length: 16 }, (t, e) => e), S2 = Hp.map((t) => (9 * t + 5) % 16);
let _u = [Hp], Uu = [S2];
for (let t = 0; t < 4; t++)
  for (let e of [_u, Uu])
    e.push(e[t].map((n) => x2[n]));
const Op = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), E2 = _u.map((t, e) => t.map((n) => Op[e][n])), A2 = Uu.map((t, e) => t.map((n) => Op[e][n])), v2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), $2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qo = (t, e) => t << e | t >>> 32 - e;
function $d(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Jo = new Uint32Array(16);
let k2 = class extends Nu {
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
      Jo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, b = v2[p], T = $2[p], W = _u[p], X = Uu[p], S = E2[p], N = A2[p];
      for (let B = 0; B < 16; B++) {
        const J = Qo(r + $d(p, i, a, u) + Jo[W[B]] + b, S[B]) + l | 0;
        r = l, l = u, u = Qo(a, 10) | 0, a = i, i = J;
      }
      for (let B = 0; B < 16; B++) {
        const J = Qo(s + $d(E, o, c, d) + Jo[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = Qo(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Jo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const I2 = ti(() => new k2()), ta = BigInt(2 ** 32 - 1), vl = BigInt(32);
function Dp(t, e = !1) {
  return e ? { h: Number(t & ta), l: Number(t >> vl & ta) } : { h: Number(t >> vl & ta) | 0, l: Number(t & ta) | 0 };
}
function L2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Dp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const C2 = (t, e) => BigInt(t >>> 0) << vl | BigInt(e >>> 0), T2 = (t, e, n) => t >>> n, B2 = (t, e, n) => t << 32 - n | e >>> n, M2 = (t, e, n) => t >>> n | e << 32 - n, N2 = (t, e, n) => t << 32 - n | e >>> n, P2 = (t, e, n) => t << 64 - n | e >>> n - 32, _2 = (t, e, n) => t >>> n - 32 | e << 64 - n, U2 = (t, e) => e, H2 = (t, e) => t, O2 = (t, e, n) => t << n | e >>> 32 - n, D2 = (t, e, n) => e << n | t >>> 32 - n, F2 = (t, e, n) => e << n - 32 | t >>> 64 - n, j2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function z2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const R2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), G2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, K2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), V2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, q2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), W2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: Dp,
  split: L2,
  toBig: C2,
  shrSH: T2,
  shrSL: B2,
  rotrSH: M2,
  rotrSL: N2,
  rotrBH: P2,
  rotrBL: _2,
  rotr32H: U2,
  rotr32L: H2,
  rotlSH: O2,
  rotlSL: D2,
  rotlBH: F2,
  rotlBL: j2,
  add: z2,
  add3L: R2,
  add3H: G2,
  add4L: K2,
  add4H: V2,
  add5H: W2,
  add5L: q2
}, [X2, Y2] = _t.split([
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
].map((t) => BigInt(t))), zr = new Uint32Array(80), Rr = new Uint32Array(80);
let gc = class extends Nu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: E, Hh: b, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = b | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      zr[S] = e.getUint32(n), Rr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = zr[S - 15] | 0, B = Rr[S - 15] | 0, J = _t.rotrSH(N, B, 1) ^ _t.rotrSH(N, B, 8) ^ _t.shrSH(N, B, 7), nt = _t.rotrSL(N, B, 1) ^ _t.rotrSL(N, B, 8) ^ _t.shrSL(N, B, 7), K = zr[S - 2] | 0, z = Rr[S - 2] | 0, A = _t.rotrSH(K, z, 19) ^ _t.rotrBH(K, z, 61) ^ _t.shrSH(K, z, 6), P = _t.rotrSL(K, z, 19) ^ _t.rotrBL(K, z, 61) ^ _t.shrSL(K, z, 6), M = _t.add4L(nt, P, Rr[S - 7], Rr[S - 16]), q = _t.add4H(M, J, A, zr[S - 7], zr[S - 16]);
      zr[S] = q | 0, Rr[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: E, Gh: b, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = _t.rotrSH(l, y, 14) ^ _t.rotrSH(l, y, 18) ^ _t.rotrBH(l, y, 41), B = _t.rotrSL(l, y, 14) ^ _t.rotrSL(l, y, 18) ^ _t.rotrBL(l, y, 41), J = l & p ^ ~l & b, nt = y & E ^ ~y & T, K = _t.add5L(X, B, nt, Y2[S], Rr[S]), z = _t.add5H(K, W, N, J, X2[S], zr[S]), A = K | 0, P = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), M = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, at = s & o ^ s & c ^ o & c;
      W = b | 0, X = T | 0, b = p | 0, T = E | 0, p = l | 0, E = y | 0, { h: l, l: y } = _t.add(u | 0, d | 0, z | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = _t.add3L(A, M, at);
      r = _t.add3H(Y, z, P, q), s = Y | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = _t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = _t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = _t.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: E } = _t.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: b, l: T } = _t.add(this.Gh | 0, this.Gl | 0, b | 0, T | 0), { h: W, l: X } = _t.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, E, b, T, W, X);
  }
  roundClean() {
    zr.fill(0), Rr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Z2 = class extends gc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Q2 = class extends gc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, J2 = class extends gc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ti(() => new gc());
ti(() => new Z2());
ti(() => new Q2());
ti(() => new J2());
var Fa = { exports: {} };
Fa.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", E = "[object Object]", b = "[object Promise]", T = "[object RegExp]", W = "[object Set]", X = "[object String]", S = "[object Symbol]", N = "[object WeakMap]", B = "[object ArrayBuffer]", J = "[object DataView]", nt = "[object Float32Array]", K = "[object Float64Array]", z = "[object Int8Array]", A = "[object Int16Array]", P = "[object Int32Array]", M = "[object Uint8Array]", q = "[object Uint8ClampedArray]", at = "[object Uint16Array]", Y = "[object Uint32Array]", L = /[\\^$.*+?()[\]{}|]/g, rt = /\w*$/, Zt = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, F = {};
  F[i] = F[o] = F[B] = F[J] = F[a] = F[c] = F[nt] = F[K] = F[z] = F[A] = F[P] = F[y] = F[p] = F[E] = F[T] = F[W] = F[X] = F[S] = F[M] = F[q] = F[at] = F[Y] = !0, F[u] = F[d] = F[N] = !1;
  var St = typeof rn == "object" && rn && rn.Object === Object && rn, Nt = typeof self == "object" && self && self.Object === Object && self, Tt = St || Nt || Function("return this")(), Qt = e && !e.nodeType && e, ie = Qt && !0 && t && !t.nodeType && t, m = ie && ie.exports === Qt;
  function H(g, C) {
    return g.set(C[0], C[1]), g;
  }
  function tt(g, C) {
    return g.add(C), g;
  }
  function U(g, C) {
    for (var D = -1, dt = g ? g.length : 0; ++D < dt && C(g[D], D, g) !== !1; )
      ;
    return g;
  }
  function it(g, C) {
    for (var D = -1, dt = C.length, Ve = g.length; ++D < dt; )
      g[Ve + D] = C[D];
    return g;
  }
  function ct(g, C, D, dt) {
    for (var Ve = -1, an = g ? g.length : 0; ++Ve < an; )
      D = C(D, g[Ve], Ve, g);
    return D;
  }
  function Lt(g, C) {
    for (var D = -1, dt = Array(g); ++D < g; )
      dt[D] = C(D);
    return dt;
  }
  function vt(g, C) {
    return g == null ? void 0 : g[C];
  }
  function Kt(g) {
    var C = !1;
    if (g != null && typeof g.toString != "function")
      try {
        C = !!(g + "");
      } catch {
      }
    return C;
  }
  function Dt(g) {
    var C = -1, D = Array(g.size);
    return g.forEach(function(dt, Ve) {
      D[++C] = [Ve, dt];
    }), D;
  }
  function Et(g, C) {
    return function(D) {
      return g(C(D));
    };
  }
  function wt(g) {
    var C = -1, D = Array(g.size);
    return g.forEach(function(dt) {
      D[++C] = dt;
    }), D;
  }
  var $t = Array.prototype, he = Function.prototype, Ft = Object.prototype, ye = Tt["__core-js_shared__"], At = function() {
    var g = /[^.]+$/.exec(ye && ye.keys && ye.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), jt = he.toString, Bt = Ft.hasOwnProperty, Je = Ft.toString, v = RegExp(
    "^" + jt.call(Bt).replace(L, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), j = m ? Tt.Buffer : void 0, _ = Tt.Symbol, G = Tt.Uint8Array, bt = Et(Object.getPrototypeOf, Object), kt = Object.create, le = Ft.propertyIsEnumerable, ne = $t.splice, ue = Object.getOwnPropertySymbols, oe = j ? j.isBuffer : void 0, Re = Et(Object.keys, Object), Ge = V(Tt, "DataView"), Wt = V(Tt, "Map"), gt = V(Tt, "Promise"), te = V(Tt, "Set"), ae = V(Tt, "WeakMap"), Se = V(Object, "create"), ge = we(Ge), on = we(Wt), h = we(gt), x = we(te), f = we(ae), R = _ ? _.prototype : void 0, ut = R ? R.valueOf : void 0;
  function mt(g) {
    var C = -1, D = g ? g.length : 0;
    for (this.clear(); ++C < D; ) {
      var dt = g[C];
      this.set(dt[0], dt[1]);
    }
  }
  function ht() {
    this.__data__ = Se ? Se(null) : {};
  }
  function re(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function Fe(g) {
    var C = this.__data__;
    if (Se) {
      var D = C[g];
      return D === r ? void 0 : D;
    }
    return Bt.call(C, g) ? C[g] : void 0;
  }
  function ke(g) {
    var C = this.__data__;
    return Se ? C[g] !== void 0 : Bt.call(C, g);
  }
  function hn(g, C) {
    var D = this.__data__;
    return D[g] = Se && C === void 0 ? r : C, this;
  }
  mt.prototype.clear = ht, mt.prototype.delete = re, mt.prototype.get = Fe, mt.prototype.has = ke, mt.prototype.set = hn;
  function Ee(g) {
    var C = -1, D = g ? g.length : 0;
    for (this.clear(); ++C < D; ) {
      var dt = g[C];
      this.set(dt[0], dt[1]);
    }
  }
  function Mn() {
    this.__data__ = [];
  }
  function Ke(g) {
    var C = this.__data__, D = _n(C, g);
    if (D < 0)
      return !1;
    var dt = C.length - 1;
    return D == dt ? C.pop() : ne.call(C, D, 1), !0;
  }
  function Nn(g) {
    var C = this.__data__, D = _n(C, g);
    return D < 0 ? void 0 : C[D][1];
  }
  function pn(g) {
    return _n(this.__data__, g) > -1;
  }
  function hs(g, C) {
    var D = this.__data__, dt = _n(D, g);
    return dt < 0 ? D.push([g, C]) : D[dt][1] = C, this;
  }
  Ee.prototype.clear = Mn, Ee.prototype.delete = Ke, Ee.prototype.get = Nn, Ee.prototype.has = pn, Ee.prototype.set = hs;
  function He(g) {
    var C = -1, D = g ? g.length : 0;
    for (this.clear(); ++C < D; ) {
      var dt = g[C];
      this.set(dt[0], dt[1]);
    }
  }
  function ai() {
    this.__data__ = {
      hash: new mt(),
      map: new (Wt || Ee)(),
      string: new mt()
    };
  }
  function dr(g) {
    return $(this, g).delete(g);
  }
  function Ct(g) {
    return $(this, g).get(g);
  }
  function Vt(g) {
    return $(this, g).has(g);
  }
  function Ie(g, C) {
    return $(this, g).set(g, C), this;
  }
  He.prototype.clear = ai, He.prototype.delete = dr, He.prototype.get = Ct, He.prototype.has = Vt, He.prototype.set = Ie;
  function je(g) {
    this.__data__ = new Ee(g);
  }
  function ci() {
    this.__data__ = new Ee();
  }
  function ps(g) {
    return this.__data__.delete(g);
  }
  function Cr(g) {
    return this.__data__.get(g);
  }
  function Pn(g) {
    return this.__data__.has(g);
  }
  function Vn(g, C) {
    var D = this.__data__;
    if (D instanceof Ee) {
      var dt = D.__data__;
      if (!Wt || dt.length < n - 1)
        return dt.push([g, C]), this;
      D = this.__data__ = new He(dt);
    }
    return D.set(g, C), this;
  }
  je.prototype.clear = ci, je.prototype.delete = ps, je.prototype.get = Cr, je.prototype.has = Pn, je.prototype.set = Vn;
  function gs(g, C) {
    var D = Mc(g) || pi(g) ? Lt(g.length, String) : [], dt = D.length, Ve = !!dt;
    for (var an in g)
      Bt.call(g, an) && !(Ve && (an == "length" || ft(an, dt))) && D.push(an);
    return D;
  }
  function hr(g, C, D) {
    var dt = g[C];
    (!(Bt.call(g, C) && bs(dt, D)) || D === void 0 && !(C in g)) && (g[C] = D);
  }
  function _n(g, C) {
    for (var D = g.length; D--; )
      if (bs(g[D][0], C))
        return D;
    return -1;
  }
  function qn(g, C) {
    return g && yr(C, Nc(C), g);
  }
  function Un(g, C, D, dt, Ve, an, wr) {
    var cn;
    if (dt && (cn = an ? dt(g, Ve, an, wr) : dt(g)), cn !== void 0)
      return cn;
    if (!Fo(g))
      return g;
    var Cf = Mc(g);
    if (Cf) {
      if (cn = k(g), !C)
        return di(g, cn);
    } else {
      var gi = yt(g), Tf = gi == d || gi == l;
      if (Yy(g))
        return eo(g, C);
      if (gi == E || gi == i || Tf && !an) {
        if (Kt(g))
          return an ? g : {};
        if (cn = O(Tf ? {} : g), !C)
          return hi(g, qn(cn, g));
      } else {
        if (!F[gi])
          return an ? g : {};
        cn = lt(g, gi, Un, C);
      }
    }
    wr || (wr = new je());
    var Bf = wr.get(g);
    if (Bf)
      return Bf;
    if (wr.set(g, cn), !Cf)
      var Mf = D ? w(g) : Nc(g);
    return U(Mf || g, function(Pc, jo) {
      Mf && (jo = Pc, Pc = g[jo]), hr(cn, jo, Un(Pc, C, D, dt, jo, g, wr));
    }), cn;
  }
  function Hn(g) {
    return Fo(g) ? kt(g) : {};
  }
  function ys(g, C, D) {
    var dt = C(g);
    return Mc(g) ? dt : it(dt, D(g));
  }
  function li(g) {
    return Je.call(g);
  }
  function ws(g) {
    if (!Fo(g) || Ne(g))
      return !1;
    var C = Lf(g) || Kt(g) ? v : Zt;
    return C.test(we(g));
  }
  function Le(g) {
    if (!Ae(g))
      return Re(g);
    var C = [];
    for (var D in Object(g))
      Bt.call(g, D) && D != "constructor" && C.push(D);
    return C;
  }
  function eo(g, C) {
    if (C)
      return g.slice();
    var D = new g.constructor(g.length);
    return g.copy(D), D;
  }
  function Tr(g) {
    var C = new g.constructor(g.byteLength);
    return new G(C).set(new G(g)), C;
  }
  function pr(g, C) {
    var D = C ? Tr(g.buffer) : g.buffer;
    return new g.constructor(D, g.byteOffset, g.byteLength);
  }
  function Br(g, C, D) {
    var dt = C ? D(Dt(g), !0) : Dt(g);
    return ct(dt, H, new g.constructor());
  }
  function gr(g) {
    var C = new g.constructor(g.source, rt.exec(g));
    return C.lastIndex = g.lastIndex, C;
  }
  function ui(g, C, D) {
    var dt = C ? D(wt(g), !0) : wt(g);
    return ct(dt, tt, new g.constructor());
  }
  function Mr(g) {
    return ut ? Object(ut.call(g)) : {};
  }
  function fi(g, C) {
    var D = C ? Tr(g.buffer) : g.buffer;
    return new g.constructor(D, g.byteOffset, g.length);
  }
  function di(g, C) {
    var D = -1, dt = g.length;
    for (C || (C = Array(dt)); ++D < dt; )
      C[D] = g[D];
    return C;
  }
  function yr(g, C, D, dt) {
    D || (D = {});
    for (var Ve = -1, an = C.length; ++Ve < an; ) {
      var wr = C[Ve], cn = void 0;
      hr(D, wr, cn === void 0 ? g[wr] : cn);
    }
    return D;
  }
  function hi(g, C) {
    return yr(g, et(g), C);
  }
  function w(g) {
    return ys(g, Nc, et);
  }
  function $(g, C) {
    var D = g.__data__;
    return Xt(C) ? D[typeof C == "string" ? "string" : "hash"] : D.map;
  }
  function V(g, C) {
    var D = vt(g, C);
    return ws(D) ? D : void 0;
  }
  var et = ue ? Et(ue, Object) : Jy, yt = li;
  (Ge && yt(new Ge(new ArrayBuffer(1))) != J || Wt && yt(new Wt()) != y || gt && yt(gt.resolve()) != b || te && yt(new te()) != W || ae && yt(new ae()) != N) && (yt = function(g) {
    var C = Je.call(g), D = C == E ? g.constructor : void 0, dt = D ? we(D) : void 0;
    if (dt)
      switch (dt) {
        case ge:
          return J;
        case on:
          return y;
        case h:
          return b;
        case x:
          return W;
        case f:
          return N;
      }
    return C;
  });
  function k(g) {
    var C = g.length, D = g.constructor(C);
    return C && typeof g[0] == "string" && Bt.call(g, "index") && (D.index = g.index, D.input = g.input), D;
  }
  function O(g) {
    return typeof g.constructor == "function" && !Ae(g) ? Hn(bt(g)) : {};
  }
  function lt(g, C, D, dt) {
    var Ve = g.constructor;
    switch (C) {
      case B:
        return Tr(g);
      case a:
      case c:
        return new Ve(+g);
      case J:
        return pr(g, dt);
      case nt:
      case K:
      case z:
      case A:
      case P:
      case M:
      case q:
      case at:
      case Y:
        return fi(g, dt);
      case y:
        return Br(g, dt, D);
      case p:
      case X:
        return new Ve(g);
      case T:
        return gr(g);
      case W:
        return ui(g, dt, D);
      case S:
        return Mr(g);
    }
  }
  function ft(g, C) {
    return C = C ?? s, !!C && (typeof g == "number" || I.test(g)) && g > -1 && g % 1 == 0 && g < C;
  }
  function Xt(g) {
    var C = typeof g;
    return C == "string" || C == "number" || C == "symbol" || C == "boolean" ? g !== "__proto__" : g === null;
  }
  function Ne(g) {
    return !!At && At in g;
  }
  function Ae(g) {
    var C = g && g.constructor, D = typeof C == "function" && C.prototype || Ft;
    return g === D;
  }
  function we(g) {
    if (g != null) {
      try {
        return jt.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function vn(g) {
    return Un(g, !0, !0);
  }
  function bs(g, C) {
    return g === C || g !== g && C !== C;
  }
  function pi(g) {
    return Xy(g) && Bt.call(g, "callee") && (!le.call(g, "callee") || Je.call(g) == i);
  }
  var Mc = Array.isArray;
  function If(g) {
    return g != null && Zy(g.length) && !Lf(g);
  }
  function Xy(g) {
    return Qy(g) && If(g);
  }
  var Yy = oe || tw;
  function Lf(g) {
    var C = Fo(g) ? Je.call(g) : "";
    return C == d || C == l;
  }
  function Zy(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= s;
  }
  function Fo(g) {
    var C = typeof g;
    return !!g && (C == "object" || C == "function");
  }
  function Qy(g) {
    return !!g && typeof g == "object";
  }
  function Nc(g) {
    return If(g) ? gs(g) : Le(g);
  }
  function Jy() {
    return [];
  }
  function tw() {
    return !1;
  }
  t.exports = vn;
})(Fa, Fa.exports);
var tx = Fa.exports;
const Fp = /* @__PURE__ */ d0(tx);
var $l;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})($l || ($l = {}));
function ex(t, e) {
  return { type: $l.Address, version: t, hash160: e };
}
function nx(t) {
  return ei.c32address(t.version, t.hash160);
}
const rx = (t) => I2(Mp(t)), sx = (t) => xt(rx(t));
Me.hmacSha256Sync = (t, ...e) => {
  const n = Tp.create(Mp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ix(t, e = "mainnet") {
  e = kp(e), t = typeof t == "string" ? Jt(t) : t;
  const n = m2(Ar.P2PKH, e), r = ex(n, sx(t));
  return nx(r);
}
function ox(t, e) {
  const n = Xe.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = ix(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Xe.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function ax(t, e = null) {
  let n;
  e ? n = ox(t, e) : n = Xe.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const kd = "_blockstackDidCheckEchoReply", cx = "echoReply", lx = "authContinuation";
function ux(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function fx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[kd];
  if (typeof e == "boolean")
    return e;
  const n = ux(t.location.search), r = n[cx];
  if (r) {
    t[kd] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[lx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class kl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new S0();
    else
      throw new Tw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new ad(e.sessionOptions) : this.store = new ad() : e ? this.store = new od(e.sessionOptions) : this.store = new od();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Mw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new dl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Y1(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = X1();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = yu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (fx())
        return Ei.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ei.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = eb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new zo("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Xe.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await e2(e))
      throw new zo("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Uc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await sd(s, i.private_key);
          } catch {
            if (Ei.warn("Failed decryption of appPrivateKey, will try to use as given"), !Me.isValidPrivateKey(i.private_key))
              throw new zo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await sd(s, c);
          } catch {
            Ei.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new zo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Gw, d;
    Uc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Uc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Ap(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, y = i.profile_url;
    if (!l.profile && y) {
      const p = await n(y);
      if (!p.ok)
        l.profile = Object.assign({}, Iw);
      else {
        const E = await p.text(), b = JSON.parse(E);
        l.profile = ax(b[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new dl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Gm(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Km(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
kl.prototype.makeAuthRequest = kl.prototype.makeAuthRequestToken;
const dx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], hx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = dx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!yc(r.id));
  return e.concat(n);
}, yc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), jp = "STX_PROVIDER", Os = () => typeof window > "u" ? null : window.localStorage.getItem(jp), px = (t) => {
  typeof window < "u" && window.localStorage.setItem(jp, t);
}, gx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function yx(t, e) {
  const n = {};
  return Object.assign(n, gx, e), await fetch(t, n);
}
function wx(t) {
  let e = yx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function bx(...t) {
  const { fetchLib: e, middlewares: n } = wx(t);
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
var Fi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Fi || (Fi = {}));
var Ds;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ds || (Ds = {}));
var Id;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Id || (Id = {}));
const mx = "https://api.mainnet.hiro.so", xx = "https://api.testnet.hiro.so", Sx = "http://localhost:3999", Ex = ["mainnet", "testnet", "devnet", "mocknet"];
class Fs {
  constructor(e) {
    this.version = Ds.Mainnet, this.chainId = Fi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ds.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? bx();
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
Fs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Il();
    case "testnet":
      return new Ll();
    case "devnet":
      return new Ax();
    case "mocknet":
      return new zp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ex.join(", ")}`);
  }
};
Fs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Fs.fromName(t);
class Il extends Fs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? mx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ds.Mainnet, this.chainId = Fi.Mainnet;
  }
}
class Ll extends Fs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? xx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ds.Testnet, this.chainId = Fi.Testnet;
  }
}
class zp extends Fs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ds.Testnet, this.chainId = Fi.Testnet;
  }
}
const Ax = zp;
var js;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(js || (js = {}));
var ja;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ja || (ja = {}));
js.Mainnet;
var zs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zs || (zs = {}));
var Rs;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Rs || (Rs = {}));
zs.Mainnet;
const vx = {
  chainId: js.Mainnet,
  transactionVersion: zs.Mainnet,
  peerNetworkId: ja.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Rs.MainnetSingleSig,
    multiSig: Rs.MainnetMultiSig
  },
  client: { baseUrl: b0 }
}, Cl = {
  chainId: js.Testnet,
  transactionVersion: zs.Testnet,
  peerNetworkId: ja.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Rs.TestnetSingleSig,
    multiSig: Rs.TestnetMultiSig
  },
  client: { baseUrl: m0 }
}, va = {
  ...Cl,
  addressVersion: { ...Cl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: x0 }
}, $x = {
  ...va,
  addressVersion: { ...va.addressVersion },
  client: { ...va.client }
};
function kx(t) {
  switch (t) {
    case "mainnet":
      return vx;
    case "testnet":
      return Cl;
    case "devnet":
      return va;
    case "mocknet":
      return $x;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Ix(t) {
  return typeof t == "string" ? kx(t) : t;
}
function Lx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ld = /* @__PURE__ */ new Map();
function Rp(t, e) {
  const n = Ld.get(t);
  if (n !== void 0)
    return n(e);
  const r = Lx(t);
  return Ld.set(t, r), Rp(t, e);
}
let pe = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Jt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Zw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Xw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return qw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = xt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = xt(n);
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
    if (Rp(e, r))
      return r;
    throw n(r);
  }
};
const Cx = 128, Tx = 128, Gp = 16, Cs = 32, Tl = 80, wc = 65, Bx = 32, Mx = 64, za = 34, Nx = 1 + 16 * 1024 * 1024, Px = 165, _x = 16, Ux = 16, Hx = 20, Ox = Ux + 2 + Hx, Dx = Ox + 4, Fx = Nx + (Px + _x * Dx);
var se;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(se || (se = {}));
var Bl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Bl || (Bl = {}));
var yn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yn || (yn = {}));
const Rc = ["onChainOnly", "offChainOnly", "any"];
Rc[0] + "", yn.OnChainOnly, Rc[1] + "", yn.OffChainOnly, Rc[2] + "", yn.Any, yn.OnChainOnly + "", yn.OnChainOnly, yn.OffChainOnly + "", yn.OffChainOnly, yn.Any + "", yn.Any;
var Ra;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ra || (Ra = {}));
var be;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(be || (be = {}));
var Te;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Te || (Te = {}));
var fe;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(fe || (fe = {}));
var ve;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ve || (ve = {}));
var go;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(go || (go = {}));
var Ml;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ml || (Ml = {}));
var Nl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Nl || (Nl = {}));
var nn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(nn || (nn = {}));
var Cd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Cd || (Cd = {}));
var Pl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Pl || (Pl = {}));
var jn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(jn || (jn = {}));
var Td;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Td || (Td = {}));
let bc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ai = class extends bc {
  constructor(e) {
    super(e);
  }
}, tn = class extends bc {
  constructor(e) {
    super(e);
  }
}, Ga = class extends bc {
  constructor(e) {
    super(e);
  }
}, vs = class extends bc {
  constructor(e) {
    super(e);
  }
};
function _l(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function jx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Kp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function zx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _l(t.outputLen), _l(t.blockLen);
}
function Rx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Gx(t, e) {
  Kp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $s = {
  number: _l,
  bool: jx,
  bytes: Kp,
  hash: zx,
  exists: Rx,
  output: Gx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Gc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Yn = (t, e) => t << 32 - e | t >>> e, Kx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Kx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Vx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Hu(t) {
  if (typeof t == "string" && (t = Vx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Vp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ni(t) {
  const e = (r) => t().update(Hu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let qp = class extends Vp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $s.hash(e);
    const r = Hu(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Wp = (t, e, n) => new qp(t, e).update(n).digest();
Wp.create = (t, e) => new qp(t, e);
function qx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Ou = class extends Vp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Gc(this.buffer);
  }
  update(e) {
    $s.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Hu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Gc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $s.exists(this), $s.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    qx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Gc(e), c = this.outputLen;
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
const Wx = (t, e, n) => t & e ^ ~t & n, Xx = (t, e, n) => t & e ^ t & n ^ e & n, Yx = new Uint32Array([
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
let Xp = class extends Ou {
  constructor() {
    super(64, 32, 8, !1), this.A = Gr[0] | 0, this.B = Gr[1] | 0, this.C = Gr[2] | 0, this.D = Gr[3] | 0, this.E = Gr[4] | 0, this.F = Gr[5] | 0, this.G = Gr[6] | 0, this.H = Gr[7] | 0;
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
      Kr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Kr[l - 15], p = Kr[l - 2], E = Yn(y, 7) ^ Yn(y, 18) ^ y >>> 3, b = Yn(p, 17) ^ Yn(p, 19) ^ p >>> 10;
      Kr[l] = b + Kr[l - 7] + E + Kr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Yn(a, 6) ^ Yn(a, 11) ^ Yn(a, 25), p = d + y + Wx(a, c, u) + Yx[l] + Kr[l] | 0, b = (Yn(r, 2) ^ Yn(r, 13) ^ Yn(r, 22)) + Xx(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Kr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Zx = class extends Xp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Du = ni(() => new Xp());
ni(() => new Zx());
const Qx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Yp = Uint8Array.from({ length: 16 }, (t, e) => e), Jx = Yp.map((t) => (9 * t + 5) % 16);
let Fu = [Yp], ju = [Jx];
for (let t = 0; t < 4; t++)
  for (let e of [Fu, ju])
    e.push(e[t].map((n) => Qx[n]));
const Zp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), tS = Fu.map((t, e) => t.map((n) => Zp[e][n])), eS = ju.map((t, e) => t.map((n) => Zp[e][n])), nS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), rS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ea = (t, e) => t << e | t >>> 32 - e;
function Bd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const na = new Uint32Array(16);
let sS = class extends Ou {
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
      na[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, b = nS[p], T = rS[p], W = Fu[p], X = ju[p], S = tS[p], N = eS[p];
      for (let B = 0; B < 16; B++) {
        const J = ea(r + Bd(p, i, a, u) + na[W[B]] + b, S[B]) + l | 0;
        r = l, l = u, u = ea(a, 10) | 0, a = i, i = J;
      }
      for (let B = 0; B < 16; B++) {
        const J = ea(s + Bd(E, o, c, d) + na[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = ea(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    na.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const iS = ni(() => new sS()), ra = BigInt(2 ** 32 - 1), Ul = BigInt(32);
function Qp(t, e = !1) {
  return e ? { h: Number(t & ra), l: Number(t >> Ul & ra) } : { h: Number(t >> Ul & ra) | 0, l: Number(t & ra) | 0 };
}
function oS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Qp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const aS = (t, e) => BigInt(t >>> 0) << Ul | BigInt(e >>> 0), cS = (t, e, n) => t >>> n, lS = (t, e, n) => t << 32 - n | e >>> n, uS = (t, e, n) => t >>> n | e << 32 - n, fS = (t, e, n) => t << 32 - n | e >>> n, dS = (t, e, n) => t << 64 - n | e >>> n - 32, hS = (t, e, n) => t >>> n - 32 | e << 64 - n, pS = (t, e) => e, gS = (t, e) => t, yS = (t, e, n) => t << n | e >>> 32 - n, wS = (t, e, n) => e << n | t >>> 32 - n, bS = (t, e, n) => e << n - 32 | t >>> 64 - n, mS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function xS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const SS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ES = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, AS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), vS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, $S = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), kS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ut = {
  fromBig: Qp,
  split: oS,
  toBig: aS,
  shrSH: cS,
  shrSL: lS,
  rotrSH: uS,
  rotrSL: fS,
  rotrBH: dS,
  rotrBL: hS,
  rotr32H: pS,
  rotr32L: gS,
  rotlSH: yS,
  rotlSL: wS,
  rotlBH: bS,
  rotlBL: mS,
  add: xS,
  add3L: SS,
  add3H: ES,
  add4L: AS,
  add4H: vS,
  add5H: kS,
  add5L: $S
}, [IS, LS] = Ut.split([
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
let mc = class extends Ou {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: E, Hh: b, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = b | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      Vr[S] = e.getUint32(n), qr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = Vr[S - 15] | 0, B = qr[S - 15] | 0, J = Ut.rotrSH(N, B, 1) ^ Ut.rotrSH(N, B, 8) ^ Ut.shrSH(N, B, 7), nt = Ut.rotrSL(N, B, 1) ^ Ut.rotrSL(N, B, 8) ^ Ut.shrSL(N, B, 7), K = Vr[S - 2] | 0, z = qr[S - 2] | 0, A = Ut.rotrSH(K, z, 19) ^ Ut.rotrBH(K, z, 61) ^ Ut.shrSH(K, z, 6), P = Ut.rotrSL(K, z, 19) ^ Ut.rotrBL(K, z, 61) ^ Ut.shrSL(K, z, 6), M = Ut.add4L(nt, P, qr[S - 7], qr[S - 16]), q = Ut.add4H(M, J, A, Vr[S - 7], Vr[S - 16]);
      Vr[S] = q | 0, qr[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: E, Gh: b, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = Ut.rotrSH(l, y, 14) ^ Ut.rotrSH(l, y, 18) ^ Ut.rotrBH(l, y, 41), B = Ut.rotrSL(l, y, 14) ^ Ut.rotrSL(l, y, 18) ^ Ut.rotrBL(l, y, 41), J = l & p ^ ~l & b, nt = y & E ^ ~y & T, K = Ut.add5L(X, B, nt, LS[S], qr[S]), z = Ut.add5H(K, W, N, J, IS[S], Vr[S]), A = K | 0, P = Ut.rotrSH(r, s, 28) ^ Ut.rotrBH(r, s, 34) ^ Ut.rotrBH(r, s, 39), M = Ut.rotrSL(r, s, 28) ^ Ut.rotrBL(r, s, 34) ^ Ut.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, at = s & o ^ s & c ^ o & c;
      W = b | 0, X = T | 0, b = p | 0, T = E | 0, p = l | 0, E = y | 0, { h: l, l: y } = Ut.add(u | 0, d | 0, z | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = Ut.add3L(A, M, at);
      r = Ut.add3H(Y, z, P, q), s = Y | 0;
    }
    ({ h: r, l: s } = Ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ut.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ut.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Ut.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: E } = Ut.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: b, l: T } = Ut.add(this.Gh | 0, this.Gl | 0, b | 0, T | 0), { h: W, l: X } = Ut.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, E, b, T, W, X);
  }
  roundClean() {
    Vr.fill(0), qr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, CS = class extends mc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, TS = class extends mc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, BS = class extends mc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ni(() => new mc());
ni(() => new CS());
const MS = ni(() => new TS());
ni(() => new BS());
var qt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(qt || (qt = {}));
var Oe;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Oe || (Oe = {}));
function zu(t) {
  return Oe[t];
}
const NS = () => ({ type: qt.BoolTrue }), PS = () => ({ type: qt.BoolFalse }), _S = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: qt.Buffer, value: xt(t) };
}, Md = BigInt("0xffffffffffffffffffffffffffffffff"), US = BigInt(0), Nd = BigInt("0x7fffffffffffffffffffffffffffffff"), Pd = BigInt("-170141183460469231731687303715884105728"), HS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = pl(Jt(t))), dn(t, Uint8Array) && (t = pl(t));
  const e = Qe(t);
  if (e > Nd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Nd}`);
  if (e < Pd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Pd}`);
  return { type: qt.Int, value: e };
}, OS = (t) => {
  const e = Qe(t);
  if (e < US)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Md)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Md}`);
  return { type: qt.UInt, value: e };
};
function DS(t) {
  return { type: qt.List, value: t };
}
function Jp() {
  return { type: qt.OptionalNone };
}
function tg(t) {
  return { type: qt.OptionalSome, value: t };
}
var ot;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ot || (ot = {}));
function FS() {
  return {
    type: ot.Address,
    version: Rs.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function _d(t) {
  if (t && lg(t, za))
    throw new Error(`Memo exceeds maximum length of ${za} bytes`);
  return { type: ot.MemoString, content: t };
}
function Ru(t, e) {
  return {
    type: ot.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Hl(t) {
  if (Jt(t).byteLength != wc)
    throw Error("Invalid signature");
  return {
    type: ot.MessageSignature,
    data: t
  };
}
function jS(t, e, n) {
  return typeof t == "string" && (t = r3(t)), typeof n == "string" && (n = _d(n)), {
    type: ot.Payload,
    payloadType: se.TokenTransfer,
    recipient: t,
    amount: Qe(e),
    memo: n ?? _d("")
  };
}
function zS(t, e, n, r) {
  return typeof e == "string" && (e = Gn(e)), typeof n == "string" && (n = Gn(n)), {
    type: ot.Payload,
    payloadType: se.ContractCall,
    contractAddress: typeof t == "string" ? ds(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function RS(t) {
  return Gn(t, 4, 1e5);
}
function Ud(t, e, n) {
  return typeof t == "string" && (t = Gn(t)), typeof e == "string" && (e = RS(e)), typeof n == "number" ? {
    type: ot.Payload,
    payloadType: se.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ot.Payload,
    payloadType: se.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function GS() {
  return { type: ot.Payload, payloadType: se.PoisonMicroblock };
}
function Hd(t, e) {
  if (t.byteLength != Cs)
    throw Error(`Coinbase buffer size must be ${Cs} bytes`);
  return e != null ? {
    type: ot.Payload,
    payloadType: se.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ot.Payload,
    payloadType: se.Coinbase,
    coinbaseBytes: t
  };
}
function KS(t, e, n) {
  if (t.byteLength != Cs)
    throw Error(`Coinbase buffer size must be ${Cs} bytes`);
  if (n.byteLength != Tl)
    throw Error(`VRF proof buffer size must be ${Tl} bytes`);
  return {
    type: ot.Payload,
    payloadType: se.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === qt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function VS(t, e, n, r, s, i, o) {
  return {
    type: ot.Payload,
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
function Gn(t, e, n) {
  const r = e || 1, s = n || Cx;
  if (lg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ot.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function qS(t, e, n) {
  return {
    type: ot.Asset,
    address: ds(t),
    contractName: Gn(e),
    assetName: Gn(n)
  };
}
function ds(t) {
  const e = ei.c32addressDecode(t);
  return {
    type: ot.Address,
    version: e[0],
    hash160: e[1]
  };
}
function WS(t, e) {
  const n = ds(t), r = Gn(e);
  return {
    type: ot.Principal,
    prefix: nn.Contract,
    address: n,
    contractName: r
  };
}
function XS(t) {
  const e = ds(t);
  return {
    type: ot.Principal,
    prefix: nn.Standard,
    address: e
  };
}
function vi(t, e) {
  return {
    pubKeyEncoding: t,
    type: ot.TransactionAuthField,
    contents: e
  };
}
function Sr(t) {
  switch (t.type) {
    case ot.Address:
      return Ho(t);
    case ot.Principal:
      return eg(t);
    case ot.LengthPrefixedString:
      return zi(t);
    case ot.MemoString:
      return ZS(t);
    case ot.Asset:
      return rg(t);
    case ot.PostCondition:
      return ig(t);
    case ot.PublicKey:
      return Fl(t);
    case ot.LengthPrefixedList:
      return Gu(t);
    case ot.Payload:
      return og(t);
    case ot.TransactionAuthField:
      return n3(t);
    case ot.MessageSignature:
      return Ku(t);
  }
}
function Ho(t) {
  const e = [];
  return e.push(Jt(Bo(t.version, 1))), e.push(Jt(t.hash160)), _e(e);
}
function ji(t) {
  const e = dn(t, pe) ? t : new pe(t), n = sc(xt(e.readBytes(1))), r = xt(e.readBytes(20));
  return { type: ot.Address, version: n, hash160: r };
}
function eg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === nn.Standard || t.prefix === nn.Contract) && e.push(Ho(t.address)), t.prefix === nn.Contract && e.push(zi(t.contractName)), _e(e);
}
function YS(t) {
  const e = dn(t, pe) ? t : new pe(t), n = e.readUInt8Enum(nn, (i) => {
    throw new tn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === nn.Origin)
    return { type: ot.Principal, prefix: n };
  const r = ji(e);
  if (n === nn.Standard)
    return { type: ot.Principal, prefix: n, address: r };
  const s = Cn(e);
  return {
    type: ot.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function zi(t) {
  const e = [], n = Zs(t.content), r = n.byteLength;
  return e.push(Jt(Bo(r, t.lengthPrefixBytes))), e.push(n), _e(e);
}
function Cn(t, e, n) {
  e = e || 1;
  const r = dn(t, pe) ? t : new pe(t), s = sc(xt(r.readBytes(e))), i = Mo(r.readBytes(s));
  return Gn(i, e, n ?? 128);
}
function ZS(t) {
  const e = [], n = Zs(t.content), r = $3(xt(n), za * 2);
  return e.push(Jt(r)), _e(e);
}
function ng(t) {
  const e = dn(t, pe) ? t : new pe(t);
  let n = Mo(e.readBytes(za));
  return n = n.replace(/\u0000*$/, ""), { type: ot.MemoString, content: n };
}
function rg(t) {
  const e = [];
  return e.push(Ho(t.address)), e.push(zi(t.contractName)), e.push(zi(t.assetName)), _e(e);
}
function Ol(t) {
  const e = dn(t, pe) ? t : new pe(t);
  return {
    type: ot.Asset,
    address: ji(e),
    contractName: Cn(e),
    assetName: Cn(e)
  };
}
function Gu(t) {
  const e = t.values, n = [];
  n.push(Jt(Bo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Sr(r));
  return _e(n);
}
function sg(t, e, n) {
  const r = dn(t, pe) ? t : new pe(t), s = sc(xt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case ot.Address:
        i.push(ji(r));
        break;
      case ot.LengthPrefixedString:
        i.push(Cn(r));
        break;
      case ot.MemoString:
        i.push(ng(r));
        break;
      case ot.Asset:
        i.push(Ol(r));
        break;
      case ot.PostCondition:
        i.push(JS(r));
        break;
      case ot.PublicKey:
        i.push(jl(r));
        break;
      case ot.TransactionAuthField:
        i.push(e3(r));
        break;
    }
  return Ru(i, n);
}
function QS(t) {
  return xt(ig(t));
}
function ig(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(eg(t.principal)), (t.conditionType === be.Fungible || t.conditionType === be.NonFungible) && e.push(rg(t.asset)), t.conditionType === be.NonFungible && e.push(sr(t.assetName)), e.push(t.conditionCode), t.conditionType === be.STX || t.conditionType === be.Fungible || t.conditionType === be.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ai("The post-condition amount may not be larger than 8 bytes");
    e.push(us(t.amount, 8));
  }
  return _e(e);
}
function JS(t) {
  const e = dn(t, pe) ? t : new pe(t), n = e.readUInt8Enum(be, (a) => {
    throw new tn(`Could not read ${a} as PostConditionType`);
  }), r = YS(e);
  let s, i, o;
  switch (n) {
    case be.STX:
      return s = e.readUInt8Enum(go, (c) => {
        throw new tn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${xt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: be.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case be.Fungible:
      return i = Ol(e), s = e.readUInt8Enum(go, (c) => {
        throw new tn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${xt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: be.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case be.NonFungible:
      i = Ol(e);
      const a = er(e);
      return s = e.readUInt8Enum(Ml, (c) => {
        throw new tn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ot.PostCondition,
        conditionType: be.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case be.Staking:
      return s = e.readUInt8Enum(go, (c) => {
        throw new tn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${xt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: be.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case be.PoX: {
      const c = e.readUInt8Enum(Nl, (u) => {
        throw new tn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ot.PostCondition,
        conditionType: be.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function og(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case se.TokenTransfer:
      e.push(sr(t.recipient)), e.push(us(t.amount, 8)), e.push(Sr(t.memo));
      break;
    case se.ContractCall:
      e.push(Sr(t.contractAddress)), e.push(Sr(t.contractName)), e.push(Sr(t.functionName));
      const n = new Uint8Array(4);
      Ns(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(sr(r));
      });
      break;
    case se.SmartContract:
      e.push(Sr(t.contractName)), e.push(Sr(t.codeBody));
      break;
    case se.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Sr(t.contractName)), e.push(Sr(t.codeBody));
      break;
    case se.PoisonMicroblock:
      break;
    case se.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case se.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(sr(t.recipient));
      break;
    case se.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(sr(t.recipient ? tg(t.recipient) : Jp())), e.push(t.vrfProof);
      break;
    case se.TenureChange:
      e.push(Jt(t.tenureHash)), e.push(Jt(t.previousTenureHash)), e.push(Jt(t.burnViewHash)), e.push(Jt(t.previousTenureEnd)), e.push(Ns(new Uint8Array(4), t.previousTenureBlocks)), e.push(Yw(new Uint8Array(1), t.cause)), e.push(Jt(t.publicKeyHash));
      break;
  }
  return _e(e);
}
function t3(t) {
  const e = dn(t, pe) ? t : new pe(t);
  switch (e.readUInt8Enum(se, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case se.TokenTransfer:
      const r = er(e), s = Qe(e.readBytes(8)), i = ng(e);
      return jS(r, s, i);
    case se.ContractCall:
      const o = ji(e), a = Cn(e), c = Cn(e), u = [], d = e.readUInt32BE();
      for (let N = 0; N < d; N++) {
        const B = er(e);
        u.push(B);
      }
      return zS(o, a, c, u);
    case se.SmartContract:
      const l = Cn(e), y = Cn(e, 4, 1e5);
      return Ud(l, y);
    case se.VersionedSmartContract: {
      const N = e.readUInt8Enum(Bl, (nt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${nt}`);
      }), B = Cn(e), J = Cn(e, 4, Fx);
      return Ud(B, J, N);
    }
    case se.PoisonMicroblock:
      return GS();
    case se.Coinbase: {
      const N = e.readBytes(Cs);
      return Hd(N);
    }
    case se.CoinbaseToAltRecipient: {
      const N = e.readBytes(Cs), B = er(e);
      return Hd(N, B);
    }
    case se.NakamotoCoinbase: {
      const N = e.readBytes(Cs), B = er(e), J = e.readBytes(Tl);
      return KS(N, B, J);
    }
    case se.TenureChange:
      const p = xt(e.readBytes(20)), E = xt(e.readBytes(20)), b = xt(e.readBytes(20)), T = xt(e.readBytes(32)), W = e.readUInt32BE(), X = e.readUInt8Enum(Pl, (N) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${N}`);
      }), S = xt(e.readBytes(20));
      return VS(p, E, b, T, W, X, S);
  }
}
function Dl(t) {
  const e = dn(t, pe) ? t : new pe(t);
  return Hl(xt(e.readBytes(wc)));
}
function e3(t) {
  const e = dn(t, pe) ? t : new pe(t), n = e.readUInt8Enum(jn, (r) => {
    throw new tn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case jn.PublicKeyCompressed:
      return vi(ve.Compressed, jl(e));
    case jn.PublicKeyUncompressed:
      return vi(ve.Uncompressed, Yi(U3(jl(e).data)));
    case jn.SignatureCompressed:
      return vi(ve.Compressed, Dl(e));
    case jn.SignatureUncompressed:
      return vi(ve.Uncompressed, Dl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Ku(t) {
  return Jt(t.data);
}
function n3(t) {
  const e = [];
  switch (t.contents.type) {
    case ot.PublicKey:
      e.push(t.pubKeyEncoding === ve.Compressed ? jn.PublicKeyCompressed : jn.PublicKeyUncompressed), e.push(Jt(_3(t.contents.data)));
      break;
    case ot.MessageSignature:
      e.push(t.pubKeyEncoding === ve.Compressed ? jn.SignatureCompressed : jn.SignatureUncompressed), e.push(Ku(t.contents));
      break;
  }
  return _e(e);
}
function Fl(t) {
  return t.data.slice();
}
function jl(t) {
  const e = dn(t, pe) ? t : new pe(t), n = e.readUInt8(), r = n === 4 ? Mx : Bx;
  return Yi(_e([n, e.readBytes(r)]));
}
function Vu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === fe.P2PKH || e === fe.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === fe.P2WPKH || e === fe.P2WSH || e === fe.P2WSHNonSequential) && !r.map((s) => s.data).every(Zi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case fe.P2PKH:
      return sa(t, k3(r[0].data));
    case fe.P2WPKH:
      return sa(t, I3(r[0].data));
    case fe.P2SH:
    case fe.P2SHNonSequential:
      return sa(t, L3(n, r.map(Fl)));
    case fe.P2WSH:
    case fe.P2WSHNonSequential:
      return sa(t, C3(n, r.map(Fl)));
  }
}
function sa(t, e) {
  return { type: ot.Address, version: t, hash160: e };
}
function qu(t) {
  return ei.c32address(t.version, t.hash160);
}
function Od(t) {
  const [e, n, r] = t.split(/\.|::/);
  return qS(e, n, r);
}
function io(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return WS(e, n);
  } else
    return XS(t);
}
function r3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return o3(e, n);
  } else
    return s3(t);
}
function s3(t) {
  const e = ds(t);
  return { type: qt.PrincipalStandard, value: qu(e) };
}
function i3(t) {
  return { type: qt.PrincipalStandard, value: qu(t) };
}
function o3(t, e) {
  const n = ds(t), r = Gn(e);
  return ag(n, r);
}
function ag(t, e) {
  if (Zs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: qt.PrincipalContract,
    value: `${qu(t)}.${e.content}`
  };
}
function a3(t) {
  return { type: qt.ResponseErr, value: t };
}
function c3(t) {
  return { type: qt.ResponseOk, value: t };
}
const l3 = (t) => ({ type: qt.StringASCII, value: t }), u3 = (t) => ({ type: qt.StringUTF8, value: t });
function f3(t) {
  for (const e in t)
    if (!T3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: qt.Tuple, value: t };
}
function er(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new pe(Jt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new pe(t) : e = t;
  switch (e.readUInt8Enum(Oe, (r) => {
    throw new tn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Oe.int:
      return HS(pl(e.readBytes(16)));
    case Oe.uint:
      return OS(e.readBytes(16));
    case Oe.buffer:
      const r = e.readUInt32BE();
      return _S(e.readBytes(r));
    case Oe.true:
      return NS();
    case Oe.false:
      return PS();
    case Oe.address:
      const s = ji(e);
      return i3(s);
    case Oe.contract:
      const i = ji(e), o = Cn(e);
      return ag(i, o);
    case Oe.ok:
      return c3(er(e));
    case Oe.err:
      return a3(er(e));
    case Oe.none:
      return Jp();
    case Oe.some:
      return tg(er(e));
    case Oe.list:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(er(e));
      return DS(c);
    case Oe.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let b = 0; b < u; b++) {
        const T = Cn(e).content;
        if (T === void 0)
          throw new tn('"content" is undefined');
        d[T] = er(e);
      }
      return f3(d);
    case Oe.ascii:
      const l = e.readUInt32BE(), y = zw(e.readBytes(l));
      return l3(y);
    case Oe.utf8:
      const p = e.readUInt32BE(), E = Mo(e.readBytes(p));
      return u3(E);
    default:
      throw new tn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function lr(t, e) {
  return _e([zu(t), e]);
}
function d3(t) {
  return new Uint8Array([zu(t.type)]);
}
function h3(t) {
  return t.type === qt.OptionalNone ? new Uint8Array([zu(t.type)]) : lr(t.type, sr(t.value));
}
function p3(t) {
  const e = new Uint8Array(4);
  return Ns(e, Math.ceil(t.value.length / 2), 0), lr(t.type, ar(e, Jt(t.value)));
}
function g3(t) {
  const e = wu(Hw(BigInt(t.value), BigInt(Tx)), Gp);
  return lr(t.type, e);
}
function y3(t) {
  const e = wu(BigInt(t.value), Gp);
  return lr(t.type, e);
}
function w3(t) {
  return lr(t.type, Ho(ds(t.value)));
}
function b3(t) {
  const [e, n] = B3(t.value);
  return lr(t.type, ar(Ho(ds(e)), zi(Gn(n))));
}
function m3(t) {
  return lr(t.type, sr(t.value));
}
function x3(t) {
  const e = [], n = new Uint8Array(4);
  Ns(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = sr(r);
    e.push(s);
  }
  return lr(t.type, _e(e));
}
function S3(t) {
  const e = [], n = new Uint8Array(4);
  Ns(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Gn(s);
    e.push(zi(i));
    const o = sr(t.value[s]);
    e.push(o);
  }
  return lr(t.type, _e(e));
}
function cg(t, e) {
  const n = [], r = e == "ascii" ? jw(t.value) : Zs(t.value), s = new Uint8Array(4);
  return Ns(s, r.length, 0), n.push(s), n.push(r), lr(t.type, _e(n));
}
function E3(t) {
  return cg(t, "ascii");
}
function A3(t) {
  return cg(t, "utf8");
}
function Dd(t) {
  return xt(sr(t));
}
function sr(t) {
  switch (t.type) {
    case qt.BoolTrue:
    case qt.BoolFalse:
      return d3(t);
    case qt.OptionalNone:
    case qt.OptionalSome:
      return h3(t);
    case qt.Buffer:
      return p3(t);
    case qt.UInt:
      return y3(t);
    case qt.Int:
      return g3(t);
    case qt.PrincipalStandard:
      return w3(t);
    case qt.PrincipalContract:
      return b3(t);
    case qt.ResponseOk:
    case qt.ResponseErr:
      return m3(t);
    case qt.List:
      return x3(t);
    case qt.Tuple:
      return S3(t);
    case qt.StringASCII:
      return E3(t);
    case qt.StringUTF8:
      return A3(t);
    default:
      throw new Ai("Unable to serialize. Invalid Clarity Value.");
  }
}
const v3 = (t) => t.length % 2 ? `0${t}` : t, $3 = (t, e) => t.padEnd(e, "0"), lg = (t, e) => t ? Zs(t).length > e : !1;
function zl(t) {
  return Fp(t);
}
const xo = (t) => iS(Du(t)), Wu = (t) => xt(MS(t)), k3 = (t) => xt(xo(t)), I3 = (t) => {
  const e = xo(t), n = ar(new Uint8Array([0]), new Uint8Array([e.length]), e), r = xo(n);
  return xt(r);
}, L3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = xo(r);
  return xt(s);
}, C3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = Du(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = _e(i), a = xo(o);
  return xt(a);
};
function T3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function B3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Me.hmacSha256Sync = (t, ...e) => {
  const n = Wp.create(Du, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Yi(t) {
  return t = typeof t == "string" ? Jt(t) : t, {
    type: ot.PublicKey,
    data: t
  };
}
function M3(t, e, n = ve.Compressed) {
  const r = Vw(e), s = new Sn(Df(r.r), Df(r.s)), i = Rt.fromSignature(t, s, r.recoveryId), o = n === ve.Compressed;
  return i.toHex(o);
}
function N3(t) {
  return typeof t == "string" ? t : xt(t);
}
const Xu = N3;
function ug(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Kw;
}
function Zi(t) {
  return !Xu(t).startsWith("04");
}
function P3(t) {
  t = bu(t);
  const e = ug(t);
  return xt(No(t.slice(0, 32), e));
}
function _3(t) {
  return Rt.fromHex(Xu(t)).toHex(!0);
}
function U3(t) {
  return Rt.fromHex(Xu(t)).toHex(!1);
}
function H3(t, e) {
  t = bu(t);
  const [n, r] = oc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Bo(r, 1) + Sn.fromHex(n).toCompactHex();
}
function Yu() {
  return {
    type: ot.MessageSignature,
    data: xt(new Uint8Array(wc))
  };
}
function fg(t, e, n, r) {
  const s = Vu(0, t, 1, [Yi(e)]).hash160, i = Zi(e) ? ve.Compressed : ve.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Qe(n),
    fee: Qe(r),
    keyEncoding: i,
    signature: Yu()
  };
}
function So(t) {
  return "signature" in t;
}
function Fd(t) {
  return t === fe.P2SH || t === fe.P2WSH;
}
function O3(t) {
  return t === fe.P2SHNonSequential || t === fe.P2WSHNonSequential;
}
function jd(t) {
  const e = zl(t);
  return e.nonce = 0, e.fee = 0, So(e) ? e.signature = Yu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function D3(t) {
  const e = [
    t.hashMode,
    Jt(t.signer),
    us(t.nonce, 8),
    us(t.fee, 8),
    t.keyEncoding,
    Ku(t.signature)
  ];
  return _e(e);
}
function F3(t) {
  const e = [
    t.hashMode,
    Jt(t.signer),
    us(t.nonce, 8),
    us(t.fee, 8)
  ], n = Ru(t.fields);
  e.push(Gu(n));
  const r = new Uint8Array(2);
  return Ww(r, t.signaturesRequired, 0), e.push(r), _e(e);
}
function j3(t, e) {
  const n = xt(e.readBytes(20)), r = BigInt(`0x${xt(e.readBytes(8))}`), s = BigInt(`0x${xt(e.readBytes(8))}`), i = e.readUInt8Enum(ve, (a) => {
    throw new tn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === fe.P2WPKH && i != ve.Compressed)
    throw new tn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Dl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function z3(t, e) {
  const n = xt(e.readBytes(20)), r = BigInt("0x" + xt(e.readBytes(8))), s = BigInt("0x" + xt(e.readBytes(8))), i = sg(e, ot.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case ot.PublicKey:
        Zi(u.contents.data) || (o = !0);
        break;
      case ot.MessageSignature:
        if (u.pubKeyEncoding === ve.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new vs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === fe.P2WSH || t === fe.P2WSHNonSequential))
    throw new vs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Kc(t) {
  return So(t) ? D3(t) : F3(t);
}
function Vc(t) {
  const e = t.readUInt8Enum(fe, (n) => {
    throw new tn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === fe.P2PKH || e === fe.P2WPKH ? j3(e, t) : z3(e, t);
}
function dg(t, e, n, r) {
  const i = t + xt(new Uint8Array([e])) + xt(us(n, 8)) + xt(us(r, 8));
  if (Jt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Wu(Jt(i));
}
function hg(t, e, n) {
  const r = 33 + wc, s = Zi(e.data) ? ve.Compressed : ve.Uncompressed, i = t + v3(s.toString(16)) + n, o = Jt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Wu(o);
}
function R3(t, e, n, r, s) {
  const i = dg(t, e, n, r), o = H3(s, i), a = Yi(P3(s)), c = hg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function pg(t, e, n, r, s, i) {
  const o = dg(t, e, n, r), a = Yi(M3(o, i, s)), c = hg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function G3() {
  const t = fg(fe.P2PKH, "", 0, 0);
  return t.signer = FS().hash160, t.keyEncoding = ve.Compressed, t.signature = Yu(), t;
}
function zd(t, e, n) {
  return So(t) ? K3(t, e, n) : V3(t, e, n);
}
function K3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = pg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Vu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new vs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function V3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ot.PublicKey:
        Zi(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case ot.MessageSignature:
        c.pubKeyEncoding === ve.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = pg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Fd(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new vs("Too many signatures");
        break;
    }
  if (Fd(t.hashMode) && o !== t.signaturesRequired || O3(t.hashMode) && o < t.signaturesRequired)
    throw new vs("Incorrect number of signatures");
  if (i && (t.hashMode === fe.P2WSH || t.hashMode === fe.P2WSHNonSequential))
    throw new vs("Uncompressed keys are not allowed in this hash mode");
  const a = Vu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new vs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function gg(t) {
  return {
    authType: Te.Standard,
    spendingCondition: t
  };
}
function yg(t, e) {
  return {
    authType: Te.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || fg(fe.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Rd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Te.Standard:
        return gg(jd(t.spendingCondition));
      case Te.Sponsored:
        return yg(jd(t.spendingCondition), G3());
      default:
        throw new Ga("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function q3(t, e) {
  switch (t.authType) {
    case Te.Standard:
      return zd(t.spendingCondition, e, Te.Standard);
    case Te.Sponsored:
      return zd(t.spendingCondition, e, Te.Standard);
    default:
      throw new Ga("Invalid origin auth type");
  }
}
function W3(t, e) {
  switch (t.authType) {
    case Te.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Qe(e)
      };
      return { ...t, spendingCondition: n };
    case Te.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Qe(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function X3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Qe(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Y3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Qe(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Z3(t, e) {
  const n = {
    ...e,
    nonce: Qe(e.nonce),
    fee: Qe(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Q3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Te.Standard:
      e.push(Kc(t.spendingCondition));
      break;
    case Te.Sponsored:
      e.push(Kc(t.spendingCondition)), e.push(Kc(t.sponsorSpendingCondition));
      break;
  }
  return _e(e);
}
function J3(t) {
  const e = t.readUInt8Enum(Te, (r) => {
    throw new tn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Te.Standard:
      return n = Vc(t), gg(n);
    case Te.Sponsored:
      n = Vc(t);
      const r = Vc(t);
      return yg(n, r);
  }
}
class tE {
  constructor({ auth: e, payload: n, postConditions: r = Ru([]), postConditionMode: s = Ra.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Ix(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Qe(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = yn.Any;
  }
  signBegin() {
    const e = zl(this);
    return e.auth = Rd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = zl(this);
    return e.auth = Rd(e.auth), e.txid();
  }
  verifyOrigin() {
    return q3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Te.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Te.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Te.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Yi(e), r = this.auth.spendingCondition;
    if (r && !So(r)) {
      const s = Zi(n.data);
      r.fields.push(vi(s ? ve.Compressed : ve.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = R3(n, r, e.fee, e.nonce, s);
    if (So(e))
      e.signature = Hl(i);
    else {
      const a = ug(s);
      e.fields.push(vi(a ? ve.Compressed : ve.Uncompressed, Hl(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Wu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Ga("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Z3(this.auth, e);
  }
  setFee(e) {
    this.auth = W3(this.auth, e);
  }
  setNonce(e) {
    this.auth = X3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Ga("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Y3(this.auth, e);
  }
  serialize() {
    return xt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ai('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ai('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ai('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ai('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Ns(n, this.chainId, 0), e.push(n), e.push(Q3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Gu(this.postConditions)), e.push(og(this.payload)), _e(e);
  }
}
function eE(t) {
  const e = dn(t, pe) ? t : new pe(t), n = e.readUInt8Enum(zs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = J3(e), i = e.readUInt8Enum(yn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Ra, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = sg(e, ot.PostCondition), c = t3(e), u = new tE({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Gd = BigInt("18446744073709551615");
function qc(t) {
  const e = Qe(t);
  if (e < 0n || e > Gd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Gd} (u64 max), received: ${e}`);
  return e;
}
var Rl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Rl || (Rl = {}));
var Gl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Gl || (Gl = {}));
function nE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: be.STX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: nn.Origin } : io(t.address),
        conditionCode: ia(t.condition),
        amount: qc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: be.Fungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: nn.Origin } : io(t.address),
        conditionCode: ia(t.condition),
        amount: qc(t.amount),
        asset: Od(t.asset)
      };
    case "nft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: be.NonFungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: nn.Origin } : io(t.address),
        conditionCode: ia(t.condition),
        asset: Od(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: be.Staking,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: nn.Origin } : io(t.address),
        conditionCode: ia(t.condition),
        amount: qc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: be.PoX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: nn.Origin } : io(t.address),
        conditionCode: rE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ia(t) {
  return Rl[t];
}
function rE(t) {
  return Gl[t];
}
function wg(t) {
  const e = nE(t);
  return QS(e);
}
function sE(t, e, n) {
  return Qu(bg(t), n);
}
function bg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Eo(r);
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
    return BigInt(`0x${aE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Zu(t, e = 8) {
  return (typeof t == "bigint" ? t : bg(t)).toString(16).padStart(e * 2, "0");
}
function Qu(t, e = 16) {
  const n = Zu(t, e);
  return Eo(n);
}
function iE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const oE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function aE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += oE[n];
  return e;
}
function Eo(t) {
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
function Ju(t) {
  return new TextEncoder().encode(t);
}
function cE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function lE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Kd(t) {
  if (t.some(lE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function tf(...t) {
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
function Lr(t) {
  return tf(...t.map((e) => typeof e == "number" ? Kd([e]) : e instanceof Array ? Kd(e) : e));
}
function xc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Kl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Kl || (Kl = {}));
Kl.Mainnet;
const uE = 128, fE = 128, mg = 16;
var Vl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Vl || (Vl = {}));
var Vd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Vd || (Vd = {}));
var qd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(qd || (qd = {}));
var Fn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Fn || (Fn = {}));
const Wc = ["onChainOnly", "offChainOnly", "any"];
Wc[0] + "", Fn.OnChainOnly, Wc[1] + "", Fn.OffChainOnly, Wc[2] + "", Fn.Any, Fn.OnChainOnly + "", Fn.OnChainOnly, Fn.OffChainOnly + "", Fn.OffChainOnly, Fn.Any + "", Fn.Any;
var ql;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ql || (ql = {}));
ql.Mainnet;
var Wd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Wd || (Wd = {}));
var xs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(xs || (xs = {}));
var Xd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Xd || (Xd = {}));
var Yd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Zd || (Zd = {}));
var Qd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Qd || (Qd = {}));
var Jd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Jd || (Jd = {}));
var th;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(th || (th = {}));
var Wl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Wl || (Wl = {}));
var eh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(eh || (eh = {}));
var nh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(nh || (nh = {}));
function Xl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function dE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function xg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function hE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Xl(t.outputLen), Xl(t.blockLen);
}
function pE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function gE(t, e) {
  xg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xc = {
  number: Xl,
  bool: dE,
  bytes: xg,
  hash: hE,
  exists: pE,
  output: gE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Yc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Zn = (t, e) => t << 32 - e | t >>> e, yE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Sg(t) {
  if (typeof t == "string" && (t = wE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let bE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ri(t) {
  const e = (r) => t().update(Sg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function mE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let ef = class extends bE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Yc(this.buffer);
  }
  update(e) {
    Xc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Sg(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Yc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Xc.exists(this), Xc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    mE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Yc(e), c = this.outputLen;
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
const xE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Eg = Uint8Array.from({ length: 16 }, (t, e) => e), SE = Eg.map((t) => (9 * t + 5) % 16);
let nf = [Eg], rf = [SE];
for (let t = 0; t < 4; t++)
  for (let e of [nf, rf])
    e.push(e[t].map((n) => xE[n]));
const Ag = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), EE = nf.map((t, e) => t.map((n) => Ag[e][n])), AE = rf.map((t, e) => t.map((n) => Ag[e][n])), vE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), $E = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), oa = (t, e) => t << e | t >>> 32 - e;
function rh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const aa = new Uint32Array(16);
let kE = class extends ef {
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
      aa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, b = vE[p], T = $E[p], W = nf[p], X = rf[p], S = EE[p], N = AE[p];
      for (let B = 0; B < 16; B++) {
        const J = oa(r + rh(p, i, a, u) + aa[W[B]] + b, S[B]) + l | 0;
        r = l, l = u, u = oa(a, 10) | 0, a = i, i = J;
      }
      for (let B = 0; B < 16; B++) {
        const J = oa(s + rh(E, o, c, d) + aa[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = oa(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    aa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ri(() => new kE());
const IE = (t, e, n) => t & e ^ ~t & n, LE = (t, e, n) => t & e ^ t & n ^ e & n, CE = new Uint32Array([
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
let vg = class extends ef {
  constructor() {
    super(64, 32, 8, !1), this.A = Wr[0] | 0, this.B = Wr[1] | 0, this.C = Wr[2] | 0, this.D = Wr[3] | 0, this.E = Wr[4] | 0, this.F = Wr[5] | 0, this.G = Wr[6] | 0, this.H = Wr[7] | 0;
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
      Xr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Xr[l - 15], p = Xr[l - 2], E = Zn(y, 7) ^ Zn(y, 18) ^ y >>> 3, b = Zn(p, 17) ^ Zn(p, 19) ^ p >>> 10;
      Xr[l] = b + Xr[l - 7] + E + Xr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Zn(a, 6) ^ Zn(a, 11) ^ Zn(a, 25), p = d + y + IE(a, c, u) + CE[l] + Xr[l] | 0, b = (Zn(r, 2) ^ Zn(r, 13) ^ Zn(r, 22)) + LE(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, TE = class extends vg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ri(() => new vg());
ri(() => new TE());
const ca = BigInt(2 ** 32 - 1), Yl = BigInt(32);
function $g(t, e = !1) {
  return e ? { h: Number(t & ca), l: Number(t >> Yl & ca) } : { h: Number(t >> Yl & ca) | 0, l: Number(t & ca) | 0 };
}
function BE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = $g(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const ME = (t, e) => BigInt(t >>> 0) << Yl | BigInt(e >>> 0), NE = (t, e, n) => t >>> n, PE = (t, e, n) => t << 32 - n | e >>> n, _E = (t, e, n) => t >>> n | e << 32 - n, UE = (t, e, n) => t << 32 - n | e >>> n, HE = (t, e, n) => t << 64 - n | e >>> n - 32, OE = (t, e, n) => t >>> n - 32 | e << 64 - n, DE = (t, e) => e, FE = (t, e) => t, jE = (t, e, n) => t << n | e >>> 32 - n, zE = (t, e, n) => e << n | t >>> 32 - n, RE = (t, e, n) => e << n - 32 | t >>> 64 - n, GE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function KE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const VE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), qE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, WE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), XE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, YE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ZE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ht = {
  fromBig: $g,
  split: BE,
  toBig: ME,
  shrSH: NE,
  shrSL: PE,
  rotrSH: _E,
  rotrSL: UE,
  rotrBH: HE,
  rotrBL: OE,
  rotr32H: DE,
  rotr32L: FE,
  rotlSH: jE,
  rotlSL: zE,
  rotlBH: RE,
  rotlBL: GE,
  add: KE,
  add3L: VE,
  add3H: qE,
  add4L: WE,
  add4H: XE,
  add5H: ZE,
  add5L: YE
}, [QE, JE] = Ht.split([
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
let Sc = class extends ef {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: E, Hh: b, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = b | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      Yr[S] = e.getUint32(n), Zr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = Yr[S - 15] | 0, B = Zr[S - 15] | 0, J = Ht.rotrSH(N, B, 1) ^ Ht.rotrSH(N, B, 8) ^ Ht.shrSH(N, B, 7), nt = Ht.rotrSL(N, B, 1) ^ Ht.rotrSL(N, B, 8) ^ Ht.shrSL(N, B, 7), K = Yr[S - 2] | 0, z = Zr[S - 2] | 0, A = Ht.rotrSH(K, z, 19) ^ Ht.rotrBH(K, z, 61) ^ Ht.shrSH(K, z, 6), P = Ht.rotrSL(K, z, 19) ^ Ht.rotrBL(K, z, 61) ^ Ht.shrSL(K, z, 6), M = Ht.add4L(nt, P, Zr[S - 7], Zr[S - 16]), q = Ht.add4H(M, J, A, Yr[S - 7], Yr[S - 16]);
      Yr[S] = q | 0, Zr[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: E, Gh: b, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = Ht.rotrSH(l, y, 14) ^ Ht.rotrSH(l, y, 18) ^ Ht.rotrBH(l, y, 41), B = Ht.rotrSL(l, y, 14) ^ Ht.rotrSL(l, y, 18) ^ Ht.rotrBL(l, y, 41), J = l & p ^ ~l & b, nt = y & E ^ ~y & T, K = Ht.add5L(X, B, nt, JE[S], Zr[S]), z = Ht.add5H(K, W, N, J, QE[S], Yr[S]), A = K | 0, P = Ht.rotrSH(r, s, 28) ^ Ht.rotrBH(r, s, 34) ^ Ht.rotrBH(r, s, 39), M = Ht.rotrSL(r, s, 28) ^ Ht.rotrBL(r, s, 34) ^ Ht.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, at = s & o ^ s & c ^ o & c;
      W = b | 0, X = T | 0, b = p | 0, T = E | 0, p = l | 0, E = y | 0, { h: l, l: y } = Ht.add(u | 0, d | 0, z | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = Ht.add3L(A, M, at);
      r = Ht.add3H(Y, z, P, q), s = Y | 0;
    }
    ({ h: r, l: s } = Ht.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ht.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ht.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ht.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Ht.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: E } = Ht.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: b, l: T } = Ht.add(this.Gh | 0, this.Gl | 0, b | 0, T | 0), { h: W, l: X } = Ht.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, E, b, T, W, X);
  }
  roundClean() {
    Yr.fill(0), Zr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, tA = class extends Sc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, eA = class extends Sc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, nA = class extends Sc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ri(() => new Sc());
ri(() => new tA());
ri(() => new eA());
ri(() => new nA());
function rA(t, e, n) {
  const s = uE;
  if (mA(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Vl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ze;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ze || (ze = {}));
let sA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, kg = class extends sA {
  constructor(e) {
    super(e);
  }
};
function Ec(t) {
  const e = [];
  return e.push(Eo(Zu(t.version, 1))), e.push(Eo(t.hash160)), Lr(e);
}
function iA(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ec(t.address)), t.prefix === Wl.Contract && e.push(Ao(t.contractName)), Lr(e);
}
function Ao(t) {
  const e = [], n = Ju(t.content), r = n.byteLength;
  return e.push(Eo(Zu(r, t.lengthPrefixBytes))), e.push(n), Lr(e);
}
function oA(t) {
  const e = [];
  return e.push(Ec(t.address)), e.push(Ao(t.contractName)), e.push(Ao(t.assetName)), Lr(e);
}
function Ig(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(iA(t.principal)), (t.conditionType === xs.Fungible || t.conditionType === xs.NonFungible) && e.push(oA(t.assetInfo)), t.conditionType === xs.NonFungible && e.push(Gs(t.assetName)), e.push(t.conditionCode), t.conditionType === xs.STX || t.conditionType === xs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new kg("The post-condition amount may not be larger than 8 bytes");
    e.push(sE(t.amount, !1, 8));
  }
  return Lr(e);
}
function ur(t, e) {
  return Lr([t, e]);
}
function aA(t) {
  return new Uint8Array([t.type]);
}
function cA(t) {
  return t.type === ze.OptionalNone ? new Uint8Array([t.type]) : ur(t.type, Gs(t.value));
}
function lA(t) {
  const e = new Uint8Array(4);
  return xc(e, t.buffer.length, 0), ur(t.type, tf(e, t.buffer));
}
function uA(t) {
  const e = Qu(iE(t.value, BigInt(fE)), mg);
  return ur(t.type, e);
}
function fA(t) {
  const e = Qu(t.value, mg);
  return ur(t.type, e);
}
function dA(t) {
  return ur(t.type, Ec(t.address));
}
function hA(t) {
  return ur(t.type, tf(Ec(t.address), Ao(t.contractName)));
}
function pA(t) {
  return ur(t.type, Gs(t.value));
}
function gA(t) {
  const e = [], n = new Uint8Array(4);
  xc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Gs(r);
    e.push(s);
  }
  return ur(t.type, Lr(e));
}
function yA(t) {
  const e = [], n = new Uint8Array(4);
  xc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = rA(s);
    e.push(Ao(i));
    const o = Gs(t.data[s]);
    e.push(o);
  }
  return ur(t.type, Lr(e));
}
function Lg(t, e) {
  const n = [], r = e == "ascii" ? cE(t.data) : Ju(t.data), s = new Uint8Array(4);
  return xc(s, r.length, 0), n.push(s), n.push(r), ur(t.type, Lr(n));
}
function wA(t) {
  return Lg(t, "ascii");
}
function bA(t) {
  return Lg(t, "utf8");
}
function Gs(t) {
  switch (t.type) {
    case ze.BoolTrue:
    case ze.BoolFalse:
      return aA(t);
    case ze.OptionalNone:
    case ze.OptionalSome:
      return cA(t);
    case ze.Buffer:
      return lA(t);
    case ze.UInt:
      return fA(t);
    case ze.Int:
      return uA(t);
    case ze.PrincipalStandard:
      return dA(t);
    case ze.PrincipalContract:
      return hA(t);
    case ze.ResponseOk:
    case ze.ResponseErr:
      return pA(t);
    case ze.List:
      return gA(t);
    case ze.Tuple:
      return yA(t);
    case ze.StringASCII:
      return wA(t);
    case ze.StringUTF8:
      return bA(t);
    default:
      throw new kg("Unable to serialize. Invalid Clarity Value.");
  }
}
const mA = (t, e) => t ? Ju(t).length > e : !1, xA = "connect-ui";
let $a, Cg, wn = !1, Zl = !1;
const Ir = (t, e = "") => () => {
}, SA = (t, e) => () => {
}, EA = "{visibility:hidden}.hydrated{visibility:inherit}", sh = {}, AA = "http://www.w3.org/2000/svg", vA = "http://www.w3.org/1999/xhtml", $A = (t) => t != null, sf = (t) => (t = typeof t, t === "object" || t === "function");
function Tg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Mt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !sf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Ql(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Ql(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Ql = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, kA = {}, IA = (t) => t && t.$tag$ === kA, LA = (t, e) => t != null && !sf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, CA = (t) => Qi(t).$hostElement$, TA = (t, e, n) => {
  const r = Ze.ce(e, n);
  return t.dispatchEvent(r), r;
}, ih = /* @__PURE__ */ new WeakMap(), BA = (t, e, n) => {
  let r = Ka.get(t);
  ZA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ka.set(t, r);
}, MA = (t, e, n, r) => {
  var s;
  let i = Bg(e);
  const o = Ka.get(i);
  if (t = t.nodeType === 11 ? t : ir, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = ih.get(t), c;
      if (a || ih.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = ir.createElement("style"), c.innerHTML = o;
          const u = (s = Ze.$nonce$) !== null && s !== void 0 ? s : Tg(ir);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, NA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Ir("attachStyles", e.$tagName$), i = MA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Bg = (t, e) => "sc-" + t.$tagName$, oh = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = ch(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = ah(n), d = ah(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : ch(Ac, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Ze.rel(t, e, n, !1), r && Ze.ael(t, e, r, !1);
    else {
      const c = sf(r);
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
}, PA = /\s/, ah = (t) => t ? t.split(PA) : [], Mg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || sh, o = e.$attrs$ || sh;
  for (r in i)
    r in o || oh(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    oh(s, r, i[r], o[r], n, e.$flags$);
}, of = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = ir.createTextNode(s.$text$);
  else {
    if (wn || (wn = s.$tag$ === "svg"), o = s.$elm$ = ir.createElementNS(wn ? AA : vA, s.$tag$), wn && s.$tag$ === "foreignObject" && (wn = !1), Mg(null, s, wn), $A($a) && o["s-si"] !== $a && o.classList.add(o["s-si"] = $a), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = of(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? wn = !1 : o.tagName === "foreignObject" && (wn = !0);
  }
  return o;
}, Ng = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Cg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = of(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Pg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, _A = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : la(a, d) ? (lo(a, d), a = e[++s], d = r[++i]) : la(c, l) ? (lo(c, l), c = e[--o], l = r[--u]) : la(a, l) ? (lo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : la(c, d) ? (lo(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (y = of(e && e[i], n, i), d = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? Ng(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Pg(e, s, o);
}, la = (t, e) => t.$tag$ === e.$tag$, lo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (wn = i === "svg" ? !0 : i === "foreignObject" ? !1 : wn, Mg(t, e, wn), r !== null && s !== null ? _A(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Ng(n, null, e, s, 0, s.length - 1)) : r !== null && Pg(r, 0, r.length - 1), wn && i === "svg" && (wn = !1)) : t.$text$ !== o && (n.data = o);
}, UA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Ql(null, null), s = IA(e) ? e : Mt(null, null, e);
  Cg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, $a = n["s-sc"], lo(r, s);
}, _g = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, af = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return _g(t, t.$ancestorComponent$), JA(() => HA(t, e));
}, HA = (t, e) => {
  const n = Ir("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), jA(s, () => OA(t, r, e));
}, OA = async (t, e, n) => {
  const r = t.$hostElement$, s = Ir("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && NA(t);
  const o = Ir("render", t.$cmpMeta$.$tagName$);
  DA(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => FA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, DA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, UA(t, e);
  } catch (r) {
    vo(r, t.$hostElement$);
  }
  return null;
}, FA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Ir("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Hg(n), r(), t.$onReadyResolve$(n), s || Ug()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && lf(() => af(t, !1)), t.$flags$ &= -517;
}, Ug = (t) => {
  Hg(ir.documentElement), lf(() => TA(Ac, "appload", { detail: { namespace: xA } }));
}, jA = (t, e) => t && t.then ? t.then(e) : e(), Hg = (t) => t.classList.add("hydrated"), zA = (t, e) => Qi(t).$instanceValues$.get(e), RA = (t, e, n, r) => {
  const s = Qi(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = LA(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && af(s, !1));
}, Og = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return zA(this, i);
        },
        set(a) {
          RA(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Ze.jmp(() => {
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
}, GA = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = YA(n), s.then) {
        const c = SA();
        s = await s, c();
      }
      s.isProxied || (Og(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Ir("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        vo(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Bg(n);
      if (!Ka.has(c)) {
        const u = Ir("registerStyles", n.$tagName$);
        BA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => af(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, KA = (t) => {
  if (!(Ze.$flags$ & 1)) {
    const e = Qi(t), n = e.$cmpMeta$, r = Ir("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            _g(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), GA(t, e, n);
    }
    r();
  }
}, VA = (t) => {
  Ze.$flags$ & 1 || Qi(t);
}, qA = (t, e = {}) => {
  var n;
  const r = Ir(), s = [], i = e.exclude || [], o = Ac.customElements, a = ir.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ ir.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(Ze, e), Ze.$resourcesUrl$ = new URL(e.resourcesUrl || "./", ir.baseURI).href, t.map((p) => {
    p[1].map((E) => {
      const b = {
        $flags$: E[0],
        $tagName$: E[1],
        $members$: E[2],
        $listeners$: E[3]
      };
      b.$members$ = E[2];
      const T = b.$tagName$, W = class extends HTMLElement {
        // StencilLazyHost
        constructor(X) {
          super(X), X = this, XA(X, b), b.$flags$ & 1 && X.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : Ze.jmp(() => KA(this));
        }
        disconnectedCallback() {
          Ze.jmp(() => VA(this));
        }
        componentOnReady() {
          return Qi(this).$onReadyPromise$;
        }
      };
      b.$lazyBundleId$ = p[0], !i.includes(T) && !o.get(T) && (s.push(T), o.define(T, Og(
        W,
        b,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + EA, u.setAttribute("data-styles", "");
    const p = (n = Ze.$nonce$) !== null && n !== void 0 ? n : Tg(ir);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((p) => p.connectedCallback()) : Ze.jmp(() => l = setTimeout(Ug, 30)), r();
}, cf = /* @__PURE__ */ new WeakMap(), Qi = (t) => cf.get(t), WA = (t, e) => cf.set(e.$lazyInstance$ = t, e), XA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], cf.set(t, n);
}, ch = (t, e) => e in t, vo = (t, e) => (0, console.error)(t, e), Zc = /* @__PURE__ */ new Map(), YA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Zc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Zc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => v$).then(o, vo);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Zc.set(s, o), o[r]), vo);
}, Ka = /* @__PURE__ */ new Map(), Ac = typeof window < "u" ? window : {}, ir = Ac.document || { head: {} }, Ze = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Dg = (t) => Promise.resolve(t), ZA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), lh = [], Fg = [], QA = (t, e) => (n) => {
  t.push(n), Zl || (Zl = !0, Ze.$flags$ & 4 ? lf(Jl) : Ze.raf(Jl));
}, uh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      vo(n);
    }
  t.length = 0;
}, Jl = () => {
  uh(lh), uh(Fg), (Zl = lh.length > 0) && Ze.raf(Jl);
}, lf = (t) => Dg().then(t), JA = /* @__PURE__ */ QA(Fg), t4 = () => Dg(), e4 = (t, e) => typeof window > "u" ? Promise.resolve() : t4().then(() => qA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var n4 = Object.defineProperty, r4 = Object.defineProperties, s4 = Object.getOwnPropertyDescriptors, Va = Object.getOwnPropertySymbols, jg = Object.prototype.hasOwnProperty, zg = Object.prototype.propertyIsEnumerable, fh = (t, e, n) => e in t ? n4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, An = (t, e) => {
  for (var n in e || (e = {})) jg.call(e, n) && fh(t, n, e[n]);
  if (Va) for (var n of Va(e)) zg.call(e, n) && fh(t, n, e[n]);
  return t;
}, Kn = (t, e) => r4(t, s4(e)), Rg = (t, e) => {
  var n = {};
  for (var r in t) jg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Va) for (var r of Va(t)) e.indexOf(r) < 0 && zg.call(t, r) && (n[r] = t[r]);
  return n;
};
function Gg() {
  return yc(Os()) || window.StacksProvider || window.BlockstackProvider;
}
function vc(t) {
  return t ? typeof t == "string" ? Fs.fromName(t) : "version" in t ? t : "url" in t ? new Il({ url: t.url }) : t.transactionVersion === zs.Mainnet ? new Il({ url: t.client.baseUrl }) : new Ll({ url: t.client.baseUrl }) : new Ll();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var i4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(i4 || {}), o4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(o4 || {}), uf = (t) => {
  let e = t;
  if (!e) {
    let n = new S0(["store_write"], document.location.href);
    e = new kl({ appConfig: n });
  }
  return e;
};
function Kg(t) {
  try {
    return uf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Vg = (t) => {
  let e = uf(t).loadUserData().appPrivateKey, n = Xe.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function a4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [js.Mainnet]: "mainnet", [js.Testnet]: "testnet" }, a = vc(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function c4(t) {
  let e = vc(t.network), n = uf(t.userSession), r = Kn(An({}, t), { network: e, userSession: n });
  return An({ stxAddress: a4(r) }, r);
}
async function l4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(wg) : n = n.map((r) => xt(Ig(r)))), new Xe.TokenSigner("ES256k", e).signAsync(Kn(An({}, t), { postConditions: n }));
}
function u4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(wg) : e = e.map((n) => xt(Ig(n)))), Xe.createUnsecuredToken(Kn(An({}, t), { postConditions: e }));
}
var f4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Jt(a.replace(/^0x/, "")), u = eE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Kn(An({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Kn(An({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, d4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Rg(e, ["amount", "appDetails", "userSession"]);
  if (Kg(s)) {
    let { privateKey: a, publicKey: c } = Vg(s), u = Kn(An({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), l4(u, a);
  }
  let o = Kn(An({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), u4(o);
};
async function h4(t, e, n) {
  let r = await e(Kn(An(An({}, c4(t)), t), { network: vc(t.network) }));
  return f4({ token: r, options: t }, n);
}
function p4(t, e = Gg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return h4(t, d4, e);
}
function qg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Kn(An({}, t), { message: Dd(e), domain: Dd(n) }) : Kn(An({}, t), { message: xt(Gs(e)), domain: xt(Gs(n)) });
}
async function g4(t, e) {
  return new Xe.TokenSigner("ES256k", e).signAsync(qg(t));
}
async function y4(t) {
  let e = t, { userSession: n } = e, r = Rg(e, ["userSession"]);
  if (Kg(n)) {
    let { privateKey: s, publicKey: i } = Vg(n), o = Kn(An({}, r), { publicKey: i });
    return g4(o, s);
  }
  return Xe.createUnsecuredToken(qg(t));
}
var w4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(w4 || {}), Wg = "asigna-stx", dh = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Wg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(m4(t, e), "*");
}), b4 = { authenticationRequest: async (t) => dh(t, "authenticationRequest"), transactionRequest: async (t) => dh(t, "transactionRequest") }, m4 = (t, e) => ({ source: Wg, [e]: t }), x4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = b4);
};
x4();
var S4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function E4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Os(), o = Gg();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    e4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : S4, c = hx(a), u = document.createElement("connect-modal");
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
    let y = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", y), u.remove());
    };
    document.addEventListener("keydown", y);
  };
}
var ua = E4(p4);
function fs(t, e, n) {
  return ff(sn(t, e), n);
}
function sn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = xe(r);
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
      const r = $4(BigInt(`0x${Gt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Gt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function hh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Oo(t, e = 8) {
  return (typeof t == "bigint" ? t : sn(t, !1)).toString(16).padStart(e * 2, "0");
}
function $c(t) {
  return parseInt(t, 16);
}
function ff(t, e = 16) {
  const n = Oo(t, e);
  return xe(n);
}
function A4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function v4(t, e) {
  return t & BigInt(1) << e;
}
function $4(t, e) {
  return v4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const k4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Gt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += k4[n];
  return e;
}
function xe(t) {
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
function Ji(t) {
  return new TextEncoder().encode(t);
}
function df(t) {
  return new TextDecoder().decode(t);
}
function Xg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function I4(t) {
  return String.fromCharCode.apply(null, t);
}
function L4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ph(t) {
  if (t.some(L4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function kc(...t) {
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
function Ue(t) {
  return kc(...t.map((e) => typeof e == "number" ? ph([e]) : e instanceof Array ? ph(e) : e));
}
var gh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(yh || (yh = {}));
var wh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(wh || (wh = {}));
const Yg = 33, Qc = 32;
function C4(t) {
  if (t.length < Qc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Qc * 2), r = t.slice(2 + Qc * 2);
  return {
    recoveryId: $c(e),
    r: n,
    s: r
  };
}
function T4(t) {
  const e = typeof t == "string" ? xe(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function B4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function M4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function N4(t, e) {
  return t[e];
}
function P4(t, e, n = 0) {
  return t[n] = e, t;
}
function _4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ks(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var tu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(tu || (tu = {}));
const U4 = tu.Mainnet, H4 = 128, O4 = 128, Zg = 16, Ts = 32, eu = 80, Ic = 65, D4 = 32, F4 = 64, qa = 34;
var pt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(pt || (pt = {}));
var zt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(zt || (zt = {}));
var nu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(nu || (nu = {}));
var un;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(un || (un = {}));
const ka = ["onChainOnly", "offChainOnly", "any"], bh = {
  [ka[0]]: un.OnChainOnly,
  [ka[1]]: un.OffChainOnly,
  [ka[2]]: un.Any,
  [un.OnChainOnly]: un.OnChainOnly,
  [un.OffChainOnly]: un.OffChainOnly,
  [un.Any]: un.Any
};
function j4(t) {
  if (t in bh)
    return bh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${ka.join(", ")}`);
}
var Wa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Wa || (Wa = {}));
Wa.Mainnet;
var Ri;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ri || (Ri = {}));
var fn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(fn || (fn = {}));
var Be;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Be || (Be = {}));
var de;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(de || (de = {}));
var Xa;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Xa || (Xa = {}));
var $e;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})($e || ($e = {}));
var $o;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})($o || ($o = {}));
var ru;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ru || (ru = {}));
var ko;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ko || (ko = {}));
var mh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(mh || (mh = {}));
var xh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(xh || (xh = {}));
function su(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function z4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Qg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function R4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  su(t.outputLen), su(t.blockLen);
}
function G4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function K4(t, e) {
  Qg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ks = {
  number: su,
  bool: z4,
  bytes: Qg,
  hash: R4,
  exists: G4,
  output: K4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Qn = (t, e) => t << 32 - e | t >>> e, V4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!V4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function q4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hf(t) {
  if (typeof t == "string" && (t = q4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Jg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function si(t) {
  const e = (r) => t().update(hf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function W4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class pf extends Jg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Jc(this.buffer);
  }
  update(e) {
    ks.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Jc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ks.exists(this), ks.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    W4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Jc(e), c = this.outputLen;
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
const X4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ty = Uint8Array.from({ length: 16 }, (t, e) => e), Y4 = ty.map((t) => (9 * t + 5) % 16);
let gf = [ty], yf = [Y4];
for (let t = 0; t < 4; t++)
  for (let e of [gf, yf])
    e.push(e[t].map((n) => X4[n]));
const ey = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Z4 = gf.map((t, e) => t.map((n) => ey[e][n])), Q4 = yf.map((t, e) => t.map((n) => ey[e][n])), J4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), tv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), fa = (t, e) => t << e | t >>> 32 - e;
function Sh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const da = new Uint32Array(16);
class ev extends pf {
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
      da[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, b = J4[p], T = tv[p], W = gf[p], X = yf[p], S = Z4[p], N = Q4[p];
      for (let B = 0; B < 16; B++) {
        const J = fa(r + Sh(p, i, a, u) + da[W[B]] + b, S[B]) + l | 0;
        r = l, l = u, u = fa(a, 10) | 0, a = i, i = J;
      }
      for (let B = 0; B < 16; B++) {
        const J = fa(s + Sh(E, o, c, d) + da[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = fa(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    da.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const nv = si(() => new ev()), rv = (t, e, n) => t & e ^ ~t & n, sv = (t, e, n) => t & e ^ t & n ^ e & n, iv = new Uint32Array([
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
class ny extends pf {
  constructor() {
    super(64, 32, 8, !1), this.A = Qr[0] | 0, this.B = Qr[1] | 0, this.C = Qr[2] | 0, this.D = Qr[3] | 0, this.E = Qr[4] | 0, this.F = Qr[5] | 0, this.G = Qr[6] | 0, this.H = Qr[7] | 0;
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
      Jr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Jr[l - 15], p = Jr[l - 2], E = Qn(y, 7) ^ Qn(y, 18) ^ y >>> 3, b = Qn(p, 17) ^ Qn(p, 19) ^ p >>> 10;
      Jr[l] = b + Jr[l - 7] + E + Jr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Qn(a, 6) ^ Qn(a, 11) ^ Qn(a, 25), p = d + y + rv(a, c, u) + iv[l] + Jr[l] | 0, b = (Qn(r, 2) ^ Qn(r, 13) ^ Qn(r, 22)) + sv(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Jr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class ov extends ny {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const wf = si(() => new ny());
si(() => new ov());
const ha = BigInt(2 ** 32 - 1), iu = BigInt(32);
function ry(t, e = !1) {
  return e ? { h: Number(t & ha), l: Number(t >> iu & ha) } : { h: Number(t >> iu & ha) | 0, l: Number(t & ha) | 0 };
}
function av(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ry(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const cv = (t, e) => BigInt(t >>> 0) << iu | BigInt(e >>> 0), lv = (t, e, n) => t >>> n, uv = (t, e, n) => t << 32 - n | e >>> n, fv = (t, e, n) => t >>> n | e << 32 - n, dv = (t, e, n) => t << 32 - n | e >>> n, hv = (t, e, n) => t << 64 - n | e >>> n - 32, pv = (t, e, n) => t >>> n - 32 | e << 64 - n, gv = (t, e) => e, yv = (t, e) => t, wv = (t, e, n) => t << n | e >>> 32 - n, bv = (t, e, n) => e << n | t >>> 32 - n, mv = (t, e, n) => e << n - 32 | t >>> 64 - n, xv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Sv(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ev = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Av = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, vv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $v = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, kv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Iv = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ot = {
  fromBig: ry,
  split: av,
  toBig: cv,
  shrSH: lv,
  shrSL: uv,
  rotrSH: fv,
  rotrSL: dv,
  rotrBH: hv,
  rotrBL: pv,
  rotr32H: gv,
  rotr32L: yv,
  rotlSH: wv,
  rotlSL: bv,
  rotlBH: mv,
  rotlBL: xv,
  add: Sv,
  add3L: Ev,
  add3H: Av,
  add4L: vv,
  add4H: $v,
  add5H: Iv,
  add5L: kv
}, [Lv, Cv] = Ot.split([
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
class Lc extends pf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: E, Hh: b, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, E, b, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = b | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      ts[S] = e.getUint32(n), es[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = ts[S - 15] | 0, B = es[S - 15] | 0, J = Ot.rotrSH(N, B, 1) ^ Ot.rotrSH(N, B, 8) ^ Ot.shrSH(N, B, 7), nt = Ot.rotrSL(N, B, 1) ^ Ot.rotrSL(N, B, 8) ^ Ot.shrSL(N, B, 7), K = ts[S - 2] | 0, z = es[S - 2] | 0, A = Ot.rotrSH(K, z, 19) ^ Ot.rotrBH(K, z, 61) ^ Ot.shrSH(K, z, 6), P = Ot.rotrSL(K, z, 19) ^ Ot.rotrBL(K, z, 61) ^ Ot.shrSL(K, z, 6), M = Ot.add4L(nt, P, es[S - 7], es[S - 16]), q = Ot.add4H(M, J, A, ts[S - 7], ts[S - 16]);
      ts[S] = q | 0, es[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: E, Gh: b, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = Ot.rotrSH(l, y, 14) ^ Ot.rotrSH(l, y, 18) ^ Ot.rotrBH(l, y, 41), B = Ot.rotrSL(l, y, 14) ^ Ot.rotrSL(l, y, 18) ^ Ot.rotrBL(l, y, 41), J = l & p ^ ~l & b, nt = y & E ^ ~y & T, K = Ot.add5L(X, B, nt, Cv[S], es[S]), z = Ot.add5H(K, W, N, J, Lv[S], ts[S]), A = K | 0, P = Ot.rotrSH(r, s, 28) ^ Ot.rotrBH(r, s, 34) ^ Ot.rotrBH(r, s, 39), M = Ot.rotrSL(r, s, 28) ^ Ot.rotrBL(r, s, 34) ^ Ot.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, at = s & o ^ s & c ^ o & c;
      W = b | 0, X = T | 0, b = p | 0, T = E | 0, p = l | 0, E = y | 0, { h: l, l: y } = Ot.add(u | 0, d | 0, z | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = Ot.add3L(A, M, at);
      r = Ot.add3H(Y, z, P, q), s = Y | 0;
    }
    ({ h: r, l: s } = Ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ot.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ot.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Ot.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: E } = Ot.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: b, l: T } = Ot.add(this.Gh | 0, this.Gl | 0, b | 0, T | 0), { h: W, l: X } = Ot.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, E, b, T, W, X);
  }
  roundClean() {
    ts.fill(0), es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Tv extends Lc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Bv extends Lc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Mv extends Lc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
si(() => new Lc());
si(() => new Tv());
const Nv = si(() => new Bv());
si(() => new Mv());
function sy(t) {
  if (xe(t).byteLength != Ic)
    throw Error("Invalid signature");
  return {
    type: pt.MessageSignature,
    data: t
  };
}
function uo(t, e) {
  return { type: pt.Address, version: t, hash160: e };
}
function $i(t) {
  return ei.c32address(t.version, t.hash160);
}
function Vs(t, e, n) {
  const r = e || 1, s = n || H4;
  if (Sy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: pt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function bf(t) {
  const e = ei.c32addressDecode(t);
  return {
    type: pt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Z;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Z || (Z = {}));
function Pv(t) {
  if (t.type === Z.PrincipalStandard)
    return $i(t.address);
  if (t.type === Z.PrincipalContract)
    return `${$i(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function iy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Hv(e, n);
  } else
    return _v(t);
}
function _v(t) {
  const e = bf(t);
  return { type: Z.PrincipalStandard, address: e };
}
function Uv(t) {
  return { type: Z.PrincipalStandard, address: t };
}
function Hv(t, e) {
  const n = bf(t), r = Vs(e);
  return oy(n, r);
}
function oy(t, e) {
  if (Ji(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Z.PrincipalContract, address: t, contractName: e };
}
function tl(t, e = !1) {
  switch (t.type) {
    case Z.BoolTrue:
      return !0;
    case Z.BoolFalse:
      return !1;
    case Z.Int:
    case Z.UInt:
      return e ? t.value.toString() : t.value;
    case Z.Buffer:
      return `0x${Gt(t.buffer)}`;
    case Z.OptionalNone:
      return null;
    case Z.OptionalSome:
      return nr(t.value);
    case Z.ResponseErr:
      return nr(t.value);
    case Z.ResponseOk:
      return nr(t.value);
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return Pv(t);
    case Z.List:
      return t.list.map((r) => nr(r));
    case Z.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = nr(t.data[r]);
      }), n;
    case Z.StringASCII:
      return t.data;
    case Z.StringUTF8:
      return t.data;
  }
}
function nr(t) {
  switch (t.type) {
    case Z.ResponseErr:
      return { type: ss(t), value: tl(t, !0), success: !1 };
    case Z.ResponseOk:
      return { type: ss(t), value: tl(t, !0), success: !0 };
    default:
      return { type: ss(t), value: tl(t, !0) };
  }
}
function ss(t) {
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
      return `(optional ${ss(t.value)})`;
    case Z.ResponseErr:
      return `(response UnknownType ${ss(t.value)})`;
    case Z.ResponseOk:
      return `(response ${ss(t.value)} UnknownType)`;
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return "principal";
    case Z.List:
      return `(list ${t.list.length} ${t.list.length ? ss(t.list[0]) : "UnknownType"})`;
    case Z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${ss(t.data[e])})`).join(" ")})`;
    case Z.StringASCII:
      return `(string-ascii ${Xg(t.data).length})`;
    case Z.StringUTF8:
      return `(string-utf8 ${Ji(t.data).length})`;
  }
}
const ay = () => ({ type: Z.BoolTrue }), cy = () => ({ type: Z.BoolFalse }), Ov = (t) => t ? ay() : cy(), Eh = BigInt("0xffffffffffffffffffffffffffffffff"), Dv = BigInt(0), Ah = BigInt("0x7fffffffffffffffffffffffffffffff"), vh = BigInt("-170141183460469231731687303715884105728"), Fv = (t) => {
  const e = sn(t, !0);
  if (e > Ah)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Ah}`);
  if (e < vh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${vh}`);
  return { type: Z.Int, value: e };
}, or = (t) => {
  const e = sn(t, !1);
  if (e < Dv)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Eh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Eh}`);
  return { type: Z.UInt, value: e };
}, ly = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Z.Buffer, buffer: t };
};
function uy() {
  return { type: Z.OptionalNone };
}
function fy(t) {
  return { type: Z.OptionalSome, value: t };
}
function jv(t) {
  return { type: Z.ResponseErr, value: t };
}
function zv(t) {
  return { type: Z.ResponseOk, value: t };
}
function Rv(t) {
  return { type: Z.List, list: t };
}
function qs(t) {
  for (const e in t)
    if (!M8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Z.Tuple, data: t };
}
const We = (t) => ({ type: Z.StringASCII, data: t }), Gv = (t) => ({ type: Z.StringUTF8, data: t });
class dy extends Jg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ks.hash(e);
    const r = hf(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const hy = (t, e, n) => new dy(t, e).update(n).digest();
hy.create = (t, e) => new dy(t, e);
Me.hmacSha256Sync = (t, ...e) => {
  const n = hy.create(wf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Gi(t) {
  return {
    type: pt.PublicKey,
    data: xe(t)
  };
}
function Kv(t, e, n = $e.Compressed) {
  const r = C4(e.data), s = new Sn(hh(r.r), hh(r.s)), i = Rt.fromSignature(t, s, r.recoveryId), o = n === $e.Compressed;
  return i.toHex(o);
}
function Vv(t) {
  return { type: pt.PublicKey, data: t };
}
function to(t) {
  return !Gt(t.data).startsWith("04");
}
function Ya(t) {
  return t.data.slice();
}
function qv(t) {
  const e = Yv(t), n = No(e.data.slice(0, 32), e.compressed);
  return Gi(Gt(n));
}
function Wv(t) {
  const e = typeof t == "string" ? t : Gt(t), n = Rt.fromHex(e).toHex(!0);
  return Gi(n);
}
function Xv(t) {
  const e = typeof t == "string" ? t : Gt(t), n = Rt.fromHex(e).toHex(!1);
  return Gi(n);
}
function ou(t) {
  const e = t.readUInt8(), n = e === 4 ? F4 : D4;
  return Vv(Ue([e, t.readBytes(n)]));
}
function Yv(t) {
  const e = T4(t), n = e.length == Yg;
  return { data: e, compressed: n };
}
function Zv(t, e) {
  const [n, r] = oc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Oo(r, 1) + Sn.fromHex(n).toCompactHex();
  return sy(i);
}
function Qv(t) {
  return qv(t.data);
}
function Jv(t, e, n) {
  return typeof t == "string" && (t = iy(t)), typeof n == "string" && (n = Ih(n)), {
    type: pt.Payload,
    payloadType: zt.TokenTransfer,
    recipient: t,
    amount: sn(e, !1),
    memo: n ?? Ih("")
  };
}
function t8(t, e, n, r) {
  return typeof t == "string" && (t = bf(t)), typeof e == "string" && (e = Vs(e)), typeof n == "string" && (n = Vs(n)), {
    type: pt.Payload,
    payloadType: zt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function $h(t, e, n) {
  return typeof t == "string" && (t = Vs(t)), typeof e == "string" && (e = l8(e)), typeof n == "number" ? {
    type: pt.Payload,
    payloadType: zt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: pt.Payload,
    payloadType: zt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function e8() {
  return { type: pt.Payload, payloadType: zt.PoisonMicroblock };
}
function kh(t, e) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  return e != null ? {
    type: pt.Payload,
    payloadType: zt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: pt.Payload,
    payloadType: zt.Coinbase,
    coinbaseBytes: t
  };
}
function n8(t, e, n) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  if (n.byteLength != eu)
    throw Error(`VRF proof buffer size must be ${eu} bytes`);
  return {
    type: pt.Payload,
    payloadType: zt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var au;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(au || (au = {}));
function r8(t, e, n, r, s, i, o) {
  return {
    type: pt.Payload,
    payloadType: zt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function py(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case zt.TokenTransfer:
      e.push(Pe(t.recipient)), e.push(fs(t.amount, !1, 8)), e.push(Er(t.memo));
      break;
    case zt.ContractCall:
      e.push(Er(t.contractAddress)), e.push(Er(t.contractName)), e.push(Er(t.functionName));
      const n = new Uint8Array(4);
      Ks(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Pe(r));
      });
      break;
    case zt.SmartContract:
      e.push(Er(t.contractName)), e.push(Er(t.codeBody));
      break;
    case zt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Er(t.contractName)), e.push(Er(t.codeBody));
      break;
    case zt.PoisonMicroblock:
      break;
    case zt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case zt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Pe(t.recipient));
      break;
    case zt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Pe(t.recipient ? fy(t.recipient) : uy())), e.push(t.vrfProof);
      break;
    case zt.TenureChange:
      e.push(xe(t.tenureHash)), e.push(xe(t.previousTenureHash)), e.push(xe(t.burnViewHash)), e.push(xe(t.previousTenureEnd)), e.push(Ks(new Uint8Array(4), t.previousTenureBlocks)), e.push(P4(new Uint8Array(1), t.cause)), e.push(xe(t.publicKeyHash));
      break;
  }
  return Ue(e);
}
function s8(t) {
  switch (t.readUInt8Enum(zt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case zt.TokenTransfer:
      const n = Bn(t), r = sn(t.readBytes(8), !1), s = yy(t);
      return Jv(n, r, s);
    case zt.ContractCall:
      const i = Ki(t), o = Tn(t), a = Tn(t), c = [], u = t.readUInt32BE();
      for (let S = 0; S < u; S++) {
        const N = Bn(t);
        c.push(N);
      }
      return t8(i, o, a, c);
    case zt.SmartContract:
      const d = Tn(t), l = Tn(t, 4, 1e5);
      return $h(d, l);
    case zt.VersionedSmartContract: {
      const S = t.readUInt8Enum(nu, (J) => {
        throw new Error(`Cannot recognize ClarityVersion: ${J}`);
      }), N = Tn(t), B = Tn(t, 4, 1e5);
      return $h(N, B, S);
    }
    case zt.PoisonMicroblock:
      return e8();
    case zt.Coinbase: {
      const S = t.readBytes(Ts);
      return kh(S);
    }
    case zt.CoinbaseToAltRecipient: {
      const S = t.readBytes(Ts), N = Bn(t);
      return kh(S, N);
    }
    case zt.NakamotoCoinbase: {
      const S = t.readBytes(Ts), N = Bn(t), B = t.readBytes(eu);
      return n8(S, N, B);
    }
    case zt.TenureChange:
      const y = Gt(t.readBytes(20)), p = Gt(t.readBytes(20)), E = Gt(t.readBytes(20)), b = Gt(t.readBytes(32)), T = t.readUInt32BE(), W = t.readUInt8Enum(au, (S) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${S}`);
      }), X = Gt(t.readBytes(20));
      return r8(y, p, E, b, T, W, X);
  }
}
class Cc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ss extends Cc {
  constructor(e) {
    super(e);
  }
}
class xn extends Cc {
  constructor(e) {
    super(e);
  }
}
class Za extends Cc {
  constructor(e) {
    super(e);
  }
}
class Is extends Cc {
  constructor(e) {
    super(e);
  }
}
var zn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(zn || (zn = {}));
function cu(t) {
  return sy(Gt(t.readBytes(Ic)));
}
function ki(t, e) {
  return {
    pubKeyEncoding: t,
    type: pt.TransactionAuthField,
    contents: e
  };
}
function i8(t) {
  const e = t.readUInt8Enum(zn, (n) => {
    throw new xn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case zn.PublicKeyCompressed:
      return ki($e.Compressed, ou(t));
    case zn.PublicKeyUncompressed:
      return ki($e.Uncompressed, Xv(ou(t).data));
    case zn.SignatureCompressed:
      return ki($e.Compressed, cu(t));
    case zn.SignatureUncompressed:
      return ki($e.Uncompressed, cu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function mf(t) {
  return xe(t.data);
}
function o8(t) {
  const e = [];
  switch (t.contents.type) {
    case pt.PublicKey:
      e.push(t.pubKeyEncoding === $e.Compressed ? zn.PublicKeyCompressed : zn.PublicKeyUncompressed), e.push(Ya(Wv(t.contents.data)));
      break;
    case pt.MessageSignature:
      e.push(t.pubKeyEncoding === $e.Compressed ? zn.SignatureCompressed : zn.SignatureUncompressed), e.push(mf(t.contents));
      break;
  }
  return Ue(e);
}
function Er(t) {
  switch (t.type) {
    case pt.Address:
      return Do(t);
    case pt.Principal:
      return gy(t);
    case pt.LengthPrefixedString:
      return Vi(t);
    case pt.MemoString:
      return u8(t);
    case pt.AssetInfo:
      return wy(t);
    case pt.PostCondition:
      return f8(t);
    case pt.PublicKey:
      return Ya(t);
    case pt.LengthPrefixedList:
      return Ef(t);
    case pt.Payload:
      return py(t);
    case pt.TransactionAuthField:
      return o8(t);
    case pt.MessageSignature:
      return mf(t);
  }
}
function a8() {
  return {
    type: pt.Address,
    version: Xa.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function xf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === de.SerializeP2PKH || e === de.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === de.SerializeP2WPKH || e === de.SerializeP2WSH || e === de.SerializeP2WSHNonSequential) && !r.every(to))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case de.SerializeP2PKH:
      return uo(t, L8(r[0].data));
    case de.SerializeP2WPKH:
      return uo(t, C8(r[0].data));
    case de.SerializeP2SH:
    case de.SerializeP2SHNonSequential:
      return uo(t, T8(n, r.map(Ya)));
    case de.SerializeP2WSH:
    case de.SerializeP2WSHNonSequential:
      return uo(t, B8(n, r.map(Ya)));
  }
}
function Do(t) {
  const e = [];
  return e.push(xe(Oo(t.version, 1))), e.push(xe(t.hash160)), Ue(e);
}
function Ki(t) {
  const e = $c(Gt(t.readBytes(1))), n = Gt(t.readBytes(20));
  return { type: pt.Address, version: e, hash160: n };
}
function gy(t) {
  const e = [];
  return e.push(t.prefix), e.push(Do(t.address)), t.prefix === ko.Contract && e.push(Vi(t.contractName)), Ue(e);
}
function c8(t) {
  const e = t.readUInt8Enum(ko, (s) => {
    throw new xn(`Unexpected Principal payload type: ${s}`);
  }), n = Ki(t);
  if (e === ko.Standard)
    return { type: pt.Principal, prefix: e, address: n };
  const r = Tn(t);
  return {
    type: pt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Vi(t) {
  const e = [], n = Ji(t.content), r = n.byteLength;
  return e.push(xe(Oo(r, t.lengthPrefixBytes))), e.push(n), Ue(e);
}
function Tn(t, e, n) {
  e = e || 1;
  const r = $c(Gt(t.readBytes(e))), s = df(t.readBytes(r));
  return Vs(s, e, n ?? 128);
}
function l8(t) {
  return Vs(t, 4, 1e5);
}
function Ih(t) {
  if (t && Sy(t, qa))
    throw new Error(`Memo exceeds maximum length of ${qa} bytes`);
  return { type: pt.MemoString, content: t };
}
function u8(t) {
  const e = [], n = Ji(t.content), r = I8(Gt(n), qa * 2);
  return e.push(xe(r)), Ue(e);
}
function yy(t) {
  let e = df(t.readBytes(qa));
  return e = e.replace(/\u0000*$/, ""), { type: pt.MemoString, content: e };
}
function wy(t) {
  const e = [];
  return e.push(Do(t.address)), e.push(Vi(t.contractName)), e.push(Vi(t.assetName)), Ue(e);
}
function lu(t) {
  return {
    type: pt.AssetInfo,
    address: Ki(t),
    contractName: Tn(t),
    assetName: Tn(t)
  };
}
function Sf(t, e) {
  return {
    type: pt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ef(t) {
  const e = t.values, n = [];
  n.push(xe(Oo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Er(r));
  return Ue(n);
}
function by(t, e, n) {
  const r = $c(Gt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case pt.Address:
        s.push(Ki(t));
        break;
      case pt.LengthPrefixedString:
        s.push(Tn(t));
        break;
      case pt.MemoString:
        s.push(yy(t));
        break;
      case pt.AssetInfo:
        s.push(lu(t));
        break;
      case pt.PostCondition:
        s.push(d8(t));
        break;
      case pt.PublicKey:
        s.push(ou(t));
        break;
      case pt.TransactionAuthField:
        s.push(i8(t));
        break;
    }
  return Sf(s, n);
}
function f8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(gy(t.principal)), (t.conditionType === fn.Fungible || t.conditionType === fn.NonFungible) && e.push(wy(t.assetInfo)), t.conditionType === fn.NonFungible && e.push(Pe(t.assetName)), e.push(t.conditionCode), t.conditionType === fn.STX || t.conditionType === fn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ss("The post-condition amount may not be larger than 8 bytes");
    e.push(fs(t.amount, !1, 8));
  }
  return Ue(e);
}
function d8(t) {
  const e = t.readUInt8Enum(fn, (o) => {
    throw new xn(`Could not read ${o} as PostConditionType`);
  }), n = c8(t);
  let r, s, i;
  switch (e) {
    case fn.STX:
      return r = t.readUInt8Enum($o, (a) => {
        throw new xn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Gt(t.readBytes(8))}`), {
        type: pt.PostCondition,
        conditionType: fn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case fn.Fungible:
      return s = lu(t), r = t.readUInt8Enum($o, (a) => {
        throw new xn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Gt(t.readBytes(8))}`), {
        type: pt.PostCondition,
        conditionType: fn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case fn.NonFungible:
      s = lu(t);
      const o = Bn(t);
      return r = t.readUInt8Enum(ru, (a) => {
        throw new xn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: pt.PostCondition,
        conditionType: fn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function fr(t, e) {
  return Ue([t, e]);
}
function h8(t) {
  return new Uint8Array([t.type]);
}
function p8(t) {
  return t.type === Z.OptionalNone ? new Uint8Array([t.type]) : fr(t.type, Pe(t.value));
}
function g8(t) {
  const e = new Uint8Array(4);
  return Ks(e, t.buffer.length, 0), fr(t.type, kc(e, t.buffer));
}
function y8(t) {
  const e = ff(A4(t.value, BigInt(O4)), Zg);
  return fr(t.type, e);
}
function w8(t) {
  const e = ff(t.value, Zg);
  return fr(t.type, e);
}
function b8(t) {
  return fr(t.type, Do(t.address));
}
function m8(t) {
  return fr(t.type, kc(Do(t.address), Vi(t.contractName)));
}
function x8(t) {
  return fr(t.type, Pe(t.value));
}
function S8(t) {
  const e = [], n = new Uint8Array(4);
  Ks(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Pe(r);
    e.push(s);
  }
  return fr(t.type, Ue(e));
}
function E8(t) {
  const e = [], n = new Uint8Array(4);
  Ks(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Vs(s);
    e.push(Vi(i));
    const o = Pe(t.data[s]);
    e.push(o);
  }
  return fr(t.type, Ue(e));
}
function my(t, e) {
  const n = [], r = e == "ascii" ? Xg(t.data) : Ji(t.data), s = new Uint8Array(4);
  return Ks(s, r.length, 0), n.push(s), n.push(r), fr(t.type, Ue(n));
}
function A8(t) {
  return my(t, "ascii");
}
function v8(t) {
  return my(t, "utf8");
}
function Pe(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return h8(t);
    case Z.OptionalNone:
    case Z.OptionalSome:
      return p8(t);
    case Z.Buffer:
      return g8(t);
    case Z.UInt:
      return w8(t);
    case Z.Int:
      return y8(t);
    case Z.PrincipalStandard:
      return b8(t);
    case Z.PrincipalContract:
      return m8(t);
    case Z.ResponseOk:
    case Z.ResponseErr:
      return x8(t);
    case Z.List:
      return S8(t);
    case Z.Tuple:
      return E8(t);
    case Z.StringASCII:
      return A8(t);
    case Z.StringUTF8:
      return v8(t);
    default:
      throw new Ss("Unable to serialize. Invalid Clarity Value.");
  }
}
function $8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Lh = /* @__PURE__ */ new Map();
function xy(t, e) {
  const n = Lh.get(t);
  if (n !== void 0)
    return n(e);
  const r = $8(t);
  return Lh.set(t, r), xy(t, e);
}
class yo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return _4(this.readBytes(4), 0);
  }
  readUInt8() {
    return N4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return B4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Gt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Gt(n);
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
    if (xy(e, r))
      return r;
    throw n(r);
  }
}
function Bn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new yo(xe(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new yo(t) : e = t;
  switch (e.readUInt8Enum(Z, (r) => {
    throw new xn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Z.Int:
      return Fv(e.readBytes(16));
    case Z.UInt:
      return or(e.readBytes(16));
    case Z.Buffer:
      const r = e.readUInt32BE();
      return ly(e.readBytes(r));
    case Z.BoolTrue:
      return ay();
    case Z.BoolFalse:
      return cy();
    case Z.PrincipalStandard:
      const s = Ki(e);
      return Uv(s);
    case Z.PrincipalContract:
      const i = Ki(e), o = Tn(e);
      return oy(i, o);
    case Z.ResponseOk:
      return zv(Bn(e));
    case Z.ResponseErr:
      return jv(Bn(e));
    case Z.OptionalNone:
      return uy();
    case Z.OptionalSome:
      return fy(Bn(e));
    case Z.List:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(Bn(e));
      return Rv(c);
    case Z.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let b = 0; b < u; b++) {
        const T = Tn(e).content;
        if (T === void 0)
          throw new xn('"content" is undefined');
        d[T] = Bn(e);
      }
      return qs(d);
    case Z.StringASCII:
      const l = e.readUInt32BE(), y = I4(e.readBytes(l));
      return We(y);
    case Z.StringUTF8:
      const p = e.readUInt32BE(), E = df(e.readBytes(p));
      return Gv(E);
    default:
      throw new xn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const k8 = (t) => t.length % 2 == 0 ? t : `0${t}`, I8 = (t, e) => t.padEnd(e, "0"), Sy = (t, e) => t ? Ji(t).length > e : !1;
function uu(t) {
  return Fp(t);
}
const Io = (t) => nv(wf(t)), Af = (t) => Gt(Nv(t)), L8 = (t) => Gt(Io(t)), C8 = (t) => {
  const e = Io(t), n = kc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Io(n);
  return Gt(r);
}, T8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = Io(r);
  return Gt(s);
}, B8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = wf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ue(i), a = Io(o);
  return Gt(a);
};
function M8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Ey(t) {
  const e = Pe(t);
  return `0x${Gt(e)}`;
}
function N8(t) {
  return Bn(t);
}
const Ci = (t) => {
  try {
    return ei.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function vf() {
  return {
    type: pt.MessageSignature,
    data: Gt(new Uint8Array(Ic))
  };
}
function Ay(t, e, n, r) {
  const s = xf(0, t, 1, [Gi(e)]).hash160, i = to(Gi(e)) ? $e.Compressed : $e.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: sn(n, !1),
    fee: sn(r, !1),
    keyEncoding: i,
    signature: vf()
  };
}
function Lo(t) {
  return "signature" in t;
}
function Ch(t) {
  return t === de.SerializeP2SH || t === de.SerializeP2WSH;
}
function P8(t) {
  return t === de.SerializeP2SHNonSequential || t === de.SerializeP2WSHNonSequential;
}
function Th(t) {
  const e = uu(t);
  return e.nonce = 0, e.fee = 0, Lo(e) ? e.signature = vf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function _8(t) {
  const e = [
    t.hashMode,
    xe(t.signer),
    fs(t.nonce, !1, 8),
    fs(t.fee, !1, 8),
    t.keyEncoding,
    mf(t.signature)
  ];
  return Ue(e);
}
function U8(t) {
  const e = [
    t.hashMode,
    xe(t.signer),
    fs(t.nonce, !1, 8),
    fs(t.fee, !1, 8)
  ], n = Sf(t.fields);
  e.push(Ef(n));
  const r = new Uint8Array(2);
  return M4(r, t.signaturesRequired, 0), e.push(r), Ue(e);
}
function H8(t, e) {
  const n = Gt(e.readBytes(20)), r = BigInt(`0x${Gt(e.readBytes(8))}`), s = BigInt(`0x${Gt(e.readBytes(8))}`), i = e.readUInt8Enum($e, (a) => {
    throw new xn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === de.SerializeP2WPKH && i != $e.Compressed)
    throw new xn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = cu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function O8(t, e) {
  const n = Gt(e.readBytes(20)), r = BigInt("0x" + Gt(e.readBytes(8))), s = BigInt("0x" + Gt(e.readBytes(8))), i = by(e, pt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case pt.PublicKey:
        to(u.contents) || (o = !0);
        break;
      case pt.MessageSignature:
        if (u.pubKeyEncoding === $e.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Is("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === de.SerializeP2WSH || t === de.SerializeP2WSHNonSequential))
    throw new Is("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function el(t) {
  return Lo(t) ? _8(t) : U8(t);
}
function nl(t) {
  const e = t.readUInt8Enum(de, (n) => {
    throw new xn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === de.SerializeP2PKH || e === de.SerializeP2WPKH ? H8(e, t) : O8(e, t);
}
function vy(t, e, n, r) {
  const i = t + Gt(new Uint8Array([e])) + Gt(fs(n, !1, 8)) + Gt(fs(r, !1, 8));
  if (xe(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Af(xe(i));
}
function $y(t, e, n) {
  const r = 33 + Ic, s = to(e) ? $e.Compressed : $e.Uncompressed, i = t + k8(s.toString(16)) + n.data, o = xe(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Af(o);
}
function D8(t, e, n, r, s) {
  const i = vy(t, e, n, r), o = Zv(s, i), a = Qv(s), c = $y(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ky(t, e, n, r, s, i) {
  const o = vy(t, e, n, r), a = Gi(Kv(o, i, s)), c = $y(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function F8() {
  const t = Ay(de.SerializeP2PKH, "", 0, 0);
  return t.signer = a8().hash160, t.keyEncoding = $e.Compressed, t.signature = vf(), t;
}
function Bh(t, e, n) {
  return Lo(t) ? j8(t, e, n) : z8(t, e, n);
}
function j8(t, e, n) {
  const { pubKey: r, nextSigHash: s } = ky(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = xf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Is(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function z8(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case pt.PublicKey:
        to(c.contents) || (i = !0), r.push(c.contents);
        break;
      case pt.MessageSignature:
        c.pubKeyEncoding === $e.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = ky(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Ch(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Is("Too many signatures");
        break;
    }
  if (Ch(t.hashMode) && o !== t.signaturesRequired || P8(t.hashMode) && o < t.signaturesRequired)
    throw new Is("Incorrect number of signatures");
  if (i && (t.hashMode === de.SerializeP2WSH || t.hashMode === de.SerializeP2WSHNonSequential))
    throw new Is("Uncompressed keys are not allowed in this hash mode");
  const a = xf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Is(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Iy(t) {
  return {
    authType: Be.Standard,
    spendingCondition: t
  };
}
function Ly(t, e) {
  return {
    authType: Be.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ay(de.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Mh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Be.Standard:
        return Iy(Th(t.spendingCondition));
      case Be.Sponsored:
        return Ly(Th(t.spendingCondition), F8());
      default:
        throw new Za("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function R8(t, e) {
  switch (t.authType) {
    case Be.Standard:
      return Bh(t.spendingCondition, e, Be.Standard);
    case Be.Sponsored:
      return Bh(t.spendingCondition, e, Be.Standard);
    default:
      throw new Za("Invalid origin auth type");
  }
}
function G8(t, e) {
  switch (t.authType) {
    case Be.Standard:
      const n = {
        ...t.spendingCondition,
        fee: sn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Be.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: sn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function K8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: sn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function V8(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: sn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function q8(t, e) {
  const n = {
    ...e,
    nonce: sn(e.nonce, !1),
    fee: sn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function W8(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Be.Standard:
      e.push(el(t.spendingCondition));
      break;
    case Be.Sponsored:
      e.push(el(t.spendingCondition)), e.push(el(t.sponsorSpendingCondition));
      break;
  }
  return Ue(e);
}
function X8(t) {
  const e = t.readUInt8Enum(Be, (r) => {
    throw new xn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Be.Standard:
      return n = nl(t), Iy(n);
    case Be.Sponsored:
      n = nl(t);
      const r = nl(t);
      return Ly(n, r);
  }
}
class Y8 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: sn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? U4, this.postConditionMode = i ?? Ri.Deny, this.postConditions = s ?? Sf([]), o)
      this.anchorMode = j4(o);
    else
      switch (r.payloadType) {
        case zt.Coinbase:
        case zt.CoinbaseToAltRecipient:
        case zt.NakamotoCoinbase:
        case zt.PoisonMicroblock:
        case zt.TenureChange:
          this.anchorMode = un.OnChainOnly;
          break;
        case zt.ContractCall:
        case zt.SmartContract:
        case zt.VersionedSmartContract:
        case zt.TokenTransfer:
          this.anchorMode = un.Any;
          break;
      }
  }
  signBegin() {
    const e = uu(this);
    return e.auth = Mh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = uu(this);
    return e.auth = Mh(e.auth), e.txid();
  }
  verifyOrigin() {
    return R8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Be.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Be.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Be.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Lo(n)) {
      const r = to(e);
      n.fields.push(ki(r ? $e.Compressed : $e.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = D8(n, r, e.fee, e.nonce, s);
    return Lo(e) ? e.signature = i : e.fields.push(ki(s.data.byteLength === Yg ? $e.Compressed : $e.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Af(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Be.Sponsored)
      throw new Za("Cannot sponsor sign a non-sponsored transaction");
    this.auth = q8(this.auth, e);
  }
  setFee(e) {
    this.auth = G8(this.auth, e);
  }
  setNonce(e) {
    this.auth = K8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Be.Sponsored)
      throw new Za("Cannot sponsor sign a non-sponsored transaction");
    this.auth = V8(this.auth, e);
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
    return Ks(n, this.chainId, 0), e.push(n), e.push(W8(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ef(this.postConditions)), e.push(py(this.payload)), Ue(e);
  }
}
function Qa(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new yo(xe(t.slice(2))) : e = new yo(xe(t)) : t instanceof Uint8Array ? e = new yo(t) : e = t;
  const n = e.readUInt8Enum(Wa, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = X8(e), i = e.readUInt8Enum(un, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Ri, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = by(e, pt.PostCondition), c = s8(e);
  return new Y8(n, s, c, a, o, i, r);
}
const Z8 = Ov, wo = or, Q8 = ly;
const J8 = /* @__PURE__ */ new Set([4001, -31001]), t5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], e5 = ["result", "data", "payload", "response", "params"], Nh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Tc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ii = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, $r = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, n5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Cy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => n5(i, r)) === s
  );
}, Ty = (t) => t ? Cy(ii()).some(
  (e) => {
    var n;
    return e.id === t && (Tc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, By = () => {
  if (typeof window > "u")
    return;
  const t = ii(), e = Cy(t).filter(
    (n) => {
      var r;
      return Tc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = $r(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of t5) {
    const r = $r(t, n) ?? (t === window ? void 0 : $r(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, r5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ii(), n = $r(e, t) ?? (e === window ? void 0 : $r(window, t)) ?? yc(t);
  if (n)
    return n;
  if (Tc(t) || Ty(t))
    return By();
}, pa = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, s5 = ["blockstack-session", "blockstack"], i5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of s5) {
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
i5();
const My = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, bn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, o5 = (t) => {
  const e = bn(t);
  if (!e)
    return null;
  const n = My(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, a5 = (t) => {
  const e = bn(t);
  if (!e)
    return null;
  const n = My(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, fu = (t, e = "mainnet") => {
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
      return fu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return fu(r, e);
  }
  return e;
}, Bs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Co = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Ci(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Co(s, e + 1);
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
    const i = Co(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Ci(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ci(n.testnet) ? n.testnet.trim() : null;
}, Ph = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ny = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && J8.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ws = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = bn(n == null ? void 0 : n.message) ?? bn(e.message) ?? bn(e.error) ?? bn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, qi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Ws(e);
    if (e.status === "error")
      throw Ws(e.result ?? e);
  }
  return t;
}, _h = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return qi(r);
  } catch (r) {
    throw Ws(r);
  }
}, Py = () => By(), $f = () => {
  if (typeof window > "u")
    return;
  const t = ii();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = $r(t, e) ?? (t === window ? void 0 : $r(window, e));
    if (n)
      return n;
  }
}, Uh = () => {
  if (typeof window > "u")
    return;
  const t = $f();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = ii();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = $r(e, n) ?? (e === window ? void 0 : $r(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Ia = (t) => {
  var r, s;
  const e = Os();
  if (Tc(e) || Ty(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ii() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Py();
}, rl = (t) => {
  const e = a5(t);
  if (!e)
    return null;
  try {
    const n = Qa(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ja = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = rl(t), r = o5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? bn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ja(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Nh)
    if (rl(s[a])) {
      i = bn(s[a]);
      break;
    }
  const o = bn(s.txId) || bn(s.txid) || bn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? bn(s.txRaw) ?? void 0
    };
  for (const a of Nh) {
    const c = rl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: bn(s[a]) ?? void 0
      };
  }
  for (const a of e5) {
    const c = s[a], u = Ja(c, e + 1);
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
}, sl = (t) => {
  const e = Ja(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, c5 = (t) => {
  const e = Ja(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, l5 = (t) => ({
  ...t,
  fee: Bs(t.fee),
  nonce: Bs(t.nonce),
  sponsored: t.sponsored === !0
}), Hh = (t) => ({
  recipient: t.recipient,
  amount: Bs(t.amount) ?? "0",
  memo: t.memo,
  network: fu(t.network),
  address: t.stxAddress,
  fee: Bs(t.fee),
  nonce: Bs(t.nonce),
  sponsored: t.sponsored ?? !1
}), _y = "WALLET_ADDRESS_MISMATCH", u5 = 45e3;
let bo = null;
const du = (t) => {
  t && (bo = { address: t, at: Date.now() });
}, f5 = () => {
  bo = null;
}, d5 = () => bo && Date.now() - bo.at <= u5 ? bo.address : null, h5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, p5 = async (t) => {
  f5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = qi(await t.request("wallet_connect")), n = Co(e);
  return du(n), n;
}, g5 = async (t, e, n, r) => {
  try {
    return qi(await t.request(e, n));
  } catch (s) {
    const i = Ws(s);
    if (!h5(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await p5(t);
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
        { code: o ? _y : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return qi(await t.request(e, n));
    } catch (a) {
      throw Ws(a);
    }
  }
};
let Oh = 3e4;
const y5 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Oh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Oh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, w5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: _y }
      );
    return c;
  }, s = d5();
  if (s)
    return pa(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  pa(n, "account-read");
  try {
    const c = qi(
      await y5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Co(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Ny(c))
      throw Ws(c);
    pa(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return du(i), r(i, "wallet_getAccount");
  let o;
  pa(n, "account-reconnect");
  try {
    o = qi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Ws(c);
  }
  const a = Co(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return du(a), r(a, "wallet_connect");
}, b5 = async (t, e) => {
  if (!Ia(t)) {
    const i = await _h(
      t,
      "stx_transferStx",
      Hh(e)
    );
    return sl(i);
  }
  const n = $f();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await _h(
      n,
      "stx_transferStx",
      Hh(e)
    );
    return sl(i);
  }
  const r = Py();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await w5(r, e.stxAddress);
  const s = await g5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Bs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Bs(e.fee) } : {}
    },
    e.stxAddress
  );
  return sl(s);
}, m5 = () => Os(), Uy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Os(), e = t ? r5(t) : void 0;
  if (e)
    return e;
  const n = ii() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Dh = (t, e) => {
  const n = Uy(), r = l5({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, c5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ua(r, e);
  if (Ia(n) && !$f()) {
    const s = Uh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Os(),
        route: "legacy-transaction-request"
      }), ua(r, s);
  }
  return void b5(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Ph(s) && Ia(n)) {
      const a = Uh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Os(),
          route: "legacy-transaction-request"
        }), ua(r, a);
        return;
      }
    }
    if (Ph(s) && !Ia(n)) {
      ua(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Ny(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Fh = (t) => Ey(t).replace(/^0x/, ""), jh = "This wallet cannot sign messages. Try Xverse or Leather.", zh = (t) => typeof (t == null ? void 0 : t.request) == "function", Rh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", x5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, S5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function E5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Fh(e.message),
    domain: Fh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function A5(t, e) {
  const n = await y4({
    domain: e.domain,
    message: e.message,
    network: vc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Gh(t) {
  var s, i;
  const e = m5() || "", n = /xverse/i.test(e);
  let r = Uy();
  if (n && !Rh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Rh(r))
    try {
      return await A5(r, t);
    } catch (o) {
      if (n || !zh(r) || !S5(o)) throw o;
    }
  if (!n && zh(r))
    try {
      return await E5(r, t);
    } catch (o) {
      throw x5(o) ? new Error(jh) : o;
    }
  throw new Error(jh);
}
const Kh = 1000000n, Ls = 1000000n, tc = 50n, De = 3000n, oi = 300n, oo = 3000n, v5 = 50000n, il = 200n, Bc = 15000n, mn = (t) => t + tc;
function Jn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Kh}.${(n % Kh).toString().padStart(6, "0")}`;
}
function Vh(t, e = oi) {
  return t <= De ? 0 : Number((t - De) / mn(e));
}
function ol(t, e = 0n) {
  const n = Ls - t - e;
  return n > 0n ? n : 0n;
}
function $5(t, e = oi) {
  return t > Ls ? "over" : t < De + mn(e) ? "empty" : t < v5 ? "low" : "ok";
}
const k5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", I5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", L5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function C5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || L5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== k5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Hy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", al = 3, T5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [hu, Oy] = Hy.split("."), In = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function pu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function B5(t) {
  return In(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ls(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Dy(t, e = []) {
  const n = await ls(`/v2/contracts/call-read/${hu}/${Oy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: hu, arguments: e.map((r) => "0x" + In(Pe(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return nr(Bn(n.result));
}
async function M5() {
  const t = await ls(`/v2/contracts/source/${hu}/${Oy}?proof=0`);
  if (typeof t.source != "string" || await B5(t.source) !== I5) throw Error("Deployed source does not match the tested helper.");
  if (C5(await Dy("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Fy(t) {
  return t.startsWith("SP") && Ci(t) && !t.includes(".");
}
async function N5(t) {
  var r;
  if (!Fy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await ls(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await ls(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function P5(t) {
  const e = await ls(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function _5(t, e) {
  var s, i;
  const n = await Dy("get-owner", [wo(t), wo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Fy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function U5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: pu(t), signal: AbortSignal.timeout(15e3) });
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
async function H5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function O5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Qa(pu(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || $i(uo(Xa.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || $i(r.contractAddress) + "." + r.contractName.content !== Hy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || In(Pe(r.functionArgs[0])) !== In(Pe(wo(t.core))) || In(Pe(r.functionArgs[1])) !== In(Pe(wo(t.song))) || In(Pe(r.functionArgs[2])) !== In(Pe(Q8(pu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ri.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== $o.Equal || i.principal.prefix !== 2 || $i(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || $i(r.contractAddress) + "." + r.contractName.content !== T5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || In(Pe(r.functionArgs[0])) !== In(Pe(wo(t.song))) || typeof t.liked != "boolean" || In(Pe(r.functionArgs[1])) !== In(Pe(Z8(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ri.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || nr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const D5 = "xtrata.xyz/radio/listening-wallet", F5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Xs = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Ci(t), j5 = (t) => ({
  domain: qs({ name: We(D5), version: We("1"), "chain-id": or(1) }),
  message: qs({
    purpose: We(F5),
    main: We(t.main),
    listening: We(t.listening),
    issued: or(t.issued)
  })
}), jy = 100000n, z5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function R5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Xs(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= jy).sort(z5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const ga = 50;
function ec(t) {
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
async function G5(t, e, n = 4) {
  if (!Xs(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${ga}&offset=${o}`, s = ec(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - ga);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= ga ? s : ec(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = R5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - ga);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const mr = 50, K5 = 6, V5 = 20, qh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Wh(t, e) {
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
async function q5(t, e, n) {
  if (!Xs(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = ec(await e(`/extended/v1/address/${t}/stx_inbound?limit=${mr}&offset=0`));
    if (!s || s.total > K5 * mr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = mr; o < s.total; o += mr) {
      const a = ec(await e(`/extended/v1/address/${t}/stx_inbound?limit=${mr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${mr}&offset=${u}`, a = Wh(await e(o(0)), t);
      if (!a || a.total > V5 * mr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = mr; u < a.total; u += mr) {
        const d = Wh(await e(o(u)), t);
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
function W5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(qh).map((l, y) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: y } : Xs(l.sender) && p >= jy ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: p, kind: "dust", to: null, at: y };
  }), i = s.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Xs(l.recipient) && l.amount > 0n).sort(qh), a = o.reduce((l, y) => l + y.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let p = y;
    for (const E of l) {
      if (p <= 0n) break;
      const b = E.left < p ? E.left : p;
      E.left -= b, p -= b;
    }
    return p;
  };
  for (const l of o) {
    const y = u(s.filter((p) => p.to === l.recipient), l.amount);
    y > 0n && u(s, y);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, y) => l + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const y = `${l.kind}:${l.to ?? ""}`, p = d.get(y);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : d.set(y, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, y) => l.newest - y.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function X5(t, e) {
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
function Xh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const La = [100, 250, 500], Y5 = (t, e) => BigInt(t) * mn(e), ao = ["prepared", "signed", "unknown", "pending"], Z5 = 30 * 6e4, Yh = 6e4, bi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, Q5 = 3e3, Zh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", cl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function J5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, y = !1, p = null, E = !1, b = "", T = "", W = 0, X, S = null, N, B = [], J, nt = -1 / 0;
  const K = /* @__PURE__ */ new Set();
  let z = null, A = !1, P = 0, M = null, q = null, at = !1, Y = null, L = !1, rt = null, Zt = !1, I = !1, F = !1, St = !1, Nt = !1, Tt = 0, Qt = null, ie = Promise.resolve();
  const m = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? oi.toString()), H = (w) => !!i && !(i.features ?? []).includes(w), tt = (w, $) => `xtrata.ppp.v1.${w}:${$}`, U = (w = i == null ? void 0 : i.address) => {
    if (!w) return [];
    try {
      const $ = JSON.parse(t.store.get(tt("entries", w)) || "[]");
      return Array.isArray($) ? $ : [];
    } catch {
      return [];
    }
  }, it = (w) => {
    const $ = [w, ...U(w.address).filter((V) => !(V.txid === w.txid && V.kind === w.kind))].slice(0, 200);
    t.store.set(tt("entries", w.address), JSON.stringify($));
  }, ct = (w = i == null ? void 0 : i.address) => !!w && t.store.get(tt("on", w)) !== "0", Lt = (w) => {
    i != null && i.address && t.store.set(tt("on", i.address), w ? "1" : "0");
  }, vt = () => U().filter((w) => ao.includes(w.status)), Kt = () => jt() ? [...vt(), ...U(At()).filter((w) => ao.includes(w.status))] : vt(), Dt = () => Et(i == null ? void 0 : i.address), Et = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(tt("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, wt = (w, $ = i == null ? void 0 : i.address) => {
    $ && t.store.set(tt("deposit", $), JSON.stringify(w));
  };
  let $t = null;
  const he = (w = Yh) => {
    const $ = t.now();
    $t = { since: $t && $ < $t.until ? $t.since : $, until: Math.max(($t == null ? void 0 : $t.until) ?? 0, $ + w) };
  }, Ft = () => !!$t && t.now() < $t.until && (o === void 0 || o < De + mn(m())), ye = () => !!Dt() || Ft(), At = () => H("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), jt = () => !!(i != null && i.address) && At() !== i.address, Bt = () => jt() ? c && c.for === At() ? c.value : void 0 : o, Je = (w) => w !== void 0 && w < De + il, v = () => vt().filter((w) => t.now() - w.created > Z5 && K.has(w.txid)), j = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), _ = () => j() && !(i != null && i.linked), G = () => {
    const w = t.main();
    return !_() && !!w && !!(i != null && i.linked) && i.linked !== w;
  }, bt = (w) => tt("return-to", w), kt = (w = i == null ? void 0 : i.address) => {
    if (!w) return;
    const $ = t.store.get(bt(w));
    return $ && Xs($) && $ !== w ? $ : void 0;
  }, le = (w = i == null ? void 0 : i.address) => z && z.for === w ? z.res : null;
  function ne() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const w = kt();
    if (w) return { to: w, kind: "chosen" };
    const $ = le();
    if ($ != null && $.ok && $.funder) return { to: $.funder, kind: "funder" };
  }
  const ue = (w) => tt("gift", w);
  function oe() {
    const w = i == null ? void 0 : i.address;
    if (!w) return null;
    if ((Y == null ? void 0 : Y.for) === w) return Y.info;
    try {
      const $ = JSON.parse(t.store.get(ue(w)) || "null");
      return $ && typeof $.returnTo == "string" && typeof $.treasury == "string" ? $ : null;
    } catch {
      return null;
    }
  }
  async function Re() {
    var yt;
    const w = i == null ? void 0 : i.address;
    if (!w || !t.giftInfo || !((yt = e == null ? void 0 : e.gifts) != null && yt.enabled) || L) return;
    const $ = (Y == null ? void 0 : Y.for) === w ? Y : null, V = $ ? $.ok ? $.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if ($ && t.now() - $.at < V) return;
    L = !0;
    const et = oe();
    try {
      const k = await t.giftInfo(w);
      Y = { for: w, info: k, ok: !0, at: t.now() }, t.store.set(ue(w), JSON.stringify(k));
    } catch {
      Y = { for: w, info: et, ok: !1, at: t.now() };
    } finally {
      L = !1;
    }
  }
  const Ge = () => U().reduce((w, $) => ao.includes($.status) ? w + BigInt($.amount || "0") + BigInt($.fee || "0") : w, 0n);
  function Wt() {
    if (o === void 0) return 0;
    const w = o - Ge() - BigInt(Le.length) * mn(m());
    return w > 0n ? Vh(w, m()) : 0;
  }
  const gt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", te = "EMPTY — ADD STX TO PLAY";
  function ae() {
    var V;
    const w = (i == null ? void 0 : i.state) === "known" || (i == null ? void 0 : i.state) === "unlocked";
    if (!((V = oe()) != null && V.player) && !w) return null;
    const $ = (et, yt) => ({ reason: et, text: yt });
    switch (R()) {
      case "connect":
      case "wrong-wallet":
        return $("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return $("locked", "UNLOCK TO LISTEN");
      case "link":
        return $("link", "FINISH SETUP TO LISTEN");
      case "over":
        return $("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return ye() ? $("arriving", "YOUR PLAYS ARE ARRIVING") : $("out", jt() ? gt : te);
      case "ready":
        return !ct() || !(i != null && i.session) || i.session.playsLeft < 1 ? $("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : F ? Wt() < 1 ? $("out", jt() ? gt : te) : null : $("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Se = () => {
    var w;
    return !!(i != null && i.address) && jt() && !!((w = oe()) != null && w.player);
  };
  function ge() {
    return Se() ? { locked: !0, known: !0 } : null;
  }
  const on = 3 * 6e4, h = () => !!oe() && !!t.history && !(i != null && i.linked);
  async function x() {
    const w = i.address, $ = oe(), { balance: V, nonce: et } = await t.chain.account(w), yt = await t.history(w, !0);
    if (!yt.ok) return null;
    const k = W5({ self: w, balance: V, inbound: yt.inbound, outgoing: yt.outgoing, gift: { sender: $.treasury, payer: $.returnTo } });
    if (!k.ok) return null;
    const O = X5(k.parts, oo);
    return { balance: V, nonce: et, parts: k.parts, steps: O.steps, tooSmall: O.tooSmall.length };
  }
  const f = () => Zt ? { state: "unavailable" } : !rt || t.now() - rt.at > on || o !== void 0 && o !== rt.balance ? { state: "none" } : rt.plan;
  function R() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!_()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : G() ? "wrong-wallet" : i.state === "known" ? "locked" : !_() && i.linked !== w ? "link" : o === void 0 ? "loading" : o > Ls ? "over" : o < De + mn(m()) ? "fund" : "ready" : "loading";
  }
  const ut = () => {
    var w, $, V, et, yt;
    return {
      step: R(),
      busy: u,
      message: b,
      error: T,
      notice: mt(),
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : $5(o, m()),
      playsLeft: o === void 0 ? 0 : Vh(o, m()),
      allowance: o === void 0 ? Ls : ol(o, BigInt(((w = Dt()) == null ? void 0 : w.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: ct(),
      entries: U(),
      depositTxid: (($ = Dt()) == null ? void 0 : $.txid) ?? X,
      depositPending: ye(),
      arrival: ye() ? { since: ((V = Dt()) == null ? void 0 : V.at) ?? ($t == null ? void 0 : $t.since) ?? t.now(), graceMs: Yh } : null,
      walletOutdated: H("like"),
      linkedListening: J && J === t.main() ? B.map((k) => k.listening) : [],
      serverLinked: !!S && N === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: v().length,
      armed: St,
      queued: Le.length,
      solo: _(),
      returnTo: (et = ne()) == null ? void 0 : et.to,
      returnToKind: (yt = ne()) == null ? void 0 : yt.kind,
      funderState: (() => {
        const k = le();
        return k ? k.ok ? k.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const k = le();
        return !!k && k.ok && k.distinct > 1;
      })(),
      walletCannotSolo: _() && H("standalone"),
      walletCannotMulti: H("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((k) => k !== t.main() && k !== (i == null ? void 0 : i.linked)),
      creditedTo: _() && (i != null && i.address) && (M == null ? void 0 : M.for) === i.address && M.main ? M.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(tt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (q == null ? void 0 : q.for) === i.address && q.unused,
      gift: (() => {
        const k = oe();
        return k ? { player: k.player, from: k.from, source: k.source, amount: k.amount } : null;
      })(),
      giftPlays: oe() ? Wt() : 0,
      playCost: mn(m()),
      giftStop: ae(),
      albumLock: ge(),
      returnPlan: f(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: H("slots"),
      likeFunds: (() => {
        var lt;
        const k = At();
        if (!k || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const O = Bt();
        return { address: k, balance: O, low: Je(O), album: jt(), pending: !!Et(k), txid: (lt = Et(k)) == null ? void 0 : lt.txid, main: t.main() };
      })()
    };
  }, mt = () => W ? W < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ht = (w, $ = "") => {
    b = w, T = $, t.changed();
  };
  async function re(w, $) {
    if (!u) {
      u = w, T = "", t.changed();
      try {
        await $();
      } catch (V) {
        const et = V instanceof Error ? V.message : String(V);
        T = /Cancelled in the listening wallet/.test(et) ? "" : et, T || (b = "Not now. Nothing was signed.", Nt = !0);
      } finally {
        u = null, await Vt(!0);
      }
    }
  }
  const Fe = () => !!(e != null && e.enabled) && e.here && (_() || !!t.main() && e.allowed), ke = () => Fe() && !G(), hn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Ee = () => {
    if (G()) throw new Error(hn());
  };
  async function Mn() {
    if (!Fe()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Ke = (w) => {
    const $ = t.main();
    return w.request("listening.status", $ ? { main: $ } : void 0);
  };
  async function Nn(w = !1) {
    i != null && i.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await pn(w)));
  }
  async function pn(w = !1) {
    const $ = At();
    if (!(!jt() || !$ || (i == null ? void 0 : i.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === $ && t.now() - c.at < 3e4))
      try {
        c = { for: $, value: await t.chain.balance($), at: t.now() };
      } catch {
      }
  }
  async function hs(w) {
    if ((J !== w || t.now() - nt >= 6e4) && (B = await t.links(w), J = w, nt = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === w) return;
    const $ = `${w}:${i.address}`;
    N === $ && S || (S = B.find((V) => V.listening === i.address) ?? null, N = $);
  }
  async function He() {
    const w = i == null ? void 0 : i.address;
    if (!_() || !w || i != null && i.linked || !t.funder || A || !o || o <= 0n) return;
    const $ = le(w);
    if ($ != null && $.ok && $.funder) return;
    const V = $ != null && $.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, P - 1), 30 * 6e4);
    if (!(z && z.for === w && t.now() - z.at < V)) {
      A = !0;
      try {
        z = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        z = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        A = !1;
      }
      P = z.res.ok ? 0 : P + 1;
    }
  }
  async function ai() {
    const w = i == null ? void 0 : i.address;
    if (!(!_() || !w || i != null && i.linked || !t.mainOf || at) && !(M && M.for === w && (M.ok || t.now() - M.at < 6e4))) {
      at = !0;
      try {
        M = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        M = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        at = !1;
      }
    }
  }
  async function dr() {
    const w = i == null ? void 0 : i.address;
    if (!(!w || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (q == null ? void 0 : q.for) === w) && t.store.get(tt("created", w)) !== "1")
      try {
        q = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function Ct() {
    var yt;
    const w = i == null ? void 0 : i.address;
    if (!w) return !1;
    let $, V = !1;
    const et = /* @__PURE__ */ new Map();
    for (const k of Kt())
      try {
        const O = await t.chain.transaction(k.txid);
        if (!O) {
          if (K.add(k.txid), t.now() - k.created > 15 * 6e4 && !et.has(k.address) && et.set(k.address, await t.chain.confirmedNonce(k.address)), $ = et.get(k.address), $ !== void 0 && $ > BigInt(k.nonce)) {
            it({ ...k, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((k.status === "unknown" || k.status === "signed") && k.raw)
            try {
              await t.chain.broadcast(k.raw, k.txid), it({ ...k, status: "pending" });
            } catch (ft) {
              bi(ft) && it({ ...k, status: "failed", note: ft.message, raw: void 0 });
            }
          continue;
        }
        K.delete(k.txid);
        const lt = String(O.tx_status);
        if (lt === "success" && O.canonical !== !1 && O.is_unanchored === !1) {
          if (it({ ...k, status: "confirmed", confirmedAt: t.now(), actualFee: String(O.fee_rate ?? k.fee), raw: void 0 }), V = !0, k.kind === "like" && (E = !0, k.status !== "confirmed" && typeof k.liked == "boolean"))
            try {
              (yt = t.likeConfirmed) == null || yt.call(t, k.song, k.liked);
            } catch {
            }
        } else lt.startsWith("abort_") || lt.startsWith("dropped_") ? it({ ...k, status: "failed", note: lt, raw: void 0 }) : k.status !== "pending" && it({ ...k, status: "pending" });
      } catch {
      }
    for (const k of jt() ? [w, At()] : [w]) {
      const O = Et(k);
      if (O)
        try {
          const lt = await t.chain.transaction(O.txid), ft = String((lt == null ? void 0 : lt.tx_status) ?? "");
          (ft === "success" && lt.is_unanchored === !1 || ft.startsWith("abort_") || ft.startsWith("dropped_") || !lt && t.now() - O.at > 2 * 36e5) && (wt(null, k), ft === "success" && he(2e4), a = -1 / 0, c = null, /on its way/i.test(b) && (b = ""));
        } catch {
        }
    }
    return V;
  }
  async function Vt(w = !1) {
    var $;
    try {
      const V = t.main();
      if ((w || !e || r !== V || t.now() - n > 3e5) && (e = await t.config(V), n = t.now(), r = V), !e.enabled || !e.here || !_() && (!V || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), St && ps(), t.changed();
        return;
      }
      await Mn(), i = await Ke(s), G() && i.state === "unlocked" && (gr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Ke(s)), V && e.allowed && await hs(V), await Nn(w), await He(), await ai(), await dr(), await Re(), await Ct() && await Nn(!0), await pn(), await ys(), W = 0;
    } catch {
      W++;
    }
    if (R() === "locked" ? ci() : St && ps(), E) {
      E = !1;
      try {
        ($ = t.likesChanged) == null || $.call(t);
      } catch {
      }
    }
    t.changed(), Le.length && !pr && Mr();
  }
  async function Ie(w) {
    const $ = i == null ? void 0 : i.root;
    if (!$ || i != null && i.slot || !(i != null && i.address) || H("slots")) return;
    const V = Number(t.store.get(tt("slot", $)));
    if (!(!Number.isSafeInteger(V) || V < 1))
      try {
        const { balance: et } = await t.chain.account(i.address);
        if (et >= De + mn(m())) return;
        await w.request("listening.openSlot", { slot: V }), i = await Ke(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function je(w, $) {
    var k;
    Ee();
    const V = !(i != null && i.address) || ct(i.address), et = i != null && i.linked ? (k = t.nameOf) == null ? void 0 : k.call(t, i.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: V ? Cr() : void 0, anyPasskey: $, ...t.main() ? { main: t.main() } : {}, ...et ? { label: et } : {} }), i = await Ke(w), V && (ct(i.address) ? await Pn() : await w.request("listening.stop")), await Ie(w), ht(V ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const yt = p;
    p = null, yt && t.now() - yt.at < 12e4 && setTimeout(() => void Vt(!0).then(() => yr(yt)), 0);
  }
  function ci() {
    St || u || Nt || Tt >= 3 || !s || !(i != null && i.address) || (St = !0, ie = (async () => {
      try {
        await je(s, !1), Tt = 0;
      } catch (w) {
        const $ = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test($) ? Qt || (Nt = !0, ht("Not now. Nothing was signed.")) : /did not answer/.test($) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Tt++, T = $);
      } finally {
        St = !1;
        const w = Qt;
        Qt = null, w ? await w() : await Vt(!0);
      }
    })());
  }
  async function ps(w) {
    St && (Qt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ie), w && await w(), t.changed();
  }
  const Cr = () => ({
    fee: m().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ls.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Pn() {
    if (!(i != null && i.address)) return !1;
    if (F || (F = await t.tabLock(i.address)), !F)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Vn(w, $) {
    const V = i.address, { balance: et, nonce: yt } = $ ?? await t.chain.account(V);
    o = et;
    const k = await s.request("listening.prepareReturn", {
      mode: w.mode,
      balance: et.toString(),
      nonce: yt.toString(),
      fee: oo.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (k.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const O = w.mode === "amount" ? w.amount : w.mode === "all" ? et - oo : et - Ls - oo, lt = Qa(k.raw);
    if (nr(lt.payload.recipient).value !== w.to || String(lt.payload.amount) !== k.amount || O !== void 0 && k.amount !== O.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const ft = {
      id: cl(),
      address: V,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: k.recipient,
      amount: k.amount,
      fee: k.fee,
      nonce: yt.toString(),
      created: t.now(),
      status: "signed",
      raw: k.raw,
      txid: k.txid
    };
    t.validate(ft), it(ft);
    try {
      await t.chain.broadcast(k.raw, k.txid), it({ ...ft, status: "pending" });
    } catch (Xt) {
      throw it({ ...ft, status: "unknown", note: Xt.message }), Xt;
    }
    return k;
  }
  const gs = Bc, hr = oo;
  async function _n(w, $, V) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (H("slots") || H("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const et = i.slot ?? 0;
    if (w === $ || ![w, $].includes(et) || ![w, $].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const yt = i.root ?? i.address, k = w === 0 ? yt : i.address, O = $ === 0 ? yt : i.address, { balance: lt, nonce: ft } = await t.chain.account(k);
    if (lt < V + hr + De) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Xt = await s.request("listening.signMove", { from: w, to: $, amount: V.toString(), fee: hr.toString(), nonce: ft.toString(), balance: lt.toString() }), Ne = Qa(Xt.raw);
    if (Xt.from !== k || Xt.to !== O || Xt.amount !== V.toString() || nr(Ne.payload.recipient).value !== O || String(Ne.payload.amount) !== V.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const Ae = {
      id: cl(),
      address: k,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: O,
      amount: Xt.amount,
      fee: Xt.fee,
      nonce: ft.toString(),
      created: t.now(),
      status: "signed",
      raw: Xt.raw,
      txid: Xt.txid
    };
    t.validate(Ae), it(Ae);
    try {
      await t.chain.broadcast(Xt.raw, Xt.txid), it({ ...Ae, status: "pending" });
    } catch (we) {
      throw it({ ...Ae, status: "unknown", note: we.message }), we;
    }
    return wt({ txid: Xt.txid, amount: Xt.amount, at: t.now() }, O), O === yt && yt !== i.address ? c = null : a = -1 / 0, Xt;
  }
  let qn = !1;
  const Un = /* @__PURE__ */ new Map(), Hn = (w) => tt("float", w);
  async function ys() {
    if (qn || (i == null ? void 0 : i.state) !== "unlocked" || !jt() || H("move") || H("rootLike") || !i.address) return;
    const w = i.address;
    if (t.store.get(Hn(w)) === "1") return;
    const $ = oe();
    if (!($ != null && $.player) || $.state !== "arrived") return;
    const V = Bt();
    if (V === void 0 || o === void 0) return;
    if (!Je(V)) {
      t.store.set(Hn(w), "1");
      return;
    }
    if (Et(At()) || Br() || Kt().length || o < gs * 4n + De + hr) return;
    const et = Un.get(w);
    if (!(et && (et.n >= 3 || t.now() - et.at < 5 * 6e4))) {
      qn = !0, Un.set(w, { n: ((et == null ? void 0 : et.n) ?? 0) + 1, at: t.now() });
      try {
        await _n(i.slot ?? 0, 0, gs), t.store.set(Hn(w), "1");
      } catch (yt) {
        console.warn("[radio] likes float not sent yet", yt);
      } finally {
        qn = !1;
      }
    }
  }
  async function li(w) {
    if (vt().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (H("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const $ = await x().catch(() => null);
    if (!$)
      throw rt = null, Zt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Zt = !1, o = $.balance;
    const V = { balance: $.balance, nonce: $.nonce };
    if (w === "excess") {
      const lt = Xh($.parts) ?? kt();
      if (!lt) throw new Error("Choose where to send the excess first.");
      await Vn({ mode: "excess", to: lt, linked: !1 }, V), rt = null, ht("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const et = $.steps;
    if (!et.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!rt && rt.balance === $.balance && t.now() - rt.at <= on && rt.steps.length === et.length && rt.steps.every((lt, ft) => lt.to === et[ft].to && lt.mode === et[ft].mode && lt.send === et[ft].send))) {
      rt = {
        at: t.now(),
        balance: $.balance,
        steps: et,
        parts: $.parts,
        plan: { state: "ready", steps: et.map((lt) => ({ to: lt.to, kind: lt.kind, send: lt.send.toString() })), kept: $.tooSmall, excess: Xh($.parts) }
      }, ht(et.length > 1 ? `This goes back in ${et.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const k = et[0], O = k.to ?? kt();
    if (!O) throw new Error("Choose where to send the rest first.");
    if (k.mode === "amount" && H("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Vn({ mode: k.mode, to: O, linked: !1, ...k.mode === "amount" ? { amount: k.send } : {} }, V), rt = null, et.length === 1 ? (Lt(!1), ht("Returned ✓ Paying is off.")) : ht(`Returned ✓ ${et.length - 1} more ${et.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const ws = {
    forceRefresh: () => Vt(!0),
    create: () => re("Waiting for your passkey…", async () => {
      const w = await Mn();
      await w.request("listening.unlock", { mode: "create", terms: Cr(), ...t.main() ? { main: t.main() } : {} }), i = await Ke(w), i.address && t.store.set(tt("created", i.address), "1"), Lt(!0), ht(_() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Pn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? he() : $t = null, t.changed();
    },
    giftSent: (w, $) => {
      !(i != null && i.address) || Dt() || (wt({ txid: w, amount: $.toString(), at: t.now() }), a = -1 / 0, Y = null, ht("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (Ee(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (H("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Mn()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, $, V, et) => {
      wt({ txid: V, amount: et.toString(), at: t.now() }, $), Y = null, await ws.openAlbum(w), ht("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => re("Opening…", async () => {
      if (Ee(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (H("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === w) return;
      gr(), await s.request("listening.openSlot", { slot: w }), i = await Ke(s), o = void 0, a = -1 / 0, rt = null, Zt = !1;
      const $ = i.root;
      $ && w > 0 && t.store.set(tt("slot", $), String(w)), ht(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const $ = () => re("Waiting for your passkey…", async () => je(await Mn(), w));
      return St ? w ? H("cancel") ? (ht("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ps(async () => {
        (R() === "locked" || R() === "intro") && await $();
      }) : ie : $();
    },
    link: () => re("Sign in your wallet…", async () => {
      Ee();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const $ = (await t.links(w)).find((V) => V.listening === i.address);
      if ($)
        await s.request("listening.link", { main: w, issued: $.issued, mainSignature: $.mainSignature });
      else {
        const V = { main: w, listening: i.address, issued: t.now() }, et = await t.signWithMain(w, j5(V)), yt = await s.request("listening.link", { main: w, issued: V.issued, mainSignature: et });
        await t.saveLink({ ...V, mainSignature: et, listeningSignature: yt.listeningSignature }), nt = -1 / 0;
      }
      ht("Linked ✓");
    }),
    deposit: () => re("Approve the deposit in your wallet…", async () => {
      Ee();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Dt()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Nn(!0);
      const $ = ol(o ?? 0n);
      if ($ <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      X = await t.deposit(w, i.address, $), X && wt({ txid: X, amount: $.toString(), at: t.now() }), ht("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => re("Approve the top-up in your wallet…", async () => {
      Ee();
      const w = t.main(), $ = At();
      if (!w || !$) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Et($)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const V = await t.chain.balance($);
      jt() ? c = { for: $, value: V, at: t.now() } : (o = V, a = t.now());
      const et = ol(V);
      if (et <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const yt = await t.deposit(w, $, et);
      yt && wt({ txid: yt, amount: et.toString(), at: t.now() }, $), ht("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (w) => re("Adding plays…", async () => {
      if (Ee(), !jt()) throw new Error("Open the album you want to add plays to first.");
      if (!La.includes(w)) throw new Error("Choose one of the amounts offered.");
      const $ = Y5(w, m());
      if (d || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (Kt().length || Dt()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await _n(0, i.slot ?? 0, $), ht("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => re("Confirm in the listening wallet…", async () => {
      if (!ke()) throw new Error("Connect your wallet first.");
      await Pn(), await s.request("listening.approveSession", Cr()), Lt(!0), ht("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => re("Clearing…", async () => {
      for (const w of v())
        await t.chain.transaction(w.txid) || it({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ht("Cleared ✓");
    }),
    switchOff: () => re("Switching off…", async () => {
      gr(), await (s == null ? void 0 : s.request("listening.stop")), Lt(!1), ht("Paying is off. Music stays free.");
    }),
    lock: () => re("Locking…", async () => {
      gr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, ht("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const $ = String(w ?? "").trim();
      if (!(i != null && i.address)) return ht("", "Unlock the listening wallet first.");
      if (!Xs($)) return ht("", "Enter a standard mainnet address (it starts with SP).");
      if ($ === i.address) return ht("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(bt(i.address), $), ht("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(bt(i.address), ""), t.changed();
    },
    returnFunds: (w) => re("Check the return in the listening wallet…", async () => {
      if (!ke()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (h()) return li(w);
      const $ = ne();
      if (!$) throw new Error(_() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if ($.kind !== "linked" && H("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (vt().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Vn({ mode: w, to: $.to, linked: $.kind === "linked" }), w === "all" && Lt(!1), ht(w === "all" ? $.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Le = [], eo = 10, Tr = 30 * 6e4;
  let pr = !1;
  const Br = () => d || !!u || l || y, gr = () => {
    Le.length && (Le.length = 0, t.changed());
  };
  async function ui(w) {
    if (!Le.some(($) => $.id === w.id) && !U().some(($) => $.id === w.id) && (Le.push({ ...w, at: t.now() }), Le.length > eo && Le.shift()), Br() || vt().length) {
      const $ = Le.length;
      b = `Queued ${$ === 1 ? "this song" : $ + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Mr();
  }
  async function Mr() {
    if (!pr) {
      pr = !0;
      try {
        for (; Le.length; ) {
          for (; Le.length && t.now() - Le[0].at > Tr; ) Le.shift();
          if (!Le.length || Br() || await fi(Le[0]) === "wait") return;
          Le.shift();
        }
      } finally {
        pr = !1, t.changed();
      }
    }
  }
  async function fi(w) {
    var $;
    d = !0;
    try {
      await Vt();
      const V = R();
      if (V === "loading") return "wait";
      if (V !== "ready" || !ct() || !(i != null && i.session) || i.session.playsLeft < 1 || !F) return "done";
      if (vt().length) return "wait";
      I || (await t.chain.verify(), I = !0);
      const et = i.address, { balance: yt, nonce: k } = await t.chain.account(et);
      o = yt, a = t.now();
      const O = await t.chain.owner(al, w.song);
      if (O === et || O === t.main()) return "done";
      const lt = await s.request("listening.signPlay", {
        core: al,
        song: w.song,
        receipt: w.id,
        fee: m().toString(),
        nonce: k.toString(),
        balance: yt.toString()
      }), ft = {
        id: w.id,
        address: et,
        kind: "play",
        core: al,
        song: w.song,
        recipient: O,
        amount: "50",
        fee: m().toString(),
        nonce: k.toString(),
        created: t.now(),
        status: "signed",
        raw: lt.raw,
        txid: lt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(ft), it(ft);
      const Xt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(lt.raw, lt.txid), it({ ...ft, status: "pending" }), b = `♪ Paid ${Xt}`, T = "";
      } catch (Ne) {
        it({ ...ft, status: bi(Ne) ? "failed" : "unknown", note: Ne.message, ...bi(Ne) ? { raw: void 0 } : {} }), T = Ne.message;
      }
      return i = await Ke(s), "done";
    } catch (V) {
      const et = V instanceof Error ? V.message : "payment unavailable";
      return ($ = oe()) != null && $.player ? (b = "Payment is taking a moment: " + et, "wait") : (b = "This song played free: " + et, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function di(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(R()) || H("like") ? !1 : (yr(w), !0);
  }
  async function yr(w) {
    const $ = w.title ? `“${w.title}”` : `song #${w.song}`, V = (vn) => {
      var bs;
      T = vn, b = "";
      try {
        (bs = t.likeFailed) == null || bs.call(t, w.song);
      } catch {
      }
      t.changed();
    }, et = jt(), yt = R(), k = t.main(), O = et && (yt === "fund" || yt === "over") ? "ready" : yt, lt = _() ? At() : k;
    if (O === "locked") {
      p = { ...w, at: t.now() }, ht(`Unlock to like ${$}. It sends straight after.`);
      return;
    }
    if (O === "wrong-wallet") return V(hn());
    if (O === "link") return V("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (_() && H("standalone")) return V("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (O === "fund") return V("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (O === "over") return V("Return the excess first: the listening wallet holds more than 1 STX.");
    if (et) {
      await pn(!0);
      const vn = Bt();
      if (Je(vn))
        return t.changed(), V(Zh);
    }
    if (O !== "ready" || !lt) return V("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return V("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!F) return V("Pay-per-play is running in another tab. Like from that tab.");
    const ft = U(At()).find((vn) => vn.kind === "like" && vn.song === w.song);
    if (ft && ao.includes(ft.status))
      return V(`Your last like for ${$} is still on its way. It can change again once it confirms.`);
    if (l) return V("One like at a time: your last one is still being sent.");
    if ((ft == null ? void 0 : ft.status) === "confirmed" && t.now() - (ft.confirmedAt ?? 0) < Q5)
      return V(`Your like for ${$} has only just confirmed. Try again in a moment.`);
    let Xt;
    y = !0;
    try {
      Xt = t.likeState ? (await t.likeState(lt, w.song)).by : w.likedBy ?? [];
    } catch {
      Xt = w.likedBy;
    } finally {
      y = !1;
    }
    if (!Xt) return V(`Could not check ${$} right now. Try the heart again.`);
    const Ne = At(), we = ((ft == null ? void 0 : ft.status) === "confirmed" && typeof ft.liked == "boolean" && t.now() - (ft.confirmedAt ?? ft.created) < 5 * 6e4 ? ft.liked : void 0) ?? Xt.includes(Ne);
    if (!we && Xt.some((vn) => vn !== Ne)) return V(_() ? `${$} was liked from another wallet of yours. Unlike it there.` : `${$} was liked from your main wallet${Xt.includes(k) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await hi({ song: w.song, liked: !we, title: w.title, artist: w.artist });
  }
  async function hi(w) {
    var et, yt, k;
    if (l) {
      ht("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const $ = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, V = t.wait ?? ((O) => new Promise((lt) => setTimeout(lt, O)));
    try {
      ht(`${w.liked ? "Liking" : "Unliking"} ${$}…`);
      const O = t.now() + 12e4;
      for (; d || (jt() ? U(At()).some((we) => ao.includes(we.status)) : vt().length); ) {
        if (t.now() > O) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await V(5e3), await Vt(!0);
      }
      if (!jt() && R() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const lt = At(), { balance: ft, nonce: Xt } = await t.chain.account(lt);
      if (jt() ? c = { for: lt, value: ft, at: t.now() } : (o = ft, a = t.now()), Je(ft)) throw new Error(Zh);
      const Ne = await s.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: il.toString(),
        nonce: Xt.toString(),
        balance: ft.toString()
      }), Ae = {
        id: cl(),
        address: lt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: il.toString(),
        nonce: Xt.toString(),
        created: t.now(),
        status: "signed",
        raw: Ne.raw,
        txid: Ne.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(Ae), it(Ae);
      try {
        await t.chain.broadcast(Ne.raw, Ne.txid), it({ ...Ae, status: "pending" }), b = `${w.liked ? "♥ Liked" : "Unliked"} ${$}`, T = "";
        try {
          (et = t.likeSent) == null || et.call(t, w.song, w.liked);
        } catch {
        }
      } catch (we) {
        if (it({ ...Ae, status: bi(we) ? "failed" : "unknown", note: we.message, ...bi(we) ? { raw: void 0 } : {} }), T = we.message, bi(we)) try {
          (yt = t.likeFailed) == null || yt.call(t, w.song);
        } catch {
        }
      }
      i = await Ke(s);
    } catch (O) {
      T = "Like not sent: " + (O instanceof Error ? O.message : "the listening wallet is unavailable");
      try {
        (k = t.likeFailed) == null || k.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Mr();
    }
  }
  return { snapshot: ut, refresh: Vt, onListened: ui, heart: di, toggleLike: yr, ...ws };
}
const zy = ["Connect", "Passkey", "Link & fund", "Listen"], Ry = ["Passkey", "Add 1 STX", "Listen"], gu = (t) => t ? Ry : zy;
function t6(t) {
  if (t.solo) return e6(t);
  const e = zy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function e6(t) {
  const e = Ry.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function n6(t, e) {
  return !e || e.at >= gu(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const r6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function s6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !r6(r.id)));
}
const i6 = {}, o6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, a6 = (t) => {
  const e = i6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, c6 = (t) => `/hiro/${t}`, l6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, u6 = (t) => {
  const e = a6(t);
  if (e)
    return [l6(e)];
  const n = o6[t];
  return typeof window < "u" ? [`${window.location.origin}${c6(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, f6 = {}, Qh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, d6 = "xtrata.log.enabled", h6 = "xtrata.log.level", p6 = "xtrata.log.tags", g6 = "xtrata.log.dedupe", ya = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, y6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, w6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, b6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, m6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, x6 = () => {
  const t = f6 ?? {}, e = ya(d6) ?? t.VITE_LOG_ENABLED, n = ya(h6) ?? t.VITE_LOG_LEVEL, r = ya(p6) ?? t.VITE_LOG_TAGS, s = ya(g6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: y6(e),
    level: w6(n) ?? "warn",
    tags: m6(r),
    dedupe: b6(s)
  };
}, S6 = (t, e, n) => !t.enabled || Qh[n] < Qh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), E6 = (t, e, n, r) => {
  const s = x6();
  if (!S6(s, e, t) || v6(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, A6 = /* @__PURE__ */ new Set();
let Jh = null;
const v6 = (t, e, n, r, s) => (Jh !== t && (A6.clear(), Jh = t), !1), $6 = (t, e, n) => E6("debug", t, e, n), k6 = {}, I6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, L6 = (t) => {
  const e = k6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : I6[t];
}, C6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, T6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return C6.test(n) ? n : null;
}, B6 = (t) => t.replace(/\/+$/, ""), M6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), t0 = (t) => {
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
}, mi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, N6 = (t) => {
  var c, u;
  let e;
  try {
    e = nr(N8(t));
  } catch {
    return null;
  }
  const n = mi(e);
  if (!n || n.success === !1)
    return null;
  const r = mi(n.value), s = mi(r == null ? void 0 : r.value), i = mi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = t0((c = mi(i.name)) == null ? void 0 : c.value), a = t0((u = mi(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : T6(`${o}.${a}`);
}, P6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${B6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Ey(iy(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : N6(i.result);
}, _6 = async (t) => {
  const e = t.address.trim();
  if (!Ci(e))
    return null;
  const n = L6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of u6(t.network))
    try {
      return await P6({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return $6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: M6(r)
  }), null;
};
function U6(t, e, n = {}) {
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
const e0 = Object.freeze({
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
}), n0 = Object.freeze({ 139: "melophonic" });
function H6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(e0, n) ? e0[n] : Object.hasOwn(n0, n) ? n0[n] : e;
}
const r0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function O6(t, e = "") {
  return Object.hasOwn(r0, String(t)) ? r0[String(t)] : e;
}
const Gy = 100000n, kf = 1000000n, nc = 3000n, D6 = (t, e) => `${t}#gift=${e}`, F6 = 100, wa = (t, e = oi) => t <= De ? 0 : Number((t - De) / mn(e)), s0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Ky = "xtrata.xyz/radio/gifts", ll = F6, j6 = "Create a prefunded Xtrata radio gift batch", z6 = (t) => ({
  domain: qs({ name: We(Ky), version: We("1"), "chain-id": or(1) }),
  message: qs({
    purpose: We(j6),
    creator: We(t.creator),
    count: or(t.count),
    amount: or(BigInt(t.amount)),
    label: We(t.label),
    issued: or(t.issued),
    ...t.player ? { player: We(t.player) } : {}
  })
}), R6 = (t, e, n = oi) => De + BigInt(t) * mn(n) + (e ? Bc : 0n), G6 = (t, e = oi) => Number((kf - De - (t ? Bc : 0n)) / mn(e)), K6 = (t, e) => BigInt(t) * (e + nc);
function V6(t, e, n, r = oi) {
  const s = n ? Bc : 0n, i = e > De + s ? e - De - s : 0n, o = Number(i / mn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * tc,
    fees: BigInt(o) * r,
    reserve: De,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: nc,
    perCopy: e + nc,
    total: K6(t, e)
  };
}
const q6 = (t) => t >= Gy && t <= kf, i0 = 40, W6 = "Create an Xtrata radio gift player", X6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function o0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && X6.test(t) : !n;
}
function Y6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!o0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!o0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > i0) throw new Error(`A player holds 1 to ${i0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const Z6 = (t) => cp(pp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), Q6 = (t) => ({
  domain: qs({ name: We(Ky), version: We("1"), "chain-id": or(1) }),
  message: qs({
    purpose: We(W6),
    admin: We(t.admin),
    player: We(t.hash),
    issued: or(t.issued)
  })
}), To = (t) => t.tracks.filter((e) => !e.hidden), J6 = (t) => t.tracks.find((e) => e.hidden) ?? null, t$ = [300, 500, 1e3], a0 = 1800, ul = /* @__PURE__ */ new Map();
async function e$(t) {
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
function n$(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = ul.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      ul.set(t, { ...a, until: Date.now() + a0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ul.delete(t), s();
      }, a0 + 50);
    }
  }, i;
}
const Ii = (t, e, n, r, s) => n$(t, e, async () => await e$(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), ms = "xtrata.radio.gift.incoming.v1", c0 = (t) => "xtrata.radio.gift.mine.v1:" + t, l0 = (t) => "xtrata.radio.gift.batches.v1:" + t, It = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, xr = (t, e, n = "") => {
  const r = It("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, ba = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, kn = (t) => Jn(t).replace(/\.?0+$/, "");
function r$(t) {
  let e = null;
  const n = (v) => [5e3, 1e4, 2e4, 3e4][v] ?? 6e4, r = (() => {
    try {
      const v = new URL(location.href), j = new URLSearchParams(v.hash.slice(1)).get("gift") ?? v.searchParams.get("gift");
      return j !== null && (v.searchParams.delete("gift"), history.replaceState(null, "", v.pathname + (v.search || ""))), s0(j) ? j : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const v = JSON.parse(t.store.get(ms) || "null");
      return s0(v == null ? void 0 : v.code) ? v.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(ms, JSON.stringify({ code: i, at: t.now() }));
    let v = 0;
    const j = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (_) => {
      const G = await _.json().catch(() => ({}));
      if (_.status === 404) {
        t.store.set(ms, null), e = { ...e, error: (G == null ? void 0 : G.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!_.ok) throw new Error("busy");
      const bt = G;
      e = { ...e, view: bt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(bt.status) && t.store.set(ms, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void j(), n(v++)));
    });
    j();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const v = e == null ? void 0 : e.view;
    return !(v != null && v.player) || !o() ? null : { player: v.player, from: u(v), plays: wa(BigInt(v.amount)) };
  }, c = () => {
    e = null, t.store.set(ms, null), t.changed();
  }, u = (v) => v.from ? t.who(v.from) : v.label ? `Xtrata Radio · ${v.label}` : "Xtrata Radio";
  let d = {};
  const l = (v) => {
    if (d.box) return d.box;
    const j = It("div", "", "ppp-gift-check");
    d.box = j;
    const _ = () => {
      const G = window.turnstile;
      !G || d.rendered || (d.rendered = !0, G.render(j, { sitekey: v, callback: (bt) => {
        d.token = bt, t.changed();
      }, "expired-callback": () => {
        d.token = void 0;
      } }));
    };
    if (window.turnstile) _();
    else {
      const G = document.createElement("script");
      G.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", G.async = !0, G.onload = _, document.head.append(G);
    }
    return j;
  }, y = (v) => {
    queueMicrotask(() => void v());
  };
  let p;
  async function E(v) {
    var G, bt, kt, le, ne, ue, oe, Re, Ge;
    if (!e || e.claiming || !v.listening) return;
    const j = !!((G = e.view) != null && G.player);
    if (j && !v.root) return;
    e.claiming = !0, e.error = void 0, (bt = t.claiming) == null || bt.call(t, !0), t.changed();
    const _ = async (Wt) => {
      const gt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: d.token, ...Wt })
      });
      return { res: gt, r: await gt.json().catch(() => ({})) };
    };
    try {
      let Wt = 0, gt = v.listening, te;
      if (j) {
        const ge = Number((kt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(v.root))) == null ? void 0 : kt.next);
        if (!Number.isSafeInteger(ge) || ge < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Wt = ge;
        for (let on = 0; ; on++) {
          const h = await t.album.bind(Wt);
          if (gt = h.address, te = await _({ wallet: gt, binding: h }), te.res.status === 409 && /just taken/.test(((le = te.r) == null ? void 0 : le.error) || "") && on < 5) {
            Wt += 1;
            continue;
          }
          break;
        }
      } else te = await _({ wallet: gt });
      const { res: ae, r: Se } = te;
      if (ae.status === 503 && /sending another gift/.test((Se == null ? void 0 : Se.error) || "")) {
        e.waiting = !0, (ne = t.claiming) == null || ne.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ae.ok) {
        const ge = String((Se == null ? void 0 : Se.error) || "");
        if (ae.status === 404 || ae.status === 410 || ae.status === 409 && /already had a gift|brand-new|already have this album/.test(ge))
          throw t.store.set(ms, null), new Error(ge || "This gift cannot be opened.");
        if (ae.status === 429 || ae.status === 403 || ae.status === 400 && !/wallet number/i.test(ge)) throw new Error(ge || `Could not open the gift (${ae.status}).`);
        const h = /topping up/.test(ge) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(ge) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(ge) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(h), { retry: !0, slow: /topping up|not paid for yet/.test(ge) });
      }
      e.done = !0, t.store.set(ms, null), j ? await t.album.arrived(Wt, gt, Se.txid, BigInt(Se.amount)) : t.giftSent(Se.txid, BigInt(Se.amount));
    } catch (Wt) {
      const gt = Wt, te = gt.name === "TypeError" || gt.name === "AbortError" || gt.name === "TimeoutError" || /wallet number/i.test(gt.message);
      if (gt.retry || te) {
        const ae = e.tries ?? 0;
        e.tries = ae + 1, e.retry = { text: gt.retry ? gt.message : "Still sending your gift… the network is slow, trying again." }, (ue = t.claiming) == null || ue.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, gt.slow ? 6e4 : n(ae));
      } else
        e.error = gt.message, (oe = t.claiming) == null || oe.call(t, !1);
      d.token = void 0;
      try {
        (Ge = (Re = window.turnstile) == null ? void 0 : Re.reset) == null || Ge.call(Re, d.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let b = null;
  function T(v) {
    if (!v.listening || !v.depositPending || v.step !== "fund")
      return b = null, [];
    if (!b || b.wallet !== v.listening || t.now() - b.at > 3e4) {
      const _ = v.listening;
      b = { ...(b == null ? void 0 : b.wallet) === _ ? b : {}, wallet: _, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(_)).then((G) => {
        var bt, kt;
        (b == null ? void 0 : b.wallet) === _ && (b.state = (bt = G == null ? void 0 : G.gift) == null ? void 0 : bt.state, b.problem = ((kt = G == null ? void 0 : G.gift) == null ? void 0 : kt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(b.state === "sending" && b.problem)) return [];
    const j = It("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return j.title = `Network reply: ${b.problem}`, [j];
  }
  function W(v, j, _ = !1) {
    var ue, oe;
    const G = j.player, bt = BigInt(j.amount), kt = _ ? [] : [It("p", `🎁 ${u(j)} sent you “${G.title}”${G.subtitle ? ` by ${G.subtitle}` : ""}: ${To(G).length} ${To(G).length === 1 ? "song" : "songs"} and ${wa(bt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!v.root && ["fund", "ready", "over", "link"].includes(v.step)))
      return _ || kt.push(It("p", v.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : v.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), kt;
    if (v.walletCannotAlbums)
      return kt.push(It("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), kt;
    const ne = (oe = (ue = v.gate) == null ? void 0 : ue.gifts) == null ? void 0 : oe.turnstileSiteKey;
    return ne && !d.token ? kt.push(It("p", "One quick check and it is yours:", "ppp-mute"), l(ne)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => E(v)), kt.push(...X(v, "Sending your album…")), kt;
  }
  function X(v, j) {
    const _ = [];
    return e.claiming || e.waiting ? _.push(It("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : j, "ppp-cyan")) : e.retry && _.push(It("p", e.retry.text, "ppp-warn"), xr("Try now", () => {
      clearTimeout(p), e.retry = void 0, E(v);
    }, "quiet")), e.error && _.push(It("p", e.error, "ppp-bad"), xr("Try again", () => {
      e.error = void 0, E(v);
    })), _;
  }
  const S = (v) => {
    var j;
    return !!e && !e.done && !e.error && o() && !!v.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !v.linked && !v.creditedTo && (v.createdHere || v.brandNew || !!((j = e.view) != null && j.player)) && (v.balance ?? 0n) === 0n && !v.entries.length);
  };
  function N(v, j = {}) {
    var Ge, Wt;
    const _ = T(v);
    if (!e || ["off", "elsewhere"].includes(v.step)) return _;
    const G = e.view;
    if (e.error && !G) return [It("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!G) return [It("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return _;
    if (G.status === "claimed" || G.status === "claiming") return [It("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(G.status)) return [It("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (G.status === "pending-deposit") return [It("p", `🎁 ${u(G)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (G.player) return [...W(v, G, !!j.bare), ..._];
    if (!!v.listening && (!(v.createdHere || v.brandNew) || !!v.linked || !!v.creditedTo || (v.balance ?? 0n) > 0n || v.entries.length > 0))
      return [It("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), xr("Forget this gift link here", c, "quiet")];
    const kt = BigInt(G.amount), le = wa(kt).toLocaleString(), ue = [It(
      "p",
      `🎁 ${u(G)} sent you ${kn(kt)} STX of on-chain music: about ${le} paid plays.`,
      "ppp-gift"
    )], oe = !!v.listening && (v.createdHere || v.brandNew) && !v.linked && !v.creditedTo && v.step === "fund" && (v.balance ?? 1n) === 0n && !v.depositPending && !v.entries.length, Re = (Wt = (Ge = v.gate) == null ? void 0 : Ge.gifts) == null ? void 0 : Wt.turnstileSiteKey;
    return oe ? (Re && !d.token ? ue.push(It("p", "One quick check and it is yours:", "ppp-mute"), l(Re)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => E(v)), ue.push(...X(v, "Sending your gift…"))) : v.step === "intro" ? ue.push(It("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : v.listening && v.linked ? ue.push(It("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), xr("Forget this gift link here", c, "quiet")) : v.listening && (v.balance ?? 0n) > 0n && ue.push(It("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), xr("Forget this gift link here", c, "quiet")), ue;
  }
  async function B(v, j, _) {
    var G;
    try {
      const bt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(v));
      if ((G = bt == null ? void 0 : bt.gift) != null && G.returnTo) return { ok: !0, funder: bt.gift.returnTo, txId: bt.gift.txid ?? void 0, amount: bt.gift.amount, distinct: 1 };
    } catch {
      if (_) return { ok: !1 };
    }
    return j();
  }
  const J = It("div", "", "ppp-gift-fold");
  let nt = 250000n, K = "", z = "";
  const A = (v) => {
    try {
      const j = JSON.parse(t.store.get(c0(v)) || "[]");
      return Array.isArray(j) ? j : [];
    } catch {
      return [];
    }
  }, P = (v, j) => t.store.set(c0(v), JSON.stringify(j.slice(0, 50)));
  async function M(v) {
    const j = A(v);
    for (const _ of j)
      if (!(_.view && ["claimed", "refunded", "expired"].includes(_.view.status)))
        try {
          _.view = !_.view || _.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: _.id, ..._.txid ? { txid: _.txid } : {} }) }) : await t.json("/radio/gift?id=" + _.id), _.error = void 0;
        } catch (G) {
          _.error = G.message;
        }
    P(v, j), t.changed();
  }
  async function q(v) {
    if (K) return;
    K = "Starting your gift…", z = "", t.changed();
    let j = null;
    try {
      j = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: v, amount: nt.toString() }) });
      const _ = A(v);
      _.unshift({ id: j.id, code: j.code, amount: nt.toString(), at: t.now() }), P(v, _), K = "Approve the gift in your wallet…", t.changed();
      const G = await t.pay(v, j.depositTo, BigInt(j.deposit), j.memo), bt = A(v), kt = bt.find((le) => le.id === j.id);
      kt && (kt.txid = G, kt.view = { status: "pending-deposit", amount: nt.toString(), source: "friend", from: v, label: "", expires: 0 }), P(v, bt), z = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", M(v);
    } catch (_) {
      z = _.message || "Not sent.";
    } finally {
      K = "", t.changed();
    }
  }
  const at = (v) => "xtrata.radio.gift.players.v1:" + v, Y = (v) => {
    try {
      const j = JSON.parse(t.store.get(at(v)) || "[]");
      return Array.isArray(j) ? j.filter((_) => _ && /^[0-9a-f]{16}$/.test(_.id)) : [];
    } catch {
      return [];
    }
  };
  async function L(v, j) {
    var _;
    if (!K) {
      K = "Checking the player…", z = "", t.changed();
      try {
        const G = j.tracks.split(/[\s,]+/).filter(Boolean).map((oe) => Number(oe.replace(/^#/, ""))), bt = Y6({ title: j.title.trim(), subtitle: j.subtitle.trim(), tracks: G, cover: (_ = j.cover) != null && _.trim() ? Number(j.cover.trim().replace(/^#/, "")) : null });
        K = "Sign in your wallet…", t.changed();
        const kt = { admin: v, hash: Z6(bt), issued: t.now() }, le = await t.sign(v, Q6(kt));
        K = "Making the player…", t.changed();
        const ne = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: bt, request: kt, signature: le }) }), ue = Y(v).filter((oe) => oe.id !== ne.id);
        ue.unshift({ id: ne.id, title: ne.title, tracks: ne.tracks }), t.store.set(at(v), JSON.stringify(ue.slice(0, 30))), z = `${ne.existing ? "That player already exists" : "Player made"} ✓ “${ne.title}” · ${ne.tracks} songs. Pick it below for a batch.`;
      } catch (G) {
        z = G.message || "Not made.";
      } finally {
        K = "", t.changed();
      }
    }
  }
  const rt = (v, j) => D6(v || location.origin + "/radio.html", j), Zt = (v) => {
    try {
      const j = JSON.parse(t.store.get(l0(v)) || "[]");
      return Array.isArray(j) ? j.filter((_) => _ && /^[0-9a-f]{16}$/.test(_.id) && Array.isArray(_.codes)) : [];
    } catch {
      return [];
    }
  }, I = (v, j) => t.store.set(l0(v), JSON.stringify(j.slice(0, 20))), F = (v) => !!v.view && v.view.status === "live" && v.view.copies.waiting + v.view.copies.claiming + v.view.copies.refunding === 0, St = (v, j) => t.json(v, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(j) });
  let Nt = 0;
  async function Tt(v) {
    const j = Zt(v);
    for (const _ of j)
      if (!F(_))
        try {
          _.view = !_.view || _.view.status === "pending-deposit" ? await St("/radio/gift/batch/confirm", { id: _.id, ..._.txid ? { txid: _.txid } : {} }) : await t.json("/radio/gift/batch?id=" + _.id), _.error = void 0;
        } catch (G) {
          _.error = G.message;
        }
    try {
      const _ = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(v));
      for (const G of (_ == null ? void 0 : _.batches) ?? []) {
        const bt = j.find((kt) => kt.id === G.id);
        if (bt) {
          bt.error || (bt.view = G);
          continue;
        }
        j.push({ id: G.id, codes: [], count: G.count, amount: G.amount, label: G.label, player: G.player, depositTo: "", deposit: G.deposit, memo: G.memo, at: 0, view: G });
      }
    } catch {
    }
    I(v, j), t.changed();
  }
  async function Qt(v, j) {
    const _ = Zt(v).find((G) => G.id === j);
    if (!(!_ || !_.depositTo || K)) {
      K = "Approve the payment in your wallet…", z = "", t.changed();
      try {
        const G = await t.pay(v, _.depositTo, BigInt(_.deposit), _.memo), bt = Zt(v), kt = bt.find((le) => le.id === j);
        kt && (kt.txid = G), I(v, bt), z = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", K = "", Tt(v);
      } catch (G) {
        z = `${/cancel/i.test(G.message) ? "Payment cancelled." : G.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        K = "", t.changed();
      }
    }
  }
  async function ie(v, j, _, G) {
    if (K) return;
    if (!j.ok) {
      z = j.reason, t.changed();
      return;
    }
    K = "Sign in your wallet…", z = "", t.changed();
    let bt = null;
    try {
      const kt = { creator: v, count: j.count, amount: j.amount.toString(), label: _, issued: t.now(), ...G ? { player: G } : {} }, le = await t.sign(v, z6(kt));
      K = "Making your links…", t.changed(), bt = await St("/radio/gift/batch", { request: kt, signature: le });
      const ne = Zt(v);
      ne.unshift({ id: bt.id, codes: bt.codes, count: j.count, amount: bt.amount, label: _, player: G ?? null, depositTo: bt.depositTo, deposit: bt.deposit, memo: bt.memo, at: t.now() }), I(v, ne);
    } catch (kt) {
      z = kt.message || "Not made.", K = "", t.changed();
      return;
    }
    K = "", t.changed(), await Qt(v, bt.id);
  }
  function m() {
    const v = !!$t.value, j = he.value === "max" ? G6(v) : Number(he.value), _ = R6(j, v), G = Number(Ft.value);
    return !Number.isInteger(G) || G < 1 || G > ll ? { ok: !1, reason: `Make 1 to ${ll} copies at a time.`, album: v, plays: j, amount: _, count: G } : q6(_) ? { ok: !0, reason: "", album: v, plays: j, amount: _, count: G, bill: V6(G, _, v) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: v, plays: j, amount: _, count: G };
  }
  const H = () => {
    const v = m();
    if (!v.ok) return v.reason;
    const j = v.bill;
    return `Each copy: ${v.plays.toLocaleString()} paid plays (${kn(j.holders)} to song holders, ${kn(j.fees)} network fees)${v.album ? `, ${kn(j.float)} for the album’s likes` : ""}, ${kn(j.reserve)} kept so a listener can return what is left, + ${kn(j.sendFee)} to send it = ${kn(j.perCopy)} STX. ${v.count} copies = ${kn(j.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, tt = (v, j) => j.codes.map((_) => rt(v, _)), U = It("input");
  U.type = "range", U.min = String(Gy), U.max = String(kf), U.step = "50000", U.value = String(nt), U.setAttribute("aria-label", "Gift amount");
  const it = It("p", "", "ppp-gift-amount"), ct = xr("", () => {
    const v = t.main();
    v && q(v);
  }, "primary"), Lt = () => {
    it.textContent = vt(), ct.textContent = `Gift ${kn(nt)} STX`;
  };
  U.oninput = () => {
    nt = BigInt(U.value), Lt();
  };
  const vt = () => `${kn(nt)} STX · about ${wa(nt).toLocaleString()} paid plays · you pay ${kn(nt + nc)} STX with the network fee`;
  Lt();
  const Kt = It("input");
  Kt.maxLength = 60, Kt.placeholder = "Title, e.g. Proof of Sound", Kt.setAttribute("aria-label", "Player title");
  const Dt = It("input");
  Dt.maxLength = 80, Dt.placeholder = "Artist (optional)", Dt.setAttribute("aria-label", "Player subtitle");
  const Et = It("textarea");
  Et.rows = 3, Et.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Et.setAttribute("aria-label", "Songs");
  const wt = It("input");
  wt.inputMode = "numeric", wt.placeholder = "Cover inscription number (optional), shown when the album loads", wt.setAttribute("aria-label", "Cover inscription");
  const $t = It("select");
  $t.setAttribute("aria-label", "Batch album");
  const he = It("select");
  he.setAttribute("aria-label", "Plays per copy");
  for (const v of t$) he.append(ba(`${v.toLocaleString()} plays`, String(v)));
  he.append(ba("Max (1 STX)", "max"));
  const Ft = It("input");
  Ft.type = "number", Ft.min = "1", Ft.max = String(ll), Ft.value = "10", Ft.setAttribute("aria-label", "Copies");
  const ye = It("input");
  ye.maxLength = 40, ye.placeholder = "Label, e.g. Opera launch", ye.setAttribute("aria-label", "Batch label");
  const At = It("p", "", "ppp-mute"), jt = () => {
    At.textContent = H();
  };
  for (const v of [$t, he, Ft])
    v.oninput = jt, v.onchange = jt;
  jt();
  function Bt(v) {
    var bt, kt;
    const j = (bt = v.gate) == null ? void 0 : bt.gifts;
    if (!(j != null && j.enabled) || !j.admin || ["off", "elsewhere", "unsupported"].includes(v.step)) return null;
    const _ = t.main(), G = [It("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!_)
      G.push(It("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (j.admin) {
      const le = It("div", "", "ppp-gift-admin"), ne = (Wt, gt) => {
        const te = It("label", Wt);
        return te.append(gt), te;
      }, ue = Y(_);
      le.append(
        It("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Kt,
        Dt,
        Et,
        wt,
        xr("Sign and make player", () => void L(_, { title: Kt.value, subtitle: Dt.value, tracks: Et.value, cover: wt.value }))
      );
      const oe = xr("Sign, pay and make links", () => {
        ie(_, m(), ye.value.trim(), $t.value || void 0);
      });
      oe.disabled = !!K;
      const Re = $t.value;
      $t.replaceChildren(ba("No album (starter copies)", ""), ...ue.map((Wt) => ba(`${Wt.title} · ${Wt.tracks} songs`, Wt.id))), ue.some((Wt) => Wt.id === Re) && ($t.value = Re), jt(), le.append(
        It("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        ne("Album ", $t),
        ne("Plays each ", he),
        ne("Copies ", Ft),
        ye,
        At,
        oe
      ), t.now() - Nt > 3e4 && (Nt = t.now(), Tt(_));
      const Ge = Zt(_);
      if (Ge.length) {
        const Wt = It("ul", "", "ppp-gift-list");
        for (const gt of Ge.slice(0, 10)) {
          const te = gt.view, ae = te == null ? void 0 : te.copies, Se = gt.error ? gt.error : !te || te.status === "pending-deposit" ? gt.txid ? "payment confirming…" : "waiting for your payment" : `${ae.claimed} of ${te.count} claimed${ae.refunding + ae.refunded ? ` · ${ae.refunded} refunded${ae.refunding ? `, ${ae.refunding} on their way` : ""}` : ""}`, ge = It("li");
          if (ge.append(It("span", `${gt.label || "Batch"} · ${gt.count} × ${kn(BigInt(gt.amount))} STX`, "t"), It("span", Se, "ppp-mute")), !gt.txid && gt.depositTo && (!te || te.status === "pending-deposit") && ge.append(xr("Pay now", () => void Qt(_, gt.id), "tiny")), gt.codes.length && (te == null ? void 0 : te.status) === "live") {
            const on = tt(((kt = v.gate) == null ? void 0 : kt.radioUrl) ?? null, gt);
            ge.append(
              Ii("batch-copy:" + gt.id, "Copy all links", () => on.join(`
`), "tiny", t.changed),
              Ii("batch-csv:" + gt.id, "Copy as CSV", () => ["copy,link", ...on.map((h, x) => `${x + 1},${h}`)].join(`
`), "tiny", t.changed)
            );
          } else gt.codes.length || ge.append(It("span", "links were made on another device", "ppp-mute"));
          Wt.append(ge);
        }
        le.append(Wt);
      }
      G.push(le);
    }
    return K && G.push(It("p", K, "ppp-cyan")), z && G.push(It("p", z, /✓/.test(z) ? "ppp-ok" : "ppp-warn")), J.replaceChildren(...G), J;
  }
  return { banner: N, funder: B, renderFold: Bt, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: S };
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
const o$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function a$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = o$(i);
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
function c$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const xi = 12, l$ = 5e3, ln = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Si = (t, e, n = "") => {
  const r = ln("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function u$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = xi;
  const l = ln("div", "", "ppp-shelf-box"), y = (M) => "xtrata.radio.shelf.pins.v1:" + M, p = (M) => "xtrata.radio.shelf.recent.v1:" + M, E = (M, q) => {
    try {
      return JSON.parse(t.store.get(M) || "null") ?? q;
    } catch {
      return q;
    }
  }, b = (M) => new Set(E(y(M), []).filter((q) => Number.isSafeInteger(q))), T = (M) => {
    const q = E(p(M), {}), at = {};
    for (const [Y, L] of Object.entries(q)) Number.isSafeInteger(Number(Y)) && typeof L == "number" && (at[Number(Y)] = L);
    return at;
  };
  async function W(M) {
    if (!s) {
      s = !0, i = !1;
      try {
        const q = [];
        let at = 0, Y = 0;
        for (let L = 0; L < l$ / 100 + 1; L++) {
          const rt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${at}&limit=100`);
          if (q.push(...i$(rt == null ? void 0 : rt.shelf)), Y = Number(rt == null ? void 0 : rt.total) || q.length, !(rt != null && rt.next) || !Number.isSafeInteger(rt.next)) break;
          at = rt.next;
        }
        M === e && (n = q, r = Y, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const X = () => {
    o = -1 / 0;
  }, S = ln("input");
  S.type = "search", S.placeholder = "Search title, artist or #", S.setAttribute("aria-label", "Search your albums"), S.oninput = () => {
    a = S.value, d = xi, t.changed();
  };
  const N = ln("select");
  N.setAttribute("aria-label", "Sort albums");
  for (const M of s$) {
    const q = document.createElement("option");
    q.value = M.value, q.textContent = M.label, N.append(q);
  }
  N.onchange = () => {
    c = N.value, d = xi, t.changed();
  };
  const B = Si("", () => {
    u = !u, d = xi, t.changed();
  }, "tiny"), J = ln("div", "", "ppp-shelf-tools");
  J.append(S, N, B);
  const nt = ln("div"), K = ln("div");
  function z(M) {
    const q = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (q !== e && (e = q, n = [], r = 0, o = -1 / 0, d = xi), !q || M.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && W(q), !n.length)
      return i ? (K.replaceChildren(ln("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Si("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(K), l) : null;
    const at = b(q), Y = T(q), L = a$(n, { query: a, sort: c, pinnedOnly: u, pins: at, recents: Y });
    S.value !== a && (S.value = a), N.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const rt = [];
    if (M.slot > 0 && rt.push(Si("← My player", () => t.open(0), "quiet")), !L.length) rt.push(ln("p", "No album matches that.", "ppp-mute"));
    else {
      const Zt = ln("ul", "", "ppp-shelf-list");
      for (const I of L.slice(0, d)) {
        const F = ln("li", "", I.slot === M.slot ? "now" : ""), St = at.has(I.slot), Nt = Si(St ? "★" : "☆", () => {
          const m = new Set(at);
          St ? m.delete(I.slot) : m.add(I.slot), t.store.set(y(q), JSON.stringify([...m])), t.changed();
        }, "tiny");
        Nt.setAttribute("aria-label", St ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const Tt = [I.player.subtitle, `${To(I.player).length} ${To(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Qt = I.slot === M.slot, ie = Si(Qt ? "Playing" : "Play", () => {
          t.store.set(p(q), JSON.stringify(c$({ ...Y, [I.slot]: t.now() }))), t.open(I.slot);
        }, Qt ? "tiny" : "tiny primary");
        ie.disabled = Qt, F.append(Nt, ln("span", I.player.title, "t"), ln("span", " " + Tt, "ppp-mute"), ie), Zt.append(F);
      }
      rt.push(Zt), L.length > d && rt.push(Si(`Show more (${L.length - d} left)`, () => {
        d += xi, t.changed();
      }, "quiet"));
    }
    return i && rt.push(ln("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), nt.replaceChildren(...rt), l.firstChild !== J && l.replaceChildren(J, nt), l;
  }
  return { render: z, invalidate: X, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const M = T(e), q = [...n].filter((at) => at.player).sort((at, Y) => (M[Y.slot] ?? 0) - (M[at.slot] ?? 0) || Y.slot - at.slot)[0];
    return q ? { slot: q.slot, title: q.player.title } : null;
  } };
}
const f$ = 20, qe = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ce = {
  grid: qe('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: qe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: qe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: qe('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: qe('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: qe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: qe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: qe('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: qe('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: qe('<path d="M6 9l6 6 6-6"/>', 18),
  right: qe('<path d="M9 6l6 6-6 6"/>', 16),
  close: qe('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: qe('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: qe('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: qe('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: qe('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: qe('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const Ye = (t, ...e) => Q("button", { type: "button", ...t }, ...e), ma = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, co = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, d$ = { music: "My music", device: "This device", gifts: "Albums (admin)" }, h$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function u0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function d(m) {
    var tt, U, it;
    if (!m || !Number.isSafeInteger(m)) return "";
    const H = (it = (U = (tt = e.radio()) == null ? void 0 : tt.getState) == null ? void 0 : U.call(tt)) == null ? void 0 : it.albumCover;
    return H != null && H.url && Number(H.tokenId) === m ? H.url : c.has(m) ? c.get(m) : (u.has(m) || (u.add(m), fetch("/inscription/" + m, { signal: AbortSignal.timeout(2e4) }).then(async (ct) => {
      var vt, Kt, Dt, Et;
      const Lt = (ct.headers.get("content-type") || "").toLowerCase();
      if (!ct.ok)
        throw await ((vt = ct.body) == null ? void 0 : vt.cancel()), new Error("no cover");
      return Lt.startsWith("image/") ? (await ((Kt = ct.body) == null ? void 0 : Kt.cancel()), "/inscription/" + m) : Lt.includes("text/html") ? (((Dt = (await ct.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : Dt[1]) ?? "").replace(/&amp;/g, "&") : (await ((Et = ct.body) == null ? void 0 : Et.cancel()), "");
    }).then((ct) => {
      c.set(m, ct), ie();
    }).catch(() => {
      u.delete(m);
    })), "");
  }
  const l = "xtrata:al-thumb:v1:", y = "-", p = 96, E = 24 * 1024 * 1024, b = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Set(), W = [];
  let X = !1, S;
  const N = (m, H) => {
    try {
      if (H === void 0) return window.localStorage.getItem(l + m);
      window.localStorage.setItem(l + m, H);
    } catch {
    }
    return null;
  };
  function B(m) {
    return new Promise((H) => {
      var tt;
      try {
        const U = document.createElement("canvas"), it = (tt = U.getContext) == null ? void 0 : tt.call(U, "2d");
        if (!it) return H(m);
        const ct = new Image(), Lt = setTimeout(() => H(m), 8e3);
        ct.onload = () => {
          clearTimeout(Lt);
          try {
            const vt = Math.min(ct.naturalWidth, ct.naturalHeight);
            if (!vt) return H(m);
            U.width = U.height = p, it.fillStyle = "#143a40", it.fillRect(0, 0, p, p), it.drawImage(ct, (ct.naturalWidth - vt) / 2, (ct.naturalHeight - vt) / 2, vt, vt, 0, 0, p, p), H(U.toDataURL("image/jpeg", 0.82));
          } catch {
            H(m);
          }
        }, ct.onerror = () => {
          clearTimeout(Lt), H(m);
        }, ct.src = m;
      } catch {
        H(m);
      }
    });
  }
  async function J(m) {
    var Kt, Dt, Et, wt, $t;
    const H = await fetch("/inscription/" + m, { signal: AbortSignal.timeout(6e4) }), tt = (H.headers.get("content-type") || "").toLowerCase();
    if (!H.ok)
      return await ((Kt = H.body) == null ? void 0 : Kt.cancel()), null;
    if (tt.startsWith("image/"))
      return await ((Dt = H.body) == null ? void 0 : Dt.cancel()), "/inscription/" + m;
    if (!tt.includes("text/html"))
      return await ((Et = H.body) == null ? void 0 : Et.cancel()), "";
    let U = "", it = 0;
    const ct = (he) => {
      let Ft = 0;
      for (; ; ) {
        const ye = U.slice(Ft).search(/<img\b/i);
        if (ye < 0)
          return U = he ? "" : U.slice(Math.max(0, U.length - 4)), null;
        const At = Ft + ye, jt = U.indexOf(">", At);
        if (jt < 0)
          return U = U.slice(At), null;
        const Bt = U.slice(At, jt + 1), Je = Bt.match(/\bsrc="(data:image\/[^"]+)"/i);
        if (Je) return Je[1].replace(/&amp;/g, "&");
        const v = Bt.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
        if (v) return "/inscription/" + v[1];
        Ft = jt + 1;
      }
    }, Lt = ($t = (wt = H.body) == null ? void 0 : wt.getReader) == null ? void 0 : $t.call(wt);
    if (!Lt)
      return U = await H.text(), ct(!0) ?? "";
    const vt = new TextDecoder();
    for (; ; ) {
      const { done: he, value: Ft } = await Lt.read();
      if (he) break;
      it += Ft.byteLength, U += vt.decode(Ft, { stream: !0 });
      const ye = ct(!1);
      if (ye)
        return await Lt.cancel(), ye;
      if (it > E)
        return await Lt.cancel(), null;
    }
    return U += vt.decode(), ct(!0) ?? "";
  }
  async function nt() {
    if (!X) {
      X = !0;
      try {
        for (; W.length; ) {
          const m = W.shift();
          if (!b.has(m))
            try {
              const H = await J(m);
              if (H === null) continue;
              if (!H) {
                b.set(m, ""), N(m, y), ie();
                continue;
              }
              const tt = await B(H);
              b.set(m, tt), tt.startsWith("data:image/jpeg") && N(m, tt), ie();
            } catch {
            }
        }
      } finally {
        X = !1;
      }
    }
  }
  function K(m, H) {
    if (H && !b.get(m) ? (b.set(m, H), B(H).then((U) => {
      U !== H && (b.set(m, U), U.startsWith("data:image/jpeg") && N(m, U), ie());
    })) : H === "" && !b.has(m) && b.set(m, ""), b.has(m)) return b.get(m);
    const tt = N(m);
    if (tt != null) {
      const U = tt === y ? "" : tt;
      return b.set(m, U), U;
    }
    return T.has(m) || (T.add(m), W.push(m), S || (S = setTimeout(() => {
      S = void 0, nt();
    }, 1200))), "";
  }
  function z(m) {
    var tt;
    i = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const H = document.querySelector(".side");
    if (m && m !== "more") {
      for (const ct of h$[m]) {
        const Lt = H == null ? void 0 : H.querySelector(ct);
        Lt && (Lt.open = !0);
      }
      const U = document.getElementById("sheetTitle");
      U && (U.textContent = d$[m]);
      const it = document.getElementById("sheetExtra");
      it && it.replaceChildren(...m === "music" ? [P()] : []), (tt = H == null ? void 0 : H.scrollTo) == null || tt.call(H, { top: 0 });
    }
    ie();
  }
  const A = r ? null : document.getElementById("sheetClose");
  A && (A.onclick = () => z("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && i && a.dataset.view === "album" && z("");
  });
  const P = () => Ye(
    { class: "al-row", onClick: () => {
      z(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: Ce.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: Ce.right })
  );
  let M = null, q = !1;
  const at = () => {
    var H;
    const m = e.radio();
    q || !(m != null && m.subscribe) || (q = !0, m.subscribe((tt) => {
      M = tt, (s == null ? void 0 : s.mode) === "open" && ie();
    }), M = ((H = m.getState) == null ? void 0 : H.call(m)) ?? null);
  };
  r || setInterval(() => {
    var U, it;
    if ((s == null ? void 0 : s.mode) !== "open" || !(M != null && M.playing)) return;
    const m = (it = (U = e.radio()) == null ? void 0 : U.getPosition) == null ? void 0 : it.call(U), H = t.querySelector(".al-bar > i"), tt = t.querySelectorAll(".al-times span");
    !m || !H || (H.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", tt.length === 2 && (tt[0].textContent = ma(m.current || 0), tt[1].textContent = m.duration ? ma(m.duration) : "–:––"));
  }, 500);
  let Y = "", L = null;
  function rt(m, H, tt = {}) {
    const U = tt.song || d(m.cover), ct = [U ? Q("img", { src: U, alt: tt.song ? "Song artwork" : `${m.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, m.title), m.subtitle ? Q("span", {}, m.subtitle) : null), tt.paused ? Q("span", { class: "al-paused" }, Q("i", { html: Ce.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], Lt = "al-cover" + (H ? "" : " al-cover--small") + (tt.paused ? " is-paused" : "");
    return tt.flip ? (ct.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: Ce.flip })), Ye({ class: Lt + " is-flippable", "aria-label": tt.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: tt.flip }, ...ct)) : Q("div", { class: Lt }, ...ct);
  }
  function Zt(m) {
    return m.plays === null || m.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (m.plays <= f$ ? " al-chip--low" : "") }, `${co(m.plays, "play", "plays")} left`);
  }
  function I(m) {
    const H = m.player, tt = H.tracks.filter((it) => !it.hidden), U = [];
    return m.mode === "arrive" && m.from && U.push(Q("p", { class: "al-from" }, Q("span", { html: Ce.gift }), Q("span", {}, Q("b", {}, m.from), " sent you an album"))), U.push(rt(H, !0)), U.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, H.title),
      H.subtitle ? Q("p", { class: "al-artist" }, H.subtitle) : null,
      tt.length ? Q("p", { class: "al-songline" }, tt.map((it) => it.title || `#${it.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [co(tt.length, "song", "songs"), m.offered ? co(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && U.push(Q("div", { class: "al-status", role: "status" }, ...m.status)), U.push(Q("div", { class: "al-grow" })), m.asking ? U.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && U.push(Ye({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, Q("span", { html: Ce.playSmall }), m.primary.label)), m.hint && !m.asking && U.push(Q("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && U.push(Ye({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), U;
  }
  function F(m, H) {
    const { songs: tt, current: U, started: it, own: ct, out: Lt, waiting: vt } = H, Kt = m.player, Dt = e.radio(), Et = [];
    Et.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, Kt.title), ` · ${co(tt.length, "song", "songs")}`), Zt(m)));
    const wt = d(Kt.cover), $t = "album:" + Kt.cover;
    wt && !b.has($t) && (b.set($t, wt), B(wt).then((Ft) => {
      Ft !== wt && (b.set($t, Ft), ie());
    }));
    const he = wt ? b.get($t) || wt : "";
    return Et.push(Q("ol", { class: "al-tracks" }, ...tt.map((Ft, ye) => {
      const At = String(Ft.id) === U, jt = K(String(Ft.id), At && it ? ct : void 0);
      return Q("li", {}, Ye(
        { class: "al-track" + (At ? " is-on" : ""), "aria-label": `Play ${Ft.title || "#" + Ft.id}`, "aria-current": At ? "true" : void 0, disabled: Lt || vt, onClick: () => {
          var Bt;
          return (Bt = Dt == null ? void 0 : Dt.playToken) == null ? void 0 : Bt.call(Dt, Ft.id);
        } },
        Q(
          "span",
          { class: "al-th" + (jt ? "" : " is-blank") },
          jt ? Q("img", { src: jt, alt: "", decoding: "async" }) : he ? Q("img", { src: he, alt: "", decoding: "async" }) : null,
          jt ? null : Q("span", { class: "al-n" }, String(ye + 1)),
          At ? Q("span", { class: "al-eq", html: Ce.eq }) : null
        ),
        Q("span", { class: "al-tt" }, Ft.title || `#${Ft.id}`)
      ));
    }))), Et;
  }
  function St(m) {
    var jt;
    const H = m.player, tt = H.tracks.filter((Bt) => !Bt.hidden), U = e.radio(), it = M == null ? void 0 : M.nowPlaying, ct = it && H.tracks.some((Bt) => String(Bt.id) === String(it.tokenId)) ? String(it.tokenId) : null, Lt = ct ? H.tracks.find((Bt) => String(Bt.id) === ct) : null, vt = m.plays === 0 && !m.playsComing, Kt = !!m.playsComing && !m.plays, Dt = !!(M != null && M.playing) && !!ct, Et = M == null ? void 0 : M.heart, wt = ct ? (jt = U == null ? void 0 : U.getPosition) == null ? void 0 : jt.call(U) : null;
    ct && (Dt || ((wt == null ? void 0 : wt.current) ?? 0) > 0.5) && (Y = H.id);
    const $t = !!ct && Y === H.id;
    L && L !== ct && (L = null);
    const he = $t ? String((it == null ? void 0 : it.cover) || "") : "", Ft = !!he && L === ct, At = [rt(H, !vt, { song: Ft ? "" : he, paused: $t && !Dt, flip: he ? () => {
      L = L === ct ? null : ct, ie();
    } : void 0, flipped: Ft })];
    if (At.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, Lt ? Lt.title || (it == null ? void 0 : it.title) || `#${Lt.id}` : H.title),
        Q("div", { class: "al-artist" }, Lt ? Lt.artist || (it == null ? void 0 : it.artist) || H.subtitle : H.subtitle || "Press play")
      ),
      ct ? Ye({ class: "al-icon" + (Et != null && Et.liked ? " is-on" : ""), "aria-label": Et != null && Et.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(Et != null && Et.liked)), disabled: !!(Et != null && Et.pending) || !!(Et != null && Et.locked) || Kt, onClick: () => {
        var Bt;
        return (Bt = U == null ? void 0 : U.toggleLike) == null ? void 0 : Bt.call(U);
      }, html: Et != null && Et.liked ? Ce.heartOn : Ce.heart }) : null
    )), vt)
      At.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        Nt(m, !0)
      ));
    else {
      const Bt = wt != null && wt.duration ? Math.min(100, wt.current / wt.duration * 100) : 0;
      At.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${Bt}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, ma((wt == null ? void 0 : wt.current) || 0)), Q("span", {}, wt != null && wt.duration ? ma(wt.duration) : "–:––"))
      ));
    }
    return At.push(Q(
      "div",
      { class: "al-ctl" + (vt || Kt ? " is-off" : "") },
      Ye({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: vt || Kt, onClick: () => {
        var Bt;
        return (Bt = U == null ? void 0 : U.prev) == null ? void 0 : Bt.call(U);
      }, html: Ce.prev }),
      Ye({ class: "al-play", "aria-label": Dt ? "Pause" : "Play", disabled: vt || Kt, onClick: () => {
        var Bt;
        return (Bt = U == null ? void 0 : U.playPause) == null ? void 0 : Bt.call(U);
      }, html: Dt ? Ce.pause : Ce.play }),
      Ye({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: vt || Kt, onClick: () => {
        var Bt;
        return (Bt = U == null ? void 0 : U.next) == null ? void 0 : Bt.call(U);
      }, html: Ce.next })
    )), m.status.length && At.push(Q("div", { class: "al-status", role: "status" }, ...m.status)), At.push(...F(m, { songs: tt, current: ct, started: $t, own: he, out: vt, waiting: Kt })), At.push(Q("div", { class: "al-grow" })), At.push(Ye(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => z(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: Ce.down })
    )), At;
  }
  function Nt(m, H) {
    const tt = Q("div", { class: "al-topups" + (H ? " al-topups--primary" : "") }), U = H ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const it of U) {
      const ct = m.myPlays !== void 0 && m.myPlays >= it && !m.playsComing && !m.busy;
      tt.append(Ye({ class: "al-topup", disabled: !ct, onClick: () => e.topUp(it) }, H ? `Add ${it.toLocaleString()} plays` : `+${it.toLocaleString()}`));
    }
    return H && tt.append(Ye({ class: "al-link", onClick: () => z("more") }, "Other amounts")), tt;
  }
  function Tt(m) {
    const H = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), tt = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${m.player.title}`), Q("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      Nt(m, !1),
      Q("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : H ? `Moved from My player · ${co(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !H && !m.playsComing && m.myPlays !== void 0 ? Ye({ class: "al-link", onClick: () => {
        z(""), e.openPlayer();
      } }, "Open My player") : null
    ), U = (ct, Lt, vt, Kt) => Ye(
      { class: "al-row", onClick: Kt },
      Q("span", { class: "al-row-i", html: ct }),
      Q("span", { class: "al-row-t" }, Q("b", {}, Lt), Q("small", {}, vt)),
      Q("span", { class: "al-row-go", html: Ce.right })
    ), it = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      U(Ce.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, ie();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), Ye({ class: "al-icon", "aria-label": "Close", onClick: () => z(""), html: Ce.close })),
      m.mode === "open" ? tt : null,
      Q(
        "div",
        { class: "al-rows" },
        U(Ce.grid, "My music", "Your albums and the radio", () => z("music")),
        U(Ce.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          z(""), e.openPlayer();
        }),
        m.canMake ? U(Ce.gift, "Albums (admin)", "Make an album and fund copies", () => z("gifts")) : null,
        U(Ce.device, "This device", "Backup, history, Stacks wallet, returns", () => z("device")),
        it
      )
    );
  }
  function Qt(m) {
    var vt, Kt;
    const H = m.player, tt = M == null ? void 0 : M.nowPlaying, U = tt && H.tracks.some((Dt) => String(Dt.id) === String(tt.tokenId)) ? String(tt.tokenId) : null, it = !!(M != null && M.playing) && !!U, ct = U ? (Kt = (vt = e.radio()) == null ? void 0 : vt.getPosition) == null ? void 0 : Kt.call(vt) : null;
    U && (it || ((ct == null ? void 0 : ct.current) ?? 0) > 0.5) && (Y = H.id);
    const Lt = !!U && Y === H.id;
    return F(m, {
      songs: H.tracks.filter((Dt) => !Dt.hidden),
      current: U,
      started: Lt,
      own: Lt ? String((tt == null ? void 0 : tt.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function ie() {
    const m = s;
    if (r) {
      if (!m || m.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      at(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...Qt(m));
      return;
    }
    if (!m) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    at(), t.hidden = !1;
    const H = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      m.mode === "open" ? Ye({ class: "al-icon", "aria-label": "My music", onClick: () => z("music"), html: Ce.grid }) : null
    ), tt = Q("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? St(m) : I(m));
    t.replaceChildren(H, tt, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => z("") }), Tt(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, ie();
        return;
      }
      const H = !!s;
      s = m, !m && (H || i) && (i = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, ie();
    },
    sheet: () => i,
    setSheet: z
  };
}
const p$ = [
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
function g$(t) {
  for (const [e, n] of p$) if (n.test(t)) return e;
  return null;
}
const Vy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), qy = (t) => /Android/.test(t);
function y$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Vy(e) ? "x-safari-" + n.href : qy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const w$ = (t) => Vy(t) ? "Safari" : qy(t) ? "Chrome" : "your browser", f0 = document.getElementById("ppp");
f0 && b$(f0);
function b$(t) {
  var on;
  const e = $w(), n = (h) => t.querySelector(h), r = n(".ppp-frame");
  let s = null;
  const i = async (h, x) => {
    const f = await fetch(h, { cache: "no-store", ...x, signal: AbortSignal.timeout(15e3) }), R = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((R == null ? void 0 : R.error) || `Request failed (${f.status}).`);
    return R;
  }, o = J5({
    now: Date.now,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    config: (h) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(h || "")),
    links: async (h) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(h))).links ?? [],
    mainOf: async (h) => {
      var f;
      const x = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(h))).links;
      return ((f = x == null ? void 0 : x.find((R) => R.listening === h)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (h) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(h) });
    },
    bridge: async (h) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${h}; publickey-credentials-create ${h}`), s.referrerPolicy = "no-referrer";
      const x = new Promise((mt, ht) => {
        s.addEventListener("load", () => mt(), { once: !0 }), setTimeout(() => ht(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = h + "/", r.replaceChildren(s), await x;
      const f = new yw({ walletOrigin: h, frame: s, timeoutMs: 30 * 6e4 }), R = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ut = (mt, ht) => R.has(mt) ? f.request(mt, ht) : Promise.race([
        f.request(mt, ht),
        new Promise((re, Fe) => setTimeout(() => Fe(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ut("listening.status"), { request: ut };
    },
    chain: {
      verify: M5,
      balance: P5,
      account: N5,
      owner: _5,
      broadcast: U5,
      transaction: H5,
      confirmedNonce: async (h) => {
        const x = await ls(`/v2/accounts/${h}?proof=0`);
        if (!Number.isSafeInteger(x == null ? void 0 : x.nonce) || x.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(x.nonce);
      }
    },
    signWithMain: (h, x) => Gh({ ...x, network: "mainnet", stxAddress: h }),
    deposit: (h, x, f) => new Promise((R, ut) => Dh({
      recipient: x,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: h,
      network: new fl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (mt) => R(mt.txId || ""),
      onCancel: () => ut(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ut
    })),
    validate: O5,
    tabLock: (h) => new Promise((x) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        x(!0);
        return;
      }
      f.request("xtrata-ppp:" + h, { ifAvailable: !0 }, async (R) => {
        x(!!R), R && await new Promise(() => {
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
      set: (h, x) => {
        try {
          localStorage.setItem(h, x);
        } catch {
        }
      }
    },
    changed: () => gt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (h) => {
      var x, f;
      return a.funder(h, () => G5(h, ls), !!((f = (x = o.snapshot().gate) == null ? void 0 : x.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (h) => {
      const x = await i("/radio/gift/for?wallet=" + encodeURIComponent(h)), f = x == null ? void 0 : x.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (h, x) => q5(h, (f) => ls(f), x),
    likesChanged: () => {
      var h, x;
      (x = (h = window.XtrataRadio) == null ? void 0 : h.refreshLikes) == null || x.call(h);
    },
    likeState: async (h, x) => {
      const f = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: h, ids: String(x) })), R = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((ut) => (ut == null ? void 0 : ut.id) === x) : null;
      if (!R || typeof R.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: R.liked, by: Array.isArray(R.by) ? R.by.filter((ut) => typeof ut == "string") : R.liked ? [h] : [] };
    },
    likeSent: (h, x) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: h, liked: x } })),
    nameOf: (h) => Tt(h) ?? void 0,
    likeConfirmed: (h, x) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: h, liked: x } })),
    likeFailed: (h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: h } }))
  }), a = r$({
    json: i,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    pay: (h, x, f, R) => new Promise((ut, mt) => Dh({
      recipient: x,
      amount: f.toString(),
      memo: R,
      stxAddress: h,
      network: new fl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (ht) => ut(ht.txId || ""),
      onCancel: () => mt(new Error("Gift cancelled. Nothing was sent.")),
      onError: mt
    })),
    sign: (h, x) => Gh({ ...x, network: "mainnet", stxAddress: h }),
    giftSent: (h, x) => o.giftSent(h, x),
    claiming: (h) => o.giftClaiming(h),
    album: { bind: (h) => o.bindAlbum(h), arrived: async (h, x, f, R) => {
      c.invalidate(), await o.albumArriving(h, x, f, R);
    } },
    who: (h) => m(h),
    changed: () => gt(o.snapshot()),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, x) => {
        try {
          x === null ? localStorage.removeItem(h) : localStorage.setItem(h, x);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = u$({
    json: i,
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
      set: (h, x) => {
        try {
          x === null ? localStorage.removeItem(h) : localStorage.setItem(h, x);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => gt(o.snapshot())
  }), u = (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), d = u ? document.getElementById("album") : null, l = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (h) => void o.topUpAlbum(h),
    openPlayer: () => void o.openAlbum(0)
  }, y = d ? u0(d, l) : null, p = document.getElementById("albumList"), E = p ? u0(p, l, { list: !0 }) : null, b = "xtrata.radio.album.last.v1", T = () => {
    try {
      const h = JSON.parse(localStorage.getItem(b) || "null");
      return h && typeof h.root == "string" && Number.isSafeInteger(h.slot) && h.slot > 0 && h.player && Array.isArray(h.player.tracks) ? h : null;
    } catch {
      return null;
    }
  };
  let W = "";
  const X = (h) => {
    const x = JSON.stringify(h);
    if (x !== W) {
      W = x;
      try {
        localStorage.setItem(b, x);
      } catch {
      }
    }
  };
  let S = null;
  window.XtrataRadioLikeHandler = (h) => {
    if (!h || !Number.isSafeInteger(h.song) || h.song < 0) return !1;
    ct();
    const x = Lt(h.song, { title: h.title, artist: h.artist });
    return o.heart({ song: h.song, title: x.title || void 0, artist: x.artist || void 0, likedBy: Array.isArray(h.likedBy) ? h.likedBy : void 0 });
  };
  let N;
  window.XtrataRadioListeningIdentity = () => {
    const h = o.snapshot();
    return h.solo && h.step !== "off" && h.step !== "elsewhere" ? h.listening : void 0;
  };
  const B = (h) => {
    var f, R;
    const x = window.XtrataRadioListeningIdentity();
    x !== N && (N = x, (R = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || R.call(f));
  };
  let J = "", nt = null, K = !1, z = !1;
  const A = (h) => {
    var re, Fe, ke, hn, Ee, Mn, Ke, Nn;
    const x = window.XtrataRadio;
    if (!(x != null && x.setGiftPlayer) || !(x != null && x.setGiftStop)) return;
    const f = h.step === "off" || h.step === "elsewhere" ? null : ((re = h.gift) == null ? void 0 : re.player) ?? null, R = f ? f.id + ":" + f.cover + ":" + f.tracks.map((pn) => pn.id).join(",") : "";
    R !== J && (x.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: To(f).map((pn) => pn.id), hidden: ((Fe = J6(f)) == null ? void 0 : Fe.id) ?? null, cover: f.cover } : null), J = R);
    const ut = ((ke = h.giftStop) == null ? void 0 : ke.text) ?? null;
    ut !== nt && (x.setGiftStop(ut), nt = ut);
    const mt = ((hn = h.giftStop) == null ? void 0 : hn.reason) === "arriving";
    mt !== z && ((Ee = x.setGiftWait) == null || Ee.call(x, mt), z = mt);
    const ht = !!f && !!((Mn = h.albumLock) != null && Mn.locked);
    ht !== K && ((Ke = x.setGiftLock) == null || Ke.call(x, ht), K = ht), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(h.step) && ((Nn = x.forgetWallets) == null || Nn.call(x));
  }, P = (h) => h ? h.slice(0, 6) + "…" + h.slice(-4) : "", M = (h) => {
    const x = o.snapshot().playCost || 350n;
    return h > De ? Number((h - De) / x) : 0;
  }, q = (h) => (Number(h) / 1e6).toFixed(h < 1000n ? 6 : 4), at = (h) => {
    const x = Math.round((Date.now() - h) / 6e4);
    return x < 1 ? "now" : x < 60 ? `${x}m` : x < 1440 ? `${Math.round(x / 60)}h` : `${Math.round(x / 1440)}d`;
  }, Y = (h) => `https://explorer.hiro.so/txid/${h}?chain=mainnet`, L = (h, x = "", f = "") => {
    const R = document.createElement(h);
    return x && (R.textContent = x), f && (R.className = f), R;
  }, rt = (h, x, f = "") => {
    const R = L("button", h, f);
    return R.type = "button", R.onclick = x, R;
  }, Zt = (h, x) => {
    const f = L("a", h);
    return f.href = x, f.target = "_blank", f.rel = "noopener", f;
  };
  let I = null, F = location.hash === "#give";
  F && history.replaceState(null, "", location.pathname + location.search);
  let St = !1;
  const Nt = U6((h) => _6({ address: h, network: "mainnet" }), () => gt(o.snapshot())), Tt = (h) => Nt.get(h), Qt = g$(navigator.userAgent), ie = (h, x) => {
    const f = navigator.userAgent, R = w$(f), ut = `${location.origin}${location.pathname}${x ? `#gift=${x}` : ""}`, mt = [L("p", `You are in ${h}'s built-in browser, where passkeys often do not work. Open this page in ${R} to make your listening wallet${x ? " and claim your gift" : ""}.`, "ppp-warn")], ht = L("div", "", "ppp-open-row"), re = y$(ut, f);
    if (re) {
      const Fe = L("a", `Open in ${R}`, "primary ppp-open-in");
      Fe.href = re, Fe.dataset.homeAction = "radio:open-in-browser", ht.append(Fe);
    }
    return ht.append(Ii("copy-page-link", "Copy link", () => ut, re ? "" : "primary", () => gt(o.snapshot()))), mt.push(ht, L("p", `If that does not open ${R}, use ${h}'s menu (••• or ⋮) and choose "Open in ${R === "your browser" ? "browser" : R}", or paste the copied link there.`, "ppp-mute")), mt;
  }, m = (h) => Tt(h) ?? P(h), H = (h) => h.slice(0, 2).map(m).join(" and ") + (h.length > 2 ? ` and ${h.length - 2} more` : ""), tt = /* @__PURE__ */ new Map();
  let U = !1;
  const it = (h) => !h || /^(?:Inscription )?#\d+$/.test(h.trim()), ct = () => {
    U || (U = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((h) => h.ok ? h.json() : null).then((h) => {
      for (const x of Array.isArray(h == null ? void 0 : h.tracks) ? h.tracks : []) {
        const f = Number(x == null ? void 0 : x.id);
        Number.isSafeInteger(f) && tt.set(f, { title: typeof x.title == "string" ? x.title : void 0, artist: typeof x.artist == "string" ? x.artist : void 0 });
      }
      gt(o.snapshot());
    }).catch(() => {
      U = !1;
    }));
  }, Lt = (h, x) => {
    const f = tt.get(h), R = O6(h, [f == null ? void 0 : f.title, x == null ? void 0 : x.title].find((mt) => !it(mt)) || ""), ut = H6(h, (f == null ? void 0 : f.artist) || (x == null ? void 0 : x.artist) || "");
    return { title: R, artist: ut };
  }, vt = (h) => {
    const { title: x, artist: f } = Lt(h.song, h);
    return x ? `“${x}”${f ? ` — ${f}` : ""}` : `Song #${h.song}${f ? ` — ${f}` : ""}`;
  }, Kt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Dt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Et(h) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(h.step) ? ["", ""] : h.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : h.step === "over" ? ["TOO MUCH", "bad"] : h.step === "locked" ? ["LOCKED", "mute"] : h.step === "intro" || h.step === "link" ? ["", ""] : h.step === "fund" ? h.depositPending ? ["ON ITS WAY", "warn"] : h.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : h.payingOn && h.session && h.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function wt(h, x, f = "", R) {
    const ut = L("dt", h), mt = L("dd", x, f);
    return R && mt.append(" ", R), [ut, mt];
  }
  const $t = document.getElementById("ppp-top"), he = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Ft = () => {
    var x, f;
    const h = o.snapshot();
    if (h.step === "connect" || h.step === "wrong-wallet") {
      (x = document.getElementById("radio-wallet-connect")) == null || x.click();
      return;
    }
    if (h.step === "elsewhere" && ((f = h.gate) != null && f.radioUrl)) {
      location.href = h.gate.radioUrl;
      return;
    }
    h.step === "locked" && !h.armed && !h.busy && o.unlock(), h.step === "ready" && !h.payingOn && !h.busy && o.switchOn(), he();
  };
  $t && ($t.onclick = Ft);
  function ye(h) {
    if (!$t) return;
    const x = (R, ut, mt) => {
      $t.hidden = !1, $t.className = "ppp-top" + (ut ? " is-" + ut : ""), $t.replaceChildren(L("span", "", "dot"), document.createTextNode(R)), $t.title = mt;
    }, f = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0;
    switch (h.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        $t.hidden = !0;
        return;
      case "elsewhere":
        return x("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        $t.hidden = !0;
        return;
      case "intro":
        return x("Start listening", "", "Make your player with a passkey: no app or account needed");
      case "wrong-wallet":
        return x(`Connect ${m(h.linked)}`, "warn", `This device's listening wallet belongs to ${m(h.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return x("Unlock", "", "One tap with your passkey");
      case "link":
        return x("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return h.depositPending ? x("Plays on their way", "quiet", "Plays start by themselves when they land") : x(h.entries.some((R) => R.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return x("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return x("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return h.payingOn && f > 0 ? x(`${f.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : x("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const At = document.getElementById("pppNudge"), jt = document.getElementById("onair");
  (on = At == null ? void 0 : At.querySelector("button")) == null || on.addEventListener("click", () => Ft());
  const Bt = {
    elsewhere: "Plays are not counted here",
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, Je = {
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
  function v(h) {
    if (h.step === "loading") return;
    const x = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0, f = h.step === "ready" && h.payingOn && x > 0, R = h.step === "fund" && h.depositPending, ut = f || R ? "" : Bt[h.step] ?? "", mt = f ? "on" : ut ? "off" : "";
    mt ? document.documentElement.dataset.ppp = mt : delete document.documentElement.dataset.ppp, jt && (jt.hidden = !mt, jt.querySelector(".onair-sub").textContent = f ? `${x.toLocaleString()} plays left` : "Plays off"), At && (At.hidden = mt !== "off", mt === "off" && (At.querySelector(".nudge-t").textContent = ut, At.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", At.querySelector("button").textContent = Je[h.step] ?? "Start"));
  }
  let j = "";
  function _(h) {
    const x = L("div", "", "ppp-pick");
    h.funderMultiple && h.returnToKind === "funder" && x.append(L("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), h.returnToKind === "funder" && x.append(L("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = L("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = j, f.oninput = () => {
      j = f.value;
    };
    const R = rt(h.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), j = "";
    }, "tiny");
    return x.append(f, " ", R), h.returnToKind === "chosen" && x.append(" ", rt("Back to the funder", () => o.clearReturnAddress(), "tiny")), x;
  }
  const G = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function bt() {
    const h = L("p", G + " ", "ppp-mute");
    return h.append(Zt("Xverse", "https://www.xverse.app/download"), " · ", Zt("Leather", "https://leather.io/install-extension")), h;
  }
  let kt = "";
  const le = (h) => {
    const x = document.documentElement, f = h.solo && !h.main ? h.listening ? P(h.listening) : "new" : "", R = s6() ? "1" : "";
    `${f}|${R}` !== kt && (kt = `${f}|${R}`, f ? x.dataset.pppSolo = f : delete x.dataset.pppSolo, R ? x.dataset.pppWalletInstalled = R : delete x.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const h of [1500, 4e3, 9e3]) setTimeout(() => gt(o.snapshot()), h);
  function ne(h, x = "") {
    const f = L("div", "", "ppp-topup"), R = ue(h);
    f.append(L("span", "Add plays from My player: ", "ppp-mute"));
    for (const ut of La) {
      const mt = rt(`+${ut.toLocaleString()}`, () => void o.topUpAlbum(ut), x);
      mt.disabled = R === void 0 || R < ut || h.depositPending || !!h.busy, f.append(mt);
    }
    return R !== void 0 && R < La[0] && f.append(L("p", "My player needs plays first (switch to My player above).", "ppp-mute")), f;
  }
  const ue = (h) => {
    var R;
    const x = (R = h.likeFunds) == null ? void 0 : R.balance;
    if (x === void 0 || !h.playCost) return;
    const f = x - De - 6000n;
    return f > 0n ? Number(f / h.playCost) : 0;
  };
  function oe(h) {
    const x = h.likeFunds;
    if (!x || !x.album || !x.low && !x.pending) return [];
    const f = L("div", "", "ppp-pick ppp-lowbox");
    if (!x.low) {
      const ut = L("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return x.txid && ut.append(Zt("View", Y(x.txid))), f.append(ut), [f];
    }
    f.append(L("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(L("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(L("p", x.address, "ppp-addr-full"));
    const R = L("div", "", "ppp-open-row");
    if (R.append(Ii("copy-likes-address", "Copy address", () => x.address, "primary", () => gt(o.snapshot()))), x.main && !h.solo) {
      const ut = Ls - (x.balance ?? 0n);
      ut > 0n && R.append(rt(`Pay ${Jn(ut)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(R), f.append(L("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const Re = (h) => {
    const x = L("div", "", "ppp-wait");
    x.dataset.since = String(h.since), x.dataset.grace = String(h.graceMs), x.setAttribute("role", "progressbar"), x.setAttribute("aria-label", "Your plays are arriving");
    const f = L("p", "", "ppp-wait-t"), R = L("div", "", "ppp-wait-track");
    return R.append(L("div", "", "ppp-wait-fill")), x.append(f, R), Ge(x), x;
  };
  function Ge(h) {
    const x = Number(h.dataset.since), f = Number(h.dataset.grace) || 6e4, R = Math.max(0, Date.now() - x), ut = h.querySelector(".ppp-wait-fill"), mt = h.querySelector(".ppp-wait-t");
    if (R < f) {
      const ht = Math.ceil((f - R) / 1e3);
      ut.style.width = Math.max(4, Math.min(95, R / f * 100)).toFixed(0) + "%", mt.textContent = `Your plays are arriving… usually about a minute · ${ht}s`, h.classList.remove("is-long"), h.setAttribute("aria-valuenow", String(Math.round(R / f * 100)));
    } else
      ut.style.width = "", mt.textContent = "Still arriving… this can take a few minutes. Nothing for you to do: it starts by itself.", h.classList.add("is-long"), h.removeAttribute("aria-valuenow");
  }
  let Wt = 0;
  setInterval(() => {
    const h = document.querySelectorAll(".ppp-wait");
    if (!h.length) {
      Wt = 0;
      return;
    }
    h.forEach(Ge), ++Wt % 10 === 0 && gt(o.snapshot());
  }, 1e3);
  function gt(h) {
    var pr, Br, gr, ui, Mr, fi, di, yr, hi, w, $, V, et, yt;
    if (S && ["ready", "fund", "over"].includes(h.step) && !h.busy) {
      const k = S;
      S = null, h.root === k.root && h.slot !== k.slot && o.openAlbum(k.slot);
    }
    const x = a.inProgress(h), f = x && h.step === "fund" ? { ...h, depositPending: !0 } : h;
    if (B(), A(h), le(f), !x && a.inProgress(h) || (ye(f), v(f), t.hidden = f.step === "off", t.hidden)) return;
    const [R, ut] = Et(f), mt = n(".ppp-state");
    mt.textContent = R, mt.className = "ppp-state" + (ut ? " ppp-state--" + ut : ""), mt.hidden = !R;
    const ht = !!f.busy || f.armed, re = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (ht || !["intro", "loading"].includes(f.step));
    r.hidden = !re, r.classList.toggle("ppp-frame--rest", !ht && !St);
    const Fe = n(".ppp-frame-label");
    Fe.hidden = !0;
    const ke = t6(f) ?? I;
    I = ke;
    const hn = "xtrata.radio.ppp.heard.v1", Ee = (() => {
      try {
        return localStorage.getItem(hn) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Ee && f.entries.some((k) => k.kind === "play"))
      try {
        localStorage.setItem(hn, "1");
      } catch {
      }
    const Mn = Ee || f.slot > 0 && ((((pr = f.likeFunds) == null ? void 0 : pr.balance) ?? 0n) > 0n || c.count() > 1), Ke = n6({ ...f, heard: Mn }, ke);
    n(".ppp-badge").hidden = !Ke;
    const Nn = n(".ppp-steps"), pn = n(".ppp-stage");
    Nn.hidden = pn.hidden = !Ke, ke && Ke && (Nn.replaceChildren(...gu(f.solo).map((k, O) => {
      const lt = L("li", "", O < ke.at ? "done" : O === ke.at ? ke.blocked ? "now blocked" : "now" : "");
      return lt.append(L("span", O < ke.at ? "✓" : String(O + 1), "n"), k), O === ke.at && lt.setAttribute("aria-current", "step"), lt;
    })), pn.textContent = ke.caption, pn.className = "ppp-stage " + (ke.at >= gu(f.solo).length ? "ppp-ok" : ke.blocked ? "ppp-bad" : "ppp-cyan"));
    const hs = n(".ppp-facts"), He = [];
    f.main && ((Br = f.gate) != null && Br.here) && !f.solo && He.push(...wt("Your wallet", m(f.main), "ppp-addr-short"));
    const ai = () => {
      if (!f.listening) return;
      const k = Ii("copy-listening", "Copy", () => f.listening || "", "tiny", () => gt(o.snapshot()));
      He.push(...wt(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", P(f.listening), "ppp-addr-short", k));
    };
    if (f.linked || ai(), f.listening && f.step !== "intro")
      if (f.linked)
        He.push(...wt("Credited to", `${m(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), ai();
      else if (f.solo) {
        f.creditedTo && He.push(...wt("Credited to", `${m(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const k = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${m(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        He.push(...wt("Returns go to", f.gift ? k : f.returnTo && !Tt(f.returnTo) ? k.replace(P(f.returnTo), f.returnTo) : k, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else He.push(...wt("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((gr = f.gate) != null && gr.here)) {
      const k = f.linkedListening.map((O) => P(O) + (O === f.listening ? " (this one)" : "")).join(", ");
      He.push(...wt(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", k, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const k = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      He.push(...wt("Balance", `${Jn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, k));
    }
    const dr = f.entries.find((k) => k.kind === "play");
    dr && ct(), dr && He.push(...wt("Last paid song", `${vt(dr)} → ${m(dr.recipient)}`, Kt[dr.status] || "")), hs.replaceChildren(...He), hs.hidden = !He.length;
    const Ct = [], Vt = [], Ie = [], je = [], ci = mn(BigInt(((ui = f.gate) == null ? void 0 : ui.limits.playFee) ?? "300")), ps = `Each song you listen to for 30 seconds sends ${Jn(tc)} STX to whoever holds it, plus a ${Jn(ci - tc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Cr = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (Ct.push(L("p", "Pay artists as you listen.")), (Mr = f.gate) != null && Mr.radioUrl) {
          const O = L("p");
          O.append(Zt("Open the pay-per-play radio →", f.gate.radioUrl)), Ct.push(O);
        }
        Vt.push(L("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const O = [f.linked, ...f.others];
          Ct.push(L("p", O.length > 1 ? `This device has listening wallets for ${H(O)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${m(f.linked)}. Connect that wallet to keep paying artists.`)), Vt.push(L("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          Ct.push(L("p", "Connect your wallet to pay artists as you listen.")), Vt.push(L("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        Ct.push(L("p", `This device's listening wallet belongs to ${m(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Vt.push(L("p", `You are connected as ${m(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Vt.push(L("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Ie.push(rt("Switch wallet", () => {
          var O;
          return (O = document.getElementById("radio-wallet-connect")) == null ? void 0 : O.click();
        }, "primary"));
        break;
      case "not-invited":
        Ct.push(L("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        Ct.push(L("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Ct.push(L("p", "Every play counts for the song’s owner, on-chain.")), Vt.push(L("p", ps)), Vt.push(L("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Vt.push(L("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (Ct.push(L("p", `This device already has a listening wallet for ${H(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Vt.push(L("p", `Otherwise, set up a new listening wallet for ${m(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Vt.push(L("p", `This is the listening wallet for ${m(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Vt.push(L("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const k = a.liveGift();
        Ie.push(rt(k ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${m(f.main)}` : "Start listening", () => void o.create(), "primary")), !k && !f.solo && f.main && f.others.length && Ie.push(rt("Switch wallet", () => {
          var O;
          return (O = document.getElementById("radio-wallet-connect")) == null ? void 0 : O.click();
        })), !k && f.solo && Ie.push(rt("I have a Stacks wallet", () => {
          var O;
          return (O = document.getElementById("radio-wallet-connect")) == null ? void 0 : O.click();
        })), Ie.push(rt("I already have a listening wallet", () => void o.unlock(!0))), k && Ie.push(rt("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (Ct.push(L("p", "Locked.", "ppp-mute")), Ie.push(rt("Unlock", () => void o.unlock(), "primary"))), je.push(rt("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        Ct.push(L("p", `Link to ${m(f.main)} · free`)), Vt.push(L("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Vt.push(L("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Ie.push(rt(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        Ct.push(L("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && Ct.push(Re(f.arrival)) : (fi = f.gift) != null && fi.player ? Ct.push(L("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? Ct.push(L("p", "No plays left · add plays to keep counting", "ppp-bad")) : Ct.push(L("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / ci)).toLocaleString()} plays`)), (di = f.gift) != null && di.player ? Vt.push(L("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && Vt.push(L("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && Vt.push(L("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), x || (f.solo ? (Vt.push(L("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Vt.push(L("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Ie.push(Ii("copy-address", "Copy my address", () => f.listening || "", "primary", () => gt(o.snapshot())))) : Vt.push(L("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const O = L("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          O.append(Zt("View", Y(f.depositTxid))), Ct.push(O);
        } else f.allowance > 0n && !f.solo && Ie.push(rt(`Deposit ${Jn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        Ct.push(L("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (Ct.push(L("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Ct.push(_(f))), (!f.solo || f.returnTo) && Ie.push(rt("Return excess", () => void o.returnFunds("excess"), "primary"), rt("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const O = Math.min(f.session.playsLeft, f.playsLeft);
          Ct.push(L("p", `${O.toLocaleString()} plays left`, "ppp-ok")), Vt.push(L("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Ie.push(rt("Switch off", () => void o.switchOff()));
        } else
          Ct.push(L("p", "Plays are off. Music stays free.", "ppp-mute")), Ie.push(rt("Switch plays on", () => void o.switchOn(), "primary"));
        f.queued && Ct.push(L("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && Ct.push(L("p", "Running low on plays", "ppp-warn")), f.depositPending ? Ct.push(L("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Ie.push(rt(`Top up ${Jn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && Vt.push(L("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Vt.push(_(f)), Vt.push(bt()), f.slot === 0 && f.step === "ready" && f.entries.some((k) => k.kind === "play" && k.status === "confirmed"))) {
      const k = L("p", "New to Stacks? ", "ppp-mute");
      k.append(Zt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Ct.push(k);
    }
    if (f.walletOutdated && Vt.push(L("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (Ct.push(L("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Ie.push(rt("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && je.push(rt(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${m(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((yr = f.gift) != null && yr.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && je.push(ne(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && je.push(rt("Lock", () => void o.lock(), "quiet")), re && !ht && je.push(rt(St ? "Hide listening wallet box" : "Show listening wallet box", () => {
      St = !St, gt(o.snapshot());
    }, "quiet")), [...Ie, ...je].forEach((k) => k.disabled = Cr), Cr && (Ie.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((hi = f.gift) != null && hi.player)) {
      const k = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", O = Ct.at(0);
      f.step === "ready" && O ? O.append(L("span", ` · ${q(f.balance)} STX`, k)) : Ct.push(L("p", `Balance ${q(f.balance)} STX`, k));
    }
    if ((w = f.gift) != null && w.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const k = L("p", "", "ppp-gift");
      k.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && k.append(" · ", f.gift.player.subtitle);
      const O = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? L("span", " · plays on their way", "ppp-warn") : L("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      O && k.append(O);
      const lt = ($ = Ct.at(0)) == null ? void 0 : $.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && lt && /STX/.test(lt.textContent ?? "") && lt.remove(), Ct.unshift(k), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          Ct.splice(1, 0, L("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), ne(f, "primary"));
        else {
          const ft = L("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ft.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ft.append(Zt("Xverse", "https://www.xverse.app/download"), " and ", Zt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Ct.splice(1, 0, ft);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const k = f.returnPlan, O = L("div", "", "ppp-pick");
      O.append(L("p", k.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const lt = L("ul", "", "ppp-gift-list");
      k.steps.forEach((ft, Xt) => {
        const Ne = ft.kind === "gift" ? "the unused gift" : ft.kind === "deposit" ? "what was added to it" : "the rest", Ae = L("li");
        Ae.append(L("span", `${Xt + 1}. ${Jn(BigInt(ft.send))} STX · ${Ne}`, "t"), L("span", ft.to ? ` → ${m(ft.to)}` : " → choose an address below", ft.to ? "ppp-mute" : "ppp-warn")), lt.append(Ae);
      }), O.append(lt), k.kept && O.append(L("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), k.steps.some((ft) => !ft.to) && O.append(_(f)), O.append(rt(k.steps.length > 1 ? `Confirm part 1 of ${k.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), Ct.push(O);
    }
    const Pn = te(f), Vn = u ? Pn : null, gs = a.banner(h, { bare: !!Vn }), hr = Qt && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? ie(Qt, a.pendingCode()) : [];
    Vn || (Ct.unshift(...gs), Ct.unshift(...oe(f)), Ct.unshift(...hr)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && Ct.unshift(L("p", `This is ${m(f.creditedTo)}'s listening wallet. Plays and likes count for ${m(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...Ct);
    const _n = document.querySelector(".ppp-switch");
    if (_n) {
      const k = c.latest(), O = f.slot > 0, lt = ["fund", "ready", "over"].includes(f.step) && (O || !!k);
      if (_n.hidden = !lt, lt) {
        const ft = (Ae, we, vn, bs) => {
          const pi = rt("", bs, "ppp-tab");
          return pi.setAttribute("aria-pressed", String(vn)), pi.append(L("span", Ae, "tt"), L("span", we === void 0 ? "…" : `${M(we).toLocaleString()} plays`, "ts")), pi.disabled = !!f.busy, pi;
        }, Xt = O ? ((et = (V = f.gift) == null ? void 0 : V.player) == null ? void 0 : et.title) ?? "Album" : k.title, Ne = rt("View all albums" + (c.count() > 1 ? ` (${c.count()})` : ""), () => {
          const Ae = document.querySelector(".ppp-shelf");
          Ae && (Ae.hidden = !1, Ae.open = !0, requestAnimationFrame(() => Ae.scrollIntoView({ block: "center", behavior: "smooth" })));
        }, "ppp-all-albums");
        _n.replaceChildren(
          ft("🎧 My player", O ? (yt = f.likeFunds) == null ? void 0 : yt.balance : f.balance, !O, () => {
            O && o.openAlbum(0);
          }),
          ft("💿 " + Xt, O ? f.balance : void 0, O, () => {
            !O && k && o.openAlbum(k.slot);
          }),
          Ne
        );
      }
    }
    const qn = c.render(f), Un = document.querySelector(".ppp-shelf");
    if (Un) {
      Un.hidden = !qn;
      const k = Un.querySelector("summary");
      k && (k.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const O = Un.querySelector(".ppp-shelf-body");
      qn && O && !O.contains(qn) && O.replaceChildren(qn);
    }
    const Hn = a.renderFold(h);
    if (n(".ppp-gifts").hidden = !Hn, Hn && !n(".ppp-gift-body").contains(Hn) && n(".ppp-gift-body").replaceChildren(Hn), Hn && F) {
      F = !1;
      const k = n(".ppp-gifts");
      k.open = !0, requestAnimationFrame(() => k.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Vt), n(".ppp-actions").replaceChildren(...Ie), n(".ppp-actions2").replaceChildren(...je);
    const ys = f.busy || f.message || "", li = n(".ppp-msg"), ws = ys && Ct.some((k) => (k.textContent ?? "").startsWith(ys.replace(/[.✓\s]+$/, ""))) ? "" : ys, Le = !ws && !f.error ? f.notice : "";
    li.textContent = ws || Le, li.classList.toggle("is-warn", !!Le), n(".ppp-err").textContent = f.error;
    const eo = f.entries.filter((k) => k.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...eo.slice(0, 5).map((k) => {
      const O = L("li"), lt = k.status === "confirmed" ? "ok" : k.status === "failed" ? "bad" : "warn";
      return O.append(L("span", "", "d " + lt), L("span", vt(k), "t"), L("span", at(k.created), "ppp-mute")), k.txid && O.append(Zt("tx", Y(k.txid))), O;
    })), n(".ppp-wallets").hidden = !(hs.childElementCount || je.length), n(".ppp-more").hidden = !Vt.length;
    const Tr = n(".ppp-history");
    Tr.hidden = !f.entries.length, f.entries.length && ct(), Tr.replaceChildren(L("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((k) => {
      const O = L("div", "", "ppp-row"), lt = k.kind === "play" ? [L("span", vt(k), "ppp-song"), L("span", ` · ${Jn(BigInt(k.amount))} STX to ${m(k.recipient)}`, "ppp-mute")] : k.kind === "like" ? [L("span", `${k.liked ? "♥ Liked" : "Unliked"} ${vt(k)}`, "ppp-song"), L("span", ` · for ${f.linked ? m(f.linked) : "this listening wallet"}`, "ppp-mute")] : [L("span", `Returned ${Jn(BigInt(k.amount))} STX`, "ppp-song"), L("span", ` to ${m(k.recipient)}`, "ppp-mute")];
      return O.append(
        L("span", Dt[k.status] || k.status, "ppp-status " + (Kt[k.status] || "")),
        ...lt,
        L("span", ` · ${new Date(k.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), k.txid && O.append(Zt("tx ↗", Y(k.txid))), O;
    })), y == null || y.render(Vn ? ae(f, Vn, [...hr, ...gs]) : null), E == null || E.render((Pn == null ? void 0 : Pn.mode) === "open" ? ae(f, Pn, []) : null);
  }
  function te(h) {
    var R;
    if (["off", "elsewhere", "not-invited"].includes(h.step)) return null;
    if (h.slot > 0 && ((R = h.gift) != null && R.player) && ["fund", "ready", "over", "link", "loading"].includes(h.step))
      return h.root && X({ root: h.root, slot: h.slot, player: h.gift.player }), { mode: "open", player: h.gift.player };
    const x = a.incomingAlbum();
    if (x) return { mode: "arrive", player: x.player, from: x.from, offered: x.plays };
    const f = T();
    return f && (h.step === "locked" || S && h.step === "loading") ? { mode: "locked", player: f.player } : null;
  }
  function ae(h, x, f) {
    var Fe, ke, hn;
    const R = !!h.busy || h.armed, ut = [...f];
    h.depositPending && h.arrival && ut.push(Re(h.arrival)), h.error ? ut.push(L("p", h.error, "ppp-bad")) : h.message && !R ? ut.push(L("p", h.message, "ppp-cyan")) : h.notice && ut.push(L("p", h.notice, "ppp-warn")), x.mode === "open" && ((Fe = h.likeFunds) != null && Fe.album) && h.likeFunds.low && !h.likeFunds.pending && ut.push(L("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const mt = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let ht = null, re = null;
    return x.mode === "locked" ? (ht = { label: "Continue listening", run: () => {
      S = T(), o.unlock();
    } }, re = { label: "Use a different passkey", run: () => {
      S = null, o.unlock(!0);
    } }) : x.mode === "arrive" && (h.step === "intro" ? (ht = { label: "Open album", run: () => void o.create() }, re = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : h.step === "locked" ? (ht = { label: "Open album", run: () => void o.unlock() }, re = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : h.step === "unsupported" ? ut.push(L("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : ut.length || ut.push(L("p", "Opening your album…", "ppp-cyan"))), {
      mode: x.mode,
      player: x.player,
      from: x.from,
      offered: x.offered,
      plays: x.mode === "open" ? h.balance === void 0 ? null : h.giftPlays : void 0,
      playsComing: h.depositPending,
      status: ut,
      primary: ht,
      secondary: re,
      hint: ht ? mt : void 0,
      asking: R,
      busy: !!h.busy,
      myPlays: ue(h),
      topUps: La,
      canMake: !!((hn = (ke = h.gate) == null ? void 0 : ke.gifts) != null && hn.admin)
    };
  }
  const Se = /* @__PURE__ */ new Map(), ge = () => {
    const h = window.XtrataRadio;
    return h != null && h.subscribe ? (h.subscribe((x) => {
      const f = x == null ? void 0 : x.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && Se.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!ge()) {
    const h = setInterval(() => {
      ge() && clearInterval(h);
    }, 500);
    setTimeout(() => clearInterval(h), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (h) => {
    const x = h.detail;
    if (x && Number.isSafeInteger(x.song) && typeof x.id == "string" && /^[0-9a-f]{32}$/.test(x.id)) {
      ct();
      const f = Lt(x.song, Se.get(x.song));
      o.onListened({ song: x.song, id: x.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const m$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", x$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, S$ = () => x$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, E$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, A$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Wy = class {
  constructor(t) {
    WA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && px(t), this.callback(yc(t));
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
    const t = S$(), e = E$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Mt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Mt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Mt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Mt("div", { class: "flex flex-col space-y-[10px]" }, Mt("div", { class: "flex items-center" }, Mt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Mt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Mt("span", { class: "sr-only" }, "Close popup"), Mt("img", { src: m$ }))), r ? Mt("p", null, "Select the wallet you want to connect to.") : Mt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Mt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Mt("div", { class: "mt-6" }, Mt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Mt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Mt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Mt("div", { class: "aspect-square basis-9 overflow-hidden" }, Mt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Mt("div", { class: "flex-1" }, Mt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Mt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Mt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Mt("div", { class: "mt-6" }, r ? Mt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Mt("div", { class: "mb-5 flex justify-between" }, Mt("p", { class: "text-sm font-medium" }, "Recommended wallets"), Mt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Mt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Mt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Mt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Mt("p", null, "What is a wallet? ", Mt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Mt("ul", { class: "space-y-3" }, n.map((i) => Mt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Mt("div", { class: "aspect-square basis-9 overflow-hidden" }, Mt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Mt("div", { class: "flex-1" }, Mt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Mt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Mt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return CA(this);
  }
};
Wy.style = A$;
const v$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Wy
}, Symbol.toStringTag, { value: "Module" }));
