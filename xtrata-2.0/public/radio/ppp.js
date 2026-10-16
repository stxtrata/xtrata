var Yy = Object.defineProperty;
var Zy = (t, e, n) => e in t ? Yy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var qi = (t, e, n) => Zy(t, typeof e != "symbol" ? e + "" : e, n);
var Ke = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function s0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Ga(t) {
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
      typeof Ke < "u" && Ke || {}, r = {
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
        var T = {
          next: function() {
            var N = A.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (T[Symbol.iterator] = function() {
          return T;
        }), T;
      }
      function d(A) {
        this.map = {}, A instanceof d ? A.forEach(function(T, N) {
          this.append(N, T);
        }, this) : Array.isArray(A) ? A.forEach(function(T) {
          if (T.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + T.length);
          this.append(T[0], T[1]);
        }, this) : A && Object.getOwnPropertyNames(A).forEach(function(T) {
          this.append(T, A[T]);
        }, this);
      }
      d.prototype.append = function(A, T) {
        A = a(A), T = c(T);
        var N = this.map[A];
        this.map[A] = N ? N + ", " + T : T;
      }, d.prototype.delete = function(A) {
        delete this.map[a(A)];
      }, d.prototype.get = function(A) {
        return A = a(A), this.has(A) ? this.map[A] : null;
      }, d.prototype.has = function(A) {
        return this.map.hasOwnProperty(a(A));
      }, d.prototype.set = function(A, T) {
        this.map[a(A)] = c(T);
      }, d.prototype.forEach = function(A, T) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && A.call(T, this.map[N], N, this);
      }, d.prototype.keys = function() {
        var A = [];
        return this.forEach(function(T, N) {
          A.push(N);
        }), u(A);
      }, d.prototype.values = function() {
        var A = [];
        return this.forEach(function(T) {
          A.push(T);
        }), u(A);
      }, d.prototype.entries = function() {
        var A = [];
        return this.forEach(function(T, N) {
          A.push([N, T]);
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
        return new Promise(function(T, N) {
          A.onload = function() {
            T(A.result);
          }, A.onerror = function() {
            N(A.error);
          };
        });
      }
      function p(A) {
        var T = new FileReader(), N = y(T);
        return T.readAsArrayBuffer(A), N;
      }
      function x(A) {
        var T = new FileReader(), N = y(T), F = /charset=([A-Za-z0-9_-]+)/.exec(A.type), V = F ? F[1] : "utf-8";
        return T.readAsText(A, V), N;
      }
      function E(A) {
        for (var T = new Uint8Array(A), N = new Array(T.length), F = 0; F < T.length; F++)
          N[F] = String.fromCharCode(T[F]);
        return N.join("");
      }
      function C(A) {
        if (A.slice)
          return A.slice(0);
        var T = new Uint8Array(A.byteLength);
        return T.set(new Uint8Array(A)), T.buffer;
      }
      function j() {
        return this.bodyUsed = !1, this._initBody = function(A) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = A, A ? typeof A == "string" ? this._bodyText = A : r.blob && Blob.prototype.isPrototypeOf(A) ? this._bodyBlob = A : r.formData && FormData.prototype.isPrototypeOf(A) ? this._bodyFormData = A : r.searchParams && URLSearchParams.prototype.isPrototypeOf(A) ? this._bodyText = A.toString() : r.arrayBuffer && r.blob && s(A) ? (this._bodyArrayBuffer = C(A.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(A) || o(A)) ? this._bodyArrayBuffer = C(A) : this._bodyText = A = Object.prototype.toString.call(A) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof A == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(A) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(E(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(k);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var R = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function S(A) {
        var T = A.toUpperCase();
        return R.indexOf(T) > -1 ? T : A;
      }
      function m(A, T) {
        if (!(this instanceof m))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        T = T || {};
        var N = T.body;
        if (A instanceof m) {
          if (A.bodyUsed)
            throw new TypeError("Already read");
          this.url = A.url, this.credentials = A.credentials, T.headers || (this.headers = new d(A.headers)), this.method = A.method, this.mode = A.mode, this.signal = A.signal, !N && A._bodyInit != null && (N = A._bodyInit, A.bodyUsed = !0);
        } else
          this.url = String(A);
        if (this.credentials = T.credentials || this.credentials || "same-origin", (T.headers || !this.headers) && (this.headers = new d(T.headers)), this.method = S(T.method || this.method || "GET"), this.mode = T.mode || this.mode || null, this.signal = T.signal || this.signal || function() {
          if ("AbortController" in n) {
            var G = new AbortController();
            return G.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (T.cache === "no-store" || T.cache === "no-cache")) {
          var F = /([?&])_=[^&]*/;
          if (F.test(this.url))
            this.url = this.url.replace(F, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var V = /\?/;
            this.url += (V.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      m.prototype.clone = function() {
        return new m(this, { body: this._bodyInit });
      };
      function k(A) {
        var T = new FormData();
        return A.trim().split("&").forEach(function(N) {
          if (N) {
            var F = N.split("="), V = F.shift().replace(/\+/g, " "), G = F.join("=").replace(/\+/g, " ");
            T.append(decodeURIComponent(V), decodeURIComponent(G));
          }
        }), T;
      }
      function O(A) {
        var T = new d(), N = A.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(F) {
          return F.indexOf(`
`) === 0 ? F.substr(1, F.length) : F;
        }).forEach(function(F) {
          var V = F.split(":"), G = V.shift().trim();
          if (G) {
            var zt = V.join(":").trim();
            try {
              T.append(G, zt);
            } catch (ct) {
              console.warn("Response " + ct.message);
            }
          }
        }), T;
      }
      j.call(m.prototype);
      function K(A, T) {
        if (!(this instanceof K))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (T || (T = {}), this.type = "default", this.status = T.status === void 0 ? 200 : T.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = T.statusText === void 0 ? "" : "" + T.statusText, this.headers = new d(T.headers), this.url = T.url || "", this._initBody(A);
      }
      j.call(K.prototype), K.prototype.clone = function() {
        return new K(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, K.error = function() {
        var A = new K(null, { status: 200, statusText: "" });
        return A.ok = !1, A.status = 0, A.type = "error", A;
      };
      var z = [301, 302, 303, 307, 308];
      K.redirect = function(A, T) {
        if (z.indexOf(T) === -1)
          throw new RangeError("Invalid status code");
        return new K(null, { status: T, headers: { location: A } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(T, N) {
          this.message = T, this.name = N;
          var F = Error(T);
          this.stack = F.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function X(A, T) {
        return new Promise(function(N, F) {
          var V = new m(A, T);
          if (V.signal && V.signal.aborted)
            return F(new e.DOMException("Aborted", "AbortError"));
          var G = new XMLHttpRequest();
          function zt() {
            G.abort();
          }
          G.onload = function() {
            var I = {
              statusText: G.statusText,
              headers: O(G.getAllResponseHeaders() || "")
            };
            V.url.indexOf("file://") === 0 && (G.status < 200 || G.status > 599) ? I.status = 200 : I.status = G.status, I.url = "responseURL" in G ? G.responseURL : I.headers.get("X-Request-URL");
            var P = "response" in G ? G.response : G.responseText;
            setTimeout(function() {
              N(new K(P, I));
            }, 0);
          }, G.onerror = function() {
            setTimeout(function() {
              F(new TypeError("Network request failed"));
            }, 0);
          }, G.ontimeout = function() {
            setTimeout(function() {
              F(new TypeError("Network request timed out"));
            }, 0);
          }, G.onabort = function() {
            setTimeout(function() {
              F(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ct(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (G.open(V.method, ct(V.url), !0), V.credentials === "include" ? G.withCredentials = !0 : V.credentials === "omit" && (G.withCredentials = !1), "responseType" in G && (r.blob ? G.responseType = "blob" : r.arrayBuffer && (G.responseType = "arraybuffer")), T && typeof T.headers == "object" && !(T.headers instanceof d || n.Headers && T.headers instanceof n.Headers)) {
            var Ie = [];
            Object.getOwnPropertyNames(T.headers).forEach(function(I) {
              Ie.push(a(I)), G.setRequestHeader(I, c(T.headers[I]));
            }), V.headers.forEach(function(I, P) {
              Ie.indexOf(P) === -1 && G.setRequestHeader(P, I);
            });
          } else
            V.headers.forEach(function(I, P) {
              G.setRequestHeader(P, I);
            });
          V.signal && (V.signal.addEventListener("abort", zt), G.onreadystatechange = function() {
            G.readyState === 4 && V.signal.removeEventListener("abort", zt);
          }), G.send(typeof V._bodyInit > "u" ? null : V._bodyInit);
        });
      }
      return X.polyfill = !0, n.fetch || (n.fetch = X, n.Headers = d, n.Request = m, n.Response = K), e.Headers = d, e.Request = m, e.Response = K, e.fetch = X, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Ke);
})();
const Qy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Jy(t, e) {
  const n = {};
  return Object.assign(n, Qy, e), await fetch(t, n);
}
function tw(t) {
  let e = Jy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ew(...t) {
  const { fetchLib: e, middlewares: n } = tw(t);
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
var bi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(bi || (bi = {}));
var Ss;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ss || (Ss = {}));
var If;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(If || (If = {}));
const nw = "https://api.mainnet.hiro.so", rw = "https://api.testnet.hiro.so", sw = "http://localhost:3999", iw = ["mainnet", "testnet", "devnet", "mocknet"];
let mi = class {
  constructor(e) {
    this.version = Ss.Mainnet, this.chainId = bi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ss.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ew();
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
mi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new rl();
    case "testnet":
      return new ow();
    case "devnet":
      return new aw();
    case "mocknet":
      return new i0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${iw.join(", ")}`);
  }
};
mi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : mi.fromName(t);
let rl = class extends mi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? nw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ss.Mainnet, this.chainId = bi.Mainnet;
  }
}, ow = class extends mi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? rw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ss.Testnet, this.chainId = bi.Testnet;
  }
}, i0 = class extends mi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? sw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ss.Testnet, this.chainId = bi.Testnet;
  }
};
const aw = i0, o0 = "xtrata.wallet.bridge.v1", cw = (t) => typeof t == "object" && t !== null && t.protocol === o0, lw = (t) => cw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", uw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Wi extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const kf = 12e4;
class fw {
  constructor(e) {
    qi(this, "pending", /* @__PURE__ */ new Map());
    qi(this, "listenTarget");
    qi(this, "closed", !1);
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
    qi(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !lw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Wi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Wi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Wi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = uw(), i = { protocol: o0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Wi(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? kf}ms.`
          )
        );
      }, this.options.timeoutMs ?? kf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Wi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const dw = ["SP", "SM"], hw = ["ST", "SN"], pw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return dw.includes(n) ? "mainnet" : hw.includes(n) ? "testnet" : null;
}, gw = () => {
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
}, yw = () => typeof window > "u" || !window.localStorage ? gw() : window.localStorage, Ic = "xtrata.v15.1.wallet.session", Lf = "mainnet", ya = { isConnected: !1 }, ww = (t) => t.address ? pw(t.address) ?? t.network : t.network, a0 = (t) => !t.isConnected || !t.address ? { ...ya } : ww(t) !== Lf ? { ...ya } : {
  isConnected: !0,
  address: t.address,
  network: Lf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, bw = (t) => {
  if (!t)
    return { ...ya };
  try {
    const e = JSON.parse(t);
    return a0(e);
  } catch {
    return { ...ya };
  }
}, mw = (t) => {
  const e = a0(t);
  return JSON.stringify(e);
}, xw = (t) => {
  const e = yw();
  return {
    load: () => bw(e.getItem(Ic)),
    save: (n) => {
      e.setItem(Ic, mw(n));
    },
    clear: () => {
      e.removeItem(Ic);
    }
  };
}, Sw = "https://browser.blockstack.org/auth", Ew = {
  "@type": "Person",
  "@context": "http://schema.org"
}, c0 = ["store_write"], Aw = "blockstack-session", vw = {
  logLevel: "debug"
}, Ds = {
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
Object.freeze(Ds);
class Ui extends Error {
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
class $w extends Ui {
  constructor(e, n = "") {
    super({ code: Ds.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Cf extends Ui {
  constructor(e = "") {
    super({ code: Ds.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Mo extends Ui {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ds.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Tf extends Ui {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ds.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class sl extends Ui {
  constructor(e) {
    super({ code: Ds.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class l0 extends Ui {
  constructor(e) {
    super({ code: Ds.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Bf = ["debug", "info", "warn", "error", "none"], il = {};
for (let t = 0; t < Bf.length; t++) {
  const e = Bf[t];
  il[e] = t;
}
class fi {
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
    return il[vw.logLevel] <= il[e];
  }
}
function Iw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function kw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function kc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Lw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Cw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Tw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function lu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Cw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    fi.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Tw(s, t.toString(), n);
    throw fi.error(i), new Error(i);
  }
  if (r)
    return {};
}
function ts(t, e) {
  return uu(De(t), e);
}
function De(t) {
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
  if (en(t, Uint8Array))
    return BigInt(`0x${ot(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Bw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Mf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function So(t, e = 8) {
  return (typeof t == "bigint" ? t : De(t)).toString(16).padStart(e * 2, "0");
}
function Ka(t) {
  return parseInt(t, 16);
}
function uu(t, e = 16) {
  const n = So(t, e);
  return Pt(n);
}
function Mw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Nw(t, e) {
  return t & BigInt(1) << e;
}
function ol(t) {
  return _w(BigInt(`0x${ot(t)}`), BigInt(t.byteLength * 8));
}
function _w(t, e) {
  return Nw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Pw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ot(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Pw[n];
  return e;
}
function Pt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Bw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Fs(t) {
  return new TextEncoder().encode(t);
}
function Eo(t) {
  return new TextDecoder().decode(t);
}
function Uw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Hw(t) {
  return String.fromCharCode.apply(null, t);
}
function Ow(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Nf(t) {
  if (t.some(Ow))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Yn(...t) {
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
function be(t) {
  return Yn(...t.map((e) => typeof e == "number" ? Nf([e]) : e instanceof Array ? Nf(e) : e));
}
function en(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const u0 = "https://api.mainnet.hiro.so", f0 = "https://api.testnet.hiro.so", d0 = "http://localhost:3999", Dw = "https://hub.blockstack.org", Fw = 33, Lc = 32;
function jw(t) {
  if (t.length < Lc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Lc * 2), r = t.slice(2 + Lc * 2);
  return {
    recoveryId: Ka(e),
    r: n,
    s: r
  };
}
function fu(t) {
  const e = typeof t == "string" ? Pt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function zw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Rw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Gw(t, e) {
  return t[e];
}
function Kw(t, e, n = 0) {
  return t[n] = e, t;
}
function Vw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Es(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const qw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Ww(t, e) {
  const n = {};
  return Object.assign(n, qw, e), await fetch(t, n);
}
function Xw(t) {
  let e = Ww, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Yw(...t) {
  const { fetchLib: e, middlewares: n } = Xw(t);
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
class h0 {
  constructor(e = c0.slice(), n = ((a) => (a = lu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Sw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function al(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Zw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function p0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Qw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  al(t.outputLen), al(t.blockLen);
}
function Jw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function tb(t, e) {
  p0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const us = {
  number: al,
  bool: Zw,
  bytes: p0,
  hash: Qw,
  exists: Jw,
  output: tb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Cc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), On = (t, e) => t << 32 - e | t >>> e, eb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!eb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function du(t) {
  if (typeof t == "string" && (t = nb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let g0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function js(t) {
  const e = (r) => t().update(du(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let y0 = class extends g0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, us.hash(e);
    const r = du(n);
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
    return us.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    us.exists(this), us.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Va = (t, e, n) => new y0(t, e).update(n).digest();
Va.create = (t, e) => new y0(t, e);
function rb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let hu = class extends g0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Cc(this.buffer);
  }
  update(e) {
    us.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = du(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Cc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    us.exists(this), us.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    rb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Cc(e), c = this.outputLen;
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
const sb = (t, e, n) => t & e ^ ~t & n, ib = (t, e, n) => t & e ^ t & n ^ e & n, ob = new Uint32Array([
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
]), Ar = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), vr = new Uint32Array(64);
let w0 = class extends hu {
  constructor() {
    super(64, 32, 8, !1), this.A = Ar[0] | 0, this.B = Ar[1] | 0, this.C = Ar[2] | 0, this.D = Ar[3] | 0, this.E = Ar[4] | 0, this.F = Ar[5] | 0, this.G = Ar[6] | 0, this.H = Ar[7] | 0;
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
      vr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = vr[l - 15], p = vr[l - 2], x = On(y, 7) ^ On(y, 18) ^ y >>> 3, E = On(p, 17) ^ On(p, 19) ^ p >>> 10;
      vr[l] = E + vr[l - 7] + x + vr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = On(a, 6) ^ On(a, 11) ^ On(a, 25), p = d + y + sb(a, c, u) + ob[l] + vr[l] | 0, E = (On(r, 2) ^ On(r, 13) ^ On(r, 22)) + ib(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    vr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ab = class extends w0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const xi = js(() => new w0());
js(() => new ab());
const cb = {}, b0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Nt = BigInt(0), re = BigInt(1), Xr = BigInt(2), eo = BigInt(3), _f = BigInt(8), Vt = Object.freeze({
  a: Nt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: re,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Pf = (t, e) => (t + e / Xr) / e, No = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Vt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -re * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Pf(i * t, e), c = Pf(-r * t, e);
    let u = Q(t - a * n - c * s, e), d = Q(-a * r - c * i, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, Bn = 32, As = 32, m0 = 32, wa = Bn + 1, ba = 2 * Bn + 1;
function Uf(t) {
  const { a: e, b: n } = Vt, r = Q(t * t), s = Q(r * t);
  return Q(s + e * t + n);
}
const _o = Vt.a === Nt;
class pu extends Error {
  constructor(e) {
    super(e);
  }
}
function Hf(t) {
  if (!(t instanceof Ot))
    throw new TypeError("JacobianPoint expected");
}
class Ot {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof It))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(It.ZERO) ? Ot.ZERO : new Ot(e.x, e.y, re);
  }
  static toAffineBatch(e) {
    const n = hb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Ot.toAffineBatch(e).map(Ot.fromAffine);
  }
  equals(e) {
    Hf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = Q(s * s), u = Q(a * a), d = Q(n * u), l = Q(i * c), y = Q(Q(r * a) * u), p = Q(Q(o * s) * c);
    return d === l && y === p;
  }
  negate() {
    return new Ot(this.x, Q(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = Q(e * e), i = Q(n * n), o = Q(i * i), a = e + i, c = Q(Xr * (Q(a * a) - s - o)), u = Q(eo * s), d = Q(u * u), l = Q(d - Xr * c), y = Q(u * (c - l) - _f * o), p = Q(Xr * n * r);
    return new Ot(l, y, p);
  }
  add(e) {
    Hf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Nt || o === Nt)
      return this;
    if (n === Nt || r === Nt)
      return e;
    const c = Q(s * s), u = Q(a * a), d = Q(n * u), l = Q(i * c), y = Q(Q(r * a) * u), p = Q(Q(o * s) * c), x = Q(l - d), E = Q(p - y);
    if (x === Nt)
      return E === Nt ? this.double() : Ot.ZERO;
    const C = Q(x * x), j = Q(x * C), R = Q(d * C), S = Q(E * E - j - Xr * R), m = Q(E * (R - S) - y * j), k = Q(s * a * x);
    return new Ot(S, m, k);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Ot.ZERO;
    if (typeof e == "bigint" && e === Nt)
      return n;
    let r = Ff(e);
    if (r === re)
      return this;
    if (!_o) {
      let l = n, y = this;
      for (; r > Nt; )
        r & re && (l = l.add(y)), y = y.double(), r >>= re;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = No.splitScalar(r), c = n, u = n, d = this;
    for (; i > Nt || a > Nt; )
      i & re && (c = c.add(d)), a & re && (u = u.add(d)), d = d.double(), i >>= re, a >>= re;
    return s && (c = c.negate()), o && (u = u.negate()), u = new Ot(Q(u.x * No.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = _o ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Ot.BASE) && (n = It.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && cl.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Ot.normalizeZ(s), cl.set(n, s)));
    let i = Ot.ZERO, o = Ot.BASE;
    const a = 1 + (_o ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const p = y * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= d, e += re);
      const E = p, C = p + Math.abs(x) - 1, j = y % 2 !== 0, R = x < 0;
      x === 0 ? o = o.add(Po(j, s[E])) : i = i.add(Po(R, s[C]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Ff(e), s, i;
    if (_o) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = No.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: p } = this.wNAF(u, n);
      d = Po(o, d), y = Po(c, y), y = new Ot(Q(y.x * No.beta), y.y, y.z), s = d.add(y), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Ot.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Ot.ZERO);
    e == null && (e = i ? _f : Hi(s));
    const o = e, a = Q(o * o), c = Q(a * o), u = Q(n * a), d = Q(r * c), l = Q(s * o);
    if (i)
      return It.ZERO;
    if (l !== re)
      throw new Error("invZ was invalid");
    return new It(u, d);
  }
}
Ot.BASE = new Ot(Vt.Gx, Vt.Gy, re);
Ot.ZERO = new Ot(Nt, re, Nt);
function Po(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const cl = /* @__PURE__ */ new WeakMap();
class It {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, cl.delete(this);
  }
  hasEvenY() {
    return this.y % Xr === Nt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = dn(n ? e : e.subarray(1));
    if (!ca(r))
      throw new Error("Point is not on curve");
    const s = Uf(r);
    let i = db(s);
    const o = (i & re) === re;
    n ? o && (i = Q(-i)) : (e[0] & 1) === 1 !== o && (i = Q(-i));
    const a = new It(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = dn(e.subarray(1, Bn + 1)), r = dn(e.subarray(Bn + 1, Bn * 2 + 1)), s = new It(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Zn(e), r = n.length, s = n[0];
    if (r === Bn)
      return this.fromCompressedHex(n);
    if (r === wa && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ba && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${wa} compressed bytes or ${ba} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return It.BASE.multiply(vs(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = E0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = gu(Zn(e)), { n: a } = Vt, c = r === 2 || r === 3 ? s + a : s, u = Hi(c, a), d = Q(-o * u, a), l = Q(i * u, a), y = r & 1 ? "03" : "02", p = It.fromHex(y + Yr(c)), x = It.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Zr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Yr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Yr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ca(n) || !ca(r))
      throw new Error(e);
    const s = Q(r * r), i = Uf(n);
    if (Q(s - i) !== Nt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new It(this.x, Q(-this.y));
  }
  double() {
    return Ot.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Ot.fromAffine(this).add(Ot.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Ot.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Ot.fromAffine(this), i = n === Nt || n === re || this !== It.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Ot.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Ot.ZERO) ? void 0 : a.toAffine();
  }
}
It.BASE = new It(Vt.Gx, Vt.Gy);
It.ZERO = new It(Nt, Nt);
function Of(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Df(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Si(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: dn(n), left: t.subarray(e + 2) };
}
function lb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Si(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Df(t.subarray(2)), { data: r, left: s } = Df(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Si(s)}`);
  return { r: e, s: r };
}
class fn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Si(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new fn(ma(s.slice(0, 64)), ma(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = lb(n ? e : Zr(e));
    return new fn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ai(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ai(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Vt.n >> re;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new fn(this.r, Q(-this.s, Vt.n)) : this;
  }
  toDERRawBytes() {
    return Zr(this.toDERHex());
  }
  toDERHex() {
    const e = Of(Xi(this.s)), n = Of(Xi(this.r)), r = e.length / 2, s = n.length / 2, i = Xi(r), o = Xi(s);
    return `30${Xi(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Zr(this.toCompactHex());
  }
  toCompactHex() {
    return Yr(this.r) + Yr(this.s);
  }
}
function qr(...t) {
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
const ub = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Si(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ub[t[n]];
  return e;
}
const fb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Yr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Nt <= t && t < fb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ei(t) {
  const e = Zr(Yr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Xi(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ma(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Zr(t) {
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
function dn(t) {
  return ma(Si(t));
}
function Zn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Zr(t);
}
function Ff(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ai(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function Q(t, e = Vt.P) {
  const n = t % e;
  return n >= Nt ? n : e + n;
}
function wn(t, e) {
  const { P: n } = Vt;
  let r = t;
  for (; e-- > Nt; )
    r *= r, r %= n;
  return r;
}
function db(t) {
  const { P: e } = Vt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = wn(u, eo) * u % e, l = wn(d, eo) * u % e, y = wn(l, Xr) * c % e, p = wn(y, r) * y % e, x = wn(p, s) * p % e, E = wn(x, o) * x % e, C = wn(E, a) * E % e, j = wn(C, o) * x % e, R = wn(j, eo) * u % e, S = wn(R, i) * p % e, m = wn(S, n) * c % e, k = wn(m, Xr);
  if (k * k % e !== t)
    throw new Error("Cannot find square root");
  return k;
}
function Hi(t, e = Vt.P) {
  if (t === Nt || e <= Nt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = Q(t, e), r = e, s = Nt, i = re;
  for (; n !== Nt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== re)
    throw new Error("invert: does not exist");
  return Q(s, e);
}
function hb(t, e = Vt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Nt ? i : (n[a] = i, Q(i * o, e)), re), s = Hi(r, e);
  return t.reduceRight((i, o, a) => o === Nt ? i : (n[a] = Q(i * n[a], e), Q(i * o, e)), s), n;
}
function pb(t) {
  const e = t.length * 8 - As * 8, n = dn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function gu(t, e = !1) {
  const n = pb(t);
  if (e)
    return n;
  const { n: r } = Vt;
  return n >= r ? n - r : n;
}
let yi, no;
class x0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return he.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return no(this.k, ...e);
  }
  checkSync() {
    if (typeof no != "function")
      throw new pu("hmacSha256Sync needs to be set");
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
    return qr(...n);
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
    return qr(...n);
  }
}
function Ai(t) {
  return Nt < t && t < Vt.n;
}
function ca(t) {
  return Nt < t && t < Vt.P;
}
function S0(t, e, n, r = !0) {
  const { n: s } = Vt, i = gu(t, !0);
  if (!Ai(i))
    return;
  const o = Hi(i, s), a = It.BASE.multiply(i), c = Q(a.x, s);
  if (c === Nt)
    return;
  const u = Q(o * Q(e + n * c, s), s);
  if (u === Nt)
    return;
  let d = new fn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & re);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function vs(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * As)
      throw new Error("Expected 32 bytes of private key");
    e = ma(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== As)
      throw new Error("Expected 32 bytes of private key");
    e = dn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ai(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function yu(t) {
  return t instanceof It ? (t.assertValidity(), t) : It.fromHex(t);
}
function E0(t) {
  if (t instanceof fn)
    return t.assertValidity(), t;
  try {
    return fn.fromDER(t);
  } catch {
    return fn.fromCompact(t);
  }
}
function Ao(t, e = !1) {
  return It.fromPrivateKey(t).toRawBytes(e);
}
function gb(t, e, n, r = !1) {
  return It.fromSignature(t, e, n).toRawBytes(r);
}
function jf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === wa || r === ba : n ? r === wa * 2 || r === ba * 2 : t instanceof It;
}
function wu(t, e, n = !1) {
  if (jf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!jf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = yu(e);
  return r.assertValidity(), r.multiply(vs(t)).toRawBytes(n);
}
function A0(t) {
  const e = t.length > Bn ? t.slice(0, Bn) : t;
  return dn(e);
}
function yb(t) {
  const e = A0(t), n = Q(e, Vt.n);
  return v0(n < Nt ? e : n);
}
function v0(t) {
  return Ei(t);
}
function $0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Zn(t), s = vs(e), i = [v0(s), yb(r)];
  if (n != null) {
    n === !0 && (n = he.randomBytes(Bn));
    const c = Zn(n);
    if (c.length !== Bn)
      throw new Error(`sign: Expected ${Bn} bytes of extra data`);
    i.push(c);
  }
  const o = qr(...i), a = A0(r);
  return { seed: o, m: a, d: s };
}
function I0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function wb(t, e, n = {}) {
  const { seed: r, m: s, d: i } = $0(t, e, n.extraEntropy), o = new x0(m0, As);
  await o.reseed(r);
  let a;
  for (; !(a = S0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return I0(a, n);
}
function qa(t, e, n = {}) {
  const { seed: r, m: s, d: i } = $0(t, e, n.extraEntropy), o = new x0(m0, As);
  o.reseedSync(r);
  let a;
  for (; !(a = S0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return I0(a, n);
}
const bb = { strict: !0 };
function mb(t, e, n, r = bb) {
  let s;
  try {
    s = E0(t), e = Zn(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = gu(e);
  let c;
  try {
    c = yu(n);
  } catch {
    return !1;
  }
  const { n: u } = Vt, d = Hi(o, u), l = Q(a * d, u), y = Q(i * d, u), p = It.BASE.multiplyAndAddUnsafe(c, l, y);
  return p ? Q(p.x, u) === i : !1;
}
function xa(t) {
  return Q(dn(t), Vt.n);
}
class vi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Zn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = dn(n.subarray(0, 32)), s = dn(n.subarray(32, 64));
    return new vi(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ca(e) || !Ai(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Yr(this.r) + Yr(this.s);
  }
  toRawBytes() {
    return Zr(this.toHex());
  }
}
function xb(t) {
  return It.fromPrivateKey(t).toRawX();
}
class k0 {
  constructor(e, n, r = he.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Zn(e);
    const { x: s, scalar: i } = this.getScalar(vs(n));
    if (this.px = s, this.d = i, this.rand = Zn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = It.fromPrivateKey(e), r = n.hasEvenY() ? e : Vt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ei(e ^ dn(n));
  }
  finalizeNonce(e) {
    const n = Q(dn(e), Vt.n);
    if (n === Nt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new vi(e.x, Q(n + r * s, Vt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = he.taggedHash, o = this.initNonce(n, await i(Vr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(Vr.nonce, o, r, e)), d = xa(await i(Vr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await T0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = he.taggedHashSync, o = this.initNonce(n, i(Vr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(Vr.nonce, o, r, e)), d = xa(i(Vr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return B0(l, e, r) || this.error(), l;
  }
}
async function Sb(t, e, n) {
  return new k0(t, e, n).calc();
}
function Eb(t, e, n) {
  return new k0(t, e, n).calcSync();
}
function L0(t, e, n) {
  const r = t instanceof vi, s = r ? t : vi.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Zn(e),
    P: yu(n)
  };
}
function C0(t, e, n, r) {
  const s = It.BASE.multiplyAndAddUnsafe(e, vs(n), Q(-r, Vt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function T0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = L0(t, e, n), a = xa(await he.taggedHash(Vr.challenge, Ei(r), o.toRawX(), i));
    return C0(r, o, s, a);
  } catch {
    return !1;
  }
}
function B0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = L0(t, e, n), a = xa(he.taggedHashSync(Vr.challenge, Ei(r), o.toRawX(), i));
    return C0(r, o, s, a);
  } catch (r) {
    if (r instanceof pu)
      throw r;
    return !1;
  }
}
const Ab = {
  Signature: vi,
  getPublicKey: xb,
  sign: Sb,
  verify: T0,
  signSync: Eb,
  verifySync: B0
};
It.BASE._setWindowSize(8);
const sn = {
  node: b0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Vr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Uo = {}, he = {
  bytesToHex: Si,
  hexToBytes: Zr,
  concatBytes: qr,
  mod: Q,
  invert: Hi,
  isValidPrivateKey(t) {
    try {
      return vs(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ei,
  _normalizePrivateKey: vs,
  hashToPrivateKey: (t) => {
    t = Zn(t);
    const e = As + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = Q(dn(t), Vt.n - re) + re;
    return Ei(n);
  },
  randomBytes: (t = 32) => {
    if (sn.web)
      return sn.web.getRandomValues(new Uint8Array(t));
    if (sn.node) {
      const { randomBytes: e } = sn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => he.hashToPrivateKey(he.randomBytes(As + 8)),
  precompute(t = 8, e = It.BASE) {
    const n = e === It.BASE ? e : new It(e.x, e.y);
    return n._setWindowSize(t), n.multiply(eo), n;
  },
  sha256: async (...t) => {
    if (sn.web) {
      const e = await sn.web.subtle.digest("SHA-256", qr(...t));
      return new Uint8Array(e);
    } else if (sn.node) {
      const { createHash: e } = sn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (sn.web) {
      const n = await sn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = qr(...e), s = await sn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (sn.node) {
      const { createHmac: n } = sn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Uo[t];
    if (n === void 0) {
      const r = await he.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = qr(r, r), Uo[t] = n;
    }
    return he.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof yi != "function")
      throw new pu("sha256Sync is undefined, you need to set it");
    let n = Uo[t];
    if (n === void 0) {
      const r = yi(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = qr(r, r), Uo[t] = n;
    }
    return yi(n, ...e);
  },
  _JacobianPoint: Ot
};
Object.defineProperties(he, {
  sha256Sync: {
    configurable: !1,
    get() {
      return yi;
    },
    set(t) {
      yi || (yi = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return no;
    },
    set(t) {
      no || (no = t);
    }
  }
});
const vb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Vt,
  Point: It,
  Signature: fn,
  getPublicKey: Ao,
  getSharedSecret: wu,
  recoverPublicKey: gb,
  schnorr: Ab,
  sign: wb,
  signSync: qa,
  utils: he,
  verify: mb
}, Symbol.toStringTag, { value: "Module" }));
var vo = {};
vo.byteLength = Cb;
var $b = vo.toByteArray = Bb, Ib = vo.fromByteArray = _b, Rn = [], mn = [], kb = typeof Uint8Array < "u" ? Uint8Array : Array, Tc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ii = 0, Lb = Tc.length; ii < Lb; ++ii)
  Rn[ii] = Tc[ii], mn[Tc.charCodeAt(ii)] = ii;
mn[45] = 62;
mn[95] = 63;
function M0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Cb(t) {
  var e = M0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Tb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Bb(t) {
  var e, n = M0(t), r = n[0], s = n[1], i = new kb(Tb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = mn[t.charCodeAt(c)] << 18 | mn[t.charCodeAt(c + 1)] << 12 | mn[t.charCodeAt(c + 2)] << 6 | mn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = mn[t.charCodeAt(c)] << 2 | mn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = mn[t.charCodeAt(c)] << 10 | mn[t.charCodeAt(c + 1)] << 4 | mn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Mb(t) {
  return Rn[t >> 18 & 63] + Rn[t >> 12 & 63] + Rn[t >> 6 & 63] + Rn[t & 63];
}
function Nb(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Mb(r));
  return s.join("");
}
function _b(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Nb(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Rn[e >> 2] + Rn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Rn[e >> 10] + Rn[e >> 4 & 63] + Rn[e << 2 & 63] + "="
  )), s.join("");
}
function Pb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Ub = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Hb() {
  if (Pb())
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
    throw new Error(Ub);
  }
}
class Ob {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Yn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Yn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Db {
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
async function N0() {
  const t = await Hb();
  return t.name === "subtleCrypto" ? new Db(t.lib) : new Ob(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Fb(t) {
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
    for (var x = 0, E = 0, C = 0, j = p.length; C !== j && p[C] === 0; )
      C++, x++;
    for (var R = (j - C) * u + 1 >>> 0, S = new Uint8Array(R); C !== j; ) {
      for (var m = p[C], k = 0, O = R - 1; (m !== 0 || k < E) && O !== -1; O--, k++)
        m += 256 * S[O] >>> 0, S[O] = m % o >>> 0, m = m / o >>> 0;
      if (m !== 0)
        throw new Error("Non-zero carry");
      E = k, C++;
    }
    for (var K = R - E; K !== R && S[K] === 0; )
      K++;
    for (var z = a.repeat(x); K < R; ++K)
      z += t.charAt(S[K]);
    return z;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var x = 0, E = 0, C = 0; p[x] === a; )
      E++, x++;
    for (var j = (p.length - x) * c + 1 >>> 0, R = new Uint8Array(j); p[x]; ) {
      var S = p.charCodeAt(x);
      if (S > 255)
        return;
      var m = e[S];
      if (m === 255)
        return;
      for (var k = 0, O = j - 1; (m !== 0 || k < C) && O !== -1; O--, k++)
        m += o * R[O] >>> 0, R[O] = m % 256 >>> 0, m = m / 256 >>> 0;
      if (m !== 0)
        throw new Error("Non-zero carry");
      C = k, x++;
    }
    for (var K = j - C; K !== j && R[K] === 0; )
      K++;
    for (var z = new Uint8Array(E + (j - K)), X = E; K !== j; )
      z[X++] = R[K++];
    return z;
  }
  function y(p) {
    var x = l(p);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: y
  };
}
var _0 = Fb;
const jb = _0, zb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Rb = jb(zb);
const Gb = /* @__PURE__ */ s0(Rb), Kb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), P0 = Uint8Array.from({ length: 16 }, (t, e) => e), Vb = P0.map((t) => (9 * t + 5) % 16);
let bu = [P0], mu = [Vb];
for (let t = 0; t < 4; t++)
  for (let e of [bu, mu])
    e.push(e[t].map((n) => Kb[n]));
const U0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), qb = bu.map((t, e) => t.map((n) => U0[e][n])), Wb = mu.map((t, e) => t.map((n) => U0[e][n])), Xb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Yb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ho = (t, e) => t << e | t >>> 32 - e;
function zf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Oo = new Uint32Array(16);
let Zb = class extends hu {
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
      Oo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = Xb[p], C = Yb[p], j = bu[p], R = mu[p], S = qb[p], m = Wb[p];
      for (let k = 0; k < 16; k++) {
        const O = Ho(r + zf(p, i, a, u) + Oo[j[k]] + E, S[k]) + l | 0;
        r = l, l = u, u = Ho(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = Ho(s + zf(x, o, c, d) + Oo[R[k]] + C, m[k]) + y | 0;
        s = y, y = d, d = Ho(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Oo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Qb = js(() => new Zb());
function Jb(t) {
  return Qb(t);
}
const Do = BigInt(2 ** 32 - 1), ll = BigInt(32);
function H0(t, e = !1) {
  return e ? { h: Number(t & Do), l: Number(t >> ll & Do) } : { h: Number(t >> ll & Do) | 0, l: Number(t & Do) | 0 };
}
function t1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = H0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const e1 = (t, e) => BigInt(t >>> 0) << ll | BigInt(e >>> 0), n1 = (t, e, n) => t >>> n, r1 = (t, e, n) => t << 32 - n | e >>> n, s1 = (t, e, n) => t >>> n | e << 32 - n, i1 = (t, e, n) => t << 32 - n | e >>> n, o1 = (t, e, n) => t << 64 - n | e >>> n - 32, a1 = (t, e, n) => t >>> n - 32 | e << 64 - n, c1 = (t, e) => e, l1 = (t, e) => t, u1 = (t, e, n) => t << n | e >>> 32 - n, f1 = (t, e, n) => e << n | t >>> 32 - n, d1 = (t, e, n) => e << n - 32 | t >>> 64 - n, h1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function p1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const g1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), y1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, w1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), b1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, m1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), x1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, xt = {
  fromBig: H0,
  split: t1,
  toBig: e1,
  shrSH: n1,
  shrSL: r1,
  rotrSH: s1,
  rotrSL: i1,
  rotrBH: o1,
  rotrBL: a1,
  rotr32H: c1,
  rotr32L: l1,
  rotlSH: u1,
  rotlSL: f1,
  rotlBH: d1,
  rotlBL: h1,
  add: p1,
  add3L: g1,
  add3H: y1,
  add4L: w1,
  add4H: b1,
  add5H: x1,
  add5L: m1
}, [S1, E1] = xt.split([
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
].map((t) => BigInt(t))), $r = new Uint32Array(80), Ir = new Uint32Array(80);
let Wa = class extends hu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      $r[S] = e.getUint32(n), Ir[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const m = $r[S - 15] | 0, k = Ir[S - 15] | 0, O = xt.rotrSH(m, k, 1) ^ xt.rotrSH(m, k, 8) ^ xt.shrSH(m, k, 7), K = xt.rotrSL(m, k, 1) ^ xt.rotrSL(m, k, 8) ^ xt.shrSL(m, k, 7), z = $r[S - 2] | 0, X = Ir[S - 2] | 0, A = xt.rotrSH(z, X, 19) ^ xt.rotrBH(z, X, 61) ^ xt.shrSH(z, X, 6), T = xt.rotrSL(z, X, 19) ^ xt.rotrBL(z, X, 61) ^ xt.shrSL(z, X, 6), N = xt.add4L(K, T, Ir[S - 7], Ir[S - 16]), F = xt.add4H(N, O, A, $r[S - 7], $r[S - 16]);
      $r[S] = F | 0, Ir[S] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: x, Gh: E, Gl: C, Hh: j, Hl: R } = this;
    for (let S = 0; S < 80; S++) {
      const m = xt.rotrSH(l, y, 14) ^ xt.rotrSH(l, y, 18) ^ xt.rotrBH(l, y, 41), k = xt.rotrSL(l, y, 14) ^ xt.rotrSL(l, y, 18) ^ xt.rotrBL(l, y, 41), O = l & p ^ ~l & E, K = y & x ^ ~y & C, z = xt.add5L(R, k, K, E1[S], Ir[S]), X = xt.add5H(z, j, m, O, S1[S], $r[S]), A = z | 0, T = xt.rotrSH(r, s, 28) ^ xt.rotrBH(r, s, 34) ^ xt.rotrBH(r, s, 39), N = xt.rotrSL(r, s, 28) ^ xt.rotrBL(r, s, 34) ^ xt.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, V = s & o ^ s & c ^ o & c;
      j = E | 0, R = C | 0, E = p | 0, C = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = xt.add(u | 0, d | 0, X | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = xt.add3L(A, N, V);
      r = xt.add3H(G, X, T, F), s = G | 0;
    }
    ({ h: r, l: s } = xt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = xt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = xt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = xt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = xt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = xt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = xt.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: j, l: R } = xt.add(this.Hh | 0, this.Hl | 0, j | 0, R | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, x, E, C, j, R);
  }
  roundClean() {
    $r.fill(0), Ir.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, A1 = class extends Wa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, v1 = class extends Wa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, $1 = class extends Wa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const I1 = js(() => new Wa());
js(() => new A1());
js(() => new v1());
js(() => new $1());
function O0(t) {
  return xi(t);
}
function k1(t) {
  return I1(t);
}
const L1 = 0;
he.hmacSha256Sync = (t, ...e) => {
  const n = Va.create(xi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function C1() {
  return ot(he.randomPrivateKey());
}
function T1(t) {
  const e = xi(xi(t));
  return Gb.encode(Yn(t, e).slice(0, t.length + 4));
}
function B1(t, e) {
  return T1(Yn(new Uint8Array([t]), e.slice(0, 20)));
}
function D0(t, e = L1) {
  const n = typeof t == "string" ? Pt(t) : t, r = Jb(O0(n));
  return B1(e, r);
}
function F0(t) {
  const e = fu(t);
  return ot(Ao(e.slice(0, 32), !0));
}
he.hmacSha256Sync = (t, ...e) => {
  const n = Va.create(xi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Sa;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Sa || (Sa = {}));
async function M1(t, e, n) {
  return await (await N0()).encrypt("aes-256-cbc", e, t, n);
}
async function N1(t, e, n) {
  return await (await N0()).decrypt("aes-256-cbc", e, t, n);
}
function j0(t, e) {
  return Va(xi, t, e);
}
function _1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function z0(t) {
  const e = k1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function P1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function U1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Sa.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Sa.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !P1(t))
    return e;
  try {
    return It.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function H1(t, e, n, r) {
  const s = U1(t);
  if (!s.result)
    throw s;
  const i = he.randomPrivateKey(), o = Ao(i, !0);
  let a = wu(i, t, !0);
  a = a.slice(1);
  const c = z0(a), u = he.randomBytes(16), d = await M1(u, c.encryptionKey, e), l = Yn(u, o, d), y = j0(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = ot(d);
  else if (r === "base64")
    p = Ib(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: ot(u),
    ephemeralPK: ot(o),
    cipherText: p,
    mac: ot(y),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function R0(t, e) {
  if (!e.ephemeralPK)
    throw new Tf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = wu(t, n, !0);
  r = r.slice(1);
  const s = z0(r), i = Pt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Pt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = $b(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Yn(i, Pt(n), o), c = j0(s.hmacKey, a), u = Pt(e.mac);
  if (!_1(u, c))
    throw new Tf("Decryption failed: failure in MAC check");
  const d = await N1(i, s.encryptionKey, o);
  return e.wasString ? Eo(d) : d;
}
function O1(t, e) {
  const n = typeof e == "string" ? Fs(e) : e, r = F0(t), s = O0(n), i = qa(s, t);
  return {
    signature: ot(i),
    publicKey: r
  };
}
async function D1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = F0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Fs(t) : t, o = await H1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = O1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function F1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return R0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var _e = {}, $i = {}, Re = {};
Object.defineProperty(Re, "__esModule", { value: !0 });
Re.decode = Re.encode = Re.unescape = Re.escape = Re.pad = void 0;
const G0 = vo;
function xu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Re.pad = xu;
function K0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Re.escape = K0;
function V0(t) {
  return xu(t).replace(/-/g, "+").replace(/_/g, "/");
}
Re.unescape = V0;
function j1(t) {
  return K0((0, G0.fromByteArray)(new TextEncoder().encode(t)));
}
Re.encode = j1;
function z1(t) {
  return new TextDecoder().decode((0, G0.toByteArray)(xu(V0(t))));
}
Re.decode = z1;
var Xa = {}, Ya = {}, q0 = {}, W0 = {}, Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
Za.crypto = void 0;
Za.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = p, t.byteSwap = x, t.byteSwap32 = E, t.bytesToHex = R, t.hexToBytes = k, t.asyncLoop = K, t.utf8ToBytes = z, t.bytesToUtf8 = X, t.toBytes = A, t.kdfInputToBytes = T, t.concatBytes = N, t.checkOpts = F, t.createHasher = G, t.createOptHasher = zt, t.createXOFer = ct, t.randomBytes = Ie;
  const e = Za;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function s(I, ...P) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (P.length > 0 && !P.includes(I.length))
      throw new Error("Uint8Array expected of length " + P + ", got length=" + I.length);
  }
  function i(I) {
    if (typeof I != "function" || typeof I.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(I.outputLen), r(I.blockLen);
  }
  function o(I, P = !0) {
    if (I.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (P && I.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(I, P) {
    s(I);
    const ut = P.outputLen;
    if (I.length < ut)
      throw new Error("digestInto() expects output buffer of length at least " + ut);
  }
  function c(I) {
    return new Uint8Array(I.buffer, I.byteOffset, I.byteLength);
  }
  function u(I) {
    return new Uint32Array(I.buffer, I.byteOffset, Math.floor(I.byteLength / 4));
  }
  function d(...I) {
    for (let P = 0; P < I.length; P++)
      I[P].fill(0);
  }
  function l(I) {
    return new DataView(I.buffer, I.byteOffset, I.byteLength);
  }
  function y(I, P) {
    return I << 32 - P | I >>> P;
  }
  function p(I, P) {
    return I << P | I >>> 32 - P >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (I) => I : (I) => x(I), t.byteSwapIfBE = t.swap8IfBE;
  function E(I) {
    for (let P = 0; P < I.length; P++)
      I[P] = x(I[P]);
    return I;
  }
  t.swap32IfBE = t.isLE ? (I) => I : E;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", j = /* @__PURE__ */ Array.from({ length: 256 }, (I, P) => P.toString(16).padStart(2, "0"));
  function R(I) {
    if (s(I), C)
      return I.toHex();
    let P = "";
    for (let ut = 0; ut < I.length; ut++)
      P += j[I[ut]];
    return P;
  }
  const S = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function m(I) {
    if (I >= S._0 && I <= S._9)
      return I - S._0;
    if (I >= S.A && I <= S.F)
      return I - (S.A - 10);
    if (I >= S.a && I <= S.f)
      return I - (S.a - 10);
  }
  function k(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (C)
      return Uint8Array.fromHex(I);
    const P = I.length, ut = P / 2;
    if (P % 2)
      throw new Error("hex string expected, got unpadded hex of length " + P);
    const kt = new Uint8Array(ut);
    for (let Lt = 0, Dt = 0; Lt < ut; Lt++, Dt += 2) {
      const Qt = m(I.charCodeAt(Dt)), Ht = m(I.charCodeAt(Dt + 1));
      if (Qt === void 0 || Ht === void 0) {
        const qt = I[Dt] + I[Dt + 1];
        throw new Error('hex string expected, got non-hex character "' + qt + '" at index ' + Dt);
      }
      kt[Lt] = Qt * 16 + Ht;
    }
    return kt;
  }
  const O = async () => {
  };
  t.nextTick = O;
  async function K(I, P, ut) {
    let kt = Date.now();
    for (let Lt = 0; Lt < I; Lt++) {
      ut(Lt);
      const Dt = Date.now() - kt;
      Dt >= 0 && Dt < P || (await (0, t.nextTick)(), kt += Dt);
    }
  }
  function z(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function X(I) {
    return new TextDecoder().decode(I);
  }
  function A(I) {
    return typeof I == "string" && (I = z(I)), s(I), I;
  }
  function T(I) {
    return typeof I == "string" && (I = z(I)), s(I), I;
  }
  function N(...I) {
    let P = 0;
    for (let kt = 0; kt < I.length; kt++) {
      const Lt = I[kt];
      s(Lt), P += Lt.length;
    }
    const ut = new Uint8Array(P);
    for (let kt = 0, Lt = 0; kt < I.length; kt++) {
      const Dt = I[kt];
      ut.set(Dt, Lt), Lt += Dt.length;
    }
    return ut;
  }
  function F(I, P) {
    if (P !== void 0 && {}.toString.call(P) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, P);
  }
  class V {
  }
  t.Hash = V;
  function G(I) {
    const P = (kt) => I().update(A(kt)).digest(), ut = I();
    return P.outputLen = ut.outputLen, P.blockLen = ut.blockLen, P.create = () => I(), P;
  }
  function zt(I) {
    const P = (kt, Lt) => I(Lt).update(A(kt)).digest(), ut = I({});
    return P.outputLen = ut.outputLen, P.blockLen = ut.blockLen, P.create = (kt) => I(kt), P;
  }
  function ct(I) {
    const P = (kt, Lt) => I(Lt).update(A(kt)).digest(), ut = I({});
    return P.outputLen = ut.outputLen, P.blockLen = ut.blockLen, P.create = (kt) => I(kt), P;
  }
  t.wrapConstructor = G, t.wrapConstructorWithOpts = zt, t.wrapXOFConstructorWithOpts = ct;
  function Ie(I = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(I));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(W0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = W0;
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
})(q0);
const oi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function X0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function ul(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function zs(t, ...e) {
  if (!X0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function R1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  ul(t.outputLen), ul(t.blockLen);
}
function fl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Y0(t, e) {
  zs(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function G1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function K1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ea(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function la(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function $n(t, e) {
  return t << 32 - e | t >>> e;
}
function V1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Su = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Eu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Z0 = Su ? (t) => t : (t) => Eu(t), q1 = Z0;
function Q0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Eu(t[e]);
  return t;
}
const W1 = Su ? (t) => t : Q0, J0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", X1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tp(t) {
  if (zs(t), J0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += X1[t[n]];
  return e;
}
const sr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Rf(t) {
  if (t >= sr._0 && t <= sr._9)
    return t - sr._0;
  if (t >= sr.A && t <= sr.F)
    return t - (sr.A - 10);
  if (t >= sr.a && t <= sr.f)
    return t - (sr.a - 10);
}
function Y1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (J0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Rf(t.charCodeAt(i)), a = Rf(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const ep = async () => {
};
async function Z1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await ep(), r += i);
  }
}
function Au(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Q1(t) {
  return new TextDecoder().decode(t);
}
function $o(t) {
  return typeof t == "string" && (t = Au(t)), zs(t), t;
}
function J1(t) {
  return typeof t == "string" && (t = Au(t)), zs(t), t;
}
function tm(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    zs(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function em(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let np = class {
};
function Qa(t) {
  const e = (r) => t().update($o(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function rp(t) {
  const e = (r, s) => t(s).update($o(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function sp(t) {
  const e = (r, s) => t(s).update($o(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const nm = Qa, rm = rp, sm = sp;
function im(t = 32) {
  if (oi && typeof oi.getRandomValues == "function")
    return oi.getRandomValues(new Uint8Array(t));
  if (oi && typeof oi.randomBytes == "function")
    return Uint8Array.from(oi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const om = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: np,
  abytes: zs,
  aexists: fl,
  ahash: R1,
  anumber: ul,
  aoutput: Y0,
  asyncLoop: Z1,
  byteSwap: Eu,
  byteSwap32: Q0,
  byteSwapIfBE: q1,
  bytesToHex: tp,
  bytesToUtf8: Q1,
  checkOpts: em,
  clean: Ea,
  concatBytes: tm,
  createHasher: Qa,
  createOptHasher: rp,
  createView: la,
  createXOFer: sp,
  hexToBytes: Y1,
  isBytes: X0,
  isLE: Su,
  kdfInputToBytes: J1,
  nextTick: ep,
  randomBytes: im,
  rotl: V1,
  rotr: $n,
  swap32IfBE: W1,
  swap8IfBE: Z0,
  toBytes: $o,
  u32: K1,
  u8: G1,
  utf8ToBytes: Au,
  wrapConstructor: nm,
  wrapConstructorWithOpts: rm,
  wrapXOFConstructorWithOpts: sm
}, Symbol.toStringTag, { value: "Module" }));
function am(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function cm(t, e, n) {
  return t & e ^ ~t & n;
}
function lm(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class um extends np {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = la(this.buffer);
  }
  update(e) {
    fl(this), e = $o(e), zs(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = la(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    fl(this), Y0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Ea(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    am(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = la(e), c = this.outputLen;
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
const kr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Lr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), fm = /* @__PURE__ */ Uint32Array.from([
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
]), Cr = /* @__PURE__ */ new Uint32Array(64);
let vu = class extends um {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = kr[0] | 0, this.B = kr[1] | 0, this.C = kr[2] | 0, this.D = kr[3] | 0, this.E = kr[4] | 0, this.F = kr[5] | 0, this.G = kr[6] | 0, this.H = kr[7] | 0;
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
      Cr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Cr[l - 15], p = Cr[l - 2], x = $n(y, 7) ^ $n(y, 18) ^ y >>> 3, E = $n(p, 17) ^ $n(p, 19) ^ p >>> 10;
      Cr[l] = E + Cr[l - 7] + x + Cr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = $n(a, 6) ^ $n(a, 11) ^ $n(a, 25), p = d + y + cm(a, c, u) + fm[l] + Cr[l] | 0, E = ($n(r, 2) ^ $n(r, 13) ^ $n(r, 22)) + lm(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Ea(Cr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ea(this.buffer);
  }
}, ip = class extends vu {
  constructor() {
    super(28), this.A = Lr[0] | 0, this.B = Lr[1] | 0, this.C = Lr[2] | 0, this.D = Lr[3] | 0, this.E = Lr[4] | 0, this.F = Lr[5] | 0, this.G = Lr[6] | 0, this.H = Lr[7] | 0;
  }
};
const dm = /* @__PURE__ */ Qa(() => new vu()), hm = /* @__PURE__ */ Qa(() => new ip()), pm = vu, op = dm, gm = ip, ym = hm, wm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: gm,
  SHA256: pm,
  sha224: ym,
  sha256: op
}, Symbol.toStringTag, { value: "Module" })), Ja = /* @__PURE__ */ Ga(wm), bm = /* @__PURE__ */ Ga(vb);
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.joseToDer = Ii.derToJose = void 0;
const ap = vo, cp = Re;
function Bc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const mm = {
  ES256: Bc(256),
  ES384: Bc(384),
  ES512: Bc(521)
};
function lp(t) {
  const e = mm[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Aa = 128, up = 0, xm = 32, Sm = 16, Em = 2, fp = Sm | xm | up << 6, va = Em | up << 6;
function dp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, ap.toByteArray)((0, cp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Am(t, e) {
  const n = dp(t), r = lp(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== fp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Aa | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== va)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== va)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const y = r - c, p = r - d, x = new Uint8Array(y + c + p + d);
  for (o = 0; o < y; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const E = o; o < E + p; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, cp.escape)((0, ap.fromByteArray)(x));
}
Ii.derToJose = Am;
function Gf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Aa && --r, r;
}
function vm(t, e) {
  t = dp(t);
  const n = lp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Gf(t, 0, n), i = Gf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Aa, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = fp, u ? d[l++] = c : (d[l++] = Aa | 1, d[l++] = c & 255), d[l++] = va, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = va, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
Ii.joseToDer = vm;
var dr = {};
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.InvalidTokenError = dr.MissingParametersError = void 0;
class $m extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
dr.MissingParametersError = $m;
class Im extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
dr.InvalidTokenError = Im;
const Io = /* @__PURE__ */ Ga(om);
Object.defineProperty(Ya, "__esModule", { value: !0 });
Ya.SECP256K1Client = void 0;
const km = q0, Lm = Ja, ua = bm, Kf = Ii, Vf = dr, qf = Io;
ua.utils.hmacSha256Sync = (t, ...e) => {
  const n = km.hmac.create(Lm.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class hp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, qf.bytesToHex)(ua.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Vf.MissingParametersError("a signing input hash and private key are all required");
    const s = ua.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, qf.bytesToHex)(s);
    if (r === "jose")
      return (0, Kf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Kf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Vf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ua.verify(n, e, r, { strict: !1 });
  }
}
Ya.SECP256K1Client = hp;
hp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ya;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Xa);
var $s = {};
const Cm = /* @__PURE__ */ Ga(b0);
var Tm = Ke && Ke.__awaiter || function(t, e, n, r) {
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
Object.defineProperty($s, "__esModule", { value: !0 });
$s.hashSha256Async = $s.hashSha256 = void 0;
const Bm = Ja;
function pp(t) {
  return (0, Bm.sha256)(t);
}
$s.hashSha256 = pp;
function Mm(t) {
  return Tm(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Cm;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(pp(t));
    }
  });
}
$s.hashSha256Async = Mm;
var Nm = Ke && Ke.__awaiter || function(t, e, n, r) {
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
Object.defineProperty($i, "__esModule", { value: !0 });
$i.TokenSigner = $i.createUnsecuredToken = void 0;
const dl = Re, Wf = Xa, _m = dr, Xf = $s;
function hl(t, e) {
  const n = [], r = dl.encode(JSON.stringify(e));
  n.push(r);
  const s = dl.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Pm(t) {
  return hl(t, { typ: "JWT", alg: "none" }) + ".";
}
$i.createUnsecuredToken = Pm;
class Um {
  constructor(e, n) {
    if (!(e && n))
      throw new _m.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Wf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Wf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = hl(e, s), o = (0, Xf.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Nm(this, void 0, void 0, function* () {
      const s = this.header(r), i = hl(e, s), o = yield (0, Xf.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [dl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
$i.TokenSigner = Um;
var tc = {};
Object.defineProperty(tc, "__esModule", { value: !0 });
tc.TokenVerifier = void 0;
const Hm = Re, Yf = Xa, Om = dr, Fo = $s;
class Dm {
  constructor(e, n) {
    if (!(e && n))
      throw new Om.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Yf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Yf.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Fo.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Fo.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Hm.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Fo.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Fo.hashSha256)(r);
      return i(o);
    }
  }
}
tc.TokenVerifier = Dm;
var ec = {};
Object.defineProperty(ec, "__esModule", { value: !0 });
ec.decodeToken = void 0;
const jo = Re;
function Fm(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(jo.decode(e[0])), r = JSON.parse(jo.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = jo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(jo.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
ec.decodeToken = Fm;
(function(t) {
  var e = Ke && Ke.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Ke && Ke.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n($i, t), n(tc, t), n(ec, t), n(dr, t), n(Xa, t);
})(_e);
function jm(t) {
  return `did:btc-addr:${t}`;
}
function zm(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Cf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Cf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function gp(t) {
  if (t)
    return zm(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Rm = "1.4.0";
function Gm() {
  return C1();
}
function Km(t, e, n, r = c0.slice(), s, i = Iw().getTime(), o = {}) {
  const a = (p) => {
    const x = lu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Lw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Rm,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = _e.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = D0(u);
  return c.iss = jm(d), new _e.TokenSigner("ES256k", t).sign(c);
}
async function Zf(t, e) {
  const n = Eo(Pt(e)), r = JSON.parse(n), s = await R0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Vm(t) {
  const e = _e.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new _e.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function qm(t) {
  const e = _e.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = gp(e.iss);
  if (n.length === 1) {
    if (D0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Wm(t) {
  const e = _e.decodeToken(t).payload;
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
function Xm(t) {
  const e = _e.decodeToken(t).payload;
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
function Ym(t) {
  const e = [
    Xm(t),
    Wm(t),
    Vm(t),
    qm(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Qf = "1.0.0";
class Qr {
  constructor(e) {
    this.version = Qf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Qf)
      throw new sl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Qr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class yp {
  constructor(e) {
    if (e) {
      const n = new Qr(e);
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
class Jf extends yp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Qr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new l0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Qr({})), !0;
  }
}
class td extends yp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Aw, !localStorage.getItem(this.key)) {
      const r = new Qr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new l0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Qr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Qr({})), !0;
  }
}
var co;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(co || (co = {}));
var $a;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($a || ($a = {}));
co.Mainnet;
var ur;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ur || (ur = {}));
var Vn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Vn || (Vn = {}));
ur.Mainnet;
const wp = {
  chainId: co.Mainnet,
  transactionVersion: ur.Mainnet,
  peerNetworkId: $a.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Vn.MainnetSingleSig,
    multiSig: Vn.MainnetMultiSig
  },
  client: { baseUrl: u0 }
}, pl = {
  chainId: co.Testnet,
  transactionVersion: ur.Testnet,
  peerNetworkId: $a.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Vn.TestnetSingleSig,
    multiSig: Vn.TestnetMultiSig
  },
  client: { baseUrl: f0 }
}, fa = {
  ...pl,
  addressVersion: { ...pl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: d0 }
}, Zm = {
  ...fa,
  addressVersion: { ...fa.addressVersion },
  client: { ...fa.client }
};
function Qm(t) {
  switch (t) {
    case "mainnet":
      return wp;
    case "testnet":
      return pl;
    case "devnet":
      return fa;
    case "mocknet":
      return Zm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function bp(t) {
  return typeof t == "string" ? Qm(t) : t;
}
var ed;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ed || (ed = {}));
var nd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(nd || (nd = {}));
var kn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(kn || (kn = {}));
const Mc = ["onChainOnly", "offChainOnly", "any"];
Mc[0] + "", kn.OnChainOnly, Mc[1] + "", kn.OffChainOnly, Mc[2] + "", kn.Any, kn.OnChainOnly + "", kn.OnChainOnly, kn.OffChainOnly + "", kn.OffChainOnly, kn.Any + "", kn.Any;
var rd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(rd || (rd = {}));
var sd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(sd || (sd = {}));
var id;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(id || (id = {}));
var lr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(lr || (lr = {}));
var od;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(od || (od = {}));
var ad;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ad || (ad = {}));
var cd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(fd || (fd = {}));
var dd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(hd || (hd = {}));
var pd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(pd || (pd = {}));
function gl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Jm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function mp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function t2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  gl(t.outputLen), gl(t.blockLen);
}
function e2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function n2(t, e) {
  mp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const fs = {
  number: gl,
  bool: Jm,
  bytes: mp,
  hash: t2,
  exists: e2,
  output: n2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Nc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Dn = (t, e) => t << 32 - e | t >>> e, r2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!r2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function s2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function $u(t) {
  if (typeof t == "string" && (t = s2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let xp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Rs(t) {
  const e = (r) => t().update($u(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Sp = class extends xp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, fs.hash(e);
    const r = $u(n);
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
    return fs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    fs.exists(this), fs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ep = (t, e, n) => new Sp(t, e).update(n).digest();
Ep.create = (t, e) => new Sp(t, e);
function i2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Iu = class extends xp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Nc(this.buffer);
  }
  update(e) {
    fs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = $u(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Nc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    fs.exists(this), fs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    i2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Nc(e), c = this.outputLen;
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
const o2 = (t, e, n) => t & e ^ ~t & n, a2 = (t, e, n) => t & e ^ t & n ^ e & n, c2 = new Uint32Array([
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
]), Tr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Br = new Uint32Array(64);
let Ap = class extends Iu {
  constructor() {
    super(64, 32, 8, !1), this.A = Tr[0] | 0, this.B = Tr[1] | 0, this.C = Tr[2] | 0, this.D = Tr[3] | 0, this.E = Tr[4] | 0, this.F = Tr[5] | 0, this.G = Tr[6] | 0, this.H = Tr[7] | 0;
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
      Br[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Br[l - 15], p = Br[l - 2], x = Dn(y, 7) ^ Dn(y, 18) ^ y >>> 3, E = Dn(p, 17) ^ Dn(p, 19) ^ p >>> 10;
      Br[l] = E + Br[l - 7] + x + Br[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Dn(a, 6) ^ Dn(a, 11) ^ Dn(a, 25), p = d + y + o2(a, c, u) + c2[l] + Br[l] | 0, E = (Dn(r, 2) ^ Dn(r, 13) ^ Dn(r, 22)) + a2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Br.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, l2 = class extends Ap {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const vp = Rs(() => new Ap());
Rs(() => new l2());
var Gs = {}, ku = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Io;
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
        const C = 1 + u, j = E % (1 << C) << 5 - C, R = t.c32[x + j];
        u = C, c.unshift(R);
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
    let d = [], l = 0, y = 0;
    for (let E = o.length - 1; E >= 0; E--) {
      y === 4 && (d.unshift(n[l]), y = 0, l = 0);
      const j = (t.c32.indexOf(o[E]) << y) + l, R = n[j % 16];
      if (y += 1, l = j >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      d.unshift(R);
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
      for (let C = 0; C < E; C += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(ku);
var Is = {};
Object.defineProperty(Is, "__esModule", { value: !0 });
Is.c32checkDecode = Is.c32checkEncode = void 0;
const gd = Ja, yd = Io, ro = ku;
function $p(t) {
  const e = (0, gd.sha256)((0, gd.sha256)((0, yd.hexToBytes)(t)));
  return (0, yd.bytesToHex)(e.slice(0, 4));
}
function u2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = $p(`${n}${e}`), s = (0, ro.c32encode)(`${e}${r}`);
  return `${ro.c32[t]}${s}`;
}
Is.c32checkEncode = u2;
function f2(t) {
  t = (0, ro.c32normalize)(t);
  const e = (0, ro.c32decode)(t.slice(1)), n = t[0], r = ro.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), $p(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Is.c32checkDecode = f2;
var Ip = {}, ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.decode = ki.encode = void 0;
const Ia = Ja, wd = Io, kp = _0, Lp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function d2(t, e = "00") {
  const n = typeof t == "string" ? (0, wd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, wd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ia.sha256)((0, Ia.sha256)(new Uint8Array([...r, ...n])));
  return kp(Lp).encode([...r, ...n, ...s.slice(0, 4)]);
}
ki.encode = d2;
function h2(t) {
  const e = kp(Lp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ia.sha256)((0, Ia.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ki.decode = h2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Is, n = ki, r = Io;
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
    const y = n.decode(d), p = (0, r.bytesToHex)(y.data), x = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let E;
    return l < 0 ? (E = x, s[x] !== void 0 && (E = s[x])) : E = l, o(E, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const y = a(d), p = y[0], x = y[1];
    let E;
    l < 0 ? (E = p, i[p] !== void 0 && (E = i[p])) : E = l;
    let C = E.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(x, C);
  }
  t.c32ToB58 = u;
})(Ip);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = ku;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Is;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Ip;
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
})(Gs);
function p2(t, e) {
  switch (e = bp(e ?? wp), t) {
    case lr.P2PKH:
      switch (e.transactionVersion) {
        case ur.Mainnet:
          return Vn.MainnetSingleSig;
        case ur.Testnet:
          return Vn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case lr.P2SH:
    case lr.P2SHNonSequential:
    case lr.P2WPKH:
    case lr.P2WSH:
    case lr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case ur.Mainnet:
          return Vn.MainnetMultiSig;
        case ur.Testnet:
          return Vn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const g2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Cp = Uint8Array.from({ length: 16 }, (t, e) => e), y2 = Cp.map((t) => (9 * t + 5) % 16);
let Lu = [Cp], Cu = [y2];
for (let t = 0; t < 4; t++)
  for (let e of [Lu, Cu])
    e.push(e[t].map((n) => g2[n]));
const Tp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), w2 = Lu.map((t, e) => t.map((n) => Tp[e][n])), b2 = Cu.map((t, e) => t.map((n) => Tp[e][n])), m2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), x2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), zo = (t, e) => t << e | t >>> 32 - e;
function bd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ro = new Uint32Array(16);
let S2 = class extends Iu {
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
      Ro[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = m2[p], C = x2[p], j = Lu[p], R = Cu[p], S = w2[p], m = b2[p];
      for (let k = 0; k < 16; k++) {
        const O = zo(r + bd(p, i, a, u) + Ro[j[k]] + E, S[k]) + l | 0;
        r = l, l = u, u = zo(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = zo(s + bd(x, o, c, d) + Ro[R[k]] + C, m[k]) + y | 0;
        s = y, y = d, d = zo(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ro.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const E2 = Rs(() => new S2()), Go = BigInt(2 ** 32 - 1), yl = BigInt(32);
function Bp(t, e = !1) {
  return e ? { h: Number(t & Go), l: Number(t >> yl & Go) } : { h: Number(t >> yl & Go) | 0, l: Number(t & Go) | 0 };
}
function A2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Bp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const v2 = (t, e) => BigInt(t >>> 0) << yl | BigInt(e >>> 0), $2 = (t, e, n) => t >>> n, I2 = (t, e, n) => t << 32 - n | e >>> n, k2 = (t, e, n) => t >>> n | e << 32 - n, L2 = (t, e, n) => t << 32 - n | e >>> n, C2 = (t, e, n) => t << 64 - n | e >>> n - 32, T2 = (t, e, n) => t >>> n - 32 | e << 64 - n, B2 = (t, e) => e, M2 = (t, e) => t, N2 = (t, e, n) => t << n | e >>> 32 - n, _2 = (t, e, n) => e << n | t >>> 32 - n, P2 = (t, e, n) => e << n - 32 | t >>> 64 - n, U2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function H2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const O2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), D2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, F2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), j2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, z2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), R2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, St = {
  fromBig: Bp,
  split: A2,
  toBig: v2,
  shrSH: $2,
  shrSL: I2,
  rotrSH: k2,
  rotrSL: L2,
  rotrBH: C2,
  rotrBL: T2,
  rotr32H: B2,
  rotr32L: M2,
  rotlSH: N2,
  rotlSL: _2,
  rotlBH: P2,
  rotlBL: U2,
  add: H2,
  add3L: O2,
  add3H: D2,
  add4L: F2,
  add4H: j2,
  add5H: R2,
  add5L: z2
}, [G2, K2] = St.split([
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
].map((t) => BigInt(t))), Mr = new Uint32Array(80), Nr = new Uint32Array(80);
let nc = class extends Iu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      Mr[S] = e.getUint32(n), Nr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const m = Mr[S - 15] | 0, k = Nr[S - 15] | 0, O = St.rotrSH(m, k, 1) ^ St.rotrSH(m, k, 8) ^ St.shrSH(m, k, 7), K = St.rotrSL(m, k, 1) ^ St.rotrSL(m, k, 8) ^ St.shrSL(m, k, 7), z = Mr[S - 2] | 0, X = Nr[S - 2] | 0, A = St.rotrSH(z, X, 19) ^ St.rotrBH(z, X, 61) ^ St.shrSH(z, X, 6), T = St.rotrSL(z, X, 19) ^ St.rotrBL(z, X, 61) ^ St.shrSL(z, X, 6), N = St.add4L(K, T, Nr[S - 7], Nr[S - 16]), F = St.add4H(N, O, A, Mr[S - 7], Mr[S - 16]);
      Mr[S] = F | 0, Nr[S] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: x, Gh: E, Gl: C, Hh: j, Hl: R } = this;
    for (let S = 0; S < 80; S++) {
      const m = St.rotrSH(l, y, 14) ^ St.rotrSH(l, y, 18) ^ St.rotrBH(l, y, 41), k = St.rotrSL(l, y, 14) ^ St.rotrSL(l, y, 18) ^ St.rotrBL(l, y, 41), O = l & p ^ ~l & E, K = y & x ^ ~y & C, z = St.add5L(R, k, K, K2[S], Nr[S]), X = St.add5H(z, j, m, O, G2[S], Mr[S]), A = z | 0, T = St.rotrSH(r, s, 28) ^ St.rotrBH(r, s, 34) ^ St.rotrBH(r, s, 39), N = St.rotrSL(r, s, 28) ^ St.rotrBL(r, s, 34) ^ St.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, V = s & o ^ s & c ^ o & c;
      j = E | 0, R = C | 0, E = p | 0, C = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = St.add(u | 0, d | 0, X | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = St.add3L(A, N, V);
      r = St.add3H(G, X, T, F), s = G | 0;
    }
    ({ h: r, l: s } = St.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = St.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = St.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = St.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = St.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = St.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = St.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: j, l: R } = St.add(this.Hh | 0, this.Hl | 0, j | 0, R | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, x, E, C, j, R);
  }
  roundClean() {
    Mr.fill(0), Nr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, V2 = class extends nc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, q2 = class extends nc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, W2 = class extends nc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Rs(() => new nc());
Rs(() => new V2());
Rs(() => new q2());
Rs(() => new W2());
var ka = { exports: {} };
ka.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", x = "[object Object]", E = "[object Promise]", C = "[object RegExp]", j = "[object Set]", R = "[object String]", S = "[object Symbol]", m = "[object WeakMap]", k = "[object ArrayBuffer]", O = "[object DataView]", K = "[object Float32Array]", z = "[object Float64Array]", X = "[object Int8Array]", A = "[object Int16Array]", T = "[object Int32Array]", N = "[object Uint8Array]", F = "[object Uint8ClampedArray]", V = "[object Uint16Array]", G = "[object Uint32Array]", zt = /[\\^$.*+?()[\]{}|]/g, ct = /\w*$/, Ie = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, P = {};
  P[i] = P[o] = P[k] = P[O] = P[a] = P[c] = P[K] = P[z] = P[X] = P[A] = P[T] = P[y] = P[p] = P[x] = P[C] = P[j] = P[R] = P[S] = P[N] = P[F] = P[V] = P[G] = !0, P[u] = P[d] = P[m] = !1;
  var ut = typeof Ke == "object" && Ke && Ke.Object === Object && Ke, kt = typeof self == "object" && self && self.Object === Object && self, Lt = ut || kt || Function("return this")(), Dt = e && !e.nodeType && e, Qt = Dt && !0 && t && !t.nodeType && t, Ht = Qt && Qt.exports === Dt;
  function qt(g, L) {
    return g.set(L[0], L[1]), g;
  }
  function pe(g, L) {
    return g.add(L), g;
  }
  function qe(g, L) {
    for (var _ = -1, nt = g ? g.length : 0; ++_ < nt && L(g[_], _, g) !== !1; )
      ;
    return g;
  }
  function mt(g, L) {
    for (var _ = -1, nt = L.length, Me = g.length; ++_ < nt; )
      g[Me + _] = L[_];
    return g;
  }
  function Fe(g, L, _, nt) {
    for (var Me = -1, Ye = g ? g.length : 0; ++Me < Ye; )
      _ = L(_, g[Me], Me, g);
    return _;
  }
  function nn(g, L) {
    for (var _ = -1, nt = Array(g); ++_ < g; )
      nt[_] = L(_);
    return nt;
  }
  function je(g, L) {
    return g == null ? void 0 : g[L];
  }
  function _n(g) {
    var L = !1;
    if (g != null && typeof g.toString != "function")
      try {
        L = !!(g + "");
      } catch {
      }
    return L;
  }
  function xe(g) {
    var L = -1, _ = Array(g.size);
    return g.forEach(function(nt, Me) {
      _[++L] = [Me, nt];
    }), _;
  }
  function Se(g, L) {
    return function(_) {
      return g(L(_));
    };
  }
  function Te(g) {
    var L = -1, _ = Array(g.size);
    return g.forEach(function(nt) {
      _[++L] = nt;
    }), _;
  }
  var ie = Array.prototype, Pe = Function.prototype, Ue = Object.prototype, Ae = Lt["__core-js_shared__"], te = function() {
    var g = /[^.]+$/.exec(Ae && Ae.keys && Ae.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), oe = Pe.toString, Ee = Ue.hasOwnProperty, We = Ue.toString, ke = RegExp(
    "^" + oe.call(Ee).replace(zt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), v = Ht ? Lt.Buffer : void 0, B = Lt.Symbol, M = Lt.Uint8Array, h = Se(Object.getPrototypeOf, Object), b = Object.create, f = Ue.propertyIsEnumerable, U = ie.splice, Y = Object.getOwnPropertySymbols, et = v ? v.isBuffer : void 0, pt = Se(Object.keys, Object), Rt = D(Lt, "DataView"), _t = D(Lt, "Map"), dt = D(Lt, "Promise"), gt = D(Lt, "Set"), ee = D(Lt, "WeakMap"), Mt = D(Object, "create"), Wt = ye(Rt), yt = ye(_t), Ut = ye(dt), Gt = ye(gt), it = ye(ee), wt = B ? B.prototype : void 0, Kt = wt ? wt.valueOf : void 0;
  function ge(g) {
    var L = -1, _ = g ? g.length : 0;
    for (this.clear(); ++L < _; ) {
      var nt = g[L];
      this.set(nt[0], nt[1]);
    }
  }
  function Tt() {
    this.__data__ = Mt ? Mt(null) : {};
  }
  function Le(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function rs(g) {
    var L = this.__data__;
    if (Mt) {
      var _ = L[g];
      return _ === r ? void 0 : _;
    }
    return Ee.call(L, g) ? L[g] : void 0;
  }
  function gr(g) {
    var L = this.__data__;
    return Mt ? L[g] !== void 0 : Ee.call(L, g);
  }
  function er(g, L) {
    var _ = this.__data__;
    return _[g] = Mt && L === void 0 ? r : L, this;
  }
  ge.prototype.clear = Tt, ge.prototype.delete = Le, ge.prototype.get = rs, ge.prototype.has = gr, ge.prototype.set = er;
  function ue(g) {
    var L = -1, _ = g ? g.length : 0;
    for (this.clear(); ++L < _; ) {
      var nt = g[L];
      this.set(nt[0], nt[1]);
    }
  }
  function pn() {
    this.__data__ = [];
  }
  function Xe(g) {
    var L = this.__data__, _ = Un(L, g);
    if (_ < 0)
      return !1;
    var nt = L.length - 1;
    return _ == nt ? L.pop() : U.call(L, _, 1), !0;
  }
  function yr(g) {
    var L = this.__data__, _ = Un(L, g);
    return _ < 0 ? void 0 : L[_][1];
  }
  function wr(g) {
    return Un(this.__data__, g) > -1;
  }
  function Ys(g, L) {
    var _ = this.__data__, nt = Un(_, g);
    return nt < 0 ? _.push([g, L]) : _[nt][1] = L, this;
  }
  ue.prototype.clear = pn, ue.prototype.delete = Xe, ue.prototype.get = yr, ue.prototype.has = wr, ue.prototype.set = Ys;
  function Pn(g) {
    var L = -1, _ = g ? g.length : 0;
    for (this.clear(); ++L < _; ) {
      var nt = g[L];
      this.set(nt[0], nt[1]);
    }
  }
  function Zs() {
    this.__data__ = {
      hash: new ge(),
      map: new (_t || ue)(),
      string: new ge()
    };
  }
  function Qs(g) {
    return $(this, g).delete(g);
  }
  function Js(g) {
    return $(this, g).get(g);
  }
  function gn(g) {
    return $(this, g).has(g);
  }
  function ti(g, L) {
    return $(this, g).set(g, L), this;
  }
  Pn.prototype.clear = Zs, Pn.prototype.delete = Qs, Pn.prototype.get = Js, Pn.prototype.has = gn, Pn.prototype.set = ti;
  function yn(g) {
    this.__data__ = new ue(g);
  }
  function ei() {
    this.__data__ = new ue();
  }
  function br(g) {
    return this.__data__.delete(g);
  }
  function mr(g) {
    return this.__data__.get(g);
  }
  function xr(g) {
    return this.__data__.has(g);
  }
  function Sr(g, L) {
    var _ = this.__data__;
    if (_ instanceof ue) {
      var nt = _.__data__;
      if (!_t || nt.length < n - 1)
        return nt.push([g, L]), this;
      _ = this.__data__ = new Pn(nt);
    }
    return _.set(g, L), this;
  }
  yn.prototype.clear = ei, yn.prototype.delete = br, yn.prototype.get = mr, yn.prototype.has = xr, yn.prototype.set = Sr;
  function ss(g, L) {
    var _ = Ac(g) || Ry(g) ? nn(g.length, String) : [], nt = _.length, Me = !!nt;
    for (var Ye in g)
      Ee.call(g, Ye) && !(Me && (Ye == "length" || ht(Ye, nt))) && _.push(Ye);
    return _;
  }
  function nr(g, L, _) {
    var nt = g[L];
    (!(Ee.call(g, L) && Vi(nt, _)) || _ === void 0 && !(L in g)) && (g[L] = _);
  }
  function Un(g, L) {
    for (var _ = g.length; _--; )
      if (Vi(g[_][0], L))
        return _;
    return -1;
  }
  function q(g, L) {
    return g && ri(L, vc(L), g);
  }
  function tt(g, L, _, nt, Me, Ye, rr) {
    var Ze;
    if (nt && (Ze = Ye ? nt(g, Me, Ye, rr) : nt(g)), Ze !== void 0)
      return Ze;
    if (!To(g))
      return g;
    var Ef = Ac(g);
    if (Ef) {
      if (Ze = H(g), !L)
        return Sc(g, Ze);
    } else {
      var si = st(g), Af = si == d || si == l;
      if (Ky(g))
        return Ri(g, L);
      if (si == x || si == i || Af && !Ye) {
        if (_n(g))
          return Ye ? g : {};
        if (Ze = lt(Af ? {} : g), !L)
          return Ec(g, q(Ze, g));
      } else {
        if (!P[si])
          return Ye ? g : {};
        Ze = ft(g, si, tt, L);
      }
    }
    rr || (rr = new yn());
    var vf = rr.get(g);
    if (vf)
      return vf;
    if (rr.set(g, Ze), !Ef)
      var $f = _ ? w(g) : vc(g);
    return qe($f || g, function($c, Bo) {
      $f && (Bo = $c, $c = g[Bo]), nr(Ze, Bo, tt($c, L, _, nt, Bo, g, rr));
    }), Ze;
  }
  function ae(g) {
    return To(g) ? b(g) : {};
  }
  function ve(g, L, _) {
    var nt = L(g);
    return Ac(g) ? nt : mt(nt, _(g));
  }
  function is(g) {
    return We.call(g);
  }
  function Er(g) {
    if (!To(g) || Be(g))
      return !1;
    var L = Sf(g) || _n(g) ? ke : Ie;
    return L.test(ye(g));
  }
  function Jt(g) {
    if (!rn(g))
      return pt(g);
    var L = [];
    for (var _ in Object(g))
      Ee.call(g, _) && _ != "constructor" && L.push(_);
    return L;
  }
  function Ri(g, L) {
    if (L)
      return g.slice();
    var _ = new g.constructor(g.length);
    return g.copy(_), _;
  }
  function os(g) {
    var L = new g.constructor(g.byteLength);
    return new M(L).set(new M(g)), L;
  }
  function vn(g, L) {
    var _ = L ? os(g.buffer) : g.buffer;
    return new g.constructor(_, g.byteOffset, g.byteLength);
  }
  function Gi(g, L, _) {
    var nt = L ? _(xe(g), !0) : xe(g);
    return Fe(nt, qt, new g.constructor());
  }
  function ni(g) {
    var L = new g.constructor(g.source, ct.exec(g));
    return L.lastIndex = g.lastIndex, L;
  }
  function mc(g, L, _) {
    var nt = L ? _(Te(g), !0) : Te(g);
    return Fe(nt, pe, new g.constructor());
  }
  function Ki(g) {
    return Kt ? Object(Kt.call(g)) : {};
  }
  function xc(g, L) {
    var _ = L ? os(g.buffer) : g.buffer;
    return new g.constructor(_, g.byteOffset, g.length);
  }
  function Sc(g, L) {
    var _ = -1, nt = g.length;
    for (L || (L = Array(nt)); ++_ < nt; )
      L[_] = g[_];
    return L;
  }
  function ri(g, L, _, nt) {
    _ || (_ = {});
    for (var Me = -1, Ye = L.length; ++Me < Ye; ) {
      var rr = L[Me], Ze = void 0;
      nr(_, rr, Ze === void 0 ? g[rr] : Ze);
    }
    return _;
  }
  function Ec(g, L) {
    return ri(g, Z(g), L);
  }
  function w(g) {
    return ve(g, vc, Z);
  }
  function $(g, L) {
    var _ = g.__data__;
    return Ft(L) ? _[typeof L == "string" ? "string" : "hash"] : _.map;
  }
  function D(g, L) {
    var _ = je(g, L);
    return Er(_) ? _ : void 0;
  }
  var Z = Y ? Se(Y, Object) : Wy, st = is;
  (Rt && st(new Rt(new ArrayBuffer(1))) != O || _t && st(new _t()) != y || dt && st(dt.resolve()) != E || gt && st(new gt()) != j || ee && st(new ee()) != m) && (st = function(g) {
    var L = We.call(g), _ = L == x ? g.constructor : void 0, nt = _ ? ye(_) : void 0;
    if (nt)
      switch (nt) {
        case Wt:
          return O;
        case yt:
          return y;
        case Ut:
          return E;
        case Gt:
          return j;
        case it:
          return m;
      }
    return L;
  });
  function H(g) {
    var L = g.length, _ = g.constructor(L);
    return L && typeof g[0] == "string" && Ee.call(g, "index") && (_.index = g.index, _.input = g.input), _;
  }
  function lt(g) {
    return typeof g.constructor == "function" && !rn(g) ? ae(h(g)) : {};
  }
  function ft(g, L, _, nt) {
    var Me = g.constructor;
    switch (L) {
      case k:
        return os(g);
      case a:
      case c:
        return new Me(+g);
      case O:
        return vn(g, nt);
      case K:
      case z:
      case X:
      case A:
      case T:
      case N:
      case F:
      case V:
      case G:
        return xc(g, nt);
      case y:
        return Gi(g, nt, _);
      case p:
      case R:
        return new Me(g);
      case C:
        return ni(g);
      case j:
        return mc(g, nt, _);
      case S:
        return Ki(g);
    }
  }
  function ht(g, L) {
    return L = L ?? s, !!L && (typeof g == "number" || I.test(g)) && g > -1 && g % 1 == 0 && g < L;
  }
  function Ft(g) {
    var L = typeof g;
    return L == "string" || L == "number" || L == "symbol" || L == "boolean" ? g !== "__proto__" : g === null;
  }
  function Be(g) {
    return !!te && te in g;
  }
  function rn(g) {
    var L = g && g.constructor, _ = typeof L == "function" && L.prototype || Ue;
    return g === _;
  }
  function ye(g) {
    if (g != null) {
      try {
        return oe.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function Hn(g) {
    return tt(g, !0, !0);
  }
  function Vi(g, L) {
    return g === L || g !== g && L !== L;
  }
  function Ry(g) {
    return Gy(g) && Ee.call(g, "callee") && (!f.call(g, "callee") || We.call(g) == i);
  }
  var Ac = Array.isArray;
  function xf(g) {
    return g != null && Vy(g.length) && !Sf(g);
  }
  function Gy(g) {
    return qy(g) && xf(g);
  }
  var Ky = et || Xy;
  function Sf(g) {
    var L = To(g) ? We.call(g) : "";
    return L == d || L == l;
  }
  function Vy(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= s;
  }
  function To(g) {
    var L = typeof g;
    return !!g && (L == "object" || L == "function");
  }
  function qy(g) {
    return !!g && typeof g == "object";
  }
  function vc(g) {
    return xf(g) ? ss(g) : Jt(g);
  }
  function Wy() {
    return [];
  }
  function Xy() {
    return !1;
  }
  t.exports = Hn;
})(ka, ka.exports);
var X2 = ka.exports;
const Mp = /* @__PURE__ */ s0(X2);
var wl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(wl || (wl = {}));
function Y2(t, e) {
  return { type: wl.Address, version: t, hash160: e };
}
function Z2(t) {
  return Gs.c32address(t.version, t.hash160);
}
const Q2 = (t) => E2(vp(t)), J2 = (t) => ot(Q2(t));
he.hmacSha256Sync = (t, ...e) => {
  const n = Ep.create(vp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function tx(t, e = "mainnet") {
  e = bp(e), t = typeof t == "string" ? Pt(t) : t;
  const n = p2(lr.P2PKH, e), r = Y2(n, J2(t));
  return Z2(r);
}
function ex(t, e) {
  const n = _e.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = tx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new _e.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function nx(t, e = null) {
  let n;
  e ? n = ex(t, e) : n = _e.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const md = "_blockstackDidCheckEchoReply", rx = "echoReply", sx = "authContinuation";
function ix(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function ox() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[md];
  if (typeof e == "boolean")
    return e;
  const n = ix(t.location.search), r = n[rx];
  if (r) {
    t[md] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[sx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class bl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new h0();
    else
      throw new $w("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new td(e.sessionOptions) : this.store = new td() : e ? this.store = new Jf(e.sessionOptions) : this.store = new Jf();
  }
  makeAuthRequestToken(e, n, r, s, i, o = kw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new sl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Km(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Gm();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = lu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (ox())
        return fi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      fi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Yw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Mo("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = _e.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Ym(e))
      throw new Mo("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (kc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Zf(s, i.private_key);
          } catch {
            if (fi.warn("Failed decryption of appPrivateKey, will try to use as given"), !he.isValidPrivateKey(i.private_key))
              throw new Mo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Zf(s, c);
          } catch {
            fi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Mo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Dw, d;
    kc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), kc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: gp(i.iss),
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
        l.profile = Object.assign({}, Ew);
      else {
        const x = await p.text(), E = JSON.parse(x);
        l.profile = nx(E[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new sl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), D1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), F1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
bl.prototype.makeAuthRequest = bl.prototype.makeAuthRequestToken;
const ax = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], cx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = ax(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!rc(r.id));
  return e.concat(n);
}, rc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Np = "STX_PROVIDER", ks = () => typeof window > "u" ? null : window.localStorage.getItem(Np), lx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Np, t);
}, ux = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function fx(t, e) {
  const n = {};
  return Object.assign(n, ux, e), await fetch(t, n);
}
function dx(t) {
  let e = fx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function hx(...t) {
  const { fetchLib: e, middlewares: n } = dx(t);
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
var Li;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Li || (Li = {}));
var Ls;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ls || (Ls = {}));
var xd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(xd || (xd = {}));
const px = "https://api.mainnet.hiro.so", gx = "https://api.testnet.hiro.so", yx = "http://localhost:3999", wx = ["mainnet", "testnet", "devnet", "mocknet"];
class Cs {
  constructor(e) {
    this.version = Ls.Mainnet, this.chainId = Li.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ls.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? hx();
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
Cs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ml();
    case "testnet":
      return new xl();
    case "devnet":
      return new bx();
    case "mocknet":
      return new _p();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${wx.join(", ")}`);
  }
};
Cs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Cs.fromName(t);
class ml extends Cs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? px,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ls.Mainnet, this.chainId = Li.Mainnet;
  }
}
class xl extends Cs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? gx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ls.Testnet, this.chainId = Li.Testnet;
  }
}
class _p extends Cs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? yx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ls.Testnet, this.chainId = Li.Testnet;
  }
}
const bx = _p;
var Ts;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ts || (Ts = {}));
var La;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(La || (La = {}));
Ts.Mainnet;
var Bs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Bs || (Bs = {}));
var Ms;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ms || (Ms = {}));
Bs.Mainnet;
const mx = {
  chainId: Ts.Mainnet,
  transactionVersion: Bs.Mainnet,
  peerNetworkId: La.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ms.MainnetSingleSig,
    multiSig: Ms.MainnetMultiSig
  },
  client: { baseUrl: u0 }
}, Sl = {
  chainId: Ts.Testnet,
  transactionVersion: Bs.Testnet,
  peerNetworkId: La.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ms.TestnetSingleSig,
    multiSig: Ms.TestnetMultiSig
  },
  client: { baseUrl: f0 }
}, da = {
  ...Sl,
  addressVersion: { ...Sl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: d0 }
}, xx = {
  ...da,
  addressVersion: { ...da.addressVersion },
  client: { ...da.client }
};
function Sx(t) {
  switch (t) {
    case "mainnet":
      return mx;
    case "testnet":
      return Sl;
    case "devnet":
      return da;
    case "mocknet":
      return xx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Ex(t) {
  return typeof t == "string" ? Sx(t) : t;
}
function Ax(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Sd = /* @__PURE__ */ new Map();
function Pp(t, e) {
  const n = Sd.get(t);
  if (n !== void 0)
    return n(e);
  const r = Ax(t);
  return Sd.set(t, r), Pp(t, e);
}
let Zt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Pt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Vw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Gw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return zw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ot(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ot(n);
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
    if (Pp(e, r))
      return r;
    throw n(r);
  }
};
const vx = 128, $x = 128, Up = 16, bs = 32, El = 80, sc = 65, Ix = 32, kx = 64, Ca = 34, Lx = 1 + 16 * 1024 * 1024, Cx = 165, Tx = 16, Bx = 16, Mx = 20, Nx = Bx + 2 + Mx, _x = Nx + 4, Px = Lx + (Cx + Tx * _x);
var jt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(jt || (jt = {}));
var Al;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Al || (Al = {}));
var an;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(an || (an = {}));
const _c = ["onChainOnly", "offChainOnly", "any"];
_c[0] + "", an.OnChainOnly, _c[1] + "", an.OffChainOnly, _c[2] + "", an.Any, an.OnChainOnly + "", an.OnChainOnly, an.OffChainOnly + "", an.OffChainOnly, an.Any + "", an.Any;
var Ta;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ta || (Ta = {}));
var ne;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ne || (ne = {}));
var fe;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(fe || (fe = {}));
var Xt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Xt || (Xt = {}));
var ce;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ce || (ce = {}));
var so;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(so || (so = {}));
var vl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(vl || (vl = {}));
var $l;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})($l || ($l = {}));
var Ge;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ge || (Ge = {}));
var Ed;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ed || (Ed = {}));
var Il;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Il || (Il = {}));
var Cn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Cn || (Cn = {}));
var Ad;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ad || (Ad = {}));
let ic = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, di = class extends ic {
  constructor(e) {
    super(e);
  }
}, ze = class extends ic {
  constructor(e) {
    super(e);
  }
}, Ba = class extends ic {
  constructor(e) {
    super(e);
  }
}, ds = class extends ic {
  constructor(e) {
    super(e);
  }
};
function kl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ux(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Hp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Hx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  kl(t.outputLen), kl(t.blockLen);
}
function Ox(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Dx(t, e) {
  Hp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const hs = {
  number: kl,
  bool: Ux,
  bytes: Hp,
  hash: Hx,
  exists: Ox,
  output: Dx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Fn = (t, e) => t << 32 - e | t >>> e, Fx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Fx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Tu(t) {
  if (typeof t == "string" && (t = jx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Op = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ks(t) {
  const e = (r) => t().update(Tu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Dp = class extends Op {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, hs.hash(e);
    const r = Tu(n);
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
    return hs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    hs.exists(this), hs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Fp = (t, e, n) => new Dp(t, e).update(n).digest();
Fp.create = (t, e) => new Dp(t, e);
function zx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Bu = class extends Op {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Pc(this.buffer);
  }
  update(e) {
    hs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Tu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Pc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    hs.exists(this), hs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    zx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Pc(e), c = this.outputLen;
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
const Rx = (t, e, n) => t & e ^ ~t & n, Gx = (t, e, n) => t & e ^ t & n ^ e & n, Kx = new Uint32Array([
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
]), _r = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Pr = new Uint32Array(64);
let jp = class extends Bu {
  constructor() {
    super(64, 32, 8, !1), this.A = _r[0] | 0, this.B = _r[1] | 0, this.C = _r[2] | 0, this.D = _r[3] | 0, this.E = _r[4] | 0, this.F = _r[5] | 0, this.G = _r[6] | 0, this.H = _r[7] | 0;
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
      const y = Pr[l - 15], p = Pr[l - 2], x = Fn(y, 7) ^ Fn(y, 18) ^ y >>> 3, E = Fn(p, 17) ^ Fn(p, 19) ^ p >>> 10;
      Pr[l] = E + Pr[l - 7] + x + Pr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Fn(a, 6) ^ Fn(a, 11) ^ Fn(a, 25), p = d + y + Rx(a, c, u) + Kx[l] + Pr[l] | 0, E = (Fn(r, 2) ^ Fn(r, 13) ^ Fn(r, 22)) + Gx(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Pr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Vx = class extends jp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Mu = Ks(() => new jp());
Ks(() => new Vx());
const qx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), zp = Uint8Array.from({ length: 16 }, (t, e) => e), Wx = zp.map((t) => (9 * t + 5) % 16);
let Nu = [zp], _u = [Wx];
for (let t = 0; t < 4; t++)
  for (let e of [Nu, _u])
    e.push(e[t].map((n) => qx[n]));
const Rp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Xx = Nu.map((t, e) => t.map((n) => Rp[e][n])), Yx = _u.map((t, e) => t.map((n) => Rp[e][n])), Zx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Qx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ko = (t, e) => t << e | t >>> 32 - e;
function vd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Vo = new Uint32Array(16);
let Jx = class extends Bu {
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
      Vo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = Zx[p], C = Qx[p], j = Nu[p], R = _u[p], S = Xx[p], m = Yx[p];
      for (let k = 0; k < 16; k++) {
        const O = Ko(r + vd(p, i, a, u) + Vo[j[k]] + E, S[k]) + l | 0;
        r = l, l = u, u = Ko(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = Ko(s + vd(x, o, c, d) + Vo[R[k]] + C, m[k]) + y | 0;
        s = y, y = d, d = Ko(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Vo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const tS = Ks(() => new Jx()), qo = BigInt(2 ** 32 - 1), Ll = BigInt(32);
function Gp(t, e = !1) {
  return e ? { h: Number(t & qo), l: Number(t >> Ll & qo) } : { h: Number(t >> Ll & qo) | 0, l: Number(t & qo) | 0 };
}
function eS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Gp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const nS = (t, e) => BigInt(t >>> 0) << Ll | BigInt(e >>> 0), rS = (t, e, n) => t >>> n, sS = (t, e, n) => t << 32 - n | e >>> n, iS = (t, e, n) => t >>> n | e << 32 - n, oS = (t, e, n) => t << 32 - n | e >>> n, aS = (t, e, n) => t << 64 - n | e >>> n - 32, cS = (t, e, n) => t >>> n - 32 | e << 64 - n, lS = (t, e) => e, uS = (t, e) => t, fS = (t, e, n) => t << n | e >>> 32 - n, dS = (t, e, n) => e << n | t >>> 32 - n, hS = (t, e, n) => e << n - 32 | t >>> 64 - n, pS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function gS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const yS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), wS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, bS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), mS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, xS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), SS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Et = {
  fromBig: Gp,
  split: eS,
  toBig: nS,
  shrSH: rS,
  shrSL: sS,
  rotrSH: iS,
  rotrSL: oS,
  rotrBH: aS,
  rotrBL: cS,
  rotr32H: lS,
  rotr32L: uS,
  rotlSH: fS,
  rotlSL: dS,
  rotlBH: hS,
  rotlBL: pS,
  add: gS,
  add3L: yS,
  add3H: wS,
  add4L: bS,
  add4H: mS,
  add5H: SS,
  add5L: xS
}, [ES, AS] = Et.split([
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
].map((t) => BigInt(t))), Ur = new Uint32Array(80), Hr = new Uint32Array(80);
let oc = class extends Bu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      Ur[S] = e.getUint32(n), Hr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const m = Ur[S - 15] | 0, k = Hr[S - 15] | 0, O = Et.rotrSH(m, k, 1) ^ Et.rotrSH(m, k, 8) ^ Et.shrSH(m, k, 7), K = Et.rotrSL(m, k, 1) ^ Et.rotrSL(m, k, 8) ^ Et.shrSL(m, k, 7), z = Ur[S - 2] | 0, X = Hr[S - 2] | 0, A = Et.rotrSH(z, X, 19) ^ Et.rotrBH(z, X, 61) ^ Et.shrSH(z, X, 6), T = Et.rotrSL(z, X, 19) ^ Et.rotrBL(z, X, 61) ^ Et.shrSL(z, X, 6), N = Et.add4L(K, T, Hr[S - 7], Hr[S - 16]), F = Et.add4H(N, O, A, Ur[S - 7], Ur[S - 16]);
      Ur[S] = F | 0, Hr[S] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: x, Gh: E, Gl: C, Hh: j, Hl: R } = this;
    for (let S = 0; S < 80; S++) {
      const m = Et.rotrSH(l, y, 14) ^ Et.rotrSH(l, y, 18) ^ Et.rotrBH(l, y, 41), k = Et.rotrSL(l, y, 14) ^ Et.rotrSL(l, y, 18) ^ Et.rotrBL(l, y, 41), O = l & p ^ ~l & E, K = y & x ^ ~y & C, z = Et.add5L(R, k, K, AS[S], Hr[S]), X = Et.add5H(z, j, m, O, ES[S], Ur[S]), A = z | 0, T = Et.rotrSH(r, s, 28) ^ Et.rotrBH(r, s, 34) ^ Et.rotrBH(r, s, 39), N = Et.rotrSL(r, s, 28) ^ Et.rotrBL(r, s, 34) ^ Et.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, V = s & o ^ s & c ^ o & c;
      j = E | 0, R = C | 0, E = p | 0, C = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = Et.add(u | 0, d | 0, X | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = Et.add3L(A, N, V);
      r = Et.add3H(G, X, T, F), s = G | 0;
    }
    ({ h: r, l: s } = Et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Et.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Et.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = Et.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = Et.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: j, l: R } = Et.add(this.Hh | 0, this.Hl | 0, j | 0, R | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, x, E, C, j, R);
  }
  roundClean() {
    Ur.fill(0), Hr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, vS = class extends oc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, $S = class extends oc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, IS = class extends oc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ks(() => new oc());
Ks(() => new vS());
const kS = Ks(() => new $S());
Ks(() => new IS());
var Bt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Bt || (Bt = {}));
var $e;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})($e || ($e = {}));
function Pu(t) {
  return $e[t];
}
const LS = () => ({ type: Bt.BoolTrue }), CS = () => ({ type: Bt.BoolFalse }), TS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Bt.Buffer, value: ot(t) };
}, $d = BigInt("0xffffffffffffffffffffffffffffffff"), BS = BigInt(0), Id = BigInt("0x7fffffffffffffffffffffffffffffff"), kd = BigInt("-170141183460469231731687303715884105728"), MS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ol(Pt(t))), en(t, Uint8Array) && (t = ol(t));
  const e = De(t);
  if (e > Id)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Id}`);
  if (e < kd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${kd}`);
  return { type: Bt.Int, value: e };
}, NS = (t) => {
  const e = De(t);
  if (e < BS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > $d)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${$d}`);
  return { type: Bt.UInt, value: e };
};
function _S(t) {
  return { type: Bt.List, value: t };
}
function Kp() {
  return { type: Bt.OptionalNone };
}
function Vp(t) {
  return { type: Bt.OptionalSome, value: t };
}
var J;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(J || (J = {}));
function PS() {
  return {
    type: J.Address,
    version: Ms.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Ld(t) {
  if (t && eg(t, Ca))
    throw new Error(`Memo exceeds maximum length of ${Ca} bytes`);
  return { type: J.MemoString, content: t };
}
function Uu(t, e) {
  return {
    type: J.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Cl(t) {
  if (Pt(t).byteLength != sc)
    throw Error("Invalid signature");
  return {
    type: J.MessageSignature,
    data: t
  };
}
function US(t, e, n) {
  return typeof t == "string" && (t = QS(t)), typeof n == "string" && (n = Ld(n)), {
    type: J.Payload,
    payloadType: jt.TokenTransfer,
    recipient: t,
    amount: De(e),
    memo: n ?? Ld("")
  };
}
function HS(t, e, n, r) {
  return typeof e == "string" && (e = Mn(e)), typeof n == "string" && (n = Mn(n)), {
    type: J.Payload,
    payloadType: jt.ContractCall,
    contractAddress: typeof t == "string" ? ns(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function OS(t) {
  return Mn(t, 4, 1e5);
}
function Cd(t, e, n) {
  return typeof t == "string" && (t = Mn(t)), typeof e == "string" && (e = OS(e)), typeof n == "number" ? {
    type: J.Payload,
    payloadType: jt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: J.Payload,
    payloadType: jt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function DS() {
  return { type: J.Payload, payloadType: jt.PoisonMicroblock };
}
function Td(t, e) {
  if (t.byteLength != bs)
    throw Error(`Coinbase buffer size must be ${bs} bytes`);
  return e != null ? {
    type: J.Payload,
    payloadType: jt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: J.Payload,
    payloadType: jt.Coinbase,
    coinbaseBytes: t
  };
}
function FS(t, e, n) {
  if (t.byteLength != bs)
    throw Error(`Coinbase buffer size must be ${bs} bytes`);
  if (n.byteLength != El)
    throw Error(`VRF proof buffer size must be ${El} bytes`);
  return {
    type: J.Payload,
    payloadType: jt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Bt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function jS(t, e, n, r, s, i, o) {
  return {
    type: J.Payload,
    payloadType: jt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Mn(t, e, n) {
  const r = e || 1, s = n || vx;
  if (eg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: J.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function zS(t, e, n) {
  return {
    type: J.Asset,
    address: ns(t),
    contractName: Mn(e),
    assetName: Mn(n)
  };
}
function ns(t) {
  const e = Gs.c32addressDecode(t);
  return {
    type: J.Address,
    version: e[0],
    hash160: e[1]
  };
}
function RS(t, e) {
  const n = ns(t), r = Mn(e);
  return {
    type: J.Principal,
    prefix: Ge.Contract,
    address: n,
    contractName: r
  };
}
function GS(t) {
  const e = ns(t);
  return {
    type: J.Principal,
    prefix: Ge.Standard,
    address: e
  };
}
function hi(t, e) {
  return {
    pubKeyEncoding: t,
    type: J.TransactionAuthField,
    contents: e
  };
}
function ar(t) {
  switch (t.type) {
    case J.Address:
      return ko(t);
    case J.Principal:
      return qp(t);
    case J.LengthPrefixedString:
      return Ti(t);
    case J.MemoString:
      return VS(t);
    case J.Asset:
      return Xp(t);
    case J.PostCondition:
      return Zp(t);
    case J.PublicKey:
      return Ml(t);
    case J.LengthPrefixedList:
      return Hu(t);
    case J.Payload:
      return Qp(t);
    case J.TransactionAuthField:
      return ZS(t);
    case J.MessageSignature:
      return Ou(t);
  }
}
function ko(t) {
  const e = [];
  return e.push(Pt(So(t.version, 1))), e.push(Pt(t.hash160)), be(e);
}
function Ci(t) {
  const e = en(t, Zt) ? t : new Zt(t), n = Ka(ot(e.readBytes(1))), r = ot(e.readBytes(20));
  return { type: J.Address, version: n, hash160: r };
}
function qp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Ge.Standard || t.prefix === Ge.Contract) && e.push(ko(t.address)), t.prefix === Ge.Contract && e.push(Ti(t.contractName)), be(e);
}
function KS(t) {
  const e = en(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Ge, (i) => {
    throw new ze(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Ge.Origin)
    return { type: J.Principal, prefix: n };
  const r = Ci(e);
  if (n === Ge.Standard)
    return { type: J.Principal, prefix: n, address: r };
  const s = xn(e);
  return {
    type: J.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Ti(t) {
  const e = [], n = Fs(t.content), r = n.byteLength;
  return e.push(Pt(So(r, t.lengthPrefixBytes))), e.push(n), be(e);
}
function xn(t, e, n) {
  e = e || 1;
  const r = en(t, Zt) ? t : new Zt(t), s = Ka(ot(r.readBytes(e))), i = Eo(r.readBytes(s));
  return Mn(i, e, n ?? 128);
}
function VS(t) {
  const e = [], n = Fs(t.content), r = x3(ot(n), Ca * 2);
  return e.push(Pt(r)), be(e);
}
function Wp(t) {
  const e = en(t, Zt) ? t : new Zt(t);
  let n = Eo(e.readBytes(Ca));
  return n = n.replace(/\u0000*$/, ""), { type: J.MemoString, content: n };
}
function Xp(t) {
  const e = [];
  return e.push(ko(t.address)), e.push(Ti(t.contractName)), e.push(Ti(t.assetName)), be(e);
}
function Tl(t) {
  const e = en(t, Zt) ? t : new Zt(t);
  return {
    type: J.Asset,
    address: Ci(e),
    contractName: xn(e),
    assetName: xn(e)
  };
}
function Hu(t) {
  const e = t.values, n = [];
  n.push(Pt(So(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(ar(r));
  return be(n);
}
function Yp(t, e, n) {
  const r = en(t, Zt) ? t : new Zt(t), s = Ka(ot(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case J.Address:
        i.push(Ci(r));
        break;
      case J.LengthPrefixedString:
        i.push(xn(r));
        break;
      case J.MemoString:
        i.push(Wp(r));
        break;
      case J.Asset:
        i.push(Tl(r));
        break;
      case J.PostCondition:
        i.push(WS(r));
        break;
      case J.PublicKey:
        i.push(Nl(r));
        break;
      case J.TransactionAuthField:
        i.push(YS(r));
        break;
    }
  return Uu(i, n);
}
function qS(t) {
  return ot(Zp(t));
}
function Zp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(qp(t.principal)), (t.conditionType === ne.Fungible || t.conditionType === ne.NonFungible) && e.push(Xp(t.asset)), t.conditionType === ne.NonFungible && e.push(qn(t.assetName)), e.push(t.conditionCode), t.conditionType === ne.STX || t.conditionType === ne.Fungible || t.conditionType === ne.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new di("The post-condition amount may not be larger than 8 bytes");
    e.push(ts(t.amount, 8));
  }
  return be(e);
}
function WS(t) {
  const e = en(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(ne, (a) => {
    throw new ze(`Could not read ${a} as PostConditionType`);
  }), r = KS(e);
  let s, i, o;
  switch (n) {
    case ne.STX:
      return s = e.readUInt8Enum(so, (c) => {
        throw new ze(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ot(e.readBytes(8))}`), {
        type: J.PostCondition,
        conditionType: ne.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ne.Fungible:
      return i = Tl(e), s = e.readUInt8Enum(so, (c) => {
        throw new ze(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ot(e.readBytes(8))}`), {
        type: J.PostCondition,
        conditionType: ne.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case ne.NonFungible:
      i = Tl(e);
      const a = Gn(e);
      return s = e.readUInt8Enum(vl, (c) => {
        throw new ze(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: J.PostCondition,
        conditionType: ne.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case ne.Staking:
      return s = e.readUInt8Enum(so, (c) => {
        throw new ze(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ot(e.readBytes(8))}`), {
        type: J.PostCondition,
        conditionType: ne.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ne.PoX: {
      const c = e.readUInt8Enum($l, (u) => {
        throw new ze(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: J.PostCondition,
        conditionType: ne.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Qp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case jt.TokenTransfer:
      e.push(qn(t.recipient)), e.push(ts(t.amount, 8)), e.push(ar(t.memo));
      break;
    case jt.ContractCall:
      e.push(ar(t.contractAddress)), e.push(ar(t.contractName)), e.push(ar(t.functionName));
      const n = new Uint8Array(4);
      Es(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(qn(r));
      });
      break;
    case jt.SmartContract:
      e.push(ar(t.contractName)), e.push(ar(t.codeBody));
      break;
    case jt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(ar(t.contractName)), e.push(ar(t.codeBody));
      break;
    case jt.PoisonMicroblock:
      break;
    case jt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case jt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(qn(t.recipient));
      break;
    case jt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(qn(t.recipient ? Vp(t.recipient) : Kp())), e.push(t.vrfProof);
      break;
    case jt.TenureChange:
      e.push(Pt(t.tenureHash)), e.push(Pt(t.previousTenureHash)), e.push(Pt(t.burnViewHash)), e.push(Pt(t.previousTenureEnd)), e.push(Es(new Uint8Array(4), t.previousTenureBlocks)), e.push(Kw(new Uint8Array(1), t.cause)), e.push(Pt(t.publicKeyHash));
      break;
  }
  return be(e);
}
function XS(t) {
  const e = en(t, Zt) ? t : new Zt(t);
  switch (e.readUInt8Enum(jt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case jt.TokenTransfer:
      const r = Gn(e), s = De(e.readBytes(8)), i = Wp(e);
      return US(r, s, i);
    case jt.ContractCall:
      const o = Ci(e), a = xn(e), c = xn(e), u = [], d = e.readUInt32BE();
      for (let m = 0; m < d; m++) {
        const k = Gn(e);
        u.push(k);
      }
      return HS(o, a, c, u);
    case jt.SmartContract:
      const l = xn(e), y = xn(e, 4, 1e5);
      return Cd(l, y);
    case jt.VersionedSmartContract: {
      const m = e.readUInt8Enum(Al, (K) => {
        throw new Error(`Cannot recognize ClarityVersion: ${K}`);
      }), k = xn(e), O = xn(e, 4, Px);
      return Cd(k, O, m);
    }
    case jt.PoisonMicroblock:
      return DS();
    case jt.Coinbase: {
      const m = e.readBytes(bs);
      return Td(m);
    }
    case jt.CoinbaseToAltRecipient: {
      const m = e.readBytes(bs), k = Gn(e);
      return Td(m, k);
    }
    case jt.NakamotoCoinbase: {
      const m = e.readBytes(bs), k = Gn(e), O = e.readBytes(El);
      return FS(m, k, O);
    }
    case jt.TenureChange:
      const p = ot(e.readBytes(20)), x = ot(e.readBytes(20)), E = ot(e.readBytes(20)), C = ot(e.readBytes(32)), j = e.readUInt32BE(), R = e.readUInt8Enum(Il, (m) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${m}`);
      }), S = ot(e.readBytes(20));
      return jS(p, x, E, C, j, R, S);
  }
}
function Bl(t) {
  const e = en(t, Zt) ? t : new Zt(t);
  return Cl(ot(e.readBytes(sc)));
}
function YS(t) {
  const e = en(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Cn, (r) => {
    throw new ze(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Cn.PublicKeyCompressed:
      return hi(ce.Compressed, Nl(e));
    case Cn.PublicKeyUncompressed:
      return hi(ce.Uncompressed, Oi(B3(Nl(e).data)));
    case Cn.SignatureCompressed:
      return hi(ce.Compressed, Bl(e));
    case Cn.SignatureUncompressed:
      return hi(ce.Uncompressed, Bl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Ou(t) {
  return Pt(t.data);
}
function ZS(t) {
  const e = [];
  switch (t.contents.type) {
    case J.PublicKey:
      e.push(t.pubKeyEncoding === ce.Compressed ? Cn.PublicKeyCompressed : Cn.PublicKeyUncompressed), e.push(Pt(T3(t.contents.data)));
      break;
    case J.MessageSignature:
      e.push(t.pubKeyEncoding === ce.Compressed ? Cn.SignatureCompressed : Cn.SignatureUncompressed), e.push(Ou(t.contents));
      break;
  }
  return be(e);
}
function Ml(t) {
  return t.data.slice();
}
function Nl(t) {
  const e = en(t, Zt) ? t : new Zt(t), n = e.readUInt8(), r = n === 4 ? kx : Ix;
  return Oi(be([n, e.readBytes(r)]));
}
function Du(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Xt.P2PKH || e === Xt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Xt.P2WPKH || e === Xt.P2WSH || e === Xt.P2WSHNonSequential) && !r.map((s) => s.data).every(Di))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Xt.P2PKH:
      return Wo(t, S3(r[0].data));
    case Xt.P2WPKH:
      return Wo(t, E3(r[0].data));
    case Xt.P2SH:
    case Xt.P2SHNonSequential:
      return Wo(t, A3(n, r.map(Ml)));
    case Xt.P2WSH:
    case Xt.P2WSHNonSequential:
      return Wo(t, v3(n, r.map(Ml)));
  }
}
function Wo(t, e) {
  return { type: J.Address, version: t, hash160: e };
}
function Fu(t) {
  return Gs.c32address(t.version, t.hash160);
}
function Bd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return zS(e, n, r);
}
function Yi(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return RS(e, n);
  } else
    return GS(t);
}
function QS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return e3(e, n);
  } else
    return JS(t);
}
function JS(t) {
  const e = ns(t);
  return { type: Bt.PrincipalStandard, value: Fu(e) };
}
function t3(t) {
  return { type: Bt.PrincipalStandard, value: Fu(t) };
}
function e3(t, e) {
  const n = ns(t), r = Mn(e);
  return Jp(n, r);
}
function Jp(t, e) {
  if (Fs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Bt.PrincipalContract,
    value: `${Fu(t)}.${e.content}`
  };
}
function n3(t) {
  return { type: Bt.ResponseErr, value: t };
}
function r3(t) {
  return { type: Bt.ResponseOk, value: t };
}
const s3 = (t) => ({ type: Bt.StringASCII, value: t }), i3 = (t) => ({ type: Bt.StringUTF8, value: t });
function o3(t) {
  for (const e in t)
    if (!$3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Bt.Tuple, value: t };
}
function Gn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Zt(Pt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Zt(t) : e = t;
  switch (e.readUInt8Enum($e, (r) => {
    throw new ze(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case $e.int:
      return MS(ol(e.readBytes(16)));
    case $e.uint:
      return NS(e.readBytes(16));
    case $e.buffer:
      const r = e.readUInt32BE();
      return TS(e.readBytes(r));
    case $e.true:
      return LS();
    case $e.false:
      return CS();
    case $e.address:
      const s = Ci(e);
      return t3(s);
    case $e.contract:
      const i = Ci(e), o = xn(e);
      return Jp(i, o);
    case $e.ok:
      return r3(Gn(e));
    case $e.err:
      return n3(Gn(e));
    case $e.none:
      return Kp();
    case $e.some:
      return Vp(Gn(e));
    case $e.list:
      const a = e.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(Gn(e));
      return _S(c);
    case $e.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let E = 0; E < u; E++) {
        const C = xn(e).content;
        if (C === void 0)
          throw new ze('"content" is undefined');
        d[C] = Gn(e);
      }
      return o3(d);
    case $e.ascii:
      const l = e.readUInt32BE(), y = Hw(e.readBytes(l));
      return s3(y);
    case $e.utf8:
      const p = e.readUInt32BE(), x = Eo(e.readBytes(p));
      return i3(x);
    default:
      throw new ze("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Qn(t, e) {
  return be([Pu(t), e]);
}
function a3(t) {
  return new Uint8Array([Pu(t.type)]);
}
function c3(t) {
  return t.type === Bt.OptionalNone ? new Uint8Array([Pu(t.type)]) : Qn(t.type, qn(t.value));
}
function l3(t) {
  const e = new Uint8Array(4);
  return Es(e, Math.ceil(t.value.length / 2), 0), Qn(t.type, Yn(e, Pt(t.value)));
}
function u3(t) {
  const e = uu(Mw(BigInt(t.value), BigInt($x)), Up);
  return Qn(t.type, e);
}
function f3(t) {
  const e = uu(BigInt(t.value), Up);
  return Qn(t.type, e);
}
function d3(t) {
  return Qn(t.type, ko(ns(t.value)));
}
function h3(t) {
  const [e, n] = I3(t.value);
  return Qn(t.type, Yn(ko(ns(e)), Ti(Mn(n))));
}
function p3(t) {
  return Qn(t.type, qn(t.value));
}
function g3(t) {
  const e = [], n = new Uint8Array(4);
  Es(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = qn(r);
    e.push(s);
  }
  return Qn(t.type, be(e));
}
function y3(t) {
  const e = [], n = new Uint8Array(4);
  Es(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Mn(s);
    e.push(Ti(i));
    const o = qn(t.value[s]);
    e.push(o);
  }
  return Qn(t.type, be(e));
}
function tg(t, e) {
  const n = [], r = e == "ascii" ? Uw(t.value) : Fs(t.value), s = new Uint8Array(4);
  return Es(s, r.length, 0), n.push(s), n.push(r), Qn(t.type, be(n));
}
function w3(t) {
  return tg(t, "ascii");
}
function b3(t) {
  return tg(t, "utf8");
}
function Md(t) {
  return ot(qn(t));
}
function qn(t) {
  switch (t.type) {
    case Bt.BoolTrue:
    case Bt.BoolFalse:
      return a3(t);
    case Bt.OptionalNone:
    case Bt.OptionalSome:
      return c3(t);
    case Bt.Buffer:
      return l3(t);
    case Bt.UInt:
      return f3(t);
    case Bt.Int:
      return u3(t);
    case Bt.PrincipalStandard:
      return d3(t);
    case Bt.PrincipalContract:
      return h3(t);
    case Bt.ResponseOk:
    case Bt.ResponseErr:
      return p3(t);
    case Bt.List:
      return g3(t);
    case Bt.Tuple:
      return y3(t);
    case Bt.StringASCII:
      return w3(t);
    case Bt.StringUTF8:
      return b3(t);
    default:
      throw new di("Unable to serialize. Invalid Clarity Value.");
  }
}
const m3 = (t) => t.length % 2 ? `0${t}` : t, x3 = (t, e) => t.padEnd(e, "0"), eg = (t, e) => t ? Fs(t).length > e : !1;
function _l(t) {
  return Mp(t);
}
const lo = (t) => tS(Mu(t)), ju = (t) => ot(kS(t)), S3 = (t) => ot(lo(t)), E3 = (t) => {
  const e = lo(t), n = Yn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = lo(n);
  return ot(r);
}, A3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = be(n), s = lo(r);
  return ot(s);
}, v3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = be(n), s = Mu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = be(i), a = lo(o);
  return ot(a);
};
function $3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function I3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
he.hmacSha256Sync = (t, ...e) => {
  const n = Fp.create(Mu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Oi(t) {
  return t = typeof t == "string" ? Pt(t) : t, {
    type: J.PublicKey,
    data: t
  };
}
function k3(t, e, n = ce.Compressed) {
  const r = jw(e), s = new fn(Mf(r.r), Mf(r.s)), i = It.fromSignature(t, s, r.recoveryId), o = n === ce.Compressed;
  return i.toHex(o);
}
function L3(t) {
  return typeof t == "string" ? t : ot(t);
}
const zu = L3;
function ng(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Fw;
}
function Di(t) {
  return !zu(t).startsWith("04");
}
function C3(t) {
  t = fu(t);
  const e = ng(t);
  return ot(Ao(t.slice(0, 32), e));
}
function T3(t) {
  return It.fromHex(zu(t)).toHex(!0);
}
function B3(t) {
  return It.fromHex(zu(t)).toHex(!1);
}
function M3(t, e) {
  t = fu(t);
  const [n, r] = qa(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return So(r, 1) + fn.fromHex(n).toCompactHex();
}
function Ru() {
  return {
    type: J.MessageSignature,
    data: ot(new Uint8Array(sc))
  };
}
function rg(t, e, n, r) {
  const s = Du(0, t, 1, [Oi(e)]).hash160, i = Di(e) ? ce.Compressed : ce.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: De(n),
    fee: De(r),
    keyEncoding: i,
    signature: Ru()
  };
}
function uo(t) {
  return "signature" in t;
}
function Nd(t) {
  return t === Xt.P2SH || t === Xt.P2WSH;
}
function N3(t) {
  return t === Xt.P2SHNonSequential || t === Xt.P2WSHNonSequential;
}
function _d(t) {
  const e = _l(t);
  return e.nonce = 0, e.fee = 0, uo(e) ? e.signature = Ru() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function _3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    ts(t.nonce, 8),
    ts(t.fee, 8),
    t.keyEncoding,
    Ou(t.signature)
  ];
  return be(e);
}
function P3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    ts(t.nonce, 8),
    ts(t.fee, 8)
  ], n = Uu(t.fields);
  e.push(Hu(n));
  const r = new Uint8Array(2);
  return Rw(r, t.signaturesRequired, 0), e.push(r), be(e);
}
function U3(t, e) {
  const n = ot(e.readBytes(20)), r = BigInt(`0x${ot(e.readBytes(8))}`), s = BigInt(`0x${ot(e.readBytes(8))}`), i = e.readUInt8Enum(ce, (a) => {
    throw new ze(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Xt.P2WPKH && i != ce.Compressed)
    throw new ze("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Bl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function H3(t, e) {
  const n = ot(e.readBytes(20)), r = BigInt("0x" + ot(e.readBytes(8))), s = BigInt("0x" + ot(e.readBytes(8))), i = Yp(e, J.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case J.PublicKey:
        Di(u.contents.data) || (o = !0);
        break;
      case J.MessageSignature:
        if (u.pubKeyEncoding === ce.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ds("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Xt.P2WSH || t === Xt.P2WSHNonSequential))
    throw new ds("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Uc(t) {
  return uo(t) ? _3(t) : P3(t);
}
function Hc(t) {
  const e = t.readUInt8Enum(Xt, (n) => {
    throw new ze(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Xt.P2PKH || e === Xt.P2WPKH ? U3(e, t) : H3(e, t);
}
function sg(t, e, n, r) {
  const i = t + ot(new Uint8Array([e])) + ot(ts(n, 8)) + ot(ts(r, 8));
  if (Pt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ju(Pt(i));
}
function ig(t, e, n) {
  const r = 33 + sc, s = Di(e.data) ? ce.Compressed : ce.Uncompressed, i = t + m3(s.toString(16)) + n, o = Pt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return ju(o);
}
function O3(t, e, n, r, s) {
  const i = sg(t, e, n, r), o = M3(s, i), a = Oi(C3(s)), c = ig(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function og(t, e, n, r, s, i) {
  const o = sg(t, e, n, r), a = Oi(k3(o, i, s)), c = ig(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function D3() {
  const t = rg(Xt.P2PKH, "", 0, 0);
  return t.signer = PS().hash160, t.keyEncoding = ce.Compressed, t.signature = Ru(), t;
}
function Pd(t, e, n) {
  return uo(t) ? F3(t, e, n) : j3(t, e, n);
}
function F3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = og(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Du(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ds(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function j3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case J.PublicKey:
        Di(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case J.MessageSignature:
        c.pubKeyEncoding === ce.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = og(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Nd(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new ds("Too many signatures");
        break;
    }
  if (Nd(t.hashMode) && o !== t.signaturesRequired || N3(t.hashMode) && o < t.signaturesRequired)
    throw new ds("Incorrect number of signatures");
  if (i && (t.hashMode === Xt.P2WSH || t.hashMode === Xt.P2WSHNonSequential))
    throw new ds("Uncompressed keys are not allowed in this hash mode");
  const a = Du(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ds(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ag(t) {
  return {
    authType: fe.Standard,
    spendingCondition: t
  };
}
function cg(t, e) {
  return {
    authType: fe.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || rg(Xt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Ud(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case fe.Standard:
        return ag(_d(t.spendingCondition));
      case fe.Sponsored:
        return cg(_d(t.spendingCondition), D3());
      default:
        throw new Ba("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function z3(t, e) {
  switch (t.authType) {
    case fe.Standard:
      return Pd(t.spendingCondition, e, fe.Standard);
    case fe.Sponsored:
      return Pd(t.spendingCondition, e, fe.Standard);
    default:
      throw new Ba("Invalid origin auth type");
  }
}
function R3(t, e) {
  switch (t.authType) {
    case fe.Standard:
      const n = {
        ...t.spendingCondition,
        fee: De(e)
      };
      return { ...t, spendingCondition: n };
    case fe.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: De(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function G3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: De(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function K3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: De(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function V3(t, e) {
  const n = {
    ...e,
    nonce: De(e.nonce),
    fee: De(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function q3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case fe.Standard:
      e.push(Uc(t.spendingCondition));
      break;
    case fe.Sponsored:
      e.push(Uc(t.spendingCondition)), e.push(Uc(t.sponsorSpendingCondition));
      break;
  }
  return be(e);
}
function W3(t) {
  const e = t.readUInt8Enum(fe, (r) => {
    throw new ze(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case fe.Standard:
      return n = Hc(t), ag(n);
    case fe.Sponsored:
      n = Hc(t);
      const r = Hc(t);
      return cg(n, r);
  }
}
class X3 {
  constructor({ auth: e, payload: n, postConditions: r = Uu([]), postConditionMode: s = Ta.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Ex(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: De(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = an.Any;
  }
  signBegin() {
    const e = _l(this);
    return e.auth = Ud(e.auth), e.txid();
  }
  verifyBegin() {
    const e = _l(this);
    return e.auth = Ud(e.auth), e.txid();
  }
  verifyOrigin() {
    return z3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, fe.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === fe.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, fe.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Oi(e), r = this.auth.spendingCondition;
    if (r && !uo(r)) {
      const s = Di(n.data);
      r.fields.push(hi(s ? ce.Compressed : ce.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = O3(n, r, e.fee, e.nonce, s);
    if (uo(e))
      e.signature = Cl(i);
    else {
      const a = ng(s);
      e.fields.push(hi(a ? ce.Compressed : ce.Uncompressed, Cl(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return ju(e);
  }
  setSponsor(e) {
    if (this.auth.authType != fe.Sponsored)
      throw new Ba("Cannot sponsor sign a non-sponsored transaction");
    this.auth = V3(this.auth, e);
  }
  setFee(e) {
    this.auth = R3(this.auth, e);
  }
  setNonce(e) {
    this.auth = G3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != fe.Sponsored)
      throw new Ba("Cannot sponsor sign a non-sponsored transaction");
    this.auth = K3(this.auth, e);
  }
  serialize() {
    return ot(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new di('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new di('"chainId" is undefined');
    if (this.auth === void 0)
      throw new di('"auth" is undefined');
    if (this.payload === void 0)
      throw new di('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Es(n, this.chainId, 0), e.push(n), e.push(q3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Hu(this.postConditions)), e.push(Qp(this.payload)), be(e);
  }
}
function Y3(t) {
  const e = en(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Bs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = W3(e), i = e.readUInt8Enum(an, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Ta, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Yp(e, J.PostCondition), c = XS(e), u = new X3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Hd = BigInt("18446744073709551615");
function Oc(t) {
  const e = De(t);
  if (e < 0n || e > Hd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Hd} (u64 max), received: ${e}`);
  return e;
}
var Pl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Pl || (Pl = {}));
var Ul;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Ul || (Ul = {}));
function Z3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: J.PostCondition,
        conditionType: ne.STX,
        principal: t.address === "origin" ? { type: J.Principal, prefix: Ge.Origin } : Yi(t.address),
        conditionCode: Xo(t.condition),
        amount: Oc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: J.PostCondition,
        conditionType: ne.Fungible,
        principal: t.address === "origin" ? { type: J.Principal, prefix: Ge.Origin } : Yi(t.address),
        conditionCode: Xo(t.condition),
        amount: Oc(t.amount),
        asset: Bd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: J.PostCondition,
        conditionType: ne.NonFungible,
        principal: t.address === "origin" ? { type: J.Principal, prefix: Ge.Origin } : Yi(t.address),
        conditionCode: Xo(t.condition),
        asset: Bd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: J.PostCondition,
        conditionType: ne.Staking,
        principal: t.address === "origin" ? { type: J.Principal, prefix: Ge.Origin } : Yi(t.address),
        conditionCode: Xo(t.condition),
        amount: Oc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: J.PostCondition,
        conditionType: ne.PoX,
        principal: t.address === "origin" ? { type: J.Principal, prefix: Ge.Origin } : Yi(t.address),
        conditionCode: Q3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Xo(t) {
  return Pl[t];
}
function Q3(t) {
  return Ul[t];
}
function lg(t) {
  const e = Z3(t);
  return qS(e);
}
function J3(t, e, n) {
  return Ku(ug(t), n);
}
function ug(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = fo(r);
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
    return BigInt(`0x${nE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Gu(t, e = 8) {
  return (typeof t == "bigint" ? t : ug(t)).toString(16).padStart(e * 2, "0");
}
function Ku(t, e = 16) {
  const n = Gu(t, e);
  return fo(n);
}
function tE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const eE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += eE[n];
  return e;
}
function fo(t) {
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
function Vu(t) {
  return new TextEncoder().encode(t);
}
function rE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function sE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Od(t) {
  if (t.some(sE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function qu(...t) {
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
function pr(t) {
  return qu(...t.map((e) => typeof e == "number" ? Od([e]) : e instanceof Array ? Od(e) : e));
}
function ac(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Hl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Hl || (Hl = {}));
Hl.Mainnet;
const iE = 128, oE = 128, fg = 16;
var Ol;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ol || (Ol = {}));
var Dd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Dd || (Dd = {}));
var Fd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Fd || (Fd = {}));
var Ln;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ln || (Ln = {}));
const Dc = ["onChainOnly", "offChainOnly", "any"];
Dc[0] + "", Ln.OnChainOnly, Dc[1] + "", Ln.OffChainOnly, Dc[2] + "", Ln.Any, Ln.OnChainOnly + "", Ln.OnChainOnly, Ln.OffChainOnly + "", Ln.OffChainOnly, Ln.Any + "", Ln.Any;
var Dl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Dl || (Dl = {}));
Dl.Mainnet;
var jd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(jd || (jd = {}));
var cs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(cs || (cs = {}));
var zd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(zd || (zd = {}));
var Rd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Rd || (Rd = {}));
var Gd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Gd || (Gd = {}));
var Kd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Kd || (Kd = {}));
var Vd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Vd || (Vd = {}));
var qd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(qd || (qd = {}));
var Fl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Fl || (Fl = {}));
var Wd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Wd || (Wd = {}));
var Xd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Xd || (Xd = {}));
function jl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function aE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function dg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function cE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  jl(t.outputLen), jl(t.blockLen);
}
function lE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function uE(t, e) {
  dg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Fc = {
  number: jl,
  bool: aE,
  bytes: dg,
  hash: cE,
  exists: lE,
  output: uE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), jn = (t, e) => t << 32 - e | t >>> e, fE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!fE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function dE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hg(t) {
  if (typeof t == "string" && (t = dE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let hE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Vs(t) {
  const e = (r) => t().update(hg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function pE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Wu = class extends hE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jc(this.buffer);
  }
  update(e) {
    Fc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hg(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = jc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Fc.exists(this), Fc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    pE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = jc(e), c = this.outputLen;
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
const gE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), pg = Uint8Array.from({ length: 16 }, (t, e) => e), yE = pg.map((t) => (9 * t + 5) % 16);
let Xu = [pg], Yu = [yE];
for (let t = 0; t < 4; t++)
  for (let e of [Xu, Yu])
    e.push(e[t].map((n) => gE[n]));
const gg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), wE = Xu.map((t, e) => t.map((n) => gg[e][n])), bE = Yu.map((t, e) => t.map((n) => gg[e][n])), mE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), xE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Yo = (t, e) => t << e | t >>> 32 - e;
function Yd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Zo = new Uint32Array(16);
let SE = class extends Wu {
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
      Zo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = mE[p], C = xE[p], j = Xu[p], R = Yu[p], S = wE[p], m = bE[p];
      for (let k = 0; k < 16; k++) {
        const O = Yo(r + Yd(p, i, a, u) + Zo[j[k]] + E, S[k]) + l | 0;
        r = l, l = u, u = Yo(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = Yo(s + Yd(x, o, c, d) + Zo[R[k]] + C, m[k]) + y | 0;
        s = y, y = d, d = Yo(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Zo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Vs(() => new SE());
const EE = (t, e, n) => t & e ^ ~t & n, AE = (t, e, n) => t & e ^ t & n ^ e & n, vE = new Uint32Array([
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
]), Or = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Dr = new Uint32Array(64);
let yg = class extends Wu {
  constructor() {
    super(64, 32, 8, !1), this.A = Or[0] | 0, this.B = Or[1] | 0, this.C = Or[2] | 0, this.D = Or[3] | 0, this.E = Or[4] | 0, this.F = Or[5] | 0, this.G = Or[6] | 0, this.H = Or[7] | 0;
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
      const y = Dr[l - 15], p = Dr[l - 2], x = jn(y, 7) ^ jn(y, 18) ^ y >>> 3, E = jn(p, 17) ^ jn(p, 19) ^ p >>> 10;
      Dr[l] = E + Dr[l - 7] + x + Dr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = jn(a, 6) ^ jn(a, 11) ^ jn(a, 25), p = d + y + EE(a, c, u) + vE[l] + Dr[l] | 0, E = (jn(r, 2) ^ jn(r, 13) ^ jn(r, 22)) + AE(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Dr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, $E = class extends yg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Vs(() => new yg());
Vs(() => new $E());
const Qo = BigInt(2 ** 32 - 1), zl = BigInt(32);
function wg(t, e = !1) {
  return e ? { h: Number(t & Qo), l: Number(t >> zl & Qo) } : { h: Number(t >> zl & Qo) | 0, l: Number(t & Qo) | 0 };
}
function IE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = wg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const kE = (t, e) => BigInt(t >>> 0) << zl | BigInt(e >>> 0), LE = (t, e, n) => t >>> n, CE = (t, e, n) => t << 32 - n | e >>> n, TE = (t, e, n) => t >>> n | e << 32 - n, BE = (t, e, n) => t << 32 - n | e >>> n, ME = (t, e, n) => t << 64 - n | e >>> n - 32, NE = (t, e, n) => t >>> n - 32 | e << 64 - n, _E = (t, e) => e, PE = (t, e) => t, UE = (t, e, n) => t << n | e >>> 32 - n, HE = (t, e, n) => e << n | t >>> 32 - n, OE = (t, e, n) => e << n - 32 | t >>> 64 - n, DE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function FE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const jE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), zE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, RE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), GE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, KE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), VE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, At = {
  fromBig: wg,
  split: IE,
  toBig: kE,
  shrSH: LE,
  shrSL: CE,
  rotrSH: TE,
  rotrSL: BE,
  rotrBH: ME,
  rotrBL: NE,
  rotr32H: _E,
  rotr32L: PE,
  rotlSH: UE,
  rotlSL: HE,
  rotlBH: OE,
  rotlBL: DE,
  add: FE,
  add3L: jE,
  add3H: zE,
  add4L: RE,
  add4H: GE,
  add5H: VE,
  add5L: KE
}, [qE, WE] = At.split([
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
].map((t) => BigInt(t))), Fr = new Uint32Array(80), jr = new Uint32Array(80);
let cc = class extends Wu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      Fr[S] = e.getUint32(n), jr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const m = Fr[S - 15] | 0, k = jr[S - 15] | 0, O = At.rotrSH(m, k, 1) ^ At.rotrSH(m, k, 8) ^ At.shrSH(m, k, 7), K = At.rotrSL(m, k, 1) ^ At.rotrSL(m, k, 8) ^ At.shrSL(m, k, 7), z = Fr[S - 2] | 0, X = jr[S - 2] | 0, A = At.rotrSH(z, X, 19) ^ At.rotrBH(z, X, 61) ^ At.shrSH(z, X, 6), T = At.rotrSL(z, X, 19) ^ At.rotrBL(z, X, 61) ^ At.shrSL(z, X, 6), N = At.add4L(K, T, jr[S - 7], jr[S - 16]), F = At.add4H(N, O, A, Fr[S - 7], Fr[S - 16]);
      Fr[S] = F | 0, jr[S] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: x, Gh: E, Gl: C, Hh: j, Hl: R } = this;
    for (let S = 0; S < 80; S++) {
      const m = At.rotrSH(l, y, 14) ^ At.rotrSH(l, y, 18) ^ At.rotrBH(l, y, 41), k = At.rotrSL(l, y, 14) ^ At.rotrSL(l, y, 18) ^ At.rotrBL(l, y, 41), O = l & p ^ ~l & E, K = y & x ^ ~y & C, z = At.add5L(R, k, K, WE[S], jr[S]), X = At.add5H(z, j, m, O, qE[S], Fr[S]), A = z | 0, T = At.rotrSH(r, s, 28) ^ At.rotrBH(r, s, 34) ^ At.rotrBH(r, s, 39), N = At.rotrSL(r, s, 28) ^ At.rotrBL(r, s, 34) ^ At.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, V = s & o ^ s & c ^ o & c;
      j = E | 0, R = C | 0, E = p | 0, C = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = At.add(u | 0, d | 0, X | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = At.add3L(A, N, V);
      r = At.add3H(G, X, T, F), s = G | 0;
    }
    ({ h: r, l: s } = At.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = At.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = At.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = At.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = At.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = At.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = At.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: j, l: R } = At.add(this.Hh | 0, this.Hl | 0, j | 0, R | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, x, E, C, j, R);
  }
  roundClean() {
    Fr.fill(0), jr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, XE = class extends cc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, YE = class extends cc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ZE = class extends cc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Vs(() => new cc());
Vs(() => new XE());
Vs(() => new YE());
Vs(() => new ZE());
function QE(t, e, n) {
  const s = iE;
  if (pA(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ol.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ce;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ce || (Ce = {}));
let JE = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, bg = class extends JE {
  constructor(e) {
    super(e);
  }
};
function lc(t) {
  const e = [];
  return e.push(fo(Gu(t.version, 1))), e.push(fo(t.hash160)), pr(e);
}
function tA(t) {
  const e = [];
  return e.push(t.prefix), e.push(lc(t.address)), t.prefix === Fl.Contract && e.push(ho(t.contractName)), pr(e);
}
function ho(t) {
  const e = [], n = Vu(t.content), r = n.byteLength;
  return e.push(fo(Gu(r, t.lengthPrefixBytes))), e.push(n), pr(e);
}
function eA(t) {
  const e = [];
  return e.push(lc(t.address)), e.push(ho(t.contractName)), e.push(ho(t.assetName)), pr(e);
}
function mg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(tA(t.principal)), (t.conditionType === cs.Fungible || t.conditionType === cs.NonFungible) && e.push(eA(t.assetInfo)), t.conditionType === cs.NonFungible && e.push(Ns(t.assetName)), e.push(t.conditionCode), t.conditionType === cs.STX || t.conditionType === cs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new bg("The post-condition amount may not be larger than 8 bytes");
    e.push(J3(t.amount, !1, 8));
  }
  return pr(e);
}
function Jn(t, e) {
  return pr([t, e]);
}
function nA(t) {
  return new Uint8Array([t.type]);
}
function rA(t) {
  return t.type === Ce.OptionalNone ? new Uint8Array([t.type]) : Jn(t.type, Ns(t.value));
}
function sA(t) {
  const e = new Uint8Array(4);
  return ac(e, t.buffer.length, 0), Jn(t.type, qu(e, t.buffer));
}
function iA(t) {
  const e = Ku(tE(t.value, BigInt(oE)), fg);
  return Jn(t.type, e);
}
function oA(t) {
  const e = Ku(t.value, fg);
  return Jn(t.type, e);
}
function aA(t) {
  return Jn(t.type, lc(t.address));
}
function cA(t) {
  return Jn(t.type, qu(lc(t.address), ho(t.contractName)));
}
function lA(t) {
  return Jn(t.type, Ns(t.value));
}
function uA(t) {
  const e = [], n = new Uint8Array(4);
  ac(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ns(r);
    e.push(s);
  }
  return Jn(t.type, pr(e));
}
function fA(t) {
  const e = [], n = new Uint8Array(4);
  ac(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = QE(s);
    e.push(ho(i));
    const o = Ns(t.data[s]);
    e.push(o);
  }
  return Jn(t.type, pr(e));
}
function xg(t, e) {
  const n = [], r = e == "ascii" ? rE(t.data) : Vu(t.data), s = new Uint8Array(4);
  return ac(s, r.length, 0), n.push(s), n.push(r), Jn(t.type, pr(n));
}
function dA(t) {
  return xg(t, "ascii");
}
function hA(t) {
  return xg(t, "utf8");
}
function Ns(t) {
  switch (t.type) {
    case Ce.BoolTrue:
    case Ce.BoolFalse:
      return nA(t);
    case Ce.OptionalNone:
    case Ce.OptionalSome:
      return rA(t);
    case Ce.Buffer:
      return sA(t);
    case Ce.UInt:
      return oA(t);
    case Ce.Int:
      return iA(t);
    case Ce.PrincipalStandard:
      return aA(t);
    case Ce.PrincipalContract:
      return cA(t);
    case Ce.ResponseOk:
    case Ce.ResponseErr:
      return lA(t);
    case Ce.List:
      return uA(t);
    case Ce.Tuple:
      return fA(t);
    case Ce.StringASCII:
      return dA(t);
    case Ce.StringUTF8:
      return hA(t);
    default:
      throw new bg("Unable to serialize. Invalid Clarity Value.");
  }
}
const pA = (t, e) => t ? Vu(t).length > e : !1, gA = "connect-ui";
let ha, Sg, cn = !1, Rl = !1;
const hr = (t, e = "") => () => {
}, yA = (t, e) => () => {
}, wA = "{visibility:hidden}.hydrated{visibility:inherit}", Zd = {}, bA = "http://www.w3.org/2000/svg", mA = "http://www.w3.org/1999/xhtml", xA = (t) => t != null, Zu = (t) => (t = typeof t, t === "object" || t === "function");
function Eg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const bt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Zu(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Gl(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Gl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Gl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, SA = {}, EA = (t) => t && t.$tag$ === SA, AA = (t, e) => t != null && !Zu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, vA = (t) => Fi(t).$hostElement$, $A = (t, e, n) => {
  const r = He.ce(e, n);
  return t.dispatchEvent(r), r;
}, Qd = /* @__PURE__ */ new WeakMap(), IA = (t, e, n) => {
  let r = Ma.get(t);
  VA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ma.set(t, r);
}, kA = (t, e, n, r) => {
  var s;
  let i = Ag(e);
  const o = Ma.get(i);
  if (t = t.nodeType === 11 ? t : Wn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Qd.get(t), c;
      if (a || Qd.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Wn.createElement("style"), c.innerHTML = o;
          const u = (s = He.$nonce$) !== null && s !== void 0 ? s : Eg(Wn);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, LA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = hr("attachStyles", e.$tagName$), i = kA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Ag = (t, e) => "sc-" + t.$tagName$, Jd = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = eh(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = th(n), d = th(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : eh(uc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && He.rel(t, e, n, !1), r && He.ael(t, e, r, !1);
    else {
      const c = Zu(r);
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
}, CA = /\s/, th = (t) => t ? t.split(CA) : [], vg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Zd, o = e.$attrs$ || Zd;
  for (r in i)
    r in o || Jd(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Jd(s, r, i[r], o[r], n, e.$flags$);
}, Qu = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Wn.createTextNode(s.$text$);
  else {
    if (cn || (cn = s.$tag$ === "svg"), o = s.$elm$ = Wn.createElementNS(cn ? bA : mA, s.$tag$), cn && s.$tag$ === "foreignObject" && (cn = !1), vg(null, s, cn), xA(ha) && o["s-si"] !== ha && o.classList.add(o["s-si"] = ha), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Qu(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? cn = !1 : o.tagName === "foreignObject" && (cn = !0);
  }
  return o;
}, $g = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Sg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Qu(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Ig = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, TA = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : Jo(a, d) ? (Ji(a, d), a = e[++s], d = r[++i]) : Jo(c, l) ? (Ji(c, l), c = e[--o], l = r[--u]) : Jo(a, l) ? (Ji(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Jo(c, d) ? (Ji(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (y = Qu(e && e[i], n, i), d = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? $g(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Ig(e, s, o);
}, Jo = (t, e) => t.$tag$ === e.$tag$, Ji = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (cn = i === "svg" ? !0 : i === "foreignObject" ? !1 : cn, vg(t, e, cn), r !== null && s !== null ? TA(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), $g(n, null, e, s, 0, s.length - 1)) : r !== null && Ig(r, 0, r.length - 1), cn && i === "svg" && (cn = !1)) : t.$text$ !== o && (n.data = o);
}, BA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Gl(null, null), s = EA(e) ? e : bt(null, null, e);
  Sg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, ha = n["s-sc"], Ji(r, s);
}, kg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Ju = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return kg(t, t.$ancestorComponent$), WA(() => MA(t, e));
}, MA = (t, e) => {
  const n = hr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), UA(s, () => NA(t, r, e));
}, NA = async (t, e, n) => {
  const r = t.$hostElement$, s = hr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && LA(t);
  const o = hr("render", t.$cmpMeta$.$tagName$);
  _A(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => PA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, _A = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, BA(t, e);
  } catch (r) {
    po(r, t.$hostElement$);
  }
  return null;
}, PA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = hr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Cg(n), r(), t.$onReadyResolve$(n), s || Lg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && ef(() => Ju(t, !1)), t.$flags$ &= -517;
}, Lg = (t) => {
  Cg(Wn.documentElement), ef(() => $A(uc, "appload", { detail: { namespace: gA } }));
}, UA = (t, e) => t && t.then ? t.then(e) : e(), Cg = (t) => t.classList.add("hydrated"), HA = (t, e) => Fi(t).$instanceValues$.get(e), OA = (t, e, n, r) => {
  const s = Fi(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = AA(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Ju(s, !1));
}, Tg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return HA(this, i);
        },
        set(a) {
          OA(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        He.jmp(() => {
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
}, DA = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = KA(n), s.then) {
        const c = yA();
        s = await s, c();
      }
      s.isProxied || (Tg(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = hr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        po(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Ag(n);
      if (!Ma.has(c)) {
        const u = hr("registerStyles", n.$tagName$);
        IA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Ju(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, FA = (t) => {
  if (!(He.$flags$ & 1)) {
    const e = Fi(t), n = e.$cmpMeta$, r = hr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            kg(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), DA(t, e, n);
    }
    r();
  }
}, jA = (t) => {
  He.$flags$ & 1 || Fi(t);
}, zA = (t, e = {}) => {
  var n;
  const r = hr(), s = [], i = e.exclude || [], o = uc.customElements, a = Wn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Wn.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(He, e), He.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Wn.baseURI).href, t.map((p) => {
    p[1].map((x) => {
      const E = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      E.$members$ = x[2];
      const C = E.$tagName$, j = class extends HTMLElement {
        // StencilLazyHost
        constructor(R) {
          super(R), R = this, GA(R, E), E.$flags$ & 1 && R.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : He.jmp(() => FA(this));
        }
        disconnectedCallback() {
          He.jmp(() => jA(this));
        }
        componentOnReady() {
          return Fi(this).$onReadyPromise$;
        }
      };
      E.$lazyBundleId$ = p[0], !i.includes(C) && !o.get(C) && (s.push(C), o.define(C, Tg(
        j,
        E,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + wA, u.setAttribute("data-styles", "");
    const p = (n = He.$nonce$) !== null && n !== void 0 ? n : Eg(Wn);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((p) => p.connectedCallback()) : He.jmp(() => l = setTimeout(Lg, 30)), r();
}, tf = /* @__PURE__ */ new WeakMap(), Fi = (t) => tf.get(t), RA = (t, e) => tf.set(e.$lazyInstance$ = t, e), GA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], tf.set(t, n);
}, eh = (t, e) => e in t, po = (t, e) => (0, console.error)(t, e), zc = /* @__PURE__ */ new Map(), KA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = zc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (zc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => p$).then(o, po);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (zc.set(s, o), o[r]), po);
}, Ma = /* @__PURE__ */ new Map(), uc = typeof window < "u" ? window : {}, Wn = uc.document || { head: {} }, He = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Bg = (t) => Promise.resolve(t), VA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), nh = [], Mg = [], qA = (t, e) => (n) => {
  t.push(n), Rl || (Rl = !0, He.$flags$ & 4 ? ef(Kl) : He.raf(Kl));
}, rh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      po(n);
    }
  t.length = 0;
}, Kl = () => {
  rh(nh), rh(Mg), (Rl = nh.length > 0) && He.raf(Kl);
}, ef = (t) => Bg().then(t), WA = /* @__PURE__ */ qA(Mg), XA = () => Bg(), YA = (t, e) => typeof window > "u" ? Promise.resolve() : XA().then(() => zA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var ZA = Object.defineProperty, QA = Object.defineProperties, JA = Object.getOwnPropertyDescriptors, Na = Object.getOwnPropertySymbols, Ng = Object.prototype.hasOwnProperty, _g = Object.prototype.propertyIsEnumerable, sh = (t, e, n) => e in t ? ZA(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, hn = (t, e) => {
  for (var n in e || (e = {})) Ng.call(e, n) && sh(t, n, e[n]);
  if (Na) for (var n of Na(e)) _g.call(e, n) && sh(t, n, e[n]);
  return t;
}, Nn = (t, e) => QA(t, JA(e)), Pg = (t, e) => {
  var n = {};
  for (var r in t) Ng.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Na) for (var r of Na(t)) e.indexOf(r) < 0 && _g.call(t, r) && (n[r] = t[r]);
  return n;
};
function Ug() {
  return rc(ks()) || window.StacksProvider || window.BlockstackProvider;
}
function fc(t) {
  return t ? typeof t == "string" ? Cs.fromName(t) : "version" in t ? t : "url" in t ? new ml({ url: t.url }) : t.transactionVersion === Bs.Mainnet ? new ml({ url: t.client.baseUrl }) : new xl({ url: t.client.baseUrl }) : new xl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var t4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(t4 || {}), e4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(e4 || {}), nf = (t) => {
  let e = t;
  if (!e) {
    let n = new h0(["store_write"], document.location.href);
    e = new bl({ appConfig: n });
  }
  return e;
};
function Hg(t) {
  try {
    return nf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Og = (t) => {
  let e = nf(t).loadUserData().appPrivateKey, n = _e.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function n4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Ts.Mainnet]: "mainnet", [Ts.Testnet]: "testnet" }, a = fc(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function r4(t) {
  let e = fc(t.network), n = nf(t.userSession), r = Nn(hn({}, t), { network: e, userSession: n });
  return hn({ stxAddress: n4(r) }, r);
}
async function s4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(lg) : n = n.map((r) => ot(mg(r)))), new _e.TokenSigner("ES256k", e).signAsync(Nn(hn({}, t), { postConditions: n }));
}
function i4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(lg) : e = e.map((n) => ot(mg(n)))), _e.createUnsecuredToken(Nn(hn({}, t), { postConditions: e }));
}
var o4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Pt(a.replace(/^0x/, "")), u = Y3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Nn(hn({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Nn(hn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, a4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Pg(e, ["amount", "appDetails", "userSession"]);
  if (Hg(s)) {
    let { privateKey: a, publicKey: c } = Og(s), u = Nn(hn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), s4(u, a);
  }
  let o = Nn(hn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), i4(o);
};
async function c4(t, e, n) {
  let r = await e(Nn(hn(hn({}, r4(t)), t), { network: fc(t.network) }));
  return o4({ token: r, options: t }, n);
}
function l4(t, e = Ug()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return c4(t, a4, e);
}
function Dg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Nn(hn({}, t), { message: Md(e), domain: Md(n) }) : Nn(hn({}, t), { message: ot(Ns(e)), domain: ot(Ns(n)) });
}
async function u4(t, e) {
  return new _e.TokenSigner("ES256k", e).signAsync(Dg(t));
}
async function f4(t) {
  let e = t, { userSession: n } = e, r = Pg(e, ["userSession"]);
  if (Hg(n)) {
    let { privateKey: s, publicKey: i } = Og(n), o = Nn(hn({}, r), { publicKey: i });
    return u4(o, s);
  }
  return _e.createUnsecuredToken(Dg(t));
}
var d4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(d4 || {}), Fg = "asigna-stx", ih = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Fg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(p4(t, e), "*");
}), h4 = { authenticationRequest: async (t) => ih(t, "authenticationRequest"), transactionRequest: async (t) => ih(t, "transactionRequest") }, p4 = (t, e) => ({ source: Fg, [e]: t }), g4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = h4);
};
g4();
var y4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function w4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = ks(), o = Ug();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    YA();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : y4, c = cx(a), u = document.createElement("connect-modal");
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
var ta = w4(l4);
function es(t, e, n) {
  return rf(Ve(t, e), n);
}
function Ve(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = se(r);
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
      const r = x4(BigInt(`0x${Ct(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Ct(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function oh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Lo(t, e = 8) {
  return (typeof t == "bigint" ? t : Ve(t, !1)).toString(16).padStart(e * 2, "0");
}
function dc(t) {
  return parseInt(t, 16);
}
function rf(t, e = 16) {
  const n = Lo(t, e);
  return se(n);
}
function b4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function m4(t, e) {
  return t & BigInt(1) << e;
}
function x4(t, e) {
  return m4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const S4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ct(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += S4[n];
  return e;
}
function se(t) {
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
function ji(t) {
  return new TextEncoder().encode(t);
}
function sf(t) {
  return new TextDecoder().decode(t);
}
function jg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function E4(t) {
  return String.fromCharCode.apply(null, t);
}
function A4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ah(t) {
  if (t.some(A4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function hc(...t) {
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
function me(t) {
  return hc(...t.map((e) => typeof e == "number" ? ah([e]) : e instanceof Array ? ah(e) : e));
}
var ch;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ch || (ch = {}));
var lh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(lh || (lh = {}));
var uh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(uh || (uh = {}));
const zg = 33, Rc = 32;
function v4(t) {
  if (t.length < Rc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Rc * 2), r = t.slice(2 + Rc * 2);
  return {
    recoveryId: dc(e),
    r: n,
    s: r
  };
}
function $4(t) {
  const e = typeof t == "string" ? se(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function I4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function k4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function L4(t, e) {
  return t[e];
}
function C4(t, e, n = 0) {
  return t[n] = e, t;
}
function T4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function _s(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Vl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Vl || (Vl = {}));
const B4 = Vl.Mainnet, M4 = 128, N4 = 128, Rg = 16, ms = 32, ql = 80, pc = 65, _4 = 32, P4 = 64, _a = 34;
var rt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(rt || (rt = {}));
var $t;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})($t || ($t = {}));
var Wl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Wl || (Wl = {}));
var Je;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Je || (Je = {}));
const pa = ["onChainOnly", "offChainOnly", "any"], fh = {
  [pa[0]]: Je.OnChainOnly,
  [pa[1]]: Je.OffChainOnly,
  [pa[2]]: Je.Any,
  [Je.OnChainOnly]: Je.OnChainOnly,
  [Je.OffChainOnly]: Je.OffChainOnly,
  [Je.Any]: Je.Any
};
function U4(t) {
  if (t in fh)
    return fh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${pa.join(", ")}`);
}
var Pa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pa || (Pa = {}));
Pa.Mainnet;
var Bi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Bi || (Bi = {}));
var tn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(tn || (tn = {}));
var de;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(de || (de = {}));
var Yt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Yt || (Yt = {}));
var Ua;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ua || (Ua = {}));
var le;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(le || (le = {}));
var go;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(go || (go = {}));
var Xl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Xl || (Xl = {}));
var yo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yo || (yo = {}));
var dh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(dh || (dh = {}));
var hh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(hh || (hh = {}));
function Yl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function H4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Gg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function O4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Yl(t.outputLen), Yl(t.blockLen);
}
function D4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function F4(t, e) {
  Gg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ps = {
  number: Yl,
  bool: H4,
  bytes: Gg,
  hash: O4,
  exists: D4,
  output: F4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Gc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), zn = (t, e) => t << 32 - e | t >>> e, j4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!j4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function of(t) {
  if (typeof t == "string" && (t = z4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Kg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function qs(t) {
  const e = (r) => t().update(of(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function R4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class af extends Kg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Gc(this.buffer);
  }
  update(e) {
    ps.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = of(e);
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
    ps.exists(this), ps.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    R4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
}
const G4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Vg = Uint8Array.from({ length: 16 }, (t, e) => e), K4 = Vg.map((t) => (9 * t + 5) % 16);
let cf = [Vg], lf = [K4];
for (let t = 0; t < 4; t++)
  for (let e of [cf, lf])
    e.push(e[t].map((n) => G4[n]));
const qg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), V4 = cf.map((t, e) => t.map((n) => qg[e][n])), q4 = lf.map((t, e) => t.map((n) => qg[e][n])), W4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), X4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ea = (t, e) => t << e | t >>> 32 - e;
function ph(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const na = new Uint32Array(16);
class Y4 extends af {
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
      const x = 4 - p, E = W4[p], C = X4[p], j = cf[p], R = lf[p], S = V4[p], m = q4[p];
      for (let k = 0; k < 16; k++) {
        const O = ea(r + ph(p, i, a, u) + na[j[k]] + E, S[k]) + l | 0;
        r = l, l = u, u = ea(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = ea(s + ph(x, o, c, d) + na[R[k]] + C, m[k]) + y | 0;
        s = y, y = d, d = ea(c, 10) | 0, c = o, o = O;
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
}
const Z4 = qs(() => new Y4()), Q4 = (t, e, n) => t & e ^ ~t & n, J4 = (t, e, n) => t & e ^ t & n ^ e & n, t8 = new Uint32Array([
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
]), zr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rr = new Uint32Array(64);
class Wg extends af {
  constructor() {
    super(64, 32, 8, !1), this.A = zr[0] | 0, this.B = zr[1] | 0, this.C = zr[2] | 0, this.D = zr[3] | 0, this.E = zr[4] | 0, this.F = zr[5] | 0, this.G = zr[6] | 0, this.H = zr[7] | 0;
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
      Rr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Rr[l - 15], p = Rr[l - 2], x = zn(y, 7) ^ zn(y, 18) ^ y >>> 3, E = zn(p, 17) ^ zn(p, 19) ^ p >>> 10;
      Rr[l] = E + Rr[l - 7] + x + Rr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = zn(a, 6) ^ zn(a, 11) ^ zn(a, 25), p = d + y + Q4(a, c, u) + t8[l] + Rr[l] | 0, E = (zn(r, 2) ^ zn(r, 13) ^ zn(r, 22)) + J4(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Rr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class e8 extends Wg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const uf = qs(() => new Wg());
qs(() => new e8());
const ra = BigInt(2 ** 32 - 1), Zl = BigInt(32);
function Xg(t, e = !1) {
  return e ? { h: Number(t & ra), l: Number(t >> Zl & ra) } : { h: Number(t >> Zl & ra) | 0, l: Number(t & ra) | 0 };
}
function n8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Xg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const r8 = (t, e) => BigInt(t >>> 0) << Zl | BigInt(e >>> 0), s8 = (t, e, n) => t >>> n, i8 = (t, e, n) => t << 32 - n | e >>> n, o8 = (t, e, n) => t >>> n | e << 32 - n, a8 = (t, e, n) => t << 32 - n | e >>> n, c8 = (t, e, n) => t << 64 - n | e >>> n - 32, l8 = (t, e, n) => t >>> n - 32 | e << 64 - n, u8 = (t, e) => e, f8 = (t, e) => t, d8 = (t, e, n) => t << n | e >>> 32 - n, h8 = (t, e, n) => e << n | t >>> 32 - n, p8 = (t, e, n) => e << n - 32 | t >>> 64 - n, g8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function y8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const w8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), b8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, m8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), x8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, S8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), E8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, vt = {
  fromBig: Xg,
  split: n8,
  toBig: r8,
  shrSH: s8,
  shrSL: i8,
  rotrSH: o8,
  rotrSL: a8,
  rotrBH: c8,
  rotrBL: l8,
  rotr32H: u8,
  rotr32L: f8,
  rotlSH: d8,
  rotlSL: h8,
  rotlBH: p8,
  rotlBL: g8,
  add: y8,
  add3L: w8,
  add3H: b8,
  add4L: m8,
  add4H: x8,
  add5H: E8,
  add5L: S8
}, [A8, v8] = vt.split([
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
].map((t) => BigInt(t))), Gr = new Uint32Array(80), Kr = new Uint32Array(80);
class gc extends af {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      Gr[S] = e.getUint32(n), Kr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const m = Gr[S - 15] | 0, k = Kr[S - 15] | 0, O = vt.rotrSH(m, k, 1) ^ vt.rotrSH(m, k, 8) ^ vt.shrSH(m, k, 7), K = vt.rotrSL(m, k, 1) ^ vt.rotrSL(m, k, 8) ^ vt.shrSL(m, k, 7), z = Gr[S - 2] | 0, X = Kr[S - 2] | 0, A = vt.rotrSH(z, X, 19) ^ vt.rotrBH(z, X, 61) ^ vt.shrSH(z, X, 6), T = vt.rotrSL(z, X, 19) ^ vt.rotrBL(z, X, 61) ^ vt.shrSL(z, X, 6), N = vt.add4L(K, T, Kr[S - 7], Kr[S - 16]), F = vt.add4H(N, O, A, Gr[S - 7], Gr[S - 16]);
      Gr[S] = F | 0, Kr[S] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: x, Gh: E, Gl: C, Hh: j, Hl: R } = this;
    for (let S = 0; S < 80; S++) {
      const m = vt.rotrSH(l, y, 14) ^ vt.rotrSH(l, y, 18) ^ vt.rotrBH(l, y, 41), k = vt.rotrSL(l, y, 14) ^ vt.rotrSL(l, y, 18) ^ vt.rotrBL(l, y, 41), O = l & p ^ ~l & E, K = y & x ^ ~y & C, z = vt.add5L(R, k, K, v8[S], Kr[S]), X = vt.add5H(z, j, m, O, A8[S], Gr[S]), A = z | 0, T = vt.rotrSH(r, s, 28) ^ vt.rotrBH(r, s, 34) ^ vt.rotrBH(r, s, 39), N = vt.rotrSL(r, s, 28) ^ vt.rotrBL(r, s, 34) ^ vt.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, V = s & o ^ s & c ^ o & c;
      j = E | 0, R = C | 0, E = p | 0, C = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = vt.add(u | 0, d | 0, X | 0, A | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = vt.add3L(A, N, V);
      r = vt.add3H(G, X, T, F), s = G | 0;
    }
    ({ h: r, l: s } = vt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = vt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = vt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = vt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = vt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = vt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = vt.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: j, l: R } = vt.add(this.Hh | 0, this.Hl | 0, j | 0, R | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, x, E, C, j, R);
  }
  roundClean() {
    Gr.fill(0), Kr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class $8 extends gc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class I8 extends gc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class k8 extends gc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
qs(() => new gc());
qs(() => new $8());
const L8 = qs(() => new I8());
qs(() => new k8());
function Yg(t) {
  if (se(t).byteLength != pc)
    throw Error("Invalid signature");
  return {
    type: rt.MessageSignature,
    data: t
  };
}
function to(t, e) {
  return { type: rt.Address, version: t, hash160: e };
}
function pi(t) {
  return Gs.c32address(t.version, t.hash160);
}
function Ps(t, e, n) {
  const r = e || 1, s = n || M4;
  if (hy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: rt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function ff(t) {
  const e = Gs.c32addressDecode(t);
  return {
    type: rt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var W;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(W || (W = {}));
function C8(t) {
  if (t.type === W.PrincipalStandard)
    return pi(t.address);
  if (t.type === W.PrincipalContract)
    return `${pi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Zg(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return M8(e, n);
  } else
    return T8(t);
}
function T8(t) {
  const e = ff(t);
  return { type: W.PrincipalStandard, address: e };
}
function B8(t) {
  return { type: W.PrincipalStandard, address: t };
}
function M8(t, e) {
  const n = ff(t), r = Ps(e);
  return Qg(n, r);
}
function Qg(t, e) {
  if (ji(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: W.PrincipalContract, address: t, contractName: e };
}
function Kc(t, e = !1) {
  switch (t.type) {
    case W.BoolTrue:
      return !0;
    case W.BoolFalse:
      return !1;
    case W.Int:
    case W.UInt:
      return e ? t.value.toString() : t.value;
    case W.Buffer:
      return `0x${Ct(t.buffer)}`;
    case W.OptionalNone:
      return null;
    case W.OptionalSome:
      return Kn(t.value);
    case W.ResponseErr:
      return Kn(t.value);
    case W.ResponseOk:
      return Kn(t.value);
    case W.PrincipalStandard:
    case W.PrincipalContract:
      return C8(t);
    case W.List:
      return t.list.map((r) => Kn(r));
    case W.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Kn(t.data[r]);
      }), n;
    case W.StringASCII:
      return t.data;
    case W.StringUTF8:
      return t.data;
  }
}
function Kn(t) {
  switch (t.type) {
    case W.ResponseErr:
      return { type: Wr(t), value: Kc(t, !0), success: !1 };
    case W.ResponseOk:
      return { type: Wr(t), value: Kc(t, !0), success: !0 };
    default:
      return { type: Wr(t), value: Kc(t, !0) };
  }
}
function Wr(t) {
  switch (t.type) {
    case W.BoolTrue:
    case W.BoolFalse:
      return "bool";
    case W.Int:
      return "int";
    case W.UInt:
      return "uint";
    case W.Buffer:
      return `(buff ${t.buffer.length})`;
    case W.OptionalNone:
      return "(optional none)";
    case W.OptionalSome:
      return `(optional ${Wr(t.value)})`;
    case W.ResponseErr:
      return `(response UnknownType ${Wr(t.value)})`;
    case W.ResponseOk:
      return `(response ${Wr(t.value)} UnknownType)`;
    case W.PrincipalStandard:
    case W.PrincipalContract:
      return "principal";
    case W.List:
      return `(list ${t.list.length} ${t.list.length ? Wr(t.list[0]) : "UnknownType"})`;
    case W.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Wr(t.data[e])})`).join(" ")})`;
    case W.StringASCII:
      return `(string-ascii ${jg(t.data).length})`;
    case W.StringUTF8:
      return `(string-utf8 ${ji(t.data).length})`;
  }
}
const Jg = () => ({ type: W.BoolTrue }), ty = () => ({ type: W.BoolFalse }), N8 = (t) => t ? Jg() : ty(), gh = BigInt("0xffffffffffffffffffffffffffffffff"), _8 = BigInt(0), yh = BigInt("0x7fffffffffffffffffffffffffffffff"), wh = BigInt("-170141183460469231731687303715884105728"), P8 = (t) => {
  const e = Ve(t, !0);
  if (e > yh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${yh}`);
  if (e < wh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${wh}`);
  return { type: W.Int, value: e };
}, Xn = (t) => {
  const e = Ve(t, !1);
  if (e < _8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > gh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${gh}`);
  return { type: W.UInt, value: e };
}, ey = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: W.Buffer, buffer: t };
};
function ny() {
  return { type: W.OptionalNone };
}
function ry(t) {
  return { type: W.OptionalSome, value: t };
}
function U8(t) {
  return { type: W.ResponseErr, value: t };
}
function H8(t) {
  return { type: W.ResponseOk, value: t };
}
function O8(t) {
  return { type: W.List, list: t };
}
function Us(t) {
  for (const e in t)
    if (!kv(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: W.Tuple, data: t };
}
const Ne = (t) => ({ type: W.StringASCII, data: t }), D8 = (t) => ({ type: W.StringUTF8, data: t });
class sy extends Kg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ps.hash(e);
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
    return ps.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ps.exists(this), ps.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const iy = (t, e, n) => new sy(t, e).update(n).digest();
iy.create = (t, e) => new sy(t, e);
he.hmacSha256Sync = (t, ...e) => {
  const n = iy.create(uf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Mi(t) {
  return {
    type: rt.PublicKey,
    data: se(t)
  };
}
function F8(t, e, n = le.Compressed) {
  const r = v4(e.data), s = new fn(oh(r.r), oh(r.s)), i = It.fromSignature(t, s, r.recoveryId), o = n === le.Compressed;
  return i.toHex(o);
}
function j8(t) {
  return { type: rt.PublicKey, data: t };
}
function zi(t) {
  return !Ct(t.data).startsWith("04");
}
function Ha(t) {
  return t.data.slice();
}
function z8(t) {
  const e = K8(t), n = Ao(e.data.slice(0, 32), e.compressed);
  return Mi(Ct(n));
}
function R8(t) {
  const e = typeof t == "string" ? t : Ct(t), n = It.fromHex(e).toHex(!0);
  return Mi(n);
}
function G8(t) {
  const e = typeof t == "string" ? t : Ct(t), n = It.fromHex(e).toHex(!1);
  return Mi(n);
}
function Ql(t) {
  const e = t.readUInt8(), n = e === 4 ? P4 : _4;
  return j8(me([e, t.readBytes(n)]));
}
function K8(t) {
  const e = $4(t), n = e.length == zg;
  return { data: e, compressed: n };
}
function V8(t, e) {
  const [n, r] = qa(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Lo(r, 1) + fn.fromHex(n).toCompactHex();
  return Yg(i);
}
function q8(t) {
  return z8(t.data);
}
function W8(t, e, n) {
  return typeof t == "string" && (t = Zg(t)), typeof n == "string" && (n = xh(n)), {
    type: rt.Payload,
    payloadType: $t.TokenTransfer,
    recipient: t,
    amount: Ve(e, !1),
    memo: n ?? xh("")
  };
}
function X8(t, e, n, r) {
  return typeof t == "string" && (t = ff(t)), typeof e == "string" && (e = Ps(e)), typeof n == "string" && (n = Ps(n)), {
    type: rt.Payload,
    payloadType: $t.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function bh(t, e, n) {
  return typeof t == "string" && (t = Ps(t)), typeof e == "string" && (e = sv(e)), typeof n == "number" ? {
    type: rt.Payload,
    payloadType: $t.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: rt.Payload,
    payloadType: $t.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Y8() {
  return { type: rt.Payload, payloadType: $t.PoisonMicroblock };
}
function mh(t, e) {
  if (t.byteLength != ms)
    throw Error(`Coinbase buffer size must be ${ms} bytes`);
  return e != null ? {
    type: rt.Payload,
    payloadType: $t.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: rt.Payload,
    payloadType: $t.Coinbase,
    coinbaseBytes: t
  };
}
function Z8(t, e, n) {
  if (t.byteLength != ms)
    throw Error(`Coinbase buffer size must be ${ms} bytes`);
  if (n.byteLength != ql)
    throw Error(`VRF proof buffer size must be ${ql} bytes`);
  return {
    type: rt.Payload,
    payloadType: $t.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === W.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Jl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Jl || (Jl = {}));
function Q8(t, e, n, r, s, i, o) {
  return {
    type: rt.Payload,
    payloadType: $t.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function oy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case $t.TokenTransfer:
      e.push(we(t.recipient)), e.push(es(t.amount, !1, 8)), e.push(cr(t.memo));
      break;
    case $t.ContractCall:
      e.push(cr(t.contractAddress)), e.push(cr(t.contractName)), e.push(cr(t.functionName));
      const n = new Uint8Array(4);
      _s(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(we(r));
      });
      break;
    case $t.SmartContract:
      e.push(cr(t.contractName)), e.push(cr(t.codeBody));
      break;
    case $t.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(cr(t.contractName)), e.push(cr(t.codeBody));
      break;
    case $t.PoisonMicroblock:
      break;
    case $t.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case $t.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(we(t.recipient));
      break;
    case $t.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(we(t.recipient ? ry(t.recipient) : ny())), e.push(t.vrfProof);
      break;
    case $t.TenureChange:
      e.push(se(t.tenureHash)), e.push(se(t.previousTenureHash)), e.push(se(t.burnViewHash)), e.push(se(t.previousTenureEnd)), e.push(_s(new Uint8Array(4), t.previousTenureBlocks)), e.push(C4(new Uint8Array(1), t.cause)), e.push(se(t.publicKeyHash));
      break;
  }
  return me(e);
}
function J8(t) {
  switch (t.readUInt8Enum($t, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case $t.TokenTransfer:
      const n = En(t), r = Ve(t.readBytes(8), !1), s = cy(t);
      return W8(n, r, s);
    case $t.ContractCall:
      const i = Ni(t), o = Sn(t), a = Sn(t), c = [], u = t.readUInt32BE();
      for (let S = 0; S < u; S++) {
        const m = En(t);
        c.push(m);
      }
      return X8(i, o, a, c);
    case $t.SmartContract:
      const d = Sn(t), l = Sn(t, 4, 1e5);
      return bh(d, l);
    case $t.VersionedSmartContract: {
      const S = t.readUInt8Enum(Wl, (O) => {
        throw new Error(`Cannot recognize ClarityVersion: ${O}`);
      }), m = Sn(t), k = Sn(t, 4, 1e5);
      return bh(m, k, S);
    }
    case $t.PoisonMicroblock:
      return Y8();
    case $t.Coinbase: {
      const S = t.readBytes(ms);
      return mh(S);
    }
    case $t.CoinbaseToAltRecipient: {
      const S = t.readBytes(ms), m = En(t);
      return mh(S, m);
    }
    case $t.NakamotoCoinbase: {
      const S = t.readBytes(ms), m = En(t), k = t.readBytes(ql);
      return Z8(S, m, k);
    }
    case $t.TenureChange:
      const y = Ct(t.readBytes(20)), p = Ct(t.readBytes(20)), x = Ct(t.readBytes(20)), E = Ct(t.readBytes(32)), C = t.readUInt32BE(), j = t.readUInt8Enum(Jl, (S) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${S}`);
      }), R = Ct(t.readBytes(20));
      return Q8(y, p, x, E, C, j, R);
  }
}
class yc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ls extends yc {
  constructor(e) {
    super(e);
  }
}
class un extends yc {
  constructor(e) {
    super(e);
  }
}
class Oa extends yc {
  constructor(e) {
    super(e);
  }
}
class gs extends yc {
  constructor(e) {
    super(e);
  }
}
var Tn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Tn || (Tn = {}));
function tu(t) {
  return Yg(Ct(t.readBytes(pc)));
}
function gi(t, e) {
  return {
    pubKeyEncoding: t,
    type: rt.TransactionAuthField,
    contents: e
  };
}
function tv(t) {
  const e = t.readUInt8Enum(Tn, (n) => {
    throw new un(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Tn.PublicKeyCompressed:
      return gi(le.Compressed, Ql(t));
    case Tn.PublicKeyUncompressed:
      return gi(le.Uncompressed, G8(Ql(t).data));
    case Tn.SignatureCompressed:
      return gi(le.Compressed, tu(t));
    case Tn.SignatureUncompressed:
      return gi(le.Uncompressed, tu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function df(t) {
  return se(t.data);
}
function ev(t) {
  const e = [];
  switch (t.contents.type) {
    case rt.PublicKey:
      e.push(t.pubKeyEncoding === le.Compressed ? Tn.PublicKeyCompressed : Tn.PublicKeyUncompressed), e.push(Ha(R8(t.contents.data)));
      break;
    case rt.MessageSignature:
      e.push(t.pubKeyEncoding === le.Compressed ? Tn.SignatureCompressed : Tn.SignatureUncompressed), e.push(df(t.contents));
      break;
  }
  return me(e);
}
function cr(t) {
  switch (t.type) {
    case rt.Address:
      return Co(t);
    case rt.Principal:
      return ay(t);
    case rt.LengthPrefixedString:
      return _i(t);
    case rt.MemoString:
      return iv(t);
    case rt.AssetInfo:
      return ly(t);
    case rt.PostCondition:
      return ov(t);
    case rt.PublicKey:
      return Ha(t);
    case rt.LengthPrefixedList:
      return gf(t);
    case rt.Payload:
      return oy(t);
    case rt.TransactionAuthField:
      return ev(t);
    case rt.MessageSignature:
      return df(t);
  }
}
function nv() {
  return {
    type: rt.Address,
    version: Ua.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function hf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Yt.SerializeP2PKH || e === Yt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Yt.SerializeP2WPKH || e === Yt.SerializeP2WSH || e === Yt.SerializeP2WSHNonSequential) && !r.every(zi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Yt.SerializeP2PKH:
      return to(t, Av(r[0].data));
    case Yt.SerializeP2WPKH:
      return to(t, vv(r[0].data));
    case Yt.SerializeP2SH:
    case Yt.SerializeP2SHNonSequential:
      return to(t, $v(n, r.map(Ha)));
    case Yt.SerializeP2WSH:
    case Yt.SerializeP2WSHNonSequential:
      return to(t, Iv(n, r.map(Ha)));
  }
}
function Co(t) {
  const e = [];
  return e.push(se(Lo(t.version, 1))), e.push(se(t.hash160)), me(e);
}
function Ni(t) {
  const e = dc(Ct(t.readBytes(1))), n = Ct(t.readBytes(20));
  return { type: rt.Address, version: e, hash160: n };
}
function ay(t) {
  const e = [];
  return e.push(t.prefix), e.push(Co(t.address)), t.prefix === yo.Contract && e.push(_i(t.contractName)), me(e);
}
function rv(t) {
  const e = t.readUInt8Enum(yo, (s) => {
    throw new un(`Unexpected Principal payload type: ${s}`);
  }), n = Ni(t);
  if (e === yo.Standard)
    return { type: rt.Principal, prefix: e, address: n };
  const r = Sn(t);
  return {
    type: rt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function _i(t) {
  const e = [], n = ji(t.content), r = n.byteLength;
  return e.push(se(Lo(r, t.lengthPrefixBytes))), e.push(n), me(e);
}
function Sn(t, e, n) {
  e = e || 1;
  const r = dc(Ct(t.readBytes(e))), s = sf(t.readBytes(r));
  return Ps(s, e, n ?? 128);
}
function sv(t) {
  return Ps(t, 4, 1e5);
}
function xh(t) {
  if (t && hy(t, _a))
    throw new Error(`Memo exceeds maximum length of ${_a} bytes`);
  return { type: rt.MemoString, content: t };
}
function iv(t) {
  const e = [], n = ji(t.content), r = Ev(Ct(n), _a * 2);
  return e.push(se(r)), me(e);
}
function cy(t) {
  let e = sf(t.readBytes(_a));
  return e = e.replace(/\u0000*$/, ""), { type: rt.MemoString, content: e };
}
function ly(t) {
  const e = [];
  return e.push(Co(t.address)), e.push(_i(t.contractName)), e.push(_i(t.assetName)), me(e);
}
function eu(t) {
  return {
    type: rt.AssetInfo,
    address: Ni(t),
    contractName: Sn(t),
    assetName: Sn(t)
  };
}
function pf(t, e) {
  return {
    type: rt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function gf(t) {
  const e = t.values, n = [];
  n.push(se(Lo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(cr(r));
  return me(n);
}
function uy(t, e, n) {
  const r = dc(Ct(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case rt.Address:
        s.push(Ni(t));
        break;
      case rt.LengthPrefixedString:
        s.push(Sn(t));
        break;
      case rt.MemoString:
        s.push(cy(t));
        break;
      case rt.AssetInfo:
        s.push(eu(t));
        break;
      case rt.PostCondition:
        s.push(av(t));
        break;
      case rt.PublicKey:
        s.push(Ql(t));
        break;
      case rt.TransactionAuthField:
        s.push(tv(t));
        break;
    }
  return pf(s, n);
}
function ov(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ay(t.principal)), (t.conditionType === tn.Fungible || t.conditionType === tn.NonFungible) && e.push(ly(t.assetInfo)), t.conditionType === tn.NonFungible && e.push(we(t.assetName)), e.push(t.conditionCode), t.conditionType === tn.STX || t.conditionType === tn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ls("The post-condition amount may not be larger than 8 bytes");
    e.push(es(t.amount, !1, 8));
  }
  return me(e);
}
function av(t) {
  const e = t.readUInt8Enum(tn, (o) => {
    throw new un(`Could not read ${o} as PostConditionType`);
  }), n = rv(t);
  let r, s, i;
  switch (e) {
    case tn.STX:
      return r = t.readUInt8Enum(go, (a) => {
        throw new un(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ct(t.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: tn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case tn.Fungible:
      return s = eu(t), r = t.readUInt8Enum(go, (a) => {
        throw new un(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ct(t.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: tn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case tn.NonFungible:
      s = eu(t);
      const o = En(t);
      return r = t.readUInt8Enum(Xl, (a) => {
        throw new un(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: rt.PostCondition,
        conditionType: tn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function tr(t, e) {
  return me([t, e]);
}
function cv(t) {
  return new Uint8Array([t.type]);
}
function lv(t) {
  return t.type === W.OptionalNone ? new Uint8Array([t.type]) : tr(t.type, we(t.value));
}
function uv(t) {
  const e = new Uint8Array(4);
  return _s(e, t.buffer.length, 0), tr(t.type, hc(e, t.buffer));
}
function fv(t) {
  const e = rf(b4(t.value, BigInt(N4)), Rg);
  return tr(t.type, e);
}
function dv(t) {
  const e = rf(t.value, Rg);
  return tr(t.type, e);
}
function hv(t) {
  return tr(t.type, Co(t.address));
}
function pv(t) {
  return tr(t.type, hc(Co(t.address), _i(t.contractName)));
}
function gv(t) {
  return tr(t.type, we(t.value));
}
function yv(t) {
  const e = [], n = new Uint8Array(4);
  _s(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = we(r);
    e.push(s);
  }
  return tr(t.type, me(e));
}
function wv(t) {
  const e = [], n = new Uint8Array(4);
  _s(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ps(s);
    e.push(_i(i));
    const o = we(t.data[s]);
    e.push(o);
  }
  return tr(t.type, me(e));
}
function fy(t, e) {
  const n = [], r = e == "ascii" ? jg(t.data) : ji(t.data), s = new Uint8Array(4);
  return _s(s, r.length, 0), n.push(s), n.push(r), tr(t.type, me(n));
}
function bv(t) {
  return fy(t, "ascii");
}
function mv(t) {
  return fy(t, "utf8");
}
function we(t) {
  switch (t.type) {
    case W.BoolTrue:
    case W.BoolFalse:
      return cv(t);
    case W.OptionalNone:
    case W.OptionalSome:
      return lv(t);
    case W.Buffer:
      return uv(t);
    case W.UInt:
      return dv(t);
    case W.Int:
      return fv(t);
    case W.PrincipalStandard:
      return hv(t);
    case W.PrincipalContract:
      return pv(t);
    case W.ResponseOk:
    case W.ResponseErr:
      return gv(t);
    case W.List:
      return yv(t);
    case W.Tuple:
      return wv(t);
    case W.StringASCII:
      return bv(t);
    case W.StringUTF8:
      return mv(t);
    default:
      throw new ls("Unable to serialize. Invalid Clarity Value.");
  }
}
function xv(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Sh = /* @__PURE__ */ new Map();
function dy(t, e) {
  const n = Sh.get(t);
  if (n !== void 0)
    return n(e);
  const r = xv(t);
  return Sh.set(t, r), dy(t, e);
}
class io {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return T4(this.readBytes(4), 0);
  }
  readUInt8() {
    return L4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return I4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Ct(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Ct(n);
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
    if (dy(e, r))
      return r;
    throw n(r);
  }
}
function En(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new io(se(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new io(t) : e = t;
  switch (e.readUInt8Enum(W, (r) => {
    throw new un(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case W.Int:
      return P8(e.readBytes(16));
    case W.UInt:
      return Xn(e.readBytes(16));
    case W.Buffer:
      const r = e.readUInt32BE();
      return ey(e.readBytes(r));
    case W.BoolTrue:
      return Jg();
    case W.BoolFalse:
      return ty();
    case W.PrincipalStandard:
      const s = Ni(e);
      return B8(s);
    case W.PrincipalContract:
      const i = Ni(e), o = Sn(e);
      return Qg(i, o);
    case W.ResponseOk:
      return H8(En(e));
    case W.ResponseErr:
      return U8(En(e));
    case W.OptionalNone:
      return ny();
    case W.OptionalSome:
      return ry(En(e));
    case W.List:
      const a = e.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(En(e));
      return O8(c);
    case W.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let E = 0; E < u; E++) {
        const C = Sn(e).content;
        if (C === void 0)
          throw new un('"content" is undefined');
        d[C] = En(e);
      }
      return Us(d);
    case W.StringASCII:
      const l = e.readUInt32BE(), y = E4(e.readBytes(l));
      return Ne(y);
    case W.StringUTF8:
      const p = e.readUInt32BE(), x = sf(e.readBytes(p));
      return D8(x);
    default:
      throw new un("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Sv = (t) => t.length % 2 == 0 ? t : `0${t}`, Ev = (t, e) => t.padEnd(e, "0"), hy = (t, e) => t ? ji(t).length > e : !1;
function nu(t) {
  return Mp(t);
}
const wo = (t) => Z4(uf(t)), yf = (t) => Ct(L8(t)), Av = (t) => Ct(wo(t)), vv = (t) => {
  const e = wo(t), n = hc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = wo(n);
  return Ct(r);
}, $v = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = me(n), s = wo(r);
  return Ct(s);
}, Iv = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = me(n), s = uf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = me(i), a = wo(o);
  return Ct(a);
};
function kv(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function py(t) {
  const e = we(t);
  return `0x${Ct(e)}`;
}
function Lv(t) {
  return En(t);
}
const wi = (t) => {
  try {
    return Gs.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function wf() {
  return {
    type: rt.MessageSignature,
    data: Ct(new Uint8Array(pc))
  };
}
function gy(t, e, n, r) {
  const s = hf(0, t, 1, [Mi(e)]).hash160, i = zi(Mi(e)) ? le.Compressed : le.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ve(n, !1),
    fee: Ve(r, !1),
    keyEncoding: i,
    signature: wf()
  };
}
function bo(t) {
  return "signature" in t;
}
function Eh(t) {
  return t === Yt.SerializeP2SH || t === Yt.SerializeP2WSH;
}
function Cv(t) {
  return t === Yt.SerializeP2SHNonSequential || t === Yt.SerializeP2WSHNonSequential;
}
function Ah(t) {
  const e = nu(t);
  return e.nonce = 0, e.fee = 0, bo(e) ? e.signature = wf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Tv(t) {
  const e = [
    t.hashMode,
    se(t.signer),
    es(t.nonce, !1, 8),
    es(t.fee, !1, 8),
    t.keyEncoding,
    df(t.signature)
  ];
  return me(e);
}
function Bv(t) {
  const e = [
    t.hashMode,
    se(t.signer),
    es(t.nonce, !1, 8),
    es(t.fee, !1, 8)
  ], n = pf(t.fields);
  e.push(gf(n));
  const r = new Uint8Array(2);
  return k4(r, t.signaturesRequired, 0), e.push(r), me(e);
}
function Mv(t, e) {
  const n = Ct(e.readBytes(20)), r = BigInt(`0x${Ct(e.readBytes(8))}`), s = BigInt(`0x${Ct(e.readBytes(8))}`), i = e.readUInt8Enum(le, (a) => {
    throw new un(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Yt.SerializeP2WPKH && i != le.Compressed)
    throw new un("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = tu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function Nv(t, e) {
  const n = Ct(e.readBytes(20)), r = BigInt("0x" + Ct(e.readBytes(8))), s = BigInt("0x" + Ct(e.readBytes(8))), i = uy(e, rt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case rt.PublicKey:
        zi(u.contents) || (o = !0);
        break;
      case rt.MessageSignature:
        if (u.pubKeyEncoding === le.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new gs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Yt.SerializeP2WSH || t === Yt.SerializeP2WSHNonSequential))
    throw new gs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Vc(t) {
  return bo(t) ? Tv(t) : Bv(t);
}
function qc(t) {
  const e = t.readUInt8Enum(Yt, (n) => {
    throw new un(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Yt.SerializeP2PKH || e === Yt.SerializeP2WPKH ? Mv(e, t) : Nv(e, t);
}
function yy(t, e, n, r) {
  const i = t + Ct(new Uint8Array([e])) + Ct(es(n, !1, 8)) + Ct(es(r, !1, 8));
  if (se(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return yf(se(i));
}
function wy(t, e, n) {
  const r = 33 + pc, s = zi(e) ? le.Compressed : le.Uncompressed, i = t + Sv(s.toString(16)) + n.data, o = se(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return yf(o);
}
function _v(t, e, n, r, s) {
  const i = yy(t, e, n, r), o = V8(s, i), a = q8(s), c = wy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function by(t, e, n, r, s, i) {
  const o = yy(t, e, n, r), a = Mi(F8(o, i, s)), c = wy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Pv() {
  const t = gy(Yt.SerializeP2PKH, "", 0, 0);
  return t.signer = nv().hash160, t.keyEncoding = le.Compressed, t.signature = wf(), t;
}
function vh(t, e, n) {
  return bo(t) ? Uv(t, e, n) : Hv(t, e, n);
}
function Uv(t, e, n) {
  const { pubKey: r, nextSigHash: s } = by(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = hf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new gs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function Hv(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case rt.PublicKey:
        zi(c.contents) || (i = !0), r.push(c.contents);
        break;
      case rt.MessageSignature:
        c.pubKeyEncoding === le.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = by(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Eh(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new gs("Too many signatures");
        break;
    }
  if (Eh(t.hashMode) && o !== t.signaturesRequired || Cv(t.hashMode) && o < t.signaturesRequired)
    throw new gs("Incorrect number of signatures");
  if (i && (t.hashMode === Yt.SerializeP2WSH || t.hashMode === Yt.SerializeP2WSHNonSequential))
    throw new gs("Uncompressed keys are not allowed in this hash mode");
  const a = hf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new gs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function my(t) {
  return {
    authType: de.Standard,
    spendingCondition: t
  };
}
function xy(t, e) {
  return {
    authType: de.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || gy(Yt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function $h(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case de.Standard:
        return my(Ah(t.spendingCondition));
      case de.Sponsored:
        return xy(Ah(t.spendingCondition), Pv());
      default:
        throw new Oa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Ov(t, e) {
  switch (t.authType) {
    case de.Standard:
      return vh(t.spendingCondition, e, de.Standard);
    case de.Sponsored:
      return vh(t.spendingCondition, e, de.Standard);
    default:
      throw new Oa("Invalid origin auth type");
  }
}
function Dv(t, e) {
  switch (t.authType) {
    case de.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ve(e, !1)
      };
      return { ...t, spendingCondition: n };
    case de.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ve(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Fv(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ve(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function jv(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ve(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function zv(t, e) {
  const n = {
    ...e,
    nonce: Ve(e.nonce, !1),
    fee: Ve(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Rv(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case de.Standard:
      e.push(Vc(t.spendingCondition));
      break;
    case de.Sponsored:
      e.push(Vc(t.spendingCondition)), e.push(Vc(t.sponsorSpendingCondition));
      break;
  }
  return me(e);
}
function Gv(t) {
  const e = t.readUInt8Enum(de, (r) => {
    throw new un(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case de.Standard:
      return n = qc(t), my(n);
    case de.Sponsored:
      n = qc(t);
      const r = qc(t);
      return xy(n, r);
  }
}
class Kv {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ve(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? B4, this.postConditionMode = i ?? Bi.Deny, this.postConditions = s ?? pf([]), o)
      this.anchorMode = U4(o);
    else
      switch (r.payloadType) {
        case $t.Coinbase:
        case $t.CoinbaseToAltRecipient:
        case $t.NakamotoCoinbase:
        case $t.PoisonMicroblock:
        case $t.TenureChange:
          this.anchorMode = Je.OnChainOnly;
          break;
        case $t.ContractCall:
        case $t.SmartContract:
        case $t.VersionedSmartContract:
        case $t.TokenTransfer:
          this.anchorMode = Je.Any;
          break;
      }
  }
  signBegin() {
    const e = nu(this);
    return e.auth = $h(e.auth), e.txid();
  }
  verifyBegin() {
    const e = nu(this);
    return e.auth = $h(e.auth), e.txid();
  }
  verifyOrigin() {
    return Ov(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, de.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === de.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, de.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !bo(n)) {
      const r = zi(e);
      n.fields.push(gi(r ? le.Compressed : le.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = _v(n, r, e.fee, e.nonce, s);
    return bo(e) ? e.signature = i : e.fields.push(gi(s.data.byteLength === zg ? le.Compressed : le.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return yf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != de.Sponsored)
      throw new Oa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = zv(this.auth, e);
  }
  setFee(e) {
    this.auth = Dv(this.auth, e);
  }
  setNonce(e) {
    this.auth = Fv(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != de.Sponsored)
      throw new Oa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = jv(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ls('"version" is undefined');
    if (this.chainId === void 0)
      throw new ls('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ls('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ls('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ls('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return _s(n, this.chainId, 0), e.push(n), e.push(Rv(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(gf(this.postConditions)), e.push(oy(this.payload)), me(e);
  }
}
function Da(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new io(se(t.slice(2))) : e = new io(se(t)) : t instanceof Uint8Array ? e = new io(t) : e = t;
  const n = e.readUInt8Enum(Pa, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Gv(e), i = e.readUInt8Enum(Je, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Bi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = uy(e, rt.PostCondition), c = J8(e);
  return new Kv(n, s, c, a, o, i, r);
}
const Vv = N8, oo = Xn, qv = ey;
const Wv = /* @__PURE__ */ new Set([4001, -31001]), Xv = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Yv = ["result", "data", "payload", "response", "params"], Ih = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], wc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ws = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, fr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Zv = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Sy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => Zv(i, r)) === s
  );
}, Ey = (t) => t ? Sy(Ws()).some(
  (e) => {
    var n;
    return e.id === t && (wc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ay = () => {
  if (typeof window > "u")
    return;
  const t = Ws(), e = Sy(t).filter(
    (n) => {
      var r;
      return wc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = fr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Xv) {
    const r = fr(t, n) ?? (t === window ? void 0 : fr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Qv = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ws(), n = fr(e, t) ?? (e === window ? void 0 : fr(window, t)) ?? rc(t);
  if (n)
    return n;
  if (wc(t) || Ey(t))
    return Ay();
}, sa = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, Jv = ["blockstack-session", "blockstack"], t6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Jv) {
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
t6();
const vy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, ln = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, e6 = (t) => {
  const e = ln(t);
  if (!e)
    return null;
  const n = vy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, n6 = (t) => {
  const e = ln(t);
  if (!e)
    return null;
  const n = vy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, ru = (t, e = "mainnet") => {
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
      return ru(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return ru(r, e);
  }
  return e;
}, xs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, mo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return wi(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = mo(s, e + 1);
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
    const i = mo(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && wi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && wi(n.testnet) ? n.testnet.trim() : null;
}, kh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, $y = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && Wv.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Hs = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = ln(n == null ? void 0 : n.message) ?? ln(e.message) ?? ln(e.error) ?? ln(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Pi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Hs(e);
    if (e.status === "error")
      throw Hs(e.result ?? e);
  }
  return t;
}, Lh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Pi(r);
  } catch (r) {
    throw Hs(r);
  }
}, Iy = () => Ay(), bf = () => {
  if (typeof window > "u")
    return;
  const t = Ws();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = fr(t, e) ?? (t === window ? void 0 : fr(window, e));
    if (n)
      return n;
  }
}, Ch = () => {
  if (typeof window > "u")
    return;
  const t = bf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Ws();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = fr(e, n) ?? (e === window ? void 0 : fr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ga = (t) => {
  var r, s;
  const e = ks();
  if (wc(e) || Ey(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ws() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Iy();
}, Wc = (t) => {
  const e = n6(t);
  if (!e)
    return null;
  try {
    const n = Da(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Fa = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Wc(t), r = e6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? ln(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Fa(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Ih)
    if (Wc(s[a])) {
      i = ln(s[a]);
      break;
    }
  const o = ln(s.txId) || ln(s.txid) || ln(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? ln(s.txRaw) ?? void 0
    };
  for (const a of Ih) {
    const c = Wc(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: ln(s[a]) ?? void 0
      };
  }
  for (const a of Yv) {
    const c = s[a], u = Fa(c, e + 1);
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
}, Xc = (t) => {
  const e = Fa(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, r6 = (t) => {
  const e = Fa(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, s6 = (t) => ({
  ...t,
  fee: xs(t.fee),
  nonce: xs(t.nonce),
  sponsored: t.sponsored === !0
}), Th = (t) => ({
  recipient: t.recipient,
  amount: xs(t.amount) ?? "0",
  memo: t.memo,
  network: ru(t.network),
  address: t.stxAddress,
  fee: xs(t.fee),
  nonce: xs(t.nonce),
  sponsored: t.sponsored ?? !1
}), ky = "WALLET_ADDRESS_MISMATCH", i6 = 45e3;
let ao = null;
const su = (t) => {
  t && (ao = { address: t, at: Date.now() });
}, o6 = () => {
  ao = null;
}, a6 = () => ao && Date.now() - ao.at <= i6 ? ao.address : null, c6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, l6 = async (t) => {
  o6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Pi(await t.request("wallet_connect")), n = mo(e);
  return su(n), n;
}, u6 = async (t, e, n, r) => {
  try {
    return Pi(await t.request(e, n));
  } catch (s) {
    const i = Hs(s);
    if (!c6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await l6(t);
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
        { code: o ? ky : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Pi(await t.request(e, n));
    } catch (a) {
      throw Hs(a);
    }
  }
};
let Bh = 3e4;
const f6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Bh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Bh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, d6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: ky }
      );
    return c;
  }, s = a6();
  if (s)
    return sa(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  sa(n, "account-read");
  try {
    const c = Pi(
      await f6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = mo(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if ($y(c))
      throw Hs(c);
    sa(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return su(i), r(i, "wallet_getAccount");
  let o;
  sa(n, "account-reconnect");
  try {
    o = Pi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Hs(c);
  }
  const a = mo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return su(a), r(a, "wallet_connect");
}, h6 = async (t, e) => {
  if (!ga(t)) {
    const i = await Lh(
      t,
      "stx_transferStx",
      Th(e)
    );
    return Xc(i);
  }
  const n = bf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Lh(
      n,
      "stx_transferStx",
      Th(e)
    );
    return Xc(i);
  }
  const r = Iy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await d6(r, e.stxAddress);
  const s = await u6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: xs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: xs(e.fee) } : {}
    },
    e.stxAddress
  );
  return Xc(s);
}, p6 = () => ks(), Ly = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ks(), e = t ? Qv(t) : void 0;
  if (e)
    return e;
  const n = Ws() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Mh = (t, e) => {
  const n = Ly(), r = s6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, r6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ta(r, e);
  if (ga(n) && !bf()) {
    const s = Ch();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ks(),
        route: "legacy-transaction-request"
      }), ta(r, s);
  }
  return void h6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (kh(s) && ga(n)) {
      const a = Ch();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ks(),
          route: "legacy-transaction-request"
        }), ta(r, a);
        return;
      }
    }
    if (kh(s) && !ga(n)) {
      ta(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), $y(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Nh = (t) => py(t).replace(/^0x/, ""), _h = "This wallet cannot sign messages. Try Xverse or Leather.", Ph = (t) => typeof (t == null ? void 0 : t.request) == "function", Uh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", g6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, y6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function w6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Nh(e.message),
    domain: Nh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function b6(t, e) {
  const n = await f4({
    domain: e.domain,
    message: e.message,
    network: fc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Hh(t) {
  var s, i;
  const e = p6() || "", n = /xverse/i.test(e);
  let r = Ly();
  if (n && !Uh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Uh(r))
    try {
      return await b6(r, t);
    } catch (o) {
      if (n || !Ph(r) || !y6(o)) throw o;
    }
  if (!n && Ph(r))
    try {
      return await w6(r, t);
    } catch (o) {
      throw g6(o) ? new Error(_h) : o;
    }
  throw new Error(_h);
}
const Oh = 1000000n, ys = 1000000n, ja = 50n, Oe = 3000n, Xs = 300n, Zi = 3000n, m6 = 50000n, Yc = 200n, bc = 15000n, An = (t) => t + ja;
function In(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Oh}.${(n % Oh).toString().padStart(6, "0")}`;
}
function Dh(t, e = Xs) {
  return t <= Oe ? 0 : Number((t - Oe) / An(e));
}
function Zc(t, e = 0n) {
  const n = ys - t - e;
  return n > 0n ? n : 0n;
}
function x6(t, e = Xs) {
  return t > ys ? "over" : t < Oe + An(e) ? "empty" : t < m6 ? "low" : "ok";
}
const S6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", E6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", A6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function v6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || A6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== S6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Cy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Qc = 3, $6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [iu, Ty] = Cy.split("."), bn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function ou(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function I6(t) {
  return bn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Jr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function By(t, e = []) {
  const n = await Jr(`/v2/contracts/call-read/${iu}/${Ty}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: iu, arguments: e.map((r) => "0x" + bn(we(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Kn(En(n.result));
}
async function k6() {
  const t = await Jr(`/v2/contracts/source/${iu}/${Ty}?proof=0`);
  if (typeof t.source != "string" || await I6(t.source) !== E6) throw Error("Deployed source does not match the tested helper.");
  if (v6(await By("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function My(t) {
  return t.startsWith("SP") && wi(t) && !t.includes(".");
}
async function L6(t) {
  var r;
  if (!My(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Jr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Jr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function C6(t) {
  const e = await Jr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function T6(t, e) {
  var s, i;
  const n = await By("get-owner", [oo(t), oo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !My(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function B6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: ou(t), signal: AbortSignal.timeout(15e3) });
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
function N6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Da(ou(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || pi(to(Ua.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || pi(r.contractAddress) + "." + r.contractName.content !== Cy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || bn(we(r.functionArgs[0])) !== bn(we(oo(t.core))) || bn(we(r.functionArgs[1])) !== bn(we(oo(t.song))) || bn(we(r.functionArgs[2])) !== bn(we(qv(ou(t.id)))) || t.amount !== "50" || e.postConditionMode !== Bi.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== go.Equal || i.principal.prefix !== 2 || pi(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || pi(r.contractAddress) + "." + r.contractName.content !== $6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || bn(we(r.functionArgs[0])) !== bn(we(oo(t.song))) || typeof t.liked != "boolean" || bn(we(r.functionArgs[1])) !== bn(we(Vv(t.liked))) || t.amount !== "0" || e.postConditionMode !== Bi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Kn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const _6 = "xtrata.xyz/radio/listening-wallet", P6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Os = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && wi(t), U6 = (t) => ({
  domain: Us({ name: Ne(_6), version: Ne("1"), "chain-id": Xn(1) }),
  message: Us({
    purpose: Ne(P6),
    main: Ne(t.main),
    listening: Ne(t.listening),
    issued: Xn(t.issued)
  })
}), Ny = 100000n, H6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function O6(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Os(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Ny).sort(H6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const ia = 50;
function za(t) {
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
async function D6(t, e, n = 4) {
  if (!Os(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${ia}&offset=${o}`, s = za(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - ia);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= ia ? s : za(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = O6(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - ia);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const ir = 50, F6 = 6, j6 = 20, Fh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function jh(t, e) {
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
async function z6(t, e, n) {
  if (!Os(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = za(await e(`/extended/v1/address/${t}/stx_inbound?limit=${ir}&offset=0`));
    if (!s || s.total > F6 * ir) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = ir; o < s.total; o += ir) {
      const a = za(await e(`/extended/v1/address/${t}/stx_inbound?limit=${ir}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${ir}&offset=${u}`, a = jh(await e(o(0)), t);
      if (!a || a.total > j6 * ir) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = ir; u < a.total; u += ir) {
        const d = jh(await e(o(u)), t);
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
function R6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Fh).map((l, y) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: y } : Os(l.sender) && p >= Ny ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: p, kind: "dust", to: null, at: y };
  }), i = s.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Os(l.recipient) && l.amount > 0n).sort(Fh), a = o.reduce((l, y) => l + y.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let p = y;
    for (const x of l) {
      if (p <= 0n) break;
      const E = x.left < p ? x.left : p;
      x.left -= E, p -= E;
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
function G6(t, e) {
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
function zh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const au = [50000n, 100000n, 250000n], Qi = ["prepared", "signed", "unknown", "pending"], K6 = 30 * 6e4, Rh = 6e4, ai = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, V6 = 3e3, Gh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", Jc = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function q6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, y = !1, p = null, x = !1, E = "", C = "", j = 0, R, S = null, m, k = [], O, K = -1 / 0;
  const z = /* @__PURE__ */ new Set();
  let X = null, A = !1, T = 0, N = null, F = null, V = !1, G = null, zt = !1, ct = null, Ie = !1, I = !1, P = !1, ut = !1, kt = !1, Lt = 0, Dt = null, Qt = Promise.resolve();
  const Ht = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Xs.toString()), qt = (w) => !!i && !(i.features ?? []).includes(w), pe = (w, $) => `xtrata.ppp.v1.${w}:${$}`, qe = (w = i == null ? void 0 : i.address) => {
    if (!w) return [];
    try {
      const $ = JSON.parse(t.store.get(pe("entries", w)) || "[]");
      return Array.isArray($) ? $ : [];
    } catch {
      return [];
    }
  }, mt = (w) => {
    const $ = [w, ...qe(w.address).filter((D) => !(D.txid === w.txid && D.kind === w.kind))].slice(0, 200);
    t.store.set(pe("entries", w.address), JSON.stringify($));
  }, Fe = (w = i == null ? void 0 : i.address) => !!w && t.store.get(pe("on", w)) !== "0", nn = (w) => {
    i != null && i.address && t.store.set(pe("on", i.address), w ? "1" : "0");
  }, je = () => qe().filter((w) => Qi.includes(w.status)), _n = () => oe() ? [...je(), ...qe(te()).filter((w) => Qi.includes(w.status))] : je(), xe = () => Se(i == null ? void 0 : i.address), Se = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(pe("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, Te = (w, $ = i == null ? void 0 : i.address) => {
    $ && t.store.set(pe("deposit", $), JSON.stringify(w));
  };
  let ie = null;
  const Pe = (w = Rh) => {
    const $ = t.now();
    ie = { since: ie && $ < ie.until ? ie.since : $, until: Math.max((ie == null ? void 0 : ie.until) ?? 0, $ + w) };
  }, Ue = () => !!ie && t.now() < ie.until && (o === void 0 || o < Oe + An(Ht())), Ae = () => !!xe() || Ue(), te = () => qt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), oe = () => !!(i != null && i.address) && te() !== i.address, Ee = () => oe() ? c && c.for === te() ? c.value : void 0 : o, We = (w) => w !== void 0 && w < Oe + Yc, ke = () => je().filter((w) => t.now() - w.created > K6 && z.has(w.txid)), v = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), B = () => v() && !(i != null && i.linked), M = () => {
    const w = t.main();
    return !B() && !!w && !!(i != null && i.linked) && i.linked !== w;
  }, h = (w) => pe("return-to", w), b = (w = i == null ? void 0 : i.address) => {
    if (!w) return;
    const $ = t.store.get(h(w));
    return $ && Os($) && $ !== w ? $ : void 0;
  }, f = (w = i == null ? void 0 : i.address) => X && X.for === w ? X.res : null;
  function U() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const w = b();
    if (w) return { to: w, kind: "chosen" };
    const $ = f();
    if ($ != null && $.ok && $.funder) return { to: $.funder, kind: "funder" };
  }
  const Y = (w) => pe("gift", w);
  function et() {
    const w = i == null ? void 0 : i.address;
    if (!w) return null;
    if ((G == null ? void 0 : G.for) === w) return G.info;
    try {
      const $ = JSON.parse(t.store.get(Y(w)) || "null");
      return $ && typeof $.returnTo == "string" && typeof $.treasury == "string" ? $ : null;
    } catch {
      return null;
    }
  }
  async function pt() {
    var st;
    const w = i == null ? void 0 : i.address;
    if (!w || !t.giftInfo || !((st = e == null ? void 0 : e.gifts) != null && st.enabled) || zt) return;
    const $ = (G == null ? void 0 : G.for) === w ? G : null, D = $ ? $.ok ? $.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if ($ && t.now() - $.at < D) return;
    zt = !0;
    const Z = et();
    try {
      const H = await t.giftInfo(w);
      G = { for: w, info: H, ok: !0, at: t.now() }, t.store.set(Y(w), JSON.stringify(H));
    } catch {
      G = { for: w, info: Z, ok: !1, at: t.now() };
    } finally {
      zt = !1;
    }
  }
  const Rt = () => qe().reduce((w, $) => Qi.includes($.status) ? w + BigInt($.amount || "0") + BigInt($.fee || "0") : w, 0n);
  function _t() {
    if (o === void 0) return 0;
    const w = o - Rt() - BigInt(Jt.length) * An(Ht());
    return w > 0n ? Dh(w, Ht()) : 0;
  }
  const dt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", gt = "EMPTY — ADD STX TO PLAY";
  function ee() {
    var D;
    const w = (i == null ? void 0 : i.state) === "known" || (i == null ? void 0 : i.state) === "unlocked";
    if (!((D = et()) != null && D.player) && !w) return null;
    const $ = (Z, st) => ({ reason: Z, text: st });
    switch (wt()) {
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
        return Ae() ? $("arriving", "YOUR PLAYS ARE ARRIVING") : $("out", oe() ? dt : gt);
      case "ready":
        return !Fe() || !(i != null && i.session) || i.session.playsLeft < 1 ? $("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : P ? _t() < 1 ? $("out", oe() ? dt : gt) : null : $("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Mt = () => {
    var w;
    return !!(i != null && i.address) && oe() && !!((w = et()) != null && w.player);
  };
  function Wt() {
    return Mt() ? { locked: !0, known: !0 } : null;
  }
  const yt = 3 * 6e4, Ut = () => !!et() && !!t.history && !(i != null && i.linked);
  async function Gt() {
    const w = i.address, $ = et(), { balance: D, nonce: Z } = await t.chain.account(w), st = await t.history(w, !0);
    if (!st.ok) return null;
    const H = R6({ self: w, balance: D, inbound: st.inbound, outgoing: st.outgoing, gift: { sender: $.treasury, payer: $.returnTo } });
    if (!H.ok) return null;
    const lt = G6(H.parts, Zi);
    return { balance: D, nonce: Z, parts: H.parts, steps: lt.steps, tooSmall: lt.tooSmall.length };
  }
  const it = () => Ie ? { state: "unavailable" } : !ct || t.now() - ct.at > yt || o !== void 0 && o !== ct.balance ? { state: "none" } : ct.plan;
  function wt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!B()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : M() ? "wrong-wallet" : i.state === "known" ? "locked" : !B() && i.linked !== w ? "link" : o === void 0 ? "loading" : o > ys ? "over" : o < Oe + An(Ht()) ? "fund" : "ready" : "loading";
  }
  const Kt = () => {
    var w, $, D, Z, st;
    return {
      step: wt(),
      busy: u,
      message: E,
      error: C,
      notice: ge(),
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : x6(o, Ht()),
      playsLeft: o === void 0 ? 0 : Dh(o, Ht()),
      allowance: o === void 0 ? ys : Zc(o, BigInt(((w = xe()) == null ? void 0 : w.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Fe(),
      entries: qe(),
      depositTxid: (($ = xe()) == null ? void 0 : $.txid) ?? R,
      depositPending: Ae(),
      arrival: Ae() ? { since: ((D = xe()) == null ? void 0 : D.at) ?? (ie == null ? void 0 : ie.since) ?? t.now(), graceMs: Rh } : null,
      walletOutdated: qt("like"),
      linkedListening: O && O === t.main() ? k.map((H) => H.listening) : [],
      serverLinked: !!S && m === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: ke().length,
      armed: ut,
      queued: Jt.length,
      solo: B(),
      returnTo: (Z = U()) == null ? void 0 : Z.to,
      returnToKind: (st = U()) == null ? void 0 : st.kind,
      funderState: (() => {
        const H = f();
        return H ? H.ok ? H.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const H = f();
        return !!H && H.ok && H.distinct > 1;
      })(),
      walletCannotSolo: B() && qt("standalone"),
      walletCannotMulti: qt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((H) => H !== t.main() && H !== (i == null ? void 0 : i.linked)),
      creditedTo: B() && (i != null && i.address) && (N == null ? void 0 : N.for) === i.address && N.main ? N.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(pe("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (F == null ? void 0 : F.for) === i.address && F.unused,
      gift: (() => {
        const H = et();
        return H ? { player: H.player, from: H.from, source: H.source, amount: H.amount } : null;
      })(),
      giftPlays: et() ? _t() : 0,
      giftStop: ee(),
      albumLock: Wt(),
      returnPlan: it(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: qt("slots"),
      likeFunds: (() => {
        var ft;
        const H = te();
        if (!H || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const lt = Ee();
        return { address: H, balance: lt, low: We(lt), album: oe(), pending: !!Se(H), txid: (ft = Se(H)) == null ? void 0 : ft.txid, main: t.main() };
      })()
    };
  }, ge = () => j ? j < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Tt = (w, $ = "") => {
    E = w, C = $, t.changed();
  };
  async function Le(w, $) {
    if (!u) {
      u = w, C = "", t.changed();
      try {
        await $();
      } catch (D) {
        const Z = D instanceof Error ? D.message : String(D);
        C = /Cancelled in the listening wallet/.test(Z) ? "" : Z, C || (E = "Not now. Nothing was signed.", kt = !0);
      } finally {
        u = null, await gn(!0);
      }
    }
  }
  const rs = () => !!(e != null && e.enabled) && e.here && (B() || !!t.main() && e.allowed), gr = () => rs() && !M(), er = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", ue = () => {
    if (M()) throw new Error(er());
  };
  async function pn() {
    if (!rs()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Xe = (w) => {
    const $ = t.main();
    return w.request("listening.status", $ ? { main: $ } : void 0);
  };
  async function yr(w = !1) {
    i != null && i.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await wr(w)));
  }
  async function wr(w = !1) {
    const $ = te();
    if (!(!oe() || !$ || (i == null ? void 0 : i.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === $ && t.now() - c.at < 3e4))
      try {
        c = { for: $, value: await t.chain.balance($), at: t.now() };
      } catch {
      }
  }
  async function Ys(w) {
    if ((O !== w || t.now() - K >= 6e4) && (k = await t.links(w), O = w, K = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === w) return;
    const $ = `${w}:${i.address}`;
    m === $ && S || (S = k.find((D) => D.listening === i.address) ?? null, m = $);
  }
  async function Pn() {
    const w = i == null ? void 0 : i.address;
    if (!B() || !w || i != null && i.linked || !t.funder || A || !o || o <= 0n) return;
    const $ = f(w);
    if ($ != null && $.ok && $.funder) return;
    const D = $ != null && $.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, T - 1), 30 * 6e4);
    if (!(X && X.for === w && t.now() - X.at < D)) {
      A = !0;
      try {
        X = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        X = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        A = !1;
      }
      T = X.res.ok ? 0 : T + 1;
    }
  }
  async function Zs() {
    const w = i == null ? void 0 : i.address;
    if (!(!B() || !w || i != null && i.linked || !t.mainOf || V) && !(N && N.for === w && (N.ok || t.now() - N.at < 6e4))) {
      V = !0;
      try {
        N = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        N = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        V = !1;
      }
    }
  }
  async function Qs() {
    const w = i == null ? void 0 : i.address;
    if (!(!w || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (F == null ? void 0 : F.for) === w) && t.store.get(pe("created", w)) !== "1")
      try {
        F = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function Js() {
    var st;
    const w = i == null ? void 0 : i.address;
    if (!w) return !1;
    let $, D = !1;
    const Z = /* @__PURE__ */ new Map();
    for (const H of _n())
      try {
        const lt = await t.chain.transaction(H.txid);
        if (!lt) {
          if (z.add(H.txid), t.now() - H.created > 15 * 6e4 && !Z.has(H.address) && Z.set(H.address, await t.chain.confirmedNonce(H.address)), $ = Z.get(H.address), $ !== void 0 && $ > BigInt(H.nonce)) {
            mt({ ...H, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((H.status === "unknown" || H.status === "signed") && H.raw)
            try {
              await t.chain.broadcast(H.raw, H.txid), mt({ ...H, status: "pending" });
            } catch (ht) {
              ai(ht) && mt({ ...H, status: "failed", note: ht.message, raw: void 0 });
            }
          continue;
        }
        z.delete(H.txid);
        const ft = String(lt.tx_status);
        if (ft === "success" && lt.canonical !== !1 && lt.is_unanchored === !1) {
          if (mt({ ...H, status: "confirmed", confirmedAt: t.now(), actualFee: String(lt.fee_rate ?? H.fee), raw: void 0 }), D = !0, H.kind === "like" && (x = !0, H.status !== "confirmed" && typeof H.liked == "boolean"))
            try {
              (st = t.likeConfirmed) == null || st.call(t, H.song, H.liked);
            } catch {
            }
        } else ft.startsWith("abort_") || ft.startsWith("dropped_") ? mt({ ...H, status: "failed", note: ft, raw: void 0 }) : H.status !== "pending" && mt({ ...H, status: "pending" });
      } catch {
      }
    for (const H of oe() ? [w, te()] : [w]) {
      const lt = Se(H);
      if (lt)
        try {
          const ft = await t.chain.transaction(lt.txid), ht = String((ft == null ? void 0 : ft.tx_status) ?? "");
          (ht === "success" && ft.is_unanchored === !1 || ht.startsWith("abort_") || ht.startsWith("dropped_") || !ft && t.now() - lt.at > 2 * 36e5) && (Te(null, H), ht === "success" && Pe(2e4), a = -1 / 0, c = null, /on its way/i.test(E) && (E = ""));
        } catch {
        }
    }
    return D;
  }
  async function gn(w = !1) {
    var $;
    try {
      const D = t.main();
      if ((w || !e || r !== D || t.now() - n > 3e5) && (e = await t.config(D), n = t.now(), r = D), !e.enabled || !e.here || !B() && (!D || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ut && br(), t.changed();
        return;
      }
      await pn(), i = await Xe(s), M() && i.state === "unlocked" && (ni(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Xe(s)), D && e.allowed && await Ys(D), await yr(w), await Pn(), await Zs(), await Qs(), await pt(), await Js() && await yr(!0), await wr(), await ve(), j = 0;
    } catch {
      j++;
    }
    if (wt() === "locked" ? ei() : ut && br(), x) {
      x = !1;
      try {
        ($ = t.likesChanged) == null || $.call(t);
      } catch {
      }
    }
    t.changed(), Jt.length && !vn && Ki();
  }
  async function ti(w) {
    const $ = i == null ? void 0 : i.root;
    if (!$ || i != null && i.slot || !(i != null && i.address) || qt("slots")) return;
    const D = Number(t.store.get(pe("slot", $)));
    if (!(!Number.isSafeInteger(D) || D < 1))
      try {
        const { balance: Z } = await t.chain.account(i.address);
        if (Z >= Oe + An(Ht())) return;
        await w.request("listening.openSlot", { slot: D }), i = await Xe(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function yn(w, $) {
    var H;
    ue();
    const D = !(i != null && i.address) || Fe(i.address), Z = i != null && i.linked ? (H = t.nameOf) == null ? void 0 : H.call(t, i.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: D ? mr() : void 0, anyPasskey: $, ...t.main() ? { main: t.main() } : {}, ...Z ? { label: Z } : {} }), i = await Xe(w), D && (Fe(i.address) ? await xr() : await w.request("listening.stop")), await ti(w), Tt(D ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const st = p;
    p = null, st && t.now() - st.at < 12e4 && setTimeout(() => void gn(!0).then(() => ri(st)), 0);
  }
  function ei() {
    ut || u || kt || Lt >= 3 || !s || !(i != null && i.address) || (ut = !0, Qt = (async () => {
      try {
        await yn(s, !1), Lt = 0;
      } catch (w) {
        const $ = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test($) ? Dt || (kt = !0, Tt("Not now. Nothing was signed.")) : /did not answer/.test($) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Lt++, C = $);
      } finally {
        ut = !1;
        const w = Dt;
        Dt = null, w ? await w() : await gn(!0);
      }
    })());
  }
  async function br(w) {
    ut && (Dt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Qt), w && await w(), t.changed();
  }
  const mr = () => ({
    fee: Ht().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: ys.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function xr() {
    if (!(i != null && i.address)) return !1;
    if (P || (P = await t.tabLock(i.address)), !P)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Sr(w, $) {
    const D = i.address, { balance: Z, nonce: st } = $ ?? await t.chain.account(D);
    o = Z;
    const H = await s.request("listening.prepareReturn", {
      mode: w.mode,
      balance: Z.toString(),
      nonce: st.toString(),
      fee: Zi.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (H.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const lt = w.mode === "amount" ? w.amount : w.mode === "all" ? Z - Zi : Z - ys - Zi, ft = Da(H.raw);
    if (Kn(ft.payload.recipient).value !== w.to || String(ft.payload.amount) !== H.amount || lt !== void 0 && H.amount !== lt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const ht = {
      id: Jc(),
      address: D,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: H.recipient,
      amount: H.amount,
      fee: H.fee,
      nonce: st.toString(),
      created: t.now(),
      status: "signed",
      raw: H.raw,
      txid: H.txid
    };
    t.validate(ht), mt(ht);
    try {
      await t.chain.broadcast(H.raw, H.txid), mt({ ...ht, status: "pending" });
    } catch (Ft) {
      throw mt({ ...ht, status: "unknown", note: Ft.message }), Ft;
    }
    return H;
  }
  const ss = bc, nr = Zi;
  async function Un(w, $, D) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (qt("slots") || qt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Z = i.slot ?? 0;
    if (w === $ || ![w, $].includes(Z) || ![w, $].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const st = i.root ?? i.address, H = w === 0 ? st : i.address, lt = $ === 0 ? st : i.address, { balance: ft, nonce: ht } = await t.chain.account(H);
    if (ft < D + nr + Oe) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Ft = await s.request("listening.signMove", { from: w, to: $, amount: D.toString(), fee: nr.toString(), nonce: ht.toString(), balance: ft.toString() }), Be = Da(Ft.raw);
    if (Ft.from !== H || Ft.to !== lt || Ft.amount !== D.toString() || Kn(Be.payload.recipient).value !== lt || String(Be.payload.amount) !== D.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const rn = {
      id: Jc(),
      address: H,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: lt,
      amount: Ft.amount,
      fee: Ft.fee,
      nonce: ht.toString(),
      created: t.now(),
      status: "signed",
      raw: Ft.raw,
      txid: Ft.txid
    };
    t.validate(rn), mt(rn);
    try {
      await t.chain.broadcast(Ft.raw, Ft.txid), mt({ ...rn, status: "pending" });
    } catch (ye) {
      throw mt({ ...rn, status: "unknown", note: ye.message }), ye;
    }
    return Te({ txid: Ft.txid, amount: Ft.amount, at: t.now() }, lt), lt === st && st !== i.address ? c = null : a = -1 / 0, Ft;
  }
  let q = !1;
  const tt = /* @__PURE__ */ new Map(), ae = (w) => pe("float", w);
  async function ve() {
    if (q || (i == null ? void 0 : i.state) !== "unlocked" || !oe() || qt("move") || qt("rootLike") || !i.address) return;
    const w = i.address;
    if (t.store.get(ae(w)) === "1") return;
    const $ = et();
    if (!($ != null && $.player) || $.state !== "arrived") return;
    const D = Ee();
    if (D === void 0 || o === void 0) return;
    if (!We(D)) {
      t.store.set(ae(w), "1");
      return;
    }
    if (Se(te()) || Gi() || _n().length || o < ss * 4n + Oe + nr) return;
    const Z = tt.get(w);
    if (!(Z && (Z.n >= 3 || t.now() - Z.at < 5 * 6e4))) {
      q = !0, tt.set(w, { n: ((Z == null ? void 0 : Z.n) ?? 0) + 1, at: t.now() });
      try {
        await Un(i.slot ?? 0, 0, ss), t.store.set(ae(w), "1");
      } catch (st) {
        console.warn("[radio] likes float not sent yet", st);
      } finally {
        q = !1;
      }
    }
  }
  async function is(w) {
    if (je().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (qt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const $ = await Gt().catch(() => null);
    if (!$)
      throw ct = null, Ie = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Ie = !1, o = $.balance;
    const D = { balance: $.balance, nonce: $.nonce };
    if (w === "excess") {
      const ft = zh($.parts) ?? b();
      if (!ft) throw new Error("Choose where to send the excess first.");
      await Sr({ mode: "excess", to: ft, linked: !1 }, D), ct = null, Tt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Z = $.steps;
    if (!Z.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ct && ct.balance === $.balance && t.now() - ct.at <= yt && ct.steps.length === Z.length && ct.steps.every((ft, ht) => ft.to === Z[ht].to && ft.mode === Z[ht].mode && ft.send === Z[ht].send))) {
      ct = {
        at: t.now(),
        balance: $.balance,
        steps: Z,
        parts: $.parts,
        plan: { state: "ready", steps: Z.map((ft) => ({ to: ft.to, kind: ft.kind, send: ft.send.toString() })), kept: $.tooSmall, excess: zh($.parts) }
      }, Tt(Z.length > 1 ? `This goes back in ${Z.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const H = Z[0], lt = H.to ?? b();
    if (!lt) throw new Error("Choose where to send the rest first.");
    if (H.mode === "amount" && qt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Sr({ mode: H.mode, to: lt, linked: !1, ...H.mode === "amount" ? { amount: H.send } : {} }, D), ct = null, Z.length === 1 ? (nn(!1), Tt("Returned ✓ Paying is off.")) : Tt(`Returned ✓ ${Z.length - 1} more ${Z.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Er = {
    forceRefresh: () => gn(!0),
    create: () => Le("Waiting for your passkey…", async () => {
      const w = await pn();
      await w.request("listening.unlock", { mode: "create", terms: mr(), ...t.main() ? { main: t.main() } : {} }), i = await Xe(w), i.address && t.store.set(pe("created", i.address), "1"), nn(!0), Tt(B() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await xr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? Pe() : ie = null, t.changed();
    },
    giftSent: (w, $) => {
      !(i != null && i.address) || xe() || (Te({ txid: w, amount: $.toString(), at: t.now() }), a = -1 / 0, G = null, Tt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (ue(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (qt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await pn()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, $, D, Z) => {
      Te({ txid: D, amount: Z.toString(), at: t.now() }, $), G = null, await Er.openAlbum(w), Tt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => Le("Opening…", async () => {
      if (ue(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (qt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === w) return;
      ni(), await s.request("listening.openSlot", { slot: w }), i = await Xe(s), o = void 0, a = -1 / 0, ct = null, Ie = !1;
      const $ = i.root;
      $ && w > 0 && t.store.set(pe("slot", $), String(w)), Tt(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const $ = () => Le("Waiting for your passkey…", async () => yn(await pn(), w));
      return ut ? w ? qt("cancel") ? (Tt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : br(async () => {
        (wt() === "locked" || wt() === "intro") && await $();
      }) : Qt : $();
    },
    link: () => Le("Sign in your wallet…", async () => {
      ue();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const $ = (await t.links(w)).find((D) => D.listening === i.address);
      if ($)
        await s.request("listening.link", { main: w, issued: $.issued, mainSignature: $.mainSignature });
      else {
        const D = { main: w, listening: i.address, issued: t.now() }, Z = await t.signWithMain(w, U6(D)), st = await s.request("listening.link", { main: w, issued: D.issued, mainSignature: Z });
        await t.saveLink({ ...D, mainSignature: Z, listeningSignature: st.listeningSignature }), K = -1 / 0;
      }
      Tt("Linked ✓");
    }),
    deposit: () => Le("Approve the deposit in your wallet…", async () => {
      ue();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (xe()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await yr(!0);
      const $ = Zc(o ?? 0n);
      if ($ <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      R = await t.deposit(w, i.address, $), R && Te({ txid: R, amount: $.toString(), at: t.now() }), Tt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Le("Approve the top-up in your wallet…", async () => {
      ue();
      const w = t.main(), $ = te();
      if (!w || !$) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Se($)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const D = await t.chain.balance($);
      oe() ? c = { for: $, value: D, at: t.now() } : (o = D, a = t.now());
      const Z = Zc(D);
      if (Z <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const st = await t.deposit(w, $, Z);
      st && Te({ txid: st, amount: Z.toString(), at: t.now() }, $), Tt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_CHOICES`. */
    topUpAlbum: (w) => Le("Adding plays…", async () => {
      if (ue(), !oe()) throw new Error("Open the album you want to add plays to first.");
      if (!au.includes(w)) throw new Error("Choose one of the amounts offered.");
      if (d || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (_n().length || xe()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Un(0, i.slot ?? 0, w), Tt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Le("Confirm in the listening wallet…", async () => {
      if (!gr()) throw new Error("Connect your wallet first.");
      await xr(), await s.request("listening.approveSession", mr()), nn(!0), Tt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Le("Clearing…", async () => {
      for (const w of ke())
        await t.chain.transaction(w.txid) || mt({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Tt("Cleared ✓");
    }),
    switchOff: () => Le("Switching off…", async () => {
      ni(), await (s == null ? void 0 : s.request("listening.stop")), nn(!1), Tt("Paying is off. Music stays free.");
    }),
    lock: () => Le("Locking…", async () => {
      ni(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Tt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const $ = String(w ?? "").trim();
      if (!(i != null && i.address)) return Tt("", "Unlock the listening wallet first.");
      if (!Os($)) return Tt("", "Enter a standard mainnet address (it starts with SP).");
      if ($ === i.address) return Tt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(h(i.address), $), Tt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(h(i.address), ""), t.changed();
    },
    returnFunds: (w) => Le("Check the return in the listening wallet…", async () => {
      if (!gr()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Ut()) return is(w);
      const $ = U();
      if (!$) throw new Error(B() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if ($.kind !== "linked" && qt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (je().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Sr({ mode: w, to: $.to, linked: $.kind === "linked" }), w === "all" && nn(!1), Tt(w === "all" ? $.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Jt = [], Ri = 10, os = 30 * 6e4;
  let vn = !1;
  const Gi = () => d || !!u || l || y, ni = () => {
    Jt.length && (Jt.length = 0, t.changed());
  };
  async function mc(w) {
    if (!Jt.some(($) => $.id === w.id) && !qe().some(($) => $.id === w.id) && (Jt.push({ ...w, at: t.now() }), Jt.length > Ri && Jt.shift()), Gi() || je().length) {
      const $ = Jt.length;
      E = `Queued ${$ === 1 ? "this song" : $ + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Ki();
  }
  async function Ki() {
    if (!vn) {
      vn = !0;
      try {
        for (; Jt.length; ) {
          for (; Jt.length && t.now() - Jt[0].at > os; ) Jt.shift();
          if (!Jt.length || Gi() || await xc(Jt[0]) === "wait") return;
          Jt.shift();
        }
      } finally {
        vn = !1, t.changed();
      }
    }
  }
  async function xc(w) {
    var $;
    d = !0;
    try {
      await gn();
      const D = wt();
      if (D === "loading") return "wait";
      if (D !== "ready" || !Fe() || !(i != null && i.session) || i.session.playsLeft < 1 || !P) return "done";
      if (je().length) return "wait";
      I || (await t.chain.verify(), I = !0);
      const Z = i.address, { balance: st, nonce: H } = await t.chain.account(Z);
      o = st, a = t.now();
      const lt = await t.chain.owner(Qc, w.song);
      if (lt === Z || lt === t.main()) return "done";
      const ft = await s.request("listening.signPlay", {
        core: Qc,
        song: w.song,
        receipt: w.id,
        fee: Ht().toString(),
        nonce: H.toString(),
        balance: st.toString()
      }), ht = {
        id: w.id,
        address: Z,
        kind: "play",
        core: Qc,
        song: w.song,
        recipient: lt,
        amount: "50",
        fee: Ht().toString(),
        nonce: H.toString(),
        created: t.now(),
        status: "signed",
        raw: ft.raw,
        txid: ft.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(ht), mt(ht);
      const Ft = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(ft.raw, ft.txid), mt({ ...ht, status: "pending" }), E = `♪ Paid ${Ft}`, C = "";
      } catch (Be) {
        mt({ ...ht, status: ai(Be) ? "failed" : "unknown", note: Be.message, ...ai(Be) ? { raw: void 0 } : {} }), C = Be.message;
      }
      return i = await Xe(s), "done";
    } catch (D) {
      const Z = D instanceof Error ? D.message : "payment unavailable";
      return ($ = et()) != null && $.player ? (E = "Payment is taking a moment: " + Z, "wait") : (E = "This song played free: " + Z, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function Sc(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(wt()) || qt("like") ? !1 : (ri(w), !0);
  }
  async function ri(w) {
    const $ = w.title ? `“${w.title}”` : `song #${w.song}`, D = (Hn) => {
      var Vi;
      C = Hn, E = "";
      try {
        (Vi = t.likeFailed) == null || Vi.call(t, w.song);
      } catch {
      }
      t.changed();
    }, Z = oe(), st = wt(), H = t.main(), lt = Z && (st === "fund" || st === "over") ? "ready" : st, ft = B() ? te() : H;
    if (lt === "locked") {
      p = { ...w, at: t.now() }, Tt(`Unlock to like ${$}. It sends straight after.`);
      return;
    }
    if (lt === "wrong-wallet") return D(er());
    if (lt === "link") return D("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (B() && qt("standalone")) return D("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (lt === "fund") return D("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (lt === "over") return D("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Z) {
      await wr(!0);
      const Hn = Ee();
      if (We(Hn))
        return t.changed(), D(Gh);
    }
    if (lt !== "ready" || !ft) return D("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return D("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!P) return D("Pay-per-play is running in another tab. Like from that tab.");
    const ht = qe(te()).find((Hn) => Hn.kind === "like" && Hn.song === w.song);
    if (ht && Qi.includes(ht.status))
      return D(`Your last like for ${$} is still on its way. It can change again once it confirms.`);
    if (l) return D("One like at a time: your last one is still being sent.");
    if ((ht == null ? void 0 : ht.status) === "confirmed" && t.now() - (ht.confirmedAt ?? 0) < V6)
      return D(`Your like for ${$} has only just confirmed. Try again in a moment.`);
    let Ft;
    y = !0;
    try {
      Ft = t.likeState ? (await t.likeState(ft, w.song)).by : w.likedBy ?? [];
    } catch {
      Ft = w.likedBy;
    } finally {
      y = !1;
    }
    if (!Ft) return D(`Could not check ${$} right now. Try the heart again.`);
    const Be = te(), ye = ((ht == null ? void 0 : ht.status) === "confirmed" && typeof ht.liked == "boolean" && t.now() - (ht.confirmedAt ?? ht.created) < 5 * 6e4 ? ht.liked : void 0) ?? Ft.includes(Be);
    if (!ye && Ft.some((Hn) => Hn !== Be)) return D(B() ? `${$} was liked from another wallet of yours. Unlike it there.` : `${$} was liked from your main wallet${Ft.includes(H) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Ec({ song: w.song, liked: !ye, title: w.title, artist: w.artist });
  }
  async function Ec(w) {
    var Z, st, H;
    if (l) {
      Tt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const $ = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, D = t.wait ?? ((lt) => new Promise((ft) => setTimeout(ft, lt)));
    try {
      Tt(`${w.liked ? "Liking" : "Unliking"} ${$}…`);
      const lt = t.now() + 12e4;
      for (; d || (oe() ? qe(te()).some((ye) => Qi.includes(ye.status)) : je().length); ) {
        if (t.now() > lt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await D(5e3), await gn(!0);
      }
      if (!oe() && wt() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const ft = te(), { balance: ht, nonce: Ft } = await t.chain.account(ft);
      if (oe() ? c = { for: ft, value: ht, at: t.now() } : (o = ht, a = t.now()), We(ht)) throw new Error(Gh);
      const Be = await s.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: Yc.toString(),
        nonce: Ft.toString(),
        balance: ht.toString()
      }), rn = {
        id: Jc(),
        address: ft,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: Yc.toString(),
        nonce: Ft.toString(),
        created: t.now(),
        status: "signed",
        raw: Be.raw,
        txid: Be.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(rn), mt(rn);
      try {
        await t.chain.broadcast(Be.raw, Be.txid), mt({ ...rn, status: "pending" }), E = `${w.liked ? "♥ Liked" : "Unliked"} ${$}`, C = "";
        try {
          (Z = t.likeSent) == null || Z.call(t, w.song, w.liked);
        } catch {
        }
      } catch (ye) {
        if (mt({ ...rn, status: ai(ye) ? "failed" : "unknown", note: ye.message, ...ai(ye) ? { raw: void 0 } : {} }), C = ye.message, ai(ye)) try {
          (st = t.likeFailed) == null || st.call(t, w.song);
        } catch {
        }
      }
      i = await Xe(s);
    } catch (lt) {
      C = "Like not sent: " + (lt instanceof Error ? lt.message : "the listening wallet is unavailable");
      try {
        (H = t.likeFailed) == null || H.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Ki();
    }
  }
  return { snapshot: Kt, refresh: gn, onListened: mc, heart: Sc, toggleLike: ri, ...Er };
}
const _y = ["Connect", "Passkey", "Link & fund", "Listen"], Py = ["Passkey", "Add 1 STX", "Listen"], cu = (t) => t ? Py : _y;
function W6(t) {
  if (t.solo) return X6(t);
  const e = _y.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function X6(t) {
  const e = Py.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function Y6(t, e) {
  return !e || e.at >= cu(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const Z6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function Q6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !Z6(r.id)));
}
const J6 = {}, t5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, e5 = (t) => {
  const e = J6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, n5 = (t) => `/hiro/${t}`, r5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, s5 = (t) => {
  const e = e5(t);
  if (e)
    return [r5(e)];
  const n = t5[t];
  return typeof window < "u" ? [`${window.location.origin}${n5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, i5 = {}, Kh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, o5 = "xtrata.log.enabled", a5 = "xtrata.log.level", c5 = "xtrata.log.tags", l5 = "xtrata.log.dedupe", oa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, u5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, f5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, d5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, h5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, p5 = () => {
  const t = i5 ?? {}, e = oa(o5) ?? t.VITE_LOG_ENABLED, n = oa(a5) ?? t.VITE_LOG_LEVEL, r = oa(c5) ?? t.VITE_LOG_TAGS, s = oa(l5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: u5(e),
    level: f5(n) ?? "warn",
    tags: h5(r),
    dedupe: d5(s)
  };
}, g5 = (t, e, n) => !t.enabled || Kh[n] < Kh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), y5 = (t, e, n, r) => {
  const s = p5();
  if (!g5(s, e, t) || b5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, w5 = /* @__PURE__ */ new Set();
let Vh = null;
const b5 = (t, e, n, r, s) => (Vh !== t && (w5.clear(), Vh = t), !1), m5 = (t, e, n) => y5("debug", t, e, n), x5 = {}, S5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, E5 = (t) => {
  const e = x5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : S5[t];
}, A5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, v5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return A5.test(n) ? n : null;
}, $5 = (t) => t.replace(/\/+$/, ""), I5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), qh = (t) => {
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
}, ci = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, k5 = (t) => {
  var c, u;
  let e;
  try {
    e = Kn(Lv(t));
  } catch {
    return null;
  }
  const n = ci(e);
  if (!n || n.success === !1)
    return null;
  const r = ci(n.value), s = ci(r == null ? void 0 : r.value), i = ci(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = qh((c = ci(i.name)) == null ? void 0 : c.value), a = qh((u = ci(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : v5(`${o}.${a}`);
}, L5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${$5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [py(Zg(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : k5(i.result);
}, C5 = async (t) => {
  const e = t.address.trim();
  if (!wi(e))
    return null;
  const n = E5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of s5(t.network))
    try {
      return await L5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return m5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: I5(r)
  }), null;
};
function T5(t, e, n = {}) {
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
const Wh = Object.freeze({
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
}), Xh = Object.freeze({ 139: "melophonic" });
function B5(t, e = "") {
  const n = String(t);
  return Object.hasOwn(Wh, n) ? Wh[n] : Object.hasOwn(Xh, n) ? Xh[n] : e;
}
const Yh = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function M5(t, e = "") {
  return Object.hasOwn(Yh, String(t)) ? Yh[String(t)] : e;
}
const Uy = 100000n, mf = 1000000n, Ra = 3000n, N5 = (t, e) => `${t}#gift=${e}`, _5 = 100, tl = (t, e = Xs) => t <= Oe ? 0 : Number((t - Oe) / An(e)), Zh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Hy = "xtrata.xyz/radio/gifts", el = _5, P5 = "Create a prefunded Xtrata radio gift batch", U5 = (t) => ({
  domain: Us({ name: Ne(Hy), version: Ne("1"), "chain-id": Xn(1) }),
  message: Us({
    purpose: Ne(P5),
    creator: Ne(t.creator),
    count: Xn(t.count),
    amount: Xn(BigInt(t.amount)),
    label: Ne(t.label),
    issued: Xn(t.issued),
    ...t.player ? { player: Ne(t.player) } : {}
  })
}), H5 = (t, e, n = Xs) => Oe + BigInt(t) * An(n) + (e ? bc : 0n), O5 = (t, e = Xs) => Number((mf - Oe - (t ? bc : 0n)) / An(e)), D5 = (t, e) => BigInt(t) * (e + Ra);
function F5(t, e, n, r = Xs) {
  const s = n ? bc : 0n, i = e > Oe + s ? e - Oe - s : 0n, o = Number(i / An(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * ja,
    fees: BigInt(o) * r,
    reserve: Oe,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Ra,
    perCopy: e + Ra,
    total: D5(t, e)
  };
}
const j5 = (t) => t >= Uy && t <= mf, Qh = 40, z5 = "Create an Xtrata radio gift player", R5 = /^[^\u0000-\u001f\u007f<>]+$/u;
function Jh(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && R5.test(t) : !n;
}
function G5(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Jh(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Jh(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > Qh) throw new Error(`A player holds 1 to ${Qh} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const K5 = (t) => tp(op(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), V5 = (t) => ({
  domain: Us({ name: Ne(Hy), version: Ne("1"), "chain-id": Xn(1) }),
  message: Us({
    purpose: Ne(z5),
    admin: Ne(t.admin),
    player: Ne(t.hash),
    issued: Xn(t.issued)
  })
}), xo = (t) => t.tracks.filter((e) => !e.hidden), q5 = (t) => t.tracks.find((e) => e.hidden) ?? null, W5 = [300, 500, 1e3], t0 = 1800, nl = /* @__PURE__ */ new Map();
async function Oy(t) {
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
async function X5(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await Oy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Dy(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = nl.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      nl.set(t, { ...a, until: Date.now() + t0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        nl.delete(t), s();
      }, t0 + 50);
    }
  }, i;
}
const ws = (t, e, n, r, s) => Dy(t, e, async () => await Oy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), as = "xtrata.radio.gift.incoming.v1", e0 = (t) => "xtrata.radio.gift.mine.v1:" + t, n0 = (t) => "xtrata.radio.gift.batches.v1:" + t, at = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, or = (t, e, n = "") => {
  const r = at("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, aa = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, on = (t) => In(t).replace(/\.?0+$/, "");
function Y5(t) {
  let e = null;
  const n = (v) => [5e3, 1e4, 2e4, 3e4][v] ?? 6e4, r = (() => {
    try {
      const v = new URL(location.href), B = new URLSearchParams(v.hash.slice(1)).get("gift") ?? v.searchParams.get("gift");
      return B !== null && (v.searchParams.delete("gift"), history.replaceState(null, "", v.pathname + (v.search || ""))), Zh(B) ? B : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const v = JSON.parse(t.store.get(as) || "null");
      return Zh(v == null ? void 0 : v.code) ? v.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(as, JSON.stringify({ code: i, at: t.now() }));
    let v = 0;
    const B = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (M) => {
      const h = await M.json().catch(() => ({}));
      if (M.status === 404) {
        t.store.set(as, null), e = { ...e, error: (h == null ? void 0 : h.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!M.ok) throw new Error("busy");
      const b = h;
      e = { ...e, view: b, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(b.status) && t.store.set(as, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void B(), n(v++)));
    });
    B();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    e = null, t.store.set(as, null), t.changed();
  }, c = (v) => v.from ? t.who(v.from) : v.label ? `Xtrata Radio · ${v.label}` : "Xtrata Radio";
  let u = {};
  const d = (v) => {
    if (u.box) return u.box;
    const B = at("div", "", "ppp-gift-check");
    u.box = B;
    const M = () => {
      const h = window.turnstile;
      !h || u.rendered || (u.rendered = !0, h.render(B, { sitekey: v, callback: (b) => {
        u.token = b, t.changed();
      }, "expired-callback": () => {
        u.token = void 0;
      } }));
    };
    if (window.turnstile) M();
    else {
      const h = document.createElement("script");
      h.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", h.async = !0, h.onload = M, document.head.append(h);
    }
    return B;
  }, l = (v) => {
    queueMicrotask(() => void v());
  };
  let y;
  async function p(v) {
    var h, b, f, U, Y, et, pt, Rt, _t;
    if (!e || e.claiming || !v.listening) return;
    const B = !!((h = e.view) != null && h.player);
    if (B && !v.root) return;
    e.claiming = !0, e.error = void 0, (b = t.claiming) == null || b.call(t, !0), t.changed();
    const M = async (dt) => {
      const gt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: u.token, ...dt })
      });
      return { res: gt, r: await gt.json().catch(() => ({})) };
    };
    try {
      let dt = 0, gt = v.listening, ee;
      if (B) {
        const yt = Number((f = await t.json("/radio/gift/slots?root=" + encodeURIComponent(v.root))) == null ? void 0 : f.next);
        if (!Number.isSafeInteger(yt) || yt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        dt = yt;
        for (let Ut = 0; ; Ut++) {
          const Gt = await t.album.bind(dt);
          if (gt = Gt.address, ee = await M({ wallet: gt, binding: Gt }), ee.res.status === 409 && /just taken/.test(((U = ee.r) == null ? void 0 : U.error) || "") && Ut < 5) {
            dt += 1;
            continue;
          }
          break;
        }
      } else ee = await M({ wallet: gt });
      const { res: Mt, r: Wt } = ee;
      if (Mt.status === 503 && /sending another gift/.test((Wt == null ? void 0 : Wt.error) || "")) {
        e.waiting = !0, (Y = t.claiming) == null || Y.call(t, !0), clearTimeout(y), y = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!Mt.ok) {
        const yt = String((Wt == null ? void 0 : Wt.error) || "");
        if (Mt.status === 404 || Mt.status === 410 || Mt.status === 409 && /already had a gift|brand-new/.test(yt))
          throw t.store.set(as, null), new Error(yt || "This gift cannot be opened.");
        if (Mt.status === 429 || Mt.status === 403 || Mt.status === 400 && !/wallet number/i.test(yt)) throw new Error(yt || `Could not open the gift (${Mt.status}).`);
        const Gt = /topping up/.test(yt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(yt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(yt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Gt), { retry: !0, slow: /topping up|not paid for yet/.test(yt) });
      }
      e.done = !0, t.store.set(as, null), B ? await t.album.arrived(dt, gt, Wt.txid, BigInt(Wt.amount)) : t.giftSent(Wt.txid, BigInt(Wt.amount));
    } catch (dt) {
      const gt = dt, ee = gt.name === "TypeError" || gt.name === "AbortError" || gt.name === "TimeoutError" || /wallet number/i.test(gt.message);
      if (gt.retry || ee) {
        const Mt = e.tries ?? 0;
        e.tries = Mt + 1, e.retry = { text: gt.retry ? gt.message : "Still sending your gift… the network is slow, trying again." }, (et = t.claiming) == null || et.call(t, !0), clearTimeout(y), y = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, gt.slow ? 6e4 : n(Mt));
      } else
        e.error = gt.message, (pt = t.claiming) == null || pt.call(t, !1);
      u.token = void 0;
      try {
        (_t = (Rt = window.turnstile) == null ? void 0 : Rt.reset) == null || _t.call(Rt, u.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let x = null;
  function E(v) {
    if (!v.listening || !v.depositPending || v.step !== "fund")
      return x = null, [];
    if (!x || x.wallet !== v.listening || t.now() - x.at > 3e4) {
      const M = v.listening;
      x = { ...(x == null ? void 0 : x.wallet) === M ? x : {}, wallet: M, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(M)).then((h) => {
        var b, f;
        (x == null ? void 0 : x.wallet) === M && (x.state = (b = h == null ? void 0 : h.gift) == null ? void 0 : b.state, x.problem = ((f = h == null ? void 0 : h.gift) == null ? void 0 : f.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(x.state === "sending" && x.problem)) return [];
    const B = at("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return B.title = `Network reply: ${x.problem}`, [B];
  }
  function C(v, B) {
    var Y, et;
    const M = B.player, h = BigInt(B.amount), b = [at("p", `🎁 ${c(B)} sent you “${M.title}”${M.subtitle ? ` by ${M.subtitle}` : ""}: ${xo(M).length} ${xo(M).length === 1 ? "song" : "songs"} and ${tl(h).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!v.root && ["fund", "ready", "over", "link"].includes(v.step)))
      return b.push(at("p", v.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : v.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), b;
    if (v.walletCannotAlbums)
      return b.push(at("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), b;
    const U = (et = (Y = v.gate) == null ? void 0 : Y.gifts) == null ? void 0 : et.turnstileSiteKey;
    return U && !u.token ? b.push(at("p", "One quick check and it is yours:", "ppp-mute"), d(U)) : !e.claiming && !e.error && !e.waiting && !e.retry && l(() => p(v)), b.push(...j(v, "Sending your album…")), b;
  }
  function j(v, B) {
    const M = [];
    return e.claiming || e.waiting ? M.push(at("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : B, "ppp-cyan")) : e.retry && M.push(at("p", e.retry.text, "ppp-warn"), or("Try now", () => {
      clearTimeout(y), e.retry = void 0, p(v);
    }, "quiet")), e.error && M.push(at("p", e.error, "ppp-bad"), or("Try again", () => {
      e.error = void 0, p(v);
    })), M;
  }
  const R = (v) => {
    var B;
    return !!e && !e.done && !e.error && o() && !!v.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !v.linked && !v.creditedTo && (v.createdHere || v.brandNew || !!((B = e.view) != null && B.player)) && (v.balance ?? 0n) === 0n && !v.entries.length);
  };
  function S(v) {
    var Rt, _t;
    const B = E(v);
    if (!e || ["off", "elsewhere"].includes(v.step)) return B;
    const M = e.view;
    if (e.error && !M) return [at("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!M) return [at("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return B;
    if (M.status === "claimed" || M.status === "claiming") return [at("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(M.status)) return [at("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (M.status === "pending-deposit") return [at("p", `🎁 ${c(M)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (M.player) return [...C(v, M), ...B];
    if (!!v.listening && (!(v.createdHere || v.brandNew) || !!v.linked || !!v.creditedTo || (v.balance ?? 0n) > 0n || v.entries.length > 0))
      return [at("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), or("Forget this gift link here", a, "quiet")];
    const b = BigInt(M.amount), f = tl(b).toLocaleString(), Y = [at(
      "p",
      `🎁 ${c(M)} sent you ${on(b)} STX of on-chain music: about ${f} paid plays.`,
      "ppp-gift"
    )], et = !!v.listening && (v.createdHere || v.brandNew) && !v.linked && !v.creditedTo && v.step === "fund" && (v.balance ?? 1n) === 0n && !v.depositPending && !v.entries.length, pt = (_t = (Rt = v.gate) == null ? void 0 : Rt.gifts) == null ? void 0 : _t.turnstileSiteKey;
    return et ? (pt && !u.token ? Y.push(at("p", "One quick check and it is yours:", "ppp-mute"), d(pt)) : !e.claiming && !e.error && !e.waiting && !e.retry && l(() => p(v)), Y.push(...j(v, "Sending your gift…"))) : v.step === "intro" ? Y.push(at("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : v.listening && v.linked ? Y.push(at("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), or("Forget this gift link here", a, "quiet")) : v.listening && (v.balance ?? 0n) > 0n && Y.push(at("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), or("Forget this gift link here", a, "quiet")), Y;
  }
  async function m(v, B, M) {
    var h;
    try {
      const b = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(v));
      if ((h = b == null ? void 0 : b.gift) != null && h.returnTo) return { ok: !0, funder: b.gift.returnTo, txId: b.gift.txid ?? void 0, amount: b.gift.amount, distinct: 1 };
    } catch {
      if (M) return { ok: !1 };
    }
    return B();
  }
  const k = at("div", "", "ppp-gift-fold");
  let O = 250000n, K = "", z = "";
  const X = (v) => {
    try {
      const B = JSON.parse(t.store.get(e0(v)) || "[]");
      return Array.isArray(B) ? B : [];
    } catch {
      return [];
    }
  }, A = (v, B) => t.store.set(e0(v), JSON.stringify(B.slice(0, 50)));
  let T = 0;
  async function N(v) {
    const B = X(v);
    for (const M of B)
      if (!(M.view && ["claimed", "refunded", "expired"].includes(M.view.status)))
        try {
          M.view = !M.view || M.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: M.id, ...M.txid ? { txid: M.txid } : {} }) }) : await t.json("/radio/gift?id=" + M.id), M.error = void 0;
        } catch (h) {
          M.error = h.message;
        }
    A(v, B), t.changed();
  }
  async function F(v) {
    if (K) return;
    K = "Starting your gift…", z = "", t.changed();
    let B = null;
    try {
      B = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: v, amount: O.toString() }) });
      const M = X(v);
      M.unshift({ id: B.id, code: B.code, amount: O.toString(), at: t.now() }), A(v, M), K = "Approve the gift in your wallet…", t.changed();
      const h = await t.pay(v, B.depositTo, BigInt(B.deposit), B.memo), b = X(v), f = b.find((U) => U.id === B.id);
      f && (f.txid = h, f.view = { status: "pending-deposit", amount: O.toString(), source: "friend", from: v, label: "", expires: 0 }), A(v, b), z = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", N(v);
    } catch (M) {
      z = M.message || "Not sent.";
    } finally {
      K = "", t.changed();
    }
  }
  const V = (v) => "xtrata.radio.gift.players.v1:" + v, G = (v) => {
    try {
      const B = JSON.parse(t.store.get(V(v)) || "[]");
      return Array.isArray(B) ? B.filter((M) => M && /^[0-9a-f]{16}$/.test(M.id)) : [];
    } catch {
      return [];
    }
  };
  async function zt(v, B) {
    var M;
    if (!K) {
      K = "Checking the player…", z = "", t.changed();
      try {
        const h = B.tracks.split(/[\s,]+/).filter(Boolean).map((pt) => Number(pt.replace(/^#/, ""))), b = G5({ title: B.title.trim(), subtitle: B.subtitle.trim(), tracks: h, cover: (M = B.cover) != null && M.trim() ? Number(B.cover.trim().replace(/^#/, "")) : null });
        K = "Sign in your wallet…", t.changed();
        const f = { admin: v, hash: K5(b), issued: t.now() }, U = await t.sign(v, V5(f));
        K = "Making the player…", t.changed();
        const Y = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: b, request: f, signature: U }) }), et = G(v).filter((pt) => pt.id !== Y.id);
        et.unshift({ id: Y.id, title: Y.title, tracks: Y.tracks }), t.store.set(V(v), JSON.stringify(et.slice(0, 30))), z = `${Y.existing ? "That player already exists" : "Player made"} ✓ “${Y.title}” · ${Y.tracks} songs. Pick it below for a batch.`;
      } catch (h) {
        z = h.message || "Not made.";
      } finally {
        K = "", t.changed();
      }
    }
  }
  const ct = (v, B) => N5(v || location.origin + "/radio.html", B), Ie = (v) => X5({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: v }), I = (v) => {
    try {
      const B = JSON.parse(t.store.get(n0(v)) || "[]");
      return Array.isArray(B) ? B.filter((M) => M && /^[0-9a-f]{16}$/.test(M.id) && Array.isArray(M.codes)) : [];
    } catch {
      return [];
    }
  }, P = (v, B) => t.store.set(n0(v), JSON.stringify(B.slice(0, 20))), ut = (v) => !!v.view && v.view.status === "live" && v.view.copies.waiting + v.view.copies.claiming + v.view.copies.refunding === 0, kt = (v, B) => t.json(v, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(B) });
  let Lt = 0;
  async function Dt(v) {
    const B = I(v);
    for (const M of B)
      if (!ut(M))
        try {
          M.view = !M.view || M.view.status === "pending-deposit" ? await kt("/radio/gift/batch/confirm", { id: M.id, ...M.txid ? { txid: M.txid } : {} }) : await t.json("/radio/gift/batch?id=" + M.id), M.error = void 0;
        } catch (h) {
          M.error = h.message;
        }
    try {
      const M = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(v));
      for (const h of (M == null ? void 0 : M.batches) ?? []) {
        const b = B.find((f) => f.id === h.id);
        if (b) {
          b.error || (b.view = h);
          continue;
        }
        B.push({ id: h.id, codes: [], count: h.count, amount: h.amount, label: h.label, player: h.player, depositTo: "", deposit: h.deposit, memo: h.memo, at: 0, view: h });
      }
    } catch {
    }
    P(v, B), t.changed();
  }
  async function Qt(v, B) {
    const M = I(v).find((h) => h.id === B);
    if (!(!M || !M.depositTo || K)) {
      K = "Approve the payment in your wallet…", z = "", t.changed();
      try {
        const h = await t.pay(v, M.depositTo, BigInt(M.deposit), M.memo), b = I(v), f = b.find((U) => U.id === B);
        f && (f.txid = h), P(v, b), z = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", K = "", Dt(v);
      } catch (h) {
        z = `${/cancel/i.test(h.message) ? "Payment cancelled." : h.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        K = "", t.changed();
      }
    }
  }
  async function Ht(v, B, M, h) {
    if (K) return;
    if (!B.ok) {
      z = B.reason, t.changed();
      return;
    }
    K = "Sign in your wallet…", z = "", t.changed();
    let b = null;
    try {
      const f = { creator: v, count: B.count, amount: B.amount.toString(), label: M, issued: t.now(), ...h ? { player: h } : {} }, U = await t.sign(v, U5(f));
      K = "Making your links…", t.changed(), b = await kt("/radio/gift/batch", { request: f, signature: U });
      const Y = I(v);
      Y.unshift({ id: b.id, codes: b.codes, count: B.count, amount: b.amount, label: M, player: h ?? null, depositTo: b.depositTo, deposit: b.deposit, memo: b.memo, at: t.now() }), P(v, Y);
    } catch (f) {
      z = f.message || "Not made.", K = "", t.changed();
      return;
    }
    K = "", t.changed(), await Qt(v, b.id);
  }
  function qt() {
    const v = !!Pe.value, B = Ue.value === "max" ? O5(v) : Number(Ue.value), M = H5(B, v), h = Number(Ae.value);
    return !Number.isInteger(h) || h < 1 || h > el ? { ok: !1, reason: `Make 1 to ${el} copies at a time.`, album: v, plays: B, amount: M, count: h } : j5(M) ? { ok: !0, reason: "", album: v, plays: B, amount: M, count: h, bill: F5(h, M, v) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: v, plays: B, amount: M, count: h };
  }
  const pe = () => {
    const v = qt();
    if (!v.ok) return v.reason;
    const B = v.bill;
    return `Each copy: ${v.plays.toLocaleString()} paid plays (${on(B.holders)} to song holders, ${on(B.fees)} network fees)${v.album ? `, ${on(B.float)} for the album’s likes` : ""}, ${on(B.reserve)} kept so a listener can return what is left, + ${on(B.sendFee)} to send it = ${on(B.perCopy)} STX. ${v.count} copies = ${on(B.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, qe = (v, B) => B.codes.map((M) => ct(v, M)), mt = at("input");
  mt.type = "range", mt.min = String(Uy), mt.max = String(mf), mt.step = "50000", mt.value = String(O), mt.setAttribute("aria-label", "Gift amount");
  const Fe = at("p", "", "ppp-gift-amount"), nn = or("", () => {
    const v = t.main();
    v && F(v);
  }, "primary"), je = () => {
    Fe.textContent = _n(), nn.textContent = `Gift ${on(O)} STX`;
  };
  mt.oninput = () => {
    O = BigInt(mt.value), je();
  };
  const _n = () => `${on(O)} STX · about ${tl(O).toLocaleString()} paid plays · you pay ${on(O + Ra)} STX with the network fee`;
  je();
  const xe = at("input");
  xe.maxLength = 60, xe.placeholder = "Title, e.g. Proof of Sound", xe.setAttribute("aria-label", "Player title");
  const Se = at("input");
  Se.maxLength = 80, Se.placeholder = "Artist (optional)", Se.setAttribute("aria-label", "Player subtitle");
  const Te = at("textarea");
  Te.rows = 3, Te.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Te.setAttribute("aria-label", "Songs");
  const ie = at("input");
  ie.inputMode = "numeric", ie.placeholder = "Cover inscription number (optional), shown when the album loads", ie.setAttribute("aria-label", "Cover inscription");
  const Pe = at("select");
  Pe.setAttribute("aria-label", "Batch album");
  const Ue = at("select");
  Ue.setAttribute("aria-label", "Plays per copy");
  for (const v of W5) Ue.append(aa(`${v.toLocaleString()} plays`, String(v)));
  Ue.append(aa("Max (1 STX)", "max"));
  const Ae = at("input");
  Ae.type = "number", Ae.min = "1", Ae.max = String(el), Ae.value = "10", Ae.setAttribute("aria-label", "Copies");
  const te = at("input");
  te.maxLength = 40, te.placeholder = "Label, e.g. Opera launch", te.setAttribute("aria-label", "Batch label");
  const oe = at("p", "", "ppp-mute"), Ee = () => {
    oe.textContent = pe();
  };
  for (const v of [Pe, Ue, Ae])
    v.oninput = Ee, v.onchange = Ee;
  Ee();
  function We(v) {
    var b, f, U, Y, et, pt;
    const B = (b = v.gate) == null ? void 0 : b.gifts;
    if (!(B != null && B.enabled) || ["off", "elsewhere", "unsupported"].includes(v.step)) return null;
    const M = t.main(), h = [at("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!M)
      h.push(at("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      nn.disabled = !!K, h.push(mt, Fe, nn), t.now() - T > 3e4 && (T = t.now(), N(M));
      const Rt = X(M);
      if (Rt.length) {
        const _t = at("ul", "", "ppp-gift-list");
        for (const dt of Rt.slice(0, 10)) {
          const gt = (f = dt.view) == null ? void 0 : f.status, ee = dt.error ? dt.error : !gt || gt === "pending-deposit" ? dt.txid ? "payment confirming…" : "waiting for your payment" : gt === "live" ? "ready to share" : gt === "claiming" || gt === "claimed" ? "claimed ✓" : gt === "refunding" ? "expired · refund on its way" : gt === "refunded" ? "expired · refunded to you" : gt, Mt = at("li");
          if (Mt.append(at("span", `${on(BigInt(dt.amount))} STX`, "t"), at("span", ee, ((U = dt.view) == null ? void 0 : U.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Y = dt.view) == null ? void 0 : Y.status) === "live") {
            const Wt = ct(((et = v.gate) == null ? void 0 : et.radioUrl) ?? null, dt.code);
            Mt.append(ws("gift-copy:" + dt.id, "Copy link", () => Wt, "tiny", t.changed), Dy("gift-share:" + dt.id, "Share", () => Ie(Wt), "tiny", t.changed));
          }
          _t.append(Mt);
        }
        h.push(_t);
      }
      if (B.admin) {
        const _t = at("div", "", "ppp-gift-admin"), dt = (yt, Ut) => {
          const Gt = at("label", yt);
          return Gt.append(Ut), Gt;
        }, gt = G(M);
        _t.append(
          at("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          xe,
          Se,
          Te,
          ie,
          or("Sign and make player", () => void zt(M, { title: xe.value, subtitle: Se.value, tracks: Te.value, cover: ie.value }))
        );
        const ee = or("Sign, pay and make links", () => {
          Ht(M, qt(), te.value.trim(), Pe.value || void 0);
        });
        ee.disabled = !!K;
        const Mt = Pe.value;
        Pe.replaceChildren(aa("No album (starter copies)", ""), ...gt.map((yt) => aa(`${yt.title} · ${yt.tracks} songs`, yt.id))), gt.some((yt) => yt.id === Mt) && (Pe.value = Mt), Ee(), _t.append(
          at("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          dt("Album ", Pe),
          dt("Plays each ", Ue),
          dt("Copies ", Ae),
          te,
          oe,
          ee
        ), t.now() - Lt > 3e4 && (Lt = t.now(), Dt(M));
        const Wt = I(M);
        if (Wt.length) {
          const yt = at("ul", "", "ppp-gift-list");
          for (const Ut of Wt.slice(0, 10)) {
            const Gt = Ut.view, it = Gt == null ? void 0 : Gt.copies, wt = Ut.error ? Ut.error : !Gt || Gt.status === "pending-deposit" ? Ut.txid ? "payment confirming…" : "waiting for your payment" : `${it.claimed} of ${Gt.count} claimed${it.refunding + it.refunded ? ` · ${it.refunded} refunded${it.refunding ? `, ${it.refunding} on their way` : ""}` : ""}`, Kt = at("li");
            if (Kt.append(at("span", `${Ut.label || "Batch"} · ${Ut.count} × ${on(BigInt(Ut.amount))} STX`, "t"), at("span", wt, "ppp-mute")), !Ut.txid && Ut.depositTo && (!Gt || Gt.status === "pending-deposit") && Kt.append(or("Pay now", () => void Qt(M, Ut.id), "tiny")), Ut.codes.length && (Gt == null ? void 0 : Gt.status) === "live") {
              const ge = qe(((pt = v.gate) == null ? void 0 : pt.radioUrl) ?? null, Ut);
              Kt.append(
                ws("batch-copy:" + Ut.id, "Copy all links", () => ge.join(`
`), "tiny", t.changed),
                ws("batch-csv:" + Ut.id, "Copy as CSV", () => ["copy,link", ...ge.map((Tt, Le) => `${Le + 1},${Tt}`)].join(`
`), "tiny", t.changed)
              );
            } else Ut.codes.length || Kt.append(at("span", "links were made on another device", "ppp-mute"));
            yt.append(Kt);
          }
          _t.append(yt);
        }
        h.push(_t);
      }
    }
    return K && h.push(at("p", K, "ppp-cyan")), z && h.push(at("p", z, /✓/.test(z) ? "ppp-ok" : "ppp-warn")), k.replaceChildren(...h), k;
  }
  return { banner: S, funder: m, renderFold: We, liveGift: o, setAside: a, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: R };
}
const Z5 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function Q5(t) {
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
const J5 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function t$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = J5(i);
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
function e$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const li = 12, n$ = 5e3, Qe = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, ui = (t, e, n = "") => {
  const r = Qe("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function r$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = li;
  const l = Qe("div", "", "ppp-shelf-box"), y = (N) => "xtrata.radio.shelf.pins.v1:" + N, p = (N) => "xtrata.radio.shelf.recent.v1:" + N, x = (N, F) => {
    try {
      return JSON.parse(t.store.get(N) || "null") ?? F;
    } catch {
      return F;
    }
  }, E = (N) => new Set(x(y(N), []).filter((F) => Number.isSafeInteger(F))), C = (N) => {
    const F = x(p(N), {}), V = {};
    for (const [G, zt] of Object.entries(F)) Number.isSafeInteger(Number(G)) && typeof zt == "number" && (V[Number(G)] = zt);
    return V;
  };
  async function j(N) {
    if (!s) {
      s = !0, i = !1;
      try {
        const F = [];
        let V = 0, G = 0;
        for (let zt = 0; zt < n$ / 100 + 1; zt++) {
          const ct = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${V}&limit=100`);
          if (F.push(...Q5(ct == null ? void 0 : ct.shelf)), G = Number(ct == null ? void 0 : ct.total) || F.length, !(ct != null && ct.next) || !Number.isSafeInteger(ct.next)) break;
          V = ct.next;
        }
        N === e && (n = F, r = G, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const R = () => {
    o = -1 / 0;
  }, S = Qe("input");
  S.type = "search", S.placeholder = "Search title, artist or #", S.setAttribute("aria-label", "Search your albums"), S.oninput = () => {
    a = S.value, d = li, t.changed();
  };
  const m = Qe("select");
  m.setAttribute("aria-label", "Sort albums");
  for (const N of Z5) {
    const F = document.createElement("option");
    F.value = N.value, F.textContent = N.label, m.append(F);
  }
  m.onchange = () => {
    c = m.value, d = li, t.changed();
  };
  const k = ui("", () => {
    u = !u, d = li, t.changed();
  }, "tiny"), O = Qe("div", "", "ppp-shelf-tools");
  O.append(S, m, k);
  const K = Qe("div"), z = Qe("div");
  function X(N) {
    const F = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (F !== e && (e = F, n = [], r = 0, o = -1 / 0, d = li), !F || N.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && j(F), !n.length)
      return i ? (z.replaceChildren(Qe("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ui("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(z), l) : null;
    const V = E(F), G = C(F), zt = t$(n, { query: a, sort: c, pinnedOnly: u, pins: V, recents: G });
    S.value !== a && (S.value = a), m.value = c, k.textContent = u ? "★ Pinned only" : "☆ Pinned only", k.setAttribute("aria-pressed", String(u));
    const ct = [];
    if (N.slot > 0 && ct.push(ui("← My player", () => t.open(0), "quiet")), !zt.length) ct.push(Qe("p", "No album matches that.", "ppp-mute"));
    else {
      const Ie = Qe("ul", "", "ppp-shelf-list");
      for (const I of zt.slice(0, d)) {
        const P = Qe("li", "", I.slot === N.slot ? "now" : ""), ut = V.has(I.slot), kt = ui(ut ? "★" : "☆", () => {
          const Ht = new Set(V);
          ut ? Ht.delete(I.slot) : Ht.add(I.slot), t.store.set(y(F), JSON.stringify([...Ht])), t.changed();
        }, "tiny");
        kt.setAttribute("aria-label", ut ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const Lt = [I.player.subtitle, `${xo(I.player).length} ${xo(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Dt = I.slot === N.slot, Qt = ui(Dt ? "Playing" : "Play", () => {
          t.store.set(p(F), JSON.stringify(e$({ ...G, [I.slot]: t.now() }))), t.open(I.slot);
        }, Dt ? "tiny" : "tiny primary");
        Qt.disabled = Dt, P.append(kt, Qe("span", I.player.title, "t"), Qe("span", " " + Lt, "ppp-mute"), Qt), Ie.append(P);
      }
      ct.push(Ie), zt.length > d && ct.push(ui(`Show more (${zt.length - d} left)`, () => {
        d += li, t.changed();
      }, "quiet"));
    }
    return i && ct.push(Qe("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), K.replaceChildren(...ct), l.firstChild !== O && l.replaceChildren(O, K), l;
  }
  return { render: X, invalidate: R, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const N = C(e), F = [...n].filter((V) => V.player).sort((V, G) => (N[G.slot] ?? 0) - (N[V.slot] ?? 0) || G.slot - V.slot)[0];
    return F ? { slot: F.slot, title: F.player.title } : null;
  } };
}
const s$ = [
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
function i$(t) {
  for (const [e, n] of s$) if (n.test(t)) return e;
  return null;
}
const Fy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), jy = (t) => /Android/.test(t);
function o$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Fy(e) ? "x-safari-" + n.href : jy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const a$ = (t) => Fy(t) ? "Safari" : jy(t) ? "Chrome" : "your browser", r0 = document.getElementById("ppp");
r0 && c$(r0);
function c$(t) {
  var M;
  const e = xw(), n = (h) => t.querySelector(h), r = n(".ppp-frame");
  let s = null;
  const i = async (h, b) => {
    const f = await fetch(h, { cache: "no-store", ...b, signal: AbortSignal.timeout(15e3) }), U = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((U == null ? void 0 : U.error) || `Request failed (${f.status}).`);
    return U;
  }, o = q6({
    now: Date.now,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    config: (h) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(h || "")),
    links: async (h) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(h))).links ?? [],
    mainOf: async (h) => {
      var f;
      const b = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(h))).links;
      return ((f = b == null ? void 0 : b.find((U) => U.listening === h)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (h) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(h) });
    },
    bridge: async (h) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${h}; publickey-credentials-create ${h}`), s.referrerPolicy = "no-referrer";
      const b = new Promise((et, pt) => {
        s.addEventListener("load", () => et(), { once: !0 }), setTimeout(() => pt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = h + "/", r.replaceChildren(s), await b;
      const f = new fw({ walletOrigin: h, frame: s, timeoutMs: 30 * 6e4 }), U = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), Y = (et, pt) => U.has(et) ? f.request(et, pt) : Promise.race([
        f.request(et, pt),
        new Promise((Rt, _t) => setTimeout(() => _t(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await Y("listening.status"), { request: Y };
    },
    chain: {
      verify: k6,
      balance: C6,
      account: L6,
      owner: T6,
      broadcast: B6,
      transaction: M6,
      confirmedNonce: async (h) => {
        const b = await Jr(`/v2/accounts/${h}?proof=0`);
        if (!Number.isSafeInteger(b == null ? void 0 : b.nonce) || b.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(b.nonce);
      }
    },
    signWithMain: (h, b) => Hh({ ...b, network: "mainnet", stxAddress: h }),
    deposit: (h, b, f) => new Promise((U, Y) => Mh({
      recipient: b,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: h,
      network: new rl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (et) => U(et.txId || ""),
      onCancel: () => Y(new Error("Deposit cancelled. Nothing was sent.")),
      onError: Y
    })),
    validate: N6,
    tabLock: (h) => new Promise((b) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        b(!0);
        return;
      }
      f.request("xtrata-ppp:" + h, { ifAvailable: !0 }, async (U) => {
        b(!!U), U && await new Promise(() => {
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
      set: (h, b) => {
        try {
          localStorage.setItem(h, b);
        } catch {
        }
      }
    },
    changed: () => ke(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (h) => {
      var b, f;
      return a.funder(h, () => D6(h, Jr), !!((f = (b = o.snapshot().gate) == null ? void 0 : b.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (h) => {
      const b = await i("/radio/gift/for?wallet=" + encodeURIComponent(h)), f = b == null ? void 0 : b.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (h, b) => z6(h, (f) => Jr(f), b),
    likesChanged: () => {
      var h, b;
      (b = (h = window.XtrataRadio) == null ? void 0 : h.refreshLikes) == null || b.call(h);
    },
    likeState: async (h, b) => {
      const f = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: h, ids: String(b) })), U = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((Y) => (Y == null ? void 0 : Y.id) === b) : null;
      if (!U || typeof U.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: U.liked, by: Array.isArray(U.by) ? U.by.filter((Y) => typeof Y == "string") : U.liked ? [h] : [] };
    },
    likeSent: (h, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: h, liked: b } })),
    nameOf: (h) => T(h) ?? void 0,
    likeConfirmed: (h, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: h, liked: b } })),
    likeFailed: (h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: h } }))
  }), a = Y5({
    json: i,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    pay: (h, b, f, U) => new Promise((Y, et) => Mh({
      recipient: b,
      amount: f.toString(),
      memo: U,
      stxAddress: h,
      network: new rl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (pt) => Y(pt.txId || ""),
      onCancel: () => et(new Error("Gift cancelled. Nothing was sent.")),
      onError: et
    })),
    sign: (h, b) => Hh({ ...b, network: "mainnet", stxAddress: h }),
    giftSent: (h, b) => o.giftSent(h, b),
    claiming: (h) => o.giftClaiming(h),
    album: { bind: (h) => o.bindAlbum(h), arrived: async (h, b, f, U) => {
      c.invalidate(), await o.albumArriving(h, b, f, U);
    } },
    who: (h) => V(h),
    changed: () => ke(o.snapshot()),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, b) => {
        try {
          b === null ? localStorage.removeItem(h) : localStorage.setItem(h, b);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = r$({
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
      set: (h, b) => {
        try {
          b === null ? localStorage.removeItem(h) : localStorage.setItem(h, b);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => ke(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (h) => {
    if (!h || !Number.isSafeInteger(h.song) || h.song < 0) return !1;
    I();
    const b = P(h.song, { title: h.title, artist: h.artist });
    return o.heart({ song: h.song, title: b.title || void 0, artist: b.artist || void 0, likedBy: Array.isArray(h.likedBy) ? h.likedBy : void 0 });
  };
  let u;
  window.XtrataRadioListeningIdentity = () => {
    const h = o.snapshot();
    return h.solo && h.step !== "off" && h.step !== "elsewhere" ? h.listening : void 0;
  };
  const d = (h) => {
    var f, U;
    const b = window.XtrataRadioListeningIdentity();
    b !== u && (u = b, (U = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || U.call(f));
  };
  let l = "", y = null, p = !1, x = !1;
  const E = (h) => {
    var Rt, _t, dt, gt, ee, Mt, Wt, yt;
    const b = window.XtrataRadio;
    if (!(b != null && b.setGiftPlayer) || !(b != null && b.setGiftStop)) return;
    const f = h.step === "off" || h.step === "elsewhere" ? null : ((Rt = h.gift) == null ? void 0 : Rt.player) ?? null, U = f ? f.id + ":" + f.cover + ":" + f.tracks.map((Ut) => Ut.id).join(",") : "";
    U !== l && (b.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: xo(f).map((Ut) => Ut.id), hidden: ((_t = q5(f)) == null ? void 0 : _t.id) ?? null, cover: f.cover } : null), l = U);
    const Y = ((dt = h.giftStop) == null ? void 0 : dt.text) ?? null;
    Y !== y && (b.setGiftStop(Y), y = Y);
    const et = ((gt = h.giftStop) == null ? void 0 : gt.reason) === "arriving";
    et !== x && ((ee = b.setGiftWait) == null || ee.call(b, et), x = et);
    const pt = !!f && !!((Mt = h.albumLock) != null && Mt.locked);
    pt !== p && ((Wt = b.setGiftLock) == null || Wt.call(b, pt), p = pt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(h.step) && ((yt = b.forgetWallets) == null || yt.call(b));
  }, C = (h) => h ? h.slice(0, 6) + "…" + h.slice(-4) : "", j = (h) => (Number(h) / 1e6).toFixed(h < 1000n ? 6 : 4), R = (h) => {
    const b = Math.round((Date.now() - h) / 6e4);
    return b < 1 ? "now" : b < 60 ? `${b}m` : b < 1440 ? `${Math.round(b / 60)}h` : `${Math.round(b / 1440)}d`;
  }, S = (h) => `https://explorer.hiro.so/txid/${h}?chain=mainnet`, m = (h, b = "", f = "") => {
    const U = document.createElement(h);
    return b && (U.textContent = b), f && (U.className = f), U;
  }, k = (h, b, f = "") => {
    const U = m("button", h, f);
    return U.type = "button", U.onclick = b, U;
  }, O = (h, b) => {
    const f = m("a", h);
    return f.href = b, f.target = "_blank", f.rel = "noopener", f;
  };
  let K = null, z = location.hash === "#give";
  z && history.replaceState(null, "", location.pathname + location.search);
  let X = !1;
  const A = T5((h) => C5({ address: h, network: "mainnet" }), () => ke(o.snapshot())), T = (h) => A.get(h), N = i$(navigator.userAgent), F = (h, b) => {
    const f = navigator.userAgent, U = a$(f), Y = `${location.origin}${location.pathname}${b ? `#gift=${b}` : ""}`, et = [m("p", `You are in ${h}'s built-in browser, where passkeys often do not work. Open this page in ${U} to make your listening wallet${b ? " and claim your gift" : ""}.`, "ppp-warn")], pt = m("div", "", "ppp-open-row"), Rt = o$(Y, f);
    if (Rt) {
      const _t = m("a", `Open in ${U}`, "primary ppp-open-in");
      _t.href = Rt, _t.dataset.homeAction = "radio:open-in-browser", pt.append(_t);
    }
    return pt.append(ws("copy-page-link", "Copy link", () => Y, Rt ? "" : "primary", () => ke(o.snapshot()))), et.push(pt, m("p", `If that does not open ${U}, use ${h}'s menu (••• or ⋮) and choose "Open in ${U === "your browser" ? "browser" : U}", or paste the copied link there.`, "ppp-mute")), et;
  }, V = (h) => T(h) ?? C(h), G = (h) => h.slice(0, 2).map(V).join(" and ") + (h.length > 2 ? ` and ${h.length - 2} more` : ""), zt = /* @__PURE__ */ new Map();
  let ct = !1;
  const Ie = (h) => !h || /^(?:Inscription )?#\d+$/.test(h.trim()), I = () => {
    ct || (ct = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((h) => h.ok ? h.json() : null).then((h) => {
      for (const b of Array.isArray(h == null ? void 0 : h.tracks) ? h.tracks : []) {
        const f = Number(b == null ? void 0 : b.id);
        Number.isSafeInteger(f) && zt.set(f, { title: typeof b.title == "string" ? b.title : void 0, artist: typeof b.artist == "string" ? b.artist : void 0 });
      }
      ke(o.snapshot());
    }).catch(() => {
      ct = !1;
    }));
  }, P = (h, b) => {
    const f = zt.get(h), U = M5(h, [f == null ? void 0 : f.title, b == null ? void 0 : b.title].find((et) => !Ie(et)) || ""), Y = B5(h, (f == null ? void 0 : f.artist) || (b == null ? void 0 : b.artist) || "");
    return { title: U, artist: Y };
  }, ut = (h) => {
    const { title: b, artist: f } = P(h.song, h);
    return b ? `“${b}”${f ? ` — ${f}` : ""}` : `Song #${h.song}${f ? ` — ${f}` : ""}`;
  }, kt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Lt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Dt(h) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(h.step) ? ["", ""] : h.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : h.step === "over" ? ["OVER 1 STX", "bad"] : h.step === "locked" ? ["LOCKED", "mute"] : h.step === "intro" || h.step === "link" ? ["", ""] : h.step === "fund" ? h.depositPending ? ["ON ITS WAY", "warn"] : h.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : h.payingOn && h.session && h.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function Qt(h, b, f = "", U) {
    const Y = m("dt", h), et = m("dd", b, f);
    return U && et.append(" ", U), [Y, et];
  }
  const Ht = document.getElementById("ppp-top"), qt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, pe = () => {
    var b, f;
    const h = o.snapshot();
    if (h.step === "connect" || h.step === "wrong-wallet") {
      (b = document.getElementById("radio-wallet-connect")) == null || b.click();
      return;
    }
    if (h.step === "elsewhere" && ((f = h.gate) != null && f.radioUrl)) {
      location.href = h.gate.radioUrl;
      return;
    }
    h.step === "locked" && !h.armed && !h.busy && o.unlock(), h.step === "ready" && !h.payingOn && !h.busy && o.switchOn(), qt();
  };
  Ht && (Ht.onclick = pe);
  function qe(h) {
    if (!Ht) return;
    const b = (U, Y, et) => {
      Ht.hidden = !1, Ht.className = "ppp-top" + (Y ? " is-" + Y : ""), Ht.replaceChildren(m("span", "", "dot"), document.createTextNode(U)), Ht.title = et;
    }, f = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0;
    switch (h.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Ht.hidden = !0;
        return;
      case "elsewhere":
        return b("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        Ht.hidden = !0;
        return;
      case "intro":
        return b("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return b(`Connect ${V(h.linked)}`, "warn", `This device's listening wallet belongs to ${V(h.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return b(h.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return b("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return h.depositPending ? b("Funds on their way", "quiet", "Paying starts by itself when they land") : b(h.entries.some((U) => U.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return b("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return b("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return h.payingOn && f > 0 ? b(`On · ${f.toLocaleString()} plays left`, "on", "Paying artists as you listen") : b("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const mt = document.getElementById("pppNudge"), Fe = document.getElementById("onair");
  (M = mt == null ? void 0 : mt.querySelector("button")) == null || M.addEventListener("click", () => pe());
  const nn = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, je = {
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
  function _n(h) {
    var pt;
    if (h.step === "loading") return;
    const b = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0, f = h.step === "ready" && h.payingOn && b > 0, U = h.step === "fund" && h.depositPending, Y = f || U ? "" : nn[h.step] ?? "", et = f ? "on" : Y ? "off" : "";
    if (et ? document.documentElement.dataset.ppp = et : delete document.documentElement.dataset.ppp, Fe && (Fe.hidden = !et, Fe.querySelector(".onair-sub").textContent = f ? `Paying artists · ${b.toLocaleString()} plays left` : "Not paying"), mt && (mt.hidden = et !== "off", et === "off")) {
      const Rt = Math.floor(Number(1000000n / An(BigInt(((pt = h.gate) == null ? void 0 : pt.limits.playFee) ?? "300"))));
      mt.querySelector(".nudge-t").textContent = "⚠ " + Y, mt.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${Rt.toLocaleString()} plays, on-chain, straight to the artists.`, mt.querySelector("button").textContent = je[h.step] ?? "Start paying";
    }
  }
  let xe = "";
  function Se(h) {
    const b = m("div", "", "ppp-pick");
    h.funderMultiple && h.returnToKind === "funder" && b.append(m("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), h.returnToKind === "funder" && b.append(m("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = m("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = xe, f.oninput = () => {
      xe = f.value;
    };
    const U = k(h.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), xe = "";
    }, "tiny");
    return b.append(f, " ", U), h.returnToKind === "chosen" && b.append(" ", k("Back to the funder", () => o.clearReturnAddress(), "tiny")), b;
  }
  const Te = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function ie() {
    const h = m("p", Te + " ", "ppp-mute");
    return h.append(O("Xverse", "https://www.xverse.app/download"), " · ", O("Leather", "https://leather.io/install-extension")), h;
  }
  let Pe = "";
  const Ue = (h) => {
    const b = document.documentElement, f = h.solo && !h.main ? h.listening ? C(h.listening) : "new" : "", U = Q6() ? "1" : "";
    `${f}|${U}` !== Pe && (Pe = `${f}|${U}`, f ? b.dataset.pppSolo = f : delete b.dataset.pppSolo, U ? b.dataset.pppWalletInstalled = U : delete b.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const h of [1500, 4e3, 9e3]) setTimeout(() => ke(o.snapshot()), h);
  function Ae(h, b = "") {
    var Y;
    const f = m("div", "", "ppp-topup"), U = (Y = h.likeFunds) == null ? void 0 : Y.balance;
    f.append(m("span", "Add plays from My player: ", "ppp-mute"));
    for (const et of au) {
      const pt = k(`+${(Number(et) / 1e6).toFixed(2)} STX`, () => void o.topUpAlbum(et), b);
      pt.disabled = U === void 0 || U < et + 6000n || h.depositPending || !!h.busy, f.append(pt);
    }
    return U !== void 0 && U < au[0] + 6000n && f.append(m("p", "My player is nearly empty: add STX to it first (switch to My player above).", "ppp-mute")), f;
  }
  function te(h) {
    const b = h.likeFunds;
    if (!b || !b.album || !b.low && !b.pending) return [];
    const f = m("div", "", "ppp-pick ppp-lowbox");
    if (!b.low) {
      const Y = m("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return b.txid && Y.append(O("View", S(b.txid))), f.append(Y), [f];
    }
    f.append(m("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(m("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(m("p", b.address, "ppp-addr-full"));
    const U = m("div", "", "ppp-open-row");
    if (U.append(ws("copy-likes-address", "Copy address", () => b.address, "primary", () => ke(o.snapshot()))), b.main && !h.solo) {
      const Y = ys - (b.balance ?? 0n);
      Y > 0n && U.append(k(`Pay ${In(Y)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(U), f.append(m("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const oe = (h) => {
    const b = m("div", "", "ppp-wait");
    b.dataset.since = String(h.since), b.dataset.grace = String(h.graceMs), b.setAttribute("role", "progressbar"), b.setAttribute("aria-label", "Your plays are arriving");
    const f = m("p", "", "ppp-wait-t"), U = m("div", "", "ppp-wait-track");
    return U.append(m("div", "", "ppp-wait-fill")), b.append(f, U), Ee(b), b;
  };
  function Ee(h) {
    const b = Number(h.dataset.since), f = Number(h.dataset.grace) || 6e4, U = Math.max(0, Date.now() - b), Y = h.querySelector(".ppp-wait-fill"), et = h.querySelector(".ppp-wait-t");
    if (U < f) {
      const pt = Math.ceil((f - U) / 1e3);
      Y.style.width = Math.max(4, Math.min(95, U / f * 100)).toFixed(0) + "%", et.textContent = `Your plays are arriving… usually about a minute · ${pt}s`, h.classList.remove("is-long"), h.setAttribute("aria-valuenow", String(Math.round(U / f * 100)));
    } else
      Y.style.width = "", et.textContent = "Still arriving… this can take a few minutes. Nothing for you to do: it starts by itself.", h.classList.add("is-long"), h.removeAttribute("aria-valuenow");
  }
  let We = 0;
  setInterval(() => {
    const h = document.querySelectorAll(".ppp-wait");
    if (!h.length) {
      We = 0;
      return;
    }
    h.forEach(Ee), ++We % 10 === 0 && ke(o.snapshot());
  }, 1e3);
  function ke(h) {
    var Qs, Js, gn, ti, yn, ei, br, mr, xr, Sr, ss, nr, Un;
    const b = a.inProgress(h), f = b && h.step === "fund" ? { ...h, depositPending: !0 } : h;
    if (d(), E(h), Ue(f), !b && a.inProgress(h) || (qe(f), _n(f), t.hidden = f.step === "off", t.hidden)) return;
    const [U, Y] = Dt(f), et = n(".ppp-state");
    et.textContent = U, et.className = "ppp-state" + (Y ? " ppp-state--" + Y : ""), et.hidden = !U;
    const pt = !!f.busy || f.armed, Rt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (pt || !["intro", "loading"].includes(f.step));
    r.hidden = !Rt, r.classList.toggle("ppp-frame--rest", !pt && !X);
    const _t = n(".ppp-frame-label");
    _t.hidden = !0;
    const dt = W6(f) ?? K;
    K = dt;
    const gt = Y6(f, dt);
    n(".ppp-badge").hidden = !gt;
    const ee = n(".ppp-steps"), Mt = n(".ppp-stage");
    ee.hidden = Mt.hidden = !gt, dt && gt && (ee.replaceChildren(...cu(f.solo).map((q, tt) => {
      const ae = m("li", "", tt < dt.at ? "done" : tt === dt.at ? dt.blocked ? "now blocked" : "now" : "");
      return ae.append(m("span", tt < dt.at ? "✓" : String(tt + 1), "n"), q), tt === dt.at && ae.setAttribute("aria-current", "step"), ae;
    })), Mt.textContent = dt.caption, Mt.className = "ppp-stage " + (dt.at >= cu(f.solo).length ? "ppp-ok" : dt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Wt = n(".ppp-facts"), yt = [];
    f.main && ((Qs = f.gate) != null && Qs.here) && !f.solo && yt.push(...Qt("Your wallet", V(f.main), "ppp-addr-short"));
    const Ut = () => {
      if (!f.listening) return;
      const q = ws("copy-listening", "Copy", () => f.listening || "", "tiny", () => ke(o.snapshot()));
      yt.push(...Qt(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", C(f.listening), "ppp-addr-short", q));
    };
    if (f.linked || Ut(), f.listening && f.step !== "intro")
      if (f.linked)
        yt.push(...Qt("Credited to", `${V(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Ut();
      else if (f.solo) {
        f.creditedTo && yt.push(...Qt("Credited to", `${V(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const q = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${V(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        yt.push(...Qt("Returns go to", f.gift ? q : f.returnTo && !T(f.returnTo) ? q.replace(C(f.returnTo), f.returnTo) : q, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else yt.push(...Qt("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Js = f.gate) != null && Js.here)) {
      const q = f.linkedListening.map((tt) => C(tt) + (tt === f.listening ? " (this one)" : "")).join(", ");
      yt.push(...Qt(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", q, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const q = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      yt.push(...Qt("Balance", `${In(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, q));
    }
    const Gt = f.entries.find((q) => q.kind === "play");
    Gt && I(), Gt && yt.push(...Qt("Last paid song", `${ut(Gt)} → ${V(Gt.recipient)}`, kt[Gt.status] || "")), Wt.replaceChildren(...yt), Wt.hidden = !yt.length;
    const it = [], wt = [], Kt = [], ge = [], Tt = An(BigInt(((gn = f.gate) == null ? void 0 : gn.limits.playFee) ?? "300")), Le = `Each song you listen to for 30 seconds sends ${In(ja)} STX to whoever holds it, plus a ${In(Tt - ja)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, rs = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (it.push(m("p", "Pay artists as you listen.")), (ti = f.gate) != null && ti.radioUrl) {
          const tt = m("p");
          tt.append(O("Open the pay-per-play radio →", f.gate.radioUrl)), it.push(tt);
        }
        wt.push(m("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const tt = [f.linked, ...f.others];
          it.push(m("p", tt.length > 1 ? `This device has listening wallets for ${G(tt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${V(f.linked)}. Connect that wallet to keep paying artists.`)), wt.push(m("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          it.push(m("p", "Connect your wallet to pay artists as you listen.")), wt.push(m("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        it.push(m("p", `This device's listening wallet belongs to ${V(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), wt.push(m("p", `You are connected as ${V(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), wt.push(m("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Kt.push(k("Switch wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        }, "primary"));
        break;
      case "not-invited":
        it.push(m("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        it.push(m("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        it.push(m("p", `Pay artists ${In(Tt)} STX a song as you listen.`)), wt.push(m("p", Le)), wt.push(m("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), wt.push(m("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (it.push(m("p", `This device already has a listening wallet for ${G(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), wt.push(m("p", `Otherwise, set up a new listening wallet for ${V(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && wt.push(m("p", `This is the listening wallet for ${V(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && wt.push(m("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const q = a.liveGift();
        Kt.push(k(q ? "Claim my gift · no wallet needed" : f.solo ? "Turn on pay-per-play · no wallet needed" : f.others.length && f.main ? `Set up for ${V(f.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !q && !f.solo && f.main && f.others.length && Kt.push(k("Switch wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        })), !q && f.solo && Kt.push(k("I have a Stacks wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        })), Kt.push(k("I already have a listening wallet", () => void o.unlock(!0))), q && Kt.push(k("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (it.push(m("p", "Locked.", "ppp-mute")), Kt.push(k(f.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), ge.push(k("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        it.push(m("p", `Link to ${V(f.main)} · free`)), wt.push(m("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), wt.push(m("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Kt.push(k(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        it.push(m("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && it.push(oe(f.arrival)) : (yn = f.gift) != null && yn.player ? it.push(m("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? it.push(m("p", "Out of funds · top up to keep paying", "ppp-bad")) : it.push(m("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / Tt)).toLocaleString()} songs`)), (ei = f.gift) != null && ei.player ? wt.push(m("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && wt.push(m("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && wt.push(m("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), b || (f.solo ? (wt.push(m("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), wt.push(m("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Kt.push(ws("copy-address", "Copy my address", () => f.listening || "", "primary", () => ke(o.snapshot())))) : wt.push(m("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const tt = m("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          tt.append(O("View", S(f.depositTxid))), it.push(tt);
        } else f.allowance > 0n && !f.solo && Kt.push(k(`Deposit ${In(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        it.push(m("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (it.push(m("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), it.push(Se(f))), (!f.solo || f.returnTo) && Kt.push(k("Return excess", () => void o.returnFunds("excess"), "primary"), k("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const tt = Math.min(f.session.playsLeft, f.playsLeft);
          it.push(m("p", `Paying as you listen · up to ${tt.toLocaleString()} plays left`, "ppp-ok")), wt.push(m("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Kt.push(k("Switch off", () => void o.switchOff()));
        } else
          it.push(m("p", "Paying is off. Music stays free.", "ppp-mute")), Kt.push(k("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        f.queued && it.push(m("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && it.push(m("p", "Running low · top up", "ppp-warn")), f.depositPending ? it.push(m("p", "Top-up on its way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Kt.push(k(`Top up ${In(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && wt.push(m("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && wt.push(Se(f)), wt.push(ie()), f.slot === 0 && f.step === "ready" && f.entries.some((q) => q.kind === "play" && q.status === "confirmed"))) {
      const q = m("p", "New to Stacks? ", "ppp-mute");
      q.append(O("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), it.push(q);
    }
    if (f.walletOutdated && wt.push(m("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (it.push(m("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Kt.push(k("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && ge.push(k(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${V(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((br = f.gift) != null && br.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && ge.push(Ae(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && ge.push(k("Lock", () => void o.lock(), "quiet")), Rt && !pt && ge.push(k(X ? "Hide listening wallet box" : "Show listening wallet box", () => {
      X = !X, ke(o.snapshot());
    }, "quiet")), [...Kt, ...ge].forEach((q) => q.disabled = rs), rs && (Kt.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((mr = f.gift) != null && mr.player)) {
      const q = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", tt = it.at(0);
      f.step === "ready" && tt ? tt.append(m("span", ` · ${j(f.balance)} STX`, q)) : it.push(m("p", `Balance ${j(f.balance)} STX`, q));
    }
    if ((xr = f.gift) != null && xr.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const q = m("p", "", "ppp-gift");
      q.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && q.append(" · ", f.gift.player.subtitle);
      const tt = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? m("span", " · plays on their way", "ppp-warn") : m("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      tt && q.append(tt);
      const ae = (Sr = it.at(0)) == null ? void 0 : Sr.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && ae && /STX/.test(ae.textContent ?? "") && ae.remove(), it.unshift(q), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          it.splice(1, 0, m("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Ae(f, "primary"));
        else {
          const ve = m("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ve.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ve.append(O("Xverse", "https://www.xverse.app/download"), " and ", O("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), it.splice(1, 0, ve);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const q = f.returnPlan, tt = m("div", "", "ppp-pick");
      tt.append(m("p", q.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ae = m("ul", "", "ppp-gift-list");
      q.steps.forEach((ve, is) => {
        const Er = ve.kind === "gift" ? "the unused gift" : ve.kind === "deposit" ? "what was added to it" : "the rest", Jt = m("li");
        Jt.append(m("span", `${is + 1}. ${In(BigInt(ve.send))} STX · ${Er}`, "t"), m("span", ve.to ? ` → ${V(ve.to)}` : " → choose an address below", ve.to ? "ppp-mute" : "ppp-warn")), ae.append(Jt);
      }), tt.append(ae), q.kept && tt.append(m("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), q.steps.some((ve) => !ve.to) && tt.append(Se(f)), tt.append(k(q.steps.length > 1 ? `Confirm part 1 of ${q.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), it.push(tt);
    }
    it.unshift(...a.banner(h)), it.unshift(...te(f)), N && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) && it.unshift(...F(N, a.pendingCode())), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && it.unshift(m("p", `This is ${V(f.creditedTo)}'s listening wallet. Plays and likes count for ${V(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...it);
    const gr = document.querySelector(".ppp-switch");
    if (gr) {
      const q = c.latest(), tt = f.slot > 0, ae = ["fund", "ready", "over"].includes(f.step) && (tt || !!q);
      if (gr.hidden = !ae, ae) {
        const ve = (Er, Jt, Ri, os) => {
          const vn = k("", os, "ppp-tab");
          return vn.setAttribute("aria-pressed", String(Ri)), vn.append(m("span", Er, "tt"), m("span", Jt === void 0 ? "…" : `${j(Jt)} STX`, "ts")), vn.disabled = !!f.busy, vn;
        }, is = tt ? ((nr = (ss = f.gift) == null ? void 0 : ss.player) == null ? void 0 : nr.title) ?? "Album" : q.title;
        gr.replaceChildren(
          ve("🎧 My player", tt ? (Un = f.likeFunds) == null ? void 0 : Un.balance : f.balance, !tt, () => {
            tt && o.openAlbum(0);
          }),
          ve("💿 " + is, tt ? f.balance : void 0, tt, () => {
            !tt && q && o.openAlbum(q.slot);
          })
        );
      }
    }
    const er = c.render(f), ue = document.querySelector(".ppp-shelf");
    if (ue) {
      ue.hidden = !er;
      const q = ue.querySelector("summary");
      q && (q.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const tt = ue.querySelector(".ppp-shelf-body");
      er && tt && !tt.contains(er) && tt.replaceChildren(er);
    }
    const pn = a.renderFold(h);
    if (n(".ppp-gifts").hidden = !pn, pn && !n(".ppp-gift-body").contains(pn) && n(".ppp-gift-body").replaceChildren(pn), pn && z) {
      z = !1;
      const q = n(".ppp-gifts");
      q.open = !0, requestAnimationFrame(() => q.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...wt), n(".ppp-actions").replaceChildren(...Kt), n(".ppp-actions2").replaceChildren(...ge);
    const Xe = f.busy || f.message || "", yr = n(".ppp-msg"), wr = Xe && it.some((q) => (q.textContent ?? "").startsWith(Xe.replace(/[.✓\s]+$/, ""))) ? "" : Xe, Ys = !wr && !f.error ? f.notice : "";
    yr.textContent = wr || Ys, yr.classList.toggle("is-warn", !!Ys), n(".ppp-err").textContent = f.error;
    const Pn = f.entries.filter((q) => q.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...Pn.slice(0, 5).map((q) => {
      const tt = m("li"), ae = q.status === "confirmed" ? "ok" : q.status === "failed" ? "bad" : "warn";
      return tt.append(m("span", "", "d " + ae), m("span", ut(q), "t"), m("span", R(q.created), "ppp-mute")), q.txid && tt.append(O("tx", S(q.txid))), tt;
    })), n(".ppp-wallets").hidden = !(Wt.childElementCount || ge.length), n(".ppp-more").hidden = !wt.length;
    const Zs = n(".ppp-history");
    Zs.hidden = !f.entries.length, f.entries.length && I(), Zs.replaceChildren(m("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((q) => {
      const tt = m("div", "", "ppp-row"), ae = q.kind === "play" ? [m("span", ut(q), "ppp-song"), m("span", ` · ${In(BigInt(q.amount))} STX to ${V(q.recipient)}`, "ppp-mute")] : q.kind === "like" ? [m("span", `${q.liked ? "♥ Liked" : "Unliked"} ${ut(q)}`, "ppp-song"), m("span", ` · for ${f.linked ? V(f.linked) : "this listening wallet"}`, "ppp-mute")] : [m("span", `Returned ${In(BigInt(q.amount))} STX`, "ppp-song"), m("span", ` to ${V(q.recipient)}`, "ppp-mute")];
      return tt.append(
        m("span", Lt[q.status] || q.status, "ppp-status " + (kt[q.status] || "")),
        ...ae,
        m("span", ` · ${new Date(q.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), q.txid && tt.append(O("tx ↗", S(q.txid))), tt;
    }));
  }
  const v = /* @__PURE__ */ new Map(), B = () => {
    const h = window.XtrataRadio;
    return h != null && h.subscribe ? (h.subscribe((b) => {
      const f = b == null ? void 0 : b.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && v.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!B()) {
    const h = setInterval(() => {
      B() && clearInterval(h);
    }, 500);
    setTimeout(() => clearInterval(h), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (h) => {
    const b = h.detail;
    if (b && Number.isSafeInteger(b.song) && typeof b.id == "string" && /^[0-9a-f]{32}$/.test(b.id)) {
      I();
      const f = P(b.song, v.get(b.song));
      o.onListened({ song: b.song, id: b.id, title: f.title || void 0, artist: f.artist || void 0 });
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
}, f$ = () => u$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, d$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, h$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', zy = class {
  constructor(t) {
    RA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && lx(t), this.callback(rc(t));
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
    return bt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, bt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), bt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, bt("div", { class: "flex flex-col space-y-[10px]" }, bt("div", { class: "flex items-center" }, bt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), bt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, bt("span", { class: "sr-only" }, "Close popup"), bt("img", { src: l$ }))), r ? bt("p", null, "Select the wallet you want to connect to.") : bt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && bt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && bt("div", { class: "mt-6" }, bt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), bt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, bt("div", { class: "aspect-square basis-9 overflow-hidden" }, bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), bt("div", { class: "flex-1" }, bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), bt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && bt("div", { class: "mt-6" }, r ? bt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : bt("div", { class: "mb-5 flex justify-between" }, bt("p", { class: "text-sm font-medium" }, "Recommended wallets"), bt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, bt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), bt("p", null, "What is a wallet? ", bt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), bt("ul", { class: "space-y-3" }, n.map((i) => bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, bt("div", { class: "aspect-square basis-9 overflow-hidden" }, bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), bt("div", { class: "flex-1" }, bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && bt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return vA(this);
  }
};
zy.style = h$;
const p$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: zy
}, Symbol.toStringTag, { value: "Module" }));
