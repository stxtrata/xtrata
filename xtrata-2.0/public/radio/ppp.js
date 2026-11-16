var bb = Object.defineProperty;
var xb = (e, t, n) => t in e ? bb(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Qo = (e, t, n) => xb(e, typeof t != "symbol" ? t + "" : t, n);
var $n = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Tg(e) {
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
      typeof $n < "u" && $n || {}, r = {
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
      function L(m) {
        if (m.slice)
          return m.slice(0);
        var I = new Uint8Array(m.byteLength);
        return I.set(new Uint8Array(m)), I.buffer;
      }
      function P() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = L(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || o(m)) ? this._bodyArrayBuffer = L(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
      function A(m) {
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
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new h(I.headers)), this.method = A(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var F = new AbortController();
            return F.signal;
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
            var _ = N.split("="), W = _.shift().replace(/\+/g, " "), F = _.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(W), decodeURIComponent(F));
          }
        }), I;
      }
      function V(m) {
        var I = new h(), N = m.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(_) {
          return _.indexOf(`
`) === 0 ? _.substr(1, _.length) : _;
        }).forEach(function(_) {
          var W = _.split(":"), F = W.shift().trim();
          if (F) {
            var de = W.join(":").trim();
            try {
              I.append(F, de);
            } catch (fe) {
              console.warn("Response " + fe.message);
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
          var F = new XMLHttpRequest();
          function de() {
            F.abort();
          }
          F.onload = function() {
            var $ = {
              statusText: F.statusText,
              headers: V(F.getAllResponseHeaders() || "")
            };
            W.url.indexOf("file://") === 0 && (F.status < 200 || F.status > 599) ? $.status = 200 : $.status = F.status, $.url = "responseURL" in F ? F.responseURL : $.headers.get("X-Request-URL");
            var j = "response" in F ? F.response : F.responseText;
            setTimeout(function() {
              N(new le(j, $));
            }, 0);
          }, F.onerror = function() {
            setTimeout(function() {
              _(new TypeError("Network request failed"));
            }, 0);
          }, F.ontimeout = function() {
            setTimeout(function() {
              _(new TypeError("Network request timed out"));
            }, 0);
          }, F.onabort = function() {
            setTimeout(function() {
              _(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function fe($) {
            try {
              return $ === "" && n.location.href ? n.location.href : $;
            } catch {
              return $;
            }
          }
          if (F.open(W.method, fe(W.url), !0), W.credentials === "include" ? F.withCredentials = !0 : W.credentials === "omit" && (F.withCredentials = !1), "responseType" in F && (r.blob ? F.responseType = "blob" : r.arrayBuffer && (F.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof h || n.Headers && I.headers instanceof n.Headers)) {
            var He = [];
            Object.getOwnPropertyNames(I.headers).forEach(function($) {
              He.push(a($)), F.setRequestHeader($, c(I.headers[$]));
            }), W.headers.forEach(function($, j) {
              He.indexOf(j) === -1 && F.setRequestHeader(j, $);
            });
          } else
            W.headers.forEach(function($, j) {
              F.setRequestHeader(j, $);
            });
          W.signal && (W.signal.addEventListener("abort", de), F.onreadystatechange = function() {
            F.readyState === 4 && W.signal.removeEventListener("abort", de);
          }), F.send(typeof W._bodyInit > "u" ? null : W._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = h, n.Request = M, n.Response = le), t.Headers = h, t.Request = M, t.Response = le, t.fetch = q, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : $n);
})();
const Sb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function vb(e, t) {
  const n = {};
  return Object.assign(n, Sb, t), await fetch(e, n);
}
function Ab(e) {
  let t = vb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Eb(...e) {
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
var Eo;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Eo || (Eo = {}));
var ki;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ki || (ki = {}));
var Oh;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Oh || (Oh = {}));
const kb = "https://api.mainnet.hiro.so", $b = "https://api.testnet.hiro.so", Ib = "http://localhost:3999", Lb = ["mainnet", "testnet", "devnet", "mocknet"];
let ko = class {
  constructor(t) {
    this.version = ki.Mainnet, this.chainId = Eo.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ki.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Eb();
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
      return new Cb();
    case "devnet":
      return new Tb();
    case "mocknet":
      return new Bg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Lb.join(", ")}`);
  }
};
ko.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : ko.fromName(e);
let Fu = class extends ko {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? kb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ki.Mainnet, this.chainId = Eo.Mainnet;
  }
}, Cb = class extends ko {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? $b,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ki.Testnet, this.chainId = Eo.Testnet;
  }
}, Bg = class extends ko {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Ib,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ki.Testnet, this.chainId = Eo.Testnet;
  }
};
const Tb = Bg, Mg = "xtrata.wallet.bridge.v1", Bb = (e) => typeof e == "object" && e !== null && e.protocol === Mg, Mb = (e) => Bb(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", Nb = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class ea extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const Dh = 12e4;
class _b {
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
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !Mb(t.data)) return;
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
    const s = Nb(), i = { protocol: Mg, kind: "request", id: s, method: t, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ea(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? Dh}ms.`
          )
        );
      }, this.options.timeoutMs ?? Dh);
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
const Pb = ["SP", "SM"], Ub = ["ST", "SN"], Hb = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return Pb.includes(n) ? "mainnet" : Ub.includes(n) ? "testnet" : null;
}, Ob = () => {
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
}, Db = () => typeof window > "u" || !window.localStorage ? Ob() : window.localStorage, tu = "xtrata.v15.1.wallet.session", Fh = "mainnet", Dc = { isConnected: !1 }, Fb = (e) => e.address ? Hb(e.address) ?? e.network : e.network, Ng = (e) => !e.isConnected || !e.address ? { ...Dc } : Fb(e) !== Fh ? { ...Dc } : {
  isConnected: !0,
  address: e.address,
  network: Fh,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, jb = (e) => {
  if (!e)
    return { ...Dc };
  try {
    const t = JSON.parse(e);
    return Ng(t);
  } catch {
    return { ...Dc };
  }
}, Rb = (e) => {
  const t = Ng(e);
  return JSON.stringify(t);
}, zb = (e) => {
  const t = Db();
  return {
    load: () => jb(t.getItem(tu)),
    save: (n) => {
      t.setItem(tu, Rb(n));
    },
    clear: () => {
      t.removeItem(tu);
    }
  };
}, Gb = "https://browser.blockstack.org/auth", Kb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, _g = ["store_write"], Vb = "blockstack-session", Yb = {
  logLevel: "debug"
}, ji = {
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
Object.freeze(ji);
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
class Xb extends Ro {
  constructor(t, n = "") {
    super({ code: ji.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class jh extends Ro {
  constructor(t = "") {
    super({ code: ji.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Ka extends Ro {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: ji.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Rh extends Ro {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: ji.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class ju extends Ro {
  constructor(t) {
    super({ code: ji.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class Pg extends Ro {
  constructor(t) {
    super({ code: ji.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const zh = ["debug", "info", "warn", "error", "none"], Ru = {};
for (let e = 0; e < zh.length; e++) {
  const t = zh[e];
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
    return Ru[Yb.logLevel] <= Ru[t];
  }
}
function qb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Wb() {
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
function Zb() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Jb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Qb(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function qd(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Jb(), s) {
      const i = s[e];
      if (i)
        return i;
    }
  } catch (i) {
    yo.error(`Error getting object '${e}' from global scope '${s}': ${i}`);
  }
  if (t) {
    const i = Qb(s, e.toString(), n);
    throw yo.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Js(e, t) {
  return Wd(xn(e), t);
}
function xn(e) {
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
  if (Un(e, Uint8Array))
    return BigInt(`0x${Ce(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function e1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Gh(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Ba(e, t = 8) {
  return (typeof e == "bigint" ? e : xn(e)).toString(16).padStart(t * 2, "0");
}
function ml(e) {
  return parseInt(e, 16);
}
function Wd(e, t = 16) {
  const n = Ba(e, t);
  return dt(n);
}
function t1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function n1(e, t) {
  return e & BigInt(1) << t;
}
function zu(e) {
  return r1(BigInt(`0x${Ce(e)}`), BigInt(e.byteLength * 8));
}
function r1(e, t) {
  return n1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const s1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ce(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += s1[n];
  return t;
}
function dt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    t[n] = i;
  }
  return t;
}
function Ri(e) {
  return new TextEncoder().encode(e);
}
function Ma(e) {
  return new TextDecoder().decode(e);
}
function i1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function o1(e) {
  return String.fromCharCode.apply(null, e);
}
function a1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Kh(e) {
  if (e.some(a1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function jr(...e) {
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
function qt(e) {
  return jr(...e.map((t) => typeof t == "number" ? Kh([t]) : t instanceof Array ? Kh(t) : t));
}
function Un(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Ug = "https://api.mainnet.hiro.so", Hg = "https://api.testnet.hiro.so", Og = "http://localhost:3999", c1 = "https://hub.blockstack.org", l1 = 33, ru = 32;
function u1(e) {
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
  const t = typeof e == "string" ? dt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function d1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function f1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function h1(e, t) {
  return e[t];
}
function p1(e, t, n = 0) {
  return e[n] = t, e;
}
function g1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function $i(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const y1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function w1(e, t) {
  const n = {};
  return Object.assign(n, y1, t), await fetch(e, n);
}
function m1(e) {
  let t = w1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function b1(...e) {
  const { fetchLib: t, middlewares: n } = m1(e);
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
class Dg {
  constructor(t = _g.slice(), n = ((a) => (a = qd("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Gb) {
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
function x1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Fg(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function S1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Gu(e.outputLen), Gu(e.blockLen);
}
function v1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function A1(e, t) {
  Fg(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const yi = {
  number: Gu,
  bool: x1,
  bytes: Fg,
  hash: S1,
  exists: v1,
  output: A1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const su = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Tr = (e, t) => e << 32 - t | e >>> t, E1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!E1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function k1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Jd(e) {
  if (typeof e == "string" && (e = k1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let jg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function zi(e) {
  const t = (r) => e().update(Jd(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Rg = class extends jg {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, yi.hash(t);
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
    return yi.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    yi.exists(this), yi.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const bl = (e, t, n) => new Rg(e, t).update(n).digest();
bl.create = (e, t) => new Rg(e, t);
function $1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
let Qd = class extends jg {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = su(this.buffer);
  }
  update(t) {
    yi.exists(this);
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
    yi.exists(this), yi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    $1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const I1 = (e, t, n) => e & t ^ ~e & n, L1 = (e, t, n) => e & t ^ e & n ^ t & n, C1 = new Uint32Array([
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
]), xs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ss = new Uint32Array(64);
let zg = class extends Qd {
  constructor() {
    super(64, 32, 8, !1), this.A = xs[0] | 0, this.B = xs[1] | 0, this.C = xs[2] | 0, this.D = xs[3] | 0, this.E = xs[4] | 0, this.F = xs[5] | 0, this.G = xs[6] | 0, this.H = xs[7] | 0;
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
      Ss[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Ss[u - 15], y = Ss[u - 2], S = Tr(w, 7) ^ Tr(w, 18) ^ w >>> 3, v = Tr(y, 17) ^ Tr(y, 19) ^ y >>> 10;
      Ss[u] = v + Ss[u - 7] + S + Ss[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Tr(a, 6) ^ Tr(a, 11) ^ Tr(a, 25), y = h + w + I1(a, c, d) + C1[u] + Ss[u] | 0, v = (Tr(r, 2) ^ Tr(r, 13) ^ Tr(r, 22)) + L1(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Ss.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, T1 = class extends zg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const $o = zi(() => new zg());
zi(() => new T1());
const B1 = {}, Gg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: B1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const at = BigInt(0), Mt = BigInt(1), Ys = BigInt(2), da = BigInt(3), Vh = BigInt(8), xt = Object.freeze({
  a: at,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Mt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Yh = (e, t) => (e + t / Ys) / t, Va = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = xt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Mt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Yh(i * e, t), c = Yh(-r * e, t);
    let d = ge(e - a * n - c * s, t), h = ge(-a * r - c * i, t);
    const u = d > o, w = h > o;
    if (u && (d = t - d), w && (h = t - h), d > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: u, k1: d, k2neg: w, k2: h };
  }
}, Ar = 32, Ii = 32, Kg = 32, Fc = Ar + 1, jc = 2 * Ar + 1;
function Xh(e) {
  const { a: t, b: n } = xt, r = ge(e * e), s = ge(r * e);
  return ge(s + t * e + n);
}
const Ya = xt.a === at;
class ef extends Error {
  constructor(t) {
    super(t);
  }
}
function qh(e) {
  if (!(e instanceof ht))
    throw new TypeError("JacobianPoint expected");
}
class ht {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof We))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(We.ZERO) ? ht.ZERO : new ht(t.x, t.y, Mt);
  }
  static toAffineBatch(t) {
    const n = U1(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return ht.toAffineBatch(t).map(ht.fromAffine);
  }
  equals(t) {
    qh(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = t, c = ge(s * s), d = ge(a * a), h = ge(n * d), u = ge(i * c), w = ge(ge(r * a) * d), y = ge(ge(o * s) * c);
    return h === u && w === y;
  }
  negate() {
    return new ht(this.x, ge(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = ge(t * t), i = ge(n * n), o = ge(i * i), a = t + i, c = ge(Ys * (ge(a * a) - s - o)), d = ge(da * s), h = ge(d * d), u = ge(h - Ys * c), w = ge(d * (c - u) - Vh * o), y = ge(Ys * n * r);
    return new ht(u, w, y);
  }
  add(t) {
    qh(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = t;
    if (i === at || o === at)
      return this;
    if (n === at || r === at)
      return t;
    const c = ge(s * s), d = ge(a * a), h = ge(n * d), u = ge(i * c), w = ge(ge(r * a) * d), y = ge(ge(o * s) * c), S = ge(u - h), v = ge(y - w);
    if (S === at)
      return v === at ? this.double() : ht.ZERO;
    const L = ge(S * S), P = ge(S * L), H = ge(h * L), A = ge(v * v - P - Ys * H), M = ge(v * (H - A) - w * P), U = ge(s * a * S);
    return new ht(A, M, U);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = ht.ZERO;
    if (typeof t == "bigint" && t === at)
      return n;
    let r = Jh(t);
    if (r === Mt)
      return this;
    if (!Ya) {
      let u = n, w = this;
      for (; r > at; )
        r & Mt && (u = u.add(w)), w = w.double(), r >>= Mt;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Va.splitScalar(r), c = n, d = n, h = this;
    for (; i > at || a > at; )
      i & Mt && (c = c.add(h)), a & Mt && (d = d.add(h)), h = h.double(), i >>= Mt, a >>= Mt;
    return s && (c = c.negate()), o && (d = d.negate()), d = new ht(ge(d.x * Va.beta), d.y, d.z), c.add(d);
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
    !n && this.equals(ht.BASE) && (n = We.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ku.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ht.normalizeZ(s), Ku.set(n, s)));
    let i = ht.ZERO, o = ht.BASE;
    const a = 1 + (Ya ? 128 / r : 256 / r), c = 2 ** (r - 1), d = BigInt(2 ** r - 1), h = 2 ** r, u = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let S = Number(t & d);
      t >>= u, S > c && (S -= h, t += Mt);
      const v = y, L = y + Math.abs(S) - 1, P = w % 2 !== 0, H = S < 0;
      S === 0 ? o = o.add(Xa(P, s[v])) : i = i.add(Xa(H, s[L]));
    }
    return { p: i, f: o };
  }
  multiply(t, n) {
    let r = Jh(t), s, i;
    if (Ya) {
      const { k1neg: o, k1: a, k2neg: c, k2: d } = Va.splitScalar(r);
      let { p: h, f: u } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(d, n);
      h = Xa(o, h), w = Xa(c, w), w = new ht(ge(w.x * Va.beta), w.y, w.z), s = h.add(w), i = u.add(y);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ht.normalizeZ([s, i])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, i = this.equals(ht.ZERO);
    t == null && (t = i ? Vh : zo(s));
    const o = t, a = ge(o * o), c = ge(a * o), d = ge(n * a), h = ge(r * c), u = ge(s * o);
    if (i)
      return We.ZERO;
    if (u !== Mt)
      throw new Error("invZ was invalid");
    return new We(d, h);
  }
}
ht.BASE = new ht(xt.Gx, xt.Gy, Mt);
ht.ZERO = new ht(at, Mt, at);
function Xa(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Ku = /* @__PURE__ */ new WeakMap();
class We {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Ku.delete(this);
  }
  hasEvenY() {
    return this.y % Ys === at;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = Wn(n ? t : t.subarray(1));
    if (!Lc(r))
      throw new Error("Point is not on curve");
    const s = Xh(r);
    let i = P1(s);
    const o = (i & Mt) === Mt;
    n ? o && (i = ge(-i)) : (t[0] & 1) === 1 !== o && (i = ge(-i));
    const a = new We(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = Wn(t.subarray(1, Ar + 1)), r = Wn(t.subarray(Ar + 1, Ar * 2 + 1)), s = new We(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = Rr(t), r = n.length, s = n[0];
    if (r === Ar)
      return this.fromCompressedHex(n);
    if (r === Fc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === jc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Fc} compressed bytes or ${jc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return We.BASE.multiply(Li(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: i } = Xg(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = tf(Rr(t)), { n: a } = xt, c = r === 2 || r === 3 ? s + a : s, d = zo(c, a), h = ge(-o * d, a), u = ge(i * d, a), w = r & 1 ? "03" : "02", y = We.fromHex(w + Xs(c)), S = We.BASE.multiplyAndAddUnsafe(y, h, u);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(t = !1) {
    return qs(this.toHex(t));
  }
  toHex(t = !1) {
    const n = Xs(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Xs(this.y)}`;
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
    const s = ge(r * r), i = Xh(n);
    if (ge(s - i) !== at)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new We(this.x, ge(-this.y));
  }
  double() {
    return ht.fromAffine(this).double().toAffine();
  }
  add(t) {
    return ht.fromAffine(this).add(ht.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return ht.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = ht.fromAffine(this), i = n === at || n === Mt || this !== We.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ht.fromAffine(t).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ht.ZERO) ? void 0 : a.toAffine();
  }
}
We.BASE = new We(xt.Gx, xt.Gy);
We.ZERO = new We(at, at);
function Wh(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Zh(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Io(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Wn(n), left: e.subarray(t + 2) };
}
function M1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Io(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Zh(e.subarray(2)), { data: r, left: s } = Zh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Io(s)}`);
  return { r: t, s: r };
}
class qn {
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
    return new qn(Rc(s.slice(0, 64)), Rc(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = M1(n ? t : qs(t));
    return new qn(r, s);
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
    const t = xt.n >> Mt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new qn(this.r, ge(-this.s, xt.n)) : this;
  }
  toDERRawBytes() {
    return qs(this.toDERHex());
  }
  toDERHex() {
    const t = Wh(ta(this.s)), n = Wh(ta(this.r)), r = t.length / 2, s = n.length / 2, i = ta(r), o = ta(s);
    return `30${ta(s + r + 4)}02${o}${n}02${i}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return qs(this.toCompactHex());
  }
  toCompactHex() {
    return Xs(this.r) + Xs(this.s);
  }
}
function Ks(...e) {
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
const N1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Io(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += N1[e[n]];
  return t;
}
const _1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Xs(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(at <= e && e < _1))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Lo(e) {
  const t = qs(Xs(e));
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
function qs(e) {
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
function Wn(e) {
  return Rc(Io(e));
}
function Rr(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : qs(e);
}
function Jh(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Co(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ge(e, t = xt.P) {
  const n = e % t;
  return n >= at ? n : t + n;
}
function er(e, t) {
  const { P: n } = xt;
  let r = e;
  for (; t-- > at; )
    r *= r, r %= n;
  return r;
}
function P1(e) {
  const { P: t } = xt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = e * e * e % t, d = c * c * e % t, h = er(d, da) * d % t, u = er(h, da) * d % t, w = er(u, Ys) * c % t, y = er(w, r) * w % t, S = er(y, s) * y % t, v = er(S, o) * S % t, L = er(v, a) * v % t, P = er(L, o) * S % t, H = er(P, da) * d % t, A = er(H, i) * y % t, M = er(A, n) * c % t, U = er(M, Ys);
  if (U * U % t !== e)
    throw new Error("Cannot find square root");
  return U;
}
function zo(e, t = xt.P) {
  if (e === at || t <= at)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ge(e, t), r = t, s = at, i = Mt;
  for (; n !== at; ) {
    const a = r / n, c = r % n, d = s - i * a;
    r = n, n = c, s = i, i = d;
  }
  if (r !== Mt)
    throw new Error("invert: does not exist");
  return ge(s, t);
}
function U1(e, t = xt.P) {
  const n = new Array(e.length), r = e.reduce((i, o, a) => o === at ? i : (n[a] = i, ge(i * o, t)), Mt), s = zo(r, t);
  return e.reduceRight((i, o, a) => o === at ? i : (n[a] = ge(i * n[a], t), ge(i * o, t)), s), n;
}
function H1(e) {
  const t = e.length * 8 - Ii * 8, n = Wn(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function tf(e, t = !1) {
  const n = H1(e);
  if (t)
    return n;
  const { n: r } = xt;
  return n >= r ? n - r : n;
}
let vo, fa;
class Vg {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return zt.hmacSha256(this.k, ...t);
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
    return Ks(...n);
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
    return Ks(...n);
  }
}
function Co(e) {
  return at < e && e < xt.n;
}
function Lc(e) {
  return at < e && e < xt.P;
}
function Yg(e, t, n, r = !0) {
  const { n: s } = xt, i = tf(e, !0);
  if (!Co(i))
    return;
  const o = zo(i, s), a = We.BASE.multiply(i), c = ge(a.x, s);
  if (c === at)
    return;
  const d = ge(o * ge(t + n * c, s), s);
  if (d === at)
    return;
  let h = new qn(c, d), u = (a.x === h.r ? 0 : 2) | Number(a.y & Mt);
  return r && h.hasHighS() && (h = h.normalizeS(), u ^= 1), { sig: h, recovery: u };
}
function Li(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Ii)
      throw new Error("Expected 32 bytes of private key");
    t = Rc(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Ii)
      throw new Error("Expected 32 bytes of private key");
    t = Wn(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Co(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function nf(e) {
  return e instanceof We ? (e.assertValidity(), e) : We.fromHex(e);
}
function Xg(e) {
  if (e instanceof qn)
    return e.assertValidity(), e;
  try {
    return qn.fromDER(e);
  } catch {
    return qn.fromCompact(e);
  }
}
function Na(e, t = !1) {
  return We.fromPrivateKey(e).toRawBytes(t);
}
function O1(e, t, n, r = !1) {
  return We.fromSignature(e, t, n).toRawBytes(r);
}
function Qh(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Fc || r === jc : n ? r === Fc * 2 || r === jc * 2 : e instanceof We;
}
function rf(e, t, n = !1) {
  if (Qh(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Qh(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = nf(t);
  return r.assertValidity(), r.multiply(Li(e)).toRawBytes(n);
}
function qg(e) {
  const t = e.length > Ar ? e.slice(0, Ar) : e;
  return Wn(t);
}
function D1(e) {
  const t = qg(e), n = ge(t, xt.n);
  return Wg(n < at ? t : n);
}
function Wg(e) {
  return Lo(e);
}
function Zg(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = Rr(e), s = Li(t), i = [Wg(s), D1(r)];
  if (n != null) {
    n === !0 && (n = zt.randomBytes(Ar));
    const c = Rr(n);
    if (c.length !== Ar)
      throw new Error(`sign: Expected ${Ar} bytes of extra data`);
    i.push(c);
  }
  const o = Ks(...i), a = qg(r);
  return { seed: o, m: a, d: s };
}
function Jg(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, t), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function F1(e, t, n = {}) {
  const { seed: r, m: s, d: i } = Zg(e, t, n.extraEntropy), o = new Vg(Kg, Ii);
  await o.reseed(r);
  let a;
  for (; !(a = Yg(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Jg(a, n);
}
function xl(e, t, n = {}) {
  const { seed: r, m: s, d: i } = Zg(e, t, n.extraEntropy), o = new Vg(Kg, Ii);
  o.reseedSync(r);
  let a;
  for (; !(a = Yg(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Jg(a, n);
}
const j1 = { strict: !0 };
function R1(e, t, n, r = j1) {
  let s;
  try {
    s = Xg(e), t = Rr(t);
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
  const { n: d } = xt, h = zo(o, d), u = ge(a * h, d), w = ge(i * h, d), y = We.BASE.multiplyAndAddUnsafe(c, u, w);
  return y ? ge(y.x, d) === i : !1;
}
function zc(e) {
  return ge(Wn(e), xt.n);
}
class To {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = Rr(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Wn(n.subarray(0, 32)), s = Wn(n.subarray(32, 64));
    return new To(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Lc(t) || !Co(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Xs(this.r) + Xs(this.s);
  }
  toRawBytes() {
    return qs(this.toHex());
  }
}
function z1(e) {
  return We.fromPrivateKey(e).toRawX();
}
class Qg {
  constructor(t, n, r = zt.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = Rr(t);
    const { x: s, scalar: i } = this.getScalar(Li(n));
    if (this.px = s, this.d = i, this.rand = Rr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = We.fromPrivateKey(t), r = n.hasEvenY() ? t : xt.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Lo(t ^ Wn(n));
  }
  finalizeNonce(t) {
    const n = ge(Wn(t), xt.n);
    if (n === at)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(t, n, r, s) {
    return new To(t.x, ge(n + r * s, xt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, i = zt.taggedHash, o = this.initNonce(n, await i(Gs.aux, s)), { R: a, rx: c, k: d } = this.finalizeNonce(await i(Gs.nonce, o, r, t)), h = zc(await i(Gs.challenge, c, r, t)), u = this.finalizeSig(a, d, h, n);
    return await ny(u, t, r) || this.error(), u;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, i = zt.taggedHashSync, o = this.initNonce(n, i(Gs.aux, s)), { R: a, rx: c, k: d } = this.finalizeNonce(i(Gs.nonce, o, r, t)), h = zc(i(Gs.challenge, c, r, t)), u = this.finalizeSig(a, d, h, n);
    return ry(u, t, r) || this.error(), u;
  }
}
async function G1(e, t, n) {
  return new Qg(e, t, n).calc();
}
function K1(e, t, n) {
  return new Qg(e, t, n).calcSync();
}
function ey(e, t, n) {
  const r = e instanceof To, s = r ? e : To.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: Rr(t),
    P: nf(n)
  };
}
function ty(e, t, n, r) {
  const s = We.BASE.multiplyAndAddUnsafe(t, Li(n), ge(-r, xt.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function ny(e, t, n) {
  try {
    const { r, s, m: i, P: o } = ey(e, t, n), a = zc(await zt.taggedHash(Gs.challenge, Lo(r), o.toRawX(), i));
    return ty(r, o, s, a);
  } catch {
    return !1;
  }
}
function ry(e, t, n) {
  try {
    const { r, s, m: i, P: o } = ey(e, t, n), a = zc(zt.taggedHashSync(Gs.challenge, Lo(r), o.toRawX(), i));
    return ty(r, o, s, a);
  } catch (r) {
    if (r instanceof ef)
      throw r;
    return !1;
  }
}
const V1 = {
  Signature: To,
  getPublicKey: z1,
  sign: G1,
  verify: ny,
  signSync: K1,
  verifySync: ry
};
We.BASE._setWindowSize(8);
const zn = {
  node: Gg,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Gs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, qa = {}, zt = {
  bytesToHex: Io,
  hexToBytes: qs,
  concatBytes: Ks,
  mod: ge,
  invert: zo,
  isValidPrivateKey(e) {
    try {
      return Li(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Lo,
  _normalizePrivateKey: Li,
  hashToPrivateKey: (e) => {
    e = Rr(e);
    const t = Ii + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ge(Wn(e), xt.n - Mt) + Mt;
    return Lo(n);
  },
  randomBytes: (e = 32) => {
    if (zn.web)
      return zn.web.getRandomValues(new Uint8Array(e));
    if (zn.node) {
      const { randomBytes: t } = zn.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => zt.hashToPrivateKey(zt.randomBytes(Ii + 8)),
  precompute(e = 8, t = We.BASE) {
    const n = t === We.BASE ? t : new We(t.x, t.y);
    return n._setWindowSize(e), n.multiply(da), n;
  },
  sha256: async (...e) => {
    if (zn.web) {
      const t = await zn.web.subtle.digest("SHA-256", Ks(...e));
      return new Uint8Array(t);
    } else if (zn.node) {
      const { createHash: t } = zn.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (zn.web) {
      const n = await zn.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ks(...t), s = await zn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (zn.node) {
      const { createHmac: n } = zn.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = qa[e];
    if (n === void 0) {
      const r = await zt.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Ks(r, r), qa[e] = n;
    }
    return zt.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof vo != "function")
      throw new ef("sha256Sync is undefined, you need to set it");
    let n = qa[e];
    if (n === void 0) {
      const r = vo(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Ks(r, r), qa[e] = n;
    }
    return vo(n, ...t);
  },
  _JacobianPoint: ht
};
Object.defineProperties(zt, {
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
const Y1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: xt,
  Point: We,
  Signature: qn,
  getPublicKey: Na,
  getSharedSecret: rf,
  recoverPublicKey: O1,
  schnorr: V1,
  sign: F1,
  signSync: xl,
  utils: zt,
  verify: R1
}, Symbol.toStringTag, { value: "Module" }));
var _a = {};
_a.byteLength = J1;
var X1 = _a.toByteArray = e2, q1 = _a.fromByteArray = r2, Pr = [], sr = [], W1 = typeof Uint8Array < "u" ? Uint8Array : Array, iu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ao = 0, Z1 = iu.length; ao < Z1; ++ao)
  Pr[ao] = iu[ao], sr[iu.charCodeAt(ao)] = ao;
sr[45] = 62;
sr[95] = 63;
function sy(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function J1(e) {
  var t = sy(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function Q1(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function e2(e) {
  var t, n = sy(e), r = n[0], s = n[1], i = new W1(Q1(e, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = sr[e.charCodeAt(c)] << 18 | sr[e.charCodeAt(c + 1)] << 12 | sr[e.charCodeAt(c + 2)] << 6 | sr[e.charCodeAt(c + 3)], i[o++] = t >> 16 & 255, i[o++] = t >> 8 & 255, i[o++] = t & 255;
  return s === 2 && (t = sr[e.charCodeAt(c)] << 2 | sr[e.charCodeAt(c + 1)] >> 4, i[o++] = t & 255), s === 1 && (t = sr[e.charCodeAt(c)] << 10 | sr[e.charCodeAt(c + 1)] << 4 | sr[e.charCodeAt(c + 2)] >> 2, i[o++] = t >> 8 & 255, i[o++] = t & 255), i;
}
function t2(e) {
  return Pr[e >> 18 & 63] + Pr[e >> 12 & 63] + Pr[e >> 6 & 63] + Pr[e & 63];
}
function n2(e, t, n) {
  for (var r, s = [], i = t; i < n; i += 3)
    r = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255), s.push(t2(r));
  return s.join("");
}
function r2(e) {
  for (var t, n = e.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(n2(e, o, o + i > a ? a : o + i));
  return r === 1 ? (t = e[n - 1], s.push(
    Pr[t >> 2] + Pr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    Pr[t >> 10] + Pr[t >> 4 & 63] + Pr[t << 2 & 63] + "="
  )), s.join("");
}
function s2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const i2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function o2() {
  if (s2())
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
    throw new Error(i2);
  }
}
class a2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createCipher(t, n, r), o = new Uint8Array(jr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createDecipher(t, n, r), o = new Uint8Array(jr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class c2 {
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
async function iy() {
  const e = await o2();
  return e.name === "subtleCrypto" ? new c2(e.lib) : new a2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function l2(e) {
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
    for (var S = 0, v = 0, L = 0, P = y.length; L !== P && y[L] === 0; )
      L++, S++;
    for (var H = (P - L) * d + 1 >>> 0, A = new Uint8Array(H); L !== P; ) {
      for (var M = y[L], U = 0, V = H - 1; (M !== 0 || U < v) && V !== -1; V--, U++)
        M += 256 * A[V] >>> 0, A[V] = M % o >>> 0, M = M / o >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      v = U, L++;
    }
    for (var le = H - v; le !== H && A[le] === 0; )
      le++;
    for (var ne = a.repeat(S); le < H; ++le)
      ne += e.charAt(A[le]);
    return ne;
  }
  function u(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var S = 0, v = 0, L = 0; y[S] === a; )
      v++, S++;
    for (var P = (y.length - S) * c + 1 >>> 0, H = new Uint8Array(P); y[S]; ) {
      var A = y.charCodeAt(S);
      if (A > 255)
        return;
      var M = t[A];
      if (M === 255)
        return;
      for (var U = 0, V = P - 1; (M !== 0 || U < L) && V !== -1; V--, U++)
        M += o * H[V] >>> 0, H[V] = M % 256 >>> 0, M = M / 256 >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      L = U, S++;
    }
    for (var le = P - L; le !== P && H[le] === 0; )
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
var oy = l2;
const u2 = oy, d2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var f2 = u2(d2);
const h2 = /* @__PURE__ */ Tg(f2), p2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ay = Uint8Array.from({ length: 16 }, (e, t) => t), g2 = ay.map((e) => (9 * e + 5) % 16);
let sf = [ay], of = [g2];
for (let e = 0; e < 4; e++)
  for (let t of [sf, of])
    t.push(t[e].map((n) => p2[n]));
const cy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), y2 = sf.map((e, t) => e.map((n) => cy[t][n])), w2 = of.map((e, t) => e.map((n) => cy[t][n])), m2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), b2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wa = (e, t) => e << t | e >>> 32 - t;
function ep(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Za = new Uint32Array(16);
let x2 = class extends Qd {
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
      const S = 4 - y, v = m2[y], L = b2[y], P = sf[y], H = of[y], A = y2[y], M = w2[y];
      for (let U = 0; U < 16; U++) {
        const V = Wa(r + ep(y, i, a, d) + Za[P[U]] + v, A[U]) + u | 0;
        r = u, u = d, d = Wa(a, 10) | 0, a = i, i = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = Wa(s + ep(S, o, c, h) + Za[H[U]] + L, M[U]) + w | 0;
        s = w, w = h, h = Wa(c, 10) | 0, c = o, o = V;
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
const S2 = zi(() => new x2());
function v2(e) {
  return S2(e);
}
const Ja = BigInt(2 ** 32 - 1), Vu = BigInt(32);
function ly(e, t = !1) {
  return t ? { h: Number(e & Ja), l: Number(e >> Vu & Ja) } : { h: Number(e >> Vu & Ja) | 0, l: Number(e & Ja) | 0 };
}
function A2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = ly(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const E2 = (e, t) => BigInt(e >>> 0) << Vu | BigInt(t >>> 0), k2 = (e, t, n) => e >>> n, $2 = (e, t, n) => e << 32 - n | t >>> n, I2 = (e, t, n) => e >>> n | t << 32 - n, L2 = (e, t, n) => e << 32 - n | t >>> n, C2 = (e, t, n) => e << 64 - n | t >>> n - 32, T2 = (e, t, n) => e >>> n - 32 | t << 64 - n, B2 = (e, t) => t, M2 = (e, t) => e, N2 = (e, t, n) => e << n | t >>> 32 - n, _2 = (e, t, n) => t << n | e >>> 32 - n, P2 = (e, t, n) => t << n - 32 | e >>> 64 - n, U2 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function H2(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const O2 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), D2 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, F2 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), j2 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, R2 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), z2 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, ze = {
  fromBig: ly,
  split: A2,
  toBig: E2,
  shrSH: k2,
  shrSL: $2,
  rotrSH: I2,
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
  add5H: z2,
  add5L: R2
}, [G2, K2] = ze.split([
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
].map((e) => BigInt(e))), vs = new Uint32Array(80), As = new Uint32Array(80);
let Sl = class extends Qd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: L } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      vs[A] = t.getUint32(n), As[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = vs[A - 15] | 0, U = As[A - 15] | 0, V = ze.rotrSH(M, U, 1) ^ ze.rotrSH(M, U, 8) ^ ze.shrSH(M, U, 7), le = ze.rotrSL(M, U, 1) ^ ze.rotrSL(M, U, 8) ^ ze.shrSL(M, U, 7), ne = vs[A - 2] | 0, q = As[A - 2] | 0, m = ze.rotrSH(ne, q, 19) ^ ze.rotrBH(ne, q, 61) ^ ze.shrSH(ne, q, 6), I = ze.rotrSL(ne, q, 19) ^ ze.rotrBL(ne, q, 61) ^ ze.shrSL(ne, q, 6), N = ze.add4L(le, I, As[A - 7], As[A - 16]), _ = ze.add4H(N, V, m, vs[A - 7], vs[A - 16]);
      vs[A] = _ | 0, As[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: L, Hh: P, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const M = ze.rotrSH(u, w, 14) ^ ze.rotrSH(u, w, 18) ^ ze.rotrBH(u, w, 41), U = ze.rotrSL(u, w, 14) ^ ze.rotrSL(u, w, 18) ^ ze.rotrBL(u, w, 41), V = u & y ^ ~u & v, le = w & S ^ ~w & L, ne = ze.add5L(H, U, le, K2[A], As[A]), q = ze.add5H(ne, P, M, V, G2[A], vs[A]), m = ne | 0, I = ze.rotrSH(r, s, 28) ^ ze.rotrBH(r, s, 34) ^ ze.rotrBH(r, s, 39), N = ze.rotrSL(r, s, 28) ^ ze.rotrBL(r, s, 34) ^ ze.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = L | 0, v = y | 0, L = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = ze.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = ze.add3L(m, N, W);
      r = ze.add3H(F, q, I, _), s = F | 0;
    }
    ({ h: r, l: s } = ze.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ze.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ze.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = ze.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = ze.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = ze.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: L } = ze.add(this.Gh | 0, this.Gl | 0, v | 0, L | 0), { h: P, l: H } = ze.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, L, P, H);
  }
  roundClean() {
    vs.fill(0), As.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, V2 = class extends Sl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Y2 = class extends Sl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, X2 = class extends Sl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const q2 = zi(() => new Sl());
zi(() => new V2());
zi(() => new Y2());
zi(() => new X2());
function uy(e) {
  return $o(e);
}
function W2(e) {
  return q2(e);
}
const Z2 = 0;
zt.hmacSha256Sync = (e, ...t) => {
  const n = bl.create($o, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function J2() {
  return Ce(zt.randomPrivateKey());
}
function Q2(e) {
  const t = $o($o(e));
  return h2.encode(jr(e, t).slice(0, e.length + 4));
}
function ex(e, t) {
  return Q2(jr(new Uint8Array([e]), t.slice(0, 20)));
}
function dy(e, t = Z2) {
  const n = typeof e == "string" ? dt(e) : e, r = v2(uy(n));
  return ex(t, r);
}
function fy(e) {
  const t = Zd(e);
  return Ce(Na(t.slice(0, 32), !0));
}
zt.hmacSha256Sync = (e, ...t) => {
  const n = bl.create($o, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var Gc;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(Gc || (Gc = {}));
async function tx(e, t, n) {
  return await (await iy()).encrypt("aes-256-cbc", t, e, n);
}
async function nx(e, t, n) {
  return await (await iy()).decrypt("aes-256-cbc", t, e, n);
}
function hy(e, t) {
  return bl($o, e, t);
}
function rx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function py(e) {
  const t = W2(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function sx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function ix(e) {
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
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !sx(e))
    return t;
  try {
    return We.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function ox(e, t, n, r) {
  const s = ix(e);
  if (!s.result)
    throw s;
  const i = zt.randomPrivateKey(), o = Na(i, !0);
  let a = rf(i, e, !0);
  a = a.slice(1);
  const c = py(a), d = zt.randomBytes(16), h = await tx(d, c.encryptionKey, t), u = jr(d, o, h), w = hy(c.hmacKey, u);
  let y;
  if (!r || r === "hex")
    y = Ce(h);
  else if (r === "base64")
    y = q1(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: Ce(d),
    ephemeralPK: Ce(o),
    cipherText: y,
    mac: Ce(w),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function gy(e, t) {
  if (!t.ephemeralPK)
    throw new Rh("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = rf(e, n, !0);
  r = r.slice(1);
  const s = py(r), i = dt(t.iv);
  let o;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    o = dt(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    o = X1(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = jr(i, dt(n), o), c = hy(s.hmacKey, a), d = dt(t.mac);
  if (!rx(d, c))
    throw new Rh("Decryption failed: failure in MAC check");
  const h = await nx(i, s.encryptionKey, o);
  return t.wasString ? Ma(h) : h;
}
function ax(e, t) {
  const n = typeof t == "string" ? Ri(t) : t, r = fy(e), s = uy(n), i = xl(s, e);
  return {
    signature: Ce(i),
    publicKey: r
  };
}
async function cx(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = fy(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", i = typeof e == "string" ? Ri(e) : e, o = await ox(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = ax(r, a), d = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(d);
  }
  return a;
}
function lx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return gy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var dn = {}, Bo = {}, En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
En.decode = En.encode = En.unescape = En.escape = En.pad = void 0;
const yy = _a;
function af(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
En.pad = af;
function wy(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
En.escape = wy;
function my(e) {
  return af(e).replace(/-/g, "+").replace(/_/g, "/");
}
En.unescape = my;
function ux(e) {
  return wy((0, yy.fromByteArray)(new TextEncoder().encode(e)));
}
En.encode = ux;
function dx(e) {
  return new TextDecoder().decode((0, yy.toByteArray)(af(my(e))));
}
En.decode = dx;
var vl = {}, Al = {}, by = {}, xy = {}, El = {};
Object.defineProperty(El, "__esModule", { value: !0 });
El.crypto = void 0;
El.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = i, e.aexists = o, e.aoutput = a, e.u8 = c, e.u32 = d, e.clean = h, e.createView = u, e.rotr = w, e.rotl = y, e.byteSwap = S, e.byteSwap32 = v, e.bytesToHex = H, e.hexToBytes = U, e.asyncLoop = le, e.utf8ToBytes = ne, e.bytesToUtf8 = q, e.toBytes = m, e.kdfInputToBytes = I, e.concatBytes = N, e.checkOpts = _, e.createHasher = F, e.createOptHasher = de, e.createXOFer = fe, e.randomBytes = He;
  const t = El;
  function n($) {
    return $ instanceof Uint8Array || ArrayBuffer.isView($) && $.constructor.name === "Uint8Array";
  }
  function r($) {
    if (!Number.isSafeInteger($) || $ < 0)
      throw new Error("positive integer expected, got " + $);
  }
  function s($, ...j) {
    if (!n($))
      throw new Error("Uint8Array expected");
    if (j.length > 0 && !j.includes($.length))
      throw new Error("Uint8Array expected of length " + j + ", got length=" + $.length);
  }
  function i($) {
    if (typeof $ != "function" || typeof $.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r($.outputLen), r($.blockLen);
  }
  function o($, j = !0) {
    if ($.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (j && $.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a($, j) {
    s($);
    const he = j.outputLen;
    if ($.length < he)
      throw new Error("digestInto() expects output buffer of length at least " + he);
  }
  function c($) {
    return new Uint8Array($.buffer, $.byteOffset, $.byteLength);
  }
  function d($) {
    return new Uint32Array($.buffer, $.byteOffset, Math.floor($.byteLength / 4));
  }
  function h(...$) {
    for (let j = 0; j < $.length; j++)
      $[j].fill(0);
  }
  function u($) {
    return new DataView($.buffer, $.byteOffset, $.byteLength);
  }
  function w($, j) {
    return $ << 32 - j | $ >>> j;
  }
  function y($, j) {
    return $ << j | $ >>> 32 - j >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S($) {
    return $ << 24 & 4278190080 | $ << 8 & 16711680 | $ >>> 8 & 65280 | $ >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? ($) => $ : ($) => S($), e.byteSwapIfBE = e.swap8IfBE;
  function v($) {
    for (let j = 0; j < $.length; j++)
      $[j] = S($[j]);
    return $;
  }
  e.swap32IfBE = e.isLE ? ($) => $ : v;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", P = /* @__PURE__ */ Array.from({ length: 256 }, ($, j) => j.toString(16).padStart(2, "0"));
  function H($) {
    if (s($), L)
      return $.toHex();
    let j = "";
    for (let he = 0; he < $.length; he++)
      j += P[$[he]];
    return j;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function M($) {
    if ($ >= A._0 && $ <= A._9)
      return $ - A._0;
    if ($ >= A.A && $ <= A.F)
      return $ - (A.A - 10);
    if ($ >= A.a && $ <= A.f)
      return $ - (A.a - 10);
  }
  function U($) {
    if (typeof $ != "string")
      throw new Error("hex string expected, got " + typeof $);
    if (L)
      return Uint8Array.fromHex($);
    const j = $.length, he = j / 2;
    if (j % 2)
      throw new Error("hex string expected, got unpadded hex of length " + j);
    const ye = new Uint8Array(he);
    for (let Te = 0, Be = 0; Te < he; Te++, Be += 2) {
      const Ct = M($.charCodeAt(Be)), Ue = M($.charCodeAt(Be + 1));
      if (Ct === void 0 || Ue === void 0) {
        const Me = $[Be] + $[Be + 1];
        throw new Error('hex string expected, got non-hex character "' + Me + '" at index ' + Be);
      }
      ye[Te] = Ct * 16 + Ue;
    }
    return ye;
  }
  const V = async () => {
  };
  e.nextTick = V;
  async function le($, j, he) {
    let ye = Date.now();
    for (let Te = 0; Te < $; Te++) {
      he(Te);
      const Be = Date.now() - ye;
      Be >= 0 && Be < j || (await (0, e.nextTick)(), ye += Be);
    }
  }
  function ne($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function q($) {
    return new TextDecoder().decode($);
  }
  function m($) {
    return typeof $ == "string" && ($ = ne($)), s($), $;
  }
  function I($) {
    return typeof $ == "string" && ($ = ne($)), s($), $;
  }
  function N(...$) {
    let j = 0;
    for (let ye = 0; ye < $.length; ye++) {
      const Te = $[ye];
      s(Te), j += Te.length;
    }
    const he = new Uint8Array(j);
    for (let ye = 0, Te = 0; ye < $.length; ye++) {
      const Be = $[ye];
      he.set(Be, Te), Te += Be.length;
    }
    return he;
  }
  function _($, j) {
    if (j !== void 0 && {}.toString.call(j) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign($, j);
  }
  class W {
  }
  e.Hash = W;
  function F($) {
    const j = (ye) => $().update(m(ye)).digest(), he = $();
    return j.outputLen = he.outputLen, j.blockLen = he.blockLen, j.create = () => $(), j;
  }
  function de($) {
    const j = (ye, Te) => $(Te).update(m(ye)).digest(), he = $({});
    return j.outputLen = he.outputLen, j.blockLen = he.blockLen, j.create = (ye) => $(ye), j;
  }
  function fe($) {
    const j = (ye, Te) => $(Te).update(m(ye)).digest(), he = $({});
    return j.outputLen = he.outputLen, j.blockLen = he.blockLen, j.create = (ye) => $(ye), j;
  }
  e.wrapConstructor = F, e.wrapConstructorWithOpts = de, e.wrapXOFConstructorWithOpts = fe;
  function He($ = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array($));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(xy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = xy;
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
})(by);
const co = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Sy(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Yu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Gi(e, ...t) {
  if (!Sy(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function fx(e) {
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
function vy(e, t) {
  Gi(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function hx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function px(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Kc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Cc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function gr(e, t) {
  return e << 32 - t | e >>> t;
}
function gx(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const cf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function lf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const Ay = cf ? (e) => e : (e) => lf(e), yx = Ay;
function Ey(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = lf(e[t]);
  return e;
}
const wx = cf ? (e) => e : Ey, ky = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", mx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function uf(e) {
  if (Gi(e), ky)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += mx[e[n]];
  return t;
}
const Qr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function tp(e) {
  if (e >= Qr._0 && e <= Qr._9)
    return e - Qr._0;
  if (e >= Qr.A && e <= Qr.F)
    return e - (Qr.A - 10);
  if (e >= Qr.a && e <= Qr.f)
    return e - (Qr.a - 10);
}
function bx(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (ky)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = tp(e.charCodeAt(i)), a = tp(e.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = e[i] + e[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const $y = async () => {
};
async function xx(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < t || (await $y(), r += i);
  }
}
function df(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function Sx(e) {
  return new TextDecoder().decode(e);
}
function Pa(e) {
  return typeof e == "string" && (e = df(e)), Gi(e), e;
}
function vx(e) {
  return typeof e == "string" && (e = df(e)), Gi(e), e;
}
function Ax(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    Gi(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Ex(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let Iy = class {
};
function kl(e) {
  const t = (r) => e().update(Pa(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Ly(e) {
  const t = (r, s) => e(s).update(Pa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function Cy(e) {
  const t = (r, s) => e(s).update(Pa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const kx = kl, $x = Ly, Ix = Cy;
function Lx(e = 32) {
  if (co && typeof co.getRandomValues == "function")
    return co.getRandomValues(new Uint8Array(e));
  if (co && typeof co.randomBytes == "function")
    return Uint8Array.from(co.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const Cx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Iy,
  abytes: Gi,
  aexists: Xu,
  ahash: fx,
  anumber: Yu,
  aoutput: vy,
  asyncLoop: xx,
  byteSwap: lf,
  byteSwap32: Ey,
  byteSwapIfBE: yx,
  bytesToHex: uf,
  bytesToUtf8: Sx,
  checkOpts: Ex,
  clean: Kc,
  concatBytes: Ax,
  createHasher: kl,
  createOptHasher: Ly,
  createView: Cc,
  createXOFer: Cy,
  hexToBytes: bx,
  isBytes: Sy,
  isLE: cf,
  kdfInputToBytes: vx,
  nextTick: $y,
  randomBytes: Lx,
  rotl: gx,
  rotr: gr,
  swap32IfBE: wx,
  swap8IfBE: Ay,
  toBytes: Pa,
  u32: px,
  u8: hx,
  utf8ToBytes: df,
  wrapConstructor: kx,
  wrapConstructorWithOpts: $x,
  wrapXOFConstructorWithOpts: Ix
}, Symbol.toStringTag, { value: "Module" }));
function Tx(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
function Bx(e, t, n) {
  return e & t ^ ~e & n;
}
function Mx(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class Nx extends Iy {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Cc(this.buffer);
  }
  update(t) {
    Xu(this), t = Pa(t), Gi(t);
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
    Xu(this), vy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Kc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Tx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const Es = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ks = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), _x = /* @__PURE__ */ Uint32Array.from([
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
]), $s = /* @__PURE__ */ new Uint32Array(64);
let ff = class extends Nx {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Es[0] | 0, this.B = Es[1] | 0, this.C = Es[2] | 0, this.D = Es[3] | 0, this.E = Es[4] | 0, this.F = Es[5] | 0, this.G = Es[6] | 0, this.H = Es[7] | 0;
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
      $s[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = $s[u - 15], y = $s[u - 2], S = gr(w, 7) ^ gr(w, 18) ^ w >>> 3, v = gr(y, 17) ^ gr(y, 19) ^ y >>> 10;
      $s[u] = v + $s[u - 7] + S + $s[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), y = h + w + Bx(a, c, d) + _x[u] + $s[u] | 0, v = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + Mx(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Kc($s);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Kc(this.buffer);
  }
}, Ty = class extends ff {
  constructor() {
    super(28), this.A = ks[0] | 0, this.B = ks[1] | 0, this.C = ks[2] | 0, this.D = ks[3] | 0, this.E = ks[4] | 0, this.F = ks[5] | 0, this.G = ks[6] | 0, this.H = ks[7] | 0;
  }
};
const Px = /* @__PURE__ */ kl(() => new ff()), Ux = /* @__PURE__ */ kl(() => new Ty()), Hx = ff, hf = Px, Ox = Ty, Dx = Ux, Fx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Ox,
  SHA256: Hx,
  sha224: Dx,
  sha256: hf
}, Symbol.toStringTag, { value: "Module" })), $l = /* @__PURE__ */ wl(Fx), jx = /* @__PURE__ */ wl(Y1);
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
Mo.joseToDer = Mo.derToJose = void 0;
const By = _a, My = En;
function ou(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const Rx = {
  ES256: ou(256),
  ES384: ou(384),
  ES512: ou(521)
};
function Ny(e) {
  const t = Rx[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const Vc = 128, _y = 0, zx = 32, Gx = 16, Kx = 2, Py = Gx | zx | _y << 6, Yc = Kx | _y << 6;
function Uy(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, By.toByteArray)((0, My.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Vx(e, t) {
  const n = Uy(e), r = Ny(t), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Py)
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
  return S.set(n.subarray(u + Math.max(-y, 0), u + h), o), (0, My.escape)((0, By.fromByteArray)(S));
}
Mo.derToJose = Vx;
function np(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= Vc && --r, r;
}
function Yx(e, t) {
  e = Uy(e);
  const n = Ny(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = np(e, 0, n), i = np(e, n, e.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, d = c < Vc, h = new Uint8Array((d ? 2 : 3) + c);
  let u = 0;
  return h[u++] = Py, d ? h[u++] = c : (h[u++] = Vc | 1, h[u++] = c & 255), h[u++] = Yc, h[u++] = o, s < 0 ? (h[u++] = 0, h.set(e.subarray(0, n), u), u += n) : (h.set(e.subarray(s, n), u), u += n - s), h[u++] = Yc, h[u++] = a, i < 0 ? (h[u++] = 0, h.set(e.subarray(n), u)) : h.set(e.subarray(n + i), u), h;
}
Mo.joseToDer = Yx;
var cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
cs.InvalidTokenError = cs.MissingParametersError = void 0;
class Xx extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
cs.MissingParametersError = Xx;
class qx extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
cs.InvalidTokenError = qx;
const Ua = /* @__PURE__ */ wl(Cx);
Object.defineProperty(Al, "__esModule", { value: !0 });
Al.SECP256K1Client = void 0;
const Wx = by, Zx = $l, Tc = jx, rp = Mo, sp = cs, ip = Ua;
Tc.utils.hmacSha256Sync = (e, ...t) => {
  const n = Wx.hmac.create(Zx.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Hy {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, ip.bytesToHex)(Tc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new sp.MissingParametersError("a signing input hash and private key are all required");
    const s = Tc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, ip.bytesToHex)(s);
    if (r === "jose")
      return (0, rp.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, rp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new sp.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Tc.verify(n, t, r, { strict: !1 });
  }
}
Al.SECP256K1Client = Hy;
Hy.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = Al;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(vl);
var Ci = {};
const Jx = /* @__PURE__ */ wl(Gg);
var Qx = $n && $n.__awaiter || function(e, t, n, r) {
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
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.hashSha256Async = Ci.hashSha256 = void 0;
const eS = $l;
function Oy(e) {
  return (0, eS.sha256)(e);
}
Ci.hashSha256 = Oy;
function tS(e) {
  return Qx(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Jx;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Oy(e));
    }
  });
}
Ci.hashSha256Async = tS;
var nS = $n && $n.__awaiter || function(e, t, n, r) {
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
const qu = En, op = vl, rS = cs, ap = Ci;
function Wu(e, t) {
  const n = [], r = qu.encode(JSON.stringify(t));
  n.push(r);
  const s = qu.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function sS(e) {
  return Wu(e, { typ: "JWT", alg: "none" }) + ".";
}
Bo.createUnsecuredToken = sS;
class iS {
  constructor(t, n) {
    if (!(t && n))
      throw new rS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !op.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = op.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), i = Wu(t, s), o = (0, ap.hashSha256)(i);
    return this.createWithSignedHash(t, n, s, i, o);
  }
  signAsync(t, n = !1, r = {}) {
    return nS(this, void 0, void 0, function* () {
      const s = this.header(r), i = Wu(t, s), o = yield (0, ap.hashSha256Async)(i);
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
Bo.TokenSigner = iS;
var Il = {};
Object.defineProperty(Il, "__esModule", { value: !0 });
Il.TokenVerifier = void 0;
const oS = En, cp = vl, aS = cs, Qa = Ci;
class cS {
  constructor(t, n) {
    if (!(t && n))
      throw new aS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !cp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = cp.cryptoClients[t], this.rawPublicKey = n;
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
    const r = [t.header.join("."), oS.encode(t.payload)].join(".");
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
Il.TokenVerifier = cS;
var Ll = {};
Object.defineProperty(Ll, "__esModule", { value: !0 });
Ll.decodeToken = void 0;
const ec = En;
function lS(e) {
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
Ll.decodeToken = lS;
(function(e) {
  var t = $n && $n.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = $n && $n.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && t(s, r, i);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Bo, e), n(Il, e), n(Ll, e), n(cs, e), n(vl, e);
})(dn);
function uS(e) {
  return `did:btc-addr:${e}`;
}
function dS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new jh("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new jh('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function Dy(e) {
  if (e)
    return dS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const fS = "1.4.0";
function hS() {
  return J2();
}
function pS(e, t, n, r = _g.slice(), s, i = qb().getTime(), o = {}) {
  const a = (y) => {
    const S = qd("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Zb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: fS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), d = dn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [d];
  const h = dy(d);
  return c.iss = uS(h), new dn.TokenSigner("ES256k", e).sign(c);
}
async function lp(e, t) {
  const n = Ma(dt(t)), r = JSON.parse(n), s = await gy(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function gS(e) {
  const t = dn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new dn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function yS(e) {
  const t = dn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = Dy(t.iss);
  if (n.length === 1) {
    if (dy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function wS(e) {
  const t = dn.decodeToken(e).payload;
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
function mS(e) {
  const t = dn.decodeToken(e).payload;
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
function bS(e) {
  const t = [
    mS(e),
    wS(e),
    gS(e),
    yS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const up = "1.0.0";
class Ws {
  constructor(t) {
    this.version = up, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== up)
      throw new ju(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new Ws(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Fy {
  constructor(t) {
    if (t) {
      const n = new Ws(t);
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
class dp extends Fy {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new Ws({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Pg("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ws({})), !0;
  }
}
class fp extends Fy {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = Vb, !localStorage.getItem(this.key)) {
      const r = new Ws({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new Pg("No session data was found in localStorage");
    const n = JSON.parse(t);
    return Ws.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ws({})), !0;
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
var is;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(is || (is = {}));
var Or;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Or || (Or = {}));
is.Mainnet;
const jy = {
  chainId: ba.Mainnet,
  transactionVersion: is.Mainnet,
  peerNetworkId: Xc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Or.MainnetSingleSig,
    multiSig: Or.MainnetMultiSig
  },
  client: { baseUrl: Ug }
}, Zu = {
  chainId: ba.Testnet,
  transactionVersion: is.Testnet,
  peerNetworkId: Xc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Or.TestnetSingleSig,
    multiSig: Or.TestnetMultiSig
  },
  client: { baseUrl: Hg }
}, Bc = {
  ...Zu,
  addressVersion: { ...Zu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Og }
}, xS = {
  ...Bc,
  addressVersion: { ...Bc.addressVersion },
  client: { ...Bc.client }
};
function SS(e) {
  switch (e) {
    case "mainnet":
      return jy;
    case "testnet":
      return Zu;
    case "devnet":
      return Bc;
    case "mocknet":
      return xS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Ry(e) {
  return typeof e == "string" ? SS(e) : e;
}
var hp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(hp || (hp = {}));
var pp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(pp || (pp = {}));
var wr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(wr || (wr = {}));
const au = ["onChainOnly", "offChainOnly", "any"];
au[0] + "", wr.OnChainOnly, au[1] + "", wr.OffChainOnly, au[2] + "", wr.Any, wr.OnChainOnly + "", wr.OnChainOnly, wr.OffChainOnly + "", wr.OffChainOnly, wr.Any + "", wr.Any;
var gp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(gp || (gp = {}));
var yp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(yp || (yp = {}));
var wp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(wp || (wp = {}));
var rs;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(rs || (rs = {}));
var mp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(mp || (mp = {}));
var bp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(bp || (bp = {}));
var xp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(xp || (xp = {}));
var Sp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Sp || (Sp = {}));
var vp;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(vp || (vp = {}));
var Ap;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Ap || (Ap = {}));
var Ep;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ep || (Ep = {}));
var kp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(kp || (kp = {}));
var $p;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})($p || ($p = {}));
function Ju(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function vS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function zy(e, ...t) {
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
function ES(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function kS(e, t) {
  zy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const wi = {
  number: Ju,
  bool: vS,
  bytes: zy,
  hash: AS,
  exists: ES,
  output: kS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const cu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Br = (e, t) => e << 32 - t | e >>> t, $S = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!$S)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function IS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function pf(e) {
  if (typeof e == "string" && (e = IS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Gy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ki(e) {
  const t = (r) => e().update(pf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Ky = class extends Gy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, wi.hash(t);
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
const Vy = (e, t, n) => new Ky(e, t).update(n).digest();
Vy.create = (e, t) => new Ky(e, t);
function LS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
let gf = class extends Gy {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = cu(this.buffer);
  }
  update(t) {
    wi.exists(this);
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
    wi.exists(this), wi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    LS(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const CS = (e, t, n) => e & t ^ ~e & n, TS = (e, t, n) => e & t ^ e & n ^ t & n, BS = new Uint32Array([
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
]), Is = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ls = new Uint32Array(64);
let Yy = class extends gf {
  constructor() {
    super(64, 32, 8, !1), this.A = Is[0] | 0, this.B = Is[1] | 0, this.C = Is[2] | 0, this.D = Is[3] | 0, this.E = Is[4] | 0, this.F = Is[5] | 0, this.G = Is[6] | 0, this.H = Is[7] | 0;
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
      Ls[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Ls[u - 15], y = Ls[u - 2], S = Br(w, 7) ^ Br(w, 18) ^ w >>> 3, v = Br(y, 17) ^ Br(y, 19) ^ y >>> 10;
      Ls[u] = v + Ls[u - 7] + S + Ls[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Br(a, 6) ^ Br(a, 11) ^ Br(a, 25), y = h + w + CS(a, c, d) + BS[u] + Ls[u] | 0, v = (Br(r, 2) ^ Br(r, 13) ^ Br(r, 22)) + TS(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, MS = class extends Yy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Xy = Ki(() => new Yy());
Ki(() => new MS());
var Vi = {}, yf = {};
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
        const L = 1 + d, P = v % (1 << L) << 5 - L, H = e.c32[S + P];
        d = L, c.unshift(H);
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
      for (let L = 0; L < v; L += 2)
        S = `00${S}`;
    }
    return S;
  }
  e.c32decode = i;
})(yf);
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.c32checkDecode = Ti.c32checkEncode = void 0;
const Ip = $l, Lp = Ua, ha = yf;
function qy(e) {
  const t = (0, Ip.sha256)((0, Ip.sha256)((0, Lp.hexToBytes)(e)));
  return (0, Lp.bytesToHex)(t.slice(0, 4));
}
function NS(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = qy(`${n}${t}`), s = (0, ha.c32encode)(`${t}${r}`);
  return `${ha.c32[e]}${s}`;
}
Ti.c32checkEncode = NS;
function _S(e) {
  e = (0, ha.c32normalize)(e);
  const t = (0, ha.c32decode)(e.slice(1)), n = e[0], r = ha.c32.indexOf(n), s = t.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), qy(`${i}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Ti.c32checkDecode = _S;
var Wy = {}, No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
No.decode = No.encode = void 0;
const qc = $l, Cp = Ua, Zy = oy, Jy = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function PS(e, t = "00") {
  const n = typeof e == "string" ? (0, Cp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Cp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, qc.sha256)((0, qc.sha256)(new Uint8Array([...r, ...n])));
  return Zy(Jy).encode([...r, ...n, ...s.slice(0, 4)]);
}
No.encode = PS;
function US(e) {
  const t = Zy(Jy).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, qc.sha256)((0, qc.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
No.decode = US;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Ti, n = No, r = Ua;
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
    let L = v.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(S, L);
  }
  e.c32ToB58 = d;
})(Wy);
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
  const n = Ti;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Wy;
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
})(Vi);
function HS(e, t) {
  switch (t = Ry(t ?? jy), e) {
    case rs.P2PKH:
      switch (t.transactionVersion) {
        case is.Mainnet:
          return Or.MainnetSingleSig;
        case is.Testnet:
          return Or.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case rs.P2SH:
    case rs.P2SHNonSequential:
    case rs.P2WPKH:
    case rs.P2WSH:
    case rs.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case is.Mainnet:
          return Or.MainnetMultiSig;
        case is.Testnet:
          return Or.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const OS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Qy = Uint8Array.from({ length: 16 }, (e, t) => t), DS = Qy.map((e) => (9 * e + 5) % 16);
let wf = [Qy], mf = [DS];
for (let e = 0; e < 4; e++)
  for (let t of [wf, mf])
    t.push(t[e].map((n) => OS[n]));
const ew = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), FS = wf.map((e, t) => e.map((n) => ew[t][n])), jS = mf.map((e, t) => e.map((n) => ew[t][n])), RS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), tc = (e, t) => e << t | e >>> 32 - t;
function Tp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const nc = new Uint32Array(16);
let GS = class extends gf {
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
      const S = 4 - y, v = RS[y], L = zS[y], P = wf[y], H = mf[y], A = FS[y], M = jS[y];
      for (let U = 0; U < 16; U++) {
        const V = tc(r + Tp(y, i, a, d) + nc[P[U]] + v, A[U]) + u | 0;
        r = u, u = d, d = tc(a, 10) | 0, a = i, i = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = tc(s + Tp(S, o, c, h) + nc[H[U]] + L, M[U]) + w | 0;
        s = w, w = h, h = tc(c, 10) | 0, c = o, o = V;
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
const KS = Ki(() => new GS()), rc = BigInt(2 ** 32 - 1), Qu = BigInt(32);
function tw(e, t = !1) {
  return t ? { h: Number(e & rc), l: Number(e >> Qu & rc) } : { h: Number(e >> Qu & rc) | 0, l: Number(e & rc) | 0 };
}
function VS(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = tw(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const YS = (e, t) => BigInt(e >>> 0) << Qu | BigInt(t >>> 0), XS = (e, t, n) => e >>> n, qS = (e, t, n) => e << 32 - n | t >>> n, WS = (e, t, n) => e >>> n | t << 32 - n, ZS = (e, t, n) => e << 32 - n | t >>> n, JS = (e, t, n) => e << 64 - n | t >>> n - 32, QS = (e, t, n) => e >>> n - 32 | t << 64 - n, ev = (e, t) => t, tv = (e, t) => e, nv = (e, t, n) => e << n | t >>> 32 - n, rv = (e, t, n) => t << n | e >>> 32 - n, sv = (e, t, n) => t << n - 32 | e >>> 64 - n, iv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function ov(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const av = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), cv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, lv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), uv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, dv = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), fv = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ge = {
  fromBig: tw,
  split: VS,
  toBig: YS,
  shrSH: XS,
  shrSL: qS,
  rotrSH: WS,
  rotrSL: ZS,
  rotrBH: JS,
  rotrBL: QS,
  rotr32H: ev,
  rotr32L: tv,
  rotlSH: nv,
  rotlSL: rv,
  rotlBH: sv,
  rotlBL: iv,
  add: ov,
  add3L: av,
  add3H: cv,
  add4L: lv,
  add4H: uv,
  add5H: fv,
  add5L: dv
}, [hv, pv] = Ge.split([
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
].map((e) => BigInt(e))), Cs = new Uint32Array(80), Ts = new Uint32Array(80);
let Cl = class extends gf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: L } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Cs[A] = t.getUint32(n), Ts[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = Cs[A - 15] | 0, U = Ts[A - 15] | 0, V = Ge.rotrSH(M, U, 1) ^ Ge.rotrSH(M, U, 8) ^ Ge.shrSH(M, U, 7), le = Ge.rotrSL(M, U, 1) ^ Ge.rotrSL(M, U, 8) ^ Ge.shrSL(M, U, 7), ne = Cs[A - 2] | 0, q = Ts[A - 2] | 0, m = Ge.rotrSH(ne, q, 19) ^ Ge.rotrBH(ne, q, 61) ^ Ge.shrSH(ne, q, 6), I = Ge.rotrSL(ne, q, 19) ^ Ge.rotrBL(ne, q, 61) ^ Ge.shrSL(ne, q, 6), N = Ge.add4L(le, I, Ts[A - 7], Ts[A - 16]), _ = Ge.add4H(N, V, m, Cs[A - 7], Cs[A - 16]);
      Cs[A] = _ | 0, Ts[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: L, Hh: P, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const M = Ge.rotrSH(u, w, 14) ^ Ge.rotrSH(u, w, 18) ^ Ge.rotrBH(u, w, 41), U = Ge.rotrSL(u, w, 14) ^ Ge.rotrSL(u, w, 18) ^ Ge.rotrBL(u, w, 41), V = u & y ^ ~u & v, le = w & S ^ ~w & L, ne = Ge.add5L(H, U, le, pv[A], Ts[A]), q = Ge.add5H(ne, P, M, V, hv[A], Cs[A]), m = ne | 0, I = Ge.rotrSH(r, s, 28) ^ Ge.rotrBH(r, s, 34) ^ Ge.rotrBH(r, s, 39), N = Ge.rotrSL(r, s, 28) ^ Ge.rotrBL(r, s, 34) ^ Ge.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = L | 0, v = y | 0, L = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Ge.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = Ge.add3L(m, N, W);
      r = Ge.add3H(F, q, I, _), s = F | 0;
    }
    ({ h: r, l: s } = Ge.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ge.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ge.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = Ge.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = Ge.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Ge.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: L } = Ge.add(this.Gh | 0, this.Gl | 0, v | 0, L | 0), { h: P, l: H } = Ge.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, L, P, H);
  }
  roundClean() {
    Cs.fill(0), Ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, gv = class extends Cl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, yv = class extends Cl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, wv = class extends Cl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ki(() => new Cl());
Ki(() => new gv());
Ki(() => new yv());
Ki(() => new wv());
var Wc = { exports: {} };
Wc.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", d = "[object Error]", h = "[object Function]", u = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", S = "[object Object]", v = "[object Promise]", L = "[object RegExp]", P = "[object Set]", H = "[object String]", A = "[object Symbol]", M = "[object WeakMap]", U = "[object ArrayBuffer]", V = "[object DataView]", le = "[object Float32Array]", ne = "[object Float64Array]", q = "[object Int8Array]", m = "[object Int16Array]", I = "[object Int32Array]", N = "[object Uint8Array]", _ = "[object Uint8ClampedArray]", W = "[object Uint16Array]", F = "[object Uint32Array]", de = /[\\^$.*+?()[\]{}|]/g, fe = /\w*$/, He = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, j = {};
  j[i] = j[o] = j[U] = j[V] = j[a] = j[c] = j[le] = j[ne] = j[q] = j[m] = j[I] = j[w] = j[y] = j[S] = j[L] = j[P] = j[H] = j[A] = j[N] = j[_] = j[W] = j[F] = !0, j[d] = j[h] = j[M] = !1;
  var he = typeof $n == "object" && $n && $n.Object === Object && $n, ye = typeof self == "object" && self && self.Object === Object && self, Te = he || ye || Function("return this")(), Be = t && !t.nodeType && t, Ct = Be && !0 && e && !e.nodeType && e, Ue = Ct && Ct.exports === Be;
  function Me(x, B) {
    return x.set(B[0], B[1]), x;
  }
  function Ne(x, B) {
    return x.add(B), x;
  }
  function Zt(x, B) {
    for (var D = -1, J = x ? x.length : 0; ++D < J && B(x[D], D, x) !== !1; )
      ;
    return x;
  }
  function Gt(x, B) {
    for (var D = -1, J = B.length, xe = x.length; ++D < J; )
      x[xe + D] = B[D];
    return x;
  }
  function Qe(x, B, D, J) {
    for (var xe = -1, De = x ? x.length : 0; ++xe < De; )
      D = B(D, x[xe], xe, x);
    return D;
  }
  function Lt(x, B) {
    for (var D = -1, J = Array(x); ++D < x; )
      J[D] = B(D);
    return J;
  }
  function St(x, B) {
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
    var B = -1, D = Array(x.size);
    return x.forEach(function(J, xe) {
      D[++B] = [xe, J];
    }), D;
  }
  function ae(x, B) {
    return function(D) {
      return x(B(D));
    };
  }
  function Q(x) {
    var B = -1, D = Array(x.size);
    return x.forEach(function(J) {
      D[++B] = J;
    }), D;
  }
  var ue = Array.prototype, et = Function.prototype, $e = Object.prototype, _e = Te["__core-js_shared__"], ct = function() {
    var x = /[^.]+$/.exec(_e && _e.keys && _e.keys.IE_PROTO || "");
    return x ? "Symbol(src)_1." + x : "";
  }(), Le = et.toString, Se = $e.hasOwnProperty, je = $e.toString, Je = RegExp(
    "^" + Le.call(Se).replace(de, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ae = Ue ? Te.Buffer : void 0, Jt = Te.Symbol, rn = Te.Uint8Array, Kt = ae(Object.getPrototypeOf, Object), gt = Object.create, fn = $e.propertyIsEnumerable, Hn = ue.splice, lr = Object.getOwnPropertySymbols, Vr = Ae ? Ae.isBuffer : void 0, k = ae(Object.keys, Object), R = kt(Te, "DataView"), K = kt(Te, "Map"), Y = kt(Te, "Promise"), ee = kt(Te, "Set"), we = kt(Te, "WeakMap"), Oe = kt(Object, "create"), ft = Mn(R), Xe = Mn(K), C = Mn(Y), ce = Mn(ee), tt = Mn(we), it = Jt ? Jt.prototype : void 0, lt = it ? it.valueOf : void 0;
  function yt(x) {
    var B = -1, D = x ? x.length : 0;
    for (this.clear(); ++B < D; ) {
      var J = x[B];
      this.set(J[0], J[1]);
    }
  }
  function Ot() {
    this.__data__ = Oe ? Oe(null) : {};
  }
  function Dt(x) {
    return this.has(x) && delete this.__data__[x];
  }
  function _t(x) {
    var B = this.__data__;
    if (Oe) {
      var D = B[x];
      return D === r ? void 0 : D;
    }
    return Se.call(B, x) ? B[x] : void 0;
  }
  function Yr(x) {
    var B = this.__data__;
    return Oe ? B[x] !== void 0 : Se.call(B, x);
  }
  function Re(x, B) {
    var D = this.__data__;
    return D[x] = Oe && B === void 0 ? r : B, this;
  }
  yt.prototype.clear = Ot, yt.prototype.delete = Dt, yt.prototype.get = _t, yt.prototype.has = Yr, yt.prototype.set = Re;
  function Cn(x) {
    var B = -1, D = x ? x.length : 0;
    for (this.clear(); ++B < D; ) {
      var J = x[B];
      this.set(J[0], J[1]);
    }
  }
  function ti() {
    this.__data__ = [];
  }
  function ni(x) {
    var B = this.__data__, D = Qt(B, x);
    if (D < 0)
      return !1;
    var J = B.length - 1;
    return D == J ? B.pop() : Hn.call(B, D, 1), !0;
  }
  function Zi(x) {
    var B = this.__data__, D = Qt(B, x);
    return D < 0 ? void 0 : B[D][1];
  }
  function ds(x) {
    return Qt(this.__data__, x) > -1;
  }
  function Sn(x, B) {
    var D = this.__data__, J = Qt(D, x);
    return J < 0 ? D.push([x, B]) : D[J][1] = B, this;
  }
  Cn.prototype.clear = ti, Cn.prototype.delete = ni, Cn.prototype.get = Zi, Cn.prototype.has = ds, Cn.prototype.set = Sn;
  function On(x) {
    var B = -1, D = x ? x.length : 0;
    for (this.clear(); ++B < D; ) {
      var J = x[B];
      this.set(J[0], J[1]);
    }
  }
  function Ji() {
    this.__data__ = {
      hash: new yt(),
      map: new (K || Cn)(),
      string: new yt()
    };
  }
  function nt(x) {
    return qr(this, x).delete(x);
  }
  function Vt(x) {
    return qr(this, x).get(x);
  }
  function Tn(x) {
    return qr(this, x).has(x);
  }
  function Bn(x, B) {
    return qr(this, x).set(x, B), this;
  }
  On.prototype.clear = Ji, On.prototype.delete = nt, On.prototype.get = Vt, On.prototype.has = Tn, On.prototype.set = Bn;
  function Dn(x) {
    this.__data__ = new Cn(x);
  }
  function hn() {
    this.__data__ = new Cn();
  }
  function vn(x) {
    return this.__data__.delete(x);
  }
  function sn(x) {
    return this.__data__.get(x);
  }
  function fs(x) {
    return this.__data__.has(x);
  }
  function ur(x, B) {
    var D = this.__data__;
    if (D instanceof Cn) {
      var J = D.__data__;
      if (!K || J.length < n - 1)
        return J.push([x, B]), this;
      D = this.__data__ = new On(J);
    }
    return D.set(x, B), this;
  }
  Dn.prototype.clear = hn, Dn.prototype.delete = vn, Dn.prototype.get = sn, Dn.prototype.has = fs, Dn.prototype.set = ur;
  function Qi(x, B) {
    var D = G(x) || E(x) ? Lt(x.length, String) : [], J = D.length, xe = !!J;
    for (var De in x)
      Se.call(x, De) && !(xe && (De == "length" || Qn(De, J))) && D.push(De);
    return D;
  }
  function eo(x, B, D) {
    var J = x[B];
    (!(Se.call(x, B) && b(J, D)) || D === void 0 && !(B in x)) && (x[B] = D);
  }
  function Qt(x, B) {
    for (var D = x.length; D--; )
      if (b(x[D][0], B))
        return D;
    return -1;
  }
  function ri(x, B) {
    return x && ys(B, re(B), x);
  }
  function si(x, B, D, J, xe, De, Tt) {
    var wt;
    if (J && (wt = De ? J(x, xe, De, Tt) : J(x)), wt !== void 0)
      return wt;
    if (!T(x))
      return x;
    var hr = G(x);
    if (hr) {
      if (wt = ws(x), !B)
        return gs(x, wt);
    } else {
      var pn = dr(x), Cr = pn == h || pn == u;
      if (p(x))
        return ai(x, B);
      if (pn == S || pn == i || Cr && !De) {
        if (z(x))
          return De ? x : {};
        if (wt = di(Cr ? {} : x), !B)
          return Wo(x, ri(wt, x));
      } else {
        if (!j[pn])
          return De ? x : {};
        wt = fr(x, pn, si, B);
      }
    }
    Tt || (Tt = new Dn());
    var Nn = Tt.get(x);
    if (Nn)
      return Nn;
    if (Tt.set(x, wt), !hr)
      var Zo = D ? rt(x) : re(x);
    return Zt(Zo || x, function(Zr, Ie) {
      Zo && (Ie = Zr, Zr = x[Ie]), eo(wt, Ie, si(Zr, B, D, J, Ie, x, Tt));
    }), wt;
  }
  function Fn(x) {
    return T(x) ? gt(x) : {};
  }
  function qo(x, B, D) {
    var J = B(x);
    return G(x) ? J : Gt(J, D(x));
  }
  function hs(x) {
    return je.call(x);
  }
  function ii(x) {
    if (!T(x) || Wr(x))
      return !1;
    var B = g(x) || z(x) ? Je : He;
    return B.test(Mn(x));
  }
  function oi(x) {
    if (!fi(x))
      return k(x);
    var B = [];
    for (var D in Object(x))
      Se.call(x, D) && D != "constructor" && B.push(D);
    return B;
  }
  function ai(x, B) {
    if (B)
      return x.slice();
    var D = new x.constructor(x.length);
    return x.copy(D), D;
  }
  function Jn(x) {
    var B = new x.constructor(x.byteLength);
    return new rn(B).set(new rn(x)), B;
  }
  function ci(x, B) {
    var D = B ? Jn(x.buffer) : x.buffer;
    return new x.constructor(D, x.byteOffset, x.byteLength);
  }
  function li(x, B, D) {
    var J = B ? D(O(x), !0) : O(x);
    return Qe(J, Me, new x.constructor());
  }
  function ps(x) {
    var B = new x.constructor(x.source, fe.exec(x));
    return B.lastIndex = x.lastIndex, B;
  }
  function to(x, B, D) {
    var J = B ? D(Q(x), !0) : Q(x);
    return Qe(J, Ne, new x.constructor());
  }
  function Xr(x) {
    return lt ? Object(lt.call(x)) : {};
  }
  function ui(x, B) {
    var D = B ? Jn(x.buffer) : x.buffer;
    return new x.constructor(D, x.byteOffset, x.length);
  }
  function gs(x, B) {
    var D = -1, J = x.length;
    for (B || (B = Array(J)); ++D < J; )
      B[D] = x[D];
    return B;
  }
  function ys(x, B, D, J) {
    D || (D = {});
    for (var xe = -1, De = B.length; ++xe < De; ) {
      var Tt = B[xe], wt = void 0;
      eo(D, Tt, wt === void 0 ? x[Tt] : wt);
    }
    return D;
  }
  function Wo(x, B) {
    return ys(x, no(x), B);
  }
  function rt(x) {
    return qo(x, re, no);
  }
  function qr(x, B) {
    var D = x.__data__;
    return ms(B) ? D[typeof B == "string" ? "string" : "hash"] : D.map;
  }
  function kt(x, B) {
    var D = St(x, B);
    return ii(D) ? D : void 0;
  }
  var no = lr ? ae(lr, Object) : se, dr = hs;
  (R && dr(new R(new ArrayBuffer(1))) != V || K && dr(new K()) != w || Y && dr(Y.resolve()) != v || ee && dr(new ee()) != P || we && dr(new we()) != M) && (dr = function(x) {
    var B = je.call(x), D = B == S ? x.constructor : void 0, J = D ? Mn(D) : void 0;
    if (J)
      switch (J) {
        case ft:
          return V;
        case Xe:
          return w;
        case C:
          return v;
        case ce:
          return P;
        case tt:
          return M;
      }
    return B;
  });
  function ws(x) {
    var B = x.length, D = x.constructor(B);
    return B && typeof x[0] == "string" && Se.call(x, "index") && (D.index = x.index, D.input = x.input), D;
  }
  function di(x) {
    return typeof x.constructor == "function" && !fi(x) ? Fn(Kt(x)) : {};
  }
  function fr(x, B, D, J) {
    var xe = x.constructor;
    switch (B) {
      case U:
        return Jn(x);
      case a:
      case c:
        return new xe(+x);
      case V:
        return ci(x, J);
      case le:
      case ne:
      case q:
      case m:
      case I:
      case N:
      case _:
      case W:
      case F:
        return ui(x, J);
      case w:
        return li(x, J, D);
      case y:
      case H:
        return new xe(x);
      case L:
        return ps(x);
      case P:
        return to(x, J, D);
      case A:
        return Xr(x);
    }
  }
  function Qn(x, B) {
    return B = B ?? s, !!B && (typeof x == "number" || $.test(x)) && x > -1 && x % 1 == 0 && x < B;
  }
  function ms(x) {
    var B = typeof x;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? x !== "__proto__" : x === null;
  }
  function Wr(x) {
    return !!ct && ct in x;
  }
  function fi(x) {
    var B = x && x.constructor, D = typeof B == "function" && B.prototype || $e;
    return x === D;
  }
  function Mn(x) {
    if (x != null) {
      try {
        return Le.call(x);
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
    return si(x, !0, !0);
  }
  function b(x, B) {
    return x === B || x !== x && B !== B;
  }
  function E(x) {
    return l(x) && Se.call(x, "callee") && (!fn.call(x, "callee") || je.call(x) == i);
  }
  var G = Array.isArray;
  function te(x) {
    return x != null && f(x.length) && !g(x);
  }
  function l(x) {
    return X(x) && te(x);
  }
  var p = Vr || Ee;
  function g(x) {
    var B = T(x) ? je.call(x) : "";
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
  function re(x) {
    return te(x) ? Qi(x) : oi(x);
  }
  function se() {
    return [];
  }
  function Ee() {
    return !1;
  }
  e.exports = ro;
})(Wc, Wc.exports);
var mv = Wc.exports;
const nw = /* @__PURE__ */ Tg(mv);
var ed;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ed || (ed = {}));
function bv(e, t) {
  return { type: ed.Address, version: e, hash160: t };
}
function xv(e) {
  return Vi.c32address(e.version, e.hash160);
}
const Sv = (e) => KS(Xy(e)), vv = (e) => Ce(Sv(e));
zt.hmacSha256Sync = (e, ...t) => {
  const n = Vy.create(Xy, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Av(e, t = "mainnet") {
  t = Ry(t), e = typeof e == "string" ? dt(e) : e;
  const n = HS(rs.P2PKH, t), r = bv(n, vv(e));
  return xv(r);
}
function Ev(e, t) {
  const n = dn.decodeToken(e), r = n.payload;
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
  const o = new dn.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function kv(e, t = null) {
  let n;
  t ? n = Ev(e, t) : n = dn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Bp = "_blockstackDidCheckEchoReply", $v = "echoReply", Iv = "authContinuation";
function Lv(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Cv() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[Bp];
  if (typeof t == "boolean")
    return t;
  const n = Lv(e.location.search), r = n[$v];
  if (r) {
    e[Bp] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const i = n[Iv];
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
      this.appConfig = new Dg();
    else
      throw new Xb("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new fp(t.sessionOptions) : this.store = new fp() : t ? this.store = new dp(t.sessionOptions) : this.store = new dp();
  }
  makeAuthRequestToken(t, n, r, s, i, o = Wb().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ju("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, pS(t, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = hS();
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
      if (Cv())
        return yo.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      yo.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = b1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Ka("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = dn.decodeToken(t).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await bS(t))
      throw new Ka("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (nu(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await lp(s, i.private_key);
          } catch {
            if (yo.warn("Failed decryption of appPrivateKey, will try to use as given"), !zt.isValidPrivateKey(i.private_key))
              throw new Ka("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await lp(s, c);
          } catch {
            yo.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Ka("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let d = c1, h;
    nu(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (d = i.hubUrl), nu(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Dy(i.iss),
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
        u.profile = Object.assign({}, Kb);
      else {
        const S = await y.text(), v = JSON.parse(S);
        u.profile = kv(v[0].token);
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
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), cx(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), lx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
td.prototype.makeAuthRequest = td.prototype.makeAuthRequestToken;
const Tv = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Bv = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = Tv(), n = e.filter((r) => t.find((i) => i.id === r.id) ? !1 : !!Tl(r.id));
  return t.concat(n);
}, Tl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), rw = "STX_PROVIDER", Bi = () => typeof window > "u" ? null : window.localStorage.getItem(rw), Mv = (e) => {
  typeof window < "u" && window.localStorage.setItem(rw, e);
}, Nv = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function _v(e, t) {
  const n = {};
  return Object.assign(n, Nv, t), await fetch(e, n);
}
function Pv(e) {
  let t = _v, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Uv(...e) {
  const { fetchLib: t, middlewares: n } = Pv(e);
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
var Mi;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Mi || (Mi = {}));
var Mp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Mp || (Mp = {}));
const Hv = "https://api.mainnet.hiro.so", Ov = "https://api.testnet.hiro.so", Dv = "http://localhost:3999", Fv = ["mainnet", "testnet", "devnet", "mocknet"];
class Ni {
  constructor(t) {
    this.version = Mi.Mainnet, this.chainId = _o.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Mi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Uv();
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
Ni.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new nd();
    case "testnet":
      return new rd();
    case "devnet":
      return new jv();
    case "mocknet":
      return new sw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Fv.join(", ")}`);
  }
};
Ni.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Ni.fromName(e);
class nd extends Ni {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Hv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Mi.Mainnet, this.chainId = _o.Mainnet;
  }
}
class rd extends Ni {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Ov,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Mi.Testnet, this.chainId = _o.Testnet;
  }
}
class sw extends Ni {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Dv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Mi.Testnet, this.chainId = _o.Testnet;
  }
}
const jv = sw;
var _i;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(_i || (_i = {}));
var Zc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Zc || (Zc = {}));
_i.Mainnet;
var Pi;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Pi || (Pi = {}));
var Ui;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ui || (Ui = {}));
Pi.Mainnet;
const Rv = {
  chainId: _i.Mainnet,
  transactionVersion: Pi.Mainnet,
  peerNetworkId: Zc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ui.MainnetSingleSig,
    multiSig: Ui.MainnetMultiSig
  },
  client: { baseUrl: Ug }
}, sd = {
  chainId: _i.Testnet,
  transactionVersion: Pi.Testnet,
  peerNetworkId: Zc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ui.TestnetSingleSig,
    multiSig: Ui.TestnetMultiSig
  },
  client: { baseUrl: Hg }
}, Mc = {
  ...sd,
  addressVersion: { ...sd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Og }
}, zv = {
  ...Mc,
  addressVersion: { ...Mc.addressVersion },
  client: { ...Mc.client }
};
function Gv(e) {
  switch (e) {
    case "mainnet":
      return Rv;
    case "testnet":
      return sd;
    case "devnet":
      return Mc;
    case "mocknet":
      return zv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Kv(e) {
  return typeof e == "string" ? Gv(e) : e;
}
function Vv(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const Np = /* @__PURE__ */ new Map();
function iw(e, t) {
  const n = Np.get(e);
  if (n !== void 0)
    return n(t);
  const r = Vv(e);
  return Np.set(e, r), iw(e, t);
}
let It = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? dt(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return g1(this.readBytes(4), 0);
  }
  readUInt8() {
    return h1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return d1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Ce(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Ce(n);
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
    if (iw(t, r))
      return r;
    throw n(r);
  }
};
const Yv = 128, Xv = 128, ow = 16, vi = 32, id = 80, Bl = 65, qv = 32, Wv = 64, Jc = 34, Zv = 1 + 16 * 1024 * 1024, Jv = 165, Qv = 16, eA = 16, tA = 20, nA = eA + 2 + tA, rA = nA + 4, sA = Zv + (Jv + Qv * rA);
var pt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(pt || (pt = {}));
var od;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(od || (od = {}));
var Kn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Kn || (Kn = {}));
const lu = ["onChainOnly", "offChainOnly", "any"];
lu[0] + "", Kn.OnChainOnly, lu[1] + "", Kn.OffChainOnly, lu[2] + "", Kn.Any, Kn.OnChainOnly + "", Kn.OnChainOnly, Kn.OffChainOnly + "", Kn.OffChainOnly, Kn.Any + "", Kn.Any;
var Qc;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Qc || (Qc = {}));
var Bt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Bt || (Bt = {}));
var jt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(jt || (jt = {}));
var vt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(vt || (vt = {}));
var Ut;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Ut || (Ut = {}));
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
var kn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(kn || (kn = {}));
var _p;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(_p || (_p = {}));
var ld;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ld || (ld = {}));
var xr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(xr || (xr = {}));
var Pp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Pp || (Pp = {}));
let Ml = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, wo = class extends Ml {
  constructor(t) {
    super(t);
  }
}, An = class extends Ml {
  constructor(t) {
    super(t);
  }
}, el = class extends Ml {
  constructor(t) {
    super(t);
  }
}, mi = class extends Ml {
  constructor(t) {
    super(t);
  }
};
function ud(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function iA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function aw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function oA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ud(e.outputLen), ud(e.blockLen);
}
function aA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function cA(e, t) {
  aw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const bi = {
  number: ud,
  bool: iA,
  bytes: aw,
  hash: oA,
  exists: aA,
  output: cA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Mr = (e, t) => e << 32 - t | e >>> t, lA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!lA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function uA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function bf(e) {
  if (typeof e == "string" && (e = uA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let cw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Yi(e) {
  const t = (r) => e().update(bf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let lw = class extends cw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, bi.hash(t);
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
    return bi.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    bi.exists(this), bi.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const uw = (e, t, n) => new lw(e, t).update(n).digest();
uw.create = (e, t) => new lw(e, t);
function dA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
let xf = class extends cw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = uu(this.buffer);
  }
  update(t) {
    bi.exists(this);
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
    bi.exists(this), bi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    dA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const fA = (e, t, n) => e & t ^ ~e & n, hA = (e, t, n) => e & t ^ e & n ^ t & n, pA = new Uint32Array([
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
]), Bs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ms = new Uint32Array(64);
let dw = class extends xf {
  constructor() {
    super(64, 32, 8, !1), this.A = Bs[0] | 0, this.B = Bs[1] | 0, this.C = Bs[2] | 0, this.D = Bs[3] | 0, this.E = Bs[4] | 0, this.F = Bs[5] | 0, this.G = Bs[6] | 0, this.H = Bs[7] | 0;
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
      Ms[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Ms[u - 15], y = Ms[u - 2], S = Mr(w, 7) ^ Mr(w, 18) ^ w >>> 3, v = Mr(y, 17) ^ Mr(y, 19) ^ y >>> 10;
      Ms[u] = v + Ms[u - 7] + S + Ms[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Mr(a, 6) ^ Mr(a, 11) ^ Mr(a, 25), y = h + w + fA(a, c, d) + pA[u] + Ms[u] | 0, v = (Mr(r, 2) ^ Mr(r, 13) ^ Mr(r, 22)) + hA(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Ms.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, gA = class extends dw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Sf = Yi(() => new dw());
Yi(() => new gA());
const yA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fw = Uint8Array.from({ length: 16 }, (e, t) => t), wA = fw.map((e) => (9 * e + 5) % 16);
let vf = [fw], Af = [wA];
for (let e = 0; e < 4; e++)
  for (let t of [vf, Af])
    t.push(t[e].map((n) => yA[n]));
const hw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), mA = vf.map((e, t) => e.map((n) => hw[t][n])), bA = Af.map((e, t) => e.map((n) => hw[t][n])), xA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), SA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), sc = (e, t) => e << t | e >>> 32 - t;
function Up(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ic = new Uint32Array(16);
let vA = class extends xf {
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
      const S = 4 - y, v = xA[y], L = SA[y], P = vf[y], H = Af[y], A = mA[y], M = bA[y];
      for (let U = 0; U < 16; U++) {
        const V = sc(r + Up(y, i, a, d) + ic[P[U]] + v, A[U]) + u | 0;
        r = u, u = d, d = sc(a, 10) | 0, a = i, i = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = sc(s + Up(S, o, c, h) + ic[H[U]] + L, M[U]) + w | 0;
        s = w, w = h, h = sc(c, 10) | 0, c = o, o = V;
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
const AA = Yi(() => new vA()), oc = BigInt(2 ** 32 - 1), dd = BigInt(32);
function pw(e, t = !1) {
  return t ? { h: Number(e & oc), l: Number(e >> dd & oc) } : { h: Number(e >> dd & oc) | 0, l: Number(e & oc) | 0 };
}
function EA(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = pw(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const kA = (e, t) => BigInt(e >>> 0) << dd | BigInt(t >>> 0), $A = (e, t, n) => e >>> n, IA = (e, t, n) => e << 32 - n | t >>> n, LA = (e, t, n) => e >>> n | t << 32 - n, CA = (e, t, n) => e << 32 - n | t >>> n, TA = (e, t, n) => e << 64 - n | t >>> n - 32, BA = (e, t, n) => e >>> n - 32 | t << 64 - n, MA = (e, t) => t, NA = (e, t) => e, _A = (e, t, n) => e << n | t >>> 32 - n, PA = (e, t, n) => t << n | e >>> 32 - n, UA = (e, t, n) => t << n - 32 | e >>> 64 - n, HA = (e, t, n) => e << n - 32 | t >>> 64 - n;
function OA(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const DA = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), FA = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, jA = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), RA = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, zA = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), GA = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ke = {
  fromBig: pw,
  split: EA,
  toBig: kA,
  shrSH: $A,
  shrSL: IA,
  rotrSH: LA,
  rotrSL: CA,
  rotrBH: TA,
  rotrBL: BA,
  rotr32H: MA,
  rotr32L: NA,
  rotlSH: _A,
  rotlSL: PA,
  rotlBH: UA,
  rotlBL: HA,
  add: OA,
  add3L: DA,
  add3H: FA,
  add4L: jA,
  add4H: RA,
  add5H: GA,
  add5L: zA
}, [KA, VA] = Ke.split([
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
].map((e) => BigInt(e))), Ns = new Uint32Array(80), _s = new Uint32Array(80);
let Nl = class extends xf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: L } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ns[A] = t.getUint32(n), _s[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = Ns[A - 15] | 0, U = _s[A - 15] | 0, V = Ke.rotrSH(M, U, 1) ^ Ke.rotrSH(M, U, 8) ^ Ke.shrSH(M, U, 7), le = Ke.rotrSL(M, U, 1) ^ Ke.rotrSL(M, U, 8) ^ Ke.shrSL(M, U, 7), ne = Ns[A - 2] | 0, q = _s[A - 2] | 0, m = Ke.rotrSH(ne, q, 19) ^ Ke.rotrBH(ne, q, 61) ^ Ke.shrSH(ne, q, 6), I = Ke.rotrSL(ne, q, 19) ^ Ke.rotrBL(ne, q, 61) ^ Ke.shrSL(ne, q, 6), N = Ke.add4L(le, I, _s[A - 7], _s[A - 16]), _ = Ke.add4H(N, V, m, Ns[A - 7], Ns[A - 16]);
      Ns[A] = _ | 0, _s[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: L, Hh: P, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const M = Ke.rotrSH(u, w, 14) ^ Ke.rotrSH(u, w, 18) ^ Ke.rotrBH(u, w, 41), U = Ke.rotrSL(u, w, 14) ^ Ke.rotrSL(u, w, 18) ^ Ke.rotrBL(u, w, 41), V = u & y ^ ~u & v, le = w & S ^ ~w & L, ne = Ke.add5L(H, U, le, VA[A], _s[A]), q = Ke.add5H(ne, P, M, V, KA[A], Ns[A]), m = ne | 0, I = Ke.rotrSH(r, s, 28) ^ Ke.rotrBH(r, s, 34) ^ Ke.rotrBH(r, s, 39), N = Ke.rotrSL(r, s, 28) ^ Ke.rotrBL(r, s, 34) ^ Ke.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = L | 0, v = y | 0, L = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Ke.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = Ke.add3L(m, N, W);
      r = Ke.add3H(F, q, I, _), s = F | 0;
    }
    ({ h: r, l: s } = Ke.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ke.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ke.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = Ke.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = Ke.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Ke.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: L } = Ke.add(this.Gh | 0, this.Gl | 0, v | 0, L | 0), { h: P, l: H } = Ke.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, L, P, H);
  }
  roundClean() {
    Ns.fill(0), _s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, YA = class extends Nl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, XA = class extends Nl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, qA = class extends Nl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Yi(() => new Nl());
Yi(() => new YA());
const WA = Yi(() => new XA());
Yi(() => new qA());
var st;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(st || (st = {}));
var en;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(en || (en = {}));
function Ef(e) {
  return en[e];
}
const ZA = () => ({ type: st.BoolTrue }), JA = () => ({ type: st.BoolFalse }), QA = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: st.Buffer, value: Ce(e) };
}, Hp = BigInt("0xffffffffffffffffffffffffffffffff"), eE = BigInt(0), Op = BigInt("0x7fffffffffffffffffffffffffffffff"), Dp = BigInt("-170141183460469231731687303715884105728"), tE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = zu(dt(e))), Un(e, Uint8Array) && (e = zu(e));
  const t = xn(e);
  if (t > Op)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Op}`);
  if (t < Dp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Dp}`);
  return { type: st.Int, value: t };
}, nE = (e) => {
  const t = xn(e);
  if (t < eE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Hp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Hp}`);
  return { type: st.UInt, value: t };
};
function rE(e) {
  return { type: st.List, value: e };
}
function gw() {
  return { type: st.OptionalNone };
}
function yw(e) {
  return { type: st.OptionalSome, value: e };
}
var me;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(me || (me = {}));
function sE() {
  return {
    type: me.Address,
    version: Ui.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Fp(e) {
  if (e && kw(e, Jc))
    throw new Error(`Memo exceeds maximum length of ${Jc} bytes`);
  return { type: me.MemoString, content: e };
}
function kf(e, t) {
  return {
    type: me.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function fd(e) {
  if (dt(e).byteLength != Bl)
    throw Error("Invalid signature");
  return {
    type: me.MessageSignature,
    data: e
  };
}
function iE(e, t, n) {
  return typeof e == "string" && (e = SE(e)), typeof n == "string" && (n = Fp(n)), {
    type: me.Payload,
    payloadType: pt.TokenTransfer,
    recipient: e,
    amount: xn(t),
    memo: n ?? Fp("")
  };
}
function oE(e, t, n, r) {
  return typeof t == "string" && (t = kr(t)), typeof n == "string" && (n = kr(n)), {
    type: me.Payload,
    payloadType: pt.ContractCall,
    contractAddress: typeof e == "string" ? ei(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function aE(e) {
  return kr(e, 4, 1e5);
}
function jp(e, t, n) {
  return typeof e == "string" && (e = kr(e)), typeof t == "string" && (t = aE(t)), typeof n == "number" ? {
    type: me.Payload,
    payloadType: pt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: me.Payload,
    payloadType: pt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function cE() {
  return { type: me.Payload, payloadType: pt.PoisonMicroblock };
}
function Rp(e, t) {
  if (e.byteLength != vi)
    throw Error(`Coinbase buffer size must be ${vi} bytes`);
  return t != null ? {
    type: me.Payload,
    payloadType: pt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: me.Payload,
    payloadType: pt.Coinbase,
    coinbaseBytes: e
  };
}
function lE(e, t, n) {
  if (e.byteLength != vi)
    throw Error(`Coinbase buffer size must be ${vi} bytes`);
  if (n.byteLength != id)
    throw Error(`VRF proof buffer size must be ${id} bytes`);
  return {
    type: me.Payload,
    payloadType: pt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === st.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function uE(e, t, n, r, s, i, o) {
  return {
    type: me.Payload,
    payloadType: pt.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function kr(e, t, n) {
  const r = t || 1, s = n || Yv;
  if (kw(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: me.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function dE(e, t, n) {
  return {
    type: me.Asset,
    address: ei(e),
    contractName: kr(t),
    assetName: kr(n)
  };
}
function ei(e) {
  const t = Vi.c32addressDecode(e);
  return {
    type: me.Address,
    version: t[0],
    hash160: t[1]
  };
}
function fE(e, t) {
  const n = ei(e), r = kr(t);
  return {
    type: me.Principal,
    prefix: kn.Contract,
    address: n,
    contractName: r
  };
}
function hE(e) {
  const t = ei(e);
  return {
    type: me.Principal,
    prefix: kn.Standard,
    address: t
  };
}
function mo(e, t) {
  return {
    pubKeyEncoding: e,
    type: me.TransactionAuthField,
    contents: t
  };
}
function ts(e) {
  switch (e.type) {
    case me.Address:
      return Ha(e);
    case me.Principal:
      return ww(e);
    case me.LengthPrefixedString:
      return Uo(e);
    case me.MemoString:
      return gE(e);
    case me.Asset:
      return bw(e);
    case me.PostCondition:
      return Sw(e);
    case me.PublicKey:
      return gd(e);
    case me.LengthPrefixedList:
      return $f(e);
    case me.Payload:
      return vw(e);
    case me.TransactionAuthField:
      return xE(e);
    case me.MessageSignature:
      return If(e);
  }
}
function Ha(e) {
  const t = [];
  return t.push(dt(Ba(e.version, 1))), t.push(dt(e.hash160)), qt(t);
}
function Po(e) {
  const t = Un(e, It) ? e : new It(e), n = ml(Ce(t.readBytes(1))), r = Ce(t.readBytes(20));
  return { type: me.Address, version: n, hash160: r };
}
function ww(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === kn.Standard || e.prefix === kn.Contract) && t.push(Ha(e.address)), e.prefix === kn.Contract && t.push(Uo(e.contractName)), qt(t);
}
function pE(e) {
  const t = Un(e, It) ? e : new It(e), n = t.readUInt8Enum(kn, (i) => {
    throw new An(`Unexpected Principal payload type: ${i}`);
  });
  if (n === kn.Origin)
    return { type: me.Principal, prefix: n };
  const r = Po(t);
  if (n === kn.Standard)
    return { type: me.Principal, prefix: n, address: r };
  const s = or(t);
  return {
    type: me.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Uo(e) {
  const t = [], n = Ri(e.content), r = n.byteLength;
  return t.push(dt(Ba(r, e.lengthPrefixBytes))), t.push(n), qt(t);
}
function or(e, t, n) {
  t = t || 1;
  const r = Un(e, It) ? e : new It(e), s = ml(Ce(r.readBytes(t))), i = Ma(r.readBytes(s));
  return kr(i, t, n ?? 128);
}
function gE(e) {
  const t = [], n = Ri(e.content), r = zE(Ce(n), Jc * 2);
  return t.push(dt(r)), qt(t);
}
function mw(e) {
  const t = Un(e, It) ? e : new It(e);
  let n = Ma(t.readBytes(Jc));
  return n = n.replace(/\u0000*$/, ""), { type: me.MemoString, content: n };
}
function bw(e) {
  const t = [];
  return t.push(Ha(e.address)), t.push(Uo(e.contractName)), t.push(Uo(e.assetName)), qt(t);
}
function hd(e) {
  const t = Un(e, It) ? e : new It(e);
  return {
    type: me.Asset,
    address: Po(t),
    contractName: or(t),
    assetName: or(t)
  };
}
function $f(e) {
  const t = e.values, n = [];
  n.push(dt(Ba(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(ts(r));
  return qt(n);
}
function xw(e, t, n) {
  const r = Un(e, It) ? e : new It(e), s = ml(Ce(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (t) {
      case me.Address:
        i.push(Po(r));
        break;
      case me.LengthPrefixedString:
        i.push(or(r));
        break;
      case me.MemoString:
        i.push(mw(r));
        break;
      case me.Asset:
        i.push(hd(r));
        break;
      case me.PostCondition:
        i.push(wE(r));
        break;
      case me.PublicKey:
        i.push(yd(r));
        break;
      case me.TransactionAuthField:
        i.push(bE(r));
        break;
    }
  return kf(i, n);
}
function yE(e) {
  return Ce(Sw(e));
}
function Sw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(ww(e.principal)), (e.conditionType === Bt.Fungible || e.conditionType === Bt.NonFungible) && t.push(bw(e.asset)), e.conditionType === Bt.NonFungible && t.push(Dr(e.assetName)), t.push(e.conditionCode), e.conditionType === Bt.STX || e.conditionType === Bt.Fungible || e.conditionType === Bt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new wo("The post-condition amount may not be larger than 8 bytes");
    t.push(Js(e.amount, 8));
  }
  return qt(t);
}
function wE(e) {
  const t = Un(e, It) ? e : new It(e), n = t.readUInt8Enum(Bt, (a) => {
    throw new An(`Could not read ${a} as PostConditionType`);
  }), r = pE(t);
  let s, i, o;
  switch (n) {
    case Bt.STX:
      return s = t.readUInt8Enum(pa, (c) => {
        throw new An(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Ce(t.readBytes(8))}`), {
        type: me.PostCondition,
        conditionType: Bt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Bt.Fungible:
      return i = hd(t), s = t.readUInt8Enum(pa, (c) => {
        throw new An(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Ce(t.readBytes(8))}`), {
        type: me.PostCondition,
        conditionType: Bt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Bt.NonFungible:
      i = hd(t);
      const a = Ur(t);
      return s = t.readUInt8Enum(ad, (c) => {
        throw new An(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: me.PostCondition,
        conditionType: Bt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Bt.Staking:
      return s = t.readUInt8Enum(pa, (c) => {
        throw new An(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Ce(t.readBytes(8))}`), {
        type: me.PostCondition,
        conditionType: Bt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Bt.PoX: {
      const c = t.readUInt8Enum(cd, (d) => {
        throw new An(`Could not read ${d} as PoxConditionCode`);
      });
      return {
        type: me.PostCondition,
        conditionType: Bt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function vw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case pt.TokenTransfer:
      t.push(Dr(e.recipient)), t.push(Js(e.amount, 8)), t.push(ts(e.memo));
      break;
    case pt.ContractCall:
      t.push(ts(e.contractAddress)), t.push(ts(e.contractName)), t.push(ts(e.functionName));
      const n = new Uint8Array(4);
      $i(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Dr(r));
      });
      break;
    case pt.SmartContract:
      t.push(ts(e.contractName)), t.push(ts(e.codeBody));
      break;
    case pt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(ts(e.contractName)), t.push(ts(e.codeBody));
      break;
    case pt.PoisonMicroblock:
      break;
    case pt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case pt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Dr(e.recipient));
      break;
    case pt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Dr(e.recipient ? yw(e.recipient) : gw())), t.push(e.vrfProof);
      break;
    case pt.TenureChange:
      t.push(dt(e.tenureHash)), t.push(dt(e.previousTenureHash)), t.push(dt(e.burnViewHash)), t.push(dt(e.previousTenureEnd)), t.push($i(new Uint8Array(4), e.previousTenureBlocks)), t.push(p1(new Uint8Array(1), e.cause)), t.push(dt(e.publicKeyHash));
      break;
  }
  return qt(t);
}
function mE(e) {
  const t = Un(e, It) ? e : new It(e);
  switch (t.readUInt8Enum(pt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case pt.TokenTransfer:
      const r = Ur(t), s = xn(t.readBytes(8)), i = mw(t);
      return iE(r, s, i);
    case pt.ContractCall:
      const o = Po(t), a = or(t), c = or(t), d = [], h = t.readUInt32BE();
      for (let M = 0; M < h; M++) {
        const U = Ur(t);
        d.push(U);
      }
      return oE(o, a, c, d);
    case pt.SmartContract:
      const u = or(t), w = or(t, 4, 1e5);
      return jp(u, w);
    case pt.VersionedSmartContract: {
      const M = t.readUInt8Enum(od, (le) => {
        throw new Error(`Cannot recognize ClarityVersion: ${le}`);
      }), U = or(t), V = or(t, 4, sA);
      return jp(U, V, M);
    }
    case pt.PoisonMicroblock:
      return cE();
    case pt.Coinbase: {
      const M = t.readBytes(vi);
      return Rp(M);
    }
    case pt.CoinbaseToAltRecipient: {
      const M = t.readBytes(vi), U = Ur(t);
      return Rp(M, U);
    }
    case pt.NakamotoCoinbase: {
      const M = t.readBytes(vi), U = Ur(t), V = t.readBytes(id);
      return lE(M, U, V);
    }
    case pt.TenureChange:
      const y = Ce(t.readBytes(20)), S = Ce(t.readBytes(20)), v = Ce(t.readBytes(20)), L = Ce(t.readBytes(32)), P = t.readUInt32BE(), H = t.readUInt8Enum(ld, (M) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${M}`);
      }), A = Ce(t.readBytes(20));
      return uE(y, S, v, L, P, H, A);
  }
}
function pd(e) {
  const t = Un(e, It) ? e : new It(e);
  return fd(Ce(t.readBytes(Bl)));
}
function bE(e) {
  const t = Un(e, It) ? e : new It(e), n = t.readUInt8Enum(xr, (r) => {
    throw new An(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case xr.PublicKeyCompressed:
      return mo(Ut.Compressed, yd(t));
    case xr.PublicKeyUncompressed:
      return mo(Ut.Uncompressed, Go(ek(yd(t).data)));
    case xr.SignatureCompressed:
      return mo(Ut.Compressed, pd(t));
    case xr.SignatureUncompressed:
      return mo(Ut.Uncompressed, pd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function If(e) {
  return dt(e.data);
}
function xE(e) {
  const t = [];
  switch (e.contents.type) {
    case me.PublicKey:
      t.push(e.pubKeyEncoding === Ut.Compressed ? xr.PublicKeyCompressed : xr.PublicKeyUncompressed), t.push(dt(QE(e.contents.data)));
      break;
    case me.MessageSignature:
      t.push(e.pubKeyEncoding === Ut.Compressed ? xr.SignatureCompressed : xr.SignatureUncompressed), t.push(If(e.contents));
      break;
  }
  return qt(t);
}
function gd(e) {
  return e.data.slice();
}
function yd(e) {
  const t = Un(e, It) ? e : new It(e), n = t.readUInt8(), r = n === 4 ? Wv : qv;
  return Go(qt([n, t.readBytes(r)]));
}
function Lf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === vt.P2PKH || t === vt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === vt.P2WPKH || t === vt.P2WSH || t === vt.P2WSHNonSequential) && !r.map((s) => s.data).every(Ko))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case vt.P2PKH:
      return ac(e, GE(r[0].data));
    case vt.P2WPKH:
      return ac(e, KE(r[0].data));
    case vt.P2SH:
    case vt.P2SHNonSequential:
      return ac(e, VE(n, r.map(gd)));
    case vt.P2WSH:
    case vt.P2WSHNonSequential:
      return ac(e, YE(n, r.map(gd)));
  }
}
function ac(e, t) {
  return { type: me.Address, version: e, hash160: t };
}
function Cf(e) {
  return Vi.c32address(e.version, e.hash160);
}
function zp(e) {
  const [t, n, r] = e.split(/\.|::/);
  return dE(t, n, r);
}
function na(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return fE(t, n);
  } else
    return hE(e);
}
function SE(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return EE(t, n);
  } else
    return vE(e);
}
function vE(e) {
  const t = ei(e);
  return { type: st.PrincipalStandard, value: Cf(t) };
}
function AE(e) {
  return { type: st.PrincipalStandard, value: Cf(e) };
}
function EE(e, t) {
  const n = ei(e), r = kr(t);
  return Aw(n, r);
}
function Aw(e, t) {
  if (Ri(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: st.PrincipalContract,
    value: `${Cf(e)}.${t.content}`
  };
}
function kE(e) {
  return { type: st.ResponseErr, value: e };
}
function $E(e) {
  return { type: st.ResponseOk, value: e };
}
const IE = (e) => ({ type: st.StringASCII, value: e }), LE = (e) => ({ type: st.StringUTF8, value: e });
function CE(e) {
  for (const t in e)
    if (!XE(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: st.Tuple, value: e };
}
function Ur(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new It(dt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new It(e) : t = e;
  switch (t.readUInt8Enum(en, (r) => {
    throw new An(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case en.int:
      return tE(zu(t.readBytes(16)));
    case en.uint:
      return nE(t.readBytes(16));
    case en.buffer:
      const r = t.readUInt32BE();
      return QA(t.readBytes(r));
    case en.true:
      return ZA();
    case en.false:
      return JA();
    case en.address:
      const s = Po(t);
      return AE(s);
    case en.contract:
      const i = Po(t), o = or(t);
      return Aw(i, o);
    case en.ok:
      return $E(Ur(t));
    case en.err:
      return kE(Ur(t));
    case en.none:
      return gw();
    case en.some:
      return yw(Ur(t));
    case en.list:
      const a = t.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(Ur(t));
      return rE(c);
    case en.tuple:
      const d = t.readUInt32BE(), h = {};
      for (let v = 0; v < d; v++) {
        const L = or(t).content;
        if (L === void 0)
          throw new An('"content" is undefined');
        h[L] = Ur(t);
      }
      return CE(h);
    case en.ascii:
      const u = t.readUInt32BE(), w = o1(t.readBytes(u));
      return IE(w);
    case en.utf8:
      const y = t.readUInt32BE(), S = Ma(t.readBytes(y));
      return LE(S);
    default:
      throw new An("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function zr(e, t) {
  return qt([Ef(e), t]);
}
function TE(e) {
  return new Uint8Array([Ef(e.type)]);
}
function BE(e) {
  return e.type === st.OptionalNone ? new Uint8Array([Ef(e.type)]) : zr(e.type, Dr(e.value));
}
function ME(e) {
  const t = new Uint8Array(4);
  return $i(t, Math.ceil(e.value.length / 2), 0), zr(e.type, jr(t, dt(e.value)));
}
function NE(e) {
  const t = Wd(t1(BigInt(e.value), BigInt(Xv)), ow);
  return zr(e.type, t);
}
function _E(e) {
  const t = Wd(BigInt(e.value), ow);
  return zr(e.type, t);
}
function PE(e) {
  return zr(e.type, Ha(ei(e.value)));
}
function UE(e) {
  const [t, n] = qE(e.value);
  return zr(e.type, jr(Ha(ei(t)), Uo(kr(n))));
}
function HE(e) {
  return zr(e.type, Dr(e.value));
}
function OE(e) {
  const t = [], n = new Uint8Array(4);
  $i(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = Dr(r);
    t.push(s);
  }
  return zr(e.type, qt(t));
}
function DE(e) {
  const t = [], n = new Uint8Array(4);
  $i(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = kr(s);
    t.push(Uo(i));
    const o = Dr(e.value[s]);
    t.push(o);
  }
  return zr(e.type, qt(t));
}
function Ew(e, t) {
  const n = [], r = t == "ascii" ? i1(e.value) : Ri(e.value), s = new Uint8Array(4);
  return $i(s, r.length, 0), n.push(s), n.push(r), zr(e.type, qt(n));
}
function FE(e) {
  return Ew(e, "ascii");
}
function jE(e) {
  return Ew(e, "utf8");
}
function Gp(e) {
  return Ce(Dr(e));
}
function Dr(e) {
  switch (e.type) {
    case st.BoolTrue:
    case st.BoolFalse:
      return TE(e);
    case st.OptionalNone:
    case st.OptionalSome:
      return BE(e);
    case st.Buffer:
      return ME(e);
    case st.UInt:
      return _E(e);
    case st.Int:
      return NE(e);
    case st.PrincipalStandard:
      return PE(e);
    case st.PrincipalContract:
      return UE(e);
    case st.ResponseOk:
    case st.ResponseErr:
      return HE(e);
    case st.List:
      return OE(e);
    case st.Tuple:
      return DE(e);
    case st.StringASCII:
      return FE(e);
    case st.StringUTF8:
      return jE(e);
    default:
      throw new wo("Unable to serialize. Invalid Clarity Value.");
  }
}
const RE = (e) => e.length % 2 ? `0${e}` : e, zE = (e, t) => e.padEnd(t, "0"), kw = (e, t) => e ? Ri(e).length > t : !1;
function wd(e) {
  return nw(e);
}
const xa = (e) => AA(Sf(e)), Tf = (e) => Ce(WA(e)), GE = (e) => Ce(xa(e)), KE = (e) => {
  const t = xa(e), n = jr(new Uint8Array([0]), new Uint8Array([t.length]), t), r = xa(n);
  return Ce(r);
}, VE = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = qt(n), s = xa(r);
  return Ce(s);
}, YE = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = qt(n), s = Sf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = qt(i), a = xa(o);
  return Ce(a);
};
function XE(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function qE(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
zt.hmacSha256Sync = (e, ...t) => {
  const n = uw.create(Sf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Go(e) {
  return e = typeof e == "string" ? dt(e) : e, {
    type: me.PublicKey,
    data: e
  };
}
function WE(e, t, n = Ut.Compressed) {
  const r = u1(t), s = new qn(Gh(r.r), Gh(r.s)), i = We.fromSignature(e, s, r.recoveryId), o = n === Ut.Compressed;
  return i.toHex(o);
}
function ZE(e) {
  return typeof e == "string" ? e : Ce(e);
}
const Bf = ZE;
function $w(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === l1;
}
function Ko(e) {
  return !Bf(e).startsWith("04");
}
function JE(e) {
  e = Zd(e);
  const t = $w(e);
  return Ce(Na(e.slice(0, 32), t));
}
function QE(e) {
  return We.fromHex(Bf(e)).toHex(!0);
}
function ek(e) {
  return We.fromHex(Bf(e)).toHex(!1);
}
function tk(e, t) {
  e = Zd(e);
  const [n, r] = xl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ba(r, 1) + qn.fromHex(n).toCompactHex();
}
function Mf() {
  return {
    type: me.MessageSignature,
    data: Ce(new Uint8Array(Bl))
  };
}
function Iw(e, t, n, r) {
  const s = Lf(0, e, 1, [Go(t)]).hash160, i = Ko(t) ? Ut.Compressed : Ut.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: xn(n),
    fee: xn(r),
    keyEncoding: i,
    signature: Mf()
  };
}
function Sa(e) {
  return "signature" in e;
}
function Kp(e) {
  return e === vt.P2SH || e === vt.P2WSH;
}
function nk(e) {
  return e === vt.P2SHNonSequential || e === vt.P2WSHNonSequential;
}
function Vp(e) {
  const t = wd(e);
  return t.nonce = 0, t.fee = 0, Sa(t) ? t.signature = Mf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function rk(e) {
  const t = [
    e.hashMode,
    dt(e.signer),
    Js(e.nonce, 8),
    Js(e.fee, 8),
    e.keyEncoding,
    If(e.signature)
  ];
  return qt(t);
}
function sk(e) {
  const t = [
    e.hashMode,
    dt(e.signer),
    Js(e.nonce, 8),
    Js(e.fee, 8)
  ], n = kf(e.fields);
  t.push($f(n));
  const r = new Uint8Array(2);
  return f1(r, e.signaturesRequired, 0), t.push(r), qt(t);
}
function ik(e, t) {
  const n = Ce(t.readBytes(20)), r = BigInt(`0x${Ce(t.readBytes(8))}`), s = BigInt(`0x${Ce(t.readBytes(8))}`), i = t.readUInt8Enum(Ut, (a) => {
    throw new An(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === vt.P2WPKH && i != Ut.Compressed)
    throw new An("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function ok(e, t) {
  const n = Ce(t.readBytes(20)), r = BigInt("0x" + Ce(t.readBytes(8))), s = BigInt("0x" + Ce(t.readBytes(8))), i = xw(t, me.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const d of i)
    switch (d.contents.type) {
      case me.PublicKey:
        Ko(d.contents.data) || (o = !0);
        break;
      case me.MessageSignature:
        if (d.pubKeyEncoding === Ut.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new mi("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (o && (e === vt.P2WSH || e === vt.P2WSHNonSequential))
    throw new mi("Uncompressed keys are not allowed in this hash mode");
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
  return Sa(e) ? rk(e) : sk(e);
}
function fu(e) {
  const t = e.readUInt8Enum(vt, (n) => {
    throw new An(`Could not parse ${n} as AddressHashMode`);
  });
  return t === vt.P2PKH || t === vt.P2WPKH ? ik(t, e) : ok(t, e);
}
function Lw(e, t, n, r) {
  const i = e + Ce(new Uint8Array([t])) + Ce(Js(n, 8)) + Ce(Js(r, 8));
  if (dt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Tf(dt(i));
}
function Cw(e, t, n) {
  const r = 33 + Bl, s = Ko(t.data) ? Ut.Compressed : Ut.Uncompressed, i = e + RE(s.toString(16)) + n, o = dt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Tf(o);
}
function ak(e, t, n, r, s) {
  const i = Lw(e, t, n, r), o = tk(s, i), a = Go(JE(s)), c = Cw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Tw(e, t, n, r, s, i) {
  const o = Lw(e, t, n, r), a = Go(WE(o, i, s)), c = Cw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function ck() {
  const e = Iw(vt.P2PKH, "", 0, 0);
  return e.signer = sE().hash160, e.keyEncoding = Ut.Compressed, e.signature = Mf(), e;
}
function Yp(e, t, n) {
  return Sa(e) ? lk(e, t, n) : uk(e, t, n);
}
function lk(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Tw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), i = Lf(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new mi(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function uk(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case me.PublicKey:
        Ko(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case me.MessageSignature:
        c.pubKeyEncoding === Ut.Uncompressed && (i = !0);
        const { pubKey: d, nextSigHash: h } = Tw(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (Kp(e.hashMode) && (s = h), r.push(d), o += 1, o === 65536)
          throw new mi("Too many signatures");
        break;
    }
  if (Kp(e.hashMode) && o !== e.signaturesRequired || nk(e.hashMode) && o < e.signaturesRequired)
    throw new mi("Incorrect number of signatures");
  if (i && (e.hashMode === vt.P2WSH || e.hashMode === vt.P2WSHNonSequential))
    throw new mi("Uncompressed keys are not allowed in this hash mode");
  const a = Lf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new mi(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Bw(e) {
  return {
    authType: jt.Standard,
    spendingCondition: e
  };
}
function Mw(e, t) {
  return {
    authType: jt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Iw(vt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Xp(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case jt.Standard:
        return Bw(Vp(e.spendingCondition));
      case jt.Sponsored:
        return Mw(Vp(e.spendingCondition), ck());
      default:
        throw new el("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function dk(e, t) {
  switch (e.authType) {
    case jt.Standard:
      return Yp(e.spendingCondition, t, jt.Standard);
    case jt.Sponsored:
      return Yp(e.spendingCondition, t, jt.Standard);
    default:
      throw new el("Invalid origin auth type");
  }
}
function fk(e, t) {
  switch (e.authType) {
    case jt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: xn(t)
      };
      return { ...e, spendingCondition: n };
    case jt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: xn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function hk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: xn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function pk(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: xn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function gk(e, t) {
  const n = {
    ...t,
    nonce: xn(t.nonce),
    fee: xn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function yk(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case jt.Standard:
      t.push(du(e.spendingCondition));
      break;
    case jt.Sponsored:
      t.push(du(e.spendingCondition)), t.push(du(e.sponsorSpendingCondition));
      break;
  }
  return qt(t);
}
function wk(e) {
  const t = e.readUInt8Enum(jt, (r) => {
    throw new An(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case jt.Standard:
      return n = fu(e), Bw(n);
    case jt.Sponsored:
      n = fu(e);
      const r = fu(e);
      return Mw(n, r);
  }
}
class mk {
  constructor({ auth: t, payload: n, postConditions: r = kf([]), postConditionMode: s = Qc.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Kv(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: xn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Kn.Any;
  }
  signBegin() {
    const t = wd(this);
    return t.auth = Xp(t.auth), t.txid();
  }
  verifyBegin() {
    const t = wd(this);
    return t.auth = Xp(t.auth), t.txid();
  }
  verifyOrigin() {
    return dk(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, jt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === jt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, jt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : Go(t), r = this.auth.spendingCondition;
    if (r && !Sa(r)) {
      const s = Ko(n.data);
      r.fields.push(mo(s ? Ut.Compressed : Ut.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = ak(n, r, t.fee, t.nonce, s);
    if (Sa(t))
      t.signature = fd(i);
    else {
      const a = $w(s);
      t.fields.push(mo(a ? Ut.Compressed : Ut.Uncompressed, fd(i)));
    }
    return o;
  }
  txid() {
    const t = this.serializeBytes();
    return Tf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != jt.Sponsored)
      throw new el("Cannot sponsor sign a non-sponsored transaction");
    this.auth = gk(this.auth, t);
  }
  setFee(t) {
    this.auth = fk(this.auth, t);
  }
  setNonce(t) {
    this.auth = hk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != jt.Sponsored)
      throw new el("Cannot sponsor sign a non-sponsored transaction");
    this.auth = pk(this.auth, t);
  }
  serialize() {
    return Ce(this.serializeBytes());
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
    return $i(n, this.chainId, 0), t.push(n), t.push(yk(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push($f(this.postConditions)), t.push(vw(this.payload)), qt(t);
  }
}
function bk(e) {
  const t = Un(e, It) ? e : new It(e), n = t.readUInt8Enum(Pi, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = wk(t), i = t.readUInt8Enum(Kn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = t.readUInt8Enum(Qc, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = xw(t, me.PostCondition), c = mE(t), d = new mk({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return d.anchorMode = i, d;
}
const qp = BigInt("18446744073709551615");
function hu(e) {
  const t = xn(e);
  if (t < 0n || t > qp)
    throw new RangeError(`Post-condition amount must be between 0 and ${qp} (u64 max), received: ${t}`);
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
function xk(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: me.PostCondition,
        conditionType: Bt.STX,
        principal: e.address === "origin" ? { type: me.Principal, prefix: kn.Origin } : na(e.address),
        conditionCode: cc(e.condition),
        amount: hu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: me.PostCondition,
        conditionType: Bt.Fungible,
        principal: e.address === "origin" ? { type: me.Principal, prefix: kn.Origin } : na(e.address),
        conditionCode: cc(e.condition),
        amount: hu(e.amount),
        asset: zp(e.asset)
      };
    case "nft-postcondition":
      return {
        type: me.PostCondition,
        conditionType: Bt.NonFungible,
        principal: e.address === "origin" ? { type: me.Principal, prefix: kn.Origin } : na(e.address),
        conditionCode: cc(e.condition),
        asset: zp(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: me.PostCondition,
        conditionType: Bt.Staking,
        principal: e.address === "origin" ? { type: me.Principal, prefix: kn.Origin } : na(e.address),
        conditionCode: cc(e.condition),
        amount: hu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: me.PostCondition,
        conditionType: Bt.PoX,
        principal: e.address === "origin" ? { type: me.Principal, prefix: kn.Origin } : na(e.address),
        conditionCode: Sk(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function cc(e) {
  return md[e];
}
function Sk(e) {
  return bd[e];
}
function Nw(e) {
  const t = xk(e);
  return yE(t);
}
function vk(e, t, n) {
  return _f(_w(e), n);
}
function _w(e, t) {
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
    return BigInt(`0x${kk(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Nf(e, t = 8) {
  return (typeof e == "bigint" ? e : _w(e)).toString(16).padStart(t * 2, "0");
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
const Ek = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function kk(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Ek[n];
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
function $k(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Ik(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Wp(e) {
  if (e.some(Ik))
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
function us(e) {
  return Uf(...e.map((t) => typeof t == "number" ? Wp([t]) : t instanceof Array ? Wp(t) : t));
}
function _l(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var xd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(xd || (xd = {}));
xd.Mainnet;
const Lk = 128, Ck = 128, Pw = 16;
var Sd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Sd || (Sd = {}));
var Zp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Zp || (Zp = {}));
var Jp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Jp || (Jp = {}));
var mr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(mr || (mr = {}));
const pu = ["onChainOnly", "offChainOnly", "any"];
pu[0] + "", mr.OnChainOnly, pu[1] + "", mr.OffChainOnly, pu[2] + "", mr.Any, mr.OnChainOnly + "", mr.OnChainOnly, mr.OffChainOnly + "", mr.OffChainOnly, mr.Any + "", mr.Any;
var vd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(vd || (vd = {}));
vd.Mainnet;
var Qp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Qp || (Qp = {}));
var pi;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(pi || (pi = {}));
var e0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(e0 || (e0 = {}));
var t0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(t0 || (t0 = {}));
var n0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(n0 || (n0 = {}));
var r0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(r0 || (r0 = {}));
var s0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(s0 || (s0 = {}));
var i0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(i0 || (i0 = {}));
var Ad;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ad || (Ad = {}));
var o0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(o0 || (o0 = {}));
var a0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(a0 || (a0 = {}));
function Ed(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Tk(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Uw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Bk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ed(e.outputLen), Ed(e.blockLen);
}
function Mk(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Nk(e, t) {
  Uw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const gu = {
  number: Ed,
  bool: Tk,
  bytes: Uw,
  hash: Bk,
  exists: Mk,
  output: Nk
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const yu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Nr = (e, t) => e << 32 - t | e >>> t, _k = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_k)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Pk(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Hw(e) {
  if (typeof e == "string" && (e = Pk(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Uk = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Xi(e) {
  const t = (r) => e().update(Hw(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Hk(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
let Hf = class extends Uk {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = yu(this.buffer);
  }
  update(t) {
    gu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Hw(t);
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
    Hk(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const Ok = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ow = Uint8Array.from({ length: 16 }, (e, t) => t), Dk = Ow.map((e) => (9 * e + 5) % 16);
let Of = [Ow], Df = [Dk];
for (let e = 0; e < 4; e++)
  for (let t of [Of, Df])
    t.push(t[e].map((n) => Ok[n]));
const Dw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), Fk = Of.map((e, t) => e.map((n) => Dw[t][n])), jk = Df.map((e, t) => e.map((n) => Dw[t][n])), Rk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zk = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), lc = (e, t) => e << t | e >>> 32 - t;
function c0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const uc = new Uint32Array(16);
let Gk = class extends Hf {
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
      const S = 4 - y, v = Rk[y], L = zk[y], P = Of[y], H = Df[y], A = Fk[y], M = jk[y];
      for (let U = 0; U < 16; U++) {
        const V = lc(r + c0(y, i, a, d) + uc[P[U]] + v, A[U]) + u | 0;
        r = u, u = d, d = lc(a, 10) | 0, a = i, i = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = lc(s + c0(S, o, c, h) + uc[H[U]] + L, M[U]) + w | 0;
        s = w, w = h, h = lc(c, 10) | 0, c = o, o = V;
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
Xi(() => new Gk());
const Kk = (e, t, n) => e & t ^ ~e & n, Vk = (e, t, n) => e & t ^ e & n ^ t & n, Yk = new Uint32Array([
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
]), Ps = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Us = new Uint32Array(64);
let Fw = class extends Hf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ps[0] | 0, this.B = Ps[1] | 0, this.C = Ps[2] | 0, this.D = Ps[3] | 0, this.E = Ps[4] | 0, this.F = Ps[5] | 0, this.G = Ps[6] | 0, this.H = Ps[7] | 0;
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
      Us[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Us[u - 15], y = Us[u - 2], S = Nr(w, 7) ^ Nr(w, 18) ^ w >>> 3, v = Nr(y, 17) ^ Nr(y, 19) ^ y >>> 10;
      Us[u] = v + Us[u - 7] + S + Us[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = Nr(a, 6) ^ Nr(a, 11) ^ Nr(a, 25), y = h + w + Kk(a, c, d) + Yk[u] + Us[u] | 0, v = (Nr(r, 2) ^ Nr(r, 13) ^ Nr(r, 22)) + Vk(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Xk = class extends Fw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Xi(() => new Fw());
Xi(() => new Xk());
const dc = BigInt(2 ** 32 - 1), kd = BigInt(32);
function jw(e, t = !1) {
  return t ? { h: Number(e & dc), l: Number(e >> kd & dc) } : { h: Number(e >> kd & dc) | 0, l: Number(e & dc) | 0 };
}
function qk(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = jw(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Wk = (e, t) => BigInt(e >>> 0) << kd | BigInt(t >>> 0), Zk = (e, t, n) => e >>> n, Jk = (e, t, n) => e << 32 - n | t >>> n, Qk = (e, t, n) => e >>> n | t << 32 - n, e3 = (e, t, n) => e << 32 - n | t >>> n, t3 = (e, t, n) => e << 64 - n | t >>> n - 32, n3 = (e, t, n) => e >>> n - 32 | t << 64 - n, r3 = (e, t) => t, s3 = (e, t) => e, i3 = (e, t, n) => e << n | t >>> 32 - n, o3 = (e, t, n) => t << n | e >>> 32 - n, a3 = (e, t, n) => t << n - 32 | e >>> 64 - n, c3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function l3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const u3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), d3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, f3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), h3 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, p3 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), g3 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ve = {
  fromBig: jw,
  split: qk,
  toBig: Wk,
  shrSH: Zk,
  shrSL: Jk,
  rotrSH: Qk,
  rotrSL: e3,
  rotrBH: t3,
  rotrBL: n3,
  rotr32H: r3,
  rotr32L: s3,
  rotlSH: i3,
  rotlSL: o3,
  rotlBH: a3,
  rotlBL: c3,
  add: l3,
  add3L: u3,
  add3H: d3,
  add4L: f3,
  add4H: h3,
  add5H: g3,
  add5L: p3
}, [y3, w3] = Ve.split([
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
].map((e) => BigInt(e))), Hs = new Uint32Array(80), Os = new Uint32Array(80);
let Pl = class extends Hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: L } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Hs[A] = t.getUint32(n), Os[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = Hs[A - 15] | 0, U = Os[A - 15] | 0, V = Ve.rotrSH(M, U, 1) ^ Ve.rotrSH(M, U, 8) ^ Ve.shrSH(M, U, 7), le = Ve.rotrSL(M, U, 1) ^ Ve.rotrSL(M, U, 8) ^ Ve.shrSL(M, U, 7), ne = Hs[A - 2] | 0, q = Os[A - 2] | 0, m = Ve.rotrSH(ne, q, 19) ^ Ve.rotrBH(ne, q, 61) ^ Ve.shrSH(ne, q, 6), I = Ve.rotrSL(ne, q, 19) ^ Ve.rotrBL(ne, q, 61) ^ Ve.shrSL(ne, q, 6), N = Ve.add4L(le, I, Os[A - 7], Os[A - 16]), _ = Ve.add4H(N, V, m, Hs[A - 7], Hs[A - 16]);
      Hs[A] = _ | 0, Os[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: L, Hh: P, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const M = Ve.rotrSH(u, w, 14) ^ Ve.rotrSH(u, w, 18) ^ Ve.rotrBH(u, w, 41), U = Ve.rotrSL(u, w, 14) ^ Ve.rotrSL(u, w, 18) ^ Ve.rotrBL(u, w, 41), V = u & y ^ ~u & v, le = w & S ^ ~w & L, ne = Ve.add5L(H, U, le, w3[A], Os[A]), q = Ve.add5H(ne, P, M, V, y3[A], Hs[A]), m = ne | 0, I = Ve.rotrSH(r, s, 28) ^ Ve.rotrBH(r, s, 34) ^ Ve.rotrBH(r, s, 39), N = Ve.rotrSL(r, s, 28) ^ Ve.rotrBL(r, s, 34) ^ Ve.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = L | 0, v = y | 0, L = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Ve.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = Ve.add3L(m, N, W);
      r = Ve.add3H(F, q, I, _), s = F | 0;
    }
    ({ h: r, l: s } = Ve.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ve.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ve.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = Ve.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = Ve.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Ve.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: L } = Ve.add(this.Gh | 0, this.Gl | 0, v | 0, L | 0), { h: P, l: H } = Ve.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, L, P, H);
  }
  roundClean() {
    Hs.fill(0), Os.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, m3 = class extends Pl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, b3 = class extends Pl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, x3 = class extends Pl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Xi(() => new Pl());
Xi(() => new m3());
Xi(() => new b3());
Xi(() => new x3());
function S3(e, t, n) {
  const s = Lk;
  if (H3(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Sd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var tn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(tn || (tn = {}));
let v3 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Rw = class extends v3 {
  constructor(t) {
    super(t);
  }
};
function Ul(e) {
  const t = [];
  return t.push(va(Nf(e.version, 1))), t.push(va(e.hash160)), us(t);
}
function A3(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ul(e.address)), e.prefix === Ad.Contract && t.push(Aa(e.contractName)), us(t);
}
function Aa(e) {
  const t = [], n = Pf(e.content), r = n.byteLength;
  return t.push(va(Nf(r, e.lengthPrefixBytes))), t.push(n), us(t);
}
function E3(e) {
  const t = [];
  return t.push(Ul(e.address)), t.push(Aa(e.contractName)), t.push(Aa(e.assetName)), us(t);
}
function zw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(A3(e.principal)), (e.conditionType === pi.Fungible || e.conditionType === pi.NonFungible) && t.push(E3(e.assetInfo)), e.conditionType === pi.NonFungible && t.push(Hi(e.assetName)), t.push(e.conditionCode), e.conditionType === pi.STX || e.conditionType === pi.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Rw("The post-condition amount may not be larger than 8 bytes");
    t.push(vk(e.amount, !1, 8));
  }
  return us(t);
}
function Gr(e, t) {
  return us([e, t]);
}
function k3(e) {
  return new Uint8Array([e.type]);
}
function $3(e) {
  return e.type === tn.OptionalNone ? new Uint8Array([e.type]) : Gr(e.type, Hi(e.value));
}
function I3(e) {
  const t = new Uint8Array(4);
  return _l(t, e.buffer.length, 0), Gr(e.type, Uf(t, e.buffer));
}
function L3(e) {
  const t = _f(Ak(e.value, BigInt(Ck)), Pw);
  return Gr(e.type, t);
}
function C3(e) {
  const t = _f(e.value, Pw);
  return Gr(e.type, t);
}
function T3(e) {
  return Gr(e.type, Ul(e.address));
}
function B3(e) {
  return Gr(e.type, Uf(Ul(e.address), Aa(e.contractName)));
}
function M3(e) {
  return Gr(e.type, Hi(e.value));
}
function N3(e) {
  const t = [], n = new Uint8Array(4);
  _l(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Hi(r);
    t.push(s);
  }
  return Gr(e.type, us(t));
}
function _3(e) {
  const t = [], n = new Uint8Array(4);
  _l(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = S3(s);
    t.push(Aa(i));
    const o = Hi(e.data[s]);
    t.push(o);
  }
  return Gr(e.type, us(t));
}
function Gw(e, t) {
  const n = [], r = t == "ascii" ? $k(e.data) : Pf(e.data), s = new Uint8Array(4);
  return _l(s, r.length, 0), n.push(s), n.push(r), Gr(e.type, us(n));
}
function P3(e) {
  return Gw(e, "ascii");
}
function U3(e) {
  return Gw(e, "utf8");
}
function Hi(e) {
  switch (e.type) {
    case tn.BoolTrue:
    case tn.BoolFalse:
      return k3(e);
    case tn.OptionalNone:
    case tn.OptionalSome:
      return $3(e);
    case tn.Buffer:
      return I3(e);
    case tn.UInt:
      return C3(e);
    case tn.Int:
      return L3(e);
    case tn.PrincipalStandard:
      return T3(e);
    case tn.PrincipalContract:
      return B3(e);
    case tn.ResponseOk:
    case tn.ResponseErr:
      return M3(e);
    case tn.List:
      return N3(e);
    case tn.Tuple:
      return _3(e);
    case tn.StringASCII:
      return P3(e);
    case tn.StringUTF8:
      return U3(e);
    default:
      throw new Rw("Unable to serialize. Invalid Clarity Value.");
  }
}
const H3 = (e, t) => e ? Pf(e).length > t : !1, O3 = "connect-ui";
let Nc, Kw, Vn = !1, $d = !1;
const ls = (e, t = "") => () => {
}, D3 = (e, t) => () => {
}, F3 = "{visibility:hidden}.hydrated{visibility:inherit}", l0 = {}, j3 = "http://www.w3.org/2000/svg", R3 = "http://www.w3.org/1999/xhtml", z3 = (e) => e != null, Ff = (e) => (e = typeof e, e === "object" || e === "function");
function Vw(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Fe = (e, t, ...n) => {
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
}, G3 = {}, K3 = (e) => e && e.$tag$ === G3, V3 = (e, t) => e != null && !Ff(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, Y3 = (e) => Vo(e).$hostElement$, X3 = (e, t, n) => {
  const r = mn.ce(t, n);
  return e.dispatchEvent(r), r;
}, u0 = /* @__PURE__ */ new WeakMap(), q3 = (e, t, n) => {
  let r = tl.get(e);
  g4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, tl.set(e, r);
}, W3 = (e, t, n, r) => {
  var s;
  let i = Yw(t);
  const o = tl.get(i);
  if (e = e.nodeType === 11 ? e : Fr, o)
    if (typeof o == "string") {
      e = e.head || e;
      let a = u0.get(e), c;
      if (a || u0.set(e, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Fr.createElement("style"), c.innerHTML = o;
          const d = (s = mn.$nonce$) !== null && s !== void 0 ? s : Vw(Fr);
          d != null && c.setAttribute("nonce", d), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(i);
      }
    } else e.adoptedStyleSheets.includes(o) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, o]);
  return i;
}, Z3 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = ls("attachStyles", t.$tagName$), i = W3(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Yw = (e, t) => "sc-" + e.$tagName$, d0 = (e, t, n, r, s, i) => {
  if (n !== r) {
    let o = h0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, d = f0(n), h = f0(r);
      c.remove(...d.filter((u) => u && !h.includes(u))), c.add(...h.filter((u) => u && !d.includes(u)));
    } else if (!o && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : h0(Hl, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && mn.rel(e, t, n, !1), r && mn.ael(e, t, r, !1);
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
}, J3 = /\s/, f0 = (e) => e ? e.split(J3) : [], Xw = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, i = e && e.$attrs$ || l0, o = t.$attrs$ || l0;
  for (r in i)
    r in o || d0(s, r, i[r], void 0, n, t.$flags$);
  for (r in o)
    d0(s, r, i[r], o[r], n, t.$flags$);
}, jf = (e, t, n, r) => {
  const s = t.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Fr.createTextNode(s.$text$);
  else {
    if (Vn || (Vn = s.$tag$ === "svg"), o = s.$elm$ = Fr.createElementNS(Vn ? j3 : R3, s.$tag$), Vn && s.$tag$ === "foreignObject" && (Vn = !1), Xw(null, s, Vn), z3(Nc) && o["s-si"] !== Nc && o.classList.add(o["s-si"] = Nc), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = jf(e, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Vn = !1 : o.tagName === "foreignObject" && (Vn = !0);
  }
  return o;
}, qw = (e, t, n, r, s, i) => {
  let o = e, a;
  for (o.shadowRoot && o.tagName === Kw && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = jf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, t)));
}, Ww = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, Q3 = (e, t, n, r) => {
  let s = 0, i = 0, o = t.length - 1, a = t[0], c = t[o], d = r.length - 1, h = r[0], u = r[d], w;
  for (; s <= o && i <= d; )
    a == null ? a = t[++s] : c == null ? c = t[--o] : h == null ? h = r[++i] : u == null ? u = r[--d] : fc(a, h) ? (la(a, h), a = t[++s], h = r[++i]) : fc(c, u) ? (la(c, u), c = t[--o], u = r[--d]) : fc(a, u) ? (la(a, u), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], u = r[--d]) : fc(c, h) ? (la(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--o], h = r[++i]) : (w = jf(t && t[i], n, i), h = r[++i], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > o ? qw(e, r[d + 1] == null ? null : r[d + 1].$elm$, n, r, i, d) : i > d && Ww(t, s, o);
}, fc = (e, t) => e.$tag$ === t.$tag$, la = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, i = t.$tag$, o = t.$text$;
  o === null ? (Vn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Vn, Xw(e, t, Vn), r !== null && s !== null ? Q3(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), qw(n, null, t, s, 0, s.length - 1)) : r !== null && Ww(r, 0, r.length - 1), Vn && i === "svg" && (Vn = !1)) : e.$text$ !== o && (n.data = o);
}, e4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || Id(null, null), s = K3(t) ? t : Fe(null, null, t);
  Kw = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Nc = n["s-sc"], la(r, s);
}, Zw = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Rf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Zw(e, e.$ancestorComponent$), w4(() => t4(e, t));
}, t4 = (e, t) => {
  const n = ls("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), i4(s, () => n4(e, r, t));
}, n4 = async (e, t, n) => {
  const r = e.$hostElement$, s = ls("update", e.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && Z3(e);
  const o = ls("render", e.$cmpMeta$.$tagName$);
  r4(e, t), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => s4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, r4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, e4(e, t);
  } catch (r) {
    Ea(r, e.$hostElement$);
  }
  return null;
}, s4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = ls("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Qw(n), r(), e.$onReadyResolve$(n), s || Jw()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Gf(() => Rf(e, !1)), e.$flags$ &= -517;
}, Jw = (e) => {
  Qw(Fr.documentElement), Gf(() => X3(Hl, "appload", { detail: { namespace: O3 } }));
}, i4 = (e, t) => e && e.then ? e.then(t) : t(), Qw = (e) => e.classList.add("hydrated"), o4 = (e, t) => Vo(e).$instanceValues$.get(t), a4 = (e, t, n, r) => {
  const s = Vo(e), i = s.$instanceValues$.get(t), o = s.$flags$, a = s.$lazyInstance$;
  n = V3(n, r.$members$[t][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), d = n !== i && !c;
  (!(o & 8) || i === void 0) && d && (s.$instanceValues$.set(t, n), a && (o & 18) === 2 && Rf(s, !1));
}, em = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return o4(this, i);
        },
        set(a) {
          a4(this, i, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        mn.jmp(() => {
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
}, c4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = p4(n), s.then) {
        const c = D3();
        s = await s, c();
      }
      s.isProxied || (em(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = ls("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        Ea(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Yw(n);
      if (!tl.has(c)) {
        const d = ls("registerStyles", n.$tagName$);
        q3(c, a, !!(n.$flags$ & 1)), d();
      }
    }
  }
  const i = t.$ancestorComponent$, o = () => Rf(t, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, l4 = (e) => {
  if (!(mn.$flags$ & 1)) {
    const t = Vo(e), n = t.$cmpMeta$, r = ls("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Zw(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && e.hasOwnProperty(s)) {
          const o = e[s];
          delete e[s], e[s] = o;
        }
      }), c4(e, t, n);
    }
    r();
  }
}, u4 = (e) => {
  mn.$flags$ & 1 || Vo(e);
}, d4 = (e, t = {}) => {
  var n;
  const r = ls(), s = [], i = t.exclude || [], o = Hl.customElements, a = Fr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), d = /* @__PURE__ */ Fr.createElement("style"), h = [];
  let u, w = !0;
  Object.assign(mn, t), mn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", Fr.baseURI).href, e.map((y) => {
    y[1].map((S) => {
      const v = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      v.$members$ = S[2];
      const L = v.$tagName$, P = class extends HTMLElement {
        // StencilLazyHost
        constructor(H) {
          super(H), H = this, h4(H, v), v.$flags$ & 1 && H.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), w ? h.push(this) : mn.jmp(() => l4(this));
        }
        disconnectedCallback() {
          mn.jmp(() => u4(this));
        }
        componentOnReady() {
          return Vo(this).$onReadyPromise$;
        }
      };
      v.$lazyBundleId$ = y[0], !i.includes(L) && !o.get(L) && (s.push(L), o.define(L, em(
        P,
        v,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    d.innerHTML = s + F3, d.setAttribute("data-styles", "");
    const y = (n = mn.$nonce$) !== null && n !== void 0 ? n : Vw(Fr);
    y != null && d.setAttribute("nonce", y), a.insertBefore(d, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((y) => y.connectedCallback()) : mn.jmp(() => u = setTimeout(Jw, 30)), r();
}, zf = /* @__PURE__ */ new WeakMap(), Vo = (e) => zf.get(e), f4 = (e, t) => zf.set(t.$lazyInstance$ = e, t), h4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], zf.set(e, n);
}, h0 = (e, t) => t in e, Ea = (e, t) => (0, console.error)(e, t), wu = /* @__PURE__ */ new Map(), p4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, i = wu.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (wu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => KL).then(o, Ea);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (wu.set(s, o), o[r]), Ea);
}, tl = /* @__PURE__ */ new Map(), Hl = typeof window < "u" ? window : {}, Fr = Hl.document || { head: {} }, mn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, tm = (e) => Promise.resolve(e), g4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), p0 = [], nm = [], y4 = (e, t) => (n) => {
  e.push(n), $d || ($d = !0, mn.$flags$ & 4 ? Gf(Ld) : mn.raf(Ld));
}, g0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Ea(n);
    }
  e.length = 0;
}, Ld = () => {
  g0(p0), g0(nm), ($d = p0.length > 0) && mn.raf(Ld);
}, Gf = (e) => tm().then(e), w4 = /* @__PURE__ */ y4(nm), m4 = () => tm(), b4 = (e, t) => typeof window > "u" ? Promise.resolve() : m4().then(() => d4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var x4 = Object.defineProperty, S4 = Object.defineProperties, v4 = Object.getOwnPropertyDescriptors, nl = Object.getOwnPropertySymbols, rm = Object.prototype.hasOwnProperty, sm = Object.prototype.propertyIsEnumerable, y0 = (e, t, n) => t in e ? x4(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Zn = (e, t) => {
  for (var n in t || (t = {})) rm.call(t, n) && y0(e, n, t[n]);
  if (nl) for (var n of nl(t)) sm.call(t, n) && y0(e, n, t[n]);
  return e;
}, $r = (e, t) => S4(e, v4(t)), im = (e, t) => {
  var n = {};
  for (var r in e) rm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && nl) for (var r of nl(e)) t.indexOf(r) < 0 && sm.call(e, r) && (n[r] = e[r]);
  return n;
};
function om() {
  return Tl(Bi()) || window.StacksProvider || window.BlockstackProvider;
}
function Ol(e) {
  return e ? typeof e == "string" ? Ni.fromName(e) : "version" in e ? e : "url" in e ? new nd({ url: e.url }) : e.transactionVersion === Pi.Mainnet ? new nd({ url: e.client.baseUrl }) : new rd({ url: e.client.baseUrl }) : new rd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var A4 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(A4 || {}), E4 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(E4 || {}), Kf = (e) => {
  let t = e;
  if (!t) {
    let n = new Dg(["store_write"], document.location.href);
    t = new td({ appConfig: n });
  }
  return t;
};
function am(e) {
  try {
    return Kf(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var cm = (e) => {
  let t = Kf(e).loadUserData().appPrivateKey, n = dn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function k4(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let i = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, o = { [_i.Mainnet]: "mainnet", [_i.Testnet]: "testnet" }, a = Ol(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function $4(e) {
  let t = Ol(e.network), n = Kf(e.userSession), r = $r(Zn({}, e), { network: t, userSession: n });
  return Zn({ stxAddress: k4(r) }, r);
}
async function I4(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Nw) : n = n.map((r) => Ce(zw(r)))), new dn.TokenSigner("ES256k", t).signAsync($r(Zn({}, e), { postConditions: n }));
}
function L4(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(Nw) : t = t.map((n) => Ce(zw(n)))), dn.createUnsecuredToken($r(Zn({}, e), { postConditions: t }));
}
var C4 = async ({ token: e, options: t }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(e), { txRaw: a } = o, c = dt(a.replace(/^0x/, "")), d = bk(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, $r(Zn({}, o), { stacksTransaction: d }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, $r(Zn({}, o), { stacksTransaction: d }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = t.onCancel) == null || i.call(t);
  }
}, T4 = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, i = im(t, ["amount", "appDetails", "userSession"]);
  if (am(s)) {
    let { privateKey: a, publicKey: c } = cm(s), d = $r(Zn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (d.appDetails = r), I4(d, a);
  }
  let o = $r(Zn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), L4(o);
};
async function B4(e, t, n) {
  let r = await t($r(Zn(Zn({}, $4(e)), e), { network: Ol(e.network) }));
  return C4({ token: r, options: e }, n);
}
function M4(e, t = om()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return B4(e, T4, t);
}
function lm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? $r(Zn({}, e), { message: Gp(t), domain: Gp(n) }) : $r(Zn({}, e), { message: Ce(Hi(t)), domain: Ce(Hi(n)) });
}
async function N4(e, t) {
  return new dn.TokenSigner("ES256k", t).signAsync(lm(e));
}
async function _4(e) {
  let t = e, { userSession: n } = t, r = im(t, ["userSession"]);
  if (am(n)) {
    let { privateKey: s, publicKey: i } = cm(n), o = $r(Zn({}, r), { publicKey: i });
    return N4(o, s);
  }
  return dn.createUnsecuredToken(lm(e));
}
var P4 = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(P4 || {}), um = "asigna-stx", w0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === um && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(H4(e, t), "*");
}), U4 = { authenticationRequest: async (e) => w0(e, "authenticationRequest"), transactionRequest: async (e) => w0(e, "transactionRequest") }, H4 = (e, t) => ({ source: um, [t]: e }), O4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = U4);
};
O4();
var D4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function F4(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let i = Bi(), o = om();
    if (i && o) return e(n, o);
    if (typeof window > "u") return;
    b4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : D4, c = Bv(a), d = document.createElement("connect-modal");
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
var hc = F4(M4);
function Qs(e, t, n) {
  return Vf(Ln(e, t), n);
}
function Ln(e, t) {
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
      const r = z4(BigInt(`0x${Ze(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Ze(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function m0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Oa(e, t = 8) {
  return (typeof e == "bigint" ? e : Ln(e, !1)).toString(16).padStart(t * 2, "0");
}
function Dl(e) {
  return parseInt(e, 16);
}
function Vf(e, t = 16) {
  const n = Oa(e, t);
  return Nt(n);
}
function j4(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function R4(e, t) {
  return e & BigInt(1) << t;
}
function z4(e, t) {
  return R4(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const G4 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ze(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += G4[n];
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
function dm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function K4(e) {
  return String.fromCharCode.apply(null, e);
}
function V4(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function b0(e) {
  if (e.some(V4))
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
function Wt(e) {
  return Fl(...e.map((t) => typeof t == "number" ? b0([t]) : t instanceof Array ? b0(t) : t));
}
var x0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(x0 || (x0 = {}));
var S0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(S0 || (S0 = {}));
var v0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(v0 || (v0 = {}));
const fm = 33, mu = 32;
function Y4(e) {
  if (e.length < mu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + mu * 2), r = e.slice(2 + mu * 2);
  return {
    recoveryId: Dl(t),
    r: n,
    s: r
  };
}
function X4(e) {
  const t = typeof e == "string" ? Nt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function q4(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function W4(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function Z4(e, t) {
  return e[t];
}
function J4(e, t, n = 0) {
  return e[n] = t, e;
}
function Q4(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Oi(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Cd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Cd || (Cd = {}));
const e8 = Cd.Mainnet, t8 = 128, n8 = 128, hm = 16, Ai = 32, Td = 80, jl = 65, r8 = 32, s8 = 64, rl = 34;
var ke;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ke || (ke = {}));
var qe;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(qe || (qe = {}));
var Bd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Bd || (Bd = {}));
var _n;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(_n || (_n = {}));
const _c = ["onChainOnly", "offChainOnly", "any"], A0 = {
  [_c[0]]: _n.OnChainOnly,
  [_c[1]]: _n.OffChainOnly,
  [_c[2]]: _n.Any,
  [_n.OnChainOnly]: _n.OnChainOnly,
  [_n.OffChainOnly]: _n.OffChainOnly,
  [_n.Any]: _n.Any
};
function i8(e) {
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
var Pn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Pn || (Pn = {}));
var Rt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Rt || (Rt = {}));
var At;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(At || (At = {}));
var il;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(il || (il = {}));
var Ht;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Ht || (Ht = {}));
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
var E0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(E0 || (E0 = {}));
var k0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(k0 || (k0 = {}));
function Nd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function o8(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function pm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function a8(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Nd(e.outputLen), Nd(e.blockLen);
}
function c8(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function l8(e, t) {
  pm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xi = {
  number: Nd,
  bool: o8,
  bytes: pm,
  hash: a8,
  exists: c8,
  output: l8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), _r = (e, t) => e << 32 - t | e >>> t, u8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!u8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function d8(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Xf(e) {
  if (typeof e == "string" && (e = d8(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class gm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function qi(e) {
  const t = (r) => e().update(Xf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function f8(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + c, o, r), e.setUint32(t + d, a, r);
}
class qf extends gm {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = bu(this.buffer);
  }
  update(t) {
    xi.exists(this);
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
    xi.exists(this), xi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    f8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const h8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ym = Uint8Array.from({ length: 16 }, (e, t) => t), p8 = ym.map((e) => (9 * e + 5) % 16);
let Wf = [ym], Zf = [p8];
for (let e = 0; e < 4; e++)
  for (let t of [Wf, Zf])
    t.push(t[e].map((n) => h8[n]));
const wm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), g8 = Wf.map((e, t) => e.map((n) => wm[t][n])), y8 = Zf.map((e, t) => e.map((n) => wm[t][n])), w8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), m8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), pc = (e, t) => e << t | e >>> 32 - t;
function $0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const gc = new Uint32Array(16);
class b8 extends qf {
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
      const S = 4 - y, v = w8[y], L = m8[y], P = Wf[y], H = Zf[y], A = g8[y], M = y8[y];
      for (let U = 0; U < 16; U++) {
        const V = pc(r + $0(y, i, a, d) + gc[P[U]] + v, A[U]) + u | 0;
        r = u, u = d, d = pc(a, 10) | 0, a = i, i = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = pc(s + $0(S, o, c, h) + gc[H[U]] + L, M[U]) + w | 0;
        s = w, w = h, h = pc(c, 10) | 0, c = o, o = V;
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
const x8 = qi(() => new b8()), S8 = (e, t, n) => e & t ^ ~e & n, v8 = (e, t, n) => e & t ^ e & n ^ t & n, A8 = new Uint32Array([
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
]), Ds = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Fs = new Uint32Array(64);
class mm extends qf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ds[0] | 0, this.B = Ds[1] | 0, this.C = Ds[2] | 0, this.D = Ds[3] | 0, this.E = Ds[4] | 0, this.F = Ds[5] | 0, this.G = Ds[6] | 0, this.H = Ds[7] | 0;
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
      Fs[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Fs[u - 15], y = Fs[u - 2], S = _r(w, 7) ^ _r(w, 18) ^ w >>> 3, v = _r(y, 17) ^ _r(y, 19) ^ y >>> 10;
      Fs[u] = v + Fs[u - 7] + S + Fs[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: d, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = _r(a, 6) ^ _r(a, 11) ^ _r(a, 25), y = h + w + S8(a, c, d) + A8[u] + Fs[u] | 0, v = (_r(r, 2) ^ _r(r, 13) ^ _r(r, 22)) + v8(r, s, i) | 0;
      h = d, d = c, c = a, a = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, d, h);
  }
  roundClean() {
    Fs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class E8 extends mm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Jf = qi(() => new mm());
qi(() => new E8());
const yc = BigInt(2 ** 32 - 1), _d = BigInt(32);
function bm(e, t = !1) {
  return t ? { h: Number(e & yc), l: Number(e >> _d & yc) } : { h: Number(e >> _d & yc) | 0, l: Number(e & yc) | 0 };
}
function k8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = bm(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const $8 = (e, t) => BigInt(e >>> 0) << _d | BigInt(t >>> 0), I8 = (e, t, n) => e >>> n, L8 = (e, t, n) => e << 32 - n | t >>> n, C8 = (e, t, n) => e >>> n | t << 32 - n, T8 = (e, t, n) => e << 32 - n | t >>> n, B8 = (e, t, n) => e << 64 - n | t >>> n - 32, M8 = (e, t, n) => e >>> n - 32 | t << 64 - n, N8 = (e, t) => t, _8 = (e, t) => e, P8 = (e, t, n) => e << n | t >>> 32 - n, U8 = (e, t, n) => t << n | e >>> 32 - n, H8 = (e, t, n) => t << n - 32 | e >>> 64 - n, O8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function D8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const F8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), j8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, R8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), z8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, G8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), K8 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ye = {
  fromBig: bm,
  split: k8,
  toBig: $8,
  shrSH: I8,
  shrSL: L8,
  rotrSH: C8,
  rotrSL: T8,
  rotrBH: B8,
  rotrBL: M8,
  rotr32H: N8,
  rotr32L: _8,
  rotlSH: P8,
  rotlSL: U8,
  rotlBH: H8,
  rotlBL: O8,
  add: D8,
  add3L: F8,
  add3H: j8,
  add4L: R8,
  add4H: z8,
  add5H: K8,
  add5L: G8
}, [V8, Y8] = Ye.split([
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
].map((e) => BigInt(e))), js = new Uint32Array(80), Rs = new Uint32Array(80);
class Rl extends qf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: d, El: h, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: L } = this;
    return [t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, a, c, d, h, u, w, y, S, v, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      js[A] = t.getUint32(n), Rs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = js[A - 15] | 0, U = Rs[A - 15] | 0, V = Ye.rotrSH(M, U, 1) ^ Ye.rotrSH(M, U, 8) ^ Ye.shrSH(M, U, 7), le = Ye.rotrSL(M, U, 1) ^ Ye.rotrSL(M, U, 8) ^ Ye.shrSL(M, U, 7), ne = js[A - 2] | 0, q = Rs[A - 2] | 0, m = Ye.rotrSH(ne, q, 19) ^ Ye.rotrBH(ne, q, 61) ^ Ye.shrSH(ne, q, 6), I = Ye.rotrSL(ne, q, 19) ^ Ye.rotrBL(ne, q, 61) ^ Ye.shrSL(ne, q, 6), N = Ye.add4L(le, I, Rs[A - 7], Rs[A - 16]), _ = Ye.add4H(N, V, m, js[A - 7], js[A - 16]);
      js[A] = _ | 0, Rs[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: d, Dl: h, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: L, Hh: P, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const M = Ye.rotrSH(u, w, 14) ^ Ye.rotrSH(u, w, 18) ^ Ye.rotrBH(u, w, 41), U = Ye.rotrSL(u, w, 14) ^ Ye.rotrSL(u, w, 18) ^ Ye.rotrBL(u, w, 41), V = u & y ^ ~u & v, le = w & S ^ ~w & L, ne = Ye.add5L(H, U, le, Y8[A], Rs[A]), q = Ye.add5H(ne, P, M, V, V8[A], js[A]), m = ne | 0, I = Ye.rotrSH(r, s, 28) ^ Ye.rotrBH(r, s, 34) ^ Ye.rotrBH(r, s, 39), N = Ye.rotrSL(r, s, 28) ^ Ye.rotrBL(r, s, 34) ^ Ye.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, W = s & o ^ s & c ^ o & c;
      P = v | 0, H = L | 0, v = y | 0, L = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Ye.add(d | 0, h | 0, q | 0, m | 0), d = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = Ye.add3L(m, N, W);
      r = Ye.add3H(F, q, I, _), s = F | 0;
    }
    ({ h: r, l: s } = Ye.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ye.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ye.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: h } = Ye.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: u, l: w } = Ye.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Ye.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: L } = Ye.add(this.Gh | 0, this.Gl | 0, v | 0, L | 0), { h: P, l: H } = Ye.add(this.Hh | 0, this.Hl | 0, P | 0, H | 0), this.set(r, s, i, o, a, c, d, h, u, w, y, S, v, L, P, H);
  }
  roundClean() {
    js.fill(0), Rs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class X8 extends Rl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class q8 extends Rl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class W8 extends Rl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
qi(() => new Rl());
qi(() => new X8());
const Z8 = qi(() => new q8());
qi(() => new W8());
function xm(e) {
  if (Nt(e).byteLength != jl)
    throw Error("Invalid signature");
  return {
    type: ke.MessageSignature,
    data: e
  };
}
function ua(e, t) {
  return { type: ke.Address, version: e, hash160: t };
}
function bo(e) {
  return Vi.c32address(e.version, e.hash160);
}
function Di(e, t, n) {
  const r = t || 1, s = n || t8;
  if (Hm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ke.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Qf(e) {
  const t = Vi.c32addressDecode(e);
  return {
    type: ke.Address,
    version: t[0],
    hash160: t[1]
  };
}
var oe;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(oe || (oe = {}));
function J8(e) {
  if (e.type === oe.PrincipalStandard)
    return bo(e.address);
  if (e.type === oe.PrincipalContract)
    return `${bo(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Sm(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return t$(t, n);
  } else
    return Q8(e);
}
function Q8(e) {
  const t = Qf(e);
  return { type: oe.PrincipalStandard, address: t };
}
function e$(e) {
  return { type: oe.PrincipalStandard, address: e };
}
function t$(e, t) {
  const n = Qf(e), r = Di(t);
  return vm(n, r);
}
function vm(e, t) {
  if (Yo(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: oe.PrincipalContract, address: e, contractName: t };
}
function xu(e, t = !1) {
  switch (e.type) {
    case oe.BoolTrue:
      return !0;
    case oe.BoolFalse:
      return !1;
    case oe.Int:
    case oe.UInt:
      return t ? e.value.toString() : e.value;
    case oe.Buffer:
      return `0x${Ze(e.buffer)}`;
    case oe.OptionalNone:
      return null;
    case oe.OptionalSome:
      return Sr(e.value);
    case oe.ResponseErr:
      return Sr(e.value);
    case oe.ResponseOk:
      return Sr(e.value);
    case oe.PrincipalStandard:
    case oe.PrincipalContract:
      return J8(e);
    case oe.List:
      return e.list.map((r) => Sr(r));
    case oe.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Sr(e.data[r]);
      }), n;
    case oe.StringASCII:
      return e.data;
    case oe.StringUTF8:
      return e.data;
  }
}
function Sr(e) {
  switch (e.type) {
    case oe.ResponseErr:
      return { type: Vs(e), value: xu(e, !0), success: !1 };
    case oe.ResponseOk:
      return { type: Vs(e), value: xu(e, !0), success: !0 };
    default:
      return { type: Vs(e), value: xu(e, !0) };
  }
}
function Vs(e) {
  switch (e.type) {
    case oe.BoolTrue:
    case oe.BoolFalse:
      return "bool";
    case oe.Int:
      return "int";
    case oe.UInt:
      return "uint";
    case oe.Buffer:
      return `(buff ${e.buffer.length})`;
    case oe.OptionalNone:
      return "(optional none)";
    case oe.OptionalSome:
      return `(optional ${Vs(e.value)})`;
    case oe.ResponseErr:
      return `(response UnknownType ${Vs(e.value)})`;
    case oe.ResponseOk:
      return `(response ${Vs(e.value)} UnknownType)`;
    case oe.PrincipalStandard:
    case oe.PrincipalContract:
      return "principal";
    case oe.List:
      return `(list ${e.list.length} ${e.list.length ? Vs(e.list[0]) : "UnknownType"})`;
    case oe.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${Vs(e.data[t])})`).join(" ")})`;
    case oe.StringASCII:
      return `(string-ascii ${dm(e.data).length})`;
    case oe.StringUTF8:
      return `(string-utf8 ${Yo(e.data).length})`;
  }
}
const Am = () => ({ type: oe.BoolTrue }), Em = () => ({ type: oe.BoolFalse }), n$ = (e) => e ? Am() : Em(), I0 = BigInt("0xffffffffffffffffffffffffffffffff"), r$ = BigInt(0), L0 = BigInt("0x7fffffffffffffffffffffffffffffff"), C0 = BigInt("-170141183460469231731687303715884105728"), s$ = (e) => {
  const t = Ln(e, !0);
  if (t > L0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${L0}`);
  if (t < C0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${C0}`);
  return { type: oe.Int, value: t };
}, In = (e) => {
  const t = Ln(e, !1);
  if (t < r$)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > I0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${I0}`);
  return { type: oe.UInt, value: t };
}, km = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: oe.Buffer, buffer: e };
};
function $m() {
  return { type: oe.OptionalNone };
}
function Im(e) {
  return { type: oe.OptionalSome, value: e };
}
function i$(e) {
  return { type: oe.ResponseErr, value: e };
}
function o$(e) {
  return { type: oe.ResponseOk, value: e };
}
function a$(e) {
  return { type: oe.List, list: e };
}
function Ir(e) {
  for (const t in e)
    if (!W$(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: oe.Tuple, data: e };
}
const Et = (e) => ({ type: oe.StringASCII, data: e }), c$ = (e) => ({ type: oe.StringUTF8, data: e });
class Lm extends gm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, xi.hash(t);
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
}
const Cm = (e, t, n) => new Lm(e, t).update(n).digest();
Cm.create = (e, t) => new Lm(e, t);
zt.hmacSha256Sync = (e, ...t) => {
  const n = Cm.create(Jf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Oo(e) {
  return {
    type: ke.PublicKey,
    data: Nt(e)
  };
}
function l$(e, t, n = Ht.Compressed) {
  const r = Y4(t.data), s = new qn(m0(r.r), m0(r.s)), i = We.fromSignature(e, s, r.recoveryId), o = n === Ht.Compressed;
  return i.toHex(o);
}
function u$(e) {
  return { type: ke.PublicKey, data: e };
}
function Xo(e) {
  return !Ze(e.data).startsWith("04");
}
function ol(e) {
  return e.data.slice();
}
function d$(e) {
  const t = p$(e), n = Na(t.data.slice(0, 32), t.compressed);
  return Oo(Ze(n));
}
function f$(e) {
  const t = typeof e == "string" ? e : Ze(e), n = We.fromHex(t).toHex(!0);
  return Oo(n);
}
function h$(e) {
  const t = typeof e == "string" ? e : Ze(e), n = We.fromHex(t).toHex(!1);
  return Oo(n);
}
function Pd(e) {
  const t = e.readUInt8(), n = t === 4 ? s8 : r8;
  return u$(Wt([t, e.readBytes(n)]));
}
function p$(e) {
  const t = X4(e), n = t.length == fm;
  return { data: t, compressed: n };
}
function g$(e, t) {
  const [n, r] = xl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Oa(r, 1) + qn.fromHex(n).toCompactHex();
  return xm(i);
}
function y$(e) {
  return d$(e.data);
}
function w$(e, t, n) {
  return typeof e == "string" && (e = Sm(e)), typeof n == "string" && (n = M0(n)), {
    type: ke.Payload,
    payloadType: qe.TokenTransfer,
    recipient: e,
    amount: Ln(t, !1),
    memo: n ?? M0("")
  };
}
function m$(e, t, n, r) {
  return typeof e == "string" && (e = Qf(e)), typeof t == "string" && (t = Di(t)), typeof n == "string" && (n = Di(n)), {
    type: ke.Payload,
    payloadType: qe.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function T0(e, t, n) {
  return typeof e == "string" && (e = Di(e)), typeof t == "string" && (t = I$(t)), typeof n == "number" ? {
    type: ke.Payload,
    payloadType: qe.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ke.Payload,
    payloadType: qe.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function b$() {
  return { type: ke.Payload, payloadType: qe.PoisonMicroblock };
}
function B0(e, t) {
  if (e.byteLength != Ai)
    throw Error(`Coinbase buffer size must be ${Ai} bytes`);
  return t != null ? {
    type: ke.Payload,
    payloadType: qe.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ke.Payload,
    payloadType: qe.Coinbase,
    coinbaseBytes: e
  };
}
function x$(e, t, n) {
  if (e.byteLength != Ai)
    throw Error(`Coinbase buffer size must be ${Ai} bytes`);
  if (n.byteLength != Td)
    throw Error(`VRF proof buffer size must be ${Td} bytes`);
  return {
    type: ke.Payload,
    payloadType: qe.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === oe.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Ud;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Ud || (Ud = {}));
function S$(e, t, n, r, s, i, o) {
  return {
    type: ke.Payload,
    payloadType: qe.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Tm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case qe.TokenTransfer:
      t.push(Yt(e.recipient)), t.push(Qs(e.amount, !1, 8)), t.push(ns(e.memo));
      break;
    case qe.ContractCall:
      t.push(ns(e.contractAddress)), t.push(ns(e.contractName)), t.push(ns(e.functionName));
      const n = new Uint8Array(4);
      Oi(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Yt(r));
      });
      break;
    case qe.SmartContract:
      t.push(ns(e.contractName)), t.push(ns(e.codeBody));
      break;
    case qe.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(ns(e.contractName)), t.push(ns(e.codeBody));
      break;
    case qe.PoisonMicroblock:
      break;
    case qe.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case qe.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Yt(e.recipient));
      break;
    case qe.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Yt(e.recipient ? Im(e.recipient) : $m())), t.push(e.vrfProof);
      break;
    case qe.TenureChange:
      t.push(Nt(e.tenureHash)), t.push(Nt(e.previousTenureHash)), t.push(Nt(e.burnViewHash)), t.push(Nt(e.previousTenureEnd)), t.push(Oi(new Uint8Array(4), e.previousTenureBlocks)), t.push(J4(new Uint8Array(1), e.cause)), t.push(Nt(e.publicKeyHash));
      break;
  }
  return Wt(t);
}
function v$(e) {
  switch (e.readUInt8Enum(qe, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case qe.TokenTransfer:
      const n = cr(e), r = Ln(e.readBytes(8), !1), s = Mm(e);
      return w$(n, r, s);
    case qe.ContractCall:
      const i = Do(e), o = ar(e), a = ar(e), c = [], d = e.readUInt32BE();
      for (let A = 0; A < d; A++) {
        const M = cr(e);
        c.push(M);
      }
      return m$(i, o, a, c);
    case qe.SmartContract:
      const h = ar(e), u = ar(e, 4, 1e5);
      return T0(h, u);
    case qe.VersionedSmartContract: {
      const A = e.readUInt8Enum(Bd, (V) => {
        throw new Error(`Cannot recognize ClarityVersion: ${V}`);
      }), M = ar(e), U = ar(e, 4, 1e5);
      return T0(M, U, A);
    }
    case qe.PoisonMicroblock:
      return b$();
    case qe.Coinbase: {
      const A = e.readBytes(Ai);
      return B0(A);
    }
    case qe.CoinbaseToAltRecipient: {
      const A = e.readBytes(Ai), M = cr(e);
      return B0(A, M);
    }
    case qe.NakamotoCoinbase: {
      const A = e.readBytes(Ai), M = cr(e), U = e.readBytes(Td);
      return x$(A, M, U);
    }
    case qe.TenureChange:
      const w = Ze(e.readBytes(20)), y = Ze(e.readBytes(20)), S = Ze(e.readBytes(20)), v = Ze(e.readBytes(32)), L = e.readUInt32BE(), P = e.readUInt8Enum(Ud, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), H = Ze(e.readBytes(20));
      return S$(w, y, S, v, L, P, H);
  }
}
class zl extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class gi extends zl {
  constructor(t) {
    super(t);
  }
}
class Xn extends zl {
  constructor(t) {
    super(t);
  }
}
class al extends zl {
  constructor(t) {
    super(t);
  }
}
class Si extends zl {
  constructor(t) {
    super(t);
  }
}
var vr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(vr || (vr = {}));
function Hd(e) {
  return xm(Ze(e.readBytes(jl)));
}
function xo(e, t) {
  return {
    pubKeyEncoding: e,
    type: ke.TransactionAuthField,
    contents: t
  };
}
function A$(e) {
  const t = e.readUInt8Enum(vr, (n) => {
    throw new Xn(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case vr.PublicKeyCompressed:
      return xo(Ht.Compressed, Pd(e));
    case vr.PublicKeyUncompressed:
      return xo(Ht.Uncompressed, h$(Pd(e).data));
    case vr.SignatureCompressed:
      return xo(Ht.Compressed, Hd(e));
    case vr.SignatureUncompressed:
      return xo(Ht.Uncompressed, Hd(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function eh(e) {
  return Nt(e.data);
}
function E$(e) {
  const t = [];
  switch (e.contents.type) {
    case ke.PublicKey:
      t.push(e.pubKeyEncoding === Ht.Compressed ? vr.PublicKeyCompressed : vr.PublicKeyUncompressed), t.push(ol(f$(e.contents.data)));
      break;
    case ke.MessageSignature:
      t.push(e.pubKeyEncoding === Ht.Compressed ? vr.SignatureCompressed : vr.SignatureUncompressed), t.push(eh(e.contents));
      break;
  }
  return Wt(t);
}
function ns(e) {
  switch (e.type) {
    case ke.Address:
      return Da(e);
    case ke.Principal:
      return Bm(e);
    case ke.LengthPrefixedString:
      return Fo(e);
    case ke.MemoString:
      return L$(e);
    case ke.AssetInfo:
      return Nm(e);
    case ke.PostCondition:
      return C$(e);
    case ke.PublicKey:
      return ol(e);
    case ke.LengthPrefixedList:
      return rh(e);
    case ke.Payload:
      return Tm(e);
    case ke.TransactionAuthField:
      return E$(e);
    case ke.MessageSignature:
      return eh(e);
  }
}
function k$() {
  return {
    type: ke.Address,
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
      return ua(e, V$(r[0].data));
    case At.SerializeP2WPKH:
      return ua(e, Y$(r[0].data));
    case At.SerializeP2SH:
    case At.SerializeP2SHNonSequential:
      return ua(e, X$(n, r.map(ol)));
    case At.SerializeP2WSH:
    case At.SerializeP2WSHNonSequential:
      return ua(e, q$(n, r.map(ol)));
  }
}
function Da(e) {
  const t = [];
  return t.push(Nt(Oa(e.version, 1))), t.push(Nt(e.hash160)), Wt(t);
}
function Do(e) {
  const t = Dl(Ze(e.readBytes(1))), n = Ze(e.readBytes(20));
  return { type: ke.Address, version: t, hash160: n };
}
function Bm(e) {
  const t = [];
  return t.push(e.prefix), t.push(Da(e.address)), e.prefix === $a.Contract && t.push(Fo(e.contractName)), Wt(t);
}
function $$(e) {
  const t = e.readUInt8Enum($a, (s) => {
    throw new Xn(`Unexpected Principal payload type: ${s}`);
  }), n = Do(e);
  if (t === $a.Standard)
    return { type: ke.Principal, prefix: t, address: n };
  const r = ar(e);
  return {
    type: ke.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Fo(e) {
  const t = [], n = Yo(e.content), r = n.byteLength;
  return t.push(Nt(Oa(r, e.lengthPrefixBytes))), t.push(n), Wt(t);
}
function ar(e, t, n) {
  t = t || 1;
  const r = Dl(Ze(e.readBytes(t))), s = Yf(e.readBytes(r));
  return Di(s, t, n ?? 128);
}
function I$(e) {
  return Di(e, 4, 1e5);
}
function M0(e) {
  if (e && Hm(e, rl))
    throw new Error(`Memo exceeds maximum length of ${rl} bytes`);
  return { type: ke.MemoString, content: e };
}
function L$(e) {
  const t = [], n = Yo(e.content), r = K$(Ze(n), rl * 2);
  return t.push(Nt(r)), Wt(t);
}
function Mm(e) {
  let t = Yf(e.readBytes(rl));
  return t = t.replace(/\u0000*$/, ""), { type: ke.MemoString, content: t };
}
function Nm(e) {
  const t = [];
  return t.push(Da(e.address)), t.push(Fo(e.contractName)), t.push(Fo(e.assetName)), Wt(t);
}
function Od(e) {
  return {
    type: ke.AssetInfo,
    address: Do(e),
    contractName: ar(e),
    assetName: ar(e)
  };
}
function nh(e, t) {
  return {
    type: ke.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function rh(e) {
  const t = e.values, n = [];
  n.push(Nt(Oa(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(ns(r));
  return Wt(n);
}
function _m(e, t, n) {
  const r = Dl(Ze(e.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (t) {
      case ke.Address:
        s.push(Do(e));
        break;
      case ke.LengthPrefixedString:
        s.push(ar(e));
        break;
      case ke.MemoString:
        s.push(Mm(e));
        break;
      case ke.AssetInfo:
        s.push(Od(e));
        break;
      case ke.PostCondition:
        s.push(T$(e));
        break;
      case ke.PublicKey:
        s.push(Pd(e));
        break;
      case ke.TransactionAuthField:
        s.push(A$(e));
        break;
    }
  return nh(s, n);
}
function C$(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Bm(e.principal)), (e.conditionType === Pn.Fungible || e.conditionType === Pn.NonFungible) && t.push(Nm(e.assetInfo)), e.conditionType === Pn.NonFungible && t.push(Yt(e.assetName)), t.push(e.conditionCode), e.conditionType === Pn.STX || e.conditionType === Pn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new gi("The post-condition amount may not be larger than 8 bytes");
    t.push(Qs(e.amount, !1, 8));
  }
  return Wt(t);
}
function T$(e) {
  const t = e.readUInt8Enum(Pn, (o) => {
    throw new Xn(`Could not read ${o} as PostConditionType`);
  }), n = $$(e);
  let r, s, i;
  switch (t) {
    case Pn.STX:
      return r = e.readUInt8Enum(ka, (a) => {
        throw new Xn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ze(e.readBytes(8))}`), {
        type: ke.PostCondition,
        conditionType: Pn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Pn.Fungible:
      return s = Od(e), r = e.readUInt8Enum(ka, (a) => {
        throw new Xn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ze(e.readBytes(8))}`), {
        type: ke.PostCondition,
        conditionType: Pn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Pn.NonFungible:
      s = Od(e);
      const o = cr(e);
      return r = e.readUInt8Enum(Md, (a) => {
        throw new Xn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ke.PostCondition,
        conditionType: Pn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Kr(e, t) {
  return Wt([e, t]);
}
function B$(e) {
  return new Uint8Array([e.type]);
}
function M$(e) {
  return e.type === oe.OptionalNone ? new Uint8Array([e.type]) : Kr(e.type, Yt(e.value));
}
function N$(e) {
  const t = new Uint8Array(4);
  return Oi(t, e.buffer.length, 0), Kr(e.type, Fl(t, e.buffer));
}
function _$(e) {
  const t = Vf(j4(e.value, BigInt(n8)), hm);
  return Kr(e.type, t);
}
function P$(e) {
  const t = Vf(e.value, hm);
  return Kr(e.type, t);
}
function U$(e) {
  return Kr(e.type, Da(e.address));
}
function H$(e) {
  return Kr(e.type, Fl(Da(e.address), Fo(e.contractName)));
}
function O$(e) {
  return Kr(e.type, Yt(e.value));
}
function D$(e) {
  const t = [], n = new Uint8Array(4);
  Oi(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Yt(r);
    t.push(s);
  }
  return Kr(e.type, Wt(t));
}
function F$(e) {
  const t = [], n = new Uint8Array(4);
  Oi(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Di(s);
    t.push(Fo(i));
    const o = Yt(e.data[s]);
    t.push(o);
  }
  return Kr(e.type, Wt(t));
}
function Pm(e, t) {
  const n = [], r = t == "ascii" ? dm(e.data) : Yo(e.data), s = new Uint8Array(4);
  return Oi(s, r.length, 0), n.push(s), n.push(r), Kr(e.type, Wt(n));
}
function j$(e) {
  return Pm(e, "ascii");
}
function R$(e) {
  return Pm(e, "utf8");
}
function Yt(e) {
  switch (e.type) {
    case oe.BoolTrue:
    case oe.BoolFalse:
      return B$(e);
    case oe.OptionalNone:
    case oe.OptionalSome:
      return M$(e);
    case oe.Buffer:
      return N$(e);
    case oe.UInt:
      return P$(e);
    case oe.Int:
      return _$(e);
    case oe.PrincipalStandard:
      return U$(e);
    case oe.PrincipalContract:
      return H$(e);
    case oe.ResponseOk:
    case oe.ResponseErr:
      return O$(e);
    case oe.List:
      return D$(e);
    case oe.Tuple:
      return F$(e);
    case oe.StringASCII:
      return j$(e);
    case oe.StringUTF8:
      return R$(e);
    default:
      throw new gi("Unable to serialize. Invalid Clarity Value.");
  }
}
function z$(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const N0 = /* @__PURE__ */ new Map();
function Um(e, t) {
  const n = N0.get(e);
  if (n !== void 0)
    return n(t);
  const r = z$(e);
  return N0.set(e, r), Um(e, t);
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
    return Q4(this.readBytes(4), 0);
  }
  readUInt8() {
    return Z4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return q4(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Ze(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Ze(n);
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
    if (Um(t, r))
      return r;
    throw n(r);
  }
}
function cr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new ga(Nt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new ga(e) : t = e;
  switch (t.readUInt8Enum(oe, (r) => {
    throw new Xn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case oe.Int:
      return s$(t.readBytes(16));
    case oe.UInt:
      return In(t.readBytes(16));
    case oe.Buffer:
      const r = t.readUInt32BE();
      return km(t.readBytes(r));
    case oe.BoolTrue:
      return Am();
    case oe.BoolFalse:
      return Em();
    case oe.PrincipalStandard:
      const s = Do(t);
      return e$(s);
    case oe.PrincipalContract:
      const i = Do(t), o = ar(t);
      return vm(i, o);
    case oe.ResponseOk:
      return o$(cr(t));
    case oe.ResponseErr:
      return i$(cr(t));
    case oe.OptionalNone:
      return $m();
    case oe.OptionalSome:
      return Im(cr(t));
    case oe.List:
      const a = t.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(cr(t));
      return a$(c);
    case oe.Tuple:
      const d = t.readUInt32BE(), h = {};
      for (let v = 0; v < d; v++) {
        const L = ar(t).content;
        if (L === void 0)
          throw new Xn('"content" is undefined');
        h[L] = cr(t);
      }
      return Ir(h);
    case oe.StringASCII:
      const u = t.readUInt32BE(), w = K4(t.readBytes(u));
      return Et(w);
    case oe.StringUTF8:
      const y = t.readUInt32BE(), S = Yf(t.readBytes(y));
      return c$(S);
    default:
      throw new Xn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const G$ = (e) => e.length % 2 == 0 ? e : `0${e}`, K$ = (e, t) => e.padEnd(t, "0"), Hm = (e, t) => e ? Yo(e).length > t : !1;
function Dd(e) {
  return nw(e);
}
const Ia = (e) => x8(Jf(e)), sh = (e) => Ze(Z8(e)), V$ = (e) => Ze(Ia(e)), Y$ = (e) => {
  const t = Ia(e), n = Fl(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ia(n);
  return Ze(r);
}, X$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = Wt(n), s = Ia(r);
  return Ze(s);
}, q$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Wt(n), s = Jf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Wt(i), a = Ia(o);
  return Ze(a);
};
function W$(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Om(e) {
  const t = Yt(e);
  return `0x${Ze(t)}`;
}
function Z$(e) {
  return cr(e);
}
const Ao = (e) => {
  try {
    return Vi.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function ih() {
  return {
    type: ke.MessageSignature,
    data: Ze(new Uint8Array(jl))
  };
}
function Dm(e, t, n, r) {
  const s = th(0, e, 1, [Oo(t)]).hash160, i = Xo(Oo(t)) ? Ht.Compressed : Ht.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Ln(n, !1),
    fee: Ln(r, !1),
    keyEncoding: i,
    signature: ih()
  };
}
function La(e) {
  return "signature" in e;
}
function _0(e) {
  return e === At.SerializeP2SH || e === At.SerializeP2WSH;
}
function J$(e) {
  return e === At.SerializeP2SHNonSequential || e === At.SerializeP2WSHNonSequential;
}
function P0(e) {
  const t = Dd(e);
  return t.nonce = 0, t.fee = 0, La(t) ? t.signature = ih() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Q$(e) {
  const t = [
    e.hashMode,
    Nt(e.signer),
    Qs(e.nonce, !1, 8),
    Qs(e.fee, !1, 8),
    e.keyEncoding,
    eh(e.signature)
  ];
  return Wt(t);
}
function e6(e) {
  const t = [
    e.hashMode,
    Nt(e.signer),
    Qs(e.nonce, !1, 8),
    Qs(e.fee, !1, 8)
  ], n = nh(e.fields);
  t.push(rh(n));
  const r = new Uint8Array(2);
  return W4(r, e.signaturesRequired, 0), t.push(r), Wt(t);
}
function t6(e, t) {
  const n = Ze(t.readBytes(20)), r = BigInt(`0x${Ze(t.readBytes(8))}`), s = BigInt(`0x${Ze(t.readBytes(8))}`), i = t.readUInt8Enum(Ht, (a) => {
    throw new Xn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === At.SerializeP2WPKH && i != Ht.Compressed)
    throw new Xn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function n6(e, t) {
  const n = Ze(t.readBytes(20)), r = BigInt("0x" + Ze(t.readBytes(8))), s = BigInt("0x" + Ze(t.readBytes(8))), i = _m(t, ke.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const d of i)
    switch (d.contents.type) {
      case ke.PublicKey:
        Xo(d.contents) || (o = !0);
        break;
      case ke.MessageSignature:
        if (d.pubKeyEncoding === Ht.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Si("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (o && (e === At.SerializeP2WSH || e === At.SerializeP2WSHNonSequential))
    throw new Si("Uncompressed keys are not allowed in this hash mode");
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
  return La(e) ? Q$(e) : e6(e);
}
function vu(e) {
  const t = e.readUInt8Enum(At, (n) => {
    throw new Xn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === At.SerializeP2PKH || t === At.SerializeP2WPKH ? t6(t, e) : n6(t, e);
}
function Fm(e, t, n, r) {
  const i = e + Ze(new Uint8Array([t])) + Ze(Qs(n, !1, 8)) + Ze(Qs(r, !1, 8));
  if (Nt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return sh(Nt(i));
}
function jm(e, t, n) {
  const r = 33 + jl, s = Xo(t) ? Ht.Compressed : Ht.Uncompressed, i = e + G$(s.toString(16)) + n.data, o = Nt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return sh(o);
}
function r6(e, t, n, r, s) {
  const i = Fm(e, t, n, r), o = g$(s, i), a = y$(s), c = jm(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Rm(e, t, n, r, s, i) {
  const o = Fm(e, t, n, r), a = Oo(l$(o, i, s)), c = jm(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function s6() {
  const e = Dm(At.SerializeP2PKH, "", 0, 0);
  return e.signer = k$().hash160, e.keyEncoding = Ht.Compressed, e.signature = ih(), e;
}
function U0(e, t, n) {
  return La(e) ? i6(e, t, n) : o6(e, t, n);
}
function i6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Rm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), i = th(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new Si(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function o6(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case ke.PublicKey:
        Xo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case ke.MessageSignature:
        c.pubKeyEncoding === Ht.Uncompressed && (i = !0);
        const { pubKey: d, nextSigHash: h } = Rm(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (_0(e.hashMode) && (s = h), r.push(d), o += 1, o === 65536)
          throw new Si("Too many signatures");
        break;
    }
  if (_0(e.hashMode) && o !== e.signaturesRequired || J$(e.hashMode) && o < e.signaturesRequired)
    throw new Si("Incorrect number of signatures");
  if (i && (e.hashMode === At.SerializeP2WSH || e.hashMode === At.SerializeP2WSHNonSequential))
    throw new Si("Uncompressed keys are not allowed in this hash mode");
  const a = th(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Si(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function zm(e) {
  return {
    authType: Rt.Standard,
    spendingCondition: e
  };
}
function Gm(e, t) {
  return {
    authType: Rt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Dm(At.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function H0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Rt.Standard:
        return zm(P0(e.spendingCondition));
      case Rt.Sponsored:
        return Gm(P0(e.spendingCondition), s6());
      default:
        throw new al("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function a6(e, t) {
  switch (e.authType) {
    case Rt.Standard:
      return U0(e.spendingCondition, t, Rt.Standard);
    case Rt.Sponsored:
      return U0(e.spendingCondition, t, Rt.Standard);
    default:
      throw new al("Invalid origin auth type");
  }
}
function c6(e, t) {
  switch (e.authType) {
    case Rt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Ln(t, !1)
      };
      return { ...e, spendingCondition: n };
    case Rt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Ln(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function l6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Ln(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function u6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Ln(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function d6(e, t) {
  const n = {
    ...t,
    nonce: Ln(t.nonce, !1),
    fee: Ln(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function f6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Rt.Standard:
      t.push(Su(e.spendingCondition));
      break;
    case Rt.Sponsored:
      t.push(Su(e.spendingCondition)), t.push(Su(e.sponsorSpendingCondition));
      break;
  }
  return Wt(t);
}
function h6(e) {
  const t = e.readUInt8Enum(Rt, (r) => {
    throw new Xn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Rt.Standard:
      return n = vu(e), zm(n);
    case Rt.Sponsored:
      n = vu(e);
      const r = vu(e);
      return Gm(n, r);
  }
}
class p6 {
  constructor(t, n, r, s, i, o, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ln(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? e8, this.postConditionMode = i ?? Ho.Deny, this.postConditions = s ?? nh([]), o)
      this.anchorMode = i8(o);
    else
      switch (r.payloadType) {
        case qe.Coinbase:
        case qe.CoinbaseToAltRecipient:
        case qe.NakamotoCoinbase:
        case qe.PoisonMicroblock:
        case qe.TenureChange:
          this.anchorMode = _n.OnChainOnly;
          break;
        case qe.ContractCall:
        case qe.SmartContract:
        case qe.VersionedSmartContract:
        case qe.TokenTransfer:
          this.anchorMode = _n.Any;
          break;
      }
  }
  signBegin() {
    const t = Dd(this);
    return t.auth = H0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Dd(this);
    return t.auth = H0(t.auth), t.txid();
  }
  verifyOrigin() {
    return a6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Rt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Rt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Rt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !La(n)) {
      const r = Xo(t);
      n.fields.push(xo(r ? Ht.Compressed : Ht.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = r6(n, r, t.fee, t.nonce, s);
    return La(t) ? t.signature = i : t.fields.push(xo(s.data.byteLength === fm ? Ht.Compressed : Ht.Uncompressed, i)), o;
  }
  txid() {
    const t = this.serialize();
    return sh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Rt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = d6(this.auth, t);
  }
  setFee(t) {
    this.auth = c6(this.auth, t);
  }
  setNonce(t) {
    this.auth = l6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Rt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = u6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new gi('"version" is undefined');
    if (this.chainId === void 0)
      throw new gi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new gi('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new gi('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new gi('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Oi(n, this.chainId, 0), t.push(n), t.push(f6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(rh(this.postConditions)), t.push(Tm(this.payload)), Wt(t);
  }
}
function So(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new ga(Nt(e.slice(2))) : t = new ga(Nt(e)) : e instanceof Uint8Array ? t = new ga(e) : t = e;
  const n = t.readUInt8Enum(sl, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = h6(t), i = t.readUInt8Enum(_n, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = t.readUInt8Enum(Ho, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = _m(t, ke.PostCondition), c = v$(t);
  return new p6(n, s, c, a, o, i, r);
}
const g6 = n$, ya = In, y6 = km;
const w6 = /* @__PURE__ */ new Set([4001, -31001]), m6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], b6 = ["result", "data", "payload", "response", "params"], O0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Gl = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), Wi = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, as = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, x6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Km = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => x6(i, r)) === s
  );
}, Vm = (e) => e ? Km(Wi()).some(
  (t) => {
    var n;
    return t.id === e && (Gl(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ym = () => {
  if (typeof window > "u")
    return;
  const e = Wi(), t = Km(e).filter(
    (n) => {
      var r;
      return Gl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = as(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of m6) {
    const r = as(e, n) ?? (e === window ? void 0 : as(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, S6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = Wi(), n = as(t, e) ?? (t === window ? void 0 : as(window, e)) ?? Tl(e);
  if (n)
    return n;
  if (Gl(e) || Vm(e))
    return Ym();
}, wc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, v6 = ["blockstack-session", "blockstack"], A6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of v6) {
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
const Xm = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, Yn = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, E6 = (e) => {
  const t = Yn(e);
  if (!t)
    return null;
  const n = Xm(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, k6 = (e) => {
  const t = Yn(e);
  if (!t)
    return null;
  const n = Xm(t);
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
}, Ei = (e) => {
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
    return Ao(s) ? s : null;
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
  return typeof n.mainnet == "string" && Ao(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ao(n.testnet) ? n.testnet.trim() : null;
}, D0 = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, qm = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && w6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Fi = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = Yn(n == null ? void 0 : n.message) ?? Yn(t.message) ?? Yn(t.error) ?? Yn(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, jo = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw Fi(t);
    if (t.status === "error")
      throw Fi(t.result ?? t);
  }
  return e;
}, F0 = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return jo(r);
  } catch (r) {
    throw Fi(r);
  }
}, Wm = () => Ym(), oh = () => {
  if (typeof window > "u")
    return;
  const e = Wi();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = as(e, t) ?? (e === window ? void 0 : as(window, t));
    if (n)
      return n;
  }
}, j0 = () => {
  if (typeof window > "u")
    return;
  const e = oh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = Wi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = as(t, n) ?? (t === window ? void 0 : as(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Pc = (e) => {
  var r, s;
  const t = Bi();
  if (Gl(t) || Vm(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Wi() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === Wm();
}, Au = (e) => {
  const t = k6(e);
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
  const n = Au(e), r = E6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Yn(e) ?? void 0 : void 0
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
  for (const a of O0)
    if (Au(s[a])) {
      i = Yn(s[a]);
      break;
    }
  const o = Yn(s.txId) || Yn(s.txid) || Yn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Yn(s.txRaw) ?? void 0
    };
  for (const a of O0) {
    const c = Au(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Yn(s[a]) ?? void 0
      };
  }
  for (const a of b6) {
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
}, Eu = (e) => {
  const t = cl(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, $6 = (e) => {
  const t = cl(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, I6 = (e) => ({
  ...e,
  fee: Ei(e.fee),
  nonce: Ei(e.nonce),
  sponsored: e.sponsored === !0
}), R0 = (e) => ({
  recipient: e.recipient,
  amount: Ei(e.amount) ?? "0",
  memo: e.memo,
  network: Fd(e.network),
  address: e.stxAddress,
  fee: Ei(e.fee),
  nonce: Ei(e.nonce),
  sponsored: e.sponsored ?? !1
}), Zm = "WALLET_ADDRESS_MISMATCH", L6 = 45e3;
let wa = null;
const jd = (e) => {
  e && (wa = { address: e, at: Date.now() });
}, C6 = () => {
  wa = null;
}, T6 = () => wa && Date.now() - wa.at <= L6 ? wa.address : null, B6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, M6 = async (e) => {
  C6();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = jo(await e.request("wallet_connect")), n = Ca(t);
  return jd(n), n;
}, N6 = async (e, t, n, r) => {
  try {
    return jo(await e.request(t, n));
  } catch (s) {
    const i = Fi(s);
    if (!B6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: i.message
    });
    let o = null;
    try {
      o = await M6(e);
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
        { code: o ? Zm : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: o });
    try {
      return jo(await e.request(t, n));
    } catch (a) {
      throw Fi(a);
    }
  }
};
let z0 = 3e4;
const _6 = (e, t) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${z0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, z0);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, P6 = async (e, t, n) => {
  const r = (c, d) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${d}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Zm }
      );
    return c;
  }, s = T6();
  if (s)
    return wc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  wc(n, "account-read");
  try {
    const c = jo(
      await _6(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ca(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (qm(c))
      throw Fi(c);
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
    }), Fi(c);
  }
  const a = Ca(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return jd(a), r(a, "wallet_connect");
}, U6 = async (e, t) => {
  if (!Pc(e)) {
    const i = await F0(
      e,
      "stx_transferStx",
      R0(t)
    );
    return Eu(i);
  }
  const n = oh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await F0(
      n,
      "stx_transferStx",
      R0(t)
    );
    return Eu(i);
  }
  const r = Wm();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await P6(r, t.stxAddress);
  const s = await N6(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Ei(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Ei(t.fee) } : {}
    },
    t.stxAddress
  );
  return Eu(s);
}, H6 = () => Bi(), Jm = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = Bi(), t = e ? S6(e) : void 0;
  if (t)
    return t;
  const n = Wi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, G0 = (e, t) => {
  const n = Jm(), r = I6({
    ...e,
    onFinish: (s) => {
      var i;
      (i = e.onFinish) == null || i.call(e, $6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return hc(r, t);
  if (Pc(n) && !oh()) {
    const s = j0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Bi(),
        route: "legacy-transaction-request"
      }), hc(r, s);
  }
  return void U6(n, e).then((s) => {
    var i;
    (i = e.onFinish) == null || i.call(e, s);
  }).catch((s) => {
    var i, o;
    if (D0(s) && Pc(n)) {
      const a = j0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Bi(),
          route: "legacy-transaction-request"
        }), hc(r, a);
        return;
      }
    }
    if (D0(s) && !Pc(n)) {
      hc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), qm(s)) {
      (i = e.onCancel) == null || i.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (o = e.onCancel) == null || o.call(e);
  });
}, O6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), K0 = (e) => Om(e).replace(/^0x/, ""), V0 = "This wallet cannot sign messages. Try Xverse or Leather.", Y0 = (e) => typeof (e == null ? void 0 : e.request) == "function", X0 = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", D6 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, F6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function j6(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: K0(t.message),
    domain: K0(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function R6(e, t) {
  const n = await _4({
    domain: t.domain,
    message: t.message,
    network: Ol(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? O6()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function ku(e) {
  var s, i;
  const t = H6() || "", n = /xverse/i.test(t);
  let r = Jm();
  if (n && !X0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (X0(r))
    try {
      return await R6(r, e);
    } catch (o) {
      if (n || !Y0(r) || !F6(o)) throw o;
    }
  if (!n && Y0(r))
    try {
      return await j6(r, e);
    } catch (o) {
      throw D6(o) ? new Error(V0) : o;
    }
  throw new Error(V0);
}
const q0 = 1000000n, ss = 1000000n, ll = 50n, Xt = 3000n, Lr = 300n, ra = 3000n, z6 = 50000n, $u = 200n, Kl = 15000n, bn = (e) => e + ll;
function br(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / q0}.${(n % q0).toString().padStart(6, "0")}`;
}
function W0(e, t = Lr) {
  return e <= Xt ? 0 : Number((e - Xt) / bn(t));
}
function Iu(e, t = 0n) {
  const n = ss - e - t;
  return n > 0n ? n : 0n;
}
function G6(e, t = Lr) {
  return e > ss ? "over" : e < Xt + bn(t) ? "empty" : e < z6 ? "low" : "ok";
}
const K6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", V6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", Y6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function X6(e) {
  var n, r, s, i;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = t["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || Y6.some((o, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== K6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Qm = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Lu = 3, q6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", W6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", Z0 = 1, [Rd, eb] = Qm.split("."), rr = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function zd(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function Z6(e) {
  return rr(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function Zs(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function tb(e, t = []) {
  const n = await Zs(`/v2/contracts/call-read/${Rd}/${eb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Rd, arguments: t.map((r) => "0x" + rr(Yt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Sr(cr(n.result));
}
async function J6() {
  const e = await Zs(`/v2/contracts/source/${Rd}/${eb}?proof=0`);
  if (typeof e.source != "string" || await Z6(e.source) !== V6) throw Error("Deployed source does not match the tested helper.");
  if (X6(await tb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function nb(e) {
  return e.startsWith("SP") && Ao(e) && !e.includes(".");
}
async function Q6(e) {
  var r;
  if (!nb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await Zs(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await Zs(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function e5(e) {
  const t = await Zs(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function t5(e, t) {
  var s, i;
  const n = await tb("get-owner", [ya(e), ya(t)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !nb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function n5(e, t) {
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
async function r5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function s5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = So(zd(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || bo(ua(il.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const i = t.postConditions.values[0];
    if (r.payloadType !== 2 || bo(r.contractAddress) + "." + r.contractName.content !== Qm || r.functionName.content !== "play" || r.functionArgs.length !== 3 || rr(Yt(r.functionArgs[0])) !== rr(Yt(ya(e.core))) || rr(Yt(r.functionArgs[1])) !== rr(Yt(ya(e.song))) || rr(Yt(r.functionArgs[2])) !== rr(Yt(y6(zd(e.id)))) || e.amount !== "50" || t.postConditionMode !== Ho.Deny || t.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ka.Equal || i.principal.prefix !== 2 || bo(i.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || bo(r.contractAddress) + "." + r.contractName.content !== q6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || rr(Yt(r.functionArgs[0])) !== rr(Yt(ya(e.song))) || typeof e.liked != "boolean" || rr(Yt(r.functionArgs[1])) !== rr(Yt(g6(e.liked))) || e.amount !== "0" || t.postConditionMode !== Ho.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Sr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const i5 = "xtrata.xyz/radio/listening-wallet", o5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Hr = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && Ao(e), a5 = (e) => ({
  domain: Ir({ name: Et(i5), version: Et("1"), "chain-id": In(1) }),
  message: Ir({
    purpose: Et(o5),
    main: Et(e.main),
    listening: Et(e.listening),
    issued: In(e.issued)
  })
}), rb = 100000n, c5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function l5(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !Hr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= rb).sort(c5);
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
async function u5(e, t, n = 4) {
  if (!Hr(e)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${e}/stx_inbound?limit=${mc}&offset=${o}`, s = ul(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - mc);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= mc ? s : ul(await t(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = l5(a.transfers, e);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - mc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const es = 50, d5 = 6, f5 = 20, J0 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function Q0(e, t) {
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
async function h5(e, t, n) {
  if (!Hr(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${es}&offset=0`));
    if (!s || s.total > d5 * es) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = es; o < s.total; o += es) {
      const a = ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${es}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (d) => `/extended/v1/address/${e}/transactions?limit=${es}&offset=${d}`, a = Q0(await t(o(0)), e);
      if (!a || a.total > f5 * es) return { ok: !1 };
      const c = new Set(a.rows);
      for (const d of a.sent) i.set(d.txId, d);
      for (let d = es; d < a.total; d += es) {
        const h = Q0(await t(o(d)), e);
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
function p5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((u) => u && typeof u.sender == "string" && u.sender !== t && /^\d+$/.test(u.amount) && BigInt(u.amount) > 0n).sort(J0).map((u, w) => {
    const y = BigInt(u.amount);
    return r && u.sender === r.sender ? { sender: u.sender, left: y, kind: "gift", to: r.payer, at: w } : Hr(u.sender) && y >= rb ? { sender: u.sender, left: y, kind: "deposit", to: u.sender, at: w } : { sender: u.sender, left: y, kind: "dust", to: null, at: w };
  }), i = s.reduce((u, w) => u + w.left, 0n), o = [...e.outgoing].filter((u) => u && u.recipient !== t && Hr(u.recipient) && u.amount > 0n).sort(J0), a = o.reduce((u, w) => u + w.amount, 0n), c = i - n - a;
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
function g5(e, t) {
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
function eg(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const bc = 1500n, Uc = [100, 250, 500], y5 = (e, t) => BigInt(e) * bn(t), sa = ["prepared", "signed", "unknown", "pending"], w5 = 30 * 6e4, dl = 6e4, lo = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, m5 = 3e3, fl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Cu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function b5(e) {
  let t = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, d = null, h = !1, u = !1, w = !1, y = null, S = !1, v = "", L = "", P = 0, H, A = null, M, U = [], V, le = -1 / 0;
  const ne = /* @__PURE__ */ new Set();
  let q = null, m = !1, I = 0, N = null, _ = null, W = !1, F = null, de = !1, fe = null, He = !1, $ = !1, j = !1, he = !1, ye = !1, Te = 0, Be = null, Ct = Promise.resolve();
  const Ue = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Lr.toString()), Me = (b) => !!i && !(i.features ?? []).includes(b), Ne = (b, E) => `xtrata.ppp.v1.${b}:${E}`, Zt = "xtrata.ppp.v1.as-main", Gt = () => {
    if (e.main()) return;
    const b = e.store.get(Zt);
    return b && Hr(b) ? b : void 0;
  }, Qe = () => e.main() ?? Gt(), Lt = (b = i == null ? void 0 : i.address) => {
    if (!b) return [];
    try {
      const E = JSON.parse(e.store.get(Ne("entries", b)) || "[]");
      return Array.isArray(E) ? E : [];
    } catch {
      return [];
    }
  }, St = (b) => {
    const E = [b, ...Lt(b.address).filter((G) => !(G.txid === b.txid && G.kind === b.kind))].slice(0, 200);
    e.store.set(Ne("entries", b.address), JSON.stringify(E));
  }, z = (b = i == null ? void 0 : i.address) => !!b && e.store.get(Ne("on", b)) !== "0", O = (b) => {
    i != null && i.address && e.store.set(Ne("on", i.address), b ? "1" : "0");
  }, ae = () => Lt().filter((b) => sa.includes(b.status)), Q = () => Je() ? [...ae(), ...Lt(je()).filter((b) => sa.includes(b.status))] : ae(), ue = () => et(i == null ? void 0 : i.address), et = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(e.store.get(Ne("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, $e = (b, E = i == null ? void 0 : i.address) => {
    E && e.store.set(Ne("deposit", E), JSON.stringify(b));
  };
  let _e = null;
  const ct = (b = dl) => {
    const E = e.now();
    _e = { since: _e && E < _e.until ? _e.since : E, until: Math.max((_e == null ? void 0 : _e.until) ?? 0, E + b) };
  }, Le = () => !!_e && e.now() < _e.until && (o === void 0 || o < Xt + bn(Ue())), Se = () => !!ue() || Le(), je = () => Me("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), Je = () => !!(i != null && i.address) && je() !== i.address, Ae = () => Je() ? c && c.for === je() ? c.value : void 0 : o, Jt = (b) => b !== void 0 && b < Xt + $u, rn = () => ae().filter((b) => e.now() - b.created > w5 && ne.has(b.txid)), Kt = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!Qe() || r === Qe() && !t.allowed), gt = () => Kt() && !(i != null && i.linked), fn = () => {
    const b = Qe();
    return !gt() && !!b && !!(i != null && i.linked) && i.linked !== b;
  }, Hn = (b) => Ne("return-to", b), lr = (b = i == null ? void 0 : i.address) => {
    if (!b) return;
    const E = e.store.get(Hn(b));
    return E && Hr(E) && E !== b ? E : void 0;
  }, Vr = (b = i == null ? void 0 : i.address) => q && q.for === b ? q.res : null;
  function k() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const b = lr();
    if (b) return { to: b, kind: "chosen" };
    const E = Vr();
    if (E != null && E.ok && E.funder) return { to: E.funder, kind: "funder" };
  }
  const R = (b) => Ne("gift", b);
  function K() {
    const b = i == null ? void 0 : i.address;
    if (!b) return null;
    if ((F == null ? void 0 : F.for) === b) return F.info;
    try {
      const E = JSON.parse(e.store.get(R(b)) || "null");
      return E && typeof E.returnTo == "string" && typeof E.treasury == "string" ? E : null;
    } catch {
      return null;
    }
  }
  const Y = () => (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : ((i == null ? void 0 : i.slot) ?? 0) === 0 ? i == null ? void 0 : i.address : void 0;
  let ee = null, we = null, Oe = !1;
  const ft = (b) => Ne("award-claim", b), Xe = (b) => Ne("award-send", b), C = (b) => {
    try {
      const E = JSON.parse(e.store.get(Xe(b)) || "null");
      return E && typeof E.txid == "string" && e.now() - E.at < 2 * 36e5 ? E : null;
    } catch {
      return null;
    }
  }, ce = (b) => {
    try {
      const E = JSON.parse(e.store.get(ft(b)) || "null");
      return E && typeof E.txid == "string" && e.now() - E.at < 2 * 36e5 ? E : null;
    } catch {
      return null;
    }
  };
  async function tt(b = !1) {
    const E = Y();
    if (!E || !e.awardStatus || Oe) return;
    const G = (ee == null ? void 0 : ee.for) === E ? ee : null, te = G == null ? void 0 : G.view.state, l = G ? te === "off" || te === "not-a-player" ? 30 * 6e4 : ce(E) || C(E) ? 2e4 : te === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(G && !b && e.now() - G.at < l)) {
      Oe = !0;
      try {
        const p = await e.awardStatus(E);
        if (ee = { for: E, view: p, at: e.now() }, p.state === "claimed" && e.store.set(ft(E), ""), p.state === "claimed" && p.holds === !1 && e.store.set(Xe(E), ""), p.state === "ready" && e.awardName && (we == null ? void 0 : we.for) !== E)
          try {
            we = { for: E, name: await e.awardName(E), at: e.now() };
          } catch {
            we = { for: E, name: void 0, at: e.now() };
          }
      } catch {
        ee = { for: E, view: G && G.view.state !== "off" && G.view.state !== "not-a-player" ? { ...G.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        Oe = !1;
      }
    }
  }
  function it() {
    const b = Y();
    if (!b || (ee == null ? void 0 : ee.for) !== b) return null;
    const E = ee.view;
    if (E.state === "off" || E.state === "not-a-player") return null;
    const G = E.state === "claimed" ? null : ce(b), te = E.state === "claimed" && E.holds !== !1 ? C(b) : null;
    return { ...E, ...(we == null ? void 0 : we.for) === b ? { name: we.name } : {}, ...G ? { claimTx: G.txid } : {}, ...te ? { sendTx: te.txid } : {} };
  }
  async function lt() {
    var l;
    const b = i == null ? void 0 : i.address;
    if (!b || !e.giftInfo || !((l = t == null ? void 0 : t.gifts) != null && l.enabled) || de) return;
    const E = (F == null ? void 0 : F.for) === b ? F : null, G = E ? E.ok ? E.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (E && e.now() - E.at < G) return;
    de = !0;
    const te = K();
    try {
      const p = await e.giftInfo(b);
      F = { for: b, info: p, ok: !0, at: e.now() }, e.store.set(R(b), JSON.stringify(p));
    } catch {
      F = { for: b, info: te, ok: !1, at: e.now() };
    } finally {
      de = !1;
    }
  }
  const yt = () => Lt().reduce((b, E) => sa.includes(E.status) ? b + BigInt(E.amount || "0") + BigInt(E.fee || "0") : b, 0n);
  function Ot() {
    if (o === void 0) return 0;
    const b = o - yt() - BigInt(kt.length) * bn(Ue());
    return b > 0n ? W0(b, Ue()) : 0;
  }
  const Dt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", _t = "EMPTY — ADD STX TO PLAY";
  function Yr() {
    if (!(t != null && t.here)) return null;
    const b = (E, G) => ({ reason: E, text: G });
    switch (Sn()) {
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
        return Se() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", Je() ? Dt : _t);
      case "ready":
        return !z() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= e.now() ? b("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : j ? Ot() < 1 ? b("out", Je() ? Dt : _t) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Re = () => {
    var b;
    return !!(i != null && i.address) && Je() && !!((b = K()) != null && b.player);
  };
  function Cn() {
    return Re() ? { locked: !0, known: !0 } : null;
  }
  const ti = 3 * 6e4, ni = () => !!K() && !!e.history && !(i != null && i.linked);
  async function Zi() {
    const b = i.address, E = K(), { balance: G, nonce: te } = await e.chain.account(b), l = await e.history(b, !0);
    if (!l.ok) return null;
    const p = p5({ self: b, balance: G, inbound: l.inbound, outgoing: l.outgoing, gift: { sender: E.treasury, payer: E.returnTo } });
    if (!p.ok) return null;
    const g = g5(p.parts, ra);
    return { balance: G, nonce: te, parts: p.parts, steps: g.steps, tooSmall: g.tooSmall.length };
  }
  const ds = () => He ? { state: "unavailable" } : !fe || e.now() - fe.at > ti || o !== void 0 && o !== fe.balance ? { state: "none" } : fe.plan;
  function Sn() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const b = Qe();
    if (!gt()) {
      if (!b) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : fn() ? "wrong-wallet" : i.state === "known" ? "locked" : !gt() && i.linked !== b ? "link" : o === void 0 ? "loading" : o > ss && !i.backedUp ? "over" : o < Xt + bn(Ue()) ? "fund" : "ready" : "loading";
  }
  const On = () => {
    var b, E, G, te, l;
    return {
      step: Sn(),
      busy: d,
      message: v,
      error: L,
      notice: Ji(),
      gate: t,
      main: Qe(),
      mainConnected: !!e.main(),
      standIn: Gt(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      award: it(),
      unproven: !!(i != null && i.unproven),
      phrase: !!(i != null && i.phrase),
      backedUp: !!(i != null && i.backedUp),
      balance: o,
      balanceState: o === void 0 ? void 0 : ((p) => p === "over" && (i != null && i.backedUp) ? "ok" : p)(G6(o, Ue())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: o !== void 0 && o > ss && !!(i != null && i.backedUp),
      playsLeft: o === void 0 ? 0 : W0(o, Ue()),
      allowance: o === void 0 ? ss : Iu(o, BigInt(((b = ue()) == null ? void 0 : b.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: z(),
      entries: Lt(),
      depositTxid: ((E = ue()) == null ? void 0 : E.txid) ?? H,
      depositPending: Se(),
      arrival: Se() ? { since: ((G = ue()) == null ? void 0 : G.at) ?? (_e == null ? void 0 : _e.since) ?? e.now(), graceMs: dl } : null,
      walletOutdated: Me("like"),
      canAnother: !!i && !Me("another"),
      canForget: !!i && !Me("forget"),
      passkeyName: i == null ? void 0 : i.passkeyName,
      hadGift: i != null && i.address && (F == null ? void 0 : F.for) === i.address && F.ok ? !!F.info : null,
      linkedListening: V && V === Qe() ? U.map((p) => p.listening) : [],
      serverLinked: !!A && M === `${Qe()}:${i == null ? void 0 : i.address}`,
      stuck: rn().length,
      armed: he,
      queued: kt.length,
      solo: gt(),
      returnTo: (te = k()) == null ? void 0 : te.to,
      returnToKind: (l = k()) == null ? void 0 : l.kind,
      funderState: (() => {
        const p = Vr();
        return p ? p.ok ? p.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const p = Vr();
        return !!p && p.ok && p.distinct > 1;
      })(),
      walletCannotSolo: gt() && Me("standalone"),
      walletCannotMulti: Me("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((p) => p !== Qe() && p !== (i == null ? void 0 : i.linked)),
      creditedTo: gt() && (i != null && i.address) && (N == null ? void 0 : N.for) === i.address && N.main ? N.main : void 0,
      createdHere: !!(i != null && i.address) && e.store.get(Ne("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (_ == null ? void 0 : _.for) === i.address && _.unused,
      gift: (() => {
        const p = K();
        return p ? { player: p.player, from: p.from, source: p.source, amount: p.amount, ...p.drop !== void 0 ? { drop: p.drop } : {} } : null;
      })(),
      giftPlays: K() ? Ot() : 0,
      playCost: bn(Ue()),
      giftStop: Yr(),
      albumLock: Cn(),
      returnPlan: ds(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Me("slots"),
      likeFunds: (() => {
        var f;
        const p = je();
        if (!p || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const g = Ae();
        return { address: p, balance: g, low: Jt(g), album: Je(), pending: !!et(p), txid: (f = et(p)) == null ? void 0 : f.txid, main: Qe() };
      })()
    };
  }, Ji = () => P ? P < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", nt = (b, E = "") => {
    v = b, L = E, e.changed();
  };
  async function Vt(b, E) {
    if (!d) {
      d = b, L = "", e.changed();
      try {
        await E();
      } catch (G) {
        const te = G instanceof Error ? G.message : String(G);
        L = /Cancelled in the listening wallet/.test(te) ? "" : te, L || (v = "Not now. Nothing was signed.", ye = !0);
      } finally {
        d = null, await Fn(!0);
      }
    }
  }
  const Tn = () => !!(t != null && t.enabled) && t.here && (gt() || !!Qe() && t.allowed), Bn = () => Tn() && !fn(), Dn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", hn = () => {
    if (fn()) throw new Error(Dn());
  };
  async function vn() {
    if (!Tn()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const sn = (b) => {
    const E = Qe();
    return b.request("listening.status", E ? { main: E } : void 0);
  };
  async function fs(b = !1) {
    i != null && i.address && (!b && e.now() - a < 3e4 || (o = await e.chain.balance(i.address), a = e.now(), await ur(b)));
  }
  async function ur(b = !1) {
    const E = je();
    if (!(!Je() || !E || (i == null ? void 0 : i.state) !== "unlocked") && !(!b && (c == null ? void 0 : c.for) === E && e.now() - c.at < 3e4))
      try {
        c = { for: E, value: await e.chain.balance(E), at: e.now() };
      } catch {
      }
  }
  async function Qi(b) {
    if ((V !== b || e.now() - le >= 6e4) && (U = await e.links(b), V = b, le = e.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === b) return;
    const E = `${b}:${i.address}`;
    M === E && A || (A = U.find((G) => G.listening === i.address) ?? null, M = E);
  }
  async function eo() {
    const b = i == null ? void 0 : i.address;
    if (!gt() || !b || i != null && i.linked || !e.funder || m || !o || o <= 0n) return;
    const E = Vr(b);
    if (E != null && E.ok && E.funder) return;
    const G = E != null && E.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
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
  async function Qt() {
    const b = i == null ? void 0 : i.address;
    if (!(!gt() || !b || i != null && i.linked || !e.mainOf || W) && !(N && N.for === b && (N.ok || e.now() - N.at < 6e4))) {
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
  async function ri() {
    const b = i == null ? void 0 : i.address;
    if (!(!b || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (_ == null ? void 0 : _.for) === b) && e.store.get(Ne("created", b)) !== "1")
      try {
        _ = { for: b, unused: await e.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function si() {
    var l;
    const b = i == null ? void 0 : i.address;
    if (!b) return !1;
    let E, G = !1;
    const te = /* @__PURE__ */ new Map();
    for (const p of Q())
      try {
        const g = await e.chain.transaction(p.txid);
        if (!g) {
          if (ne.add(p.txid), e.now() - p.created > 15 * 6e4 && !te.has(p.address) && te.set(p.address, await e.chain.confirmedNonce(p.address)), E = te.get(p.address), E !== void 0 && E > BigInt(p.nonce)) {
            St({ ...p, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((p.status === "unknown" || p.status === "signed") && p.raw)
            try {
              await e.chain.broadcast(p.raw, p.txid), St({ ...p, status: "pending" });
            } catch (T) {
              lo(T) && St({ ...p, status: "failed", note: T.message, raw: void 0 });
            }
          continue;
        }
        ne.delete(p.txid);
        const f = String(g.tx_status);
        if (f === "success" && g.canonical !== !1 && g.is_unanchored === !1) {
          if (St({ ...p, status: "confirmed", confirmedAt: e.now(), actualFee: String(g.fee_rate ?? p.fee), raw: void 0 }), G = !0, p.kind === "like" && (S = !0, p.status !== "confirmed" && typeof p.liked == "boolean"))
            try {
              (l = e.likeConfirmed) == null || l.call(e, p.song, p.liked);
            } catch {
            }
        } else f.startsWith("abort_") || f.startsWith("dropped_") ? St({ ...p, status: "failed", note: f, raw: void 0 }) : p.status !== "pending" && St({ ...p, status: "pending" });
      } catch {
      }
    for (const p of Je() ? [b, je()] : [b]) {
      const g = et(p);
      if (g)
        try {
          const f = await e.chain.transaction(g.txid), T = String((f == null ? void 0 : f.tx_status) ?? "");
          (T === "success" && f.is_unanchored === !1 || T.startsWith("abort_") || T.startsWith("dropped_") || !f && e.now() - g.at > 2 * 36e5) && ($e(null, p), T === "success" && ct(2e4), a = -1 / 0, c = null, /on its way/i.test(v) && (v = ""));
        } catch {
        }
    }
    return G;
  }
  async function Fn(b = !1) {
    var E;
    try {
      const G = Qe();
      if ((b || !t || r !== G || e.now() - n > 3e5) && (t = await e.config(G), n = e.now(), r = G), !t.enabled || !t.here || !gt() && (!G || !t.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), he && oi(), e.changed();
        return;
      }
      await vn(), i = await sn(s), fn() && i.state === "unlocked" && (fr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await sn(s)), G && t.allowed && await Qi(G), await fs(b), await eo(), await Qt(), await ri(), await lt(), await tt(), await si() && await fs(!0), await ur(), await ys(), P = 0;
    } catch {
      P++;
    }
    if (Sn() === "locked" ? ii() : he && oi(), S) {
      S = !1;
      try {
        (E = e.likesChanged) == null || E.call(e);
      } catch {
      }
    }
    e.changed(), kt.length && !ws && ms();
  }
  async function qo(b) {
    const E = i == null ? void 0 : i.root;
    if (!E || i != null && i.slot || !(i != null && i.address) || Me("slots")) return;
    const G = Number(e.store.get(Ne("slot", E)));
    if (!(!Number.isSafeInteger(G) || G < 1))
      try {
        const { balance: te } = await e.chain.account(i.address);
        if (te >= Xt + bn(Ue())) return;
        await b.request("listening.openSlot", { slot: G }), i = await sn(b), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function hs(b, E) {
    var p;
    hn();
    const G = !(i != null && i.address) || z(i.address), te = i != null && i.linked ? (p = e.nameOf) == null ? void 0 : p.call(e, i.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: G ? ai() : void 0, anyPasskey: E, ...Qe() ? { main: Qe() } : {}, ...te ? { label: te } : {} }), i = await sn(b), G && (z(i.address) ? await Jn() : await b.request("listening.stop")), await qo(b), nt(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const l = y;
    y = null, l && e.now() - l.at < 12e4 && setTimeout(() => void Fn(!0).then(() => Mn(l)), 0);
  }
  function ii() {
    he || d || ye || Te >= 3 || !s || !(i != null && i.address) || (he = !0, Ct = (async () => {
      try {
        await hs(s, !1), Te = 0;
      } catch (b) {
        const E = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(E) ? Be || (ye = !0, nt("Not now. Nothing was signed.")) : /did not answer/.test(E) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Te++, L = E);
      } finally {
        he = !1;
        const b = Be;
        Be = null, b ? await b() : await Fn(!0);
      }
    })());
  }
  async function oi(b) {
    he && (Be = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Ct), b && await b(), e.changed();
  }
  const ai = () => ({
    fee: Ue().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: ss.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function Jn() {
    if (!(i != null && i.address)) return !1;
    if (j || (j = await e.tabLock(i.address)), !j)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function ci(b, E) {
    const G = i.address, { balance: te, nonce: l } = E ?? await e.chain.account(G);
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
    const g = b.mode === "amount" ? b.amount : b.mode === "all" ? te - ra : te - ss - ra, f = So(p.raw);
    if (Sr(f.payload.recipient).value !== b.to || String(f.payload.amount) !== p.amount || g !== void 0 && p.amount !== g.toString())
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
    e.validate(T), St(T);
    try {
      await e.chain.broadcast(p.raw, p.txid), St({ ...T, status: "pending" });
    } catch (X) {
      throw St({ ...T, status: "unknown", note: X.message }), X;
    }
    return p;
  }
  const li = Kl, ps = ra;
  async function to(b, E, G) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Me("slots") || Me("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const te = i.slot ?? 0;
    if (b === E || ![b, E].includes(te) || ![b, E].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const l = i.root ?? i.address, p = b === 0 ? l : i.address, g = E === 0 ? l : i.address, { balance: f, nonce: T } = await e.chain.account(p);
    if (f < G + ps + Xt) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const X = await s.request("listening.signMove", { from: b, to: E, amount: G.toString(), fee: ps.toString(), nonce: T.toString(), balance: f.toString() }), re = So(X.raw);
    if (X.from !== p || X.to !== g || X.amount !== G.toString() || Sr(re.payload.recipient).value !== g || String(re.payload.amount) !== G.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const se = {
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
    e.validate(se), St(se);
    try {
      await e.chain.broadcast(X.raw, X.txid), St({ ...se, status: "pending" });
    } catch (Ee) {
      throw St({ ...se, status: "unknown", note: Ee.message }), Ee;
    }
    return $e({ txid: X.txid, amount: X.amount, at: e.now() }, g), g === l && l !== i.address ? c = null : a = -1 / 0, X;
  }
  let Xr = !1;
  const ui = /* @__PURE__ */ new Map(), gs = (b) => Ne("float", b);
  async function ys() {
    if (Xr || (i == null ? void 0 : i.state) !== "unlocked" || !Je() || Me("move") || Me("rootLike") || !i.address) return;
    const b = i.address;
    if (e.store.get(gs(b)) === "1") return;
    const E = K();
    if (!(E != null && E.player) || E.state !== "arrived") return;
    const G = Ae();
    if (G === void 0 || o === void 0) return;
    if (!Jt(G)) {
      e.store.set(gs(b), "1");
      return;
    }
    if (et(je()) || di() || Q().length || o < li * 4n + Xt + ps) return;
    const te = ui.get(b);
    if (!(te && (te.n >= 3 || e.now() - te.at < 5 * 6e4))) {
      Xr = !0, ui.set(b, { n: ((te == null ? void 0 : te.n) ?? 0) + 1, at: e.now() });
      try {
        await to(i.slot ?? 0, 0, li), e.store.set(gs(b), "1");
      } catch (l) {
        console.warn("[radio] likes float not sent yet", l);
      } finally {
        Xr = !1;
      }
    }
  }
  async function Wo(b) {
    if (ae().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const E = await Zi().catch(() => null);
    if (!E)
      throw fe = null, He = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    He = !1, o = E.balance;
    const G = { balance: E.balance, nonce: E.nonce };
    if (b === "excess") {
      const f = eg(E.parts) ?? lr();
      if (!f) throw new Error("Choose where to send the excess first.");
      await ci({ mode: "excess", to: f, linked: !1 }, G), fe = null, nt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const te = E.steps;
    if (!te.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!fe && fe.balance === E.balance && e.now() - fe.at <= ti && fe.steps.length === te.length && fe.steps.every((f, T) => f.to === te[T].to && f.mode === te[T].mode && f.send === te[T].send))) {
      fe = {
        at: e.now(),
        balance: E.balance,
        steps: te,
        parts: E.parts,
        plan: { state: "ready", steps: te.map((f) => ({ to: f.to, kind: f.kind, send: f.send.toString() })), kept: E.tooSmall, excess: eg(E.parts) }
      }, nt(te.length > 1 ? `This goes back in ${te.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const p = te[0], g = p.to ?? lr();
    if (!g) throw new Error("Choose where to send the rest first.");
    if (p.mode === "amount" && Me("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await ci({ mode: p.mode, to: g, linked: !1, ...p.mode === "amount" ? { amount: p.send } : {} }, G), fe = null, te.length === 1 ? (O(!1), nt("Returned ✓ Paying is off.")) : nt(`Returned ✓ ${te.length - 1} more ${te.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function rt() {
    if (!(i != null && i.unproven)) return;
    const b = await vn();
    await b.request("listening.prove"), i = await sn(b);
  }
  const qr = {
    forceRefresh: () => Fn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (b) => {
      if (!e.main() && !(b !== null && !Hr(b))) {
        if (b === Gt()) return Fn(!0);
        e.store.set(Zt, b ?? ""), L = "", v = "", o = void 0, a = -1 / 0, c = null, await Fn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => Vt("Check the listening wallet…", async () => {
      const b = await vn();
      if (Me("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((i == null ? void 0 : i.state) !== "unlocked" || (i.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (o === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (o > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (ae().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      fr(), await b.request("listening.forget"), o = void 0, i = await sn(b), O(!1), nt("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (b) => Vt("Waiting for your passkey…", async () => {
      const E = await vn(), G = !!(b != null && b.another) && !e.main() && !Me("another");
      G && (i == null ? void 0 : i.state) === "unlocked" && await E.request("listening.lock"), await E.request("listening.unlock", { mode: "create", terms: ai(), ...e.main() ? { main: e.main() } : {}, ...b != null && b.quick && !e.main() ? { quick: !0 } : {}, ...G ? { another: !0 } : {} }), i = await sn(E), i.address && e.store.set(Ne("created", i.address), "1"), O(!0), nt(gt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Jn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (b) => {
      b ? ct() : _e = null, e.changed();
    },
    giftSent: (b, E) => {
      !(i != null && i.address) || ue() || ($e({ txid: b, amount: E.toString(), at: e.now() }), a = -1 / 0, F = null, nt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (hn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Me("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await vn()).request("listening.bindSlot", { slot: b, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, E, G, te) => {
      $e({ txid: G, amount: te.toString(), at: e.now() }, E), F = null, await qr.openAlbum(b), nt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => Vt("Opening…", async () => {
      if (hn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Me("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || u || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === b) return;
      fr(), await s.request("listening.openSlot", { slot: b }), i = await sn(s), o = void 0, a = -1 / 0, fe = null, He = !1;
      const E = i.root;
      E && b > 0 && e.store.set(Ne("slot", E), String(b)), nt(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const E = () => Vt("Waiting for your passkey…", async () => hs(await vn(), b));
      return he ? b ? Me("cancel") ? (nt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : oi(async () => {
        (Sn() === "locked" || Sn() === "intro") && await E();
      }) : Ct : E();
    },
    link: () => Vt("Sign in your wallet…", async () => {
      hn();
      const b = e.main();
      if (!b || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const E = (await e.links(b)).find((G) => G.listening === i.address);
      if (E)
        await s.request("listening.link", { main: b, issued: E.issued, mainSignature: E.mainSignature });
      else {
        const G = { main: b, listening: i.address, issued: e.now() }, te = await e.signWithMain(b, a5(G)), l = await s.request("listening.link", { main: b, issued: G.issued, mainSignature: te });
        await e.saveLink({ ...G, mainSignature: te, listeningSignature: l.listeningSignature }), le = -1 / 0;
      }
      nt("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => i != null && i.unproven ? (await Vt("One more passkey check…", rt), !(i != null && i.unproven)) : !0,
    deposit: () => Vt("Approve the deposit in your wallet…", async () => {
      hn(), await rt();
      const b = e.main();
      if (!b || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (ue()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Le()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await fs(!0);
      const E = Iu(o ?? 0n);
      if (E <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      H = await e.deposit(b, i.address, E), H && $e({ txid: H, amount: E.toString(), at: e.now() }), nt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Vt("Approve the top-up in your wallet…", async () => {
      hn(), await rt();
      const b = e.main(), E = je();
      if (!b || !E) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (et(E)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const G = await e.chain.balance(E);
      Je() ? c = { for: E, value: G, at: e.now() } : (o = G, a = e.now());
      const te = Iu(G);
      if (te <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const l = await e.deposit(b, E, te);
      l && $e({ txid: l, amount: te.toString(), at: e.now() }, E), nt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (b) => Vt("Adding plays…", async () => {
      if (hn(), !Je()) throw new Error("Open the album you want to add plays to first.");
      if (!Uc.includes(b)) throw new Error("Choose one of the amounts offered.");
      const E = y5(b, Ue());
      if (h || u || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (Q().length || ue()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await to(0, i.slot ?? 0, E), nt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Vt("Confirm in the listening wallet…", async () => {
      if (!Bn()) throw new Error("Connect your wallet first.");
      await Jn(), await s.request("listening.approveSession", ai()), O(!0), nt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Vt("Clearing…", async () => {
      for (const b of rn())
        await e.chain.transaction(b.txid) || St({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      nt("Cleared ✓");
    }),
    switchOff: () => Vt("Switching off…", async () => {
      fr(), await (s == null ? void 0 : s.request("listening.stop")), O(!1), nt("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Vt("Showing your backup words in the box…", async () => {
      if (!(i != null && i.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const b = await vn();
      await b.request("listening.backup"), i = await sn(b), nt("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (b, E) => {
      if ((i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Me("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await vn()).request("listening.signShelf", { action: b, ...E ? { release: E } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      we = null, await tt(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (b) => Vt("Confirm in the listening wallet…", async () => {
      var T, X, re, se;
      const E = Y();
      if ((i == null ? void 0 : i.state) !== "unlocked" || !E) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Me("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (ce(E)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || u || w || Q().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await Jn();
      const G = await e.awardNote(E, b), { balance: te, nonce: l } = await e.chain.account(E);
      if (te < bc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const g = await (await vn()).request("listening.signAward", {
        cls: G.cls,
        number: G.number,
        plays: G.plays,
        record: G.record,
        signature: G.signature,
        fee: bc.toString(),
        nonce: l.toString(),
        balance: te.toString()
      }), f = So(g.raw);
      if (g.hero !== E || g.number !== G.number || ((X = (T = f.payload) == null ? void 0 : T.functionName) == null ? void 0 : X.content) !== "claim" || ((se = (re = f.payload) == null ? void 0 : re.contractName) == null ? void 0 : se.content) !== W6.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(g.raw, g.txid), e.store.set(ft(E), JSON.stringify({ txid: g.txid, at: e.now() })), a = -1 / 0, ee && (ee = { ...ee, at: -1 / 0 }), nt("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (b) => Vt("Confirm in the listening wallet…", async () => {
      var X, re, se;
      const E = Y(), G = it();
      if ((i == null ? void 0 : i.state) !== "unlocked" || !E) throw new Error("Unlock your player first.");
      if ((G == null ? void 0 : G.state) !== "claimed" || G.inscription === void 0) throw new Error("There is no record to send yet.");
      if (G.holds === !1) throw new Error("This record has already been sent.");
      if (G.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (C(E)) throw new Error("Your record is already on its way.");
      const te = b.trim();
      if (!Hr(te)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (te === E) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Me("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || u || w || Q().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await Jn();
      const { balance: l, nonce: p } = await e.chain.account(E);
      if (l < bc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const f = await (await vn()).request("listening.signSendRecord", { inscription: G.inscription, recipient: te, fee: bc.toString(), nonce: p.toString(), balance: l.toString() }), T = So(f.raw);
      if (f.from !== E || f.recipient !== te || f.inscription !== G.inscription || ((re = (X = T.payload) == null ? void 0 : X.functionName) == null ? void 0 : re.content) !== "transfer" || Sr((se = T.payload.functionArgs) == null ? void 0 : se[2]).value !== te)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(f.raw, f.txid), e.store.set(Xe(E), JSON.stringify({ txid: f.txid, at: e.now() })), a = -1 / 0, ee && (ee = { ...ee, at: -1 / 0 }), nt("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Vt("Locking…", async () => {
      fr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, nt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const E = String(b ?? "").trim();
      if (!(i != null && i.address)) return nt("", "Unlock the listening wallet first.");
      if (!Hr(E)) return nt("", "Enter a standard mainnet address (it starts with SP).");
      if (E === i.address) return nt("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(Hn(i.address), E), nt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && e.store.set(Hn(i.address), ""), e.changed();
    },
    returnFunds: (b) => Vt("Check the return in the listening wallet…", async () => {
      if (!Bn()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (ni()) return Wo(b);
      const E = k();
      if (!E) throw new Error(gt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (E.kind !== "linked" && Me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ae().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await ci({ mode: b, to: E.to, linked: E.kind === "linked" }), b === "all" && O(!1), nt(b === "all" ? E.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, kt = [], no = 10, dr = 30 * 6e4;
  let ws = !1;
  const di = () => h || !!d || u || w, fr = () => {
    kt.length && (kt.length = 0, e.changed());
  };
  async function Qn(b) {
    if (!kt.some((E) => E.id === b.id) && !Lt().some((E) => E.id === b.id) && (kt.push({ ...b, at: e.now() }), kt.length > no && kt.shift()), di() || ae().length) {
      const E = kt.length;
      v = `Queued ${E === 1 ? "this song" : E + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await ms();
  }
  async function ms() {
    if (!ws) {
      ws = !0;
      try {
        for (; kt.length; ) {
          for (; kt.length && e.now() - kt[0].at > dr; ) kt.shift();
          if (!kt.length || di() || await Wr(kt[0]) === "wait") return;
          kt.shift();
        }
      } finally {
        ws = !1, e.changed();
      }
    }
  }
  async function Wr(b) {
    var E;
    h = !0;
    try {
      await Fn();
      const G = Sn();
      if (G === "loading") return "wait";
      if (G !== "ready" || !z() || !(i != null && i.session) || i.session.playsLeft < 1 || !j) return "done";
      if (ae().length) return "wait";
      $ || (await e.chain.verify(), $ = !0);
      const te = i.address, { balance: l, nonce: p } = await e.chain.account(te);
      o = l, a = e.now();
      const g = await e.chain.owner(Lu, b.song);
      if (g === te || g === Qe()) return "done";
      const f = await s.request("listening.signPlay", {
        core: Lu,
        song: b.song,
        receipt: b.id,
        fee: Ue().toString(),
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
        fee: Ue().toString(),
        nonce: p.toString(),
        created: e.now(),
        status: "signed",
        raw: f.raw,
        txid: f.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(T), St(T);
      const X = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await e.chain.broadcast(f.raw, f.txid), St({ ...T, status: "pending" }), v = `♪ Paid ${X}`, L = "";
      } catch (re) {
        St({ ...T, status: lo(re) ? "failed" : "unknown", note: re.message, ...lo(re) ? { raw: void 0 } : {} }), L = re.message;
      }
      return i = await sn(s), "done";
    } catch (G) {
      const te = G instanceof Error ? G.message : "payment unavailable";
      return (E = K()) != null && E.player ? (v = "Payment is taking a moment: " + te, "wait") : (v = "This song played free: " + te, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function fi(b) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Sn()) || Me("like") ? !1 : (Mn(b), !0);
  }
  async function Mn(b) {
    const E = b.title ? `“${b.title}”` : `song #${b.song}`, G = (x) => {
      var B;
      L = x, v = "";
      try {
        (B = e.likeFailed) == null || B.call(e, b.song);
      } catch {
      }
      e.changed();
    }, te = Je(), l = Sn(), p = Qe(), g = te && (l === "fund" || l === "over") ? "ready" : l, f = gt() ? je() : p;
    if (g === "locked") {
      y = { ...b, at: e.now() }, nt(`Unlock to like ${E}. It sends straight after.`);
      return;
    }
    if (g === "wrong-wallet") return G(Dn());
    if (g === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (gt() && Me("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (g === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (g === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (te) {
      await ur(!0);
      const x = Ae();
      if (Jt(x))
        return e.changed(), G(fl);
    }
    if (g !== "ready" || !f) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!j) return G("Pay-per-play is running in another tab. Like from that tab.");
    const T = Lt(je()).find((x) => x.kind === "like" && x.song === b.song);
    if (T && sa.includes(T.status))
      return G(`Your last like for ${E} is still on its way. It can change again once it confirms.`);
    if (u) return G("One like at a time: your last one is still being sent.");
    if ((T == null ? void 0 : T.status) === "confirmed" && e.now() - (T.confirmedAt ?? 0) < m5)
      return G(`Your like for ${E} has only just confirmed. Try again in a moment.`);
    let X;
    w = !0;
    try {
      X = e.likeState ? (await e.likeState(f, b.song)).by : b.likedBy ?? [];
    } catch {
      X = b.likedBy;
    } finally {
      w = !1;
    }
    if (!X) return G(`Could not check ${E} right now. Try the heart again.`);
    const re = je(), Ee = ((T == null ? void 0 : T.status) === "confirmed" && typeof T.liked == "boolean" && e.now() - (T.confirmedAt ?? T.created) < 5 * 6e4 ? T.liked : void 0) ?? X.includes(re);
    if (!Ee && X.some((x) => x !== re)) return G(gt() ? `${E} was liked from another wallet of yours. Unlike it there.` : `${E} was liked from your main wallet${X.includes(p) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await ro({ song: b.song, liked: !Ee, title: b.title, artist: b.artist });
  }
  async function ro(b) {
    var te, l, p;
    if (u) {
      nt("Still sending your last like. Try again in a moment.");
      return;
    }
    u = !0;
    const E = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, G = e.wait ?? ((g) => new Promise((f) => setTimeout(f, g)));
    try {
      nt(`${b.liked ? "Liking" : "Unliking"} ${E}…`);
      const g = e.now() + 12e4;
      for (; h || (Je() ? Lt(je()).some((Ee) => sa.includes(Ee.status)) : ae().length); ) {
        if (e.now() > g) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await Fn(!0);
      }
      if (!Je() && Sn() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const f = je(), { balance: T, nonce: X } = await e.chain.account(f);
      if (Je() ? c = { for: f, value: T, at: e.now() } : (o = T, a = e.now()), Jt(T)) throw new Error(fl);
      const re = await s.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: $u.toString(),
        nonce: X.toString(),
        balance: T.toString()
      }), se = {
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
        raw: re.raw,
        txid: re.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(se), St(se);
      try {
        await e.chain.broadcast(re.raw, re.txid), St({ ...se, status: "pending" }), v = `${b.liked ? "♥ Liked" : "Unliked"} ${E}`, L = "";
        try {
          (te = e.likeSent) == null || te.call(e, b.song, b.liked);
        } catch {
        }
      } catch (Ee) {
        if (St({ ...se, status: lo(Ee) ? "failed" : "unknown", note: Ee.message, ...lo(Ee) ? { raw: void 0 } : {} }), L = Ee.message, lo(Ee)) try {
          (l = e.likeFailed) == null || l.call(e, b.song);
        } catch {
        }
      }
      i = await sn(s);
    } catch (g) {
      L = "Like not sent: " + (g instanceof Error ? g.message : "the listening wallet is unavailable");
      try {
        (p = e.likeFailed) == null || p.call(e, b.song);
      } catch {
      }
    } finally {
      u = !1, e.changed(), ms();
    }
  }
  return { snapshot: On, refresh: Fn, onListened: Qn, heart: fi, toggleLike: Mn, ...qr };
}
const sb = ["Connect", "Passkey", "Link & fund", "Listen"], ib = ["Passkey", "Add 1 STX", "Listen"], Gd = (e) => e ? ib : sb;
function x5(e) {
  if (e.solo) return S5(e);
  const t = sb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function S5(e) {
  const t = ib.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function v5(e, t) {
  return !t || t.at >= Gd(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const A5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function E5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !A5(r.id)));
}
const k5 = {}, $5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, I5 = (e) => {
  const t = k5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, L5 = (e) => `/hiro/${e}`, C5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, T5 = (e) => {
  const t = I5(e);
  if (t)
    return [C5(t)];
  const n = $5[e];
  return typeof window < "u" ? [`${window.location.origin}${L5(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, B5 = {}, tg = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, M5 = "xtrata.log.enabled", N5 = "xtrata.log.level", _5 = "xtrata.log.tags", P5 = "xtrata.log.dedupe", xc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, U5 = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, H5 = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, O5 = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, D5 = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, F5 = () => {
  const e = B5 ?? {}, t = xc(M5) ?? e.VITE_LOG_ENABLED, n = xc(N5) ?? e.VITE_LOG_LEVEL, r = xc(_5) ?? e.VITE_LOG_TAGS, s = xc(P5) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: U5(t),
    level: H5(n) ?? "warn",
    tags: D5(r),
    dedupe: O5(s)
  };
}, j5 = (e, t, n) => !e.enabled || tg[n] < tg[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), R5 = (e, t, n, r) => {
  const s = F5();
  if (!j5(s, t, e) || G5(s.dedupe))
    return;
  const i = `[xtrata:${t}] ${n}`, o = console[e] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, z5 = /* @__PURE__ */ new Set();
let ng = null;
const G5 = (e, t, n, r, s) => (ng !== e && (z5.clear(), ng = e), !1), K5 = (e, t, n) => R5("debug", e, t, n), V5 = {}, Y5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, X5 = (e) => {
  const t = V5, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Y5[e];
}, q5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, W5 = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return q5.test(n) ? n : null;
}, Z5 = (e) => e.replace(/\/+$/, ""), J5 = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), rg = (e) => {
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
}, uo = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, Q5 = (e) => {
  var c, d;
  let t;
  try {
    t = Sr(Z$(e));
  } catch {
    return null;
  }
  const n = uo(t);
  if (!n || n.success === !1)
    return null;
  const r = uo(n.value), s = uo(r == null ? void 0 : r.value), i = uo(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = rg((c = uo(i.name)) == null ? void 0 : c.value), a = rg((d = uo(i.namespace)) == null ? void 0 : d.value);
  return !o || !a ? null : W5(`${o}.${a}`);
}, eI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${Z5(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [Om(Sm(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : Q5(i.result);
}, tI = async (e) => {
  const t = e.address.trim();
  if (!Ao(t))
    return null;
  const n = X5(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of T5(e.network))
    try {
      return await eI({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (i) {
      r = i;
    }
  return K5("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: J5(r)
  }), null;
};
function nI(e, t, n = {}) {
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
const sg = Object.freeze({
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
}), ig = Object.freeze({ 139: "melophonic" });
function og(e, t = "") {
  const n = String(e);
  return Object.hasOwn(sg, n) ? sg[n] : Object.hasOwn(ig, n) ? ig[n] : t;
}
const ag = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function cg(e, t = "") {
  return Object.hasOwn(ag, String(e)) ? ag[String(e)] : t;
}
const ob = 10000n, ah = 1000000n, hl = 3000n, rI = (e, t) => `${e}#gift=${t}`, sI = 100, ia = (e, t = Lr) => e <= Xt ? 0 : Number((e - Xt) / bn(t)), lg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), ab = "xtrata.xyz/radio/gifts", Sc = sI, iI = "Create a prefunded Xtrata radio gift batch", oI = (e) => ({
  domain: Ir({ name: Et(ab), version: Et("1"), "chain-id": In(1) }),
  message: Ir({
    purpose: Et(iI),
    creator: Et(e.creator),
    count: In(e.count),
    amount: In(BigInt(e.amount)),
    label: Et(e.label),
    issued: In(e.issued),
    ...e.player ? { player: Et(e.player) } : {}
  })
}), aI = (e, t, n = Lr) => Xt + BigInt(e) * bn(n) + (t ? Kl : 0n), cI = (e, t = Lr) => Number((ah - Xt - (e ? Kl : 0n)) / bn(t)), lI = (e, t) => BigInt(e) * (t + hl);
function uI(e, t, n, r = Lr) {
  const s = n ? Kl : 0n, i = t > Xt + s ? t - Xt - s : 0n, o = Number(i / bn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * ll,
    fees: BigInt(o) * r,
    reserve: Xt,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: hl,
    perCopy: t + hl,
    total: lI(e, t)
  };
}
const dI = (e) => e >= ob && e <= ah, ug = 40, fI = "Create an Xtrata radio gift player", Kd = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), hI = /^[^\u0000-\u001f\u007f<>]+$/u;
function dg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && hI.test(e) : !n;
}
function cb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!dg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!dg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > ug) throw new Error(`A player holds 1 to ${ug} songs.`);
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
const lb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return uf(hf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, pI = (e) => ({
  domain: Ir({ name: Et(ab), version: Et("1"), "chain-id": In(1) }),
  message: Ir({
    purpose: Et(fI),
    admin: Et(e.admin),
    player: Et(e.hash),
    issued: In(e.issued)
  })
}), Er = (e) => e.tracks.filter((t) => !t.hidden), gI = (e) => e.tracks.find((t) => t.hidden) ?? null, Tu = [300, 500, 1e3], fg = 1800, Bu = /* @__PURE__ */ new Map();
async function yI(e) {
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
function wI(e, t, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = e, (() => {
    const a = Bu.get(e), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : t, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Bu.set(e, { ...a, until: Date.now() + fg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Bu.delete(e), s();
      }, fg + 50);
    }
  }, i;
}
const ir = (e, t, n, r, s) => wI(e, t, async () => await yI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), hi = "xtrata.radio.gift.incoming.v1", hg = (e) => "xtrata.radio.gift.mine.v1:" + e, pg = (e) => "xtrata.radio.gift.batches.v1:" + e, ve = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, gn = (e, t, n = "") => {
  const r = ve("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, oa = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, tr = (e) => br(e).replace(/\.?0+$/, "");
function mI(e) {
  let t = null;
  const n = (k) => [5e3, 1e4, 2e4, 3e4][k] ?? 6e4, r = (() => {
    try {
      const k = new URL(location.href), R = new URLSearchParams(k.hash.slice(1)).get("gift") ?? k.searchParams.get("gift");
      return R !== null && (k.searchParams.delete("gift"), history.replaceState(null, "", k.pathname + (k.search || ""))), lg(R) ? R : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const k = JSON.parse(e.store.get(hi) || "null");
      return lg(k == null ? void 0 : k.code) ? k.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    t = { code: i }, e.store.set(hi, JSON.stringify({ code: i, at: e.now() }));
    let k = 0;
    const R = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (K) => {
      const Y = await K.json().catch(() => ({}));
      if (K.status === 404) {
        e.store.set(hi, null), t = { ...t, error: (Y == null ? void 0 : Y.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!K.ok) throw new Error("busy");
      const ee = Y;
      t = { ...t, view: ee, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ee.status) && e.store.set(hi, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void R(), n(k++)));
    });
    R();
  }
  const o = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const k = t == null ? void 0 : t.view;
    return !(k != null && k.player) || !o() ? null : { player: k.player, from: u(k), plays: ia(BigInt(k.amount)) };
  }, c = () => {
    const k = t == null ? void 0 : t.view;
    return !k || k.player || !o() ? null : { plays: ia(BigInt(k.amount)), from: k.from ? e.who(k.from) : null };
  }, d = () => {
    const k = t == null ? void 0 : t.code;
    if (!k) return [];
    const R = `${location.origin}${location.pathname}#gift=${k}`;
    return [ir("gift-pass-on", "Copy the link to pass on", () => R, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(hi, null), e.changed();
  }, u = (k) => k.from ? e.who(k.from) : k.label ? `Xtrata Radio · ${k.label}` : "Xtrata Radio";
  let w = {};
  const y = (k) => {
    if (w.box) return w.box;
    const R = ve("div", "", "ppp-gift-check");
    w.box = R;
    const K = () => {
      const Y = window.turnstile;
      !Y || w.rendered || (w.rendered = !0, Y.render(R, { sitekey: k, callback: (ee) => {
        w.token = ee, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) K();
    else {
      const Y = document.createElement("script");
      Y.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", Y.async = !0, Y.onload = K, document.head.append(Y);
    }
    return R;
  }, S = (k) => {
    queueMicrotask(() => void k());
  };
  let v;
  async function L(k) {
    var Y, ee, we, Oe, ft, Xe, C, ce, tt;
    if (!t || t.claiming || !k.listening) return;
    const R = !!((Y = t.view) != null && Y.player);
    if (R && !k.root) return;
    t.claiming = !0, t.error = void 0, (ee = e.claiming) == null || ee.call(e, !0), e.changed();
    const K = async (it) => {
      const lt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...it })
      });
      return { res: lt, r: await lt.json().catch(() => ({})) };
    };
    try {
      let it = 0, lt = k.listening, yt;
      if (R) {
        const _t = Number((we = await e.json("/radio/gift/slots?root=" + encodeURIComponent(k.root))) == null ? void 0 : we.next);
        if (!Number.isSafeInteger(_t) || _t < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        it = _t;
        for (let Yr = 0; ; Yr++) {
          const Re = await e.album.bind(it);
          if (lt = Re.address, yt = await K({ wallet: lt, binding: Re }), yt.res.status === 409 && /just taken/.test(((Oe = yt.r) == null ? void 0 : Oe.error) || "") && Yr < 5) {
            it += 1;
            continue;
          }
          break;
        }
      } else yt = await K({ wallet: lt });
      const { res: Ot, r: Dt } = yt;
      if (Ot.status === 503 && /sending another gift/.test((Dt == null ? void 0 : Dt.error) || "")) {
        t.waiting = !0, (ft = e.claiming) == null || ft.call(e, !0), clearTimeout(v), v = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Ot.ok) {
        const _t = String((Dt == null ? void 0 : Dt.error) || "");
        if (Ot.status === 404 || Ot.status === 410 || Ot.status === 409 && /already had a gift|brand-new|already have this album/.test(_t))
          throw e.store.set(hi, null), new Error(_t || "This gift cannot be opened.");
        if (Ot.status === 429 || Ot.status === 403 || Ot.status === 400 && !/wallet number/i.test(_t)) throw new Error(_t || `Could not open the gift (${Ot.status}).`);
        const Re = /topping up/.test(_t) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(_t) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(_t) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Re), { retry: !0, slow: /topping up|not paid for yet/.test(_t) });
      }
      t.done = !0, e.store.set(hi, null), R ? await e.album.arrived(it, lt, Dt.txid, BigInt(Dt.amount)) : e.giftSent(Dt.txid, BigInt(Dt.amount));
    } catch (it) {
      const lt = it, yt = lt.name === "TypeError" || lt.name === "AbortError" || lt.name === "TimeoutError" || /wallet number/i.test(lt.message);
      if (lt.retry || yt) {
        const Ot = t.tries ?? 0;
        t.tries = Ot + 1, t.retry = { text: lt.retry ? lt.message : "Still sending your gift… the network is slow, trying again." }, (Xe = e.claiming) == null || Xe.call(e, !0), clearTimeout(v), v = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, lt.slow ? 6e4 : n(Ot));
      } else
        t.error = lt.message, (C = e.claiming) == null || C.call(e, !1);
      w.token = void 0;
      try {
        (tt = (ce = window.turnstile) == null ? void 0 : ce.reset) == null || tt.call(ce, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let P = null;
  function H(k) {
    if (!k.listening || !k.depositPending || k.step !== "fund")
      return P = null, [];
    if (!P || P.wallet !== k.listening || e.now() - P.at > 3e4) {
      const K = k.listening;
      P = { ...(P == null ? void 0 : P.wallet) === K ? P : {}, wallet: K, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(K)).then((Y) => {
        var ee, we;
        (P == null ? void 0 : P.wallet) === K && (P.state = (ee = Y == null ? void 0 : Y.gift) == null ? void 0 : ee.state, P.problem = ((we = Y == null ? void 0 : Y.gift) == null ? void 0 : we.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(P.state === "sending" && P.problem)) return [];
    const R = ve("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return R.title = `Network reply: ${P.problem}`, [R];
  }
  function A(k, R, K = !1) {
    var Xe, C;
    const Y = R.player, ee = BigInt(R.amount), we = K ? [] : [ve("p", `🎁 ${u(R)} sent you “${Y.title}”${Y.subtitle ? ` by ${Y.subtitle}` : ""}: ${Er(Y).length} ${Er(Y).length === 1 ? "song" : "songs"} and ${ia(ee).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!k.root && ["fund", "ready", "over", "link"].includes(k.step))) {
      if (K) return we;
      if (we.push(ve("p", k.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : k.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), k.step === "intro") {
        const ce = document.createElement("details");
        ce.className = "ppp-how";
        const tt = document.createElement("summary");
        tt.textContent = "How does this work?", ce.append(tt, ve("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), we.push(ce);
      }
      return we;
    }
    if (k.walletCannotAlbums)
      return we.push(ve("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), we;
    const ft = (C = (Xe = k.gate) == null ? void 0 : Xe.gifts) == null ? void 0 : C.turnstileSiteKey;
    return ft && !w.token ? we.push(ve("p", "One quick check and it is yours:", "ppp-mute"), y(ft)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => L(k)), we.push(...M(k, "Sending your album…")), we;
  }
  function M(k, R) {
    const K = [];
    return t.claiming || t.waiting ? K.push(ve("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : R, "ppp-cyan")) : t.retry && K.push(ve("p", t.retry.text, "ppp-warn"), gn("Try now", () => {
      clearTimeout(v), t.retry = void 0, L(k);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? K.push(ve("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...d(), gn("Forget this gift link here", h, "quiet")) : t.error && K.push(ve("p", t.error, "ppp-bad"), gn("Try again", () => {
      t.error = void 0, L(k);
    })), K;
  }
  const U = (k) => {
    var R;
    return !!t && !t.done && !t.error && o() && !!k.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !k.linked && !k.creditedTo && (k.createdHere || k.brandNew || !!((R = t.view) != null && R.player)) && (k.balance ?? 0n) === 0n && !k.entries.length);
  };
  function V(k, R = {}) {
    var lt, yt, Ot, Dt;
    const K = H(k);
    if (!t || ["off", "elsewhere"].includes(k.step)) return K;
    const Y = t.view;
    if (t.error && !Y) return [ve("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!Y) return [ve("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return K;
    if (Y.status === "claimed" || Y.status === "claiming") return [ve("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(Y.status)) return [ve("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (Y.status === "pending-deposit") return [ve("p", `🎁 ${u(Y)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (Y.player) return [...A(k, Y, !!R.bare), ...K];
    const ee = !!k.listening && (!(k.createdHere || k.brandNew) || !!k.linked || !!k.creditedTo || (k.balance ?? 0n) > 0n || k.entries.length > 0), we = ee ? ((lt = e.claimNew) == null ? void 0 : lt.call(e, k)) ?? null : null, Oe = we ? ((yt = e.replaceOld) == null ? void 0 : yt.call(e, k)) ?? null : null;
    if (we && Oe)
      return [
        ve("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        gn("Replace my old player", Oe, "primary"),
        gn("Keep both players", we, "quiet"),
        gn("Not now", h, "quiet")
      ];
    if (we)
      return [
        ve("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        gn("Claim it as a new player", we, "primary"),
        gn("Not now", h, "quiet")
      ];
    if (ee)
      return [ve("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), gn("Forget this gift link here", h, "quiet")];
    const ft = BigInt(Y.amount), Xe = ia(ft).toLocaleString(), C = ve(
      "p",
      `🎁 ${u(Y)} sent you ${tr(ft)} STX of on-chain music: about ${Xe} paid plays.`,
      "ppp-gift"
    ), ce = R.bare ? [] : [C], tt = !!k.listening && (k.createdHere || k.brandNew) && !k.linked && !k.creditedTo && k.step === "fund" && (k.balance ?? 1n) === 0n && !k.depositPending && !k.entries.length, it = (Dt = (Ot = k.gate) == null ? void 0 : Ot.gifts) == null ? void 0 : Dt.turnstileSiteKey;
    return tt ? (it && !w.token ? ce.push(ve("p", "One quick check and it is yours:", "ppp-mute"), y(it)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => L(k)), ce.push(...M(k, "Sending your gift…"))) : k.step === "intro" ? R.bare || ce.push(ve("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : k.listening && k.linked ? ce.push(ve("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), gn("Forget this gift link here", h, "quiet")) : k.listening && (k.balance ?? 0n) > 0n && ce.push(ve("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), gn("Forget this gift link here", h, "quiet")), ce;
  }
  async function le(k, R, K) {
    var Y;
    try {
      const ee = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(k));
      if ((Y = ee == null ? void 0 : ee.gift) != null && Y.returnTo) return { ok: !0, funder: ee.gift.returnTo, txId: ee.gift.txid ?? void 0, amount: ee.gift.amount, distinct: 1 };
    } catch {
      if (K) return { ok: !1 };
    }
    return R();
  }
  const ne = ve("div", "", "ppp-gift-fold");
  let q = 250000n, m = "", I = "";
  const N = (k) => {
    try {
      const R = JSON.parse(e.store.get(hg(k)) || "[]");
      return Array.isArray(R) ? R : [];
    } catch {
      return [];
    }
  }, _ = (k, R) => e.store.set(hg(k), JSON.stringify(R.slice(0, 50)));
  async function W(k) {
    const R = N(k);
    for (const K of R)
      if (!(K.view && ["claimed", "refunded", "expired"].includes(K.view.status)))
        try {
          K.view = !K.view || K.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: K.id, ...K.txid ? { txid: K.txid } : {} }) }) : await e.json("/radio/gift?id=" + K.id), K.error = void 0;
        } catch (Y) {
          K.error = Y.message;
        }
    _(k, R), e.changed();
  }
  async function F(k) {
    if (m) return;
    m = "Starting your gift…", I = "", e.changed();
    let R = null;
    try {
      R = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: k, amount: q.toString() }) });
      const K = N(k);
      K.unshift({ id: R.id, code: R.code, amount: q.toString(), at: e.now() }), _(k, K), m = "Approve the gift in your wallet…", e.changed();
      const Y = await e.pay(k, R.depositTo, BigInt(R.deposit), R.memo), ee = N(k), we = ee.find((Oe) => Oe.id === R.id);
      we && (we.txid = Y, we.view = { status: "pending-deposit", amount: q.toString(), source: "friend", from: k, label: "", expires: 0 }), _(k, ee), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(k);
    } catch (K) {
      I = K.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const de = (k) => "xtrata.radio.gift.players.v1:" + k, fe = (k) => {
    try {
      const R = JSON.parse(e.store.get(de(k)) || "[]");
      return Array.isArray(R) ? R.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id)) : [];
    } catch {
      return [];
    }
  };
  async function He(k, R) {
    var K;
    if (!m) {
      m = "Checking the player…", I = "", e.changed();
      try {
        const Y = R.tracks.split(/[\s,]+/).filter(Boolean).map((ce) => Number(ce.replace(/^#/, ""))), ee = (R.explicit ?? "").split(/[\s,]+/).map((ce) => ce.replace(/^#/, "")).filter(Boolean).map(Number), we = cb({ title: R.title.trim(), subtitle: R.subtitle.trim(), tracks: Y, cover: (K = R.cover) != null && K.trim() ? Number(R.cover.trim().replace(/^#/, "")) : null, ...ee.length ? { explicit: ee } : {} });
        m = "Sign in your wallet…", e.changed();
        const Oe = { admin: k, hash: lb(we), issued: e.now() }, ft = await e.sign(k, pI(Oe));
        m = "Making the player…", e.changed();
        const Xe = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: we, request: Oe, signature: ft }) }), C = fe(k).filter((ce) => ce.id !== Xe.id);
        C.unshift({ id: Xe.id, title: Xe.title, tracks: Xe.tracks }), e.store.set(de(k), JSON.stringify(C.slice(0, 30))), I = `${Xe.existing ? "That player already exists" : "Player made"} ✓ “${Xe.title}” · ${Xe.tracks} songs. Pick it below for a batch.`;
      } catch (Y) {
        I = Y.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const $ = (k, R) => rI(k || location.origin + "/radio.html", R), j = (k) => {
    try {
      const R = JSON.parse(e.store.get(pg(k)) || "[]");
      return Array.isArray(R) ? R.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id) && Array.isArray(K.codes)) : [];
    } catch {
      return [];
    }
  }, he = (k, R) => e.store.set(pg(k), JSON.stringify(R.slice(0, 20))), ye = (k) => !!k.view && k.view.status === "live" && k.view.copies.waiting + k.view.copies.claiming + k.view.copies.refunding === 0, Te = (k, R) => e.json(k, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(R) });
  let Be = 0;
  async function Ct(k) {
    const R = j(k);
    for (const K of R)
      if (!ye(K))
        try {
          K.view = !K.view || K.view.status === "pending-deposit" ? await Te("/radio/gift/batch/confirm", { id: K.id, ...K.txid ? { txid: K.txid } : {} }) : await e.json("/radio/gift/batch?id=" + K.id), K.error = void 0;
        } catch (Y) {
          K.error = Y.message;
        }
    try {
      const K = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(k));
      for (const Y of (K == null ? void 0 : K.batches) ?? []) {
        const ee = R.find((we) => we.id === Y.id);
        if (ee) {
          ee.error || (ee.view = Y);
          continue;
        }
        R.push({ id: Y.id, codes: [], count: Y.count, amount: Y.amount, label: Y.label, player: Y.player, depositTo: "", deposit: Y.deposit, memo: Y.memo, at: 0, view: Y });
      }
    } catch {
    }
    he(k, R), e.changed();
  }
  async function Ue(k, R) {
    const K = j(k).find((Y) => Y.id === R);
    if (!(!K || !K.depositTo || m)) {
      m = "Approve the payment in your wallet…", I = "", e.changed();
      try {
        const Y = await e.pay(k, K.depositTo, BigInt(K.deposit), K.memo), ee = j(k), we = ee.find((Oe) => Oe.id === R);
        we && (we.txid = Y), he(k, ee), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", Ct(k);
      } catch (Y) {
        I = `${/cancel/i.test(Y.message) ? "Payment cancelled." : Y.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function Me(k, R, K, Y) {
    if (m) return;
    if (!R.ok) {
      I = R.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", I = "", e.changed();
    let ee = null;
    try {
      const we = { creator: k, count: R.count, amount: R.amount.toString(), label: K, issued: e.now(), ...Y ? { player: Y } : {} }, Oe = await e.sign(k, oI(we));
      m = "Making your links…", e.changed(), ee = await Te("/radio/gift/batch", { request: we, signature: Oe });
      const ft = j(k);
      ft.unshift({ id: ee.id, codes: ee.codes, count: R.count, amount: ee.amount, label: K, player: Y ?? null, depositTo: ee.depositTo, deposit: ee.deposit, memo: ee.memo, at: e.now() }), he(k, ft);
    } catch (we) {
      I = we.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await Ue(k, ee.id);
  }
  const Ne = () => Zt(!!ct.value, Le.value, Se.value);
  function Zt(k, R, K) {
    const Y = R === "max" ? cI(k) : Number(R), ee = aI(Y, k), we = Number(K);
    return !Number.isInteger(we) || we < 1 || we > Sc ? { ok: !1, reason: `Make 1 to ${Sc} copies at a time.`, album: k, plays: Y, amount: ee, count: we } : dI(ee) ? { ok: !0, reason: "", album: k, plays: Y, amount: ee, count: we, bill: uI(we, ee, k) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: k, plays: Y, amount: ee, count: we };
  }
  const Gt = (k = Ne()) => {
    if (!k.ok) return k.reason;
    const R = k.bill;
    return `Each copy: ${k.plays.toLocaleString()} paid plays (${tr(R.holders)} to song holders, ${tr(R.fees)} network fees)${k.album ? `, ${tr(R.float)} for the album’s likes` : ""}, ${tr(R.reserve)} kept so a listener can return what is left, + ${tr(R.sendFee)} to send it = ${tr(R.perCopy)} STX. ${k.count} copies = ${tr(R.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Qe = (k, R) => R.codes.map((K) => $(k, K)), Lt = ve("input");
  Lt.type = "range", Lt.min = String(ob), Lt.max = String(ah), Lt.step = "10000", Lt.value = String(q), Lt.setAttribute("aria-label", "Gift amount");
  const St = ve("p", "", "ppp-gift-amount"), z = gn("", () => {
    const k = e.main();
    k && F(k);
  }, "primary"), O = () => {
    St.textContent = ae(), z.textContent = `Gift ${tr(q)} STX`;
  };
  Lt.oninput = () => {
    q = BigInt(Lt.value), O();
  };
  const ae = () => `${tr(q)} STX · about ${ia(q).toLocaleString()} paid plays · you pay ${tr(q + hl)} STX with the network fee`;
  O();
  const Q = ve("input");
  Q.maxLength = 60, Q.placeholder = "Title, e.g. Proof of Sound", Q.setAttribute("aria-label", "Player title");
  const ue = ve("input");
  ue.maxLength = 80, ue.placeholder = "Artist (optional)", ue.setAttribute("aria-label", "Player subtitle");
  const et = ve("textarea");
  et.rows = 3, et.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", et.setAttribute("aria-label", "Songs");
  const $e = ve("input");
  $e.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", $e.setAttribute("aria-label", "Explicit songs");
  const _e = ve("input");
  _e.inputMode = "numeric", _e.placeholder = "Cover inscription number (optional), shown when the album loads", _e.setAttribute("aria-label", "Cover inscription");
  const ct = ve("select");
  ct.setAttribute("aria-label", "Batch album");
  const Le = ve("select");
  Le.setAttribute("aria-label", "Plays per copy");
  for (const k of [.../* @__PURE__ */ new Set([50, 100, 250, ...Tu])].sort((R, K) => R - K)) Le.append(oa(`${k.toLocaleString()} plays`, String(k)));
  Le.append(oa("Max (1 STX)", "max")), Le.value = String(Tu[0]);
  const Se = ve("input");
  Se.type = "number", Se.min = "1", Se.max = String(Sc), Se.value = "10", Se.setAttribute("aria-label", "Copies");
  const je = ve("input");
  je.maxLength = 40, je.placeholder = "Label, e.g. Opera launch", je.setAttribute("aria-label", "Batch label");
  const Je = ve("p", "", "ppp-mute"), Ae = () => {
    Je.textContent = Gt();
  };
  for (const k of [ct, Le, Se])
    k.oninput = Ae, k.onchange = Ae;
  Ae();
  function Jt(k, R, K) {
    const Y = R.view, ee = Y == null ? void 0 : Y.copies, we = R.error ? R.error : !Y || Y.status === "pending-deposit" ? R.txid ? "payment confirming…" : "waiting for your payment" : `${ee.claimed} of ${Y.count} claimed${ee.refunding + ee.refunded ? ` · ${ee.refunded} refunded${ee.refunding ? `, ${ee.refunding} on their way` : ""}` : ""}`, Oe = ve("li");
    if (Oe.append(ve("span", `${R.label || "Batch"} · ${R.count} × ${tr(BigInt(R.amount))} STX`, "t"), ve("span", we, "ppp-mute")), !R.txid && R.depositTo && (!Y || Y.status === "pending-deposit") && Oe.append(gn("Pay now", () => void Ue(k, R.id), "tiny")), R.codes.length && (Y == null ? void 0 : Y.status) === "live") {
      const ft = Qe(K, R);
      Oe.append(
        ir("batch-copy:" + R.id, "Copy all links", () => ft.join(`
`), "tiny", e.changed),
        ir("batch-csv:" + R.id, "Copy as CSV", () => ["copy,link", ...ft.map((Xe, C) => `${C + 1},${Xe}`)].join(`
`), "tiny", e.changed)
      );
    } else R.codes.length || Oe.append(ve("span", "links were made on another device", "ppp-mute"));
    return Oe;
  }
  const rn = ve("select");
  rn.setAttribute("aria-label", "Plays in each copy");
  for (const k of [.../* @__PURE__ */ new Set([50, 100, 250, ...Tu])].sort((R, K) => R - K)) rn.append(oa(`${k.toLocaleString()} plays`, String(k)));
  rn.value = "50";
  const Kt = ve("input");
  Kt.type = "number", Kt.min = "1", Kt.max = String(Sc), Kt.value = "10", Kt.setAttribute("aria-label", "How many copies");
  const gt = ve("input");
  gt.maxLength = 40, gt.placeholder = "A note recipients see, e.g. Launch week (optional)", gt.setAttribute("aria-label", "Note for recipients");
  const fn = ve("p", "", "ppp-mute");
  function Hn(k, R, K) {
    const Y = () => Zt(!0, rn.value, Kt.value), ee = () => {
      fn.textContent = Gt(Y());
    };
    for (const ce of [rn, Kt])
      ce.oninput = ee, ce.onchange = ee;
    ee();
    const we = () => (gt.value.trim() || R.title).replace(/[^ -~]/g, "").slice(0, 40), Oe = gn("Sign, pay and make links", () => {
      Me(k, Y(), we(), R.id);
    }, "primary");
    Oe.disabled = !!m;
    const ft = (ce, tt) => {
      const it = ve("label", ce);
      return it.append(tt), it;
    }, Xe = [
      ve("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims within 30 days come back to you.", "ppp-mute"),
      ft("Plays in each ", rn),
      ft("Copies ", Kt),
      gt,
      fn,
      Oe
    ];
    e.now() - Be > 3e4 && (Be = e.now(), Ct(k));
    const C = j(k).filter((ce) => ce.player === R.id);
    if (C.length) {
      const ce = ve("ul", "", "ppp-gift-list");
      for (const tt of C.slice(0, 10)) ce.append(Jt(k, tt, K));
      Xe.push(ce);
    }
    return m && Xe.push(ve("p", m, "ppp-cyan")), I && Xe.push(ve("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), Xe;
  }
  function lr(k) {
    var ee, we;
    const R = (ee = k.gate) == null ? void 0 : ee.gifts;
    if (!(R != null && R.enabled) || !R.admin || ["off", "elsewhere", "unsupported"].includes(k.step)) return null;
    const K = e.main(), Y = [ve("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!K)
      Y.push(ve("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (R.admin) {
      const Oe = ve("div", "", "ppp-gift-admin"), ft = (it, lt) => {
        const yt = ve("label", it);
        return yt.append(lt), yt;
      }, Xe = fe(K);
      Oe.append(
        ve("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Q,
        ue,
        et,
        _e,
        $e,
        gn("Sign and make player", () => void He(K, { title: Q.value, subtitle: ue.value, tracks: et.value, cover: _e.value, explicit: $e.value }))
      );
      const C = gn("Sign, pay and make links", () => {
        Me(K, Ne(), je.value.trim(), ct.value || void 0);
      });
      C.disabled = !!m;
      const ce = ct.value;
      ct.replaceChildren(oa("No album (starter copies)", ""), ...Xe.map((it) => oa(`${it.title} · ${it.tracks} songs`, it.id))), Xe.some((it) => it.id === ce) && (ct.value = ce), Ae(), Oe.append(
        ve("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        ft("Album ", ct),
        ft("Plays each ", Le),
        ft("Copies ", Se),
        je,
        Je,
        C
      ), e.now() - Be > 3e4 && (Be = e.now(), Ct(K));
      const tt = j(K);
      if (tt.length) {
        const it = ve("ul", "", "ppp-gift-list");
        for (const lt of tt.slice(0, 10)) it.append(Jt(K, lt, ((we = k.gate) == null ? void 0 : we.radioUrl) ?? null));
        Oe.append(it);
      }
      Y.push(Oe);
    }
    return m && Y.push(ve("p", m, "ppp-cyan")), I && Y.push(ve("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), ne.replaceChildren(...Y), ne;
  }
  return { banner: V, funder: le, renderFold: lr, copies: Hn, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: U };
}
const bI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function xI(e) {
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
const SI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function vI(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((i) => (!t.pinnedOnly || t.pins.has(i.slot)) && (() => {
    const o = SI(i);
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
function AI(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Vd = /* @__PURE__ */ new Set(), ch = (e) => (Vd.add(e), () => {
  Vd.delete(e);
}), pl = () => {
  for (const e of [...Vd])
    try {
      e();
    } catch {
    }
}, gg = "xtrata:al-thumb:v1:", lh = "-", aa = 96, EI = 24 * 1024 * 1024, nn = /* @__PURE__ */ new Map(), yg = /* @__PURE__ */ new Set(), Yd = [];
let Mu = !1, Nu;
const Ta = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(gg + e);
    window.localStorage.setItem(gg + e, t);
  } catch {
  }
  return null;
};
function uh(e) {
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
async function kI(e) {
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
      const L = S + v, P = r.indexOf(">", L);
      if (P < 0)
        return r = r.slice(L), null;
      const H = r.slice(L, P + 1), A = H.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
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
    if (s > EI)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function $I() {
  if (!Mu) {
    Mu = !0;
    try {
      for (; Yd.length; ) {
        const e = Yd.shift();
        if (!nn.has(e))
          try {
            const t = await kI(e);
            if (t === null) continue;
            if (!t) {
              nn.set(e, ""), Ta(e, lh), pl();
              continue;
            }
            const n = await uh(t);
            nn.set(e, n), n.startsWith("data:image/jpeg") && Ta(e, n), pl();
          } catch {
          }
      }
    } finally {
      Mu = !1;
    }
  }
}
function dh(e, t) {
  if (t && !nn.get(e) ? (nn.set(e, t), uh(t).then((r) => {
    r !== t && (nn.set(e, r), r.startsWith("data:image/jpeg") && Ta(e, r), pl());
  })) : t === "" && !nn.has(e) && nn.set(e, ""), nn.has(e)) return nn.get(e);
  const n = Ta(e);
  if (n != null) {
    const r = n === lh ? "" : n;
    return nn.set(e, r), r;
  }
  return yg.has(e) || (yg.add(e), Yd.push(e), Nu || (Nu = setTimeout(() => {
    Nu = void 0, $I();
  }, 1200))), "";
}
function wg(e) {
  if (nn.has(e)) return nn.get(e);
  const t = Ta(e);
  if (t == null) return null;
  const n = t === lh ? "" : t;
  return nn.set(e, n), n;
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
const fo = 12, II = 5e3, wn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, ho = (e, t, n = "") => {
  const r = wn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function LI(e) {
  let t, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", d = !1, h = fo;
  const u = wn("div", "", "ppp-shelf-box");
  ch(() => e.changed());
  const w = (N) => "xtrata.radio.shelf.pins.v1:" + N, y = (N) => "xtrata.radio.shelf.recent.v1:" + N, S = (N, _) => {
    try {
      return JSON.parse(e.store.get(N) || "null") ?? _;
    } catch {
      return _;
    }
  }, v = (N) => new Set(S(w(N), []).filter((_) => Number.isSafeInteger(_))), L = (N) => {
    const _ = S(y(N), {}), W = {};
    for (const [F, de] of Object.entries(_)) Number.isSafeInteger(Number(F)) && typeof de == "number" && (W[Number(F)] = de);
    return W;
  };
  async function P(N) {
    if (!s) {
      s = !0, i = !1;
      try {
        const _ = [];
        let W = 0, F = 0;
        for (let de = 0; de < II / 100 + 1; de++) {
          const fe = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${W}&limit=100`);
          if (_.push(...xI(fe == null ? void 0 : fe.shelf)), F = Number(fe == null ? void 0 : fe.total) || _.length, !(fe != null && fe.next) || !Number.isSafeInteger(fe.next)) break;
          W = fe.next;
        }
        N === t && (n = _, r = F, o = e.now());
      } catch {
        i = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const H = () => {
    o = -1 / 0;
  }, A = wn("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, h = fo, e.changed();
  };
  const M = wn("select");
  M.setAttribute("aria-label", "Sort albums");
  for (const N of bI) {
    const _ = document.createElement("option");
    _.value = N.value, _.textContent = N.label, M.append(_);
  }
  M.onchange = () => {
    c = M.value, h = fo, e.changed();
  };
  const U = ho("", () => {
    d = !d, h = fo, e.changed();
  }, "tiny"), V = wn("div", "", "ppp-shelf-tools");
  V.append(A, M, U);
  const le = wn("div"), ne = wn("div");
  function q(N) {
    const _ = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (_ !== t && (t = _, n = [], r = 0, o = -1 / 0, h = fo), !_ || N.walletCannotAlbums) return null;
    if (!s && e.now() - o > 5 * 6e4 && P(_), !n.length)
      return i ? (ne.replaceChildren(wn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ho("Try again", () => {
        o = -1 / 0, e.changed();
      }, "quiet")), u.replaceChildren(ne), u) : null;
    const W = v(_), F = L(_), de = vI(n, { query: a, sort: c, pinnedOnly: d, pins: W, recents: F });
    A.value !== a && (A.value = a), M.value = c, U.textContent = d ? "★ Pinned only" : "☆ Pinned only", U.setAttribute("aria-pressed", String(d));
    const fe = [];
    if (N.slot > 0 && fe.push(ho("← My player", () => e.open(0), "quiet")), !de.length) fe.push(wn("p", "No album matches that.", "ppp-mute"));
    else {
      const He = wn("ul", "", "ppp-shelf-list");
      for (const $ of de.slice(0, h)) {
        const j = wn("li", "", $.slot === N.slot ? "now" : ""), he = W.has($.slot), ye = ho(he ? "★" : "☆", () => {
          const Qe = new Set(W);
          he ? Qe.delete($.slot) : Qe.add($.slot), e.store.set(w(_), JSON.stringify([...Qe])), e.changed();
        }, "tiny");
        ye.setAttribute("aria-label", he ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const Te = [$.player.subtitle, `${Er($.player).length} ${Er($.player).length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Be = $.slot === N.slot, Ct = ho(Be ? "Playing" : "Select", () => {
          e.store.set(y(_), JSON.stringify(AI({ ...F, [$.slot]: e.now() }))), e.open($.slot);
        }, Be ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Ct.disabled = Be;
        const Ue = Er($.player)[0], Me = $.player.cover ?? (Ue == null ? void 0 : Ue.id), Ne = Me ? dh(String(Me)) : "", Zt = wn("span", "", "ppp-shelf-art");
        if (Ne) {
          const Qe = document.createElement("img");
          Qe.src = Ne, Qe.alt = "", Qe.decoding = "async", Zt.append(Qe);
        } else Zt.textContent = "💿";
        const Gt = wn("span", "", "ppp-shelf-txt");
        Gt.append(wn("span", $.player.title, "t"), wn("span", Te, "ppp-mute")), j.append(ye, Zt, Gt, Ct), He.append(j);
      }
      fe.push(He), de.length > h && fe.push(ho(`Show more (${de.length - h} left)`, () => {
        h += fo, e.changed();
      }, "quiet"));
    }
    return i && fe.push(wn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), le.replaceChildren(...fe), u.firstChild !== V && u.replaceChildren(V, le), u;
  }
  return { render: q, invalidate: H, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const N = L(t), _ = [...n].filter((W) => W.player).sort((W, F) => (N[F.slot] ?? 0) - (N[W.slot] ?? 0) || F.slot - W.slot)[0];
    return _ ? { slot: _.slot, title: _.player.title } : null;
  } };
}
const mg = "http://www.w3.org/2000/svg", CI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function gl(e = "", t = !1) {
  const n = document.createElementNS(mg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of CI) {
    const i = document.createElementNS(mg, "path");
    i.setAttribute("fill-rule", "evenodd"), i.setAttribute("fill", t ? "currentColor" : r), i.setAttribute("d", s), n.append(i);
  }
  return n;
}
const ot = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Gn = (e, t, n, r = !1) => {
  const s = ot("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, ub = (e) => e.toLocaleString(), bg = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, TI = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function yl(e, t) {
  const n = ot("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const i = ot("li", s < t ? "is-done" : s === t ? "is-now" : "");
    i.append(ot("i", "", s < t ? "✓" : String(s + 1)), ot("span", "", r)), n.append(i);
  }), n;
}
function BI() {
  const e = ot("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(ot("span", "tier-disc__mark", "?")), e;
}
const MI = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], yr = {
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
}, NI = (e, t, n = !1) => n ? `${t || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${t || "Xtrata Music"} has covered ${e ? `${ub(e)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, _I = (e) => e ? `Your player holds ${ub(e)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", PI = (e) => e ? `You got a ${e.name} player` : yr.landed.title;
function UI(e, t = !0) {
  const n = ot("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(ot("span", "tier-disc__mark", e.mark)), n;
}
function HI(e) {
  const t = document.documentElement;
  let n = !1;
  const r = () => {
    const s = ot("ul", "al-welcome-points");
    for (const [i, o, a] of MI) {
      const c = ot("li");
      c.title = o;
      const d = ot("em", "", a);
      d.setAttribute("aria-hidden", "true"), c.append(d, ot("b", "", i), ot("span", "", o)), s.append(c);
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
      const o = ot("header", "al-top"), a = ot("a", "al-brand");
      a.href = "/radio", a.append(gl("al-logo"), ot("span", "", "Xtrata "), ot("b", "", "Music")), o.append(a);
      const c = ot("div", "al-body al-body--welcome"), d = ot("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        d.append(ot("p", "al-welcome-wait", yr.checking));
      else {
        const w = TI(h);
        if (w >= 0 && d.append(yl(h === "new" ? bg.fresh : bg.gift, w)), s.tier && (h === "landed" || h === "back" || h === "empty") ? d.append(UI(s.tier)) : h === "gift" || h === "arriving" ? d.append(BI()) : h === "new" && d.append(gl("al-hero-mark")), d.append(ot("h1", "", h === "landed" ? PI(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : yr[h].title)), d.append(ot("p", "", h === "gift" ? NI(s.plays, s.from, s.mystery) : h === "landed" ? _I(s.plays) : yr[h].body)), (h === "landed" || h === "gift") && d.append(r()), s.status.length) {
          const y = ot("div", "al-status");
          y.setAttribute("role", "status"), y.append(...s.status), d.append(y);
        }
        if (s.asking) d.append(ot("p", "al-hint al-hint--ask", yr.asking));
        else if (h === "back" && s.claimNew) {
          const y = yr.backClaim;
          d.append(ot("p", "al-hint", y.body)), s.canStart && s.replaceOld ? d.append(Gn("al-primary", y.replace, s.replaceOld, s.busy), ot("p", "al-hint", y.replaceHint), Gn("al-link", y.both, s.claimNew, s.busy), Gn("al-link", y.unlock, s.unlock, s.busy)) : s.canStart && d.append(Gn("al-primary", y.primary, s.claimNew, s.busy), ot("p", "al-hint", y.hint), Gn("al-link", y.unlock, s.unlock, s.busy)), d.append(Gn("al-link", yr.back.full, s.full));
        } else if (h === "gift" || h === "new" || h === "back") {
          const y = yr[h];
          s.canStart && d.append(Gn("al-primary", y.primary, h === "back" ? s.unlock : s.start, s.busy), ot("p", "al-hint", y.hint)), s.canStart && d.append(Gn("al-link", y.returning, s.returning, s.busy)), d.append(Gn("al-link", y.full, s.full));
        } else if (h === "landed") {
          if (d.append(Gn("al-primary", yr.landed.primary, s.full)), (u = s.albums) != null && u.length) {
            d.append(ot("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const y of s.albums) {
              const S = Gn("al-album", "", y.run);
              if (y.cover) {
                const L = ot("img", "al-album__art");
                L.src = y.cover, L.alt = "", S.classList.add("al-album--art"), S.append(L);
              }
              const v = ot("span", "al-album__t");
              v.append(ot("b", "", y.title), ot("span", "", y.by)), S.append(v), d.append(S);
            }
          }
        } else h === "empty" && d.append(Gn("al-primary", yr.empty.primary, s.restock), Gn("al-link", yr.empty.full, s.full));
      }
      c.append(d), e.hidden = !1, e.replaceChildren(o, c);
    }
  };
}
const OI = 20, DI = ["Album", "Passkey", "Listen"], an = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Ft = {
  grid: an('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: an('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: an('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: an('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: an('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: an('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: an('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: an('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: an('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: an('<path d="M6 9l6 6 6-6"/>', 18),
  right: an('<path d="M9 6l6 6-6 6"/>', 16),
  close: an('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: an('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: an('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: an('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: an('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: an('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function ie(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, i] of Object.entries(t))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const yn = (e, ...t) => ie("button", { type: "button", ...e }, ...t), vc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, ca = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, FI = { music: "My music", device: "This device", gifts: "Albums (admin)" }, jI = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function xg(e, t, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement;
  function c(m) {
    var N, _, W;
    if (!m || !Number.isSafeInteger(m)) return "";
    const I = (W = (_ = (N = t.radio()) == null ? void 0 : N.getState) == null ? void 0 : _.call(N)) == null ? void 0 : W.albumCover;
    return I != null && I.url && Number(I.tokenId) === m ? I.url : Hc(m);
  }
  ch(() => q());
  function d(m) {
    var N;
    i = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const I = document.querySelector(".side");
    if (m && m !== "more") {
      for (const F of jI[m]) {
        const de = I == null ? void 0 : I.querySelector(F);
        de && (de.open = !0);
      }
      const _ = document.getElementById("sheetTitle");
      _ && (_.textContent = FI[m]);
      const W = document.getElementById("sheetExtra");
      W && W.replaceChildren(...m === "music" ? [u()] : []), (N = I == null ? void 0 : I.scrollTo) == null || N.call(I, { top: 0 });
    }
    q();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => d("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && i && a.dataset.view === "album" && d("");
  });
  const u = () => yn(
    { class: "al-row", onClick: () => {
      d(""), t.openPlayer();
    } },
    ie("span", { class: "al-row-i", html: Ft.radio }),
    ie("span", { class: "al-row-t" }, ie("b", {}, "Xtrata Radio"), ie("small", {}, "Every song on-chain · FM, liked, all")),
    ie("span", { class: "al-row-go", html: Ft.right })
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
  let v = "", L = null;
  function P(m, I, N = {}) {
    const _ = N.song || c(m.cover), F = [_ ? ie("img", { src: _, alt: N.song ? "Song artwork" : `${m.title} cover` }) : ie("div", { class: "al-cover-fallback" }, ie("b", {}, m.title), m.subtitle ? ie("span", {}, m.subtitle) : null), N.paused ? ie("span", { class: "al-paused" }, ie("i", { html: Ft.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], de = "al-cover" + (I ? "" : " al-cover--small") + (N.paused ? " is-paused" : "");
    return N.flip ? (F.push(ie("span", { class: "al-flip", "aria-hidden": "true", html: Ft.flip })), yn({ class: de + " is-flippable", "aria-label": N.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: N.flip }, ...F)) : ie("div", { class: de }, ...F);
  }
  function H(m) {
    return m.plays === null || m.plays === void 0 ? ie("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? ie("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : ie("span", { class: "al-chip" + (m.plays <= OI ? " al-chip--low" : "") }, `${ca(m.plays, "play", "plays")} left`);
  }
  function A(m) {
    const I = m.player, N = I.tracks.filter((W) => !W.hidden), _ = [];
    return m.step !== void 0 && _.push(yl(DI, m.step)), m.mode === "arrive" && m.from && _.push(ie("p", { class: "al-from" }, ie("span", { html: Ft.gift }), ie("span", {}, ie("b", {}, m.from), " sent you an album"))), _.push(P(I, !0)), _.push(ie(
      "div",
      { class: "al-intro" },
      ie("h1", {}, I.title),
      I.subtitle ? ie("p", { class: "al-artist" }, I.subtitle) : null,
      N.length ? ie("p", { class: "al-songline" }, N.map((W) => W.title || `#${W.id}`).join(" · ")) : null,
      ie("span", { class: "al-chip" }, [ca(N.length, "song", "songs"), m.offered ? ca(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && _.push(ie("div", { class: "al-status", role: "status" }, ...m.status)), _.push(ie("div", { class: "al-grow" })), m.asking ? _.push(ie("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && _.push(yn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, ie("span", { html: Ft.playSmall }), m.primary.label)), m.hint && !m.asking && _.push(ie("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && _.push(yn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), _;
  }
  function M(m, I) {
    const { songs: N, current: _, started: W, own: F, out: de, waiting: fe } = I, He = m.player, $ = t.radio(), j = [];
    j.push(ie("div", { class: "al-listhead" }, ie("span", {}, ie("b", {}, He.title), ` · ${ca(N.length, "song", "songs")}`), H(m)));
    const he = c(He.cover), ye = "album:" + He.cover;
    he && !nn.has(ye) && (nn.set(ye, he), uh(he).then((Be) => {
      Be !== he && (nn.set(ye, Be), q());
    }));
    const Te = he ? nn.get(ye) || he : "";
    return j.push(ie("ol", { class: "al-tracks" }, ...N.map((Be, Ct) => {
      const Ue = String(Be.id) === _, Me = dh(String(Be.id), Ue && W ? F : void 0);
      return ie("li", {}, yn(
        { class: "al-track" + (Ue ? " is-on" : ""), "aria-label": `Play ${Be.title || "#" + Be.id}`, "aria-current": Ue ? "true" : void 0, disabled: de || fe, onClick: () => {
          var Ne;
          return (Ne = $ == null ? void 0 : $.playToken) == null ? void 0 : Ne.call($, Be.id);
        } },
        ie(
          "span",
          { class: "al-th" + (Me ? "" : " is-blank") },
          Me ? ie("img", { src: Me, alt: "", decoding: "async" }) : Te ? ie("img", { src: Te, alt: "", decoding: "async" }) : null,
          Me ? null : ie("span", { class: "al-n" }, String(Ct + 1)),
          Ue ? ie("span", { class: "al-eq", html: Ft.eq }) : null
        ),
        ie("span", { class: "al-tt" }, Be.title || `#${Be.id}`, Be.explicit ? ie("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), j;
  }
  function U(m) {
    var Me;
    const I = m.player, N = I.tracks.filter((Ne) => !Ne.hidden), _ = t.radio(), W = w == null ? void 0 : w.nowPlaying, F = W && I.tracks.some((Ne) => String(Ne.id) === String(W.tokenId)) ? String(W.tokenId) : null, de = F ? I.tracks.find((Ne) => String(Ne.id) === F) : null, fe = m.plays === 0 && !m.playsComing, He = !!m.playsComing && !m.plays, $ = !!(w != null && w.playing) && !!F, j = w == null ? void 0 : w.heart, he = F ? (Me = _ == null ? void 0 : _.getPosition) == null ? void 0 : Me.call(_) : null;
    F && ($ || ((he == null ? void 0 : he.current) ?? 0) > 0.5) && (v = I.id);
    const ye = !!F && v === I.id;
    L && L !== F && (L = null);
    const Te = ye ? String((W == null ? void 0 : W.cover) || "") : "", Be = !!Te && L === F, Ue = [P(I, !fe, { song: Be ? "" : Te, paused: ye && !$, flip: Te ? () => {
      L = L === F ? null : F, q();
    } : void 0, flipped: Be })];
    if (Ue.push(ie(
      "div",
      { class: "al-now" },
      ie(
        "div",
        { class: "al-now-t" },
        ie("div", { class: "al-song" }, de ? de.title || (W == null ? void 0 : W.title) || `#${de.id}` : I.title),
        ie("div", { class: "al-artist" }, de ? de.artist || (W == null ? void 0 : W.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      F ? yn({ class: "al-icon" + (j != null && j.liked ? " is-on" : ""), "aria-label": j != null && j.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(j != null && j.liked)), disabled: !!(j != null && j.pending) || !!(j != null && j.locked) || He, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.toggleLike) == null ? void 0 : Ne.call(_);
      }, html: j != null && j.liked ? Ft.heartOn : Ft.heart }) : null
    )), fe)
      Ue.push(ie(
        "div",
        { class: "al-out" },
        ie("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ie("p", { class: "al-out-t" }, "You've played this album out"),
        ie("p", { class: "al-out-s" }, "Add plays to keep listening."),
        V(m, !0)
      ));
    else {
      const Ne = he != null && he.duration ? Math.min(100, he.current / he.duration * 100) : 0;
      Ue.push(ie(
        "div",
        { class: "al-prog" },
        ie("div", { class: "al-bar" }, ie("i", { style: `width: ${Ne}%` })),
        ie("div", { class: "al-times" }, ie("span", {}, vc((he == null ? void 0 : he.current) || 0)), ie("span", {}, he != null && he.duration ? vc(he.duration) : "–:––"))
      ));
    }
    return Ue.push(ie(
      "div",
      { class: "al-ctl" + (fe || He ? " is-off" : "") },
      yn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: fe || He, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.prev) == null ? void 0 : Ne.call(_);
      }, html: Ft.prev }),
      yn({ class: "al-play", "aria-label": $ ? "Pause" : "Play", disabled: fe || He, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.playPause) == null ? void 0 : Ne.call(_);
      }, html: $ ? Ft.pause : Ft.play }),
      yn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: fe || He, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.next) == null ? void 0 : Ne.call(_);
      }, html: Ft.next })
    )), m.status.length && Ue.push(ie("div", { class: "al-status", role: "status" }, ...m.status)), Ue.push(...M(m, { songs: N, current: F, started: ye, own: Te, out: fe, waiting: He })), Ue.push(ie("div", { class: "al-grow" })), Ue.push(yn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => d(i === "more" ? "" : "more") },
      ie("span", {}, "More ", ie("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ie("span", { html: Ft.down })
    )), Ue;
  }
  function V(m, I) {
    const N = ie("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), _ = I ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const W of _) {
      const F = m.myPlays !== void 0 && m.myPlays >= W && !m.playsComing && !m.busy;
      N.append(yn({ class: "al-topup", disabled: !F, onClick: () => t.topUp(W) }, I ? `Add ${W.toLocaleString()} plays` : `+${W.toLocaleString()}`));
    }
    return I && N.append(yn({ class: "al-link", onClick: () => d("more") }, "Other amounts")), N;
  }
  function le(m) {
    const I = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), N = ie(
      "div",
      { class: "al-card" },
      ie("div", { class: "al-card-h" }, ie("b", {}, `Add plays to ${m.player.title}`), ie("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      V(m, !1),
      ie("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${ca(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !m.playsComing && m.myPlays !== void 0 ? yn({ class: "al-link", onClick: () => {
        d(""), t.openPlayer();
      } }, "Open My player") : null
    ), _ = (F, de, fe, He) => yn(
      { class: "al-row", onClick: He },
      ie("span", { class: "al-row-i", html: F }),
      ie("span", { class: "al-row-t" }, ie("b", {}, de), ie("small", {}, fe)),
      ie("span", { class: "al-row-go", html: Ft.right })
    ), W = ie(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      _(Ft.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, q();
      }),
      o ? ie("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return ie(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      ie("div", { class: "al-sheet-h" }, ie("b", {}, "More"), yn({ class: "al-icon", "aria-label": "Close", onClick: () => d(""), html: Ft.close })),
      m.mode === "open" ? N : null,
      ie(
        "div",
        { class: "al-rows" },
        _(Ft.grid, "My music", "Your albums and the radio", () => d("music")),
        _(Ft.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          d(""), t.openPlayer();
        }),
        m.canMake ? _(Ft.gift, "Albums (admin)", "Make an album and fund copies", () => d("gifts")) : null,
        _(Ft.device, "This device", "Backup, history, Stacks wallet, returns", () => d("device")),
        W
      )
    );
  }
  function ne(m) {
    var fe, He;
    const I = m.player, N = w == null ? void 0 : w.nowPlaying, _ = N && I.tracks.some(($) => String($.id) === String(N.tokenId)) ? String(N.tokenId) : null, W = !!(w != null && w.playing) && !!_, F = _ ? (He = (fe = t.radio()) == null ? void 0 : fe.getPosition) == null ? void 0 : He.call(fe) : null;
    _ && (W || ((F == null ? void 0 : F.current) ?? 0) > 0.5) && (v = I.id);
    const de = !!_ && v === I.id;
    return M(m, {
      songs: I.tracks.filter(($) => !$.hidden),
      current: _,
      started: de,
      own: de ? String((N == null ? void 0 : N.cover) || "") : "",
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
    const I = ie(
      "header",
      { class: "al-top" },
      ie("a", { class: "al-brand", href: "/radio" }, gl("al-logo"), "Xtrata ", ie("b", {}, "Music")),
      m.mode === "open" ? yn({ class: "al-icon", "aria-label": "My music", onClick: () => d("music"), html: Ft.grid }) : null
    ), N = ie("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? U(m) : A(m));
    e.replaceChildren(I, N, ...i === "more" ? [ie("div", { class: "al-scrim", onClick: () => d("") }), le(m)] : []);
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
const RI = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", zI = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${RI}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, GI = (e) => zI("source|audio", e), KI = 48 * 1024 * 1024;
function VI(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function YI(e) {
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
    var A, M, U;
    const y = "/inscription/" + h, S = await t(y, { signal: u }), v = (S.headers.get("content-type") || "").toLowerCase();
    if (!S.ok)
      throw await ((A = S.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (v.startsWith("audio/"))
      return await ((M = S.body) == null ? void 0 : M.cancel()), y;
    if (!v.includes("text/html"))
      throw await ((U = S.body) == null ? void 0 : U.cancel()), new Error("not a song");
    const L = await S.text();
    if (L.length > KI) throw new Error("too large");
    const P = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (P) return VI(P[1].replace(/&amp;/g, "&"));
    const H = w === 0 ? GI(L) : null;
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
const XI = ["Earned", "Claim", "Yours"], qI = ["Connect", "Link", "Name"], bt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, ln = (e, t, n, r = !1) => {
  const s = bt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Sg = (e, t, n, r = !1) => {
  const s = ln("al-album", "", n, r), i = bt("span", "al-album__t");
  return i.append(bt("b", "", e), bt("span", "", t)), s.append(i), s;
}, WI = (e) => `No. ${String(e).padStart(4, "0")}`, ZI = (e) => e.main ? e.linked ? 2 : 1 : 0;
function JI(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const i = (o) => {
    if (s && r === o.art) return s;
    r = o.art, s = bt("div", "aw-art");
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
      const c = bt("header", "al-top"), d = bt("a", "al-brand");
      d.href = "/radio", d.append(gl("al-logo"), bt("span", "", "Xtrata "), bt("b", "", "Music")), c.append(d);
      const h = bt("div", "al-welcome"), u = o.screen, w = o.tier.name, y = typeof o.name == "string" && o.name ? o.name : null;
      if (h.append(u === "have" ? yl(qI, ZI(o)) : yl(XI, u === "making" ? 2 : u === "yours" ? 3 : 1)), u === "making") {
        const H = bt("div", "tier-disc tier-disc--mid");
        H.dataset.tier = o.tier.id, H.append(bt("span", "tier-disc__mark", o.tier.mark)), h.append(H);
      } else if (u !== "have" && u !== "get") {
        const H = i(o);
        H.classList.toggle("aw-art--small", u === "name"), h.append(H);
      }
      const S = u === "ready" ? `Your ${w} record is ready` : u === "name" ? "Put your name on it?" : u === "have" ? "Use the name in your wallet" : u === "get" ? "Get a .btc name" : u === "making" ? "Making your record" : "It’s yours";
      h.append(bt("h1", "", S));
      const v = (H, A = "") => h.append(bt("p", A, H)), L = [];
      if (u === "ready")
        v(`You’ve paid artists for ${o.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(ln("al-primary", `Claim my ${w} record`, () => o.go("name"), o.busy), bt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), ln("al-link", "Later", o.later));
      else if (u === "name")
        y ? (v(`Your record will carry ${y} beside your player’s address.`), L.push(ln("al-primary", `Claim with ${y}`, () => o.claim("auto"), o.busy), ln("al-link", "Use my address only", () => o.claim("none"), o.busy))) : o.name === null ? (v("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          Sg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => o.go("have"), o.busy),
          Sg("I want to get a name", "Where to get one, and how to put it on your player", () => o.go("get"), o.busy),
          ln("al-primary", "Claim with my address", () => o.claim("none"), o.busy)
        )) : (v("Could not check for a .btc name just now.", "ppp-warn"), L.push(ln("al-primary", "Check again", o.refresh, o.busy), ln("al-link", "Claim with my address only", () => o.claim("none"), o.busy))), L.push(bt("p", "al-hint", "What is on the plaque cannot be changed afterwards."));
      else if (u === "have")
        o.main ? !o.linked && o.canLink ? (v(`Link this player to ${o.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(ln("al-primary", "Link my player", o.link, o.busy))) : o.linked ? y ? (v(`Found it: ${y}. It goes on your plaque beside your player’s address.`), L.push(ln("al-primary", `Claim with ${y}`, () => o.claim("auto"), o.busy))) : (v(o.name === null ? `${o.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", o.name === null ? "" : "ppp-warn"), L.push(ln("al-primary", "Check again", o.refresh, o.busy))) : (v(`Linking is not open for ${o.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(ln("al-primary", "Show me how", () => o.go("get"), o.busy))) : (v("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(ln("al-primary", "Connect my wallet", o.connect, o.busy))), L.push(ln("al-link", "Back", () => o.go("name")));
      else if (u === "get") {
        const H = bt("ol", "aw-steps"), A = bt("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const M = bt("a", "", "Open BNS One ↗");
        M.href = "https://bns.one", M.target = "_blank", M.rel = "noopener", A.append(M);
        const U = bt("li");
        U.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", bt("span", "ppp-addr-full", o.player), o.copyAddress());
        const V = bt("li", "", "Check again, and your name shows on the preview before you claim.");
        H.append(A, U, V), h.append(H), L.push(ln("al-primary", "I have my name: check again", () => {
          o.refresh(), o.go("name");
        }, o.busy), ln("al-link", "Back", () => o.go("name")));
      } else if (u === "making") {
        if (v("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), o.claimLink) {
          const H = bt("p", "al-hint"), A = bt("a", "", "See the claim on-chain ↗");
          A.href = o.claimLink, A.target = "_blank", A.rel = "noopener", H.append(A), h.append(H);
        }
      } else if (v(`${w} record ${WI(o.number)}${o.inscription !== void 0 ? ` · Xtrata inscription #${o.inscription}` : ""}. In your player now, and yours for good.`), L.push(ln("al-primary", "See it in my player", o.done)), o.inscription !== void 0) {
        const H = bt("a", "al-link", "Open it full screen ↗");
        H.href = `/i/${o.inscription}`, H.target = "_blank", H.rel = "noopener", L.push(H);
      }
      if (o.status.length) {
        const H = bt("div", "al-status");
        H.setAttribute("role", "status"), H.append(...o.status), h.append(H);
      }
      o.asking ? h.append(bt("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...L);
      const P = bt("div", "al-body al-body--welcome");
      P.append(h), e.hidden = !1, e.replaceChildren(c, P);
    }
  };
}
const db = "xtrata.xyz/music/release", QI = "Release music on Xtrata Music; no spending permission", eL = (e) => ({
  domain: Ir({ name: Et(db), version: Et("1"), "chain-id": In(1) }),
  message: Ir({ purpose: Et(QI), artist: Et(e.artist), release: Et(e.hash), issued: In(e.issued) })
}), tL = "Set the price of my release on Xtrata Music; no spending permission", nL = 100000n, rL = 1000000000n, sL = (e) => e === 0n || e >= nL && e <= rL, iL = (e) => ({
  domain: Ir({ name: Et(db), version: Et("1"), "chain-id": In(1) }),
  message: Ir({ purpose: Et(tL), artist: Et(e.artist), release: Et(e.release), price: In(BigInt(e.price)), issued: In(e.issued) })
}), po = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, oL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, be = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, cn = (e, t, n = "") => {
  const r = be("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Ac = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), vg = (e) => {
  const t = Er(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function Ec(e, t, n = "", r = "") {
  const s = be("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), i = e || n;
  if (i) {
    const o = document.createElement("img");
    o.src = i, o.alt = "", o.decoding = "async", s.append(o);
  }
  return e || s.append(be("span", t)), s;
}
const Uu = (e) => !!e && Kd(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function aL(e) {
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
  const w = (z, O, ae) => {
    const Q = Array.isArray(O) ? O.filter(Uu).map((ue) => ({ ...ue, hidden: !!ue.hidden })) : [];
    d = { for: z, albums: Q, fresh: ae }, ae && e.store.set(c(z), JSON.stringify(Q));
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
    const ae = e.player();
    if (!ae.address || !ae.unlocked)
      return i = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, i = "", e.changed();
    try {
      const Q = await e.signShelf(z, O), ue = await e.json("/radio/release/shelf", Ac(Q));
      return w(ae.address, ue == null ? void 0 : ue.albums, !0), P(ue == null ? void 0 : ue.pay) ? A(ae.address, ue.pay) : z === "add" && A(ae.address, null, O), !0;
    } catch (Q) {
      return z !== "list" && (i = Q.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const L = (z) => "xtrata.radio.releases.orders.v1:" + z, P = (z) => !!z && /^[0-9a-f]{16}$/.test(z.order) && Kd(z.release) && typeof z.to == "string" && /^\d{1,12}$/.test(z.amount) && typeof z.memo == "string", H = (z) => {
    if (!z) return {};
    try {
      const O = JSON.parse(e.store.get(L(z)) || "{}");
      return O && typeof O == "object" ? Object.fromEntries(Object.entries(O).filter(([, ae]) => P(ae))) : {};
    } catch {
      return {};
    }
  };
  function A(z, O, ae = (O == null ? void 0 : O.release) ?? "") {
    var ue;
    const Q = H(z);
    O ? Q[O.release] = { ...((ue = Q[O.release]) == null ? void 0 : ue.order) === O.order ? Q[O.release] : {}, ...O } : delete Q[ae], e.store.set(L(z), Object.keys(Q).length ? JSON.stringify(Q) : null);
  }
  const M = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Map();
  async function V(z, O, ae = !1) {
    var Q;
    if (!M.has(O.order)) {
      M.add(O.order), U.set(O.order, e.now()), ae && (i = "", e.changed());
      try {
        const ue = await e.json("/radio/release/paid", Ac({ order: O.order, ...O.txid ? { txid: O.txid } : {} }));
        (ue == null ? void 0 : ue.status) === "paid" ? (A(z, null, O.release), ((Q = a == null ? void 0 : a.view) == null ? void 0 : Q.id) === O.release && (a.view = { ...a.view, added: a.view.added + 1 }), i = "", M.delete(O.order), (d == null ? void 0 : d.for) === z && (d.fresh = !1), e.player().unlocked && await v("list")) : (P(ue) && A(z, { ...O, ...ue }), ae && (ue == null ? void 0 : ue.status) === "pending" && (i = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (ue) {
        /did not go through|does not pay this order/.test(ue.message || "") && A(z, { ...O, txid: void 0, status: "pending" }), (ae || O.txid) && (i = ue.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        M.delete(O.order), e.changed();
      }
    }
  }
  async function le(z, O, ae) {
    if (!s) {
      s = "Approve the payment in your wallet…", i = "", e.changed();
      try {
        const Q = await e.pay(z, ae.to, BigInt(ae.amount), ae.memo), ue = { ...ae, txid: Q || void 0, status: "confirming" };
        A(O, ue), s = "", V(O, ue);
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
    const ae = H(O.address)[z.id], Q = e.main();
    ae && Q && await le(Q, O.address, ae);
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
        (ae) => {
          Uu(ae) ? (O.view = ae, delete O.error) : O.error = "This release could not be read.";
        },
        (ae) => {
          O.error = ae.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const z = e.player();
    if (z.address) {
      (d == null ? void 0 : d.for) !== z.address && y(z.address), z.unlocked && !(d != null && d.fresh) && !h && e.now() - u > 6e4 && (u = e.now(), v("list"));
      for (const O of Object.values(H(z.address)))
        if ((O.txid || O.status === "confirming") && !M.has(O.order) && e.now() - (U.get(O.order) ?? -1 / 0) > 2e4) {
          const ae = z.address;
          V(ae, O).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const m = () => t ? S().filter((z) => !z.hidden) : [];
  function I(z, O) {
    const ae = be("ol", "", "ppp-rel-songs");
    return z.forEach((Q, ue) => {
      const et = be("li");
      et.append(Ec(e.art.song(Q.id, !0) || "", String(ue + 1), O), be("span", Q.title)), ae.append(et);
    }), ae;
  }
  function N() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [be("p", `♫ ${a.error}`, "ppp-warn")] : [be("p", "♫ Opening this release…", "ppp-mute")];
    const z = a.view, O = be("div", "", "ppp-release-in"), ae = be("p", "", "ppp-release-in__h"), Q = BigInt(/^\d{1,12}$/.test(z.price ?? "") ? z.price : "0");
    ae.append(be("b", z.title), be("span", `${z.subtitle || e.who(z.artist)} · ${vg(z)}${Q > 0n ? ` · ${po(Q)} STX` : ""}`));
    const ue = Er(z), et = e.art.cover(z.cover) || (z.cover ? "" : ue[0] && e.art.song(ue[0].id, !0) || ""), $e = be("div", "", "ppp-rel-top");
    $e.append(Ec(et, "💿", "", "is-cover"), ae), O.append($e, I(ue.map((Se) => ({ id: Se.id, title: Se.title || `#${Se.id}` })), e.art.cover(z.cover))), O.append(be("p", `Released by ${e.who(z.artist)}. ${z.added === 1 ? "1 player has" : `${z.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const _e = e.player(), ct = S().find((Se) => Se.id === z.id), Le = be("div", "", "ppp-award__row");
    if (ct)
      O.append(be("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), Le.append(cn("Play it", () => e.open(z), "primary"));
    else if (!_e.address) O.append(be("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!_e.unlocked) O.append(be("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (Q > 0n) {
      const Se = H(_e.address)[z.id], je = e.main(), Je = `${po((Se == null ? void 0 : Se.amount) ?? Q)} STX`;
      if (Se != null && Se.txid || (Se == null ? void 0 : Se.status) === "confirming") {
        O.append(be("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Ae = cn("Check now", () => void V(_e.address, Se, !0));
        Ae.disabled = M.has(Se.order), Le.append(Ae);
      } else if (O.append(be("p", `This album costs ${Je}. You pay ${e.who(z.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Se) O.append(be("p", "Buying is paused right now.", "ppp-warn"));
      else if (Se) {
        if (je) {
          const Kt = cn(`Pay ${Je} from my wallet`, () => void le(je, _e.address, Se), "primary");
          Kt.disabled = !!s, Le.append(Kt);
        } else O.append(be("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Ae = be("div", "", "ppp-rel-pay"), Jt = (Kt, gt, fn) => {
          const Hn = be("p");
          return Hn.append(be("span", Kt), be("code", gt), ir(`order-${fn}:${Se.order}`, "Copy", () => gt, "tiny", e.changed)), Hn;
        };
        Ae.append(Jt("Send", po(Se.amount) + " STX", "amount"), Jt("To", Se.to, "to"), Jt("Memo", Se.memo, "memo")), O.append(Ae, be("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const rn = cn("I have paid: check", () => void V(_e.address, Se, !0));
        rn.disabled = M.has(Se.order), Le.append(rn);
      } else {
        const Ae = cn(`Buy · ${Je}`, () => void ne(z), "primary");
        Ae.disabled = h || !!s, Le.append(Ae);
      }
    } else {
      O.append(be("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Se = cn("Add to my player", () => {
        v("add", z.id).then((je) => {
          je && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Se.disabled = h, Le.append(Se);
    }
    return Le.append(cn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), O.append(Le), s && O.append(be("p", s, "ppp-cyan")), i && O.append(be("p", i, "ppp-warn")), [O];
  }
  let _ = !1;
  function W() {
    const z = t ? S() : [];
    if (!z.length) return null;
    const O = be("details", "", "ppp-release-manage");
    O.open = _, O.ontoggle = () => {
      _ = O.open;
    };
    const ae = z.filter((ue) => ue.hidden).length;
    O.append(be("summary", `Albums I added (${z.length}${ae ? `, ${ae} hidden` : ""})`));
    const Q = e.player().unlocked;
    Q || O.append(be("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const ue of z) {
      const et = be("div", "", "ppp-release-row" + (ue.hidden ? " is-hidden" : "")), $e = be("span", "", "ppp-release-row__t");
      $e.append(be("b", ue.title), be("span", `${ue.subtitle || e.who(ue.artist)}${ue.hidden ? " · hidden" : ""}`));
      const _e = cn(ue.hidden ? "Show" : "Hide", () => void v(ue.hidden ? "show" : "hide", ue.id), "tiny"), ct = cn("Remove", () => void v("remove", ue.id), "tiny");
      _e.disabled = ct.disabled = !Q || h, et.append($e, _e, ct), O.append(et);
    }
    return O.append(be("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), i && !a && O.append(be("p", i, "ppp-warn")), O;
  }
  let F = null, de = [], fe = null;
  const He = be("input");
  He.maxLength = 60, He.placeholder = "Title of the single, EP or album", He.setAttribute("aria-label", "Release title");
  const $ = be("input");
  $.maxLength = 80, $.placeholder = "Artist name shown under the title", $.setAttribute("aria-label", "Artist name");
  const j = be("input");
  j.inputMode = "numeric", j.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", j.setAttribute("aria-label", "Cover inscription number");
  const he = be("input");
  he.inputMode = "decimal", he.placeholder = "Price in STX, e.g. 2 (0 makes it free)", he.setAttribute("aria-label", "Price in STX");
  let ye = null;
  const Te = (z, O, ae = "") => {
    ye = (ye == null ? void 0 : ye.id) === z && ye.what === O ? null : { id: z, what: O }, (ye == null ? void 0 : ye.what) === "price" && (he.value = ae), i = "", e.changed();
  };
  async function Be(z, O) {
    if (s) return;
    const ae = oL(he.value);
    if (ae === null || !sL(ae)) {
      i = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", i = "", e.changed();
    try {
      const Q = { artist: z, release: O.id, price: ae.toString(), issued: e.now() }, ue = await e.sign(z, iL(Q));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", Ac({ request: Q, signature: ue })), i = ae > 0n ? `Price set ✓ “${O.title}” now costs ${po(ae)} STX, paid straight to this wallet.` : `“${O.title}” is free again ✓`, ye = null, Me(z, !0);
    } catch (Q) {
      i = Q.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const Ct = (z) => `${location.origin}${location.pathname}?release=${z}`;
  function Ue(z) {
    F = { for: z, loading: !0 }, de = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(z)).then(
      (O) => {
        const ae = Array.isArray(O == null ? void 0 : O.songs) ? O.songs.filter((Q) => Number.isSafeInteger(Q == null ? void 0 : Q.id) && typeof Q.title == "string") : null;
        F = ae ? { for: z, songs: ae, more: !!O.more } : { for: z, error: "Your songs could not be read right now." };
      },
      (O) => {
        F = { for: z, error: O.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Me(z, O = !1) {
    !O && (fe == null ? void 0 : fe.for) === z && e.now() - fe.at < 6e4 || (fe = { for: z, list: (fe == null ? void 0 : fe.for) === z ? fe.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(z)).then((ae) => {
      Array.isArray(ae == null ? void 0 : ae.releases) && (fe = { for: z, list: ae.releases.filter(Uu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Ne(z) {
    if (!s) {
      s = "Checking your release…", i = "", e.changed();
      try {
        const O = j.value.trim().replace(/^#/, ""), ae = cb({ title: He.value.trim(), subtitle: $.value.trim(), tracks: [...de], cover: O ? Number(O) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const Q = { artist: z, hash: lb(ae), issued: e.now() }, ue = await e.sign(z, eL(Q));
        s = "Releasing…", e.changed();
        const et = await e.json("/radio/release/create", Ac({ definition: ae, request: Q, signature: ue }));
        i = `${et.existing ? "Already released" : "Released"} ✓ “${et.title}”. Its link is below.`, de = [], He.value = "", j.value = "", e.audition.stop(), Me(z, !0);
      } catch (O) {
        i = O.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const Zt = () => {
    queueMicrotask(() => e.audition.stop());
  }, Gt = /* @__PURE__ */ new Set();
  function Qe(z) {
    const O = de.map((Ae) => z.find((Jt) => Jt.id === Ae)).filter((Ae) => !!Ae), ae = j.value.trim().replace(/^#/, ""), Q = /^\d{1,9}$/.test(ae) ? Number(ae) : null, ue = e.art.cover(Q), et = O[0] ? e.art.song(O[0].id, !0) : null, $e = be("div", "", "ppp-release-preview");
    $e.append(be("p", "How it will look", "ppp-featured__h"));
    const _e = be("p", "", "ppp-release-in__h"), ct = be("b", He.value.trim() || "Untitled"), Le = be("span", `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`);
    _e.append(ct, Le);
    const Se = be("div", "", "ppp-rel-top");
    Se.append(Ec(Q ? ue : et || "", "💿", "", "is-cover"), _e), $e.append(Se, I(O.map((Ae) => ({ id: Ae.id, title: Ae.title })), ue));
    const je = O.filter((Ae) => e.art.song(Ae.id, !0) === null).length, Je = [];
    Q && !ue && Je.push(`Looking for an image in #${Q}… If none appears, that inscription is not a picture.`), je && Je.push(`Finding artwork for ${je} ${je === 1 ? "song" : "songs"}…`), !je && O.some((Ae) => e.art.song(Ae.id, !1) === "") && Je.push(`A numbered square is a song with no artwork of its own${ue ? ": it shows the cover, dimmed" : ""}.`);
    for (const Ae of Je) $e.append(be("p", Ae, "ppp-mute"));
    return He.oninput = () => {
      ct.textContent = He.value.trim() || "Untitled";
    }, $.oninput = () => {
      Le.textContent = `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`;
    }, j.onchange = () => e.changed(), $e;
  }
  function Lt() {
    var ae;
    const z = e.main();
    if (!t || !z)
      return F && (F = null, de = [], Zt()), null;
    const O = [be("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (F && F.for !== z && (F = null, de = [], Gt.clear(), Zt()), !F) O.push(cn("Show the songs in my wallet", () => Ue(z), "primary"));
    else if (F.loading) O.push(be("p", "Reading your wallet…", "ppp-cyan"));
    else if (F.error) O.push(be("p", F.error, "ppp-warn"), cn("Try again", () => Ue(z)));
    else if (!F.songs.length) O.push(be("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      O.push(be("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const Q = be("div", "", "ppp-release-songs");
      for (const $e of F.songs) {
        const _e = de.indexOf($e.id), ct = be("div", "", "ppp-release-song" + (_e >= 0 ? " is-on" : "")), Le = e.audition.state($e.id);
        Le !== "idle" && Gt.add($e.id);
        const Se = cn(Le === "playing" ? "❚❚" : Le === "loading" ? "…" : "▶", () => e.audition.toggle($e.id), "ppp-release-hear" + (Le === "playing" ? " is-on" : ""));
        Se.setAttribute("aria-label", Le === "playing" ? `Stop ${$e.title}` : `Listen to ${$e.title}`), Se.title = Le === "error" ? "This song could not be played just now" : Le === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const je = e.art.song($e.id, _e >= 0 || Gt.has($e.id)), Je = cn("", () => {
          de = _e >= 0 ? de.filter((Ae) => Ae !== $e.id) : [...de, $e.id], e.changed();
        }, "ppp-release-pick");
        Je.setAttribute("aria-pressed", String(_e >= 0)), Je.append(be("i", _e >= 0 ? String(_e + 1) : "+"), be("b", $e.title), be("span", Le === "error" ? "could not play" : `${$e.artist ? $e.artist + " · " : ""}#${$e.id}`, Le === "error" ? "ppp-warn" : "")), ct.append(Se, Ec(je || "", je === "" ? "♪" : "", ""), Je), Q.append(ct);
      }
      O.push(Q), F.more && O.push(be("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !$.value && de.length && ($.value = ((ae = F.songs.find(($e) => $e.id === de[0])) == null ? void 0 : ae.artist) || "");
      const ue = de.length === 0 ? "release" : de.length === 1 ? "single" : de.length <= 6 ? "EP" : "album", et = cn(de.length ? `Sign and release this ${ue} · ${de.length} ${de.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Ne(z), "primary");
      et.disabled = !de.length || !!s, O.push(He, $, j), de.length && O.push(Qe(F.songs)), O.push(et);
    }
    if (s && O.push(be("p", s, "ppp-cyan")), i && !a && O.push(be("p", i, /✓/.test(i) ? "ppp-ok" : "ppp-warn")), Me(z), (fe == null ? void 0 : fe.for) === z && fe.list.length) {
      O.push(be("p", "Your releases", "ppp-featured__h"));
      for (const Q of fe.list) {
        const ue = be("div", "", "ppp-release-row"), et = be("span", "", "ppp-release-row__t"), $e = BigInt(/^\d{1,12}$/.test(Q.price ?? "") ? Q.price : "0"), _e = $e > 0n ? ` · ${po($e)} STX · ${(Q.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (et.append(be("b", Q.title), be("span", `${vg(Q)} · added by ${Q.added.toLocaleString()} ${Q.added === 1 ? "player" : "players"}${_e}`)), ue.append(et, ir("release-link:" + Q.id, "Copy link", () => Ct(Q.id), "tiny", e.changed)), n.sales) {
          const Le = cn("Price", () => Te(Q.id, "price", $e > 0n ? po($e) : ""), "tiny");
          Le.setAttribute("aria-expanded", String((ye == null ? void 0 : ye.id) === Q.id && ye.what === "price")), ue.append(Le);
        }
        if (n.copies && e.copies) {
          const Le = cn("Send copies", () => Te(Q.id, "copies"), "tiny");
          Le.setAttribute("aria-expanded", String((ye == null ? void 0 : ye.id) === Q.id && ye.what === "copies")), ue.append(Le);
        }
        if (O.push(ue), (ye == null ? void 0 : ye.id) !== Q.id) continue;
        const ct = be("div", "", "ppp-release-way");
        if (ye.what === "price" && n.sales) {
          const Le = cn("Sign this price", () => void Be(z, Q), "primary");
          Le.disabled = !!s, ct.append(
            be("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            he,
            Le
          );
        } else ye.what === "copies" && n.copies && e.copies && ct.append(...e.copies(z, { id: Q.id, title: Q.title }));
        ct.childNodes.length && O.push(ct);
      }
    }
    return O;
  }
  return { sync: q, albums: m, banner: N, manage: W, fold: Lt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(F != null && F.songs) && !!e.main()), enabled: () => t === !0 };
}
const Hu = "xtrata.radio.replace.v1", un = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, zs = (e, t, n = "") => {
  const r = un("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Ag = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function cL(e) {
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
    const v = [], L = (V, le) => v.push(un("p", `Replacing your old player · step ${V} of 3 · ${le}`, "ppp-cyan")), P = () => zs("Stop · keep my old player", w, "quiet");
    if (S.listening && S.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      v.push(un("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), S.phrase && !S.backedUp ? v.push(un("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), zs("Back up my player · 24 words", e.backup, "primary")) : S.backedUp && v.push(un("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const V = S.passkeyName ? `the one called “${S.passkeyName}”` : "the newest one";
      return v.push(un("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${V}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), v.push(zs("Done", w, "quiet")), v;
    }
    if (!S.listening || n.removed)
      return n.removed ? (L(3, "claim your new player"), v.push(un("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), v.push(zs("Hide this", w, "quiet")), v) : null;
    if (c(n.old), S.step === "locked" || S.step === "intro")
      return L(1, "empty it"), v.push(un("p", "Unlock your old player so it can be emptied."), zs("Unlock my old player", e.unlock, "primary"), P()), v;
    const H = e.keepBoth(S), A = (V) => (L(1, "empty it"), v.push(un("p", V, "ppp-warn")), H && v.push(zs("Keep both players instead", () => {
      w(), H();
    }, "primary")), v.push(P()), v);
    if (S.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((s == null ? void 0 : s.for) !== n.old)
      return L(1, "empty it"), v.push(un("p", "Checking what this player has…", "ppp-mute"), P()), v;
    if (s.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (s.n > 0) return A(`This player has ${s.n === 1 ? "an album" : `${s.n} albums`} of its own. Replacing it would leave ${s.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((U = S.award) == null ? void 0 : U.state) === "claimed" && S.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (S.depositPending || S.entries.some((V) => ["prepared", "signed", "unknown", "pending"].includes(String(V.status))))
      return L(1, "empty it"), v.push(un("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), P()), v;
    if (S.balance === void 0)
      return L(1, "empty it"), v.push(un("p", "Checking what it holds…", "ppp-mute"), P()), v;
    if (S.balance > e.dust(S))
      return L(1, "empty it"), v.push(un("p", `It holds ${Ag(S.balance)} STX. Send it back${S.returnTo ? ` to ${e.who(S.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), S.returnTo || S.gift ? v.push(zs("Send everything back", e.returnAll, "primary")) : v.push(un("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), v.push(P()), v;
    L(2, "remove it from this device"), v.push(un("p", S.balance > 0n ? `Empty ✓ (the ${Ag(S.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), v.push(un("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const M = zs(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, o = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (V) => {
        o = /cancel/i.test((V == null ? void 0 : V.message) || "") ? "" : (V == null ? void 0 : V.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return M.disabled = a || !!S.busy, v.push(M, P()), o && v.push(un("p", o, "ppp-warn")), v;
  }
  return { active: d, claiming: h, start: u, stop: w, lines: y };
}
const lL = [
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
function uL(e) {
  for (const [t, n] of lL) if (n.test(e)) return t;
  return null;
}
const fb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), hb = (e) => /Android/.test(e);
function dL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : fb(t) ? "x-safari-" + n.href : hb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const fL = (e) => fb(e) ? "Safari" : hb(e) ? "Chrome" : "your browser", go = "Xtrata Music Wallet", hL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Eg(e, t = (n) => n) {
  var i, o, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((i = e.gate) == null ? void 0 : i.passkeyOnly) || e.linked || ((o = e.others) == null ? void 0 : o.length) ? [{ action: null, label: go, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const d = e.standIn === c && hL.has(e.step);
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
const Ou = "xtrata.radio.novice", pb = "xtrata.radio.novice.previewed.v1", kg = 6 * 6e4;
function pL(e, t) {
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
const gL = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, $g = (e) => gL.test(e ?? ""), yL = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, wL = {
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
}, mL = (e, t) => wL[e] ?? t;
function bL(e, t) {
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
const xL = "Make your player once, with Face ID or your fingerprint, and the music starts.", SL = "Checking your player…", Xd = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function gb(e) {
  try {
    const t = JSON.parse(e.get(pb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function vL(e, t) {
  const n = gb(e).filter((r) => r !== t);
  n.push(t), e.set(pb, JSON.stringify(n.slice(-50)));
}
function Du(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...Xd(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : Xd();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > kg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > kg ? { ...e, phase: "done" } : e;
  }
}
const kc = (e) => e.phase === "open" || e.phase === "playing";
function AL(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const EL = [100, 250, 500, 1e3], kL = (e, t = Lr) => BigInt(e) * bn(t);
function $L(e, t = Lr, n = 0n) {
  const r = ss - e - n;
  return r > 0n ? Number(r / bn(t)) : 0;
}
function IL(e, t = Lr, n = 0n) {
  const r = e === void 0 ? 0 : $L(e, t, n);
  return EL.map((s) => ({ plays: s, stx: kL(s, t), fits: e !== void 0 && s <= r }));
}
const LL = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, CL = (e) => LL[e.unit](e.amount), Pt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Oc = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function TL(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${Oc(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${Oc(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${Oc(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function BL(e) {
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
    const a = IL(o.balance, o.fee, o.incoming);
    s(a);
    const c = AL(o.switches);
    (y = c.find((S) => S.id === r)) != null && y.on || (r = "stx");
    const d = [], h = Pt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", d.push(h), d.push(Pt("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Oc(o.playsLeft, "play", "plays")} left.`));
    const u = TL(o.done);
    if (u && d.push(Pt("p", "ppp-restock__done", u)), o.arriving)
      d.push(Pt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      d.push(Pt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((S) => S.fits))
      d.push(Pt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const S = Pt("div", "ppp-restock__packs");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How many plays");
      for (const P of a) {
        const H = Pt("button", "ppp-restock__pack" + (P.plays === n ? " is-on" : ""));
        H.type = "button", H.disabled = !P.fits, H.setAttribute("aria-pressed", String(P.plays === n)), H.append(Pt("b", "", P.plays.toLocaleString()), Pt("span", "", "plays")), H.onclick = () => {
          n = P.plays, i();
        }, S.append(H);
      }
      d.push(S);
      const v = Pt("div", "ppp-restock__ways");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How to pay");
      for (const P of c) {
        const H = Pt("button", "ppp-restock__way" + (P.id === r ? " is-on" : ""));
        H.type = "button", H.disabled = !P.on, H.setAttribute("aria-pressed", String(P.id === r)), H.append(Pt("b", "", P.label), Pt("span", "", P.on ? P.blurb : "Soon")), H.onclick = () => {
          r = P.id, i();
        }, v.append(H);
      }
      d.push(v);
      const L = a.find((P) => P.plays === n);
      if (L && r === "stx") {
        const P = Pt("div", "ppp-restock__pay"), H = CL({ unit: "microSTX", amount: L.stx }), A = Pt("p", "ppp-restock__amount");
        A.append("Send ", Pt("b", "", H), " to your player:"), P.append(A, Pt("p", "ppp-addr-full ppp-restock__addr", o.address));
        const M = Pt("div", "ppp-restock__row");
        M.append(e.copyButton("restock-address", "Copy address", () => o.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => br(L.stx), "")), P.append(M), P.append(Pt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${o.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), d.push(P);
      }
    }
    d.push(Pt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = Pt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), d.push(w), t.replaceChildren(...d);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Pt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
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
const os = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), ML = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function NL(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const i = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(i) || i < 0 || n.has(i)) continue;
    n.add(i);
    const o = t(i, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: i, title: ML(o.title) ? `#${i}` : o.title.trim(), artist: (o.artist || "").trim() });
  }
  return r.sort((s, i) => s.id - i.id);
}
function _L(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = os(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function PL(e, t, n = "", r = 60) {
  const s = os(t).split(/\s+/).filter(Boolean), i = os(n);
  if (!s.length && !i) return { songs: [], total: 0 };
  const o = [];
  for (const a of e) {
    const c = os(a.artist), d = os(a.title), h = String(a.id);
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
const nr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Ig = 12;
function UL(e, t) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const a = nr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = nr("div", "hint"), d = nr("div", "find-artists"), h = nr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const u = nr("div", "likesTools");
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
      const M = nr("button", "", "Try again");
      M.type = "button", M.onclick = () => {
        r = "idle", w();
      }, c.append(M), d.replaceChildren(), h.replaceChildren();
      return;
    }
    const v = _L(n), L = o ? v : v.slice(0, Ig), P = (M, U, V, le = "") => {
      const ne = nr("button", "find-chip" + (U ? " is-on" : ""), M);
      return ne.type = "button", ne.setAttribute("aria-pressed", String(U)), le && (ne.title = le), ne.onclick = V, ne;
    };
    d.replaceChildren(
      ...L.map((M) => P(`${M.name} · ${M.songs}`, os(M.name) === os(i), () => {
        i = os(M.name) === os(i) ? "" : M.name, y();
      }, `Show ${M.name}’s ${M.songs === 1 ? "song" : `${M.songs} songs`}`)),
      ...v.length > Ig ? [P(o ? "Fewer artists" : `All ${v.length} artists`, !1, () => {
        o = !o, y();
      })] : []
    );
    const H = PL(n, s, i), A = t.current();
    h.replaceChildren(...H.songs.map((M) => {
      var le, ne;
      const U = nr("li", "lrow" + (M.id === A ? " now" : "")), V = nr("button", "lt", M.title);
      if (V.type = "button", V.title = `Play “${M.title}”${M.artist ? ` by ${M.artist}` : ""}`, V.onclick = () => t.play(M.id), (le = t.explicit) != null && le.call(t, M.id)) {
        const q = nr("span", "exp", "E");
        q.title = "Explicit lyrics: only plays when you choose it", V.append(" ", q);
      }
      if ((ne = t.liked) != null && ne.call(t, M.id)) {
        const q = nr("span", "find-liked", "♥");
        q.title = "You like this song", q.setAttribute("role", "img"), q.setAttribute("aria-label", "Liked"), U.append(V, q);
      } else U.append(V);
      return U.append(nr("span", "find-by", `${M.artist ? M.artist + " · " : ""}#${M.id}`)), U;
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
], $c = (e) => typeof e == "string" && ma.some((t) => t.id === e), Ic = (e) => ma.find((t) => t.id === e), HL = (e) => ma.find((t) => e >= t.min) ?? ma[ma.length - 1];
function OL(e, t = Lr) {
  return HL(e <= Xt ? 0 : Number((e - Xt) / bn(t)));
}
const Lg = (e, t, n) => uf(hf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), Cg = document.getElementById("ppp");
Cg && DL(Cg);
function DL(e) {
  var te;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = zb(), s = (l) => e.querySelector(l), i = s(".ppp-frame");
  let o = null;
  const a = async (l, p) => {
    const g = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, c = b5({
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
      const p = new Promise((X, re) => {
        o.addEventListener("load", () => X(), { once: !0 }), setTimeout(() => re(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = l + "/", i.replaceChildren(o), await p;
      const g = new _b({ walletOrigin: l, frame: o, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), T = (X, re) => f.has(X) ? g.request(X, re) : Promise.race([
        g.request(X, re),
        new Promise((se, Ee) => setTimeout(() => Ee(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await T("listening.status"), { request: T };
    },
    chain: {
      verify: J6,
      balance: e5,
      account: Q6,
      owner: t5,
      broadcast: n5,
      transaction: r5,
      confirmedNonce: async (l) => {
        const p = await Zs(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => ku({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, g) => new Promise((f, T) => G0({
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
    validate: s5,
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
      return S.funder(l, () => u5(l, Zs), !!((g = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && g.enabled));
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
    history: (l, p) => h5(l, (g) => Zs(g), p),
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
    nameOf: (l) => Dt(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), d = (l, p, g, f, T, X) => new Promise((re, se) => G0({
    recipient: f,
    amount: T.toString(),
    memo: X,
    stxAddress: g,
    network: new Fu(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Ee) => re(Ee.txId || ""),
    onCancel: () => se(new Error(p)),
    onError: se
  })), h = (l) => S.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, u = (l) => h(l) && l.canForget ? () => {
    w.start(l), rt(c.snapshot());
  } : null, w = cL({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => Re(l),
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
  }), y = () => ({ quick: !!S.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), S = mI({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, g, f) => d("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, g, f),
    sign: (l, p) => ku({ ...p, network: "mainnet", stxAddress: l }),
    giftSent: (l, p) => c.giftSent(l, p),
    claiming: (l) => c.giftClaiming(l),
    claimNew: (l) => h(l),
    replaceOld: (l) => u(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, p, g, f) => {
      v.invalidate(), await c.albumArriving(l, p, g, f);
    } },
    who: (l) => Re(l),
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
  }), v = LI({
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
  }, P = pL(location.search, L);
  P.on && (document.documentElement.dataset.novice = P.preview ? "preview" : "1");
  const H = (l) => P.on && l.solo, A = P.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), M = A ? document.getElementById("album") : null, U = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, V = M ? xg(M, U) : null, le = aL({
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
    open: (l) => Je(l, !0),
    who: (l) => Re(l),
    art: { song: (l, p) => p && dh(String(l)) || wg(String(l)), cover: (l) => Hc(l) },
    audition: YI({
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
  }, q = M ? JI(M) : null, m = "xtrata.radio.award.later.v1";
  let I = "ready", N = !1, _ = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(m) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), W = !1;
  const F = "xtrata.radio.tier.v1";
  let de = (() => {
    const l = L.get(F);
    return $c(l) ? Ic(l) : null;
  })();
  const fe = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function He(l) {
    var T;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let X = null;
      try {
        X = l.gift && !l.gift.player && l.gift.drop === "players" ? OL(BigInt(l.gift.amount)) : null;
      } catch {
        X = null;
      }
      ((T = l.award) == null ? void 0 : T.state) === "claimed" && l.award.holds === !1 && (X = null), ((X == null ? void 0 : X.id) ?? null) !== ((de == null ? void 0 : de.id) ?? null) && (de = X, L.set(F, X ? X.id : null));
    }
    const p = document.documentElement;
    de ? p.dataset.tier = de.id : delete p.dataset.tier;
    const g = document.querySelector("#ppp .ppp-head h3");
    if (!g) return;
    let f = g.querySelector(".ppp-tier");
    if (!de) {
      f == null || f.remove();
      return;
    }
    f || (f = C("span", "", "ppp-tier"), g.append(f)), f.dataset.tier = de.id, f.textContent = `${de.mark} ${de.name.toUpperCase()} PLAYER`, f.title = `A ${de.name} player from the Xtrata Music giveaway`;
  }
  const $ = P.on && M ? HI(M) : null, j = Date.now();
  let he = !1, ye = null, Te = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const Be = () => {
    Te = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    rt(c.snapshot());
  }, Ct = (l, p) => {
    var T;
    if (!$ || p || Te) return null;
    if (!l.gate || l.step === "loading" || (he = !0), !he) return Date.now() - j < 1e4 ? "checking" : null;
    if (!H(l) || w.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return S.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((T = l.gift) != null && T.player) && !l.entries.some((X) => X.kind === "play");
    return l.step === "fund" && f ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (ye === "arriving" || ye === "landed") ? "landed" : l.step === "loading" && ye !== "checking" ? ye : null;
  };
  let Ue = !1;
  function Me(l, p, g = [], f) {
    if (!$) return;
    const T = f !== void 0 ? f : Ct(l, p);
    if (ye = T, delete document.documentElement.dataset.noviceBoot, !T) {
      $.render(null, p);
      return;
    }
    const X = [...g];
    T === "arriving" && l.arrival && X.push(Xr(l.arrival)), l.step === "unsupported" ? X.push(C("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && X.push(C("p", l.error, "ppp-warn"));
    const re = T === "gift" ? S.incomingStarter() : null;
    re && !Ue && l.step === "intro" && !l.busy && !l.armed && !l.error && !_t && (Ue = !0, c.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), $.render({
      mode: T,
      status: X,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !_t,
      plays: re ? re.plays : T === "landed" ? l.playsLeft : null,
      from: (re == null ? void 0 : re.from) ?? null,
      tier: de,
      mystery: fe,
      albums: T === "landed" ? $e.map((se) => ({ title: se.title, by: se.subtitle, cover: Hc(se.cover), run: () => {
        Be(), Je(se, !0);
      } })) : [],
      claimNew: T === "back" ? h(l) : null,
      replaceOld: T === "back" ? u(l) : null,
      start: () => void c.create(y()),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Gt(),
      full: () => {
        var x, B, D;
        const se = window.XtrataRadio, Ee = T === "landed" && !((B = (x = se == null ? void 0 : se.getState) == null ? void 0 : x.call(se)) != null && B.playing);
        Be(), Ee && ((D = se == null ? void 0 : se.playPause) == null || D.call(se));
      }
    });
  }
  $ && setTimeout(() => {
    he || rt(c.snapshot());
  }, 10100), ch(() => {
    ($ != null && $.showing() || document.documentElement.dataset.asking || le.wantsArt()) && rt(c.snapshot());
  });
  const Zt = BL({
    input: () => {
      var T, X, re, se;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (T = l.likeFunds) == null ? void 0 : T.balance };
      if (!p.address) return null;
      const g = l.slot === 0 ? l.entries : [], f = g.filter((Ee) => Ee.kind === "play" && Ee.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : we(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((X = l.gate) == null ? void 0 : X.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((re = l.gate) == null ? void 0 : re.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Ee) => Ee.recipient)).size, likes: g.filter((Ee) => Ee.kind === "like" && Ee.status === "confirmed" && Ee.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((se = l.likeFunds) != null && se.pending)
      };
    },
    copyButton: (l, p, g, f) => ir(l, p, g, f, () => {
      rt(c.snapshot());
    })
  }), Gt = () => {
    if (!c.snapshot().unproven) {
      Zt.open();
      return;
    }
    c.prove().then((l) => {
      l && Zt.open();
    });
  }, Qe = document.getElementById("albumList"), Lt = Qe ? xg(Qe, U, { list: !0 }) : null, St = "xtrata.radio.album.last.v1", z = () => {
    try {
      const l = JSON.parse(localStorage.getItem(St) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let O = "";
  const ae = (l) => {
    const p = JSON.stringify(l);
    if (p !== O) {
      O = p;
      try {
        localStorage.setItem(St, p);
      } catch {
      }
    }
  };
  let Q = null;
  window.XtrataRadioLikeHandler = (l) => {
    var g;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (g = c.snapshot().likeFunds) != null && g.album && (k = !0), ds();
    const p = Sn(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let ue;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const et = (l) => {
    var g, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== ue && (ue = p, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let $e = [], _e = 0, ct = !1, Le = null;
  const Se = (l) => {
    var p, g;
    ct || !((g = (p = l.gate) == null ? void 0 : p.gifts) != null && g.enabled) || Date.now() - _e < 6e4 || (_e = Date.now(), a("/radio/gift/featured").then((f) => {
      $e = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((T) => T && typeof T.id == "string" && typeof T.title == "string" && Array.isArray(T.tracks) && T.tracks.length > 0).slice(0, 6), ct = !0, $e.length && rt(c.snapshot());
    }).catch(() => {
    }));
  }, je = (l) => {
    var p;
    return Le && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? Le : null;
  }, Je = (l, p = !1) => {
    var f, T;
    Le = l, rt(c.snapshot());
    const g = l && p ? Er(l)[0] : null;
    g && ((T = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || T.call(f, g.id));
  };
  let Ae = Xd(), Jt = null;
  const rn = (l) => {
    const p = P.preview && !_t && l.step === "intro" ? S.incomingAlbum() : null;
    return p ? (Ae = Du(Ae, { kind: "offer", album: p.player.id, already: gb(L).includes(p.player.id) }), kc(Ae) ? p.player : null) : (Ae = Du(Ae, { kind: "withdraw" }), null);
  }, Kt = (l) => {
    const p = Ae.phase;
    Ae = Du(Ae, l), Ae.phase !== p && (Ae.album && (Ae.phase === "playing" || Ae.phase === "done") && vL(L, Ae.album), rt(c.snapshot()));
  };
  setInterval(() => {
    Ae.phase === "playing" && Kt({ kind: "tick", at: Date.now() });
  }, 5e3);
  let gt = "", fn, Hn = !1, lr = !1;
  const Vr = (l, p) => {
    var D, J, xe, De, Tt, wt, hr, pn;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((D = l.giftStop) == null ? void 0 : D.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, T = Jt, X = f ? H(l) ? mL(f.reason, f.text) : f.text : null, re = T ? null : X ?? (t && (!((J = l.gate) != null && J.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    re && re !== fn && (g.setGiftStop(re), fn = re);
    const se = l.step === "off" || l.step === "elsewhere" ? null : ((xe = l.gift) == null ? void 0 : xe.player) ?? T ?? je(l) ?? null, Ee = se ? se.id + ":" + se.cover + ":" + se.tracks.map((Cr) => Cr.id).join(",") : "";
    Ee !== gt && (g.setGiftPlayer(se ? { id: se.id, title: se.title, subtitle: se.subtitle, tracks: Er(se).map((Cr) => Cr.id), hidden: ((De = gI(se)) == null ? void 0 : De.id) ?? null, cover: se.cover } : null), gt = Ee), re !== fn && (g.setGiftStop(re), fn = re);
    const x = (f == null ? void 0 : f.reason) === "arriving";
    x !== lr && ((Tt = g.setGiftWait) == null || Tt.call(g, x), lr = x);
    const B = !!se && (!!T || !!((wt = l.albumLock) != null && wt.locked));
    B !== Hn && ((hr = g.setGiftLock) == null || hr.call(g, B), Hn = B), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((pn = g.forgetWallets) == null || pn.call(g));
  };
  let k = !1;
  const R = /* @__PURE__ */ new Map(), K = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let g = R.get(l.listening);
    return g === void 0 && (g = Date.now(), R.set(l.listening, g)), Date.now() - g < dl ? g : null;
  }, Y = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && R.has(l.listening), ee = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", we = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > Xt ? Number((l - Xt) / p) : 0;
  }, Oe = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), ft = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, Xe = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, C = (l, p = "", g = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), g && (f.className = g), f;
  }, ce = (l, p, g = "") => {
    const f = C("button", l, g);
    return f.type = "button", f.onclick = p, f;
  }, tt = (l, p) => {
    const g = C("a", l);
    return g.href = p, g.target = "_blank", g.rel = "noopener", g;
  };
  let it = null, lt = location.hash === "#give";
  lt && history.replaceState(null, "", location.pathname + location.search);
  let yt = !1;
  const Ot = nI((l) => tI({ address: l, network: "mainnet" }), () => rt(c.snapshot())), Dt = (l) => Ot.get(l), _t = uL(navigator.userAgent), Yr = (l, p) => {
    const g = navigator.userAgent, f = fL(g), T = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, X = [C("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${P.on ? "player" : "listening wallet"}${p ? P.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], re = C("div", "", "ppp-open-row"), se = dL(T, g);
    if (se) {
      const Ee = C("a", `Open in ${f}`, "primary ppp-open-in");
      Ee.href = se, Ee.dataset.homeAction = "radio:open-in-browser", re.append(Ee);
    }
    return re.append(ir("copy-page-link", "Copy link", () => T, se ? "" : "primary", () => rt(c.snapshot()))), X.push(re, C("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), X;
  }, Re = (l) => Dt(l) ?? ee(l), Cn = (l) => l.slice(0, 2).map(Re).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), ti = /* @__PURE__ */ new Map();
  let ni = !1;
  const Zi = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), ds = () => {
    ni || (ni = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const g = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(g) && ti.set(g, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      rt(c.snapshot());
    }).catch(() => {
      ni = !1;
    }));
  }, Sn = (l, p) => {
    const g = ti.get(l), f = cg(l, [g == null ? void 0 : g.title, p == null ? void 0 : p.title].find((X) => !Zi(X)) || ""), T = og(l, (g == null ? void 0 : g.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: T };
  }, On = (l) => {
    const { title: p, artist: g } = Sn(l.song, l);
    return p ? `“${p}”${g ? ` — ${g}` : ""}` : `Song #${l.song}${g ? ` — ${g}` : ""}`;
  }, Ji = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, nt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Vt(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Tn(l, p, g = "", f) {
    const T = C("dt", l), X = C("dd", p, g);
    return f && X.append(" ", f), [T, X];
  }
  const Bn = document.getElementById("ppp-top"), Dn = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? e : i).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, hn = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, vn = () => {
    var p, g;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      hn();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((g = l.giftStop) == null ? void 0 : g.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      Gt();
      return;
    }
    Dn();
  };
  Bn && (Bn.onclick = vn);
  const sn = (l, p, g, f = "") => l.standIn && !l.mainConnected ? ce(`Connect ${Re(l.standIn)} to add STX`, hn, f) : ce(p, g, f), fs = (l) => {
    c.useLinked(l).then(() => Dn());
  };
  let ur = null;
  const Qi = () => {
    const l = Eg(c.snapshot(), Re);
    return l.length ? ur || (ur = new Promise((p) => {
      var B;
      const g = C("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const T = (D) => {
        f = D, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), ur = null, p(f);
      }), g.addEventListener("click", (D) => {
        D.target === g && T(null);
      });
      const X = (D, J, xe, De, Tt = !1) => {
        const wt = C("button", "", "ppp-connect__opt " + xe);
        return wt.type = "button", wt.disabled = Tt, wt.onclick = De, wt.append(C("b", D), C("span", J)), wt;
      }, re = C("h2", "Connect", "ppp-connect__title");
      re.id = "ppp-connect-title";
      const se = l.map((D) => X(D.label, D.detail, "is-music", () => {
        if (T("music"), D.action === "linked" && D.main) {
          fs(D.main);
          return;
        }
        const J = Eg(c.snapshot(), Re).find((xe) => xe.action !== "linked");
        (J == null ? void 0 : J.action) === "create" ? c.create() : (J == null ? void 0 : J.action) === "unlock" && c.unlock(), Dn();
      }, !!D.disabled)), Ee = X("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => T("stacks")), x = ce("Cancel", () => T(null), "quiet ppp-connect__cancel");
      g.append(re, ...se, Ee, x), document.body.appendChild(g), g.showModal(), (B = se.find((D) => !D.disabled)) == null || B.focus();
    }), ur) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Qi;
  function eo(l) {
    if (!Bn) return;
    const p = (f, T, X) => {
      Bn.hidden = !1, Bn.className = "ppp-top" + (T ? " is-" + T : ""), Bn.replaceChildren(C("span", "", "dot"), document.createTextNode(f)), Bn.title = X;
    }, g = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Bn.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Bn.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${Re(l.linked)}`, "warn", `This device's listening wallet belongs to ${Re(l.linked)}. Connect that wallet to pay artists or like songs.`);
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
  const Qt = document.getElementById("pppNudge"), ri = document.getElementById("onair");
  (te = Qt == null ? void 0 : Qt.querySelector("button")) == null || te.addEventListener("click", () => vn());
  const si = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Fn = {
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
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, T = l.step === "elsewhere" && !t, X = g || f || T ? "" : si[l.step] ?? "", re = g ? "on" : T ? "free" : X ? "off" : "";
    re ? document.documentElement.dataset.ppp = re : delete document.documentElement.dataset.ppp, ri && (ri.hidden = !re || re === "free", ri.querySelector(".onair-sub").textContent = g ? `${p.toLocaleString()} plays left` : "Plays off"), Qt && (Qt.hidden = re !== "off" && re !== "free", Qt.classList.toggle("is-free", re === "free"), re === "free" ? (Qt.querySelector(".nudge-t").textContent = "You’re on the free player", Qt.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Qt.querySelector("button").textContent = "Get a player") : re === "off" && (Qt.querySelector(".nudge-t").textContent = X, Qt.querySelector(".nudge-s").textContent = H(l) ? l.step === "intro" ? xL : "" : "This radio requires a funded listening wallet with music support on.", Qt.querySelector("button").textContent = Fn[l.step] ?? "Start"));
  }
  let hs = "";
  function ii(l) {
    const p = C("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append(C("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append(C("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = C("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = hs, g.oninput = () => {
      hs = g.value;
    };
    const f = ce(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(g.value), hs = "";
    }, "tiny");
    return p.append(g, " ", f), l.returnToKind === "chosen" && p.append(" ", ce("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const oi = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function ai() {
    const l = C("p", oi + " ", "ppp-mute");
    return l.append(tt("Xverse", "https://www.xverse.app/download"), " · ", tt("Leather", "https://leather.io/install-extension")), l;
  }
  let Jn = "";
  const ci = (l) => {
    const p = document.documentElement, g = l.solo && !l.main ? l.listening ? ee(l.listening) : "new" : "", f = E5() ? "1" : "", T = l.standIn && !l.mainConnected ? Re(l.standIn) : "";
    `${g}|${f}|${T}` !== Jn && (Jn = `${g}|${f}|${T}`, g ? p.dataset.pppSolo = g : delete p.dataset.pppSolo, T ? p.dataset.pppAs = T : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => rt(c.snapshot()), l);
  function li(l, p = "") {
    const g = C("div", "", "ppp-topup"), f = ps(l);
    g.append(C("span", "Add plays from My player: ", "ppp-mute"));
    for (const T of Uc) {
      const X = ce(`+${T.toLocaleString()}`, () => void c.topUpAlbum(T), p);
      X.disabled = f === void 0 || f < T || l.depositPending || !!l.busy, g.append(X);
    }
    return f !== void 0 && f < Uc[0] && g.append(C("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const ps = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const g = p - Xt - 6000n;
    return g > 0n ? Number(g / l.playCost) : 0;
  };
  function to(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (k = !1), p.low && !k) return [];
    const g = C("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const T = C("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && T.append(tt("View", Xe(p.txid))), g.append(T), [g];
    }
    g.append(C("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append(C("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append(C("p", p.address, "ppp-addr-full"));
    const f = C("div", "", "ppp-open-row");
    if (f.append(ir("copy-likes-address", "Copy address", () => p.address, "primary", () => rt(c.snapshot()))), p.main && !l.solo) {
      const T = ss - (p.balance ?? 0n);
      T > 0n && f.append(sn(l, `Pay ${br(T)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return g.append(f), g.append(C("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const Xr = (l) => {
    const p = C("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const g = C("p", "", "ppp-wait-t"), f = C("div", "", "ppp-wait-track");
    return f.append(C("div", "", "ppp-wait-fill")), p.append(g, f), ui(p), p;
  };
  function ui(l) {
    const p = Number(l.dataset.since), g = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), T = l.querySelector(".ppp-wait-fill"), X = l.querySelector(".ppp-wait-t");
    if (f < g) {
      const re = Math.ceil((g - f) / 1e3);
      T.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", X.textContent = `Your plays are arriving… usually about a minute · ${re}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      T.style.width = "", X.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let gs = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      gs = 0;
      return;
    }
    l.forEach(ui), ++gs % 10 === 0 && rt(c.snapshot());
  }, 1e3);
  let ys = null;
  function Wo(l) {
    if (l.step === "loading" && ys !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!S.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    g !== ys && (ys = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function rt(l) {
    var bh, xh, Sh, vh, Ah, Eh, kh, $h, Ih, Lh, Ch, Th, Bh, Mh, Nh, _h, Ph, Uh;
    if (le.sync(), Q && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Z = Q;
      Q = null, l.root === Z.root && l.slot !== Z.slot && c.openAlbum(Z.slot);
    }
    const p = S.inProgress(l), g = K(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : g !== null ? { ...l, depositPending: !0, arrival: { since: g, graceMs: dl } } : l, T = f.error === fl;
    if (et(), Se(l), He(l), Jt = rn(l), Vr(l, f), Wo(f), ci(f), !p && S.inProgress(l)) return;
    if (eo(f), qo(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? P.on ? SL : "Checking your listening wallet…" : P.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      Me(f, !1);
      return;
    }
    const [X, re] = Vt(f), se = s(".ppp-state");
    se.textContent = X, se.className = "ppp-state" + (re ? " ppp-state--" + re : ""), se.hidden = !X;
    const Ee = !!f.busy || f.armed, x = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Ee || !["intro", "loading"].includes(f.step));
    i.hidden = !x, i.classList.toggle("ppp-frame--rest", !Ee && !yt);
    const B = s(".ppp-frame-label");
    B.hidden = !0;
    const D = x5(f) ?? it;
    it = D;
    const J = "xtrata.radio.ppp.heard.v1", xe = (() => {
      try {
        return localStorage.getItem(J) === "1";
      } catch {
        return !1;
      }
    })();
    if (!xe && f.entries.some((Z) => Z.kind === "play"))
      try {
        localStorage.setItem(J, "1");
      } catch {
      }
    const De = xe || f.slot > 0 && ((((bh = f.likeFunds) == null ? void 0 : bh.balance) ?? 0n) > 0n || v.count() > 1), Tt = H(f), wt = !Tt && v5({ ...f, heard: De }, D);
    s(".ppp-badge").hidden = !wt;
    const hr = s(".ppp-steps"), pn = s(".ppp-stage");
    hr.hidden = pn.hidden = !wt, D && wt && (hr.replaceChildren(...Gd(f.solo).map((Z, pe) => {
      const Pe = C("li", "", pe < D.at ? "done" : pe === D.at ? D.blocked ? "now blocked" : "now" : "");
      return Pe.append(C("span", pe < D.at ? "✓" : String(pe + 1), "n"), Z), pe === D.at && Pe.setAttribute("aria-current", "step"), Pe;
    })), pn.textContent = D.caption, pn.className = "ppp-stage " + (D.at >= Gd(f.solo).length ? "ppp-ok" : D.blocked ? "ppp-bad" : "ppp-cyan"));
    const Cr = s(".ppp-facts"), Nn = [];
    f.main && ((xh = f.gate) != null && xh.here) && !f.solo && Nn.push(...Tn("Your wallet", Re(f.main), "ppp-addr-short"));
    const Zo = () => {
      if (!f.listening) return;
      const Z = ir("copy-listening", "Copy", () => f.listening || "", "tiny", () => rt(c.snapshot()));
      Nn.push(...Tn(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", ee(f.listening), "ppp-addr-short", Z));
    };
    if (f.linked || Zo(), f.listening && f.step !== "intro")
      if (f.linked)
        Nn.push(...Tn("Credited to", `${Re(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Zo();
      else if (f.solo) {
        f.creditedTo && Nn.push(...Tn("Credited to", `${Re(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${Re(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Nn.push(...Tn("Returns go to", f.gift ? Z : f.returnTo && !Dt(f.returnTo) ? Z.replace(ee(f.returnTo), f.returnTo) : Z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Nn.push(...Tn("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Sh = f.gate) != null && Sh.here)) {
      const Z = f.linkedListening.map((pe) => ee(pe) + (pe === f.listening ? " (this one)" : "")).join(", ");
      Nn.push(...Tn(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Nn.push(...Tn("Balance", `${br(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Z));
    }
    const Zr = f.entries.find((Z) => Z.kind === "play");
    Zr && ds(), Zr && Nn.push(...Tn("Last paid song", `${On(Zr)} → ${Re(Zr.recipient)}`, Ji[Zr.status] || "")), Cr.replaceChildren(...Nn), Cr.hidden = !Nn.length;
    const Ie = [], mt = [], $t = [], jn = [], fh = bn(BigInt(((vh = f.gate) == null ? void 0 : vh.limits.playFee) ?? "300")), hh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${br(ll)} STX to the song holder, plus a ${br(fh - ll)} STX network fee.`, ph = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (Ie.push(C("p", "Pay artists as you listen.")), (Ah = f.gate) != null && Ah.radioUrl) {
          const pe = C("p");
          pe.append(tt("Open the pay-per-play radio →", f.gate.radioUrl)), Ie.push(pe);
        }
        mt.push(C("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const pe = [f.linked, ...f.others];
          Ie.push(C("p", pe.length > 1 ? `This device has listening wallets for ${Cn(pe)}.` : `This device has a listening wallet for ${Re(f.linked)}.`)), mt.push(C("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), pe.slice(0, 3).forEach((Pe, ut) => $t.push(ce(`Open ${Re(Pe)}`, () => fs(Pe), ut === 0 ? "primary" : "")));
        } else
          Ie.push(C("p", "Connect your wallet to pay artists as you listen.")), mt.push(C("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        Ie.push(C("p", `This device's listening wallet belongs to ${Re(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), mt.push(C("p", `You are connected as ${Re(f.main)}. Switch to the linked wallet to continue listening.`)), mt.push(C("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), $t.push(ce("Switch wallet", hn, "primary"));
        break;
      case "not-invited":
        Ie.push(C("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        Ie.push(C("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Ie.push(C("p", "Every play counts for the song’s owner, on-chain.")), mt.push(C("p", hh)), mt.push(C("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), mt.push(C("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (Ie.push(C("p", `This device already has a listening wallet for ${Cn(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), mt.push(C("p", `Otherwise, set up a new listening wallet for ${Re(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && mt.push(C("p", `This is the listening wallet for ${Re(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && mt.push(C("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Z = S.liveGift();
        $t.push(ce(Z ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${Re(f.main)}` : "Start listening", () => void c.create(w.claiming() ? { another: !0 } : void 0), "primary")), !Z && !f.solo && f.main && f.others.length && $t.push(ce("Switch wallet", hn)), !Z && f.solo && $t.push(ce("I have a Stacks wallet", hn)), $t.push(ce("I already have a listening wallet", () => void c.unlock(!0))), Z && $t.push(ce("Not now", () => S.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (Ie.push(C("p", "Locked.", "ppp-mute")), $t.push(ce("Unlock", () => void c.unlock(), "primary"))), f.standIn ? jn.push(ce("Use a different listening wallet", () => void Qi().then((pe) => {
          pe === "stacks" && hn();
        }), "quiet")) : jn.push(ce("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        Ie.push(C("p", `Link to ${Re(f.main)} · free`)), mt.push(C("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), mt.push(C("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), $t.push(ce(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        Ie.push(C("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && Ie.push(Xr(f.arrival)) : Y(f) ? Ie.push(C("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Eh = f.gift) != null && Eh.player ? Ie.push(C("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? Ie.push(C("p", "No plays left · add plays to keep counting", "ppp-bad")) : Ie.push(C("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / fh)).toLocaleString()} plays`)), f.entries.length && mt.push(C("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && mt.push(C("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? mt.push(C("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? mt.push(C("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (mt.push(C("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), mt.push(C("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && $t.push(ir("copy-address", "Copy my address", () => f.listening || "", "primary", () => rt(c.snapshot())))) : mt.push(C("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const pe = C("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          pe.append(tt("View", Xe(f.depositTxid))), Ie.push(pe);
        } else f.allowance > 0n && !f.solo && !f.depositPending && $t.push(sn(f, `Deposit ${br(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        Ie.push(C("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (Ie.push(C("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), $t.push(ce("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (Ie.push(C("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Ie.push(ii(f))), (!f.solo || f.returnTo) && $t.push(ce("Return excess", () => void c.returnFunds("excess"), "primary"), ce("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((kh = f.giftStop) == null ? void 0 : kh.reason) !== "off") {
          const pe = Math.min(f.session.playsLeft, f.playsLeft);
          Ie.push(C("p", `${pe.toLocaleString()} plays left`, "ppp-ok")), mt.push(C("p", hh + " The heart likes or unlikes from this wallet for 0.0002 STX.")), $t.push(ce("Switch off", () => void c.switchOff()));
        } else
          Ie.push(C("p", "Switch on music support to listen.", "ppp-mute")), $t.push(ce("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && Ie.push(C("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && Ie.push(C("p", "Running low on plays", "ppp-warn")), f.aboveTarget && Ie.push(C("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? Ie.push(C("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && $t.push(sn(f, `Top up ${br(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const Z = f.step === "fund", pe = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      Z ? $t.unshift(ce("Add plays", () => Gt(), "primary")) : pe ? $t.push(ce("Add plays", () => Gt(), "primary")) : f.step === "ready" && jn.push(ce("Add plays", () => Gt(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && mt.push(C("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && mt.push(ii(f)), mt.push(ai()), f.slot === 0 && f.step === "ready" && f.entries.some((Z) => Z.kind === "play" && Z.status === "confirmed"))) {
      const Z = C("p", "New to Stacks? ", "ppp-mute");
      Z.append(tt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Ie.push(Z);
    }
    if (f.walletOutdated && mt.push(C("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (Ie.push(C("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), $t.push(ce("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && jn.push(ce(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${Re(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && (($h = f.gift) != null && $h.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && jn.push(li(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && jn.push(ce(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && jn.push(ce("Lock", () => void c.lock(), "quiet")), x && !Ee && jn.push(ce(yt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      yt = !yt, rt(c.snapshot());
    }, "quiet")), [...$t, ...jn].forEach((Z) => Z.disabled = ph), ph && ($t.length = 0), !Tt && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Ih = f.gift) != null && Ih.player)) {
      const Z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", pe = Ie.at(0);
      f.step === "ready" && pe ? pe.append(C("span", ` · ${Oe(f.balance)} STX`, Z)) : Ie.push(C("p", `Balance ${Oe(f.balance)} STX`, Z));
    }
    if (Tt) {
      for (const Pe of [...$t, ...jn]) {
        const ut = yL[Pe.textContent ?? ""];
        ut && (Pe.textContent = ut);
      }
      for (let Pe = Ie.length - 1; Pe >= 0; Pe--) $g(Ie[Pe].textContent) && mt.unshift(...Ie.splice(Pe, 1));
      for (let Pe = $t.length - 1; Pe >= 0; Pe--) $g($t[Pe].textContent) && jn.unshift(...$t.splice(Pe, 1));
      const Z = f.entries.some((Pe) => Pe.kind === "play"), pe = bL(f.step, { played: Z, arriving: f.depositPending });
      pe.length && Ie.length && pe.shift(), Ie.push(...pe.map((Pe) => C("p", Pe, "ppp-mute")));
    }
    if ((Lh = f.gift) != null && Lh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Z = C("p", "", "ppp-gift");
      Z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Z.append(" · ", f.gift.player.subtitle);
      const pe = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? C("span", " · plays on their way", "ppp-warn") : C("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      pe && Z.append(pe);
      const Pe = (Ch = Ie.at(0)) == null ? void 0 : Ch.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Pe && /STX/.test(Pe.textContent ?? "") && Pe.remove(), Ie.unshift(Z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          Ie.splice(1, 0, C("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), li(f, "primary"));
        else {
          const ut = C("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ut.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ut.append(tt("Xverse", "https://www.xverse.app/download"), " and ", tt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Ie.splice(1, 0, ut);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Z = f.returnPlan, pe = C("div", "", "ppp-pick");
      pe.append(C("p", Z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Pe = C("ul", "", "ppp-gift-list");
      Z.steps.forEach((ut, pr) => {
        const Rn = ut.kind === "gift" ? "the unused gift" : ut.kind === "deposit" ? "what was added to it" : "the rest", on = C("li");
        on.append(C("span", `${pr + 1}. ${br(BigInt(ut.send))} STX · ${Rn}`, "t"), C("span", ut.to ? ` → ${Re(ut.to)}` : " → choose an address below", ut.to ? "ppp-mute" : "ppp-warn")), Pe.append(on);
      }), pe.append(Pe), Z.kept && pe.append(C("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Z.steps.some((ut) => !ut.to) && pe.append(ii(f)), pe.append(ce(Z.steps.length > 1 ? `Confirm part 1 of ${Z.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), Ie.push(pe);
    }
    const bs = qr(f), Jr = A ? bs : null, so = Ct(f, !!Jr), wb = so === "gift" || so === "arriving" || so === "new", Vl = Jr ? null : w.lines(l), Yl = Vl && !w.claiming() ? Vl : [...Vl ?? [], ...S.banner(l, { bare: !!Jr || so === "gift" || so === "arriving" })], Fa = _t && (S.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Yr(_t, S.pendingCode()) : [];
    Jr || (Ie.unshift(...Yl), Ie.push(...to(f)), Ie.unshift(...Fa)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && Ie.unshift(C("p", `This is ${Re(f.creditedTo)}'s listening wallet. Plays and likes count for ${Re(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...Ie);
    const Xl = document.querySelector(".ppp-switch");
    if (Xl) {
      const Z = v.latest(), pe = f.slot > 0, Pe = ["fund", "ready", "over"].includes(f.step) && (pe || !!Z);
      if (Xl.hidden = !Pe, Pe) {
        const ut = (on, za, Ga, eu) => {
          const oo = ce("", eu, "ppp-tab");
          return oo.setAttribute("aria-pressed", String(Ga)), oo.append(C("span", on, "tt"), C("span", za === void 0 ? "…" : `${we(za).toLocaleString()} plays`, "ts")), oo.disabled = !!f.busy, oo;
        }, pr = pe ? ((Bh = (Th = f.gift) == null ? void 0 : Th.player) == null ? void 0 : Bh.title) ?? "Album" : Z.title, Rn = ce("View all albums" + (v.count() > 1 ? ` (${v.count()})` : ""), () => {
          const on = document.querySelector(".ppp-shelf");
          on && (on.hidden = !1, on.open = !on.open, Rn.setAttribute("aria-expanded", String(on.open)), on.open && requestAnimationFrame(() => on.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Rn.setAttribute("aria-expanded", String(!!((Mh = document.querySelector(".ppp-shelf")) != null && Mh.open))), Xl.replaceChildren(
          ut("🎧 My player", pe ? (Nh = f.likeFunds) == null ? void 0 : Nh.balance : f.balance, !pe, () => {
            pe && c.openAlbum(0);
          }),
          ut("💿 " + pr, pe ? f.balance : void 0, pe, () => {
            !pe && Z && c.openAlbum(Z.slot);
          }),
          Rn
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
    if (s(".ppp-gifts").hidden = !Jo, Jo && !s(".ppp-gift-body").contains(Jo) && s(".ppp-gift-body").replaceChildren(Jo), Jo && lt) {
      lt = !1;
      const Z = s(".ppp-gifts");
      Z.open = !0, requestAnimationFrame(() => Z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const ql = document.querySelector("#ppp .ppp-featured");
    if (ql) {
      const Z = ne(), pe = le.manage(), Pe = (Z.length > 0 || !!pe) && f.slot === 0 && !((_h = f.gift) != null && _h.player) && f.step === "ready";
      ql.hidden = !Pe, Pe && ql.replaceChildren(...Z.length ? [C("p", "Albums in your player", "ppp-featured__h")] : [], ...Z.map((ut) => {
        const pr = (Le == null ? void 0 : Le.id) === ut.id, Rn = ce("", () => Je(pr ? null : ut, !pr), "ppp-featured__a" + (pr ? " is-on" : "")), on = Er(ut).length;
        return Rn.append(C("b", ut.title), C("span", pr ? "Playing now · tap to go back to the radio" : `${ut.subtitle ? ut.subtitle + " · " : ""}${on} ${on === 1 ? "song" : "songs"}`)), Rn.setAttribute("aria-pressed", String(pr)), Rn.disabled = !!f.busy, Rn;
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
        const pe = document.activeElement instanceof HTMLElement && io.contains(document.activeElement) ? document.activeElement : null, Pe = ((Ph = io.querySelector(".ppp-release-songs")) == null ? void 0 : Ph.scrollTop) ?? 0;
        (Uh = io.querySelector(".ppp-release-body")) == null || Uh.replaceChildren(...Z);
        const ut = io.querySelector(".ppp-release-songs");
        ut && Pe && (ut.scrollTop = Pe), pe && pe.isConnected && document.activeElement !== pe && pe.focus({ preventScroll: !0 });
      }
    }
    ws(f);
    const Zl = document.querySelector("#ppp .ppp-yours");
    if (Zl) {
      const Z = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      Zl.hidden = !Z;
      const pe = Zl.querySelector(".ppp-yours-body");
      if (Z && pe && pe.getAttribute("data-for") !== f.listening) {
        pe.setAttribute("data-for", f.listening);
        const Pe = (eu, ...oo) => {
          const Hh = C("details", "", "ppp-yours-item");
          return Hh.append(C("summary", eu), ...oo), Hh;
        }, ut = C("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        ut.append(C("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const pr = C("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), Rn = C("p");
        Rn.append(tt("Find a name at BNS One →", "https://bns.one"));
        const on = C("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), za = C("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Ga = C("p");
        Ga.append(tt("See the giveaway →", "https://xtrata.xyz/giveaway")), pe.replaceChildren(
          Pe("Give your player a name", ut, pr, C("p", f.listening, "ppp-addr-full"), ir("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => rt(c.snapshot())), Rn),
          Pe("Link it to a wallet you already have", on),
          Pe("Bring a friend in", za, Ga)
        );
      }
    }
    s(".ppp-body").replaceChildren(...mt), s(".ppp-actions").replaceChildren(...$t), s(".ppp-actions2").replaceChildren(...jn);
    const Jl = f.busy || f.message || "", gh = s(".ppp-msg"), Ql = Jl && Ie.some((Z) => (Z.textContent ?? "").startsWith(Jl.replace(/[.✓\s]+$/, ""))) ? "" : Jl, yh = !Ql && !f.error ? f.notice : T && !Ql ? f.error : "";
    gh.textContent = Ql || yh, gh.classList.toggle("is-warn", !!yh), s(".ppp-err").textContent = T ? "" : f.error;
    const mb = f.entries.filter((Z) => Z.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...mb.slice(0, 5).map((Z) => {
      const pe = C("li"), Pe = Z.status === "confirmed" ? "ok" : Z.status === "failed" ? "bad" : "warn";
      return pe.append(C("span", "", "d " + Pe), C("span", On(Z), "t"), C("span", ft(Z.created), "ppp-mute")), Z.txid && pe.append(tt("tx", Xe(Z.txid))), pe;
    })), s(".ppp-wallets").hidden = !(Cr.childElementCount || jn.length), s(".ppp-more").hidden = !mt.length;
    const wh = s(".ppp-history");
    wh.hidden = !f.entries.length, f.entries.length && ds(), wh.replaceChildren(C("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Z) => {
      const pe = C("div", "", "ppp-row"), Pe = Z.kind === "play" ? [C("span", On(Z), "ppp-song"), C("span", ` · ${br(BigInt(Z.amount))} STX to ${Re(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [C("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${On(Z)}`, "ppp-song"), C("span", ` · for ${f.linked ? Re(f.linked) : "this listening wallet"}`, "ppp-mute")] : [C("span", `Returned ${br(BigInt(Z.amount))} STX`, "ppp-song"), C("span", ` to ${Re(Z.recipient)}`, "ppp-mute")];
      return pe.append(
        C("span", nt[Z.status] || Z.status, "ppp-status " + (Ji[Z.status] || "")),
        ...Pe,
        C("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && pe.append(tt("tx ↗", Xe(Z.txid))), pe;
    })), V == null || V.render(Jr ? fr(f, Jr, [...Fa, ...Yl]) : null), Me(f, !!Jr, wb ? [...Fa, ...Yl] : Fa, so), dr(f, !!Jr || !!($ != null && $.showing())), di(f, Jr), Zt.isOpen() && Zt.refresh(), ro();
    const mh = (bs == null ? void 0 : bs.mode) === "open" ? null : je(f);
    Lt == null || Lt.render((bs == null ? void 0 : bs.mode) === "open" ? fr(f, bs, []) : mh ? { ...fr(f, { mode: "open", player: mh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function qr(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && ae({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = S.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const g = z();
    return g && (l.step === "locked" || Q && l.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const kt = (l, p, g, f, T) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: g, ...T ? { b: T } : {}, p: String(f), s: Lg(Z0, p, g) })}`;
  function no(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? N ? "making" : null : p.state === "claimed" ? N && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || _ || l.step === "link" && I !== "have" ? null : I === "making" || I === "yours" ? "ready" : I;
  }
  function dr(l, p) {
    if (!q) return;
    const g = l.award, f = g != null && g.cls && $c(g.cls) ? Ic(g.cls) : null, T = l.slot === 0 ? l.listening : l.root, X = p || !g || !f || !T || g.number === void 0 ? null : no(l);
    if (!X || !g || !f || !T) {
      q.render(null, p);
      return;
    }
    X === "have" && l.linked && !W && (W = !0, c.awardRefresh());
    const re = typeof g.name == "string" && g.name ? g.name : null, se = [];
    l.error && se.push(C("p", l.error, "ppp-warn"));
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
      art: X === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : kt(f, g.number, T, g.need ?? 0, re),
      claimLink: g.claimTx ? Xe(g.claimTx) : void 0,
      status: se,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? Re(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => ir("award-player-address", "Copy my player’s address", () => T, "tiny", () => rt(c.snapshot())),
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
  function ws(l) {
    var D;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const g = l.award, f = l.slot === 0 ? l.listening : l.root, T = g != null && g.cls && $c(g.cls) ? Ic(g.cls) : null, X = !!g && !!T && !!f && ["ready", "fund", "over"].includes(l.step) && !(g.state === "unavailable" && g.number === void 0);
    if (p.hidden = !X, !X || !g || !T || !f) {
      p.replaceChildren();
      return;
    }
    const re = JSON.stringify([g, f, !!l.busy]);
    if (p.getAttribute("data-sig") === re) return;
    p.setAttribute("data-sig", re);
    const se = (J) => {
      const xe = C("p", "", "ppp-award__h");
      return xe.append(C("b", `${T.mark} Music Hero award`), C("span", J)), xe;
    }, Ee = `No. ${String(g.number ?? 0).padStart(4, "0")}`, x = (J) => {
      const xe = C("div", "", "ppp-award__art"), De = document.createElement("iframe");
      return De.src = J, De.title = `${T.name} record`, De.setAttribute("sandbox", "allow-scripts"), De.setAttribute("loading", "lazy"), xe.append(De), xe;
    }, B = [];
    if (g.state === "claimed") {
      if (B.push(se(`${T.name} record · ${Ee}`)), g.inscription !== void 0 && B.push(x(`/i/${g.inscription}`)), B.push(C("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${T.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const J = C("p");
        J.append(tt("Open it full screen ↗", `/i/${g.inscription}`)), B.push(J);
      }
      if (g.sendTx) {
        const J = C("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        J.append(tt("View", Xe(g.sendTx))), B.push(J);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const J = C("details", "", "ppp-award__send"), xe = document.createElement("input");
        xe.type = "text", xe.placeholder = "SP… address to send it to", xe.autocomplete = "off", xe.spellcheck = !1, xe.setAttribute("aria-label", "Address to send your record to");
        const De = ce("Send my record…", () => void c.sendAward(xe.value), "");
        De.disabled = !!l.busy, J.append(
          C("summary", "Send this record to someone"),
          C("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          xe,
          De
        ), B.push(J);
      }
    } else if (g.claimTx) {
      B.push(se(`${T.name} record · ${Ee}`));
      const J = C("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      J.append(tt("View", Xe(g.claimTx))), B.push(J);
    } else if (g.state === "ready") {
      B.push(se(`${T.name} record · ${Ee}`));
      const J = typeof g.name == "string" && g.name ? g.name : null, xe = new URLSearchParams({ n: String(g.number), a: f, ...J ? { b: J } : {}, p: String(g.need), s: Lg(Z0, g.number, f) });
      B.push(x(`/awards/${T.id}#${xe}`)), B.push(C("p", `Your ${T.name} record is ready. You have paid artists for ${(D = g.need) == null ? void 0 : D.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const De = C("div", "", "ppp-award__row");
      J ? (B.push(C("p", `Its plaque will carry ${J} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), De.append(ce("Claim my record", () => {
        N = !0, c.claimAward("auto");
      }, "primary"), ce("Use my address only", () => {
        N = !0, c.claimAward("none");
      }, "quiet"))) : g.name === null ? (B.push(C("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), De.append(ce("Claim my record", () => {
        N = !0, c.claimAward("none");
      }, "primary"), ce("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (B.push(C("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), De.append(ce("Check for a name again", () => void c.awardRefresh(), "primary"), ce("Claim with my address only", () => void c.claimAward("none"), "quiet"))), De.querySelectorAll("button").forEach((Tt) => {
        Tt.disabled = !!l.busy;
      }), B.push(De, C("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      B.push(se(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const J = C("div", "", "ppp-award__bar"), xe = document.createElement("i");
      xe.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, J.append(xe);
      const De = g.need - g.have;
      B.push(J, C("p", `${De.toLocaleString()} more ${De === 1 ? "play" : "plays"} and your ${T.name} record is yours to claim.`, "ppp-mute"));
    } else
      B.push(se(`${T.name} record · ${Ee}`)), B.push(C("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...B);
  }
  function di(l, p) {
    var se;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!p && (q != null && q.showing()) && ((se = l.award) != null && se.cls) && $c(l.award.cls) && (l.busy || l.armed)) {
      const Ee = Ic(l.award.cls), x = C("span", "", "ppp-skin__t");
      x.append(C("b", `${Ee.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), C("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren(C("span", Ee.mark, "ppp-skin__art ppp-skin__art--none"), x);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (g.hidden = !f, !f || !p) {
      g.replaceChildren();
      return;
    }
    const T = Hc(p.player.cover), X = T ? C("img", "", "ppp-skin__art") : C("span", "♪", "ppp-skin__art ppp-skin__art--none");
    T && (X.src = T, X.alt = "");
    const re = C("span", "", "ppp-skin__t");
    re.append(C("b", p.player.title), C("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), g.replaceChildren(X, re);
  }
  function fr(l, p, g) {
    var Ee, x, B, D, J;
    const f = !!l.busy || l.armed, T = [...g];
    l.depositPending && l.arrival && T.push(Xr(l.arrival)), l.error ? T.push(C("p", l.error, l.error === fl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? T.push(C("p", l.message, "ppp-cyan")) : l.notice && T.push(C("p", l.notice, "ppp-warn")), p.mode === "open" && k && ((Ee = l.likeFunds) != null && Ee.album) && l.likeFunds.low && !l.likeFunds.pending && T.push(C("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let X = "Kept on this device with Face ID or your passkey. No app or account needed.", re = null, se = null;
    if (p.mode === "locked")
      re = { label: "Continue listening", run: () => {
        Q = z(), c.unlock();
      } }, se = { label: "Use a different passkey", run: () => {
        Q = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && kc(Ae) && Ae.album === p.player.id) {
        const xe = window.XtrataRadio, De = Er(p.player)[0], Tt = Ae.phase === "playing";
        re = { label: Tt && !!((B = (x = xe == null ? void 0 : xe.getState) == null ? void 0 : x.call(xe)) != null && B.playing) ? "Pause" : Tt ? "Carry on" : "Play the first song", run: () => {
          var hr, pn;
          Tt ? (hr = xe == null ? void 0 : xe.playPause) == null || hr.call(xe) : De && ((pn = xe == null ? void 0 : xe.playToken) == null || pn.call(xe, De.id));
        } }, se = { label: "Make my player and hear it all", run: () => void c.create() }, X = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const xe = Ae.phase === "done" && Ae.album === p.player.id;
        xe && !T.length && T.push(C("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), re = { label: xe ? "Keep listening" : "Open album", run: () => void c.create() }, se = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (re = { label: "Open album", run: () => void c.unlock() }, se = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? T.push(C("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : T.length || T.push(C("p", "Opening your album…", "ppp-cyan"));
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
      primary: re,
      secondary: se,
      hint: re ? X : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: ps(l),
      topUps: Uc,
      canMake: !!((J = (D = l.gate) == null ? void 0 : D.gifts) != null && J.admin)
    };
  }
  const Qn = document.getElementById("findBox"), ms = document.getElementById("findBody"), Wr = Qn && ms ? UL(ms, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => NL(l == null ? void 0 : l.tracks, (p, g) => ({ title: cg(p, Zi(g.title) ? "" : g.title), artist: og(p, g.artist || "") }))),
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
    liked: (l) => Mn().has(l)
  }) : null;
  Qn == null || Qn.addEventListener("toggle", () => {
    Qn.open && (Wr == null || Wr.load());
  });
  let fi = "";
  const Mn = () => {
    var p, g, f;
    const l = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((T) => Number(T == null ? void 0 : T.tokenId)).filter(Number.isSafeInteger) : []);
  }, ro = () => {
    var p, g, f, T, X;
    if (!Wr || !(Qn != null && Qn.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((X = (T = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : T.nowPlaying) == null ? void 0 : X.tokenId) ?? ""}|${[...Mn()].sort((re, se) => re - se).join(",")}`;
    l !== fi && (fi = l, Wr.refresh());
  }, b = /* @__PURE__ */ new Map();
  let E = !1;
  const G = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const g = p == null ? void 0 : p.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && b.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), ro(), kc(Ae)) {
        const f = !!(p != null && p.playing);
        Kt({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== E && (E = f, rt(c.snapshot()));
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
    if (kc(Ae) && Kt({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      ds();
      const g = Sn(p.song, b.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const FL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", jL = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), i = /CriOS/.exec(t.userAgent), o = t.userAgent.includes("Mobile");
  return i ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, RL = () => jL() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, zL = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, GL = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', yb = class {
  constructor(e) {
    f4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && Mv(e), this.callback(Tl(e));
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
    const e = RL(), t = zL(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Fe("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Fe("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Fe("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Fe("div", { class: "flex flex-col space-y-[10px]" }, Fe("div", { class: "flex items-center" }, Fe("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Fe("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Fe("span", { class: "sr-only" }, "Close popup"), Fe("img", { src: FL }))), r ? Fe("p", null, "Select the wallet you want to connect to.") : Fe("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Fe("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Fe("div", { class: "mt-6" }, Fe("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Fe("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Fe("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Fe("div", { class: "aspect-square basis-9 overflow-hidden" }, Fe("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Fe("div", { class: "flex-1" }, Fe("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Fe("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Fe("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Fe("div", { class: "mt-6" }, r ? Fe("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Fe("div", { class: "mb-5 flex justify-between" }, Fe("p", { class: "text-sm font-medium" }, "Recommended wallets"), Fe("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Fe("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Fe("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Fe("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Fe("p", null, "What is a wallet? ", Fe("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Fe("ul", { class: "space-y-3" }, n.map((i) => Fe("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Fe("div", { class: "aspect-square basis-9 overflow-hidden" }, Fe("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Fe("div", { class: "flex-1" }, Fe("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Fe("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, e, t) && Fe("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, e, t), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Y3(this);
  }
};
yb.style = GL;
const KL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: yb
}, Symbol.toStringTag, { value: "Module" }));
