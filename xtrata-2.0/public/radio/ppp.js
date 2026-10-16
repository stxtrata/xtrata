var Yy = Object.defineProperty;
var Zy = (t, e, n) => e in t ? Yy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ki = (t, e, n) => Zy(t, typeof e != "symbol" ? e + "" : e, n);
var We = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function r0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function za(t) {
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
      typeof We < "u" && We || {}, r = {
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
      function i(A) {
        return A && DataView.prototype.isPrototypeOf(A);
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
        ], o = ArrayBuffer.isView || function(A) {
          return A && s.indexOf(Object.prototype.toString.call(A)) > -1;
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
        var B = {
          next: function() {
            var _ = A.shift();
            return { done: _ === void 0, value: _ };
          }
        };
        return r.iterable && (B[Symbol.iterator] = function() {
          return B;
        }), B;
      }
      function d(A) {
        this.map = {}, A instanceof d ? A.forEach(function(B, _) {
          this.append(_, B);
        }, this) : Array.isArray(A) ? A.forEach(function(B) {
          if (B.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + B.length);
          this.append(B[0], B[1]);
        }, this) : A && Object.getOwnPropertyNames(A).forEach(function(B) {
          this.append(B, A[B]);
        }, this);
      }
      d.prototype.append = function(A, B) {
        A = a(A), B = c(B);
        var _ = this.map[A];
        this.map[A] = _ ? _ + ", " + B : B;
      }, d.prototype.delete = function(A) {
        delete this.map[a(A)];
      }, d.prototype.get = function(A) {
        return A = a(A), this.has(A) ? this.map[A] : null;
      }, d.prototype.has = function(A) {
        return this.map.hasOwnProperty(a(A));
      }, d.prototype.set = function(A, B) {
        this.map[a(A)] = c(B);
      }, d.prototype.forEach = function(A, B) {
        for (var _ in this.map)
          this.map.hasOwnProperty(_) && A.call(B, this.map[_], _, this);
      }, d.prototype.keys = function() {
        var A = [];
        return this.forEach(function(B, _) {
          A.push(_);
        }), u(A);
      }, d.prototype.values = function() {
        var A = [];
        return this.forEach(function(B) {
          A.push(B);
        }), u(A);
      }, d.prototype.entries = function() {
        var A = [];
        return this.forEach(function(B, _) {
          A.push([_, B]);
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
        return new Promise(function(B, _) {
          A.onload = function() {
            B(A.result);
          }, A.onerror = function() {
            _(A.error);
          };
        });
      }
      function h(A) {
        var B = new FileReader(), _ = y(B);
        return B.readAsArrayBuffer(A), _;
      }
      function E(A) {
        var B = new FileReader(), _ = y(B), N = /charset=([A-Za-z0-9_-]+)/.exec(A.type), nt = N ? N[1] : "utf-8";
        return B.readAsText(A, nt), _;
      }
      function m(A) {
        for (var B = new Uint8Array(A), _ = new Array(B.length), N = 0; N < B.length; N++)
          _[N] = String.fromCharCode(B[N]);
        return _.join("");
      }
      function C(A) {
        if (A.slice)
          return A.slice(0);
        var B = new Uint8Array(A.byteLength);
        return B.set(new Uint8Array(A)), B.buffer;
      }
      function j() {
        return this.bodyUsed = !1, this._initBody = function(A) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = A, A ? typeof A == "string" ? this._bodyText = A : r.blob && Blob.prototype.isPrototypeOf(A) ? this._bodyBlob = A : r.formData && FormData.prototype.isPrototypeOf(A) ? this._bodyFormData = A : r.searchParams && URLSearchParams.prototype.isPrototypeOf(A) ? this._bodyText = A.toString() : r.arrayBuffer && r.blob && i(A) ? (this._bodyArrayBuffer = C(A.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(A) || o(A)) ? this._bodyArrayBuffer = C(A) : this._bodyText = A = Object.prototype.toString.call(A) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof A == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(A) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
              return this.blob().then(h);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var A = l(this);
          if (A)
            return A;
          if (this._bodyBlob)
            return E(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(m(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(I);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var O = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function p(A) {
        var B = A.toUpperCase();
        return O.indexOf(B) > -1 ? B : A;
      }
      function k(A, B) {
        if (!(this instanceof k))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        B = B || {};
        var _ = B.body;
        if (A instanceof k) {
          if (A.bodyUsed)
            throw new TypeError("Already read");
          this.url = A.url, this.credentials = A.credentials, B.headers || (this.headers = new d(A.headers)), this.method = A.method, this.mode = A.mode, this.signal = A.signal, !_ && A._bodyInit != null && (_ = A._bodyInit, A.bodyUsed = !0);
        } else
          this.url = String(A);
        if (this.credentials = B.credentials || this.credentials || "same-origin", (B.headers || !this.headers) && (this.headers = new d(B.headers)), this.method = p(B.method || this.method || "GET"), this.mode = B.mode || this.mode || null, this.signal = B.signal || this.signal || function() {
          if ("AbortController" in n) {
            var z = new AbortController();
            return z.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && _)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(_), (this.method === "GET" || this.method === "HEAD") && (B.cache === "no-store" || B.cache === "no-cache")) {
          var N = /([?&])_=[^&]*/;
          if (N.test(this.url))
            this.url = this.url.replace(N, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var nt = /\?/;
            this.url += (nt.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      k.prototype.clone = function() {
        return new k(this, { body: this._bodyInit });
      };
      function I(A) {
        var B = new FormData();
        return A.trim().split("&").forEach(function(_) {
          if (_) {
            var N = _.split("="), nt = N.shift().replace(/\+/g, " "), z = N.join("=").replace(/\+/g, " ");
            B.append(decodeURIComponent(nt), decodeURIComponent(z));
          }
        }), B;
      }
      function H(A) {
        var B = new d(), _ = A.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var nt = N.split(":"), z = nt.shift().trim();
          if (z) {
            var Rt = nt.join(":").trim();
            try {
              B.append(z, Rt);
            } catch (gt) {
              console.warn("Response " + gt.message);
            }
          }
        }), B;
      }
      j.call(k.prototype);
      function X(A, B) {
        if (!(this instanceof X))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (B || (B = {}), this.type = "default", this.status = B.status === void 0 ? 200 : B.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = B.statusText === void 0 ? "" : "" + B.statusText, this.headers = new d(B.headers), this.url = B.url || "", this._initBody(A);
      }
      j.call(X.prototype), X.prototype.clone = function() {
        return new X(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, X.error = function() {
        var A = new X(null, { status: 200, statusText: "" });
        return A.ok = !1, A.status = 0, A.type = "error", A;
      };
      var K = [301, 302, 303, 307, 308];
      X.redirect = function(A, B) {
        if (K.indexOf(B) === -1)
          throw new RangeError("Invalid status code");
        return new X(null, { status: B, headers: { location: A } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(B, _) {
          this.message = B, this.name = _;
          var N = Error(B);
          this.stack = N.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function W(A, B) {
        return new Promise(function(_, N) {
          var nt = new k(A, B);
          if (nt.signal && nt.signal.aborted)
            return N(new e.DOMException("Aborted", "AbortError"));
          var z = new XMLHttpRequest();
          function Rt() {
            z.abort();
          }
          z.onload = function() {
            var $ = {
              statusText: z.statusText,
              headers: H(z.getAllResponseHeaders() || "")
            };
            nt.url.indexOf("file://") === 0 && (z.status < 200 || z.status > 599) ? $.status = 200 : $.status = z.status, $.url = "responseURL" in z ? z.responseURL : $.headers.get("X-Request-URL");
            var P = "response" in z ? z.response : z.responseText;
            setTimeout(function() {
              _(new X(P, $));
            }, 0);
          }, z.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, z.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, z.onabort = function() {
            setTimeout(function() {
              N(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function gt($) {
            try {
              return $ === "" && n.location.href ? n.location.href : $;
            } catch {
              return $;
            }
          }
          if (z.open(nt.method, gt(nt.url), !0), nt.credentials === "include" ? z.withCredentials = !0 : nt.credentials === "omit" && (z.withCredentials = !1), "responseType" in z && (r.blob ? z.responseType = "blob" : r.arrayBuffer && (z.responseType = "arraybuffer")), B && typeof B.headers == "object" && !(B.headers instanceof d || n.Headers && B.headers instanceof n.Headers)) {
            var ue = [];
            Object.getOwnPropertyNames(B.headers).forEach(function($) {
              ue.push(a($)), z.setRequestHeader($, c(B.headers[$]));
            }), nt.headers.forEach(function($, P) {
              ue.indexOf(P) === -1 && z.setRequestHeader(P, $);
            });
          } else
            nt.headers.forEach(function($, P) {
              z.setRequestHeader(P, $);
            });
          nt.signal && (nt.signal.addEventListener("abort", Rt), z.onreadystatechange = function() {
            z.readyState === 4 && nt.signal.removeEventListener("abort", Rt);
          }), z.send(typeof nt._bodyInit > "u" ? null : nt._bodyInit);
        });
      }
      return W.polyfill = !0, n.fetch || (n.fetch = W, n.Headers = d, n.Request = k, n.Response = X), e.Headers = d, e.Request = k, e.Response = X, e.fetch = W, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : We);
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
var pi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(pi || (pi = {}));
var As;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(As || (As = {}));
var If;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(If || (If = {}));
const nw = "https://api.mainnet.hiro.so", rw = "https://api.testnet.hiro.so", sw = "http://localhost:3999", iw = ["mainnet", "testnet", "devnet", "mocknet"];
let gi = class {
  constructor(e) {
    this.version = As.Mainnet, this.chainId = pi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === As.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ew();
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
gi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new el();
    case "testnet":
      return new ow();
    case "devnet":
      return new aw();
    case "mocknet":
      return new s0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${iw.join(", ")}`);
  }
};
gi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : gi.fromName(t);
let el = class extends gi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? nw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = As.Mainnet, this.chainId = pi.Mainnet;
  }
}, ow = class extends gi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? rw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = As.Testnet, this.chainId = pi.Testnet;
  }
}, s0 = class extends gi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? sw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = As.Testnet, this.chainId = pi.Testnet;
  }
};
const aw = s0, i0 = "xtrata.wallet.bridge.v1", cw = (t) => typeof t == "object" && t !== null && t.protocol === i0, lw = (t) => cw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", uw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Vi extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const kf = 12e4;
class fw {
  constructor(e) {
    Ki(this, "pending", /* @__PURE__ */ new Map());
    Ki(this, "listenTarget");
    Ki(this, "closed", !1);
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
    Ki(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !lw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Vi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Vi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Vi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = uw(), s = { protocol: i0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new Vi(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? kf}ms.`
          )
        );
      }, this.options.timeoutMs ?? kf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Vi("CLOSED", "Bridge client closed before the reply arrived."));
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
}, yw = () => typeof window > "u" || !window.localStorage ? gw() : window.localStorage, Ac = "xtrata.v15.1.wallet.session", Lf = "mainnet", ha = { isConnected: !1 }, ww = (t) => t.address ? pw(t.address) ?? t.network : t.network, o0 = (t) => !t.isConnected || !t.address ? { ...ha } : ww(t) !== Lf ? { ...ha } : {
  isConnected: !0,
  address: t.address,
  network: Lf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, bw = (t) => {
  if (!t)
    return { ...ha };
  try {
    const e = JSON.parse(t);
    return o0(e);
  } catch {
    return { ...ha };
  }
}, mw = (t) => {
  const e = o0(t);
  return JSON.stringify(e);
}, xw = (t) => {
  const e = yw();
  return {
    load: () => bw(e.getItem(Ac)),
    save: (n) => {
      e.setItem(Ac, mw(n));
    },
    clear: () => {
      e.removeItem(Ac);
    }
  };
}, Sw = "https://browser.blockstack.org/auth", Ew = {
  "@type": "Person",
  "@context": "http://schema.org"
}, a0 = ["store_write"], Aw = "blockstack-session", vw = {
  logLevel: "debug"
}, Fs = {
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
Object.freeze(Fs);
class Mi extends Error {
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
class $w extends Mi {
  constructor(e, n = "") {
    super({ code: Fs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Cf extends Mi {
  constructor(e = "") {
    super({ code: Fs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class To extends Mi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Fs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Tf extends Mi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Fs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class nl extends Mi {
  constructor(e) {
    super({ code: Fs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class c0 extends Mi {
  constructor(e) {
    super({ code: Fs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Bf = ["debug", "info", "warn", "error", "none"], rl = {};
for (let t = 0; t < Bf.length; t++) {
  const e = Bf[t];
  rl[e] = t;
}
class ai {
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
    return rl[vw.logLevel] <= rl[e];
  }
}
function Iw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function kw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function vc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
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
function au(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = Cw(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    ai.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = Tw(i, t.toString(), n);
    throw ai.error(s), new Error(s);
  }
  if (r)
    return {};
}
function es(t, e) {
  return cu(Re(t), e);
}
function Re(t) {
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
  if (on(t, Uint8Array))
    return BigInt(`0x${ft(t)}`);
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
function bo(t, e = 8) {
  return (typeof t == "bigint" ? t : Re(t)).toString(16).padStart(e * 2, "0");
}
function Ra(t) {
  return parseInt(t, 16);
}
function cu(t, e = 16) {
  const n = bo(t, e);
  return Dt(n);
}
function Mw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Nw(t, e) {
  return t & BigInt(1) << e;
}
function sl(t) {
  return _w(BigInt(`0x${ft(t)}`), BigInt(t.byteLength * 8));
}
function _w(t, e) {
  return Nw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Pw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ft(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Pw[n];
  return e;
}
function Dt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Bw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function js(t) {
  return new TextEncoder().encode(t);
}
function mo(t) {
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
function Qn(...t) {
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
function ve(t) {
  return Qn(...t.map((e) => typeof e == "number" ? Nf([e]) : e instanceof Array ? Nf(e) : e));
}
function on(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const l0 = "https://api.mainnet.hiro.so", u0 = "https://api.testnet.hiro.so", f0 = "http://localhost:3999", Dw = "https://hub.blockstack.org", Fw = 33, $c = 32;
function jw(t) {
  if (t.length < $c * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + $c * 2), r = t.slice(2 + $c * 2);
  return {
    recoveryId: Ra(e),
    r: n,
    s: r
  };
}
function lu(t) {
  const e = typeof t == "string" ? Dt(t) : t;
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
function vs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Xw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function qw(t, e) {
  const n = {};
  return Object.assign(n, Xw, e), await fetch(t, n);
}
function Ww(t) {
  let e = qw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Yw(...t) {
  const { fetchLib: e, middlewares: n } = Ww(t);
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
class d0 {
  constructor(e = a0.slice(), n = ((a) => (a = au("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = Sw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function il(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Zw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function h0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Qw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  il(t.outputLen), il(t.blockLen);
}
function Jw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function tb(t, e) {
  h0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const hs = {
  number: il,
  bool: Zw,
  bytes: h0,
  hash: Qw,
  exists: Jw,
  output: tb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ic = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Fn = (t, e) => t << 32 - e | t >>> e, eb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!eb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function uu(t) {
  if (typeof t == "string" && (t = nb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let p0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function zs(t) {
  const e = (r) => t().update(uu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let g0 = class extends p0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, hs.hash(e);
    const r = uu(n);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Ga = (t, e, n) => new g0(t, e).update(n).digest();
Ga.create = (t, e) => new g0(t, e);
function rb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let fu = class extends p0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ic(this.buffer);
  }
  update(e) {
    hs.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = uu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Ic(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    hs.exists(this), hs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    rb(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Ic(e), c = this.outputLen;
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
let y0 = class extends fu {
  constructor() {
    super(64, 32, 8, !1), this.A = Ar[0] | 0, this.B = Ar[1] | 0, this.C = Ar[2] | 0, this.D = Ar[3] | 0, this.E = Ar[4] | 0, this.F = Ar[5] | 0, this.G = Ar[6] | 0, this.H = Ar[7] | 0;
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
      vr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = vr[l - 15], h = vr[l - 2], E = Fn(y, 7) ^ Fn(y, 18) ^ y >>> 3, m = Fn(h, 17) ^ Fn(h, 19) ^ h >>> 10;
      vr[l] = m + vr[l - 7] + E + vr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Fn(a, 6) ^ Fn(a, 11) ^ Fn(a, 25), h = d + y + sb(a, c, u) + ob[l] + vr[l] | 0, m = (Fn(r, 2) ^ Fn(r, 13) ^ Fn(r, 22)) + ib(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + m | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    vr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ab = class extends y0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const yi = zs(() => new y0());
zs(() => new ab());
const cb = {}, w0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Ht = BigInt(0), ce = BigInt(1), Wr = BigInt(2), Ji = BigInt(3), _f = BigInt(8), Wt = Object.freeze({
  a: Ht,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ce,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Pf = (t, e) => (t + e / Wr) / e, Bo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Wt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ce * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = Pf(s * t, e), c = Pf(-r * t, e);
    let u = Y(t - a * n - c * i, e), d = Y(-a * r - c * s, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, Pn = 32, $s = 32, b0 = 32, pa = Pn + 1, ga = 2 * Pn + 1;
function Uf(t) {
  const { a: e, b: n } = Wt, r = Y(t * t), i = Y(r * t);
  return Y(i + e * t + n);
}
const Mo = Wt.a === Ht;
class du extends Error {
  constructor(e) {
    super(e);
  }
}
function Hf(t) {
  if (!(t instanceof zt))
    throw new TypeError("JacobianPoint expected");
}
class zt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ct))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ct.ZERO) ? zt.ZERO : new zt(e.x, e.y, ce);
  }
  static toAffineBatch(e) {
    const n = hb(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return zt.toAffineBatch(e).map(zt.fromAffine);
  }
  equals(e) {
    Hf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = Y(i * i), u = Y(a * a), d = Y(n * u), l = Y(s * c), y = Y(Y(r * a) * u), h = Y(Y(o * i) * c);
    return d === l && y === h;
  }
  negate() {
    return new zt(this.x, Y(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = Y(e * e), s = Y(n * n), o = Y(s * s), a = e + s, c = Y(Wr * (Y(a * a) - i - o)), u = Y(Ji * i), d = Y(u * u), l = Y(d - Wr * c), y = Y(u * (c - l) - _f * o), h = Y(Wr * n * r);
    return new zt(l, y, h);
  }
  add(e) {
    Hf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === Ht || o === Ht)
      return this;
    if (n === Ht || r === Ht)
      return e;
    const c = Y(i * i), u = Y(a * a), d = Y(n * u), l = Y(s * c), y = Y(Y(r * a) * u), h = Y(Y(o * i) * c), E = Y(l - d), m = Y(h - y);
    if (E === Ht)
      return m === Ht ? this.double() : zt.ZERO;
    const C = Y(E * E), j = Y(E * C), O = Y(d * C), p = Y(m * m - j - Wr * O), k = Y(m * (O - p) - y * j), I = Y(i * a * E);
    return new zt(p, k, I);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = zt.ZERO;
    if (typeof e == "bigint" && e === Ht)
      return n;
    let r = Ff(e);
    if (r === ce)
      return this;
    if (!Mo) {
      let l = n, y = this;
      for (; r > Ht; )
        r & ce && (l = l.add(y)), y = y.double(), r >>= ce;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = Bo.splitScalar(r), c = n, u = n, d = this;
    for (; s > Ht || a > Ht; )
      s & ce && (c = c.add(d)), a & ce && (u = u.add(d)), d = d.double(), s >>= ce, a >>= ce;
    return i && (c = c.negate()), o && (u = u.negate()), u = new zt(Y(u.x * Bo.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Mo ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(zt.BASE) && (n = Ct.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && ol.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = zt.normalizeZ(i), ol.set(n, i)));
    let s = zt.ZERO, o = zt.BASE;
    const a = 1 + (Mo ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const h = y * c;
      let E = Number(e & u);
      e >>= l, E > c && (E -= d, e += ce);
      const m = h, C = h + Math.abs(E) - 1, j = y % 2 !== 0, O = E < 0;
      E === 0 ? o = o.add(No(j, i[m])) : s = s.add(No(O, i[C]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = Ff(e), i, s;
    if (Mo) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Bo.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: h } = this.wNAF(u, n);
      d = No(o, d), y = No(c, y), y = new zt(Y(y.x * Bo.beta), y.y, y.z), i = d.add(y), s = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return zt.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(zt.ZERO);
    e == null && (e = s ? _f : Ni(i));
    const o = e, a = Y(o * o), c = Y(a * o), u = Y(n * a), d = Y(r * c), l = Y(i * o);
    if (s)
      return Ct.ZERO;
    if (l !== ce)
      throw new Error("invZ was invalid");
    return new Ct(u, d);
  }
}
zt.BASE = new zt(Wt.Gx, Wt.Gy, ce);
zt.ZERO = new zt(Ht, ce, Ht);
function No(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const ol = /* @__PURE__ */ new WeakMap();
class Ct {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, ol.delete(this);
  }
  hasEvenY() {
    return this.y % Wr === Ht;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = gn(n ? e : e.subarray(1));
    if (!ia(r))
      throw new Error("Point is not on curve");
    const i = Uf(r);
    let s = db(i);
    const o = (s & ce) === ce;
    n ? o && (s = Y(-s)) : (e[0] & 1) === 1 !== o && (s = Y(-s));
    const a = new Ct(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = gn(e.subarray(1, Pn + 1)), r = gn(e.subarray(Pn + 1, Pn * 2 + 1)), i = new Ct(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = Jn(e), r = n.length, i = n[0];
    if (r === Pn)
      return this.fromCompressedHex(n);
    if (r === pa && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === ga && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${pa} compressed bytes or ${ga} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ct.BASE.multiply(Is(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = S0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = hu(Jn(e)), { n: a } = Wt, c = r === 2 || r === 3 ? i + a : i, u = Ni(c, a), d = Y(-o * u, a), l = Y(s * u, a), y = r & 1 ? "03" : "02", h = Ct.fromHex(y + Zr(c)), E = Ct.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!E)
      throw new Error("Cannot recover signature: point at infinify");
    return E.assertValidity(), E;
  }
  toRawBytes(e = !1) {
    return Qr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Zr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Zr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ia(n) || !ia(r))
      throw new Error(e);
    const i = Y(r * r), s = Uf(n);
    if (Y(i - s) !== Ht)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ct(this.x, Y(-this.y));
  }
  double() {
    return zt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return zt.fromAffine(this).add(zt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return zt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const i = zt.fromAffine(this), s = n === Ht || n === ce || this !== Ct.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = zt.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(zt.ZERO) ? void 0 : a.toAffine();
  }
}
Ct.BASE = new Ct(Wt.Gx, Wt.Gy);
Ct.ZERO = new Ct(Ht, Ht);
function Of(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Df(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${wi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: gn(n), left: t.subarray(e + 2) };
}
function lb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${wi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Df(t.subarray(2)), { data: r, left: i } = Df(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${wi(i)}`);
  return { r: e, s: r };
}
class pn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? wi(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new pn(ya(i.slice(0, 64)), ya(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = lb(n ? e : Qr(e));
    return new pn(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!mi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!mi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Wt.n >> ce;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new pn(this.r, Y(-this.s, Wt.n)) : this;
  }
  toDERRawBytes() {
    return Qr(this.toDERHex());
  }
  toDERHex() {
    const e = Of(Xi(this.s)), n = Of(Xi(this.r)), r = e.length / 2, i = n.length / 2, s = Xi(r), o = Xi(i);
    return `30${Xi(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Qr(this.toCompactHex());
  }
  toCompactHex() {
    return Zr(this.r) + Zr(this.s);
  }
}
function Xr(...t) {
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
const ub = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ub[t[n]];
  return e;
}
const fb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Zr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Ht <= t && t < fb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function bi(t) {
  const e = Qr(Zr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Xi(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ya(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Qr(t) {
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
function gn(t) {
  return ya(wi(t));
}
function Jn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Qr(t);
}
function Ff(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && mi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function Y(t, e = Wt.P) {
  const n = t % e;
  return n >= Ht ? n : e + n;
}
function Sn(t, e) {
  const { P: n } = Wt;
  let r = t;
  for (; e-- > Ht; )
    r *= r, r %= n;
  return r;
}
function db(t) {
  const { P: e } = Wt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = Sn(u, Ji) * u % e, l = Sn(d, Ji) * u % e, y = Sn(l, Wr) * c % e, h = Sn(y, r) * y % e, E = Sn(h, i) * h % e, m = Sn(E, o) * E % e, C = Sn(m, a) * m % e, j = Sn(C, o) * E % e, O = Sn(j, Ji) * u % e, p = Sn(O, s) * h % e, k = Sn(p, n) * c % e, I = Sn(k, Wr);
  if (I * I % e !== t)
    throw new Error("Cannot find square root");
  return I;
}
function Ni(t, e = Wt.P) {
  if (t === Ht || e <= Ht)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = Y(t, e), r = e, i = Ht, s = ce;
  for (; n !== Ht; ) {
    const a = r / n, c = r % n, u = i - s * a;
    r = n, n = c, i = s, s = u;
  }
  if (r !== ce)
    throw new Error("invert: does not exist");
  return Y(i, e);
}
function hb(t, e = Wt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === Ht ? s : (n[a] = s, Y(s * o, e)), ce), i = Ni(r, e);
  return t.reduceRight((s, o, a) => o === Ht ? s : (n[a] = Y(s * n[a], e), Y(s * o, e)), i), n;
}
function pb(t) {
  const e = t.length * 8 - $s * 8, n = gn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function hu(t, e = !1) {
  const n = pb(t);
  if (e)
    return n;
  const { n: r } = Wt;
  return n >= r ? n - r : n;
}
let di, to;
class m0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return be.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return to(this.k, ...e);
  }
  checkSync() {
    if (typeof to != "function")
      throw new du("hmacSha256Sync needs to be set");
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
    return Xr(...n);
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
    return Xr(...n);
  }
}
function mi(t) {
  return Ht < t && t < Wt.n;
}
function ia(t) {
  return Ht < t && t < Wt.P;
}
function x0(t, e, n, r = !0) {
  const { n: i } = Wt, s = hu(t, !0);
  if (!mi(s))
    return;
  const o = Ni(s, i), a = Ct.BASE.multiply(s), c = Y(a.x, i);
  if (c === Ht)
    return;
  const u = Y(o * Y(e + n * c, i), i);
  if (u === Ht)
    return;
  let d = new pn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & ce);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Is(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * $s)
      throw new Error("Expected 32 bytes of private key");
    e = ya(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== $s)
      throw new Error("Expected 32 bytes of private key");
    e = gn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!mi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function pu(t) {
  return t instanceof Ct ? (t.assertValidity(), t) : Ct.fromHex(t);
}
function S0(t) {
  if (t instanceof pn)
    return t.assertValidity(), t;
  try {
    return pn.fromDER(t);
  } catch {
    return pn.fromCompact(t);
  }
}
function xo(t, e = !1) {
  return Ct.fromPrivateKey(t).toRawBytes(e);
}
function gb(t, e, n, r = !1) {
  return Ct.fromSignature(t, e, n).toRawBytes(r);
}
function jf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === pa || r === ga : n ? r === pa * 2 || r === ga * 2 : t instanceof Ct;
}
function gu(t, e, n = !1) {
  if (jf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!jf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = pu(e);
  return r.assertValidity(), r.multiply(Is(t)).toRawBytes(n);
}
function E0(t) {
  const e = t.length > Pn ? t.slice(0, Pn) : t;
  return gn(e);
}
function yb(t) {
  const e = E0(t), n = Y(e, Wt.n);
  return A0(n < Ht ? e : n);
}
function A0(t) {
  return bi(t);
}
function v0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Jn(t), i = Is(e), s = [A0(i), yb(r)];
  if (n != null) {
    n === !0 && (n = be.randomBytes(Pn));
    const c = Jn(n);
    if (c.length !== Pn)
      throw new Error(`sign: Expected ${Pn} bytes of extra data`);
    s.push(c);
  }
  const o = Xr(...s), a = E0(r);
  return { seed: o, m: a, d: i };
}
function $0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function wb(t, e, n = {}) {
  const { seed: r, m: i, d: s } = v0(t, e, n.extraEntropy), o = new m0(b0, $s);
  await o.reseed(r);
  let a;
  for (; !(a = x0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return $0(a, n);
}
function Ka(t, e, n = {}) {
  const { seed: r, m: i, d: s } = v0(t, e, n.extraEntropy), o = new m0(b0, $s);
  o.reseedSync(r);
  let a;
  for (; !(a = x0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return $0(a, n);
}
const bb = { strict: !0 };
function mb(t, e, n, r = bb) {
  let i;
  try {
    i = S0(t), e = Jn(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = hu(e);
  let c;
  try {
    c = pu(n);
  } catch {
    return !1;
  }
  const { n: u } = Wt, d = Ni(o, u), l = Y(a * d, u), y = Y(s * d, u), h = Ct.BASE.multiplyAndAddUnsafe(c, l, y);
  return h ? Y(h.x, u) === s : !1;
}
function wa(t) {
  return Y(gn(t), Wt.n);
}
class xi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Jn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = gn(n.subarray(0, 32)), i = gn(n.subarray(32, 64));
    return new xi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ia(e) || !mi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Zr(this.r) + Zr(this.s);
  }
  toRawBytes() {
    return Qr(this.toHex());
  }
}
function xb(t) {
  return Ct.fromPrivateKey(t).toRawX();
}
class I0 {
  constructor(e, n, r = be.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Jn(e);
    const { x: i, scalar: s } = this.getScalar(Is(n));
    if (this.px = i, this.d = s, this.rand = Jn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ct.fromPrivateKey(e), r = n.hasEvenY() ? e : Wt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return bi(e ^ gn(n));
  }
  finalizeNonce(e) {
    const n = Y(gn(e), Wt.n);
    if (n === Ht)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new xi(e.x, Y(n + r * i, Wt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = be.taggedHash, o = this.initNonce(n, await s(Vr.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(Vr.nonce, o, r, e)), d = wa(await s(Vr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await C0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = be.taggedHashSync, o = this.initNonce(n, s(Vr.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(s(Vr.nonce, o, r, e)), d = wa(s(Vr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return T0(l, e, r) || this.error(), l;
  }
}
async function Sb(t, e, n) {
  return new I0(t, e, n).calc();
}
function Eb(t, e, n) {
  return new I0(t, e, n).calcSync();
}
function k0(t, e, n) {
  const r = t instanceof xi, i = r ? t : xi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: Jn(e),
    P: pu(n)
  };
}
function L0(t, e, n, r) {
  const i = Ct.BASE.multiplyAndAddUnsafe(e, Is(n), Y(-r, Wt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function C0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = k0(t, e, n), a = wa(await be.taggedHash(Vr.challenge, bi(r), o.toRawX(), s));
    return L0(r, o, i, a);
  } catch {
    return !1;
  }
}
function T0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = k0(t, e, n), a = wa(be.taggedHashSync(Vr.challenge, bi(r), o.toRawX(), s));
    return L0(r, o, i, a);
  } catch (r) {
    if (r instanceof du)
      throw r;
    return !1;
  }
}
const Ab = {
  Signature: xi,
  getPublicKey: xb,
  sign: Sb,
  verify: C0,
  signSync: Eb,
  verifySync: T0
};
Ct.BASE._setWindowSize(8);
const ln = {
  node: w0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Vr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, _o = {}, be = {
  bytesToHex: wi,
  hexToBytes: Qr,
  concatBytes: Xr,
  mod: Y,
  invert: Ni,
  isValidPrivateKey(t) {
    try {
      return Is(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: bi,
  _normalizePrivateKey: Is,
  hashToPrivateKey: (t) => {
    t = Jn(t);
    const e = $s + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = Y(gn(t), Wt.n - ce) + ce;
    return bi(n);
  },
  randomBytes: (t = 32) => {
    if (ln.web)
      return ln.web.getRandomValues(new Uint8Array(t));
    if (ln.node) {
      const { randomBytes: e } = ln.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => be.hashToPrivateKey(be.randomBytes($s + 8)),
  precompute(t = 8, e = Ct.BASE) {
    const n = e === Ct.BASE ? e : new Ct(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ji), n;
  },
  sha256: async (...t) => {
    if (ln.web) {
      const e = await ln.web.subtle.digest("SHA-256", Xr(...t));
      return new Uint8Array(e);
    } else if (ln.node) {
      const { createHash: e } = ln.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ln.web) {
      const n = await ln.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Xr(...e), i = await ln.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (ln.node) {
      const { createHmac: n } = ln.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = _o[t];
    if (n === void 0) {
      const r = await be.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = Xr(r, r), _o[t] = n;
    }
    return be.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof di != "function")
      throw new du("sha256Sync is undefined, you need to set it");
    let n = _o[t];
    if (n === void 0) {
      const r = di(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = Xr(r, r), _o[t] = n;
    }
    return di(n, ...e);
  },
  _JacobianPoint: zt
};
Object.defineProperties(be, {
  sha256Sync: {
    configurable: !1,
    get() {
      return di;
    },
    set(t) {
      di || (di = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return to;
    },
    set(t) {
      to || (to = t);
    }
  }
});
const vb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Wt,
  Point: Ct,
  Signature: pn,
  getPublicKey: xo,
  getSharedSecret: gu,
  recoverPublicKey: gb,
  schnorr: Ab,
  sign: wb,
  signSync: Ka,
  utils: be,
  verify: mb
}, Symbol.toStringTag, { value: "Module" }));
var So = {};
So.byteLength = Cb;
var $b = So.toByteArray = Bb, Ib = So.fromByteArray = _b, Vn = [], An = [], kb = typeof Uint8Array < "u" ? Uint8Array : Array, kc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ei = 0, Lb = kc.length; ei < Lb; ++ei)
  Vn[ei] = kc[ei], An[kc.charCodeAt(ei)] = ei;
An[45] = 62;
An[95] = 63;
function B0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Cb(t) {
  var e = B0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Tb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Bb(t) {
  var e, n = B0(t), r = n[0], i = n[1], s = new kb(Tb(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = An[t.charCodeAt(c)] << 18 | An[t.charCodeAt(c + 1)] << 12 | An[t.charCodeAt(c + 2)] << 6 | An[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = An[t.charCodeAt(c)] << 2 | An[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = An[t.charCodeAt(c)] << 10 | An[t.charCodeAt(c + 1)] << 4 | An[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Mb(t) {
  return Vn[t >> 18 & 63] + Vn[t >> 12 & 63] + Vn[t >> 6 & 63] + Vn[t & 63];
}
function Nb(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Mb(r));
  return i.join("");
}
function _b(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(Nb(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    Vn[e >> 2] + Vn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    Vn[e >> 10] + Vn[e >> 4 & 63] + Vn[e << 2 & 63] + "="
  )), i.join("");
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
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(Qn(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(Qn(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class Db {
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
async function M0() {
  const t = await Hb();
  return t.name === "subtleCrypto" ? new Db(t.lib) : new Ob(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Fb(t) {
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
  function d(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var E = 0, m = 0, C = 0, j = h.length; C !== j && h[C] === 0; )
      C++, E++;
    for (var O = (j - C) * u + 1 >>> 0, p = new Uint8Array(O); C !== j; ) {
      for (var k = h[C], I = 0, H = O - 1; (k !== 0 || I < m) && H !== -1; H--, I++)
        k += 256 * p[H] >>> 0, p[H] = k % o >>> 0, k = k / o >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      m = I, C++;
    }
    for (var X = O - m; X !== O && p[X] === 0; )
      X++;
    for (var K = a.repeat(E); X < O; ++X)
      K += t.charAt(p[X]);
    return K;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var E = 0, m = 0, C = 0; h[E] === a; )
      m++, E++;
    for (var j = (h.length - E) * c + 1 >>> 0, O = new Uint8Array(j); h[E]; ) {
      var p = h.charCodeAt(E);
      if (p > 255)
        return;
      var k = e[p];
      if (k === 255)
        return;
      for (var I = 0, H = j - 1; (k !== 0 || I < C) && H !== -1; H--, I++)
        k += o * O[H] >>> 0, O[H] = k % 256 >>> 0, k = k / 256 >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      C = I, E++;
    }
    for (var X = j - C; X !== j && O[X] === 0; )
      X++;
    for (var K = new Uint8Array(m + (j - X)), W = m; X !== j; )
      K[W++] = O[X++];
    return K;
  }
  function y(h) {
    var E = l(h);
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
var N0 = Fb;
const jb = N0, zb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Rb = jb(zb);
const Gb = /* @__PURE__ */ r0(Rb), Kb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _0 = Uint8Array.from({ length: 16 }, (t, e) => e), Vb = _0.map((t) => (9 * t + 5) % 16);
let yu = [_0], wu = [Vb];
for (let t = 0; t < 4; t++)
  for (let e of [yu, wu])
    e.push(e[t].map((n) => Kb[n]));
const P0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Xb = yu.map((t, e) => t.map((n) => P0[e][n])), qb = wu.map((t, e) => t.map((n) => P0[e][n])), Wb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Yb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Po = (t, e) => t << e | t >>> 32 - e;
function zf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Uo = new Uint32Array(16);
let Zb = class extends fu {
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
    for (let h = 0; h < 16; h++, n += 4)
      Uo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const E = 4 - h, m = Wb[h], C = Yb[h], j = yu[h], O = wu[h], p = Xb[h], k = qb[h];
      for (let I = 0; I < 16; I++) {
        const H = Po(r + zf(h, s, a, u) + Uo[j[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = Po(a, 10) | 0, a = s, s = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = Po(i + zf(E, o, c, d) + Uo[O[I]] + C, k[I]) + y | 0;
        i = y, y = d, d = Po(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Uo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Qb = zs(() => new Zb());
function Jb(t) {
  return Qb(t);
}
const Ho = BigInt(2 ** 32 - 1), al = BigInt(32);
function U0(t, e = !1) {
  return e ? { h: Number(t & Ho), l: Number(t >> al & Ho) } : { h: Number(t >> al & Ho) | 0, l: Number(t & Ho) | 0 };
}
function t1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = U0(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const e1 = (t, e) => BigInt(t >>> 0) << al | BigInt(e >>> 0), n1 = (t, e, n) => t >>> n, r1 = (t, e, n) => t << 32 - n | e >>> n, s1 = (t, e, n) => t >>> n | e << 32 - n, i1 = (t, e, n) => t << 32 - n | e >>> n, o1 = (t, e, n) => t << 64 - n | e >>> n - 32, a1 = (t, e, n) => t >>> n - 32 | e << 64 - n, c1 = (t, e) => e, l1 = (t, e) => t, u1 = (t, e, n) => t << n | e >>> 32 - n, f1 = (t, e, n) => e << n | t >>> 32 - n, d1 = (t, e, n) => e << n - 32 | t >>> 64 - n, h1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function p1(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const g1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), y1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, w1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), b1 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, m1 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), x1 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, At = {
  fromBig: U0,
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
}, [S1, E1] = At.split([
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
let Va = class extends fu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: E, Hh: m, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = E | 0, this.Hh = m | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      $r[p] = e.getUint32(n), Ir[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = $r[p - 15] | 0, I = Ir[p - 15] | 0, H = At.rotrSH(k, I, 1) ^ At.rotrSH(k, I, 8) ^ At.shrSH(k, I, 7), X = At.rotrSL(k, I, 1) ^ At.rotrSL(k, I, 8) ^ At.shrSL(k, I, 7), K = $r[p - 2] | 0, W = Ir[p - 2] | 0, A = At.rotrSH(K, W, 19) ^ At.rotrBH(K, W, 61) ^ At.shrSH(K, W, 6), B = At.rotrSL(K, W, 19) ^ At.rotrBL(K, W, 61) ^ At.shrSL(K, W, 6), _ = At.add4L(X, B, Ir[p - 7], Ir[p - 16]), N = At.add4H(_, H, A, $r[p - 7], $r[p - 16]);
      $r[p] = N | 0, Ir[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: E, Gh: m, Gl: C, Hh: j, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = At.rotrSH(l, y, 14) ^ At.rotrSH(l, y, 18) ^ At.rotrBH(l, y, 41), I = At.rotrSL(l, y, 14) ^ At.rotrSL(l, y, 18) ^ At.rotrBL(l, y, 41), H = l & h ^ ~l & m, X = y & E ^ ~y & C, K = At.add5L(O, I, X, E1[p], Ir[p]), W = At.add5H(K, j, k, H, S1[p], $r[p]), A = K | 0, B = At.rotrSH(r, i, 28) ^ At.rotrBH(r, i, 34) ^ At.rotrBH(r, i, 39), _ = At.rotrSL(r, i, 28) ^ At.rotrBL(r, i, 34) ^ At.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      j = m | 0, O = C | 0, m = h | 0, C = E | 0, h = l | 0, E = y | 0, { h: l, l: y } = At.add(u | 0, d | 0, W | 0, A | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const z = At.add3L(A, _, nt);
      r = At.add3H(z, W, B, N), i = z | 0;
    }
    ({ h: r, l: i } = At.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = At.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = At.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = At.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = At.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: E } = At.add(this.Fh | 0, this.Fl | 0, h | 0, E | 0), { h: m, l: C } = At.add(this.Gh | 0, this.Gl | 0, m | 0, C | 0), { h: j, l: O } = At.add(this.Hh | 0, this.Hl | 0, j | 0, O | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, E, m, C, j, O);
  }
  roundClean() {
    $r.fill(0), Ir.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, A1 = class extends Va {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, v1 = class extends Va {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, $1 = class extends Va {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const I1 = zs(() => new Va());
zs(() => new A1());
zs(() => new v1());
zs(() => new $1());
function H0(t) {
  return yi(t);
}
function k1(t) {
  return I1(t);
}
const L1 = 0;
be.hmacSha256Sync = (t, ...e) => {
  const n = Ga.create(yi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function C1() {
  return ft(be.randomPrivateKey());
}
function T1(t) {
  const e = yi(yi(t));
  return Gb.encode(Qn(t, e).slice(0, t.length + 4));
}
function B1(t, e) {
  return T1(Qn(new Uint8Array([t]), e.slice(0, 20)));
}
function O0(t, e = L1) {
  const n = typeof t == "string" ? Dt(t) : t, r = Jb(H0(n));
  return B1(e, r);
}
function D0(t) {
  const e = lu(t);
  return ft(xo(e.slice(0, 32), !0));
}
be.hmacSha256Sync = (t, ...e) => {
  const n = Ga.create(yi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ba;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ba || (ba = {}));
async function M1(t, e, n) {
  return await (await M0()).encrypt("aes-256-cbc", e, t, n);
}
async function N1(t, e, n) {
  return await (await M0()).decrypt("aes-256-cbc", e, t, n);
}
function F0(t, e) {
  return Ga(yi, t, e);
}
function _1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function j0(t) {
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
    reason: ba.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ba.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !P1(t))
    return e;
  try {
    return Ct.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function H1(t, e, n, r) {
  const i = U1(t);
  if (!i.result)
    throw i;
  const s = be.randomPrivateKey(), o = xo(s, !0);
  let a = gu(s, t, !0);
  a = a.slice(1);
  const c = j0(a), u = be.randomBytes(16), d = await M1(u, c.encryptionKey, e), l = Qn(u, o, d), y = F0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = ft(d);
  else if (r === "base64")
    h = Ib(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const E = {
    iv: ft(u),
    ephemeralPK: ft(o),
    cipherText: h,
    mac: ft(y),
    wasString: n
  };
  return r && r !== "hex" && (E.cipherTextEncoding = r), E;
}
async function z0(t, e) {
  if (!e.ephemeralPK)
    throw new Tf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = gu(t, n, !0);
  r = r.slice(1);
  const i = j0(r), s = Dt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Dt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = $b(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Qn(s, Dt(n), o), c = F0(i.hmacKey, a), u = Dt(e.mac);
  if (!_1(u, c))
    throw new Tf("Decryption failed: failure in MAC check");
  const d = await N1(s, i.encryptionKey, o);
  return e.wasString ? mo(d) : d;
}
function O1(t, e) {
  const n = typeof e == "string" ? js(e) : e, r = D0(t), i = H0(n), s = Ka(i, t);
  return {
    signature: ft(s),
    publicKey: r
  };
}
async function D1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = D0(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? js(t) : t, o = await H1(n.publicKey, s, i, n.cipherTextEncoding);
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
    return z0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var He = {}, Si = {}, Xe = {};
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.decode = Xe.encode = Xe.unescape = Xe.escape = Xe.pad = void 0;
const R0 = So;
function bu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Xe.pad = bu;
function G0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Xe.escape = G0;
function K0(t) {
  return bu(t).replace(/-/g, "+").replace(/_/g, "/");
}
Xe.unescape = K0;
function j1(t) {
  return G0((0, R0.fromByteArray)(new TextEncoder().encode(t)));
}
Xe.encode = j1;
function z1(t) {
  return new TextDecoder().decode((0, R0.toByteArray)(bu(K0(t))));
}
Xe.decode = z1;
var Xa = {}, qa = {}, V0 = {}, X0 = {}, Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
Wa.crypto = void 0;
Wa.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = h, t.byteSwap = E, t.byteSwap32 = m, t.bytesToHex = O, t.hexToBytes = I, t.asyncLoop = X, t.utf8ToBytes = K, t.bytesToUtf8 = W, t.toBytes = A, t.kdfInputToBytes = B, t.concatBytes = _, t.checkOpts = N, t.createHasher = z, t.createOptHasher = Rt, t.createXOFer = gt, t.randomBytes = ue;
  const e = Wa;
  function n($) {
    return $ instanceof Uint8Array || ArrayBuffer.isView($) && $.constructor.name === "Uint8Array";
  }
  function r($) {
    if (!Number.isSafeInteger($) || $ < 0)
      throw new Error("positive integer expected, got " + $);
  }
  function i($, ...P) {
    if (!n($))
      throw new Error("Uint8Array expected");
    if (P.length > 0 && !P.includes($.length))
      throw new Error("Uint8Array expected of length " + P + ", got length=" + $.length);
  }
  function s($) {
    if (typeof $ != "function" || typeof $.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r($.outputLen), r($.blockLen);
  }
  function o($, P = !0) {
    if ($.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (P && $.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a($, P) {
    i($);
    const yt = P.outputLen;
    if ($.length < yt)
      throw new Error("digestInto() expects output buffer of length at least " + yt);
  }
  function c($) {
    return new Uint8Array($.buffer, $.byteOffset, $.byteLength);
  }
  function u($) {
    return new Uint32Array($.buffer, $.byteOffset, Math.floor($.byteLength / 4));
  }
  function d(...$) {
    for (let P = 0; P < $.length; P++)
      $[P].fill(0);
  }
  function l($) {
    return new DataView($.buffer, $.byteOffset, $.byteLength);
  }
  function y($, P) {
    return $ << 32 - P | $ >>> P;
  }
  function h($, P) {
    return $ << P | $ >>> 32 - P >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function E($) {
    return $ << 24 & 4278190080 | $ << 8 & 16711680 | $ >>> 8 & 65280 | $ >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? ($) => $ : ($) => E($), t.byteSwapIfBE = t.swap8IfBE;
  function m($) {
    for (let P = 0; P < $.length; P++)
      $[P] = E($[P]);
    return $;
  }
  t.swap32IfBE = t.isLE ? ($) => $ : m;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", j = /* @__PURE__ */ Array.from({ length: 256 }, ($, P) => P.toString(16).padStart(2, "0"));
  function O($) {
    if (i($), C)
      return $.toHex();
    let P = "";
    for (let yt = 0; yt < $.length; yt++)
      P += j[$[yt]];
    return P;
  }
  const p = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function k($) {
    if ($ >= p._0 && $ <= p._9)
      return $ - p._0;
    if ($ >= p.A && $ <= p.F)
      return $ - (p.A - 10);
    if ($ >= p.a && $ <= p.f)
      return $ - (p.a - 10);
  }
  function I($) {
    if (typeof $ != "string")
      throw new Error("hex string expected, got " + typeof $);
    if (C)
      return Uint8Array.fromHex($);
    const P = $.length, yt = P / 2;
    if (P % 2)
      throw new Error("hex string expected, got unpadded hex of length " + P);
    const Nt = new Uint8Array(yt);
    for (let Tt = 0, Bt = 0; Tt < yt; Tt++, Bt += 2) {
      const ee = k($.charCodeAt(Bt)), fe = k($.charCodeAt(Bt + 1));
      if (ee === void 0 || fe === void 0) {
        const Yt = $[Bt] + $[Bt + 1];
        throw new Error('hex string expected, got non-hex character "' + Yt + '" at index ' + Bt);
      }
      Nt[Tt] = ee * 16 + fe;
    }
    return Nt;
  }
  const H = async () => {
  };
  t.nextTick = H;
  async function X($, P, yt) {
    let Nt = Date.now();
    for (let Tt = 0; Tt < $; Tt++) {
      yt(Tt);
      const Bt = Date.now() - Nt;
      Bt >= 0 && Bt < P || (await (0, t.nextTick)(), Nt += Bt);
    }
  }
  function K($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function W($) {
    return new TextDecoder().decode($);
  }
  function A($) {
    return typeof $ == "string" && ($ = K($)), i($), $;
  }
  function B($) {
    return typeof $ == "string" && ($ = K($)), i($), $;
  }
  function _(...$) {
    let P = 0;
    for (let Nt = 0; Nt < $.length; Nt++) {
      const Tt = $[Nt];
      i(Tt), P += Tt.length;
    }
    const yt = new Uint8Array(P);
    for (let Nt = 0, Tt = 0; Nt < $.length; Nt++) {
      const Bt = $[Nt];
      yt.set(Bt, Tt), Tt += Bt.length;
    }
    return yt;
  }
  function N($, P) {
    if (P !== void 0 && {}.toString.call(P) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign($, P);
  }
  class nt {
  }
  t.Hash = nt;
  function z($) {
    const P = (Nt) => $().update(A(Nt)).digest(), yt = $();
    return P.outputLen = yt.outputLen, P.blockLen = yt.blockLen, P.create = () => $(), P;
  }
  function Rt($) {
    const P = (Nt, Tt) => $(Tt).update(A(Nt)).digest(), yt = $({});
    return P.outputLen = yt.outputLen, P.blockLen = yt.blockLen, P.create = (Nt) => $(Nt), P;
  }
  function gt($) {
    const P = (Nt, Tt) => $(Tt).update(A(Nt)).digest(), yt = $({});
    return P.outputLen = yt.outputLen, P.blockLen = yt.blockLen, P.create = (Nt) => $(Nt), P;
  }
  t.wrapConstructor = z, t.wrapConstructorWithOpts = Rt, t.wrapXOFConstructorWithOpts = gt;
  function ue($ = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array($));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(X0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = X0;
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
})(V0);
const ni = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function q0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function cl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Rs(t, ...e) {
  if (!q0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function R1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  cl(t.outputLen), cl(t.blockLen);
}
function ll(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function W0(t, e) {
  Rs(t);
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
function ma(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function oa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Cn(t, e) {
  return t << 32 - e | t >>> e;
}
function V1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const mu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function xu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Y0 = mu ? (t) => t : (t) => xu(t), X1 = Y0;
function Z0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = xu(t[e]);
  return t;
}
const q1 = mu ? (t) => t : Z0, Q0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", W1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function J0(t) {
  if (Rs(t), Q0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += W1[t[n]];
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
  if (Q0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = Rf(t.charCodeAt(s)), a = Rf(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const tp = async () => {
};
async function Z1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await tp(), r += s);
  }
}
function Su(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Q1(t) {
  return new TextDecoder().decode(t);
}
function Eo(t) {
  return typeof t == "string" && (t = Su(t)), Rs(t), t;
}
function J1(t) {
  return typeof t == "string" && (t = Su(t)), Rs(t), t;
}
function tm(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    Rs(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function em(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let ep = class {
};
function Ya(t) {
  const e = (r) => t().update(Eo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function np(t) {
  const e = (r, i) => t(i).update(Eo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function rp(t) {
  const e = (r, i) => t(i).update(Eo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const nm = Ya, rm = np, sm = rp;
function im(t = 32) {
  if (ni && typeof ni.getRandomValues == "function")
    return ni.getRandomValues(new Uint8Array(t));
  if (ni && typeof ni.randomBytes == "function")
    return Uint8Array.from(ni.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const om = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: ep,
  abytes: Rs,
  aexists: ll,
  ahash: R1,
  anumber: cl,
  aoutput: W0,
  asyncLoop: Z1,
  byteSwap: xu,
  byteSwap32: Z0,
  byteSwapIfBE: X1,
  bytesToHex: J0,
  bytesToUtf8: Q1,
  checkOpts: em,
  clean: ma,
  concatBytes: tm,
  createHasher: Ya,
  createOptHasher: np,
  createView: oa,
  createXOFer: rp,
  hexToBytes: Y1,
  isBytes: q0,
  isLE: mu,
  kdfInputToBytes: J1,
  nextTick: tp,
  randomBytes: im,
  rotl: V1,
  rotr: Cn,
  swap32IfBE: q1,
  swap8IfBE: Y0,
  toBytes: Eo,
  u32: K1,
  u8: G1,
  utf8ToBytes: Su,
  wrapConstructor: nm,
  wrapConstructorWithOpts: rm,
  wrapXOFConstructorWithOpts: sm
}, Symbol.toStringTag, { value: "Module" }));
function am(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function cm(t, e, n) {
  return t & e ^ ~t & n;
}
function lm(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class um extends ep {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = oa(this.buffer);
  }
  update(e) {
    ll(this), e = Eo(e), Rs(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = oa(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ll(this), W0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, ma(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    am(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = oa(e), c = this.outputLen;
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
let Eu = class extends um {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = kr[0] | 0, this.B = kr[1] | 0, this.C = kr[2] | 0, this.D = kr[3] | 0, this.E = kr[4] | 0, this.F = kr[5] | 0, this.G = kr[6] | 0, this.H = kr[7] | 0;
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
      Cr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Cr[l - 15], h = Cr[l - 2], E = Cn(y, 7) ^ Cn(y, 18) ^ y >>> 3, m = Cn(h, 17) ^ Cn(h, 19) ^ h >>> 10;
      Cr[l] = m + Cr[l - 7] + E + Cr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Cn(a, 6) ^ Cn(a, 11) ^ Cn(a, 25), h = d + y + cm(a, c, u) + fm[l] + Cr[l] | 0, m = (Cn(r, 2) ^ Cn(r, 13) ^ Cn(r, 22)) + lm(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + m | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    ma(Cr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ma(this.buffer);
  }
}, sp = class extends Eu {
  constructor() {
    super(28), this.A = Lr[0] | 0, this.B = Lr[1] | 0, this.C = Lr[2] | 0, this.D = Lr[3] | 0, this.E = Lr[4] | 0, this.F = Lr[5] | 0, this.G = Lr[6] | 0, this.H = Lr[7] | 0;
  }
};
const dm = /* @__PURE__ */ Ya(() => new Eu()), hm = /* @__PURE__ */ Ya(() => new sp()), pm = Eu, ip = dm, gm = sp, ym = hm, wm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: gm,
  SHA256: pm,
  sha224: ym,
  sha256: ip
}, Symbol.toStringTag, { value: "Module" })), Za = /* @__PURE__ */ za(wm), bm = /* @__PURE__ */ za(vb);
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.joseToDer = Ei.derToJose = void 0;
const op = So, ap = Xe;
function Lc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const mm = {
  ES256: Lc(256),
  ES384: Lc(384),
  ES512: Lc(521)
};
function cp(t) {
  const e = mm[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const xa = 128, lp = 0, xm = 32, Sm = 16, Em = 2, up = Sm | xm | lp << 6, Sa = Em | lp << 6;
function fp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, op.toByteArray)((0, ap.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Am(t, e) {
  const n = fp(t), r = cp(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== up)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (xa | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Sa)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Sa)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (s - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${s - o}"`);
  if (i < d)
    throw new Error(`"s" specified length of "${d}", max of "${i}" is acceptable`);
  const l = o;
  if (o += d, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const y = r - c, h = r - d, E = new Uint8Array(y + c + h + d);
  for (o = 0; o < y; ++o)
    E[o] = 0;
  E.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const m = o; o < m + h; ++o)
    E[o] = 0;
  return E.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, ap.escape)((0, op.fromByteArray)(E));
}
Ei.derToJose = Am;
function Gf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= xa && --r, r;
}
function vm(t, e) {
  t = fp(t);
  const n = cp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = Gf(t, 0, n), s = Gf(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, u = c < xa, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = up, u ? d[l++] = c : (d[l++] = xa | 1, d[l++] = c & 255), d[l++] = Sa, d[l++] = o, i < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(i, n), l), l += n - i), d[l++] = Sa, d[l++] = a, s < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + s), l), d;
}
Ei.joseToDer = vm;
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
const Ao = /* @__PURE__ */ za(om);
Object.defineProperty(qa, "__esModule", { value: !0 });
qa.SECP256K1Client = void 0;
const km = V0, Lm = Za, aa = bm, Kf = Ei, Vf = dr, Xf = Ao;
aa.utils.hmacSha256Sync = (t, ...e) => {
  const n = km.hmac.create(Lm.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class dp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Xf.bytesToHex)(aa.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Vf.MissingParametersError("a signing input hash and private key are all required");
    const i = aa.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Xf.bytesToHex)(i);
    if (r === "jose")
      return (0, Kf.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Kf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Vf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return aa.verify(n, e, r, { strict: !1 });
  }
}
qa.SECP256K1Client = dp;
dp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = qa;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Xa);
var ks = {};
const Cm = /* @__PURE__ */ za(w0);
var Tm = We && We.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ks, "__esModule", { value: !0 });
ks.hashSha256Async = ks.hashSha256 = void 0;
const Bm = Za;
function hp(t) {
  return (0, Bm.sha256)(t);
}
ks.hashSha256 = hp;
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
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(hp(t));
    }
  });
}
ks.hashSha256Async = Mm;
var Nm = We && We.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.TokenSigner = Si.createUnsecuredToken = void 0;
const ul = Xe, qf = Xa, _m = dr, Wf = ks;
function fl(t, e) {
  const n = [], r = ul.encode(JSON.stringify(e));
  n.push(r);
  const i = ul.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function Pm(t) {
  return fl(t, { typ: "JWT", alg: "none" }) + ".";
}
Si.createUnsecuredToken = Pm;
class Um {
  constructor(e, n) {
    if (!(e && n))
      throw new _m.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !qf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = qf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = fl(e, i), o = (0, Wf.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Nm(this, void 0, void 0, function* () {
      const i = this.header(r), s = fl(e, i), o = yield (0, Wf.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [ul.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
Si.TokenSigner = Um;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
Qa.TokenVerifier = void 0;
const Hm = Xe, Yf = Xa, Om = dr, Oo = ks;
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
    const r = e.split("."), i = r[0] + "." + r[1], s = (o) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, a, this.rawPublicKey);
    };
    if (n)
      return (0, Oo.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, Oo.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Hm.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, Oo.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, Oo.hashSha256)(r);
      return s(o);
    }
  }
}
Qa.TokenVerifier = Dm;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
Ja.decodeToken = void 0;
const Do = Xe;
function Fm(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Do.decode(e[0])), r = JSON.parse(Do.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Do.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(Do.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Ja.decodeToken = Fm;
(function(t) {
  var e = We && We.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = We && We.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Si, t), n(Qa, t), n(Ja, t), n(dr, t), n(Xa, t);
})(He);
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
function pp(t) {
  if (t)
    return zm(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Rm = "1.4.0";
function Gm() {
  return C1();
}
function Km(t, e, n, r = a0.slice(), i, s = Iw().getTime(), o = {}) {
  const a = (h) => {
    const E = au("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return E == null ? void 0 : E.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Lw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: Rm,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = He.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = O0(u);
  return c.iss = jm(d), new He.TokenSigner("ES256k", t).sign(c);
}
async function Zf(t, e) {
  const n = mo(Dt(e)), r = JSON.parse(n), i = await z0(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function Vm(t) {
  const e = He.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new He.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Xm(t) {
  const e = He.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = pp(e.iss);
  if (n.length === 1) {
    if (O0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function qm(t) {
  const e = He.decodeToken(t).payload;
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
function Wm(t) {
  const e = He.decodeToken(t).payload;
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
    Wm(t),
    qm(t),
    Vm(t),
    Xm(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Qf = "1.0.0";
class Jr {
  constructor(e) {
    this.version = Qf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Qf)
      throw new nl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Jr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class gp {
  constructor(e) {
    if (e) {
      const n = new Jr(e);
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
class Jf extends gp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Jr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new c0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Jr({})), !0;
  }
}
class td extends gp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Aw, !localStorage.getItem(this.key)) {
      const r = new Jr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new c0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Jr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Jr({})), !0;
  }
}
var oo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(oo || (oo = {}));
var Ea;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ea || (Ea = {}));
oo.Mainnet;
var ur;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ur || (ur = {}));
var Wn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Wn || (Wn = {}));
ur.Mainnet;
const yp = {
  chainId: oo.Mainnet,
  transactionVersion: ur.Mainnet,
  peerNetworkId: Ea.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Wn.MainnetSingleSig,
    multiSig: Wn.MainnetMultiSig
  },
  client: { baseUrl: l0 }
}, dl = {
  chainId: oo.Testnet,
  transactionVersion: ur.Testnet,
  peerNetworkId: Ea.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Wn.TestnetSingleSig,
    multiSig: Wn.TestnetMultiSig
  },
  client: { baseUrl: u0 }
}, ca = {
  ...dl,
  addressVersion: { ...dl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: f0 }
}, Zm = {
  ...ca,
  addressVersion: { ...ca.addressVersion },
  client: { ...ca.client }
};
function Qm(t) {
  switch (t) {
    case "mainnet":
      return yp;
    case "testnet":
      return dl;
    case "devnet":
      return ca;
    case "mocknet":
      return Zm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function wp(t) {
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
var Bn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Bn || (Bn = {}));
const Cc = ["onChainOnly", "offChainOnly", "any"];
Cc[0] + "", Bn.OnChainOnly, Cc[1] + "", Bn.OffChainOnly, Cc[2] + "", Bn.Any, Bn.OnChainOnly + "", Bn.OnChainOnly, Bn.OffChainOnly + "", Bn.OffChainOnly, Bn.Any + "", Bn.Any;
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
function hl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Jm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function bp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function t2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  hl(t.outputLen), hl(t.blockLen);
}
function e2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function n2(t, e) {
  bp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ps = {
  number: hl,
  bool: Jm,
  bytes: bp,
  hash: t2,
  exists: e2,
  output: n2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Tc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), jn = (t, e) => t << 32 - e | t >>> e, r2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!r2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function s2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Au(t) {
  if (typeof t == "string" && (t = s2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let mp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Gs(t) {
  const e = (r) => t().update(Au(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let xp = class extends mp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ps.hash(e);
    const r = Au(n);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Sp = (t, e, n) => new xp(t, e).update(n).digest();
Sp.create = (t, e) => new xp(t, e);
function i2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let vu = class extends mp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Tc(this.buffer);
  }
  update(e) {
    ps.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Au(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Tc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ps.exists(this), ps.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    i2(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Tc(e), c = this.outputLen;
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
let Ep = class extends vu {
  constructor() {
    super(64, 32, 8, !1), this.A = Tr[0] | 0, this.B = Tr[1] | 0, this.C = Tr[2] | 0, this.D = Tr[3] | 0, this.E = Tr[4] | 0, this.F = Tr[5] | 0, this.G = Tr[6] | 0, this.H = Tr[7] | 0;
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
      Br[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Br[l - 15], h = Br[l - 2], E = jn(y, 7) ^ jn(y, 18) ^ y >>> 3, m = jn(h, 17) ^ jn(h, 19) ^ h >>> 10;
      Br[l] = m + Br[l - 7] + E + Br[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = jn(a, 6) ^ jn(a, 11) ^ jn(a, 25), h = d + y + o2(a, c, u) + c2[l] + Br[l] | 0, m = (jn(r, 2) ^ jn(r, 13) ^ jn(r, 22)) + a2(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + m | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Br.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, l2 = class extends Ep {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ap = Gs(() => new Ep());
Gs(() => new l2());
var Ks = {}, $u = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Ao;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (u < 4) {
        const E = n.indexOf(o[h]) >> u;
        let m = 0;
        h !== 0 && (m = n.indexOf(o[h - 1]));
        const C = 1 + u, j = m % (1 << C) << 5 - C, O = t.c32[E + j];
        u = C, c.unshift(O);
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
      for (let E = 0; E < h; E++)
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
    let d = [], l = 0, y = 0;
    for (let m = o.length - 1; m >= 0; m--) {
      y === 4 && (d.unshift(n[l]), y = 0, l = 0);
      const j = (t.c32.indexOf(o[m]) << y) + l, O = n[j % 16];
      if (y += 1, l = j >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      d.unshift(O);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let m = 0; m < d.length && d[m] === "0"; m++)
      h++;
    d = d.slice(h - h % 2);
    let E = d.join("");
    for (let m = 0; m < u; m++)
      E = `00${E}`;
    if (a) {
      const m = a * 2 - E.length;
      for (let C = 0; C < m; C += 2)
        E = `00${E}`;
    }
    return E;
  }
  t.c32decode = s;
})($u);
var Ls = {};
Object.defineProperty(Ls, "__esModule", { value: !0 });
Ls.c32checkDecode = Ls.c32checkEncode = void 0;
const gd = Za, yd = Ao, eo = $u;
function vp(t) {
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
  const r = vp(`${n}${e}`), i = (0, eo.c32encode)(`${e}${r}`);
  return `${eo.c32[t]}${i}`;
}
Ls.c32checkEncode = u2;
function f2(t) {
  t = (0, eo.c32normalize)(t);
  const e = (0, eo.c32decode)(t.slice(1)), n = t[0], r = eo.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), vp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ls.c32checkDecode = f2;
var $p = {}, Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.decode = Ai.encode = void 0;
const Aa = Za, wd = Ao, Ip = N0, kp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function d2(t, e = "00") {
  const n = typeof t == "string" ? (0, wd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, wd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, Aa.sha256)((0, Aa.sha256)(new Uint8Array([...r, ...n])));
  return Ip(kp).encode([...r, ...n, ...i.slice(0, 4)]);
}
Ai.encode = d2;
function h2(t) {
  const e = Ip(kp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, Aa.sha256)((0, Aa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Ai.decode = h2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ls, n = Ai, r = Ao;
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
    const y = n.decode(d), h = (0, r.bytesToHex)(y.data), E = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let m;
    return l < 0 ? (m = E, i[E] !== void 0 && (m = i[E])) : m = l, o(m, h);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const y = a(d), h = y[0], E = y[1];
    let m;
    l < 0 ? (m = h, s[h] !== void 0 && (m = s[h])) : m = l;
    let C = m.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(E, C);
  }
  t.c32ToB58 = u;
})($p);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = $u;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ls;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = $p;
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
})(Ks);
function p2(t, e) {
  switch (e = wp(e ?? yp), t) {
    case lr.P2PKH:
      switch (e.transactionVersion) {
        case ur.Mainnet:
          return Wn.MainnetSingleSig;
        case ur.Testnet:
          return Wn.TestnetSingleSig;
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
          return Wn.MainnetMultiSig;
        case ur.Testnet:
          return Wn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const g2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Lp = Uint8Array.from({ length: 16 }, (t, e) => e), y2 = Lp.map((t) => (9 * t + 5) % 16);
let Iu = [Lp], ku = [y2];
for (let t = 0; t < 4; t++)
  for (let e of [Iu, ku])
    e.push(e[t].map((n) => g2[n]));
const Cp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), w2 = Iu.map((t, e) => t.map((n) => Cp[e][n])), b2 = ku.map((t, e) => t.map((n) => Cp[e][n])), m2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), x2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Fo = (t, e) => t << e | t >>> 32 - e;
function bd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const jo = new Uint32Array(16);
let S2 = class extends vu {
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
    for (let h = 0; h < 16; h++, n += 4)
      jo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const E = 4 - h, m = m2[h], C = x2[h], j = Iu[h], O = ku[h], p = w2[h], k = b2[h];
      for (let I = 0; I < 16; I++) {
        const H = Fo(r + bd(h, s, a, u) + jo[j[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = Fo(a, 10) | 0, a = s, s = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = Fo(i + bd(E, o, c, d) + jo[O[I]] + C, k[I]) + y | 0;
        i = y, y = d, d = Fo(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    jo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const E2 = Gs(() => new S2()), zo = BigInt(2 ** 32 - 1), pl = BigInt(32);
function Tp(t, e = !1) {
  return e ? { h: Number(t & zo), l: Number(t >> pl & zo) } : { h: Number(t >> pl & zo) | 0, l: Number(t & zo) | 0 };
}
function A2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Tp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const v2 = (t, e) => BigInt(t >>> 0) << pl | BigInt(e >>> 0), $2 = (t, e, n) => t >>> n, I2 = (t, e, n) => t << 32 - n | e >>> n, k2 = (t, e, n) => t >>> n | e << 32 - n, L2 = (t, e, n) => t << 32 - n | e >>> n, C2 = (t, e, n) => t << 64 - n | e >>> n - 32, T2 = (t, e, n) => t >>> n - 32 | e << 64 - n, B2 = (t, e) => e, M2 = (t, e) => t, N2 = (t, e, n) => t << n | e >>> 32 - n, _2 = (t, e, n) => e << n | t >>> 32 - n, P2 = (t, e, n) => e << n - 32 | t >>> 64 - n, U2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function H2(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const O2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), D2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, F2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), j2 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, z2 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), R2 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, vt = {
  fromBig: Tp,
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
}, [G2, K2] = vt.split([
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
let tc = class extends vu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: E, Hh: m, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = E | 0, this.Hh = m | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Mr[p] = e.getUint32(n), Nr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = Mr[p - 15] | 0, I = Nr[p - 15] | 0, H = vt.rotrSH(k, I, 1) ^ vt.rotrSH(k, I, 8) ^ vt.shrSH(k, I, 7), X = vt.rotrSL(k, I, 1) ^ vt.rotrSL(k, I, 8) ^ vt.shrSL(k, I, 7), K = Mr[p - 2] | 0, W = Nr[p - 2] | 0, A = vt.rotrSH(K, W, 19) ^ vt.rotrBH(K, W, 61) ^ vt.shrSH(K, W, 6), B = vt.rotrSL(K, W, 19) ^ vt.rotrBL(K, W, 61) ^ vt.shrSL(K, W, 6), _ = vt.add4L(X, B, Nr[p - 7], Nr[p - 16]), N = vt.add4H(_, H, A, Mr[p - 7], Mr[p - 16]);
      Mr[p] = N | 0, Nr[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: E, Gh: m, Gl: C, Hh: j, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = vt.rotrSH(l, y, 14) ^ vt.rotrSH(l, y, 18) ^ vt.rotrBH(l, y, 41), I = vt.rotrSL(l, y, 14) ^ vt.rotrSL(l, y, 18) ^ vt.rotrBL(l, y, 41), H = l & h ^ ~l & m, X = y & E ^ ~y & C, K = vt.add5L(O, I, X, K2[p], Nr[p]), W = vt.add5H(K, j, k, H, G2[p], Mr[p]), A = K | 0, B = vt.rotrSH(r, i, 28) ^ vt.rotrBH(r, i, 34) ^ vt.rotrBH(r, i, 39), _ = vt.rotrSL(r, i, 28) ^ vt.rotrBL(r, i, 34) ^ vt.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      j = m | 0, O = C | 0, m = h | 0, C = E | 0, h = l | 0, E = y | 0, { h: l, l: y } = vt.add(u | 0, d | 0, W | 0, A | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const z = vt.add3L(A, _, nt);
      r = vt.add3H(z, W, B, N), i = z | 0;
    }
    ({ h: r, l: i } = vt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = vt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = vt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = vt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = vt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: E } = vt.add(this.Fh | 0, this.Fl | 0, h | 0, E | 0), { h: m, l: C } = vt.add(this.Gh | 0, this.Gl | 0, m | 0, C | 0), { h: j, l: O } = vt.add(this.Hh | 0, this.Hl | 0, j | 0, O | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, E, m, C, j, O);
  }
  roundClean() {
    Mr.fill(0), Nr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, V2 = class extends tc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X2 = class extends tc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, q2 = class extends tc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Gs(() => new tc());
Gs(() => new V2());
Gs(() => new X2());
Gs(() => new q2());
var va = { exports: {} };
va.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", h = "[object Number]", E = "[object Object]", m = "[object Promise]", C = "[object RegExp]", j = "[object Set]", O = "[object String]", p = "[object Symbol]", k = "[object WeakMap]", I = "[object ArrayBuffer]", H = "[object DataView]", X = "[object Float32Array]", K = "[object Float64Array]", W = "[object Int8Array]", A = "[object Int16Array]", B = "[object Int32Array]", _ = "[object Uint8Array]", N = "[object Uint8ClampedArray]", nt = "[object Uint16Array]", z = "[object Uint32Array]", Rt = /[\\^$.*+?()[\]{}|]/g, gt = /\w*$/, ue = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, P = {};
  P[s] = P[o] = P[I] = P[H] = P[a] = P[c] = P[X] = P[K] = P[W] = P[A] = P[B] = P[y] = P[h] = P[E] = P[C] = P[j] = P[O] = P[p] = P[_] = P[N] = P[nt] = P[z] = !0, P[u] = P[d] = P[k] = !1;
  var yt = typeof We == "object" && We && We.Object === Object && We, Nt = typeof self == "object" && self && self.Object === Object && self, Tt = yt || Nt || Function("return this")(), Bt = e && !e.nodeType && e, ee = Bt && !0 && t && !t.nodeType && t, fe = ee && ee.exports === Bt;
  function Yt(g, L) {
    return g.set(L[0], L[1]), g;
  }
  function me(g, L) {
    return g.add(L), g;
  }
  function xe(g, L) {
    for (var U = -1, st = g ? g.length : 0; ++U < st && L(g[U], U, g) !== !1; )
      ;
    return g;
  }
  function Zt(g, L) {
    for (var U = -1, st = L.length, Ue = g.length; ++U < st; )
      g[Ue + U] = L[U];
    return g;
  }
  function Ie(g, L, U, st) {
    for (var Ue = -1, Qe = g ? g.length : 0; ++Ue < Qe; )
      U = L(U, g[Ue], Ue, g);
    return U;
  }
  function wn(g, L) {
    for (var U = -1, st = Array(g); ++U < g; )
      st[U] = L(U);
    return st;
  }
  function Oe(g, L) {
    return g == null ? void 0 : g[L];
  }
  function an(g) {
    var L = !1;
    if (g != null && typeof g.toString != "function")
      try {
        L = !!(g + "");
      } catch {
      }
    return L;
  }
  function De(g) {
    var L = -1, U = Array(g.size);
    return g.forEach(function(st, Ue) {
      U[++L] = [Ue, st];
    }), U;
  }
  function ke(g, L) {
    return function(U) {
      return g(L(U));
    };
  }
  function Se(g) {
    var L = -1, U = Array(g.size);
    return g.forEach(function(st) {
      U[++L] = st;
    }), U;
  }
  var se = Array.prototype, ne = Function.prototype, Me = Object.prototype, Fe = Tt["__core-js_shared__"], ie = function() {
    var g = /[^.]+$/.exec(Fe && Fe.keys && Fe.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Ge = ne.toString, Ot = Me.hasOwnProperty, Ee = Me.toString, b = RegExp(
    "^" + Ge.call(Ot).replace(Rt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), S = fe ? Tt.Buffer : void 0, f = Tt.Symbol, V = Tt.Uint8Array, ct = ke(Object.getPrototypeOf, Object), lt = Object.create, Xt = Me.propertyIsEnumerable, x = se.splice, M = Object.getOwnPropertySymbols, T = S ? S.isBuffer : void 0, F = ke(Object.keys, Object), J = ut(Tt, "DataView"), wt = ut(Tt, "Map"), Ft = ut(Tt, "Promise"), pt = ut(Tt, "Set"), qt = ut(Tt, "WeakMap"), St = ut(Object, "create"), ot = ls(J), rt = ls(wt), dt = ls(Ft), xt = ls(pt), bt = ls(qt), Vt = f ? f.prototype : void 0, Ze = Vt ? Vt.valueOf : void 0;
  function Ne(g) {
    var L = -1, U = g ? g.length : 0;
    for (this.clear(); ++L < U; ) {
      var st = g[L];
      this.set(st[0], st[1]);
    }
  }
  function bn() {
    this.__data__ = St ? St(null) : {};
  }
  function _t(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function Pt(g) {
    var L = this.__data__;
    if (St) {
      var U = L[g];
      return U === r ? void 0 : U;
    }
    return Ot.call(L, g) ? L[g] : void 0;
  }
  function jt(g) {
    var L = this.__data__;
    return St ? L[g] !== void 0 : Ot.call(L, g);
  }
  function Ce(g, L) {
    var U = this.__data__;
    return U[g] = St && L === void 0 ? r : L, this;
  }
  Ne.prototype.clear = bn, Ne.prototype.delete = _t, Ne.prototype.get = Pt, Ne.prototype.has = jt, Ne.prototype.set = Ce;
  function Te(g) {
    var L = -1, U = g ? g.length : 0;
    for (this.clear(); ++L < U; ) {
      var st = g[L];
      this.set(st[0], st[1]);
    }
  }
  function mn() {
    this.__data__ = [];
  }
  function yr(g) {
    var L = this.__data__, U = ge(L, g);
    if (U < 0)
      return !1;
    var st = L.length - 1;
    return U == st ? L.pop() : x.call(L, U, 1), !0;
  }
  function wr(g) {
    var L = this.__data__, U = ge(L, g);
    return U < 0 ? void 0 : L[U][1];
  }
  function br(g) {
    return ge(this.__data__, g) > -1;
  }
  function Ys(g, L) {
    var U = this.__data__, st = ge(U, g);
    return st < 0 ? U.push([g, L]) : U[st][1] = L, this;
  }
  Te.prototype.clear = mn, Te.prototype.delete = yr, Te.prototype.get = wr, Te.prototype.has = br, Te.prototype.set = Ys;
  function _e(g) {
    var L = -1, U = g ? g.length : 0;
    for (this.clear(); ++L < U; ) {
      var st = g[L];
      this.set(st[0], st[1]);
    }
  }
  function Zs() {
    this.__data__ = {
      hash: new Ne(),
      map: new (wt || Te)(),
      string: new Ne()
    };
  }
  function is(g) {
    return q(this, g).delete(g);
  }
  function Qs(g) {
    return q(this, g).get(g);
  }
  function mr(g) {
    return q(this, g).has(g);
  }
  function xr(g, L) {
    return q(this, g).set(g, L), this;
  }
  _e.prototype.clear = Zs, _e.prototype.delete = is, _e.prototype.get = Qs, _e.prototype.has = mr, _e.prototype.set = xr;
  function cn(g) {
    this.__data__ = new Te(g);
  }
  function Sr() {
    this.__data__ = new Te();
  }
  function os(g) {
    return this.__data__.delete(g);
  }
  function Er(g) {
    return this.__data__.get(g);
  }
  function as(g) {
    return this.__data__.has(g);
  }
  function R(g, L) {
    var U = this.__data__;
    if (U instanceof Te) {
      var st = U.__data__;
      if (!wt || st.length < n - 1)
        return st.push([g, L]), this;
      U = this.__data__ = new _e(st);
    }
    return U.set(g, L), this;
  }
  cn.prototype.clear = Sr, cn.prototype.delete = os, cn.prototype.get = Er, cn.prototype.has = as, cn.prototype.set = R;
  function tt(g, L) {
    var U = xc(g) || Ry(g) ? wn(g.length, String) : [], st = U.length, Ue = !!st;
    for (var Qe in g)
      Ot.call(g, Qe) && !(Ue && (Qe == "length" || Ke(Qe, st))) && U.push(Qe);
    return U;
  }
  function oe(g, L, U) {
    var st = g[L];
    (!(Ot.call(g, L) && mf(st, U)) || U === void 0 && !(L in g)) && (g[L] = U);
  }
  function ge(g, L) {
    for (var U = g.length; U--; )
      if (mf(g[U][0], L))
        return U;
    return -1;
  }
  function cs(g, L) {
    return g && D(L, Sc(L), g);
  }
  function On(g, L, U, st, Ue, Qe, rr) {
    var Je;
    if (st && (Je = Qe ? st(g, Ue, Qe, rr) : st(g)), Je !== void 0)
      return Je;
    if (!Lo(g))
      return g;
    var Ef = xc(g);
    if (Ef) {
      if (Je = Gt(g), !L)
        return v(g, Je);
    } else {
      var ti = ht(g), Af = ti == d || ti == l;
      if (Ky(g))
        return Js(g, L);
      if (ti == E || ti == s || Af && !Qe) {
        if (an(g))
          return Qe ? g : {};
        if (Je = Pe(Af ? {} : g), !L)
          return Z(g, cs(Je, g));
      } else {
        if (!P[ti])
          return Qe ? g : {};
        Je = xn(g, ti, On, L);
      }
    }
    rr || (rr = new cn());
    var vf = rr.get(g);
    if (vf)
      return vf;
    if (rr.set(g, Je), !Ef)
      var $f = U ? et(g) : Sc(g);
    return xe($f || g, function(Ec, Co) {
      $f && (Co = Ec, Ec = g[Co]), oe(Je, Co, On(Ec, L, U, st, Co, g, rr));
    }), Je;
  }
  function re(g) {
    return Lo(g) ? lt(g) : {};
  }
  function Di(g, L, U) {
    var st = L(g);
    return xc(g) ? st : Zt(st, U(g));
  }
  function Fi(g) {
    return Ee.call(g);
  }
  function Ln(g) {
    if (!Lo(g) || ko(g))
      return !1;
    var L = Sf(g) || an(g) ? b : ue;
    return L.test(ls(g));
  }
  function ji(g) {
    if (!bf(g))
      return F(g);
    var L = [];
    for (var U in Object(g))
      Ot.call(g, U) && U != "constructor" && L.push(U);
    return L;
  }
  function Js(g, L) {
    if (L)
      return g.slice();
    var U = new g.constructor(g.length);
    return g.copy(U), U;
  }
  function zi(g) {
    var L = new g.constructor(g.byteLength);
    return new V(L).set(new V(g)), L;
  }
  function Ri(g, L) {
    var U = L ? zi(g.buffer) : g.buffer;
    return new g.constructor(U, g.byteOffset, g.byteLength);
  }
  function wc(g, L, U) {
    var st = L ? U(De(g), !0) : De(g);
    return Ie(st, Yt, new g.constructor());
  }
  function bc(g) {
    var L = new g.constructor(g.source, gt.exec(g));
    return L.lastIndex = g.lastIndex, L;
  }
  function Gi(g, L, U) {
    var st = L ? U(Se(g), !0) : Se(g);
    return Ie(st, me, new g.constructor());
  }
  function mc(g) {
    return Ze ? Object(Ze.call(g)) : {};
  }
  function w(g, L) {
    var U = L ? zi(g.buffer) : g.buffer;
    return new g.constructor(U, g.byteOffset, g.length);
  }
  function v(g, L) {
    var U = -1, st = g.length;
    for (L || (L = Array(st)); ++U < st; )
      L[U] = g[U];
    return L;
  }
  function D(g, L, U, st) {
    U || (U = {});
    for (var Ue = -1, Qe = L.length; ++Ue < Qe; ) {
      var rr = L[Ue], Je = void 0;
      oe(U, rr, Je === void 0 ? g[rr] : Je);
    }
    return U;
  }
  function Z(g, L) {
    return D(g, mt(g), L);
  }
  function et(g) {
    return Di(g, Sc, mt);
  }
  function q(g, L) {
    var U = g.__data__;
    return Dn(L) ? U[typeof L == "string" ? "string" : "hash"] : U.map;
  }
  function ut(g, L) {
    var U = Oe(g, L);
    return Ln(U) ? U : void 0;
  }
  var mt = M ? ke(M, Object) : qy, ht = Fi;
  (J && ht(new J(new ArrayBuffer(1))) != H || wt && ht(new wt()) != y || Ft && ht(Ft.resolve()) != m || pt && ht(new pt()) != j || qt && ht(new qt()) != k) && (ht = function(g) {
    var L = Ee.call(g), U = L == E ? g.constructor : void 0, st = U ? ls(U) : void 0;
    if (st)
      switch (st) {
        case ot:
          return H;
        case rt:
          return y;
        case dt:
          return m;
        case xt:
          return j;
        case bt:
          return k;
      }
    return L;
  });
  function Gt(g) {
    var L = g.length, U = g.constructor(L);
    return L && typeof g[0] == "string" && Ot.call(g, "index") && (U.index = g.index, U.input = g.input), U;
  }
  function Pe(g) {
    return typeof g.constructor == "function" && !bf(g) ? re(ct(g)) : {};
  }
  function xn(g, L, U, st) {
    var Ue = g.constructor;
    switch (L) {
      case I:
        return zi(g);
      case a:
      case c:
        return new Ue(+g);
      case H:
        return Ri(g, st);
      case X:
      case K:
      case W:
      case A:
      case B:
      case _:
      case N:
      case nt:
      case z:
        return w(g, st);
      case y:
        return wc(g, st, U);
      case h:
      case O:
        return new Ue(g);
      case C:
        return bc(g);
      case j:
        return Gi(g, st, U);
      case p:
        return mc(g);
    }
  }
  function Ke(g, L) {
    return L = L ?? i, !!L && (typeof g == "number" || $.test(g)) && g > -1 && g % 1 == 0 && g < L;
  }
  function Dn(g) {
    var L = typeof g;
    return L == "string" || L == "number" || L == "symbol" || L == "boolean" ? g !== "__proto__" : g === null;
  }
  function ko(g) {
    return !!ie && ie in g;
  }
  function bf(g) {
    var L = g && g.constructor, U = typeof L == "function" && L.prototype || Me;
    return g === U;
  }
  function ls(g) {
    if (g != null) {
      try {
        return Ge.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function zy(g) {
    return On(g, !0, !0);
  }
  function mf(g, L) {
    return g === L || g !== g && L !== L;
  }
  function Ry(g) {
    return Gy(g) && Ot.call(g, "callee") && (!Xt.call(g, "callee") || Ee.call(g) == s);
  }
  var xc = Array.isArray;
  function xf(g) {
    return g != null && Vy(g.length) && !Sf(g);
  }
  function Gy(g) {
    return Xy(g) && xf(g);
  }
  var Ky = T || Wy;
  function Sf(g) {
    var L = Lo(g) ? Ee.call(g) : "";
    return L == d || L == l;
  }
  function Vy(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= i;
  }
  function Lo(g) {
    var L = typeof g;
    return !!g && (L == "object" || L == "function");
  }
  function Xy(g) {
    return !!g && typeof g == "object";
  }
  function Sc(g) {
    return xf(g) ? tt(g) : ji(g);
  }
  function qy() {
    return [];
  }
  function Wy() {
    return !1;
  }
  t.exports = zy;
})(va, va.exports);
var W2 = va.exports;
const Bp = /* @__PURE__ */ r0(W2);
var gl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(gl || (gl = {}));
function Y2(t, e) {
  return { type: gl.Address, version: t, hash160: e };
}
function Z2(t) {
  return Ks.c32address(t.version, t.hash160);
}
const Q2 = (t) => E2(Ap(t)), J2 = (t) => ft(Q2(t));
be.hmacSha256Sync = (t, ...e) => {
  const n = Sp.create(Ap, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function tx(t, e = "mainnet") {
  e = wp(e), t = typeof t == "string" ? Dt(t) : t;
  const n = p2(lr.P2PKH, e), r = Y2(n, J2(t));
  return Z2(r);
}
function ex(t, e) {
  const n = He.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = tx(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new He.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function nx(t, e = null) {
  let n;
  e ? n = ex(t, e) : n = He.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const md = "_blockstackDidCheckEchoReply", rx = "echoReply", sx = "authContinuation";
function ix(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
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
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[sx];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class yl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new d0();
    else
      throw new $w("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new td(e.sessionOptions) : this.store = new td() : e ? this.store = new Jf(e.sessionOptions) : this.store = new Jf();
  }
  makeAuthRequestToken(e, n, r, i, s, o = kw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new nl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, Km(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Gm();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = au("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (ox())
        return ai.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ai.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Yw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new To("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = He.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Ym(e))
      throw new To("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (vc(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await Zf(i, s.private_key);
          } catch {
            if (ai.warn("Failed decryption of appPrivateKey, will try to use as given"), !be.isValidPrivateKey(s.private_key))
              throw new To("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Zf(i, c);
          } catch {
            ai.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new To("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Dw, d;
    vc(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), vc(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (d = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: pp(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, y = s.profile_url;
    if (!l.profile && y) {
      const h = await n(y);
      if (!h.ok)
        l.profile = Object.assign({}, Ew);
      else {
        const E = await h.text(), m = JSON.parse(E);
        l.profile = nx(m[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new nl("No user data found. Did the user sign in?");
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
yl.prototype.makeAuthRequest = yl.prototype.makeAuthRequestToken;
const ax = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], cx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = ax(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!ec(r.id));
  return e.concat(n);
}, ec = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Mp = "STX_PROVIDER", Cs = () => typeof window > "u" ? null : window.localStorage.getItem(Mp), lx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Mp, t);
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
var vi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(vi || (vi = {}));
var Ts;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ts || (Ts = {}));
var xd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(xd || (xd = {}));
const px = "https://api.mainnet.hiro.so", gx = "https://api.testnet.hiro.so", yx = "http://localhost:3999", wx = ["mainnet", "testnet", "devnet", "mocknet"];
class Bs {
  constructor(e) {
    this.version = Ts.Mainnet, this.chainId = vi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ts.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? hx();
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
Bs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new wl();
    case "testnet":
      return new bl();
    case "devnet":
      return new bx();
    case "mocknet":
      return new Np();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${wx.join(", ")}`);
  }
};
Bs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Bs.fromName(t);
class wl extends Bs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? px,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ts.Mainnet, this.chainId = vi.Mainnet;
  }
}
class bl extends Bs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? gx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ts.Testnet, this.chainId = vi.Testnet;
  }
}
class Np extends Bs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? yx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ts.Testnet, this.chainId = vi.Testnet;
  }
}
const bx = Np;
var Ms;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ms || (Ms = {}));
var $a;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($a || ($a = {}));
Ms.Mainnet;
var Ns;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ns || (Ns = {}));
var _s;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(_s || (_s = {}));
Ns.Mainnet;
const mx = {
  chainId: Ms.Mainnet,
  transactionVersion: Ns.Mainnet,
  peerNetworkId: $a.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: _s.MainnetSingleSig,
    multiSig: _s.MainnetMultiSig
  },
  client: { baseUrl: l0 }
}, ml = {
  chainId: Ms.Testnet,
  transactionVersion: Ns.Testnet,
  peerNetworkId: $a.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: _s.TestnetSingleSig,
    multiSig: _s.TestnetMultiSig
  },
  client: { baseUrl: u0 }
}, la = {
  ...ml,
  addressVersion: { ...ml.addressVersion },
  magicBytes: "id",
  client: { baseUrl: f0 }
}, xx = {
  ...la,
  addressVersion: { ...la.addressVersion },
  client: { ...la.client }
};
function Sx(t) {
  switch (t) {
    case "mainnet":
      return mx;
    case "testnet":
      return ml;
    case "devnet":
      return la;
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
function _p(t, e) {
  const n = Sd.get(t);
  if (n !== void 0)
    return n(e);
  const r = Ax(t);
  return Sd.set(t, r), _p(t, e);
}
let te = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Dt(e) : e;
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
    const n = this.readBytes(e).slice().reverse(), r = ft(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ft(n);
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
    if (_p(e, r))
      return r;
    throw n(r);
  }
};
const vx = 128, $x = 128, Pp = 16, xs = 32, xl = 80, nc = 65, Ix = 32, kx = 64, Ia = 34, Lx = 1 + 16 * 1024 * 1024, Cx = 165, Tx = 16, Bx = 16, Mx = 20, Nx = Bx + 2 + Mx, _x = Nx + 4, Px = Lx + (Cx + Tx * _x);
var Kt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Kt || (Kt = {}));
var Sl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Sl || (Sl = {}));
var un;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(un || (un = {}));
const Bc = ["onChainOnly", "offChainOnly", "any"];
Bc[0] + "", un.OnChainOnly, Bc[1] + "", un.OffChainOnly, Bc[2] + "", un.Any, un.OnChainOnly + "", un.OnChainOnly, un.OffChainOnly + "", un.OffChainOnly, un.Any + "", un.Any;
var ka;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ka || (ka = {}));
var ae;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ae || (ae = {}));
var ye;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ye || (ye = {}));
var Qt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Qt || (Qt = {}));
var he;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(he || (he = {}));
var no;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(no || (no = {}));
var El;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(El || (El = {}));
var Al;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Al || (Al = {}));
var qe;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(qe || (qe = {}));
var Ed;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ed || (Ed = {}));
var vl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(vl || (vl = {}));
var Nn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Nn || (Nn = {}));
var Ad;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ad || (Ad = {}));
let rc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ci = class extends rc {
  constructor(e) {
    super(e);
  }
}, Ve = class extends rc {
  constructor(e) {
    super(e);
  }
}, La = class extends rc {
  constructor(e) {
    super(e);
  }
}, gs = class extends rc {
  constructor(e) {
    super(e);
  }
};
function $l(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ux(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Up(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Hx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  $l(t.outputLen), $l(t.blockLen);
}
function Ox(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Dx(t, e) {
  Up(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ys = {
  number: $l,
  bool: Ux,
  bytes: Up,
  hash: Hx,
  exists: Ox,
  output: Dx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Mc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), zn = (t, e) => t << 32 - e | t >>> e, Fx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Fx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Lu(t) {
  if (typeof t == "string" && (t = jx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Hp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Vs(t) {
  const e = (r) => t().update(Lu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Op = class extends Hp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ys.hash(e);
    const r = Lu(n);
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
    return ys.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ys.exists(this), ys.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Dp = (t, e, n) => new Op(t, e).update(n).digest();
Dp.create = (t, e) => new Op(t, e);
function zx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Cu = class extends Hp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Mc(this.buffer);
  }
  update(e) {
    ys.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Lu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Mc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ys.exists(this), ys.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    zx(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Mc(e), c = this.outputLen;
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
let Fp = class extends Cu {
  constructor() {
    super(64, 32, 8, !1), this.A = _r[0] | 0, this.B = _r[1] | 0, this.C = _r[2] | 0, this.D = _r[3] | 0, this.E = _r[4] | 0, this.F = _r[5] | 0, this.G = _r[6] | 0, this.H = _r[7] | 0;
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
      Pr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Pr[l - 15], h = Pr[l - 2], E = zn(y, 7) ^ zn(y, 18) ^ y >>> 3, m = zn(h, 17) ^ zn(h, 19) ^ h >>> 10;
      Pr[l] = m + Pr[l - 7] + E + Pr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = zn(a, 6) ^ zn(a, 11) ^ zn(a, 25), h = d + y + Rx(a, c, u) + Kx[l] + Pr[l] | 0, m = (zn(r, 2) ^ zn(r, 13) ^ zn(r, 22)) + Gx(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + m | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Pr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Vx = class extends Fp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Tu = Vs(() => new Fp());
Vs(() => new Vx());
const Xx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), jp = Uint8Array.from({ length: 16 }, (t, e) => e), qx = jp.map((t) => (9 * t + 5) % 16);
let Bu = [jp], Mu = [qx];
for (let t = 0; t < 4; t++)
  for (let e of [Bu, Mu])
    e.push(e[t].map((n) => Xx[n]));
const zp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Wx = Bu.map((t, e) => t.map((n) => zp[e][n])), Yx = Mu.map((t, e) => t.map((n) => zp[e][n])), Zx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Qx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ro = (t, e) => t << e | t >>> 32 - e;
function vd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Go = new Uint32Array(16);
let Jx = class extends Cu {
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
    for (let h = 0; h < 16; h++, n += 4)
      Go[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const E = 4 - h, m = Zx[h], C = Qx[h], j = Bu[h], O = Mu[h], p = Wx[h], k = Yx[h];
      for (let I = 0; I < 16; I++) {
        const H = Ro(r + vd(h, s, a, u) + Go[j[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = Ro(a, 10) | 0, a = s, s = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = Ro(i + vd(E, o, c, d) + Go[O[I]] + C, k[I]) + y | 0;
        i = y, y = d, d = Ro(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Go.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const tS = Vs(() => new Jx()), Ko = BigInt(2 ** 32 - 1), Il = BigInt(32);
function Rp(t, e = !1) {
  return e ? { h: Number(t & Ko), l: Number(t >> Il & Ko) } : { h: Number(t >> Il & Ko) | 0, l: Number(t & Ko) | 0 };
}
function eS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Rp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const nS = (t, e) => BigInt(t >>> 0) << Il | BigInt(e >>> 0), rS = (t, e, n) => t >>> n, sS = (t, e, n) => t << 32 - n | e >>> n, iS = (t, e, n) => t >>> n | e << 32 - n, oS = (t, e, n) => t << 32 - n | e >>> n, aS = (t, e, n) => t << 64 - n | e >>> n - 32, cS = (t, e, n) => t >>> n - 32 | e << 64 - n, lS = (t, e) => e, uS = (t, e) => t, fS = (t, e, n) => t << n | e >>> 32 - n, dS = (t, e, n) => e << n | t >>> 32 - n, hS = (t, e, n) => e << n - 32 | t >>> 64 - n, pS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function gS(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const yS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), wS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, bS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), mS = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, xS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), SS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, $t = {
  fromBig: Rp,
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
}, [ES, AS] = $t.split([
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
let sc = class extends Cu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: E, Hh: m, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = E | 0, this.Hh = m | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Ur[p] = e.getUint32(n), Hr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = Ur[p - 15] | 0, I = Hr[p - 15] | 0, H = $t.rotrSH(k, I, 1) ^ $t.rotrSH(k, I, 8) ^ $t.shrSH(k, I, 7), X = $t.rotrSL(k, I, 1) ^ $t.rotrSL(k, I, 8) ^ $t.shrSL(k, I, 7), K = Ur[p - 2] | 0, W = Hr[p - 2] | 0, A = $t.rotrSH(K, W, 19) ^ $t.rotrBH(K, W, 61) ^ $t.shrSH(K, W, 6), B = $t.rotrSL(K, W, 19) ^ $t.rotrBL(K, W, 61) ^ $t.shrSL(K, W, 6), _ = $t.add4L(X, B, Hr[p - 7], Hr[p - 16]), N = $t.add4H(_, H, A, Ur[p - 7], Ur[p - 16]);
      Ur[p] = N | 0, Hr[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: E, Gh: m, Gl: C, Hh: j, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = $t.rotrSH(l, y, 14) ^ $t.rotrSH(l, y, 18) ^ $t.rotrBH(l, y, 41), I = $t.rotrSL(l, y, 14) ^ $t.rotrSL(l, y, 18) ^ $t.rotrBL(l, y, 41), H = l & h ^ ~l & m, X = y & E ^ ~y & C, K = $t.add5L(O, I, X, AS[p], Hr[p]), W = $t.add5H(K, j, k, H, ES[p], Ur[p]), A = K | 0, B = $t.rotrSH(r, i, 28) ^ $t.rotrBH(r, i, 34) ^ $t.rotrBH(r, i, 39), _ = $t.rotrSL(r, i, 28) ^ $t.rotrBL(r, i, 34) ^ $t.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      j = m | 0, O = C | 0, m = h | 0, C = E | 0, h = l | 0, E = y | 0, { h: l, l: y } = $t.add(u | 0, d | 0, W | 0, A | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const z = $t.add3L(A, _, nt);
      r = $t.add3H(z, W, B, N), i = z | 0;
    }
    ({ h: r, l: i } = $t.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = $t.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = $t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = $t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = $t.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: E } = $t.add(this.Fh | 0, this.Fl | 0, h | 0, E | 0), { h: m, l: C } = $t.add(this.Gh | 0, this.Gl | 0, m | 0, C | 0), { h: j, l: O } = $t.add(this.Hh | 0, this.Hl | 0, j | 0, O | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, E, m, C, j, O);
  }
  roundClean() {
    Ur.fill(0), Hr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, vS = class extends sc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, $S = class extends sc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, IS = class extends sc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Vs(() => new sc());
Vs(() => new vS());
const kS = Vs(() => new $S());
Vs(() => new IS());
var Ut;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ut || (Ut = {}));
var Le;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Le || (Le = {}));
function Nu(t) {
  return Le[t];
}
const LS = () => ({ type: Ut.BoolTrue }), CS = () => ({ type: Ut.BoolFalse }), TS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ut.Buffer, value: ft(t) };
}, $d = BigInt("0xffffffffffffffffffffffffffffffff"), BS = BigInt(0), Id = BigInt("0x7fffffffffffffffffffffffffffffff"), kd = BigInt("-170141183460469231731687303715884105728"), MS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = sl(Dt(t))), on(t, Uint8Array) && (t = sl(t));
  const e = Re(t);
  if (e > Id)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Id}`);
  if (e < kd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${kd}`);
  return { type: Ut.Int, value: e };
}, NS = (t) => {
  const e = Re(t);
  if (e < BS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > $d)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${$d}`);
  return { type: Ut.UInt, value: e };
};
function _S(t) {
  return { type: Ut.List, value: t };
}
function Gp() {
  return { type: Ut.OptionalNone };
}
function Kp(t) {
  return { type: Ut.OptionalSome, value: t };
}
var Q;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Q || (Q = {}));
function PS() {
  return {
    type: Q.Address,
    version: _s.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Ld(t) {
  if (t && tg(t, Ia))
    throw new Error(`Memo exceeds maximum length of ${Ia} bytes`);
  return { type: Q.MemoString, content: t };
}
function _u(t, e) {
  return {
    type: Q.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function kl(t) {
  if (Dt(t).byteLength != nc)
    throw Error("Invalid signature");
  return {
    type: Q.MessageSignature,
    data: t
  };
}
function US(t, e, n) {
  return typeof t == "string" && (t = QS(t)), typeof n == "string" && (n = Ld(n)), {
    type: Q.Payload,
    payloadType: Kt.TokenTransfer,
    recipient: t,
    amount: Re(e),
    memo: n ?? Ld("")
  };
}
function HS(t, e, n, r) {
  return typeof e == "string" && (e = Un(e)), typeof n == "string" && (n = Un(n)), {
    type: Q.Payload,
    payloadType: Kt.ContractCall,
    contractAddress: typeof t == "string" ? rs(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function OS(t) {
  return Un(t, 4, 1e5);
}
function Cd(t, e, n) {
  return typeof t == "string" && (t = Un(t)), typeof e == "string" && (e = OS(e)), typeof n == "number" ? {
    type: Q.Payload,
    payloadType: Kt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Q.Payload,
    payloadType: Kt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function DS() {
  return { type: Q.Payload, payloadType: Kt.PoisonMicroblock };
}
function Td(t, e) {
  if (t.byteLength != xs)
    throw Error(`Coinbase buffer size must be ${xs} bytes`);
  return e != null ? {
    type: Q.Payload,
    payloadType: Kt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Q.Payload,
    payloadType: Kt.Coinbase,
    coinbaseBytes: t
  };
}
function FS(t, e, n) {
  if (t.byteLength != xs)
    throw Error(`Coinbase buffer size must be ${xs} bytes`);
  if (n.byteLength != xl)
    throw Error(`VRF proof buffer size must be ${xl} bytes`);
  return {
    type: Q.Payload,
    payloadType: Kt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ut.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function jS(t, e, n, r, i, s, o) {
  return {
    type: Q.Payload,
    payloadType: Kt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Un(t, e, n) {
  const r = e || 1, i = n || vx;
  if (tg(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Q.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function zS(t, e, n) {
  return {
    type: Q.Asset,
    address: rs(t),
    contractName: Un(e),
    assetName: Un(n)
  };
}
function rs(t) {
  const e = Ks.c32addressDecode(t);
  return {
    type: Q.Address,
    version: e[0],
    hash160: e[1]
  };
}
function RS(t, e) {
  const n = rs(t), r = Un(e);
  return {
    type: Q.Principal,
    prefix: qe.Contract,
    address: n,
    contractName: r
  };
}
function GS(t) {
  const e = rs(t);
  return {
    type: Q.Principal,
    prefix: qe.Standard,
    address: e
  };
}
function li(t, e) {
  return {
    pubKeyEncoding: t,
    type: Q.TransactionAuthField,
    contents: e
  };
}
function ar(t) {
  switch (t.type) {
    case Q.Address:
      return vo(t);
    case Q.Principal:
      return Vp(t);
    case Q.LengthPrefixedString:
      return Ii(t);
    case Q.MemoString:
      return VS(t);
    case Q.Asset:
      return qp(t);
    case Q.PostCondition:
      return Yp(t);
    case Q.PublicKey:
      return Tl(t);
    case Q.LengthPrefixedList:
      return Pu(t);
    case Q.Payload:
      return Zp(t);
    case Q.TransactionAuthField:
      return ZS(t);
    case Q.MessageSignature:
      return Uu(t);
  }
}
function vo(t) {
  const e = [];
  return e.push(Dt(bo(t.version, 1))), e.push(Dt(t.hash160)), ve(e);
}
function $i(t) {
  const e = on(t, te) ? t : new te(t), n = Ra(ft(e.readBytes(1))), r = ft(e.readBytes(20));
  return { type: Q.Address, version: n, hash160: r };
}
function Vp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === qe.Standard || t.prefix === qe.Contract) && e.push(vo(t.address)), t.prefix === qe.Contract && e.push(Ii(t.contractName)), ve(e);
}
function KS(t) {
  const e = on(t, te) ? t : new te(t), n = e.readUInt8Enum(qe, (s) => {
    throw new Ve(`Unexpected Principal payload type: ${s}`);
  });
  if (n === qe.Origin)
    return { type: Q.Principal, prefix: n };
  const r = $i(e);
  if (n === qe.Standard)
    return { type: Q.Principal, prefix: n, address: r };
  const i = vn(e);
  return {
    type: Q.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Ii(t) {
  const e = [], n = js(t.content), r = n.byteLength;
  return e.push(Dt(bo(r, t.lengthPrefixBytes))), e.push(n), ve(e);
}
function vn(t, e, n) {
  e = e || 1;
  const r = on(t, te) ? t : new te(t), i = Ra(ft(r.readBytes(e))), s = mo(r.readBytes(i));
  return Un(s, e, n ?? 128);
}
function VS(t) {
  const e = [], n = js(t.content), r = x3(ft(n), Ia * 2);
  return e.push(Dt(r)), ve(e);
}
function Xp(t) {
  const e = on(t, te) ? t : new te(t);
  let n = mo(e.readBytes(Ia));
  return n = n.replace(/\u0000*$/, ""), { type: Q.MemoString, content: n };
}
function qp(t) {
  const e = [];
  return e.push(vo(t.address)), e.push(Ii(t.contractName)), e.push(Ii(t.assetName)), ve(e);
}
function Ll(t) {
  const e = on(t, te) ? t : new te(t);
  return {
    type: Q.Asset,
    address: $i(e),
    contractName: vn(e),
    assetName: vn(e)
  };
}
function Pu(t) {
  const e = t.values, n = [];
  n.push(Dt(bo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(ar(r));
  return ve(n);
}
function Wp(t, e, n) {
  const r = on(t, te) ? t : new te(t), i = Ra(ft(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case Q.Address:
        s.push($i(r));
        break;
      case Q.LengthPrefixedString:
        s.push(vn(r));
        break;
      case Q.MemoString:
        s.push(Xp(r));
        break;
      case Q.Asset:
        s.push(Ll(r));
        break;
      case Q.PostCondition:
        s.push(qS(r));
        break;
      case Q.PublicKey:
        s.push(Bl(r));
        break;
      case Q.TransactionAuthField:
        s.push(YS(r));
        break;
    }
  return _u(s, n);
}
function XS(t) {
  return ft(Yp(t));
}
function Yp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Vp(t.principal)), (t.conditionType === ae.Fungible || t.conditionType === ae.NonFungible) && e.push(qp(t.asset)), t.conditionType === ae.NonFungible && e.push(Yn(t.assetName)), e.push(t.conditionCode), t.conditionType === ae.STX || t.conditionType === ae.Fungible || t.conditionType === ae.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ci("The post-condition amount may not be larger than 8 bytes");
    e.push(es(t.amount, 8));
  }
  return ve(e);
}
function qS(t) {
  const e = on(t, te) ? t : new te(t), n = e.readUInt8Enum(ae, (a) => {
    throw new Ve(`Could not read ${a} as PostConditionType`);
  }), r = KS(e);
  let i, s, o;
  switch (n) {
    case ae.STX:
      return i = e.readUInt8Enum(no, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ft(e.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: ae.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ae.Fungible:
      return s = Ll(e), i = e.readUInt8Enum(no, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ft(e.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: ae.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case ae.NonFungible:
      s = Ll(e);
      const a = Xn(e);
      return i = e.readUInt8Enum(El, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: Q.PostCondition,
        conditionType: ae.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case ae.Staking:
      return i = e.readUInt8Enum(no, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ft(e.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: ae.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ae.PoX: {
      const c = e.readUInt8Enum(Al, (u) => {
        throw new Ve(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: Q.PostCondition,
        conditionType: ae.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Zp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Kt.TokenTransfer:
      e.push(Yn(t.recipient)), e.push(es(t.amount, 8)), e.push(ar(t.memo));
      break;
    case Kt.ContractCall:
      e.push(ar(t.contractAddress)), e.push(ar(t.contractName)), e.push(ar(t.functionName));
      const n = new Uint8Array(4);
      vs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Yn(r));
      });
      break;
    case Kt.SmartContract:
      e.push(ar(t.contractName)), e.push(ar(t.codeBody));
      break;
    case Kt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(ar(t.contractName)), e.push(ar(t.codeBody));
      break;
    case Kt.PoisonMicroblock:
      break;
    case Kt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Kt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Yn(t.recipient));
      break;
    case Kt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Yn(t.recipient ? Kp(t.recipient) : Gp())), e.push(t.vrfProof);
      break;
    case Kt.TenureChange:
      e.push(Dt(t.tenureHash)), e.push(Dt(t.previousTenureHash)), e.push(Dt(t.burnViewHash)), e.push(Dt(t.previousTenureEnd)), e.push(vs(new Uint8Array(4), t.previousTenureBlocks)), e.push(Kw(new Uint8Array(1), t.cause)), e.push(Dt(t.publicKeyHash));
      break;
  }
  return ve(e);
}
function WS(t) {
  const e = on(t, te) ? t : new te(t);
  switch (e.readUInt8Enum(Kt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Kt.TokenTransfer:
      const r = Xn(e), i = Re(e.readBytes(8)), s = Xp(e);
      return US(r, i, s);
    case Kt.ContractCall:
      const o = $i(e), a = vn(e), c = vn(e), u = [], d = e.readUInt32BE();
      for (let k = 0; k < d; k++) {
        const I = Xn(e);
        u.push(I);
      }
      return HS(o, a, c, u);
    case Kt.SmartContract:
      const l = vn(e), y = vn(e, 4, 1e5);
      return Cd(l, y);
    case Kt.VersionedSmartContract: {
      const k = e.readUInt8Enum(Sl, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), I = vn(e), H = vn(e, 4, Px);
      return Cd(I, H, k);
    }
    case Kt.PoisonMicroblock:
      return DS();
    case Kt.Coinbase: {
      const k = e.readBytes(xs);
      return Td(k);
    }
    case Kt.CoinbaseToAltRecipient: {
      const k = e.readBytes(xs), I = Xn(e);
      return Td(k, I);
    }
    case Kt.NakamotoCoinbase: {
      const k = e.readBytes(xs), I = Xn(e), H = e.readBytes(xl);
      return FS(k, I, H);
    }
    case Kt.TenureChange:
      const h = ft(e.readBytes(20)), E = ft(e.readBytes(20)), m = ft(e.readBytes(20)), C = ft(e.readBytes(32)), j = e.readUInt32BE(), O = e.readUInt8Enum(vl, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), p = ft(e.readBytes(20));
      return jS(h, E, m, C, j, O, p);
  }
}
function Cl(t) {
  const e = on(t, te) ? t : new te(t);
  return kl(ft(e.readBytes(nc)));
}
function YS(t) {
  const e = on(t, te) ? t : new te(t), n = e.readUInt8Enum(Nn, (r) => {
    throw new Ve(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Nn.PublicKeyCompressed:
      return li(he.Compressed, Bl(e));
    case Nn.PublicKeyUncompressed:
      return li(he.Uncompressed, _i(B3(Bl(e).data)));
    case Nn.SignatureCompressed:
      return li(he.Compressed, Cl(e));
    case Nn.SignatureUncompressed:
      return li(he.Uncompressed, Cl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Uu(t) {
  return Dt(t.data);
}
function ZS(t) {
  const e = [];
  switch (t.contents.type) {
    case Q.PublicKey:
      e.push(t.pubKeyEncoding === he.Compressed ? Nn.PublicKeyCompressed : Nn.PublicKeyUncompressed), e.push(Dt(T3(t.contents.data)));
      break;
    case Q.MessageSignature:
      e.push(t.pubKeyEncoding === he.Compressed ? Nn.SignatureCompressed : Nn.SignatureUncompressed), e.push(Uu(t.contents));
      break;
  }
  return ve(e);
}
function Tl(t) {
  return t.data.slice();
}
function Bl(t) {
  const e = on(t, te) ? t : new te(t), n = e.readUInt8(), r = n === 4 ? kx : Ix;
  return _i(ve([n, e.readBytes(r)]));
}
function Hu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Qt.P2PKH || e === Qt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Qt.P2WPKH || e === Qt.P2WSH || e === Qt.P2WSHNonSequential) && !r.map((i) => i.data).every(Pi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Qt.P2PKH:
      return Vo(t, S3(r[0].data));
    case Qt.P2WPKH:
      return Vo(t, E3(r[0].data));
    case Qt.P2SH:
    case Qt.P2SHNonSequential:
      return Vo(t, A3(n, r.map(Tl)));
    case Qt.P2WSH:
    case Qt.P2WSHNonSequential:
      return Vo(t, v3(n, r.map(Tl)));
  }
}
function Vo(t, e) {
  return { type: Q.Address, version: t, hash160: e };
}
function Ou(t) {
  return Ks.c32address(t.version, t.hash160);
}
function Bd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return zS(e, n, r);
}
function qi(t) {
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
  const e = rs(t);
  return { type: Ut.PrincipalStandard, value: Ou(e) };
}
function t3(t) {
  return { type: Ut.PrincipalStandard, value: Ou(t) };
}
function e3(t, e) {
  const n = rs(t), r = Un(e);
  return Qp(n, r);
}
function Qp(t, e) {
  if (js(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ut.PrincipalContract,
    value: `${Ou(t)}.${e.content}`
  };
}
function n3(t) {
  return { type: Ut.ResponseErr, value: t };
}
function r3(t) {
  return { type: Ut.ResponseOk, value: t };
}
const s3 = (t) => ({ type: Ut.StringASCII, value: t }), i3 = (t) => ({ type: Ut.StringUTF8, value: t });
function o3(t) {
  for (const e in t)
    if (!$3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ut.Tuple, value: t };
}
function Xn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new te(Dt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new te(t) : e = t;
  switch (e.readUInt8Enum(Le, (r) => {
    throw new Ve(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Le.int:
      return MS(sl(e.readBytes(16)));
    case Le.uint:
      return NS(e.readBytes(16));
    case Le.buffer:
      const r = e.readUInt32BE();
      return TS(e.readBytes(r));
    case Le.true:
      return LS();
    case Le.false:
      return CS();
    case Le.address:
      const i = $i(e);
      return t3(i);
    case Le.contract:
      const s = $i(e), o = vn(e);
      return Qp(s, o);
    case Le.ok:
      return r3(Xn(e));
    case Le.err:
      return n3(Xn(e));
    case Le.none:
      return Gp();
    case Le.some:
      return Kp(Xn(e));
    case Le.list:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(Xn(e));
      return _S(c);
    case Le.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let m = 0; m < u; m++) {
        const C = vn(e).content;
        if (C === void 0)
          throw new Ve('"content" is undefined');
        d[C] = Xn(e);
      }
      return o3(d);
    case Le.ascii:
      const l = e.readUInt32BE(), y = Hw(e.readBytes(l));
      return s3(y);
    case Le.utf8:
      const h = e.readUInt32BE(), E = mo(e.readBytes(h));
      return i3(E);
    default:
      throw new Ve("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function tr(t, e) {
  return ve([Nu(t), e]);
}
function a3(t) {
  return new Uint8Array([Nu(t.type)]);
}
function c3(t) {
  return t.type === Ut.OptionalNone ? new Uint8Array([Nu(t.type)]) : tr(t.type, Yn(t.value));
}
function l3(t) {
  const e = new Uint8Array(4);
  return vs(e, Math.ceil(t.value.length / 2), 0), tr(t.type, Qn(e, Dt(t.value)));
}
function u3(t) {
  const e = cu(Mw(BigInt(t.value), BigInt($x)), Pp);
  return tr(t.type, e);
}
function f3(t) {
  const e = cu(BigInt(t.value), Pp);
  return tr(t.type, e);
}
function d3(t) {
  return tr(t.type, vo(rs(t.value)));
}
function h3(t) {
  const [e, n] = I3(t.value);
  return tr(t.type, Qn(vo(rs(e)), Ii(Un(n))));
}
function p3(t) {
  return tr(t.type, Yn(t.value));
}
function g3(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = Yn(r);
    e.push(i);
  }
  return tr(t.type, ve(e));
}
function y3(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Un(i);
    e.push(Ii(s));
    const o = Yn(t.value[i]);
    e.push(o);
  }
  return tr(t.type, ve(e));
}
function Jp(t, e) {
  const n = [], r = e == "ascii" ? Uw(t.value) : js(t.value), i = new Uint8Array(4);
  return vs(i, r.length, 0), n.push(i), n.push(r), tr(t.type, ve(n));
}
function w3(t) {
  return Jp(t, "ascii");
}
function b3(t) {
  return Jp(t, "utf8");
}
function Md(t) {
  return ft(Yn(t));
}
function Yn(t) {
  switch (t.type) {
    case Ut.BoolTrue:
    case Ut.BoolFalse:
      return a3(t);
    case Ut.OptionalNone:
    case Ut.OptionalSome:
      return c3(t);
    case Ut.Buffer:
      return l3(t);
    case Ut.UInt:
      return f3(t);
    case Ut.Int:
      return u3(t);
    case Ut.PrincipalStandard:
      return d3(t);
    case Ut.PrincipalContract:
      return h3(t);
    case Ut.ResponseOk:
    case Ut.ResponseErr:
      return p3(t);
    case Ut.List:
      return g3(t);
    case Ut.Tuple:
      return y3(t);
    case Ut.StringASCII:
      return w3(t);
    case Ut.StringUTF8:
      return b3(t);
    default:
      throw new ci("Unable to serialize. Invalid Clarity Value.");
  }
}
const m3 = (t) => t.length % 2 ? `0${t}` : t, x3 = (t, e) => t.padEnd(e, "0"), tg = (t, e) => t ? js(t).length > e : !1;
function Ml(t) {
  return Bp(t);
}
const ao = (t) => tS(Tu(t)), Du = (t) => ft(kS(t)), S3 = (t) => ft(ao(t)), E3 = (t) => {
  const e = ao(t), n = Qn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ao(n);
  return ft(r);
}, A3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = ve(n), i = ao(r);
  return ft(i);
}, v3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = ve(n), i = Tu(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = ve(s), a = ao(o);
  return ft(a);
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
be.hmacSha256Sync = (t, ...e) => {
  const n = Dp.create(Tu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function _i(t) {
  return t = typeof t == "string" ? Dt(t) : t, {
    type: Q.PublicKey,
    data: t
  };
}
function k3(t, e, n = he.Compressed) {
  const r = jw(e), i = new pn(Mf(r.r), Mf(r.s)), s = Ct.fromSignature(t, i, r.recoveryId), o = n === he.Compressed;
  return s.toHex(o);
}
function L3(t) {
  return typeof t == "string" ? t : ft(t);
}
const Fu = L3;
function eg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Fw;
}
function Pi(t) {
  return !Fu(t).startsWith("04");
}
function C3(t) {
  t = lu(t);
  const e = eg(t);
  return ft(xo(t.slice(0, 32), e));
}
function T3(t) {
  return Ct.fromHex(Fu(t)).toHex(!0);
}
function B3(t) {
  return Ct.fromHex(Fu(t)).toHex(!1);
}
function M3(t, e) {
  t = lu(t);
  const [n, r] = Ka(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return bo(r, 1) + pn.fromHex(n).toCompactHex();
}
function ju() {
  return {
    type: Q.MessageSignature,
    data: ft(new Uint8Array(nc))
  };
}
function ng(t, e, n, r) {
  const i = Hu(0, t, 1, [_i(e)]).hash160, s = Pi(e) ? he.Compressed : he.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Re(n),
    fee: Re(r),
    keyEncoding: s,
    signature: ju()
  };
}
function co(t) {
  return "signature" in t;
}
function Nd(t) {
  return t === Qt.P2SH || t === Qt.P2WSH;
}
function N3(t) {
  return t === Qt.P2SHNonSequential || t === Qt.P2WSHNonSequential;
}
function _d(t) {
  const e = Ml(t);
  return e.nonce = 0, e.fee = 0, co(e) ? e.signature = ju() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function _3(t) {
  const e = [
    t.hashMode,
    Dt(t.signer),
    es(t.nonce, 8),
    es(t.fee, 8),
    t.keyEncoding,
    Uu(t.signature)
  ];
  return ve(e);
}
function P3(t) {
  const e = [
    t.hashMode,
    Dt(t.signer),
    es(t.nonce, 8),
    es(t.fee, 8)
  ], n = _u(t.fields);
  e.push(Pu(n));
  const r = new Uint8Array(2);
  return Rw(r, t.signaturesRequired, 0), e.push(r), ve(e);
}
function U3(t, e) {
  const n = ft(e.readBytes(20)), r = BigInt(`0x${ft(e.readBytes(8))}`), i = BigInt(`0x${ft(e.readBytes(8))}`), s = e.readUInt8Enum(he, (a) => {
    throw new Ve(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Qt.P2WPKH && s != he.Compressed)
    throw new Ve("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Cl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function H3(t, e) {
  const n = ft(e.readBytes(20)), r = BigInt("0x" + ft(e.readBytes(8))), i = BigInt("0x" + ft(e.readBytes(8))), s = Wp(e, Q.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case Q.PublicKey:
        Pi(u.contents.data) || (o = !0);
        break;
      case Q.MessageSignature:
        if (u.pubKeyEncoding === he.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new gs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Qt.P2WSH || t === Qt.P2WSHNonSequential))
    throw new gs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Nc(t) {
  return co(t) ? _3(t) : P3(t);
}
function _c(t) {
  const e = t.readUInt8Enum(Qt, (n) => {
    throw new Ve(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Qt.P2PKH || e === Qt.P2WPKH ? U3(e, t) : H3(e, t);
}
function rg(t, e, n, r) {
  const s = t + ft(new Uint8Array([e])) + ft(es(n, 8)) + ft(es(r, 8));
  if (Dt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Du(Dt(s));
}
function sg(t, e, n) {
  const r = 33 + nc, i = Pi(e.data) ? he.Compressed : he.Uncompressed, s = t + m3(i.toString(16)) + n, o = Dt(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Du(o);
}
function O3(t, e, n, r, i) {
  const s = rg(t, e, n, r), o = M3(i, s), a = _i(C3(i)), c = sg(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ig(t, e, n, r, i, s) {
  const o = rg(t, e, n, r), a = _i(k3(o, s, i)), c = sg(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function D3() {
  const t = ng(Qt.P2PKH, "", 0, 0);
  return t.signer = PS().hash160, t.keyEncoding = he.Compressed, t.signature = ju(), t;
}
function Pd(t, e, n) {
  return co(t) ? F3(t, e, n) : j3(t, e, n);
}
function F3(t, e, n) {
  const { pubKey: r, nextSigHash: i } = ig(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = Hu(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new gs(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function j3(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Q.PublicKey:
        Pi(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case Q.MessageSignature:
        c.pubKeyEncoding === he.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = ig(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Nd(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new gs("Too many signatures");
        break;
    }
  if (Nd(t.hashMode) && o !== t.signaturesRequired || N3(t.hashMode) && o < t.signaturesRequired)
    throw new gs("Incorrect number of signatures");
  if (s && (t.hashMode === Qt.P2WSH || t.hashMode === Qt.P2WSHNonSequential))
    throw new gs("Uncompressed keys are not allowed in this hash mode");
  const a = Hu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new gs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function og(t) {
  return {
    authType: ye.Standard,
    spendingCondition: t
  };
}
function ag(t, e) {
  return {
    authType: ye.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ng(Qt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Ud(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ye.Standard:
        return og(_d(t.spendingCondition));
      case ye.Sponsored:
        return ag(_d(t.spendingCondition), D3());
      default:
        throw new La("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function z3(t, e) {
  switch (t.authType) {
    case ye.Standard:
      return Pd(t.spendingCondition, e, ye.Standard);
    case ye.Sponsored:
      return Pd(t.spendingCondition, e, ye.Standard);
    default:
      throw new La("Invalid origin auth type");
  }
}
function R3(t, e) {
  switch (t.authType) {
    case ye.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Re(e)
      };
      return { ...t, spendingCondition: n };
    case ye.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Re(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function G3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Re(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function K3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Re(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function V3(t, e) {
  const n = {
    ...e,
    nonce: Re(e.nonce),
    fee: Re(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function X3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ye.Standard:
      e.push(Nc(t.spendingCondition));
      break;
    case ye.Sponsored:
      e.push(Nc(t.spendingCondition)), e.push(Nc(t.sponsorSpendingCondition));
      break;
  }
  return ve(e);
}
function q3(t) {
  const e = t.readUInt8Enum(ye, (r) => {
    throw new Ve(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ye.Standard:
      return n = _c(t), og(n);
    case ye.Sponsored:
      n = _c(t);
      const r = _c(t);
      return ag(n, r);
  }
}
class W3 {
  constructor({ auth: e, payload: n, postConditions: r = _u([]), postConditionMode: i = ka.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = Ex(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Re(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = un.Any;
  }
  signBegin() {
    const e = Ml(this);
    return e.auth = Ud(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ml(this);
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
    return this.signAndAppend(this.auth.spendingCondition, e, ye.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ye.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ye.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : _i(e), r = this.auth.spendingCondition;
    if (r && !co(r)) {
      const i = Pi(n.data);
      r.fields.push(li(i ? he.Compressed : he.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = O3(n, r, e.fee, e.nonce, i);
    if (co(e))
      e.signature = kl(s);
    else {
      const a = eg(i);
      e.fields.push(li(a ? he.Compressed : he.Uncompressed, kl(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Du(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ye.Sponsored)
      throw new La("Cannot sponsor sign a non-sponsored transaction");
    this.auth = V3(this.auth, e);
  }
  setFee(e) {
    this.auth = R3(this.auth, e);
  }
  setNonce(e) {
    this.auth = G3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ye.Sponsored)
      throw new La("Cannot sponsor sign a non-sponsored transaction");
    this.auth = K3(this.auth, e);
  }
  serialize() {
    return ft(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new ci('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new ci('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ci('"auth" is undefined');
    if (this.payload === void 0)
      throw new ci('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return vs(n, this.chainId, 0), e.push(n), e.push(X3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Pu(this.postConditions)), e.push(Zp(this.payload)), ve(e);
  }
}
function Y3(t) {
  const e = on(t, te) ? t : new te(t), n = e.readUInt8Enum(Ns, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = q3(e), s = e.readUInt8Enum(un, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(ka, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Wp(e, Q.PostCondition), c = WS(e), u = new W3({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = s, u;
}
const Hd = BigInt("18446744073709551615");
function Pc(t) {
  const e = Re(t);
  if (e < 0n || e > Hd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Hd} (u64 max), received: ${e}`);
  return e;
}
var Nl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Nl || (Nl = {}));
var _l;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(_l || (_l = {}));
function Z3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: ae.STX,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: qe.Origin } : qi(t.address),
        conditionCode: Xo(t.condition),
        amount: Pc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: ae.Fungible,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: qe.Origin } : qi(t.address),
        conditionCode: Xo(t.condition),
        amount: Pc(t.amount),
        asset: Bd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: ae.NonFungible,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: qe.Origin } : qi(t.address),
        conditionCode: Xo(t.condition),
        asset: Bd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: ae.Staking,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: qe.Origin } : qi(t.address),
        conditionCode: Xo(t.condition),
        amount: Pc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: ae.PoX,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: qe.Origin } : qi(t.address),
        conditionCode: Q3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Xo(t) {
  return Nl[t];
}
function Q3(t) {
  return _l[t];
}
function cg(t) {
  const e = Z3(t);
  return XS(e);
}
function J3(t, e, n) {
  return Ru(lg(t), n);
}
function lg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = lo(r);
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
function zu(t, e = 8) {
  return (typeof t == "bigint" ? t : lg(t)).toString(16).padStart(e * 2, "0");
}
function Ru(t, e = 16) {
  const n = zu(t, e);
  return lo(n);
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
function lo(t) {
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
function Gu(t) {
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
function Ku(...t) {
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
function gr(t) {
  return Ku(...t.map((e) => typeof e == "number" ? Od([e]) : e instanceof Array ? Od(e) : e));
}
function ic(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Pl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pl || (Pl = {}));
Pl.Mainnet;
const iE = 128, oE = 128, ug = 16;
var Ul;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ul || (Ul = {}));
var Dd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Dd || (Dd = {}));
var Fd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Fd || (Fd = {}));
var Mn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Mn || (Mn = {}));
const Uc = ["onChainOnly", "offChainOnly", "any"];
Uc[0] + "", Mn.OnChainOnly, Uc[1] + "", Mn.OffChainOnly, Uc[2] + "", Mn.Any, Mn.OnChainOnly + "", Mn.OnChainOnly, Mn.OffChainOnly + "", Mn.OffChainOnly, Mn.Any + "", Mn.Any;
var Hl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Hl || (Hl = {}));
Hl.Mainnet;
var jd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(jd || (jd = {}));
var fs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(fs || (fs = {}));
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
var Xd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Xd || (Xd = {}));
var Ol;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ol || (Ol = {}));
var qd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qd || (qd = {}));
var Wd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Wd || (Wd = {}));
function Dl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function aE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function fg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function cE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Dl(t.outputLen), Dl(t.blockLen);
}
function lE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function uE(t, e) {
  fg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Hc = {
  number: Dl,
  bool: aE,
  bytes: fg,
  hash: cE,
  exists: lE,
  output: uE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Oc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Rn = (t, e) => t << 32 - e | t >>> e, fE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!fE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function dE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function dg(t) {
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
function Xs(t) {
  const e = (r) => t().update(dg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function pE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Vu = class extends hE {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Oc(this.buffer);
  }
  update(e) {
    Hc.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = dg(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Oc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Hc.exists(this), Hc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    pE(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Oc(e), c = this.outputLen;
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
const gE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), hg = Uint8Array.from({ length: 16 }, (t, e) => e), yE = hg.map((t) => (9 * t + 5) % 16);
let Xu = [hg], qu = [yE];
for (let t = 0; t < 4; t++)
  for (let e of [Xu, qu])
    e.push(e[t].map((n) => gE[n]));
const pg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), wE = Xu.map((t, e) => t.map((n) => pg[e][n])), bE = qu.map((t, e) => t.map((n) => pg[e][n])), mE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), xE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qo = (t, e) => t << e | t >>> 32 - e;
function Yd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Wo = new Uint32Array(16);
let SE = class extends Vu {
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
    for (let h = 0; h < 16; h++, n += 4)
      Wo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const E = 4 - h, m = mE[h], C = xE[h], j = Xu[h], O = qu[h], p = wE[h], k = bE[h];
      for (let I = 0; I < 16; I++) {
        const H = qo(r + Yd(h, s, a, u) + Wo[j[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = qo(a, 10) | 0, a = s, s = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = qo(i + Yd(E, o, c, d) + Wo[O[I]] + C, k[I]) + y | 0;
        i = y, y = d, d = qo(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Wo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Xs(() => new SE());
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
let gg = class extends Vu {
  constructor() {
    super(64, 32, 8, !1), this.A = Or[0] | 0, this.B = Or[1] | 0, this.C = Or[2] | 0, this.D = Or[3] | 0, this.E = Or[4] | 0, this.F = Or[5] | 0, this.G = Or[6] | 0, this.H = Or[7] | 0;
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
      Dr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Dr[l - 15], h = Dr[l - 2], E = Rn(y, 7) ^ Rn(y, 18) ^ y >>> 3, m = Rn(h, 17) ^ Rn(h, 19) ^ h >>> 10;
      Dr[l] = m + Dr[l - 7] + E + Dr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Rn(a, 6) ^ Rn(a, 11) ^ Rn(a, 25), h = d + y + EE(a, c, u) + vE[l] + Dr[l] | 0, m = (Rn(r, 2) ^ Rn(r, 13) ^ Rn(r, 22)) + AE(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + m | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Dr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, $E = class extends gg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Xs(() => new gg());
Xs(() => new $E());
const Yo = BigInt(2 ** 32 - 1), Fl = BigInt(32);
function yg(t, e = !1) {
  return e ? { h: Number(t & Yo), l: Number(t >> Fl & Yo) } : { h: Number(t >> Fl & Yo) | 0, l: Number(t & Yo) | 0 };
}
function IE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = yg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const kE = (t, e) => BigInt(t >>> 0) << Fl | BigInt(e >>> 0), LE = (t, e, n) => t >>> n, CE = (t, e, n) => t << 32 - n | e >>> n, TE = (t, e, n) => t >>> n | e << 32 - n, BE = (t, e, n) => t << 32 - n | e >>> n, ME = (t, e, n) => t << 64 - n | e >>> n - 32, NE = (t, e, n) => t >>> n - 32 | e << 64 - n, _E = (t, e) => e, PE = (t, e) => t, UE = (t, e, n) => t << n | e >>> 32 - n, HE = (t, e, n) => e << n | t >>> 32 - n, OE = (t, e, n) => e << n - 32 | t >>> 64 - n, DE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function FE(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const jE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), zE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, RE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), GE = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, KE = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), VE = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, It = {
  fromBig: yg,
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
}, [XE, qE] = It.split([
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
let oc = class extends Vu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: E, Hh: m, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = E | 0, this.Hh = m | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Fr[p] = e.getUint32(n), jr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = Fr[p - 15] | 0, I = jr[p - 15] | 0, H = It.rotrSH(k, I, 1) ^ It.rotrSH(k, I, 8) ^ It.shrSH(k, I, 7), X = It.rotrSL(k, I, 1) ^ It.rotrSL(k, I, 8) ^ It.shrSL(k, I, 7), K = Fr[p - 2] | 0, W = jr[p - 2] | 0, A = It.rotrSH(K, W, 19) ^ It.rotrBH(K, W, 61) ^ It.shrSH(K, W, 6), B = It.rotrSL(K, W, 19) ^ It.rotrBL(K, W, 61) ^ It.shrSL(K, W, 6), _ = It.add4L(X, B, jr[p - 7], jr[p - 16]), N = It.add4H(_, H, A, Fr[p - 7], Fr[p - 16]);
      Fr[p] = N | 0, jr[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: E, Gh: m, Gl: C, Hh: j, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = It.rotrSH(l, y, 14) ^ It.rotrSH(l, y, 18) ^ It.rotrBH(l, y, 41), I = It.rotrSL(l, y, 14) ^ It.rotrSL(l, y, 18) ^ It.rotrBL(l, y, 41), H = l & h ^ ~l & m, X = y & E ^ ~y & C, K = It.add5L(O, I, X, qE[p], jr[p]), W = It.add5H(K, j, k, H, XE[p], Fr[p]), A = K | 0, B = It.rotrSH(r, i, 28) ^ It.rotrBH(r, i, 34) ^ It.rotrBH(r, i, 39), _ = It.rotrSL(r, i, 28) ^ It.rotrBL(r, i, 34) ^ It.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      j = m | 0, O = C | 0, m = h | 0, C = E | 0, h = l | 0, E = y | 0, { h: l, l: y } = It.add(u | 0, d | 0, W | 0, A | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const z = It.add3L(A, _, nt);
      r = It.add3H(z, W, B, N), i = z | 0;
    }
    ({ h: r, l: i } = It.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = It.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = It.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = It.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = It.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: E } = It.add(this.Fh | 0, this.Fl | 0, h | 0, E | 0), { h: m, l: C } = It.add(this.Gh | 0, this.Gl | 0, m | 0, C | 0), { h: j, l: O } = It.add(this.Hh | 0, this.Hl | 0, j | 0, O | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, E, m, C, j, O);
  }
  roundClean() {
    Fr.fill(0), jr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, WE = class extends oc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, YE = class extends oc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ZE = class extends oc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Xs(() => new oc());
Xs(() => new WE());
Xs(() => new YE());
Xs(() => new ZE());
function QE(t, e, n) {
  const i = iE;
  if (pA(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Ul.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var Be;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Be || (Be = {}));
let JE = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, wg = class extends JE {
  constructor(e) {
    super(e);
  }
};
function ac(t) {
  const e = [];
  return e.push(lo(zu(t.version, 1))), e.push(lo(t.hash160)), gr(e);
}
function tA(t) {
  const e = [];
  return e.push(t.prefix), e.push(ac(t.address)), t.prefix === Ol.Contract && e.push(uo(t.contractName)), gr(e);
}
function uo(t) {
  const e = [], n = Gu(t.content), r = n.byteLength;
  return e.push(lo(zu(r, t.lengthPrefixBytes))), e.push(n), gr(e);
}
function eA(t) {
  const e = [];
  return e.push(ac(t.address)), e.push(uo(t.contractName)), e.push(uo(t.assetName)), gr(e);
}
function bg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(tA(t.principal)), (t.conditionType === fs.Fungible || t.conditionType === fs.NonFungible) && e.push(eA(t.assetInfo)), t.conditionType === fs.NonFungible && e.push(Ps(t.assetName)), e.push(t.conditionCode), t.conditionType === fs.STX || t.conditionType === fs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new wg("The post-condition amount may not be larger than 8 bytes");
    e.push(J3(t.amount, !1, 8));
  }
  return gr(e);
}
function er(t, e) {
  return gr([t, e]);
}
function nA(t) {
  return new Uint8Array([t.type]);
}
function rA(t) {
  return t.type === Be.OptionalNone ? new Uint8Array([t.type]) : er(t.type, Ps(t.value));
}
function sA(t) {
  const e = new Uint8Array(4);
  return ic(e, t.buffer.length, 0), er(t.type, Ku(e, t.buffer));
}
function iA(t) {
  const e = Ru(tE(t.value, BigInt(oE)), ug);
  return er(t.type, e);
}
function oA(t) {
  const e = Ru(t.value, ug);
  return er(t.type, e);
}
function aA(t) {
  return er(t.type, ac(t.address));
}
function cA(t) {
  return er(t.type, Ku(ac(t.address), uo(t.contractName)));
}
function lA(t) {
  return er(t.type, Ps(t.value));
}
function uA(t) {
  const e = [], n = new Uint8Array(4);
  ic(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Ps(r);
    e.push(i);
  }
  return er(t.type, gr(e));
}
function fA(t) {
  const e = [], n = new Uint8Array(4);
  ic(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = QE(i);
    e.push(uo(s));
    const o = Ps(t.data[i]);
    e.push(o);
  }
  return er(t.type, gr(e));
}
function mg(t, e) {
  const n = [], r = e == "ascii" ? rE(t.data) : Gu(t.data), i = new Uint8Array(4);
  return ic(i, r.length, 0), n.push(i), n.push(r), er(t.type, gr(n));
}
function dA(t) {
  return mg(t, "ascii");
}
function hA(t) {
  return mg(t, "utf8");
}
function Ps(t) {
  switch (t.type) {
    case Be.BoolTrue:
    case Be.BoolFalse:
      return nA(t);
    case Be.OptionalNone:
    case Be.OptionalSome:
      return rA(t);
    case Be.Buffer:
      return sA(t);
    case Be.UInt:
      return oA(t);
    case Be.Int:
      return iA(t);
    case Be.PrincipalStandard:
      return aA(t);
    case Be.PrincipalContract:
      return cA(t);
    case Be.ResponseOk:
    case Be.ResponseErr:
      return lA(t);
    case Be.List:
      return uA(t);
    case Be.Tuple:
      return fA(t);
    case Be.StringASCII:
      return dA(t);
    case Be.StringUTF8:
      return hA(t);
    default:
      throw new wg("Unable to serialize. Invalid Clarity Value.");
  }
}
const pA = (t, e) => t ? Gu(t).length > e : !1, gA = "connect-ui";
let ua, xg, fn = !1, jl = !1;
const hr = (t, e = "") => () => {
}, yA = (t, e) => () => {
}, wA = "{visibility:hidden}.hydrated{visibility:inherit}", Zd = {}, bA = "http://www.w3.org/2000/svg", mA = "http://www.w3.org/1999/xhtml", xA = (t) => t != null, Wu = (t) => (t = typeof t, t === "object" || t === "function");
function Sg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Et = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !Wu(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? zl(null, r) : r), s = i);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = zl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, zl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, SA = {}, EA = (t) => t && t.$tag$ === SA, AA = (t, e) => t != null && !Wu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, vA = (t) => Ui(t).$hostElement$, $A = (t, e, n) => {
  const r = je.ce(e, n);
  return t.dispatchEvent(r), r;
}, Qd = /* @__PURE__ */ new WeakMap(), IA = (t, e, n) => {
  let r = Ca.get(t);
  VA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ca.set(t, r);
}, kA = (t, e, n, r) => {
  var i;
  let s = Eg(e);
  const o = Ca.get(s);
  if (t = t.nodeType === 11 ? t : Zn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Qd.get(t), c;
      if (a || Qd.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = Zn.createElement("style"), c.innerHTML = o;
          const u = (i = je.$nonce$) !== null && i !== void 0 ? i : Sg(Zn);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, LA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = hr("attachStyles", e.$tagName$), s = kA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, Eg = (t, e) => "sc-" + t.$tagName$, Jd = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = eh(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = th(n), d = th(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : eh(cc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && je.rel(t, e, n, !1), r && je.ael(t, e, r, !1);
    else {
      const c = Wu(r);
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
}, CA = /\s/, th = (t) => t ? t.split(CA) : [], Ag = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || Zd, o = e.$attrs$ || Zd;
  for (r in s)
    r in o || Jd(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    Jd(i, r, s[r], o[r], n, e.$flags$);
}, Yu = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = Zn.createTextNode(i.$text$);
  else {
    if (fn || (fn = i.$tag$ === "svg"), o = i.$elm$ = Zn.createElementNS(fn ? bA : mA, i.$tag$), fn && i.$tag$ === "foreignObject" && (fn = !1), Ag(null, i, fn), xA(ua) && o["s-si"] !== ua && o.classList.add(o["s-si"] = ua), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = Yu(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? fn = !1 : o.tagName === "foreignObject" && (fn = !0);
  }
  return o;
}, vg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === xg && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = Yu(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, $g = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, TA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; i <= o && s <= u; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : d == null ? d = r[++s] : l == null ? l = r[--u] : Zo(a, d) ? (Zi(a, d), a = e[++i], d = r[++s]) : Zo(c, l) ? (Zi(c, l), c = e[--o], l = r[--u]) : Zo(a, l) ? (Zi(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--u]) : Zo(c, d) ? (Zi(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++s]) : (y = Yu(e && e[s], n, s), d = r[++s], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  i > o ? vg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && $g(e, i, o);
}, Zo = (t, e) => t.$tag$ === e.$tag$, Zi = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (fn = s === "svg" ? !0 : s === "foreignObject" ? !1 : fn, Ag(t, e, fn), r !== null && i !== null ? TA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), vg(n, null, e, i, 0, i.length - 1)) : r !== null && $g(r, 0, r.length - 1), fn && s === "svg" && (fn = !1)) : t.$text$ !== o && (n.data = o);
}, BA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || zl(null, null), i = EA(e) ? e : Et(null, null, e);
  xg = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, ua = n["s-sc"], Zi(r, i);
}, Ig = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Zu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Ig(t, t.$ancestorComponent$), qA(() => MA(t, e));
}, MA = (t, e) => {
  const n = hr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), UA(i, () => NA(t, r, e));
}, NA = async (t, e, n) => {
  const r = t.$hostElement$, i = hr("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && LA(t);
  const o = hr("render", t.$cmpMeta$.$tagName$);
  _A(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => PA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, _A = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, BA(t, e);
  } catch (r) {
    fo(r, t.$hostElement$);
  }
  return null;
}, PA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = hr("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Lg(n), r(), t.$onReadyResolve$(n), i || kg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Ju(() => Zu(t, !1)), t.$flags$ &= -517;
}, kg = (t) => {
  Lg(Zn.documentElement), Ju(() => $A(cc, "appload", { detail: { namespace: gA } }));
}, UA = (t, e) => t && t.then ? t.then(e) : e(), Lg = (t) => t.classList.add("hydrated"), HA = (t, e) => Ui(t).$instanceValues$.get(e), OA = (t, e, n, r) => {
  const i = Ui(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = AA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(o & 8) || s === void 0) && u && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && Zu(i, !1));
}, Cg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return HA(this, s);
        },
        set(a) {
          OA(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        je.jmp(() => {
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
}, DA = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = KA(n), i.then) {
        const c = yA();
        i = await i, c();
      }
      i.isProxied || (Cg(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = hr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        fo(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = Eg(n);
      if (!Ca.has(c)) {
        const u = hr("registerStyles", n.$tagName$);
        IA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => Zu(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, FA = (t) => {
  if (!(je.$flags$ & 1)) {
    const e = Ui(t), n = e.$cmpMeta$, r = hr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            Ig(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), DA(t, e, n);
    }
    r();
  }
}, jA = (t) => {
  je.$flags$ & 1 || Ui(t);
}, zA = (t, e = {}) => {
  var n;
  const r = hr(), i = [], s = e.exclude || [], o = cc.customElements, a = Zn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Zn.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(je, e), je.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Zn.baseURI).href, t.map((h) => {
    h[1].map((E) => {
      const m = {
        $flags$: E[0],
        $tagName$: E[1],
        $members$: E[2],
        $listeners$: E[3]
      };
      m.$members$ = E[2];
      const C = m.$tagName$, j = class extends HTMLElement {
        // StencilLazyHost
        constructor(O) {
          super(O), O = this, GA(O, m), m.$flags$ & 1 && O.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : je.jmp(() => FA(this));
        }
        disconnectedCallback() {
          je.jmp(() => jA(this));
        }
        componentOnReady() {
          return Ui(this).$onReadyPromise$;
        }
      };
      m.$lazyBundleId$ = h[0], !s.includes(C) && !o.get(C) && (i.push(C), o.define(C, Cg(
        j,
        m,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = i + wA, u.setAttribute("data-styles", "");
    const h = (n = je.$nonce$) !== null && n !== void 0 ? n : Sg(Zn);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((h) => h.connectedCallback()) : je.jmp(() => l = setTimeout(kg, 30)), r();
}, Qu = /* @__PURE__ */ new WeakMap(), Ui = (t) => Qu.get(t), RA = (t, e) => Qu.set(e.$lazyInstance$ = t, e), GA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Qu.set(t, n);
}, eh = (t, e) => e in t, fo = (t, e) => (0, console.error)(t, e), Dc = /* @__PURE__ */ new Map(), KA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = Dc.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (Dc.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => h$).then(o, fo);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (Dc.set(i, o), o[r]), fo);
}, Ca = /* @__PURE__ */ new Map(), cc = typeof window < "u" ? window : {}, Zn = cc.document || { head: {} }, je = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Tg = (t) => Promise.resolve(t), VA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), nh = [], Bg = [], XA = (t, e) => (n) => {
  t.push(n), jl || (jl = !0, je.$flags$ & 4 ? Ju(Rl) : je.raf(Rl));
}, rh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      fo(n);
    }
  t.length = 0;
}, Rl = () => {
  rh(nh), rh(Bg), (jl = nh.length > 0) && je.raf(Rl);
}, Ju = (t) => Tg().then(t), qA = /* @__PURE__ */ XA(Bg), WA = () => Tg(), YA = (t, e) => typeof window > "u" ? Promise.resolve() : WA().then(() => zA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var ZA = Object.defineProperty, QA = Object.defineProperties, JA = Object.getOwnPropertyDescriptors, Ta = Object.getOwnPropertySymbols, Mg = Object.prototype.hasOwnProperty, Ng = Object.prototype.propertyIsEnumerable, sh = (t, e, n) => e in t ? ZA(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, yn = (t, e) => {
  for (var n in e || (e = {})) Mg.call(e, n) && sh(t, n, e[n]);
  if (Ta) for (var n of Ta(e)) Ng.call(e, n) && sh(t, n, e[n]);
  return t;
}, Hn = (t, e) => QA(t, JA(e)), _g = (t, e) => {
  var n = {};
  for (var r in t) Mg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ta) for (var r of Ta(t)) e.indexOf(r) < 0 && Ng.call(t, r) && (n[r] = t[r]);
  return n;
};
function Pg() {
  return ec(Cs()) || window.StacksProvider || window.BlockstackProvider;
}
function lc(t) {
  return t ? typeof t == "string" ? Bs.fromName(t) : "version" in t ? t : "url" in t ? new wl({ url: t.url }) : t.transactionVersion === Ns.Mainnet ? new wl({ url: t.client.baseUrl }) : new bl({ url: t.client.baseUrl }) : new bl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var t4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(t4 || {}), e4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(e4 || {}), tf = (t) => {
  let e = t;
  if (!e) {
    let n = new d0(["store_write"], document.location.href);
    e = new yl({ appConfig: n });
  }
  return e;
};
function Ug(t) {
  try {
    return tf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Hg = (t) => {
  let e = tf(t).loadUserData().appPrivateKey, n = He.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function n4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Ms.Mainnet]: "mainnet", [Ms.Testnet]: "testnet" }, a = lc(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function r4(t) {
  let e = lc(t.network), n = tf(t.userSession), r = Hn(yn({}, t), { network: e, userSession: n });
  return yn({ stxAddress: n4(r) }, r);
}
async function s4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(cg) : n = n.map((r) => ft(bg(r)))), new He.TokenSigner("ES256k", e).signAsync(Hn(yn({}, t), { postConditions: n }));
}
function i4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(cg) : e = e.map((n) => ft(bg(n)))), He.createUnsecuredToken(Hn(yn({}, t), { postConditions: e }));
}
var o4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Dt(a.replace(/^0x/, "")), u = Y3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Hn(yn({}, o), { stacksTransaction: u }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, Hn(yn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, a4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = _g(e, ["amount", "appDetails", "userSession"]);
  if (Ug(i)) {
    let { privateKey: a, publicKey: c } = Hg(i), u = Hn(yn({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), s4(u, a);
  }
  let o = Hn(yn({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), i4(o);
};
async function c4(t, e, n) {
  let r = await e(Hn(yn(yn({}, r4(t)), t), { network: lc(t.network) }));
  return o4({ token: r, options: t }, n);
}
function l4(t, e = Pg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return c4(t, a4, e);
}
function Og(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Hn(yn({}, t), { message: Md(e), domain: Md(n) }) : Hn(yn({}, t), { message: ft(Ps(e)), domain: ft(Ps(n)) });
}
async function u4(t, e) {
  return new He.TokenSigner("ES256k", e).signAsync(Og(t));
}
async function f4(t) {
  let e = t, { userSession: n } = e, r = _g(e, ["userSession"]);
  if (Ug(n)) {
    let { privateKey: i, publicKey: s } = Hg(n), o = Hn(yn({}, r), { publicKey: s });
    return u4(o, i);
  }
  return He.createUnsecuredToken(Og(t));
}
var d4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(d4 || {}), Dg = "asigna-stx", ih = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === Dg && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(p4(t, e), "*");
}), h4 = { authenticationRequest: async (t) => ih(t, "authenticationRequest"), transactionRequest: async (t) => ih(t, "transactionRequest") }, p4 = (t, e) => ({ source: Dg, [e]: t }), g4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = h4);
};
g4();
var y4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function w4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = Cs(), o = Pg();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    YA();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : y4, c = cx(a), u = document.createElement("connect-modal");
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
var Qo = w4(l4);
function ns(t, e, n) {
  return ef(Ye(t, e), n);
}
function Ye(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = le(r);
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
      const r = x4(BigInt(`0x${Mt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Mt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function oh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function $o(t, e = 8) {
  return (typeof t == "bigint" ? t : Ye(t, !1)).toString(16).padStart(e * 2, "0");
}
function uc(t) {
  return parseInt(t, 16);
}
function ef(t, e = 16) {
  const n = $o(t, e);
  return le(n);
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
function Mt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += S4[n];
  return e;
}
function le(t) {
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
function Hi(t) {
  return new TextEncoder().encode(t);
}
function nf(t) {
  return new TextDecoder().decode(t);
}
function Fg(t) {
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
function fc(...t) {
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
function $e(t) {
  return fc(...t.map((e) => typeof e == "number" ? ah([e]) : e instanceof Array ? ah(e) : e));
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
const jg = 33, Fc = 32;
function v4(t) {
  if (t.length < Fc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Fc * 2), r = t.slice(2 + Fc * 2);
  return {
    recoveryId: uc(e),
    r: n,
    s: r
  };
}
function $4(t) {
  const e = typeof t == "string" ? le(t) : t;
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
function Us(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Gl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Gl || (Gl = {}));
const B4 = Gl.Mainnet, M4 = 128, N4 = 128, zg = 16, Ss = 32, Kl = 80, dc = 65, _4 = 32, P4 = 64, Ba = 34;
var at;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(at || (at = {}));
var Lt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Lt || (Lt = {}));
var Vl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Vl || (Vl = {}));
var nn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(nn || (nn = {}));
const fa = ["onChainOnly", "offChainOnly", "any"], fh = {
  [fa[0]]: nn.OnChainOnly,
  [fa[1]]: nn.OffChainOnly,
  [fa[2]]: nn.Any,
  [nn.OnChainOnly]: nn.OnChainOnly,
  [nn.OffChainOnly]: nn.OffChainOnly,
  [nn.Any]: nn.Any
};
function U4(t) {
  if (t in fh)
    return fh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${fa.join(", ")}`);
}
var Ma;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ma || (Ma = {}));
Ma.Mainnet;
var ki;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ki || (ki = {}));
var rn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(rn || (rn = {}));
var we;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(we || (we = {}));
var Jt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Jt || (Jt = {}));
var Na;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Na || (Na = {}));
var pe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(pe || (pe = {}));
var ho;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ho || (ho = {}));
var Xl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Xl || (Xl = {}));
var po;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(po || (po = {}));
var dh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(dh || (dh = {}));
var hh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(hh || (hh = {}));
function ql(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function H4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Rg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function O4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ql(t.outputLen), ql(t.blockLen);
}
function D4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function F4(t, e) {
  Rg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ws = {
  number: ql,
  bool: H4,
  bytes: Rg,
  hash: O4,
  exists: D4,
  output: F4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gn = (t, e) => t << 32 - e | t >>> e, j4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!j4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function rf(t) {
  if (typeof t == "string" && (t = z4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Gg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function qs(t) {
  const e = (r) => t().update(rf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function R4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class sf extends Gg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jc(this.buffer);
  }
  update(e) {
    ws.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = rf(e);
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
    ws.exists(this), ws.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    R4(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
}
const G4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Kg = Uint8Array.from({ length: 16 }, (t, e) => e), K4 = Kg.map((t) => (9 * t + 5) % 16);
let of = [Kg], af = [K4];
for (let t = 0; t < 4; t++)
  for (let e of [of, af])
    e.push(e[t].map((n) => G4[n]));
const Vg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), V4 = of.map((t, e) => t.map((n) => Vg[e][n])), X4 = af.map((t, e) => t.map((n) => Vg[e][n])), q4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), W4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Jo = (t, e) => t << e | t >>> 32 - e;
function ph(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ta = new Uint32Array(16);
class Y4 extends sf {
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
    for (let h = 0; h < 16; h++, n += 4)
      ta[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const E = 4 - h, m = q4[h], C = W4[h], j = of[h], O = af[h], p = V4[h], k = X4[h];
      for (let I = 0; I < 16; I++) {
        const H = Jo(r + ph(h, s, a, u) + ta[j[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = Jo(a, 10) | 0, a = s, s = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = Jo(i + ph(E, o, c, d) + ta[O[I]] + C, k[I]) + y | 0;
        i = y, y = d, d = Jo(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ta.fill(0);
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
class Xg extends sf {
  constructor() {
    super(64, 32, 8, !1), this.A = zr[0] | 0, this.B = zr[1] | 0, this.C = zr[2] | 0, this.D = zr[3] | 0, this.E = zr[4] | 0, this.F = zr[5] | 0, this.G = zr[6] | 0, this.H = zr[7] | 0;
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
      const y = Rr[l - 15], h = Rr[l - 2], E = Gn(y, 7) ^ Gn(y, 18) ^ y >>> 3, m = Gn(h, 17) ^ Gn(h, 19) ^ h >>> 10;
      Rr[l] = m + Rr[l - 7] + E + Rr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Gn(a, 6) ^ Gn(a, 11) ^ Gn(a, 25), h = d + y + Q4(a, c, u) + t8[l] + Rr[l] | 0, m = (Gn(r, 2) ^ Gn(r, 13) ^ Gn(r, 22)) + J4(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + m | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Rr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class e8 extends Xg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const cf = qs(() => new Xg());
qs(() => new e8());
const ea = BigInt(2 ** 32 - 1), Wl = BigInt(32);
function qg(t, e = !1) {
  return e ? { h: Number(t & ea), l: Number(t >> Wl & ea) } : { h: Number(t >> Wl & ea) | 0, l: Number(t & ea) | 0 };
}
function n8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = qg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const r8 = (t, e) => BigInt(t >>> 0) << Wl | BigInt(e >>> 0), s8 = (t, e, n) => t >>> n, i8 = (t, e, n) => t << 32 - n | e >>> n, o8 = (t, e, n) => t >>> n | e << 32 - n, a8 = (t, e, n) => t << 32 - n | e >>> n, c8 = (t, e, n) => t << 64 - n | e >>> n - 32, l8 = (t, e, n) => t >>> n - 32 | e << 64 - n, u8 = (t, e) => e, f8 = (t, e) => t, d8 = (t, e, n) => t << n | e >>> 32 - n, h8 = (t, e, n) => e << n | t >>> 32 - n, p8 = (t, e, n) => e << n - 32 | t >>> 64 - n, g8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function y8(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const w8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), b8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, m8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), x8 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, S8 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), E8 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, kt = {
  fromBig: qg,
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
}, [A8, v8] = kt.split([
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
class hc extends sf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: E, Hh: m, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, E, m, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = E | 0, this.Hh = m | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Gr[p] = e.getUint32(n), Kr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = Gr[p - 15] | 0, I = Kr[p - 15] | 0, H = kt.rotrSH(k, I, 1) ^ kt.rotrSH(k, I, 8) ^ kt.shrSH(k, I, 7), X = kt.rotrSL(k, I, 1) ^ kt.rotrSL(k, I, 8) ^ kt.shrSL(k, I, 7), K = Gr[p - 2] | 0, W = Kr[p - 2] | 0, A = kt.rotrSH(K, W, 19) ^ kt.rotrBH(K, W, 61) ^ kt.shrSH(K, W, 6), B = kt.rotrSL(K, W, 19) ^ kt.rotrBL(K, W, 61) ^ kt.shrSL(K, W, 6), _ = kt.add4L(X, B, Kr[p - 7], Kr[p - 16]), N = kt.add4H(_, H, A, Gr[p - 7], Gr[p - 16]);
      Gr[p] = N | 0, Kr[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: E, Gh: m, Gl: C, Hh: j, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = kt.rotrSH(l, y, 14) ^ kt.rotrSH(l, y, 18) ^ kt.rotrBH(l, y, 41), I = kt.rotrSL(l, y, 14) ^ kt.rotrSL(l, y, 18) ^ kt.rotrBL(l, y, 41), H = l & h ^ ~l & m, X = y & E ^ ~y & C, K = kt.add5L(O, I, X, v8[p], Kr[p]), W = kt.add5H(K, j, k, H, A8[p], Gr[p]), A = K | 0, B = kt.rotrSH(r, i, 28) ^ kt.rotrBH(r, i, 34) ^ kt.rotrBH(r, i, 39), _ = kt.rotrSL(r, i, 28) ^ kt.rotrBL(r, i, 34) ^ kt.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      j = m | 0, O = C | 0, m = h | 0, C = E | 0, h = l | 0, E = y | 0, { h: l, l: y } = kt.add(u | 0, d | 0, W | 0, A | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const z = kt.add3L(A, _, nt);
      r = kt.add3H(z, W, B, N), i = z | 0;
    }
    ({ h: r, l: i } = kt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = kt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = kt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = kt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = kt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: E } = kt.add(this.Fh | 0, this.Fl | 0, h | 0, E | 0), { h: m, l: C } = kt.add(this.Gh | 0, this.Gl | 0, m | 0, C | 0), { h: j, l: O } = kt.add(this.Hh | 0, this.Hl | 0, j | 0, O | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, E, m, C, j, O);
  }
  roundClean() {
    Gr.fill(0), Kr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class $8 extends hc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class I8 extends hc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class k8 extends hc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
qs(() => new hc());
qs(() => new $8());
const L8 = qs(() => new I8());
qs(() => new k8());
function Wg(t) {
  if (le(t).byteLength != dc)
    throw Error("Invalid signature");
  return {
    type: at.MessageSignature,
    data: t
  };
}
function Qi(t, e) {
  return { type: at.Address, version: t, hash160: e };
}
function ui(t) {
  return Ks.c32address(t.version, t.hash160);
}
function Hs(t, e, n) {
  const r = e || 1, i = n || M4;
  if (dy(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: at.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function lf(t) {
  const e = Ks.c32addressDecode(t);
  return {
    type: at.Address,
    version: e[0],
    hash160: e[1]
  };
}
var G;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(G || (G = {}));
function C8(t) {
  if (t.type === G.PrincipalStandard)
    return ui(t.address);
  if (t.type === G.PrincipalContract)
    return `${ui(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Yg(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return M8(e, n);
  } else
    return T8(t);
}
function T8(t) {
  const e = lf(t);
  return { type: G.PrincipalStandard, address: e };
}
function B8(t) {
  return { type: G.PrincipalStandard, address: t };
}
function M8(t, e) {
  const n = lf(t), r = Hs(e);
  return Zg(n, r);
}
function Zg(t, e) {
  if (Hi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: G.PrincipalContract, address: t, contractName: e };
}
function zc(t, e = !1) {
  switch (t.type) {
    case G.BoolTrue:
      return !0;
    case G.BoolFalse:
      return !1;
    case G.Int:
    case G.UInt:
      return e ? t.value.toString() : t.value;
    case G.Buffer:
      return `0x${Mt(t.buffer)}`;
    case G.OptionalNone:
      return null;
    case G.OptionalSome:
      return qn(t.value);
    case G.ResponseErr:
      return qn(t.value);
    case G.ResponseOk:
      return qn(t.value);
    case G.PrincipalStandard:
    case G.PrincipalContract:
      return C8(t);
    case G.List:
      return t.list.map((r) => qn(r));
    case G.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = qn(t.data[r]);
      }), n;
    case G.StringASCII:
      return t.data;
    case G.StringUTF8:
      return t.data;
  }
}
function qn(t) {
  switch (t.type) {
    case G.ResponseErr:
      return { type: qr(t), value: zc(t, !0), success: !1 };
    case G.ResponseOk:
      return { type: qr(t), value: zc(t, !0), success: !0 };
    default:
      return { type: qr(t), value: zc(t, !0) };
  }
}
function qr(t) {
  switch (t.type) {
    case G.BoolTrue:
    case G.BoolFalse:
      return "bool";
    case G.Int:
      return "int";
    case G.UInt:
      return "uint";
    case G.Buffer:
      return `(buff ${t.buffer.length})`;
    case G.OptionalNone:
      return "(optional none)";
    case G.OptionalSome:
      return `(optional ${qr(t.value)})`;
    case G.ResponseErr:
      return `(response UnknownType ${qr(t.value)})`;
    case G.ResponseOk:
      return `(response ${qr(t.value)} UnknownType)`;
    case G.PrincipalStandard:
    case G.PrincipalContract:
      return "principal";
    case G.List:
      return `(list ${t.list.length} ${t.list.length ? qr(t.list[0]) : "UnknownType"})`;
    case G.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${qr(t.data[e])})`).join(" ")})`;
    case G.StringASCII:
      return `(string-ascii ${Fg(t.data).length})`;
    case G.StringUTF8:
      return `(string-utf8 ${Hi(t.data).length})`;
  }
}
const Qg = () => ({ type: G.BoolTrue }), Jg = () => ({ type: G.BoolFalse }), N8 = (t) => t ? Qg() : Jg(), gh = BigInt("0xffffffffffffffffffffffffffffffff"), _8 = BigInt(0), yh = BigInt("0x7fffffffffffffffffffffffffffffff"), wh = BigInt("-170141183460469231731687303715884105728"), P8 = (t) => {
  const e = Ye(t, !0);
  if (e > yh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${yh}`);
  if (e < wh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${wh}`);
  return { type: G.Int, value: e };
}, sn = (t) => {
  const e = Ye(t, !1);
  if (e < _8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > gh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${gh}`);
  return { type: G.UInt, value: e };
}, ty = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: G.Buffer, buffer: t };
};
function ey() {
  return { type: G.OptionalNone };
}
function ny(t) {
  return { type: G.OptionalSome, value: t };
}
function U8(t) {
  return { type: G.ResponseErr, value: t };
}
function H8(t) {
  return { type: G.ResponseOk, value: t };
}
function O8(t) {
  return { type: G.List, list: t };
}
function pr(t) {
  for (const e in t)
    if (!kv(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: G.Tuple, data: t };
}
const de = (t) => ({ type: G.StringASCII, data: t }), D8 = (t) => ({ type: G.StringUTF8, data: t });
class ry extends Gg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ws.hash(e);
    const r = rf(n);
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
    return ws.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ws.exists(this), ws.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const sy = (t, e, n) => new ry(t, e).update(n).digest();
sy.create = (t, e) => new ry(t, e);
be.hmacSha256Sync = (t, ...e) => {
  const n = sy.create(cf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Li(t) {
  return {
    type: at.PublicKey,
    data: le(t)
  };
}
function F8(t, e, n = pe.Compressed) {
  const r = v4(e.data), i = new pn(oh(r.r), oh(r.s)), s = Ct.fromSignature(t, i, r.recoveryId), o = n === pe.Compressed;
  return s.toHex(o);
}
function j8(t) {
  return { type: at.PublicKey, data: t };
}
function Oi(t) {
  return !Mt(t.data).startsWith("04");
}
function _a(t) {
  return t.data.slice();
}
function z8(t) {
  const e = K8(t), n = xo(e.data.slice(0, 32), e.compressed);
  return Li(Mt(n));
}
function R8(t) {
  const e = typeof t == "string" ? t : Mt(t), n = Ct.fromHex(e).toHex(!0);
  return Li(n);
}
function G8(t) {
  const e = typeof t == "string" ? t : Mt(t), n = Ct.fromHex(e).toHex(!1);
  return Li(n);
}
function Yl(t) {
  const e = t.readUInt8(), n = e === 4 ? P4 : _4;
  return j8($e([e, t.readBytes(n)]));
}
function K8(t) {
  const e = $4(t), n = e.length == jg;
  return { data: e, compressed: n };
}
function V8(t, e) {
  const [n, r] = Ka(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = $o(r, 1) + pn.fromHex(n).toCompactHex();
  return Wg(s);
}
function X8(t) {
  return z8(t.data);
}
function q8(t, e, n) {
  return typeof t == "string" && (t = Yg(t)), typeof n == "string" && (n = xh(n)), {
    type: at.Payload,
    payloadType: Lt.TokenTransfer,
    recipient: t,
    amount: Ye(e, !1),
    memo: n ?? xh("")
  };
}
function W8(t, e, n, r) {
  return typeof t == "string" && (t = lf(t)), typeof e == "string" && (e = Hs(e)), typeof n == "string" && (n = Hs(n)), {
    type: at.Payload,
    payloadType: Lt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function bh(t, e, n) {
  return typeof t == "string" && (t = Hs(t)), typeof e == "string" && (e = sv(e)), typeof n == "number" ? {
    type: at.Payload,
    payloadType: Lt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: at.Payload,
    payloadType: Lt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Y8() {
  return { type: at.Payload, payloadType: Lt.PoisonMicroblock };
}
function mh(t, e) {
  if (t.byteLength != Ss)
    throw Error(`Coinbase buffer size must be ${Ss} bytes`);
  return e != null ? {
    type: at.Payload,
    payloadType: Lt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: at.Payload,
    payloadType: Lt.Coinbase,
    coinbaseBytes: t
  };
}
function Z8(t, e, n) {
  if (t.byteLength != Ss)
    throw Error(`Coinbase buffer size must be ${Ss} bytes`);
  if (n.byteLength != Kl)
    throw Error(`VRF proof buffer size must be ${Kl} bytes`);
  return {
    type: at.Payload,
    payloadType: Lt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === G.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Zl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Zl || (Zl = {}));
function Q8(t, e, n, r, i, s, o) {
  return {
    type: at.Payload,
    payloadType: Lt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function iy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Lt.TokenTransfer:
      e.push(Ae(t.recipient)), e.push(ns(t.amount, !1, 8)), e.push(cr(t.memo));
      break;
    case Lt.ContractCall:
      e.push(cr(t.contractAddress)), e.push(cr(t.contractName)), e.push(cr(t.functionName));
      const n = new Uint8Array(4);
      Us(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ae(r));
      });
      break;
    case Lt.SmartContract:
      e.push(cr(t.contractName)), e.push(cr(t.codeBody));
      break;
    case Lt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(cr(t.contractName)), e.push(cr(t.codeBody));
      break;
    case Lt.PoisonMicroblock:
      break;
    case Lt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Lt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ae(t.recipient));
      break;
    case Lt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ae(t.recipient ? ny(t.recipient) : ey())), e.push(t.vrfProof);
      break;
    case Lt.TenureChange:
      e.push(le(t.tenureHash)), e.push(le(t.previousTenureHash)), e.push(le(t.burnViewHash)), e.push(le(t.previousTenureEnd)), e.push(Us(new Uint8Array(4), t.previousTenureBlocks)), e.push(C4(new Uint8Array(1), t.cause)), e.push(le(t.publicKeyHash));
      break;
  }
  return $e(e);
}
function J8(t) {
  switch (t.readUInt8Enum(Lt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Lt.TokenTransfer:
      const n = In(t), r = Ye(t.readBytes(8), !1), i = ay(t);
      return q8(n, r, i);
    case Lt.ContractCall:
      const s = Ci(t), o = $n(t), a = $n(t), c = [], u = t.readUInt32BE();
      for (let p = 0; p < u; p++) {
        const k = In(t);
        c.push(k);
      }
      return W8(s, o, a, c);
    case Lt.SmartContract:
      const d = $n(t), l = $n(t, 4, 1e5);
      return bh(d, l);
    case Lt.VersionedSmartContract: {
      const p = t.readUInt8Enum(Vl, (H) => {
        throw new Error(`Cannot recognize ClarityVersion: ${H}`);
      }), k = $n(t), I = $n(t, 4, 1e5);
      return bh(k, I, p);
    }
    case Lt.PoisonMicroblock:
      return Y8();
    case Lt.Coinbase: {
      const p = t.readBytes(Ss);
      return mh(p);
    }
    case Lt.CoinbaseToAltRecipient: {
      const p = t.readBytes(Ss), k = In(t);
      return mh(p, k);
    }
    case Lt.NakamotoCoinbase: {
      const p = t.readBytes(Ss), k = In(t), I = t.readBytes(Kl);
      return Z8(p, k, I);
    }
    case Lt.TenureChange:
      const y = Mt(t.readBytes(20)), h = Mt(t.readBytes(20)), E = Mt(t.readBytes(20)), m = Mt(t.readBytes(32)), C = t.readUInt32BE(), j = t.readUInt8Enum(Zl, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), O = Mt(t.readBytes(20));
      return Q8(y, h, E, m, C, j, O);
  }
}
class pc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ds extends pc {
  constructor(e) {
    super(e);
  }
}
class hn extends pc {
  constructor(e) {
    super(e);
  }
}
class Pa extends pc {
  constructor(e) {
    super(e);
  }
}
class bs extends pc {
  constructor(e) {
    super(e);
  }
}
var _n;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(_n || (_n = {}));
function Ql(t) {
  return Wg(Mt(t.readBytes(dc)));
}
function fi(t, e) {
  return {
    pubKeyEncoding: t,
    type: at.TransactionAuthField,
    contents: e
  };
}
function tv(t) {
  const e = t.readUInt8Enum(_n, (n) => {
    throw new hn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case _n.PublicKeyCompressed:
      return fi(pe.Compressed, Yl(t));
    case _n.PublicKeyUncompressed:
      return fi(pe.Uncompressed, G8(Yl(t).data));
    case _n.SignatureCompressed:
      return fi(pe.Compressed, Ql(t));
    case _n.SignatureUncompressed:
      return fi(pe.Uncompressed, Ql(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function uf(t) {
  return le(t.data);
}
function ev(t) {
  const e = [];
  switch (t.contents.type) {
    case at.PublicKey:
      e.push(t.pubKeyEncoding === pe.Compressed ? _n.PublicKeyCompressed : _n.PublicKeyUncompressed), e.push(_a(R8(t.contents.data)));
      break;
    case at.MessageSignature:
      e.push(t.pubKeyEncoding === pe.Compressed ? _n.SignatureCompressed : _n.SignatureUncompressed), e.push(uf(t.contents));
      break;
  }
  return $e(e);
}
function cr(t) {
  switch (t.type) {
    case at.Address:
      return Io(t);
    case at.Principal:
      return oy(t);
    case at.LengthPrefixedString:
      return Ti(t);
    case at.MemoString:
      return iv(t);
    case at.AssetInfo:
      return cy(t);
    case at.PostCondition:
      return ov(t);
    case at.PublicKey:
      return _a(t);
    case at.LengthPrefixedList:
      return hf(t);
    case at.Payload:
      return iy(t);
    case at.TransactionAuthField:
      return ev(t);
    case at.MessageSignature:
      return uf(t);
  }
}
function nv() {
  return {
    type: at.Address,
    version: Na.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function ff(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Jt.SerializeP2PKH || e === Jt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Jt.SerializeP2WPKH || e === Jt.SerializeP2WSH || e === Jt.SerializeP2WSHNonSequential) && !r.every(Oi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Jt.SerializeP2PKH:
      return Qi(t, Av(r[0].data));
    case Jt.SerializeP2WPKH:
      return Qi(t, vv(r[0].data));
    case Jt.SerializeP2SH:
    case Jt.SerializeP2SHNonSequential:
      return Qi(t, $v(n, r.map(_a)));
    case Jt.SerializeP2WSH:
    case Jt.SerializeP2WSHNonSequential:
      return Qi(t, Iv(n, r.map(_a)));
  }
}
function Io(t) {
  const e = [];
  return e.push(le($o(t.version, 1))), e.push(le(t.hash160)), $e(e);
}
function Ci(t) {
  const e = uc(Mt(t.readBytes(1))), n = Mt(t.readBytes(20));
  return { type: at.Address, version: e, hash160: n };
}
function oy(t) {
  const e = [];
  return e.push(t.prefix), e.push(Io(t.address)), t.prefix === po.Contract && e.push(Ti(t.contractName)), $e(e);
}
function rv(t) {
  const e = t.readUInt8Enum(po, (i) => {
    throw new hn(`Unexpected Principal payload type: ${i}`);
  }), n = Ci(t);
  if (e === po.Standard)
    return { type: at.Principal, prefix: e, address: n };
  const r = $n(t);
  return {
    type: at.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Ti(t) {
  const e = [], n = Hi(t.content), r = n.byteLength;
  return e.push(le($o(r, t.lengthPrefixBytes))), e.push(n), $e(e);
}
function $n(t, e, n) {
  e = e || 1;
  const r = uc(Mt(t.readBytes(e))), i = nf(t.readBytes(r));
  return Hs(i, e, n ?? 128);
}
function sv(t) {
  return Hs(t, 4, 1e5);
}
function xh(t) {
  if (t && dy(t, Ba))
    throw new Error(`Memo exceeds maximum length of ${Ba} bytes`);
  return { type: at.MemoString, content: t };
}
function iv(t) {
  const e = [], n = Hi(t.content), r = Ev(Mt(n), Ba * 2);
  return e.push(le(r)), $e(e);
}
function ay(t) {
  let e = nf(t.readBytes(Ba));
  return e = e.replace(/\u0000*$/, ""), { type: at.MemoString, content: e };
}
function cy(t) {
  const e = [];
  return e.push(Io(t.address)), e.push(Ti(t.contractName)), e.push(Ti(t.assetName)), $e(e);
}
function Jl(t) {
  return {
    type: at.AssetInfo,
    address: Ci(t),
    contractName: $n(t),
    assetName: $n(t)
  };
}
function df(t, e) {
  return {
    type: at.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function hf(t) {
  const e = t.values, n = [];
  n.push(le($o(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(cr(r));
  return $e(n);
}
function ly(t, e, n) {
  const r = uc(Mt(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case at.Address:
        i.push(Ci(t));
        break;
      case at.LengthPrefixedString:
        i.push($n(t));
        break;
      case at.MemoString:
        i.push(ay(t));
        break;
      case at.AssetInfo:
        i.push(Jl(t));
        break;
      case at.PostCondition:
        i.push(av(t));
        break;
      case at.PublicKey:
        i.push(Yl(t));
        break;
      case at.TransactionAuthField:
        i.push(tv(t));
        break;
    }
  return df(i, n);
}
function ov(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(oy(t.principal)), (t.conditionType === rn.Fungible || t.conditionType === rn.NonFungible) && e.push(cy(t.assetInfo)), t.conditionType === rn.NonFungible && e.push(Ae(t.assetName)), e.push(t.conditionCode), t.conditionType === rn.STX || t.conditionType === rn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ds("The post-condition amount may not be larger than 8 bytes");
    e.push(ns(t.amount, !1, 8));
  }
  return $e(e);
}
function av(t) {
  const e = t.readUInt8Enum(rn, (o) => {
    throw new hn(`Could not read ${o} as PostConditionType`);
  }), n = rv(t);
  let r, i, s;
  switch (e) {
    case rn.STX:
      return r = t.readUInt8Enum(ho, (a) => {
        throw new hn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Mt(t.readBytes(8))}`), {
        type: at.PostCondition,
        conditionType: rn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case rn.Fungible:
      return i = Jl(t), r = t.readUInt8Enum(ho, (a) => {
        throw new hn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Mt(t.readBytes(8))}`), {
        type: at.PostCondition,
        conditionType: rn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case rn.NonFungible:
      i = Jl(t);
      const o = In(t);
      return r = t.readUInt8Enum(Xl, (a) => {
        throw new hn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: at.PostCondition,
        conditionType: rn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function nr(t, e) {
  return $e([t, e]);
}
function cv(t) {
  return new Uint8Array([t.type]);
}
function lv(t) {
  return t.type === G.OptionalNone ? new Uint8Array([t.type]) : nr(t.type, Ae(t.value));
}
function uv(t) {
  const e = new Uint8Array(4);
  return Us(e, t.buffer.length, 0), nr(t.type, fc(e, t.buffer));
}
function fv(t) {
  const e = ef(b4(t.value, BigInt(N4)), zg);
  return nr(t.type, e);
}
function dv(t) {
  const e = ef(t.value, zg);
  return nr(t.type, e);
}
function hv(t) {
  return nr(t.type, Io(t.address));
}
function pv(t) {
  return nr(t.type, fc(Io(t.address), Ti(t.contractName)));
}
function gv(t) {
  return nr(t.type, Ae(t.value));
}
function yv(t) {
  const e = [], n = new Uint8Array(4);
  Us(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Ae(r);
    e.push(i);
  }
  return nr(t.type, $e(e));
}
function wv(t) {
  const e = [], n = new Uint8Array(4);
  Us(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Hs(i);
    e.push(Ti(s));
    const o = Ae(t.data[i]);
    e.push(o);
  }
  return nr(t.type, $e(e));
}
function uy(t, e) {
  const n = [], r = e == "ascii" ? Fg(t.data) : Hi(t.data), i = new Uint8Array(4);
  return Us(i, r.length, 0), n.push(i), n.push(r), nr(t.type, $e(n));
}
function bv(t) {
  return uy(t, "ascii");
}
function mv(t) {
  return uy(t, "utf8");
}
function Ae(t) {
  switch (t.type) {
    case G.BoolTrue:
    case G.BoolFalse:
      return cv(t);
    case G.OptionalNone:
    case G.OptionalSome:
      return lv(t);
    case G.Buffer:
      return uv(t);
    case G.UInt:
      return dv(t);
    case G.Int:
      return fv(t);
    case G.PrincipalStandard:
      return hv(t);
    case G.PrincipalContract:
      return pv(t);
    case G.ResponseOk:
    case G.ResponseErr:
      return gv(t);
    case G.List:
      return yv(t);
    case G.Tuple:
      return wv(t);
    case G.StringASCII:
      return bv(t);
    case G.StringUTF8:
      return mv(t);
    default:
      throw new ds("Unable to serialize. Invalid Clarity Value.");
  }
}
function xv(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Sh = /* @__PURE__ */ new Map();
function fy(t, e) {
  const n = Sh.get(t);
  if (n !== void 0)
    return n(e);
  const r = xv(t);
  return Sh.set(t, r), fy(t, e);
}
class ro {
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
    const n = this.readBytes(e).slice().reverse(), r = Mt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Mt(n);
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
    if (fy(e, r))
      return r;
    throw n(r);
  }
}
function In(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ro(le(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ro(t) : e = t;
  switch (e.readUInt8Enum(G, (r) => {
    throw new hn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case G.Int:
      return P8(e.readBytes(16));
    case G.UInt:
      return sn(e.readBytes(16));
    case G.Buffer:
      const r = e.readUInt32BE();
      return ty(e.readBytes(r));
    case G.BoolTrue:
      return Qg();
    case G.BoolFalse:
      return Jg();
    case G.PrincipalStandard:
      const i = Ci(e);
      return B8(i);
    case G.PrincipalContract:
      const s = Ci(e), o = $n(e);
      return Zg(s, o);
    case G.ResponseOk:
      return H8(In(e));
    case G.ResponseErr:
      return U8(In(e));
    case G.OptionalNone:
      return ey();
    case G.OptionalSome:
      return ny(In(e));
    case G.List:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(In(e));
      return O8(c);
    case G.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let m = 0; m < u; m++) {
        const C = $n(e).content;
        if (C === void 0)
          throw new hn('"content" is undefined');
        d[C] = In(e);
      }
      return pr(d);
    case G.StringASCII:
      const l = e.readUInt32BE(), y = E4(e.readBytes(l));
      return de(y);
    case G.StringUTF8:
      const h = e.readUInt32BE(), E = nf(e.readBytes(h));
      return D8(E);
    default:
      throw new hn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Sv = (t) => t.length % 2 == 0 ? t : `0${t}`, Ev = (t, e) => t.padEnd(e, "0"), dy = (t, e) => t ? Hi(t).length > e : !1;
function tu(t) {
  return Bp(t);
}
const go = (t) => Z4(cf(t)), pf = (t) => Mt(L8(t)), Av = (t) => Mt(go(t)), vv = (t) => {
  const e = go(t), n = fc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = go(n);
  return Mt(r);
}, $v = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = $e(n), i = go(r);
  return Mt(i);
}, Iv = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = $e(n), i = cf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = $e(s), a = go(o);
  return Mt(a);
};
function kv(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function hy(t) {
  const e = Ae(t);
  return `0x${Mt(e)}`;
}
function Lv(t) {
  return In(t);
}
const hi = (t) => {
  try {
    return Ks.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function gf() {
  return {
    type: at.MessageSignature,
    data: Mt(new Uint8Array(dc))
  };
}
function py(t, e, n, r) {
  const i = ff(0, t, 1, [Li(e)]).hash160, s = Oi(Li(e)) ? pe.Compressed : pe.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Ye(n, !1),
    fee: Ye(r, !1),
    keyEncoding: s,
    signature: gf()
  };
}
function yo(t) {
  return "signature" in t;
}
function Eh(t) {
  return t === Jt.SerializeP2SH || t === Jt.SerializeP2WSH;
}
function Cv(t) {
  return t === Jt.SerializeP2SHNonSequential || t === Jt.SerializeP2WSHNonSequential;
}
function Ah(t) {
  const e = tu(t);
  return e.nonce = 0, e.fee = 0, yo(e) ? e.signature = gf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Tv(t) {
  const e = [
    t.hashMode,
    le(t.signer),
    ns(t.nonce, !1, 8),
    ns(t.fee, !1, 8),
    t.keyEncoding,
    uf(t.signature)
  ];
  return $e(e);
}
function Bv(t) {
  const e = [
    t.hashMode,
    le(t.signer),
    ns(t.nonce, !1, 8),
    ns(t.fee, !1, 8)
  ], n = df(t.fields);
  e.push(hf(n));
  const r = new Uint8Array(2);
  return k4(r, t.signaturesRequired, 0), e.push(r), $e(e);
}
function Mv(t, e) {
  const n = Mt(e.readBytes(20)), r = BigInt(`0x${Mt(e.readBytes(8))}`), i = BigInt(`0x${Mt(e.readBytes(8))}`), s = e.readUInt8Enum(pe, (a) => {
    throw new hn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Jt.SerializeP2WPKH && s != pe.Compressed)
    throw new hn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ql(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function Nv(t, e) {
  const n = Mt(e.readBytes(20)), r = BigInt("0x" + Mt(e.readBytes(8))), i = BigInt("0x" + Mt(e.readBytes(8))), s = ly(e, at.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case at.PublicKey:
        Oi(u.contents) || (o = !0);
        break;
      case at.MessageSignature:
        if (u.pubKeyEncoding === pe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new bs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Jt.SerializeP2WSH || t === Jt.SerializeP2WSHNonSequential))
    throw new bs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Rc(t) {
  return yo(t) ? Tv(t) : Bv(t);
}
function Gc(t) {
  const e = t.readUInt8Enum(Jt, (n) => {
    throw new hn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Jt.SerializeP2PKH || e === Jt.SerializeP2WPKH ? Mv(e, t) : Nv(e, t);
}
function gy(t, e, n, r) {
  const s = t + Mt(new Uint8Array([e])) + Mt(ns(n, !1, 8)) + Mt(ns(r, !1, 8));
  if (le(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return pf(le(s));
}
function yy(t, e, n) {
  const r = 33 + dc, i = Oi(e) ? pe.Compressed : pe.Uncompressed, s = t + Sv(i.toString(16)) + n.data, o = le(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return pf(o);
}
function _v(t, e, n, r, i) {
  const s = gy(t, e, n, r), o = V8(i, s), a = X8(i), c = yy(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function wy(t, e, n, r, i, s) {
  const o = gy(t, e, n, r), a = Li(F8(o, s, i)), c = yy(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Pv() {
  const t = py(Jt.SerializeP2PKH, "", 0, 0);
  return t.signer = nv().hash160, t.keyEncoding = pe.Compressed, t.signature = gf(), t;
}
function vh(t, e, n) {
  return yo(t) ? Uv(t, e, n) : Hv(t, e, n);
}
function Uv(t, e, n) {
  const { pubKey: r, nextSigHash: i } = wy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = ff(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new bs(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function Hv(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case at.PublicKey:
        Oi(c.contents) || (s = !0), r.push(c.contents);
        break;
      case at.MessageSignature:
        c.pubKeyEncoding === pe.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = wy(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Eh(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new bs("Too many signatures");
        break;
    }
  if (Eh(t.hashMode) && o !== t.signaturesRequired || Cv(t.hashMode) && o < t.signaturesRequired)
    throw new bs("Incorrect number of signatures");
  if (s && (t.hashMode === Jt.SerializeP2WSH || t.hashMode === Jt.SerializeP2WSHNonSequential))
    throw new bs("Uncompressed keys are not allowed in this hash mode");
  const a = ff(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new bs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function by(t) {
  return {
    authType: we.Standard,
    spendingCondition: t
  };
}
function my(t, e) {
  return {
    authType: we.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || py(Jt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function $h(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case we.Standard:
        return by(Ah(t.spendingCondition));
      case we.Sponsored:
        return my(Ah(t.spendingCondition), Pv());
      default:
        throw new Pa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Ov(t, e) {
  switch (t.authType) {
    case we.Standard:
      return vh(t.spendingCondition, e, we.Standard);
    case we.Sponsored:
      return vh(t.spendingCondition, e, we.Standard);
    default:
      throw new Pa("Invalid origin auth type");
  }
}
function Dv(t, e) {
  switch (t.authType) {
    case we.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ye(e, !1)
      };
      return { ...t, spendingCondition: n };
    case we.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ye(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Fv(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ye(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function jv(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ye(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function zv(t, e) {
  const n = {
    ...e,
    nonce: Ye(e.nonce, !1),
    fee: Ye(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Rv(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case we.Standard:
      e.push(Rc(t.spendingCondition));
      break;
    case we.Sponsored:
      e.push(Rc(t.spendingCondition)), e.push(Rc(t.sponsorSpendingCondition));
      break;
  }
  return $e(e);
}
function Gv(t) {
  const e = t.readUInt8Enum(we, (r) => {
    throw new hn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case we.Standard:
      return n = Gc(t), by(n);
    case we.Sponsored:
      n = Gc(t);
      const r = Gc(t);
      return my(n, r);
  }
}
class Kv {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ye(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? B4, this.postConditionMode = s ?? ki.Deny, this.postConditions = i ?? df([]), o)
      this.anchorMode = U4(o);
    else
      switch (r.payloadType) {
        case Lt.Coinbase:
        case Lt.CoinbaseToAltRecipient:
        case Lt.NakamotoCoinbase:
        case Lt.PoisonMicroblock:
        case Lt.TenureChange:
          this.anchorMode = nn.OnChainOnly;
          break;
        case Lt.ContractCall:
        case Lt.SmartContract:
        case Lt.VersionedSmartContract:
        case Lt.TokenTransfer:
          this.anchorMode = nn.Any;
          break;
      }
  }
  signBegin() {
    const e = tu(this);
    return e.auth = $h(e.auth), e.txid();
  }
  verifyBegin() {
    const e = tu(this);
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
    return this.signAndAppend(this.auth.spendingCondition, e, we.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === we.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, we.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !yo(n)) {
      const r = Oi(e);
      n.fields.push(fi(r ? pe.Compressed : pe.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = _v(n, r, e.fee, e.nonce, i);
    return yo(e) ? e.signature = s : e.fields.push(fi(i.data.byteLength === jg ? pe.Compressed : pe.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return pf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != we.Sponsored)
      throw new Pa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = zv(this.auth, e);
  }
  setFee(e) {
    this.auth = Dv(this.auth, e);
  }
  setNonce(e) {
    this.auth = Fv(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != we.Sponsored)
      throw new Pa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = jv(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ds('"version" is undefined');
    if (this.chainId === void 0)
      throw new ds('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ds('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ds('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ds('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Us(n, this.chainId, 0), e.push(n), e.push(Rv(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(hf(this.postConditions)), e.push(iy(this.payload)), $e(e);
  }
}
function Ua(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ro(le(t.slice(2))) : e = new ro(le(t)) : t instanceof Uint8Array ? e = new ro(t) : e = t;
  const n = e.readUInt8Enum(Ma, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = Gv(e), s = e.readUInt8Enum(nn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(ki, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = ly(e, at.PostCondition), c = J8(e);
  return new Kv(n, i, c, a, o, s, r);
}
const Vv = N8, so = sn, Xv = ty;
const qv = /* @__PURE__ */ new Set([4001, -31001]), Wv = [
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
], gc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ws = () => {
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
}, Zv = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), xy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => Zv(s, r)) === i
  );
}, Sy = (t) => t ? xy(Ws()).some(
  (e) => {
    var n;
    return e.id === t && (gc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ey = () => {
  if (typeof window > "u")
    return;
  const t = Ws(), e = xy(t).filter(
    (n) => {
      var r;
      return gc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = fr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Wv) {
    const r = fr(t, n) ?? (t === window ? void 0 : fr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Qv = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ws(), n = fr(e, t) ?? (e === window ? void 0 : fr(window, t)) ?? ec(t);
  if (n)
    return n;
  if (gc(t) || Sy(t))
    return Ey();
}, na = (t, e) => {
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
const Ay = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, dn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, e6 = (t) => {
  const e = dn(t);
  if (!e)
    return null;
  const n = Ay(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, n6 = (t) => {
  const e = dn(t);
  if (!e)
    return null;
  const n = Ay(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, eu = (t, e = "mainnet") => {
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
      return eu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return eu(r, e);
  }
  return e;
}, Es = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, wo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return hi(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = wo(i, e + 1);
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
    const s = wo(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && hi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && hi(n.testnet) ? n.testnet.trim() : null;
}, kh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, vy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && qv.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Os = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = dn(n == null ? void 0 : n.message) ?? dn(e.message) ?? dn(e.error) ?? dn(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, Bi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Os(e);
    if (e.status === "error")
      throw Os(e.result ?? e);
  }
  return t;
}, Lh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Bi(r);
  } catch (r) {
    throw Os(r);
  }
}, $y = () => Ey(), yf = () => {
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
  const t = yf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Ws();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = fr(e, n) ?? (e === window ? void 0 : fr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, da = (t) => {
  var r, i;
  const e = Cs();
  if (gc(e) || Sy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ws() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === $y();
}, Kc = (t) => {
  const e = n6(t);
  if (!e)
    return null;
  try {
    const n = Ua(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ha = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Kc(t), r = e6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? dn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ha(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of Ih)
    if (Kc(i[a])) {
      s = dn(i[a]);
      break;
    }
  const o = dn(i.txId) || dn(i.txid) || dn(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? dn(i.txRaw) ?? void 0
    };
  for (const a of Ih) {
    const c = Kc(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: dn(i[a]) ?? void 0
      };
  }
  for (const a of Yv) {
    const c = i[a], u = Ha(c, e + 1);
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
}, Vc = (t) => {
  const e = Ha(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, r6 = (t) => {
  const e = Ha(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, s6 = (t) => ({
  ...t,
  fee: Es(t.fee),
  nonce: Es(t.nonce),
  sponsored: t.sponsored === !0
}), Th = (t) => ({
  recipient: t.recipient,
  amount: Es(t.amount) ?? "0",
  memo: t.memo,
  network: eu(t.network),
  address: t.stxAddress,
  fee: Es(t.fee),
  nonce: Es(t.nonce),
  sponsored: t.sponsored ?? !1
}), Iy = "WALLET_ADDRESS_MISMATCH", i6 = 45e3;
let io = null;
const nu = (t) => {
  t && (io = { address: t, at: Date.now() });
}, o6 = () => {
  io = null;
}, a6 = () => io && Date.now() - io.at <= i6 ? io.address : null, c6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, l6 = async (t) => {
  o6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Bi(await t.request("wallet_connect")), n = wo(e);
  return nu(n), n;
}, u6 = async (t, e, n, r) => {
  try {
    return Bi(await t.request(e, n));
  } catch (i) {
    const s = Os(i);
    if (!c6(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await l6(t);
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
        { code: o ? Iy : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Bi(await t.request(e, n));
    } catch (a) {
      throw Os(a);
    }
  }
};
let Bh = 3e4;
const f6 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
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
        { code: Iy }
      );
    return c;
  }, i = a6();
  if (i)
    return na(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  na(n, "account-read");
  try {
    const c = Bi(
      await f6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = wo(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (vy(c))
      throw Os(c);
    na(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return nu(s), r(s, "wallet_getAccount");
  let o;
  na(n, "account-reconnect");
  try {
    o = Bi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Os(c);
  }
  const a = wo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return nu(a), r(a, "wallet_connect");
}, h6 = async (t, e) => {
  if (!da(t)) {
    const s = await Lh(
      t,
      "stx_transferStx",
      Th(e)
    );
    return Vc(s);
  }
  const n = yf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Lh(
      n,
      "stx_transferStx",
      Th(e)
    );
    return Vc(s);
  }
  const r = $y();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await d6(r, e.stxAddress);
  const i = await u6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Es(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Es(e.fee) } : {}
    },
    e.stxAddress
  );
  return Vc(i);
}, p6 = () => Cs(), ky = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = Cs(), e = t ? Qv(t) : void 0;
  if (e)
    return e;
  const n = Ws() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Mh = (t, e) => {
  const n = ky(), r = s6({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, r6(i));
    }
  });
  if (!n || typeof n.request != "function")
    return Qo(r, e);
  if (da(n) && !yf()) {
    const i = Ch();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Cs(),
        route: "legacy-transaction-request"
      }), Qo(r, i);
  }
  return void h6(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (kh(i) && da(n)) {
      const a = Ch();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Cs(),
          route: "legacy-transaction-request"
        }), Qo(r, a);
        return;
      }
    }
    if (kh(i) && !da(n)) {
      Qo(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), vy(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Nh = (t) => hy(t).replace(/^0x/, ""), _h = "This wallet cannot sign messages. Try Xverse or Leather.", Ph = (t) => typeof (t == null ? void 0 : t.request) == "function", Uh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", g6 = (t) => {
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
    network: lc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Hh(t) {
  var i, s;
  const e = p6() || "", n = /xverse/i.test(e);
  let r = ky();
  if (n && !Uh(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
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
const Oh = 1000000n, ms = 1000000n, Oa = 50n, ze = 3000n, ss = 300n, Wi = 3000n, m6 = 50000n, Xc = 200n, yc = 15000n, kn = (t) => t + Oa;
function Tn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Oh}.${(n % Oh).toString().padStart(6, "0")}`;
}
function Dh(t, e = ss) {
  return t <= ze ? 0 : Number((t - ze) / kn(e));
}
function qc(t, e = 0n) {
  const n = ms - t - e;
  return n > 0n ? n : 0n;
}
function x6(t, e = ss) {
  return t > ms ? "over" : t < ze + kn(e) ? "empty" : t < m6 ? "low" : "ok";
}
const S6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", E6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", A6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function v6(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || A6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== S6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Ly = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Wc = 3, $6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [ru, Cy] = Ly.split("."), En = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function su(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function I6(t) {
  return En(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ts(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Ty(t, e = []) {
  const n = await ts(`/v2/contracts/call-read/${ru}/${Cy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: ru, arguments: e.map((r) => "0x" + En(Ae(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return qn(In(n.result));
}
async function k6() {
  const t = await ts(`/v2/contracts/source/${ru}/${Cy}?proof=0`);
  if (typeof t.source != "string" || await I6(t.source) !== E6) throw Error("Deployed source does not match the tested helper.");
  if (v6(await Ty("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function By(t) {
  return t.startsWith("SP") && hi(t) && !t.includes(".");
}
async function L6(t) {
  var r;
  if (!By(t)) throw Error("Invalid mainnet wallet address.");
  const e = await ts(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await ts(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function C6(t) {
  const e = await ts(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function T6(t, e) {
  var i, s;
  const n = await Ty("get-owner", [so(t), so(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !By(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function B6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: su(t), signal: AbortSignal.timeout(15e3) });
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
async function M6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function N6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Ua(su(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || ui(Qi(Na.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || ui(r.contractAddress) + "." + r.contractName.content !== Ly || r.functionName.content !== "play" || r.functionArgs.length !== 3 || En(Ae(r.functionArgs[0])) !== En(Ae(so(t.core))) || En(Ae(r.functionArgs[1])) !== En(Ae(so(t.song))) || En(Ae(r.functionArgs[2])) !== En(Ae(Xv(su(t.id)))) || t.amount !== "50" || e.postConditionMode !== ki.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== ho.Equal || s.principal.prefix !== 2 || ui(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ui(r.contractAddress) + "." + r.contractName.content !== $6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || En(Ae(r.functionArgs[0])) !== En(Ae(so(t.song))) || typeof t.liked != "boolean" || En(Ae(r.functionArgs[1])) !== En(Ae(Vv(t.liked))) || t.amount !== "0" || e.postConditionMode !== ki.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || qn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const _6 = "xtrata.xyz/radio/listening-wallet", P6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Ds = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && hi(t), U6 = (t) => ({
  domain: pr({ name: de(_6), version: de("1"), "chain-id": sn(1) }),
  message: pr({
    purpose: de(P6),
    main: de(t.main),
    listening: de(t.listening),
    issued: sn(t.issued)
  })
}), My = 100000n, H6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function O6(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !Ds(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= My).sort(H6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const ra = 50;
function Da(t) {
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
async function D6(t, e, n = 4) {
  if (!Ds(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${ra}&offset=${o}`, i = Da(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - ra);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= ra ? i : Da(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = O6(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - ra);
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
async function z6(t, e, n) {
  if (!Ds(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = Da(await e(`/extended/v1/address/${t}/stx_inbound?limit=${ir}&offset=0`));
    if (!i || i.total > F6 * ir) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = ir; o < i.total; o += ir) {
      const a = Da(await e(`/extended/v1/address/${t}/stx_inbound?limit=${ir}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${ir}&offset=${u}`, a = jh(await e(o(0)), t);
      if (!a || a.total > j6 * ir) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = ir; u < a.total; u += ir) {
        const d = jh(await e(o(u)), t);
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
function R6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Fh).map((l, y) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: y } : Ds(l.sender) && h >= My ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: h, kind: "dust", to: null, at: y };
  }), s = i.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Ds(l.recipient) && l.amount > 0n).sort(Fh), a = o.reduce((l, y) => l + y.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let h = y;
    for (const E of l) {
      if (h <= 0n) break;
      const m = E.left < h ? E.left : h;
      E.left -= m, h -= m;
    }
    return h;
  };
  for (const l of o) {
    const y = u(i.filter((h) => h.to === l.recipient), l.amount);
    y > 0n && u(i, y);
  }
  if (u(i, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (i.reduce((l, y) => l + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of i) {
    if (l.left <= 0n) continue;
    const y = `${l.kind}:${l.to ?? ""}`, h = d.get(y);
    h ? (h.amount += l.left, h.newest = Math.max(h.newest, l.at)) : d.set(y, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, y) => l.newest - y.newest),
    hasTopUp: i.some((l) => l.kind === "deposit")
  };
}
function G6(t, e) {
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
function zh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const iu = [50000n, 100000n, 250000n], Yi = ["prepared", "signed", "unknown", "pending"], K6 = 30 * 6e4, ri = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, V6 = 3e3, Rh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", Yc = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function X6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, y = !1, h = null, E = !1, m = "", C = "", j = 0, O, p = null, k, I = [], H, X = -1 / 0;
  const K = /* @__PURE__ */ new Set();
  let W = null, A = !1, B = 0, _ = null, N = null, nt = !1, z = null, Rt = !1, gt = null, ue = !1, $ = !1, P = !1, yt = !1, Nt = !1, Tt = 0, Bt = null, ee = Promise.resolve();
  const fe = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ss.toString()), Yt = (w) => !!s && !(s.features ?? []).includes(w), me = (w, v) => `xtrata.ppp.v1.${w}:${v}`, xe = (w = s == null ? void 0 : s.address) => {
    if (!w) return [];
    try {
      const v = JSON.parse(t.store.get(me("entries", w)) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, Zt = (w) => {
    const v = [w, ...xe(w.address).filter((D) => !(D.txid === w.txid && D.kind === w.kind))].slice(0, 200);
    t.store.set(me("entries", w.address), JSON.stringify(v));
  }, Ie = (w = s == null ? void 0 : s.address) => !!w && t.store.get(me("on", w)) !== "0", wn = (w) => {
    s != null && s.address && t.store.set(me("on", s.address), w ? "1" : "0");
  }, Oe = () => xe().filter((w) => Yi.includes(w.status)), an = () => ne() ? [...Oe(), ...xe(se()).filter((w) => Yi.includes(w.status))] : Oe(), De = () => ke(s == null ? void 0 : s.address), ke = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(me("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, Se = (w, v = s == null ? void 0 : s.address) => {
    v && t.store.set(me("deposit", v), JSON.stringify(w));
  }, se = () => Yt("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), ne = () => !!(s != null && s.address) && se() !== s.address, Me = () => ne() ? c && c.for === se() ? c.value : void 0 : o, Fe = (w) => w !== void 0 && w < ze + Xc, ie = () => Oe().filter((w) => t.now() - w.created > K6 && K.has(w.txid)), Ge = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Ot = () => Ge() && !(s != null && s.linked), Ee = () => {
    const w = t.main();
    return !Ot() && !!w && !!(s != null && s.linked) && s.linked !== w;
  }, b = (w) => me("return-to", w), S = (w = s == null ? void 0 : s.address) => {
    if (!w) return;
    const v = t.store.get(b(w));
    return v && Ds(v) && v !== w ? v : void 0;
  }, f = (w = s == null ? void 0 : s.address) => W && W.for === w ? W.res : null;
  function V() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const w = S();
    if (w) return { to: w, kind: "chosen" };
    const v = f();
    if (v != null && v.ok && v.funder) return { to: v.funder, kind: "funder" };
  }
  const ct = (w) => me("gift", w);
  function lt() {
    const w = s == null ? void 0 : s.address;
    if (!w) return null;
    if ((z == null ? void 0 : z.for) === w) return z.info;
    try {
      const v = JSON.parse(t.store.get(ct(w)) || "null");
      return v && typeof v.returnTo == "string" && typeof v.treasury == "string" ? v : null;
    } catch {
      return null;
    }
  }
  async function Xt() {
    var et;
    const w = s == null ? void 0 : s.address;
    if (!w || !t.giftInfo || !((et = e == null ? void 0 : e.gifts) != null && et.enabled) || Rt) return;
    const v = (z == null ? void 0 : z.for) === w ? z : null, D = v ? v.ok ? v.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (v && t.now() - v.at < D) return;
    Rt = !0;
    const Z = lt();
    try {
      const q = await t.giftInfo(w);
      z = { for: w, info: q, ok: !0, at: t.now() }, t.store.set(ct(w), JSON.stringify(q));
    } catch {
      z = { for: w, info: Z, ok: !1, at: t.now() };
    } finally {
      Rt = !1;
    }
  }
  const x = () => xe().reduce((w, v) => Yi.includes(v.status) ? w + BigInt(v.amount || "0") + BigInt(v.fee || "0") : w, 0n);
  function M() {
    if (o === void 0) return 0;
    const w = o - x() - BigInt(re.length) * kn(fe());
    return w > 0n ? Dh(w, fe()) : 0;
  }
  const T = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", F = "EMPTY — ADD STX TO PLAY";
  function J() {
    var D;
    const w = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((D = lt()) != null && D.player) && !w) return null;
    const v = (Z, et) => ({ reason: Z, text: et });
    switch (rt()) {
      case "connect":
      case "wrong-wallet":
        return v("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return v("locked", "UNLOCK TO LISTEN");
      case "link":
        return v("link", "FINISH SETUP TO LISTEN");
      case "over":
        return v("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return De() ? v("arriving", "YOUR PLAYS ARE ARRIVING") : v("out", ne() ? T : F);
      case "ready":
        return !Ie() || !(s != null && s.session) || s.session.playsLeft < 1 ? v("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : P ? M() < 1 ? v("out", ne() ? T : F) : null : v("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const wt = () => {
    var w;
    return !!(s != null && s.address) && ne() && !!((w = lt()) != null && w.player);
  };
  function Ft() {
    return wt() ? { locked: !0, known: !0 } : null;
  }
  const pt = 3 * 6e4, qt = () => !!lt() && !!t.history && !(s != null && s.linked);
  async function St() {
    const w = s.address, v = lt(), { balance: D, nonce: Z } = await t.chain.account(w), et = await t.history(w, !0);
    if (!et.ok) return null;
    const q = R6({ self: w, balance: D, inbound: et.inbound, outgoing: et.outgoing, gift: { sender: v.treasury, payer: v.returnTo } });
    if (!q.ok) return null;
    const ut = G6(q.parts, Wi);
    return { balance: D, nonce: Z, parts: q.parts, steps: ut.steps, tooSmall: ut.tooSmall.length };
  }
  const ot = () => ue ? { state: "unavailable" } : !gt || t.now() - gt.at > pt || o !== void 0 && o !== gt.balance ? { state: "none" } : gt.plan;
  function rt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!Ot()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : Ee() ? "wrong-wallet" : s.state === "known" ? "locked" : !Ot() && s.linked !== w ? "link" : o === void 0 ? "loading" : o > ms ? "over" : o < ze + kn(fe()) ? "fund" : "ready" : "loading";
  }
  const dt = () => {
    var w, v, D, Z;
    return {
      step: rt(),
      busy: u,
      message: m,
      error: C,
      notice: xt(),
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : x6(o, fe()),
      playsLeft: o === void 0 ? 0 : Dh(o, fe()),
      allowance: o === void 0 ? ms : qc(o, BigInt(((w = De()) == null ? void 0 : w.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: Ie(),
      entries: xe(),
      depositTxid: ((v = De()) == null ? void 0 : v.txid) ?? O,
      depositPending: !!De(),
      walletOutdated: Yt("like"),
      linkedListening: H && H === t.main() ? I.map((et) => et.listening) : [],
      serverLinked: !!p && k === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: ie().length,
      armed: yt,
      queued: re.length,
      solo: Ot(),
      returnTo: (D = V()) == null ? void 0 : D.to,
      returnToKind: (Z = V()) == null ? void 0 : Z.kind,
      funderState: (() => {
        const et = f();
        return et ? et.ok ? et.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const et = f();
        return !!et && et.ok && et.distinct > 1;
      })(),
      walletCannotSolo: Ot() && Yt("standalone"),
      walletCannotMulti: Yt("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((et) => et !== t.main() && et !== (s == null ? void 0 : s.linked)),
      creditedTo: Ot() && (s != null && s.address) && (_ == null ? void 0 : _.for) === s.address && _.main ? _.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(me("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (N == null ? void 0 : N.for) === s.address && N.unused,
      gift: (() => {
        const et = lt();
        return et ? { player: et.player, from: et.from, source: et.source, amount: et.amount } : null;
      })(),
      giftPlays: lt() ? M() : 0,
      giftStop: J(),
      albumLock: Ft(),
      returnPlan: ot(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Yt("slots"),
      likeFunds: (() => {
        var ut;
        const et = se();
        if (!et || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const q = Me();
        return { address: et, balance: q, low: Fe(q), album: ne(), pending: !!ke(et), txid: (ut = ke(et)) == null ? void 0 : ut.txid, main: t.main() };
      })()
    };
  }, xt = () => j ? j < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", bt = (w, v = "") => {
    m = w, C = v, t.changed();
  };
  async function Vt(w, v) {
    if (!u) {
      u = w, C = "", t.changed();
      try {
        await v();
      } catch (D) {
        const Z = D instanceof Error ? D.message : String(D);
        C = /Cancelled in the listening wallet/.test(Z) ? "" : Z, C || (m = "Not now. Nothing was signed.", Nt = !0);
      } finally {
        u = null, await _e(!0);
      }
    }
  }
  const Ze = () => !!(e != null && e.enabled) && e.here && (Ot() || !!t.main() && e.allowed), Ne = () => Ze() && !Ee(), bn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", _t = () => {
    if (Ee()) throw new Error(bn());
  };
  async function Pt() {
    if (!Ze()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const jt = (w) => {
    const v = t.main();
    return w.request("listening.status", v ? { main: v } : void 0);
  };
  async function Ce(w = !1) {
    s != null && s.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await Te(w)));
  }
  async function Te(w = !1) {
    const v = se();
    if (!(!ne() || !v || (s == null ? void 0 : s.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === v && t.now() - c.at < 3e4))
      try {
        c = { for: v, value: await t.chain.balance(v), at: t.now() };
      } catch {
      }
  }
  async function mn(w) {
    if ((H !== w || t.now() - X >= 6e4) && (I = await t.links(w), H = w, X = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === w) return;
    const v = `${w}:${s.address}`;
    k === v && p || (p = I.find((D) => D.listening === s.address) ?? null, k = v);
  }
  async function yr() {
    const w = s == null ? void 0 : s.address;
    if (!Ot() || !w || s != null && s.linked || !t.funder || A || !o || o <= 0n) return;
    const v = f(w);
    if (v != null && v.ok && v.funder) return;
    const D = v != null && v.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, B - 1), 30 * 6e4);
    if (!(W && W.for === w && t.now() - W.at < D)) {
      A = !0;
      try {
        W = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        W = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        A = !1;
      }
      B = W.res.ok ? 0 : B + 1;
    }
  }
  async function wr() {
    const w = s == null ? void 0 : s.address;
    if (!(!Ot() || !w || s != null && s.linked || !t.mainOf || nt) && !(_ && _.for === w && (_.ok || t.now() - _.at < 6e4))) {
      nt = !0;
      try {
        _ = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        _ = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        nt = !1;
      }
    }
  }
  async function br() {
    const w = s == null ? void 0 : s.address;
    if (!(!w || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (N == null ? void 0 : N.for) === w) && t.store.get(me("created", w)) !== "1")
      try {
        N = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function Ys() {
    var et;
    const w = s == null ? void 0 : s.address;
    if (!w) return !1;
    let v, D = !1;
    const Z = /* @__PURE__ */ new Map();
    for (const q of an())
      try {
        const ut = await t.chain.transaction(q.txid);
        if (!ut) {
          if (K.add(q.txid), t.now() - q.created > 15 * 6e4 && !Z.has(q.address) && Z.set(q.address, await t.chain.confirmedNonce(q.address)), v = Z.get(q.address), v !== void 0 && v > BigInt(q.nonce)) {
            Zt({ ...q, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((q.status === "unknown" || q.status === "signed") && q.raw)
            try {
              await t.chain.broadcast(q.raw, q.txid), Zt({ ...q, status: "pending" });
            } catch (ht) {
              ri(ht) && Zt({ ...q, status: "failed", note: ht.message, raw: void 0 });
            }
          continue;
        }
        K.delete(q.txid);
        const mt = String(ut.tx_status);
        if (mt === "success" && ut.canonical !== !1 && ut.is_unanchored === !1) {
          if (Zt({ ...q, status: "confirmed", confirmedAt: t.now(), actualFee: String(ut.fee_rate ?? q.fee), raw: void 0 }), D = !0, q.kind === "like" && (E = !0, q.status !== "confirmed" && typeof q.liked == "boolean"))
            try {
              (et = t.likeConfirmed) == null || et.call(t, q.song, q.liked);
            } catch {
            }
        } else mt.startsWith("abort_") || mt.startsWith("dropped_") ? Zt({ ...q, status: "failed", note: mt, raw: void 0 }) : q.status !== "pending" && Zt({ ...q, status: "pending" });
      } catch {
      }
    for (const q of ne() ? [w, se()] : [w]) {
      const ut = ke(q);
      if (ut)
        try {
          const mt = await t.chain.transaction(ut.txid), ht = String((mt == null ? void 0 : mt.tx_status) ?? "");
          (ht === "success" && mt.is_unanchored === !1 || ht.startsWith("abort_") || ht.startsWith("dropped_") || !mt && t.now() - ut.at > 2 * 36e5) && (Se(null, q), a = -1 / 0, c = null, /on its way/i.test(m) && (m = ""));
        } catch {
        }
    }
    return D;
  }
  async function _e(w = !1) {
    var v;
    try {
      const D = t.main();
      if ((w || !e || r !== D || t.now() - n > 3e5) && (e = await t.config(D), n = t.now(), r = D), !e.enabled || !e.here || !Ot() && (!D || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), yt && mr(), t.changed();
        return;
      }
      await Pt(), s = await jt(i), Ee() && s.state === "unlocked" && (Js(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await jt(i)), D && e.allowed && await mn(D), await Ce(w), await yr(), await wr(), await br(), await Xt(), await Ys() && await Ce(!0), await Te(), await ge(), j = 0;
    } catch {
      j++;
    }
    if (rt() === "locked" ? Qs() : yt && mr(), E) {
      E = !1;
      try {
        (v = t.likesChanged) == null || v.call(t);
      } catch {
      }
    }
    t.changed(), re.length && !Ln && Ri();
  }
  async function Zs(w) {
    const v = s == null ? void 0 : s.root;
    if (!v || s != null && s.slot || !(s != null && s.address) || Yt("slots")) return;
    const D = Number(t.store.get(me("slot", v)));
    if (!(!Number.isSafeInteger(D) || D < 1))
      try {
        const { balance: Z } = await t.chain.account(s.address);
        if (Z >= ze + kn(fe())) return;
        await w.request("listening.openSlot", { slot: D }), s = await jt(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function is(w, v) {
    var q;
    _t();
    const D = !(s != null && s.address) || Ie(s.address), Z = s != null && s.linked ? (q = t.nameOf) == null ? void 0 : q.call(t, s.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: D ? xr() : void 0, anyPasskey: v, ...t.main() ? { main: t.main() } : {}, ...Z ? { label: Z } : {} }), s = await jt(w), D && (Ie(s.address) ? await cn() : await w.request("listening.stop")), await Zs(w), bt(D ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const et = h;
    h = null, et && t.now() - et.at < 12e4 && setTimeout(() => void _e(!0).then(() => Gi(et)), 0);
  }
  function Qs() {
    yt || u || Nt || Tt >= 3 || !i || !(s != null && s.address) || (yt = !0, ee = (async () => {
      try {
        await is(i, !1), Tt = 0;
      } catch (w) {
        const v = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(v) ? Bt || (Nt = !0, bt("Not now. Nothing was signed.")) : /did not answer/.test(v) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (Tt++, C = v);
      } finally {
        yt = !1;
        const w = Bt;
        Bt = null, w ? await w() : await _e(!0);
      }
    })());
  }
  async function mr(w) {
    yt && (Bt = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await ee), w && await w(), t.changed();
  }
  const xr = () => ({
    fee: fe().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: ms.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function cn() {
    if (!(s != null && s.address)) return !1;
    if (P || (P = await t.tabLock(s.address)), !P)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Sr(w, v) {
    const D = s.address, { balance: Z, nonce: et } = v ?? await t.chain.account(D);
    o = Z;
    const q = await i.request("listening.prepareReturn", {
      mode: w.mode,
      balance: Z.toString(),
      nonce: et.toString(),
      fee: Wi.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (q.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ut = w.mode === "amount" ? w.amount : w.mode === "all" ? Z - Wi : Z - ms - Wi, mt = Ua(q.raw);
    if (qn(mt.payload.recipient).value !== w.to || String(mt.payload.amount) !== q.amount || ut !== void 0 && q.amount !== ut.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const ht = {
      id: Yc(),
      address: D,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: q.recipient,
      amount: q.amount,
      fee: q.fee,
      nonce: et.toString(),
      created: t.now(),
      status: "signed",
      raw: q.raw,
      txid: q.txid
    };
    t.validate(ht), Zt(ht);
    try {
      await t.chain.broadcast(q.raw, q.txid), Zt({ ...ht, status: "pending" });
    } catch (Gt) {
      throw Zt({ ...ht, status: "unknown", note: Gt.message }), Gt;
    }
    return q;
  }
  const os = yc, Er = Wi;
  async function as(w, v, D) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Yt("slots") || Yt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Z = s.slot ?? 0;
    if (w === v || ![w, v].includes(Z) || ![w, v].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const et = s.root ?? s.address, q = w === 0 ? et : s.address, ut = v === 0 ? et : s.address, { balance: mt, nonce: ht } = await t.chain.account(q);
    if (mt < D + Er + ze) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Gt = await i.request("listening.signMove", { from: w, to: v, amount: D.toString(), fee: Er.toString(), nonce: ht.toString(), balance: mt.toString() }), Pe = Ua(Gt.raw);
    if (Gt.from !== q || Gt.to !== ut || Gt.amount !== D.toString() || qn(Pe.payload.recipient).value !== ut || String(Pe.payload.amount) !== D.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const xn = {
      id: Yc(),
      address: q,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ut,
      amount: Gt.amount,
      fee: Gt.fee,
      nonce: ht.toString(),
      created: t.now(),
      status: "signed",
      raw: Gt.raw,
      txid: Gt.txid
    };
    t.validate(xn), Zt(xn);
    try {
      await t.chain.broadcast(Gt.raw, Gt.txid), Zt({ ...xn, status: "pending" });
    } catch (Ke) {
      throw Zt({ ...xn, status: "unknown", note: Ke.message }), Ke;
    }
    return Se({ txid: Gt.txid, amount: Gt.amount, at: t.now() }, ut), ut === et && et !== s.address ? c = null : a = -1 / 0, Gt;
  }
  let R = !1;
  const tt = /* @__PURE__ */ new Map(), oe = (w) => me("float", w);
  async function ge() {
    if (R || (s == null ? void 0 : s.state) !== "unlocked" || !ne() || Yt("move") || Yt("rootLike") || !s.address) return;
    const w = s.address;
    if (t.store.get(oe(w)) === "1") return;
    const v = lt();
    if (!(v != null && v.player) || v.state !== "arrived") return;
    const D = Me();
    if (D === void 0 || o === void 0) return;
    if (!Fe(D)) {
      t.store.set(oe(w), "1");
      return;
    }
    if (ke(se()) || ji() || an().length || o < os * 4n + ze + Er) return;
    const Z = tt.get(w);
    if (!(Z && (Z.n >= 3 || t.now() - Z.at < 5 * 6e4))) {
      R = !0, tt.set(w, { n: ((Z == null ? void 0 : Z.n) ?? 0) + 1, at: t.now() });
      try {
        await as(s.slot ?? 0, 0, os), t.store.set(oe(w), "1");
      } catch (et) {
        console.warn("[radio] likes float not sent yet", et);
      } finally {
        R = !1;
      }
    }
  }
  async function cs(w) {
    if (Oe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Yt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const v = await St().catch(() => null);
    if (!v)
      throw gt = null, ue = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    ue = !1, o = v.balance;
    const D = { balance: v.balance, nonce: v.nonce };
    if (w === "excess") {
      const mt = zh(v.parts) ?? S();
      if (!mt) throw new Error("Choose where to send the excess first.");
      await Sr({ mode: "excess", to: mt, linked: !1 }, D), gt = null, bt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Z = v.steps;
    if (!Z.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!gt && gt.balance === v.balance && t.now() - gt.at <= pt && gt.steps.length === Z.length && gt.steps.every((mt, ht) => mt.to === Z[ht].to && mt.mode === Z[ht].mode && mt.send === Z[ht].send))) {
      gt = {
        at: t.now(),
        balance: v.balance,
        steps: Z,
        parts: v.parts,
        plan: { state: "ready", steps: Z.map((mt) => ({ to: mt.to, kind: mt.kind, send: mt.send.toString() })), kept: v.tooSmall, excess: zh(v.parts) }
      }, bt(Z.length > 1 ? `This goes back in ${Z.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const q = Z[0], ut = q.to ?? S();
    if (!ut) throw new Error("Choose where to send the rest first.");
    if (q.mode === "amount" && Yt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Sr({ mode: q.mode, to: ut, linked: !1, ...q.mode === "amount" ? { amount: q.send } : {} }, D), gt = null, Z.length === 1 ? (wn(!1), bt("Returned ✓ Paying is off.")) : bt(`Returned ✓ ${Z.length - 1} more ${Z.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const On = {
    forceRefresh: () => _e(!0),
    create: () => Vt("Waiting for your passkey…", async () => {
      const w = await Pt();
      await w.request("listening.unlock", { mode: "create", terms: xr(), ...t.main() ? { main: t.main() } : {} }), s = await jt(w), s.address && t.store.set(me("created", s.address), "1"), wn(!0), bt(Ot() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await cn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (w, v) => {
      !(s != null && s.address) || De() || (Se({ txid: w, amount: v.toString(), at: t.now() }), a = -1 / 0, z = null, bt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (_t(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Yt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Pt()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, v, D, Z) => {
      Se({ txid: D, amount: Z.toString(), at: t.now() }, v), z = null, await On.openAlbum(w), bt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => Vt("Opening…", async () => {
      if (_t(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Yt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === w) return;
      Js(), await i.request("listening.openSlot", { slot: w }), s = await jt(i), o = void 0, a = -1 / 0, gt = null, ue = !1;
      const v = s.root;
      v && w > 0 && t.store.set(me("slot", v), String(w)), bt(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const v = () => Vt("Waiting for your passkey…", async () => is(await Pt(), w));
      return yt ? w ? Yt("cancel") ? (bt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : mr(async () => {
        (rt() === "locked" || rt() === "intro") && await v();
      }) : ee : v();
    },
    link: () => Vt("Sign in your wallet…", async () => {
      _t();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const v = (await t.links(w)).find((D) => D.listening === s.address);
      if (v)
        await i.request("listening.link", { main: w, issued: v.issued, mainSignature: v.mainSignature });
      else {
        const D = { main: w, listening: s.address, issued: t.now() }, Z = await t.signWithMain(w, U6(D)), et = await i.request("listening.link", { main: w, issued: D.issued, mainSignature: Z });
        await t.saveLink({ ...D, mainSignature: Z, listeningSignature: et.listeningSignature }), X = -1 / 0;
      }
      bt("Linked ✓");
    }),
    deposit: () => Vt("Approve the deposit in your wallet…", async () => {
      _t();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (De()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Ce(!0);
      const v = qc(o ?? 0n);
      if (v <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      O = await t.deposit(w, s.address, v), O && Se({ txid: O, amount: v.toString(), at: t.now() }), bt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Vt("Approve the top-up in your wallet…", async () => {
      _t();
      const w = t.main(), v = se();
      if (!w || !v) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (ke(v)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const D = await t.chain.balance(v);
      ne() ? c = { for: v, value: D, at: t.now() } : (o = D, a = t.now());
      const Z = qc(D);
      if (Z <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const et = await t.deposit(w, v, Z);
      et && Se({ txid: et, amount: Z.toString(), at: t.now() }, v), bt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_CHOICES`. */
    topUpAlbum: (w) => Vt("Adding plays…", async () => {
      if (_t(), !ne()) throw new Error("Open the album you want to add plays to first.");
      if (!iu.includes(w)) throw new Error("Choose one of the amounts offered.");
      if (d || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (an().length || De()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await as(0, s.slot ?? 0, w), bt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Vt("Confirm in the listening wallet…", async () => {
      if (!Ne()) throw new Error("Connect your wallet first.");
      await cn(), await i.request("listening.approveSession", xr()), wn(!0), bt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Vt("Clearing…", async () => {
      for (const w of ie())
        await t.chain.transaction(w.txid) || Zt({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      bt("Cleared ✓");
    }),
    switchOff: () => Vt("Switching off…", async () => {
      Js(), await (i == null ? void 0 : i.request("listening.stop")), wn(!1), bt("Paying is off. Music stays free.");
    }),
    lock: () => Vt("Locking…", async () => {
      Js(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, bt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const v = String(w ?? "").trim();
      if (!(s != null && s.address)) return bt("", "Unlock the listening wallet first.");
      if (!Ds(v)) return bt("", "Enter a standard mainnet address (it starts with SP).");
      if (v === s.address) return bt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(b(s.address), v), bt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(b(s.address), ""), t.changed();
    },
    returnFunds: (w) => Vt("Check the return in the listening wallet…", async () => {
      if (!Ne()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (qt()) return cs(w);
      const v = V();
      if (!v) throw new Error(Ot() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (v.kind !== "linked" && Yt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Oe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Sr({ mode: w, to: v.to, linked: v.kind === "linked" }), w === "all" && wn(!1), bt(w === "all" ? v.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, re = [], Di = 10, Fi = 30 * 6e4;
  let Ln = !1;
  const ji = () => d || !!u || l || y, Js = () => {
    re.length && (re.length = 0, t.changed());
  };
  async function zi(w) {
    if (!re.some((v) => v.id === w.id) && !xe().some((v) => v.id === w.id) && (re.push({ ...w, at: t.now() }), re.length > Di && re.shift()), ji() || Oe().length) {
      const v = re.length;
      m = `Queued ${v === 1 ? "this song" : v + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Ri();
  }
  async function Ri() {
    if (!Ln) {
      Ln = !0;
      try {
        for (; re.length; ) {
          for (; re.length && t.now() - re[0].at > Fi; ) re.shift();
          if (!re.length || ji() || await wc(re[0]) === "wait") return;
          re.shift();
        }
      } finally {
        Ln = !1, t.changed();
      }
    }
  }
  async function wc(w) {
    var v;
    d = !0;
    try {
      await _e();
      const D = rt();
      if (D === "loading") return "wait";
      if (D !== "ready" || !Ie() || !(s != null && s.session) || s.session.playsLeft < 1 || !P) return "done";
      if (Oe().length) return "wait";
      $ || (await t.chain.verify(), $ = !0);
      const Z = s.address, { balance: et, nonce: q } = await t.chain.account(Z);
      o = et, a = t.now();
      const ut = await t.chain.owner(Wc, w.song);
      if (ut === Z || ut === t.main()) return "done";
      const mt = await i.request("listening.signPlay", {
        core: Wc,
        song: w.song,
        receipt: w.id,
        fee: fe().toString(),
        nonce: q.toString(),
        balance: et.toString()
      }), ht = {
        id: w.id,
        address: Z,
        kind: "play",
        core: Wc,
        song: w.song,
        recipient: ut,
        amount: "50",
        fee: fe().toString(),
        nonce: q.toString(),
        created: t.now(),
        status: "signed",
        raw: mt.raw,
        txid: mt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(ht), Zt(ht);
      const Gt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(mt.raw, mt.txid), Zt({ ...ht, status: "pending" }), m = `♪ Paid ${Gt}`, C = "";
      } catch (Pe) {
        Zt({ ...ht, status: ri(Pe) ? "failed" : "unknown", note: Pe.message, ...ri(Pe) ? { raw: void 0 } : {} }), C = Pe.message;
      }
      return s = await jt(i), "done";
    } catch (D) {
      const Z = D instanceof Error ? D.message : "payment unavailable";
      return (v = lt()) != null && v.player ? (m = "Payment is taking a moment: " + Z, "wait") : (m = "This song played free: " + Z, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function bc(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(rt()) || Yt("like") ? !1 : (Gi(w), !0);
  }
  async function Gi(w) {
    const v = w.title ? `“${w.title}”` : `song #${w.song}`, D = (Dn) => {
      var ko;
      C = Dn, m = "";
      try {
        (ko = t.likeFailed) == null || ko.call(t, w.song);
      } catch {
      }
      t.changed();
    }, Z = ne(), et = rt(), q = t.main(), ut = Z && (et === "fund" || et === "over") ? "ready" : et, mt = Ot() ? se() : q;
    if (ut === "locked") {
      h = { ...w, at: t.now() }, bt(`Unlock to like ${v}. It sends straight after.`);
      return;
    }
    if (ut === "wrong-wallet") return D(bn());
    if (ut === "link") return D("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Ot() && Yt("standalone")) return D("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ut === "fund") return D("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (ut === "over") return D("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Z) {
      await Te(!0);
      const Dn = Me();
      if (Fe(Dn))
        return t.changed(), D(Rh);
    }
    if (ut !== "ready" || !mt) return D("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return D("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!P) return D("Pay-per-play is running in another tab. Like from that tab.");
    const ht = xe(se()).find((Dn) => Dn.kind === "like" && Dn.song === w.song);
    if (ht && Yi.includes(ht.status))
      return D(`Your last like for ${v} is still on its way. It can change again once it confirms.`);
    if (l) return D("One like at a time: your last one is still being sent.");
    if ((ht == null ? void 0 : ht.status) === "confirmed" && t.now() - (ht.confirmedAt ?? 0) < V6)
      return D(`Your like for ${v} has only just confirmed. Try again in a moment.`);
    let Gt;
    y = !0;
    try {
      Gt = t.likeState ? (await t.likeState(mt, w.song)).by : w.likedBy ?? [];
    } catch {
      Gt = w.likedBy;
    } finally {
      y = !1;
    }
    if (!Gt) return D(`Could not check ${v} right now. Try the heart again.`);
    const Pe = se(), Ke = ((ht == null ? void 0 : ht.status) === "confirmed" && typeof ht.liked == "boolean" && t.now() - (ht.confirmedAt ?? ht.created) < 5 * 6e4 ? ht.liked : void 0) ?? Gt.includes(Pe);
    if (!Ke && Gt.some((Dn) => Dn !== Pe)) return D(Ot() ? `${v} was liked from another wallet of yours. Unlike it there.` : `${v} was liked from your main wallet${Gt.includes(q) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await mc({ song: w.song, liked: !Ke, title: w.title, artist: w.artist });
  }
  async function mc(w) {
    var Z, et, q;
    if (l) {
      bt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const v = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, D = t.wait ?? ((ut) => new Promise((mt) => setTimeout(mt, ut)));
    try {
      bt(`${w.liked ? "Liking" : "Unliking"} ${v}…`);
      const ut = t.now() + 12e4;
      for (; d || (ne() ? xe(se()).some((Ke) => Yi.includes(Ke.status)) : Oe().length); ) {
        if (t.now() > ut) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await D(5e3), await _e(!0);
      }
      if (!ne() && rt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const mt = se(), { balance: ht, nonce: Gt } = await t.chain.account(mt);
      if (ne() ? c = { for: mt, value: ht, at: t.now() } : (o = ht, a = t.now()), Fe(ht)) throw new Error(Rh);
      const Pe = await i.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: Xc.toString(),
        nonce: Gt.toString(),
        balance: ht.toString()
      }), xn = {
        id: Yc(),
        address: mt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: Xc.toString(),
        nonce: Gt.toString(),
        created: t.now(),
        status: "signed",
        raw: Pe.raw,
        txid: Pe.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(xn), Zt(xn);
      try {
        await t.chain.broadcast(Pe.raw, Pe.txid), Zt({ ...xn, status: "pending" }), m = `${w.liked ? "♥ Liked" : "Unliked"} ${v}`, C = "";
        try {
          (Z = t.likeSent) == null || Z.call(t, w.song, w.liked);
        } catch {
        }
      } catch (Ke) {
        if (Zt({ ...xn, status: ri(Ke) ? "failed" : "unknown", note: Ke.message, ...ri(Ke) ? { raw: void 0 } : {} }), C = Ke.message, ri(Ke)) try {
          (et = t.likeFailed) == null || et.call(t, w.song);
        } catch {
        }
      }
      s = await jt(i);
    } catch (ut) {
      C = "Like not sent: " + (ut instanceof Error ? ut.message : "the listening wallet is unavailable");
      try {
        (q = t.likeFailed) == null || q.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Ri();
    }
  }
  return { snapshot: dt, refresh: _e, onListened: zi, heart: bc, toggleLike: Gi, ...On };
}
const Ny = ["Connect", "Passkey", "Link & fund", "Listen"], _y = ["Passkey", "Add 1 STX", "Listen"], ou = (t) => t ? _y : Ny;
function q6(t) {
  if (t.solo) return W6(t);
  const e = Ny.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function W6(t) {
  const e = _y.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function Y6(t, e) {
  return !e || e.at >= ou(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
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
  return typeof window < "u" ? [`${window.location.origin}${n5(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, i5 = {}, Gh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, o5 = "xtrata.log.enabled", a5 = "xtrata.log.level", c5 = "xtrata.log.tags", l5 = "xtrata.log.dedupe", sa = (t) => {
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
  const t = i5 ?? {}, e = sa(o5) ?? t.VITE_LOG_ENABLED, n = sa(a5) ?? t.VITE_LOG_LEVEL, r = sa(c5) ?? t.VITE_LOG_TAGS, i = sa(l5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: u5(e),
    level: f5(n) ?? "warn",
    tags: h5(r),
    dedupe: d5(i)
  };
}, g5 = (t, e, n) => !t.enabled || Gh[n] < Gh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), y5 = (t, e, n, r) => {
  const i = p5();
  if (!g5(i, e, t) || b5(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, w5 = /* @__PURE__ */ new Set();
let Kh = null;
const b5 = (t, e, n, r, i) => (Kh !== t && (w5.clear(), Kh = t), !1), m5 = (t, e, n) => y5("debug", t, e, n), x5 = {}, S5 = {
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
}, $5 = (t) => t.replace(/\/+$/, ""), I5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Vh = (t) => {
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
}, si = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, k5 = (t) => {
  var c, u;
  let e;
  try {
    e = qn(Lv(t));
  } catch {
    return null;
  }
  const n = si(e);
  if (!n || n.success === !1)
    return null;
  const r = si(n.value), i = si(r == null ? void 0 : r.value), s = si(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = Vh((c = si(s.name)) == null ? void 0 : c.value), a = Vh((u = si(s.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : v5(`${o}.${a}`);
}, L5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${$5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [hy(Yg(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : k5(s.result);
}, C5 = async (t) => {
  const e = t.address.trim();
  if (!hi(e))
    return null;
  const n = E5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of s5(t.network))
    try {
      return await L5({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return m5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: I5(r)
  }), null;
};
function T5(t, e, n = {}) {
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
const Xh = Object.freeze({
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
function B5(t, e = "") {
  return Object.hasOwn(Xh, String(t)) ? Xh[String(t)] : e;
}
const qh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function M5(t, e = "") {
  return Object.hasOwn(qh, String(t)) ? qh[String(t)] : e;
}
const Py = 100000n, Fa = 1000000n, ja = 3000n, N5 = (t, e) => `${t}#gift=${e}`, Uy = 100, Zc = (t, e = ss) => t <= ze ? 0 : Number((t - ze) / kn(e)), Wh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), wf = "xtrata.xyz/radio/gifts", _5 = "Create Xtrata radio gift links paid from the gift treasury", P5 = (t) => ({
  domain: pr({ name: de(wf), version: de("1"), "chain-id": sn(1) }),
  message: pr({
    purpose: de(_5),
    admin: de(t.admin),
    count: sn(t.count),
    amount: sn(BigInt(t.amount)),
    label: de(t.label),
    issued: sn(t.issued),
    ...t.player ? { player: de(t.player) } : {}
  })
}), Qc = Uy, U5 = "Create a prefunded Xtrata radio gift batch", H5 = (t) => ({
  domain: pr({ name: de(wf), version: de("1"), "chain-id": sn(1) }),
  message: pr({
    purpose: de(U5),
    creator: de(t.creator),
    count: sn(t.count),
    amount: sn(BigInt(t.amount)),
    label: de(t.label),
    issued: sn(t.issued),
    ...t.player ? { player: de(t.player) } : {}
  })
}), O5 = (t, e, n = ss) => ze + BigInt(t) * kn(n) + (e ? yc : 0n), D5 = (t, e = ss) => Number((Fa - ze - (t ? yc : 0n)) / kn(e)), F5 = (t, e) => BigInt(t) * (e + ja);
function j5(t, e, n, r = ss) {
  const i = n ? yc : 0n, s = e > ze + i ? e - ze - i : 0n, o = Number(s / kn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Oa,
    fees: BigInt(o) * r,
    reserve: ze,
    float: i,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: ja,
    perCopy: e + ja,
    total: F5(t, e)
  };
}
const z5 = (t) => t >= Py && t <= Fa, Yh = 40, R5 = "Create an Xtrata radio gift player", G5 = /^[^\u0000-\u001f\u007f<>]+$/u;
function Zh(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && G5.test(t) : !n;
}
function K5(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Zh(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Zh(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > Yh) throw new Error(`A player holds 1 to ${Yh} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const V5 = (t) => J0(ip(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), X5 = (t) => ({
  domain: pr({ name: de(wf), version: de("1"), "chain-id": sn(1) }),
  message: pr({
    purpose: de(R5),
    admin: de(t.admin),
    player: de(t.hash),
    issued: sn(t.issued)
  })
}), Qh = (t, e = ss) => ze + BigInt(t) * kn(e), Jc = [300, 500, 1e3], Jh = 1800, tl = /* @__PURE__ */ new Map();
async function Hy(t) {
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
async function q5(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await Hy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Oy(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = tl.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      tl.set(t, { ...a, until: Date.now() + Jh });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        tl.delete(t), i();
      }, Jh + 50);
    }
  }, s;
}
const Yr = (t, e, n, r, i) => Oy(t, e, async () => await Hy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), us = "xtrata.radio.gift.incoming.v1", t0 = (t) => "xtrata.radio.gift.mine.v1:" + t, e0 = (t) => "xtrata.radio.gift.batches.v1:" + t, it = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Kn = (t, e, n = "") => {
  const r = it("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, or = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, tn = (t) => Tn(t).replace(/\.?0+$/, "");
function W5(t) {
  let e = null;
  const n = (x) => [5e3, 1e4, 2e4, 3e4][x] ?? 6e4, r = (() => {
    try {
      const x = new URL(location.href), M = new URLSearchParams(x.hash.slice(1)).get("gift") ?? x.searchParams.get("gift");
      return M !== null && (x.searchParams.delete("gift"), history.replaceState(null, "", x.pathname + (x.search || ""))), Wh(M) ? M : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const x = JSON.parse(t.store.get(us) || "null");
      return Wh(x == null ? void 0 : x.code) ? x.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(us, JSON.stringify({ code: s, at: t.now() }));
    let x = 0;
    const M = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (T) => {
      const F = await T.json().catch(() => ({}));
      if (T.status === 404) {
        t.store.set(us, null), e = { ...e, error: (F == null ? void 0 : F.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!T.ok) throw new Error("busy");
      const J = F;
      e = { ...e, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && t.store.set(us, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void M(), n(x++)));
    });
    M();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    e = null, t.store.set(us, null), t.changed();
  }, c = (x) => x.from ? t.who(x.from) : x.label ? `Xtrata Radio · ${x.label}` : "Xtrata Radio";
  let u = {};
  const d = (x) => {
    if (u.box) return u.box;
    const M = it("div", "", "ppp-gift-check");
    u.box = M;
    const T = () => {
      const F = window.turnstile;
      !F || u.rendered || (u.rendered = !0, F.render(M, { sitekey: x, callback: (J) => {
        u.token = J, t.changed();
      }, "expired-callback": () => {
        u.token = void 0;
      } }));
    };
    if (window.turnstile) T();
    else {
      const F = document.createElement("script");
      F.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", F.async = !0, F.onload = T, document.head.append(F);
    }
    return M;
  };
  let l;
  async function y(x) {
    var F, J, wt, Ft, pt;
    if (!e || e.claiming || !x.listening) return;
    const M = !!((F = e.view) != null && F.player);
    if (M && !x.root) return;
    e.claiming = !0, e.error = void 0, t.changed();
    const T = async (qt) => {
      const St = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: u.token, ...qt })
      });
      return { res: St, r: await St.json().catch(() => ({})) };
    };
    try {
      let qt = 0, St = x.listening, ot;
      if (M) {
        const xt = Number((J = await t.json("/radio/gift/slots?root=" + encodeURIComponent(x.root))) == null ? void 0 : J.next);
        if (!Number.isSafeInteger(xt) || xt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        qt = xt;
        for (let bt = 0; ; bt++) {
          const Vt = await t.album.bind(qt);
          if (St = Vt.address, ot = await T({ wallet: St, binding: Vt }), ot.res.status === 409 && /just taken/.test(((wt = ot.r) == null ? void 0 : wt.error) || "") && bt < 5) {
            qt += 1;
            continue;
          }
          break;
        }
      } else ot = await T({ wallet: St });
      const { res: rt, r: dt } = ot;
      if (rt.status === 503 && /sending another gift/.test((dt == null ? void 0 : dt.error) || "")) {
        e.waiting = !0, clearTimeout(l), l = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!rt.ok) {
        const xt = String((dt == null ? void 0 : dt.error) || "");
        if (rt.status === 404 || rt.status === 410 || rt.status === 409 && /already had a gift|brand-new/.test(xt))
          throw t.store.set(us, null), new Error(xt || "This gift cannot be opened.");
        if (rt.status === 429 || rt.status === 403 || rt.status === 400 && !/wallet number/i.test(xt)) throw new Error(xt || `Could not open the gift (${rt.status}).`);
        const Vt = /topping up/.test(xt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(xt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(xt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Vt), { retry: !0, slow: /topping up|not paid for yet/.test(xt) });
      }
      e.done = !0, t.store.set(us, null), M ? await t.album.arrived(qt, St, dt.txid, BigInt(dt.amount)) : t.giftSent(dt.txid, BigInt(dt.amount));
    } catch (qt) {
      const St = qt, ot = St.name === "TypeError" || St.name === "AbortError" || St.name === "TimeoutError" || /wallet number/i.test(St.message);
      if (St.retry || ot) {
        const rt = e.tries ?? 0;
        e.tries = rt + 1, e.retry = { text: St.retry ? St.message : "Still sending your gift… the network is slow, trying again." }, clearTimeout(l), l = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, St.slow ? 6e4 : n(rt));
      } else e.error = St.message;
      u.token = void 0;
      try {
        (pt = (Ft = window.turnstile) == null ? void 0 : Ft.reset) == null || pt.call(Ft, u.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let h = null;
  function E(x) {
    if (!x.listening || !x.depositPending || x.step !== "fund")
      return h = null, [];
    if (!h || h.wallet !== x.listening || t.now() - h.at > 3e4) {
      const T = x.listening;
      h = { ...(h == null ? void 0 : h.wallet) === T ? h : {}, wallet: T, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(T)).then((F) => {
        var J, wt;
        (h == null ? void 0 : h.wallet) === T && (h.state = (J = F == null ? void 0 : F.gift) == null ? void 0 : J.state, h.problem = ((wt = F == null ? void 0 : F.gift) == null ? void 0 : wt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(h.state === "sending" && h.problem)) return [];
    const M = it("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return M.title = `Network reply: ${h.problem}`, [M];
  }
  function m(x, M) {
    var pt, qt;
    const T = M.player, F = BigInt(M.amount), J = [it("p", `🎁 ${c(M)} sent you “${T.title}”${T.subtitle ? ` by ${T.subtitle}` : ""}: ${T.tracks.length} ${T.tracks.length === 1 ? "song" : "songs"} and ${Zc(F).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!x.root && ["fund", "ready", "over", "link"].includes(x.step)))
      return J.push(it("p", x.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : x.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), J;
    if (x.walletCannotAlbums)
      return J.push(it("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), J;
    const Ft = (qt = (pt = x.gate) == null ? void 0 : pt.gifts) == null ? void 0 : qt.turnstileSiteKey;
    return Ft && !u.token ? J.push(it("p", "One quick check and it is yours:", "ppp-mute"), d(Ft)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(x), J.push(...C(x, "Sending your album…")), J;
  }
  function C(x, M) {
    const T = [];
    return e.claiming || e.waiting ? T.push(it("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : M, "ppp-cyan")) : e.retry && T.push(it("p", e.retry.text, "ppp-warn"), Kn("Try now", () => {
      clearTimeout(l), e.retry = void 0, y(x);
    }, "quiet")), e.error && T.push(it("p", e.error, "ppp-bad"), Kn("Try again", () => {
      e.error = void 0, y(x);
    })), T;
  }
  const j = (x) => {
    var M;
    return !!e && !e.done && !e.error && o() && !!x.listening && !x.linked && !x.creditedTo && (x.createdHere || x.brandNew || !!((M = e.view) != null && M.player)) && (x.balance ?? 0n) === 0n && !x.entries.length;
  };
  function O(x) {
    var ot, rt;
    const M = E(x);
    if (!e || ["off", "elsewhere"].includes(x.step)) return M;
    const T = e.view;
    if (e.error && !T) return [it("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!T) return [it("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return M;
    if (T.status === "claimed" || T.status === "claiming") return [it("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(T.status)) return [it("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (T.status === "pending-deposit") return [it("p", `🎁 ${c(T)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (T.player) return [...m(x, T), ...M];
    if (!!x.listening && (!(x.createdHere || x.brandNew) || !!x.linked || !!x.creditedTo || (x.balance ?? 0n) > 0n || x.entries.length > 0))
      return [it("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Kn("Forget this gift link here", a, "quiet")];
    const J = BigInt(T.amount), wt = Zc(J).toLocaleString(), pt = [it(
      "p",
      `🎁 ${c(T)} sent you ${tn(J)} STX of on-chain music: about ${wt} paid plays.`,
      "ppp-gift"
    )], qt = !!x.listening && (x.createdHere || x.brandNew) && !x.linked && !x.creditedTo && x.step === "fund" && (x.balance ?? 1n) === 0n && !x.depositPending && !x.entries.length, St = (rt = (ot = x.gate) == null ? void 0 : ot.gifts) == null ? void 0 : rt.turnstileSiteKey;
    return qt ? (St && !u.token ? pt.push(it("p", "One quick check and it is yours:", "ppp-mute"), d(St)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(x), pt.push(...C(x, "Sending your gift…"))) : x.step === "intro" ? pt.push(it("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : x.listening && x.linked ? pt.push(it("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Kn("Forget this gift link here", a, "quiet")) : x.listening && (x.balance ?? 0n) > 0n && pt.push(it("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Kn("Forget this gift link here", a, "quiet")), pt;
  }
  async function p(x, M, T) {
    var F;
    try {
      const J = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(x));
      if ((F = J == null ? void 0 : J.gift) != null && F.returnTo) return { ok: !0, funder: J.gift.returnTo, txId: J.gift.txid ?? void 0, amount: J.gift.amount, distinct: 1 };
    } catch {
      if (T) return { ok: !1 };
    }
    return M();
  }
  const k = it("div", "", "ppp-gift-fold");
  let I = 250000n, H = "", X = "", K = null;
  const W = (x) => {
    try {
      const M = JSON.parse(t.store.get(t0(x)) || "[]");
      return Array.isArray(M) ? M : [];
    } catch {
      return [];
    }
  }, A = (x, M) => t.store.set(t0(x), JSON.stringify(M.slice(0, 50)));
  let B = 0;
  async function _(x) {
    const M = W(x);
    for (const T of M)
      if (!(T.view && ["claimed", "refunded", "expired"].includes(T.view.status)))
        try {
          T.view = !T.view || T.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: T.id, ...T.txid ? { txid: T.txid } : {} }) }) : await t.json("/radio/gift?id=" + T.id), T.error = void 0;
        } catch (F) {
          T.error = F.message;
        }
    A(x, M), t.changed();
  }
  async function N(x) {
    if (H) return;
    H = "Starting your gift…", X = "", t.changed();
    let M = null;
    try {
      M = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: x, amount: I.toString() }) });
      const T = W(x);
      T.unshift({ id: M.id, code: M.code, amount: I.toString(), at: t.now() }), A(x, T), H = "Approve the gift in your wallet…", t.changed();
      const F = await t.pay(x, M.depositTo, BigInt(M.deposit), M.memo), J = W(x), wt = J.find((Ft) => Ft.id === M.id);
      wt && (wt.txid = F, wt.view = { status: "pending-deposit", amount: I.toString(), source: "friend", from: x, label: "", expires: 0 }), A(x, J), X = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", _(x);
    } catch (T) {
      X = T.message || "Not sent.";
    } finally {
      H = "", t.changed();
    }
  }
  const nt = (x) => "xtrata.radio.gift.players.v1:" + x, z = (x) => {
    try {
      const M = JSON.parse(t.store.get(nt(x)) || "[]");
      return Array.isArray(M) ? M.filter((T) => T && /^[0-9a-f]{16}$/.test(T.id)) : [];
    } catch {
      return [];
    }
  };
  async function Rt(x, M) {
    var T;
    if (!H) {
      H = "Checking the player…", X = "", t.changed();
      try {
        const F = M.tracks.split(/[\s,]+/).filter(Boolean).map((St) => Number(St.replace(/^#/, ""))), J = K5({ title: M.title.trim(), subtitle: M.subtitle.trim(), tracks: F, cover: (T = M.cover) != null && T.trim() ? Number(M.cover.trim().replace(/^#/, "")) : null });
        H = "Sign in your wallet…", t.changed();
        const wt = { admin: x, hash: V5(J), issued: t.now() }, Ft = await t.sign(x, X5(wt));
        H = "Making the player…", t.changed();
        const pt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: J, request: wt, signature: Ft }) }), qt = z(x).filter((St) => St.id !== pt.id);
        qt.unshift({ id: pt.id, title: pt.title, tracks: pt.tracks }), t.store.set(nt(x), JSON.stringify(qt.slice(0, 30))), X = `${pt.existing ? "That player already exists" : "Player made"} ✓ “${pt.title}” · ${pt.tracks} songs. Pick it below for a campaign.`;
      } catch (F) {
        X = F.message || "Not made.";
      } finally {
        H = "", t.changed();
      }
    }
  }
  async function gt(x, M, T, F, J) {
    if (!H) {
      H = "Sign in your wallet…", X = "", K = null, t.changed();
      try {
        const wt = { admin: x, count: M, amount: T.toString(), label: F, issued: t.now(), ...J ? { player: J } : {} }, Ft = await t.sign(x, P5(wt));
        H = "Making links…", t.changed();
        const pt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: wt, signature: Ft }) });
        K = { codes: pt.codes, amount: pt.amount };
      } catch (wt) {
        X = wt.message || "Not made.";
      } finally {
        H = "", t.changed();
      }
    }
  }
  const ue = (x, M) => N5(x || location.origin + "/radio.html", M), $ = (x) => q5({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: x }), P = (x) => {
    try {
      const M = JSON.parse(t.store.get(e0(x)) || "[]");
      return Array.isArray(M) ? M.filter((T) => T && /^[0-9a-f]{16}$/.test(T.id) && Array.isArray(T.codes)) : [];
    } catch {
      return [];
    }
  }, yt = (x, M) => t.store.set(e0(x), JSON.stringify(M.slice(0, 20))), Nt = (x) => !!x.view && x.view.status === "live" && x.view.copies.waiting + x.view.copies.claiming + x.view.copies.refunding === 0, Tt = (x, M) => t.json(x, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(M) });
  let Bt = 0;
  async function ee(x) {
    const M = P(x);
    for (const T of M)
      if (!Nt(T))
        try {
          T.view = !T.view || T.view.status === "pending-deposit" ? await Tt("/radio/gift/batch/confirm", { id: T.id, ...T.txid ? { txid: T.txid } : {} }) : await t.json("/radio/gift/batch?id=" + T.id), T.error = void 0;
        } catch (F) {
          T.error = F.message;
        }
    try {
      const T = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(x));
      for (const F of (T == null ? void 0 : T.batches) ?? []) {
        const J = M.find((wt) => wt.id === F.id);
        if (J) {
          J.error || (J.view = F);
          continue;
        }
        M.push({ id: F.id, codes: [], count: F.count, amount: F.amount, label: F.label, player: F.player, depositTo: "", deposit: F.deposit, memo: F.memo, at: 0, view: F });
      }
    } catch {
    }
    yt(x, M), t.changed();
  }
  async function fe(x, M) {
    const T = P(x).find((F) => F.id === M);
    if (!(!T || !T.depositTo || H)) {
      H = "Approve the payment in your wallet…", X = "", t.changed();
      try {
        const F = await t.pay(x, T.depositTo, BigInt(T.deposit), T.memo), J = P(x), wt = J.find((Ft) => Ft.id === M);
        wt && (wt.txid = F), yt(x, J), X = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", H = "", ee(x);
      } catch (F) {
        X = `${/cancel/i.test(F.message) ? "Payment cancelled." : F.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        H = "", t.changed();
      }
    }
  }
  async function Yt(x, M, T, F) {
    if (H) return;
    if (!M.ok) {
      X = M.reason, t.changed();
      return;
    }
    H = "Sign in your wallet…", X = "", t.changed();
    let J = null;
    try {
      const wt = { creator: x, count: M.count, amount: M.amount.toString(), label: T, issued: t.now(), ...F ? { player: F } : {} }, Ft = await t.sign(x, H5(wt));
      H = "Making your links…", t.changed(), J = await Tt("/radio/gift/batch", { request: wt, signature: Ft });
      const pt = P(x);
      pt.unshift({ id: J.id, codes: J.codes, count: M.count, amount: J.amount, label: T, player: F ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: t.now() }), yt(x, pt);
    } catch (wt) {
      X = wt.message || "Not made.", H = "", t.changed();
      return;
    }
    H = "", t.changed(), await fe(x, J.id);
  }
  function me() {
    const x = !!Ee.value, M = b.value === "max" ? D5(x) : Number(b.value), T = O5(M, x), F = Number(S.value);
    return !Number.isInteger(F) || F < 1 || F > Qc ? { ok: !1, reason: `Make 1 to ${Qc} copies at a time.`, album: x, plays: M, amount: T, count: F } : z5(T) ? { ok: !0, reason: "", album: x, plays: M, amount: T, count: F, bill: j5(F, T, x) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: x, plays: M, amount: T, count: F };
  }
  const xe = () => {
    const x = me();
    if (!x.ok) return x.reason;
    const M = x.bill;
    return `Each copy: ${x.plays.toLocaleString()} paid plays (${tn(M.holders)} to song holders, ${tn(M.fees)} network fees)${x.album ? `, ${tn(M.float)} for the album’s likes` : ""}, ${tn(M.reserve)} kept so a listener can return what is left, + ${tn(M.sendFee)} to send it = ${tn(M.perCopy)} STX. ${x.count} copies = ${tn(M.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Zt = (x, M) => M.codes.map((T) => ue(x, T)), Ie = it("input");
  Ie.type = "range", Ie.min = String(Py), Ie.max = String(Fa), Ie.step = "50000", Ie.value = String(I), Ie.setAttribute("aria-label", "Gift amount");
  const wn = it("p", "", "ppp-gift-amount"), Oe = Kn("", () => {
    const x = t.main();
    x && N(x);
  }, "primary"), an = () => {
    wn.textContent = De(), Oe.textContent = `Gift ${tn(I)} STX`;
  };
  Ie.oninput = () => {
    I = BigInt(Ie.value), an();
  };
  const De = () => `${tn(I)} STX · about ${Zc(I).toLocaleString()} paid plays · you pay ${tn(I + ja)} STX with the network fee`;
  an();
  const ke = it("input");
  ke.type = "number", ke.min = "1", ke.max = String(Uy), ke.value = "10", ke.setAttribute("aria-label", "How many links");
  const Se = it("input");
  Se.type = "number", Se.min = "0.1", Se.max = "1", Se.step = "0.05", Se.value = String(Number(Qh(Jc[0])) / 1e6), Se.setAttribute("aria-label", "STX per link");
  const se = it("input");
  se.maxLength = 60, se.placeholder = "Title, e.g. Proof of Sound", se.setAttribute("aria-label", "Player title");
  const ne = it("input");
  ne.maxLength = 80, ne.placeholder = "Artist (optional)", ne.setAttribute("aria-label", "Player subtitle");
  const Me = it("textarea");
  Me.rows = 3, Me.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Me.setAttribute("aria-label", "Songs");
  const Fe = it("input");
  Fe.inputMode = "numeric", Fe.placeholder = "Cover inscription number (optional), shown when the album loads", Fe.setAttribute("aria-label", "Cover inscription");
  const ie = it("select");
  ie.setAttribute("aria-label", "Gift player");
  const Ge = it("select");
  Ge.setAttribute("aria-label", "Plays per link");
  for (const x of Jc) Ge.append(or(`${x.toLocaleString()} plays`, String(Qh(x))));
  Ge.append(or("Max (1 STX)", String(Fa)), or("Custom STX", "")), Ge.onchange = () => {
    Ge.value && (Se.value = String(Number(Ge.value) / 1e6));
  };
  const Ot = it("input");
  Ot.maxLength = 40, Ot.placeholder = "Label, e.g. Launch week", Ot.setAttribute("aria-label", "Campaign label");
  const Ee = it("select");
  Ee.setAttribute("aria-label", "Batch album");
  const b = it("select");
  b.setAttribute("aria-label", "Plays per copy");
  for (const x of Jc) b.append(or(`${x.toLocaleString()} plays`, String(x)));
  b.append(or("Max (1 STX)", "max"));
  const S = it("input");
  S.type = "number", S.min = "1", S.max = String(Qc), S.value = "10", S.setAttribute("aria-label", "Copies");
  const f = it("input");
  f.maxLength = 40, f.placeholder = "Label, e.g. Opera launch", f.setAttribute("aria-label", "Batch label");
  const V = it("p", "", "ppp-mute"), ct = () => {
    V.textContent = xe();
  };
  for (const x of [Ee, b, S])
    x.oninput = ct, x.onchange = ct;
  ct();
  function lt(x) {
    var J, wt, Ft, pt, qt, St;
    const M = (J = x.gate) == null ? void 0 : J.gifts;
    if (!(M != null && M.enabled) || ["off", "elsewhere", "unsupported"].includes(x.step)) return null;
    const T = t.main(), F = [it("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!T)
      F.push(it("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      Oe.disabled = !!H, F.push(Ie, wn, Oe), t.now() - B > 3e4 && (B = t.now(), _(T));
      const ot = W(T);
      if (ot.length) {
        const rt = it("ul", "", "ppp-gift-list");
        for (const dt of ot.slice(0, 10)) {
          const xt = (wt = dt.view) == null ? void 0 : wt.status, bt = dt.error ? dt.error : !xt || xt === "pending-deposit" ? dt.txid ? "payment confirming…" : "waiting for your payment" : xt === "live" ? "ready to share" : xt === "claiming" || xt === "claimed" ? "claimed ✓" : xt === "refunding" ? "expired · refund on its way" : xt === "refunded" ? "expired · refunded to you" : xt, Vt = it("li");
          if (Vt.append(it("span", `${tn(BigInt(dt.amount))} STX`, "t"), it("span", bt, ((Ft = dt.view) == null ? void 0 : Ft.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((pt = dt.view) == null ? void 0 : pt.status) === "live") {
            const Ze = ue(((qt = x.gate) == null ? void 0 : qt.radioUrl) ?? null, dt.code);
            Vt.append(Yr("gift-copy:" + dt.id, "Copy link", () => Ze, "tiny", t.changed), Oy("gift-share:" + dt.id, "Share", () => $(Ze), "tiny", t.changed));
          }
          rt.append(Vt);
        }
        F.push(rt);
      }
      if (M.admin) {
        const rt = Kn("Sign and make links", () => {
          const _t = BigInt(Math.round(Number(Se.value) * 1e6));
          gt(T, Number(ke.value), _t, Ot.value.trim(), ie.value || void 0);
        }), dt = it("div", "", "ppp-gift-admin"), xt = (_t, Pt) => {
          const jt = it("label", _t);
          return jt.append(Pt), jt;
        }, bt = z(T), Vt = ie.value;
        if (ie.replaceChildren(or("No player (plain gift)", ""), ...bt.map((_t) => or(`${_t.title} · ${_t.tracks} songs`, _t.id))), bt.some((_t) => _t.id === Vt) && (ie.value = Vt), dt.append(
          it("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          se,
          ne,
          Me,
          Fe,
          Kn("Sign and make player", () => void Rt(T, { title: se.value, subtitle: ne.value, tracks: Me.value, cover: Fe.value })),
          it("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          xt("Player ", ie),
          xt("Plays each ", Ge),
          xt("Links ", ke),
          xt("STX each ", Se),
          Ot,
          rt
        ), K) {
          const _t = K.codes.map((jt) => {
            var Ce;
            return ue(((Ce = x.gate) == null ? void 0 : Ce.radioUrl) ?? null, jt);
          }).join(`
`), Pt = it("textarea");
          Pt.readOnly = !0, Pt.value = _t, Pt.rows = Math.min(8, K.codes.length), dt.append(it("p", `${K.codes.length} links, ${tn(BigInt(K.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), Pt, Yr("campaign-copy", "Copy all", () => _t, "tiny", t.changed));
        }
        const Ze = Kn("Sign, pay and make links", () => {
          Yt(T, me(), f.value.trim(), Ee.value || void 0);
        });
        Ze.disabled = !!H;
        const Ne = Ee.value;
        Ee.replaceChildren(or("No album (starter copies)", ""), ...bt.map((_t) => or(`${_t.title} · ${_t.tracks} songs`, _t.id))), bt.some((_t) => _t.id === Ne) && (Ee.value = Ne), ct(), dt.append(
          it("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          xt("Album ", Ee),
          xt("Plays each ", b),
          xt("Copies ", S),
          f,
          V,
          Ze
        ), t.now() - Bt > 3e4 && (Bt = t.now(), ee(T));
        const bn = P(T);
        if (bn.length) {
          const _t = it("ul", "", "ppp-gift-list");
          for (const Pt of bn.slice(0, 10)) {
            const jt = Pt.view, Ce = jt == null ? void 0 : jt.copies, Te = Pt.error ? Pt.error : !jt || jt.status === "pending-deposit" ? Pt.txid ? "payment confirming…" : "waiting for your payment" : `${Ce.claimed} of ${jt.count} claimed${Ce.refunding + Ce.refunded ? ` · ${Ce.refunded} refunded${Ce.refunding ? `, ${Ce.refunding} on their way` : ""}` : ""}`, mn = it("li");
            if (mn.append(it("span", `${Pt.label || "Batch"} · ${Pt.count} × ${tn(BigInt(Pt.amount))} STX`, "t"), it("span", Te, "ppp-mute")), !Pt.txid && Pt.depositTo && (!jt || jt.status === "pending-deposit") && mn.append(Kn("Pay now", () => void fe(T, Pt.id), "tiny")), Pt.codes.length && (jt == null ? void 0 : jt.status) === "live") {
              const yr = Zt(((St = x.gate) == null ? void 0 : St.radioUrl) ?? null, Pt);
              mn.append(
                Yr("batch-copy:" + Pt.id, "Copy all links", () => yr.join(`
`), "tiny", t.changed),
                Yr("batch-csv:" + Pt.id, "Copy as CSV", () => ["copy,link", ...yr.map((wr, br) => `${br + 1},${wr}`)].join(`
`), "tiny", t.changed)
              );
            } else Pt.codes.length || mn.append(it("span", "links were made on another device", "ppp-mute"));
            _t.append(mn);
          }
          dt.append(_t);
        }
        F.push(dt);
      }
    }
    return H && F.push(it("p", H, "ppp-cyan")), X && F.push(it("p", X, /✓/.test(X) ? "ppp-ok" : "ppp-warn")), k.replaceChildren(...F), k;
  }
  return { banner: O, funder: p, renderFold: lt, liveGift: o, setAside: a, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: j };
}
const Y5 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function Z5(t) {
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
const Q5 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function J5(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = Q5(s);
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
function t$(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const ii = 12, e$ = 5e3, en = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, oi = (t, e, n = "") => {
  const r = en("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function n$(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = ii;
  const l = en("div", "", "ppp-shelf-box"), y = (_) => "xtrata.radio.shelf.pins.v1:" + _, h = (_) => "xtrata.radio.shelf.recent.v1:" + _, E = (_, N) => {
    try {
      return JSON.parse(t.store.get(_) || "null") ?? N;
    } catch {
      return N;
    }
  }, m = (_) => new Set(E(y(_), []).filter((N) => Number.isSafeInteger(N))), C = (_) => {
    const N = E(h(_), {}), nt = {};
    for (const [z, Rt] of Object.entries(N)) Number.isSafeInteger(Number(z)) && typeof Rt == "number" && (nt[Number(z)] = Rt);
    return nt;
  };
  async function j(_) {
    if (!i) {
      i = !0, s = !1;
      try {
        const N = [];
        let nt = 0, z = 0;
        for (let Rt = 0; Rt < e$ / 100 + 1; Rt++) {
          const gt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(_)}&after=${nt}&limit=100`);
          if (N.push(...Z5(gt == null ? void 0 : gt.shelf)), z = Number(gt == null ? void 0 : gt.total) || N.length, !(gt != null && gt.next) || !Number.isSafeInteger(gt.next)) break;
          nt = gt.next;
        }
        _ === e && (n = N, r = z, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const O = () => {
    o = -1 / 0;
  }, p = en("input");
  p.type = "search", p.placeholder = "Search title, artist or #", p.setAttribute("aria-label", "Search your albums"), p.oninput = () => {
    a = p.value, d = ii, t.changed();
  };
  const k = en("select");
  k.setAttribute("aria-label", "Sort albums");
  for (const _ of Y5) {
    const N = document.createElement("option");
    N.value = _.value, N.textContent = _.label, k.append(N);
  }
  k.onchange = () => {
    c = k.value, d = ii, t.changed();
  };
  const I = oi("", () => {
    u = !u, d = ii, t.changed();
  }, "tiny"), H = en("div", "", "ppp-shelf-tools");
  H.append(p, k, I);
  const X = en("div"), K = en("div");
  function W(_) {
    const N = _.step === "off" || _.step === "elsewhere" ? void 0 : _.root;
    if (N !== e && (e = N, n = [], r = 0, o = -1 / 0, d = ii), !N || _.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && j(N), !n.length)
      return s ? (K.replaceChildren(en("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), oi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(K), l) : null;
    const nt = m(N), z = C(N), Rt = J5(n, { query: a, sort: c, pinnedOnly: u, pins: nt, recents: z });
    p.value !== a && (p.value = a), k.value = c, I.textContent = u ? "★ Pinned only" : "☆ Pinned only", I.setAttribute("aria-pressed", String(u));
    const gt = [];
    if (_.slot > 0 && gt.push(oi("← My player", () => t.open(0), "quiet")), !Rt.length) gt.push(en("p", "No album matches that.", "ppp-mute"));
    else {
      const ue = en("ul", "", "ppp-shelf-list");
      for (const $ of Rt.slice(0, d)) {
        const P = en("li", "", $.slot === _.slot ? "now" : ""), yt = nt.has($.slot), Nt = oi(yt ? "★" : "☆", () => {
          const fe = new Set(nt);
          yt ? fe.delete($.slot) : fe.add($.slot), t.store.set(y(N), JSON.stringify([...fe])), t.changed();
        }, "tiny");
        Nt.setAttribute("aria-label", yt ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const Tt = [$.player.subtitle, `${$.player.tracks.length} ${$.player.tracks.length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Bt = $.slot === _.slot, ee = oi(Bt ? "Playing" : "Play", () => {
          t.store.set(h(N), JSON.stringify(t$({ ...z, [$.slot]: t.now() }))), t.open($.slot);
        }, Bt ? "tiny" : "tiny primary");
        ee.disabled = Bt, P.append(Nt, en("span", $.player.title, "t"), en("span", " " + Tt, "ppp-mute"), ee), ue.append(P);
      }
      gt.push(ue), Rt.length > d && gt.push(oi(`Show more (${Rt.length - d} left)`, () => {
        d += ii, t.changed();
      }, "quiet"));
    }
    return s && gt.push(en("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), X.replaceChildren(...gt), l.firstChild !== H && l.replaceChildren(H, X), l;
  }
  return { render: W, invalidate: O, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const _ = C(e), N = [...n].filter((nt) => nt.player).sort((nt, z) => (_[z.slot] ?? 0) - (_[nt.slot] ?? 0) || z.slot - nt.slot)[0];
    return N ? { slot: N.slot, title: N.player.title } : null;
  } };
}
const r$ = [
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
function s$(t) {
  for (const [e, n] of r$) if (n.test(t)) return e;
  return null;
}
const Dy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Fy = (t) => /Android/.test(t);
function i$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Dy(e) ? "x-safari-" + n.href : Fy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const o$ = (t) => Dy(t) ? "Safari" : Fy(t) ? "Chrome" : "your browser", n0 = document.getElementById("ppp");
n0 && a$(n0);
function a$(t) {
  var Ee;
  const e = xw(), n = (b) => t.querySelector(b), r = n(".ppp-frame");
  let i = null;
  const s = async (b, S) => {
    const f = await fetch(b, { cache: "no-store", ...S, signal: AbortSignal.timeout(15e3) }), V = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((V == null ? void 0 : V.error) || `Request failed (${f.status}).`);
    return V;
  }, o = X6({
    now: Date.now,
    main: () => {
      const b = e.load();
      return b.isConnected && b.network === "mainnet" ? b.address : void 0;
    },
    config: (b) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(b || "")),
    links: async (b) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(b))).links ?? [],
    mainOf: async (b) => {
      var f;
      const S = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(b))).links;
      return ((f = S == null ? void 0 : S.find((V) => V.listening === b)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (b) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });
    },
    bridge: async (b) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${b}; publickey-credentials-create ${b}`), i.referrerPolicy = "no-referrer";
      const S = new Promise((lt, Xt) => {
        i.addEventListener("load", () => lt(), { once: !0 }), setTimeout(() => Xt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = b + "/", r.replaceChildren(i), await S;
      const f = new fw({ walletOrigin: b, frame: i, timeoutMs: 30 * 6e4 }), V = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ct = (lt, Xt) => V.has(lt) ? f.request(lt, Xt) : Promise.race([
        f.request(lt, Xt),
        new Promise((x, M) => setTimeout(() => M(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ct("listening.status"), { request: ct };
    },
    chain: {
      verify: k6,
      balance: C6,
      account: L6,
      owner: T6,
      broadcast: B6,
      transaction: M6,
      confirmedNonce: async (b) => {
        const S = await ts(`/v2/accounts/${b}?proof=0`);
        if (!Number.isSafeInteger(S == null ? void 0 : S.nonce) || S.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(S.nonce);
      }
    },
    signWithMain: (b, S) => Hh({ ...S, network: "mainnet", stxAddress: b }),
    deposit: (b, S, f) => new Promise((V, ct) => Mh({
      recipient: S,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: b,
      network: new el(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (lt) => V(lt.txId || ""),
      onCancel: () => ct(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ct
    })),
    validate: N6,
    tabLock: (b) => new Promise((S) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        S(!0);
        return;
      }
      f.request("xtrata-ppp:" + b, { ifAvailable: !0 }, async (V) => {
        S(!!V), V && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (b) => {
        try {
          return localStorage.getItem(b);
        } catch {
          return null;
        }
      },
      set: (b, S) => {
        try {
          localStorage.setItem(b, S);
        } catch {
        }
      }
    },
    changed: () => ie(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (b) => {
      var S, f;
      return a.funder(b, () => D6(b, ts), !!((f = (S = o.snapshot().gate) == null ? void 0 : S.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (b) => {
      const S = await s("/radio/gift/for?wallet=" + encodeURIComponent(b)), f = S == null ? void 0 : S.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (b, S) => z6(b, (f) => ts(f), S),
    likesChanged: () => {
      var b, S;
      (S = (b = window.XtrataRadio) == null ? void 0 : b.refreshLikes) == null || S.call(b);
    },
    likeState: async (b, S) => {
      const f = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: b, ids: String(S) })), V = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((ct) => (ct == null ? void 0 : ct.id) === S) : null;
      if (!V || typeof V.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: V.liked, by: Array.isArray(V.by) ? V.by.filter((ct) => typeof ct == "string") : V.liked ? [b] : [] };
    },
    likeSent: (b, S) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: b, liked: S } })),
    nameOf: (b) => A(b) ?? void 0,
    likeConfirmed: (b, S) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: b, liked: S } })),
    likeFailed: (b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: b } }))
  }), a = W5({
    json: s,
    main: () => {
      const b = e.load();
      return b.isConnected && b.network === "mainnet" ? b.address : void 0;
    },
    pay: (b, S, f, V) => new Promise((ct, lt) => Mh({
      recipient: S,
      amount: f.toString(),
      memo: V,
      stxAddress: b,
      network: new el(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (Xt) => ct(Xt.txId || ""),
      onCancel: () => lt(new Error("Gift cancelled. Nothing was sent.")),
      onError: lt
    })),
    sign: (b, S) => Hh({ ...S, network: "mainnet", stxAddress: b }),
    giftSent: (b, S) => o.giftSent(b, S),
    album: { bind: (b) => o.bindAlbum(b), arrived: async (b, S, f, V) => {
      c.invalidate(), await o.albumArriving(b, S, f, V);
    } },
    who: (b) => N(b),
    changed: () => ie(o.snapshot()),
    store: {
      get: (b) => {
        try {
          return localStorage.getItem(b);
        } catch {
          return null;
        }
      },
      set: (b, S) => {
        try {
          S === null ? localStorage.removeItem(b) : localStorage.setItem(b, S);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = n$({
    json: s,
    open: (b) => {
      o.openAlbum(b);
    },
    store: {
      get: (b) => {
        try {
          return localStorage.getItem(b);
        } catch {
          return null;
        }
      },
      set: (b, S) => {
        try {
          S === null ? localStorage.removeItem(b) : localStorage.setItem(b, S);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => ie(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (b) => {
    if (!b || !Number.isSafeInteger(b.song) || b.song < 0) return !1;
    ue();
    const S = $(b.song, { title: b.title, artist: b.artist });
    return o.heart({ song: b.song, title: S.title || void 0, artist: S.artist || void 0, likedBy: Array.isArray(b.likedBy) ? b.likedBy : void 0 });
  };
  let u;
  window.XtrataRadioListeningIdentity = () => {
    const b = o.snapshot();
    return b.solo && b.step !== "off" && b.step !== "elsewhere" ? b.listening : void 0;
  };
  const d = (b) => {
    var f, V;
    const S = window.XtrataRadioListeningIdentity();
    S !== u && (u = S, (V = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || V.call(f));
  };
  let l = "", y = null, h = !1;
  const E = (b) => {
    var Xt, x, M, T, F;
    const S = window.XtrataRadio;
    if (!(S != null && S.setGiftPlayer) || !(S != null && S.setGiftStop)) return;
    const f = b.step === "off" || b.step === "elsewhere" ? null : ((Xt = b.gift) == null ? void 0 : Xt.player) ?? null, V = f ? f.id + ":" + f.cover + ":" + f.tracks.map((J) => J.id).join(",") : "";
    V !== l && (S.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: f.tracks.map((J) => J.id), cover: f.cover } : null), l = V);
    const ct = ((x = b.giftStop) == null ? void 0 : x.text) ?? null;
    ct !== y && (S.setGiftStop(ct), y = ct);
    const lt = !!f && !!((M = b.albumLock) != null && M.locked);
    lt !== h && ((T = S.setGiftLock) == null || T.call(S, lt), h = lt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(b.step) && ((F = S.forgetWallets) == null || F.call(S));
  }, m = (b) => b ? b.slice(0, 6) + "…" + b.slice(-4) : "", C = (b) => (Number(b) / 1e6).toFixed(b < 1000n ? 6 : 4), j = (b) => {
    const S = Math.round((Date.now() - b) / 6e4);
    return S < 1 ? "now" : S < 60 ? `${S}m` : S < 1440 ? `${Math.round(S / 60)}h` : `${Math.round(S / 1440)}d`;
  }, O = (b) => `https://explorer.hiro.so/txid/${b}?chain=mainnet`, p = (b, S = "", f = "") => {
    const V = document.createElement(b);
    return S && (V.textContent = S), f && (V.className = f), V;
  }, k = (b, S, f = "") => {
    const V = p("button", b, f);
    return V.type = "button", V.onclick = S, V;
  }, I = (b, S) => {
    const f = p("a", b);
    return f.href = S, f.target = "_blank", f.rel = "noopener", f;
  };
  let H = null, X = location.hash === "#give";
  X && history.replaceState(null, "", location.pathname + location.search);
  let K = !1;
  const W = T5((b) => C5({ address: b, network: "mainnet" }), () => ie(o.snapshot())), A = (b) => W.get(b), B = s$(navigator.userAgent), _ = (b, S) => {
    const f = navigator.userAgent, V = o$(f), ct = `${location.origin}${location.pathname}${S ? `#gift=${S}` : ""}`, lt = [p("p", `You are in ${b}'s built-in browser, where passkeys often do not work. Open this page in ${V} to make your listening wallet${S ? " and claim your gift" : ""}.`, "ppp-warn")], Xt = p("div", "", "ppp-open-row"), x = i$(ct, f);
    if (x) {
      const M = p("a", `Open in ${V}`, "primary ppp-open-in");
      M.href = x, M.dataset.homeAction = "radio:open-in-browser", Xt.append(M);
    }
    return Xt.append(Yr("copy-page-link", "Copy link", () => ct, x ? "" : "primary", () => ie(o.snapshot()))), lt.push(Xt, p("p", `If that does not open ${V}, use ${b}'s menu (••• or ⋮) and choose "Open in ${V === "your browser" ? "browser" : V}", or paste the copied link there.`, "ppp-mute")), lt;
  }, N = (b) => A(b) ?? m(b), nt = (b) => b.slice(0, 2).map(N).join(" and ") + (b.length > 2 ? ` and ${b.length - 2} more` : ""), z = /* @__PURE__ */ new Map();
  let Rt = !1;
  const gt = (b) => !b || /^(?:Inscription )?#\d+$/.test(b.trim()), ue = () => {
    Rt || (Rt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((b) => b.ok ? b.json() : null).then((b) => {
      for (const S of Array.isArray(b == null ? void 0 : b.tracks) ? b.tracks : []) {
        const f = Number(S == null ? void 0 : S.id);
        Number.isSafeInteger(f) && z.set(f, { title: typeof S.title == "string" ? S.title : void 0, artist: typeof S.artist == "string" ? S.artist : void 0 });
      }
      ie(o.snapshot());
    }).catch(() => {
      Rt = !1;
    }));
  }, $ = (b, S) => {
    const f = z.get(b), V = M5(b, [f == null ? void 0 : f.title, S == null ? void 0 : S.title].find((lt) => !gt(lt)) || ""), ct = B5(b, (f == null ? void 0 : f.artist) || (S == null ? void 0 : S.artist) || "");
    return { title: V, artist: ct };
  }, P = (b) => {
    const { title: S, artist: f } = $(b.song, b);
    return S ? `“${S}”${f ? ` — ${f}` : ""}` : `Song #${b.song}${f ? ` — ${f}` : ""}`;
  }, yt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Nt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Tt(b) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(b.step) ? ["", ""] : b.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : b.step === "over" ? ["OVER 1 STX", "bad"] : b.step === "locked" ? ["LOCKED", "mute"] : b.step === "intro" || b.step === "link" ? ["", ""] : b.step === "fund" ? b.depositPending ? ["ON ITS WAY", "warn"] : b.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : b.payingOn && b.session && b.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function Bt(b, S, f = "", V) {
    const ct = p("dt", b), lt = p("dd", S, f);
    return V && lt.append(" ", V), [ct, lt];
  }
  const ee = document.getElementById("ppp-top"), fe = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Yt = () => {
    var S, f;
    const b = o.snapshot();
    if (b.step === "connect" || b.step === "wrong-wallet") {
      (S = document.getElementById("radio-wallet-connect")) == null || S.click();
      return;
    }
    if (b.step === "elsewhere" && ((f = b.gate) != null && f.radioUrl)) {
      location.href = b.gate.radioUrl;
      return;
    }
    b.step === "locked" && !b.armed && !b.busy && o.unlock(), b.step === "ready" && !b.payingOn && !b.busy && o.switchOn(), fe();
  };
  ee && (ee.onclick = Yt);
  function me(b) {
    if (!ee) return;
    const S = (V, ct, lt) => {
      ee.hidden = !1, ee.className = "ppp-top" + (ct ? " is-" + ct : ""), ee.replaceChildren(p("span", "", "dot"), document.createTextNode(V)), ee.title = lt;
    }, f = b.session ? Math.min(b.session.playsLeft, b.playsLeft) : 0;
    switch (b.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        ee.hidden = !0;
        return;
      case "elsewhere":
        return S("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        ee.hidden = !0;
        return;
      case "intro":
        return S("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return S(`Connect ${N(b.linked)}`, "warn", `This device's listening wallet belongs to ${N(b.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return S(b.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return S("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return b.depositPending ? S("Funds on their way", "quiet", "Paying starts by itself when they land") : S(b.entries.some((V) => V.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return S("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return S("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return b.payingOn && f > 0 ? S(`On · ${f.toLocaleString()} plays left`, "on", "Paying artists as you listen") : S("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const xe = document.getElementById("pppNudge"), Zt = document.getElementById("onair");
  (Ee = xe == null ? void 0 : xe.querySelector("button")) == null || Ee.addEventListener("click", () => Yt());
  const Ie = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, wn = {
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
  function Oe(b) {
    var Xt;
    if (b.step === "loading") return;
    const S = b.session ? Math.min(b.session.playsLeft, b.playsLeft) : 0, f = b.step === "ready" && b.payingOn && S > 0, V = b.step === "fund" && b.depositPending, ct = f || V ? "" : Ie[b.step] ?? "", lt = f ? "on" : ct ? "off" : "";
    if (lt ? document.documentElement.dataset.ppp = lt : delete document.documentElement.dataset.ppp, Zt && (Zt.hidden = !lt, Zt.querySelector(".onair-sub").textContent = f ? `Paying artists · ${S.toLocaleString()} plays left` : "Not paying"), xe && (xe.hidden = lt !== "off", lt === "off")) {
      const x = Math.floor(Number(1000000n / kn(BigInt(((Xt = b.gate) == null ? void 0 : Xt.limits.playFee) ?? "300"))));
      xe.querySelector(".nudge-t").textContent = "⚠ " + ct, xe.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${x.toLocaleString()} plays, on-chain, straight to the artists.`, xe.querySelector("button").textContent = wn[b.step] ?? "Start paying";
    }
  }
  let an = "";
  function De(b) {
    const S = p("div", "", "ppp-pick");
    b.funderMultiple && b.returnToKind === "funder" && S.append(p("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), b.returnToKind === "funder" && S.append(p("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = p("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = an, f.oninput = () => {
      an = f.value;
    };
    const V = k(b.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), an = "";
    }, "tiny");
    return S.append(f, " ", V), b.returnToKind === "chosen" && S.append(" ", k("Back to the funder", () => o.clearReturnAddress(), "tiny")), S;
  }
  const ke = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Se() {
    const b = p("p", ke + " ", "ppp-mute");
    return b.append(I("Xverse", "https://www.xverse.app/download"), " · ", I("Leather", "https://leather.io/install-extension")), b;
  }
  let se = "";
  const ne = (b) => {
    const S = document.documentElement, f = b.solo && !b.main ? b.listening ? m(b.listening) : "new" : "", V = Q6() ? "1" : "";
    `${f}|${V}` !== se && (se = `${f}|${V}`, f ? S.dataset.pppSolo = f : delete S.dataset.pppSolo, V ? S.dataset.pppWalletInstalled = V : delete S.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const b of [1500, 4e3, 9e3]) setTimeout(() => ie(o.snapshot()), b);
  function Me(b, S = "") {
    var ct;
    const f = p("div", "", "ppp-topup"), V = (ct = b.likeFunds) == null ? void 0 : ct.balance;
    f.append(p("span", "Add plays from My player: ", "ppp-mute"));
    for (const lt of iu) {
      const Xt = k(`+${(Number(lt) / 1e6).toFixed(2)} STX`, () => void o.topUpAlbum(lt), S);
      Xt.disabled = V === void 0 || V < lt + 6000n || b.depositPending || !!b.busy, f.append(Xt);
    }
    return V !== void 0 && V < iu[0] + 6000n && f.append(p("p", "My player is nearly empty: add STX to it first (switch to My player above).", "ppp-mute")), f;
  }
  function Fe(b) {
    const S = b.likeFunds;
    if (!S || !S.album || !S.low && !S.pending) return [];
    const f = p("div", "", "ppp-pick ppp-lowbox");
    if (!S.low) {
      const ct = p("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return S.txid && ct.append(I("View", O(S.txid))), f.append(ct), [f];
    }
    f.append(p("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(p("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(p("p", S.address, "ppp-addr-full"));
    const V = p("div", "", "ppp-open-row");
    if (V.append(Yr("copy-likes-address", "Copy address", () => S.address, "primary", () => ie(o.snapshot()))), S.main && !b.solo) {
      const ct = ms - (S.balance ?? 0n);
      ct > 0n && V.append(k(`Pay ${Tn(ct)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(V), f.append(p("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  function ie(b) {
    var br, Ys, _e, Zs, is, Qs, mr, xr, cn, Sr, os, Er, as;
    const S = a.inProgress(b), f = S && b.step === "fund" ? { ...b, depositPending: !0 } : b;
    if (d(), E(b), ne(f), me(f), Oe(f), t.hidden = f.step === "off", t.hidden) return;
    const [V, ct] = Tt(f), lt = n(".ppp-state");
    lt.textContent = V, lt.className = "ppp-state" + (ct ? " ppp-state--" + ct : ""), lt.hidden = !V;
    const Xt = !!f.busy || f.armed, x = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Xt || !["intro", "loading"].includes(f.step));
    r.hidden = !x, r.classList.toggle("ppp-frame--rest", !Xt && !K);
    const M = n(".ppp-frame-label");
    M.hidden = !0;
    const T = q6(f) ?? H;
    H = T;
    const F = Y6(f, T);
    n(".ppp-badge").hidden = !F;
    const J = n(".ppp-steps"), wt = n(".ppp-stage");
    J.hidden = wt.hidden = !F, T && F && (J.replaceChildren(...ou(f.solo).map((R, tt) => {
      const oe = p("li", "", tt < T.at ? "done" : tt === T.at ? T.blocked ? "now blocked" : "now" : "");
      return oe.append(p("span", tt < T.at ? "✓" : String(tt + 1), "n"), R), tt === T.at && oe.setAttribute("aria-current", "step"), oe;
    })), wt.textContent = T.caption, wt.className = "ppp-stage " + (T.at >= ou(f.solo).length ? "ppp-ok" : T.blocked ? "ppp-bad" : "ppp-cyan"));
    const Ft = n(".ppp-facts"), pt = [];
    f.main && ((br = f.gate) != null && br.here) && !f.solo && pt.push(...Bt("Your wallet", N(f.main), "ppp-addr-short"));
    const qt = () => {
      if (!f.listening) return;
      const R = Yr("copy-listening", "Copy", () => f.listening || "", "tiny", () => ie(o.snapshot()));
      pt.push(...Bt(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", m(f.listening), "ppp-addr-short", R));
    };
    if (f.linked || qt(), f.listening && f.step !== "intro")
      if (f.linked)
        pt.push(...Bt("Credited to", `${N(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), qt();
      else if (f.solo) {
        f.creditedTo && pt.push(...Bt("Credited to", `${N(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const R = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${N(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        pt.push(...Bt("Returns go to", f.gift ? R : f.returnTo && !A(f.returnTo) ? R.replace(m(f.returnTo), f.returnTo) : R, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else pt.push(...Bt("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Ys = f.gate) != null && Ys.here)) {
      const R = f.linkedListening.map((tt) => m(tt) + (tt === f.listening ? " (this one)" : "")).join(", ");
      pt.push(...Bt(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", R, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const R = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      pt.push(...Bt("Balance", `${Tn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, R));
    }
    const St = f.entries.find((R) => R.kind === "play");
    St && ue(), St && pt.push(...Bt("Last paid song", `${P(St)} → ${N(St.recipient)}`, yt[St.status] || "")), Ft.replaceChildren(...pt), Ft.hidden = !pt.length;
    const ot = [], rt = [], dt = [], xt = [], bt = kn(BigInt(((_e = f.gate) == null ? void 0 : _e.limits.playFee) ?? "300")), Vt = `Each song you listen to for 30 seconds sends ${Tn(Oa)} STX to whoever holds it, plus a ${Tn(bt - Oa)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Ze = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (ot.push(p("p", "Pay artists as you listen.")), (Zs = f.gate) != null && Zs.radioUrl) {
          const tt = p("p");
          tt.append(I("Open the pay-per-play radio →", f.gate.radioUrl)), ot.push(tt);
        }
        rt.push(p("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const tt = [f.linked, ...f.others];
          ot.push(p("p", tt.length > 1 ? `This device has listening wallets for ${nt(tt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${N(f.linked)}. Connect that wallet to keep paying artists.`)), rt.push(p("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          ot.push(p("p", "Connect your wallet to pay artists as you listen.")), rt.push(p("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        ot.push(p("p", `This device's listening wallet belongs to ${N(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), rt.push(p("p", `You are connected as ${N(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), rt.push(p("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), dt.push(k("Switch wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        }, "primary"));
        break;
      case "not-invited":
        ot.push(p("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ot.push(p("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ot.push(p("p", `Pay artists ${Tn(bt)} STX a song as you listen.`)), rt.push(p("p", Vt)), rt.push(p("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), rt.push(p("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (ot.push(p("p", `This device already has a listening wallet for ${nt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), rt.push(p("p", `Otherwise, set up a new listening wallet for ${N(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && rt.push(p("p", `This is the listening wallet for ${N(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && rt.push(p("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const R = a.liveGift();
        dt.push(k(R ? "Claim my gift · no wallet needed" : f.solo ? "Turn on pay-per-play · no wallet needed" : f.others.length && f.main ? `Set up for ${N(f.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !R && !f.solo && f.main && f.others.length && dt.push(k("Switch wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        })), !R && f.solo && dt.push(k("I have a Stacks wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        })), dt.push(k("I already have a listening wallet", () => void o.unlock(!0))), R && dt.push(k("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (ot.push(p("p", "Locked.", "ppp-mute")), dt.push(k(f.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), xt.push(k("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ot.push(p("p", `Link to ${N(f.main)} · free`)), rt.push(p("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), rt.push(p("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), dt.push(k(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ot.push(p("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending || ((is = f.gift) != null && is.player ? ot.push(p("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? ot.push(p("p", "Out of funds · top up to keep paying", "ppp-bad")) : ot.push(p("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / bt)).toLocaleString()} songs`))), (Qs = f.gift) != null && Qs.player ? rt.push(p("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && rt.push(p("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && rt.push(p("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), S || (f.solo ? (rt.push(p("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), rt.push(p("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && dt.push(Yr("copy-address", "Copy my address", () => f.listening || "", "primary", () => ie(o.snapshot())))) : rt.push(p("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const tt = p("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          tt.append(I("View", O(f.depositTxid))), ot.push(tt);
        } else f.allowance > 0n && !f.solo && dt.push(k(`Deposit ${Tn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ot.push(p("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (ot.push(p("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ot.push(De(f))), (!f.solo || f.returnTo) && dt.push(k("Return excess", () => void o.returnFunds("excess"), "primary"), k("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const tt = Math.min(f.session.playsLeft, f.playsLeft);
          ot.push(p("p", `Paying as you listen · up to ${tt.toLocaleString()} plays left`, "ppp-ok")), rt.push(p("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), dt.push(k("Switch off", () => void o.switchOff()));
        } else
          ot.push(p("p", "Paying is off. Music stays free.", "ppp-mute")), dt.push(k("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        f.queued && ot.push(p("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && ot.push(p("p", "Running low · top up", "ppp-warn")), f.depositPending ? ot.push(p("p", "Top-up on its way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && dt.push(k(`Top up ${Tn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && rt.push(p("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && rt.push(De(f)), rt.push(Se()), f.slot === 0 && f.step === "ready" && f.entries.some((R) => R.kind === "play" && R.status === "confirmed"))) {
      const R = p("p", "New to Stacks? ", "ppp-mute");
      R.append(I("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ot.push(R);
    }
    if (f.walletOutdated && rt.push(p("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (ot.push(p("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), dt.push(k("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && xt.push(k(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${N(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((mr = f.gift) != null && mr.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && xt.push(Me(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && xt.push(k("Lock", () => void o.lock(), "quiet")), x && !Xt && xt.push(k(K ? "Hide listening wallet box" : "Show listening wallet box", () => {
      K = !K, ie(o.snapshot());
    }, "quiet")), [...dt, ...xt].forEach((R) => R.disabled = Ze), Ze && (dt.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((xr = f.gift) != null && xr.player)) {
      const R = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", tt = ot.at(0);
      f.step === "ready" && tt ? tt.append(p("span", ` · ${C(f.balance)} STX`, R)) : ot.push(p("p", `Balance ${C(f.balance)} STX`, R));
    }
    if ((cn = f.gift) != null && cn.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const R = p("p", "", "ppp-gift");
      R.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && R.append(" · ", f.gift.player.subtitle);
      const tt = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? p("span", " · plays on their way", "ppp-warn") : p("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      tt && R.append(tt);
      const oe = (Sr = ot.at(0)) == null ? void 0 : Sr.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && oe && /STX/.test(oe.textContent ?? "") && oe.remove(), ot.unshift(R), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          ot.splice(1, 0, p("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Me(f, "primary"));
        else {
          const ge = p("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ge.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ge.append(I("Xverse", "https://www.xverse.app/download"), " and ", I("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ot.splice(1, 0, ge);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const R = f.returnPlan, tt = p("div", "", "ppp-pick");
      tt.append(p("p", R.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const oe = p("ul", "", "ppp-gift-list");
      R.steps.forEach((ge, cs) => {
        const On = ge.kind === "gift" ? "the unused gift" : ge.kind === "deposit" ? "what was added to it" : "the rest", re = p("li");
        re.append(p("span", `${cs + 1}. ${Tn(BigInt(ge.send))} STX · ${On}`, "t"), p("span", ge.to ? ` → ${N(ge.to)}` : " → choose an address below", ge.to ? "ppp-mute" : "ppp-warn")), oe.append(re);
      }), tt.append(oe), R.kept && tt.append(p("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), R.steps.some((ge) => !ge.to) && tt.append(De(f)), tt.append(k(R.steps.length > 1 ? `Confirm part 1 of ${R.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), ot.push(tt);
    }
    ot.unshift(...a.banner(b)), ot.unshift(...Fe(f)), B && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) && ot.unshift(..._(B, a.pendingCode())), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && ot.unshift(p("p", `This is ${N(f.creditedTo)}'s listening wallet. Plays and likes count for ${N(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...ot);
    const Ne = document.querySelector(".ppp-switch");
    if (Ne) {
      const R = c.latest(), tt = f.slot > 0, oe = ["fund", "ready", "over"].includes(f.step) && (tt || !!R);
      if (Ne.hidden = !oe, oe) {
        const ge = (On, re, Di, Fi) => {
          const Ln = k("", Fi, "ppp-tab");
          return Ln.setAttribute("aria-pressed", String(Di)), Ln.append(p("span", On, "tt"), p("span", re === void 0 ? "…" : `${C(re)} STX`, "ts")), Ln.disabled = !!f.busy, Ln;
        }, cs = tt ? ((Er = (os = f.gift) == null ? void 0 : os.player) == null ? void 0 : Er.title) ?? "Album" : R.title;
        Ne.replaceChildren(
          ge("🎧 My player", tt ? (as = f.likeFunds) == null ? void 0 : as.balance : f.balance, !tt, () => {
            tt && o.openAlbum(0);
          }),
          ge("💿 " + cs, tt ? f.balance : void 0, tt, () => {
            !tt && R && o.openAlbum(R.slot);
          })
        );
      }
    }
    const bn = c.render(f), _t = document.querySelector(".ppp-shelf");
    if (_t) {
      _t.hidden = !bn;
      const R = _t.querySelector("summary");
      R && (R.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const tt = _t.querySelector(".ppp-shelf-body");
      bn && tt && !tt.contains(bn) && tt.replaceChildren(bn);
    }
    const Pt = a.renderFold(b);
    if (n(".ppp-gifts").hidden = !Pt, Pt && !n(".ppp-gift-body").contains(Pt) && n(".ppp-gift-body").replaceChildren(Pt), Pt && X) {
      X = !1;
      const R = n(".ppp-gifts");
      R.open = !0, requestAnimationFrame(() => R.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...rt), n(".ppp-actions").replaceChildren(...dt), n(".ppp-actions2").replaceChildren(...xt);
    const jt = f.busy || f.message || "", Ce = n(".ppp-msg"), Te = jt && ot.some((R) => (R.textContent ?? "").startsWith(jt.replace(/[.✓\s]+$/, ""))) ? "" : jt, mn = !Te && !f.error ? f.notice : "";
    Ce.textContent = Te || mn, Ce.classList.toggle("is-warn", !!mn), n(".ppp-err").textContent = f.error;
    const yr = f.entries.filter((R) => R.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...yr.slice(0, 5).map((R) => {
      const tt = p("li"), oe = R.status === "confirmed" ? "ok" : R.status === "failed" ? "bad" : "warn";
      return tt.append(p("span", "", "d " + oe), p("span", P(R), "t"), p("span", j(R.created), "ppp-mute")), R.txid && tt.append(I("tx", O(R.txid))), tt;
    })), n(".ppp-wallets").hidden = !(Ft.childElementCount || xt.length), n(".ppp-more").hidden = !rt.length;
    const wr = n(".ppp-history");
    wr.hidden = !f.entries.length, f.entries.length && ue(), wr.replaceChildren(p("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((R) => {
      const tt = p("div", "", "ppp-row"), oe = R.kind === "play" ? [p("span", P(R), "ppp-song"), p("span", ` · ${Tn(BigInt(R.amount))} STX to ${N(R.recipient)}`, "ppp-mute")] : R.kind === "like" ? [p("span", `${R.liked ? "♥ Liked" : "Unliked"} ${P(R)}`, "ppp-song"), p("span", ` · for ${f.linked ? N(f.linked) : "this listening wallet"}`, "ppp-mute")] : [p("span", `Returned ${Tn(BigInt(R.amount))} STX`, "ppp-song"), p("span", ` to ${N(R.recipient)}`, "ppp-mute")];
      return tt.append(
        p("span", Nt[R.status] || R.status, "ppp-status " + (yt[R.status] || "")),
        ...oe,
        p("span", ` · ${new Date(R.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), R.txid && tt.append(I("tx ↗", O(R.txid))), tt;
    }));
  }
  const Ge = /* @__PURE__ */ new Map(), Ot = () => {
    const b = window.XtrataRadio;
    return b != null && b.subscribe ? (b.subscribe((S) => {
      const f = S == null ? void 0 : S.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && Ge.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!Ot()) {
    const b = setInterval(() => {
      Ot() && clearInterval(b);
    }, 500);
    setTimeout(() => clearInterval(b), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (b) => {
    const S = b.detail;
    if (S && Number.isSafeInteger(S.song) && typeof S.id == "string" && /^[0-9a-f]{32}$/.test(S.id)) {
      ue();
      const f = $(S.song, Ge.get(S.song));
      o.onListened({ song: S.song, id: S.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const c$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", l$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, u$ = () => l$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, f$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, d$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', jy = class {
  constructor(t) {
    RA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && lx(t), this.callback(ec(t));
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
    var r, i, s, o, a, c, u, d, l, y;
    return n === "IOS" ? (i = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Chrome" ? (o = (s = t.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = u$(), e = f$(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return Et("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Et("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Et("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Et("div", { class: "flex flex-col space-y-[10px]" }, Et("div", { class: "flex items-center" }, Et("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Et("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Et("span", { class: "sr-only" }, "Close popup"), Et("img", { src: c$ }))), r ? Et("p", null, "Select the wallet you want to connect to.") : Et("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Et("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Et("div", { class: "mt-6" }, Et("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Et("ul", { class: "space-y-3" }, this.installedProviders.map((s) => Et("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Et("div", { class: "aspect-square basis-9 overflow-hidden" }, Et("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Et("div", { class: "flex-1" }, Et("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && Et("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), Et("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && Et("div", { class: "mt-6" }, r ? Et("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Et("div", { class: "mb-5 flex justify-between" }, Et("p", { class: "text-sm font-medium" }, "Recommended wallets"), Et("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Et("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Et("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Et("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Et("p", null, "What is a wallet? ", Et("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Et("ul", { class: "space-y-3" }, n.map((s) => Et("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Et("div", { class: "aspect-square basis-9 overflow-hidden" }, Et("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Et("div", { class: "flex-1" }, Et("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && Et("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && Et("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return vA(this);
  }
};
jy.style = d$;
const h$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: jy
}, Symbol.toStringTag, { value: "Module" }));
