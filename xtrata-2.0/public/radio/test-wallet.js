var du = Object.defineProperty;
var pu = (e, t, n) => t in e ? du(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Mi = (e, t, n) => pu(e, typeof t != "symbol" ? t + "" : t, n);
var fn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Vo(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ro = { exports: {} };
(function(e, t) {
  var n = function() {
    var r = function(v, I) {
      var E = 236, B = 17, S = v, u = s[I], d = null, a = 0, b = null, y = [], x = {}, j = function(P, O) {
        a = S * 4 + 17, d = function(L) {
          for (var M = new Array(L), D = 0; D < L; D += 1) {
            M[D] = new Array(L);
            for (var W = 0; W < L; W += 1)
              M[D][W] = null;
          }
          return M;
        }(a), V(0, 0), V(a - 7, 0), V(0, a - 7), U(), A(), ie(P, O), S >= 7 && se(P), b == null && (b = ke(S, u, y)), q(b, O);
      }, V = function(P, O) {
        for (var L = -1; L <= 7; L += 1)
          if (!(P + L <= -1 || a <= P + L))
            for (var M = -1; M <= 7; M += 1)
              O + M <= -1 || a <= O + M || (0 <= L && L <= 6 && (M == 0 || M == 6) || 0 <= M && M <= 6 && (L == 0 || L == 6) || 2 <= L && L <= 4 && 2 <= M && M <= 4 ? d[P + L][O + M] = !0 : d[P + L][O + M] = !1);
      }, G = function() {
        for (var P = 0, O = 0, L = 0; L < 8; L += 1) {
          j(!0, L);
          var M = c.getLostPoint(x);
          (L == 0 || P > M) && (P = M, O = L);
        }
        return O;
      }, A = function() {
        for (var P = 8; P < a - 8; P += 1)
          d[P][6] == null && (d[P][6] = P % 2 == 0);
        for (var O = 8; O < a - 8; O += 1)
          d[6][O] == null && (d[6][O] = O % 2 == 0);
      }, U = function() {
        for (var P = c.getPatternPosition(S), O = 0; O < P.length; O += 1)
          for (var L = 0; L < P.length; L += 1) {
            var M = P[O], D = P[L];
            if (d[M][D] == null)
              for (var W = -2; W <= 2; W += 1)
                for (var Q = -2; Q <= 2; Q += 1)
                  W == -2 || W == 2 || Q == -2 || Q == 2 || W == 0 && Q == 0 ? d[M + W][D + Q] = !0 : d[M + W][D + Q] = !1;
          }
      }, se = function(P) {
        for (var O = c.getBCHTypeNumber(S), L = 0; L < 18; L += 1) {
          var M = !P && (O >> L & 1) == 1;
          d[Math.floor(L / 3)][L % 3 + a - 8 - 3] = M;
        }
        for (var L = 0; L < 18; L += 1) {
          var M = !P && (O >> L & 1) == 1;
          d[L % 3 + a - 8 - 3][Math.floor(L / 3)] = M;
        }
      }, ie = function(P, O) {
        for (var L = u << 3 | O, M = c.getBCHTypeInfo(L), D = 0; D < 15; D += 1) {
          var W = !P && (M >> D & 1) == 1;
          D < 6 ? d[D][8] = W : D < 8 ? d[D + 1][8] = W : d[a - 15 + D][8] = W;
        }
        for (var D = 0; D < 15; D += 1) {
          var W = !P && (M >> D & 1) == 1;
          D < 8 ? d[8][a - D - 1] = W : D < 9 ? d[8][15 - D - 1 + 1] = W : d[8][15 - D - 1] = W;
        }
        d[a - 8][8] = !P;
      }, q = function(P, O) {
        for (var L = -1, M = a - 1, D = 7, W = 0, Q = c.getMaskFunction(O), Y = a - 1; Y > 0; Y -= 2)
          for (Y == 6 && (Y -= 1); ; ) {
            for (var ye = 0; ye < 2; ye += 1)
              if (d[M][Y - ye] == null) {
                var Se = !1;
                W < P.length && (Se = (P[W] >>> D & 1) == 1);
                var te = Q(M, Y - ye);
                te && (Se = !Se), d[M][Y - ye] = Se, D -= 1, D == -1 && (W += 1, D = 7);
              }
            if (M += L, M < 0 || a <= M) {
              M -= L, L = -L;
              break;
            }
          }
      }, oe = function(P, O) {
        for (var L = 0, M = 0, D = 0, W = new Array(O.length), Q = new Array(O.length), Y = 0; Y < O.length; Y += 1) {
          var ye = O[Y].dataCount, Se = O[Y].totalCount - ye;
          M = Math.max(M, ye), D = Math.max(D, Se), W[Y] = new Array(ye);
          for (var te = 0; te < W[Y].length; te += 1)
            W[Y][te] = 255 & P.getBuffer()[te + L];
          L += ye;
          var Re = c.getErrorCorrectPolynomial(Se), $e = g(W[Y], Re.getLength() - 1), _n = $e.mod(Re);
          Q[Y] = new Array(Re.getLength() - 1);
          for (var te = 0; te < Q[Y].length; te += 1) {
            var er = te + _n.getLength() - Q[Y].length;
            Q[Y][te] = er >= 0 ? _n.getAt(er) : 0;
          }
        }
        for (var tr = 0, te = 0; te < O.length; te += 1)
          tr += O[te].totalCount;
        for (var et = new Array(tr), At = 0, te = 0; te < M; te += 1)
          for (var Y = 0; Y < O.length; Y += 1)
            te < W[Y].length && (et[At] = W[Y][te], At += 1);
        for (var te = 0; te < D; te += 1)
          for (var Y = 0; Y < O.length; Y += 1)
            te < Q[Y].length && (et[At] = Q[Y][te], At += 1);
        return et;
      }, ke = function(P, O, L) {
        for (var M = p.getRSBlocks(P, O), D = h(), W = 0; W < L.length; W += 1) {
          var Q = L[W];
          D.put(Q.getMode(), 4), D.put(Q.getLength(), c.getLengthInBits(Q.getMode(), P)), Q.write(D);
        }
        for (var Y = 0, W = 0; W < M.length; W += 1)
          Y += M[W].dataCount;
        if (D.getLengthInBits() > Y * 8)
          throw "code length overflow. (" + D.getLengthInBits() + ">" + Y * 8 + ")";
        for (D.getLengthInBits() + 4 <= Y * 8 && D.put(0, 4); D.getLengthInBits() % 8 != 0; )
          D.putBit(!1);
        for (; !(D.getLengthInBits() >= Y * 8 || (D.put(E, 8), D.getLengthInBits() >= Y * 8)); )
          D.put(B, 8);
        return oe(D, M);
      };
      x.addData = function(P, O) {
        O = O || "Byte";
        var L = null;
        switch (O) {
          case "Numeric":
            L = m(P);
            break;
          case "Alphanumeric":
            L = w(P);
            break;
          case "Byte":
            L = T(P);
            break;
          case "Kanji":
            L = k(P);
            break;
          default:
            throw "mode:" + O;
        }
        y.push(L), b = null;
      }, x.isDark = function(P, O) {
        if (P < 0 || a <= P || O < 0 || a <= O)
          throw P + "," + O;
        return d[P][O];
      }, x.getModuleCount = function() {
        return a;
      }, x.make = function() {
        if (S < 1) {
          for (var P = 1; P < 40; P++) {
            for (var O = p.getRSBlocks(P, u), L = h(), M = 0; M < y.length; M++) {
              var D = y[M];
              L.put(D.getMode(), 4), L.put(D.getLength(), c.getLengthInBits(D.getMode(), P)), D.write(L);
            }
            for (var W = 0, M = 0; M < O.length; M++)
              W += O[M].dataCount;
            if (L.getLengthInBits() <= W * 8)
              break;
          }
          S = P;
        }
        j(!1, G());
      }, x.createTableTag = function(P, O) {
        P = P || 2, O = typeof O > "u" ? P * 4 : O;
        var L = "";
        L += '<table style="', L += " border-width: 0px; border-style: none;", L += " border-collapse: collapse;", L += " padding: 0px; margin: " + O + "px;", L += '">', L += "<tbody>";
        for (var M = 0; M < x.getModuleCount(); M += 1) {
          L += "<tr>";
          for (var D = 0; D < x.getModuleCount(); D += 1)
            L += '<td style="', L += " border-width: 0px; border-style: none;", L += " border-collapse: collapse;", L += " padding: 0px; margin: 0px;", L += " width: " + P + "px;", L += " height: " + P + "px;", L += " background-color: ", L += x.isDark(M, D) ? "#000000" : "#ffffff", L += ";", L += '"/>';
          L += "</tr>";
        }
        return L += "</tbody>", L += "</table>", L;
      }, x.createSvgTag = function(P, O, L, M) {
        var D = {};
        typeof arguments[0] == "object" && (D = arguments[0], P = D.cellSize, O = D.margin, L = D.alt, M = D.title), P = P || 2, O = typeof O > "u" ? P * 4 : O, L = typeof L == "string" ? { text: L } : L || {}, L.text = L.text || null, L.id = L.text ? L.id || "qrcode-description" : null, M = typeof M == "string" ? { text: M } : M || {}, M.text = M.text || null, M.id = M.text ? M.id || "qrcode-title" : null;
        var W = x.getModuleCount() * P + O * 2, Q, Y, ye, Se, te = "", Re;
        for (Re = "l" + P + ",0 0," + P + " -" + P + ",0 0,-" + P + "z ", te += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', te += D.scalable ? "" : ' width="' + W + 'px" height="' + W + 'px"', te += ' viewBox="0 0 ' + W + " " + W + '" ', te += ' preserveAspectRatio="xMinYMin meet"', te += M.text || L.text ? ' role="img" aria-labelledby="' + Te([M.id, L.id].join(" ").trim()) + '"' : "", te += ">", te += M.text ? '<title id="' + Te(M.id) + '">' + Te(M.text) + "</title>" : "", te += L.text ? '<description id="' + Te(L.id) + '">' + Te(L.text) + "</description>" : "", te += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', te += '<path d="', ye = 0; ye < x.getModuleCount(); ye += 1)
          for (Se = ye * P + O, Q = 0; Q < x.getModuleCount(); Q += 1)
            x.isDark(ye, Q) && (Y = Q * P + O, te += "M" + Y + "," + Se + Re);
        return te += '" stroke="transparent" fill="black"/>', te += "</svg>", te;
      }, x.createDataURL = function(P, O) {
        P = P || 2, O = typeof O > "u" ? P * 4 : O;
        var L = x.getModuleCount() * P + O * 2, M = O, D = L - O;
        return _(L, L, function(W, Q) {
          if (M <= W && W < D && M <= Q && Q < D) {
            var Y = Math.floor((W - M) / P), ye = Math.floor((Q - M) / P);
            return x.isDark(ye, Y) ? 0 : 1;
          } else
            return 1;
        });
      }, x.createImgTag = function(P, O, L) {
        P = P || 2, O = typeof O > "u" ? P * 4 : O;
        var M = x.getModuleCount() * P + O * 2, D = "";
        return D += "<img", D += ' src="', D += x.createDataURL(P, O), D += '"', D += ' width="', D += M, D += '"', D += ' height="', D += M, D += '"', L && (D += ' alt="', D += Te(L), D += '"'), D += "/>", D;
      };
      var Te = function(P) {
        for (var O = "", L = 0; L < P.length; L += 1) {
          var M = P.charAt(L);
          switch (M) {
            case "<":
              O += "&lt;";
              break;
            case ">":
              O += "&gt;";
              break;
            case "&":
              O += "&amp;";
              break;
            case '"':
              O += "&quot;";
              break;
            default:
              O += M;
              break;
          }
        }
        return O;
      }, ct = function(P) {
        var O = 1;
        P = typeof P > "u" ? O * 2 : P;
        var L = x.getModuleCount() * O + P * 2, M = P, D = L - P, W, Q, Y, ye, Se, te = {
          "██": "█",
          "█ ": "▀",
          " █": "▄",
          "  ": " "
        }, Re = {
          "██": "▀",
          "█ ": "▀",
          " █": " ",
          "  ": " "
        }, $e = "";
        for (W = 0; W < L; W += 2) {
          for (Y = Math.floor((W - M) / O), ye = Math.floor((W + 1 - M) / O), Q = 0; Q < L; Q += 1)
            Se = "█", M <= Q && Q < D && M <= W && W < D && x.isDark(Y, Math.floor((Q - M) / O)) && (Se = " "), M <= Q && Q < D && M <= W + 1 && W + 1 < D && x.isDark(ye, Math.floor((Q - M) / O)) ? Se += " " : Se += "█", $e += P < 1 && W + 1 >= D ? Re[Se] : te[Se];
          $e += `
`;
        }
        return L % 2 && P > 0 ? $e.substring(0, $e.length - L - 1) + Array(L + 1).join("▀") : $e.substring(0, $e.length - 1);
      };
      return x.createASCII = function(P, O) {
        if (P = P || 1, P < 2)
          return ct(O);
        P -= 1, O = typeof O > "u" ? P * 2 : O;
        var L = x.getModuleCount() * P + O * 2, M = O, D = L - O, W, Q, Y, ye, Se = Array(P + 1).join("██"), te = Array(P + 1).join("  "), Re = "", $e = "";
        for (W = 0; W < L; W += 1) {
          for (Y = Math.floor((W - M) / P), $e = "", Q = 0; Q < L; Q += 1)
            ye = 1, M <= Q && Q < D && M <= W && W < D && x.isDark(Y, Math.floor((Q - M) / P)) && (ye = 0), $e += ye ? Se : te;
          for (Y = 0; Y < P; Y += 1)
            Re += $e + `
`;
        }
        return Re.substring(0, Re.length - 1);
      }, x.renderTo2dContext = function(P, O) {
        O = O || 2;
        for (var L = x.getModuleCount(), M = 0; M < L; M++)
          for (var D = 0; D < L; D++)
            P.fillStyle = x.isDark(M, D) ? "black" : "white", P.fillRect(M * O, D * O, O, O);
      }, x;
    };
    r.stringToBytesFuncs = {
      default: function(v) {
        for (var I = [], E = 0; E < v.length; E += 1) {
          var B = v.charCodeAt(E);
          I.push(B & 255);
        }
        return I;
      }
    }, r.stringToBytes = r.stringToBytesFuncs.default, r.createStringToBytes = function(v, I) {
      var E = function() {
        for (var S = z(v), u = function() {
          var A = S.read();
          if (A == -1) throw "eof";
          return A;
        }, d = 0, a = {}; ; ) {
          var b = S.read();
          if (b == -1) break;
          var y = u(), x = u(), j = u(), V = String.fromCharCode(b << 8 | y), G = x << 8 | j;
          a[V] = G, d += 1;
        }
        if (d != I)
          throw d + " != " + I;
        return a;
      }(), B = 63;
      return function(S) {
        for (var u = [], d = 0; d < S.length; d += 1) {
          var a = S.charCodeAt(d);
          if (a < 128)
            u.push(a);
          else {
            var b = E[S.charAt(d)];
            typeof b == "number" ? (b & 255) == b ? u.push(b) : (u.push(b >>> 8), u.push(b & 255)) : u.push(B);
          }
        }
        return u;
      };
    };
    var i = {
      MODE_NUMBER: 1,
      MODE_ALPHA_NUM: 2,
      MODE_8BIT_BYTE: 4,
      MODE_KANJI: 8
    }, s = {
      L: 1,
      M: 0,
      Q: 3,
      H: 2
    }, o = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    }, c = function() {
      var v = [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
      ], I = 1335, E = 7973, B = 21522, S = {}, u = function(d) {
        for (var a = 0; d != 0; )
          a += 1, d >>>= 1;
        return a;
      };
      return S.getBCHTypeInfo = function(d) {
        for (var a = d << 10; u(a) - u(I) >= 0; )
          a ^= I << u(a) - u(I);
        return (d << 10 | a) ^ B;
      }, S.getBCHTypeNumber = function(d) {
        for (var a = d << 12; u(a) - u(E) >= 0; )
          a ^= E << u(a) - u(E);
        return d << 12 | a;
      }, S.getPatternPosition = function(d) {
        return v[d - 1];
      }, S.getMaskFunction = function(d) {
        switch (d) {
          case o.PATTERN000:
            return function(a, b) {
              return (a + b) % 2 == 0;
            };
          case o.PATTERN001:
            return function(a, b) {
              return a % 2 == 0;
            };
          case o.PATTERN010:
            return function(a, b) {
              return b % 3 == 0;
            };
          case o.PATTERN011:
            return function(a, b) {
              return (a + b) % 3 == 0;
            };
          case o.PATTERN100:
            return function(a, b) {
              return (Math.floor(a / 2) + Math.floor(b / 3)) % 2 == 0;
            };
          case o.PATTERN101:
            return function(a, b) {
              return a * b % 2 + a * b % 3 == 0;
            };
          case o.PATTERN110:
            return function(a, b) {
              return (a * b % 2 + a * b % 3) % 2 == 0;
            };
          case o.PATTERN111:
            return function(a, b) {
              return (a * b % 3 + (a + b) % 2) % 2 == 0;
            };
          default:
            throw "bad maskPattern:" + d;
        }
      }, S.getErrorCorrectPolynomial = function(d) {
        for (var a = g([1], 0), b = 0; b < d; b += 1)
          a = a.multiply(g([1, f.gexp(b)], 0));
        return a;
      }, S.getLengthInBits = function(d, a) {
        if (1 <= a && a < 10)
          switch (d) {
            case i.MODE_NUMBER:
              return 10;
            case i.MODE_ALPHA_NUM:
              return 9;
            case i.MODE_8BIT_BYTE:
              return 8;
            case i.MODE_KANJI:
              return 8;
            default:
              throw "mode:" + d;
          }
        else if (a < 27)
          switch (d) {
            case i.MODE_NUMBER:
              return 12;
            case i.MODE_ALPHA_NUM:
              return 11;
            case i.MODE_8BIT_BYTE:
              return 16;
            case i.MODE_KANJI:
              return 10;
            default:
              throw "mode:" + d;
          }
        else if (a < 41)
          switch (d) {
            case i.MODE_NUMBER:
              return 14;
            case i.MODE_ALPHA_NUM:
              return 13;
            case i.MODE_8BIT_BYTE:
              return 16;
            case i.MODE_KANJI:
              return 12;
            default:
              throw "mode:" + d;
          }
        else
          throw "type:" + a;
      }, S.getLostPoint = function(d) {
        for (var a = d.getModuleCount(), b = 0, y = 0; y < a; y += 1)
          for (var x = 0; x < a; x += 1) {
            for (var j = 0, V = d.isDark(y, x), G = -1; G <= 1; G += 1)
              if (!(y + G < 0 || a <= y + G))
                for (var A = -1; A <= 1; A += 1)
                  x + A < 0 || a <= x + A || G == 0 && A == 0 || V == d.isDark(y + G, x + A) && (j += 1);
            j > 5 && (b += 3 + j - 5);
          }
        for (var y = 0; y < a - 1; y += 1)
          for (var x = 0; x < a - 1; x += 1) {
            var U = 0;
            d.isDark(y, x) && (U += 1), d.isDark(y + 1, x) && (U += 1), d.isDark(y, x + 1) && (U += 1), d.isDark(y + 1, x + 1) && (U += 1), (U == 0 || U == 4) && (b += 3);
          }
        for (var y = 0; y < a; y += 1)
          for (var x = 0; x < a - 6; x += 1)
            d.isDark(y, x) && !d.isDark(y, x + 1) && d.isDark(y, x + 2) && d.isDark(y, x + 3) && d.isDark(y, x + 4) && !d.isDark(y, x + 5) && d.isDark(y, x + 6) && (b += 40);
        for (var x = 0; x < a; x += 1)
          for (var y = 0; y < a - 6; y += 1)
            d.isDark(y, x) && !d.isDark(y + 1, x) && d.isDark(y + 2, x) && d.isDark(y + 3, x) && d.isDark(y + 4, x) && !d.isDark(y + 5, x) && d.isDark(y + 6, x) && (b += 40);
        for (var se = 0, x = 0; x < a; x += 1)
          for (var y = 0; y < a; y += 1)
            d.isDark(y, x) && (se += 1);
        var ie = Math.abs(100 * se / a / a - 50) / 5;
        return b += ie * 10, b;
      }, S;
    }(), f = function() {
      for (var v = new Array(256), I = new Array(256), E = 0; E < 8; E += 1)
        v[E] = 1 << E;
      for (var E = 8; E < 256; E += 1)
        v[E] = v[E - 4] ^ v[E - 5] ^ v[E - 6] ^ v[E - 8];
      for (var E = 0; E < 255; E += 1)
        I[v[E]] = E;
      var B = {};
      return B.glog = function(S) {
        if (S < 1)
          throw "glog(" + S + ")";
        return I[S];
      }, B.gexp = function(S) {
        for (; S < 0; )
          S += 255;
        for (; S >= 256; )
          S -= 255;
        return v[S];
      }, B;
    }();
    function g(v, I) {
      if (typeof v.length > "u")
        throw v.length + "/" + I;
      var E = function() {
        for (var S = 0; S < v.length && v[S] == 0; )
          S += 1;
        for (var u = new Array(v.length - S + I), d = 0; d < v.length - S; d += 1)
          u[d] = v[d + S];
        return u;
      }(), B = {};
      return B.getAt = function(S) {
        return E[S];
      }, B.getLength = function() {
        return E.length;
      }, B.multiply = function(S) {
        for (var u = new Array(B.getLength() + S.getLength() - 1), d = 0; d < B.getLength(); d += 1)
          for (var a = 0; a < S.getLength(); a += 1)
            u[d + a] ^= f.gexp(f.glog(B.getAt(d)) + f.glog(S.getAt(a)));
        return g(u, 0);
      }, B.mod = function(S) {
        if (B.getLength() - S.getLength() < 0)
          return B;
        for (var u = f.glog(B.getAt(0)) - f.glog(S.getAt(0)), d = new Array(B.getLength()), a = 0; a < B.getLength(); a += 1)
          d[a] = B.getAt(a);
        for (var a = 0; a < S.getLength(); a += 1)
          d[a] ^= f.gexp(f.glog(S.getAt(a)) + u);
        return g(d, 0).mod(S);
      }, B;
    }
    var p = function() {
      var v = [
        // L
        // M
        // Q
        // H
        // 1
        [1, 26, 19],
        [1, 26, 16],
        [1, 26, 13],
        [1, 26, 9],
        // 2
        [1, 44, 34],
        [1, 44, 28],
        [1, 44, 22],
        [1, 44, 16],
        // 3
        [1, 70, 55],
        [1, 70, 44],
        [2, 35, 17],
        [2, 35, 13],
        // 4
        [1, 100, 80],
        [2, 50, 32],
        [2, 50, 24],
        [4, 25, 9],
        // 5
        [1, 134, 108],
        [2, 67, 43],
        [2, 33, 15, 2, 34, 16],
        [2, 33, 11, 2, 34, 12],
        // 6
        [2, 86, 68],
        [4, 43, 27],
        [4, 43, 19],
        [4, 43, 15],
        // 7
        [2, 98, 78],
        [4, 49, 31],
        [2, 32, 14, 4, 33, 15],
        [4, 39, 13, 1, 40, 14],
        // 8
        [2, 121, 97],
        [2, 60, 38, 2, 61, 39],
        [4, 40, 18, 2, 41, 19],
        [4, 40, 14, 2, 41, 15],
        // 9
        [2, 146, 116],
        [3, 58, 36, 2, 59, 37],
        [4, 36, 16, 4, 37, 17],
        [4, 36, 12, 4, 37, 13],
        // 10
        [2, 86, 68, 2, 87, 69],
        [4, 69, 43, 1, 70, 44],
        [6, 43, 19, 2, 44, 20],
        [6, 43, 15, 2, 44, 16],
        // 11
        [4, 101, 81],
        [1, 80, 50, 4, 81, 51],
        [4, 50, 22, 4, 51, 23],
        [3, 36, 12, 8, 37, 13],
        // 12
        [2, 116, 92, 2, 117, 93],
        [6, 58, 36, 2, 59, 37],
        [4, 46, 20, 6, 47, 21],
        [7, 42, 14, 4, 43, 15],
        // 13
        [4, 133, 107],
        [8, 59, 37, 1, 60, 38],
        [8, 44, 20, 4, 45, 21],
        [12, 33, 11, 4, 34, 12],
        // 14
        [3, 145, 115, 1, 146, 116],
        [4, 64, 40, 5, 65, 41],
        [11, 36, 16, 5, 37, 17],
        [11, 36, 12, 5, 37, 13],
        // 15
        [5, 109, 87, 1, 110, 88],
        [5, 65, 41, 5, 66, 42],
        [5, 54, 24, 7, 55, 25],
        [11, 36, 12, 7, 37, 13],
        // 16
        [5, 122, 98, 1, 123, 99],
        [7, 73, 45, 3, 74, 46],
        [15, 43, 19, 2, 44, 20],
        [3, 45, 15, 13, 46, 16],
        // 17
        [1, 135, 107, 5, 136, 108],
        [10, 74, 46, 1, 75, 47],
        [1, 50, 22, 15, 51, 23],
        [2, 42, 14, 17, 43, 15],
        // 18
        [5, 150, 120, 1, 151, 121],
        [9, 69, 43, 4, 70, 44],
        [17, 50, 22, 1, 51, 23],
        [2, 42, 14, 19, 43, 15],
        // 19
        [3, 141, 113, 4, 142, 114],
        [3, 70, 44, 11, 71, 45],
        [17, 47, 21, 4, 48, 22],
        [9, 39, 13, 16, 40, 14],
        // 20
        [3, 135, 107, 5, 136, 108],
        [3, 67, 41, 13, 68, 42],
        [15, 54, 24, 5, 55, 25],
        [15, 43, 15, 10, 44, 16],
        // 21
        [4, 144, 116, 4, 145, 117],
        [17, 68, 42],
        [17, 50, 22, 6, 51, 23],
        [19, 46, 16, 6, 47, 17],
        // 22
        [2, 139, 111, 7, 140, 112],
        [17, 74, 46],
        [7, 54, 24, 16, 55, 25],
        [34, 37, 13],
        // 23
        [4, 151, 121, 5, 152, 122],
        [4, 75, 47, 14, 76, 48],
        [11, 54, 24, 14, 55, 25],
        [16, 45, 15, 14, 46, 16],
        // 24
        [6, 147, 117, 4, 148, 118],
        [6, 73, 45, 14, 74, 46],
        [11, 54, 24, 16, 55, 25],
        [30, 46, 16, 2, 47, 17],
        // 25
        [8, 132, 106, 4, 133, 107],
        [8, 75, 47, 13, 76, 48],
        [7, 54, 24, 22, 55, 25],
        [22, 45, 15, 13, 46, 16],
        // 26
        [10, 142, 114, 2, 143, 115],
        [19, 74, 46, 4, 75, 47],
        [28, 50, 22, 6, 51, 23],
        [33, 46, 16, 4, 47, 17],
        // 27
        [8, 152, 122, 4, 153, 123],
        [22, 73, 45, 3, 74, 46],
        [8, 53, 23, 26, 54, 24],
        [12, 45, 15, 28, 46, 16],
        // 28
        [3, 147, 117, 10, 148, 118],
        [3, 73, 45, 23, 74, 46],
        [4, 54, 24, 31, 55, 25],
        [11, 45, 15, 31, 46, 16],
        // 29
        [7, 146, 116, 7, 147, 117],
        [21, 73, 45, 7, 74, 46],
        [1, 53, 23, 37, 54, 24],
        [19, 45, 15, 26, 46, 16],
        // 30
        [5, 145, 115, 10, 146, 116],
        [19, 75, 47, 10, 76, 48],
        [15, 54, 24, 25, 55, 25],
        [23, 45, 15, 25, 46, 16],
        // 31
        [13, 145, 115, 3, 146, 116],
        [2, 74, 46, 29, 75, 47],
        [42, 54, 24, 1, 55, 25],
        [23, 45, 15, 28, 46, 16],
        // 32
        [17, 145, 115],
        [10, 74, 46, 23, 75, 47],
        [10, 54, 24, 35, 55, 25],
        [19, 45, 15, 35, 46, 16],
        // 33
        [17, 145, 115, 1, 146, 116],
        [14, 74, 46, 21, 75, 47],
        [29, 54, 24, 19, 55, 25],
        [11, 45, 15, 46, 46, 16],
        // 34
        [13, 145, 115, 6, 146, 116],
        [14, 74, 46, 23, 75, 47],
        [44, 54, 24, 7, 55, 25],
        [59, 46, 16, 1, 47, 17],
        // 35
        [12, 151, 121, 7, 152, 122],
        [12, 75, 47, 26, 76, 48],
        [39, 54, 24, 14, 55, 25],
        [22, 45, 15, 41, 46, 16],
        // 36
        [6, 151, 121, 14, 152, 122],
        [6, 75, 47, 34, 76, 48],
        [46, 54, 24, 10, 55, 25],
        [2, 45, 15, 64, 46, 16],
        // 37
        [17, 152, 122, 4, 153, 123],
        [29, 74, 46, 14, 75, 47],
        [49, 54, 24, 10, 55, 25],
        [24, 45, 15, 46, 46, 16],
        // 38
        [4, 152, 122, 18, 153, 123],
        [13, 74, 46, 32, 75, 47],
        [48, 54, 24, 14, 55, 25],
        [42, 45, 15, 32, 46, 16],
        // 39
        [20, 147, 117, 4, 148, 118],
        [40, 75, 47, 7, 76, 48],
        [43, 54, 24, 22, 55, 25],
        [10, 45, 15, 67, 46, 16],
        // 40
        [19, 148, 118, 6, 149, 119],
        [18, 75, 47, 31, 76, 48],
        [34, 54, 24, 34, 55, 25],
        [20, 45, 15, 61, 46, 16]
      ], I = function(S, u) {
        var d = {};
        return d.totalCount = S, d.dataCount = u, d;
      }, E = {}, B = function(S, u) {
        switch (u) {
          case s.L:
            return v[(S - 1) * 4 + 0];
          case s.M:
            return v[(S - 1) * 4 + 1];
          case s.Q:
            return v[(S - 1) * 4 + 2];
          case s.H:
            return v[(S - 1) * 4 + 3];
          default:
            return;
        }
      };
      return E.getRSBlocks = function(S, u) {
        var d = B(S, u);
        if (typeof d > "u")
          throw "bad rs block @ typeNumber:" + S + "/errorCorrectionLevel:" + u;
        for (var a = d.length / 3, b = [], y = 0; y < a; y += 1)
          for (var x = d[y * 3 + 0], j = d[y * 3 + 1], V = d[y * 3 + 2], G = 0; G < x; G += 1)
            b.push(I(j, V));
        return b;
      }, E;
    }(), h = function() {
      var v = [], I = 0, E = {};
      return E.getBuffer = function() {
        return v;
      }, E.getAt = function(B) {
        var S = Math.floor(B / 8);
        return (v[S] >>> 7 - B % 8 & 1) == 1;
      }, E.put = function(B, S) {
        for (var u = 0; u < S; u += 1)
          E.putBit((B >>> S - u - 1 & 1) == 1);
      }, E.getLengthInBits = function() {
        return I;
      }, E.putBit = function(B) {
        var S = Math.floor(I / 8);
        v.length <= S && v.push(0), B && (v[S] |= 128 >>> I % 8), I += 1;
      }, E;
    }, m = function(v) {
      var I = i.MODE_NUMBER, E = v, B = {};
      B.getMode = function() {
        return I;
      }, B.getLength = function(d) {
        return E.length;
      }, B.write = function(d) {
        for (var a = E, b = 0; b + 2 < a.length; )
          d.put(S(a.substring(b, b + 3)), 10), b += 3;
        b < a.length && (a.length - b == 1 ? d.put(S(a.substring(b, b + 1)), 4) : a.length - b == 2 && d.put(S(a.substring(b, b + 2)), 7));
      };
      var S = function(d) {
        for (var a = 0, b = 0; b < d.length; b += 1)
          a = a * 10 + u(d.charAt(b));
        return a;
      }, u = function(d) {
        if ("0" <= d && d <= "9")
          return d.charCodeAt(0) - 48;
        throw "illegal char :" + d;
      };
      return B;
    }, w = function(v) {
      var I = i.MODE_ALPHA_NUM, E = v, B = {};
      B.getMode = function() {
        return I;
      }, B.getLength = function(u) {
        return E.length;
      }, B.write = function(u) {
        for (var d = E, a = 0; a + 1 < d.length; )
          u.put(
            S(d.charAt(a)) * 45 + S(d.charAt(a + 1)),
            11
          ), a += 2;
        a < d.length && u.put(S(d.charAt(a)), 6);
      };
      var S = function(u) {
        if ("0" <= u && u <= "9")
          return u.charCodeAt(0) - 48;
        if ("A" <= u && u <= "Z")
          return u.charCodeAt(0) - 65 + 10;
        switch (u) {
          case " ":
            return 36;
          case "$":
            return 37;
          case "%":
            return 38;
          case "*":
            return 39;
          case "+":
            return 40;
          case "-":
            return 41;
          case ".":
            return 42;
          case "/":
            return 43;
          case ":":
            return 44;
          default:
            throw "illegal char :" + u;
        }
      };
      return B;
    }, T = function(v) {
      var I = i.MODE_8BIT_BYTE, E = r.stringToBytes(v), B = {};
      return B.getMode = function() {
        return I;
      }, B.getLength = function(S) {
        return E.length;
      }, B.write = function(S) {
        for (var u = 0; u < E.length; u += 1)
          S.put(E[u], 8);
      }, B;
    }, k = function(v) {
      var I = i.MODE_KANJI, E = r.stringToBytesFuncs.SJIS;
      if (!E)
        throw "sjis not supported.";
      (function(u, d) {
        var a = E(u);
        if (a.length != 2 || (a[0] << 8 | a[1]) != d)
          throw "sjis not supported.";
      })("友", 38726);
      var B = E(v), S = {};
      return S.getMode = function() {
        return I;
      }, S.getLength = function(u) {
        return ~~(B.length / 2);
      }, S.write = function(u) {
        for (var d = B, a = 0; a + 1 < d.length; ) {
          var b = (255 & d[a]) << 8 | 255 & d[a + 1];
          if (33088 <= b && b <= 40956)
            b -= 33088;
          else if (57408 <= b && b <= 60351)
            b -= 49472;
          else
            throw "illegal char at " + (a + 1) + "/" + b;
          b = (b >>> 8 & 255) * 192 + (b & 255), u.put(b, 13), a += 2;
        }
        if (a < d.length)
          throw "illegal char at " + (a + 1);
      }, S;
    }, $ = function() {
      var v = [], I = {};
      return I.writeByte = function(E) {
        v.push(E & 255);
      }, I.writeShort = function(E) {
        I.writeByte(E), I.writeByte(E >>> 8);
      }, I.writeBytes = function(E, B, S) {
        B = B || 0, S = S || E.length;
        for (var u = 0; u < S; u += 1)
          I.writeByte(E[u + B]);
      }, I.writeString = function(E) {
        for (var B = 0; B < E.length; B += 1)
          I.writeByte(E.charCodeAt(B));
      }, I.toByteArray = function() {
        return v;
      }, I.toString = function() {
        var E = "";
        E += "[";
        for (var B = 0; B < v.length; B += 1)
          B > 0 && (E += ","), E += v[B];
        return E += "]", E;
      }, I;
    }, R = function() {
      var v = 0, I = 0, E = 0, B = "", S = {}, u = function(a) {
        B += String.fromCharCode(d(a & 63));
      }, d = function(a) {
        if (!(a < 0)) {
          if (a < 26)
            return 65 + a;
          if (a < 52)
            return 97 + (a - 26);
          if (a < 62)
            return 48 + (a - 52);
          if (a == 62)
            return 43;
          if (a == 63)
            return 47;
        }
        throw "n:" + a;
      };
      return S.writeByte = function(a) {
        for (v = v << 8 | a & 255, I += 8, E += 1; I >= 6; )
          u(v >>> I - 6), I -= 6;
      }, S.flush = function() {
        if (I > 0 && (u(v << 6 - I), v = 0, I = 0), E % 3 != 0)
          for (var a = 3 - E % 3, b = 0; b < a; b += 1)
            B += "=";
      }, S.toString = function() {
        return B;
      }, S;
    }, z = function(v) {
      var I = v, E = 0, B = 0, S = 0, u = {};
      u.read = function() {
        for (; S < 8; ) {
          if (E >= I.length) {
            if (S == 0)
              return -1;
            throw "unexpected end of file./" + S;
          }
          var a = I.charAt(E);
          if (E += 1, a == "=")
            return S = 0, -1;
          if (a.match(/^\s$/))
            continue;
          B = B << 6 | d(a.charCodeAt(0)), S += 6;
        }
        var b = B >>> S - 8 & 255;
        return S -= 8, b;
      };
      var d = function(a) {
        if (65 <= a && a <= 90)
          return a - 65;
        if (97 <= a && a <= 122)
          return a - 97 + 26;
        if (48 <= a && a <= 57)
          return a - 48 + 52;
        if (a == 43)
          return 62;
        if (a == 47)
          return 63;
        throw "c:" + a;
      };
      return u;
    }, H = function(v, I) {
      var E = v, B = I, S = new Array(v * I), u = {};
      u.setPixel = function(y, x, j) {
        S[x * E + y] = j;
      }, u.write = function(y) {
        y.writeString("GIF87a"), y.writeShort(E), y.writeShort(B), y.writeByte(128), y.writeByte(0), y.writeByte(0), y.writeByte(0), y.writeByte(0), y.writeByte(0), y.writeByte(255), y.writeByte(255), y.writeByte(255), y.writeString(","), y.writeShort(0), y.writeShort(0), y.writeShort(E), y.writeShort(B), y.writeByte(0);
        var x = 2, j = a(x);
        y.writeByte(x);
        for (var V = 0; j.length - V > 255; )
          y.writeByte(255), y.writeBytes(j, V, 255), V += 255;
        y.writeByte(j.length - V), y.writeBytes(j, V, j.length - V), y.writeByte(0), y.writeString(";");
      };
      var d = function(y) {
        var x = y, j = 0, V = 0, G = {};
        return G.write = function(A, U) {
          if (A >>> U)
            throw "length over";
          for (; j + U >= 8; )
            x.writeByte(255 & (A << j | V)), U -= 8 - j, A >>>= 8 - j, V = 0, j = 0;
          V = A << j | V, j = j + U;
        }, G.flush = function() {
          j > 0 && x.writeByte(V);
        }, G;
      }, a = function(y) {
        for (var x = 1 << y, j = (1 << y) + 1, V = y + 1, G = b(), A = 0; A < x; A += 1)
          G.add(String.fromCharCode(A));
        G.add(String.fromCharCode(x)), G.add(String.fromCharCode(j));
        var U = $(), se = d(U);
        se.write(x, V);
        var ie = 0, q = String.fromCharCode(S[ie]);
        for (ie += 1; ie < S.length; ) {
          var oe = String.fromCharCode(S[ie]);
          ie += 1, G.contains(q + oe) ? q = q + oe : (se.write(G.indexOf(q), V), G.size() < 4095 && (G.size() == 1 << V && (V += 1), G.add(q + oe)), q = oe);
        }
        return se.write(G.indexOf(q), V), se.write(j, V), se.flush(), U.toByteArray();
      }, b = function() {
        var y = {}, x = 0, j = {};
        return j.add = function(V) {
          if (j.contains(V))
            throw "dup key:" + V;
          y[V] = x, x += 1;
        }, j.size = function() {
          return x;
        }, j.indexOf = function(V) {
          return y[V];
        }, j.contains = function(V) {
          return typeof y[V] < "u";
        }, j;
      };
      return u;
    }, _ = function(v, I, E) {
      for (var B = H(v, I), S = 0; S < I; S += 1)
        for (var u = 0; u < v; u += 1)
          B.setPixel(u, S, E(u, S));
      var d = $();
      B.write(d);
      for (var a = R(), b = d.toByteArray(), y = 0; y < b.length; y += 1)
        a.writeByte(b[y]);
      return a.flush(), "data:image/gif;base64," + a;
    };
    return r;
  }();
  (function() {
    n.stringToBytesFuncs["UTF-8"] = function(r) {
      function i(s) {
        for (var o = [], c = 0; c < s.length; c++) {
          var f = s.charCodeAt(c);
          f < 128 ? o.push(f) : f < 2048 ? o.push(
            192 | f >> 6,
            128 | f & 63
          ) : f < 55296 || f >= 57344 ? o.push(
            224 | f >> 12,
            128 | f >> 6 & 63,
            128 | f & 63
          ) : (c++, f = 65536 + ((f & 1023) << 10 | s.charCodeAt(c) & 1023), o.push(
            240 | f >> 18,
            128 | f >> 12 & 63,
            128 | f >> 6 & 63,
            128 | f & 63
          ));
        }
        return o;
      }
      return i(r);
    };
  })(), function(r) {
    e.exports = r();
  }(function() {
    return n;
  });
})(Ro);
var gu = Ro.exports;
const bu = /* @__PURE__ */ Vo(gu);
function yu(e) {
  return new Worker(
    "/radio/assets/signer.worker-BDrT6PD-.js",
    {
      type: "module",
      name: e == null ? void 0 : e.name
    }
  );
}
var Ze = {}, Ie = {};
Object.defineProperty(Ie, "__esModule", { value: !0 });
Ie.output = Ie.exists = Ie.hash = Ie.bytes = Ie.bool = Ie.number = void 0;
function ni(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
Ie.number = ni;
function zo(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
Ie.bool = zo;
function us(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
Ie.bytes = us;
function Go(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ni(e.outputLen), ni(e.blockLen);
}
Ie.hash = Go;
function Wo(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
Ie.exists = Wo;
function Ko(e, t) {
  us(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
Ie.output = Ko;
const wu = {
  number: ni,
  bool: zo,
  bytes: us,
  hash: Go,
  exists: Wo,
  output: Ko
};
Ie.default = wu;
var Mn = {}, qo = {}, An = {}, di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.crypto = void 0;
di.crypto = {
  node: void 0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
};
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.randomBytes = e.wrapConstructorWithOpts = e.wrapConstructor = e.checkOpts = e.Hash = e.concatBytes = e.toBytes = e.utf8ToBytes = e.asyncLoop = e.nextTick = e.hexToBytes = e.bytesToHex = e.isLE = e.rotr = e.createView = e.u32 = e.u8 = void 0;
  const t = di, n = (_) => new Uint8Array(_.buffer, _.byteOffset, _.byteLength);
  e.u8 = n;
  const r = (_) => new Uint32Array(_.buffer, _.byteOffset, Math.floor(_.byteLength / 4));
  e.u32 = r;
  const i = (_) => new DataView(_.buffer, _.byteOffset, _.byteLength);
  e.createView = i;
  const s = (_, v) => _ << 32 - v | _ >>> v;
  if (e.rotr = s, e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68, !e.isLE)
    throw new Error("Non little-endian hardware is not supported");
  const o = Array.from({ length: 256 }, (_, v) => v.toString(16).padStart(2, "0"));
  function c(_) {
    if (!(_ instanceof Uint8Array))
      throw new Error("Uint8Array expected");
    let v = "";
    for (let I = 0; I < _.length; I++)
      v += o[_[I]];
    return v;
  }
  e.bytesToHex = c;
  function f(_) {
    if (typeof _ != "string")
      throw new TypeError("hexToBytes: expected string, got " + typeof _);
    if (_.length % 2)
      throw new Error("hexToBytes: received invalid unpadded hex");
    const v = new Uint8Array(_.length / 2);
    for (let I = 0; I < v.length; I++) {
      const E = I * 2, B = _.slice(E, E + 2), S = Number.parseInt(B, 16);
      if (Number.isNaN(S) || S < 0)
        throw new Error("Invalid byte sequence");
      v[I] = S;
    }
    return v;
  }
  e.hexToBytes = f;
  const g = async () => {
  };
  e.nextTick = g;
  async function p(_, v, I) {
    let E = Date.now();
    for (let B = 0; B < _; B++) {
      I(B);
      const S = Date.now() - E;
      S >= 0 && S < v || (await (0, e.nextTick)(), E += S);
    }
  }
  e.asyncLoop = p;
  function h(_) {
    if (typeof _ != "string")
      throw new TypeError(`utf8ToBytes expected string, got ${typeof _}`);
    return new TextEncoder().encode(_);
  }
  e.utf8ToBytes = h;
  function m(_) {
    if (typeof _ == "string" && (_ = h(_)), !(_ instanceof Uint8Array))
      throw new TypeError(`Expected input type is Uint8Array (got ${typeof _})`);
    return _;
  }
  e.toBytes = m;
  function w(..._) {
    if (!_.every((E) => E instanceof Uint8Array))
      throw new Error("Uint8Array list expected");
    if (_.length === 1)
      return _[0];
    const v = _.reduce((E, B) => E + B.length, 0), I = new Uint8Array(v);
    for (let E = 0, B = 0; E < _.length; E++) {
      const S = _[E];
      I.set(S, B), B += S.length;
    }
    return I;
  }
  e.concatBytes = w;
  class T {
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  }
  e.Hash = T;
  const k = (_) => Object.prototype.toString.call(_) === "[object Object]" && _.constructor === Object;
  function $(_, v) {
    if (v !== void 0 && (typeof v != "object" || !k(v)))
      throw new TypeError("Options should be object or undefined");
    return Object.assign(_, v);
  }
  e.checkOpts = $;
  function R(_) {
    const v = (E) => _().update(m(E)).digest(), I = _();
    return v.outputLen = I.outputLen, v.blockLen = I.blockLen, v.create = () => _(), v;
  }
  e.wrapConstructor = R;
  function z(_) {
    const v = (E, B) => _(B).update(m(E)).digest(), I = _({});
    return v.outputLen = I.outputLen, v.blockLen = I.blockLen, v.create = (E) => _(E), v;
  }
  e.wrapConstructorWithOpts = z;
  function H(_ = 32) {
    if (t.crypto.web)
      return t.crypto.web.getRandomValues(new Uint8Array(_));
    if (t.crypto.node)
      return new Uint8Array(t.crypto.node.randomBytes(_).buffer);
    throw new Error("The environment doesn't have randomBytes function");
  }
  e.randomBytes = H;
})(An);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = void 0;
  const t = Ie, n = An;
  class r extends n.Hash {
    constructor(o, c) {
      super(), this.finished = !1, this.destroyed = !1, t.default.hash(o);
      const f = (0, n.toBytes)(c);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new TypeError("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const g = this.blockLen, p = new Uint8Array(g);
      p.set(f.length > g ? o.create().update(f).digest() : f);
      for (let h = 0; h < p.length; h++)
        p[h] ^= 54;
      this.iHash.update(p), this.oHash = o.create();
      for (let h = 0; h < p.length; h++)
        p[h] ^= 106;
      this.oHash.update(p), p.fill(0);
    }
    update(o) {
      return t.default.exists(this), this.iHash.update(o), this;
    }
    digestInto(o) {
      t.default.exists(this), t.default.bytes(o, this.outputLen), this.finished = !0, this.iHash.digestInto(o), this.oHash.update(o), this.oHash.digestInto(o), this.destroy();
    }
    digest() {
      const o = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(o), o;
    }
    _cloneInto(o) {
      o || (o = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: c, iHash: f, finished: g, destroyed: p, blockLen: h, outputLen: m } = this;
      return o = o, o.finished = g, o.destroyed = p, o.blockLen = h, o.outputLen = m, o.oHash = c._cloneInto(o.oHash), o.iHash = f._cloneInto(o.iHash), o;
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  const i = (s, o, c) => new r(s, o).update(c).digest();
  e.hmac = i, e.hmac.create = (s, o) => new r(s, o);
})(qo);
Object.defineProperty(Mn, "__esModule", { value: !0 });
Mn.pbkdf2Async = Mn.pbkdf2 = void 0;
const Vr = Ie, mu = qo, Pn = An;
function Xo(e, t, n, r) {
  Vr.default.hash(e);
  const i = (0, Pn.checkOpts)({ dkLen: 32, asyncTick: 10 }, r), { c: s, dkLen: o, asyncTick: c } = i;
  if (Vr.default.number(s), Vr.default.number(o), Vr.default.number(c), s < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const f = (0, Pn.toBytes)(t), g = (0, Pn.toBytes)(n), p = new Uint8Array(o), h = mu.hmac.create(e, f), m = h._cloneInto().update(g);
  return { c: s, dkLen: o, asyncTick: c, DK: p, PRF: h, PRFSalt: m };
}
function Zo(e, t, n, r, i) {
  return e.destroy(), t.destroy(), r && r.destroy(), i.fill(0), n;
}
function xu(e, t, n, r) {
  const { c: i, dkLen: s, DK: o, PRF: c, PRFSalt: f } = Xo(e, t, n, r);
  let g;
  const p = new Uint8Array(4), h = (0, Pn.createView)(p), m = new Uint8Array(c.outputLen);
  for (let w = 1, T = 0; T < s; w++, T += c.outputLen) {
    const k = o.subarray(T, T + c.outputLen);
    h.setInt32(0, w, !1), (g = f._cloneInto(g)).update(p).digestInto(m), k.set(m.subarray(0, k.length));
    for (let $ = 1; $ < i; $++) {
      c._cloneInto(g).update(m).digestInto(m);
      for (let R = 0; R < k.length; R++)
        k[R] ^= m[R];
    }
  }
  return Zo(c, f, o, g, m);
}
Mn.pbkdf2 = xu;
async function vu(e, t, n, r) {
  const { c: i, dkLen: s, asyncTick: o, DK: c, PRF: f, PRFSalt: g } = Xo(e, t, n, r);
  let p;
  const h = new Uint8Array(4), m = (0, Pn.createView)(h), w = new Uint8Array(f.outputLen);
  for (let T = 1, k = 0; k < s; T++, k += f.outputLen) {
    const $ = c.subarray(k, k + f.outputLen);
    m.setInt32(0, T, !1), (p = g._cloneInto(p)).update(h).digestInto(w), $.set(w.subarray(0, $.length)), await (0, Pn.asyncLoop)(i - 1, o, (R) => {
      f._cloneInto(p).update(w).digestInto(w);
      for (let z = 0; z < $.length; z++)
        $[z] ^= w[z];
    });
  }
  return Zo(f, g, c, p, w);
}
Mn.pbkdf2Async = vu;
var Dn = {}, _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.SHA2 = void 0;
const Di = Ie, ir = An;
function Au(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), c = Number(n & s), f = r ? 4 : 0, g = r ? 0 : 4;
  e.setUint32(t + f, o, r), e.setUint32(t + g, c, r);
}
let Su = class extends ir.Hash {
  constructor(t, n, r, i) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = (0, ir.createView)(this.buffer);
  }
  update(t) {
    Di.default.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    t = (0, ir.toBytes)(t);
    const s = t.length;
    for (let o = 0; o < s; ) {
      const c = Math.min(i - this.pos, s - o);
      if (c === i) {
        const f = (0, ir.createView)(t);
        for (; i <= s - o; o += i)
          this.process(f, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Di.default.exists(this), Di.default.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let h = o; h < i; h++)
      n[h] = 0;
    Au(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = (0, ir.createView)(t), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const g = f / 4, p = this.get();
    if (g > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < g; h++)
      c.setUint32(4 * h, p[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: c } = this;
    return t.length = i, t.pos = c, t.finished = s, t.destroyed = o, i % n && t.buffer.set(r), t;
  }
};
_r.SHA2 = Su;
Object.defineProperty(Dn, "__esModule", { value: !0 });
Dn.sha224 = Dn.sha256 = void 0;
const Eu = _r, rt = An, Bu = (e, t, n) => e & t ^ ~e & n, Hu = (e, t, n) => e & t ^ e & n ^ t & n, _u = new Uint32Array([
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
]), Lt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), $t = new Uint32Array(64);
let Yo = class extends Eu.SHA2 {
  constructor() {
    super(64, 32, 8, !1), this.A = Lt[0] | 0, this.B = Lt[1] | 0, this.C = Lt[2] | 0, this.D = Lt[3] | 0, this.E = Lt[4] | 0, this.F = Lt[5] | 0, this.G = Lt[6] | 0, this.H = Lt[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: s, F: o, G: c, H: f } = this;
    return [t, n, r, i, s, o, c, f];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, c, f) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      $t[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const m = $t[h - 15], w = $t[h - 2], T = (0, rt.rotr)(m, 7) ^ (0, rt.rotr)(m, 18) ^ m >>> 3, k = (0, rt.rotr)(w, 17) ^ (0, rt.rotr)(w, 19) ^ w >>> 10;
      $t[h] = k + $t[h - 7] + T + $t[h - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: c, F: f, G: g, H: p } = this;
    for (let h = 0; h < 64; h++) {
      const m = (0, rt.rotr)(c, 6) ^ (0, rt.rotr)(c, 11) ^ (0, rt.rotr)(c, 25), w = p + m + Bu(c, f, g) + _u[h] + $t[h] | 0, k = ((0, rt.rotr)(r, 2) ^ (0, rt.rotr)(r, 13) ^ (0, rt.rotr)(r, 22)) + Hu(r, i, s) | 0;
      p = g, g = f, f = c, c = o + w | 0, o = s, s = i, i = r, r = w + k | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, g = g + this.G | 0, p = p + this.H | 0, this.set(r, i, s, o, c, f, g, p);
  }
  roundClean() {
    $t.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Cu = class extends Yo {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Dn.sha256 = (0, rt.wrapConstructor)(() => new Yo());
Dn.sha224 = (0, rt.wrapConstructor)(() => new Cu());
var st = {}, Jo = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.add = e.toBig = e.split = e.fromBig = void 0;
  const t = BigInt(2 ** 32 - 1), n = BigInt(32);
  function r(u, d = !1) {
    return d ? { h: Number(u & t), l: Number(u >> n & t) } : { h: Number(u >> n & t) | 0, l: Number(u & t) | 0 };
  }
  e.fromBig = r;
  function i(u, d = !1) {
    let a = new Uint32Array(u.length), b = new Uint32Array(u.length);
    for (let y = 0; y < u.length; y++) {
      const { h: x, l: j } = r(u[y], d);
      [a[y], b[y]] = [x, j];
    }
    return [a, b];
  }
  e.split = i;
  const s = (u, d) => BigInt(u >>> 0) << n | BigInt(d >>> 0);
  e.toBig = s;
  const o = (u, d, a) => u >>> a, c = (u, d, a) => u << 32 - a | d >>> a, f = (u, d, a) => u >>> a | d << 32 - a, g = (u, d, a) => u << 32 - a | d >>> a, p = (u, d, a) => u << 64 - a | d >>> a - 32, h = (u, d, a) => u >>> a - 32 | d << 64 - a, m = (u, d) => d, w = (u, d) => u, T = (u, d, a) => u << a | d >>> 32 - a, k = (u, d, a) => d << a | u >>> 32 - a, $ = (u, d, a) => d << a - 32 | u >>> 64 - a, R = (u, d, a) => u << a - 32 | d >>> 64 - a;
  function z(u, d, a, b) {
    const y = (d >>> 0) + (b >>> 0);
    return { h: u + a + (y / 2 ** 32 | 0) | 0, l: y | 0 };
  }
  e.add = z;
  const H = (u, d, a) => (u >>> 0) + (d >>> 0) + (a >>> 0), _ = (u, d, a, b) => d + a + b + (u / 2 ** 32 | 0) | 0, v = (u, d, a, b) => (u >>> 0) + (d >>> 0) + (a >>> 0) + (b >>> 0), I = (u, d, a, b, y) => d + a + b + y + (u / 2 ** 32 | 0) | 0, E = (u, d, a, b, y) => (u >>> 0) + (d >>> 0) + (a >>> 0) + (b >>> 0) + (y >>> 0), B = (u, d, a, b, y, x) => d + a + b + y + x + (u / 2 ** 32 | 0) | 0, S = {
    fromBig: r,
    split: i,
    toBig: e.toBig,
    shrSH: o,
    shrSL: c,
    rotrSH: f,
    rotrSL: g,
    rotrBH: p,
    rotrBL: h,
    rotr32H: m,
    rotr32L: w,
    rotlSH: T,
    rotlSL: k,
    rotlBH: $,
    rotlBL: R,
    add: z,
    add3L: H,
    add3H: _,
    add4L: v,
    add4H: I,
    add5H: B,
    add5L: E
  };
  e.default = S;
})(Jo);
Object.defineProperty(st, "__esModule", { value: !0 });
st.sha384 = st.sha512_256 = st.sha512_224 = st.sha512 = st.SHA512 = void 0;
const ku = _r, ae = Jo, pi = An, [Tu, Iu] = ae.default.split([
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
].map((e) => BigInt(e))), Ut = new Uint32Array(80), Pt = new Uint32Array(80);
let Cr = class extends ku.SHA2 {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: c, Dl: f, Eh: g, El: p, Fh: h, Fl: m, Gh: w, Gl: T, Hh: k, Hl: $ } = this;
    return [t, n, r, i, s, o, c, f, g, p, h, m, w, T, k, $];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, c, f, g, p, h, m, w, T, k, $) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = g | 0, this.El = p | 0, this.Fh = h | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = T | 0, this.Hh = k | 0, this.Hl = $ | 0;
  }
  process(t, n) {
    for (let H = 0; H < 16; H++, n += 4)
      Ut[H] = t.getUint32(n), Pt[H] = t.getUint32(n += 4);
    for (let H = 16; H < 80; H++) {
      const _ = Ut[H - 15] | 0, v = Pt[H - 15] | 0, I = ae.default.rotrSH(_, v, 1) ^ ae.default.rotrSH(_, v, 8) ^ ae.default.shrSH(_, v, 7), E = ae.default.rotrSL(_, v, 1) ^ ae.default.rotrSL(_, v, 8) ^ ae.default.shrSL(_, v, 7), B = Ut[H - 2] | 0, S = Pt[H - 2] | 0, u = ae.default.rotrSH(B, S, 19) ^ ae.default.rotrBH(B, S, 61) ^ ae.default.shrSH(B, S, 6), d = ae.default.rotrSL(B, S, 19) ^ ae.default.rotrBL(B, S, 61) ^ ae.default.shrSL(B, S, 6), a = ae.default.add4L(E, d, Pt[H - 7], Pt[H - 16]), b = ae.default.add4H(a, I, u, Ut[H - 7], Ut[H - 16]);
      Ut[H] = b | 0, Pt[H] = a | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: c, Cl: f, Dh: g, Dl: p, Eh: h, El: m, Fh: w, Fl: T, Gh: k, Gl: $, Hh: R, Hl: z } = this;
    for (let H = 0; H < 80; H++) {
      const _ = ae.default.rotrSH(h, m, 14) ^ ae.default.rotrSH(h, m, 18) ^ ae.default.rotrBH(h, m, 41), v = ae.default.rotrSL(h, m, 14) ^ ae.default.rotrSL(h, m, 18) ^ ae.default.rotrBL(h, m, 41), I = h & w ^ ~h & k, E = m & T ^ ~m & $, B = ae.default.add5L(z, v, E, Iu[H], Pt[H]), S = ae.default.add5H(B, R, _, I, Tu[H], Ut[H]), u = B | 0, d = ae.default.rotrSH(r, i, 28) ^ ae.default.rotrBH(r, i, 34) ^ ae.default.rotrBH(r, i, 39), a = ae.default.rotrSL(r, i, 28) ^ ae.default.rotrBL(r, i, 34) ^ ae.default.rotrBL(r, i, 39), b = r & s ^ r & c ^ s & c, y = i & o ^ i & f ^ o & f;
      R = k | 0, z = $ | 0, k = w | 0, $ = T | 0, w = h | 0, T = m | 0, { h, l: m } = ae.default.add(g | 0, p | 0, S | 0, u | 0), g = c | 0, p = f | 0, c = s | 0, f = o | 0, s = r | 0, o = i | 0;
      const x = ae.default.add3L(u, a, y);
      r = ae.default.add3H(x, S, d, b), i = x | 0;
    }
    ({ h: r, l: i } = ae.default.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = ae.default.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: c, l: f } = ae.default.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: g, l: p } = ae.default.add(this.Dh | 0, this.Dl | 0, g | 0, p | 0), { h, l: m } = ae.default.add(this.Eh | 0, this.El | 0, h | 0, m | 0), { h: w, l: T } = ae.default.add(this.Fh | 0, this.Fl | 0, w | 0, T | 0), { h: k, l: $ } = ae.default.add(this.Gh | 0, this.Gl | 0, k | 0, $ | 0), { h: R, l: z } = ae.default.add(this.Hh | 0, this.Hl | 0, R | 0, z | 0), this.set(r, i, s, o, c, f, g, p, h, m, w, T, k, $, R, z);
  }
  roundClean() {
    Ut.fill(0), Pt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
st.SHA512 = Cr;
let Lu = class extends Cr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, $u = class extends Cr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Uu = class extends Cr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
st.sha512 = (0, pi.wrapConstructor)(() => new Cr());
st.sha512_224 = (0, pi.wrapConstructor)(() => new Lu());
st.sha512_256 = (0, pi.wrapConstructor)(() => new $u());
st.sha384 = (0, pi.wrapConstructor)(() => new Uu());
var hs = {};
(function(e) {
  /*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.bytes = e.stringToBytes = e.str = e.bytesToString = e.hex = e.utf8 = e.bech32m = e.bech32 = e.base58check = e.createBase58check = e.base58xmr = e.base58xrp = e.base58flickr = e.base58 = e.base64urlnopad = e.base64url = e.base64nopad = e.base64 = e.base32crockford = e.base32hexnopad = e.base32hex = e.base32nopad = e.base32 = e.base16 = e.utils = void 0, e.assertNumber = t;
  // @__NO_SIDE_EFFECTS__
  function t(a) {
    if (!Number.isSafeInteger(a))
      throw new Error(`Wrong integer: ${a}`);
  }
  function n(a) {
    return a instanceof Uint8Array || a != null && typeof a == "object" && a.constructor.name === "Uint8Array";
  }
  // @__NO_SIDE_EFFECTS__
  function r(...a) {
    const b = (V) => V, y = (V, G) => (A) => V(G(A)), x = a.map((V) => V.encode).reduceRight(y, b), j = a.map((V) => V.decode).reduce(y, b);
    return { encode: x, decode: j };
  }
  // @__NO_SIDE_EFFECTS__
  function i(a) {
    return {
      encode: (b) => {
        if (!Array.isArray(b) || b.length && typeof b[0] != "number")
          throw new Error("alphabet.encode input should be an array of numbers");
        return b.map((y) => {
          if (y < 0 || y >= a.length)
            throw new Error(`Digit index outside alphabet: ${y} (alphabet: ${a.length})`);
          return a[y];
        });
      },
      decode: (b) => {
        if (!Array.isArray(b) || b.length && typeof b[0] != "string")
          throw new Error("alphabet.decode input should be array of strings");
        return b.map((y) => {
          if (typeof y != "string")
            throw new Error(`alphabet.decode: not string element=${y}`);
          const x = a.indexOf(y);
          if (x === -1)
            throw new Error(`Unknown letter: "${y}". Allowed: ${a}`);
          return x;
        });
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function s(a = "") {
    if (typeof a != "string")
      throw new Error("join separator should be string");
    return {
      encode: (b) => {
        if (!Array.isArray(b) || b.length && typeof b[0] != "string")
          throw new Error("join.encode input should be array of strings");
        for (let y of b)
          if (typeof y != "string")
            throw new Error(`join.encode: non-string input=${y}`);
        return b.join(a);
      },
      decode: (b) => {
        if (typeof b != "string")
          throw new Error("join.decode input should be string");
        return b.split(a);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function o(a, b = "=") {
    if (typeof b != "string")
      throw new Error("padding chr should be string");
    return {
      encode(y) {
        if (!Array.isArray(y) || y.length && typeof y[0] != "string")
          throw new Error("padding.encode input should be array of strings");
        for (let x of y)
          if (typeof x != "string")
            throw new Error(`padding.encode: non-string input=${x}`);
        for (; y.length * a % 8; )
          y.push(b);
        return y;
      },
      decode(y) {
        if (!Array.isArray(y) || y.length && typeof y[0] != "string")
          throw new Error("padding.encode input should be array of strings");
        for (let j of y)
          if (typeof j != "string")
            throw new Error(`padding.decode: non-string input=${j}`);
        let x = y.length;
        if (x * a % 8)
          throw new Error("Invalid padding: string should have whole number of bytes");
        for (; x > 0 && y[x - 1] === b; x--)
          if (!((x - 1) * a % 8))
            throw new Error("Invalid padding: string has too much padding");
        return y.slice(0, x);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function c(a) {
    if (typeof a != "function")
      throw new Error("normalize fn should be function");
    return { encode: (b) => b, decode: (b) => a(b) };
  }
  // @__NO_SIDE_EFFECTS__
  function f(a, b, y) {
    if (b < 2)
      throw new Error(`convertRadix: wrong from=${b}, base cannot be less than 2`);
    if (y < 2)
      throw new Error(`convertRadix: wrong to=${y}, base cannot be less than 2`);
    if (!Array.isArray(a))
      throw new Error("convertRadix: data should be array");
    if (!a.length)
      return [];
    let x = 0;
    const j = [], V = Array.from(a);
    for (V.forEach((G) => {
      if (G < 0 || G >= b)
        throw new Error(`Wrong integer: ${G}`);
    }); ; ) {
      let G = 0, A = !0;
      for (let U = x; U < V.length; U++) {
        const se = V[U], ie = b * G + se;
        if (!Number.isSafeInteger(ie) || b * G / b !== G || ie - se !== b * G)
          throw new Error("convertRadix: carry overflow");
        G = ie % y;
        const q = Math.floor(ie / y);
        if (V[U] = q, !Number.isSafeInteger(q) || q * y + G !== ie)
          throw new Error("convertRadix: carry overflow");
        if (A)
          q ? A = !1 : x = U;
        else continue;
      }
      if (j.push(G), A)
        break;
    }
    for (let G = 0; G < a.length - 1 && a[G] === 0; G++)
      j.push(0);
    return j.reverse();
  }
  const g = /* @__NO_SIDE_EFFECTS__ */ (a, b) => b ? /* @__PURE__ */ g(b, a % b) : a, p = /* @__NO_SIDE_EFFECTS__ */ (a, b) => a + (b - /* @__PURE__ */ g(a, b));
  // @__NO_SIDE_EFFECTS__
  function h(a, b, y, x) {
    if (!Array.isArray(a))
      throw new Error("convertRadix2: data should be array");
    if (b <= 0 || b > 32)
      throw new Error(`convertRadix2: wrong from=${b}`);
    if (y <= 0 || y > 32)
      throw new Error(`convertRadix2: wrong to=${y}`);
    if (/* @__PURE__ */ p(b, y) > 32)
      throw new Error(`convertRadix2: carry overflow from=${b} to=${y} carryBits=${/* @__PURE__ */ p(b, y)}`);
    let j = 0, V = 0;
    const G = 2 ** y - 1, A = [];
    for (const U of a) {
      if (U >= 2 ** b)
        throw new Error(`convertRadix2: invalid data word=${U} from=${b}`);
      if (j = j << b | U, V + b > 32)
        throw new Error(`convertRadix2: carry overflow pos=${V} from=${b}`);
      for (V += b; V >= y; V -= y)
        A.push((j >> V - y & G) >>> 0);
      j &= 2 ** V - 1;
    }
    if (j = j << y - V & G, !x && V >= b)
      throw new Error("Excess padding");
    if (!x && j)
      throw new Error(`Non-zero padding: ${j}`);
    return x && V > 0 && A.push(j >>> 0), A;
  }
  // @__NO_SIDE_EFFECTS__
  function m(a) {
    return {
      encode: (b) => {
        if (!n(b))
          throw new Error("radix.encode input should be Uint8Array");
        return /* @__PURE__ */ f(Array.from(b), 2 ** 8, a);
      },
      decode: (b) => {
        if (!Array.isArray(b) || b.length && typeof b[0] != "number")
          throw new Error("radix.decode input should be array of numbers");
        return Uint8Array.from(/* @__PURE__ */ f(b, a, 2 ** 8));
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function w(a, b = !1) {
    if (a <= 0 || a > 32)
      throw new Error("radix2: bits should be in (0..32]");
    if (/* @__PURE__ */ p(8, a) > 32 || /* @__PURE__ */ p(a, 8) > 32)
      throw new Error("radix2: carry overflow");
    return {
      encode: (y) => {
        if (!n(y))
          throw new Error("radix2.encode input should be Uint8Array");
        return /* @__PURE__ */ h(Array.from(y), 8, a, !b);
      },
      decode: (y) => {
        if (!Array.isArray(y) || y.length && typeof y[0] != "number")
          throw new Error("radix2.decode input should be array of numbers");
        return Uint8Array.from(/* @__PURE__ */ h(y, a, 8, b));
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function T(a) {
    if (typeof a != "function")
      throw new Error("unsafeWrapper fn should be function");
    return function(...b) {
      try {
        return a.apply(null, b);
      } catch {
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function k(a, b) {
    if (typeof b != "function")
      throw new Error("checksum fn should be function");
    return {
      encode(y) {
        if (!n(y))
          throw new Error("checksum.encode: input should be Uint8Array");
        const x = b(y).slice(0, a), j = new Uint8Array(y.length + a);
        return j.set(y), j.set(x, y.length), j;
      },
      decode(y) {
        if (!n(y))
          throw new Error("checksum.decode: input should be Uint8Array");
        const x = y.slice(0, -a), j = b(x).slice(0, a), V = y.slice(-a);
        for (let G = 0; G < a; G++)
          if (j[G] !== V[G])
            throw new Error("Invalid checksum");
        return x;
      }
    };
  }
  e.utils = {
    alphabet: i,
    chain: r,
    checksum: k,
    convertRadix: f,
    convertRadix2: h,
    radix: m,
    radix2: w,
    join: s,
    padding: o
  }, e.base16 = /* @__PURE__ */ r(/* @__PURE__ */ w(4), /* @__PURE__ */ i("0123456789ABCDEF"), /* @__PURE__ */ s("")), e.base32 = /* @__PURE__ */ r(/* @__PURE__ */ w(5), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), /* @__PURE__ */ o(5), /* @__PURE__ */ s("")), e.base32nopad = /* @__PURE__ */ r(/* @__PURE__ */ w(5), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), /* @__PURE__ */ s("")), e.base32hex = /* @__PURE__ */ r(/* @__PURE__ */ w(5), /* @__PURE__ */ i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), /* @__PURE__ */ o(5), /* @__PURE__ */ s("")), e.base32hexnopad = /* @__PURE__ */ r(/* @__PURE__ */ w(5), /* @__PURE__ */ i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), /* @__PURE__ */ s("")), e.base32crockford = /* @__PURE__ */ r(/* @__PURE__ */ w(5), /* @__PURE__ */ i("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), /* @__PURE__ */ s(""), /* @__PURE__ */ c((a) => a.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1"))), e.base64 = /* @__PURE__ */ r(/* @__PURE__ */ w(6), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ o(6), /* @__PURE__ */ s("")), e.base64nopad = /* @__PURE__ */ r(/* @__PURE__ */ w(6), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ s("")), e.base64url = /* @__PURE__ */ r(/* @__PURE__ */ w(6), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), /* @__PURE__ */ o(6), /* @__PURE__ */ s("")), e.base64urlnopad = /* @__PURE__ */ r(/* @__PURE__ */ w(6), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), /* @__PURE__ */ s(""));
  const $ = (a) => /* @__PURE__ */ r(/* @__PURE__ */ m(58), /* @__PURE__ */ i(a), /* @__PURE__ */ s(""));
  e.base58 = $("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), e.base58flickr = $("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), e.base58xrp = $("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
  const R = [0, 2, 3, 5, 6, 7, 9, 10, 11];
  e.base58xmr = {
    encode(a) {
      let b = "";
      for (let y = 0; y < a.length; y += 8) {
        const x = a.subarray(y, y + 8);
        b += e.base58.encode(x).padStart(R[x.length], "1");
      }
      return b;
    },
    decode(a) {
      let b = [];
      for (let y = 0; y < a.length; y += 11) {
        const x = a.slice(y, y + 11), j = R.indexOf(x.length), V = e.base58.decode(x);
        for (let G = 0; G < V.length - j; G++)
          if (V[G] !== 0)
            throw new Error("base58xmr: wrong padding");
        b = b.concat(Array.from(V.slice(V.length - j)));
      }
      return Uint8Array.from(b);
    }
  };
  const z = (a) => /* @__PURE__ */ r(/* @__PURE__ */ k(4, (b) => a(a(b))), e.base58);
  e.createBase58check = z, e.base58check = e.createBase58check;
  const H = /* @__PURE__ */ r(/* @__PURE__ */ i("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ s("")), _ = [996825010, 642813549, 513874426, 1027748829, 705979059];
  // @__NO_SIDE_EFFECTS__
  function v(a) {
    const b = a >> 25;
    let y = (a & 33554431) << 5;
    for (let x = 0; x < _.length; x++)
      (b >> x & 1) === 1 && (y ^= _[x]);
    return y;
  }
  // @__NO_SIDE_EFFECTS__
  function I(a, b, y = 1) {
    const x = a.length;
    let j = 1;
    for (let V = 0; V < x; V++) {
      const G = a.charCodeAt(V);
      if (G < 33 || G > 126)
        throw new Error(`Invalid prefix (${a})`);
      j = /* @__PURE__ */ v(j) ^ G >> 5;
    }
    j = /* @__PURE__ */ v(j);
    for (let V = 0; V < x; V++)
      j = /* @__PURE__ */ v(j) ^ a.charCodeAt(V) & 31;
    for (let V of b)
      j = /* @__PURE__ */ v(j) ^ V;
    for (let V = 0; V < 6; V++)
      j = /* @__PURE__ */ v(j);
    return j ^= y, H.encode(/* @__PURE__ */ h([j % 2 ** 30], 30, 5, !1));
  }
  // @__NO_SIDE_EFFECTS__
  function E(a) {
    const b = a === "bech32" ? 1 : 734539939, y = /* @__PURE__ */ w(5), x = y.decode, j = y.encode, V = /* @__PURE__ */ T(x);
    function G(q, oe, ke = 90) {
      if (typeof q != "string")
        throw new Error(`bech32.encode prefix should be string, not ${typeof q}`);
      if (oe instanceof Uint8Array && (oe = Array.from(oe)), !Array.isArray(oe) || oe.length && typeof oe[0] != "number")
        throw new Error(`bech32.encode words should be array of numbers, not ${typeof oe}`);
      if (q.length === 0)
        throw new TypeError(`Invalid prefix length ${q.length}`);
      const Te = q.length + 7 + oe.length;
      if (ke !== !1 && Te > ke)
        throw new TypeError(`Length ${Te} exceeds limit ${ke}`);
      const ct = q.toLowerCase(), P = /* @__PURE__ */ I(ct, oe, b);
      return `${ct}1${H.encode(oe)}${P}`;
    }
    function A(q, oe = 90) {
      if (typeof q != "string")
        throw new Error(`bech32.decode input should be string, not ${typeof q}`);
      if (q.length < 8 || oe !== !1 && q.length > oe)
        throw new TypeError(`Wrong string length: ${q.length} (${q}). Expected (8..${oe})`);
      const ke = q.toLowerCase();
      if (q !== ke && q !== q.toUpperCase())
        throw new Error("String must be lowercase or uppercase");
      const Te = ke.lastIndexOf("1");
      if (Te === 0 || Te === -1)
        throw new Error('Letter "1" must be present between prefix and data only');
      const ct = ke.slice(0, Te), P = ke.slice(Te + 1);
      if (P.length < 6)
        throw new Error("Data must be at least 6 characters long");
      const O = H.decode(P).slice(0, -6), L = /* @__PURE__ */ I(ct, O, b);
      if (!P.endsWith(L))
        throw new Error(`Invalid checksum in ${q}: expected "${L}"`);
      return { prefix: ct, words: O };
    }
    const U = /* @__PURE__ */ T(A);
    function se(q) {
      const { prefix: oe, words: ke } = A(q, !1);
      return { prefix: oe, words: ke, bytes: x(ke) };
    }
    function ie(q, oe) {
      return G(q, j(oe));
    }
    return {
      encode: G,
      decode: A,
      encodeFromBytes: ie,
      decodeToBytes: se,
      decodeUnsafe: U,
      fromWords: x,
      fromWordsUnsafe: V,
      toWords: j
    };
  }
  e.bech32 = /* @__PURE__ */ E("bech32"), e.bech32m = /* @__PURE__ */ E("bech32m"), e.utf8 = {
    encode: (a) => new TextDecoder().decode(a),
    decode: (a) => new TextEncoder().encode(a)
  }, e.hex = /* @__PURE__ */ r(/* @__PURE__ */ w(4), /* @__PURE__ */ i("0123456789abcdef"), /* @__PURE__ */ s(""), /* @__PURE__ */ c((a) => {
    if (typeof a != "string" || a.length % 2)
      throw new TypeError(`hex.decode: expected string, got ${typeof a} with length ${a.length}`);
    return a.toLowerCase();
  }));
  const B = {
    utf8: e.utf8,
    hex: e.hex,
    base16: e.base16,
    base32: e.base32,
    base64: e.base64,
    base64url: e.base64url,
    base58: e.base58,
    base58xmr: e.base58xmr
  }, S = "Invalid encoding type. Available types: utf8, hex, base16, base32, base64, base64url, base58, base58xmr", u = (a, b) => {
    if (typeof a != "string" || !B.hasOwnProperty(a))
      throw new TypeError(S);
    if (!n(b))
      throw new TypeError("bytesToString() expects Uint8Array");
    return B[a].encode(b);
  };
  e.bytesToString = u, e.str = e.bytesToString;
  const d = (a, b) => {
    if (!B.hasOwnProperty(a))
      throw new TypeError(S);
    if (typeof b != "string")
      throw new TypeError("stringToBytes() expects string");
    return B[a].decode(b);
  };
  e.stringToBytes = d, e.bytes = e.stringToBytes;
})(hs);
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.mnemonicToSeedSync = Ze.mnemonicToSeed = Ze.validateMnemonic = Ze.entropyToMnemonic = Ze.mnemonicToEntropy = Ze.generateMnemonic = void 0;
/*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
const Qo = Ie, ea = Mn, Pu = Dn, ta = st, Ou = An, Rr = hs, Nu = (e) => e[0] === "あいこくしん";
function na(e) {
  if (typeof e != "string")
    throw new TypeError(`Invalid mnemonic type: ${typeof e}`);
  return e.normalize("NFKD");
}
function ls(e) {
  const t = na(e), n = t.split(" ");
  if (![12, 15, 18, 21, 24].includes(n.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: t, words: n };
}
function ra(e) {
  Qo.default.bytes(e, 16, 20, 24, 28, 32);
}
function Mu(e, t = 128) {
  if (Qo.default.number(t), t % 32 !== 0 || t > 256)
    throw new TypeError("Invalid entropy");
  return oa((0, Ou.randomBytes)(t / 8), e);
}
Ze.generateMnemonic = Mu;
const Du = (e) => {
  const t = 8 - e.length / 4;
  return new Uint8Array([(0, Pu.sha256)(e)[0] >> t << t]);
};
function ia(e) {
  if (!Array.isArray(e) || e.length !== 2 ** 11 || typeof e[0] != "string")
    throw new Error("Worlist: expected array of 2048 strings");
  return e.forEach((t) => {
    if (typeof t != "string")
      throw new Error(`Wordlist: non-string element: ${t}`);
  }), Rr.utils.chain(Rr.utils.checksum(1, Du), Rr.utils.radix2(11, !0), Rr.utils.alphabet(e));
}
function sa(e, t) {
  const { words: n } = ls(e), r = ia(t).decode(n);
  return ra(r), r;
}
Ze.mnemonicToEntropy = sa;
function oa(e, t) {
  return ra(e), ia(t).encode(e).join(Nu(t) ? "　" : " ");
}
Ze.entropyToMnemonic = oa;
function Fu(e, t) {
  try {
    sa(e, t);
  } catch {
    return !1;
  }
  return !0;
}
Ze.validateMnemonic = Fu;
const aa = (e) => na(`mnemonic${e}`);
function ju(e, t = "") {
  return (0, ea.pbkdf2Async)(ta.sha512, ls(e).nfkd, aa(t), { c: 2048, dkLen: 64 });
}
Ze.mnemonicToSeed = ju;
function Vu(e, t = "") {
  return (0, ea.pbkdf2)(ta.sha512, ls(e).nfkd, aa(t), { c: 2048, dkLen: 64 });
}
Ze.mnemonicToSeedSync = Vu;
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
ds.wordlist = void 0;
ds.wordlist = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);
function qi(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Ru(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function ca(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function zu(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  qi(e.outputLen), qi(e.blockLen);
}
function Gu(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Wu(e, t) {
  ca(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const un = {
  number: qi,
  bool: Ru,
  bytes: ca,
  hash: zu,
  exists: Gu,
  output: Wu
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fi = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), bt = (e, t) => e << 32 - t | e >>> t, Ku = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ku)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function fa(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function ps(e) {
  if (typeof e == "string" && (e = fa(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let ua = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Sn(e) {
  const t = (r) => e().update(ps(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let ha = class extends ua {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, un.hash(t);
    const r = ps(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? t.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return un.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    un.exists(this), un.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: c } = this;
    return t = t, t.finished = i, t.destroyed = s, t.blockLen = o, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const la = (e, t, n) => new ha(e, t).update(n).digest();
la.create = (e, t) => new ha(e, t);
function qu(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), c = Number(n & s), f = r ? 4 : 0, g = r ? 0 : 4;
  e.setUint32(t + f, o, r), e.setUint32(t + g, c, r);
}
let gs = class extends ua {
  constructor(t, n, r, i) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Fi(this.buffer);
  }
  update(t) {
    un.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    t = ps(t);
    const s = t.length;
    for (let o = 0; o < s; ) {
      const c = Math.min(i - this.pos, s - o);
      if (c === i) {
        const f = Fi(t);
        for (; i <= s - o; o += i)
          this.process(f, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    un.exists(this), un.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let h = o; h < i; h++)
      n[h] = 0;
    qu(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = Fi(t), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const g = f / 4, p = this.get();
    if (g > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < g; h++)
      c.setUint32(4 * h, p[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: c } = this;
    return t.length = i, t.pos = c, t.finished = s, t.destroyed = o, i % n && t.buffer.set(r), t;
  }
};
const Xu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), da = Uint8Array.from({ length: 16 }, (e, t) => t), Zu = da.map((e) => (9 * e + 5) % 16);
let bs = [da], ys = [Zu];
for (let e = 0; e < 4; e++)
  for (let t of [bs, ys])
    t.push(t[e].map((n) => Xu[n]));
const pa = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), Yu = bs.map((e, t) => e.map((n) => pa[t][n])), Ju = ys.map((e, t) => e.map((n) => pa[t][n])), Qu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), eh = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), zr = (e, t) => e << t | e >>> 32 - t;
function so(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Gr = new Uint32Array(16);
let th = class extends gs {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: i, h4: s } = this;
    return [t, n, r, i, s];
  }
  set(t, n, r, i, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      Gr[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, c = this.h2 | 0, f = c, g = this.h3 | 0, p = g, h = this.h4 | 0, m = h;
    for (let w = 0; w < 5; w++) {
      const T = 4 - w, k = Qu[w], $ = eh[w], R = bs[w], z = ys[w], H = Yu[w], _ = Ju[w];
      for (let v = 0; v < 16; v++) {
        const I = zr(r + so(w, s, c, g) + Gr[R[v]] + k, H[v]) + h | 0;
        r = h, h = g, g = zr(c, 10) | 0, c = s, s = I;
      }
      for (let v = 0; v < 16; v++) {
        const I = zr(i + so(T, o, f, p) + Gr[z[v]] + $, _[v]) + m | 0;
        i = m, m = p, p = zr(f, 10) | 0, f = o, o = I;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + g + m | 0, this.h3 + h + i | 0, this.h4 + r + o | 0, this.h0 + s + f | 0);
  }
  roundClean() {
    Gr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Sn(() => new th());
const nh = (e, t, n) => e & t ^ ~e & n, rh = (e, t, n) => e & t ^ e & n ^ t & n, ih = new Uint32Array([
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
]), Ot = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Nt = new Uint32Array(64);
let ga = class extends gs {
  constructor() {
    super(64, 32, 8, !1), this.A = Ot[0] | 0, this.B = Ot[1] | 0, this.C = Ot[2] | 0, this.D = Ot[3] | 0, this.E = Ot[4] | 0, this.F = Ot[5] | 0, this.G = Ot[6] | 0, this.H = Ot[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: s, F: o, G: c, H: f } = this;
    return [t, n, r, i, s, o, c, f];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, c, f) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Nt[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const m = Nt[h - 15], w = Nt[h - 2], T = bt(m, 7) ^ bt(m, 18) ^ m >>> 3, k = bt(w, 17) ^ bt(w, 19) ^ w >>> 10;
      Nt[h] = k + Nt[h - 7] + T + Nt[h - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: c, F: f, G: g, H: p } = this;
    for (let h = 0; h < 64; h++) {
      const m = bt(c, 6) ^ bt(c, 11) ^ bt(c, 25), w = p + m + nh(c, f, g) + ih[h] + Nt[h] | 0, k = (bt(r, 2) ^ bt(r, 13) ^ bt(r, 22)) + rh(r, i, s) | 0;
      p = g, g = f, f = c, c = o + w | 0, o = s, s = i, i = r, r = w + k | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, g = g + this.G | 0, p = p + this.H | 0, this.set(r, i, s, o, c, f, g, p);
  }
  roundClean() {
    Nt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, sh = class extends ga {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ba = Sn(() => new ga());
Sn(() => new sh());
const Wr = BigInt(2 ** 32 - 1), Xi = BigInt(32);
function ya(e, t = !1) {
  return t ? { h: Number(e & Wr), l: Number(e >> Xi & Wr) } : { h: Number(e >> Xi & Wr) | 0, l: Number(e & Wr) | 0 };
}
function oh(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let i = 0; i < e.length; i++) {
    const { h: s, l: o } = ya(e[i], t);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const ah = (e, t) => BigInt(e >>> 0) << Xi | BigInt(t >>> 0), ch = (e, t, n) => e >>> n, fh = (e, t, n) => e << 32 - n | t >>> n, uh = (e, t, n) => e >>> n | t << 32 - n, hh = (e, t, n) => e << 32 - n | t >>> n, lh = (e, t, n) => e << 64 - n | t >>> n - 32, dh = (e, t, n) => e >>> n - 32 | t << 64 - n, ph = (e, t) => t, gh = (e, t) => e, bh = (e, t, n) => e << n | t >>> 32 - n, yh = (e, t, n) => t << n | e >>> 32 - n, wh = (e, t, n) => t << n - 32 | e >>> 64 - n, mh = (e, t, n) => e << n - 32 | t >>> 64 - n;
function xh(e, t, n, r) {
  const i = (t >>> 0) + (r >>> 0);
  return { h: e + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const vh = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Ah = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Sh = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Eh = (e, t, n, r, i) => t + n + r + i + (e / 2 ** 32 | 0) | 0, Bh = (e, t, n, r, i) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Hh = (e, t, n, r, i, s) => t + n + r + i + s + (e / 2 ** 32 | 0) | 0, ce = {
  fromBig: ya,
  split: oh,
  toBig: ah,
  shrSH: ch,
  shrSL: fh,
  rotrSH: uh,
  rotrSL: hh,
  rotrBH: lh,
  rotrBL: dh,
  rotr32H: ph,
  rotr32L: gh,
  rotlSH: bh,
  rotlSL: yh,
  rotlBH: wh,
  rotlBL: mh,
  add: xh,
  add3L: vh,
  add3H: Ah,
  add4L: Sh,
  add4H: Eh,
  add5H: Hh,
  add5L: Bh
}, [_h, Ch] = ce.split([
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
].map((e) => BigInt(e))), Mt = new Uint32Array(80), Dt = new Uint32Array(80);
let gi = class extends gs {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: c, Dl: f, Eh: g, El: p, Fh: h, Fl: m, Gh: w, Gl: T, Hh: k, Hl: $ } = this;
    return [t, n, r, i, s, o, c, f, g, p, h, m, w, T, k, $];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, c, f, g, p, h, m, w, T, k, $) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = g | 0, this.El = p | 0, this.Fh = h | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = T | 0, this.Hh = k | 0, this.Hl = $ | 0;
  }
  process(t, n) {
    for (let H = 0; H < 16; H++, n += 4)
      Mt[H] = t.getUint32(n), Dt[H] = t.getUint32(n += 4);
    for (let H = 16; H < 80; H++) {
      const _ = Mt[H - 15] | 0, v = Dt[H - 15] | 0, I = ce.rotrSH(_, v, 1) ^ ce.rotrSH(_, v, 8) ^ ce.shrSH(_, v, 7), E = ce.rotrSL(_, v, 1) ^ ce.rotrSL(_, v, 8) ^ ce.shrSL(_, v, 7), B = Mt[H - 2] | 0, S = Dt[H - 2] | 0, u = ce.rotrSH(B, S, 19) ^ ce.rotrBH(B, S, 61) ^ ce.shrSH(B, S, 6), d = ce.rotrSL(B, S, 19) ^ ce.rotrBL(B, S, 61) ^ ce.shrSL(B, S, 6), a = ce.add4L(E, d, Dt[H - 7], Dt[H - 16]), b = ce.add4H(a, I, u, Mt[H - 7], Mt[H - 16]);
      Mt[H] = b | 0, Dt[H] = a | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: c, Cl: f, Dh: g, Dl: p, Eh: h, El: m, Fh: w, Fl: T, Gh: k, Gl: $, Hh: R, Hl: z } = this;
    for (let H = 0; H < 80; H++) {
      const _ = ce.rotrSH(h, m, 14) ^ ce.rotrSH(h, m, 18) ^ ce.rotrBH(h, m, 41), v = ce.rotrSL(h, m, 14) ^ ce.rotrSL(h, m, 18) ^ ce.rotrBL(h, m, 41), I = h & w ^ ~h & k, E = m & T ^ ~m & $, B = ce.add5L(z, v, E, Ch[H], Dt[H]), S = ce.add5H(B, R, _, I, _h[H], Mt[H]), u = B | 0, d = ce.rotrSH(r, i, 28) ^ ce.rotrBH(r, i, 34) ^ ce.rotrBH(r, i, 39), a = ce.rotrSL(r, i, 28) ^ ce.rotrBL(r, i, 34) ^ ce.rotrBL(r, i, 39), b = r & s ^ r & c ^ s & c, y = i & o ^ i & f ^ o & f;
      R = k | 0, z = $ | 0, k = w | 0, $ = T | 0, w = h | 0, T = m | 0, { h, l: m } = ce.add(g | 0, p | 0, S | 0, u | 0), g = c | 0, p = f | 0, c = s | 0, f = o | 0, s = r | 0, o = i | 0;
      const x = ce.add3L(u, a, y);
      r = ce.add3H(x, S, d, b), i = x | 0;
    }
    ({ h: r, l: i } = ce.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = ce.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: c, l: f } = ce.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: g, l: p } = ce.add(this.Dh | 0, this.Dl | 0, g | 0, p | 0), { h, l: m } = ce.add(this.Eh | 0, this.El | 0, h | 0, m | 0), { h: w, l: T } = ce.add(this.Fh | 0, this.Fl | 0, w | 0, T | 0), { h: k, l: $ } = ce.add(this.Gh | 0, this.Gl | 0, k | 0, $ | 0), { h: R, l: z } = ce.add(this.Hh | 0, this.Hl | 0, R | 0, z | 0), this.set(r, i, s, o, c, f, g, p, h, m, w, T, k, $, R, z);
  }
  roundClean() {
    Mt.fill(0), Dt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, kh = class extends gi {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Th = class extends gi {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ih = class extends gi {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Sn(() => new gi());
Sn(() => new kh());
Sn(() => new Th());
Sn(() => new Ih());
const Lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const pe = BigInt(0), xe = BigInt(1), qt = BigInt(2), ar = BigInt(3), oo = BigInt(8), He = Object.freeze({
  a: pe,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: xe,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), ao = (e, t) => (e + t / qt) / t, Kr = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = He, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -xe * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), c = ao(s * e, t), f = ao(-r * e, t);
    let g = K(e - c * n - f * i, t), p = K(-c * r - f * s, t);
    const h = g > o, m = p > o;
    if (h && (g = t - g), m && (p = t - p), g > o || p > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: h, k1: g, k2neg: m, k2: p };
  }
}, ht = 32, Fn = 32, $h = 32, co = ht + 1, fo = 2 * ht + 1;
function uo(e) {
  const { a: t, b: n } = He, r = K(e * e), i = K(r * e);
  return K(i + t * e + n);
}
const qr = He.a === pe;
class wa extends Error {
  constructor(t) {
    super(t);
  }
}
function ho(e) {
  if (!(e instanceof ge))
    throw new TypeError("JacobianPoint expected");
}
class ge {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof me))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(me.ZERO) ? ge.ZERO : new ge(t.x, t.y, xe);
  }
  static toAffineBatch(t) {
    const n = Mh(t.map((r) => r.z));
    return t.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(t) {
    return ge.toAffineBatch(t).map(ge.fromAffine);
  }
  equals(t) {
    ho(t);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: c } = t, f = K(i * i), g = K(c * c), p = K(n * g), h = K(s * f), m = K(K(r * c) * g), w = K(K(o * i) * f);
    return p === h && m === w;
  }
  negate() {
    return new ge(this.x, K(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, i = K(t * t), s = K(n * n), o = K(s * s), c = t + s, f = K(qt * (K(c * c) - i - o)), g = K(ar * i), p = K(g * g), h = K(p - qt * f), m = K(g * (f - h) - oo * o), w = K(qt * n * r);
    return new ge(h, m, w);
  }
  add(t) {
    ho(t);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: c } = t;
    if (s === pe || o === pe)
      return this;
    if (n === pe || r === pe)
      return t;
    const f = K(i * i), g = K(c * c), p = K(n * g), h = K(s * f), m = K(K(r * c) * g), w = K(K(o * i) * f), T = K(h - p), k = K(w - m);
    if (T === pe)
      return k === pe ? this.double() : ge.ZERO;
    const $ = K(T * T), R = K(T * $), z = K(p * $), H = K(k * k - R - qt * z), _ = K(k * (z - H) - m * R), v = K(i * c * T);
    return new ge(H, _, v);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = ge.ZERO;
    if (typeof t == "bigint" && t === pe)
      return n;
    let r = go(t);
    if (r === xe)
      return this;
    if (!qr) {
      let h = n, m = this;
      for (; r > pe; )
        r & xe && (h = h.add(m)), m = m.double(), r >>= xe;
      return h;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: c } = Kr.splitScalar(r), f = n, g = n, p = this;
    for (; s > pe || c > pe; )
      s & xe && (f = f.add(p)), c & xe && (g = g.add(p)), p = p.double(), s >>= xe, c >>= xe;
    return i && (f = f.negate()), o && (g = g.negate()), g = new ge(K(g.x * Kr.beta), g.y, g.z), f.add(g);
  }
  precomputeWindow(t) {
    const n = qr ? 128 / t + 1 : 256 / t + 1, r = [];
    let i = this, s = i;
    for (let o = 0; o < n; o++) {
      s = i, r.push(s);
      for (let c = 1; c < 2 ** (t - 1); c++)
        s = s.add(i), r.push(s);
      i = s.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(ge.BASE) && (n = me.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && Zi.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = ge.normalizeZ(i), Zi.set(n, i)));
    let s = ge.ZERO, o = ge.BASE;
    const c = 1 + (qr ? 128 / r : 256 / r), f = 2 ** (r - 1), g = BigInt(2 ** r - 1), p = 2 ** r, h = BigInt(r);
    for (let m = 0; m < c; m++) {
      const w = m * f;
      let T = Number(t & g);
      t >>= h, T > f && (T -= p, t += xe);
      const k = w, $ = w + Math.abs(T) - 1, R = m % 2 !== 0, z = T < 0;
      T === 0 ? o = o.add(Xr(R, i[k])) : s = s.add(Xr(z, i[$]));
    }
    return { p: s, f: o };
  }
  multiply(t, n) {
    let r = go(t), i, s;
    if (qr) {
      const { k1neg: o, k1: c, k2neg: f, k2: g } = Kr.splitScalar(r);
      let { p, f: h } = this.wNAF(c, n), { p: m, f: w } = this.wNAF(g, n);
      p = Xr(o, p), m = Xr(f, m), m = new ge(K(m.x * Kr.beta), m.y, m.z), i = p.add(m), s = h.add(w);
    } else {
      const { p: o, f: c } = this.wNAF(r, n);
      i = o, s = c;
    }
    return ge.normalizeZ([i, s])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: i } = this, s = this.equals(ge.ZERO);
    t == null && (t = s ? oo : kr(i));
    const o = t, c = K(o * o), f = K(c * o), g = K(n * c), p = K(r * f), h = K(i * o);
    if (s)
      return me.ZERO;
    if (h !== xe)
      throw new Error("invZ was invalid");
    return new me(g, p);
  }
}
ge.BASE = new ge(He.Gx, He.Gy, xe);
ge.ZERO = new ge(pe, xe, pe);
function Xr(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Zi = /* @__PURE__ */ new WeakMap();
class me {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Zi.delete(this);
  }
  hasEvenY() {
    return this.y % qt === pe;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = Zt(n ? t : t.subarray(1));
    if (!ji(r))
      throw new Error("Point is not on curve");
    const i = uo(r);
    let s = Nh(i);
    const o = (s & xe) === xe;
    n ? o && (s = K(-s)) : (t[0] & 1) === 1 !== o && (s = K(-s));
    const c = new me(r, s);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(t) {
    const n = Zt(t.subarray(1, ht + 1)), r = Zt(t.subarray(ht + 1, ht * 2 + 1)), i = new me(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(t) {
    const n = dr(t), r = n.length, i = n[0];
    if (r === ht)
      return this.fromCompressedHex(n);
    if (r === co && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === fo && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${co} compressed bytes or ${fo} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return me.BASE.multiply(ii(t));
  }
  static fromSignature(t, n, r) {
    const { r: i, s } = Vh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = ma(dr(t)), { n: c } = He, f = r === 2 || r === 3 ? i + c : i, g = kr(f, c), p = K(-o * g, c), h = K(s * g, c), m = r & 1 ? "03" : "02", w = me.fromHex(m + On(f)), T = me.BASE.multiplyAndAddUnsafe(w, p, h);
    if (!T)
      throw new Error("Cannot recover signature: point at infinify");
    return T.assertValidity(), T;
  }
  toRawBytes(t = !1) {
    return dn(this.toHex(t));
  }
  toHex(t = !1) {
    const n = On(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${On(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ji(n) || !ji(r))
      throw new Error(t);
    const i = K(r * r), s = uo(n);
    if (K(i - s) !== pe)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new me(this.x, K(-this.y));
  }
  double() {
    return ge.fromAffine(this).double().toAffine();
  }
  add(t) {
    return ge.fromAffine(this).add(ge.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return ge.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const i = ge.fromAffine(this), s = n === pe || n === xe || this !== me.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = ge.fromAffine(t).multiplyUnsafe(r), c = s.add(o);
    return c.equals(ge.ZERO) ? void 0 : c.toAffine();
  }
}
me.BASE = new me(He.Gx, He.Gy);
me.ZERO = new me(pe, pe);
function lo(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function po(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${jn(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Zt(n), left: e.subarray(t + 2) };
}
function Uh(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${jn(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = po(e.subarray(2)), { data: r, left: i } = po(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${jn(i)}`);
  return { r: t, s: r };
}
class xt {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? jn(t) : t;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new xt(ri(i.slice(0, 64)), ri(i.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = Uh(n ? t : dn(t));
    return new xt(r, i);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!pr(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!pr(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = He.n >> xe;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new xt(this.r, K(-this.s, He.n)) : this;
  }
  toDERRawBytes() {
    return dn(this.toDERHex());
  }
  toDERHex() {
    const t = lo(sr(this.s)), n = lo(sr(this.r)), r = t.length / 2, i = n.length / 2, s = sr(r), o = sr(i);
    return `30${sr(i + r + 4)}02${o}${n}02${s}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return dn(this.toCompactHex());
  }
  toCompactHex() {
    return On(this.r) + On(this.s);
  }
}
function Kt(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, i) => r + i.length, 0), n = new Uint8Array(t);
  for (let r = 0, i = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
const Ph = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function jn(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Ph[e[n]];
  return t;
}
const Oh = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function On(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(pe <= e && e < Oh))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Yi(e) {
  const t = dn(On(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function sr(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function ri(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function dn(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, i = e.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function Zt(e) {
  return ri(jn(e));
}
function dr(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : dn(e);
}
function go(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && pr(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function K(e, t = He.P) {
  const n = e % t;
  return n >= pe ? n : t + n;
}
function tt(e, t) {
  const { P: n } = He;
  let r = e;
  for (; t-- > pe; )
    r *= r, r %= n;
  return r;
}
function Nh(e) {
  const { P: t } = He, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), c = BigInt(88), f = e * e * e % t, g = f * f * e % t, p = tt(g, ar) * g % t, h = tt(p, ar) * g % t, m = tt(h, qt) * f % t, w = tt(m, r) * m % t, T = tt(w, i) * w % t, k = tt(T, o) * T % t, $ = tt(k, c) * k % t, R = tt($, o) * T % t, z = tt(R, ar) * g % t, H = tt(z, s) * w % t, _ = tt(H, n) * f % t, v = tt(_, qt);
  if (v * v % t !== e)
    throw new Error("Cannot find square root");
  return v;
}
function kr(e, t = He.P) {
  if (e === pe || t <= pe)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = K(e, t), r = t, i = pe, s = xe;
  for (; n !== pe; ) {
    const c = r / n, f = r % n, g = i - s * c;
    r = n, n = f, i = s, s = g;
  }
  if (r !== xe)
    throw new Error("invert: does not exist");
  return K(i, t);
}
function Mh(e, t = He.P) {
  const n = new Array(e.length), r = e.reduce((s, o, c) => o === pe ? s : (n[c] = s, K(s * o, t)), xe), i = kr(r, t);
  return e.reduceRight((s, o, c) => o === pe ? s : (n[c] = K(s * n[c], t), K(s * o, t)), i), n;
}
function Dh(e) {
  const t = e.length * 8 - Fn * 8, n = Zt(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function ma(e, t = !1) {
  const n = Dh(e);
  if (t)
    return n;
  const { n: r } = He;
  return n >= r ? n - r : n;
}
let Nn, cr;
class Fh {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return mt.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return cr(this.k, ...t);
  }
  checkSync() {
    if (typeof cr != "function")
      throw new wa("hmacSha256Sync needs to be set");
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
    return Kt(...n);
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
    return Kt(...n);
  }
}
function pr(e) {
  return pe < e && e < He.n;
}
function ji(e) {
  return pe < e && e < He.P;
}
function jh(e, t, n, r = !0) {
  const { n: i } = He, s = ma(e, !0);
  if (!pr(s))
    return;
  const o = kr(s, i), c = me.BASE.multiply(s), f = K(c.x, i);
  if (f === pe)
    return;
  const g = K(o * K(t + n * f, i), i);
  if (g === pe)
    return;
  let p = new xt(f, g), h = (c.x === p.r ? 0 : 2) | Number(c.y & xe);
  return r && p.hasHighS() && (p = p.normalizeS(), h ^= 1), { sig: p, recovery: h };
}
function ii(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Fn)
      throw new Error("Expected 32 bytes of private key");
    t = ri(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Fn)
      throw new Error("Expected 32 bytes of private key");
    t = Zt(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!pr(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function Vh(e) {
  if (e instanceof xt)
    return e.assertValidity(), e;
  try {
    return xt.fromDER(e);
  } catch {
    return xt.fromCompact(e);
  }
}
function Rh(e, t = !1) {
  return me.fromPrivateKey(e).toRawBytes(t);
}
function xa(e) {
  const t = e.length > ht ? e.slice(0, ht) : e;
  return Zt(t);
}
function zh(e) {
  const t = xa(e), n = K(t, He.n);
  return va(n < pe ? t : n);
}
function va(e) {
  return Yi(e);
}
function Gh(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = dr(e), i = ii(t), s = [va(i), zh(r)];
  if (n != null) {
    n === !0 && (n = mt.randomBytes(ht));
    const f = dr(n);
    if (f.length !== ht)
      throw new Error(`sign: Expected ${ht} bytes of extra data`);
    s.push(f);
  }
  const o = Kt(...s), c = xa(r);
  return { seed: o, m: c, d: i };
}
function Wh(e, t) {
  const { sig: n, recovery: r } = e, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, t), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
function Kh(e, t, n = {}) {
  const { seed: r, m: i, d: s } = Gh(e, t, n.extraEntropy), o = new Fh($h, Fn);
  o.reseedSync(r);
  let c;
  for (; !(c = jh(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return Wh(c, n);
}
me.BASE._setWindowSize(8);
const Xe = {
  node: Lh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Zr = {}, mt = {
  bytesToHex: jn,
  hexToBytes: dn,
  concatBytes: Kt,
  mod: K,
  invert: kr,
  isValidPrivateKey(e) {
    try {
      return ii(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Yi,
  _normalizePrivateKey: ii,
  hashToPrivateKey: (e) => {
    e = dr(e);
    const t = Fn + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = K(Zt(e), He.n - xe) + xe;
    return Yi(n);
  },
  randomBytes: (e = 32) => {
    if (Xe.web)
      return Xe.web.getRandomValues(new Uint8Array(e));
    if (Xe.node) {
      const { randomBytes: t } = Xe.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => mt.hashToPrivateKey(mt.randomBytes(Fn + 8)),
  precompute(e = 8, t = me.BASE) {
    const n = t === me.BASE ? t : new me(t.x, t.y);
    return n._setWindowSize(e), n.multiply(ar), n;
  },
  sha256: async (...e) => {
    if (Xe.web) {
      const t = await Xe.web.subtle.digest("SHA-256", Kt(...e));
      return new Uint8Array(t);
    } else if (Xe.node) {
      const { createHash: t } = Xe.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (Xe.web) {
      const n = await Xe.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Kt(...t), i = await Xe.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (Xe.node) {
      const { createHmac: n } = Xe.node, r = n("sha256", e);
      return t.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = Zr[e];
    if (n === void 0) {
      const r = await mt.sha256(Uint8Array.from(e, (i) => i.charCodeAt(0)));
      n = Kt(r, r), Zr[e] = n;
    }
    return mt.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Nn != "function")
      throw new wa("sha256Sync is undefined, you need to set it");
    let n = Zr[e];
    if (n === void 0) {
      const r = Nn(Uint8Array.from(e, (i) => i.charCodeAt(0)));
      n = Kt(r, r), Zr[e] = n;
    }
    return Nn(n, ...t);
  },
  _JacobianPoint: ge
};
Object.defineProperties(mt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Nn;
    },
    set(e) {
      Nn || (Nn = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return cr;
    },
    set(e) {
      cr || (cr = e);
    }
  }
});
mt.hmacSha256Sync = (e, ...t) => la(ba, e, mt.concatBytes(...t));
hs.base58check(ba);
fa("Bitcoin seed");
function Yt(e, t, n) {
  return ws(Le(e, t), n);
}
function Le(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ve(r);
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
      const r = Zh(BigInt(`0x${le(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${le(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function bo(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Tr(e, t = 8) {
  return (typeof e == "bigint" ? e : Le(e, !1)).toString(16).padStart(t * 2, "0");
}
function bi(e) {
  return parseInt(e, 16);
}
function ws(e, t = 16) {
  const n = Tr(e, t);
  return ve(n);
}
function qh(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function Xh(e, t) {
  return e & BigInt(1) << t;
}
function Zh(e, t) {
  return Xh(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const Yh = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function le(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Yh[n];
  return t;
}
function ve(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = t.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Yn(e) {
  return new TextEncoder().encode(e);
}
function ms(e) {
  return new TextDecoder().decode(e);
}
function Aa(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Jh(e) {
  return String.fromCharCode.apply(null, e);
}
function Qh(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function yo(e) {
  if (e.some(Qh))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function yi(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, i) => r + i.length, 0), n = new Uint8Array(t);
  for (let r = 0, i = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function _e(e) {
  return yi(...e.map((t) => typeof t == "number" ? yo([t]) : t instanceof Array ? yo(t) : t));
}
var wo;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(wo || (wo = {}));
var mo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(mo || (mo = {}));
var xo;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(xo || (xo = {}));
const Sa = 33, Vi = 32;
function el(e) {
  if (e.length < Vi * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Vi * 2), r = e.slice(2 + Vi * 2);
  return {
    recoveryId: bi(t),
    r: n,
    s: r
  };
}
function tl(e) {
  const t = typeof e == "string" ? ve(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function nl(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function rl(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function il(e, t) {
  return e[t];
}
function sl(e, t, n = 0) {
  return e[n] = t, e;
}
function ol(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function bn(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Ji;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ji || (Ji = {}));
const al = Ji.Mainnet, cl = 128, fl = 128, Ea = 16, pn = 32, Qi = 80, Ir = 65, ul = 32, hl = 64, si = 34;
var X;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(X || (X = {}));
var he;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(he || (he = {}));
var es;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(es || (es = {}));
var Ne;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Ne || (Ne = {}));
const ti = ["onChainOnly", "offChainOnly", "any"], vo = {
  [ti[0]]: Ne.OnChainOnly,
  [ti[1]]: Ne.OffChainOnly,
  [ti[2]]: Ne.Any,
  [Ne.OnChainOnly]: Ne.OnChainOnly,
  [Ne.OffChainOnly]: Ne.OffChainOnly,
  [Ne.Any]: Ne.Any
};
function ll(e) {
  if (e in vo)
    return vo[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${ti.join(", ")}`);
}
var Jt;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Jt || (Jt = {}));
Jt.Mainnet;
var yn;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(yn || (yn = {}));
var De;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(De || (De = {}));
var Ee;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Ee || (Ee = {}));
var de;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(de || (de = {}));
var Qt;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Qt || (Qt = {}));
var Ae;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Ae || (Ae = {}));
var Vn;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Vn || (Vn = {}));
var ts;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(ts || (ts = {}));
var wn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(wn || (wn = {}));
var Ao;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Ao || (Ao = {}));
var So;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(So || (So = {}));
function ns(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function dl(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Ba(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function pl(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ns(e.outputLen), ns(e.blockLen);
}
function gl(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function bl(e, t) {
  Ba(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const hn = {
  number: ns,
  bool: dl,
  bytes: Ba,
  hash: pl,
  exists: gl,
  output: bl
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ri = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), yt = (e, t) => e << 32 - t | e >>> t, yl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yl)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function wl(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function xs(e) {
  if (typeof e == "string" && (e = wl(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class Ha {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function En(e) {
  const t = (r) => e().update(xs(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function ml(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), c = Number(n & s), f = r ? 4 : 0, g = r ? 0 : 4;
  e.setUint32(t + f, o, r), e.setUint32(t + g, c, r);
}
class vs extends Ha {
  constructor(t, n, r, i) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Ri(this.buffer);
  }
  update(t) {
    hn.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    t = xs(t);
    const s = t.length;
    for (let o = 0; o < s; ) {
      const c = Math.min(i - this.pos, s - o);
      if (c === i) {
        const f = Ri(t);
        for (; i <= s - o; o += i)
          this.process(f, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    hn.exists(this), hn.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let h = o; h < i; h++)
      n[h] = 0;
    ml(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = Ri(t), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const g = f / 4, p = this.get();
    if (g > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < g; h++)
      c.setUint32(4 * h, p[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: c } = this;
    return t.length = i, t.pos = c, t.finished = s, t.destroyed = o, i % n && t.buffer.set(r), t;
  }
}
const xl = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _a = Uint8Array.from({ length: 16 }, (e, t) => t), vl = _a.map((e) => (9 * e + 5) % 16);
let As = [_a], Ss = [vl];
for (let e = 0; e < 4; e++)
  for (let t of [As, Ss])
    t.push(t[e].map((n) => xl[n]));
const Ca = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), Al = As.map((e, t) => e.map((n) => Ca[t][n])), Sl = Ss.map((e, t) => e.map((n) => Ca[t][n])), El = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Bl = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Yr = (e, t) => e << t | e >>> 32 - t;
function Eo(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Jr = new Uint32Array(16);
class Hl extends vs {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: i, h4: s } = this;
    return [t, n, r, i, s];
  }
  set(t, n, r, i, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      Jr[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, c = this.h2 | 0, f = c, g = this.h3 | 0, p = g, h = this.h4 | 0, m = h;
    for (let w = 0; w < 5; w++) {
      const T = 4 - w, k = El[w], $ = Bl[w], R = As[w], z = Ss[w], H = Al[w], _ = Sl[w];
      for (let v = 0; v < 16; v++) {
        const I = Yr(r + Eo(w, s, c, g) + Jr[R[v]] + k, H[v]) + h | 0;
        r = h, h = g, g = Yr(c, 10) | 0, c = s, s = I;
      }
      for (let v = 0; v < 16; v++) {
        const I = Yr(i + Eo(T, o, f, p) + Jr[z[v]] + $, _[v]) + m | 0;
        i = m, m = p, p = Yr(f, 10) | 0, f = o, o = I;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + g + m | 0, this.h3 + h + i | 0, this.h4 + r + o | 0, this.h0 + s + f | 0);
  }
  roundClean() {
    Jr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const _l = En(() => new Hl()), Cl = (e, t, n) => e & t ^ ~e & n, kl = (e, t, n) => e & t ^ e & n ^ t & n, Tl = new Uint32Array([
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
]), Ft = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), jt = new Uint32Array(64);
let ka = class extends vs {
  constructor() {
    super(64, 32, 8, !1), this.A = Ft[0] | 0, this.B = Ft[1] | 0, this.C = Ft[2] | 0, this.D = Ft[3] | 0, this.E = Ft[4] | 0, this.F = Ft[5] | 0, this.G = Ft[6] | 0, this.H = Ft[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: s, F: o, G: c, H: f } = this;
    return [t, n, r, i, s, o, c, f];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, c, f) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      jt[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const m = jt[h - 15], w = jt[h - 2], T = yt(m, 7) ^ yt(m, 18) ^ m >>> 3, k = yt(w, 17) ^ yt(w, 19) ^ w >>> 10;
      jt[h] = k + jt[h - 7] + T + jt[h - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: c, F: f, G: g, H: p } = this;
    for (let h = 0; h < 64; h++) {
      const m = yt(c, 6) ^ yt(c, 11) ^ yt(c, 25), w = p + m + Cl(c, f, g) + Tl[h] + jt[h] | 0, k = (yt(r, 2) ^ yt(r, 13) ^ yt(r, 22)) + kl(r, i, s) | 0;
      p = g, g = f, f = c, c = o + w | 0, o = s, s = i, i = r, r = w + k | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, g = g + this.G | 0, p = p + this.H | 0, this.set(r, i, s, o, c, f, g, p);
  }
  roundClean() {
    jt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Il = class extends ka {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Es = En(() => new ka());
En(() => new Il());
const Qr = BigInt(2 ** 32 - 1), rs = BigInt(32);
function Ta(e, t = !1) {
  return t ? { h: Number(e & Qr), l: Number(e >> rs & Qr) } : { h: Number(e >> rs & Qr) | 0, l: Number(e & Qr) | 0 };
}
function Ll(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let i = 0; i < e.length; i++) {
    const { h: s, l: o } = Ta(e[i], t);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const $l = (e, t) => BigInt(e >>> 0) << rs | BigInt(t >>> 0), Ul = (e, t, n) => e >>> n, Pl = (e, t, n) => e << 32 - n | t >>> n, Ol = (e, t, n) => e >>> n | t << 32 - n, Nl = (e, t, n) => e << 32 - n | t >>> n, Ml = (e, t, n) => e << 64 - n | t >>> n - 32, Dl = (e, t, n) => e >>> n - 32 | t << 64 - n, Fl = (e, t) => t, jl = (e, t) => e, Vl = (e, t, n) => e << n | t >>> 32 - n, Rl = (e, t, n) => t << n | e >>> 32 - n, zl = (e, t, n) => t << n - 32 | e >>> 64 - n, Gl = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Wl(e, t, n, r) {
  const i = (t >>> 0) + (r >>> 0);
  return { h: e + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Kl = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), ql = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Xl = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Zl = (e, t, n, r, i) => t + n + r + i + (e / 2 ** 32 | 0) | 0, Yl = (e, t, n, r, i) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Jl = (e, t, n, r, i, s) => t + n + r + i + s + (e / 2 ** 32 | 0) | 0, fe = {
  fromBig: Ta,
  split: Ll,
  toBig: $l,
  shrSH: Ul,
  shrSL: Pl,
  rotrSH: Ol,
  rotrSL: Nl,
  rotrBH: Ml,
  rotrBL: Dl,
  rotr32H: Fl,
  rotr32L: jl,
  rotlSH: Vl,
  rotlSL: Rl,
  rotlBH: zl,
  rotlBL: Gl,
  add: Wl,
  add3L: Kl,
  add3H: ql,
  add4L: Xl,
  add4H: Zl,
  add5H: Jl,
  add5L: Yl
}, [Ql, e0] = fe.split([
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
].map((e) => BigInt(e))), Vt = new Uint32Array(80), Rt = new Uint32Array(80);
let wi = class extends vs {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: c, Dl: f, Eh: g, El: p, Fh: h, Fl: m, Gh: w, Gl: T, Hh: k, Hl: $ } = this;
    return [t, n, r, i, s, o, c, f, g, p, h, m, w, T, k, $];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, c, f, g, p, h, m, w, T, k, $) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = g | 0, this.El = p | 0, this.Fh = h | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = T | 0, this.Hh = k | 0, this.Hl = $ | 0;
  }
  process(t, n) {
    for (let H = 0; H < 16; H++, n += 4)
      Vt[H] = t.getUint32(n), Rt[H] = t.getUint32(n += 4);
    for (let H = 16; H < 80; H++) {
      const _ = Vt[H - 15] | 0, v = Rt[H - 15] | 0, I = fe.rotrSH(_, v, 1) ^ fe.rotrSH(_, v, 8) ^ fe.shrSH(_, v, 7), E = fe.rotrSL(_, v, 1) ^ fe.rotrSL(_, v, 8) ^ fe.shrSL(_, v, 7), B = Vt[H - 2] | 0, S = Rt[H - 2] | 0, u = fe.rotrSH(B, S, 19) ^ fe.rotrBH(B, S, 61) ^ fe.shrSH(B, S, 6), d = fe.rotrSL(B, S, 19) ^ fe.rotrBL(B, S, 61) ^ fe.shrSL(B, S, 6), a = fe.add4L(E, d, Rt[H - 7], Rt[H - 16]), b = fe.add4H(a, I, u, Vt[H - 7], Vt[H - 16]);
      Vt[H] = b | 0, Rt[H] = a | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: c, Cl: f, Dh: g, Dl: p, Eh: h, El: m, Fh: w, Fl: T, Gh: k, Gl: $, Hh: R, Hl: z } = this;
    for (let H = 0; H < 80; H++) {
      const _ = fe.rotrSH(h, m, 14) ^ fe.rotrSH(h, m, 18) ^ fe.rotrBH(h, m, 41), v = fe.rotrSL(h, m, 14) ^ fe.rotrSL(h, m, 18) ^ fe.rotrBL(h, m, 41), I = h & w ^ ~h & k, E = m & T ^ ~m & $, B = fe.add5L(z, v, E, e0[H], Rt[H]), S = fe.add5H(B, R, _, I, Ql[H], Vt[H]), u = B | 0, d = fe.rotrSH(r, i, 28) ^ fe.rotrBH(r, i, 34) ^ fe.rotrBH(r, i, 39), a = fe.rotrSL(r, i, 28) ^ fe.rotrBL(r, i, 34) ^ fe.rotrBL(r, i, 39), b = r & s ^ r & c ^ s & c, y = i & o ^ i & f ^ o & f;
      R = k | 0, z = $ | 0, k = w | 0, $ = T | 0, w = h | 0, T = m | 0, { h, l: m } = fe.add(g | 0, p | 0, S | 0, u | 0), g = c | 0, p = f | 0, c = s | 0, f = o | 0, s = r | 0, o = i | 0;
      const x = fe.add3L(u, a, y);
      r = fe.add3H(x, S, d, b), i = x | 0;
    }
    ({ h: r, l: i } = fe.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = fe.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: c, l: f } = fe.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: g, l: p } = fe.add(this.Dh | 0, this.Dl | 0, g | 0, p | 0), { h, l: m } = fe.add(this.Eh | 0, this.El | 0, h | 0, m | 0), { h: w, l: T } = fe.add(this.Fh | 0, this.Fl | 0, w | 0, T | 0), { h: k, l: $ } = fe.add(this.Gh | 0, this.Gl | 0, k | 0, $ | 0), { h: R, l: z } = fe.add(this.Hh | 0, this.Hl | 0, R | 0, z | 0), this.set(r, i, s, o, c, f, g, p, h, m, w, T, k, $, R, z);
  }
  roundClean() {
    Vt.fill(0), Rt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, t0 = class extends wi {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, n0 = class extends wi {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, r0 = class extends wi {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
En(() => new wi());
En(() => new t0());
const i0 = En(() => new n0());
En(() => new r0());
var Jn = {}, Bs = {}, Bn = {}, mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.crypto = void 0;
mi.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = i, e.ahash = s, e.aexists = o, e.aoutput = c, e.u8 = f, e.u32 = g, e.clean = p, e.createView = h, e.rotr = m, e.rotl = w, e.byteSwap = T, e.byteSwap32 = k, e.bytesToHex = z, e.hexToBytes = v, e.asyncLoop = E, e.utf8ToBytes = B, e.bytesToUtf8 = S, e.toBytes = u, e.kdfInputToBytes = d, e.concatBytes = a, e.checkOpts = b, e.createHasher = x, e.createOptHasher = j, e.createXOFer = V, e.randomBytes = G;
  const t = mi;
  function n(A) {
    return A instanceof Uint8Array || ArrayBuffer.isView(A) && A.constructor.name === "Uint8Array";
  }
  function r(A) {
    if (!Number.isSafeInteger(A) || A < 0)
      throw new Error("positive integer expected, got " + A);
  }
  function i(A, ...U) {
    if (!n(A))
      throw new Error("Uint8Array expected");
    if (U.length > 0 && !U.includes(A.length))
      throw new Error("Uint8Array expected of length " + U + ", got length=" + A.length);
  }
  function s(A) {
    if (typeof A != "function" || typeof A.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(A.outputLen), r(A.blockLen);
  }
  function o(A, U = !0) {
    if (A.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (U && A.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c(A, U) {
    i(A);
    const se = U.outputLen;
    if (A.length < se)
      throw new Error("digestInto() expects output buffer of length at least " + se);
  }
  function f(A) {
    return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
  }
  function g(A) {
    return new Uint32Array(A.buffer, A.byteOffset, Math.floor(A.byteLength / 4));
  }
  function p(...A) {
    for (let U = 0; U < A.length; U++)
      A[U].fill(0);
  }
  function h(A) {
    return new DataView(A.buffer, A.byteOffset, A.byteLength);
  }
  function m(A, U) {
    return A << 32 - U | A >>> U;
  }
  function w(A, U) {
    return A << U | A >>> 32 - U >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function T(A) {
    return A << 24 & 4278190080 | A << 8 & 16711680 | A >>> 8 & 65280 | A >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (A) => A : (A) => T(A), e.byteSwapIfBE = e.swap8IfBE;
  function k(A) {
    for (let U = 0; U < A.length; U++)
      A[U] = T(A[U]);
    return A;
  }
  e.swap32IfBE = e.isLE ? (A) => A : k;
  const $ = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", R = /* @__PURE__ */ Array.from({ length: 256 }, (A, U) => U.toString(16).padStart(2, "0"));
  function z(A) {
    if (i(A), $)
      return A.toHex();
    let U = "";
    for (let se = 0; se < A.length; se++)
      U += R[A[se]];
    return U;
  }
  const H = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function _(A) {
    if (A >= H._0 && A <= H._9)
      return A - H._0;
    if (A >= H.A && A <= H.F)
      return A - (H.A - 10);
    if (A >= H.a && A <= H.f)
      return A - (H.a - 10);
  }
  function v(A) {
    if (typeof A != "string")
      throw new Error("hex string expected, got " + typeof A);
    if ($)
      return Uint8Array.fromHex(A);
    const U = A.length, se = U / 2;
    if (U % 2)
      throw new Error("hex string expected, got unpadded hex of length " + U);
    const ie = new Uint8Array(se);
    for (let q = 0, oe = 0; q < se; q++, oe += 2) {
      const ke = _(A.charCodeAt(oe)), Te = _(A.charCodeAt(oe + 1));
      if (ke === void 0 || Te === void 0) {
        const ct = A[oe] + A[oe + 1];
        throw new Error('hex string expected, got non-hex character "' + ct + '" at index ' + oe);
      }
      ie[q] = ke * 16 + Te;
    }
    return ie;
  }
  const I = async () => {
  };
  e.nextTick = I;
  async function E(A, U, se) {
    let ie = Date.now();
    for (let q = 0; q < A; q++) {
      se(q);
      const oe = Date.now() - ie;
      oe >= 0 && oe < U || (await (0, e.nextTick)(), ie += oe);
    }
  }
  function B(A) {
    if (typeof A != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(A));
  }
  function S(A) {
    return new TextDecoder().decode(A);
  }
  function u(A) {
    return typeof A == "string" && (A = B(A)), i(A), A;
  }
  function d(A) {
    return typeof A == "string" && (A = B(A)), i(A), A;
  }
  function a(...A) {
    let U = 0;
    for (let ie = 0; ie < A.length; ie++) {
      const q = A[ie];
      i(q), U += q.length;
    }
    const se = new Uint8Array(U);
    for (let ie = 0, q = 0; ie < A.length; ie++) {
      const oe = A[ie];
      se.set(oe, q), q += oe.length;
    }
    return se;
  }
  function b(A, U) {
    if (U !== void 0 && {}.toString.call(U) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(A, U);
  }
  class y {
  }
  e.Hash = y;
  function x(A) {
    const U = (ie) => A().update(u(ie)).digest(), se = A();
    return U.outputLen = se.outputLen, U.blockLen = se.blockLen, U.create = () => A(), U;
  }
  function j(A) {
    const U = (ie, q) => A(q).update(u(ie)).digest(), se = A({});
    return U.outputLen = se.outputLen, U.blockLen = se.blockLen, U.create = (ie) => A(ie), U;
  }
  function V(A) {
    const U = (ie, q) => A(q).update(u(ie)).digest(), se = A({});
    return U.outputLen = se.outputLen, U.blockLen = se.blockLen, U.create = (ie) => A(ie), U;
  }
  e.wrapConstructor = x, e.wrapConstructorWithOpts = j, e.wrapXOFConstructorWithOpts = V;
  function G(A = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(A));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(A));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Bn);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Bn;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, c) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let f = [], g = 0;
    for (let w = o.length - 1; w >= 0; w--)
      if (g < 4) {
        const T = n.indexOf(o[w]) >> g;
        let k = 0;
        w !== 0 && (k = n.indexOf(o[w - 1]));
        const $ = 1 + g, R = k % (1 << $) << 5 - $, z = e.c32[T + R];
        g = $, f.unshift(z);
      } else
        g = 0;
    let p = 0;
    for (let w = 0; w < f.length && f[w] === "0"; w++)
      p++;
    f = f.slice(p);
    const h = new TextDecoder().decode((0, t.hexToBytes)(o)).match(/^\u0000*/), m = h ? h[0].length : 0;
    for (let w = 0; w < m; w++)
      f.unshift(e.c32[0]);
    if (c) {
      const w = c - f.length;
      for (let T = 0; T < w; T++)
        f.unshift(e.c32[0]);
    }
    return f.join("");
  }
  e.c32encode = r;
  function i(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = i;
  function s(o, c) {
    if (o = i(o), !o.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const f = o.match(`^${e.c32[0]}*`), g = f ? f[0].length : 0;
    let p = [], h = 0, m = 0;
    for (let k = o.length - 1; k >= 0; k--) {
      m === 4 && (p.unshift(n[h]), m = 0, h = 0);
      const R = (e.c32.indexOf(o[k]) << m) + h, z = n[R % 16];
      if (m += 1, h = R >> 4, h > 1 << m)
        throw new Error("Panic error in decoding.");
      p.unshift(z);
    }
    p.unshift(n[h]), p.length % 2 === 1 && p.unshift("0");
    let w = 0;
    for (let k = 0; k < p.length && p[k] === "0"; k++)
      w++;
    p = p.slice(w - w % 2);
    let T = p.join("");
    for (let k = 0; k < g; k++)
      T = `00${T}`;
    if (c) {
      const k = c * 2 - T.length;
      for (let $ = 0; $ < k; $ += 2)
        T = `00${T}`;
    }
    return T;
  }
  e.c32decode = s;
})(Bs);
var mn = {}, lt = {}, we = {}, Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
Fe.SHA512_IV = Fe.SHA384_IV = Fe.SHA224_IV = Fe.SHA256_IV = Fe.HashMD = void 0;
Fe.setBigUint64 = Ia;
Fe.Chi = s0;
Fe.Maj = o0;
const wt = Bn;
function Ia(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), c = Number(n & s), f = r ? 4 : 0, g = r ? 0 : 4;
  e.setUint32(t + f, o, r), e.setUint32(t + g, c, r);
}
function s0(e, t, n) {
  return e & t ^ ~e & n;
}
function o0(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class a0 extends wt.Hash {
  constructor(t, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(t), this.view = (0, wt.createView)(this.buffer);
  }
  update(t) {
    (0, wt.aexists)(this), t = (0, wt.toBytes)(t), (0, wt.abytes)(t);
    const { view: n, buffer: r, blockLen: i } = this, s = t.length;
    for (let o = 0; o < s; ) {
      const c = Math.min(i - this.pos, s - o);
      if (c === i) {
        const f = (0, wt.createView)(t);
        for (; i <= s - o; o += i)
          this.process(f, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    (0, wt.aexists)(this), (0, wt.aoutput)(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, (0, wt.clean)(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let h = o; h < i; h++)
      n[h] = 0;
    Ia(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = (0, wt.createView)(t), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const g = f / 4, p = this.get();
    if (g > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < g; h++)
      c.setUint32(4 * h, p[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: c } = this;
    return t.destroyed = o, t.finished = s, t.length = i, t.pos = c, i % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
Fe.HashMD = a0;
Fe.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
Fe.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
Fe.SHA384_IV = Uint32Array.from([
  3418070365,
  3238371032,
  1654270250,
  914150663,
  2438529370,
  812702999,
  355462360,
  4144912697,
  1731405415,
  4290775857,
  2394180231,
  1750603025,
  3675008525,
  1694076839,
  1203062813,
  3204075428
]);
Fe.SHA512_IV = Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);
var re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.toBig = re.shrSL = re.shrSH = re.rotrSL = re.rotrSH = re.rotrBL = re.rotrBH = re.rotr32L = re.rotr32H = re.rotlSL = re.rotlSH = re.rotlBL = re.rotlBH = re.add5L = re.add5H = re.add4L = re.add4H = re.add3L = re.add3H = void 0;
re.add = Wa;
re.fromBig = Hs;
re.split = La;
const ei = /* @__PURE__ */ BigInt(2 ** 32 - 1), is = /* @__PURE__ */ BigInt(32);
function Hs(e, t = !1) {
  return t ? { h: Number(e & ei), l: Number(e >> is & ei) } : { h: Number(e >> is & ei) | 0, l: Number(e & ei) | 0 };
}
function La(e, t = !1) {
  const n = e.length;
  let r = new Uint32Array(n), i = new Uint32Array(n);
  for (let s = 0; s < n; s++) {
    const { h: o, l: c } = Hs(e[s], t);
    [r[s], i[s]] = [o, c];
  }
  return [r, i];
}
const $a = (e, t) => BigInt(e >>> 0) << is | BigInt(t >>> 0);
re.toBig = $a;
const Ua = (e, t, n) => e >>> n;
re.shrSH = Ua;
const Pa = (e, t, n) => e << 32 - n | t >>> n;
re.shrSL = Pa;
const Oa = (e, t, n) => e >>> n | t << 32 - n;
re.rotrSH = Oa;
const Na = (e, t, n) => e << 32 - n | t >>> n;
re.rotrSL = Na;
const Ma = (e, t, n) => e << 64 - n | t >>> n - 32;
re.rotrBH = Ma;
const Da = (e, t, n) => e >>> n - 32 | t << 64 - n;
re.rotrBL = Da;
const Fa = (e, t) => t;
re.rotr32H = Fa;
const ja = (e, t) => e;
re.rotr32L = ja;
const Va = (e, t, n) => e << n | t >>> 32 - n;
re.rotlSH = Va;
const Ra = (e, t, n) => t << n | e >>> 32 - n;
re.rotlSL = Ra;
const za = (e, t, n) => t << n - 32 | e >>> 64 - n;
re.rotlBH = za;
const Ga = (e, t, n) => e << n - 32 | t >>> 64 - n;
re.rotlBL = Ga;
function Wa(e, t, n, r) {
  const i = (t >>> 0) + (r >>> 0);
  return { h: e + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Ka = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0);
re.add3L = Ka;
const qa = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0;
re.add3H = qa;
const Xa = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0);
re.add4L = Xa;
const Za = (e, t, n, r, i) => t + n + r + i + (e / 2 ** 32 | 0) | 0;
re.add4H = Za;
const Ya = (e, t, n, r, i) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0);
re.add5L = Ya;
const Ja = (e, t, n, r, i, s) => t + n + r + i + s + (e / 2 ** 32 | 0) | 0;
re.add5H = Ja;
const c0 = {
  fromBig: Hs,
  split: La,
  toBig: $a,
  shrSH: Ua,
  shrSL: Pa,
  rotrSH: Oa,
  rotrSL: Na,
  rotrBH: Ma,
  rotrBL: Da,
  rotr32H: Fa,
  rotr32L: ja,
  rotlSH: Va,
  rotlSL: Ra,
  rotlBH: za,
  rotlBL: Ga,
  add: Wa,
  add3L: Ka,
  add3H: qa,
  add4L: Xa,
  add4H: Za,
  add5H: Ja,
  add5L: Ya
};
re.default = c0;
Object.defineProperty(we, "__esModule", { value: !0 });
we.sha512_224 = we.sha512_256 = we.sha384 = we.sha512 = we.sha224 = we.sha256 = we.SHA512_256 = we.SHA512_224 = we.SHA384 = we.SHA512 = we.SHA224 = we.SHA256 = void 0;
const J = Fe, ue = re, Ce = Bn, f0 = /* @__PURE__ */ Uint32Array.from([
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
]), zt = /* @__PURE__ */ new Uint32Array(64);
class _s extends J.HashMD {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = J.SHA256_IV[0] | 0, this.B = J.SHA256_IV[1] | 0, this.C = J.SHA256_IV[2] | 0, this.D = J.SHA256_IV[3] | 0, this.E = J.SHA256_IV[4] | 0, this.F = J.SHA256_IV[5] | 0, this.G = J.SHA256_IV[6] | 0, this.H = J.SHA256_IV[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: s, F: o, G: c, H: f } = this;
    return [t, n, r, i, s, o, c, f];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, c, f) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      zt[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const m = zt[h - 15], w = zt[h - 2], T = (0, Ce.rotr)(m, 7) ^ (0, Ce.rotr)(m, 18) ^ m >>> 3, k = (0, Ce.rotr)(w, 17) ^ (0, Ce.rotr)(w, 19) ^ w >>> 10;
      zt[h] = k + zt[h - 7] + T + zt[h - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: c, F: f, G: g, H: p } = this;
    for (let h = 0; h < 64; h++) {
      const m = (0, Ce.rotr)(c, 6) ^ (0, Ce.rotr)(c, 11) ^ (0, Ce.rotr)(c, 25), w = p + m + (0, J.Chi)(c, f, g) + f0[h] + zt[h] | 0, k = ((0, Ce.rotr)(r, 2) ^ (0, Ce.rotr)(r, 13) ^ (0, Ce.rotr)(r, 22)) + (0, J.Maj)(r, i, s) | 0;
      p = g, g = f, f = c, c = o + w | 0, o = s, s = i, i = r, r = w + k | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, g = g + this.G | 0, p = p + this.H | 0, this.set(r, i, s, o, c, f, g, p);
  }
  roundClean() {
    (0, Ce.clean)(zt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, Ce.clean)(this.buffer);
  }
}
we.SHA256 = _s;
class Qa extends _s {
  constructor() {
    super(28), this.A = J.SHA224_IV[0] | 0, this.B = J.SHA224_IV[1] | 0, this.C = J.SHA224_IV[2] | 0, this.D = J.SHA224_IV[3] | 0, this.E = J.SHA224_IV[4] | 0, this.F = J.SHA224_IV[5] | 0, this.G = J.SHA224_IV[6] | 0, this.H = J.SHA224_IV[7] | 0;
  }
}
we.SHA224 = Qa;
const ec = ue.split([
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
].map((e) => BigInt(e))), u0 = ec[0], h0 = ec[1], Gt = /* @__PURE__ */ new Uint32Array(80), Wt = /* @__PURE__ */ new Uint32Array(80);
class Lr extends J.HashMD {
  constructor(t = 64) {
    super(128, t, 16, !1), this.Ah = J.SHA512_IV[0] | 0, this.Al = J.SHA512_IV[1] | 0, this.Bh = J.SHA512_IV[2] | 0, this.Bl = J.SHA512_IV[3] | 0, this.Ch = J.SHA512_IV[4] | 0, this.Cl = J.SHA512_IV[5] | 0, this.Dh = J.SHA512_IV[6] | 0, this.Dl = J.SHA512_IV[7] | 0, this.Eh = J.SHA512_IV[8] | 0, this.El = J.SHA512_IV[9] | 0, this.Fh = J.SHA512_IV[10] | 0, this.Fl = J.SHA512_IV[11] | 0, this.Gh = J.SHA512_IV[12] | 0, this.Gl = J.SHA512_IV[13] | 0, this.Hh = J.SHA512_IV[14] | 0, this.Hl = J.SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: c, Dl: f, Eh: g, El: p, Fh: h, Fl: m, Gh: w, Gl: T, Hh: k, Hl: $ } = this;
    return [t, n, r, i, s, o, c, f, g, p, h, m, w, T, k, $];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, c, f, g, p, h, m, w, T, k, $) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = g | 0, this.El = p | 0, this.Fh = h | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = T | 0, this.Hh = k | 0, this.Hl = $ | 0;
  }
  process(t, n) {
    for (let H = 0; H < 16; H++, n += 4)
      Gt[H] = t.getUint32(n), Wt[H] = t.getUint32(n += 4);
    for (let H = 16; H < 80; H++) {
      const _ = Gt[H - 15] | 0, v = Wt[H - 15] | 0, I = ue.rotrSH(_, v, 1) ^ ue.rotrSH(_, v, 8) ^ ue.shrSH(_, v, 7), E = ue.rotrSL(_, v, 1) ^ ue.rotrSL(_, v, 8) ^ ue.shrSL(_, v, 7), B = Gt[H - 2] | 0, S = Wt[H - 2] | 0, u = ue.rotrSH(B, S, 19) ^ ue.rotrBH(B, S, 61) ^ ue.shrSH(B, S, 6), d = ue.rotrSL(B, S, 19) ^ ue.rotrBL(B, S, 61) ^ ue.shrSL(B, S, 6), a = ue.add4L(E, d, Wt[H - 7], Wt[H - 16]), b = ue.add4H(a, I, u, Gt[H - 7], Gt[H - 16]);
      Gt[H] = b | 0, Wt[H] = a | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: c, Cl: f, Dh: g, Dl: p, Eh: h, El: m, Fh: w, Fl: T, Gh: k, Gl: $, Hh: R, Hl: z } = this;
    for (let H = 0; H < 80; H++) {
      const _ = ue.rotrSH(h, m, 14) ^ ue.rotrSH(h, m, 18) ^ ue.rotrBH(h, m, 41), v = ue.rotrSL(h, m, 14) ^ ue.rotrSL(h, m, 18) ^ ue.rotrBL(h, m, 41), I = h & w ^ ~h & k, E = m & T ^ ~m & $, B = ue.add5L(z, v, E, h0[H], Wt[H]), S = ue.add5H(B, R, _, I, u0[H], Gt[H]), u = B | 0, d = ue.rotrSH(r, i, 28) ^ ue.rotrBH(r, i, 34) ^ ue.rotrBH(r, i, 39), a = ue.rotrSL(r, i, 28) ^ ue.rotrBL(r, i, 34) ^ ue.rotrBL(r, i, 39), b = r & s ^ r & c ^ s & c, y = i & o ^ i & f ^ o & f;
      R = k | 0, z = $ | 0, k = w | 0, $ = T | 0, w = h | 0, T = m | 0, { h, l: m } = ue.add(g | 0, p | 0, S | 0, u | 0), g = c | 0, p = f | 0, c = s | 0, f = o | 0, s = r | 0, o = i | 0;
      const x = ue.add3L(u, a, y);
      r = ue.add3H(x, S, d, b), i = x | 0;
    }
    ({ h: r, l: i } = ue.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = ue.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: c, l: f } = ue.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: g, l: p } = ue.add(this.Dh | 0, this.Dl | 0, g | 0, p | 0), { h, l: m } = ue.add(this.Eh | 0, this.El | 0, h | 0, m | 0), { h: w, l: T } = ue.add(this.Fh | 0, this.Fl | 0, w | 0, T | 0), { h: k, l: $ } = ue.add(this.Gh | 0, this.Gl | 0, k | 0, $ | 0), { h: R, l: z } = ue.add(this.Hh | 0, this.Hl | 0, R | 0, z | 0), this.set(r, i, s, o, c, f, g, p, h, m, w, T, k, $, R, z);
  }
  roundClean() {
    (0, Ce.clean)(Gt, Wt);
  }
  destroy() {
    (0, Ce.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
we.SHA512 = Lr;
class tc extends Lr {
  constructor() {
    super(48), this.Ah = J.SHA384_IV[0] | 0, this.Al = J.SHA384_IV[1] | 0, this.Bh = J.SHA384_IV[2] | 0, this.Bl = J.SHA384_IV[3] | 0, this.Ch = J.SHA384_IV[4] | 0, this.Cl = J.SHA384_IV[5] | 0, this.Dh = J.SHA384_IV[6] | 0, this.Dl = J.SHA384_IV[7] | 0, this.Eh = J.SHA384_IV[8] | 0, this.El = J.SHA384_IV[9] | 0, this.Fh = J.SHA384_IV[10] | 0, this.Fl = J.SHA384_IV[11] | 0, this.Gh = J.SHA384_IV[12] | 0, this.Gl = J.SHA384_IV[13] | 0, this.Hh = J.SHA384_IV[14] | 0, this.Hl = J.SHA384_IV[15] | 0;
  }
}
we.SHA384 = tc;
const Pe = /* @__PURE__ */ Uint32Array.from([
  2352822216,
  424955298,
  1944164710,
  2312950998,
  502970286,
  855612546,
  1738396948,
  1479516111,
  258812777,
  2077511080,
  2011393907,
  79989058,
  1067287976,
  1780299464,
  286451373,
  2446758561
]), Oe = /* @__PURE__ */ Uint32Array.from([
  573645204,
  4230739756,
  2673172387,
  3360449730,
  596883563,
  1867755857,
  2520282905,
  1497426621,
  2519219938,
  2827943907,
  3193839141,
  1401305490,
  721525244,
  746961066,
  246885852,
  2177182882
]);
class nc extends Lr {
  constructor() {
    super(28), this.Ah = Pe[0] | 0, this.Al = Pe[1] | 0, this.Bh = Pe[2] | 0, this.Bl = Pe[3] | 0, this.Ch = Pe[4] | 0, this.Cl = Pe[5] | 0, this.Dh = Pe[6] | 0, this.Dl = Pe[7] | 0, this.Eh = Pe[8] | 0, this.El = Pe[9] | 0, this.Fh = Pe[10] | 0, this.Fl = Pe[11] | 0, this.Gh = Pe[12] | 0, this.Gl = Pe[13] | 0, this.Hh = Pe[14] | 0, this.Hl = Pe[15] | 0;
  }
}
we.SHA512_224 = nc;
class rc extends Lr {
  constructor() {
    super(32), this.Ah = Oe[0] | 0, this.Al = Oe[1] | 0, this.Bh = Oe[2] | 0, this.Bl = Oe[3] | 0, this.Ch = Oe[4] | 0, this.Cl = Oe[5] | 0, this.Dh = Oe[6] | 0, this.Dl = Oe[7] | 0, this.Eh = Oe[8] | 0, this.El = Oe[9] | 0, this.Fh = Oe[10] | 0, this.Fl = Oe[11] | 0, this.Gh = Oe[12] | 0, this.Gl = Oe[13] | 0, this.Hh = Oe[14] | 0, this.Hl = Oe[15] | 0;
  }
}
we.SHA512_256 = rc;
we.sha256 = (0, Ce.createHasher)(() => new _s());
we.sha224 = (0, Ce.createHasher)(() => new Qa());
we.sha512 = (0, Ce.createHasher)(() => new Lr());
we.sha384 = (0, Ce.createHasher)(() => new tc());
we.sha512_256 = (0, Ce.createHasher)(() => new rc());
we.sha512_224 = (0, Ce.createHasher)(() => new nc());
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.sha224 = lt.SHA224 = lt.sha256 = lt.SHA256 = void 0;
const xi = we;
lt.SHA256 = xi.SHA256;
lt.sha256 = xi.sha256;
lt.SHA224 = xi.SHA224;
lt.sha224 = xi.sha224;
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.c32checkDecode = mn.c32checkEncode = void 0;
const Bo = lt, Ho = Bn, fr = Bs;
function ic(e) {
  const t = (0, Bo.sha256)((0, Bo.sha256)((0, Ho.hexToBytes)(e)));
  return (0, Ho.bytesToHex)(t.slice(0, 4));
}
function l0(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = ic(`${n}${t}`), i = (0, fr.c32encode)(`${t}${r}`);
  return `${fr.c32[e]}${i}`;
}
mn.c32checkEncode = l0;
function d0(e) {
  e = (0, fr.c32normalize)(e);
  const t = (0, fr.c32decode)(e.slice(1)), n = e[0], r = fr.c32.indexOf(n), i = t.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), ic(`${s}${t.substring(0, t.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
mn.c32checkDecode = d0;
var sc = {}, Rn = {};
function p0(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var i = e.charAt(r), s = i.charCodeAt(0);
    if (t[s] !== 255)
      throw new TypeError(i + " is ambiguous");
    t[s] = r;
  }
  var o = e.length, c = e.charAt(0), f = Math.log(o) / Math.log(256), g = Math.log(256) / Math.log(o);
  function p(w) {
    if (w instanceof Uint8Array || (ArrayBuffer.isView(w) ? w = new Uint8Array(w.buffer, w.byteOffset, w.byteLength) : Array.isArray(w) && (w = Uint8Array.from(w))), !(w instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (w.length === 0)
      return "";
    for (var T = 0, k = 0, $ = 0, R = w.length; $ !== R && w[$] === 0; )
      $++, T++;
    for (var z = (R - $) * g + 1 >>> 0, H = new Uint8Array(z); $ !== R; ) {
      for (var _ = w[$], v = 0, I = z - 1; (_ !== 0 || v < k) && I !== -1; I--, v++)
        _ += 256 * H[I] >>> 0, H[I] = _ % o >>> 0, _ = _ / o >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      k = v, $++;
    }
    for (var E = z - k; E !== z && H[E] === 0; )
      E++;
    for (var B = c.repeat(T); E < z; ++E)
      B += e.charAt(H[E]);
    return B;
  }
  function h(w) {
    if (typeof w != "string")
      throw new TypeError("Expected String");
    if (w.length === 0)
      return new Uint8Array();
    for (var T = 0, k = 0, $ = 0; w[T] === c; )
      k++, T++;
    for (var R = (w.length - T) * f + 1 >>> 0, z = new Uint8Array(R); w[T]; ) {
      var H = w.charCodeAt(T);
      if (H > 255)
        return;
      var _ = t[H];
      if (_ === 255)
        return;
      for (var v = 0, I = R - 1; (_ !== 0 || v < $) && I !== -1; I--, v++)
        _ += o * z[I] >>> 0, z[I] = _ % 256 >>> 0, _ = _ / 256 >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      $ = v, T++;
    }
    for (var E = R - $; E !== R && z[E] === 0; )
      E++;
    for (var B = new Uint8Array(k + (R - E)), S = k; E !== R; )
      B[S++] = z[E++];
    return B;
  }
  function m(w) {
    var T = h(w);
    if (T)
      return T;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: p,
    decodeUnsafe: h,
    decode: m
  };
}
var g0 = p0;
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.decode = Rn.encode = void 0;
const oi = lt, _o = Bn, oc = g0, ac = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function b0(e, t = "00") {
  const n = typeof e == "string" ? (0, _o.hexToBytes)(e) : e, r = typeof t == "string" ? (0, _o.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, oi.sha256)((0, oi.sha256)(new Uint8Array([...r, ...n])));
  return oc(ac).encode([...r, ...n, ...i.slice(0, 4)]);
}
Rn.encode = b0;
function y0(e) {
  const t = oc(ac).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), i = (0, oi.sha256)((0, oi.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Rn.decode = y0;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = mn, n = Rn, r = Bn;
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
  const i = {};
  i[0] = e.versions.mainnet.p2pkh, i[5] = e.versions.mainnet.p2sh, i[111] = e.versions.testnet.p2pkh, i[196] = e.versions.testnet.p2sh;
  const s = {};
  s[e.versions.mainnet.p2pkh] = 0, s[e.versions.mainnet.p2sh] = 5, s[e.versions.testnet.p2pkh] = 111, s[e.versions.testnet.p2sh] = 196;
  function o(p, h) {
    if (!h.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(p, h)}`;
  }
  e.c32address = o;
  function c(p) {
    if (p.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (p[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(p.slice(1));
  }
  e.c32addressDecode = c;
  function f(p, h = -1) {
    const m = n.decode(p), w = (0, r.bytesToHex)(m.data), T = parseInt((0, r.bytesToHex)(m.prefix), 16);
    let k;
    return h < 0 ? (k = T, i[T] !== void 0 && (k = i[T])) : k = h, o(k, w);
  }
  e.b58ToC32 = f;
  function g(p, h = -1) {
    const m = c(p), w = m[0], T = m[1];
    let k;
    h < 0 ? (k = w, s[w] !== void 0 && (k = s[w])) : k = h;
    let $ = k.toString(16);
    return $.length === 1 && ($ = `0${$}`), n.encode(T, $);
  }
  e.c32ToB58 = g;
})(sc);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = Bs;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = mn;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = sc;
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
})(Jn);
var ai = { exports: {} };
ai.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", c = "[object Boolean]", f = "[object Date]", g = "[object Error]", p = "[object Function]", h = "[object GeneratorFunction]", m = "[object Map]", w = "[object Number]", T = "[object Object]", k = "[object Promise]", $ = "[object RegExp]", R = "[object Set]", z = "[object String]", H = "[object Symbol]", _ = "[object WeakMap]", v = "[object ArrayBuffer]", I = "[object DataView]", E = "[object Float32Array]", B = "[object Float64Array]", S = "[object Int8Array]", u = "[object Int16Array]", d = "[object Int32Array]", a = "[object Uint8Array]", b = "[object Uint8ClampedArray]", y = "[object Uint16Array]", x = "[object Uint32Array]", j = /[\\^$.*+?()[\]{}|]/g, V = /\w*$/, G = /^\[object .+?Constructor\]$/, A = /^(?:0|[1-9]\d*)$/, U = {};
  U[s] = U[o] = U[v] = U[I] = U[c] = U[f] = U[E] = U[B] = U[S] = U[u] = U[d] = U[m] = U[w] = U[T] = U[$] = U[R] = U[z] = U[H] = U[a] = U[b] = U[y] = U[x] = !0, U[g] = U[p] = U[_] = !1;
  var se = typeof fn == "object" && fn && fn.Object === Object && fn, ie = typeof self == "object" && self && self.Object === Object && self, q = se || ie || Function("return this")(), oe = t && !t.nodeType && t, ke = oe && !0 && e && !e.nodeType && e, Te = ke && ke.exports === oe;
  function ct(l, C) {
    return l.set(C[0], C[1]), l;
  }
  function P(l, C) {
    return l.add(C), l;
  }
  function O(l, C) {
    for (var N = -1, Z = l ? l.length : 0; ++N < Z && C(l[N], N, l) !== !1; )
      ;
    return l;
  }
  function L(l, C) {
    for (var N = -1, Z = C.length, Ue = l.length; ++N < Z; )
      l[Ue + N] = C[N];
    return l;
  }
  function M(l, C, N, Z) {
    for (var Ue = -1, ze = l ? l.length : 0; ++Ue < ze; )
      N = C(N, l[Ue], Ue, l);
    return N;
  }
  function D(l, C) {
    for (var N = -1, Z = Array(l); ++N < l; )
      Z[N] = C(N);
    return Z;
  }
  function W(l, C) {
    return l == null ? void 0 : l[C];
  }
  function Q(l) {
    var C = !1;
    if (l != null && typeof l.toString != "function")
      try {
        C = !!(l + "");
      } catch {
      }
    return C;
  }
  function Y(l) {
    var C = -1, N = Array(l.size);
    return l.forEach(function(Z, Ue) {
      N[++C] = [Ue, Z];
    }), N;
  }
  function ye(l, C) {
    return function(N) {
      return l(C(N));
    };
  }
  function Se(l) {
    var C = -1, N = Array(l.size);
    return l.forEach(function(Z) {
      N[++C] = Z;
    }), N;
  }
  var te = Array.prototype, Re = Function.prototype, $e = Object.prototype, _n = q["__core-js_shared__"], er = function() {
    var l = /[^.]+$/.exec(_n && _n.keys && _n.keys.IE_PROTO || "");
    return l ? "Symbol(src)_1." + l : "";
  }(), tr = Re.toString, et = $e.hasOwnProperty, At = $e.toString, rf = RegExp(
    "^" + tr.call(et).replace(j, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Vs = Te ? q.Buffer : void 0, Rs = q.Symbol, zs = q.Uint8Array, sf = ye(Object.getPrototypeOf, Object), of = Object.create, af = $e.propertyIsEnumerable, cf = te.splice, Gs = Object.getOwnPropertySymbols, ff = Vs ? Vs.isBuffer : void 0, uf = ye(Object.keys, Object), ki = Tn(q, "DataView"), nr = Tn(q, "Map"), Ti = Tn(q, "Promise"), Ii = Tn(q, "Set"), Li = Tn(q, "WeakMap"), rr = Tn(Object, "create"), hf = on(ki), lf = on(nr), df = on(Ti), pf = on(Ii), gf = on(Li), Ws = Rs ? Rs.prototype : void 0, Ks = Ws ? Ws.valueOf : void 0;
  function rn(l) {
    var C = -1, N = l ? l.length : 0;
    for (this.clear(); ++C < N; ) {
      var Z = l[C];
      this.set(Z[0], Z[1]);
    }
  }
  function bf() {
    this.__data__ = rr ? rr(null) : {};
  }
  function yf(l) {
    return this.has(l) && delete this.__data__[l];
  }
  function wf(l) {
    var C = this.__data__;
    if (rr) {
      var N = C[l];
      return N === r ? void 0 : N;
    }
    return et.call(C, l) ? C[l] : void 0;
  }
  function mf(l) {
    var C = this.__data__;
    return rr ? C[l] !== void 0 : et.call(C, l);
  }
  function xf(l, C) {
    var N = this.__data__;
    return N[l] = rr && C === void 0 ? r : C, this;
  }
  rn.prototype.clear = bf, rn.prototype.delete = yf, rn.prototype.get = wf, rn.prototype.has = mf, rn.prototype.set = xf;
  function St(l) {
    var C = -1, N = l ? l.length : 0;
    for (this.clear(); ++C < N; ) {
      var Z = l[C];
      this.set(Z[0], Z[1]);
    }
  }
  function vf() {
    this.__data__ = [];
  }
  function Af(l) {
    var C = this.__data__, N = Mr(C, l);
    if (N < 0)
      return !1;
    var Z = C.length - 1;
    return N == Z ? C.pop() : cf.call(C, N, 1), !0;
  }
  function Sf(l) {
    var C = this.__data__, N = Mr(C, l);
    return N < 0 ? void 0 : C[N][1];
  }
  function Ef(l) {
    return Mr(this.__data__, l) > -1;
  }
  function Bf(l, C) {
    var N = this.__data__, Z = Mr(N, l);
    return Z < 0 ? N.push([l, C]) : N[Z][1] = C, this;
  }
  St.prototype.clear = vf, St.prototype.delete = Af, St.prototype.get = Sf, St.prototype.has = Ef, St.prototype.set = Bf;
  function Cn(l) {
    var C = -1, N = l ? l.length : 0;
    for (this.clear(); ++C < N; ) {
      var Z = l[C];
      this.set(Z[0], Z[1]);
    }
  }
  function Hf() {
    this.__data__ = {
      hash: new rn(),
      map: new (nr || St)(),
      string: new rn()
    };
  }
  function _f(l) {
    return Dr(this, l).delete(l);
  }
  function Cf(l) {
    return Dr(this, l).get(l);
  }
  function kf(l) {
    return Dr(this, l).has(l);
  }
  function Tf(l, C) {
    return Dr(this, l).set(l, C), this;
  }
  Cn.prototype.clear = Hf, Cn.prototype.delete = _f, Cn.prototype.get = Cf, Cn.prototype.has = kf, Cn.prototype.set = Tf;
  function kn(l) {
    this.__data__ = new St(l);
  }
  function If() {
    this.__data__ = new St();
  }
  function Lf(l) {
    return this.__data__.delete(l);
  }
  function $f(l) {
    return this.__data__.get(l);
  }
  function Uf(l) {
    return this.__data__.has(l);
  }
  function Pf(l, C) {
    var N = this.__data__;
    if (N instanceof St) {
      var Z = N.__data__;
      if (!nr || Z.length < n - 1)
        return Z.push([l, C]), this;
      N = this.__data__ = new Cn(Z);
    }
    return N.set(l, C), this;
  }
  kn.prototype.clear = If, kn.prototype.delete = Lf, kn.prototype.get = $f, kn.prototype.has = Uf, kn.prototype.set = Pf;
  function Of(l, C) {
    var N = Pi(l) || ou(l) ? D(l.length, String) : [], Z = N.length, Ue = !!Z;
    for (var ze in l)
      et.call(l, ze) && !(Ue && (ze == "length" || nu(ze, Z))) && N.push(ze);
    return N;
  }
  function qs(l, C, N) {
    var Z = l[C];
    (!(et.call(l, C) && Js(Z, N)) || N === void 0 && !(C in l)) && (l[C] = N);
  }
  function Mr(l, C) {
    for (var N = l.length; N--; )
      if (Js(l[N][0], C))
        return N;
    return -1;
  }
  function Nf(l, C) {
    return l && Xs(C, Oi(C), l);
  }
  function $i(l, C, N, Z, Ue, ze, Et) {
    var Ge;
    if (Z && (Ge = ze ? Z(l, Ue, ze, Et) : Z(l)), Ge !== void 0)
      return Ge;
    if (!Fr(l))
      return l;
    var to = Pi(l);
    if (to) {
      if (Ge = Qf(l), !C)
        return Zf(l, Ge);
    } else {
      var In = sn(l), no = In == p || In == h;
      if (cu(l))
        return Rf(l, C);
      if (In == T || In == s || no && !ze) {
        if (Q(l))
          return ze ? l : {};
        if (Ge = eu(no ? {} : l), !C)
          return Yf(l, Nf(Ge, l));
      } else {
        if (!U[In])
          return ze ? l : {};
        Ge = tu(l, In, $i, C);
      }
    }
    Et || (Et = new kn());
    var ro = Et.get(l);
    if (ro)
      return ro;
    if (Et.set(l, Ge), !to)
      var io = N ? Jf(l) : Oi(l);
    return O(io || l, function(Ni, jr) {
      io && (jr = Ni, Ni = l[jr]), qs(Ge, jr, $i(Ni, C, N, Z, jr, l, Et));
    }), Ge;
  }
  function Mf(l) {
    return Fr(l) ? of(l) : {};
  }
  function Df(l, C, N) {
    var Z = C(l);
    return Pi(l) ? Z : L(Z, N(l));
  }
  function Ff(l) {
    return At.call(l);
  }
  function jf(l) {
    if (!Fr(l) || iu(l))
      return !1;
    var C = eo(l) || Q(l) ? rf : G;
    return C.test(on(l));
  }
  function Vf(l) {
    if (!Ys(l))
      return uf(l);
    var C = [];
    for (var N in Object(l))
      et.call(l, N) && N != "constructor" && C.push(N);
    return C;
  }
  function Rf(l, C) {
    if (C)
      return l.slice();
    var N = new l.constructor(l.length);
    return l.copy(N), N;
  }
  function Ui(l) {
    var C = new l.constructor(l.byteLength);
    return new zs(C).set(new zs(l)), C;
  }
  function zf(l, C) {
    var N = C ? Ui(l.buffer) : l.buffer;
    return new l.constructor(N, l.byteOffset, l.byteLength);
  }
  function Gf(l, C, N) {
    var Z = C ? N(Y(l), !0) : Y(l);
    return M(Z, ct, new l.constructor());
  }
  function Wf(l) {
    var C = new l.constructor(l.source, V.exec(l));
    return C.lastIndex = l.lastIndex, C;
  }
  function Kf(l, C, N) {
    var Z = C ? N(Se(l), !0) : Se(l);
    return M(Z, P, new l.constructor());
  }
  function qf(l) {
    return Ks ? Object(Ks.call(l)) : {};
  }
  function Xf(l, C) {
    var N = C ? Ui(l.buffer) : l.buffer;
    return new l.constructor(N, l.byteOffset, l.length);
  }
  function Zf(l, C) {
    var N = -1, Z = l.length;
    for (C || (C = Array(Z)); ++N < Z; )
      C[N] = l[N];
    return C;
  }
  function Xs(l, C, N, Z) {
    N || (N = {});
    for (var Ue = -1, ze = C.length; ++Ue < ze; ) {
      var Et = C[Ue], Ge = void 0;
      qs(N, Et, Ge === void 0 ? l[Et] : Ge);
    }
    return N;
  }
  function Yf(l, C) {
    return Xs(l, Zs(l), C);
  }
  function Jf(l) {
    return Df(l, Oi, Zs);
  }
  function Dr(l, C) {
    var N = l.__data__;
    return ru(C) ? N[typeof C == "string" ? "string" : "hash"] : N.map;
  }
  function Tn(l, C) {
    var N = W(l, C);
    return jf(N) ? N : void 0;
  }
  var Zs = Gs ? ye(Gs, Object) : hu, sn = Ff;
  (ki && sn(new ki(new ArrayBuffer(1))) != I || nr && sn(new nr()) != m || Ti && sn(Ti.resolve()) != k || Ii && sn(new Ii()) != R || Li && sn(new Li()) != _) && (sn = function(l) {
    var C = At.call(l), N = C == T ? l.constructor : void 0, Z = N ? on(N) : void 0;
    if (Z)
      switch (Z) {
        case hf:
          return I;
        case lf:
          return m;
        case df:
          return k;
        case pf:
          return R;
        case gf:
          return _;
      }
    return C;
  });
  function Qf(l) {
    var C = l.length, N = l.constructor(C);
    return C && typeof l[0] == "string" && et.call(l, "index") && (N.index = l.index, N.input = l.input), N;
  }
  function eu(l) {
    return typeof l.constructor == "function" && !Ys(l) ? Mf(sf(l)) : {};
  }
  function tu(l, C, N, Z) {
    var Ue = l.constructor;
    switch (C) {
      case v:
        return Ui(l);
      case c:
      case f:
        return new Ue(+l);
      case I:
        return zf(l, Z);
      case E:
      case B:
      case S:
      case u:
      case d:
      case a:
      case b:
      case y:
      case x:
        return Xf(l, Z);
      case m:
        return Gf(l, Z, N);
      case w:
      case z:
        return new Ue(l);
      case $:
        return Wf(l);
      case R:
        return Kf(l, Z, N);
      case H:
        return qf(l);
    }
  }
  function nu(l, C) {
    return C = C ?? i, !!C && (typeof l == "number" || A.test(l)) && l > -1 && l % 1 == 0 && l < C;
  }
  function ru(l) {
    var C = typeof l;
    return C == "string" || C == "number" || C == "symbol" || C == "boolean" ? l !== "__proto__" : l === null;
  }
  function iu(l) {
    return !!er && er in l;
  }
  function Ys(l) {
    var C = l && l.constructor, N = typeof C == "function" && C.prototype || $e;
    return l === N;
  }
  function on(l) {
    if (l != null) {
      try {
        return tr.call(l);
      } catch {
      }
      try {
        return l + "";
      } catch {
      }
    }
    return "";
  }
  function su(l) {
    return $i(l, !0, !0);
  }
  function Js(l, C) {
    return l === C || l !== l && C !== C;
  }
  function ou(l) {
    return au(l) && et.call(l, "callee") && (!af.call(l, "callee") || At.call(l) == s);
  }
  var Pi = Array.isArray;
  function Qs(l) {
    return l != null && fu(l.length) && !eo(l);
  }
  function au(l) {
    return uu(l) && Qs(l);
  }
  var cu = ff || lu;
  function eo(l) {
    var C = Fr(l) ? At.call(l) : "";
    return C == p || C == h;
  }
  function fu(l) {
    return typeof l == "number" && l > -1 && l % 1 == 0 && l <= i;
  }
  function Fr(l) {
    var C = typeof l;
    return !!l && (C == "object" || C == "function");
  }
  function uu(l) {
    return !!l && typeof l == "object";
  }
  function Oi(l) {
    return Qs(l) ? Of(l) : Vf(l);
  }
  function hu() {
    return [];
  }
  function lu() {
    return !1;
  }
  e.exports = su;
})(ai, ai.exports);
var w0 = ai.exports;
const m0 = /* @__PURE__ */ Vo(w0);
function cc(e) {
  if (ve(e).byteLength != Ir)
    throw Error("Invalid signature");
  return {
    type: X.MessageSignature,
    data: e
  };
}
function or(e, t) {
  return { type: X.Address, version: e, hash160: t };
}
function ur(e) {
  return Jn.c32address(e.version, e.hash160);
}
function en(e, t, n) {
  const r = t || 1, i = n || cl;
  if (_c(e, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: X.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function Hn(e) {
  const t = Jn.c32addressDecode(e);
  return {
    type: X.Address,
    version: t[0],
    hash160: t[1]
  };
}
function x0(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return v0(t, n);
  } else
    return fc(e);
}
function v0(e, t) {
  const n = Hn(e), r = en(t);
  return {
    type: X.Principal,
    prefix: wn.Contract,
    address: n,
    contractName: r
  };
}
function fc(e) {
  const t = Hn(e);
  return {
    type: X.Principal,
    prefix: wn.Standard,
    address: t
  };
}
var F;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(F || (F = {}));
function A0(e) {
  if (e.type === F.PrincipalStandard)
    return ur(e.address);
  if (e.type === F.PrincipalContract)
    return `${ur(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function S0(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return B0(t, n);
  } else
    return uc(e);
}
function uc(e) {
  const t = Hn(e);
  return { type: F.PrincipalStandard, address: t };
}
function E0(e) {
  return { type: F.PrincipalStandard, address: e };
}
function B0(e, t) {
  const n = Hn(e), r = en(t);
  return hc(n, r);
}
function hc(e, t) {
  if (Yn(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: F.PrincipalContract, address: e, contractName: t };
}
function zi(e, t = !1) {
  switch (e.type) {
    case F.BoolTrue:
      return !0;
    case F.BoolFalse:
      return !1;
    case F.Int:
    case F.UInt:
      return t ? e.value.toString() : e.value;
    case F.Buffer:
      return `0x${le(e.buffer)}`;
    case F.OptionalNone:
      return null;
    case F.OptionalSome:
      return an(e.value);
    case F.ResponseErr:
      return an(e.value);
    case F.ResponseOk:
      return an(e.value);
    case F.PrincipalStandard:
    case F.PrincipalContract:
      return A0(e);
    case F.List:
      return e.list.map((r) => an(r));
    case F.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = an(e.data[r]);
      }), n;
    case F.StringASCII:
      return e.data;
    case F.StringUTF8:
      return e.data;
  }
}
function an(e) {
  switch (e.type) {
    case F.ResponseErr:
      return { type: _t(e), value: zi(e, !0), success: !1 };
    case F.ResponseOk:
      return { type: _t(e), value: zi(e, !0), success: !0 };
    default:
      return { type: _t(e), value: zi(e, !0) };
  }
}
function _t(e) {
  switch (e.type) {
    case F.BoolTrue:
    case F.BoolFalse:
      return "bool";
    case F.Int:
      return "int";
    case F.UInt:
      return "uint";
    case F.Buffer:
      return `(buff ${e.buffer.length})`;
    case F.OptionalNone:
      return "(optional none)";
    case F.OptionalSome:
      return `(optional ${_t(e.value)})`;
    case F.ResponseErr:
      return `(response UnknownType ${_t(e.value)})`;
    case F.ResponseOk:
      return `(response ${_t(e.value)} UnknownType)`;
    case F.PrincipalStandard:
    case F.PrincipalContract:
      return "principal";
    case F.List:
      return `(list ${e.list.length} ${e.list.length ? _t(e.list[0]) : "UnknownType"})`;
    case F.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${_t(e.data[t])})`).join(" ")})`;
    case F.StringASCII:
      return `(string-ascii ${Aa(e.data).length})`;
    case F.StringUTF8:
      return `(string-utf8 ${Yn(e.data).length})`;
  }
}
const H0 = () => ({ type: F.BoolTrue }), _0 = () => ({ type: F.BoolFalse }), Co = BigInt("0xffffffffffffffffffffffffffffffff"), C0 = BigInt(0), ko = BigInt("0x7fffffffffffffffffffffffffffffff"), To = BigInt("-170141183460469231731687303715884105728"), k0 = (e) => {
  const t = Le(e, !0);
  if (t > ko)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${ko}`);
  if (t < To)
    throw new RangeError(`Cannot construct clarity integer form value less than ${To}`);
  return { type: F.Int, value: t };
}, lc = (e) => {
  const t = Le(e, !1);
  if (t < C0)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Co)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Co}`);
  return { type: F.UInt, value: t };
}, dc = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: F.Buffer, buffer: e };
};
function pc() {
  return { type: F.OptionalNone };
}
function gc(e) {
  return { type: F.OptionalSome, value: e };
}
function T0(e) {
  return { type: F.ResponseErr, value: e };
}
function I0(e) {
  return { type: F.ResponseOk, value: e };
}
function L0(e) {
  return { type: F.List, list: e };
}
function $0(e) {
  for (const t in e)
    if (!vd(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: F.Tuple, data: e };
}
const U0 = (e) => ({ type: F.StringASCII, data: e }), P0 = (e) => ({ type: F.StringUTF8, data: e });
class bc extends Ha {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, hn.hash(t);
    const r = xs(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? t.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return hn.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    hn.exists(this), hn.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: c } = this;
    return t = t, t.finished = i, t.destroyed = s, t.blockLen = o, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const yc = (e, t, n) => new bc(e, t).update(n).digest();
yc.create = (e, t) => new bc(e, t);
mt.hmacSha256Sync = (e, ...t) => {
  const n = yc.create(Es, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function It(e) {
  return {
    type: X.PublicKey,
    data: ve(e)
  };
}
function O0(e, t, n = Ae.Compressed) {
  const r = el(t.data), i = new xt(bo(r.r), bo(r.s)), s = me.fromSignature(e, i, r.recoveryId), o = n === Ae.Compressed;
  return s.toHex(o);
}
function N0(e) {
  return { type: X.PublicKey, data: e };
}
function Qn(e) {
  return !le(e.data).startsWith("04");
}
function ci(e) {
  return e.data.slice();
}
function M0(e) {
  const t = j0(e), n = Rh(t.data.slice(0, 32), t.compressed);
  return It(le(n));
}
function D0(e) {
  const t = typeof e == "string" ? e : le(e), n = me.fromHex(t).toHex(!0);
  return It(n);
}
function F0(e) {
  const t = typeof e == "string" ? e : le(e), n = me.fromHex(t).toHex(!1);
  return It(n);
}
function ss(e) {
  const t = e.readUInt8(), n = t === 4 ? hl : ul;
  return N0(_e([t, e.readBytes(n)]));
}
function j0(e) {
  const t = tl(e), n = t.length == Sa;
  return { data: t, compressed: n };
}
function V0(e, t) {
  const [n, r] = Kh(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = Tr(r, 1) + xt.fromHex(n).toCompactHex();
  return cc(s);
}
function R0(e) {
  return M0(e.data);
}
function wc(e, t, n) {
  return typeof e == "string" && (e = S0(e)), typeof n == "string" && (n = $o(n)), {
    type: X.Payload,
    payloadType: he.TokenTransfer,
    recipient: e,
    amount: Le(t, !1),
    memo: n ?? $o("")
  };
}
function mc(e, t, n, r) {
  return typeof e == "string" && (e = Hn(e)), typeof t == "string" && (t = en(t)), typeof n == "string" && (n = en(n)), {
    type: X.Payload,
    payloadType: he.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function Io(e, t, n) {
  return typeof e == "string" && (e = en(e)), typeof t == "string" && (t = J0(t)), typeof n == "number" ? {
    type: X.Payload,
    payloadType: he.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: X.Payload,
    payloadType: he.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function z0() {
  return { type: X.Payload, payloadType: he.PoisonMicroblock };
}
function Lo(e, t) {
  if (e.byteLength != pn)
    throw Error(`Coinbase buffer size must be ${pn} bytes`);
  return t != null ? {
    type: X.Payload,
    payloadType: he.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: X.Payload,
    payloadType: he.Coinbase,
    coinbaseBytes: e
  };
}
function G0(e, t, n) {
  if (e.byteLength != pn)
    throw Error(`Coinbase buffer size must be ${pn} bytes`);
  if (n.byteLength != Qi)
    throw Error(`VRF proof buffer size must be ${Qi} bytes`);
  return {
    type: X.Payload,
    payloadType: he.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === F.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var os;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(os || (os = {}));
function W0(e, t, n, r, i, s, o) {
  return {
    type: X.Payload,
    payloadType: he.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Cs(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case he.TokenTransfer:
      t.push(Me(e.recipient)), t.push(Yt(e.amount, !1, 8)), t.push(Bt(e.memo));
      break;
    case he.ContractCall:
      t.push(Bt(e.contractAddress)), t.push(Bt(e.contractName)), t.push(Bt(e.functionName));
      const n = new Uint8Array(4);
      bn(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Me(r));
      });
      break;
    case he.SmartContract:
      t.push(Bt(e.contractName)), t.push(Bt(e.codeBody));
      break;
    case he.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Bt(e.contractName)), t.push(Bt(e.codeBody));
      break;
    case he.PoisonMicroblock:
      break;
    case he.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case he.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Me(e.recipient));
      break;
    case he.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Me(e.recipient ? gc(e.recipient) : pc())), t.push(e.vrfProof);
      break;
    case he.TenureChange:
      t.push(ve(e.tenureHash)), t.push(ve(e.previousTenureHash)), t.push(ve(e.burnViewHash)), t.push(ve(e.previousTenureEnd)), t.push(bn(new Uint8Array(4), e.previousTenureBlocks)), t.push(sl(new Uint8Array(1), e.cause)), t.push(ve(e.publicKeyHash));
      break;
  }
  return _e(t);
}
function K0(e) {
  switch (e.readUInt8Enum(he, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case he.TokenTransfer:
      const n = ut(e), r = Le(e.readBytes(8), !1), i = Ac(e);
      return wc(n, r, i);
    case he.ContractCall:
      const s = Gn(e), o = it(e), c = it(e), f = [], g = e.readUInt32BE();
      for (let H = 0; H < g; H++) {
        const _ = ut(e);
        f.push(_);
      }
      return mc(s, o, c, f);
    case he.SmartContract:
      const p = it(e), h = it(e, 4, 1e5);
      return Io(p, h);
    case he.VersionedSmartContract: {
      const H = e.readUInt8Enum(es, (I) => {
        throw new Error(`Cannot recognize ClarityVersion: ${I}`);
      }), _ = it(e), v = it(e, 4, 1e5);
      return Io(_, v, H);
    }
    case he.PoisonMicroblock:
      return z0();
    case he.Coinbase: {
      const H = e.readBytes(pn);
      return Lo(H);
    }
    case he.CoinbaseToAltRecipient: {
      const H = e.readBytes(pn), _ = ut(e);
      return Lo(H, _);
    }
    case he.NakamotoCoinbase: {
      const H = e.readBytes(pn), _ = ut(e), v = e.readBytes(Qi);
      return G0(H, _, v);
    }
    case he.TenureChange:
      const m = le(e.readBytes(20)), w = le(e.readBytes(20)), T = le(e.readBytes(20)), k = le(e.readBytes(32)), $ = e.readUInt32BE(), R = e.readUInt8Enum(os, (H) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${H}`);
      }), z = le(e.readBytes(20));
      return W0(m, w, T, k, $, R, z);
  }
}
class $r extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class cn extends $r {
  constructor(t) {
    super(t);
  }
}
class Ye extends $r {
  constructor(t) {
    super(t);
  }
}
class xc extends $r {
  constructor(t) {
    super(t);
  }
}
class fi extends $r {
  constructor(t) {
    super(t);
  }
}
class ln extends $r {
  constructor(t) {
    super(t);
  }
}
var ft;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ft || (ft = {}));
function as(e) {
  return cc(le(e.readBytes(Ir)));
}
function Un(e, t) {
  return {
    pubKeyEncoding: e,
    type: X.TransactionAuthField,
    contents: t
  };
}
function q0(e) {
  const t = e.readUInt8Enum(ft, (n) => {
    throw new Ye(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case ft.PublicKeyCompressed:
      return Un(Ae.Compressed, ss(e));
    case ft.PublicKeyUncompressed:
      return Un(Ae.Uncompressed, F0(ss(e).data));
    case ft.SignatureCompressed:
      return Un(Ae.Compressed, as(e));
    case ft.SignatureUncompressed:
      return Un(Ae.Uncompressed, as(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function ks(e) {
  return ve(e.data);
}
function X0(e) {
  const t = [];
  switch (e.contents.type) {
    case X.PublicKey:
      t.push(e.pubKeyEncoding === Ae.Compressed ? ft.PublicKeyCompressed : ft.PublicKeyUncompressed), t.push(ci(D0(e.contents.data)));
      break;
    case X.MessageSignature:
      t.push(e.pubKeyEncoding === Ae.Compressed ? ft.SignatureCompressed : ft.SignatureUncompressed), t.push(ks(e.contents));
      break;
  }
  return _e(t);
}
function Bt(e) {
  switch (e.type) {
    case X.Address:
      return Ur(e);
    case X.Principal:
      return vc(e);
    case X.LengthPrefixedString:
      return Wn(e);
    case X.MemoString:
      return Q0(e);
    case X.AssetInfo:
      return Sc(e);
    case X.PostCondition:
      return ed(e);
    case X.PublicKey:
      return ci(e);
    case X.LengthPrefixedList:
      return Ts(e);
    case X.Payload:
      return Cs(e);
    case X.TransactionAuthField:
      return X0(e);
    case X.MessageSignature:
      return ks(e);
  }
}
function Z0() {
  return {
    type: X.Address,
    version: Qt.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function zn(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === de.SerializeP2PKH || t === de.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === de.SerializeP2WPKH || t === de.SerializeP2WSH || t === de.SerializeP2WSHNonSequential) && !r.every(Qn))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case de.SerializeP2PKH:
      return or(e, yd(r[0].data));
    case de.SerializeP2WPKH:
      return or(e, wd(r[0].data));
    case de.SerializeP2SH:
    case de.SerializeP2SHNonSequential:
      return or(e, md(n, r.map(ci)));
    case de.SerializeP2WSH:
    case de.SerializeP2WSHNonSequential:
      return or(e, xd(n, r.map(ci)));
  }
}
function Ur(e) {
  const t = [];
  return t.push(ve(Tr(e.version, 1))), t.push(ve(e.hash160)), _e(t);
}
function Gn(e) {
  const t = bi(le(e.readBytes(1))), n = le(e.readBytes(20));
  return { type: X.Address, version: t, hash160: n };
}
function vc(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ur(e.address)), e.prefix === wn.Contract && t.push(Wn(e.contractName)), _e(t);
}
function Y0(e) {
  const t = e.readUInt8Enum(wn, (i) => {
    throw new Ye(`Unexpected Principal payload type: ${i}`);
  }), n = Gn(e);
  if (t === wn.Standard)
    return { type: X.Principal, prefix: t, address: n };
  const r = it(e);
  return {
    type: X.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Wn(e) {
  const t = [], n = Yn(e.content), r = n.byteLength;
  return t.push(ve(Tr(r, e.lengthPrefixBytes))), t.push(n), _e(t);
}
function it(e, t, n) {
  t = t || 1;
  const r = bi(le(e.readBytes(t))), i = ms(e.readBytes(r));
  return en(i, t, n ?? 128);
}
function J0(e) {
  return en(e, 4, 1e5);
}
function $o(e) {
  if (e && _c(e, si))
    throw new Error(`Memo exceeds maximum length of ${si} bytes`);
  return { type: X.MemoString, content: e };
}
function Q0(e) {
  const t = [], n = Yn(e.content), r = bd(le(n), si * 2);
  return t.push(ve(r)), _e(t);
}
function Ac(e) {
  let t = ms(e.readBytes(si));
  return t = t.replace(/\u0000*$/, ""), { type: X.MemoString, content: t };
}
function Sc(e) {
  const t = [];
  return t.push(Ur(e.address)), t.push(Wn(e.contractName)), t.push(Wn(e.assetName)), _e(t);
}
function cs(e) {
  return {
    type: X.AssetInfo,
    address: Gn(e),
    contractName: it(e),
    assetName: it(e)
  };
}
function vi(e, t) {
  return {
    type: X.LengthPrefixedList,
    lengthPrefixBytes: 4,
    values: e
  };
}
function Ts(e) {
  const t = e.values, n = [];
  n.push(ve(Tr(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Bt(r));
  return _e(n);
}
function Ec(e, t, n) {
  const r = bi(le(e.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (t) {
      case X.Address:
        i.push(Gn(e));
        break;
      case X.LengthPrefixedString:
        i.push(it(e));
        break;
      case X.MemoString:
        i.push(Ac(e));
        break;
      case X.AssetInfo:
        i.push(cs(e));
        break;
      case X.PostCondition:
        i.push(td(e));
        break;
      case X.PublicKey:
        i.push(ss(e));
        break;
      case X.TransactionAuthField:
        i.push(q0(e));
        break;
    }
  return vi(i);
}
function ed(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(vc(e.principal)), (e.conditionType === De.Fungible || e.conditionType === De.NonFungible) && t.push(Sc(e.assetInfo)), e.conditionType === De.NonFungible && t.push(Me(e.assetName)), t.push(e.conditionCode), e.conditionType === De.STX || e.conditionType === De.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new cn("The post-condition amount may not be larger than 8 bytes");
    t.push(Yt(e.amount, !1, 8));
  }
  return _e(t);
}
function td(e) {
  const t = e.readUInt8Enum(De, (o) => {
    throw new Ye(`Could not read ${o} as PostConditionType`);
  }), n = Y0(e);
  let r, i, s;
  switch (t) {
    case De.STX:
      return r = e.readUInt8Enum(Vn, (c) => {
        throw new Ye(`Could not read ${c} as FungibleConditionCode`);
      }), s = BigInt(`0x${le(e.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: De.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case De.Fungible:
      return i = cs(e), r = e.readUInt8Enum(Vn, (c) => {
        throw new Ye(`Could not read ${c} as FungibleConditionCode`);
      }), s = BigInt(`0x${le(e.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: De.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case De.NonFungible:
      i = cs(e);
      const o = ut(e);
      return r = e.readUInt8Enum(ts, (c) => {
        throw new Ye(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: X.PostCondition,
        conditionType: De.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function vt(e, t) {
  return _e([e, t]);
}
function nd(e) {
  return new Uint8Array([e.type]);
}
function rd(e) {
  return e.type === F.OptionalNone ? new Uint8Array([e.type]) : vt(e.type, Me(e.value));
}
function id(e) {
  const t = new Uint8Array(4);
  return bn(t, e.buffer.length, 0), vt(e.type, yi(t, e.buffer));
}
function sd(e) {
  const t = ws(qh(e.value, BigInt(fl)), Ea);
  return vt(e.type, t);
}
function od(e) {
  const t = ws(e.value, Ea);
  return vt(e.type, t);
}
function ad(e) {
  return vt(e.type, Ur(e.address));
}
function cd(e) {
  return vt(e.type, yi(Ur(e.address), Wn(e.contractName)));
}
function fd(e) {
  return vt(e.type, Me(e.value));
}
function ud(e) {
  const t = [], n = new Uint8Array(4);
  bn(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const i = Me(r);
    t.push(i);
  }
  return vt(e.type, _e(t));
}
function hd(e) {
  const t = [], n = new Uint8Array(4);
  bn(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = en(i);
    t.push(Wn(s));
    const o = Me(e.data[i]);
    t.push(o);
  }
  return vt(e.type, _e(t));
}
function Bc(e, t) {
  const n = [], r = t == "ascii" ? Aa(e.data) : Yn(e.data), i = new Uint8Array(4);
  return bn(i, r.length, 0), n.push(i), n.push(r), vt(e.type, _e(n));
}
function ld(e) {
  return Bc(e, "ascii");
}
function dd(e) {
  return Bc(e, "utf8");
}
function Me(e) {
  switch (e.type) {
    case F.BoolTrue:
    case F.BoolFalse:
      return nd(e);
    case F.OptionalNone:
    case F.OptionalSome:
      return rd(e);
    case F.Buffer:
      return id(e);
    case F.UInt:
      return od(e);
    case F.Int:
      return sd(e);
    case F.PrincipalStandard:
      return ad(e);
    case F.PrincipalContract:
      return cd(e);
    case F.ResponseOk:
    case F.ResponseErr:
      return fd(e);
    case F.List:
      return ud(e);
    case F.Tuple:
      return hd(e);
    case F.StringASCII:
      return ld(e);
    case F.StringUTF8:
      return dd(e);
    default:
      throw new cn("Unable to serialize. Invalid Clarity Value.");
  }
}
function pd(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const Uo = /* @__PURE__ */ new Map();
function Hc(e, t) {
  const n = Uo.get(e);
  if (n !== void 0)
    return n(t);
  const r = pd(e);
  return Uo.set(e, r), Hc(e, t);
}
class hr {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return ol(this.readBytes(4), 0);
  }
  readUInt8() {
    return il(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return nl(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = le(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = le(n);
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
    if (Hc(t, r))
      return r;
    throw n(r);
  }
}
function ut(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new hr(ve(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new hr(e) : t = e;
  switch (t.readUInt8Enum(F, (r) => {
    throw new Ye(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case F.Int:
      return k0(t.readBytes(16));
    case F.UInt:
      return lc(t.readBytes(16));
    case F.Buffer:
      const r = t.readUInt32BE();
      return dc(t.readBytes(r));
    case F.BoolTrue:
      return H0();
    case F.BoolFalse:
      return _0();
    case F.PrincipalStandard:
      const i = Gn(t);
      return E0(i);
    case F.PrincipalContract:
      const s = Gn(t), o = it(t);
      return hc(s, o);
    case F.ResponseOk:
      return I0(ut(t));
    case F.ResponseErr:
      return T0(ut(t));
    case F.OptionalNone:
      return pc();
    case F.OptionalSome:
      return gc(ut(t));
    case F.List:
      const c = t.readUInt32BE(), f = [];
      for (let k = 0; k < c; k++)
        f.push(ut(t));
      return L0(f);
    case F.Tuple:
      const g = t.readUInt32BE(), p = {};
      for (let k = 0; k < g; k++) {
        const $ = it(t).content;
        if ($ === void 0)
          throw new Ye('"content" is undefined');
        p[$] = ut(t);
      }
      return $0(p);
    case F.StringASCII:
      const h = t.readUInt32BE(), m = Jh(t.readBytes(h));
      return U0(m);
    case F.StringUTF8:
      const w = t.readUInt32BE(), T = ms(t.readBytes(w));
      return P0(T);
    default:
      throw new Ye("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const gd = (e) => e.length % 2 == 0 ? e : `0${e}`, bd = (e, t) => e.padEnd(t, "0"), _c = (e, t) => e ? Yn(e).length > t : !1;
function ui(e) {
  return m0(e);
}
const gr = (e) => _l(Es(e)), Is = (e) => le(i0(e)), yd = (e) => le(gr(e)), wd = (e) => {
  const t = gr(e), n = yi(new Uint8Array([0]), new Uint8Array([t.length]), t), r = gr(n);
  return le(r);
}, md = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = _e(n), i = gr(r);
  return le(i);
}, xd = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((f) => {
    n.push(f.length), n.push(f);
  }), n.push(80 + t.length), n.push(174);
  const r = _e(n), i = Es(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = _e(s), c = gr(o);
  return le(c);
};
function vd(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
const Ad = (e) => {
  try {
    return Jn.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Ls() {
  return {
    type: X.MessageSignature,
    data: le(new Uint8Array(Ir))
  };
}
function Ai(e, t, n, r) {
  const i = zn(0, e, 1, [It(t)]).hash160, s = Qn(It(t)) ? Ae.Compressed : Ae.Uncompressed;
  return {
    hashMode: e,
    signer: i,
    nonce: Le(n, !1),
    fee: Le(r, !1),
    keyEncoding: s,
    signature: Ls()
  };
}
function Cc(e, t, n, r, i) {
  const s = n.map(It), o = zn(0, e, t, s).hash160;
  return {
    hashMode: e,
    signer: o,
    nonce: Le(r, !1),
    fee: Le(i, !1),
    fields: [],
    signaturesRequired: t
  };
}
function br(e) {
  return "signature" in e;
}
function Po(e) {
  return e === de.SerializeP2SH || e === de.SerializeP2WSH;
}
function Sd(e) {
  return e === de.SerializeP2SHNonSequential || e === de.SerializeP2WSHNonSequential;
}
function Oo(e) {
  const t = ui(e);
  return t.nonce = 0, t.fee = 0, br(t) ? t.signature = Ls() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Ed(e) {
  const t = [
    e.hashMode,
    ve(e.signer),
    Yt(e.nonce, !1, 8),
    Yt(e.fee, !1, 8),
    e.keyEncoding,
    ks(e.signature)
  ];
  return _e(t);
}
function Bd(e) {
  const t = [
    e.hashMode,
    ve(e.signer),
    Yt(e.nonce, !1, 8),
    Yt(e.fee, !1, 8)
  ], n = vi(e.fields);
  t.push(Ts(n));
  const r = new Uint8Array(2);
  return rl(r, e.signaturesRequired, 0), t.push(r), _e(t);
}
function Hd(e, t) {
  const n = le(t.readBytes(20)), r = BigInt(`0x${le(t.readBytes(8))}`), i = BigInt(`0x${le(t.readBytes(8))}`), s = t.readUInt8Enum(Ae, (c) => {
    throw new Ye(`Could not parse ${c} as PubKeyEncoding`);
  });
  if (e === de.SerializeP2WPKH && s != Ae.Compressed)
    throw new Ye("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = as(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function _d(e, t) {
  const n = le(t.readBytes(20)), r = BigInt("0x" + le(t.readBytes(8))), i = BigInt("0x" + le(t.readBytes(8))), s = Ec(t, X.TransactionAuthField).values;
  let o = !1, c = 0;
  for (const g of s)
    switch (g.contents.type) {
      case X.PublicKey:
        Qn(g.contents) || (o = !0);
        break;
      case X.MessageSignature:
        if (g.pubKeyEncoding === Ae.Uncompressed && (o = !0), c += 1, c === 65536)
          throw new ln("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const f = t.readUInt16BE();
  if (o && (e === de.SerializeP2WSH || e === de.SerializeP2WSHNonSequential))
    throw new ln("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: f
  };
}
function Gi(e) {
  return br(e) ? Ed(e) : Bd(e);
}
function Wi(e) {
  const t = e.readUInt8Enum(de, (n) => {
    throw new Ye(`Could not parse ${n} as AddressHashMode`);
  });
  return t === de.SerializeP2PKH || t === de.SerializeP2WPKH ? Hd(t, e) : _d(t, e);
}
function kc(e, t, n, r) {
  const s = e + le(new Uint8Array([t])) + le(Yt(n, !1, 8)) + le(Yt(r, !1, 8));
  if (ve(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Is(ve(s));
}
function Tc(e, t, n) {
  const r = 33 + Ir, i = Qn(t) ? Ae.Compressed : Ae.Uncompressed, s = e + gd(i.toString(16)) + n.data, o = ve(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Is(o);
}
function Cd(e, t, n, r, i) {
  const s = kc(e, t, n, r), o = V0(i, s), c = R0(i), f = Tc(s, c, o);
  return {
    nextSig: o,
    nextSigHash: f
  };
}
function Ic(e, t, n, r, i, s) {
  const o = kc(e, t, n, r), c = It(O0(o, s, i)), f = Tc(o, c, s);
  return {
    pubKey: c,
    nextSigHash: f
  };
}
function kd() {
  const e = Ai(de.SerializeP2PKH, "", 0, 0);
  return e.signer = Z0().hash160, e.keyEncoding = Ae.Compressed, e.signature = Ls(), e;
}
function No(e, t, n) {
  return br(e) ? Td(e, t, n) : Id(e, t, n);
}
function Td(e, t, n) {
  const { pubKey: r, nextSigHash: i } = Ic(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), s = zn(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new ln(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return i;
}
function Id(e, t, n) {
  const r = [];
  let i = t, s = !1, o = 0;
  for (const f of e.fields)
    switch (f.contents.type) {
      case X.PublicKey:
        Qn(f.contents) || (s = !0), r.push(f.contents);
        break;
      case X.MessageSignature:
        f.pubKeyEncoding === Ae.Uncompressed && (s = !0);
        const { pubKey: g, nextSigHash: p } = Ic(i, n, e.fee, e.nonce, f.pubKeyEncoding, f.contents);
        if (Po(e.hashMode) && (i = p), r.push(g), o += 1, o === 65536)
          throw new ln("Too many signatures");
        break;
    }
  if (Po(e.hashMode) && o !== e.signaturesRequired || Sd(e.hashMode) && o < e.signaturesRequired)
    throw new ln("Incorrect number of signatures");
  if (s && (e.hashMode === de.SerializeP2WSH || e.hashMode === de.SerializeP2WSHNonSequential))
    throw new ln("Uncompressed keys are not allowed in this hash mode");
  const c = zn(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (c !== e.signer)
    throw new ln(`Signer hash does not equal hash of public key(s): ${c} != ${e.signer}`);
  return i;
}
function Si(e) {
  return {
    authType: Ee.Standard,
    spendingCondition: e
  };
}
function Ei(e, t) {
  return {
    authType: Ee.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Ai(de.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Mo(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Ee.Standard:
        return Si(Oo(e.spendingCondition));
      case Ee.Sponsored:
        return Ei(Oo(e.spendingCondition), kd());
      default:
        throw new fi("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Ld(e, t) {
  switch (e.authType) {
    case Ee.Standard:
      return No(e.spendingCondition, t, Ee.Standard);
    case Ee.Sponsored:
      return No(e.spendingCondition, t, Ee.Standard);
    default:
      throw new fi("Invalid origin auth type");
  }
}
function $d(e, t) {
  switch (e.authType) {
    case Ee.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Le(t, !1)
      };
      return { ...e, spendingCondition: n };
    case Ee.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Le(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Ud(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Le(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Pd(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Le(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Od(e, t) {
  const n = {
    ...t,
    nonce: Le(t.nonce, !1),
    fee: Le(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Nd(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Ee.Standard:
      t.push(Gi(e.spendingCondition));
      break;
    case Ee.Sponsored:
      t.push(Gi(e.spendingCondition)), t.push(Gi(e.sponsorSpendingCondition));
      break;
  }
  return _e(t);
}
function Md(e) {
  const t = e.readUInt8Enum(Ee, (r) => {
    throw new Ye(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Ee.Standard:
      return n = Wi(e), Si(n);
    case Ee.Sponsored:
      n = Wi(e);
      const r = Wi(e);
      return Ei(n, r);
  }
}
(function() {
  (function(e) {
    (function(t) {
      var n = typeof globalThis < "u" && globalThis || typeof e < "u" && e || // eslint-disable-next-line no-undef
      typeof fn < "u" && fn || {}, r = {
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
      function i(u) {
        return u && DataView.prototype.isPrototypeOf(u);
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
        ], o = ArrayBuffer.isView || function(u) {
          return u && s.indexOf(Object.prototype.toString.call(u)) > -1;
        };
      function c(u) {
        if (typeof u != "string" && (u = String(u)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(u) || u === "")
          throw new TypeError('Invalid character in header field name: "' + u + '"');
        return u.toLowerCase();
      }
      function f(u) {
        return typeof u != "string" && (u = String(u)), u;
      }
      function g(u) {
        var d = {
          next: function() {
            var a = u.shift();
            return { done: a === void 0, value: a };
          }
        };
        return r.iterable && (d[Symbol.iterator] = function() {
          return d;
        }), d;
      }
      function p(u) {
        this.map = {}, u instanceof p ? u.forEach(function(d, a) {
          this.append(a, d);
        }, this) : Array.isArray(u) ? u.forEach(function(d) {
          if (d.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + d.length);
          this.append(d[0], d[1]);
        }, this) : u && Object.getOwnPropertyNames(u).forEach(function(d) {
          this.append(d, u[d]);
        }, this);
      }
      p.prototype.append = function(u, d) {
        u = c(u), d = f(d);
        var a = this.map[u];
        this.map[u] = a ? a + ", " + d : d;
      }, p.prototype.delete = function(u) {
        delete this.map[c(u)];
      }, p.prototype.get = function(u) {
        return u = c(u), this.has(u) ? this.map[u] : null;
      }, p.prototype.has = function(u) {
        return this.map.hasOwnProperty(c(u));
      }, p.prototype.set = function(u, d) {
        this.map[c(u)] = f(d);
      }, p.prototype.forEach = function(u, d) {
        for (var a in this.map)
          this.map.hasOwnProperty(a) && u.call(d, this.map[a], a, this);
      }, p.prototype.keys = function() {
        var u = [];
        return this.forEach(function(d, a) {
          u.push(a);
        }), g(u);
      }, p.prototype.values = function() {
        var u = [];
        return this.forEach(function(d) {
          u.push(d);
        }), g(u);
      }, p.prototype.entries = function() {
        var u = [];
        return this.forEach(function(d, a) {
          u.push([a, d]);
        }), g(u);
      }, r.iterable && (p.prototype[Symbol.iterator] = p.prototype.entries);
      function h(u) {
        if (!u._noBody) {
          if (u.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          u.bodyUsed = !0;
        }
      }
      function m(u) {
        return new Promise(function(d, a) {
          u.onload = function() {
            d(u.result);
          }, u.onerror = function() {
            a(u.error);
          };
        });
      }
      function w(u) {
        var d = new FileReader(), a = m(d);
        return d.readAsArrayBuffer(u), a;
      }
      function T(u) {
        var d = new FileReader(), a = m(d), b = /charset=([A-Za-z0-9_-]+)/.exec(u.type), y = b ? b[1] : "utf-8";
        return d.readAsText(u, y), a;
      }
      function k(u) {
        for (var d = new Uint8Array(u), a = new Array(d.length), b = 0; b < d.length; b++)
          a[b] = String.fromCharCode(d[b]);
        return a.join("");
      }
      function $(u) {
        if (u.slice)
          return u.slice(0);
        var d = new Uint8Array(u.byteLength);
        return d.set(new Uint8Array(u)), d.buffer;
      }
      function R() {
        return this.bodyUsed = !1, this._initBody = function(u) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = u, u ? typeof u == "string" ? this._bodyText = u : r.blob && Blob.prototype.isPrototypeOf(u) ? this._bodyBlob = u : r.formData && FormData.prototype.isPrototypeOf(u) ? this._bodyFormData = u : r.searchParams && URLSearchParams.prototype.isPrototypeOf(u) ? this._bodyText = u.toString() : r.arrayBuffer && r.blob && i(u) ? (this._bodyArrayBuffer = $(u.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(u) || o(u)) ? this._bodyArrayBuffer = $(u) : this._bodyText = u = Object.prototype.toString.call(u) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof u == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(u) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var u = h(this);
          if (u)
            return u;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var u = h(this);
            return u || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(w);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var u = h(this);
          if (u)
            return u;
          if (this._bodyBlob)
            return T(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(k(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(v);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var z = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function H(u) {
        var d = u.toUpperCase();
        return z.indexOf(d) > -1 ? d : u;
      }
      function _(u, d) {
        if (!(this instanceof _))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        d = d || {};
        var a = d.body;
        if (u instanceof _) {
          if (u.bodyUsed)
            throw new TypeError("Already read");
          this.url = u.url, this.credentials = u.credentials, d.headers || (this.headers = new p(u.headers)), this.method = u.method, this.mode = u.mode, this.signal = u.signal, !a && u._bodyInit != null && (a = u._bodyInit, u.bodyUsed = !0);
        } else
          this.url = String(u);
        if (this.credentials = d.credentials || this.credentials || "same-origin", (d.headers || !this.headers) && (this.headers = new p(d.headers)), this.method = H(d.method || this.method || "GET"), this.mode = d.mode || this.mode || null, this.signal = d.signal || this.signal || function() {
          if ("AbortController" in n) {
            var x = new AbortController();
            return x.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && a)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(a), (this.method === "GET" || this.method === "HEAD") && (d.cache === "no-store" || d.cache === "no-cache")) {
          var b = /([?&])_=[^&]*/;
          if (b.test(this.url))
            this.url = this.url.replace(b, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var y = /\?/;
            this.url += (y.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      _.prototype.clone = function() {
        return new _(this, { body: this._bodyInit });
      };
      function v(u) {
        var d = new FormData();
        return u.trim().split("&").forEach(function(a) {
          if (a) {
            var b = a.split("="), y = b.shift().replace(/\+/g, " "), x = b.join("=").replace(/\+/g, " ");
            d.append(decodeURIComponent(y), decodeURIComponent(x));
          }
        }), d;
      }
      function I(u) {
        var d = new p(), a = u.replace(/\r?\n[\t ]+/g, " ");
        return a.split("\r").map(function(b) {
          return b.indexOf(`
`) === 0 ? b.substr(1, b.length) : b;
        }).forEach(function(b) {
          var y = b.split(":"), x = y.shift().trim();
          if (x) {
            var j = y.join(":").trim();
            try {
              d.append(x, j);
            } catch (V) {
              console.warn("Response " + V.message);
            }
          }
        }), d;
      }
      R.call(_.prototype);
      function E(u, d) {
        if (!(this instanceof E))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (d || (d = {}), this.type = "default", this.status = d.status === void 0 ? 200 : d.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = d.statusText === void 0 ? "" : "" + d.statusText, this.headers = new p(d.headers), this.url = d.url || "", this._initBody(u);
      }
      R.call(E.prototype), E.prototype.clone = function() {
        return new E(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new p(this.headers),
          url: this.url
        });
      }, E.error = function() {
        var u = new E(null, { status: 200, statusText: "" });
        return u.ok = !1, u.status = 0, u.type = "error", u;
      };
      var B = [301, 302, 303, 307, 308];
      E.redirect = function(u, d) {
        if (B.indexOf(d) === -1)
          throw new RangeError("Invalid status code");
        return new E(null, { status: d, headers: { location: u } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(d, a) {
          this.message = d, this.name = a;
          var b = Error(d);
          this.stack = b.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function S(u, d) {
        return new Promise(function(a, b) {
          var y = new _(u, d);
          if (y.signal && y.signal.aborted)
            return b(new t.DOMException("Aborted", "AbortError"));
          var x = new XMLHttpRequest();
          function j() {
            x.abort();
          }
          x.onload = function() {
            var A = {
              statusText: x.statusText,
              headers: I(x.getAllResponseHeaders() || "")
            };
            y.url.indexOf("file://") === 0 && (x.status < 200 || x.status > 599) ? A.status = 200 : A.status = x.status, A.url = "responseURL" in x ? x.responseURL : A.headers.get("X-Request-URL");
            var U = "response" in x ? x.response : x.responseText;
            setTimeout(function() {
              a(new E(U, A));
            }, 0);
          }, x.onerror = function() {
            setTimeout(function() {
              b(new TypeError("Network request failed"));
            }, 0);
          }, x.ontimeout = function() {
            setTimeout(function() {
              b(new TypeError("Network request timed out"));
            }, 0);
          }, x.onabort = function() {
            setTimeout(function() {
              b(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function V(A) {
            try {
              return A === "" && n.location.href ? n.location.href : A;
            } catch {
              return A;
            }
          }
          if (x.open(y.method, V(y.url), !0), y.credentials === "include" ? x.withCredentials = !0 : y.credentials === "omit" && (x.withCredentials = !1), "responseType" in x && (r.blob ? x.responseType = "blob" : r.arrayBuffer && (x.responseType = "arraybuffer")), d && typeof d.headers == "object" && !(d.headers instanceof p || n.Headers && d.headers instanceof n.Headers)) {
            var G = [];
            Object.getOwnPropertyNames(d.headers).forEach(function(A) {
              G.push(c(A)), x.setRequestHeader(A, f(d.headers[A]));
            }), y.headers.forEach(function(A, U) {
              G.indexOf(U) === -1 && x.setRequestHeader(U, A);
            });
          } else
            y.headers.forEach(function(A, U) {
              x.setRequestHeader(U, A);
            });
          y.signal && (y.signal.addEventListener("abort", j), x.onreadystatechange = function() {
            x.readyState === 4 && y.signal.removeEventListener("abort", j);
          }), x.send(typeof y._bodyInit > "u" ? null : y._bodyInit);
        });
      }
      return S.polyfill = !0, n.fetch || (n.fetch = S, n.Headers = p, n.Request = _, n.Response = E), t.Headers = p, t.Request = _, t.Response = E, t.fetch = S, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : fn);
})();
const Dd = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Fd(e, t) {
  const n = {};
  return Object.assign(n, Dd, t), await fetch(e, n);
}
function jd(e) {
  let t = Fd, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Vd(...e) {
  const { fetchLib: t, middlewares: n } = jd(e);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
    for (const f of n)
      typeof f.pre == "function" && (o = await Promise.resolve(f.pre({
        fetch: t,
        ...o
      })) ?? o);
    let c = await t(o.url, o.init);
    for (const f of n)
      typeof f.post == "function" && (c = await Promise.resolve(f.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var Kn;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Kn || (Kn = {}));
var xn;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(xn || (xn = {}));
var Do;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Do || (Do = {}));
const Rd = "https://api.mainnet.hiro.so", zd = "https://api.testnet.hiro.so", Gd = "http://localhost:3999", Wd = ["mainnet", "testnet", "devnet", "mocknet"];
class at {
  constructor(t) {
    this.version = xn.Mainnet, this.chainId = Kn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === xn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Vd();
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
at.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new tn();
    case "testnet":
      return new Lc();
    case "devnet":
      return new Kd();
    case "mocknet":
      return new $c();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Wd.join(", ")}`);
  }
};
at.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : at.fromName(e);
class tn extends at {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Rd,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = xn.Mainnet, this.chainId = Kn.Mainnet;
  }
}
class Lc extends at {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? zd,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = xn.Testnet, this.chainId = Kn.Testnet;
  }
}
class $c extends at {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Gd,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = xn.Testnet, this.chainId = Kn.Testnet;
  }
}
const Kd = $c;
var be;
(function(e) {
  e[e.ClarityAbiTypeUInt128 = 1] = "ClarityAbiTypeUInt128", e[e.ClarityAbiTypeInt128 = 2] = "ClarityAbiTypeInt128", e[e.ClarityAbiTypeBool = 3] = "ClarityAbiTypeBool", e[e.ClarityAbiTypePrincipal = 4] = "ClarityAbiTypePrincipal", e[e.ClarityAbiTypeNone = 5] = "ClarityAbiTypeNone", e[e.ClarityAbiTypeBuffer = 6] = "ClarityAbiTypeBuffer", e[e.ClarityAbiTypeResponse = 7] = "ClarityAbiTypeResponse", e[e.ClarityAbiTypeOptional = 8] = "ClarityAbiTypeOptional", e[e.ClarityAbiTypeTuple = 9] = "ClarityAbiTypeTuple", e[e.ClarityAbiTypeList = 10] = "ClarityAbiTypeList", e[e.ClarityAbiTypeStringAscii = 11] = "ClarityAbiTypeStringAscii", e[e.ClarityAbiTypeStringUtf8 = 12] = "ClarityAbiTypeStringUtf8", e[e.ClarityAbiTypeTraitReference = 13] = "ClarityAbiTypeTraitReference";
})(be || (be = {}));
const Uc = (e) => typeof e == "string", Pc = (e) => e.buffer !== void 0, Oc = (e) => e["string-ascii"] !== void 0, Nc = (e) => e["string-utf8"] !== void 0, Mc = (e) => e.response !== void 0, Dc = (e) => e.optional !== void 0, Fc = (e) => e.tuple !== void 0, jc = (e) => e.list !== void 0;
function qd(e) {
  if (Uc(e)) {
    if (e === "uint128")
      return { id: be.ClarityAbiTypeUInt128, type: e };
    if (e === "int128")
      return { id: be.ClarityAbiTypeInt128, type: e };
    if (e === "bool")
      return { id: be.ClarityAbiTypeBool, type: e };
    if (e === "principal")
      return { id: be.ClarityAbiTypePrincipal, type: e };
    if (e === "trait_reference")
      return { id: be.ClarityAbiTypeTraitReference, type: e };
    if (e === "none")
      return { id: be.ClarityAbiTypeNone, type: e };
    throw new Error(`Unexpected Clarity ABI type primitive: ${JSON.stringify(e)}`);
  } else {
    if (Pc(e))
      return { id: be.ClarityAbiTypeBuffer, type: e };
    if (Mc(e))
      return { id: be.ClarityAbiTypeResponse, type: e };
    if (Dc(e))
      return { id: be.ClarityAbiTypeOptional, type: e };
    if (Fc(e))
      return { id: be.ClarityAbiTypeTuple, type: e };
    if (jc(e))
      return { id: be.ClarityAbiTypeList, type: e };
    if (Oc(e))
      return { id: be.ClarityAbiTypeStringAscii, type: e };
    if (Nc(e))
      return { id: be.ClarityAbiTypeStringUtf8, type: e };
    throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(e)}`);
  }
}
function Ln(e) {
  if (Uc(e))
    return e === "int128" ? "int" : e === "uint128" ? "uint" : e;
  if (Pc(e))
    return `(buff ${e.buffer.length})`;
  if (Oc(e))
    return `(string-ascii ${e["string-ascii"].length})`;
  if (Nc(e))
    return `(string-utf8 ${e["string-utf8"].length})`;
  if (Mc(e))
    return `(response ${Ln(e.response.ok)} ${Ln(e.response.error)})`;
  if (Dc(e))
    return `(optional ${Ln(e.optional)})`;
  if (Fc(e))
    return `(tuple ${e.tuple.map((t) => `(${t.name} ${Ln(t.type)})`).join(" ")})`;
  if (jc(e))
    return `(list ${e.list.length} ${Ln(e.list.type)})`;
  throw new Error(`Type string unsupported for Clarity type: ${JSON.stringify(e)}`);
}
function $n(e, t) {
  const n = qd(t);
  switch (e.type) {
    case F.BoolTrue:
    case F.BoolFalse:
      return n.id === be.ClarityAbiTypeBool;
    case F.Int:
      return n.id === be.ClarityAbiTypeInt128;
    case F.UInt:
      return n.id === be.ClarityAbiTypeUInt128;
    case F.Buffer:
      return n.id === be.ClarityAbiTypeBuffer && n.type.buffer.length >= e.buffer.length;
    case F.StringASCII:
      return n.id === be.ClarityAbiTypeStringAscii && n.type["string-ascii"].length >= e.data.length;
    case F.StringUTF8:
      return n.id === be.ClarityAbiTypeStringUtf8 && n.type["string-utf8"].length >= e.data.length;
    case F.OptionalNone:
      return n.id === be.ClarityAbiTypeNone || n.id === be.ClarityAbiTypeOptional;
    case F.OptionalSome:
      return n.id === be.ClarityAbiTypeOptional && $n(e.value, n.type.optional);
    case F.ResponseErr:
      return n.id === be.ClarityAbiTypeResponse && $n(e.value, n.type.response.error);
    case F.ResponseOk:
      return n.id === be.ClarityAbiTypeResponse && $n(e.value, n.type.response.ok);
    case F.PrincipalContract:
      return n.id === be.ClarityAbiTypePrincipal || n.id === be.ClarityAbiTypeTraitReference;
    case F.PrincipalStandard:
      return n.id === be.ClarityAbiTypePrincipal;
    case F.List:
      return n.id == be.ClarityAbiTypeList && n.type.list.length >= e.list.length && e.list.every((r) => $n(r, n.type.list.type));
    case F.Tuple:
      if (n.id == be.ClarityAbiTypeTuple) {
        const r = ui(e.data);
        for (let i = 0; i < n.type.tuple.length; i++) {
          const s = n.type.tuple[i], o = s.name, c = r[o];
          if (c) {
            if (!$n(c, s.type))
              return !1;
            delete r[o];
          } else
            return !1;
        }
        return !0;
      } else
        return !1;
    default:
      return !1;
  }
}
function Xd(e, t) {
  const n = t.functions.filter((r) => r.name === e.functionName.content);
  if (n.length === 1) {
    const i = n[0].args;
    if (e.functionArgs.length !== i.length)
      throw new Error(`Clarity function expects ${i.length} argument(s) but received ${e.functionArgs.length}`);
    for (let s = 0; s < e.functionArgs.length; s++) {
      const o = e.functionArgs[s], c = i[s];
      if (!$n(o, c.type)) {
        const f = s + 1;
        throw new Error(`Clarity function \`${e.functionName.content}\` expects argument ${f} to be of type ${Ln(c.type)}, not ${_t(o)}`);
      }
    }
    return !0;
  } else throw n.length === 0 ? new Error(`ABI doesn't contain a function with the name ${e.functionName.content}`) : new Error(`Malformed ABI. Contains multiple functions with the name ${e.functionName.content}`);
}
function Zd(e, t, n) {
  return typeof e == "string" && (e = x0(e)), {
    type: X.PostCondition,
    conditionType: De.STX,
    principal: e,
    conditionCode: t,
    amount: Le(n, !1)
  };
}
class $s {
  constructor(t, n, r, i, s, o, c) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Le(r.amount, !1)
    } : this.payload = r, this.chainId = c ?? al, this.postConditionMode = s ?? yn.Deny, this.postConditions = i ?? vi([]), o)
      this.anchorMode = ll(o);
    else
      switch (r.payloadType) {
        case he.Coinbase:
        case he.CoinbaseToAltRecipient:
        case he.NakamotoCoinbase:
        case he.PoisonMicroblock:
        case he.TenureChange:
          this.anchorMode = Ne.OnChainOnly;
          break;
        case he.ContractCall:
        case he.SmartContract:
        case he.VersionedSmartContract:
        case he.TokenTransfer:
          this.anchorMode = Ne.Any;
          break;
      }
  }
  signBegin() {
    const t = ui(this);
    return t.auth = Mo(t.auth), t.txid();
  }
  verifyBegin() {
    const t = ui(this);
    return t.auth = Mo(t.auth), t.txid();
  }
  verifyOrigin() {
    return Ld(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Ee.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Ee.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Ee.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !br(n)) {
      const r = Qn(t);
      n.fields.push(Un(r ? Ae.Compressed : Ae.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, i) {
    const { nextSig: s, nextSigHash: o } = Cd(n, r, t.fee, t.nonce, i);
    return br(t) ? t.signature = s : t.fields.push(Un(i.data.byteLength === Sa ? Ae.Compressed : Ae.Uncompressed, s)), o;
  }
  txid() {
    const t = this.serialize();
    return Is(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Ee.Sponsored)
      throw new fi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Od(this.auth, t);
  }
  setFee(t) {
    this.auth = $d(this.auth, t);
  }
  setNonce(t) {
    this.auth = Ud(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Ee.Sponsored)
      throw new fi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Pd(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new cn('"version" is undefined');
    if (this.chainId === void 0)
      throw new cn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new cn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new cn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new cn('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return bn(n, this.chainId, 0), t.push(n), t.push(Nd(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Ts(this.postConditions)), t.push(Cs(this.payload)), _e(t);
  }
}
function Yd(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new hr(ve(e.slice(2))) : t = new hr(ve(e)) : e instanceof Uint8Array ? t = new hr(e) : t = e;
  const n = t.readUInt8Enum(Jt, (g) => {
    throw new Error(`Could not parse ${g} as TransactionVersion`);
  }), r = t.readUInt32BE(), i = Md(t), s = t.readUInt8Enum(Ne, (g) => {
    throw new Error(`Could not parse ${g} as AnchorMode`);
  }), o = t.readUInt8Enum(yn, (g) => {
    throw new Error(`Could not parse ${g} as PostConditionMode`);
  }), c = Ec(t, X.PostCondition), f = K0(t);
  return new $s(n, i, f, c, o, s, r);
}
async function Jd(e, t) {
  const n = `${t.coreApiUrl}/extended/v1/address/${e}/nonces`, i = await (await t.fetchFn(n)).json();
  return BigInt(i.possible_next_nonce);
}
async function Vc(e, t) {
  const n = at.fromNameOrNetwork(t ?? new tn()), r = n.getAccountApiUrl(e);
  try {
    return await Jd(e, n);
  } catch {
  }
  const i = await n.fetchFn(r);
  if (!i.ok) {
    let c = "";
    try {
      c = await i.text();
    } catch {
    }
    throw new Error(`Error fetching nonce. Response ${i.status}: ${i.statusText}. Attempted to fetch ${r} and failed with the message: "${c}"`);
  }
  const s = await i.text(), o = JSON.parse(s);
  return BigInt(o.nonce);
}
async function Qd(e, t) {
  const r = {
    method: "GET",
    headers: {
      Accept: "application/text"
    }
  }, i = at.fromNameOrNetwork(t ?? n1(e)), s = i.getTransferFeeEstimateApiUrl(), o = await i.fetchFn(s, r);
  if (!o.ok) {
    let p = "";
    try {
      p = await o.text();
    } catch {
    }
    throw new Error(`Error estimating transaction fee. Response ${o.status}: ${o.statusText}. Attempted to fetch ${s} and failed with the message: "${p}"`);
  }
  const c = await o.text(), f = BigInt(e.serialize().byteLength);
  return BigInt(c) * f;
}
async function e1(e, t, n) {
  var f;
  const r = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_payload: le(Cs(e)),
      ...t ? { estimated_len: t } : {}
    })
  }, i = at.fromNameOrNetwork(n ?? new tn()), s = i.getTransactionFeeEstimateApiUrl(), o = await i.fetchFn(s, r);
  if (!o.ok) {
    const g = await o.text().then((p) => {
      try {
        return JSON.parse(p);
      } catch {
        return p;
      }
    });
    throw (g == null ? void 0 : g.reason) === "NoEstimateAvailable" || typeof g == "string" && g.includes("NoEstimateAvailable") ? new xc(((f = g == null ? void 0 : g.reason_data) == null ? void 0 : f.message) ?? "") : new Error(`Error estimating transaction fee. Response ${o.status}: ${o.statusText}. Attempted to fetch ${s} and failed with the message: "${g}"`);
  }
  return (await o.json()).estimations;
}
async function t1(e, t, n) {
  const r = {
    method: "GET"
  }, i = at.fromNameOrNetwork(n), s = i.getAbiApiUrl(e, t), o = await i.fetchFn(s, r);
  if (!o.ok) {
    const c = await o.text().catch(() => "");
    throw new Error(`Error fetching contract ABI for contract "${t}" at address ${e}. Response ${o.status}: ${o.statusText}. Attempted to fetch ${s} and failed with the message: "${c}"`);
  }
  return JSON.parse(await o.text());
}
function n1(e) {
  switch (e.version) {
    case Jt.Mainnet:
      return new tn();
    case Jt.Testnet:
      return new Lc();
  }
}
async function r1(e) {
  const t = {
    fee: BigInt(0),
    nonce: BigInt(0),
    network: new tn(),
    memo: "",
    sponsored: !1
  }, n = Object.assign(t, e), r = wc(n.recipient, n.amount, n.memo);
  let i = null, s = null;
  if ("publicKey" in n)
    s = Ai(de.SerializeP2PKH, n.publicKey, n.nonce, n.fee);
  else {
    const f = n.useNonSequentialMultiSig ? de.SerializeP2SHNonSequential : de.SerializeP2SH, g = n.address ? zc(n.publicKeys, n.numSignatures, f, Hn(n.address).hash160) : n.publicKeys;
    s = Cc(f, n.numSignatures, g, n.nonce, n.fee);
  }
  n.sponsored ? i = Ei(s) : i = Si(s);
  const o = at.fromNameOrNetwork(n.network), c = new $s(o.version, i, r, void 0, void 0, n.anchorMode, o.chainId);
  if (e.fee === void 0 || e.fee === null) {
    const f = await Rc(c, o);
    c.setFee(f);
  }
  if (e.nonce === void 0 || e.nonce === null) {
    const f = n.network.version === Jt.Mainnet ? Qt.MainnetSingleSig : Qt.TestnetSingleSig, g = Jn.c32address(f, c.auth.spendingCondition.signer), p = await Vc(g, n.network);
    c.setNonce(p);
  }
  return c;
}
async function i1(e) {
  const t = {
    fee: BigInt(0),
    nonce: BigInt(0),
    network: new tn(),
    postConditionMode: yn.Deny,
    sponsored: !1
  }, n = Object.assign(t, e), r = mc(n.contractAddress, n.contractName, n.functionName, n.functionArgs);
  if (n != null && n.validateWithAbi) {
    let p;
    if (typeof n.validateWithAbi == "boolean")
      if (n != null && n.network)
        p = await t1(n.contractAddress, n.contractName, n.network);
      else
        throw new Error("Network option must be provided in order to validate with ABI");
    else
      p = n.validateWithAbi;
    Xd(r, p);
  }
  let i = null, s = null;
  if ("publicKey" in n)
    i = Ai(de.SerializeP2PKH, n.publicKey, n.nonce, n.fee);
  else {
    const p = n.useNonSequentialMultiSig ? de.SerializeP2SHNonSequential : de.SerializeP2SH, h = n.address ? zc(n.publicKeys, n.numSignatures, p, Hn(n.address).hash160) : n.publicKeys;
    i = Cc(p, n.numSignatures, h, n.nonce, n.fee);
  }
  n.sponsored ? s = Ei(i) : s = Si(i);
  const o = at.fromNameOrNetwork(n.network), c = [];
  n.postConditions && n.postConditions.length > 0 && n.postConditions.forEach((p) => {
    c.push(p);
  });
  const f = vi(c), g = new $s(o.version, s, r, f, n.postConditionMode, n.anchorMode, o.chainId);
  if (e.fee === void 0 || e.fee === null) {
    const p = await Rc(g, o);
    g.setFee(p);
  }
  if (e.nonce === void 0 || e.nonce === null) {
    const p = o.version === Jt.Mainnet ? Qt.MainnetSingleSig : Qt.TestnetSingleSig, h = Jn.c32address(p, g.auth.spendingCondition.signer), m = await Vc(h, o);
    g.setNonce(m);
  }
  return g;
}
function s1(e, t, n) {
  return Zd(fc(e), t, n);
}
function o1(e) {
  const t = e.auth.spendingCondition.hashMode;
  if ([de.SerializeP2SH, de.SerializeP2WSH].includes(t)) {
    const r = e.auth.spendingCondition, i = r.fields.filter((o) => o.contents.type === X.MessageSignature).length, s = (r.signaturesRequired - i) * (Ir + 1);
    return e.serialize().byteLength + s;
  } else
    return e.serialize().byteLength;
}
async function Rc(e, t) {
  try {
    const n = o1(e);
    return (await e1(e.payload, n, t))[1].fee;
  } catch (n) {
    if (n instanceof xc)
      return await Qd(e, t);
    throw n;
  }
}
function zc(e, t, n, r) {
  if (zn(0, n, t, e.map(It)).hash160 === r)
    return e;
  const s = e.slice().sort();
  if (zn(0, n, t, s.map(It)).hash160 === r)
    return s;
  throw new Error("Failed to find matching multi-sig address given public-keys.");
}
const qn = lc, a1 = uc, Us = dc, c1 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", f1 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", Gc = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function u1(e) {
  var n, r, i, s;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((i = t["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = t["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || Gc.some((o, c) => {
    var f;
    return ((f = t["core-" + (c + 1)]) == null ? void 0 : f.value) !== c1 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const h1 = "xtrata-radio-test-wallet-v1", Bi = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", yr = 50n, hi = 1000n;
function wr(e) {
  if (!/^(0|[1-9]\d*)(\.\d{1,6})?$/.test(e)) throw Error("Use STX with up to six decimal places.");
  const [t, n = ""] = e.split(".");
  return BigInt(t) * 1000000n + BigInt(n.padEnd(6, "0"));
}
function We(e) {
  const t = BigInt(e);
  return `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0")}`;
}
function Wc(e) {
  const t = wr(e);
  if (t < 1n || t > 10000n) throw Error("For this canary, choose a fee from 0.000001 to 0.01 STX.");
  return t;
}
function l1(e, t = Date.now()) {
  if (!/^\d+$/.test(e.fee) || BigInt(e.fee) < 1n || BigInt(e.fee) > 10000n || !/^\d+$/.test(e.budget) || BigInt(e.budget) > 1000000n || BigInt(e.budget) < BigInt(e.fee) + yr) throw Error("Invalid fee or budget (maximum 1 STX).");
  if (!Number.isInteger(e.max) || e.max < 1 || e.max > 20 || !Number.isFinite(e.expires) || e.expires <= t || e.expires > t + 30 * 6e4 || ![1, 2, 3].includes(e.core) || !e.songs.length || e.songs.length > 20 || e.songs.some((n) => !Number.isSafeInteger(n) || n < 0)) throw Error("Invalid test session. Maximum 20 starts and 30 minutes.");
}
const gn = (e) => !["confirmed", "failed", "cancelled"].includes(e.status);
function Kc(e) {
  return e.map(({ raw: t, ...n }) => n);
}
class Ps {
  constructor(t) {
    Mi(this, "used", 0n);
    Mi(this, "count", 0);
    this.policy = t, l1(t);
  }
  consume(t, n, r, i = Date.now()) {
    const s = this.policy, o = r + yr;
    if (i >= s.expires || this.count >= s.max || r !== BigInt(s.fee) || t !== s.core || !s.songs.includes(n) || this.used + o > BigInt(s.budget)) throw Error("Test session limit reached or terms changed.");
    this.used += o, this.count++;
  }
}
const [mr, Os] = Bi.split("."), Ht = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function xr(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function d1(e) {
  return Ht(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function vr(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Ns(e, t = []) {
  const n = await vr(`/v2/contracts/call-read/${mr}/${Os}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: mr, arguments: t.map((r) => "0x" + Ht(Me(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return an(ut(n.result));
}
async function qc() {
  const e = await vr(`/v2/contracts/source/${mr}/${Os}?proof=0`);
  if (typeof e.source != "string" || await d1(e.source) !== f1) throw Error("Deployed source does not match the tested helper.");
  if (u1(await Ns("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Hi(e) {
  return e.startsWith("SP") && Ad(e) && !e.includes(".");
}
async function Xc(e) {
  var r;
  if (!Hi(e)) throw Error("Invalid mainnet wallet address.");
  const t = await vr(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await vr(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function p1(e) {
  const t = await vr(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function g1(e, t) {
  var i, s;
  const n = await Ns("get-owner", [qn(e), qn(t)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Hi(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
function b1(e, t, n, r, i, s, o) {
  if (![1, 2, 3].includes(n) || !Number.isSafeInteger(r) || r < 0 || !/^[0-9a-f]{32}$/.test(i)) throw Error("Invalid play request.");
  return { contractAddress: mr, contractName: Os, functionName: "play", functionArgs: [qn(n), qn(r), Us(xr(i))], publicKey: t, fee: s, nonce: o, network: new tn(), anchorMode: Ne.Any, postConditionMode: yn.Deny, postConditions: [s1(e, Vn.Equal, 50n)] };
}
async function Ms(e, t, n, r, i, s) {
  await qc();
  const o = await Xc(e), c = await g1(n, r);
  if (c === e) throw Error("Your test wallet holds this master; self-payment is not supported.");
  const f = await i1(b1(e, t, n, r, i, s, o.nonce));
  return { recipient: c, nonce: o.nonce.toString(), balance: o.balance.toString(), bytes: f.serialize().length };
}
async function y1(e, t, n, r, i) {
  if (i < 1n || i > 10000n) throw Error("Withdrawal fee outside test limits.");
  if (!Hi(n) || n === e || r <= 0n) throw Error("Choose a different standard mainnet recipient and positive amount.");
  const s = await Xc(e);
  if (r + i > s.balance) throw Error("Insufficient balance for amount plus fee.");
  const o = await r1({ recipient: n, amount: r, fee: i, nonce: s.nonce, publicKey: t, network: new tn(), memo: "Radio test withdrawal", anchorMode: Ne.Any });
  return { nonce: s.nonce.toString(), bytes: o.serialize().length };
}
async function w1(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: xr(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const i = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(i, { feeRejected: !0 }), i;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function m1(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
const x1 = (e) => mr + "." + Gc[e - 1];
function v1(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = Yd(xr(e.raw)), n = t.auth, r = t.payload, i = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || ur(or(Qt.MainnetSingleSig, i.signer)) !== e.address || i.fee !== BigInt(e.fee) || i.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const s = t.postConditions.values[0];
    if (r.payloadType !== 2 || ur(r.contractAddress) + "." + r.contractName.content !== Bi || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Ht(Me(r.functionArgs[0])) !== Ht(Me(qn(e.core))) || Ht(Me(r.functionArgs[1])) !== Ht(Me(qn(e.song))) || Ht(Me(r.functionArgs[2])) !== Ht(Me(Us(xr(e.id)))) || e.amount !== "50" || t.postConditionMode !== yn.Deny || t.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== Vn.Equal || s.principal.prefix !== 2 || ur(s.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (r.payloadType !== 0 || an(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
new TextEncoder();
function Zc(e) {
  const t = e;
  if (!t || t.version !== 1 || t.network !== "mainnet" || t.iterations !== 6e5 || !Hi(t.address) || !/^(02|03)[0-9a-f]{64}$/.test(t.publicKey) || !/^[0-9a-f]{32}$/.test(t.salt) || !/^[0-9a-f]{24}$/.test(t.iv) || typeof t.ciphertext != "string" || t.ciphertext.length > 4096 || !/^(?:[0-9a-f]{2})+$/.test(t.ciphertext)) throw Error("Not a supported encrypted listening-wallet backup.");
  return t;
}
async function Yc() {
  return new Promise((e, t) => {
    const n = indexedDB.open(h1, 1);
    n.onupgradeneeded = () => n.result.createObjectStore("data"), n.onsuccess = () => e(n.result), n.onerror = () => t(Error("Local wallet storage unavailable."));
  });
}
async function Ar(e) {
  const t = await Yc();
  try {
    return await new Promise((n, r) => {
      const i = t.transaction("data").objectStore("data").get(e);
      i.onsuccess = () => n(i.result), i.onerror = () => r(i.error);
    });
  } finally {
    t.close();
  }
}
async function Xn(e, t) {
  const n = await Yc();
  try {
    await new Promise((r, i) => {
      const s = n.transaction("data", "readwrite");
      s.objectStore("data").put(t, e), s.oncomplete = () => r(), s.onerror = () => i(s.error), s.onabort = () => i(Error("Wallet storage write failed."));
    });
  } finally {
    n.close();
  }
}
const A1 = () => Ar("entries").then((e) => e || []), S1 = (e) => e.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (t, n) => {
  const r = n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : parseInt(n, 10);
  return r > 0 && r <= 1114111 ? String.fromCodePoint(r) : "";
}).replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"), nt = (e) => typeof e == "string" ? S1(e).replace(/<[^>]*>/g, "").trim().slice(0, 200) : "";
function E1(e) {
  var o, c, f, g, p, h, m, w;
  let t = "", n = "", r = "";
  for (const T of e.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))
    if (/application\/(?:ld\+)?json/i.test(T[1]))
      try {
        const k = JSON.parse(T[2]), $ = k.metadata || k;
        t || (t = nt($.title || $.name)), n || (n = nt($.artist) || nt((o = $.byArtist) == null ? void 0 : o.name)), r || (r = nt($.album) || nt((c = $.album) == null ? void 0 : c.name) || nt((f = $.inAlbum) == null ? void 0 : f.name) || nt($.inAlbum));
      } catch {
      }
  t || (t = nt((g = e.match(/<title[^>]*>([\s\S]*?)<\/title>/i)) == null ? void 0 : g[1]));
  const i = (p = e.match(/"artist"\s*:\s*("(?:\\.|[^"\\])*")/i)) == null ? void 0 : p[1];
  try {
    i && (n || (n = nt(JSON.parse(i))));
  } catch {
  }
  n || (n = nt((h = e.match(/<(?:p|span|div)\b[^>]*class=["'][^"']*\bartist\b[^"']*["'][^>]*>([^<]*)</i)) == null ? void 0 : h[1]));
  const s = (m = e.match(/"album"\s*:\s*("(?:\\.|[^"\\])*")/i)) == null ? void 0 : m[1];
  try {
    s && (r || (r = nt(JSON.parse(s))));
  } catch {
  }
  return r || (r = nt((w = e.match(/<(?:p|span|div)\b[^>]*class=["'][^"']*\balbum\b[^"']*["'][^>]*>([^<]*)</i)) == null ? void 0 : w[1])), { title: t, artist: n, album: r };
}
async function B1(e, t) {
  var c;
  const n = `/runtime/content?contractId=${encodeURIComponent(x1(e))}&tokenId=${t}&network=mainnet`, r = await fetch(n, { signal: AbortSignal.timeout(3e4) });
  if (!r.ok) throw Error(`Song content HTTP ${r.status}`);
  const i = r.headers.get("content-type") || "";
  if (i.startsWith("audio/"))
    return await ((c = r.body) == null ? void 0 : c.cancel()), { src: n + "&m=1", title: `Inscription #${t}` };
  if (!i.includes("text/html")) throw Error("This inscription is not recognised audio.");
  const s = await r.text();
  if (s.length > 32 * 1024 * 1024) throw Error("Player too large for this canary.");
  const o = s.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
  if (!o) throw Error("No embedded audio found. Select a direct master, not an album pointer.");
  return { src: o[1].replace(/&amp;/g, "&"), title: E1(s).title || `Inscription #${t}` };
}
const ee = (e) => document.getElementById(e), Ke = (e) => ee(e).value, Be = (e) => {
  ee("status").textContent = e;
};
let ne, Xt = !1, Pr = !1, Ct = !1, kt = !1, Je = [], lr = 0n, Fo, dt = 0, je = null, Sr = 0, qe = null, Ki = 0, Tt = [], Er = new yu(), H1 = 0, Jc = !1;
const Br = /* @__PURE__ */ new Map();
Er.onmessage = (e) => {
  const t = Br.get(e.data.id);
  t && (Br.delete(e.data.id), e.data.error ? t.reject(Error(e.data.error)) : t.resolve(e.data.result));
};
Er.onerror = () => {
  Jc = !0;
  for (const e of Br.values()) e.reject(Error("Signer stopped. Lock and reload to recover."));
  Br.clear(), Er.terminate(), dt++, je = null, Pr = !1, gt(), Be("Signer stopped. Reload to unlock and reconcile.");
};
function nn(e, t = {}) {
  return Jc ? Promise.reject(Error("Signer could not load. Reload after checking the deployed worker asset.")) : new Promise((n, r) => {
    const i = ++H1;
    Br.set(i, { resolve: n, reject: r }), Er.postMessage({ id: i, op: e, data: t });
  });
}
function fs() {
  if (!Ct) throw Error("Another test-wallet tab is active. Close it and reload here.");
  if (!ne || !Pr || !Xt) throw Error("Unlock the wallet and verify its backup first.");
}
function vn() {
  if (fs(), Je.some(gn)) throw Error("An earlier transaction is unresolved. Use Reconcile before starting another.");
}
function pt() {
  return Xn("entries", Je);
}
function Qc(e, t) {
  const n = URL.createObjectURL(new Blob([JSON.stringify(t, null, 2)], { type: "application/json" })), r = document.createElement("a");
  r.href = n, r.download = e, r.click(), setTimeout(() => URL.revokeObjectURL(n), 1e4);
}
function gt() {
  if (ee("mode").textContent = `${je ? "AUTOMATIC TEST ACTIVE" : "Automatic spending OFF"} · Wallet ${Pr ? "unlocked" : "locked"}${Ct ? "" : " · Read-only tab"}`, ee("backup-status").textContent = Xt ? "Encrypted backup verified. Keep it and the password somewhere safe." : "Download the encrypted backup, then select that file above to verify it with your password before funding.", ee("funding").hidden = !ne || !Xt, ee("funding-wait").hidden = !!ne && Xt, ne && Xt) {
    ee("address").textContent = ne.address;
    const t = bu(0, "M");
    t.addData(ne.address), t.make(), ee("qr").innerHTML = t.createImgTag(4, 4), ee("qr").querySelector("img").alt = "Listening wallet mainnet address";
  }
  const e = Je.filter(gn).reduce((t, n) => t + BigInt(n.fee) + BigInt(n.amount), 0n);
  ee("balance").textContent = ne ? We(lr) + " STX" : "—", ee("reserved").textContent = We(e) + " STX", ee("available").textContent = We(lr > e + hi ? lr - e - hi : 0n) + " STX", ee("session-status").textContent = je ? `Up to ${je.max} starts · ${Sr} attempted · ${We(je.budget)} STX maximum · ends ${new Date(je.expires).toLocaleTimeString()}` : "No spending authorised. Broadcast transactions may still confirm.";
  for (const t of ["create", "unlock", "backup", "preview", "session", "withdraw", "resend", "free"]) ee(t).disabled = kt || !Ct || t === "create" && !!ne || t === "unlock" && !ne || t === "backup" && !ne;
  ee("restore").disabled = kt || !Ct, ee("history").replaceChildren();
  for (const t of [...Je].reverse()) {
    const n = document.createElement("tr"), r = [new Date(t.created).toLocaleString(), t.kind === "play" ? `Core ${t.core} / #${t.song}` : "Withdrawal", t.status + (t.note ? " · " + t.note : ""), We(t.fee), t.actualFee ? We(t.actualFee) : "—", We(t.amount), t.recipient, t.confirmedAt ? `${((t.confirmedAt - t.created) / 1e3).toFixed(0)}s (observed)` : "—"];
    for (const s of r) {
      const o = document.createElement("td");
      o.textContent = s, n.append(o);
    }
    const i = document.createElement("td");
    if (t.txid) {
      const s = document.createElement("a");
      s.href = `https://explorer.hiro.so/txid/${encodeURIComponent(t.txid)}?chain=mainnet`, s.target = "_blank", s.rel = "noopener noreferrer", s.textContent = t.txid.slice(0, 12) + "…", i.append(s);
    }
    n.append(i), ee("history").append(n);
  }
}
async function Or(e) {
  if (!kt) {
    kt = !0, gt();
    try {
      await e();
    } catch (t) {
      je && await Qe(), Be(t instanceof Error ? t.message : "Operation failed.");
    } finally {
      kt = !1, gt(), Fs();
    }
  }
}
function Ve(e, t) {
  ee(e).onclick = () => void Or(t);
}
async function Qe(e = !1) {
  dt++, je = null, Sr = 0, e && (Pr = !1), await nn(e ? "lock" : "stop"), gt();
}
ee("stop").onclick = () => {
  Qe(), Be("New paid starts stopped. Audio can continue free; submitted payments may still confirm.");
};
ee("lock").onclick = () => {
  Qe(!0), Be("Wallet locked. No new signing is authorised.");
};
ee("password").onkeydown = (e) => {
  e.key === "Enter" && ee("unlock").click();
};
Ve("create", async () => {
  if (ne) throw Error("A wallet already exists. Back it up rather than replacing it.");
  const e = await nn("create", { password: Ke("password") });
  await Xn("vault", e), ne = e, ee("password").value = "", Be("Wallet created and locked. Download your backup, then select it to verify before funding.");
});
Ve("unlock", async () => {
  if (!ne) throw Error("Create or restore a wallet first.");
  await nn("open", { vault: ne, password: Ke("password") }), ee("password").value = "", Pr = !0, Be("Unlocked. Spending is still OFF."), clearTimeout(Fo), Fo = setTimeout(() => void Qe(!0), 30 * 6e4);
});
Ve("backup", async () => {
  if (!ne) throw Error("No wallet to back up.");
  Qc("xtrata-listening-wallet-encrypted.json", ne), Be("Backup downloaded. Select that file above and enter your password to verify it.");
});
ee("restore").onchange = () => void Or(async () => {
  var r;
  const e = (r = ee("restore").files) == null ? void 0 : r[0];
  if (!e) return;
  if (e.size > 8192) throw Error("Backup too large.");
  const t = Zc(JSON.parse(await e.text()));
  if (ne && ne.address !== t.address) throw Error("This browser already has a different wallet. Use a separate browser profile to restore this backup.");
  if ((await nn("verify-backup", { vault: t, password: Ke("password") })).address !== t.address) throw Error("Backup address mismatch.");
  ne || (await Xn("vault", t), ne = t), await Xn("backupVerified", ne.address), Xt = !0, ee("password").value = "", ee("restore").value = "", Be("Backup verified. This is your real mainnet funding address. Send 1 STX manually when ready; no spending starts automatically."), await li();
});
Ve("copy", async () => {
  if (!ne || !Xt) throw Error("Verify your backup first.");
  await navigator.clipboard.writeText(ne.address), Be("Funding address copied. Use Stacks mainnet.");
});
async function li() {
  ne && (lr = await p1(ne.address), ee("deposit-status").textContent = lr > 0n ? "Confirmed funds detected. They stay in your wallet until you approve a test." : "No confirmed funds yet. If you just sent a deposit, wait and refresh."), gt();
}
Ve("refresh", async () => {
  await Zn(), await li();
});
function Ds() {
  const e = Number(Ke("core")), t = Number(Ke("song")), n = Wc(Ke("fee"));
  if (![1, 2, 3].includes(e) || !/^\d+$/.test(Ke("song")) || !Number.isSafeInteger(t)) throw Error("Enter a valid master core and inscription ID.");
  return { core: e, song: t, fee: n };
}
function _i() {
  return Ht(crypto.getRandomValues(new Uint8Array(16)));
}
let Hr = null;
function Ci(e, t, n, r = !1) {
  ee("review-title").textContent = e, ee("review-text").textContent = t, ee("low-fee-row").hidden = !r, ee("low-fee").checked = !1, Hr = n, ee("review").showModal();
}
ee("cancel").onclick = () => {
  Hr = null, ee("review").close();
};
ee("review").onclose = () => {
  Hr = null;
};
ee("approve").onclick = () => {
  if (!ee("low-fee-row").hidden && !ee("low-fee").checked) {
    Be("Acknowledge the below-baseline fee before approving.");
    return;
  }
  const e = Hr;
  Hr = null, ee("review").close(), e && Or(e);
};
function ef(e, t, n) {
  return `Network: Stacks MAINNET
Listening wallet: ${ne.address}
Master holder now: ${t}
Holder payment: 0.000050 STX
Network fee: ${We(e)} STX
Total per start: ${We(e + yr)} STX
Transaction size: ${n} bytes
No treasury deduction or automatic fee increase.
If the master is sold while pending, its holder at execution receives the payment.
A confirmed failed transaction can still cost its network fee.`;
}
Ve("preview", async () => {
  vn();
  const e = Ds(), t = _i(), n = await Ms(ne.address, ne.publicKey, e.core, e.song, t, e.fee);
  if (BigInt(n.balance) < e.fee + yr + hi) throw Error("Fund the wallet first; retain 0.001 STX for recovery.");
  Ci("Approve ONE paid play", `Song #${e.song} · core ${e.core}
${ef(e.fee, n.recipient, n.bytes)}
Audio must begin before a transaction is signed. This approval lasts five minutes.`, async () => {
    vn(), await tf({ fee: e.fee.toString(), budget: (e.fee + yr).toString(), max: 1, expires: Date.now() + 5 * 6e4, core: e.core, songs: [e.song] }), Tt = [e.song], await Nr(e.core, e.song);
  }, e.fee < BigInt(n.bytes));
});
async function tf(e) {
  vn(), new Ps(e), await nn("arm", e), je = e, Sr = 0, dt++, gt();
}
Ve("session", async () => {
  vn();
  const e = Ds(), t = Ke("playlist").split(",").map((o) => o.trim());
  if (t.some((o) => !/^\d+$/.test(o))) throw Error("Use comma-separated inscription IDs.");
  const n = t.map(Number), r = Number(Ke("minutes"));
  if (!Number.isInteger(r) || r < 1 || r > 30) throw Error("Use 1–30 minutes.");
  const i = { fee: e.fee.toString(), budget: wr(Ke("budget")).toString(), max: Number(Ke("max")), expires: Date.now() + r * 6e4, core: e.core, songs: n };
  new Ps(i);
  const s = await Ms(ne.address, ne.publicKey, i.core, n[0], _i(), e.fee);
  if (e.fee < BigInt(s.bytes)) throw Error("Below-baseline fees are available for a single explicit test only. Raise the fee for automatic sessions.");
  if (BigInt(s.balance) < BigInt(i.budget) + hi) throw Error("Session budget exceeds your available balance after the recovery reserve.");
  Ci("Approve limited automatic test", `${ef(e.fee, s.recipient, s.bytes)}
Playlist IDs: ${n.join(", ")}
Maximum paid starts: ${i.max}
Maximum spend: ${We(i.budget)} STX
Expires in ${r} minutes.
One unresolved payment at a time. Skips after audio starts remain payable.`, async () => {
    vn(), await tf({ ...i, expires: Date.now() + r * 6e4 }), Tt = n, await Nr(i.core, n[0]);
  });
});
const ot = ee("audio");
async function Nr(e, t, n = !1) {
  const r = ++Ki;
  ot.pause(), qe = null;
  const i = await B1(e, t);
  if (r !== Ki) return;
  const s = n ? await Ar("playback") : null, o = { id: t, core: e, receipt: n && (s == null ? void 0 : s.id) === t && (s == null ? void 0 : s.core) === e ? s.receipt : _i(), charged: n };
  await Xn("playback", { ...o, position: n && (s == null ? void 0 : s.position) || 0 }), r === Ki && (qe = o, ot.src = i.src, ot.currentTime = n && (s == null ? void 0 : s.position) || 0, ee("now").textContent = i.title, await ot.play());
}
Ve("free", async () => {
  await Qe();
  const e = Ds();
  Tt = [e.song], await Nr(e.core, e.song), Be("Free listening. No payment is authorised.");
});
async function nf() {
  if (!qe) return;
  const e = Tt.indexOf(qe.id), t = Tt[e + 1] ?? Tt[0] ?? qe.id;
  await Nr(qe.core, t);
}
Ve("next", nf);
Ve("resume", async () => {
  await Qe();
  const e = await Ar("playback");
  if (!e) throw Error("No previous song saved in this browser.");
  Tt = [e.id], await Nr(e.core, e.id, !0), Be("Resumed without a payment.");
});
ot.onended = () => {
  ((qe ? Tt.indexOf(qe.id) : -1) < Tt.length - 1 || ee("loop").checked) && Or(nf);
};
let jo = 0;
ot.ontimeupdate = () => {
  qe && Date.now() - jo > 5e3 && (jo = Date.now(), Xn("playback", { ...qe, position: ot.currentTime }).catch(() => {
    Qe(!0), Be("Storage failed; wallet locked.");
  }));
};
async function Fs() {
  if (kt || !qe || qe.charged || ot.paused || ot.muted || ot.volume === 0) return;
  qe.charged = !0;
  const e = { ...qe };
  if (!je) return;
  const t = je, n = dt;
  if (Je.some(gn)) {
    await Qe(), Be("Paid test stopped because the previous operation is unresolved. Music continues free.");
    return;
  }
  kt = !0, gt();
  try {
    const r = await Ms(ne.address, ne.publicKey, e.core, e.id, e.receipt, BigInt(t.fee));
    if (n !== dt || je !== t) return;
    const i = { id: e.receipt, address: ne.address, kind: "play", core: e.core, song: e.id, recipient: r.recipient, amount: "50", fee: t.fee, nonce: r.nonce, created: Date.now(), status: "prepared", previewBytes: r.bytes };
    Je.push(i), await pt();
    const s = await nn("sign-play", { core: i.core, song: i.song, receipt: i.id, fee: i.fee, nonce: i.nonce, recipient: i.recipient });
    if (i.raw = s.raw, i.txid = s.txid, i.status = "signed", Sr++, await pt(), n !== dt) {
      Be("Test stopped. A signed transaction was saved but not submitted. Reconcile before further tests.");
      return;
    }
    await js(i), Sr >= t.max && await Qe();
  } catch (r) {
    const i = Je.find((s) => s.id === e.receipt);
    (i == null ? void 0 : i.status) === "prepared" && (i.status = "cancelled", await pt()), await Qe(), Be(r instanceof Error ? r.message : "Paid start failed.");
  } finally {
    kt = !1, gt();
  }
}
ot.onplaying = () => void Fs();
ot.onvolumechange = () => void Fs();
async function js(e) {
  v1(e);
  const t = dt;
  if (e.status = "unknown", await pt(), t !== dt) {
    e.status = "signed", e.note = "Stopped before submission. Saved transaction requires explicit review.", await pt();
    return;
  }
  try {
    await w1(e.raw, e.txid), e.status = "pending", e.note = "Accepted by node; awaiting confirmation.";
  } catch (n) {
    n != null && n.feeRejected && (e.status = "failed"), e.note = n instanceof Error ? n.message : "Submission unknown.";
  }
  await pt(), (e.status === "failed" || e.status === "unknown") && await Qe(), Be(e.note), gt();
}
async function Zn(e = !0) {
  var t, n, r, i, s, o, c, f;
  if (ne) {
    if (!Ct) {
      await li();
      return;
    }
    for (const g of Je.filter((p) => p.address === ne.address && p.txid && (e || gn(p)))) {
      const p = await m1(g.txid);
      if (!p) {
        g.status === "confirmed" && (g.status = "unknown", g.note = "Previously confirmed transaction is no longer visible; reconciliation required.");
        continue;
      }
      if (p.sender_address !== g.address || ((t = p.tx_id) == null ? void 0 : t.replace(/^0x/, "")) !== g.txid.replace(/^0x/, "")) throw Error("Transaction identity mismatch.");
      if (g.kind === "play" && (p.tx_type !== "contract_call" || ((n = p.contract_call) == null ? void 0 : n.contract_id) !== Bi || ((r = p.contract_call) == null ? void 0 : r.function_name) !== "play")) throw Error("Transaction contract mismatch.");
      if (g.kind === "withdraw" && (p.tx_type !== "token_transfer" || ((i = p.token_transfer) == null ? void 0 : i.recipient_address) !== g.recipient || String((s = p.token_transfer) == null ? void 0 : s.amount) !== g.amount)) throw Error("Withdrawal identity mismatch.");
      if (p.canonical === !0 && p.is_unanchored === !1 && Number.isSafeInteger(p.block_height) && p.block_height > 0) {
        if (p.tx_status === "success") {
          if (g.kind === "play") {
            const h = await Ns("get-receipt", [a1(g.address), Us(xr(g.id))]), m = (o = h == null ? void 0 : h.value) == null ? void 0 : o.value;
            if (!m || ((c = m.id) == null ? void 0 : c.value) !== String(g.song) || ((f = m.core) == null ? void 0 : f.value) !== String(g.core)) throw Error("Confirmed transaction receipt is not available yet.");
            g.recipient = m.recipient.value;
          }
          g.status = "confirmed", g.confirmedAt ?? (g.confirmedAt = Date.now()), g.note = "Confirmed on chain.";
        } else String(p.tx_status).startsWith("abort_") && (g.status = "failed", g.note = "Included but failed; network fee may be spent.");
        /^\d+$/.test(String(p.fee_rate)) && (g.actualFee = String(p.fee_rate));
      } else
        g.status = String(p.tx_status).startsWith("dropped_") ? "unknown" : "pending", g.note = String(p.tx_status).startsWith("dropped_") ? "Dropped by node. Keep the receipt; resolve nonce before another spend." : "Awaiting canonical confirmation.";
    }
    await pt(), await li();
  }
}
Ve("reconcile", async () => {
  await Zn(), Be("Saved transactions checked against the chain.");
});
Ve("resend", async () => {
  fs();
  const e = Je.find((t) => gn(t) && t.raw);
  if (!e) throw Error("No saved signed transaction to resend.");
  if (await Zn(), !gn(e)) throw Error("That transaction has resolved. No resend needed.");
  Ci("Resend identical transaction", `This resends exactly ${e.txid}.
It does not create a new receipt or change the fee.
Requested fee: ${We(e.fee)} STX
Only do this after reconciliation.`, async () => {
    fs(), await Zn(), gn(e) && await js(e);
  });
});
Ve("export", async () => {
  Qc("radio-test-report.json", { network: "mainnet", contract: Bi, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: Kc(Je) });
});
Ve("withdraw", async () => {
  vn(), await Qe();
  const e = Ke("recipient").trim(), t = wr(Ke("withdraw-amount")), n = Wc(Ke("withdraw-fee")), r = await y1(ne.address, ne.publicKey, e, t, n);
  Ci("Approve withdrawal", `From: ${ne.address}
To: ${e}
Amount: ${We(t)} STX
Network fee: ${We(n)} STX
Total: ${We(t + n)} STX
Size: ${r.bytes} bytes
This is an irreversible mainnet transfer. Check every address character.`, async () => {
    vn();
    const i = dt, s = { id: _i(), address: ne.address, kind: "withdraw", core: 0, song: 0, recipient: e, amount: t.toString(), fee: n.toString(), nonce: r.nonce, created: Date.now(), status: "prepared" };
    Je.push(s), await pt();
    try {
      const o = await nn("withdraw", { recipient: e, amount: s.amount, fee: s.fee, nonce: s.nonce });
      if (s.raw = o.raw, s.txid = o.txid, s.status = "signed", await pt(), i !== dt) {
        Be("Stopped before withdrawal submission. Reconcile the saved transaction.");
        return;
      }
      await js(s);
    } catch (o) {
      throw s.status === "prepared" && (s.status = "cancelled", await pt()), o;
    }
  }, n < BigInt(r.bytes));
});
Ve("offline", async () => {
  const e = [];
  wr("0.0002") === 200n && wr("0.00005") === 50n && e.push("PASS — exact fee and holder-payment arithmetic");
  const t = { fee: "300", budget: "350", max: 1, expires: Date.now() + 6e4, core: 3, songs: [2910] }, n = new Ps(t);
  n.consume(3, 2910, 300n);
  try {
    throw n.consume(3, 2910, 300n), Error("Budget check failed.");
  } catch (r) {
    if (r.message === "Budget check failed.") throw r;
    e.push("PASS — a second payment exceeds the one-play budget");
  }
  JSON.stringify(Kc([{ raw: "excluded", id: "test" }])).includes("excluded") || e.push("PASS — signed bytes excluded from exported reports"), ee("offline-result").textContent = e.join(`
`) + `
No network request, key creation or payment was performed.`;
});
ee("presets").onclick = (e) => {
  const t = e.target.dataset.fee;
  t && (ee("fee").value = t);
};
async function _1() {
  if (!crypto.subtle || !navigator.locks || !globalThis.indexedDB) throw Error("Use a modern HTTPS browser with local storage and Web Locks support.");
  if (await new Promise((e, t) => {
    navigator.locks.request("xtrata-radio-test-wallet-signer", { ifAvailable: !0 }, async (n) => {
      Ct = !!n, e(), n && await new Promise((r) => window.addEventListener("pagehide", () => r(), { once: !0 }));
    }).catch(t);
  }), ne = await Ar("vault"), ne && Zc(ne), Xt = !!ne && await Ar("backupVerified") === ne.address, Je = await A1(), Ct) {
    for (const e of Je) e.status === "prepared" && !e.raw && (e.status = "cancelled", e.note = "Interrupted before signing/submission.");
    await pt();
  }
  gt(), await nn("ping"), await qc(), ee("contract-status").textContent = "Deployed source and 50-microSTX holder payment verified.", ne && await Zn(), Be(Ct ? "Ready. Create or unlock your test wallet. Spending remains OFF." : "Another test-wallet tab holds the signer. Close it and reload this page.");
}
window.addEventListener("pageshow", (e) => {
  e.persisted && location.reload();
});
window.addEventListener("pagehide", () => {
  dt++, je = null, Er.terminate();
});
setInterval(() => {
  je && Date.now() >= je.expires && Qe(), !kt && ne && Ct && Or(() => Zn(!1));
}, 2e4);
_1().catch((e) => {
  Be(e.message), ee("contract-status").textContent = "Verification unavailable. Live tests will recheck before signing.", gt();
});
