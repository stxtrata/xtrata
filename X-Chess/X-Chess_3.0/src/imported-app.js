"use strict";
(() => {
  var ET = Object.create;
  var Jm = Object.defineProperty;
  var AT = Object.getOwnPropertyDescriptor;
  var TT = Object.getOwnPropertyNames;
  var kT = Object.getPrototypeOf, RT = Object.prototype.hasOwnProperty;
  var tt = (e, t) => () => {
    try {
      return t || e((t = { exports: {} }).exports, t), t.exports;
    } catch (a) {
      throw t = 0, a;
    }
  }, Qo = (e, t) => {
    for (var a in t) Jm(e, a, { get: t[a], enumerable: true });
  }, MT = (e, t, a, o) => {
    if (t && typeof t == "object" || typeof t == "function") for (let r of TT(t)) !RT.call(e, r) && r !== a && Jm(e, r, { get: () => t[r], enumerable: !(o = AT(t, r)) || o.enumerable });
    return e;
  };
  var _ = (e, t, a) => (a = e != null ? ET(kT(e)) : {}, MT(t || !e || !e.__esModule ? Jm(a, "default", { value: e, enumerable: true }) : a, e));
  var Dy = tt((ye) => {
    "use strict";
    var ah = Symbol.for("react.transitional.element"), DT = Symbol.for("react.portal"), OT = Symbol.for("react.fragment"), BT = Symbol.for("react.strict_mode"), _T = Symbol.for("react.profiler"), PT = Symbol.for("react.consumer"), NT = Symbol.for("react.context"), UT = Symbol.for("react.forward_ref"), HT = Symbol.for("react.suspense"), zT = Symbol.for("react.memo"), Ey = Symbol.for("react.lazy"), qT = Symbol.for("react.activity"), Cy = Symbol.iterator;
    function FT(e) {
      return e === null || typeof e != "object" ? null : (e = Cy && e[Cy] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var Ay = { isMounted: function() {
      return false;
    }, enqueueForceUpdate: function() {
    }, enqueueReplaceState: function() {
    }, enqueueSetState: function() {
    } }, Ty = Object.assign, ky = {};
    function Ys(e, t, a) {
      this.props = e, this.context = t, this.refs = ky, this.updater = a || Ay;
    }
    Ys.prototype.isReactComponent = {};
    Ys.prototype.setState = function(e, t) {
      if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, e, t, "setState");
    };
    Ys.prototype.forceUpdate = function(e) {
      this.updater.enqueueForceUpdate(this, e, "forceUpdate");
    };
    function Ry() {
    }
    Ry.prototype = Ys.prototype;
    function oh(e, t, a) {
      this.props = e, this.context = t, this.refs = ky, this.updater = a || Ay;
    }
    var rh = oh.prototype = new Ry();
    rh.constructor = oh;
    Ty(rh, Ys.prototype);
    rh.isPureReactComponent = true;
    var vy = Array.isArray;
    function th() {
    }
    var ut = { H: null, A: null, T: null, S: null }, My = Object.prototype.hasOwnProperty;
    function nh(e, t, a) {
      var o = a.ref;
      return { $$typeof: ah, type: e, key: t, ref: o !== void 0 ? o : null, props: a };
    }
    function VT(e, t) {
      return nh(e.type, t, e.props);
    }
    function sh(e) {
      return typeof e == "object" && e !== null && e.$$typeof === ah;
    }
    function GT(e) {
      var t = { "=": "=0", ":": "=2" };
      return "$" + e.replace(/[=:]/g, function(a) {
        return t[a];
      });
    }
    var wy = /\/+/g;
    function eh(e, t) {
      return typeof e == "object" && e !== null && e.key != null ? GT("" + e.key) : t.toString(36);
    }
    function jT(e) {
      switch (e.status) {
        case "fulfilled":
          return e.value;
        case "rejected":
          throw e.reason;
        default:
          switch (typeof e.status == "string" ? e.then(th, th) : (e.status = "pending", e.then(function(t) {
            e.status === "pending" && (e.status = "fulfilled", e.value = t);
          }, function(t) {
            e.status === "pending" && (e.status = "rejected", e.reason = t);
          })), e.status) {
            case "fulfilled":
              return e.value;
            case "rejected":
              throw e.reason;
          }
      }
      throw e;
    }
    function Ks(e, t, a, o, r) {
      var n = typeof e;
      (n === "undefined" || n === "boolean") && (e = null);
      var s = false;
      if (e === null) s = true;
      else switch (n) {
        case "bigint":
        case "string":
        case "number":
          s = true;
          break;
        case "object":
          switch (e.$$typeof) {
            case ah:
            case DT:
              s = true;
              break;
            case Ey:
              return s = e._init, Ks(s(e._payload), t, a, o, r);
          }
      }
      if (s) return r = r(e), s = o === "" ? "." + eh(e, 0) : o, vy(r) ? (a = "", s != null && (a = s.replace(wy, "$&/") + "/"), Ks(r, t, a, "", function(u) {
        return u;
      })) : r != null && (sh(r) && (r = VT(r, a + (r.key == null || e && e.key === r.key ? "" : ("" + r.key).replace(wy, "$&/") + "/") + s)), t.push(r)), 1;
      s = 0;
      var l = o === "" ? "." : o + ":";
      if (vy(e)) for (var i = 0; i < e.length; i++) o = e[i], n = l + eh(o, i), s += Ks(o, t, a, n, r);
      else if (i = FT(e), typeof i == "function") for (e = i.call(e), i = 0; !(o = e.next()).done; ) o = o.value, n = l + eh(o, i++), s += Ks(o, t, a, n, r);
      else if (n === "object") {
        if (typeof e.then == "function") return Ks(jT(e), t, a, o, r);
        throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
      }
      return s;
    }
    function lf(e, t, a) {
      if (e == null) return e;
      var o = [], r = 0;
      return Ks(e, o, "", "", function(n) {
        return t.call(a, n, r++);
      }), o;
    }
    function XT(e) {
      if (e._status === -1) {
        var t = e._result;
        t = t(), t.then(function(a) {
          (e._status === 0 || e._status === -1) && (e._status = 1, e._result = a);
        }, function(a) {
          (e._status === 0 || e._status === -1) && (e._status = 2, e._result = a);
        }), e._status === -1 && (e._status = 0, e._result = t);
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    var Iy = typeof reportError == "function" ? reportError : function(e) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var t = new window.ErrorEvent("error", { bubbles: true, cancelable: true, message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e), error: e });
        if (!window.dispatchEvent(t)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    }, KT = { map: lf, forEach: function(e, t, a) {
      lf(e, function() {
        t.apply(this, arguments);
      }, a);
    }, count: function(e) {
      var t = 0;
      return lf(e, function() {
        t++;
      }), t;
    }, toArray: function(e) {
      return lf(e, function(t) {
        return t;
      }) || [];
    }, only: function(e) {
      if (!sh(e)) throw Error("React.Children.only expected to receive a single React element child.");
      return e;
    } };
    ye.Activity = qT;
    ye.Children = KT;
    ye.Component = Ys;
    ye.Fragment = OT;
    ye.Profiler = _T;
    ye.PureComponent = oh;
    ye.StrictMode = BT;
    ye.Suspense = HT;
    ye.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ut;
    ye.__COMPILER_RUNTIME = { __proto__: null, c: function(e) {
      return ut.H.useMemoCache(e);
    } };
    ye.cache = function(e) {
      return function() {
        return e.apply(null, arguments);
      };
    };
    ye.cacheSignal = function() {
      return null;
    };
    ye.cloneElement = function(e, t, a) {
      if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
      var o = Ty({}, e.props), r = e.key;
      if (t != null) for (n in t.key !== void 0 && (r = "" + t.key), t) !My.call(t, n) || n === "key" || n === "__self" || n === "__source" || n === "ref" && t.ref === void 0 || (o[n] = t[n]);
      var n = arguments.length - 2;
      if (n === 1) o.children = a;
      else if (1 < n) {
        for (var s = Array(n), l = 0; l < n; l++) s[l] = arguments[l + 2];
        o.children = s;
      }
      return nh(e.type, r, o);
    };
    ye.createContext = function(e) {
      return e = { $$typeof: NT, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null }, e.Provider = e, e.Consumer = { $$typeof: PT, _context: e }, e;
    };
    ye.createElement = function(e, t, a) {
      var o, r = {}, n = null;
      if (t != null) for (o in t.key !== void 0 && (n = "" + t.key), t) My.call(t, o) && o !== "key" && o !== "__self" && o !== "__source" && (r[o] = t[o]);
      var s = arguments.length - 2;
      if (s === 1) r.children = a;
      else if (1 < s) {
        for (var l = Array(s), i = 0; i < s; i++) l[i] = arguments[i + 2];
        r.children = l;
      }
      if (e && e.defaultProps) for (o in s = e.defaultProps, s) r[o] === void 0 && (r[o] = s[o]);
      return nh(e, n, r);
    };
    ye.createRef = function() {
      return { current: null };
    };
    ye.forwardRef = function(e) {
      return { $$typeof: UT, render: e };
    };
    ye.isValidElement = sh;
    ye.lazy = function(e) {
      return { $$typeof: Ey, _payload: { _status: -1, _result: e }, _init: XT };
    };
    ye.memo = function(e, t) {
      return { $$typeof: zT, type: e, compare: t === void 0 ? null : t };
    };
    ye.startTransition = function(e) {
      var t = ut.T, a = {};
      ut.T = a;
      try {
        var o = e(), r = ut.S;
        r !== null && r(a, o), typeof o == "object" && o !== null && typeof o.then == "function" && o.then(th, Iy);
      } catch (n) {
        Iy(n);
      } finally {
        t !== null && a.types !== null && (t.types = a.types), ut.T = t;
      }
    };
    ye.unstable_useCacheRefresh = function() {
      return ut.H.useCacheRefresh();
    };
    ye.use = function(e) {
      return ut.H.use(e);
    };
    ye.useActionState = function(e, t, a) {
      return ut.H.useActionState(e, t, a);
    };
    ye.useCallback = function(e, t) {
      return ut.H.useCallback(e, t);
    };
    ye.useContext = function(e) {
      return ut.H.useContext(e);
    };
    ye.useDebugValue = function() {
    };
    ye.useDeferredValue = function(e, t) {
      return ut.H.useDeferredValue(e, t);
    };
    ye.useEffect = function(e, t) {
      return ut.H.useEffect(e, t);
    };
    ye.useEffectEvent = function(e) {
      return ut.H.useEffectEvent(e);
    };
    ye.useId = function() {
      return ut.H.useId();
    };
    ye.useImperativeHandle = function(e, t, a) {
      return ut.H.useImperativeHandle(e, t, a);
    };
    ye.useInsertionEffect = function(e, t) {
      return ut.H.useInsertionEffect(e, t);
    };
    ye.useLayoutEffect = function(e, t) {
      return ut.H.useLayoutEffect(e, t);
    };
    ye.useMemo = function(e, t) {
      return ut.H.useMemo(e, t);
    };
    ye.useOptimistic = function(e, t) {
      return ut.H.useOptimistic(e, t);
    };
    ye.useReducer = function(e, t, a) {
      return ut.H.useReducer(e, t, a);
    };
    ye.useRef = function(e) {
      return ut.H.useRef(e);
    };
    ye.useState = function(e) {
      return ut.H.useState(e);
    };
    ye.useSyncExternalStore = function(e, t, a) {
      return ut.H.useSyncExternalStore(e, t, a);
    };
    ye.useTransition = function() {
      return ut.H.useTransition();
    };
    ye.version = "19.2.8";
  });
  var F = tt((v5, Oy) => {
    "use strict";
    Oy.exports = Dy();
  });
  var Vy = tt((xt) => {
    "use strict";
    function ch(e, t) {
      var a = e.length;
      e.push(t);
      e: for (; 0 < a; ) {
        var o = a - 1 >>> 1, r = e[o];
        if (0 < uf(r, t)) e[o] = t, e[a] = r, a = o;
        else break e;
      }
    }
    function Do(e) {
      return e.length === 0 ? null : e[0];
    }
    function ff(e) {
      if (e.length === 0) return null;
      var t = e[0], a = e.pop();
      if (a !== t) {
        e[0] = a;
        e: for (var o = 0, r = e.length, n = r >>> 1; o < n; ) {
          var s = 2 * (o + 1) - 1, l = e[s], i = s + 1, u = e[i];
          if (0 > uf(l, a)) i < r && 0 > uf(u, l) ? (e[o] = u, e[i] = a, o = i) : (e[o] = l, e[s] = a, o = s);
          else if (i < r && 0 > uf(u, a)) e[o] = u, e[i] = a, o = i;
          else break e;
        }
      }
      return t;
    }
    function uf(e, t) {
      var a = e.sortIndex - t.sortIndex;
      return a !== 0 ? a : e.id - t.id;
    }
    xt.unstable_now = void 0;
    typeof performance == "object" && typeof performance.now == "function" ? (By = performance, xt.unstable_now = function() {
      return By.now();
    }) : (lh = Date, _y = lh.now(), xt.unstable_now = function() {
      return lh.now() - _y;
    });
    var By, lh, _y, $o = [], Ur = [], YT = 1, ro = null, ia = 3, fh = false, Oi = false, Bi = false, dh = false, Uy = typeof setTimeout == "function" ? setTimeout : null, Hy = typeof clearTimeout == "function" ? clearTimeout : null, Py = typeof setImmediate < "u" ? setImmediate : null;
    function cf(e) {
      for (var t = Do(Ur); t !== null; ) {
        if (t.callback === null) ff(Ur);
        else if (t.startTime <= e) ff(Ur), t.sortIndex = t.expirationTime, ch($o, t);
        else break;
        t = Do(Ur);
      }
    }
    function ph(e) {
      if (Bi = false, cf(e), !Oi) if (Do($o) !== null) Oi = true, Ws || (Ws = true, Zs());
      else {
        var t = Do(Ur);
        t !== null && mh(ph, t.startTime - e);
      }
    }
    var Ws = false, _i = -1, zy = 5, qy = -1;
    function Fy() {
      return dh ? true : !(xt.unstable_now() - qy < zy);
    }
    function ih() {
      if (dh = false, Ws) {
        var e = xt.unstable_now();
        qy = e;
        var t = true;
        try {
          e: {
            Oi = false, Bi && (Bi = false, Hy(_i), _i = -1), fh = true;
            var a = ia;
            try {
              t: {
                for (cf(e), ro = Do($o); ro !== null && !(ro.expirationTime > e && Fy()); ) {
                  var o = ro.callback;
                  if (typeof o == "function") {
                    ro.callback = null, ia = ro.priorityLevel;
                    var r = o(ro.expirationTime <= e);
                    if (e = xt.unstable_now(), typeof r == "function") {
                      ro.callback = r, cf(e), t = true;
                      break t;
                    }
                    ro === Do($o) && ff($o), cf(e);
                  } else ff($o);
                  ro = Do($o);
                }
                if (ro !== null) t = true;
                else {
                  var n = Do(Ur);
                  n !== null && mh(ph, n.startTime - e), t = false;
                }
              }
              break e;
            } finally {
              ro = null, ia = a, fh = false;
            }
            t = void 0;
          }
        } finally {
          t ? Zs() : Ws = false;
        }
      }
    }
    var Zs;
    typeof Py == "function" ? Zs = function() {
      Py(ih);
    } : typeof MessageChannel < "u" ? (uh = new MessageChannel(), Ny = uh.port2, uh.port1.onmessage = ih, Zs = function() {
      Ny.postMessage(null);
    }) : Zs = function() {
      Uy(ih, 0);
    };
    var uh, Ny;
    function mh(e, t) {
      _i = Uy(function() {
        e(xt.unstable_now());
      }, t);
    }
    xt.unstable_IdlePriority = 5;
    xt.unstable_ImmediatePriority = 1;
    xt.unstable_LowPriority = 4;
    xt.unstable_NormalPriority = 3;
    xt.unstable_Profiling = null;
    xt.unstable_UserBlockingPriority = 2;
    xt.unstable_cancelCallback = function(e) {
      e.callback = null;
    };
    xt.unstable_forceFrameRate = function(e) {
      0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : zy = 0 < e ? Math.floor(1e3 / e) : 5;
    };
    xt.unstable_getCurrentPriorityLevel = function() {
      return ia;
    };
    xt.unstable_next = function(e) {
      switch (ia) {
        case 1:
        case 2:
        case 3:
          var t = 3;
          break;
        default:
          t = ia;
      }
      var a = ia;
      ia = t;
      try {
        return e();
      } finally {
        ia = a;
      }
    };
    xt.unstable_requestPaint = function() {
      dh = true;
    };
    xt.unstable_runWithPriority = function(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          e = 3;
      }
      var a = ia;
      ia = e;
      try {
        return t();
      } finally {
        ia = a;
      }
    };
    xt.unstable_scheduleCallback = function(e, t, a) {
      var o = xt.unstable_now();
      switch (typeof a == "object" && a !== null ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, e) {
        case 1:
          var r = -1;
          break;
        case 2:
          r = 250;
          break;
        case 5:
          r = 1073741823;
          break;
        case 4:
          r = 1e4;
          break;
        default:
          r = 5e3;
      }
      return r = a + r, e = { id: YT++, callback: t, priorityLevel: e, startTime: a, expirationTime: r, sortIndex: -1 }, a > o ? (e.sortIndex = a, ch(Ur, e), Do($o) === null && e === Do(Ur) && (Bi ? (Hy(_i), _i = -1) : Bi = true, mh(ph, a - o))) : (e.sortIndex = r, ch($o, e), Oi || fh || (Oi = true, Ws || (Ws = true, Zs()))), e;
    };
    xt.unstable_shouldYield = Fy;
    xt.unstable_wrapCallback = function(e) {
      var t = ia;
      return function() {
        var a = ia;
        ia = t;
        try {
          return e.apply(this, arguments);
        } finally {
          ia = a;
        }
      };
    };
  });
  var jy = tt((I5, Gy) => {
    "use strict";
    Gy.exports = Vy();
  });
  var Ky = tt((La) => {
    "use strict";
    var ZT = F();
    function Xy(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var a = 2; a < arguments.length; a++) t += "&args[]=" + encodeURIComponent(arguments[a]);
      }
      return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function Hr() {
    }
    var Sa = { d: { f: Hr, r: function() {
      throw Error(Xy(522));
    }, D: Hr, C: Hr, L: Hr, m: Hr, X: Hr, S: Hr, M: Hr }, p: 0, findDOMNode: null }, WT = Symbol.for("react.portal");
    function QT(e, t, a) {
      var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return { $$typeof: WT, key: o == null ? null : "" + o, children: e, containerInfo: t, implementation: a };
    }
    var Pi = ZT.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function df(e, t) {
      if (e === "font") return "";
      if (typeof t == "string") return t === "use-credentials" ? t : "";
    }
    La.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Sa;
    La.createPortal = function(e, t) {
      var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(Xy(299));
      return QT(e, t, null, a);
    };
    La.flushSync = function(e) {
      var t = Pi.T, a = Sa.p;
      try {
        if (Pi.T = null, Sa.p = 2, e) return e();
      } finally {
        Pi.T = t, Sa.p = a, Sa.d.f();
      }
    };
    La.preconnect = function(e, t) {
      typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, Sa.d.C(e, t));
    };
    La.prefetchDNS = function(e) {
      typeof e == "string" && Sa.d.D(e);
    };
    La.preinit = function(e, t) {
      if (typeof e == "string" && t && typeof t.as == "string") {
        var a = t.as, o = df(a, t.crossOrigin), r = typeof t.integrity == "string" ? t.integrity : void 0, n = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
        a === "style" ? Sa.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, { crossOrigin: o, integrity: r, fetchPriority: n }) : a === "script" && Sa.d.X(e, { crossOrigin: o, integrity: r, fetchPriority: n, nonce: typeof t.nonce == "string" ? t.nonce : void 0 });
      }
    };
    La.preinitModule = function(e, t) {
      if (typeof e == "string") if (typeof t == "object" && t !== null) {
        if (t.as == null || t.as === "script") {
          var a = df(t.as, t.crossOrigin);
          Sa.d.M(e, { crossOrigin: a, integrity: typeof t.integrity == "string" ? t.integrity : void 0, nonce: typeof t.nonce == "string" ? t.nonce : void 0 });
        }
      } else t == null && Sa.d.M(e);
    };
    La.preload = function(e, t) {
      if (typeof e == "string" && typeof t == "object" && t !== null && typeof t.as == "string") {
        var a = t.as, o = df(a, t.crossOrigin);
        Sa.d.L(e, a, { crossOrigin: o, integrity: typeof t.integrity == "string" ? t.integrity : void 0, nonce: typeof t.nonce == "string" ? t.nonce : void 0, type: typeof t.type == "string" ? t.type : void 0, fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0, referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0, imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0, imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0, media: typeof t.media == "string" ? t.media : void 0 });
      }
    };
    La.preloadModule = function(e, t) {
      if (typeof e == "string") if (t) {
        var a = df(t.as, t.crossOrigin);
        Sa.d.m(e, { as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0, crossOrigin: a, integrity: typeof t.integrity == "string" ? t.integrity : void 0 });
      } else Sa.d.m(e);
    };
    La.requestFormReset = function(e) {
      Sa.d.r(e);
    };
    La.unstable_batchedUpdates = function(e, t) {
      return e(t);
    };
    La.useFormState = function(e, t, a) {
      return Pi.H.useFormState(e, t, a);
    };
    La.useFormStatus = function() {
      return Pi.H.useHostTransitionStatus();
    };
    La.version = "19.2.8";
  });
  var Ni = tt((A5, Zy) => {
    "use strict";
    function Yy() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Yy);
      } catch (e) {
        console.error(e);
      }
    }
    Yy(), Zy.exports = Ky();
  });
  var lv = tt((Nd) => {
    "use strict";
    var Gt = jy(), L1 = F(), $T = Ni();
    function B(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var a = 2; a < arguments.length; a++) t += "&args[]=" + encodeURIComponent(arguments[a]);
      }
      return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function C1(e) {
      return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
    }
    function vu(e) {
      var t = e, a = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do
          t = e, (t.flags & 4098) !== 0 && (a = t.return), e = t.return;
        while (e);
      }
      return t.tag === 3 ? a : null;
    }
    function v1(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
      }
      return null;
    }
    function w1(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
      }
      return null;
    }
    function Wy(e) {
      if (vu(e) !== e) throw Error(B(188));
    }
    function JT(e) {
      var t = e.alternate;
      if (!t) {
        if (t = vu(e), t === null) throw Error(B(188));
        return t !== e ? null : e;
      }
      for (var a = e, o = t; ; ) {
        var r = a.return;
        if (r === null) break;
        var n = r.alternate;
        if (n === null) {
          if (o = r.return, o !== null) {
            a = o;
            continue;
          }
          break;
        }
        if (r.child === n.child) {
          for (n = r.child; n; ) {
            if (n === a) return Wy(r), e;
            if (n === o) return Wy(r), t;
            n = n.sibling;
          }
          throw Error(B(188));
        }
        if (a.return !== o.return) a = r, o = n;
        else {
          for (var s = false, l = r.child; l; ) {
            if (l === a) {
              s = true, a = r, o = n;
              break;
            }
            if (l === o) {
              s = true, o = r, a = n;
              break;
            }
            l = l.sibling;
          }
          if (!s) {
            for (l = n.child; l; ) {
              if (l === a) {
                s = true, a = n, o = r;
                break;
              }
              if (l === o) {
                s = true, o = n, a = r;
                break;
              }
              l = l.sibling;
            }
            if (!s) throw Error(B(189));
          }
        }
        if (a.alternate !== o) throw Error(B(190));
      }
      if (a.tag !== 3) throw Error(B(188));
      return a.stateNode.current === a ? e : t;
    }
    function I1(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null; ) {
        if (t = I1(e), t !== null) return t;
        e = e.sibling;
      }
      return null;
    }
    var dt = Object.assign, ek = Symbol.for("react.element"), pf = Symbol.for("react.transitional.element"), ji = Symbol.for("react.portal"), al = Symbol.for("react.fragment"), E1 = Symbol.for("react.strict_mode"), Yh = Symbol.for("react.profiler"), A1 = Symbol.for("react.consumer"), sr = Symbol.for("react.context"), Vg = Symbol.for("react.forward_ref"), Zh = Symbol.for("react.suspense"), Wh = Symbol.for("react.suspense_list"), Gg = Symbol.for("react.memo"), zr = Symbol.for("react.lazy"), Qh = Symbol.for("react.activity"), tk = Symbol.for("react.memo_cache_sentinel"), Qy = Symbol.iterator;
    function Ui(e) {
      return e === null || typeof e != "object" ? null : (e = Qy && e[Qy] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var ak = Symbol.for("react.client.reference");
    function $h(e) {
      if (e == null) return null;
      if (typeof e == "function") return e.$$typeof === ak ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case al:
          return "Fragment";
        case Yh:
          return "Profiler";
        case E1:
          return "StrictMode";
        case Zh:
          return "Suspense";
        case Wh:
          return "SuspenseList";
        case Qh:
          return "Activity";
      }
      if (typeof e == "object") switch (e.$$typeof) {
        case ji:
          return "Portal";
        case sr:
          return e.displayName || "Context";
        case A1:
          return (e._context.displayName || "Context") + ".Consumer";
        case Vg:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case Gg:
          return t = e.displayName || null, t !== null ? t : $h(e.type) || "Memo";
        case zr:
          t = e._payload, e = e._init;
          try {
            return $h(e(t));
          } catch {
          }
      }
      return null;
    }
    var Xi = Array.isArray, fe = L1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Fe = $T.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Gn = { pending: false, data: null, method: null, action: null }, Jh = [], ol = -1;
    function No(e) {
      return { current: e };
    }
    function Qt(e) {
      0 > ol || (e.current = Jh[ol], Jh[ol] = null, ol--);
    }
    function nt(e, t) {
      ol++, Jh[ol] = e.current, e.current = t;
    }
    var Po = No(null), uu = No(null), Qr = No(null), Xf = No(null);
    function Kf(e, t) {
      switch (nt(Qr, t), nt(uu, e), nt(Po, null), t.nodeType) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? r1(e) : 0;
          break;
        default:
          if (e = t.tagName, t = t.namespaceURI) t = r1(t), e = KC(t, e);
          else switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
      }
      Qt(Po), nt(Po, e);
    }
    function Ll() {
      Qt(Po), Qt(uu), Qt(Qr);
    }
    function eg(e) {
      e.memoizedState !== null && nt(Xf, e);
      var t = Po.current, a = KC(t, e.type);
      t !== a && (nt(uu, e), nt(Po, a));
    }
    function Yf(e) {
      uu.current === e && (Qt(Po), Qt(uu)), Xf.current === e && (Qt(Xf), Su._currentValue = Gn);
    }
    var hh, $y;
    function zn(e) {
      if (hh === void 0) try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        hh = t && t[1] || "", $y = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
      return `
` + hh + e + $y;
    }
    var gh = false;
    function xh(e, t) {
      if (!e || gh) return "";
      gh = true;
      var a = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var o = { DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var d = function() {
                throw Error();
              };
              if (Object.defineProperty(d.prototype, "props", { set: function() {
                throw Error();
              } }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(d, []);
                } catch (p) {
                  var f = p;
                }
                Reflect.construct(e, [], d);
              } else {
                try {
                  d.call();
                } catch (p) {
                  f = p;
                }
                e.call(d.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (p) {
                f = p;
              }
              (d = e()) && typeof d.catch == "function" && d.catch(function() {
              });
            }
          } catch (p) {
            if (p && f && typeof p.stack == "string") return [p.stack, f.stack];
          }
          return [null, null];
        } };
        o.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var r = Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot, "name");
        r && r.configurable && Object.defineProperty(o.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
        var n = o.DetermineComponentFrameRoot(), s = n[0], l = n[1];
        if (s && l) {
          var i = s.split(`
`), u = l.split(`
`);
          for (r = o = 0; o < i.length && !i[o].includes("DetermineComponentFrameRoot"); ) o++;
          for (; r < u.length && !u[r].includes("DetermineComponentFrameRoot"); ) r++;
          if (o === i.length || r === u.length) for (o = i.length - 1, r = u.length - 1; 1 <= o && 0 <= r && i[o] !== u[r]; ) r--;
          for (; 1 <= o && 0 <= r; o--, r--) if (i[o] !== u[r]) {
            if (o !== 1 || r !== 1) do
              if (o--, r--, 0 > r || i[o] !== u[r]) {
                var c = `
` + i[o].replace(" at new ", " at ");
                return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c;
              }
            while (1 <= o && 0 <= r);
            break;
          }
        }
      } finally {
        gh = false, Error.prepareStackTrace = a;
      }
      return (a = e ? e.displayName || e.name : "") ? zn(a) : "";
    }
    function ok(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return zn(e.type);
        case 16:
          return zn("Lazy");
        case 13:
          return e.child !== t && t !== null ? zn("Suspense Fallback") : zn("Suspense");
        case 19:
          return zn("SuspenseList");
        case 0:
        case 15:
          return xh(e.type, false);
        case 11:
          return xh(e.type.render, false);
        case 1:
          return xh(e.type, true);
        case 31:
          return zn("Activity");
        default:
          return "";
      }
    }
    function Jy(e) {
      try {
        var t = "", a = null;
        do
          t += ok(e, a), a = e, e = e.return;
        while (e);
        return t;
      } catch (o) {
        return `
Error generating stack: ` + o.message + `
` + o.stack;
      }
    }
    var tg = Object.prototype.hasOwnProperty, jg = Gt.unstable_scheduleCallback, bh = Gt.unstable_cancelCallback, rk = Gt.unstable_shouldYield, nk = Gt.unstable_requestPaint, Ka = Gt.unstable_now, sk = Gt.unstable_getCurrentPriorityLevel, T1 = Gt.unstable_ImmediatePriority, k1 = Gt.unstable_UserBlockingPriority, Zf = Gt.unstable_NormalPriority, lk = Gt.unstable_LowPriority, R1 = Gt.unstable_IdlePriority, ik = Gt.log, uk = Gt.unstable_setDisableYieldValue, wu = null, Ya = null;
    function Xr(e) {
      if (typeof ik == "function" && uk(e), Ya && typeof Ya.setStrictMode == "function") try {
        Ya.setStrictMode(wu, e);
      } catch {
      }
    }
    var Za = Math.clz32 ? Math.clz32 : dk, ck = Math.log, fk = Math.LN2;
    function dk(e) {
      return e >>>= 0, e === 0 ? 32 : 31 - (ck(e) / fk | 0) | 0;
    }
    var mf = 256, hf = 262144, gf = 4194304;
    function qn(e) {
      var t = e & 42;
      if (t !== 0) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function Ld(e, t, a) {
      var o = e.pendingLanes;
      if (o === 0) return 0;
      var r = 0, n = e.suspendedLanes, s = e.pingedLanes;
      e = e.warmLanes;
      var l = o & 134217727;
      return l !== 0 ? (o = l & ~n, o !== 0 ? r = qn(o) : (s &= l, s !== 0 ? r = qn(s) : a || (a = l & ~e, a !== 0 && (r = qn(a))))) : (l = o & ~n, l !== 0 ? r = qn(l) : s !== 0 ? r = qn(s) : a || (a = o & ~e, a !== 0 && (r = qn(a)))), r === 0 ? 0 : t !== 0 && t !== r && (t & n) === 0 && (n = r & -r, a = t & -t, n >= a || n === 32 && (a & 4194048) !== 0) ? t : r;
    }
    function Iu(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function pk(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function M1() {
      var e = gf;
      return gf <<= 1, (gf & 62914560) === 0 && (gf = 4194304), e;
    }
    function yh(e) {
      for (var t = [], a = 0; 31 > a; a++) t.push(e);
      return t;
    }
    function Eu(e, t) {
      e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
    }
    function mk(e, t, a, o, r, n) {
      var s = e.pendingLanes;
      e.pendingLanes = a, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= a, e.entangledLanes &= a, e.errorRecoveryDisabledLanes &= a, e.shellSuspendCounter = 0;
      var l = e.entanglements, i = e.expirationTimes, u = e.hiddenUpdates;
      for (a = s & ~a; 0 < a; ) {
        var c = 31 - Za(a), d = 1 << c;
        l[c] = 0, i[c] = -1;
        var f = u[c];
        if (f !== null) for (u[c] = null, c = 0; c < f.length; c++) {
          var p = f[c];
          p !== null && (p.lane &= -536870913);
        }
        a &= ~d;
      }
      o !== 0 && D1(e, o, 0), n !== 0 && r === 0 && e.tag !== 0 && (e.suspendedLanes |= n & ~(s & ~t));
    }
    function D1(e, t, a) {
      e.pendingLanes |= t, e.suspendedLanes &= ~t;
      var o = 31 - Za(t);
      e.entangledLanes |= t, e.entanglements[o] = e.entanglements[o] | 1073741824 | a & 261930;
    }
    function O1(e, t) {
      var a = e.entangledLanes |= t;
      for (e = e.entanglements; a; ) {
        var o = 31 - Za(a), r = 1 << o;
        r & t | e[o] & t && (e[o] |= t), a &= ~r;
      }
    }
    function B1(e, t) {
      var a = t & -t;
      return a = (a & 42) !== 0 ? 1 : Xg(a), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
    }
    function Xg(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function Kg(e) {
      return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
    }
    function _1() {
      var e = Fe.p;
      return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : rv(e.type));
    }
    function eS(e, t) {
      var a = Fe.p;
      try {
        return Fe.p = e, t();
      } finally {
        Fe.p = a;
      }
    }
    var fn = Math.random().toString(36).slice(2), aa = "__reactFiber$" + fn, _a = "__reactProps$" + fn, Dl = "__reactContainer$" + fn, ag = "__reactEvents$" + fn, hk = "__reactListeners$" + fn, gk = "__reactHandles$" + fn, tS = "__reactResources$" + fn, Au = "__reactMarker$" + fn;
    function Yg(e) {
      delete e[aa], delete e[_a], delete e[ag], delete e[hk], delete e[gk];
    }
    function rl(e) {
      var t = e[aa];
      if (t) return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[Dl] || a[aa]) {
          if (a = t.alternate, t.child !== null || a !== null && a.child !== null) for (e = u1(e); e !== null; ) {
            if (a = e[aa]) return a;
            e = u1(e);
          }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Ol(e) {
      if (e = e[aa] || e[Dl]) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
      }
      return null;
    }
    function Ki(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(B(33));
    }
    function ml(e) {
      var t = e[tS];
      return t || (t = e[tS] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
    }
    function Wt(e) {
      e[Au] = true;
    }
    var P1 = /* @__PURE__ */ new Set(), N1 = {};
    function es(e, t) {
      Cl(e, t), Cl(e + "Capture", t);
    }
    function Cl(e, t) {
      for (N1[e] = t, e = 0; e < t.length; e++) P1.add(t[e]);
    }
    var xk = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), aS = {}, oS = {};
    function bk(e) {
      return tg.call(oS, e) ? true : tg.call(aS, e) ? false : xk.test(e) ? oS[e] = true : (aS[e] = true, false);
    }
    function Mf(e, t, a) {
      if (bk(t)) if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var o = t.toLowerCase().slice(0, 5);
            if (o !== "data-" && o !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + a);
      }
    }
    function xf(e, t, a) {
      if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, "" + a);
      }
    }
    function Jo(e, t, a, o) {
      if (o === null) e.removeAttribute(a);
      else {
        switch (typeof o) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(a);
            return;
        }
        e.setAttributeNS(t, a, "" + o);
      }
    }
    function so(e) {
      switch (typeof e) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return e;
        default:
          return "";
      }
    }
    function U1(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function yk(e, t, a) {
      var o = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (!e.hasOwnProperty(t) && typeof o < "u" && typeof o.get == "function" && typeof o.set == "function") {
        var r = o.get, n = o.set;
        return Object.defineProperty(e, t, { configurable: true, get: function() {
          return r.call(this);
        }, set: function(s) {
          a = "" + s, n.call(this, s);
        } }), Object.defineProperty(e, t, { enumerable: o.enumerable }), { getValue: function() {
          return a;
        }, setValue: function(s) {
          a = "" + s;
        }, stopTracking: function() {
          e._valueTracker = null, delete e[t];
        } };
      }
    }
    function og(e) {
      if (!e._valueTracker) {
        var t = U1(e) ? "checked" : "value";
        e._valueTracker = yk(e, t, "" + e[t]);
      }
    }
    function H1(e) {
      if (!e) return false;
      var t = e._valueTracker;
      if (!t) return true;
      var a = t.getValue(), o = "";
      return e && (o = U1(e) ? e.checked ? "true" : "false" : e.value), e = o, e !== a ? (t.setValue(e), true) : false;
    }
    function Wf(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Sk = /[\n"\\]/g;
    function uo(e) {
      return e.replace(Sk, function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      });
    }
    function rg(e, t, a, o, r, n, s, l) {
      e.name = "", s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.type = s : e.removeAttribute("type"), t != null ? s === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + so(t)) : e.value !== "" + so(t) && (e.value = "" + so(t)) : s !== "submit" && s !== "reset" || e.removeAttribute("value"), t != null ? ng(e, s, so(t)) : a != null ? ng(e, s, so(a)) : o != null && e.removeAttribute("value"), r == null && n != null && (e.defaultChecked = !!n), r != null && (e.checked = r && typeof r != "function" && typeof r != "symbol"), l != null && typeof l != "function" && typeof l != "symbol" && typeof l != "boolean" ? e.name = "" + so(l) : e.removeAttribute("name");
    }
    function z1(e, t, a, o, r, n, s, l) {
      if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (e.type = n), t != null || a != null) {
        if (!(n !== "submit" && n !== "reset" || t != null)) {
          og(e);
          return;
        }
        a = a != null ? "" + so(a) : "", t = t != null ? "" + so(t) : a, l || t === e.value || (e.value = t), e.defaultValue = t;
      }
      o = o ?? r, o = typeof o != "function" && typeof o != "symbol" && !!o, e.checked = l ? e.checked : !!o, e.defaultChecked = !!o, s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (e.name = s), og(e);
    }
    function ng(e, t, a) {
      t === "number" && Wf(e.ownerDocument) === e || e.defaultValue === "" + a || (e.defaultValue = "" + a);
    }
    function hl(e, t, a, o) {
      if (e = e.options, t) {
        t = {};
        for (var r = 0; r < a.length; r++) t["$" + a[r]] = true;
        for (a = 0; a < e.length; a++) r = t.hasOwnProperty("$" + e[a].value), e[a].selected !== r && (e[a].selected = r), r && o && (e[a].defaultSelected = true);
      } else {
        for (a = "" + so(a), t = null, r = 0; r < e.length; r++) {
          if (e[r].value === a) {
            e[r].selected = true, o && (e[r].defaultSelected = true);
            return;
          }
          t !== null || e[r].disabled || (t = e[r]);
        }
        t !== null && (t.selected = true);
      }
    }
    function q1(e, t, a) {
      if (t != null && (t = "" + so(t), t !== e.value && (e.value = t), a == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = a != null ? "" + so(a) : "";
    }
    function F1(e, t, a, o) {
      if (t == null) {
        if (o != null) {
          if (a != null) throw Error(B(92));
          if (Xi(o)) {
            if (1 < o.length) throw Error(B(93));
            o = o[0];
          }
          a = o;
        }
        a == null && (a = ""), t = a;
      }
      a = so(t), e.defaultValue = a, o = e.textContent, o === a && o !== "" && o !== null && (e.value = o), og(e);
    }
    function vl(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === 3) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var Lk = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function rS(e, t, a) {
      var o = t.indexOf("--") === 0;
      a == null || typeof a == "boolean" || a === "" ? o ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : o ? e.setProperty(t, a) : typeof a != "number" || a === 0 || Lk.has(t) ? t === "float" ? e.cssFloat = a : e[t] = ("" + a).trim() : e[t] = a + "px";
    }
    function V1(e, t, a) {
      if (t != null && typeof t != "object") throw Error(B(62));
      if (e = e.style, a != null) {
        for (var o in a) !a.hasOwnProperty(o) || t != null && t.hasOwnProperty(o) || (o.indexOf("--") === 0 ? e.setProperty(o, "") : o === "float" ? e.cssFloat = "" : e[o] = "");
        for (var r in t) o = t[r], t.hasOwnProperty(r) && a[r] !== o && rS(e, r, o);
      } else for (var n in t) t.hasOwnProperty(n) && rS(e, n, t[n]);
    }
    function Zg(e) {
      if (e.indexOf("-") === -1) return false;
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var Ck = /* @__PURE__ */ new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]]), vk = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Df(e) {
      return vk.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
    }
    function lr() {
    }
    var sg = null;
    function Wg(e) {
      return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
    }
    var nl = null, gl = null;
    function nS(e) {
      var t = Ol(e);
      if (t && (e = t.stateNode)) {
        var a = e[_a] || null;
        e: switch (e = t.stateNode, t.type) {
          case "input":
            if (rg(e, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name), t = a.name, a.type === "radio" && t != null) {
              for (a = e; a.parentNode; ) a = a.parentNode;
              for (a = a.querySelectorAll('input[name="' + uo("" + t) + '"][type="radio"]'), t = 0; t < a.length; t++) {
                var o = a[t];
                if (o !== e && o.form === e.form) {
                  var r = o[_a] || null;
                  if (!r) throw Error(B(90));
                  rg(o, r.value, r.defaultValue, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name);
                }
              }
              for (t = 0; t < a.length; t++) o = a[t], o.form === e.form && H1(o);
            }
            break e;
          case "textarea":
            q1(e, a.value, a.defaultValue);
            break e;
          case "select":
            t = a.value, t != null && hl(e, !!a.multiple, t, false);
        }
      }
    }
    var Sh = false;
    function G1(e, t, a) {
      if (Sh) return e(t, a);
      Sh = true;
      try {
        var o = e(t);
        return o;
      } finally {
        if (Sh = false, (nl !== null || gl !== null) && (Od(), nl && (t = nl, e = gl, gl = nl = null, nS(t), e))) for (t = 0; t < e.length; t++) nS(e[t]);
      }
    }
    function cu(e, t) {
      var a = e.stateNode;
      if (a === null) return null;
      var o = a[_a] || null;
      if (o === null) return null;
      a = o[t];
      e: switch (t) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (o = !o.disabled) || (e = e.type, o = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !o;
          break e;
        default:
          e = false;
      }
      if (e) return null;
      if (a && typeof a != "function") throw Error(B(231, t, typeof a));
      return a;
    }
    var dr = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), lg = false;
    if (dr) try {
      Qs = {}, Object.defineProperty(Qs, "passive", { get: function() {
        lg = true;
      } }), window.addEventListener("test", Qs, Qs), window.removeEventListener("test", Qs, Qs);
    } catch {
      lg = false;
    }
    var Qs, Kr = null, Qg = null, Of = null;
    function j1() {
      if (Of) return Of;
      var e, t = Qg, a = t.length, o, r = "value" in Kr ? Kr.value : Kr.textContent, n = r.length;
      for (e = 0; e < a && t[e] === r[e]; e++) ;
      var s = a - e;
      for (o = 1; o <= s && t[a - o] === r[n - o]; o++) ;
      return Of = r.slice(e, 1 < o ? 1 - o : void 0);
    }
    function Bf(e) {
      var t = e.keyCode;
      return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
    }
    function bf() {
      return true;
    }
    function sS() {
      return false;
    }
    function Pa(e) {
      function t(a, o, r, n, s) {
        this._reactName = a, this._targetInst = r, this.type = o, this.nativeEvent = n, this.target = s, this.currentTarget = null;
        for (var l in e) e.hasOwnProperty(l) && (a = e[l], this[l] = a ? a(n) : n[l]);
        return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === false) ? bf : sS, this.isPropagationStopped = sS, this;
      }
      return dt(t.prototype, { preventDefault: function() {
        this.defaultPrevented = true;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = false), this.isDefaultPrevented = bf);
      }, stopPropagation: function() {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = true), this.isPropagationStopped = bf);
      }, persist: function() {
      }, isPersistent: bf }), t;
    }
    var ts = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
      return e.timeStamp || Date.now();
    }, defaultPrevented: 0, isTrusted: 0 }, Cd = Pa(ts), Tu = dt({}, ts, { view: 0, detail: 0 }), wk = Pa(Tu), Lh, Ch, Hi, vd = dt({}, Tu, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: $g, button: 0, buttons: 0, relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    }, movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Hi && (Hi && e.type === "mousemove" ? (Lh = e.screenX - Hi.screenX, Ch = e.screenY - Hi.screenY) : Ch = Lh = 0, Hi = e), Lh);
    }, movementY: function(e) {
      return "movementY" in e ? e.movementY : Ch;
    } }), lS = Pa(vd), Ik = dt({}, vd, { dataTransfer: 0 }), Ek = Pa(Ik), Ak = dt({}, Tu, { relatedTarget: 0 }), vh = Pa(Ak), Tk = dt({}, ts, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), kk = Pa(Tk), Rk = dt({}, ts, { clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    } }), Mk = Pa(Rk), Dk = dt({}, ts, { data: 0 }), iS = Pa(Dk), Ok = { Esc: "Escape", Spacebar: " ", Left: "ArrowLeft", Up: "ArrowUp", Right: "ArrowRight", Down: "ArrowDown", Del: "Delete", Win: "OS", Menu: "ContextMenu", Apps: "ContextMenu", Scroll: "ScrollLock", MozPrintableKey: "Unidentified" }, Bk = { 8: "Backspace", 9: "Tab", 12: "Clear", 13: "Enter", 16: "Shift", 17: "Control", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Escape", 32: " ", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 45: "Insert", 46: "Delete", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NumLock", 145: "ScrollLock", 224: "Meta" }, _k = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function Pk(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = _k[e]) ? !!t[e] : false;
    }
    function $g() {
      return Pk;
    }
    var Nk = dt({}, Tu, { key: function(e) {
      if (e.key) {
        var t = Ok[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Bf(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Bk[e.keyCode] || "Unidentified" : "";
    }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: $g, charCode: function(e) {
      return e.type === "keypress" ? Bf(e) : 0;
    }, keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }, which: function(e) {
      return e.type === "keypress" ? Bf(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    } }), Uk = Pa(Nk), Hk = dt({}, vd, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), uS = Pa(Hk), zk = dt({}, Tu, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: $g }), qk = Pa(zk), Fk = dt({}, ts, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Vk = Pa(Fk), Gk = dt({}, vd, { deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    }, deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    }, deltaZ: 0, deltaMode: 0 }), jk = Pa(Gk), Xk = dt({}, ts, { newState: 0, oldState: 0 }), Kk = Pa(Xk), Yk = [9, 13, 27, 32], Jg = dr && "CompositionEvent" in window, Wi = null;
    dr && "documentMode" in document && (Wi = document.documentMode);
    var Zk = dr && "TextEvent" in window && !Wi, X1 = dr && (!Jg || Wi && 8 < Wi && 11 >= Wi), cS = " ", fS = false;
    function K1(e, t) {
      switch (e) {
        case "keyup":
          return Yk.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function Y1(e) {
      return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
    }
    var sl = false;
    function Wk(e, t) {
      switch (e) {
        case "compositionend":
          return Y1(t);
        case "keypress":
          return t.which !== 32 ? null : (fS = true, cS);
        case "textInput":
          return e = t.data, e === cS && fS ? null : e;
        default:
          return null;
      }
    }
    function Qk(e, t) {
      if (sl) return e === "compositionend" || !Jg && K1(e, t) ? (e = j1(), Of = Qg = Kr = null, sl = false, e) : null;
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
            if (t.char && 1 < t.char.length) return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return X1 && t.locale !== "ko" ? null : t.data;
        default:
          return null;
      }
    }
    var $k = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
    function dS(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!$k[e.type] : t === "textarea";
    }
    function Z1(e, t, a, o) {
      nl ? gl ? gl.push(o) : gl = [o] : nl = o, t = md(t, "onChange"), 0 < t.length && (a = new Cd("onChange", "change", null, a, o), e.push({ event: a, listeners: t }));
    }
    var Qi = null, fu = null;
    function Jk(e) {
      GC(e, 0);
    }
    function wd(e) {
      var t = Ki(e);
      if (H1(t)) return e;
    }
    function pS(e, t) {
      if (e === "change") return t;
    }
    var W1 = false;
    dr && (dr ? (Sf = "oninput" in document, Sf || (wh = document.createElement("div"), wh.setAttribute("oninput", "return;"), Sf = typeof wh.oninput == "function"), yf = Sf) : yf = false, W1 = yf && (!document.documentMode || 9 < document.documentMode));
    var yf, Sf, wh;
    function mS() {
      Qi && (Qi.detachEvent("onpropertychange", Q1), fu = Qi = null);
    }
    function Q1(e) {
      if (e.propertyName === "value" && wd(fu)) {
        var t = [];
        Z1(t, fu, e, Wg(e)), G1(Jk, t);
      }
    }
    function eR(e, t, a) {
      e === "focusin" ? (mS(), Qi = t, fu = a, Qi.attachEvent("onpropertychange", Q1)) : e === "focusout" && mS();
    }
    function tR(e) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown") return wd(fu);
    }
    function aR(e, t) {
      if (e === "click") return wd(t);
    }
    function oR(e, t) {
      if (e === "input" || e === "change") return wd(t);
    }
    function rR(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Qa = typeof Object.is == "function" ? Object.is : rR;
    function du(e, t) {
      if (Qa(e, t)) return true;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null) return false;
      var a = Object.keys(e), o = Object.keys(t);
      if (a.length !== o.length) return false;
      for (o = 0; o < a.length; o++) {
        var r = a[o];
        if (!tg.call(t, r) || !Qa(e[r], t[r])) return false;
      }
      return true;
    }
    function hS(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function gS(e, t) {
      var a = hS(e);
      e = 0;
      for (var o; a; ) {
        if (a.nodeType === 3) {
          if (o = e + a.textContent.length, e <= t && o >= t) return { node: a, offset: t - e };
          e = o;
        }
        e: {
          for (; a; ) {
            if (a.nextSibling) {
              a = a.nextSibling;
              break e;
            }
            a = a.parentNode;
          }
          a = void 0;
        }
        a = hS(a);
      }
    }
    function $1(e, t) {
      return e && t ? e === t ? true : e && e.nodeType === 3 ? false : t && t.nodeType === 3 ? $1(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : false : false;
    }
    function J1(e) {
      e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
      for (var t = Wf(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var a = typeof t.contentWindow.location.href == "string";
        } catch {
          a = false;
        }
        if (a) e = t.contentWindow;
        else break;
        t = Wf(e.document);
      }
      return t;
    }
    function ex(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    var nR = dr && "documentMode" in document && 11 >= document.documentMode, ll = null, ig = null, $i = null, ug = false;
    function xS(e, t, a) {
      var o = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
      ug || ll == null || ll !== Wf(o) || (o = ll, "selectionStart" in o && ex(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), $i && du($i, o) || ($i = o, o = md(ig, "onSelect"), 0 < o.length && (t = new Cd("onSelect", "select", null, t, a), e.push({ event: t, listeners: o }), t.target = ll)));
    }
    function Hn(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var il = { animationend: Hn("Animation", "AnimationEnd"), animationiteration: Hn("Animation", "AnimationIteration"), animationstart: Hn("Animation", "AnimationStart"), transitionrun: Hn("Transition", "TransitionRun"), transitionstart: Hn("Transition", "TransitionStart"), transitioncancel: Hn("Transition", "TransitionCancel"), transitionend: Hn("Transition", "TransitionEnd") }, Ih = {}, eL = {};
    dr && (eL = document.createElement("div").style, "AnimationEvent" in window || (delete il.animationend.animation, delete il.animationiteration.animation, delete il.animationstart.animation), "TransitionEvent" in window || delete il.transitionend.transition);
    function as(e) {
      if (Ih[e]) return Ih[e];
      if (!il[e]) return e;
      var t = il[e], a;
      for (a in t) if (t.hasOwnProperty(a) && a in eL) return Ih[e] = t[a];
      return e;
    }
    var tL = as("animationend"), aL = as("animationiteration"), oL = as("animationstart"), sR = as("transitionrun"), lR = as("transitionstart"), iR = as("transitioncancel"), rL = as("transitionend"), nL = /* @__PURE__ */ new Map(), cg = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    cg.push("scrollEnd");
    function wo(e, t) {
      nL.set(e, t), es(t, [e]);
    }
    var Qf = typeof reportError == "function" ? reportError : function(e) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var t = new window.ErrorEvent("error", { bubbles: true, cancelable: true, message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e), error: e });
        if (!window.dispatchEvent(t)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    }, no = [], ul = 0, tx = 0;
    function Id() {
      for (var e = ul, t = tx = ul = 0; t < e; ) {
        var a = no[t];
        no[t++] = null;
        var o = no[t];
        no[t++] = null;
        var r = no[t];
        no[t++] = null;
        var n = no[t];
        if (no[t++] = null, o !== null && r !== null) {
          var s = o.pending;
          s === null ? r.next = r : (r.next = s.next, s.next = r), o.pending = r;
        }
        n !== 0 && sL(a, r, n);
      }
    }
    function Ed(e, t, a, o) {
      no[ul++] = e, no[ul++] = t, no[ul++] = a, no[ul++] = o, tx |= o, e.lanes |= o, e = e.alternate, e !== null && (e.lanes |= o);
    }
    function ax(e, t, a, o) {
      return Ed(e, t, a, o), $f(e);
    }
    function os(e, t) {
      return Ed(e, null, null, t), $f(e);
    }
    function sL(e, t, a) {
      e.lanes |= a;
      var o = e.alternate;
      o !== null && (o.lanes |= a);
      for (var r = false, n = e.return; n !== null; ) n.childLanes |= a, o = n.alternate, o !== null && (o.childLanes |= a), n.tag === 22 && (e = n.stateNode, e === null || e._visibility & 1 || (r = true)), e = n, n = n.return;
      return e.tag === 3 ? (n = e.stateNode, r && t !== null && (r = 31 - Za(a), e = n.hiddenUpdates, o = e[r], o === null ? e[r] = [t] : o.push(t), t.lane = a | 536870912), n) : null;
    }
    function $f(e) {
      if (50 < lu) throw lu = 0, Mg = null, Error(B(185));
      for (var t = e.return; t !== null; ) e = t, t = e.return;
      return e.tag === 3 ? e.stateNode : null;
    }
    var cl = {};
    function uR(e, t, a, o) {
      this.tag = e, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
    }
    function ja(e, t, a, o) {
      return new uR(e, t, a, o);
    }
    function ox(e) {
      return e = e.prototype, !(!e || !e.isReactComponent);
    }
    function ur(e, t) {
      var a = e.alternate;
      return a === null ? (a = ja(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = e.flags & 65011712, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue, t = e.dependencies, a.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.refCleanup = e.refCleanup, a;
    }
    function lL(e, t) {
      e.flags &= 65011714;
      var a = e.alternate;
      return a === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type, t = a.dependencies, e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }), e;
    }
    function _f(e, t, a, o, r, n) {
      var s = 0;
      if (o = e, typeof e == "function") ox(e) && (s = 1);
      else if (typeof e == "string") s = dM(e, a, Po.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
      else e: switch (e) {
        case Qh:
          return e = ja(31, a, t, r), e.elementType = Qh, e.lanes = n, e;
        case al:
          return jn(a.children, r, n, t);
        case E1:
          s = 8, r |= 24;
          break;
        case Yh:
          return e = ja(12, a, t, r | 2), e.elementType = Yh, e.lanes = n, e;
        case Zh:
          return e = ja(13, a, t, r), e.elementType = Zh, e.lanes = n, e;
        case Wh:
          return e = ja(19, a, t, r), e.elementType = Wh, e.lanes = n, e;
        default:
          if (typeof e == "object" && e !== null) switch (e.$$typeof) {
            case sr:
              s = 10;
              break e;
            case A1:
              s = 9;
              break e;
            case Vg:
              s = 11;
              break e;
            case Gg:
              s = 14;
              break e;
            case zr:
              s = 16, o = null;
              break e;
          }
          s = 29, a = Error(B(130, e === null ? "null" : typeof e, "")), o = null;
      }
      return t = ja(s, a, t, r), t.elementType = e, t.type = o, t.lanes = n, t;
    }
    function jn(e, t, a, o) {
      return e = ja(7, e, o, t), e.lanes = a, e;
    }
    function Eh(e, t, a) {
      return e = ja(6, e, null, t), e.lanes = a, e;
    }
    function iL(e) {
      var t = ja(18, null, null, 0);
      return t.stateNode = e, t;
    }
    function Ah(e, t, a) {
      return t = ja(4, e.children !== null ? e.children : [], e.key, t), t.lanes = a, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
    }
    var bS = /* @__PURE__ */ new WeakMap();
    function co(e, t) {
      if (typeof e == "object" && e !== null) {
        var a = bS.get(e);
        return a !== void 0 ? a : (t = { value: e, source: t, stack: Jy(t) }, bS.set(e, t), t);
      }
      return { value: e, source: t, stack: Jy(t) };
    }
    var fl = [], dl = 0, Jf = null, pu = 0, lo = [], io = 0, sn = null, Oo = 1, Bo = "";
    function rr(e, t) {
      fl[dl++] = pu, fl[dl++] = Jf, Jf = e, pu = t;
    }
    function uL(e, t, a) {
      lo[io++] = Oo, lo[io++] = Bo, lo[io++] = sn, sn = e;
      var o = Oo;
      e = Bo;
      var r = 32 - Za(o) - 1;
      o &= ~(1 << r), a += 1;
      var n = 32 - Za(t) + r;
      if (30 < n) {
        var s = r - r % 5;
        n = (o & (1 << s) - 1).toString(32), o >>= s, r -= s, Oo = 1 << 32 - Za(t) + r | a << r | o, Bo = n + e;
      } else Oo = 1 << n | a << r | o, Bo = e;
    }
    function rx(e) {
      e.return !== null && (rr(e, 1), uL(e, 1, 0));
    }
    function nx(e) {
      for (; e === Jf; ) Jf = fl[--dl], fl[dl] = null, pu = fl[--dl], fl[dl] = null;
      for (; e === sn; ) sn = lo[--io], lo[io] = null, Bo = lo[--io], lo[io] = null, Oo = lo[--io], lo[io] = null;
    }
    function cL(e, t) {
      lo[io++] = Oo, lo[io++] = Bo, lo[io++] = sn, Oo = t.id, Bo = t.overflow, sn = e;
    }
    var oa = null, ft = null, De = false, $r = null, fo = false, fg = Error(B(519));
    function ln(e) {
      var t = Error(B(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
      throw mu(co(t, e)), fg;
    }
    function yS(e) {
      var t = e.stateNode, a = e.type, o = e.memoizedProps;
      switch (t[aa] = e, t[_a] = o, a) {
        case "dialog":
          Ae("cancel", t), Ae("close", t);
          break;
        case "iframe":
        case "object":
        case "embed":
          Ae("load", t);
          break;
        case "video":
        case "audio":
          for (a = 0; a < bu.length; a++) Ae(bu[a], t);
          break;
        case "source":
          Ae("error", t);
          break;
        case "img":
        case "image":
        case "link":
          Ae("error", t), Ae("load", t);
          break;
        case "details":
          Ae("toggle", t);
          break;
        case "input":
          Ae("invalid", t), z1(t, o.value, o.defaultValue, o.checked, o.defaultChecked, o.type, o.name, true);
          break;
        case "select":
          Ae("invalid", t);
          break;
        case "textarea":
          Ae("invalid", t), F1(t, o.value, o.defaultValue, o.children);
      }
      a = o.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || o.suppressHydrationWarning === true || XC(t.textContent, a) ? (o.popover != null && (Ae("beforetoggle", t), Ae("toggle", t)), o.onScroll != null && Ae("scroll", t), o.onScrollEnd != null && Ae("scrollend", t), o.onClick != null && (t.onclick = lr), t = true) : t = false, t || ln(e, true);
    }
    function SS(e) {
      for (oa = e.return; oa; ) switch (oa.tag) {
        case 5:
        case 31:
        case 13:
          fo = false;
          return;
        case 27:
        case 3:
          fo = true;
          return;
        default:
          oa = oa.return;
      }
    }
    function $s(e) {
      if (e !== oa) return false;
      if (!De) return SS(e), De = true, false;
      var t = e.tag, a;
      if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = e.type, a = !(a !== "form" && a !== "button") || Pg(e.type, e.memoizedProps)), a = !a), a && ft && ln(e), SS(e), t === 13) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(B(317));
        ft = i1(e);
      } else if (t === 31) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(B(317));
        ft = i1(e);
      } else t === 27 ? (t = ft, dn(e.type) ? (e = zg, zg = null, ft = e) : ft = t) : ft = oa ? mo(e.stateNode.nextSibling) : null;
      return true;
    }
    function Zn() {
      ft = oa = null, De = false;
    }
    function Th() {
      var e = $r;
      return e !== null && (Oa === null ? Oa = e : Oa.push.apply(Oa, e), $r = null), e;
    }
    function mu(e) {
      $r === null ? $r = [e] : $r.push(e);
    }
    var dg = No(null), rs = null, ir = null;
    function Fr(e, t, a) {
      nt(dg, t._currentValue), t._currentValue = a;
    }
    function cr(e) {
      e._currentValue = dg.current, Qt(dg);
    }
    function pg(e, t, a) {
      for (; e !== null; ) {
        var o = e.alternate;
        if ((e.childLanes & t) !== t ? (e.childLanes |= t, o !== null && (o.childLanes |= t)) : o !== null && (o.childLanes & t) !== t && (o.childLanes |= t), e === a) break;
        e = e.return;
      }
    }
    function mg(e, t, a, o) {
      var r = e.child;
      for (r !== null && (r.return = e); r !== null; ) {
        var n = r.dependencies;
        if (n !== null) {
          var s = r.child;
          n = n.firstContext;
          e: for (; n !== null; ) {
            var l = n;
            n = r;
            for (var i = 0; i < t.length; i++) if (l.context === t[i]) {
              n.lanes |= a, l = n.alternate, l !== null && (l.lanes |= a), pg(n.return, a, e), o || (s = null);
              break e;
            }
            n = l.next;
          }
        } else if (r.tag === 18) {
          if (s = r.return, s === null) throw Error(B(341));
          s.lanes |= a, n = s.alternate, n !== null && (n.lanes |= a), pg(s, a, e), s = null;
        } else s = r.child;
        if (s !== null) s.return = r;
        else for (s = r; s !== null; ) {
          if (s === e) {
            s = null;
            break;
          }
          if (r = s.sibling, r !== null) {
            r.return = s.return, s = r;
            break;
          }
          s = s.return;
        }
        r = s;
      }
    }
    function Bl(e, t, a, o) {
      e = null;
      for (var r = t, n = false; r !== null; ) {
        if (!n) {
          if ((r.flags & 524288) !== 0) n = true;
          else if ((r.flags & 262144) !== 0) break;
        }
        if (r.tag === 10) {
          var s = r.alternate;
          if (s === null) throw Error(B(387));
          if (s = s.memoizedProps, s !== null) {
            var l = r.type;
            Qa(r.pendingProps.value, s.value) || (e !== null ? e.push(l) : e = [l]);
          }
        } else if (r === Xf.current) {
          if (s = r.alternate, s === null) throw Error(B(387));
          s.memoizedState.memoizedState !== r.memoizedState.memoizedState && (e !== null ? e.push(Su) : e = [Su]);
        }
        r = r.return;
      }
      e !== null && mg(t, e, a, o), t.flags |= 262144;
    }
    function ed(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!Qa(e.context._currentValue, e.memoizedValue)) return true;
        e = e.next;
      }
      return false;
    }
    function Wn(e) {
      rs = e, ir = null, e = e.dependencies, e !== null && (e.firstContext = null);
    }
    function ra(e) {
      return fL(rs, e);
    }
    function Lf(e, t) {
      return rs === null && Wn(e), fL(e, t);
    }
    function fL(e, t) {
      var a = t._currentValue;
      if (t = { context: t, memoizedValue: a, next: null }, ir === null) {
        if (e === null) throw Error(B(308));
        ir = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
      } else ir = ir.next = t;
      return a;
    }
    var cR = typeof AbortController < "u" ? AbortController : function() {
      var e = [], t = this.signal = { aborted: false, addEventListener: function(a, o) {
        e.push(o);
      } };
      this.abort = function() {
        t.aborted = true, e.forEach(function(a) {
          return a();
        });
      };
    }, fR = Gt.unstable_scheduleCallback, dR = Gt.unstable_NormalPriority, _t = { $$typeof: sr, Consumer: null, Provider: null, _currentValue: null, _currentValue2: null, _threadCount: 0 };
    function sx() {
      return { controller: new cR(), data: /* @__PURE__ */ new Map(), refCount: 0 };
    }
    function ku(e) {
      e.refCount--, e.refCount === 0 && fR(dR, function() {
        e.controller.abort();
      });
    }
    var Ji = null, hg = 0, wl = 0, xl = null;
    function pR(e, t) {
      if (Ji === null) {
        var a = Ji = [];
        hg = 0, wl = Mx(), xl = { status: "pending", value: void 0, then: function(o) {
          a.push(o);
        } };
      }
      return hg++, t.then(LS, LS), t;
    }
    function LS() {
      if (--hg === 0 && Ji !== null) {
        xl !== null && (xl.status = "fulfilled");
        var e = Ji;
        Ji = null, wl = 0, xl = null;
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function mR(e, t) {
      var a = [], o = { status: "pending", value: null, reason: null, then: function(r) {
        a.push(r);
      } };
      return e.then(function() {
        o.status = "fulfilled", o.value = t;
        for (var r = 0; r < a.length; r++) (0, a[r])(t);
      }, function(r) {
        for (o.status = "rejected", o.reason = r, r = 0; r < a.length; r++) (0, a[r])(void 0);
      }), o;
    }
    var CS = fe.S;
    fe.S = function(e, t) {
      IC = Ka(), typeof t == "object" && t !== null && typeof t.then == "function" && pR(e, t), CS !== null && CS(e, t);
    };
    var Xn = No(null);
    function lx() {
      var e = Xn.current;
      return e !== null ? e : at.pooledCache;
    }
    function Pf(e, t) {
      t === null ? nt(Xn, Xn.current) : nt(Xn, t.pool);
    }
    function dL() {
      var e = lx();
      return e === null ? null : { parent: _t._currentValue, pool: e };
    }
    var _l = Error(B(460)), ix = Error(B(474)), Ad = Error(B(542)), td = { then: function() {
    } };
    function vS(e) {
      return e = e.status, e === "fulfilled" || e === "rejected";
    }
    function pL(e, t, a) {
      switch (a = e[a], a === void 0 ? e.push(t) : a !== t && (t.then(lr, lr), t = a), t.status) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw e = t.reason, IS(e), e;
        default:
          if (typeof t.status == "string") t.then(lr, lr);
          else {
            if (e = at, e !== null && 100 < e.shellSuspendCounter) throw Error(B(482));
            e = t, e.status = "pending", e.then(function(o) {
              if (t.status === "pending") {
                var r = t;
                r.status = "fulfilled", r.value = o;
              }
            }, function(o) {
              if (t.status === "pending") {
                var r = t;
                r.status = "rejected", r.reason = o;
              }
            });
          }
          switch (t.status) {
            case "fulfilled":
              return t.value;
            case "rejected":
              throw e = t.reason, IS(e), e;
          }
          throw Kn = t, _l;
      }
    }
    function Fn(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (a) {
        throw a !== null && typeof a == "object" && typeof a.then == "function" ? (Kn = a, _l) : a;
      }
    }
    var Kn = null;
    function wS() {
      if (Kn === null) throw Error(B(459));
      var e = Kn;
      return Kn = null, e;
    }
    function IS(e) {
      if (e === _l || e === Ad) throw Error(B(483));
    }
    var bl = null, hu = 0;
    function Cf(e) {
      var t = hu;
      return hu += 1, bl === null && (bl = []), pL(bl, e, t);
    }
    function zi(e, t) {
      t = t.props.ref, e.ref = t !== void 0 ? t : null;
    }
    function vf(e, t) {
      throw t.$$typeof === ek ? Error(B(525)) : (e = Object.prototype.toString.call(t), Error(B(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
    }
    function mL(e) {
      function t(g, m) {
        if (e) {
          var b = g.deletions;
          b === null ? (g.deletions = [m], g.flags |= 16) : b.push(m);
        }
      }
      function a(g, m) {
        if (!e) return null;
        for (; m !== null; ) t(g, m), m = m.sibling;
        return null;
      }
      function o(g) {
        for (var m = /* @__PURE__ */ new Map(); g !== null; ) g.key !== null ? m.set(g.key, g) : m.set(g.index, g), g = g.sibling;
        return m;
      }
      function r(g, m) {
        return g = ur(g, m), g.index = 0, g.sibling = null, g;
      }
      function n(g, m, b) {
        return g.index = b, e ? (b = g.alternate, b !== null ? (b = b.index, b < m ? (g.flags |= 67108866, m) : b) : (g.flags |= 67108866, m)) : (g.flags |= 1048576, m);
      }
      function s(g) {
        return e && g.alternate === null && (g.flags |= 67108866), g;
      }
      function l(g, m, b, y) {
        return m === null || m.tag !== 6 ? (m = Eh(b, g.mode, y), m.return = g, m) : (m = r(m, b), m.return = g, m);
      }
      function i(g, m, b, y) {
        var C = b.type;
        return C === al ? c(g, m, b.props.children, y, b.key) : m !== null && (m.elementType === C || typeof C == "object" && C !== null && C.$$typeof === zr && Fn(C) === m.type) ? (m = r(m, b.props), zi(m, b), m.return = g, m) : (m = _f(b.type, b.key, b.props, null, g.mode, y), zi(m, b), m.return = g, m);
      }
      function u(g, m, b, y) {
        return m === null || m.tag !== 4 || m.stateNode.containerInfo !== b.containerInfo || m.stateNode.implementation !== b.implementation ? (m = Ah(b, g.mode, y), m.return = g, m) : (m = r(m, b.children || []), m.return = g, m);
      }
      function c(g, m, b, y, C) {
        return m === null || m.tag !== 7 ? (m = jn(b, g.mode, y, C), m.return = g, m) : (m = r(m, b), m.return = g, m);
      }
      function d(g, m, b) {
        if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint") return m = Eh("" + m, g.mode, b), m.return = g, m;
        if (typeof m == "object" && m !== null) {
          switch (m.$$typeof) {
            case pf:
              return b = _f(m.type, m.key, m.props, null, g.mode, b), zi(b, m), b.return = g, b;
            case ji:
              return m = Ah(m, g.mode, b), m.return = g, m;
            case zr:
              return m = Fn(m), d(g, m, b);
          }
          if (Xi(m) || Ui(m)) return m = jn(m, g.mode, b, null), m.return = g, m;
          if (typeof m.then == "function") return d(g, Cf(m), b);
          if (m.$$typeof === sr) return d(g, Lf(g, m), b);
          vf(g, m);
        }
        return null;
      }
      function f(g, m, b, y) {
        var C = m !== null ? m.key : null;
        if (typeof b == "string" && b !== "" || typeof b == "number" || typeof b == "bigint") return C !== null ? null : l(g, m, "" + b, y);
        if (typeof b == "object" && b !== null) {
          switch (b.$$typeof) {
            case pf:
              return b.key === C ? i(g, m, b, y) : null;
            case ji:
              return b.key === C ? u(g, m, b, y) : null;
            case zr:
              return b = Fn(b), f(g, m, b, y);
          }
          if (Xi(b) || Ui(b)) return C !== null ? null : c(g, m, b, y, null);
          if (typeof b.then == "function") return f(g, m, Cf(b), y);
          if (b.$$typeof === sr) return f(g, m, Lf(g, b), y);
          vf(g, b);
        }
        return null;
      }
      function p(g, m, b, y, C) {
        if (typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint") return g = g.get(b) || null, l(m, g, "" + y, C);
        if (typeof y == "object" && y !== null) {
          switch (y.$$typeof) {
            case pf:
              return g = g.get(y.key === null ? b : y.key) || null, i(m, g, y, C);
            case ji:
              return g = g.get(y.key === null ? b : y.key) || null, u(m, g, y, C);
            case zr:
              return y = Fn(y), p(g, m, b, y, C);
          }
          if (Xi(y) || Ui(y)) return g = g.get(b) || null, c(m, g, y, C, null);
          if (typeof y.then == "function") return p(g, m, b, Cf(y), C);
          if (y.$$typeof === sr) return p(g, m, b, Lf(m, y), C);
          vf(m, y);
        }
        return null;
      }
      function x(g, m, b, y) {
        for (var C = null, D = null, I = m, w = m = 0, M = null; I !== null && w < b.length; w++) {
          I.index > w ? (M = I, I = null) : M = I.sibling;
          var T = f(g, I, b[w], y);
          if (T === null) {
            I === null && (I = M);
            break;
          }
          e && I && T.alternate === null && t(g, I), m = n(T, m, w), D === null ? C = T : D.sibling = T, D = T, I = M;
        }
        if (w === b.length) return a(g, I), De && rr(g, w), C;
        if (I === null) {
          for (; w < b.length; w++) I = d(g, b[w], y), I !== null && (m = n(I, m, w), D === null ? C = I : D.sibling = I, D = I);
          return De && rr(g, w), C;
        }
        for (I = o(I); w < b.length; w++) M = p(I, g, w, b[w], y), M !== null && (e && M.alternate !== null && I.delete(M.key === null ? w : M.key), m = n(M, m, w), D === null ? C = M : D.sibling = M, D = M);
        return e && I.forEach(function(K) {
          return t(g, K);
        }), De && rr(g, w), C;
      }
      function S(g, m, b, y) {
        if (b == null) throw Error(B(151));
        for (var C = null, D = null, I = m, w = m = 0, M = null, T = b.next(); I !== null && !T.done; w++, T = b.next()) {
          I.index > w ? (M = I, I = null) : M = I.sibling;
          var K = f(g, I, T.value, y);
          if (K === null) {
            I === null && (I = M);
            break;
          }
          e && I && K.alternate === null && t(g, I), m = n(K, m, w), D === null ? C = K : D.sibling = K, D = K, I = M;
        }
        if (T.done) return a(g, I), De && rr(g, w), C;
        if (I === null) {
          for (; !T.done; w++, T = b.next()) T = d(g, T.value, y), T !== null && (m = n(T, m, w), D === null ? C = T : D.sibling = T, D = T);
          return De && rr(g, w), C;
        }
        for (I = o(I); !T.done; w++, T = b.next()) T = p(I, g, w, T.value, y), T !== null && (e && T.alternate !== null && I.delete(T.key === null ? w : T.key), m = n(T, m, w), D === null ? C = T : D.sibling = T, D = T);
        return e && I.forEach(function(z) {
          return t(g, z);
        }), De && rr(g, w), C;
      }
      function v(g, m, b, y) {
        if (typeof b == "object" && b !== null && b.type === al && b.key === null && (b = b.props.children), typeof b == "object" && b !== null) {
          switch (b.$$typeof) {
            case pf:
              e: {
                for (var C = b.key; m !== null; ) {
                  if (m.key === C) {
                    if (C = b.type, C === al) {
                      if (m.tag === 7) {
                        a(g, m.sibling), y = r(m, b.props.children), y.return = g, g = y;
                        break e;
                      }
                    } else if (m.elementType === C || typeof C == "object" && C !== null && C.$$typeof === zr && Fn(C) === m.type) {
                      a(g, m.sibling), y = r(m, b.props), zi(y, b), y.return = g, g = y;
                      break e;
                    }
                    a(g, m);
                    break;
                  } else t(g, m);
                  m = m.sibling;
                }
                b.type === al ? (y = jn(b.props.children, g.mode, y, b.key), y.return = g, g = y) : (y = _f(b.type, b.key, b.props, null, g.mode, y), zi(y, b), y.return = g, g = y);
              }
              return s(g);
            case ji:
              e: {
                for (C = b.key; m !== null; ) {
                  if (m.key === C) if (m.tag === 4 && m.stateNode.containerInfo === b.containerInfo && m.stateNode.implementation === b.implementation) {
                    a(g, m.sibling), y = r(m, b.children || []), y.return = g, g = y;
                    break e;
                  } else {
                    a(g, m);
                    break;
                  }
                  else t(g, m);
                  m = m.sibling;
                }
                y = Ah(b, g.mode, y), y.return = g, g = y;
              }
              return s(g);
            case zr:
              return b = Fn(b), v(g, m, b, y);
          }
          if (Xi(b)) return x(g, m, b, y);
          if (Ui(b)) {
            if (C = Ui(b), typeof C != "function") throw Error(B(150));
            return b = C.call(b), S(g, m, b, y);
          }
          if (typeof b.then == "function") return v(g, m, Cf(b), y);
          if (b.$$typeof === sr) return v(g, m, Lf(g, b), y);
          vf(g, b);
        }
        return typeof b == "string" && b !== "" || typeof b == "number" || typeof b == "bigint" ? (b = "" + b, m !== null && m.tag === 6 ? (a(g, m.sibling), y = r(m, b), y.return = g, g = y) : (a(g, m), y = Eh(b, g.mode, y), y.return = g, g = y), s(g)) : a(g, m);
      }
      return function(g, m, b, y) {
        try {
          hu = 0;
          var C = v(g, m, b, y);
          return bl = null, C;
        } catch (I) {
          if (I === _l || I === Ad) throw I;
          var D = ja(29, I, null, g.mode);
          return D.lanes = y, D.return = g, D;
        }
      };
    }
    var Qn = mL(true), hL = mL(false), qr = false;
    function ux(e) {
      e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, lanes: 0, hiddenCallbacks: null }, callbacks: null };
    }
    function gg(e, t) {
      e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, callbacks: null });
    }
    function Jr(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function en(e, t, a) {
      var o = e.updateQueue;
      if (o === null) return null;
      if (o = o.shared, (qe & 2) !== 0) {
        var r = o.pending;
        return r === null ? t.next = t : (t.next = r.next, r.next = t), o.pending = t, t = $f(e), sL(e, null, a), t;
      }
      return Ed(e, o, t, a), $f(e);
    }
    function eu(e, t, a) {
      if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
        var o = t.lanes;
        o &= e.pendingLanes, a |= o, t.lanes = a, O1(e, a);
      }
    }
    function kh(e, t) {
      var a = e.updateQueue, o = e.alternate;
      if (o !== null && (o = o.updateQueue, a === o)) {
        var r = null, n = null;
        if (a = a.firstBaseUpdate, a !== null) {
          do {
            var s = { lane: a.lane, tag: a.tag, payload: a.payload, callback: null, next: null };
            n === null ? r = n = s : n = n.next = s, a = a.next;
          } while (a !== null);
          n === null ? r = n = t : n = n.next = t;
        } else r = n = t;
        a = { baseState: o.baseState, firstBaseUpdate: r, lastBaseUpdate: n, shared: o.shared, callbacks: o.callbacks }, e.updateQueue = a;
        return;
      }
      e = a.lastBaseUpdate, e === null ? a.firstBaseUpdate = t : e.next = t, a.lastBaseUpdate = t;
    }
    var xg = false;
    function tu() {
      if (xg) {
        var e = xl;
        if (e !== null) throw e;
      }
    }
    function au(e, t, a, o) {
      xg = false;
      var r = e.updateQueue;
      qr = false;
      var n = r.firstBaseUpdate, s = r.lastBaseUpdate, l = r.shared.pending;
      if (l !== null) {
        r.shared.pending = null;
        var i = l, u = i.next;
        i.next = null, s === null ? n = u : s.next = u, s = i;
        var c = e.alternate;
        c !== null && (c = c.updateQueue, l = c.lastBaseUpdate, l !== s && (l === null ? c.firstBaseUpdate = u : l.next = u, c.lastBaseUpdate = i));
      }
      if (n !== null) {
        var d = r.baseState;
        s = 0, c = u = i = null, l = n;
        do {
          var f = l.lane & -536870913, p = f !== l.lane;
          if (p ? (Re & f) === f : (o & f) === f) {
            f !== 0 && f === wl && (xg = true), c !== null && (c = c.next = { lane: 0, tag: l.tag, payload: l.payload, callback: null, next: null });
            e: {
              var x = e, S = l;
              f = t;
              var v = a;
              switch (S.tag) {
                case 1:
                  if (x = S.payload, typeof x == "function") {
                    d = x.call(v, d, f);
                    break e;
                  }
                  d = x;
                  break e;
                case 3:
                  x.flags = x.flags & -65537 | 128;
                case 0:
                  if (x = S.payload, f = typeof x == "function" ? x.call(v, d, f) : x, f == null) break e;
                  d = dt({}, d, f);
                  break e;
                case 2:
                  qr = true;
              }
            }
            f = l.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = r.callbacks, p === null ? r.callbacks = [f] : p.push(f));
          } else p = { lane: f, tag: l.tag, payload: l.payload, callback: l.callback, next: null }, c === null ? (u = c = p, i = d) : c = c.next = p, s |= f;
          if (l = l.next, l === null) {
            if (l = r.shared.pending, l === null) break;
            p = l, l = p.next, p.next = null, r.lastBaseUpdate = p, r.shared.pending = null;
          }
        } while (true);
        c === null && (i = d), r.baseState = i, r.firstBaseUpdate = u, r.lastBaseUpdate = c, n === null && (r.shared.lanes = 0), cn |= s, e.lanes = s, e.memoizedState = d;
      }
    }
    function gL(e, t) {
      if (typeof e != "function") throw Error(B(191, e));
      e.call(t);
    }
    function xL(e, t) {
      var a = e.callbacks;
      if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) gL(a[e], t);
    }
    var Il = No(null), ad = No(0);
    function ES(e, t) {
      e = gr, nt(ad, e), nt(Il, t), gr = e | t.baseLanes;
    }
    function bg() {
      nt(ad, gr), nt(Il, Il.current);
    }
    function cx() {
      gr = ad.current, Qt(Il), Qt(ad);
    }
    var $a = No(null), po = null;
    function Vr(e) {
      var t = e.alternate;
      nt(kt, kt.current & 1), nt($a, e), po === null && (t === null || Il.current !== null || t.memoizedState !== null) && (po = e);
    }
    function yg(e) {
      nt(kt, kt.current), nt($a, e), po === null && (po = e);
    }
    function bL(e) {
      e.tag === 22 ? (nt(kt, kt.current), nt($a, e), po === null && (po = e)) : Gr(e);
    }
    function Gr() {
      nt(kt, kt.current), nt($a, $a.current);
    }
    function Ga(e) {
      Qt($a), po === e && (po = null), Qt(kt);
    }
    var kt = No(0);
    function od(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var a = t.memoizedState;
          if (a !== null && (a = a.dehydrated, a === null || Ug(a) || Hg(a))) return t;
        } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
          if ((t.flags & 128) !== 0) return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var pr = 0, Se = null, Qe = null, Ot = null, rd = false, yl = false, $n = false, nd = 0, gu = 0, Sl = null, hR = 0;
    function wt() {
      throw Error(B(321));
    }
    function fx(e, t) {
      if (t === null) return false;
      for (var a = 0; a < t.length && a < e.length; a++) if (!Qa(e[a], t[a])) return false;
      return true;
    }
    function dx(e, t, a, o, r, n) {
      return pr = n, Se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, fe.H = e === null || e.memoizedState === null ? ZL : vx, $n = false, n = a(o, r), $n = false, yl && (n = SL(t, a, o, r)), yL(e), n;
    }
    function yL(e) {
      fe.H = xu;
      var t = Qe !== null && Qe.next !== null;
      if (pr = 0, Ot = Qe = Se = null, rd = false, gu = 0, Sl = null, t) throw Error(B(300));
      e === null || Pt || (e = e.dependencies, e !== null && ed(e) && (Pt = true));
    }
    function SL(e, t, a, o) {
      Se = e;
      var r = 0;
      do {
        if (yl && (Sl = null), gu = 0, yl = false, 25 <= r) throw Error(B(301));
        if (r += 1, Ot = Qe = null, e.updateQueue != null) {
          var n = e.updateQueue;
          n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
        }
        fe.H = WL, n = t(a, o);
      } while (yl);
      return n;
    }
    function gR() {
      var e = fe.H, t = e.useState()[0];
      return t = typeof t.then == "function" ? Ru(t) : t, e = e.useState()[0], (Qe !== null ? Qe.memoizedState : null) !== e && (Se.flags |= 1024), t;
    }
    function px() {
      var e = nd !== 0;
      return nd = 0, e;
    }
    function mx(e, t, a) {
      t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a;
    }
    function hx(e) {
      if (rd) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        rd = false;
      }
      pr = 0, Ot = Qe = Se = null, yl = false, gu = nd = 0, Sl = null;
    }
    function Ca() {
      var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      return Ot === null ? Se.memoizedState = Ot = e : Ot = Ot.next = e, Ot;
    }
    function Rt() {
      if (Qe === null) {
        var e = Se.alternate;
        e = e !== null ? e.memoizedState : null;
      } else e = Qe.next;
      var t = Ot === null ? Se.memoizedState : Ot.next;
      if (t !== null) Ot = t, Qe = e;
      else {
        if (e === null) throw Se.alternate === null ? Error(B(467)) : Error(B(310));
        Qe = e, e = { memoizedState: Qe.memoizedState, baseState: Qe.baseState, baseQueue: Qe.baseQueue, queue: Qe.queue, next: null }, Ot === null ? Se.memoizedState = Ot = e : Ot = Ot.next = e;
      }
      return Ot;
    }
    function Td() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function Ru(e) {
      var t = gu;
      return gu += 1, Sl === null && (Sl = []), e = pL(Sl, e, t), t = Se, (Ot === null ? t.memoizedState : Ot.next) === null && (t = t.alternate, fe.H = t === null || t.memoizedState === null ? ZL : vx), e;
    }
    function kd(e) {
      if (e !== null && typeof e == "object") {
        if (typeof e.then == "function") return Ru(e);
        if (e.$$typeof === sr) return ra(e);
      }
      throw Error(B(438, String(e)));
    }
    function gx(e) {
      var t = null, a = Se.updateQueue;
      if (a !== null && (t = a.memoCache), t == null) {
        var o = Se.alternate;
        o !== null && (o = o.updateQueue, o !== null && (o = o.memoCache, o != null && (t = { data: o.data.map(function(r) {
          return r.slice();
        }), index: 0 })));
      }
      if (t == null && (t = { data: [], index: 0 }), a === null && (a = Td(), Se.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0) for (a = t.data[t.index] = Array(e), o = 0; o < e; o++) a[o] = tk;
      return t.index++, a;
    }
    function mr(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Nf(e) {
      var t = Rt();
      return xx(t, Qe, e);
    }
    function xx(e, t, a) {
      var o = e.queue;
      if (o === null) throw Error(B(311));
      o.lastRenderedReducer = a;
      var r = e.baseQueue, n = o.pending;
      if (n !== null) {
        if (r !== null) {
          var s = r.next;
          r.next = n.next, n.next = s;
        }
        t.baseQueue = r = n, o.pending = null;
      }
      if (n = e.baseState, r === null) e.memoizedState = n;
      else {
        t = r.next;
        var l = s = null, i = null, u = t, c = false;
        do {
          var d = u.lane & -536870913;
          if (d !== u.lane ? (Re & d) === d : (pr & d) === d) {
            var f = u.revertLane;
            if (f === 0) i !== null && (i = i.next = { lane: 0, revertLane: 0, gesture: null, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }), d === wl && (c = true);
            else if ((pr & f) === f) {
              u = u.next, f === wl && (c = true);
              continue;
            } else d = { lane: 0, revertLane: u.revertLane, gesture: null, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }, i === null ? (l = i = d, s = n) : i = i.next = d, Se.lanes |= f, cn |= f;
            d = u.action, $n && a(n, d), n = u.hasEagerState ? u.eagerState : a(n, d);
          } else f = { lane: d, revertLane: u.revertLane, gesture: u.gesture, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }, i === null ? (l = i = f, s = n) : i = i.next = f, Se.lanes |= d, cn |= d;
          u = u.next;
        } while (u !== null && u !== t);
        if (i === null ? s = n : i.next = l, !Qa(n, e.memoizedState) && (Pt = true, c && (a = xl, a !== null))) throw a;
        e.memoizedState = n, e.baseState = s, e.baseQueue = i, o.lastRenderedState = n;
      }
      return r === null && (o.lanes = 0), [e.memoizedState, o.dispatch];
    }
    function Rh(e) {
      var t = Rt(), a = t.queue;
      if (a === null) throw Error(B(311));
      a.lastRenderedReducer = e;
      var o = a.dispatch, r = a.pending, n = t.memoizedState;
      if (r !== null) {
        a.pending = null;
        var s = r = r.next;
        do
          n = e(n, s.action), s = s.next;
        while (s !== r);
        Qa(n, t.memoizedState) || (Pt = true), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), a.lastRenderedState = n;
      }
      return [n, o];
    }
    function LL(e, t, a) {
      var o = Se, r = Rt(), n = De;
      if (n) {
        if (a === void 0) throw Error(B(407));
        a = a();
      } else a = t();
      var s = !Qa((Qe || r).memoizedState, a);
      if (s && (r.memoizedState = a, Pt = true), r = r.queue, bx(wL.bind(null, o, r, e), [e]), r.getSnapshot !== t || s || Ot !== null && Ot.memoizedState.tag & 1) {
        if (o.flags |= 2048, El(9, { destroy: void 0 }, vL.bind(null, o, r, a, t), null), at === null) throw Error(B(349));
        n || (pr & 127) !== 0 || CL(o, t, a);
      }
      return a;
    }
    function CL(e, t, a) {
      e.flags |= 16384, e = { getSnapshot: t, value: a }, t = Se.updateQueue, t === null ? (t = Td(), Se.updateQueue = t, t.stores = [e]) : (a = t.stores, a === null ? t.stores = [e] : a.push(e));
    }
    function vL(e, t, a, o) {
      t.value = a, t.getSnapshot = o, IL(t) && EL(e);
    }
    function wL(e, t, a) {
      return a(function() {
        IL(t) && EL(e);
      });
    }
    function IL(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var a = t();
        return !Qa(e, a);
      } catch {
        return true;
      }
    }
    function EL(e) {
      var t = os(e, 2);
      t !== null && Ba(t, e, 2);
    }
    function Sg(e) {
      var t = Ca();
      if (typeof e == "function") {
        var a = e;
        if (e = a(), $n) {
          Xr(true);
          try {
            a();
          } finally {
            Xr(false);
          }
        }
      }
      return t.memoizedState = t.baseState = e, t.queue = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: mr, lastRenderedState: e }, t;
    }
    function AL(e, t, a, o) {
      return e.baseState = a, xx(e, Qe, typeof o == "function" ? o : mr);
    }
    function xR(e, t, a, o, r) {
      if (Md(e)) throw Error(B(485));
      if (e = t.action, e !== null) {
        var n = { payload: r, action: e, next: null, isTransition: true, status: "pending", value: null, reason: null, listeners: [], then: function(s) {
          n.listeners.push(s);
        } };
        fe.T !== null ? a(true) : n.isTransition = false, o(n), a = t.pending, a === null ? (n.next = t.pending = n, TL(t, n)) : (n.next = a.next, t.pending = a.next = n);
      }
    }
    function TL(e, t) {
      var a = t.action, o = t.payload, r = e.state;
      if (t.isTransition) {
        var n = fe.T, s = {};
        fe.T = s;
        try {
          var l = a(r, o), i = fe.S;
          i !== null && i(s, l), AS(e, t, l);
        } catch (u) {
          Lg(e, t, u);
        } finally {
          n !== null && s.types !== null && (n.types = s.types), fe.T = n;
        }
      } else try {
        n = a(r, o), AS(e, t, n);
      } catch (u) {
        Lg(e, t, u);
      }
    }
    function AS(e, t, a) {
      a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(function(o) {
        TS(e, t, o);
      }, function(o) {
        return Lg(e, t, o);
      }) : TS(e, t, a);
    }
    function TS(e, t, a) {
      t.status = "fulfilled", t.value = a, kL(t), e.state = a, t = e.pending, t !== null && (a = t.next, a === t ? e.pending = null : (a = a.next, t.next = a, TL(e, a)));
    }
    function Lg(e, t, a) {
      var o = e.pending;
      if (e.pending = null, o !== null) {
        o = o.next;
        do
          t.status = "rejected", t.reason = a, kL(t), t = t.next;
        while (t !== o);
      }
      e.action = null;
    }
    function kL(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function RL(e, t) {
      return t;
    }
    function kS(e, t) {
      if (De) {
        var a = at.formState;
        if (a !== null) {
          e: {
            var o = Se;
            if (De) {
              if (ft) {
                t: {
                  for (var r = ft, n = fo; r.nodeType !== 8; ) {
                    if (!n) {
                      r = null;
                      break t;
                    }
                    if (r = mo(r.nextSibling), r === null) {
                      r = null;
                      break t;
                    }
                  }
                  n = r.data, r = n === "F!" || n === "F" ? r : null;
                }
                if (r) {
                  ft = mo(r.nextSibling), o = r.data === "F!";
                  break e;
                }
              }
              ln(o);
            }
            o = false;
          }
          o && (t = a[0]);
        }
      }
      return a = Ca(), a.memoizedState = a.baseState = t, o = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: RL, lastRenderedState: t }, a.queue = o, a = XL.bind(null, Se, o), o.dispatch = a, o = Sg(false), n = Cx.bind(null, Se, false, o.queue), o = Ca(), r = { state: t, dispatch: null, action: e, pending: null }, o.queue = r, a = xR.bind(null, Se, r, n, a), r.dispatch = a, o.memoizedState = e, [t, a, false];
    }
    function RS(e) {
      var t = Rt();
      return ML(t, Qe, e);
    }
    function ML(e, t, a) {
      if (t = xx(e, t, RL)[0], e = Nf(mr)[0], typeof t == "object" && t !== null && typeof t.then == "function") try {
        var o = Ru(t);
      } catch (s) {
        throw s === _l ? Ad : s;
      }
      else o = t;
      t = Rt();
      var r = t.queue, n = r.dispatch;
      return a !== t.memoizedState && (Se.flags |= 2048, El(9, { destroy: void 0 }, bR.bind(null, r, a), null)), [o, n, e];
    }
    function bR(e, t) {
      e.action = t;
    }
    function MS(e) {
      var t = Rt(), a = Qe;
      if (a !== null) return ML(t, a, e);
      Rt(), t = t.memoizedState, a = Rt();
      var o = a.queue.dispatch;
      return a.memoizedState = e, [t, o, false];
    }
    function El(e, t, a, o) {
      return e = { tag: e, create: a, deps: o, inst: t, next: null }, t = Se.updateQueue, t === null && (t = Td(), Se.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = e.next = e : (o = a.next, a.next = e, e.next = o, t.lastEffect = e), e;
    }
    function DL() {
      return Rt().memoizedState;
    }
    function Uf(e, t, a, o) {
      var r = Ca();
      Se.flags |= e, r.memoizedState = El(1 | t, { destroy: void 0 }, a, o === void 0 ? null : o);
    }
    function Rd(e, t, a, o) {
      var r = Rt();
      o = o === void 0 ? null : o;
      var n = r.memoizedState.inst;
      Qe !== null && o !== null && fx(o, Qe.memoizedState.deps) ? r.memoizedState = El(t, n, a, o) : (Se.flags |= e, r.memoizedState = El(1 | t, n, a, o));
    }
    function DS(e, t) {
      Uf(8390656, 8, e, t);
    }
    function bx(e, t) {
      Rd(2048, 8, e, t);
    }
    function yR(e) {
      Se.flags |= 4;
      var t = Se.updateQueue;
      if (t === null) t = Td(), Se.updateQueue = t, t.events = [e];
      else {
        var a = t.events;
        a === null ? t.events = [e] : a.push(e);
      }
    }
    function OL(e) {
      var t = Rt().memoizedState;
      return yR({ ref: t, nextImpl: e }), function() {
        if ((qe & 2) !== 0) throw Error(B(440));
        return t.impl.apply(void 0, arguments);
      };
    }
    function BL(e, t) {
      return Rd(4, 2, e, t);
    }
    function _L(e, t) {
      return Rd(4, 4, e, t);
    }
    function PL(e, t) {
      if (typeof t == "function") {
        e = e();
        var a = t(e);
        return function() {
          typeof a == "function" ? a() : t(null);
        };
      }
      if (t != null) return e = e(), t.current = e, function() {
        t.current = null;
      };
    }
    function NL(e, t, a) {
      a = a != null ? a.concat([e]) : null, Rd(4, 4, PL.bind(null, t, e), a);
    }
    function yx() {
    }
    function UL(e, t) {
      var a = Rt();
      t = t === void 0 ? null : t;
      var o = a.memoizedState;
      return t !== null && fx(t, o[1]) ? o[0] : (a.memoizedState = [e, t], e);
    }
    function HL(e, t) {
      var a = Rt();
      t = t === void 0 ? null : t;
      var o = a.memoizedState;
      if (t !== null && fx(t, o[1])) return o[0];
      if (o = e(), $n) {
        Xr(true);
        try {
          e();
        } finally {
          Xr(false);
        }
      }
      return a.memoizedState = [o, t], o;
    }
    function Sx(e, t, a) {
      return a === void 0 || (pr & 1073741824) !== 0 && (Re & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = a, e = AC(), Se.lanes |= e, cn |= e, a);
    }
    function zL(e, t, a, o) {
      return Qa(a, t) ? a : Il.current !== null ? (e = Sx(e, a, o), Qa(e, t) || (Pt = true), e) : (pr & 42) === 0 || (pr & 1073741824) !== 0 && (Re & 261930) === 0 ? (Pt = true, e.memoizedState = a) : (e = AC(), Se.lanes |= e, cn |= e, t);
    }
    function qL(e, t, a, o, r) {
      var n = Fe.p;
      Fe.p = n !== 0 && 8 > n ? n : 8;
      var s = fe.T, l = {};
      fe.T = l, Cx(e, false, t, a);
      try {
        var i = r(), u = fe.S;
        if (u !== null && u(l, i), i !== null && typeof i == "object" && typeof i.then == "function") {
          var c = mR(i, o);
          ou(e, t, c, Wa(e));
        } else ou(e, t, o, Wa(e));
      } catch (d) {
        ou(e, t, { then: function() {
        }, status: "rejected", reason: d }, Wa());
      } finally {
        Fe.p = n, s !== null && l.types !== null && (s.types = l.types), fe.T = s;
      }
    }
    function SR() {
    }
    function Cg(e, t, a, o) {
      if (e.tag !== 5) throw Error(B(476));
      var r = FL(e).queue;
      qL(e, r, t, Gn, a === null ? SR : function() {
        return VL(e), a(o);
      });
    }
    function FL(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = { memoizedState: Gn, baseState: Gn, baseQueue: null, queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: mr, lastRenderedState: Gn }, next: null };
      var a = {};
      return t.next = { memoizedState: a, baseState: a, baseQueue: null, queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: mr, lastRenderedState: a }, next: null }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
    }
    function VL(e) {
      var t = FL(e);
      t.next === null && (t = e.alternate.memoizedState), ou(e, t.next.queue, {}, Wa());
    }
    function Lx() {
      return ra(Su);
    }
    function GL() {
      return Rt().memoizedState;
    }
    function jL() {
      return Rt().memoizedState;
    }
    function LR(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var a = Wa();
            e = Jr(a);
            var o = en(t, e, a);
            o !== null && (Ba(o, t, a), eu(o, t, a)), t = { cache: sx() }, e.payload = t;
            return;
        }
        t = t.return;
      }
    }
    function CR(e, t, a) {
      var o = Wa();
      a = { lane: o, revertLane: 0, gesture: null, action: a, hasEagerState: false, eagerState: null, next: null }, Md(e) ? KL(t, a) : (a = ax(e, t, a, o), a !== null && (Ba(a, e, o), YL(a, t, o)));
    }
    function XL(e, t, a) {
      var o = Wa();
      ou(e, t, a, o);
    }
    function ou(e, t, a, o) {
      var r = { lane: o, revertLane: 0, gesture: null, action: a, hasEagerState: false, eagerState: null, next: null };
      if (Md(e)) KL(t, r);
      else {
        var n = e.alternate;
        if (e.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null)) try {
          var s = t.lastRenderedState, l = n(s, a);
          if (r.hasEagerState = true, r.eagerState = l, Qa(l, s)) return Ed(e, t, r, 0), at === null && Id(), false;
        } catch {
        }
        if (a = ax(e, t, r, o), a !== null) return Ba(a, e, o), YL(a, t, o), true;
      }
      return false;
    }
    function Cx(e, t, a, o) {
      if (o = { lane: 2, revertLane: Mx(), gesture: null, action: o, hasEagerState: false, eagerState: null, next: null }, Md(e)) {
        if (t) throw Error(B(479));
      } else t = ax(e, a, o, 2), t !== null && Ba(t, e, 2);
    }
    function Md(e) {
      var t = e.alternate;
      return e === Se || t !== null && t === Se;
    }
    function KL(e, t) {
      yl = rd = true;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function YL(e, t, a) {
      if ((a & 4194048) !== 0) {
        var o = t.lanes;
        o &= e.pendingLanes, a |= o, t.lanes = a, O1(e, a);
      }
    }
    var xu = { readContext: ra, use: kd, useCallback: wt, useContext: wt, useEffect: wt, useImperativeHandle: wt, useLayoutEffect: wt, useInsertionEffect: wt, useMemo: wt, useReducer: wt, useRef: wt, useState: wt, useDebugValue: wt, useDeferredValue: wt, useTransition: wt, useSyncExternalStore: wt, useId: wt, useHostTransitionStatus: wt, useFormState: wt, useActionState: wt, useOptimistic: wt, useMemoCache: wt, useCacheRefresh: wt };
    xu.useEffectEvent = wt;
    var ZL = { readContext: ra, use: kd, useCallback: function(e, t) {
      return Ca().memoizedState = [e, t === void 0 ? null : t], e;
    }, useContext: ra, useEffect: DS, useImperativeHandle: function(e, t, a) {
      a = a != null ? a.concat([e]) : null, Uf(4194308, 4, PL.bind(null, t, e), a);
    }, useLayoutEffect: function(e, t) {
      return Uf(4194308, 4, e, t);
    }, useInsertionEffect: function(e, t) {
      Uf(4, 2, e, t);
    }, useMemo: function(e, t) {
      var a = Ca();
      t = t === void 0 ? null : t;
      var o = e();
      if ($n) {
        Xr(true);
        try {
          e();
        } finally {
          Xr(false);
        }
      }
      return a.memoizedState = [o, t], o;
    }, useReducer: function(e, t, a) {
      var o = Ca();
      if (a !== void 0) {
        var r = a(t);
        if ($n) {
          Xr(true);
          try {
            a(t);
          } finally {
            Xr(false);
          }
        }
      } else r = t;
      return o.memoizedState = o.baseState = r, e = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: r }, o.queue = e, e = e.dispatch = CR.bind(null, Se, e), [o.memoizedState, e];
    }, useRef: function(e) {
      var t = Ca();
      return e = { current: e }, t.memoizedState = e;
    }, useState: function(e) {
      e = Sg(e);
      var t = e.queue, a = XL.bind(null, Se, t);
      return t.dispatch = a, [e.memoizedState, a];
    }, useDebugValue: yx, useDeferredValue: function(e, t) {
      var a = Ca();
      return Sx(a, e, t);
    }, useTransition: function() {
      var e = Sg(false);
      return e = qL.bind(null, Se, e.queue, true, false), Ca().memoizedState = e, [false, e];
    }, useSyncExternalStore: function(e, t, a) {
      var o = Se, r = Ca();
      if (De) {
        if (a === void 0) throw Error(B(407));
        a = a();
      } else {
        if (a = t(), at === null) throw Error(B(349));
        (Re & 127) !== 0 || CL(o, t, a);
      }
      r.memoizedState = a;
      var n = { value: a, getSnapshot: t };
      return r.queue = n, DS(wL.bind(null, o, n, e), [e]), o.flags |= 2048, El(9, { destroy: void 0 }, vL.bind(null, o, n, a, t), null), a;
    }, useId: function() {
      var e = Ca(), t = at.identifierPrefix;
      if (De) {
        var a = Bo, o = Oo;
        a = (o & ~(1 << 32 - Za(o) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = nd++, 0 < a && (t += "H" + a.toString(32)), t += "_";
      } else a = hR++, t = "_" + t + "r_" + a.toString(32) + "_";
      return e.memoizedState = t;
    }, useHostTransitionStatus: Lx, useFormState: kS, useActionState: kS, useOptimistic: function(e) {
      var t = Ca();
      t.memoizedState = t.baseState = e;
      var a = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: null, lastRenderedState: null };
      return t.queue = a, t = Cx.bind(null, Se, true, a), a.dispatch = t, [e, t];
    }, useMemoCache: gx, useCacheRefresh: function() {
      return Ca().memoizedState = LR.bind(null, Se);
    }, useEffectEvent: function(e) {
      var t = Ca(), a = { impl: e };
      return t.memoizedState = a, function() {
        if ((qe & 2) !== 0) throw Error(B(440));
        return a.impl.apply(void 0, arguments);
      };
    } }, vx = { readContext: ra, use: kd, useCallback: UL, useContext: ra, useEffect: bx, useImperativeHandle: NL, useInsertionEffect: BL, useLayoutEffect: _L, useMemo: HL, useReducer: Nf, useRef: DL, useState: function() {
      return Nf(mr);
    }, useDebugValue: yx, useDeferredValue: function(e, t) {
      var a = Rt();
      return zL(a, Qe.memoizedState, e, t);
    }, useTransition: function() {
      var e = Nf(mr)[0], t = Rt().memoizedState;
      return [typeof e == "boolean" ? e : Ru(e), t];
    }, useSyncExternalStore: LL, useId: GL, useHostTransitionStatus: Lx, useFormState: RS, useActionState: RS, useOptimistic: function(e, t) {
      var a = Rt();
      return AL(a, Qe, e, t);
    }, useMemoCache: gx, useCacheRefresh: jL };
    vx.useEffectEvent = OL;
    var WL = { readContext: ra, use: kd, useCallback: UL, useContext: ra, useEffect: bx, useImperativeHandle: NL, useInsertionEffect: BL, useLayoutEffect: _L, useMemo: HL, useReducer: Rh, useRef: DL, useState: function() {
      return Rh(mr);
    }, useDebugValue: yx, useDeferredValue: function(e, t) {
      var a = Rt();
      return Qe === null ? Sx(a, e, t) : zL(a, Qe.memoizedState, e, t);
    }, useTransition: function() {
      var e = Rh(mr)[0], t = Rt().memoizedState;
      return [typeof e == "boolean" ? e : Ru(e), t];
    }, useSyncExternalStore: LL, useId: GL, useHostTransitionStatus: Lx, useFormState: MS, useActionState: MS, useOptimistic: function(e, t) {
      var a = Rt();
      return Qe !== null ? AL(a, Qe, e, t) : (a.baseState = e, [e, a.queue.dispatch]);
    }, useMemoCache: gx, useCacheRefresh: jL };
    WL.useEffectEvent = OL;
    function Mh(e, t, a, o) {
      t = e.memoizedState, a = a(o, t), a = a == null ? t : dt({}, t, a), e.memoizedState = a, e.lanes === 0 && (e.updateQueue.baseState = a);
    }
    var vg = { enqueueSetState: function(e, t, a) {
      e = e._reactInternals;
      var o = Wa(), r = Jr(o);
      r.payload = t, a != null && (r.callback = a), t = en(e, r, o), t !== null && (Ba(t, e, o), eu(t, e, o));
    }, enqueueReplaceState: function(e, t, a) {
      e = e._reactInternals;
      var o = Wa(), r = Jr(o);
      r.tag = 1, r.payload = t, a != null && (r.callback = a), t = en(e, r, o), t !== null && (Ba(t, e, o), eu(t, e, o));
    }, enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var a = Wa(), o = Jr(a);
      o.tag = 2, t != null && (o.callback = t), t = en(e, o, a), t !== null && (Ba(t, e, a), eu(t, e, a));
    } };
    function OS(e, t, a, o, r, n, s) {
      return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(o, n, s) : t.prototype && t.prototype.isPureReactComponent ? !du(a, o) || !du(r, n) : true;
    }
    function BS(e, t, a, o) {
      e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, o), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, o), t.state !== e && vg.enqueueReplaceState(t, t.state, null);
    }
    function Jn(e, t) {
      var a = t;
      if ("ref" in t) {
        a = {};
        for (var o in t) o !== "ref" && (a[o] = t[o]);
      }
      if (e = e.defaultProps) {
        a === t && (a = dt({}, a));
        for (var r in e) a[r] === void 0 && (a[r] = e[r]);
      }
      return a;
    }
    function QL(e) {
      Qf(e);
    }
    function $L(e) {
      console.error(e);
    }
    function JL(e) {
      Qf(e);
    }
    function sd(e, t) {
      try {
        var a = e.onUncaughtError;
        a(t.value, { componentStack: t.stack });
      } catch (o) {
        setTimeout(function() {
          throw o;
        });
      }
    }
    function _S(e, t, a) {
      try {
        var o = e.onCaughtError;
        o(a.value, { componentStack: a.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
      } catch (r) {
        setTimeout(function() {
          throw r;
        });
      }
    }
    function wg(e, t, a) {
      return a = Jr(a), a.tag = 3, a.payload = { element: null }, a.callback = function() {
        sd(e, t);
      }, a;
    }
    function eC(e) {
      return e = Jr(e), e.tag = 3, e;
    }
    function tC(e, t, a, o) {
      var r = a.type.getDerivedStateFromError;
      if (typeof r == "function") {
        var n = o.value;
        e.payload = function() {
          return r(n);
        }, e.callback = function() {
          _S(t, a, o);
        };
      }
      var s = a.stateNode;
      s !== null && typeof s.componentDidCatch == "function" && (e.callback = function() {
        _S(t, a, o), typeof r != "function" && (tn === null ? tn = /* @__PURE__ */ new Set([this]) : tn.add(this));
        var l = o.stack;
        this.componentDidCatch(o.value, { componentStack: l !== null ? l : "" });
      });
    }
    function vR(e, t, a, o, r) {
      if (a.flags |= 32768, o !== null && typeof o == "object" && typeof o.then == "function") {
        if (t = a.alternate, t !== null && Bl(t, a, r, true), a = $a.current, a !== null) {
          switch (a.tag) {
            case 31:
            case 13:
              return po === null ? fd() : a.alternate === null && It === 0 && (It = 3), a.flags &= -257, a.flags |= 65536, a.lanes = r, o === td ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([o]) : t.add(o), Fh(e, o, r)), false;
            case 22:
              return a.flags |= 65536, o === td ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = { transitions: null, markerInstances: null, retryQueue: /* @__PURE__ */ new Set([o]) }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([o]) : a.add(o)), Fh(e, o, r)), false;
          }
          throw Error(B(435, a.tag));
        }
        return Fh(e, o, r), fd(), false;
      }
      if (De) return t = $a.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = r, o !== fg && (e = Error(B(422), { cause: o }), mu(co(e, a)))) : (o !== fg && (t = Error(B(423), { cause: o }), mu(co(t, a))), e = e.current.alternate, e.flags |= 65536, r &= -r, e.lanes |= r, o = co(o, a), r = wg(e.stateNode, o, r), kh(e, r), It !== 4 && (It = 2)), false;
      var n = Error(B(520), { cause: o });
      if (n = co(n, a), su === null ? su = [n] : su.push(n), It !== 4 && (It = 2), t === null) return true;
      o = co(o, a), a = t;
      do {
        switch (a.tag) {
          case 3:
            return a.flags |= 65536, e = r & -r, a.lanes |= e, e = wg(a.stateNode, o, e), kh(a, e), false;
          case 1:
            if (t = a.type, n = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (tn === null || !tn.has(n)))) return a.flags |= 65536, r &= -r, a.lanes |= r, r = eC(r), tC(r, e, a, o), kh(a, r), false;
        }
        a = a.return;
      } while (a !== null);
      return false;
    }
    var wx = Error(B(461)), Pt = false;
    function ta(e, t, a, o) {
      t.child = e === null ? hL(t, null, a, o) : Qn(t, e.child, a, o);
    }
    function PS(e, t, a, o, r) {
      a = a.render;
      var n = t.ref;
      if ("ref" in o) {
        var s = {};
        for (var l in o) l !== "ref" && (s[l] = o[l]);
      } else s = o;
      return Wn(t), o = dx(e, t, a, s, n, r), l = px(), e !== null && !Pt ? (mx(e, t, r), hr(e, t, r)) : (De && l && rx(t), t.flags |= 1, ta(e, t, o, r), t.child);
    }
    function NS(e, t, a, o, r) {
      if (e === null) {
        var n = a.type;
        return typeof n == "function" && !ox(n) && n.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = n, aC(e, t, n, o, r)) : (e = _f(a.type, null, o, t, t.mode, r), e.ref = t.ref, e.return = t, t.child = e);
      }
      if (n = e.child, !Ix(e, r)) {
        var s = n.memoizedProps;
        if (a = a.compare, a = a !== null ? a : du, a(s, o) && e.ref === t.ref) return hr(e, t, r);
      }
      return t.flags |= 1, e = ur(n, o), e.ref = t.ref, e.return = t, t.child = e;
    }
    function aC(e, t, a, o, r) {
      if (e !== null) {
        var n = e.memoizedProps;
        if (du(n, o) && e.ref === t.ref) if (Pt = false, t.pendingProps = o = n, Ix(e, r)) (e.flags & 131072) !== 0 && (Pt = true);
        else return t.lanes = e.lanes, hr(e, t, r);
      }
      return Ig(e, t, a, o, r);
    }
    function oC(e, t, a, o) {
      var r = o.children, n = e !== null ? e.memoizedState : null;
      if (e === null && t.stateNode === null && (t.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }), o.mode === "hidden") {
        if ((t.flags & 128) !== 0) {
          if (n = n !== null ? n.baseLanes | a : a, e !== null) {
            for (o = t.child = e.child, r = 0; o !== null; ) r = r | o.lanes | o.childLanes, o = o.sibling;
            o = r & ~n;
          } else o = 0, t.child = null;
          return US(e, t, n, a, o);
        }
        if ((a & 536870912) !== 0) t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Pf(t, n !== null ? n.cachePool : null), n !== null ? ES(t, n) : bg(), bL(t);
        else return o = t.lanes = 536870912, US(e, t, n !== null ? n.baseLanes | a : a, a, o);
      } else n !== null ? (Pf(t, n.cachePool), ES(t, n), Gr(t), t.memoizedState = null) : (e !== null && Pf(t, null), bg(), Gr(t));
      return ta(e, t, r, a), t.child;
    }
    function Yi(e, t) {
      return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }), t.sibling;
    }
    function US(e, t, a, o, r) {
      var n = lx();
      return n = n === null ? null : { parent: _t._currentValue, pool: n }, t.memoizedState = { baseLanes: a, cachePool: n }, e !== null && Pf(t, null), bg(), bL(t), e !== null && Bl(e, t, o, true), t.childLanes = r, null;
    }
    function Hf(e, t) {
      return t = ld({ mode: t.mode, children: t.children }, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
    }
    function HS(e, t, a) {
      return Qn(t, e.child, null, a), e = Hf(t, t.pendingProps), e.flags |= 2, Ga(t), t.memoizedState = null, e;
    }
    function wR(e, t, a) {
      var o = t.pendingProps, r = (t.flags & 128) !== 0;
      if (t.flags &= -129, e === null) {
        if (De) {
          if (o.mode === "hidden") return e = Hf(t, o), t.lanes = 536870912, Yi(null, e);
          if (yg(t), (e = ft) ? (e = ZC(e, fo), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = { dehydrated: e, treeContext: sn !== null ? { id: Oo, overflow: Bo } : null, retryLane: 536870912, hydrationErrors: null }, a = iL(e), a.return = t, t.child = a, oa = t, ft = null)) : e = null, e === null) throw ln(t);
          return t.lanes = 536870912, null;
        }
        return Hf(t, o);
      }
      var n = e.memoizedState;
      if (n !== null) {
        var s = n.dehydrated;
        if (yg(t), r) if (t.flags & 256) t.flags &= -257, t = HS(e, t, a);
        else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
        else throw Error(B(558));
        else if (Pt || Bl(e, t, a, false), r = (a & e.childLanes) !== 0, Pt || r) {
          if (o = at, o !== null && (s = B1(o, a), s !== 0 && s !== n.retryLane)) throw n.retryLane = s, os(e, s), Ba(o, e, s), wx;
          fd(), t = HS(e, t, a);
        } else e = n.treeContext, ft = mo(s.nextSibling), oa = t, De = true, $r = null, fo = false, e !== null && cL(t, e), t = Hf(t, o), t.flags |= 4096;
        return t;
      }
      return e = ur(e.child, { mode: o.mode, children: o.children }), e.ref = t.ref, t.child = e, e.return = t, e;
    }
    function zf(e, t) {
      var a = t.ref;
      if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof a != "function" && typeof a != "object") throw Error(B(284));
        (e === null || e.ref !== a) && (t.flags |= 4194816);
      }
    }
    function Ig(e, t, a, o, r) {
      return Wn(t), a = dx(e, t, a, o, void 0, r), o = px(), e !== null && !Pt ? (mx(e, t, r), hr(e, t, r)) : (De && o && rx(t), t.flags |= 1, ta(e, t, a, r), t.child);
    }
    function zS(e, t, a, o, r, n) {
      return Wn(t), t.updateQueue = null, a = SL(t, o, a, r), yL(e), o = px(), e !== null && !Pt ? (mx(e, t, n), hr(e, t, n)) : (De && o && rx(t), t.flags |= 1, ta(e, t, a, n), t.child);
    }
    function qS(e, t, a, o, r) {
      if (Wn(t), t.stateNode === null) {
        var n = cl, s = a.contextType;
        typeof s == "object" && s !== null && (n = ra(s)), n = new a(o, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = vg, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = o, n.state = t.memoizedState, n.refs = {}, ux(t), s = a.contextType, n.context = typeof s == "object" && s !== null ? ra(s) : cl, n.state = t.memoizedState, s = a.getDerivedStateFromProps, typeof s == "function" && (Mh(t, a, s, o), n.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (s = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), s !== n.state && vg.enqueueReplaceState(n, n.state, null), au(t, o, n, r), tu(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), o = true;
      } else if (e === null) {
        n = t.stateNode;
        var l = t.memoizedProps, i = Jn(a, l);
        n.props = i;
        var u = n.context, c = a.contextType;
        s = cl, typeof c == "object" && c !== null && (s = ra(c));
        var d = a.getDerivedStateFromProps;
        c = typeof d == "function" || typeof n.getSnapshotBeforeUpdate == "function", l = t.pendingProps !== l, c || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (l || u !== s) && BS(t, n, o, s), qr = false;
        var f = t.memoizedState;
        n.state = f, au(t, o, n, r), tu(), u = t.memoizedState, l || f !== u || qr ? (typeof d == "function" && (Mh(t, a, d, o), u = t.memoizedState), (i = qr || OS(t, a, i, o, f, u, s)) ? (c || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = o, t.memoizedState = u), n.props = o, n.state = u, n.context = s, o = i) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), o = false);
      } else {
        n = t.stateNode, gg(e, t), s = t.memoizedProps, c = Jn(a, s), n.props = c, d = t.pendingProps, f = n.context, u = a.contextType, i = cl, typeof u == "object" && u !== null && (i = ra(u)), l = a.getDerivedStateFromProps, (u = typeof l == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (s !== d || f !== i) && BS(t, n, o, i), qr = false, f = t.memoizedState, n.state = f, au(t, o, n, r), tu();
        var p = t.memoizedState;
        s !== d || f !== p || qr || e !== null && e.dependencies !== null && ed(e.dependencies) ? (typeof l == "function" && (Mh(t, a, l, o), p = t.memoizedState), (c = qr || OS(t, a, c, o, f, p, i) || e !== null && e.dependencies !== null && ed(e.dependencies)) ? (u || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(o, p, i), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(o, p, i)), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || s === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = o, t.memoizedState = p), n.props = o, n.state = p, n.context = i, o = c) : (typeof n.componentDidUpdate != "function" || s === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), o = false);
      }
      return n = o, zf(e, t), o = (t.flags & 128) !== 0, n || o ? (n = t.stateNode, a = o && typeof a.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, e !== null && o ? (t.child = Qn(t, e.child, null, r), t.child = Qn(t, null, a, r)) : ta(e, t, a, r), t.memoizedState = n.state, e = t.child) : e = hr(e, t, r), e;
    }
    function FS(e, t, a, o) {
      return Zn(), t.flags |= 256, ta(e, t, a, o), t.child;
    }
    var Dh = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
    function Oh(e) {
      return { baseLanes: e, cachePool: dL() };
    }
    function Bh(e, t, a) {
      return e = e !== null ? e.childLanes & ~a : 0, t && (e |= Xa), e;
    }
    function rC(e, t, a) {
      var o = t.pendingProps, r = false, n = (t.flags & 128) !== 0, s;
      if ((s = n) || (s = e !== null && e.memoizedState === null ? false : (kt.current & 2) !== 0), s && (r = true, t.flags &= -129), s = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
        if (De) {
          if (r ? Vr(t) : Gr(t), (e = ft) ? (e = ZC(e, fo), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = { dehydrated: e, treeContext: sn !== null ? { id: Oo, overflow: Bo } : null, retryLane: 536870912, hydrationErrors: null }, a = iL(e), a.return = t, t.child = a, oa = t, ft = null)) : e = null, e === null) throw ln(t);
          return Hg(e) ? t.lanes = 32 : t.lanes = 536870912, null;
        }
        var l = o.children;
        return o = o.fallback, r ? (Gr(t), r = t.mode, l = ld({ mode: "hidden", children: l }, r), o = jn(o, r, a, null), l.return = t, o.return = t, l.sibling = o, t.child = l, o = t.child, o.memoizedState = Oh(a), o.childLanes = Bh(e, s, a), t.memoizedState = Dh, Yi(null, o)) : (Vr(t), Eg(t, l));
      }
      var i = e.memoizedState;
      if (i !== null && (l = i.dehydrated, l !== null)) {
        if (n) t.flags & 256 ? (Vr(t), t.flags &= -257, t = _h(e, t, a)) : t.memoizedState !== null ? (Gr(t), t.child = e.child, t.flags |= 128, t = null) : (Gr(t), l = o.fallback, r = t.mode, o = ld({ mode: "visible", children: o.children }, r), l = jn(l, r, a, null), l.flags |= 2, o.return = t, l.return = t, o.sibling = l, t.child = o, Qn(t, e.child, null, a), o = t.child, o.memoizedState = Oh(a), o.childLanes = Bh(e, s, a), t.memoizedState = Dh, t = Yi(null, o));
        else if (Vr(t), Hg(l)) {
          if (s = l.nextSibling && l.nextSibling.dataset, s) var u = s.dgst;
          s = u, o = Error(B(419)), o.stack = "", o.digest = s, mu({ value: o, source: null, stack: null }), t = _h(e, t, a);
        } else if (Pt || Bl(e, t, a, false), s = (a & e.childLanes) !== 0, Pt || s) {
          if (s = at, s !== null && (o = B1(s, a), o !== 0 && o !== i.retryLane)) throw i.retryLane = o, os(e, o), Ba(s, e, o), wx;
          Ug(l) || fd(), t = _h(e, t, a);
        } else Ug(l) ? (t.flags |= 192, t.child = e.child, t = null) : (e = i.treeContext, ft = mo(l.nextSibling), oa = t, De = true, $r = null, fo = false, e !== null && cL(t, e), t = Eg(t, o.children), t.flags |= 4096);
        return t;
      }
      return r ? (Gr(t), l = o.fallback, r = t.mode, i = e.child, u = i.sibling, o = ur(i, { mode: "hidden", children: o.children }), o.subtreeFlags = i.subtreeFlags & 65011712, u !== null ? l = ur(u, l) : (l = jn(l, r, a, null), l.flags |= 2), l.return = t, o.return = t, o.sibling = l, t.child = o, Yi(null, o), o = t.child, l = e.child.memoizedState, l === null ? l = Oh(a) : (r = l.cachePool, r !== null ? (i = _t._currentValue, r = r.parent !== i ? { parent: i, pool: i } : r) : r = dL(), l = { baseLanes: l.baseLanes | a, cachePool: r }), o.memoizedState = l, o.childLanes = Bh(e, s, a), t.memoizedState = Dh, Yi(e.child, o)) : (Vr(t), a = e.child, e = a.sibling, a = ur(a, { mode: "visible", children: o.children }), a.return = t, a.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = a, t.memoizedState = null, a);
    }
    function Eg(e, t) {
      return t = ld({ mode: "visible", children: t }, e.mode), t.return = e, e.child = t;
    }
    function ld(e, t) {
      return e = ja(22, e, null, t), e.lanes = 0, e;
    }
    function _h(e, t, a) {
      return Qn(t, e.child, null, a), e = Eg(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
    }
    function VS(e, t, a) {
      e.lanes |= t;
      var o = e.alternate;
      o !== null && (o.lanes |= t), pg(e.return, t, a);
    }
    function Ph(e, t, a, o, r, n) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: o, tail: a, tailMode: r, treeForkCount: n } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = o, s.tail = a, s.tailMode = r, s.treeForkCount = n);
    }
    function nC(e, t, a) {
      var o = t.pendingProps, r = o.revealOrder, n = o.tail;
      o = o.children;
      var s = kt.current, l = (s & 2) !== 0;
      if (l ? (s = s & 1 | 2, t.flags |= 128) : s &= 1, nt(kt, s), ta(e, t, o, a), o = De ? pu : 0, !l && e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && VS(e, a, t);
        else if (e.tag === 19) VS(e, a, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      switch (r) {
        case "forwards":
          for (a = t.child, r = null; a !== null; ) e = a.alternate, e !== null && od(e) === null && (r = a), a = a.sibling;
          a = r, a === null ? (r = t.child, t.child = null) : (r = a.sibling, a.sibling = null), Ph(t, false, r, a, n, o);
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (a = null, r = t.child, t.child = null; r !== null; ) {
            if (e = r.alternate, e !== null && od(e) === null) {
              t.child = r;
              break;
            }
            e = r.sibling, r.sibling = a, a = r, r = e;
          }
          Ph(t, true, a, null, n, o);
          break;
        case "together":
          Ph(t, false, null, null, void 0, o);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function hr(e, t, a) {
      if (e !== null && (t.dependencies = e.dependencies), cn |= t.lanes, (a & t.childLanes) === 0) if (e !== null) {
        if (Bl(e, t, a, false), (a & t.childLanes) === 0) return null;
      } else return null;
      if (e !== null && t.child !== e.child) throw Error(B(153));
      if (t.child !== null) {
        for (e = t.child, a = ur(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null; ) e = e.sibling, a = a.sibling = ur(e, e.pendingProps), a.return = t;
        a.sibling = null;
      }
      return t.child;
    }
    function Ix(e, t) {
      return (e.lanes & t) !== 0 ? true : (e = e.dependencies, !!(e !== null && ed(e)));
    }
    function IR(e, t, a) {
      switch (t.tag) {
        case 3:
          Kf(t, t.stateNode.containerInfo), Fr(t, _t, e.memoizedState.cache), Zn();
          break;
        case 27:
        case 5:
          eg(t);
          break;
        case 4:
          Kf(t, t.stateNode.containerInfo);
          break;
        case 10:
          Fr(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return t.flags |= 128, yg(t), null;
          break;
        case 13:
          var o = t.memoizedState;
          if (o !== null) return o.dehydrated !== null ? (Vr(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? rC(e, t, a) : (Vr(t), e = hr(e, t, a), e !== null ? e.sibling : null);
          Vr(t);
          break;
        case 19:
          var r = (e.flags & 128) !== 0;
          if (o = (a & t.childLanes) !== 0, o || (Bl(e, t, a, false), o = (a & t.childLanes) !== 0), r) {
            if (o) return nC(e, t, a);
            t.flags |= 128;
          }
          if (r = t.memoizedState, r !== null && (r.rendering = null, r.tail = null, r.lastEffect = null), nt(kt, kt.current), o) break;
          return null;
        case 22:
          return t.lanes = 0, oC(e, t, a, t.pendingProps);
        case 24:
          Fr(t, _t, e.memoizedState.cache);
      }
      return hr(e, t, a);
    }
    function sC(e, t, a) {
      if (e !== null) if (e.memoizedProps !== t.pendingProps) Pt = true;
      else {
        if (!Ix(e, a) && (t.flags & 128) === 0) return Pt = false, IR(e, t, a);
        Pt = (e.flags & 131072) !== 0;
      }
      else Pt = false, De && (t.flags & 1048576) !== 0 && uL(t, pu, t.index);
      switch (t.lanes = 0, t.tag) {
        case 16:
          e: {
            var o = t.pendingProps;
            if (e = Fn(t.elementType), t.type = e, typeof e == "function") ox(e) ? (o = Jn(e, o), t.tag = 1, t = qS(null, t, e, o, a)) : (t.tag = 0, t = Ig(null, t, e, o, a));
            else {
              if (e != null) {
                var r = e.$$typeof;
                if (r === Vg) {
                  t.tag = 11, t = PS(null, t, e, o, a);
                  break e;
                } else if (r === Gg) {
                  t.tag = 14, t = NS(null, t, e, o, a);
                  break e;
                }
              }
              throw t = $h(e) || e, Error(B(306, t, ""));
            }
          }
          return t;
        case 0:
          return Ig(e, t, t.type, t.pendingProps, a);
        case 1:
          return o = t.type, r = Jn(o, t.pendingProps), qS(e, t, o, r, a);
        case 3:
          e: {
            if (Kf(t, t.stateNode.containerInfo), e === null) throw Error(B(387));
            o = t.pendingProps;
            var n = t.memoizedState;
            r = n.element, gg(e, t), au(t, o, null, a);
            var s = t.memoizedState;
            if (o = s.cache, Fr(t, _t, o), o !== n.cache && mg(t, [_t], a, true), tu(), o = s.element, n.isDehydrated) if (n = { element: o, isDehydrated: false, cache: s.cache }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = FS(e, t, o, a);
              break e;
            } else if (o !== r) {
              r = co(Error(B(424)), t), mu(r), t = FS(e, t, o, a);
              break e;
            } else for (e = t.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, ft = mo(e.firstChild), oa = t, De = true, $r = null, fo = true, a = hL(t, null, o, a), t.child = a; a; ) a.flags = a.flags & -3 | 4096, a = a.sibling;
            else {
              if (Zn(), o === r) {
                t = hr(e, t, a);
                break e;
              }
              ta(e, t, o, a);
            }
            t = t.child;
          }
          return t;
        case 26:
          return zf(e, t), e === null ? (a = f1(t.type, null, t.pendingProps, null)) ? t.memoizedState = a : De || (a = t.type, e = t.pendingProps, o = hd(Qr.current).createElement(a), o[aa] = t, o[_a] = e, na(o, a, e), Wt(o), t.stateNode = o) : t.memoizedState = f1(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
        case 27:
          return eg(t), e === null && De && (o = t.stateNode = WC(t.type, t.pendingProps, Qr.current), oa = t, fo = true, r = ft, dn(t.type) ? (zg = r, ft = mo(o.firstChild)) : ft = r), ta(e, t, t.pendingProps.children, a), zf(e, t), e === null && (t.flags |= 4194304), t.child;
        case 5:
          return e === null && De && ((r = o = ft) && (o = JR(o, t.type, t.pendingProps, fo), o !== null ? (t.stateNode = o, oa = t, ft = mo(o.firstChild), fo = false, r = true) : r = false), r || ln(t)), eg(t), r = t.type, n = t.pendingProps, s = e !== null ? e.memoizedProps : null, o = n.children, Pg(r, n) ? o = null : s !== null && Pg(r, s) && (t.flags |= 32), t.memoizedState !== null && (r = dx(e, t, gR, null, null, a), Su._currentValue = r), zf(e, t), ta(e, t, o, a), t.child;
        case 6:
          return e === null && De && ((e = a = ft) && (a = eM(a, t.pendingProps, fo), a !== null ? (t.stateNode = a, oa = t, ft = null, e = true) : e = false), e || ln(t)), null;
        case 13:
          return rC(e, t, a);
        case 4:
          return Kf(t, t.stateNode.containerInfo), o = t.pendingProps, e === null ? t.child = Qn(t, null, o, a) : ta(e, t, o, a), t.child;
        case 11:
          return PS(e, t, t.type, t.pendingProps, a);
        case 7:
          return ta(e, t, t.pendingProps, a), t.child;
        case 8:
          return ta(e, t, t.pendingProps.children, a), t.child;
        case 12:
          return ta(e, t, t.pendingProps.children, a), t.child;
        case 10:
          return o = t.pendingProps, Fr(t, t.type, o.value), ta(e, t, o.children, a), t.child;
        case 9:
          return r = t.type._context, o = t.pendingProps.children, Wn(t), r = ra(r), o = o(r), t.flags |= 1, ta(e, t, o, a), t.child;
        case 14:
          return NS(e, t, t.type, t.pendingProps, a);
        case 15:
          return aC(e, t, t.type, t.pendingProps, a);
        case 19:
          return nC(e, t, a);
        case 31:
          return wR(e, t, a);
        case 22:
          return oC(e, t, a, t.pendingProps);
        case 24:
          return Wn(t), o = ra(_t), e === null ? (r = lx(), r === null && (r = at, n = sx(), r.pooledCache = n, n.refCount++, n !== null && (r.pooledCacheLanes |= a), r = n), t.memoizedState = { parent: o, cache: r }, ux(t), Fr(t, _t, r)) : ((e.lanes & a) !== 0 && (gg(e, t), au(t, null, null, a), tu()), r = e.memoizedState, n = t.memoizedState, r.parent !== o ? (r = { parent: o, cache: o }, t.memoizedState = r, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = r), Fr(t, _t, o)) : (o = n.cache, Fr(t, _t, o), o !== r.cache && mg(t, [_t], a, true))), ta(e, t, t.pendingProps.children, a), t.child;
        case 29:
          throw t.pendingProps;
      }
      throw Error(B(156, t.tag));
    }
    function er(e) {
      e.flags |= 4;
    }
    function Nh(e, t, a, o, r) {
      if ((t = (e.mode & 32) !== 0) && (t = false), t) {
        if (e.flags |= 16777216, (r & 335544128) === r) if (e.stateNode.complete) e.flags |= 8192;
        else if (RC()) e.flags |= 8192;
        else throw Kn = td, ix;
      } else e.flags &= -16777217;
    }
    function GS(e, t) {
      if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
      else if (e.flags |= 16777216, !JC(t)) if (RC()) e.flags |= 8192;
      else throw Kn = td, ix;
    }
    function wf(e, t) {
      t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? M1() : 536870912, e.lanes |= t, Al |= t);
    }
    function qi(e, t) {
      if (!De) switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var a = null; t !== null; ) t.alternate !== null && (a = t), t = t.sibling;
          a === null ? e.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = e.tail;
          for (var o = null; a !== null; ) a.alternate !== null && (o = a), a = a.sibling;
          o === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : o.sibling = null;
      }
    }
    function ct(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = 0, o = 0;
      if (t) for (var r = e.child; r !== null; ) a |= r.lanes | r.childLanes, o |= r.subtreeFlags & 65011712, o |= r.flags & 65011712, r.return = e, r = r.sibling;
      else for (r = e.child; r !== null; ) a |= r.lanes | r.childLanes, o |= r.subtreeFlags, o |= r.flags, r.return = e, r = r.sibling;
      return e.subtreeFlags |= o, e.childLanes = a, t;
    }
    function ER(e, t, a) {
      var o = t.pendingProps;
      switch (nx(t), t.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return ct(t), null;
        case 1:
          return ct(t), null;
        case 3:
          return a = t.stateNode, o = null, e !== null && (o = e.memoizedState.cache), t.memoizedState.cache !== o && (t.flags |= 2048), cr(_t), Ll(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (e === null || e.child === null) && ($s(t) ? er(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Th())), ct(t), null;
        case 26:
          var r = t.type, n = t.memoizedState;
          return e === null ? (er(t), n !== null ? (ct(t), GS(t, n)) : (ct(t), Nh(t, r, null, o, a))) : n ? n !== e.memoizedState ? (er(t), ct(t), GS(t, n)) : (ct(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== o && er(t), ct(t), Nh(t, r, e, o, a)), null;
        case 27:
          if (Yf(t), a = Qr.current, r = t.type, e !== null && t.stateNode != null) e.memoizedProps !== o && er(t);
          else {
            if (!o) {
              if (t.stateNode === null) throw Error(B(166));
              return ct(t), null;
            }
            e = Po.current, $s(t) ? yS(t, e) : (e = WC(r, o, a), t.stateNode = e, er(t));
          }
          return ct(t), null;
        case 5:
          if (Yf(t), r = t.type, e !== null && t.stateNode != null) e.memoizedProps !== o && er(t);
          else {
            if (!o) {
              if (t.stateNode === null) throw Error(B(166));
              return ct(t), null;
            }
            if (n = Po.current, $s(t)) yS(t, n);
            else {
              var s = hd(Qr.current);
              switch (n) {
                case 1:
                  n = s.createElementNS("http://www.w3.org/2000/svg", r);
                  break;
                case 2:
                  n = s.createElementNS("http://www.w3.org/1998/Math/MathML", r);
                  break;
                default:
                  switch (r) {
                    case "svg":
                      n = s.createElementNS("http://www.w3.org/2000/svg", r);
                      break;
                    case "math":
                      n = s.createElementNS("http://www.w3.org/1998/Math/MathML", r);
                      break;
                    case "script":
                      n = s.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild);
                      break;
                    case "select":
                      n = typeof o.is == "string" ? s.createElement("select", { is: o.is }) : s.createElement("select"), o.multiple ? n.multiple = true : o.size && (n.size = o.size);
                      break;
                    default:
                      n = typeof o.is == "string" ? s.createElement(r, { is: o.is }) : s.createElement(r);
                  }
              }
              n[aa] = t, n[_a] = o;
              e: for (s = t.child; s !== null; ) {
                if (s.tag === 5 || s.tag === 6) n.appendChild(s.stateNode);
                else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                  s.child.return = s, s = s.child;
                  continue;
                }
                if (s === t) break e;
                for (; s.sibling === null; ) {
                  if (s.return === null || s.return === t) break e;
                  s = s.return;
                }
                s.sibling.return = s.return, s = s.sibling;
              }
              t.stateNode = n;
              e: switch (na(n, r, o), r) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = true;
                  break e;
                default:
                  o = false;
              }
              o && er(t);
            }
          }
          return ct(t), Nh(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a), null;
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== o && er(t);
          else {
            if (typeof o != "string" && t.stateNode === null) throw Error(B(166));
            if (e = Qr.current, $s(t)) {
              if (e = t.stateNode, a = t.memoizedProps, o = null, r = oa, r !== null) switch (r.tag) {
                case 27:
                case 5:
                  o = r.memoizedProps;
              }
              e[aa] = t, e = !!(e.nodeValue === a || o !== null && o.suppressHydrationWarning === true || XC(e.nodeValue, a)), e || ln(t, true);
            } else e = hd(e).createTextNode(o), e[aa] = t, t.stateNode = e;
          }
          return ct(t), null;
        case 31:
          if (a = t.memoizedState, e === null || e.memoizedState !== null) {
            if (o = $s(t), a !== null) {
              if (e === null) {
                if (!o) throw Error(B(318));
                if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(B(557));
                e[aa] = t;
              } else Zn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              ct(t), e = false;
            } else a = Th(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), e = true;
            if (!e) return t.flags & 256 ? (Ga(t), t) : (Ga(t), null);
            if ((t.flags & 128) !== 0) throw Error(B(558));
          }
          return ct(t), null;
        case 13:
          if (o = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            if (r = $s(t), o !== null && o.dehydrated !== null) {
              if (e === null) {
                if (!r) throw Error(B(318));
                if (r = t.memoizedState, r = r !== null ? r.dehydrated : null, !r) throw Error(B(317));
                r[aa] = t;
              } else Zn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              ct(t), r = false;
            } else r = Th(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = r), r = true;
            if (!r) return t.flags & 256 ? (Ga(t), t) : (Ga(t), null);
          }
          return Ga(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = o !== null, e = e !== null && e.memoizedState !== null, a && (o = t.child, r = null, o.alternate !== null && o.alternate.memoizedState !== null && o.alternate.memoizedState.cachePool !== null && (r = o.alternate.memoizedState.cachePool.pool), n = null, o.memoizedState !== null && o.memoizedState.cachePool !== null && (n = o.memoizedState.cachePool.pool), n !== r && (o.flags |= 2048)), a !== e && a && (t.child.flags |= 8192), wf(t, t.updateQueue), ct(t), null);
        case 4:
          return Ll(), e === null && Dx(t.stateNode.containerInfo), ct(t), null;
        case 10:
          return cr(t.type), ct(t), null;
        case 19:
          if (Qt(kt), o = t.memoizedState, o === null) return ct(t), null;
          if (r = (t.flags & 128) !== 0, n = o.rendering, n === null) if (r) qi(o, false);
          else {
            if (It !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
              if (n = od(e), n !== null) {
                for (t.flags |= 128, qi(o, false), e = n.updateQueue, t.updateQueue = e, wf(t, e), t.subtreeFlags = 0, e = a, a = t.child; a !== null; ) lL(a, e), a = a.sibling;
                return nt(kt, kt.current & 1 | 2), De && rr(t, o.treeForkCount), t.child;
              }
              e = e.sibling;
            }
            o.tail !== null && Ka() > ud && (t.flags |= 128, r = true, qi(o, false), t.lanes = 4194304);
          }
          else {
            if (!r) if (e = od(n), e !== null) {
              if (t.flags |= 128, r = true, e = e.updateQueue, t.updateQueue = e, wf(t, e), qi(o, true), o.tail === null && o.tailMode === "hidden" && !n.alternate && !De) return ct(t), null;
            } else 2 * Ka() - o.renderingStartTime > ud && a !== 536870912 && (t.flags |= 128, r = true, qi(o, false), t.lanes = 4194304);
            o.isBackwards ? (n.sibling = t.child, t.child = n) : (e = o.last, e !== null ? e.sibling = n : t.child = n, o.last = n);
          }
          return o.tail !== null ? (e = o.tail, o.rendering = e, o.tail = e.sibling, o.renderingStartTime = Ka(), e.sibling = null, a = kt.current, nt(kt, r ? a & 1 | 2 : a & 1), De && rr(t, o.treeForkCount), e) : (ct(t), null);
        case 22:
        case 23:
          return Ga(t), cx(), o = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== o && (t.flags |= 8192) : o && (t.flags |= 8192), o ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (ct(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ct(t), a = t.updateQueue, a !== null && wf(t, a.retryQueue), a = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), o = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (o = t.memoizedState.cachePool.pool), o !== a && (t.flags |= 2048), e !== null && Qt(Xn), null;
        case 24:
          return a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), cr(_t), ct(t), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(B(156, t.tag));
    }
    function AR(e, t) {
      switch (nx(t), t.tag) {
        case 1:
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 3:
          return cr(_t), Ll(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
        case 26:
        case 27:
        case 5:
          return Yf(t), null;
        case 31:
          if (t.memoizedState !== null) {
            if (Ga(t), t.alternate === null) throw Error(B(340));
            Zn();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 13:
          if (Ga(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
            if (t.alternate === null) throw Error(B(340));
            Zn();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 19:
          return Qt(kt), null;
        case 4:
          return Ll(), null;
        case 10:
          return cr(t.type), null;
        case 22:
        case 23:
          return Ga(t), cx(), e !== null && Qt(Xn), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 24:
          return cr(_t), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function lC(e, t) {
      switch (nx(t), t.tag) {
        case 3:
          cr(_t), Ll();
          break;
        case 26:
        case 27:
        case 5:
          Yf(t);
          break;
        case 4:
          Ll();
          break;
        case 31:
          t.memoizedState !== null && Ga(t);
          break;
        case 13:
          Ga(t);
          break;
        case 19:
          Qt(kt);
          break;
        case 10:
          cr(t.type);
          break;
        case 22:
        case 23:
          Ga(t), cx(), e !== null && Qt(Xn);
          break;
        case 24:
          cr(_t);
      }
    }
    function Mu(e, t) {
      try {
        var a = t.updateQueue, o = a !== null ? a.lastEffect : null;
        if (o !== null) {
          var r = o.next;
          a = r;
          do {
            if ((a.tag & e) === e) {
              o = void 0;
              var n = a.create, s = a.inst;
              o = n(), s.destroy = o;
            }
            a = a.next;
          } while (a !== r);
        }
      } catch (l) {
        Ze(t, t.return, l);
      }
    }
    function un(e, t, a) {
      try {
        var o = t.updateQueue, r = o !== null ? o.lastEffect : null;
        if (r !== null) {
          var n = r.next;
          o = n;
          do {
            if ((o.tag & e) === e) {
              var s = o.inst, l = s.destroy;
              if (l !== void 0) {
                s.destroy = void 0, r = t;
                var i = a, u = l;
                try {
                  u();
                } catch (c) {
                  Ze(r, i, c);
                }
              }
            }
            o = o.next;
          } while (o !== n);
        }
      } catch (c) {
        Ze(t, t.return, c);
      }
    }
    function iC(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var a = e.stateNode;
        try {
          xL(t, a);
        } catch (o) {
          Ze(e, e.return, o);
        }
      }
    }
    function uC(e, t, a) {
      a.props = Jn(e.type, e.memoizedProps), a.state = e.memoizedState;
      try {
        a.componentWillUnmount();
      } catch (o) {
        Ze(e, t, o);
      }
    }
    function ru(e, t) {
      try {
        var a = e.ref;
        if (a !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var o = e.stateNode;
              break;
            case 30:
              o = e.stateNode;
              break;
            default:
              o = e.stateNode;
          }
          typeof a == "function" ? e.refCleanup = a(o) : a.current = o;
        }
      } catch (r) {
        Ze(e, t, r);
      }
    }
    function _o(e, t) {
      var a = e.ref, o = e.refCleanup;
      if (a !== null) if (typeof o == "function") try {
        o();
      } catch (r) {
        Ze(e, t, r);
      } finally {
        e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
      }
      else if (typeof a == "function") try {
        a(null);
      } catch (r) {
        Ze(e, t, r);
      }
      else a.current = null;
    }
    function cC(e) {
      var t = e.type, a = e.memoizedProps, o = e.stateNode;
      try {
        e: switch (t) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            a.autoFocus && o.focus();
            break e;
          case "img":
            a.src ? o.src = a.src : a.srcSet && (o.srcset = a.srcSet);
        }
      } catch (r) {
        Ze(e, e.return, r);
      }
    }
    function Uh(e, t, a) {
      try {
        var o = e.stateNode;
        KR(o, e.type, a, t), o[_a] = t;
      } catch (r) {
        Ze(e, e.return, r);
      }
    }
    function fC(e) {
      return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && dn(e.type) || e.tag === 4;
    }
    function Hh(e) {
      e: for (; ; ) {
        for (; e.sibling === null; ) {
          if (e.return === null || fC(e.return)) return null;
          e = e.return;
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
          if (e.tag === 27 && dn(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
          e.child.return = e, e = e.child;
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Ag(e, t, a) {
      var o = e.tag;
      if (o === 5 || o === 6) e = e.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(e, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(e), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = lr));
      else if (o !== 4 && (o === 27 && dn(e.type) && (a = e.stateNode, t = null), e = e.child, e !== null)) for (Ag(e, t, a), e = e.sibling; e !== null; ) Ag(e, t, a), e = e.sibling;
    }
    function id(e, t, a) {
      var o = e.tag;
      if (o === 5 || o === 6) e = e.stateNode, t ? a.insertBefore(e, t) : a.appendChild(e);
      else if (o !== 4 && (o === 27 && dn(e.type) && (a = e.stateNode), e = e.child, e !== null)) for (id(e, t, a), e = e.sibling; e !== null; ) id(e, t, a), e = e.sibling;
    }
    function dC(e) {
      var t = e.stateNode, a = e.memoizedProps;
      try {
        for (var o = e.type, r = t.attributes; r.length; ) t.removeAttributeNode(r[0]);
        na(t, o, a), t[aa] = e, t[_a] = a;
      } catch (n) {
        Ze(e, e.return, n);
      }
    }
    var nr = false, Bt = false, zh = false, jS = typeof WeakSet == "function" ? WeakSet : Set, Zt = null;
    function TR(e, t) {
      if (e = e.containerInfo, Bg = yd, e = J1(e), ex(e)) {
        if ("selectionStart" in e) var a = { start: e.selectionStart, end: e.selectionEnd };
        else e: {
          a = (a = e.ownerDocument) && a.defaultView || window;
          var o = a.getSelection && a.getSelection();
          if (o && o.rangeCount !== 0) {
            a = o.anchorNode;
            var r = o.anchorOffset, n = o.focusNode;
            o = o.focusOffset;
            try {
              a.nodeType, n.nodeType;
            } catch {
              a = null;
              break e;
            }
            var s = 0, l = -1, i = -1, u = 0, c = 0, d = e, f = null;
            t: for (; ; ) {
              for (var p; d !== a || r !== 0 && d.nodeType !== 3 || (l = s + r), d !== n || o !== 0 && d.nodeType !== 3 || (i = s + o), d.nodeType === 3 && (s += d.nodeValue.length), (p = d.firstChild) !== null; ) f = d, d = p;
              for (; ; ) {
                if (d === e) break t;
                if (f === a && ++u === r && (l = s), f === n && ++c === o && (i = s), (p = d.nextSibling) !== null) break;
                d = f, f = d.parentNode;
              }
              d = p;
            }
            a = l === -1 || i === -1 ? null : { start: l, end: i };
          } else a = null;
        }
        a = a || { start: 0, end: 0 };
      } else a = null;
      for (_g = { focusedElem: e, selectionRange: a }, yd = false, Zt = t; Zt !== null; ) if (t = Zt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, Zt = e;
      else for (; Zt !== null; ) {
        switch (t = Zt, n = t.alternate, e = t.flags, t.tag) {
          case 0:
            if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null)) for (a = 0; a < e.length; a++) r = e[a], r.ref.impl = r.nextImpl;
            break;
          case 11:
          case 15:
            break;
          case 1:
            if ((e & 1024) !== 0 && n !== null) {
              e = void 0, a = t, r = n.memoizedProps, n = n.memoizedState, o = a.stateNode;
              try {
                var x = Jn(a.type, r);
                e = o.getSnapshotBeforeUpdate(x, n), o.__reactInternalSnapshotBeforeUpdate = e;
              } catch (S) {
                Ze(a, a.return, S);
              }
            }
            break;
          case 3:
            if ((e & 1024) !== 0) {
              if (e = t.stateNode.containerInfo, a = e.nodeType, a === 9) Ng(e);
              else if (a === 1) switch (e.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Ng(e);
                  break;
                default:
                  e.textContent = "";
              }
            }
            break;
          case 5:
          case 26:
          case 27:
          case 6:
          case 4:
          case 17:
            break;
          default:
            if ((e & 1024) !== 0) throw Error(B(163));
        }
        if (e = t.sibling, e !== null) {
          e.return = t.return, Zt = e;
          break;
        }
        Zt = t.return;
      }
    }
    function pC(e, t, a) {
      var o = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          ar(e, a), o & 4 && Mu(5, a);
          break;
        case 1:
          if (ar(e, a), o & 4) if (e = a.stateNode, t === null) try {
            e.componentDidMount();
          } catch (s) {
            Ze(a, a.return, s);
          }
          else {
            var r = Jn(a.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(r, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (s) {
              Ze(a, a.return, s);
            }
          }
          o & 64 && iC(a), o & 512 && ru(a, a.return);
          break;
        case 3:
          if (ar(e, a), o & 64 && (e = a.updateQueue, e !== null)) {
            if (t = null, a.child !== null) switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
            try {
              xL(e, t);
            } catch (s) {
              Ze(a, a.return, s);
            }
          }
          break;
        case 27:
          t === null && o & 4 && dC(a);
        case 26:
        case 5:
          ar(e, a), t === null && o & 4 && cC(a), o & 512 && ru(a, a.return);
          break;
        case 12:
          ar(e, a);
          break;
        case 31:
          ar(e, a), o & 4 && gC(e, a);
          break;
        case 13:
          ar(e, a), o & 4 && xC(e, a), o & 64 && (e = a.memoizedState, e !== null && (e = e.dehydrated, e !== null && (a = NR.bind(null, a), tM(e, a))));
          break;
        case 22:
          if (o = a.memoizedState !== null || nr, !o) {
            t = t !== null && t.memoizedState !== null || Bt, r = nr;
            var n = Bt;
            nr = o, (Bt = t) && !n ? or(e, a, (a.subtreeFlags & 8772) !== 0) : ar(e, a), nr = r, Bt = n;
          }
          break;
        case 30:
          break;
        default:
          ar(e, a);
      }
    }
    function mC(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, mC(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Yg(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
    }
    var bt = null, Da = false;
    function tr(e, t, a) {
      for (a = a.child; a !== null; ) hC(e, t, a), a = a.sibling;
    }
    function hC(e, t, a) {
      if (Ya && typeof Ya.onCommitFiberUnmount == "function") try {
        Ya.onCommitFiberUnmount(wu, a);
      } catch {
      }
      switch (a.tag) {
        case 26:
          Bt || _o(a, t), tr(e, t, a), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
          break;
        case 27:
          Bt || _o(a, t);
          var o = bt, r = Da;
          dn(a.type) && (bt = a.stateNode, Da = false), tr(e, t, a), iu(a.stateNode), bt = o, Da = r;
          break;
        case 5:
          Bt || _o(a, t);
        case 6:
          if (o = bt, r = Da, bt = null, tr(e, t, a), bt = o, Da = r, bt !== null) if (Da) try {
            (bt.nodeType === 9 ? bt.body : bt.nodeName === "HTML" ? bt.ownerDocument.body : bt).removeChild(a.stateNode);
          } catch (n) {
            Ze(a, t, n);
          }
          else try {
            bt.removeChild(a.stateNode);
          } catch (n) {
            Ze(a, t, n);
          }
          break;
        case 18:
          bt !== null && (Da ? (e = bt, s1(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, a.stateNode), Ml(e)) : s1(bt, a.stateNode));
          break;
        case 4:
          o = bt, r = Da, bt = a.stateNode.containerInfo, Da = true, tr(e, t, a), bt = o, Da = r;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          un(2, a, t), Bt || un(4, a, t), tr(e, t, a);
          break;
        case 1:
          Bt || (_o(a, t), o = a.stateNode, typeof o.componentWillUnmount == "function" && uC(a, t, o)), tr(e, t, a);
          break;
        case 21:
          tr(e, t, a);
          break;
        case 22:
          Bt = (o = Bt) || a.memoizedState !== null, tr(e, t, a), Bt = o;
          break;
        default:
          tr(e, t, a);
      }
    }
    function gC(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
        e = e.dehydrated;
        try {
          Ml(e);
        } catch (a) {
          Ze(t, t.return, a);
        }
      }
    }
    function xC(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
        Ml(e);
      } catch (a) {
        Ze(t, t.return, a);
      }
    }
    function kR(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return t === null && (t = e.stateNode = new jS()), t;
        case 22:
          return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new jS()), t;
        default:
          throw Error(B(435, e.tag));
      }
    }
    function If(e, t) {
      var a = kR(e);
      t.forEach(function(o) {
        if (!a.has(o)) {
          a.add(o);
          var r = UR.bind(null, e, o);
          o.then(r, r);
        }
      });
    }
    function Ra(e, t) {
      var a = t.deletions;
      if (a !== null) for (var o = 0; o < a.length; o++) {
        var r = a[o], n = e, s = t, l = s;
        e: for (; l !== null; ) {
          switch (l.tag) {
            case 27:
              if (dn(l.type)) {
                bt = l.stateNode, Da = false;
                break e;
              }
              break;
            case 5:
              bt = l.stateNode, Da = false;
              break e;
            case 3:
            case 4:
              bt = l.stateNode.containerInfo, Da = true;
              break e;
          }
          l = l.return;
        }
        if (bt === null) throw Error(B(160));
        hC(n, s, r), bt = null, Da = false, n = r.alternate, n !== null && (n.return = null), r.return = null;
      }
      if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) bC(t, e), t = t.sibling;
    }
    var vo = null;
    function bC(e, t) {
      var a = e.alternate, o = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ra(t, e), Ma(e), o & 4 && (un(3, e, e.return), Mu(3, e), un(5, e, e.return));
          break;
        case 1:
          Ra(t, e), Ma(e), o & 512 && (Bt || a === null || _o(a, a.return)), o & 64 && nr && (e = e.updateQueue, e !== null && (o = e.callbacks, o !== null && (a = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = a === null ? o : a.concat(o))));
          break;
        case 26:
          var r = vo;
          if (Ra(t, e), Ma(e), o & 512 && (Bt || a === null || _o(a, a.return)), o & 4) {
            var n = a !== null ? a.memoizedState : null;
            if (o = e.memoizedState, a === null) if (o === null) if (e.stateNode === null) {
              e: {
                o = e.type, a = e.memoizedProps, r = r.ownerDocument || r;
                t: switch (o) {
                  case "title":
                    n = r.getElementsByTagName("title")[0], (!n || n[Au] || n[aa] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = r.createElement(o), r.head.insertBefore(n, r.querySelector("head > title"))), na(n, o, a), n[aa] = e, Wt(n), o = n;
                    break e;
                  case "link":
                    var s = p1("link", "href", r).get(o + (a.href || ""));
                    if (s) {
                      for (var l = 0; l < s.length; l++) if (n = s[l], n.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && n.getAttribute("rel") === (a.rel == null ? null : a.rel) && n.getAttribute("title") === (a.title == null ? null : a.title) && n.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                        s.splice(l, 1);
                        break t;
                      }
                    }
                    n = r.createElement(o), na(n, o, a), r.head.appendChild(n);
                    break;
                  case "meta":
                    if (s = p1("meta", "content", r).get(o + (a.content || ""))) {
                      for (l = 0; l < s.length; l++) if (n = s[l], n.getAttribute("content") === (a.content == null ? null : "" + a.content) && n.getAttribute("name") === (a.name == null ? null : a.name) && n.getAttribute("property") === (a.property == null ? null : a.property) && n.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && n.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                        s.splice(l, 1);
                        break t;
                      }
                    }
                    n = r.createElement(o), na(n, o, a), r.head.appendChild(n);
                    break;
                  default:
                    throw Error(B(468, o));
                }
                n[aa] = e, Wt(n), o = n;
              }
              e.stateNode = o;
            } else m1(r, e.type, e.stateNode);
            else e.stateNode = d1(r, o, e.memoizedProps);
            else n !== o ? (n === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : n.count--, o === null ? m1(r, e.type, e.stateNode) : d1(r, o, e.memoizedProps)) : o === null && e.stateNode !== null && Uh(e, e.memoizedProps, a.memoizedProps);
          }
          break;
        case 27:
          Ra(t, e), Ma(e), o & 512 && (Bt || a === null || _o(a, a.return)), a !== null && o & 4 && Uh(e, e.memoizedProps, a.memoizedProps);
          break;
        case 5:
          if (Ra(t, e), Ma(e), o & 512 && (Bt || a === null || _o(a, a.return)), e.flags & 32) {
            r = e.stateNode;
            try {
              vl(r, "");
            } catch (x) {
              Ze(e, e.return, x);
            }
          }
          o & 4 && e.stateNode != null && (r = e.memoizedProps, Uh(e, r, a !== null ? a.memoizedProps : r)), o & 1024 && (zh = true);
          break;
        case 6:
          if (Ra(t, e), Ma(e), o & 4) {
            if (e.stateNode === null) throw Error(B(162));
            o = e.memoizedProps, a = e.stateNode;
            try {
              a.nodeValue = o;
            } catch (x) {
              Ze(e, e.return, x);
            }
          }
          break;
        case 3:
          if (Vf = null, r = vo, vo = gd(t.containerInfo), Ra(t, e), vo = r, Ma(e), o & 4 && a !== null && a.memoizedState.isDehydrated) try {
            Ml(t.containerInfo);
          } catch (x) {
            Ze(e, e.return, x);
          }
          zh && (zh = false, yC(e));
          break;
        case 4:
          o = vo, vo = gd(e.stateNode.containerInfo), Ra(t, e), Ma(e), vo = o;
          break;
        case 12:
          Ra(t, e), Ma(e);
          break;
        case 31:
          Ra(t, e), Ma(e), o & 4 && (o = e.updateQueue, o !== null && (e.updateQueue = null, If(e, o)));
          break;
        case 13:
          Ra(t, e), Ma(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Dd = Ka()), o & 4 && (o = e.updateQueue, o !== null && (e.updateQueue = null, If(e, o)));
          break;
        case 22:
          r = e.memoizedState !== null;
          var i = a !== null && a.memoizedState !== null, u = nr, c = Bt;
          if (nr = u || r, Bt = c || i, Ra(t, e), Bt = c, nr = u, Ma(e), o & 8192) e: for (t = e.stateNode, t._visibility = r ? t._visibility & -2 : t._visibility | 1, r && (a === null || i || nr || Bt || Vn(e)), a = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                i = a = t;
                try {
                  if (n = i.stateNode, r) s = n.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
                  else {
                    l = i.stateNode;
                    var d = i.memoizedProps.style, f = d != null && d.hasOwnProperty("display") ? d.display : null;
                    l.style.display = f == null || typeof f == "boolean" ? "" : ("" + f).trim();
                  }
                } catch (x) {
                  Ze(i, i.return, x);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                i = t;
                try {
                  i.stateNode.nodeValue = r ? "" : i.memoizedProps;
                } catch (x) {
                  Ze(i, i.return, x);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                i = t;
                try {
                  var p = i.stateNode;
                  r ? l1(p, true) : l1(i.stateNode, false);
                } catch (x) {
                  Ze(i, i.return, x);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              a === t && (a = null), t = t.return;
            }
            a === t && (a = null), t.sibling.return = t.return, t = t.sibling;
          }
          o & 4 && (o = e.updateQueue, o !== null && (a = o.retryQueue, a !== null && (o.retryQueue = null, If(e, a))));
          break;
        case 19:
          Ra(t, e), Ma(e), o & 4 && (o = e.updateQueue, o !== null && (e.updateQueue = null, If(e, o)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          Ra(t, e), Ma(e);
      }
    }
    function Ma(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var a, o = e.return; o !== null; ) {
            if (fC(o)) {
              a = o;
              break;
            }
            o = o.return;
          }
          if (a == null) throw Error(B(160));
          switch (a.tag) {
            case 27:
              var r = a.stateNode, n = Hh(e);
              id(e, n, r);
              break;
            case 5:
              var s = a.stateNode;
              a.flags & 32 && (vl(s, ""), a.flags &= -33);
              var l = Hh(e);
              id(e, l, s);
              break;
            case 3:
            case 4:
              var i = a.stateNode.containerInfo, u = Hh(e);
              Ag(e, u, i);
              break;
            default:
              throw Error(B(161));
          }
        } catch (c) {
          Ze(e, e.return, c);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function yC(e) {
      if (e.subtreeFlags & 1024) for (e = e.child; e !== null; ) {
        var t = e;
        yC(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
    }
    function ar(e, t) {
      if (t.subtreeFlags & 8772) for (t = t.child; t !== null; ) pC(e, t.alternate, t), t = t.sibling;
    }
    function Vn(e) {
      for (e = e.child; e !== null; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            un(4, t, t.return), Vn(t);
            break;
          case 1:
            _o(t, t.return);
            var a = t.stateNode;
            typeof a.componentWillUnmount == "function" && uC(t, t.return, a), Vn(t);
            break;
          case 27:
            iu(t.stateNode);
          case 26:
          case 5:
            _o(t, t.return), Vn(t);
            break;
          case 22:
            t.memoizedState === null && Vn(t);
            break;
          case 30:
            Vn(t);
            break;
          default:
            Vn(t);
        }
        e = e.sibling;
      }
    }
    function or(e, t, a) {
      for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
        var o = t.alternate, r = e, n = t, s = n.flags;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            or(r, n, a), Mu(4, n);
            break;
          case 1:
            if (or(r, n, a), o = n, r = o.stateNode, typeof r.componentDidMount == "function") try {
              r.componentDidMount();
            } catch (u) {
              Ze(o, o.return, u);
            }
            if (o = n, r = o.updateQueue, r !== null) {
              var l = o.stateNode;
              try {
                var i = r.shared.hiddenCallbacks;
                if (i !== null) for (r.shared.hiddenCallbacks = null, r = 0; r < i.length; r++) gL(i[r], l);
              } catch (u) {
                Ze(o, o.return, u);
              }
            }
            a && s & 64 && iC(n), ru(n, n.return);
            break;
          case 27:
            dC(n);
          case 26:
          case 5:
            or(r, n, a), a && o === null && s & 4 && cC(n), ru(n, n.return);
            break;
          case 12:
            or(r, n, a);
            break;
          case 31:
            or(r, n, a), a && s & 4 && gC(r, n);
            break;
          case 13:
            or(r, n, a), a && s & 4 && xC(r, n);
            break;
          case 22:
            n.memoizedState === null && or(r, n, a), ru(n, n.return);
            break;
          case 30:
            break;
          default:
            or(r, n, a);
        }
        t = t.sibling;
      }
    }
    function Ex(e, t) {
      var a = null;
      e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (e != null && e.refCount++, a != null && ku(a));
    }
    function Ax(e, t) {
      e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ku(e));
    }
    function Co(e, t, a, o) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) SC(e, t, a, o), t = t.sibling;
    }
    function SC(e, t, a, o) {
      var r = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Co(e, t, a, o), r & 2048 && Mu(9, t);
          break;
        case 1:
          Co(e, t, a, o);
          break;
        case 3:
          Co(e, t, a, o), r & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ku(e)));
          break;
        case 12:
          if (r & 2048) {
            Co(e, t, a, o), e = t.stateNode;
            try {
              var n = t.memoizedProps, s = n.id, l = n.onPostCommit;
              typeof l == "function" && l(s, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
            } catch (i) {
              Ze(t, t.return, i);
            }
          } else Co(e, t, a, o);
          break;
        case 31:
          Co(e, t, a, o);
          break;
        case 13:
          Co(e, t, a, o);
          break;
        case 23:
          break;
        case 22:
          n = t.stateNode, s = t.alternate, t.memoizedState !== null ? n._visibility & 2 ? Co(e, t, a, o) : nu(e, t) : n._visibility & 2 ? Co(e, t, a, o) : (n._visibility |= 2, el(e, t, a, o, (t.subtreeFlags & 10256) !== 0 || false)), r & 2048 && Ex(s, t);
          break;
        case 24:
          Co(e, t, a, o), r & 2048 && Ax(t.alternate, t);
          break;
        default:
          Co(e, t, a, o);
      }
    }
    function el(e, t, a, o, r) {
      for (r = r && ((t.subtreeFlags & 10256) !== 0 || false), t = t.child; t !== null; ) {
        var n = e, s = t, l = a, i = o, u = s.flags;
        switch (s.tag) {
          case 0:
          case 11:
          case 15:
            el(n, s, l, i, r), Mu(8, s);
            break;
          case 23:
            break;
          case 22:
            var c = s.stateNode;
            s.memoizedState !== null ? c._visibility & 2 ? el(n, s, l, i, r) : nu(n, s) : (c._visibility |= 2, el(n, s, l, i, r)), r && u & 2048 && Ex(s.alternate, s);
            break;
          case 24:
            el(n, s, l, i, r), r && u & 2048 && Ax(s.alternate, s);
            break;
          default:
            el(n, s, l, i, r);
        }
        t = t.sibling;
      }
    }
    function nu(e, t) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) {
        var a = e, o = t, r = o.flags;
        switch (o.tag) {
          case 22:
            nu(a, o), r & 2048 && Ex(o.alternate, o);
            break;
          case 24:
            nu(a, o), r & 2048 && Ax(o.alternate, o);
            break;
          default:
            nu(a, o);
        }
        t = t.sibling;
      }
    }
    var Zi = 8192;
    function Js(e, t, a) {
      if (e.subtreeFlags & Zi) for (e = e.child; e !== null; ) LC(e, t, a), e = e.sibling;
    }
    function LC(e, t, a) {
      switch (e.tag) {
        case 26:
          Js(e, t, a), e.flags & Zi && e.memoizedState !== null && pM(a, vo, e.memoizedState, e.memoizedProps);
          break;
        case 5:
          Js(e, t, a);
          break;
        case 3:
        case 4:
          var o = vo;
          vo = gd(e.stateNode.containerInfo), Js(e, t, a), vo = o;
          break;
        case 22:
          e.memoizedState === null && (o = e.alternate, o !== null && o.memoizedState !== null ? (o = Zi, Zi = 16777216, Js(e, t, a), Zi = o) : Js(e, t, a));
          break;
        default:
          Js(e, t, a);
      }
    }
    function CC(e) {
      var t = e.alternate;
      if (t !== null && (e = t.child, e !== null)) {
        t.child = null;
        do
          t = e.sibling, e.sibling = null, e = t;
        while (e !== null);
      }
    }
    function Fi(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var a = 0; a < t.length; a++) {
          var o = t[a];
          Zt = o, wC(o, e);
        }
        CC(e);
      }
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) vC(e), e = e.sibling;
    }
    function vC(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Fi(e), e.flags & 2048 && un(9, e, e.return);
          break;
        case 3:
          Fi(e);
          break;
        case 12:
          Fi(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, qf(e)) : Fi(e);
          break;
        default:
          Fi(e);
      }
    }
    function qf(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var a = 0; a < t.length; a++) {
          var o = t[a];
          Zt = o, wC(o, e);
        }
        CC(e);
      }
      for (e = e.child; e !== null; ) {
        switch (t = e, t.tag) {
          case 0:
          case 11:
          case 15:
            un(8, t, t.return), qf(t);
            break;
          case 22:
            a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, qf(t));
            break;
          default:
            qf(t);
        }
        e = e.sibling;
      }
    }
    function wC(e, t) {
      for (; Zt !== null; ) {
        var a = Zt;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            un(8, a, t);
            break;
          case 23:
          case 22:
            if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
              var o = a.memoizedState.cachePool.pool;
              o != null && o.refCount++;
            }
            break;
          case 24:
            ku(a.memoizedState.cache);
        }
        if (o = a.child, o !== null) o.return = a, Zt = o;
        else e: for (a = e; Zt !== null; ) {
          o = Zt;
          var r = o.sibling, n = o.return;
          if (mC(o), o === a) {
            Zt = null;
            break e;
          }
          if (r !== null) {
            r.return = n, Zt = r;
            break e;
          }
          Zt = n;
        }
      }
    }
    var RR = { getCacheForType: function(e) {
      var t = ra(_t), a = t.data.get(e);
      return a === void 0 && (a = e(), t.data.set(e, a)), a;
    }, cacheSignal: function() {
      return ra(_t).controller.signal;
    } }, MR = typeof WeakMap == "function" ? WeakMap : Map, qe = 0, at = null, Te = null, Re = 0, Ye = 0, Va = null, Yr = false, Pl = false, Tx = false, gr = 0, It = 0, cn = 0, Yn = 0, kx = 0, Xa = 0, Al = 0, su = null, Oa = null, Tg = false, Dd = 0, IC = 0, ud = 1 / 0, cd = null, tn = null, Vt = 0, an = null, Tl = null, fr = 0, kg = 0, Rg = null, EC = null, lu = 0, Mg = null;
    function Wa() {
      return (qe & 2) !== 0 && Re !== 0 ? Re & -Re : fe.T !== null ? Mx() : _1();
    }
    function AC() {
      if (Xa === 0) if ((Re & 536870912) === 0 || De) {
        var e = hf;
        hf <<= 1, (hf & 3932160) === 0 && (hf = 262144), Xa = e;
      } else Xa = 536870912;
      return e = $a.current, e !== null && (e.flags |= 32), Xa;
    }
    function Ba(e, t, a) {
      (e === at && (Ye === 2 || Ye === 9) || e.cancelPendingCommit !== null) && (kl(e, 0), Zr(e, Re, Xa, false)), Eu(e, a), ((qe & 2) === 0 || e !== at) && (e === at && ((qe & 2) === 0 && (Yn |= a), It === 4 && Zr(e, Re, Xa, false)), Uo(e));
    }
    function TC(e, t, a) {
      if ((qe & 6) !== 0) throw Error(B(327));
      var o = !a && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Iu(e, t), r = o ? BR(e, t) : qh(e, t, true), n = o;
      do {
        if (r === 0) {
          Pl && !o && Zr(e, t, 0, false);
          break;
        } else {
          if (a = e.current.alternate, n && !DR(a)) {
            r = qh(e, t, false), n = false;
            continue;
          }
          if (r === 2) {
            if (n = t, e.errorRecoveryDisabledLanes & n) var s = 0;
            else s = e.pendingLanes & -536870913, s = s !== 0 ? s : s & 536870912 ? 536870912 : 0;
            if (s !== 0) {
              t = s;
              e: {
                var l = e;
                r = su;
                var i = l.current.memoizedState.isDehydrated;
                if (i && (kl(l, s).flags |= 256), s = qh(l, s, false), s !== 2) {
                  if (Tx && !i) {
                    l.errorRecoveryDisabledLanes |= n, Yn |= n, r = 4;
                    break e;
                  }
                  n = Oa, Oa = r, n !== null && (Oa === null ? Oa = n : Oa.push.apply(Oa, n));
                }
                r = s;
              }
              if (n = false, r !== 2) continue;
            }
          }
          if (r === 1) {
            kl(e, 0), Zr(e, t, 0, true);
            break;
          }
          e: {
            switch (o = e, n = r, n) {
              case 0:
              case 1:
                throw Error(B(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                Zr(o, t, Xa, !Yr);
                break e;
              case 2:
                Oa = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(B(329));
            }
            if ((t & 62914560) === t && (r = Dd + 300 - Ka(), 10 < r)) {
              if (Zr(o, t, Xa, !Yr), Ld(o, 0, true) !== 0) break e;
              fr = t, o.timeoutHandle = YC(XS.bind(null, o, a, Oa, cd, Tg, t, Xa, Yn, Al, Yr, n, "Throttled", -0, 0), r);
              break e;
            }
            XS(o, a, Oa, cd, Tg, t, Xa, Yn, Al, Yr, n, null, -0, 0);
          }
        }
        break;
      } while (true);
      Uo(e);
    }
    function XS(e, t, a, o, r, n, s, l, i, u, c, d, f, p) {
      if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) === 16785408) {
        d = { stylesheets: null, count: 0, imgCount: 0, imgBytes: 0, suspenseyImages: [], waitingForImages: true, waitingForViewTransition: false, unsuspend: lr }, LC(t, n, d);
        var x = (n & 62914560) === n ? Dd - Ka() : (n & 4194048) === n ? IC - Ka() : 0;
        if (x = mM(d, x), x !== null) {
          fr = n, e.cancelPendingCommit = x(YS.bind(null, e, t, n, a, o, r, s, l, i, c, d, null, f, p)), Zr(e, n, s, !u);
          return;
        }
      }
      YS(e, t, n, a, o, r, s, l, i);
    }
    function DR(e) {
      for (var t = e; ; ) {
        var a = t.tag;
        if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null))) for (var o = 0; o < a.length; o++) {
          var r = a[o], n = r.getSnapshot;
          r = r.value;
          try {
            if (!Qa(n(), r)) return false;
          } catch {
            return false;
          }
        }
        if (a = t.child, t.subtreeFlags & 16384 && a !== null) a.return = t, t = a;
        else {
          if (t === e) break;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) return true;
            t = t.return;
          }
          t.sibling.return = t.return, t = t.sibling;
        }
      }
      return true;
    }
    function Zr(e, t, a, o) {
      t &= ~kx, t &= ~Yn, e.suspendedLanes |= t, e.pingedLanes &= ~t, o && (e.warmLanes |= t), o = e.expirationTimes;
      for (var r = t; 0 < r; ) {
        var n = 31 - Za(r), s = 1 << n;
        o[n] = -1, r &= ~s;
      }
      a !== 0 && D1(e, a, t);
    }
    function Od() {
      return (qe & 6) === 0 ? (Du(0, false), false) : true;
    }
    function Rx() {
      if (Te !== null) {
        if (Ye === 0) var e = Te.return;
        else e = Te, ir = rs = null, hx(e), bl = null, hu = 0, e = Te;
        for (; e !== null; ) lC(e.alternate, e), e = e.return;
        Te = null;
      }
    }
    function kl(e, t) {
      var a = e.timeoutHandle;
      a !== -1 && (e.timeoutHandle = -1, WR(a)), a = e.cancelPendingCommit, a !== null && (e.cancelPendingCommit = null, a()), fr = 0, Rx(), at = e, Te = a = ur(e.current, null), Re = t, Ye = 0, Va = null, Yr = false, Pl = Iu(e, t), Tx = false, Al = Xa = kx = Yn = cn = It = 0, Oa = su = null, Tg = false, (t & 8) !== 0 && (t |= t & 32);
      var o = e.entangledLanes;
      if (o !== 0) for (e = e.entanglements, o &= t; 0 < o; ) {
        var r = 31 - Za(o), n = 1 << r;
        t |= e[r], o &= ~n;
      }
      return gr = t, Id(), a;
    }
    function kC(e, t) {
      Se = null, fe.H = xu, t === _l || t === Ad ? (t = wS(), Ye = 3) : t === ix ? (t = wS(), Ye = 4) : Ye = t === wx ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Va = t, Te === null && (It = 1, sd(e, co(t, e.current)));
    }
    function RC() {
      var e = $a.current;
      return e === null ? true : (Re & 4194048) === Re ? po === null : (Re & 62914560) === Re || (Re & 536870912) !== 0 ? e === po : false;
    }
    function MC() {
      var e = fe.H;
      return fe.H = xu, e === null ? xu : e;
    }
    function DC() {
      var e = fe.A;
      return fe.A = RR, e;
    }
    function fd() {
      It = 4, Yr || (Re & 4194048) !== Re && $a.current !== null || (Pl = true), (cn & 134217727) === 0 && (Yn & 134217727) === 0 || at === null || Zr(at, Re, Xa, false);
    }
    function qh(e, t, a) {
      var o = qe;
      qe |= 2;
      var r = MC(), n = DC();
      (at !== e || Re !== t) && (cd = null, kl(e, t)), t = false;
      var s = It;
      e: do
        try {
          if (Ye !== 0 && Te !== null) {
            var l = Te, i = Va;
            switch (Ye) {
              case 8:
                Rx(), s = 6;
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                $a.current === null && (t = true);
                var u = Ye;
                if (Ye = 0, Va = null, pl(e, l, i, u), a && Pl) {
                  s = 0;
                  break e;
                }
                break;
              default:
                u = Ye, Ye = 0, Va = null, pl(e, l, i, u);
            }
          }
          OR(), s = It;
          break;
        } catch (c) {
          kC(e, c);
        }
      while (true);
      return t && e.shellSuspendCounter++, ir = rs = null, qe = o, fe.H = r, fe.A = n, Te === null && (at = null, Re = 0, Id()), s;
    }
    function OR() {
      for (; Te !== null; ) OC(Te);
    }
    function BR(e, t) {
      var a = qe;
      qe |= 2;
      var o = MC(), r = DC();
      at !== e || Re !== t ? (cd = null, ud = Ka() + 500, kl(e, t)) : Pl = Iu(e, t);
      e: do
        try {
          if (Ye !== 0 && Te !== null) {
            t = Te;
            var n = Va;
            t: switch (Ye) {
              case 1:
                Ye = 0, Va = null, pl(e, t, n, 1);
                break;
              case 2:
              case 9:
                if (vS(n)) {
                  Ye = 0, Va = null, KS(t);
                  break;
                }
                t = function() {
                  Ye !== 2 && Ye !== 9 || at !== e || (Ye = 7), Uo(e);
                }, n.then(t, t);
                break e;
              case 3:
                Ye = 7;
                break e;
              case 4:
                Ye = 5;
                break e;
              case 7:
                vS(n) ? (Ye = 0, Va = null, KS(t)) : (Ye = 0, Va = null, pl(e, t, n, 7));
                break;
              case 5:
                var s = null;
                switch (Te.tag) {
                  case 26:
                    s = Te.memoizedState;
                  case 5:
                  case 27:
                    var l = Te;
                    if (s ? JC(s) : l.stateNode.complete) {
                      Ye = 0, Va = null;
                      var i = l.sibling;
                      if (i !== null) Te = i;
                      else {
                        var u = l.return;
                        u !== null ? (Te = u, Bd(u)) : Te = null;
                      }
                      break t;
                    }
                }
                Ye = 0, Va = null, pl(e, t, n, 5);
                break;
              case 6:
                Ye = 0, Va = null, pl(e, t, n, 6);
                break;
              case 8:
                Rx(), It = 6;
                break e;
              default:
                throw Error(B(462));
            }
          }
          _R();
          break;
        } catch (c) {
          kC(e, c);
        }
      while (true);
      return ir = rs = null, fe.H = o, fe.A = r, qe = a, Te !== null ? 0 : (at = null, Re = 0, Id(), It);
    }
    function _R() {
      for (; Te !== null && !rk(); ) OC(Te);
    }
    function OC(e) {
      var t = sC(e.alternate, e, gr);
      e.memoizedProps = e.pendingProps, t === null ? Bd(e) : Te = t;
    }
    function KS(e) {
      var t = e, a = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = zS(a, t, t.pendingProps, t.type, void 0, Re);
          break;
        case 11:
          t = zS(a, t, t.pendingProps, t.type.render, t.ref, Re);
          break;
        case 5:
          hx(t);
        default:
          lC(a, t), t = Te = lL(t, gr), t = sC(a, t, gr);
      }
      e.memoizedProps = e.pendingProps, t === null ? Bd(e) : Te = t;
    }
    function pl(e, t, a, o) {
      ir = rs = null, hx(t), bl = null, hu = 0;
      var r = t.return;
      try {
        if (vR(e, r, t, a, Re)) {
          It = 1, sd(e, co(a, e.current)), Te = null;
          return;
        }
      } catch (n) {
        if (r !== null) throw Te = r, n;
        It = 1, sd(e, co(a, e.current)), Te = null;
        return;
      }
      t.flags & 32768 ? (De || o === 1 ? e = true : Pl || (Re & 536870912) !== 0 ? e = false : (Yr = e = true, (o === 2 || o === 9 || o === 3 || o === 6) && (o = $a.current, o !== null && o.tag === 13 && (o.flags |= 16384))), BC(t, e)) : Bd(t);
    }
    function Bd(e) {
      var t = e;
      do {
        if ((t.flags & 32768) !== 0) {
          BC(t, Yr);
          return;
        }
        e = t.return;
        var a = ER(t.alternate, t, gr);
        if (a !== null) {
          Te = a;
          return;
        }
        if (t = t.sibling, t !== null) {
          Te = t;
          return;
        }
        Te = t = e;
      } while (t !== null);
      It === 0 && (It = 5);
    }
    function BC(e, t) {
      do {
        var a = AR(e.alternate, e);
        if (a !== null) {
          a.flags &= 32767, Te = a;
          return;
        }
        if (a = e.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (e = e.sibling, e !== null)) {
          Te = e;
          return;
        }
        Te = e = a;
      } while (e !== null);
      It = 6, Te = null;
    }
    function YS(e, t, a, o, r, n, s, l, i) {
      e.cancelPendingCommit = null;
      do
        _d();
      while (Vt !== 0);
      if ((qe & 6) !== 0) throw Error(B(327));
      if (t !== null) {
        if (t === e.current) throw Error(B(177));
        if (n = t.lanes | t.childLanes, n |= tx, mk(e, a, n, s, l, i), e === at && (Te = at = null, Re = 0), Tl = t, an = e, fr = a, kg = n, Rg = r, EC = o, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, HR(Zf, function() {
          return HC(), null;
        })) : (e.callbackNode = null, e.callbackPriority = 0), o = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || o) {
          o = fe.T, fe.T = null, r = Fe.p, Fe.p = 2, s = qe, qe |= 4;
          try {
            TR(e, t, a);
          } finally {
            qe = s, Fe.p = r, fe.T = o;
          }
        }
        Vt = 1, _C(), PC(), NC();
      }
    }
    function _C() {
      if (Vt === 1) {
        Vt = 0;
        var e = an, t = Tl, a = (t.flags & 13878) !== 0;
        if ((t.subtreeFlags & 13878) !== 0 || a) {
          a = fe.T, fe.T = null;
          var o = Fe.p;
          Fe.p = 2;
          var r = qe;
          qe |= 4;
          try {
            bC(t, e);
            var n = _g, s = J1(e.containerInfo), l = n.focusedElem, i = n.selectionRange;
            if (s !== l && l && l.ownerDocument && $1(l.ownerDocument.documentElement, l)) {
              if (i !== null && ex(l)) {
                var u = i.start, c = i.end;
                if (c === void 0 && (c = u), "selectionStart" in l) l.selectionStart = u, l.selectionEnd = Math.min(c, l.value.length);
                else {
                  var d = l.ownerDocument || document, f = d && d.defaultView || window;
                  if (f.getSelection) {
                    var p = f.getSelection(), x = l.textContent.length, S = Math.min(i.start, x), v = i.end === void 0 ? S : Math.min(i.end, x);
                    !p.extend && S > v && (s = v, v = S, S = s);
                    var g = gS(l, S), m = gS(l, v);
                    if (g && m && (p.rangeCount !== 1 || p.anchorNode !== g.node || p.anchorOffset !== g.offset || p.focusNode !== m.node || p.focusOffset !== m.offset)) {
                      var b = d.createRange();
                      b.setStart(g.node, g.offset), p.removeAllRanges(), S > v ? (p.addRange(b), p.extend(m.node, m.offset)) : (b.setEnd(m.node, m.offset), p.addRange(b));
                    }
                  }
                }
              }
              for (d = [], p = l; p = p.parentNode; ) p.nodeType === 1 && d.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
              for (typeof l.focus == "function" && l.focus(), l = 0; l < d.length; l++) {
                var y = d[l];
                y.element.scrollLeft = y.left, y.element.scrollTop = y.top;
              }
            }
            yd = !!Bg, _g = Bg = null;
          } finally {
            qe = r, Fe.p = o, fe.T = a;
          }
        }
        e.current = t, Vt = 2;
      }
    }
    function PC() {
      if (Vt === 2) {
        Vt = 0;
        var e = an, t = Tl, a = (t.flags & 8772) !== 0;
        if ((t.subtreeFlags & 8772) !== 0 || a) {
          a = fe.T, fe.T = null;
          var o = Fe.p;
          Fe.p = 2;
          var r = qe;
          qe |= 4;
          try {
            pC(e, t.alternate, t);
          } finally {
            qe = r, Fe.p = o, fe.T = a;
          }
        }
        Vt = 3;
      }
    }
    function NC() {
      if (Vt === 4 || Vt === 3) {
        Vt = 0, nk();
        var e = an, t = Tl, a = fr, o = EC;
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Vt = 5 : (Vt = 0, Tl = an = null, UC(e, e.pendingLanes));
        var r = e.pendingLanes;
        if (r === 0 && (tn = null), Kg(a), t = t.stateNode, Ya && typeof Ya.onCommitFiberRoot == "function") try {
          Ya.onCommitFiberRoot(wu, t, void 0, (t.current.flags & 128) === 128);
        } catch {
        }
        if (o !== null) {
          t = fe.T, r = Fe.p, Fe.p = 2, fe.T = null;
          try {
            for (var n = e.onRecoverableError, s = 0; s < o.length; s++) {
              var l = o[s];
              n(l.value, { componentStack: l.stack });
            }
          } finally {
            fe.T = t, Fe.p = r;
          }
        }
        (fr & 3) !== 0 && _d(), Uo(e), r = e.pendingLanes, (a & 261930) !== 0 && (r & 42) !== 0 ? e === Mg ? lu++ : (lu = 0, Mg = e) : lu = 0, Du(0, false);
      }
    }
    function UC(e, t) {
      (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ku(t)));
    }
    function _d() {
      return _C(), PC(), NC(), HC();
    }
    function HC() {
      if (Vt !== 5) return false;
      var e = an, t = kg;
      kg = 0;
      var a = Kg(fr), o = fe.T, r = Fe.p;
      try {
        Fe.p = 32 > a ? 32 : a, fe.T = null, a = Rg, Rg = null;
        var n = an, s = fr;
        if (Vt = 0, Tl = an = null, fr = 0, (qe & 6) !== 0) throw Error(B(331));
        var l = qe;
        if (qe |= 4, vC(n.current), SC(n, n.current, s, a), qe = l, Du(0, false), Ya && typeof Ya.onPostCommitFiberRoot == "function") try {
          Ya.onPostCommitFiberRoot(wu, n);
        } catch {
        }
        return true;
      } finally {
        Fe.p = r, fe.T = o, UC(e, t);
      }
    }
    function ZS(e, t, a) {
      t = co(a, t), t = wg(e.stateNode, t, 2), e = en(e, t, 2), e !== null && (Eu(e, 2), Uo(e));
    }
    function Ze(e, t, a) {
      if (e.tag === 3) ZS(e, e, a);
      else for (; t !== null; ) {
        if (t.tag === 3) {
          ZS(t, e, a);
          break;
        } else if (t.tag === 1) {
          var o = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (tn === null || !tn.has(o))) {
            e = co(a, e), a = eC(2), o = en(t, a, 2), o !== null && (tC(a, o, t, e), Eu(o, 2), Uo(o));
            break;
          }
        }
        t = t.return;
      }
    }
    function Fh(e, t, a) {
      var o = e.pingCache;
      if (o === null) {
        o = e.pingCache = new MR();
        var r = /* @__PURE__ */ new Set();
        o.set(t, r);
      } else r = o.get(t), r === void 0 && (r = /* @__PURE__ */ new Set(), o.set(t, r));
      r.has(a) || (Tx = true, r.add(a), e = PR.bind(null, e, t, a), t.then(e, e));
    }
    function PR(e, t, a) {
      var o = e.pingCache;
      o !== null && o.delete(t), e.pingedLanes |= e.suspendedLanes & a, e.warmLanes &= ~a, at === e && (Re & a) === a && (It === 4 || It === 3 && (Re & 62914560) === Re && 300 > Ka() - Dd ? (qe & 2) === 0 && kl(e, 0) : kx |= a, Al === Re && (Al = 0)), Uo(e);
    }
    function zC(e, t) {
      t === 0 && (t = M1()), e = os(e, t), e !== null && (Eu(e, t), Uo(e));
    }
    function NR(e) {
      var t = e.memoizedState, a = 0;
      t !== null && (a = t.retryLane), zC(e, a);
    }
    function UR(e, t) {
      var a = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var o = e.stateNode, r = e.memoizedState;
          r !== null && (a = r.retryLane);
          break;
        case 19:
          o = e.stateNode;
          break;
        case 22:
          o = e.stateNode._retryCache;
          break;
        default:
          throw Error(B(314));
      }
      o !== null && o.delete(t), zC(e, a);
    }
    function HR(e, t) {
      return jg(e, t);
    }
    var dd = null, tl = null, Dg = false, pd = false, Vh = false, Wr = 0;
    function Uo(e) {
      e !== tl && e.next === null && (tl === null ? dd = tl = e : tl = tl.next = e), pd = true, Dg || (Dg = true, qR());
    }
    function Du(e, t) {
      if (!Vh && pd) {
        Vh = true;
        do
          for (var a = false, o = dd; o !== null; ) {
            if (!t) if (e !== 0) {
              var r = o.pendingLanes;
              if (r === 0) var n = 0;
              else {
                var s = o.suspendedLanes, l = o.pingedLanes;
                n = (1 << 31 - Za(42 | e) + 1) - 1, n &= r & ~(s & ~l), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
              }
              n !== 0 && (a = true, WS(o, n));
            } else n = Re, n = Ld(o, o === at ? n : 0, o.cancelPendingCommit !== null || o.timeoutHandle !== -1), (n & 3) === 0 || Iu(o, n) || (a = true, WS(o, n));
            o = o.next;
          }
        while (a);
        Vh = false;
      }
    }
    function zR() {
      qC();
    }
    function qC() {
      pd = Dg = false;
      var e = 0;
      Wr !== 0 && ZR() && (e = Wr);
      for (var t = Ka(), a = null, o = dd; o !== null; ) {
        var r = o.next, n = FC(o, t);
        n === 0 ? (o.next = null, a === null ? dd = r : a.next = r, r === null && (tl = a)) : (a = o, (e !== 0 || (n & 3) !== 0) && (pd = true)), o = r;
      }
      Vt !== 0 && Vt !== 5 || Du(e, false), Wr !== 0 && (Wr = 0);
    }
    function FC(e, t) {
      for (var a = e.suspendedLanes, o = e.pingedLanes, r = e.expirationTimes, n = e.pendingLanes & -62914561; 0 < n; ) {
        var s = 31 - Za(n), l = 1 << s, i = r[s];
        i === -1 ? ((l & a) === 0 || (l & o) !== 0) && (r[s] = pk(l, t)) : i <= t && (e.expiredLanes |= l), n &= ~l;
      }
      if (t = at, a = Re, a = Ld(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), o = e.callbackNode, a === 0 || e === t && (Ye === 2 || Ye === 9) || e.cancelPendingCommit !== null) return o !== null && o !== null && bh(o), e.callbackNode = null, e.callbackPriority = 0;
      if ((a & 3) === 0 || Iu(e, a)) {
        if (t = a & -a, t === e.callbackPriority) return t;
        switch (o !== null && bh(o), Kg(a)) {
          case 2:
          case 8:
            a = k1;
            break;
          case 32:
            a = Zf;
            break;
          case 268435456:
            a = R1;
            break;
          default:
            a = Zf;
        }
        return o = VC.bind(null, e), a = jg(a, o), e.callbackPriority = t, e.callbackNode = a, t;
      }
      return o !== null && o !== null && bh(o), e.callbackPriority = 2, e.callbackNode = null, 2;
    }
    function VC(e, t) {
      if (Vt !== 0 && Vt !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
      var a = e.callbackNode;
      if (_d() && e.callbackNode !== a) return null;
      var o = Re;
      return o = Ld(e, e === at ? o : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), o === 0 ? null : (TC(e, o, t), FC(e, Ka()), e.callbackNode != null && e.callbackNode === a ? VC.bind(null, e) : null);
    }
    function WS(e, t) {
      if (_d()) return null;
      TC(e, t, true);
    }
    function qR() {
      QR(function() {
        (qe & 6) !== 0 ? jg(T1, zR) : qC();
      });
    }
    function Mx() {
      if (Wr === 0) {
        var e = wl;
        e === 0 && (e = mf, mf <<= 1, (mf & 261888) === 0 && (mf = 256)), Wr = e;
      }
      return Wr;
    }
    function QS(e) {
      return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Df("" + e);
    }
    function $S(e, t) {
      var a = t.ownerDocument.createElement("input");
      return a.name = t.name, a.value = t.value, e.id && a.setAttribute("form", e.id), t.parentNode.insertBefore(a, t), e = new FormData(e), a.parentNode.removeChild(a), e;
    }
    function FR(e, t, a, o, r) {
      if (t === "submit" && a && a.stateNode === r) {
        var n = QS((r[_a] || null).action), s = o.submitter;
        s && (t = (t = s[_a] || null) ? QS(t.formAction) : s.getAttribute("formAction"), t !== null && (n = t, s = null));
        var l = new Cd("action", "action", null, o, r);
        e.push({ event: l, listeners: [{ instance: null, listener: function() {
          if (o.defaultPrevented) {
            if (Wr !== 0) {
              var i = s ? $S(r, s) : new FormData(r);
              Cg(a, { pending: true, data: i, method: r.method, action: n }, null, i);
            }
          } else typeof n == "function" && (l.preventDefault(), i = s ? $S(r, s) : new FormData(r), Cg(a, { pending: true, data: i, method: r.method, action: n }, n, i));
        }, currentTarget: r }] });
      }
    }
    for (Ef = 0; Ef < cg.length; Ef++) Af = cg[Ef], JS = Af.toLowerCase(), e1 = Af[0].toUpperCase() + Af.slice(1), wo(JS, "on" + e1);
    var Af, JS, e1, Ef;
    wo(tL, "onAnimationEnd");
    wo(aL, "onAnimationIteration");
    wo(oL, "onAnimationStart");
    wo("dblclick", "onDoubleClick");
    wo("focusin", "onFocus");
    wo("focusout", "onBlur");
    wo(sR, "onTransitionRun");
    wo(lR, "onTransitionStart");
    wo(iR, "onTransitionCancel");
    wo(rL, "onTransitionEnd");
    Cl("onMouseEnter", ["mouseout", "mouseover"]);
    Cl("onMouseLeave", ["mouseout", "mouseover"]);
    Cl("onPointerEnter", ["pointerout", "pointerover"]);
    Cl("onPointerLeave", ["pointerout", "pointerover"]);
    es("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
    es("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
    es("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
    es("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
    es("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
    es("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var bu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), VR = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(bu));
    function GC(e, t) {
      t = (t & 4) !== 0;
      for (var a = 0; a < e.length; a++) {
        var o = e[a], r = o.event;
        o = o.listeners;
        e: {
          var n = void 0;
          if (t) for (var s = o.length - 1; 0 <= s; s--) {
            var l = o[s], i = l.instance, u = l.currentTarget;
            if (l = l.listener, i !== n && r.isPropagationStopped()) break e;
            n = l, r.currentTarget = u;
            try {
              n(r);
            } catch (c) {
              Qf(c);
            }
            r.currentTarget = null, n = i;
          }
          else for (s = 0; s < o.length; s++) {
            if (l = o[s], i = l.instance, u = l.currentTarget, l = l.listener, i !== n && r.isPropagationStopped()) break e;
            n = l, r.currentTarget = u;
            try {
              n(r);
            } catch (c) {
              Qf(c);
            }
            r.currentTarget = null, n = i;
          }
        }
      }
    }
    function Ae(e, t) {
      var a = t[ag];
      a === void 0 && (a = t[ag] = /* @__PURE__ */ new Set());
      var o = e + "__bubble";
      a.has(o) || (jC(t, e, 2, false), a.add(o));
    }
    function Gh(e, t, a) {
      var o = 0;
      t && (o |= 4), jC(a, e, o, t);
    }
    var Tf = "_reactListening" + Math.random().toString(36).slice(2);
    function Dx(e) {
      if (!e[Tf]) {
        e[Tf] = true, P1.forEach(function(a) {
          a !== "selectionchange" && (VR.has(a) || Gh(a, false, e), Gh(a, true, e));
        });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[Tf] || (t[Tf] = true, Gh("selectionchange", false, t));
      }
    }
    function jC(e, t, a, o) {
      switch (rv(t)) {
        case 2:
          var r = xM;
          break;
        case 8:
          r = bM;
          break;
        default:
          r = Px;
      }
      a = r.bind(null, t, a, e), r = void 0, !lg || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (r = true), o ? r !== void 0 ? e.addEventListener(t, a, { capture: true, passive: r }) : e.addEventListener(t, a, true) : r !== void 0 ? e.addEventListener(t, a, { passive: r }) : e.addEventListener(t, a, false);
    }
    function jh(e, t, a, o, r) {
      var n = o;
      if ((t & 1) === 0 && (t & 2) === 0 && o !== null) e: for (; ; ) {
        if (o === null) return;
        var s = o.tag;
        if (s === 3 || s === 4) {
          var l = o.stateNode.containerInfo;
          if (l === r) break;
          if (s === 4) for (s = o.return; s !== null; ) {
            var i = s.tag;
            if ((i === 3 || i === 4) && s.stateNode.containerInfo === r) return;
            s = s.return;
          }
          for (; l !== null; ) {
            if (s = rl(l), s === null) return;
            if (i = s.tag, i === 5 || i === 6 || i === 26 || i === 27) {
              o = n = s;
              continue e;
            }
            l = l.parentNode;
          }
        }
        o = o.return;
      }
      G1(function() {
        var u = n, c = Wg(a), d = [];
        e: {
          var f = nL.get(e);
          if (f !== void 0) {
            var p = Cd, x = e;
            switch (e) {
              case "keypress":
                if (Bf(a) === 0) break e;
              case "keydown":
              case "keyup":
                p = Uk;
                break;
              case "focusin":
                x = "focus", p = vh;
                break;
              case "focusout":
                x = "blur", p = vh;
                break;
              case "beforeblur":
              case "afterblur":
                p = vh;
                break;
              case "click":
                if (a.button === 2) break e;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                p = lS;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                p = Ek;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                p = qk;
                break;
              case tL:
              case aL:
              case oL:
                p = kk;
                break;
              case rL:
                p = Vk;
                break;
              case "scroll":
              case "scrollend":
                p = wk;
                break;
              case "wheel":
                p = jk;
                break;
              case "copy":
              case "cut":
              case "paste":
                p = Mk;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                p = uS;
                break;
              case "toggle":
              case "beforetoggle":
                p = Kk;
            }
            var S = (t & 4) !== 0, v = !S && (e === "scroll" || e === "scrollend"), g = S ? f !== null ? f + "Capture" : null : f;
            S = [];
            for (var m = u, b; m !== null; ) {
              var y = m;
              if (b = y.stateNode, y = y.tag, y !== 5 && y !== 26 && y !== 27 || b === null || g === null || (y = cu(m, g), y != null && S.push(yu(m, y, b))), v) break;
              m = m.return;
            }
            0 < S.length && (f = new p(f, x, null, a, c), d.push({ event: f, listeners: S }));
          }
        }
        if ((t & 7) === 0) {
          e: {
            if (f = e === "mouseover" || e === "pointerover", p = e === "mouseout" || e === "pointerout", f && a !== sg && (x = a.relatedTarget || a.fromElement) && (rl(x) || x[Dl])) break e;
            if ((p || f) && (f = c.window === c ? c : (f = c.ownerDocument) ? f.defaultView || f.parentWindow : window, p ? (x = a.relatedTarget || a.toElement, p = u, x = x ? rl(x) : null, x !== null && (v = vu(x), S = x.tag, x !== v || S !== 5 && S !== 27 && S !== 6) && (x = null)) : (p = null, x = u), p !== x)) {
              if (S = lS, y = "onMouseLeave", g = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (S = uS, y = "onPointerLeave", g = "onPointerEnter", m = "pointer"), v = p == null ? f : Ki(p), b = x == null ? f : Ki(x), f = new S(y, m + "leave", p, a, c), f.target = v, f.relatedTarget = b, y = null, rl(c) === u && (S = new S(g, m + "enter", x, a, c), S.target = b, S.relatedTarget = v, y = S), v = y, p && x) t: {
                for (S = GR, g = p, m = x, b = 0, y = g; y; y = S(y)) b++;
                y = 0;
                for (var C = m; C; C = S(C)) y++;
                for (; 0 < b - y; ) g = S(g), b--;
                for (; 0 < y - b; ) m = S(m), y--;
                for (; b--; ) {
                  if (g === m || m !== null && g === m.alternate) {
                    S = g;
                    break t;
                  }
                  g = S(g), m = S(m);
                }
                S = null;
              }
              else S = null;
              p !== null && t1(d, f, p, S, false), x !== null && v !== null && t1(d, v, x, S, true);
            }
          }
          e: {
            if (f = u ? Ki(u) : window, p = f.nodeName && f.nodeName.toLowerCase(), p === "select" || p === "input" && f.type === "file") var D = pS;
            else if (dS(f)) if (W1) D = oR;
            else {
              D = tR;
              var I = eR;
            }
            else p = f.nodeName, !p || p.toLowerCase() !== "input" || f.type !== "checkbox" && f.type !== "radio" ? u && Zg(u.elementType) && (D = pS) : D = aR;
            if (D && (D = D(e, u))) {
              Z1(d, D, a, c);
              break e;
            }
            I && I(e, f, u), e === "focusout" && u && f.type === "number" && u.memoizedProps.value != null && ng(f, "number", f.value);
          }
          switch (I = u ? Ki(u) : window, e) {
            case "focusin":
              (dS(I) || I.contentEditable === "true") && (ll = I, ig = u, $i = null);
              break;
            case "focusout":
              $i = ig = ll = null;
              break;
            case "mousedown":
              ug = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              ug = false, xS(d, a, c);
              break;
            case "selectionchange":
              if (nR) break;
            case "keydown":
            case "keyup":
              xS(d, a, c);
          }
          var w;
          if (Jg) e: {
            switch (e) {
              case "compositionstart":
                var M = "onCompositionStart";
                break e;
              case "compositionend":
                M = "onCompositionEnd";
                break e;
              case "compositionupdate":
                M = "onCompositionUpdate";
                break e;
            }
            M = void 0;
          }
          else sl ? K1(e, a) && (M = "onCompositionEnd") : e === "keydown" && a.keyCode === 229 && (M = "onCompositionStart");
          M && (X1 && a.locale !== "ko" && (sl || M !== "onCompositionStart" ? M === "onCompositionEnd" && sl && (w = j1()) : (Kr = c, Qg = "value" in Kr ? Kr.value : Kr.textContent, sl = true)), I = md(u, M), 0 < I.length && (M = new iS(M, e, null, a, c), d.push({ event: M, listeners: I }), w ? M.data = w : (w = Y1(a), w !== null && (M.data = w)))), (w = Zk ? Wk(e, a) : Qk(e, a)) && (M = md(u, "onBeforeInput"), 0 < M.length && (I = new iS("onBeforeInput", "beforeinput", null, a, c), d.push({ event: I, listeners: M }), I.data = w)), FR(d, e, u, a, c);
        }
        GC(d, t);
      });
    }
    function yu(e, t, a) {
      return { instance: e, listener: t, currentTarget: a };
    }
    function md(e, t) {
      for (var a = t + "Capture", o = []; e !== null; ) {
        var r = e, n = r.stateNode;
        if (r = r.tag, r !== 5 && r !== 26 && r !== 27 || n === null || (r = cu(e, a), r != null && o.unshift(yu(e, r, n)), r = cu(e, t), r != null && o.push(yu(e, r, n))), e.tag === 3) return o;
        e = e.return;
      }
      return [];
    }
    function GR(e) {
      if (e === null) return null;
      do
        e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function t1(e, t, a, o, r) {
      for (var n = t._reactName, s = []; a !== null && a !== o; ) {
        var l = a, i = l.alternate, u = l.stateNode;
        if (l = l.tag, i !== null && i === o) break;
        l !== 5 && l !== 26 && l !== 27 || u === null || (i = u, r ? (u = cu(a, n), u != null && s.unshift(yu(a, u, i))) : r || (u = cu(a, n), u != null && s.push(yu(a, u, i)))), a = a.return;
      }
      s.length !== 0 && e.push({ event: t, listeners: s });
    }
    var jR = /\r\n?/g, XR = /\u0000|\uFFFD/g;
    function a1(e) {
      return (typeof e == "string" ? e : "" + e).replace(jR, `
`).replace(XR, "");
    }
    function XC(e, t) {
      return t = a1(t), a1(e) === t;
    }
    function We(e, t, a, o, r, n) {
      switch (a) {
        case "children":
          typeof o == "string" ? t === "body" || t === "textarea" && o === "" || vl(e, o) : (typeof o == "number" || typeof o == "bigint") && t !== "body" && vl(e, "" + o);
          break;
        case "className":
          xf(e, "class", o);
          break;
        case "tabIndex":
          xf(e, "tabindex", o);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          xf(e, a, o);
          break;
        case "style":
          V1(e, o, n);
          break;
        case "data":
          if (t !== "object") {
            xf(e, "data", o);
            break;
          }
        case "src":
        case "href":
          if (o === "" && (t !== "a" || a !== "href")) {
            e.removeAttribute(a);
            break;
          }
          if (o == null || typeof o == "function" || typeof o == "symbol" || typeof o == "boolean") {
            e.removeAttribute(a);
            break;
          }
          o = Df("" + o), e.setAttribute(a, o);
          break;
        case "action":
        case "formAction":
          if (typeof o == "function") {
            e.setAttribute(a, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
            break;
          } else typeof n == "function" && (a === "formAction" ? (t !== "input" && We(e, t, "name", r.name, r, null), We(e, t, "formEncType", r.formEncType, r, null), We(e, t, "formMethod", r.formMethod, r, null), We(e, t, "formTarget", r.formTarget, r, null)) : (We(e, t, "encType", r.encType, r, null), We(e, t, "method", r.method, r, null), We(e, t, "target", r.target, r, null)));
          if (o == null || typeof o == "symbol" || typeof o == "boolean") {
            e.removeAttribute(a);
            break;
          }
          o = Df("" + o), e.setAttribute(a, o);
          break;
        case "onClick":
          o != null && (e.onclick = lr);
          break;
        case "onScroll":
          o != null && Ae("scroll", e);
          break;
        case "onScrollEnd":
          o != null && Ae("scrollend", e);
          break;
        case "dangerouslySetInnerHTML":
          if (o != null) {
            if (typeof o != "object" || !("__html" in o)) throw Error(B(61));
            if (a = o.__html, a != null) {
              if (r.children != null) throw Error(B(60));
              e.innerHTML = a;
            }
          }
          break;
        case "multiple":
          e.multiple = o && typeof o != "function" && typeof o != "symbol";
          break;
        case "muted":
          e.muted = o && typeof o != "function" && typeof o != "symbol";
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (o == null || typeof o == "function" || typeof o == "boolean" || typeof o == "symbol") {
            e.removeAttribute("xlink:href");
            break;
          }
          a = Df("" + o), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a);
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          o != null && typeof o != "function" && typeof o != "symbol" ? e.setAttribute(a, "" + o) : e.removeAttribute(a);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          o && typeof o != "function" && typeof o != "symbol" ? e.setAttribute(a, "") : e.removeAttribute(a);
          break;
        case "capture":
        case "download":
          o === true ? e.setAttribute(a, "") : o !== false && o != null && typeof o != "function" && typeof o != "symbol" ? e.setAttribute(a, o) : e.removeAttribute(a);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          o != null && typeof o != "function" && typeof o != "symbol" && !isNaN(o) && 1 <= o ? e.setAttribute(a, o) : e.removeAttribute(a);
          break;
        case "rowSpan":
        case "start":
          o == null || typeof o == "function" || typeof o == "symbol" || isNaN(o) ? e.removeAttribute(a) : e.setAttribute(a, o);
          break;
        case "popover":
          Ae("beforetoggle", e), Ae("toggle", e), Mf(e, "popover", o);
          break;
        case "xlinkActuate":
          Jo(e, "http://www.w3.org/1999/xlink", "xlink:actuate", o);
          break;
        case "xlinkArcrole":
          Jo(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", o);
          break;
        case "xlinkRole":
          Jo(e, "http://www.w3.org/1999/xlink", "xlink:role", o);
          break;
        case "xlinkShow":
          Jo(e, "http://www.w3.org/1999/xlink", "xlink:show", o);
          break;
        case "xlinkTitle":
          Jo(e, "http://www.w3.org/1999/xlink", "xlink:title", o);
          break;
        case "xlinkType":
          Jo(e, "http://www.w3.org/1999/xlink", "xlink:type", o);
          break;
        case "xmlBase":
          Jo(e, "http://www.w3.org/XML/1998/namespace", "xml:base", o);
          break;
        case "xmlLang":
          Jo(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", o);
          break;
        case "xmlSpace":
          Jo(e, "http://www.w3.org/XML/1998/namespace", "xml:space", o);
          break;
        case "is":
          Mf(e, "is", o);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = Ck.get(a) || a, Mf(e, a, o));
      }
    }
    function Og(e, t, a, o, r, n) {
      switch (a) {
        case "style":
          V1(e, o, n);
          break;
        case "dangerouslySetInnerHTML":
          if (o != null) {
            if (typeof o != "object" || !("__html" in o)) throw Error(B(61));
            if (a = o.__html, a != null) {
              if (r.children != null) throw Error(B(60));
              e.innerHTML = a;
            }
          }
          break;
        case "children":
          typeof o == "string" ? vl(e, o) : (typeof o == "number" || typeof o == "bigint") && vl(e, "" + o);
          break;
        case "onScroll":
          o != null && Ae("scroll", e);
          break;
        case "onScrollEnd":
          o != null && Ae("scrollend", e);
          break;
        case "onClick":
          o != null && (e.onclick = lr);
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!N1.hasOwnProperty(a)) e: {
            if (a[0] === "o" && a[1] === "n" && (r = a.endsWith("Capture"), t = a.slice(2, r ? a.length - 7 : void 0), n = e[_a] || null, n = n != null ? n[a] : null, typeof n == "function" && e.removeEventListener(t, n, r), typeof o == "function")) {
              typeof n != "function" && n !== null && (a in e ? e[a] = null : e.hasAttribute(a) && e.removeAttribute(a)), e.addEventListener(t, o, r);
              break e;
            }
            a in e ? e[a] = o : o === true ? e.setAttribute(a, "") : Mf(e, a, o);
          }
      }
    }
    function na(e, t, a) {
      switch (t) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          Ae("error", e), Ae("load", e);
          var o = false, r = false, n;
          for (n in a) if (a.hasOwnProperty(n)) {
            var s = a[n];
            if (s != null) switch (n) {
              case "src":
                o = true;
                break;
              case "srcSet":
                r = true;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(B(137, t));
              default:
                We(e, t, n, s, a, null);
            }
          }
          r && We(e, t, "srcSet", a.srcSet, a, null), o && We(e, t, "src", a.src, a, null);
          return;
        case "input":
          Ae("invalid", e);
          var l = n = s = r = null, i = null, u = null;
          for (o in a) if (a.hasOwnProperty(o)) {
            var c = a[o];
            if (c != null) switch (o) {
              case "name":
                r = c;
                break;
              case "type":
                s = c;
                break;
              case "checked":
                i = c;
                break;
              case "defaultChecked":
                u = c;
                break;
              case "value":
                n = c;
                break;
              case "defaultValue":
                l = c;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(B(137, t));
                break;
              default:
                We(e, t, o, c, a, null);
            }
          }
          z1(e, n, l, i, u, s, r, false);
          return;
        case "select":
          Ae("invalid", e), o = s = n = null;
          for (r in a) if (a.hasOwnProperty(r) && (l = a[r], l != null)) switch (r) {
            case "value":
              n = l;
              break;
            case "defaultValue":
              s = l;
              break;
            case "multiple":
              o = l;
            default:
              We(e, t, r, l, a, null);
          }
          t = n, a = s, e.multiple = !!o, t != null ? hl(e, !!o, t, false) : a != null && hl(e, !!o, a, true);
          return;
        case "textarea":
          Ae("invalid", e), n = r = o = null;
          for (s in a) if (a.hasOwnProperty(s) && (l = a[s], l != null)) switch (s) {
            case "value":
              o = l;
              break;
            case "defaultValue":
              r = l;
              break;
            case "children":
              n = l;
              break;
            case "dangerouslySetInnerHTML":
              if (l != null) throw Error(B(91));
              break;
            default:
              We(e, t, s, l, a, null);
          }
          F1(e, o, r, n);
          return;
        case "option":
          for (i in a) a.hasOwnProperty(i) && (o = a[i], o != null) && (i === "selected" ? e.selected = o && typeof o != "function" && typeof o != "symbol" : We(e, t, i, o, a, null));
          return;
        case "dialog":
          Ae("beforetoggle", e), Ae("toggle", e), Ae("cancel", e), Ae("close", e);
          break;
        case "iframe":
        case "object":
          Ae("load", e);
          break;
        case "video":
        case "audio":
          for (o = 0; o < bu.length; o++) Ae(bu[o], e);
          break;
        case "image":
          Ae("error", e), Ae("load", e);
          break;
        case "details":
          Ae("toggle", e);
          break;
        case "embed":
        case "source":
        case "link":
          Ae("error", e), Ae("load", e);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (u in a) if (a.hasOwnProperty(u) && (o = a[u], o != null)) switch (u) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(B(137, t));
            default:
              We(e, t, u, o, a, null);
          }
          return;
        default:
          if (Zg(t)) {
            for (c in a) a.hasOwnProperty(c) && (o = a[c], o !== void 0 && Og(e, t, c, o, a, void 0));
            return;
          }
      }
      for (l in a) a.hasOwnProperty(l) && (o = a[l], o != null && We(e, t, l, o, a, null));
    }
    function KR(e, t, a, o) {
      switch (t) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var r = null, n = null, s = null, l = null, i = null, u = null, c = null;
          for (p in a) {
            var d = a[p];
            if (a.hasOwnProperty(p) && d != null) switch (p) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                i = d;
              default:
                o.hasOwnProperty(p) || We(e, t, p, null, o, d);
            }
          }
          for (var f in o) {
            var p = o[f];
            if (d = a[f], o.hasOwnProperty(f) && (p != null || d != null)) switch (f) {
              case "type":
                n = p;
                break;
              case "name":
                r = p;
                break;
              case "checked":
                u = p;
                break;
              case "defaultChecked":
                c = p;
                break;
              case "value":
                s = p;
                break;
              case "defaultValue":
                l = p;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (p != null) throw Error(B(137, t));
                break;
              default:
                p !== d && We(e, t, f, p, o, d);
            }
          }
          rg(e, s, l, i, u, c, n, r);
          return;
        case "select":
          p = s = l = f = null;
          for (n in a) if (i = a[n], a.hasOwnProperty(n) && i != null) switch (n) {
            case "value":
              break;
            case "multiple":
              p = i;
            default:
              o.hasOwnProperty(n) || We(e, t, n, null, o, i);
          }
          for (r in o) if (n = o[r], i = a[r], o.hasOwnProperty(r) && (n != null || i != null)) switch (r) {
            case "value":
              f = n;
              break;
            case "defaultValue":
              l = n;
              break;
            case "multiple":
              s = n;
            default:
              n !== i && We(e, t, r, n, o, i);
          }
          t = l, a = s, o = p, f != null ? hl(e, !!a, f, false) : !!o != !!a && (t != null ? hl(e, !!a, t, true) : hl(e, !!a, a ? [] : "", false));
          return;
        case "textarea":
          p = f = null;
          for (l in a) if (r = a[l], a.hasOwnProperty(l) && r != null && !o.hasOwnProperty(l)) switch (l) {
            case "value":
              break;
            case "children":
              break;
            default:
              We(e, t, l, null, o, r);
          }
          for (s in o) if (r = o[s], n = a[s], o.hasOwnProperty(s) && (r != null || n != null)) switch (s) {
            case "value":
              f = r;
              break;
            case "defaultValue":
              p = r;
              break;
            case "children":
              break;
            case "dangerouslySetInnerHTML":
              if (r != null) throw Error(B(91));
              break;
            default:
              r !== n && We(e, t, s, r, o, n);
          }
          q1(e, f, p);
          return;
        case "option":
          for (var x in a) f = a[x], a.hasOwnProperty(x) && f != null && !o.hasOwnProperty(x) && (x === "selected" ? e.selected = false : We(e, t, x, null, o, f));
          for (i in o) f = o[i], p = a[i], o.hasOwnProperty(i) && f !== p && (f != null || p != null) && (i === "selected" ? e.selected = f && typeof f != "function" && typeof f != "symbol" : We(e, t, i, f, o, p));
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var S in a) f = a[S], a.hasOwnProperty(S) && f != null && !o.hasOwnProperty(S) && We(e, t, S, null, o, f);
          for (u in o) if (f = o[u], p = a[u], o.hasOwnProperty(u) && f !== p && (f != null || p != null)) switch (u) {
            case "children":
            case "dangerouslySetInnerHTML":
              if (f != null) throw Error(B(137, t));
              break;
            default:
              We(e, t, u, f, o, p);
          }
          return;
        default:
          if (Zg(t)) {
            for (var v in a) f = a[v], a.hasOwnProperty(v) && f !== void 0 && !o.hasOwnProperty(v) && Og(e, t, v, void 0, o, f);
            for (c in o) f = o[c], p = a[c], !o.hasOwnProperty(c) || f === p || f === void 0 && p === void 0 || Og(e, t, c, f, o, p);
            return;
          }
      }
      for (var g in a) f = a[g], a.hasOwnProperty(g) && f != null && !o.hasOwnProperty(g) && We(e, t, g, null, o, f);
      for (d in o) f = o[d], p = a[d], !o.hasOwnProperty(d) || f === p || f == null && p == null || We(e, t, d, f, o, p);
    }
    function o1(e) {
      switch (e) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return true;
        default:
          return false;
      }
    }
    function YR() {
      if (typeof performance.getEntriesByType == "function") {
        for (var e = 0, t = 0, a = performance.getEntriesByType("resource"), o = 0; o < a.length; o++) {
          var r = a[o], n = r.transferSize, s = r.initiatorType, l = r.duration;
          if (n && l && o1(s)) {
            for (s = 0, l = r.responseEnd, o += 1; o < a.length; o++) {
              var i = a[o], u = i.startTime;
              if (u > l) break;
              var c = i.transferSize, d = i.initiatorType;
              c && o1(d) && (i = i.responseEnd, s += c * (i < l ? 1 : (l - u) / (i - u)));
            }
            if (--o, t += 8 * (n + s) / (r.duration / 1e3), e++, 10 < e) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
    }
    var Bg = null, _g = null;
    function hd(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function r1(e) {
      switch (e) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function KC(e, t) {
      if (e === 0) switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
      return e === 1 && t === "foreignObject" ? 0 : e;
    }
    function Pg(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    var Xh = null;
    function ZR() {
      var e = window.event;
      return e && e.type === "popstate" ? e === Xh ? false : (Xh = e, true) : (Xh = null, false);
    }
    var YC = typeof setTimeout == "function" ? setTimeout : void 0, WR = typeof clearTimeout == "function" ? clearTimeout : void 0, n1 = typeof Promise == "function" ? Promise : void 0, QR = typeof queueMicrotask == "function" ? queueMicrotask : typeof n1 < "u" ? function(e) {
      return n1.resolve(null).then(e).catch($R);
    } : YC;
    function $R(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function dn(e) {
      return e === "head";
    }
    function s1(e, t) {
      var a = t, o = 0;
      do {
        var r = a.nextSibling;
        if (e.removeChild(a), r && r.nodeType === 8) if (a = r.data, a === "/$" || a === "/&") {
          if (o === 0) {
            e.removeChild(r), Ml(t);
            return;
          }
          o--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&") o++;
        else if (a === "html") iu(e.ownerDocument.documentElement);
        else if (a === "head") {
          a = e.ownerDocument.head, iu(a);
          for (var n = a.firstChild; n; ) {
            var s = n.nextSibling, l = n.nodeName;
            n[Au] || l === "SCRIPT" || l === "STYLE" || l === "LINK" && n.rel.toLowerCase() === "stylesheet" || a.removeChild(n), n = s;
          }
        } else a === "body" && iu(e.ownerDocument.body);
        a = r;
      } while (a);
      Ml(t);
    }
    function l1(e, t) {
      var a = e;
      e = 0;
      do {
        var o = a.nextSibling;
        if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), o && o.nodeType === 8) if (a = o.data, a === "/$") {
          if (e === 0) break;
          e--;
        } else a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || e++;
        a = o;
      } while (a);
    }
    function Ng(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var a = t;
        switch (t = t.nextSibling, a.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            Ng(a), Yg(a);
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if (a.rel.toLowerCase() === "stylesheet") continue;
        }
        e.removeChild(a);
      }
    }
    function JR(e, t, a, o) {
      for (; e.nodeType === 1; ) {
        var r = a;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!o && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
        } else if (o) {
          if (!e[Au]) switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (n = e.getAttribute("rel"), n === "stylesheet" && e.hasAttribute("data-precedence")) break;
              if (n !== r.rel || e.getAttribute("href") !== (r.href == null || r.href === "" ? null : r.href) || e.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin) || e.getAttribute("title") !== (r.title == null ? null : r.title)) break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (n = e.getAttribute("src"), (n !== (r.src == null ? null : r.src) || e.getAttribute("type") !== (r.type == null ? null : r.type) || e.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin)) && n && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
              return e;
            default:
              return e;
          }
        } else if (t === "input" && e.type === "hidden") {
          var n = r.name == null ? null : "" + r.name;
          if (r.type === "hidden" && e.getAttribute("name") === n) return e;
        } else return e;
        if (e = mo(e.nextSibling), e === null) break;
      }
      return null;
    }
    function eM(e, t, a) {
      if (t === "") return null;
      for (; e.nodeType !== 3; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = mo(e.nextSibling), e === null)) return null;
      return e;
    }
    function ZC(e, t) {
      for (; e.nodeType !== 8; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = mo(e.nextSibling), e === null)) return null;
      return e;
    }
    function Ug(e) {
      return e.data === "$?" || e.data === "$~";
    }
    function Hg(e) {
      return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
    }
    function tM(e, t) {
      var a = e.ownerDocument;
      if (e.data === "$~") e._reactRetry = t;
      else if (e.data !== "$?" || a.readyState !== "loading") t();
      else {
        var o = function() {
          t(), a.removeEventListener("DOMContentLoaded", o);
        };
        a.addEventListener("DOMContentLoaded", o), e._reactRetry = o;
      }
    }
    function mo(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
          if (t === "/$" || t === "/&") return null;
        }
      }
      return e;
    }
    var zg = null;
    function i1(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === "/$" || a === "/&") {
            if (t === 0) return mo(e.nextSibling);
            t--;
          } else a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function u1(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
            if (t === 0) return e;
            t--;
          } else a !== "/$" && a !== "/&" || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function WC(e, t, a) {
      switch (t = hd(a), e) {
        case "html":
          if (e = t.documentElement, !e) throw Error(B(452));
          return e;
        case "head":
          if (e = t.head, !e) throw Error(B(453));
          return e;
        case "body":
          if (e = t.body, !e) throw Error(B(454));
          return e;
        default:
          throw Error(B(451));
      }
    }
    function iu(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      Yg(e);
    }
    var ho = /* @__PURE__ */ new Map(), c1 = /* @__PURE__ */ new Set();
    function gd(e) {
      return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
    }
    var xr = Fe.d;
    Fe.d = { f: aM, r: oM, D: rM, C: nM, L: sM, m: lM, X: uM, S: iM, M: cM };
    function aM() {
      var e = xr.f(), t = Od();
      return e || t;
    }
    function oM(e) {
      var t = Ol(e);
      t !== null && t.tag === 5 && t.type === "form" ? VL(t) : xr.r(e);
    }
    var Nl = typeof document > "u" ? null : document;
    function QC(e, t, a) {
      var o = Nl;
      if (o && typeof t == "string" && t) {
        var r = uo(t);
        r = 'link[rel="' + e + '"][href="' + r + '"]', typeof a == "string" && (r += '[crossorigin="' + a + '"]'), c1.has(r) || (c1.add(r), e = { rel: e, crossOrigin: a, href: t }, o.querySelector(r) === null && (t = o.createElement("link"), na(t, "link", e), Wt(t), o.head.appendChild(t)));
      }
    }
    function rM(e) {
      xr.D(e), QC("dns-prefetch", e, null);
    }
    function nM(e, t) {
      xr.C(e, t), QC("preconnect", e, t);
    }
    function sM(e, t, a) {
      xr.L(e, t, a);
      var o = Nl;
      if (o && e && t) {
        var r = 'link[rel="preload"][as="' + uo(t) + '"]';
        t === "image" && a && a.imageSrcSet ? (r += '[imagesrcset="' + uo(a.imageSrcSet) + '"]', typeof a.imageSizes == "string" && (r += '[imagesizes="' + uo(a.imageSizes) + '"]')) : r += '[href="' + uo(e) + '"]';
        var n = r;
        switch (t) {
          case "style":
            n = Rl(e);
            break;
          case "script":
            n = Ul(e);
        }
        ho.has(n) || (e = dt({ rel: "preload", href: t === "image" && a && a.imageSrcSet ? void 0 : e, as: t }, a), ho.set(n, e), o.querySelector(r) !== null || t === "style" && o.querySelector(Ou(n)) || t === "script" && o.querySelector(Bu(n)) || (t = o.createElement("link"), na(t, "link", e), Wt(t), o.head.appendChild(t)));
      }
    }
    function lM(e, t) {
      xr.m(e, t);
      var a = Nl;
      if (a && e) {
        var o = t && typeof t.as == "string" ? t.as : "script", r = 'link[rel="modulepreload"][as="' + uo(o) + '"][href="' + uo(e) + '"]', n = r;
        switch (o) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            n = Ul(e);
        }
        if (!ho.has(n) && (e = dt({ rel: "modulepreload", href: e }, t), ho.set(n, e), a.querySelector(r) === null)) {
          switch (o) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (a.querySelector(Bu(n))) return;
          }
          o = a.createElement("link"), na(o, "link", e), Wt(o), a.head.appendChild(o);
        }
      }
    }
    function iM(e, t, a) {
      xr.S(e, t, a);
      var o = Nl;
      if (o && e) {
        var r = ml(o).hoistableStyles, n = Rl(e);
        t = t || "default";
        var s = r.get(n);
        if (!s) {
          var l = { loading: 0, preload: null };
          if (s = o.querySelector(Ou(n))) l.loading = 5;
          else {
            e = dt({ rel: "stylesheet", href: e, "data-precedence": t }, a), (a = ho.get(n)) && Ox(e, a);
            var i = s = o.createElement("link");
            Wt(i), na(i, "link", e), i._p = new Promise(function(u, c) {
              i.onload = u, i.onerror = c;
            }), i.addEventListener("load", function() {
              l.loading |= 1;
            }), i.addEventListener("error", function() {
              l.loading |= 2;
            }), l.loading |= 4, Ff(s, t, o);
          }
          s = { type: "stylesheet", instance: s, count: 1, state: l }, r.set(n, s);
        }
      }
    }
    function uM(e, t) {
      xr.X(e, t);
      var a = Nl;
      if (a && e) {
        var o = ml(a).hoistableScripts, r = Ul(e), n = o.get(r);
        n || (n = a.querySelector(Bu(r)), n || (e = dt({ src: e, async: true }, t), (t = ho.get(r)) && Bx(e, t), n = a.createElement("script"), Wt(n), na(n, "link", e), a.head.appendChild(n)), n = { type: "script", instance: n, count: 1, state: null }, o.set(r, n));
      }
    }
    function cM(e, t) {
      xr.M(e, t);
      var a = Nl;
      if (a && e) {
        var o = ml(a).hoistableScripts, r = Ul(e), n = o.get(r);
        n || (n = a.querySelector(Bu(r)), n || (e = dt({ src: e, async: true, type: "module" }, t), (t = ho.get(r)) && Bx(e, t), n = a.createElement("script"), Wt(n), na(n, "link", e), a.head.appendChild(n)), n = { type: "script", instance: n, count: 1, state: null }, o.set(r, n));
      }
    }
    function f1(e, t, a, o) {
      var r = (r = Qr.current) ? gd(r) : null;
      if (!r) throw Error(B(446));
      switch (e) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof a.precedence == "string" && typeof a.href == "string" ? (t = Rl(a.href), a = ml(r).hoistableStyles, o = a.get(t), o || (o = { type: "style", instance: null, count: 0, state: null }, a.set(t, o)), o) : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
            e = Rl(a.href);
            var n = ml(r).hoistableStyles, s = n.get(e);
            if (s || (r = r.ownerDocument || r, s = { type: "stylesheet", instance: null, count: 0, state: { loading: 0, preload: null } }, n.set(e, s), (n = r.querySelector(Ou(e))) && !n._p && (s.instance = n, s.state.loading = 5), ho.has(e) || (a = { rel: "preload", as: "style", href: a.href, crossOrigin: a.crossOrigin, integrity: a.integrity, media: a.media, hrefLang: a.hrefLang, referrerPolicy: a.referrerPolicy }, ho.set(e, a), n || fM(r, e, a, s.state))), t && o === null) throw Error(B(528, ""));
            return s;
          }
          if (t && o !== null) throw Error(B(529, ""));
          return null;
        case "script":
          return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ul(a), a = ml(r).hoistableScripts, o = a.get(t), o || (o = { type: "script", instance: null, count: 0, state: null }, a.set(t, o)), o) : { type: "void", instance: null, count: 0, state: null };
        default:
          throw Error(B(444, e));
      }
    }
    function Rl(e) {
      return 'href="' + uo(e) + '"';
    }
    function Ou(e) {
      return 'link[rel="stylesheet"][' + e + "]";
    }
    function $C(e) {
      return dt({}, e, { "data-precedence": e.precedence, precedence: null });
    }
    function fM(e, t, a, o) {
      e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? o.loading = 1 : (t = e.createElement("link"), o.preload = t, t.addEventListener("load", function() {
        return o.loading |= 1;
      }), t.addEventListener("error", function() {
        return o.loading |= 2;
      }), na(t, "link", a), Wt(t), e.head.appendChild(t));
    }
    function Ul(e) {
      return '[src="' + uo(e) + '"]';
    }
    function Bu(e) {
      return "script[async]" + e;
    }
    function d1(e, t, a) {
      if (t.count++, t.instance === null) switch (t.type) {
        case "style":
          var o = e.querySelector('style[data-href~="' + uo(a.href) + '"]');
          if (o) return t.instance = o, Wt(o), o;
          var r = dt({}, a, { "data-href": a.href, "data-precedence": a.precedence, href: null, precedence: null });
          return o = (e.ownerDocument || e).createElement("style"), Wt(o), na(o, "style", r), Ff(o, a.precedence, e), t.instance = o;
        case "stylesheet":
          r = Rl(a.href);
          var n = e.querySelector(Ou(r));
          if (n) return t.state.loading |= 4, t.instance = n, Wt(n), n;
          o = $C(a), (r = ho.get(r)) && Ox(o, r), n = (e.ownerDocument || e).createElement("link"), Wt(n);
          var s = n;
          return s._p = new Promise(function(l, i) {
            s.onload = l, s.onerror = i;
          }), na(n, "link", o), t.state.loading |= 4, Ff(n, a.precedence, e), t.instance = n;
        case "script":
          return n = Ul(a.src), (r = e.querySelector(Bu(n))) ? (t.instance = r, Wt(r), r) : (o = a, (r = ho.get(n)) && (o = dt({}, a), Bx(o, r)), e = e.ownerDocument || e, r = e.createElement("script"), Wt(r), na(r, "link", o), e.head.appendChild(r), t.instance = r);
        case "void":
          return null;
        default:
          throw Error(B(443, t.type));
      }
      else t.type === "stylesheet" && (t.state.loading & 4) === 0 && (o = t.instance, t.state.loading |= 4, Ff(o, a.precedence, e));
      return t.instance;
    }
    function Ff(e, t, a) {
      for (var o = a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), r = o.length ? o[o.length - 1] : null, n = r, s = 0; s < o.length; s++) {
        var l = o[s];
        if (l.dataset.precedence === t) n = l;
        else if (n !== r) break;
      }
      n ? n.parentNode.insertBefore(e, n.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(e, t.firstChild));
    }
    function Ox(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
    }
    function Bx(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
    }
    var Vf = null;
    function p1(e, t, a) {
      if (Vf === null) {
        var o = /* @__PURE__ */ new Map(), r = Vf = /* @__PURE__ */ new Map();
        r.set(a, o);
      } else r = Vf, o = r.get(a), o || (o = /* @__PURE__ */ new Map(), r.set(a, o));
      if (o.has(e)) return o;
      for (o.set(e, null), a = a.getElementsByTagName(e), r = 0; r < a.length; r++) {
        var n = a[r];
        if (!(n[Au] || n[aa] || e === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
          var s = n.getAttribute(t) || "";
          s = e + s;
          var l = o.get(s);
          l ? l.push(n) : o.set(s, [n]);
        }
      }
      return o;
    }
    function m1(e, t, a) {
      e = e.ownerDocument || e, e.head.insertBefore(a, t === "title" ? e.querySelector("head > title") : null);
    }
    function dM(e, t, a) {
      if (a === 1 || t.itemProp != null) return false;
      switch (e) {
        case "meta":
        case "title":
          return true;
        case "style":
          if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
          return true;
        case "link":
          if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
          return t.rel === "stylesheet" ? (e = t.disabled, typeof t.precedence == "string" && e == null) : true;
        case "script":
          if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return true;
      }
      return false;
    }
    function JC(e) {
      return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
    }
    function pM(e, t, a, o) {
      if (a.type === "stylesheet" && (typeof o.media != "string" || matchMedia(o.media).matches !== false) && (a.state.loading & 4) === 0) {
        if (a.instance === null) {
          var r = Rl(o.href), n = t.querySelector(Ou(r));
          if (n) {
            t = n._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = xd.bind(e), t.then(e, e)), a.state.loading |= 4, a.instance = n, Wt(n);
            return;
          }
          n = t.ownerDocument || t, o = $C(o), (r = ho.get(r)) && Ox(o, r), n = n.createElement("link"), Wt(n);
          var s = n;
          s._p = new Promise(function(l, i) {
            s.onload = l, s.onerror = i;
          }), na(n, "link", o), a.instance = n;
        }
        e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (e.count++, a = xd.bind(e), t.addEventListener("load", a), t.addEventListener("error", a));
      }
    }
    var Kh = 0;
    function mM(e, t) {
      return e.stylesheets && e.count === 0 && Gf(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(a) {
        var o = setTimeout(function() {
          if (e.stylesheets && Gf(e, e.stylesheets), e.unsuspend) {
            var n = e.unsuspend;
            e.unsuspend = null, n();
          }
        }, 6e4 + t);
        0 < e.imgBytes && Kh === 0 && (Kh = 62500 * YR());
        var r = setTimeout(function() {
          if (e.waitingForImages = false, e.count === 0 && (e.stylesheets && Gf(e, e.stylesheets), e.unsuspend)) {
            var n = e.unsuspend;
            e.unsuspend = null, n();
          }
        }, (e.imgBytes > Kh ? 50 : 800) + t);
        return e.unsuspend = a, function() {
          e.unsuspend = null, clearTimeout(o), clearTimeout(r);
        };
      } : null;
    }
    function xd() {
      if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
        if (this.stylesheets) Gf(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          this.unsuspend = null, e();
        }
      }
    }
    var bd = null;
    function Gf(e, t) {
      e.stylesheets = null, e.unsuspend !== null && (e.count++, bd = /* @__PURE__ */ new Map(), t.forEach(hM, e), bd = null, xd.call(e));
    }
    function hM(e, t) {
      if (!(t.state.loading & 4)) {
        var a = bd.get(e);
        if (a) var o = a.get(null);
        else {
          a = /* @__PURE__ */ new Map(), bd.set(e, a);
          for (var r = e.querySelectorAll("link[data-precedence],style[data-precedence]"), n = 0; n < r.length; n++) {
            var s = r[n];
            (s.nodeName === "LINK" || s.getAttribute("media") !== "not all") && (a.set(s.dataset.precedence, s), o = s);
          }
          o && a.set(null, o);
        }
        r = t.instance, s = r.getAttribute("data-precedence"), n = a.get(s) || o, n === o && a.set(null, r), a.set(s, r), this.count++, o = xd.bind(this), r.addEventListener("load", o), r.addEventListener("error", o), n ? n.parentNode.insertBefore(r, n.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(r, e.firstChild)), t.state.loading |= 4;
      }
    }
    var Su = { $$typeof: sr, Provider: null, Consumer: null, _currentValue: Gn, _currentValue2: Gn, _threadCount: 0 };
    function gM(e, t, a, o, r, n, s, l, i) {
      this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = yh(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = yh(0), this.hiddenUpdates = yh(null), this.identifierPrefix = o, this.onUncaughtError = r, this.onCaughtError = n, this.onRecoverableError = s, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = i, this.incompleteTransitions = /* @__PURE__ */ new Map();
    }
    function ev(e, t, a, o, r, n, s, l, i, u, c, d) {
      return e = new gM(e, t, a, s, i, u, c, d, l), t = 1, n === true && (t |= 24), n = ja(3, null, null, t), e.current = n, n.stateNode = e, t = sx(), t.refCount++, e.pooledCache = t, t.refCount++, n.memoizedState = { element: o, isDehydrated: a, cache: t }, ux(n), e;
    }
    function tv(e) {
      return e ? (e = cl, e) : cl;
    }
    function av(e, t, a, o, r, n) {
      r = tv(r), o.context === null ? o.context = r : o.pendingContext = r, o = Jr(t), o.payload = { element: a }, n = n === void 0 ? null : n, n !== null && (o.callback = n), a = en(e, o, t), a !== null && (Ba(a, e, t), eu(a, e, t));
    }
    function h1(e, t) {
      if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
        var a = e.retryLane;
        e.retryLane = a !== 0 && a < t ? a : t;
      }
    }
    function _x(e, t) {
      h1(e, t), (e = e.alternate) && h1(e, t);
    }
    function ov(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = os(e, 67108864);
        t !== null && Ba(t, e, 67108864), _x(e, 67108864);
      }
    }
    function g1(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Wa();
        t = Xg(t);
        var a = os(e, t);
        a !== null && Ba(a, e, t), _x(e, t);
      }
    }
    var yd = true;
    function xM(e, t, a, o) {
      var r = fe.T;
      fe.T = null;
      var n = Fe.p;
      try {
        Fe.p = 2, Px(e, t, a, o);
      } finally {
        Fe.p = n, fe.T = r;
      }
    }
    function bM(e, t, a, o) {
      var r = fe.T;
      fe.T = null;
      var n = Fe.p;
      try {
        Fe.p = 8, Px(e, t, a, o);
      } finally {
        Fe.p = n, fe.T = r;
      }
    }
    function Px(e, t, a, o) {
      if (yd) {
        var r = qg(o);
        if (r === null) jh(e, t, o, Sd, a), x1(e, o);
        else if (SM(r, e, t, a, o)) o.stopPropagation();
        else if (x1(e, o), t & 4 && -1 < yM.indexOf(e)) {
          for (; r !== null; ) {
            var n = Ol(r);
            if (n !== null) switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var s = qn(n.pendingLanes);
                  if (s !== 0) {
                    var l = n;
                    for (l.pendingLanes |= 2, l.entangledLanes |= 2; s; ) {
                      var i = 1 << 31 - Za(s);
                      l.entanglements[1] |= i, s &= ~i;
                    }
                    Uo(n), (qe & 6) === 0 && (ud = Ka() + 500, Du(0, false));
                  }
                }
                break;
              case 31:
              case 13:
                l = os(n, 2), l !== null && Ba(l, n, 2), Od(), _x(n, 2);
            }
            if (n = qg(o), n === null && jh(e, t, o, Sd, a), n === r) break;
            r = n;
          }
          r !== null && o.stopPropagation();
        } else jh(e, t, o, null, a);
      }
    }
    function qg(e) {
      return e = Wg(e), Nx(e);
    }
    var Sd = null;
    function Nx(e) {
      if (Sd = null, e = rl(e), e !== null) {
        var t = vu(e);
        if (t === null) e = null;
        else {
          var a = t.tag;
          if (a === 13) {
            if (e = v1(t), e !== null) return e;
            e = null;
          } else if (a === 31) {
            if (e = w1(t), e !== null) return e;
            e = null;
          } else if (a === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return Sd = e, null;
    }
    function rv(e) {
      switch (e) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (sk()) {
            case T1:
              return 2;
            case k1:
              return 8;
            case Zf:
            case lk:
              return 32;
            case R1:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Fg = false, on = null, rn = null, nn = null, Lu = /* @__PURE__ */ new Map(), Cu = /* @__PURE__ */ new Map(), jr = [], yM = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function x1(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          on = null;
          break;
        case "dragenter":
        case "dragleave":
          rn = null;
          break;
        case "mouseover":
        case "mouseout":
          nn = null;
          break;
        case "pointerover":
        case "pointerout":
          Lu.delete(t.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Cu.delete(t.pointerId);
      }
    }
    function Vi(e, t, a, o, r, n) {
      return e === null || e.nativeEvent !== n ? (e = { blockedOn: t, domEventName: a, eventSystemFlags: o, nativeEvent: n, targetContainers: [r] }, t !== null && (t = Ol(t), t !== null && ov(t)), e) : (e.eventSystemFlags |= o, t = e.targetContainers, r !== null && t.indexOf(r) === -1 && t.push(r), e);
    }
    function SM(e, t, a, o, r) {
      switch (t) {
        case "focusin":
          return on = Vi(on, e, t, a, o, r), true;
        case "dragenter":
          return rn = Vi(rn, e, t, a, o, r), true;
        case "mouseover":
          return nn = Vi(nn, e, t, a, o, r), true;
        case "pointerover":
          var n = r.pointerId;
          return Lu.set(n, Vi(Lu.get(n) || null, e, t, a, o, r)), true;
        case "gotpointercapture":
          return n = r.pointerId, Cu.set(n, Vi(Cu.get(n) || null, e, t, a, o, r)), true;
      }
      return false;
    }
    function nv(e) {
      var t = rl(e.target);
      if (t !== null) {
        var a = vu(t);
        if (a !== null) {
          if (t = a.tag, t === 13) {
            if (t = v1(a), t !== null) {
              e.blockedOn = t, eS(e.priority, function() {
                g1(a);
              });
              return;
            }
          } else if (t === 31) {
            if (t = w1(a), t !== null) {
              e.blockedOn = t, eS(e.priority, function() {
                g1(a);
              });
              return;
            }
          } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
            e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function jf(e) {
      if (e.blockedOn !== null) return false;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var a = qg(e.nativeEvent);
        if (a === null) {
          a = e.nativeEvent;
          var o = new a.constructor(a.type, a);
          sg = o, a.target.dispatchEvent(o), sg = null;
        } else return t = Ol(a), t !== null && ov(t), e.blockedOn = a, false;
        t.shift();
      }
      return true;
    }
    function b1(e, t, a) {
      jf(e) && a.delete(t);
    }
    function LM() {
      Fg = false, on !== null && jf(on) && (on = null), rn !== null && jf(rn) && (rn = null), nn !== null && jf(nn) && (nn = null), Lu.forEach(b1), Cu.forEach(b1);
    }
    function kf(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Fg || (Fg = true, Gt.unstable_scheduleCallback(Gt.unstable_NormalPriority, LM)));
    }
    var Rf = null;
    function y1(e) {
      Rf !== e && (Rf = e, Gt.unstable_scheduleCallback(Gt.unstable_NormalPriority, function() {
        Rf === e && (Rf = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t], o = e[t + 1], r = e[t + 2];
          if (typeof o != "function") {
            if (Nx(o || a) === null) continue;
            break;
          }
          var n = Ol(a);
          n !== null && (e.splice(t, 3), t -= 3, Cg(n, { pending: true, data: r, method: a.method, action: o }, o, r));
        }
      }));
    }
    function Ml(e) {
      function t(i) {
        return kf(i, e);
      }
      on !== null && kf(on, e), rn !== null && kf(rn, e), nn !== null && kf(nn, e), Lu.forEach(t), Cu.forEach(t);
      for (var a = 0; a < jr.length; a++) {
        var o = jr[a];
        o.blockedOn === e && (o.blockedOn = null);
      }
      for (; 0 < jr.length && (a = jr[0], a.blockedOn === null); ) nv(a), a.blockedOn === null && jr.shift();
      if (a = (e.ownerDocument || e).$$reactFormReplay, a != null) for (o = 0; o < a.length; o += 3) {
        var r = a[o], n = a[o + 1], s = r[_a] || null;
        if (typeof n == "function") s || y1(a);
        else if (s) {
          var l = null;
          if (n && n.hasAttribute("formAction")) {
            if (r = n, s = n[_a] || null) l = s.formAction;
            else if (Nx(r) !== null) continue;
          } else l = s.action;
          typeof l == "function" ? a[o + 1] = l : (a.splice(o, 3), o -= 3), y1(a);
        }
      }
    }
    function sv() {
      function e(n) {
        n.canIntercept && n.info === "react-transition" && n.intercept({ handler: function() {
          return new Promise(function(s) {
            return r = s;
          });
        }, focusReset: "manual", scroll: "manual" });
      }
      function t() {
        r !== null && (r(), r = null), o || setTimeout(a, 20);
      }
      function a() {
        if (!o && !navigation.transition) {
          var n = navigation.currentEntry;
          n && n.url != null && navigation.navigate(n.url, { state: n.getState(), info: "react-transition", history: "replace" });
        }
      }
      if (typeof navigation == "object") {
        var o = false, r = null;
        return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
          o = true, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), r !== null && (r(), r = null);
        };
      }
    }
    function Ux(e) {
      this._internalRoot = e;
    }
    Pd.prototype.render = Ux.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null) throw Error(B(409));
      var a = t.current, o = Wa();
      av(a, o, e, t, null, null);
    };
    Pd.prototype.unmount = Ux.prototype.unmount = function() {
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        av(e.current, 2, null, e, null, null), Od(), t[Dl] = null;
      }
    };
    function Pd(e) {
      this._internalRoot = e;
    }
    Pd.prototype.unstable_scheduleHydration = function(e) {
      if (e) {
        var t = _1();
        e = { blockedOn: null, target: e, priority: t };
        for (var a = 0; a < jr.length && t !== 0 && t < jr[a].priority; a++) ;
        jr.splice(a, 0, e), a === 0 && nv(e);
      }
    };
    var S1 = L1.version;
    if (S1 !== "19.2.8") throw Error(B(527, S1, "19.2.8"));
    Fe.findDOMNode = function(e) {
      var t = e._reactInternals;
      if (t === void 0) throw typeof e.render == "function" ? Error(B(188)) : (e = Object.keys(e).join(","), Error(B(268, e)));
      return e = JT(t), e = e !== null ? I1(e) : null, e = e === null ? null : e.stateNode, e;
    };
    var CM = { bundleType: 0, version: "19.2.8", rendererPackageName: "react-dom", currentDispatcherRef: fe, reconcilerVersion: "19.2.8" };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && (Gi = __REACT_DEVTOOLS_GLOBAL_HOOK__, !Gi.isDisabled && Gi.supportsFiber)) try {
      wu = Gi.inject(CM), Ya = Gi;
    } catch {
    }
    var Gi;
    Nd.createRoot = function(e, t) {
      if (!C1(e)) throw Error(B(299));
      var a = false, o = "", r = QL, n = $L, s = JL;
      return t != null && (t.unstable_strictMode === true && (a = true), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onUncaughtError !== void 0 && (r = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (s = t.onRecoverableError)), t = ev(e, 1, false, null, null, a, o, null, r, n, s, sv), e[Dl] = t.current, Dx(e), new Ux(t);
    };
    Nd.hydrateRoot = function(e, t, a) {
      if (!C1(e)) throw Error(B(299));
      var o = false, r = "", n = QL, s = $L, l = JL, i = null;
      return a != null && (a.unstable_strictMode === true && (o = true), a.identifierPrefix !== void 0 && (r = a.identifierPrefix), a.onUncaughtError !== void 0 && (n = a.onUncaughtError), a.onCaughtError !== void 0 && (s = a.onCaughtError), a.onRecoverableError !== void 0 && (l = a.onRecoverableError), a.formState !== void 0 && (i = a.formState)), t = ev(e, 1, true, t, a ?? null, o, r, i, n, s, l, sv), t.context = tv(null), a = t.current, o = Wa(), o = Xg(o), r = Jr(o), r.callback = null, en(a, r, o), a = o, t.current.lanes = a, Eu(t, a), Uo(t), e[Dl] = t.current, Dx(e), new Pd(t);
    };
    Nd.version = "19.2.8";
  });
  var cv = tt((k5, uv) => {
    "use strict";
    function iv() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(iv);
      } catch (e) {
        console.error(e);
      }
    }
    iv(), uv.exports = lv();
  });
  var iw = tt((op) => {
    "use strict";
    var HO = Symbol.for("react.transitional.element"), zO = Symbol.for("react.fragment");
    function lw(e, t, a) {
      var o = null;
      if (a !== void 0 && (o = "" + a), t.key !== void 0 && (o = "" + t.key), "key" in t) {
        a = {};
        for (var r in t) r !== "key" && (a[r] = t[r]);
      } else a = t;
      return t = a.ref, { $$typeof: HO, type: e, key: o, ref: t !== void 0 ? t : null, props: a };
    }
    op.Fragment = zO;
    op.jsx = lw;
    op.jsxs = lw;
  });
  var mt = tt((yH, uw) => {
    "use strict";
    uw.exports = iw();
  });
  var Pw = tt((_w) => {
    "use strict";
    var Wl = F();
    function sB(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var lB = typeof Object.is == "function" ? Object.is : sB, iB = Wl.useState, uB = Wl.useEffect, cB = Wl.useLayoutEffect, fB = Wl.useDebugValue;
    function dB(e, t) {
      var a = t(), o = iB({ inst: { value: a, getSnapshot: t } }), r = o[0].inst, n = o[1];
      return cB(function() {
        r.value = a, r.getSnapshot = t, P0(r) && n({ inst: r });
      }, [e, a, t]), uB(function() {
        return P0(r) && n({ inst: r }), e(function() {
          P0(r) && n({ inst: r });
        });
      }, [e]), fB(a), a;
    }
    function P0(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var a = t();
        return !lB(e, a);
      } catch {
        return true;
      }
    }
    function pB(e, t) {
      return t();
    }
    var mB = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? pB : dB;
    _w.useSyncExternalStore = Wl.useSyncExternalStore !== void 0 ? Wl.useSyncExternalStore : mB;
  });
  var Ic = tt((bq, Nw) => {
    "use strict";
    Nw.exports = Pw();
  });
  var Hw = tt((Uw) => {
    "use strict";
    var hp = F(), hB = Ic();
    function gB(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var xB = typeof Object.is == "function" ? Object.is : gB, bB = hB.useSyncExternalStore, yB = hp.useRef, SB = hp.useEffect, LB = hp.useMemo, CB = hp.useDebugValue;
    Uw.useSyncExternalStoreWithSelector = function(e, t, a, o, r) {
      var n = yB(null);
      if (n.current === null) {
        var s = { hasValue: false, value: null };
        n.current = s;
      } else s = n.current;
      n = LB(function() {
        function i(p) {
          if (!u) {
            if (u = true, c = p, p = o(p), r !== void 0 && s.hasValue) {
              var x = s.value;
              if (r(x, p)) return d = x;
            }
            return d = p;
          }
          if (x = d, xB(c, p)) return x;
          var S = o(p);
          return r !== void 0 && r(x, S) ? (c = p, x) : (c = p, d = S);
        }
        var u = false, c, d, f = a === void 0 ? null : a;
        return [function() {
          return i(t());
        }, f === null ? void 0 : function() {
          return i(f());
        }];
      }, [t, a, o, r]);
      var l = bB(e, n[0], n[1]);
      return SB(function() {
        s.hasValue = true, s.value = l;
      }, [l]), CB(l), l;
    };
  });
  var qw = tt((Sq, zw) => {
    "use strict";
    zw.exports = Hw();
  });
  var cE = tt(() => {
    "use strict";
  });
  var LE = tt((pm) => {
    "use strict";
    Object.defineProperty(pm, "__esModule", { value: true });
    pm.crypto = void 0;
    pm.crypto = { node: void 0, web: typeof self == "object" && "crypto" in self ? self.crypto : void 0 };
  });
  var Ms = tt((we) => {
    "use strict";
    Object.defineProperty(we, "__esModule", { value: true });
    we.randomBytes = we.wrapConstructorWithOpts = we.wrapConstructor = we.checkOpts = we.Hash = we.concatBytes = we.toBytes = we.utf8ToBytes = we.asyncLoop = we.nextTick = we.hexToBytes = we.bytesToHex = we.isLE = we.rotr = we.createView = we.u32 = we.u8 = void 0;
    var mm = LE(), D3 = (e) => new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    we.u8 = D3;
    var O3 = (e) => new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
    we.u32 = O3;
    var B3 = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength);
    we.createView = B3;
    var _3 = (e, t) => e << 32 - t | e >>> t;
    we.rotr = _3;
    we.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
    if (!we.isLE) throw new Error("Non little-endian hardware is not supported");
    var P3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
    function N3(e) {
      if (!(e instanceof Uint8Array)) throw new Error("Uint8Array expected");
      let t = "";
      for (let a = 0; a < e.length; a++) t += P3[e[a]];
      return t;
    }
    we.bytesToHex = N3;
    function U3(e) {
      if (typeof e != "string") throw new TypeError("hexToBytes: expected string, got " + typeof e);
      if (e.length % 2) throw new Error("hexToBytes: received invalid unpadded hex");
      let t = new Uint8Array(e.length / 2);
      for (let a = 0; a < t.length; a++) {
        let o = a * 2, r = e.slice(o, o + 2), n = Number.parseInt(r, 16);
        if (Number.isNaN(n) || n < 0) throw new Error("Invalid byte sequence");
        t[a] = n;
      }
      return t;
    }
    we.hexToBytes = U3;
    var H3 = async () => {
    };
    we.nextTick = H3;
    async function z3(e, t, a) {
      let o = Date.now();
      for (let r = 0; r < e; r++) {
        a(r);
        let n = Date.now() - o;
        n >= 0 && n < t || (await (0, we.nextTick)(), o += n);
      }
    }
    we.asyncLoop = z3;
    function CE(e) {
      if (typeof e != "string") throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
      return new TextEncoder().encode(e);
    }
    we.utf8ToBytes = CE;
    function Tb(e) {
      if (typeof e == "string" && (e = CE(e)), !(e instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
      return e;
    }
    we.toBytes = Tb;
    function q3(...e) {
      if (!e.every((o) => o instanceof Uint8Array)) throw new Error("Uint8Array list expected");
      if (e.length === 1) return e[0];
      let t = e.reduce((o, r) => o + r.length, 0), a = new Uint8Array(t);
      for (let o = 0, r = 0; o < e.length; o++) {
        let n = e[o];
        a.set(n, r), r += n.length;
      }
      return a;
    }
    we.concatBytes = q3;
    var Ab = class {
      clone() {
        return this._cloneInto();
      }
    };
    we.Hash = Ab;
    var F3 = (e) => Object.prototype.toString.call(e) === "[object Object]" && e.constructor === Object;
    function V3(e, t) {
      if (t !== void 0 && (typeof t != "object" || !F3(t))) throw new TypeError("Options should be object or undefined");
      return Object.assign(e, t);
    }
    we.checkOpts = V3;
    function G3(e) {
      let t = (o) => e().update(Tb(o)).digest(), a = e();
      return t.outputLen = a.outputLen, t.blockLen = a.blockLen, t.create = () => e(), t;
    }
    we.wrapConstructor = G3;
    function j3(e) {
      let t = (o, r) => e(r).update(Tb(o)).digest(), a = e({});
      return t.outputLen = a.outputLen, t.blockLen = a.blockLen, t.create = (o) => e(o), t;
    }
    we.wrapConstructorWithOpts = j3;
    function X3(e = 32) {
      if (mm.crypto.web) return mm.crypto.web.getRandomValues(new Uint8Array(e));
      if (mm.crypto.node) return new Uint8Array(mm.crypto.node.randomBytes(e).buffer);
      throw new Error("The environment doesn't have randomBytes function");
    }
    we.randomBytes = X3;
  });
  var kb = tt((ha) => {
    "use strict";
    Object.defineProperty(ha, "__esModule", { value: true });
    ha.c32decode = ha.c32normalize = ha.c32encode = ha.c32 = void 0;
    var K3 = Ms();
    ha.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    var qc = "0123456789abcdef";
    function Y3(e, t) {
      if (!e.match(/^[0-9a-fA-F]*$/)) throw new Error("Not a hex-encoded string");
      e.length % 2 !== 0 && (e = `0${e}`), e = e.toLowerCase();
      let a = [], o = 0;
      for (let l = e.length - 1; l >= 0; l--) if (o < 4) {
        let i = qc.indexOf(e[l]) >> o, u = 0;
        l !== 0 && (u = qc.indexOf(e[l - 1]));
        let c = 1 + o, d = u % (1 << c) << 5 - c, f = ha.c32[i + d];
        o = c, a.unshift(f);
      } else o = 0;
      let r = 0;
      for (let l = 0; l < a.length && a[l] === "0"; l++) r++;
      a = a.slice(r);
      let n = new TextDecoder().decode((0, K3.hexToBytes)(e)).match(/^\u0000*/), s = n ? n[0].length : 0;
      for (let l = 0; l < s; l++) a.unshift(ha.c32[0]);
      if (t) {
        let l = t - a.length;
        for (let i = 0; i < l; i++) a.unshift(ha.c32[0]);
      }
      return a.join("");
    }
    ha.c32encode = Y3;
    function vE(e) {
      return e.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
    }
    ha.c32normalize = vE;
    function Z3(e, t) {
      if (e = vE(e), !e.match(`^[${ha.c32}]*$`)) throw new Error("Not a c32-encoded string");
      let a = e.match(`^${ha.c32[0]}*`), o = a ? a[0].length : 0, r = [], n = 0, s = 0;
      for (let u = e.length - 1; u >= 0; u--) {
        s === 4 && (r.unshift(qc[n]), s = 0, n = 0);
        let d = (ha.c32.indexOf(e[u]) << s) + n, f = qc[d % 16];
        if (s += 1, n = d >> 4, n > 1 << s) throw new Error("Panic error in decoding.");
        r.unshift(f);
      }
      r.unshift(qc[n]), r.length % 2 === 1 && r.unshift("0");
      let l = 0;
      for (let u = 0; u < r.length && r[u] === "0"; u++) l++;
      r = r.slice(l - l % 2);
      let i = r.join("");
      for (let u = 0; u < o; u++) i = `00${i}`;
      if (t) {
        let u = t * 2 - i.length;
        for (let c = 0; c < u; c += 2) i = `00${i}`;
      }
      return i;
    }
    ha.c32decode = Z3;
  });
  var TE = tt((Ia) => {
    "use strict";
    Object.defineProperty(Ia, "__esModule", { value: true });
    Ia.output = Ia.exists = Ia.hash = Ia.bytes = Ia.bool = Ia.number = void 0;
    function hm(e) {
      if (!Number.isSafeInteger(e) || e < 0) throw new Error(`Wrong positive integer: ${e}`);
    }
    Ia.number = hm;
    function wE(e) {
      if (typeof e != "boolean") throw new Error(`Expected boolean, not ${e}`);
    }
    Ia.bool = wE;
    function Rb(e, ...t) {
      if (!(e instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
      if (t.length > 0 && !t.includes(e.length)) throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
    }
    Ia.bytes = Rb;
    function IE(e) {
      if (typeof e != "function" || typeof e.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
      hm(e.outputLen), hm(e.blockLen);
    }
    Ia.hash = IE;
    function EE(e, t = true) {
      if (e.destroyed) throw new Error("Hash instance has been destroyed");
      if (t && e.finished) throw new Error("Hash#digest() has already been called");
    }
    Ia.exists = EE;
    function AE(e, t) {
      Rb(e);
      let a = t.outputLen;
      if (e.length < a) throw new Error(`digestInto() expects output buffer of length at least ${a}`);
    }
    Ia.output = AE;
    var W3 = { number: hm, bool: wE, bytes: Rb, hash: IE, exists: EE, output: AE };
    Ia.default = W3;
  });
  var kE = tt((gm) => {
    "use strict";
    Object.defineProperty(gm, "__esModule", { value: true });
    gm.SHA2 = void 0;
    var Mb = TE(), Fc = Ms();
    function Q3(e, t, a, o) {
      if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, a, o);
      let r = BigInt(32), n = BigInt(4294967295), s = Number(a >> r & n), l = Number(a & n), i = o ? 4 : 0, u = o ? 0 : 4;
      e.setUint32(t + i, s, o), e.setUint32(t + u, l, o);
    }
    var Db = class extends Fc.Hash {
      constructor(t, a, o, r) {
        super(), this.blockLen = t, this.outputLen = a, this.padOffset = o, this.isLE = r, this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.buffer = new Uint8Array(t), this.view = (0, Fc.createView)(this.buffer);
      }
      update(t) {
        Mb.default.exists(this);
        let { view: a, buffer: o, blockLen: r } = this;
        t = (0, Fc.toBytes)(t);
        let n = t.length;
        for (let s = 0; s < n; ) {
          let l = Math.min(r - this.pos, n - s);
          if (l === r) {
            let i = (0, Fc.createView)(t);
            for (; r <= n - s; s += r) this.process(i, s);
            continue;
          }
          o.set(t.subarray(s, s + l), this.pos), this.pos += l, s += l, this.pos === r && (this.process(a, 0), this.pos = 0);
        }
        return this.length += t.length, this.roundClean(), this;
      }
      digestInto(t) {
        Mb.default.exists(this), Mb.default.output(t, this), this.finished = true;
        let { buffer: a, view: o, blockLen: r, isLE: n } = this, { pos: s } = this;
        a[s++] = 128, this.buffer.subarray(s).fill(0), this.padOffset > r - s && (this.process(o, 0), s = 0);
        for (let d = s; d < r; d++) a[d] = 0;
        Q3(o, r - 8, BigInt(this.length * 8), n), this.process(o, 0);
        let l = (0, Fc.createView)(t), i = this.outputLen;
        if (i % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
        let u = i / 4, c = this.get();
        if (u > c.length) throw new Error("_sha2: outputLen bigger than state");
        for (let d = 0; d < u; d++) l.setUint32(4 * d, c[d], n);
      }
      digest() {
        let { buffer: t, outputLen: a } = this;
        this.digestInto(t);
        let o = t.slice(0, a);
        return this.destroy(), o;
      }
      _cloneInto(t) {
        t || (t = new this.constructor()), t.set(...this.get());
        let { blockLen: a, buffer: o, length: r, finished: n, destroyed: s, pos: l } = this;
        return t.length = r, t.pos = l, t.finished = n, t.destroyed = s, r % a && t.buffer.set(o), t;
      }
    };
    gm.SHA2 = Db;
  });
  var Bb = tt((fi) => {
    "use strict";
    Object.defineProperty(fi, "__esModule", { value: true });
    fi.sha224 = fi.sha256 = void 0;
    var $3 = kE(), yo = Ms(), J3 = (e, t, a) => e & t ^ ~e & a, eP = (e, t, a) => e & t ^ e & a ^ t & a, tP = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), Rn = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), Mn = new Uint32Array(64), xm = class extends $3.SHA2 {
      constructor() {
        super(64, 32, 8, false), this.A = Rn[0] | 0, this.B = Rn[1] | 0, this.C = Rn[2] | 0, this.D = Rn[3] | 0, this.E = Rn[4] | 0, this.F = Rn[5] | 0, this.G = Rn[6] | 0, this.H = Rn[7] | 0;
      }
      get() {
        let { A: t, B: a, C: o, D: r, E: n, F: s, G: l, H: i } = this;
        return [t, a, o, r, n, s, l, i];
      }
      set(t, a, o, r, n, s, l, i) {
        this.A = t | 0, this.B = a | 0, this.C = o | 0, this.D = r | 0, this.E = n | 0, this.F = s | 0, this.G = l | 0, this.H = i | 0;
      }
      process(t, a) {
        for (let d = 0; d < 16; d++, a += 4) Mn[d] = t.getUint32(a, false);
        for (let d = 16; d < 64; d++) {
          let f = Mn[d - 15], p = Mn[d - 2], x = (0, yo.rotr)(f, 7) ^ (0, yo.rotr)(f, 18) ^ f >>> 3, S = (0, yo.rotr)(p, 17) ^ (0, yo.rotr)(p, 19) ^ p >>> 10;
          Mn[d] = S + Mn[d - 7] + x + Mn[d - 16] | 0;
        }
        let { A: o, B: r, C: n, D: s, E: l, F: i, G: u, H: c } = this;
        for (let d = 0; d < 64; d++) {
          let f = (0, yo.rotr)(l, 6) ^ (0, yo.rotr)(l, 11) ^ (0, yo.rotr)(l, 25), p = c + f + J3(l, i, u) + tP[d] + Mn[d] | 0, S = ((0, yo.rotr)(o, 2) ^ (0, yo.rotr)(o, 13) ^ (0, yo.rotr)(o, 22)) + eP(o, r, n) | 0;
          c = u, u = i, i = l, l = s + p | 0, s = n, n = r, r = o, o = p + S | 0;
        }
        o = o + this.A | 0, r = r + this.B | 0, n = n + this.C | 0, s = s + this.D | 0, l = l + this.E | 0, i = i + this.F | 0, u = u + this.G | 0, c = c + this.H | 0, this.set(o, r, n, s, l, i, u, c);
      }
      roundClean() {
        Mn.fill(0);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
      }
    }, Ob = class extends xm {
      constructor() {
        super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
      }
    };
    fi.sha256 = (0, yo.wrapConstructor)(() => new xm());
    fi.sha224 = (0, yo.wrapConstructor)(() => new Ob());
  });
  var _b = tt((di) => {
    "use strict";
    Object.defineProperty(di, "__esModule", { value: true });
    di.c32checkDecode = di.c32checkEncode = void 0;
    var RE = Bb(), ME = Ms(), Vc = kb();
    function DE(e) {
      let t = (0, RE.sha256)((0, RE.sha256)((0, ME.hexToBytes)(e)));
      return (0, ME.bytesToHex)(t.slice(0, 4));
    }
    function aP(e, t) {
      if (e < 0 || e >= 32) throw new Error("Invalid version (must be between 0 and 31)");
      if (!t.match(/^[0-9a-fA-F]*$/)) throw new Error("Invalid data (not a hex string)");
      t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
      let a = e.toString(16);
      a.length === 1 && (a = `0${a}`);
      let o = DE(`${a}${t}`), r = (0, Vc.c32encode)(`${t}${o}`);
      return `${Vc.c32[e]}${r}`;
    }
    di.c32checkEncode = aP;
    function oP(e) {
      e = (0, Vc.c32normalize)(e);
      let t = (0, Vc.c32decode)(e.slice(1)), a = e[0], o = Vc.c32.indexOf(a), r = t.slice(-8), n = o.toString(16);
      if (n.length === 1 && (n = `0${n}`), DE(`${n}${t.substring(0, t.length - 8)}`) !== r) throw new Error("Invalid c32check string: checksum mismatch");
      return [o, t.substring(0, t.length - 8)];
    }
    di.c32checkDecode = oP;
  });
  var BE = tt((gj, OE) => {
    "use strict";
    function rP(e) {
      if (e.length >= 255) throw new TypeError("Alphabet too long");
      for (var t = new Uint8Array(256), a = 0; a < t.length; a++) t[a] = 255;
      for (var o = 0; o < e.length; o++) {
        var r = e.charAt(o), n = r.charCodeAt(0);
        if (t[n] !== 255) throw new TypeError(r + " is ambiguous");
        t[n] = o;
      }
      var s = e.length, l = e.charAt(0), i = Math.log(s) / Math.log(256), u = Math.log(256) / Math.log(s);
      function c(p) {
        if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
        if (p.length === 0) return "";
        for (var x = 0, S = 0, v = 0, g = p.length; v !== g && p[v] === 0; ) v++, x++;
        for (var m = (g - v) * u + 1 >>> 0, b = new Uint8Array(m); v !== g; ) {
          for (var y = p[v], C = 0, D = m - 1; (y !== 0 || C < S) && D !== -1; D--, C++) y += 256 * b[D] >>> 0, b[D] = y % s >>> 0, y = y / s >>> 0;
          if (y !== 0) throw new Error("Non-zero carry");
          S = C, v++;
        }
        for (var I = m - S; I !== m && b[I] === 0; ) I++;
        for (var w = l.repeat(x); I < m; ++I) w += e.charAt(b[I]);
        return w;
      }
      function d(p) {
        if (typeof p != "string") throw new TypeError("Expected String");
        if (p.length === 0) return new Uint8Array();
        for (var x = 0, S = 0, v = 0; p[x] === l; ) S++, x++;
        for (var g = (p.length - x) * i + 1 >>> 0, m = new Uint8Array(g); p[x]; ) {
          var b = p.charCodeAt(x);
          if (b > 255) return;
          var y = t[b];
          if (y === 255) return;
          for (var C = 0, D = g - 1; (y !== 0 || C < v) && D !== -1; D--, C++) y += s * m[D] >>> 0, m[D] = y % 256 >>> 0, y = y / 256 >>> 0;
          if (y !== 0) throw new Error("Non-zero carry");
          v = C, x++;
        }
        for (var I = g - v; I !== g && m[I] === 0; ) I++;
        for (var w = new Uint8Array(S + (g - I)), M = S; I !== g; ) w[M++] = m[I++];
        return w;
      }
      function f(p) {
        var x = d(p);
        if (x) return x;
        throw new Error("Non-base" + s + " character");
      }
      return { encode: c, decodeUnsafe: d, decode: f };
    }
    OE.exports = rP;
  });
  var UE = tt((pi) => {
    "use strict";
    Object.defineProperty(pi, "__esModule", { value: true });
    pi.decode = pi.encode = void 0;
    var bm = Bb(), _E = Ms(), PE = BE(), NE = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    function nP(e, t = "00") {
      let a = typeof e == "string" ? (0, _E.hexToBytes)(e) : e, o = typeof t == "string" ? (0, _E.hexToBytes)(t) : e;
      if (!(a instanceof Uint8Array) || !(o instanceof Uint8Array)) throw new TypeError("Argument must be of type Uint8Array or string");
      let r = (0, bm.sha256)((0, bm.sha256)(new Uint8Array([...o, ...a])));
      return PE(NE).encode([...o, ...a, ...r.slice(0, 4)]);
    }
    pi.encode = nP;
    function sP(e) {
      let t = PE(NE).decode(e), a = t.slice(0, 1), o = t.slice(1, -4), r = (0, bm.sha256)((0, bm.sha256)(new Uint8Array([...a, ...o])));
      return t.slice(-4).forEach((n, s) => {
        if (n !== r[s]) throw new Error("Invalid checksum");
      }), { prefix: a, data: o };
    }
    pi.decode = sP;
  });
  var GE = tt((Ut) => {
    "use strict";
    Object.defineProperty(Ut, "__esModule", { value: true });
    Ut.c32ToB58 = Ut.b58ToC32 = Ut.c32addressDecode = Ut.c32address = Ut.versions = void 0;
    var zE = _b(), qE = UE(), HE = Ms();
    Ut.versions = { mainnet: { p2pkh: 22, p2sh: 20 }, testnet: { p2pkh: 26, p2sh: 21 } };
    var mi = {};
    mi[0] = Ut.versions.mainnet.p2pkh;
    mi[5] = Ut.versions.mainnet.p2sh;
    mi[111] = Ut.versions.testnet.p2pkh;
    mi[196] = Ut.versions.testnet.p2sh;
    var hi = {};
    hi[Ut.versions.mainnet.p2pkh] = 0;
    hi[Ut.versions.mainnet.p2sh] = 5;
    hi[Ut.versions.testnet.p2pkh] = 111;
    hi[Ut.versions.testnet.p2sh] = 196;
    function FE(e, t) {
      if (!t.match(/^[0-9a-fA-F]{40}$/)) throw new Error("Invalid argument: not a hash160 hex string");
      return `S${(0, zE.c32checkEncode)(e, t)}`;
    }
    Ut.c32address = FE;
    function VE(e) {
      if (e.length <= 5) throw new Error("Invalid c32 address: invalid length");
      if (e[0] != "S") throw new Error('Invalid c32 address: must start with "S"');
      return (0, zE.c32checkDecode)(e.slice(1));
    }
    Ut.c32addressDecode = VE;
    function lP(e, t = -1) {
      let a = qE.decode(e), o = (0, HE.bytesToHex)(a.data), r = parseInt((0, HE.bytesToHex)(a.prefix), 16), n;
      return t < 0 ? (n = r, mi[r] !== void 0 && (n = mi[r])) : n = t, FE(n, o);
    }
    Ut.b58ToC32 = lP;
    function iP(e, t = -1) {
      let a = VE(e), o = a[0], r = a[1], n;
      t < 0 ? (n = o, hi[o] !== void 0 && (n = hi[o])) : n = t;
      let s = n.toString(16);
      return s.length === 1 && (s = `0${s}`), qE.encode(r, s);
    }
    Ut.c32ToB58 = iP;
  });
  var ym = tt((At) => {
    "use strict";
    Object.defineProperty(At, "__esModule", { value: true });
    At.b58ToC32 = At.c32ToB58 = At.versions = At.c32normalize = At.c32addressDecode = At.c32address = At.c32checkDecode = At.c32checkEncode = At.c32decode = At.c32encode = void 0;
    var Pb = kb();
    Object.defineProperty(At, "c32encode", { enumerable: true, get: function() {
      return Pb.c32encode;
    } });
    Object.defineProperty(At, "c32decode", { enumerable: true, get: function() {
      return Pb.c32decode;
    } });
    Object.defineProperty(At, "c32normalize", { enumerable: true, get: function() {
      return Pb.c32normalize;
    } });
    var jE = _b();
    Object.defineProperty(At, "c32checkEncode", { enumerable: true, get: function() {
      return jE.c32checkEncode;
    } });
    Object.defineProperty(At, "c32checkDecode", { enumerable: true, get: function() {
      return jE.c32checkDecode;
    } });
    var Gc = GE();
    Object.defineProperty(At, "c32address", { enumerable: true, get: function() {
      return Gc.c32address;
    } });
    Object.defineProperty(At, "c32addressDecode", { enumerable: true, get: function() {
      return Gc.c32addressDecode;
    } });
    Object.defineProperty(At, "c32ToB58", { enumerable: true, get: function() {
      return Gc.c32ToB58;
    } });
    Object.defineProperty(At, "b58ToC32", { enumerable: true, get: function() {
      return Gc.b58ToC32;
    } });
    Object.defineProperty(At, "versions", { enumerable: true, get: function() {
      return Gc.versions;
    } });
  });
  var NA = tt((jc, xi) => {
    "use strict";
    var qP = 200, lA = "__lodash_hash_undefined__", iA = 9007199254740991, Qb = "[object Arguments]", FP = "[object Array]", uA = "[object Boolean]", cA = "[object Date]", VP = "[object Error]", $b = "[object Function]", fA = "[object GeneratorFunction]", vm = "[object Map]", dA = "[object Number]", Jb = "[object Object]", WE = "[object Promise]", pA = "[object RegExp]", wm = "[object Set]", mA = "[object String]", hA = "[object Symbol]", jb = "[object WeakMap]", gA = "[object ArrayBuffer]", Im = "[object DataView]", xA = "[object Float32Array]", bA = "[object Float64Array]", yA = "[object Int8Array]", SA = "[object Int16Array]", LA = "[object Int32Array]", CA = "[object Uint8Array]", vA = "[object Uint8ClampedArray]", wA = "[object Uint16Array]", IA = "[object Uint32Array]", GP = /[\\^$.*+?()[\]{}|]/g, jP = /\w*$/, XP = /^\[object .+?Constructor\]$/, KP = /^(?:0|[1-9]\d*)$/, st = {};
    st[Qb] = st[FP] = st[gA] = st[Im] = st[uA] = st[cA] = st[xA] = st[bA] = st[yA] = st[SA] = st[LA] = st[vm] = st[dA] = st[Jb] = st[pA] = st[wm] = st[mA] = st[hA] = st[CA] = st[vA] = st[wA] = st[IA] = true;
    st[VP] = st[$b] = st[jb] = false;
    var YP = typeof global == "object" && global && global.Object === Object && global, ZP = typeof self == "object" && self && self.Object === Object && self, Ar = YP || ZP || Function("return this")(), EA = typeof jc == "object" && jc && !jc.nodeType && jc, QE = EA && typeof xi == "object" && xi && !xi.nodeType && xi, WP = QE && QE.exports === EA;
    function QP(e, t) {
      return e.set(t[0], t[1]), e;
    }
    function $P(e, t) {
      return e.add(t), e;
    }
    function JP(e, t) {
      for (var a = -1, o = e ? e.length : 0; ++a < o && t(e[a], a, e) !== false; ) ;
      return e;
    }
    function eN(e, t) {
      for (var a = -1, o = t.length, r = e.length; ++a < o; ) e[r + a] = t[a];
      return e;
    }
    function AA(e, t, a, o) {
      var r = -1, n = e ? e.length : 0;
      for (o && n && (a = e[++r]); ++r < n; ) a = t(a, e[r], r, e);
      return a;
    }
    function tN(e, t) {
      for (var a = -1, o = Array(e); ++a < e; ) o[a] = t(a);
      return o;
    }
    function aN(e, t) {
      return e?.[t];
    }
    function TA(e) {
      var t = false;
      if (e != null && typeof e.toString != "function") try {
        t = !!(e + "");
      } catch {
      }
      return t;
    }
    function $E(e) {
      var t = -1, a = Array(e.size);
      return e.forEach(function(o, r) {
        a[++t] = [r, o];
      }), a;
    }
    function ey(e, t) {
      return function(a) {
        return e(t(a));
      };
    }
    function JE(e) {
      var t = -1, a = Array(e.size);
      return e.forEach(function(o) {
        a[++t] = o;
      }), a;
    }
    var oN = Array.prototype, rN = Function.prototype, Em = Object.prototype, Gb = Ar["__core-js_shared__"], eA = (function() {
      var e = /[^.]+$/.exec(Gb && Gb.keys && Gb.keys.IE_PROTO || "");
      return e ? "Symbol(src)_1." + e : "";
    })(), kA = rN.toString, Bn = Em.hasOwnProperty, Am = Em.toString, nN = RegExp("^" + kA.call(Bn).replace(GP, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), tA = WP ? Ar.Buffer : void 0, aA = Ar.Symbol, oA = Ar.Uint8Array, sN = ey(Object.getPrototypeOf, Object), lN = Object.create, iN = Em.propertyIsEnumerable, uN = oN.splice, rA = Object.getOwnPropertySymbols, cN = tA ? tA.isBuffer : void 0, fN = ey(Object.keys, Object), Xb = Si(Ar, "DataView"), Xc = Si(Ar, "Map"), Kb = Si(Ar, "Promise"), Yb = Si(Ar, "Set"), Zb = Si(Ar, "WeakMap"), Kc = Si(Object, "create"), dN = Bs(Xb), pN = Bs(Xc), mN = Bs(Kb), hN = Bs(Yb), gN = Bs(Zb), nA = aA ? aA.prototype : void 0, sA = nA ? nA.valueOf : void 0;
    function Os(e) {
      var t = -1, a = e ? e.length : 0;
      for (this.clear(); ++t < a; ) {
        var o = e[t];
        this.set(o[0], o[1]);
      }
    }
    function xN() {
      this.__data__ = Kc ? Kc(null) : {};
    }
    function bN(e) {
      return this.has(e) && delete this.__data__[e];
    }
    function yN(e) {
      var t = this.__data__;
      if (Kc) {
        var a = t[e];
        return a === lA ? void 0 : a;
      }
      return Bn.call(t, e) ? t[e] : void 0;
    }
    function SN(e) {
      var t = this.__data__;
      return Kc ? t[e] !== void 0 : Bn.call(t, e);
    }
    function LN(e, t) {
      var a = this.__data__;
      return a[e] = Kc && t === void 0 ? lA : t, this;
    }
    Os.prototype.clear = xN;
    Os.prototype.delete = bN;
    Os.prototype.get = yN;
    Os.prototype.has = SN;
    Os.prototype.set = LN;
    function Tr(e) {
      var t = -1, a = e ? e.length : 0;
      for (this.clear(); ++t < a; ) {
        var o = e[t];
        this.set(o[0], o[1]);
      }
    }
    function CN() {
      this.__data__ = [];
    }
    function vN(e) {
      var t = this.__data__, a = Tm(t, e);
      if (a < 0) return false;
      var o = t.length - 1;
      return a == o ? t.pop() : uN.call(t, a, 1), true;
    }
    function wN(e) {
      var t = this.__data__, a = Tm(t, e);
      return a < 0 ? void 0 : t[a][1];
    }
    function IN(e) {
      return Tm(this.__data__, e) > -1;
    }
    function EN(e, t) {
      var a = this.__data__, o = Tm(a, e);
      return o < 0 ? a.push([e, t]) : a[o][1] = t, this;
    }
    Tr.prototype.clear = CN;
    Tr.prototype.delete = vN;
    Tr.prototype.get = wN;
    Tr.prototype.has = IN;
    Tr.prototype.set = EN;
    function bi(e) {
      var t = -1, a = e ? e.length : 0;
      for (this.clear(); ++t < a; ) {
        var o = e[t];
        this.set(o[0], o[1]);
      }
    }
    function AN() {
      this.__data__ = { hash: new Os(), map: new (Xc || Tr)(), string: new Os() };
    }
    function TN(e) {
      return km(this, e).delete(e);
    }
    function kN(e) {
      return km(this, e).get(e);
    }
    function RN(e) {
      return km(this, e).has(e);
    }
    function MN(e, t) {
      return km(this, e).set(e, t), this;
    }
    bi.prototype.clear = AN;
    bi.prototype.delete = TN;
    bi.prototype.get = kN;
    bi.prototype.has = RN;
    bi.prototype.set = MN;
    function yi(e) {
      this.__data__ = new Tr(e);
    }
    function DN() {
      this.__data__ = new Tr();
    }
    function ON(e) {
      return this.__data__.delete(e);
    }
    function BN(e) {
      return this.__data__.get(e);
    }
    function _N(e) {
      return this.__data__.has(e);
    }
    function PN(e, t) {
      var a = this.__data__;
      if (a instanceof Tr) {
        var o = a.__data__;
        if (!Xc || o.length < qP - 1) return o.push([e, t]), this;
        a = this.__data__ = new bi(o);
      }
      return a.set(e, t), this;
    }
    yi.prototype.clear = DN;
    yi.prototype.delete = ON;
    yi.prototype.get = BN;
    yi.prototype.has = _N;
    yi.prototype.set = PN;
    function NN(e, t) {
      var a = ay(e) || l8(e) ? tN(e.length, String) : [], o = a.length, r = !!o;
      for (var n in e) (t || Bn.call(e, n)) && !(r && (n == "length" || o8(n, o))) && a.push(n);
      return a;
    }
    function RA(e, t, a) {
      var o = e[t];
      (!(Bn.call(e, t) && BA(o, a)) || a === void 0 && !(t in e)) && (e[t] = a);
    }
    function Tm(e, t) {
      for (var a = e.length; a--; ) if (BA(e[a][0], t)) return a;
      return -1;
    }
    function UN(e, t) {
      return e && MA(t, oy(t), e);
    }
    function Wb(e, t, a, o, r, n, s) {
      var l;
      if (o && (l = n ? o(e, r, n, s) : o(e)), l !== void 0) return l;
      if (!Rm(e)) return e;
      var i = ay(e);
      if (i) {
        if (l = e8(e), !t) return QN(e, l);
      } else {
        var u = Ds(e), c = u == $b || u == fA;
        if (u8(e)) return GN(e, t);
        if (u == Jb || u == Qb || c && !n) {
          if (TA(e)) return n ? e : {};
          if (l = t8(c ? {} : e), !t) return $N(e, UN(l, e));
        } else {
          if (!st[u]) return n ? e : {};
          l = a8(e, u, Wb, t);
        }
      }
      s || (s = new yi());
      var d = s.get(e);
      if (d) return d;
      if (s.set(e, l), !i) var f = a ? JN(e) : oy(e);
      return JP(f || e, function(p, x) {
        f && (x = p, p = e[x]), RA(l, x, Wb(p, t, a, o, x, e, s));
      }), l;
    }
    function HN(e) {
      return Rm(e) ? lN(e) : {};
    }
    function zN(e, t, a) {
      var o = t(e);
      return ay(e) ? o : eN(o, a(e));
    }
    function qN(e) {
      return Am.call(e);
    }
    function FN(e) {
      if (!Rm(e) || n8(e)) return false;
      var t = PA(e) || TA(e) ? nN : XP;
      return t.test(Bs(e));
    }
    function VN(e) {
      if (!OA(e)) return fN(e);
      var t = [];
      for (var a in Object(e)) Bn.call(e, a) && a != "constructor" && t.push(a);
      return t;
    }
    function GN(e, t) {
      if (t) return e.slice();
      var a = new e.constructor(e.length);
      return e.copy(a), a;
    }
    function ty(e) {
      var t = new e.constructor(e.byteLength);
      return new oA(t).set(new oA(e)), t;
    }
    function jN(e, t) {
      var a = t ? ty(e.buffer) : e.buffer;
      return new e.constructor(a, e.byteOffset, e.byteLength);
    }
    function XN(e, t, a) {
      var o = t ? a($E(e), true) : $E(e);
      return AA(o, QP, new e.constructor());
    }
    function KN(e) {
      var t = new e.constructor(e.source, jP.exec(e));
      return t.lastIndex = e.lastIndex, t;
    }
    function YN(e, t, a) {
      var o = t ? a(JE(e), true) : JE(e);
      return AA(o, $P, new e.constructor());
    }
    function ZN(e) {
      return sA ? Object(sA.call(e)) : {};
    }
    function WN(e, t) {
      var a = t ? ty(e.buffer) : e.buffer;
      return new e.constructor(a, e.byteOffset, e.length);
    }
    function QN(e, t) {
      var a = -1, o = e.length;
      for (t || (t = Array(o)); ++a < o; ) t[a] = e[a];
      return t;
    }
    function MA(e, t, a, o) {
      a || (a = {});
      for (var r = -1, n = t.length; ++r < n; ) {
        var s = t[r], l = o ? o(a[s], e[s], s, a, e) : void 0;
        RA(a, s, l === void 0 ? e[s] : l);
      }
      return a;
    }
    function $N(e, t) {
      return MA(e, DA(e), t);
    }
    function JN(e) {
      return zN(e, oy, DA);
    }
    function km(e, t) {
      var a = e.__data__;
      return r8(t) ? a[typeof t == "string" ? "string" : "hash"] : a.map;
    }
    function Si(e, t) {
      var a = aN(e, t);
      return FN(a) ? a : void 0;
    }
    var DA = rA ? ey(rA, Object) : d8, Ds = qN;
    (Xb && Ds(new Xb(new ArrayBuffer(1))) != Im || Xc && Ds(new Xc()) != vm || Kb && Ds(Kb.resolve()) != WE || Yb && Ds(new Yb()) != wm || Zb && Ds(new Zb()) != jb) && (Ds = function(e) {
      var t = Am.call(e), a = t == Jb ? e.constructor : void 0, o = a ? Bs(a) : void 0;
      if (o) switch (o) {
        case dN:
          return Im;
        case pN:
          return vm;
        case mN:
          return WE;
        case hN:
          return wm;
        case gN:
          return jb;
      }
      return t;
    });
    function e8(e) {
      var t = e.length, a = e.constructor(t);
      return t && typeof e[0] == "string" && Bn.call(e, "index") && (a.index = e.index, a.input = e.input), a;
    }
    function t8(e) {
      return typeof e.constructor == "function" && !OA(e) ? HN(sN(e)) : {};
    }
    function a8(e, t, a, o) {
      var r = e.constructor;
      switch (t) {
        case gA:
          return ty(e);
        case uA:
        case cA:
          return new r(+e);
        case Im:
          return jN(e, o);
        case xA:
        case bA:
        case yA:
        case SA:
        case LA:
        case CA:
        case vA:
        case wA:
        case IA:
          return WN(e, o);
        case vm:
          return XN(e, o, a);
        case dA:
        case mA:
          return new r(e);
        case pA:
          return KN(e);
        case wm:
          return YN(e, o, a);
        case hA:
          return ZN(e);
      }
    }
    function o8(e, t) {
      return t = t ?? iA, !!t && (typeof e == "number" || KP.test(e)) && e > -1 && e % 1 == 0 && e < t;
    }
    function r8(e) {
      var t = typeof e;
      return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
    }
    function n8(e) {
      return !!eA && eA in e;
    }
    function OA(e) {
      var t = e && e.constructor, a = typeof t == "function" && t.prototype || Em;
      return e === a;
    }
    function Bs(e) {
      if (e != null) {
        try {
          return kA.call(e);
        } catch {
        }
        try {
          return e + "";
        } catch {
        }
      }
      return "";
    }
    function s8(e) {
      return Wb(e, true, true);
    }
    function BA(e, t) {
      return e === t || e !== e && t !== t;
    }
    function l8(e) {
      return i8(e) && Bn.call(e, "callee") && (!iN.call(e, "callee") || Am.call(e) == Qb);
    }
    var ay = Array.isArray;
    function _A(e) {
      return e != null && c8(e.length) && !PA(e);
    }
    function i8(e) {
      return f8(e) && _A(e);
    }
    var u8 = cN || p8;
    function PA(e) {
      var t = Rm(e) ? Am.call(e) : "";
      return t == $b || t == fA;
    }
    function c8(e) {
      return typeof e == "number" && e > -1 && e % 1 == 0 && e <= iA;
    }
    function Rm(e) {
      var t = typeof e;
      return !!e && (t == "object" || t == "function");
    }
    function f8(e) {
      return !!e && typeof e == "object";
    }
    function oy(e) {
      return _A(e) ? NN(e) : VN(e);
    }
    function d8() {
      return [];
    }
    function p8() {
      return false;
    }
    xi.exports = s8;
  });
  var xe = _(F(), 1), LT = _(cv(), 1);
  function vM(e) {
    return e !== null ? { comment: e, variations: [] } : { variations: [] };
  }
  function wM(e, t, a, o, r) {
    let n = { move: e, variations: r };
    return t && (n.suffix = t), a && (n.nag = a), o !== null && (n.comment = o), n;
  }
  function IM(...e) {
    let [t, ...a] = e, o = t;
    for (let r of a) r !== null && (o.variations = [r, ...r.variations], r.variations = [], o = r);
    return t;
  }
  function EM(e, t) {
    if (t.marker && t.marker.comment) {
      let a = t.root;
      for (; ; ) {
        let o = a.variations[0];
        if (!o) {
          a.comment = t.marker.comment;
          break;
        }
        a = o;
      }
    }
    return { headers: e, root: t.root, result: (t.marker && t.marker.result) ?? void 0 };
  }
  function AM(e, t) {
    function a() {
      this.constructor = e;
    }
    a.prototype = t.prototype, e.prototype = new a();
  }
  function zl(e, t, a, o) {
    var r = Error.call(this, e);
    return Object.setPrototypeOf && Object.setPrototypeOf(r, zl.prototype), r.expected = t, r.found = a, r.location = o, r.name = "SyntaxError", r;
  }
  AM(zl, Error);
  function Hx(e, t, a) {
    return a = a || " ", e.length > t ? e : (t -= e.length, a += a.repeat(t), e + a.slice(0, t));
  }
  zl.prototype.format = function(e) {
    var t = "Error: " + this.message;
    if (this.location) {
      var a = null, o;
      for (o = 0; o < e.length; o++) if (e[o].source === this.location.source) {
        a = e[o].text.split(/\r\n|\n|\r/g);
        break;
      }
      var r = this.location.start, n = this.location.source && typeof this.location.source.offset == "function" ? this.location.source.offset(r) : r, s = this.location.source + ":" + n.line + ":" + n.column;
      if (a) {
        var l = this.location.end, i = Hx("", n.line.toString().length, " "), u = a[r.line - 1], c = r.line === l.line ? l.column : u.length + 1, d = c - r.column || 1;
        t += `
 --> ` + s + `
` + i + ` |
` + n.line + " | " + u + `
` + i + " | " + Hx("", r.column - 1, " ") + Hx("", d, "^");
      } else t += `
 at ` + s;
    }
    return t;
  };
  zl.buildMessage = function(e, t) {
    var a = { literal: function(u) {
      return '"' + r(u.text) + '"';
    }, class: function(u) {
      var c = u.parts.map(function(d) {
        return Array.isArray(d) ? n(d[0]) + "-" + n(d[1]) : n(d);
      });
      return "[" + (u.inverted ? "^" : "") + c.join("") + "]";
    }, any: function() {
      return "any character";
    }, end: function() {
      return "end of input";
    }, other: function(u) {
      return u.description;
    } };
    function o(u) {
      return u.charCodeAt(0).toString(16).toUpperCase();
    }
    function r(u) {
      return u.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(c) {
        return "\\x0" + o(c);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(c) {
        return "\\x" + o(c);
      });
    }
    function n(u) {
      return u.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(c) {
        return "\\x0" + o(c);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(c) {
        return "\\x" + o(c);
      });
    }
    function s(u) {
      return a[u.type](u);
    }
    function l(u) {
      var c = u.map(s), d, f;
      if (c.sort(), c.length > 0) {
        for (d = 1, f = 1; d < c.length; d++) c[d - 1] !== c[d] && (c[f] = c[d], f++);
        c.length = f;
      }
      switch (c.length) {
        case 1:
          return c[0];
        case 2:
          return c[0] + " or " + c[1];
        default:
          return c.slice(0, -1).join(", ") + ", or " + c[c.length - 1];
      }
    }
    function i(u) {
      return u ? '"' + r(u) + '"' : "end of input";
    }
    return "Expected " + l(e) + " but " + i(t) + " found.";
  };
  function TM(e, t) {
    t = t !== void 0 ? t : {};
    var a = {}, o = t.grammarSource, r = { pgn: L }, n = L, s = "[", l = '"', i = "]", u = ".", c = "O-O-O", d = "O-O", f = "0-0-0", p = "0-0", x = "$", S = "{", v = "}", g = ";", m = "(", b = ")", y = "1-0", C = "0-1", D = "1/2-1/2", I = "*", w = /^[a-zA-Z]/, M = /^[^"]/, T = /^[0-9]/, K = /^[.]/, z = /^[a-zA-Z1-8\-=]/, Y = /^[+#]/, ce = /^[!?]/, Le = /^[^}]/, J = /^[^\r\n]/, Ie = /^[ \t\r\n]/, Be = xa("tag pair"), he = it("[", false), U = it('"', false), gt = it("]", false), ue = xa("tag name"), Pe = Fa([["a", "z"], ["A", "Z"]], false, false), Ee = xa("tag value"), ne = Fa(['"'], true, false), $ = xa("move number"), et = Fa([["0", "9"]], false, false), H = it(".", false), ee = Fa(["."], false, false), Ne = xa("standard algebraic notation"), lt = it("O-O-O", false), te = it("O-O", false), ke = it("0-0-0", false), He = it("0-0", false), Tt = Fa([["a", "z"], ["A", "Z"], ["1", "8"], "-", "="], false, false), Dt = Fa(["+", "#"], false, false), ge = xa("suffix annotation"), je = Fa(["!", "?"], false, false), pe = xa("NAG"), rt = it("$", false), zt = xa("brace comment"), ze = it("{", false), ea = Fa(["}"], true, false), j = it("}", false), X = xa("rest of line comment"), Lt = it(";", false), Me = Fa(["\r", `
`], true, false), be = xa("variation"), qt = it("(", false), Ro = it(")", false), Ct = xa("game termination marker"), Ft = it("1-0", false), Mo = it("0-1", false), Or = it("1/2-1/2", false), Vs = it("*", false), Gs = xa("whitespace"), Br = Fa([" ", "	", "\r", `
`], false, false), ka = function(E, k) {
      return EM(E, k);
    }, oo = function(E) {
      return Object.fromEntries(E);
    }, Lo = function(E, k) {
      return [E, k];
    }, ef = function(E, k) {
      return { root: E, marker: k };
    }, tf = function(E, k) {
      return IM(vM(E), ...k.flat());
    }, _n = function(E, k, R, se, ie) {
      return wM(E, k, R, se, ie);
    }, Wm = function(E) {
      return E;
    }, Ri = function(E) {
      return E.replace(/[\r\n]+/g, " ");
    }, Qm = function(E) {
      return E.trim();
    }, Mi = function(E) {
      return E;
    }, $m = function(E, k) {
      return { result: E, comment: k };
    }, A = t.peg$currPos | 0, _r = [{ line: 1, column: 1 }], qa = A, js = t.peg$maxFailExpected || [], q = t.peg$silentFails | 0, Pn;
    if (t.startRule) {
      if (!(t.startRule in r)) throw new Error(`Can't start parsing from rule "` + t.startRule + '".');
      n = r[t.startRule];
    }
    function it(E, k) {
      return { type: "literal", text: E, ignoreCase: k };
    }
    function Fa(E, k, R) {
      return { type: "class", parts: E, inverted: k, ignoreCase: R };
    }
    function af() {
      return { type: "end" };
    }
    function xa(E) {
      return { type: "other", description: E };
    }
    function of(E) {
      var k = _r[E], R;
      if (k) return k;
      if (E >= _r.length) R = _r.length - 1;
      else for (R = E; !_r[--R]; ) ;
      for (k = _r[R], k = { line: k.line, column: k.column }; R < E; ) e.charCodeAt(R) === 10 ? (k.line++, k.column = 1) : k.column++, R++;
      return _r[E] = k, k;
    }
    function Wo(E, k, R) {
      var se = of(E), ie = of(k), Ke = { source: o, start: { offset: E, line: se.line, column: se.column }, end: { offset: k, line: ie.line, column: ie.column } };
      return Ke;
    }
    function ae(E) {
      A < qa || (A > qa && (qa = A, js = []), js.push(E));
    }
    function rf(E, k, R) {
      return new zl(zl.buildMessage(E, k), E, k, R);
    }
    function L() {
      var E, k, R;
      return E = A, k = O(), R = vt(), E = ka(k, R), E;
    }
    function O() {
      var E, k, R;
      for (E = A, k = [], R = N(); R !== a; ) k.push(R), R = N();
      return R = ya(), E = oo(k), E;
    }
    function N() {
      var E, k, R, se, ie, Ke, Un;
      return q++, E = A, ya(), e.charCodeAt(A) === 91 ? (k = s, A++) : (k = a, q === 0 && ae(he)), k !== a ? (ya(), R = W(), R !== a ? (ya(), e.charCodeAt(A) === 34 ? (se = l, A++) : (se = a, q === 0 && ae(U)), se !== a ? (ie = _e(), e.charCodeAt(A) === 34 ? (Ke = l, A++) : (Ke = a, q === 0 && ae(U)), Ke !== a ? (ya(), e.charCodeAt(A) === 93 ? (Un = i, A++) : (Un = a, q === 0 && ae(gt)), Un !== a ? E = Lo(R, ie) : (A = E, E = a)) : (A = E, E = a)) : (A = E, E = a)) : (A = E, E = a)) : (A = E, E = a), q--, E === a && q === 0 && ae(Be), E;
    }
    function W() {
      var E, k, R;
      if (q++, E = A, k = [], R = e.charAt(A), w.test(R) ? A++ : (R = a, q === 0 && ae(Pe)), R !== a) for (; R !== a; ) k.push(R), R = e.charAt(A), w.test(R) ? A++ : (R = a, q === 0 && ae(Pe));
      else k = a;
      return k !== a ? E = e.substring(E, A) : E = k, q--, E === a && (k = a, q === 0 && ae(ue)), E;
    }
    function _e() {
      var E, k, R;
      for (q++, E = A, k = [], R = e.charAt(A), M.test(R) ? A++ : (R = a, q === 0 && ae(ne)); R !== a; ) k.push(R), R = e.charAt(A), M.test(R) ? A++ : (R = a, q === 0 && ae(ne));
      return E = e.substring(E, A), q--, k = a, q === 0 && ae(Ee), E;
    }
    function vt() {
      var E, k, R;
      return E = A, k = Pr(), ya(), R = IT(), R === a && (R = null), ya(), E = ef(k, R), E;
    }
    function Pr() {
      var E, k, R, se;
      for (E = A, k = Nn(), k === a && (k = null), R = [], se = Di(); se !== a; ) R.push(se), se = Di();
      return E = tf(k, R), E;
    }
    function Di() {
      var E, k, R, se, ie, Ke, Un, sf;
      if (E = A, ya(), nf(), ya(), k = ba(), k !== a) {
        for (R = Nr(), R === a && (R = null), se = [], ie = Xs(); ie !== a; ) se.push(ie), ie = Xs();
        for (ie = ya(), Ke = Nn(), Ke === a && (Ke = null), Un = [], sf = Ly(); sf !== a; ) Un.push(sf), sf = Ly();
        E = _n(k, R, se, Ke, Un);
      } else A = E, E = a;
      return E;
    }
    function nf() {
      var E, k, R, se, ie, Ke;
      for (q++, E = A, k = [], R = e.charAt(A), T.test(R) ? A++ : (R = a, q === 0 && ae(et)); R !== a; ) k.push(R), R = e.charAt(A), T.test(R) ? A++ : (R = a, q === 0 && ae(et));
      if (e.charCodeAt(A) === 46 ? (R = u, A++) : (R = a, q === 0 && ae(H)), R !== a) {
        for (se = ya(), ie = [], Ke = e.charAt(A), K.test(Ke) ? A++ : (Ke = a, q === 0 && ae(ee)); Ke !== a; ) ie.push(Ke), Ke = e.charAt(A), K.test(Ke) ? A++ : (Ke = a, q === 0 && ae(ee));
        k = [k, R, se, ie], E = k;
      } else A = E, E = a;
      return q--, E === a && (k = a, q === 0 && ae($)), E;
    }
    function ba() {
      var E, k, R, se, ie, Ke;
      if (q++, E = A, k = A, e.substr(A, 5) === c ? (R = c, A += 5) : (R = a, q === 0 && ae(lt)), R === a && (e.substr(A, 3) === d ? (R = d, A += 3) : (R = a, q === 0 && ae(te)), R === a && (e.substr(A, 5) === f ? (R = f, A += 5) : (R = a, q === 0 && ae(ke)), R === a && (e.substr(A, 3) === p ? (R = p, A += 3) : (R = a, q === 0 && ae(He)), R === a)))) if (R = A, se = e.charAt(A), w.test(se) ? A++ : (se = a, q === 0 && ae(Pe)), se !== a) {
        if (ie = [], Ke = e.charAt(A), z.test(Ke) ? A++ : (Ke = a, q === 0 && ae(Tt)), Ke !== a) for (; Ke !== a; ) ie.push(Ke), Ke = e.charAt(A), z.test(Ke) ? A++ : (Ke = a, q === 0 && ae(Tt));
        else ie = a;
        ie !== a ? (se = [se, ie], R = se) : (A = R, R = a);
      } else A = R, R = a;
      return R !== a ? (se = e.charAt(A), Y.test(se) ? A++ : (se = a, q === 0 && ae(Dt)), se === a && (se = null), R = [R, se], k = R) : (A = k, k = a), k !== a ? E = e.substring(E, A) : E = k, q--, E === a && (k = a, q === 0 && ae(Ne)), E;
    }
    function Nr() {
      var E, k, R;
      for (q++, E = A, k = [], R = e.charAt(A), ce.test(R) ? A++ : (R = a, q === 0 && ae(je)); R !== a; ) k.push(R), k.length >= 2 ? R = a : (R = e.charAt(A), ce.test(R) ? A++ : (R = a, q === 0 && ae(je)));
      return k.length < 1 ? (A = E, E = a) : E = k, q--, E === a && (k = a, q === 0 && ae(ge)), E;
    }
    function Xs() {
      var E, k, R, se, ie;
      if (q++, E = A, ya(), e.charCodeAt(A) === 36 ? (k = x, A++) : (k = a, q === 0 && ae(rt)), k !== a) {
        if (R = A, se = [], ie = e.charAt(A), T.test(ie) ? A++ : (ie = a, q === 0 && ae(et)), ie !== a) for (; ie !== a; ) se.push(ie), ie = e.charAt(A), T.test(ie) ? A++ : (ie = a, q === 0 && ae(et));
        else se = a;
        se !== a ? R = e.substring(R, A) : R = se, R !== a ? E = Wm(R) : (A = E, E = a);
      } else A = E, E = a;
      return q--, E === a && q === 0 && ae(pe), E;
    }
    function Nn() {
      var E;
      return E = vT(), E === a && (E = wT()), E;
    }
    function vT() {
      var E, k, R, se, ie;
      if (q++, E = A, e.charCodeAt(A) === 123 ? (k = S, A++) : (k = a, q === 0 && ae(ze)), k !== a) {
        for (R = A, se = [], ie = e.charAt(A), Le.test(ie) ? A++ : (ie = a, q === 0 && ae(ea)); ie !== a; ) se.push(ie), ie = e.charAt(A), Le.test(ie) ? A++ : (ie = a, q === 0 && ae(ea));
        R = e.substring(R, A), e.charCodeAt(A) === 125 ? (se = v, A++) : (se = a, q === 0 && ae(j)), se !== a ? E = Ri(R) : (A = E, E = a);
      } else A = E, E = a;
      return q--, E === a && (k = a, q === 0 && ae(zt)), E;
    }
    function wT() {
      var E, k, R, se, ie;
      if (q++, E = A, e.charCodeAt(A) === 59 ? (k = g, A++) : (k = a, q === 0 && ae(Lt)), k !== a) {
        for (R = A, se = [], ie = e.charAt(A), J.test(ie) ? A++ : (ie = a, q === 0 && ae(Me)); ie !== a; ) se.push(ie), ie = e.charAt(A), J.test(ie) ? A++ : (ie = a, q === 0 && ae(Me));
        R = e.substring(R, A), E = Qm(R);
      } else A = E, E = a;
      return q--, E === a && (k = a, q === 0 && ae(X)), E;
    }
    function Ly() {
      var E, k, R, se;
      return q++, E = A, ya(), e.charCodeAt(A) === 40 ? (k = m, A++) : (k = a, q === 0 && ae(qt)), k !== a ? (R = Pr(), R !== a ? (ya(), e.charCodeAt(A) === 41 ? (se = b, A++) : (se = a, q === 0 && ae(Ro)), se !== a ? E = Mi(R) : (A = E, E = a)) : (A = E, E = a)) : (A = E, E = a), q--, E === a && q === 0 && ae(be), E;
    }
    function IT() {
      var E, k, R;
      return q++, E = A, e.substr(A, 3) === y ? (k = y, A += 3) : (k = a, q === 0 && ae(Ft)), k === a && (e.substr(A, 3) === C ? (k = C, A += 3) : (k = a, q === 0 && ae(Mo)), k === a && (e.substr(A, 7) === D ? (k = D, A += 7) : (k = a, q === 0 && ae(Or)), k === a && (e.charCodeAt(A) === 42 ? (k = I, A++) : (k = a, q === 0 && ae(Vs))))), k !== a ? (ya(), R = Nn(), R === a && (R = null), E = $m(k, R)) : (A = E, E = a), q--, E === a && (k = a, q === 0 && ae(Ct)), E;
    }
    function ya() {
      var E, k;
      for (q++, E = [], k = e.charAt(A), Ie.test(k) ? A++ : (k = a, q === 0 && ae(Br)); k !== a; ) E.push(k), k = e.charAt(A), Ie.test(k) ? A++ : (k = a, q === 0 && ae(Br));
      return q--, k = a, q === 0 && ae(Gs), E;
    }
    if (Pn = n(), t.peg$library) return { peg$result: Pn, peg$currPos: A, peg$FAILED: a, peg$maxFailExpected: js, peg$maxFailPos: qa };
    if (Pn !== a && A === e.length) return Pn;
    throw Pn !== a && A < e.length && ae(af()), rf(js, qa < e.length ? e.charAt(qa) : null, qa < e.length ? Wo(qa, qa + 1) : Wo(qa, qa));
  }
  var Hd = 0xffffffffffffffffn;
  function zx(e, t) {
    return (e << t | e >> 64n - t) & 0xffffffffffffffffn;
  }
  function fv(e, t) {
    return e * t & Hd;
  }
  function kM(e) {
    return function() {
      let t = BigInt(e & Hd), a = BigInt(e >> 64n & Hd), o = fv(zx(fv(t, 5n), 7n), 9n);
      return a ^= t, t = (zx(t, 24n) ^ a ^ a << 16n) & Hd, a = zx(a, 37n), e = a << 64n | t, o;
    };
  }
  var qd = kM(0xa187eb39cdcaed8f31c4b365b102e01en), RM = Array.from({ length: 2 }, () => Array.from({ length: 6 }, () => Array.from({ length: 128 }, () => qd()))), MM = Array.from({ length: 8 }, () => qd()), DM = Array.from({ length: 16 }, () => qd()), qx = qd(), ua = "w", Ja = "b", Nt = "p", jx = "n", zd = "b", Pu = "r", hn = "q", jt = "k", Io = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", Hl = class {
    color;
    from;
    to;
    piece;
    captured;
    promotion;
    flags;
    san;
    lan;
    before;
    after;
    constructor(t, a) {
      let { color: o, piece: r, from: n, to: s, flags: l, captured: i, promotion: u } = a, c = $t(n), d = $t(s);
      this.color = o, this.piece = r, this.from = c, this.to = d, this.san = t._moveToSan(a, t._moves({ legal: true })), this.lan = c + d, this.before = t.fen(), t._makeMove(a), this.after = t.fen(), t._undoMove(), this.flags = "";
      for (let f in me) me[f] & l && (this.flags += ns[f]);
      i && (this.captured = i), u && (this.promotion = u, this.lan += u);
    }
    isCapture() {
      return this.flags.indexOf(ns.CAPTURE) > -1;
    }
    isPromotion() {
      return this.flags.indexOf(ns.PROMOTION) > -1;
    }
    isEnPassant() {
      return this.flags.indexOf(ns.EP_CAPTURE) > -1;
    }
    isKingsideCastle() {
      return this.flags.indexOf(ns.KSIDE_CASTLE) > -1;
    }
    isQueensideCastle() {
      return this.flags.indexOf(ns.QSIDE_CASTLE) > -1;
    }
    isBigPawn() {
      return this.flags.indexOf(ns.BIG_PAWN) > -1;
    }
  }, sa = -1, ns = { NORMAL: "n", CAPTURE: "c", BIG_PAWN: "b", EP_CAPTURE: "e", PROMOTION: "p", KSIDE_CASTLE: "k", QSIDE_CASTLE: "q", NULL_MOVE: "-" };
  var me = { NORMAL: 1, CAPTURE: 2, BIG_PAWN: 4, EP_CAPTURE: 8, PROMOTION: 16, KSIDE_CASTLE: 32, QSIDE_CASTLE: 64, NULL_MOVE: 128 }, Xx = { Event: "?", Site: "?", Date: "????.??.??", Round: "?", White: "?", Black: "?", Result: "*" }, OM = { WhiteTitle: null, BlackTitle: null, WhiteElo: null, BlackElo: null, WhiteUSCF: null, BlackUSCF: null, WhiteNA: null, BlackNA: null, WhiteType: null, BlackType: null, EventDate: null, EventSponsor: null, Section: null, Stage: null, Board: null, Opening: null, Variation: null, SubVariation: null, ECO: null, NIC: null, Time: null, UTCTime: null, UTCDate: null, TimeControl: null, SetUp: null, FEN: null, Termination: null, Annotator: null, Mode: null, PlyCount: null }, BM = { ...Xx, ...OM }, de = { a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7, a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23, a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39, a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55, a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71, a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87, a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103, a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119 }, Fx = { b: [16, 32, 17, 15], w: [-16, -32, -17, -15] }, dv = { n: [-18, -33, -31, -14, 18, 33, 31, 14], b: [-17, -15, 17, 15], r: [-16, 1, 16, -1], q: [-17, -16, -15, 1, 17, 16, 15, -1], k: [-17, -16, -15, 1, 17, 16, 15, -1] }, _M = [20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0, 0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0, 24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0, 0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0, 20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20], PM = [17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0, 0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0, 0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0, 0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0, -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17], NM = { p: 1, n: 2, b: 4, r: 8, q: 16, k: 32 }, UM = "pnbrqkPNBRQK", pv = [jx, zd, Pu, hn], HM = 7, zM = 6, qM = 1, FM = 0, Ud = { [jt]: me.KSIDE_CASTLE, [hn]: me.QSIDE_CASTLE }, pn = { w: [{ square: de.a1, flag: me.QSIDE_CASTLE }, { square: de.h1, flag: me.KSIDE_CASTLE }], b: [{ square: de.a8, flag: me.QSIDE_CASTLE }, { square: de.h8, flag: me.KSIDE_CASTLE }] }, VM = { b: qM, w: zM }, Vx = "--";
  function ss(e) {
    return e >> 4;
  }
  function Nu(e) {
    return e & 15;
  }
  function hv(e) {
    return "0123456789".indexOf(e) !== -1;
  }
  function $t(e) {
    let t = Nu(e), a = ss(e);
    return "abcdefgh".substring(t, t + 1) + "87654321".substring(a, a + 1);
  }
  function _u(e) {
    return e === ua ? Ja : ua;
  }
  function Kx(e) {
    let t = e.split(/\s+/);
    if (t.length !== 6) return { ok: false, error: "Invalid FEN: must contain six space-delimited fields" };
    let a = parseInt(t[5], 10);
    if (isNaN(a) || a <= 0) return { ok: false, error: "Invalid FEN: move number must be a positive integer" };
    let o = parseInt(t[4], 10);
    if (isNaN(o) || o < 0) return { ok: false, error: "Invalid FEN: half move counter number must be a non-negative integer" };
    if (!/^(-|[abcdefgh][36])$/.test(t[3])) return { ok: false, error: "Invalid FEN: en-passant square is invalid" };
    if (/[^kKqQ-]/.test(t[2])) return { ok: false, error: "Invalid FEN: castling availability is invalid" };
    if (!/^(w|b)$/.test(t[1])) return { ok: false, error: "Invalid FEN: side-to-move is invalid" };
    let r = t[0].split("/");
    if (r.length !== 8) return { ok: false, error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows" };
    for (let s = 0; s < r.length; s++) {
      let l = 0, i = false;
      for (let u = 0; u < r[s].length; u++) if (hv(r[s][u])) {
        if (i) return { ok: false, error: "Invalid FEN: piece data is invalid (consecutive number)" };
        l += parseInt(r[s][u], 10), i = true;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(r[s][u])) return { ok: false, error: "Invalid FEN: piece data is invalid (invalid piece)" };
        l += 1, i = false;
      }
      if (l !== 8) return { ok: false, error: "Invalid FEN: piece data is invalid (too many squares in rank)" };
    }
    if (t[3][1] == "3" && t[1] == "w" || t[3][1] == "6" && t[1] == "b") return { ok: false, error: "Invalid FEN: illegal en-passant square" };
    let n = [{ color: "white", regex: /K/g }, { color: "black", regex: /k/g }];
    for (let { color: s, regex: l } of n) {
      if (!l.test(t[0])) return { ok: false, error: `Invalid FEN: missing ${s} king` };
      if ((t[0].match(l) || []).length > 1) return { ok: false, error: `Invalid FEN: too many ${s} kings` };
    }
    return Array.from(r[0] + r[7]).some((s) => s.toUpperCase() === "P") ? { ok: false, error: "Invalid FEN: some pawns are on the edge rows" } : { ok: true };
  }
  function GM(e, t) {
    let a = e.from, o = e.to, r = e.piece, n = 0, s = 0, l = 0;
    for (let i = 0, u = t.length; i < u; i++) {
      let c = t[i].from, d = t[i].to, f = t[i].piece;
      r === f && a !== c && o === d && (n++, ss(a) === ss(c) && s++, Nu(a) === Nu(c) && l++);
    }
    return n > 0 ? s > 0 && l > 0 ? $t(a) : l > 0 ? $t(a).charAt(1) : $t(a).charAt(0) : "";
  }
  function mn(e, t, a, o, r, n = void 0, s = me.NORMAL) {
    let l = ss(o);
    if (r === Nt && (l === HM || l === FM)) for (let i = 0; i < pv.length; i++) {
      let u = pv[i];
      e.push({ color: t, from: a, to: o, piece: r, captured: n, promotion: u, flags: s | me.PROMOTION });
    }
    else e.push({ color: t, from: a, to: o, piece: r, captured: n, flags: s });
  }
  function mv(e) {
    let t = e.charAt(0);
    return t >= "a" && t <= "h" ? e.match(/[a-h]\d.*[a-h]\d/) ? void 0 : Nt : (t = t.toLowerCase(), t === "o" ? jt : t);
  }
  function Gx(e) {
    return e.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
  }
  var gn = class {
    _board = new Array(128);
    _turn = ua;
    _header = {};
    _kings = { w: sa, b: sa };
    _epSquare = -1;
    _halfMoves = 0;
    _moveNumber = 0;
    _history = [];
    _comments = {};
    _castling = { w: 0, b: 0 };
    _hash = 0n;
    _positionCount = /* @__PURE__ */ new Map();
    constructor(t = Io, { skipValidation: a = false } = {}) {
      this.load(t, { skipValidation: a });
    }
    clear({ preserveHeaders: t = false } = {}) {
      this._board = new Array(128), this._kings = { w: sa, b: sa }, this._turn = ua, this._castling = { w: 0, b: 0 }, this._epSquare = sa, this._halfMoves = 0, this._moveNumber = 1, this._history = [], this._comments = {}, this._header = t ? this._header : { ...BM }, this._hash = this._computeHash(), this._positionCount = /* @__PURE__ */ new Map(), this._header.SetUp = null, this._header.FEN = null;
    }
    load(t, { skipValidation: a = false, preserveHeaders: o = false } = {}) {
      let r = t.split(/\s+/);
      if (r.length >= 2 && r.length < 6) {
        let l = ["-", "-", "0", "1"];
        t = r.concat(l.slice(-(6 - r.length))).join(" ");
      }
      if (r = t.split(/\s+/), !a) {
        let { ok: l, error: i } = Kx(t);
        if (!l) throw new Error(i);
      }
      let n = r[0], s = 0;
      this.clear({ preserveHeaders: o });
      for (let l = 0; l < n.length; l++) {
        let i = n.charAt(l);
        if (i === "/") s += 8;
        else if (hv(i)) s += parseInt(i, 10);
        else {
          let u = i < "a" ? ua : Ja;
          this._put({ type: i.toLowerCase(), color: u }, $t(s)), s++;
        }
      }
      this._turn = r[1], r[2].indexOf("K") > -1 && (this._castling.w |= me.KSIDE_CASTLE), r[2].indexOf("Q") > -1 && (this._castling.w |= me.QSIDE_CASTLE), r[2].indexOf("k") > -1 && (this._castling.b |= me.KSIDE_CASTLE), r[2].indexOf("q") > -1 && (this._castling.b |= me.QSIDE_CASTLE), this._epSquare = r[3] === "-" ? sa : de[r[3]], this._halfMoves = parseInt(r[4], 10), this._moveNumber = parseInt(r[5], 10), this._hash = this._computeHash(), this._updateSetup(t), this._incPositionCount();
    }
    fen({ forceEnpassantSquare: t = false } = {}) {
      let a = 0, o = "";
      for (let s = de.a8; s <= de.h1; s++) {
        if (this._board[s]) {
          a > 0 && (o += a, a = 0);
          let { color: l, type: i } = this._board[s];
          o += l === ua ? i.toUpperCase() : i.toLowerCase();
        } else a++;
        s + 1 & 136 && (a > 0 && (o += a), s !== de.h1 && (o += "/"), a = 0, s += 8);
      }
      let r = "";
      this._castling[ua] & me.KSIDE_CASTLE && (r += "K"), this._castling[ua] & me.QSIDE_CASTLE && (r += "Q"), this._castling[Ja] & me.KSIDE_CASTLE && (r += "k"), this._castling[Ja] & me.QSIDE_CASTLE && (r += "q"), r = r || "-";
      let n = "-";
      if (this._epSquare !== sa) if (t) n = $t(this._epSquare);
      else {
        let s = this._epSquare + (this._turn === ua ? 16 : -16), l = [s + 1, s - 1];
        for (let i of l) {
          if (i & 136) continue;
          let u = this._turn;
          if (this._board[i]?.color === u && this._board[i]?.type === Nt) {
            this._makeMove({ color: u, from: i, to: this._epSquare, piece: Nt, captured: Nt, flags: me.EP_CAPTURE });
            let c = !this._isKingAttacked(u);
            if (this._undoMove(), c) {
              n = $t(this._epSquare);
              break;
            }
          }
        }
      }
      return [o, this._turn, r, n, this._halfMoves, this._moveNumber].join(" ");
    }
    _pieceKey(t) {
      if (!this._board[t]) return 0n;
      let { color: a, type: o } = this._board[t], r = { w: 0, b: 1 }[a], n = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }[o];
      return RM[r][n][t];
    }
    _epKey() {
      return this._epSquare === sa ? 0n : MM[this._epSquare & 7];
    }
    _castlingKey() {
      let t = this._castling.w >> 5 | this._castling.b >> 3;
      return DM[t];
    }
    _computeHash() {
      let t = 0n;
      for (let a = de.a8; a <= de.h1; a++) {
        if (a & 136) {
          a += 7;
          continue;
        }
        this._board[a] && (t ^= this._pieceKey(a));
      }
      return t ^= this._epKey(), t ^= this._castlingKey(), this._turn === "b" && (t ^= qx), t;
    }
    _updateSetup(t) {
      this._history.length > 0 || (t !== Io ? (this._header.SetUp = "1", this._header.FEN = t) : (this._header.SetUp = null, this._header.FEN = null));
    }
    reset() {
      this.load(Io);
    }
    get(t) {
      return this._board[de[t]];
    }
    findPiece(t) {
      let a = [];
      for (let o = de.a8; o <= de.h1; o++) {
        if (o & 136) {
          o += 7;
          continue;
        }
        !this._board[o] || this._board[o]?.color !== t.color || this._board[o].color === t.color && this._board[o].type === t.type && a.push($t(o));
      }
      return a;
    }
    put({ type: t, color: a }, o) {
      return this._put({ type: t, color: a }, o) ? (this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), true) : false;
    }
    _set(t, a) {
      this._hash ^= this._pieceKey(t), this._board[t] = a, this._hash ^= this._pieceKey(t);
    }
    _put({ type: t, color: a }, o) {
      if (UM.indexOf(t.toLowerCase()) === -1 || !(o in de)) return false;
      let r = de[o];
      if (t == jt && !(this._kings[a] == sa || this._kings[a] == r)) return false;
      let n = this._board[r];
      return n && n.type === jt && (this._kings[n.color] = sa), this._set(r, { type: t, color: a }), t === jt && (this._kings[a] = r), true;
    }
    _clear(t) {
      this._hash ^= this._pieceKey(t), delete this._board[t];
    }
    remove(t) {
      let a = this.get(t);
      return this._clear(de[t]), a && a.type === jt && (this._kings[a.color] = sa), this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), a;
    }
    _updateCastlingRights() {
      this._hash ^= this._castlingKey();
      let t = this._board[de.e1]?.type === jt && this._board[de.e1]?.color === ua, a = this._board[de.e8]?.type === jt && this._board[de.e8]?.color === Ja;
      (!t || this._board[de.a1]?.type !== Pu || this._board[de.a1]?.color !== ua) && (this._castling.w &= -65), (!t || this._board[de.h1]?.type !== Pu || this._board[de.h1]?.color !== ua) && (this._castling.w &= -33), (!a || this._board[de.a8]?.type !== Pu || this._board[de.a8]?.color !== Ja) && (this._castling.b &= -65), (!a || this._board[de.h8]?.type !== Pu || this._board[de.h8]?.color !== Ja) && (this._castling.b &= -33), this._hash ^= this._castlingKey();
    }
    _updateEnPassantSquare() {
      if (this._epSquare === sa) return;
      let t = this._epSquare + (this._turn === ua ? -16 : 16), a = this._epSquare + (this._turn === ua ? 16 : -16), o = [a + 1, a - 1];
      if (this._board[t] !== null || this._board[this._epSquare] !== null || this._board[a]?.color !== _u(this._turn) || this._board[a]?.type !== Nt) {
        this._hash ^= this._epKey(), this._epSquare = sa;
        return;
      }
      let r = (n) => !(n & 136) && this._board[n]?.color === this._turn && this._board[n]?.type === Nt;
      o.some(r) || (this._hash ^= this._epKey(), this._epSquare = sa);
    }
    _attacked(t, a, o) {
      let r = [];
      for (let n = de.a8; n <= de.h1; n++) {
        if (n & 136) {
          n += 7;
          continue;
        }
        if (this._board[n] === void 0 || this._board[n].color !== t) continue;
        let s = this._board[n], l = n - a;
        if (l === 0) continue;
        let i = l + 119;
        if (_M[i] & NM[s.type]) {
          if (s.type === Nt) {
            if (l > 0 && s.color === ua || l <= 0 && s.color === Ja) if (o) r.push($t(n));
            else return true;
            continue;
          }
          if (s.type === "n" || s.type === "k") if (o) {
            r.push($t(n));
            continue;
          } else return true;
          let u = PM[i], c = n + u, d = false;
          for (; c !== a; ) {
            if (this._board[c] != null) {
              d = true;
              break;
            }
            c += u;
          }
          if (!d) if (o) {
            r.push($t(n));
            continue;
          } else return true;
        }
      }
      return o ? r : false;
    }
    attackers(t, a) {
      return a ? this._attacked(a, de[t], true) : this._attacked(this._turn, de[t], true);
    }
    _isKingAttacked(t) {
      let a = this._kings[t];
      return a === -1 ? false : this._attacked(_u(t), a);
    }
    hash() {
      return this._hash.toString(16);
    }
    isAttacked(t, a) {
      return this._attacked(a, de[t]);
    }
    isCheck() {
      return this._isKingAttacked(this._turn);
    }
    inCheck() {
      return this.isCheck();
    }
    isCheckmate() {
      return this.isCheck() && this._moves().length === 0;
    }
    isStalemate() {
      return !this.isCheck() && this._moves().length === 0;
    }
    isInsufficientMaterial() {
      let t = { b: 0, n: 0, r: 0, q: 0, k: 0, p: 0 }, a = [], o = 0, r = 0;
      for (let n = de.a8; n <= de.h1; n++) {
        if (r = (r + 1) % 2, n & 136) {
          n += 7;
          continue;
        }
        let s = this._board[n];
        s && (t[s.type] = s.type in t ? t[s.type] + 1 : 1, s.type === zd && a.push(r), o++);
      }
      if (o === 2) return true;
      if (o === 3 && (t[zd] === 1 || t[jx] === 1)) return true;
      if (o === t[zd] + 2) {
        let n = 0, s = a.length;
        for (let l = 0; l < s; l++) n += a[l];
        if (n === 0 || n === s) return true;
      }
      return false;
    }
    isThreefoldRepetition() {
      return this._getPositionCount(this._hash) >= 3;
    }
    isDrawByFiftyMoves() {
      return this._halfMoves >= 100;
    }
    isDraw() {
      return this.isDrawByFiftyMoves() || this.isStalemate() || this.isInsufficientMaterial() || this.isThreefoldRepetition();
    }
    isGameOver() {
      return this.isCheckmate() || this.isDraw();
    }
    moves({ verbose: t = false, square: a = void 0, piece: o = void 0 } = {}) {
      let r = this._moves({ square: a, piece: o });
      return t ? r.map((n) => new Hl(this, n)) : r.map((n) => this._moveToSan(n, r));
    }
    _moves({ legal: t = true, piece: a = void 0, square: o = void 0 } = {}) {
      let r = o ? o.toLowerCase() : void 0, n = a?.toLowerCase(), s = [], l = this._turn, i = _u(l), u = de.a8, c = de.h1, d = false;
      if (r) if (r in de) u = c = de[r], d = true;
      else return [];
      for (let p = u; p <= c; p++) {
        if (p & 136) {
          p += 7;
          continue;
        }
        if (!this._board[p] || this._board[p].color === i) continue;
        let { type: x } = this._board[p], S;
        if (x === Nt) {
          if (n && n !== x) continue;
          S = p + Fx[l][0], this._board[S] || (mn(s, l, p, S, Nt), S = p + Fx[l][1], VM[l] === ss(p) && !this._board[S] && mn(s, l, p, S, Nt, void 0, me.BIG_PAWN));
          for (let v = 2; v < 4; v++) S = p + Fx[l][v], !(S & 136) && (this._board[S]?.color === i ? mn(s, l, p, S, Nt, this._board[S].type, me.CAPTURE) : S === this._epSquare && mn(s, l, p, S, Nt, Nt, me.EP_CAPTURE));
        } else {
          if (n && n !== x) continue;
          for (let v = 0, g = dv[x].length; v < g; v++) {
            let m = dv[x][v];
            for (S = p; S += m, !(S & 136); ) {
              if (!this._board[S]) mn(s, l, p, S, x);
              else {
                if (this._board[S].color === l) break;
                mn(s, l, p, S, x, this._board[S].type, me.CAPTURE);
                break;
              }
              if (x === jx || x === jt) break;
            }
          }
        }
      }
      if ((n === void 0 || n === jt) && (!d || c === this._kings[l])) {
        if (this._castling[l] & me.KSIDE_CASTLE) {
          let p = this._kings[l], x = p + 2;
          !this._board[p + 1] && !this._board[x] && !this._attacked(i, this._kings[l]) && !this._attacked(i, p + 1) && !this._attacked(i, x) && mn(s, l, this._kings[l], x, jt, void 0, me.KSIDE_CASTLE);
        }
        if (this._castling[l] & me.QSIDE_CASTLE) {
          let p = this._kings[l], x = p - 2;
          !this._board[p - 1] && !this._board[p - 2] && !this._board[p - 3] && !this._attacked(i, this._kings[l]) && !this._attacked(i, p - 1) && !this._attacked(i, x) && mn(s, l, this._kings[l], x, jt, void 0, me.QSIDE_CASTLE);
        }
      }
      if (!t || this._kings[l] === -1) return s;
      let f = [];
      for (let p = 0, x = s.length; p < x; p++) this._makeMove(s[p]), this._isKingAttacked(l) || f.push(s[p]), this._undoMove();
      return f;
    }
    move(t, { strict: a = false } = {}) {
      let o = null;
      if (typeof t == "string") o = this._moveFromSan(t, a);
      else if (t === null) o = this._moveFromSan(Vx, a);
      else if (typeof t == "object") {
        let n = this._moves();
        for (let s = 0, l = n.length; s < l; s++) if (t.from === $t(n[s].from) && t.to === $t(n[s].to) && (!("promotion" in n[s]) || t.promotion === n[s].promotion)) {
          o = n[s];
          break;
        }
      }
      if (!o) throw typeof t == "string" ? new Error(`Invalid move: ${t}`) : new Error(`Invalid move: ${JSON.stringify(t)}`);
      if (this.isCheck() && o.flags & me.NULL_MOVE) throw new Error("Null move not allowed when in check");
      let r = new Hl(this, o);
      return this._makeMove(o), this._incPositionCount(), r;
    }
    _push(t) {
      this._history.push({ move: t, kings: { b: this._kings.b, w: this._kings.w }, turn: this._turn, castling: { b: this._castling.b, w: this._castling.w }, epSquare: this._epSquare, halfMoves: this._halfMoves, moveNumber: this._moveNumber });
    }
    _movePiece(t, a) {
      this._hash ^= this._pieceKey(t), this._board[a] = this._board[t], delete this._board[t], this._hash ^= this._pieceKey(a);
    }
    _makeMove(t) {
      let a = this._turn, o = _u(a);
      if (this._push(t), t.flags & me.NULL_MOVE) {
        a === Ja && this._moveNumber++, this._halfMoves++, this._turn = o, this._epSquare = sa;
        return;
      }
      if (this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), t.captured && (this._hash ^= this._pieceKey(t.to)), this._movePiece(t.from, t.to), t.flags & me.EP_CAPTURE && (this._turn === Ja ? this._clear(t.to - 16) : this._clear(t.to + 16)), t.promotion && (this._clear(t.to), this._set(t.to, { type: t.promotion, color: a })), this._board[t.to].type === jt) {
        if (this._kings[a] = t.to, t.flags & me.KSIDE_CASTLE) {
          let r = t.to - 1, n = t.to + 1;
          this._movePiece(n, r);
        } else if (t.flags & me.QSIDE_CASTLE) {
          let r = t.to + 1, n = t.to - 2;
          this._movePiece(n, r);
        }
        this._castling[a] = 0;
      }
      if (this._castling[a]) {
        for (let r = 0, n = pn[a].length; r < n; r++) if (t.from === pn[a][r].square && this._castling[a] & pn[a][r].flag) {
          this._castling[a] ^= pn[a][r].flag;
          break;
        }
      }
      if (this._castling[o]) {
        for (let r = 0, n = pn[o].length; r < n; r++) if (t.to === pn[o][r].square && this._castling[o] & pn[o][r].flag) {
          this._castling[o] ^= pn[o][r].flag;
          break;
        }
      }
      if (this._hash ^= this._castlingKey(), t.flags & me.BIG_PAWN) {
        let r;
        a === Ja ? r = t.to - 16 : r = t.to + 16, !(t.to - 1 & 136) && this._board[t.to - 1]?.type === Nt && this._board[t.to - 1]?.color === o || !(t.to + 1 & 136) && this._board[t.to + 1]?.type === Nt && this._board[t.to + 1]?.color === o ? (this._epSquare = r, this._hash ^= this._epKey()) : this._epSquare = sa;
      } else this._epSquare = sa;
      t.piece === Nt ? this._halfMoves = 0 : t.flags & (me.CAPTURE | me.EP_CAPTURE) ? this._halfMoves = 0 : this._halfMoves++, a === Ja && this._moveNumber++, this._turn = o, this._hash ^= qx;
    }
    undo() {
      let t = this._hash, a = this._undoMove();
      if (a) {
        let o = new Hl(this, a);
        return this._decPositionCount(t), o;
      }
      return null;
    }
    _undoMove() {
      let t = this._history.pop();
      if (t === void 0) return null;
      this._hash ^= this._epKey(), this._hash ^= this._castlingKey();
      let a = t.move;
      this._kings = t.kings, this._turn = t.turn, this._castling = t.castling, this._epSquare = t.epSquare, this._halfMoves = t.halfMoves, this._moveNumber = t.moveNumber, this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), this._hash ^= qx;
      let o = this._turn, r = _u(o);
      if (a.flags & me.NULL_MOVE) return a;
      if (this._movePiece(a.to, a.from), a.piece && (this._clear(a.from), this._set(a.from, { type: a.piece, color: o })), a.captured) if (a.flags & me.EP_CAPTURE) {
        let n;
        o === Ja ? n = a.to - 16 : n = a.to + 16, this._set(n, { type: Nt, color: r });
      } else this._set(a.to, { type: a.captured, color: r });
      if (a.flags & (me.KSIDE_CASTLE | me.QSIDE_CASTLE)) {
        let n, s;
        a.flags & me.KSIDE_CASTLE ? (n = a.to + 1, s = a.to - 1) : (n = a.to - 2, s = a.to + 1), this._movePiece(s, n);
      }
      return a;
    }
    pgn({ newline: t = `
`, maxWidth: a = 0 } = {}) {
      let o = [], r = false;
      for (let f in this._header) this._header[f] && o.push(`[${f} "${this._header[f]}"]` + t), r = true;
      r && this._history.length && o.push(t);
      let n = (f) => {
        let p = this._comments[this.fen()];
        if (typeof p < "u") {
          let x = f.length > 0 ? " " : "";
          f = `${f}${x}{${p}}`;
        }
        return f;
      }, s = [];
      for (; this._history.length > 0; ) s.push(this._undoMove());
      let l = [], i = "";
      for (s.length === 0 && l.push(n("")); s.length > 0; ) {
        i = n(i);
        let f = s.pop();
        if (!f) break;
        if (!this._history.length && f.color === "b") {
          let p = `${this._moveNumber}. ...`;
          i = i ? `${i} ${p}` : p;
        } else f.color === "w" && (i.length && l.push(i), i = this._moveNumber + ".");
        i = i + " " + this._moveToSan(f, this._moves({ legal: true })), this._makeMove(f);
      }
      if (i.length && l.push(n(i)), l.push(this._header.Result || "*"), a === 0) return o.join("") + l.join(" ");
      let u = function() {
        return o.length > 0 && o[o.length - 1] === " " ? (o.pop(), true) : false;
      }, c = function(f, p) {
        for (let x of p.split(" ")) if (x) {
          if (f + x.length > a) {
            for (; u(); ) f--;
            o.push(t), f = 0;
          }
          o.push(x), f += x.length, o.push(" "), f++;
        }
        return u() && f--, f;
      }, d = 0;
      for (let f = 0; f < l.length; f++) {
        if (d + l[f].length > a && l[f].includes("{")) {
          d = c(d, l[f]);
          continue;
        }
        d + l[f].length > a && f !== 0 ? (o[o.length - 1] === " " && o.pop(), o.push(t), d = 0) : f !== 0 && (o.push(" "), d++), o.push(l[f]), d += l[f].length;
      }
      return o.join("");
    }
    header(...t) {
      for (let a = 0; a < t.length; a += 2) typeof t[a] == "string" && typeof t[a + 1] == "string" && (this._header[t[a]] = t[a + 1]);
      return this._header;
    }
    setHeader(t, a) {
      return this._header[t] = a ?? Xx[t] ?? null, this.getHeaders();
    }
    removeHeader(t) {
      return t in this._header ? (this._header[t] = Xx[t] || null, true) : false;
    }
    getHeaders() {
      let t = {};
      for (let [a, o] of Object.entries(this._header)) o !== null && (t[a] = o);
      return t;
    }
    loadPgn(t, { strict: a = false, newlineChar: o = `\r?
` } = {}) {
      o !== `\r?
` && (t = t.replace(new RegExp(o, "g"), `
`));
      let r = TM(t);
      this.reset();
      let n = r.headers, s = "";
      for (let u in n) u.toLowerCase() === "fen" && (s = n[u]), this.header(u, n[u]);
      if (!a) s && this.load(s, { preserveHeaders: true });
      else if (n.SetUp === "1") {
        if (!("FEN" in n)) throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");
        this.load(n.FEN, { preserveHeaders: true });
      }
      let l = r.root;
      for (; l; ) {
        if (l.move) {
          let u = this._moveFromSan(l.move, a);
          if (u == null) throw new Error(`Invalid move in PGN: ${l.move}`);
          this._makeMove(u), this._incPositionCount();
        }
        l.comment !== void 0 && (this._comments[this.fen()] = l.comment), l = l.variations[0];
      }
      let i = r.result;
      i && Object.keys(this._header).length && this._header.Result !== i && this.setHeader("Result", i);
    }
    _moveToSan(t, a) {
      let o = "";
      if (t.flags & me.KSIDE_CASTLE) o = "O-O";
      else if (t.flags & me.QSIDE_CASTLE) o = "O-O-O";
      else {
        if (t.flags & me.NULL_MOVE) return Vx;
        if (t.piece !== Nt) {
          let r = GM(t, a);
          o += t.piece.toUpperCase() + r;
        }
        t.flags & (me.CAPTURE | me.EP_CAPTURE) && (t.piece === Nt && (o += $t(t.from)[0]), o += "x"), o += $t(t.to), t.promotion && (o += "=" + t.promotion.toUpperCase());
      }
      return this._makeMove(t), this.isCheck() && (this.isCheckmate() ? o += "#" : o += "+"), this._undoMove(), o;
    }
    _moveFromSan(t, a = false) {
      let o = Gx(t);
      if (a || (o === "0-0" ? o = "O-O" : o === "0-0-0" && (o = "O-O-O")), o == Vx) return { color: this._turn, from: 0, to: 0, piece: "k", flags: me.NULL_MOVE };
      let r = mv(o), n = this._moves({ legal: true, piece: r });
      for (let f = 0, p = n.length; f < p; f++) if (o === Gx(this._moveToSan(n[f], n))) return n[f];
      if (a) return null;
      let s, l, i, u, c, d = false;
      if (l = o.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/), l ? (s = l[1], i = l[2], u = l[3], c = l[4], i.length == 1 && (d = true)) : (l = o.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/), l && (s = l[1], i = l[2], u = l[3], c = l[4], i.length == 1 && (d = true))), r = mv(o), n = this._moves({ legal: true, piece: s || r }), !u) return null;
      for (let f = 0, p = n.length; f < p; f++) if (i) {
        if ((!s || s.toLowerCase() == n[f].piece) && de[i] == n[f].from && de[u] == n[f].to && (!c || c.toLowerCase() == n[f].promotion)) return n[f];
        if (d) {
          let x = $t(n[f].from);
          if ((!s || s.toLowerCase() == n[f].piece) && de[u] == n[f].to && (i == x[0] || i == x[1]) && (!c || c.toLowerCase() == n[f].promotion)) return n[f];
        }
      } else if (o === Gx(this._moveToSan(n[f], n)).replace("x", "")) return n[f];
      return null;
    }
    ascii() {
      let t = `   +------------------------+
`;
      for (let a = de.a8; a <= de.h1; a++) {
        if (Nu(a) === 0 && (t += " " + "87654321"[ss(a)] + " |"), this._board[a]) {
          let o = this._board[a].type, n = this._board[a].color === ua ? o.toUpperCase() : o.toLowerCase();
          t += " " + n + " ";
        } else t += " . ";
        a + 1 & 136 && (t += `|
`, a += 8);
      }
      return t += `   +------------------------+
`, t += "     a  b  c  d  e  f  g  h", t;
    }
    perft(t) {
      let a = this._moves({ legal: false }), o = 0, r = this._turn;
      for (let n = 0, s = a.length; n < s; n++) this._makeMove(a[n]), this._isKingAttacked(r) || (t - 1 > 0 ? o += this.perft(t - 1) : o++), this._undoMove();
      return o;
    }
    setTurn(t) {
      return this._turn == t ? false : (this.move("--"), true);
    }
    turn() {
      return this._turn;
    }
    board() {
      let t = [], a = [];
      for (let o = de.a8; o <= de.h1; o++) this._board[o] == null ? a.push(null) : a.push({ square: $t(o), type: this._board[o].type, color: this._board[o].color }), o + 1 & 136 && (t.push(a), a = [], o += 8);
      return t;
    }
    squareColor(t) {
      if (t in de) {
        let a = de[t];
        return (ss(a) + Nu(a)) % 2 === 0 ? "light" : "dark";
      }
      return null;
    }
    history({ verbose: t = false } = {}) {
      let a = [], o = [];
      for (; this._history.length > 0; ) a.push(this._undoMove());
      for (; ; ) {
        let r = a.pop();
        if (!r) break;
        t ? o.push(new Hl(this, r)) : o.push(this._moveToSan(r, this._moves())), this._makeMove(r);
      }
      return o;
    }
    _getPositionCount(t) {
      return this._positionCount.get(t) ?? 0;
    }
    _incPositionCount() {
      this._positionCount.set(this._hash, (this._positionCount.get(this._hash) ?? 0) + 1);
    }
    _decPositionCount(t) {
      let a = this._positionCount.get(t) ?? 0;
      a === 1 ? this._positionCount.delete(t) : this._positionCount.set(t, a - 1);
    }
    _pruneComments() {
      let t = [], a = {}, o = (r) => {
        r in this._comments && (a[r] = this._comments[r]);
      };
      for (; this._history.length > 0; ) t.push(this._undoMove());
      for (o(this.fen()); ; ) {
        let r = t.pop();
        if (!r) break;
        this._makeMove(r), o(this.fen());
      }
      this._comments = a;
    }
    getComment() {
      return this._comments[this.fen()];
    }
    setComment(t) {
      this._comments[this.fen()] = t.replace("{", "[").replace("}", "]");
    }
    deleteComment() {
      return this.removeComment();
    }
    removeComment() {
      let t = this._comments[this.fen()];
      return delete this._comments[this.fen()], t;
    }
    getComments() {
      return this._pruneComments(), Object.keys(this._comments).map((t) => ({ fen: t, comment: this._comments[t] }));
    }
    deleteComments() {
      return this.removeComments();
    }
    removeComments() {
      return this._pruneComments(), Object.keys(this._comments).map((t) => {
        let a = this._comments[t];
        return delete this._comments[t], { fen: t, comment: a };
      });
    }
    setCastlingRights(t, a) {
      for (let r of [jt, hn]) a[r] !== void 0 && (a[r] ? this._castling[t] |= Ud[r] : this._castling[t] &= ~Ud[r]);
      this._updateCastlingRights();
      let o = this.getCastlingRights(t);
      return (a[jt] === void 0 || a[jt] === o[jt]) && (a[hn] === void 0 || a[hn] === o[hn]);
    }
    getCastlingRights(t) {
      return { [jt]: (this._castling[t] & Ud[jt]) !== 0, [hn]: (this._castling[t] & Ud[hn]) !== 0 };
    }
    moveNumber() {
      return this._moveNumber;
    }
  };
  var Gd = _(F(), 1);
  var Fd = (...e) => e.filter((t, a, o) => !!t && t.trim() !== "" && o.indexOf(t) === a).join(" ").trim();
  var gv = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  var xv = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, a, o) => o ? o.toUpperCase() : a.toLowerCase());
  var Yx = (e) => {
    let t = xv(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  var Uu = _(F(), 1);
  var Vd = { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  var bv = (e) => {
    for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return true;
    return false;
  };
  var ql = _(F(), 1);
  var jM = (0, ql.createContext)({});
  var yv = () => (0, ql.useContext)(jM);
  var Sv = (0, Uu.forwardRef)(({ color: e, size: t, strokeWidth: a, absoluteStrokeWidth: o, className: r = "", children: n, iconNode: s, ...l }, i) => {
    let { size: u = 24, strokeWidth: c = 2, absoluteStrokeWidth: d = false, color: f = "currentColor", className: p = "" } = yv() ?? {}, x = o ?? d ? Number(a ?? c) * 24 / Number(t ?? u) : a ?? c;
    return (0, Uu.createElement)("svg", { ref: i, ...Vd, width: t ?? u ?? Vd.width, height: t ?? u ?? Vd.height, stroke: e ?? f, strokeWidth: x, className: Fd("lucide", p, r), ...!n && !bv(l) && { "aria-hidden": "true" }, ...l }, [...s.map(([S, v]) => (0, Uu.createElement)(S, v)), ...Array.isArray(n) ? n : [n]]);
  });
  var Q = (e, t) => {
    let a = (0, Gd.forwardRef)(({ className: o, ...r }, n) => (0, Gd.createElement)(Sv, { ref: n, iconNode: t, className: Fd(`lucide-${gv(Yx(e))}`, `lucide-${e}`, o), ...r }));
    return a.displayName = Yx(e), a;
  };
  var XM = [["path", { d: "M8 3 4 7l4 4", key: "9rb6wj" }], ["path", { d: "M4 7h16", key: "6tx8e3" }], ["path", { d: "m16 21 4-4-4-4", key: "siv7j2" }], ["path", { d: "M20 17H4", key: "h6l3hr" }]], Hu = Q("arrow-left-right", XM);
  var KM = [["path", { d: "M5 12h14", key: "1ays0h" }], ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]], xn = Q("arrow-right", KM);
  var YM = [["path", { d: "M7 7h10v10", key: "1tivn9" }], ["path", { d: "M7 17 17 7", key: "1vkiza" }]], ls = Q("arrow-up-right", YM);
  var ZM = [["path", { d: "M12 5v16", key: "1f6ucr" }], ["path", { d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z", key: "1fyvmf" }]], zu = Q("book-open", ZM);
  var WM = [["path", { d: "M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z", key: "b89hwq" }], ["path", { d: "M15 18c1.5-.615 3-2.461 3-4.923C18 8.769 14.5 4.462 12 2 9.5 4.462 6 8.77 6 13.077 6 15.539 7.5 17.385 9 18", key: "8jdkhx" }], ["path", { d: "m16 7-2.5 2.5", key: "1jq90w" }], ["path", { d: "M9 2h6", key: "1jrp98" }]], qu = Q("chess-bishop", WM);
  var QM = [["path", { d: "M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z", key: "mqzwx6" }], ["path", { d: "m6.7 18-1-1C4.35 15.682 3 14.09 3 12a5 5 0 0 1 4.95-5c1.584 0 2.7.455 4.05 1.818C13.35 7.455 14.466 7 16.05 7A5 5 0 0 1 21 12c0 2.082-1.359 3.673-2.7 5l-1 1", key: "1gdt1g" }], ["path", { d: "M10 4h4", key: "1xpv9s" }], ["path", { d: "M12 2v6.818", key: "b17a49" }]], is = Q("chess-king", QM);
  var $M = [["path", { d: "M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z", key: "b89hwq" }], ["path", { d: "M16.5 18c1-2 2.5-5 2.5-9a7 7 0 0 0-7-7H6.635a1 1 0 0 0-.768 1.64L7 5l-2.32 5.802a2 2 0 0 0 .95 2.526l2.87 1.456", key: "axbnlq" }], ["path", { d: "m15 5 1.425-1.425", key: "15xz8w" }], ["path", { d: "m17 8 1.53-1.53", key: "15zhqh" }], ["path", { d: "M9.713 12.185 7 18", key: "1ocm0l" }]], Fu = Q("chess-knight", $M);
  var JM = [["path", { d: "M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z", key: "b89hwq" }], ["path", { d: "m14.5 10 1.5 8", key: "cim3qy" }], ["path", { d: "M7 10h10", key: "1101jm" }], ["path", { d: "m8 18 1.5-8", key: "ja3yjd" }], ["circle", { cx: "12", cy: "6", r: "4", key: "1frrej" }]], Vu = Q("chess-pawn", JM);
  var eD = [["path", { d: "M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z", key: "mqzwx6" }], ["path", { d: "m12.474 5.943 1.567 5.34a1 1 0 0 0 1.75.328l2.616-3.402", key: "1js4gl" }], ["path", { d: "m20 9-3 9", key: "r75r3f" }], ["path", { d: "m5.594 8.209 2.615 3.403a1 1 0 0 0 1.75-.329l1.567-5.34", key: "1joj19" }], ["path", { d: "M7 18 4 9", key: "1mfzj8" }], ["circle", { cx: "12", cy: "4", r: "2", key: "muu5ef" }], ["circle", { cx: "20", cy: "7", r: "2", key: "9w7p1x" }], ["circle", { cx: "4", cy: "7", r: "2", key: "1d9wy8" }]], Gu = Q("chess-queen", eD);
  var tD = [["path", { d: "M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z", key: "b89hwq" }], ["path", { d: "M10 2v2", key: "7u0qdc" }], ["path", { d: "M14 2v2", key: "6buw04" }], ["path", { d: "m17 18-1-9", key: "10nd7q" }], ["path", { d: "M6 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2", key: "uxf4yx" }], ["path", { d: "M6 4h12", key: "1x2ag7" }], ["path", { d: "m7 18 1-9", key: "1si9vq" }]], ju = Q("chess-rook", tD);
  var aD = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], Xu = Q("chevron-left", aD);
  var oD = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Ku = Q("chevron-right", oD);
  var rD = [["path", { d: "m11 17-5-5 5-5", key: "13zhaf" }], ["path", { d: "m18 17-5-5 5-5", key: "h8a8et" }]], Yu = Q("chevrons-left", rD);
  var nD = [["path", { d: "m6 17 5-5-5-5", key: "xnjwq" }], ["path", { d: "m13 17 5-5-5-5", key: "17xmmf" }]], Zu = Q("chevrons-right", nD);
  var sD = [["path", { d: "M12 15V3", key: "m9g1x1" }], ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }], ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]], Wu = Q("download", sD);
  var lD = [["path", { d: "M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528", key: "1jaruq" }]], Qu = Q("flag", lD);
  var iD = [["path", { d: "m11 17 2 2a1 1 0 1 0 3-3", key: "efffak" }], ["path", { d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4", key: "9pr0kb" }], ["path", { d: "m21 3 1 11h-2", key: "1tisrp" }], ["path", { d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3", key: "1uvwmv" }], ["path", { d: "M3 4h8", key: "1ep09j" }]], $u = Q("handshake", iD);
  var uD = [["path", { d: "M5 12h14", key: "1ays0h" }], ["path", { d: "M12 5v14", key: "s699le" }]], Ju = Q("plus", uD);
  var cD = [["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478", key: "1fwjs5" }], ["path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134", key: "ehdyv1" }], ["path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134", key: "1q22gi" }], ["path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478", key: "r2q7qm" }], ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]], ec = Q("radio", cD);
  var fD = [["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }], ["path", { d: "M21 3v5h-5", key: "1q7to0" }], ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }], ["path", { d: "M8 16H3v5", key: "1cv678" }]], tc = Q("refresh-cw", fD);
  var dD = [["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }], ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]], ac = Q("search", dD);
  var pD = [["path", { d: "M14 17H5", key: "gfn3mx" }], ["path", { d: "M19 7h-9", key: "6i9tg" }], ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }], ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]], oc = Q("settings-2", pD);
  var mD = [["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z", key: "oel41y" }], ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]], Fl = Q("shield-check", mD);
  var hD = [["path", { d: "M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2", key: "pwuv1l" }], ["path", { d: "M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2", key: "1y54w1" }], ["path", { d: "M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3", key: "e30mpu" }], ["path", { d: "M4 22h16", key: "57wxv0" }], ["path", { d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z", key: "1mhfuq" }], ["path", { d: "M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3", key: "i0yafy" }]], rc = Q("trophy", hD);
  var gD = [["path", { d: "M12 3v12", key: "1x0j5s" }], ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }], ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]], us = Q("upload", gD);
  var xD = [["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }], ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }], ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }], ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]], nc = Q("users", xD);
  var bD = [["path", { d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z", key: "uqj9uw" }], ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }], ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]], sc = Q("volume-2", bD);
  var yD = [["path", { d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z", key: "uqj9uw" }], ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }], ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]], lc = Q("volume-x", yD);
  var SD = [["path", { d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1", key: "18etb6" }], ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]], cs = Q("wallet", SD);
  var LD = [["path", { d: "M18 6 6 18", key: "1bl5f8" }], ["path", { d: "m6 6 12 12", key: "d8bk6v" }]], ic = Q("x", LD);
  var Fo = {};
  Qo(Fo, { Backdrop: () => Hv, Close: () => Xv, Description: () => Wv, Handle: () => Rc, Popup: () => SI, Portal: () => II, Root: () => UI, Title: () => FI, Trigger: () => jI, Viewport: () => zI, createHandle: () => XI });
  var Uv = _(F(), 1);
  function CD(e, t) {
    return function(o, ...r) {
      let n = new URL(e);
      return n.searchParams.set("code", o.toString()), r.forEach((s) => n.searchParams.append("args[]", s)), `${t} error #${o}; visit ${n} for the full message.`;
    };
  }
  var vD = CD("https://base-ui.com/production-error", "Base UI"), ca = vD;
  var jd = _(F(), 1), Zx = jd.createContext(void 0);
  function Jt(e) {
    let t = jd.useContext(Zx);
    if (!e && t === void 0) throw new Error(ca(27));
    return t;
  }
  var ds = _(F(), 1);
  var Cv = _(F(), 1), Lv = {};
  function fa(e, t) {
    let a = Cv.useRef(Lv);
    return a.current === Lv && (a.current = e(t)), a;
  }
  function Ho(e, t, a, o) {
    let r = fa(wv).current;
    return wD(r, e, t, a, o) && Iv(r, [e, t, a, o]), r.callback;
  }
  function vv(e) {
    let t = fa(wv).current;
    return ID(t, e) && Iv(t, e), t.callback;
  }
  function wv() {
    return { callback: null, cleanup: null, refs: [] };
  }
  function wD(e, t, a, o, r) {
    return e.refs[0] !== t || e.refs[1] !== a || e.refs[2] !== o || e.refs[3] !== r;
  }
  function ID(e, t) {
    return e.refs.length !== t.length || e.refs.some((a, o) => a !== t[o]);
  }
  function Iv(e, t) {
    if (e.refs = t, t.every((a) => a == null)) {
      e.callback = null;
      return;
    }
    e.callback = (a) => {
      if (e.cleanup && (e.cleanup(), e.cleanup = null), a != null) {
        let o = Array(t.length).fill(null);
        for (let r = 0; r < t.length; r += 1) {
          let n = t[r];
          if (n != null) switch (typeof n) {
            case "function": {
              let s = n(a);
              typeof s == "function" && (o[r] = s);
              break;
            }
            case "object": {
              n.current = a;
              break;
            }
            default:
          }
        }
        e.cleanup = () => {
          for (let r = 0; r < t.length; r += 1) {
            let n = t[r];
            if (n != null) switch (typeof n) {
              case "function": {
                let s = o[r];
                typeof s == "function" ? s() : n(null);
                break;
              }
              case "object": {
                n.current = null;
                break;
              }
              default:
            }
          }
        };
      }
    };
  }
  var Av = _(F(), 1);
  var Ev = _(F(), 1), ED = parseInt(Ev.version, 10);
  function Vl(e) {
    return ED >= e;
  }
  function Wx(e) {
    if (!Av.isValidElement(e)) return null;
    let t = e, a = t.props;
    return (Vl(19) ? a?.ref : t.ref) ?? null;
  }
  function uc(e, t) {
    if (e && !t) return e;
    if (!e && t) return t;
    if (e || t) return { ...e, ...t };
  }
  function br() {
  }
  var fs = Object.freeze([]), Et = Object.freeze({});
  function Tv(e, t) {
    let a = {};
    for (let o in e) {
      let r = e[o];
      if (t?.hasOwnProperty(o)) {
        let n = t[o](r);
        n != null && Object.assign(a, n);
        continue;
      }
      r === true ? a[`data-${o.toLowerCase()}`] = "" : r && (a[`data-${o.toLowerCase()}`] = r.toString());
    }
    return a;
  }
  function kv(e, t) {
    return typeof e == "function" ? e(t) : e;
  }
  function Rv(e, t) {
    return typeof e == "function" ? e(t) : e;
  }
  var Qx = {};
  function fc(e, t, a, o, r) {
    if (!a && !o && !r && !e) return Xd(t);
    let n = Xd(e);
    return t && (n = cc(n, t)), a && (n = cc(n, a)), o && (n = cc(n, o)), r && (n = cc(n, r)), n;
  }
  function Mv(e) {
    if (e.length === 0) return Qx;
    if (e.length === 1) return Xd(e[0]);
    let t = Xd(e[0]);
    for (let a = 1; a < e.length; a += 1) t = cc(t, e[a]);
    return t;
  }
  function Xd(e) {
    return $x(e) ? { ...Ov(e, Qx) } : AD(e);
  }
  function cc(e, t) {
    return $x(t) ? Ov(t, e) : TD(e, t);
  }
  function AD(e) {
    let t = { ...e };
    for (let a in t) {
      let o = t[a];
      Dv(a, o) && (t[a] = Bv(o));
    }
    return t;
  }
  function TD(e, t) {
    if (!t) return e;
    for (let a in t) {
      let o = t[a];
      switch (a) {
        case "style": {
          e[a] = uc(e.style, o);
          break;
        }
        case "className": {
          e[a] = Jx(e.className, o);
          break;
        }
        default:
          Dv(a, o) ? e[a] = kD(e[a], o) : e[a] = o;
      }
    }
    return e;
  }
  function Dv(e, t) {
    let a = e.charCodeAt(0), o = e.charCodeAt(1), r = e.charCodeAt(2);
    return a === 111 && o === 110 && r >= 65 && r <= 90 && (typeof t == "function" || typeof t > "u");
  }
  function $x(e) {
    return typeof e == "function";
  }
  function Ov(e, t) {
    return $x(e) ? e(t) : e ?? Qx;
  }
  function kD(e, t) {
    return t ? e ? (...a) => {
      let o = a[0];
      if (_v(o)) {
        let n = o;
        dc(n);
        let s = t(...a);
        return n.baseUIHandlerPrevented || e?.(...a), s;
      }
      let r = t(...a);
      return e?.(...a), r;
    } : Bv(t) : e;
  }
  function Bv(e) {
    return e && ((...t) => {
      let a = t[0];
      return _v(a) && dc(a), e(...t);
    });
  }
  function dc(e) {
    return e.preventBaseUIHandler = () => {
      e.baseUIHandlerPrevented = true;
    }, e;
  }
  function Jx(e, t) {
    return t ? e ? t + " " + e : t : e;
  }
  function _v(e) {
    return e != null && typeof e == "object" && "nativeEvent" in e;
  }
  var e0 = _(F(), 1);
  function $e(e, t, a = {}) {
    let o = t.render, r = RD(t, a);
    if (a.enabled === false) return null;
    let n = a.state ?? Et;
    return OD(e, o, r, n);
  }
  function RD(e, t = {}) {
    let { className: a, style: o, render: r } = e, { state: n = Et, ref: s, props: l, stateAttributesMapping: i, enabled: u = true } = t, c = u ? kv(a, n) : void 0, d = u ? Rv(o, n) : void 0, f = u ? Tv(n, i) : Et, p = u && l ? MD(l) : void 0, x = u ? uc(f, p) ?? {} : Et;
    return typeof document < "u" && (u ? Array.isArray(s) ? x.ref = vv([x.ref, Wx(r), ...s]) : x.ref = Ho(x.ref, Wx(r), s) : Ho(null, null)), u ? (c !== void 0 && (x.className = Jx(x.className, c)), d !== void 0 && (x.style = uc(x.style, d)), x) : Et;
  }
  function MD(e) {
    return Array.isArray(e) ? Mv(e) : fc(void 0, e);
  }
  var DD = Symbol.for("react.lazy");
  function OD(e, t, a, o) {
    if (t) {
      if (typeof t == "function") return t(a, o);
      let r = fc(a, t.props);
      r.ref = a.ref;
      let n = t;
      return n?.$$typeof === DD && (n = ds.Children.toArray(t)[0]), ds.cloneElement(n, r);
    }
    if (e && typeof e == "string") return BD(e, a);
    throw new Error(ca(8));
  }
  function BD(e, t) {
    return e === "button" ? (0, e0.createElement)("button", { type: "button", ...t, key: t.key }) : e === "img" ? (0, e0.createElement)("img", { alt: "", ...t, key: t.key }) : ds.createElement(e, t);
  }
  var t0 = (function(e) {
    return e.startingStyle = "data-starting-style", e.endingStyle = "data-ending-style", e;
  })({}), _D = { "data-starting-style": "" }, PD = { "data-ending-style": "" }, Gl = { transitionStatus(e) {
    return e === "starting" ? _D : e === "ending" ? PD : null;
  } };
  var sU = (function(e) {
    return e.open = "data-open", e.closed = "data-closed", e[e.startingStyle = t0.startingStyle] = "startingStyle", e[e.endingStyle = t0.endingStyle] = "endingStyle", e.anchorHidden = "data-anchor-hidden", e.side = "data-side", e.align = "data-align", e;
  })({});
  var ND = { "data-popup-open": "" };
  var UD = { "data-open": "" }, HD = { "data-closed": "" }, zD = { "data-anchor-hidden": "" }, Pv = { open(e) {
    return e ? ND : null;
  } };
  var a0 = { open(e) {
    return e ? UD : HD;
  }, anchorHidden(e) {
    return e ? zD : null;
  } }, Nv = { ...a0, ...Gl };
  var Hv = Uv.forwardRef(function(t, a) {
    let { render: o, className: r, style: n, forceRender: s = false, ...l } = t, i = Jt(), u = i.useState("open"), c = i.useState("nested"), d = i.useState("mounted"), f = i.useState("transitionStatus");
    return $e("div", t, { state: { open: u, transitionStatus: f }, ref: [i.context.backdropRef, a], stateAttributesMapping: Nv, props: [{ role: "presentation", hidden: !d, style: { userSelect: "none", WebkitUserSelect: "none" } }, l], enabled: s || !c });
  });
  var jv = _(F(), 1);
  var Xl = _(F(), 1);
  function Kd() {
    return typeof window < "u";
  }
  function da(e) {
    return Yd(e) ? (e.nodeName || "").toLowerCase() : "#document";
  }
  function Na(e) {
    var t;
    return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
  }
  function qD(e) {
    var t;
    return (t = (Yd(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
  }
  function Yd(e) {
    return Kd() ? e instanceof Node || e instanceof Na(e).Node : false;
  }
  function bn(e) {
    return Kd() ? e instanceof Element || e instanceof Na(e).Element : false;
  }
  function yt(e) {
    return Kd() ? e instanceof HTMLElement || e instanceof Na(e).HTMLElement : false;
  }
  function zo(e) {
    return !Kd() || typeof ShadowRoot > "u" ? false : e instanceof ShadowRoot || e instanceof Na(e).ShadowRoot;
  }
  function zv(e) {
    let { overflow: t, overflowX: a, overflowY: o, display: r } = yr(e);
    return /auto|scroll|overlay|hidden|clip/.test(t + o + a) && r !== "inline" && r !== "contents";
  }
  function Zd(e) {
    return /^(html|body|#document)$/.test(da(e));
  }
  function yr(e) {
    return Na(e).getComputedStyle(e);
  }
  function qv(e) {
    if (da(e) === "html") return e;
    let t = e.assignedSlot || e.parentNode || zo(e) && e.host || qD(e);
    return zo(t) ? t.host : t;
  }
  var FD = _(F(), 1), pc = { ...FD };
  var o0 = pc.useInsertionEffect, VD = o0 && o0 !== pc.useLayoutEffect ? o0 : (e) => e();
  function le(e) {
    let t = fa(GD).current;
    return t.next = e, VD(t.effect), t.trampoline;
  }
  function GD() {
    let e = { next: void 0, callback: jD, trampoline: (...t) => e.callback?.(...t), effect: () => {
      e.callback = e.next;
    } };
    return e;
  }
  function jD() {
  }
  var Fv = _(F(), 1), XD = () => {
  }, re = typeof document < "u" ? Fv.useLayoutEffect : XD;
  var Wd = _(F(), 1), r0 = Wd.createContext(void 0);
  function jl(e = false) {
    let t = Wd.useContext(r0);
    if (t === void 0 && !e) throw new Error(ca(16));
    return t;
  }
  var Vv = _(F(), 1);
  function Gv(e) {
    let { focusableWhenDisabled: t, disabled: a, composite: o = false, tabIndex: r = 0, isNativeButton: n } = e, s = o && t !== false, l = o && t === false;
    return { props: Vv.useMemo(() => {
      let u = { onKeyDown(c) {
        a && t && c.key !== "Tab" && c.preventDefault();
      } };
      return o || (u.tabIndex = r, !n && a && (u.tabIndex = t ? r : -1)), (n && (t || s) || !n && a) && (u["aria-disabled"] = a), n && (!t || l) && (u.disabled = a), u;
    }, [o, a, t, s, l, n, r]) };
  }
  function ot(e) {
    return e?.ownerDocument || document;
  }
  function Qd(e, t, { detail: a = 0 } = {}) {
    e.dispatchEvent(new (Na(e)).PointerEvent("click", { bubbles: true, cancelable: true, composed: true, detail: a, shiftKey: t.shiftKey, ctrlKey: t.ctrlKey, altKey: t.altKey, metaKey: t.metaKey }));
  }
  function Sr(e = {}) {
    let { disabled: t = false, focusableWhenDisabled: a, tabIndex: o = 0, native: r = true, composite: n } = e, s = Xl.useRef(null), l = jl(true), i = n ?? l !== void 0, { props: u } = Gv({ focusableWhenDisabled: a, disabled: t, composite: i, tabIndex: o, isNativeButton: r }), c = Xl.useCallback(() => {
      let p = s.current;
      n0(p) && i && t && u.disabled === void 0 && p.disabled && (p.disabled = false);
    }, [t, u.disabled, i]);
    re(c, [c]);
    let d = Xl.useCallback((p = {}) => {
      let { onClick: x, onMouseDown: S, onKeyUp: v, onKeyDown: g, onPointerDown: m, ...b } = p;
      return fc({ onClick(y) {
        if (t) {
          y.preventDefault();
          return;
        }
        x?.(y);
      }, onMouseDown(y) {
        t || S?.(y);
      }, onKeyDown(y) {
        if (t || (dc(y), g?.(y), y.baseUIHandlerPrevented)) return;
        let C = y.target === y.currentTarget, D = y.currentTarget, I = n0(D), w = !r && KD(D), M = C && (r ? I : !w), T = y.key === "Enter", K = y.key === " ", z = D.getAttribute("role"), Y = z?.startsWith("menuitem") || z === "option" || z === "gridcell";
        if (C && i && K) {
          if (y.defaultPrevented && Y) return;
          y.preventDefault(), (!r || I) && (y.preventBaseUIHandler(), Qd(D, y));
          return;
        }
        if (!M || r || !K && !T) {
          C && w && K && y.preventDefault();
          return;
        }
        y.defaultPrevented || (y.preventDefault(), T && (y.preventBaseUIHandler(), Qd(D, y)));
      }, onKeyUp(y) {
        if (!t) {
          if (dc(y), v?.(y), y.target === y.currentTarget && r && i && n0(y.currentTarget) && y.key === " ") {
            y.preventDefault();
            return;
          }
          y.baseUIHandlerPrevented || y.target === y.currentTarget && !r && !i && !y.defaultPrevented && y.key === " " && (y.preventBaseUIHandler(), Qd(y.currentTarget, y));
        }
      }, onPointerDown(y) {
        if (t) {
          y.preventDefault();
          return;
        }
        m?.(y);
      } }, r ? { type: "button" } : { role: "button" }, u, b);
    }, [t, u, i, r]), f = le((p) => {
      s.current = p, c();
    });
    return { getButtonProps: d, buttonRef: f };
  }
  function n0(e) {
    return yt(e) && e.tagName === "BUTTON";
  }
  function KD(e) {
    return yt(e) && e.tagName === "A" && !!e.href;
  }
  var Ue = {};
  Qo(Ue, { cancelOpen: () => LO, chipRemovePress: () => oO, clearPress: () => aO, closePress: () => eO, closeWatcher: () => mO, decrementPress: () => sO, disabled: () => vO, drag: () => bO, escapeKey: () => pO, focusOut: () => dO, imperativeAction: () => EO, incrementPress: () => nO, initial: () => IO, inputBlur: () => uO, inputChange: () => lO, inputClear: () => iO, inputPaste: () => cO, inputPress: () => fO, itemPress: () => JD, keyboard: () => gO, linkPress: () => tO, listNavigation: () => hO, missing: () => wO, none: () => YD, outsidePress: () => $D, pointer: () => xO, scrub: () => SO, siblingOpen: () => CO, swipe: () => AO, trackPress: () => rO, triggerFocus: () => QD, triggerHover: () => WD, triggerPress: () => ZD, wheel: () => yO, windowResize: () => TO });
  var YD = "none", ZD = "trigger-press", WD = "trigger-hover", QD = "trigger-focus", $D = "outside-press", JD = "item-press", eO = "close-press", tO = "link-press", aO = "clear-press", oO = "chip-remove-press", rO = "track-press", nO = "increment-press", sO = "decrement-press", lO = "input-change", iO = "input-clear", uO = "input-blur", cO = "input-paste", fO = "input-press", dO = "focus-out", pO = "escape-key", mO = "close-watcher", hO = "list-navigation", gO = "keyboard", xO = "pointer", bO = "drag", yO = "wheel", SO = "scrub", LO = "cancel-open", CO = "sibling-open", vO = "disabled", wO = "missing", IO = "initial", EO = "imperative-action", AO = "swipe", TO = "window-resize";
  function pt(e, t, a, o) {
    let r = false, n = false, s = o ?? Et;
    return { reason: e, event: t ?? new Event("base-ui"), cancel() {
      r = true;
    }, allowPropagation() {
      n = true;
    }, get isCanceled() {
      return r;
    }, get isPropagationAllowed() {
      return n;
    }, trigger: a, ...s };
  }
  var Xv = jv.forwardRef(function(t, a) {
    let { render: o, className: r, style: n, disabled: s = false, nativeButton: l = true, ...i } = t, u = Jt(), c = u.useState("open"), { getButtonProps: d, buttonRef: f } = Sr({ disabled: s, native: l }), p = { disabled: s };
    function x(S) {
      c && u.setOpen(false, pt(Ue.closePress, S.nativeEvent));
    }
    return $e("button", t, { state: p, ref: [a, f], props: [{ onClick: x }, i, d] });
  });
  var Zv = _(F(), 1);
  var $d = _(F(), 1);
  var Kv = 0;
  function kO(e, t = "mui") {
    let [a, o] = $d.useState(e), r = e || a;
    return $d.useEffect(() => {
      a == null && (Kv += 1, o(`${t}-${Kv}`));
    }, [a, t]), r;
  }
  var Yv = pc.useId;
  function Kl(e, t) {
    if (Yv !== void 0) {
      let a = Yv();
      return e ?? (t ? `${t}-${a}` : a);
    }
    return kO(e, t);
  }
  function qo(e) {
    return Kl(e, "base-ui");
  }
  var Wv = Zv.forwardRef(function(t, a) {
    let { render: o, className: r, style: n, id: s, ...l } = t, i = Jt(), u = qo(s);
    return i.useSyncedValueWithCleanup("descriptionElementId", u), $e("p", t, { ref: a, props: [{ id: u }, l] });
  });
  var bI = _(F(), 1);
  var Qv = _(F(), 1);
  function Jd(e) {
    Qv.useEffect(e, fs);
  }
  var mc = 0, Lr = class e {
    static create() {
      return new e();
    }
    currentId = mc;
    start(t, a) {
      this.clear(), this.currentId = setTimeout(() => {
        this.currentId = mc, a();
      }, t);
    }
    isStarted() {
      return this.currentId !== mc;
    }
    clear = () => {
      this.currentId !== mc && (clearTimeout(this.currentId), this.currentId = mc);
    };
    disposeEffect = () => this.clear;
  };
  function yn() {
    let e = fa(Lr.create).current;
    return Jd(e.disposeEffect), e;
  }
  var Xt = {};
  Qo(Xt, { engine: () => c0, env: () => d0, os: () => i0, screenReader: () => f0 });
  var i0 = {};
  Qo(i0, { android: () => ew, apple: () => l0, ios: () => s0, linux: () => BO, mac: () => tw, windows: () => OO });
  function RO() {
    return typeof navigator > "u" ? { userAgent: "", platform: "", maxTouchPoints: 0 } : { userAgent: navigator.userAgent, platform: navigator.platform ?? "", maxTouchPoints: navigator.maxTouchPoints ?? 0 };
  }
  var { userAgent: MO, platform: DO, maxTouchPoints: $v } = RO(), ps = MO.toLowerCase(), ms = DO.toLowerCase();
  var s0 = /^i(os$|p)/.test(ms) || ms === "macintel" && $v > 1, Jv = "android", ew = ms === Jv || ps.includes(Jv), tw = !s0 && ms.startsWith("mac"), OO = ms.startsWith("win"), BO = !ew && /^(linux|chrome os)/.test(ms), l0 = tw || s0;
  var c0 = {};
  Qo(c0, { blink: () => PO, gecko: () => _O, webkit: () => u0 });
  var u0 = typeof CSS < "u" && !!CSS.supports?.("-webkit-backdrop-filter:none"), _O = !u0 && ps.includes("firefox"), PO = !u0 && ps.includes("chrom");
  var f0 = {};
  Qo(f0, { voiceOver: () => NO });
  var NO = l0;
  var d0 = {};
  Qo(d0, { jsdom: () => UO });
  var UO = /jsdom|happydom/.test(ps);
  function p0(e) {
    e.preventDefault(), e.stopPropagation();
  }
  function aw(e) {
    return "nativeEvent" in e;
  }
  function ow(e) {
    return e.pointerType === "" && e.isTrusted ? true : Xt.os.android && e.pointerType ? e.type === "click" && e.buttons === 1 : e.detail === 0 && !e.pointerType;
  }
  function ep(e) {
    return Xt.env.jsdom ? false : !Xt.os.android && e.width === 0 && e.height === 0 || Xt.os.android && e.width === 1 && e.height === 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === "mouse" || e.width < 1 && e.height < 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === "touch";
  }
  function tp(e, t) {
    let a = ["mouse", "pen"];
    return t || a.push("", void 0), a.includes(e);
  }
  function rw(e) {
    let t = e.type;
    return t === "click" || t === "mousedown" || t === "keydown" || t === "keyup";
  }
  var hc = "data-base-ui-focusable";
  var nw = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
  function Ua(e) {
    let t = e.activeElement;
    for (; t?.shadowRoot?.activeElement != null; ) t = t.shadowRoot.activeElement;
    return t;
  }
  function Oe(e, t) {
    if (!e || !t) return false;
    let a = t.getRootNode?.();
    if (e.contains(t)) return true;
    if (a && zo(a)) {
      let o = t;
      for (; o; ) {
        if (e === o) return true;
        o = o.parentNode || o.host;
      }
    }
    return false;
  }
  function la(e) {
    return "composedPath" in e ? e.composedPath()[0] : e.target;
  }
  function ap(e, t) {
    if (t == null) return false;
    if ("composedPath" in e) return e.composedPath().includes(t);
    let a = e;
    return a.target != null && t.contains(a.target);
  }
  function sw(e) {
    return e.matches("html,body");
  }
  function gc(e) {
    return yt(e) && e.matches(nw);
  }
  function m0(e) {
    return e ? e.getAttribute("role") === "combobox" && gc(e) : false;
  }
  function h0(e) {
    return e ? e.hasAttribute(hc) ? e : e.querySelector(`[${hc}]`) || e : null;
  }
  var pa = _(F(), 1);
  function Xe(e, t, a, o) {
    return e.addEventListener(t, a, o), () => {
      e.removeEventListener(t, a, o);
    };
  }
  function Cr(...e) {
    return () => {
      for (let t = 0; t < e.length; t += 1) {
        let a = e[t];
        a && a();
      }
    };
  }
  function xc(e) {
    let t = fa(qO, e).current;
    return t.next = e, re(t.effect), t;
  }
  function qO(e) {
    let t = { current: e, next: e, effect: () => {
      t.current = t.next;
    } };
    return t;
  }
  var rp = null, AH = globalThis.requestAnimationFrame, g0 = class {
    callbacks = [];
    callbacksCount = 0;
    nextId = 1;
    startId = 1;
    isScheduled = false;
    tick = (t) => {
      this.isScheduled = false;
      let a = this.callbacks, o = this.callbacksCount;
      if (this.callbacks = [], this.callbacksCount = 0, this.startId = this.nextId, o > 0) for (let r = 0; r < a.length; r += 1) a[r]?.(t);
    };
    request(t) {
      let a = this.nextId;
      return this.nextId += 1, this.callbacks.push(t), this.callbacksCount += 1, !this.isScheduled && (requestAnimationFrame(this.tick), this.isScheduled = true), a;
    }
    cancel(t) {
      let a = t - this.startId;
      a < 0 || a >= this.callbacks.length || (this.callbacks[a] = null, this.callbacksCount -= 1);
    }
  }, np = new g0();
  var go = class e {
    static create() {
      return new e();
    }
    static request(t) {
      return np.request(t);
    }
    static cancel(t) {
      return np.cancel(t);
    }
    currentId = rp;
    request(t) {
      this.cancel(), this.currentId = np.request(() => {
        this.currentId = rp, t();
      });
    }
    cancel = () => {
      this.currentId !== rp && (np.cancel(this.currentId), this.currentId = rp);
    };
    disposeEffect = () => this.cancel;
  };
  function Yl() {
    let e = fa(go.create).current;
    return Jd(e.disposeEffect), e;
  }
  var sp = _(F(), 1);
  var cw = { clipPath: "inset(50%)", overflow: "hidden", whiteSpace: "nowrap", border: 0, padding: 0, width: 1, height: 1, margin: -1 }, fw = { ...cw, position: "fixed", top: 0, left: 0 }, kH = { ...cw, position: "absolute" };
  var dw = _(mt(), 1), Zl = sp.forwardRef(function(t, a) {
    let [o, r] = sp.useState();
    return re(() => {
      Xt.screenReader.voiceOver && Xt.engine.webkit && r("button");
    }, []), (0, dw.jsx)("span", { ...t, ref: a, style: fw, "aria-hidden": o ? void 0 : true, ...{ tabIndex: 0, role: o }, "data-base-ui-focus-guard": "" });
  });
  var x0 = Math.round;
  function bc(e, t) {
    return t < 0 || t >= e.length;
  }
  function b0(e, t) {
    return hs(e.current, { disabledIndices: t });
  }
  function y0(e, t) {
    return hs(e.current, { decrement: true, startingIndex: e.current.length, disabledIndices: t });
  }
  function hs(e, { startingIndex: t = -1, decrement: a = false, disabledIndices: o, amount: r = 1 } = {}) {
    let n = t;
    do
      n += a ? -r : r;
    while (n >= 0 && n <= e.length - 1 && yc(e, n, o));
    return n;
  }
  function yc(e, t, a) {
    if (typeof a == "function" ? a(t) : a?.includes(t) ?? false) return true;
    let r = e[t];
    return r ? !Sc(r) || r.matches(":disabled") ? true : !a && (r.hasAttribute("disabled") || r.getAttribute("aria-disabled") === "true") : false;
  }
  function FO(e) {
    return e.visibility === "hidden" || e.visibility === "collapse";
  }
  function Sc(e, t = e ? yr(e) : null) {
    return !e || !e.isConnected || !t || FO(t) ? false : typeof e.checkVisibility == "function" ? e.checkVisibility() : t.display !== "none" && t.display !== "contents";
  }
  var VO = 'a[href],button,input,select,textarea,summary,details,iframe,object,embed,[tabindex],[contenteditable]:not([contenteditable="false"]),audio[controls],video[controls]';
  function GO(e) {
    let t = e.assignedSlot;
    if (t) return t;
    if (e.parentElement) return e.parentElement;
    let a = e.getRootNode();
    return zo(a) ? a.host : null;
  }
  function L0(e) {
    for (let t of Array.from(e.children)) if (da(t) === "summary") return t;
    return null;
  }
  function jO(e, t) {
    let a = L0(t);
    return !!a && (e === a || Oe(a, e));
  }
  function pw(e) {
    let t = e ? da(e) : "";
    return e != null && e.matches(VO) && (t !== "summary" || e.parentElement != null && da(e.parentElement) === "details" && L0(e.parentElement) === e) && (t !== "details" || L0(e) == null) && (t !== "input" || e.type !== "hidden");
  }
  function mw(e) {
    if (!pw(e) || !e.isConnected || e.matches(":disabled")) return false;
    for (let t = e; t; t = GO(t)) {
      let a = t !== e, o = da(t) === "slot";
      if (t.hasAttribute("inert") || a && da(t) === "details" && !t.open && !jO(e, t) || t.hasAttribute("hidden") || !o && !XO(t, a)) return false;
    }
    return true;
  }
  function XO(e, t) {
    let a = yr(e);
    return t ? a.display !== "none" : Sc(e, a);
  }
  function hw(e) {
    let t = e.tabIndex;
    if (t < 0) {
      let a = da(e);
      if (a === "details" || a === "audio" || a === "video" || yt(e) && e.isContentEditable) return 0;
    }
    return t;
  }
  function S0(e) {
    if (da(e) !== "input") return null;
    let t = e;
    return t.type === "radio" && t.name !== "" ? t : null;
  }
  function KO(e, t) {
    let a = S0(e);
    if (!a) return true;
    let o = t.find((r) => {
      let n = S0(r);
      return n?.name === a.name && n.form === a.form && n.checked;
    });
    return o ? o === a : t.find((r) => {
      let n = S0(r);
      return n?.name === a.name && n.form === a.form;
    }) === a;
  }
  function gw(e) {
    if (yt(e) && da(e) === "slot") {
      let t = e.assignedElements({ flatten: true });
      if (t.length > 0) return t;
    }
    return yt(e) && e.shadowRoot ? Array.from(e.shadowRoot.children) : Array.from(e.children);
  }
  function xw(e, t) {
    gw(e).forEach((a) => {
      pw(a) && t.push(a), xw(a, t);
    });
  }
  function bw(e, t, a) {
    gw(e).forEach((o) => {
      yt(o) && o.matches(t) && a.push(o), bw(o, t, a);
    });
  }
  function lp(e) {
    return mw(e) && hw(e) >= 0;
  }
  function C0(e) {
    let t = [];
    return xw(e, t), t.filter(mw);
  }
  function Lc(e) {
    let t = C0(e);
    return t.filter((a) => hw(a) >= 0 && KO(a, t));
  }
  function yw(e, t) {
    let a = Lc(e), o = a.length;
    if (o === 0) return;
    let r = Ua(ot(e)), n = a.indexOf(r), s = n === -1 ? t === 1 ? 0 : o - 1 : n + t;
    return a[s];
  }
  function ip(e) {
    return yw(ot(e).body, 1) || e;
  }
  function up(e) {
    return yw(ot(e).body, -1) || e;
  }
  function gs(e, t) {
    let a = t || e.currentTarget, o = e.relatedTarget;
    return !o || !Oe(a, o);
  }
  function Sw(e) {
    Lc(e).forEach((a) => {
      a.dataset.tabindex = a.getAttribute("tabindex") || "", a.setAttribute("tabindex", "-1");
    });
  }
  function v0(e) {
    let t = [];
    bw(e, "[data-tabindex]", t), t.forEach((a) => {
      let o = a.dataset.tabindex;
      delete a.dataset.tabindex, o ? a.setAttribute("tabindex", o) : a.removeAttribute("tabindex");
    });
  }
  function xs(e, t, a = true) {
    return e.filter((r) => r.parentId === t).flatMap((r) => [...!a || r.context?.open ? [r] : [], ...xs(e, r.id, a)]);
  }
  function w0(e, t) {
    let a = [], o = e.find((r) => r.id === t)?.parentId;
    for (; o; ) {
      let r = e.find((n) => n.id === o);
      o = r?.parentId, r && (a = a.concat(r));
    }
    return a;
  }
  function bs(e) {
    return `data-base-ui-${e}`;
  }
  var cp = 0;
  function fp(e, t = {}) {
    let { preventScroll: a = false, sync: o = false, shouldFocus: r } = t;
    cancelAnimationFrame(cp);
    function n() {
      r && !r() || e?.focus({ preventScroll: a });
    }
    if (o) return n(), br;
    let s = requestAnimationFrame(n);
    return cp = s, () => {
      cp === s && (cancelAnimationFrame(s), cp = 0);
    };
  }
  var I0 = { inert: /* @__PURE__ */ new WeakMap(), "aria-hidden": /* @__PURE__ */ new WeakMap() }, Lw = "data-base-ui-inert", A0 = { inert: /* @__PURE__ */ new WeakSet(), "aria-hidden": /* @__PURE__ */ new WeakSet() }, Cc = /* @__PURE__ */ new WeakMap(), E0 = 0;
  function YO(e) {
    return A0[e];
  }
  function Iw(e) {
    return e ? zo(e) ? e.host : Iw(e.parentNode) : null;
  }
  var Cw = (e, t) => t.map((a) => {
    if (e.contains(a)) return a;
    let o = Iw(a);
    return e.contains(o) ? o : null;
  }).filter((a) => a != null), vw = (e) => {
    let t = /* @__PURE__ */ new Set();
    return e.forEach((a) => {
      let o = a;
      for (; o && !t.has(o); ) t.add(o), o = o.parentNode;
    }), t;
  }, ww = (e, t, a) => {
    let o = [], r = (n) => {
      !n || a.has(n) || Array.from(n.children).forEach((s) => {
        da(s) !== "script" && (t.has(s) ? r(s) : o.push(s));
      });
    };
    return r(e), o;
  };
  function ZO(e, t, a, o, { mark: r = true }) {
    let n = null;
    o ? n = "inert" : a && (n = "aria-hidden");
    let s = null, l = null, i = Cw(t, e), u = r ? ww(t, vw(i), new Set(i)) : [], c = [], d = [];
    if (n) {
      let f = I0[n], p = YO(n);
      l = p, s = f;
      let x = Cw(t, Array.from(t.querySelectorAll("[aria-live]"))), S = i.concat(x);
      ww(t, vw(S), new Set(S)).forEach((g) => {
        let m = g.getAttribute(n), b = m !== null && m !== "false", y = (f.get(g) || 0) + 1;
        f.set(g, y), c.push(g), y === 1 && b && p.add(g), b || g.setAttribute(n, n === "inert" ? "" : "true");
      });
    }
    return r && u.forEach((f) => {
      let p = (Cc.get(f) || 0) + 1;
      Cc.set(f, p), d.push(f), p === 1 && f.setAttribute(Lw, "");
    }), E0 += 1, () => {
      s && c.forEach((f) => {
        let x = (s.get(f) || 0) - 1;
        s.set(f, x), x || (!l?.has(f) && n && f.removeAttribute(n), l?.delete(f));
      }), r && d.forEach((f) => {
        let p = (Cc.get(f) || 0) - 1;
        Cc.set(f, p), p || f.removeAttribute(Lw);
      }), E0 -= 1, E0 || (I0.inert = /* @__PURE__ */ new WeakMap(), I0["aria-hidden"] = /* @__PURE__ */ new WeakMap(), A0.inert = /* @__PURE__ */ new WeakSet(), A0["aria-hidden"] = /* @__PURE__ */ new WeakSet(), Cc = /* @__PURE__ */ new WeakMap());
    };
  }
  function T0(e, t = {}) {
    let { ariaHidden: a = false, inert: o = false, mark: r = true } = t, n = ot(e[0]).body;
    return ZO(e, n, a, o, { mark: r });
  }
  var ht = _(F(), 1), k0 = _(Ni(), 1);
  var dp = "data-base-ui-click-trigger", WO = "data-base-ui-swipe-ignore", QO = "data-swipe-ignore", WH = `[${WO}]`, QH = `[${QO}]`;
  var Ew = { clipPath: "inset(50%)", position: "fixed", top: 0, left: 0 };
  var ys = _(mt(), 1), Aw = ht.createContext(null), R0 = () => ht.useContext(Aw), $O = bs("portal");
  function Tw(e = {}) {
    let { ref: t, container: a, componentProps: o = Et, elementProps: r } = e, n = Kl(), l = R0()?.portalNode, [i, u] = ht.useState(null), [c, d] = ht.useState(null), f = le((v) => {
      v !== null && d(v);
    }), p = ht.useRef(null);
    re(() => {
      if (a === null) {
        p.current && (p.current = null, d(null), u(null));
        return;
      }
      let v = (a && (Yd(a) ? a : a.current)) ?? l ?? document.body;
      if (v == null) {
        p.current && (p.current = null, d(null), u(null));
        return;
      }
      p.current !== v && (p.current = v, d(null), u(v));
    }, [a, l]);
    let x = $e("div", o, { ref: [t, f], props: [{ id: n, [$O]: "" }, r] }), S = i && x ? k0.createPortal(x, i) : null;
    return { node: c, nodeId: ht.isValidElement(x) ? x.props.id : void 0, subtree: S };
  }
  var M0 = ht.forwardRef(function(t, a) {
    let { render: o, className: r, style: n, children: s, container: l, ...i } = t, { node: u, nodeId: c, subtree: d } = Tw({ container: l, ref: a, componentProps: t, elementProps: i }), f = ht.useRef(null), p = ht.useRef(null), x = ht.useRef(null), S = ht.useRef(null), [v, g] = ht.useState(null), m = ht.useRef(false), b = v?.modal, y = v?.open, C = !!v && !v.modal && v.open && !!u;
    ht.useEffect(() => {
      if (!u || b) return;
      function I(w) {
        u && w.relatedTarget && gs(w) && (w.type === "focusin" ? m.current && (v0(u), m.current = false) : (Sw(u), m.current = true));
      }
      return Cr(Xe(u, "focusin", I, true), Xe(u, "focusout", I, true));
    }, [u, b]), re(() => {
      !u || y !== true || !m.current || (v0(u), m.current = false);
    }, [y, u]);
    let D = ht.useMemo(() => ({ beforeOutsideRef: f, afterOutsideRef: p, beforeInsideRef: x, afterInsideRef: S, portalNode: u, setFocusManagerState: g }), [u]);
    return (0, ys.jsxs)(ht.Fragment, { children: [d, (0, ys.jsxs)(Aw.Provider, { value: D, children: [C && u && (0, ys.jsx)(Zl, { "data-type": "outside", ref: f, onFocus: (I) => {
      if (gs(I, u)) x.current?.focus();
      else {
        let w = v ? v.domReference : null;
        up(w)?.focus();
      }
    } }), C && u && (0, ys.jsx)("span", { "aria-owns": c, style: Ew }), u && k0.createPortal(s, u), C && u && (0, ys.jsx)(Zl, { "data-type": "outside", ref: p, onFocus: (I) => {
      if (gs(I, u)) S.current?.focus();
      else {
        let w = v ? v.domReference : null;
        ip(w)?.focus(), v?.closeOnFocusOut && v?.onOpenChange(false, pt(Ue.focusOut, I.nativeEvent));
      }
    } })] })] });
  });
  var Ss = _(F(), 1);
  function kw() {
    let e = /* @__PURE__ */ new Map();
    return { emit(t, a) {
      e.get(t)?.forEach((o) => o(a));
    }, on(t, a) {
      e.has(t) || e.set(t, /* @__PURE__ */ new Set()), e.get(t).add(a);
    }, off(t, a) {
      e.get(t)?.delete(a);
    } };
  }
  var JO = _(mt(), 1), eB = Ss.createContext(null), tB = Ss.createContext(null), Rw = () => Ss.useContext(eB)?.id || null, pp = (e) => {
    let t = Ss.useContext(tB);
    return e ?? t;
  };
  function Eo(e) {
    return e == null ? e : "current" in e ? e.current : e;
  }
  var vc = _(mt(), 1);
  function aB(e, t) {
    let a = Na(la(e));
    return e instanceof a.KeyboardEvent ? "keyboard" : e instanceof a.FocusEvent ? t || "keyboard" : "pointerType" in e ? e.pointerType || "keyboard" : "touches" in e ? "touch" : e instanceof a.MouseEvent ? t || (e.detail === 0 ? "keyboard" : "mouse") : "";
  }
  var Mw = 20, Sn = [];
  function D0() {
    Sn = Sn.filter((e) => e.deref()?.isConnected);
  }
  function Dw(e) {
    D0(), e && da(e) !== "body" && (Sn.push(new WeakRef(e)), Sn.length > Mw && (Sn = Sn.slice(-Mw)));
  }
  function Ow() {
    return D0(), Sn[Sn.length - 1]?.deref();
  }
  function oB(e) {
    return e ? lp(e) ? e : Lc(e)[0] || e : null;
  }
  function Bw(e) {
    if (e.hasAttribute("tabindex") && !e.hasAttribute("data-tabindex") || !e.getAttribute("role")?.includes("dialog")) return;
    let a = C0(e).filter((r) => {
      let n = r.getAttribute("data-tabindex") || "";
      return lp(r) || r.hasAttribute("data-tabindex") && !n.startsWith("-");
    }), o = e.getAttribute("tabindex");
    a.length === 0 ? o !== "0" && (e.setAttribute("tabindex", "0"), e.setAttribute("data-tabindex", "0")) : (o !== "-1" || e.hasAttribute("data-tabindex") && e.getAttribute("data-tabindex") !== "-1") && (e.setAttribute("tabindex", "-1"), e.setAttribute("data-tabindex", "-1"));
  }
  function O0(e) {
    let { context: t, children: a, disabled: o = false, initialFocus: r = true, returnFocus: n = true, restoreFocus: s = false, modal: l = true, closeOnFocusOut: i = true, openInteractionType: u = "", nextFocusableElement: c, previousFocusableElement: d, beforeContentFocusGuardRef: f, externalTree: p, getInsideElements: x } = e, S = "rootStore" in t ? t.rootStore : t, v = S.useState("open"), g = S.useState("domReferenceElement"), m = S.useState("floatingElement"), { events: b, dataRef: y } = S.context, C = le(() => y.current.floatingContext?.nodeId), D = r === false, I = m0(g) && D, w = xc(r), M = xc(n), T = xc(u), K = xc(v), z = pp(p), Y = R0(), ce = pa.useRef(false), Le = pa.useRef(false), J = pa.useRef(false), Ie = pa.useRef(null), Be = pa.useRef(""), he = pa.useRef(""), U = pa.useRef(null), gt = pa.useRef(null), ue = Ho(U, f, Y?.beforeInsideRef), Pe = Ho(gt, Y?.afterInsideRef), Ee = yn(), ne = yn(), $ = Yl(), et = Y != null, H = h0(m), ee = le((te = H) => te ? Lc(te) : []), Ne = le(() => x?.().filter((te) => te != null) ?? []);
    pa.useEffect(() => {
      if (o || !l) return;
      function te(He) {
        He.key === "Tab" && Oe(H, Ua(ot(H))) && ee().length === 0 && !I && p0(He);
      }
      let ke = ot(H);
      return Xe(ke, "keydown", te);
    }, [o, H, l, I, ee]), pa.useEffect(() => {
      if (o || !v) return;
      let te = ot(H);
      function ke() {
        J.current = false;
      }
      function He(Dt) {
        let ge = la(Dt), je = Ne(), pe = Oe(m, ge) || Oe(g, ge) || Oe(Y?.portalNode, ge) || je.some((rt) => rt === ge || Oe(rt, ge));
        J.current = !pe, he.current = Dt.pointerType || "keyboard", ge?.closest(`[${dp}]`) && (Le.current = true, ne.start(0, () => {
          Le.current = false;
        }));
      }
      function Tt() {
        he.current = "keyboard";
      }
      return Cr(Xe(te, "pointerdown", He, true), Xe(te, "pointerup", ke, true), Xe(te, "pointercancel", ke, true), Xe(te, "keydown", Tt, true), ke);
    }, [o, m, g, H, v, Y, ne, Ne]), pa.useEffect(() => {
      if (o || !i) return;
      let te = ot(H);
      function ke() {
        Le.current = true, ne.start(0, () => {
          Le.current = false;
        });
      }
      function He(je) {
        let pe = la(je);
        lp(pe) && (Ie.current = pe);
      }
      function Tt(je) {
        let pe = je.relatedTarget, rt = je.currentTarget, zt = la(je);
        l && pe == null && zt != null && Oe(m, zt) && Dw(zt), queueMicrotask(() => {
          let ze = C(), ea = S.context.triggerElements, j = Ne(), X = pe?.hasAttribute(bs("focus-guard")) && [U.current, gt.current, Y?.beforeInsideRef.current, Y?.afterInsideRef.current, Y?.beforeOutsideRef.current, Y?.afterOutsideRef.current, Eo(d), Eo(c)].includes(pe), Lt = !(Oe(g, pe) || Oe(m, pe) || Oe(pe, m) || Oe(Y?.portalNode, pe) || j.some((Me) => Me === pe || Oe(Me, pe)) || ea.hasMatchingElement((Me) => Oe(Me, pe)) || X || z && (xs(z.nodesRef.current, ze).find((Me) => Oe(Me.context?.elements.floating, pe) || Oe(Me.context?.elements.domReference, pe)) || w0(z.nodesRef.current, ze).find((Me) => [Me.context?.elements.floating, h0(Me.context?.elements.floating)].includes(pe) || Me.context?.elements.domReference === pe)));
          if (rt === g && H && Bw(H), s && rt !== g && !Sc(zt) && Ua(te) === te.body) {
            if (yt(H) && (H.focus(), s === "popup")) {
              $.request(() => {
                H.focus();
              });
              return;
            }
            let Me = ee(), be = Ie.current, qt = (be && Me.includes(be) ? be : null) || Me[Me.length - 1] || H;
            yt(qt) && qt.focus();
          }
          if (y.current.insideReactTree) {
            y.current.insideReactTree = false;
            return;
          }
          (I || !l) && pe && Lt && !Le.current && (I || pe !== Ow()) && (ce.current = true, S.setOpen(false, pt(Ue.focusOut, je)));
        });
      }
      function Dt() {
        J.current || (y.current.insideReactTree = true, Ee.start(0, () => {
          y.current.insideReactTree = false;
        }));
      }
      let ge = yt(g) ? g : null;
      if (!(!m && !ge)) return Cr(ge && Xe(ge, "focusout", Tt), ge && Xe(ge, "pointerdown", ke), m && Xe(m, "focusin", He), m && Xe(m, "focusout", Tt), m && Y && Xe(m, "focusout", Dt, true));
    }, [o, g, m, H, l, z, Y, S, i, s, ee, I, C, y, Ee, ne, $, c, d, Ne]), pa.useEffect(() => {
      if (o || !m || !v) return;
      let te = Array.from(Y?.portalNode?.querySelectorAll(`[${bs("portal")}]`) || []), He = (z ? w0(z.nodesRef.current, C()) : []).find((rt) => m0(rt.context?.elements.domReference || null))?.context?.elements.domReference, Dt = [...[m, ...te, U.current, gt.current, Y?.beforeOutsideRef.current, Y?.afterOutsideRef.current, ...Ne()], He, Eo(d), Eo(c), I ? g : null].filter((rt) => rt != null), ge = T0(Dt, { ariaHidden: l || I, mark: false }), je = [m, ...te].filter((rt) => rt != null), pe = T0(je);
      return () => {
        pe(), ge();
      };
    }, [v, o, g, m, l, Y, I, z, C, c, d, Ne]), re(() => {
      if (!v || o || !yt(H)) return;
      Be.current = "", he.current = "";
      let te = ot(H), ke = Ua(te);
      queueMicrotask(() => {
        let He = w.current, Tt = typeof He == "function" ? He(T.current || "") : He;
        if (Tt === void 0 || Tt === false || Oe(H, ke)) return;
        let ge = null, je = () => (ge == null && (ge = ee(H)), ge[0] || H), pe;
        Tt === true || Tt === null ? pe = je() : pe = Eo(Tt), pe = pe || je();
        let rt = Oe(H, Ua(te));
        fp(pe, { preventScroll: pe === H, shouldFocus() {
          if (!K.current) return false;
          if (rt) return true;
          let zt = Ua(te);
          return !(zt !== pe && Oe(H, zt));
        } });
      });
    }, [o, v, H, ee, w, T, K]), re(() => {
      if (o || !H) return;
      let te = ot(H), ke = Ua(te), He = T.current == null;
      Dw(ke);
      function Tt(ge) {
        if (ge.open || (Be.current = aB(ge.nativeEvent, he.current)), ge.reason === Ue.triggerHover && ge.nativeEvent.type === "mouseleave" && (ce.current = true), ge.reason === Ue.outsidePress) if (ge.nested) ce.current = false;
        else if (ow(ge.nativeEvent) || ep(ge.nativeEvent)) ce.current = false;
        else {
          let je = false;
          ot(H).createElement("div").focus({ get preventScroll() {
            return je = true, false;
          } }), je ? ce.current = false : ce.current = true;
        }
      }
      b.on("openchange", Tt);
      function Dt(ge) {
        let je = M.current, pe = typeof je == "function" ? je(ge) : je;
        if (pe === void 0 || pe === false) return null;
        pe === null && (pe = true);
        let rt = g?.isConnected ? g : null, zt = ke?.isConnected && da(ke) !== "body" ? ke : null, ze = He ? zt || rt : rt || zt;
        return ze || (ze = Ow() || null), typeof pe == "boolean" ? ze : Eo(pe) || ze || null;
      }
      return () => {
        b.off("openchange", Tt);
        let ge = Ua(te), je = Ne(), pe = Oe(m, ge) || je.some((ea) => ea === ge || Oe(ea, ge)) || z && xs(z.nodesRef.current, C(), false).some((ea) => Oe(ea.context?.elements.floating, ge)), rt = M.current, zt = Be.current, ze = Dt(zt);
        queueMicrotask(() => {
          let ea = oB(ze), j = typeof rt != "boolean";
          if (rt && !ce.current && yt(ea) && (!(!j && ea !== ge && ge !== te.body) || pe)) {
            let X = { preventScroll: true };
            zt === "keyboard" && (X.focusVisible = true), ea.focus(X);
          }
          ce.current = false;
        });
      };
    }, [o, m, H, M, T, b, z, g, C, Ne]), re(() => {
      if (!Xt.engine.webkit || v || !m) return;
      let te = Ua(ot(m));
      !yt(te) || !gc(te) || Oe(m, te) && te.blur();
    }, [v, m]), re(() => {
      if (!(o || !Y)) return Y.setFocusManagerState({ modal: l, closeOnFocusOut: i, open: v, onOpenChange: S.setOpen, domReference: g }), () => {
        Y.setFocusManagerState(null);
      };
    }, [o, Y, l, v, S, i, g]), re(() => {
      if (!(o || !H)) return Bw(H), () => {
        queueMicrotask(D0);
      };
    }, [o, H]);
    let lt = !o && (l ? !I : true) && (et || l);
    return (0, vc.jsxs)(pa.Fragment, { children: [lt && (0, vc.jsx)(Zl, { "data-type": "inside", ref: ue, onFocus: (te) => {
      if (l) {
        let ke = ee();
        fp(ke[ke.length - 1]);
      } else Y?.portalNode && (ce.current = false, gs(te, Y.portalNode) ? ip(g)?.focus() : Eo(d ?? Y.beforeOutsideRef)?.focus());
    } }), a, lt && (0, vc.jsx)(Zl, { "data-type": "inside", ref: Pe, onFocus: (te) => {
      l ? fp(ee()[0]) : Y?.portalNode && (i && (ce.current = true), gs(te, Y.portalNode) ? up(g)?.focus() : Eo(c ?? Y.afterOutsideRef)?.focus());
    } })] });
  }
  var wc = _(F(), 1);
  function B0(e, t = {}) {
    let { enabled: a = true, event: o = "click", toggle: r = true, ignoreMouse: n = false, stickIfOpen: s = true, touchOpenDelay: l = 0, reason: i = Ue.triggerPress } = t, u = "rootStore" in e ? e.rootStore : e, c = u.context.dataRef, d = wc.useRef(void 0), f = Yl(), p = yn(), x = wc.useMemo(() => {
      function S(g, m, b, y) {
        let C = pt(i, m, b);
        g && y === "touch" && l > 0 ? p.start(l, () => {
          u.setOpen(true, C);
        }) : u.setOpen(g, C);
      }
      function v(g, m, b) {
        let y = c.current.openEvent, C = u.select("domReferenceElement") !== m;
        return g && C || !g || !r ? true : y && s ? !b(y.type) : false;
      }
      return { onPointerDown(g) {
        d.current = tp(g.pointerType, true) && ep(g.nativeEvent) ? "virtual" : g.pointerType;
      }, onMouseDown(g) {
        let m = d.current, b = g.nativeEvent, y = u.select("open");
        if (g.button !== 0 || o === "click" || tp(m, true) && n) return;
        let C = v(y, g.currentTarget, (w) => w === "click" || w === "mousedown"), D = la(b);
        if (gc(D)) {
          S(C, b, D, m);
          return;
        }
        let I = g.currentTarget;
        f.request(() => {
          S(C, b, I, m);
        });
      }, onClick(g) {
        if (o === "mousedown-only") return;
        let m = d.current;
        if (o === "mousedown" && m) {
          d.current = void 0;
          return;
        }
        if (tp(m, true) && n) return;
        let b = u.select("open"), y = v(b, g.currentTarget, (C) => C === "click" || C === "mousedown" || C === "keydown" || C === "keyup");
        S(y, g.nativeEvent, g.currentTarget, m);
      }, onKeyDown() {
        d.current = void 0;
      } };
    }, [c, o, n, i, u, s, r, f, p, l]);
    return wc.useMemo(() => a ? { reference: x } : Et, [a, x]);
  }
  var eo = _(F(), 1);
  function rB() {
    return false;
  }
  function nB(e) {
    return { escapeKey: typeof e == "boolean" ? e : e?.escapeKey ?? false, outsidePress: typeof e == "boolean" ? e : e?.outsidePress ?? true };
  }
  function _0(e, t = {}) {
    let { enabled: a = true, escapeKey: o = true, outsidePress: r = true, outsidePressEvent: n = "sloppy", referencePress: s = rB, bubbles: l, externalTree: i } = t, u = "rootStore" in e ? e.rootStore : e, c = u.useState("open"), d = u.useState("floatingElement"), { dataRef: f } = u.context, p = pp(i), x = le(typeof r == "function" ? r : () => false), S = typeof r == "function" ? x : r, v = S !== false, g = le(() => n), { escapeKey: m, outsidePress: b } = nB(l), y = eo.useRef(false), C = eo.useRef(false), D = eo.useRef(false), I = eo.useRef(false), w = eo.useRef(""), M = eo.useRef(null), T = yn(), K = yn(), z = le(() => {
      K.clear(), f.current.insideReactTree = false;
    }), Y = le((ue) => {
      let Pe = f.current.floatingContext?.nodeId;
      return (p ? xs(p.nodesRef.current, Pe) : []).some((ne) => ne.context?.open && !ne.context.dataRef.current[ue]);
    }), ce = le((ue) => ap(ue, u.select("floatingElement")) || ap(ue, u.select("domReferenceElement"))), Le = le((ue) => {
      s() && u.setOpen(false, pt(Ue.triggerPress, ue.nativeEvent));
    }), J = le((ue) => {
      if (!c || !a || !o || ue.key !== "Escape" || I.current || !m && Y("__escapeKeyBubbles")) return;
      let Pe = aw(ue) ? ue.nativeEvent : ue, Ee = pt(Ue.escapeKey, Pe);
      u.setOpen(false, Ee), Ee.isCanceled || ue.preventDefault(), !m && !Ee.isPropagationAllowed && ue.stopPropagation();
    }), Ie = le(() => {
      f.current.insideReactTree = true, K.start(0, z);
    }), Be = le((ue) => {
      if (!c || !a || ue.button !== 0) return;
      let Pe = la(ue.nativeEvent);
      Oe(u.select("floatingElement"), Pe) && (y.current || (y.current = true, C.current = false));
    }), he = le((ue) => {
      !c || !a || (ue.defaultPrevented || ue.nativeEvent.defaultPrevented) && y.current && (C.current = true);
    });
    eo.useEffect(() => {
      if (!c || !a) return z;
      f.current.__escapeKeyBubbles = m, f.current.__outsidePressBubbles = b;
      let ue = new Lr(), Pe = new Lr();
      function Ee() {
        ue.clear(), I.current = true;
      }
      function ne() {
        ue.start(Xt.engine.webkit ? 5 : 0, () => {
          I.current = false;
        });
      }
      function $() {
        D.current = true, Pe.start(0, () => {
          D.current = false;
        });
      }
      function et() {
        y.current = false, C.current = false;
      }
      function H() {
        let j = w.current, X = j === "pen" || !j ? "mouse" : j, Lt = g(), Me = typeof Lt == "function" ? Lt() : Lt;
        return typeof Me == "string" ? Me : Me[X];
      }
      function ee(j) {
        let X = H();
        return X === "intentional" && j.type !== "click" || X === "sloppy" && j.type === "click";
      }
      function Ne(j) {
        let X = f.current.floatingContext?.nodeId, Lt = p && xs(p.nodesRef.current, X).some((Me) => ap(j, Me.context?.elements.floating));
        return ce(j) || Lt;
      }
      function lt(j) {
        if (ee(j)) {
          j.type !== "click" && !ce(j) && (Pe.clear(), D.current = false), z();
          return;
        }
        if (f.current.insideReactTree) {
          z();
          return;
        }
        let X = la(j), Lt = `[${bs("inert")}]`, Me = bn(X) ? X.getRootNode() : null, be = Array.from((zo(Me) ? Me : ot(u.select("floatingElement"))).querySelectorAll(Lt)), qt = u.context.triggerElements;
        if (X && (qt.hasElement(X) || qt.hasMatchingElement((Ct) => Oe(Ct, X)))) return;
        let Ro = bn(X) ? X : null;
        for (; Ro && !Zd(Ro); ) {
          let Ct = qv(Ro);
          if (Zd(Ct) || !bn(Ct)) break;
          Ro = Ct;
        }
        if (!(be.length && bn(X) && !sw(X) && !Oe(X, u.select("floatingElement")) && be.every((Ct) => !Oe(Ro, Ct)))) {
          if (yt(X) && !("touches" in j)) {
            let Ct = Zd(X), Ft = yr(X), Mo = /auto|scroll/, Or = Ct || Mo.test(Ft.overflowX), Vs = Ct || Mo.test(Ft.overflowY), Gs = Or && X.clientWidth > 0 && X.scrollWidth > X.clientWidth, Br = Vs && X.clientHeight > 0 && X.scrollHeight > X.clientHeight, ka = Ft.direction === "rtl", oo = Br && (ka ? j.offsetX <= X.offsetWidth - X.clientWidth : j.offsetX > X.clientWidth), Lo = Gs && j.offsetY > X.clientHeight;
            if (oo || Lo) return;
          }
          if (!Ne(j)) {
            if (H() === "intentional" && D.current) {
              Pe.clear(), D.current = false;
              return;
            }
            typeof S == "function" && !S(j) || Y("__outsidePressBubbles") || (u.setOpen(false, pt(Ue.outsidePress, j)), z());
          }
        }
      }
      function te(j) {
        H() !== "sloppy" || j.pointerType === "touch" || !u.select("open") || !a || ce(j) || lt(j);
      }
      function ke(j) {
        if (H() !== "sloppy" || !u.select("open") || !a || ce(j)) return;
        let X = j.touches[0];
        X && (M.current = { startTime: Date.now(), startX: X.clientX, startY: X.clientY, dismissOnTouchEnd: false, dismissOnMouseDown: true }, T.start(1e3, () => {
          M.current && (M.current.dismissOnTouchEnd = false, M.current.dismissOnMouseDown = false);
        }));
      }
      function He(j, X) {
        let Lt = la(j);
        if (!Lt) return;
        let Me = Xe(Lt, j.type, () => {
          X(j), Me();
        });
      }
      function Tt(j) {
        w.current = "touch", He(j, ke);
      }
      function Dt(j) {
        T.clear(), j.type === "pointerdown" && (w.current = j.pointerType), !(j.type === "mousedown" && M.current && !M.current.dismissOnMouseDown) && He(j, (X) => {
          X.type === "pointerdown" ? te(X) : lt(X);
        });
      }
      function ge(j) {
        if (!y.current) return;
        let X = C.current;
        if (et(), H() === "intentional") {
          if (j.type === "pointercancel") {
            X && $();
            return;
          }
          if (!Ne(j)) {
            if (X) {
              $();
              return;
            }
            typeof S == "function" && !S(j) || (Pe.clear(), D.current = true, z());
          }
        }
      }
      function je(j) {
        if (H() !== "sloppy" || !M.current || ce(j)) return;
        let X = j.touches[0];
        if (!X) return;
        let Lt = Math.abs(X.clientX - M.current.startX), Me = Math.abs(X.clientY - M.current.startY), be = Math.sqrt(Lt * Lt + Me * Me);
        be > 5 && (M.current.dismissOnTouchEnd = true), be > 10 && (lt(j), T.clear(), M.current = null);
      }
      function pe(j) {
        He(j, je);
      }
      function rt(j) {
        H() !== "sloppy" || !M.current || ce(j) || (M.current.dismissOnTouchEnd && lt(j), T.clear(), M.current = null);
      }
      function zt(j) {
        He(j, rt);
      }
      let ze = ot(d), ea = Cr(o && Cr(Xe(ze, "keydown", J), Xe(ze, "compositionstart", Ee), Xe(ze, "compositionend", ne)), v && Cr(Xe(ze, "click", Dt, true), Xe(ze, "pointerdown", Dt, true), Xe(ze, "pointerup", ge, true), Xe(ze, "pointercancel", ge, true), Xe(ze, "mousedown", Dt, true), Xe(ze, "mouseup", ge, true), Xe(ze, "touchstart", Tt, true), Xe(ze, "touchmove", pe, true), Xe(ze, "touchend", zt, true)));
      return () => {
        ea(), ue.clear(), Pe.clear(), et(), D.current = false, z();
      };
    }, [f, d, o, v, S, c, a, m, b, J, z, g, Y, ce, p, u, T]);
    let U = eo.useMemo(() => ({ onKeyDown: J, onPointerDown: Le, onClick: Le }), [J, Le]), gt = eo.useMemo(() => ({ onKeyDown: J, onPointerDown: he, onMouseDown: he, onClickCapture: Ie, onMouseDownCapture(ue) {
      Ie(), Be(ue);
    }, onPointerDownCapture(ue) {
      Ie(), Be(ue);
    }, onMouseUpCapture: Ie, onTouchEndCapture: Ie, onTouchMoveCapture: Ie }), [J, Ie, Be, he]);
    return eo.useMemo(() => a ? { reference: U, floating: gt, trigger: U } : {}, [a, U, gt]);
  }
  var mp = class {
    attachedStores = [];
    attachedStoreValue = null;
    storeListeners = /* @__PURE__ */ new Set();
    constructor(t, a, o = true) {
      this.fallbackStore = t, this.componentName = a, this.throwOnMissingTrigger = o;
    }
    get attachedStore() {
      return this.attachedStoreValue;
    }
    get store() {
      return this.attachedStoreValue ?? this.fallbackStore;
    }
    get serverStore() {
      return this.fallbackStore;
    }
    subscribeStore(t) {
      return this.storeListeners.add(t), () => {
        this.storeListeners.delete(t);
      };
    }
    attachStore(t) {
      return this.attachedStores.push(t), this.setActiveStore(t), () => {
        let a = this.attachedStores.lastIndexOf(t);
        a !== -1 && this.attachedStores.splice(a, 1), this.setActiveStore(this.attachedStores[this.attachedStores.length - 1] ?? null);
      };
    }
    setActiveStore(t) {
      this.attachedStoreValue !== t && (this.attachedStoreValue = t, this.storeListeners.forEach((a) => {
        a();
      }));
    }
    openByTrigger(t) {
      let a = this.attachedStore;
      if (a === null) return;
      let o;
      if (t) {
        for (let r = this.attachedStores.length - 1; r >= 0 && !o; r -= 1) o = this.attachedStores[r].context.triggerElements.getById(t);
        o ??= this.fallbackStore.context.triggerElements.getById(t);
      }
      if (t && !o && this.throwOnMissingTrigger) throw new Error(ca(99, this.componentName, t, this.componentName));
      a.setOpen(true, pt(Ue.imperativeAction, void 0, o));
    }
    closePopup() {
      let t = this.attachedStore;
      t !== null && t.setOpen(false, pt(Ue.imperativeAction));
    }
  };
  var Cs = _(F(), 1), DB = _(Ni(), 1);
  var Kw = _(F(), 1);
  var Gw = _(F(), 1), N0 = _(Ic(), 1), jw = _(qw(), 1);
  var vB = _(F(), 1);
  var wB = [], IB;
  function Fw() {
    return IB;
  }
  function Vw(e) {
    wB.push(e);
  }
  var EB = Vl(19), AB = EB ? kB : RB;
  function gp(e, t, a, o, r) {
    return AB(e, t, a, o, r);
  }
  function TB(e, t, a, o, r) {
    let n = Gw.useCallback(() => t(e.getSnapshot(), a, o, r), [e, t, a, o, r]);
    return (0, N0.useSyncExternalStore)(e.subscribe, n, n);
  }
  Vw({ before(e) {
    e.syncIndex = 0, e.didInitialize || (e.syncTick = 1, e.syncHooks = [], e.didChangeStore = true, e.getSnapshot = () => {
      let t = false;
      for (let a = 0; a < e.syncHooks.length; a += 1) {
        let o = e.syncHooks[a], r = o.selector(o.store.state, o.a1, o.a2, o.a3);
        Object.is(o.value, r) || (t = true, o.value = r);
      }
      return t && (e.syncTick += 1), e.syncTick;
    });
  }, after(e) {
    e.syncHooks.length > 0 && (e.didChangeStore && (e.didChangeStore = false, e.subscribe = (t) => {
      let a = /* @__PURE__ */ new Set();
      for (let r of e.syncHooks) a.add(r.store);
      let o = [];
      for (let r of a) o.push(r.subscribe(t));
      return () => {
        for (let r of o) r();
      };
    }), (0, N0.useSyncExternalStore)(e.subscribe, e.getSnapshot, e.getSnapshot));
  } });
  function kB(e, t, a, o, r) {
    let n = Fw();
    if (!n) return TB(e, t, a, o, r);
    let s = n.syncIndex;
    n.syncIndex += 1;
    let l;
    return n.didInitialize ? (l = n.syncHooks[s], (l.store !== e || l.selector !== t || !Object.is(l.a1, a) || !Object.is(l.a2, o) || !Object.is(l.a3, r)) && (l.store !== e && (n.didChangeStore = true), l.store = e, l.selector = t, l.a1 = a, l.a2 = o, l.a3 = r, l.value = t(e.getSnapshot(), a, o, r))) : (l = { store: e, selector: t, a1: a, a2: o, a3: r, value: t(e.getSnapshot(), a, o, r) }, n.syncHooks.push(l)), l.value;
  }
  function RB(e, t, a, o, r) {
    return (0, jw.useSyncExternalStoreWithSelector)(e.subscribe, e.getSnapshot, e.getSnapshot, (n) => t(n, a, o, r));
  }
  var xp = class {
    constructor(t) {
      this.state = t, this.listeners = /* @__PURE__ */ new Set(), this.updateTick = 0;
    }
    subscribe = (t) => (this.listeners.add(t), () => {
      this.listeners.delete(t);
    });
    getSnapshot = () => this.state;
    setState(t) {
      if (this.state === t) return;
      this.state = t, this.updateTick += 1;
      let a = this.updateTick;
      for (let o of this.listeners) {
        if (a !== this.updateTick) return;
        o(t);
      }
    }
    update(t) {
      for (let a in t) if (!Object.is(this.state[a], t[a])) {
        this.setState({ ...this.state, ...t });
        return;
      }
    }
    set(t, a) {
      Object.is(this.state[t], a) || this.setState({ ...this.state, [t]: a });
    }
    notifyAll() {
      let t = { ...this.state };
      this.setState(t);
    }
    use(t, a, o, r) {
      return gp(this, t, a, o, r);
    }
  };
  var Ls = _(F(), 1);
  var Ln = class extends xp {
    constructor(t, a = {}, o) {
      super(t), this.context = a, this.selectors = o;
    }
    useSyncedValue(t, a) {
      Ls.useDebugValue(t);
      let o = this;
      re(() => {
        o.state[t] !== a && o.set(t, a);
      }, [o, t, a]);
    }
    useSyncedValueWithCleanup(t, a) {
      let o = this;
      re(() => (o.state[t] !== a && o.set(t, a), () => {
        o.set(t, void 0);
      }), [o, t, a]);
    }
    useSyncedValues(t) {
      let a = this, o = Object.values(t);
      re(() => {
        a.update(t);
      }, [a, ...o]);
    }
    useControlledProp(t, a) {
      Ls.useDebugValue(t);
      let o = this, r = a !== void 0;
      re(() => {
        r && !Object.is(o.state[t], a) && o.setState({ ...o.state, [t]: a });
      }, [o, t, a, r]);
    }
    select(t, a, o, r) {
      let n = this.selectors[t];
      return n(this.state, a, o, r);
    }
    useState(t, a, o, r) {
      return Ls.useDebugValue(t), gp(this, this.selectors[t], a, o, r);
    }
    useContextCallback(t, a) {
      Ls.useDebugValue(t);
      let o = le(a ?? br);
      this.context[t] = o;
    }
    useStateSetter(t) {
      let a = Ls.useRef(void 0);
      return a.current === void 0 && (a.current = (o) => {
        this.set(t, o);
      }), a.current;
    }
    observe(t, a) {
      let o;
      typeof t == "function" ? o = t : o = this.selectors[t];
      let r = o(this.state);
      return a(r, r, this), this.subscribe((n) => {
        let s = o(n);
        if (!Object.is(r, s)) {
          let l = r;
          r = s, a(s, l, this);
        }
      });
    }
  };
  var bp = _(F(), 1);
  function Xw() {
    let [, e] = bp.useState({});
    return bp.useCallback(() => {
      e({});
    }, []);
  }
  var MB = { open: (e) => e.open, transitionStatus: (e) => e.transitionStatus, domReferenceElement: (e) => e.domReferenceElement, referenceElement: (e) => e.positionReference ?? e.referenceElement, floatingElement: (e) => e.floatingElement, floatingId: (e) => e.floatingId }, Cn = class extends Ln {
    constructor(t) {
      let { syncOnly: a, nested: o, onOpenChange: r, triggerElements: n, ...s } = t;
      super({ ...s, positionReference: s.referenceElement, domReferenceElement: s.referenceElement }, { onOpenChange: r, dataRef: { current: {} }, events: kw(), nested: o, triggerElements: n }, MB), this.syncOnly = a;
    }
    syncOpenEvent = (t, a) => {
      (!t || !this.state.open || a != null && rw(a)) && (this.context.dataRef.current.openEvent = t ? a : void 0);
    };
    dispatchOpenChange = (t, a) => {
      this.syncOpenEvent(t, a.event);
      let o = { open: t, reason: a.reason, nativeEvent: a.event, nested: this.context.nested, triggerElement: a.trigger };
      this.context.events.emit("openchange", o);
    };
    setOpen = (t, a) => {
      if (this.syncOnly) {
        this.context.onOpenChange?.(t, a);
        return;
      }
      this.dispatchOpenChange(t, a), this.context.onOpenChange?.(t, a);
    };
  };
  function Yw(e) {
    let { popupStore: t, treatPopupAsFloatingElement: a = false, floatingRootContext: o, floatingId: r, nested: n, onOpenChange: s } = e, l = t.useState("open"), i = t.useState("activeTriggerElement"), u = t.useState(a ? "popupElement" : "positionerElement"), c = t.context.triggerElements, d = s, f = Kw.useRef(null);
    o === void 0 && f.current === null && (f.current = new Cn({ open: l, transitionStatus: void 0, referenceElement: i, floatingElement: u, triggerElements: c, onOpenChange: d, floatingId: r, syncOnly: true, nested: n }));
    let p = o ?? f.current;
    return t.useSyncedValue("floatingId", r), re(() => {
      let x = { open: l, floatingId: r, referenceElement: i, floatingElement: u };
      bn(i) && (x.domReferenceElement = i), p.state.positionReference === p.state.referenceElement && (x.positionReference = i), p.update(x);
    }, [l, r, i, u, p]), p.context.onOpenChange = d, p.context.nested = n, p;
  }
  var U0 = _(F(), 1);
  function yp(e, t = false, a = false) {
    let [o, r] = U0.useState(e && t ? "idle" : void 0), [n, s] = U0.useState(e);
    return e && !n && (s(true), r("starting")), !e && n && o !== "ending" && !a && r("ending"), !e && !n && o === "ending" && r(void 0), re(() => {
      if (!e && n && o !== "ending" && a) {
        let l = go.request(() => {
          r("ending");
        });
        return () => {
          go.cancel(l);
        };
      }
    }, [e, n, o, a]), re(() => {
      if (!e || t) return;
      let l = go.request(() => {
        r(void 0);
      });
      return () => {
        go.cancel(l);
      };
    }, [t, e]), re(() => {
      if (!e || !t) return;
      e && n && o !== "idle" && r("starting");
      let l = go.request(() => {
        r("idle");
      });
      return () => {
        go.cancel(l);
      };
    }, [t, e, n, o]), { mounted: n, setMounted: s, transitionStatus: o };
  }
  var Qw = _(F(), 1);
  var Zw = _(Ni(), 1);
  function Ww(e, t = false) {
    let a = Yl();
    return le((o, r = null) => {
      a.cancel();
      let n = Eo(e);
      if (n == null) return;
      let s = n, l = () => {
        Zw.flushSync(o);
      };
      if (typeof s.getAnimations != "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
        o();
        return;
      }
      function i() {
        Promise.all(s.getAnimations().map((u) => u.finished)).then(() => {
          r?.aborted || l();
        }, () => {
          if (r?.aborted) return;
          if (s.getAnimations().some((c) => c.pending || c.playState !== "finished")) {
            i();
            return;
          }
          l();
        });
      }
      if (t) {
        let u = "data-starting-style";
        if (!s.hasAttribute(u)) {
          a.request(i);
          return;
        }
        let c = new MutationObserver(() => {
          s.hasAttribute(u) || (c.disconnect(), i());
        });
        c.observe(s, { attributes: true, attributeFilter: [u] }), r?.addEventListener("abort", () => c.disconnect(), { once: true });
        return;
      }
      a.request(i);
    });
  }
  function Ql(e) {
    let { enabled: t = true, open: a, ref: o, onComplete: r } = e, n = le(r), s = Ww(o, a);
    Qw.useEffect(() => {
      if (!t) return;
      let l = new AbortController();
      return s(n, l.signal), () => {
        l.abort();
      };
    }, [t, a, n, s]);
  }
  var $w = { tabIndex: -1, [hc]: "" };
  function Jw(e) {
    return (t) => t === "touch" ? e.current : true;
  }
  function eI(e, t = false) {
    let a = Kl(), o = Rw() != null, r = fa(() => e(a, o)).current;
    return Yw({ popupStore: r, treatPopupAsFloatingElement: t, floatingRootContext: r.state.floatingRootContext, floatingId: a, nested: o, onOpenChange: r.setOpen }), r;
  }
  function tI({ handle: e, store: t }) {
    return re(() => e.attachStore(t), [e, t]), null;
  }
  function OB(e, t) {
    let a = Cs.useRef(null), o = Cs.useRef(null);
    return Cs.useCallback((r) => {
      if (e === void 0) return;
      let n = false;
      if (a.current !== null) {
        let s = a.current, l = o.current, i = t.context.triggerElements.getById(s);
        l && i === l && (t.context.triggerElements.delete(s), n = true), a.current = null, o.current = null;
      }
      if (r !== null && (a.current = e, o.current = r, t.context.triggerElements.add(e, r), n = true), n) {
        let s = t.context.triggerElements.size;
        t.select("open") && t.state.triggerCount !== s && t.set("triggerCount", s);
      }
    }, [t, e]);
  }
  function aI(e, t, a, o = false) {
    t ? e.preventUnmountingOnClose = false : o && (e.preventUnmountingOnClose = true);
    let r = a?.id ?? null;
    (r || t) && (e.activeTriggerId = r, e.activeTriggerElement = a ?? null);
  }
  function oI(e, t, a, o) {
    let r = a.useState("isMountedByTrigger", e), n = OB(e, a), s = le((i) => {
      let u = a.select("open"), c = a.select("activeTriggerId");
      if (c === e) {
        a.update({ activeTriggerElement: i, ...u ? o : null });
        return;
      }
      c == null && u && a.update({ activeTriggerId: e, activeTriggerElement: i, ...o });
    }), l = Cs.useCallback((i) => {
      n(i), i && s(i);
    }, [n, s]);
    return re(() => {
      r && a.update({ activeTriggerElement: t.current, ...o });
    }, [r, a, t, ...Object.values(o)]), { registerTrigger: l, isMountedByThisTrigger: r };
  }
  function rI(e, t = {}) {
    let { closeOnActiveTriggerUnmount: a = false } = t, o = Cs.useRef(null), r = e.useState("open"), n = e.useState("triggerCount"), s = e.useState("activeTriggerId"), l = e.useState("activeTriggerElement");
    re(() => {
      if (!r) {
        o.current = null, e.state.triggerCount !== 0 && e.set("triggerCount", 0);
        return;
      }
      let i = e.context.triggerElements.size, u = {};
      e.state.triggerCount !== i && (u.triggerCount = i);
      let c = e.select("activeTriggerId"), d = null;
      if (c) {
        let f = e.context.triggerElements.getById(c);
        if (f) o.current = c, f !== e.state.activeTriggerElement && (u.activeTriggerElement = f);
        else {
          for (let [p, x] of e.context.triggerElements.entries()) if (x === e.state.activeTriggerElement) {
            u.activeTriggerId = p, u.activeTriggerElement = x, o.current = p;
            break;
          }
          u.activeTriggerId === void 0 && (o.current === c ? d = c : o.current = null);
        }
      } else o.current = null;
      if (!d && !c && i === 1) {
        let f = e.context.triggerElements.entries().next();
        if (!f.done) {
          let [p, x] = f.value;
          u.activeTriggerId = p, u.activeTriggerElement = x, o.current = p;
        }
      }
      (u.triggerCount !== void 0 || u.activeTriggerId !== void 0 || u.activeTriggerElement !== void 0) && e.update(u), d && a && queueMicrotask(() => {
        if (e.select("open") && e.select("activeTriggerId") === d && !e.context.triggerElements.getById(d)) {
          let f = pt(Ue.none);
          e.setOpen(false, f), f.isCanceled || e.update({ activeTriggerId: null, activeTriggerElement: null });
        }
      });
    }, [r, e, n, s, l, a]);
  }
  function nI(e, t, a) {
    let { mounted: o, setMounted: r, transitionStatus: n } = yp(e), s = t.useState("preventUnmountingOnClose"), l = e ? false : s;
    t.useSyncedValues({ mounted: o, transitionStatus: n, preventUnmountingOnClose: l });
    let i = le(() => {
      r(false), t.update({ activeTriggerId: null, activeTriggerElement: null, mounted: false, preventUnmountingOnClose: false }), a?.(), t.context.onOpenChangeComplete?.(false);
    });
    return Ql({ enabled: o && !e && !l, open: e, ref: t.context.popupRef, onComplete() {
      e || i();
    } }), { forceUnmount: i, transitionStatus: n };
  }
  function sI(e, t) {
    e.useSyncedValues(t), re(() => () => {
      e.update({ activeTriggerProps: Et, inactiveTriggerProps: Et, popupProps: Et });
    }, [e]);
  }
  function lI(e, t) {
    re(() => {
      !t && e.state.openMethod !== null && e.set("openMethod", null);
    }, [t, e]), re(() => () => {
      e.state.openMethod !== null && e.set("openMethod", null);
    }, [e]);
  }
  var vs = class {
    constructor() {
      this.idMap = /* @__PURE__ */ new Map();
    }
    add(t, a) {
      this.idMap.set(t, a);
    }
    delete(t) {
      this.idMap.delete(t);
    }
    hasElement(t) {
      for (let a of this.idMap.values()) if (a === t) return true;
      return false;
    }
    hasMatchingElement(t) {
      for (let a of this.idMap.values()) if (t(a)) return true;
      return false;
    }
    getById(t) {
      return this.idMap.get(t);
    }
    entries() {
      return this.idMap.entries();
    }
    elements() {
      return this.idMap.values();
    }
    get size() {
      return this.idMap.size;
    }
  };
  function iI() {
    return new Cn({ open: false, transitionStatus: void 0, floatingElement: null, referenceElement: null, triggerElements: new vs(), floatingId: void 0, syncOnly: false, nested: false, onOpenChange: void 0 });
  }
  function cI() {
    return { open: false, openProp: void 0, mounted: false, transitionStatus: void 0, floatingRootContext: iI(), floatingId: void 0, triggerCount: 0, preventUnmountingOnClose: false, payload: void 0, activeTriggerId: null, activeTriggerElement: null, triggerIdProp: void 0, popupElement: null, positionerElement: null, activeTriggerProps: Et, inactiveTriggerProps: Et, popupProps: Et };
  }
  function fI(e, t, a = false) {
    return new Cn({ open: false, transitionStatus: void 0, floatingElement: null, referenceElement: null, triggerElements: e, floatingId: t, syncOnly: true, nested: a, onOpenChange: void 0 });
  }
  var Ec = (e) => e.triggerIdProp ?? e.activeTriggerId, H0 = (e) => e.openProp ?? e.open, uI = (e) => (e.popupElement?.id ?? e.floatingId) || void 0;
  function dI(e, t) {
    return t !== void 0 && H0(e) && Ec(e) === t;
  }
  function BB(e, t) {
    return dI(e, t) ? true : t !== void 0 && H0(e) && Ec(e) == null && e.triggerCount === 1;
  }
  var pI = { open: H0, mounted: (e) => e.mounted, transitionStatus: (e) => e.transitionStatus, floatingRootContext: (e) => e.floatingRootContext, triggerCount: (e) => e.triggerCount, preventUnmountingOnClose: (e) => e.preventUnmountingOnClose, payload: (e) => e.payload, activeTriggerId: Ec, activeTriggerElement: (e) => e.mounted ? e.activeTriggerElement : null, popupId: uI, isTriggerActive: (e, t) => t !== void 0 && Ec(e) === t, isOpenedByTrigger: (e, t) => dI(e, t), isMountedByTrigger: (e, t) => t !== void 0 && Ec(e) === t && e.mounted, triggerProps: (e, t) => t ? e.activeTriggerProps : e.inactiveTriggerProps, triggerPopupId: (e, t) => BB(e, t) ? uI(e) : void 0, popupProps: (e) => e.popupProps, popupElement: (e) => e.popupElement, positionerElement: (e) => e.positionerElement };
  var z0 = _(F(), 1), mI = _(Ic(), 1);
  function hI(e) {
    let t = z0.useCallback((o) => e === void 0 ? br : e.subscribeStore(o), [e]), a = z0.useCallback(() => e === void 0 ? void 0 : e.store, [e]);
    return (0, mI.useSyncExternalStore)(t, a, () => e?.serverStore);
  }
  var Sp = _(F(), 1), q0 = Sp.createContext(void 0);
  function Lp() {
    let e = Sp.useContext(q0);
    if (e === void 0) throw new Error(ca(26));
    return e;
  }
  var vp = "ArrowUp", wp = "ArrowDown", Ip = "ArrowLeft", Ep = "ArrowRight", Ap = "Home", Tp = "End";
  var kp = /* @__PURE__ */ new Set([vp, wp, Ip, Ep, Ap, Tp]), _B = "Shift", xI = [_B, "Control", "Alt", "Meta"];
  function PB(e) {
    return yt(e) && e.tagName === "INPUT";
  }
  function F0(e) {
    return !!(PB(e) && e.selectionStart != null || yt(e) && e.tagName === "TEXTAREA");
  }
  function V0(e, t, a, o) {
    if (!e || !t || !t.scrollTo) return;
    let r = e.scrollLeft, n = e.scrollTop, s = e.clientWidth < e.scrollWidth, l = e.clientHeight < e.scrollHeight;
    if (s && o !== "vertical") {
      let i = gI(e, t, "left"), u = Cp(e), c = Cp(t);
      a === "ltr" && (i + t.offsetWidth + c.scrollMarginRight > e.scrollLeft + e.clientWidth - u.scrollPaddingRight ? r = i + t.offsetWidth + c.scrollMarginRight - e.clientWidth + u.scrollPaddingRight : i - c.scrollMarginLeft < e.scrollLeft + u.scrollPaddingLeft && (r = i - c.scrollMarginLeft - u.scrollPaddingLeft)), a === "rtl" && (i - c.scrollMarginLeft < e.scrollLeft + u.scrollPaddingLeft ? r = i - c.scrollMarginLeft - u.scrollPaddingLeft : i + t.offsetWidth + c.scrollMarginRight > e.scrollLeft + e.clientWidth - u.scrollPaddingRight && (r = i + t.offsetWidth + c.scrollMarginRight - e.clientWidth + u.scrollPaddingRight));
    }
    if (l && o !== "horizontal") {
      let i = gI(e, t, "top"), u = Cp(e), c = Cp(t);
      i - c.scrollMarginTop < e.scrollTop + u.scrollPaddingTop ? n = i - c.scrollMarginTop - u.scrollPaddingTop : i + t.offsetHeight + c.scrollMarginBottom > e.scrollTop + e.clientHeight - u.scrollPaddingBottom && (n = i + t.offsetHeight + c.scrollMarginBottom - e.clientHeight + u.scrollPaddingBottom);
    }
    e.scrollTo({ left: r, top: n, behavior: "auto" });
  }
  function gI(e, t, a) {
    let o = a === "left" ? "offsetLeft" : "offsetTop", r = 0;
    for (; t.offsetParent && (r += t[o], t.offsetParent !== e); ) t = t.offsetParent;
    return r;
  }
  function Cp(e) {
    let t = getComputedStyle(e);
    return { scrollMarginTop: parseFloat(t.scrollMarginTop) || 0, scrollMarginRight: parseFloat(t.scrollMarginRight) || 0, scrollMarginBottom: parseFloat(t.scrollMarginBottom) || 0, scrollMarginLeft: parseFloat(t.scrollMarginLeft) || 0, scrollPaddingTop: parseFloat(t.scrollPaddingTop) || 0, scrollPaddingRight: parseFloat(t.scrollPaddingRight) || 0, scrollPaddingBottom: parseFloat(t.scrollPaddingBottom) || 0, scrollPaddingLeft: parseFloat(t.scrollPaddingLeft) || 0 };
  }
  var Rp = { ...a0, ...Gl, nestedDialogOpen(e) {
    return e ? { "data-nested-dialog-open": "" } : null;
  } };
  var yI = _(mt(), 1), SI = bI.forwardRef(function(t, a) {
    let { render: o, className: r, style: n, finalFocus: s, initialFocus: l, ...i } = t, u = Jt(), c = u.useState("descriptionElementId"), d = u.useState("disablePointerDismissal"), f = u.useState("floatingRootContext"), p = u.useState("popupProps"), x = u.useState("modal"), S = u.useState("mounted"), v = u.useState("nested"), g = u.useState("nestedOpenDialogCount"), m = u.useState("open"), b = u.useState("openMethod"), y = u.useState("titleElementId"), C = u.useState("transitionStatus"), D = u.useState("role"), I = f.useState("floatingId");
    Lp(), Ql({ open: m, ref: u.context.popupRef, onComplete() {
      m && u.context.onOpenChangeComplete?.(true);
    } });
    let w = l === void 0 ? Jw(u.context.popupRef) : l, M = g > 0, T = u.useStateSetter("popupElement"), z = $e("div", t, { state: { open: m, nested: v, transitionStatus: C, nestedDialogOpen: M }, props: [p, { id: I, "aria-labelledby": y, "aria-describedby": c, role: D, ...$w, hidden: !S, onKeyDown(Y) {
      kp.has(Y.key) && Y.stopPropagation();
    }, style: { "--nested-dialogs": g } }, i], ref: [a, u.context.popupRef, T], stateAttributesMapping: Rp });
    return (0, yI.jsx)(O0, { context: f, openInteractionType: b, disabled: !S, closeOnFocusOut: !d, initialFocus: w, returnFocus: s, modal: x !== false, restoreFocus: "popup", children: z });
  });
  var wI = _(F(), 1);
  function Mp(e) {
    return Vl(19) ? e : e ? "true" : void 0;
  }
  var LI = _(F(), 1), CI = _(mt(), 1), vI = LI.forwardRef(function(t, a) {
    let { cutout: o, ...r } = t, n;
    if (o) {
      let s = o.getBoundingClientRect();
      n = `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${s.left}px ${s.top}px,${s.left}px ${s.bottom}px,${s.right}px ${s.bottom}px,${s.right}px ${s.top}px,${s.left}px ${s.top}px)`;
    }
    return (0, CI.jsx)("div", { ref: a, role: "presentation", "data-base-ui-inert": "", ...r, style: { position: "fixed", inset: 0, userSelect: "none", WebkitUserSelect: "none", clipPath: n } });
  });
  var Ac = _(mt(), 1), II = wI.forwardRef(function(t, a) {
    let { keepMounted: o = false, ...r } = t, n = Jt(), s = n.useState("mounted"), l = n.useState("modal"), i = n.useState("open");
    return s || o ? (0, Ac.jsx)(q0.Provider, { value: o, children: (0, Ac.jsxs)(M0, { ref: a, ...r, children: [s && l === true && (0, Ac.jsx)(vI, { ref: n.context.internalBackdropRef, inert: Mp(!i) }), t.children] }) }) : null;
  });
  var PI = _(F(), 1);
  var j0 = _(F(), 1);
  var EI = {}, AI = {}, TI = "";
  function Dp(e, t) {
    return zv(e) ? e : t;
  }
  function kI(e, t, a) {
    return /hidden|clip/.test(e.getComputedStyle(Dp(t, a)).overflowY);
  }
  function NB(e) {
    if (typeof document > "u") return false;
    let t = ot(e);
    return Na(t).innerWidth - t.documentElement.clientWidth > 0;
  }
  function UB(e) {
    if (!(typeof CSS < "u" && CSS.supports && CSS.supports("scrollbar-gutter", "stable")) || typeof document > "u") return false;
    let a = ot(e), o = a.documentElement, r = a.body, n = Dp(o, r), s = n.style.overflowY, l = o.style.scrollbarGutter;
    o.style.scrollbarGutter = "stable", n.style.overflowY = "scroll";
    let i = n.offsetWidth;
    n.style.overflowY = "hidden";
    let u = n.offsetWidth;
    return n.style.overflowY = s, o.style.scrollbarGutter = l, i === u;
  }
  function HB(e) {
    let t = ot(e), a = t.documentElement, o = t.body, r = Dp(a, o), n = { overflowY: r.style.overflowY, overflowX: r.style.overflowX };
    return Object.assign(r.style, { overflowY: "hidden", overflowX: "hidden" }), () => {
      Object.assign(r.style, n);
    };
  }
  function zB(e) {
    let t = ot(e), a = t.documentElement, o = t.body, r = Na(a), n = 0, s = 0, l = false, i = go.create();
    if (Xt.engine.webkit && (r.visualViewport?.scale ?? 1) !== 1) return () => {
    };
    function u() {
      let p = r.getComputedStyle(a), x = r.getComputedStyle(o), g = (p.scrollbarGutter || "").includes("both-edges") ? "stable both-edges" : "stable";
      n = a.scrollTop, s = a.scrollLeft, EI = { scrollbarGutter: a.style.scrollbarGutter, overflowY: a.style.overflowY, overflowX: a.style.overflowX }, TI = a.style.scrollBehavior, AI = { position: o.style.position, height: o.style.height, width: o.style.width, boxSizing: o.style.boxSizing, overflowY: o.style.overflowY, overflowX: o.style.overflowX, scrollBehavior: o.style.scrollBehavior };
      let m = a.scrollHeight > a.clientHeight, b = a.scrollWidth > a.clientWidth, y = p.overflowY === "scroll" || x.overflowY === "scroll", C = p.overflowX === "scroll" || x.overflowX === "scroll", D = Math.max(0, r.innerWidth - o.clientWidth), I = Math.max(0, r.innerHeight - o.clientHeight), w = parseFloat(x.marginTop) + parseFloat(x.marginBottom), M = parseFloat(x.marginLeft) + parseFloat(x.marginRight), T = Dp(a, o);
      if (l = UB(e), l) {
        a.style.scrollbarGutter = g, T.style.overflowY = "hidden", T.style.overflowX = "hidden";
        return;
      }
      Object.assign(a.style, { scrollbarGutter: g, overflowY: "hidden", overflowX: "hidden" }), (m || y) && (a.style.overflowY = "scroll"), (b || C) && (a.style.overflowX = "scroll"), Object.assign(o.style, { position: "relative", height: w || I ? `calc(100dvh - ${w + I}px)` : "100dvh", width: M || D ? `calc(100vw - ${M + D}px)` : "100vw", boxSizing: "border-box", overflowY: "hidden", overflowX: "hidden", scrollBehavior: "unset" }), o.scrollTop = n, o.scrollLeft = s, a.setAttribute("data-base-ui-scroll-locked", ""), a.style.scrollBehavior = "unset";
    }
    function c() {
      Object.assign(a.style, EI), Object.assign(o.style, AI), l || (a.scrollTop = n, a.scrollLeft = s, a.removeAttribute("data-base-ui-scroll-locked"), a.style.scrollBehavior = TI);
    }
    function d() {
      c(), i.request(u);
    }
    u();
    let f = Xe(r, "resize", d);
    return () => {
      i.cancel(), c(), typeof r.removeEventListener == "function" && f();
    };
  }
  var G0 = class {
    lockCount = 0;
    restore = null;
    timeoutLock = Lr.create();
    timeoutUnlock = Lr.create();
    acquire(t) {
      return this.lockCount += 1, this.lockCount === 1 && this.restore === null && this.timeoutLock.start(0, () => this.lock(t)), this.release;
    }
    release = () => {
      this.lockCount -= 1, this.lockCount === 0 && this.restore && this.timeoutUnlock.start(0, this.unlock);
    };
    unlock = () => {
      this.lockCount === 0 && this.restore && (this.restore?.(), this.restore = null);
    };
    lock(t) {
      if (this.lockCount === 0 || this.restore !== null) return;
      let a = ot(t), o = a.documentElement, r = a.body, n = Na(o);
      if (kI(n, o, r)) {
        let l = new n.MutationObserver(() => {
          kI(n, o, r) || (l.disconnect(), this.restore = null, this.lock(t));
        }), i = { attributes: true };
        l.observe(o, i), l.observe(r, i), this.restore = () => l.disconnect();
        return;
      }
      let s = Xt.os.ios || !NB(t);
      this.restore = s ? HB(t) : zB(t);
    }
  }, qB = new G0();
  function RI(e = true, t = null) {
    re(() => {
      if (e) return qB.acquire(t);
    }, [e, t]);
  }
  function MI({ store: e, parentContext: t, isDrawer: a }) {
    let o = e.useState("open"), r = e.useState("disablePointerDismissal"), n = e.useState("modal"), s = e.useState("popupElement"), l = e.useState("floatingRootContext"), [i, u] = j0.useState(0), [c, d] = j0.useState(0), f = i === 0, p = _0(l, { outsidePressEvent() {
      return e.context.internalBackdropRef.current || e.context.backdropRef.current ? "intentional" : { mouse: n === "trap-focus" ? "sloppy" : "intentional", touch: "sloppy" };
    }, outsidePress(x) {
      if (!e.context.outsidePressEnabledRef.current || "button" in x && x.button !== 0) return false;
      if ("touches" in x) {
        if (x.type === "touchend") {
          if (x.changedTouches.length !== 1 || x.touches.length !== 0) return false;
        } else if (x.touches.length !== 1) return false;
      }
      let S = la(x);
      if (f && !r) {
        if (n) {
          let v = e.context.internalBackdropRef.current, g = e.context.backdropRef.current;
          return v || g ? v === S || g === S || Oe(S, s) && !S?.hasAttribute("data-base-ui-portal") : true;
        }
        return true;
      }
      return false;
    }, escapeKey: f });
    return RI(o && n === true, s), e.useContextCallback("onNestedDialogOpen", (x, S) => {
      u(x), d(S);
    }), re(() => (t?.onNestedDialogOpen && (o ? t.onNestedDialogOpen(i + 1, c + (a ? 1 : 0)) : t.onNestedDialogOpen(0, 0)), () => {
      t?.onNestedDialogOpen && o && t.onNestedDialogOpen(0, 0);
    }), [a, o, i, c, t]), sI(e, { activeTriggerProps: p.reference, inactiveTriggerProps: p.trigger, popupProps: p.floating, nestedOpenDialogCount: i, nestedOpenDrawerCount: c }), null;
  }
  var Bp = _(F(), 1);
  var Op = class extends Ln {
    setState(t) {
    }
    update(t) {
    }
    set(t, a) {
    }
    notifyAll() {
    }
  };
  var DI = { ...pI, modal: (e) => e.modal, nested: (e) => e.nested, nestedOpenDialogCount: (e) => e.nestedOpenDialogCount, nestedOpenDrawerCount: (e) => e.nestedOpenDrawerCount, disablePointerDismissal: (e) => e.disablePointerDismissal, openMethod: (e) => e.openMethod, descriptionElementId: (e) => e.descriptionElementId, titleElementId: (e) => e.titleElementId, viewportElement: (e) => e.viewportElement, role: (e) => e.role }, _p = class extends Ln {
    constructor(t, a, o) {
      let r = new vs(), n = BI(t, r, a, o);
      super(n, _I(r), DI);
    }
    setOpen = (t, a) => {
      if (a.preventUnmountOnClose = () => {
        this.set("preventUnmountingOnClose", true);
      }, !t && a.trigger == null && this.state.activeTriggerId != null && (a.trigger = this.state.activeTriggerElement ?? void 0), this.context.onOpenChange?.(t, a), a.isCanceled) return;
      this.state.floatingRootContext.dispatchOpenChange(t, a);
      let o = { open: t };
      aI(o, t, a.trigger), this.update(o);
    };
  };
  function OI() {
    let e = new vs();
    return new Op(Object.freeze(BI(void 0, e)), Object.freeze(_I(e)), DI);
  }
  function BI(e, t, a, o = false) {
    let r = { ...cI(), modal: true, disablePointerDismissal: false, viewportElement: null, descriptionElementId: void 0, titleElementId: void 0, openMethod: null, nested: false, nestedOpenDialogCount: 0, nestedOpenDrawerCount: 0, role: "dialog", ...e };
    return r.floatingRootContext = fI(t, a, o), r;
  }
  function _I(e) {
    return { popupRef: Bp.createRef(), backdropRef: Bp.createRef(), internalBackdropRef: Bp.createRef(), outsidePressEnabledRef: { current: true }, triggerElements: e, onOpenChange: void 0, onOpenChangeComplete: void 0 };
  }
  var Tc = _(mt(), 1);
  function NI(e, t) {
    let { children: a, open: o, defaultOpen: r = false, onOpenChange: n, onOpenChangeComplete: s, disablePointerDismissal: l = false, modal: i = true, actionsRef: u, handle: c, triggerId: d, defaultTriggerId: f = null } = t, p = e === "drawer", x = e === "alert-dialog", S = x ? true : i, v = x || l, g = x ? "alertdialog" : "dialog", m = Jt(true), b = m != null, y = { modal: S, disablePointerDismissal: v, nested: b, role: g }, C = eI((K, z) => new _p({ open: r, openProp: o, activeTriggerId: f, triggerIdProp: d, ...y }, K, z), true);
    C.useControlledProp("openProp", o), C.useControlledProp("triggerIdProp", d), C.useSyncedValues(y), C.useContextCallback("onOpenChange", n), C.useContextCallback("onOpenChangeComplete", s);
    let D = C.useState("open"), I = C.useState("mounted"), w = C.useState("payload");
    lI(C, D), rI(C);
    let { forceUnmount: M } = nI(D, C);
    PI.useImperativeHandle(u, () => ({ unmount: M, close: () => C.setOpen(false, pt(Ue.imperativeAction)) }), [M, C]);
    let T = D || I;
    return (0, Tc.jsxs)(Zx.Provider, { value: C, children: [c && (0, Tc.jsx)(tI, { handle: c, store: C }), T && (0, Tc.jsx)(MI, { store: C, parentContext: m?.context, isDrawer: p }), typeof a == "function" ? a({ payload: w }) : a] });
  }
  function UI(e) {
    return NI("dialog", e);
  }
  var HI = _(F(), 1);
  var zI = HI.forwardRef(function(t, a) {
    let { render: o, className: r, style: n, children: s, ...l } = t, i = Lp(), u = Jt(), c = u.useState("open"), d = u.useState("nested"), f = u.useState("transitionStatus"), p = u.useState("nestedOpenDialogCount"), x = u.useState("mounted"), S = u.useStateSetter("viewportElement"), v = p > 0;
    return $e("div", t, { enabled: i || x, state: { open: c, nested: d, transitionStatus: f, nestedDialogOpen: v }, ref: [a, S], stateAttributesMapping: Rp, props: [{ role: "presentation", hidden: !x, style: { pointerEvents: c ? void 0 : "none" }, children: s }, l] });
  });
  var qI = _(F(), 1);
  var FI = qI.forwardRef(function(t, a) {
    let { render: o, className: r, style: n, id: s, ...l } = t, i = Jt(), u = qo(s);
    return i.useSyncedValueWithCleanup("titleElementId", u), $e("h2", t, { ref: a, props: [{ id: u }, l] });
  });
  var Pp = _(F(), 1);
  var X0 = _(F(), 1);
  var kc = _(F(), 1);
  function VI(e) {
    let t = kc.useRef(""), a = kc.useCallback((r) => {
      r.defaultPrevented || (t.current = r.pointerType, e(r, r.pointerType));
    }, [e]);
    return { onClick: kc.useCallback((r) => {
      if (r.detail === 0) {
        e(r, "keyboard");
        return;
      }
      "pointerType" in r ? e(r, r.pointerType) : e(r, t.current), t.current = "";
    }, [e]), onPointerDown: a };
  }
  function GI(e, t) {
    let a = le((n, s) => {
      (typeof e == "function" ? e() : e) || t(s || (Xt.os.ios ? "touch" : ""));
    }), { onClick: o, onPointerDown: r } = VI(a);
    return X0.useMemo(() => ({ onClick: o, onPointerDown: r }), [o, r]);
  }
  var jI = Pp.forwardRef(function(t, a) {
    let { render: o, className: r, style: n, disabled: s = false, nativeButton: l = true, id: i, payload: u, handle: c, ...d } = t, f = Jt(true), x = hI(c) ?? f;
    if (!x) throw new Error(ca(79));
    let S = qo(i), v = x.useState("floatingRootContext"), g = x.useState("isOpenedByTrigger", S), m = x.useState("triggerPopupId", S), b = Pp.useRef(null), { registerTrigger: y, isMountedByThisTrigger: C } = oI(S, b, x, { payload: u }), { getButtonProps: D, buttonRef: I } = Sr({ disabled: s, native: l }), w = B0(v), M = GI(() => x.select("open"), (z) => {
      x.set("openMethod", z);
    }), T = { disabled: s, open: g }, K = x.useState("triggerProps", C);
    return $e("button", t, { state: T, ref: [I, a, y, b], props: [w.reference, K, M, { [dp]: "", id: S, "aria-haspopup": "dialog", "aria-expanded": g, "aria-controls": m }, d, D], stateAttributesMapping: Pv });
  });
  var Rc = class extends mp {
    constructor() {
      super(OI(), "Dialog", false);
    }
    open(t) {
      this.openByTrigger(t);
    }
    openWithPayload(t) {
      let a = this.attachedStore;
      a !== null && (a.set("payload", t), a.setOpen(true, pt(Ue.imperativeAction)));
    }
    close() {
      this.closePopup();
    }
    get isOpen() {
      return this.attachedStore?.select("open") ?? false;
    }
  };
  function XI() {
    return new Rc();
  }
  function KI(e) {
    var t, a, o = "";
    if (typeof e == "string" || typeof e == "number") o += e;
    else if (typeof e == "object") if (Array.isArray(e)) {
      var r = e.length;
      for (t = 0; t < r; t++) e[t] && (a = KI(e[t])) && (o && (o += " "), o += a);
    } else for (a in e) e[a] && (o && (o += " "), o += a);
    return o;
  }
  function Np() {
    for (var e, t, a = 0, o = "", r = arguments.length; a < r; a++) (e = arguments[a]) && (t = KI(e)) && (o && (o += " "), o += t);
    return o;
  }
  var FB = (e, t) => {
    let a = new Array(e.length + t.length);
    for (let o = 0; o < e.length; o++) a[o] = e[o];
    for (let o = 0; o < t.length; o++) a[e.length + o] = t[o];
    return a;
  }, VB = (e, t) => ({ classGroupId: e, validator: t }), JI = (e = /* @__PURE__ */ new Map(), t = null, a) => ({ nextPart: e, validators: t, classGroupId: a });
  var YI = [], GB = "arbitrary..", jB = (e) => {
    let t = KB(e), { conflictingClassGroups: a, conflictingClassGroupModifiers: o } = e;
    return { getClassGroupId: (s) => {
      if (s.startsWith("[") && s.endsWith("]")) return XB(s);
      let l = s.split("-"), i = l[0] === "" && l.length > 1 ? 1 : 0;
      return e2(l, i, t);
    }, getConflictingClassGroupIds: (s, l) => {
      if (l) {
        let i = o[s], u = a[s];
        return i ? u ? FB(u, i) : i : u || YI;
      }
      return a[s] || YI;
    } };
  }, e2 = (e, t, a) => {
    if (e.length - t === 0) return a.classGroupId;
    let r = e[t], n = a.nextPart.get(r);
    if (n) {
      let u = e2(e, t + 1, n);
      if (u) return u;
    }
    let s = a.validators;
    if (s === null) return;
    let l = t === 0 ? e.join("-") : e.slice(t).join("-"), i = s.length;
    for (let u = 0; u < i; u++) {
      let c = s[u];
      if (c.validator(l)) return c.classGroupId;
    }
  }, XB = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
    let t = e.slice(1, -1), a = t.indexOf(":"), o = t.slice(0, a);
    return o ? GB + o : void 0;
  })(), KB = (e) => {
    let { theme: t, classGroups: a } = e;
    return YB(a, t);
  }, YB = (e, t) => {
    let a = JI();
    for (let o in e) {
      let r = e[o];
      Y0(r, a, o, t);
    }
    return a;
  }, Y0 = (e, t, a, o) => {
    let r = e.length;
    for (let n = 0; n < r; n++) {
      let s = e[n];
      ZB(s, t, a, o);
    }
  }, ZB = (e, t, a, o) => {
    if (typeof e == "string") {
      WB(e, t, a);
      return;
    }
    if (typeof e == "function") {
      QB(e, t, a, o);
      return;
    }
    $B(e, t, a, o);
  }, WB = (e, t, a) => {
    let o = e === "" ? t : t2(t, e);
    o.classGroupId = a;
  }, QB = (e, t, a, o) => {
    if (JB(e)) {
      Y0(e(o), t, a, o);
      return;
    }
    t.validators === null && (t.validators = []), t.validators.push(VB(a, e));
  }, $B = (e, t, a, o) => {
    let r = Object.entries(e), n = r.length;
    for (let s = 0; s < n; s++) {
      let [l, i] = r[s];
      Y0(i, t2(t, l), a, o);
    }
  }, t2 = (e, t) => {
    let a = e, o = t.split("-"), r = o.length;
    for (let n = 0; n < r; n++) {
      let s = o[n], l = a.nextPart.get(s);
      l || (l = JI(), a.nextPart.set(s, l)), a = l;
    }
    return a;
  }, JB = (e) => "isThemeGetter" in e && e.isThemeGetter === true, e_ = (e) => {
    if (e < 1) return { get: () => {
    }, set: () => {
    } };
    let t = 0, a = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ Object.create(null), r = (n, s) => {
      a[n] = s, t++, t > e && (t = 0, o = a, a = /* @__PURE__ */ Object.create(null));
    };
    return { get(n) {
      let s = a[n];
      if (s !== void 0) return s;
      if ((s = o[n]) !== void 0) return r(n, s), s;
    }, set(n, s) {
      n in a ? a[n] = s : r(n, s);
    } };
  };
  var t_ = [], ZI = (e, t, a, o, r) => ({ modifiers: e, hasImportantModifier: t, baseClassName: a, maybePostfixModifierPosition: o, isExternal: r }), a_ = (e) => {
    let { prefix: t, experimentalParseClassName: a } = e, o = (r) => {
      let n = [], s = 0, l = 0, i = 0, u, c = r.length;
      for (let S = 0; S < c; S++) {
        let v = r[S];
        if (s === 0 && l === 0) {
          if (v === ":") {
            n.push(r.slice(i, S)), i = S + 1;
            continue;
          }
          if (v === "/") {
            u = S;
            continue;
          }
        }
        v === "[" ? s++ : v === "]" ? s-- : v === "(" ? l++ : v === ")" && l--;
      }
      let d = n.length === 0 ? r : r.slice(i), f = d, p = false;
      d.endsWith("!") ? (f = d.slice(0, -1), p = true) : d.startsWith("!") && (f = d.slice(1), p = true);
      let x = u && u > i ? u - i : void 0;
      return ZI(n, p, f, x);
    };
    if (t) {
      let r = t + ":", n = o;
      o = (s) => s.startsWith(r) ? n(s.slice(r.length)) : ZI(t_, false, s, void 0, true);
    }
    if (a) {
      let r = o;
      o = (n) => a({ className: n, parseClassName: r });
    }
    return o;
  }, o_ = (e) => {
    let t = /* @__PURE__ */ new Map();
    return e.orderSensitiveModifiers.forEach((a, o) => {
      t.set(a, 1e6 + o);
    }), (a) => {
      let o = [], r = [];
      for (let n = 0; n < a.length; n++) {
        let s = a[n], l = s[0] === "[", i = t.has(s);
        l || i ? (r.length > 0 && (r.sort(), o.push(...r), r = []), o.push(s)) : r.push(s);
      }
      return r.length > 0 && (r.sort(), o.push(...r)), o;
    };
  }, r_ = (e) => ({ cache: e_(e.cacheSize), parseClassName: a_(e), sortModifiers: o_(e), postfixLookupClassGroupIds: n_(e), ...jB(e) }), n_ = (e) => {
    let t = /* @__PURE__ */ Object.create(null), a = e.postfixLookupClassGroups;
    if (a) for (let o = 0; o < a.length; o++) t[a[o]] = true;
    return t;
  }, s_ = /\s+/, l_ = (e, t) => {
    let { parseClassName: a, getClassGroupId: o, getConflictingClassGroupIds: r, sortModifiers: n, postfixLookupClassGroupIds: s } = t, l = [], i = e.trim().split(s_), u = "";
    for (let c = i.length - 1; c >= 0; c -= 1) {
      let d = i[c], { isExternal: f, modifiers: p, hasImportantModifier: x, baseClassName: S, maybePostfixModifierPosition: v } = a(d);
      if (f) {
        u = d + (u.length > 0 ? " " + u : u);
        continue;
      }
      let g = !!v, m;
      if (g) {
        let I = S.substring(0, v);
        m = o(I);
        let w = m && s[m] ? o(S) : void 0;
        w && w !== m && (m = w, g = false);
      } else m = o(S);
      if (!m) {
        if (!g) {
          u = d + (u.length > 0 ? " " + u : u);
          continue;
        }
        if (m = o(S), !m) {
          u = d + (u.length > 0 ? " " + u : u);
          continue;
        }
        g = false;
      }
      let b = p.length === 0 ? "" : p.length === 1 ? p[0] : n(p).join(":"), y = x ? b + "!" : b, C = y + m;
      if (l.indexOf(C) > -1) continue;
      l.push(C);
      let D = r(m, g);
      for (let I = 0; I < D.length; ++I) {
        let w = D[I];
        l.push(y + w);
      }
      u = d + (u.length > 0 ? " " + u : u);
    }
    return u;
  }, i_ = (...e) => {
    let t = 0, a, o, r = "";
    for (; t < e.length; ) (a = e[t++]) && (o = a2(a)) && (r && (r += " "), r += o);
    return r;
  }, a2 = (e) => {
    if (typeof e == "string") return e;
    let t, a = "";
    for (let o = 0; o < e.length; o++) e[o] && (t = a2(e[o])) && (a && (a += " "), a += t);
    return a;
  }, u_ = (e, ...t) => {
    let a, o, r, n, s = (i) => {
      let u = t.reduce((c, d) => d(c), e());
      return a = r_(u), o = a.cache.get, r = a.cache.set, n = l, l(i);
    }, l = (i) => {
      let u = o(i);
      if (u) return u;
      let c = l_(i, a);
      return r(i, c), c;
    };
    return n = s, (...i) => n(i_(...i));
  }, c_ = [], Kt = (e) => {
    let t = (a) => a[e] || c_;
    return t.isThemeGetter = true, t;
  }, o2 = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, r2 = /^\((?:(\w[\w-]*):)?(.+)\)$/i, f_ = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, d_ = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, p_ = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, m_ = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, h_ = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, g_ = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, vn = (e) => f_.test(e), ve = (e) => !!e && !Number.isNaN(Number(e)), Vo = (e) => !!e && Number.isInteger(Number(e)), K0 = (e) => e.endsWith("%") && ve(e.slice(0, -1)), vr = (e) => d_.test(e), n2 = () => true, x_ = (e) => p_.test(e) && !m_.test(e), Z0 = () => false, b_ = (e) => h_.test(e), y_ = (e) => g_.test(e), S_ = (e) => !V(e) && !G(e), L_ = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), C_ = (e) => wn(e, i2, Z0), V = (e) => o2.test(e), ws = (e) => wn(e, u2, x_), WI = (e) => wn(e, R_, ve), v_ = (e) => wn(e, f2, n2), w_ = (e) => wn(e, c2, Z0), QI = (e) => wn(e, s2, Z0), I_ = (e) => wn(e, l2, y_), Up = (e) => wn(e, d2, b_), G = (e) => r2.test(e), Mc = (e) => Is(e, u2), E_ = (e) => Is(e, c2), $I = (e) => Is(e, s2), A_ = (e) => Is(e, i2), T_ = (e) => Is(e, l2), Hp = (e) => Is(e, d2, true), k_ = (e) => Is(e, f2, true), wn = (e, t, a) => {
    let o = o2.exec(e);
    return o ? o[1] ? t(o[1]) : a(o[2]) : false;
  }, Is = (e, t, a = false) => {
    let o = r2.exec(e);
    return o ? o[1] ? t(o[1]) : a : false;
  }, s2 = (e) => e === "position" || e === "percentage", l2 = (e) => e === "image" || e === "url", i2 = (e) => e === "length" || e === "size" || e === "bg-size", u2 = (e) => e === "length", R_ = (e) => e === "number", c2 = (e) => e === "family-name", f2 = (e) => e === "number" || e === "weight", d2 = (e) => e === "shadow";
  var M_ = () => {
    let e = Kt("color"), t = Kt("font"), a = Kt("text"), o = Kt("font-weight"), r = Kt("tracking"), n = Kt("leading"), s = Kt("breakpoint"), l = Kt("container"), i = Kt("spacing"), u = Kt("radius"), c = Kt("shadow"), d = Kt("inset-shadow"), f = Kt("text-shadow"), p = Kt("drop-shadow"), x = Kt("blur"), S = Kt("perspective"), v = Kt("aspect"), g = Kt("ease"), m = Kt("animate"), b = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], y = () => ["center", "top", "bottom", "left", "right", "top-left", "left-top", "top-right", "right-top", "bottom-right", "right-bottom", "bottom-left", "left-bottom"], C = () => [...y(), G, V], D = () => ["auto", "hidden", "clip", "visible", "scroll"], I = () => ["auto", "contain", "none"], w = () => [G, V, i], M = () => [vn, "full", "auto", ...w()], T = () => [Vo, "none", "subgrid", G, V], K = () => ["auto", { span: ["full", Vo, G, V] }, Vo, G, V], z = () => [Vo, "auto", G, V], Y = () => ["auto", "min", "max", "fr", G, V], ce = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], Le = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], J = () => ["auto", ...w()], Ie = () => [vn, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...w()], Be = () => [vn, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...w()], he = () => [vn, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...w()], U = () => [e, G, V], gt = () => [...y(), $I, QI, { position: [G, V] }], ue = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }], Pe = () => ["auto", "cover", "contain", A_, C_, { size: [G, V] }], Ee = () => [K0, Mc, ws], ne = () => ["", "none", "full", u, G, V], $ = () => ["", ve, Mc, ws], et = () => ["solid", "dashed", "dotted", "double"], H = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ee = () => [ve, K0, $I, QI], Ne = () => ["", "none", x, G, V], lt = () => ["none", ve, G, V], te = () => ["none", ve, G, V], ke = () => [ve, G, V], He = () => [vn, "full", ...w()];
    return { cacheSize: 500, theme: { animate: ["spin", "ping", "pulse", "bounce"], aspect: ["video"], blur: [vr], breakpoint: [vr], color: [n2], container: [vr], "drop-shadow": [vr], ease: ["in", "out", "in-out"], font: [S_], "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"], "inset-shadow": [vr], leading: ["none", "tight", "snug", "normal", "relaxed", "loose"], perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"], radius: [vr], shadow: [vr], spacing: ["px", ve], text: [vr], "text-shadow": [vr], tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"] }, classGroups: { aspect: [{ aspect: ["auto", "square", vn, V, G, v] }], container: ["container"], "container-type": [{ "@container": ["", "normal", "size", G, V] }], "container-named": [L_], columns: [{ columns: [ve, V, G, l] }], "break-after": [{ "break-after": b() }], "break-before": [{ "break-before": b() }], "break-inside": [{ "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] }], "box-decoration": [{ "box-decoration": ["slice", "clone"] }], box: [{ box: ["border", "content"] }], display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"], sr: ["sr-only", "not-sr-only"], float: [{ float: ["right", "left", "none", "start", "end"] }], clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }], isolation: ["isolate", "isolation-auto"], "object-fit": [{ object: ["contain", "cover", "fill", "none", "scale-down"] }], "object-position": [{ object: C() }], overflow: [{ overflow: D() }], "overflow-x": [{ "overflow-x": D() }], "overflow-y": [{ "overflow-y": D() }], overscroll: [{ overscroll: I() }], "overscroll-x": [{ "overscroll-x": I() }], "overscroll-y": [{ "overscroll-y": I() }], position: ["static", "fixed", "absolute", "relative", "sticky"], inset: [{ inset: M() }], "inset-x": [{ "inset-x": M() }], "inset-y": [{ "inset-y": M() }], start: [{ "inset-s": M(), start: M() }], end: [{ "inset-e": M(), end: M() }], "inset-bs": [{ "inset-bs": M() }], "inset-be": [{ "inset-be": M() }], top: [{ top: M() }], right: [{ right: M() }], bottom: [{ bottom: M() }], left: [{ left: M() }], visibility: ["visible", "invisible", "collapse"], z: [{ z: [Vo, "auto", G, V] }], basis: [{ basis: [vn, "full", "auto", l, ...w()] }], "flex-direction": [{ flex: ["row", "row-reverse", "col", "col-reverse"] }], "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }], flex: [{ flex: [ve, vn, "auto", "initial", "none", V] }], grow: [{ grow: ["", ve, G, V] }], shrink: [{ shrink: ["", ve, G, V] }], order: [{ order: [Vo, "first", "last", "none", G, V] }], "grid-cols": [{ "grid-cols": T() }], "col-start-end": [{ col: K() }], "col-start": [{ "col-start": z() }], "col-end": [{ "col-end": z() }], "grid-rows": [{ "grid-rows": T() }], "row-start-end": [{ row: K() }], "row-start": [{ "row-start": z() }], "row-end": [{ "row-end": z() }], "grid-flow": [{ "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] }], "auto-cols": [{ "auto-cols": Y() }], "auto-rows": [{ "auto-rows": Y() }], gap: [{ gap: w() }], "gap-x": [{ "gap-x": w() }], "gap-y": [{ "gap-y": w() }], "justify-content": [{ justify: [...ce(), "normal"] }], "justify-items": [{ "justify-items": [...Le(), "normal"] }], "justify-self": [{ "justify-self": ["auto", ...Le()] }], "align-content": [{ content: ["normal", ...ce()] }], "align-items": [{ items: [...Le(), { baseline: ["", "last"] }] }], "align-self": [{ self: ["auto", ...Le(), { baseline: ["", "last"] }] }], "place-content": [{ "place-content": ce() }], "place-items": [{ "place-items": [...Le(), "baseline"] }], "place-self": [{ "place-self": ["auto", ...Le()] }], p: [{ p: w() }], px: [{ px: w() }], py: [{ py: w() }], ps: [{ ps: w() }], pe: [{ pe: w() }], pbs: [{ pbs: w() }], pbe: [{ pbe: w() }], pt: [{ pt: w() }], pr: [{ pr: w() }], pb: [{ pb: w() }], pl: [{ pl: w() }], m: [{ m: J() }], mx: [{ mx: J() }], my: [{ my: J() }], ms: [{ ms: J() }], me: [{ me: J() }], mbs: [{ mbs: J() }], mbe: [{ mbe: J() }], mt: [{ mt: J() }], mr: [{ mr: J() }], mb: [{ mb: J() }], ml: [{ ml: J() }], "space-x": [{ "space-x": w() }], "space-x-reverse": ["space-x-reverse"], "space-y": [{ "space-y": w() }], "space-y-reverse": ["space-y-reverse"], size: [{ size: Ie() }], "inline-size": [{ inline: ["auto", ...Be()] }], "min-inline-size": [{ "min-inline": ["auto", ...Be()] }], "max-inline-size": [{ "max-inline": ["none", ...Be()] }], "block-size": [{ block: ["auto", ...he()] }], "min-block-size": [{ "min-block": ["auto", ...he()] }], "max-block-size": [{ "max-block": ["none", ...he()] }], w: [{ w: [l, "screen", ...Ie()] }], "min-w": [{ "min-w": [l, "screen", "none", ...Ie()] }], "max-w": [{ "max-w": [l, "screen", "none", "prose", { screen: [s] }, ...Ie()] }], h: [{ h: ["screen", "lh", ...Ie()] }], "min-h": [{ "min-h": ["screen", "lh", "none", ...Ie()] }], "max-h": [{ "max-h": ["screen", "lh", ...Ie()] }], "font-size": [{ text: ["base", a, Mc, ws] }], "font-smoothing": ["antialiased", "subpixel-antialiased"], "font-style": ["italic", "not-italic"], "font-weight": [{ font: [o, k_, v_] }], "font-stretch": [{ "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", K0, V] }], "font-family": [{ font: [E_, w_, t] }], "font-features": [{ "font-features": [V] }], "fvn-normal": ["normal-nums"], "fvn-ordinal": ["ordinal"], "fvn-slashed-zero": ["slashed-zero"], "fvn-figure": ["lining-nums", "oldstyle-nums"], "fvn-spacing": ["proportional-nums", "tabular-nums"], "fvn-fraction": ["diagonal-fractions", "stacked-fractions"], tracking: [{ tracking: [r, G, V] }], "line-clamp": [{ "line-clamp": [ve, "none", G, WI] }], leading: [{ leading: [n, ...w()] }], "list-image": [{ "list-image": ["none", G, V] }], "list-style-position": [{ list: ["inside", "outside"] }], "list-style-type": [{ list: ["disc", "decimal", "none", G, V] }], "text-alignment": [{ text: ["left", "center", "right", "justify", "start", "end"] }], "placeholder-color": [{ placeholder: U() }], "text-color": [{ text: U() }], "text-decoration": ["underline", "overline", "line-through", "no-underline"], "text-decoration-style": [{ decoration: [...et(), "wavy"] }], "text-decoration-thickness": [{ decoration: [ve, "from-font", "auto", G, ws] }], "text-decoration-color": [{ decoration: U() }], "underline-offset": [{ "underline-offset": [ve, "auto", G, V] }], "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"], "text-overflow": ["truncate", "text-ellipsis", "text-clip"], "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }], indent: [{ indent: w() }], "tab-size": [{ tab: [Vo, G, V] }], "vertical-align": [{ align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", G, V] }], whitespace: [{ whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"] }], break: [{ break: ["normal", "words", "all", "keep"] }], wrap: [{ wrap: ["break-word", "anywhere", "normal"] }], hyphens: [{ hyphens: ["none", "manual", "auto"] }], content: [{ content: ["none", G, V] }], "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }], "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }], "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }], "bg-position": [{ bg: gt() }], "bg-repeat": [{ bg: ue() }], "bg-size": [{ bg: Pe() }], "bg-image": [{ bg: ["none", { linear: [{ to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] }, Vo, G, V], radial: ["", G, V], conic: [Vo, G, V] }, T_, I_] }], "bg-color": [{ bg: U() }], "gradient-from-pos": [{ from: Ee() }], "gradient-via-pos": [{ via: Ee() }], "gradient-to-pos": [{ to: Ee() }], "gradient-from": [{ from: U() }], "gradient-via": [{ via: U() }], "gradient-to": [{ to: U() }], rounded: [{ rounded: ne() }], "rounded-s": [{ "rounded-s": ne() }], "rounded-e": [{ "rounded-e": ne() }], "rounded-t": [{ "rounded-t": ne() }], "rounded-r": [{ "rounded-r": ne() }], "rounded-b": [{ "rounded-b": ne() }], "rounded-l": [{ "rounded-l": ne() }], "rounded-ss": [{ "rounded-ss": ne() }], "rounded-se": [{ "rounded-se": ne() }], "rounded-ee": [{ "rounded-ee": ne() }], "rounded-es": [{ "rounded-es": ne() }], "rounded-tl": [{ "rounded-tl": ne() }], "rounded-tr": [{ "rounded-tr": ne() }], "rounded-br": [{ "rounded-br": ne() }], "rounded-bl": [{ "rounded-bl": ne() }], "border-w": [{ border: $() }], "border-w-x": [{ "border-x": $() }], "border-w-y": [{ "border-y": $() }], "border-w-s": [{ "border-s": $() }], "border-w-e": [{ "border-e": $() }], "border-w-bs": [{ "border-bs": $() }], "border-w-be": [{ "border-be": $() }], "border-w-t": [{ "border-t": $() }], "border-w-r": [{ "border-r": $() }], "border-w-b": [{ "border-b": $() }], "border-w-l": [{ "border-l": $() }], "divide-x": [{ "divide-x": $() }], "divide-x-reverse": ["divide-x-reverse"], "divide-y": [{ "divide-y": $() }], "divide-y-reverse": ["divide-y-reverse"], "border-style": [{ border: [...et(), "hidden", "none"] }], "divide-style": [{ divide: [...et(), "hidden", "none"] }], "border-color": [{ border: U() }], "border-color-x": [{ "border-x": U() }], "border-color-y": [{ "border-y": U() }], "border-color-s": [{ "border-s": U() }], "border-color-e": [{ "border-e": U() }], "border-color-bs": [{ "border-bs": U() }], "border-color-be": [{ "border-be": U() }], "border-color-t": [{ "border-t": U() }], "border-color-r": [{ "border-r": U() }], "border-color-b": [{ "border-b": U() }], "border-color-l": [{ "border-l": U() }], "divide-color": [{ divide: U() }], "outline-style": [{ outline: [...et(), "none", "hidden"] }], "outline-offset": [{ "outline-offset": [ve, G, V] }], "outline-w": [{ outline: ["", ve, Mc, ws] }], "outline-color": [{ outline: U() }], shadow: [{ shadow: ["", "none", c, Hp, Up] }], "shadow-color": [{ shadow: U() }], "inset-shadow": [{ "inset-shadow": ["none", d, Hp, Up] }], "inset-shadow-color": [{ "inset-shadow": U() }], "ring-w": [{ ring: $() }], "ring-w-inset": ["ring-inset"], "ring-color": [{ ring: U() }], "ring-offset-w": [{ "ring-offset": [ve, ws] }], "ring-offset-color": [{ "ring-offset": U() }], "inset-ring-w": [{ "inset-ring": $() }], "inset-ring-color": [{ "inset-ring": U() }], "text-shadow": [{ "text-shadow": ["none", f, Hp, Up] }], "text-shadow-color": [{ "text-shadow": U() }], opacity: [{ opacity: [ve, G, V] }], "mix-blend": [{ "mix-blend": [...H(), "plus-darker", "plus-lighter"] }], "bg-blend": [{ "bg-blend": H() }], "mask-clip": [{ "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"] }, "mask-no-clip"], "mask-composite": [{ mask: ["add", "subtract", "intersect", "exclude"] }], "mask-image-linear-pos": [{ "mask-linear": [ve] }], "mask-image-linear-from-pos": [{ "mask-linear-from": ee() }], "mask-image-linear-to-pos": [{ "mask-linear-to": ee() }], "mask-image-linear-from-color": [{ "mask-linear-from": U() }], "mask-image-linear-to-color": [{ "mask-linear-to": U() }], "mask-image-t-from-pos": [{ "mask-t-from": ee() }], "mask-image-t-to-pos": [{ "mask-t-to": ee() }], "mask-image-t-from-color": [{ "mask-t-from": U() }], "mask-image-t-to-color": [{ "mask-t-to": U() }], "mask-image-r-from-pos": [{ "mask-r-from": ee() }], "mask-image-r-to-pos": [{ "mask-r-to": ee() }], "mask-image-r-from-color": [{ "mask-r-from": U() }], "mask-image-r-to-color": [{ "mask-r-to": U() }], "mask-image-b-from-pos": [{ "mask-b-from": ee() }], "mask-image-b-to-pos": [{ "mask-b-to": ee() }], "mask-image-b-from-color": [{ "mask-b-from": U() }], "mask-image-b-to-color": [{ "mask-b-to": U() }], "mask-image-l-from-pos": [{ "mask-l-from": ee() }], "mask-image-l-to-pos": [{ "mask-l-to": ee() }], "mask-image-l-from-color": [{ "mask-l-from": U() }], "mask-image-l-to-color": [{ "mask-l-to": U() }], "mask-image-x-from-pos": [{ "mask-x-from": ee() }], "mask-image-x-to-pos": [{ "mask-x-to": ee() }], "mask-image-x-from-color": [{ "mask-x-from": U() }], "mask-image-x-to-color": [{ "mask-x-to": U() }], "mask-image-y-from-pos": [{ "mask-y-from": ee() }], "mask-image-y-to-pos": [{ "mask-y-to": ee() }], "mask-image-y-from-color": [{ "mask-y-from": U() }], "mask-image-y-to-color": [{ "mask-y-to": U() }], "mask-image-radial": [{ "mask-radial": [G, V] }], "mask-image-radial-from-pos": [{ "mask-radial-from": ee() }], "mask-image-radial-to-pos": [{ "mask-radial-to": ee() }], "mask-image-radial-from-color": [{ "mask-radial-from": U() }], "mask-image-radial-to-color": [{ "mask-radial-to": U() }], "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }], "mask-image-radial-size": [{ "mask-radial": [{ closest: ["side", "corner"], farthest: ["side", "corner"] }] }], "mask-image-radial-pos": [{ "mask-radial-at": y() }], "mask-image-conic-pos": [{ "mask-conic": [ve] }], "mask-image-conic-from-pos": [{ "mask-conic-from": ee() }], "mask-image-conic-to-pos": [{ "mask-conic-to": ee() }], "mask-image-conic-from-color": [{ "mask-conic-from": U() }], "mask-image-conic-to-color": [{ "mask-conic-to": U() }], "mask-mode": [{ mask: ["alpha", "luminance", "match"] }], "mask-origin": [{ "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"] }], "mask-position": [{ mask: gt() }], "mask-repeat": [{ mask: ue() }], "mask-size": [{ mask: Pe() }], "mask-type": [{ "mask-type": ["alpha", "luminance"] }], "mask-image": [{ mask: ["none", G, V] }], filter: [{ filter: ["", "none", G, V] }], blur: [{ blur: Ne() }], brightness: [{ brightness: [ve, G, V] }], contrast: [{ contrast: [ve, G, V] }], "drop-shadow": [{ "drop-shadow": ["", "none", p, Hp, Up] }], "drop-shadow-color": [{ "drop-shadow": U() }], grayscale: [{ grayscale: ["", ve, G, V] }], "hue-rotate": [{ "hue-rotate": [ve, G, V] }], invert: [{ invert: ["", ve, G, V] }], saturate: [{ saturate: [ve, G, V] }], sepia: [{ sepia: ["", ve, G, V] }], "backdrop-filter": [{ "backdrop-filter": ["", "none", G, V] }], "backdrop-blur": [{ "backdrop-blur": Ne() }], "backdrop-brightness": [{ "backdrop-brightness": [ve, G, V] }], "backdrop-contrast": [{ "backdrop-contrast": [ve, G, V] }], "backdrop-grayscale": [{ "backdrop-grayscale": ["", ve, G, V] }], "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [ve, G, V] }], "backdrop-invert": [{ "backdrop-invert": ["", ve, G, V] }], "backdrop-opacity": [{ "backdrop-opacity": [ve, G, V] }], "backdrop-saturate": [{ "backdrop-saturate": [ve, G, V] }], "backdrop-sepia": [{ "backdrop-sepia": ["", ve, G, V] }], "border-collapse": [{ border: ["collapse", "separate"] }], "border-spacing": [{ "border-spacing": w() }], "border-spacing-x": [{ "border-spacing-x": w() }], "border-spacing-y": [{ "border-spacing-y": w() }], "table-layout": [{ table: ["auto", "fixed"] }], caption: [{ caption: ["top", "bottom"] }], transition: [{ transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", G, V] }], "transition-behavior": [{ transition: ["normal", "discrete"] }], duration: [{ duration: [ve, "initial", G, V] }], ease: [{ ease: ["linear", "initial", g, G, V] }], delay: [{ delay: [ve, G, V] }], animate: [{ animate: ["none", m, G, V] }], backface: [{ backface: ["hidden", "visible"] }], perspective: [{ perspective: [S, G, V] }], "perspective-origin": [{ "perspective-origin": C() }], rotate: [{ rotate: lt() }], "rotate-x": [{ "rotate-x": lt() }], "rotate-y": [{ "rotate-y": lt() }], "rotate-z": [{ "rotate-z": lt() }], scale: [{ scale: te() }], "scale-x": [{ "scale-x": te() }], "scale-y": [{ "scale-y": te() }], "scale-z": [{ "scale-z": te() }], "scale-3d": ["scale-3d"], skew: [{ skew: ke() }], "skew-x": [{ "skew-x": ke() }], "skew-y": [{ "skew-y": ke() }], transform: [{ transform: [G, V, "", "none", "gpu", "cpu"] }], "transform-origin": [{ origin: C() }], "transform-style": [{ transform: ["3d", "flat"] }], translate: [{ translate: He() }], "translate-x": [{ "translate-x": He() }], "translate-y": [{ "translate-y": He() }], "translate-z": [{ "translate-z": He() }], "translate-none": ["translate-none"], zoom: [{ zoom: [Vo, G, V] }], accent: [{ accent: U() }], appearance: [{ appearance: ["none", "auto"] }], "caret-color": [{ caret: U() }], "color-scheme": [{ scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"] }], cursor: [{ cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", G, V] }], "field-sizing": [{ "field-sizing": ["fixed", "content"] }], "pointer-events": [{ "pointer-events": ["auto", "none"] }], resize: [{ resize: ["none", "", "y", "x"] }], "scroll-behavior": [{ scroll: ["auto", "smooth"] }], "scrollbar-thumb-color": [{ "scrollbar-thumb": U() }], "scrollbar-track-color": [{ "scrollbar-track": U() }], "scrollbar-gutter": [{ "scrollbar-gutter": ["auto", "stable", "both"] }], "scrollbar-w": [{ scrollbar: ["auto", "thin", "none"] }], "scroll-m": [{ "scroll-m": w() }], "scroll-mx": [{ "scroll-mx": w() }], "scroll-my": [{ "scroll-my": w() }], "scroll-ms": [{ "scroll-ms": w() }], "scroll-me": [{ "scroll-me": w() }], "scroll-mbs": [{ "scroll-mbs": w() }], "scroll-mbe": [{ "scroll-mbe": w() }], "scroll-mt": [{ "scroll-mt": w() }], "scroll-mr": [{ "scroll-mr": w() }], "scroll-mb": [{ "scroll-mb": w() }], "scroll-ml": [{ "scroll-ml": w() }], "scroll-p": [{ "scroll-p": w() }], "scroll-px": [{ "scroll-px": w() }], "scroll-py": [{ "scroll-py": w() }], "scroll-ps": [{ "scroll-ps": w() }], "scroll-pe": [{ "scroll-pe": w() }], "scroll-pbs": [{ "scroll-pbs": w() }], "scroll-pbe": [{ "scroll-pbe": w() }], "scroll-pt": [{ "scroll-pt": w() }], "scroll-pr": [{ "scroll-pr": w() }], "scroll-pb": [{ "scroll-pb": w() }], "scroll-pl": [{ "scroll-pl": w() }], "snap-align": [{ snap: ["start", "end", "center", "align-none"] }], "snap-stop": [{ snap: ["normal", "always"] }], "snap-type": [{ snap: ["none", "x", "y", "both"] }], "snap-strictness": [{ snap: ["mandatory", "proximity"] }], touch: [{ touch: ["auto", "none", "manipulation"] }], "touch-x": [{ "touch-pan": ["x", "left", "right"] }], "touch-y": [{ "touch-pan": ["y", "up", "down"] }], "touch-pz": ["touch-pinch-zoom"], select: [{ select: ["none", "text", "all", "auto"] }], "will-change": [{ "will-change": ["auto", "scroll", "contents", "transform", G, V] }], fill: [{ fill: ["none", ...U()] }], "stroke-w": [{ stroke: [ve, Mc, ws, WI] }], stroke: [{ stroke: ["none", ...U()] }], "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }] }, conflictingClassGroups: { "container-named": ["container-type"], overflow: ["overflow-x", "overflow-y"], overscroll: ["overscroll-x", "overscroll-y"], inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"], "inset-x": ["right", "left"], "inset-y": ["top", "bottom"], flex: ["basis", "grow", "shrink"], gap: ["gap-x", "gap-y"], p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"], px: ["pr", "pl"], py: ["pt", "pb"], m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"], mx: ["mr", "ml"], my: ["mt", "mb"], size: ["w", "h"], "font-size": ["leading"], "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"], "fvn-ordinal": ["fvn-normal"], "fvn-slashed-zero": ["fvn-normal"], "fvn-figure": ["fvn-normal"], "fvn-spacing": ["fvn-normal"], "fvn-fraction": ["fvn-normal"], "line-clamp": ["display", "overflow"], rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"], "rounded-s": ["rounded-ss", "rounded-es"], "rounded-e": ["rounded-se", "rounded-ee"], "rounded-t": ["rounded-tl", "rounded-tr"], "rounded-r": ["rounded-tr", "rounded-br"], "rounded-b": ["rounded-br", "rounded-bl"], "rounded-l": ["rounded-tl", "rounded-bl"], "border-spacing": ["border-spacing-x", "border-spacing-y"], "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"], "border-w-x": ["border-w-r", "border-w-l"], "border-w-y": ["border-w-t", "border-w-b"], "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"], "border-color-x": ["border-color-r", "border-color-l"], "border-color-y": ["border-color-t", "border-color-b"], translate: ["translate-x", "translate-y", "translate-none"], "translate-none": ["translate", "translate-x", "translate-y", "translate-z"], "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"], "scroll-mx": ["scroll-mr", "scroll-ml"], "scroll-my": ["scroll-mt", "scroll-mb"], "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"], "scroll-px": ["scroll-pr", "scroll-pl"], "scroll-py": ["scroll-pt", "scroll-pb"], touch: ["touch-x", "touch-y", "touch-pz"], "touch-x": ["touch"], "touch-y": ["touch"], "touch-pz": ["touch"] }, conflictingClassGroupModifiers: { "font-size": ["leading"] }, postfixLookupClassGroups: ["container-type"], orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"] };
  };
  var p2 = u_(M_);
  function xo(...e) {
    return p2(Np(e));
  }
  var m2 = _(F(), 1);
  var W0 = m2.forwardRef(function(t, a) {
    let { render: o, className: r, disabled: n = false, focusableWhenDisabled: s = false, nativeButton: l = true, style: i, ...u } = t, { getButtonProps: c, buttonRef: d } = Sr({ disabled: n, focusableWhenDisabled: s, native: l });
    return $e("button", t, { state: { disabled: n }, ref: [a, d], props: [u, c] });
  });
  var h2 = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, g2 = Np, zp = (e, t) => (a) => {
    var o;
    if (t?.variants == null) return g2(e, a?.class, a?.className);
    let { variants: r, defaultVariants: n } = t, s = Object.keys(r).map((u) => {
      let c = a?.[u], d = n?.[u];
      if (c === null) return null;
      let f = h2(c) || h2(d);
      return r[u][f];
    }), l = a && Object.entries(a).reduce((u, c) => {
      let [d, f] = c;
      return f === void 0 || (u[d] = f), u;
    }, {}), i = t == null || (o = t.compoundVariants) === null || o === void 0 ? void 0 : o.reduce((u, c) => {
      let { class: d, className: f, ...p } = c;
      return Object.entries(p).every((x) => {
        let [S, v] = x;
        return Array.isArray(v) ? v.includes({ ...n, ...l }[S]) : { ...n, ...l }[S] === v;
      }) ? [...u, d, f] : u;
    }, []);
    return g2(e, s, i, a?.class, a?.className);
  };
  var b2 = _(mt(), 1), D_ = zp("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", { variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/80", outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50", secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground", ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50", destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40", link: "text-primary underline-offset-4 hover:underline" }, size: { default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2", xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3", sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5", lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2", icon: "size-8", "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3", "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg", "icon-lg": "size-9" } }, defaultVariants: { variant: "default", size: "default" } });
  function x2({ className: e, variant: t = "default", size: a = "default", ...o }) {
    return (0, b2.jsx)(W0, { "data-slot": "button", className: xo(D_({ variant: t, size: a, className: e })), ...o });
  }
  var Ha = _(mt(), 1);
  function Q0({ ...e }) {
    return (0, Ha.jsx)(Fo.Root, { "data-slot": "dialog", ...e });
  }
  function O_({ ...e }) {
    return (0, Ha.jsx)(Fo.Portal, { "data-slot": "dialog-portal", ...e });
  }
  function B_({ className: e, ...t }) {
    return (0, Ha.jsx)(Fo.Backdrop, { "data-slot": "dialog-overlay", className: xo("fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", e), ...t });
  }
  function $0({ className: e, children: t, showCloseButton: a = true, ...o }) {
    return (0, Ha.jsxs)(O_, { children: [(0, Ha.jsx)(B_, {}), (0, Ha.jsxs)(Fo.Popup, { "data-slot": "dialog-content", className: xo("fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e), ...o, children: [t, a && (0, Ha.jsxs)(Fo.Close, { "data-slot": "dialog-close", render: (0, Ha.jsx)(x2, { variant: "ghost", className: "absolute top-2 right-2", size: "icon-sm" }), children: [(0, Ha.jsx)(ic, {}), (0, Ha.jsx)("span", { className: "sr-only", children: "Close" })] })] })] });
  }
  function J0({ className: e, ...t }) {
    return (0, Ha.jsx)(Fo.Title, { "data-slot": "dialog-title", className: xo("font-heading text-base leading-none font-medium", e), ...t });
  }
  function eb({ className: e, ...t }) {
    return (0, Ha.jsx)(Fo.Description, { "data-slot": "dialog-description", className: xo("text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", e), ...t });
  }
  var Ts = {};
  Qo(Ts, { Indicator: () => B2, List: () => q2, Panel: () => _2, Root: () => w2, Tab: () => A2 });
  var Mt = _(F(), 1);
  var Es = _(F(), 1);
  function y2({ controlled: e, default: t, name: a, state: o = "value" }) {
    let { current: r } = Es.useRef(e !== void 0), [n, s] = Es.useState(t), l = r ? e : n, i = Es.useCallback((u) => {
      r || s(u);
    }, []);
    return [l, i];
  }
  var wr = _(F(), 1);
  var qp = _(F(), 1), tb = qp.createContext({ register: () => {
  }, unregister: () => {
  }, subscribeMapChange: () => () => {
  }, nextIndexRef: { current: 0 } });
  function S2() {
    return qp.useContext(tb);
  }
  var L2 = _(mt(), 1);
  function Fp(e) {
    let { children: t, elementsRef: a, labelsRef: o, onMapChange: r } = e, n = le(r), [, s] = wr.useState(false), l = fa(P_).current, i = fa(__).current, u = wr.useRef(0), c = wr.useRef(true), d = wr.useRef([]), f = wr.useRef(null), p = le(() => {
      c.current || (c.current = true, s((C) => !C));
    }), x = le((C, D) => {
      i.set(C, D), p();
    }), S = le((C) => {
      i.delete(C), p();
    }), v = le((C) => {
      let D = /* @__PURE__ */ new Map();
      return a.current.length = 0, o && (o.current.length = 0), C.forEach((I) => {
        D.set(I.element, { ...I.registration.metadata ?? {}, index: I.index }), a.current[I.index] = I.element, o && (o.current[I.index] = I.registration.label !== void 0 ? I.registration.label : I.registration.textRef?.current?.textContent ?? I.element.textContent);
      }), u.current = a.current.length, D;
    });
    function g(C) {
      if (f.current?.disconnect(), f.current = null, typeof MutationObserver != "function" || C.length < 2) return;
      let D = new MutationObserver((w) => {
        if (!H_(w)) return;
        let M = null;
        for (let T of C) if (T.isConnected) {
          if (M && C2(M, T) > 0) {
            D.disconnect(), p();
            return;
          }
          M = T;
        }
      });
      f.current = D;
      let I = /* @__PURE__ */ new Set();
      for (let w = 1; w < C.length; w += 1) {
        let M = U_(C[w - 1], C[w]);
        M && I.add(M);
      }
      I.forEach((w) => D.observe(w, { childList: true }));
    }
    let m = le(() => {
      let [C, D] = N_(i), I = v(C);
      g(D), d.current = C, c.current = false, l.forEach((w) => w(I)), n(I);
    });
    re(() => (c.current || v(d.current), () => {
      a.current = [], o && (o.current = []);
    }), [a, o, v]), re(() => {
      c.current && m();
    }), re(() => () => {
      f.current?.disconnect(), c.current = true;
    }, []);
    let b = le((C) => (l.add(C), () => {
      l.delete(C);
    })), y = wr.useMemo(() => ({ register: x, unregister: S, subscribeMapChange: b, nextIndexRef: u }), [x, S, b, u]);
    return (0, L2.jsx)(tb.Provider, { value: y, children: t });
  }
  function __() {
    return /* @__PURE__ */ new Map();
  }
  function P_() {
    return /* @__PURE__ */ new Set();
  }
  function N_(e) {
    let t = /* @__PURE__ */ new Set(), a = [], o = [];
    e.forEach((n, s) => {
      if (!s.isConnected) return;
      let l = n.index, i = { index: l ?? -1, element: s, registration: n };
      l === null ? o.push(i) : l >= 0 && (t.add(l), a.push(i));
    });
    let r = 0;
    return o.sort((n, s) => C2(n.element, s.element)), o.forEach((n) => {
      for (; t.has(r); ) r += 1;
      n.index = r, a.push(n), r += 1;
    }), t.size > 0 && a.sort((n, s) => n.index - s.index), [a, o.map((n) => n.element)];
  }
  function U_(e, t) {
    let a = e.parentElement;
    for (; a && !a.contains(t); ) a = a.parentElement;
    return a;
  }
  function H_(e) {
    for (let t of e) for (let a = 0; a < t.removedNodes.length; a += 1) if (t.removedNodes[a].isConnected) return true;
    return false;
  }
  function C2(e, t) {
    return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  }
  var Vp = _(F(), 1), ab = Vp.createContext(void 0);
  function In() {
    let e = Vp.useContext(ab);
    if (e === void 0) throw new Error(ca(64));
    return e;
  }
  var Go = { tabActivationDirection: (e) => ({ "data-activation-direction": e }) };
  var ob = _(mt(), 1), w2 = Mt.forwardRef(function(t, a) {
    let { className: o, defaultValue: r = 0, onValueChange: n, orientation: s = "horizontal", render: l, value: i, style: u, ...c } = t, d = t.defaultValue !== void 0, f = Mt.useRef([]), [p, x] = Mt.useState(() => /* @__PURE__ */ new Map()), [S, v] = y2({ controlled: i, default: r, name: "Tabs", state: "value" }), g = i !== void 0, [m, b] = Mt.useState(() => /* @__PURE__ */ new Map()), y = Mt.useRef(void 0), C = Mt.useCallback((H) => rb(m, H), [m]), [D, I] = Mt.useState(() => ({ previousValue: S, tabActivationDirection: "none" })), { previousValue: w, tabActivationDirection: M } = D, T = M, K = false;
    w !== S && (T = v2(w, S, s, m), K = w != null && S != null && C(S) == null);
    let z = K ? w : S, Y = w !== z || M !== T;
    re(() => {
      Y && I({ previousValue: z, tabActivationDirection: T });
    }, [z, Y, T]);
    let ce = le((H, ee) => {
      let Ne = v2(S, H, s, m);
      ee.activationDirection = Ne, n?.(H, ee), !ee.isCanceled && v(H);
    }), Le = le((H, ee) => {
      n?.(H, pt(ee, void 0, void 0, { activationDirection: "none" }));
    }), J = le((H, ee) => (x((Ne) => {
      let lt = new Map(Ne);
      return lt.set(H, ee), lt;
    }), () => {
      x((Ne) => {
        if (Ne.get(H) !== ee) return Ne;
        let lt = new Map(Ne);
        return lt.delete(H), lt;
      });
    })), Ie = Mt.useCallback((H) => p.get(H), [p]), Be = Mt.useCallback((H) => {
      for (let ee of m.values()) if (H === ee.value) return ee.id;
    }, [m]), he = Mt.useMemo(() => ({ getTabElementBySelectedValue: C, getTabIdByPanelValue: Be, getTabPanelIdByValue: Ie, onValueChange: ce, orientation: s, registerMountedTabPanel: J, setTabMap: b, tabActivationDirection: T, value: S }), [C, Be, Ie, ce, s, J, b, T, S]), U = Mt.useMemo(() => {
      for (let H of m.values()) if (H.value === S) return H;
    }, [m, S]), gt = Mt.useMemo(() => {
      for (let H of m.values()) if (!H.disabled) return H.value;
    }, [m]), ue = Mt.useRef(!d), Pe = Mt.useRef(r), Ee = Mt.useRef(d), ne = Mt.useRef(false);
    re(() => {
      if (g) return;
      function H(te, ke) {
        v(te), I({ previousValue: te, tabActivationDirection: "none" }), Le(te, ke), ue.current = false;
      }
      if (m.size === 0) {
        ne.current && S !== null && !y.current?.isConnected && H(null, Ue.missing);
        return;
      }
      ne.current = true, y.current = m.keys().next().value;
      let ee = U?.disabled, Ne = U == null && S !== null;
      if (!ee && S === Pe.current && (Ee.current = false), Ee.current && ee && S === Pe.current) return;
      let lt = ue.current;
      if (ee || Ne) {
        let te = gt ?? null;
        if (S === te) {
          ue.current = false;
          return;
        }
        let ke = Ue.missing;
        lt ? ke = Ue.initial : ee && (ke = Ue.disabled), H(te, ke);
        return;
      }
      lt && U != null && (Le(S, Ue.initial), ue.current = false);
    }, [gt, g, Le, U, v, m, S]);
    let et = $e("div", t, { state: { orientation: s, tabActivationDirection: T }, ref: a, props: c, stateAttributesMapping: Go });
    return (0, ob.jsx)(ab.Provider, { value: he, children: (0, ob.jsx)(Fp, { elementsRef: f, children: et }) });
  });
  function rb(e, t) {
    for (let [a, o] of e.entries()) if (t === o.value) return a;
    return null;
  }
  function v2(e, t, a, o) {
    if (e == null || t == null) return "none";
    let [r, n, s] = a === "horizontal" ? ["left", "left", "right"] : ["top", "up", "down"], l = rb(o, e), i = rb(o, t);
    if (l == null || i == null) return l !== i && (typeof e == "number" || typeof e == "string") && typeof e == typeof t ? t > e ? s : n : "none";
    let u = l.getBoundingClientRect()[r], c = i.getBoundingClientRect()[r];
    return c < u ? n : c > u ? s : "none";
  }
  var Ir = _(F(), 1);
  var Gp = "data-composite-item-active";
  var I2 = _(F(), 1);
  var As = _(F(), 1);
  function jp(e = {}) {
    let { guess: t, label: a, metadata: o, textRef: r, index: n } = e, { register: s, unregister: l, subscribeMapChange: i, nextIndexRef: u } = S2(), c = As.useRef(-1), [d, f] = As.useState(n == null && t ? () => {
      if (c.current === -1) {
        let v = u.current;
        u.current += 1, c.current = v;
      }
      return c.current;
    } : -1), p = n ?? d, x = As.useRef(null), S = As.useCallback((v) => {
      let g = x.current;
      g && l(g), x.current = v, v && s(v, { metadata: o ?? null, index: n ?? null, label: a, textRef: r });
    }, [n, s, l, o, a, r]);
    return re(() => {
      if (n == null) return i((v) => {
        let g = x.current ? v.get(x.current)?.index : null;
        g != null && f(g);
      });
    }, [n, i]), { ref: S, index: p };
  }
  function E2(e = {}) {
    let { highlightItemOnHover: t, highlightedIndex: a, onHighlightedIndexChange: o } = jl(), { ref: r, index: n } = jp(e), s = a === n, l = I2.useRef(null), i = Ho(r, l);
    return { compositeProps: { tabIndex: s ? 0 : -1, onFocus() {
      o(n);
    }, onMouseMove() {
      let c = l.current;
      if (!t || !c) return;
      let d = c.hasAttribute("disabled") || c.ariaDisabled === "true";
      !s && !d && c.focus();
    } }, compositeRef: i, index: n };
  }
  var Xp = _(F(), 1), nb = Xp.createContext(void 0);
  function Kp() {
    let e = Xp.useContext(nb);
    if (e === void 0) throw new Error(ca(65));
    return e;
  }
  var A2 = Ir.forwardRef(function(t, a) {
    let { className: o, disabled: r = false, render: n, value: s, id: l, nativeButton: i = true, style: u, ...c } = t, { value: d, getTabPanelIdByValue: f, onValueChange: p, orientation: x, tabActivationDirection: S } = In(), { activateOnFocus: v, registerTabResizeObserverElement: g, tabsListElement: m } = Kp(), { highlightedIndex: b, onHighlightedIndexChange: y } = jl(), C = qo(l), D = Ir.useMemo(() => ({ disabled: r, id: C, value: s }), [r, C, s]), { compositeProps: I, compositeRef: w, index: M } = E2({ metadata: D }), T = s === d, K = Ir.useRef(false), z = Ir.useRef(null), Y = le((ne) => {
      z.current?.(), z.current = ne ? g(ne) : null;
    });
    re(() => {
      if (K.current) {
        K.current = false;
        return;
      }
      if (!(T && M > -1 && b !== M)) return;
      let ne = m;
      if (ne != null) {
        let $ = Ua(ot(ne));
        if ($ && Oe(ne, $)) return;
      }
      r || y(M);
    }, [T, M, b, y, r, m]);
    let { getButtonProps: ce, buttonRef: Le } = Sr({ disabled: r, native: i, focusableWhenDisabled: true }), J = f(s), Ie = Ir.useRef(false), Be = Ir.useRef(false);
    function he(ne) {
      p(s, pt(Ue.none, ne.nativeEvent, void 0, { activationDirection: "none" }));
    }
    function U(ne) {
      T || r || he(ne);
    }
    function gt(ne) {
      T || r || v && (!Ie.current || Be.current) && he(ne);
    }
    function ue(ne) {
      if (T || r) return;
      Ie.current = true, Be.current = ne.button === 0;
      let $ = ot(ne.currentTarget);
      function et() {
        Ie.current = false, Be.current = false, $.removeEventListener("pointerup", et), $.removeEventListener("pointercancel", et);
      }
      $.addEventListener("pointerup", et), $.addEventListener("pointercancel", et);
    }
    return $e("button", t, { state: { disabled: r, active: T, orientation: x, tabActivationDirection: S }, ref: [a, Le, w, Y], props: [I, { role: "tab", "aria-controls": J, "aria-selected": T, id: C, onClick: U, onFocus: gt, onPointerDown: ue, [Gp]: T ? "" : void 0, onKeyDownCapture() {
      K.current = true;
    } }, c, ce], stateAttributesMapping: Go });
  });
  var $l = _(F(), 1);
  function sb(e) {
    let t = yr(e), a = parseFloat(t.width) || 0, o = parseFloat(t.height) || 0, r = yt(e), n = r ? e.offsetWidth : a, s = r ? e.offsetHeight : o;
    return (x0(a) !== n || x0(o) !== s) && (a = n, o = s), { width: a, height: o };
  }
  var _V = _(F(), 1);
  var T2 = _(Ic(), 1);
  function z_() {
    return br;
  }
  function q_() {
    return false;
  }
  function F_() {
    return true;
  }
  function k2() {
    return (0, T2.useSyncExternalStore)(z_, q_, F_);
  }
  var Yp = _(F(), 1), V_ = Yp.createContext(void 0), G_ = { disableStyleElements: false };
  function R2() {
    return Yp.useContext(V_) ?? G_;
  }
  var M2 = _(mt(), 1);
  function D2(e) {
    let { script: t } = e, { nonce: a } = R2();
    return k2() ? (0, M2.jsx)("script", { nonce: a, dangerouslySetInnerHTML: { __html: t }, suppressHydrationWarning: true }) : null;
  }
  var Zp = _(mt(), 1), O2, j_ = { ...Go, activeTabPosition: () => null, activeTabSize: () => null }, B2 = $l.forwardRef(function(t, a) {
    let { className: o, render: r, renderBeforeHydration: n = false, style: s, ...l } = t, { getTabElementBySelectedValue: i, orientation: u, tabActivationDirection: c, value: d } = In(), { tabsListElement: f, registerIndicatorUpdateListener: p } = Kp(), x = Xw();
    $l.useEffect(() => p(x), [p, x]);
    let S = 0, v = 0, g = 0, m = 0, b = 0, y = 0, C = false;
    if (d != null && f != null) {
      let z = i(d);
      if (z != null) {
        C = true;
        let { width: Y, height: ce } = sb(z), { width: Le, height: J } = sb(f), Ie = z.getBoundingClientRect(), Be = f.getBoundingClientRect(), he = Le > 0 ? Be.width / Le : 1, U = J > 0 ? Be.height / J : 1;
        if (he > Number.EPSILON && U > Number.EPSILON) {
          let ue = Ie.left - Be.left, Pe = Ie.top - Be.top;
          S = ue / he + f.scrollLeft - f.clientLeft, g = Pe / U + f.scrollTop - f.clientTop;
        } else S = z.offsetLeft, g = z.offsetTop;
        b = Y, y = ce, v = f.scrollWidth - S - b, m = f.scrollHeight - g - y;
      }
    }
    let D = C ? { left: S, right: v, top: g, bottom: m } : null, I = C ? { width: b, height: y } : null, w = C ? { "--active-tab-left": `${S}px`, "--active-tab-right": `${v}px`, "--active-tab-top": `${g}px`, "--active-tab-bottom": `${m}px`, "--active-tab-width": `${b}px`, "--active-tab-height": `${y}px` } : void 0, M = C && b > 0 && y > 0, K = $e("span", t, { state: { orientation: u, activeTabPosition: D, activeTabSize: I, tabActivationDirection: c }, ref: a, props: [{ role: "presentation", style: w, hidden: !M }, l, { suppressHydrationWarning: true }], stateAttributesMapping: j_ });
    return d == null ? null : (0, Zp.jsxs)($l.Fragment, { children: [K, n && (O2 || (O2 = (0, Zp.jsx)(D2, { script: "" })))] });
  });
  var Wp = _(F(), 1);
  var X_ = { ...Go, ...Gl }, _2 = Wp.forwardRef(function(t, a) {
    let { className: o, value: r, render: n, keepMounted: s = false, style: l, ...i } = t, { value: u, getTabIdByPanelValue: c, orientation: d, tabActivationDirection: f, registerMountedTabPanel: p } = In(), x = qo(), { ref: S, index: v } = jp(), g = r === u, { mounted: m, transitionStatus: b, setMounted: y } = yp(g), C = !m, D = c(r), I = { hidden: C, orientation: d, tabActivationDirection: f, transitionStatus: b }, w = Wp.useRef(null), M = $e("div", t, { state: I, ref: [a, S, w], props: [{ "aria-labelledby": D, hidden: C, id: x, role: "tabpanel", tabIndex: g ? 0 : -1, inert: Mp(!g), "data-index": v }, i], stateAttributesMapping: X_ });
    return Ql({ open: g, ref: w, onComplete() {
      g || y(false);
    } }), re(() => {
      if (!(x == null || C && !s)) return p(r, x);
    }, [C, s, r, x, p]), s || m ? M : null;
  });
  var Ao = _(F(), 1);
  var H2 = _(F(), 1);
  var Jl = _(F(), 1);
  function P2(e) {
    return e == null || e.hasAttribute("disabled") || e.getAttribute("aria-disabled") === "true";
  }
  var K_ = [];
  function N2(e) {
    let { loopFocus: t = true, orientation: a = "both", grid: o, onLoop: r, direction: n, highlightedIndex: s, onHighlightedIndexChange: l, rootRef: i, enableHomeAndEndKeys: u = false, stopEventPropagation: c, disabledIndices: d, modifierKeys: f = K_ } = e, [p, x] = Jl.useState(0), S = o != null, v = Jl.useRef(null), g = Ho(v, i), m = Jl.useRef([]), b = Jl.useRef(false), y = s ?? p, C = le((T, K = false) => {
      if ((l ?? x)(T), K) {
        let z = m.current[T];
        V0(v.current, z, n, a);
      }
    }), D = le((T) => {
      if (T.size === 0 || b.current) return;
      b.current = true;
      let K = Array.from(T.keys()), z = K.find((ce) => ce?.hasAttribute(Gp)) ?? null, Y = z ? T.get(z)?.index ?? -1 : -1;
      if (Y !== -1) C(Y);
      else if (yc(K, y, d)) {
        let ce = hs(K, { disabledIndices: d });
        bc(K, ce) || C(ce);
      }
      V0(v.current, z, n, a);
    });
    re(() => {
      if (d == null || s != null || !b.current) return;
      let T = m.current;
      if (yc(T, y, d)) {
        let K = hs(T, { disabledIndices: d });
        bc(T, K) || C(K);
      }
    }, [d, s, y, m, C]);
    let I = le((T, K, z) => r ? r(T, K, z, m) : z), w = le((T) => {
      let K = T.key === Ap || T.key === Tp;
      if (!kp.has(T.key) || !u && K || Y_(T, f) || !v.current) return;
      let Y = n === "rtl", ce = Y ? Ip : Ep, Le = Y ? Ep : Ip, J = a === "vertical" ? wp : ce, Ie = a === "vertical" ? vp : Le, Be = la(T.nativeEvent);
      if (Be != null && F0(Be) && !P2(Be)) {
        let Ee = Be.selectionStart, ne = Be.selectionEnd, $ = Be.value;
        if (Ee == null || T.shiftKey || Ee !== ne || T.key !== Ie && Ee < $.length || T.key !== J && Ee > 0) return;
      }
      let he = y, U = b0(m, d), gt = y0(m, d);
      o != null && (he = o({ disabledIndices: d, elementsRef: m, event: T, highlightedIndex: y, loopFocus: t, maxIndex: gt, minIndex: U, onLoop: I, orientation: a, rtl: Y }));
      let ue = a !== "vertical" && T.key === ce || a !== "horizontal" && T.key === wp, Pe = a !== "vertical" && T.key === Le || a !== "horizontal" && T.key === vp;
      u && (T.key === Ap ? he = U : T.key === Tp && (he = gt)), he === y && (ue || Pe) && (t && he === gt && ue ? (he = U, r && (he = r(T, y, he, m))) : t && he === U && Pe ? (he = gt, r && (he = r(T, y, he, m))) : he = hs(m.current, { startingIndex: he, decrement: Pe, disabledIndices: d })), he !== y && !bc(m.current, he) && (c && T.stopPropagation(), (S || K || ue || Pe) && T.preventDefault(), C(he, true), queueMicrotask(() => {
        m.current[he]?.focus();
      }));
    });
    return { props: { ref: g, onFocus(T) {
      let K = v.current, z = la(T.nativeEvent);
      !K || z == null || !F0(z) || z.setSelectionRange(0, z.value.length);
    }, onKeyDown: w }, highlightedIndex: y, onHighlightedIndexChange: C, elementsRef: m, onMapChange: D, relayKeyboardEvent: w };
  }
  function Y_(e, t) {
    for (let a of xI) if (!t.includes(a) && e.getModifierState(a)) return true;
    return false;
  }
  var Qp = _(F(), 1), Z_ = Qp.createContext(void 0);
  function U2() {
    return Qp.useContext(Z_)?.direction ?? "ltr";
  }
  var lb = _(mt(), 1);
  function z2(e) {
    let { render: t, className: a, style: o, refs: r = fs, props: n = fs, state: s = Et, stateAttributesMapping: l, highlightedIndex: i, onHighlightedIndexChange: u, orientation: c, grid: d, loopFocus: f, onLoop: p, enableHomeAndEndKeys: x, onMapChange: S, stopEventPropagation: v = true, rootRef: g, disabledIndices: m, modifierKeys: b, highlightItemOnHover: y = false, tag: C = "div", ...D } = e, I = U2(), { props: w, highlightedIndex: M, onHighlightedIndexChange: T, elementsRef: K, onMapChange: z, relayKeyboardEvent: Y } = N2({ grid: d, loopFocus: f, onLoop: p, orientation: c, highlightedIndex: i, onHighlightedIndexChange: u, rootRef: g, stopEventPropagation: v, enableHomeAndEndKeys: x, direction: I, disabledIndices: m, modifierKeys: b }), ce = $e(C, e, { state: s, ref: r, props: [w, ...n, D], stateAttributesMapping: l }), Le = H2.useMemo(() => ({ highlightedIndex: M, onHighlightedIndexChange: T, highlightItemOnHover: y, relayKeyboardEvent: Y }), [M, T, y, Y]);
    return (0, lb.jsx)(r0.Provider, { value: Le, children: (0, lb.jsx)(Fp, { elementsRef: K, onMapChange: (J) => {
      S?.(J), z(J);
    }, children: ce }) });
  }
  var ib = _(mt(), 1), q2 = Ao.forwardRef(function(t, a) {
    let { activateOnFocus: o = false, className: r, loopFocus: n = true, render: s, style: l, ...i } = t, { orientation: u, setTabMap: c, tabActivationDirection: d } = In(), [f, p] = Ao.useState(0), [x, S] = Ao.useState(null), v = Ao.useRef(/* @__PURE__ */ new Set()), g = Ao.useRef(/* @__PURE__ */ new Set()), m = Ao.useRef(null);
    re(() => {
      if (typeof ResizeObserver > "u") return;
      let w = new ResizeObserver(() => {
        v.current.forEach((M) => {
          M();
        });
      });
      return m.current = w, x && w.observe(x), g.current.forEach((M) => {
        w.observe(M);
      }), () => {
        w.disconnect(), m.current = null;
      };
    }, [x]);
    let b = le((w) => (v.current.add(w), () => {
      v.current.delete(w);
    })), y = le((w) => (g.current.add(w), m.current?.observe(w), () => {
      g.current.delete(w), m.current?.unobserve(w);
    })), C = { orientation: u, tabActivationDirection: d }, D = { "aria-orientation": u === "vertical" ? "vertical" : void 0, role: "tablist" }, I = Ao.useMemo(() => ({ activateOnFocus: o, registerIndicatorUpdateListener: b, registerTabResizeObserverElement: y, tabsListElement: x }), [o, b, y, x]);
    return (0, ib.jsx)(nb.Provider, { value: I, children: (0, ib.jsx)(z2, { render: s, className: r, style: l, state: C, refs: [a, S], props: [D, i], stateAttributesMapping: Go, highlightedIndex: f, enableHomeAndEndKeys: true, loopFocus: n, orientation: u, onHighlightedIndexChange: p, onMapChange: c, disabledIndices: fs }) });
  });
  var Dc = _(mt(), 1);
  function ub({ className: e, orientation: t = "horizontal", ...a }) {
    return (0, Dc.jsx)(Ts.Root, { "data-slot": "tabs", "data-orientation": t, className: xo("group/tabs flex gap-2 data-horizontal:flex-col", e), ...a });
  }
  var W_ = zp("group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none", { variants: { variant: { default: "bg-muted", line: "gap-1 bg-transparent" } }, defaultVariants: { variant: "default" } });
  function cb({ className: e, variant: t = "default", ...a }) {
    return (0, Dc.jsx)(Ts.List, { "data-slot": "tabs-list", "data-variant": t, className: xo(W_({ variant: t }), e), ...a });
  }
  function ei({ className: e, ...t }) {
    return (0, Dc.jsx)(Ts.Tab, { "data-slot": "tabs-trigger", className: xo("relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent", "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground", "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100", e), ...t });
  }
  function ti({ className: e, ...t }) {
    return (0, Dc.jsx)(Ts.Panel, { "data-slot": "tabs-content", className: xo("flex-1 text-sm outline-none", e), ...t });
  }
  function Oc(e) {
    if (typeof e == "bigint") return e;
    if (typeof e == "string") return BigInt(e);
    if (typeof e == "number") {
      if (!Number.isInteger(e)) throw new RangeError("Invalid value. Values of type 'number' must be an integer.");
      if (e > Number.MAX_SAFE_INTEGER) throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
      return BigInt(e);
    }
    if (oi(e, Uint8Array)) return BigInt(`0x${za(e)}`);
    throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
  }
  function Q_(e) {
    return /^0x/i.test(e) ? e.slice(2) : e;
  }
  function $p(e, t = 8) {
    return (typeof e == "bigint" ? e : Oc(e)).toString(16).padStart(t * 2, "0");
  }
  function fb(e) {
    return parseInt(e, 16);
  }
  function db(e, t = 16) {
    let a = $p(e, t);
    return ma(a);
  }
  function V2(e, t) {
    if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e) throw `Unable to represent integer in width: ${t}`;
    return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
  }
  function $_(e, t) {
    return e & BigInt(1) << t;
  }
  function Bc(e) {
    return J_(BigInt(`0x${za(e)}`), BigInt(e.byteLength * 8));
  }
  function J_(e, t) {
    return $_(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
  }
  var e3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
  function za(e) {
    if (!(e instanceof Uint8Array)) throw new Error("Uint8Array expected");
    let t = "";
    for (let a of e) t += e3[a];
    return t;
  }
  function ma(e) {
    if (typeof e != "string") throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
    e = Q_(e), e = e.length % 2 ? `0${e}` : e;
    let t = new Uint8Array(e.length / 2);
    for (let a = 0; a < t.length; a++) {
      let o = a * 2, r = e.slice(o, o + 2), n = Number.parseInt(r, 16);
      if (Number.isNaN(n) || n < 0) throw new Error("Invalid byte sequence");
      t[a] = n;
    }
    return t;
  }
  function to(e) {
    return new TextEncoder().encode(e);
  }
  function Jp(e) {
    return new TextDecoder().decode(e);
  }
  function ai(e) {
    let t = [];
    for (let a = 0; a < e.length; a++) t.push(e.charCodeAt(a) & 255);
    return new Uint8Array(t);
  }
  function pb(e) {
    return String.fromCharCode.apply(null, e);
  }
  function t3(e) {
    return !Number.isInteger(e) || e < 0 || e > 255;
  }
  function F2(e) {
    if (e.some(t3)) throw new Error("Some values are invalid bytes.");
    return new Uint8Array(e);
  }
  function _c(...e) {
    if (!e.every((o) => o instanceof Uint8Array)) throw new Error("Uint8Array list expected");
    if (e.length === 1) return e[0];
    let t = e.reduce((o, r) => o + r.length, 0), a = new Uint8Array(t);
    for (let o = 0, r = 0; o < e.length; o++) {
      let n = e[o];
      a.set(n, r), r += n.length;
    }
    return a;
  }
  function Er(e) {
    return _c(...e.map((t) => typeof t == "number" ? F2([t]) : t instanceof Array ? F2(t) : t));
  }
  function oi(e, t) {
    return e instanceof t || e?.constructor?.name?.toLowerCase() === t.name;
  }
  function G2(e, t) {
    return (e[t + 0] << 8 | e[t + 1]) >>> 0;
  }
  function j2(e, t) {
    return e[t];
  }
  function X2(e, t) {
    return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
  }
  function ri(e, t, a = 0) {
    return e[a + 3] = t, t >>>= 8, e[a + 2] = t, t >>>= 8, e[a + 1] = t, t >>>= 8, e[a] = t, e;
  }
  function a3(e) {
    let t = Object.values(e).filter((o) => typeof o == "number"), a = new Set(t);
    return (o) => a.has(o);
  }
  var K2 = /* @__PURE__ */ new Map();
  function Y2(e, t) {
    let a = K2.get(e);
    if (a !== void 0) return a(t);
    let o = a3(e);
    return K2.set(e, o), Y2(e, t);
  }
  var jo = class {
    constructor(t) {
      this.consumed = 0, this.source = typeof t == "string" ? ma(t) : t;
    }
    readBytes(t) {
      let a = this.source.subarray(this.consumed, this.consumed + t);
      return this.consumed += t, a;
    }
    readUInt32BE() {
      return X2(this.readBytes(4), 0);
    }
    readUInt8() {
      return j2(this.readBytes(1), 0);
    }
    readUInt16BE() {
      return G2(this.readBytes(2), 0);
    }
    readBigUIntLE(t) {
      let a = this.readBytes(t).slice().reverse(), o = za(a);
      return BigInt(`0x${o}`);
    }
    readBigUIntBE(t) {
      let a = this.readBytes(t), o = za(a);
      return BigInt(`0x${o}`);
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
    readUInt8Enum(t, a) {
      let o = this.readUInt8();
      if (Y2(t, o)) return o;
      throw a(o);
    }
  };
  var lE = 128, iE = 128, xb = 16;
  var o3 = 1 + 16 * 1024 * 1024, r3 = 165, n3 = 16, s3 = 16, l3 = 20, i3 = s3 + 2 + l3, u3 = i3 + 4, GG = o3 + (r3 + n3 * u3), hb;
  (function(e) {
    e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
  })(hb || (hb = {}));
  var Z2;
  (function(e) {
    e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5";
  })(Z2 || (Z2 = {}));
  var To;
  (function(e) {
    e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
  })(To || (To = {}));
  var mb = ["onChainOnly", "offChainOnly", "any"], jG = { [mb[0]]: To.OnChainOnly, [mb[1]]: To.OffChainOnly, [mb[2]]: To.Any, [To.OnChainOnly]: To.OnChainOnly, [To.OffChainOnly]: To.OffChainOnly, [To.Any]: To.Any };
  var W2;
  (function(e) {
    e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
  })(W2 || (W2 = {}));
  var Q2;
  (function(e) {
    e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
  })(Q2 || (Q2 = {}));
  var $2;
  (function(e) {
    e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
  })($2 || ($2 = {}));
  var J2;
  (function(e) {
    e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
  })(J2 || (J2 = {}));
  var eE;
  (function(e) {
    e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
  })(eE || (eE = {}));
  var tE;
  (function(e) {
    e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
  })(tE || (tE = {}));
  var aE;
  (function(e) {
    e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
  })(aE || (aE = {}));
  var gb;
  (function(e) {
    e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
  })(gb || (gb = {}));
  var oE;
  (function(e) {
    e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
  })(oE || (oE = {}));
  var rE;
  (function(e) {
    e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
  })(rE || (rE = {}));
  var nE;
  (function(e) {
    e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
  })(nE || (nE = {}));
  var sE;
  (function(e) {
    e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
  })(sE || (sE = {}));
  var em = class extends Error {
    constructor(t) {
      super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
    }
  }, tm = class extends em {
    constructor(t) {
      super(t);
    }
  }, ni = class extends em {
    constructor(t) {
      super(t);
    }
  };
  function bb(e) {
    if (!Number.isSafeInteger(e) || e < 0) throw new Error(`Wrong positive integer: ${e}`);
  }
  function c3(e) {
    if (typeof e != "boolean") throw new Error(`Expected boolean, not ${e}`);
  }
  function uE(e, ...t) {
    if (!(e instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (t.length > 0 && !t.includes(e.length)) throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
  }
  function f3(e) {
    if (typeof e != "function" || typeof e.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
    bb(e.outputLen), bb(e.blockLen);
  }
  function d3(e, t = true) {
    if (e.destroyed) throw new Error("Hash instance has been destroyed");
    if (t && e.finished) throw new Error("Hash#digest() has already been called");
  }
  function p3(e, t) {
    uE(e);
    let a = t.outputLen;
    if (e.length < a) throw new Error(`digestInto() expects output buffer of length at least ${a}`);
  }
  var m3 = { number: bb, bool: c3, bytes: uE, hash: f3, exists: d3, output: p3 }, am = m3;
  var h3 = { node: void 0, web: typeof self == "object" && "crypto" in self ? self.crypto : void 0 };
  var rm = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), ko = (e, t) => e << 32 - t | e >>> t, g3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  if (!g3) throw new Error("Non little-endian hardware is not supported");
  var QG = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
  function x3(e) {
    if (typeof e != "string") throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
    return new TextEncoder().encode(e);
  }
  function yb(e) {
    if (typeof e == "string" && (e = x3(e)), !(e instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
    return e;
  }
  var om = class {
    clone() {
      return this._cloneInto();
    }
  };
  function Xo(e) {
    let t = (o) => e().update(yb(o)).digest(), a = e();
    return t.outputLen = a.outputLen, t.blockLen = a.blockLen, t.create = () => e(), t;
  }
  function b3(e, t, a, o) {
    if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, a, o);
    let r = BigInt(32), n = BigInt(4294967295), s = Number(a >> r & n), l = Number(a & n), i = o ? 4 : 0, u = o ? 0 : 4;
    e.setUint32(t + i, s, o), e.setUint32(t + u, l, o);
  }
  var En = class extends om {
    constructor(t, a, o, r) {
      super(), this.blockLen = t, this.outputLen = a, this.padOffset = o, this.isLE = r, this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.buffer = new Uint8Array(t), this.view = rm(this.buffer);
    }
    update(t) {
      am.exists(this);
      let { view: a, buffer: o, blockLen: r } = this;
      t = yb(t);
      let n = t.length;
      for (let s = 0; s < n; ) {
        let l = Math.min(r - this.pos, n - s);
        if (l === r) {
          let i = rm(t);
          for (; r <= n - s; s += r) this.process(i, s);
          continue;
        }
        o.set(t.subarray(s, s + l), this.pos), this.pos += l, s += l, this.pos === r && (this.process(a, 0), this.pos = 0);
      }
      return this.length += t.length, this.roundClean(), this;
    }
    digestInto(t) {
      am.exists(this), am.output(t, this), this.finished = true;
      let { buffer: a, view: o, blockLen: r, isLE: n } = this, { pos: s } = this;
      a[s++] = 128, this.buffer.subarray(s).fill(0), this.padOffset > r - s && (this.process(o, 0), s = 0);
      for (let d = s; d < r; d++) a[d] = 0;
      b3(o, r - 8, BigInt(this.length * 8), n), this.process(o, 0);
      let l = rm(t), i = this.outputLen;
      if (i % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
      let u = i / 4, c = this.get();
      if (u > c.length) throw new Error("_sha2: outputLen bigger than state");
      for (let d = 0; d < u; d++) l.setUint32(4 * d, c[d], n);
    }
    digest() {
      let { buffer: t, outputLen: a } = this;
      this.digestInto(t);
      let o = t.slice(0, a);
      return this.destroy(), o;
    }
    _cloneInto(t) {
      t || (t = new this.constructor()), t.set(...this.get());
      let { blockLen: a, buffer: o, length: r, finished: n, destroyed: s, pos: l } = this;
      return t.length = r, t.pos = l, t.finished = n, t.destroyed = s, r % a && t.buffer.set(o), t;
    }
  };
  var y3 = (e, t, a) => e & t ^ ~e & a, S3 = (e, t, a) => e & t ^ e & a ^ t & a, L3 = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), An = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), Tn = new Uint32Array(64), nm = class extends En {
    constructor() {
      super(64, 32, 8, false), this.A = An[0] | 0, this.B = An[1] | 0, this.C = An[2] | 0, this.D = An[3] | 0, this.E = An[4] | 0, this.F = An[5] | 0, this.G = An[6] | 0, this.H = An[7] | 0;
    }
    get() {
      let { A: t, B: a, C: o, D: r, E: n, F: s, G: l, H: i } = this;
      return [t, a, o, r, n, s, l, i];
    }
    set(t, a, o, r, n, s, l, i) {
      this.A = t | 0, this.B = a | 0, this.C = o | 0, this.D = r | 0, this.E = n | 0, this.F = s | 0, this.G = l | 0, this.H = i | 0;
    }
    process(t, a) {
      for (let d = 0; d < 16; d++, a += 4) Tn[d] = t.getUint32(a, false);
      for (let d = 16; d < 64; d++) {
        let f = Tn[d - 15], p = Tn[d - 2], x = ko(f, 7) ^ ko(f, 18) ^ f >>> 3, S = ko(p, 17) ^ ko(p, 19) ^ p >>> 10;
        Tn[d] = S + Tn[d - 7] + x + Tn[d - 16] | 0;
      }
      let { A: o, B: r, C: n, D: s, E: l, F: i, G: u, H: c } = this;
      for (let d = 0; d < 64; d++) {
        let f = ko(l, 6) ^ ko(l, 11) ^ ko(l, 25), p = c + f + y3(l, i, u) + L3[d] + Tn[d] | 0, S = (ko(o, 2) ^ ko(o, 13) ^ ko(o, 22)) + S3(o, r, n) | 0;
        c = u, u = i, i = l, l = s + p | 0, s = n, n = r, r = o, o = p + S | 0;
      }
      o = o + this.A | 0, r = r + this.B | 0, n = n + this.C | 0, s = s + this.D | 0, l = l + this.E | 0, i = i + this.F | 0, u = u + this.G | 0, c = c + this.H | 0, this.set(o, r, n, s, l, i, u, c);
    }
    roundClean() {
      Tn.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
    }
  }, Sb = class extends nm {
    constructor() {
      super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
    }
  }, C3 = Xo(() => new nm()), rj = Xo(() => new Sb());
  var v3 = _(cE(), 1);
  var Ve = BigInt(0), St = BigInt(1), kn = BigInt(2), Uc = BigInt(3), fE = BigInt(8), Yt = Object.freeze({ a: Ve, b: BigInt(7), P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), h: St, Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"), Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"), beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee") }), dE = (e, t) => (e + t / kn) / t, sm = { beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"), splitScalar(e) {
    let { n: t } = Yt, a = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), o = -St * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), r = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), n = a, s = BigInt("0x100000000000000000000000000000000"), l = dE(n * e, t), i = dE(-o * e, t), u = Z(e - l * a - i * r, t), c = Z(-l * o - i * n, t), d = u > s, f = c > s;
    if (d && (u = t - u), f && (c = t - c), u > s || c > s) throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: f, k2: c };
  } }, si = 32, zc = 32;
  var pE = si + 1, mE = 2 * si + 1;
  function hE(e) {
    let { a: t, b: a } = Yt, o = Z(e * e), r = Z(o * e);
    return Z(r + t * e + a);
  }
  var lm = Yt.a === Ve, vb = class extends Error {
    constructor(t) {
      super(t);
    }
  };
  function gE(e) {
    if (!(e instanceof va)) throw new TypeError("JacobianPoint expected");
  }
  var va = class e {
    constructor(t, a, o) {
      this.x = t, this.y = a, this.z = o;
    }
    static fromAffine(t) {
      if (!(t instanceof wa)) throw new TypeError("JacobianPoint#fromAffine: expected Point");
      return t.equals(wa.ZERO) ? e.ZERO : new e(t.x, t.y, St);
    }
    static toAffineBatch(t) {
      let a = T3(t.map((o) => o.z));
      return t.map((o, r) => o.toAffine(a[r]));
    }
    static normalizeZ(t) {
      return e.toAffineBatch(t).map(e.fromAffine);
    }
    equals(t) {
      gE(t);
      let { x: a, y: o, z: r } = this, { x: n, y: s, z: l } = t, i = Z(r * r), u = Z(l * l), c = Z(a * u), d = Z(n * i), f = Z(Z(o * l) * u), p = Z(Z(s * r) * i);
      return c === d && f === p;
    }
    negate() {
      return new e(this.x, Z(-this.y), this.z);
    }
    double() {
      let { x: t, y: a, z: o } = this, r = Z(t * t), n = Z(a * a), s = Z(n * n), l = t + n, i = Z(kn * (Z(l * l) - r - s)), u = Z(Uc * r), c = Z(u * u), d = Z(c - kn * i), f = Z(u * (i - d) - fE * s), p = Z(kn * a * o);
      return new e(d, f, p);
    }
    add(t) {
      gE(t);
      let { x: a, y: o, z: r } = this, { x: n, y: s, z: l } = t;
      if (n === Ve || s === Ve) return this;
      if (a === Ve || o === Ve) return t;
      let i = Z(r * r), u = Z(l * l), c = Z(a * u), d = Z(n * i), f = Z(Z(o * l) * u), p = Z(Z(s * r) * i), x = Z(d - c), S = Z(p - f);
      if (x === Ve) return S === Ve ? this.double() : e.ZERO;
      let v = Z(x * x), g = Z(x * v), m = Z(c * v), b = Z(S * S - g - kn * m), y = Z(S * (m - b) - f * g), C = Z(r * l * x);
      return new e(b, y, C);
    }
    subtract(t) {
      return this.add(t.negate());
    }
    multiplyUnsafe(t) {
      let a = e.ZERO;
      if (typeof t == "bigint" && t === Ve) return a;
      let o = SE(t);
      if (o === St) return this;
      if (!lm) {
        let d = a, f = this;
        for (; o > Ve; ) o & St && (d = d.add(f)), f = f.double(), o >>= St;
        return d;
      }
      let { k1neg: r, k1: n, k2neg: s, k2: l } = sm.splitScalar(o), i = a, u = a, c = this;
      for (; n > Ve || l > Ve; ) n & St && (i = i.add(c)), l & St && (u = u.add(c)), c = c.double(), n >>= St, l >>= St;
      return r && (i = i.negate()), s && (u = u.negate()), u = new e(Z(u.x * sm.beta), u.y, u.z), i.add(u);
    }
    precomputeWindow(t) {
      let a = lm ? 128 / t + 1 : 256 / t + 1, o = [], r = this, n = r;
      for (let s = 0; s < a; s++) {
        n = r, o.push(n);
        for (let l = 1; l < 2 ** (t - 1); l++) n = n.add(r), o.push(n);
        r = n.double();
      }
      return o;
    }
    wNAF(t, a) {
      !a && this.equals(e.BASE) && (a = wa.BASE);
      let o = a && a._WINDOW_SIZE || 1;
      if (256 % o) throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
      let r = a && wb.get(a);
      r || (r = this.precomputeWindow(o), a && o !== 1 && (r = e.normalizeZ(r), wb.set(a, r)));
      let n = e.ZERO, s = e.BASE, l = 1 + (lm ? 128 / o : 256 / o), i = 2 ** (o - 1), u = BigInt(2 ** o - 1), c = 2 ** o, d = BigInt(o);
      for (let f = 0; f < l; f++) {
        let p = f * i, x = Number(t & u);
        t >>= d, x > i && (x -= c, t += St);
        let S = p, v = p + Math.abs(x) - 1, g = f % 2 !== 0, m = x < 0;
        x === 0 ? s = s.add(im(g, r[S])) : n = n.add(im(m, r[v]));
      }
      return { p: n, f: s };
    }
    multiply(t, a) {
      let o = SE(t), r, n;
      if (lm) {
        let { k1neg: s, k1: l, k2neg: i, k2: u } = sm.splitScalar(o), { p: c, f: d } = this.wNAF(l, a), { p: f, f: p } = this.wNAF(u, a);
        c = im(s, c), f = im(i, f), f = new e(Z(f.x * sm.beta), f.y, f.z), r = c.add(f), n = d.add(p);
      } else {
        let { p: s, f: l } = this.wNAF(o, a);
        r = s, n = l;
      }
      return e.normalizeZ([r, n])[0];
    }
    toAffine(t) {
      let { x: a, y: o, z: r } = this, n = this.equals(e.ZERO);
      t == null && (t = n ? fE : dm(r));
      let s = t, l = Z(s * s), i = Z(l * s), u = Z(a * l), c = Z(o * i), d = Z(r * s);
      if (n) return wa.ZERO;
      if (d !== St) throw new Error("invZ was invalid");
      return new wa(u, c);
    }
  };
  va.BASE = new va(Yt.Gx, Yt.Gy, St);
  va.ZERO = new va(Ve, St, Ve);
  function im(e, t) {
    let a = t.negate();
    return e ? a : t;
  }
  var wb = /* @__PURE__ */ new WeakMap(), wa = class e {
    constructor(t, a) {
      this.x = t, this.y = a;
    }
    _setWindowSize(t) {
      this._WINDOW_SIZE = t, wb.delete(this);
    }
    hasEvenY() {
      return this.y % kn === Ve;
    }
    static fromCompressedHex(t) {
      let a = t.length === 32, o = Rs(a ? t : t.subarray(1));
      if (!Cb(o)) throw new Error("Point is not on curve");
      let r = hE(o), n = A3(r), s = (n & St) === St;
      a ? s && (n = Z(-n)) : (t[0] & 1) === 1 !== s && (n = Z(-n));
      let l = new e(o, n);
      return l.assertValidity(), l;
    }
    static fromUncompressedHex(t) {
      let a = Rs(t.subarray(1, si + 1)), o = Rs(t.subarray(si + 1, si * 2 + 1)), r = new e(a, o);
      return r.assertValidity(), r;
    }
    static fromHex(t) {
      let a = Ib(t), o = a.length, r = a[0];
      if (o === si) return this.fromCompressedHex(a);
      if (o === pE && (r === 2 || r === 3)) return this.fromCompressedHex(a);
      if (o === mE && r === 4) return this.fromUncompressedHex(a);
      throw new Error(`Point.fromHex: received invalid point. Expected 32-${pE} compressed bytes or ${mE} uncompressed bytes, not ${o}`);
    }
    static fromPrivateKey(t) {
      return e.BASE.multiply(Eb(t));
    }
    static fromSignature(t, a, o) {
      let { r, s: n } = M3(a);
      if (![0, 1, 2, 3].includes(o)) throw new Error("Cannot recover: invalid recovery bit");
      let s = R3(Ib(t)), { n: l } = Yt, i = o === 2 || o === 3 ? r + l : r, u = dm(i, l), c = Z(-s * u, l), d = Z(n * u, l), f = o & 1 ? "03" : "02", p = e.fromHex(f + ii(i)), x = e.BASE.multiplyAndAddUnsafe(p, c, d);
      if (!x) throw new Error("Cannot recover signature: point at infinify");
      return x.assertValidity(), x;
    }
    toRawBytes(t = false) {
      return ks(this.toHex(t));
    }
    toHex(t = false) {
      let a = ii(this.x);
      return t ? `${this.hasEvenY() ? "02" : "03"}${a}` : `04${a}${ii(this.y)}`;
    }
    toHexX() {
      return this.toHex(true).slice(2);
    }
    toRawX() {
      return this.toRawBytes(true).slice(1);
    }
    assertValidity() {
      let t = "Point is not on elliptic curve", { x: a, y: o } = this;
      if (!Cb(a) || !Cb(o)) throw new Error(t);
      let r = Z(o * o), n = hE(a);
      if (Z(r - n) !== Ve) throw new Error(t);
    }
    equals(t) {
      return this.x === t.x && this.y === t.y;
    }
    negate() {
      return new e(this.x, Z(-this.y));
    }
    double() {
      return va.fromAffine(this).double().toAffine();
    }
    add(t) {
      return va.fromAffine(this).add(va.fromAffine(t)).toAffine();
    }
    subtract(t) {
      return this.add(t.negate());
    }
    multiply(t) {
      return va.fromAffine(this).multiply(t, this).toAffine();
    }
    multiplyAndAddUnsafe(t, a, o) {
      let r = va.fromAffine(this), n = a === Ve || a === St || this !== e.BASE ? r.multiplyUnsafe(a) : r.multiply(a), s = va.fromAffine(t).multiplyUnsafe(o), l = n.add(s);
      return l.equals(va.ZERO) ? void 0 : l.toAffine();
    }
  };
  wa.BASE = new wa(Yt.Gx, Yt.Gy);
  wa.ZERO = new wa(Ve, Ve);
  function xE(e) {
    return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
  }
  function bE(e) {
    if (e.length < 2 || e[0] !== 2) throw new Error(`Invalid signature integer tag: ${ci(e)}`);
    let t = e[1], a = e.subarray(2, t + 2);
    if (!t || a.length !== t) throw new Error("Invalid signature integer: wrong length");
    if (a[0] === 0 && a[1] <= 127) throw new Error("Invalid signature integer: trailing length");
    return { data: Rs(a), left: e.subarray(t + 2) };
  }
  function w3(e) {
    if (e.length < 2 || e[0] != 48) throw new Error(`Invalid signature tag: ${ci(e)}`);
    if (e[1] !== e.length - 2) throw new Error("Invalid signature: incorrect length");
    let { data: t, left: a } = bE(e.subarray(2)), { data: o, left: r } = bE(a);
    if (r.length) throw new Error(`Invalid signature: left bytes after parsing: ${ci(r)}`);
    return { r: t, s: o };
  }
  var Hc = class e {
    constructor(t, a) {
      this.r = t, this.s = a, this.assertValidity();
    }
    static fromCompact(t) {
      let a = t instanceof Uint8Array, o = "Signature.fromCompact";
      if (typeof t != "string" && !a) throw new TypeError(`${o}: Expected string or Uint8Array`);
      let r = a ? ci(t) : t;
      if (r.length !== 128) throw new Error(`${o}: Expected 64-byte hex`);
      return new e(cm(r.slice(0, 64)), cm(r.slice(64, 128)));
    }
    static fromDER(t) {
      let a = t instanceof Uint8Array;
      if (typeof t != "string" && !a) throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
      let { r: o, s: r } = w3(a ? t : ks(t));
      return new e(o, r);
    }
    static fromHex(t) {
      return this.fromDER(t);
    }
    assertValidity() {
      let { r: t, s: a } = this;
      if (!fm(t)) throw new Error("Invalid Signature: r must be 0 < r < n");
      if (!fm(a)) throw new Error("Invalid Signature: s must be 0 < s < n");
    }
    hasHighS() {
      let t = Yt.n >> St;
      return this.s > t;
    }
    normalizeS() {
      return this.hasHighS() ? new e(this.r, Z(-this.s, Yt.n)) : this;
    }
    toDERRawBytes() {
      return ks(this.toDERHex());
    }
    toDERHex() {
      let t = xE(Nc(this.s)), a = xE(Nc(this.r)), o = t.length / 2, r = a.length / 2, n = Nc(o), s = Nc(r);
      return `30${Nc(r + o + 4)}02${s}${a}02${n}${t}`;
    }
    toRawBytes() {
      return this.toDERRawBytes();
    }
    toHex() {
      return this.toDERHex();
    }
    toCompactRawBytes() {
      return ks(this.toCompactHex());
    }
    toCompactHex() {
      return ii(this.r) + ii(this.s);
    }
  };
  function Pc(...e) {
    if (!e.every((o) => o instanceof Uint8Array)) throw new Error("Uint8Array list expected");
    if (e.length === 1) return e[0];
    let t = e.reduce((o, r) => o + r.length, 0), a = new Uint8Array(t);
    for (let o = 0, r = 0; o < e.length; o++) {
      let n = e[o];
      a.set(n, r), r += n.length;
    }
    return a;
  }
  var I3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
  function ci(e) {
    if (!(e instanceof Uint8Array)) throw new Error("Expected Uint8Array");
    let t = "";
    for (let a = 0; a < e.length; a++) t += I3[e[a]];
    return t;
  }
  var E3 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
  function ii(e) {
    if (typeof e != "bigint") throw new Error("Expected bigint");
    if (!(Ve <= e && e < E3)) throw new Error("Expected number 0 <= n < 2^256");
    return e.toString(16).padStart(64, "0");
  }
  function yE(e) {
    let t = ks(ii(e));
    if (t.length !== 32) throw new Error("Error: expected 32 bytes");
    return t;
  }
  function Nc(e) {
    let t = e.toString(16);
    return t.length & 1 ? `0${t}` : t;
  }
  function cm(e) {
    if (typeof e != "string") throw new TypeError("hexToNumber: expected string, got " + typeof e);
    return BigInt(`0x${e}`);
  }
  function ks(e) {
    if (typeof e != "string") throw new TypeError("hexToBytes: expected string, got " + typeof e);
    if (e.length % 2) throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
    let t = new Uint8Array(e.length / 2);
    for (let a = 0; a < t.length; a++) {
      let o = a * 2, r = e.slice(o, o + 2), n = Number.parseInt(r, 16);
      if (Number.isNaN(n) || n < 0) throw new Error("Invalid byte sequence");
      t[a] = n;
    }
    return t;
  }
  function Rs(e) {
    return cm(ci(e));
  }
  function Ib(e) {
    return e instanceof Uint8Array ? Uint8Array.from(e) : ks(e);
  }
  function SE(e) {
    if (typeof e == "number" && Number.isSafeInteger(e) && e > 0) return BigInt(e);
    if (typeof e == "bigint" && fm(e)) return e;
    throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
  }
  function Z(e, t = Yt.P) {
    let a = e % t;
    return a >= Ve ? a : t + a;
  }
  function bo(e, t) {
    let { P: a } = Yt, o = e;
    for (; t-- > Ve; ) o *= o, o %= a;
    return o;
  }
  function A3(e) {
    let { P: t } = Yt, a = BigInt(6), o = BigInt(11), r = BigInt(22), n = BigInt(23), s = BigInt(44), l = BigInt(88), i = e * e * e % t, u = i * i * e % t, c = bo(u, Uc) * u % t, d = bo(c, Uc) * u % t, f = bo(d, kn) * i % t, p = bo(f, o) * f % t, x = bo(p, r) * p % t, S = bo(x, s) * x % t, v = bo(S, l) * S % t, g = bo(v, s) * x % t, m = bo(g, Uc) * u % t, b = bo(m, n) * p % t, y = bo(b, a) * i % t, C = bo(y, kn);
    if (C * C % t !== e) throw new Error("Cannot find square root");
    return C;
  }
  function dm(e, t = Yt.P) {
    if (e === Ve || t <= Ve) throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
    let a = Z(e, t), o = t, r = Ve, n = St, s = St, l = Ve;
    for (; a !== Ve; ) {
      let u = o / a, c = o % a, d = r - s * u, f = n - l * u;
      o = a, a = c, r = s, n = l, s = d, l = f;
    }
    if (o !== St) throw new Error("invert: does not exist");
    return Z(r, t);
  }
  function T3(e, t = Yt.P) {
    let a = new Array(e.length), o = e.reduce((n, s, l) => s === Ve ? n : (a[l] = n, Z(n * s, t)), St), r = dm(o, t);
    return e.reduceRight((n, s, l) => s === Ve ? n : (a[l] = Z(n * a[l], t), Z(n * s, t)), r), a;
  }
  function k3(e) {
    let t = e.length * 8 - zc * 8, a = Rs(e);
    return t > 0 ? a >> BigInt(t) : a;
  }
  function R3(e, t = false) {
    let a = k3(e);
    if (t) return a;
    let { n: o } = Yt;
    return a >= o ? a - o : a;
  }
  var ui, Lb;
  function fm(e) {
    return Ve < e && e < Yt.n;
  }
  function Cb(e) {
    return Ve < e && e < Yt.P;
  }
  function Eb(e) {
    let t;
    if (typeof e == "bigint") t = e;
    else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0) t = BigInt(e);
    else if (typeof e == "string") {
      if (e.length !== 2 * zc) throw new Error("Expected 32 bytes of private key");
      t = cm(e);
    } else if (e instanceof Uint8Array) {
      if (e.length !== zc) throw new Error("Expected 32 bytes of private key");
      t = Rs(e);
    } else throw new TypeError("Expected valid private key");
    if (!fm(t)) throw new Error("Expected private key: 0 < key < n");
    return t;
  }
  function M3(e) {
    if (e instanceof Hc) return e.assertValidity(), e;
    try {
      return Hc.fromDER(e);
    } catch {
      return Hc.fromCompact(e);
    }
  }
  wa.BASE._setWindowSize(8);
  var ao = { node: v3, web: typeof self == "object" && "crypto" in self ? self.crypto : void 0 };
  var um = {}, li = { bytesToHex: ci, hexToBytes: ks, concatBytes: Pc, mod: Z, invert: dm, isValidPrivateKey(e) {
    try {
      return Eb(e), true;
    } catch {
      return false;
    }
  }, _bigintTo32Bytes: yE, _normalizePrivateKey: Eb, hashToPrivateKey: (e) => {
    e = Ib(e);
    let t = zc + 8;
    if (e.length < t || e.length > 1024) throw new Error("Expected valid bytes of private key as per FIPS 186");
    let a = Z(Rs(e), Yt.n - St) + St;
    return yE(a);
  }, randomBytes: (e = 32) => {
    if (ao.web) return ao.web.getRandomValues(new Uint8Array(e));
    if (ao.node) {
      let { randomBytes: t } = ao.node;
      return Uint8Array.from(t(e));
    } else throw new Error("The environment doesn't have randomBytes function");
  }, randomPrivateKey: () => li.hashToPrivateKey(li.randomBytes(zc + 8)), precompute(e = 8, t = wa.BASE) {
    let a = t === wa.BASE ? t : new wa(t.x, t.y);
    return a._setWindowSize(e), a.multiply(Uc), a;
  }, sha256: async (...e) => {
    if (ao.web) {
      let t = await ao.web.subtle.digest("SHA-256", Pc(...e));
      return new Uint8Array(t);
    } else if (ao.node) {
      let { createHash: t } = ao.node, a = t("sha256");
      return e.forEach((o) => a.update(o)), Uint8Array.from(a.digest());
    } else throw new Error("The environment doesn't have sha256 function");
  }, hmacSha256: async (e, ...t) => {
    if (ao.web) {
      let a = await ao.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), o = Pc(...t), r = await ao.web.subtle.sign("HMAC", a, o);
      return new Uint8Array(r);
    } else if (ao.node) {
      let { createHmac: a } = ao.node, o = a("sha256", e);
      return t.forEach((r) => o.update(r)), Uint8Array.from(o.digest());
    } else throw new Error("The environment doesn't have hmac-sha256 function");
  }, sha256Sync: void 0, hmacSha256Sync: void 0, taggedHash: async (e, ...t) => {
    let a = um[e];
    if (a === void 0) {
      let o = await li.sha256(Uint8Array.from(e, (r) => r.charCodeAt(0)));
      a = Pc(o, o), um[e] = a;
    }
    return li.sha256(a, ...t);
  }, taggedHashSync: (e, ...t) => {
    if (typeof ui != "function") throw new vb("sha256Sync is undefined, you need to set it");
    let a = um[e];
    if (a === void 0) {
      let o = ui(Uint8Array.from(e, (r) => r.charCodeAt(0)));
      a = Pc(o, o), um[e] = a;
    }
    return ui(a, ...t);
  }, _JacobianPoint: va };
  Object.defineProperties(li, { sha256Sync: { configurable: false, get() {
    return ui;
  }, set(e) {
    ui || (ui = e);
  } }, hmacSha256Sync: { configurable: false, get() {
    return Lb;
  }, set(e) {
    Lb || (Lb = e);
  } } });
  var uP = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), KE = Uint8Array.from({ length: 16 }, (e, t) => t), cP = KE.map((e) => (9 * e + 5) % 16), Ub = [KE], Hb = [cP];
  for (let e = 0; e < 4; e++) for (let t of [Ub, Hb]) t.push(t[e].map((a) => uP[a]));
  var YE = [[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8], [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7], [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9], [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6], [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]].map((e) => new Uint8Array(e)), fP = Ub.map((e, t) => e.map((a) => YE[t][a])), dP = Hb.map((e, t) => e.map((a) => YE[t][a])), pP = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mP = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Sm = (e, t) => e << t | e >>> 32 - t;
  function XE(e, t, a, o) {
    return e === 0 ? t ^ a ^ o : e === 1 ? t & a | ~t & o : e === 2 ? (t | ~a) ^ o : e === 3 ? t & o | a & ~o : t ^ (a | ~o);
  }
  var Lm = new Uint32Array(16), Nb = class extends En {
    constructor() {
      super(64, 20, 8, true), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
    }
    get() {
      let { h0: t, h1: a, h2: o, h3: r, h4: n } = this;
      return [t, a, o, r, n];
    }
    set(t, a, o, r, n) {
      this.h0 = t | 0, this.h1 = a | 0, this.h2 = o | 0, this.h3 = r | 0, this.h4 = n | 0;
    }
    process(t, a) {
      for (let p = 0; p < 16; p++, a += 4) Lm[p] = t.getUint32(a, true);
      let o = this.h0 | 0, r = o, n = this.h1 | 0, s = n, l = this.h2 | 0, i = l, u = this.h3 | 0, c = u, d = this.h4 | 0, f = d;
      for (let p = 0; p < 5; p++) {
        let x = 4 - p, S = pP[p], v = mP[p], g = Ub[p], m = Hb[p], b = fP[p], y = dP[p];
        for (let C = 0; C < 16; C++) {
          let D = Sm(o + XE(p, n, l, u) + Lm[g[C]] + S, b[C]) + d | 0;
          o = d, d = u, u = Sm(l, 10) | 0, l = n, n = D;
        }
        for (let C = 0; C < 16; C++) {
          let D = Sm(r + XE(x, s, i, c) + Lm[m[C]] + v, y[C]) + f | 0;
          r = f, f = c, c = Sm(i, 10) | 0, i = s, s = D;
        }
      }
      this.set(this.h1 + l + c | 0, this.h2 + u + f | 0, this.h3 + d + r | 0, this.h4 + o + s | 0, this.h0 + n + i | 0);
    }
    roundClean() {
      Lm.fill(0);
    }
    destroy() {
      this.destroyed = true, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
    }
  }, hP = Xo(() => new Nb());
  var Cm = BigInt(4294967295), zb = BigInt(32);
  function ZE(e, t = false) {
    return t ? { h: Number(e & Cm), l: Number(e >> zb & Cm) } : { h: Number(e >> zb & Cm) | 0, l: Number(e & Cm) | 0 };
  }
  function gP(e, t = false) {
    let a = new Uint32Array(e.length), o = new Uint32Array(e.length);
    for (let r = 0; r < e.length; r++) {
      let { h: n, l: s } = ZE(e[r], t);
      [a[r], o[r]] = [n, s];
    }
    return [a, o];
  }
  var xP = (e, t) => BigInt(e >>> 0) << zb | BigInt(t >>> 0), bP = (e, t, a) => e >>> a, yP = (e, t, a) => e << 32 - a | t >>> a, SP = (e, t, a) => e >>> a | t << 32 - a, LP = (e, t, a) => e << 32 - a | t >>> a, CP = (e, t, a) => e << 64 - a | t >>> a - 32, vP = (e, t, a) => e >>> a - 32 | t << 64 - a, wP = (e, t) => t, IP = (e, t) => e, EP = (e, t, a) => e << a | t >>> 32 - a, AP = (e, t, a) => t << a | e >>> 32 - a, TP = (e, t, a) => t << a - 32 | e >>> 64 - a, kP = (e, t, a) => e << a - 32 | t >>> 64 - a;
  function RP(e, t, a, o) {
    let r = (t >>> 0) + (o >>> 0);
    return { h: e + a + (r / 2 ** 32 | 0) | 0, l: r | 0 };
  }
  var MP = (e, t, a) => (e >>> 0) + (t >>> 0) + (a >>> 0), DP = (e, t, a, o) => t + a + o + (e / 2 ** 32 | 0) | 0, OP = (e, t, a, o) => (e >>> 0) + (t >>> 0) + (a >>> 0) + (o >>> 0), BP = (e, t, a, o, r) => t + a + o + r + (e / 2 ** 32 | 0) | 0, _P = (e, t, a, o, r) => (e >>> 0) + (t >>> 0) + (a >>> 0) + (o >>> 0) + (r >>> 0), PP = (e, t, a, o, r, n) => t + a + o + r + n + (e / 2 ** 32 | 0) | 0, NP = { fromBig: ZE, split: gP, toBig: xP, shrSH: bP, shrSL: yP, rotrSH: SP, rotrSL: LP, rotrBH: CP, rotrBL: vP, rotr32H: wP, rotr32L: IP, rotlSH: EP, rotlSL: AP, rotlBH: TP, rotlBL: kP, add: RP, add3L: MP, add3H: DP, add4L: OP, add4H: BP, add5H: PP, add5L: _P }, Ce = NP;
  var [UP, HP] = Ce.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((e) => BigInt(e))), Dn = new Uint32Array(80), On = new Uint32Array(80), gi = class extends En {
    constructor() {
      super(128, 64, 16, false), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
    }
    get() {
      let { Ah: t, Al: a, Bh: o, Bl: r, Ch: n, Cl: s, Dh: l, Dl: i, Eh: u, El: c, Fh: d, Fl: f, Gh: p, Gl: x, Hh: S, Hl: v } = this;
      return [t, a, o, r, n, s, l, i, u, c, d, f, p, x, S, v];
    }
    set(t, a, o, r, n, s, l, i, u, c, d, f, p, x, S, v) {
      this.Ah = t | 0, this.Al = a | 0, this.Bh = o | 0, this.Bl = r | 0, this.Ch = n | 0, this.Cl = s | 0, this.Dh = l | 0, this.Dl = i | 0, this.Eh = u | 0, this.El = c | 0, this.Fh = d | 0, this.Fl = f | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = v | 0;
    }
    process(t, a) {
      for (let b = 0; b < 16; b++, a += 4) Dn[b] = t.getUint32(a), On[b] = t.getUint32(a += 4);
      for (let b = 16; b < 80; b++) {
        let y = Dn[b - 15] | 0, C = On[b - 15] | 0, D = Ce.rotrSH(y, C, 1) ^ Ce.rotrSH(y, C, 8) ^ Ce.shrSH(y, C, 7), I = Ce.rotrSL(y, C, 1) ^ Ce.rotrSL(y, C, 8) ^ Ce.shrSL(y, C, 7), w = Dn[b - 2] | 0, M = On[b - 2] | 0, T = Ce.rotrSH(w, M, 19) ^ Ce.rotrBH(w, M, 61) ^ Ce.shrSH(w, M, 6), K = Ce.rotrSL(w, M, 19) ^ Ce.rotrBL(w, M, 61) ^ Ce.shrSL(w, M, 6), z = Ce.add4L(I, K, On[b - 7], On[b - 16]), Y = Ce.add4H(z, D, T, Dn[b - 7], Dn[b - 16]);
        Dn[b] = Y | 0, On[b] = z | 0;
      }
      let { Ah: o, Al: r, Bh: n, Bl: s, Ch: l, Cl: i, Dh: u, Dl: c, Eh: d, El: f, Fh: p, Fl: x, Gh: S, Gl: v, Hh: g, Hl: m } = this;
      for (let b = 0; b < 80; b++) {
        let y = Ce.rotrSH(d, f, 14) ^ Ce.rotrSH(d, f, 18) ^ Ce.rotrBH(d, f, 41), C = Ce.rotrSL(d, f, 14) ^ Ce.rotrSL(d, f, 18) ^ Ce.rotrBL(d, f, 41), D = d & p ^ ~d & S, I = f & x ^ ~f & v, w = Ce.add5L(m, C, I, HP[b], On[b]), M = Ce.add5H(w, g, y, D, UP[b], Dn[b]), T = w | 0, K = Ce.rotrSH(o, r, 28) ^ Ce.rotrBH(o, r, 34) ^ Ce.rotrBH(o, r, 39), z = Ce.rotrSL(o, r, 28) ^ Ce.rotrBL(o, r, 34) ^ Ce.rotrBL(o, r, 39), Y = o & n ^ o & l ^ n & l, ce = r & s ^ r & i ^ s & i;
        g = S | 0, m = v | 0, S = p | 0, v = x | 0, p = d | 0, x = f | 0, { h: d, l: f } = Ce.add(u | 0, c | 0, M | 0, T | 0), u = l | 0, c = i | 0, l = n | 0, i = s | 0, n = o | 0, s = r | 0;
        let Le = Ce.add3L(T, z, ce);
        o = Ce.add3H(Le, M, K, Y), r = Le | 0;
      }
      ({ h: o, l: r } = Ce.add(this.Ah | 0, this.Al | 0, o | 0, r | 0)), { h: n, l: s } = Ce.add(this.Bh | 0, this.Bl | 0, n | 0, s | 0), { h: l, l: i } = Ce.add(this.Ch | 0, this.Cl | 0, l | 0, i | 0), { h: u, l: c } = Ce.add(this.Dh | 0, this.Dl | 0, u | 0, c | 0), { h: d, l: f } = Ce.add(this.Eh | 0, this.El | 0, d | 0, f | 0), { h: p, l: x } = Ce.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: v } = Ce.add(this.Gh | 0, this.Gl | 0, S | 0, v | 0), { h: g, l: m } = Ce.add(this.Hh | 0, this.Hl | 0, g | 0, m | 0), this.set(o, r, n, s, l, i, u, c, d, f, p, x, S, v, g, m);
    }
    roundClean() {
      Dn.fill(0), On.fill(0);
    }
    destroy() {
      this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }, qb = class extends gi {
    constructor() {
      super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
    }
  }, Fb = class extends gi {
    constructor() {
      super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
    }
  }, Vb = class extends gi {
    constructor() {
      super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
    }
  }, Aj = Xo(() => new gi()), Tj = Xo(() => new qb()), zP = Xo(() => new Fb()), kj = Xo(() => new Vb());
  var JA = _(ym()), F8 = _(NA());
  var P;
  (function(e) {
    e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
  })(P || (P = {}));
  var Ht;
  (function(e) {
    e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
  })(Ht || (Ht = {}));
  function Mm(e) {
    return Ht[e];
  }
  function Ci(e, t = false) {
    switch (e.type) {
      case P.BoolTrue:
        return true;
      case P.BoolFalse:
        return false;
      case P.Int:
      case P.UInt:
        return t ? e.value.toString() : e.value;
      case P.Buffer:
        return `0x${e.value}`;
      case P.OptionalNone:
        return null;
      case P.OptionalSome:
        return Li(e.value);
      case P.ResponseErr:
        return Li(e.value);
      case P.ResponseOk:
        return Li(e.value);
      case P.PrincipalStandard:
      case P.PrincipalContract:
        return e.value;
      case P.List:
        return e.value.map((o) => Li(o));
      case P.Tuple:
        let a = {};
        return Object.keys(e.value).forEach((o) => {
          a[o] = Li(e.value[o]);
        }), a;
      case P.StringASCII:
        return e.value;
      case P.StringUTF8:
        return e.value;
    }
  }
  function Li(e) {
    switch (e.type) {
      case P.ResponseErr:
        return { type: kr(e), value: Ci(e, true), success: false };
      case P.ResponseOk:
        return { type: kr(e), value: Ci(e, true), success: true };
      default:
        return { type: kr(e), value: Ci(e, true) };
    }
  }
  function kr(e) {
    switch (e.type) {
      case P.BoolTrue:
      case P.BoolFalse:
        return "bool";
      case P.Int:
        return "int";
      case P.UInt:
        return "uint";
      case P.Buffer:
        return `(buff ${Math.ceil(e.value.length / 2)})`;
      case P.OptionalNone:
        return "(optional none)";
      case P.OptionalSome:
        return `(optional ${kr(e.value)})`;
      case P.ResponseErr:
        return `(response UnknownType ${kr(e.value)})`;
      case P.ResponseOk:
        return `(response ${kr(e.value)} UnknownType)`;
      case P.PrincipalStandard:
      case P.PrincipalContract:
        return "principal";
      case P.List:
        return `(list ${e.value.length} ${e.value.length ? kr(e.value[0]) : "UnknownType"})`;
      case P.Tuple:
        return `(tuple ${Object.keys(e.value).map((t) => `(${t} ${kr(e.value[t])})`).join(" ")})`;
      case P.StringASCII:
        return `(string-ascii ${ai(e.value).length})`;
      case P.StringUTF8:
        return `(string-utf8 ${to(e.value).length})`;
    }
  }
  var ry = () => ({ type: P.BoolTrue }), ny = () => ({ type: P.BoolFalse }), UA = (e) => e ? ry() : ny();
  var _s = (e) => {
    if (e.byteLength > 1048576) throw new Error("Cannot construct clarity buffer that is greater than 1MB");
    return { type: P.Buffer, value: za(e) };
  };
  var HA = BigInt("0xffffffffffffffffffffffffffffffff"), m8 = BigInt(0), zA = BigInt("0x7fffffffffffffffffffffffffffffff"), qA = BigInt("-170141183460469231731687303715884105728"), Dm = (e) => {
    typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = Bc(ma(e))), oi(e, Uint8Array) && (e = Bc(e));
    let t = Oc(e);
    if (t > zA) throw new RangeError(`Cannot construct clarity integer from value greater than ${zA}`);
    if (t < qA) throw new RangeError(`Cannot construct clarity integer form value less than ${qA}`);
    return { type: P.Int, value: t };
  }, Om = (e) => {
    let t = Oc(e);
    if (t < m8) throw new RangeError("Cannot construct unsigned clarity integer from negative value");
    if (t > HA) throw new RangeError(`Cannot construct unsigned clarity integer greater than ${HA}`);
    return { type: P.UInt, value: t };
  };
  function Bm(e) {
    return { type: P.List, value: e };
  }
  function _m() {
    return { type: P.OptionalNone };
  }
  function Pm(e) {
    return { type: P.OptionalSome, value: e };
  }
  var FA = _(ym());
  var Ps;
  (function(e) {
    e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
  })(Ps || (Ps = {}));
  function Ns(e, t, a) {
    let o = t || 1, r = a || lE;
    if (VA(e, r)) throw new Error(`String length exceeds maximum bytes ${r}`);
    return { type: Ps.LengthPrefixedString, content: e, lengthPrefixBytes: o, maxLengthBytes: r };
  }
  function vi(e) {
    let t = (0, FA.c32addressDecode)(e);
    return { type: Ps.Address, version: t[0], hash160: t[1] };
  }
  var GA = _(ym());
  function sy(e) {
    let t = [];
    return t.push(ma($p(e.version, 1))), t.push(ma(e.hash160)), Er(t);
  }
  function ly(e) {
    let t = oi(e, jo) ? e : new jo(e), a = fb(za(t.readBytes(1))), o = za(t.readBytes(20));
    return { type: Ps.Address, version: a, hash160: o };
  }
  function iy(e) {
    let t = [], a = to(e.content), o = a.byteLength;
    return t.push(ma($p(o, e.lengthPrefixBytes))), t.push(a), Er(t);
  }
  function uy(e, t, a) {
    t = t || 1;
    let o = oi(e, jo) ? e : new jo(e), r = fb(za(o.readBytes(t))), n = Jp(o.readBytes(r));
    return Ns(n, t, a ?? 128);
  }
  function Nm(e) {
    return (0, GA.c32address)(e.version, e.hash160);
  }
  function cy(e) {
    let t = vi(e);
    return { type: P.PrincipalStandard, value: Nm(t) };
  }
  function jA(e) {
    return { type: P.PrincipalStandard, value: Nm(e) };
  }
  function fy(e, t) {
    let a = vi(e), o = Ns(t);
    return dy(a, o);
  }
  function dy(e, t) {
    if (to(t.content).byteLength >= 128) throw new Error("Contract name must be less than 128 bytes");
    return { type: P.PrincipalContract, value: `${Nm(e)}.${t.content}` };
  }
  function Um(e) {
    return { type: P.ResponseErr, value: e };
  }
  function Hm(e) {
    return { type: P.ResponseOk, value: e };
  }
  var zm = (e) => ({ type: P.StringASCII, value: e }), qm = (e) => ({ type: P.StringUTF8, value: e });
  function Fm(e) {
    for (let t in e) if (!XA(t)) throw new Error(`"${t}" is not a valid Clarity name`);
    return { type: P.Tuple, value: e };
  }
  function Rr(e) {
    let t;
    if (typeof e == "string") {
      let o = e.slice(0, 2).toLowerCase() === "0x";
      t = new jo(ma(o ? e.slice(2) : e));
    } else e instanceof Uint8Array ? t = new jo(e) : t = e;
    switch (t.readUInt8Enum(Ht, (o) => {
      throw new ni(`Cannot recognize Clarity Type: ${o}`);
    })) {
      case Ht.int:
        return Dm(Bc(t.readBytes(16)));
      case Ht.uint:
        return Om(t.readBytes(16));
      case Ht.buffer:
        let o = t.readUInt32BE();
        return _s(t.readBytes(o));
      case Ht.true:
        return ry();
      case Ht.false:
        return ny();
      case Ht.address:
        let r = ly(t);
        return jA(r);
      case Ht.contract:
        let n = ly(t), s = uy(t);
        return dy(n, s);
      case Ht.ok:
        return Hm(Rr(t));
      case Ht.err:
        return Um(Rr(t));
      case Ht.none:
        return _m();
      case Ht.some:
        return Pm(Rr(t));
      case Ht.list:
        let l = t.readUInt32BE(), i = [];
        for (let S = 0; S < l; S++) i.push(Rr(t));
        return Bm(i);
      case Ht.tuple:
        let u = t.readUInt32BE(), c = {};
        for (let S = 0; S < u; S++) {
          let v = uy(t).content;
          if (v === void 0) throw new ni('"content" is undefined');
          c[v] = Rr(t);
        }
        return Fm(c);
      case Ht.ascii:
        let d = t.readUInt32BE(), f = pb(t.readBytes(d));
        return zm(f);
      case Ht.utf8:
        let p = t.readUInt32BE(), x = Jp(t.readBytes(p));
        return qm(x);
      default:
        throw new ni("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
    }
  }
  function Ko(e, t) {
    return Er([Mm(e), t]);
  }
  function h8(e) {
    return new Uint8Array([Mm(e.type)]);
  }
  function g8(e) {
    return e.type === P.OptionalNone ? new Uint8Array([Mm(e.type)]) : Ko(e.type, Yc(e.value));
  }
  function x8(e) {
    let t = new Uint8Array(4);
    return ri(t, Math.ceil(e.value.length / 2), 0), Ko(e.type, _c(t, ma(e.value)));
  }
  function b8(e) {
    let t = db(V2(BigInt(e.value), BigInt(iE)), xb);
    return Ko(e.type, t);
  }
  function y8(e) {
    let t = db(BigInt(e.value), xb);
    return Ko(e.type, t);
  }
  function S8(e) {
    return Ko(e.type, sy(vi(e.value)));
  }
  function L8(e) {
    let [t, a] = YA(e.value);
    return Ko(e.type, _c(sy(vi(t)), iy(Ns(a))));
  }
  function C8(e) {
    return Ko(e.type, Yc(e.value));
  }
  function v8(e) {
    let t = [], a = new Uint8Array(4);
    ri(a, e.value.length, 0), t.push(a);
    for (let o of e.value) {
      let r = Yc(o);
      t.push(r);
    }
    return Ko(e.type, Er(t));
  }
  function w8(e) {
    let t = [], a = new Uint8Array(4);
    ri(a, Object.keys(e.value).length, 0), t.push(a);
    let o = Object.keys(e.value).sort((r, n) => r.localeCompare(n));
    for (let r of o) {
      let n = Ns(r);
      t.push(iy(n));
      let s = Yc(e.value[r]);
      t.push(s);
    }
    return Ko(e.type, Er(t));
  }
  function KA(e, t) {
    let a = [], o = t == "ascii" ? ai(e.value) : to(e.value), r = new Uint8Array(4);
    return ri(r, o.length, 0), a.push(r), a.push(o), Ko(e.type, Er(a));
  }
  function I8(e) {
    return KA(e, "ascii");
  }
  function E8(e) {
    return KA(e, "utf8");
  }
  function Us(e) {
    return za(Yc(e));
  }
  function Yc(e) {
    switch (e.type) {
      case P.BoolTrue:
      case P.BoolFalse:
        return h8(e);
      case P.OptionalNone:
      case P.OptionalSome:
        return g8(e);
      case P.Buffer:
        return x8(e);
      case P.UInt:
        return y8(e);
      case P.Int:
        return b8(e);
      case P.PrincipalStandard:
        return S8(e);
      case P.PrincipalContract:
        return L8(e);
      case P.ResponseOk:
      case P.ResponseErr:
        return C8(e);
      case P.List:
        return v8(e);
      case P.Tuple:
        return w8(e);
      case P.StringASCII:
        return I8(e);
      case P.StringUTF8:
        return E8(e);
      default:
        throw new tm("Unable to serialize. Invalid Clarity Value.");
    }
  }
  function Ge(e, t) {
    return (a) => {
      let o = a.match(e);
      return !o || o.index !== 0 ? { success: false } : { success: true, value: o[0], rest: a.substring(o[0].length), capture: t ? t(o[0]) : void 0 };
    };
  }
  function So() {
    return Ge(/\s+/);
  }
  function A8(e) {
    return (t) => e()(t);
  }
  function ZA(e) {
    return (t) => {
      for (let a of e) {
        let o = a(t);
        if (o.success) return o;
      }
      return { success: false };
    };
  }
  function T8(e) {
    return (t) => {
      let a = e(t);
      return !a.success || a.rest ? { success: false } : a;
    };
  }
  function Zc(e) {
    return (t) => {
      let a = e(t);
      return a.success ? a : { success: true, value: "", rest: t };
    };
  }
  function ga(e, t = (a) => a[0]) {
    return (a) => {
      let o = a, r = "", n = [];
      for (let s of e) {
        let l = s(o);
        if (!l.success) return { success: false };
        o = l.rest, r += l.value, l.capture && n.push(l.capture);
      }
      return { success: true, value: r, rest: o, capture: t(n) };
    };
  }
  function WA(e, t = (a) => a[0]) {
    let a = e.flatMap((o, r) => r === 0 ? [o] : [Zc(So()), o]);
    return ga(a, t);
  }
  function wi(e) {
    return WA([Ge(/\(/), e, Ge(/\)/)]);
  }
  function py(e, t, a = (r) => r[r.length - 1], o) {
    return (r) => {
      let n = r, s = "", l = [], i;
      for (i = 0; ; i++) {
        let u = t(n);
        if (!u.success) break;
        if (n = u.rest, s += u.value, u.capture && l.push(u.capture), o) {
          let c = o(n);
          if (!c.success) {
            i++;
            break;
          }
          n = c.rest, s += c.value;
        }
      }
      return i < e ? { success: false } : { success: true, value: s, rest: n, capture: a(l) };
    };
  }
  function Yo(e, t) {
    return (a) => {
      let o = e(a);
      return o.success ? { success: true, value: o.value, rest: o.rest, capture: t ? t(o.value) : o.value } : { success: false };
    };
  }
  function k8() {
    return Yo(Ge(/\-?[0-9]+/), (e) => oe.int(parseInt(e)));
  }
  function R8() {
    return ga([Ge(/u/), Yo(Ge(/[0-9]+/), (e) => oe.uint(parseInt(e)))]);
  }
  function M8() {
    return Yo(Ge(/true|false/), (e) => oe.bool(e === "true"));
  }
  function D8() {
    return ga([Ge(/\'/), Yo(ga([Ge(/[A-Z0-9]+/), Zc(ga([Ge(/\./), Ge(/[a-zA-Z0-9\-]+/)]))]), oe.address)]);
  }
  function O8() {
    return ga([Ge(/0x/), Yo(Ge(/[0-9a-fA-F]+/), oe.bufferFromHex)]);
  }
  function QA(e) {
    try {
      return JSON.parse(`"${e}"`);
    } catch (t) {
      throw new Error(`Failed to unescape string: "${e}" ${t instanceof Error ? t.message : t}`);
    }
  }
  function B8() {
    return ga([Ge(/"/), Yo(Ge(/(\\.|[^"])*/), (e) => oe.stringAscii(QA(e))), Ge(/"/)]);
  }
  function _8() {
    return ga([Ge(/u"/), Yo(Ge(/(\\.|[^"])*/), (e) => oe.stringUtf8(QA(e))), Ge(/"/)]);
  }
  function P8() {
    return wi(ga([Ge(/list/), py(0, ga([So(), Hs()]), (e) => oe.list(e))]));
  }
  function N8() {
    let e = WA([Ge(/\{/), py(1, ga([Yo(Ge(/[a-zA-Z][a-zA-Z0-9_]*/)), Ge(/\s*\:/), So(), Hs()], ([a, o]) => oe.tuple({ [a]: o })), (a) => oe.tuple(Object.assign({}, ...a.map((o) => o.value))), Ge(/\s*\,\s*/)), Ge(/\}/)]), t = wi(ga([Zc(So()), Ge(/tuple/), So(), py(1, wi(ga([Zc(So()), Yo(Ge(/[a-zA-Z][a-zA-Z0-9_]*/)), So(), Hs(), Zc(So())], ([a, o]) => oe.tuple({ [a]: o }))), (a) => oe.tuple(Object.assign({}, ...a.map((o) => o.value))), So())]));
    return ZA([e, t]);
  }
  function U8() {
    return Yo(Ge(/none/), oe.none);
  }
  function H8() {
    return wi(ga([Ge(/some/), So(), Hs()], (e) => oe.some(e[0])));
  }
  function z8() {
    return wi(ga([Ge(/ok/), So(), Hs()], (e) => oe.ok(e[0])));
  }
  function q8() {
    return wi(ga([Ge(/err/), So(), Hs()], (e) => oe.error(e[0])));
  }
  function Hs(e = (t) => t) {
    return ZA([O8, B8, _8, k8, R8, M8, D8, P8, N8, U8, H8, z8, q8].map(A8).map(e));
  }
  function $A(e) {
    let t = Hs(T8)(e);
    if (!t.success || !t.capture) throw "Parse error";
    return t.capture;
  }
  var VA = (e, t) => e ? to(e).length > t : false;
  function XA(e) {
    return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
  }
  function Ii(e) {
    return Rr(e);
  }
  var eT = (e) => {
    try {
      return (0, JA.c32addressDecode)(e), true;
    } catch {
      return false;
    }
  };
  function YA(e) {
    let [t, a] = e.split(".");
    if (!t || !a) throw new Error(`Invalid contract identifier: ${e}`);
    return [t, a];
  }
  var oe = {};
  Qo(oe, { address: () => Z8, bool: () => X8, buffer: () => t5, bufferFromAscii: () => o5, bufferFromHex: () => a5, bufferFromUtf8: () => r5, contractPrincipal: () => W8, deserialize: () => f5, error: () => i5, int: () => K8, list: () => $8, none: () => n5, ok: () => l5, parse: () => $A, prettyPrint: () => aT, principal: () => oT, serialize: () => c5, some: () => s5, standardPrincipal: () => Q8, stringAscii: () => J8, stringUtf8: () => e5, stringify: () => my, tuple: () => u5, uint: () => Y8 });
  function tT(e) {
    return JSON.stringify(e).slice(1, -1);
  }
  function Vm(e, t, a = false) {
    return e ? `
${" ".repeat(e * (t - (a ? 1 : 0)))}` : " ";
  }
  function V8(e, t, a = 1) {
    if (e.value.length === 0) return "(list)";
    let o = Vm(t, a, false), r = t ? Vm(t, a, true) : "", n = e.value.map((s) => Ei(s, t, a)).join(o);
    return `(list${o}${n}${r})`;
  }
  function G8(e, t, a = 1) {
    if (Object.keys(e.value).length === 0) return "{}";
    let o = [];
    for (let [s, l] of Object.entries(e.value)) o.push(`${s}: ${Ei(l, t, a)}`);
    let r = Vm(t, a, false), n = Vm(t, a, true);
    return `{${r}${o.sort().join(`,${r}`)}${n}}`;
  }
  function j8(e) {
    throw new Error(`invalid clarity value type: ${e}`);
  }
  function Ei(e, t = 0, a) {
    if (e.type === P.BoolFalse) return "false";
    if (e.type === P.BoolTrue) return "true";
    if (e.type === P.Int) return e.value.toString();
    if (e.type === P.UInt) return `u${e.value.toString()}`;
    if (e.type === P.StringASCII) return `"${tT(e.value)}"`;
    if (e.type === P.StringUTF8) return `u"${tT(e.value)}"`;
    if (e.type === P.PrincipalContract) return `'${e.value}`;
    if (e.type === P.PrincipalStandard) return `'${e.value}`;
    if (e.type === P.Buffer) return `0x${e.value}`;
    if (e.type === P.OptionalNone) return "none";
    if (e.type === P.OptionalSome) return `(some ${Ei(e.value, t, a)})`;
    if (e.type === P.ResponseOk) return `(ok ${Ei(e.value, t, a)})`;
    if (e.type === P.ResponseErr) return `(err ${Ei(e.value, t, a)})`;
    if (e.type === P.List) return V8(e, t, a + 1);
    if (e.type === P.Tuple) return G8(e, t, a + 1);
    j8(e);
  }
  function my(e, t = 0) {
    return Ei(e, t, 0);
  }
  var aT = my;
  var X8 = UA, K8 = Dm, Y8 = Om;
  function oT(e) {
    let [t, a] = e.split(".");
    return a ? fy(t, a) : cy(t);
  }
  var Z8 = oT, W8 = fy, Q8 = cy, $8 = Bm, J8 = zm, e5 = qm, t5 = _s, a5 = (e) => _s(ma(e)), o5 = (e) => _s(ai(e)), r5 = (e) => _s(to(e)), n5 = _m, s5 = Pm, l5 = Hm, i5 = Um, u5 = Fm, c5 = Us, f5 = Rr;
  var hy = () => ({ rules: 1, replay: 2, controls: 1, rankedVersion: 1, rating: 1, white: "first-mover", black: "anyone-else", fen: Io, allow: [], cooldown: 0, noConsecutive: true, ranked: false, match: "" }), zs = (e) => ["anyone", "anyone-else", "first-mover"].includes(e);
  function Ea(e) {
    if (typeof e != "string") return false;
    let [t, a, ...o] = e.split(".");
    return eT(t) && o.length === 0 && (!e.includes(".") || !!a && /^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(a));
  }
  function Ai(e) {
    if (!e || typeof e != "object") throw Error("rules-shape");
    if (e.rules !== 1 || e.replay !== 2 || ![0, 1].includes(e.controls) || e.rankedVersion !== 1 || e.rating !== 1) throw Error("unsupported-version");
    if (![e.white, e.black].every((s) => zs(s) || Ea(s))) throw Error("invalid-seat");
    if (typeof e.fen != "string" || !Kx(e.fen).ok) throw Error("invalid-fen");
    let t = new gn(e.fen);
    if (t.fen() !== e.fen) throw Error("noncanonical-fen");
    let a = t.turn() === "w" ? "b" : "w", o = t.board().flat().find((s) => s?.type === "k" && s.color === a);
    if (o && t.isAttacked(o.square, t.turn())) throw Error("invalid-start-king-safety");
    if (!Array.isArray(e.allow) || e.allow.length > 16 || e.allow.some((s) => !Ea(s)) || new Set(e.allow).size !== e.allow.length || [...e.allow].sort().join() !== e.allow.join()) throw Error("invalid-allow-list");
    if (!Number.isInteger(e.cooldown) || e.cooldown < 0 || e.cooldown > 1) throw Error("seat-claim-cooldown-deadlock");
    if (typeof e.noConsecutive != "boolean" || typeof e.ranked != "boolean" || typeof e.match != "string" || !/^[\x20-\x7e]{0,128}$/.test(e.match)) throw Error("invalid-rule-field");
    let r = e.allow.length ? e.allow : [...new Set([e.white, e.black].filter((s) => !zs(s))), "@open-a", "@open-b"], n = (s, l) => zs(s) || s === l;
    if (!r.some((s) => n(e.white, s) && r.some((l) => s !== l && n(e.black, l)))) throw Error("seat-allow-list-deadlock");
    if (e.ranked && (e.fen !== Io || e.allow.length || e.controls !== 1)) throw Error("ineligible-ranked-rules");
  }
  function gy(e) {
    Ai(e);
    let t = new TextEncoder().encode(JSON.stringify(["XCHESS", e.rules, e.replay, e.controls, e.rankedVersion, e.rating, e.white, e.black, e.fen, e.allow, e.cooldown, e.noConsecutive, e.ranked, e.match]));
    if (t.length > 2048) throw Error("rules-too-large");
    return t;
  }
  function rT(e) {
    if (e.length > 2048) throw Error("rules-too-large");
    let t = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(e));
    if (!Array.isArray(t) || t.length !== 14 || t[0] !== "XCHESS") throw Error("rules-shape");
    let a = { rules: t[1], replay: t[2], controls: t[3], rankedVersion: t[4], rating: t[5], white: t[6], black: t[7], fen: t[8], allow: t[9], cooldown: t[10], noConsecutive: t[11], ranked: t[12], match: t[13] }, o = gy(a);
    if (o.length !== e.length || o.some((r, n) => r !== e[n])) throw Error("noncanonical-rules");
    return a;
  }
  function Aa(e) {
    if (!["mainnet", "testnet", "devnet"].includes(e.network) || !Ea(e.contract) || !e.contract.includes(".") || !Number.isSafeInteger(e.gameId) || e.gameId < 0) throw Error("invalid-identity");
    return `${e.network}/${e.contract}/${e.gameId}`;
  }
  function Gm(e, t) {
    Ai(e);
    let a = (o) => zs(o) || (t === "mainnet" ? /^S[PM]/ : /^S[TN]/).test(o);
    if (![e.white, e.black, ...e.allow].every(a)) throw Error("seat-network-mismatch");
  }
  function nT(e) {
    if (e.isCheckmate()) return { result: e.turn() === "w" ? "0-1" : "1-0", termination: "checkmate" };
    if (e.isStalemate()) return { result: "1/2-1/2", termination: "stalemate" };
    if (e.isInsufficientMaterial()) return { result: "1/2-1/2", termination: "insufficient-material" };
    if (e.isThreefoldRepetition()) return { result: "1/2-1/2", termination: "repetition" };
    if (e.isDrawByFiftyMoves()) return { result: "1/2-1/2", termination: "fifty-move" };
  }
  function d5(e, t) {
    if (!Array.isArray(e) || !Number.isSafeInteger(t) || t < 0 || t > 65536 || e.length !== t) throw Error("incomplete-evidence");
    let a = [...e].sort((r, n) => (r?.seq ?? -1) - (n?.seq ?? -1)), o = 0;
    return a.forEach((r, n) => {
      if (!r || r.seq !== n || !Number.isSafeInteger(r.height) || r.height < o || !Ea(r.sender)) throw Error("inconsistent-evidence");
      o = r.height;
    }), a;
  }
  function Ta(e, t, a) {
    try {
      Ai(e);
    } catch (x) {
      return { state: String(x).includes("unsupported") ? "unsupported" : "invalid-rules", verdicts: [], accepted: [], participation: [], error: String(x) };
    }
    let o;
    try {
      o = d5(t, a);
    } catch (x) {
      return { state: "incomplete", verdicts: [], accepted: [], participation: [], error: String(x) };
    }
    let r = new gn(e.fen), n = { w: zs(e.white) ? void 0 : e.white, b: zs(e.black) ? void 0 : e.black }, s = [], l = [], i = [], u = /* @__PURE__ */ new Set(), c = nT(r), d, f = c ? 0 : void 0, p = c ? -1 : void 0;
    for (let x of o) {
      let { sender: S, value: v, seq: g } = x, m = { entry: x, seq: g, accepted: false, reason: "" };
      s.push(m);
      let b = (C) => {
        m.reason = C;
      };
      if (c) {
        b("after-termination");
        continue;
      }
      if (e.allow.length && !e.allow.includes(S)) {
        b("not-allow-listed");
        continue;
      }
      if (e.controls === 1 && ["resgn", "draw?", "draw!"].includes(v)) {
        let C = n.w === S ? "w" : n.b === S ? "b" : void 0;
        if (!C) {
          b("unbound-control-sender");
          continue;
        }
        if (v === "draw?" && d) {
          b("draw-offer-already-standing");
          continue;
        }
        if (v === "draw!" && (!d || d === S)) {
          b("no-opponent-draw-offer");
          continue;
        }
        v === "resgn" && (c = { result: C === "w" ? "0-1" : "1-0", termination: "resignation" }), v === "draw?" && (d = S), v === "draw!" && (c = { result: "1/2-1/2", termination: "agreement" }), m.kind = "control";
      } else {
        if (typeof v != "string" || !/^([a-h][1-8]){2}[qrbn]?$/.test(v)) {
          b("malformed-move");
          continue;
        }
        let C = r.turn(), D = C === "w" ? "b" : "w";
        if (n[C] && n[C] !== S) {
          b("wrong-seat");
          continue;
        }
        if (n[D] === S) {
          b("opposite-seat");
          continue;
        }
        if (e.noConsecutive && i.at(-1)?.sender === S) {
          b("consecutive-sender");
          continue;
        }
        let I = i.findLastIndex((M) => M.sender === S);
        if (I >= 0 && i.slice(I + 1).filter((M) => M.sender !== S).length < e.cooldown) {
          b("cooldown");
          continue;
        }
        let w;
        try {
          w = r.move({ from: v.slice(0, 2), to: v.slice(2, 4), promotion: v[4] });
        } catch {
          b("illegal-move");
          continue;
        }
        n[C] = S, d = void 0, i.push(x), m.san = w.san, m.fen = r.fen(), m.kind = "move", c = nT(r);
      }
      m.accepted = true, m.reason = "accepted", l.push(x), u.add(S), c && (f = x.height, p = g);
    }
    return r.setHeader("White", n.w ?? e.white), r.setHeader("Black", n.b ?? e.black), r.setHeader("Result", c?.result ?? "*"), { state: "complete", fen: r.fen(), turn: r.turn(), check: r.isCheck(), result: c?.result, termination: c?.termination, terminalHeight: f, terminalSeq: p, white: n.w, black: n.b, drawOffer: d, verdicts: s, accepted: l, participation: [...u].sort(), pgn: r.pgn() };
  }
  var p5 = { mainnet: ["https://api.mainnet.hiro.so"], testnet: ["https://api.testnet.hiro.so"], devnet: ["http://localhost:3999"] }, sT = (e, t) => new Promise((a, o) => {
    let r = setTimeout(() => {
      t?.removeEventListener("abort", n), a();
    }, e);
    function n() {
      clearTimeout(r), o(Error("cancelled"));
    }
    t?.aborted ? n() : t?.addEventListener("abort", n, { once: true });
  }), qs = class {
    inflight = /* @__PURE__ */ new Map();
    network;
    endpoints;
    constructor(t, a) {
      this.transport = globalThis.XChessWallet?.makeRead(t, a?.[0]);
      if (this.network = t, this.endpoints = this.transport?.all ?? a ?? p5[t], !this.endpoints.length) throw Error("no-endpoints");
      for (let o of this.endpoints) {
        let r = new URL(o, document.baseURI);
        if (r.protocol !== "https:" && !(r.protocol === "http:" && ["localhost", "127.0.0.1"].includes(r.hostname))) throw Error("unsafe-endpoint");
      }
    }
    async request(t, a, o) {
      if (this.transport) {
        const response = await this.transport.request(t, { method: a ? "POST" : "GET", headers: a ? {"Content-Type":"application/json"} : undefined, body: a ? JSON.stringify(a) : undefined, signal: o });
        if (response.status === 404) throw Error("not-found");
        if (!response.ok) throw Error("endpoint-http-" + response.status);
        const text = await response.text();
        if (text.length > 4e6) throw Error("response-too-large");
        return JSON.parse(text);
      }
      let r = JSON.stringify([t, a]);
      if (!o && this.inflight.has(r)) return this.inflight.get(r);
      let n = (async () => {
        let s;
        for (let l of this.endpoints) for (let i = 0; i < 3; i++) try {
          o?.throwIfAborted();
          let u = AbortSignal.timeout(1e4), c = await fetch(l + t, { method: a ? "POST" : "GET", headers: a ? { "Content-Type": "application/json" } : void 0, body: a ? JSON.stringify(a) : void 0, signal: o ? AbortSignal.any([o, u]) : u });
          if (c.status === 429) {
            await sT(Math.min(4e3, Math.max(250, Number(c.headers.get("retry-after") ?? 0) * 1e3, 300 * 2 ** i)), o);
            continue;
          }
          if (c.status === 404) throw Error("not-found");
          if (!c.ok) throw Error("endpoint-http-" + c.status);
          let d = await c.text();
          if (d.length > 4e6) throw Error("response-too-large");
          return JSON.parse(d);
        } catch (u) {
          if (s = u, o?.aborted || String(u).includes("not-found")) throw u;
          await sT(100 * 2 ** i, o);
        }
        throw s ?? Error("endpoint-unavailable");
      })();
      o || this.inflight.set(r, n);
      try {
        return await n;
      } finally {
        o || this.inflight.delete(r);
      }
    }
    async tip(t) {
      let a = await this.request("/v2/info", void 0, t), o = this.network === "mainnet" ? 1 : 2147483648;
      if (a.network_id !== o) throw Error("endpoint-network-mismatch");
      return { hash: a.stacks_tip, height: a.stacks_tip_height };
    }
    async read(t, a, o = [], r) {
      let [n, s] = t.split("."), l = await this.request(`/v2/contracts/call-read/${n}/${s}/${a}`, { sender: n, arguments: o.map((i) => "0x" + Us(i)) }, r);
      if (!l.okay) throw Error(l.cause ?? "read-failed");
      return Mr(Ii(l.result));
    }
  };
  function Mr(e) {
    switch (e.type) {
      case "uint":
      case "int":
        return Number(e.value);
      case "true":
        return true;
      case "false":
        return false;
      case "none":
        return null;
      case "some":
      case "ok":
        return Mr(e.value);
      case "err":
        throw Error("contract-error-" + Mr(e.value));
      case "tuple":
        return Object.fromEntries(Object.entries(e.value).map(([t, a]) => [t, Mr(a)]));
      case "list":
        return e.value.map(Mr);
      case "buffer":
        return Uint8Array.from(e.value.match(/.{2}/g) ?? [], (t) => parseInt(t, 16));
      case "ascii":
      case "utf8":
        return e.value;
      case "address":
      case "contract":
        return e.value;
      default:
        return Ci(e);
    }
  }
  var jm = class {
    constructor(t) {
      this.client = t;
    }
    client;
    cache = /* @__PURE__ */ new Map();
    async game(t, a) {
      Aa(t);
      let o = await this.client.tip(a);
      if ((await this.client.read(t.contract, "get-protocol-v3", [], a)).protocol !== 3) throw Error("unsupported-contract-protocol");
      let n = await this.client.read(t.contract, "get-v3-game", [oe.uint(t.gameId)], a);
      if (!n) throw Error("game-not-found");
      if (n["options-version"] !== 1 || n.options?.length) throw Error("unsupported-game-options");
      let s = await this.client.read(t.contract, "get-count", [oe.uint(t.gameId)], a);
      if (!Number.isInteger(s) || s < 0 || s > 65536) throw Error("incomplete-count");
      let l = rT(n.rules);
      Gm(l, t.network);
      let i = new Uint8Array(await crypto.subtle.digest("SHA-256", n.rules));
      if (i.some((x, S) => x !== n["rules-hash"][S]) || i.length !== n["rules-hash"].length) throw Error("rules-hash-mismatch");
      let u = Aa(t), c = this.cache.get(u), d = [];
      if (c && c.count <= s) {
        let x = c.provenance.tip === o.hash;
        if (!x && c.provenance.height < o.height) try {
          let S = await this.client.request("/extended/v1/block/by_height/" + c.provenance.height, void 0, a);
          x = S.canonical === true && S.hash === c.provenance.tip;
        } catch {
          x = false;
        }
        x && (d = [...c.entries]);
      }
      for (let x = d.length; x < s; x += 32) {
        let S = await this.client.read(t.contract, "get-entries-page", [oe.uint(t.gameId), oe.uint(x)], a);
        if (!Array.isArray(S) || S.length !== 32) throw Error("incomplete-page");
        d.push(...S.slice(0, Math.min(32, s - x)));
      }
      let f = await this.client.tip(a);
      if (f.hash !== o.hash) throw Error("chain-changed-retry");
      if (Ta(l, d, s).state !== "complete") throw Error("incomplete-evidence");
      let p = { id: t, rules: l, entries: d, count: s, createdHeight: n.height, provenance: { tip: f.hash, height: f.height, endpoint: this.client.endpoints[0], rulesHash: Array.from(i, (x) => x.toString(16).padStart(2, "0")).join(""), source: "node" } };
      return this.cache.set(u, p), p;
    }
    async discover(t, a, o) {
      return await this.client.tip(o), this.client.read(t, "get-games-page", [oe.uint(a)], o);
    }
  };
  function lT(e) {
    let t = new URLSearchParams(e.replace(/^[#?]/, ""));
    if (!t.has("game")) return null;
    let a = { network: t.get("network"), contract: t.get("contract") ?? "", gameId: Number(t.get("game")) };
    return Aa(a), { id: a, endpoint: t.get("endpoint") ?? void 0, tournament: t.get("tournament") ?? void 0 };
  }
  function iT(e, t, a) {
    return Aa(e), "#" + new URLSearchParams({ network: e.network, contract: e.contract, game: String(e.gameId), ...t ? { endpoint: t } : {}, ...a ? { tournament: a } : {} });
  }
  function uT(e) {
    return { format: "XCHESS-EVIDENCE", version: 1, game: e, protocol: { rules: e.rules.rules, replay: e.rules.replay, controls: e.rules.controls, ranked: e.rules.rankedVersion, rating: e.rules.rating }, verification: "Replay verifies interpretation. Node provenance is a claim, not a cryptographic inclusion proof." };
  }
  function cT(e) {
    if (e.length > 16e6) throw Error("bundle-too-large");
    let t = JSON.parse(e);
    if (t.format !== "XCHESS-EVIDENCE" || t.version !== 1) throw Error("unsupported-bundle");
    if (Aa(t.game.id), Ta(t.game.rules, t.game.entries, t.game.count).state !== "complete") throw Error("incomplete-or-unsupported-evidence");
    return { ...t.game, provenance: { ...t.game.provenance, source: "bundle" } };
  }
  var xy = "xchess.pending.v1";
  function Xm() {
    try {
      let e = globalThis.localStorage?.getItem(xy);
      if (!e) return null;
      const saved = JSON.parse(e);
      if (!saved || !/^(0x)?[a-fA-F0-9]{64}$/.test(saved.txid ?? "") || !["mainnet","testnet","devnet"].includes(saved.network) || !saved.params || !Ea(saved.params.contract) || !Array.isArray(saved.params.functionArgs) || !["submit","open-v3-game","top-up","settle"].includes(saved.params.functionName)) return null;
      return saved;
    } catch {
      return null;
    }
  }
  function Wc() {
    try {
      globalThis.localStorage?.removeItem(xy);
    } catch {
    }
  }
  function m5(e) {
    try {
      globalThis.localStorage?.setItem(xy, JSON.stringify(e));
    } catch {
    }
  }
  function Qc(e = globalThis) {
    if (e === globalThis && globalThis.XChessWallet) return globalThis.XChessWallet.providers();
    return [{ name: "Leather", get: () => e.LeatherProvider }, { name: "Xverse", get: () => e.XverseProviders?.BitcoinProvider ?? e.XverseProviders?.StacksProvider }, { name: "Stacks wallet", get: () => e.StacksProvider }].filter((t) => typeof t.get()?.request == "function");
  }
  function fT(e) {
    if (e?.error) {
      let t = new Error(e.error.message ?? "wallet-error");
      throw t.code = e.error.code, t;
    }
    return e?.result ?? e;
  }
  async function dT(e, t) {
    if (globalThis.XChessWallet) return globalThis.XChessWallet.connect(e, t);
    let o = fT(await e.request("stx_getAddresses")).addresses ?? [], r = t === "mainnet" ? /^S[PM]/ : /^S[TN]/, n = o.map((s) => s.address).find((s) => Ea(s) && r.test(s));
    if (!n) throw Error("no-wallet-address-for-network");
    return n;
  }
  var h5 = (e, t, a = "lte") => ({ type: "stx-postcondition", address: e, condition: a, amount: String(t) });
  function $c(e, t, a, o) {
    let r = /* @__PURE__ */ new Map();
    for (let n of o) r.set(n.address, (r.get(n.address) ?? 0) + n.amount);
    return { contract: e.contract, functionName: t, functionArgs: a.map((n) => "0x" + Us(n)), network: e.network, postConditionMode: "deny", postConditions: [...r].filter(([, n]) => n > 0).map(([n, s]) => h5(n, s)), appDetails: { name: "X-Chess" } };
  }
  var Ti = class {
    constructor(t) {
      this.update = t;
    }
    update;
    busy = false;
    stage = "idle";
    txid;
    error;
    set(t, a) {
      this.stage = t, this.update(t, a);
    }
    async run(t, a, o, r, n) {
      if (this.busy) throw Error("submission-already-in-flight");
      if (Xm()) throw Error("pending-transaction-restored-inspect-before-retry");
      if (this.txid && !["accepted", "rejected", "dropped"].includes(this.stage)) throw Error("unresolved-transaction-inspect-before-retry");
      this.txid = void 0, this.busy = true, this.error = void 0;
      try {
        this.set("preview");
        let s = await o();
        n?.throwIfAborted(), this.set("wallet-approval");
        let l = fT(await globalThis.XChessWallet.sign(t(), s)), i = l.txid ?? l.txId;
        if (typeof i != "string" || !/^(0x)?[a-fA-F0-9]{64}$/.test(i)) throw Error("wallet-missing-transaction-id");
        this.txid = i.startsWith("0x") ? i : "0x" + i, m5({ txid: this.txid, params: s, network: a.network, endpoints: a.endpoints }), this.set("broadcast", this.txid), this.set("pending", this.txid);
        let u = Date.now() + 12e4;
        for (; Date.now() < u; ) {
          n?.throwIfAborted();
          let c;
          try {
            c = await a.request("/extended/v1/tx/" + this.txid, void 0, n);
          } catch (d) {
            if (!String(d).includes("not-found")) throw d;
          }
          if (c) {
            if (c.tx_status?.startsWith("dropped")) {
              Wc(), this.set("dropped", c.tx_status);
              return;
            }
            if (c.tx_status === "abort_by_response" || c.tx_status === "abort_by_post_condition") throw Error(c.tx_status);
            if (c.tx_status === "success" && c.canonical === true && c.is_unanchored !== true) {
              this.set("confirmed");
              let d = await r(c);
              Wc(), this.set(d ? "accepted" : "rejected");
              return;
            }
          }
          await new Promise((d) => setTimeout(d, 1e3));
        }
        this.set("timeout", "Still unconfirmed. Keep the transaction ID and inspect it before trying again.");
      } catch (s) {
        this.error = s.message, this.set(s.code === 4001 || s.code === -32e3 && /reject|cancel/i.test(s.message) || /cancel|abort/i.test(s.message) && !s.message.startsWith("abort_by") ? "cancelled" : "failed", s.message);
      } finally {
        this.busy = false;
      }
    }
  };
  async function pT(e, t, a, o) {
    let r = await e.game(t), s = Ta(r.rules, [...r.entries, { seq: r.count, sender: a, value: o, height: r.provenance.height }], r.count + 1).verdicts.at(-1);
    if (!s?.accepted) throw Error(s?.reason ?? "incomplete-evidence");
    let l = await e.client.read(t.contract, "quote-rebate", [oe.uint(t.gameId), oe.principal(a)]);
    return $c(t, "submit", [oe.uint(t.gameId), oe.stringAscii(o)], [{ address: t.contract, amount: l }]);
  }
  async function mT(e, t, a, o, r, n) {
    Gm(o, t.network);
    let s = await e.read(t.contract, "get-protocol-v3");
    if (s.protocol !== 3) throw Error("unsupported-protocol");
    if (s["opening-fee"] !== r) throw Error("price-changed-review-again");
    let l = n.map((i) => oe.tuple({ beneficiary: oe.principal(i.beneficiary), bootstrap: oe.uint(i.bootstrap), rebate: oe.uint(i.rebate), count: oe.uint(i.count), expiry: oe.uint(i.expiry) }));
    return $c(t, "open-v3-game", [oe.buffer(gy(o)), oe.uint(r), oe.list(l)], [{ address: a, amount: r + n.reduce((i, u) => i + u.bootstrap + u.rebate * u.count, 0) }, { address: t.contract, amount: n.reduce((i, u) => i + u.bootstrap, 0) }]);
  }
  function Jc(e) {
    if (!e.tx_result?.hex) throw Error("missing-confirmed-result");
    return Mr(Ii(e.tx_result.hex));
  }
  var by = (e, t) => e < t ? -1 : e > t ? 1 : 0, g5 = (e) => Math.sign(e) * Math.floor(Math.abs(e) + 0.5), x5 = (e, t) => Math.floor(1e3 / (1 + 10 ** (Math.max(-800, Math.min(800, t - e)) / 400)) + 0.5);
  function hT(e, t, a) {
    return g5(32 * (a - x5(e, t)) / 1e3);
  }
  function b5(e) {
    let { rules: t, replay: a } = e;
    return t.ranked && t.rankedVersion === 1 && t.rating === 1 && t.controls === 1 && t.fen === Io && !t.allow.length && a.state === "complete" && !!a.result && !!a.white && !!a.black && a.white !== a.black && a.participation.includes(a.white) && a.participation.includes(a.black) && a.terminalSeq >= 0;
  }
  function gT(e) {
    let t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = e.filter(b5).sort((r, n) => r.replay.terminalHeight - n.replay.terminalHeight || by(r.id.network, n.id.network) || by(r.id.contract, n.id.contract) || r.id.gameId - n.id.gameId);
    for (let r of o) {
      let n = Aa(r.id);
      if (a.has(n)) throw Error("duplicate-rated-game");
      a.add(n);
      let s = r.replay, l = s.white, i = s.black, u = t.get(l) ?? { rating: 1200, games: 0, wins: 0, draws: 0 }, c = t.get(i) ?? { rating: 1200, games: 0, wins: 0, draws: 0 }, d = s.result === "1-0" ? 1e3 : s.result === "0-1" ? 0 : 500, f = hT(u.rating, c.rating, d), p = hT(c.rating, u.rating, 1e3 - d);
      t.set(l, { rating: u.rating + f, games: u.games + 1, wins: u.wins + +(d === 1e3), draws: u.draws + +(d === 500) }), t.set(i, { rating: c.rating + p, games: c.games + 1, wins: c.wins + +(d === 0), draws: c.draws + +(d === 500) });
    }
    return [...t].map(([r, n]) => ({ address: r, ...n, provisional: n.games < 10 })).sort((r, n) => n.rating - r.rating || by(r.address, n.address));
  }
  function yy(e, t) {
    if (!e || e.format !== "XCHESS-TOURNAMENT" || e.version !== 1 || typeof e.title != "string" || e.title.length > 120 || !Ea(e.author) || !["pre-play", "retrospective"].includes(e.kind) || e.scoring !== "1-0.5-0" || e.tieBreak !== "buchholz-then-address" || !Number.isSafeInteger(e.committedHeight) || e.committedHeight < 0 || !Array.isArray(e.entrants) || e.entrants.length > 256 || !Array.isArray(e.pairings) || e.pairings.length > 4096) throw Error("invalid-manifest");
    let a = e.entrants.map((i) => i.address);
    if (new Set(a).size !== a.length || e.entrants.some((i) => !Ea(i.address) || typeof i.name != "string" || i.name.length > 80 || !["human", "ai"].includes(i.kind) || i.kind === "ai" && (!Ea(i.operator) || !i.artifact))) throw Error("invalid-entrants");
    let o = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), n = new Map(a.map((i) => [i, 0])), s = new Map(a.map((i) => [i, []]));
    return { pairings: e.pairings.map((i) => {
      let u = Aa(i.game);
      if (o.has(u) || i.white === i.black || ![i.white, i.black].every((p) => a.includes(p)) || !Number.isInteger(i.round) || i.round < 1) throw Error("invalid-pairing");
      o.add(u);
      for (let p of [i.white, i.black]) {
        let x = i.round + "/" + p;
        if (r.has(x)) throw Error("duplicate-round-seat");
        r.add(x);
      }
      let c = t.find((p) => Aa(p.id) === u);
      if (!c) return { ...i, status: "missing-evidence" };
      if (c.rules.white !== i.white || c.rules.black !== i.black || c.rules.match !== i.match || !i.match || e.kind === "pre-play" && e.committedHeight > c.createdHeight) return { ...i, status: "descriptor-mismatch" };
      let d = Ta(c.rules, c.entries, c.count);
      if (d.state !== "complete") return { ...i, status: "incomplete" };
      if (!d.result) return { ...i, status: "playing" };
      let f = d.result === "1-0" ? 1 : d.result === "0-1" ? 0 : 0.5;
      return n.set(i.white, n.get(i.white) + f), n.set(i.black, n.get(i.black) + 1 - f), s.get(i.white).push(i.black), s.get(i.black).push(i.white), { ...i, status: "verified", result: d.result };
    }), standings: e.entrants.map((i) => ({ ...i, points: n.get(i.address), buchholz: s.get(i.address).reduce((u, c) => u + n.get(c), 0) })).sort((i, u) => u.points - i.points || u.buchholz - i.buchholz || (i.address < u.address ? -1 : i.address > u.address ? 1 : 0)), authorship: "unverified-until-mint-provenance-checked" };
  }
  var Dr = _(F(), 1);
  var Je = _(mt(), 1), Km = (e) => (e / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 }) + " STX";
  function xT({ game: e, wallet: t, provider: a }) {
    let [o, r] = (0, Dr.useState)(t ?? e.rules.white), [n, s] = (0, Dr.useState)(20), [l, i] = (0, Dr.useState)(), [u, c] = (0, Dr.useState)(), [d, f] = (0, Dr.useState)(""), [p, x] = (0, Dr.useState)(), S = (0, Dr.useRef)(void 0);
    S.current || (S.current = new Ti((b, y) => f(b + (y ? " \xB7 " + y : ""))));
    let v = () => new qs(e.id.network, e.provenance.endpoint ? [e.provenance.endpoint] : void 0);
    async function g() {
      try {
        if (!Ea(o)) throw Error("Enter a validated beneficiary principal.");
        let b = v();
        await b.tip();
        let y = await b.read(e.id.contract, "get-protocol-v3");
        if (y.protocol !== 3) throw Error("Unsupported contract");
        let C = await b.read(e.id.contract, "get-funding", [oe.uint(e.id.gameId), oe.principal(o)]);
        i(C), c(y), x(void 0), f(C ? "Funding terms recovered." : "This beneficiary has no funding row.");
      } catch (b) {
        f(b.message);
      }
    }
    async function m() {
      !t || !p || !l || await S.current.run(a, v(), async () => {
        let b = v(), y = await b.tip(), C = await b.read(e.id.contract, "get-funding", [oe.uint(e.id.gameId), oe.principal(o)]);
        if (!C || C.rebate !== l.rebate || C.expiry !== l.expiry) throw Error("Funding terms changed. Review again.");
        if (p === "top-up") {
          if (!Number.isInteger(n) || n < 1 || C.remaining + n > 65536 || y.height >= C.expiry) throw Error("Invalid count or expired funding.");
          return $c(e.id, "top-up", [oe.uint(e.id.gameId), oe.principal(o), oe.uint(n), oe.uint(l.rebate)], [{ address: t, amount: n * l.rebate }]);
        }
        if (y.height < C.expiry) throw Error("Settlement is available only after expiry.");
        return $c(e.id, "settle", [oe.uint(e.id.gameId), oe.principal(o)], []);
      }, async () => true);
    }
    return e.provenance.source !== "node" ? (0, Je.jsx)("p", { children: "Funding management is available for a recovered on-chain game. Local practice and imported bundles cannot transfer funds." }) : (0, Je.jsxs)(Je.Fragment, { children: [(0, Je.jsxs)("label", { children: ["Beneficiary principal", (0, Je.jsx)("input", { value: o, onChange: (b) => {
      r(b.target.value.trim()), i(void 0);
    } })] }), (0, Je.jsx)("button", { className: "secondary", onClick: g, children: "Read funding terms" }), l && (0, Je.jsxs)(Je.Fragment, { children: [(0, Je.jsxs)("p", { children: ["Rebate: ", (0, Je.jsx)("strong", { children: Km(l.rebate) }), (0, Je.jsx)("br", {}), "Remaining: ", l.remaining, (0, Je.jsx)("br", {}), "Reserve: ", Km(l.remaining * l.rebate), (0, Je.jsx)("br", {}), "Expiry Stacks height: ", l.expiry] }), (0, Je.jsxs)("p", { children: ["Expiry ends payouts. Unused funds settle to", " ", (0, Je.jsx)("code", { children: u?.treasury }), "."] }), (0, Je.jsxs)("label", { children: ["Additional rebates", (0, Je.jsx)("input", { type: "number", min: "1", max: "65536", value: n, onChange: (b) => {
      s(Number(b.target.value)), x(void 0);
    } })] }), (0, Je.jsxs)("div", { className: "filter-row", children: [(0, Je.jsx)("button", { onClick: () => x("top-up"), children: "Preview top-up" }), (0, Je.jsx)("button", { onClick: () => x("settle"), children: "Preview settlement" })] }), p && (0, Je.jsxs)("div", { children: [(0, Je.jsxs)("p", { children: [p === "top-up" ? `Your wallet funds ${Km(n * l.rebate)} at the original row's immutable rate.` : `The remaining ${Km(l.remaining * l.rebate)} becomes withdrawable treasury. No refund goes to the sponsor.`, " ", "Network fee is quoted by your wallet."] }), (0, Je.jsxs)("button", { className: "primary full", disabled: !t || S.current.busy || S.current.stage === "timeout", onClick: m, children: ["Approve ", p, " in wallet"] }), !t && (0, Je.jsx)("p", { children: "Connect a wallet to sign." })] })] }), (0, Je.jsx)("p", { role: "status", children: d })] });
  }
  var h = _(mt(), 1), ki = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", Zm = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5", Sy = globalThis.__XCHESS_V3_CONFIG__?.contract ?? ki + ".xchess-core-v3", y5 = { k: is, q: Gu, r: ju, b: qu, n: Fu, p: Vu }, Ym = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" }, Zo = (e) => e ? e === ki ? "Player one" : e === Zm ? "Player two" : e.length > 22 ? e.slice(0, 7) + "\u2026" + e.slice(-5) : e : "Open seat", Fs = (e) => `${(e / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 })} STX`;
  function bT() {
    let e = { ...hy(), white: ki, black: Zm }, t = ["e2e4", "c7c5", "g1f3", "d7d6", "d2d4", "c5d4", "f3d4", "g8f6", "b1c3", "a7a6"];
    return { id: { network: "devnet", contract: Sy, gameId: 0 }, rules: e, entries: t.map((a, o) => ({ seq: o, value: a, sender: o % 2 ? Zm : ki, height: o + 1 })), count: t.length, createdHeight: 0, provenance: { source: "local", tip: "practice", height: 10, endpoint: "" } };
  }
  function yT(e, t, a = "application/json") {
    let o = URL.createObjectURL(new Blob([t], { type: a })), r = document.createElement("a");
    r.href = o, r.download = e, r.click(), setTimeout(() => URL.revokeObjectURL(o), 1e3);
  }
  function S5() {
    const boardFocus = (0, xe.useRef)("a8");
    let [e, t] = (0, xe.useState)(bT), [a, o] = (0, xe.useState)([bT()]), [r, n] = (0, xe.useState)("arena"), [s, l] = (0, xe.useState)(), [i, u] = (0, xe.useState)(false), [c, d] = (0, xe.useState)(null), [f, p] = (0, xe.useState)(), [x, S] = (0, xe.useState)(), [v, g] = (0, xe.useState)(), [m, b] = (0, xe.useState)(""), [y, C] = (0, xe.useState)("idle"), [D, I] = (0, xe.useState)(""), [w, M] = (0, xe.useState)(false), [T, K] = (0, xe.useState)(""), [z, Y] = (0, xe.useState)("all"), [ce, Le] = (0, xe.useState)(false), [J, Ie] = (0, xe.useState)(), [Be, he] = (0, xe.useState)(), [U, gt] = (0, xe.useState)(), [ue, Pe] = (0, xe.useState)(0), [Ee, ne] = (0, xe.useState)(), [$, et] = (0, xe.useState)({ network: "devnet", contract: Sy, endpoint: "http://localhost:3999", gameId: "0" }), [H, ee] = (0, xe.useState)(hy), [Ne, lt] = (0, xe.useState)("challenge"), [te, ke] = (0, xe.useState)("white"), [He, Tt] = (0, xe.useState)(""), [Dt, ge] = (0, xe.useState)(false), [je, pe] = (0, xe.useState)(false), [rt, zt] = (0, xe.useState)(""), [ze, ea] = (0, xe.useState)({ bootstrap: "0.01", rebate: "0.001", count: "20", expiry: "1000" }), j = (0, xe.useRef)(void 0), X = (0, xe.useRef)(void 0), Lt = (0, xe.useRef)(null), Me = (0, xe.useRef)(null);
    X.current || (X.current = new Ti((L, O) => {
      C(L), I(O ?? "");
    }));
    let be = (0, xe.useMemo)(() => Ta(e.rules, e.entries, e.count), [e]), qt = be.verdicts.filter((L) => L.accepted && L.kind === "move"), Ro = c === null ? be.fen : c === 0 ? e.rules.fen : qt[c - 1]?.fen, Ct = (0, xe.useMemo)(() => new gn(Ro ?? Io), [Ro]), Ft = e.provenance.source === "local", Mo = e.provenance.source === "bundle", Or = Ft ? be.turn === "w" ? be.white ?? ki : be.black ?? Zm : J, Vs = s ? Ct.moves({ square: s, verbose: true }) : [], Gs = (0, xe.useRef)(/* @__PURE__ */ new Map()), Br = (L, O) => {
      let N = L + "/" + (O ?? ""), W = Gs.current.get(N);
      return W || (W = new jm(new qs(L, O ? [O] : void 0)), Gs.current.set(N, W)), W;
    }, ka = () => Br($.network, $.endpoint), oo = (L) => {
      o((O) => L.provenance.source === "bundle" && O.some(N => Aa(N.id) === Aa(L.id) && N.provenance.source === "node") ? O : [L, ...O.filter((N) => Aa(N.id) !== Aa(L.id))]);
    }, Lo = (L) => {
      t(L), l(void 0), p(void 0), d(null), n("arena"), C("idle"), L.provenance.source === "node" && (et({ network: L.id.network, contract: L.id.contract, endpoint: L.provenance.endpoint, gameId: String(L.id.gameId) }), history.replaceState(null, "", iT(L.id, L.provenance.endpoint)));
    };
    async function ef(L, O) {
      if (L.network === "mainnet" && L.contract === "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary" && globalThis.XChessOpenV2) { globalThis.XChessOpenV2(L.gameId); return; }
      j.current?.abort();
      let N = new AbortController();
      j.current = N, Le(true), b("Recovering committed rules and submissions\u2026");
      try {
        let W = await Br(L.network, O).game(L, N.signal);
        if (N.signal.aborted) return;
        Lo(W), oo(W), b("Rules recovered and all submissions replayed.");
      } catch (W) {
        N.signal.aborted || b(`Could not verify this game: ${W.message}. The previous board remains visible.`);
      } finally {
        N.signal.aborted || Le(false);
      }
    }
    (0, xe.useEffect)(() => {
      let L = Xm();
      L && (C("timeout"), I("Unresolved transaction restored: " + L.txid));
      let O = () => {
        try {
          let N = location.hash || location.search;
          if (!N) try {
            N = new URL(window.frameElement?.getAttribute("src") ?? "", document.baseURI).hash;
          } catch {
          }
          let W = lT(N);
          W && ef(W.id, W.endpoint);
        } catch (N) {
          b(N.message);
        }
      };
      return O(), window.addEventListener("hashchange", O), () => {
        j.current?.abort(), window.removeEventListener("hashchange", O);
      };
    }, []);
    function tf() {
      if (!w) return;
      let L = window.AudioContext;
      if (L) {
        let O = new L(), N = O.createOscillator(), W = O.createGain();
        N.connect(W), W.connect(O.destination), N.frequency.value = 520, W.gain.value = 0.035, N.start(), N.stop(O.currentTime + 0.07), N.onended = () => O.close();
      }
    }
    async function _n(L) {
      if (c !== null) {
        b("Return to the live position to play.");
        return;
      }
      if (be.result) {
        b("This game is finished. Browse the moves or export its record.");
        return;
      }
      if (Mo) {
        b("This is an offline evidence replay. Open its network game to submit a move.");
        return;
      }
      if (!Or) {
        g("wallet");
        return;
      }
      let N = Ta(e.rules, [...e.entries, { seq: e.count, sender: Or, value: L, height: Math.max(e.provenance.height, e.entries.at(-1)?.height ?? 0) }], e.count + 1).verdicts.at(-1);
      if (!N?.accepted) {
        b(N?.reason ?? "Move cannot be verified.");
        return;
      }
      if (!Ft) try {
        let W = ka().client, _e = await W.read(e.id.contract, "get-protocol-v3"), vt = await W.read(e.id.contract, "quote-rebate", [oe.uint(e.id.gameId), oe.principal(Or)]);
        ne({ fee: _e["move-fee"], rebate: vt });
      } catch (W) {
        b(W.message);
        return;
      }
      p(L), l(void 0), b("");
    }
    function Wm(L) {
      if (c !== null || be.result || Mo || X.current.busy) { b(c !== null ? "Return to the live position to play." : "This board is read only."); return; }
      if (s === L) {
        l(void 0);
        return;
      }
      let O = Vs.filter((W) => W.to === L);
      if (O.length) {
        if (O.some((W) => W.promotion)) {
          S({ from: s, to: L });
          return;
        }
        _n(s + L);
        return;
      }
      let N = Ct.get(L);
      N?.color === Ct.turn() ? (l(L), b(`${Ym[N.type]} on ${L}: ${Ct.moves({ square: L }).length} legal moves.`)) : (l(void 0), b(be.check ? "You are in check. Move your king, capture the attacker, or block the check." : "Select a piece of the side to move. Dots show legal destinations."));
    }
    function Ri() {
      let L = Qc().find((O) => O.name === Be)?.get();
      if (!L) throw Error("Selected wallet is unavailable. Reconnect it.");
      return L;
    }
    async function Qm() {
      if (!f || X.current.busy) return;
      if (c !== null || Mo || be.result) { b("Return to the live playable position before submitting."); return; }
      let L = f;
      if (Ft) {
        C("accepted");
        let N = { ...e, entries: [...e.entries, { seq: e.count, value: L, sender: Or, height: e.provenance.height + 1 }], count: e.count + 1, provenance: { ...e.provenance, height: e.provenance.height + 1 } };
        t(N), oo(N), p(void 0), tf();
        return;
      }
      let O = ka();
      await X.current.run(Ri, O.client, () => pT(O, e.id, J, L), async (N) => {
        let W = Jc(N), _e = await O.game(e.id);
        return Lo(_e), oo(_e), !!Ta(_e.rules, _e.entries, _e.count).verdicts.find((Pr) => Pr.seq === W)?.accepted && _e.entries[W]?.sender === J && _e.entries[W]?.value === L;
      }), ["accepted", "rejected"].includes(X.current.stage) && (p(void 0), tf());
    }
    async function Mi(L) {
      if (Ft) {
        _n(L);
        return;
      }
      try {
        let O = await ka().client.read(e.id.contract, "get-protocol-v3"), N = J ? await ka().client.read(e.id.contract, "quote-rebate", [oe.uint(e.id.gameId), oe.principal(J)]) : 0;
        ne({ fee: O["move-fee"], rebate: N }), _n(L);
      } catch (O) {
        b(O.message);
      }
    }
    async function $m() {
      try {
        let L = Xm();
        if (!L) throw Error("No saved transaction. Inspect the transaction ID in your wallet before retrying.");
        let N = await new qs(L.network, L.endpoints).request("/extended/v1/tx/" + L.txid);
        if (N.tx_status?.startsWith("dropped") || N.tx_status === "abort_by_response" || N.tx_status === "abort_by_post_condition") {
          Wc(), X.current.txid = void 0, C("dropped"), I(N.tx_status);
          return;
        }
        if (N.tx_status !== "success" || N.canonical !== true || N.is_unanchored === true) throw Error("Still unconfirmed; no new submission has been signed.");
        let W = L.params.functionName;
        if (["submit", "open-v3-game"].includes(W)) {
          let _e = W === "open-v3-game" ? Jc(N) : Mr(Ii(L.params.functionArgs[0])), vt = await Br(L.network, L.endpoints?.[0]).game({ network: L.network, contract: L.params.contract, gameId: _e });
          Lo(vt), oo(vt);
          let Pr = W === "open-v3-game" || Ta(vt.rules, vt.entries, vt.count).verdicts[Jc(N)]?.accepted;
          C(Pr ? "accepted" : "rejected");
        } else C("accepted");
        Wc(), X.current.txid = void 0, I("Recovered from confirmed transaction and authoritative reads.");
      } catch (L) {
        b(L.message);
      }
    }
    async function A(L) {
      try {
        let O = Qc().find((W) => W.name === L);
        if (!O) throw Error("Wallet was removed");
        let N = await dT(O.get(), $.network);
        Ie(N), he(L), g(void 0), b("Wallet connected. Signing is requested only after a preview.");
      } catch (O) {
        b(O.message);
      }
    }
    function _r() {
      let L = J ?? ki, opponent = He || (!J ? Zm : ""), O = te === "white" ? L : opponent, N = te === "black" ? L : opponent;
      Ne === "open" && (O = te === "white" ? L : "anyone-else", N = te === "black" ? L : "anyone-else"), Ne === "community" && (O = "first-mover", N = "anyone-else");
      let W = { ...H, white: O, black: N };
      return Ai(W), W;
    }
    function qa() {
      if (!Dt) return [];
      let L = rt || He;
      if (!Ea(L)) throw Error("A validated named beneficiary is required for bootstrap funding.");
      let O = { bootstrap: Math.round(Number(ze.bootstrap) * 1e6), rebate: Math.round(Number(ze.rebate) * 1e6), count: Number(ze.count), expiry: Number(ze.expiry) };
      if (!Object.values(O).every((W) => Number.isSafeInteger(W) && W >= 0) || O.count < 1 || O.count > 65536 || O.rebate < 1 || O.rebate > 1e5 || O.bootstrap > 1e6) throw Error("Invalid sponsorship amount or limit.");
      let N = [{ beneficiary: L, ...O }];
      if (je) {
        if (!J || J === L) throw Error("Two distinct named beneficiaries are required.");
        N.push({ beneficiary: J, ...O });
      }
      return N;
    }
    async function js() {
      try {
        let L = _r();
        if (!J) {
          let _e = { id: { network: "devnet", contract: Sy, gameId: Math.max(...a.map((vt) => vt.id.gameId)) + 1 }, rules: { ...L, ranked: false }, entries: [], count: 0, createdHeight: 0, provenance: { source: "local", tip: "practice", height: 0, endpoint: "" } };
          if (Dt) throw Error("Sponsorship requires a connected wallet and development contract.");
          Lo(_e), oo(_e), g(void 0), b("Local practice board created. No transactions or permanent storage.");
          return;
        }
        let O = await ka().client.read($.contract, "get-protocol-v3");
        if (O.protocol !== 3) throw Error("Unsupported contract");
        let N = qa(), W = await ka().client.tip();
        if (N.some((_e) => _e.expiry <= W.height)) throw Error("Expiry must be a future Stacks height.");
        ne({ fee: O["opening-fee"], rules: L, sponsors: N }), C("preview"), I(""), g("create-preview");
      } catch (L) {
        b(L.message);
      }
    }
    async function q() {
      let L = Ee;
      L?.rules && (await X.current.run(Ri, ka().client, () => mT(ka().client, { network: $.network, contract: $.contract, gameId: 0 }, J, L.rules, L.fee, L.sponsors), async (O) => {
        let N = Jc(O), W = await ka().game({ network: $.network, contract: $.contract, gameId: N });
        return Lo(W), oo(W), true;
      }), X.current.stage === "accepted" && g(void 0));
    }
    async function Pn() {
      Le(true);
      try {
        let L = ka(), O = await L.discover($.contract, ue * 32);
        for (let N of O.filter((W) => W.metadata)) try {
          let W = await L.game({ network: $.network, contract: $.contract, gameId: N.id });
          oo(W);
        } catch {
          b("Some discovered games have incomplete or unsupported evidence.");
        }
        Pe((N) => N + 1);
      } catch (L) {
        b("Discovery unavailable: " + L.message);
      } finally {
        Le(false);
      }
    }
    let it = (0, xe.useMemo)(() => {
      if (!U) return null;
      try {
        return yy(U, a);
      } catch (L) {
        return { error: L.message };
      }
    }, [U, a]), Fa = (0, xe.useMemo)(() => gT(a.filter((L) => L.provenance.source === "node" && L.id.network === $.network && L.id.contract === $.contract).map((L) => ({ id: L.id, rules: L.rules, replay: Ta(L.rules, L.entries, L.count) }))), [a]), af = a.filter((L) => {
      let O = Ta(L.rules, L.entries, L.count);
      return [L.id.gameId, L.rules.white, L.rules.black, L.rules.match, O.result, O.termination].join(" ").toLowerCase().includes(T.toLowerCase()) && (z === "all" || z === "finished" && O.result || z === "playing" && !O.result || z === "yours" && J && !O.result && (O.turn === "w" ? O.white === J : O.black === J));
    }), xa = "abcdefgh".split("");
    i && xa.reverse();
    let of = i ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1], Wo = ["wallet-approval", "broadcast", "pending", "confirmed"].includes(y), ae = be.result ? be.termination?.replaceAll("-", " ") : be.check ? "Check \u2014 protect your king" : `${be.turn === "w" ? "White" : "Black"} to move`, rf = (L) => {
      let O = y5[L.type];
      return (0, h.jsx)(O, { "aria-hidden": "true", className: "piece " + (L.color === "w" ? "white-piece" : "black-piece"), strokeWidth: 1.6 });
    };
    return (0, h.jsxs)("div", { className: "app", children: [(0, h.jsxs)("header", { children: [(0, h.jsxs)("button", { className: "brand", onClick: () => n("arena"), children: [(0, h.jsxs)("span", { className: "brand-mark", children: ["X", (0, h.jsx)("span", { children: "\u2726" })] }), (0, h.jsxs)("span", { children: ["X-CHESS", (0, h.jsx)("span", { className: "brand-sub", children: "THE PERMANENT ARENA" })] })] }), (0, h.jsx)("nav", { "aria-label": "Main navigation", children: [["arena", "Play"], ["games", "Your games"], ["community", "Community"]].map(([L, O]) => (0, h.jsx)("button", { className: r === L ? "nav-active" : "", onClick: () => n(L), children: O }, L)) }), (0, h.jsxs)("div", { className: "header-actions", children: [(0, h.jsxs)("button", { className: "network-pill", onClick: () => g("network"), children: [(0, h.jsx)("i", {}), Ft ? "Local practice" : Mo ? "Offline replay" : $.network, (0, h.jsx)(oc, { size: 14 })] }), (0, h.jsxs)("button", { className: "wallet-button", onClick: () => g("wallet"), children: [(0, h.jsx)(cs, { size: 17 }), J ? Zo(J) : "Connect wallet"] })] })] }), (0, h.jsxs)("div", { className: "workspace", children: [(0, h.jsxs)("div", { className: "page-heading", children: [(0, h.jsxs)("div", { children: [(0, h.jsx)("div", { className: "eyebrow", children: r === "arena" ? "THE BOARD IS YOURS" : r === "games" ? "FIND YOUR NEXT MOVE" : "PLAY IN GOOD COMPANY" }), (0, h.jsx)("h1", { children: r === "arena" ? "Every move, a mark." : r === "games" ? "Your games. All here." : "The wider arena." })] }), (0, h.jsxs)("button", { className: "primary", onClick: () => {
      b(""), g("new");
    }, children: [(0, h.jsx)(Ju, { size: 18 }), "New game"] })] }), m && (0, h.jsxs)("div", { className: "notice", role: "status", children: [(0, h.jsx)("span", { children: m }), (0, h.jsx)("button", { "aria-label": "Dismiss message", onClick: () => b(""), children: "\xD7" })] }), r === "arena" && (0, h.jsxs)("div", { className: "arena-layout", children: [(0, h.jsxs)("section", { className: "board-column", "aria-label": "Chess game", children: [(0, h.jsxs)("div", { className: "game-meta", children: [(0, h.jsxs)("span", { children: [(0, h.jsx)("span", { className: "live-dot" }), Ft ? "PASS & PLAY" : Mo ? "EVIDENCE REPLAY" : "ON-CHAIN GAME", " ", (0, h.jsx)("span", { className: "meta-divider", children: "/" }), " #", e.id.gameId.toString().padStart(4, "0")] }), (0, h.jsxs)("span", { children: [e.rules.ranked ? "Ranked \xB7 Elo 1" : "Casual", " ", (0, h.jsx)("span", { className: "meta-divider", children: "/" }), " ", e.rules.fen === Io ? "Standard" : "Custom position"] })] }), (0, h.jsxs)("div", { className: "player-row", children: [(0, h.jsx)("div", { className: "avatar dark-avatar", children: (0, h.jsx)(is, { size: 26 }) }), (0, h.jsxs)("div", { children: [(0, h.jsx)("strong", { children: Zo(i ? be.white : be.black) }), (0, h.jsxs)("span", { children: [i ? "White pieces" : "Black pieces", " \xB7", " ", Ft ? "Human \xB7 this device" : "Wallet seat"] })] }), (0, h.jsx)("div", { className: "player-badge", children: !be.result && be.turn === (i ? "w" : "b") ? "TO MOVE" : "\u25CF" })] }), (0, h.jsx)("div", { className: "board-frame", children: (0, h.jsx)("div", { className: "board", role: "grid", "aria-label": `Chessboard, ${i ? "black" : "white"} perspective`, children: of.flatMap((L, O) => xa.map((N, W) => {
      let _e = N + L, vt = Ct.get(_e), Pr = (N.charCodeAt(0) - 97 + L) % 2 === 1, Di = Vs.some((ba) => ba.to === _e), nf = qt.at(-1)?.entry;
      return (0, h.jsxs)("button", { role: "gridcell", tabIndex: _e === boardFocus.current ? 0 : -1, onFocus: (ev) => { boardFocus.current = _e; document.querySelectorAll("[data-square]").forEach(el => { el.tabIndex = el === ev.currentTarget ? 0 : -1; }); }, "data-square": _e, "aria-label": `${_e}${vt ? " " + (vt.color === "w" ? "white" : "black") + " " + Ym[vt.type] : ""}${Di ? " legal destination" : ""}`, "aria-selected": s === _e, className: "square " + (Pr ? "dark" : "light") + (s === _e ? " selected" : "") + (nf?.value?.slice(0, 2) === _e || nf?.value?.slice(2, 4) === _e ? " last-move" : "") + (vt?.type === "k" && vt.color === Ct.turn() && Ct.isCheck() ? " check-square" : ""), onClick: () => Wm(_e), draggable: !!vt, onDragStart: (ba) => {
        l(_e), ba.dataTransfer.setData("text/plain", _e);
      }, onDragOver: (ba) => ba.preventDefault(), onDrop: (ba) => {
        ba.preventDefault();
        let Nr = ba.dataTransfer.getData("text/plain"), Xs = Ct.moves({ square: Nr, verbose: true }).filter((Nn) => Nn.to === _e);
        Xs.some((Nn) => Nn.promotion) ? S({ from: Nr, to: _e }) : Xs.length ? _n(Nr + _e) : b("That destination is not legal.");
      }, onKeyDown: (ba) => {
        let Nr = { ArrowRight: 1, ArrowLeft: -1, ArrowUp: -8, ArrowDown: 8 };
        let index = O * 8 + W;
        if (ba.key === "Home") index = ba.ctrlKey ? 0 : O * 8;
        else if (ba.key === "End") index = ba.ctrlKey ? 63 : O * 8 + 7;
        else if (ba.key in Nr) index = Math.max(0, Math.min(63, index + Nr[ba.key]));
        else if (ba.key === "Escape") { l(void 0); return; }
        else return;
        ba.preventDefault(); document.querySelectorAll("[data-square]")[index]?.focus();
      }, children: [W === 0 && (0, h.jsx)("span", { className: "rank-label", children: L }), vt && rf(vt), Di && (0, h.jsx)("span", { className: vt ? "capture-ring" : "legal-dot" }), O === 7 && (0, h.jsx)("span", { className: "file-label", children: N })] }, _e);
    })) }) }), (0, h.jsxs)("div", { className: "player-row", children: [(0, h.jsx)("div", { className: "avatar light-avatar", children: (0, h.jsx)(is, { size: 26 }) }), (0, h.jsxs)("div", { children: [(0, h.jsx)("strong", { children: Zo(i ? be.black : be.white) }), (0, h.jsxs)("span", { children: [i ? "Black pieces" : "White pieces", " \xB7", " ", Ft ? "Human \xB7 this device" : "Wallet seat"] })] }), (0, h.jsx)("div", { className: "player-badge", children: !be.result && be.turn === (i ? "b" : "w") ? "TO MOVE" : "\u25CF" })] }), (0, h.jsxs)("div", { className: "board-toolbar", children: [(0, h.jsxs)("span", { children: [(0, h.jsx)(Fl, { size: 15 }), " ", Ft ? "Local replay \xB7 no fees" : Mo ? "Portable evidence \xB7 offline" : "Deterministic replay"] }), (0, h.jsxs)("div", { children: [(0, h.jsx)("button", { title: "Flip board", "aria-label": "Flip board", onClick: () => u(!i), children: (0, h.jsx)(Hu, { size: 18 }) }), (0, h.jsx)("button", { title: "Sound", "aria-label": w ? "Mute sound" : "Enable sound", onClick: () => M(!w), children: w ? (0, h.jsx)(sc, { size: 18 }) : (0, h.jsx)(lc, { size: 18 }) }), (0, h.jsx)("button", { title: "Manual", "aria-label": "Open manual", onClick: () => g("manual"), children: (0, h.jsx)(zu, { size: 18 }) })] })] })] }), (0, h.jsxs)("aside", { className: "game-sidebar", children: [(0, h.jsxs)("section", { className: "turn-card", children: [(0, h.jsxs)("div", { className: "eyebrow", children: [(0, h.jsx)("span", { className: "live-dot" }), be.result ? "GAME COMPLETE" : c !== null ? "REPLAY MODE" : "IN PLAY"] }), (0, h.jsx)("h2", { children: c !== null ? `Position after ${c} moves` : ae }), (0, h.jsx)("p", { children: be.result ? `Result ${be.result}. The complete record is ready to export.` : Ft ? "Take a seat. Select a piece and make your next move." : Mo ? "Browse this game without a network connection." : "Preview your move, then approve it in your wallet." }), f ? (0, h.jsxs)("div", { className: "move-preview", children: [(0, h.jsxs)("div", { children: [(0, h.jsx)("span", { children: "Your submission" }), (0, h.jsx)("strong", { children: f })] }), (0, h.jsx)("p", { children: Ft ? "Applied to this local practice board." : `App move fee: ${Fs(Ee?.fee ?? 0)}. Network fee shown by your wallet. Rebate: ${Ee ? Fs(Ee.rebate ?? 0) : "refreshed before signing"}. A competing transaction may make a paid move invalid.` }), e.rules.ranked && (0, h.jsx)("p", { children: "Ranked consent: accepted participation may count toward Elo." }), (0, h.jsxs)("button", { className: "primary full", disabled: Wo || y === "timeout", onClick: Qm, children: [Ft ? "Play move" : "Approve in wallet", (0, h.jsx)(xn, { size: 17 })] }), (0, h.jsx)("button", { className: "text-button", disabled: Wo, onClick: () => p(void 0), children: "Cancel preview" })] }) : !be.result && (0, h.jsxs)("div", { className: "turn-hint", children: [(0, h.jsx)("span", { className: be.turn === "w" ? "colour-dot white-dot" : "colour-dot" }), be.turn === "w" ? "White" : "Black", " has the move", (0, h.jsx)(ls, { size: 18 })] }), y !== "idle" && (0, h.jsxs)("div", { className: "transaction", role: "status", children: [(0, h.jsxs)("strong", { children: [Ft ? "Local move" : "Transaction", " \xB7 ", y] }), D && (0, h.jsx)("small", { children: D }), (y === "timeout" || y === "failed") && (0, h.jsx)("button", { onClick: $m, children: "Check transaction again" })] })] }), (0, h.jsx)("section", { className: "record-card", children: (0, h.jsxs)(ub, { defaultValue: "moves", children: [(0, h.jsxs)(cb, { children: [(0, h.jsxs)(ei, { value: "moves", children: ["Moves ", (0, h.jsx)("span", { className: "count", children: qt.length })] }), (0, h.jsx)(ei, { value: "record", children: "Record" })] }), (0, h.jsxs)(ti, { value: "moves", children: [(0, h.jsxs)("div", { className: "move-list", children: [!qt.length && (0, h.jsxs)("div", { className: "empty-small", children: ["A fresh board.", (0, h.jsx)("br", {}), "The first move is yours."] }), Array.from({ length: Math.ceil(qt.length / 2) }, (L, O) => (0, h.jsxs)("div", { className: "move-row", children: [(0, h.jsxs)("span", { children: [O + 1, "."] }), qt.slice(O * 2, O * 2 + 2).map((N, W) => (0, h.jsx)("button", { className: c === O * 2 + W + 1 || c === null && O * 2 + W === qt.length - 1 ? "current-move" : "", onClick: () => d(O * 2 + W + 1), children: N.san }, N.seq))] }, O))] }), (0, h.jsxs)("div", { className: "replay-controls", children: [(0, h.jsx)("button", { "aria-label": "Starting position", onClick: () => d(0), children: (0, h.jsx)(Yu, { size: 19 }) }), (0, h.jsx)("button", { "aria-label": "Previous move", onClick: () => d(Math.max(0, (c ?? qt.length) - 1)), children: (0, h.jsx)(Xu, { size: 19 }) }), (0, h.jsx)("span", { children: c === null ? "Live position" : `${c} / ${qt.length}` }), (0, h.jsx)("button", { "aria-label": "Next move", onClick: () => d(Math.min(qt.length, (c ?? qt.length) + 1)), children: (0, h.jsx)(Ku, { size: 19 }) }), (0, h.jsx)("button", { "aria-label": "Live position", onClick: () => d(null), children: (0, h.jsx)(Zu, { size: 19 }) })] })] }), (0, h.jsx)(ti, { value: "record", children: (0, h.jsxs)("div", { className: "record-details", children: [(0, h.jsxs)("p", { children: [e.count, " submissions \xB7", " ", be.verdicts.filter((L) => !L.accepted).length, " rejected"] }), (0, h.jsxs)("p", { children: ["Identity ", (0, h.jsx)("code", { children: Aa(e.id) })] }), (0, h.jsxs)("p", { children: ["Rules ", e.rules.rules, " / Replay ", e.rules.replay, " / Controls ", e.rules.controls] }), (0, h.jsx)("p", { children: e.provenance.source === "node" ? "Read from a replaceable node. Inclusion is not independently proven." : "Local or imported evidence. Chain provenance is not independently proven." }), (0, h.jsxs)("details", { children: [(0, h.jsx)("summary", { children: "Rules and provenance" }), (0, h.jsx)("pre", { children: JSON.stringify({ rules: e.rules, provenance: e.provenance }, null, 2) })] }), (0, h.jsx)("button", { className: "secondary", onClick: () => g("funding"), children: "Sponsorship & settlement" }), (0, h.jsxs)("details", { children: [(0, h.jsx)("summary", { children: "All submissions" }), e.count > 200 && (0, h.jsxs)("p", { children: ["Showing the latest 200 submissions. The evidence export retains all ", e.count, " entries."] }), be.verdicts.slice(-200).map((L) => (0, h.jsxs)("p", { children: [(0, h.jsxs)("code", { children: ["#", L.seq, " ", L.entry?.value] }), " ", "\xB7 ", L.reason] }, L.seq))] })] }) })] }) }), (0, h.jsxs)("div", { className: "game-actions", children: [(0, h.jsxs)("button", { disabled: !!be.result || Wo, onClick: () => Mi("draw?"), children: [(0, h.jsx)($u, { size: 16 }), "Offer draw"] }), be.drawOffer && (0, h.jsx)("button", { onClick: () => Mi("draw!"), children: "Accept draw" }), (0, h.jsxs)("button", { disabled: !!be.result || Wo, onClick: () => Mi("resgn"), children: [(0, h.jsx)(Qu, { size: 16 }), "Resign"] })] }), (0, h.jsxs)("div", { className: "export-row", children: [(0, h.jsxs)("button", { onClick: () => yT("x-chess-" + e.id.gameId + ".pgn", be.pgn ?? "", "application/x-chess-pgn"), children: [(0, h.jsx)(Wu, { size: 15 }), "PGN"] }), (0, h.jsxs)("button", { onClick: () => yT("x-chess-" + e.id.gameId + ".json", JSON.stringify(uT(e), null, 2)), children: [(0, h.jsx)(Fl, { size: 15 }), "Evidence bundle"] })] }), (0, h.jsxs)("div", { className: "permanence-note", children: [(0, h.jsx)("span", { children: "BUILT TO OUTLIVE THE INTERFACE" }), (0, h.jsxs)("p", { children: ["Every submission is evidence.", (0, h.jsx)("br", {}), "Replay tells the story."] })] })] })] }), r === "games" && (0, h.jsxs)("section", { className: "discovery", children: [(0, h.jsxs)("div", { className: "search-bar", children: [(0, h.jsx)(ac, { size: 19 }), (0, h.jsx)("input", { "aria-label": "Search games", placeholder: "Search a wallet, game number, result or match reference", value: T, onChange: (L) => K(L.target.value) })] }), (0, h.jsxs)("div", { className: "filter-row", children: [[["all", "All games"], ["yours", "Your turn"], ["playing", "In play"], ["finished", "Finished"]].map(([L, O]) => (0, h.jsx)("button", { className: z === L ? "selected-filter" : "", onClick: () => Y(L), children: O }, L)), (0, h.jsxs)("button", { onClick: () => Lt.current?.click(), children: [(0, h.jsx)(us, { size: 15 }), "Import evidence"] }), (0, h.jsxs)("button", { onClick: () => g("network"), children: [(0, h.jsx)(ec, { size: 15 }), "Open on-chain game"] })] }), (0, h.jsxs)("div", { className: "game-grid", children: [af.map((L, O) => {
      let N = Ta(L.rules, L.entries, L.count);
      return (0, h.jsxs)("button", { className: "game-tile", onClick: () => Lo(L), children: [(0, h.jsxs)("div", { children: [(0, h.jsx)("span", { className: "eyebrow", children: L.provenance.source === "local" ? "LOCAL PRACTICE" : L.provenance.source === "bundle" ? "IMPORTED EVIDENCE" : L.id.network.toUpperCase() }), (0, h.jsxs)("span", { children: ["#", L.id.gameId] })] }), (0, h.jsxs)("h3", { children: [Zo(N.white), " ", (0, h.jsx)("span", { children: "vs" }), (0, h.jsx)("br", {}), Zo(N.black)] }), (0, h.jsxs)("p", { children: [N.result ?? `${N.turn === "w" ? "White" : "Black"} to move`, " ", "\xB7 ", L.count, " submissions"] }), (0, h.jsxs)("div", { className: "tile-bottom", children: [L.rules.match || "Casual board", (0, h.jsx)(ls, { size: 19 })] })] }, O);
    }), !af.length && (0, h.jsx)("p", { className: "empty-small", children: "No matching games loaded. Open a game or load the next discovery page." })] }), (0, h.jsxs)("button", { className: "secondary", disabled: ce, onClick: Pn, children: [(0, h.jsx)(tc, { size: 16 }), ce ? "Verifying\u2026" : `Load chain page ${ue + 1}`] }), (0, h.jsx)("p", { className: "muted", children: "Discovery scans every page, including old unfinished games. Wallet filters apply to loaded evidence." })] }), r === "community" && (0, h.jsx)("section", { children: (0, h.jsxs)(ub, { defaultValue: "tournaments", children: [(0, h.jsxs)(cb, { children: [(0, h.jsx)(ei, { value: "tournaments", children: "Tournaments" }), (0, h.jsx)(ei, { value: "ratings", children: "Rankings" }), (0, h.jsx)(ei, { value: "profiles", children: "Players & AI" })] }), (0, h.jsx)(ti, { value: "tournaments", children: (0, h.jsxs)("div", { className: "community-card", children: [(0, h.jsx)(rc, { size: 35 }), (0, h.jsx)("h2", { children: "A competition with a permanent record." }), (0, h.jsx)("p", { children: "Import a tournament manifest to verify pairings against the games you have loaded. Standings follow the accepted results." }), (0, h.jsxs)("button", { className: "primary", onClick: () => Me.current?.click(), children: [(0, h.jsx)(us, { size: 17 }), "Import manifest"] }), U && (0, h.jsxs)(h.Fragment, { children: [(0, h.jsx)("h3", { children: U.title }), (0, h.jsxs)("p", { children: [U.kind, " \xB7 Author claim ", Zo(U.author)] }), it && "error" in it ? (0, h.jsx)("p", { children: it.error }) : it && (0, h.jsxs)(h.Fragment, { children: [(0, h.jsx)("p", { children: "Authorship requires mint provenance verification." }), (0, h.jsxs)("table", { children: [(0, h.jsx)("thead", { children: (0, h.jsxs)("tr", { children: [(0, h.jsx)("th", { children: "Player" }), (0, h.jsx)("th", { children: "Score" }), (0, h.jsx)("th", { children: "Buchholz" })] }) }), (0, h.jsx)("tbody", { children: it.standings.map((L) => (0, h.jsxs)("tr", { children: [(0, h.jsx)("td", { children: L.name }), (0, h.jsx)("td", { children: L.points }), (0, h.jsx)("td", { children: L.buchholz })] }, L.address)) })] }), it.pairings.map((L, O) => (0, h.jsxs)("p", { children: ["Round ", L.round, " \xB7 ", Zo(L.white), " /", " ", Zo(L.black), " \xB7 ", L.status] }, O))] })] })] }) }), (0, h.jsx)(ti, { value: "ratings", children: (0, h.jsxs)("div", { className: "community-card", children: [(0, h.jsx)("h2", { children: "Ratings for loaded verified games." }), (0, h.jsx)("p", { children: "Initial 1200 \xB7 K 32 \xB7 provisional through game 9. Imported provenance remains a claim. Ratings do not prove human identity or fair play." }), Fa.length ? (0, h.jsxs)("table", { children: [(0, h.jsx)("thead", { children: (0, h.jsxs)("tr", { children: [(0, h.jsx)("th", { children: "Player" }), (0, h.jsx)("th", { children: "Elo" }), (0, h.jsx)("th", { children: "Games" })] }) }), (0, h.jsx)("tbody", { children: Fa.map((L) => (0, h.jsxs)("tr", { children: [(0, h.jsx)("td", { children: Zo(L.address) }), (0, h.jsxs)("td", { children: [L.rating, L.provisional ? " P" : ""] }), (0, h.jsx)("td", { children: L.games })] }, L.address)) })] }) : (0, h.jsxs)("div", { className: "empty-small", children: ["No eligible terminal games loaded.", (0, h.jsx)("br", {}), "Local practice games are excluded."] })] }) }), (0, h.jsx)(ti, { value: "profiles", children: (0, h.jsxs)("div", { className: "community-card", children: [(0, h.jsx)(nc, { size: 35 }), (0, h.jsx)("h2", { children: "Know who is across the board." }), (0, h.jsx)("p", { children: "Wallets identify seats. Tournament metadata labels humans, AI characters and their operators separately; those labels are claims." }), U?.entrants.map((L) => (0, h.jsxs)("article", { className: "profile", children: [(0, h.jsx)("strong", { children: L.name }), (0, h.jsx)("span", { children: L.kind === "ai" ? "AI character \xB7 operator " + Zo(L.operator) : "Human player (declared)" }), (0, h.jsx)("code", { children: L.address }), L.artifact && (0, h.jsx)("code", { children: L.artifact })] }, L.address)), (0, h.jsx)("p", { children: "No house opponent is running. AI seats require an independently operated runner." })] }) })] }) }), (0, h.jsxs)("footer", { children: [(0, h.jsxs)("span", { children: ["X-CHESS ", (0, h.jsx)("span", { className: "meta-divider", children: "/" }), " A permanent game. An open arena."] }), (0, h.jsxs)("button", { onClick: () => g("manual"), children: ["How to play ", (0, h.jsx)(ls, { size: 14 })] })] })] }), (0, h.jsx)("input", { ref: Lt, type: "file", accept: ".json", hidden: true, onChange: async (L) => {
      try {
        let O = L.target.files?.[0];
        if (O) {
          let N = cT(await O.text());
          Lo(N), oo(N), b("Evidence imported. Replay is available offline; provenance is not independently authenticated.");
        }
      } catch (O) {
        b(O.message);
      }
      L.target.value = "";
    } }), (0, h.jsx)("input", { ref: Me, type: "file", accept: ".json", hidden: true, onChange: async (L) => {
      try {
        let O = L.target.files?.[0];
        if (O) {
          if (O.size > 1e6) throw Error("Manifest too large");
          let N = JSON.parse(await O.text());
          yy(N, a), gt(N);
        }
      } catch (O) {
        b(O.message);
      }
      L.target.value = "";
    } }), (0, h.jsx)(Q0, { open: !!x, onOpenChange: (L) => !L && S(void 0), children: (0, h.jsxs)($0, { children: [(0, h.jsx)(J0, { children: "Choose your promotion" }), (0, h.jsx)(eb, { children: "Your pawn has reached the final rank." }), (0, h.jsx)("div", { className: "promotion-options", children: ["q", "r", "b", "n"].map((L) => (0, h.jsxs)("button", { "aria-label": "Promote to " + Ym[L], onClick: () => {
      _n(x.from + x.to + L), S(void 0);
    }, children: [rf({ type: L, color: Ct.turn() }), (0, h.jsx)("span", { children: Ym[L] })] }, L)) })] }) }), (0, h.jsx)(Q0, { open: !!v, onOpenChange: (L) => !L && !Wo && g(void 0), children: (0, h.jsxs)($0, { className: v === "new" ? "wide-dialog" : "", children: [(0, h.jsx)(J0, { children: { new: "Make your opening.", wallet: "Connect a wallet", network: "Open a network game", manual: "A small manual. A lasting game.", "create-preview": "Review before signing", funding: "Manage sponsorship" }[v ?? ""] }), (0, h.jsx)(eb, { children: v === "wallet" ? "Choose the wallet you want to use. Read-only access needs no wallet." : v === "new" ? "Set the seats and rules. Everything is committed before the first move." : v === "network" ? "Use a compatible X-Chess v2 development contract. Historical adapters are disabled." : "" }), m && (0, h.jsx)("p", { role: "status", className: "form-error", children: m }), v === "funding" && (0, h.jsx)(xT, { game: e, wallet: J, provider: Ri }), v === "wallet" && (0, h.jsxs)(h.Fragment, { children: [(0, h.jsx)("div", { className: "wallet-options", children: Qc().map((L) => (0, h.jsxs)("button", { className: "secondary", onClick: () => A(L.name), children: [(0, h.jsx)(cs, { size: 19 }), L.name, (0, h.jsx)(xn, { size: 18 })] }, L.name)) }), !Qc().length && (0, h.jsx)("p", { children: "No compatible wallet is currently injected. Open this page in a wallet-enabled browser, then reopen this dialog. The board remains available for local play." }), (0, h.jsx)("button", { className: "text-button", onClick: () => {
      Ie(void 0), he(void 0), g(void 0);
    }, children: "Continue without a wallet" })] }), v === "network" && (0, h.jsxs)(h.Fragment, { children: [(0, h.jsxs)("label", { children: ["Network", (0, h.jsxs)("select", { value: $.network, onChange: (L) => {
      let O = L.target.value;
      et({ ...$, network: O, endpoint: O === "devnet" ? "http://localhost:3999" : `https://api.${O}.hiro.so` }), Ie(void 0);
    }, children: [(0, h.jsx)("option", { children: "devnet" }), (0, h.jsx)("option", { children: "testnet" }), (0, h.jsx)("option", { children: "mainnet" })] })] }), (0, h.jsxs)("label", { children: ["Contract principal", (0, h.jsx)("input", { value: $.contract, onChange: (L) => et({ ...$, contract: L.target.value }) })] }), (0, h.jsxs)("label", { children: ["Read endpoint", (0, h.jsx)("input", { value: $.endpoint, onChange: (L) => et({ ...$, endpoint: L.target.value }) })] }), (0, h.jsxs)("label", { children: ["Game ID", (0, h.jsx)("input", { type: "number", min: "0", value: $.gameId, onChange: (L) => et({ ...$, gameId: L.target.value }) })] }), (0, h.jsxs)("button", { className: "primary", disabled: ce, onClick: () => {
      g(void 0), ef({ network: $.network, contract: $.contract, gameId: Number($.gameId) }, $.endpoint);
    }, children: ["Recover game", (0, h.jsx)(xn, { size: 17 })] }), (0, h.jsx)("button", { onClick: () => Lt.current?.click(), className: "secondary", children: "Import offline evidence" }), (0, h.jsx)("p", { className: "muted", children: "An explicit endpoint is preserved in shared links. Reads fail closed on network mismatch or inconsistent evidence." })] }), v === "new" && (0, h.jsxs)(h.Fragment, { children: [(0, h.jsx)("div", { className: "segmented", children: [["challenge", "Challenge"], ["open", "Open seat"], ["community", "Community"]].map(([L, O]) => (0, h.jsx)("button", { className: Ne === L ? "active" : "", onClick: () => lt(L), children: O }, L)) }), Ne === "challenge" && (0, h.jsxs)("label", { children: ["Opponent wallet", (0, h.jsx)("input", { placeholder: "ST\u2026 or SP\u2026 principal", value: He, onChange: (L) => Tt(L.target.value.trim()) }), (0, h.jsx)("small", { children: "Enter a validated principal. Name resolution is not enabled in this build." })] }), Ne !== "community" && (0, h.jsxs)("label", { children: ["Your colour", (0, h.jsxs)("select", { value: te, onChange: (L) => ke(L.target.value), children: [(0, h.jsx)("option", { value: "white", children: "White \u2014 first move" }), (0, h.jsx)("option", { value: "black", children: "Black" })] })] }), Ne === "community" && (0, h.jsx)("p", { children: "Anyone may claim a seat with their first accepted move. Both seats then remain bound to those players." }), (0, h.jsxs)("label", { children: ["Game type", (0, h.jsxs)("select", { value: H.ranked ? "ranked" : "casual", onChange: (L) => ee({ ...H, ranked: L.target.value === "ranked" }), children: [(0, h.jsx)("option", { value: "casual", children: "Casual" }), (0, h.jsx)("option", { value: "ranked", children: "Ranked \u2014 both players consent through participation" })] })] }), (0, h.jsxs)("label", { className: "check-label", children: [(0, h.jsx)("input", { type: "checkbox", checked: Dt, onChange: (L) => ge(L.target.checked) }), "Sponsor onboarding"] }), Dt && (0, h.jsxs)("div", { className: "sponsor-form", children: [(0, h.jsxs)("label", { children: ["Named beneficiary", (0, h.jsx)("input", { value: rt, onChange: (L) => zt(L.target.value.trim()), placeholder: He || "Validated wallet address" })] }), (0, h.jsx)("div", { className: "form-grid", children: [["bootstrap", "Bootstrap (STX)"], ["rebate", "Rebate per submission (STX)"], ["count", "Number of rebates"], ["expiry", "Expiry Stacks height"]].map(([L, O]) => (0, h.jsxs)("label", { children: [O, (0, h.jsx)("input", { type: "number", min: "0", step: L === "bootstrap" || L === "rebate" ? "0.001" : "1", value: ze[L], onChange: (N) => ea({ ...ze, [L]: N.target.value }) })] }, L)) }), (0, h.jsxs)("label", { className: "check-label", children: [(0, h.jsx)("input", { type: "checkbox", checked: je, onChange: (L) => pe(L.target.checked) }), "Also sponsor my wallet on the same terms"] }), (0, h.jsx)("p", { children: "Invalid stored submissions also consume rebates. Expiry ends payouts. Unused funds go to treasury; rebates do not guarantee free moves." })] }), (0, h.jsxs)("details", { className: "advanced", children: [(0, h.jsx)("summary", { children: "Advanced rules" }), (0, h.jsxs)("label", { children: ["Starting FEN", (0, h.jsx)("input", { value: H.fen, onChange: (L) => ee({ ...H, fen: L.target.value }) })] }), (0, h.jsxs)("label", { children: ["Allow list (one principal per line)", (0, h.jsx)("textarea", { value: H.allow.join(`
`), onChange: (L) => ee({ ...H, allow: L.target.value.split(`
`).map((O) => O.trim()).filter(Boolean).sort() }) })] }), (0, h.jsxs)("label", { children: ["Other accepted moves required between your moves", (0, h.jsxs)("select", { value: H.cooldown, onChange: (L) => ee({ ...H, cooldown: Number(L.target.value) }), children: [(0, h.jsx)("option", { value: "0", children: "0" }), (0, h.jsx)("option", { value: "1", children: "1" })] })] }), (0, h.jsxs)("label", { children: ["Match / competition reference", (0, h.jsx)("input", { maxLength: 128, value: H.match, onChange: (L) => ee({ ...H, match: L.target.value }) })] }), (0, h.jsxs)("label", { className: "check-label", children: [(0, h.jsx)("input", { type: "checkbox", checked: H.noConsecutive, onChange: (L) => ee({ ...H, noConsecutive: L.target.checked }) }), "Prevent consecutive moves by one sender"] })] }), (0, h.jsxs)("button", { className: "primary full", onClick: js, children: [J ? "Review rules & current costs" : "Create local practice game", (0, h.jsx)(xn, { size: 17 })] }), !J && (0, h.jsx)("p", { className: "muted", children: "Local practice is not permanent or ranked. Connect a wallet for on-chain play." })] }), v === "create-preview" && Ee && (0, h.jsxs)(h.Fragment, { children: [(0, h.jsxs)("p", { children: [(0, h.jsx)("strong", { children: "White" }), " ", (0, h.jsx)("code", { children: Ee.rules.white })] }), (0, h.jsxs)("p", { children: [(0, h.jsx)("strong", { children: "Black" }), " ", (0, h.jsx)("code", { children: Ee.rules.black })] }), (0, h.jsxs)("p", { children: [Ee.rules.ranked ? "Ranked consent is committed" : "Casual game", " ", "\xB7 Rules 1 / Replay 2"] }), (0, h.jsxs)("details", { children: [(0, h.jsx)("summary", { children: "Review every committed rule" }), (0, h.jsx)("pre", { children: JSON.stringify(Ee.rules, null, 2) })] }), (0, h.jsxs)("p", { children: ["Opening fee: ", (0, h.jsx)("strong", { children: Fs(Ee.fee) })] }), (0, h.jsxs)("p", { children: ["Bootstrap + reserves:", " ", (0, h.jsx)("strong", { children: Fs(Ee.sponsors.reduce((L, O) => L + O.bootstrap + O.rebate * O.count, 0)) })] }), Ee.sponsors.map((L) => (0, h.jsxs)("p", { children: [(0, h.jsx)("code", { children: L.beneficiary }), (0, h.jsx)("br", {}), "Bootstrap: ", Fs(L.bootstrap), " \xB7 Reserve:", " ", Fs(L.rebate * L.count), (0, h.jsx)("br", {}), L.count, " rebates \xD7 ", Fs(L.rebate), " \xB7 expires at height", " ", L.expiry] }, L.beneficiary)), (0, h.jsx)("p", { children: "Network fee: wallet estimate before approval. A changed contract quote aborts the opening." }), (0, h.jsxs)("button", { className: "primary full", disabled: Wo || y === "timeout", onClick: q, children: ["Approve opening in wallet", (0, h.jsx)(cs, { size: 17 })] }), (0, h.jsxs)("p", { role: "status", children: [y, " ", D] })] }), v === "manual" && (0, h.jsxs)("div", { className: "manual", children: [(0, h.jsx)("h3", { children: "Play the board" }), (0, h.jsx)("p", { children: "Click a piece, then a legal destination. Drag and drop also works. Use arrow keys to move focus and Enter to select. Choose a piece when promoting. Flip the board using the arrows below it." }), (0, h.jsx)("h3", { children: "Understand a transaction" }), (0, h.jsx)("p", { children: "Preview \u2192 wallet approval \u2192 broadcast \u2192 pending \u2192 confirmed \u2192 accepted or rejected by replay. A transaction ID is not confirmation. Another transaction can arrive first, so an invalid move can still cost network fees." }), (0, h.jsx)("h3", { children: "Know the rules" }), (0, h.jsx)("p", { children: "Seats bind only after an accepted move, or are named at creation. Rejected moves never claim a seat. Resignation and draw agreement require a bound player. Draw offers clear after an accepted move. Threefold repetition and 100 halfmoves automatically end a game. Two knights versus a king is not automatically drawn." }), (0, h.jsx)("h3", { children: "Keep the record" }), (0, h.jsx)("p", { children: "Export PGN for chess tools, or an evidence bundle for offline replay. Rules are stored on chain before play. Game identity includes network, contract and game number; identical-rules rematches are different games." }), (0, h.jsx)("h3", { children: "Sponsorship & permanence" }), (0, h.jsx)("p", { children: "Opening and network fees are separate. Sponsorship sends a bootstrap to a named wallet and reserves limited rebates. Expiry ends payouts; settlement releases leftovers to treasury. This local release is a development candidate, not a deployed inscription." }), (0, h.jsxs)("button", { className: "secondary", onClick: () => Lt.current?.click(), children: [(0, h.jsx)(us, { size: 16 }), "Import an evidence bundle"] })] })] }) })] });
  }
  var ST = "__XCHESS_ROOT_V2__";
  function CT() {
    let e = document.getElementById("x-chess-root");
    if (!e) return;
    let t = window[ST];
    if (t?.el === e) return;
    t?.root.unmount();
    let a = (0, LT.createRoot)(e);
    window[ST] = { el: e, root: a }, a.render((0, h.jsx)(S5, {}));
  }
  window.XChessAudit = { Chess: gn, replay: Ta, rules: hy, reader: jm, parseLink: lT, connect: dT, providers: Qc, exportBundle: uT, importBundle: cT, demo: bT };
  window.XChessBoot = CT;
  CT();
})();
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

use-sync-external-store/cjs/use-sync-external-store-shim.production.js:
  (**
   * @license React
   * use-sync-external-store-shim.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.production.js:
  (**
   * @license React
   * use-sync-external-store-shim/with-selector.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

@noble/hashes/utils.js:
@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

chess.js/dist/esm/chess.js:
  (**
   * @license
   * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   *    this list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the documentation
   *    and/or other materials provided with the distribution.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide-react/dist/esm/defaultAttributes.mjs:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide-react/dist/esm/context.mjs:
lucide-react/dist/esm/Icon.mjs:
lucide-react/dist/esm/createLucideIcon.mjs:
lucide-react/dist/esm/icons/arrow-left-right.mjs:
lucide-react/dist/esm/icons/arrow-right.mjs:
lucide-react/dist/esm/icons/arrow-up-right.mjs:
lucide-react/dist/esm/icons/book-open.mjs:
lucide-react/dist/esm/icons/chess-bishop.mjs:
lucide-react/dist/esm/icons/chess-king.mjs:
lucide-react/dist/esm/icons/chess-knight.mjs:
lucide-react/dist/esm/icons/chess-pawn.mjs:
lucide-react/dist/esm/icons/chess-queen.mjs:
lucide-react/dist/esm/icons/chess-rook.mjs:
lucide-react/dist/esm/icons/chevron-left.mjs:
lucide-react/dist/esm/icons/chevron-right.mjs:
lucide-react/dist/esm/icons/chevrons-left.mjs:
lucide-react/dist/esm/icons/chevrons-right.mjs:
lucide-react/dist/esm/icons/download.mjs:
lucide-react/dist/esm/icons/flag.mjs:
lucide-react/dist/esm/icons/handshake.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/radio.mjs:
lucide-react/dist/esm/icons/refresh-cw.mjs:
lucide-react/dist/esm/icons/search.mjs:
lucide-react/dist/esm/icons/settings-2.mjs:
lucide-react/dist/esm/icons/shield-check.mjs:
lucide-react/dist/esm/icons/trophy.mjs:
lucide-react/dist/esm/icons/upload.mjs:
lucide-react/dist/esm/icons/users.mjs:
lucide-react/dist/esm/icons/volume-2.mjs:
lucide-react/dist/esm/icons/volume-x.mjs:
lucide-react/dist/esm/icons/wallet.mjs:
lucide-react/dist/esm/icons/x.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.31.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

@noble/secp256k1/lib/esm/index.js:
  (*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)
*/
