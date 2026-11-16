var xb = Object.defineProperty;
var Sb = (e, t, n) => t in e ? xb(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Qo = (e, t, n) => Sb(e, typeof t != "symbol" ? t + "" : t, n);
var Cn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Mg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function wl(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, s.get ? s : {
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
      typeof Cn < "u" && Cn || {}, r = {
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
      function d(m) {
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
        }), d(m);
      }, h.prototype.values = function() {
        var m = [];
        return this.forEach(function(I) {
          m.push(I);
        }), d(m);
      }, h.prototype.entries = function() {
        var m = [];
        return this.forEach(function(I, N) {
          m.push([N, I]);
        }), d(m);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function u(m) {
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
      function y(m) {
        var I = new FileReader(), N = w(I);
        return I.readAsArrayBuffer(m), N;
      }
      function S(m) {
        var I = new FileReader(), N = w(I), _ = /charset=([A-Za-z0-9_-]+)/.exec(m.type), W = _ ? _[1] : "utf-8";
        return I.readAsText(m, W), N;
      }
      function v(m) {
        for (var I = new Uint8Array(m), N = new Array(I.length), _ = 0; _ < I.length; _++)
          N[_] = String.fromCharCode(I[_]);
        return N.join("");
      }
      function C(m) {
        if (m.slice)
          return m.slice(0);
        var I = new Uint8Array(m.byteLength);
        return I.set(new Uint8Array(m)), I.buffer;
      }
      function P() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = C(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || o(m)) ? this._bodyArrayBuffer = C(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = u(this);
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
            var m = u(this);
            return m || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(y);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var m = u(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return S(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(v(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(U);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var H = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function k(m) {
        var I = m.toUpperCase();
        return H.indexOf(I) > -1 ? I : m;
      }
      function M(m, I) {
        if (!(this instanceof M))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var N = I.body;
        if (m instanceof M) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, I.headers || (this.headers = new h(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !N && m._bodyInit != null && (N = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new h(I.headers)), this.method = k(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var R = new AbortController();
            return R.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var _ = /([?&])_=[^&]*/;
          if (_.test(this.url))
            this.url = this.url.replace(_, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var W = /\?/;
            this.url += (W.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      M.prototype.clone = function() {
        return new M(this, { body: this._bodyInit });
      };
      function U(m) {
        var I = new FormData();
        return m.trim().split("&").forEach(function(N) {
          if (N) {
            var _ = N.split("="), W = _.shift().replace(/\+/g, " "), R = _.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(W), decodeURIComponent(R));
          }
        }), I;
      }
      function Y(m) {
        var I = new h(), N = m.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(_) {
          return _.indexOf(`
`) === 0 ? _.substr(1, _.length) : _;
        }).forEach(function(_) {
          var W = _.split(":"), R = W.shift().trim();
          if (R) {
            var ue = W.join(":").trim();
            try {
              I.append(R, ue);
            } catch (de) {
              console.warn("Response " + de.message);
            }
          }
        }), I;
      }
      P.call(M.prototype);
      function le(m, I) {
        if (!(this instanceof le))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new h(I.headers), this.url = I.url || "", this._initBody(m);
      }
      P.call(le.prototype), le.prototype.clone = function() {
        return new le(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, le.error = function() {
        var m = new le(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var ne = [301, 302, 303, 307, 308];
      le.redirect = function(m, I) {
        if (ne.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new le(null, { status: I, headers: { location: m } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(I, N) {
          this.message = I, this.name = N;
          var _ = Error(I);
          this.stack = _.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function q(m, I) {
        return new Promise(function(N, _) {
          var W = new M(m, I);
          if (W.signal && W.signal.aborted)
            return _(new t.DOMException("Aborted", "AbortError"));
          var R = new XMLHttpRequest();
          function ue() {
            R.abort();
          }
          R.onload = function() {
            var L = {
              statusText: R.statusText,
              headers: Y(R.getAllResponseHeaders() || "")
            };
            W.url.indexOf("file://") === 0 && (R.status < 200 || R.status > 599) ? L.status = 200 : L.status = R.status, L.url = "responseURL" in R ? R.responseURL : L.headers.get("X-Request-URL");
            var j = "response" in R ? R.response : R.responseText;
            setTimeout(function() {
              N(new le(j, L));
            }, 0);
          }, R.onerror = function() {
            setTimeout(function() {
              _(new TypeError("Network request failed"));
            }, 0);
          }, R.ontimeout = function() {
            setTimeout(function() {
              _(new TypeError("Network request timed out"));
            }, 0);
          }, R.onabort = function() {
            setTimeout(function() {
              _(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function de(L) {
            try {
              return L === "" && n.location.href ? n.location.href : L;
            } catch {
              return L;
            }
          }
          if (R.open(W.method, de(W.url), !0), W.credentials === "include" ? R.withCredentials = !0 : W.credentials === "omit" && (R.withCredentials = !1), "responseType" in R && (r.blob ? R.responseType = "blob" : r.arrayBuffer && (R.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof h || n.Headers && I.headers instanceof n.Headers)) {
            var Oe = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(L) {
              Oe.push(a(L)), R.setRequestHeader(L, c(I.headers[L]));
            }), W.headers.forEach(function(L, j) {
              Oe.indexOf(j) === -1 && R.setRequestHeader(j, L);
            });
          } else
            W.headers.forEach(function(L, j) {
              R.setRequestHeader(j, L);
            });
          W.signal && (W.signal.addEventListener("abort", ue), R.onreadystatechange = function() {
            R.readyState === 4 && W.signal.removeEventListener("abort", ue);
          }), R.send(typeof W._bodyInit > "u" ? null : W._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = h, n.Request = M, n.Response = le), t.Headers = h, t.Request = M, t.Response = le, t.fetch = q, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Cn);
})();
const vb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Eb(e, t) {
  const n = {};
  return Object.assign(n, vb, t), await fetch(e, n);
}
function Ab(e) {
  let t = Eb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function kb(...e) {
  const { fetchLib: t, middlewares: n } = Ab(e);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (o = await Promise.resolve(c.pre({
        fetch: t,
        ...o
      })) ?? o);
    let a = await t(o.url, o.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var Ao;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ao || (Ao = {}));
var $i;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})($i || ($i = {}));
var Dh;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Dh || (Dh = {}));
const $b = "https://api.mainnet.hiro.so", Ib = "https://api.testnet.hiro.so", Lb = "http://localhost:3999", Cb = ["mainnet", "testnet", "devnet", "mocknet"];
let ko = class {
  constructor(t) {
    this.version = $i.Mainnet, this.chainId = Ao.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === $i.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? kb();
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
ko.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Fu();
    case "testnet":
      return new Tb();
    case "devnet":
      return new Bb();
    case "mocknet":
      return new Ng();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Cb.join(", ")}`);
  }
};
ko.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : ko.fromName(e);
let Fu = class extends ko {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? $b,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = $i.Mainnet, this.chainId = Ao.Mainnet;
  }
}, Tb = class extends ko {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Ib,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = $i.Testnet, this.chainId = Ao.Testnet;
  }
}, Ng = class extends ko {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Lb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = $i.Testnet, this.chainId = Ao.Testnet;
  }
};
const Bb = Ng, _g = "xtrata.wallet.bridge.v1", Mb = (e) => typeof e == "object" && e !== null && e.protocol === _g, Nb = (e) => Mb(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", _b = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class ea extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const Fh = 12e4;
class Pb {
  constructor(t) {
    Qo(this, "pending", /* @__PURE__ */ new Map());
    Qo(this, "listenTarget");
    Qo(this, "closed", !1);
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
    Qo(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !Nb(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new ea("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new ea("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ea("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = _b(), i = { protocol: _g, kind: "request", id: s, method: t, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ea(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? Fh}ms.`
          )
        );
      }, this.options.timeoutMs ?? Fh);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new ea("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Ub = ["SP", "SM"], Hb = ["ST", "SN"], Ob = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return Ub.includes(n) ? "mainnet" : Hb.includes(n) ? "testnet" : null;
}, Db = () => {
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
}, Fb = () => typeof window > "u" || !window.localStorage ? Db() : window.localStorage, tu = "xtrata.v15.1.wallet.session", jh = "mainnet", Dc = { isConnected: !1 }, jb = (e) => e.address ? Ob(e.address) ?? e.network : e.network, Pg = (e) => !e.isConnected || !e.address ? { ...Dc } : jb(e) !== jh ? { ...Dc } : {
  isConnected: !0,
  address: e.address,
  network: jh,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, Rb = (e) => {
  if (!e)
    return { ...Dc };
  try {
    const t = JSON.parse(e);
    return Pg(t);
  } catch {
    return { ...Dc };
  }
}, zb = (e) => {
  const t = Pg(e);
  return JSON.stringify(t);
}, Gb = (e) => {
  const t = Fb();
  return {
    load: () => Rb(t.getItem(tu)),
    save: (n) => {
      t.setItem(tu, zb(n));
    },
    clear: () => {
      t.removeItem(tu);
    }
  };
}, Kb = "https://browser.blockstack.org/auth", Vb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Ug = ["store_write"], Yb = "blockstack-session", Xb = {
  logLevel: "debug"
}, Ri = {
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
Object.freeze(Ri);
class Ro extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, s = this.stack;
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

${r}`, this.message = n, this.code = t.code, this.parameter = t.parameter ? t.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class qb extends Ro {
  constructor(t, n = "") {
    super({ code: Ri.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class Rh extends Ro {
  constructor(t = "") {
    super({ code: Ri.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Ka extends Ro {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: Ri.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class zh extends Ro {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: Ri.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class ju extends Ro {
  constructor(t) {
    super({ code: Ri.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class Hg extends Ro {
  constructor(t) {
    super({ code: Ri.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Gh = ["debug", "info", "warn", "error", "none"], Ru = {};
for (let e = 0; e < Gh.length; e++) {
  const t = Gh[e];
  Ru[t] = e;
}
class yo {
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
    return Ru[Xb.logLevel] <= Ru[t];
  }
}
function Wb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Zb() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function nu(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Jb() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Qb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function e1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function qd(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Qb(), s) {
      const i = s[e];
      if (i)
        return i;
    }
  } catch (i) {
    yo.error(`Error getting object '${e}' from global scope '${s}': ${i}`);
  }
  if (t) {
    const i = e1(s, e.toString(), n);
    throw yo.error(i), new Error(i);
  }
  if (r)
    return {};
}
function ti(e, t) {
  return Wd(vn(e), t);
}
function vn(e) {
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
  if (On(e, Uint8Array))
    return BigInt(`0x${Te(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function t1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Kh(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Ba(e, t = 8) {
  return (typeof e == "bigint" ? e : vn(e)).toString(16).padStart(t * 2, "0");
}
function ml(e) {
  return parseInt(e, 16);
}
function Wd(e, t = 16) {
  const n = Ba(e, t);
  return ct(n);
}
function n1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function r1(e, t) {
  return e & BigInt(1) << t;
}
function zu(e) {
  return s1(BigInt(`0x${Te(e)}`), BigInt(e.byteLength * 8));
}
function s1(e, t) {
  return r1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const i1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Te(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += i1[n];
  return t;
}
function ct(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = t1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    t[n] = i;
  }
  return t;
}
function zi(e) {
  return new TextEncoder().encode(e);
}
function Ma(e) {
  return new TextDecoder().decode(e);
}
function o1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function a1(e) {
  return String.fromCharCode.apply(null, e);
}
function c1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Vh(e) {
  if (e.some(c1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Vr(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Vt(e) {
  return Vr(...e.map((t) => typeof t == "number" ? Vh([t]) : t instanceof Array ? Vh(t) : t));
}
function On(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Og = "https://api.mainnet.hiro.so", Dg = "https://api.testnet.hiro.so", Fg = "http://localhost:3999", l1 = "https://hub.blockstack.org", u1 = 33, ru = 32;
function d1(e) {
  if (e.length < ru * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + ru * 2), r = e.slice(2 + ru * 2);
  return {
    recoveryId: ml(t),
    r: n,
    s: r
  };
}
function Zd(e) {
  const t = typeof e == "string" ? ct(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function f1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function h1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function p1(e, t) {
  return e[t];
}
function g1(e, t, n = 0) {
  return e[n] = t, e;
}
function y1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Ii(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const w1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function m1(e, t) {
  const n = {};
  return Object.assign(n, w1, t), await fetch(e, n);
}
function b1(e) {
  let t = m1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function x1(...e) {
  const { fetchLib: t, middlewares: n } = b1(e);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (o = await Promise.resolve(c.pre({
        fetch: t,
        ...o
      })) ?? o);
    let a = await t(o.url, o.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class jg {
  constructor(t = Ug.slice(), n = ((a) => (a = qd("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Kb) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Gu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function S1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Rg(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function v1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Gu(e.outputLen), Gu(e.blockLen);
}
function E1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function A1(e, t) {
  Rg(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const wi = {
  number: Gu,
  bool: S1,
  bytes: Rg,
  hash: v1,
  exists: E1,
  output: A1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const su = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Pr = (e, t) => e << 32 - t | e >>> t, k1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!k1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function $1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Jd(e) {
  if (typeof e == "string" && (e = $1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let zg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Gi(e) {
  const t = (r) => e().update(Jd(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Gg = class extends zg {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, wi.hash(t);
    const r = Jd(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return wi.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    wi.exists(this), wi.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const bl = (e, t, n) => new Gg(e, t).update(n).digest();
bl.create = (e, t) => new Gg(e, t);
function I1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
let Qd = class extends zg {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = su(this.buffer);
  }
  update(t) {
    wi.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Jd(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = su(t);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    wi.exists(this), wi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    I1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = su(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, h[u], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const L1 = (e, t, n) => e & t ^ ~e & n, C1 = (e, t, n) => e & t ^ e & n ^ t & n, T1 = new Uint32Array([
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
]), Es = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), As = new Uint32Array(64);
let Kg = class extends Qd {
  constructor() {
    super(64, 32, 8, !1), this.A = Es[0] | 0, this.B = Es[1] | 0, this.C = Es[2] | 0, this.D = Es[3] | 0, this.E = Es[4] | 0, this.F = Es[5] | 0, this.G = Es[6] | 0, this.H = Es[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [t, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let u = 0; u < 16; u++, n += 4)
      As[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = As[u - 15], y = As[u - 2], S = Pr(w, 7) ^ Pr(w, 18) ^ w >>> 3, v = Pr(y, 17) ^ Pr(y, 19) ^ y >>> 10;
      As[u] = v + As[u - 7] + S + As[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Pr(a, 6) ^ Pr(a, 11) ^ Pr(a, 25), y = h + w + L1(a, c, d) + T1[u] + As[u] | 0, v = (Pr(r, 2) ^ Pr(r, 13) ^ Pr(r, 22)) + C1(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    As.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, B1 = class extends Kg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const $o = Gi(() => new Kg());
Gi(() => new B1());
const M1 = {}, Vg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: M1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const ot = BigInt(0), Mt = BigInt(1), Ws = BigInt(2), da = BigInt(3), Yh = BigInt(8), vt = Object.freeze({
  a: ot,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Mt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Xh = (e, t) => (e + t / Ws) / t, Va = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = vt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Mt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Xh(i * e, t), c = Xh(-r * e, t);
    let d = ge(e - a * n - c * s, t), h = ge(-a * r - c * i, t);
    const u = d > o, w = h > o;
    if (u && (d = t - d), w && (h = t - h), d > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: u, k1: d, k2neg: w, k2: h };
  }
}, Cr = 32, Li = 32, Yg = 32, Fc = Cr + 1, jc = 2 * Cr + 1;
function qh(e) {
  const { a: t, b: n } = vt, r = ge(e * e), s = ge(r * e);
  return ge(s + t * e + n);
}
const Ya = vt.a === ot;
class ef extends Error {
  constructor(t) {
    super(t);
  }
}
function Wh(e) {
  if (!(e instanceof dt))
    throw new TypeError("JacobianPoint expected");
}
class dt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof Je))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(Je.ZERO) ? dt.ZERO : new dt(t.x, t.y, Mt);
  }
  static toAffineBatch(t) {
    const n = H1(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return dt.toAffineBatch(t).map(dt.fromAffine);
  }
  equals(t) {
    Wh(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = t, c = ge(s * s), d = ge(a * a), h = ge(n * d), u = ge(i * c), w = ge(ge(r * a) * d), y = ge(ge(o * s) * c);
    return h === u && w === y;
  }
  negate() {
    return new dt(this.x, ge(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = ge(t * t), i = ge(n * n), o = ge(i * i), a = t + i, c = ge(Ws * (ge(a * a) - s - o)), d = ge(da * s), h = ge(d * d), u = ge(h - Ws * c), w = ge(d * (c - u) - Yh * o), y = ge(Ws * n * r);
    return new dt(u, w, y);
  }
  add(t) {
    Wh(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = t;
    if (i === ot || o === ot)
      return this;
    if (n === ot || r === ot)
      return t;
    const c = ge(s * s), d = ge(a * a), h = ge(n * d), u = ge(i * c), w = ge(ge(r * a) * d), y = ge(ge(o * s) * c), S = ge(u - h), v = ge(y - w);
    if (S === ot)
      return v === ot ? this.double() : dt.ZERO;
    const C = ge(S * S), P = ge(S * C), H = ge(h * C), k = ge(v * v - P - Ws * H), M = ge(v * (H - k) - w * P), U = ge(s * a * S);
    return new dt(k, M, U);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = dt.ZERO;
    if (typeof t == "bigint" && t === ot)
      return n;
    let r = Qh(t);
    if (r === Mt)
      return this;
    if (!Ya) {
      let u = n, w = this;
      for (; r > ot; )
        r & Mt && (u = u.add(w)), w = w.double(), r >>= Mt;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Va.splitScalar(r), c = n, d = n, h = this;
    for (; i > ot || a > ot; )
      i & Mt && (c = c.add(h)), a & Mt && (d = d.add(h)), h = h.double(), i >>= Mt, a >>= Mt;
    return s && (c = c.negate()), o && (d = d.negate()), d = new dt(ge(d.x * Va.beta), d.y, d.z), c.add(d);
  }
  precomputeWindow(t) {
    const n = Ya ? 128 / t + 1 : 256 / t + 1, r = [];
    let s = this, i = s;
    for (let o = 0; o < n; o++) {
      i = s, r.push(i);
      for (let a = 1; a < 2 ** (t - 1); a++)
        i = i.add(s), r.push(i);
      s = i.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(dt.BASE) && (n = Je.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ku.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = dt.normalizeZ(s), Ku.set(n, s)));
    let i = dt.ZERO, o = dt.BASE;
    const a = 1 + (Ya ? 128 / r : 256 / r), c = 2 ** (r - 1), d = BigInt(2 ** r - 1), h = 2 ** r, u = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let S = Number(t & d);
      t >>= u, S > c && (S -= h, t += Mt);
      const v = y, C = y + Math.abs(S) - 1, P = w % 2 !== 0, H = S < 0;
      S === 0 ? o = o.add(Xa(P, s[v])) : i = i.add(Xa(H, s[C]));
    }
    return { p: i, f: o };
  }
  multiply(t, n) {
    let r = Qh(t), s, i;
    if (Ya) {
      const { k1neg: o, k1: a, k2neg: c, k2: d } = Va.splitScalar(r);
      let { p: h, f: u } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(d, n);
      h = Xa(o, h), w = Xa(c, w), w = new dt(ge(w.x * Va.beta), w.y, w.z), s = h.add(w), i = u.add(y);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return dt.normalizeZ([s, i])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, i = this.equals(dt.ZERO);
    t == null && (t = i ? Yh : zo(s));
    const o = t, a = ge(o * o), c = ge(a * o), d = ge(n * a), h = ge(r * c), u = ge(s * o);
    if (i)
      return Je.ZERO;
    if (u !== Mt)
      throw new Error("invZ was invalid");
    return new Je(d, h);
  }
}
dt.BASE = new dt(vt.Gx, vt.Gy, Mt);
dt.ZERO = new dt(ot, Mt, ot);
function Xa(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Ku = /* @__PURE__ */ new WeakMap();
class Je {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Ku.delete(this);
  }
  hasEvenY() {
    return this.y % Ws === ot;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = Jn(n ? t : t.subarray(1));
    if (!Lc(r))
      throw new Error("Point is not on curve");
    const s = qh(r);
    let i = U1(s);
    const o = (i & Mt) === Mt;
    n ? o && (i = ge(-i)) : (t[0] & 1) === 1 !== o && (i = ge(-i));
    const a = new Je(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = Jn(t.subarray(1, Cr + 1)), r = Jn(t.subarray(Cr + 1, Cr * 2 + 1)), s = new Je(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = Yr(t), r = n.length, s = n[0];
    if (r === Cr)
      return this.fromCompressedHex(n);
    if (r === Fc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === jc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Fc} compressed bytes or ${jc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return Je.BASE.multiply(Ci(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: i } = Wg(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = tf(Yr(t)), { n: a } = vt, c = r === 2 || r === 3 ? s + a : s, d = zo(c, a), h = ge(-o * d, a), u = ge(i * d, a), w = r & 1 ? "03" : "02", y = Je.fromHex(w + Zs(c)), S = Je.BASE.multiplyAndAddUnsafe(y, h, u);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(t = !1) {
    return Js(this.toHex(t));
  }
  toHex(t = !1) {
    const n = Zs(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Zs(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Lc(n) || !Lc(r))
      throw new Error(t);
    const s = ge(r * r), i = qh(n);
    if (ge(s - i) !== ot)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new Je(this.x, ge(-this.y));
  }
  double() {
    return dt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return dt.fromAffine(this).add(dt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return dt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = dt.fromAffine(this), i = n === ot || n === Mt || this !== Je.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = dt.fromAffine(t).multiplyUnsafe(r), a = i.add(o);
    return a.equals(dt.ZERO) ? void 0 : a.toAffine();
  }
}
Je.BASE = new Je(vt.Gx, vt.Gy);
Je.ZERO = new Je(ot, ot);
function Zh(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Jh(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Io(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Jn(n), left: e.subarray(t + 2) };
}
function N1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Io(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Jh(e.subarray(2)), { data: r, left: s } = Jh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Io(s)}`);
  return { r: t, s: r };
}
class Zn {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Io(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Zn(Rc(s.slice(0, 64)), Rc(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = N1(n ? t : Js(t));
    return new Zn(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Co(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Co(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = vt.n >> Mt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new Zn(this.r, ge(-this.s, vt.n)) : this;
  }
  toDERRawBytes() {
    return Js(this.toDERHex());
  }
  toDERHex() {
    const t = Zh(ta(this.s)), n = Zh(ta(this.r)), r = t.length / 2, s = n.length / 2, i = ta(r), o = ta(s);
    return `30${ta(s + r + 4)}02${o}${n}02${i}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Js(this.toCompactHex());
  }
  toCompactHex() {
    return Zs(this.r) + Zs(this.s);
  }
}
function Xs(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
const _1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Io(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += _1[e[n]];
  return t;
}
const P1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Zs(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(ot <= e && e < P1))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Lo(e) {
  const t = Js(Zs(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function ta(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function Rc(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Js(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    t[n] = i;
  }
  return t;
}
function Jn(e) {
  return Rc(Io(e));
}
function Yr(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Js(e);
}
function Qh(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Co(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ge(e, t = vt.P) {
  const n = e % t;
  return n >= ot ? n : t + n;
}
function sr(e, t) {
  const { P: n } = vt;
  let r = e;
  for (; t-- > ot; )
    r *= r, r %= n;
  return r;
}
function U1(e) {
  const { P: t } = vt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = e * e * e % t, d = c * c * e % t, h = sr(d, da) * d % t, u = sr(h, da) * d % t, w = sr(u, Ws) * c % t, y = sr(w, r) * w % t, S = sr(y, s) * y % t, v = sr(S, o) * S % t, C = sr(v, a) * v % t, P = sr(C, o) * S % t, H = sr(P, da) * d % t, k = sr(H, i) * y % t, M = sr(k, n) * c % t, U = sr(M, Ws);
  if (U * U % t !== e)
    throw new Error("Cannot find square root");
  return U;
}
function zo(e, t = vt.P) {
  if (e === ot || t <= ot)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ge(e, t), r = t, s = ot, i = Mt;
  for (; n !== ot; ) {
    const a = r / n, c = r % n, d = s - i * a;
    r = n, n = c, s = i, i = d;
  }
  if (r !== Mt)
    throw new Error("invert: does not exist");
  return ge(s, t);
}
function H1(e, t = vt.P) {
  const n = new Array(e.length), r = e.reduce((i, o, a) => o === ot ? i : (n[a] = i, ge(i * o, t)), Mt), s = zo(r, t);
  return e.reduceRight((i, o, a) => o === ot ? i : (n[a] = ge(i * n[a], t), ge(i * o, t)), s), n;
}
function O1(e) {
  const t = e.length * 8 - Li * 8, n = Jn(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function tf(e, t = !1) {
  const n = O1(e);
  if (t)
    return n;
  const { n: r } = vt;
  return n >= r ? n - r : n;
}
let vo, fa;
class Xg {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return Ft.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return fa(this.k, ...t);
  }
  checkSync() {
    if (typeof fa != "function")
      throw new ef("hmacSha256Sync needs to be set");
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
    return Xs(...n);
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
    return Xs(...n);
  }
}
function Co(e) {
  return ot < e && e < vt.n;
}
function Lc(e) {
  return ot < e && e < vt.P;
}
function qg(e, t, n, r = !0) {
  const { n: s } = vt, i = tf(e, !0);
  if (!Co(i))
    return;
  const o = zo(i, s), a = Je.BASE.multiply(i), c = ge(a.x, s);
  if (c === ot)
    return;
  const d = ge(o * ge(t + n * c, s), s);
  if (d === ot)
    return;
  let h = new Zn(c, d), u = (a.x === h.r ? 0 : 2) | Number(a.y & Mt);
  return r && h.hasHighS() && (h = h.normalizeS(), u ^= 1), { sig: h, recovery: u };
}
function Ci(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Li)
      throw new Error("Expected 32 bytes of private key");
    t = Rc(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Li)
      throw new Error("Expected 32 bytes of private key");
    t = Jn(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Co(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function nf(e) {
  return e instanceof Je ? (e.assertValidity(), e) : Je.fromHex(e);
}
function Wg(e) {
  if (e instanceof Zn)
    return e.assertValidity(), e;
  try {
    return Zn.fromDER(e);
  } catch {
    return Zn.fromCompact(e);
  }
}
function Na(e, t = !1) {
  return Je.fromPrivateKey(e).toRawBytes(t);
}
function D1(e, t, n, r = !1) {
  return Je.fromSignature(e, t, n).toRawBytes(r);
}
function ep(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Fc || r === jc : n ? r === Fc * 2 || r === jc * 2 : e instanceof Je;
}
function rf(e, t, n = !1) {
  if (ep(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!ep(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = nf(t);
  return r.assertValidity(), r.multiply(Ci(e)).toRawBytes(n);
}
function Zg(e) {
  const t = e.length > Cr ? e.slice(0, Cr) : e;
  return Jn(t);
}
function F1(e) {
  const t = Zg(e), n = ge(t, vt.n);
  return Jg(n < ot ? t : n);
}
function Jg(e) {
  return Lo(e);
}
function Qg(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = Yr(e), s = Ci(t), i = [Jg(s), F1(r)];
  if (n != null) {
    n === !0 && (n = Ft.randomBytes(Cr));
    const c = Yr(n);
    if (c.length !== Cr)
      throw new Error(`sign: Expected ${Cr} bytes of extra data`);
    i.push(c);
  }
  const o = Xs(...i), a = Zg(r);
  return { seed: o, m: a, d: s };
}
function ey(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, t), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function j1(e, t, n = {}) {
  const { seed: r, m: s, d: i } = Qg(e, t, n.extraEntropy), o = new Xg(Yg, Li);
  await o.reseed(r);
  let a;
  for (; !(a = qg(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return ey(a, n);
}
function xl(e, t, n = {}) {
  const { seed: r, m: s, d: i } = Qg(e, t, n.extraEntropy), o = new Xg(Yg, Li);
  o.reseedSync(r);
  let a;
  for (; !(a = qg(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return ey(a, n);
}
const R1 = { strict: !0 };
function z1(e, t, n, r = R1) {
  let s;
  try {
    s = Wg(e), t = Yr(t);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = tf(t);
  let c;
  try {
    c = nf(n);
  } catch {
    return !1;
  }
  const { n: d } = vt, h = zo(o, d), u = ge(a * h, d), w = ge(i * h, d), y = Je.BASE.multiplyAndAddUnsafe(c, u, w);
  return y ? ge(y.x, d) === i : !1;
}
function zc(e) {
  return ge(Jn(e), vt.n);
}
class To {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = Yr(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Jn(n.subarray(0, 32)), s = Jn(n.subarray(32, 64));
    return new To(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Lc(t) || !Co(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Zs(this.r) + Zs(this.s);
  }
  toRawBytes() {
    return Js(this.toHex());
  }
}
function G1(e) {
  return Je.fromPrivateKey(e).toRawX();
}
class ty {
  constructor(t, n, r = Ft.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = Yr(t);
    const { x: s, scalar: i } = this.getScalar(Ci(n));
    if (this.px = s, this.d = i, this.rand = Yr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = Je.fromPrivateKey(t), r = n.hasEvenY() ? t : vt.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Lo(t ^ Jn(n));
  }
  finalizeNonce(t) {
    const n = ge(Jn(t), vt.n);
    if (n === ot)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(t, n, r, s) {
    return new To(t.x, ge(n + r * s, vt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, i = Ft.taggedHash, o = this.initNonce(n, await i(Ys.aux, s)), { R: a, rx: c, k: d } = this.finalizeNonce(await i(Ys.nonce, o, r, t)), h = zc(await i(Ys.challenge, c, r, t)), u = this.finalizeSig(a, d, h, n);
    return await sy(u, t, r) || this.error(), u;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, i = Ft.taggedHashSync, o = this.initNonce(n, i(Ys.aux, s)), { R: a, rx: c, k: d } = this.finalizeNonce(i(Ys.nonce, o, r, t)), h = zc(i(Ys.challenge, c, r, t)), u = this.finalizeSig(a, d, h, n);
    return iy(u, t, r) || this.error(), u;
  }
}
async function K1(e, t, n) {
  return new ty(e, t, n).calc();
}
function V1(e, t, n) {
  return new ty(e, t, n).calcSync();
}
function ny(e, t, n) {
  const r = e instanceof To, s = r ? e : To.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: Yr(t),
    P: nf(n)
  };
}
function ry(e, t, n, r) {
  const s = Je.BASE.multiplyAndAddUnsafe(t, Ci(n), ge(-r, vt.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function sy(e, t, n) {
  try {
    const { r, s, m: i, P: o } = ny(e, t, n), a = zc(await Ft.taggedHash(Ys.challenge, Lo(r), o.toRawX(), i));
    return ry(r, o, s, a);
  } catch {
    return !1;
  }
}
function iy(e, t, n) {
  try {
    const { r, s, m: i, P: o } = ny(e, t, n), a = zc(Ft.taggedHashSync(Ys.challenge, Lo(r), o.toRawX(), i));
    return ry(r, o, s, a);
  } catch (r) {
    if (r instanceof ef)
      throw r;
    return !1;
  }
}
const Y1 = {
  Signature: To,
  getPublicKey: G1,
  sign: K1,
  verify: sy,
  signSync: V1,
  verifySync: iy
};
Je.BASE._setWindowSize(8);
const Kn = {
  node: Vg,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ys = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, qa = {}, Ft = {
  bytesToHex: Io,
  hexToBytes: Js,
  concatBytes: Xs,
  mod: ge,
  invert: zo,
  isValidPrivateKey(e) {
    try {
      return Ci(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Lo,
  _normalizePrivateKey: Ci,
  hashToPrivateKey: (e) => {
    e = Yr(e);
    const t = Li + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ge(Jn(e), vt.n - Mt) + Mt;
    return Lo(n);
  },
  randomBytes: (e = 32) => {
    if (Kn.web)
      return Kn.web.getRandomValues(new Uint8Array(e));
    if (Kn.node) {
      const { randomBytes: t } = Kn.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ft.hashToPrivateKey(Ft.randomBytes(Li + 8)),
  precompute(e = 8, t = Je.BASE) {
    const n = t === Je.BASE ? t : new Je(t.x, t.y);
    return n._setWindowSize(e), n.multiply(da), n;
  },
  sha256: async (...e) => {
    if (Kn.web) {
      const t = await Kn.web.subtle.digest("SHA-256", Xs(...e));
      return new Uint8Array(t);
    } else if (Kn.node) {
      const { createHash: t } = Kn.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (Kn.web) {
      const n = await Kn.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Xs(...t), s = await Kn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Kn.node) {
      const { createHmac: n } = Kn.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = qa[e];
    if (n === void 0) {
      const r = await Ft.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Xs(r, r), qa[e] = n;
    }
    return Ft.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof vo != "function")
      throw new ef("sha256Sync is undefined, you need to set it");
    let n = qa[e];
    if (n === void 0) {
      const r = vo(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Xs(r, r), qa[e] = n;
    }
    return vo(n, ...t);
  },
  _JacobianPoint: dt
};
Object.defineProperties(Ft, {
  sha256Sync: {
    configurable: !1,
    get() {
      return vo;
    },
    set(e) {
      vo || (vo = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return fa;
    },
    set(e) {
      fa || (fa = e);
    }
  }
});
const X1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: vt,
  Point: Je,
  Signature: Zn,
  getPublicKey: Na,
  getSharedSecret: rf,
  recoverPublicKey: D1,
  schnorr: Y1,
  sign: j1,
  signSync: xl,
  utils: Ft,
  verify: z1
}, Symbol.toStringTag, { value: "Module" }));
var _a = {};
_a.byteLength = Q1;
var q1 = _a.toByteArray = t2, W1 = _a.fromByteArray = s2, Fr = [], cr = [], Z1 = typeof Uint8Array < "u" ? Uint8Array : Array, iu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ao = 0, J1 = iu.length; ao < J1; ++ao)
  Fr[ao] = iu[ao], cr[iu.charCodeAt(ao)] = ao;
cr[45] = 62;
cr[95] = 63;
function oy(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function Q1(e) {
  var t = oy(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function e2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function t2(e) {
  var t, n = oy(e), r = n[0], s = n[1], i = new Z1(e2(e, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = cr[e.charCodeAt(c)] << 18 | cr[e.charCodeAt(c + 1)] << 12 | cr[e.charCodeAt(c + 2)] << 6 | cr[e.charCodeAt(c + 3)], i[o++] = t >> 16 & 255, i[o++] = t >> 8 & 255, i[o++] = t & 255;
  return s === 2 && (t = cr[e.charCodeAt(c)] << 2 | cr[e.charCodeAt(c + 1)] >> 4, i[o++] = t & 255), s === 1 && (t = cr[e.charCodeAt(c)] << 10 | cr[e.charCodeAt(c + 1)] << 4 | cr[e.charCodeAt(c + 2)] >> 2, i[o++] = t >> 8 & 255, i[o++] = t & 255), i;
}
function n2(e) {
  return Fr[e >> 18 & 63] + Fr[e >> 12 & 63] + Fr[e >> 6 & 63] + Fr[e & 63];
}
function r2(e, t, n) {
  for (var r, s = [], i = t; i < n; i += 3)
    r = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255), s.push(n2(r));
  return s.join("");
}
function s2(e) {
  for (var t, n = e.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(r2(e, o, o + i > a ? a : o + i));
  return r === 1 ? (t = e[n - 1], s.push(
    Fr[t >> 2] + Fr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    Fr[t >> 10] + Fr[t >> 4 & 63] + Fr[t << 2 & 63] + "="
  )), s.join("");
}
function i2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const o2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function a2() {
  if (i2())
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
    throw new Error(o2);
  }
}
class c2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createCipher(t, n, r), o = new Uint8Array(Vr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createDecipher(t, n, r), o = new Uint8Array(Vr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class l2 {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, s) {
    let i, o;
    if (t === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (t === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: i, iv: r }, a, s);
    return new Uint8Array(c);
  }
  async decrypt(t, n, r, s) {
    let i, o;
    if (t === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (t === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: i, iv: r }, a, s);
    return new Uint8Array(c);
  }
}
async function ay() {
  const e = await a2();
  return e.name === "subtleCrypto" ? new l2(e.lib) : new c2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function u2(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var s = e.charAt(r), i = s.charCodeAt(0);
    if (t[i] !== 255)
      throw new TypeError(s + " is ambiguous");
    t[i] = r;
  }
  var o = e.length, a = e.charAt(0), c = Math.log(o) / Math.log(256), d = Math.log(256) / Math.log(o);
  function h(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var S = 0, v = 0, C = 0, P = y.length; C !== P && y[C] === 0; )
      C++, S++;
    for (var H = (P - C) * d + 1 >>> 0, k = new Uint8Array(H); C !== P; ) {
      for (var M = y[C], U = 0, Y = H - 1; (M !== 0 || U < v) && Y !== -1; Y--, U++)
        M += 256 * k[Y] >>> 0, k[Y] = M % o >>> 0, M = M / o >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      v = U, C++;
    }
    for (var le = H - v; le !== H && k[le] === 0; )
      le++;
    for (var ne = a.repeat(S); le < H; ++le)
      ne += e.charAt(k[le]);
    return ne;
  }
  function u(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var S = 0, v = 0, C = 0; y[S] === a; )
      v++, S++;
    for (var P = (y.length - S) * c + 1 >>> 0, H = new Uint8Array(P); y[S]; ) {
      var k = y.charCodeAt(S);
      if (k > 255)
        return;
      var M = t[k];
      if (M === 255)
        return;
      for (var U = 0, Y = P - 1; (M !== 0 || U < C) && Y !== -1; Y--, U++)
        M += o * H[Y] >>> 0, H[Y] = M % 256 >>> 0, M = M / 256 >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      C = U, S++;
    }
    for (var le = P - C; le !== P && H[le] === 0; )
      le++;
    for (var ne = new Uint8Array(v + (P - le)), q = v; le !== P; )
      ne[q++] = H[le++];
    return ne;
  }
  function w(y) {
    var S = u(y);
    if (S)
      return S;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: h,
    decodeUnsafe: u,
    decode: w
  };
}
var cy = u2;
const d2 = cy, f2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var h2 = d2(f2);
const p2 = /* @__PURE__ */ Mg(h2), g2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ly = Uint8Array.from({ length: 16 }, (e, t) => t), y2 = ly.map((e) => (9 * e + 5) % 16);
let sf = [ly], of = [y2];
for (let e = 0; e < 4; e++)
  for (let t of [sf, of])
    t.push(t[e].map((n) => g2[n]));
const uy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), w2 = sf.map((e, t) => e.map((n) => uy[t][n])), m2 = of.map((e, t) => e.map((n) => uy[t][n])), b2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), x2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wa = (e, t) => e << t | e >>> 32 - t;
function tp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Za = new Uint32Array(16);
let S2 = class extends Qd {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Za[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, d = this.h3 | 0, h = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = b2[y], C = x2[y], P = sf[y], H = of[y], k = w2[y], M = m2[y];
      for (let U = 0; U < 16; U++) {
        const Y = Wa(r + tp(y, i, a, d) + Za[P[U]] + v, k[U]) + u | 0;
        r = u, u = d, d = Wa(a, 10) | 0, a = i, i = Y;
      }
      for (let U = 0; U < 16; U++) {
        const Y = Wa(s + tp(S, o, c, h) + Za[H[U]] + C, M[U]) + w | 0;
        s = w, w = h, h = Wa(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Za.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const v2 = Gi(() => new S2());
function E2(e) {
  return v2(e);
}
const Ja = BigInt(2 ** 32 - 1), Vu = BigInt(32);
function dy(e, t = !1) {
  return t ? { h: Number(e & Ja), l: Number(e >> Vu & Ja) } : { h: Number(e >> Vu & Ja) | 0, l: Number(e & Ja) | 0 };
}
function A2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = dy(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const k2 = (e, t) => BigInt(e >>> 0) << Vu | BigInt(t >>> 0), $2 = (e, t, n) => e >>> n, I2 = (e, t, n) => e << 32 - n | t >>> n, L2 = (e, t, n) => e >>> n | t << 32 - n, C2 = (e, t, n) => e << 32 - n | t >>> n, T2 = (e, t, n) => e << 64 - n | t >>> n - 32, B2 = (e, t, n) => e >>> n - 32 | t << 64 - n, M2 = (e, t) => t, N2 = (e, t) => e, _2 = (e, t, n) => e << n | t >>> 32 - n, P2 = (e, t, n) => t << n | e >>> 32 - n, U2 = (e, t, n) => t << n - 32 | e >>> 64 - n, H2 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function O2(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const D2 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), F2 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, j2 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), R2 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, z2 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), G2 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ke = {
  fromBig: dy,
  split: A2,
  toBig: k2,
  shrSH: $2,
  shrSL: I2,
  rotrSH: L2,
  rotrSL: C2,
  rotrBH: T2,
  rotrBL: B2,
  rotr32H: M2,
  rotr32L: N2,
  rotlSH: _2,
  rotlSL: P2,
  rotlBH: U2,
  rotlBL: H2,
  add: O2,
  add3L: D2,
  add3H: F2,
  add4L: j2,
  add4H: R2,
  add5H: G2,
  add5L: z2
}, [K2, V2] = Ke.split([
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
].map((e) => BigInt(e))), ks = new Uint32Array(80), $s = new Uint32Array(80);
let Sl = class extends Qd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: C } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let k = 0; k < 16; k++, n += 4)
      ks[k] = t.getUint32(n), $s[k] = t.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const M = ks[k - 15] | 0, U = $s[k - 15] | 0, Y = Ke.rotrSH(M, U, 1) ^ Ke.rotrSH(M, U, 8) ^ Ke.shrSH(M, U, 7), le = Ke.rotrSL(M, U, 1) ^ Ke.rotrSL(M, U, 8) ^ Ke.shrSL(M, U, 7), ne = ks[k - 2] | 0, q = $s[k - 2] | 0, m = Ke.rotrSH(ne, q, 19) ^ Ke.rotrBH(ne, q, 61) ^ Ke.shrSH(ne, q, 6), I = Ke.rotrSL(ne, q, 19) ^ Ke.rotrBL(ne, q, 61) ^ Ke.shrSL(ne, q, 6), N = Ke.add4L(le, I, $s[k - 7], $s[k - 16]), _ = Ke.add4H(N, Y, m, ks[k - 7], ks[k - 16]);
      ks[k] = _ | 0, $s[k] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: C, Hh: P, Hl: H } = this;
    for (let k = 0; k < 80; k++) {
      const M = Ke.rotrSH(u, w, 14) ^ Ke.rotrSH(u, w, 18) ^ Ke.rotrBH(u, w, 41), U = Ke.rotrSL(u, w, 14) ^ Ke.rotrSL(u, w, 18) ^ Ke.rotrBL(u, w, 41), Y = u & y ^ ~u & v, le = w & S ^ ~w & C, ne = Ke.add5L(H, U, le, V2[k], $s[k]), q = Ke.add5H(ne, P, M, Y, K2[k], ks[k]), m = ne | 0, I = Ke.rotrSH(r, s, 28) ^ Ke.rotrBH(r, s, 34) ^ Ke.rotrBH(r, s, 39), N = Ke.rotrSL(r, s, 28) ^ Ke.rotrBL(r, s, 34) ^ Ke.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = C | 0, v = y | 0, C = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Ke.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = Ke.add3L(m, N, W);
      r = Ke.add3H(R, q, I, _), s = R | 0;
    }
    ({ h: r, l: s } = Ke.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ke.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ke.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = Ke.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = Ke.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Ke.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: C } = Ke.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: P, l: H } = Ke.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, C, P, H);
  }
  roundClean() {
    ks.fill(0), $s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Y2 = class extends Sl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X2 = class extends Sl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, q2 = class extends Sl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const W2 = Gi(() => new Sl());
Gi(() => new Y2());
Gi(() => new X2());
Gi(() => new q2());
function fy(e) {
  return $o(e);
}
function Z2(e) {
  return W2(e);
}
const J2 = 0;
Ft.hmacSha256Sync = (e, ...t) => {
  const n = bl.create($o, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Q2() {
  return Te(Ft.randomPrivateKey());
}
function ex(e) {
  const t = $o($o(e));
  return p2.encode(Vr(e, t).slice(0, e.length + 4));
}
function tx(e, t) {
  return ex(Vr(new Uint8Array([e]), t.slice(0, 20)));
}
function hy(e, t = J2) {
  const n = typeof e == "string" ? ct(e) : e, r = E2(fy(n));
  return tx(t, r);
}
function py(e) {
  const t = Zd(e);
  return Te(Na(t.slice(0, 32), !0));
}
Ft.hmacSha256Sync = (e, ...t) => {
  const n = bl.create($o, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var Gc;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(Gc || (Gc = {}));
async function nx(e, t, n) {
  return await (await ay()).encrypt("aes-256-cbc", t, e, n);
}
async function rx(e, t, n) {
  return await (await ay()).decrypt("aes-256-cbc", t, e, n);
}
function gy(e, t) {
  return bl($o, e, t);
}
function sx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function yy(e) {
  const t = Z2(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function ix(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function ox(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Gc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Gc.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !ix(e))
    return t;
  try {
    return Je.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function ax(e, t, n, r) {
  const s = ox(e);
  if (!s.result)
    throw s;
  const i = Ft.randomPrivateKey(), o = Na(i, !0);
  let a = rf(i, e, !0);
  a = a.slice(1);
  const c = yy(a), d = Ft.randomBytes(16), h = await nx(d, c.encryptionKey, t), u = Vr(d, o, h), w = gy(c.hmacKey, u);
  let y;
  if (!r || r === "hex")
    y = Te(h);
  else if (r === "base64")
    y = W1(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: Te(d),
    ephemeralPK: Te(o),
    cipherText: y,
    mac: Te(w),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function wy(e, t) {
  if (!t.ephemeralPK)
    throw new zh("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = rf(e, n, !0);
  r = r.slice(1);
  const s = yy(r), i = ct(t.iv);
  let o;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    o = ct(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    o = q1(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = Vr(i, ct(n), o), c = gy(s.hmacKey, a), d = ct(t.mac);
  if (!sx(d, c))
    throw new zh("Decryption failed: failure in MAC check");
  const h = await rx(i, s.encryptionKey, o);
  return t.wasString ? Ma(h) : h;
}
function cx(e, t) {
  const n = typeof t == "string" ? zi(t) : t, r = py(e), s = fy(n), i = xl(s, e);
  return {
    signature: Te(i),
    publicKey: r
  };
}
async function lx(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = py(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", i = typeof e == "string" ? zi(e) : e, o = await ax(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = cx(r, a), d = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(d);
  }
  return a;
}
function ux(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return wy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var hn = {}, Bo = {}, In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
In.decode = In.encode = In.unescape = In.escape = In.pad = void 0;
const my = _a;
function af(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
In.pad = af;
function by(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
In.escape = by;
function xy(e) {
  return af(e).replace(/-/g, "+").replace(/_/g, "/");
}
In.unescape = xy;
function dx(e) {
  return by((0, my.fromByteArray)(new TextEncoder().encode(e)));
}
In.encode = dx;
function fx(e) {
  return new TextDecoder().decode((0, my.toByteArray)(af(xy(e))));
}
In.decode = fx;
var vl = {}, El = {}, Sy = {}, vy = {}, Al = {};
Object.defineProperty(Al, "__esModule", { value: !0 });
Al.crypto = void 0;
Al.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = i, e.aexists = o, e.aoutput = a, e.u8 = c, e.u32 = d, e.clean = h, e.createView = u, e.rotr = w, e.rotl = y, e.byteSwap = S, e.byteSwap32 = v, e.bytesToHex = H, e.hexToBytes = U, e.asyncLoop = le, e.utf8ToBytes = ne, e.bytesToUtf8 = q, e.toBytes = m, e.kdfInputToBytes = I, e.concatBytes = N, e.checkOpts = _, e.createHasher = R, e.createOptHasher = ue, e.createXOFer = de, e.randomBytes = Oe;
  const t = Al;
  function n(L) {
    return L instanceof Uint8Array || ArrayBuffer.isView(L) && L.constructor.name === "Uint8Array";
  }
  function r(L) {
    if (!Number.isSafeInteger(L) || L < 0)
      throw new Error("positive integer expected, got " + L);
  }
  function s(L, ...j) {
    if (!n(L))
      throw new Error("Uint8Array expected");
    if (j.length > 0 && !j.includes(L.length))
      throw new Error("Uint8Array expected of length " + j + ", got length=" + L.length);
  }
  function i(L) {
    if (typeof L != "function" || typeof L.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(L.outputLen), r(L.blockLen);
  }
  function o(L, j = !0) {
    if (L.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (j && L.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(L, j) {
    s(L);
    const fe = j.outputLen;
    if (L.length < fe)
      throw new Error("digestInto() expects output buffer of length at least " + fe);
  }
  function c(L) {
    return new Uint8Array(L.buffer, L.byteOffset, L.byteLength);
  }
  function d(L) {
    return new Uint32Array(L.buffer, L.byteOffset, Math.floor(L.byteLength / 4));
  }
  function h(...L) {
    for (let j = 0; j < L.length; j++)
      L[j].fill(0);
  }
  function u(L) {
    return new DataView(L.buffer, L.byteOffset, L.byteLength);
  }
  function w(L, j) {
    return L << 32 - j | L >>> j;
  }
  function y(L, j) {
    return L << j | L >>> 32 - j >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S(L) {
    return L << 24 & 4278190080 | L << 8 & 16711680 | L >>> 8 & 65280 | L >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (L) => L : (L) => S(L), e.byteSwapIfBE = e.swap8IfBE;
  function v(L) {
    for (let j = 0; j < L.length; j++)
      L[j] = S(L[j]);
    return L;
  }
  e.swap32IfBE = e.isLE ? (L) => L : v;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", P = /* @__PURE__ */ Array.from({ length: 256 }, (L, j) => j.toString(16).padStart(2, "0"));
  function H(L) {
    if (s(L), C)
      return L.toHex();
    let j = "";
    for (let fe = 0; fe < L.length; fe++)
      j += P[L[fe]];
    return j;
  }
  const k = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function M(L) {
    if (L >= k._0 && L <= k._9)
      return L - k._0;
    if (L >= k.A && L <= k.F)
      return L - (k.A - 10);
    if (L >= k.a && L <= k.f)
      return L - (k.a - 10);
  }
  function U(L) {
    if (typeof L != "string")
      throw new Error("hex string expected, got " + typeof L);
    if (C)
      return Uint8Array.fromHex(L);
    const j = L.length, fe = j / 2;
    if (j % 2)
      throw new Error("hex string expected, got unpadded hex of length " + j);
    const ye = new Uint8Array(fe);
    for (let Le = 0, Be = 0; Le < fe; Le++, Be += 2) {
      const Ct = M(L.charCodeAt(Be)), He = M(L.charCodeAt(Be + 1));
      if (Ct === void 0 || He === void 0) {
        const Me = L[Be] + L[Be + 1];
        throw new Error('hex string expected, got non-hex character "' + Me + '" at index ' + Be);
      }
      ye[Le] = Ct * 16 + He;
    }
    return ye;
  }
  const Y = async () => {
  };
  e.nextTick = Y;
  async function le(L, j, fe) {
    let ye = Date.now();
    for (let Le = 0; Le < L; Le++) {
      fe(Le);
      const Be = Date.now() - ye;
      Be >= 0 && Be < j || (await (0, e.nextTick)(), ye += Be);
    }
  }
  function ne(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function q(L) {
    return new TextDecoder().decode(L);
  }
  function m(L) {
    return typeof L == "string" && (L = ne(L)), s(L), L;
  }
  function I(L) {
    return typeof L == "string" && (L = ne(L)), s(L), L;
  }
  function N(...L) {
    let j = 0;
    for (let ye = 0; ye < L.length; ye++) {
      const Le = L[ye];
      s(Le), j += Le.length;
    }
    const fe = new Uint8Array(j);
    for (let ye = 0, Le = 0; ye < L.length; ye++) {
      const Be = L[ye];
      fe.set(Be, Le), Le += Be.length;
    }
    return fe;
  }
  function _(L, j) {
    if (j !== void 0 && {}.toString.call(j) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(L, j);
  }
  class W {
  }
  e.Hash = W;
  function R(L) {
    const j = (ye) => L().update(m(ye)).digest(), fe = L();
    return j.outputLen = fe.outputLen, j.blockLen = fe.blockLen, j.create = () => L(), j;
  }
  function ue(L) {
    const j = (ye, Le) => L(Le).update(m(ye)).digest(), fe = L({});
    return j.outputLen = fe.outputLen, j.blockLen = fe.blockLen, j.create = (ye) => L(ye), j;
  }
  function de(L) {
    const j = (ye, Le) => L(Le).update(m(ye)).digest(), fe = L({});
    return j.outputLen = fe.outputLen, j.blockLen = fe.blockLen, j.create = (ye) => L(ye), j;
  }
  e.wrapConstructor = R, e.wrapConstructorWithOpts = ue, e.wrapXOFConstructorWithOpts = de;
  function Oe(L = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(L));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(vy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = vy;
  class n extends t.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(i);
      const a = (0, t.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, d = new Uint8Array(c);
      d.set(a.length > c ? i.create().update(a).digest() : a);
      for (let h = 0; h < d.length; h++)
        d[h] ^= 54;
      this.iHash.update(d), this.oHash = i.create();
      for (let h = 0; h < d.length; h++)
        d[h] ^= 106;
      this.oHash.update(d), (0, t.clean)(d);
    }
    update(i) {
      return (0, t.aexists)(this), this.iHash.update(i), this;
    }
    digestInto(i) {
      (0, t.aexists)(this), (0, t.abytes)(i, this.outputLen), this.finished = !0, this.iHash.digestInto(i), this.oHash.update(i), this.oHash.digestInto(i), this.destroy();
    }
    digest() {
      const i = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(i), i;
    }
    _cloneInto(i) {
      i || (i = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: o, iHash: a, finished: c, destroyed: d, blockLen: h, outputLen: u } = this;
      return i = i, i.finished = c, i.destroyed = d, i.blockLen = h, i.outputLen = u, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (s, i, o) => new n(s, i).update(o).digest();
  e.hmac = r, e.hmac.create = (s, i) => new n(s, i);
})(Sy);
const co = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ey(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Yu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Ki(e, ...t) {
  if (!Ey(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function hx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Yu(e.outputLen), Yu(e.blockLen);
}
function Xu(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ay(e, t) {
  Ki(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function px(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function gx(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Kc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Cc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Sr(e, t) {
  return e << 32 - t | e >>> t;
}
function yx(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const cf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function lf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const ky = cf ? (e) => e : (e) => lf(e), wx = ky;
function $y(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = lf(e[t]);
  return e;
}
const mx = cf ? (e) => e : $y, Iy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", bx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function uf(e) {
  if (Ki(e), Iy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += bx[e[n]];
  return t;
}
const ns = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function np(e) {
  if (e >= ns._0 && e <= ns._9)
    return e - ns._0;
  if (e >= ns.A && e <= ns.F)
    return e - (ns.A - 10);
  if (e >= ns.a && e <= ns.f)
    return e - (ns.a - 10);
}
function xx(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (Iy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = np(e.charCodeAt(i)), a = np(e.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = e[i] + e[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Ly = async () => {
};
async function Sx(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < t || (await Ly(), r += i);
  }
}
function df(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function vx(e) {
  return new TextDecoder().decode(e);
}
function Pa(e) {
  return typeof e == "string" && (e = df(e)), Ki(e), e;
}
function Ex(e) {
  return typeof e == "string" && (e = df(e)), Ki(e), e;
}
function Ax(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    Ki(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function kx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let Cy = class {
};
function kl(e) {
  const t = (r) => e().update(Pa(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Ty(e) {
  const t = (r, s) => e(s).update(Pa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function By(e) {
  const t = (r, s) => e(s).update(Pa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const $x = kl, Ix = Ty, Lx = By;
function Cx(e = 32) {
  if (co && typeof co.getRandomValues == "function")
    return co.getRandomValues(new Uint8Array(e));
  if (co && typeof co.randomBytes == "function")
    return Uint8Array.from(co.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const Tx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Cy,
  abytes: Ki,
  aexists: Xu,
  ahash: hx,
  anumber: Yu,
  aoutput: Ay,
  asyncLoop: Sx,
  byteSwap: lf,
  byteSwap32: $y,
  byteSwapIfBE: wx,
  bytesToHex: uf,
  bytesToUtf8: vx,
  checkOpts: kx,
  clean: Kc,
  concatBytes: Ax,
  createHasher: kl,
  createOptHasher: Ty,
  createView: Cc,
  createXOFer: By,
  hexToBytes: xx,
  isBytes: Ey,
  isLE: cf,
  kdfInputToBytes: Ex,
  nextTick: Ly,
  randomBytes: Cx,
  rotl: yx,
  rotr: Sr,
  swap32IfBE: mx,
  swap8IfBE: ky,
  toBytes: Pa,
  u32: gx,
  u8: px,
  utf8ToBytes: df,
  wrapConstructor: $x,
  wrapConstructorWithOpts: Ix,
  wrapXOFConstructorWithOpts: Lx
}, Symbol.toStringTag, { value: "Module" }));
function Bx(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
function Mx(e, t, n) {
  return e & t ^ ~e & n;
}
function Nx(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class _x extends Cy {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Cc(this.buffer);
  }
  update(t) {
    Xu(this), t = Pa(t), Ki(t);
    const { view: n, buffer: r, blockLen: s } = this, i = t.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Cc(t);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Xu(this), Ay(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Kc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Bx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Cc(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, h[u], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return t.destroyed = o, t.finished = i, t.length = s, t.pos = a, s % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const Is = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ls = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Px = /* @__PURE__ */ Uint32Array.from([
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
]), Cs = /* @__PURE__ */ new Uint32Array(64);
let ff = class extends _x {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Is[0] | 0, this.B = Is[1] | 0, this.C = Is[2] | 0, this.D = Is[3] | 0, this.E = Is[4] | 0, this.F = Is[5] | 0, this.G = Is[6] | 0, this.H = Is[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [t, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let u = 0; u < 16; u++, n += 4)
      Cs[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Cs[u - 15], y = Cs[u - 2], S = Sr(w, 7) ^ Sr(w, 18) ^ w >>> 3, v = Sr(y, 17) ^ Sr(y, 19) ^ y >>> 10;
      Cs[u] = v + Cs[u - 7] + S + Cs[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Sr(a, 6) ^ Sr(a, 11) ^ Sr(a, 25), y = h + w + Mx(a, c, d) + Px[u] + Cs[u] | 0, v = (Sr(r, 2) ^ Sr(r, 13) ^ Sr(r, 22)) + Nx(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Kc(Cs);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Kc(this.buffer);
  }
}, My = class extends ff {
  constructor() {
    super(28), this.A = Ls[0] | 0, this.B = Ls[1] | 0, this.C = Ls[2] | 0, this.D = Ls[3] | 0, this.E = Ls[4] | 0, this.F = Ls[5] | 0, this.G = Ls[6] | 0, this.H = Ls[7] | 0;
  }
};
const Ux = /* @__PURE__ */ kl(() => new ff()), Hx = /* @__PURE__ */ kl(() => new My()), Ox = ff, hf = Ux, Dx = My, Fx = Hx, jx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Dx,
  SHA256: Ox,
  sha224: Fx,
  sha256: hf
}, Symbol.toStringTag, { value: "Module" })), $l = /* @__PURE__ */ wl(jx), Rx = /* @__PURE__ */ wl(X1);
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
Mo.joseToDer = Mo.derToJose = void 0;
const Ny = _a, _y = In;
function ou(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const zx = {
  ES256: ou(256),
  ES384: ou(384),
  ES512: ou(521)
};
function Py(e) {
  const t = zx[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const Vc = 128, Uy = 0, Gx = 32, Kx = 16, Vx = 2, Hy = Kx | Gx | Uy << 6, Yc = Vx | Uy << 6;
function Oy(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, Ny.toByteArray)((0, _y.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Yx(e, t) {
  const n = Oy(e), r = Py(t), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Hy)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Vc | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Yc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const d = o;
  if (o += c, n[o++] !== Yc)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[o++];
  if (i - o !== h)
    throw new Error(`"s" specified length of "${h}", expected "${i - o}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const u = o;
  if (o += h, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const w = r - c, y = r - h, S = new Uint8Array(w + c + y + h);
  for (o = 0; o < w; ++o)
    S[o] = 0;
  S.set(n.subarray(d + Math.max(-w, 0), d + c), o), o = r;
  for (const v = o; o < v + y; ++o)
    S[o] = 0;
  return S.set(n.subarray(u + Math.max(-y, 0), u + h), o), (0, _y.escape)((0, Ny.fromByteArray)(S));
}
Mo.derToJose = Yx;
function rp(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= Vc && --r, r;
}
function Xx(e, t) {
  e = Oy(e);
  const n = Py(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = rp(e, 0, n), i = rp(e, n, e.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, d = c < Vc, h = new Uint8Array((d ? 2 : 3) + c);
  let u = 0;
  return h[u++] = Hy, d ? h[u++] = c : (h[u++] = Vc | 1, h[u++] = c & 255), h[u++] = Yc, h[u++] = o, s < 0 ? (h[u++] = 0, h.set(e.subarray(0, n), u), u += n) : (h.set(e.subarray(s, n), u), u += n - s), h[u++] = Yc, h[u++] = a, i < 0 ? (h[u++] = 0, h.set(e.subarray(n), u)) : h.set(e.subarray(n + i), u), h;
}
Mo.joseToDer = Xx;
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
ds.InvalidTokenError = ds.MissingParametersError = void 0;
class qx extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
ds.MissingParametersError = qx;
class Wx extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
ds.InvalidTokenError = Wx;
const Ua = /* @__PURE__ */ wl(Tx);
Object.defineProperty(El, "__esModule", { value: !0 });
El.SECP256K1Client = void 0;
const Zx = Sy, Jx = $l, Tc = Rx, sp = Mo, ip = ds, op = Ua;
Tc.utils.hmacSha256Sync = (e, ...t) => {
  const n = Zx.hmac.create(Jx.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Dy {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, op.bytesToHex)(Tc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new ip.MissingParametersError("a signing input hash and private key are all required");
    const s = Tc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, op.bytesToHex)(s);
    if (r === "jose")
      return (0, sp.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, sp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new ip.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Tc.verify(n, t, r, { strict: !1 });
  }
}
El.SECP256K1Client = Dy;
Dy.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = El;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(vl);
var Ti = {};
const Qx = /* @__PURE__ */ wl(Vg);
var eS = Cn && Cn.__awaiter || function(e, t, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        d(r.next(h));
      } catch (u) {
        o(u);
      }
    }
    function c(h) {
      try {
        d(r.throw(h));
      } catch (u) {
        o(u);
      }
    }
    function d(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    d((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.hashSha256Async = Ti.hashSha256 = void 0;
const tS = $l;
function Fy(e) {
  return (0, tS.sha256)(e);
}
Ti.hashSha256 = Fy;
function nS(e) {
  return eS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Qx;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Fy(e));
    }
  });
}
Ti.hashSha256Async = nS;
var rS = Cn && Cn.__awaiter || function(e, t, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        d(r.next(h));
      } catch (u) {
        o(u);
      }
    }
    function c(h) {
      try {
        d(r.throw(h));
      } catch (u) {
        o(u);
      }
    }
    function d(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    d((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.TokenSigner = Bo.createUnsecuredToken = void 0;
const qu = In, ap = vl, sS = ds, cp = Ti;
function Wu(e, t) {
  const n = [], r = qu.encode(JSON.stringify(t));
  n.push(r);
  const s = qu.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function iS(e) {
  return Wu(e, { typ: "JWT", alg: "none" }) + ".";
}
Bo.createUnsecuredToken = iS;
class oS {
  constructor(t, n) {
    if (!(t && n))
      throw new sS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !ap.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = ap.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), i = Wu(t, s), o = (0, cp.hashSha256)(i);
    return this.createWithSignedHash(t, n, s, i, o);
  }
  signAsync(t, n = !1, r = {}) {
    return rS(this, void 0, void 0, function* () {
      const s = this.header(r), i = Wu(t, s), o = yield (0, cp.hashSha256Async)(i);
      return this.createWithSignedHash(t, n, s, i, o);
    });
  }
  createWithSignedHash(t, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [qu.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [o]
    } : [s, o].join(".");
  }
}
Bo.TokenSigner = oS;
var Il = {};
Object.defineProperty(Il, "__esModule", { value: !0 });
Il.TokenVerifier = void 0;
const aS = In, lp = vl, cS = ds, Qa = Ti;
class lS {
  constructor(t, n) {
    if (!(t && n))
      throw new cS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !lp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = lp.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), s = r[0] + "." + r[1], i = (o) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, a, this.rawPublicKey);
    };
    if (n)
      return (0, Qa.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Qa.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), aS.encode(t.payload)].join(".");
    let s = !0;
    const i = (o) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Qa.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Qa.hashSha256)(r);
      return i(o);
    }
  }
}
Il.TokenVerifier = lS;
var Ll = {};
Object.defineProperty(Ll, "__esModule", { value: !0 });
Ll.decodeToken = void 0;
const ec = In;
function uS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(ec.decode(t[0])), r = JSON.parse(ec.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = ec.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(ec.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Ll.decodeToken = uS;
(function(e) {
  var t = Cn && Cn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Cn && Cn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && t(s, r, i);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Bo, e), n(Il, e), n(Ll, e), n(ds, e), n(vl, e);
})(hn);
function dS(e) {
  return `did:btc-addr:${e}`;
}
function fS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new Rh("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new Rh('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function jy(e) {
  if (e)
    return fS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const hS = "1.4.0";
function pS() {
  return Q2();
}
function gS(e, t, n, r = Ug.slice(), s, i = Wb().getTime(), o = {}) {
  const a = (y) => {
    const S = qd("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Jb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: hS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), d = hn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [d];
  const h = hy(d);
  return c.iss = dS(h), new hn.TokenSigner("ES256k", e).sign(c);
}
async function up(e, t) {
  const n = Ma(ct(t)), r = JSON.parse(n), s = await wy(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function yS(e) {
  const t = hn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new hn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function wS(e) {
  const t = hn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = jy(t.iss);
  if (n.length === 1) {
    if (hy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function mS(e) {
  const t = hn.decodeToken(e).payload;
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
function bS(e) {
  const t = hn.decodeToken(e).payload;
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
function xS(e) {
  const t = [
    bS(e),
    mS(e),
    yS(e),
    wS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const dp = "1.0.0";
class Qs {
  constructor(t) {
    this.version = dp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== dp)
      throw new ju(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new Qs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Ry {
  constructor(t) {
    if (t) {
      const n = new Qs(t);
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
class fp extends Ry {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new Qs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Hg("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Qs({})), !0;
  }
}
class hp extends Ry {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = Yb, !localStorage.getItem(this.key)) {
      const r = new Qs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new Hg("No session data was found in localStorage");
    const n = JSON.parse(t);
    return Qs.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Qs({})), !0;
  }
}
var ba;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(ba || (ba = {}));
var Xc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Xc || (Xc = {}));
ba.Mainnet;
var cs;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(cs || (cs = {}));
var zr;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(zr || (zr = {}));
cs.Mainnet;
const zy = {
  chainId: ba.Mainnet,
  transactionVersion: cs.Mainnet,
  peerNetworkId: Xc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: zr.MainnetSingleSig,
    multiSig: zr.MainnetMultiSig
  },
  client: { baseUrl: Og }
}, Zu = {
  chainId: ba.Testnet,
  transactionVersion: cs.Testnet,
  peerNetworkId: Xc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: zr.TestnetSingleSig,
    multiSig: zr.TestnetMultiSig
  },
  client: { baseUrl: Dg }
}, Bc = {
  ...Zu,
  addressVersion: { ...Zu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Fg }
}, SS = {
  ...Bc,
  addressVersion: { ...Bc.addressVersion },
  client: { ...Bc.client }
};
function vS(e) {
  switch (e) {
    case "mainnet":
      return zy;
    case "testnet":
      return Zu;
    case "devnet":
      return Bc;
    case "mocknet":
      return SS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Gy(e) {
  return typeof e == "string" ? vS(e) : e;
}
var pp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(pp || (pp = {}));
var gp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(gp || (gp = {}));
var Er;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Er || (Er = {}));
const au = ["onChainOnly", "offChainOnly", "any"];
au[0] + "", Er.OnChainOnly, au[1] + "", Er.OffChainOnly, au[2] + "", Er.Any, Er.OnChainOnly + "", Er.OnChainOnly, Er.OffChainOnly + "", Er.OffChainOnly, Er.Any + "", Er.Any;
var yp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(yp || (yp = {}));
var wp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(wp || (wp = {}));
var mp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(mp || (mp = {}));
var os;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(os || (os = {}));
var bp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(bp || (bp = {}));
var xp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(xp || (xp = {}));
var Sp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Sp || (Sp = {}));
var vp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(vp || (vp = {}));
var Ep;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ep || (Ep = {}));
var Ap;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Ap || (Ap = {}));
var kp;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(kp || (kp = {}));
var $p;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})($p || ($p = {}));
var Ip;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Ip || (Ip = {}));
function Ju(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function ES(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Ky(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function AS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ju(e.outputLen), Ju(e.blockLen);
}
function kS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function $S(e, t) {
  Ky(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const mi = {
  number: Ju,
  bool: ES,
  bytes: Ky,
  hash: AS,
  exists: kS,
  output: $S
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const cu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Ur = (e, t) => e << 32 - t | e >>> t, IS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!IS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function LS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function pf(e) {
  if (typeof e == "string" && (e = LS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Vy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Vi(e) {
  const t = (r) => e().update(pf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Yy = class extends Vy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, mi.hash(t);
    const r = pf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return mi.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    mi.exists(this), mi.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Xy = (e, t, n) => new Yy(e, t).update(n).digest();
Xy.create = (e, t) => new Yy(e, t);
function CS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
let gf = class extends Vy {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = cu(this.buffer);
  }
  update(t) {
    mi.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = pf(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = cu(t);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    mi.exists(this), mi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    CS(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = cu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, h[u], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const TS = (e, t, n) => e & t ^ ~e & n, BS = (e, t, n) => e & t ^ e & n ^ t & n, MS = new Uint32Array([
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
]), Ts = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Bs = new Uint32Array(64);
let qy = class extends gf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ts[0] | 0, this.B = Ts[1] | 0, this.C = Ts[2] | 0, this.D = Ts[3] | 0, this.E = Ts[4] | 0, this.F = Ts[5] | 0, this.G = Ts[6] | 0, this.H = Ts[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [t, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let u = 0; u < 16; u++, n += 4)
      Bs[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Bs[u - 15], y = Bs[u - 2], S = Ur(w, 7) ^ Ur(w, 18) ^ w >>> 3, v = Ur(y, 17) ^ Ur(y, 19) ^ y >>> 10;
      Bs[u] = v + Bs[u - 7] + S + Bs[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Ur(a, 6) ^ Ur(a, 11) ^ Ur(a, 25), y = h + w + TS(a, c, d) + MS[u] + Bs[u] | 0, v = (Ur(r, 2) ^ Ur(r, 13) ^ Ur(r, 22)) + BS(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Bs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, NS = class extends qy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Wy = Vi(() => new qy());
Vi(() => new NS());
var Yi = {}, yf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Ua;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], d = 0;
    for (let y = o.length - 1; y >= 0; y--)
      if (d < 4) {
        const S = n.indexOf(o[y]) >> d;
        let v = 0;
        y !== 0 && (v = n.indexOf(o[y - 1]));
        const C = 1 + d, P = v % (1 << C) << 5 - C, H = e.c32[S + P];
        d = C, c.unshift(H);
      } else
        d = 0;
    let h = 0;
    for (let y = 0; y < c.length && c[y] === "0"; y++)
      h++;
    c = c.slice(h);
    const u = new TextDecoder().decode((0, t.hexToBytes)(o)).match(/^\u0000*/), w = u ? u[0].length : 0;
    for (let y = 0; y < w; y++)
      c.unshift(e.c32[0]);
    if (a) {
      const y = a - c.length;
      for (let S = 0; S < y; S++)
        c.unshift(e.c32[0]);
    }
    return c.join("");
  }
  e.c32encode = r;
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = s;
  function i(o, a) {
    if (o = s(o), !o.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = o.match(`^${e.c32[0]}*`), d = c ? c[0].length : 0;
    let h = [], u = 0, w = 0;
    for (let v = o.length - 1; v >= 0; v--) {
      w === 4 && (h.unshift(n[u]), w = 0, u = 0);
      const P = (e.c32.indexOf(o[v]) << w) + u, H = n[P % 16];
      if (w += 1, u = P >> 4, u > 1 << w)
        throw new Error("Panic error in decoding.");
      h.unshift(H);
    }
    h.unshift(n[u]), h.length % 2 === 1 && h.unshift("0");
    let y = 0;
    for (let v = 0; v < h.length && h[v] === "0"; v++)
      y++;
    h = h.slice(y - y % 2);
    let S = h.join("");
    for (let v = 0; v < d; v++)
      S = `00${S}`;
    if (a) {
      const v = a * 2 - S.length;
      for (let C = 0; C < v; C += 2)
        S = `00${S}`;
    }
    return S;
  }
  e.c32decode = i;
})(yf);
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.c32checkDecode = Bi.c32checkEncode = void 0;
const Lp = $l, Cp = Ua, ha = yf;
function Zy(e) {
  const t = (0, Lp.sha256)((0, Lp.sha256)((0, Cp.hexToBytes)(e)));
  return (0, Cp.bytesToHex)(t.slice(0, 4));
}
function _S(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Zy(`${n}${t}`), s = (0, ha.c32encode)(`${t}${r}`);
  return `${ha.c32[e]}${s}`;
}
Bi.c32checkEncode = _S;
function PS(e) {
  e = (0, ha.c32normalize)(e);
  const t = (0, ha.c32decode)(e.slice(1)), n = e[0], r = ha.c32.indexOf(n), s = t.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Zy(`${i}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Bi.c32checkDecode = PS;
var Jy = {}, No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
No.decode = No.encode = void 0;
const qc = $l, Tp = Ua, Qy = cy, ew = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function US(e, t = "00") {
  const n = typeof e == "string" ? (0, Tp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Tp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, qc.sha256)((0, qc.sha256)(new Uint8Array([...r, ...n])));
  return Qy(ew).encode([...r, ...n, ...s.slice(0, 4)]);
}
No.encode = US;
function HS(e) {
  const t = Qy(ew).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, qc.sha256)((0, qc.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
No.decode = HS;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Bi, n = No, r = Ua;
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
  const s = {};
  s[0] = e.versions.mainnet.p2pkh, s[5] = e.versions.mainnet.p2sh, s[111] = e.versions.testnet.p2pkh, s[196] = e.versions.testnet.p2sh;
  const i = {};
  i[e.versions.mainnet.p2pkh] = 0, i[e.versions.mainnet.p2sh] = 5, i[e.versions.testnet.p2pkh] = 111, i[e.versions.testnet.p2sh] = 196;
  function o(h, u) {
    if (!u.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(h, u)}`;
  }
  e.c32address = o;
  function a(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(h.slice(1));
  }
  e.c32addressDecode = a;
  function c(h, u = -1) {
    const w = n.decode(h), y = (0, r.bytesToHex)(w.data), S = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let v;
    return u < 0 ? (v = S, s[S] !== void 0 && (v = s[S])) : v = u, o(v, y);
  }
  e.b58ToC32 = c;
  function d(h, u = -1) {
    const w = a(h), y = w[0], S = w[1];
    let v;
    u < 0 ? (v = y, i[y] !== void 0 && (v = i[y])) : v = u;
    let C = v.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(S, C);
  }
  e.c32ToB58 = d;
})(Jy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = yf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = Bi;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Jy;
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
})(Yi);
function OS(e, t) {
  switch (t = Gy(t ?? zy), e) {
    case os.P2PKH:
      switch (t.transactionVersion) {
        case cs.Mainnet:
          return zr.MainnetSingleSig;
        case cs.Testnet:
          return zr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case os.P2SH:
    case os.P2SHNonSequential:
    case os.P2WPKH:
    case os.P2WSH:
    case os.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case cs.Mainnet:
          return zr.MainnetMultiSig;
        case cs.Testnet:
          return zr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const DS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), tw = Uint8Array.from({ length: 16 }, (e, t) => t), FS = tw.map((e) => (9 * e + 5) % 16);
let wf = [tw], mf = [FS];
for (let e = 0; e < 4; e++)
  for (let t of [wf, mf])
    t.push(t[e].map((n) => DS[n]));
const nw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), jS = wf.map((e, t) => e.map((n) => nw[t][n])), RS = mf.map((e, t) => e.map((n) => nw[t][n])), zS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), GS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), tc = (e, t) => e << t | e >>> 32 - t;
function Bp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const nc = new Uint32Array(16);
let KS = class extends gf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      nc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, d = this.h3 | 0, h = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = zS[y], C = GS[y], P = wf[y], H = mf[y], k = jS[y], M = RS[y];
      for (let U = 0; U < 16; U++) {
        const Y = tc(r + Bp(y, i, a, d) + nc[P[U]] + v, k[U]) + u | 0;
        r = u, u = d, d = tc(a, 10) | 0, a = i, i = Y;
      }
      for (let U = 0; U < 16; U++) {
        const Y = tc(s + Bp(S, o, c, h) + nc[H[U]] + C, M[U]) + w | 0;
        s = w, w = h, h = tc(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    nc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const VS = Vi(() => new KS()), rc = BigInt(2 ** 32 - 1), Qu = BigInt(32);
function rw(e, t = !1) {
  return t ? { h: Number(e & rc), l: Number(e >> Qu & rc) } : { h: Number(e >> Qu & rc) | 0, l: Number(e & rc) | 0 };
}
function YS(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = rw(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const XS = (e, t) => BigInt(e >>> 0) << Qu | BigInt(t >>> 0), qS = (e, t, n) => e >>> n, WS = (e, t, n) => e << 32 - n | t >>> n, ZS = (e, t, n) => e >>> n | t << 32 - n, JS = (e, t, n) => e << 32 - n | t >>> n, QS = (e, t, n) => e << 64 - n | t >>> n - 32, ev = (e, t, n) => e >>> n - 32 | t << 64 - n, tv = (e, t) => t, nv = (e, t) => e, rv = (e, t, n) => e << n | t >>> 32 - n, sv = (e, t, n) => t << n | e >>> 32 - n, iv = (e, t, n) => t << n - 32 | e >>> 64 - n, ov = (e, t, n) => e << n - 32 | t >>> 64 - n;
function av(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const cv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), lv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, uv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), dv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, fv = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), hv = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ve = {
  fromBig: rw,
  split: YS,
  toBig: XS,
  shrSH: qS,
  shrSL: WS,
  rotrSH: ZS,
  rotrSL: JS,
  rotrBH: QS,
  rotrBL: ev,
  rotr32H: tv,
  rotr32L: nv,
  rotlSH: rv,
  rotlSL: sv,
  rotlBH: iv,
  rotlBL: ov,
  add: av,
  add3L: cv,
  add3H: lv,
  add4L: uv,
  add4H: dv,
  add5H: hv,
  add5L: fv
}, [pv, gv] = Ve.split([
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
].map((e) => BigInt(e))), Ms = new Uint32Array(80), Ns = new Uint32Array(80);
let Cl = class extends gf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: C } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let k = 0; k < 16; k++, n += 4)
      Ms[k] = t.getUint32(n), Ns[k] = t.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const M = Ms[k - 15] | 0, U = Ns[k - 15] | 0, Y = Ve.rotrSH(M, U, 1) ^ Ve.rotrSH(M, U, 8) ^ Ve.shrSH(M, U, 7), le = Ve.rotrSL(M, U, 1) ^ Ve.rotrSL(M, U, 8) ^ Ve.shrSL(M, U, 7), ne = Ms[k - 2] | 0, q = Ns[k - 2] | 0, m = Ve.rotrSH(ne, q, 19) ^ Ve.rotrBH(ne, q, 61) ^ Ve.shrSH(ne, q, 6), I = Ve.rotrSL(ne, q, 19) ^ Ve.rotrBL(ne, q, 61) ^ Ve.shrSL(ne, q, 6), N = Ve.add4L(le, I, Ns[k - 7], Ns[k - 16]), _ = Ve.add4H(N, Y, m, Ms[k - 7], Ms[k - 16]);
      Ms[k] = _ | 0, Ns[k] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: C, Hh: P, Hl: H } = this;
    for (let k = 0; k < 80; k++) {
      const M = Ve.rotrSH(u, w, 14) ^ Ve.rotrSH(u, w, 18) ^ Ve.rotrBH(u, w, 41), U = Ve.rotrSL(u, w, 14) ^ Ve.rotrSL(u, w, 18) ^ Ve.rotrBL(u, w, 41), Y = u & y ^ ~u & v, le = w & S ^ ~w & C, ne = Ve.add5L(H, U, le, gv[k], Ns[k]), q = Ve.add5H(ne, P, M, Y, pv[k], Ms[k]), m = ne | 0, I = Ve.rotrSH(r, s, 28) ^ Ve.rotrBH(r, s, 34) ^ Ve.rotrBH(r, s, 39), N = Ve.rotrSL(r, s, 28) ^ Ve.rotrBL(r, s, 34) ^ Ve.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = C | 0, v = y | 0, C = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Ve.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = Ve.add3L(m, N, W);
      r = Ve.add3H(R, q, I, _), s = R | 0;
    }
    ({ h: r, l: s } = Ve.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ve.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ve.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = Ve.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = Ve.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Ve.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: C } = Ve.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: P, l: H } = Ve.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, C, P, H);
  }
  roundClean() {
    Ms.fill(0), Ns.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, yv = class extends Cl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, wv = class extends Cl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mv = class extends Cl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Vi(() => new Cl());
Vi(() => new yv());
Vi(() => new wv());
Vi(() => new mv());
var Wc = { exports: {} };
Wc.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", d = "[object Error]", h = "[object Function]", u = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", S = "[object Object]", v = "[object Promise]", C = "[object RegExp]", P = "[object Set]", H = "[object String]", k = "[object Symbol]", M = "[object WeakMap]", U = "[object ArrayBuffer]", Y = "[object DataView]", le = "[object Float32Array]", ne = "[object Float64Array]", q = "[object Int8Array]", m = "[object Int16Array]", I = "[object Int32Array]", N = "[object Uint8Array]", _ = "[object Uint8ClampedArray]", W = "[object Uint16Array]", R = "[object Uint32Array]", ue = /[\\^$.*+?()[\]{}|]/g, de = /\w*$/, Oe = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, j = {};
  j[i] = j[o] = j[U] = j[Y] = j[a] = j[c] = j[le] = j[ne] = j[q] = j[m] = j[I] = j[w] = j[y] = j[S] = j[C] = j[P] = j[H] = j[k] = j[N] = j[_] = j[W] = j[R] = !0, j[d] = j[h] = j[M] = !1;
  var fe = typeof Cn == "object" && Cn && Cn.Object === Object && Cn, ye = typeof self == "object" && self && self.Object === Object && self, Le = fe || ye || Function("return this")(), Be = t && !t.nodeType && t, Ct = Be && !0 && e && !e.nodeType && e, He = Ct && Ct.exports === Be;
  function Me(x, B) {
    return x.set(B[0], B[1]), x;
  }
  function Ne(x, B) {
    return x.add(B), x;
  }
  function qt(x, B) {
    for (var F = -1, J = x ? x.length : 0; ++F < J && B(x[F], F, x) !== !1; )
      ;
    return x;
  }
  function jt(x, B) {
    for (var F = -1, J = B.length, be = x.length; ++F < J; )
      x[be + F] = B[F];
    return x;
  }
  function et(x, B, F, J) {
    for (var be = -1, Re = x ? x.length : 0; ++be < Re; )
      F = B(F, x[be], be, x);
    return F;
  }
  function Wt(x, B) {
    for (var F = -1, J = Array(x); ++F < x; )
      J[F] = B(F);
    return J;
  }
  function gt(x, B) {
    return x == null ? void 0 : x[B];
  }
  function z(x) {
    var B = !1;
    if (x != null && typeof x.toString != "function")
      try {
        B = !!(x + "");
      } catch {
      }
    return B;
  }
  function O(x) {
    var B = -1, F = Array(x.size);
    return x.forEach(function(J, be) {
      F[++B] = [be, J];
    }), F;
  }
  function ee(x, B) {
    return function(F) {
      return x(B(F));
    };
  }
  function Q(x) {
    var B = -1, F = Array(x.size);
    return x.forEach(function(J) {
      F[++B] = J;
    }), F;
  }
  var he = Array.prototype, lt = Function.prototype, $e = Object.prototype, Pe = Le["__core-js_shared__"], ft = function() {
    var x = /[^.]+$/.exec(Pe && Pe.keys && Pe.keys.IE_PROTO || "");
    return x ? "Symbol(src)_1." + x : "";
  }(), _e = lt.toString, ve = $e.hasOwnProperty, Ge = $e.toString, Fe = RegExp(
    "^" + _e.call(ve).replace(ue, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Se = He ? Le.Buffer : void 0, Lt = Le.Symbol, pn = Le.Uint8Array, En = ee(Object.getPrototypeOf, Object), yt = Object.create, gn = $e.propertyIsEnumerable, Qt = he.splice, en = Object.getOwnPropertySymbols, Bn = Se ? Se.isBuffer : void 0, Dn = ee(Object.keys, Object), tr = kt(Le, "DataView"), tn = kt(Le, "Map"), hr = kt(Le, "Promise"), A = kt(Le, "Set"), D = kt(Le, "WeakMap"), K = kt(Object, "create"), V = _n(tr), ie = _n(tn), E = _n(hr), re = _n(A), Ie = _n(D), De = Lt ? Lt.prototype : void 0, pt = De ? De.valueOf : void 0;
  function je(x) {
    var B = -1, F = x ? x.length : 0;
    for (this.clear(); ++B < F; ) {
      var J = x[B];
      this.set(J[0], J[1]);
    }
  }
  function wt() {
    this.__data__ = K ? K(null) : {};
  }
  function tt(x) {
    return this.has(x) && delete this.__data__[x];
  }
  function We(x) {
    var B = this.__data__;
    if (K) {
      var F = B[x];
      return F === r ? void 0 : F;
    }
    return ve.call(B, x) ? B[x] : void 0;
  }
  function Rt(x) {
    var B = this.__data__;
    return K ? B[x] !== void 0 : ve.call(B, x);
  }
  function Ce(x, B) {
    var F = this.__data__;
    return F[x] = K && B === void 0 ? r : B, this;
  }
  je.prototype.clear = wt, je.prototype.delete = tt, je.prototype.get = We, je.prototype.has = Rt, je.prototype.set = Ce;
  function mt(x) {
    var B = -1, F = x ? x.length : 0;
    for (this.clear(); ++B < F; ) {
      var J = x[B];
      this.set(J[0], J[1]);
    }
  }
  function Xt() {
    this.__data__ = [];
  }
  function pr(x) {
    var B = this.__data__, F = Zt(B, x);
    if (F < 0)
      return !1;
    var J = B.length - 1;
    return F == J ? B.pop() : Qt.call(B, F, 1), !0;
  }
  function gr(x) {
    var B = this.__data__, F = Zt(B, x);
    return F < 0 ? void 0 : B[F][1];
  }
  function ps(x) {
    return Zt(this.__data__, x) > -1;
  }
  function An(x, B) {
    var F = this.__data__, J = Zt(F, x);
    return J < 0 ? F.push([x, B]) : F[J][1] = B, this;
  }
  mt.prototype.clear = Xt, mt.prototype.delete = pr, mt.prototype.get = gr, mt.prototype.has = ps, mt.prototype.set = An;
  function Fn(x) {
    var B = -1, F = x ? x.length : 0;
    for (this.clear(); ++B < F; ) {
      var J = x[B];
      this.set(J[0], J[1]);
    }
  }
  function Ji() {
    this.__data__ = {
      hash: new je(),
      map: new (tn || mt)(),
      string: new je()
    };
  }
  function nt(x) {
    return Jr(this, x).delete(x);
  }
  function zt(x) {
    return Jr(this, x).get(x);
  }
  function Mn(x) {
    return Jr(this, x).has(x);
  }
  function Nn(x, B) {
    return Jr(this, x).set(x, B), this;
  }
  Fn.prototype.clear = Ji, Fn.prototype.delete = nt, Fn.prototype.get = zt, Fn.prototype.has = Mn, Fn.prototype.set = Nn;
  function jn(x) {
    this.__data__ = new mt(x);
  }
  function yn() {
    this.__data__ = new mt();
  }
  function kn(x) {
    return this.__data__.delete(x);
  }
  function an(x) {
    return this.__data__.get(x);
  }
  function gs(x) {
    return this.__data__.has(x);
  }
  function yr(x, B) {
    var F = this.__data__;
    if (F instanceof mt) {
      var J = F.__data__;
      if (!tn || J.length < n - 1)
        return J.push([x, B]), this;
      F = this.__data__ = new Fn(J);
    }
    return F.set(x, B), this;
  }
  jn.prototype.clear = yn, jn.prototype.delete = kn, jn.prototype.get = an, jn.prototype.has = gs, jn.prototype.set = yr;
  function Qi(x, B) {
    var F = G(x) || $(x) ? Wt(x.length, String) : [], J = F.length, be = !!J;
    for (var Re in x)
      ve.call(x, Re) && !(be && (Re == "length" || rr(Re, J))) && F.push(Re);
    return F;
  }
  function eo(x, B, F) {
    var J = x[B];
    (!(ve.call(x, B) && b(J, F)) || F === void 0 && !(B in x)) && (x[B] = F);
  }
  function Zt(x, B) {
    for (var F = x.length; F--; )
      if (b(x[F][0], B))
        return F;
    return -1;
  }
  function si(x, B) {
    return x && bs(B, se(B), x);
  }
  function ii(x, B, F, J, be, Re, Tt) {
    var bt;
    if (J && (bt = Re ? J(x, be, Re, Tt) : J(x)), bt !== void 0)
      return bt;
    if (!T(x))
      return x;
    var br = G(x);
    if (br) {
      if (bt = xs(x), !B)
        return ms(x, bt);
    } else {
      var wn = wr(x), _r = wn == h || wn == u;
      if (p(x))
        return ci(x, B);
      if (wn == S || wn == i || _r && !Re) {
        if (z(x))
          return Re ? x : {};
        if (bt = fi(_r ? {} : x), !B)
          return Wo(x, si(bt, x));
      } else {
        if (!j[wn])
          return Re ? x : {};
        bt = mr(x, wn, ii, B);
      }
    }
    Tt || (Tt = new jn());
    var Pn = Tt.get(x);
    if (Pn)
      return Pn;
    if (Tt.set(x, bt), !br)
      var Zo = F ? rt(x) : se(x);
    return qt(Zo || x, function(es, ke) {
      Zo && (ke = es, es = x[ke]), eo(bt, ke, ii(es, B, F, J, ke, x, Tt));
    }), bt;
  }
  function Rn(x) {
    return T(x) ? yt(x) : {};
  }
  function qo(x, B, F) {
    var J = B(x);
    return G(x) ? J : jt(J, F(x));
  }
  function ys(x) {
    return Ge.call(x);
  }
  function oi(x) {
    if (!T(x) || Qr(x))
      return !1;
    var B = g(x) || z(x) ? Fe : Oe;
    return B.test(_n(x));
  }
  function ai(x) {
    if (!hi(x))
      return Dn(x);
    var B = [];
    for (var F in Object(x))
      ve.call(x, F) && F != "constructor" && B.push(F);
    return B;
  }
  function ci(x, B) {
    if (B)
      return x.slice();
    var F = new x.constructor(x.length);
    return x.copy(F), F;
  }
  function nr(x) {
    var B = new x.constructor(x.byteLength);
    return new pn(B).set(new pn(x)), B;
  }
  function li(x, B) {
    var F = B ? nr(x.buffer) : x.buffer;
    return new x.constructor(F, x.byteOffset, x.byteLength);
  }
  function ui(x, B, F) {
    var J = B ? F(O(x), !0) : O(x);
    return et(J, Me, new x.constructor());
  }
  function ws(x) {
    var B = new x.constructor(x.source, de.exec(x));
    return B.lastIndex = x.lastIndex, B;
  }
  function to(x, B, F) {
    var J = B ? F(Q(x), !0) : Q(x);
    return et(J, Ne, new x.constructor());
  }
  function Zr(x) {
    return pt ? Object(pt.call(x)) : {};
  }
  function di(x, B) {
    var F = B ? nr(x.buffer) : x.buffer;
    return new x.constructor(F, x.byteOffset, x.length);
  }
  function ms(x, B) {
    var F = -1, J = x.length;
    for (B || (B = Array(J)); ++F < J; )
      B[F] = x[F];
    return B;
  }
  function bs(x, B, F, J) {
    F || (F = {});
    for (var be = -1, Re = B.length; ++be < Re; ) {
      var Tt = B[be], bt = void 0;
      eo(F, Tt, bt === void 0 ? x[Tt] : bt);
    }
    return F;
  }
  function Wo(x, B) {
    return bs(x, no(x), B);
  }
  function rt(x) {
    return qo(x, se, no);
  }
  function Jr(x, B) {
    var F = x.__data__;
    return Ss(B) ? F[typeof B == "string" ? "string" : "hash"] : F.map;
  }
  function kt(x, B) {
    var F = gt(x, B);
    return oi(F) ? F : void 0;
  }
  var no = en ? ee(en, Object) : oe, wr = ys;
  (tr && wr(new tr(new ArrayBuffer(1))) != Y || tn && wr(new tn()) != w || hr && wr(hr.resolve()) != v || A && wr(new A()) != P || D && wr(new D()) != M) && (wr = function(x) {
    var B = Ge.call(x), F = B == S ? x.constructor : void 0, J = F ? _n(F) : void 0;
    if (J)
      switch (J) {
        case V:
          return Y;
        case ie:
          return w;
        case E:
          return v;
        case re:
          return P;
        case Ie:
          return M;
      }
    return B;
  });
  function xs(x) {
    var B = x.length, F = x.constructor(B);
    return B && typeof x[0] == "string" && ve.call(x, "index") && (F.index = x.index, F.input = x.input), F;
  }
  function fi(x) {
    return typeof x.constructor == "function" && !hi(x) ? Rn(En(x)) : {};
  }
  function mr(x, B, F, J) {
    var be = x.constructor;
    switch (B) {
      case U:
        return nr(x);
      case a:
      case c:
        return new be(+x);
      case Y:
        return li(x, J);
      case le:
      case ne:
      case q:
      case m:
      case I:
      case N:
      case _:
      case W:
      case R:
        return di(x, J);
      case w:
        return ui(x, J, F);
      case y:
      case H:
        return new be(x);
      case C:
        return ws(x);
      case P:
        return to(x, J, F);
      case k:
        return Zr(x);
    }
  }
  function rr(x, B) {
    return B = B ?? s, !!B && (typeof x == "number" || L.test(x)) && x > -1 && x % 1 == 0 && x < B;
  }
  function Ss(x) {
    var B = typeof x;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? x !== "__proto__" : x === null;
  }
  function Qr(x) {
    return !!ft && ft in x;
  }
  function hi(x) {
    var B = x && x.constructor, F = typeof B == "function" && B.prototype || $e;
    return x === F;
  }
  function _n(x) {
    if (x != null) {
      try {
        return _e.call(x);
      } catch {
      }
      try {
        return x + "";
      } catch {
      }
    }
    return "";
  }
  function ro(x) {
    return ii(x, !0, !0);
  }
  function b(x, B) {
    return x === B || x !== x && B !== B;
  }
  function $(x) {
    return l(x) && ve.call(x, "callee") && (!gn.call(x, "callee") || Ge.call(x) == i);
  }
  var G = Array.isArray;
  function te(x) {
    return x != null && f(x.length) && !g(x);
  }
  function l(x) {
    return X(x) && te(x);
  }
  var p = Bn || Ee;
  function g(x) {
    var B = T(x) ? Ge.call(x) : "";
    return B == h || B == u;
  }
  function f(x) {
    return typeof x == "number" && x > -1 && x % 1 == 0 && x <= s;
  }
  function T(x) {
    var B = typeof x;
    return !!x && (B == "object" || B == "function");
  }
  function X(x) {
    return !!x && typeof x == "object";
  }
  function se(x) {
    return te(x) ? Qi(x) : ai(x);
  }
  function oe() {
    return [];
  }
  function Ee() {
    return !1;
  }
  e.exports = ro;
})(Wc, Wc.exports);
var bv = Wc.exports;
const sw = /* @__PURE__ */ Mg(bv);
var ed;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ed || (ed = {}));
function xv(e, t) {
  return { type: ed.Address, version: e, hash160: t };
}
function Sv(e) {
  return Yi.c32address(e.version, e.hash160);
}
const vv = (e) => VS(Wy(e)), Ev = (e) => Te(vv(e));
Ft.hmacSha256Sync = (e, ...t) => {
  const n = Xy.create(Wy, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Av(e, t = "mainnet") {
  t = Gy(t), e = typeof e == "string" ? ct(e) : e;
  const n = OS(os.P2PKH, t), r = xv(n, Ev(e));
  return Sv(r);
}
function kv(e, t) {
  const n = hn.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, i = Av(s);
  if (t !== s) {
    if (t !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new hn.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function $v(e, t = null) {
  let n;
  t ? n = kv(e, t) : n = hn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Mp = "_blockstackDidCheckEchoReply", Iv = "echoReply", Lv = "authContinuation";
function Cv(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Tv() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[Mp];
  if (typeof t == "boolean")
    return t;
  const n = Cv(e.location.search), r = n[Iv];
  if (r) {
    e[Mp] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const i = n[Lv];
      e.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class td {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new jg();
    else
      throw new qb("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new hp(t.sessionOptions) : this.store = new hp() : t ? this.store = new fp(t.sessionOptions) : this.store = new fp();
  }
  makeAuthRequestToken(t, n, r, s, i, o = Zb().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ju("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, gS(t, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = pS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = qd("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Tv())
        return yo.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      yo.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = x1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Ka("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = hn.decodeToken(t).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await xS(t))
      throw new Ka("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (nu(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await up(s, i.private_key);
          } catch {
            if (yo.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ft.isValidPrivateKey(i.private_key))
              throw new Ka("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await up(s, c);
          } catch {
            yo.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Ka("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let d = l1, h;
    nu(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (d = i.hubUrl), nu(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: jy(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: d,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, w = i.profile_url;
    if (!u.profile && w) {
      const y = await n(w);
      if (!y.ok)
        u.profile = Object.assign({}, Vb);
      else {
        const S = await y.text(), v = JSON.parse(S);
        u.profile = $v(v[0].token);
      }
    } else
      u.profile = i.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new ju("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), lx(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ux(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
td.prototype.makeAuthRequest = td.prototype.makeAuthRequestToken;
const Bv = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Mv = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = Bv(), n = e.filter((r) => t.find((i) => i.id === r.id) ? !1 : !!Tl(r.id));
  return t.concat(n);
}, Tl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), iw = "STX_PROVIDER", Mi = () => typeof window > "u" ? null : window.localStorage.getItem(iw), Nv = (e) => {
  typeof window < "u" && window.localStorage.setItem(iw, e);
}, _v = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Pv(e, t) {
  const n = {};
  return Object.assign(n, _v, t), await fetch(e, n);
}
function Uv(e) {
  let t = Pv, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Hv(...e) {
  const { fetchLib: t, middlewares: n } = Uv(e);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (o = await Promise.resolve(c.pre({
        fetch: t,
        ...o
      })) ?? o);
    let a = await t(o.url, o.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var _o;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(_o || (_o = {}));
var Ni;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ni || (Ni = {}));
var Np;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Np || (Np = {}));
const Ov = "https://api.mainnet.hiro.so", Dv = "https://api.testnet.hiro.so", Fv = "http://localhost:3999", jv = ["mainnet", "testnet", "devnet", "mocknet"];
class _i {
  constructor(t) {
    this.version = Ni.Mainnet, this.chainId = _o.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ni.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Hv();
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
_i.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new nd();
    case "testnet":
      return new rd();
    case "devnet":
      return new Rv();
    case "mocknet":
      return new ow();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${jv.join(", ")}`);
  }
};
_i.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : _i.fromName(e);
class nd extends _i {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Ov,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ni.Mainnet, this.chainId = _o.Mainnet;
  }
}
class rd extends _i {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Dv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ni.Testnet, this.chainId = _o.Testnet;
  }
}
class ow extends _i {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Fv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ni.Testnet, this.chainId = _o.Testnet;
  }
}
const Rv = ow;
var Pi;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Pi || (Pi = {}));
var Zc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Zc || (Zc = {}));
Pi.Mainnet;
var Ui;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ui || (Ui = {}));
var Hi;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Hi || (Hi = {}));
Ui.Mainnet;
const zv = {
  chainId: Pi.Mainnet,
  transactionVersion: Ui.Mainnet,
  peerNetworkId: Zc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Hi.MainnetSingleSig,
    multiSig: Hi.MainnetMultiSig
  },
  client: { baseUrl: Og }
}, sd = {
  chainId: Pi.Testnet,
  transactionVersion: Ui.Testnet,
  peerNetworkId: Zc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Hi.TestnetSingleSig,
    multiSig: Hi.TestnetMultiSig
  },
  client: { baseUrl: Dg }
}, Mc = {
  ...sd,
  addressVersion: { ...sd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Fg }
}, Gv = {
  ...Mc,
  addressVersion: { ...Mc.addressVersion },
  client: { ...Mc.client }
};
function Kv(e) {
  switch (e) {
    case "mainnet":
      return zv;
    case "testnet":
      return sd;
    case "devnet":
      return Mc;
    case "mocknet":
      return Gv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Vv(e) {
  return typeof e == "string" ? Kv(e) : e;
}
function Yv(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const _p = /* @__PURE__ */ new Map();
function aw(e, t) {
  const n = _p.get(e);
  if (n !== void 0)
    return n(t);
  const r = Yv(e);
  return _p.set(e, r), aw(e, t);
}
let It = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? ct(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return y1(this.readBytes(4), 0);
  }
  readUInt8() {
    return p1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return f1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Te(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Te(n);
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
    if (aw(t, r))
      return r;
    throw n(r);
  }
};
const Xv = 128, qv = 128, cw = 16, Ei = 32, id = 80, Bl = 65, Wv = 32, Zv = 64, Jc = 34, Jv = 1 + 16 * 1024 * 1024, Qv = 165, eE = 16, tE = 16, nE = 20, rE = tE + 2 + nE, sE = rE + 4, iE = Jv + (Qv + eE * sE);
var ht;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ht || (ht = {}));
var od;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(od || (od = {}));
var Yn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Yn || (Yn = {}));
const lu = ["onChainOnly", "offChainOnly", "any"];
lu[0] + "", Yn.OnChainOnly, lu[1] + "", Yn.OffChainOnly, lu[2] + "", Yn.Any, Yn.OnChainOnly + "", Yn.OnChainOnly, Yn.OffChainOnly + "", Yn.OffChainOnly, Yn.Any + "", Yn.Any;
var Qc;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Qc || (Qc = {}));
var Bt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Bt || (Bt = {}));
var Ot;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Ot || (Ot = {}));
var Et;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Et || (Et = {}));
var Pt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Pt || (Pt = {}));
var pa;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(pa || (pa = {}));
var ad;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(ad || (ad = {}));
var cd;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(cd || (cd = {}));
var Ln;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ln || (Ln = {}));
var Pp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Pp || (Pp = {}));
var ld;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ld || (ld = {}));
var $r;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})($r || ($r = {}));
var Up;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Up || (Up = {}));
let Ml = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, wo = class extends Ml {
  constructor(t) {
    super(t);
  }
}, $n = class extends Ml {
  constructor(t) {
    super(t);
  }
}, el = class extends Ml {
  constructor(t) {
    super(t);
  }
}, bi = class extends Ml {
  constructor(t) {
    super(t);
  }
};
function ud(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function oE(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function lw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function aE(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ud(e.outputLen), ud(e.blockLen);
}
function cE(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function lE(e, t) {
  lw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xi = {
  number: ud,
  bool: oE,
  bytes: lw,
  hash: aE,
  exists: cE,
  output: lE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Hr = (e, t) => e << 32 - t | e >>> t, uE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!uE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function dE(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function bf(e) {
  if (typeof e == "string" && (e = dE(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let uw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Xi(e) {
  const t = (r) => e().update(bf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let dw = class extends uw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, xi.hash(t);
    const r = bf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return xi.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    xi.exists(this), xi.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const fw = (e, t, n) => new dw(e, t).update(n).digest();
fw.create = (e, t) => new dw(e, t);
function fE(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
let xf = class extends uw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = uu(this.buffer);
  }
  update(t) {
    xi.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = bf(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = uu(t);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    xi.exists(this), xi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    fE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = uu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, h[u], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const hE = (e, t, n) => e & t ^ ~e & n, pE = (e, t, n) => e & t ^ e & n ^ t & n, gE = new Uint32Array([
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
]), _s = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ps = new Uint32Array(64);
let hw = class extends xf {
  constructor() {
    super(64, 32, 8, !1), this.A = _s[0] | 0, this.B = _s[1] | 0, this.C = _s[2] | 0, this.D = _s[3] | 0, this.E = _s[4] | 0, this.F = _s[5] | 0, this.G = _s[6] | 0, this.H = _s[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [t, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let u = 0; u < 16; u++, n += 4)
      Ps[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Ps[u - 15], y = Ps[u - 2], S = Hr(w, 7) ^ Hr(w, 18) ^ w >>> 3, v = Hr(y, 17) ^ Hr(y, 19) ^ y >>> 10;
      Ps[u] = v + Ps[u - 7] + S + Ps[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Hr(a, 6) ^ Hr(a, 11) ^ Hr(a, 25), y = h + w + hE(a, c, d) + gE[u] + Ps[u] | 0, v = (Hr(r, 2) ^ Hr(r, 13) ^ Hr(r, 22)) + pE(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Ps.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, yE = class extends hw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Sf = Xi(() => new hw());
Xi(() => new yE());
const wE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), pw = Uint8Array.from({ length: 16 }, (e, t) => t), mE = pw.map((e) => (9 * e + 5) % 16);
let vf = [pw], Ef = [mE];
for (let e = 0; e < 4; e++)
  for (let t of [vf, Ef])
    t.push(t[e].map((n) => wE[n]));
const gw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), bE = vf.map((e, t) => e.map((n) => gw[t][n])), xE = Ef.map((e, t) => e.map((n) => gw[t][n])), SE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), vE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), sc = (e, t) => e << t | e >>> 32 - t;
function Hp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ic = new Uint32Array(16);
let EE = class extends xf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      ic[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, d = this.h3 | 0, h = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = SE[y], C = vE[y], P = vf[y], H = Ef[y], k = bE[y], M = xE[y];
      for (let U = 0; U < 16; U++) {
        const Y = sc(r + Hp(y, i, a, d) + ic[P[U]] + v, k[U]) + u | 0;
        r = u, u = d, d = sc(a, 10) | 0, a = i, i = Y;
      }
      for (let U = 0; U < 16; U++) {
        const Y = sc(s + Hp(S, o, c, h) + ic[H[U]] + C, M[U]) + w | 0;
        s = w, w = h, h = sc(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ic.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const AE = Xi(() => new EE()), oc = BigInt(2 ** 32 - 1), dd = BigInt(32);
function yw(e, t = !1) {
  return t ? { h: Number(e & oc), l: Number(e >> dd & oc) } : { h: Number(e >> dd & oc) | 0, l: Number(e & oc) | 0 };
}
function kE(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = yw(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const $E = (e, t) => BigInt(e >>> 0) << dd | BigInt(t >>> 0), IE = (e, t, n) => e >>> n, LE = (e, t, n) => e << 32 - n | t >>> n, CE = (e, t, n) => e >>> n | t << 32 - n, TE = (e, t, n) => e << 32 - n | t >>> n, BE = (e, t, n) => e << 64 - n | t >>> n - 32, ME = (e, t, n) => e >>> n - 32 | t << 64 - n, NE = (e, t) => t, _E = (e, t) => e, PE = (e, t, n) => e << n | t >>> 32 - n, UE = (e, t, n) => t << n | e >>> 32 - n, HE = (e, t, n) => t << n - 32 | e >>> 64 - n, OE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function DE(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const FE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), jE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, RE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), zE = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, GE = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), KE = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ye = {
  fromBig: yw,
  split: kE,
  toBig: $E,
  shrSH: IE,
  shrSL: LE,
  rotrSH: CE,
  rotrSL: TE,
  rotrBH: BE,
  rotrBL: ME,
  rotr32H: NE,
  rotr32L: _E,
  rotlSH: PE,
  rotlSL: UE,
  rotlBH: HE,
  rotlBL: OE,
  add: DE,
  add3L: FE,
  add3H: jE,
  add4L: RE,
  add4H: zE,
  add5H: KE,
  add5L: GE
}, [VE, YE] = Ye.split([
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
].map((e) => BigInt(e))), Us = new Uint32Array(80), Hs = new Uint32Array(80);
let Nl = class extends xf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: C } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let k = 0; k < 16; k++, n += 4)
      Us[k] = t.getUint32(n), Hs[k] = t.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const M = Us[k - 15] | 0, U = Hs[k - 15] | 0, Y = Ye.rotrSH(M, U, 1) ^ Ye.rotrSH(M, U, 8) ^ Ye.shrSH(M, U, 7), le = Ye.rotrSL(M, U, 1) ^ Ye.rotrSL(M, U, 8) ^ Ye.shrSL(M, U, 7), ne = Us[k - 2] | 0, q = Hs[k - 2] | 0, m = Ye.rotrSH(ne, q, 19) ^ Ye.rotrBH(ne, q, 61) ^ Ye.shrSH(ne, q, 6), I = Ye.rotrSL(ne, q, 19) ^ Ye.rotrBL(ne, q, 61) ^ Ye.shrSL(ne, q, 6), N = Ye.add4L(le, I, Hs[k - 7], Hs[k - 16]), _ = Ye.add4H(N, Y, m, Us[k - 7], Us[k - 16]);
      Us[k] = _ | 0, Hs[k] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: C, Hh: P, Hl: H } = this;
    for (let k = 0; k < 80; k++) {
      const M = Ye.rotrSH(u, w, 14) ^ Ye.rotrSH(u, w, 18) ^ Ye.rotrBH(u, w, 41), U = Ye.rotrSL(u, w, 14) ^ Ye.rotrSL(u, w, 18) ^ Ye.rotrBL(u, w, 41), Y = u & y ^ ~u & v, le = w & S ^ ~w & C, ne = Ye.add5L(H, U, le, YE[k], Hs[k]), q = Ye.add5H(ne, P, M, Y, VE[k], Us[k]), m = ne | 0, I = Ye.rotrSH(r, s, 28) ^ Ye.rotrBH(r, s, 34) ^ Ye.rotrBH(r, s, 39), N = Ye.rotrSL(r, s, 28) ^ Ye.rotrBL(r, s, 34) ^ Ye.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = C | 0, v = y | 0, C = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Ye.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = Ye.add3L(m, N, W);
      r = Ye.add3H(R, q, I, _), s = R | 0;
    }
    ({ h: r, l: s } = Ye.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ye.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ye.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = Ye.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = Ye.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Ye.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: C } = Ye.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: P, l: H } = Ye.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, C, P, H);
  }
  roundClean() {
    Us.fill(0), Hs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, XE = class extends Nl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, qE = class extends Nl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, WE = class extends Nl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Xi(() => new Nl());
Xi(() => new XE());
const ZE = Xi(() => new qE());
Xi(() => new WE());
var st;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(st || (st = {}));
var Jt;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(Jt || (Jt = {}));
function Af(e) {
  return Jt[e];
}
const JE = () => ({ type: st.BoolTrue }), QE = () => ({ type: st.BoolFalse }), eA = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: st.Buffer, value: Te(e) };
}, Op = BigInt("0xffffffffffffffffffffffffffffffff"), tA = BigInt(0), Dp = BigInt("0x7fffffffffffffffffffffffffffffff"), Fp = BigInt("-170141183460469231731687303715884105728"), nA = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = zu(ct(e))), On(e, Uint8Array) && (e = zu(e));
  const t = vn(e);
  if (t > Dp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Dp}`);
  if (t < Fp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Fp}`);
  return { type: st.Int, value: t };
}, rA = (e) => {
  const t = vn(e);
  if (t < tA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Op)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Op}`);
  return { type: st.UInt, value: t };
};
function sA(e) {
  return { type: st.List, value: e };
}
function ww() {
  return { type: st.OptionalNone };
}
function mw(e) {
  return { type: st.OptionalSome, value: e };
}
var we;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(we || (we = {}));
function iA() {
  return {
    type: we.Address,
    version: Hi.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function jp(e) {
  if (e && Iw(e, Jc))
    throw new Error(`Memo exceeds maximum length of ${Jc} bytes`);
  return { type: we.MemoString, content: e };
}
function kf(e, t) {
  return {
    type: we.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function fd(e) {
  if (ct(e).byteLength != Bl)
    throw Error("Invalid signature");
  return {
    type: we.MessageSignature,
    data: e
  };
}
function oA(e, t, n) {
  return typeof e == "string" && (e = vA(e)), typeof n == "string" && (n = jp(n)), {
    type: we.Payload,
    payloadType: ht.TokenTransfer,
    recipient: e,
    amount: vn(t),
    memo: n ?? jp("")
  };
}
function aA(e, t, n, r) {
  return typeof t == "string" && (t = Br(t)), typeof n == "string" && (n = Br(n)), {
    type: we.Payload,
    payloadType: ht.ContractCall,
    contractAddress: typeof e == "string" ? ri(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function cA(e) {
  return Br(e, 4, 1e5);
}
function Rp(e, t, n) {
  return typeof e == "string" && (e = Br(e)), typeof t == "string" && (t = cA(t)), typeof n == "number" ? {
    type: we.Payload,
    payloadType: ht.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: we.Payload,
    payloadType: ht.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function lA() {
  return { type: we.Payload, payloadType: ht.PoisonMicroblock };
}
function zp(e, t) {
  if (e.byteLength != Ei)
    throw Error(`Coinbase buffer size must be ${Ei} bytes`);
  return t != null ? {
    type: we.Payload,
    payloadType: ht.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: we.Payload,
    payloadType: ht.Coinbase,
    coinbaseBytes: e
  };
}
function uA(e, t, n) {
  if (e.byteLength != Ei)
    throw Error(`Coinbase buffer size must be ${Ei} bytes`);
  if (n.byteLength != id)
    throw Error(`VRF proof buffer size must be ${id} bytes`);
  return {
    type: we.Payload,
    payloadType: ht.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === st.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function dA(e, t, n, r, s, i, o) {
  return {
    type: we.Payload,
    payloadType: ht.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Br(e, t, n) {
  const r = t || 1, s = n || Xv;
  if (Iw(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: we.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function fA(e, t, n) {
  return {
    type: we.Asset,
    address: ri(e),
    contractName: Br(t),
    assetName: Br(n)
  };
}
function ri(e) {
  const t = Yi.c32addressDecode(e);
  return {
    type: we.Address,
    version: t[0],
    hash160: t[1]
  };
}
function hA(e, t) {
  const n = ri(e), r = Br(t);
  return {
    type: we.Principal,
    prefix: Ln.Contract,
    address: n,
    contractName: r
  };
}
function pA(e) {
  const t = ri(e);
  return {
    type: we.Principal,
    prefix: Ln.Standard,
    address: t
  };
}
function mo(e, t) {
  return {
    pubKeyEncoding: e,
    type: we.TransactionAuthField,
    contents: t
  };
}
function ss(e) {
  switch (e.type) {
    case we.Address:
      return Ha(e);
    case we.Principal:
      return bw(e);
    case we.LengthPrefixedString:
      return Uo(e);
    case we.MemoString:
      return yA(e);
    case we.Asset:
      return Sw(e);
    case we.PostCondition:
      return Ew(e);
    case we.PublicKey:
      return gd(e);
    case we.LengthPrefixedList:
      return $f(e);
    case we.Payload:
      return Aw(e);
    case we.TransactionAuthField:
      return SA(e);
    case we.MessageSignature:
      return If(e);
  }
}
function Ha(e) {
  const t = [];
  return t.push(ct(Ba(e.version, 1))), t.push(ct(e.hash160)), Vt(t);
}
function Po(e) {
  const t = On(e, It) ? e : new It(e), n = ml(Te(t.readBytes(1))), r = Te(t.readBytes(20));
  return { type: we.Address, version: n, hash160: r };
}
function bw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === Ln.Standard || e.prefix === Ln.Contract) && t.push(Ha(e.address)), e.prefix === Ln.Contract && t.push(Uo(e.contractName)), Vt(t);
}
function gA(e) {
  const t = On(e, It) ? e : new It(e), n = t.readUInt8Enum(Ln, (i) => {
    throw new $n(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Ln.Origin)
    return { type: we.Principal, prefix: n };
  const r = Po(t);
  if (n === Ln.Standard)
    return { type: we.Principal, prefix: n, address: r };
  const s = ur(t);
  return {
    type: we.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Uo(e) {
  const t = [], n = zi(e.content), r = n.byteLength;
  return t.push(ct(Ba(r, e.lengthPrefixBytes))), t.push(n), Vt(t);
}
function ur(e, t, n) {
  t = t || 1;
  const r = On(e, It) ? e : new It(e), s = ml(Te(r.readBytes(t))), i = Ma(r.readBytes(s));
  return Br(i, t, n ?? 128);
}
function yA(e) {
  const t = [], n = zi(e.content), r = GA(Te(n), Jc * 2);
  return t.push(ct(r)), Vt(t);
}
function xw(e) {
  const t = On(e, It) ? e : new It(e);
  let n = Ma(t.readBytes(Jc));
  return n = n.replace(/\u0000*$/, ""), { type: we.MemoString, content: n };
}
function Sw(e) {
  const t = [];
  return t.push(Ha(e.address)), t.push(Uo(e.contractName)), t.push(Uo(e.assetName)), Vt(t);
}
function hd(e) {
  const t = On(e, It) ? e : new It(e);
  return {
    type: we.Asset,
    address: Po(t),
    contractName: ur(t),
    assetName: ur(t)
  };
}
function $f(e) {
  const t = e.values, n = [];
  n.push(ct(Ba(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(ss(r));
  return Vt(n);
}
function vw(e, t, n) {
  const r = On(e, It) ? e : new It(e), s = ml(Te(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (t) {
      case we.Address:
        i.push(Po(r));
        break;
      case we.LengthPrefixedString:
        i.push(ur(r));
        break;
      case we.MemoString:
        i.push(xw(r));
        break;
      case we.Asset:
        i.push(hd(r));
        break;
      case we.PostCondition:
        i.push(mA(r));
        break;
      case we.PublicKey:
        i.push(yd(r));
        break;
      case we.TransactionAuthField:
        i.push(xA(r));
        break;
    }
  return kf(i, n);
}
function wA(e) {
  return Te(Ew(e));
}
function Ew(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(bw(e.principal)), (e.conditionType === Bt.Fungible || e.conditionType === Bt.NonFungible) && t.push(Sw(e.asset)), e.conditionType === Bt.NonFungible && t.push(Gr(e.assetName)), t.push(e.conditionCode), e.conditionType === Bt.STX || e.conditionType === Bt.Fungible || e.conditionType === Bt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new wo("The post-condition amount may not be larger than 8 bytes");
    t.push(ti(e.amount, 8));
  }
  return Vt(t);
}
function mA(e) {
  const t = On(e, It) ? e : new It(e), n = t.readUInt8Enum(Bt, (a) => {
    throw new $n(`Could not read ${a} as PostConditionType`);
  }), r = gA(t);
  let s, i, o;
  switch (n) {
    case Bt.STX:
      return s = t.readUInt8Enum(pa, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Te(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: Bt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Bt.Fungible:
      return i = hd(t), s = t.readUInt8Enum(pa, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Te(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: Bt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Bt.NonFungible:
      i = hd(t);
      const a = jr(t);
      return s = t.readUInt8Enum(ad, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: we.PostCondition,
        conditionType: Bt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Bt.Staking:
      return s = t.readUInt8Enum(pa, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Te(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: Bt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Bt.PoX: {
      const c = t.readUInt8Enum(cd, (d) => {
        throw new $n(`Could not read ${d} as PoxConditionCode`);
      });
      return {
        type: we.PostCondition,
        conditionType: Bt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Aw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case ht.TokenTransfer:
      t.push(Gr(e.recipient)), t.push(ti(e.amount, 8)), t.push(ss(e.memo));
      break;
    case ht.ContractCall:
      t.push(ss(e.contractAddress)), t.push(ss(e.contractName)), t.push(ss(e.functionName));
      const n = new Uint8Array(4);
      Ii(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Gr(r));
      });
      break;
    case ht.SmartContract:
      t.push(ss(e.contractName)), t.push(ss(e.codeBody));
      break;
    case ht.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(ss(e.contractName)), t.push(ss(e.codeBody));
      break;
    case ht.PoisonMicroblock:
      break;
    case ht.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case ht.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Gr(e.recipient));
      break;
    case ht.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Gr(e.recipient ? mw(e.recipient) : ww())), t.push(e.vrfProof);
      break;
    case ht.TenureChange:
      t.push(ct(e.tenureHash)), t.push(ct(e.previousTenureHash)), t.push(ct(e.burnViewHash)), t.push(ct(e.previousTenureEnd)), t.push(Ii(new Uint8Array(4), e.previousTenureBlocks)), t.push(g1(new Uint8Array(1), e.cause)), t.push(ct(e.publicKeyHash));
      break;
  }
  return Vt(t);
}
function bA(e) {
  const t = On(e, It) ? e : new It(e);
  switch (t.readUInt8Enum(ht, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case ht.TokenTransfer:
      const r = jr(t), s = vn(t.readBytes(8)), i = xw(t);
      return oA(r, s, i);
    case ht.ContractCall:
      const o = Po(t), a = ur(t), c = ur(t), d = [], h = t.readUInt32BE();
      for (let M = 0; M < h; M++) {
        const U = jr(t);
        d.push(U);
      }
      return aA(o, a, c, d);
    case ht.SmartContract:
      const u = ur(t), w = ur(t, 4, 1e5);
      return Rp(u, w);
    case ht.VersionedSmartContract: {
      const M = t.readUInt8Enum(od, (le) => {
        throw new Error(`Cannot recognize ClarityVersion: ${le}`);
      }), U = ur(t), Y = ur(t, 4, iE);
      return Rp(U, Y, M);
    }
    case ht.PoisonMicroblock:
      return lA();
    case ht.Coinbase: {
      const M = t.readBytes(Ei);
      return zp(M);
    }
    case ht.CoinbaseToAltRecipient: {
      const M = t.readBytes(Ei), U = jr(t);
      return zp(M, U);
    }
    case ht.NakamotoCoinbase: {
      const M = t.readBytes(Ei), U = jr(t), Y = t.readBytes(id);
      return uA(M, U, Y);
    }
    case ht.TenureChange:
      const y = Te(t.readBytes(20)), S = Te(t.readBytes(20)), v = Te(t.readBytes(20)), C = Te(t.readBytes(32)), P = t.readUInt32BE(), H = t.readUInt8Enum(ld, (M) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${M}`);
      }), k = Te(t.readBytes(20));
      return dA(y, S, v, C, P, H, k);
  }
}
function pd(e) {
  const t = On(e, It) ? e : new It(e);
  return fd(Te(t.readBytes(Bl)));
}
function xA(e) {
  const t = On(e, It) ? e : new It(e), n = t.readUInt8Enum($r, (r) => {
    throw new $n(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case $r.PublicKeyCompressed:
      return mo(Pt.Compressed, yd(t));
    case $r.PublicKeyUncompressed:
      return mo(Pt.Uncompressed, Go(tk(yd(t).data)));
    case $r.SignatureCompressed:
      return mo(Pt.Compressed, pd(t));
    case $r.SignatureUncompressed:
      return mo(Pt.Uncompressed, pd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function If(e) {
  return ct(e.data);
}
function SA(e) {
  const t = [];
  switch (e.contents.type) {
    case we.PublicKey:
      t.push(e.pubKeyEncoding === Pt.Compressed ? $r.PublicKeyCompressed : $r.PublicKeyUncompressed), t.push(ct(ek(e.contents.data)));
      break;
    case we.MessageSignature:
      t.push(e.pubKeyEncoding === Pt.Compressed ? $r.SignatureCompressed : $r.SignatureUncompressed), t.push(If(e.contents));
      break;
  }
  return Vt(t);
}
function gd(e) {
  return e.data.slice();
}
function yd(e) {
  const t = On(e, It) ? e : new It(e), n = t.readUInt8(), r = n === 4 ? Zv : Wv;
  return Go(Vt([n, t.readBytes(r)]));
}
function Lf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Et.P2PKH || t === Et.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Et.P2WPKH || t === Et.P2WSH || t === Et.P2WSHNonSequential) && !r.map((s) => s.data).every(Ko))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Et.P2PKH:
      return ac(e, KA(r[0].data));
    case Et.P2WPKH:
      return ac(e, VA(r[0].data));
    case Et.P2SH:
    case Et.P2SHNonSequential:
      return ac(e, YA(n, r.map(gd)));
    case Et.P2WSH:
    case Et.P2WSHNonSequential:
      return ac(e, XA(n, r.map(gd)));
  }
}
function ac(e, t) {
  return { type: we.Address, version: e, hash160: t };
}
function Cf(e) {
  return Yi.c32address(e.version, e.hash160);
}
function Gp(e) {
  const [t, n, r] = e.split(/\.|::/);
  return fA(t, n, r);
}
function na(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return hA(t, n);
  } else
    return pA(e);
}
function vA(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return kA(t, n);
  } else
    return EA(e);
}
function EA(e) {
  const t = ri(e);
  return { type: st.PrincipalStandard, value: Cf(t) };
}
function AA(e) {
  return { type: st.PrincipalStandard, value: Cf(e) };
}
function kA(e, t) {
  const n = ri(e), r = Br(t);
  return kw(n, r);
}
function kw(e, t) {
  if (zi(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: st.PrincipalContract,
    value: `${Cf(e)}.${t.content}`
  };
}
function $A(e) {
  return { type: st.ResponseErr, value: e };
}
function IA(e) {
  return { type: st.ResponseOk, value: e };
}
const LA = (e) => ({ type: st.StringASCII, value: e }), CA = (e) => ({ type: st.StringUTF8, value: e });
function TA(e) {
  for (const t in e)
    if (!qA(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: st.Tuple, value: e };
}
function jr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new It(ct(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new It(e) : t = e;
  switch (t.readUInt8Enum(Jt, (r) => {
    throw new $n(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Jt.int:
      return nA(zu(t.readBytes(16)));
    case Jt.uint:
      return rA(t.readBytes(16));
    case Jt.buffer:
      const r = t.readUInt32BE();
      return eA(t.readBytes(r));
    case Jt.true:
      return JE();
    case Jt.false:
      return QE();
    case Jt.address:
      const s = Po(t);
      return AA(s);
    case Jt.contract:
      const i = Po(t), o = ur(t);
      return kw(i, o);
    case Jt.ok:
      return IA(jr(t));
    case Jt.err:
      return $A(jr(t));
    case Jt.none:
      return ww();
    case Jt.some:
      return mw(jr(t));
    case Jt.list:
      const a = t.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(jr(t));
      return sA(c);
    case Jt.tuple:
      const d = t.readUInt32BE(), h = {};
      for (let v = 0; v < d; v++) {
        const C = ur(t).content;
        if (C === void 0)
          throw new $n('"content" is undefined');
        h[C] = jr(t);
      }
      return TA(h);
    case Jt.ascii:
      const u = t.readUInt32BE(), w = a1(t.readBytes(u));
      return LA(w);
    case Jt.utf8:
      const y = t.readUInt32BE(), S = Ma(t.readBytes(y));
      return CA(S);
    default:
      throw new $n("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Xr(e, t) {
  return Vt([Af(e), t]);
}
function BA(e) {
  return new Uint8Array([Af(e.type)]);
}
function MA(e) {
  return e.type === st.OptionalNone ? new Uint8Array([Af(e.type)]) : Xr(e.type, Gr(e.value));
}
function NA(e) {
  const t = new Uint8Array(4);
  return Ii(t, Math.ceil(e.value.length / 2), 0), Xr(e.type, Vr(t, ct(e.value)));
}
function _A(e) {
  const t = Wd(n1(BigInt(e.value), BigInt(qv)), cw);
  return Xr(e.type, t);
}
function PA(e) {
  const t = Wd(BigInt(e.value), cw);
  return Xr(e.type, t);
}
function UA(e) {
  return Xr(e.type, Ha(ri(e.value)));
}
function HA(e) {
  const [t, n] = WA(e.value);
  return Xr(e.type, Vr(Ha(ri(t)), Uo(Br(n))));
}
function OA(e) {
  return Xr(e.type, Gr(e.value));
}
function DA(e) {
  const t = [], n = new Uint8Array(4);
  Ii(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = Gr(r);
    t.push(s);
  }
  return Xr(e.type, Vt(t));
}
function FA(e) {
  const t = [], n = new Uint8Array(4);
  Ii(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Br(s);
    t.push(Uo(i));
    const o = Gr(e.value[s]);
    t.push(o);
  }
  return Xr(e.type, Vt(t));
}
function $w(e, t) {
  const n = [], r = t == "ascii" ? o1(e.value) : zi(e.value), s = new Uint8Array(4);
  return Ii(s, r.length, 0), n.push(s), n.push(r), Xr(e.type, Vt(n));
}
function jA(e) {
  return $w(e, "ascii");
}
function RA(e) {
  return $w(e, "utf8");
}
function Kp(e) {
  return Te(Gr(e));
}
function Gr(e) {
  switch (e.type) {
    case st.BoolTrue:
    case st.BoolFalse:
      return BA(e);
    case st.OptionalNone:
    case st.OptionalSome:
      return MA(e);
    case st.Buffer:
      return NA(e);
    case st.UInt:
      return PA(e);
    case st.Int:
      return _A(e);
    case st.PrincipalStandard:
      return UA(e);
    case st.PrincipalContract:
      return HA(e);
    case st.ResponseOk:
    case st.ResponseErr:
      return OA(e);
    case st.List:
      return DA(e);
    case st.Tuple:
      return FA(e);
    case st.StringASCII:
      return jA(e);
    case st.StringUTF8:
      return RA(e);
    default:
      throw new wo("Unable to serialize. Invalid Clarity Value.");
  }
}
const zA = (e) => e.length % 2 ? `0${e}` : e, GA = (e, t) => e.padEnd(t, "0"), Iw = (e, t) => e ? zi(e).length > t : !1;
function wd(e) {
  return sw(e);
}
const xa = (e) => AE(Sf(e)), Tf = (e) => Te(ZE(e)), KA = (e) => Te(xa(e)), VA = (e) => {
  const t = xa(e), n = Vr(new Uint8Array([0]), new Uint8Array([t.length]), t), r = xa(n);
  return Te(r);
}, YA = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = Vt(n), s = xa(r);
  return Te(s);
}, XA = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Vt(n), s = Sf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Vt(i), a = xa(o);
  return Te(a);
};
function qA(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function WA(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
Ft.hmacSha256Sync = (e, ...t) => {
  const n = fw.create(Sf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Go(e) {
  return e = typeof e == "string" ? ct(e) : e, {
    type: we.PublicKey,
    data: e
  };
}
function ZA(e, t, n = Pt.Compressed) {
  const r = d1(t), s = new Zn(Kh(r.r), Kh(r.s)), i = Je.fromSignature(e, s, r.recoveryId), o = n === Pt.Compressed;
  return i.toHex(o);
}
function JA(e) {
  return typeof e == "string" ? e : Te(e);
}
const Bf = JA;
function Lw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === u1;
}
function Ko(e) {
  return !Bf(e).startsWith("04");
}
function QA(e) {
  e = Zd(e);
  const t = Lw(e);
  return Te(Na(e.slice(0, 32), t));
}
function ek(e) {
  return Je.fromHex(Bf(e)).toHex(!0);
}
function tk(e) {
  return Je.fromHex(Bf(e)).toHex(!1);
}
function nk(e, t) {
  e = Zd(e);
  const [n, r] = xl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ba(r, 1) + Zn.fromHex(n).toCompactHex();
}
function Mf() {
  return {
    type: we.MessageSignature,
    data: Te(new Uint8Array(Bl))
  };
}
function Cw(e, t, n, r) {
  const s = Lf(0, e, 1, [Go(t)]).hash160, i = Ko(t) ? Pt.Compressed : Pt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: vn(n),
    fee: vn(r),
    keyEncoding: i,
    signature: Mf()
  };
}
function Sa(e) {
  return "signature" in e;
}
function Vp(e) {
  return e === Et.P2SH || e === Et.P2WSH;
}
function rk(e) {
  return e === Et.P2SHNonSequential || e === Et.P2WSHNonSequential;
}
function Yp(e) {
  const t = wd(e);
  return t.nonce = 0, t.fee = 0, Sa(t) ? t.signature = Mf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function sk(e) {
  const t = [
    e.hashMode,
    ct(e.signer),
    ti(e.nonce, 8),
    ti(e.fee, 8),
    e.keyEncoding,
    If(e.signature)
  ];
  return Vt(t);
}
function ik(e) {
  const t = [
    e.hashMode,
    ct(e.signer),
    ti(e.nonce, 8),
    ti(e.fee, 8)
  ], n = kf(e.fields);
  t.push($f(n));
  const r = new Uint8Array(2);
  return h1(r, e.signaturesRequired, 0), t.push(r), Vt(t);
}
function ok(e, t) {
  const n = Te(t.readBytes(20)), r = BigInt(`0x${Te(t.readBytes(8))}`), s = BigInt(`0x${Te(t.readBytes(8))}`), i = t.readUInt8Enum(Pt, (a) => {
    throw new $n(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Et.P2WPKH && i != Pt.Compressed)
    throw new $n("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = pd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function ak(e, t) {
  const n = Te(t.readBytes(20)), r = BigInt("0x" + Te(t.readBytes(8))), s = BigInt("0x" + Te(t.readBytes(8))), i = vw(t, we.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const d of i)
    switch (d.contents.type) {
      case we.PublicKey:
        Ko(d.contents.data) || (o = !0);
        break;
      case we.MessageSignature:
        if (d.pubKeyEncoding === Pt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new bi("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (o && (e === Et.P2WSH || e === Et.P2WSHNonSequential))
    throw new bi("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function du(e) {
  return Sa(e) ? sk(e) : ik(e);
}
function fu(e) {
  const t = e.readUInt8Enum(Et, (n) => {
    throw new $n(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Et.P2PKH || t === Et.P2WPKH ? ok(t, e) : ak(t, e);
}
function Tw(e, t, n, r) {
  const i = e + Te(new Uint8Array([t])) + Te(ti(n, 8)) + Te(ti(r, 8));
  if (ct(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Tf(ct(i));
}
function Bw(e, t, n) {
  const r = 33 + Bl, s = Ko(t.data) ? Pt.Compressed : Pt.Uncompressed, i = e + zA(s.toString(16)) + n, o = ct(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Tf(o);
}
function ck(e, t, n, r, s) {
  const i = Tw(e, t, n, r), o = nk(s, i), a = Go(QA(s)), c = Bw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Mw(e, t, n, r, s, i) {
  const o = Tw(e, t, n, r), a = Go(ZA(o, i, s)), c = Bw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function lk() {
  const e = Cw(Et.P2PKH, "", 0, 0);
  return e.signer = iA().hash160, e.keyEncoding = Pt.Compressed, e.signature = Mf(), e;
}
function Xp(e, t, n) {
  return Sa(e) ? uk(e, t, n) : dk(e, t, n);
}
function uk(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Mw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), i = Lf(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new bi(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function dk(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case we.PublicKey:
        Ko(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case we.MessageSignature:
        c.pubKeyEncoding === Pt.Uncompressed && (i = !0);
        const { pubKey: d, nextSigHash: h } = Mw(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (Vp(e.hashMode) && (s = h), r.push(d), o += 1, o === 65536)
          throw new bi("Too many signatures");
        break;
    }
  if (Vp(e.hashMode) && o !== e.signaturesRequired || rk(e.hashMode) && o < e.signaturesRequired)
    throw new bi("Incorrect number of signatures");
  if (i && (e.hashMode === Et.P2WSH || e.hashMode === Et.P2WSHNonSequential))
    throw new bi("Uncompressed keys are not allowed in this hash mode");
  const a = Lf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new bi(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Nw(e) {
  return {
    authType: Ot.Standard,
    spendingCondition: e
  };
}
function _w(e, t) {
  return {
    authType: Ot.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Cw(Et.P2PKH, "0".repeat(66), 0, 0)
  };
}
function qp(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Ot.Standard:
        return Nw(Yp(e.spendingCondition));
      case Ot.Sponsored:
        return _w(Yp(e.spendingCondition), lk());
      default:
        throw new el("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function fk(e, t) {
  switch (e.authType) {
    case Ot.Standard:
      return Xp(e.spendingCondition, t, Ot.Standard);
    case Ot.Sponsored:
      return Xp(e.spendingCondition, t, Ot.Standard);
    default:
      throw new el("Invalid origin auth type");
  }
}
function hk(e, t) {
  switch (e.authType) {
    case Ot.Standard:
      const n = {
        ...e.spendingCondition,
        fee: vn(t)
      };
      return { ...e, spendingCondition: n };
    case Ot.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: vn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function pk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: vn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function gk(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: vn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function yk(e, t) {
  const n = {
    ...t,
    nonce: vn(t.nonce),
    fee: vn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function wk(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Ot.Standard:
      t.push(du(e.spendingCondition));
      break;
    case Ot.Sponsored:
      t.push(du(e.spendingCondition)), t.push(du(e.sponsorSpendingCondition));
      break;
  }
  return Vt(t);
}
function mk(e) {
  const t = e.readUInt8Enum(Ot, (r) => {
    throw new $n(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Ot.Standard:
      return n = fu(e), Nw(n);
    case Ot.Sponsored:
      n = fu(e);
      const r = fu(e);
      return _w(n, r);
  }
}
class bk {
  constructor({ auth: t, payload: n, postConditions: r = kf([]), postConditionMode: s = Qc.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Vv(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: vn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Yn.Any;
  }
  signBegin() {
    const t = wd(this);
    return t.auth = qp(t.auth), t.txid();
  }
  verifyBegin() {
    const t = wd(this);
    return t.auth = qp(t.auth), t.txid();
  }
  verifyOrigin() {
    return fk(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Ot.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Ot.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Ot.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : Go(t), r = this.auth.spendingCondition;
    if (r && !Sa(r)) {
      const s = Ko(n.data);
      r.fields.push(mo(s ? Pt.Compressed : Pt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = ck(n, r, t.fee, t.nonce, s);
    if (Sa(t))
      t.signature = fd(i);
    else {
      const a = Lw(s);
      t.fields.push(mo(a ? Pt.Compressed : Pt.Uncompressed, fd(i)));
    }
    return o;
  }
  txid() {
    const t = this.serializeBytes();
    return Tf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Ot.Sponsored)
      throw new el("Cannot sponsor sign a non-sponsored transaction");
    this.auth = yk(this.auth, t);
  }
  setFee(t) {
    this.auth = hk(this.auth, t);
  }
  setNonce(t) {
    this.auth = pk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Ot.Sponsored)
      throw new el("Cannot sponsor sign a non-sponsored transaction");
    this.auth = gk(this.auth, t);
  }
  serialize() {
    return Te(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new wo('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new wo('"chainId" is undefined');
    if (this.auth === void 0)
      throw new wo('"auth" is undefined');
    if (this.payload === void 0)
      throw new wo('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Ii(n, this.chainId, 0), t.push(n), t.push(wk(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push($f(this.postConditions)), t.push(Aw(this.payload)), Vt(t);
  }
}
function xk(e) {
  const t = On(e, It) ? e : new It(e), n = t.readUInt8Enum(Ui, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = mk(t), i = t.readUInt8Enum(Yn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = t.readUInt8Enum(Qc, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = vw(t, we.PostCondition), c = bA(t), d = new bk({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return d.anchorMode = i, d;
}
const Wp = BigInt("18446744073709551615");
function hu(e) {
  const t = vn(e);
  if (t < 0n || t > Wp)
    throw new RangeError(`Post-condition amount must be between 0 and ${Wp} (u64 max), received: ${t}`);
  return t;
}
var md;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(md || (md = {}));
var bd;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(bd || (bd = {}));
function Sk(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Bt.STX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : na(e.address),
        conditionCode: cc(e.condition),
        amount: hu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Bt.Fungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : na(e.address),
        conditionCode: cc(e.condition),
        amount: hu(e.amount),
        asset: Gp(e.asset)
      };
    case "nft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Bt.NonFungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : na(e.address),
        conditionCode: cc(e.condition),
        asset: Gp(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Bt.Staking,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : na(e.address),
        conditionCode: cc(e.condition),
        amount: hu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Bt.PoX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : na(e.address),
        conditionCode: vk(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function cc(e) {
  return md[e];
}
function vk(e) {
  return bd[e];
}
function Pw(e) {
  const t = Sk(e);
  return wA(t);
}
function Ek(e, t, n) {
  return _f(Uw(e), n);
}
function Uw(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = va(r);
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
    return BigInt(`0x${$k(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Nf(e, t = 8) {
  return (typeof e == "bigint" ? e : Uw(e)).toString(16).padStart(t * 2, "0");
}
function _f(e, t = 16) {
  const n = Nf(e, t);
  return va(n);
}
function Ak(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const kk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function $k(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += kk[n];
  return t;
}
function va(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = t.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Pf(e) {
  return new TextEncoder().encode(e);
}
function Ik(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Lk(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Zp(e) {
  if (e.some(Lk))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Uf(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function hs(e) {
  return Uf(...e.map((t) => typeof t == "number" ? Zp([t]) : t instanceof Array ? Zp(t) : t));
}
function _l(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var xd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(xd || (xd = {}));
xd.Mainnet;
const Ck = 128, Tk = 128, Hw = 16;
var Sd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Sd || (Sd = {}));
var Jp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Jp || (Jp = {}));
var Qp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Qp || (Qp = {}));
var Ar;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Ar || (Ar = {}));
const pu = ["onChainOnly", "offChainOnly", "any"];
pu[0] + "", Ar.OnChainOnly, pu[1] + "", Ar.OffChainOnly, pu[2] + "", Ar.Any, Ar.OnChainOnly + "", Ar.OnChainOnly, Ar.OffChainOnly + "", Ar.OffChainOnly, Ar.Any + "", Ar.Any;
var vd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(vd || (vd = {}));
vd.Mainnet;
var e0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(e0 || (e0 = {}));
var gi;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(gi || (gi = {}));
var t0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(t0 || (t0 = {}));
var n0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(n0 || (n0 = {}));
var r0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(r0 || (r0 = {}));
var s0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(s0 || (s0 = {}));
var i0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(i0 || (i0 = {}));
var o0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(o0 || (o0 = {}));
var Ed;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ed || (Ed = {}));
var a0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(a0 || (a0 = {}));
var c0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(c0 || (c0 = {}));
function Ad(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Bk(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Ow(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Mk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ad(e.outputLen), Ad(e.blockLen);
}
function Nk(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function _k(e, t) {
  Ow(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const gu = {
  number: Ad,
  bool: Bk,
  bytes: Ow,
  hash: Mk,
  exists: Nk,
  output: _k
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const yu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Or = (e, t) => e << 32 - t | e >>> t, Pk = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Pk)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Uk(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Dw(e) {
  if (typeof e == "string" && (e = Uk(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Hk = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function qi(e) {
  const t = (r) => e().update(Dw(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Ok(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
let Hf = class extends Hk {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = yu(this.buffer);
  }
  update(t) {
    gu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Dw(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = yu(t);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    gu.exists(this), gu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Ok(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = yu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, h[u], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const Dk = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fw = Uint8Array.from({ length: 16 }, (e, t) => t), Fk = Fw.map((e) => (9 * e + 5) % 16);
let Of = [Fw], Df = [Fk];
for (let e = 0; e < 4; e++)
  for (let t of [Of, Df])
    t.push(t[e].map((n) => Dk[n]));
const jw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), jk = Of.map((e, t) => e.map((n) => jw[t][n])), Rk = Df.map((e, t) => e.map((n) => jw[t][n])), zk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Gk = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), lc = (e, t) => e << t | e >>> 32 - t;
function l0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const uc = new Uint32Array(16);
let Kk = class extends Hf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      uc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, d = this.h3 | 0, h = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = zk[y], C = Gk[y], P = Of[y], H = Df[y], k = jk[y], M = Rk[y];
      for (let U = 0; U < 16; U++) {
        const Y = lc(r + l0(y, i, a, d) + uc[P[U]] + v, k[U]) + u | 0;
        r = u, u = d, d = lc(a, 10) | 0, a = i, i = Y;
      }
      for (let U = 0; U < 16; U++) {
        const Y = lc(s + l0(S, o, c, h) + uc[H[U]] + C, M[U]) + w | 0;
        s = w, w = h, h = lc(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    uc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
qi(() => new Kk());
const Vk = (e, t, n) => e & t ^ ~e & n, Yk = (e, t, n) => e & t ^ e & n ^ t & n, Xk = new Uint32Array([
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
]), Ds = new Uint32Array(64);
let Rw = class extends Hf {
  constructor() {
    super(64, 32, 8, !1), this.A = Os[0] | 0, this.B = Os[1] | 0, this.C = Os[2] | 0, this.D = Os[3] | 0, this.E = Os[4] | 0, this.F = Os[5] | 0, this.G = Os[6] | 0, this.H = Os[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [t, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let u = 0; u < 16; u++, n += 4)
      Ds[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Ds[u - 15], y = Ds[u - 2], S = Or(w, 7) ^ Or(w, 18) ^ w >>> 3, v = Or(y, 17) ^ Or(y, 19) ^ y >>> 10;
      Ds[u] = v + Ds[u - 7] + S + Ds[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Or(a, 6) ^ Or(a, 11) ^ Or(a, 25), y = h + w + Vk(a, c, d) + Xk[u] + Ds[u] | 0, v = (Or(r, 2) ^ Or(r, 13) ^ Or(r, 22)) + Yk(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Ds.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, qk = class extends Rw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
qi(() => new Rw());
qi(() => new qk());
const dc = BigInt(2 ** 32 - 1), kd = BigInt(32);
function zw(e, t = !1) {
  return t ? { h: Number(e & dc), l: Number(e >> kd & dc) } : { h: Number(e >> kd & dc) | 0, l: Number(e & dc) | 0 };
}
function Wk(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = zw(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Zk = (e, t) => BigInt(e >>> 0) << kd | BigInt(t >>> 0), Jk = (e, t, n) => e >>> n, Qk = (e, t, n) => e << 32 - n | t >>> n, e3 = (e, t, n) => e >>> n | t << 32 - n, t3 = (e, t, n) => e << 32 - n | t >>> n, n3 = (e, t, n) => e << 64 - n | t >>> n - 32, r3 = (e, t, n) => e >>> n - 32 | t << 64 - n, s3 = (e, t) => t, i3 = (e, t) => e, o3 = (e, t, n) => e << n | t >>> 32 - n, a3 = (e, t, n) => t << n | e >>> 32 - n, c3 = (e, t, n) => t << n - 32 | e >>> 64 - n, l3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function u3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const d3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), f3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, h3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), p3 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, g3 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), y3 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Xe = {
  fromBig: zw,
  split: Wk,
  toBig: Zk,
  shrSH: Jk,
  shrSL: Qk,
  rotrSH: e3,
  rotrSL: t3,
  rotrBH: n3,
  rotrBL: r3,
  rotr32H: s3,
  rotr32L: i3,
  rotlSH: o3,
  rotlSL: a3,
  rotlBH: c3,
  rotlBL: l3,
  add: u3,
  add3L: d3,
  add3H: f3,
  add4L: h3,
  add4H: p3,
  add5H: y3,
  add5L: g3
}, [w3, m3] = Xe.split([
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
].map((e) => BigInt(e))), Fs = new Uint32Array(80), js = new Uint32Array(80);
let Pl = class extends Hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: C } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let k = 0; k < 16; k++, n += 4)
      Fs[k] = t.getUint32(n), js[k] = t.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const M = Fs[k - 15] | 0, U = js[k - 15] | 0, Y = Xe.rotrSH(M, U, 1) ^ Xe.rotrSH(M, U, 8) ^ Xe.shrSH(M, U, 7), le = Xe.rotrSL(M, U, 1) ^ Xe.rotrSL(M, U, 8) ^ Xe.shrSL(M, U, 7), ne = Fs[k - 2] | 0, q = js[k - 2] | 0, m = Xe.rotrSH(ne, q, 19) ^ Xe.rotrBH(ne, q, 61) ^ Xe.shrSH(ne, q, 6), I = Xe.rotrSL(ne, q, 19) ^ Xe.rotrBL(ne, q, 61) ^ Xe.shrSL(ne, q, 6), N = Xe.add4L(le, I, js[k - 7], js[k - 16]), _ = Xe.add4H(N, Y, m, Fs[k - 7], Fs[k - 16]);
      Fs[k] = _ | 0, js[k] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: C, Hh: P, Hl: H } = this;
    for (let k = 0; k < 80; k++) {
      const M = Xe.rotrSH(u, w, 14) ^ Xe.rotrSH(u, w, 18) ^ Xe.rotrBH(u, w, 41), U = Xe.rotrSL(u, w, 14) ^ Xe.rotrSL(u, w, 18) ^ Xe.rotrBL(u, w, 41), Y = u & y ^ ~u & v, le = w & S ^ ~w & C, ne = Xe.add5L(H, U, le, m3[k], js[k]), q = Xe.add5H(ne, P, M, Y, w3[k], Fs[k]), m = ne | 0, I = Xe.rotrSH(r, s, 28) ^ Xe.rotrBH(r, s, 34) ^ Xe.rotrBH(r, s, 39), N = Xe.rotrSL(r, s, 28) ^ Xe.rotrBL(r, s, 34) ^ Xe.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = C | 0, v = y | 0, C = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Xe.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = Xe.add3L(m, N, W);
      r = Xe.add3H(R, q, I, _), s = R | 0;
    }
    ({ h: r, l: s } = Xe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Xe.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Xe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = Xe.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = Xe.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Xe.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: C } = Xe.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: P, l: H } = Xe.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, C, P, H);
  }
  roundClean() {
    Fs.fill(0), js.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, b3 = class extends Pl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, x3 = class extends Pl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, S3 = class extends Pl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
qi(() => new Pl());
qi(() => new b3());
qi(() => new x3());
qi(() => new S3());
function v3(e, t, n) {
  const s = Ck;
  if (O3(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Sd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var rn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(rn || (rn = {}));
let E3 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Gw = class extends E3 {
  constructor(t) {
    super(t);
  }
};
function Ul(e) {
  const t = [];
  return t.push(va(Nf(e.version, 1))), t.push(va(e.hash160)), hs(t);
}
function A3(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ul(e.address)), e.prefix === Ed.Contract && t.push(Ea(e.contractName)), hs(t);
}
function Ea(e) {
  const t = [], n = Pf(e.content), r = n.byteLength;
  return t.push(va(Nf(r, e.lengthPrefixBytes))), t.push(n), hs(t);
}
function k3(e) {
  const t = [];
  return t.push(Ul(e.address)), t.push(Ea(e.contractName)), t.push(Ea(e.assetName)), hs(t);
}
function Kw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(A3(e.principal)), (e.conditionType === gi.Fungible || e.conditionType === gi.NonFungible) && t.push(k3(e.assetInfo)), e.conditionType === gi.NonFungible && t.push(Oi(e.assetName)), t.push(e.conditionCode), e.conditionType === gi.STX || e.conditionType === gi.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Gw("The post-condition amount may not be larger than 8 bytes");
    t.push(Ek(e.amount, !1, 8));
  }
  return hs(t);
}
function qr(e, t) {
  return hs([e, t]);
}
function $3(e) {
  return new Uint8Array([e.type]);
}
function I3(e) {
  return e.type === rn.OptionalNone ? new Uint8Array([e.type]) : qr(e.type, Oi(e.value));
}
function L3(e) {
  const t = new Uint8Array(4);
  return _l(t, e.buffer.length, 0), qr(e.type, Uf(t, e.buffer));
}
function C3(e) {
  const t = _f(Ak(e.value, BigInt(Tk)), Hw);
  return qr(e.type, t);
}
function T3(e) {
  const t = _f(e.value, Hw);
  return qr(e.type, t);
}
function B3(e) {
  return qr(e.type, Ul(e.address));
}
function M3(e) {
  return qr(e.type, Uf(Ul(e.address), Ea(e.contractName)));
}
function N3(e) {
  return qr(e.type, Oi(e.value));
}
function _3(e) {
  const t = [], n = new Uint8Array(4);
  _l(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Oi(r);
    t.push(s);
  }
  return qr(e.type, hs(t));
}
function P3(e) {
  const t = [], n = new Uint8Array(4);
  _l(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = v3(s);
    t.push(Ea(i));
    const o = Oi(e.data[s]);
    t.push(o);
  }
  return qr(e.type, hs(t));
}
function Vw(e, t) {
  const n = [], r = t == "ascii" ? Ik(e.data) : Pf(e.data), s = new Uint8Array(4);
  return _l(s, r.length, 0), n.push(s), n.push(r), qr(e.type, hs(n));
}
function U3(e) {
  return Vw(e, "ascii");
}
function H3(e) {
  return Vw(e, "utf8");
}
function Oi(e) {
  switch (e.type) {
    case rn.BoolTrue:
    case rn.BoolFalse:
      return $3(e);
    case rn.OptionalNone:
    case rn.OptionalSome:
      return I3(e);
    case rn.Buffer:
      return L3(e);
    case rn.UInt:
      return T3(e);
    case rn.Int:
      return C3(e);
    case rn.PrincipalStandard:
      return B3(e);
    case rn.PrincipalContract:
      return M3(e);
    case rn.ResponseOk:
    case rn.ResponseErr:
      return N3(e);
    case rn.List:
      return _3(e);
    case rn.Tuple:
      return P3(e);
    case rn.StringASCII:
      return U3(e);
    case rn.StringUTF8:
      return H3(e);
    default:
      throw new Gw("Unable to serialize. Invalid Clarity Value.");
  }
}
const O3 = (e, t) => e ? Pf(e).length > t : !1, D3 = "connect-ui";
let Nc, Yw, Xn = !1, $d = !1;
const fs = (e, t = "") => () => {
}, F3 = (e, t) => () => {
}, j3 = "{visibility:hidden}.hydrated{visibility:inherit}", u0 = {}, R3 = "http://www.w3.org/2000/svg", z3 = "http://www.w3.org/1999/xhtml", G3 = (e) => e != null, Ff = (e) => (e = typeof e, e === "object" || e === "function");
function Xw(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const ze = (e, t, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (d) => {
    for (let h = 0; h < d.length; h++)
      r = d[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !Ff(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Id(null, r) : r), i = s);
  };
  if (a(n), t) {
    const d = t.className || t.class;
    d && (t.class = typeof d != "object" ? d : Object.keys(d).filter((h) => d[h]).join(" "));
  }
  const c = Id(e, null);
  return c.$attrs$ = t, o.length > 0 && (c.$children$ = o), c;
}, Id = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, K3 = {}, V3 = (e) => e && e.$tag$ === K3, Y3 = (e, t) => e != null && !Ff(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, X3 = (e) => Vo(e).$hostElement$, q3 = (e, t, n) => {
  const r = xn.ce(t, n);
  return e.dispatchEvent(r), r;
}, d0 = /* @__PURE__ */ new WeakMap(), W3 = (e, t, n) => {
  let r = tl.get(e);
  y4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, tl.set(e, r);
}, Z3 = (e, t, n, r) => {
  var s;
  let i = qw(t);
  const o = tl.get(i);
  if (e = e.nodeType === 11 ? e : Kr, o)
    if (typeof o == "string") {
      e = e.head || e;
      let a = d0.get(e), c;
      if (a || d0.set(e, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Kr.createElement("style"), c.innerHTML = o;
          const d = (s = xn.$nonce$) !== null && s !== void 0 ? s : Xw(Kr);
          d != null && c.setAttribute("nonce", d), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(i);
      }
    } else e.adoptedStyleSheets.includes(o) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, o]);
  return i;
}, J3 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = fs("attachStyles", t.$tagName$), i = Z3(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, qw = (e, t) => "sc-" + e.$tagName$, f0 = (e, t, n, r, s, i) => {
  if (n !== r) {
    let o = p0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, d = h0(n), h = h0(r);
      c.remove(...d.filter((u) => u && !h.includes(u))), c.add(...h.filter((u) => u && !d.includes(u)));
    } else if (!o && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : p0(Hl, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && xn.rel(e, t, n, !1), r && xn.ael(e, t, r, !1);
    else {
      const c = Ff(r);
      if ((o || c && r !== null) && !s)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const d = r ?? "";
            t === "list" ? o = !1 : (n == null || e[t] != d) && (e[t] = d);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, Q3 = /\s/, h0 = (e) => e ? e.split(Q3) : [], Ww = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, i = e && e.$attrs$ || u0, o = t.$attrs$ || u0;
  for (r in i)
    r in o || f0(s, r, i[r], void 0, n, t.$flags$);
  for (r in o)
    f0(s, r, i[r], o[r], n, t.$flags$);
}, jf = (e, t, n, r) => {
  const s = t.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Kr.createTextNode(s.$text$);
  else {
    if (Xn || (Xn = s.$tag$ === "svg"), o = s.$elm$ = Kr.createElementNS(Xn ? R3 : z3, s.$tag$), Xn && s.$tag$ === "foreignObject" && (Xn = !1), Ww(null, s, Xn), G3(Nc) && o["s-si"] !== Nc && o.classList.add(o["s-si"] = Nc), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = jf(e, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Xn = !1 : o.tagName === "foreignObject" && (Xn = !0);
  }
  return o;
}, Zw = (e, t, n, r, s, i) => {
  let o = e, a;
  for (o.shadowRoot && o.tagName === Yw && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = jf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, t)));
}, Jw = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, e4 = (e, t, n, r) => {
  let s = 0, i = 0, o = t.length - 1, a = t[0], c = t[o], d = r.length - 1, h = r[0], u = r[d], w;
  for (; s <= o && i <= d; )
    a == null ? a = t[++s] : c == null ? c = t[--o] : h == null ? h = r[++i] : u == null ? u = r[--d] : fc(a, h) ? (la(a, h), a = t[++s], h = r[++i]) : fc(c, u) ? (la(c, u), c = t[--o], u = r[--d]) : fc(a, u) ? (la(a, u), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], u = r[--d]) : fc(c, h) ? (la(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--o], h = r[++i]) : (w = jf(t && t[i], n, i), h = r[++i], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > o ? Zw(e, r[d + 1] == null ? null : r[d + 1].$elm$, n, r, i, d) : i > d && Jw(t, s, o);
}, fc = (e, t) => e.$tag$ === t.$tag$, la = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, i = t.$tag$, o = t.$text$;
  o === null ? (Xn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Xn, Ww(e, t, Xn), r !== null && s !== null ? e4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), Zw(n, null, t, s, 0, s.length - 1)) : r !== null && Jw(r, 0, r.length - 1), Xn && i === "svg" && (Xn = !1)) : e.$text$ !== o && (n.data = o);
}, t4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || Id(null, null), s = V3(t) ? t : ze(null, null, t);
  Yw = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Nc = n["s-sc"], la(r, s);
}, Qw = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Rf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Qw(e, e.$ancestorComponent$), m4(() => n4(e, t));
}, n4 = (e, t) => {
  const n = fs("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), o4(s, () => r4(e, r, t));
}, r4 = async (e, t, n) => {
  const r = e.$hostElement$, s = fs("update", e.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && J3(e);
  const o = fs("render", e.$cmpMeta$.$tagName$);
  s4(e, t), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => i4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, s4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, t4(e, t);
  } catch (r) {
    Aa(r, e.$hostElement$);
  }
  return null;
}, i4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = fs("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, tm(n), r(), e.$onReadyResolve$(n), s || em()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Gf(() => Rf(e, !1)), e.$flags$ &= -517;
}, em = (e) => {
  tm(Kr.documentElement), Gf(() => q3(Hl, "appload", { detail: { namespace: D3 } }));
}, o4 = (e, t) => e && e.then ? e.then(t) : t(), tm = (e) => e.classList.add("hydrated"), a4 = (e, t) => Vo(e).$instanceValues$.get(t), c4 = (e, t, n, r) => {
  const s = Vo(e), i = s.$instanceValues$.get(t), o = s.$flags$, a = s.$lazyInstance$;
  n = Y3(n, r.$members$[t][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), d = n !== i && !c;
  (!(o & 8) || i === void 0) && d && (s.$instanceValues$.set(t, n), a && (o & 18) === 2 && Rf(s, !1));
}, nm = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return a4(this, i);
        },
        set(a) {
          c4(this, i, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        xn.jmp(() => {
          const d = i.get(o);
          if (this.hasOwnProperty(d))
            c = this[d], delete this[d];
          else if (s.hasOwnProperty(d) && typeof this[d] == "number" && this[d] == c)
            return;
          this[d] = c === null && typeof this[d] == "boolean" ? !1 : c;
        });
      }, e.observedAttributes = r.filter(
        ([o, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, a]) => {
        const c = a[1] || o;
        return i.set(c, o), c;
      });
    }
  }
  return e;
}, l4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = g4(n), s.then) {
        const c = F3();
        s = await s, c();
      }
      s.isProxied || (nm(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = fs("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        Aa(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = qw(n);
      if (!tl.has(c)) {
        const d = fs("registerStyles", n.$tagName$);
        W3(c, a, !!(n.$flags$ & 1)), d();
      }
    }
  }
  const i = t.$ancestorComponent$, o = () => Rf(t, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, u4 = (e) => {
  if (!(xn.$flags$ & 1)) {
    const t = Vo(e), n = t.$cmpMeta$, r = fs("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Qw(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && e.hasOwnProperty(s)) {
          const o = e[s];
          delete e[s], e[s] = o;
        }
      }), l4(e, t, n);
    }
    r();
  }
}, d4 = (e) => {
  xn.$flags$ & 1 || Vo(e);
}, f4 = (e, t = {}) => {
  var n;
  const r = fs(), s = [], i = t.exclude || [], o = Hl.customElements, a = Kr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), d = /* @__PURE__ */ Kr.createElement("style"), h = [];
  let u, w = !0;
  Object.assign(xn, t), xn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", Kr.baseURI).href, e.map((y) => {
    y[1].map((S) => {
      const v = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      v.$members$ = S[2];
      const C = v.$tagName$, P = class extends HTMLElement {
        // StencilLazyHost
        constructor(H) {
          super(H), H = this, p4(H, v), v.$flags$ & 1 && H.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), w ? h.push(this) : xn.jmp(() => u4(this));
        }
        disconnectedCallback() {
          xn.jmp(() => d4(this));
        }
        componentOnReady() {
          return Vo(this).$onReadyPromise$;
        }
      };
      v.$lazyBundleId$ = y[0], !i.includes(C) && !o.get(C) && (s.push(C), o.define(C, nm(
        P,
        v,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    d.innerHTML = s + j3, d.setAttribute("data-styles", "");
    const y = (n = xn.$nonce$) !== null && n !== void 0 ? n : Xw(Kr);
    y != null && d.setAttribute("nonce", y), a.insertBefore(d, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((y) => y.connectedCallback()) : xn.jmp(() => u = setTimeout(em, 30)), r();
}, zf = /* @__PURE__ */ new WeakMap(), Vo = (e) => zf.get(e), h4 = (e, t) => zf.set(t.$lazyInstance$ = e, t), p4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], zf.set(e, n);
}, p0 = (e, t) => t in e, Aa = (e, t) => (0, console.error)(e, t), wu = /* @__PURE__ */ new Map(), g4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, i = wu.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (wu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => qL).then(o, Aa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (wu.set(s, o), o[r]), Aa);
}, tl = /* @__PURE__ */ new Map(), Hl = typeof window < "u" ? window : {}, Kr = Hl.document || { head: {} }, xn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, rm = (e) => Promise.resolve(e), y4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), g0 = [], sm = [], w4 = (e, t) => (n) => {
  e.push(n), $d || ($d = !0, xn.$flags$ & 4 ? Gf(Ld) : xn.raf(Ld));
}, y0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Aa(n);
    }
  e.length = 0;
}, Ld = () => {
  y0(g0), y0(sm), ($d = g0.length > 0) && xn.raf(Ld);
}, Gf = (e) => rm().then(e), m4 = /* @__PURE__ */ w4(sm), b4 = () => rm(), x4 = (e, t) => typeof window > "u" ? Promise.resolve() : b4().then(() => f4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var S4 = Object.defineProperty, v4 = Object.defineProperties, E4 = Object.getOwnPropertyDescriptors, nl = Object.getOwnPropertySymbols, im = Object.prototype.hasOwnProperty, om = Object.prototype.propertyIsEnumerable, w0 = (e, t, n) => t in e ? S4(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Qn = (e, t) => {
  for (var n in t || (t = {})) im.call(t, n) && w0(e, n, t[n]);
  if (nl) for (var n of nl(t)) om.call(t, n) && w0(e, n, t[n]);
  return e;
}, Mr = (e, t) => v4(e, E4(t)), am = (e, t) => {
  var n = {};
  for (var r in e) im.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && nl) for (var r of nl(e)) t.indexOf(r) < 0 && om.call(e, r) && (n[r] = e[r]);
  return n;
};
function cm() {
  return Tl(Mi()) || window.StacksProvider || window.BlockstackProvider;
}
function Ol(e) {
  return e ? typeof e == "string" ? _i.fromName(e) : "version" in e ? e : "url" in e ? new nd({ url: e.url }) : e.transactionVersion === Ui.Mainnet ? new nd({ url: e.client.baseUrl }) : new rd({ url: e.client.baseUrl }) : new rd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var A4 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(A4 || {}), k4 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(k4 || {}), Kf = (e) => {
  let t = e;
  if (!t) {
    let n = new jg(["store_write"], document.location.href);
    t = new td({ appConfig: n });
  }
  return t;
};
function lm(e) {
  try {
    return Kf(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var um = (e) => {
  let t = Kf(e).loadUserData().appPrivateKey, n = hn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function $4(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let i = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, o = { [Pi.Mainnet]: "mainnet", [Pi.Testnet]: "testnet" }, a = Ol(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function I4(e) {
  let t = Ol(e.network), n = Kf(e.userSession), r = Mr(Qn({}, e), { network: t, userSession: n });
  return Qn({ stxAddress: $4(r) }, r);
}
async function L4(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Pw) : n = n.map((r) => Te(Kw(r)))), new hn.TokenSigner("ES256k", t).signAsync(Mr(Qn({}, e), { postConditions: n }));
}
function C4(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(Pw) : t = t.map((n) => Te(Kw(n)))), hn.createUnsecuredToken(Mr(Qn({}, e), { postConditions: t }));
}
var T4 = async ({ token: e, options: t }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(e), { txRaw: a } = o, c = ct(a.replace(/^0x/, "")), d = xk(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Mr(Qn({}, o), { stacksTransaction: d }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, Mr(Qn({}, o), { stacksTransaction: d }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = t.onCancel) == null || i.call(t);
  }
}, B4 = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, i = am(t, ["amount", "appDetails", "userSession"]);
  if (lm(s)) {
    let { privateKey: a, publicKey: c } = um(s), d = Mr(Qn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (d.appDetails = r), L4(d, a);
  }
  let o = Mr(Qn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), C4(o);
};
async function M4(e, t, n) {
  let r = await t(Mr(Qn(Qn({}, I4(e)), e), { network: Ol(e.network) }));
  return T4({ token: r, options: e }, n);
}
function N4(e, t = cm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return M4(e, B4, t);
}
function dm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Mr(Qn({}, e), { message: Kp(t), domain: Kp(n) }) : Mr(Qn({}, e), { message: Te(Oi(t)), domain: Te(Oi(n)) });
}
async function _4(e, t) {
  return new hn.TokenSigner("ES256k", t).signAsync(dm(e));
}
async function P4(e) {
  let t = e, { userSession: n } = t, r = am(t, ["userSession"]);
  if (lm(n)) {
    let { privateKey: s, publicKey: i } = um(n), o = Mr(Qn({}, r), { publicKey: i });
    return _4(o, s);
  }
  return hn.createUnsecuredToken(dm(e));
}
var U4 = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(U4 || {}), fm = "asigna-stx", m0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === fm && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(O4(e, t), "*");
}), H4 = { authenticationRequest: async (e) => m0(e, "authenticationRequest"), transactionRequest: async (e) => m0(e, "transactionRequest") }, O4 = (e, t) => ({ source: fm, [t]: e }), D4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = H4);
};
D4();
var F4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function j4(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let i = Mi(), o = cm();
    if (i && o) return e(n, o);
    if (typeof window > "u") return;
    x4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : F4, c = Mv(a), d = document.createElement("connect-modal");
    d.defaultProviders = a, d.installedProviders = c, d.persistSelection = t;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let u = () => {
      d.remove(), document.body.style.overflow = h;
    };
    d.callback = (y) => {
      u(), e(n, y);
    }, d.cancelCallback = () => {
      var y;
      u(), (y = n.onCancel) == null || y.call(n);
    }, document.body.appendChild(d);
    let w = (y) => {
      y.key === "Escape" && (document.removeEventListener("keydown", w), d.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var hc = j4(N4);
function ni(e, t, n) {
  return Vf(Tn(e, t), n);
}
function Tn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Nt(r);
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
      const r = G4(BigInt(`0x${Qe(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Qe(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function b0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Oa(e, t = 8) {
  return (typeof e == "bigint" ? e : Tn(e, !1)).toString(16).padStart(t * 2, "0");
}
function Dl(e) {
  return parseInt(e, 16);
}
function Vf(e, t = 16) {
  const n = Oa(e, t);
  return Nt(n);
}
function R4(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function z4(e, t) {
  return e & BigInt(1) << t;
}
function G4(e, t) {
  return z4(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const K4 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Qe(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += K4[n];
  return t;
}
function Nt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = t.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Yo(e) {
  return new TextEncoder().encode(e);
}
function Yf(e) {
  return new TextDecoder().decode(e);
}
function hm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function V4(e) {
  return String.fromCharCode.apply(null, e);
}
function Y4(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function x0(e) {
  if (e.some(Y4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Fl(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Yt(e) {
  return Fl(...e.map((t) => typeof t == "number" ? x0([t]) : t instanceof Array ? x0(t) : t));
}
var S0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(S0 || (S0 = {}));
var v0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(v0 || (v0 = {}));
var E0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(E0 || (E0 = {}));
const pm = 33, mu = 32;
function X4(e) {
  if (e.length < mu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + mu * 2), r = e.slice(2 + mu * 2);
  return {
    recoveryId: Dl(t),
    r: n,
    s: r
  };
}
function q4(e) {
  const t = typeof e == "string" ? Nt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function W4(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function Z4(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function J4(e, t) {
  return e[t];
}
function Q4(e, t, n = 0) {
  return e[n] = t, e;
}
function e8(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Di(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Cd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Cd || (Cd = {}));
const t8 = Cd.Mainnet, n8 = 128, r8 = 128, gm = 16, Ai = 32, Td = 80, jl = 65, s8 = 32, i8 = 64, rl = 34;
var Ae;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ae || (Ae = {}));
var Ze;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ze || (Ze = {}));
var Bd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Bd || (Bd = {}));
var Un;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Un || (Un = {}));
const _c = ["onChainOnly", "offChainOnly", "any"], A0 = {
  [_c[0]]: Un.OnChainOnly,
  [_c[1]]: Un.OffChainOnly,
  [_c[2]]: Un.Any,
  [Un.OnChainOnly]: Un.OnChainOnly,
  [Un.OffChainOnly]: Un.OffChainOnly,
  [Un.Any]: Un.Any
};
function o8(e) {
  if (e in A0)
    return A0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${_c.join(", ")}`);
}
var sl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(sl || (sl = {}));
sl.Mainnet;
var Ho;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Ho || (Ho = {}));
var Hn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Hn || (Hn = {}));
var Dt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Dt || (Dt = {}));
var At;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(At || (At = {}));
var il;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(il || (il = {}));
var Ut;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Ut || (Ut = {}));
var ka;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(ka || (ka = {}));
var Md;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Md || (Md = {}));
var $a;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})($a || ($a = {}));
var k0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(k0 || (k0 = {}));
var $0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})($0 || ($0 = {}));
function Nd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function a8(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function ym(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function c8(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Nd(e.outputLen), Nd(e.blockLen);
}
function l8(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function u8(e, t) {
  ym(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Si = {
  number: Nd,
  bool: a8,
  bytes: ym,
  hash: c8,
  exists: l8,
  output: u8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Dr = (e, t) => e << 32 - t | e >>> t, d8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!d8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function f8(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Xf(e) {
  if (typeof e == "string" && (e = f8(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class wm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Wi(e) {
  const t = (r) => e().update(Xf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function h8(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
class qf extends wm {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = bu(this.buffer);
  }
  update(t) {
    Si.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Xf(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = bu(t);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Si.exists(this), Si.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    h8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = bu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, h[u], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
}
const p8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), mm = Uint8Array.from({ length: 16 }, (e, t) => t), g8 = mm.map((e) => (9 * e + 5) % 16);
let Wf = [mm], Zf = [g8];
for (let e = 0; e < 4; e++)
  for (let t of [Wf, Zf])
    t.push(t[e].map((n) => p8[n]));
const bm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), y8 = Wf.map((e, t) => e.map((n) => bm[t][n])), w8 = Zf.map((e, t) => e.map((n) => bm[t][n])), m8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), b8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), pc = (e, t) => e << t | e >>> 32 - t;
function I0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const gc = new Uint32Array(16);
class x8 extends qf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      gc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, d = this.h3 | 0, h = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = m8[y], C = b8[y], P = Wf[y], H = Zf[y], k = y8[y], M = w8[y];
      for (let U = 0; U < 16; U++) {
        const Y = pc(r + I0(y, i, a, d) + gc[P[U]] + v, k[U]) + u | 0;
        r = u, u = d, d = pc(a, 10) | 0, a = i, i = Y;
      }
      for (let U = 0; U < 16; U++) {
        const Y = pc(s + I0(S, o, c, h) + gc[H[U]] + C, M[U]) + w | 0;
        s = w, w = h, h = pc(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    gc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const S8 = Wi(() => new x8()), v8 = (e, t, n) => e & t ^ ~e & n, E8 = (e, t, n) => e & t ^ e & n ^ t & n, A8 = new Uint32Array([
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
]), Rs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), zs = new Uint32Array(64);
class xm extends qf {
  constructor() {
    super(64, 32, 8, !1), this.A = Rs[0] | 0, this.B = Rs[1] | 0, this.C = Rs[2] | 0, this.D = Rs[3] | 0, this.E = Rs[4] | 0, this.F = Rs[5] | 0, this.G = Rs[6] | 0, this.H = Rs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [t, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let u = 0; u < 16; u++, n += 4)
      zs[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = zs[u - 15], y = zs[u - 2], S = Dr(w, 7) ^ Dr(w, 18) ^ w >>> 3, v = Dr(y, 17) ^ Dr(y, 19) ^ y >>> 10;
      zs[u] = v + zs[u - 7] + S + zs[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Dr(a, 6) ^ Dr(a, 11) ^ Dr(a, 25), y = h + w + v8(a, c, d) + A8[u] + zs[u] | 0, v = (Dr(r, 2) ^ Dr(r, 13) ^ Dr(r, 22)) + E8(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    zs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class k8 extends xm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Jf = Wi(() => new xm());
Wi(() => new k8());
const yc = BigInt(2 ** 32 - 1), _d = BigInt(32);
function Sm(e, t = !1) {
  return t ? { h: Number(e & yc), l: Number(e >> _d & yc) } : { h: Number(e >> _d & yc) | 0, l: Number(e & yc) | 0 };
}
function $8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = Sm(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const I8 = (e, t) => BigInt(e >>> 0) << _d | BigInt(t >>> 0), L8 = (e, t, n) => e >>> n, C8 = (e, t, n) => e << 32 - n | t >>> n, T8 = (e, t, n) => e >>> n | t << 32 - n, B8 = (e, t, n) => e << 32 - n | t >>> n, M8 = (e, t, n) => e << 64 - n | t >>> n - 32, N8 = (e, t, n) => e >>> n - 32 | t << 64 - n, _8 = (e, t) => t, P8 = (e, t) => e, U8 = (e, t, n) => e << n | t >>> 32 - n, H8 = (e, t, n) => t << n | e >>> 32 - n, O8 = (e, t, n) => t << n - 32 | e >>> 64 - n, D8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function F8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const j8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), R8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, z8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), G8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, K8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), V8 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, qe = {
  fromBig: Sm,
  split: $8,
  toBig: I8,
  shrSH: L8,
  shrSL: C8,
  rotrSH: T8,
  rotrSL: B8,
  rotrBH: M8,
  rotrBL: N8,
  rotr32H: _8,
  rotr32L: P8,
  rotlSH: U8,
  rotlSL: H8,
  rotlBH: O8,
  rotlBL: D8,
  add: F8,
  add3L: j8,
  add3H: R8,
  add4L: z8,
  add4H: G8,
  add5H: V8,
  add5L: K8
}, [Y8, X8] = qe.split([
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
].map((e) => BigInt(e))), Gs = new Uint32Array(80), Ks = new Uint32Array(80);
class Rl extends qf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: C } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let k = 0; k < 16; k++, n += 4)
      Gs[k] = t.getUint32(n), Ks[k] = t.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const M = Gs[k - 15] | 0, U = Ks[k - 15] | 0, Y = qe.rotrSH(M, U, 1) ^ qe.rotrSH(M, U, 8) ^ qe.shrSH(M, U, 7), le = qe.rotrSL(M, U, 1) ^ qe.rotrSL(M, U, 8) ^ qe.shrSL(M, U, 7), ne = Gs[k - 2] | 0, q = Ks[k - 2] | 0, m = qe.rotrSH(ne, q, 19) ^ qe.rotrBH(ne, q, 61) ^ qe.shrSH(ne, q, 6), I = qe.rotrSL(ne, q, 19) ^ qe.rotrBL(ne, q, 61) ^ qe.shrSL(ne, q, 6), N = qe.add4L(le, I, Ks[k - 7], Ks[k - 16]), _ = qe.add4H(N, Y, m, Gs[k - 7], Gs[k - 16]);
      Gs[k] = _ | 0, Ks[k] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: C, Hh: P, Hl: H } = this;
    for (let k = 0; k < 80; k++) {
      const M = qe.rotrSH(u, w, 14) ^ qe.rotrSH(u, w, 18) ^ qe.rotrBH(u, w, 41), U = qe.rotrSL(u, w, 14) ^ qe.rotrSL(u, w, 18) ^ qe.rotrBL(u, w, 41), Y = u & y ^ ~u & v, le = w & S ^ ~w & C, ne = qe.add5L(H, U, le, X8[k], Ks[k]), q = qe.add5H(ne, P, M, Y, Y8[k], Gs[k]), m = ne | 0, I = qe.rotrSH(r, s, 28) ^ qe.rotrBH(r, s, 34) ^ qe.rotrBH(r, s, 39), N = qe.rotrSL(r, s, 28) ^ qe.rotrBL(r, s, 34) ^ qe.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = C | 0, v = y | 0, C = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = qe.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = qe.add3L(m, N, W);
      r = qe.add3H(R, q, I, _), s = R | 0;
    }
    ({ h: r, l: s } = qe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = qe.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = qe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = qe.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = qe.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = qe.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: C } = qe.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: P, l: H } = qe.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, C, P, H);
  }
  roundClean() {
    Gs.fill(0), Ks.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class q8 extends Rl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class W8 extends Rl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Z8 extends Rl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Wi(() => new Rl());
Wi(() => new q8());
const J8 = Wi(() => new W8());
Wi(() => new Z8());
function vm(e) {
  if (Nt(e).byteLength != jl)
    throw Error("Invalid signature");
  return {
    type: Ae.MessageSignature,
    data: e
  };
}
function ua(e, t) {
  return { type: Ae.Address, version: e, hash160: t };
}
function bo(e) {
  return Yi.c32address(e.version, e.hash160);
}
function Fi(e, t, n) {
  const r = t || 1, s = n || n8;
  if (Dm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ae.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Qf(e) {
  const t = Yi.c32addressDecode(e);
  return {
    type: Ae.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ce;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ce || (ce = {}));
function Q8(e) {
  if (e.type === ce.PrincipalStandard)
    return bo(e.address);
  if (e.type === ce.PrincipalContract)
    return `${bo(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Em(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return n$(t, n);
  } else
    return e$(e);
}
function e$(e) {
  const t = Qf(e);
  return { type: ce.PrincipalStandard, address: t };
}
function t$(e) {
  return { type: ce.PrincipalStandard, address: e };
}
function n$(e, t) {
  const n = Qf(e), r = Fi(t);
  return Am(n, r);
}
function Am(e, t) {
  if (Yo(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ce.PrincipalContract, address: e, contractName: t };
}
function xu(e, t = !1) {
  switch (e.type) {
    case ce.BoolTrue:
      return !0;
    case ce.BoolFalse:
      return !1;
    case ce.Int:
    case ce.UInt:
      return t ? e.value.toString() : e.value;
    case ce.Buffer:
      return `0x${Qe(e.buffer)}`;
    case ce.OptionalNone:
      return null;
    case ce.OptionalSome:
      return Ir(e.value);
    case ce.ResponseErr:
      return Ir(e.value);
    case ce.ResponseOk:
      return Ir(e.value);
    case ce.PrincipalStandard:
    case ce.PrincipalContract:
      return Q8(e);
    case ce.List:
      return e.list.map((r) => Ir(r));
    case ce.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Ir(e.data[r]);
      }), n;
    case ce.StringASCII:
      return e.data;
    case ce.StringUTF8:
      return e.data;
  }
}
function Ir(e) {
  switch (e.type) {
    case ce.ResponseErr:
      return { type: qs(e), value: xu(e, !0), success: !1 };
    case ce.ResponseOk:
      return { type: qs(e), value: xu(e, !0), success: !0 };
    default:
      return { type: qs(e), value: xu(e, !0) };
  }
}
function qs(e) {
  switch (e.type) {
    case ce.BoolTrue:
    case ce.BoolFalse:
      return "bool";
    case ce.Int:
      return "int";
    case ce.UInt:
      return "uint";
    case ce.Buffer:
      return `(buff ${e.buffer.length})`;
    case ce.OptionalNone:
      return "(optional none)";
    case ce.OptionalSome:
      return `(optional ${qs(e.value)})`;
    case ce.ResponseErr:
      return `(response UnknownType ${qs(e.value)})`;
    case ce.ResponseOk:
      return `(response ${qs(e.value)} UnknownType)`;
    case ce.PrincipalStandard:
    case ce.PrincipalContract:
      return "principal";
    case ce.List:
      return `(list ${e.list.length} ${e.list.length ? qs(e.list[0]) : "UnknownType"})`;
    case ce.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${qs(e.data[t])})`).join(" ")})`;
    case ce.StringASCII:
      return `(string-ascii ${hm(e.data).length})`;
    case ce.StringUTF8:
      return `(string-utf8 ${Yo(e.data).length})`;
  }
}
const km = () => ({ type: ce.BoolTrue }), $m = () => ({ type: ce.BoolFalse }), r$ = (e) => e ? km() : $m(), L0 = BigInt("0xffffffffffffffffffffffffffffffff"), s$ = BigInt(0), C0 = BigInt("0x7fffffffffffffffffffffffffffffff"), T0 = BigInt("-170141183460469231731687303715884105728"), i$ = (e) => {
  const t = Tn(e, !0);
  if (t > C0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${C0}`);
  if (t < T0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${T0}`);
  return { type: ce.Int, value: t };
}, on = (e) => {
  const t = Tn(e, !1);
  if (t < s$)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > L0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${L0}`);
  return { type: ce.UInt, value: t };
}, Im = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ce.Buffer, buffer: e };
};
function Lm() {
  return { type: ce.OptionalNone };
}
function Cm(e) {
  return { type: ce.OptionalSome, value: e };
}
function o$(e) {
  return { type: ce.ResponseErr, value: e };
}
function a$(e) {
  return { type: ce.ResponseOk, value: e };
}
function c$(e) {
  return { type: ce.List, list: e };
}
function er(e) {
  for (const t in e)
    if (!Z$(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ce.Tuple, data: e };
}
const ut = (e) => ({ type: ce.StringASCII, data: e }), l$ = (e) => ({ type: ce.StringUTF8, data: e });
class Tm extends wm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Si.hash(t);
    const r = Xf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return Si.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Si.exists(this), Si.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Bm = (e, t, n) => new Tm(e, t).update(n).digest();
Bm.create = (e, t) => new Tm(e, t);
Ft.hmacSha256Sync = (e, ...t) => {
  const n = Bm.create(Jf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Oo(e) {
  return {
    type: Ae.PublicKey,
    data: Nt(e)
  };
}
function u$(e, t, n = Ut.Compressed) {
  const r = X4(t.data), s = new Zn(b0(r.r), b0(r.s)), i = Je.fromSignature(e, s, r.recoveryId), o = n === Ut.Compressed;
  return i.toHex(o);
}
function d$(e) {
  return { type: Ae.PublicKey, data: e };
}
function Xo(e) {
  return !Qe(e.data).startsWith("04");
}
function ol(e) {
  return e.data.slice();
}
function f$(e) {
  const t = g$(e), n = Na(t.data.slice(0, 32), t.compressed);
  return Oo(Qe(n));
}
function h$(e) {
  const t = typeof e == "string" ? e : Qe(e), n = Je.fromHex(t).toHex(!0);
  return Oo(n);
}
function p$(e) {
  const t = typeof e == "string" ? e : Qe(e), n = Je.fromHex(t).toHex(!1);
  return Oo(n);
}
function Pd(e) {
  const t = e.readUInt8(), n = t === 4 ? i8 : s8;
  return d$(Yt([t, e.readBytes(n)]));
}
function g$(e) {
  const t = q4(e), n = t.length == pm;
  return { data: t, compressed: n };
}
function y$(e, t) {
  const [n, r] = xl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Oa(r, 1) + Zn.fromHex(n).toCompactHex();
  return vm(i);
}
function w$(e) {
  return f$(e.data);
}
function m$(e, t, n) {
  return typeof e == "string" && (e = Em(e)), typeof n == "string" && (n = N0(n)), {
    type: Ae.Payload,
    payloadType: Ze.TokenTransfer,
    recipient: e,
    amount: Tn(t, !1),
    memo: n ?? N0("")
  };
}
function b$(e, t, n, r) {
  return typeof e == "string" && (e = Qf(e)), typeof t == "string" && (t = Fi(t)), typeof n == "string" && (n = Fi(n)), {
    type: Ae.Payload,
    payloadType: Ze.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function B0(e, t, n) {
  return typeof e == "string" && (e = Fi(e)), typeof t == "string" && (t = L$(t)), typeof n == "number" ? {
    type: Ae.Payload,
    payloadType: Ze.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Ae.Payload,
    payloadType: Ze.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function x$() {
  return { type: Ae.Payload, payloadType: Ze.PoisonMicroblock };
}
function M0(e, t) {
  if (e.byteLength != Ai)
    throw Error(`Coinbase buffer size must be ${Ai} bytes`);
  return t != null ? {
    type: Ae.Payload,
    payloadType: Ze.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Ae.Payload,
    payloadType: Ze.Coinbase,
    coinbaseBytes: e
  };
}
function S$(e, t, n) {
  if (e.byteLength != Ai)
    throw Error(`Coinbase buffer size must be ${Ai} bytes`);
  if (n.byteLength != Td)
    throw Error(`VRF proof buffer size must be ${Td} bytes`);
  return {
    type: Ae.Payload,
    payloadType: Ze.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ce.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Ud;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Ud || (Ud = {}));
function v$(e, t, n, r, s, i, o) {
  return {
    type: Ae.Payload,
    payloadType: Ze.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Mm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Ze.TokenTransfer:
      t.push(Gt(e.recipient)), t.push(ni(e.amount, !1, 8)), t.push(is(e.memo));
      break;
    case Ze.ContractCall:
      t.push(is(e.contractAddress)), t.push(is(e.contractName)), t.push(is(e.functionName));
      const n = new Uint8Array(4);
      Di(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Gt(r));
      });
      break;
    case Ze.SmartContract:
      t.push(is(e.contractName)), t.push(is(e.codeBody));
      break;
    case Ze.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(is(e.contractName)), t.push(is(e.codeBody));
      break;
    case Ze.PoisonMicroblock:
      break;
    case Ze.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Ze.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Gt(e.recipient));
      break;
    case Ze.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Gt(e.recipient ? Cm(e.recipient) : Lm())), t.push(e.vrfProof);
      break;
    case Ze.TenureChange:
      t.push(Nt(e.tenureHash)), t.push(Nt(e.previousTenureHash)), t.push(Nt(e.burnViewHash)), t.push(Nt(e.previousTenureEnd)), t.push(Di(new Uint8Array(4), e.previousTenureBlocks)), t.push(Q4(new Uint8Array(1), e.cause)), t.push(Nt(e.publicKeyHash));
      break;
  }
  return Yt(t);
}
function E$(e) {
  switch (e.readUInt8Enum(Ze, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ze.TokenTransfer:
      const n = fr(e), r = Tn(e.readBytes(8), !1), s = _m(e);
      return m$(n, r, s);
    case Ze.ContractCall:
      const i = Do(e), o = dr(e), a = dr(e), c = [], d = e.readUInt32BE();
      for (let k = 0; k < d; k++) {
        const M = fr(e);
        c.push(M);
      }
      return b$(i, o, a, c);
    case Ze.SmartContract:
      const h = dr(e), u = dr(e, 4, 1e5);
      return B0(h, u);
    case Ze.VersionedSmartContract: {
      const k = e.readUInt8Enum(Bd, (Y) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Y}`);
      }), M = dr(e), U = dr(e, 4, 1e5);
      return B0(M, U, k);
    }
    case Ze.PoisonMicroblock:
      return x$();
    case Ze.Coinbase: {
      const k = e.readBytes(Ai);
      return M0(k);
    }
    case Ze.CoinbaseToAltRecipient: {
      const k = e.readBytes(Ai), M = fr(e);
      return M0(k, M);
    }
    case Ze.NakamotoCoinbase: {
      const k = e.readBytes(Ai), M = fr(e), U = e.readBytes(Td);
      return S$(k, M, U);
    }
    case Ze.TenureChange:
      const w = Qe(e.readBytes(20)), y = Qe(e.readBytes(20)), S = Qe(e.readBytes(20)), v = Qe(e.readBytes(32)), C = e.readUInt32BE(), P = e.readUInt8Enum(Ud, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), H = Qe(e.readBytes(20));
      return v$(w, y, S, v, C, P, H);
  }
}
class zl extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class yi extends zl {
  constructor(t) {
    super(t);
  }
}
class Wn extends zl {
  constructor(t) {
    super(t);
  }
}
class al extends zl {
  constructor(t) {
    super(t);
  }
}
class vi extends zl {
  constructor(t) {
    super(t);
  }
}
var Lr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Lr || (Lr = {}));
function Hd(e) {
  return vm(Qe(e.readBytes(jl)));
}
function xo(e, t) {
  return {
    pubKeyEncoding: e,
    type: Ae.TransactionAuthField,
    contents: t
  };
}
function A$(e) {
  const t = e.readUInt8Enum(Lr, (n) => {
    throw new Wn(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Lr.PublicKeyCompressed:
      return xo(Ut.Compressed, Pd(e));
    case Lr.PublicKeyUncompressed:
      return xo(Ut.Uncompressed, p$(Pd(e).data));
    case Lr.SignatureCompressed:
      return xo(Ut.Compressed, Hd(e));
    case Lr.SignatureUncompressed:
      return xo(Ut.Uncompressed, Hd(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function eh(e) {
  return Nt(e.data);
}
function k$(e) {
  const t = [];
  switch (e.contents.type) {
    case Ae.PublicKey:
      t.push(e.pubKeyEncoding === Ut.Compressed ? Lr.PublicKeyCompressed : Lr.PublicKeyUncompressed), t.push(ol(h$(e.contents.data)));
      break;
    case Ae.MessageSignature:
      t.push(e.pubKeyEncoding === Ut.Compressed ? Lr.SignatureCompressed : Lr.SignatureUncompressed), t.push(eh(e.contents));
      break;
  }
  return Yt(t);
}
function is(e) {
  switch (e.type) {
    case Ae.Address:
      return Da(e);
    case Ae.Principal:
      return Nm(e);
    case Ae.LengthPrefixedString:
      return Fo(e);
    case Ae.MemoString:
      return C$(e);
    case Ae.AssetInfo:
      return Pm(e);
    case Ae.PostCondition:
      return T$(e);
    case Ae.PublicKey:
      return ol(e);
    case Ae.LengthPrefixedList:
      return rh(e);
    case Ae.Payload:
      return Mm(e);
    case Ae.TransactionAuthField:
      return k$(e);
    case Ae.MessageSignature:
      return eh(e);
  }
}
function $$() {
  return {
    type: Ae.Address,
    version: il.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function th(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === At.SerializeP2PKH || t === At.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === At.SerializeP2WPKH || t === At.SerializeP2WSH || t === At.SerializeP2WSHNonSequential) && !r.every(Xo))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case At.SerializeP2PKH:
      return ua(e, Y$(r[0].data));
    case At.SerializeP2WPKH:
      return ua(e, X$(r[0].data));
    case At.SerializeP2SH:
    case At.SerializeP2SHNonSequential:
      return ua(e, q$(n, r.map(ol)));
    case At.SerializeP2WSH:
    case At.SerializeP2WSHNonSequential:
      return ua(e, W$(n, r.map(ol)));
  }
}
function Da(e) {
  const t = [];
  return t.push(Nt(Oa(e.version, 1))), t.push(Nt(e.hash160)), Yt(t);
}
function Do(e) {
  const t = Dl(Qe(e.readBytes(1))), n = Qe(e.readBytes(20));
  return { type: Ae.Address, version: t, hash160: n };
}
function Nm(e) {
  const t = [];
  return t.push(e.prefix), t.push(Da(e.address)), e.prefix === $a.Contract && t.push(Fo(e.contractName)), Yt(t);
}
function I$(e) {
  const t = e.readUInt8Enum($a, (s) => {
    throw new Wn(`Unexpected Principal payload type: ${s}`);
  }), n = Do(e);
  if (t === $a.Standard)
    return { type: Ae.Principal, prefix: t, address: n };
  const r = dr(e);
  return {
    type: Ae.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Fo(e) {
  const t = [], n = Yo(e.content), r = n.byteLength;
  return t.push(Nt(Oa(r, e.lengthPrefixBytes))), t.push(n), Yt(t);
}
function dr(e, t, n) {
  t = t || 1;
  const r = Dl(Qe(e.readBytes(t))), s = Yf(e.readBytes(r));
  return Fi(s, t, n ?? 128);
}
function L$(e) {
  return Fi(e, 4, 1e5);
}
function N0(e) {
  if (e && Dm(e, rl))
    throw new Error(`Memo exceeds maximum length of ${rl} bytes`);
  return { type: Ae.MemoString, content: e };
}
function C$(e) {
  const t = [], n = Yo(e.content), r = V$(Qe(n), rl * 2);
  return t.push(Nt(r)), Yt(t);
}
function _m(e) {
  let t = Yf(e.readBytes(rl));
  return t = t.replace(/\u0000*$/, ""), { type: Ae.MemoString, content: t };
}
function Pm(e) {
  const t = [];
  return t.push(Da(e.address)), t.push(Fo(e.contractName)), t.push(Fo(e.assetName)), Yt(t);
}
function Od(e) {
  return {
    type: Ae.AssetInfo,
    address: Do(e),
    contractName: dr(e),
    assetName: dr(e)
  };
}
function nh(e, t) {
  return {
    type: Ae.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function rh(e) {
  const t = e.values, n = [];
  n.push(Nt(Oa(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(is(r));
  return Yt(n);
}
function Um(e, t, n) {
  const r = Dl(Qe(e.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (t) {
      case Ae.Address:
        s.push(Do(e));
        break;
      case Ae.LengthPrefixedString:
        s.push(dr(e));
        break;
      case Ae.MemoString:
        s.push(_m(e));
        break;
      case Ae.AssetInfo:
        s.push(Od(e));
        break;
      case Ae.PostCondition:
        s.push(B$(e));
        break;
      case Ae.PublicKey:
        s.push(Pd(e));
        break;
      case Ae.TransactionAuthField:
        s.push(A$(e));
        break;
    }
  return nh(s, n);
}
function T$(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Nm(e.principal)), (e.conditionType === Hn.Fungible || e.conditionType === Hn.NonFungible) && t.push(Pm(e.assetInfo)), e.conditionType === Hn.NonFungible && t.push(Gt(e.assetName)), t.push(e.conditionCode), e.conditionType === Hn.STX || e.conditionType === Hn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new yi("The post-condition amount may not be larger than 8 bytes");
    t.push(ni(e.amount, !1, 8));
  }
  return Yt(t);
}
function B$(e) {
  const t = e.readUInt8Enum(Hn, (o) => {
    throw new Wn(`Could not read ${o} as PostConditionType`);
  }), n = I$(e);
  let r, s, i;
  switch (t) {
    case Hn.STX:
      return r = e.readUInt8Enum(ka, (a) => {
        throw new Wn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Qe(e.readBytes(8))}`), {
        type: Ae.PostCondition,
        conditionType: Hn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Hn.Fungible:
      return s = Od(e), r = e.readUInt8Enum(ka, (a) => {
        throw new Wn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Qe(e.readBytes(8))}`), {
        type: Ae.PostCondition,
        conditionType: Hn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Hn.NonFungible:
      s = Od(e);
      const o = fr(e);
      return r = e.readUInt8Enum(Md, (a) => {
        throw new Wn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Ae.PostCondition,
        conditionType: Hn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Wr(e, t) {
  return Yt([e, t]);
}
function M$(e) {
  return new Uint8Array([e.type]);
}
function N$(e) {
  return e.type === ce.OptionalNone ? new Uint8Array([e.type]) : Wr(e.type, Gt(e.value));
}
function _$(e) {
  const t = new Uint8Array(4);
  return Di(t, e.buffer.length, 0), Wr(e.type, Fl(t, e.buffer));
}
function P$(e) {
  const t = Vf(R4(e.value, BigInt(r8)), gm);
  return Wr(e.type, t);
}
function U$(e) {
  const t = Vf(e.value, gm);
  return Wr(e.type, t);
}
function H$(e) {
  return Wr(e.type, Da(e.address));
}
function O$(e) {
  return Wr(e.type, Fl(Da(e.address), Fo(e.contractName)));
}
function D$(e) {
  return Wr(e.type, Gt(e.value));
}
function F$(e) {
  const t = [], n = new Uint8Array(4);
  Di(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Gt(r);
    t.push(s);
  }
  return Wr(e.type, Yt(t));
}
function j$(e) {
  const t = [], n = new Uint8Array(4);
  Di(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Fi(s);
    t.push(Fo(i));
    const o = Gt(e.data[s]);
    t.push(o);
  }
  return Wr(e.type, Yt(t));
}
function Hm(e, t) {
  const n = [], r = t == "ascii" ? hm(e.data) : Yo(e.data), s = new Uint8Array(4);
  return Di(s, r.length, 0), n.push(s), n.push(r), Wr(e.type, Yt(n));
}
function R$(e) {
  return Hm(e, "ascii");
}
function z$(e) {
  return Hm(e, "utf8");
}
function Gt(e) {
  switch (e.type) {
    case ce.BoolTrue:
    case ce.BoolFalse:
      return M$(e);
    case ce.OptionalNone:
    case ce.OptionalSome:
      return N$(e);
    case ce.Buffer:
      return _$(e);
    case ce.UInt:
      return U$(e);
    case ce.Int:
      return P$(e);
    case ce.PrincipalStandard:
      return H$(e);
    case ce.PrincipalContract:
      return O$(e);
    case ce.ResponseOk:
    case ce.ResponseErr:
      return D$(e);
    case ce.List:
      return F$(e);
    case ce.Tuple:
      return j$(e);
    case ce.StringASCII:
      return R$(e);
    case ce.StringUTF8:
      return z$(e);
    default:
      throw new yi("Unable to serialize. Invalid Clarity Value.");
  }
}
function G$(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const _0 = /* @__PURE__ */ new Map();
function Om(e, t) {
  const n = _0.get(e);
  if (n !== void 0)
    return n(t);
  const r = G$(e);
  return _0.set(e, r), Om(e, t);
}
class ga {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return e8(this.readBytes(4), 0);
  }
  readUInt8() {
    return J4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return W4(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Qe(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Qe(n);
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
    if (Om(t, r))
      return r;
    throw n(r);
  }
}
function fr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new ga(Nt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new ga(e) : t = e;
  switch (t.readUInt8Enum(ce, (r) => {
    throw new Wn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ce.Int:
      return i$(t.readBytes(16));
    case ce.UInt:
      return on(t.readBytes(16));
    case ce.Buffer:
      const r = t.readUInt32BE();
      return Im(t.readBytes(r));
    case ce.BoolTrue:
      return km();
    case ce.BoolFalse:
      return $m();
    case ce.PrincipalStandard:
      const s = Do(t);
      return t$(s);
    case ce.PrincipalContract:
      const i = Do(t), o = dr(t);
      return Am(i, o);
    case ce.ResponseOk:
      return a$(fr(t));
    case ce.ResponseErr:
      return o$(fr(t));
    case ce.OptionalNone:
      return Lm();
    case ce.OptionalSome:
      return Cm(fr(t));
    case ce.List:
      const a = t.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(fr(t));
      return c$(c);
    case ce.Tuple:
      const d = t.readUInt32BE(), h = {};
      for (let v = 0; v < d; v++) {
        const C = dr(t).content;
        if (C === void 0)
          throw new Wn('"content" is undefined');
        h[C] = fr(t);
      }
      return er(h);
    case ce.StringASCII:
      const u = t.readUInt32BE(), w = V4(t.readBytes(u));
      return ut(w);
    case ce.StringUTF8:
      const y = t.readUInt32BE(), S = Yf(t.readBytes(y));
      return l$(S);
    default:
      throw new Wn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const K$ = (e) => e.length % 2 == 0 ? e : `0${e}`, V$ = (e, t) => e.padEnd(t, "0"), Dm = (e, t) => e ? Yo(e).length > t : !1;
function Dd(e) {
  return sw(e);
}
const Ia = (e) => S8(Jf(e)), sh = (e) => Qe(J8(e)), Y$ = (e) => Qe(Ia(e)), X$ = (e) => {
  const t = Ia(e), n = Fl(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ia(n);
  return Qe(r);
}, q$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = Yt(n), s = Ia(r);
  return Qe(s);
}, W$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Yt(n), s = Jf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Yt(i), a = Ia(o);
  return Qe(a);
};
function Z$(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Fm(e) {
  const t = Gt(e);
  return `0x${Qe(t)}`;
}
function J$(e) {
  return fr(e);
}
const Eo = (e) => {
  try {
    return Yi.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function ih() {
  return {
    type: Ae.MessageSignature,
    data: Qe(new Uint8Array(jl))
  };
}
function jm(e, t, n, r) {
  const s = th(0, e, 1, [Oo(t)]).hash160, i = Xo(Oo(t)) ? Ut.Compressed : Ut.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Tn(n, !1),
    fee: Tn(r, !1),
    keyEncoding: i,
    signature: ih()
  };
}
function La(e) {
  return "signature" in e;
}
function P0(e) {
  return e === At.SerializeP2SH || e === At.SerializeP2WSH;
}
function Q$(e) {
  return e === At.SerializeP2SHNonSequential || e === At.SerializeP2WSHNonSequential;
}
function U0(e) {
  const t = Dd(e);
  return t.nonce = 0, t.fee = 0, La(t) ? t.signature = ih() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function e6(e) {
  const t = [
    e.hashMode,
    Nt(e.signer),
    ni(e.nonce, !1, 8),
    ni(e.fee, !1, 8),
    e.keyEncoding,
    eh(e.signature)
  ];
  return Yt(t);
}
function t6(e) {
  const t = [
    e.hashMode,
    Nt(e.signer),
    ni(e.nonce, !1, 8),
    ni(e.fee, !1, 8)
  ], n = nh(e.fields);
  t.push(rh(n));
  const r = new Uint8Array(2);
  return Z4(r, e.signaturesRequired, 0), t.push(r), Yt(t);
}
function n6(e, t) {
  const n = Qe(t.readBytes(20)), r = BigInt(`0x${Qe(t.readBytes(8))}`), s = BigInt(`0x${Qe(t.readBytes(8))}`), i = t.readUInt8Enum(Ut, (a) => {
    throw new Wn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === At.SerializeP2WPKH && i != Ut.Compressed)
    throw new Wn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Hd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function r6(e, t) {
  const n = Qe(t.readBytes(20)), r = BigInt("0x" + Qe(t.readBytes(8))), s = BigInt("0x" + Qe(t.readBytes(8))), i = Um(t, Ae.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const d of i)
    switch (d.contents.type) {
      case Ae.PublicKey:
        Xo(d.contents) || (o = !0);
        break;
      case Ae.MessageSignature:
        if (d.pubKeyEncoding === Ut.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new vi("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (o && (e === At.SerializeP2WSH || e === At.SerializeP2WSHNonSequential))
    throw new vi("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Su(e) {
  return La(e) ? e6(e) : t6(e);
}
function vu(e) {
  const t = e.readUInt8Enum(At, (n) => {
    throw new Wn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === At.SerializeP2PKH || t === At.SerializeP2WPKH ? n6(t, e) : r6(t, e);
}
function Rm(e, t, n, r) {
  const i = e + Qe(new Uint8Array([t])) + Qe(ni(n, !1, 8)) + Qe(ni(r, !1, 8));
  if (Nt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return sh(Nt(i));
}
function zm(e, t, n) {
  const r = 33 + jl, s = Xo(t) ? Ut.Compressed : Ut.Uncompressed, i = e + K$(s.toString(16)) + n.data, o = Nt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return sh(o);
}
function s6(e, t, n, r, s) {
  const i = Rm(e, t, n, r), o = y$(s, i), a = w$(s), c = zm(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Gm(e, t, n, r, s, i) {
  const o = Rm(e, t, n, r), a = Oo(u$(o, i, s)), c = zm(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function i6() {
  const e = jm(At.SerializeP2PKH, "", 0, 0);
  return e.signer = $$().hash160, e.keyEncoding = Ut.Compressed, e.signature = ih(), e;
}
function H0(e, t, n) {
  return La(e) ? o6(e, t, n) : a6(e, t, n);
}
function o6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Gm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), i = th(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new vi(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function a6(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Ae.PublicKey:
        Xo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case Ae.MessageSignature:
        c.pubKeyEncoding === Ut.Uncompressed && (i = !0);
        const { pubKey: d, nextSigHash: h } = Gm(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (P0(e.hashMode) && (s = h), r.push(d), o += 1, o === 65536)
          throw new vi("Too many signatures");
        break;
    }
  if (P0(e.hashMode) && o !== e.signaturesRequired || Q$(e.hashMode) && o < e.signaturesRequired)
    throw new vi("Incorrect number of signatures");
  if (i && (e.hashMode === At.SerializeP2WSH || e.hashMode === At.SerializeP2WSHNonSequential))
    throw new vi("Uncompressed keys are not allowed in this hash mode");
  const a = th(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new vi(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Km(e) {
  return {
    authType: Dt.Standard,
    spendingCondition: e
  };
}
function Vm(e, t) {
  return {
    authType: Dt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || jm(At.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function O0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Dt.Standard:
        return Km(U0(e.spendingCondition));
      case Dt.Sponsored:
        return Vm(U0(e.spendingCondition), i6());
      default:
        throw new al("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function c6(e, t) {
  switch (e.authType) {
    case Dt.Standard:
      return H0(e.spendingCondition, t, Dt.Standard);
    case Dt.Sponsored:
      return H0(e.spendingCondition, t, Dt.Standard);
    default:
      throw new al("Invalid origin auth type");
  }
}
function l6(e, t) {
  switch (e.authType) {
    case Dt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Tn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case Dt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Tn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function u6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Tn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function d6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Tn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function f6(e, t) {
  const n = {
    ...t,
    nonce: Tn(t.nonce, !1),
    fee: Tn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function h6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Dt.Standard:
      t.push(Su(e.spendingCondition));
      break;
    case Dt.Sponsored:
      t.push(Su(e.spendingCondition)), t.push(Su(e.sponsorSpendingCondition));
      break;
  }
  return Yt(t);
}
function p6(e) {
  const t = e.readUInt8Enum(Dt, (r) => {
    throw new Wn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Dt.Standard:
      return n = vu(e), Km(n);
    case Dt.Sponsored:
      n = vu(e);
      const r = vu(e);
      return Vm(n, r);
  }
}
class g6 {
  constructor(t, n, r, s, i, o, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Tn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? t8, this.postConditionMode = i ?? Ho.Deny, this.postConditions = s ?? nh([]), o)
      this.anchorMode = o8(o);
    else
      switch (r.payloadType) {
        case Ze.Coinbase:
        case Ze.CoinbaseToAltRecipient:
        case Ze.NakamotoCoinbase:
        case Ze.PoisonMicroblock:
        case Ze.TenureChange:
          this.anchorMode = Un.OnChainOnly;
          break;
        case Ze.ContractCall:
        case Ze.SmartContract:
        case Ze.VersionedSmartContract:
        case Ze.TokenTransfer:
          this.anchorMode = Un.Any;
          break;
      }
  }
  signBegin() {
    const t = Dd(this);
    return t.auth = O0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Dd(this);
    return t.auth = O0(t.auth), t.txid();
  }
  verifyOrigin() {
    return c6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Dt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Dt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Dt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !La(n)) {
      const r = Xo(t);
      n.fields.push(xo(r ? Ut.Compressed : Ut.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = s6(n, r, t.fee, t.nonce, s);
    return La(t) ? t.signature = i : t.fields.push(xo(s.data.byteLength === pm ? Ut.Compressed : Ut.Uncompressed, i)), o;
  }
  txid() {
    const t = this.serialize();
    return sh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Dt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = f6(this.auth, t);
  }
  setFee(t) {
    this.auth = l6(this.auth, t);
  }
  setNonce(t) {
    this.auth = u6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Dt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = d6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new yi('"version" is undefined');
    if (this.chainId === void 0)
      throw new yi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new yi('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new yi('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new yi('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Di(n, this.chainId, 0), t.push(n), t.push(h6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(rh(this.postConditions)), t.push(Mm(this.payload)), Yt(t);
  }
}
function So(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new ga(Nt(e.slice(2))) : t = new ga(Nt(e)) : e instanceof Uint8Array ? t = new ga(e) : t = e;
  const n = t.readUInt8Enum(sl, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = p6(t), i = t.readUInt8Enum(Un, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = t.readUInt8Enum(Ho, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Um(t, Ae.PostCondition), c = E$(t);
  return new g6(n, s, c, a, o, i, r);
}
const y6 = r$, ya = on, w6 = Im;
const m6 = /* @__PURE__ */ new Set([4001, -31001]), b6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], x6 = ["result", "data", "payload", "response", "params"], D0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Gl = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), Zi = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, us = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, S6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Ym = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => S6(i, r)) === s
  );
}, Xm = (e) => e ? Ym(Zi()).some(
  (t) => {
    var n;
    return t.id === e && (Gl(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, qm = () => {
  if (typeof window > "u")
    return;
  const e = Zi(), t = Ym(e).filter(
    (n) => {
      var r;
      return Gl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = us(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of b6) {
    const r = us(e, n) ?? (e === window ? void 0 : us(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, v6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = Zi(), n = us(t, e) ?? (t === window ? void 0 : us(window, e)) ?? Tl(e);
  if (n)
    return n;
  if (Gl(e) || Xm(e))
    return qm();
}, wc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, E6 = ["blockstack-session", "blockstack"], A6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of E6) {
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
A6();
const Wm = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, qn = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, k6 = (e) => {
  const t = qn(e);
  if (!t)
    return null;
  const n = Wm(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, $6 = (e) => {
  const t = qn(e);
  if (!t)
    return null;
  const n = Wm(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Fd = (e, t = "mainnet") => {
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
      return Fd(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Fd(r, t);
  }
  return t;
}, ki = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, Ca = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return Eo(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const i = Ca(s, t + 1);
      if (i)
        return i;
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
  for (const s of r) {
    if (!(s in n))
      continue;
    const i = Ca(n[s], t + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Eo(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Eo(n.testnet) ? n.testnet.trim() : null;
}, F0 = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Zm = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && m6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ji = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = qn(n == null ? void 0 : n.message) ?? qn(t.message) ?? qn(t.error) ?? qn(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, jo = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw ji(t);
    if (t.status === "error")
      throw ji(t.result ?? t);
  }
  return e;
}, j0 = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return jo(r);
  } catch (r) {
    throw ji(r);
  }
}, Jm = () => qm(), oh = () => {
  if (typeof window > "u")
    return;
  const e = Zi();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = us(e, t) ?? (e === window ? void 0 : us(window, t));
    if (n)
      return n;
  }
}, R0 = () => {
  if (typeof window > "u")
    return;
  const e = oh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = Zi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = us(t, n) ?? (t === window ? void 0 : us(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Pc = (e) => {
  var r, s;
  const t = Mi();
  if (Gl(t) || Xm(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Zi() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === Jm();
}, Eu = (e) => {
  const t = $6(e);
  if (!t)
    return null;
  try {
    const n = So(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, cl = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = Eu(e), r = k6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? qn(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = cl(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let i = null;
  for (const a of D0)
    if (Eu(s[a])) {
      i = qn(s[a]);
      break;
    }
  const o = qn(s.txId) || qn(s.txid) || qn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? qn(s.txRaw) ?? void 0
    };
  for (const a of D0) {
    const c = Eu(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: qn(s[a]) ?? void 0
      };
  }
  for (const a of x6) {
    const c = s[a], d = cl(c, t + 1);
    if (d)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...d,
        txId: d.txId,
        txid: d.txid ?? d.txId
      };
  }
  return null;
}, Au = (e) => {
  const t = cl(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, I6 = (e) => {
  const t = cl(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, L6 = (e) => ({
  ...e,
  fee: ki(e.fee),
  nonce: ki(e.nonce),
  sponsored: e.sponsored === !0
}), z0 = (e) => ({
  recipient: e.recipient,
  amount: ki(e.amount) ?? "0",
  memo: e.memo,
  network: Fd(e.network),
  address: e.stxAddress,
  fee: ki(e.fee),
  nonce: ki(e.nonce),
  sponsored: e.sponsored ?? !1
}), Qm = "WALLET_ADDRESS_MISMATCH", C6 = 45e3;
let wa = null;
const jd = (e) => {
  e && (wa = { address: e, at: Date.now() });
}, T6 = () => {
  wa = null;
}, B6 = () => wa && Date.now() - wa.at <= C6 ? wa.address : null, M6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, N6 = async (e) => {
  T6();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = jo(await e.request("wallet_connect")), n = Ca(t);
  return jd(n), n;
}, _6 = async (e, t, n, r) => {
  try {
    return jo(await e.request(t, n));
  } catch (s) {
    const i = ji(s);
    if (!M6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: i.message
    });
    let o = null;
    try {
      o = await N6(e);
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
        { code: o ? Qm : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: o });
    try {
      return jo(await e.request(t, n));
    } catch (a) {
      throw ji(a);
    }
  }
};
let G0 = 3e4;
const P6 = (e, t) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${G0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, G0);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, U6 = async (e, t, n) => {
  const r = (c, d) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${d}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Qm }
      );
    return c;
  }, s = B6();
  if (s)
    return wc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  wc(n, "account-read");
  try {
    const c = jo(
      await P6(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ca(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Zm(c))
      throw ji(c);
    wc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return jd(i), r(i, "wallet_getAccount");
  let o;
  wc(n, "account-reconnect");
  try {
    o = jo(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ji(c);
  }
  const a = Ca(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return jd(a), r(a, "wallet_connect");
}, H6 = async (e, t) => {
  if (!Pc(e)) {
    const i = await j0(
      e,
      "stx_transferStx",
      z0(t)
    );
    return Au(i);
  }
  const n = oh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await j0(
      n,
      "stx_transferStx",
      z0(t)
    );
    return Au(i);
  }
  const r = Jm();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await U6(r, t.stxAddress);
  const s = await _6(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: ki(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: ki(t.fee) } : {}
    },
    t.stxAddress
  );
  return Au(s);
}, O6 = () => Mi(), eb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = Mi(), t = e ? v6(e) : void 0;
  if (t)
    return t;
  const n = Zi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, K0 = (e, t) => {
  const n = eb(), r = L6({
    ...e,
    onFinish: (s) => {
      var i;
      (i = e.onFinish) == null || i.call(e, I6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return hc(r, t);
  if (Pc(n) && !oh()) {
    const s = R0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Mi(),
        route: "legacy-transaction-request"
      }), hc(r, s);
  }
  return void H6(n, e).then((s) => {
    var i;
    (i = e.onFinish) == null || i.call(e, s);
  }).catch((s) => {
    var i, o;
    if (F0(s) && Pc(n)) {
      const a = R0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Mi(),
          route: "legacy-transaction-request"
        }), hc(r, a);
        return;
      }
    }
    if (F0(s) && !Pc(n)) {
      hc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Zm(s)) {
      (i = e.onCancel) == null || i.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (o = e.onCancel) == null || o.call(e);
  });
}, D6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), V0 = (e) => Fm(e).replace(/^0x/, ""), Y0 = "This wallet cannot sign messages. Try Xverse or Leather.", X0 = (e) => typeof (e == null ? void 0 : e.request) == "function", q0 = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", F6 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, j6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function R6(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: V0(t.message),
    domain: V0(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function z6(e, t) {
  const n = await P4({
    domain: t.domain,
    message: t.message,
    network: Ol(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? D6()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function ku(e) {
  var s, i;
  const t = O6() || "", n = /xverse/i.test(t);
  let r = eb();
  if (n && !q0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (q0(r))
    try {
      return await z6(r, e);
    } catch (o) {
      if (n || !X0(r) || !j6(o)) throw o;
    }
  if (!n && X0(r))
    try {
      return await R6(r, e);
    } catch (o) {
      throw F6(o) ? new Error(Y0) : o;
    }
  throw new Error(Y0);
}
const W0 = 1000000n, as = 1000000n, ll = 50n, Kt = 3000n, Nr = 300n, ra = 3000n, G6 = 50000n, $u = 200n, Kl = 15000n, Sn = (e) => e + ll;
function kr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / W0}.${(n % W0).toString().padStart(6, "0")}`;
}
function Z0(e, t = Nr) {
  return e <= Kt ? 0 : Number((e - Kt) / Sn(t));
}
function Iu(e, t = 0n) {
  const n = as - e - t;
  return n > 0n ? n : 0n;
}
function K6(e, t = Nr) {
  return e > as ? "over" : e < Kt + Sn(t) ? "empty" : e < G6 ? "low" : "ok";
}
const V6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", Y6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", X6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function q6(e) {
  var n, r, s, i;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = t["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || X6.some((o, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== V6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const tb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Lu = 3, W6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", Z6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", J0 = 1, [Rd, nb] = tb.split("."), ar = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function zd(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function J6(e) {
  return ar(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function ei(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function rb(e, t = []) {
  const n = await ei(`/v2/contracts/call-read/${Rd}/${nb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Rd, arguments: t.map((r) => "0x" + ar(Gt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Ir(fr(n.result));
}
async function Q6() {
  const e = await ei(`/v2/contracts/source/${Rd}/${nb}?proof=0`);
  if (typeof e.source != "string" || await J6(e.source) !== Y6) throw Error("Deployed source does not match the tested helper.");
  if (q6(await rb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function sb(e) {
  return e.startsWith("SP") && Eo(e) && !e.includes(".");
}
async function e5(e) {
  var r;
  if (!sb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await ei(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await ei(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function t5(e) {
  const t = await ei(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function n5(e, t) {
  var s, i;
  const n = await rb("get-owner", [ya(e), ya(t)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !sb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function r5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: zd(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const s = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(s, { feeRejected: !0 }), s;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function s5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function i5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = So(zd(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || bo(ua(il.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const i = t.postConditions.values[0];
    if (r.payloadType !== 2 || bo(r.contractAddress) + "." + r.contractName.content !== tb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || ar(Gt(r.functionArgs[0])) !== ar(Gt(ya(e.core))) || ar(Gt(r.functionArgs[1])) !== ar(Gt(ya(e.song))) || ar(Gt(r.functionArgs[2])) !== ar(Gt(w6(zd(e.id)))) || e.amount !== "50" || t.postConditionMode !== Ho.Deny || t.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ka.Equal || i.principal.prefix !== 2 || bo(i.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || bo(r.contractAddress) + "." + r.contractName.content !== W6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || ar(Gt(r.functionArgs[0])) !== ar(Gt(ya(e.song))) || typeof e.liked != "boolean" || ar(Gt(r.functionArgs[1])) !== ar(Gt(y6(e.liked))) || e.amount !== "0" || t.postConditionMode !== Ho.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Ir(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const o5 = "xtrata.xyz/radio/listening-wallet", a5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Rr = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && Eo(e), c5 = (e) => ({
  domain: er({ name: ut(o5), version: ut("1"), "chain-id": on(1) }),
  message: er({
    purpose: ut(a5),
    main: ut(e.main),
    listening: ut(e.listening),
    issued: on(e.issued)
  })
}), ib = 100000n, l5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function u5(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !Rr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= ib).sort(l5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const mc = 50;
function ul(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const s = Number(r.block_height), i = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(s) || !Number.isSafeInteger(i)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: s, txIndex: i });
  }
  return { total: t.total, transfers: n };
}
async function d5(e, t, n = 4) {
  if (!Rr(e)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${e}/stx_inbound?limit=${mc}&offset=${o}`, s = ul(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - mc);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= mc ? s : ul(await t(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = u5(a.transfers, e);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - mc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const rs = 50, f5 = 6, h5 = 20, Q0 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function eg(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const i of n.results) {
    const o = i && typeof i == "object" && i.tx && typeof i.tx == "object" ? i.tx : i;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (s.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== t || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), d = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(d)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: d });
  }
  return { total: n.total, sent: r, rows: s };
}
async function p5(e, t, n) {
  if (!Rr(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${rs}&offset=0`));
    if (!s || s.total > f5 * rs) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = rs; o < s.total; o += rs) {
      const a = ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${rs}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (d) => `/extended/v1/address/${e}/transactions?limit=${rs}&offset=${d}`, a = eg(await t(o(0)), e);
      if (!a || a.total > h5 * rs) return { ok: !1 };
      const c = new Set(a.rows);
      for (const d of a.sent) i.set(d.txId, d);
      for (let d = rs; d < a.total; d += rs) {
        const h = eg(await t(o(d)), e);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const u of h.rows) c.add(u);
        for (const u of h.sent) i.set(u.txId, u);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...i.values()] };
  } catch {
    return { ok: !1 };
  }
}
function g5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((u) => u && typeof u.sender == "string" && u.sender !== t && /^\d+$/.test(u.amount) && BigInt(u.amount) > 0n).sort(Q0).map((u, w) => {
    const y = BigInt(u.amount);
    return r && u.sender === r.sender ? { sender: u.sender, left: y, kind: "gift", to: r.payer, at: w } : Rr(u.sender) && y >= ib ? { sender: u.sender, left: y, kind: "deposit", to: u.sender, at: w } : { sender: u.sender, left: y, kind: "dust", to: null, at: w };
  }), i = s.reduce((u, w) => u + w.left, 0n), o = [...e.outgoing].filter((u) => u && u.recipient !== t && Rr(u.recipient) && u.amount > 0n).sort(Q0), a = o.reduce((u, w) => u + w.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const d = (u, w) => {
    let y = w;
    for (const S of u) {
      if (y <= 0n) break;
      const v = S.left < y ? S.left : y;
      S.left -= v, y -= v;
    }
    return y;
  };
  for (const u of o) {
    const w = d(s.filter((y) => y.to === u.recipient), u.amount);
    w > 0n && d(s, w);
  }
  if (d(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((u, w) => u + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const u of s) {
    if (u.left <= 0n) continue;
    const w = `${u.kind}:${u.to ?? ""}`, y = h.get(w);
    y ? (y.amount += u.left, y.newest = Math.max(y.newest, u.at)) : h.set(w, { to: u.to, kind: u.kind, amount: u.left, newest: u.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((u, w) => u.newest - w.newest),
    hasTopUp: s.some((u) => u.kind === "deposit")
  };
}
function y5(e, t) {
  const n = e.filter((d) => d.kind === "deposit").sort((d, h) => d.newest - h.newest), r = e.find((d) => d.kind === "gift"), s = e.filter((d) => d.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((d, h) => d + h.amount, 0n), o = [], a = [], c = i > t;
  return n.forEach((d, h) => {
    if (d.amount <= t) {
      a.push(d);
      return;
    }
    const u = h === n.length - 1 && !c;
    o.push({ to: d.to, kind: "deposit", mode: u ? "all" : "amount", send: d.amount - t });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - t }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function tg(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const bc = 1500n, Uc = [100, 250, 500], w5 = (e, t) => BigInt(e) * Sn(t), sa = ["prepared", "signed", "unknown", "pending"], m5 = 30 * 6e4, dl = 6e4, lo = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, b5 = 3e3, fl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Cu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function x5(e) {
  let t = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, d = null, h = !1, u = !1, w = !1, y = null, S = !1, v = "", C = "", P = 0, H, k = null, M, U = [], Y, le = -1 / 0;
  const ne = /* @__PURE__ */ new Set();
  let q = null, m = !1, I = 0, N = null, _ = null, W = !1, R = null, ue = !1, de = null, Oe = !1, L = !1, j = !1, fe = !1, ye = !1, Le = 0, Be = null, Ct = Promise.resolve();
  const He = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Nr.toString()), Me = (b) => !!i && !(i.features ?? []).includes(b), Ne = (b, $) => `xtrata.ppp.v1.${b}:${$}`, qt = "xtrata.ppp.v1.as-main", jt = () => {
    if (e.main()) return;
    const b = e.store.get(qt);
    return b && Rr(b) ? b : void 0;
  }, et = () => e.main() ?? jt(), Wt = (b = i == null ? void 0 : i.address) => {
    if (!b) return [];
    try {
      const $ = JSON.parse(e.store.get(Ne("entries", b)) || "[]");
      return Array.isArray($) ? $ : [];
    } catch {
      return [];
    }
  }, gt = (b) => {
    const $ = [b, ...Wt(b.address).filter((G) => !(G.txid === b.txid && G.kind === b.kind))].slice(0, 200);
    e.store.set(Ne("entries", b.address), JSON.stringify($));
  }, z = (b = i == null ? void 0 : i.address) => !!b && e.store.get(Ne("on", b)) !== "0", O = (b) => {
    i != null && i.address && e.store.set(Ne("on", i.address), b ? "1" : "0");
  }, ee = () => Wt().filter((b) => sa.includes(b.status)), Q = () => Fe() ? [...ee(), ...Wt(Ge()).filter((b) => sa.includes(b.status))] : ee(), he = () => lt(i == null ? void 0 : i.address), lt = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(e.store.get(Ne("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, $e = (b, $ = i == null ? void 0 : i.address) => {
    $ && e.store.set(Ne("deposit", $), JSON.stringify(b));
  };
  let Pe = null;
  const ft = (b = dl) => {
    const $ = e.now();
    Pe = { since: Pe && $ < Pe.until ? Pe.since : $, until: Math.max((Pe == null ? void 0 : Pe.until) ?? 0, $ + b) };
  }, _e = () => !!Pe && e.now() < Pe.until && (o === void 0 || o < Kt + Sn(He())), ve = () => !!he() || _e(), Ge = () => Me("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), Fe = () => !!(i != null && i.address) && Ge() !== i.address, Se = () => Fe() ? c && c.for === Ge() ? c.value : void 0 : o, Lt = (b) => b !== void 0 && b < Kt + $u, pn = () => ee().filter((b) => e.now() - b.created > m5 && ne.has(b.txid)), En = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!et() || r === et() && !t.allowed), yt = () => En() && !(i != null && i.linked), gn = () => {
    const b = et();
    return !yt() && !!b && !!(i != null && i.linked) && i.linked !== b;
  }, Qt = (b) => Ne("return-to", b), en = (b = i == null ? void 0 : i.address) => {
    if (!b) return;
    const $ = e.store.get(Qt(b));
    return $ && Rr($) && $ !== b ? $ : void 0;
  }, Bn = (b = i == null ? void 0 : i.address) => q && q.for === b ? q.res : null;
  function Dn() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const b = en();
    if (b) return { to: b, kind: "chosen" };
    const $ = Bn();
    if ($ != null && $.ok && $.funder) return { to: $.funder, kind: "funder" };
  }
  const tr = (b) => Ne("gift", b);
  function tn() {
    const b = i == null ? void 0 : i.address;
    if (!b) return null;
    if ((R == null ? void 0 : R.for) === b) return R.info;
    try {
      const $ = JSON.parse(e.store.get(tr(b)) || "null");
      return $ && typeof $.returnTo == "string" && typeof $.treasury == "string" ? $ : null;
    } catch {
      return null;
    }
  }
  const hr = () => (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : ((i == null ? void 0 : i.slot) ?? 0) === 0 ? i == null ? void 0 : i.address : void 0;
  let A = null, D = null, K = !1;
  const V = (b) => Ne("award-claim", b), ie = (b) => Ne("award-send", b), E = (b) => {
    try {
      const $ = JSON.parse(e.store.get(ie(b)) || "null");
      return $ && typeof $.txid == "string" && e.now() - $.at < 2 * 36e5 ? $ : null;
    } catch {
      return null;
    }
  }, re = (b) => {
    try {
      const $ = JSON.parse(e.store.get(V(b)) || "null");
      return $ && typeof $.txid == "string" && e.now() - $.at < 2 * 36e5 ? $ : null;
    } catch {
      return null;
    }
  };
  async function Ie(b = !1) {
    const $ = hr();
    if (!$ || !e.awardStatus || K) return;
    const G = (A == null ? void 0 : A.for) === $ ? A : null, te = G == null ? void 0 : G.view.state, l = G ? te === "off" || te === "not-a-player" ? 30 * 6e4 : re($) || E($) ? 2e4 : te === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(G && !b && e.now() - G.at < l)) {
      K = !0;
      try {
        const p = await e.awardStatus($);
        if (A = { for: $, view: p, at: e.now() }, p.state === "claimed" && e.store.set(V($), ""), p.state === "claimed" && p.holds === !1 && e.store.set(ie($), ""), p.state === "ready" && e.awardName && (D == null ? void 0 : D.for) !== $)
          try {
            D = { for: $, name: await e.awardName($), at: e.now() };
          } catch {
            D = { for: $, name: void 0, at: e.now() };
          }
      } catch {
        A = { for: $, view: G && G.view.state !== "off" && G.view.state !== "not-a-player" ? { ...G.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        K = !1;
      }
    }
  }
  function De() {
    const b = hr();
    if (!b || (A == null ? void 0 : A.for) !== b) return null;
    const $ = A.view;
    if ($.state === "off" || $.state === "not-a-player") return null;
    const G = $.state === "claimed" ? null : re(b), te = $.state === "claimed" && $.holds !== !1 ? E(b) : null;
    return { ...$, ...(D == null ? void 0 : D.for) === b ? { name: D.name } : {}, ...G ? { claimTx: G.txid } : {}, ...te ? { sendTx: te.txid } : {} };
  }
  async function pt() {
    var l;
    const b = i == null ? void 0 : i.address;
    if (!b || !e.giftInfo || !((l = t == null ? void 0 : t.gifts) != null && l.enabled) || ue) return;
    const $ = (R == null ? void 0 : R.for) === b ? R : null, G = $ ? $.ok ? $.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if ($ && e.now() - $.at < G) return;
    ue = !0;
    const te = tn();
    try {
      const p = await e.giftInfo(b);
      R = { for: b, info: p, ok: !0, at: e.now() }, e.store.set(tr(b), JSON.stringify(p));
    } catch {
      R = { for: b, info: te, ok: !1, at: e.now() };
    } finally {
      ue = !1;
    }
  }
  const je = () => Wt().reduce((b, $) => sa.includes($.status) ? b + BigInt($.amount || "0") + BigInt($.fee || "0") : b, 0n);
  function wt() {
    if (o === void 0) return 0;
    const b = o - je() - BigInt(kt.length) * Sn(He());
    return b > 0n ? Z0(b, He()) : 0;
  }
  const tt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", We = "EMPTY — ADD STX TO PLAY";
  function Rt() {
    if (!(t != null && t.here)) return null;
    const b = ($, G) => ({ reason: $, text: G });
    switch (An()) {
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
        return ve() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", Fe() ? tt : We);
      case "ready":
        return !z() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= e.now() ? b("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : j ? wt() < 1 ? b("out", Fe() ? tt : We) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Ce = () => {
    var b;
    return !!(i != null && i.address) && Fe() && !!((b = tn()) != null && b.player);
  };
  function mt() {
    return Ce() ? { locked: !0, known: !0 } : null;
  }
  const Xt = 3 * 6e4, pr = () => !!tn() && !!e.history && !(i != null && i.linked);
  async function gr() {
    const b = i.address, $ = tn(), { balance: G, nonce: te } = await e.chain.account(b), l = await e.history(b, !0);
    if (!l.ok) return null;
    const p = g5({ self: b, balance: G, inbound: l.inbound, outgoing: l.outgoing, gift: { sender: $.treasury, payer: $.returnTo } });
    if (!p.ok) return null;
    const g = y5(p.parts, ra);
    return { balance: G, nonce: te, parts: p.parts, steps: g.steps, tooSmall: g.tooSmall.length };
  }
  const ps = () => Oe ? { state: "unavailable" } : !de || e.now() - de.at > Xt || o !== void 0 && o !== de.balance ? { state: "none" } : de.plan;
  function An() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const b = et();
    if (!yt()) {
      if (!b) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : gn() ? "wrong-wallet" : i.state === "known" ? "locked" : !yt() && i.linked !== b ? "link" : o === void 0 ? "loading" : o > as && !i.backedUp ? "over" : o < Kt + Sn(He()) ? "fund" : "ready" : "loading";
  }
  const Fn = () => {
    var b, $, G, te, l;
    return {
      step: An(),
      busy: d,
      message: v,
      error: C,
      notice: Ji(),
      gate: t,
      main: et(),
      mainConnected: !!e.main(),
      standIn: jt(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      award: De(),
      unproven: !!(i != null && i.unproven),
      phrase: !!(i != null && i.phrase),
      backedUp: !!(i != null && i.backedUp),
      balance: o,
      balanceState: o === void 0 ? void 0 : ((p) => p === "over" && (i != null && i.backedUp) ? "ok" : p)(K6(o, He())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: o !== void 0 && o > as && !!(i != null && i.backedUp),
      playsLeft: o === void 0 ? 0 : Z0(o, He()),
      allowance: o === void 0 ? as : Iu(o, BigInt(((b = he()) == null ? void 0 : b.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: z(),
      entries: Wt(),
      depositTxid: (($ = he()) == null ? void 0 : $.txid) ?? H,
      depositPending: ve(),
      arrival: ve() ? { since: ((G = he()) == null ? void 0 : G.at) ?? (Pe == null ? void 0 : Pe.since) ?? e.now(), graceMs: dl } : null,
      walletOutdated: Me("like"),
      canAnother: !!i && !Me("another"),
      canForget: !!i && !Me("forget"),
      passkeyName: i == null ? void 0 : i.passkeyName,
      hadGift: i != null && i.address && (R == null ? void 0 : R.for) === i.address && R.ok ? !!R.info : null,
      linkedListening: Y && Y === et() ? U.map((p) => p.listening) : [],
      serverLinked: !!k && M === `${et()}:${i == null ? void 0 : i.address}`,
      stuck: pn().length,
      armed: fe,
      queued: kt.length,
      solo: yt(),
      returnTo: (te = Dn()) == null ? void 0 : te.to,
      returnToKind: (l = Dn()) == null ? void 0 : l.kind,
      funderState: (() => {
        const p = Bn();
        return p ? p.ok ? p.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const p = Bn();
        return !!p && p.ok && p.distinct > 1;
      })(),
      walletCannotSolo: yt() && Me("standalone"),
      walletCannotMulti: Me("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((p) => p !== et() && p !== (i == null ? void 0 : i.linked)),
      creditedTo: yt() && (i != null && i.address) && (N == null ? void 0 : N.for) === i.address && N.main ? N.main : void 0,
      createdHere: !!(i != null && i.address) && e.store.get(Ne("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (_ == null ? void 0 : _.for) === i.address && _.unused,
      gift: (() => {
        const p = tn();
        return p ? { player: p.player, from: p.from, source: p.source, amount: p.amount, ...p.drop !== void 0 ? { drop: p.drop } : {} } : null;
      })(),
      giftPlays: tn() ? wt() : 0,
      playCost: Sn(He()),
      giftStop: Rt(),
      albumLock: mt(),
      returnPlan: ps(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Me("slots"),
      likeFunds: (() => {
        var f;
        const p = Ge();
        if (!p || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const g = Se();
        return { address: p, balance: g, low: Lt(g), album: Fe(), pending: !!lt(p), txid: (f = lt(p)) == null ? void 0 : f.txid, main: et() };
      })()
    };
  }, Ji = () => P ? P < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", nt = (b, $ = "") => {
    v = b, C = $, e.changed();
  };
  async function zt(b, $) {
    if (!d) {
      d = b, C = "", e.changed();
      try {
        await $();
      } catch (G) {
        const te = G instanceof Error ? G.message : String(G);
        C = /Cancelled in the listening wallet/.test(te) ? "" : te, C || (v = "Not now. Nothing was signed.", ye = !0);
      } finally {
        d = null, await Rn(!0);
      }
    }
  }
  const Mn = () => !!(t != null && t.enabled) && t.here && (yt() || !!et() && t.allowed), Nn = () => Mn() && !gn(), jn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", yn = () => {
    if (gn()) throw new Error(jn());
  };
  async function kn() {
    if (!Mn()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const an = (b) => {
    const $ = et();
    return b.request("listening.status", $ ? { main: $ } : void 0);
  };
  async function gs(b = !1) {
    i != null && i.address && (!b && e.now() - a < 3e4 || (o = await e.chain.balance(i.address), a = e.now(), await yr(b)));
  }
  async function yr(b = !1) {
    const $ = Ge();
    if (!(!Fe() || !$ || (i == null ? void 0 : i.state) !== "unlocked") && !(!b && (c == null ? void 0 : c.for) === $ && e.now() - c.at < 3e4))
      try {
        c = { for: $, value: await e.chain.balance($), at: e.now() };
      } catch {
      }
  }
  async function Qi(b) {
    if ((Y !== b || e.now() - le >= 6e4) && (U = await e.links(b), Y = b, le = e.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === b) return;
    const $ = `${b}:${i.address}`;
    M === $ && k || (k = U.find((G) => G.listening === i.address) ?? null, M = $);
  }
  async function eo() {
    const b = i == null ? void 0 : i.address;
    if (!yt() || !b || i != null && i.linked || !e.funder || m || !o || o <= 0n) return;
    const $ = Bn(b);
    if ($ != null && $.ok && $.funder) return;
    const G = $ != null && $.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
    if (!(q && q.for === b && e.now() - q.at < G)) {
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
  async function Zt() {
    const b = i == null ? void 0 : i.address;
    if (!(!yt() || !b || i != null && i.linked || !e.mainOf || W) && !(N && N.for === b && (N.ok || e.now() - N.at < 6e4))) {
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
  async function si() {
    const b = i == null ? void 0 : i.address;
    if (!(!b || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (_ == null ? void 0 : _.for) === b) && e.store.get(Ne("created", b)) !== "1")
      try {
        _ = { for: b, unused: await e.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function ii() {
    var l;
    const b = i == null ? void 0 : i.address;
    if (!b) return !1;
    let $, G = !1;
    const te = /* @__PURE__ */ new Map();
    for (const p of Q())
      try {
        const g = await e.chain.transaction(p.txid);
        if (!g) {
          if (ne.add(p.txid), e.now() - p.created > 15 * 6e4 && !te.has(p.address) && te.set(p.address, await e.chain.confirmedNonce(p.address)), $ = te.get(p.address), $ !== void 0 && $ > BigInt(p.nonce)) {
            gt({ ...p, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((p.status === "unknown" || p.status === "signed") && p.raw)
            try {
              await e.chain.broadcast(p.raw, p.txid), gt({ ...p, status: "pending" });
            } catch (T) {
              lo(T) && gt({ ...p, status: "failed", note: T.message, raw: void 0 });
            }
          continue;
        }
        ne.delete(p.txid);
        const f = String(g.tx_status);
        if (f === "success" && g.canonical !== !1 && g.is_unanchored === !1) {
          if (gt({ ...p, status: "confirmed", confirmedAt: e.now(), actualFee: String(g.fee_rate ?? p.fee), raw: void 0 }), G = !0, p.kind === "like" && (S = !0, p.status !== "confirmed" && typeof p.liked == "boolean"))
            try {
              (l = e.likeConfirmed) == null || l.call(e, p.song, p.liked);
            } catch {
            }
        } else f.startsWith("abort_") || f.startsWith("dropped_") ? gt({ ...p, status: "failed", note: f, raw: void 0 }) : p.status !== "pending" && gt({ ...p, status: "pending" });
      } catch {
      }
    for (const p of Fe() ? [b, Ge()] : [b]) {
      const g = lt(p);
      if (g)
        try {
          const f = await e.chain.transaction(g.txid), T = String((f == null ? void 0 : f.tx_status) ?? "");
          (T === "success" && f.is_unanchored === !1 || T.startsWith("abort_") || T.startsWith("dropped_") || !f && e.now() - g.at > 2 * 36e5) && ($e(null, p), T === "success" && ft(2e4), a = -1 / 0, c = null, /on its way/i.test(v) && (v = ""));
        } catch {
        }
    }
    return G;
  }
  async function Rn(b = !1) {
    var $;
    try {
      const G = et();
      if ((b || !t || r !== G || e.now() - n > 3e5) && (t = await e.config(G), n = e.now(), r = G), !t.enabled || !t.here || !yt() && (!G || !t.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), fe && ai(), e.changed();
        return;
      }
      await kn(), i = await an(s), gn() && i.state === "unlocked" && (mr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await an(s)), G && t.allowed && await Qi(G), await gs(b), await eo(), await Zt(), await si(), await pt(), await Ie(), await ii() && await gs(!0), await yr(), await bs(), P = 0;
    } catch {
      P++;
    }
    if (An() === "locked" ? oi() : fe && ai(), S) {
      S = !1;
      try {
        ($ = e.likesChanged) == null || $.call(e);
      } catch {
      }
    }
    e.changed(), kt.length && !xs && Ss();
  }
  async function qo(b) {
    const $ = i == null ? void 0 : i.root;
    if (!$ || i != null && i.slot || !(i != null && i.address) || Me("slots")) return;
    const G = Number(e.store.get(Ne("slot", $)));
    if (!(!Number.isSafeInteger(G) || G < 1))
      try {
        const { balance: te } = await e.chain.account(i.address);
        if (te >= Kt + Sn(He())) return;
        await b.request("listening.openSlot", { slot: G }), i = await an(b), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function ys(b, $) {
    var p;
    yn();
    const G = !(i != null && i.address) || z(i.address), te = i != null && i.linked ? (p = e.nameOf) == null ? void 0 : p.call(e, i.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: G ? ci() : void 0, anyPasskey: $, ...et() ? { main: et() } : {}, ...te ? { label: te } : {} }), i = await an(b), G && (z(i.address) ? await nr() : await b.request("listening.stop")), await qo(b), nt(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const l = y;
    y = null, l && e.now() - l.at < 12e4 && setTimeout(() => void Rn(!0).then(() => _n(l)), 0);
  }
  function oi() {
    fe || d || ye || Le >= 3 || !s || !(i != null && i.address) || (fe = !0, Ct = (async () => {
      try {
        await ys(s, !1), Le = 0;
      } catch (b) {
        const $ = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test($) ? Be || (ye = !0, nt("Not now. Nothing was signed.")) : /did not answer/.test($) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Le++, C = $);
      } finally {
        fe = !1;
        const b = Be;
        Be = null, b ? await b() : await Rn(!0);
      }
    })());
  }
  async function ai(b) {
    fe && (Be = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Ct), b && await b(), e.changed();
  }
  const ci = () => ({
    fee: He().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: as.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function nr() {
    if (!(i != null && i.address)) return !1;
    if (j || (j = await e.tabLock(i.address)), !j)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function li(b, $) {
    const G = i.address, { balance: te, nonce: l } = $ ?? await e.chain.account(G);
    o = te;
    const p = await s.request("listening.prepareReturn", {
      mode: b.mode,
      balance: te.toString(),
      nonce: l.toString(),
      fee: ra.toString(),
      ...b.amount !== void 0 ? { amount: b.amount.toString() } : {},
      ...b.linked ? {} : { destination: b.to }
    });
    if (p.recipient !== b.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const g = b.mode === "amount" ? b.amount : b.mode === "all" ? te - ra : te - as - ra, f = So(p.raw);
    if (Ir(f.payload.recipient).value !== b.to || String(f.payload.amount) !== p.amount || g !== void 0 && p.amount !== g.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const T = {
      id: Cu(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: p.recipient,
      amount: p.amount,
      fee: p.fee,
      nonce: l.toString(),
      created: e.now(),
      status: "signed",
      raw: p.raw,
      txid: p.txid
    };
    e.validate(T), gt(T);
    try {
      await e.chain.broadcast(p.raw, p.txid), gt({ ...T, status: "pending" });
    } catch (X) {
      throw gt({ ...T, status: "unknown", note: X.message }), X;
    }
    return p;
  }
  const ui = Kl, ws = ra;
  async function to(b, $, G) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Me("slots") || Me("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const te = i.slot ?? 0;
    if (b === $ || ![b, $].includes(te) || ![b, $].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const l = i.root ?? i.address, p = b === 0 ? l : i.address, g = $ === 0 ? l : i.address, { balance: f, nonce: T } = await e.chain.account(p);
    if (f < G + ws + Kt) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const X = await s.request("listening.signMove", { from: b, to: $, amount: G.toString(), fee: ws.toString(), nonce: T.toString(), balance: f.toString() }), se = So(X.raw);
    if (X.from !== p || X.to !== g || X.amount !== G.toString() || Ir(se.payload.recipient).value !== g || String(se.payload.amount) !== G.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const oe = {
      id: Cu(),
      address: p,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: g,
      amount: X.amount,
      fee: X.fee,
      nonce: T.toString(),
      created: e.now(),
      status: "signed",
      raw: X.raw,
      txid: X.txid
    };
    e.validate(oe), gt(oe);
    try {
      await e.chain.broadcast(X.raw, X.txid), gt({ ...oe, status: "pending" });
    } catch (Ee) {
      throw gt({ ...oe, status: "unknown", note: Ee.message }), Ee;
    }
    return $e({ txid: X.txid, amount: X.amount, at: e.now() }, g), g === l && l !== i.address ? c = null : a = -1 / 0, X;
  }
  let Zr = !1;
  const di = /* @__PURE__ */ new Map(), ms = (b) => Ne("float", b);
  async function bs() {
    if (Zr || (i == null ? void 0 : i.state) !== "unlocked" || !Fe() || Me("move") || Me("rootLike") || !i.address) return;
    const b = i.address;
    if (e.store.get(ms(b)) === "1") return;
    const $ = tn();
    if (!($ != null && $.player) || $.state !== "arrived") return;
    const G = Se();
    if (G === void 0 || o === void 0) return;
    if (!Lt(G)) {
      e.store.set(ms(b), "1");
      return;
    }
    if (lt(Ge()) || fi() || Q().length || o < ui * 4n + Kt + ws) return;
    const te = di.get(b);
    if (!(te && (te.n >= 3 || e.now() - te.at < 5 * 6e4))) {
      Zr = !0, di.set(b, { n: ((te == null ? void 0 : te.n) ?? 0) + 1, at: e.now() });
      try {
        await to(i.slot ?? 0, 0, ui), e.store.set(ms(b), "1");
      } catch (l) {
        console.warn("[radio] likes float not sent yet", l);
      } finally {
        Zr = !1;
      }
    }
  }
  async function Wo(b) {
    if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const $ = await gr().catch(() => null);
    if (!$)
      throw de = null, Oe = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Oe = !1, o = $.balance;
    const G = { balance: $.balance, nonce: $.nonce };
    if (b === "excess") {
      const f = tg($.parts) ?? en();
      if (!f) throw new Error("Choose where to send the excess first.");
      await li({ mode: "excess", to: f, linked: !1 }, G), de = null, nt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const te = $.steps;
    if (!te.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!de && de.balance === $.balance && e.now() - de.at <= Xt && de.steps.length === te.length && de.steps.every((f, T) => f.to === te[T].to && f.mode === te[T].mode && f.send === te[T].send))) {
      de = {
        at: e.now(),
        balance: $.balance,
        steps: te,
        parts: $.parts,
        plan: { state: "ready", steps: te.map((f) => ({ to: f.to, kind: f.kind, send: f.send.toString() })), kept: $.tooSmall, excess: tg($.parts) }
      }, nt(te.length > 1 ? `This goes back in ${te.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const p = te[0], g = p.to ?? en();
    if (!g) throw new Error("Choose where to send the rest first.");
    if (p.mode === "amount" && Me("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await li({ mode: p.mode, to: g, linked: !1, ...p.mode === "amount" ? { amount: p.send } : {} }, G), de = null, te.length === 1 ? (O(!1), nt("Returned ✓ Paying is off.")) : nt(`Returned ✓ ${te.length - 1} more ${te.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function rt() {
    if (!(i != null && i.unproven)) return;
    const b = await kn();
    await b.request("listening.prove"), i = await an(b);
  }
  const Jr = {
    forceRefresh: () => Rn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (b) => {
      if (!e.main() && !(b !== null && !Rr(b))) {
        if (b === jt()) return Rn(!0);
        e.store.set(qt, b ?? ""), C = "", v = "", o = void 0, a = -1 / 0, c = null, await Rn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => zt("Check the listening wallet…", async () => {
      const b = await kn();
      if (Me("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((i == null ? void 0 : i.state) !== "unlocked" || (i.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (o === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (o > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      mr(), await b.request("listening.forget"), o = void 0, i = await an(b), O(!1), nt("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (b) => zt("Waiting for your passkey…", async () => {
      const $ = await kn(), G = !!(b != null && b.another) && !e.main() && !Me("another");
      G && (i == null ? void 0 : i.state) === "unlocked" && await $.request("listening.lock"), await $.request("listening.unlock", { mode: "create", terms: ci(), ...e.main() ? { main: e.main() } : {}, ...b != null && b.quick && !e.main() ? { quick: !0 } : {}, ...G ? { another: !0 } : {} }), i = await an($), i.address && e.store.set(Ne("created", i.address), "1"), O(!0), nt(yt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await nr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (b) => {
      b ? ft() : Pe = null, e.changed();
    },
    giftSent: (b, $) => {
      !(i != null && i.address) || he() || ($e({ txid: b, amount: $.toString(), at: e.now() }), a = -1 / 0, R = null, nt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (yn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Me("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await kn()).request("listening.bindSlot", { slot: b, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, $, G, te) => {
      $e({ txid: G, amount: te.toString(), at: e.now() }, $), R = null, await Jr.openAlbum(b), nt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => zt("Opening…", async () => {
      if (yn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Me("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || u || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === b) return;
      mr(), await s.request("listening.openSlot", { slot: b }), i = await an(s), o = void 0, a = -1 / 0, de = null, Oe = !1;
      const $ = i.root;
      $ && b > 0 && e.store.set(Ne("slot", $), String(b)), nt(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const $ = () => zt("Waiting for your passkey…", async () => ys(await kn(), b));
      return fe ? b ? Me("cancel") ? (nt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ai(async () => {
        (An() === "locked" || An() === "intro") && await $();
      }) : Ct : $();
    },
    link: () => zt("Sign in your wallet…", async () => {
      yn();
      const b = e.main();
      if (!b || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const $ = (await e.links(b)).find((G) => G.listening === i.address);
      if ($)
        await s.request("listening.link", { main: b, issued: $.issued, mainSignature: $.mainSignature });
      else {
        const G = { main: b, listening: i.address, issued: e.now() }, te = await e.signWithMain(b, c5(G)), l = await s.request("listening.link", { main: b, issued: G.issued, mainSignature: te });
        await e.saveLink({ ...G, mainSignature: te, listeningSignature: l.listeningSignature }), le = -1 / 0;
      }
      nt("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => i != null && i.unproven ? (await zt("One more passkey check…", rt), !(i != null && i.unproven)) : !0,
    deposit: () => zt("Approve the deposit in your wallet…", async () => {
      yn(), await rt();
      const b = e.main();
      if (!b || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (he()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (_e()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await gs(!0);
      const $ = Iu(o ?? 0n);
      if ($ <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      H = await e.deposit(b, i.address, $), H && $e({ txid: H, amount: $.toString(), at: e.now() }), nt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => zt("Approve the top-up in your wallet…", async () => {
      yn(), await rt();
      const b = e.main(), $ = Ge();
      if (!b || !$) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (lt($)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const G = await e.chain.balance($);
      Fe() ? c = { for: $, value: G, at: e.now() } : (o = G, a = e.now());
      const te = Iu(G);
      if (te <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const l = await e.deposit(b, $, te);
      l && $e({ txid: l, amount: te.toString(), at: e.now() }, $), nt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (b) => zt("Adding plays…", async () => {
      if (yn(), !Fe()) throw new Error("Open the album you want to add plays to first.");
      if (!Uc.includes(b)) throw new Error("Choose one of the amounts offered.");
      const $ = w5(b, He());
      if (h || u || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (Q().length || he()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await to(0, i.slot ?? 0, $), nt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => zt("Confirm in the listening wallet…", async () => {
      if (!Nn()) throw new Error("Connect your wallet first.");
      await nr(), await s.request("listening.approveSession", ci()), O(!0), nt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => zt("Clearing…", async () => {
      for (const b of pn())
        await e.chain.transaction(b.txid) || gt({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      nt("Cleared ✓");
    }),
    switchOff: () => zt("Switching off…", async () => {
      mr(), await (s == null ? void 0 : s.request("listening.stop")), O(!1), nt("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => zt("Showing your backup words in the box…", async () => {
      if (!(i != null && i.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const b = await kn();
      await b.request("listening.backup"), i = await an(b), nt("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (b, $) => {
      if ((i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Me("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await kn()).request("listening.signShelf", { action: b, ...$ ? { release: $ } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      D = null, await Ie(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (b) => zt("Confirm in the listening wallet…", async () => {
      var T, X, se, oe;
      const $ = hr();
      if ((i == null ? void 0 : i.state) !== "unlocked" || !$) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Me("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (re($)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || u || w || Q().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await nr();
      const G = await e.awardNote($, b), { balance: te, nonce: l } = await e.chain.account($);
      if (te < bc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const g = await (await kn()).request("listening.signAward", {
        cls: G.cls,
        number: G.number,
        plays: G.plays,
        record: G.record,
        signature: G.signature,
        fee: bc.toString(),
        nonce: l.toString(),
        balance: te.toString()
      }), f = So(g.raw);
      if (g.hero !== $ || g.number !== G.number || ((X = (T = f.payload) == null ? void 0 : T.functionName) == null ? void 0 : X.content) !== "claim" || ((oe = (se = f.payload) == null ? void 0 : se.contractName) == null ? void 0 : oe.content) !== Z6.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(g.raw, g.txid), e.store.set(V($), JSON.stringify({ txid: g.txid, at: e.now() })), a = -1 / 0, A && (A = { ...A, at: -1 / 0 }), nt("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (b) => zt("Confirm in the listening wallet…", async () => {
      var X, se, oe;
      const $ = hr(), G = De();
      if ((i == null ? void 0 : i.state) !== "unlocked" || !$) throw new Error("Unlock your player first.");
      if ((G == null ? void 0 : G.state) !== "claimed" || G.inscription === void 0) throw new Error("There is no record to send yet.");
      if (G.holds === !1) throw new Error("This record has already been sent.");
      if (G.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (E($)) throw new Error("Your record is already on its way.");
      const te = b.trim();
      if (!Rr(te)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (te === $) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Me("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || u || w || Q().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await nr();
      const { balance: l, nonce: p } = await e.chain.account($);
      if (l < bc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const f = await (await kn()).request("listening.signSendRecord", { inscription: G.inscription, recipient: te, fee: bc.toString(), nonce: p.toString(), balance: l.toString() }), T = So(f.raw);
      if (f.from !== $ || f.recipient !== te || f.inscription !== G.inscription || ((se = (X = T.payload) == null ? void 0 : X.functionName) == null ? void 0 : se.content) !== "transfer" || Ir((oe = T.payload.functionArgs) == null ? void 0 : oe[2]).value !== te)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(f.raw, f.txid), e.store.set(ie($), JSON.stringify({ txid: f.txid, at: e.now() })), a = -1 / 0, A && (A = { ...A, at: -1 / 0 }), nt("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => zt("Locking…", async () => {
      mr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, nt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const $ = String(b ?? "").trim();
      if (!(i != null && i.address)) return nt("", "Unlock the listening wallet first.");
      if (!Rr($)) return nt("", "Enter a standard mainnet address (it starts with SP).");
      if ($ === i.address) return nt("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(Qt(i.address), $), nt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && e.store.set(Qt(i.address), ""), e.changed();
    },
    returnFunds: (b) => zt("Check the return in the listening wallet…", async () => {
      if (!Nn()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (pr()) return Wo(b);
      const $ = Dn();
      if (!$) throw new Error(yt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if ($.kind !== "linked" && Me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await li({ mode: b, to: $.to, linked: $.kind === "linked" }), b === "all" && O(!1), nt(b === "all" ? $.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, kt = [], no = 10, wr = 30 * 6e4;
  let xs = !1;
  const fi = () => h || !!d || u || w, mr = () => {
    kt.length && (kt.length = 0, e.changed());
  };
  async function rr(b) {
    if (!kt.some(($) => $.id === b.id) && !Wt().some(($) => $.id === b.id) && (kt.push({ ...b, at: e.now() }), kt.length > no && kt.shift()), fi() || ee().length) {
      const $ = kt.length;
      v = `Queued ${$ === 1 ? "this song" : $ + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await Ss();
  }
  async function Ss() {
    if (!xs) {
      xs = !0;
      try {
        for (; kt.length; ) {
          for (; kt.length && e.now() - kt[0].at > wr; ) kt.shift();
          if (!kt.length || fi() || await Qr(kt[0]) === "wait") return;
          kt.shift();
        }
      } finally {
        xs = !1, e.changed();
      }
    }
  }
  async function Qr(b) {
    var $;
    h = !0;
    try {
      await Rn();
      const G = An();
      if (G === "loading") return "wait";
      if (G !== "ready" || !z() || !(i != null && i.session) || i.session.playsLeft < 1 || !j) return "done";
      if (ee().length) return "wait";
      L || (await e.chain.verify(), L = !0);
      const te = i.address, { balance: l, nonce: p } = await e.chain.account(te);
      o = l, a = e.now();
      const g = await e.chain.owner(Lu, b.song);
      if (g === te || g === et()) return "done";
      const f = await s.request("listening.signPlay", {
        core: Lu,
        song: b.song,
        receipt: b.id,
        fee: He().toString(),
        nonce: p.toString(),
        balance: l.toString()
      }), T = {
        id: b.id,
        address: te,
        kind: "play",
        core: Lu,
        song: b.song,
        recipient: g,
        amount: "50",
        fee: He().toString(),
        nonce: p.toString(),
        created: e.now(),
        status: "signed",
        raw: f.raw,
        txid: f.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(T), gt(T);
      const X = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await e.chain.broadcast(f.raw, f.txid), gt({ ...T, status: "pending" }), v = `♪ Paid ${X}`, C = "";
      } catch (se) {
        gt({ ...T, status: lo(se) ? "failed" : "unknown", note: se.message, ...lo(se) ? { raw: void 0 } : {} }), C = se.message;
      }
      return i = await an(s), "done";
    } catch (G) {
      const te = G instanceof Error ? G.message : "payment unavailable";
      return ($ = tn()) != null && $.player ? (v = "Payment is taking a moment: " + te, "wait") : (v = "This song played free: " + te, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function hi(b) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(An()) || Me("like") ? !1 : (_n(b), !0);
  }
  async function _n(b) {
    const $ = b.title ? `“${b.title}”` : `song #${b.song}`, G = (x) => {
      var B;
      C = x, v = "";
      try {
        (B = e.likeFailed) == null || B.call(e, b.song);
      } catch {
      }
      e.changed();
    }, te = Fe(), l = An(), p = et(), g = te && (l === "fund" || l === "over") ? "ready" : l, f = yt() ? Ge() : p;
    if (g === "locked") {
      y = { ...b, at: e.now() }, nt(`Unlock to like ${$}. It sends straight after.`);
      return;
    }
    if (g === "wrong-wallet") return G(jn());
    if (g === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (yt() && Me("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (g === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (g === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (te) {
      await yr(!0);
      const x = Se();
      if (Lt(x))
        return e.changed(), G(fl);
    }
    if (g !== "ready" || !f) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!j) return G("Pay-per-play is running in another tab. Like from that tab.");
    const T = Wt(Ge()).find((x) => x.kind === "like" && x.song === b.song);
    if (T && sa.includes(T.status))
      return G(`Your last like for ${$} is still on its way. It can change again once it confirms.`);
    if (u) return G("One like at a time: your last one is still being sent.");
    if ((T == null ? void 0 : T.status) === "confirmed" && e.now() - (T.confirmedAt ?? 0) < b5)
      return G(`Your like for ${$} has only just confirmed. Try again in a moment.`);
    let X;
    w = !0;
    try {
      X = e.likeState ? (await e.likeState(f, b.song)).by : b.likedBy ?? [];
    } catch {
      X = b.likedBy;
    } finally {
      w = !1;
    }
    if (!X) return G(`Could not check ${$} right now. Try the heart again.`);
    const se = Ge(), Ee = ((T == null ? void 0 : T.status) === "confirmed" && typeof T.liked == "boolean" && e.now() - (T.confirmedAt ?? T.created) < 5 * 6e4 ? T.liked : void 0) ?? X.includes(se);
    if (!Ee && X.some((x) => x !== se)) return G(yt() ? `${$} was liked from another wallet of yours. Unlike it there.` : `${$} was liked from your main wallet${X.includes(p) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await ro({ song: b.song, liked: !Ee, title: b.title, artist: b.artist });
  }
  async function ro(b) {
    var te, l, p;
    if (u) {
      nt("Still sending your last like. Try again in a moment.");
      return;
    }
    u = !0;
    const $ = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, G = e.wait ?? ((g) => new Promise((f) => setTimeout(f, g)));
    try {
      nt(`${b.liked ? "Liking" : "Unliking"} ${$}…`);
      const g = e.now() + 12e4;
      for (; h || (Fe() ? Wt(Ge()).some((Ee) => sa.includes(Ee.status)) : ee().length); ) {
        if (e.now() > g) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await Rn(!0);
      }
      if (!Fe() && An() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const f = Ge(), { balance: T, nonce: X } = await e.chain.account(f);
      if (Fe() ? c = { for: f, value: T, at: e.now() } : (o = T, a = e.now()), Lt(T)) throw new Error(fl);
      const se = await s.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: $u.toString(),
        nonce: X.toString(),
        balance: T.toString()
      }), oe = {
        id: Cu(),
        address: f,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: $u.toString(),
        nonce: X.toString(),
        created: e.now(),
        status: "signed",
        raw: se.raw,
        txid: se.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(oe), gt(oe);
      try {
        await e.chain.broadcast(se.raw, se.txid), gt({ ...oe, status: "pending" }), v = `${b.liked ? "♥ Liked" : "Unliked"} ${$}`, C = "";
        try {
          (te = e.likeSent) == null || te.call(e, b.song, b.liked);
        } catch {
        }
      } catch (Ee) {
        if (gt({ ...oe, status: lo(Ee) ? "failed" : "unknown", note: Ee.message, ...lo(Ee) ? { raw: void 0 } : {} }), C = Ee.message, lo(Ee)) try {
          (l = e.likeFailed) == null || l.call(e, b.song);
        } catch {
        }
      }
      i = await an(s);
    } catch (g) {
      C = "Like not sent: " + (g instanceof Error ? g.message : "the listening wallet is unavailable");
      try {
        (p = e.likeFailed) == null || p.call(e, b.song);
      } catch {
      }
    } finally {
      u = !1, e.changed(), Ss();
    }
  }
  return { snapshot: Fn, refresh: Rn, onListened: rr, heart: hi, toggleLike: _n, ...Jr };
}
const ob = ["Connect", "Passkey", "Link & fund", "Listen"], ab = ["Passkey", "Add 1 STX", "Listen"], Gd = (e) => e ? ab : ob;
function S5(e) {
  if (e.solo) return v5(e);
  const t = ob.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function v5(e) {
  const t = ab.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function E5(e, t) {
  return !t || t.at >= Gd(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const A5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function k5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !A5(r.id)));
}
const $5 = {}, I5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, L5 = (e) => {
  const t = $5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, C5 = (e) => `/hiro/${e}`, T5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, B5 = (e) => {
  const t = L5(e);
  if (t)
    return [T5(t)];
  const n = I5[e];
  return typeof window < "u" ? [`${window.location.origin}${C5(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, M5 = {}, ng = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, N5 = "xtrata.log.enabled", _5 = "xtrata.log.level", P5 = "xtrata.log.tags", U5 = "xtrata.log.dedupe", xc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, H5 = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, O5 = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, D5 = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, F5 = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, j5 = () => {
  const e = M5 ?? {}, t = xc(N5) ?? e.VITE_LOG_ENABLED, n = xc(_5) ?? e.VITE_LOG_LEVEL, r = xc(P5) ?? e.VITE_LOG_TAGS, s = xc(U5) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: H5(t),
    level: O5(n) ?? "warn",
    tags: F5(r),
    dedupe: D5(s)
  };
}, R5 = (e, t, n) => !e.enabled || ng[n] < ng[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), z5 = (e, t, n, r) => {
  const s = j5();
  if (!R5(s, t, e) || K5(s.dedupe))
    return;
  const i = `[xtrata:${t}] ${n}`, o = console[e] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, G5 = /* @__PURE__ */ new Set();
let rg = null;
const K5 = (e, t, n, r, s) => (rg !== e && (G5.clear(), rg = e), !1), V5 = (e, t, n) => z5("debug", e, t, n), Y5 = {}, X5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, q5 = (e) => {
  const t = Y5, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : X5[e];
}, W5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Z5 = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return W5.test(n) ? n : null;
}, J5 = (e) => e.replace(/\/+$/, ""), Q5 = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), sg = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.startsWith("0x") ? e.slice(2) : e;
  if (!t || t.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(t))
    return null;
  let n = "";
  for (let r = 0; r < t.length; r += 2) {
    const s = Number.parseInt(t.slice(r, r + 2), 16);
    if (s < 32 || s > 126)
      return null;
    n += String.fromCharCode(s);
  }
  return n;
}, uo = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, eI = (e) => {
  var c, d;
  let t;
  try {
    t = Ir(J$(e));
  } catch {
    return null;
  }
  const n = uo(t);
  if (!n || n.success === !1)
    return null;
  const r = uo(n.value), s = uo(r == null ? void 0 : r.value), i = uo(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = sg((c = uo(i.name)) == null ? void 0 : c.value), a = sg((d = uo(i.namespace)) == null ? void 0 : d.value);
  return !o || !a ? null : Z5(`${o}.${a}`);
}, tI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${J5(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [Fm(Em(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : eI(i.result);
}, nI = async (e) => {
  const t = e.address.trim();
  if (!Eo(t))
    return null;
  const n = q5(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of B5(e.network))
    try {
      return await tI({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (i) {
      r = i;
    }
  return V5("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: Q5(r)
  }), null;
};
function rI(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((d) => {
      c.pending = !1, d && (c.name = d, t());
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
const ig = Object.freeze({
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
}), og = Object.freeze({ 139: "melophonic" });
function ag(e, t = "") {
  const n = String(e);
  return Object.hasOwn(ig, n) ? ig[n] : Object.hasOwn(og, n) ? og[n] : t;
}
const cg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function lg(e, t = "") {
  return Object.hasOwn(cg, String(e)) ? cg[String(e)] : t;
}
const cb = 10000n, ah = 1000000n, hl = 3000n, sI = (e, t) => `${e}#gift=${t}`, iI = 100, ia = (e, t = Nr) => e <= Kt ? 0 : Number((e - Kt) / Sn(t)), ug = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), ch = "xtrata.xyz/radio/gifts", Sc = iI, oI = "Create a prefunded Xtrata radio gift batch", aI = (e) => ({
  domain: er({ name: ut(ch), version: ut("1"), "chain-id": on(1) }),
  message: er({
    purpose: ut(oI),
    creator: ut(e.creator),
    count: on(e.count),
    amount: on(BigInt(e.amount)),
    label: ut(e.label),
    issued: on(e.issued),
    ...e.player ? { player: ut(e.player) } : {}
  })
}), cI = (e, t, n = Nr) => Kt + BigInt(e) * Sn(n) + (t ? Kl : 0n), lI = (e, t = Nr) => Number((ah - Kt - (e ? Kl : 0n)) / Sn(t)), uI = (e, t) => BigInt(e) * (t + hl);
function dI(e, t, n, r = Nr) {
  const s = n ? Kl : 0n, i = t > Kt + s ? t - Kt - s : 0n, o = Number(i / Sn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * ll,
    fees: BigInt(o) * r,
    reserve: Kt,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: hl,
    perCopy: t + hl,
    total: uI(e, t)
  };
}
const fI = (e) => e >= cb && e <= ah, hI = 90, dg = [30, 90], pI = "Extend my prefunded Xtrata radio gift batches; no spending permission", gI = (e) => ({
  domain: er({ name: ut(ch), version: ut("1"), "chain-id": on(1) }),
  message: er({ purpose: ut(pI), creator: ut(e.creator), batch: ut(e.batch), days: on(e.days), issued: on(e.issued) })
}), fg = 40, yI = "Create an Xtrata radio gift player", Kd = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), wI = /^[^\u0000-\u001f\u007f<>]+$/u;
function hg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && wI.test(e) : !n;
}
function lb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!hg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!hg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > fg) throw new Error(`A player holds 1 to ${fg} songs.`);
  const t = /* @__PURE__ */ new Set();
  for (const s of e.tracks) {
    if (!Number.isSafeInteger(s) || s < 1) throw new Error("Songs are catalogue token numbers.");
    if (t.has(s)) throw new Error("A song appears twice in the list.");
    t.add(s);
  }
  if (e.cover !== null && e.cover !== void 0 && (!Number.isSafeInteger(e.cover) || e.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = e.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const s of n) if (!t.has(s)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((s, i) => s - i);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const ub = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return uf(hf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, mI = (e) => ({
  domain: er({ name: ut(ch), version: ut("1"), "chain-id": on(1) }),
  message: er({
    purpose: ut(yI),
    admin: ut(e.admin),
    player: ut(e.hash),
    issued: on(e.issued)
  })
}), Tr = (e) => e.tracks.filter((t) => !t.hidden), bI = (e) => e.tracks.find((t) => t.hidden) ?? null, Tu = [300, 500, 1e3], pg = 1800, Bu = /* @__PURE__ */ new Map();
async function xI(e) {
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
function SI(e, t, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = e, (() => {
    const a = Bu.get(e), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : t, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Bu.set(e, { ...a, until: Date.now() + pg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Bu.delete(e), s();
      }, pg + 50);
    }
  }, i;
}
const lr = (e, t, n, r, s) => SI(e, t, async () => await xI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), pi = "xtrata.radio.gift.incoming.v1", gg = (e) => "xtrata.radio.gift.mine.v1:" + e, yg = (e) => "xtrata.radio.gift.batches.v1:" + e, xe = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, nn = (e, t, n = "") => {
  const r = xe("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, oa = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, ir = (e) => kr(e).replace(/\.?0+$/, "");
function vI(e) {
  let t = null;
  const n = (A) => [5e3, 1e4, 2e4, 3e4][A] ?? 6e4, r = (() => {
    try {
      const A = new URL(location.href), D = new URLSearchParams(A.hash.slice(1)).get("gift") ?? A.searchParams.get("gift");
      return D !== null && (A.searchParams.delete("gift"), history.replaceState(null, "", A.pathname + (A.search || ""))), ug(D) ? D : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const A = JSON.parse(e.store.get(pi) || "null");
      return ug(A == null ? void 0 : A.code) ? A.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    t = { code: i }, e.store.set(pi, JSON.stringify({ code: i, at: e.now() }));
    let A = 0;
    const D = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (K) => {
      const V = await K.json().catch(() => ({}));
      if (K.status === 404) {
        e.store.set(pi, null), t = { ...t, error: (V == null ? void 0 : V.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!K.ok) throw new Error("busy");
      const ie = V;
      t = { ...t, view: ie, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ie.status) && e.store.set(pi, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void D(), n(A++)));
    });
    D();
  }
  const o = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const A = t == null ? void 0 : t.view;
    return !(A != null && A.player) || !o() ? null : { player: A.player, from: u(A), plays: ia(BigInt(A.amount)) };
  }, c = () => {
    const A = t == null ? void 0 : t.view;
    return !A || A.player || !o() ? null : { plays: ia(BigInt(A.amount)), from: A.from ? e.who(A.from) : null };
  }, d = () => {
    const A = t == null ? void 0 : t.code;
    if (!A) return [];
    const D = `${location.origin}${location.pathname}#gift=${A}`;
    return [lr("gift-pass-on", "Copy the link to pass on", () => D, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(pi, null), e.changed();
  }, u = (A) => A.from ? e.who(A.from) : A.label ? `Xtrata Radio · ${A.label}` : "Xtrata Radio";
  let w = {};
  const y = (A) => {
    if (w.box) return w.box;
    const D = xe("div", "", "ppp-gift-check");
    w.box = D;
    const K = () => {
      const V = window.turnstile;
      !V || w.rendered || (w.rendered = !0, V.render(D, { sitekey: A, callback: (ie) => {
        w.token = ie, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) K();
    else {
      const V = document.createElement("script");
      V.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", V.async = !0, V.onload = K, document.head.append(V);
    }
    return D;
  }, S = (A) => {
    queueMicrotask(() => void A());
  };
  let v;
  async function C(A) {
    var V, ie, E, re, Ie, De, pt, je, wt;
    if (!t || t.claiming || !A.listening) return;
    const D = !!((V = t.view) != null && V.player);
    if (D && !A.root) return;
    t.claiming = !0, t.error = void 0, (ie = e.claiming) == null || ie.call(e, !0), e.changed();
    const K = async (tt) => {
      const We = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...tt })
      });
      return { res: We, r: await We.json().catch(() => ({})) };
    };
    try {
      let tt = 0, We = A.listening, Rt;
      if (D) {
        const Xt = Number((E = await e.json("/radio/gift/slots?root=" + encodeURIComponent(A.root))) == null ? void 0 : E.next);
        if (!Number.isSafeInteger(Xt) || Xt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        tt = Xt;
        for (let pr = 0; ; pr++) {
          const gr = await e.album.bind(tt);
          if (We = gr.address, Rt = await K({ wallet: We, binding: gr }), Rt.res.status === 409 && /just taken/.test(((re = Rt.r) == null ? void 0 : re.error) || "") && pr < 5) {
            tt += 1;
            continue;
          }
          break;
        }
      } else Rt = await K({ wallet: We });
      const { res: Ce, r: mt } = Rt;
      if (Ce.status === 503 && /sending another gift/.test((mt == null ? void 0 : mt.error) || "")) {
        t.waiting = !0, (Ie = e.claiming) == null || Ie.call(e, !0), clearTimeout(v), v = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Ce.ok) {
        const Xt = String((mt == null ? void 0 : mt.error) || "");
        if (Ce.status === 404 || Ce.status === 410 || Ce.status === 409 && /already had a gift|brand-new|already have this album/.test(Xt))
          throw e.store.set(pi, null), new Error(Xt || "This gift cannot be opened.");
        if (Ce.status === 429 || Ce.status === 403 || Ce.status === 400 && !/wallet number/i.test(Xt)) throw new Error(Xt || `Could not open the gift (${Ce.status}).`);
        const gr = /topping up/.test(Xt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(Xt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(Xt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(gr), { retry: !0, slow: /topping up|not paid for yet/.test(Xt) });
      }
      t.done = !0, e.store.set(pi, null), D ? await e.album.arrived(tt, We, mt.txid, BigInt(mt.amount)) : e.giftSent(mt.txid, BigInt(mt.amount));
    } catch (tt) {
      const We = tt, Rt = We.name === "TypeError" || We.name === "AbortError" || We.name === "TimeoutError" || /wallet number/i.test(We.message);
      if (We.retry || Rt) {
        const Ce = t.tries ?? 0;
        t.tries = Ce + 1, t.retry = { text: We.retry ? We.message : "Still sending your gift… the network is slow, trying again." }, (De = e.claiming) == null || De.call(e, !0), clearTimeout(v), v = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, We.slow ? 6e4 : n(Ce));
      } else
        t.error = We.message, (pt = e.claiming) == null || pt.call(e, !1);
      w.token = void 0;
      try {
        (wt = (je = window.turnstile) == null ? void 0 : je.reset) == null || wt.call(je, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let P = null;
  function H(A) {
    if (!A.listening || !A.depositPending || A.step !== "fund")
      return P = null, [];
    if (!P || P.wallet !== A.listening || e.now() - P.at > 3e4) {
      const K = A.listening;
      P = { ...(P == null ? void 0 : P.wallet) === K ? P : {}, wallet: K, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(K)).then((V) => {
        var ie, E;
        (P == null ? void 0 : P.wallet) === K && (P.state = (ie = V == null ? void 0 : V.gift) == null ? void 0 : ie.state, P.problem = ((E = V == null ? void 0 : V.gift) == null ? void 0 : E.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(P.state === "sending" && P.problem)) return [];
    const D = xe("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return D.title = `Network reply: ${P.problem}`, [D];
  }
  function k(A, D, K = !1) {
    var De, pt;
    const V = D.player, ie = BigInt(D.amount), E = K ? [] : [xe("p", `🎁 ${u(D)} sent you “${V.title}”${V.subtitle ? ` by ${V.subtitle}` : ""}: ${Tr(V).length} ${Tr(V).length === 1 ? "song" : "songs"} and ${ia(ie).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!A.root && ["fund", "ready", "over", "link"].includes(A.step))) {
      if (K) return E;
      if (E.push(xe("p", A.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : A.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), A.step === "intro") {
        const je = document.createElement("details");
        je.className = "ppp-how";
        const wt = document.createElement("summary");
        wt.textContent = "How does this work?", je.append(wt, xe("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), E.push(je);
      }
      return E;
    }
    if (A.walletCannotAlbums)
      return E.push(xe("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), E;
    const Ie = (pt = (De = A.gate) == null ? void 0 : De.gifts) == null ? void 0 : pt.turnstileSiteKey;
    return Ie && !w.token ? E.push(xe("p", "One quick check and it is yours:", "ppp-mute"), y(Ie)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => C(A)), E.push(...M(A, "Sending your album…")), E;
  }
  function M(A, D) {
    const K = [];
    return t.claiming || t.waiting ? K.push(xe("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : D, "ppp-cyan")) : t.retry && K.push(xe("p", t.retry.text, "ppp-warn"), nn("Try now", () => {
      clearTimeout(v), t.retry = void 0, C(A);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? K.push(xe("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...d(), nn("Forget this gift link here", h, "quiet")) : t.error && K.push(xe("p", t.error, "ppp-bad"), nn("Try again", () => {
      t.error = void 0, C(A);
    })), K;
  }
  const U = (A) => {
    var D;
    return !!t && !t.done && !t.error && o() && !!A.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !A.linked && !A.creditedTo && (A.createdHere || A.brandNew || !!((D = t.view) != null && D.player)) && (A.balance ?? 0n) === 0n && !A.entries.length);
  };
  function Y(A, D = {}) {
    var We, Rt, Ce, mt;
    const K = H(A);
    if (!t || ["off", "elsewhere"].includes(A.step)) return K;
    const V = t.view;
    if (t.error && !V) return [xe("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!V) return [xe("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return K;
    if (V.status === "claimed" || V.status === "claiming") return [xe("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(V.status)) return [xe("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (V.status === "pending-deposit") return [xe("p", `🎁 ${u(V)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (V.player) return [...k(A, V, !!D.bare), ...K];
    const ie = !!A.listening && (!(A.createdHere || A.brandNew) || !!A.linked || !!A.creditedTo || (A.balance ?? 0n) > 0n || A.entries.length > 0), E = ie ? ((We = e.claimNew) == null ? void 0 : We.call(e, A)) ?? null : null, re = E ? ((Rt = e.replaceOld) == null ? void 0 : Rt.call(e, A)) ?? null : null;
    if (E && re)
      return [
        xe("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        nn("Replace my old player", re, "primary"),
        nn("Keep both players", E, "quiet"),
        nn("Not now", h, "quiet")
      ];
    if (E)
      return [
        xe("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        nn("Claim it as a new player", E, "primary"),
        nn("Not now", h, "quiet")
      ];
    if (ie)
      return [xe("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), nn("Forget this gift link here", h, "quiet")];
    const Ie = BigInt(V.amount), De = ia(Ie).toLocaleString(), pt = xe(
      "p",
      `🎁 ${u(V)} sent you ${ir(Ie)} STX of on-chain music: about ${De} paid plays.`,
      "ppp-gift"
    ), je = D.bare ? [] : [pt], wt = !!A.listening && (A.createdHere || A.brandNew) && !A.linked && !A.creditedTo && A.step === "fund" && (A.balance ?? 1n) === 0n && !A.depositPending && !A.entries.length, tt = (mt = (Ce = A.gate) == null ? void 0 : Ce.gifts) == null ? void 0 : mt.turnstileSiteKey;
    return wt ? (tt && !w.token ? je.push(xe("p", "One quick check and it is yours:", "ppp-mute"), y(tt)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => C(A)), je.push(...M(A, "Sending your gift…"))) : A.step === "intro" ? D.bare || je.push(xe("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : A.listening && A.linked ? je.push(xe("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), nn("Forget this gift link here", h, "quiet")) : A.listening && (A.balance ?? 0n) > 0n && je.push(xe("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), nn("Forget this gift link here", h, "quiet")), je;
  }
  async function le(A, D, K) {
    var V;
    try {
      const ie = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(A));
      if ((V = ie == null ? void 0 : ie.gift) != null && V.returnTo) return { ok: !0, funder: ie.gift.returnTo, txId: ie.gift.txid ?? void 0, amount: ie.gift.amount, distinct: 1 };
    } catch {
      if (K) return { ok: !1 };
    }
    return D();
  }
  const ne = xe("div", "", "ppp-gift-fold");
  let q = 250000n, m = "", I = "";
  const N = (A) => {
    try {
      const D = JSON.parse(e.store.get(gg(A)) || "[]");
      return Array.isArray(D) ? D : [];
    } catch {
      return [];
    }
  }, _ = (A, D) => e.store.set(gg(A), JSON.stringify(D.slice(0, 50)));
  async function W(A) {
    const D = N(A);
    for (const K of D)
      if (!(K.view && ["claimed", "refunded", "expired"].includes(K.view.status)))
        try {
          K.view = !K.view || K.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: K.id, ...K.txid ? { txid: K.txid } : {} }) }) : await e.json("/radio/gift?id=" + K.id), K.error = void 0;
        } catch (V) {
          K.error = V.message;
        }
    _(A, D), e.changed();
  }
  async function R(A) {
    if (m) return;
    m = "Starting your gift…", I = "", e.changed();
    let D = null;
    try {
      D = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: A, amount: q.toString() }) });
      const K = N(A);
      K.unshift({ id: D.id, code: D.code, amount: q.toString(), at: e.now() }), _(A, K), m = "Approve the gift in your wallet…", e.changed();
      const V = await e.pay(A, D.depositTo, BigInt(D.deposit), D.memo), ie = N(A), E = ie.find((re) => re.id === D.id);
      E && (E.txid = V, E.view = { status: "pending-deposit", amount: q.toString(), source: "friend", from: A, label: "", expires: 0 }), _(A, ie), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(A);
    } catch (K) {
      I = K.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const ue = (A) => "xtrata.radio.gift.players.v1:" + A, de = (A) => {
    try {
      const D = JSON.parse(e.store.get(ue(A)) || "[]");
      return Array.isArray(D) ? D.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id)) : [];
    } catch {
      return [];
    }
  };
  async function Oe(A, D) {
    var K;
    if (!m) {
      m = "Checking the player…", I = "", e.changed();
      try {
        const V = D.tracks.split(/[\s,]+/).filter(Boolean).map((je) => Number(je.replace(/^#/, ""))), ie = (D.explicit ?? "").split(/[\s,]+/).map((je) => je.replace(/^#/, "")).filter(Boolean).map(Number), E = lb({ title: D.title.trim(), subtitle: D.subtitle.trim(), tracks: V, cover: (K = D.cover) != null && K.trim() ? Number(D.cover.trim().replace(/^#/, "")) : null, ...ie.length ? { explicit: ie } : {} });
        m = "Sign in your wallet…", e.changed();
        const re = { admin: A, hash: ub(E), issued: e.now() }, Ie = await e.sign(A, mI(re));
        m = "Making the player…", e.changed();
        const De = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: E, request: re, signature: Ie }) }), pt = de(A).filter((je) => je.id !== De.id);
        pt.unshift({ id: De.id, title: De.title, tracks: De.tracks }), e.store.set(ue(A), JSON.stringify(pt.slice(0, 30))), I = `${De.existing ? "That player already exists" : "Player made"} ✓ “${De.title}” · ${De.tracks} songs. Pick it below for a batch.`;
      } catch (V) {
        I = V.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const L = (A, D) => sI(A || location.origin + "/radio.html", D), j = (A) => {
    try {
      const D = JSON.parse(e.store.get(yg(A)) || "[]");
      return Array.isArray(D) ? D.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id) && Array.isArray(K.codes)) : [];
    } catch {
      return [];
    }
  }, fe = (A, D) => e.store.set(yg(A), JSON.stringify(D.slice(0, 20))), ye = (A) => !!A.view && A.view.status === "live" && A.view.copies.waiting + A.view.copies.claiming + A.view.copies.refunding === 0, Le = (A, D) => e.json(A, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(D) });
  let Be = 0;
  async function Ct(A) {
    const D = j(A);
    for (const K of D)
      if (!ye(K))
        try {
          K.view = !K.view || K.view.status === "pending-deposit" ? await Le("/radio/gift/batch/confirm", { id: K.id, ...K.txid ? { txid: K.txid } : {} }) : await e.json("/radio/gift/batch?id=" + K.id), K.error = void 0;
        } catch (V) {
          K.error = V.message;
        }
    try {
      const K = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(A));
      for (const V of (K == null ? void 0 : K.batches) ?? []) {
        const ie = D.find((E) => E.id === V.id);
        if (ie) {
          ie.error || (ie.view = V);
          continue;
        }
        D.push({ id: V.id, codes: [], count: V.count, amount: V.amount, label: V.label, player: V.player, depositTo: "", deposit: V.deposit, memo: V.memo, at: 0, view: V });
      }
    } catch {
    }
    fe(A, D), e.changed();
  }
  async function He(A, D) {
    const K = j(A).find((V) => V.id === D);
    if (!(!K || !K.depositTo || m)) {
      m = "Approve the payment in your wallet…", I = "", e.changed();
      try {
        const V = await e.pay(A, K.depositTo, BigInt(K.deposit), K.memo), ie = j(A), E = ie.find((re) => re.id === D);
        E && (E.txid = V), fe(A, ie), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", Ct(A);
      } catch (V) {
        I = `${/cancel/i.test(V.message) ? "Payment cancelled." : V.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function Me(A, D, K, V) {
    if (m) return;
    if (!D.ok) {
      I = D.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", I = "", e.changed();
    let ie = null;
    try {
      const E = { creator: A, count: D.count, amount: D.amount.toString(), label: K, issued: e.now(), ...V ? { player: V } : {} }, re = await e.sign(A, aI(E));
      m = "Making your links…", e.changed(), ie = await Le("/radio/gift/batch", { request: E, signature: re });
      const Ie = j(A);
      Ie.unshift({ id: ie.id, codes: ie.codes, count: D.count, amount: ie.amount, label: K, player: V ?? null, depositTo: ie.depositTo, deposit: ie.deposit, memo: ie.memo, at: e.now() }), fe(A, Ie);
    } catch (E) {
      I = E.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await He(A, ie.id);
  }
  async function Ne(A, D, K) {
    if (!m) {
      m = "Sign in your wallet (nothing is spent)…", I = "", e.changed();
      try {
        const V = { creator: A, batch: D, days: K, issued: e.now() }, ie = await e.sign(A, gI(V));
        m = "Extending…", e.changed();
        const E = await Le("/radio/gift/batch/extend", { request: V, signature: ie }), re = j(A);
        for (const Ie of (E == null ? void 0 : E.batches) ?? []) {
          const De = re.find((pt) => pt.id === Ie.id);
          De && (De.view = Ie, De.error = void 0);
        }
        fe(A, re), I = E != null && E.extended ? `Extended ✓ ${E.extended === 1 ? "That batch has" : `${E.extended} batches have`} ${K} more days.` : "There was nothing live to extend.";
      } catch (V) {
        I = /cancel/i.test(V.message || "") ? "Cancelled. Nothing changed." : V.message || "Not extended.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const qt = (A) => Math.max(0, Math.ceil((A - e.now()) / 864e5));
  function jt(A, D) {
    const K = D.filter((E) => {
      var re;
      return ((re = E.view) == null ? void 0 : re.status) === "live" && E.view.copies.waiting > 0;
    });
    if (!K.length) return null;
    const V = Math.min(...K.map((E) => E.view.expires)), ie = xe("p", "", "ppp-batch-extend");
    ie.append(xe("span", `${K.length} live ${K.length === 1 ? "batch" : "batches"} · the first runs out in ${qt(V)} days. Extend ${K.length === 1 ? "it" : "them all"}: `));
    for (const E of dg) {
      const re = nn(`+${E} days`, () => void Ne(A, "all", E), "tiny");
      re.disabled = !!m, ie.append(re);
    }
    return ie;
  }
  const et = () => Wt(!!Fe.value, Se.value, Lt.value);
  function Wt(A, D, K) {
    const V = D === "max" ? lI(A) : Number(D), ie = cI(V, A), E = Number(K);
    return !Number.isInteger(E) || E < 1 || E > Sc ? { ok: !1, reason: `Make 1 to ${Sc} copies at a time.`, album: A, plays: V, amount: ie, count: E } : fI(ie) ? { ok: !0, reason: "", album: A, plays: V, amount: ie, count: E, bill: dI(E, ie, A) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: A, plays: V, amount: ie, count: E };
  }
  const gt = () => {
    var A;
    return ((A = e.batchDays) == null ? void 0 : A.call(e)) ?? hI;
  }, z = (A = et()) => {
    if (!A.ok) return A.reason;
    const D = A.bill;
    return `Each copy: ${A.plays.toLocaleString()} paid plays (${ir(D.holders)} to song holders, ${ir(D.fees)} network fees)${A.album ? `, ${ir(D.float)} for the album’s likes` : ""}, ${ir(D.reserve)} kept so a listener can return what is left, + ${ir(D.sendFee)} to send it = ${ir(D.perCopy)} STX. ${A.count} copies = ${ir(D.total)} STX, paid now in one payment. Copies nobody claims within ${gt()} days come back to you, and you can extend that at any time.`;
  }, O = (A, D) => D.codes.map((K) => L(A, K)), ee = xe("input");
  ee.type = "range", ee.min = String(cb), ee.max = String(ah), ee.step = "10000", ee.value = String(q), ee.setAttribute("aria-label", "Gift amount");
  const Q = xe("p", "", "ppp-gift-amount"), he = nn("", () => {
    const A = e.main();
    A && R(A);
  }, "primary"), lt = () => {
    Q.textContent = $e(), he.textContent = `Gift ${ir(q)} STX`;
  };
  ee.oninput = () => {
    q = BigInt(ee.value), lt();
  };
  const $e = () => `${ir(q)} STX · about ${ia(q).toLocaleString()} paid plays · you pay ${ir(q + hl)} STX with the network fee`;
  lt();
  const Pe = xe("input");
  Pe.maxLength = 60, Pe.placeholder = "Title, e.g. Proof of Sound", Pe.setAttribute("aria-label", "Player title");
  const ft = xe("input");
  ft.maxLength = 80, ft.placeholder = "Artist (optional)", ft.setAttribute("aria-label", "Player subtitle");
  const _e = xe("textarea");
  _e.rows = 3, _e.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", _e.setAttribute("aria-label", "Songs");
  const ve = xe("input");
  ve.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", ve.setAttribute("aria-label", "Explicit songs");
  const Ge = xe("input");
  Ge.inputMode = "numeric", Ge.placeholder = "Cover inscription number (optional), shown when the album loads", Ge.setAttribute("aria-label", "Cover inscription");
  const Fe = xe("select");
  Fe.setAttribute("aria-label", "Batch album");
  const Se = xe("select");
  Se.setAttribute("aria-label", "Plays per copy");
  for (const A of [.../* @__PURE__ */ new Set([50, 100, 250, ...Tu])].sort((D, K) => D - K)) Se.append(oa(`${A.toLocaleString()} plays`, String(A)));
  Se.append(oa("Max (1 STX)", "max")), Se.value = String(Tu[0]);
  const Lt = xe("input");
  Lt.type = "number", Lt.min = "1", Lt.max = String(Sc), Lt.value = "10", Lt.setAttribute("aria-label", "Copies");
  const pn = xe("input");
  pn.maxLength = 40, pn.placeholder = "Label, e.g. Opera launch", pn.setAttribute("aria-label", "Batch label");
  const En = xe("p", "", "ppp-mute"), yt = () => {
    En.textContent = z();
  };
  for (const A of [Fe, Se, Lt])
    A.oninput = yt, A.onchange = yt;
  yt();
  function gn(A, D, K) {
    const V = D.view, ie = V == null ? void 0 : V.copies, E = D.error ? D.error : !V || V.status === "pending-deposit" ? D.txid ? "payment confirming…" : "waiting for your payment" : `${ie.claimed} of ${V.count} claimed${ie.refunding + ie.refunded ? ` · ${ie.refunded} refunded${ie.refunding ? `, ${ie.refunding} on their way` : ""}` : ""}`, re = xe("li");
    if (re.append(xe("span", `${D.label || "Batch"} · ${D.count} × ${ir(BigInt(D.amount))} STX`, "t"), xe("span", E, "ppp-mute")), !D.txid && D.depositTo && (!V || V.status === "pending-deposit") && re.append(nn("Pay now", () => void He(A, D.id), "tiny")), (V == null ? void 0 : V.status) === "live" && ie.waiting > 0) {
      re.append(xe("span", `${qt(V.expires)} days left`, "ppp-mute"));
      for (const Ie of dg) {
        const De = nn(`+${Ie}`, () => void Ne(A, D.id, Ie), "tiny");
        De.title = `Extend this batch by ${Ie} days (a signature, no payment)`, De.setAttribute("aria-label", `Extend ${D.label || "this batch"} by ${Ie} days`), De.disabled = !!m, re.append(De);
      }
    }
    if (D.codes.length && (V == null ? void 0 : V.status) === "live") {
      const Ie = O(K, D);
      re.append(
        lr("batch-copy:" + D.id, "Copy all links", () => Ie.join(`
`), "tiny", e.changed),
        lr("batch-csv:" + D.id, "Copy as CSV", () => ["copy,link", ...Ie.map((De, pt) => `${pt + 1},${De}`)].join(`
`), "tiny", e.changed)
      );
    } else D.codes.length || re.append(xe("span", "links were made on another device", "ppp-mute"));
    return re;
  }
  const Qt = xe("select");
  Qt.setAttribute("aria-label", "Plays in each copy");
  for (const A of [.../* @__PURE__ */ new Set([50, 100, 250, ...Tu])].sort((D, K) => D - K)) Qt.append(oa(`${A.toLocaleString()} plays`, String(A)));
  Qt.value = "50";
  const en = xe("input");
  en.type = "number", en.min = "1", en.max = String(Sc), en.value = "10", en.setAttribute("aria-label", "How many copies");
  const Bn = xe("input");
  Bn.maxLength = 40, Bn.placeholder = "A note recipients see, e.g. Launch week (optional)", Bn.setAttribute("aria-label", "Note for recipients");
  const Dn = xe("p", "", "ppp-mute");
  function tr(A, D, K) {
    const V = () => Wt(!0, Qt.value, en.value), ie = () => {
      Dn.textContent = z(V());
    };
    for (const wt of [Qt, en])
      wt.oninput = ie, wt.onchange = ie;
    ie();
    const E = () => (Bn.value.trim() || D.title).replace(/[^ -~]/g, "").slice(0, 40), re = nn("Sign, pay and make links", () => {
      Me(A, V(), E(), D.id);
    }, "primary");
    re.disabled = !!m;
    const Ie = (wt, tt) => {
      const We = xe("label", wt);
      return We.append(tt), We;
    }, De = [
      xe("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      Ie("Plays in each ", Qt),
      Ie("Copies ", en),
      Bn,
      Dn,
      re
    ];
    e.now() - Be > 3e4 && (Be = e.now(), Ct(A));
    const pt = j(A).filter((wt) => wt.player === D.id);
    if (pt.length) {
      const wt = xe("ul", "", "ppp-gift-list");
      for (const tt of pt.slice(0, 10)) wt.append(gn(A, tt, K));
      De.push(wt);
    }
    const je = jt(A, j(A));
    return je && De.push(je), m && De.push(xe("p", m, "ppp-cyan")), I && De.push(xe("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), De;
  }
  function tn(A) {
    var ie, E;
    const D = (ie = A.gate) == null ? void 0 : ie.gifts;
    if (!(D != null && D.enabled) || !D.admin || ["off", "elsewhere", "unsupported"].includes(A.step)) return null;
    const K = e.main(), V = [xe("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!K)
      V.push(xe("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (D.admin) {
      const re = xe("div", "", "ppp-gift-admin"), Ie = (tt, We) => {
        const Rt = xe("label", tt);
        return Rt.append(We), Rt;
      }, De = de(K);
      re.append(
        xe("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Pe,
        ft,
        _e,
        Ge,
        ve,
        nn("Sign and make player", () => void Oe(K, { title: Pe.value, subtitle: ft.value, tracks: _e.value, cover: Ge.value, explicit: ve.value }))
      );
      const pt = nn("Sign, pay and make links", () => {
        Me(K, et(), pn.value.trim(), Fe.value || void 0);
      });
      pt.disabled = !!m;
      const je = Fe.value;
      Fe.replaceChildren(oa("No album (starter copies)", ""), ...De.map((tt) => oa(`${tt.title} · ${tt.tracks} songs`, tt.id))), De.some((tt) => tt.id === je) && (Fe.value = je), yt(), re.append(
        xe("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${gt()} days unless you extend`, "ppp-cyan"),
        Ie("Album ", Fe),
        Ie("Plays each ", Se),
        Ie("Copies ", Lt),
        pn,
        En,
        pt
      ), e.now() - Be > 3e4 && (Be = e.now(), Ct(K));
      const wt = j(K);
      if (wt.length) {
        const tt = xe("ul", "", "ppp-gift-list");
        for (const Rt of wt.slice(0, 20)) tt.append(gn(K, Rt, ((E = A.gate) == null ? void 0 : E.radioUrl) ?? null));
        re.append(tt);
        const We = jt(K, wt);
        We && re.append(We);
      }
      V.push(re);
    }
    return m && V.push(xe("p", m, "ppp-cyan")), I && V.push(xe("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), ne.replaceChildren(...V), ne;
  }
  return { banner: Y, funder: le, renderFold: tn, copies: tr, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: U };
}
const EI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function AI(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, s = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    s && t.push({
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
  return t;
}
const kI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function $I(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((i) => (!t.pinnedOnly || t.pins.has(i.slot)) && (() => {
    const o = kI(i);
    return n.every((a) => o.includes(a));
  })()), s = {
    recent: (i, o) => (t.recents[o.slot] ?? 0) - (t.recents[i.slot] ?? 0) || o.slot - i.slot,
    newest: (i, o) => o.slot - i.slot,
    oldest: (i, o) => i.slot - o.slot,
    title: (i, o) => {
      var a, c;
      return (((a = i.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = o.player) == null ? void 0 : c.title) ?? "") || i.slot - o.slot;
    }
  };
  return r.sort((i, o) => Number(t.pins.has(o.slot)) - Number(t.pins.has(i.slot)) || s[t.sort](i, o));
}
function II(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Vd = /* @__PURE__ */ new Set(), lh = (e) => (Vd.add(e), () => {
  Vd.delete(e);
}), pl = () => {
  for (const e of [...Vd])
    try {
      e();
    } catch {
    }
}, wg = "xtrata:al-thumb:v1:", uh = "-", aa = 96, LI = 24 * 1024 * 1024, sn = /* @__PURE__ */ new Map(), mg = /* @__PURE__ */ new Set(), Yd = [];
let Mu = !1, Nu;
const Ta = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(wg + e);
    window.localStorage.setItem(wg + e, t);
  } catch {
  }
  return null;
};
function dh(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return t(e);
      const i = new Image(), o = setTimeout(() => t(e), 8e3);
      i.onload = () => {
        clearTimeout(o);
        try {
          const a = Math.min(i.naturalWidth, i.naturalHeight);
          if (!a) return t(e);
          r.width = r.height = aa, s.fillStyle = "#143a40", s.fillRect(0, 0, aa, aa), s.drawImage(i, (i.naturalWidth - a) / 2, (i.naturalHeight - a) / 2, a, a, 0, 0, aa, aa), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, i.onerror = () => {
        clearTimeout(o), t(e);
      }, i.src = e;
    } catch {
      t(e);
    }
  });
}
async function CI(e) {
  var c, d, h, u, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((d = t.body) == null ? void 0 : d.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((h = t.body) == null ? void 0 : h.cancel()), "";
  let r = "", s = 0;
  const i = (y) => {
    let S = 0;
    for (; ; ) {
      const v = r.slice(S).search(/<img\b/i);
      if (v < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const C = S + v, P = r.indexOf(">", C);
      if (P < 0)
        return r = r.slice(C), null;
      const H = r.slice(C, P + 1), k = H.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (k) return k[1].replace(/&amp;/g, "&");
      const M = H.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (M) return "/inscription/" + M[1];
      S = P + 1;
    }
  }, o = (w = (u = t.body) == null ? void 0 : u.getReader) == null ? void 0 : w.call(u);
  if (!o)
    return r = await t.text(), i(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: y, value: S } = await o.read();
    if (y) break;
    s += S.byteLength, r += a.decode(S, { stream: !0 });
    const v = i(!1);
    if (v)
      return await o.cancel(), v;
    if (s > LI)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function TI() {
  if (!Mu) {
    Mu = !0;
    try {
      for (; Yd.length; ) {
        const e = Yd.shift();
        if (!sn.has(e))
          try {
            const t = await CI(e);
            if (t === null) continue;
            if (!t) {
              sn.set(e, ""), Ta(e, uh), pl();
              continue;
            }
            const n = await dh(t);
            sn.set(e, n), n.startsWith("data:image/jpeg") && Ta(e, n), pl();
          } catch {
          }
      }
    } finally {
      Mu = !1;
    }
  }
}
function fh(e, t) {
  if (t && !sn.get(e) ? (sn.set(e, t), dh(t).then((r) => {
    r !== t && (sn.set(e, r), r.startsWith("data:image/jpeg") && Ta(e, r), pl());
  })) : t === "" && !sn.has(e) && sn.set(e, ""), sn.has(e)) return sn.get(e);
  const n = Ta(e);
  if (n != null) {
    const r = n === uh ? "" : n;
    return sn.set(e, r), r;
  }
  return mg.has(e) || (mg.add(e), Yd.push(e), Nu || (Nu = setTimeout(() => {
    Nu = void 0, TI();
  }, 1200))), "";
}
function bg(e) {
  if (sn.has(e)) return sn.get(e);
  const t = Ta(e);
  if (t == null) return null;
  const n = t === uh ? "" : t;
  return sn.set(e, n), n;
}
const _u = /* @__PURE__ */ new Map(), Pu = /* @__PURE__ */ new Set();
function Hc(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : _u.has(e) ? _u.get(e) : (Pu.has(e) || (Pu.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, i, o;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((i = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : i[1]) ?? "").replace(/&amp;/g, "&") : (await ((o = t.body) == null ? void 0 : o.cancel()), "");
  }).then((t) => {
    _u.set(e, t), pl();
  }).catch(() => {
    Pu.delete(e);
  })), "");
}
const fo = 12, BI = 5e3, bn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, ho = (e, t, n = "") => {
  const r = bn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function MI(e) {
  let t, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", d = !1, h = fo;
  const u = bn("div", "", "ppp-shelf-box");
  lh(() => e.changed());
  const w = (N) => "xtrata.radio.shelf.pins.v1:" + N, y = (N) => "xtrata.radio.shelf.recent.v1:" + N, S = (N, _) => {
    try {
      return JSON.parse(e.store.get(N) || "null") ?? _;
    } catch {
      return _;
    }
  }, v = (N) => new Set(S(w(N), []).filter((_) => Number.isSafeInteger(_))), C = (N) => {
    const _ = S(y(N), {}), W = {};
    for (const [R, ue] of Object.entries(_)) Number.isSafeInteger(Number(R)) && typeof ue == "number" && (W[Number(R)] = ue);
    return W;
  };
  async function P(N) {
    if (!s) {
      s = !0, i = !1;
      try {
        const _ = [];
        let W = 0, R = 0;
        for (let ue = 0; ue < BI / 100 + 1; ue++) {
          const de = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${W}&limit=100`);
          if (_.push(...AI(de == null ? void 0 : de.shelf)), R = Number(de == null ? void 0 : de.total) || _.length, !(de != null && de.next) || !Number.isSafeInteger(de.next)) break;
          W = de.next;
        }
        N === t && (n = _, r = R, o = e.now());
      } catch {
        i = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const H = () => {
    o = -1 / 0;
  }, k = bn("input");
  k.type = "search", k.placeholder = "Search title, artist or #", k.setAttribute("aria-label", "Search your albums"), k.oninput = () => {
    a = k.value, h = fo, e.changed();
  };
  const M = bn("select");
  M.setAttribute("aria-label", "Sort albums");
  for (const N of EI) {
    const _ = document.createElement("option");
    _.value = N.value, _.textContent = N.label, M.append(_);
  }
  M.onchange = () => {
    c = M.value, h = fo, e.changed();
  };
  const U = ho("", () => {
    d = !d, h = fo, e.changed();
  }, "tiny"), Y = bn("div", "", "ppp-shelf-tools");
  Y.append(k, M, U);
  const le = bn("div"), ne = bn("div");
  function q(N) {
    const _ = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (_ !== t && (t = _, n = [], r = 0, o = -1 / 0, h = fo), !_ || N.walletCannotAlbums) return null;
    if (!s && e.now() - o > 5 * 6e4 && P(_), !n.length)
      return i ? (ne.replaceChildren(bn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ho("Try again", () => {
        o = -1 / 0, e.changed();
      }, "quiet")), u.replaceChildren(ne), u) : null;
    const W = v(_), R = C(_), ue = $I(n, { query: a, sort: c, pinnedOnly: d, pins: W, recents: R });
    k.value !== a && (k.value = a), M.value = c, U.textContent = d ? "★ Pinned only" : "☆ Pinned only", U.setAttribute("aria-pressed", String(d));
    const de = [];
    if (N.slot > 0 && de.push(ho("← My player", () => e.open(0), "quiet")), !ue.length) de.push(bn("p", "No album matches that.", "ppp-mute"));
    else {
      const Oe = bn("ul", "", "ppp-shelf-list");
      for (const L of ue.slice(0, h)) {
        const j = bn("li", "", L.slot === N.slot ? "now" : ""), fe = W.has(L.slot), ye = ho(fe ? "★" : "☆", () => {
          const et = new Set(W);
          fe ? et.delete(L.slot) : et.add(L.slot), e.store.set(w(_), JSON.stringify([...et])), e.changed();
        }, "tiny");
        ye.setAttribute("aria-label", fe ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const Le = [L.player.subtitle, `${Tr(L.player).length} ${Tr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Be = L.slot === N.slot, Ct = ho(Be ? "Playing" : "Select", () => {
          e.store.set(y(_), JSON.stringify(II({ ...R, [L.slot]: e.now() }))), e.open(L.slot);
        }, Be ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Ct.disabled = Be;
        const He = Tr(L.player)[0], Me = L.player.cover ?? (He == null ? void 0 : He.id), Ne = Me ? fh(String(Me)) : "", qt = bn("span", "", "ppp-shelf-art");
        if (Ne) {
          const et = document.createElement("img");
          et.src = Ne, et.alt = "", et.decoding = "async", qt.append(et);
        } else qt.textContent = "💿";
        const jt = bn("span", "", "ppp-shelf-txt");
        jt.append(bn("span", L.player.title, "t"), bn("span", Le, "ppp-mute")), j.append(ye, qt, jt, Ct), Oe.append(j);
      }
      de.push(Oe), ue.length > h && de.push(ho(`Show more (${ue.length - h} left)`, () => {
        h += fo, e.changed();
      }, "quiet"));
    }
    return i && de.push(bn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), le.replaceChildren(...de), u.firstChild !== Y && u.replaceChildren(Y, le), u;
  }
  return { render: q, invalidate: H, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const N = C(t), _ = [...n].filter((W) => W.player).sort((W, R) => (N[R.slot] ?? 0) - (N[W.slot] ?? 0) || R.slot - W.slot)[0];
    return _ ? { slot: _.slot, title: _.player.title } : null;
  } };
}
const xg = "http://www.w3.org/2000/svg", NI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function gl(e = "", t = !1) {
  const n = document.createElementNS(xg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of NI) {
    const i = document.createElementNS(xg, "path");
    i.setAttribute("fill-rule", "evenodd"), i.setAttribute("fill", t ? "currentColor" : r), i.setAttribute("d", s), n.append(i);
  }
  return n;
}
const it = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Vn = (e, t, n, r = !1) => {
  const s = it("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, db = (e) => e.toLocaleString(), Sg = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, _I = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function yl(e, t) {
  const n = it("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const i = it("li", s < t ? "is-done" : s === t ? "is-now" : "");
    i.append(it("i", "", s < t ? "✓" : String(s + 1)), it("span", "", r)), n.append(i);
  }), n;
}
function PI() {
  const e = it("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(it("span", "tier-disc__mark", "?")), e;
}
const UI = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], vr = {
  gift: { title: "Your free player is waiting", primary: "Claim my free player", hint: "One tap with Face ID or your fingerprint. No app, no account, no password.", returning: "I already have a player", full: "Look around first" },
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
  arriving: { title: "Your player is made", body: "Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself." },
  landed: { title: "You’re in", primary: "Start listening" },
  empty: { title: "Your player is ready", body: "It has no plays yet. Add some and every song you hear pays its artist.", primary: "Add plays", full: "Look around the radio" },
  checking: "One moment…",
  asking: "Continue in the box below."
}, HI = (e, t, n = !1) => n ? `${t || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${t || "Xtrata Music"} has covered ${e ? `${db(e)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, OI = (e) => e ? `Your player holds ${db(e)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", DI = (e) => e ? `You got a ${e.name} player` : vr.landed.title;
function FI(e, t = !0) {
  const n = it("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(it("span", "tier-disc__mark", e.mark)), n;
}
function jI(e) {
  const t = document.documentElement;
  let n = !1;
  const r = () => {
    const s = it("ul", "al-welcome-points");
    for (const [i, o, a] of UI) {
      const c = it("li");
      c.title = o;
      const d = it("em", "", a);
      d.setAttribute("aria-hidden", "true"), c.append(d, it("b", "", i), it("span", "", o)), s.append(c);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, i = !1) {
      var u;
      if (!s) {
        n && !i && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = s.mode, s.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const o = it("header", "al-top"), a = it("a", "al-brand");
      a.href = "/radio", a.append(gl("al-logo"), it("span", "", "Xtrata "), it("b", "", "Music")), o.append(a);
      const c = it("div", "al-body al-body--welcome"), d = it("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        d.append(it("p", "al-welcome-wait", vr.checking));
      else {
        const w = _I(h);
        if (w >= 0 && d.append(yl(h === "new" ? Sg.fresh : Sg.gift, w)), s.tier && (h === "landed" || h === "back" || h === "empty") ? d.append(FI(s.tier)) : h === "gift" || h === "arriving" ? d.append(PI()) : h === "new" && d.append(gl("al-hero-mark")), d.append(it("h1", "", h === "landed" ? DI(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : vr[h].title)), d.append(it("p", "", h === "gift" ? HI(s.plays, s.from, s.mystery) : h === "landed" ? OI(s.plays) : vr[h].body)), (h === "landed" || h === "gift") && d.append(r()), s.status.length) {
          const y = it("div", "al-status");
          y.setAttribute("role", "status"), y.append(...s.status), d.append(y);
        }
        if (s.asking) d.append(it("p", "al-hint al-hint--ask", vr.asking));
        else if (h === "back" && s.claimNew) {
          const y = vr.backClaim;
          d.append(it("p", "al-hint", y.body)), s.canStart && s.replaceOld ? d.append(Vn("al-primary", y.replace, s.replaceOld, s.busy), it("p", "al-hint", y.replaceHint), Vn("al-link", y.both, s.claimNew, s.busy), Vn("al-link", y.unlock, s.unlock, s.busy)) : s.canStart && d.append(Vn("al-primary", y.primary, s.claimNew, s.busy), it("p", "al-hint", y.hint), Vn("al-link", y.unlock, s.unlock, s.busy)), d.append(Vn("al-link", vr.back.full, s.full));
        } else if (h === "gift" || h === "new" || h === "back") {
          const y = vr[h];
          s.canStart && d.append(Vn("al-primary", y.primary, h === "back" ? s.unlock : s.start, s.busy), it("p", "al-hint", y.hint)), s.canStart && d.append(Vn("al-link", y.returning, s.returning, s.busy)), d.append(Vn("al-link", y.full, s.full));
        } else if (h === "landed") {
          if (d.append(Vn("al-primary", vr.landed.primary, s.full)), (u = s.albums) != null && u.length) {
            d.append(it("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const y of s.albums) {
              const S = Vn("al-album", "", y.run);
              if (y.cover) {
                const C = it("img", "al-album__art");
                C.src = y.cover, C.alt = "", S.classList.add("al-album--art"), S.append(C);
              }
              const v = it("span", "al-album__t");
              v.append(it("b", "", y.title), it("span", "", y.by)), S.append(v), d.append(S);
            }
          }
        } else h === "empty" && d.append(Vn("al-primary", vr.empty.primary, s.restock), Vn("al-link", vr.empty.full, s.full));
      }
      c.append(d), e.hidden = !1, e.replaceChildren(o, c);
    }
  };
}
const RI = 20, zI = ["Album", "Passkey", "Listen"], ln = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Ht = {
  grid: ln('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: ln('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: ln('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: ln('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: ln('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: ln('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: ln('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: ln('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: ln('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: ln('<path d="M6 9l6 6 6-6"/>', 18),
  right: ln('<path d="M9 6l6 6-6 6"/>', 16),
  close: ln('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: ln('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: ln('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: ln('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: ln('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: ln('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function ae(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, i] of Object.entries(t))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const mn = (e, ...t) => ae("button", { type: "button", ...e }, ...t), vc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, ca = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, GI = { music: "My music", device: "This device", gifts: "Albums (admin)" }, KI = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function vg(e, t, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement;
  function c(m) {
    var N, _, W;
    if (!m || !Number.isSafeInteger(m)) return "";
    const I = (W = (_ = (N = t.radio()) == null ? void 0 : N.getState) == null ? void 0 : _.call(N)) == null ? void 0 : W.albumCover;
    return I != null && I.url && Number(I.tokenId) === m ? I.url : Hc(m);
  }
  lh(() => q());
  function d(m) {
    var N;
    i = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const I = document.querySelector(".side");
    if (m && m !== "more") {
      for (const R of KI[m]) {
        const ue = I == null ? void 0 : I.querySelector(R);
        ue && (ue.open = !0);
      }
      const _ = document.getElementById("sheetTitle");
      _ && (_.textContent = GI[m]);
      const W = document.getElementById("sheetExtra");
      W && W.replaceChildren(...m === "music" ? [u()] : []), (N = I == null ? void 0 : I.scrollTo) == null || N.call(I, { top: 0 });
    }
    q();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => d("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && i && a.dataset.view === "album" && d("");
  });
  const u = () => mn(
    { class: "al-row", onClick: () => {
      d(""), t.openPlayer();
    } },
    ae("span", { class: "al-row-i", html: Ht.radio }),
    ae("span", { class: "al-row-t" }, ae("b", {}, "Xtrata Radio"), ae("small", {}, "Every song on-chain · FM, liked, all")),
    ae("span", { class: "al-row-go", html: Ht.right })
  );
  let w = null, y = !1;
  const S = () => {
    var I;
    const m = t.radio();
    y || !(m != null && m.subscribe) || (y = !0, m.subscribe((N) => {
      w = N, (s == null ? void 0 : s.mode) === "open" && q();
    }), w = ((I = m.getState) == null ? void 0 : I.call(m)) ?? null);
  };
  r || setInterval(() => {
    var _, W;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (W = (_ = t.radio()) == null ? void 0 : _.getPosition) == null ? void 0 : W.call(_), I = e.querySelector(".al-bar > i"), N = e.querySelectorAll(".al-times span");
    !m || !I || (I.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", N.length === 2 && (N[0].textContent = vc(m.current || 0), N[1].textContent = m.duration ? vc(m.duration) : "–:––"));
  }, 500);
  let v = "", C = null;
  function P(m, I, N = {}) {
    const _ = N.song || c(m.cover), R = [_ ? ae("img", { src: _, alt: N.song ? "Song artwork" : `${m.title} cover` }) : ae("div", { class: "al-cover-fallback" }, ae("b", {}, m.title), m.subtitle ? ae("span", {}, m.subtitle) : null), N.paused ? ae("span", { class: "al-paused" }, ae("i", { html: Ht.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], ue = "al-cover" + (I ? "" : " al-cover--small") + (N.paused ? " is-paused" : "");
    return N.flip ? (R.push(ae("span", { class: "al-flip", "aria-hidden": "true", html: Ht.flip })), mn({ class: ue + " is-flippable", "aria-label": N.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: N.flip }, ...R)) : ae("div", { class: ue }, ...R);
  }
  function H(m) {
    return m.plays === null || m.plays === void 0 ? ae("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? ae("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : ae("span", { class: "al-chip" + (m.plays <= RI ? " al-chip--low" : "") }, `${ca(m.plays, "play", "plays")} left`);
  }
  function k(m) {
    const I = m.player, N = I.tracks.filter((W) => !W.hidden), _ = [];
    return m.step !== void 0 && _.push(yl(zI, m.step)), m.mode === "arrive" && m.from && _.push(ae("p", { class: "al-from" }, ae("span", { html: Ht.gift }), ae("span", {}, ae("b", {}, m.from), " sent you an album"))), _.push(P(I, !0)), _.push(ae(
      "div",
      { class: "al-intro" },
      ae("h1", {}, I.title),
      I.subtitle ? ae("p", { class: "al-artist" }, I.subtitle) : null,
      N.length ? ae("p", { class: "al-songline" }, N.map((W) => W.title || `#${W.id}`).join(" · ")) : null,
      ae("span", { class: "al-chip" }, [ca(N.length, "song", "songs"), m.offered ? ca(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && _.push(ae("div", { class: "al-status", role: "status" }, ...m.status)), _.push(ae("div", { class: "al-grow" })), m.asking ? _.push(ae("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && _.push(mn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, ae("span", { html: Ht.playSmall }), m.primary.label)), m.hint && !m.asking && _.push(ae("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && _.push(mn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), _;
  }
  function M(m, I) {
    const { songs: N, current: _, started: W, own: R, out: ue, waiting: de } = I, Oe = m.player, L = t.radio(), j = [];
    j.push(ae("div", { class: "al-listhead" }, ae("span", {}, ae("b", {}, Oe.title), ` · ${ca(N.length, "song", "songs")}`), H(m)));
    const fe = c(Oe.cover), ye = "album:" + Oe.cover;
    fe && !sn.has(ye) && (sn.set(ye, fe), dh(fe).then((Be) => {
      Be !== fe && (sn.set(ye, Be), q());
    }));
    const Le = fe ? sn.get(ye) || fe : "";
    return j.push(ae("ol", { class: "al-tracks" }, ...N.map((Be, Ct) => {
      const He = String(Be.id) === _, Me = fh(String(Be.id), He && W ? R : void 0);
      return ae("li", {}, mn(
        { class: "al-track" + (He ? " is-on" : ""), "aria-label": `Play ${Be.title || "#" + Be.id}`, "aria-current": He ? "true" : void 0, disabled: ue || de, onClick: () => {
          var Ne;
          return (Ne = L == null ? void 0 : L.playToken) == null ? void 0 : Ne.call(L, Be.id);
        } },
        ae(
          "span",
          { class: "al-th" + (Me ? "" : " is-blank") },
          Me ? ae("img", { src: Me, alt: "", decoding: "async" }) : Le ? ae("img", { src: Le, alt: "", decoding: "async" }) : null,
          Me ? null : ae("span", { class: "al-n" }, String(Ct + 1)),
          He ? ae("span", { class: "al-eq", html: Ht.eq }) : null
        ),
        ae("span", { class: "al-tt" }, Be.title || `#${Be.id}`, Be.explicit ? ae("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), j;
  }
  function U(m) {
    var Me;
    const I = m.player, N = I.tracks.filter((Ne) => !Ne.hidden), _ = t.radio(), W = w == null ? void 0 : w.nowPlaying, R = W && I.tracks.some((Ne) => String(Ne.id) === String(W.tokenId)) ? String(W.tokenId) : null, ue = R ? I.tracks.find((Ne) => String(Ne.id) === R) : null, de = m.plays === 0 && !m.playsComing, Oe = !!m.playsComing && !m.plays, L = !!(w != null && w.playing) && !!R, j = w == null ? void 0 : w.heart, fe = R ? (Me = _ == null ? void 0 : _.getPosition) == null ? void 0 : Me.call(_) : null;
    R && (L || ((fe == null ? void 0 : fe.current) ?? 0) > 0.5) && (v = I.id);
    const ye = !!R && v === I.id;
    C && C !== R && (C = null);
    const Le = ye ? String((W == null ? void 0 : W.cover) || "") : "", Be = !!Le && C === R, He = [P(I, !de, { song: Be ? "" : Le, paused: ye && !L, flip: Le ? () => {
      C = C === R ? null : R, q();
    } : void 0, flipped: Be })];
    if (He.push(ae(
      "div",
      { class: "al-now" },
      ae(
        "div",
        { class: "al-now-t" },
        ae("div", { class: "al-song" }, ue ? ue.title || (W == null ? void 0 : W.title) || `#${ue.id}` : I.title),
        ae("div", { class: "al-artist" }, ue ? ue.artist || (W == null ? void 0 : W.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      R ? mn({ class: "al-icon" + (j != null && j.liked ? " is-on" : ""), "aria-label": j != null && j.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(j != null && j.liked)), disabled: !!(j != null && j.pending) || !!(j != null && j.locked) || Oe, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.toggleLike) == null ? void 0 : Ne.call(_);
      }, html: j != null && j.liked ? Ht.heartOn : Ht.heart }) : null
    )), de)
      He.push(ae(
        "div",
        { class: "al-out" },
        ae("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ae("p", { class: "al-out-t" }, "You've played this album out"),
        ae("p", { class: "al-out-s" }, "Add plays to keep listening."),
        Y(m, !0)
      ));
    else {
      const Ne = fe != null && fe.duration ? Math.min(100, fe.current / fe.duration * 100) : 0;
      He.push(ae(
        "div",
        { class: "al-prog" },
        ae("div", { class: "al-bar" }, ae("i", { style: `width: ${Ne}%` })),
        ae("div", { class: "al-times" }, ae("span", {}, vc((fe == null ? void 0 : fe.current) || 0)), ae("span", {}, fe != null && fe.duration ? vc(fe.duration) : "–:––"))
      ));
    }
    return He.push(ae(
      "div",
      { class: "al-ctl" + (de || Oe ? " is-off" : "") },
      mn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: de || Oe, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.prev) == null ? void 0 : Ne.call(_);
      }, html: Ht.prev }),
      mn({ class: "al-play", "aria-label": L ? "Pause" : "Play", disabled: de || Oe, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.playPause) == null ? void 0 : Ne.call(_);
      }, html: L ? Ht.pause : Ht.play }),
      mn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: de || Oe, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.next) == null ? void 0 : Ne.call(_);
      }, html: Ht.next })
    )), m.status.length && He.push(ae("div", { class: "al-status", role: "status" }, ...m.status)), He.push(...M(m, { songs: N, current: R, started: ye, own: Le, out: de, waiting: Oe })), He.push(ae("div", { class: "al-grow" })), He.push(mn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => d(i === "more" ? "" : "more") },
      ae("span", {}, "More ", ae("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ae("span", { html: Ht.down })
    )), He;
  }
  function Y(m, I) {
    const N = ae("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), _ = I ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const W of _) {
      const R = m.myPlays !== void 0 && m.myPlays >= W && !m.playsComing && !m.busy;
      N.append(mn({ class: "al-topup", disabled: !R, onClick: () => t.topUp(W) }, I ? `Add ${W.toLocaleString()} plays` : `+${W.toLocaleString()}`));
    }
    return I && N.append(mn({ class: "al-link", onClick: () => d("more") }, "Other amounts")), N;
  }
  function le(m) {
    const I = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), N = ae(
      "div",
      { class: "al-card" },
      ae("div", { class: "al-card-h" }, ae("b", {}, `Add plays to ${m.player.title}`), ae("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      Y(m, !1),
      ae("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${ca(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !m.playsComing && m.myPlays !== void 0 ? mn({ class: "al-link", onClick: () => {
        d(""), t.openPlayer();
      } }, "Open My player") : null
    ), _ = (R, ue, de, Oe) => mn(
      { class: "al-row", onClick: Oe },
      ae("span", { class: "al-row-i", html: R }),
      ae("span", { class: "al-row-t" }, ae("b", {}, ue), ae("small", {}, de)),
      ae("span", { class: "al-row-go", html: Ht.right })
    ), W = ae(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      _(Ht.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, q();
      }),
      o ? ae("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return ae(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      ae("div", { class: "al-sheet-h" }, ae("b", {}, "More"), mn({ class: "al-icon", "aria-label": "Close", onClick: () => d(""), html: Ht.close })),
      m.mode === "open" ? N : null,
      ae(
        "div",
        { class: "al-rows" },
        _(Ht.grid, "My music", "Your albums and the radio", () => d("music")),
        _(Ht.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          d(""), t.openPlayer();
        }),
        m.canMake ? _(Ht.gift, "Albums (admin)", "Make an album and fund copies", () => d("gifts")) : null,
        _(Ht.device, "This device", "Backup, history, Stacks wallet, returns", () => d("device")),
        W
      )
    );
  }
  function ne(m) {
    var de, Oe;
    const I = m.player, N = w == null ? void 0 : w.nowPlaying, _ = N && I.tracks.some((L) => String(L.id) === String(N.tokenId)) ? String(N.tokenId) : null, W = !!(w != null && w.playing) && !!_, R = _ ? (Oe = (de = t.radio()) == null ? void 0 : de.getPosition) == null ? void 0 : Oe.call(de) : null;
    _ && (W || ((R == null ? void 0 : R.current) ?? 0) > 0.5) && (v = I.id);
    const ue = !!_ && v === I.id;
    return M(m, {
      songs: I.tracks.filter((L) => !L.hidden),
      current: _,
      started: ue,
      own: ue ? String((N == null ? void 0 : N.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function q() {
    const m = s;
    if (r) {
      if (!m || m.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      S(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...ne(m));
      return;
    }
    if (!m) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    S(), e.hidden = !1;
    const I = ae(
      "header",
      { class: "al-top" },
      ae("a", { class: "al-brand", href: "/radio" }, gl("al-logo"), "Xtrata ", ae("b", {}, "Music")),
      m.mode === "open" ? mn({ class: "al-icon", "aria-label": "My music", onClick: () => d("music"), html: Ht.grid }) : null
    ), N = ae("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? U(m) : k(m));
    e.replaceChildren(I, N, ...i === "more" ? [ae("div", { class: "al-scrim", onClick: () => d("") }), le(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, q();
        return;
      }
      const I = !!s;
      s = m, !m && (I || i) && (i = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, q();
    },
    sheet: () => i,
    setSheet: d
  };
}
const VI = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", YI = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${VI}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, XI = (e) => YI("source|audio", e), qI = 48 * 1024 * 1024;
function WI(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function ZI(e) {
  const t = e.fetch ?? ((...h) => fetch(...h));
  let n = null, r = null, s = "", i = null;
  const o = (h) => {
    n = h, e.changed();
  }, a = () => {
    var h;
    if (i == null || i.abort(), i = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (h = r.load) == null || h.call(r);
      } catch {
      }
    s.startsWith("blob:") && URL.revokeObjectURL(s), s = "";
  };
  async function c(h, u, w = 0) {
    var k, M, U;
    const y = "/inscription/" + h, S = await t(y, { signal: u }), v = (S.headers.get("content-type") || "").toLowerCase();
    if (!S.ok)
      throw await ((k = S.body) == null ? void 0 : k.cancel()), new Error("not found");
    if (v.startsWith("audio/"))
      return await ((M = S.body) == null ? void 0 : M.cancel()), y;
    if (!v.includes("text/html"))
      throw await ((U = S.body) == null ? void 0 : U.cancel()), new Error("not a song");
    const C = await S.text();
    if (C.length > qI) throw new Error("too large");
    const P = C.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (P) return WI(P[1].replace(/&amp;/g, "&"));
    const H = w === 0 ? XI(C) : null;
    if (H) return c(Number(H), u, 1);
    throw new Error("no audio");
  }
  async function d(h) {
    var w;
    a();
    const u = i = new AbortController();
    o({ id: h, state: "loading" });
    try {
      const y = await c(h, u.signal);
      if (u.signal.aborted) {
        y.startsWith("blob:") && URL.revokeObjectURL(y);
        return;
      }
      if (s = y, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), o(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const S = n.id;
          a(), o({ id: S, state: "error" });
        }
      })), (w = e.quiet) == null || w.call(e), r.src = y, await r.play(), u.signal.aborted) return;
      o({ id: h, state: "playing" });
    } catch {
      if (u.signal.aborted) return;
      a(), o({ id: h, state: "error" });
    }
  }
  return {
    state: (h) => (n == null ? void 0 : n.id) === h ? n.state : "idle",
    toggle: (h) => {
      (n == null ? void 0 : n.id) === h && n.state !== "error" ? (a(), o(null)) : d(h);
    },
    stop: () => {
      n && (a(), o(null));
    }
  };
}
const JI = ["Earned", "Claim", "Yours"], QI = ["Connect", "Link", "Name"], St = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, dn = (e, t, n, r = !1) => {
  const s = St("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Eg = (e, t, n, r = !1) => {
  const s = dn("al-album", "", n, r), i = St("span", "al-album__t");
  return i.append(St("b", "", e), St("span", "", t)), s.append(i), s;
}, eL = (e) => `No. ${String(e).padStart(4, "0")}`, tL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function nL(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const i = (o) => {
    if (s && r === o.art) return s;
    r = o.art, s = St("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = o.art, a.title = `${o.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), s.append(a), s;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(o, a = !1) {
      if (!o) {
        n && !a && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", s = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = o.screen, o.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const c = St("header", "al-top"), d = St("a", "al-brand");
      d.href = "/radio", d.append(gl("al-logo"), St("span", "", "Xtrata "), St("b", "", "Music")), c.append(d);
      const h = St("div", "al-welcome"), u = o.screen, w = o.tier.name, y = typeof o.name == "string" && o.name ? o.name : null;
      if (h.append(u === "have" ? yl(QI, tL(o)) : yl(JI, u === "making" ? 2 : u === "yours" ? 3 : 1)), u === "making") {
        const H = St("div", "tier-disc tier-disc--mid");
        H.dataset.tier = o.tier.id, H.append(St("span", "tier-disc__mark", o.tier.mark)), h.append(H);
      } else if (u !== "have" && u !== "get") {
        const H = i(o);
        H.classList.toggle("aw-art--small", u === "name"), h.append(H);
      }
      const S = u === "ready" ? `Your ${w} record is ready` : u === "name" ? "Put your name on it?" : u === "have" ? "Use the name in your wallet" : u === "get" ? "Get a .btc name" : u === "making" ? "Making your record" : "It’s yours";
      h.append(St("h1", "", S));
      const v = (H, k = "") => h.append(St("p", k, H)), C = [];
      if (u === "ready")
        v(`You’ve paid artists for ${o.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), C.push(dn("al-primary", `Claim my ${w} record`, () => o.go("name"), o.busy), St("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), dn("al-link", "Later", o.later));
      else if (u === "name")
        y ? (v(`Your record will carry ${y} beside your player’s address.`), C.push(dn("al-primary", `Claim with ${y}`, () => o.claim("auto"), o.busy), dn("al-link", "Use my address only", () => o.claim("none"), o.busy))) : o.name === null ? (v("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), C.push(
          Eg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => o.go("have"), o.busy),
          Eg("I want to get a name", "Where to get one, and how to put it on your player", () => o.go("get"), o.busy),
          dn("al-primary", "Claim with my address", () => o.claim("none"), o.busy)
        )) : (v("Could not check for a .btc name just now.", "ppp-warn"), C.push(dn("al-primary", "Check again", o.refresh, o.busy), dn("al-link", "Claim with my address only", () => o.claim("none"), o.busy))), C.push(St("p", "al-hint", "What is on the plaque cannot be changed afterwards."));
      else if (u === "have")
        o.main ? !o.linked && o.canLink ? (v(`Link this player to ${o.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), C.push(dn("al-primary", "Link my player", o.link, o.busy))) : o.linked ? y ? (v(`Found it: ${y}. It goes on your plaque beside your player’s address.`), C.push(dn("al-primary", `Claim with ${y}`, () => o.claim("auto"), o.busy))) : (v(o.name === null ? `${o.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", o.name === null ? "" : "ppp-warn"), C.push(dn("al-primary", "Check again", o.refresh, o.busy))) : (v(`Linking is not open for ${o.main} right now. You can send a name to your player instead.`, "ppp-warn"), C.push(dn("al-primary", "Show me how", () => o.go("get"), o.busy))) : (v("Connect the Leather or Xverse wallet that holds your .btc name."), C.push(dn("al-primary", "Connect my wallet", o.connect, o.busy))), C.push(dn("al-link", "Back", () => o.go("name")));
      else if (u === "get") {
        const H = St("ol", "aw-steps"), k = St("li");
        k.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const M = St("a", "", "Open BNS One ↗");
        M.href = "https://bns.one", M.target = "_blank", M.rel = "noopener", k.append(M);
        const U = St("li");
        U.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", St("span", "ppp-addr-full", o.player), o.copyAddress());
        const Y = St("li", "", "Check again, and your name shows on the preview before you claim.");
        H.append(k, U, Y), h.append(H), C.push(dn("al-primary", "I have my name: check again", () => {
          o.refresh(), o.go("name");
        }, o.busy), dn("al-link", "Back", () => o.go("name")));
      } else if (u === "making") {
        if (v("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), o.claimLink) {
          const H = St("p", "al-hint"), k = St("a", "", "See the claim on-chain ↗");
          k.href = o.claimLink, k.target = "_blank", k.rel = "noopener", H.append(k), h.append(H);
        }
      } else if (v(`${w} record ${eL(o.number)}${o.inscription !== void 0 ? ` · Xtrata inscription #${o.inscription}` : ""}. In your player now, and yours for good.`), C.push(dn("al-primary", "See it in my player", o.done)), o.inscription !== void 0) {
        const H = St("a", "al-link", "Open it full screen ↗");
        H.href = `/i/${o.inscription}`, H.target = "_blank", H.rel = "noopener", C.push(H);
      }
      if (o.status.length) {
        const H = St("div", "al-status");
        H.setAttribute("role", "status"), H.append(...o.status), h.append(H);
      }
      o.asking ? h.append(St("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...C);
      const P = St("div", "al-body al-body--welcome");
      P.append(h), e.hidden = !1, e.replaceChildren(c, P);
    }
  };
}
const fb = "xtrata.xyz/music/release", rL = "Release music on Xtrata Music; no spending permission", sL = (e) => ({
  domain: er({ name: ut(fb), version: ut("1"), "chain-id": on(1) }),
  message: er({ purpose: ut(rL), artist: ut(e.artist), release: ut(e.hash), issued: on(e.issued) })
}), iL = "Set the price of my release on Xtrata Music; no spending permission", oL = 100000n, aL = 1000000000n, cL = (e) => e === 0n || e >= oL && e <= aL, lL = (e) => ({
  domain: er({ name: ut(fb), version: ut("1"), "chain-id": on(1) }),
  message: er({ purpose: ut(iL), artist: ut(e.artist), release: ut(e.release), price: on(BigInt(e.price)), issued: on(e.issued) })
}), po = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, uL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, me = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, un = (e, t, n = "") => {
  const r = me("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Ec = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), Ag = (e) => {
  const t = Tr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function Ac(e, t, n = "", r = "") {
  const s = me("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), i = e || n;
  if (i) {
    const o = document.createElement("img");
    o.src = i, o.alt = "", o.decoding = "async", s.append(o);
  }
  return e || s.append(me("span", t)), s;
}
const Uu = (e) => !!e && Kd(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function dL(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, s = "", i = "";
  const o = (() => {
    try {
      const z = new URLSearchParams(location.search).get("release");
      return Kd(z) ? z : null;
    } catch {
      return null;
    }
  })();
  let a = o ? { id: o } : null;
  const c = (z) => "xtrata.radio.releases.shelf.v1:" + z;
  let d = null, h = !1, u = -1 / 0;
  const w = (z, O, ee) => {
    const Q = Array.isArray(O) ? O.filter(Uu).map((he) => ({ ...he, hidden: !!he.hidden })) : [];
    d = { for: z, albums: Q, fresh: ee }, ee && e.store.set(c(z), JSON.stringify(Q));
  }, y = (z) => {
    try {
      w(z, JSON.parse(e.store.get(c(z)) || "[]"), !1);
    } catch {
      w(z, [], !1);
    }
  }, S = () => {
    const z = e.player().address;
    return z && (d == null ? void 0 : d.for) === z ? d.albums : [];
  };
  async function v(z, O = "") {
    const ee = e.player();
    if (!ee.address || !ee.unlocked)
      return i = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, i = "", e.changed();
    try {
      const Q = await e.signShelf(z, O), he = await e.json("/radio/release/shelf", Ec(Q));
      return w(ee.address, he == null ? void 0 : he.albums, !0), P(he == null ? void 0 : he.pay) ? k(ee.address, he.pay) : z === "add" && k(ee.address, null, O), !0;
    } catch (Q) {
      return z !== "list" && (i = Q.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const C = (z) => "xtrata.radio.releases.orders.v1:" + z, P = (z) => !!z && /^[0-9a-f]{16}$/.test(z.order) && Kd(z.release) && typeof z.to == "string" && /^\d{1,12}$/.test(z.amount) && typeof z.memo == "string", H = (z) => {
    if (!z) return {};
    try {
      const O = JSON.parse(e.store.get(C(z)) || "{}");
      return O && typeof O == "object" ? Object.fromEntries(Object.entries(O).filter(([, ee]) => P(ee))) : {};
    } catch {
      return {};
    }
  };
  function k(z, O, ee = (O == null ? void 0 : O.release) ?? "") {
    var he;
    const Q = H(z);
    O ? Q[O.release] = { ...((he = Q[O.release]) == null ? void 0 : he.order) === O.order ? Q[O.release] : {}, ...O } : delete Q[ee], e.store.set(C(z), Object.keys(Q).length ? JSON.stringify(Q) : null);
  }
  const M = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Map();
  async function Y(z, O, ee = !1) {
    var Q;
    if (!M.has(O.order)) {
      M.add(O.order), U.set(O.order, e.now()), ee && (i = "", e.changed());
      try {
        const he = await e.json("/radio/release/paid", Ec({ order: O.order, ...O.txid ? { txid: O.txid } : {} }));
        (he == null ? void 0 : he.status) === "paid" ? (k(z, null, O.release), ((Q = a == null ? void 0 : a.view) == null ? void 0 : Q.id) === O.release && (a.view = { ...a.view, added: a.view.added + 1 }), i = "", M.delete(O.order), (d == null ? void 0 : d.for) === z && (d.fresh = !1), e.player().unlocked && await v("list")) : (P(he) && k(z, { ...O, ...he }), ee && (he == null ? void 0 : he.status) === "pending" && (i = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (he) {
        /did not go through|does not pay this order/.test(he.message || "") && k(z, { ...O, txid: void 0, status: "pending" }), (ee || O.txid) && (i = he.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        M.delete(O.order), e.changed();
      }
    }
  }
  async function le(z, O, ee) {
    if (!s) {
      s = "Approve the payment in your wallet…", i = "", e.changed();
      try {
        const Q = await e.pay(z, ee.to, BigInt(ee.amount), ee.memo), he = { ...ee, txid: Q || void 0, status: "confirming" };
        k(O, he), s = "", Y(O, he);
      } catch (Q) {
        i = /cancel/i.test(Q.message || "") ? "Payment cancelled. Nothing was sent." : Q.message || "Not paid. Nothing was sent.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  async function ne(z) {
    const O = e.player();
    if (!await v("add", z.id) || !O.address) return;
    const ee = H(O.address)[z.id], Q = e.main();
    ee && Q && await le(Q, O.address, ee);
  }
  function q() {
    if (r || (r = !0, e.json("/radio/release/config").then((O) => {
      t = (O == null ? void 0 : O.enabled) === !0, n = { copies: t && (O == null ? void 0 : O.copies) === !0, sales: t && (O == null ? void 0 : O.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const O = a;
      O.error = "", e.json("/radio/release/view?id=" + O.id).then(
        (ee) => {
          Uu(ee) ? (O.view = ee, delete O.error) : O.error = "This release could not be read.";
        },
        (ee) => {
          O.error = ee.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const z = e.player();
    if (z.address) {
      (d == null ? void 0 : d.for) !== z.address && y(z.address), z.unlocked && !(d != null && d.fresh) && !h && e.now() - u > 6e4 && (u = e.now(), v("list"));
      for (const O of Object.values(H(z.address)))
        if ((O.txid || O.status === "confirming") && !M.has(O.order) && e.now() - (U.get(O.order) ?? -1 / 0) > 2e4) {
          const ee = z.address;
          Y(ee, O).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const m = () => t ? S().filter((z) => !z.hidden) : [];
  function I(z, O) {
    const ee = me("ol", "", "ppp-rel-songs");
    return z.forEach((Q, he) => {
      const lt = me("li");
      lt.append(Ac(e.art.song(Q.id, !0) || "", String(he + 1), O), me("span", Q.title)), ee.append(lt);
    }), ee;
  }
  function N() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [me("p", `♫ ${a.error}`, "ppp-warn")] : [me("p", "♫ Opening this release…", "ppp-mute")];
    const z = a.view, O = me("div", "", "ppp-release-in"), ee = me("p", "", "ppp-release-in__h"), Q = BigInt(/^\d{1,12}$/.test(z.price ?? "") ? z.price : "0");
    ee.append(me("b", z.title), me("span", `${z.subtitle || e.who(z.artist)} · ${Ag(z)}${Q > 0n ? ` · ${po(Q)} STX` : ""}`));
    const he = Tr(z), lt = e.art.cover(z.cover) || (z.cover ? "" : he[0] && e.art.song(he[0].id, !0) || ""), $e = me("div", "", "ppp-rel-top");
    $e.append(Ac(lt, "💿", "", "is-cover"), ee), O.append($e, I(he.map((ve) => ({ id: ve.id, title: ve.title || `#${ve.id}` })), e.art.cover(z.cover))), O.append(me("p", `Released by ${e.who(z.artist)}. ${z.added === 1 ? "1 player has" : `${z.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const Pe = e.player(), ft = S().find((ve) => ve.id === z.id), _e = me("div", "", "ppp-award__row");
    if (ft)
      O.append(me("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), _e.append(un("Play it", () => e.open(z), "primary"));
    else if (!Pe.address) O.append(me("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!Pe.unlocked) O.append(me("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (Q > 0n) {
      const ve = H(Pe.address)[z.id], Ge = e.main(), Fe = `${po((ve == null ? void 0 : ve.amount) ?? Q)} STX`;
      if (ve != null && ve.txid || (ve == null ? void 0 : ve.status) === "confirming") {
        O.append(me("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Se = un("Check now", () => void Y(Pe.address, ve, !0));
        Se.disabled = M.has(ve.order), _e.append(Se);
      } else if (O.append(me("p", `This album costs ${Fe}. You pay ${e.who(z.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !ve) O.append(me("p", "Buying is paused right now.", "ppp-warn"));
      else if (ve) {
        if (Ge) {
          const En = un(`Pay ${Fe} from my wallet`, () => void le(Ge, Pe.address, ve), "primary");
          En.disabled = !!s, _e.append(En);
        } else O.append(me("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Se = me("div", "", "ppp-rel-pay"), Lt = (En, yt, gn) => {
          const Qt = me("p");
          return Qt.append(me("span", En), me("code", yt), lr(`order-${gn}:${ve.order}`, "Copy", () => yt, "tiny", e.changed)), Qt;
        };
        Se.append(Lt("Send", po(ve.amount) + " STX", "amount"), Lt("To", ve.to, "to"), Lt("Memo", ve.memo, "memo")), O.append(Se, me("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const pn = un("I have paid: check", () => void Y(Pe.address, ve, !0));
        pn.disabled = M.has(ve.order), _e.append(pn);
      } else {
        const Se = un(`Buy · ${Fe}`, () => void ne(z), "primary");
        Se.disabled = h || !!s, _e.append(Se);
      }
    } else {
      O.append(me("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const ve = un("Add to my player", () => {
        v("add", z.id).then((Ge) => {
          Ge && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      ve.disabled = h, _e.append(ve);
    }
    return _e.append(un("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), O.append(_e), s && O.append(me("p", s, "ppp-cyan")), i && O.append(me("p", i, "ppp-warn")), [O];
  }
  let _ = !1;
  function W() {
    const z = t ? S() : [];
    if (!z.length) return null;
    const O = me("details", "", "ppp-release-manage");
    O.open = _, O.ontoggle = () => {
      _ = O.open;
    };
    const ee = z.filter((he) => he.hidden).length;
    O.append(me("summary", `Albums I added (${z.length}${ee ? `, ${ee} hidden` : ""})`));
    const Q = e.player().unlocked;
    Q || O.append(me("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const he of z) {
      const lt = me("div", "", "ppp-release-row" + (he.hidden ? " is-hidden" : "")), $e = me("span", "", "ppp-release-row__t");
      $e.append(me("b", he.title), me("span", `${he.subtitle || e.who(he.artist)}${he.hidden ? " · hidden" : ""}`));
      const Pe = un(he.hidden ? "Show" : "Hide", () => void v(he.hidden ? "show" : "hide", he.id), "tiny"), ft = un("Remove", () => void v("remove", he.id), "tiny");
      Pe.disabled = ft.disabled = !Q || h, lt.append($e, Pe, ft), O.append(lt);
    }
    return O.append(me("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), i && !a && O.append(me("p", i, "ppp-warn")), O;
  }
  let R = null, ue = [], de = null;
  const Oe = me("input");
  Oe.maxLength = 60, Oe.placeholder = "Title of the single, EP or album", Oe.setAttribute("aria-label", "Release title");
  const L = me("input");
  L.maxLength = 80, L.placeholder = "Artist name shown under the title", L.setAttribute("aria-label", "Artist name");
  const j = me("input");
  j.inputMode = "numeric", j.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", j.setAttribute("aria-label", "Cover inscription number");
  const fe = me("input");
  fe.inputMode = "decimal", fe.placeholder = "Price in STX, e.g. 2 (0 makes it free)", fe.setAttribute("aria-label", "Price in STX");
  let ye = null;
  const Le = (z, O, ee = "") => {
    ye = (ye == null ? void 0 : ye.id) === z && ye.what === O ? null : { id: z, what: O }, (ye == null ? void 0 : ye.what) === "price" && (fe.value = ee), i = "", e.changed();
  };
  async function Be(z, O) {
    if (s) return;
    const ee = uL(fe.value);
    if (ee === null || !cL(ee)) {
      i = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", i = "", e.changed();
    try {
      const Q = { artist: z, release: O.id, price: ee.toString(), issued: e.now() }, he = await e.sign(z, lL(Q));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", Ec({ request: Q, signature: he })), i = ee > 0n ? `Price set ✓ “${O.title}” now costs ${po(ee)} STX, paid straight to this wallet.` : `“${O.title}” is free again ✓`, ye = null, Me(z, !0);
    } catch (Q) {
      i = Q.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const Ct = (z) => `${location.origin}${location.pathname}?release=${z}`;
  function He(z) {
    R = { for: z, loading: !0 }, ue = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(z)).then(
      (O) => {
        const ee = Array.isArray(O == null ? void 0 : O.songs) ? O.songs.filter((Q) => Number.isSafeInteger(Q == null ? void 0 : Q.id) && typeof Q.title == "string") : null;
        R = ee ? { for: z, songs: ee, more: !!O.more } : { for: z, error: "Your songs could not be read right now." };
      },
      (O) => {
        R = { for: z, error: O.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Me(z, O = !1) {
    !O && (de == null ? void 0 : de.for) === z && e.now() - de.at < 6e4 || (de = { for: z, list: (de == null ? void 0 : de.for) === z ? de.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(z)).then((ee) => {
      Array.isArray(ee == null ? void 0 : ee.releases) && (de = { for: z, list: ee.releases.filter(Uu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Ne(z) {
    if (!s) {
      s = "Checking your release…", i = "", e.changed();
      try {
        const O = j.value.trim().replace(/^#/, ""), ee = lb({ title: Oe.value.trim(), subtitle: L.value.trim(), tracks: [...ue], cover: O ? Number(O) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const Q = { artist: z, hash: ub(ee), issued: e.now() }, he = await e.sign(z, sL(Q));
        s = "Releasing…", e.changed();
        const lt = await e.json("/radio/release/create", Ec({ definition: ee, request: Q, signature: he }));
        i = `${lt.existing ? "Already released" : "Released"} ✓ “${lt.title}”. Its link is below.`, ue = [], Oe.value = "", j.value = "", e.audition.stop(), Me(z, !0);
      } catch (O) {
        i = O.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const qt = () => {
    queueMicrotask(() => e.audition.stop());
  }, jt = /* @__PURE__ */ new Set();
  function et(z) {
    const O = ue.map((Se) => z.find((Lt) => Lt.id === Se)).filter((Se) => !!Se), ee = j.value.trim().replace(/^#/, ""), Q = /^\d{1,9}$/.test(ee) ? Number(ee) : null, he = e.art.cover(Q), lt = O[0] ? e.art.song(O[0].id, !0) : null, $e = me("div", "", "ppp-release-preview");
    $e.append(me("p", "How it will look", "ppp-featured__h"));
    const Pe = me("p", "", "ppp-release-in__h"), ft = me("b", Oe.value.trim() || "Untitled"), _e = me("span", `${L.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`);
    Pe.append(ft, _e);
    const ve = me("div", "", "ppp-rel-top");
    ve.append(Ac(Q ? he : lt || "", "💿", "", "is-cover"), Pe), $e.append(ve, I(O.map((Se) => ({ id: Se.id, title: Se.title })), he));
    const Ge = O.filter((Se) => e.art.song(Se.id, !0) === null).length, Fe = [];
    Q && !he && Fe.push(`Looking for an image in #${Q}… If none appears, that inscription is not a picture.`), Ge && Fe.push(`Finding artwork for ${Ge} ${Ge === 1 ? "song" : "songs"}…`), !Ge && O.some((Se) => e.art.song(Se.id, !1) === "") && Fe.push(`A numbered square is a song with no artwork of its own${he ? ": it shows the cover, dimmed" : ""}.`);
    for (const Se of Fe) $e.append(me("p", Se, "ppp-mute"));
    return Oe.oninput = () => {
      ft.textContent = Oe.value.trim() || "Untitled";
    }, L.oninput = () => {
      _e.textContent = `${L.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`;
    }, j.onchange = () => e.changed(), $e;
  }
  function Wt() {
    var ee;
    const z = e.main();
    if (!t || !z)
      return R && (R = null, ue = [], qt()), null;
    const O = [me("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (R && R.for !== z && (R = null, ue = [], jt.clear(), qt()), !R) O.push(un("Show the songs in my wallet", () => He(z), "primary"));
    else if (R.loading) O.push(me("p", "Reading your wallet…", "ppp-cyan"));
    else if (R.error) O.push(me("p", R.error, "ppp-warn"), un("Try again", () => He(z)));
    else if (!R.songs.length) O.push(me("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      O.push(me("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const Q = me("div", "", "ppp-release-songs");
      for (const $e of R.songs) {
        const Pe = ue.indexOf($e.id), ft = me("div", "", "ppp-release-song" + (Pe >= 0 ? " is-on" : "")), _e = e.audition.state($e.id);
        _e !== "idle" && jt.add($e.id);
        const ve = un(_e === "playing" ? "❚❚" : _e === "loading" ? "…" : "▶", () => e.audition.toggle($e.id), "ppp-release-hear" + (_e === "playing" ? " is-on" : ""));
        ve.setAttribute("aria-label", _e === "playing" ? `Stop ${$e.title}` : `Listen to ${$e.title}`), ve.title = _e === "error" ? "This song could not be played just now" : _e === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const Ge = e.art.song($e.id, Pe >= 0 || jt.has($e.id)), Fe = un("", () => {
          ue = Pe >= 0 ? ue.filter((Se) => Se !== $e.id) : [...ue, $e.id], e.changed();
        }, "ppp-release-pick");
        Fe.setAttribute("aria-pressed", String(Pe >= 0)), Fe.append(me("i", Pe >= 0 ? String(Pe + 1) : "+"), me("b", $e.title), me("span", _e === "error" ? "could not play" : `${$e.artist ? $e.artist + " · " : ""}#${$e.id}`, _e === "error" ? "ppp-warn" : "")), ft.append(ve, Ac(Ge || "", Ge === "" ? "♪" : "", ""), Fe), Q.append(ft);
      }
      O.push(Q), R.more && O.push(me("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !L.value && ue.length && (L.value = ((ee = R.songs.find(($e) => $e.id === ue[0])) == null ? void 0 : ee.artist) || "");
      const he = ue.length === 0 ? "release" : ue.length === 1 ? "single" : ue.length <= 6 ? "EP" : "album", lt = un(ue.length ? `Sign and release this ${he} · ${ue.length} ${ue.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Ne(z), "primary");
      lt.disabled = !ue.length || !!s, O.push(Oe, L, j), ue.length && O.push(et(R.songs)), O.push(lt);
    }
    if (s && O.push(me("p", s, "ppp-cyan")), i && !a && O.push(me("p", i, /✓/.test(i) ? "ppp-ok" : "ppp-warn")), Me(z), (de == null ? void 0 : de.for) === z && de.list.length) {
      O.push(me("p", "Your releases", "ppp-featured__h"));
      for (const Q of de.list) {
        const he = me("div", "", "ppp-release-row"), lt = me("span", "", "ppp-release-row__t"), $e = BigInt(/^\d{1,12}$/.test(Q.price ?? "") ? Q.price : "0"), Pe = $e > 0n ? ` · ${po($e)} STX · ${(Q.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (lt.append(me("b", Q.title), me("span", `${Ag(Q)} · added by ${Q.added.toLocaleString()} ${Q.added === 1 ? "player" : "players"}${Pe}`)), he.append(lt, lr("release-link:" + Q.id, "Copy link", () => Ct(Q.id), "tiny", e.changed)), n.sales) {
          const _e = un("Price", () => Le(Q.id, "price", $e > 0n ? po($e) : ""), "tiny");
          _e.setAttribute("aria-expanded", String((ye == null ? void 0 : ye.id) === Q.id && ye.what === "price")), he.append(_e);
        }
        if (n.copies && e.copies) {
          const _e = un("Send copies", () => Le(Q.id, "copies"), "tiny");
          _e.setAttribute("aria-expanded", String((ye == null ? void 0 : ye.id) === Q.id && ye.what === "copies")), he.append(_e);
        }
        if (O.push(he), (ye == null ? void 0 : ye.id) !== Q.id) continue;
        const ft = me("div", "", "ppp-release-way");
        if (ye.what === "price" && n.sales) {
          const _e = un("Sign this price", () => void Be(z, Q), "primary");
          _e.disabled = !!s, ft.append(
            me("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            fe,
            _e
          );
        } else ye.what === "copies" && n.copies && e.copies && ft.append(...e.copies(z, { id: Q.id, title: Q.title }));
        ft.childNodes.length && O.push(ft);
      }
    }
    return O;
  }
  return { sync: q, albums: m, banner: N, manage: W, fold: Wt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(R != null && R.songs) && !!e.main()), enabled: () => t === !0 };
}
const Hu = "xtrata.radio.replace.v1", fn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Vs = (e, t, n = "") => {
  const r = fn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, kg = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function fL(e) {
  let n = (() => {
    try {
      const S = JSON.parse(e.store.get(Hu) || "null");
      return S && typeof S.old == "string" ? S : null;
    } catch {
      return null;
    }
  })();
  const r = (S) => {
    n = S, e.store.set(Hu, S ? JSON.stringify(S) : null), e.changed();
  };
  let s = null, i = !1, o = "", a = !1;
  function c(S) {
    i || (s == null ? void 0 : s.for) === S && (s.n !== null || Date.now() - s.at < 3e4) || (i = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(S) + "&limit=1").then(
      (v) => {
        s = { for: S, n: Number.isSafeInteger(v == null ? void 0 : v.total) ? v.total : null, at: Date.now() };
      },
      () => {
        s = { for: S, n: null, at: Date.now() };
      }
    ).finally(() => {
      i = !1, e.changed();
    }));
  }
  const d = () => !!n, h = () => !!(n != null && n.removed);
  function u(S) {
    S.listening && (o = "", r({ old: S.listening }));
  }
  const w = () => {
    o = "", r(null);
  };
  function y(S) {
    var U;
    if (!n) return null;
    n.removed && S.listening === n.old && (n = { old: n.old }, e.store.set(Hu, JSON.stringify(n)));
    const v = [], C = (Y, le) => v.push(fn("p", `Replacing your old player · step ${Y} of 3 · ${le}`, "ppp-cyan")), P = () => Vs("Stop · keep my old player", w, "quiet");
    if (S.listening && S.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      v.push(fn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), S.phrase && !S.backedUp ? v.push(fn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), Vs("Back up my player · 24 words", e.backup, "primary")) : S.backedUp && v.push(fn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const Y = S.passkeyName ? `the one called “${S.passkeyName}”` : "the newest one";
      return v.push(fn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${Y}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), v.push(Vs("Done", w, "quiet")), v;
    }
    if (!S.listening || n.removed)
      return n.removed ? (C(3, "claim your new player"), v.push(fn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), v.push(Vs("Hide this", w, "quiet")), v) : null;
    if (c(n.old), S.step === "locked" || S.step === "intro")
      return C(1, "empty it"), v.push(fn("p", "Unlock your old player so it can be emptied."), Vs("Unlock my old player", e.unlock, "primary"), P()), v;
    const H = e.keepBoth(S), k = (Y) => (C(1, "empty it"), v.push(fn("p", Y, "ppp-warn")), H && v.push(Vs("Keep both players instead", () => {
      w(), H();
    }, "primary")), v.push(P()), v);
    if (S.slot !== 0) return k("An album is open. Go back to your own player first.");
    if ((s == null ? void 0 : s.for) !== n.old)
      return C(1, "empty it"), v.push(fn("p", "Checking what this player has…", "ppp-mute"), P()), v;
    if (s.n === null) return k("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (s.n > 0) return k(`This player has ${s.n === 1 ? "an album" : `${s.n} albums`} of its own. Replacing it would leave ${s.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((U = S.award) == null ? void 0 : U.state) === "claimed" && S.award.holds !== !1) return k("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (S.depositPending || S.entries.some((Y) => ["prepared", "signed", "unknown", "pending"].includes(String(Y.status))))
      return C(1, "empty it"), v.push(fn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), P()), v;
    if (S.balance === void 0)
      return C(1, "empty it"), v.push(fn("p", "Checking what it holds…", "ppp-mute"), P()), v;
    if (S.balance > e.dust(S))
      return C(1, "empty it"), v.push(fn("p", `It holds ${kg(S.balance)} STX. Send it back${S.returnTo ? ` to ${e.who(S.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), S.returnTo || S.gift ? v.push(Vs("Send everything back", e.returnAll, "primary")) : v.push(fn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), v.push(P()), v;
    C(2, "remove it from this device"), v.push(fn("p", S.balance > 0n ? `Empty ✓ (the ${kg(S.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), v.push(fn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const M = Vs(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, o = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (Y) => {
        o = /cancel/i.test((Y == null ? void 0 : Y.message) || "") ? "" : (Y == null ? void 0 : Y.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return M.disabled = a || !!S.busy, v.push(M, P()), o && v.push(fn("p", o, "ppp-warn")), v;
  }
  return { active: d, claiming: h, start: u, stop: w, lines: y };
}
const hL = [
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
function pL(e) {
  for (const [t, n] of hL) if (n.test(e)) return t;
  return null;
}
const hb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), pb = (e) => /Android/.test(e);
function gL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : hb(t) ? "x-safari-" + n.href : pb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const yL = (e) => hb(e) ? "Safari" : pb(e) ? "Chrome" : "your browser", go = "Xtrata Music Wallet", wL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function $g(e, t = (n) => n) {
  var i, o, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((i = e.gate) == null ? void 0 : i.passkeyOnly) || e.linked || ((o = e.others) == null ? void 0 : o.length) ? [{ action: null, label: go, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const d = e.standIn === c && wL.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${go} · ${t(c)}`,
      detail: d ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: go, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: go, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: go, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: go, detail: "Open on this device." });
    }
  return r;
}
const Ou = "xtrata.radio.novice", gb = "xtrata.radio.novice.previewed.v1", Ig = 6 * 6e4;
function mL(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(Ou, r), n = r;
    else {
      if (r === "0")
        return t.set(Ou, null), { on: !1, preview: !1 };
      n = t.get(Ou);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const bL = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Lg = (e) => bL.test(e ?? ""), xL = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, SL = {
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
}, vL = (e, t) => SL[e] ?? t;
function EL(e, t) {
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
const AL = "Make your player once, with Face ID or your fingerprint, and the music starts.", kL = "Checking your player…", Xd = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function yb(e) {
  try {
    const t = JSON.parse(e.get(gb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function $L(e, t) {
  const n = yb(e).filter((r) => r !== t);
  n.push(t), e.set(gb, JSON.stringify(n.slice(-50)));
}
function Du(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...Xd(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : Xd();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > Ig ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > Ig ? { ...e, phase: "done" } : e;
  }
}
const kc = (e) => e.phase === "open" || e.phase === "playing";
function IL(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const LL = [100, 250, 500, 1e3], CL = (e, t = Nr) => BigInt(e) * Sn(t);
function TL(e, t = Nr, n = 0n) {
  const r = as - e - n;
  return r > 0n ? Number(r / Sn(t)) : 0;
}
function BL(e, t = Nr, n = 0n) {
  const r = e === void 0 ? 0 : TL(e, t, n);
  return LL.map((s) => ({ plays: s, stx: CL(s, t), fits: e !== void 0 && s <= r }));
}
const ML = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, NL = (e) => ML[e.unit](e.amount), _t = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Oc = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function _L(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${Oc(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${Oc(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${Oc(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function PL(e) {
  let t = null, n = 0, r = "stx";
  const s = (o) => {
    var c;
    if (o.some((d) => d.plays === n && d.fits)) return;
    const a = o.filter((d) => d.fits);
    n = ((c = a.find((d) => {
      var h;
      return d.plays === ((h = o[1]) == null ? void 0 : h.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function i() {
    var y;
    if (!t) return;
    const o = e.input();
    if (!o) {
      t.close();
      return;
    }
    const a = BL(o.balance, o.fee, o.incoming);
    s(a);
    const c = IL(o.switches);
    (y = c.find((S) => S.id === r)) != null && y.on || (r = "stx");
    const d = [], h = _t("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", d.push(h), d.push(_t("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Oc(o.playsLeft, "play", "plays")} left.`));
    const u = _L(o.done);
    if (u && d.push(_t("p", "ppp-restock__done", u)), o.arriving)
      d.push(_t("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      d.push(_t("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((S) => S.fits))
      d.push(_t("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const S = _t("div", "ppp-restock__packs");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How many plays");
      for (const P of a) {
        const H = _t("button", "ppp-restock__pack" + (P.plays === n ? " is-on" : ""));
        H.type = "button", H.disabled = !P.fits, H.setAttribute("aria-pressed", String(P.plays === n)), H.append(_t("b", "", P.plays.toLocaleString()), _t("span", "", "plays")), H.onclick = () => {
          n = P.plays, i();
        }, S.append(H);
      }
      d.push(S);
      const v = _t("div", "ppp-restock__ways");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How to pay");
      for (const P of c) {
        const H = _t("button", "ppp-restock__way" + (P.id === r ? " is-on" : ""));
        H.type = "button", H.disabled = !P.on, H.setAttribute("aria-pressed", String(P.id === r)), H.append(_t("b", "", P.label), _t("span", "", P.on ? P.blurb : "Soon")), H.onclick = () => {
          r = P.id, i();
        }, v.append(H);
      }
      d.push(v);
      const C = a.find((P) => P.plays === n);
      if (C && r === "stx") {
        const P = _t("div", "ppp-restock__pay"), H = NL({ unit: "microSTX", amount: C.stx }), k = _t("p", "ppp-restock__amount");
        k.append("Send ", _t("b", "", H), " to your player:"), P.append(k, _t("p", "ppp-addr-full ppp-restock__addr", o.address));
        const M = _t("div", "ppp-restock__row");
        M.append(e.copyButton("restock-address", "Copy address", () => o.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => kr(C.stx), "")), P.append(M), P.append(_t("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${o.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), d.push(P);
      }
    }
    d.push(_t("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = _t("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), d.push(w), t.replaceChildren(...d);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = _t("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const o = t;
      o.addEventListener("close", () => {
        o.remove(), t === o && (t = null);
      }), o.addEventListener("click", (a) => {
        a.target === o && o.close();
      }), document.body.appendChild(o), i(), typeof o.showModal == "function" ? o.showModal() : o.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: i,
    close() {
      t == null || t.close();
    }
  };
}
const ls = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), UL = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function HL(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const i = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(i) || i < 0 || n.has(i)) continue;
    n.add(i);
    const o = t(i, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: i, title: UL(o.title) ? `#${i}` : o.title.trim(), artist: (o.artist || "").trim() });
  }
  return r.sort((s, i) => s.id - i.id);
}
function OL(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = ls(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function DL(e, t, n = "", r = 60) {
  const s = ls(t).split(/\s+/).filter(Boolean), i = ls(n);
  if (!s.length && !i) return { songs: [], total: 0 };
  const o = [];
  for (const a of e) {
    const c = ls(a.artist), d = ls(a.title), h = String(a.id);
    if (i && c !== i) continue;
    let u = 0, w = !0;
    for (const y of s) {
      const S = y.replace(/^#/, "");
      if (d.includes(y)) u += d.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(S) && h === S) u += 0;
      else if (c.includes(y)) u += 2;
      else if (/^\d+$/.test(S) && h.startsWith(S)) u += 3;
      else {
        w = !1;
        break;
      }
    }
    w && o.push({ s: a, rank: u });
  }
  return o.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: o.slice(0, r).map((a) => a.s), total: o.length };
}
const or = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Cg = 12;
function FL(e, t) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const a = or("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = or("div", "hint"), d = or("div", "find-artists"), h = or("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const u = or("div", "likesTools");
  u.append(a), e.replaceChildren(u, c, d, h), a.oninput = () => {
    s = a.value, y();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", y(), t.load().then((S) => {
      n = S, r = "ready", y();
    }, () => {
      r = "failed", y();
    }));
  }
  function y() {
    const S = t.locked();
    if (a.disabled = S, S) {
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", d.replaceChildren(), h.replaceChildren();
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
      const M = or("button", "", "Try again");
      M.type = "button", M.onclick = () => {
        r = "idle", w();
      }, c.append(M), d.replaceChildren(), h.replaceChildren();
      return;
    }
    const v = OL(n), C = o ? v : v.slice(0, Cg), P = (M, U, Y, le = "") => {
      const ne = or("button", "find-chip" + (U ? " is-on" : ""), M);
      return ne.type = "button", ne.setAttribute("aria-pressed", String(U)), le && (ne.title = le), ne.onclick = Y, ne;
    };
    d.replaceChildren(
      ...C.map((M) => P(`${M.name} · ${M.songs}`, ls(M.name) === ls(i), () => {
        i = ls(M.name) === ls(i) ? "" : M.name, y();
      }, `Show ${M.name}’s ${M.songs === 1 ? "song" : `${M.songs} songs`}`)),
      ...v.length > Cg ? [P(o ? "Fewer artists" : `All ${v.length} artists`, !1, () => {
        o = !o, y();
      })] : []
    );
    const H = DL(n, s, i), k = t.current();
    h.replaceChildren(...H.songs.map((M) => {
      var le, ne;
      const U = or("li", "lrow" + (M.id === k ? " now" : "")), Y = or("button", "lt", M.title);
      if (Y.type = "button", Y.title = `Play “${M.title}”${M.artist ? ` by ${M.artist}` : ""}`, Y.onclick = () => t.play(M.id), (le = t.explicit) != null && le.call(t, M.id)) {
        const q = or("span", "exp", "E");
        q.title = "Explicit lyrics: only plays when you choose it", Y.append(" ", q);
      }
      if ((ne = t.liked) != null && ne.call(t, M.id)) {
        const q = or("span", "find-liked", "♥");
        q.title = "You like this song", q.setAttribute("role", "img"), q.setAttribute("aria-label", "Liked"), U.append(Y, q);
      } else U.append(Y);
      return U.append(or("span", "find-by", `${M.artist ? M.artist + " · " : ""}#${M.id}`)), U;
    })), c.textContent = !s.trim() && !i ? `${n.length.toLocaleString()} songs by ${v.length.toLocaleString()} artists. Search, or pick an artist.` : H.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : H.total > H.songs.length ? `Showing ${H.songs.length} of ${H.total.toLocaleString()}. Type more to narrow it down.` : `${H.total} ${H.total === 1 ? "song" : "songs"}${i ? ` by ${i}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
const ma = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], $c = (e) => typeof e == "string" && ma.some((t) => t.id === e), Ic = (e) => ma.find((t) => t.id === e), jL = (e) => ma.find((t) => e >= t.min) ?? ma[ma.length - 1];
function RL(e, t = Nr) {
  return jL(e <= Kt ? 0 : Number((e - Kt) / Sn(t)));
}
const Tg = (e, t, n) => uf(hf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), Bg = document.getElementById("ppp");
Bg && zL(Bg);
function zL(e) {
  var te;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Gb(), s = (l) => e.querySelector(l), i = s(".ppp-frame");
  let o = null;
  const a = async (l, p) => {
    const g = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, c = x5({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var g;
      const p = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((g = p == null ? void 0 : p.find((f) => f.listening === l)) == null ? void 0 : g.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), o.referrerPolicy = "no-referrer";
      const p = new Promise((X, se) => {
        o.addEventListener("load", () => X(), { once: !0 }), setTimeout(() => se(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = l + "/", i.replaceChildren(o), await p;
      const g = new Pb({ walletOrigin: l, frame: o, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), T = (X, se) => f.has(X) ? g.request(X, se) : Promise.race([
        g.request(X, se),
        new Promise((oe, Ee) => setTimeout(() => Ee(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await T("listening.status"), { request: T };
    },
    chain: {
      verify: Q6,
      balance: t5,
      account: e5,
      owner: n5,
      broadcast: r5,
      transaction: s5,
      confirmedNonce: async (l) => {
        const p = await ei(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => ku({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, g) => new Promise((f, T) => K0({
      recipient: p,
      amount: g.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new Fu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (X) => f(X.txId || ""),
      onCancel: () => T(new Error("Deposit cancelled. Nothing was sent.")),
      onError: T
    })),
    validate: i5,
    tabLock: (l) => new Promise((p) => {
      const g = navigator.locks;
      if (!(g != null && g.request)) {
        p(!0);
        return;
      }
      g.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (f) => {
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
    changed: () => rt(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, g;
      return S.funder(l, () => d5(l, ei), !!((g = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && g.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const p = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), g = p == null ? void 0 : p.gift;
      if (!g) return null;
      if (typeof g.returnTo != "string" || typeof g.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: g.returnTo, from: typeof g.from == "string" ? g.from : null, source: String(g.source ?? ""), amount: String(g.amount ?? "0"), treasury: g.treasury, state: g.state === "sending" ? "sending" : "arrived", player: g.player ?? null };
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
      const g = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: p }) });
      if (typeof (g == null ? void 0 : g.record) != "string" || typeof (g == null ? void 0 : g.signature) != "string" || !Number.isSafeInteger(g == null ? void 0 : g.cls) || !Number.isSafeInteger(g == null ? void 0 : g.number) || !Number.isSafeInteger(g == null ? void 0 : g.plays)) throw new Error("Unreadable award note.");
      return { cls: g.cls, number: g.number, plays: g.plays, record: g.record, signature: g.signature, name: typeof g.name == "string" ? g.name : null };
    },
    history: (l, p) => p5(l, (g) => ei(g), p),
    likesChanged: () => {
      var l, p;
      (p = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || p.call(l);
    },
    likeState: async (l, p) => {
      const g = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(p) })), f = Array.isArray(g == null ? void 0 : g.rows) ? g.rows.find((T) => (T == null ? void 0 : T.id) === p) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((T) => typeof T == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: p } })),
    nameOf: (l) => tt(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), d = (l, p, g, f, T, X) => new Promise((se, oe) => K0({
    recipient: f,
    amount: T.toString(),
    memo: X,
    stxAddress: g,
    network: new Fu(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Ee) => se(Ee.txId || ""),
    onCancel: () => oe(new Error(p)),
    onError: oe
  })), h = (l) => S.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, u = (l) => h(l) && l.canForget ? () => {
    w.start(l), rt(c.snapshot());
  } : null, w = fL({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => Ce(l),
    changed: () => rt(c.snapshot()),
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
  }), y = () => ({ quick: !!S.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), S = vI({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, g, f) => d("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, g, f),
    sign: (l, p) => ku({ ...p, network: "mainnet", stxAddress: l }),
    giftSent: (l, p) => c.giftSent(l, p),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, p;
      return (p = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : p.batchDays;
    },
    claimNew: (l) => h(l),
    replaceOld: (l) => u(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, p, g, f) => {
      v.invalidate(), await c.albumArriving(l, p, g, f);
    } },
    who: (l) => Ce(l),
    changed: () => rt(c.snapshot()),
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
  }), v = MI({
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
    changed: () => rt(c.snapshot())
  }), C = {
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
  }, P = mL(location.search, C);
  P.on && (document.documentElement.dataset.novice = P.preview ? "preview" : "1");
  const H = (l) => P.on && l.solo, k = P.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), M = k ? document.getElementById("album") : null, U = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, Y = M ? vg(M, U) : null, le = dL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, p) => ku({ ...p, network: "mainnet", stxAddress: l }),
    signShelf: (l, p) => c.signShelf(l, p),
    pay: (l, p, g, f) => d("Xtrata Music · album", "Payment cancelled. Nothing was sent.", l, p, g, f),
    copies: (l, p) => {
      var g;
      return S.copies(l, p, ((g = c.snapshot().gate) == null ? void 0 : g.radioUrl) ?? null);
    },
    player: () => {
      const l = c.snapshot(), p = l.slot === 0 ? l.listening : l.root;
      return { address: p, unlocked: !!p && ["ready", "fund", "over", "link"].includes(l.step) };
    },
    open: (l) => Fe(l, !0),
    who: (l) => Ce(l),
    art: { song: (l, p) => p && fh(String(l)) || bg(String(l)), cover: (l) => Hc(l) },
    audition: ZI({
      changed: () => rt(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => rt(c.snapshot()),
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
    const l = new Set($e.map((p) => p.id));
    return [...$e, ...le.albums().filter((p) => !l.has(p.id))];
  }, q = M ? nL(M) : null, m = "xtrata.radio.award.later.v1";
  let I = "ready", N = !1, _ = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(m) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), W = !1;
  const R = "xtrata.radio.tier.v1";
  let ue = (() => {
    const l = C.get(R);
    return $c(l) ? Ic(l) : null;
  })();
  const de = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function Oe(l) {
    var T;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let X = null;
      try {
        X = l.gift && !l.gift.player && l.gift.drop === "players" ? RL(BigInt(l.gift.amount)) : null;
      } catch {
        X = null;
      }
      ((T = l.award) == null ? void 0 : T.state) === "claimed" && l.award.holds === !1 && (X = null), ((X == null ? void 0 : X.id) ?? null) !== ((ue == null ? void 0 : ue.id) ?? null) && (ue = X, C.set(R, X ? X.id : null));
    }
    const p = document.documentElement;
    ue ? p.dataset.tier = ue.id : delete p.dataset.tier;
    const g = document.querySelector("#ppp .ppp-head h3");
    if (!g) return;
    let f = g.querySelector(".ppp-tier");
    if (!ue) {
      f == null || f.remove();
      return;
    }
    f || (f = E("span", "", "ppp-tier"), g.append(f)), f.dataset.tier = ue.id, f.textContent = `${ue.mark} ${ue.name.toUpperCase()} PLAYER`, f.title = `A ${ue.name} player from the Xtrata Music giveaway`;
  }
  const L = P.on && M ? jI(M) : null, j = Date.now();
  let fe = !1, ye = null, Le = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const Be = () => {
    Le = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    rt(c.snapshot());
  }, Ct = (l, p) => {
    var T;
    if (!L || p || Le) return null;
    if (!l.gate || l.step === "loading" || (fe = !0), !fe) return Date.now() - j < 1e4 ? "checking" : null;
    if (!H(l) || w.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return S.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((T = l.gift) != null && T.player) && !l.entries.some((X) => X.kind === "play");
    return l.step === "fund" && f ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (ye === "arriving" || ye === "landed") ? "landed" : l.step === "loading" && ye !== "checking" ? ye : null;
  };
  let He = !1;
  function Me(l, p, g = [], f) {
    if (!L) return;
    const T = f !== void 0 ? f : Ct(l, p);
    if (ye = T, delete document.documentElement.dataset.noviceBoot, !T) {
      L.render(null, p);
      return;
    }
    const X = [...g];
    T === "arriving" && l.arrival && X.push(Zr(l.arrival)), l.step === "unsupported" ? X.push(E("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && X.push(E("p", l.error, "ppp-warn"));
    const se = T === "gift" ? S.incomingStarter() : null;
    se && !He && l.step === "intro" && !l.busy && !l.armed && !l.error && !We && (He = !0, c.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), L.render({
      mode: T,
      status: X,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !We,
      plays: se ? se.plays : T === "landed" ? l.playsLeft : null,
      from: (se == null ? void 0 : se.from) ?? null,
      tier: ue,
      mystery: de,
      albums: T === "landed" ? $e.map((oe) => ({ title: oe.title, by: oe.subtitle, cover: Hc(oe.cover), run: () => {
        Be(), Fe(oe, !0);
      } })) : [],
      claimNew: T === "back" ? h(l) : null,
      replaceOld: T === "back" ? u(l) : null,
      start: () => void c.create(y()),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => jt(),
      full: () => {
        var x, B, F;
        const oe = window.XtrataRadio, Ee = T === "landed" && !((B = (x = oe == null ? void 0 : oe.getState) == null ? void 0 : x.call(oe)) != null && B.playing);
        Be(), Ee && ((F = oe == null ? void 0 : oe.playPause) == null || F.call(oe));
      }
    });
  }
  L && setTimeout(() => {
    fe || rt(c.snapshot());
  }, 10100), lh(() => {
    (L != null && L.showing() || document.documentElement.dataset.asking || le.wantsArt()) && rt(c.snapshot());
  });
  const qt = PL({
    input: () => {
      var T, X, se, oe;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (T = l.likeFunds) == null ? void 0 : T.balance };
      if (!p.address) return null;
      const g = l.slot === 0 ? l.entries : [], f = g.filter((Ee) => Ee.kind === "play" && Ee.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : D(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((X = l.gate) == null ? void 0 : X.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((se = l.gate) == null ? void 0 : se.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Ee) => Ee.recipient)).size, likes: g.filter((Ee) => Ee.kind === "like" && Ee.status === "confirmed" && Ee.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((oe = l.likeFunds) != null && oe.pending)
      };
    },
    copyButton: (l, p, g, f) => lr(l, p, g, f, () => {
      rt(c.snapshot());
    })
  }), jt = () => {
    if (!c.snapshot().unproven) {
      qt.open();
      return;
    }
    c.prove().then((l) => {
      l && qt.open();
    });
  }, et = document.getElementById("albumList"), Wt = et ? vg(et, U, { list: !0 }) : null, gt = "xtrata.radio.album.last.v1", z = () => {
    try {
      const l = JSON.parse(localStorage.getItem(gt) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let O = "";
  const ee = (l) => {
    const p = JSON.stringify(l);
    if (p !== O) {
      O = p;
      try {
        localStorage.setItem(gt, p);
      } catch {
      }
    }
  };
  let Q = null;
  window.XtrataRadioLikeHandler = (l) => {
    var g;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (g = c.snapshot().likeFunds) != null && g.album && (Dn = !0), ps();
    const p = An(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let he;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const lt = (l) => {
    var g, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== he && (he = p, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let $e = [], Pe = 0, ft = !1, _e = null;
  const ve = (l) => {
    var p, g;
    ft || !((g = (p = l.gate) == null ? void 0 : p.gifts) != null && g.enabled) || Date.now() - Pe < 6e4 || (Pe = Date.now(), a("/radio/gift/featured").then((f) => {
      $e = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((T) => T && typeof T.id == "string" && typeof T.title == "string" && Array.isArray(T.tracks) && T.tracks.length > 0).slice(0, 6), ft = !0, $e.length && rt(c.snapshot());
    }).catch(() => {
    }));
  }, Ge = (l) => {
    var p;
    return _e && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? _e : null;
  }, Fe = (l, p = !1) => {
    var f, T;
    _e = l, rt(c.snapshot());
    const g = l && p ? Tr(l)[0] : null;
    g && ((T = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || T.call(f, g.id));
  };
  let Se = Xd(), Lt = null;
  const pn = (l) => {
    const p = P.preview && !We && l.step === "intro" ? S.incomingAlbum() : null;
    return p ? (Se = Du(Se, { kind: "offer", album: p.player.id, already: yb(C).includes(p.player.id) }), kc(Se) ? p.player : null) : (Se = Du(Se, { kind: "withdraw" }), null);
  }, En = (l) => {
    const p = Se.phase;
    Se = Du(Se, l), Se.phase !== p && (Se.album && (Se.phase === "playing" || Se.phase === "done") && $L(C, Se.album), rt(c.snapshot()));
  };
  setInterval(() => {
    Se.phase === "playing" && En({ kind: "tick", at: Date.now() });
  }, 5e3);
  let yt = "", gn, Qt = !1, en = !1;
  const Bn = (l, p) => {
    var F, J, be, Re, Tt, bt, br, wn;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((F = l.giftStop) == null ? void 0 : F.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, T = Lt, X = f ? H(l) ? vL(f.reason, f.text) : f.text : null, se = T ? null : X ?? (t && (!((J = l.gate) != null && J.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    se && se !== gn && (g.setGiftStop(se), gn = se);
    const oe = l.step === "off" || l.step === "elsewhere" ? null : ((be = l.gift) == null ? void 0 : be.player) ?? T ?? Ge(l) ?? null, Ee = oe ? oe.id + ":" + oe.cover + ":" + oe.tracks.map((_r) => _r.id).join(",") : "";
    Ee !== yt && (g.setGiftPlayer(oe ? { id: oe.id, title: oe.title, subtitle: oe.subtitle, tracks: Tr(oe).map((_r) => _r.id), hidden: ((Re = bI(oe)) == null ? void 0 : Re.id) ?? null, cover: oe.cover } : null), yt = Ee), se !== gn && (g.setGiftStop(se), gn = se);
    const x = (f == null ? void 0 : f.reason) === "arriving";
    x !== en && ((Tt = g.setGiftWait) == null || Tt.call(g, x), en = x);
    const B = !!oe && (!!T || !!((bt = l.albumLock) != null && bt.locked));
    B !== Qt && ((br = g.setGiftLock) == null || br.call(g, B), Qt = B), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((wn = g.forgetWallets) == null || wn.call(g));
  };
  let Dn = !1;
  const tr = /* @__PURE__ */ new Map(), tn = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let g = tr.get(l.listening);
    return g === void 0 && (g = Date.now(), tr.set(l.listening, g)), Date.now() - g < dl ? g : null;
  }, hr = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && tr.has(l.listening), A = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", D = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > Kt ? Number((l - Kt) / p) : 0;
  }, K = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), V = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, ie = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, E = (l, p = "", g = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), g && (f.className = g), f;
  }, re = (l, p, g = "") => {
    const f = E("button", l, g);
    return f.type = "button", f.onclick = p, f;
  }, Ie = (l, p) => {
    const g = E("a", l);
    return g.href = p, g.target = "_blank", g.rel = "noopener", g;
  };
  let De = null, pt = location.hash === "#give";
  pt && history.replaceState(null, "", location.pathname + location.search);
  let je = !1;
  const wt = rI((l) => nI({ address: l, network: "mainnet" }), () => rt(c.snapshot())), tt = (l) => wt.get(l), We = pL(navigator.userAgent), Rt = (l, p) => {
    const g = navigator.userAgent, f = yL(g), T = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, X = [E("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${P.on ? "player" : "listening wallet"}${p ? P.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], se = E("div", "", "ppp-open-row"), oe = gL(T, g);
    if (oe) {
      const Ee = E("a", `Open in ${f}`, "primary ppp-open-in");
      Ee.href = oe, Ee.dataset.homeAction = "radio:open-in-browser", se.append(Ee);
    }
    return se.append(lr("copy-page-link", "Copy link", () => T, oe ? "" : "primary", () => rt(c.snapshot()))), X.push(se, E("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), X;
  }, Ce = (l) => tt(l) ?? A(l), mt = (l) => l.slice(0, 2).map(Ce).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), Xt = /* @__PURE__ */ new Map();
  let pr = !1;
  const gr = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), ps = () => {
    pr || (pr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const g = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(g) && Xt.set(g, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      rt(c.snapshot());
    }).catch(() => {
      pr = !1;
    }));
  }, An = (l, p) => {
    const g = Xt.get(l), f = lg(l, [g == null ? void 0 : g.title, p == null ? void 0 : p.title].find((X) => !gr(X)) || ""), T = ag(l, (g == null ? void 0 : g.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: T };
  }, Fn = (l) => {
    const { title: p, artist: g } = An(l.song, l);
    return p ? `“${p}”${g ? ` — ${g}` : ""}` : `Song #${l.song}${g ? ` — ${g}` : ""}`;
  }, Ji = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, nt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function zt(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Mn(l, p, g = "", f) {
    const T = E("dt", l), X = E("dd", p, g);
    return f && X.append(" ", f), [T, X];
  }
  const Nn = document.getElementById("ppp-top"), jn = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? e : i).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, yn = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, kn = () => {
    var p, g;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      yn();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((g = l.giftStop) == null ? void 0 : g.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      jt();
      return;
    }
    jn();
  };
  Nn && (Nn.onclick = kn);
  const an = (l, p, g, f = "") => l.standIn && !l.mainConnected ? re(`Connect ${Ce(l.standIn)} to add STX`, yn, f) : re(p, g, f), gs = (l) => {
    c.useLinked(l).then(() => jn());
  };
  let yr = null;
  const Qi = () => {
    const l = $g(c.snapshot(), Ce);
    return l.length ? yr || (yr = new Promise((p) => {
      var B;
      const g = E("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const T = (F) => {
        f = F, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), yr = null, p(f);
      }), g.addEventListener("click", (F) => {
        F.target === g && T(null);
      });
      const X = (F, J, be, Re, Tt = !1) => {
        const bt = E("button", "", "ppp-connect__opt " + be);
        return bt.type = "button", bt.disabled = Tt, bt.onclick = Re, bt.append(E("b", F), E("span", J)), bt;
      }, se = E("h2", "Connect", "ppp-connect__title");
      se.id = "ppp-connect-title";
      const oe = l.map((F) => X(F.label, F.detail, "is-music", () => {
        if (T("music"), F.action === "linked" && F.main) {
          gs(F.main);
          return;
        }
        const J = $g(c.snapshot(), Ce).find((be) => be.action !== "linked");
        (J == null ? void 0 : J.action) === "create" ? c.create() : (J == null ? void 0 : J.action) === "unlock" && c.unlock(), jn();
      }, !!F.disabled)), Ee = X("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => T("stacks")), x = re("Cancel", () => T(null), "quiet ppp-connect__cancel");
      g.append(se, ...oe, Ee, x), document.body.appendChild(g), g.showModal(), (B = oe.find((F) => !F.disabled)) == null || B.focus();
    }), yr) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Qi;
  function eo(l) {
    if (!Nn) return;
    const p = (f, T, X) => {
      Nn.hidden = !1, Nn.className = "ppp-top" + (T ? " is-" + T : ""), Nn.replaceChildren(E("span", "", "dot"), document.createTextNode(f)), Nn.title = X;
    }, g = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Nn.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Nn.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${Ce(l.linked)}`, "warn", `This device's listening wallet belongs to ${Ce(l.linked)}. Connect that wallet to pay artists or like songs.`);
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
        return l.payingOn && g > 0 && !l.giftStop ? p(`${g.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : p("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Zt = document.getElementById("pppNudge"), si = document.getElementById("onair");
  (te = Zt == null ? void 0 : Zt.querySelector("button")) == null || te.addEventListener("click", () => kn());
  const ii = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Rn = {
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
  function qo(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, T = l.step === "elsewhere" && !t, X = g || f || T ? "" : ii[l.step] ?? "", se = g ? "on" : T ? "free" : X ? "off" : "";
    se ? document.documentElement.dataset.ppp = se : delete document.documentElement.dataset.ppp, si && (si.hidden = !se || se === "free", si.querySelector(".onair-sub").textContent = g ? `${p.toLocaleString()} plays left` : "Plays off"), Zt && (Zt.hidden = se !== "off" && se !== "free", Zt.classList.toggle("is-free", se === "free"), se === "free" ? (Zt.querySelector(".nudge-t").textContent = "You’re on the free player", Zt.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Zt.querySelector("button").textContent = "Get a player") : se === "off" && (Zt.querySelector(".nudge-t").textContent = X, Zt.querySelector(".nudge-s").textContent = H(l) ? l.step === "intro" ? AL : "" : "This radio requires a funded listening wallet with music support on.", Zt.querySelector("button").textContent = Rn[l.step] ?? "Start"));
  }
  let ys = "";
  function oi(l) {
    const p = E("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append(E("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append(E("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = E("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = ys, g.oninput = () => {
      ys = g.value;
    };
    const f = re(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(g.value), ys = "";
    }, "tiny");
    return p.append(g, " ", f), l.returnToKind === "chosen" && p.append(" ", re("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const ai = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function ci() {
    const l = E("p", ai + " ", "ppp-mute");
    return l.append(Ie("Xverse", "https://www.xverse.app/download"), " · ", Ie("Leather", "https://leather.io/install-extension")), l;
  }
  let nr = "";
  const li = (l) => {
    const p = document.documentElement, g = l.solo && !l.main ? l.listening ? A(l.listening) : "new" : "", f = k5() ? "1" : "", T = l.standIn && !l.mainConnected ? Ce(l.standIn) : "";
    `${g}|${f}|${T}` !== nr && (nr = `${g}|${f}|${T}`, g ? p.dataset.pppSolo = g : delete p.dataset.pppSolo, T ? p.dataset.pppAs = T : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => rt(c.snapshot()), l);
  function ui(l, p = "") {
    const g = E("div", "", "ppp-topup"), f = ws(l);
    g.append(E("span", "Add plays from My player: ", "ppp-mute"));
    for (const T of Uc) {
      const X = re(`+${T.toLocaleString()}`, () => void c.topUpAlbum(T), p);
      X.disabled = f === void 0 || f < T || l.depositPending || !!l.busy, g.append(X);
    }
    return f !== void 0 && f < Uc[0] && g.append(E("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const ws = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const g = p - Kt - 6000n;
    return g > 0n ? Number(g / l.playCost) : 0;
  };
  function to(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (Dn = !1), p.low && !Dn) return [];
    const g = E("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const T = E("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && T.append(Ie("View", ie(p.txid))), g.append(T), [g];
    }
    g.append(E("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append(E("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append(E("p", p.address, "ppp-addr-full"));
    const f = E("div", "", "ppp-open-row");
    if (f.append(lr("copy-likes-address", "Copy address", () => p.address, "primary", () => rt(c.snapshot()))), p.main && !l.solo) {
      const T = as - (p.balance ?? 0n);
      T > 0n && f.append(an(l, `Pay ${kr(T)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return g.append(f), g.append(E("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const Zr = (l) => {
    const p = E("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const g = E("p", "", "ppp-wait-t"), f = E("div", "", "ppp-wait-track");
    return f.append(E("div", "", "ppp-wait-fill")), p.append(g, f), di(p), p;
  };
  function di(l) {
    const p = Number(l.dataset.since), g = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), T = l.querySelector(".ppp-wait-fill"), X = l.querySelector(".ppp-wait-t");
    if (f < g) {
      const se = Math.ceil((g - f) / 1e3);
      T.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", X.textContent = `Your plays are arriving… usually about a minute · ${se}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      T.style.width = "", X.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let ms = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      ms = 0;
      return;
    }
    l.forEach(di), ++ms % 10 === 0 && rt(c.snapshot());
  }, 1e3);
  let bs = null;
  function Wo(l) {
    if (l.step === "loading" && bs !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!S.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    g !== bs && (bs = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function rt(l) {
    var xh, Sh, vh, Eh, Ah, kh, $h, Ih, Lh, Ch, Th, Bh, Mh, Nh, _h, Ph, Uh, Hh;
    if (le.sync(), Q && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Z = Q;
      Q = null, l.root === Z.root && l.slot !== Z.slot && c.openAlbum(Z.slot);
    }
    const p = S.inProgress(l), g = tn(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : g !== null ? { ...l, depositPending: !0, arrival: { since: g, graceMs: dl } } : l, T = f.error === fl;
    if (lt(), ve(l), Oe(l), Lt = pn(l), Bn(l, f), Wo(f), li(f), !p && S.inProgress(l)) return;
    if (eo(f), qo(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? P.on ? kL : "Checking your listening wallet…" : P.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      Me(f, !1);
      return;
    }
    const [X, se] = zt(f), oe = s(".ppp-state");
    oe.textContent = X, oe.className = "ppp-state" + (se ? " ppp-state--" + se : ""), oe.hidden = !X;
    const Ee = !!f.busy || f.armed, x = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Ee || !["intro", "loading"].includes(f.step));
    i.hidden = !x, i.classList.toggle("ppp-frame--rest", !Ee && !je);
    const B = s(".ppp-frame-label");
    B.hidden = !0;
    const F = S5(f) ?? De;
    De = F;
    const J = "xtrata.radio.ppp.heard.v1", be = (() => {
      try {
        return localStorage.getItem(J) === "1";
      } catch {
        return !1;
      }
    })();
    if (!be && f.entries.some((Z) => Z.kind === "play"))
      try {
        localStorage.setItem(J, "1");
      } catch {
      }
    const Re = be || f.slot > 0 && ((((xh = f.likeFunds) == null ? void 0 : xh.balance) ?? 0n) > 0n || v.count() > 1), Tt = H(f), bt = !Tt && E5({ ...f, heard: Re }, F);
    s(".ppp-badge").hidden = !bt;
    const br = s(".ppp-steps"), wn = s(".ppp-stage");
    br.hidden = wn.hidden = !bt, F && bt && (br.replaceChildren(...Gd(f.solo).map((Z, pe) => {
      const Ue = E("li", "", pe < F.at ? "done" : pe === F.at ? F.blocked ? "now blocked" : "now" : "");
      return Ue.append(E("span", pe < F.at ? "✓" : String(pe + 1), "n"), Z), pe === F.at && Ue.setAttribute("aria-current", "step"), Ue;
    })), wn.textContent = F.caption, wn.className = "ppp-stage " + (F.at >= Gd(f.solo).length ? "ppp-ok" : F.blocked ? "ppp-bad" : "ppp-cyan"));
    const _r = s(".ppp-facts"), Pn = [];
    f.main && ((Sh = f.gate) != null && Sh.here) && !f.solo && Pn.push(...Mn("Your wallet", Ce(f.main), "ppp-addr-short"));
    const Zo = () => {
      if (!f.listening) return;
      const Z = lr("copy-listening", "Copy", () => f.listening || "", "tiny", () => rt(c.snapshot()));
      Pn.push(...Mn(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", A(f.listening), "ppp-addr-short", Z));
    };
    if (f.linked || Zo(), f.listening && f.step !== "intro")
      if (f.linked)
        Pn.push(...Mn("Credited to", `${Ce(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Zo();
      else if (f.solo) {
        f.creditedTo && Pn.push(...Mn("Credited to", `${Ce(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${Ce(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Pn.push(...Mn("Returns go to", f.gift ? Z : f.returnTo && !tt(f.returnTo) ? Z.replace(A(f.returnTo), f.returnTo) : Z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Pn.push(...Mn("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((vh = f.gate) != null && vh.here)) {
      const Z = f.linkedListening.map((pe) => A(pe) + (pe === f.listening ? " (this one)" : "")).join(", ");
      Pn.push(...Mn(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Pn.push(...Mn("Balance", `${kr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Z));
    }
    const es = f.entries.find((Z) => Z.kind === "play");
    es && ps(), es && Pn.push(...Mn("Last paid song", `${Fn(es)} → ${Ce(es.recipient)}`, Ji[es.status] || "")), _r.replaceChildren(...Pn), _r.hidden = !Pn.length;
    const ke = [], xt = [], $t = [], zn = [], hh = Sn(BigInt(((Eh = f.gate) == null ? void 0 : Eh.limits.playFee) ?? "300")), ph = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${kr(ll)} STX to the song holder, plus a ${kr(hh - ll)} STX network fee.`, gh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (ke.push(E("p", "Pay artists as you listen.")), (Ah = f.gate) != null && Ah.radioUrl) {
          const pe = E("p");
          pe.append(Ie("Open the pay-per-play radio →", f.gate.radioUrl)), ke.push(pe);
        }
        xt.push(E("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const pe = [f.linked, ...f.others];
          ke.push(E("p", pe.length > 1 ? `This device has listening wallets for ${mt(pe)}.` : `This device has a listening wallet for ${Ce(f.linked)}.`)), xt.push(E("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), pe.slice(0, 3).forEach((Ue, at) => $t.push(re(`Open ${Ce(Ue)}`, () => gs(Ue), at === 0 ? "primary" : "")));
        } else
          ke.push(E("p", "Connect your wallet to pay artists as you listen.")), xt.push(E("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        ke.push(E("p", `This device's listening wallet belongs to ${Ce(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), xt.push(E("p", `You are connected as ${Ce(f.main)}. Switch to the linked wallet to continue listening.`)), xt.push(E("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), $t.push(re("Switch wallet", yn, "primary"));
        break;
      case "not-invited":
        ke.push(E("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        ke.push(E("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ke.push(E("p", "Every play counts for the song’s owner, on-chain.")), xt.push(E("p", ph)), xt.push(E("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), xt.push(E("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (ke.push(E("p", `This device already has a listening wallet for ${mt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), xt.push(E("p", `Otherwise, set up a new listening wallet for ${Ce(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && xt.push(E("p", `This is the listening wallet for ${Ce(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && xt.push(E("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Z = S.liveGift();
        $t.push(re(Z ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${Ce(f.main)}` : "Start listening", () => void c.create(w.claiming() ? { another: !0 } : void 0), "primary")), !Z && !f.solo && f.main && f.others.length && $t.push(re("Switch wallet", yn)), !Z && f.solo && $t.push(re("I have a Stacks wallet", yn)), $t.push(re("I already have a listening wallet", () => void c.unlock(!0))), Z && $t.push(re("Not now", () => S.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (ke.push(E("p", "Locked.", "ppp-mute")), $t.push(re("Unlock", () => void c.unlock(), "primary"))), f.standIn ? zn.push(re("Use a different listening wallet", () => void Qi().then((pe) => {
          pe === "stacks" && yn();
        }), "quiet")) : zn.push(re("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        ke.push(E("p", `Link to ${Ce(f.main)} · free`)), xt.push(E("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), xt.push(E("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), $t.push(re(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        ke.push(E("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && ke.push(Zr(f.arrival)) : hr(f) ? ke.push(E("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (kh = f.gift) != null && kh.player ? ke.push(E("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? ke.push(E("p", "No plays left · add plays to keep counting", "ppp-bad")) : ke.push(E("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / hh)).toLocaleString()} plays`)), f.entries.length && xt.push(E("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && xt.push(E("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? xt.push(E("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? xt.push(E("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (xt.push(E("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), xt.push(E("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && $t.push(lr("copy-address", "Copy my address", () => f.listening || "", "primary", () => rt(c.snapshot())))) : xt.push(E("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const pe = E("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          pe.append(Ie("View", ie(f.depositTxid))), ke.push(pe);
        } else f.allowance > 0n && !f.solo && !f.depositPending && $t.push(an(f, `Deposit ${kr(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        ke.push(E("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (ke.push(E("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), $t.push(re("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (ke.push(E("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ke.push(oi(f))), (!f.solo || f.returnTo) && $t.push(re("Return excess", () => void c.returnFunds("excess"), "primary"), re("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && (($h = f.giftStop) == null ? void 0 : $h.reason) !== "off") {
          const pe = Math.min(f.session.playsLeft, f.playsLeft);
          ke.push(E("p", `${pe.toLocaleString()} plays left`, "ppp-ok")), xt.push(E("p", ph + " The heart likes or unlikes from this wallet for 0.0002 STX.")), $t.push(re("Switch off", () => void c.switchOff()));
        } else
          ke.push(E("p", "Switch on music support to listen.", "ppp-mute")), $t.push(re("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && ke.push(E("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && ke.push(E("p", "Running low on plays", "ppp-warn")), f.aboveTarget && ke.push(E("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? ke.push(E("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && $t.push(an(f, `Top up ${kr(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const Z = f.step === "fund", pe = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      Z ? $t.unshift(re("Add plays", () => jt(), "primary")) : pe ? $t.push(re("Add plays", () => jt(), "primary")) : f.step === "ready" && zn.push(re("Add plays", () => jt(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && xt.push(E("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && xt.push(oi(f)), xt.push(ci()), f.slot === 0 && f.step === "ready" && f.entries.some((Z) => Z.kind === "play" && Z.status === "confirmed"))) {
      const Z = E("p", "New to Stacks? ", "ppp-mute");
      Z.append(Ie("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ke.push(Z);
    }
    if (f.walletOutdated && xt.push(E("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (ke.push(E("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), $t.push(re("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && zn.push(re(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${Ce(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((Ih = f.gift) != null && Ih.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && zn.push(ui(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && zn.push(re(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && zn.push(re("Lock", () => void c.lock(), "quiet")), x && !Ee && zn.push(re(je ? "Hide listening wallet box" : "Show listening wallet box", () => {
      je = !je, rt(c.snapshot());
    }, "quiet")), [...$t, ...zn].forEach((Z) => Z.disabled = gh), gh && ($t.length = 0), !Tt && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Lh = f.gift) != null && Lh.player)) {
      const Z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", pe = ke.at(0);
      f.step === "ready" && pe ? pe.append(E("span", ` · ${K(f.balance)} STX`, Z)) : ke.push(E("p", `Balance ${K(f.balance)} STX`, Z));
    }
    if (Tt) {
      for (const Ue of [...$t, ...zn]) {
        const at = xL[Ue.textContent ?? ""];
        at && (Ue.textContent = at);
      }
      for (let Ue = ke.length - 1; Ue >= 0; Ue--) Lg(ke[Ue].textContent) && xt.unshift(...ke.splice(Ue, 1));
      for (let Ue = $t.length - 1; Ue >= 0; Ue--) Lg($t[Ue].textContent) && zn.unshift(...$t.splice(Ue, 1));
      const Z = f.entries.some((Ue) => Ue.kind === "play"), pe = EL(f.step, { played: Z, arriving: f.depositPending });
      pe.length && ke.length && pe.shift(), ke.push(...pe.map((Ue) => E("p", Ue, "ppp-mute")));
    }
    if ((Ch = f.gift) != null && Ch.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Z = E("p", "", "ppp-gift");
      Z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Z.append(" · ", f.gift.player.subtitle);
      const pe = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? E("span", " · plays on their way", "ppp-warn") : E("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      pe && Z.append(pe);
      const Ue = (Th = ke.at(0)) == null ? void 0 : Th.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Ue && /STX/.test(Ue.textContent ?? "") && Ue.remove(), ke.unshift(Z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          ke.splice(1, 0, E("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), ui(f, "primary"));
        else {
          const at = E("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          at.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), at.append(Ie("Xverse", "https://www.xverse.app/download"), " and ", Ie("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ke.splice(1, 0, at);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Z = f.returnPlan, pe = E("div", "", "ppp-pick");
      pe.append(E("p", Z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Ue = E("ul", "", "ppp-gift-list");
      Z.steps.forEach((at, xr) => {
        const Gn = at.kind === "gift" ? "the unused gift" : at.kind === "deposit" ? "what was added to it" : "the rest", cn = E("li");
        cn.append(E("span", `${xr + 1}. ${kr(BigInt(at.send))} STX · ${Gn}`, "t"), E("span", at.to ? ` → ${Ce(at.to)}` : " → choose an address below", at.to ? "ppp-mute" : "ppp-warn")), Ue.append(cn);
      }), pe.append(Ue), Z.kept && pe.append(E("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Z.steps.some((at) => !at.to) && pe.append(oi(f)), pe.append(re(Z.steps.length > 1 ? `Confirm part 1 of ${Z.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), ke.push(pe);
    }
    const vs = Jr(f), ts = k ? vs : null, so = Ct(f, !!ts), mb = so === "gift" || so === "arriving" || so === "new", Vl = ts ? null : w.lines(l), Yl = Vl && !w.claiming() ? Vl : [...Vl ?? [], ...S.banner(l, { bare: !!ts || so === "gift" || so === "arriving" })], Fa = We && (S.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Rt(We, S.pendingCode()) : [];
    ts || (ke.unshift(...Yl), ke.push(...to(f)), ke.unshift(...Fa)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && ke.unshift(E("p", `This is ${Ce(f.creditedTo)}'s listening wallet. Plays and likes count for ${Ce(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...ke);
    const Xl = document.querySelector(".ppp-switch");
    if (Xl) {
      const Z = v.latest(), pe = f.slot > 0, Ue = ["fund", "ready", "over"].includes(f.step) && (pe || !!Z);
      if (Xl.hidden = !Ue, Ue) {
        const at = (cn, za, Ga, eu) => {
          const oo = re("", eu, "ppp-tab");
          return oo.setAttribute("aria-pressed", String(Ga)), oo.append(E("span", cn, "tt"), E("span", za === void 0 ? "…" : `${D(za).toLocaleString()} plays`, "ts")), oo.disabled = !!f.busy, oo;
        }, xr = pe ? ((Mh = (Bh = f.gift) == null ? void 0 : Bh.player) == null ? void 0 : Mh.title) ?? "Album" : Z.title, Gn = re("View all albums" + (v.count() > 1 ? ` (${v.count()})` : ""), () => {
          const cn = document.querySelector(".ppp-shelf");
          cn && (cn.hidden = !1, cn.open = !cn.open, Gn.setAttribute("aria-expanded", String(cn.open)), cn.open && requestAnimationFrame(() => cn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Gn.setAttribute("aria-expanded", String(!!((Nh = document.querySelector(".ppp-shelf")) != null && Nh.open))), Xl.replaceChildren(
          at("🎧 My player", pe ? (_h = f.likeFunds) == null ? void 0 : _h.balance : f.balance, !pe, () => {
            pe && c.openAlbum(0);
          }),
          at("💿 " + xr, pe ? f.balance : void 0, pe, () => {
            !pe && Z && c.openAlbum(Z.slot);
          }),
          Gn
        );
      }
    }
    const ja = v.render(f), Ra = document.querySelector(".ppp-shelf");
    if (Ra) {
      Ra.hidden = !ja;
      const Z = Ra.querySelector("summary");
      Z && (Z.textContent = v.count() > 0 ? `♪ My albums (${v.count()})` : "♪ My albums");
      const pe = Ra.querySelector(".ppp-shelf-body");
      ja && pe && !pe.contains(ja) && pe.replaceChildren(ja);
    }
    const Jo = S.renderFold(l);
    if (s(".ppp-gifts").hidden = !Jo, Jo && !s(".ppp-gift-body").contains(Jo) && s(".ppp-gift-body").replaceChildren(Jo), Jo && pt) {
      pt = !1;
      const Z = s(".ppp-gifts");
      Z.open = !0, requestAnimationFrame(() => Z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const ql = document.querySelector("#ppp .ppp-featured");
    if (ql) {
      const Z = ne(), pe = le.manage(), Ue = (Z.length > 0 || !!pe) && f.slot === 0 && !((Ph = f.gift) != null && Ph.player) && f.step === "ready";
      ql.hidden = !Ue, Ue && ql.replaceChildren(...Z.length ? [E("p", "Albums in your player", "ppp-featured__h")] : [], ...Z.map((at) => {
        const xr = (_e == null ? void 0 : _e.id) === at.id, Gn = re("", () => Fe(xr ? null : at, !xr), "ppp-featured__a" + (xr ? " is-on" : "")), cn = Tr(at).length;
        return Gn.append(E("b", at.title), E("span", xr ? "Playing now · tap to go back to the radio" : `${at.subtitle ? at.subtitle + " · " : ""}${cn} ${cn === 1 ? "song" : "songs"}`)), Gn.setAttribute("aria-pressed", String(xr)), Gn.disabled = !!f.busy, Gn;
      }), ...pe ? [pe] : []);
    }
    const Wl = document.querySelector("#ppp .ppp-release-in-slot");
    if (Wl) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : le.banner();
      Wl.hidden = !Z.length, Wl.replaceChildren(...Z);
    }
    const io = document.querySelector("#ppp .ppp-release");
    if (io) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : le.fold();
      if (io.hidden = !Z, Z) {
        const pe = document.activeElement instanceof HTMLElement && io.contains(document.activeElement) ? document.activeElement : null, Ue = ((Uh = io.querySelector(".ppp-release-songs")) == null ? void 0 : Uh.scrollTop) ?? 0;
        (Hh = io.querySelector(".ppp-release-body")) == null || Hh.replaceChildren(...Z);
        const at = io.querySelector(".ppp-release-songs");
        at && Ue && (at.scrollTop = Ue), pe && pe.isConnected && document.activeElement !== pe && pe.focus({ preventScroll: !0 });
      }
    }
    xs(f);
    const Zl = document.querySelector("#ppp .ppp-yours");
    if (Zl) {
      const Z = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      Zl.hidden = !Z;
      const pe = Zl.querySelector(".ppp-yours-body");
      if (Z && pe && pe.getAttribute("data-for") !== f.listening) {
        pe.setAttribute("data-for", f.listening);
        const Ue = (eu, ...oo) => {
          const Oh = E("details", "", "ppp-yours-item");
          return Oh.append(E("summary", eu), ...oo), Oh;
        }, at = E("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        at.append(E("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const xr = E("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), Gn = E("p");
        Gn.append(Ie("Find a name at BNS One →", "https://bns.one"));
        const cn = E("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), za = E("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Ga = E("p");
        Ga.append(Ie("See the giveaway →", "https://xtrata.xyz/giveaway")), pe.replaceChildren(
          Ue("Give your player a name", at, xr, E("p", f.listening, "ppp-addr-full"), lr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => rt(c.snapshot())), Gn),
          Ue("Link it to a wallet you already have", cn),
          Ue("Bring a friend in", za, Ga)
        );
      }
    }
    s(".ppp-body").replaceChildren(...xt), s(".ppp-actions").replaceChildren(...$t), s(".ppp-actions2").replaceChildren(...zn);
    const Jl = f.busy || f.message || "", yh = s(".ppp-msg"), Ql = Jl && ke.some((Z) => (Z.textContent ?? "").startsWith(Jl.replace(/[.✓\s]+$/, ""))) ? "" : Jl, wh = !Ql && !f.error ? f.notice : T && !Ql ? f.error : "";
    yh.textContent = Ql || wh, yh.classList.toggle("is-warn", !!wh), s(".ppp-err").textContent = T ? "" : f.error;
    const bb = f.entries.filter((Z) => Z.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...bb.slice(0, 5).map((Z) => {
      const pe = E("li"), Ue = Z.status === "confirmed" ? "ok" : Z.status === "failed" ? "bad" : "warn";
      return pe.append(E("span", "", "d " + Ue), E("span", Fn(Z), "t"), E("span", V(Z.created), "ppp-mute")), Z.txid && pe.append(Ie("tx", ie(Z.txid))), pe;
    })), s(".ppp-wallets").hidden = !(_r.childElementCount || zn.length), s(".ppp-more").hidden = !xt.length;
    const mh = s(".ppp-history");
    mh.hidden = !f.entries.length, f.entries.length && ps(), mh.replaceChildren(E("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Z) => {
      const pe = E("div", "", "ppp-row"), Ue = Z.kind === "play" ? [E("span", Fn(Z), "ppp-song"), E("span", ` · ${kr(BigInt(Z.amount))} STX to ${Ce(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [E("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${Fn(Z)}`, "ppp-song"), E("span", ` · for ${f.linked ? Ce(f.linked) : "this listening wallet"}`, "ppp-mute")] : [E("span", `Returned ${kr(BigInt(Z.amount))} STX`, "ppp-song"), E("span", ` to ${Ce(Z.recipient)}`, "ppp-mute")];
      return pe.append(
        E("span", nt[Z.status] || Z.status, "ppp-status " + (Ji[Z.status] || "")),
        ...Ue,
        E("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && pe.append(Ie("tx ↗", ie(Z.txid))), pe;
    })), Y == null || Y.render(ts ? mr(f, ts, [...Fa, ...Yl]) : null), Me(f, !!ts, mb ? [...Fa, ...Yl] : Fa, so), wr(f, !!ts || !!(L != null && L.showing())), fi(f, ts), qt.isOpen() && qt.refresh(), ro();
    const bh = (vs == null ? void 0 : vs.mode) === "open" ? null : Ge(f);
    Wt == null || Wt.render((vs == null ? void 0 : vs.mode) === "open" ? mr(f, vs, []) : bh ? { ...mr(f, { mode: "open", player: bh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function Jr(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && ee({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = S.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const g = z();
    return g && (l.step === "locked" || Q && l.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const kt = (l, p, g, f, T) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: g, ...T ? { b: T } : {}, p: String(f), s: Tg(J0, p, g) })}`;
  function no(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? N ? "making" : null : p.state === "claimed" ? N && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || _ || l.step === "link" && I !== "have" ? null : I === "making" || I === "yours" ? "ready" : I;
  }
  function wr(l, p) {
    if (!q) return;
    const g = l.award, f = g != null && g.cls && $c(g.cls) ? Ic(g.cls) : null, T = l.slot === 0 ? l.listening : l.root, X = p || !g || !f || !T || g.number === void 0 ? null : no(l);
    if (!X || !g || !f || !T) {
      q.render(null, p);
      return;
    }
    X === "have" && l.linked && !W && (W = !0, c.awardRefresh());
    const se = typeof g.name == "string" && g.name ? g.name : null, oe = [];
    l.error && oe.push(E("p", l.error, "ppp-warn"));
    const Ee = (x) => {
      I = x, x === "name" && (N = !0), rt(c.snapshot());
    };
    q.render({
      screen: X,
      tier: f,
      number: g.number,
      need: g.need ?? 0,
      player: T,
      name: g.name,
      inscription: g.inscription,
      art: X === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : kt(f, g.number, T, g.need ?? 0, se),
      claimLink: g.claimTx ? ie(g.claimTx) : void 0,
      status: oe,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? Ce(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => lr("award-player-address", "Copy my player’s address", () => T, "tiny", () => rt(c.snapshot())),
      go: Ee,
      claim: (x) => {
        N = !0, c.claimAward(x);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var x;
        return (x = document.getElementById("radio-wallet-connect")) == null ? void 0 : x.click();
      },
      link: () => void c.link(),
      later: () => {
        _ = !0;
        try {
          localStorage.setItem(m, String(Date.now()));
        } catch {
        }
        rt(c.snapshot());
      },
      done: () => {
        N = !1, I = "ready", rt(c.snapshot());
      }
    }, p);
  }
  function xs(l) {
    var F;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const g = l.award, f = l.slot === 0 ? l.listening : l.root, T = g != null && g.cls && $c(g.cls) ? Ic(g.cls) : null, X = !!g && !!T && !!f && ["ready", "fund", "over"].includes(l.step) && !(g.state === "unavailable" && g.number === void 0);
    if (p.hidden = !X, !X || !g || !T || !f) {
      p.replaceChildren();
      return;
    }
    const se = JSON.stringify([g, f, !!l.busy]);
    if (p.getAttribute("data-sig") === se) return;
    p.setAttribute("data-sig", se);
    const oe = (J) => {
      const be = E("p", "", "ppp-award__h");
      return be.append(E("b", `${T.mark} Music Hero award`), E("span", J)), be;
    }, Ee = `No. ${String(g.number ?? 0).padStart(4, "0")}`, x = (J) => {
      const be = E("div", "", "ppp-award__art"), Re = document.createElement("iframe");
      return Re.src = J, Re.title = `${T.name} record`, Re.setAttribute("sandbox", "allow-scripts"), Re.setAttribute("loading", "lazy"), be.append(Re), be;
    }, B = [];
    if (g.state === "claimed") {
      if (B.push(oe(`${T.name} record · ${Ee}`)), g.inscription !== void 0 && B.push(x(`/i/${g.inscription}`)), B.push(E("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${T.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const J = E("p");
        J.append(Ie("Open it full screen ↗", `/i/${g.inscription}`)), B.push(J);
      }
      if (g.sendTx) {
        const J = E("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        J.append(Ie("View", ie(g.sendTx))), B.push(J);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const J = E("details", "", "ppp-award__send"), be = document.createElement("input");
        be.type = "text", be.placeholder = "SP… address to send it to", be.autocomplete = "off", be.spellcheck = !1, be.setAttribute("aria-label", "Address to send your record to");
        const Re = re("Send my record…", () => void c.sendAward(be.value), "");
        Re.disabled = !!l.busy, J.append(
          E("summary", "Send this record to someone"),
          E("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          be,
          Re
        ), B.push(J);
      }
    } else if (g.claimTx) {
      B.push(oe(`${T.name} record · ${Ee}`));
      const J = E("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      J.append(Ie("View", ie(g.claimTx))), B.push(J);
    } else if (g.state === "ready") {
      B.push(oe(`${T.name} record · ${Ee}`));
      const J = typeof g.name == "string" && g.name ? g.name : null, be = new URLSearchParams({ n: String(g.number), a: f, ...J ? { b: J } : {}, p: String(g.need), s: Tg(J0, g.number, f) });
      B.push(x(`/awards/${T.id}#${be}`)), B.push(E("p", `Your ${T.name} record is ready. You have paid artists for ${(F = g.need) == null ? void 0 : F.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const Re = E("div", "", "ppp-award__row");
      J ? (B.push(E("p", `Its plaque will carry ${J} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), Re.append(re("Claim my record", () => {
        N = !0, c.claimAward("auto");
      }, "primary"), re("Use my address only", () => {
        N = !0, c.claimAward("none");
      }, "quiet"))) : g.name === null ? (B.push(E("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), Re.append(re("Claim my record", () => {
        N = !0, c.claimAward("none");
      }, "primary"), re("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (B.push(E("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), Re.append(re("Check for a name again", () => void c.awardRefresh(), "primary"), re("Claim with my address only", () => void c.claimAward("none"), "quiet"))), Re.querySelectorAll("button").forEach((Tt) => {
        Tt.disabled = !!l.busy;
      }), B.push(Re, E("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      B.push(oe(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const J = E("div", "", "ppp-award__bar"), be = document.createElement("i");
      be.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, J.append(be);
      const Re = g.need - g.have;
      B.push(J, E("p", `${Re.toLocaleString()} more ${Re === 1 ? "play" : "plays"} and your ${T.name} record is yours to claim.`, "ppp-mute"));
    } else
      B.push(oe(`${T.name} record · ${Ee}`)), B.push(E("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...B);
  }
  function fi(l, p) {
    var oe;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!p && (q != null && q.showing()) && ((oe = l.award) != null && oe.cls) && $c(l.award.cls) && (l.busy || l.armed)) {
      const Ee = Ic(l.award.cls), x = E("span", "", "ppp-skin__t");
      x.append(E("b", `${Ee.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), E("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren(E("span", Ee.mark, "ppp-skin__art ppp-skin__art--none"), x);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (g.hidden = !f, !f || !p) {
      g.replaceChildren();
      return;
    }
    const T = Hc(p.player.cover), X = T ? E("img", "", "ppp-skin__art") : E("span", "♪", "ppp-skin__art ppp-skin__art--none");
    T && (X.src = T, X.alt = "");
    const se = E("span", "", "ppp-skin__t");
    se.append(E("b", p.player.title), E("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), g.replaceChildren(X, se);
  }
  function mr(l, p, g) {
    var Ee, x, B, F, J;
    const f = !!l.busy || l.armed, T = [...g];
    l.depositPending && l.arrival && T.push(Zr(l.arrival)), l.error ? T.push(E("p", l.error, l.error === fl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? T.push(E("p", l.message, "ppp-cyan")) : l.notice && T.push(E("p", l.notice, "ppp-warn")), p.mode === "open" && Dn && ((Ee = l.likeFunds) != null && Ee.album) && l.likeFunds.low && !l.likeFunds.pending && T.push(E("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let X = "Kept on this device with Face ID or your passkey. No app or account needed.", se = null, oe = null;
    if (p.mode === "locked")
      se = { label: "Continue listening", run: () => {
        Q = z(), c.unlock();
      } }, oe = { label: "Use a different passkey", run: () => {
        Q = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && kc(Se) && Se.album === p.player.id) {
        const be = window.XtrataRadio, Re = Tr(p.player)[0], Tt = Se.phase === "playing";
        se = { label: Tt && !!((B = (x = be == null ? void 0 : be.getState) == null ? void 0 : x.call(be)) != null && B.playing) ? "Pause" : Tt ? "Carry on" : "Play the first song", run: () => {
          var br, wn;
          Tt ? (br = be == null ? void 0 : be.playPause) == null || br.call(be) : Re && ((wn = be == null ? void 0 : be.playToken) == null || wn.call(be, Re.id));
        } }, oe = { label: "Make my player and hear it all", run: () => void c.create() }, X = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const be = Se.phase === "done" && Se.album === p.player.id;
        be && !T.length && T.push(E("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), se = { label: be ? "Keep listening" : "Open album", run: () => void c.create() }, oe = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (se = { label: "Open album", run: () => void c.unlock() }, oe = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? T.push(E("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : T.length || T.push(E("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: p.mode,
      player: p.player,
      from: p.from,
      offered: p.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: p.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: p.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: T,
      primary: se,
      secondary: oe,
      hint: se ? X : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: ws(l),
      topUps: Uc,
      canMake: !!((J = (F = l.gate) == null ? void 0 : F.gifts) != null && J.admin)
    };
  }
  const rr = document.getElementById("findBox"), Ss = document.getElementById("findBody"), Qr = rr && Ss ? FL(Ss, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => HL(l == null ? void 0 : l.tracks, (p, g) => ({ title: lg(p, gr(g.title) ? "" : g.title), artist: ag(p, g.artist || "") }))),
    play: (l) => {
      var p, g;
      (g = (p = window.XtrataRadio) == null ? void 0 : p.playToken) == null || g.call(p, l);
    },
    current: () => {
      var p, g, f, T;
      const l = Number((T = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.nowPlaying) == null ? void 0 : T.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var p, g;
      return !!((g = (p = window.XtrataRadio) == null ? void 0 : p.isExplicit) != null && g.call(p, l));
    },
    liked: (l) => _n().has(l)
  }) : null;
  rr == null || rr.addEventListener("toggle", () => {
    rr.open && (Qr == null || Qr.load());
  });
  let hi = "";
  const _n = () => {
    var p, g, f;
    const l = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((T) => Number(T == null ? void 0 : T.tokenId)).filter(Number.isSafeInteger) : []);
  }, ro = () => {
    var p, g, f, T, X;
    if (!Qr || !(rr != null && rr.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((X = (T = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : T.nowPlaying) == null ? void 0 : X.tokenId) ?? ""}|${[..._n()].sort((se, oe) => se - oe).join(",")}`;
    l !== hi && (hi = l, Qr.refresh());
  }, b = /* @__PURE__ */ new Map();
  let $ = !1;
  const G = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const g = p == null ? void 0 : p.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && b.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), ro(), kc(Se)) {
        const f = !!(p != null && p.playing);
        En({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== $ && ($ = f, rt(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!G()) {
    const l = setInterval(() => {
      G() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (kc(Se) && En({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      ps();
      const g = An(p.song, b.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const GL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", KL = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), i = /CriOS/.exec(t.userAgent), o = t.userAgent.includes("Mobile");
  return i ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, VL = () => KL() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, YL = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, XL = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', wb = class {
  constructor(e) {
    h4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && Nv(e), this.callback(Tl(e));
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
    var r, s, i, o, a, c, d, h, u, w;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (o = (i = e.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(e)) !== null && o !== void 0 ? o : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (h = (d = e.googlePlayStoreUrl) !== null && d !== void 0 ? d : this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl : (w = (u = this.getBrowserUrl(e)) !== null && u !== void 0 ? u : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = VL(), t = YL(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return ze("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, ze("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), ze("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, ze("div", { class: "flex flex-col space-y-[10px]" }, ze("div", { class: "flex items-center" }, ze("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), ze("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, ze("span", { class: "sr-only" }, "Close popup"), ze("img", { src: GL }))), r ? ze("p", null, "Select the wallet you want to connect to.") : ze("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && ze("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && ze("div", { class: "mt-6" }, ze("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), ze("ul", { class: "space-y-3" }, this.installedProviders.map((i) => ze("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, ze("div", { class: "aspect-square basis-9 overflow-hidden" }, ze("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), ze("div", { class: "flex-1" }, ze("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && ze("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), ze("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && ze("div", { class: "mt-6" }, r ? ze("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : ze("div", { class: "mb-5 flex justify-between" }, ze("p", { class: "text-sm font-medium" }, "Recommended wallets"), ze("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, ze("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, ze("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), ze("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), ze("p", null, "What is a wallet? ", ze("span", { class: "align-text-bottom text-[9px]" }, "↗")))), ze("ul", { class: "space-y-3" }, n.map((i) => ze("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, ze("div", { class: "aspect-square basis-9 overflow-hidden" }, ze("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), ze("div", { class: "flex-1" }, ze("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && ze("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, e, t) && ze("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, e, t), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return X3(this);
  }
};
wb.style = XL;
const qL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: wb
}, Symbol.toStringTag, { value: "Module" }));
