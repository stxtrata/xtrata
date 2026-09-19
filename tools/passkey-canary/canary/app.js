var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod3) => function __require() {
  return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target,
  mod3
));

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
  }
});

// upstream/node_modules/c32check/node_modules/@noble/hashes/crypto.js
var require_crypto2 = __commonJS({
  "upstream/node_modules/c32check/node_modules/@noble/hashes/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crypto = void 0;
    exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  }
});

// upstream/node_modules/c32check/node_modules/@noble/hashes/utils.js
var require_utils = __commonJS({
  "upstream/node_modules/c32check/node_modules/@noble/hashes/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.Hash = exports.nextTick = exports.swap32IfBE = exports.byteSwapIfBE = exports.swap8IfBE = exports.isLE = void 0;
    exports.isBytes = isBytes6;
    exports.anumber = anumber4;
    exports.abytes = abytes4;
    exports.ahash = ahash2;
    exports.aexists = aexists2;
    exports.aoutput = aoutput2;
    exports.u8 = u8;
    exports.u32 = u32;
    exports.clean = clean2;
    exports.createView = createView4;
    exports.rotr = rotr3;
    exports.rotl = rotl3;
    exports.byteSwap = byteSwap;
    exports.byteSwap32 = byteSwap32;
    exports.bytesToHex = bytesToHex5;
    exports.hexToBytes = hexToBytes5;
    exports.asyncLoop = asyncLoop2;
    exports.utf8ToBytes = utf8ToBytes4;
    exports.bytesToUtf8 = bytesToUtf82;
    exports.toBytes = toBytes2;
    exports.kdfInputToBytes = kdfInputToBytes2;
    exports.concatBytes = concatBytes7;
    exports.checkOpts = checkOpts2;
    exports.createHasher = createHasher2;
    exports.createOptHasher = createOptHasher;
    exports.createXOFer = createXOFer;
    exports.randomBytes = randomBytes3;
    var crypto_1 = require_crypto2();
    function isBytes6(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function anumber4(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error("positive integer expected, got " + n);
    }
    function abytes4(b, ...lengths) {
      if (!isBytes6(b))
        throw new Error("Uint8Array expected");
      if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
    }
    function ahash2(h) {
      if (typeof h !== "function" || typeof h.create !== "function")
        throw new Error("Hash should be wrapped by utils.createHasher");
      anumber4(h.outputLen);
      anumber4(h.blockLen);
    }
    function aexists2(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    function aoutput2(out, instance) {
      abytes4(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error("digestInto() expects output buffer of length at least " + min);
      }
    }
    function u8(arr) {
      return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function u32(arr) {
      return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    }
    function clean2(...arrays) {
      for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
      }
    }
    function createView4(arr) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function rotr3(word, shift) {
      return word << 32 - shift | word >>> shift;
    }
    function rotl3(word, shift) {
      return word << shift | word >>> 32 - shift >>> 0;
    }
    exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    function byteSwap(word) {
      return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    }
    exports.swap8IfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
    exports.byteSwapIfBE = exports.swap8IfBE;
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
      }
      return arr;
    }
    exports.swap32IfBE = exports.isLE ? (u) => u : byteSwap32;
    var hasHexBuiltin3 = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    var hexes5 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex5(bytes3) {
      abytes4(bytes3);
      if (hasHexBuiltin3)
        return bytes3.toHex();
      let hex4 = "";
      for (let i = 0; i < bytes3.length; i++) {
        hex4 += hexes5[bytes3[i]];
      }
      return hex4;
    }
    var asciis2 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase162(ch) {
      if (ch >= asciis2._0 && ch <= asciis2._9)
        return ch - asciis2._0;
      if (ch >= asciis2.A && ch <= asciis2.F)
        return ch - (asciis2.A - 10);
      if (ch >= asciis2.a && ch <= asciis2.f)
        return ch - (asciis2.a - 10);
      return;
    }
    function hexToBytes5(hex4) {
      if (typeof hex4 !== "string")
        throw new Error("hex string expected, got " + typeof hex4);
      if (hasHexBuiltin3)
        return Uint8Array.fromHex(hex4);
      const hl = hex4.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array2 = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase162(hex4.charCodeAt(hi));
        const n2 = asciiToBase162(hex4.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex4[hi] + hex4[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array2[ai] = n1 * 16 + n2;
      }
      return array2;
    }
    var nextTick = async () => {
    };
    exports.nextTick = nextTick;
    async function asyncLoop2(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
          continue;
        await (0, exports.nextTick)();
        ts += diff;
      }
    }
    function utf8ToBytes4(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function bytesToUtf82(bytes3) {
      return new TextDecoder().decode(bytes3);
    }
    function toBytes2(data) {
      if (typeof data === "string")
        data = utf8ToBytes4(data);
      abytes4(data);
      return data;
    }
    function kdfInputToBytes2(data) {
      if (typeof data === "string")
        data = utf8ToBytes4(data);
      abytes4(data);
      return data;
    }
    function concatBytes7(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes4(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    function checkOpts2(defaults, opts) {
      if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
        throw new Error("options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    var Hash2 = class {
    };
    exports.Hash = Hash2;
    function createHasher2(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    function createOptHasher(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes2(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function createXOFer(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes2(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    exports.wrapConstructor = createHasher2;
    exports.wrapConstructorWithOpts = createOptHasher;
    exports.wrapXOFConstructorWithOpts = createXOFer;
    function randomBytes3(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
  }
});

// upstream/node_modules/c32check/lib/encoding.js
var require_encoding = __commonJS({
  "upstream/node_modules/c32check/lib/encoding.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.c32decode = exports.c32normalize = exports.c32encode = exports.c32 = void 0;
    var utils_1 = require_utils();
    exports.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    var hex4 = "0123456789abcdef";
    function c32encode(inputHex, minLength) {
      if (!inputHex.match(/^[0-9a-fA-F]*$/)) {
        throw new Error("Not a hex-encoded string");
      }
      if (inputHex.length % 2 !== 0) {
        inputHex = `0${inputHex}`;
      }
      inputHex = inputHex.toLowerCase();
      let res = [];
      let carry = 0;
      for (let i = inputHex.length - 1; i >= 0; i--) {
        if (carry < 4) {
          const currentCode = hex4.indexOf(inputHex[i]) >> carry;
          let nextCode = 0;
          if (i !== 0) {
            nextCode = hex4.indexOf(inputHex[i - 1]);
          }
          const nextBits = 1 + carry;
          const nextLowBits = nextCode % (1 << nextBits) << 5 - nextBits;
          const curC32Digit = exports.c32[currentCode + nextLowBits];
          carry = nextBits;
          res.unshift(curC32Digit);
        } else {
          carry = 0;
        }
      }
      let C32leadingZeros = 0;
      for (let i = 0; i < res.length; i++) {
        if (res[i] !== "0") {
          break;
        } else {
          C32leadingZeros++;
        }
      }
      res = res.slice(C32leadingZeros);
      const zeroPrefix = new TextDecoder().decode((0, utils_1.hexToBytes)(inputHex)).match(/^\u0000*/);
      const numLeadingZeroBytesInHex = zeroPrefix ? zeroPrefix[0].length : 0;
      for (let i = 0; i < numLeadingZeroBytesInHex; i++) {
        res.unshift(exports.c32[0]);
      }
      if (minLength) {
        const count = minLength - res.length;
        for (let i = 0; i < count; i++) {
          res.unshift(exports.c32[0]);
        }
      }
      return res.join("");
    }
    exports.c32encode = c32encode;
    function c32normalize(c32input) {
      return c32input.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
    }
    exports.c32normalize = c32normalize;
    function c32decode(c32input, minLength) {
      c32input = c32normalize(c32input);
      if (!c32input.match(`^[${exports.c32}]*$`)) {
        throw new Error("Not a c32-encoded string");
      }
      const zeroPrefix = c32input.match(`^${exports.c32[0]}*`);
      const numLeadingZeroBytes = zeroPrefix ? zeroPrefix[0].length : 0;
      let res = [];
      let carry = 0;
      let carryBits = 0;
      for (let i = c32input.length - 1; i >= 0; i--) {
        if (carryBits === 4) {
          res.unshift(hex4[carry]);
          carryBits = 0;
          carry = 0;
        }
        const currentCode = exports.c32.indexOf(c32input[i]) << carryBits;
        const currentValue = currentCode + carry;
        const currentHexDigit = hex4[currentValue % 16];
        carryBits += 1;
        carry = currentValue >> 4;
        if (carry > 1 << carryBits) {
          throw new Error("Panic error in decoding.");
        }
        res.unshift(currentHexDigit);
      }
      res.unshift(hex4[carry]);
      if (res.length % 2 === 1) {
        res.unshift("0");
      }
      let hexLeadingZeros = 0;
      for (let i = 0; i < res.length; i++) {
        if (res[i] !== "0") {
          break;
        } else {
          hexLeadingZeros++;
        }
      }
      res = res.slice(hexLeadingZeros - hexLeadingZeros % 2);
      let hexStr = res.join("");
      for (let i = 0; i < numLeadingZeroBytes; i++) {
        hexStr = `00${hexStr}`;
      }
      if (minLength) {
        const count = minLength * 2 - hexStr.length;
        for (let i = 0; i < count; i += 2) {
          hexStr = `00${hexStr}`;
        }
      }
      return hexStr;
    }
    exports.c32decode = c32decode;
  }
});

// upstream/node_modules/c32check/node_modules/@noble/hashes/_md.js
var require_md = __commonJS({
  "upstream/node_modules/c32check/node_modules/@noble/hashes/_md.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SHA512_IV = exports.SHA384_IV = exports.SHA224_IV = exports.SHA256_IV = exports.HashMD = void 0;
    exports.setBigUint64 = setBigUint642;
    exports.Chi = Chi3;
    exports.Maj = Maj3;
    var utils_ts_1 = require_utils();
    function setBigUint642(view2, byteOffset, value, isLE2) {
      if (typeof view2.setBigUint64 === "function")
        return view2.setBigUint64(byteOffset, value, isLE2);
      const _32n3 = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n3 & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE2 ? 4 : 0;
      const l = isLE2 ? 0 : 4;
      view2.setUint32(byteOffset + h, wh, isLE2);
      view2.setUint32(byteOffset + l, wl, isLE2);
    }
    function Chi3(a, b, c) {
      return a & b ^ ~a & c;
    }
    function Maj3(a, b, c) {
      return a & b ^ a & c ^ b & c;
    }
    var HashMD2 = class extends utils_ts_1.Hash {
      constructor(blockLen, outputLen, padOffset, isLE2) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE2;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, utils_ts_1.createView)(this.buffer);
      }
      update(data) {
        (0, utils_ts_1.aexists)(this);
        data = (0, utils_ts_1.toBytes)(data);
        (0, utils_ts_1.abytes)(data);
        const { view: view2, buffer: buffer2, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = (0, utils_ts_1.createView)(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer2.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view2, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        (0, utils_ts_1.aexists)(this);
        (0, utils_ts_1.aoutput)(out, this);
        this.finished = true;
        const { buffer: buffer2, view: view2, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer2[pos++] = 128;
        (0, utils_ts_1.clean)(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view2, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer2[i] = 0;
        setBigUint642(view2, blockLen - 8, BigInt(this.length * 8), isLE2);
        this.process(view2, 0);
        const oview = (0, utils_ts_1.createView)(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE2);
      }
      digest() {
        const { buffer: buffer2, outputLen } = this;
        this.digestInto(buffer2);
        const res = buffer2.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer2);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    exports.HashMD = HashMD2;
    exports.SHA256_IV = Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    exports.SHA224_IV = Uint32Array.from([
      3238371032,
      914150663,
      812702999,
      4144912697,
      4290775857,
      1750603025,
      1694076839,
      3204075428
    ]);
    exports.SHA384_IV = Uint32Array.from([
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
    exports.SHA512_IV = Uint32Array.from([
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
  }
});

// upstream/node_modules/c32check/node_modules/@noble/hashes/_u64.js
var require_u64 = __commonJS({
  "upstream/node_modules/c32check/node_modules/@noble/hashes/_u64.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toBig = exports.shrSL = exports.shrSH = exports.rotrSL = exports.rotrSH = exports.rotrBL = exports.rotrBH = exports.rotr32L = exports.rotr32H = exports.rotlSL = exports.rotlSH = exports.rotlBL = exports.rotlBH = exports.add5L = exports.add5H = exports.add4L = exports.add4H = exports.add3L = exports.add3H = void 0;
    exports.add = add3;
    exports.fromBig = fromBig3;
    exports.split = split3;
    var U32_MASK643 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    var _32n3 = /* @__PURE__ */ BigInt(32);
    function fromBig3(n, le = false) {
      if (le)
        return { h: Number(n & U32_MASK643), l: Number(n >> _32n3 & U32_MASK643) };
      return { h: Number(n >> _32n3 & U32_MASK643) | 0, l: Number(n & U32_MASK643) | 0 };
    }
    function split3(lst, le = false) {
      const len = lst.length;
      let Ah = new Uint32Array(len);
      let Al = new Uint32Array(len);
      for (let i = 0; i < len; i++) {
        const { h, l } = fromBig3(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
      }
      return [Ah, Al];
    }
    var toBig2 = (h, l) => BigInt(h >>> 0) << _32n3 | BigInt(l >>> 0);
    exports.toBig = toBig2;
    var shrSH3 = (h, _l, s) => h >>> s;
    exports.shrSH = shrSH3;
    var shrSL3 = (h, l, s) => h << 32 - s | l >>> s;
    exports.shrSL = shrSL3;
    var rotrSH3 = (h, l, s) => h >>> s | l << 32 - s;
    exports.rotrSH = rotrSH3;
    var rotrSL3 = (h, l, s) => h << 32 - s | l >>> s;
    exports.rotrSL = rotrSL3;
    var rotrBH3 = (h, l, s) => h << 64 - s | l >>> s - 32;
    exports.rotrBH = rotrBH3;
    var rotrBL3 = (h, l, s) => h >>> s - 32 | l << 64 - s;
    exports.rotrBL = rotrBL3;
    var rotr32H2 = (_h, l) => l;
    exports.rotr32H = rotr32H2;
    var rotr32L2 = (h, _l) => h;
    exports.rotr32L = rotr32L2;
    var rotlSH2 = (h, l, s) => h << s | l >>> 32 - s;
    exports.rotlSH = rotlSH2;
    var rotlSL2 = (h, l, s) => l << s | h >>> 32 - s;
    exports.rotlSL = rotlSL2;
    var rotlBH2 = (h, l, s) => l << s - 32 | h >>> 64 - s;
    exports.rotlBH = rotlBH2;
    var rotlBL2 = (h, l, s) => h << s - 32 | l >>> 64 - s;
    exports.rotlBL = rotlBL2;
    function add3(Ah, Al, Bh, Bl) {
      const l = (Al >>> 0) + (Bl >>> 0);
      return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
    }
    var add3L3 = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    exports.add3L = add3L3;
    var add3H3 = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    exports.add3H = add3H3;
    var add4L3 = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    exports.add4L = add4L3;
    var add4H3 = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    exports.add4H = add4H3;
    var add5L3 = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    exports.add5L = add5L3;
    var add5H3 = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    exports.add5H = add5H3;
    var u642 = {
      fromBig: fromBig3,
      split: split3,
      toBig: toBig2,
      shrSH: shrSH3,
      shrSL: shrSL3,
      rotrSH: rotrSH3,
      rotrSL: rotrSL3,
      rotrBH: rotrBH3,
      rotrBL: rotrBL3,
      rotr32H: rotr32H2,
      rotr32L: rotr32L2,
      rotlSH: rotlSH2,
      rotlSL: rotlSL2,
      rotlBH: rotlBH2,
      rotlBL: rotlBL2,
      add: add3,
      add3L: add3L3,
      add3H: add3H3,
      add4L: add4L3,
      add4H: add4H3,
      add5H: add5H3,
      add5L: add5L3
    };
    exports.default = u642;
  }
});

// upstream/node_modules/c32check/node_modules/@noble/hashes/sha2.js
var require_sha2 = __commonJS({
  "upstream/node_modules/c32check/node_modules/@noble/hashes/sha2.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha512_224 = exports.sha512_256 = exports.sha384 = exports.sha512 = exports.sha224 = exports.sha256 = exports.SHA512_256 = exports.SHA512_224 = exports.SHA384 = exports.SHA512 = exports.SHA224 = exports.SHA256 = void 0;
    var _md_ts_1 = require_md();
    var u642 = require_u64();
    var utils_ts_1 = require_utils();
    var SHA256_K3 = /* @__PURE__ */ Uint32Array.from([
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
    ]);
    var SHA256_W3 = /* @__PURE__ */ new Uint32Array(64);
    var SHA2562 = class extends _md_ts_1.HashMD {
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = _md_ts_1.SHA256_IV[0] | 0;
        this.B = _md_ts_1.SHA256_IV[1] | 0;
        this.C = _md_ts_1.SHA256_IV[2] | 0;
        this.D = _md_ts_1.SHA256_IV[3] | 0;
        this.E = _md_ts_1.SHA256_IV[4] | 0;
        this.F = _md_ts_1.SHA256_IV[5] | 0;
        this.G = _md_ts_1.SHA256_IV[6] | 0;
        this.H = _md_ts_1.SHA256_IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view2, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W3[i] = view2.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W3[i - 15];
          const W2 = SHA256_W3[i - 2];
          const s0 = (0, utils_ts_1.rotr)(W15, 7) ^ (0, utils_ts_1.rotr)(W15, 18) ^ W15 >>> 3;
          const s1 = (0, utils_ts_1.rotr)(W2, 17) ^ (0, utils_ts_1.rotr)(W2, 19) ^ W2 >>> 10;
          SHA256_W3[i] = s1 + SHA256_W3[i - 7] + s0 + SHA256_W3[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = (0, utils_ts_1.rotr)(E, 6) ^ (0, utils_ts_1.rotr)(E, 11) ^ (0, utils_ts_1.rotr)(E, 25);
          const T1 = H + sigma1 + (0, _md_ts_1.Chi)(E, F, G) + SHA256_K3[i] + SHA256_W3[i] | 0;
          const sigma0 = (0, utils_ts_1.rotr)(A, 2) ^ (0, utils_ts_1.rotr)(A, 13) ^ (0, utils_ts_1.rotr)(A, 22);
          const T2 = sigma0 + (0, _md_ts_1.Maj)(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        (0, utils_ts_1.clean)(SHA256_W3);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        (0, utils_ts_1.clean)(this.buffer);
      }
    };
    exports.SHA256 = SHA2562;
    var SHA2242 = class extends SHA2562 {
      constructor() {
        super(28);
        this.A = _md_ts_1.SHA224_IV[0] | 0;
        this.B = _md_ts_1.SHA224_IV[1] | 0;
        this.C = _md_ts_1.SHA224_IV[2] | 0;
        this.D = _md_ts_1.SHA224_IV[3] | 0;
        this.E = _md_ts_1.SHA224_IV[4] | 0;
        this.F = _md_ts_1.SHA224_IV[5] | 0;
        this.G = _md_ts_1.SHA224_IV[6] | 0;
        this.H = _md_ts_1.SHA224_IV[7] | 0;
      }
    };
    exports.SHA224 = SHA2242;
    var K5122 = /* @__PURE__ */ (() => u642.split([
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
    ].map((n) => BigInt(n))))();
    var SHA512_Kh3 = /* @__PURE__ */ (() => K5122[0])();
    var SHA512_Kl3 = /* @__PURE__ */ (() => K5122[1])();
    var SHA512_W_H3 = /* @__PURE__ */ new Uint32Array(80);
    var SHA512_W_L3 = /* @__PURE__ */ new Uint32Array(80);
    var SHA5122 = class extends _md_ts_1.HashMD {
      constructor(outputLen = 64) {
        super(128, outputLen, 16, false);
        this.Ah = _md_ts_1.SHA512_IV[0] | 0;
        this.Al = _md_ts_1.SHA512_IV[1] | 0;
        this.Bh = _md_ts_1.SHA512_IV[2] | 0;
        this.Bl = _md_ts_1.SHA512_IV[3] | 0;
        this.Ch = _md_ts_1.SHA512_IV[4] | 0;
        this.Cl = _md_ts_1.SHA512_IV[5] | 0;
        this.Dh = _md_ts_1.SHA512_IV[6] | 0;
        this.Dl = _md_ts_1.SHA512_IV[7] | 0;
        this.Eh = _md_ts_1.SHA512_IV[8] | 0;
        this.El = _md_ts_1.SHA512_IV[9] | 0;
        this.Fh = _md_ts_1.SHA512_IV[10] | 0;
        this.Fl = _md_ts_1.SHA512_IV[11] | 0;
        this.Gh = _md_ts_1.SHA512_IV[12] | 0;
        this.Gl = _md_ts_1.SHA512_IV[13] | 0;
        this.Hh = _md_ts_1.SHA512_IV[14] | 0;
        this.Hl = _md_ts_1.SHA512_IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      process(view2, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H3[i] = view2.getUint32(offset);
          SHA512_W_L3[i] = view2.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H3[i - 15] | 0;
          const W15l = SHA512_W_L3[i - 15] | 0;
          const s0h = u642.rotrSH(W15h, W15l, 1) ^ u642.rotrSH(W15h, W15l, 8) ^ u642.shrSH(W15h, W15l, 7);
          const s0l = u642.rotrSL(W15h, W15l, 1) ^ u642.rotrSL(W15h, W15l, 8) ^ u642.shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H3[i - 2] | 0;
          const W2l = SHA512_W_L3[i - 2] | 0;
          const s1h = u642.rotrSH(W2h, W2l, 19) ^ u642.rotrBH(W2h, W2l, 61) ^ u642.shrSH(W2h, W2l, 6);
          const s1l = u642.rotrSL(W2h, W2l, 19) ^ u642.rotrBL(W2h, W2l, 61) ^ u642.shrSL(W2h, W2l, 6);
          const SUMl = u642.add4L(s0l, s1l, SHA512_W_L3[i - 7], SHA512_W_L3[i - 16]);
          const SUMh = u642.add4H(SUMl, s0h, s1h, SHA512_W_H3[i - 7], SHA512_W_H3[i - 16]);
          SHA512_W_H3[i] = SUMh | 0;
          SHA512_W_L3[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = u642.rotrSH(Eh, El, 14) ^ u642.rotrSH(Eh, El, 18) ^ u642.rotrBH(Eh, El, 41);
          const sigma1l = u642.rotrSL(Eh, El, 14) ^ u642.rotrSL(Eh, El, 18) ^ u642.rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = u642.add5L(Hl, sigma1l, CHIl, SHA512_Kl3[i], SHA512_W_L3[i]);
          const T1h = u642.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh3[i], SHA512_W_H3[i]);
          const T1l = T1ll | 0;
          const sigma0h = u642.rotrSH(Ah, Al, 28) ^ u642.rotrBH(Ah, Al, 34) ^ u642.rotrBH(Ah, Al, 39);
          const sigma0l = u642.rotrSL(Ah, Al, 28) ^ u642.rotrBL(Ah, Al, 34) ^ u642.rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = u642.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = u642.add3L(T1l, sigma0l, MAJl);
          Ah = u642.add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = u642.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = u642.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = u642.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = u642.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = u642.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = u642.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = u642.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = u642.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        (0, utils_ts_1.clean)(SHA512_W_H3, SHA512_W_L3);
      }
      destroy() {
        (0, utils_ts_1.clean)(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    exports.SHA512 = SHA5122;
    var SHA3842 = class extends SHA5122 {
      constructor() {
        super(48);
        this.Ah = _md_ts_1.SHA384_IV[0] | 0;
        this.Al = _md_ts_1.SHA384_IV[1] | 0;
        this.Bh = _md_ts_1.SHA384_IV[2] | 0;
        this.Bl = _md_ts_1.SHA384_IV[3] | 0;
        this.Ch = _md_ts_1.SHA384_IV[4] | 0;
        this.Cl = _md_ts_1.SHA384_IV[5] | 0;
        this.Dh = _md_ts_1.SHA384_IV[6] | 0;
        this.Dl = _md_ts_1.SHA384_IV[7] | 0;
        this.Eh = _md_ts_1.SHA384_IV[8] | 0;
        this.El = _md_ts_1.SHA384_IV[9] | 0;
        this.Fh = _md_ts_1.SHA384_IV[10] | 0;
        this.Fl = _md_ts_1.SHA384_IV[11] | 0;
        this.Gh = _md_ts_1.SHA384_IV[12] | 0;
        this.Gl = _md_ts_1.SHA384_IV[13] | 0;
        this.Hh = _md_ts_1.SHA384_IV[14] | 0;
        this.Hl = _md_ts_1.SHA384_IV[15] | 0;
      }
    };
    exports.SHA384 = SHA3842;
    var T224_IV = /* @__PURE__ */ Uint32Array.from([
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
    ]);
    var T256_IV = /* @__PURE__ */ Uint32Array.from([
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
    var SHA512_2242 = class extends SHA5122 {
      constructor() {
        super(28);
        this.Ah = T224_IV[0] | 0;
        this.Al = T224_IV[1] | 0;
        this.Bh = T224_IV[2] | 0;
        this.Bl = T224_IV[3] | 0;
        this.Ch = T224_IV[4] | 0;
        this.Cl = T224_IV[5] | 0;
        this.Dh = T224_IV[6] | 0;
        this.Dl = T224_IV[7] | 0;
        this.Eh = T224_IV[8] | 0;
        this.El = T224_IV[9] | 0;
        this.Fh = T224_IV[10] | 0;
        this.Fl = T224_IV[11] | 0;
        this.Gh = T224_IV[12] | 0;
        this.Gl = T224_IV[13] | 0;
        this.Hh = T224_IV[14] | 0;
        this.Hl = T224_IV[15] | 0;
      }
    };
    exports.SHA512_224 = SHA512_2242;
    var SHA512_2562 = class extends SHA5122 {
      constructor() {
        super(32);
        this.Ah = T256_IV[0] | 0;
        this.Al = T256_IV[1] | 0;
        this.Bh = T256_IV[2] | 0;
        this.Bl = T256_IV[3] | 0;
        this.Ch = T256_IV[4] | 0;
        this.Cl = T256_IV[5] | 0;
        this.Dh = T256_IV[6] | 0;
        this.Dl = T256_IV[7] | 0;
        this.Eh = T256_IV[8] | 0;
        this.El = T256_IV[9] | 0;
        this.Fh = T256_IV[10] | 0;
        this.Fl = T256_IV[11] | 0;
        this.Gh = T256_IV[12] | 0;
        this.Gl = T256_IV[13] | 0;
        this.Hh = T256_IV[14] | 0;
        this.Hl = T256_IV[15] | 0;
      }
    };
    exports.SHA512_256 = SHA512_2562;
    exports.sha256 = (0, utils_ts_1.createHasher)(() => new SHA2562());
    exports.sha224 = (0, utils_ts_1.createHasher)(() => new SHA2242());
    exports.sha512 = (0, utils_ts_1.createHasher)(() => new SHA5122());
    exports.sha384 = (0, utils_ts_1.createHasher)(() => new SHA3842());
    exports.sha512_256 = (0, utils_ts_1.createHasher)(() => new SHA512_2562());
    exports.sha512_224 = (0, utils_ts_1.createHasher)(() => new SHA512_2242());
  }
});

// upstream/node_modules/c32check/node_modules/@noble/hashes/sha256.js
var require_sha256 = __commonJS({
  "upstream/node_modules/c32check/node_modules/@noble/hashes/sha256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha224 = exports.SHA224 = exports.sha256 = exports.SHA256 = void 0;
    var sha2_ts_1 = require_sha2();
    exports.SHA256 = sha2_ts_1.SHA256;
    exports.sha256 = sha2_ts_1.sha256;
    exports.SHA224 = sha2_ts_1.SHA224;
    exports.sha224 = sha2_ts_1.sha224;
  }
});

// upstream/node_modules/c32check/lib/checksum.js
var require_checksum = __commonJS({
  "upstream/node_modules/c32check/lib/checksum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.c32checkDecode = exports.c32checkEncode = void 0;
    var sha256_1 = require_sha256();
    var utils_1 = require_utils();
    var encoding_1 = require_encoding();
    function c32checksum(dataHex) {
      const dataHash = (0, sha256_1.sha256)((0, sha256_1.sha256)((0, utils_1.hexToBytes)(dataHex)));
      const checksum2 = (0, utils_1.bytesToHex)(dataHash.slice(0, 4));
      return checksum2;
    }
    function c32checkEncode(version, data) {
      if (version < 0 || version >= 32) {
        throw new Error("Invalid version (must be between 0 and 31)");
      }
      if (!data.match(/^[0-9a-fA-F]*$/)) {
        throw new Error("Invalid data (not a hex string)");
      }
      data = data.toLowerCase();
      if (data.length % 2 !== 0) {
        data = `0${data}`;
      }
      let versionHex = version.toString(16);
      if (versionHex.length === 1) {
        versionHex = `0${versionHex}`;
      }
      const checksumHex = c32checksum(`${versionHex}${data}`);
      const c32str = (0, encoding_1.c32encode)(`${data}${checksumHex}`);
      return `${encoding_1.c32[version]}${c32str}`;
    }
    exports.c32checkEncode = c32checkEncode;
    function c32checkDecode(c32data) {
      c32data = (0, encoding_1.c32normalize)(c32data);
      const dataHex = (0, encoding_1.c32decode)(c32data.slice(1));
      const versionChar = c32data[0];
      const version = encoding_1.c32.indexOf(versionChar);
      const checksum2 = dataHex.slice(-8);
      let versionHex = version.toString(16);
      if (versionHex.length === 1) {
        versionHex = `0${versionHex}`;
      }
      if (c32checksum(`${versionHex}${dataHex.substring(0, dataHex.length - 8)}`) !== checksum2) {
        throw new Error("Invalid c32check string: checksum mismatch");
      }
      return [version, dataHex.substring(0, dataHex.length - 8)];
    }
    exports.c32checkDecode = c32checkDecode;
  }
});

// upstream/node_modules/base-x/src/index.js
var require_src = __commonJS({
  "upstream/node_modules/base-x/src/index.js"(exports, module) {
    "use strict";
    function base(ALPHABET) {
      if (ALPHABET.length >= 255) {
        throw new TypeError("Alphabet too long");
      }
      var BASE_MAP = new Uint8Array(256);
      for (var j = 0; j < BASE_MAP.length; j++) {
        BASE_MAP[j] = 255;
      }
      for (var i = 0; i < ALPHABET.length; i++) {
        var x = ALPHABET.charAt(i);
        var xc = x.charCodeAt(0);
        if (BASE_MAP[xc] !== 255) {
          throw new TypeError(x + " is ambiguous");
        }
        BASE_MAP[xc] = i;
      }
      var BASE = ALPHABET.length;
      var LEADER = ALPHABET.charAt(0);
      var FACTOR = Math.log(BASE) / Math.log(256);
      var iFACTOR = Math.log(256) / Math.log(BASE);
      function encode(source) {
        if (source instanceof Uint8Array) {
        } else if (ArrayBuffer.isView(source)) {
          source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
        } else if (Array.isArray(source)) {
          source = Uint8Array.from(source);
        }
        if (!(source instanceof Uint8Array)) {
          throw new TypeError("Expected Uint8Array");
        }
        if (source.length === 0) {
          return "";
        }
        var zeroes = 0;
        var length = 0;
        var pbegin = 0;
        var pend = source.length;
        while (pbegin !== pend && source[pbegin] === 0) {
          pbegin++;
          zeroes++;
        }
        var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
        var b58 = new Uint8Array(size);
        while (pbegin !== pend) {
          var carry = source[pbegin];
          var i2 = 0;
          for (var it1 = size - 1; (carry !== 0 || i2 < length) && it1 !== -1; it1--, i2++) {
            carry += 256 * b58[it1] >>> 0;
            b58[it1] = carry % BASE >>> 0;
            carry = carry / BASE >>> 0;
          }
          if (carry !== 0) {
            throw new Error("Non-zero carry");
          }
          length = i2;
          pbegin++;
        }
        var it2 = size - length;
        while (it2 !== size && b58[it2] === 0) {
          it2++;
        }
        var str = LEADER.repeat(zeroes);
        for (; it2 < size; ++it2) {
          str += ALPHABET.charAt(b58[it2]);
        }
        return str;
      }
      function decodeUnsafe(source) {
        if (typeof source !== "string") {
          throw new TypeError("Expected String");
        }
        if (source.length === 0) {
          return new Uint8Array();
        }
        var psz = 0;
        var zeroes = 0;
        var length = 0;
        while (source[psz] === LEADER) {
          zeroes++;
          psz++;
        }
        var size = (source.length - psz) * FACTOR + 1 >>> 0;
        var b256 = new Uint8Array(size);
        while (source[psz]) {
          var charCode = source.charCodeAt(psz);
          if (charCode > 255) {
            return;
          }
          var carry = BASE_MAP[charCode];
          if (carry === 255) {
            return;
          }
          var i2 = 0;
          for (var it3 = size - 1; (carry !== 0 || i2 < length) && it3 !== -1; it3--, i2++) {
            carry += BASE * b256[it3] >>> 0;
            b256[it3] = carry % 256 >>> 0;
            carry = carry / 256 >>> 0;
          }
          if (carry !== 0) {
            throw new Error("Non-zero carry");
          }
          length = i2;
          psz++;
        }
        var it4 = size - length;
        while (it4 !== size && b256[it4] === 0) {
          it4++;
        }
        var vch = new Uint8Array(zeroes + (size - it4));
        var j2 = zeroes;
        while (it4 !== size) {
          vch[j2++] = b256[it4++];
        }
        return vch;
      }
      function decode(string) {
        var buffer2 = decodeUnsafe(string);
        if (buffer2) {
          return buffer2;
        }
        throw new Error("Non-base" + BASE + " character");
      }
      return {
        encode,
        decodeUnsafe,
        decode
      };
    }
    module.exports = base;
  }
});

// upstream/node_modules/c32check/lib/base58check.js
var require_base58check = __commonJS({
  "upstream/node_modules/c32check/lib/base58check.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decode = exports.encode = void 0;
    var sha256_1 = require_sha256();
    var utils_1 = require_utils();
    var basex = require_src();
    var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    function encode(data, prefix = "00") {
      const dataBytes = typeof data === "string" ? (0, utils_1.hexToBytes)(data) : data;
      const prefixBytes = typeof prefix === "string" ? (0, utils_1.hexToBytes)(prefix) : data;
      if (!(dataBytes instanceof Uint8Array) || !(prefixBytes instanceof Uint8Array)) {
        throw new TypeError("Argument must be of type Uint8Array or string");
      }
      const checksum2 = (0, sha256_1.sha256)((0, sha256_1.sha256)(new Uint8Array([...prefixBytes, ...dataBytes])));
      return basex(ALPHABET).encode([...prefixBytes, ...dataBytes, ...checksum2.slice(0, 4)]);
    }
    exports.encode = encode;
    function decode(string) {
      const bytes3 = basex(ALPHABET).decode(string);
      const prefixBytes = bytes3.slice(0, 1);
      const dataBytes = bytes3.slice(1, -4);
      const checksum2 = (0, sha256_1.sha256)((0, sha256_1.sha256)(new Uint8Array([...prefixBytes, ...dataBytes])));
      bytes3.slice(-4).forEach((check, index) => {
        if (check !== checksum2[index]) {
          throw new Error("Invalid checksum");
        }
      });
      return { prefix: prefixBytes, data: dataBytes };
    }
    exports.decode = decode;
  }
});

// upstream/node_modules/c32check/lib/address.js
var require_address = __commonJS({
  "upstream/node_modules/c32check/lib/address.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.c32ToB58 = exports.b58ToC32 = exports.c32addressDecode = exports.c32address = exports.versions = void 0;
    var checksum_1 = require_checksum();
    var base58check3 = require_base58check();
    var utils_1 = require_utils();
    exports.versions = {
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
    var ADDR_BITCOIN_TO_STACKS = {};
    ADDR_BITCOIN_TO_STACKS[0] = exports.versions.mainnet.p2pkh;
    ADDR_BITCOIN_TO_STACKS[5] = exports.versions.mainnet.p2sh;
    ADDR_BITCOIN_TO_STACKS[111] = exports.versions.testnet.p2pkh;
    ADDR_BITCOIN_TO_STACKS[196] = exports.versions.testnet.p2sh;
    var ADDR_STACKS_TO_BITCOIN = {};
    ADDR_STACKS_TO_BITCOIN[exports.versions.mainnet.p2pkh] = 0;
    ADDR_STACKS_TO_BITCOIN[exports.versions.mainnet.p2sh] = 5;
    ADDR_STACKS_TO_BITCOIN[exports.versions.testnet.p2pkh] = 111;
    ADDR_STACKS_TO_BITCOIN[exports.versions.testnet.p2sh] = 196;
    function c32address4(version, hash160hex) {
      if (!hash160hex.match(/^[0-9a-fA-F]{40}$/)) {
        throw new Error("Invalid argument: not a hash160 hex string");
      }
      const c32string = (0, checksum_1.c32checkEncode)(version, hash160hex);
      return `S${c32string}`;
    }
    exports.c32address = c32address4;
    function c32addressDecode3(c32addr) {
      if (c32addr.length <= 5) {
        throw new Error("Invalid c32 address: invalid length");
      }
      if (c32addr[0] != "S") {
        throw new Error('Invalid c32 address: must start with "S"');
      }
      return (0, checksum_1.c32checkDecode)(c32addr.slice(1));
    }
    exports.c32addressDecode = c32addressDecode3;
    function b58ToC32(b58check, version = -1) {
      const addrInfo = base58check3.decode(b58check);
      const hash160String = (0, utils_1.bytesToHex)(addrInfo.data);
      const addrVersion = parseInt((0, utils_1.bytesToHex)(addrInfo.prefix), 16);
      let stacksVersion;
      if (version < 0) {
        stacksVersion = addrVersion;
        if (ADDR_BITCOIN_TO_STACKS[addrVersion] !== void 0) {
          stacksVersion = ADDR_BITCOIN_TO_STACKS[addrVersion];
        }
      } else {
        stacksVersion = version;
      }
      return c32address4(stacksVersion, hash160String);
    }
    exports.b58ToC32 = b58ToC32;
    function c32ToB58(c32string, version = -1) {
      const addrInfo = c32addressDecode3(c32string);
      const stacksVersion = addrInfo[0];
      const hash160String = addrInfo[1];
      let bitcoinVersion;
      if (version < 0) {
        bitcoinVersion = stacksVersion;
        if (ADDR_STACKS_TO_BITCOIN[stacksVersion] !== void 0) {
          bitcoinVersion = ADDR_STACKS_TO_BITCOIN[stacksVersion];
        }
      } else {
        bitcoinVersion = version;
      }
      let prefix = bitcoinVersion.toString(16);
      if (prefix.length === 1) {
        prefix = `0${prefix}`;
      }
      return base58check3.encode(hash160String, prefix);
    }
    exports.c32ToB58 = c32ToB58;
  }
});

// upstream/node_modules/c32check/lib/index.js
var require_lib = __commonJS({
  "upstream/node_modules/c32check/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.b58ToC32 = exports.c32ToB58 = exports.versions = exports.c32normalize = exports.c32addressDecode = exports.c32address = exports.c32checkDecode = exports.c32checkEncode = exports.c32decode = exports.c32encode = void 0;
    var encoding_1 = require_encoding();
    Object.defineProperty(exports, "c32encode", { enumerable: true, get: function() {
      return encoding_1.c32encode;
    } });
    Object.defineProperty(exports, "c32decode", { enumerable: true, get: function() {
      return encoding_1.c32decode;
    } });
    Object.defineProperty(exports, "c32normalize", { enumerable: true, get: function() {
      return encoding_1.c32normalize;
    } });
    var checksum_1 = require_checksum();
    Object.defineProperty(exports, "c32checkEncode", { enumerable: true, get: function() {
      return checksum_1.c32checkEncode;
    } });
    Object.defineProperty(exports, "c32checkDecode", { enumerable: true, get: function() {
      return checksum_1.c32checkDecode;
    } });
    var address_1 = require_address();
    Object.defineProperty(exports, "c32address", { enumerable: true, get: function() {
      return address_1.c32address;
    } });
    Object.defineProperty(exports, "c32addressDecode", { enumerable: true, get: function() {
      return address_1.c32addressDecode;
    } });
    Object.defineProperty(exports, "c32ToB58", { enumerable: true, get: function() {
      return address_1.c32ToB58;
    } });
    Object.defineProperty(exports, "b58ToC32", { enumerable: true, get: function() {
      return address_1.b58ToC32;
    } });
    Object.defineProperty(exports, "versions", { enumerable: true, get: function() {
      return address_1.versions;
    } });
  }
});

// upstream/node_modules/lodash.clonedeep/index.js
var require_lodash = __commonJS({
  "upstream/node_modules/lodash.clonedeep/index.js"(exports, module) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reFlags = /\w*$/;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    function addMapEntry(map, pair) {
      map.set(pair[0], pair[1]);
      return map;
    }
    function addSetEntry(set, value) {
      set.add(value);
      return set;
    }
    function arrayEach(array2, iteratee) {
      var index = -1, length = array2 ? array2.length : 0;
      while (++index < length) {
        if (iteratee(array2[index], index, array2) === false) {
          break;
        }
      }
      return array2;
    }
    function arrayPush(array2, values) {
      var index = -1, length = values.length, offset = array2.length;
      while (++index < length) {
        array2[offset + index] = values[index];
      }
      return array2;
    }
    function arrayReduce(array2, iteratee, accumulator, initAccum) {
      var index = -1, length = array2 ? array2.length : 0;
      if (initAccum && length) {
        accumulator = array2[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array2[index], index, array2);
      }
      return accumulator;
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    })();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer2 = moduleExports ? root.Buffer : void 0;
    var Symbol2 = root.Symbol;
    var Uint8Array2 = root.Uint8Array;
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    var objectCreate = Object.create;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var nativeKeys = overArg(Object.keys, Object);
    var DataView2 = getNative(root, "DataView");
    var Map2 = getNative(root, "Map");
    var Promise2 = getNative(root, "Promise");
    var Set2 = getNative(root, "Set");
    var WeakMap2 = getNative(root, "WeakMap");
    var nativeCreate = getNative(Object, "create");
    var dataViewCtorString = toSource(DataView2);
    var mapCtorString = toSource(Map2);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set2);
    var weakMapCtorString = toSource(WeakMap2);
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function Hash2(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash2.prototype.clear = hashClear;
    Hash2.prototype["delete"] = hashDelete;
    Hash2.prototype.get = hashGet;
    Hash2.prototype.has = hashHas;
    Hash2.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash2(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash2()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }
    function stackClear() {
      this.__data__ = new ListCache();
    }
    function stackDelete(key) {
      return this.__data__["delete"](key);
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var cache = this.__data__;
      if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          return this;
        }
        cache = this.__data__ = new MapCache(pairs);
      }
      cache.set(key, value);
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        object[key] = value;
      }
    }
    function assocIndexOf(array2, key) {
      var length = array2.length;
      while (length--) {
        if (eq(array2[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }
    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== void 0) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || isFunc && !object) {
          if (isHostObject(value)) {
            return object ? value : {};
          }
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      }
      stack || (stack = new Stack());
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);
      if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
      }
      arrayEach(props || value, function(subValue, key2) {
        if (props) {
          key2 = subValue;
          subValue = value[key2];
        }
        assignValue(result, key2, baseClone(subValue, isDeep, isFull, customizer, key2, value, stack));
      });
      return result;
    }
    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    function baseGetTag(value) {
      return objectToString.call(value);
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function cloneBuffer(buffer2, isDeep) {
      if (isDeep) {
        return buffer2.slice();
      }
      var result = new buffer2.constructor(buffer2.length);
      buffer2.copy(result);
      return result;
    }
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
      return result;
    }
    function cloneDataView(dataView, isDeep) {
      var buffer2 = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer2, dataView.byteOffset, dataView.byteLength);
    }
    function cloneMap(map, isDeep, cloneFunc) {
      var array2 = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
      return arrayReduce(array2, addMapEntry, new map.constructor());
    }
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }
    function cloneSet(set, isDeep, cloneFunc) {
      var array2 = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
      return arrayReduce(array2, addSetEntry, new set.constructor());
    }
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }
    function cloneTypedArray(typedArray, isDeep) {
      var buffer2 = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer2, typedArray.byteOffset, typedArray.length);
    }
    function copyArray(source, array2) {
      var index = -1, length = source.length;
      array2 || (array2 = Array(length));
      while (++index < length) {
        array2[index] = source[index];
      }
      return array2;
    }
    function copyObject(source, props, object, customizer) {
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        assignValue(object, key, newValue === void 0 ? source[key] : newValue);
      }
      return object;
    }
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
    var getTag = baseGetTag;
    if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
      getTag = function(value) {
        var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    function initCloneArray(array2) {
      var length = array2.length, result = array2.constructor(length);
      if (length && typeof array2[0] == "string" && hasOwnProperty.call(array2, "index")) {
        result.index = array2.index;
        result.input = array2.input;
      }
      return result;
    }
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);
        case boolTag:
        case dateTag:
          return new Ctor(+object);
        case dataViewTag:
          return cloneDataView(object, isDeep);
        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
          return cloneTypedArray(object, isDeep);
        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);
        case numberTag:
        case stringTag:
          return new Ctor(object);
        case regexpTag:
          return cloneRegExp(object);
        case setTag:
          return cloneSet(object, isDeep, cloneFunc);
        case symbolTag:
          return cloneSymbol(object);
      }
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function cloneDeep2(value) {
      return baseClone(value, true, true);
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    function stubArray() {
      return [];
    }
    function stubFalse() {
      return false;
    }
    module.exports = cloneDeep2;
  }
});

// upstream/src/wallet-identity.ts
var DEFAULT_SALT = "stacks-passkey-wallet/v1";
var PRF_BYTES_LENGTH = 32;
var HKDF_INFO = "stacks-passkey-wallet/bip39-entropy/v1";
var ENTROPY_BYTES = 32;

// upstream/src/errors.ts
var PasskeyWalletError = class extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }
};
var PrfUnsupportedError = class extends PasskeyWalletError {
  reason;
  constructor(reason, message) {
    super(message ?? `WebAuthn PRF unavailable: ${reason}`);
    this.reason = reason;
  }
};
var InvalidPrfOutputError = class extends PasskeyWalletError {
};
var KeyDerivationError = class extends PasskeyWalletError {
};
var OriginAddressMismatchError = class extends PasskeyWalletError {
  derivedAddress;
  originAddress;
  constructor(derivedAddress, originAddress) {
    super(
      `Refusing to sign: the derived Stacks address ${derivedAddress} is not the transaction's origin address ${originAddress}.`
    );
    this.derivedAddress = derivedAddress;
    this.originAddress = originAddress;
  }
};
var UnprotectedAssetMovementError = class extends PasskeyWalletError {
  constructor() {
    super(
      "Refusing to sign: post-condition mode is Allow, which permits any asset movement. Use Deny mode with explicit post-conditions, or pass allowUnprotectedAssetMovement: true to sign anyway."
    );
  }
};

// upstream/node_modules/@noble/hashes/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function anumber(n, title = "") {
  if (typeof n !== "number") {
    const prefix = title && `"${title}" `;
    throw new TypeError(`${prefix}expected number, got ${typeof n}`);
  }
  if (!Number.isSafeInteger(n) || n < 0) {
    const prefix = title && `"${title}" `;
    throw new RangeError(`${prefix}expected integer >= 0, got ${n}`);
  }
}
function abytes(value, length, title = "") {
  const bytes3 = isBytes(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes3 || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes3 ? `length=${len}` : `type=${typeof value}`;
    const message = prefix + "expected Uint8Array" + ofLen + ", got " + got;
    if (!bytes3)
      throw new TypeError(message);
    throw new RangeError(message);
  }
  return value;
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new TypeError("Hash must wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
  if (h.outputLen < 1)
    throw new Error('"outputLen" must be >= 1');
  if (h.blockLen < 1)
    throw new Error('"blockLen" must be >= 1');
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out, void 0, "digestInto() output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new RangeError('"digestInto() output" expected to be of length >=' + min);
  }
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
var hasHexBuiltin = /* @__PURE__ */ (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes3) {
  abytes(bytes3);
  if (hasHexBuiltin)
    return bytes3.toHex();
  let hex4 = "";
  for (let i = 0; i < bytes3.length; i++) {
    hex4 += hexes[bytes3[i]];
  }
  return hex4;
}
var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex4) {
  if (typeof hex4 !== "string")
    throw new TypeError("hex string expected, got " + typeof hex4);
  if (hasHexBuiltin) {
    try {
      return Uint8Array.fromHex(hex4);
    } catch (error2) {
      if (error2 instanceof SyntaxError)
        throw new RangeError(error2.message);
      throw error2;
    }
  }
  const hl = hex4.length;
  const al = hl / 2;
  if (hl % 2)
    throw new RangeError("hex string expected, got unpadded hex of length " + hl);
  const array2 = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex4.charCodeAt(hi));
    const n2 = asciiToBase16(hex4.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex4[hi] + hex4[hi + 1];
      throw new RangeError('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array2[ai] = n1 * 16 + n2;
  }
  return array2;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new TypeError("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function kdfInputToBytes(data, errorTitle = "") {
  if (typeof data === "string")
    return utf8ToBytes(data);
  return abytes(data, void 0, errorTitle);
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function checkOpts(defaults, opts) {
  if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
    throw new TypeError("options must be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function createHasher(hashCons, info = {}) {
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
function randomBytes(bytesLength = 32) {
  anumber(bytesLength, "bytesLength");
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  if (bytesLength > 65536)
    throw new RangeError(`"bytesLength" expected <= 65536, got ${bytesLength}`);
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
var oidNist = (suffix) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// upstream/node_modules/@noble/hashes/hmac.js
var _HMAC = class {
  oHash;
  iHash;
  blockLen;
  outputLen;
  canXOF = false;
  finished = false;
  destroyed = false;
  constructor(hash2, key) {
    ahash(hash2);
    abytes(key, void 0, "key");
    this.iHash = hash2.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash2.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    clean(pad);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const buf = out.subarray(0, this.outputLen);
    this.iHash.digestInto(buf);
    this.oHash.update(buf);
    this.oHash.digestInto(buf);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = /* @__PURE__ */ (() => {
  const hmac_ = ((hash2, key, message) => new _HMAC(hash2, key).update(message).digest());
  hmac_.create = (hash2, key) => new _HMAC(hash2, key);
  return hmac_;
})();

// upstream/node_modules/@noble/hashes/hkdf.js
function extract(hash2, ikm, salt) {
  ahash(hash2);
  if (salt === void 0)
    salt = new Uint8Array(hash2.outputLen);
  return hmac(hash2, salt, ikm);
}
var HKDF_COUNTER = /* @__PURE__ */ Uint8Array.of(0);
var EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
function expand(hash2, prk, info, length = 32) {
  ahash(hash2);
  anumber(length, "length");
  abytes(prk, void 0, "prk");
  const olen = hash2.outputLen;
  if (prk.length < olen)
    throw new Error('"prk" must be at least HashLen octets');
  if (length > 255 * olen)
    throw new Error("Length must be <= 255*HashLen");
  const blocks = Math.ceil(length / olen);
  if (info === void 0)
    info = EMPTY_BUFFER;
  else
    abytes(info, void 0, "info");
  const okm = new Uint8Array(blocks * olen);
  const HMAC2 = hmac.create(hash2, prk);
  const HMACTmp = HMAC2._cloneInto();
  const T = new Uint8Array(HMAC2.outputLen);
  for (let counter = 0; counter < blocks; counter++) {
    HKDF_COUNTER[0] = counter + 1;
    HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
    okm.set(T, olen * counter);
    HMAC2._cloneInto(HMACTmp);
  }
  HMAC2.destroy();
  HMACTmp.destroy();
  clean(T, HKDF_COUNTER);
  return okm.slice(0, length);
}
var hkdf = (hash2, ikm, salt, info, length) => expand(hash2, extract(hash2, ikm, salt), info, length);

// upstream/node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD = class {
  blockLen;
  outputLen;
  canXOF = false;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE2) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes(data);
    const { view: view2, buffer: buffer2, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer2.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view2, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer: buffer2, view: view2, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer2[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view2, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer2[i] = 0;
    view2.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view2, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE2);
  }
  digest() {
    const { buffer: buffer2, outputLen } = this;
    this.digestInto(buffer2);
    const res = buffer2.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to ||= new this.constructor();
    to.set(...this.get());
    const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen)
      to.buffer.set(buffer2);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
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

// upstream/node_modules/@noble/hashes/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

// upstream/node_modules/@noble/hashes/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
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
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  constructor(outputLen) {
    super(64, outputLen, 8, false);
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view2.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.destroyed = true;
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = SHA256_IV[0] | 0;
  B = SHA256_IV[1] | 0;
  C = SHA256_IV[2] | 0;
  D = SHA256_IV[3] | 0;
  E = SHA256_IV[4] | 0;
  F = SHA256_IV[5] | 0;
  G = SHA256_IV[6] | 0;
  H = SHA256_IV[7] | 0;
  constructor() {
    super(32);
  }
};
var K512 = /* @__PURE__ */ (() => split([
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
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA2_64B = class extends HashMD {
  constructor(outputLen) {
    super(128, outputLen, 16, false);
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view2.getUint32(offset);
      SHA512_W_L[i] = view2.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var _SHA512 = class extends SHA2_64B {
  Ah = SHA512_IV[0] | 0;
  Al = SHA512_IV[1] | 0;
  Bh = SHA512_IV[2] | 0;
  Bl = SHA512_IV[3] | 0;
  Ch = SHA512_IV[4] | 0;
  Cl = SHA512_IV[5] | 0;
  Dh = SHA512_IV[6] | 0;
  Dl = SHA512_IV[7] | 0;
  Eh = SHA512_IV[8] | 0;
  El = SHA512_IV[9] | 0;
  Fh = SHA512_IV[10] | 0;
  Fl = SHA512_IV[11] | 0;
  Gh = SHA512_IV[12] | 0;
  Gl = SHA512_IV[13] | 0;
  Hh = SHA512_IV[14] | 0;
  Hl = SHA512_IV[15] | 0;
  constructor() {
    super(64);
  }
};
var sha256 = /* @__PURE__ */ createHasher(
  () => new _SHA256(),
  /* @__PURE__ */ oidNist(1)
);
var sha512 = /* @__PURE__ */ createHasher(
  () => new _SHA512(),
  /* @__PURE__ */ oidNist(3)
);

// upstream/node_modules/@noble/hashes/pbkdf2.js
function pbkdf2Init(hash2, _password, _salt, _opts) {
  ahash(hash2);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  anumber(c, "c");
  anumber(dkLen, "dkLen");
  anumber(asyncTick, "asyncTick");
  if (c < 1)
    throw new Error("iterations (c) must be >= 1");
  if (dkLen < 1)
    throw new Error('"dkLen" must be >= 1');
  if (dkLen > (2 ** 32 - 1) * hash2.outputLen)
    throw new Error("derived key too long");
  const password = kdfInputToBytes(_password, "password");
  const salt = kdfInputToBytes(_salt, "salt");
  const DK = new Uint8Array(dkLen);
  const PRF = hmac.create(hash2, password);
  const PRFSalt = PRF._cloneInto().update(salt);
  return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
  PRF.destroy();
  PRFSalt.destroy();
  if (prfW)
    prfW.destroy();
  clean(u);
  return DK;
}
function pbkdf2(hash2, password, salt, opts) {
  const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash2, password, salt, opts);
  let prfW;
  const arr = new Uint8Array(4);
  const view2 = createView(arr);
  const u = new Uint8Array(PRF.outputLen);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
    const Ti = DK.subarray(pos, pos + PRF.outputLen);
    view2.setInt32(0, ti, false);
    (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
    Ti.set(u.subarray(0, Ti.length));
    for (let ui = 1; ui < c; ui++) {
      PRF._cloneInto(prfW).update(u).digestInto(u);
      for (let i = 0; i < Ti.length; i++)
        Ti[i] ^= u[i];
    }
  }
  return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}

// upstream/node_modules/@scure/base/index.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function abytes2(b) {
  if (!isBytes2(b))
    throw new TypeError("Uint8Array expected");
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function afn(input) {
  if (typeof input !== "function")
    throw new TypeError("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new TypeError(`${label}: string expected`);
  return true;
}
function anumber2(n) {
  if (typeof n !== "number")
    throw new TypeError(`number expected, got ${typeof n}`);
  if (!Number.isSafeInteger(n))
    throw new RangeError(`invalid integer: ${n}`);
}
function aArr(input) {
  if (!Array.isArray(input))
    throw new TypeError("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input))
    throw new TypeError(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new TypeError(`${label}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function chain(...args) {
  const id = (a) => a;
  const wrap2 = (a, b) => (c) => a(b(c));
  const encode = args.map((x) => x.encode).reduceRight(wrap2, id);
  const decode = args.map((x) => x.decode).reduce(wrap2, id);
  return { encode, decode };
}
// @__NO_SIDE_EFFECTS__
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l, i) => [l, i]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i) => {
        if (!Number.isSafeInteger(i) || i < 0 || i >= len)
          throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
        return lettersA[i];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i = indexes.get(letter);
        if (i === void 0)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i;
      });
    }
  };
}
// @__NO_SIDE_EFFECTS__
function join(separator = "") {
  astr("join", separator);
  return {
    encode: (from) => {
      astrArr("join.decode", from);
      return from.join(separator);
    },
    decode: (to) => {
      astr("join.decode", to);
      return to.split(separator);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function padding(bits, chr = "=") {
  anumber2(bits);
  astr("padding", chr);
  return {
    encode(data) {
      astrArr("padding.encode", data);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      astrArr("padding.decode", input);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const last = end - 1;
        const byte = last * bits;
        if (byte % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function normalize(fn) {
  afn(fn);
  return { encode: (from) => from, decode: (to) => fn(to) };
}
function convertRadix(data, from, to) {
  if (from < 2)
    throw new RangeError(`convertRadix: invalid from=${from}, base cannot be less than 2`);
  if (to < 2)
    throw new RangeError(`convertRadix: invalid to=${to}, base cannot be less than 2`);
  aArr(data);
  if (!data.length)
    return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data, (d) => {
    anumber2(d);
    if (d < 0 || d >= from)
      throw new Error(`invalid integer: ${d}`);
    return d;
  });
  const dlen = digits.length;
  while (true) {
    let carry = 0;
    let done = true;
    for (let i = pos; i < dlen; i++) {
      const digit = digits[i];
      const fromCarry = from * carry;
      const digitBase = fromCarry + digit;
      if (!Number.isSafeInteger(digitBase) || fromCarry / from !== carry || digitBase - digit !== fromCarry) {
        throw new Error("convertRadix: carry overflow");
      }
      const div = digitBase / to;
      carry = digitBase % to;
      const rounded = Math.floor(div);
      digits[i] = rounded;
      if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
        throw new Error("convertRadix: carry overflow");
      if (!done)
        continue;
      else if (!rounded)
        pos = i;
      else
        done = false;
    }
    res.push(carry);
    if (done)
      break;
  }
  for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
    res.push(0);
  return res.reverse();
}
var gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
var radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
var powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i = 0; i < 40; i++)
    res.push(2 ** i);
  return res;
})();
function convertRadix2(data, from, to, padding2) {
  aArr(data);
  if (from <= 0 || from > 32)
    throw new RangeError(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32)
    throw new RangeError(`convertRadix2: wrong to=${to}`);
  if (/* @__PURE__ */ radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const max = powers[from];
  const mask = powers[to] - 1;
  const res = [];
  for (const n of data) {
    anumber2(n);
    if (n >= max)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to)
      res.push((carry >> pos - to & mask) >>> 0);
    const pow = powers[pos];
    if (pow === void 0)
      throw new Error("invalid carry");
    carry &= pow - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding2 && pos >= from)
    throw new Error("Excess padding");
  if (!padding2 && carry > 0)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding2 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
// @__NO_SIDE_EFFECTS__
function radix(num2) {
  anumber2(num2);
  const _256 = 2 ** 8;
  return {
    encode: (bytes3) => {
      if (!isBytes2(bytes3))
        throw new TypeError("radix.encode input should be Uint8Array");
      return convertRadix(Array.from(bytes3), _256, num2);
    },
    decode: (digits) => {
      anumArr("radix.decode", digits);
      return Uint8Array.from(convertRadix(digits, num2, _256));
    }
  };
}
// @__NO_SIDE_EFFECTS__
function radix2(bits, revPadding = false) {
  anumber2(bits);
  if (bits <= 0 || bits > 32)
    throw new RangeError("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32)
    throw new RangeError("radix2: carry overflow");
  return {
    encode: (bytes3) => {
      if (!isBytes2(bytes3))
        throw new TypeError("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes3), 8, bits, !revPadding);
    },
    decode: (digits) => {
      anumArr("radix2.decode", digits);
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function unsafeWrapper(fn) {
  afn(fn);
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
function checksum(len, fn) {
  anumber2(len);
  if (len <= 0)
    throw new RangeError(`checksum length must be positive: ${len}`);
  afn(fn);
  const _fn = fn;
  return {
    encode(data) {
      if (!isBytes2(data))
        throw new TypeError("checksum.encode: input should be Uint8Array");
      const sum = _fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      if (!isBytes2(data))
        throw new TypeError("checksum.decode: input should be Uint8Array");
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = _fn(payload).slice(0, len);
      for (let i = 0; i < len; i++)
        if (newChecksum[i] !== oldChecksum[i])
          throw new Error("Invalid checksum");
      return payload;
    }
  };
}
var utils = /* @__PURE__ */ Object.freeze({
  alphabet,
  chain,
  checksum,
  convertRadix,
  convertRadix2,
  radix,
  radix2,
  join,
  padding
});
var genBase58 = /* @__NO_SIDE_EFFECTS__ */ (abc) => /* @__PURE__ */ chain(/* @__PURE__ */ radix(58), /* @__PURE__ */ alphabet(abc), /* @__PURE__ */ join(""));
var base58 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
var createBase58check = (sha2564) => {
  afn(sha2564);
  const _sha256 = sha2564;
  return /* @__PURE__ */ chain(checksum(4, (data) => _sha256(_sha256(data))), base58);
};
var BECH_ALPHABET = /* @__PURE__ */ chain(/* @__PURE__ */ alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ join(""));
var POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
    if ((b >> i & 1) === 1)
      chk ^= POLYMOD_GENERATORS[i];
  }
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126)
      throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++)
    chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 31;
  for (let v of words)
    chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++)
    chk = bech32Polymod(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
}
// @__NO_SIDE_EFFECTS__
function genBech32(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = /* @__PURE__ */ radix2(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode(prefix, words, limit = 90) {
    astr("bech32.encode prefix", prefix);
    if (isBytes2(words))
      words = Array.from(words);
    anumArr("bech32.encode", words);
    const plen = prefix.length;
    if (plen === 0)
      throw new TypeError(`Invalid prefix length ${plen}`);
    const actualLength = plen + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    const lowered = prefix.toLowerCase();
    const sum = bechChecksum(lowered, words, ENCODING_CONST);
    return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
  }
  function decode(str, limit = 90) {
    astr("bech32.decode input", str);
    const slen = str.length;
    if (slen < 8 || limit !== false && slen > limit)
      throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase())
      throw new Error(`String must be lowercase or uppercase`);
    const sepIndex = lowered.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = lowered.slice(0, sepIndex);
    const data = lowered.slice(sepIndex + 1);
    if (data.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const words = BECH_ALPHABET.decode(data).slice(0, -6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!data.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return { prefix, words };
  }
  const decodeUnsafe = unsafeWrapper(decode);
  function decodeToBytes(str) {
    const { prefix, words } = decode(str, false);
    return {
      prefix,
      words,
      bytes: fromWords(words)
    };
  }
  function encodeFromBytes(prefix, bytes3) {
    return encode(prefix, toWords(bytes3));
  }
  return {
    encode,
    decode,
    encodeFromBytes,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
var bech32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ genBech32("bech32"));
var bech32m = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ genBech32("bech32m"));
var hasHexBuiltin2 = /* @__PURE__ */ (() => (
  // Require both directions before enabling the native hex path so encode/decode stay symmetric.
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexBuiltin = {
  // Keep local type guards so the native path preserves library-level input errors.
  // Native toHex emits lowercase hex, matching the fallback alphabet and Node's hex strings.
  encode(data) {
    abytes2(data);
    return data.toHex();
  },
  // Native fromHex accepts either hex case and rejects odd-length / non-hex syntax.
  decode(s) {
    astr("hex", s);
    return Uint8Array.fromHex(s);
  }
};
var hex = /* @__PURE__ */ Object.freeze(hasHexBuiltin2 ? hexBuiltin : /* @__PURE__ */ chain(/* @__PURE__ */ radix2(4), /* @__PURE__ */ alphabet("0123456789abcdef"), /* @__PURE__ */ join(""), /* @__PURE__ */ normalize((s) => {
  if (typeof s !== "string" || s.length % 2 !== 0)
    throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
  return s.toLowerCase();
})));

// upstream/node_modules/@scure/bip39/index.js
var isJapanese = (wordlist2) => wordlist2[0] === "\u3042\u3044\u3053\u304F\u3057\u3093";
function nfkd(str) {
  if (typeof str !== "string")
    throw new TypeError("invalid mnemonic type: " + typeof str);
  return str.normalize("NFKD");
}
function normalize2(str) {
  const norm = nfkd(str);
  const words = norm.split(" ");
  if (![12, 15, 18, 21, 24].includes(words.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: norm, words };
}
function aentropy(ent) {
  abytes(ent);
  if (![16, 20, 24, 28, 32].includes(ent.length))
    throw new RangeError("invalid entropy length");
}
var calcChecksum = (entropy) => {
  const bitsLeft = 8 - entropy.length / 4;
  return new Uint8Array([sha256(entropy)[0] >> bitsLeft << bitsLeft]);
};
function getCoder(wordlist2) {
  if (!Array.isArray(wordlist2) || wordlist2.length !== 2048 || typeof wordlist2[0] !== "string")
    throw new TypeError("Wordlist: expected array of 2048 strings");
  wordlist2.forEach((i) => {
    if (typeof i !== "string")
      throw new TypeError("wordlist: non-string element: " + i);
  });
  return utils.chain(utils.checksum(1, calcChecksum), utils.radix2(11, true), utils.alphabet(wordlist2));
}
function entropyToMnemonic(entropy, wordlist2) {
  aentropy(entropy);
  const words = getCoder(wordlist2).encode(entropy);
  return words.join(isJapanese(wordlist2) ? "\u3000" : " ");
}
var psalt = (passphrase) => nfkd("mnemonic" + passphrase);
function mnemonicToSeedSync(mnemonic, passphrase = "") {
  return pbkdf2(sha512, normalize2(mnemonic).nfkd, psalt(passphrase), {
    c: 2048,
    dkLen: 64
  });
}

// upstream/node_modules/@scure/bip39/wordlists/english.js
var wordlist = /* @__PURE__ */ Object.freeze(`abandon
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
zoo`.split("\n"));

// upstream/node_modules/@noble/curves/utils.js
var abytes3 = (value, length, title) => abytes(value, length, title);
var anumber3 = anumber;
var bytesToHex2 = bytesToHex;
var concatBytes2 = (...arrays) => concatBytes(...arrays);
var hexToBytes2 = (hex4) => hexToBytes(hex4);
var isBytes3 = isBytes;
var randomBytes2 = (bytesLength) => randomBytes(bytesLength);
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
function abool(value, title = "") {
  if (typeof value !== "boolean") {
    const prefix = title && `"${title}" `;
    throw new TypeError(prefix + "expected boolean, got type=" + typeof value);
  }
  return value;
}
function abignumber(n) {
  if (typeof n === "bigint") {
    if (!isPosBig(n))
      throw new RangeError("positive bigint expected, got " + n);
  } else
    anumber3(n);
  return n;
}
function asafenumber(value, title = "") {
  if (typeof value !== "number") {
    const prefix = title && `"${title}" `;
    throw new TypeError(prefix + "expected number, got type=" + typeof value);
  }
  if (!Number.isSafeInteger(value)) {
    const prefix = title && `"${title}" `;
    throw new RangeError(prefix + "expected safe integer, got " + value);
  }
}
function numberToHexUnpadded(num2) {
  const hex4 = abignumber(num2).toString(16);
  return hex4.length & 1 ? "0" + hex4 : hex4;
}
function hexToNumber(hex4) {
  if (typeof hex4 !== "string")
    throw new TypeError("hex string expected, got " + typeof hex4);
  return hex4 === "" ? _0n : BigInt("0x" + hex4);
}
function bytesToNumberBE(bytes3) {
  return hexToNumber(bytesToHex(bytes3));
}
function bytesToNumberLE(bytes3) {
  return hexToNumber(bytesToHex(copyBytes(abytes(bytes3)).reverse()));
}
function numberToBytesBE(n, len) {
  anumber(len);
  if (len === 0)
    throw new RangeError("zero length");
  n = abignumber(n);
  const hex4 = n.toString(16);
  if (hex4.length > len * 2)
    throw new RangeError("number too large");
  return hexToBytes(hex4.padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function copyBytes(bytes3) {
  return Uint8Array.from(abytes3(bytes3));
}
function asciiToBytes(ascii) {
  if (typeof ascii !== "string")
    throw new TypeError("ascii string expected, got " + typeof ascii);
  return Uint8Array.from(ascii, (c, i) => {
    const charCode = c.charCodeAt(0);
    if (c.length !== 1 || charCode > 127) {
      throw new RangeError(`string contains non-ASCII character "${ascii[i]}" with code ${charCode} at position ${i}`);
    }
    return charCode;
  });
}
var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new RangeError("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  if (n < _0n)
    throw new Error("expected non-negative bigint, got " + n);
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
var bitMask = (n) => (_1n << BigInt(n)) - _1n;
function createHmacDrbg(hashLen2, qByteLen, hmacFn) {
  anumber(hashLen2, "hashLen");
  anumber(qByteLen, "qByteLen");
  if (typeof hmacFn !== "function")
    throw new TypeError("hmacFn must be a function");
  const u8n = (len) => new Uint8Array(len);
  const NULL = Uint8Array.of();
  const byte0 = Uint8Array.of(0);
  const byte1 = Uint8Array.of(1);
  const _maxDrbgIters = 1e3;
  let v = u8n(hashLen2);
  let k = u8n(hashLen2);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...msgs) => hmacFn(k, concatBytes2(v, ...msgs));
  const reseed = (seed = NULL) => {
    k = h(byte0, seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(byte1, seed);
    v = h();
  };
  const gen = () => {
    if (i++ >= _maxDrbgIters)
      throw new Error("drbg: tried max amount of iterations");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while ((res = pred(gen())) === void 0)
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object, fields = {}, optFields = {}) {
  if (Object.prototype.toString.call(object) !== "[object Object]")
    throw new TypeError("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    if (!isOpt && expectedType !== "function" && !Object.hasOwn(object, fieldName))
      throw new TypeError(`param "${fieldName}" is invalid: expected own property`);
    const val = object[fieldName];
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new TypeError(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  const iter = (f2, isOpt) => Object.entries(f2).forEach(([k, v]) => checkField(k, v, isOpt));
  iter(fields, false);
  iter(optFields, true);
}

// upstream/node_modules/@noble/curves/abstract/modular.js
var _0n2 = /* @__PURE__ */ BigInt(0);
var _1n2 = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
var _3n = /* @__PURE__ */ BigInt(3);
var _4n = /* @__PURE__ */ BigInt(4);
var _5n = /* @__PURE__ */ BigInt(5);
var _7n = /* @__PURE__ */ BigInt(7);
var _8n = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
  if (b <= _0n2)
    throw new Error("mod: expected positive modulus, got " + b);
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow2(x, power, modulo) {
  if (power < _0n2)
    throw new Error("pow2: expected non-negative exponent, got " + power);
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number2, modulo) {
  if (number2 === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n2)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number2, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b - a * q;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd2 = b;
  if (gcd2 !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
  const F = Fp;
  if (!F.eql(F.sqr(root), n))
    throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp, n) {
  const F = Fp;
  const p1div4 = (F.ORDER + _1n2) / _4n;
  const root = F.pow(n, p1div4);
  assertIsSquare(F, root, n);
  return root;
}
function sqrt5mod8(Fp, n) {
  const F = Fp;
  const p5div8 = (F.ORDER - _5n) / _8n;
  const n2 = F.mul(n, _2n);
  const v = F.pow(n2, p5div8);
  const nv = F.mul(n, v);
  const i = F.mul(F.mul(nv, _2n), v);
  const root = F.mul(nv, F.sub(i, F.ONE));
  assertIsSquare(F, root, n);
  return root;
}
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n) / _16n;
  return ((Fp, n) => {
    const F = Fp;
    let tv1 = F.pow(n, c4);
    let tv2 = F.mul(tv1, c1);
    const tv3 = F.mul(tv1, c2);
    const tv4 = F.mul(tv1, c3);
    const e1 = F.eql(F.sqr(tv2), n);
    const e2 = F.eql(F.sqr(tv3), n);
    tv1 = F.cmov(tv1, tv2, e1);
    tv2 = F.cmov(tv4, tv3, e2);
    const e3 = F.eql(F.sqr(tv2), n);
    const root = F.cmov(tv1, tv2, e3);
    assertIsSquare(F, root, n);
    return root;
  });
}
function tonelliShanks(P) {
  if (P < _3n)
    throw new Error("sqrt is not defined for small field");
  let Q = P - _1n2;
  let S = 0;
  while (Q % _2n === _0n2) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n2) / _2n;
  return function tonelliSlow(Fp, n) {
    const F = Fp;
    if (F.is0(n))
      return n;
    if (FpLegendre(F, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = F.mul(F.ONE, cc);
    let t = F.pow(n, Q);
    let R = F.pow(n, Q1div2);
    while (!F.eql(t, F.ONE)) {
      if (F.is0(t))
        return F.ZERO;
      let i = 1;
      let t_tmp = F.sqr(t);
      while (!F.eql(t_tmp, F.ONE)) {
        i++;
        t_tmp = F.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M - i - 1);
      const b = F.pow(c, exponent);
      M = i;
      c = F.sqr(b);
      t = F.mul(t, c);
      R = F.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  if (P % _16n === _9n)
    return sqrt9mod16(P);
  return tonelliShanks(P);
}
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  validateObject(field, opts);
  asafenumber(field.BYTES, "BYTES");
  asafenumber(field.BITS, "BITS");
  if (field.BYTES < 1 || field.BITS < 1)
    throw new Error("invalid field: expected BYTES/BITS > 0");
  if (field.ORDER <= _1n2)
    throw new Error("invalid field: expected ORDER > 1, got " + field.ORDER);
  return field;
}
function FpPow(Fp, num2, power) {
  const F = Fp;
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return F.ONE;
  if (power === _1n2)
    return num2;
  let p = F.ONE;
  let d = num2;
  while (power > _0n2) {
    if (power & _1n2)
      p = F.mul(p, d);
    d = F.sqr(d);
    power >>= _1n2;
  }
  return p;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  const F = Fp;
  const inverted = new Array(nums.length).fill(passZero ? F.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num2, i) => {
    if (F.is0(num2))
      return acc;
    inverted[i] = acc;
    return F.mul(acc, num2);
  }, F.ONE);
  const invertedAcc = F.inv(multipliedAcc);
  nums.reduceRight((acc, num2, i) => {
    if (F.is0(num2))
      return acc;
    inverted[i] = F.mul(acc, inverted[i]);
    return F.mul(acc, num2);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  const F = Fp;
  const p1mod2 = (F.ORDER - _1n2) / _2n;
  const powered = F.pow(n, p1mod2);
  const yes = F.eql(powered, F.ONE);
  const zero = F.eql(powered, F.ZERO);
  const no = F.eql(powered, F.neg(F.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber3(nBitLength);
  if (n <= _0n2)
    throw new Error("invalid n length: expected positive n, got " + n);
  if (nBitLength !== void 0 && nBitLength < 1)
    throw new Error("invalid n length: expected positive bit length, got " + nBitLength);
  const bits = bitLen(n);
  if (nBitLength !== void 0 && nBitLength < bits)
    throw new Error(`invalid n length: expected bit length (${bits}) >= n.length (${nBitLength})`);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : bits;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
var FIELD_SQRT = /* @__PURE__ */ new WeakMap();
var _Field = class {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = _0n2;
  ONE = _1n2;
  _lengths;
  _mod;
  constructor(ORDER, opts = {}) {
    if (ORDER <= _1n2)
      throw new Error("invalid field: expected ORDER > 1, got " + ORDER);
    let _nbitLength = void 0;
    this.isLE = false;
    if (opts != null && typeof opts === "object") {
      if (typeof opts.BITS === "number")
        _nbitLength = opts.BITS;
      if (typeof opts.sqrt === "function")
        Object.defineProperty(this, "sqrt", { value: opts.sqrt, enumerable: true });
      if (typeof opts.isLE === "boolean")
        this.isLE = opts.isLE;
      if (opts.allowedLengths)
        this._lengths = Object.freeze(opts.allowedLengths.slice());
      if (typeof opts.modFromBytes === "boolean")
        this._mod = opts.modFromBytes;
    }
    const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
    if (nByteLength > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = ORDER;
    this.BITS = nBitLength;
    this.BYTES = nByteLength;
    Object.freeze(this);
  }
  create(num2) {
    return mod(num2, this.ORDER);
  }
  isValid(num2) {
    if (typeof num2 !== "bigint")
      throw new TypeError("invalid field element: expected bigint, got " + typeof num2);
    return _0n2 <= num2 && num2 < this.ORDER;
  }
  is0(num2) {
    return num2 === _0n2;
  }
  // is valid and invertible
  isValidNot0(num2) {
    return !this.is0(num2) && this.isValid(num2);
  }
  isOdd(num2) {
    return (num2 & _1n2) === _1n2;
  }
  neg(num2) {
    return mod(-num2, this.ORDER);
  }
  eql(lhs, rhs) {
    return lhs === rhs;
  }
  sqr(num2) {
    return mod(num2 * num2, this.ORDER);
  }
  add(lhs, rhs) {
    return mod(lhs + rhs, this.ORDER);
  }
  sub(lhs, rhs) {
    return mod(lhs - rhs, this.ORDER);
  }
  mul(lhs, rhs) {
    return mod(lhs * rhs, this.ORDER);
  }
  pow(num2, power) {
    return FpPow(this, num2, power);
  }
  div(lhs, rhs) {
    return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(num2) {
    return num2 * num2;
  }
  addN(lhs, rhs) {
    return lhs + rhs;
  }
  subN(lhs, rhs) {
    return lhs - rhs;
  }
  mulN(lhs, rhs) {
    return lhs * rhs;
  }
  inv(num2) {
    return invert(num2, this.ORDER);
  }
  sqrt(num2) {
    let sqrt = FIELD_SQRT.get(this);
    if (!sqrt)
      FIELD_SQRT.set(this, sqrt = FpSqrt(this.ORDER));
    return sqrt(this, num2);
  }
  toBytes(num2) {
    return this.isLE ? numberToBytesLE(num2, this.BYTES) : numberToBytesBE(num2, this.BYTES);
  }
  fromBytes(bytes3, skipValidation = false) {
    abytes3(bytes3);
    const { _lengths: allowedLengths, BYTES, isLE: isLE2, ORDER, _mod: modFromBytes } = this;
    if (allowedLengths) {
      if (bytes3.length < 1 || !allowedLengths.includes(bytes3.length) || bytes3.length > BYTES) {
        throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes3.length);
      }
      const padded = new Uint8Array(BYTES);
      padded.set(bytes3, isLE2 ? 0 : padded.length - bytes3.length);
      bytes3 = padded;
    }
    if (bytes3.length !== BYTES)
      throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes3.length);
    let scalar = isLE2 ? bytesToNumberLE(bytes3) : bytesToNumberBE(bytes3);
    if (modFromBytes)
      scalar = mod(scalar, ORDER);
    if (!skipValidation) {
      if (!this.isValid(scalar))
        throw new Error("invalid field element: outside of range 0..ORDER");
    }
    return scalar;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(lst) {
    return FpInvertBatch(this, lst);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(a, b, condition) {
    abool(condition, "condition");
    return condition ? b : a;
  }
};
Object.freeze(_Field.prototype);
function Field(ORDER, opts = {}) {
  return new _Field(ORDER, opts);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  if (fieldOrder <= _1n2)
    throw new Error("field order must be greater than 1");
  const bitLength = bitLen(fieldOrder - _1n2);
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  abytes3(key);
  const len = key.length;
  const fieldLen2 = getFieldBytesLength(fieldOrder);
  const minLen = Math.max(getMinHashLength(fieldOrder), 16);
  if (len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num2 = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num2, fieldOrder - _1n2) + _1n2;
  return isLE2 ? numberToBytesLE(reduced, fieldLen2) : numberToBytesBE(reduced, fieldLen2);
}

// upstream/node_modules/@noble/curves/abstract/curve.js
var _0n3 = /* @__PURE__ */ BigInt(0);
var _1n3 = /* @__PURE__ */ BigInt(1);
function negateCt(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function normalizeZ(c, points) {
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window2, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n3;
  }
  const offsetStart = window2 * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window2 % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
  if (n !== _0n3)
    throw new Error("invalid wNAF");
}
var wNAF = class {
  BASE;
  ZERO;
  Fn;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(Point4, bits) {
    this.BASE = Point4.BASE;
    this.ZERO = Point4.ZERO;
    this.Fn = Point4.Fn;
    this.bits = bits;
  }
  // non-const time multiplication ladder
  _unsafeLadder(elm, n, p = this.ZERO) {
    let d = elm;
    while (n > _0n3) {
      if (n & _1n3)
        p = p.add(d);
      d = d.double();
      n >>= _1n3;
    }
    return p;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point - Point instance
   * @param W - window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(point, W) {
    const { windows, windowSize } = calcWOpts(W, this.bits);
    const points = [];
    let p = point;
    let base = p;
    for (let window2 = 0; window2 < windows; window2++) {
      base = p;
      points.push(base);
      for (let i = 1; i < windowSize; i++) {
        base = base.add(p);
        points.push(base);
      }
      p = base.double();
    }
    return points;
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(W, precomputes, n) {
    if (!this.Fn.isValid(n))
      throw new Error("invalid scalar");
    let p = this.ZERO;
    let f2 = this.BASE;
    const wo = calcWOpts(W, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
      n = nextN;
      if (isZero) {
        f2 = f2.add(negateCt(isNegF, precomputes[offsetF]));
      } else {
        p = p.add(negateCt(isNeg, precomputes[offset]));
      }
    }
    assert0(n);
    return { p, f: f2 };
  }
  /**
   * Implements unsafe EC multiplication using precomputed tables
   * and w-ary non-adjacent form.
   * @param acc - accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
    const wo = calcWOpts(W, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      if (n === _0n3)
        break;
      const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
      n = nextN;
      if (isZero) {
        continue;
      } else {
        const item = precomputes[offset];
        acc = acc.add(isNeg ? item.negate() : item);
      }
    }
    assert0(n);
    return acc;
  }
  getPrecomputes(W, point, transform) {
    let comp = pointPrecomputes.get(point);
    if (!comp) {
      comp = this.precomputeWindow(point, W);
      if (W !== 1) {
        if (typeof transform === "function")
          comp = transform(comp);
        pointPrecomputes.set(point, comp);
      }
    }
    return comp;
  }
  cached(point, scalar, transform) {
    const W = getW(point);
    return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
  }
  unsafe(point, scalar, transform, prev) {
    const W = getW(point);
    if (W === 1)
      return this._unsafeLadder(point, scalar, prev);
    return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(P, W) {
    validateW(W, this.bits);
    pointWindowSizes.set(P, W);
    pointPrecomputes.delete(P);
  }
  hasCache(elm) {
    return getW(elm) !== 1;
  }
};
function mulEndoUnsafe(Point4, point, k1, k2) {
  let acc = point;
  let p1 = Point4.ZERO;
  let p2 = Point4.ZERO;
  while (k1 > _0n3 || k2 > _0n3) {
    if (k1 & _1n3)
      p1 = p1.add(acc);
    if (k2 & _1n3)
      p2 = p2.add(acc);
    acc = acc.double();
    k1 >>= _1n3;
    k2 >>= _1n3;
  }
  return { p1, p2 };
}
function createField(order, field, isLE2) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE: isLE2 });
  }
}
function createCurveFields(type, CURVE2, curveOpts = {}, FpFnLE) {
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE2 || typeof CURVE2 !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE2[p];
    if (!(typeof val === "bigint" && val > _0n3))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE2.p, curveOpts.Fp, FpFnLE);
  const Fn2 = createField(CURVE2.n, curveOpts.Fn, FpFnLE);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp.isValid(CURVE2[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE2 = Object.freeze(Object.assign({}, CURVE2));
  return { CURVE: CURVE2, Fp, Fn: Fn2 };
}
function createKeygen(randomSecretKey, getPublicKey2) {
  return function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey2(secretKey) };
  };
}

// upstream/node_modules/@noble/curves/abstract/weierstrass.js
var divNearest = (num2, den) => (num2 + (num2 >= 0 ? den : -den) / _2n2) / den;
function _splitEndoScalar(k, basis, n) {
  aInRange("scalar", k, _0n4, n);
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k, n);
  const c2 = divNearest(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n4;
  const k2neg = k2 < _0n4;
  if (k1neg)
    k1 = -k1;
  if (k2neg)
    k2 = -k2;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
  if (k1 < _0n4 || k1 >= MAX_NUM || k2 < _0n4 || k2 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed for k");
  }
  return { k1neg, k1, k2neg, k2 };
}
function validateSigFormat(format) {
  if (!["compact", "recovered", "der"].includes(format))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format;
}
function validateSigOpts(opts, def) {
  validateObject(opts);
  const optsn = {};
  for (let optName of Object.keys(def)) {
    optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
  }
  abool(optsn.lowS, "lowS");
  abool(optsn.prehash, "prehash");
  if (optsn.format !== void 0)
    validateSigFormat(optsn.format);
  return optsn;
}
var DERErr = class extends Error {
  constructor(m = "") {
    super(m);
  }
};
var DER = {
  // asn.1 DER encoding utils
  Err: DERErr,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (tag, data) => {
      const { Err: E } = DER;
      asafenumber(tag, "tag");
      if (tag < 0 || tag > 255)
        throw new E("tlv.encode: wrong tag");
      if (typeof data !== "string")
        throw new TypeError('"data" expected string, got type=' + typeof data);
      if (data.length & 1)
        throw new E("tlv.encode: unpadded data");
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if (len.length / 2 & 128)
        throw new E("tlv.encode: long form length too big");
      const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
      const t = numberToHexUnpadded(tag);
      return t + lenLen + len + data;
    },
    // v - value, l - left bytes (unparsed)
    decode(tag, data) {
      const { Err: E } = DER;
      data = abytes3(data, void 0, "DER data");
      let pos = 0;
      if (tag < 0 || tag > 255)
        throw new E("tlv.encode: wrong tag");
      if (data.length < 2 || data[pos++] !== tag)
        throw new E("tlv.decode: wrong tlv");
      const first = data[pos++];
      const isLong = !!(first & 128);
      let length = 0;
      if (!isLong)
        length = first;
      else {
        const lenLen = first & 127;
        if (!lenLen)
          throw new E("tlv.decode(long): indefinite length not supported");
        if (lenLen > 4)
          throw new E("tlv.decode(long): byte length is too big");
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen)
          throw new E("tlv.decode: length bytes not complete");
        if (lengthBytes[0] === 0)
          throw new E("tlv.decode(long): zero leftmost byte");
        for (const b of lengthBytes)
          length = length << 8 | b;
        pos += lenLen;
        if (length < 128)
          throw new E("tlv.decode(long): not minimal encoding");
      }
      const v = data.subarray(pos, pos + length);
      if (v.length !== length)
        throw new E("tlv.decode: wrong value length");
      return { v, l: data.subarray(pos + length) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num2) {
      const { Err: E } = DER;
      abignumber(num2);
      if (num2 < _0n4)
        throw new E("integer: negative integers are not allowed");
      let hex4 = numberToHexUnpadded(num2);
      if (Number.parseInt(hex4[0], 16) & 8)
        hex4 = "00" + hex4;
      if (hex4.length & 1)
        throw new E("unexpected DER parsing assertion: unpadded hex");
      return hex4;
    },
    decode(data) {
      const { Err: E } = DER;
      if (data.length < 1)
        throw new E("invalid signature integer: empty");
      if (data[0] & 128)
        throw new E("invalid signature integer: negative");
      if (data.length > 1 && data[0] === 0 && !(data[1] & 128))
        throw new E("invalid signature integer: unnecessary leading zero");
      return bytesToNumberBE(data);
    }
  },
  toSig(bytes3) {
    const { Err: E, _int: int2, _tlv: tlv } = DER;
    const data = abytes3(bytes3, void 0, "signature");
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    return { r: int2.decode(rBytes), s: int2.decode(sBytes) };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int2 } = DER;
    const rs = tlv.encode(2, int2.encode(sig.r));
    const ss = tlv.encode(2, int2.encode(sig.s));
    const seq = rs + ss;
    return tlv.encode(48, seq);
  }
};
Object.freeze(DER._tlv);
Object.freeze(DER._int);
Object.freeze(DER);
var _0n4 = /* @__PURE__ */ BigInt(0);
var _1n4 = /* @__PURE__ */ BigInt(1);
var _2n2 = /* @__PURE__ */ BigInt(2);
var _3n2 = /* @__PURE__ */ BigInt(3);
var _4n2 = /* @__PURE__ */ BigInt(4);
function weierstrass(params, extraOpts = {}) {
  const validated = createCurveFields("weierstrass", params, extraOpts);
  const Fp = validated.Fp;
  const Fn2 = validated.Fn;
  let CURVE2 = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE2;
  validateObject(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object"
  });
  const { endo: endo2, allowInfinityPoint } = extraOpts;
  if (endo2) {
    if (!Fp.is0(CURVE2.a) || typeof endo2.beta !== "bigint" || !Array.isArray(endo2.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const lengths = getWLengths(Fp, Fn2);
  function assertCompressionIsSupported() {
    if (!Fp.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes2(_c, point, isCompressed) {
    if (allowInfinityPoint && point.is0())
      return Uint8Array.of(0);
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    abool(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp.isOdd(y);
      return concatBytes2(pprefix(hasEvenY), bx);
    } else {
      return concatBytes2(Uint8Array.of(4), bx, Fp.toBytes(y));
    }
  }
  function pointFromBytes(bytes3) {
    abytes3(bytes3, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length = bytes3.length;
    const head = bytes3[0];
    const tail = bytes3.subarray(1);
    if (allowInfinityPoint && length === 1 && head === 0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (length === comp && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const evenY = Fp.isOdd(y);
      const evenH = (head & 1) === 1;
      if (evenH !== evenY)
        y = Fp.neg(y);
      return { x, y };
    } else if (length === uncomp && head === 4) {
      const L = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L));
      const y = Fp.fromBytes(tail.subarray(L, L * 2));
      if (!isValidXY(x, y))
        throw new Error("bad point: is not on curve");
      return { x, y };
    } else {
      throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  const encodePoint = extraOpts.toBytes === void 0 ? pointToBytes2 : extraOpts.toBytes;
  const decodePoint = extraOpts.fromBytes === void 0 ? pointFromBytes : extraOpts.fromBytes;
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, CURVE2.a)), CURVE2.b);
  }
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE2.Gx, CURVE2.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE2.a, _3n2), _4n2);
  const _27b2 = Fp.mul(Fp.sqr(CURVE2.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || banZero && Fp.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point4))
      throw new Error("Weierstrass Point expected");
  }
  function splitEndoScalarN(k) {
    if (!endo2 || !endo2.basises)
      throw new Error("no endo");
    return _splitEndoScalar(k, endo2.basises, Fn2.ORDER);
  }
  function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
    k2p = new Point4(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
    k1p = negateCt(k1neg, k1p);
    k2p = negateCt(k2neg, k2p);
    return k1p.add(k2p);
  }
  class Point4 {
    // base / generator point
    static BASE = new Point4(CURVE2.Gx, CURVE2.Gy, Fp.ONE);
    // zero / infinity / identity point
    static ZERO = new Point4(Fp.ZERO, Fp.ONE, Fp.ZERO);
    // 0, 1, 0
    // math field
    static Fp = Fp;
    // scalar field
    static Fn = Fn2;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE2;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point4)
        throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y))
        return Point4.ZERO;
      return new Point4(x, y, Fp.ONE);
    }
    static fromBytes(bytes3) {
      const P = Point4.fromAffine(decodePoint(abytes3(bytes3, void 0, "point")));
      P.assertValidity();
      return P;
    }
    static fromHex(hex4) {
      return Point4.fromBytes(hexToBytes2(hex4));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy - true will defer table computation until the first multiplication
     * @returns
     */
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy)
        this.multiply(_3n2);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      const p = this;
      if (p.is0()) {
        if (extraOpts.allowInfinityPoint && Fp.is0(p.X) && Fp.eql(p.Y, Fp.ONE) && Fp.is0(p.Z))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = p.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not field elements");
      if (!isValidXY(x, y))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point4(this.X, Fp.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE2;
      const b3 = Fp.mul(b, _3n2);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point4(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a = CURVE2.a;
      const b3 = Fp.mul(CURVE2.b, _3n2);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point4(X3, Y3, Z3);
    }
    subtract(other) {
      aprjpoint(other);
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point4.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar - by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo: endo3 } = extraOpts;
      if (!Fn2.isValidNot0(scalar))
        throw new RangeError("invalid scalar: out of range");
      let point, fake;
      const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point4, p));
      if (endo3) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
        const { p: k1p, f: k1f } = mul(k1);
        const { p: k2p, f: k2f } = mul(k2);
        fake = k1f.add(k2f);
        point = finishEndo(endo3.beta, k1p, k2p, k1neg, k2neg);
      } else {
        const { p, f: f2 } = mul(scalar);
        point = p;
        fake = f2;
      }
      return normalizeZ(Point4, [point, fake])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(scalar) {
      const { endo: endo3 } = extraOpts;
      const p = this;
      const sc = scalar;
      if (!Fn2.isValid(sc))
        throw new RangeError("invalid scalar: out of range");
      if (sc === _0n4 || p.is0())
        return Point4.ZERO;
      if (sc === _1n4)
        return p;
      if (wnaf.hasCache(this))
        return this.multiply(sc);
      if (endo3) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
        const { p1, p2 } = mulEndoUnsafe(Point4, p, k1, k2);
        return finishEndo(endo3.beta, p1, p2, k1neg, k2neg);
      } else {
        return wnaf.unsafe(p, sc);
      }
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * (X, Y, Z) ∋ (x=X/Z, y=Y/Z).
     * @param invertedZ - Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      const p = this;
      let iz = invertedZ;
      const { X, Y, Z } = p;
      if (Fp.eql(Z, Fp.ONE))
        return { x: X, y: Y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(Z);
      const x = Fp.mul(X, iz);
      const y = Fp.mul(Y, iz);
      const zz = Fp.mul(Z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x, y };
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = extraOpts;
      if (cofactor === _1n4)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point4, this);
      return wnaf.unsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = extraOpts;
      if (cofactor === _1n4)
        return this;
      if (clearCofactor)
        return clearCofactor(Point4, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      if (cofactor === _1n4)
        return this.is0();
      return this.clearCofactor().is0();
    }
    toBytes(isCompressed = true) {
      abool(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point4, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex2(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const bits = Fn2.BITS;
  const wnaf = new wNAF(Point4, extraOpts.endo ? Math.ceil(bits / 2) : bits);
  if (bits >= 8)
    Point4.BASE.precompute(8);
  Object.freeze(Point4.prototype);
  Object.freeze(Point4);
  return Point4;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function getWLengths(Fp, Fn2) {
  return {
    secretKey: Fn2.BYTES,
    publicKey: 1 + Fp.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp.BYTES,
    publicKeyHasPrefix: true,
    // Raw compact `(r || s)` signature width; DER and recovered signatures use
    // different lengths outside this helper.
    signature: 2 * Fn2.BYTES
  };
}
function ecdh(Point4, ecdhOpts = {}) {
  const { Fn: Fn2 } = Point4;
  const randomBytes_ = ecdhOpts.randomBytes === void 0 ? randomBytes2 : ecdhOpts.randomBytes;
  const lengths = Object.assign(getWLengths(Point4.Fp, Fn2), {
    seed: Math.max(getMinHashLength(Fn2.ORDER), 16)
  });
  function isValidSecretKey(secretKey) {
    try {
      const num2 = Fn2.fromBytes(secretKey);
      return Fn2.isValidNot0(num2);
    } catch (error2) {
      return false;
    }
  }
  function isValidPublicKey(publicKey2, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey2.length;
      if (isCompressed === true && l !== comp)
        return false;
      if (isCompressed === false && l !== publicKeyUncompressed)
        return false;
      return !!Point4.fromBytes(publicKey2);
    } catch (error2) {
      return false;
    }
  }
  function randomSecretKey(seed) {
    seed = seed === void 0 ? randomBytes_(lengths.seed) : seed;
    return mapHashToField(abytes3(seed, lengths.seed, "seed"), Fn2.ORDER);
  }
  function getPublicKey2(secretKey, isCompressed = true) {
    return Point4.BASE.multiply(Fn2.fromBytes(secretKey)).toBytes(isCompressed);
  }
  function isProbPub(item) {
    const { secretKey, publicKey: publicKey2, publicKeyUncompressed } = lengths;
    const allowedLengths = Fn2._lengths;
    if (!isBytes3(item))
      return void 0;
    const l = abytes3(item, void 0, "key").length;
    const isPub = l === publicKey2 || l === publicKeyUncompressed;
    const isSec = l === secretKey || !!allowedLengths?.includes(l);
    if (isPub && isSec)
      return void 0;
    return isPub;
  }
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false)
      throw new Error("second arg must be public key");
    const s = Fn2.fromBytes(secretKeyA);
    const b = Point4.fromBytes(publicKeyB);
    return b.multiply(s).toBytes(isCompressed);
  }
  const utils4 = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey
  };
  const keygen = createKeygen(randomSecretKey, getPublicKey2);
  Object.freeze(utils4);
  Object.freeze(lengths);
  return Object.freeze({ getPublicKey: getPublicKey2, getSharedSecret, keygen, Point: Point4, utils: utils4, lengths });
}
function ecdsa(Point4, hash2, ecdsaOpts = {}) {
  const hash_ = hash2;
  ahash(hash_);
  validateObject(ecdsaOpts, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  ecdsaOpts = Object.assign({}, ecdsaOpts);
  const randomBytes3 = ecdsaOpts.randomBytes === void 0 ? randomBytes2 : ecdsaOpts.randomBytes;
  const hmac3 = ecdsaOpts.hmac === void 0 ? (key, msg) => hmac(hash_, key, msg) : ecdsaOpts.hmac;
  const { Fp, Fn: Fn2 } = Point4;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn2;
  const { keygen, getPublicKey: getPublicKey2, getSharedSecret, utils: utils4, lengths } = ecdh(Point4, ecdsaOpts);
  const defaultSigOpts = {
    prehash: true,
    lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : true,
    format: "compact",
    extraEntropy: false
  };
  const hasLargeRecoveryLifts = CURVE_ORDER * _2n2 + _1n4 < Fp.ORDER;
  function isBiggerThanHalfOrder(number2) {
    const HALF = CURVE_ORDER >> _1n4;
    return number2 > HALF;
  }
  function validateRS(title, num2) {
    if (!Fn2.isValidNot0(num2))
      throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num2;
  }
  function assertRecoverableCurve() {
    if (hasLargeRecoveryLifts)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function validateSigLength(bytes3, format) {
    validateSigFormat(format);
    const size = lengths.signature;
    const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
    return abytes3(bytes3, sizer);
  }
  class Signature2 {
    r;
    s;
    recovery;
    constructor(r, s, recovery) {
      this.r = validateRS("r", r);
      this.s = validateRS("s", s);
      if (recovery != null) {
        assertRecoverableCurve();
        if (![0, 1, 2, 3].includes(recovery))
          throw new Error("invalid recovery id");
        this.recovery = recovery;
      }
      Object.freeze(this);
    }
    static fromBytes(bytes3, format = defaultSigOpts.format) {
      validateSigLength(bytes3, format);
      let recid;
      if (format === "der") {
        const { r: r2, s: s2 } = DER.toSig(abytes3(bytes3));
        return new Signature2(r2, s2);
      }
      if (format === "recovered") {
        recid = bytes3[0];
        format = "compact";
        bytes3 = bytes3.subarray(1);
      }
      const L = lengths.signature / 2;
      const r = bytes3.subarray(0, L);
      const s = bytes3.subarray(L, L * 2);
      return new Signature2(Fn2.fromBytes(r), Fn2.fromBytes(s), recid);
    }
    static fromHex(hex4, format) {
      return this.fromBytes(hexToBytes2(hex4), format);
    }
    assertRecovery() {
      const { recovery } = this;
      if (recovery == null)
        throw new Error("invalid recovery id: must be present");
      return recovery;
    }
    addRecoveryBit(recovery) {
      return new Signature2(this.r, this.s, recovery);
    }
    // Unlike the top-level helper below, this method expects a digest that has
    // already been hashed to the curve's message representative.
    recoverPublicKey(messageHash) {
      const { r, s } = this;
      const recovery = this.assertRecovery();
      const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
      if (!Fp.isValid(radj))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const x = Fp.toBytes(radj);
      const R = Point4.fromBytes(concatBytes2(pprefix((recovery & 1) === 0), x));
      const ir = Fn2.inv(radj);
      const h = bits2int_modN(abytes3(messageHash, void 0, "msgHash"));
      const u1 = Fn2.create(-h * ir);
      const u2 = Fn2.create(s * ir);
      const Q = Point4.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
      if (Q.is0())
        throw new Error("invalid recovery: point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format = defaultSigOpts.format) {
      validateSigFormat(format);
      if (format === "der")
        return hexToBytes2(DER.hexFromSig(this));
      const { r, s } = this;
      const rb = Fn2.toBytes(r);
      const sb = Fn2.toBytes(s);
      if (format === "recovered") {
        assertRecoverableCurve();
        return concatBytes2(Uint8Array.of(this.assertRecovery()), rb, sb);
      }
      return concatBytes2(rb, sb);
    }
    toHex(format) {
      return bytesToHex2(this.toBytes(format));
    }
  }
  Object.freeze(Signature2.prototype);
  Object.freeze(Signature2);
  const bits2int2 = ecdsaOpts.bits2int === void 0 ? function bits2int_def(bytes3) {
    if (bytes3.length > 8192)
      throw new Error("input is too large");
    const num2 = bytesToNumberBE(bytes3);
    const delta = bytes3.length * 8 - fnBits;
    return delta > 0 ? num2 >> BigInt(delta) : num2;
  } : ecdsaOpts.bits2int;
  const bits2int_modN = ecdsaOpts.bits2int_modN === void 0 ? function bits2int_modN_def(bytes3) {
    return Fn2.create(bits2int2(bytes3));
  } : ecdsaOpts.bits2int_modN;
  const ORDER_MASK = bitMask(fnBits);
  function int2octets2(num2) {
    aInRange("num < 2^" + fnBits, num2, _0n4, ORDER_MASK);
    return Fn2.toBytes(num2);
  }
  function validateMsgAndHash(message, prehash) {
    abytes3(message, void 0, "message");
    return prehash ? abytes3(hash_(message), void 0, "prehashed message") : message;
  }
  function prepSig(message, secretKey, opts) {
    const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    const h1int = bits2int_modN(message);
    const d = Fn2.fromBytes(secretKey);
    if (!Fn2.isValidNot0(d))
      throw new Error("invalid private key");
    const seedArgs = [int2octets2(d), int2octets2(h1int)];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes3(lengths.secretKey) : extraEntropy;
      seedArgs.push(abytes3(e, void 0, "extraEntropy"));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int2(kBytes);
      if (!Fn2.isValidNot0(k))
        return;
      const ik = Fn2.inv(k);
      const q = Point4.BASE.multiply(k).toAffine();
      const r = Fn2.create(q.x);
      if (r === _0n4)
        return;
      const s = Fn2.create(ik * Fn2.create(m + r * d));
      if (s === _0n4)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n4);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn2.neg(s);
        recovery ^= 1;
      }
      return new Signature2(r, normS, hasLargeRecoveryLifts ? void 0 : recovery);
    }
    return { seed, k2sig };
  }
  function sign(message, secretKey, opts = {}) {
    const { seed, k2sig } = prepSig(message, secretKey, opts);
    const drbg = createHmacDrbg(hash_.outputLen, Fn2.BYTES, hmac3);
    const sig = drbg(seed, k2sig);
    return sig.toBytes(opts.format);
  }
  function verify3(signature, message, publicKey2, opts = {}) {
    const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
    publicKey2 = abytes3(publicKey2, void 0, "publicKey");
    message = validateMsgAndHash(message, prehash);
    if (!isBytes3(signature)) {
      const end = signature instanceof Signature2 ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + end);
    }
    validateSigLength(signature, format);
    try {
      const sig = Signature2.fromBytes(signature, format);
      const P = Point4.fromBytes(publicKey2);
      if (lowS && sig.hasHighS())
        return false;
      const { r, s } = sig;
      const h = bits2int_modN(message);
      const is = Fn2.inv(s);
      const u1 = Fn2.create(h * is);
      const u2 = Fn2.create(r * is);
      const R = Point4.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
      if (R.is0())
        return false;
      const v = Fn2.create(R.x);
      return v === r;
    } catch (e) {
      return false;
    }
  }
  function recoverPublicKey(signature, message, opts = {}) {
    const { prehash } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    return Signature2.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
  }
  return Object.freeze({
    keygen,
    getPublicKey: getPublicKey2,
    getSharedSecret,
    utils: utils4,
    lengths,
    Point: Point4,
    sign,
    verify: verify3,
    recoverPublicKey,
    Signature: Signature2,
    hash: hash_
  });
}

// upstream/node_modules/@noble/curves/secp256k1.js
var secp256k1_CURVE = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
var secp256k1_ENDO = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
};
var _0n5 = /* @__PURE__ */ BigInt(0);
var _2n3 = /* @__PURE__ */ BigInt(2);
function sqrtMod(y) {
  const P = secp256k1_CURVE.p;
  const _3n4 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n4, P) * b3 % P;
  const b9 = pow2(b6, _3n4, P) * b3 % P;
  const b11 = pow2(b9, _2n3, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n4, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n3, P);
  if (!Fpk1.eql(Fpk1.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
var Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
var Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
  Fp: Fpk1,
  endo: secp256k1_ENDO
});
var secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha256);
var TAGGED_HASH_PREFIXES = {};
function taggedHash(tag, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES[tag];
  if (tagP === void 0) {
    const tagH = sha256(asciiToBytes(tag));
    tagP = concatBytes2(tagH, tagH);
    TAGGED_HASH_PREFIXES[tag] = tagP;
  }
  return sha256(concatBytes2(tagP, ...messages));
}
var pointToBytes = (point) => point.toBytes(true).slice(1);
var hasEven = (y) => y % _2n3 === _0n5;
function schnorrGetExtPubKey(priv) {
  const { Fn: Fn2, BASE } = Pointk1;
  const d_ = Fn2.fromBytes(priv);
  const p = BASE.multiply(d_);
  const scalar = hasEven(p.y) ? d_ : Fn2.neg(d_);
  return { scalar, bytes: pointToBytes(p) };
}
function lift_x(x) {
  const Fp = Fpk1;
  if (!Fp.isValidNot0(x))
    throw new Error("invalid x: Fail if x \u2265 p");
  const xx = Fp.create(x * x);
  const c = Fp.create(xx * x + BigInt(7));
  let y = Fp.sqrt(c);
  if (!hasEven(y))
    y = Fp.neg(y);
  const p = Pointk1.fromAffine({ x, y });
  p.assertValidity();
  return p;
}
var num = bytesToNumberBE;
function challenge(...args) {
  return Pointk1.Fn.create(num(taggedHash("BIP0340/challenge", ...args)));
}
function schnorrGetPublicKey(secretKey) {
  return schnorrGetExtPubKey(secretKey).bytes;
}
function schnorrSign(message, secretKey, auxRand = randomBytes(32)) {
  const { Fn: Fn2, BASE } = Pointk1;
  const m = abytes3(message, void 0, "message");
  const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey);
  const a = abytes3(auxRand, 32, "auxRand");
  const t = Fn2.toBytes(d ^ num(taggedHash("BIP0340/aux", a)));
  const rand = taggedHash("BIP0340/nonce", t, px, m);
  const k_ = Fn2.create(num(rand));
  if (k_ === 0n)
    throw new Error("sign failed: k is zero");
  const p = BASE.multiply(k_);
  const k = hasEven(p.y) ? k_ : Fn2.neg(k_);
  const rx = pointToBytes(p);
  const e = challenge(rx, px, m);
  const sig = new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(Fn2.toBytes(Fn2.create(k + e * d)), 32);
  if (!schnorrVerify(sig, m, px))
    throw new Error("sign: Invalid signature produced");
  return sig;
}
function schnorrVerify(signature, message, publicKey2) {
  const { Fp, Fn: Fn2, BASE } = Pointk1;
  const sig = abytes3(signature, 64, "signature");
  const m = abytes3(message, void 0, "message");
  const pub = abytes3(publicKey2, 32, "publicKey");
  try {
    const P = lift_x(num(pub));
    const r = num(sig.subarray(0, 32));
    if (!Fp.isValidNot0(r))
      return false;
    const s = num(sig.subarray(32, 64));
    if (!Fn2.isValidNot0(s))
      return false;
    const e = challenge(Fn2.toBytes(r), pointToBytes(P), m);
    const R = BASE.multiplyUnsafe(s).add(P.multiplyUnsafe(Fn2.neg(e)));
    const { x, y } = R.toAffine();
    if (R.is0() || !hasEven(y) || x !== r)
      return false;
    return true;
  } catch (error2) {
    return false;
  }
}
var schnorr = /* @__PURE__ */ (() => {
  const size = 32;
  const seedLength = 48;
  const randomSecretKey = (seed) => {
    seed = seed === void 0 ? randomBytes(seedLength) : seed;
    return mapHashToField(seed, secp256k1_CURVE.n);
  };
  return Object.freeze({
    keygen: createKeygen(randomSecretKey, schnorrGetPublicKey),
    getPublicKey: schnorrGetPublicKey,
    sign: schnorrSign,
    verify: schnorrVerify,
    Point: Pointk1,
    utils: Object.freeze({
      randomSecretKey,
      taggedHash,
      lift_x,
      pointToBytes
    }),
    lengths: Object.freeze({
      secretKey: size,
      publicKey: size,
      publicKeyHasPrefix: false,
      signature: size * 2,
      seed: seedLength
    })
  });
})();

// upstream/node_modules/@noble/hashes/legacy.js
var Rho160 = /* @__PURE__ */ Uint8Array.from([
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8
]);
var Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
var Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
var idxLR = /* @__PURE__ */ (() => {
  const L = [Id160];
  const R = [Pi160];
  const res = [L, R];
  for (let i = 0; i < 4; i++)
    for (let j of res)
      j.push(j[i].map((k) => Rho160[k]));
  return res;
})();
var idxL = /* @__PURE__ */ (() => idxLR[0])();
var idxR = /* @__PURE__ */ (() => idxLR[1])();
var shifts160 = /* @__PURE__ */ [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((i) => Uint8Array.from(i));
var shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
var shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
var Kl160 = /* @__PURE__ */ Uint32Array.from([
  0,
  1518500249,
  1859775393,
  2400959708,
  2840853838
]);
var Kr160 = /* @__PURE__ */ Uint32Array.from([
  1352829926,
  1548603684,
  1836072691,
  2053994217,
  0
]);
function ripemd_f(group, x, y, z) {
  if (group === 0)
    return x ^ y ^ z;
  if (group === 1)
    return x & y | ~x & z;
  if (group === 2)
    return (x | ~y) ^ z;
  if (group === 3)
    return x & z | y & ~z;
  return x ^ (y | ~z);
}
var BUF_160 = /* @__PURE__ */ new Uint32Array(16);
var _RIPEMD160 = class extends HashMD {
  h0 = 1732584193 | 0;
  h1 = 4023233417 | 0;
  h2 = 2562383102 | 0;
  h3 = 271733878 | 0;
  h4 = 3285377520 | 0;
  constructor() {
    super(64, 20, 8, true);
  }
  get() {
    const { h0, h1, h2, h3, h4 } = this;
    return [h0, h1, h2, h3, h4];
  }
  set(h0, h1, h2, h3, h4) {
    this.h0 = h0 | 0;
    this.h1 = h1 | 0;
    this.h2 = h2 | 0;
    this.h3 = h3 | 0;
    this.h4 = h4 | 0;
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      BUF_160[i] = view2.getUint32(offset, true);
    let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
    for (let group = 0; group < 5; group++) {
      const rGroup = 4 - group;
      const hbl = Kl160[group], hbr = Kr160[group];
      const rl = idxL[group], rr = idxR[group];
      const sl = shiftsL160[group], sr = shiftsR160[group];
      for (let i = 0; i < 16; i++) {
        const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
        al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
      }
      for (let i = 0; i < 16; i++) {
        const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
        ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
      }
    }
    this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
  }
  roundClean() {
    clean(BUF_160);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0);
  }
};
var ripemd160 = /* @__PURE__ */ createHasher(() => new _RIPEMD160());

// upstream/node_modules/@scure/bip32/index.js
var Point = /* @__PURE__ */ (() => secp256k1.Point)();
var Fn = /* @__PURE__ */ (() => Point.Fn)();
var base58check = /* @__PURE__ */ createBase58check(sha256);
var MASTER_SECRET = /* @__PURE__ */ (() => {
  return Uint8Array.from("Bitcoin seed".split(""), (char) => char.charCodeAt(0));
})();
var BITCOIN_VERSIONS = { private: 76066276, public: 76067358 };
var HARDENED_OFFSET = 2147483648;
var hash160 = (data) => ripemd160(sha256(data));
var fromU32 = (data) => createView(data).getUint32(0, false);
var toU32 = (n) => {
  if (typeof n !== "number")
    throw new TypeError("invalid number, should be from 0 to 2**32-1, got " + n);
  if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1)
    throw new RangeError("invalid number, should be from 0 to 2**32-1, got " + n);
  const buf = new Uint8Array(4);
  createView(buf).setUint32(0, n, false);
  return buf;
};
var HDKey = class _HDKey {
  get fingerprint() {
    if (!this.pubHash) {
      throw new Error("No publicKey set!");
    }
    return fromU32(this.pubHash);
  }
  get identifier() {
    return this.pubHash;
  }
  get pubKeyHash() {
    return this.pubHash;
  }
  // Returns the live private key buffer for this instance.
  // Copy it first if you need an immutable snapshot.
  get privateKey() {
    return this._privateKey || null;
  }
  get publicKey() {
    return this._publicKey || null;
  }
  get privateExtendedKey() {
    const priv = this._privateKey;
    if (!priv) {
      throw new Error("No private key");
    }
    return base58check.encode(this.serialize(this.versions.private, concatBytes(Uint8Array.of(0), priv)));
  }
  get publicExtendedKey() {
    if (!this._publicKey) {
      throw new Error("No public key");
    }
    return base58check.encode(this.serialize(this.versions.public, this._publicKey));
  }
  static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
    abytes(seed);
    if (8 * seed.length < 128 || 8 * seed.length > 512) {
      throw new RangeError("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got " + seed.length);
    }
    const I = hmac(sha512, MASTER_SECRET, seed);
    const privateKey = I.slice(0, 32);
    const chainCode = I.slice(32);
    return new _HDKey({ versions, chainCode, privateKey });
  }
  static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
    const keyBuffer = base58check.decode(base58key);
    const keyView = createView(keyBuffer);
    const version = keyView.getUint32(0, false);
    const opt = {
      versions,
      depth: keyBuffer[4],
      parentFingerprint: keyView.getUint32(5, false),
      index: keyView.getUint32(9, false),
      chainCode: keyBuffer.slice(13, 45)
    };
    const key = keyBuffer.slice(45);
    const isPriv = key[0] === 0;
    if (version !== versions[isPriv ? "private" : "public"]) {
      throw new Error("Version mismatch");
    }
    if (isPriv) {
      return new _HDKey({ ...opt, privateKey: key.slice(1) });
    } else {
      return new _HDKey({ ...opt, publicKey: key });
    }
  }
  static fromJSON(json) {
    return _HDKey.fromExtendedKey(json.xpriv);
  }
  versions;
  depth = 0;
  index = 0;
  chainCode = null;
  parentFingerprint = 0;
  _privateKey;
  _publicKey;
  pubHash;
  constructor(opt) {
    if (!opt || typeof opt !== "object") {
      throw new Error("HDKey.constructor must not be called directly");
    }
    this.versions = opt.versions || BITCOIN_VERSIONS;
    this.depth = opt.depth || 0;
    this.chainCode = opt.chainCode ? Uint8Array.from(opt.chainCode) : null;
    this.index = opt.index || 0;
    this.parentFingerprint = opt.parentFingerprint || 0;
    if (!this.depth) {
      if (this.parentFingerprint || this.index) {
        throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
      }
    }
    if (this.depth > 255) {
      throw new Error("HDKey: depth exceeds the serializable value 255");
    }
    if (opt.publicKey && opt.privateKey) {
      throw new Error("HDKey: publicKey and privateKey at same time.");
    }
    if (opt.privateKey) {
      if (!secp256k1.utils.isValidSecretKey(opt.privateKey))
        throw new Error("Invalid private key");
      this._privateKey = Uint8Array.from(opt.privateKey);
      this._publicKey = secp256k1.getPublicKey(this._privateKey, true);
    } else if (opt.publicKey) {
      this._publicKey = Point.fromBytes(opt.publicKey).toBytes(true);
    } else {
      throw new Error("HDKey: no public or private key provided");
    }
    this.pubHash = hash160(this._publicKey);
  }
  derive(path) {
    if (!/^[mM]'?/.test(path)) {
      throw new Error('Path must start with "m" or "M"');
    }
    if (/^[mM]'?$/.test(path)) {
      return this;
    }
    const parts = path.replace(/^[mM]'?\//, "").split("/");
    let child = this;
    for (const c of parts) {
      const m = /^(\d+)('?)$/.exec(c);
      const m1 = m && m[1];
      if (!m || m.length !== 3 || typeof m1 !== "string")
        throw new Error("invalid child index: " + c);
      let idx = +m1;
      if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) {
        throw new Error("Invalid index");
      }
      if (m[2] === "'") {
        idx += HARDENED_OFFSET;
      }
      child = child.deriveChild(idx);
    }
    return child;
  }
  /**
   * @param _I - Test-only override for the 64-byte HMAC-SHA512 output; normal callers must omit it.
   */
  deriveChild(index, _I) {
    if (!this._publicKey || !this.chainCode) {
      throw new Error("No publicKey or chainCode set");
    }
    let data = toU32(index);
    if (index >= HARDENED_OFFSET) {
      const priv = this._privateKey;
      if (!priv) {
        throw new Error("Could not derive hardened child key");
      }
      data = concatBytes(Uint8Array.of(0), priv, data);
    } else {
      data = concatBytes(this._publicKey, data);
    }
    const out = _I || hmac(sha512, this.chainCode, data);
    abytes(out, 64);
    const childTweak = out.slice(0, 32);
    const chainCode = out.slice(32);
    const opt = {
      versions: this.versions,
      chainCode,
      depth: this.depth + 1,
      parentFingerprint: this.fingerprint,
      index
    };
    if (opt.depth > 255) {
      throw new Error("HDKey: depth exceeds the serializable value 255");
    }
    try {
      const ctweak = Fn.fromBytes(childTweak);
      if (this._privateKey) {
        const added = Fn.create(Fn.fromBytes(this._privateKey) + ctweak);
        if (!Fn.isValidNot0(added)) {
          throw new Error("The tweak was out of range or the resulted private key is invalid");
        }
        opt.privateKey = Fn.toBytes(added);
      } else {
        const point = Point.fromBytes(this._publicKey);
        const added = ctweak === 0n ? point : point.add(Point.BASE.multiply(ctweak));
        if (added.equals(Point.ZERO)) {
          throw new Error("The tweak was equal to negative P, which made the result key invalid");
        }
        opt.publicKey = added.toBytes(true);
      }
      return new _HDKey(opt);
    } catch (err) {
      return this.deriveChild(index + 1);
    }
  }
  sign(hash2) {
    if (!this._privateKey) {
      throw new Error("No privateKey set!");
    }
    abytes(hash2, 32);
    return secp256k1.sign(hash2, this._privateKey, { prehash: false });
  }
  verify(hash2, signature) {
    abytes(hash2, 32);
    abytes(signature, 64);
    if (!this._publicKey) {
      throw new Error("No publicKey set!");
    }
    return secp256k1.verify(signature, hash2, this._publicKey, { prehash: false });
  }
  wipePrivateData() {
    if (this._privateKey) {
      this._privateKey.fill(0);
      this._privateKey = void 0;
    }
    return this;
  }
  toJSON() {
    return {
      xpriv: this.privateExtendedKey,
      xpub: this.publicExtendedKey
    };
  }
  serialize(version, key) {
    if (!this.chainCode) {
      throw new Error("No chainCode set");
    }
    abytes(key, 33);
    return concatBytes(toU32(version), new Uint8Array([this.depth]), toU32(this.parentFingerprint), toU32(this.index), this.chainCode, key);
  }
};

// upstream/src/derivation/seed.ts
function prfBytesToEntropy(prfBytes, salt = DEFAULT_SALT) {
  if (prfBytes.length !== PRF_BYTES_LENGTH) {
    throw new InvalidPrfOutputError(
      `PRF output must be ${PRF_BYTES_LENGTH} bytes, got ${prfBytes.length}`
    );
  }
  return hkdf(sha256, prfBytes, utf8ToBytes(salt), utf8ToBytes(HKDF_INFO), ENTROPY_BYTES);
}
function prfBytesToMnemonic(prfBytes, salt = DEFAULT_SALT) {
  const entropy = prfBytesToEntropy(prfBytes, salt);
  try {
    return entropyToMnemonic(entropy, wordlist);
  } finally {
    entropy.fill(0);
  }
}
function mnemonicToRoot(mnemonic) {
  const seed = mnemonicToSeedSync(mnemonic);
  try {
    return HDKey.fromMasterSeed(seed);
  } finally {
    seed.fill(0);
  }
}
function prfBytesToRoot(prfBytes, salt = DEFAULT_SALT) {
  const mnemonic = prfBytesToMnemonic(prfBytes, salt);
  const root = mnemonicToRoot(mnemonic);
  return { mnemonic, root };
}

// upstream/node_modules/@stacks/common/dist/esm/utils.js
function intToBytes(value, byteLength) {
  return bigIntToBytes(intToBigInt(value), byteLength);
}
function intToBigInt(value) {
  if (typeof value === "bigint")
    return value;
  if (typeof value === "string")
    return BigInt(value);
  if (typeof value === "number") {
    if (!Number.isInteger(value)) {
      throw new RangeError(`Invalid value. Values of type 'number' must be an integer.`);
    }
    if (value > Number.MAX_SAFE_INTEGER) {
      throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
    }
    return BigInt(value);
  }
  if (isInstance(value, Uint8Array))
    return BigInt(`0x${bytesToHex3(value)}`);
  throw new TypeError(`intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.`);
}
function without0x(value) {
  return /^0x/i.test(value) ? value.slice(2) : value;
}
function hexToBigInt(hex4) {
  if (typeof hex4 !== "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof hex4}`);
  return BigInt(`0x${hex4}`);
}
function intToHex(integer, byteLength = 8) {
  const value = typeof integer === "bigint" ? integer : intToBigInt(integer);
  return value.toString(16).padStart(byteLength * 2, "0");
}
function hexToInt(hex4) {
  return parseInt(hex4, 16);
}
function bigIntToBytes(value, length = 16) {
  const hex4 = intToHex(value, length);
  return hexToBytes3(hex4);
}
function toTwos(value, width) {
  if (value < -(BigInt(1) << width - BigInt(1)) || (BigInt(1) << width - BigInt(1)) - BigInt(1) < value) {
    throw `Unable to represent integer in width: ${width}`;
  }
  if (value >= BigInt(0)) {
    return BigInt(value);
  }
  return value + (BigInt(1) << width);
}
function nthBit(value, n) {
  return value & BigInt(1) << n;
}
function bytesToTwosBigInt(bytes3) {
  return fromTwos(BigInt(`0x${bytesToHex3(bytes3)}`), BigInt(bytes3.byteLength * 8));
}
function fromTwos(value, width) {
  if (nthBit(value, width - BigInt(1))) {
    return value - (BigInt(1) << width);
  }
  return value;
}
var hexes2 = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex3(uint8a) {
  if (!(uint8a instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let hex4 = "";
  for (const u of uint8a) {
    hex4 += hexes2[u];
  }
  return hex4;
}
function hexToBytes3(hex4) {
  if (typeof hex4 !== "string") {
    throw new TypeError(`hexToBytes: expected string, got ${typeof hex4}`);
  }
  hex4 = without0x(hex4);
  hex4 = hex4.length % 2 ? `0${hex4}` : hex4;
  const array2 = new Uint8Array(hex4.length / 2);
  for (let i = 0; i < array2.length; i++) {
    const j = i * 2;
    const hexByte = hex4.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array2[i] = byte;
  }
  return array2;
}
function utf8ToBytes2(str) {
  return new TextEncoder().encode(str);
}
function bytesToUtf8(arr) {
  return new TextDecoder().decode(arr);
}
function asciiToBytes2(str) {
  const byteArray = [];
  for (let i = 0; i < str.length; i++) {
    byteArray.push(str.charCodeAt(i) & 255);
  }
  return new Uint8Array(byteArray);
}
function bytesToAscii(arr) {
  return String.fromCharCode.apply(null, arr);
}
function isNotOctet(octet) {
  return !Number.isInteger(octet) || octet < 0 || octet > 255;
}
function octetsToBytes(numbers) {
  if (numbers.some(isNotOctet))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(numbers);
}
function concatBytes3(...arrays) {
  if (!arrays.every((a) => a instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (arrays.length === 1)
    return arrays[0];
  const length = arrays.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i];
    result.set(arr, pad);
    pad += arr.length;
  }
  return result;
}
function concatArray(elements) {
  return concatBytes3(...elements.map((e) => {
    if (typeof e === "number")
      return octetsToBytes([e]);
    if (e instanceof Array)
      return octetsToBytes(e);
    return e;
  }));
}
function isInstance(object, clazz) {
  return object instanceof clazz || object?.constructor?.name?.toLowerCase() === clazz.name;
}

// upstream/node_modules/@stacks/common/dist/esm/constants.js
var HIRO_MAINNET_URL = "https://api.mainnet.hiro.so";
var HIRO_TESTNET_URL = "https://api.testnet.hiro.so";
var DEVNET_URL = "http://localhost:3999";
var PRIVATE_KEY_BYTES_COMPRESSED = 33;

// upstream/node_modules/@stacks/common/dist/esm/signatures.js
var COORDINATE_BYTES = 32;
function parseRecoverableSignatureVrs(signature) {
  if (signature.length < COORDINATE_BYTES * 2 * 2 + 1) {
    throw new Error("Invalid signature");
  }
  const recoveryIdHex = signature.slice(0, 2);
  const r = signature.slice(2, 2 + COORDINATE_BYTES * 2);
  const s = signature.slice(2 + COORDINATE_BYTES * 2);
  return {
    recoveryId: hexToInt(recoveryIdHex),
    r,
    s
  };
}

// upstream/node_modules/@stacks/common/dist/esm/keys.js
function privateKeyToBytes(privateKey) {
  const privateKeyBuffer = typeof privateKey === "string" ? hexToBytes3(privateKey) : privateKey;
  if (privateKeyBuffer.length != 32 && privateKeyBuffer.length != 33) {
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${privateKeyBuffer.length}`);
  }
  if (privateKeyBuffer.length == 33 && privateKeyBuffer[32] !== 1) {
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  }
  return privateKeyBuffer;
}

// upstream/node_modules/@stacks/common/dist/esm/buffer.js
function readUInt16BE(source, offset) {
  return (source[offset + 0] << 8 | source[offset + 1]) >>> 0;
}
function writeUInt16BE(destination, value, offset = 0) {
  destination[offset + 0] = value >>> 8;
  destination[offset + 1] = value >>> 0;
  return destination;
}
function readUInt8(source, offset) {
  return source[offset];
}
function writeUInt8(destination, value, offset = 0) {
  destination[offset] = value;
  return destination;
}
function readUInt32BE(source, offset) {
  return source[offset] * 2 ** 24 + source[offset + 1] * 2 ** 16 + source[offset + 2] * 2 ** 8 + source[offset + 3];
}
function writeUInt32BE(destination, value, offset = 0) {
  destination[offset + 3] = value;
  value >>>= 8;
  destination[offset + 2] = value;
  value >>>= 8;
  destination[offset + 1] = value;
  value >>>= 8;
  destination[offset] = value;
  return destination;
}

// upstream/node_modules/@stacks/common/dist/esm/fetch.js
var defaultFetchOpts = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function fetchWrapper(input, init) {
  const fetchOpts = {};
  Object.assign(fetchOpts, defaultFetchOpts, init);
  const fetchResult = await fetch(input, fetchOpts);
  return fetchResult;
}
function argsForCreateFetchFn(args) {
  let fetchLib = fetchWrapper;
  let middlewares = [];
  if (args.length > 0 && typeof args[0] === "function") {
    fetchLib = args.shift();
  }
  if (args.length > 0) {
    middlewares = args;
  }
  return { fetchLib, middlewares };
}
function createFetchFn(...args) {
  const { fetchLib, middlewares } = argsForCreateFetchFn(args);
  const fetchFn = async (url, init) => {
    let fetchParams = { url, init: init ?? {} };
    for (const middleware of middlewares) {
      if (typeof middleware.pre === "function") {
        const result = await Promise.resolve(middleware.pre({
          fetch: fetchLib,
          ...fetchParams
        }));
        fetchParams = result ?? fetchParams;
      }
    }
    let response = await fetchLib(fetchParams.url, fetchParams.init);
    for (const middleware of middlewares) {
      if (typeof middleware.post === "function") {
        const result = await Promise.resolve(middleware.post({
          fetch: fetchLib,
          url: fetchParams.url,
          init: fetchParams.init,
          response: response?.clone() ?? response
        }));
        response = result ?? response;
      }
    }
    return response;
  };
  return fetchFn;
}

// upstream/node_modules/@stacks/transactions/dist/esm/BytesReader.js
function createEnumChecker(enumVariable) {
  const enumValues = Object.values(enumVariable).filter((v) => typeof v === "number");
  const enumValueSet = new Set(enumValues);
  return (value) => enumValueSet.has(value);
}
var enumCheckFunctions = /* @__PURE__ */ new Map();
function isEnum(enumVariable, value) {
  const checker = enumCheckFunctions.get(enumVariable);
  if (checker !== void 0) {
    return checker(value);
  }
  const newChecker = createEnumChecker(enumVariable);
  enumCheckFunctions.set(enumVariable, newChecker);
  return isEnum(enumVariable, value);
}
var BytesReader = class {
  constructor(bytes3) {
    this.consumed = 0;
    this.source = typeof bytes3 === "string" ? hexToBytes3(bytes3) : bytes3;
  }
  readBytes(length) {
    const view2 = this.source.subarray(this.consumed, this.consumed + length);
    this.consumed += length;
    return view2;
  }
  readUInt32BE() {
    return readUInt32BE(this.readBytes(4), 0);
  }
  readUInt8() {
    return readUInt8(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return readUInt16BE(this.readBytes(2), 0);
  }
  readBigUIntLE(length) {
    const bytes3 = this.readBytes(length).slice().reverse();
    const hex4 = bytesToHex3(bytes3);
    return BigInt(`0x${hex4}`);
  }
  readBigUIntBE(length) {
    const bytes3 = this.readBytes(length);
    const hex4 = bytesToHex3(bytes3);
    return BigInt(`0x${hex4}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(val) {
    this.consumed = val;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(enumVariable, invalidEnumErrorFormatter) {
    const num2 = this.readUInt8();
    if (isEnum(enumVariable, num2)) {
      return num2;
    }
    throw invalidEnumErrorFormatter(num2);
  }
};

// upstream/node_modules/@stacks/network/dist/esm/constants.js
var ChainId;
(function(ChainId2) {
  ChainId2[ChainId2["Mainnet"] = 1] = "Mainnet";
  ChainId2[ChainId2["Testnet"] = 2147483648] = "Testnet";
})(ChainId || (ChainId = {}));
var PeerNetworkId;
(function(PeerNetworkId2) {
  PeerNetworkId2[PeerNetworkId2["Mainnet"] = 385875968] = "Mainnet";
  PeerNetworkId2[PeerNetworkId2["Testnet"] = 4278190080] = "Testnet";
})(PeerNetworkId || (PeerNetworkId = {}));
var DEFAULT_CHAIN_ID = ChainId.Mainnet;
var TransactionVersion;
(function(TransactionVersion2) {
  TransactionVersion2[TransactionVersion2["Mainnet"] = 0] = "Mainnet";
  TransactionVersion2[TransactionVersion2["Testnet"] = 128] = "Testnet";
})(TransactionVersion || (TransactionVersion = {}));
var AddressVersion;
(function(AddressVersion2) {
  AddressVersion2[AddressVersion2["MainnetSingleSig"] = 22] = "MainnetSingleSig";
  AddressVersion2[AddressVersion2["MainnetMultiSig"] = 20] = "MainnetMultiSig";
  AddressVersion2[AddressVersion2["TestnetSingleSig"] = 26] = "TestnetSingleSig";
  AddressVersion2[AddressVersion2["TestnetMultiSig"] = 21] = "TestnetMultiSig";
})(AddressVersion || (AddressVersion = {}));
var DEFAULT_TRANSACTION_VERSION = TransactionVersion.Mainnet;
function whenTransactionVersion(transactionVersion) {
  return (map) => map[transactionVersion];
}

// upstream/node_modules/@stacks/network/dist/esm/network.js
var STACKS_MAINNET = {
  chainId: ChainId.Mainnet,
  transactionVersion: TransactionVersion.Mainnet,
  peerNetworkId: PeerNetworkId.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: AddressVersion.MainnetSingleSig,
    multiSig: AddressVersion.MainnetMultiSig
  },
  client: { baseUrl: HIRO_MAINNET_URL }
};
var STACKS_TESTNET = {
  chainId: ChainId.Testnet,
  transactionVersion: TransactionVersion.Testnet,
  peerNetworkId: PeerNetworkId.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: AddressVersion.TestnetSingleSig,
    multiSig: AddressVersion.TestnetMultiSig
  },
  client: { baseUrl: HIRO_TESTNET_URL }
};
var STACKS_DEVNET = {
  ...STACKS_TESTNET,
  addressVersion: { ...STACKS_TESTNET.addressVersion },
  magicBytes: "id",
  client: { baseUrl: DEVNET_URL }
};
var STACKS_MOCKNET = {
  ...STACKS_DEVNET,
  addressVersion: { ...STACKS_DEVNET.addressVersion },
  client: { ...STACKS_DEVNET.client }
};
function networkFromName(name) {
  switch (name) {
    case "mainnet":
      return STACKS_MAINNET;
    case "testnet":
      return STACKS_TESTNET;
    case "devnet":
      return STACKS_DEVNET;
    case "mocknet":
      return STACKS_MOCKNET;
    default:
      throw new Error(`Unknown network name: ${name}`);
  }
}
function networkFrom(network) {
  if (typeof network === "string")
    return networkFromName(network);
  return network;
}
function clientFromNetwork(network) {
  if (network.client.fetch)
    return network.client;
  return {
    ...network.client,
    fetch: createFetchFn()
  };
}

// upstream/node_modules/@stacks/transactions/dist/esm/constants.js
var MAX_STRING_LENGTH_BYTES = 128;
var CLARITY_INT_SIZE = 128;
var CLARITY_INT_BYTE_SIZE = 16;
var COINBASE_BYTES_LENGTH = 32;
var VRF_PROOF_BYTES_LENGTH = 80;
var RECOVERABLE_ECDSA_SIG_LENGTH_BYTES = 65;
var COMPRESSED_PUBKEY_LENGTH_BYTES = 32;
var UNCOMPRESSED_PUBKEY_LENGTH_BYTES = 64;
var MEMO_MAX_LENGTH_BYTES = 34;
var MAX_PAYLOAD_LEN = 1 + 16 * 1024 * 1024;
var PREAMBLE_ENCODED_SIZE = 165;
var MAX_RELAYERS_LEN = 16;
var PEER_ADDRESS_ENCODED_SIZE = 16;
var HASH160_ENCODED_SIZE = 20;
var NEIGHBOR_ADDRESS_ENCODED_SIZE = PEER_ADDRESS_ENCODED_SIZE + 2 + HASH160_ENCODED_SIZE;
var RELAY_DATA_ENCODED_SIZE = NEIGHBOR_ADDRESS_ENCODED_SIZE + 4;
var STRING_MAX_LENGTH = MAX_PAYLOAD_LEN + (PREAMBLE_ENCODED_SIZE + MAX_RELAYERS_LEN * RELAY_DATA_ENCODED_SIZE);
var PayloadType;
(function(PayloadType2) {
  PayloadType2[PayloadType2["TokenTransfer"] = 0] = "TokenTransfer";
  PayloadType2[PayloadType2["SmartContract"] = 1] = "SmartContract";
  PayloadType2[PayloadType2["VersionedSmartContract"] = 6] = "VersionedSmartContract";
  PayloadType2[PayloadType2["ContractCall"] = 2] = "ContractCall";
  PayloadType2[PayloadType2["PoisonMicroblock"] = 3] = "PoisonMicroblock";
  PayloadType2[PayloadType2["Coinbase"] = 4] = "Coinbase";
  PayloadType2[PayloadType2["CoinbaseToAltRecipient"] = 5] = "CoinbaseToAltRecipient";
  PayloadType2[PayloadType2["TenureChange"] = 7] = "TenureChange";
  PayloadType2[PayloadType2["NakamotoCoinbase"] = 8] = "NakamotoCoinbase";
})(PayloadType || (PayloadType = {}));
var ClarityVersion;
(function(ClarityVersion2) {
  ClarityVersion2[ClarityVersion2["Clarity1"] = 1] = "Clarity1";
  ClarityVersion2[ClarityVersion2["Clarity2"] = 2] = "Clarity2";
  ClarityVersion2[ClarityVersion2["Clarity3"] = 3] = "Clarity3";
  ClarityVersion2[ClarityVersion2["Clarity4"] = 4] = "Clarity4";
  ClarityVersion2[ClarityVersion2["Clarity5"] = 5] = "Clarity5";
  ClarityVersion2[ClarityVersion2["Clarity6"] = 6] = "Clarity6";
})(ClarityVersion || (ClarityVersion = {}));
var AnchorMode;
(function(AnchorMode2) {
  AnchorMode2[AnchorMode2["OnChainOnly"] = 1] = "OnChainOnly";
  AnchorMode2[AnchorMode2["OffChainOnly"] = 2] = "OffChainOnly";
  AnchorMode2[AnchorMode2["Any"] = 3] = "Any";
})(AnchorMode || (AnchorMode = {}));
var AnchorModeNames = ["onChainOnly", "offChainOnly", "any"];
var AnchorModeMap = {
  [AnchorModeNames[0]]: AnchorMode.OnChainOnly,
  [AnchorModeNames[1]]: AnchorMode.OffChainOnly,
  [AnchorModeNames[2]]: AnchorMode.Any,
  [AnchorMode.OnChainOnly]: AnchorMode.OnChainOnly,
  [AnchorMode.OffChainOnly]: AnchorMode.OffChainOnly,
  [AnchorMode.Any]: AnchorMode.Any
};
var PostConditionMode;
(function(PostConditionMode2) {
  PostConditionMode2[PostConditionMode2["Allow"] = 1] = "Allow";
  PostConditionMode2[PostConditionMode2["Deny"] = 2] = "Deny";
  PostConditionMode2[PostConditionMode2["Originator"] = 3] = "Originator";
})(PostConditionMode || (PostConditionMode = {}));
var PostConditionType;
(function(PostConditionType2) {
  PostConditionType2[PostConditionType2["STX"] = 0] = "STX";
  PostConditionType2[PostConditionType2["Fungible"] = 1] = "Fungible";
  PostConditionType2[PostConditionType2["NonFungible"] = 2] = "NonFungible";
  PostConditionType2[PostConditionType2["Staking"] = 3] = "Staking";
  PostConditionType2[PostConditionType2["PoX"] = 4] = "PoX";
})(PostConditionType || (PostConditionType = {}));
var AuthType;
(function(AuthType2) {
  AuthType2[AuthType2["Standard"] = 4] = "Standard";
  AuthType2[AuthType2["Sponsored"] = 5] = "Sponsored";
})(AuthType || (AuthType = {}));
var AddressHashMode;
(function(AddressHashMode2) {
  AddressHashMode2[AddressHashMode2["P2PKH"] = 0] = "P2PKH";
  AddressHashMode2[AddressHashMode2["P2SH"] = 1] = "P2SH";
  AddressHashMode2[AddressHashMode2["P2WPKH"] = 2] = "P2WPKH";
  AddressHashMode2[AddressHashMode2["P2WSH"] = 3] = "P2WSH";
  AddressHashMode2[AddressHashMode2["P2SHNonSequential"] = 5] = "P2SHNonSequential";
  AddressHashMode2[AddressHashMode2["P2WSHNonSequential"] = 7] = "P2WSHNonSequential";
})(AddressHashMode || (AddressHashMode = {}));
var PubKeyEncoding;
(function(PubKeyEncoding2) {
  PubKeyEncoding2[PubKeyEncoding2["Compressed"] = 0] = "Compressed";
  PubKeyEncoding2[PubKeyEncoding2["Uncompressed"] = 1] = "Uncompressed";
})(PubKeyEncoding || (PubKeyEncoding = {}));
var FungibleConditionCode;
(function(FungibleConditionCode2) {
  FungibleConditionCode2[FungibleConditionCode2["Equal"] = 1] = "Equal";
  FungibleConditionCode2[FungibleConditionCode2["Greater"] = 2] = "Greater";
  FungibleConditionCode2[FungibleConditionCode2["GreaterEqual"] = 3] = "GreaterEqual";
  FungibleConditionCode2[FungibleConditionCode2["Less"] = 4] = "Less";
  FungibleConditionCode2[FungibleConditionCode2["LessEqual"] = 5] = "LessEqual";
})(FungibleConditionCode || (FungibleConditionCode = {}));
var NonFungibleConditionCode;
(function(NonFungibleConditionCode2) {
  NonFungibleConditionCode2[NonFungibleConditionCode2["Sends"] = 16] = "Sends";
  NonFungibleConditionCode2[NonFungibleConditionCode2["DoesNotSend"] = 17] = "DoesNotSend";
  NonFungibleConditionCode2[NonFungibleConditionCode2["MaybeSent"] = 18] = "MaybeSent";
})(NonFungibleConditionCode || (NonFungibleConditionCode = {}));
var PoxConditionCode;
(function(PoxConditionCode2) {
  PoxConditionCode2[PoxConditionCode2["WillNotPerform"] = 48] = "WillNotPerform";
  PoxConditionCode2[PoxConditionCode2["MayPerform"] = 49] = "MayPerform";
  PoxConditionCode2[PoxConditionCode2["WillPerform"] = 50] = "WillPerform";
})(PoxConditionCode || (PoxConditionCode = {}));
var PostConditionPrincipalId;
(function(PostConditionPrincipalId2) {
  PostConditionPrincipalId2[PostConditionPrincipalId2["Origin"] = 1] = "Origin";
  PostConditionPrincipalId2[PostConditionPrincipalId2["Standard"] = 2] = "Standard";
  PostConditionPrincipalId2[PostConditionPrincipalId2["Contract"] = 3] = "Contract";
})(PostConditionPrincipalId || (PostConditionPrincipalId = {}));
var AssetType;
(function(AssetType2) {
  AssetType2[AssetType2["STX"] = 0] = "STX";
  AssetType2[AssetType2["Fungible"] = 1] = "Fungible";
  AssetType2[AssetType2["NonFungible"] = 2] = "NonFungible";
})(AssetType || (AssetType = {}));
var TenureChangeCause;
(function(TenureChangeCause2) {
  TenureChangeCause2[TenureChangeCause2["BlockFound"] = 0] = "BlockFound";
  TenureChangeCause2[TenureChangeCause2["Extended"] = 1] = "Extended";
  TenureChangeCause2[TenureChangeCause2["ExtendedRuntime"] = 2] = "ExtendedRuntime";
  TenureChangeCause2[TenureChangeCause2["ExtendedReadCount"] = 3] = "ExtendedReadCount";
  TenureChangeCause2[TenureChangeCause2["ExtendedReadLength"] = 4] = "ExtendedReadLength";
  TenureChangeCause2[TenureChangeCause2["ExtendedWriteCount"] = 5] = "ExtendedWriteCount";
  TenureChangeCause2[TenureChangeCause2["ExtendedWriteLength"] = 6] = "ExtendedWriteLength";
})(TenureChangeCause || (TenureChangeCause = {}));
var AuthFieldType;
(function(AuthFieldType2) {
  AuthFieldType2[AuthFieldType2["PublicKeyCompressed"] = 0] = "PublicKeyCompressed";
  AuthFieldType2[AuthFieldType2["PublicKeyUncompressed"] = 1] = "PublicKeyUncompressed";
  AuthFieldType2[AuthFieldType2["SignatureCompressed"] = 2] = "SignatureCompressed";
  AuthFieldType2[AuthFieldType2["SignatureUncompressed"] = 3] = "SignatureUncompressed";
})(AuthFieldType || (AuthFieldType = {}));
var TxRejectedReason;
(function(TxRejectedReason2) {
  TxRejectedReason2["Serialization"] = "Serialization";
  TxRejectedReason2["Deserialization"] = "Deserialization";
  TxRejectedReason2["SignatureValidation"] = "SignatureValidation";
  TxRejectedReason2["FeeTooLow"] = "FeeTooLow";
  TxRejectedReason2["BadNonce"] = "BadNonce";
  TxRejectedReason2["NotEnoughFunds"] = "NotEnoughFunds";
  TxRejectedReason2["NoSuchContract"] = "NoSuchContract";
  TxRejectedReason2["NoSuchPublicFunction"] = "NoSuchPublicFunction";
  TxRejectedReason2["BadFunctionArgument"] = "BadFunctionArgument";
  TxRejectedReason2["ContractAlreadyExists"] = "ContractAlreadyExists";
  TxRejectedReason2["PoisonMicroblocksDoNotConflict"] = "PoisonMicroblocksDoNotConflict";
  TxRejectedReason2["PoisonMicroblockHasUnknownPubKeyHash"] = "PoisonMicroblockHasUnknownPubKeyHash";
  TxRejectedReason2["PoisonMicroblockIsInvalid"] = "PoisonMicroblockIsInvalid";
  TxRejectedReason2["BadAddressVersionByte"] = "BadAddressVersionByte";
  TxRejectedReason2["NoCoinbaseViaMempool"] = "NoCoinbaseViaMempool";
  TxRejectedReason2["ServerFailureNoSuchChainTip"] = "ServerFailureNoSuchChainTip";
  TxRejectedReason2["ServerFailureDatabase"] = "ServerFailureDatabase";
  TxRejectedReason2["ServerFailureOther"] = "ServerFailureOther";
})(TxRejectedReason || (TxRejectedReason = {}));

// upstream/node_modules/@stacks/transactions/dist/esm/errors.js
var TransactionError = class extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var SerializationError = class extends TransactionError {
  constructor(message) {
    super(message);
  }
};
var DeserializationError = class extends TransactionError {
  constructor(message) {
    super(message);
  }
};
var NoEstimateAvailableError = class extends TransactionError {
  constructor(message) {
    super(message);
  }
};
var SigningError = class extends TransactionError {
  constructor(message) {
    super(message);
  }
};
var VerificationError = class extends TransactionError {
  constructor(message) {
    super(message);
  }
};

// upstream/node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/_assert.js
function number(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function bool(b) {
  if (typeof b !== "boolean")
    throw new Error(`Expected boolean, not ${b}`);
}
function bytes(b, ...lengths) {
  if (!(b instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new TypeError(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash(hash2) {
  if (typeof hash2 !== "function" || typeof hash2.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number(hash2.outputLen);
  number(hash2.blockLen);
}
function exists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
var assert = {
  number,
  bool,
  bytes,
  hash,
  exists,
  output
};
var assert_default = assert;

// upstream/node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/cryptoBrowser.js
var crypto2 = {
  node: void 0,
  web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
};

// upstream/node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/utils.js
var createView2 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr2 = (word, shift) => word << 32 - shift | word >>> shift;
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE)
  throw new Error("Non little-endian hardware is not supported");
var hexes3 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
function utf8ToBytes3(str) {
  if (typeof str !== "string") {
    throw new TypeError(`utf8ToBytes expected string, got ${typeof str}`);
  }
  return new TextEncoder().encode(str);
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes3(data);
  if (!(data instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof data})`);
  return data;
}
var Hash = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wrapConstructor(hashConstructor) {
  const hashC = (message) => hashConstructor().update(toBytes(message)).digest();
  const tmp = hashConstructor();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashConstructor();
  return hashC;
}

// upstream/node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/hmac.js
var HMAC = class extends Hash {
  constructor(hash2, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    assert_default.hash(hash2);
    const key = toBytes(_key);
    this.iHash = hash2.create();
    if (typeof this.iHash.update !== "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash2.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    pad.fill(0);
  }
  update(buf) {
    assert_default.exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    assert_default.exists(this);
    assert_default.bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac2 = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
hmac2.create = (hash2, key) => new HMAC(hash2, key);

// upstream/node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/_sha2.js
function setBigUint64(view2, byteOffset, value, isLE2) {
  if (typeof view2.setBigUint64 === "function")
    return view2.setBigUint64(byteOffset, value, isLE2);
  const _32n3 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n3 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view2.setUint32(byteOffset + h, wh, isLE2);
  view2.setUint32(byteOffset + l, wl, isLE2);
}
var SHA2 = class extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView2(this.buffer);
  }
  update(data) {
    assert_default.exists(this);
    const { view: view2, buffer: buffer2, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView2(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer2.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view2, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    assert_default.exists(this);
    assert_default.output(out, this);
    this.finished = true;
    const { buffer: buffer2, view: view2, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer2[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view2, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer2[i] = 0;
    setBigUint64(view2, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view2, 0);
    const oview = createView2(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE2);
  }
  digest() {
    const { buffer: buffer2, outputLen } = this;
    this.digestInto(buffer2);
    const res = buffer2.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer2);
    return to;
  }
};

// upstream/node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/sha256.js
var Chi2 = (a, b, c) => a & b ^ ~a & c;
var Maj2 = (a, b, c) => a & b ^ a & c ^ b & c;
var SHA256_K2 = new Uint32Array([
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
]);
var IV = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W2 = new Uint32Array(64);
var SHA256 = class extends SHA2 {
  constructor() {
    super(64, 32, 8, false);
    this.A = IV[0] | 0;
    this.B = IV[1] | 0;
    this.C = IV[2] | 0;
    this.D = IV[3] | 0;
    this.E = IV[4] | 0;
    this.F = IV[5] | 0;
    this.G = IV[6] | 0;
    this.H = IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W2[i] = view2.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W2[i - 15];
      const W2 = SHA256_W2[i - 2];
      const s0 = rotr2(W15, 7) ^ rotr2(W15, 18) ^ W15 >>> 3;
      const s1 = rotr2(W2, 17) ^ rotr2(W2, 19) ^ W2 >>> 10;
      SHA256_W2[i] = s1 + SHA256_W2[i - 7] + s0 + SHA256_W2[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr2(E, 6) ^ rotr2(E, 11) ^ rotr2(E, 25);
      const T1 = H + sigma1 + Chi2(E, F, G) + SHA256_K2[i] + SHA256_W2[i] | 0;
      const sigma0 = rotr2(A, 2) ^ rotr2(A, 13) ^ rotr2(A, 22);
      const T2 = sigma0 + Maj2(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W2.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var SHA224 = class extends SHA256 {
  constructor() {
    super();
    this.A = 3238371032 | 0;
    this.B = 914150663 | 0;
    this.C = 812702999 | 0;
    this.D = 4144912697 | 0;
    this.E = 4290775857 | 0;
    this.F = 1750603025 | 0;
    this.G = 1694076839 | 0;
    this.H = 3204075428 | 0;
    this.outputLen = 28;
  }
};
var sha2562 = wrapConstructor(() => new SHA256());
var sha224 = wrapConstructor(() => new SHA224());

// upstream/node_modules/@noble/secp256k1/lib/esm/index.js
var nodeCrypto = __toESM(require_crypto(), 1);
var _0n6 = BigInt(0);
var _1n5 = BigInt(1);
var _2n4 = BigInt(2);
var _3n3 = BigInt(3);
var _8n2 = BigInt(8);
var CURVE = Object.freeze({
  a: _0n6,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: _1n5,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
});
var divNearest2 = (a, b) => (a + b / _2n4) / b;
var endo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(k) {
    const { n } = CURVE;
    const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
    const b1 = -_1n5 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
    const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
    const b2 = a1;
    const POW_2_128 = BigInt("0x100000000000000000000000000000000");
    const c1 = divNearest2(b2 * k, n);
    const c2 = divNearest2(-b1 * k, n);
    let k1 = mod2(k - c1 * a1 - c2 * a2, n);
    let k2 = mod2(-c1 * b1 - c2 * b2, n);
    const k1neg = k1 > POW_2_128;
    const k2neg = k2 > POW_2_128;
    if (k1neg)
      k1 = n - k1;
    if (k2neg)
      k2 = n - k2;
    if (k1 > POW_2_128 || k2 > POW_2_128) {
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + k);
    }
    return { k1neg, k1, k2neg, k2 };
  }
};
var fieldLen = 32;
var groupLen = 32;
var hashLen = 32;
var compressedLen = fieldLen + 1;
var uncompressedLen = 2 * fieldLen + 1;
function weierstrass2(x) {
  const { a, b } = CURVE;
  const x2 = mod2(x * x);
  const x3 = mod2(x2 * x);
  return mod2(x3 + a * x + b);
}
var USE_ENDOMORPHISM = CURVE.a === _0n6;
var ShaError = class extends Error {
  constructor(message) {
    super(message);
  }
};
function assertJacPoint(other) {
  if (!(other instanceof JacobianPoint))
    throw new TypeError("JacobianPoint expected");
}
var JacobianPoint = class _JacobianPoint {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static fromAffine(p) {
    if (!(p instanceof Point2)) {
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    }
    if (p.equals(Point2.ZERO))
      return _JacobianPoint.ZERO;
    return new _JacobianPoint(p.x, p.y, _1n5);
  }
  static toAffineBatch(points) {
    const toInv = invertBatch(points.map((p) => p.z));
    return points.map((p, i) => p.toAffine(toInv[i]));
  }
  static normalizeZ(points) {
    return _JacobianPoint.toAffineBatch(points).map(_JacobianPoint.fromAffine);
  }
  equals(other) {
    assertJacPoint(other);
    const { x: X1, y: Y1, z: Z1 } = this;
    const { x: X2, y: Y2, z: Z2 } = other;
    const Z1Z1 = mod2(Z1 * Z1);
    const Z2Z2 = mod2(Z2 * Z2);
    const U1 = mod2(X1 * Z2Z2);
    const U2 = mod2(X2 * Z1Z1);
    const S1 = mod2(mod2(Y1 * Z2) * Z2Z2);
    const S2 = mod2(mod2(Y2 * Z1) * Z1Z1);
    return U1 === U2 && S1 === S2;
  }
  negate() {
    return new _JacobianPoint(this.x, mod2(-this.y), this.z);
  }
  double() {
    const { x: X1, y: Y1, z: Z1 } = this;
    const A = mod2(X1 * X1);
    const B = mod2(Y1 * Y1);
    const C = mod2(B * B);
    const x1b = X1 + B;
    const D = mod2(_2n4 * (mod2(x1b * x1b) - A - C));
    const E = mod2(_3n3 * A);
    const F = mod2(E * E);
    const X3 = mod2(F - _2n4 * D);
    const Y3 = mod2(E * (D - X3) - _8n2 * C);
    const Z3 = mod2(_2n4 * Y1 * Z1);
    return new _JacobianPoint(X3, Y3, Z3);
  }
  add(other) {
    assertJacPoint(other);
    const { x: X1, y: Y1, z: Z1 } = this;
    const { x: X2, y: Y2, z: Z2 } = other;
    if (X2 === _0n6 || Y2 === _0n6)
      return this;
    if (X1 === _0n6 || Y1 === _0n6)
      return other;
    const Z1Z1 = mod2(Z1 * Z1);
    const Z2Z2 = mod2(Z2 * Z2);
    const U1 = mod2(X1 * Z2Z2);
    const U2 = mod2(X2 * Z1Z1);
    const S1 = mod2(mod2(Y1 * Z2) * Z2Z2);
    const S2 = mod2(mod2(Y2 * Z1) * Z1Z1);
    const H = mod2(U2 - U1);
    const r = mod2(S2 - S1);
    if (H === _0n6) {
      if (r === _0n6) {
        return this.double();
      } else {
        return _JacobianPoint.ZERO;
      }
    }
    const HH = mod2(H * H);
    const HHH = mod2(H * HH);
    const V = mod2(U1 * HH);
    const X3 = mod2(r * r - HHH - _2n4 * V);
    const Y3 = mod2(r * (V - X3) - S1 * HHH);
    const Z3 = mod2(Z1 * Z2 * H);
    return new _JacobianPoint(X3, Y3, Z3);
  }
  subtract(other) {
    return this.add(other.negate());
  }
  multiplyUnsafe(scalar) {
    const P0 = _JacobianPoint.ZERO;
    if (typeof scalar === "bigint" && scalar === _0n6)
      return P0;
    let n = normalizeScalar(scalar);
    if (n === _1n5)
      return this;
    if (!USE_ENDOMORPHISM) {
      let p = P0;
      let d2 = this;
      while (n > _0n6) {
        if (n & _1n5)
          p = p.add(d2);
        d2 = d2.double();
        n >>= _1n5;
      }
      return p;
    }
    let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
    let k1p = P0;
    let k2p = P0;
    let d = this;
    while (k1 > _0n6 || k2 > _0n6) {
      if (k1 & _1n5)
        k1p = k1p.add(d);
      if (k2 & _1n5)
        k2p = k2p.add(d);
      d = d.double();
      k1 >>= _1n5;
      k2 >>= _1n5;
    }
    if (k1neg)
      k1p = k1p.negate();
    if (k2neg)
      k2p = k2p.negate();
    k2p = new _JacobianPoint(mod2(k2p.x * endo.beta), k2p.y, k2p.z);
    return k1p.add(k2p);
  }
  precomputeWindow(W) {
    const windows = USE_ENDOMORPHISM ? 128 / W + 1 : 256 / W + 1;
    const points = [];
    let p = this;
    let base = p;
    for (let window2 = 0; window2 < windows; window2++) {
      base = p;
      points.push(base);
      for (let i = 1; i < 2 ** (W - 1); i++) {
        base = base.add(p);
        points.push(base);
      }
      p = base.double();
    }
    return points;
  }
  wNAF(n, affinePoint) {
    if (!affinePoint && this.equals(_JacobianPoint.BASE))
      affinePoint = Point2.BASE;
    const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
    if (256 % W) {
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    }
    let precomputes = affinePoint && pointPrecomputes2.get(affinePoint);
    if (!precomputes) {
      precomputes = this.precomputeWindow(W);
      if (affinePoint && W !== 1) {
        precomputes = _JacobianPoint.normalizeZ(precomputes);
        pointPrecomputes2.set(affinePoint, precomputes);
      }
    }
    let p = _JacobianPoint.ZERO;
    let f2 = _JacobianPoint.BASE;
    const windows = 1 + (USE_ENDOMORPHISM ? 128 / W : 256 / W);
    const windowSize = 2 ** (W - 1);
    const mask = BigInt(2 ** W - 1);
    const maxNumber = 2 ** W;
    const shiftBy = BigInt(W);
    for (let window2 = 0; window2 < windows; window2++) {
      const offset = window2 * windowSize;
      let wbits = Number(n & mask);
      n >>= shiftBy;
      if (wbits > windowSize) {
        wbits -= maxNumber;
        n += _1n5;
      }
      const offset1 = offset;
      const offset2 = offset + Math.abs(wbits) - 1;
      const cond1 = window2 % 2 !== 0;
      const cond2 = wbits < 0;
      if (wbits === 0) {
        f2 = f2.add(constTimeNegate(cond1, precomputes[offset1]));
      } else {
        p = p.add(constTimeNegate(cond2, precomputes[offset2]));
      }
    }
    return { p, f: f2 };
  }
  multiply(scalar, affinePoint) {
    let n = normalizeScalar(scalar);
    let point;
    let fake;
    if (USE_ENDOMORPHISM) {
      const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
      let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
      let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
      k1p = constTimeNegate(k1neg, k1p);
      k2p = constTimeNegate(k2neg, k2p);
      k2p = new _JacobianPoint(mod2(k2p.x * endo.beta), k2p.y, k2p.z);
      point = k1p.add(k2p);
      fake = f1p.add(f2p);
    } else {
      const { p, f: f2 } = this.wNAF(n, affinePoint);
      point = p;
      fake = f2;
    }
    return _JacobianPoint.normalizeZ([point, fake])[0];
  }
  toAffine(invZ) {
    const { x, y, z } = this;
    const is0 = this.equals(_JacobianPoint.ZERO);
    if (invZ == null)
      invZ = is0 ? _8n2 : invert2(z);
    const iz1 = invZ;
    const iz2 = mod2(iz1 * iz1);
    const iz3 = mod2(iz2 * iz1);
    const ax = mod2(x * iz2);
    const ay = mod2(y * iz3);
    const zz = mod2(z * iz1);
    if (is0)
      return Point2.ZERO;
    if (zz !== _1n5)
      throw new Error("invZ was invalid");
    return new Point2(ax, ay);
  }
};
JacobianPoint.BASE = new JacobianPoint(CURVE.Gx, CURVE.Gy, _1n5);
JacobianPoint.ZERO = new JacobianPoint(_0n6, _1n5, _0n6);
function constTimeNegate(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
var pointPrecomputes2 = /* @__PURE__ */ new WeakMap();
var Point2 = class _Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  _setWindowSize(windowSize) {
    this._WINDOW_SIZE = windowSize;
    pointPrecomputes2.delete(this);
  }
  hasEvenY() {
    return this.y % _2n4 === _0n6;
  }
  static fromCompressedHex(bytes3) {
    const isShort = bytes3.length === 32;
    const x = bytesToNumber(isShort ? bytes3 : bytes3.subarray(1));
    if (!isValidFieldElement(x))
      throw new Error("Point is not on curve");
    const y2 = weierstrass2(x);
    let y = sqrtMod2(y2);
    const isYOdd = (y & _1n5) === _1n5;
    if (isShort) {
      if (isYOdd)
        y = mod2(-y);
    } else {
      const isFirstByteOdd = (bytes3[0] & 1) === 1;
      if (isFirstByteOdd !== isYOdd)
        y = mod2(-y);
    }
    const point = new _Point(x, y);
    point.assertValidity();
    return point;
  }
  static fromUncompressedHex(bytes3) {
    const x = bytesToNumber(bytes3.subarray(1, fieldLen + 1));
    const y = bytesToNumber(bytes3.subarray(fieldLen + 1, fieldLen * 2 + 1));
    const point = new _Point(x, y);
    point.assertValidity();
    return point;
  }
  static fromHex(hex4) {
    const bytes3 = ensureBytes(hex4);
    const len = bytes3.length;
    const header = bytes3[0];
    if (len === fieldLen)
      return this.fromCompressedHex(bytes3);
    if (len === compressedLen && (header === 2 || header === 3)) {
      return this.fromCompressedHex(bytes3);
    }
    if (len === uncompressedLen && header === 4)
      return this.fromUncompressedHex(bytes3);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes, not ${len}`);
  }
  static fromPrivateKey(privateKey) {
    return _Point.BASE.multiply(normalizePrivateKey(privateKey));
  }
  static fromSignature(msgHash, signature, recovery) {
    const { r, s } = normalizeSignature(signature);
    if (![0, 1, 2, 3].includes(recovery))
      throw new Error("Cannot recover: invalid recovery bit");
    const h = truncateHash(ensureBytes(msgHash));
    const { n } = CURVE;
    const radj = recovery === 2 || recovery === 3 ? r + n : r;
    const rinv = invert2(radj, n);
    const u1 = mod2(-h * rinv, n);
    const u2 = mod2(s * rinv, n);
    const prefix = recovery & 1 ? "03" : "02";
    const R = _Point.fromHex(prefix + numTo32bStr(radj));
    const Q = _Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
    if (!Q)
      throw new Error("Cannot recover signature: point at infinify");
    Q.assertValidity();
    return Q;
  }
  toRawBytes(isCompressed = false) {
    return hexToBytes4(this.toHex(isCompressed));
  }
  toHex(isCompressed = false) {
    const x = numTo32bStr(this.x);
    if (isCompressed) {
      const prefix = this.hasEvenY() ? "02" : "03";
      return `${prefix}${x}`;
    } else {
      return `04${x}${numTo32bStr(this.y)}`;
    }
  }
  toHexX() {
    return this.toHex(true).slice(2);
  }
  toRawX() {
    return this.toRawBytes(true).slice(1);
  }
  assertValidity() {
    const msg = "Point is not on elliptic curve";
    const { x, y } = this;
    if (!isValidFieldElement(x) || !isValidFieldElement(y))
      throw new Error(msg);
    const left = mod2(y * y);
    const right = weierstrass2(x);
    if (mod2(left - right) !== _0n6)
      throw new Error(msg);
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  negate() {
    return new _Point(this.x, mod2(-this.y));
  }
  double() {
    return JacobianPoint.fromAffine(this).double().toAffine();
  }
  add(other) {
    return JacobianPoint.fromAffine(this).add(JacobianPoint.fromAffine(other)).toAffine();
  }
  subtract(other) {
    return this.add(other.negate());
  }
  multiply(scalar) {
    return JacobianPoint.fromAffine(this).multiply(scalar, this).toAffine();
  }
  multiplyAndAddUnsafe(Q, a, b) {
    const P = JacobianPoint.fromAffine(this);
    const aP = a === _0n6 || a === _1n5 || this !== _Point.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
    const bQ = JacobianPoint.fromAffine(Q).multiplyUnsafe(b);
    const sum = aP.add(bQ);
    return sum.equals(JacobianPoint.ZERO) ? void 0 : sum.toAffine();
  }
};
Point2.BASE = new Point2(CURVE.Gx, CURVE.Gy);
Point2.ZERO = new Point2(_0n6, _0n6);
function sliceDER(s) {
  return Number.parseInt(s[0], 16) >= 8 ? "00" + s : s;
}
function parseDERInt(data) {
  if (data.length < 2 || data[0] !== 2) {
    throw new Error(`Invalid signature integer tag: ${bytesToHex4(data)}`);
  }
  const len = data[1];
  const res = data.subarray(2, len + 2);
  if (!len || res.length !== len) {
    throw new Error(`Invalid signature integer: wrong length`);
  }
  if (res[0] === 0 && res[1] <= 127) {
    throw new Error("Invalid signature integer: trailing length");
  }
  return { data: bytesToNumber(res), left: data.subarray(len + 2) };
}
function parseDERSignature(data) {
  if (data.length < 2 || data[0] != 48) {
    throw new Error(`Invalid signature tag: ${bytesToHex4(data)}`);
  }
  if (data[1] !== data.length - 2) {
    throw new Error("Invalid signature: incorrect length");
  }
  const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
  const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
  if (rBytesLeft.length) {
    throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex4(rBytesLeft)}`);
  }
  return { r, s };
}
var Signature = class _Signature {
  constructor(r, s) {
    this.r = r;
    this.s = s;
    this.assertValidity();
  }
  static fromCompact(hex4) {
    const arr = hex4 instanceof Uint8Array;
    const name = "Signature.fromCompact";
    if (typeof hex4 !== "string" && !arr)
      throw new TypeError(`${name}: Expected string or Uint8Array`);
    const str = arr ? bytesToHex4(hex4) : hex4;
    if (str.length !== 128)
      throw new Error(`${name}: Expected 64-byte hex`);
    return new _Signature(hexToNumber2(str.slice(0, 64)), hexToNumber2(str.slice(64, 128)));
  }
  static fromDER(hex4) {
    const arr = hex4 instanceof Uint8Array;
    if (typeof hex4 !== "string" && !arr)
      throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
    const { r, s } = parseDERSignature(arr ? hex4 : hexToBytes4(hex4));
    return new _Signature(r, s);
  }
  static fromHex(hex4) {
    return this.fromDER(hex4);
  }
  assertValidity() {
    const { r, s } = this;
    if (!isWithinCurveOrder(r))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!isWithinCurveOrder(s))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const HALF = CURVE.n >> _1n5;
    return this.s > HALF;
  }
  normalizeS() {
    return this.hasHighS() ? new _Signature(this.r, mod2(-this.s, CURVE.n)) : this;
  }
  toDERRawBytes() {
    return hexToBytes4(this.toDERHex());
  }
  toDERHex() {
    const sHex = sliceDER(numberToHexUnpadded2(this.s));
    const rHex = sliceDER(numberToHexUnpadded2(this.r));
    const sHexL = sHex.length / 2;
    const rHexL = rHex.length / 2;
    const sLen = numberToHexUnpadded2(sHexL);
    const rLen = numberToHexUnpadded2(rHexL);
    const length = numberToHexUnpadded2(rHexL + sHexL + 4);
    return `30${length}02${rLen}${rHex}02${sLen}${sHex}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return hexToBytes4(this.toCompactHex());
  }
  toCompactHex() {
    return numTo32bStr(this.r) + numTo32bStr(this.s);
  }
};
function concatBytes4(...arrays) {
  if (!arrays.every((b) => b instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (arrays.length === 1)
    return arrays[0];
  const length = arrays.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i];
    result.set(arr, pad);
    pad += arr.length;
  }
  return result;
}
var hexes4 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
function bytesToHex4(uint8a) {
  if (!(uint8a instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let hex4 = "";
  for (let i = 0; i < uint8a.length; i++) {
    hex4 += hexes4[uint8a[i]];
  }
  return hex4;
}
var POW_2_256 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function numTo32bStr(num2) {
  if (typeof num2 !== "bigint")
    throw new Error("Expected bigint");
  if (!(_0n6 <= num2 && num2 < POW_2_256))
    throw new Error("Expected number 0 <= n < 2^256");
  return num2.toString(16).padStart(64, "0");
}
function numTo32b(num2) {
  const b = hexToBytes4(numTo32bStr(num2));
  if (b.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return b;
}
function numberToHexUnpadded2(num2) {
  const hex4 = num2.toString(16);
  return hex4.length & 1 ? `0${hex4}` : hex4;
}
function hexToNumber2(hex4) {
  if (typeof hex4 !== "string") {
    throw new TypeError("hexToNumber: expected string, got " + typeof hex4);
  }
  return BigInt(`0x${hex4}`);
}
function hexToBytes4(hex4) {
  if (typeof hex4 !== "string") {
    throw new TypeError("hexToBytes: expected string, got " + typeof hex4);
  }
  if (hex4.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + hex4.length);
  const array2 = new Uint8Array(hex4.length / 2);
  for (let i = 0; i < array2.length; i++) {
    const j = i * 2;
    const hexByte = hex4.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array2[i] = byte;
  }
  return array2;
}
function bytesToNumber(bytes3) {
  return hexToNumber2(bytesToHex4(bytes3));
}
function ensureBytes(hex4) {
  return hex4 instanceof Uint8Array ? Uint8Array.from(hex4) : hexToBytes4(hex4);
}
function normalizeScalar(num2) {
  if (typeof num2 === "number" && Number.isSafeInteger(num2) && num2 > 0)
    return BigInt(num2);
  if (typeof num2 === "bigint" && isWithinCurveOrder(num2))
    return num2;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function mod2(a, b = CURVE.P) {
  const result = a % b;
  return result >= _0n6 ? result : b + result;
}
function pow22(x, power) {
  const { P } = CURVE;
  let res = x;
  while (power-- > _0n6) {
    res *= res;
    res %= P;
  }
  return res;
}
function sqrtMod2(x) {
  const { P } = CURVE;
  const _6n = BigInt(6);
  const _11n = BigInt(11);
  const _22n = BigInt(22);
  const _23n = BigInt(23);
  const _44n = BigInt(44);
  const _88n = BigInt(88);
  const b2 = x * x * x % P;
  const b3 = b2 * b2 * x % P;
  const b6 = pow22(b3, _3n3) * b3 % P;
  const b9 = pow22(b6, _3n3) * b3 % P;
  const b11 = pow22(b9, _2n4) * b2 % P;
  const b22 = pow22(b11, _11n) * b11 % P;
  const b44 = pow22(b22, _22n) * b22 % P;
  const b88 = pow22(b44, _44n) * b44 % P;
  const b176 = pow22(b88, _88n) * b88 % P;
  const b220 = pow22(b176, _44n) * b44 % P;
  const b223 = pow22(b220, _3n3) * b3 % P;
  const t1 = pow22(b223, _23n) * b22 % P;
  const t2 = pow22(t1, _6n) * b2 % P;
  const rt = pow22(t2, _2n4);
  const xc = rt * rt % P;
  if (xc !== x)
    throw new Error("Cannot find square root");
  return rt;
}
function invert2(number2, modulo = CURVE.P) {
  if (number2 === _0n6 || modulo <= _0n6) {
    throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
  }
  let a = mod2(number2, modulo);
  let b = modulo;
  let x = _0n6, y = _1n5, u = _1n5, v = _0n6;
  while (a !== _0n6) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd2 = b;
  if (gcd2 !== _1n5)
    throw new Error("invert: does not exist");
  return mod2(x, modulo);
}
function invertBatch(nums, p = CURVE.P) {
  const scratch = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num2, i) => {
    if (num2 === _0n6)
      return acc;
    scratch[i] = acc;
    return mod2(acc * num2, p);
  }, _1n5);
  const inverted = invert2(lastMultiplied, p);
  nums.reduceRight((acc, num2, i) => {
    if (num2 === _0n6)
      return acc;
    scratch[i] = mod2(acc * scratch[i], p);
    return mod2(acc * num2, p);
  }, inverted);
  return scratch;
}
function bits2int_2(bytes3) {
  const delta = bytes3.length * 8 - groupLen * 8;
  const num2 = bytesToNumber(bytes3);
  return delta > 0 ? num2 >> BigInt(delta) : num2;
}
function truncateHash(hash2, truncateOnly = false) {
  const h = bits2int_2(hash2);
  if (truncateOnly)
    return h;
  const { n } = CURVE;
  return h >= n ? h - n : h;
}
var _sha256Sync;
var _hmacSha256Sync;
var HmacDrbg = class {
  constructor(hashLen2, qByteLen) {
    this.hashLen = hashLen2;
    this.qByteLen = qByteLen;
    if (typeof hashLen2 !== "number" || hashLen2 < 2)
      throw new Error("hashLen must be a number");
    if (typeof qByteLen !== "number" || qByteLen < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(hashLen2).fill(1);
    this.k = new Uint8Array(hashLen2).fill(0);
    this.counter = 0;
  }
  hmac(...values) {
    return utils2.hmacSha256(this.k, ...values);
  }
  hmacSync(...values) {
    return _hmacSha256Sync(this.k, ...values);
  }
  checkSync() {
    if (typeof _hmacSha256Sync !== "function")
      throw new ShaError("hmacSha256Sync needs to be set");
  }
  incr() {
    if (this.counter >= 1e3)
      throw new Error("Tried 1,000 k values for sign(), all were invalid");
    this.counter += 1;
  }
  async reseed(seed = new Uint8Array()) {
    this.k = await this.hmac(this.v, Uint8Array.from([0]), seed);
    this.v = await this.hmac(this.v);
    if (seed.length === 0)
      return;
    this.k = await this.hmac(this.v, Uint8Array.from([1]), seed);
    this.v = await this.hmac(this.v);
  }
  reseedSync(seed = new Uint8Array()) {
    this.checkSync();
    this.k = this.hmacSync(this.v, Uint8Array.from([0]), seed);
    this.v = this.hmacSync(this.v);
    if (seed.length === 0)
      return;
    this.k = this.hmacSync(this.v, Uint8Array.from([1]), seed);
    this.v = this.hmacSync(this.v);
  }
  async generate() {
    this.incr();
    let len = 0;
    const out = [];
    while (len < this.qByteLen) {
      this.v = await this.hmac(this.v);
      const sl = this.v.slice();
      out.push(sl);
      len += this.v.length;
    }
    return concatBytes4(...out);
  }
  generateSync() {
    this.checkSync();
    this.incr();
    let len = 0;
    const out = [];
    while (len < this.qByteLen) {
      this.v = this.hmacSync(this.v);
      const sl = this.v.slice();
      out.push(sl);
      len += this.v.length;
    }
    return concatBytes4(...out);
  }
};
function isWithinCurveOrder(num2) {
  return _0n6 < num2 && num2 < CURVE.n;
}
function isValidFieldElement(num2) {
  return _0n6 < num2 && num2 < CURVE.P;
}
function kmdToSig(kBytes, m, d, lowS = true) {
  const { n } = CURVE;
  const k = truncateHash(kBytes, true);
  if (!isWithinCurveOrder(k))
    return;
  const kinv = invert2(k, n);
  const q = Point2.BASE.multiply(k);
  const r = mod2(q.x, n);
  if (r === _0n6)
    return;
  const s = mod2(kinv * mod2(m + d * r, n), n);
  if (s === _0n6)
    return;
  let sig = new Signature(r, s);
  let recovery = (q.x === sig.r ? 0 : 2) | Number(q.y & _1n5);
  if (lowS && sig.hasHighS()) {
    sig = sig.normalizeS();
    recovery ^= 1;
  }
  return { sig, recovery };
}
function normalizePrivateKey(key) {
  let num2;
  if (typeof key === "bigint") {
    num2 = key;
  } else if (typeof key === "number" && Number.isSafeInteger(key) && key > 0) {
    num2 = BigInt(key);
  } else if (typeof key === "string") {
    if (key.length !== 2 * groupLen)
      throw new Error("Expected 32 bytes of private key");
    num2 = hexToNumber2(key);
  } else if (key instanceof Uint8Array) {
    if (key.length !== groupLen)
      throw new Error("Expected 32 bytes of private key");
    num2 = bytesToNumber(key);
  } else {
    throw new TypeError("Expected valid private key");
  }
  if (!isWithinCurveOrder(num2))
    throw new Error("Expected private key: 0 < key < n");
  return num2;
}
function normalizeSignature(signature) {
  if (signature instanceof Signature) {
    signature.assertValidity();
    return signature;
  }
  try {
    return Signature.fromDER(signature);
  } catch (error2) {
    return Signature.fromCompact(signature);
  }
}
function getPublicKey(privateKey, isCompressed = false) {
  return Point2.fromPrivateKey(privateKey).toRawBytes(isCompressed);
}
function bits2int(bytes3) {
  const slice = bytes3.length > fieldLen ? bytes3.slice(0, fieldLen) : bytes3;
  return bytesToNumber(slice);
}
function bits2octets(bytes3) {
  const z1 = bits2int(bytes3);
  const z2 = mod2(z1, CURVE.n);
  return int2octets(z2 < _0n6 ? z1 : z2);
}
function int2octets(num2) {
  return numTo32b(num2);
}
function initSigArgs(msgHash, privateKey, extraEntropy) {
  if (msgHash == null)
    throw new Error(`sign: expected valid message hash, not "${msgHash}"`);
  const h1 = ensureBytes(msgHash);
  const d = normalizePrivateKey(privateKey);
  const seedArgs = [int2octets(d), bits2octets(h1)];
  if (extraEntropy != null) {
    if (extraEntropy === true)
      extraEntropy = utils2.randomBytes(fieldLen);
    const e = ensureBytes(extraEntropy);
    if (e.length !== fieldLen)
      throw new Error(`sign: Expected ${fieldLen} bytes of extra data`);
    seedArgs.push(e);
  }
  const seed = concatBytes4(...seedArgs);
  const m = bits2int(h1);
  return { seed, m, d };
}
function finalizeSig(recSig, opts) {
  const { sig, recovery } = recSig;
  const { der, recovered } = Object.assign({ canonical: true, der: true }, opts);
  const hashed = der ? sig.toDERRawBytes() : sig.toCompactRawBytes();
  return recovered ? [hashed, recovery] : hashed;
}
function signSync(msgHash, privKey, opts = {}) {
  const { seed, m, d } = initSigArgs(msgHash, privKey, opts.extraEntropy);
  const drbg = new HmacDrbg(hashLen, groupLen);
  drbg.reseedSync(seed);
  let sig;
  while (!(sig = kmdToSig(drbg.generateSync(), m, d, opts.canonical)))
    drbg.reseedSync();
  return finalizeSig(sig, opts);
}
Point2.BASE._setWindowSize(8);
var crypto3 = {
  node: nodeCrypto,
  web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
};
var TAGGED_HASH_PREFIXES2 = {};
var utils2 = {
  bytesToHex: bytesToHex4,
  hexToBytes: hexToBytes4,
  concatBytes: concatBytes4,
  mod: mod2,
  invert: invert2,
  isValidPrivateKey(privateKey) {
    try {
      normalizePrivateKey(privateKey);
      return true;
    } catch (error2) {
      return false;
    }
  },
  _bigintTo32Bytes: numTo32b,
  _normalizePrivateKey: normalizePrivateKey,
  hashToPrivateKey: (hash2) => {
    hash2 = ensureBytes(hash2);
    const minLen = groupLen + 8;
    if (hash2.length < minLen || hash2.length > 1024) {
      throw new Error(`Expected valid bytes of private key as per FIPS 186`);
    }
    const num2 = mod2(bytesToNumber(hash2), CURVE.n - _1n5) + _1n5;
    return numTo32b(num2);
  },
  randomBytes: (bytesLength = 32) => {
    if (crypto3.web) {
      return crypto3.web.getRandomValues(new Uint8Array(bytesLength));
    } else if (crypto3.node) {
      const { randomBytes: randomBytes3 } = crypto3.node;
      return Uint8Array.from(randomBytes3(bytesLength));
    } else {
      throw new Error("The environment doesn't have randomBytes function");
    }
  },
  randomPrivateKey: () => utils2.hashToPrivateKey(utils2.randomBytes(groupLen + 8)),
  precompute(windowSize = 8, point = Point2.BASE) {
    const cached = point === Point2.BASE ? point : new Point2(point.x, point.y);
    cached._setWindowSize(windowSize);
    cached.multiply(_3n3);
    return cached;
  },
  sha256: async (...messages) => {
    if (crypto3.web) {
      const buffer2 = await crypto3.web.subtle.digest("SHA-256", concatBytes4(...messages));
      return new Uint8Array(buffer2);
    } else if (crypto3.node) {
      const { createHash } = crypto3.node;
      const hash2 = createHash("sha256");
      messages.forEach((m) => hash2.update(m));
      return Uint8Array.from(hash2.digest());
    } else {
      throw new Error("The environment doesn't have sha256 function");
    }
  },
  hmacSha256: async (key, ...messages) => {
    if (crypto3.web) {
      const ckey = await crypto3.web.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
      const message = concatBytes4(...messages);
      const buffer2 = await crypto3.web.subtle.sign("HMAC", ckey, message);
      return new Uint8Array(buffer2);
    } else if (crypto3.node) {
      const { createHmac } = crypto3.node;
      const hash2 = createHmac("sha256", key);
      messages.forEach((m) => hash2.update(m));
      return Uint8Array.from(hash2.digest());
    } else {
      throw new Error("The environment doesn't have hmac-sha256 function");
    }
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (tag, ...messages) => {
    let tagP = TAGGED_HASH_PREFIXES2[tag];
    if (tagP === void 0) {
      const tagH = await utils2.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
      tagP = concatBytes4(tagH, tagH);
      TAGGED_HASH_PREFIXES2[tag] = tagP;
    }
    return utils2.sha256(tagP, ...messages);
  },
  taggedHashSync: (tag, ...messages) => {
    if (typeof _sha256Sync !== "function")
      throw new ShaError("sha256Sync is undefined, you need to set it");
    let tagP = TAGGED_HASH_PREFIXES2[tag];
    if (tagP === void 0) {
      const tagH = _sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
      tagP = concatBytes4(tagH, tagH);
      TAGGED_HASH_PREFIXES2[tag] = tagP;
    }
    return _sha256Sync(tagP, ...messages);
  },
  _JacobianPoint: JacobianPoint
};
Object.defineProperties(utils2, {
  sha256Sync: {
    configurable: false,
    get() {
      return _sha256Sync;
    },
    set(val) {
      if (!_sha256Sync)
        _sha256Sync = val;
    }
  },
  hmacSha256Sync: {
    configurable: false,
    get() {
      return _hmacSha256Sync;
    },
    set(val) {
      if (!_hmacSha256Sync)
        _hmacSha256Sync = val;
    }
  }
});

// upstream/node_modules/@stacks/transactions/dist/esm/keys.js
var import_c32check4 = __toESM(require_lib());

// upstream/node_modules/@stacks/transactions/dist/esm/address.js
function addressHashModeToVersion(hashMode, network) {
  network = networkFrom(network ?? STACKS_MAINNET);
  switch (hashMode) {
    case AddressHashMode.P2PKH:
      switch (network.transactionVersion) {
        case TransactionVersion.Mainnet:
          return AddressVersion.MainnetSingleSig;
        case TransactionVersion.Testnet:
          return AddressVersion.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${network.transactionVersion} for hashMode ${hashMode}`);
      }
    case AddressHashMode.P2SH:
    case AddressHashMode.P2SHNonSequential:
    case AddressHashMode.P2WPKH:
    case AddressHashMode.P2WSH:
    case AddressHashMode.P2WSHNonSequential:
      switch (network.transactionVersion) {
        case TransactionVersion.Mainnet:
          return AddressVersion.MainnetMultiSig;
        case TransactionVersion.Testnet:
          return AddressVersion.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${network.transactionVersion} for hashMode ${hashMode}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${hashMode}`);
  }
}

// upstream/node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/ripemd160.js
var Rho = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]);
var Id = Uint8Array.from({ length: 16 }, (_, i) => i);
var Pi = Id.map((i) => (9 * i + 5) % 16);
var idxL2 = [Id];
var idxR2 = [Pi];
for (let i = 0; i < 4; i++)
  for (let j of [idxL2, idxR2])
    j.push(j[i].map((k) => Rho[k]));
var shifts = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((i) => new Uint8Array(i));
var shiftsL = idxL2.map((idx, i) => idx.map((j) => shifts[i][j]));
var shiftsR = idxR2.map((idx, i) => idx.map((j) => shifts[i][j]));
var Kl = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]);
var Kr = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]);
var rotl2 = (word, shift) => word << shift | word >>> 32 - shift;
function f(group, x, y, z) {
  if (group === 0)
    return x ^ y ^ z;
  else if (group === 1)
    return x & y | ~x & z;
  else if (group === 2)
    return (x | ~y) ^ z;
  else if (group === 3)
    return x & z | y & ~z;
  else
    return x ^ (y | ~z);
}
var BUF = new Uint32Array(16);
var RIPEMD160 = class extends SHA2 {
  constructor() {
    super(64, 20, 8, true);
    this.h0 = 1732584193 | 0;
    this.h1 = 4023233417 | 0;
    this.h2 = 2562383102 | 0;
    this.h3 = 271733878 | 0;
    this.h4 = 3285377520 | 0;
  }
  get() {
    const { h0, h1, h2, h3, h4 } = this;
    return [h0, h1, h2, h3, h4];
  }
  set(h0, h1, h2, h3, h4) {
    this.h0 = h0 | 0;
    this.h1 = h1 | 0;
    this.h2 = h2 | 0;
    this.h3 = h3 | 0;
    this.h4 = h4 | 0;
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      BUF[i] = view2.getUint32(offset, true);
    let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
    for (let group = 0; group < 5; group++) {
      const rGroup = 4 - group;
      const hbl = Kl[group], hbr = Kr[group];
      const rl = idxL2[group], rr = idxR2[group];
      const sl = shiftsL[group], sr = shiftsR[group];
      for (let i = 0; i < 16; i++) {
        const tl = rotl2(al + f(group, bl, cl, dl) + BUF[rl[i]] + hbl, sl[i]) + el | 0;
        al = el, el = dl, dl = rotl2(cl, 10) | 0, cl = bl, bl = tl;
      }
      for (let i = 0; i < 16; i++) {
        const tr = rotl2(ar + f(rGroup, br, cr, dr) + BUF[rr[i]] + hbr, sr[i]) + er | 0;
        ar = er, er = dr, dr = rotl2(cr, 10) | 0, cr = br, br = tr;
      }
    }
    this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
  }
  roundClean() {
    BUF.fill(0);
  }
  destroy() {
    this.destroyed = true;
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0);
  }
};
var ripemd1602 = wrapConstructor(() => new RIPEMD160());

// upstream/node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/_u64.js
var U32_MASK642 = BigInt(2 ** 32 - 1);
var _32n2 = BigInt(32);
function fromBig2(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK642), l: Number(n >> _32n2 & U32_MASK642) };
  return { h: Number(n >> _32n2 & U32_MASK642) | 0, l: Number(n & U32_MASK642) | 0 };
}
function split2(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0; i < lst.length; i++) {
    const { h, l } = fromBig2(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var toBig = (h, l) => BigInt(h >>> 0) << _32n2 | BigInt(l >>> 0);
var shrSH2 = (h, l, s) => h >>> s;
var shrSL2 = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH2 = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL2 = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH2 = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL2 = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotr32H = (h, l) => l;
var rotr32L = (h, l) => h;
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
function add2(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L2 = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H2 = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L2 = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H2 = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L2 = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H2 = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
var u64 = {
  fromBig: fromBig2,
  split: split2,
  toBig,
  shrSH: shrSH2,
  shrSL: shrSL2,
  rotrSH: rotrSH2,
  rotrSL: rotrSL2,
  rotrBH: rotrBH2,
  rotrBL: rotrBL2,
  rotr32H,
  rotr32L,
  rotlSH,
  rotlSL,
  rotlBH,
  rotlBL,
  add: add2,
  add3L: add3L2,
  add3H: add3H2,
  add4L: add4L2,
  add4H: add4H2,
  add5H: add5H2,
  add5L: add5L2
};
var u64_default = u64;

// upstream/node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/sha512.js
var [SHA512_Kh2, SHA512_Kl2] = u64_default.split([
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
].map((n) => BigInt(n)));
var SHA512_W_H2 = new Uint32Array(80);
var SHA512_W_L2 = new Uint32Array(80);
var SHA512 = class extends SHA2 {
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H2[i] = view2.getUint32(offset);
      SHA512_W_L2[i] = view2.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H2[i - 15] | 0;
      const W15l = SHA512_W_L2[i - 15] | 0;
      const s0h = u64_default.rotrSH(W15h, W15l, 1) ^ u64_default.rotrSH(W15h, W15l, 8) ^ u64_default.shrSH(W15h, W15l, 7);
      const s0l = u64_default.rotrSL(W15h, W15l, 1) ^ u64_default.rotrSL(W15h, W15l, 8) ^ u64_default.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H2[i - 2] | 0;
      const W2l = SHA512_W_L2[i - 2] | 0;
      const s1h = u64_default.rotrSH(W2h, W2l, 19) ^ u64_default.rotrBH(W2h, W2l, 61) ^ u64_default.shrSH(W2h, W2l, 6);
      const s1l = u64_default.rotrSL(W2h, W2l, 19) ^ u64_default.rotrBL(W2h, W2l, 61) ^ u64_default.shrSL(W2h, W2l, 6);
      const SUMl = u64_default.add4L(s0l, s1l, SHA512_W_L2[i - 7], SHA512_W_L2[i - 16]);
      const SUMh = u64_default.add4H(SUMl, s0h, s1h, SHA512_W_H2[i - 7], SHA512_W_H2[i - 16]);
      SHA512_W_H2[i] = SUMh | 0;
      SHA512_W_L2[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = u64_default.rotrSH(Eh, El, 14) ^ u64_default.rotrSH(Eh, El, 18) ^ u64_default.rotrBH(Eh, El, 41);
      const sigma1l = u64_default.rotrSL(Eh, El, 14) ^ u64_default.rotrSL(Eh, El, 18) ^ u64_default.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = u64_default.add5L(Hl, sigma1l, CHIl, SHA512_Kl2[i], SHA512_W_L2[i]);
      const T1h = u64_default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh2[i], SHA512_W_H2[i]);
      const T1l = T1ll | 0;
      const sigma0h = u64_default.rotrSH(Ah, Al, 28) ^ u64_default.rotrBH(Ah, Al, 34) ^ u64_default.rotrBH(Ah, Al, 39);
      const sigma0l = u64_default.rotrSL(Ah, Al, 28) ^ u64_default.rotrBL(Ah, Al, 34) ^ u64_default.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = u64_default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = u64_default.add3L(T1l, sigma0l, MAJl);
      Ah = u64_default.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = u64_default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = u64_default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = u64_default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = u64_default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = u64_default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = u64_default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = u64_default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = u64_default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H2.fill(0);
    SHA512_W_L2.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var SHA512_224 = class extends SHA512 {
  constructor() {
    super();
    this.Ah = 2352822216 | 0;
    this.Al = 424955298 | 0;
    this.Bh = 1944164710 | 0;
    this.Bl = 2312950998 | 0;
    this.Ch = 502970286 | 0;
    this.Cl = 855612546 | 0;
    this.Dh = 1738396948 | 0;
    this.Dl = 1479516111 | 0;
    this.Eh = 258812777 | 0;
    this.El = 2077511080 | 0;
    this.Fh = 2011393907 | 0;
    this.Fl = 79989058 | 0;
    this.Gh = 1067287976 | 0;
    this.Gl = 1780299464 | 0;
    this.Hh = 286451373 | 0;
    this.Hl = 2446758561 | 0;
    this.outputLen = 28;
  }
};
var SHA512_256 = class extends SHA512 {
  constructor() {
    super();
    this.Ah = 573645204 | 0;
    this.Al = 4230739756 | 0;
    this.Bh = 2673172387 | 0;
    this.Bl = 3360449730 | 0;
    this.Ch = 596883563 | 0;
    this.Cl = 1867755857 | 0;
    this.Dh = 2520282905 | 0;
    this.Dl = 1497426621 | 0;
    this.Eh = 2519219938 | 0;
    this.El = 2827943907 | 0;
    this.Fh = 3193839141 | 0;
    this.Fl = 1401305490 | 0;
    this.Gh = 721525244 | 0;
    this.Gl = 746961066 | 0;
    this.Hh = 246885852 | 0;
    this.Hl = 2177182882 | 0;
    this.outputLen = 32;
  }
};
var SHA384 = class extends SHA512 {
  constructor() {
    super();
    this.Ah = 3418070365 | 0;
    this.Al = 3238371032 | 0;
    this.Bh = 1654270250 | 0;
    this.Bl = 914150663 | 0;
    this.Ch = 2438529370 | 0;
    this.Cl = 812702999 | 0;
    this.Dh = 355462360 | 0;
    this.Dl = 4144912697 | 0;
    this.Eh = 1731405415 | 0;
    this.El = 4290775857 | 0;
    this.Fh = 2394180231 | 0;
    this.Fl = 1750603025 | 0;
    this.Gh = 3675008525 | 0;
    this.Gl = 1694076839 | 0;
    this.Hh = 1203062813 | 0;
    this.Hl = 3204075428 | 0;
    this.outputLen = 48;
  }
};
var sha5122 = wrapConstructor(() => new SHA512());
var sha512_224 = wrapConstructor(() => new SHA512_224());
var sha512_256 = wrapConstructor(() => new SHA512_256());
var sha384 = wrapConstructor(() => new SHA384());

// upstream/node_modules/@stacks/transactions/dist/esm/utils.js
var import_c32check3 = __toESM(require_lib());
var import_lodash = __toESM(require_lodash());

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/constants.js
var ClarityType;
(function(ClarityType2) {
  ClarityType2["Int"] = "int";
  ClarityType2["UInt"] = "uint";
  ClarityType2["Buffer"] = "buffer";
  ClarityType2["BoolTrue"] = "true";
  ClarityType2["BoolFalse"] = "false";
  ClarityType2["PrincipalStandard"] = "address";
  ClarityType2["PrincipalContract"] = "contract";
  ClarityType2["ResponseOk"] = "ok";
  ClarityType2["ResponseErr"] = "err";
  ClarityType2["OptionalNone"] = "none";
  ClarityType2["OptionalSome"] = "some";
  ClarityType2["List"] = "list";
  ClarityType2["Tuple"] = "tuple";
  ClarityType2["StringASCII"] = "ascii";
  ClarityType2["StringUTF8"] = "utf8";
})(ClarityType || (ClarityType = {}));
var ClarityWireType;
(function(ClarityWireType2) {
  ClarityWireType2[ClarityWireType2["int"] = 0] = "int";
  ClarityWireType2[ClarityWireType2["uint"] = 1] = "uint";
  ClarityWireType2[ClarityWireType2["buffer"] = 2] = "buffer";
  ClarityWireType2[ClarityWireType2["true"] = 3] = "true";
  ClarityWireType2[ClarityWireType2["false"] = 4] = "false";
  ClarityWireType2[ClarityWireType2["address"] = 5] = "address";
  ClarityWireType2[ClarityWireType2["contract"] = 6] = "contract";
  ClarityWireType2[ClarityWireType2["ok"] = 7] = "ok";
  ClarityWireType2[ClarityWireType2["err"] = 8] = "err";
  ClarityWireType2[ClarityWireType2["none"] = 9] = "none";
  ClarityWireType2[ClarityWireType2["some"] = 10] = "some";
  ClarityWireType2[ClarityWireType2["list"] = 11] = "list";
  ClarityWireType2[ClarityWireType2["tuple"] = 12] = "tuple";
  ClarityWireType2[ClarityWireType2["ascii"] = 13] = "ascii";
  ClarityWireType2[ClarityWireType2["utf8"] = 14] = "utf8";
})(ClarityWireType || (ClarityWireType = {}));
function clarityTypeToByte(type) {
  return ClarityWireType[type];
}

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/clarityValue.js
function getCVTypeString(val) {
  switch (val.type) {
    case ClarityType.BoolTrue:
    case ClarityType.BoolFalse:
      return "bool";
    case ClarityType.Int:
      return "int";
    case ClarityType.UInt:
      return "uint";
    case ClarityType.Buffer:
      return `(buff ${Math.ceil(val.value.length / 2)})`;
    case ClarityType.OptionalNone:
      return "(optional none)";
    case ClarityType.OptionalSome:
      return `(optional ${getCVTypeString(val.value)})`;
    case ClarityType.ResponseErr:
      return `(response UnknownType ${getCVTypeString(val.value)})`;
    case ClarityType.ResponseOk:
      return `(response ${getCVTypeString(val.value)} UnknownType)`;
    case ClarityType.PrincipalStandard:
    case ClarityType.PrincipalContract:
      return "principal";
    case ClarityType.List:
      return `(list ${val.value.length} ${val.value.length ? getCVTypeString(val.value[0]) : "UnknownType"})`;
    case ClarityType.Tuple:
      return `(tuple ${Object.keys(val.value).map((key) => `(${key} ${getCVTypeString(val.value[key])})`).join(" ")})`;
    case ClarityType.StringASCII:
      return `(string-ascii ${asciiToBytes2(val.value).length})`;
    case ClarityType.StringUTF8:
      return `(string-utf8 ${utf8ToBytes2(val.value).length})`;
  }
}

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/values/booleanCV.js
var trueCV = () => ({ type: ClarityType.BoolTrue });
var falseCV = () => ({ type: ClarityType.BoolFalse });
var boolCV = (bool3) => bool3 ? trueCV() : falseCV();

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/values/bufferCV.js
var bufferCV = (buffer2) => {
  if (buffer2.byteLength > 1048576) {
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  }
  return { type: ClarityType.Buffer, value: bytesToHex3(buffer2) };
};

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/values/intCV.js
var MAX_U128 = BigInt("0xffffffffffffffffffffffffffffffff");
var MIN_U128 = BigInt(0);
var MAX_I128 = BigInt("0x7fffffffffffffffffffffffffffffff");
var MIN_I128 = BigInt("-170141183460469231731687303715884105728");
var intCV = (value) => {
  if (typeof value === "string" && value.toLowerCase().startsWith("0x")) {
    value = bytesToTwosBigInt(hexToBytes3(value));
  }
  if (isInstance(value, Uint8Array))
    value = bytesToTwosBigInt(value);
  const bigInt = intToBigInt(value);
  if (bigInt > MAX_I128) {
    throw new RangeError(`Cannot construct clarity integer from value greater than ${MAX_I128}`);
  } else if (bigInt < MIN_I128) {
    throw new RangeError(`Cannot construct clarity integer form value less than ${MIN_I128}`);
  }
  return { type: ClarityType.Int, value: bigInt };
};
var uintCV = (value) => {
  const bigInt = intToBigInt(value);
  if (bigInt < MIN_U128) {
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  } else if (bigInt > MAX_U128) {
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${MAX_U128}`);
  }
  return { type: ClarityType.UInt, value: bigInt };
};

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/values/listCV.js
function listCV(values) {
  return { type: ClarityType.List, value: values };
}

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/values/optionalCV.js
function noneCV() {
  return { type: ClarityType.OptionalNone };
}
function someCV(value) {
  return { type: ClarityType.OptionalSome, value };
}

// upstream/node_modules/@stacks/transactions/dist/esm/wire/create.js
var import_c32check = __toESM(require_lib());

// upstream/node_modules/@stacks/transactions/dist/esm/wire/types.js
var StacksWireType;
(function(StacksWireType2) {
  StacksWireType2[StacksWireType2["Address"] = 0] = "Address";
  StacksWireType2[StacksWireType2["Principal"] = 1] = "Principal";
  StacksWireType2[StacksWireType2["LengthPrefixedString"] = 2] = "LengthPrefixedString";
  StacksWireType2[StacksWireType2["MemoString"] = 3] = "MemoString";
  StacksWireType2[StacksWireType2["Asset"] = 4] = "Asset";
  StacksWireType2[StacksWireType2["PostCondition"] = 5] = "PostCondition";
  StacksWireType2[StacksWireType2["PublicKey"] = 6] = "PublicKey";
  StacksWireType2[StacksWireType2["LengthPrefixedList"] = 7] = "LengthPrefixedList";
  StacksWireType2[StacksWireType2["Payload"] = 8] = "Payload";
  StacksWireType2[StacksWireType2["MessageSignature"] = 9] = "MessageSignature";
  StacksWireType2[StacksWireType2["StructuredDataSignature"] = 10] = "StructuredDataSignature";
  StacksWireType2[StacksWireType2["TransactionAuthField"] = 11] = "TransactionAuthField";
})(StacksWireType || (StacksWireType = {}));

// upstream/node_modules/@stacks/transactions/dist/esm/wire/create.js
function createEmptyAddress() {
  return {
    type: StacksWireType.Address,
    version: AddressVersion.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function createMemoString(content) {
  if (content && exceedsMaxLengthBytes(content, MEMO_MAX_LENGTH_BYTES)) {
    throw new Error(`Memo exceeds maximum length of ${MEMO_MAX_LENGTH_BYTES} bytes`);
  }
  return { type: StacksWireType.MemoString, content };
}
function createLPList(values, lengthPrefixBytes) {
  return {
    type: StacksWireType.LengthPrefixedList,
    lengthPrefixBytes: lengthPrefixBytes || 4,
    values
  };
}
function createMessageSignature(signature) {
  const length = hexToBytes3(signature).byteLength;
  if (length != RECOVERABLE_ECDSA_SIG_LENGTH_BYTES) {
    throw Error("Invalid signature");
  }
  return {
    type: StacksWireType.MessageSignature,
    data: signature
  };
}
function createTokenTransferPayload(recipient, amount, memo) {
  if (typeof recipient === "string") {
    recipient = principalCV(recipient);
  }
  if (typeof memo === "string") {
    memo = createMemoString(memo);
  }
  return {
    type: StacksWireType.Payload,
    payloadType: PayloadType.TokenTransfer,
    recipient,
    amount: intToBigInt(amount),
    memo: memo ?? createMemoString("")
  };
}
function createContractCallPayload(contractAddress, contractName, functionName, functionArgs) {
  if (typeof contractName === "string") {
    contractName = createLPString(contractName);
  }
  if (typeof functionName === "string") {
    functionName = createLPString(functionName);
  }
  return {
    type: StacksWireType.Payload,
    payloadType: PayloadType.ContractCall,
    contractAddress: typeof contractAddress === "string" ? createAddress(contractAddress) : contractAddress,
    contractName,
    functionName,
    functionArgs
  };
}
function codeBodyString(content) {
  return createLPString(content, 4, 1e5);
}
function createSmartContractPayload(contractName, codeBody, clarityVersion) {
  if (typeof contractName === "string") {
    contractName = createLPString(contractName);
  }
  if (typeof codeBody === "string") {
    codeBody = codeBodyString(codeBody);
  }
  if (typeof clarityVersion === "number") {
    return {
      type: StacksWireType.Payload,
      payloadType: PayloadType.VersionedSmartContract,
      clarityVersion,
      contractName,
      codeBody
    };
  }
  return {
    type: StacksWireType.Payload,
    payloadType: PayloadType.SmartContract,
    contractName,
    codeBody
  };
}
function createPoisonPayload() {
  return { type: StacksWireType.Payload, payloadType: PayloadType.PoisonMicroblock };
}
function createCoinbasePayload(coinbaseBytes, altRecipient) {
  if (coinbaseBytes.byteLength != COINBASE_BYTES_LENGTH) {
    throw Error(`Coinbase buffer size must be ${COINBASE_BYTES_LENGTH} bytes`);
  }
  if (altRecipient != void 0) {
    return {
      type: StacksWireType.Payload,
      payloadType: PayloadType.CoinbaseToAltRecipient,
      coinbaseBytes,
      recipient: altRecipient
    };
  }
  return {
    type: StacksWireType.Payload,
    payloadType: PayloadType.Coinbase,
    coinbaseBytes
  };
}
function createNakamotoCoinbasePayload(coinbaseBytes, recipient, vrfProof) {
  if (coinbaseBytes.byteLength != COINBASE_BYTES_LENGTH) {
    throw Error(`Coinbase buffer size must be ${COINBASE_BYTES_LENGTH} bytes`);
  }
  if (vrfProof.byteLength != VRF_PROOF_BYTES_LENGTH) {
    throw Error(`VRF proof buffer size must be ${VRF_PROOF_BYTES_LENGTH} bytes`);
  }
  return {
    type: StacksWireType.Payload,
    payloadType: PayloadType.NakamotoCoinbase,
    coinbaseBytes,
    recipient: recipient.type === ClarityType.OptionalSome ? recipient.value : void 0,
    vrfProof
  };
}
function createTenureChangePayload(tenureHash, previousTenureHash, burnViewHash, previousTenureEnd, previousTenureBlocks, cause, publicKeyHash) {
  return {
    type: StacksWireType.Payload,
    payloadType: PayloadType.TenureChange,
    tenureHash,
    previousTenureHash,
    burnViewHash,
    previousTenureEnd,
    previousTenureBlocks,
    cause,
    publicKeyHash
  };
}
function createLPString(content, lengthPrefixBytes, maxLengthBytes) {
  const prefixLength = lengthPrefixBytes || 1;
  const maxLength = maxLengthBytes || MAX_STRING_LENGTH_BYTES;
  if (exceedsMaxLengthBytes(content, maxLength)) {
    throw new Error(`String length exceeds maximum bytes ${maxLength}`);
  }
  return {
    type: StacksWireType.LengthPrefixedString,
    content,
    lengthPrefixBytes: prefixLength,
    maxLengthBytes: maxLength
  };
}
function createAsset(addressString, contractName, assetName) {
  return {
    type: StacksWireType.Asset,
    address: createAddress(addressString),
    contractName: createLPString(contractName),
    assetName: createLPString(assetName)
  };
}
function createAddress(c32AddressString) {
  const addressData = (0, import_c32check.c32addressDecode)(c32AddressString);
  return {
    type: StacksWireType.Address,
    version: addressData[0],
    hash160: addressData[1]
  };
}
function createContractPrincipal(addressString, contractName) {
  const addr = createAddress(addressString);
  const name = createLPString(contractName);
  return {
    type: StacksWireType.Principal,
    prefix: PostConditionPrincipalId.Contract,
    address: addr,
    contractName: name
  };
}
function createStandardPrincipal(addressString) {
  const addr = createAddress(addressString);
  return {
    type: StacksWireType.Principal,
    prefix: PostConditionPrincipalId.Standard,
    address: addr
  };
}
function createTransactionAuthField(pubKeyEncoding, contents) {
  return {
    pubKeyEncoding,
    type: StacksWireType.TransactionAuthField,
    contents
  };
}

// upstream/node_modules/@stacks/transactions/dist/esm/wire/helpers.js
var import_c32check2 = __toESM(require_lib());

// upstream/node_modules/@stacks/transactions/dist/esm/wire/serialization.js
function serializeStacksWireBytes(wire) {
  switch (wire.type) {
    case StacksWireType.Address:
      return serializeAddressBytes(wire);
    case StacksWireType.Principal:
      return serializePrincipalBytes(wire);
    case StacksWireType.LengthPrefixedString:
      return serializeLPStringBytes(wire);
    case StacksWireType.MemoString:
      return serializeMemoStringBytes(wire);
    case StacksWireType.Asset:
      return serializeAssetBytes(wire);
    case StacksWireType.PostCondition:
      return serializePostConditionWireBytes(wire);
    case StacksWireType.PublicKey:
      return serializePublicKeyBytes(wire);
    case StacksWireType.LengthPrefixedList:
      return serializeLPListBytes(wire);
    case StacksWireType.Payload:
      return serializePayloadBytes(wire);
    case StacksWireType.TransactionAuthField:
      return serializeTransactionAuthFieldBytes(wire);
    case StacksWireType.MessageSignature:
      return serializeMessageSignatureBytes(wire);
  }
}
function serializeAddressBytes(address3) {
  const bytesArray = [];
  bytesArray.push(hexToBytes3(intToHex(address3.version, 1)));
  bytesArray.push(hexToBytes3(address3.hash160));
  return concatArray(bytesArray);
}
function deserializeAddress(serialized) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  const version = hexToInt(bytesToHex3(bytesReader.readBytes(1)));
  const data = bytesToHex3(bytesReader.readBytes(20));
  return { type: StacksWireType.Address, version, hash160: data };
}
function serializePrincipalBytes(principal2) {
  const bytesArray = [];
  bytesArray.push(principal2.prefix);
  if (principal2.prefix === PostConditionPrincipalId.Standard || principal2.prefix === PostConditionPrincipalId.Contract) {
    bytesArray.push(serializeAddressBytes(principal2.address));
  }
  if (principal2.prefix === PostConditionPrincipalId.Contract) {
    bytesArray.push(serializeLPStringBytes(principal2.contractName));
  }
  return concatArray(bytesArray);
}
function deserializePrincipal(serialized) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  const prefix = bytesReader.readUInt8Enum(PostConditionPrincipalId, (n) => {
    throw new DeserializationError(`Unexpected Principal payload type: ${n}`);
  });
  if (prefix === PostConditionPrincipalId.Origin) {
    return { type: StacksWireType.Principal, prefix };
  }
  const address3 = deserializeAddress(bytesReader);
  if (prefix === PostConditionPrincipalId.Standard) {
    return { type: StacksWireType.Principal, prefix, address: address3 };
  }
  const contractName = deserializeLPString(bytesReader);
  return {
    type: StacksWireType.Principal,
    prefix,
    address: address3,
    contractName
  };
}
function serializeLPStringBytes(lps) {
  const bytesArray = [];
  const contentBytes = utf8ToBytes2(lps.content);
  const length = contentBytes.byteLength;
  bytesArray.push(hexToBytes3(intToHex(length, lps.lengthPrefixBytes)));
  bytesArray.push(contentBytes);
  return concatArray(bytesArray);
}
function deserializeLPString(serialized, prefixBytes, maxLength) {
  prefixBytes = prefixBytes ? prefixBytes : 1;
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  const length = hexToInt(bytesToHex3(bytesReader.readBytes(prefixBytes)));
  const content = bytesToUtf8(bytesReader.readBytes(length));
  return createLPString(content, prefixBytes, maxLength ?? 128);
}
function serializeMemoStringBytes(memoString) {
  const bytesArray = [];
  const contentBytes = utf8ToBytes2(memoString.content);
  const paddedContent = rightPadHexToLength(bytesToHex3(contentBytes), MEMO_MAX_LENGTH_BYTES * 2);
  bytesArray.push(hexToBytes3(paddedContent));
  return concatArray(bytesArray);
}
function deserializeMemoString(serialized) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  let content = bytesToUtf8(bytesReader.readBytes(MEMO_MAX_LENGTH_BYTES));
  content = content.replace(/\u0000*$/, "");
  return { type: StacksWireType.MemoString, content };
}
function serializeAssetBytes(info) {
  const bytesArray = [];
  bytesArray.push(serializeAddressBytes(info.address));
  bytesArray.push(serializeLPStringBytes(info.contractName));
  bytesArray.push(serializeLPStringBytes(info.assetName));
  return concatArray(bytesArray);
}
function deserializeAsset(serialized) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  return {
    type: StacksWireType.Asset,
    address: deserializeAddress(bytesReader),
    contractName: deserializeLPString(bytesReader),
    assetName: deserializeLPString(bytesReader)
  };
}
function serializeLPListBytes(lpList) {
  const list2 = lpList.values;
  const bytesArray = [];
  bytesArray.push(hexToBytes3(intToHex(list2.length, lpList.lengthPrefixBytes)));
  for (const l of list2) {
    bytesArray.push(serializeStacksWireBytes(l));
  }
  return concatArray(bytesArray);
}
function deserializeLPList(serialized, type, lengthPrefixBytes) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  const length = hexToInt(bytesToHex3(bytesReader.readBytes(lengthPrefixBytes || 4)));
  const l = [];
  for (let index = 0; index < length; index++) {
    switch (type) {
      case StacksWireType.Address:
        l.push(deserializeAddress(bytesReader));
        break;
      case StacksWireType.LengthPrefixedString:
        l.push(deserializeLPString(bytesReader));
        break;
      case StacksWireType.MemoString:
        l.push(deserializeMemoString(bytesReader));
        break;
      case StacksWireType.Asset:
        l.push(deserializeAsset(bytesReader));
        break;
      case StacksWireType.PostCondition:
        l.push(deserializePostConditionWire(bytesReader));
        break;
      case StacksWireType.PublicKey:
        l.push(deserializePublicKey(bytesReader));
        break;
      case StacksWireType.TransactionAuthField:
        l.push(deserializeTransactionAuthField(bytesReader));
        break;
    }
  }
  return createLPList(l, lengthPrefixBytes);
}
function serializePostConditionWireBytes(postCondition) {
  const bytesArray = [];
  bytesArray.push(postCondition.conditionType);
  bytesArray.push(serializePrincipalBytes(postCondition.principal));
  if (postCondition.conditionType === PostConditionType.Fungible || postCondition.conditionType === PostConditionType.NonFungible) {
    bytesArray.push(serializeAssetBytes(postCondition.asset));
  }
  if (postCondition.conditionType === PostConditionType.NonFungible) {
    bytesArray.push(serializeCVBytes(postCondition.assetName));
  }
  bytesArray.push(postCondition.conditionCode);
  if (postCondition.conditionType === PostConditionType.STX || postCondition.conditionType === PostConditionType.Fungible || postCondition.conditionType === PostConditionType.Staking) {
    if (postCondition.amount > BigInt("0xffffffffffffffff"))
      throw new SerializationError("The post-condition amount may not be larger than 8 bytes");
    bytesArray.push(intToBytes(postCondition.amount, 8));
  }
  return concatArray(bytesArray);
}
function deserializePostConditionWire(serialized) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  const postConditionType = bytesReader.readUInt8Enum(PostConditionType, (n) => {
    throw new DeserializationError(`Could not read ${n} as PostConditionType`);
  });
  const principal2 = deserializePrincipal(bytesReader);
  let conditionCode;
  let asset;
  let amount;
  switch (postConditionType) {
    case PostConditionType.STX:
      conditionCode = bytesReader.readUInt8Enum(FungibleConditionCode, (n) => {
        throw new DeserializationError(`Could not read ${n} as FungibleConditionCode`);
      });
      amount = BigInt(`0x${bytesToHex3(bytesReader.readBytes(8))}`);
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.STX,
        principal: principal2,
        conditionCode,
        amount
      };
    case PostConditionType.Fungible:
      asset = deserializeAsset(bytesReader);
      conditionCode = bytesReader.readUInt8Enum(FungibleConditionCode, (n) => {
        throw new DeserializationError(`Could not read ${n} as FungibleConditionCode`);
      });
      amount = BigInt(`0x${bytesToHex3(bytesReader.readBytes(8))}`);
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.Fungible,
        principal: principal2,
        conditionCode,
        amount,
        asset
      };
    case PostConditionType.NonFungible:
      asset = deserializeAsset(bytesReader);
      const assetName = deserializeCV(bytesReader);
      conditionCode = bytesReader.readUInt8Enum(NonFungibleConditionCode, (n) => {
        throw new DeserializationError(`Could not read ${n} as FungibleConditionCode`);
      });
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.NonFungible,
        principal: principal2,
        conditionCode,
        asset,
        assetName
      };
    case PostConditionType.Staking:
      conditionCode = bytesReader.readUInt8Enum(FungibleConditionCode, (n) => {
        throw new DeserializationError(`Could not read ${n} as FungibleConditionCode`);
      });
      amount = BigInt(`0x${bytesToHex3(bytesReader.readBytes(8))}`);
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.Staking,
        principal: principal2,
        conditionCode,
        amount
      };
    case PostConditionType.PoX: {
      const poxConditionCode = bytesReader.readUInt8Enum(PoxConditionCode, (n) => {
        throw new DeserializationError(`Could not read ${n} as PoxConditionCode`);
      });
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.PoX,
        principal: principal2,
        conditionCode: poxConditionCode
      };
    }
  }
}
function serializePayloadBytes(payload) {
  const bytesArray = [];
  bytesArray.push(payload.payloadType);
  switch (payload.payloadType) {
    case PayloadType.TokenTransfer:
      bytesArray.push(serializeCVBytes(payload.recipient));
      bytesArray.push(intToBytes(payload.amount, 8));
      bytesArray.push(serializeStacksWireBytes(payload.memo));
      break;
    case PayloadType.ContractCall:
      bytesArray.push(serializeStacksWireBytes(payload.contractAddress));
      bytesArray.push(serializeStacksWireBytes(payload.contractName));
      bytesArray.push(serializeStacksWireBytes(payload.functionName));
      const numArgs = new Uint8Array(4);
      writeUInt32BE(numArgs, payload.functionArgs.length, 0);
      bytesArray.push(numArgs);
      payload.functionArgs.forEach((arg) => {
        bytesArray.push(serializeCVBytes(arg));
      });
      break;
    case PayloadType.SmartContract:
      bytesArray.push(serializeStacksWireBytes(payload.contractName));
      bytesArray.push(serializeStacksWireBytes(payload.codeBody));
      break;
    case PayloadType.VersionedSmartContract:
      bytesArray.push(payload.clarityVersion);
      bytesArray.push(serializeStacksWireBytes(payload.contractName));
      bytesArray.push(serializeStacksWireBytes(payload.codeBody));
      break;
    case PayloadType.PoisonMicroblock:
      break;
    case PayloadType.Coinbase:
      bytesArray.push(payload.coinbaseBytes);
      break;
    case PayloadType.CoinbaseToAltRecipient:
      bytesArray.push(payload.coinbaseBytes);
      bytesArray.push(serializeCVBytes(payload.recipient));
      break;
    case PayloadType.NakamotoCoinbase:
      bytesArray.push(payload.coinbaseBytes);
      bytesArray.push(serializeCVBytes(payload.recipient ? someCV(payload.recipient) : noneCV()));
      bytesArray.push(payload.vrfProof);
      break;
    case PayloadType.TenureChange:
      bytesArray.push(hexToBytes3(payload.tenureHash));
      bytesArray.push(hexToBytes3(payload.previousTenureHash));
      bytesArray.push(hexToBytes3(payload.burnViewHash));
      bytesArray.push(hexToBytes3(payload.previousTenureEnd));
      bytesArray.push(writeUInt32BE(new Uint8Array(4), payload.previousTenureBlocks));
      bytesArray.push(writeUInt8(new Uint8Array(1), payload.cause));
      bytesArray.push(hexToBytes3(payload.publicKeyHash));
      break;
  }
  return concatArray(bytesArray);
}
function deserializePayload(serialized) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  const payloadType = bytesReader.readUInt8Enum(PayloadType, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  });
  switch (payloadType) {
    case PayloadType.TokenTransfer:
      const recipient = deserializeCV(bytesReader);
      const amount = intToBigInt(bytesReader.readBytes(8));
      const memo = deserializeMemoString(bytesReader);
      return createTokenTransferPayload(recipient, amount, memo);
    case PayloadType.ContractCall:
      const contractAddress = deserializeAddress(bytesReader);
      const contractCallName = deserializeLPString(bytesReader);
      const functionName = deserializeLPString(bytesReader);
      const functionArgs = [];
      const numberOfArgs = bytesReader.readUInt32BE();
      for (let i = 0; i < numberOfArgs; i++) {
        const clarityValue = deserializeCV(bytesReader);
        functionArgs.push(clarityValue);
      }
      return createContractCallPayload(contractAddress, contractCallName, functionName, functionArgs);
    case PayloadType.SmartContract:
      const smartContractName = deserializeLPString(bytesReader);
      const codeBody = deserializeLPString(bytesReader, 4, 1e5);
      return createSmartContractPayload(smartContractName, codeBody);
    case PayloadType.VersionedSmartContract: {
      const clarityVersion = bytesReader.readUInt8Enum(ClarityVersion, (n) => {
        throw new Error(`Cannot recognize ClarityVersion: ${n}`);
      });
      const smartContractName2 = deserializeLPString(bytesReader);
      const codeBody2 = deserializeLPString(bytesReader, 4, STRING_MAX_LENGTH);
      return createSmartContractPayload(smartContractName2, codeBody2, clarityVersion);
    }
    case PayloadType.PoisonMicroblock:
      return createPoisonPayload();
    case PayloadType.Coinbase: {
      const coinbaseBytes = bytesReader.readBytes(COINBASE_BYTES_LENGTH);
      return createCoinbasePayload(coinbaseBytes);
    }
    case PayloadType.CoinbaseToAltRecipient: {
      const coinbaseBytes = bytesReader.readBytes(COINBASE_BYTES_LENGTH);
      const altRecipient = deserializeCV(bytesReader);
      return createCoinbasePayload(coinbaseBytes, altRecipient);
    }
    case PayloadType.NakamotoCoinbase: {
      const coinbaseBytes = bytesReader.readBytes(COINBASE_BYTES_LENGTH);
      const recipient2 = deserializeCV(bytesReader);
      const vrfProof = bytesReader.readBytes(VRF_PROOF_BYTES_LENGTH);
      return createNakamotoCoinbasePayload(coinbaseBytes, recipient2, vrfProof);
    }
    case PayloadType.TenureChange:
      const tenureHash = bytesToHex3(bytesReader.readBytes(20));
      const previousTenureHash = bytesToHex3(bytesReader.readBytes(20));
      const burnViewHash = bytesToHex3(bytesReader.readBytes(20));
      const previousTenureEnd = bytesToHex3(bytesReader.readBytes(32));
      const previousTenureBlocks = bytesReader.readUInt32BE();
      const cause = bytesReader.readUInt8Enum(TenureChangeCause, (n) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${n}`);
      });
      const publicKeyHash = bytesToHex3(bytesReader.readBytes(20));
      return createTenureChangePayload(tenureHash, previousTenureHash, burnViewHash, previousTenureEnd, previousTenureBlocks, cause, publicKeyHash);
  }
}
function deserializeMessageSignature(serialized) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  return createMessageSignature(bytesToHex3(bytesReader.readBytes(RECOVERABLE_ECDSA_SIG_LENGTH_BYTES)));
}
function deserializeTransactionAuthField(serialized) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  const authFieldType = bytesReader.readUInt8Enum(AuthFieldType, (n) => {
    throw new DeserializationError(`Could not read ${n} as AuthFieldType`);
  });
  switch (authFieldType) {
    case AuthFieldType.PublicKeyCompressed:
      return createTransactionAuthField(PubKeyEncoding.Compressed, deserializePublicKey(bytesReader));
    case AuthFieldType.PublicKeyUncompressed:
      return createTransactionAuthField(PubKeyEncoding.Uncompressed, createStacksPublicKey(uncompressPublicKey(deserializePublicKey(bytesReader).data)));
    case AuthFieldType.SignatureCompressed:
      return createTransactionAuthField(PubKeyEncoding.Compressed, deserializeMessageSignature(bytesReader));
    case AuthFieldType.SignatureUncompressed:
      return createTransactionAuthField(PubKeyEncoding.Uncompressed, deserializeMessageSignature(bytesReader));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(authFieldType)}`);
  }
}
function serializeMessageSignatureBytes(messageSignature) {
  return hexToBytes3(messageSignature.data);
}
function serializeTransactionAuthFieldBytes(field) {
  const bytesArray = [];
  switch (field.contents.type) {
    case StacksWireType.PublicKey:
      bytesArray.push(field.pubKeyEncoding === PubKeyEncoding.Compressed ? AuthFieldType.PublicKeyCompressed : AuthFieldType.PublicKeyUncompressed);
      bytesArray.push(hexToBytes3(compressPublicKey(field.contents.data)));
      break;
    case StacksWireType.MessageSignature:
      bytesArray.push(field.pubKeyEncoding === PubKeyEncoding.Compressed ? AuthFieldType.SignatureCompressed : AuthFieldType.SignatureUncompressed);
      bytesArray.push(serializeMessageSignatureBytes(field.contents));
      break;
  }
  return concatArray(bytesArray);
}
function serializePublicKeyBytes(key) {
  return key.data.slice();
}
function deserializePublicKey(serialized) {
  const bytesReader = isInstance(serialized, BytesReader) ? serialized : new BytesReader(serialized);
  const fieldId = bytesReader.readUInt8();
  const keyLength = fieldId === 4 ? UNCOMPRESSED_PUBKEY_LENGTH_BYTES : COMPRESSED_PUBKEY_LENGTH_BYTES;
  return createStacksPublicKey(concatArray([fieldId, bytesReader.readBytes(keyLength)]));
}

// upstream/node_modules/@stacks/transactions/dist/esm/wire/helpers.js
function addressFromPublicKeys(version, hashMode, numSigs, publicKeys) {
  if (publicKeys.length === 0) {
    throw Error("Invalid number of public keys");
  }
  if (hashMode === AddressHashMode.P2PKH || hashMode === AddressHashMode.P2WPKH) {
    if (publicKeys.length !== 1 || numSigs !== 1) {
      throw Error("Invalid number of public keys or signatures");
    }
  }
  if (hashMode === AddressHashMode.P2WPKH || hashMode === AddressHashMode.P2WSH || hashMode === AddressHashMode.P2WSHNonSequential) {
    if (!publicKeys.map((p) => p.data).every(publicKeyIsCompressed)) {
      throw Error("Public keys must be compressed for segwit");
    }
  }
  switch (hashMode) {
    case AddressHashMode.P2PKH:
      return addressFromVersionHash(version, hashP2PKH(publicKeys[0].data));
    case AddressHashMode.P2WPKH:
      return addressFromVersionHash(version, hashP2WPKH(publicKeys[0].data));
    case AddressHashMode.P2SH:
    case AddressHashMode.P2SHNonSequential:
      return addressFromVersionHash(version, hashP2SH(numSigs, publicKeys.map(serializePublicKeyBytes)));
    case AddressHashMode.P2WSH:
    case AddressHashMode.P2WSHNonSequential:
      return addressFromVersionHash(version, hashP2WSH(numSigs, publicKeys.map(serializePublicKeyBytes)));
  }
}
function addressFromVersionHash(version, hash2) {
  return { type: StacksWireType.Address, version, hash160: hash2 };
}
function addressToString(address3) {
  return (0, import_c32check2.c32address)(address3.version, address3.hash160);
}
function parseAssetString(id) {
  const [assetAddress, assetContractName, assetTokenName] = id.split(/\.|::/);
  const asset = createAsset(assetAddress, assetContractName, assetTokenName);
  return asset;
}
function parsePrincipalString(principalString) {
  if (principalString.includes(".")) {
    const [address3, contractName] = principalString.split(".");
    return createContractPrincipal(address3, contractName);
  } else {
    return createStandardPrincipal(principalString);
  }
}

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/values/principalCV.js
function principalCV(principal2) {
  if (principal2.includes(".")) {
    const [address3, contractName] = principal2.split(".");
    return contractPrincipalCV(address3, contractName);
  } else {
    return standardPrincipalCV(principal2);
  }
}
function standardPrincipalCV(addressString) {
  const addr = createAddress(addressString);
  return { type: ClarityType.PrincipalStandard, value: addressToString(addr) };
}
function standardPrincipalCVFromAddress(address3) {
  return { type: ClarityType.PrincipalStandard, value: addressToString(address3) };
}
function contractPrincipalCV(addressString, contractName) {
  const addr = createAddress(addressString);
  const lengthPrefixedContractName = createLPString(contractName);
  return contractPrincipalCVFromAddress(addr, lengthPrefixedContractName);
}
function contractPrincipalCVFromAddress(address3, contractName) {
  if (utf8ToBytes2(contractName.content).byteLength >= 128) {
    throw new Error("Contract name must be less than 128 bytes");
  }
  return {
    type: ClarityType.PrincipalContract,
    value: `${addressToString(address3)}.${contractName.content}`
  };
}

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/values/responseCV.js
function responseErrorCV(value) {
  return { type: ClarityType.ResponseErr, value };
}
function responseOkCV(value) {
  return { type: ClarityType.ResponseOk, value };
}

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/values/stringCV.js
var stringAsciiCV = (data) => {
  return { type: ClarityType.StringASCII, value: data };
};
var stringUtf8CV = (data) => {
  return { type: ClarityType.StringUTF8, value: data };
};

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/values/tupleCV.js
function tupleCV(data) {
  for (const key in data) {
    if (!isClarityName(key)) {
      throw new Error(`"${key}" is not a valid Clarity name`);
    }
  }
  return { type: ClarityType.Tuple, value: data };
}

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/deserialize.js
function deserializeCV(serializedClarityValue) {
  let bytesReader;
  if (typeof serializedClarityValue === "string") {
    const hasHexPrefix = serializedClarityValue.slice(0, 2).toLowerCase() === "0x";
    bytesReader = new BytesReader(hexToBytes3(hasHexPrefix ? serializedClarityValue.slice(2) : serializedClarityValue));
  } else if (serializedClarityValue instanceof Uint8Array) {
    bytesReader = new BytesReader(serializedClarityValue);
  } else {
    bytesReader = serializedClarityValue;
  }
  const type = bytesReader.readUInt8Enum(ClarityWireType, (n) => {
    throw new DeserializationError(`Cannot recognize Clarity Type: ${n}`);
  });
  switch (type) {
    case ClarityWireType.int:
      return intCV(bytesToTwosBigInt(bytesReader.readBytes(16)));
    case ClarityWireType.uint:
      return uintCV(bytesReader.readBytes(16));
    case ClarityWireType.buffer:
      const bufferLength = bytesReader.readUInt32BE();
      return bufferCV(bytesReader.readBytes(bufferLength));
    case ClarityWireType.true:
      return trueCV();
    case ClarityWireType.false:
      return falseCV();
    case ClarityWireType.address:
      const sAddress = deserializeAddress(bytesReader);
      return standardPrincipalCVFromAddress(sAddress);
    case ClarityWireType.contract:
      const cAddress = deserializeAddress(bytesReader);
      const contractName = deserializeLPString(bytesReader);
      return contractPrincipalCVFromAddress(cAddress, contractName);
    case ClarityWireType.ok:
      return responseOkCV(deserializeCV(bytesReader));
    case ClarityWireType.err:
      return responseErrorCV(deserializeCV(bytesReader));
    case ClarityWireType.none:
      return noneCV();
    case ClarityWireType.some:
      return someCV(deserializeCV(bytesReader));
    case ClarityWireType.list:
      const listLength = bytesReader.readUInt32BE();
      const listContents = [];
      for (let i = 0; i < listLength; i++) {
        listContents.push(deserializeCV(bytesReader));
      }
      return listCV(listContents);
    case ClarityWireType.tuple:
      const tupleLength = bytesReader.readUInt32BE();
      const tupleContents = {};
      for (let i = 0; i < tupleLength; i++) {
        const clarityName = deserializeLPString(bytesReader).content;
        if (clarityName === void 0) {
          throw new DeserializationError('"content" is undefined');
        }
        tupleContents[clarityName] = deserializeCV(bytesReader);
      }
      return tupleCV(tupleContents);
    case ClarityWireType.ascii:
      const asciiStrLen = bytesReader.readUInt32BE();
      const asciiStr = bytesToAscii(bytesReader.readBytes(asciiStrLen));
      return stringAsciiCV(asciiStr);
    case ClarityWireType.utf8:
      const utf8StrLen = bytesReader.readUInt32BE();
      const utf8Str = bytesToUtf8(bytesReader.readBytes(utf8StrLen));
      return stringUtf8CV(utf8Str);
    default:
      throw new DeserializationError("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/serialize.js
function bytesWithTypeID(typeId, bytes3) {
  return concatArray([clarityTypeToByte(typeId), bytes3]);
}
function serializeBoolCV(value) {
  return new Uint8Array([clarityTypeToByte(value.type)]);
}
function serializeOptionalCV(cv) {
  if (cv.type === ClarityType.OptionalNone) {
    return new Uint8Array([clarityTypeToByte(cv.type)]);
  } else {
    return bytesWithTypeID(cv.type, serializeCVBytes(cv.value));
  }
}
function serializeBufferCV(cv) {
  const length = new Uint8Array(4);
  writeUInt32BE(length, Math.ceil(cv.value.length / 2), 0);
  return bytesWithTypeID(cv.type, concatBytes3(length, hexToBytes3(cv.value)));
}
function serializeIntCV(cv) {
  const bytes3 = bigIntToBytes(toTwos(BigInt(cv.value), BigInt(CLARITY_INT_SIZE)), CLARITY_INT_BYTE_SIZE);
  return bytesWithTypeID(cv.type, bytes3);
}
function serializeUIntCV(cv) {
  const bytes3 = bigIntToBytes(BigInt(cv.value), CLARITY_INT_BYTE_SIZE);
  return bytesWithTypeID(cv.type, bytes3);
}
function serializeStandardPrincipalCV(cv) {
  return bytesWithTypeID(cv.type, serializeAddressBytes(createAddress(cv.value)));
}
function serializeContractPrincipalCV(cv) {
  const [address3, name] = parseContractId(cv.value);
  return bytesWithTypeID(cv.type, concatBytes3(serializeAddressBytes(createAddress(address3)), serializeLPStringBytes(createLPString(name))));
}
function serializeResponseCV(cv) {
  return bytesWithTypeID(cv.type, serializeCVBytes(cv.value));
}
function serializeListCV(cv) {
  const bytesArray = [];
  const length = new Uint8Array(4);
  writeUInt32BE(length, cv.value.length, 0);
  bytesArray.push(length);
  for (const value of cv.value) {
    const serializedValue = serializeCVBytes(value);
    bytesArray.push(serializedValue);
  }
  return bytesWithTypeID(cv.type, concatArray(bytesArray));
}
function serializeTupleCV(cv) {
  const bytesArray = [];
  const length = new Uint8Array(4);
  writeUInt32BE(length, Object.keys(cv.value).length, 0);
  bytesArray.push(length);
  const lexicographicOrder = Object.keys(cv.value).sort((a, b) => a.localeCompare(b));
  for (const key of lexicographicOrder) {
    const nameWithLength = createLPString(key);
    bytesArray.push(serializeLPStringBytes(nameWithLength));
    const serializedValue = serializeCVBytes(cv.value[key]);
    bytesArray.push(serializedValue);
  }
  return bytesWithTypeID(cv.type, concatArray(bytesArray));
}
function serializeStringCV(cv, encoding) {
  const bytesArray = [];
  const str = encoding == "ascii" ? asciiToBytes2(cv.value) : utf8ToBytes2(cv.value);
  const len = new Uint8Array(4);
  writeUInt32BE(len, str.length, 0);
  bytesArray.push(len);
  bytesArray.push(str);
  return bytesWithTypeID(cv.type, concatArray(bytesArray));
}
function serializeStringAsciiCV(cv) {
  return serializeStringCV(cv, "ascii");
}
function serializeStringUtf8CV(cv) {
  return serializeStringCV(cv, "utf8");
}
function serializeCV(value) {
  return bytesToHex3(serializeCVBytes(value));
}
function serializeCVBytes(value) {
  switch (value.type) {
    case ClarityType.BoolTrue:
    case ClarityType.BoolFalse:
      return serializeBoolCV(value);
    case ClarityType.OptionalNone:
    case ClarityType.OptionalSome:
      return serializeOptionalCV(value);
    case ClarityType.Buffer:
      return serializeBufferCV(value);
    case ClarityType.UInt:
      return serializeUIntCV(value);
    case ClarityType.Int:
      return serializeIntCV(value);
    case ClarityType.PrincipalStandard:
      return serializeStandardPrincipalCV(value);
    case ClarityType.PrincipalContract:
      return serializeContractPrincipalCV(value);
    case ClarityType.ResponseOk:
    case ClarityType.ResponseErr:
      return serializeResponseCV(value);
    case ClarityType.List:
      return serializeListCV(value);
    case ClarityType.Tuple:
      return serializeTupleCV(value);
    case ClarityType.StringASCII:
      return serializeStringAsciiCV(value);
    case ClarityType.StringUTF8:
      return serializeStringUtf8CV(value);
    default:
      throw new SerializationError("Unable to serialize. Invalid Clarity Value.");
  }
}

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/parser.js
function regex(pattern, map) {
  return (s) => {
    const match2 = s.match(pattern);
    if (!match2 || match2.index !== 0)
      return { success: false };
    return {
      success: true,
      value: match2[0],
      rest: s.substring(match2[0].length),
      capture: map ? map(match2[0]) : void 0
    };
  };
}
function whitespace() {
  return regex(/\s+/);
}
function lazy(c) {
  return (s) => c()(s);
}
function either(combinators) {
  return (s) => {
    for (const c of combinators) {
      const result = c(s);
      if (result.success)
        return result;
    }
    return { success: false };
  };
}
function entire(combinator) {
  return (s) => {
    const result = combinator(s);
    if (!result.success || result.rest)
      return { success: false };
    return result;
  };
}
function optional(c) {
  return (s) => {
    const result = c(s);
    if (result.success)
      return result;
    return {
      success: true,
      value: "",
      rest: s
    };
  };
}
function sequence(combinators, reduce = (v) => v[0]) {
  return (s) => {
    let rest = s;
    let value = "";
    const captures = [];
    for (const c of combinators) {
      const result = c(rest);
      if (!result.success)
        return { success: false };
      rest = result.rest;
      value += result.value;
      if (result.capture)
        captures.push(result.capture);
    }
    return {
      success: true,
      value,
      rest,
      capture: reduce(captures)
    };
  };
}
function chain2(combinators, reduce = (v) => v[0]) {
  const joined = combinators.flatMap((combinator, index) => index === 0 ? [combinator] : [optional(whitespace()), combinator]);
  return sequence(joined, reduce);
}
function parens(combinator) {
  return chain2([regex(/\(/), combinator, regex(/\)/)]);
}
function greedy(min, combinator, reduce = (v) => v[v.length - 1], separator) {
  return (s) => {
    let rest = s;
    let value = "";
    const captures = [];
    let count;
    for (count = 0; ; count++) {
      const result = combinator(rest);
      if (!result.success)
        break;
      rest = result.rest;
      value += result.value;
      if (result.capture)
        captures.push(result.capture);
      if (separator) {
        const sepResult = separator(rest);
        if (!sepResult.success) {
          count++;
          break;
        }
        rest = sepResult.rest;
        value += sepResult.value;
      }
    }
    if (count < min)
      return { success: false };
    return {
      success: true,
      value,
      rest,
      capture: reduce(captures)
    };
  };
}
function capture(combinator, map) {
  return (s) => {
    const result = combinator(s);
    if (!result.success)
      return { success: false };
    return {
      success: true,
      value: result.value,
      rest: result.rest,
      capture: map ? map(result.value) : result.value
    };
  };
}
function clInt() {
  return capture(regex(/-?[0-9]+/), (v) => cl_exports.int(parseInt(v)));
}
function clUint() {
  return sequence([regex(/u/), capture(regex(/[0-9]+/), (v) => cl_exports.uint(parseInt(v)))]);
}
function clBool() {
  return capture(regex(/true|false/), (v) => cl_exports.bool(v === "true"));
}
function clPrincipal() {
  return sequence([
    regex(/'/),
    capture(sequence([regex(/[A-Z0-9]+/), optional(sequence([regex(/\./), regex(/[a-zA-Z0-9-]+/)]))]), cl_exports.address)
  ]);
}
function clBuffer() {
  return sequence([regex(/0x/), capture(regex(/[0-9a-fA-F]+/), cl_exports.bufferFromHex)]);
}
function unescape(input) {
  try {
    return JSON.parse(`"${input}"`);
  } catch (error2) {
    throw new Error(`Failed to unescape string: "${input}" ${error2 instanceof Error ? error2.message : error2}`);
  }
}
function clAscii() {
  return sequence([
    regex(/"/),
    capture(regex(/(\\.|[^"])*/), (t) => cl_exports.stringAscii(unescape(t))),
    regex(/"/)
  ]);
}
function clUtf8() {
  return sequence([
    regex(/u"/),
    capture(regex(/(\\.|[^"])*/), (t) => cl_exports.stringUtf8(unescape(t))),
    regex(/"/)
  ]);
}
function clList() {
  return parens(sequence([
    regex(/list/),
    greedy(0, sequence([whitespace(), clValue()]), (c) => cl_exports.list(c))
  ]));
}
function clTuple() {
  const tupleCurly = chain2([
    regex(/\{/),
    greedy(1, sequence([
      capture(regex(/[a-zA-Z][a-zA-Z0-9_]*/)),
      regex(/\s*:/),
      whitespace(),
      clValue()
    ], ([k, v]) => cl_exports.tuple({ [k]: v })), (c) => cl_exports.tuple(Object.assign({}, ...c.map((t) => t.value))), regex(/\s*,\s*/)),
    regex(/\}/)
  ]);
  const tupleFunction = parens(sequence([
    optional(whitespace()),
    regex(/tuple/),
    whitespace(),
    greedy(1, parens(sequence([
      optional(whitespace()),
      capture(regex(/[a-zA-Z][a-zA-Z0-9_]*/)),
      whitespace(),
      clValue(),
      optional(whitespace())
    ], ([k, v]) => cl_exports.tuple({ [k]: v }))), (c) => cl_exports.tuple(Object.assign({}, ...c.map((t) => t.value))), whitespace())
  ]));
  return either([tupleCurly, tupleFunction]);
}
function clNone() {
  return capture(regex(/none/), cl_exports.none);
}
function clSome() {
  return parens(sequence([regex(/some/), whitespace(), clValue()], (c) => cl_exports.some(c[0])));
}
function clOk() {
  return parens(sequence([regex(/ok/), whitespace(), clValue()], (c) => cl_exports.ok(c[0])));
}
function clErr() {
  return parens(sequence([regex(/err/), whitespace(), clValue()], (c) => cl_exports.error(c[0])));
}
function clValue(map = (v) => v) {
  return either([
    clBuffer,
    clAscii,
    clUtf8,
    clInt,
    clUint,
    clBool,
    clPrincipal,
    clList,
    clTuple,
    clNone,
    clSome,
    clOk,
    clErr
  ].map(lazy).map(map));
}
function parse(clarityValueString) {
  const result = clValue(entire)(clarityValueString);
  if (!result.success || !result.capture)
    throw "Parse error";
  return result.capture;
}

// upstream/node_modules/@stacks/transactions/dist/esm/utils.js
var leftPadHex = (hexString) => hexString.length % 2 ? `0${hexString}` : hexString;
var rightPadHexToLength = (hexString, length) => hexString.padEnd(length, "0");
var exceedsMaxLengthBytes = (string, maxLengthBytes) => string ? utf8ToBytes2(string).length > maxLengthBytes : false;
function cloneDeep(obj) {
  return (0, import_lodash.default)(obj);
}
var hash1602 = (input) => {
  return ripemd1602(sha2562(input));
};
var txidFromData = (data) => {
  return bytesToHex3(sha512_256(data));
};
var hashP2PKH = (input) => {
  return bytesToHex3(hash1602(input));
};
var hashP2WPKH = (input) => {
  const keyHash = hash1602(input);
  const redeemScript = concatBytes3(new Uint8Array([0]), new Uint8Array([keyHash.length]), keyHash);
  const redeemScriptHash = hash1602(redeemScript);
  return bytesToHex3(redeemScriptHash);
};
var hashP2SH = (numSigs, pubKeys) => {
  if (numSigs > 15 || pubKeys.length > 15) {
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  }
  const bytesArray = [];
  bytesArray.push(80 + numSigs);
  pubKeys.forEach((pubKey) => {
    bytesArray.push(pubKey.length);
    bytesArray.push(pubKey);
  });
  bytesArray.push(80 + pubKeys.length);
  bytesArray.push(174);
  const redeemScript = concatArray(bytesArray);
  const redeemScriptHash = hash1602(redeemScript);
  return bytesToHex3(redeemScriptHash);
};
var hashP2WSH = (numSigs, pubKeys) => {
  if (numSigs > 15 || pubKeys.length > 15) {
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  }
  const scriptArray = [];
  scriptArray.push(80 + numSigs);
  pubKeys.forEach((pubKey) => {
    scriptArray.push(pubKey.length);
    scriptArray.push(pubKey);
  });
  scriptArray.push(80 + pubKeys.length);
  scriptArray.push(174);
  const script = concatArray(scriptArray);
  const digest = sha2562(script);
  const bytesArray = [];
  bytesArray.push(0);
  bytesArray.push(digest.length);
  bytesArray.push(digest);
  const redeemScript = concatArray(bytesArray);
  const redeemScriptHash = hash1602(redeemScript);
  return bytesToHex3(redeemScriptHash);
};
function isClarityName(name) {
  const regex2 = /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/;
  return regex2.test(name) && name.length < 128;
}
function parseContractId(contractId) {
  const [address3, name] = contractId.split(".");
  if (!address3 || !name)
    throw new Error(`Invalid contract identifier: ${contractId}`);
  return [address3, name];
}

// upstream/node_modules/@stacks/transactions/dist/esm/keys.js
utils2.hmacSha256Sync = (key, ...msgs) => {
  const h = hmac2.create(sha2562, key);
  msgs.forEach((msg) => h.update(msg));
  return h.digest();
};
function getAddressFromPrivateKey(privateKey, network = "mainnet") {
  network = networkFrom(network);
  const publicKey2 = privateKeyToPublic(privateKey);
  return getAddressFromPublicKey(publicKey2, network);
}
function getAddressFromPublicKey(publicKey2, network = "mainnet") {
  network = networkFrom(network);
  publicKey2 = typeof publicKey2 === "string" ? hexToBytes3(publicKey2) : publicKey2;
  const addrVer = addressHashModeToVersion(AddressHashMode.P2PKH, network);
  const addr = addressFromVersionHash(addrVer, hashP2PKH(publicKey2));
  const addrString = addressToString(addr);
  return addrString;
}
function createStacksPublicKey(publicKey2) {
  publicKey2 = typeof publicKey2 === "string" ? hexToBytes3(publicKey2) : publicKey2;
  return {
    type: StacksWireType.PublicKey,
    data: publicKey2
  };
}
function publicKeyFromSignatureVrs(messageHash, messageSignature, pubKeyEncoding = PubKeyEncoding.Compressed) {
  const parsedSignature = parseRecoverableSignatureVrs(messageSignature);
  const signature = new Signature(hexToBigInt(parsedSignature.r), hexToBigInt(parsedSignature.s));
  const point = Point2.fromSignature(messageHash, signature, parsedSignature.recoveryId);
  const compressed = pubKeyEncoding === PubKeyEncoding.Compressed;
  return point.toHex(compressed);
}
function privateKeyToHex(publicKey2) {
  return typeof publicKey2 === "string" ? publicKey2 : bytesToHex3(publicKey2);
}
var publicKeyToHex = privateKeyToHex;
function privateKeyIsCompressed(privateKey) {
  const length = typeof privateKey === "string" ? privateKey.length / 2 : privateKey.byteLength;
  return length === PRIVATE_KEY_BYTES_COMPRESSED;
}
function publicKeyIsCompressed(publicKey2) {
  return !publicKeyToHex(publicKey2).startsWith("04");
}
function privateKeyToPublic(privateKey) {
  privateKey = privateKeyToBytes(privateKey);
  const isCompressed = privateKeyIsCompressed(privateKey);
  return bytesToHex3(getPublicKey(privateKey.slice(0, 32), isCompressed));
}
function compressPublicKey(publicKey2) {
  return Point2.fromHex(publicKeyToHex(publicKey2)).toHex(true);
}
function uncompressPublicKey(publicKey2) {
  return Point2.fromHex(publicKeyToHex(publicKey2)).toHex(false);
}
function signWithKey(privateKey, messageHash) {
  privateKey = privateKeyToBytes(privateKey);
  const [rawSignature, recoveryId] = signSync(messageHash, privateKey.slice(0, 32), {
    canonical: true,
    recovered: true
  });
  if (recoveryId == null) {
    throw new Error("No signature recoveryId received");
  }
  const recoveryIdHex = intToHex(recoveryId, 1);
  return recoveryIdHex + Signature.fromHex(rawSignature).toCompactHex();
}

// upstream/node_modules/@stacks/transactions/dist/esm/authorization.js
function emptyMessageSignature() {
  return {
    type: StacksWireType.MessageSignature,
    data: bytesToHex3(new Uint8Array(RECOVERABLE_ECDSA_SIG_LENGTH_BYTES))
  };
}
function createSingleSigSpendingCondition(hashMode, pubKey, nonce, fee) {
  const signer = addressFromPublicKeys(0, hashMode, 1, [createStacksPublicKey(pubKey)]).hash160;
  const keyEncoding = publicKeyIsCompressed(pubKey) ? PubKeyEncoding.Compressed : PubKeyEncoding.Uncompressed;
  return {
    hashMode,
    signer,
    nonce: intToBigInt(nonce),
    fee: intToBigInt(fee),
    keyEncoding,
    signature: emptyMessageSignature()
  };
}
function createMultiSigSpendingCondition(hashMode, numSigs, pubKeys, nonce, fee) {
  const stacksPublicKeys = pubKeys.map(createStacksPublicKey);
  const signer = addressFromPublicKeys(0, hashMode, numSigs, stacksPublicKeys).hash160;
  return {
    hashMode,
    signer,
    nonce: intToBigInt(nonce),
    fee: intToBigInt(fee),
    fields: [],
    signaturesRequired: numSigs
  };
}
function isSingleSig(condition) {
  return "signature" in condition;
}
function isSequentialMultiSig(hashMode) {
  return hashMode === AddressHashMode.P2SH || hashMode === AddressHashMode.P2WSH;
}
function isNonSequentialMultiSig(hashMode) {
  return hashMode === AddressHashMode.P2SHNonSequential || hashMode === AddressHashMode.P2WSHNonSequential;
}
function clearCondition(condition) {
  const cloned = cloneDeep(condition);
  cloned.nonce = 0;
  cloned.fee = 0;
  if (isSingleSig(cloned)) {
    cloned.signature = emptyMessageSignature();
  } else {
    cloned.fields = [];
  }
  return {
    ...cloned,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function serializeSingleSigSpendingConditionBytes(condition) {
  const bytesArray = [
    condition.hashMode,
    hexToBytes3(condition.signer),
    intToBytes(condition.nonce, 8),
    intToBytes(condition.fee, 8),
    condition.keyEncoding,
    serializeMessageSignatureBytes(condition.signature)
  ];
  return concatArray(bytesArray);
}
function serializeMultiSigSpendingConditionBytes(condition) {
  const bytesArray = [
    condition.hashMode,
    hexToBytes3(condition.signer),
    intToBytes(condition.nonce, 8),
    intToBytes(condition.fee, 8)
  ];
  const fields = createLPList(condition.fields);
  bytesArray.push(serializeLPListBytes(fields));
  const numSigs = new Uint8Array(2);
  writeUInt16BE(numSigs, condition.signaturesRequired, 0);
  bytesArray.push(numSigs);
  return concatArray(bytesArray);
}
function deserializeSingleSigSpendingCondition(hashMode, bytesReader) {
  const signer = bytesToHex3(bytesReader.readBytes(20));
  const nonce = BigInt(`0x${bytesToHex3(bytesReader.readBytes(8))}`);
  const fee = BigInt(`0x${bytesToHex3(bytesReader.readBytes(8))}`);
  const keyEncoding = bytesReader.readUInt8Enum(PubKeyEncoding, (n) => {
    throw new DeserializationError(`Could not parse ${n} as PubKeyEncoding`);
  });
  if (hashMode === AddressHashMode.P2WPKH && keyEncoding != PubKeyEncoding.Compressed) {
    throw new DeserializationError("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  }
  const signature = deserializeMessageSignature(bytesReader);
  return {
    hashMode,
    signer,
    nonce,
    fee,
    keyEncoding,
    signature
  };
}
function deserializeMultiSigSpendingCondition(hashMode, bytesReader) {
  const signer = bytesToHex3(bytesReader.readBytes(20));
  const nonce = BigInt("0x" + bytesToHex3(bytesReader.readBytes(8)));
  const fee = BigInt("0x" + bytesToHex3(bytesReader.readBytes(8)));
  const fields = deserializeLPList(bytesReader, StacksWireType.TransactionAuthField).values;
  let haveUncompressed = false;
  let numSigs = 0;
  for (const field of fields) {
    switch (field.contents.type) {
      case StacksWireType.PublicKey:
        if (!publicKeyIsCompressed(field.contents.data))
          haveUncompressed = true;
        break;
      case StacksWireType.MessageSignature:
        if (field.pubKeyEncoding === PubKeyEncoding.Uncompressed)
          haveUncompressed = true;
        numSigs += 1;
        if (numSigs === 65536)
          throw new VerificationError("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  }
  const signaturesRequired = bytesReader.readUInt16BE();
  if (haveUncompressed && (hashMode === AddressHashMode.P2WSH || hashMode === AddressHashMode.P2WSHNonSequential)) {
    throw new VerificationError("Uncompressed keys are not allowed in this hash mode");
  }
  return {
    hashMode,
    signer,
    nonce,
    fee,
    fields,
    signaturesRequired
  };
}
function serializeSpendingConditionBytes(condition) {
  if (isSingleSig(condition))
    return serializeSingleSigSpendingConditionBytes(condition);
  return serializeMultiSigSpendingConditionBytes(condition);
}
function deserializeSpendingCondition(bytesReader) {
  const hashMode = bytesReader.readUInt8Enum(AddressHashMode, (n) => {
    throw new DeserializationError(`Could not parse ${n} as AddressHashMode`);
  });
  if (hashMode === AddressHashMode.P2PKH || hashMode === AddressHashMode.P2WPKH) {
    return deserializeSingleSigSpendingCondition(hashMode, bytesReader);
  } else {
    return deserializeMultiSigSpendingCondition(hashMode, bytesReader);
  }
}
function sigHashPreSign(curSigHash, authType, fee, nonce) {
  const hashLength = 32 + 1 + 8 + 8;
  const sigHash = curSigHash + bytesToHex3(new Uint8Array([authType])) + bytesToHex3(intToBytes(fee, 8)) + bytesToHex3(intToBytes(nonce, 8));
  if (hexToBytes3(sigHash).byteLength !== hashLength) {
    throw Error("Invalid signature hash length");
  }
  return txidFromData(hexToBytes3(sigHash));
}
function sigHashPostSign(curSigHash, pubKey, signature) {
  const hashLength = 32 + 1 + RECOVERABLE_ECDSA_SIG_LENGTH_BYTES;
  const pubKeyEncoding = publicKeyIsCompressed(pubKey.data) ? PubKeyEncoding.Compressed : PubKeyEncoding.Uncompressed;
  const sigHash = curSigHash + leftPadHex(pubKeyEncoding.toString(16)) + signature;
  const sigHashBytes = hexToBytes3(sigHash);
  if (sigHashBytes.byteLength > hashLength) {
    throw Error("Invalid signature hash length");
  }
  return txidFromData(sigHashBytes);
}
function nextSignature(curSigHash, authType, fee, nonce, privateKey) {
  const sigHashPre = sigHashPreSign(curSigHash, authType, fee, nonce);
  const signature = signWithKey(privateKey, sigHashPre);
  const publicKey2 = createStacksPublicKey(privateKeyToPublic(privateKey));
  const nextSigHash = sigHashPostSign(sigHashPre, publicKey2, signature);
  return {
    nextSig: signature,
    nextSigHash
  };
}
function nextVerification(initialSigHash, authType, fee, nonce, pubKeyEncoding, signature) {
  const sigHashPre = sigHashPreSign(initialSigHash, authType, fee, nonce);
  const publicKey2 = createStacksPublicKey(publicKeyFromSignatureVrs(sigHashPre, signature, pubKeyEncoding));
  const nextSigHash = sigHashPostSign(sigHashPre, publicKey2, signature);
  return {
    pubKey: publicKey2,
    nextSigHash
  };
}
function newInitialSigHash() {
  const spendingCondition = createSingleSigSpendingCondition(AddressHashMode.P2PKH, "", 0, 0);
  spendingCondition.signer = createEmptyAddress().hash160;
  spendingCondition.keyEncoding = PubKeyEncoding.Compressed;
  spendingCondition.signature = emptyMessageSignature();
  return spendingCondition;
}
function verify2(condition, initialSigHash, authType) {
  if (isSingleSig(condition)) {
    return verifySingleSig(condition, initialSigHash, authType);
  } else {
    return verifyMultiSig(condition, initialSigHash, authType);
  }
}
function verifySingleSig(condition, initialSigHash, authType) {
  const { pubKey, nextSigHash } = nextVerification(initialSigHash, authType, condition.fee, condition.nonce, condition.keyEncoding, condition.signature.data);
  const addrBytes = addressFromPublicKeys(0, condition.hashMode, 1, [pubKey]).hash160;
  if (addrBytes !== condition.signer)
    throw new VerificationError(`Signer hash does not equal hash of public key(s): ${addrBytes} != ${condition.signer}`);
  return nextSigHash;
}
function verifyMultiSig(condition, initialSigHash, authType) {
  const publicKeys = [];
  let curSigHash = initialSigHash;
  let haveUncompressed = false;
  let numSigs = 0;
  for (const field of condition.fields) {
    switch (field.contents.type) {
      case StacksWireType.PublicKey:
        if (!publicKeyIsCompressed(field.contents.data))
          haveUncompressed = true;
        publicKeys.push(field.contents);
        break;
      case StacksWireType.MessageSignature:
        if (field.pubKeyEncoding === PubKeyEncoding.Uncompressed)
          haveUncompressed = true;
        const { pubKey, nextSigHash } = nextVerification(curSigHash, authType, condition.fee, condition.nonce, field.pubKeyEncoding, field.contents.data);
        if (isSequentialMultiSig(condition.hashMode)) {
          curSigHash = nextSigHash;
        }
        publicKeys.push(pubKey);
        numSigs += 1;
        if (numSigs === 65536)
          throw new VerificationError("Too many signatures");
        break;
    }
  }
  if (isSequentialMultiSig(condition.hashMode) && numSigs !== condition.signaturesRequired || isNonSequentialMultiSig(condition.hashMode) && numSigs < condition.signaturesRequired)
    throw new VerificationError("Incorrect number of signatures");
  if (haveUncompressed && (condition.hashMode === AddressHashMode.P2WSH || condition.hashMode === AddressHashMode.P2WSHNonSequential))
    throw new VerificationError("Uncompressed keys are not allowed in this hash mode");
  const addrBytes = addressFromPublicKeys(0, condition.hashMode, condition.signaturesRequired, publicKeys).hash160;
  if (addrBytes !== condition.signer)
    throw new VerificationError(`Signer hash does not equal hash of public key(s): ${addrBytes} != ${condition.signer}`);
  return curSigHash;
}
function createStandardAuth(spendingCondition) {
  return {
    authType: AuthType.Standard,
    spendingCondition
  };
}
function createSponsoredAuth(spendingCondition, sponsorSpendingCondition) {
  return {
    authType: AuthType.Sponsored,
    spendingCondition,
    sponsorSpendingCondition: sponsorSpendingCondition ? sponsorSpendingCondition : createSingleSigSpendingCondition(AddressHashMode.P2PKH, "0".repeat(66), 0, 0)
  };
}
function intoInitialSighashAuth(auth) {
  if (auth.spendingCondition) {
    switch (auth.authType) {
      case AuthType.Standard:
        return createStandardAuth(clearCondition(auth.spendingCondition));
      case AuthType.Sponsored:
        return createSponsoredAuth(clearCondition(auth.spendingCondition), newInitialSigHash());
      default:
        throw new SigningError("Unexpected authorization type for signing");
    }
  }
  throw new Error("Authorization missing SpendingCondition");
}
function verifyOrigin(auth, initialSigHash) {
  switch (auth.authType) {
    case AuthType.Standard:
      return verify2(auth.spendingCondition, initialSigHash, AuthType.Standard);
    case AuthType.Sponsored:
      return verify2(auth.spendingCondition, initialSigHash, AuthType.Standard);
    default:
      throw new SigningError("Invalid origin auth type");
  }
}
function setFee(auth, amount) {
  switch (auth.authType) {
    case AuthType.Standard:
      const spendingCondition = {
        ...auth.spendingCondition,
        fee: intToBigInt(amount)
      };
      return { ...auth, spendingCondition };
    case AuthType.Sponsored:
      const sponsorSpendingCondition = {
        ...auth.sponsorSpendingCondition,
        fee: intToBigInt(amount)
      };
      return { ...auth, sponsorSpendingCondition };
  }
}
function setNonce(auth, nonce) {
  const spendingCondition = {
    ...auth.spendingCondition,
    nonce: intToBigInt(nonce)
  };
  return {
    ...auth,
    spendingCondition
  };
}
function setSponsorNonce(auth, nonce) {
  const sponsorSpendingCondition = {
    ...auth.sponsorSpendingCondition,
    nonce: intToBigInt(nonce)
  };
  return {
    ...auth,
    sponsorSpendingCondition
  };
}
function setSponsor(auth, sponsorSpendingCondition) {
  const sc = {
    ...sponsorSpendingCondition,
    nonce: intToBigInt(sponsorSpendingCondition.nonce),
    fee: intToBigInt(sponsorSpendingCondition.fee)
  };
  return {
    ...auth,
    sponsorSpendingCondition: sc
  };
}
function serializeAuthorizationBytes(auth) {
  const bytesArray = [];
  bytesArray.push(auth.authType);
  switch (auth.authType) {
    case AuthType.Standard:
      bytesArray.push(serializeSpendingConditionBytes(auth.spendingCondition));
      break;
    case AuthType.Sponsored:
      bytesArray.push(serializeSpendingConditionBytes(auth.spendingCondition));
      bytesArray.push(serializeSpendingConditionBytes(auth.sponsorSpendingCondition));
      break;
  }
  return concatArray(bytesArray);
}
function deserializeAuthorization(bytesReader) {
  const authType = bytesReader.readUInt8Enum(AuthType, (n) => {
    throw new DeserializationError(`Could not parse ${n} as AuthType`);
  });
  let spendingCondition;
  switch (authType) {
    case AuthType.Standard:
      spendingCondition = deserializeSpendingCondition(bytesReader);
      return createStandardAuth(spendingCondition);
    case AuthType.Sponsored:
      spendingCondition = deserializeSpendingCondition(bytesReader);
      const sponsorSpendingCondition = deserializeSpendingCondition(bytesReader);
      return createSponsoredAuth(spendingCondition, sponsorSpendingCondition);
  }
}

// upstream/node_modules/@stacks/transactions/dist/esm/builders.js
var import_c32check5 = __toESM(require_lib());

// upstream/node_modules/@stacks/transactions/dist/esm/contract-abi.js
var ClarityAbiTypeId;
(function(ClarityAbiTypeId2) {
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeUInt128"] = 1] = "ClarityAbiTypeUInt128";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeInt128"] = 2] = "ClarityAbiTypeInt128";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeBool"] = 3] = "ClarityAbiTypeBool";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypePrincipal"] = 4] = "ClarityAbiTypePrincipal";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeNone"] = 5] = "ClarityAbiTypeNone";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeBuffer"] = 6] = "ClarityAbiTypeBuffer";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeResponse"] = 7] = "ClarityAbiTypeResponse";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeOptional"] = 8] = "ClarityAbiTypeOptional";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeTuple"] = 9] = "ClarityAbiTypeTuple";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeList"] = 10] = "ClarityAbiTypeList";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeStringAscii"] = 11] = "ClarityAbiTypeStringAscii";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeStringUtf8"] = 12] = "ClarityAbiTypeStringUtf8";
  ClarityAbiTypeId2[ClarityAbiTypeId2["ClarityAbiTypeTraitReference"] = 13] = "ClarityAbiTypeTraitReference";
})(ClarityAbiTypeId || (ClarityAbiTypeId = {}));
var isClarityAbiPrimitive = (val) => typeof val === "string";
var isClarityAbiBuffer = (val) => val.buffer !== void 0;
var isClarityAbiStringAscii = (val) => val["string-ascii"] !== void 0;
var isClarityAbiStringUtf8 = (val) => val["string-utf8"] !== void 0;
var isClarityAbiResponse = (val) => val.response !== void 0;
var isClarityAbiOptional = (val) => val.optional !== void 0;
var isClarityAbiTuple = (val) => val.tuple !== void 0;
var isClarityAbiList = (val) => val.list !== void 0;
function getTypeUnion(val) {
  if (isClarityAbiPrimitive(val)) {
    if (val === "uint128") {
      return { id: ClarityAbiTypeId.ClarityAbiTypeUInt128, type: val };
    } else if (val === "int128") {
      return { id: ClarityAbiTypeId.ClarityAbiTypeInt128, type: val };
    } else if (val === "bool") {
      return { id: ClarityAbiTypeId.ClarityAbiTypeBool, type: val };
    } else if (val === "principal") {
      return { id: ClarityAbiTypeId.ClarityAbiTypePrincipal, type: val };
    } else if (val === "trait_reference") {
      return { id: ClarityAbiTypeId.ClarityAbiTypeTraitReference, type: val };
    } else if (val === "none") {
      return { id: ClarityAbiTypeId.ClarityAbiTypeNone, type: val };
    } else {
      throw new Error(`Unexpected Clarity ABI type primitive: ${JSON.stringify(val)}`);
    }
  } else if (isClarityAbiBuffer(val)) {
    return { id: ClarityAbiTypeId.ClarityAbiTypeBuffer, type: val };
  } else if (isClarityAbiResponse(val)) {
    return { id: ClarityAbiTypeId.ClarityAbiTypeResponse, type: val };
  } else if (isClarityAbiOptional(val)) {
    return { id: ClarityAbiTypeId.ClarityAbiTypeOptional, type: val };
  } else if (isClarityAbiTuple(val)) {
    return { id: ClarityAbiTypeId.ClarityAbiTypeTuple, type: val };
  } else if (isClarityAbiList(val)) {
    return { id: ClarityAbiTypeId.ClarityAbiTypeList, type: val };
  } else if (isClarityAbiStringAscii(val)) {
    return { id: ClarityAbiTypeId.ClarityAbiTypeStringAscii, type: val };
  } else if (isClarityAbiStringUtf8(val)) {
    return { id: ClarityAbiTypeId.ClarityAbiTypeStringUtf8, type: val };
  } else {
    throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(val)}`);
  }
}
function getTypeString(val) {
  if (isClarityAbiPrimitive(val)) {
    if (val === "int128") {
      return "int";
    } else if (val === "uint128") {
      return "uint";
    }
    return val;
  } else if (isClarityAbiBuffer(val)) {
    return `(buff ${val.buffer.length})`;
  } else if (isClarityAbiStringAscii(val)) {
    return `(string-ascii ${val["string-ascii"].length})`;
  } else if (isClarityAbiStringUtf8(val)) {
    return `(string-utf8 ${val["string-utf8"].length})`;
  } else if (isClarityAbiResponse(val)) {
    return `(response ${getTypeString(val.response.ok)} ${getTypeString(val.response.error)})`;
  } else if (isClarityAbiOptional(val)) {
    return `(optional ${getTypeString(val.optional)})`;
  } else if (isClarityAbiTuple(val)) {
    return `(tuple ${val.tuple.map((t) => `(${t.name} ${getTypeString(t.type)})`).join(" ")})`;
  } else if (isClarityAbiList(val)) {
    return `(list ${val.list.length} ${getTypeString(val.list.type)})`;
  } else {
    throw new Error(`Type string unsupported for Clarity type: ${JSON.stringify(val)}`);
  }
}
function matchType(cv, abiType) {
  const union = getTypeUnion(abiType);
  switch (cv.type) {
    case ClarityType.BoolTrue:
    case ClarityType.BoolFalse:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeBool;
    case ClarityType.Int:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeInt128;
    case ClarityType.UInt:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeUInt128;
    case ClarityType.Buffer:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeBuffer && union.type.buffer.length >= Math.ceil(cv.value.length / 2);
    case ClarityType.StringASCII:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeStringAscii && union.type["string-ascii"].length >= cv.value.length;
    case ClarityType.StringUTF8:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeStringUtf8 && union.type["string-utf8"].length >= cv.value.length;
    case ClarityType.OptionalNone:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeNone || union.id === ClarityAbiTypeId.ClarityAbiTypeOptional;
    case ClarityType.OptionalSome:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeOptional && matchType(cv.value, union.type.optional);
    case ClarityType.ResponseErr:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeResponse && matchType(cv.value, union.type.response.error);
    case ClarityType.ResponseOk:
      return union.id === ClarityAbiTypeId.ClarityAbiTypeResponse && matchType(cv.value, union.type.response.ok);
    case ClarityType.PrincipalContract:
      return union.id === ClarityAbiTypeId.ClarityAbiTypePrincipal || union.id === ClarityAbiTypeId.ClarityAbiTypeTraitReference;
    case ClarityType.PrincipalStandard:
      return union.id === ClarityAbiTypeId.ClarityAbiTypePrincipal;
    case ClarityType.List:
      return union.id == ClarityAbiTypeId.ClarityAbiTypeList && union.type.list.length >= cv.value.length && cv.value.every((val) => matchType(val, union.type.list.type));
    case ClarityType.Tuple:
      if (union.id == ClarityAbiTypeId.ClarityAbiTypeTuple) {
        const tuple2 = cloneDeep(cv.value);
        for (let i = 0; i < union.type.tuple.length; i++) {
          const abiTupleEntry = union.type.tuple[i];
          const key = abiTupleEntry.name;
          const val = tuple2[key];
          if (val) {
            if (!matchType(val, abiTupleEntry.type)) {
              return false;
            }
            delete tuple2[key];
          } else {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
}
function validateContractCall(payload, abi) {
  const filtered = abi.functions.filter((fn) => fn.name === payload.functionName.content);
  if (filtered.length === 1) {
    const abiFunc = filtered[0];
    const abiArgs = abiFunc.args;
    if (payload.functionArgs.length !== abiArgs.length) {
      throw new Error(`Clarity function expects ${abiArgs.length} argument(s) but received ${payload.functionArgs.length}`);
    }
    for (let i = 0; i < payload.functionArgs.length; i++) {
      const payloadArg = payload.functionArgs[i];
      const abiArg = abiArgs[i];
      if (!matchType(payloadArg, abiArg.type)) {
        const argNum = i + 1;
        throw new Error(`Clarity function \`${payload.functionName.content}\` expects argument ${argNum} to be of type ${getTypeString(abiArg.type)}, not ${getCVTypeString(payloadArg)}`);
      }
    }
    return true;
  } else if (filtered.length === 0) {
    throw new Error(`ABI doesn't contain a function with the name ${payload.functionName.content}`);
  } else {
    throw new Error(`Malformed ABI. Contains multiple functions with the name ${payload.functionName.content}`);
  }
}

// upstream/node_modules/@stacks/transactions/dist/esm/transaction.js
var StacksTransactionWire = class {
  constructor({ auth, payload, postConditions = createLPList([]), postConditionMode = PostConditionMode.Deny, transactionVersion, chainId, network = "mainnet" }) {
    network = networkFrom(network);
    this.transactionVersion = transactionVersion ?? network.transactionVersion;
    this.chainId = chainId ?? network.chainId;
    this.auth = auth;
    if ("amount" in payload) {
      this.payload = {
        ...payload,
        amount: intToBigInt(payload.amount)
      };
    } else {
      this.payload = payload;
    }
    this.postConditionMode = postConditionMode;
    this.postConditions = postConditions;
    this.anchorMode = AnchorMode.Any;
  }
  signBegin() {
    const tx = cloneDeep(this);
    tx.auth = intoInitialSighashAuth(tx.auth);
    return tx.txid();
  }
  verifyBegin() {
    const tx = cloneDeep(this);
    tx.auth = intoInitialSighashAuth(tx.auth);
    return tx.txid();
  }
  verifyOrigin() {
    return verifyOrigin(this.auth, this.verifyBegin());
  }
  signNextOrigin(sigHash, privateKey) {
    if (this.auth.spendingCondition === void 0) {
      throw new Error('"auth.spendingCondition" is undefined');
    }
    if (this.auth.authType === void 0) {
      throw new Error('"auth.authType" is undefined');
    }
    return this.signAndAppend(this.auth.spendingCondition, sigHash, AuthType.Standard, privateKey);
  }
  signNextSponsor(sigHash, privateKey) {
    if (this.auth.authType === AuthType.Sponsored) {
      return this.signAndAppend(this.auth.sponsorSpendingCondition, sigHash, AuthType.Sponsored, privateKey);
    } else {
      throw new Error('"auth.sponsorSpendingCondition" is undefined');
    }
  }
  appendPubkey(publicKey2) {
    const wire = typeof publicKey2 === "object" && "type" in publicKey2 ? publicKey2 : createStacksPublicKey(publicKey2);
    const cond = this.auth.spendingCondition;
    if (cond && !isSingleSig(cond)) {
      const compressed = publicKeyIsCompressed(wire.data);
      cond.fields.push(createTransactionAuthField(compressed ? PubKeyEncoding.Compressed : PubKeyEncoding.Uncompressed, wire));
    } else {
      throw new Error(`Can't append public key to a singlesig condition`);
    }
  }
  signAndAppend(condition, curSigHash, authType, privateKey) {
    const { nextSig, nextSigHash } = nextSignature(curSigHash, authType, condition.fee, condition.nonce, privateKey);
    if (isSingleSig(condition)) {
      condition.signature = createMessageSignature(nextSig);
    } else {
      const compressed = privateKeyIsCompressed(privateKey);
      condition.fields.push(createTransactionAuthField(compressed ? PubKeyEncoding.Compressed : PubKeyEncoding.Uncompressed, createMessageSignature(nextSig)));
    }
    return nextSigHash;
  }
  txid() {
    const serialized = this.serializeBytes();
    return txidFromData(serialized);
  }
  setSponsor(sponsorSpendingCondition) {
    if (this.auth.authType != AuthType.Sponsored) {
      throw new SigningError("Cannot sponsor sign a non-sponsored transaction");
    }
    this.auth = setSponsor(this.auth, sponsorSpendingCondition);
  }
  setFee(amount) {
    this.auth = setFee(this.auth, amount);
  }
  setNonce(nonce) {
    this.auth = setNonce(this.auth, nonce);
  }
  setSponsorNonce(nonce) {
    if (this.auth.authType != AuthType.Sponsored) {
      throw new SigningError("Cannot sponsor sign a non-sponsored transaction");
    }
    this.auth = setSponsorNonce(this.auth, nonce);
  }
  serialize() {
    return bytesToHex3(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0) {
      throw new SerializationError('"transactionVersion" is undefined');
    }
    if (this.chainId === void 0) {
      throw new SerializationError('"chainId" is undefined');
    }
    if (this.auth === void 0) {
      throw new SerializationError('"auth" is undefined');
    }
    if (this.payload === void 0) {
      throw new SerializationError('"payload" is undefined');
    }
    const bytesArray = [];
    bytesArray.push(this.transactionVersion);
    const chainIdBytes = new Uint8Array(4);
    writeUInt32BE(chainIdBytes, this.chainId, 0);
    bytesArray.push(chainIdBytes);
    bytesArray.push(serializeAuthorizationBytes(this.auth));
    bytesArray.push(this.anchorMode);
    bytesArray.push(this.postConditionMode);
    bytesArray.push(serializeLPListBytes(this.postConditions));
    bytesArray.push(serializePayloadBytes(this.payload));
    return concatArray(bytesArray);
  }
};
function deserializeTransaction(tx) {
  const bytesReader = isInstance(tx, BytesReader) ? tx : new BytesReader(tx);
  const transactionVersion = bytesReader.readUInt8Enum(TransactionVersion, (n) => {
    throw new Error(`Could not parse ${n} as TransactionVersion`);
  });
  const chainId = bytesReader.readUInt32BE();
  const auth = deserializeAuthorization(bytesReader);
  const anchorMode = bytesReader.readUInt8Enum(AnchorMode, (n) => {
    throw new Error(`Could not parse ${n} as AnchorMode`);
  });
  const postConditionMode = bytesReader.readUInt8Enum(PostConditionMode, (n) => {
    throw new Error(`Could not parse ${n} as PostConditionMode`);
  });
  const postConditions = deserializeLPList(bytesReader, StacksWireType.PostCondition);
  const payload = deserializePayload(bytesReader);
  const transaction = new StacksTransactionWire({
    transactionVersion,
    chainId,
    auth,
    payload,
    postConditions,
    postConditionMode
  });
  transaction.anchorMode = anchorMode;
  return transaction;
}
function deriveNetworkFromTx(transaction) {
  return whenTransactionVersion(transaction.transactionVersion)({
    [TransactionVersion.Mainnet]: STACKS_MAINNET,
    [TransactionVersion.Testnet]: STACKS_TESTNET
  });
}
function estimateTransactionByteLength(transaction) {
  const hashMode = transaction.auth.spendingCondition.hashMode;
  const multiSigHashModes = [AddressHashMode.P2SH, AddressHashMode.P2WSH];
  if (multiSigHashModes.includes(hashMode)) {
    const multiSigSpendingCondition = transaction.auth.spendingCondition;
    const existingSignatures = multiSigSpendingCondition.fields.filter((field) => field.contents.type === StacksWireType.MessageSignature).length;
    const totalSignatureLength = (multiSigSpendingCondition.signaturesRequired - existingSignatures) * (RECOVERABLE_ECDSA_SIG_LENGTH_BYTES + 1);
    return transaction.serializeBytes().byteLength + totalSignatureLength;
  } else {
    return transaction.serializeBytes().byteLength;
  }
}

// upstream/node_modules/@stacks/transactions/dist/esm/fetch.js
var TRANSFER_FEE_ESTIMATE_PATH = "/v2/fees/transfer";
var TRANSACTION_FEE_ESTIMATE_PATH = "/v2/fees/transaction";
var ACCOUNT_PATH = "/v2/accounts";
var CONTRACT_ABI_PATH = "/v2/contracts/interface";
async function _getNonceApi({ address: address3, network = "mainnet", client: _client }) {
  const client = Object.assign({}, clientFromNetwork(networkFrom(network)), _client);
  const url = `${client.baseUrl}/extended/v1/address/${address3}/nonces`;
  const response = await client.fetch(url);
  const result = await response.json();
  return BigInt(result.possible_next_nonce);
}
async function fetchNonce(opts) {
  try {
    return await _getNonceApi(opts);
  } catch (e) {
  }
  const network = networkFrom(opts.network ?? "mainnet");
  const client = Object.assign({}, clientFromNetwork(network), opts.client);
  const url = `${client.baseUrl}${ACCOUNT_PATH}/${opts.address}?proof=0`;
  const response = await client.fetch(url);
  if (!response.ok) {
    const msg = await response.text().catch(() => "");
    throw new Error(`Error fetching nonce. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`);
  }
  const json = await response.json();
  return BigInt(json.nonce);
}
async function fetchFeeEstimateTransfer({ transaction: txOpt, network: _network, client: _client }) {
  const network = typeof txOpt === "number" ? "mainnet" : _network ?? deriveNetworkFromTx(txOpt);
  const client = Object.assign({}, clientFromNetwork(networkFrom(network)), _client);
  const url = `${client.baseUrl}${TRANSFER_FEE_ESTIMATE_PATH}`;
  const response = await client.fetch(url, {
    headers: { Accept: "application/text" }
  });
  if (!response.ok) {
    const msg = await response.text().catch(() => "");
    throw new Error(`Error estimating transfer fee. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`);
  }
  const feeRateResult = await response.text();
  const txBytes = typeof txOpt === "number" ? BigInt(txOpt) : BigInt(Math.ceil(txOpt.serializeBytes().byteLength));
  const feeRate = BigInt(feeRateResult);
  return feeRate * txBytes;
}
async function fetchFeeEstimateTransaction({ payload, estimatedLength, network = "mainnet", client: _client }) {
  const json = {
    transaction_payload: payload,
    estimated_len: estimatedLength
  };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json)
  };
  const client = Object.assign({}, clientFromNetwork(networkFrom(network)), _client);
  const url = `${client.baseUrl}${TRANSACTION_FEE_ESTIMATE_PATH}`;
  const response = await client.fetch(url, options);
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    if (body.includes("NoEstimateAvailable")) {
      let json2 = {};
      try {
        json2 = JSON.parse(body);
      } catch (err) {
      }
      throw new NoEstimateAvailableError(json2?.reason_data?.message ?? "");
    }
    throw new Error(`Error estimating transaction fee. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${body}"`);
  }
  const data = await response.json();
  return data.estimations;
}
async function fetchFeeEstimate({ transaction: txOpt, network: _network, client: _client }) {
  const network = _network ?? deriveNetworkFromTx(txOpt);
  const client = Object.assign({}, clientFromNetwork(networkFrom(network)), _client);
  try {
    const estimatedLength = estimateTransactionByteLength(txOpt);
    return (await fetchFeeEstimateTransaction({
      payload: bytesToHex3(serializePayloadBytes(txOpt.payload)),
      estimatedLength,
      network,
      client
    }))[1].fee;
  } catch (error2) {
    if (!(error2 instanceof NoEstimateAvailableError))
      throw error2;
    return await fetchFeeEstimateTransfer({ transaction: txOpt, network });
  }
}
async function fetchAbi({ contractAddress: address3, contractName: name, network = "mainnet", client: _client }) {
  const client = Object.assign({}, clientFromNetwork(networkFrom(network)), _client);
  const url = `${client.baseUrl}${CONTRACT_ABI_PATH}/${address3}/${name}`;
  const response = await client.fetch(url);
  if (!response.ok) {
    const msg = await response.text().catch(() => "");
    throw new Error(`Error fetching contract ABI for contract "${name}" at address ${address3}. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`);
  }
  return JSON.parse(await response.text());
}

// upstream/node_modules/@stacks/transactions/dist/esm/postcondition.js
var MAX_U64 = BigInt("18446744073709551615");
function parsePostConditionAmount(amount) {
  const value = intToBigInt(amount);
  if (value < 0n || value > MAX_U64) {
    throw new RangeError(`Post-condition amount must be between 0 and ${MAX_U64} (u64 max), received: ${value}`);
  }
  return value;
}
var PostConditionCodeWireType;
(function(PostConditionCodeWireType2) {
  PostConditionCodeWireType2[PostConditionCodeWireType2["eq"] = 1] = "eq";
  PostConditionCodeWireType2[PostConditionCodeWireType2["gt"] = 2] = "gt";
  PostConditionCodeWireType2[PostConditionCodeWireType2["lt"] = 4] = "lt";
  PostConditionCodeWireType2[PostConditionCodeWireType2["gte"] = 3] = "gte";
  PostConditionCodeWireType2[PostConditionCodeWireType2["lte"] = 5] = "lte";
  PostConditionCodeWireType2[PostConditionCodeWireType2["sent"] = 16] = "sent";
  PostConditionCodeWireType2[PostConditionCodeWireType2["not-sent"] = 17] = "not-sent";
  PostConditionCodeWireType2[PostConditionCodeWireType2["maybe-sent"] = 18] = "maybe-sent";
})(PostConditionCodeWireType || (PostConditionCodeWireType = {}));
var PoxConditionCodeWireType;
(function(PoxConditionCodeWireType2) {
  PoxConditionCodeWireType2[PoxConditionCodeWireType2["will-not-perform"] = 48] = "will-not-perform";
  PoxConditionCodeWireType2[PoxConditionCodeWireType2["may-perform"] = 49] = "may-perform";
  PoxConditionCodeWireType2[PoxConditionCodeWireType2["will-perform"] = 50] = "will-perform";
})(PoxConditionCodeWireType || (PoxConditionCodeWireType = {}));
function postConditionToWire(postcondition) {
  switch (postcondition.type) {
    case "stx-postcondition":
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.STX,
        principal: postcondition.address === "origin" ? { type: StacksWireType.Principal, prefix: PostConditionPrincipalId.Origin } : parsePrincipalString(postcondition.address),
        conditionCode: conditionTypeToByte(postcondition.condition),
        amount: parsePostConditionAmount(postcondition.amount)
      };
    case "ft-postcondition":
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.Fungible,
        principal: postcondition.address === "origin" ? { type: StacksWireType.Principal, prefix: PostConditionPrincipalId.Origin } : parsePrincipalString(postcondition.address),
        conditionCode: conditionTypeToByte(postcondition.condition),
        amount: parsePostConditionAmount(postcondition.amount),
        asset: parseAssetString(postcondition.asset)
      };
    case "nft-postcondition":
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.NonFungible,
        principal: postcondition.address === "origin" ? { type: StacksWireType.Principal, prefix: PostConditionPrincipalId.Origin } : parsePrincipalString(postcondition.address),
        conditionCode: conditionTypeToByte(postcondition.condition),
        asset: parseAssetString(postcondition.asset),
        assetName: postcondition.assetId
      };
    case "staking-postcondition":
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.Staking,
        principal: postcondition.address === "origin" ? { type: StacksWireType.Principal, prefix: PostConditionPrincipalId.Origin } : parsePrincipalString(postcondition.address),
        conditionCode: conditionTypeToByte(postcondition.condition),
        amount: parsePostConditionAmount(postcondition.amount)
      };
    case "pox-postcondition":
      return {
        type: StacksWireType.PostCondition,
        conditionType: PostConditionType.PoX,
        principal: postcondition.address === "origin" ? { type: StacksWireType.Principal, prefix: PostConditionPrincipalId.Origin } : parsePrincipalString(postcondition.address),
        conditionCode: poxConditionTypeToByte(postcondition.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function conditionTypeToByte(condition) {
  return PostConditionCodeWireType[condition];
}
function poxConditionTypeToByte(condition) {
  return PoxConditionCodeWireType[condition];
}
function postConditionModeFrom(mode) {
  if (typeof mode === "number")
    return mode;
  if (mode === "allow")
    return PostConditionMode.Allow;
  if (mode === "deny")
    return PostConditionMode.Deny;
  if (mode === "originator")
    return PostConditionMode.Originator;
  throw new Error(`Invalid post condition mode: ${mode}`);
}

// upstream/node_modules/@stacks/transactions/dist/esm/signer.js
var TransactionSigner = class {
  constructor(transaction) {
    this.transaction = transaction;
    this.sigHash = transaction.signBegin();
    this.originDone = false;
    this.checkOversign = true;
    this.checkOverlap = true;
    const spendingCondition = transaction.auth.spendingCondition;
    if (spendingCondition && !isSingleSig(spendingCondition)) {
      if (spendingCondition.fields.filter((field) => field.contents.type === StacksWireType.MessageSignature).length >= spendingCondition.signaturesRequired) {
        throw new Error("SpendingCondition has more signatures than are expected");
      }
      spendingCondition.fields.forEach((field) => {
        if (field.contents.type !== StacksWireType.MessageSignature)
          return;
        const signature = field.contents;
        const nextVerify = nextVerification(this.sigHash, transaction.auth.authType, spendingCondition.fee, spendingCondition.nonce, PubKeyEncoding.Compressed, signature.data);
        if (!isNonSequentialMultiSig(spendingCondition.hashMode)) {
          this.sigHash = nextVerify.nextSigHash;
        }
      });
    }
  }
  static createSponsorSigner(transaction, spendingCondition) {
    if (transaction.auth.authType != AuthType.Sponsored) {
      throw new SigningError("Cannot add sponsor to non-sponsored transaction");
    }
    const tx = cloneDeep(transaction);
    tx.setSponsor(spendingCondition);
    const originSigHash = tx.verifyOrigin();
    const signer = new this(tx);
    signer.originDone = true;
    signer.sigHash = originSigHash;
    signer.checkOversign = true;
    signer.checkOverlap = true;
    return signer;
  }
  signOrigin(privateKey) {
    if (this.checkOverlap && this.originDone) {
      throw new SigningError("Cannot sign origin after sponsor key");
    }
    if (this.transaction.auth === void 0) {
      throw new SigningError('"transaction.auth" is undefined');
    }
    if (this.transaction.auth.spendingCondition === void 0) {
      throw new SigningError('"transaction.auth.spendingCondition" is undefined');
    }
    const spendingCondition = this.transaction.auth.spendingCondition;
    if (spendingCondition.hashMode === AddressHashMode.P2SH || spendingCondition.hashMode === AddressHashMode.P2WSH) {
      if (this.checkOversign && spendingCondition.fields.filter((field) => field.contents.type === StacksWireType.MessageSignature).length >= spendingCondition.signaturesRequired) {
        throw new Error("Origin would have too many signatures");
      }
    }
    const nextSighash = this.transaction.signNextOrigin(this.sigHash, privateKey);
    if (isSingleSig(this.transaction.auth.spendingCondition) || isSequentialMultiSig(this.transaction.auth.spendingCondition.hashMode)) {
      this.sigHash = nextSighash;
    }
  }
  appendOrigin(publicKey2) {
    const wire = typeof publicKey2 === "object" && "type" in publicKey2 ? publicKey2 : createStacksPublicKey(publicKey2);
    if (this.checkOverlap && this.originDone) {
      throw Error("Cannot append public key to origin after sponsor key");
    }
    if (this.transaction.auth === void 0) {
      throw new Error('"transaction.auth" is undefined');
    }
    if (this.transaction.auth.spendingCondition === void 0) {
      throw new Error('"transaction.auth.spendingCondition" is undefined');
    }
    this.transaction.appendPubkey(wire);
  }
  signSponsor(privateKey) {
    if (this.transaction.auth === void 0) {
      throw new SigningError('"transaction.auth" is undefined');
    }
    if (this.transaction.auth.authType !== AuthType.Sponsored) {
      throw new SigningError('"transaction.auth.authType" is not AuthType.Sponsored');
    }
    const nextSighash = this.transaction.signNextSponsor(this.sigHash, privateKey);
    this.sigHash = nextSighash;
    this.originDone = true;
  }
  getTxInComplete() {
    return cloneDeep(this.transaction);
  }
  resume(transaction) {
    this.transaction = cloneDeep(transaction);
    this.sigHash = transaction.signBegin();
  }
};

// upstream/node_modules/@stacks/transactions/dist/esm/builders.js
async function makeUnsignedContractCall(txOptions) {
  const defaultOptions = {
    fee: BigInt(0),
    nonce: BigInt(0),
    network: STACKS_MAINNET,
    postConditionMode: PostConditionMode.Deny,
    sponsored: false
  };
  const options = Object.assign(defaultOptions, txOptions);
  options.network = networkFrom(options.network);
  options.client = Object.assign({}, clientFromNetwork(options.network), options.client);
  options.postConditionMode = postConditionModeFrom(options.postConditionMode);
  const payload = createContractCallPayload(options.contractAddress, options.contractName, options.functionName, options.functionArgs);
  if (options?.validateWithAbi) {
    let abi;
    if (typeof options.validateWithAbi === "boolean") {
      if (options?.network) {
        abi = await fetchAbi({ ...options });
      } else {
        throw new Error("Network option must be provided in order to validate with ABI");
      }
    } else {
      abi = options.validateWithAbi;
    }
    validateContractCall(payload, abi);
  }
  let spendingCondition = null;
  if ("publicKey" in options) {
    spendingCondition = createSingleSigSpendingCondition(AddressHashMode.P2PKH, options.publicKey, options.nonce, options.fee);
  } else {
    const hashMode = options.useNonSequentialMultiSig ? AddressHashMode.P2SHNonSequential : AddressHashMode.P2SH;
    const publicKeys = options.address ? sortPublicKeysForAddress(options.publicKeys.map(publicKeyToHex), options.numSignatures, hashMode, createAddress(options.address).hash160) : options.publicKeys.map(publicKeyToHex);
    spendingCondition = createMultiSigSpendingCondition(hashMode, options.numSignatures, publicKeys, options.nonce, options.fee);
  }
  const authorization = options.sponsored ? createSponsoredAuth(spendingCondition) : createStandardAuth(spendingCondition);
  const postConditions = (options.postConditions ?? []).map((pc) => {
    if (typeof pc === "string")
      return deserializePostConditionWire(pc);
    if (typeof pc.type === "string")
      return postConditionToWire(pc);
    return pc;
  });
  const lpPostConditions = createLPList(postConditions);
  const transaction = new StacksTransactionWire({
    transactionVersion: options.network.transactionVersion,
    chainId: options.network.chainId,
    auth: authorization,
    payload,
    postConditions: lpPostConditions,
    postConditionMode: options.postConditionMode
  });
  if (txOptions.fee === void 0 || txOptions.fee === null) {
    const fee = await fetchFeeEstimate({ transaction, ...options });
    transaction.setFee(fee);
  }
  if (txOptions.nonce === void 0 || txOptions.nonce === null) {
    const addressVersion = options.network.addressVersion.singleSig;
    const address3 = (0, import_c32check5.c32address)(addressVersion, transaction.auth.spendingCondition.signer);
    const txNonce = await fetchNonce({ address: address3, ...options });
    transaction.setNonce(txNonce);
  }
  return transaction;
}
function sortPublicKeysForAddress(publicKeys, numSigs, hashMode, hash2) {
  const hashUnsorted = addressFromPublicKeys(0, hashMode, numSigs, publicKeys.map(createStacksPublicKey)).hash160;
  if (hashUnsorted === hash2)
    return publicKeys;
  const publicKeysSorted = publicKeys.slice().sort();
  const hashSorted = addressFromPublicKeys(0, hashMode, numSigs, publicKeysSorted.map(createStacksPublicKey)).hash160;
  if (hashSorted === hash2)
    return publicKeysSorted;
  throw new Error("Failed to find matching multi-sig address given public-keys.");
}

// upstream/node_modules/@stacks/transactions/dist/esm/cl.js
var cl_exports = {};
__export(cl_exports, {
  address: () => address,
  bool: () => bool2,
  buffer: () => buffer,
  bufferFromAscii: () => bufferFromAscii,
  bufferFromHex: () => bufferFromHex,
  bufferFromUtf8: () => bufferFromUtf8,
  contractPrincipal: () => contractPrincipal,
  deserialize: () => deserialize,
  error: () => error,
  int: () => int,
  list: () => list,
  none: () => none,
  ok: () => ok,
  parse: () => parse,
  prettyPrint: () => prettyPrint,
  principal: () => principal,
  serialize: () => serialize,
  some: () => some,
  standardPrincipal: () => standardPrincipal,
  stringAscii: () => stringAscii,
  stringUtf8: () => stringUtf8,
  stringify: () => stringify,
  tuple: () => tuple,
  uint: () => uint
});

// upstream/node_modules/@stacks/transactions/dist/esm/clarity/prettyPrint.js
function escape(value) {
  return JSON.stringify(value).slice(1, -1);
}
function formatSpace(space, depth, end = false) {
  if (!space)
    return " ";
  return `
${" ".repeat(space * (depth - (end ? 1 : 0)))}`;
}
function formatList(cv, space, depth = 1) {
  if (cv.value.length === 0)
    return "(list)";
  const spaceBefore = formatSpace(space, depth, false);
  const endSpace = space ? formatSpace(space, depth, true) : "";
  const items = cv.value.map((v) => prettyPrintWithDepth(v, space, depth)).join(spaceBefore);
  return `(list${spaceBefore}${items}${endSpace})`;
}
function formatTuple(cv, space, depth = 1) {
  if (Object.keys(cv.value).length === 0)
    return "{}";
  const items = [];
  for (const [key, value] of Object.entries(cv.value)) {
    items.push(`${key}: ${prettyPrintWithDepth(value, space, depth)}`);
  }
  const spaceBefore = formatSpace(space, depth, false);
  const endSpace = formatSpace(space, depth, true);
  return `{${spaceBefore}${items.sort().join(`,${spaceBefore}`)}${endSpace}}`;
}
function exhaustiveCheck(param) {
  throw new Error(`invalid clarity value type: ${param}`);
}
function prettyPrintWithDepth(cv, space = 0, depth) {
  if (cv.type === ClarityType.BoolFalse)
    return "false";
  if (cv.type === ClarityType.BoolTrue)
    return "true";
  if (cv.type === ClarityType.Int)
    return cv.value.toString();
  if (cv.type === ClarityType.UInt)
    return `u${cv.value.toString()}`;
  if (cv.type === ClarityType.StringASCII)
    return `"${escape(cv.value)}"`;
  if (cv.type === ClarityType.StringUTF8)
    return `u"${escape(cv.value)}"`;
  if (cv.type === ClarityType.PrincipalContract)
    return `'${cv.value}`;
  if (cv.type === ClarityType.PrincipalStandard)
    return `'${cv.value}`;
  if (cv.type === ClarityType.Buffer)
    return `0x${cv.value}`;
  if (cv.type === ClarityType.OptionalNone)
    return "none";
  if (cv.type === ClarityType.OptionalSome)
    return `(some ${prettyPrintWithDepth(cv.value, space, depth)})`;
  if (cv.type === ClarityType.ResponseOk)
    return `(ok ${prettyPrintWithDepth(cv.value, space, depth)})`;
  if (cv.type === ClarityType.ResponseErr)
    return `(err ${prettyPrintWithDepth(cv.value, space, depth)})`;
  if (cv.type === ClarityType.List) {
    return formatList(cv, space, depth + 1);
  }
  if (cv.type === ClarityType.Tuple) {
    return formatTuple(cv, space, depth + 1);
  }
  exhaustiveCheck(cv);
}
function stringify(cv, space = 0) {
  return prettyPrintWithDepth(cv, space, 0);
}
var prettyPrint = stringify;

// upstream/node_modules/@stacks/transactions/dist/esm/cl.js
var bool2 = boolCV;
var int = intCV;
var uint = uintCV;
function principal(address3) {
  const [addr, name] = address3.split(".");
  return name ? contractPrincipalCV(addr, name) : standardPrincipalCV(addr);
}
var address = principal;
var contractPrincipal = contractPrincipalCV;
var standardPrincipal = standardPrincipalCV;
var list = listCV;
var stringAscii = stringAsciiCV;
var stringUtf8 = stringUtf8CV;
var buffer = bufferCV;
var bufferFromHex = (hex4) => bufferCV(hexToBytes3(hex4));
var bufferFromAscii = (ascii) => bufferCV(asciiToBytes2(ascii));
var bufferFromUtf8 = (utf82) => bufferCV(utf8ToBytes2(utf82));
var none = noneCV;
var some = someCV;
var ok = responseOkCV;
var error = responseErrorCV;
var tuple = tupleCV;
var serialize = serializeCV;
var deserialize = deserializeCV;

// upstream/src/derivation/paths.ts
function bitcoinCoinType(network) {
  return network === "mainnet" ? 0 : 1;
}
var STACKS_PATH = "m/44'/5757'/0'/0/0";
function bitcoinNativeSegwitPath(accountIndex = 0, network = "mainnet") {
  return `m/84'/${bitcoinCoinType(network)}'/${accountIndex}'/0/0`;
}

// upstream/src/derivation/stacks.ts
function deriveStacksAccount(root, network = "mainnet") {
  const node = root.derive(STACKS_PATH);
  if (!node.privateKey) {
    throw new KeyDerivationError("Stacks derivation produced no private key");
  }
  const privateKeyHex = `${bytesToHex(node.privateKey)}01`;
  const address3 = getAddressFromPrivateKey(privateKeyHex, network);
  return { address: address3, path: STACKS_PATH };
}

// upstream/node_modules/micro-packed/index.js
var restrictedKeys = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
var validateFieldName = (name, label) => {
  if (typeof name !== "string")
    throw new Error(`${label} should be string, got ${typeof name}`);
  if (name.includes(".."))
    throw new TypeError(`${label} ${name} cannot contain path parent ..`);
  if (name.includes("/"))
    throw new TypeError(`${label} ${name} cannot contain path separator /`);
  if (restrictedKeys.has(name))
    throw new Error(`${label} ${name} is reserved`);
};
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  for (let i = 0; i < a.length; i++)
    if (a[i] !== b[i])
      return false;
  return true;
}
function createFindBytes(needle) {
  if (needle.length === 1) {
    const byte = needle[0];
    return (data, pos = 0) => {
      const idx = data.indexOf(byte, pos);
      return idx === -1 ? void 0 : idx;
    };
  }
  const back = new Uint32Array(needle.length);
  for (let i = 1, j = 0; i < needle.length; i++) {
    while (j && needle[i] !== needle[j])
      j = back[j - 1];
    if (needle[i] === needle[j])
      back[i] = ++j;
  }
  return (data, pos = 0) => {
    for (let i = pos, j = 0; i < data.length; i++) {
      while (j && data[i] !== needle[j])
        j = back[j - 1];
      if (data[i] !== needle[j])
        continue;
      if (++j === needle.length)
        return i - needle.length + 1;
    }
    return void 0;
  };
}
var findBytes = (needle, data, pos = 0) => createFindBytes(needle)(data, pos);
function isBytes4(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function concatBytes5(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    if (!isBytes4(a))
      throw new Error("Uint8Array expected");
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
var createView3 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var _0n7 = /* @__PURE__ */ BigInt(0);
var _1n6 = /* @__PURE__ */ BigInt(1);
var _2n5 = /* @__PURE__ */ BigInt(2);
var _10n = /* @__PURE__ */ BigInt(10);
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function isNum(num2) {
  return Number.isSafeInteger(num2);
}
var hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
var utils3 = /* @__PURE__ */ Object.freeze({
  equalBytes,
  isBytes: isBytes4,
  isCoder,
  checkBounds,
  concatBytes: concatBytes5,
  createView: createView3,
  isPlainObject
});
var Bitset = /* @__PURE__ */ Object.freeze({
  BITS: 32,
  FULL_MASK: -1 >>> 0,
  // 1<<32 will overflow
  len: (len) => {
    if (!isNum(len) || len < 0)
      throw new Error(`wrong len=${len}`);
    return Math.ceil(len / 32);
  },
  create: (len) => new Uint32Array(Bitset.len(len)),
  clean: (bs) => bs.fill(0),
  debug: (bs) => Array.from(bs).map((i) => (i >>> 0).toString(2).padStart(32, "0")),
  checkLen: (bs, len) => {
    if (Bitset.len(len) === bs.length)
      return;
    throw new Error(`wrong length=${bs.length}. Expected: ${Bitset.len(len)}`);
  },
  chunkLen: (bsLen, pos, len) => {
    if (!isNum(bsLen) || bsLen < 0)
      throw new Error(`wrong bsLen=${bsLen}`);
    if (!isNum(pos) || pos < 0)
      throw new Error(`wrong pos=${pos}`);
    if (!isNum(len) || len < 0)
      throw new Error(`wrong len=${len}`);
    if (pos > bsLen - len)
      throw new Error(`wrong range=${pos}/${len} of ${bsLen}`);
  },
  set: (bs, chunk, value, allowRewrite = true) => {
    if (!isNum(chunk) || chunk < 0 || chunk >= bs.length)
      return false;
    if (!allowRewrite && (bs[chunk] & value) !== 0)
      return false;
    bs[chunk] |= value;
    return true;
  },
  pos: (pos, i) => ({
    chunk: Math.floor((pos + i) / 32),
    mask: 1 << 32 - (pos + i) % 32 - 1
  }),
  indices: (bs, len, invert3 = false) => {
    Bitset.checkLen(bs, len);
    const { FULL_MASK, BITS } = Bitset;
    const left = BITS - len % BITS;
    const lastMask = left ? FULL_MASK >>> left << left : FULL_MASK;
    const res = [];
    for (let i = 0; i < bs.length; i++) {
      let c = bs[i];
      if (invert3)
        c = ~c;
      if (i === bs.length - 1)
        c &= lastMask;
      if (c === 0)
        continue;
      for (let j = 0; j < BITS; j++) {
        const m = 1 << BITS - j - 1;
        if (c & m)
          res.push(i * BITS + j);
      }
    }
    return res;
  },
  range: (arr) => {
    const res = [];
    let cur;
    for (const i of arr) {
      if (cur === void 0 || i !== cur.pos + cur.length)
        res.push(cur = { pos: i, length: 1 });
      else
        cur.length += 1;
    }
    return res;
  },
  rangeDebug: (bs, len, invert3 = false) => `[${Bitset.range(Bitset.indices(bs, len, invert3)).map((i) => `(${i.pos}/${i.length})`).join(", ")}]`,
  setRange: (bs, bsLen, pos, len, allowRewrite = true) => {
    Bitset.chunkLen(bsLen, pos, len);
    if (len === 0)
      return true;
    const { FULL_MASK, BITS } = Bitset;
    const first = pos % BITS ? Math.floor(pos / BITS) : void 0;
    const lastPos = pos + len;
    const last = lastPos % BITS ? Math.floor(lastPos / BITS) : void 0;
    const canSet = (chunk, value) => chunk >= 0 && chunk < bs.length && (bs[chunk] & value) === 0;
    if (!allowRewrite) {
      if (first !== void 0 && first === last) {
        if (!canSet(first, FULL_MASK >>> BITS - len << BITS - len - pos))
          return false;
      } else {
        if (first !== void 0 && !canSet(first, FULL_MASK >>> pos % BITS))
          return false;
        const start2 = first !== void 0 ? first + 1 : pos / BITS;
        const end2 = last !== void 0 ? last : lastPos / BITS;
        for (let i = start2; i < end2; i++)
          if (!canSet(i, FULL_MASK))
            return false;
        if (last !== void 0 && first !== last) {
          if (!canSet(last, FULL_MASK << BITS - lastPos % BITS))
            return false;
        }
      }
    }
    if (first !== void 0 && first === last)
      return Bitset.set(bs, first, FULL_MASK >>> BITS - len << BITS - len - pos, allowRewrite);
    if (first !== void 0) {
      if (!Bitset.set(bs, first, FULL_MASK >>> pos % BITS, allowRewrite))
        return false;
    }
    const start = first !== void 0 ? first + 1 : pos / BITS;
    const end = last !== void 0 ? last : lastPos / BITS;
    for (let i = start; i < end; i++)
      if (!Bitset.set(bs, i, FULL_MASK, allowRewrite))
        return false;
    if (last !== void 0 && first !== last) {
      if (!Bitset.set(bs, last, FULL_MASK << BITS - lastPos % BITS, allowRewrite))
        return false;
    }
    return true;
  }
});
var Path = /* @__PURE__ */ Object.freeze({
  /**
   * Internal method for handling stack of paths (debug, errors, dynamic fields via path)
   * This callback shape forces stack cleanup by construction:
   * `.pop()` always happens after the wrapped function.
   * Also, this makes impossible:
   * - pushing field when stack is empty
   * - pushing field inside of field (real bug)
   * NOTE: we don't want to do '.pop' on error!
   */
  pushObj: (stack, obj, objFn) => {
    const last = { obj };
    stack.push(last);
    objFn((field, fieldFn) => {
      last.field = field;
      fieldFn();
      last.field = void 0;
    });
    stack.pop();
  },
  path: (stack) => {
    const res = [];
    for (const i of stack)
      if (i.field !== void 0)
        res.push(i.field === "" ? '""' : i.field);
    return res.join("/");
  },
  err: (name, stack, msg) => {
    const text = `${name}(${Path.path(stack)}): ${typeof msg === "string" ? msg : msg.message}`;
    const err = msg instanceof TypeError ? new TypeError(text) : msg instanceof RangeError ? new RangeError(text) : new Error(text);
    if (msg instanceof Error && msg.stack) {
      const from = `${msg.name}: ${msg.message}`;
      const to = `${err.name}: ${err.message}`;
      err.stack = msg.stack.startsWith(from) ? `${to}${msg.stack.slice(from.length)}` : msg.stack;
    }
    return err;
  },
  resolve: (stack, path) => {
    const parts = path.split("/");
    const objPath = stack.map((i2) => i2.obj);
    let i = 0;
    for (; i < parts.length; i++) {
      if (parts[i] === "..")
        objPath.pop();
      else
        break;
    }
    let cur = objPath.pop();
    for (; i < parts.length; i++) {
      if (!cur || cur[parts[i]] === void 0)
        return void 0;
      cur = cur[parts[i]];
    }
    return cur;
  }
});
var _Reader = class __Reader {
  pos = 0;
  data;
  opts;
  stack;
  parent;
  parentOffset;
  bitBuf = 0;
  bitPos = 0;
  bs;
  // bitset
  view;
  constructor(data, opts = {}, stack = [], parent = void 0, parentOffset = 0) {
    this.data = data;
    this.opts = opts;
    this.stack = stack;
    this.parent = parent;
    this.parentOffset = parentOffset;
    this.view = createView3(data);
  }
  /** Internal method for pointers. */
  _enablePointers() {
    if (this.parent)
      return this.parent._enablePointers();
    if (this.bs)
      return;
    this.bs = Bitset.create(this.data.length);
    Bitset.setRange(this.bs, this.data.length, 0, this.pos, this.opts.allowMultipleReads);
  }
  markBytesBS(pos, len) {
    if (this.parent)
      return this.parent.markBytesBS(this.parentOffset + pos, len);
    if (!len)
      return true;
    if (!this.bs)
      return true;
    return Bitset.setRange(this.bs, this.data.length, pos, len, false);
  }
  markBytes(len) {
    const pos = this.pos;
    const res = this.markBytesBS(pos, len);
    if (!this.opts.allowMultipleReads && !res)
      throw this.err(`multiple read pos=${pos} len=${len}`);
    this.pos += len;
    return res;
  }
  pushObj(obj, objFn) {
    return Path.pushObj(this.stack, obj, objFn);
  }
  readView(n, fn) {
    if (!isNum(n) || n < 0)
      throw this.err(`readView: wrong length=${n}`);
    if (this.pos + n > this.data.length)
      throw this.err("readView: Unexpected end of buffer");
    const res = fn(this.view, this.pos);
    this.markBytes(n);
    return res;
  }
  // read bytes by absolute offset
  absBytes(n) {
    if (!isNum(n) || n < 0 || n > this.data.length)
      throw new Error("Unexpected end of buffer");
    return this.data.subarray(n);
  }
  finish() {
    if (this.opts.allowUnreadBytes)
      return;
    if (this.bitPos) {
      throw this.err(`${this.bitPos} bits left after unpack: ${hex.encode(this.data.subarray(this.pos))}`);
    }
    if (this.bs && !this.parent) {
      const notRead = Bitset.indices(this.bs, this.data.length, true);
      if (notRead.length) {
        const formatted = Bitset.range(notRead).map(({ pos, length }) => `(${pos}/${length})[${hex.encode(this.data.subarray(pos, pos + length))}]`).join(", ");
        throw this.err(`unread byte ranges: ${formatted} (total=${this.data.length})`);
      } else
        return;
    }
    if (!this.isEnd()) {
      throw this.err(`${this.leftBytes} bytes ${this.bitPos} bits left after unpack: ${hex.encode(this.data.subarray(this.pos))}`);
    }
  }
  // User methods
  err(msg) {
    return Path.err("Reader", this.stack, msg);
  }
  offsetReader(n) {
    if (!isNum(n) || n < 0 || n > this.data.length)
      throw this.err("offsetReader: Unexpected end of buffer");
    return new __Reader(this.absBytes(n), this.opts, this.stack, this, n);
  }
  bytes(n, peek = false) {
    if (this.bitPos)
      throw this.err("readBytes: bitPos not empty");
    if (!isNum(n) || n < 0)
      throw this.err(`readBytes: wrong length=${n}`);
    if (this.pos + n > this.data.length)
      throw this.err("readBytes: Unexpected end of buffer");
    const slice = this.data.subarray(this.pos, this.pos + n);
    if (!peek)
      this.markBytes(n);
    return slice;
  }
  byte(peek = false) {
    if (this.bitPos)
      throw this.err("readByte: bitPos not empty");
    if (this.pos + 1 > this.data.length)
      throw this.err("readByte: Unexpected end of buffer");
    const data = this.data[this.pos];
    if (!peek)
      this.markBytes(1);
    return data;
  }
  get leftBytes() {
    return this.data.length - this.pos;
  }
  get totalBytes() {
    return this.data.length;
  }
  isEnd() {
    return this.pos >= this.data.length && !this.bitPos;
  }
  progress() {
    return this.pos * 8 - this.bitPos;
  }
  // bits are read in BE mode (left to right): (0b1000_0000).readBits(1) == 1
  bits(bits) {
    if (!isNum(bits) || bits < 0)
      throw this.err(`BitReader: wrong length=${bits}`);
    if (bits > 32)
      throw this.err("BitReader: cannot read more than 32 bits in single call");
    let out = 0;
    while (bits) {
      if (!this.bitPos) {
        this.bitBuf = this.byte();
        this.bitPos = 8;
      }
      const take = Math.min(bits, this.bitPos);
      this.bitPos -= take;
      out = out << take | this.bitBuf >> this.bitPos & 2 ** take - 1;
      this.bitBuf &= 2 ** this.bitPos - 1;
      bits -= take;
    }
    return out >>> 0;
  }
  find(needle, pos = this.pos) {
    if (!isBytes4(needle))
      throw this.err(`find: needle is not bytes! ${needle}`);
    if (this.bitPos)
      throw this.err("find: bitPos not empty");
    if (!needle.length)
      throw this.err(`find: needle is empty`);
    if (!isNum(pos) || pos < 0)
      throw this.err(`find: wrong pos=${pos}`);
    return findBytes(needle, this.data, pos);
  }
};
var _Writer = class {
  pos = 0;
  stack;
  // We could have a single buffer here and re-alloc it with
  // x1.5-2 size each time it full, but it will be slower:
  // basic/encode bench: 395ns -> 560ns
  buffers = [];
  cleanBuffers = [];
  ptrs = [];
  bitBuf = 0;
  bitPos = 0;
  viewBuf = new Uint8Array(8);
  view;
  finished = false;
  constructor(stack = []) {
    this.stack = stack;
    this.view = createView3(this.viewBuf);
  }
  pushObj(obj, objFn) {
    return Path.pushObj(this.stack, obj, objFn);
  }
  writeView(len, fn) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (!isNum(len) || len < 0 || len > 8)
      throw new Error(`wrong writeView length=${len}`);
    fn(this.view);
    const buf = this.viewBuf.slice(0, len);
    this.bytes(buf);
    this.cleanBuffers.push(buf);
    this.viewBuf.fill(0);
  }
  // User methods
  err(msg) {
    return Path.err("Writer", this.stack, msg);
  }
  bytes(b) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (this.bitPos)
      throw this.err("writeBytes: ends with non-empty bit buffer");
    this.buffers.push(b);
    this.pos += b.length;
  }
  byte(b) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (this.bitPos)
      throw this.err("writeByte: ends with non-empty bit buffer");
    if (!isNum(b) || b < 0 || b > 255)
      throw this.err(`writeByte: wrong value=${b}`);
    const buf = new Uint8Array([b]);
    this.buffers.push(buf);
    this.cleanBuffers.push(buf);
    this.pos++;
  }
  finish(clean2 = true) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (this.bitPos)
      throw this.err("buffer: ends with non-empty bit buffer");
    const buffers = this.buffers.concat(this.ptrs.map((i) => i.buffer));
    const sum = buffers.map((b) => b.length).reduce((a, b) => a + b, 0);
    const buf = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < buffers.length; i++) {
      const a = buffers[i];
      buf.set(a, pad);
      pad += a.length;
    }
    for (let pos = this.pos, i = 0; i < this.ptrs.length; i++) {
      const ptr = this.ptrs[i];
      buf.set(ptr.ptr.encode(pos), ptr.pos);
      pos += ptr.buffer.length;
    }
    if (clean2) {
      for (const b of this.cleanBuffers)
        b.fill(0);
      this.buffers = [];
      this.cleanBuffers = [];
      for (const p of this.ptrs)
        p.buffer.fill(0);
      this.ptrs = [];
      this.finished = true;
      this.bitBuf = 0;
    }
    return buf;
  }
  bits(value, bits) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (!isNum(bits) || bits < 0)
      throw this.err(`writeBits: wrong length=${bits}`);
    if (bits > 32)
      throw this.err("writeBits: cannot write more than 32 bits in single call");
    if (!isNum(value) || value < 0)
      throw this.err(`writeBits: wrong value=${value}`);
    if (value >= 2 ** bits)
      throw this.err(`writeBits: value (${value}) >= 2**bits (${bits})`);
    while (bits) {
      const take = Math.min(bits, 8 - this.bitPos);
      this.bitBuf = this.bitBuf << take | value >> bits - take;
      this.bitPos += take;
      bits -= take;
      value &= 2 ** bits - 1;
      if (this.bitPos === 8) {
        this.bitPos = 0;
        const buf = new Uint8Array([this.bitBuf]);
        this.buffers.push(buf);
        this.cleanBuffers.push(buf);
        this.pos++;
      }
    }
  }
};
function checkBounds(value, bits, signed) {
  if (signed) {
    if (bits <= _0n7)
      throw new Error(`checkBounds: signed bits must be positive, got ${bits}`);
    const signBit = _2n5 ** (bits - _1n6);
    if (value < -signBit || value >= signBit)
      throw new Error(`value out of signed bounds. Expected ${-signBit} <= ${value} < ${signBit}`);
  } else {
    const max = _2n5 ** bits;
    if (_0n7 > value || value >= max)
      throw new Error(`value out of unsigned bounds. Expected 0 <= ${value} < ${max}`);
  }
}
function _wrap(inner) {
  const _inner = inner;
  return {
    // NOTE: we cannot export validate here, since it is likely mistake.
    // Raw inner throws propagate unchanged; path-aware errors must use w.err/r.err or validate().
    encodeStream: _inner.encodeStream,
    decodeStream: _inner.decodeStream,
    size: _inner.size,
    encode: (value) => {
      const w = new _Writer();
      _inner.encodeStream(w, value);
      return w.finish();
    },
    decode: (data, opts = {}) => {
      const r = new _Reader(data, opts);
      const res = _inner.decodeStream(r);
      r.finish();
      return res;
    }
  };
}
function validate(inner, fn) {
  if (!isCoder(inner))
    throw new TypeError(`validate: invalid inner value ${inner}`);
  if (typeof fn !== "function")
    throw new TypeError("validate: fn should be function");
  return _wrap({
    size: inner.size,
    encodeStream: (w, value) => {
      let res;
      try {
        res = fn(value);
      } catch (e) {
        throw w.err(e);
      }
      inner.encodeStream(w, res);
    },
    decodeStream: (r) => {
      const res = inner.decodeStream(r);
      try {
        return fn(res);
      } catch (e) {
        throw r.err(e);
      }
    }
  });
}
var wrap = (inner) => {
  const _inner = inner;
  if (!isPlainObject(_inner))
    throw new TypeError(`wrap: invalid inner value ${_inner}`);
  if (typeof _inner.encodeStream !== "function")
    throw new TypeError("wrap: encodeStream should be function");
  if (typeof _inner.decodeStream !== "function")
    throw new TypeError("wrap: decodeStream should be function");
  if (_inner.size !== void 0 && (!isNum(_inner.size) || _inner.size < 0))
    throw new TypeError(`wrap: invalid size ${_inner.size}`);
  if (_inner.validate !== void 0 && typeof _inner.validate !== "function")
    throw new TypeError("wrap: validate should be function");
  const res = _wrap(_inner);
  return _inner.validate !== void 0 ? validate(res, _inner.validate) : res;
};
var isBaseCoder = (elm) => isPlainObject(elm) && typeof elm.decode === "function" && typeof elm.encode === "function";
function isCoder(elm) {
  return isPlainObject(elm) && isBaseCoder(elm) && typeof elm.encodeStream === "function" && typeof elm.decodeStream === "function" && (elm.size === void 0 || isNum(elm.size) && elm.size >= 0);
}
function dict() {
  return {
    encode: (from) => {
      if (!Array.isArray(from))
        throw new Error("array expected");
      const to = {};
      const seen = /* @__PURE__ */ new Set();
      for (const item of from) {
        if (!Array.isArray(item) || item.length !== 2)
          throw new Error(`array of two elements expected`);
        const name = item[0];
        const value = item[1];
        validateFieldName(name, "dict: key");
        if (seen.has(name))
          throw new Error(`key(${name}) appears twice in struct`);
        seen.add(name);
        to[name] = value;
      }
      return to;
    },
    decode: (to) => {
      if (!isPlainObject(to))
        throw new Error(`expected plain object, got ${to}`);
      for (const name in to)
        validateFieldName(name, "dict: key");
      return Object.entries(to);
    }
  };
}
var numberBigint = /* @__PURE__ */ Object.freeze({
  encode: (from) => {
    if (typeof from !== "bigint")
      throw new Error(`expected bigint, got ${typeof from}`);
    if (from > BigInt(Number.MAX_SAFE_INTEGER))
      throw new Error(`element bigger than MAX_SAFE_INTEGER=${from}`);
    if (from < BigInt(Number.MIN_SAFE_INTEGER))
      throw new Error(`element smaller than MIN_SAFE_INTEGER=${from}`);
    return Number(from);
  },
  decode: (to) => {
    if (!isNum(to))
      throw new Error("element is not a safe integer");
    return BigInt(to);
  }
});
function tsEnum(e) {
  if (!isPlainObject(e))
    throw new Error("plain object expected");
  return {
    encode: (from) => {
      if (!isNum(from) || !(from in e))
        throw new Error(`wrong value ${from}`);
      return e[from];
    },
    decode: (to) => {
      if (typeof to !== "string")
        throw new Error(`wrong value ${typeof to}`);
      const value = e[to];
      if (!hasOwn(e, to) || !isNum(value))
        throw new Error(`wrong value ${to}`);
      return value;
    }
  };
}
function decimal(precision, round = false) {
  if (!isNum(precision) || precision < 0)
    throw new Error(`decimal/precision: wrong value ${precision}`);
  if (typeof round !== "boolean")
    throw new Error(`decimal/round: expected boolean, got ${typeof round}`);
  const decimalMask = _10n ** BigInt(precision);
  return {
    encode: (from) => {
      if (typeof from !== "bigint")
        throw new Error(`expected bigint, got ${typeof from}`);
      let s = (from < _0n7 ? -from : from).toString(10);
      let sep = s.length - precision;
      if (sep < 0) {
        s = s.padStart(s.length - sep, "0");
        sep = 0;
      }
      let i = s.length - 1;
      for (; i >= sep && s[i] === "0"; i--)
        ;
      let int2 = s.slice(0, sep);
      let frac = s.slice(sep, i + 1);
      if (!int2)
        int2 = "0";
      if (from < _0n7)
        int2 = "-" + int2;
      if (!frac)
        return int2;
      return `${int2}.${frac}`;
    },
    decode: (to) => {
      if (typeof to !== "string")
        throw new Error(`expected string, got ${typeof to}`);
      let neg = false;
      if (to.startsWith("-")) {
        neg = true;
        to = to.slice(1);
      }
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(to))
        throw new Error(`wrong string value=${to}`);
      let sep = to.indexOf(".");
      sep = sep === -1 ? to.length : sep;
      const intS = to.slice(0, sep);
      const fracS = to.slice(sep + 1).replace(/0+$/, "");
      const int2 = BigInt(intS) * decimalMask;
      if (!round && fracS.length > precision) {
        throw new Error(`fractional part cannot be represented with this precision (num=${to}, prec=${precision})`);
      }
      const fracLen = Math.min(fracS.length, precision);
      const frac = BigInt(fracS.slice(0, fracLen)) * _10n ** BigInt(precision - fracLen);
      const value = int2 + frac;
      if (neg && value === _0n7)
        throw new Error(`negative zero is not allowed`);
      return neg ? -value : value;
    }
  };
}
function match(lst) {
  if (!Array.isArray(lst))
    throw new Error(`expected array, got ${typeof lst}`);
  for (const i of lst)
    if (!isBaseCoder(i))
      throw new Error(`wrong base coder ${i}`);
  return {
    encode: (from) => {
      for (const c of lst) {
        let elm;
        try {
          elm = c.encode(from);
        } catch {
          continue;
        }
        if (elm !== void 0)
          return elm;
      }
      throw new Error(`match/encode: cannot find match in ${from}`);
    },
    decode: (to) => {
      for (const c of lst) {
        let elm;
        try {
          elm = c.decode(to);
        } catch {
          continue;
        }
        if (elm !== void 0)
          return elm;
      }
      throw new Error(`match/decode: cannot find match in ${to}`);
    }
  };
}
var reverse = (coder) => {
  if (!isBaseCoder(coder))
    throw new Error("BaseCoder expected");
  return { encode: (to) => coder.decode(to), decode: (from) => coder.encode(from) };
};
var coders = /* @__PURE__ */ Object.freeze({ dict, numberBigint, tsEnum, decimal, match, reverse });
var view = (len, opts) => wrap({
  size: len,
  encodeStream: (w, value) => w.writeView(len, (view2) => opts.write(view2, value)),
  decodeStream: (r) => r.readView(len, opts.read),
  validate: (value) => {
    if (typeof value !== "number")
      throw new TypeError(`viewCoder: expected number, got ${typeof value}`);
    if (opts.validate)
      opts.validate(value);
    return value;
  }
});
var intView = (len, signed, opts) => {
  const bits = len * 8;
  const signBit = 2 ** (bits - 1);
  const validateSigned = (value) => {
    if (!isNum(value))
      throw new TypeError(`sintView: value is not safe integer: ${value}`);
    if (value < -signBit || value >= signBit) {
      throw new RangeError(`sintView: value out of bounds. Expected ${-signBit} <= ${value} < ${signBit}`);
    }
  };
  const maxVal = 2 ** bits;
  const validateUnsigned = (value) => {
    if (!isNum(value))
      throw new TypeError(`uintView: value is not safe integer: ${value}`);
    if (0 > value || value >= maxVal) {
      throw new RangeError(`uintView: value out of bounds. Expected 0 <= ${value} < ${maxVal}`);
    }
  };
  return view(len, {
    write: opts.write,
    read: opts.read,
    validate: signed ? validateSigned : validateUnsigned
  });
};
var U32LE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ intView(4, false, {
    read: (view2, pos) => view2.getUint32(pos, true),
    write: (view2, value) => view2.setUint32(0, value, true)
  })
);
var U16LE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ intView(2, false, {
    read: (view2, pos) => view2.getUint16(pos, true),
    write: (view2, value) => view2.setUint16(0, value, true)
  })
);
var U8 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ intView(1, false, {
    read: (view2, pos) => view2.getUint8(pos),
    write: (view2, value) => view2.setUint8(0, value)
  })
);
function apply(inner, base) {
  if (!isCoder(inner))
    throw new TypeError(`apply: invalid inner value ${inner}`);
  if (!isBaseCoder(base))
    throw new TypeError(`apply: invalid base value ${base}`);
  return wrap({
    size: inner.size,
    encodeStream: (w, value) => {
      let innerValue;
      try {
        innerValue = base.decode(value);
      } catch (e) {
        throw w.err("" + e);
      }
      return inner.encodeStream(w, innerValue);
    },
    decodeStream: (r) => {
      const innerValue = inner.decodeStream(r);
      try {
        return base.encode(innerValue);
      } catch (e) {
        throw r.err("" + e);
      }
    }
  });
}

// upstream/node_modules/@scure/btc-signer/utils.js
var Point3 = /* @__PURE__ */ (() => secp256k1.Point)();
var isBytes5 = /* @__PURE__ */ (() => utils3.isBytes)();
var concatBytes6 = /* @__PURE__ */ (() => utils3.concatBytes)();
var sha2563 = /* @__PURE__ */ (() => sha256)();
var hash1603 = (msg) => ripemd160(sha2563(msg));
var PubT = /* @__PURE__ */ (() => Object.freeze({
  ecdsa: 0,
  schnorr: 1
}))();
function validatePubkey(pub, type) {
  const len = pub.length;
  if (type === PubT.ecdsa) {
    if (len === 32)
      throw new RangeError("Expected non-Schnorr key");
    Point3.fromBytes(pub);
    return pub;
  } else if (type === PubT.schnorr) {
    if (len !== 32)
      throw new RangeError("Expected 32-byte Schnorr key");
    schnorr.utils.lift_x(bytesToNumberBE(pub));
    return pub;
  } else {
    throw new TypeError("Unknown key type");
  }
}
var NETWORK = /* @__PURE__ */ Object.freeze({
  bech32: "bc",
  pubKeyHash: 0,
  scriptHash: 5,
  wif: 128
});
var TEST_NETWORK = /* @__PURE__ */ Object.freeze({
  bech32: "tb",
  pubKeyHash: 111,
  scriptHash: 196,
  wif: 239
});
function reverseObject(obj) {
  const res = /* @__PURE__ */ Object.create(null);
  for (const k in obj) {
    if (res[obj[k]] !== void 0)
      throw new Error("duplicate key");
    res[obj[k]] = k;
  }
  return res;
}

// upstream/node_modules/@scure/btc-signer/script.js
var OP = /* @__PURE__ */ Object.freeze({
  OP_0: 0,
  PUSHDATA1: 76,
  PUSHDATA2: 77,
  PUSHDATA4: 78,
  "1NEGATE": 79,
  RESERVED: 80,
  OP_1: 81,
  OP_2: 82,
  OP_3: 83,
  OP_4: 84,
  OP_5: 85,
  OP_6: 86,
  OP_7: 87,
  OP_8: 88,
  OP_9: 89,
  OP_10: 90,
  OP_11: 91,
  OP_12: 92,
  OP_13: 93,
  OP_14: 94,
  OP_15: 95,
  OP_16: 96,
  // Control
  NOP: 97,
  VER: 98,
  IF: 99,
  NOTIF: 100,
  VERIF: 101,
  VERNOTIF: 102,
  ELSE: 103,
  ENDIF: 104,
  VERIFY: 105,
  RETURN: 106,
  // Stack
  TOALTSTACK: 107,
  FROMALTSTACK: 108,
  "2DROP": 109,
  "2DUP": 110,
  "3DUP": 111,
  "2OVER": 112,
  "2ROT": 113,
  "2SWAP": 114,
  IFDUP: 115,
  DEPTH: 116,
  DROP: 117,
  DUP: 118,
  NIP: 119,
  OVER: 120,
  PICK: 121,
  ROLL: 122,
  ROT: 123,
  SWAP: 124,
  TUCK: 125,
  // Splice
  CAT: 126,
  SUBSTR: 127,
  LEFT: 128,
  RIGHT: 129,
  SIZE: 130,
  // Boolean logic
  INVERT: 131,
  AND: 132,
  OR: 133,
  XOR: 134,
  EQUAL: 135,
  EQUALVERIFY: 136,
  RESERVED1: 137,
  RESERVED2: 138,
  // Numbers
  "1ADD": 139,
  "1SUB": 140,
  "2MUL": 141,
  "2DIV": 142,
  NEGATE: 143,
  ABS: 144,
  NOT: 145,
  "0NOTEQUAL": 146,
  ADD: 147,
  SUB: 148,
  MUL: 149,
  DIV: 150,
  MOD: 151,
  LSHIFT: 152,
  RSHIFT: 153,
  BOOLAND: 154,
  BOOLOR: 155,
  NUMEQUAL: 156,
  NUMEQUALVERIFY: 157,
  NUMNOTEQUAL: 158,
  LESSTHAN: 159,
  GREATERTHAN: 160,
  LESSTHANOREQUAL: 161,
  GREATERTHANOREQUAL: 162,
  MIN: 163,
  MAX: 164,
  WITHIN: 165,
  // Crypto
  RIPEMD160: 166,
  SHA1: 167,
  SHA256: 168,
  HASH160: 169,
  HASH256: 170,
  CODESEPARATOR: 171,
  CHECKSIG: 172,
  CHECKSIGVERIFY: 173,
  CHECKMULTISIG: 174,
  CHECKMULTISIGVERIFY: 175,
  // Expansion
  NOP1: 176,
  CHECKLOCKTIMEVERIFY: 177,
  CHECKSEQUENCEVERIFY: 178,
  NOP4: 179,
  NOP5: 180,
  NOP6: 181,
  NOP7: 182,
  NOP8: 183,
  NOP9: 184,
  NOP10: 185,
  // BIP 342
  CHECKSIGADD: 186,
  // Invalid
  INVALID: 255
});
var OPNames = /* @__PURE__ */ (() => Object.freeze(reverseObject(OP)))();
function ScriptNum(bytesLimit = 6, forceMinimal = false) {
  return wrap({
    encodeStream: (w, value) => {
      if (value === 0n)
        return;
      const neg = value < 0;
      const val = BigInt(value);
      const nums = [];
      for (let abs = neg ? -val : val; abs; abs >>= 8n)
        nums.push(Number(abs & 0xffn));
      if (nums[nums.length - 1] >= 128)
        nums.push(neg ? 128 : 0);
      else if (neg)
        nums[nums.length - 1] |= 128;
      w.bytes(new Uint8Array(nums));
    },
    decodeStream: (r) => {
      const len = r.leftBytes;
      if (len > bytesLimit)
        throw new Error(`ScriptNum: number (${len}) bigger than limit=${bytesLimit}`);
      if (len === 0)
        return 0n;
      if (forceMinimal) {
        const data = r.bytes(len, true);
        if ((data[data.length - 1] & 127) === 0) {
          if (len <= 1 || (data[data.length - 2] & 128) === 0)
            throw new Error("Non-minimally encoded ScriptNum");
        }
      }
      let last = 0;
      let res = 0n;
      for (let i = 0; i < len; ++i) {
        last = r.byte();
        res |= BigInt(last) << 8n * BigInt(i);
      }
      if (last >= 128) {
        res &= 2n ** BigInt(len * 8) - 1n >> 1n;
        res = -res;
      }
      return res;
    }
  });
}
function OpToNum(op, bytesLimit = 4, forceMinimal = true) {
  if (typeof op === "number")
    return op;
  if (isBytes5(op)) {
    try {
      const val = ScriptNum(bytesLimit, forceMinimal).decode(op);
      if (val > Number.MAX_SAFE_INTEGER)
        return;
      return Number(val);
    } catch (e) {
      return;
    }
  }
  return;
}
var scriptPushLen = (op, read) => {
  if (!(OP.OP_0 < op && op <= OP.PUSHDATA4))
    return;
  if (op < OP.PUSHDATA1)
    return op;
  if (op === OP.PUSHDATA1)
    return read(1);
  if (op === OP.PUSHDATA2)
    return read(2);
  if (op === OP.PUSHDATA4)
    return read(4);
  throw new Error("Should be not possible");
};
var Script = /* @__PURE__ */ (() => Object.freeze(wrap({
  encodeStream: (w, value) => {
    for (let o of value) {
      if (typeof o === "string") {
        if (OP[o] === void 0)
          throw new Error(`Unknown opcode=${o}`);
        w.byte(OP[o]);
        continue;
      } else if (typeof o === "number") {
        if (o === 0) {
          w.byte(0);
          continue;
        } else if (o === -1) {
          w.byte(OP["1NEGATE"]);
          continue;
        } else if (1 <= o && o <= 16) {
          w.byte(OP.OP_1 - 1 + o);
          continue;
        }
      }
      if (typeof o === "number")
        o = ScriptNum().encode(BigInt(o));
      if (!isBytes5(o))
        throw new Error(`Wrong Script OP=${o} (${typeof o})`);
      const len = o.length;
      if (len < OP.PUSHDATA1)
        w.byte(len);
      else if (len <= 255) {
        w.byte(OP.PUSHDATA1);
        w.byte(len);
      } else if (len <= 65535) {
        w.byte(OP.PUSHDATA2);
        w.bytes(U16LE.encode(len));
      } else {
        w.byte(OP.PUSHDATA4);
        w.bytes(U32LE.encode(len));
      }
      w.bytes(o);
    }
  },
  decodeStream: (r) => {
    const out = [];
    while (!r.isEnd()) {
      const cur = r.byte();
      const len = scriptPushLen(cur, (bytes3) => {
        if (bytes3 === 1)
          return U8.decodeStream(r);
        if (bytes3 === 2)
          return U16LE.decodeStream(r);
        return U32LE.decodeStream(r);
      });
      if (len !== void 0) {
        out.push(r.bytes(len));
      } else if (cur === 0) {
        out.push(0);
      } else if (OP.OP_1 <= cur && cur <= OP.OP_16) {
        out.push(cur - (OP.OP_1 - 1));
      } else {
        const op = OPNames[cur];
        if (op === void 0)
          throw new Error(`Unknown opcode=${cur.toString(16)}`);
        out.push(op);
      }
    }
    return out;
  }
})))();

// upstream/node_modules/@scure/btc-signer/payment.js
var OutP2A = {
  encode(from) {
    if (from.length !== 2 || from[0] !== 1 || !isBytes5(from[1]) || hex.encode(from[1]) !== "4e73")
      return;
    return { type: "p2a", script: Script.encode(from) };
  },
  decode: (to) => {
    if (to.type !== "p2a")
      return;
    return [1, hex.decode("4e73")];
  }
};
function isValidPubkey(pub, type) {
  try {
    validatePubkey(pub, type);
    return true;
  } catch (e) {
    return false;
  }
}
var OutPK = {
  encode(from) {
    if (from.length !== 2 || !isBytes5(from[0]) || !isValidPubkey(from[0], PubT.ecdsa) || from[1] !== "CHECKSIG")
      return;
    return { type: "pk", pubkey: from[0] };
  },
  decode: (to) => {
    if (to.type !== "pk")
      return;
    return [to.pubkey, "CHECKSIG"];
  }
};
var OutPKH = {
  encode(from) {
    if (from.length !== 5 || from[0] !== "DUP" || from[1] !== "HASH160" || !isBytes5(from[2]))
      return;
    if (from[3] !== "EQUALVERIFY" || from[4] !== "CHECKSIG")
      return;
    return { type: "pkh", hash: from[2] };
  },
  // OutScript validates `pkh.hash` before this branch emits the canonical
  // `DUP HASH160 <hash> EQUALVERIFY CHECKSIG` script.
  decode: (to) => to.type === "pkh" ? ["DUP", "HASH160", to.hash, "EQUALVERIFY", "CHECKSIG"] : void 0
};
var OutSH = {
  encode(from) {
    if (from.length !== 3 || from[0] !== "HASH160" || !isBytes5(from[1]) || from[2] !== "EQUAL")
      return;
    return { type: "sh", hash: from[1] };
  },
  // OutScript validates `sh.hash` before this branch emits the canonical
  // `HASH160 <hash> EQUAL` script.
  decode: (to) => to.type === "sh" ? ["HASH160", to.hash, "EQUAL"] : void 0
};
var OutWSH = {
  encode(from) {
    if (from.length !== 2 || from[0] !== 0 || !isBytes5(from[1]))
      return;
    if (from[1].length !== 32)
      return;
    return { type: "wsh", hash: from[1] };
  },
  // OutScript validates `wsh.hash` before this branch emits the canonical
  // version-0 32-byte witness program.
  decode: (to) => to.type === "wsh" ? [0, to.hash] : void 0
};
var OutWPKH = {
  encode(from) {
    if (from.length !== 2 || from[0] !== 0 || !isBytes5(from[1]))
      return;
    if (from[1].length !== 20)
      return;
    return { type: "wpkh", hash: from[1] };
  },
  // OutScript validates `wpkh.hash` before this branch emits the canonical
  // version-0 20-byte witness program.
  decode: (to) => to.type === "wpkh" ? [0, to.hash] : void 0
};
var OutMS = {
  encode(from) {
    const last = from.length - 1;
    if (from[last] !== "CHECKMULTISIG")
      return;
    const m = from[0];
    const n = from[last - 1];
    if (typeof m !== "number" || typeof n !== "number")
      return;
    const pubkeys = from.slice(1, -2);
    if (n !== pubkeys.length)
      return;
    for (const pub of pubkeys)
      if (!isBytes5(pub))
        return;
    return { type: "ms", m, pubkeys };
  },
  // checkmultisig(n, ..pubkeys, m)
  decode: (to) => (
    // OutScript validates multisig pubkeys and `0 < m <= n <= 16`.
    // This branch only emits the canonical `m <pubkeys...> n CHECKMULTISIG`
    // script.
    to.type === "ms" ? [to.m, ...to.pubkeys, to.pubkeys.length, "CHECKMULTISIG"] : void 0
  )
};
var OutTR = {
  encode(from) {
    if (from.length !== 2 || from[0] !== 1 || !isBytes5(from[1]) || from[1].length !== 32)
      return;
    return { type: "tr", pubkey: from[1] };
  },
  // OutScript validates `tr.pubkey` before this branch emits the canonical
  // version-1 32-byte witness program.
  decode: (to) => to.type === "tr" ? [1, to.pubkey] : void 0
};
var OutTRNS = {
  encode(from) {
    const last = from.length - 1;
    if (from[last] !== "CHECKSIG")
      return;
    const pubkeys = [];
    for (let i = 0; i < last; i++) {
      const elm = from[i];
      if (i & 1) {
        if (elm !== "CHECKSIGVERIFY" || i === last - 1)
          return;
        continue;
      }
      if (!isBytes5(elm) || !isValidPubkey(elm, PubT.schnorr))
        return;
      pubkeys.push(elm);
    }
    if (!pubkeys.length)
      return;
    return { type: "tr_ns", pubkeys };
  },
  decode: (to) => {
    if (to.type !== "tr_ns")
      return;
    const out = [];
    for (let i = 0; i < to.pubkeys.length - 1; i++)
      out.push(to.pubkeys[i], "CHECKSIGVERIFY");
    out.push(to.pubkeys[to.pubkeys.length - 1], "CHECKSIG");
    return out;
  }
};
var OutTRMS = {
  encode(from) {
    const last = from.length - 1;
    if (from[last] !== "NUMEQUAL" || from[1] !== "CHECKSIG")
      return;
    const pubkeys = [];
    const m = OpToNum(from[last - 1]);
    if (typeof m !== "number")
      return;
    for (let i = 0; i < last - 1; i++) {
      const elm = from[i];
      if (i & 1) {
        if (elm !== (i === 1 ? "CHECKSIG" : "CHECKSIGADD"))
          return;
        continue;
      }
      if (!isBytes5(elm))
        return;
      pubkeys.push(elm);
    }
    return { type: "tr_ms", pubkeys, m };
  },
  decode: (to) => {
    if (to.type !== "tr_ms")
      return;
    const out = [to.pubkeys[0], "CHECKSIG"];
    for (let i = 1; i < to.pubkeys.length; i++)
      out.push(to.pubkeys[i], "CHECKSIGADD");
    out.push(to.m, "NUMEQUAL");
    return out;
  }
};
var OutUnknown = {
  encode(from) {
    return { type: "unknown", script: Script.encode(from) };
  },
  decode: (to) => (
    // This reparses `unknown.script` through the semantic Script codec, so raw
    // bytes must still be syntactically parseable and may canonicalize on re-encode.
    to.type === "unknown" ? Script.decode(to.script) : void 0
  )
};
var OutScripts = /* @__PURE__ */ (() => [
  // Order is semantic: specific structured coders run first and the catch-all
  // unknown fallback must stay last.
  OutP2A,
  OutPK,
  OutPKH,
  OutSH,
  OutWSH,
  OutWPKH,
  OutMS,
  OutTR,
  OutTRNS,
  OutTRMS,
  OutUnknown
])();
var _OutScript = /* @__PURE__ */ (() => apply(Script, coders.match(OutScripts)))();
var OutScript = /* @__PURE__ */ (() => Object.freeze(validate(_OutScript, (i) => {
  if (i.type === "pk" && !isValidPubkey(i.pubkey, PubT.ecdsa))
    throw new Error("OutScript/pk: wrong key");
  if ((i.type === "pkh" || i.type === "sh" || i.type === "wpkh") && (!isBytes5(i.hash) || i.hash.length !== 20))
    throw new Error(`OutScript/${i.type}: wrong hash`);
  if (i.type === "wsh" && (!isBytes5(i.hash) || i.hash.length !== 32))
    throw new Error(`OutScript/wsh: wrong hash`);
  if (i.type === "tr" && (!isBytes5(i.pubkey) || !isValidPubkey(i.pubkey, PubT.schnorr)))
    throw new Error("OutScript/tr: wrong taproot public key");
  if (i.type === "ms" || i.type === "tr_ns" || i.type === "tr_ms") {
    if (!Array.isArray(i.pubkeys))
      throw new Error("OutScript/multisig: wrong pubkeys array");
  }
  if (i.type === "ms") {
    const n = i.pubkeys.length;
    for (const p of i.pubkeys)
      if (!isValidPubkey(p, PubT.ecdsa))
        throw new Error("OutScript/multisig: wrong pubkey");
    anumber(i.m, "m");
    if (i.m <= 0 || n > 16 || i.m > n)
      throw new Error("OutScript/multisig: invalid params");
  }
  if (i.type === "tr_ns" || i.type === "tr_ms") {
    for (const p of i.pubkeys)
      if (!isValidPubkey(p, PubT.schnorr))
        throw new Error(`OutScript/${i.type}: wrong pubkey`);
  }
  if (i.type === "tr_ms") {
    const n = i.pubkeys.length;
    anumber(i.m, "m");
    if (i.m <= 0 || n > 999 || i.m > n)
      throw new Error("OutScript/tr_ms: invalid params");
  }
  return i;
})))();
var p2wpkh = (publicKey2, network = NETWORK) => {
  if (!isValidPubkey(publicKey2, PubT.ecdsa))
    throw new Error("P2WPKH: invalid publicKey");
  if (publicKey2.length === 65)
    throw new Error("P2WPKH: uncompressed public key");
  const hash2 = hash1603(publicKey2);
  return {
    type: "wpkh",
    script: OutScript.encode({ type: "wpkh", hash: hash2 }),
    address: Address(network).encode({ type: "wpkh", hash: hash2 }),
    hash: hash2
  };
};
var base58check2 = /* @__PURE__ */ createBase58check(sha2563);
function validateWitness(version, data) {
  if (data.length < 2 || data.length > 40)
    throw new Error("Witness: invalid length");
  if (version > 16)
    throw new Error("Witness: invalid version");
  if (version === 0 && !(data.length === 20 || data.length === 32))
    throw new Error("Witness: invalid length for version");
}
function programToWitness(version, data, network = NETWORK) {
  validateWitness(version, data);
  const coder = version === 0 ? bech32 : bech32m;
  return coder.encode(network.bech32, [version].concat(coder.toWords(data)));
}
function formatKey(hashed, prefix) {
  return base58check2.encode(concatBytes6(Uint8Array.from(prefix), hashed));
}
function Address(network = NETWORK) {
  return {
    encode(from) {
      const { type } = from;
      if (type === "wpkh")
        return programToWitness(0, from.hash, network);
      else if (type === "wsh")
        return programToWitness(0, from.hash, network);
      else if (type === "tr")
        return programToWitness(1, from.pubkey, network);
      else if (type === "pkh")
        return formatKey(from.hash, [network.pubKeyHash]);
      else if (type === "sh")
        return formatKey(from.hash, [network.scriptHash]);
      throw new Error(`Unknown address type=${type}`);
    },
    decode(address3) {
      if (address3.length < 14 || address3.length > 74)
        throw new Error("Invalid address length");
      if (network.bech32 && address3.toLowerCase().startsWith(`${network.bech32}1`)) {
        let res;
        try {
          res = bech32.decode(address3);
          if (res.words[0] !== 0)
            throw new Error(`bech32: wrong version=${res.words[0]}`);
        } catch (_) {
          res = bech32m.decode(address3);
          if (res.words[0] === 0)
            throw new Error(`bech32m: wrong version=${res.words[0]}`);
        }
        if (res.prefix !== network.bech32)
          throw new Error(`wrong bech32 prefix=${res.prefix}`);
        const [version, ...program] = res.words;
        const data2 = bech32.fromWords(program);
        validateWitness(version, data2);
        if (version === 0 && data2.length === 32)
          return { type: "wsh", hash: data2 };
        else if (version === 0 && data2.length === 20)
          return { type: "wpkh", hash: data2 };
        else if (version === 1 && data2.length === 32)
          return { type: "tr", pubkey: data2 };
        else
          throw new Error("Unknown witness program");
      }
      const data = base58check2.decode(address3);
      if (data.length !== 21)
        throw new Error("Invalid base58 address");
      if (data[0] === network.pubKeyHash) {
        return { type: "pkh", hash: data.slice(1) };
      } else if (data[0] === network.scriptHash) {
        return {
          type: "sh",
          hash: data.slice(1)
        };
      }
      throw new Error(`Invalid address prefix=${data[0]}`);
    }
  };
}

// upstream/src/derivation/bitcoin.ts
function deriveBitcoinAccount(root, network = "mainnet") {
  const path = bitcoinNativeSegwitPath(0, network);
  const node = root.derive(path);
  if (!node.publicKey) {
    throw new KeyDerivationError("Bitcoin derivation produced no public key");
  }
  const encoder = network === "testnet" ? TEST_NETWORK : NETWORK;
  const payment = p2wpkh(node.publicKey, encoder);
  if (!payment.address) {
    throw new KeyDerivationError("Bitcoin P2WPKH produced no address");
  }
  return { address: payment.address, path };
}

// upstream/src/derivation/index.ts
function deriveAddresses(prfBytes, options = {}) {
  const salt = options.salt ?? DEFAULT_SALT;
  const network = options.network ?? "mainnet";
  const { root } = prfBytesToRoot(prfBytes, salt);
  try {
    return {
      stacks: deriveStacksAccount(root, network),
      bitcoin: deriveBitcoinAccount(root, network)
    };
  } finally {
    root.wipePrivateData();
  }
}

// upstream/src/signing/stacks.ts
function stacksPrivateKeyHex(root) {
  const node = root.derive(STACKS_PATH);
  if (!node.privateKey) throw new KeyDerivationError("Stacks signing key unavailable");
  return `${bytesToHex(node.privateKey)}01`;
}
function originAddressOf(transaction) {
  const condition = transaction.auth.spendingCondition;
  const network = deriveNetworkFromTx(transaction);
  const version = addressHashModeToVersion(condition.hashMode, network);
  return addressToString(addressFromVersionHash(version, condition.signer));
}
function signStacksTransactionWithRoot(root, transaction, options = {}) {
  const privateKey = stacksPrivateKeyHex(root);
  const network = deriveNetworkFromTx(transaction);
  const derivedAddress = getAddressFromPrivateKey(privateKey, network);
  const originAddress = originAddressOf(transaction);
  if (derivedAddress !== originAddress) {
    throw new OriginAddressMismatchError(derivedAddress, originAddress);
  }
  if (transaction.postConditionMode === PostConditionMode.Allow && options.allowUnprotectedAssetMovement !== true) {
    throw new UnprotectedAssetMovementError();
  }
  const signer = new TransactionSigner(transaction);
  signer.signOrigin(privateKey);
  const pub = privateKeyToPublic(privateKey);
  const publicKey2 = typeof pub === "string" ? pub : bytesToHex(pub);
  const bytes3 = transaction.serializeBytes();
  if (transaction.auth.authType === AuthType.Sponsored) {
    return { kind: "origin-signed", transaction: bytes3, publicKey: publicKey2 };
  }
  return { kind: "complete", transaction: bytes3, txid: transaction.txid(), publicKey: publicKey2 };
}
function signStacksTransaction(prfBytes, transaction, options = {}) {
  const { salt, ...rest } = options;
  const { root } = prfBytesToRoot(prfBytes, salt ?? DEFAULT_SALT);
  try {
    return signStacksTransactionWithRoot(root, transaction, rest);
  } finally {
    root.wipePrivateData();
  }
}

// upstream/src/prf/support.ts
var IOS_PRF_FLOOR = { major: 18, minor: 4 };
function parseApplePlatformVersion(userAgent) {
  if (!/\b(iPhone|iPad|iPod)\b/.test(userAgent)) return null;
  const match2 = userAgent.match(/(?:iPhone )?OS (\d+)_(\d+)/);
  if (!match2) return null;
  return { major: Number(match2[1]), minor: Number(match2[2]) };
}
function isIosBelowPrfFloor(userAgent) {
  const v = parseApplePlatformVersion(userAgent);
  if (!v) return false;
  return v.major < IOS_PRF_FLOOR.major || v.major === IOS_PRF_FLOOR.major && v.minor < IOS_PRF_FLOOR.minor;
}
function currentPlatformInfo() {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent ?? "" : "";
  const isWebAuthnAvailable = typeof PublicKeyCredential !== "undefined" && typeof navigator !== "undefined" && !!navigator.credentials;
  return { userAgent: ua, isWebAuthnAvailable };
}
function assertPlatformSupportsPrf(info = currentPlatformInfo()) {
  if (!info.isWebAuthnAvailable) {
    throw new PrfUnsupportedError("no-webauthn", "WebAuthn is not available in this browser.");
  }
  if (isIosBelowPrfFloor(info.userAgent)) {
    throw new PrfUnsupportedError(
      "ios-below-floor",
      "iOS/iPadOS 18.4 or later is required for a passkey wallet (earlier versions can derive inconsistent keys across devices)."
    );
  }
}
var BACKUP_ELIGIBLE_FLAG = 8;
function authenticatorDataFlags(authData) {
  if (authData.length < 33) {
    throw new PrfUnsupportedError(
      "device-bound-authenticator",
      "Authenticator data too short to read the backup-eligibility flag."
    );
  }
  return authData[32];
}
function isSyncedCredential(authData) {
  return (authenticatorDataFlags(authData) & BACKUP_ELIGIBLE_FLAG) !== 0;
}

// upstream/src/prf/options.ts
var PRF_USER_VERIFICATION = "required";
function saltToBytes(salt = DEFAULT_SALT) {
  return utf8ToBytes(salt);
}
function buildCreateOptions(input) {
  const options = {
    rp: { name: input.rpName, id: input.rpId },
    user: {
      id: input.userId,
      name: input.userName,
      displayName: input.userDisplayName ?? input.userName
    },
    challenge: input.challenge,
    // ES256 then RS256.
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },
      { type: "public-key", alg: -257 }
    ],
    authenticatorSelection: {
      userVerification: PRF_USER_VERIFICATION,
      residentKey: "required",
      requireResidentKey: true
    },
    extensions: { prf: { eval: { first: saltToBytes(input.salt) } } }
  };
  if (input.timeoutMs !== void 0) options.timeout = input.timeoutMs;
  return options;
}
function buildGetOptions(input) {
  const options = {
    challenge: input.challenge,
    userVerification: PRF_USER_VERIFICATION,
    extensions: { prf: { eval: { first: saltToBytes(input.salt) } } }
  };
  if (input.rpId !== void 0) options.rpId = input.rpId;
  if (input.allowCredentialIds) {
    options.allowCredentials = input.allowCredentialIds.map(
      (id) => ({ type: "public-key", id })
    );
  }
  if (input.timeoutMs !== void 0) options.timeout = input.timeoutMs;
  return options;
}
function getPrfOutput(extensionResults) {
  return extensionResults?.prf;
}
function readPrfBytes(extensionResults) {
  const prf = getPrfOutput(extensionResults);
  if (!prf) throw new PrfUnsupportedError("prf-not-processed");
  const first = prf.results?.first;
  if (!first) throw new PrfUnsupportedError("no-prf-results");
  const bytes3 = first instanceof Uint8Array ? first : new Uint8Array(first);
  if (bytes3.length !== PRF_BYTES_LENGTH) {
    throw new InvalidPrfOutputError(
      `PRF output must be ${PRF_BYTES_LENGTH} bytes, got ${bytes3.length}`
    );
  }
  return bytes3;
}

// upstream/src/prf/client.ts
function requireWebAuthn() {
  if (typeof navigator === "undefined" || !navigator.credentials) {
    throw new PrfUnsupportedError("no-webauthn");
  }
}
async function createPasskey(input) {
  assertPlatformSupportsPrf();
  requireWebAuthn();
  const publicKey2 = buildCreateOptions(input);
  const credential = await navigator.credentials.create({
    publicKey: publicKey2
  });
  if (!credential) {
    throw new PrfUnsupportedError("no-webauthn", "Passkey creation returned no credential.");
  }
  const prf = getPrfOutput(credential.getClientExtensionResults());
  if (!prf) throw new PrfUnsupportedError("prf-not-processed");
  if (prf.enabled !== true) throw new PrfUnsupportedError("prf-not-enabled");
  const response = credential.response;
  if (typeof response.getAuthenticatorData !== "function") {
    throw new PrfUnsupportedError(
      "device-bound-authenticator",
      "Cannot read authenticator data to confirm a synced (backup-eligible) credential."
    );
  }
  if (!isSyncedCredential(new Uint8Array(response.getAuthenticatorData()))) {
    throw new PrfUnsupportedError("device-bound-authenticator");
  }
  return credential;
}
async function evaluatePrf(input) {
  assertPlatformSupportsPrf();
  requireWebAuthn();
  const publicKey2 = buildGetOptions(input);
  const assertion = await navigator.credentials.get({ publicKey: publicKey2 });
  if (!assertion) {
    throw new PrfUnsupportedError("no-prf-results", "Assertion returned no credential.");
  }
  return readPrfBytes(assertion.getClientExtensionResults());
}

// adapter.ts
var TESTNET_CONTRACT = "ST7KN0NNFMEJVKD8AX54QSZ71GA9Q6HY8T1BFHK3.xtrata-v3-2-5-test1";
var hex2 = (b) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
function readReviewedTransaction(unsignedHex, policy) {
  if (typeof unsignedHex !== "string" || !/^(?:[0-9a-f]{2})+$/i.test(unsignedHex) || unsignedHex.length > 12e5) throw Error("Invalid transaction encoding.");
  if (unsignedHex !== policy.expectedUnsignedHex) throw Error("Transaction differs from the reviewed bytes.");
  const tx = deserializeTransaction(unsignedHex);
  if (tx.transactionVersion !== 128 || tx.chainId !== 2147483648) throw Error("Only the Stacks Testnet chain is permitted.");
  if (tx.postConditionMode !== PostConditionMode.Deny) throw Error("Deny-mode spending protection is required.");
  if (tx.payload.payloadType !== PayloadType.ContractCall) throw Error("Only reviewed contract calls are permitted.");
  const contract = addressToString(tx.payload.contractAddress) + "." + tx.payload.contractName.content;
  if (contract !== TESTNET_CONTRACT || contract !== policy.contractId || !policy.functionNames.includes(tx.payload.functionName.content)) throw Error("Contract or function is outside the approved scope.");
  if (!isSingleSig(tx.auth.spendingCondition) || tx.auth.spendingCondition.signature.data !== emptyMessageSignature().data) throw Error("Expected an unsigned single-signature origin.");
  if (tx.auth.spendingCondition.fee > policy.maxMinerFee) throw Error("Miner fee exceeds the approved ceiling.");
  if (tx.auth.authType === AuthType.Sponsored && tx.auth.spendingCondition.fee !== 0n) throw Error("Sponsored origin fee must be zero; the sponsor pays its separately approved fee.");
  return tx;
}
function signReviewed(prfBytes, unsignedHex, policy) {
  try {
    const tx = readReviewedTransaction(unsignedHex, policy);
    const result = signStacksTransaction(prfBytes, tx);
    const transactionHex = hex2(result.transaction);
    const signed = deserializeTransaction(result.transaction);
    signed.verifyOrigin();
    const normalized = deserializeTransaction(result.transaction);
    if (!isSingleSig(normalized.auth.spendingCondition)) throw Error("Unexpected multisig result.");
    normalized.auth.spendingCondition.signature = emptyMessageSignature();
    if (hex2(normalized.serializeBytes()) !== unsignedHex.toLowerCase()) throw Error("Signer changed the reviewed transaction.");
    if (result.kind === "origin-signed") return { kind: "origin-signed", transactionHex, publicKey: result.publicKey };
    return { kind: "complete", transactionHex, txid: result.txid, publicKey: result.publicKey };
  } finally {
    prfBytes.fill(0);
  }
}

// upstream/test/vectors/derivation.vectors.json
var derivation_vectors_default = {
  _comment: "FROZEN wallet-identity vectors \u2014 see docs/wallet-identity.md. Inputs are fixed public byte patterns (test vectors, not real wallets). Regenerating with different constants is a breaking change.",
  salt: "stacks-passkey-wallet/v1",
  hkdf: {
    hash: "SHA-256",
    info: "stacks-passkey-wallet/bip39-entropy/v1",
    saltSource: "utf8(PRF salt)",
    outputBytes: 32
  },
  crossValidatedWith: [
    "@stacks/wallet-sdk",
    "bitcoinjs-lib"
  ],
  vectors: [
    {
      name: "all-zero",
      prfBytesHex: "0000000000000000000000000000000000000000000000000000000000000000",
      salt: "stacks-passkey-wallet/v1",
      mnemonic: "virtual mansion kind trip pyramid dilemma move load aerobic dwarf senior journey destroy split pudding often cannon autumn kangaroo aware response say candy soft",
      stacks: {
        path: "m/44'/5757'/0'/0/0",
        address: "SP37B02PN2BK8T1DCEQBF8E0MD5B6CQ06Y25J1AYH"
      },
      bitcoin: {
        path: "m/84'/0'/0'/0/0",
        address: "bc1qjyexgupjwsfy3uuxec724salu4ax24pemyxzh7"
      },
      bitcoin_testnet: {
        path: "m/84'/1'/0'/0/0",
        address: "tb1qr0z23k60cstq9ew3d42k9vn8g0laqdsum6u8ap"
      }
    },
    {
      name: "all-ff",
      prfBytesHex: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      salt: "stacks-passkey-wallet/v1",
      mnemonic: "alarm fix bless educate family tube blind guilt elbow math current hour champion unknown lab upgrade resist defense can hungry gather shrug inhale abuse",
      stacks: {
        path: "m/44'/5757'/0'/0/0",
        address: "SP2VRDRY5G0KFBKTSWFBHDY4W6AXH2BDJR4MH0SW3"
      },
      bitcoin: {
        path: "m/84'/0'/0'/0/0",
        address: "bc1q5rxm5xfvkkk6jjwcj9frg793c7an4r0nveyet9"
      },
      bitcoin_testnet: {
        path: "m/84'/1'/0'/0/0",
        address: "tb1qhd0kazgqljwnvwthk4c9ypy4qs7gpp6r63a8nl"
      }
    },
    {
      name: "counter-0..31",
      prfBytesHex: "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
      salt: "stacks-passkey-wallet/v1",
      mnemonic: "ostrich sport viable spoon have valid view arena offer suit intact series flee spike betray achieve process actual become mutual kite potato sauce tenant",
      stacks: {
        path: "m/44'/5757'/0'/0/0",
        address: "SP5Y2VZYN3B1Y38AQR1970XYBN3QF0D0A0PXRPZ7"
      },
      bitcoin: {
        path: "m/84'/0'/0'/0/0",
        address: "bc1qcgendxv6rmfzzzd352vrddl8dgez4j7xv7cudj"
      },
      bitcoin_testnet: {
        path: "m/84'/1'/0'/0/0",
        address: "tb1qq5mfurvyxj0pggw72npf64xfsc488s5qgen6fc"
      }
    },
    {
      name: "sha256-tagged",
      prfBytesHex: "05b6bebbe34ec24fe1108362cebb1519824ee7aa8de565dcd7ad2051d95b3be1",
      salt: "stacks-passkey-wallet/v1",
      mnemonic: "detail tent replace region leopard wrap robot core narrow trophy kind crack beef amateur forward parent today hurdle firm road cereal muscle spatial section",
      stacks: {
        path: "m/44'/5757'/0'/0/0",
        address: "SP3JA93Y4FPDNZ9QVXXSBATCZKB0QE60CQ0W61DG9"
      },
      bitcoin: {
        path: "m/84'/0'/0'/0/0",
        address: "bc1qaap04trkz6qtghsrsg2dq872k35vk0up7y6sjl"
      },
      bitcoin_testnet: {
        path: "m/84'/1'/0'/0/0",
        address: "tb1qa6ugfpsgp6l8q6xlxuk86g636e28er9jc6g5c6"
      }
    }
  ]
};

// upstream/test/vectors/signing.vectors.json
var signing_vectors_default = {
  _comment: "FROZEN Stacks transaction-signing vectors \u2014 see docs/wallet-identity.md and README \xA7Transaction signing. Inputs are fixed public byte patterns (test vectors, not real wallets \u2014 never fund these addresses). Each entry records every input, the exact unsigned bytes, and the exact expected output; an implementation that reproduces them byte-for-byte implements the signer. Regenerating with different constants is a breaking change.",
  salt: "stacks-passkey-wallet/v1",
  prfCorpus: {
    signer: "0707070707070707070707070707070707070707070707070707070707070707",
    foreign: "0808080808080808080808080808080808080808080808080808080808080808",
    note: "signer = 32 \xD7 0x07 (the passkey that signs every vector); foreign = 32 \xD7 0x08 (another passkey, used as recipient / contract address, and as the origin of the mismatch control)"
  },
  signerPublicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8",
  foreignPublicKey: "0350cf48ad6933bdf7a8798e81b1d948a57e030c8f2d9b3313934ff80ca22bd413",
  signatureScheme: "secp256k1 ECDSA, RFC 6979 deterministic (canonical low-s), recoverable VRS as @stacks/transactions serializes it",
  generatedBy: "scripts/generate-signing-vectors.ts",
  crossValidatedWith: [
    "@stacks/transactions deserializeTransaction + verifyOrigin (signature recovers to the signer hash)",
    "@stacks/wallet-sdk (independent account-0 key derivation; recovered public key must match)",
    "txid recomputed from the frozen bytes",
    "signed bytes with the signature blanked == unsigned bytes"
  ],
  vectors: [
    {
      name: "standard-transfer-mainnet",
      class: 1,
      description: "Standard STX transfer, mainnet, Deny mode, no post-conditions \u2192 complete",
      signerPrfBytesHex: "0707070707070707070707070707070707070707070707070707070707070707",
      salt: "stacks-passkey-wallet/v1",
      options: {},
      input: {
        type: "stx-transfer",
        network: "mainnet",
        originPublicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8",
        recipient: "SP3503TC0Q6E817VZES1ZVJF7PX78XJHXD4THPB8Z",
        amount: "1000",
        fee: "200",
        nonce: "7",
        memo: "",
        sponsored: false
      },
      originAddress: "SP1D2TYTDXM2HPXE8Z8NDF9XGGWYV0ARNH0YTYV71",
      unsignedHex: "000000000104005a2d7b4ded051b75c8fa2ad7a7b0873db02b1588000000000000000700000000000000c8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030200000000000516ca01e980b99c809f7f7643fdc9e7b74e8eca3d6900000000000003e800000000000000000000000000000000000000000000000000000000000000000000",
      expected: {
        kind: "complete",
        signedHex: "000000000104005a2d7b4ded051b75c8fa2ad7a7b0873db02b1588000000000000000700000000000000c8000092b63fcf158cffaf4a8978306f088c92be765be2570dd528b5d9b66481c6f7a65dd5f7b4c5c428f9337ce7f6bd85bd11da23bee98ca998f9869caaf3936eb7ef030200000000000516ca01e980b99c809f7f7643fdc9e7b74e8eca3d6900000000000003e800000000000000000000000000000000000000000000000000000000000000000000",
        txid: "94bbb3cb363229e0b246421d75c795221cbdd530e12aa35bf8f0f75b3e026a80",
        publicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8"
      }
    },
    {
      name: "standard-transfer-testnet",
      class: 2,
      description: "Standard STX transfer, testnet \u2192 complete (fence follows the version byte)",
      signerPrfBytesHex: "0707070707070707070707070707070707070707070707070707070707070707",
      salt: "stacks-passkey-wallet/v1",
      options: {},
      input: {
        type: "stx-transfer",
        network: "testnet",
        originPublicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8",
        recipient: "ST3503TC0Q6E817VZES1ZVJF7PX78XJHXD5NAT461",
        amount: "1000",
        fee: "200",
        nonce: "7",
        memo: "",
        sponsored: false
      },
      originAddress: "ST1D2TYTDXM2HPXE8Z8NDF9XGGWYV0ARNH3139C44",
      unsignedHex: "808000000004005a2d7b4ded051b75c8fa2ad7a7b0873db02b1588000000000000000700000000000000c800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003020000000000051aca01e980b99c809f7f7643fdc9e7b74e8eca3d6900000000000003e800000000000000000000000000000000000000000000000000000000000000000000",
      expected: {
        kind: "complete",
        signedHex: "808000000004005a2d7b4ded051b75c8fa2ad7a7b0873db02b1588000000000000000700000000000000c800010ee486d293fccfc724d952f4e2a88bb62bf785e83dfc3a659a9e5354049ea8820df70ee54bcf7bf6470452943b9fced252b780b8a69c436b7cd92dd64f6f50c603020000000000051aca01e980b99c809f7f7643fdc9e7b74e8eca3d6900000000000003e800000000000000000000000000000000000000000000000000000000000000000000",
        txid: "2da0a78ca5c4de5b3b2205ed2a04455a1c52f349e63691797ba0db76a3b1b1e5",
        publicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8"
      }
    },
    {
      name: "sponsored-transfer-mainnet",
      class: 3,
      description: "Sponsored STX transfer, mainnet \u2192 origin-signed; no txid exists",
      signerPrfBytesHex: "0707070707070707070707070707070707070707070707070707070707070707",
      salt: "stacks-passkey-wallet/v1",
      options: {},
      input: {
        type: "stx-transfer",
        network: "mainnet",
        originPublicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8",
        recipient: "SP3503TC0Q6E817VZES1ZVJF7PX78XJHXD4THPB8Z",
        amount: "1000",
        fee: "200",
        nonce: "7",
        memo: "",
        sponsored: true
      },
      originAddress: "SP1D2TYTDXM2HPXE8Z8NDF9XGGWYV0ARNH0YTYV71",
      unsignedHex: "000000000105005a2d7b4ded051b75c8fa2ad7a7b0873db02b1588000000000000000700000000000000c80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000029cfc6376255a78451eeb4b129ed8eacffa2feef00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030200000000000516ca01e980b99c809f7f7643fdc9e7b74e8eca3d6900000000000003e800000000000000000000000000000000000000000000000000000000000000000000",
      expected: {
        kind: "origin-signed",
        signedHex: "000000000105005a2d7b4ded051b75c8fa2ad7a7b0873db02b1588000000000000000700000000000000c80000e9e0b25f06bde529dce021e417dbfd5367aa3e5d34c4d242d502aa5871b0b24709d6c90146d0c519d07f0698cc2de68edef67743533bddaf178ba3dfd0c20c9a0029cfc6376255a78451eeb4b129ed8eacffa2feef00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030200000000000516ca01e980b99c809f7f7643fdc9e7b74e8eca3d6900000000000003e800000000000000000000000000000000000000000000000000000000000000000000",
        publicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8",
        txid: null
      }
    },
    {
      name: "contract-call-deny-with-post-conditions",
      class: 4,
      description: "Contract call, Deny mode with one STX post-condition \u2192 complete",
      signerPrfBytesHex: "0707070707070707070707070707070707070707070707070707070707070707",
      salt: "stacks-passkey-wallet/v1",
      options: {},
      input: {
        type: "contract-call",
        network: "mainnet",
        originPublicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8",
        contractAddress: "SP3503TC0Q6E817VZES1ZVJF7PX78XJHXD4THPB8Z",
        contractName: "example",
        functionName: "noop",
        functionArgs: [],
        fee: "300",
        nonce: "9",
        postConditionMode: "deny",
        postConditions: [
          {
            type: "stx-postcondition",
            address: "SP1D2TYTDXM2HPXE8Z8NDF9XGGWYV0ARNH0YTYV71",
            condition: "eq",
            amount: "1000"
          }
        ],
        sponsored: false
      },
      originAddress: "SP1D2TYTDXM2HPXE8Z8NDF9XGGWYV0ARNH0YTYV71",
      unsignedHex: "000000000104005a2d7b4ded051b75c8fa2ad7a7b0873db02b15880000000000000009000000000000012c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000302000000010002165a2d7b4ded051b75c8fa2ad7a7b0873db02b15880100000000000003e80216ca01e980b99c809f7f7643fdc9e7b74e8eca3d69076578616d706c65046e6f6f7000000000",
      expected: {
        kind: "complete",
        signedHex: "000000000104005a2d7b4ded051b75c8fa2ad7a7b0873db02b15880000000000000009000000000000012c00002c775983859d07d2387141d8c01172ed7250c66508aac4acf586fcdbefb7a444002024451c833992305d27c0688afbeabdaeccda618842b0f0b925045c8337330302000000010002165a2d7b4ded051b75c8fa2ad7a7b0873db02b15880100000000000003e80216ca01e980b99c809f7f7643fdc9e7b74e8eca3d69076578616d706c65046e6f6f7000000000",
        txid: "901c87ab8ccf4d72368138bfadc29794ed9b95e66e98b208eef65982e4fd03f8",
        publicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8"
      }
    },
    {
      name: "contract-call-allow-without-flag",
      class: 5,
      description: "Contract call, Allow mode, no opt-in flag \u2192 UnprotectedAssetMovementError",
      signerPrfBytesHex: "0707070707070707070707070707070707070707070707070707070707070707",
      salt: "stacks-passkey-wallet/v1",
      options: {},
      input: {
        type: "contract-call",
        network: "mainnet",
        originPublicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8",
        contractAddress: "SP3503TC0Q6E817VZES1ZVJF7PX78XJHXD4THPB8Z",
        contractName: "example",
        functionName: "noop",
        functionArgs: [],
        fee: "300",
        nonce: "9",
        postConditionMode: "allow",
        postConditions: [],
        sponsored: false
      },
      originAddress: "SP1D2TYTDXM2HPXE8Z8NDF9XGGWYV0ARNH0YTYV71",
      unsignedHex: "000000000104005a2d7b4ded051b75c8fa2ad7a7b0873db02b15880000000000000009000000000000012c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000301000000000216ca01e980b99c809f7f7643fdc9e7b74e8eca3d69076578616d706c65046e6f6f7000000000",
      expected: {
        error: "UnprotectedAssetMovementError"
      }
    },
    {
      name: "foreign-origin-mainnet",
      class: 6,
      description: "Transfer whose origin is another passkey's key \u2192 OriginAddressMismatchError",
      signerPrfBytesHex: "0707070707070707070707070707070707070707070707070707070707070707",
      salt: "stacks-passkey-wallet/v1",
      options: {},
      input: {
        type: "stx-transfer",
        network: "mainnet",
        originPublicKey: "0350cf48ad6933bdf7a8798e81b1d948a57e030c8f2d9b3313934ff80ca22bd413",
        recipient: "SP3503TC0Q6E817VZES1ZVJF7PX78XJHXD4THPB8Z",
        amount: "1000",
        fee: "200",
        nonce: "7",
        memo: "",
        sponsored: false
      },
      originAddress: "SP3503TC0Q6E817VZES1ZVJF7PX78XJHXD4THPB8Z",
      unsignedHex: "00000000010400ca01e980b99c809f7f7643fdc9e7b74e8eca3d69000000000000000700000000000000c8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030200000000000516ca01e980b99c809f7f7643fdc9e7b74e8eca3d6900000000000003e800000000000000000000000000000000000000000000000000000000000000000000",
      expected: {
        error: "OriginAddressMismatchError",
        derivedAddress: "SP1D2TYTDXM2HPXE8Z8NDF9XGGWYV0ARNH0YTYV71",
        originAddress: "SP3503TC0Q6E817VZES1ZVJF7PX78XJHXD4THPB8Z"
      }
    },
    {
      name: "contract-call-allow-with-flag",
      class: 7,
      description: "Contract call, Allow mode with allowUnprotectedAssetMovement: true \u2192 complete",
      signerPrfBytesHex: "0707070707070707070707070707070707070707070707070707070707070707",
      salt: "stacks-passkey-wallet/v1",
      options: {
        allowUnprotectedAssetMovement: true
      },
      input: {
        type: "contract-call",
        network: "mainnet",
        originPublicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8",
        contractAddress: "SP3503TC0Q6E817VZES1ZVJF7PX78XJHXD4THPB8Z",
        contractName: "example",
        functionName: "noop",
        functionArgs: [],
        fee: "300",
        nonce: "9",
        postConditionMode: "allow",
        postConditions: [],
        sponsored: false
      },
      originAddress: "SP1D2TYTDXM2HPXE8Z8NDF9XGGWYV0ARNH0YTYV71",
      unsignedHex: "000000000104005a2d7b4ded051b75c8fa2ad7a7b0873db02b15880000000000000009000000000000012c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000301000000000216ca01e980b99c809f7f7643fdc9e7b74e8eca3d69076578616d706c65046e6f6f7000000000",
      expected: {
        kind: "complete",
        signedHex: "000000000104005a2d7b4ded051b75c8fa2ad7a7b0873db02b15880000000000000009000000000000012c0000060b2d137609ccff0a2d553465f3960d866c0c9d88eb0cf3a3e0f974a0eab7707f48311576b4581aee7eb9d5c3aa401d9864e40d252abf95d30df0b249ec48a90301000000000216ca01e980b99c809f7f7643fdc9e7b74e8eca3d69076578616d706c65046e6f6f7000000000",
        txid: "90a701f6a2e0b2532c4eec5f837fc66c7e49d9908e41eacc80014d085af63fa2",
        publicKey: "02c27fe39f7923f0ba818f8621ee49ac9a4532f21c160d8dc2da3f4b0061bb3ca8"
      }
    }
  ]
};

// canary/main.ts
var $ = (id) => document.getElementById(id);
var bytes2 = (s) => Uint8Array.from(s.match(/../g).map((x) => parseInt(x, 16)));
var hex3 = (b) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
var report = { schema: "xtrata-deorganized-canary/1", library: "0.4.0", origin: location.origin, checks: [], ceremonies: [], broadcasts: 0 };
var credentialId;
var address2 = "";
var publicKey = "";
var busy = false;
var notice = (text, error2 = false) => {
  $("message").textContent = text;
  $("message").className = error2 ? "error" : "";
};
var row = (name, pass, detail = "") => {
  const li = document.createElement("li");
  li.textContent = (pass ? "PASS \u2014 " : "FAIL \u2014 ") + name + (detail ? " \xB7 " + detail : "");
  li.className = pass ? "" : "fail";
  $("checks").append(li);
  report.checks.push({ name, pass, detail });
};
async function run(fn) {
  if (busy) return;
  busy = true;
  document.querySelectorAll("button").forEach((b) => b.disabled = true);
  try {
    await fn();
  } catch (e) {
    const code = e.code || e.reason || e.name || "Error";
    report.ceremonies.push({ at: (/* @__PURE__ */ new Date()).toISOString(), outcome: "not-proven", code });
    notice(`Test not completed (${code}). Cancellation, provider state or device policy can cause this; it is not proof that the browser lacks PRF support. A credential may have been created even if verification failed.`, true);
  } finally {
    busy = false;
    document.querySelectorAll("button").forEach((b) => b.disabled = false);
    $("sign").disabled = !address2;
  }
}
function account(prf) {
  const { root } = prfBytesToRoot(prf);
  try {
    const node = root.derive("m/44'/5757'/0'/0/0");
    const p = privateKeyToPublic(hex3(node.privateKey) + "01");
    return { address: deriveStacksAccount(root, "testnet").address, publicKey: typeof p === "string" ? p : hex3(p) };
  } finally {
    root.wipePrivateData();
  }
}
async function ceremony() {
  return evaluatePrf({ challenge: crypto.getRandomValues(new Uint8Array(32)), rpId: location.hostname, allowCredentialIds: credentialId ? [credentialId] : void 0, timeoutMs: 9e4 });
}
function compare(next) {
  const expected = $("expected").value.trim() || address2;
  if (expected && expected !== next.address) throw Object.assign(Error(), { code: "ADDRESS_MISMATCH" });
  address2 = next.address;
  publicKey = next.publicKey;
  $("address").textContent = address2;
  report.address = address2;
  report.continuity = expected ? "matched" : "baseline-established";
}
$("offline").onclick = () => run(async () => {
  $("checks").replaceChildren();
  report.checks = [];
  for (const v of derivation_vectors_default.vectors) {
    const prf = bytes2(v.prfBytesHex);
    try {
      const got = deriveAddresses(prf, { salt: v.salt }).stacks.address;
      row(v.name, got === v.stacks.address);
    } finally {
      prf.fill(0);
    }
  }
  for (const v of signing_vectors_default.vectors) {
    const prf = bytes2(v.signerPrfBytesHex);
    try {
      const result = signStacksTransaction(prf, deserializeTransaction(v.unsignedHex), { ...v.options, salt: v.salt });
      const expected = v.expected;
      const okay = !expected.error && result.kind === expected.kind && hex3(result.transaction) === expected.signedHex && (result.kind === "origin-signed" ? !("txid" in result) : result.txid === expected.txid);
      row("Signing class " + v.class, okay);
    } catch (e) {
      row("Signing class " + v.class, e.name === v.expected.error);
    } finally {
      prf.fill(0);
    }
  }
  notice("Software checks finished. These results do not prove a real device ceremony or cross-device recovery.");
});
$("create").onclick = () => run(async () => {
  if (!window.isSecureContext) throw Object.assign(Error(), { code: "SECURE_ORIGIN_REQUIRED" });
  notice("Create a disposable test passkey. Do not select a funded wallet.");
  const c = await createPasskey({ rpName: "Xtrata compatibility TEST \u2014 do not fund", rpId: location.hostname, userId: crypto.getRandomValues(new Uint8Array(32)), userName: "compatibility-test-" + Date.now(), challenge: crypto.getRandomValues(new Uint8Array(32)), timeoutMs: 9e4 });
  credentialId = new Uint8Array(c.rawId);
  const prf = await ceremony();
  try {
    address2 = "";
    compare(account(prf));
    report.ceremonies.push({ at: (/* @__PURE__ */ new Date()).toISOString(), step: "create-and-get", outcome: "pass", backupEligible: true });
    notice("Test credential created and a dedicated PRF sign-in succeeded. Save the public address to compare on another device.");
  } finally {
    prf.fill(0);
  }
});
$("signin").onclick = () => run(async () => {
  notice("Select only the disposable compatibility-test credential.");
  const prf = await ceremony();
  try {
    compare(account(prf));
    report.ceremonies.push({ at: (/* @__PURE__ */ new Date()).toISOString(), step: "sign-in", outcome: "pass", continuity: report.continuity, backupEligibility: "not-checked-on-get-by-library" });
    notice("Sign-in succeeded. " + (report.continuity === "matched" ? "The expected address matched." : "Baseline recorded; repeat sign-in or compare on another device."));
  } finally {
    prf.fill(0);
  }
});
$("sign").onclick = () => run(async () => {
  const [contractAddress, contractName] = TESTNET_CONTRACT.split(".");
  const tx = await makeUnsignedContractCall({ contractAddress, contractName, functionName: "set-parent-delegate", functionArgs: [cl_exports.principal(address2), cl_exports.bool(false)], publicKey, network: "testnet", fee: 0n, nonce: 0n, postConditionMode: "deny", postConditions: [] });
  notice("Re-authorize the test credential to verify an offline signature. Nothing will be broadcast.");
  const prf = await ceremony();
  try {
    compare(account(prf));
    const raw = tx.serialize();
    const signed = signReviewed(prf, raw, { contractId: TESTNET_CONTRACT, functionNames: ["set-parent-delegate"], maxMinerFee: 0n, expectedUnsignedHex: raw });
    deserializeTransaction(signed.transactionHex).verifyOrigin();
    report.ceremonies.push({ at: (/* @__PURE__ */ new Date()).toISOString(), step: "offline-signature", outcome: "pass", network: "testnet" });
    notice("Offline signature verified against the Testnet transaction. Signed bytes were discarded; nothing was broadcast.");
  } finally {
    prf.fill(0);
  }
});
$("export").onclick = () => {
  const out = { ...report, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), device: $("device").value, provider: $("provider").value, sdp: $("sdp").value, notes: $("notes").value, userAgent: navigator.userAgent, secureContext: window.isSecureContext };
  const url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "passkey-canary-report.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
};
/*! Bundled license information:

@noble/hashes/utils.js:
@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/bip39/index.js:
  (*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) *)

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/weierstrass.js:
@noble/curves/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/bip32/index.js:
  (*! scure-bip32 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) *)

@noble/secp256k1/lib/esm/index.js:
  (*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)
*/
