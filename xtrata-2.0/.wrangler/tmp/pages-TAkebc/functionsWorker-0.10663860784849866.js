var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod2) => function __require() {
  try {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  } catch (e) {
    throw mod2 = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// ../src/lib/viewer/module-paths.ts
var URI_SCHEME_PATTERN, decodeSegment, escapeHtmlAttribute, parseRuntimeModuleContractId, normalizeModuleTokenUriPath, normalizeRuntimeEntryTokenId, buildRuntimeModulesPrefix, buildRuntimeModuleBaseHref, injectAfterTag, injectHtmlBaseHref;
var init_module_paths = __esm({
  "../src/lib/viewer/module-paths.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    URI_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
    decodeSegment = /* @__PURE__ */ __name((value) => {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }, "decodeSegment");
    escapeHtmlAttribute = /* @__PURE__ */ __name((value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "escapeHtmlAttribute");
    parseRuntimeModuleContractId = /* @__PURE__ */ __name((value) => {
      const trimmed = typeof value === "string" ? value.trim() : "";
      if (!trimmed) {
        return null;
      }
      const dotIndex = trimmed.indexOf(".");
      if (dotIndex <= 0 || dotIndex >= trimmed.length - 1) {
        return null;
      }
      const address = trimmed.slice(0, dotIndex).trim();
      const contractName = trimmed.slice(dotIndex + 1).trim();
      if (!address || !contractName) {
        return null;
      }
      return {
        address,
        contractName
      };
    }, "parseRuntimeModuleContractId");
    normalizeModuleTokenUriPath = /* @__PURE__ */ __name((value, options) => {
      const trimmed = typeof value === "string" ? value.trim() : "";
      if (!trimmed || trimmed.startsWith("//") || URI_SCHEME_PATTERN.test(trimmed)) {
        return null;
      }
      const withoutQuery = trimmed.split("#")[0]?.split("?")[0] ?? trimmed;
      const rawSegments = withoutQuery.split("/");
      const segments = [];
      for (const rawSegment of rawSegments) {
        const segment = options?.decodeSegments ? decodeSegment(rawSegment) : rawSegment;
        if (!segment || segment === ".") {
          continue;
        }
        if (segment === "..") {
          return null;
        }
        segments.push(segment);
      }
      if (segments.length === 0) {
        return null;
      }
      return segments.join("/");
    }, "normalizeModuleTokenUriPath");
    normalizeRuntimeEntryTokenId = /* @__PURE__ */ __name((value) => {
      if (typeof value === "bigint") {
        return value >= 0n ? value.toString() : null;
      }
      if (typeof value === "number") {
        if (!Number.isInteger(value) || value < 0) {
          return null;
        }
        return value.toString();
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        return /^\d+$/.test(trimmed) ? trimmed : null;
      }
      return null;
    }, "normalizeRuntimeEntryTokenId");
    buildRuntimeModulesPrefix = /* @__PURE__ */ __name((params) => {
      const contract = parseRuntimeModuleContractId(params.contractId);
      const entryTokenId = normalizeRuntimeEntryTokenId(params.entryTokenId);
      if (!contract) {
        return null;
      }
      const entrySegment = entryTokenId ? `/${entryTokenId}` : "";
      return `/runtime/modules/${encodeURIComponent(params.network)}/${encodeURIComponent(
        contract.address
      )}/${encodeURIComponent(contract.contractName)}${entrySegment}`;
    }, "buildRuntimeModulesPrefix");
    buildRuntimeModuleBaseHref = /* @__PURE__ */ __name((params) => {
      const prefix = buildRuntimeModulesPrefix(params);
      const normalizedPath = normalizeModuleTokenUriPath(params.tokenUriPath);
      if (!prefix || !normalizedPath) {
        return null;
      }
      const segments = normalizedPath.split("/");
      segments.pop();
      if (segments.length === 0) {
        return `${prefix}/`;
      }
      return `${prefix}/${segments.map((segment) => encodeURIComponent(segment)).join("/")}/`;
    }, "buildRuntimeModuleBaseHref");
    injectAfterTag = /* @__PURE__ */ __name((html2, tagName, content) => {
      const regex = new RegExp(`<${tagName}[^>]*>`, "i");
      const match2 = html2.match(regex);
      if (!match2 || match2.index === void 0) {
        return null;
      }
      const insertionPoint = match2.index + match2[0].length;
      return `${html2.slice(0, insertionPoint)}${content}${html2.slice(insertionPoint)}`;
    }, "injectAfterTag");
    injectHtmlBaseHref = /* @__PURE__ */ __name((html2, baseHref) => {
      if (!html2 || !baseHref) {
        return html2;
      }
      if (/<base[\s>]/i.test(html2)) {
        return html2;
      }
      const baseTag = `<base href="${escapeHtmlAttribute(baseHref)}">`;
      const afterHead = injectAfterTag(html2, "head", baseTag);
      if (afterHead) {
        return afterHead;
      }
      const afterHtml = injectAfterTag(html2, "html", `<head>${baseTag}</head>`);
      if (afterHtml) {
        return afterHtml;
      }
      const beforeBody = html2.match(/<body[^>]*>/i);
      if (beforeBody && beforeBody.index !== void 0) {
        return `${html2.slice(0, beforeBody.index)}<head>${baseTag}</head>${html2.slice(
          beforeBody.index
        )}`;
      }
      return `<head>${baseTag}</head>${html2}`;
    }, "injectHtmlBaseHref");
  }
});

// ../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/config.js
var init_config = __esm({
  "../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/config.js"() {
    init_functionsRoutes_0_03405564948503348();
  }
});

// ../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/errors.js
var ERROR_CODES;
var init_errors = __esm({
  "../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/errors.js"() {
    init_functionsRoutes_0_03405564948503348();
    ERROR_CODES = {
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
    Object.freeze(ERROR_CODES);
  }
});

// ../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/logger.js
var levels, levelToInt, intToLevel;
var init_logger = __esm({
  "../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/logger.js"() {
    init_functionsRoutes_0_03405564948503348();
    levels = ["debug", "info", "warn", "error", "none"];
    levelToInt = {};
    intToLevel = {};
    for (let index = 0; index < levels.length; index++) {
      const level = levels[index];
      levelToInt[level] = index;
      intToLevel[index] = level;
    }
  }
});

// ../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/utils.js
function intToBigInt(value, signed) {
  let parsedValue = value;
  if (typeof parsedValue === "number") {
    if (!Number.isInteger(parsedValue)) {
      throw new RangeError(`Invalid value. Values of type 'number' must be an integer.`);
    }
    if (parsedValue > Number.MAX_SAFE_INTEGER) {
      throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
    }
    return BigInt(parsedValue);
  }
  if (typeof parsedValue === "string") {
    if (parsedValue.toLowerCase().startsWith("0x")) {
      let hex = parsedValue.slice(2);
      hex = hex.padStart(hex.length + hex.length % 2, "0");
      parsedValue = hexToBytes(hex);
    } else {
      try {
        return BigInt(parsedValue);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new RangeError(`Invalid value. String integer '${parsedValue}' is not finite.`);
        }
      }
    }
  }
  if (typeof parsedValue === "bigint") {
    return parsedValue;
  }
  if (parsedValue instanceof Uint8Array) {
    if (signed) {
      const bn = fromTwos(BigInt(`0x${bytesToHex(parsedValue)}`), BigInt(parsedValue.byteLength * 8));
      return BigInt(bn.toString());
    } else {
      return BigInt(`0x${bytesToHex(parsedValue)}`);
    }
  }
  if (parsedValue != null && typeof parsedValue === "object" && parsedValue.constructor.name === "BN") {
    return BigInt(parsedValue.toString());
  }
  throw new TypeError(`Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.`);
}
function intToHex(integer, lengthBytes = 8) {
  const value = typeof integer === "bigint" ? integer : intToBigInt(integer, false);
  return value.toString(16).padStart(lengthBytes * 2, "0");
}
function hexToInt(hex) {
  return parseInt(hex, 16);
}
function bigIntToBytes(value, length = 16) {
  const hex = intToHex(value, length);
  return hexToBytes(hex);
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
function fromTwos(value, width) {
  if (nthBit(value, width - BigInt(1))) {
    return value - (BigInt(1) << width);
  }
  return value;
}
function bytesToHex(uint8a) {
  if (!(uint8a instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let hex = "";
  for (const u of uint8a) {
    hex += hexes[u];
  }
  return hex;
}
function hexToBytes(hex) {
  if (typeof hex !== "string") {
    throw new TypeError(`hexToBytes: expected string, got ${typeof hex}`);
  }
  hex = hex.startsWith("0x") || hex.startsWith("0X") ? hex.slice(2) : hex;
  const paddedHex = hex.length % 2 ? `0${hex}` : hex;
  const array = new Uint8Array(paddedHex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const j = i * 2;
    const hexByte = paddedHex.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i] = byte;
  }
  return array;
}
function utf8ToBytes(str) {
  return new TextEncoder().encode(str);
}
function bytesToUtf8(arr) {
  return new TextDecoder().decode(arr);
}
function asciiToBytes(str) {
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
function concatBytes(...arrays) {
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
  return concatBytes(...elements.map((e) => {
    if (typeof e === "number")
      return octetsToBytes([e]);
    if (e instanceof Array)
      return octetsToBytes(e);
    return e;
  }));
}
var hexes;
var init_utils = __esm({
  "../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/utils.js"() {
    init_functionsRoutes_0_03405564948503348();
    __name(intToBigInt, "intToBigInt");
    __name(intToHex, "intToHex");
    __name(hexToInt, "hexToInt");
    __name(bigIntToBytes, "bigIntToBytes");
    __name(toTwos, "toTwos");
    __name(nthBit, "nthBit");
    __name(fromTwos, "fromTwos");
    hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    __name(bytesToHex, "bytesToHex");
    __name(hexToBytes, "hexToBytes");
    __name(utf8ToBytes, "utf8ToBytes");
    __name(bytesToUtf8, "bytesToUtf8");
    __name(asciiToBytes, "asciiToBytes");
    __name(bytesToAscii, "bytesToAscii");
    __name(isNotOctet, "isNotOctet");
    __name(octetsToBytes, "octetsToBytes");
    __name(concatBytes, "concatBytes");
    __name(concatArray, "concatArray");
  }
});

// ../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/constants.js
var ChainID, TransactionVersion, PeerNetworkID, PRIVATE_KEY_COMPRESSED_LENGTH;
var init_constants = __esm({
  "../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/constants.js"() {
    init_functionsRoutes_0_03405564948503348();
    (function(ChainID3) {
      ChainID3[ChainID3["Testnet"] = 2147483648] = "Testnet";
      ChainID3[ChainID3["Mainnet"] = 1] = "Mainnet";
    })(ChainID || (ChainID = {}));
    (function(TransactionVersion3) {
      TransactionVersion3[TransactionVersion3["Mainnet"] = 0] = "Mainnet";
      TransactionVersion3[TransactionVersion3["Testnet"] = 128] = "Testnet";
    })(TransactionVersion || (TransactionVersion = {}));
    (function(PeerNetworkID2) {
      PeerNetworkID2[PeerNetworkID2["Mainnet"] = 385875968] = "Mainnet";
      PeerNetworkID2[PeerNetworkID2["Testnet"] = 4278190080] = "Testnet";
    })(PeerNetworkID || (PeerNetworkID = {}));
    PRIVATE_KEY_COMPRESSED_LENGTH = 33;
  }
});

// ../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/signatures.js
function signatureVrsToRsv(signature) {
  return signature.slice(2) + signature.slice(0, 2);
}
var init_signatures = __esm({
  "../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/signatures.js"() {
    init_functionsRoutes_0_03405564948503348();
    __name(signatureVrsToRsv, "signatureVrsToRsv");
  }
});

// ../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/keys.js
function privateKeyToBytes(privateKey) {
  const privateKeyBuffer = typeof privateKey === "string" ? hexToBytes(privateKey) : privateKey;
  if (privateKeyBuffer.length != 32 && privateKeyBuffer.length != 33) {
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${privateKeyBuffer.length}`);
  }
  if (privateKeyBuffer.length == 33 && privateKeyBuffer[32] !== 1) {
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  }
  return privateKeyBuffer;
}
var init_keys = __esm({
  "../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/keys.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_utils();
    __name(privateKeyToBytes, "privateKeyToBytes");
  }
});

// ../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/buffer.js
function readUInt16BE(source, offset) {
  return (source[offset + 0] << 8 | source[offset + 1]) >>> 0;
}
function readUInt8(source, offset) {
  return source[offset];
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
var init_buffer = __esm({
  "../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/buffer.js"() {
    init_functionsRoutes_0_03405564948503348();
    __name(readUInt16BE, "readUInt16BE");
    __name(readUInt8, "readUInt8");
    __name(readUInt32BE, "readUInt32BE");
    __name(writeUInt32BE, "writeUInt32BE");
  }
});

// ../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/index.js
var init_esm = __esm({
  "../node_modules/@stacks/transactions/node_modules/@stacks/common/dist/esm/index.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_config();
    init_errors();
    init_logger();
    init_utils();
    init_constants();
    init_signatures();
    init_keys();
    init_buffer();
  }
});

// ../node_modules/@stacks/transactions/dist/esm/constants.js
var ChainID2, DEFAULT_CHAIN_ID, MAX_STRING_LENGTH_BYTES, CLARITY_INT_SIZE, CLARITY_INT_BYTE_SIZE, RECOVERABLE_ECDSA_SIG_LENGTH_BYTES, StacksMessageType, PayloadType, ClarityVersion, AnchorMode, AnchorModeNames, AnchorModeMap, TransactionVersion2, DEFAULT_TRANSACTION_VERSION, PostConditionMode, PostConditionType, AuthType, AddressHashMode, AddressVersion, PubKeyEncoding, FungibleConditionCode, NonFungibleConditionCode, PostConditionPrincipalID, AssetType, TxRejectedReason;
var init_constants2 = __esm({
  "../node_modules/@stacks/transactions/dist/esm/constants.js"() {
    init_functionsRoutes_0_03405564948503348();
    (function(ChainID3) {
      ChainID3[ChainID3["Testnet"] = 2147483648] = "Testnet";
      ChainID3[ChainID3["Mainnet"] = 1] = "Mainnet";
    })(ChainID2 || (ChainID2 = {}));
    DEFAULT_CHAIN_ID = ChainID2.Mainnet;
    MAX_STRING_LENGTH_BYTES = 128;
    CLARITY_INT_SIZE = 128;
    CLARITY_INT_BYTE_SIZE = 16;
    RECOVERABLE_ECDSA_SIG_LENGTH_BYTES = 65;
    (function(StacksMessageType2) {
      StacksMessageType2[StacksMessageType2["Address"] = 0] = "Address";
      StacksMessageType2[StacksMessageType2["Principal"] = 1] = "Principal";
      StacksMessageType2[StacksMessageType2["LengthPrefixedString"] = 2] = "LengthPrefixedString";
      StacksMessageType2[StacksMessageType2["MemoString"] = 3] = "MemoString";
      StacksMessageType2[StacksMessageType2["AssetInfo"] = 4] = "AssetInfo";
      StacksMessageType2[StacksMessageType2["PostCondition"] = 5] = "PostCondition";
      StacksMessageType2[StacksMessageType2["PublicKey"] = 6] = "PublicKey";
      StacksMessageType2[StacksMessageType2["LengthPrefixedList"] = 7] = "LengthPrefixedList";
      StacksMessageType2[StacksMessageType2["Payload"] = 8] = "Payload";
      StacksMessageType2[StacksMessageType2["MessageSignature"] = 9] = "MessageSignature";
      StacksMessageType2[StacksMessageType2["StructuredDataSignature"] = 10] = "StructuredDataSignature";
      StacksMessageType2[StacksMessageType2["TransactionAuthField"] = 11] = "TransactionAuthField";
    })(StacksMessageType || (StacksMessageType = {}));
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
    (function(ClarityVersion2) {
      ClarityVersion2[ClarityVersion2["Clarity1"] = 1] = "Clarity1";
      ClarityVersion2[ClarityVersion2["Clarity2"] = 2] = "Clarity2";
      ClarityVersion2[ClarityVersion2["Clarity3"] = 3] = "Clarity3";
    })(ClarityVersion || (ClarityVersion = {}));
    (function(AnchorMode2) {
      AnchorMode2[AnchorMode2["OnChainOnly"] = 1] = "OnChainOnly";
      AnchorMode2[AnchorMode2["OffChainOnly"] = 2] = "OffChainOnly";
      AnchorMode2[AnchorMode2["Any"] = 3] = "Any";
    })(AnchorMode || (AnchorMode = {}));
    AnchorModeNames = ["onChainOnly", "offChainOnly", "any"];
    AnchorModeMap = {
      [AnchorModeNames[0]]: AnchorMode.OnChainOnly,
      [AnchorModeNames[1]]: AnchorMode.OffChainOnly,
      [AnchorModeNames[2]]: AnchorMode.Any,
      [AnchorMode.OnChainOnly]: AnchorMode.OnChainOnly,
      [AnchorMode.OffChainOnly]: AnchorMode.OffChainOnly,
      [AnchorMode.Any]: AnchorMode.Any
    };
    (function(TransactionVersion3) {
      TransactionVersion3[TransactionVersion3["Mainnet"] = 0] = "Mainnet";
      TransactionVersion3[TransactionVersion3["Testnet"] = 128] = "Testnet";
    })(TransactionVersion2 || (TransactionVersion2 = {}));
    DEFAULT_TRANSACTION_VERSION = TransactionVersion2.Mainnet;
    (function(PostConditionMode2) {
      PostConditionMode2[PostConditionMode2["Allow"] = 1] = "Allow";
      PostConditionMode2[PostConditionMode2["Deny"] = 2] = "Deny";
    })(PostConditionMode || (PostConditionMode = {}));
    (function(PostConditionType2) {
      PostConditionType2[PostConditionType2["STX"] = 0] = "STX";
      PostConditionType2[PostConditionType2["Fungible"] = 1] = "Fungible";
      PostConditionType2[PostConditionType2["NonFungible"] = 2] = "NonFungible";
    })(PostConditionType || (PostConditionType = {}));
    (function(AuthType2) {
      AuthType2[AuthType2["Standard"] = 4] = "Standard";
      AuthType2[AuthType2["Sponsored"] = 5] = "Sponsored";
    })(AuthType || (AuthType = {}));
    (function(AddressHashMode2) {
      AddressHashMode2[AddressHashMode2["SerializeP2PKH"] = 0] = "SerializeP2PKH";
      AddressHashMode2[AddressHashMode2["SerializeP2SH"] = 1] = "SerializeP2SH";
      AddressHashMode2[AddressHashMode2["SerializeP2WPKH"] = 2] = "SerializeP2WPKH";
      AddressHashMode2[AddressHashMode2["SerializeP2WSH"] = 3] = "SerializeP2WSH";
      AddressHashMode2[AddressHashMode2["SerializeP2SHNonSequential"] = 5] = "SerializeP2SHNonSequential";
      AddressHashMode2[AddressHashMode2["SerializeP2WSHNonSequential"] = 7] = "SerializeP2WSHNonSequential";
    })(AddressHashMode || (AddressHashMode = {}));
    (function(AddressVersion2) {
      AddressVersion2[AddressVersion2["MainnetSingleSig"] = 22] = "MainnetSingleSig";
      AddressVersion2[AddressVersion2["MainnetMultiSig"] = 20] = "MainnetMultiSig";
      AddressVersion2[AddressVersion2["TestnetSingleSig"] = 26] = "TestnetSingleSig";
      AddressVersion2[AddressVersion2["TestnetMultiSig"] = 21] = "TestnetMultiSig";
    })(AddressVersion || (AddressVersion = {}));
    (function(PubKeyEncoding2) {
      PubKeyEncoding2[PubKeyEncoding2["Compressed"] = 0] = "Compressed";
      PubKeyEncoding2[PubKeyEncoding2["Uncompressed"] = 1] = "Uncompressed";
    })(PubKeyEncoding || (PubKeyEncoding = {}));
    (function(FungibleConditionCode2) {
      FungibleConditionCode2[FungibleConditionCode2["Equal"] = 1] = "Equal";
      FungibleConditionCode2[FungibleConditionCode2["Greater"] = 2] = "Greater";
      FungibleConditionCode2[FungibleConditionCode2["GreaterEqual"] = 3] = "GreaterEqual";
      FungibleConditionCode2[FungibleConditionCode2["Less"] = 4] = "Less";
      FungibleConditionCode2[FungibleConditionCode2["LessEqual"] = 5] = "LessEqual";
    })(FungibleConditionCode || (FungibleConditionCode = {}));
    (function(NonFungibleConditionCode2) {
      NonFungibleConditionCode2[NonFungibleConditionCode2["Sends"] = 16] = "Sends";
      NonFungibleConditionCode2[NonFungibleConditionCode2["DoesNotSend"] = 17] = "DoesNotSend";
    })(NonFungibleConditionCode || (NonFungibleConditionCode = {}));
    (function(PostConditionPrincipalID2) {
      PostConditionPrincipalID2[PostConditionPrincipalID2["Origin"] = 1] = "Origin";
      PostConditionPrincipalID2[PostConditionPrincipalID2["Standard"] = 2] = "Standard";
      PostConditionPrincipalID2[PostConditionPrincipalID2["Contract"] = 3] = "Contract";
    })(PostConditionPrincipalID || (PostConditionPrincipalID = {}));
    (function(AssetType2) {
      AssetType2[AssetType2["STX"] = 0] = "STX";
      AssetType2[AssetType2["Fungible"] = 1] = "Fungible";
      AssetType2[AssetType2["NonFungible"] = 2] = "NonFungible";
    })(AssetType || (AssetType = {}));
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
      TxRejectedReason2["TooMuchChaining"] = "TooMuchChaining";
      TxRejectedReason2["ConflictingNonceInMempool"] = "ConflictingNonceInMempool";
      TxRejectedReason2["BadTransactionVersion"] = "BadTransactionVersion";
      TxRejectedReason2["TransferRecipientCannotEqualSender"] = "TransferRecipientCannotEqualSender";
      TxRejectedReason2["TransferAmountMustBePositive"] = "TransferAmountMustBePositive";
      TxRejectedReason2["ServerFailureDatabase"] = "ServerFailureDatabase";
      TxRejectedReason2["EstimatorError"] = "EstimatorError";
      TxRejectedReason2["TemporarilyBlacklisted"] = "TemporarilyBlacklisted";
      TxRejectedReason2["ServerFailureOther"] = "ServerFailureOther";
    })(TxRejectedReason || (TxRejectedReason = {}));
  }
});

// ../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/_assert.js
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
var assert, assert_default;
var init_assert = __esm({
  "../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/_assert.js"() {
    init_functionsRoutes_0_03405564948503348();
    __name(number, "number");
    __name(bool, "bool");
    __name(bytes, "bytes");
    __name(hash, "hash");
    __name(exists, "exists");
    __name(output, "output");
    assert = {
      number,
      bool,
      bytes,
      hash,
      exists,
      output
    };
    assert_default = assert;
  }
});

// ../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/cryptoBrowser.js
var crypto2;
var init_cryptoBrowser = __esm({
  "../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/cryptoBrowser.js"() {
    init_functionsRoutes_0_03405564948503348();
    crypto2 = {
      node: void 0,
      web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
    };
  }
});

// ../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/utils.js
function utf8ToBytes2(str) {
  if (typeof str !== "string") {
    throw new TypeError(`utf8ToBytes expected string, got ${typeof str}`);
  }
  return new TextEncoder().encode(str);
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes2(data);
  if (!(data instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof data})`);
  return data;
}
function wrapConstructor(hashConstructor) {
  const hashC = /* @__PURE__ */ __name((message) => hashConstructor().update(toBytes(message)).digest(), "hashC");
  const tmp = hashConstructor();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashConstructor();
  return hashC;
}
var createView, rotr, isLE, hexes2, Hash;
var init_utils2 = __esm({
  "../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/utils.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_cryptoBrowser();
    createView = /* @__PURE__ */ __name((arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength), "createView");
    rotr = /* @__PURE__ */ __name((word, shift) => word << 32 - shift | word >>> shift, "rotr");
    isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
    if (!isLE)
      throw new Error("Non little-endian hardware is not supported");
    hexes2 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
    __name(utf8ToBytes2, "utf8ToBytes");
    __name(toBytes, "toBytes");
    Hash = class {
      static {
        __name(this, "Hash");
      }
      // Safe version that clones internal state
      clone() {
        return this._cloneInto();
      }
    };
    __name(wrapConstructor, "wrapConstructor");
  }
});

// ../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/_sha2.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
var SHA2;
var init_sha2 = __esm({
  "../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/_sha2.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_assert();
    init_utils2();
    __name(setBigUint64, "setBigUint64");
    SHA2 = class extends Hash {
      static {
        __name(this, "SHA2");
      }
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
        this.view = createView(this.buffer);
      }
      update(data) {
        assert_default.exists(this);
        const { view, buffer, blockLen } = this;
        data = toBytes(data);
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
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
        const { buffer, view, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        this.buffer.subarray(pos).fill(0);
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
        this.process(view, 0);
        const oview = createView(out);
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
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
    };
  }
});

// ../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/ripemd160.js
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
var Rho, Id, Pi, idxL, idxR, shifts, shiftsL, shiftsR, Kl, Kr, rotl, BUF, RIPEMD160, ripemd160;
var init_ripemd160 = __esm({
  "../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/ripemd160.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_sha2();
    init_utils2();
    Rho = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]);
    Id = Uint8Array.from({ length: 16 }, (_, i) => i);
    Pi = Id.map((i) => (9 * i + 5) % 16);
    idxL = [Id];
    idxR = [Pi];
    for (let i = 0; i < 4; i++)
      for (let j of [idxL, idxR])
        j.push(j[i].map((k) => Rho[k]));
    shifts = [
      [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
      [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
      [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
      [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
      [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
    ].map((i) => new Uint8Array(i));
    shiftsL = idxL.map((idx, i) => idx.map((j) => shifts[i][j]));
    shiftsR = idxR.map((idx, i) => idx.map((j) => shifts[i][j]));
    Kl = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]);
    Kr = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]);
    rotl = /* @__PURE__ */ __name((word, shift) => word << shift | word >>> 32 - shift, "rotl");
    __name(f, "f");
    BUF = new Uint32Array(16);
    RIPEMD160 = class extends SHA2 {
      static {
        __name(this, "RIPEMD160");
      }
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
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          BUF[i] = view.getUint32(offset, true);
        let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
        for (let group = 0; group < 5; group++) {
          const rGroup = 4 - group;
          const hbl = Kl[group], hbr = Kr[group];
          const rl = idxL[group], rr = idxR[group];
          const sl = shiftsL[group], sr = shiftsR[group];
          for (let i = 0; i < 16; i++) {
            const tl = rotl(al + f(group, bl, cl, dl) + BUF[rl[i]] + hbl, sl[i]) + el | 0;
            al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
          }
          for (let i = 0; i < 16; i++) {
            const tr = rotl(ar + f(rGroup, br, cr, dr) + BUF[rr[i]] + hbr, sr[i]) + er | 0;
            ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
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
    ripemd160 = wrapConstructor(() => new RIPEMD160());
  }
});

// ../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/sha256.js
var Chi, Maj, SHA256_K, IV, SHA256_W, SHA256, SHA224, sha256, sha224;
var init_sha256 = __esm({
  "../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/sha256.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_sha2();
    init_utils2();
    Chi = /* @__PURE__ */ __name((a, b, c) => a & b ^ ~a & c, "Chi");
    Maj = /* @__PURE__ */ __name((a, b, c) => a & b ^ a & c ^ b & c, "Maj");
    SHA256_K = new Uint32Array([
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
    IV = new Uint32Array([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    SHA256_W = new Uint32Array(64);
    SHA256 = class extends SHA2 {
      static {
        __name(this, "SHA256");
      }
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
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
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
        SHA256_W.fill(0);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
      }
    };
    SHA224 = class extends SHA256 {
      static {
        __name(this, "SHA224");
      }
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
    sha256 = wrapConstructor(() => new SHA256());
    sha224 = wrapConstructor(() => new SHA224());
  }
});

// ../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0; i < lst.length; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var U32_MASK64, _32n, toBig, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, rotr32H, rotr32L, rotlSH, rotlSL, rotlBH, rotlBL, add3L, add3H, add4L, add4H, add5L, add5H, u64, u64_default;
var init_u64 = __esm({
  "../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/_u64.js"() {
    init_functionsRoutes_0_03405564948503348();
    U32_MASK64 = BigInt(2 ** 32 - 1);
    _32n = BigInt(32);
    __name(fromBig, "fromBig");
    __name(split, "split");
    toBig = /* @__PURE__ */ __name((h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0), "toBig");
    shrSH = /* @__PURE__ */ __name((h, l, s) => h >>> s, "shrSH");
    shrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "shrSL");
    rotrSH = /* @__PURE__ */ __name((h, l, s) => h >>> s | l << 32 - s, "rotrSH");
    rotrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "rotrSL");
    rotrBH = /* @__PURE__ */ __name((h, l, s) => h << 64 - s | l >>> s - 32, "rotrBH");
    rotrBL = /* @__PURE__ */ __name((h, l, s) => h >>> s - 32 | l << 64 - s, "rotrBL");
    rotr32H = /* @__PURE__ */ __name((h, l) => l, "rotr32H");
    rotr32L = /* @__PURE__ */ __name((h, l) => h, "rotr32L");
    rotlSH = /* @__PURE__ */ __name((h, l, s) => h << s | l >>> 32 - s, "rotlSH");
    rotlSL = /* @__PURE__ */ __name((h, l, s) => l << s | h >>> 32 - s, "rotlSL");
    rotlBH = /* @__PURE__ */ __name((h, l, s) => l << s - 32 | h >>> 64 - s, "rotlBH");
    rotlBL = /* @__PURE__ */ __name((h, l, s) => h << s - 32 | l >>> 64 - s, "rotlBL");
    __name(add, "add");
    add3L = /* @__PURE__ */ __name((Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0), "add3L");
    add3H = /* @__PURE__ */ __name((low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0, "add3H");
    add4L = /* @__PURE__ */ __name((Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0), "add4L");
    add4H = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0, "add4H");
    add5L = /* @__PURE__ */ __name((Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0), "add5L");
    add5H = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0, "add5H");
    u64 = {
      fromBig,
      split,
      toBig,
      shrSH,
      shrSL,
      rotrSH,
      rotrSL,
      rotrBH,
      rotrBL,
      rotr32H,
      rotr32L,
      rotlSH,
      rotlSL,
      rotlBH,
      rotlBL,
      add,
      add3L,
      add3H,
      add4L,
      add4H,
      add5H,
      add5L
    };
    u64_default = u64;
  }
});

// ../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/sha512.js
var SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA512, SHA512_224, SHA512_256, SHA384, sha512, sha512_224, sha512_256, sha384;
var init_sha512 = __esm({
  "../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/sha512.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_sha2();
    init_u64();
    init_utils2();
    [SHA512_Kh, SHA512_Kl] = u64_default.split([
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
    SHA512_W_H = new Uint32Array(80);
    SHA512_W_L = new Uint32Array(80);
    SHA512 = class extends SHA2 {
      static {
        __name(this, "SHA512");
      }
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
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view.getUint32(offset);
          SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = u64_default.rotrSH(W15h, W15l, 1) ^ u64_default.rotrSH(W15h, W15l, 8) ^ u64_default.shrSH(W15h, W15l, 7);
          const s0l = u64_default.rotrSL(W15h, W15l, 1) ^ u64_default.rotrSL(W15h, W15l, 8) ^ u64_default.shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = u64_default.rotrSH(W2h, W2l, 19) ^ u64_default.rotrBH(W2h, W2l, 61) ^ u64_default.shrSH(W2h, W2l, 6);
          const s1l = u64_default.rotrSL(W2h, W2l, 19) ^ u64_default.rotrBL(W2h, W2l, 61) ^ u64_default.shrSL(W2h, W2l, 6);
          const SUMl = u64_default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = u64_default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = u64_default.rotrSH(Eh, El, 14) ^ u64_default.rotrSH(Eh, El, 18) ^ u64_default.rotrBH(Eh, El, 41);
          const sigma1l = u64_default.rotrSL(Eh, El, 14) ^ u64_default.rotrSL(Eh, El, 18) ^ u64_default.rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = u64_default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = u64_default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
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
        SHA512_W_H.fill(0);
        SHA512_W_L.fill(0);
      }
      destroy() {
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    SHA512_224 = class extends SHA512 {
      static {
        __name(this, "SHA512_224");
      }
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
    SHA512_256 = class extends SHA512 {
      static {
        __name(this, "SHA512_256");
      }
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
    SHA384 = class extends SHA512 {
      static {
        __name(this, "SHA384");
      }
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
    sha512 = wrapConstructor(() => new SHA512());
    sha512_224 = wrapConstructor(() => new SHA512_224());
    sha512_256 = wrapConstructor(() => new SHA512_256());
    sha384 = wrapConstructor(() => new SHA384());
  }
});

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
    init_functionsRoutes_0_03405564948503348();
  }
});

// ../node_modules/@noble/secp256k1/lib/esm/index.js
function weierstrass(x) {
  const { a, b } = CURVE;
  const x2 = mod(x * x);
  const x3 = mod(x2 * x);
  return mod(x3 + a * x + b);
}
function assertJacPoint(other) {
  if (!(other instanceof JacobianPoint))
    throw new TypeError("JacobianPoint expected");
}
function constTimeNegate(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function sliceDER(s) {
  return Number.parseInt(s[0], 16) >= 8 ? "00" + s : s;
}
function parseDERInt(data) {
  if (data.length < 2 || data[0] !== 2) {
    throw new Error(`Invalid signature integer tag: ${bytesToHex2(data)}`);
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
    throw new Error(`Invalid signature tag: ${bytesToHex2(data)}`);
  }
  if (data[1] !== data.length - 2) {
    throw new Error("Invalid signature: incorrect length");
  }
  const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
  const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
  if (rBytesLeft.length) {
    throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex2(rBytesLeft)}`);
  }
  return { r, s };
}
function concatBytes2(...arrays) {
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
function bytesToHex2(uint8a) {
  if (!(uint8a instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let hex = "";
  for (let i = 0; i < uint8a.length; i++) {
    hex += hexes3[uint8a[i]];
  }
  return hex;
}
function numTo32bStr(num) {
  if (typeof num !== "bigint")
    throw new Error("Expected bigint");
  if (!(_0n <= num && num < POW_2_256))
    throw new Error("Expected number 0 <= n < 2^256");
  return num.toString(16).padStart(64, "0");
}
function numTo32b(num) {
  const b = hexToBytes2(numTo32bStr(num));
  if (b.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return b;
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string") {
    throw new TypeError("hexToNumber: expected string, got " + typeof hex);
  }
  return BigInt(`0x${hex}`);
}
function hexToBytes2(hex) {
  if (typeof hex !== "string") {
    throw new TypeError("hexToBytes: expected string, got " + typeof hex);
  }
  if (hex.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + hex.length);
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const j = i * 2;
    const hexByte = hex.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i] = byte;
  }
  return array;
}
function bytesToNumber(bytes2) {
  return hexToNumber(bytesToHex2(bytes2));
}
function ensureBytes(hex) {
  return hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes2(hex);
}
function normalizeScalar(num) {
  if (typeof num === "number" && Number.isSafeInteger(num) && num > 0)
    return BigInt(num);
  if (typeof num === "bigint" && isWithinCurveOrder(num))
    return num;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function mod(a, b = CURVE.P) {
  const result = a % b;
  return result >= _0n ? result : b + result;
}
function pow2(x, power) {
  const { P } = CURVE;
  let res = x;
  while (power-- > _0n) {
    res *= res;
    res %= P;
  }
  return res;
}
function sqrtMod(x) {
  const { P } = CURVE;
  const _6n = BigInt(6);
  const _11n = BigInt(11);
  const _22n = BigInt(22);
  const _23n = BigInt(23);
  const _44n = BigInt(44);
  const _88n = BigInt(88);
  const b2 = x * x * x % P;
  const b3 = b2 * b2 * x % P;
  const b6 = pow2(b3, _3n) * b3 % P;
  const b9 = pow2(b6, _3n) * b3 % P;
  const b11 = pow2(b9, _2n) * b2 % P;
  const b22 = pow2(b11, _11n) * b11 % P;
  const b44 = pow2(b22, _22n) * b22 % P;
  const b88 = pow2(b44, _44n) * b44 % P;
  const b176 = pow2(b88, _88n) * b88 % P;
  const b220 = pow2(b176, _44n) * b44 % P;
  const b223 = pow2(b220, _3n) * b3 % P;
  const t1 = pow2(b223, _23n) * b22 % P;
  const t2 = pow2(t1, _6n) * b2 % P;
  const rt = pow2(t2, _2n);
  const xc = rt * rt % P;
  if (xc !== x)
    throw new Error("Cannot find square root");
  return rt;
}
function invert(number2, modulo = CURVE.P) {
  if (number2 === _0n || modulo <= _0n) {
    throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
  }
  let a = mod(number2, modulo);
  let b = modulo;
  let x = _0n, y = _1n, u = _1n, v = _0n;
  while (a !== _0n) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function invertBatch(nums, p = CURVE.P) {
  const scratch = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (num === _0n)
      return acc;
    scratch[i] = acc;
    return mod(acc * num, p);
  }, _1n);
  const inverted = invert(lastMultiplied, p);
  nums.reduceRight((acc, num, i) => {
    if (num === _0n)
      return acc;
    scratch[i] = mod(acc * scratch[i], p);
    return mod(acc * num, p);
  }, inverted);
  return scratch;
}
function bits2int_2(bytes2) {
  const delta = bytes2.length * 8 - groupLen * 8;
  const num = bytesToNumber(bytes2);
  return delta > 0 ? num >> BigInt(delta) : num;
}
function truncateHash(hash2, truncateOnly = false) {
  const h = bits2int_2(hash2);
  if (truncateOnly)
    return h;
  const { n } = CURVE;
  return h >= n ? h - n : h;
}
function isWithinCurveOrder(num) {
  return _0n < num && num < CURVE.n;
}
function isValidFieldElement(num) {
  return _0n < num && num < CURVE.P;
}
function kmdToSig(kBytes, m, d, lowS = true) {
  const { n } = CURVE;
  const k = truncateHash(kBytes, true);
  if (!isWithinCurveOrder(k))
    return;
  const kinv = invert(k, n);
  const q = Point.BASE.multiply(k);
  const r = mod(q.x, n);
  if (r === _0n)
    return;
  const s = mod(kinv * mod(m + d * r, n), n);
  if (s === _0n)
    return;
  let sig = new Signature(r, s);
  let recovery = (q.x === sig.r ? 0 : 2) | Number(q.y & _1n);
  if (lowS && sig.hasHighS()) {
    sig = sig.normalizeS();
    recovery ^= 1;
  }
  return { sig, recovery };
}
function normalizePrivateKey(key) {
  let num;
  if (typeof key === "bigint") {
    num = key;
  } else if (typeof key === "number" && Number.isSafeInteger(key) && key > 0) {
    num = BigInt(key);
  } else if (typeof key === "string") {
    if (key.length !== 2 * groupLen)
      throw new Error("Expected 32 bytes of private key");
    num = hexToNumber(key);
  } else if (key instanceof Uint8Array) {
    if (key.length !== groupLen)
      throw new Error("Expected 32 bytes of private key");
    num = bytesToNumber(key);
  } else {
    throw new TypeError("Expected valid private key");
  }
  if (!isWithinCurveOrder(num))
    throw new Error("Expected private key: 0 < key < n");
  return num;
}
function normalizeSignature(signature) {
  if (signature instanceof Signature) {
    signature.assertValidity();
    return signature;
  }
  try {
    return Signature.fromDER(signature);
  } catch (error) {
    return Signature.fromCompact(signature);
  }
}
function bits2int(bytes2) {
  const slice = bytes2.length > fieldLen ? bytes2.slice(0, fieldLen) : bytes2;
  return bytesToNumber(slice);
}
function bits2octets(bytes2) {
  const z1 = bits2int(bytes2);
  const z2 = mod(z1, CURVE.n);
  return int2octets(z2 < _0n ? z1 : z2);
}
function int2octets(num) {
  return numTo32b(num);
}
function initSigArgs(msgHash, privateKey, extraEntropy) {
  if (msgHash == null)
    throw new Error(`sign: expected valid message hash, not "${msgHash}"`);
  const h1 = ensureBytes(msgHash);
  const d = normalizePrivateKey(privateKey);
  const seedArgs = [int2octets(d), bits2octets(h1)];
  if (extraEntropy != null) {
    if (extraEntropy === true)
      extraEntropy = utils.randomBytes(fieldLen);
    const e = ensureBytes(extraEntropy);
    if (e.length !== fieldLen)
      throw new Error(`sign: Expected ${fieldLen} bytes of extra data`);
    seedArgs.push(e);
  }
  const seed = concatBytes2(...seedArgs);
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
var nodeCrypto, _0n, _1n, _2n, _3n, _8n, CURVE, divNearest, endo, fieldLen, groupLen, hashLen, compressedLen, uncompressedLen, USE_ENDOMORPHISM, ShaError, JacobianPoint, pointPrecomputes, Point, Signature, hexes3, POW_2_256, _sha256Sync, _hmacSha256Sync, HmacDrbg, crypto3, TAGGED_HASH_PREFIXES, utils;
var init_esm2 = __esm({
  "../node_modules/@noble/secp256k1/lib/esm/index.js"() {
    init_functionsRoutes_0_03405564948503348();
    nodeCrypto = __toESM(require_crypto(), 1);
    _0n = BigInt(0);
    _1n = BigInt(1);
    _2n = BigInt(2);
    _3n = BigInt(3);
    _8n = BigInt(8);
    CURVE = Object.freeze({
      a: _0n,
      b: BigInt(7),
      P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
      n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
      h: _1n,
      Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
      Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
    });
    divNearest = /* @__PURE__ */ __name((a, b) => (a + b / _2n) / b, "divNearest");
    endo = {
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
      splitScalar(k) {
        const { n } = CURVE;
        const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
        const b1 = -_1n * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
        const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
        const b2 = a1;
        const POW_2_128 = BigInt("0x100000000000000000000000000000000");
        const c1 = divNearest(b2 * k, n);
        const c2 = divNearest(-b1 * k, n);
        let k1 = mod(k - c1 * a1 - c2 * a2, n);
        let k2 = mod(-c1 * b1 - c2 * b2, n);
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
    fieldLen = 32;
    groupLen = 32;
    hashLen = 32;
    compressedLen = fieldLen + 1;
    uncompressedLen = 2 * fieldLen + 1;
    __name(weierstrass, "weierstrass");
    USE_ENDOMORPHISM = CURVE.a === _0n;
    ShaError = class extends Error {
      static {
        __name(this, "ShaError");
      }
      constructor(message) {
        super(message);
      }
    };
    __name(assertJacPoint, "assertJacPoint");
    JacobianPoint = class _JacobianPoint {
      static {
        __name(this, "JacobianPoint");
      }
      constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
      static fromAffine(p) {
        if (!(p instanceof Point)) {
          throw new TypeError("JacobianPoint#fromAffine: expected Point");
        }
        if (p.equals(Point.ZERO))
          return _JacobianPoint.ZERO;
        return new _JacobianPoint(p.x, p.y, _1n);
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
        const Z1Z1 = mod(Z1 * Z1);
        const Z2Z2 = mod(Z2 * Z2);
        const U1 = mod(X1 * Z2Z2);
        const U2 = mod(X2 * Z1Z1);
        const S1 = mod(mod(Y1 * Z2) * Z2Z2);
        const S2 = mod(mod(Y2 * Z1) * Z1Z1);
        return U1 === U2 && S1 === S2;
      }
      negate() {
        return new _JacobianPoint(this.x, mod(-this.y), this.z);
      }
      double() {
        const { x: X1, y: Y1, z: Z1 } = this;
        const A = mod(X1 * X1);
        const B = mod(Y1 * Y1);
        const C = mod(B * B);
        const x1b = X1 + B;
        const D = mod(_2n * (mod(x1b * x1b) - A - C));
        const E = mod(_3n * A);
        const F = mod(E * E);
        const X3 = mod(F - _2n * D);
        const Y3 = mod(E * (D - X3) - _8n * C);
        const Z3 = mod(_2n * Y1 * Z1);
        return new _JacobianPoint(X3, Y3, Z3);
      }
      add(other) {
        assertJacPoint(other);
        const { x: X1, y: Y1, z: Z1 } = this;
        const { x: X2, y: Y2, z: Z2 } = other;
        if (X2 === _0n || Y2 === _0n)
          return this;
        if (X1 === _0n || Y1 === _0n)
          return other;
        const Z1Z1 = mod(Z1 * Z1);
        const Z2Z2 = mod(Z2 * Z2);
        const U1 = mod(X1 * Z2Z2);
        const U2 = mod(X2 * Z1Z1);
        const S1 = mod(mod(Y1 * Z2) * Z2Z2);
        const S2 = mod(mod(Y2 * Z1) * Z1Z1);
        const H = mod(U2 - U1);
        const r = mod(S2 - S1);
        if (H === _0n) {
          if (r === _0n) {
            return this.double();
          } else {
            return _JacobianPoint.ZERO;
          }
        }
        const HH = mod(H * H);
        const HHH = mod(H * HH);
        const V = mod(U1 * HH);
        const X3 = mod(r * r - HHH - _2n * V);
        const Y3 = mod(r * (V - X3) - S1 * HHH);
        const Z3 = mod(Z1 * Z2 * H);
        return new _JacobianPoint(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      multiplyUnsafe(scalar) {
        const P0 = _JacobianPoint.ZERO;
        if (typeof scalar === "bigint" && scalar === _0n)
          return P0;
        let n = normalizeScalar(scalar);
        if (n === _1n)
          return this;
        if (!USE_ENDOMORPHISM) {
          let p = P0;
          let d2 = this;
          while (n > _0n) {
            if (n & _1n)
              p = p.add(d2);
            d2 = d2.double();
            n >>= _1n;
          }
          return p;
        }
        let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
        let k1p = P0;
        let k2p = P0;
        let d = this;
        while (k1 > _0n || k2 > _0n) {
          if (k1 & _1n)
            k1p = k1p.add(d);
          if (k2 & _1n)
            k2p = k2p.add(d);
          d = d.double();
          k1 >>= _1n;
          k2 >>= _1n;
        }
        if (k1neg)
          k1p = k1p.negate();
        if (k2neg)
          k2p = k2p.negate();
        k2p = new _JacobianPoint(mod(k2p.x * endo.beta), k2p.y, k2p.z);
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
          affinePoint = Point.BASE;
        const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
        if (256 % W) {
          throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
        }
        let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
        if (!precomputes) {
          precomputes = this.precomputeWindow(W);
          if (affinePoint && W !== 1) {
            precomputes = _JacobianPoint.normalizeZ(precomputes);
            pointPrecomputes.set(affinePoint, precomputes);
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
            n += _1n;
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
          k2p = new _JacobianPoint(mod(k2p.x * endo.beta), k2p.y, k2p.z);
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
          invZ = is0 ? _8n : invert(z);
        const iz1 = invZ;
        const iz2 = mod(iz1 * iz1);
        const iz3 = mod(iz2 * iz1);
        const ax = mod(x * iz2);
        const ay = mod(y * iz3);
        const zz = mod(z * iz1);
        if (is0)
          return Point.ZERO;
        if (zz !== _1n)
          throw new Error("invZ was invalid");
        return new Point(ax, ay);
      }
    };
    JacobianPoint.BASE = new JacobianPoint(CURVE.Gx, CURVE.Gy, _1n);
    JacobianPoint.ZERO = new JacobianPoint(_0n, _1n, _0n);
    __name(constTimeNegate, "constTimeNegate");
    pointPrecomputes = /* @__PURE__ */ new WeakMap();
    Point = class _Point {
      static {
        __name(this, "Point");
      }
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      _setWindowSize(windowSize) {
        this._WINDOW_SIZE = windowSize;
        pointPrecomputes.delete(this);
      }
      hasEvenY() {
        return this.y % _2n === _0n;
      }
      static fromCompressedHex(bytes2) {
        const isShort = bytes2.length === 32;
        const x = bytesToNumber(isShort ? bytes2 : bytes2.subarray(1));
        if (!isValidFieldElement(x))
          throw new Error("Point is not on curve");
        const y2 = weierstrass(x);
        let y = sqrtMod(y2);
        const isYOdd = (y & _1n) === _1n;
        if (isShort) {
          if (isYOdd)
            y = mod(-y);
        } else {
          const isFirstByteOdd = (bytes2[0] & 1) === 1;
          if (isFirstByteOdd !== isYOdd)
            y = mod(-y);
        }
        const point = new _Point(x, y);
        point.assertValidity();
        return point;
      }
      static fromUncompressedHex(bytes2) {
        const x = bytesToNumber(bytes2.subarray(1, fieldLen + 1));
        const y = bytesToNumber(bytes2.subarray(fieldLen + 1, fieldLen * 2 + 1));
        const point = new _Point(x, y);
        point.assertValidity();
        return point;
      }
      static fromHex(hex) {
        const bytes2 = ensureBytes(hex);
        const len = bytes2.length;
        const header = bytes2[0];
        if (len === fieldLen)
          return this.fromCompressedHex(bytes2);
        if (len === compressedLen && (header === 2 || header === 3)) {
          return this.fromCompressedHex(bytes2);
        }
        if (len === uncompressedLen && header === 4)
          return this.fromUncompressedHex(bytes2);
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
        const rinv = invert(radj, n);
        const u1 = mod(-h * rinv, n);
        const u2 = mod(s * rinv, n);
        const prefix = recovery & 1 ? "03" : "02";
        const R = _Point.fromHex(prefix + numTo32bStr(radj));
        const Q = _Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
        if (!Q)
          throw new Error("Cannot recover signature: point at infinify");
        Q.assertValidity();
        return Q;
      }
      toRawBytes(isCompressed = false) {
        return hexToBytes2(this.toHex(isCompressed));
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
        const left = mod(y * y);
        const right = weierstrass(x);
        if (mod(left - right) !== _0n)
          throw new Error(msg);
      }
      equals(other) {
        return this.x === other.x && this.y === other.y;
      }
      negate() {
        return new _Point(this.x, mod(-this.y));
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
        const aP = a === _0n || a === _1n || this !== _Point.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
        const bQ = JacobianPoint.fromAffine(Q).multiplyUnsafe(b);
        const sum = aP.add(bQ);
        return sum.equals(JacobianPoint.ZERO) ? void 0 : sum.toAffine();
      }
    };
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
    Point.ZERO = new Point(_0n, _0n);
    __name(sliceDER, "sliceDER");
    __name(parseDERInt, "parseDERInt");
    __name(parseDERSignature, "parseDERSignature");
    Signature = class _Signature {
      static {
        __name(this, "Signature");
      }
      constructor(r, s) {
        this.r = r;
        this.s = s;
        this.assertValidity();
      }
      static fromCompact(hex) {
        const arr = hex instanceof Uint8Array;
        const name = "Signature.fromCompact";
        if (typeof hex !== "string" && !arr)
          throw new TypeError(`${name}: Expected string or Uint8Array`);
        const str = arr ? bytesToHex2(hex) : hex;
        if (str.length !== 128)
          throw new Error(`${name}: Expected 64-byte hex`);
        return new _Signature(hexToNumber(str.slice(0, 64)), hexToNumber(str.slice(64, 128)));
      }
      static fromDER(hex) {
        const arr = hex instanceof Uint8Array;
        if (typeof hex !== "string" && !arr)
          throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
        const { r, s } = parseDERSignature(arr ? hex : hexToBytes2(hex));
        return new _Signature(r, s);
      }
      static fromHex(hex) {
        return this.fromDER(hex);
      }
      assertValidity() {
        const { r, s } = this;
        if (!isWithinCurveOrder(r))
          throw new Error("Invalid Signature: r must be 0 < r < n");
        if (!isWithinCurveOrder(s))
          throw new Error("Invalid Signature: s must be 0 < s < n");
      }
      hasHighS() {
        const HALF = CURVE.n >> _1n;
        return this.s > HALF;
      }
      normalizeS() {
        return this.hasHighS() ? new _Signature(this.r, mod(-this.s, CURVE.n)) : this;
      }
      toDERRawBytes() {
        return hexToBytes2(this.toDERHex());
      }
      toDERHex() {
        const sHex = sliceDER(numberToHexUnpadded(this.s));
        const rHex = sliceDER(numberToHexUnpadded(this.r));
        const sHexL = sHex.length / 2;
        const rHexL = rHex.length / 2;
        const sLen = numberToHexUnpadded(sHexL);
        const rLen = numberToHexUnpadded(rHexL);
        const length = numberToHexUnpadded(rHexL + sHexL + 4);
        return `30${length}02${rLen}${rHex}02${sLen}${sHex}`;
      }
      toRawBytes() {
        return this.toDERRawBytes();
      }
      toHex() {
        return this.toDERHex();
      }
      toCompactRawBytes() {
        return hexToBytes2(this.toCompactHex());
      }
      toCompactHex() {
        return numTo32bStr(this.r) + numTo32bStr(this.s);
      }
    };
    __name(concatBytes2, "concatBytes");
    hexes3 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
    __name(bytesToHex2, "bytesToHex");
    POW_2_256 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
    __name(numTo32bStr, "numTo32bStr");
    __name(numTo32b, "numTo32b");
    __name(numberToHexUnpadded, "numberToHexUnpadded");
    __name(hexToNumber, "hexToNumber");
    __name(hexToBytes2, "hexToBytes");
    __name(bytesToNumber, "bytesToNumber");
    __name(ensureBytes, "ensureBytes");
    __name(normalizeScalar, "normalizeScalar");
    __name(mod, "mod");
    __name(pow2, "pow2");
    __name(sqrtMod, "sqrtMod");
    __name(invert, "invert");
    __name(invertBatch, "invertBatch");
    __name(bits2int_2, "bits2int_2");
    __name(truncateHash, "truncateHash");
    HmacDrbg = class {
      static {
        __name(this, "HmacDrbg");
      }
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
        return utils.hmacSha256(this.k, ...values);
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
        return concatBytes2(...out);
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
        return concatBytes2(...out);
      }
    };
    __name(isWithinCurveOrder, "isWithinCurveOrder");
    __name(isValidFieldElement, "isValidFieldElement");
    __name(kmdToSig, "kmdToSig");
    __name(normalizePrivateKey, "normalizePrivateKey");
    __name(normalizeSignature, "normalizeSignature");
    __name(bits2int, "bits2int");
    __name(bits2octets, "bits2octets");
    __name(int2octets, "int2octets");
    __name(initSigArgs, "initSigArgs");
    __name(finalizeSig, "finalizeSig");
    __name(signSync, "signSync");
    Point.BASE._setWindowSize(8);
    crypto3 = {
      node: nodeCrypto,
      web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
    };
    TAGGED_HASH_PREFIXES = {};
    utils = {
      bytesToHex: bytesToHex2,
      hexToBytes: hexToBytes2,
      concatBytes: concatBytes2,
      mod,
      invert,
      isValidPrivateKey(privateKey) {
        try {
          normalizePrivateKey(privateKey);
          return true;
        } catch (error) {
          return false;
        }
      },
      _bigintTo32Bytes: numTo32b,
      _normalizePrivateKey: normalizePrivateKey,
      hashToPrivateKey: /* @__PURE__ */ __name((hash2) => {
        hash2 = ensureBytes(hash2);
        const minLen = groupLen + 8;
        if (hash2.length < minLen || hash2.length > 1024) {
          throw new Error(`Expected valid bytes of private key as per FIPS 186`);
        }
        const num = mod(bytesToNumber(hash2), CURVE.n - _1n) + _1n;
        return numTo32b(num);
      }, "hashToPrivateKey"),
      randomBytes: /* @__PURE__ */ __name((bytesLength = 32) => {
        if (crypto3.web) {
          return crypto3.web.getRandomValues(new Uint8Array(bytesLength));
        } else if (crypto3.node) {
          const { randomBytes } = crypto3.node;
          return Uint8Array.from(randomBytes(bytesLength));
        } else {
          throw new Error("The environment doesn't have randomBytes function");
        }
      }, "randomBytes"),
      randomPrivateKey: /* @__PURE__ */ __name(() => utils.hashToPrivateKey(utils.randomBytes(groupLen + 8)), "randomPrivateKey"),
      precompute(windowSize = 8, point = Point.BASE) {
        const cached = point === Point.BASE ? point : new Point(point.x, point.y);
        cached._setWindowSize(windowSize);
        cached.multiply(_3n);
        return cached;
      },
      sha256: /* @__PURE__ */ __name(async (...messages) => {
        if (crypto3.web) {
          const buffer = await crypto3.web.subtle.digest("SHA-256", concatBytes2(...messages));
          return new Uint8Array(buffer);
        } else if (crypto3.node) {
          const { createHash } = crypto3.node;
          const hash2 = createHash("sha256");
          messages.forEach((m) => hash2.update(m));
          return Uint8Array.from(hash2.digest());
        } else {
          throw new Error("The environment doesn't have sha256 function");
        }
      }, "sha256"),
      hmacSha256: /* @__PURE__ */ __name(async (key, ...messages) => {
        if (crypto3.web) {
          const ckey = await crypto3.web.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
          const message = concatBytes2(...messages);
          const buffer = await crypto3.web.subtle.sign("HMAC", ckey, message);
          return new Uint8Array(buffer);
        } else if (crypto3.node) {
          const { createHmac } = crypto3.node;
          const hash2 = createHmac("sha256", key);
          messages.forEach((m) => hash2.update(m));
          return Uint8Array.from(hash2.digest());
        } else {
          throw new Error("The environment doesn't have hmac-sha256 function");
        }
      }, "hmacSha256"),
      sha256Sync: void 0,
      hmacSha256Sync: void 0,
      taggedHash: /* @__PURE__ */ __name(async (tag, ...messages) => {
        let tagP = TAGGED_HASH_PREFIXES[tag];
        if (tagP === void 0) {
          const tagH = await utils.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
          tagP = concatBytes2(tagH, tagH);
          TAGGED_HASH_PREFIXES[tag] = tagP;
        }
        return utils.sha256(tagP, ...messages);
      }, "taggedHash"),
      taggedHashSync: /* @__PURE__ */ __name((tag, ...messages) => {
        if (typeof _sha256Sync !== "function")
          throw new ShaError("sha256Sync is undefined, you need to set it");
        let tagP = TAGGED_HASH_PREFIXES[tag];
        if (tagP === void 0) {
          const tagH = _sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
          tagP = concatBytes2(tagH, tagH);
          TAGGED_HASH_PREFIXES[tag] = tagP;
        }
        return _sha256Sync(tagP, ...messages);
      }, "taggedHashSync"),
      _JacobianPoint: JacobianPoint
    };
    Object.defineProperties(utils, {
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
  }
});

// ../node_modules/@noble/hashes/crypto.js
var require_crypto2 = __commonJS({
  "../node_modules/@noble/hashes/crypto.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crypto = void 0;
    exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  }
});

// ../node_modules/@noble/hashes/utils.js
var require_utils = __commonJS({
  "../node_modules/@noble/hashes/utils.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.Hash = exports.nextTick = exports.swap32IfBE = exports.byteSwapIfBE = exports.swap8IfBE = exports.isLE = void 0;
    exports.isBytes = isBytes2;
    exports.anumber = anumber;
    exports.abytes = abytes2;
    exports.ahash = ahash;
    exports.aexists = aexists2;
    exports.aoutput = aoutput2;
    exports.u8 = u8;
    exports.u32 = u32;
    exports.clean = clean2;
    exports.createView = createView3;
    exports.rotr = rotr3;
    exports.rotl = rotl2;
    exports.byteSwap = byteSwap;
    exports.byteSwap32 = byteSwap32;
    exports.bytesToHex = bytesToHex5;
    exports.hexToBytes = hexToBytes4;
    exports.asyncLoop = asyncLoop;
    exports.utf8ToBytes = utf8ToBytes4;
    exports.bytesToUtf8 = bytesToUtf82;
    exports.toBytes = toBytes3;
    exports.kdfInputToBytes = kdfInputToBytes;
    exports.concatBytes = concatBytes4;
    exports.checkOpts = checkOpts;
    exports.createHasher = createHasher2;
    exports.createOptHasher = createOptHasher;
    exports.createXOFer = createXOFer;
    exports.randomBytes = randomBytes;
    var crypto_1 = require_crypto2();
    function isBytes2(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    __name(isBytes2, "isBytes");
    function anumber(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error("positive integer expected, got " + n);
    }
    __name(anumber, "anumber");
    function abytes2(b, ...lengths) {
      if (!isBytes2(b))
        throw new Error("Uint8Array expected");
      if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
    }
    __name(abytes2, "abytes");
    function ahash(h) {
      if (typeof h !== "function" || typeof h.create !== "function")
        throw new Error("Hash should be wrapped by utils.createHasher");
      anumber(h.outputLen);
      anumber(h.blockLen);
    }
    __name(ahash, "ahash");
    function aexists2(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    __name(aexists2, "aexists");
    function aoutput2(out, instance) {
      abytes2(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error("digestInto() expects output buffer of length at least " + min);
      }
    }
    __name(aoutput2, "aoutput");
    function u8(arr) {
      return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    __name(u8, "u8");
    function u32(arr) {
      return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    }
    __name(u32, "u32");
    function clean2(...arrays) {
      for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
      }
    }
    __name(clean2, "clean");
    function createView3(arr) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    __name(createView3, "createView");
    function rotr3(word, shift) {
      return word << 32 - shift | word >>> shift;
    }
    __name(rotr3, "rotr");
    function rotl2(word, shift) {
      return word << shift | word >>> 32 - shift >>> 0;
    }
    __name(rotl2, "rotl");
    exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    function byteSwap(word) {
      return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    }
    __name(byteSwap, "byteSwap");
    exports.swap8IfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
    exports.byteSwapIfBE = exports.swap8IfBE;
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
      }
      return arr;
    }
    __name(byteSwap32, "byteSwap32");
    exports.swap32IfBE = exports.isLE ? (u) => u : byteSwap32;
    var hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    var hexes4 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex5(bytes2) {
      abytes2(bytes2);
      if (hasHexBuiltin)
        return bytes2.toHex();
      let hex = "";
      for (let i = 0; i < bytes2.length; i++) {
        hex += hexes4[bytes2[i]];
      }
      return hex;
    }
    __name(bytesToHex5, "bytesToHex");
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
    __name(asciiToBase16, "asciiToBase16");
    function hexToBytes4(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      if (hasHexBuiltin)
        return Uint8Array.fromHex(hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    __name(hexToBytes4, "hexToBytes");
    var nextTick = /* @__PURE__ */ __name(async () => {
    }, "nextTick");
    exports.nextTick = nextTick;
    async function asyncLoop(iters, tick, cb) {
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
    __name(asyncLoop, "asyncLoop");
    function utf8ToBytes4(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    __name(utf8ToBytes4, "utf8ToBytes");
    function bytesToUtf82(bytes2) {
      return new TextDecoder().decode(bytes2);
    }
    __name(bytesToUtf82, "bytesToUtf8");
    function toBytes3(data) {
      if (typeof data === "string")
        data = utf8ToBytes4(data);
      abytes2(data);
      return data;
    }
    __name(toBytes3, "toBytes");
    function kdfInputToBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes4(data);
      abytes2(data);
      return data;
    }
    __name(kdfInputToBytes, "kdfInputToBytes");
    function concatBytes4(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes2(a);
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
    __name(concatBytes4, "concatBytes");
    function checkOpts(defaults, opts) {
      if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
        throw new Error("options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    __name(checkOpts, "checkOpts");
    var Hash3 = class {
      static {
        __name(this, "Hash");
      }
    };
    exports.Hash = Hash3;
    function createHasher2(hashCons) {
      const hashC = /* @__PURE__ */ __name((msg) => hashCons().update(toBytes3(msg)).digest(), "hashC");
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    __name(createHasher2, "createHasher");
    function createOptHasher(hashCons) {
      const hashC = /* @__PURE__ */ __name((msg, opts) => hashCons(opts).update(toBytes3(msg)).digest(), "hashC");
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    __name(createOptHasher, "createOptHasher");
    function createXOFer(hashCons) {
      const hashC = /* @__PURE__ */ __name((msg, opts) => hashCons(opts).update(toBytes3(msg)).digest(), "hashC");
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    __name(createXOFer, "createXOFer");
    exports.wrapConstructor = createHasher2;
    exports.wrapConstructorWithOpts = createOptHasher;
    exports.wrapXOFConstructorWithOpts = createXOFer;
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
    __name(randomBytes, "randomBytes");
  }
});

// ../node_modules/c32check/lib/encoding.js
var require_encoding = __commonJS({
  "../node_modules/c32check/lib/encoding.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.c32decode = exports.c32normalize = exports.c32encode = exports.c32 = void 0;
    var utils_1 = require_utils();
    exports.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    var hex = "0123456789abcdef";
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
          const currentCode = hex.indexOf(inputHex[i]) >> carry;
          let nextCode = 0;
          if (i !== 0) {
            nextCode = hex.indexOf(inputHex[i - 1]);
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
    __name(c32encode, "c32encode");
    exports.c32encode = c32encode;
    function c32normalize(c32input) {
      return c32input.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
    }
    __name(c32normalize, "c32normalize");
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
          res.unshift(hex[carry]);
          carryBits = 0;
          carry = 0;
        }
        const currentCode = exports.c32.indexOf(c32input[i]) << carryBits;
        const currentValue = currentCode + carry;
        const currentHexDigit = hex[currentValue % 16];
        carryBits += 1;
        carry = currentValue >> 4;
        if (carry > 1 << carryBits) {
          throw new Error("Panic error in decoding.");
        }
        res.unshift(currentHexDigit);
      }
      res.unshift(hex[carry]);
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
    __name(c32decode, "c32decode");
    exports.c32decode = c32decode;
  }
});

// ../node_modules/@noble/hashes/_md.js
var require_md = __commonJS({
  "../node_modules/@noble/hashes/_md.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SHA512_IV = exports.SHA384_IV = exports.SHA224_IV = exports.SHA256_IV = exports.HashMD = void 0;
    exports.setBigUint64 = setBigUint643;
    exports.Chi = Chi3;
    exports.Maj = Maj3;
    var utils_ts_1 = require_utils();
    function setBigUint643(view, byteOffset, value, isLE2) {
      if (typeof view.setBigUint64 === "function")
        return view.setBigUint64(byteOffset, value, isLE2);
      const _32n2 = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n2 & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE2 ? 4 : 0;
      const l = isLE2 ? 0 : 4;
      view.setUint32(byteOffset + h, wh, isLE2);
      view.setUint32(byteOffset + l, wl, isLE2);
    }
    __name(setBigUint643, "setBigUint64");
    function Chi3(a, b, c) {
      return a & b ^ ~a & c;
    }
    __name(Chi3, "Chi");
    function Maj3(a, b, c) {
      return a & b ^ a & c ^ b & c;
    }
    __name(Maj3, "Maj");
    var HashMD2 = class extends utils_ts_1.Hash {
      static {
        __name(this, "HashMD");
      }
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
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = (0, utils_ts_1.createView)(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
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
        const { buffer, view, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        (0, utils_ts_1.clean)(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint643(view, blockLen - 8, BigInt(this.length * 8), isLE2);
        this.process(view, 0);
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
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer);
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

// ../node_modules/@noble/hashes/_u64.js
var require_u64 = __commonJS({
  "../node_modules/@noble/hashes/_u64.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toBig = exports.shrSL = exports.shrSH = exports.rotrSL = exports.rotrSH = exports.rotrBL = exports.rotrBH = exports.rotr32L = exports.rotr32H = exports.rotlSL = exports.rotlSH = exports.rotlBL = exports.rotlBH = exports.add5L = exports.add5H = exports.add4L = exports.add4H = exports.add3L = exports.add3H = void 0;
    exports.add = add2;
    exports.fromBig = fromBig2;
    exports.split = split2;
    var U32_MASK642 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    var _32n2 = /* @__PURE__ */ BigInt(32);
    function fromBig2(n, le = false) {
      if (le)
        return { h: Number(n & U32_MASK642), l: Number(n >> _32n2 & U32_MASK642) };
      return { h: Number(n >> _32n2 & U32_MASK642) | 0, l: Number(n & U32_MASK642) | 0 };
    }
    __name(fromBig2, "fromBig");
    function split2(lst, le = false) {
      const len = lst.length;
      let Ah = new Uint32Array(len);
      let Al = new Uint32Array(len);
      for (let i = 0; i < len; i++) {
        const { h, l } = fromBig2(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
      }
      return [Ah, Al];
    }
    __name(split2, "split");
    var toBig2 = /* @__PURE__ */ __name((h, l) => BigInt(h >>> 0) << _32n2 | BigInt(l >>> 0), "toBig");
    exports.toBig = toBig2;
    var shrSH2 = /* @__PURE__ */ __name((h, _l, s) => h >>> s, "shrSH");
    exports.shrSH = shrSH2;
    var shrSL2 = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "shrSL");
    exports.shrSL = shrSL2;
    var rotrSH2 = /* @__PURE__ */ __name((h, l, s) => h >>> s | l << 32 - s, "rotrSH");
    exports.rotrSH = rotrSH2;
    var rotrSL2 = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "rotrSL");
    exports.rotrSL = rotrSL2;
    var rotrBH2 = /* @__PURE__ */ __name((h, l, s) => h << 64 - s | l >>> s - 32, "rotrBH");
    exports.rotrBH = rotrBH2;
    var rotrBL2 = /* @__PURE__ */ __name((h, l, s) => h >>> s - 32 | l << 64 - s, "rotrBL");
    exports.rotrBL = rotrBL2;
    var rotr32H2 = /* @__PURE__ */ __name((_h, l) => l, "rotr32H");
    exports.rotr32H = rotr32H2;
    var rotr32L2 = /* @__PURE__ */ __name((h, _l) => h, "rotr32L");
    exports.rotr32L = rotr32L2;
    var rotlSH2 = /* @__PURE__ */ __name((h, l, s) => h << s | l >>> 32 - s, "rotlSH");
    exports.rotlSH = rotlSH2;
    var rotlSL2 = /* @__PURE__ */ __name((h, l, s) => l << s | h >>> 32 - s, "rotlSL");
    exports.rotlSL = rotlSL2;
    var rotlBH2 = /* @__PURE__ */ __name((h, l, s) => l << s - 32 | h >>> 64 - s, "rotlBH");
    exports.rotlBH = rotlBH2;
    var rotlBL2 = /* @__PURE__ */ __name((h, l, s) => h << s - 32 | l >>> 64 - s, "rotlBL");
    exports.rotlBL = rotlBL2;
    function add2(Ah, Al, Bh, Bl) {
      const l = (Al >>> 0) + (Bl >>> 0);
      return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
    }
    __name(add2, "add");
    var add3L2 = /* @__PURE__ */ __name((Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0), "add3L");
    exports.add3L = add3L2;
    var add3H2 = /* @__PURE__ */ __name((low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0, "add3H");
    exports.add3H = add3H2;
    var add4L2 = /* @__PURE__ */ __name((Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0), "add4L");
    exports.add4L = add4L2;
    var add4H2 = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0, "add4H");
    exports.add4H = add4H2;
    var add5L2 = /* @__PURE__ */ __name((Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0), "add5L");
    exports.add5L = add5L2;
    var add5H2 = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0, "add5H");
    exports.add5H = add5H2;
    var u642 = {
      fromBig: fromBig2,
      split: split2,
      toBig: toBig2,
      shrSH: shrSH2,
      shrSL: shrSL2,
      rotrSH: rotrSH2,
      rotrSL: rotrSL2,
      rotrBH: rotrBH2,
      rotrBL: rotrBL2,
      rotr32H: rotr32H2,
      rotr32L: rotr32L2,
      rotlSH: rotlSH2,
      rotlSL: rotlSL2,
      rotlBH: rotlBH2,
      rotlBL: rotlBL2,
      add: add2,
      add3L: add3L2,
      add3H: add3H2,
      add4L: add4L2,
      add4H: add4H2,
      add5H: add5H2,
      add5L: add5L2
    };
    exports.default = u642;
  }
});

// ../node_modules/@noble/hashes/sha2.js
var require_sha2 = __commonJS({
  "../node_modules/@noble/hashes/sha2.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
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
    var SHA2563 = class extends _md_ts_1.HashMD {
      static {
        __name(this, "SHA256");
      }
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
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W3[i] = view.getUint32(offset, false);
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
    exports.SHA256 = SHA2563;
    var SHA2243 = class extends SHA2563 {
      static {
        __name(this, "SHA224");
      }
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
    exports.SHA224 = SHA2243;
    var K512 = /* @__PURE__ */ (() => u642.split([
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
    var SHA512_Kh2 = /* @__PURE__ */ (() => K512[0])();
    var SHA512_Kl2 = /* @__PURE__ */ (() => K512[1])();
    var SHA512_W_H2 = /* @__PURE__ */ new Uint32Array(80);
    var SHA512_W_L2 = /* @__PURE__ */ new Uint32Array(80);
    var SHA5122 = class extends _md_ts_1.HashMD {
      static {
        __name(this, "SHA512");
      }
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
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H2[i] = view.getUint32(offset);
          SHA512_W_L2[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H2[i - 15] | 0;
          const W15l = SHA512_W_L2[i - 15] | 0;
          const s0h = u642.rotrSH(W15h, W15l, 1) ^ u642.rotrSH(W15h, W15l, 8) ^ u642.shrSH(W15h, W15l, 7);
          const s0l = u642.rotrSL(W15h, W15l, 1) ^ u642.rotrSL(W15h, W15l, 8) ^ u642.shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H2[i - 2] | 0;
          const W2l = SHA512_W_L2[i - 2] | 0;
          const s1h = u642.rotrSH(W2h, W2l, 19) ^ u642.rotrBH(W2h, W2l, 61) ^ u642.shrSH(W2h, W2l, 6);
          const s1l = u642.rotrSL(W2h, W2l, 19) ^ u642.rotrBL(W2h, W2l, 61) ^ u642.shrSL(W2h, W2l, 6);
          const SUMl = u642.add4L(s0l, s1l, SHA512_W_L2[i - 7], SHA512_W_L2[i - 16]);
          const SUMh = u642.add4H(SUMl, s0h, s1h, SHA512_W_H2[i - 7], SHA512_W_H2[i - 16]);
          SHA512_W_H2[i] = SUMh | 0;
          SHA512_W_L2[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = u642.rotrSH(Eh, El, 14) ^ u642.rotrSH(Eh, El, 18) ^ u642.rotrBH(Eh, El, 41);
          const sigma1l = u642.rotrSL(Eh, El, 14) ^ u642.rotrSL(Eh, El, 18) ^ u642.rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = u642.add5L(Hl, sigma1l, CHIl, SHA512_Kl2[i], SHA512_W_L2[i]);
          const T1h = u642.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh2[i], SHA512_W_H2[i]);
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
        (0, utils_ts_1.clean)(SHA512_W_H2, SHA512_W_L2);
      }
      destroy() {
        (0, utils_ts_1.clean)(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    exports.SHA512 = SHA5122;
    var SHA3842 = class extends SHA5122 {
      static {
        __name(this, "SHA384");
      }
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
      static {
        __name(this, "SHA512_224");
      }
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
      static {
        __name(this, "SHA512_256");
      }
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
    exports.sha256 = (0, utils_ts_1.createHasher)(() => new SHA2563());
    exports.sha224 = (0, utils_ts_1.createHasher)(() => new SHA2243());
    exports.sha512 = (0, utils_ts_1.createHasher)(() => new SHA5122());
    exports.sha384 = (0, utils_ts_1.createHasher)(() => new SHA3842());
    exports.sha512_256 = (0, utils_ts_1.createHasher)(() => new SHA512_2562());
    exports.sha512_224 = (0, utils_ts_1.createHasher)(() => new SHA512_2242());
  }
});

// ../node_modules/@noble/hashes/sha256.js
var require_sha256 = __commonJS({
  "../node_modules/@noble/hashes/sha256.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha224 = exports.SHA224 = exports.sha256 = exports.SHA256 = void 0;
    var sha2_ts_1 = require_sha2();
    exports.SHA256 = sha2_ts_1.SHA256;
    exports.sha256 = sha2_ts_1.sha256;
    exports.SHA224 = sha2_ts_1.SHA224;
    exports.sha224 = sha2_ts_1.sha224;
  }
});

// ../node_modules/c32check/lib/checksum.js
var require_checksum = __commonJS({
  "../node_modules/c32check/lib/checksum.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.c32checkDecode = exports.c32checkEncode = void 0;
    var sha256_1 = require_sha256();
    var utils_1 = require_utils();
    var encoding_1 = require_encoding();
    function c32checksum(dataHex) {
      const dataHash = (0, sha256_1.sha256)((0, sha256_1.sha256)((0, utils_1.hexToBytes)(dataHex)));
      const checksum = (0, utils_1.bytesToHex)(dataHash.slice(0, 4));
      return checksum;
    }
    __name(c32checksum, "c32checksum");
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
    __name(c32checkEncode, "c32checkEncode");
    exports.c32checkEncode = c32checkEncode;
    function c32checkDecode(c32data) {
      c32data = (0, encoding_1.c32normalize)(c32data);
      const dataHex = (0, encoding_1.c32decode)(c32data.slice(1));
      const versionChar = c32data[0];
      const version = encoding_1.c32.indexOf(versionChar);
      const checksum = dataHex.slice(-8);
      let versionHex = version.toString(16);
      if (versionHex.length === 1) {
        versionHex = `0${versionHex}`;
      }
      if (c32checksum(`${versionHex}${dataHex.substring(0, dataHex.length - 8)}`) !== checksum) {
        throw new Error("Invalid c32check string: checksum mismatch");
      }
      return [version, dataHex.substring(0, dataHex.length - 8)];
    }
    __name(c32checkDecode, "c32checkDecode");
    exports.c32checkDecode = c32checkDecode;
  }
});

// ../node_modules/base-x/src/index.js
var require_src = __commonJS({
  "../node_modules/base-x/src/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
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
      __name(encode, "encode");
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
      __name(decodeUnsafe, "decodeUnsafe");
      function decode(string) {
        var buffer = decodeUnsafe(string);
        if (buffer) {
          return buffer;
        }
        throw new Error("Non-base" + BASE + " character");
      }
      __name(decode, "decode");
      return {
        encode,
        decodeUnsafe,
        decode
      };
    }
    __name(base, "base");
    module.exports = base;
  }
});

// ../node_modules/c32check/lib/base58check.js
var require_base58check = __commonJS({
  "../node_modules/c32check/lib/base58check.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
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
      const checksum = (0, sha256_1.sha256)((0, sha256_1.sha256)(new Uint8Array([...prefixBytes, ...dataBytes])));
      return basex(ALPHABET).encode([...prefixBytes, ...dataBytes, ...checksum.slice(0, 4)]);
    }
    __name(encode, "encode");
    exports.encode = encode;
    function decode(string) {
      const bytes2 = basex(ALPHABET).decode(string);
      const prefixBytes = bytes2.slice(0, 1);
      const dataBytes = bytes2.slice(1, -4);
      const checksum = (0, sha256_1.sha256)((0, sha256_1.sha256)(new Uint8Array([...prefixBytes, ...dataBytes])));
      bytes2.slice(-4).forEach((check, index) => {
        if (check !== checksum[index]) {
          throw new Error("Invalid checksum");
        }
      });
      return { prefix: prefixBytes, data: dataBytes };
    }
    __name(decode, "decode");
    exports.decode = decode;
  }
});

// ../node_modules/c32check/lib/address.js
var require_address = __commonJS({
  "../node_modules/c32check/lib/address.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.c32ToB58 = exports.b58ToC32 = exports.c32addressDecode = exports.c32address = exports.versions = void 0;
    var checksum_1 = require_checksum();
    var base58check = require_base58check();
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
    __name(c32address4, "c32address");
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
    __name(c32addressDecode3, "c32addressDecode");
    exports.c32addressDecode = c32addressDecode3;
    function b58ToC32(b58check, version = -1) {
      const addrInfo = base58check.decode(b58check);
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
    __name(b58ToC32, "b58ToC32");
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
      return base58check.encode(hash160String, prefix);
    }
    __name(c32ToB58, "c32ToB58");
    exports.c32ToB58 = c32ToB58;
  }
});

// ../node_modules/c32check/lib/index.js
var require_lib = __commonJS({
  "../node_modules/c32check/lib/index.js"(exports) {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.b58ToC32 = exports.c32ToB58 = exports.versions = exports.c32normalize = exports.c32addressDecode = exports.c32address = exports.c32checkDecode = exports.c32checkEncode = exports.c32decode = exports.c32encode = void 0;
    var encoding_1 = require_encoding();
    Object.defineProperty(exports, "c32encode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return encoding_1.c32encode;
    }, "get") });
    Object.defineProperty(exports, "c32decode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return encoding_1.c32decode;
    }, "get") });
    Object.defineProperty(exports, "c32normalize", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return encoding_1.c32normalize;
    }, "get") });
    var checksum_1 = require_checksum();
    Object.defineProperty(exports, "c32checkEncode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return checksum_1.c32checkEncode;
    }, "get") });
    Object.defineProperty(exports, "c32checkDecode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return checksum_1.c32checkDecode;
    }, "get") });
    var address_1 = require_address();
    Object.defineProperty(exports, "c32address", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return address_1.c32address;
    }, "get") });
    Object.defineProperty(exports, "c32addressDecode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return address_1.c32addressDecode;
    }, "get") });
    Object.defineProperty(exports, "c32ToB58", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return address_1.c32ToB58;
    }, "get") });
    Object.defineProperty(exports, "b58ToC32", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return address_1.b58ToC32;
    }, "get") });
    Object.defineProperty(exports, "versions", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return address_1.versions;
    }, "get") });
  }
});

// ../node_modules/lodash.clonedeep/index.js
var require_lodash = __commonJS({
  "../node_modules/lodash.clonedeep/index.js"(exports, module) {
    init_functionsRoutes_0_03405564948503348();
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
    __name(addMapEntry, "addMapEntry");
    function addSetEntry(set, value) {
      set.add(value);
      return set;
    }
    __name(addSetEntry, "addSetEntry");
    function arrayEach(array, iteratee) {
      var index = -1, length = array ? array.length : 0;
      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }
    __name(arrayEach, "arrayEach");
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    __name(arrayPush, "arrayPush");
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1, length = array ? array.length : 0;
      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    __name(arrayReduce, "arrayReduce");
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    __name(baseTimes, "baseTimes");
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    __name(getValue, "getValue");
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
    __name(isHostObject, "isHostObject");
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    __name(mapToArray, "mapToArray");
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    __name(overArg, "overArg");
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    __name(setToArray, "setToArray");
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
    function Hash3(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    __name(Hash3, "Hash");
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    __name(hashClear, "hashClear");
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    __name(hashDelete, "hashDelete");
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    __name(hashGet, "hashGet");
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    __name(hashHas, "hashHas");
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    __name(hashSet, "hashSet");
    Hash3.prototype.clear = hashClear;
    Hash3.prototype["delete"] = hashDelete;
    Hash3.prototype.get = hashGet;
    Hash3.prototype.has = hashHas;
    Hash3.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    __name(ListCache, "ListCache");
    function listCacheClear() {
      this.__data__ = [];
    }
    __name(listCacheClear, "listCacheClear");
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
    __name(listCacheDelete, "listCacheDelete");
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    __name(listCacheGet, "listCacheGet");
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    __name(listCacheHas, "listCacheHas");
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    __name(listCacheSet, "listCacheSet");
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
    __name(MapCache, "MapCache");
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash3(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash3()
      };
    }
    __name(mapCacheClear, "mapCacheClear");
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    __name(mapCacheDelete, "mapCacheDelete");
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    __name(mapCacheGet, "mapCacheGet");
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    __name(mapCacheHas, "mapCacheHas");
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    __name(mapCacheSet, "mapCacheSet");
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }
    __name(Stack, "Stack");
    function stackClear() {
      this.__data__ = new ListCache();
    }
    __name(stackClear, "stackClear");
    function stackDelete(key) {
      return this.__data__["delete"](key);
    }
    __name(stackDelete, "stackDelete");
    function stackGet(key) {
      return this.__data__.get(key);
    }
    __name(stackGet, "stackGet");
    function stackHas(key) {
      return this.__data__.has(key);
    }
    __name(stackHas, "stackHas");
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
    __name(stackSet, "stackSet");
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
    __name(arrayLikeKeys, "arrayLikeKeys");
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        object[key] = value;
      }
    }
    __name(assignValue, "assignValue");
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    __name(assocIndexOf, "assocIndexOf");
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }
    __name(baseAssign, "baseAssign");
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
    __name(baseClone, "baseClone");
    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }
    __name(baseCreate, "baseCreate");
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    __name(baseGetAllKeys, "baseGetAllKeys");
    function baseGetTag(value) {
      return objectToString.call(value);
    }
    __name(baseGetTag, "baseGetTag");
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    __name(baseIsNative, "baseIsNative");
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
    __name(baseKeys, "baseKeys");
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }
    __name(cloneBuffer, "cloneBuffer");
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
      return result;
    }
    __name(cloneArrayBuffer, "cloneArrayBuffer");
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }
    __name(cloneDataView, "cloneDataView");
    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor());
    }
    __name(cloneMap, "cloneMap");
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }
    __name(cloneRegExp, "cloneRegExp");
    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor());
    }
    __name(cloneSet, "cloneSet");
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }
    __name(cloneSymbol, "cloneSymbol");
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    __name(cloneTypedArray, "cloneTypedArray");
    function copyArray(source, array) {
      var index = -1, length = source.length;
      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }
    __name(copyArray, "copyArray");
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
    __name(copyObject, "copyObject");
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }
    __name(copySymbols, "copySymbols");
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    __name(getAllKeys, "getAllKeys");
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    __name(getMapData, "getMapData");
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    __name(getNative, "getNative");
    var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
    var getTag = baseGetTag;
    if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
      getTag = /* @__PURE__ */ __name(function(value) {
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
      }, "getTag");
    }
    function initCloneArray(array) {
      var length = array.length, result = array.constructor(length);
      if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }
    __name(initCloneArray, "initCloneArray");
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    __name(initCloneObject, "initCloneObject");
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
    __name(initCloneByTag, "initCloneByTag");
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    __name(isIndex, "isIndex");
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    __name(isKeyable, "isKeyable");
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    __name(isMasked, "isMasked");
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    __name(isPrototype, "isPrototype");
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
    __name(toSource, "toSource");
    function cloneDeep(value) {
      return baseClone(value, true, true);
    }
    __name(cloneDeep, "cloneDeep");
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    __name(eq, "eq");
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    __name(isArguments, "isArguments");
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    __name(isArrayLike, "isArrayLike");
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    __name(isArrayLikeObject, "isArrayLikeObject");
    var isBuffer = nativeIsBuffer || stubFalse;
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    __name(isFunction, "isFunction");
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    __name(isLength, "isLength");
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    __name(isObject, "isObject");
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    __name(keys, "keys");
    function stubArray() {
      return [];
    }
    __name(stubArray, "stubArray");
    function stubFalse() {
      return false;
    }
    __name(stubFalse, "stubFalse");
    module.exports = cloneDeep;
  }
});

// ../node_modules/@stacks/transactions/dist/esm/common.js
function createMessageSignature(signature) {
  const length = hexToBytes(signature).byteLength;
  if (length != RECOVERABLE_ECDSA_SIG_LENGTH_BYTES) {
    throw Error("Invalid signature");
  }
  return {
    type: StacksMessageType.MessageSignature,
    data: signature
  };
}
function addressToString(address) {
  return (0, import_c32check.c32address)(address.version, address.hash160);
}
var import_c32check;
var init_common = __esm({
  "../node_modules/@stacks/transactions/dist/esm/common.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_constants2();
    import_c32check = __toESM(require_lib());
    init_esm();
    __name(createMessageSignature, "createMessageSignature");
    __name(addressToString, "addressToString");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/postcondition-types.js
function createLPString(content, lengthPrefixBytes, maxLengthBytes) {
  const prefixLength = lengthPrefixBytes || 1;
  const maxLength = maxLengthBytes || MAX_STRING_LENGTH_BYTES;
  if (exceedsMaxLengthBytes(content, maxLength)) {
    throw new Error(`String length exceeds maximum bytes ${maxLength}`);
  }
  return {
    type: StacksMessageType.LengthPrefixedString,
    content,
    lengthPrefixBytes: prefixLength,
    maxLengthBytes: maxLength
  };
}
function createAddress(c32AddressString) {
  const addressData = (0, import_c32check2.c32addressDecode)(c32AddressString);
  return {
    type: StacksMessageType.Address,
    version: addressData[0],
    hash160: addressData[1]
  };
}
var import_c32check2;
var init_postcondition_types = __esm({
  "../node_modules/@stacks/transactions/dist/esm/postcondition-types.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_constants2();
    import_c32check2 = __toESM(require_lib());
    init_utils3();
    __name(createLPString, "createLPString");
    __name(createAddress, "createAddress");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/constants.js
var ClarityType;
var init_constants3 = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/constants.js"() {
    init_functionsRoutes_0_03405564948503348();
    (function(ClarityType2) {
      ClarityType2[ClarityType2["Int"] = 0] = "Int";
      ClarityType2[ClarityType2["UInt"] = 1] = "UInt";
      ClarityType2[ClarityType2["Buffer"] = 2] = "Buffer";
      ClarityType2[ClarityType2["BoolTrue"] = 3] = "BoolTrue";
      ClarityType2[ClarityType2["BoolFalse"] = 4] = "BoolFalse";
      ClarityType2[ClarityType2["PrincipalStandard"] = 5] = "PrincipalStandard";
      ClarityType2[ClarityType2["PrincipalContract"] = 6] = "PrincipalContract";
      ClarityType2[ClarityType2["ResponseOk"] = 7] = "ResponseOk";
      ClarityType2[ClarityType2["ResponseErr"] = 8] = "ResponseErr";
      ClarityType2[ClarityType2["OptionalNone"] = 9] = "OptionalNone";
      ClarityType2[ClarityType2["OptionalSome"] = 10] = "OptionalSome";
      ClarityType2[ClarityType2["List"] = 11] = "List";
      ClarityType2[ClarityType2["Tuple"] = 12] = "Tuple";
      ClarityType2[ClarityType2["StringASCII"] = 13] = "StringASCII";
      ClarityType2[ClarityType2["StringUTF8"] = 14] = "StringUTF8";
    })(ClarityType || (ClarityType = {}));
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/types/principalCV.js
function principalToString(principal) {
  if (principal.type === ClarityType.PrincipalStandard) {
    return addressToString(principal.address);
  } else if (principal.type === ClarityType.PrincipalContract) {
    const address = addressToString(principal.address);
    return `${address}.${principal.contractName.content}`;
  } else {
    throw new Error(`Unexpected principal data: ${JSON.stringify(principal)}`);
  }
}
function principalCV(principal) {
  if (principal.includes(".")) {
    const [address, contractName] = principal.split(".");
    return contractPrincipalCV(address, contractName);
  } else {
    return standardPrincipalCV(principal);
  }
}
function standardPrincipalCV(addressString) {
  const addr = createAddress(addressString);
  return { type: ClarityType.PrincipalStandard, address: addr };
}
function standardPrincipalCVFromAddress(address) {
  return { type: ClarityType.PrincipalStandard, address };
}
function contractPrincipalCV(addressString, contractName) {
  const addr = createAddress(addressString);
  const lengthPrefixedContractName = createLPString(contractName);
  return contractPrincipalCVFromAddress(addr, lengthPrefixedContractName);
}
function contractPrincipalCVFromAddress(address, contractName) {
  if (utf8ToBytes(contractName.content).byteLength >= 128) {
    throw new Error("Contract name must be less than 128 bytes");
  }
  return { type: ClarityType.PrincipalContract, address, contractName };
}
var init_principalCV = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/types/principalCV.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_esm();
    init_common();
    init_postcondition_types();
    init_constants3();
    __name(principalToString, "principalToString");
    __name(principalCV, "principalCV");
    __name(standardPrincipalCV, "standardPrincipalCV");
    __name(standardPrincipalCVFromAddress, "standardPrincipalCVFromAddress");
    __name(contractPrincipalCV, "contractPrincipalCV");
    __name(contractPrincipalCVFromAddress, "contractPrincipalCVFromAddress");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/clarityValue.js
function cvToValue(val, strictJsonCompat = false) {
  switch (val.type) {
    case ClarityType.BoolTrue:
      return true;
    case ClarityType.BoolFalse:
      return false;
    case ClarityType.Int:
    case ClarityType.UInt:
      if (strictJsonCompat) {
        return val.value.toString();
      }
      return val.value;
    case ClarityType.Buffer:
      return `0x${bytesToHex(val.buffer)}`;
    case ClarityType.OptionalNone:
      return null;
    case ClarityType.OptionalSome:
      return cvToJSON(val.value);
    case ClarityType.ResponseErr:
      return cvToJSON(val.value);
    case ClarityType.ResponseOk:
      return cvToJSON(val.value);
    case ClarityType.PrincipalStandard:
    case ClarityType.PrincipalContract:
      return principalToString(val);
    case ClarityType.List:
      return val.list.map((v) => cvToJSON(v));
    case ClarityType.Tuple:
      const result = {};
      Object.keys(val.data).forEach((key) => {
        result[key] = cvToJSON(val.data[key]);
      });
      return result;
    case ClarityType.StringASCII:
      return val.data;
    case ClarityType.StringUTF8:
      return val.data;
  }
}
function cvToJSON(val) {
  switch (val.type) {
    case ClarityType.ResponseErr:
      return { type: getCVTypeString(val), value: cvToValue(val, true), success: false };
    case ClarityType.ResponseOk:
      return { type: getCVTypeString(val), value: cvToValue(val, true), success: true };
    default:
      return { type: getCVTypeString(val), value: cvToValue(val, true) };
  }
}
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
      return `(buff ${val.buffer.length})`;
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
      return `(list ${val.list.length} ${val.list.length ? getCVTypeString(val.list[0]) : "UnknownType"})`;
    case ClarityType.Tuple:
      return `(tuple ${Object.keys(val.data).map((key) => `(${key} ${getCVTypeString(val.data[key])})`).join(" ")})`;
    case ClarityType.StringASCII:
      return `(string-ascii ${asciiToBytes(val.data).length})`;
    case ClarityType.StringUTF8:
      return `(string-utf8 ${utf8ToBytes(val.data).length})`;
  }
}
var init_clarityValue = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/clarityValue.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_principalCV();
    init_constants3();
    init_esm();
    __name(cvToValue, "cvToValue");
    __name(cvToJSON, "cvToJSON");
    __name(getCVTypeString, "getCVTypeString");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/types/booleanCV.js
var trueCV, falseCV;
var init_booleanCV = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/types/booleanCV.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_constants3();
    trueCV = /* @__PURE__ */ __name(() => ({ type: ClarityType.BoolTrue }), "trueCV");
    falseCV = /* @__PURE__ */ __name(() => ({ type: ClarityType.BoolFalse }), "falseCV");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/types/intCV.js
var MAX_U128, MIN_U128, MAX_I128, MIN_I128, intCV, uintCV;
var init_intCV = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/types/intCV.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_esm();
    init_constants3();
    MAX_U128 = BigInt("0xffffffffffffffffffffffffffffffff");
    MIN_U128 = BigInt(0);
    MAX_I128 = BigInt("0x7fffffffffffffffffffffffffffffff");
    MIN_I128 = BigInt("-170141183460469231731687303715884105728");
    intCV = /* @__PURE__ */ __name((value) => {
      const bigInt = intToBigInt(value, true);
      if (bigInt > MAX_I128) {
        throw new RangeError(`Cannot construct clarity integer from value greater than ${MAX_I128}`);
      } else if (bigInt < MIN_I128) {
        throw new RangeError(`Cannot construct clarity integer form value less than ${MIN_I128}`);
      }
      return { type: ClarityType.Int, value: bigInt };
    }, "intCV");
    uintCV = /* @__PURE__ */ __name((value) => {
      const bigInt = intToBigInt(value, false);
      if (bigInt < MIN_U128) {
        throw new RangeError("Cannot construct unsigned clarity integer from negative value");
      } else if (bigInt > MAX_U128) {
        throw new RangeError(`Cannot construct unsigned clarity integer greater than ${MAX_U128}`);
      }
      return { type: ClarityType.UInt, value: bigInt };
    }, "uintCV");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/types/bufferCV.js
var bufferCV;
var init_bufferCV = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/types/bufferCV.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_constants3();
    bufferCV = /* @__PURE__ */ __name((buffer) => {
      if (buffer.byteLength > 1048576) {
        throw new Error("Cannot construct clarity buffer that is greater than 1MB");
      }
      return { type: ClarityType.Buffer, buffer };
    }, "bufferCV");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/types/optionalCV.js
function noneCV() {
  return { type: ClarityType.OptionalNone };
}
function someCV(value) {
  return { type: ClarityType.OptionalSome, value };
}
var init_optionalCV = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/types/optionalCV.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_constants3();
    __name(noneCV, "noneCV");
    __name(someCV, "someCV");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/types/responseCV.js
function responseErrorCV(value) {
  return { type: ClarityType.ResponseErr, value };
}
function responseOkCV(value) {
  return { type: ClarityType.ResponseOk, value };
}
var init_responseCV = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/types/responseCV.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_constants3();
    __name(responseErrorCV, "responseErrorCV");
    __name(responseOkCV, "responseOkCV");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/types/listCV.js
function listCV(values) {
  return { type: ClarityType.List, list: values };
}
var init_listCV = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/types/listCV.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_constants3();
    __name(listCV, "listCV");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/types/tupleCV.js
function tupleCV(data) {
  for (const key in data) {
    if (!isClarityName(key)) {
      throw new Error(`"${key}" is not a valid Clarity name`);
    }
  }
  return { type: ClarityType.Tuple, data };
}
var init_tupleCV = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/types/tupleCV.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_constants3();
    init_utils3();
    __name(tupleCV, "tupleCV");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/types/stringCV.js
var stringAsciiCV, stringUtf8CV;
var init_stringCV = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/types/stringCV.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_constants3();
    stringAsciiCV = /* @__PURE__ */ __name((data) => {
      return { type: ClarityType.StringASCII, data };
    }, "stringAsciiCV");
    stringUtf8CV = /* @__PURE__ */ __name((data) => {
      return { type: ClarityType.StringUTF8, data };
    }, "stringUtf8CV");
  }
});

// ../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/hmac.js
var HMAC, hmac;
var init_hmac = __esm({
  "../node_modules/@stacks/transactions/node_modules/@noble/hashes/esm/hmac.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_assert();
    init_utils2();
    HMAC = class extends Hash {
      static {
        __name(this, "HMAC");
      }
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
    hmac = /* @__PURE__ */ __name((hash2, key, message) => new HMAC(hash2, key).update(message).digest(), "hmac");
    hmac.create = (hash2, key) => new HMAC(hash2, key);
  }
});

// ../node_modules/@stacks/transactions/dist/esm/keys.js
function createStacksPrivateKey(key) {
  const data = privateKeyToBytes(key);
  const compressed = data.length == PRIVATE_KEY_COMPRESSED_LENGTH;
  return { data, compressed };
}
function signWithKey(privateKey, messageHash) {
  const [rawSignature, recoveryId] = signSync(messageHash, privateKey.data.slice(0, 32), {
    canonical: true,
    recovered: true
  });
  if (recoveryId == null) {
    throw new Error("No signature recoveryId received");
  }
  const recoveryIdHex = intToHex(recoveryId, 1);
  const recoverableSignatureString = recoveryIdHex + Signature.fromHex(rawSignature).toCompactHex();
  return createMessageSignature(recoverableSignatureString);
}
function signMessageHashRsv({ messageHash, privateKey }) {
  const messageSignature = signWithKey(privateKey, messageHash);
  return { ...messageSignature, data: signatureVrsToRsv(messageSignature.data) };
}
var import_c32check3;
var init_keys2 = __esm({
  "../node_modules/@stacks/transactions/dist/esm/keys.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_hmac();
    init_sha256();
    init_esm2();
    init_esm();
    import_c32check3 = __toESM(require_lib());
    init_common();
    utils.hmacSha256Sync = (key, ...msgs) => {
      const h = hmac.create(sha256, key);
      msgs.forEach((msg) => h.update(msg));
      return h.digest();
    };
    __name(createStacksPrivateKey, "createStacksPrivateKey");
    __name(signWithKey, "signWithKey");
    __name(signMessageHashRsv, "signMessageHashRsv");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/errors.js
var TransactionError, SerializationError, DeserializationError;
var init_errors2 = __esm({
  "../node_modules/@stacks/transactions/dist/esm/errors.js"() {
    init_functionsRoutes_0_03405564948503348();
    TransactionError = class extends Error {
      static {
        __name(this, "TransactionError");
      }
      constructor(message) {
        super(message);
        this.message = message;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    };
    SerializationError = class extends TransactionError {
      static {
        __name(this, "SerializationError");
      }
      constructor(message) {
        super(message);
      }
    };
    DeserializationError = class extends TransactionError {
      static {
        __name(this, "DeserializationError");
      }
      constructor(message) {
        super(message);
      }
    };
  }
});

// ../node_modules/@stacks/transactions/dist/esm/signature.js
var AuthFieldType;
var init_signature = __esm({
  "../node_modules/@stacks/transactions/dist/esm/signature.js"() {
    init_functionsRoutes_0_03405564948503348();
    (function(AuthFieldType2) {
      AuthFieldType2[AuthFieldType2["PublicKeyCompressed"] = 0] = "PublicKeyCompressed";
      AuthFieldType2[AuthFieldType2["PublicKeyUncompressed"] = 1] = "PublicKeyUncompressed";
      AuthFieldType2[AuthFieldType2["SignatureCompressed"] = 2] = "SignatureCompressed";
      AuthFieldType2[AuthFieldType2["SignatureUncompressed"] = 3] = "SignatureUncompressed";
    })(AuthFieldType || (AuthFieldType = {}));
  }
});

// ../node_modules/@stacks/transactions/dist/esm/types.js
function serializeAddress(address) {
  const bytesArray = [];
  bytesArray.push(hexToBytes(intToHex(address.version, 1)));
  bytesArray.push(hexToBytes(address.hash160));
  return concatArray(bytesArray);
}
function deserializeAddress(bytesReader) {
  const version = hexToInt(bytesToHex(bytesReader.readBytes(1)));
  const data = bytesToHex(bytesReader.readBytes(20));
  return { type: StacksMessageType.Address, version, hash160: data };
}
function serializeLPString(lps) {
  const bytesArray = [];
  const contentBytes = utf8ToBytes(lps.content);
  const length = contentBytes.byteLength;
  bytesArray.push(hexToBytes(intToHex(length, lps.lengthPrefixBytes)));
  bytesArray.push(contentBytes);
  return concatArray(bytesArray);
}
function deserializeLPString(bytesReader, prefixBytes, maxLength) {
  prefixBytes = prefixBytes ? prefixBytes : 1;
  const length = hexToInt(bytesToHex(bytesReader.readBytes(prefixBytes)));
  const content = bytesToUtf8(bytesReader.readBytes(length));
  return createLPString(content, prefixBytes, maxLength ?? 128);
}
var init_types = __esm({
  "../node_modules/@stacks/transactions/dist/esm/types.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_esm();
    init_constants2();
    init_postcondition_types();
    __name(serializeAddress, "serializeAddress");
    __name(deserializeAddress, "deserializeAddress");
    __name(serializeLPString, "serializeLPString");
    __name(deserializeLPString, "deserializeLPString");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/serialize.js
function bytesWithTypeID(typeId, bytes2) {
  return concatArray([typeId, bytes2]);
}
function serializeBoolCV(value) {
  return new Uint8Array([value.type]);
}
function serializeOptionalCV(cv) {
  if (cv.type === ClarityType.OptionalNone) {
    return new Uint8Array([cv.type]);
  } else {
    return bytesWithTypeID(cv.type, serializeCV(cv.value));
  }
}
function serializeBufferCV(cv) {
  const length = new Uint8Array(4);
  writeUInt32BE(length, cv.buffer.length, 0);
  return bytesWithTypeID(cv.type, concatBytes(length, cv.buffer));
}
function serializeIntCV(cv) {
  const bytes2 = bigIntToBytes(toTwos(cv.value, BigInt(CLARITY_INT_SIZE)), CLARITY_INT_BYTE_SIZE);
  return bytesWithTypeID(cv.type, bytes2);
}
function serializeUIntCV(cv) {
  const bytes2 = bigIntToBytes(cv.value, CLARITY_INT_BYTE_SIZE);
  return bytesWithTypeID(cv.type, bytes2);
}
function serializeStandardPrincipalCV(cv) {
  return bytesWithTypeID(cv.type, serializeAddress(cv.address));
}
function serializeContractPrincipalCV(cv) {
  return bytesWithTypeID(cv.type, concatBytes(serializeAddress(cv.address), serializeLPString(cv.contractName)));
}
function serializeResponseCV(cv) {
  return bytesWithTypeID(cv.type, serializeCV(cv.value));
}
function serializeListCV(cv) {
  const bytesArray = [];
  const length = new Uint8Array(4);
  writeUInt32BE(length, cv.list.length, 0);
  bytesArray.push(length);
  for (const value of cv.list) {
    const serializedValue = serializeCV(value);
    bytesArray.push(serializedValue);
  }
  return bytesWithTypeID(cv.type, concatArray(bytesArray));
}
function serializeTupleCV(cv) {
  const bytesArray = [];
  const length = new Uint8Array(4);
  writeUInt32BE(length, Object.keys(cv.data).length, 0);
  bytesArray.push(length);
  const lexicographicOrder = Object.keys(cv.data).sort((a, b) => a.localeCompare(b));
  for (const key of lexicographicOrder) {
    const nameWithLength = createLPString(key);
    bytesArray.push(serializeLPString(nameWithLength));
    const serializedValue = serializeCV(cv.data[key]);
    bytesArray.push(serializedValue);
  }
  return bytesWithTypeID(cv.type, concatArray(bytesArray));
}
function serializeStringCV(cv, encoding) {
  const bytesArray = [];
  const str = encoding == "ascii" ? asciiToBytes(cv.data) : utf8ToBytes(cv.data);
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
var init_serialize = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/serialize.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_esm();
    init_types();
    init_postcondition_types();
    init_constants3();
    init_errors2();
    init_constants2();
    __name(bytesWithTypeID, "bytesWithTypeID");
    __name(serializeBoolCV, "serializeBoolCV");
    __name(serializeOptionalCV, "serializeOptionalCV");
    __name(serializeBufferCV, "serializeBufferCV");
    __name(serializeIntCV, "serializeIntCV");
    __name(serializeUIntCV, "serializeUIntCV");
    __name(serializeStandardPrincipalCV, "serializeStandardPrincipalCV");
    __name(serializeContractPrincipalCV, "serializeContractPrincipalCV");
    __name(serializeResponseCV, "serializeResponseCV");
    __name(serializeListCV, "serializeListCV");
    __name(serializeTupleCV, "serializeTupleCV");
    __name(serializeStringCV, "serializeStringCV");
    __name(serializeStringAsciiCV, "serializeStringAsciiCV");
    __name(serializeStringUtf8CV, "serializeStringUtf8CV");
    __name(serializeCV, "serializeCV");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/bytesReader.js
function createEnumChecker(enumVariable) {
  const enumValues = Object.values(enumVariable).filter((v) => typeof v === "number");
  const enumValueSet = new Set(enumValues);
  return (value) => enumValueSet.has(value);
}
function isEnum(enumVariable, value) {
  const checker = enumCheckFunctions.get(enumVariable);
  if (checker !== void 0) {
    return checker(value);
  }
  const newChecker = createEnumChecker(enumVariable);
  enumCheckFunctions.set(enumVariable, newChecker);
  return isEnum(enumVariable, value);
}
var enumCheckFunctions, BytesReader;
var init_bytesReader = __esm({
  "../node_modules/@stacks/transactions/dist/esm/bytesReader.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_esm();
    __name(createEnumChecker, "createEnumChecker");
    enumCheckFunctions = /* @__PURE__ */ new Map();
    __name(isEnum, "isEnum");
    BytesReader = class {
      static {
        __name(this, "BytesReader");
      }
      constructor(arr) {
        this.consumed = 0;
        this.source = arr;
      }
      readBytes(length) {
        const view = this.source.subarray(this.consumed, this.consumed + length);
        this.consumed += length;
        return view;
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
        const bytes2 = this.readBytes(length).slice().reverse();
        const hex = bytesToHex(bytes2);
        return BigInt(`0x${hex}`);
      }
      readBigUIntBE(length) {
        const bytes2 = this.readBytes(length);
        const hex = bytesToHex(bytes2);
        return BigInt(`0x${hex}`);
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
        const num = this.readUInt8();
        if (isEnum(enumVariable, num)) {
          return num;
        }
        throw invalidEnumErrorFormatter(num);
      }
    };
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/deserialize.js
function deserializeCV(serializedClarityValue) {
  let bytesReader;
  if (typeof serializedClarityValue === "string") {
    const hasHexPrefix = serializedClarityValue.slice(0, 2).toLowerCase() === "0x";
    bytesReader = new BytesReader(hexToBytes(hasHexPrefix ? serializedClarityValue.slice(2) : serializedClarityValue));
  } else if (serializedClarityValue instanceof Uint8Array) {
    bytesReader = new BytesReader(serializedClarityValue);
  } else {
    bytesReader = serializedClarityValue;
  }
  const type = bytesReader.readUInt8Enum(ClarityType, (n) => {
    throw new DeserializationError(`Cannot recognize Clarity Type: ${n}`);
  });
  switch (type) {
    case ClarityType.Int:
      return intCV(bytesReader.readBytes(16));
    case ClarityType.UInt:
      return uintCV(bytesReader.readBytes(16));
    case ClarityType.Buffer:
      const bufferLength = bytesReader.readUInt32BE();
      return bufferCV(bytesReader.readBytes(bufferLength));
    case ClarityType.BoolTrue:
      return trueCV();
    case ClarityType.BoolFalse:
      return falseCV();
    case ClarityType.PrincipalStandard:
      const sAddress = deserializeAddress(bytesReader);
      return standardPrincipalCVFromAddress(sAddress);
    case ClarityType.PrincipalContract:
      const cAddress = deserializeAddress(bytesReader);
      const contractName = deserializeLPString(bytesReader);
      return contractPrincipalCVFromAddress(cAddress, contractName);
    case ClarityType.ResponseOk:
      return responseOkCV(deserializeCV(bytesReader));
    case ClarityType.ResponseErr:
      return responseErrorCV(deserializeCV(bytesReader));
    case ClarityType.OptionalNone:
      return noneCV();
    case ClarityType.OptionalSome:
      return someCV(deserializeCV(bytesReader));
    case ClarityType.List:
      const listLength = bytesReader.readUInt32BE();
      const listContents = [];
      for (let i = 0; i < listLength; i++) {
        listContents.push(deserializeCV(bytesReader));
      }
      return listCV(listContents);
    case ClarityType.Tuple:
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
    case ClarityType.StringASCII:
      const asciiStrLen = bytesReader.readUInt32BE();
      const asciiStr = bytesToAscii(bytesReader.readBytes(asciiStrLen));
      return stringAsciiCV(asciiStr);
    case ClarityType.StringUTF8:
      const utf8StrLen = bytesReader.readUInt32BE();
      const utf8Str = bytesToUtf8(bytesReader.readBytes(utf8StrLen));
      return stringUtf8CV(utf8Str);
    default:
      throw new DeserializationError("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
var init_deserialize = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/deserialize.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_clarity();
    init_bytesReader();
    init_types();
    init_errors2();
    init_stringCV();
    init_esm();
    __name(deserializeCV, "deserializeCV");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/clarity/index.js
var init_clarity = __esm({
  "../node_modules/@stacks/transactions/dist/esm/clarity/index.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_clarityValue();
    init_constants3();
    init_booleanCV();
    init_intCV();
    init_bufferCV();
    init_optionalCV();
    init_responseCV();
    init_principalCV();
    init_listCV();
    init_tupleCV();
    init_stringCV();
    init_serialize();
    init_deserialize();
  }
});

// ../node_modules/@stacks/transactions/dist/esm/utils.js
function isClarityName(name) {
  const regex = /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/;
  return regex.test(name) && name.length < 128;
}
var import_c32check4, import_lodash, exceedsMaxLengthBytes;
var init_utils3 = __esm({
  "../node_modules/@stacks/transactions/dist/esm/utils.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_ripemd160();
    init_sha256();
    init_sha512();
    init_esm2();
    init_esm();
    import_c32check4 = __toESM(require_lib());
    import_lodash = __toESM(require_lodash());
    init_esm2();
    exceedsMaxLengthBytes = /* @__PURE__ */ __name((string, maxLengthBytes) => string ? utf8ToBytes(string).length > maxLengthBytes : false, "exceedsMaxLengthBytes");
    __name(isClarityName, "isClarityName");
  }
});

// ../node_modules/@stacks/transactions/dist/esm/authorization.js
var init_authorization = __esm({
  "../node_modules/@stacks/transactions/dist/esm/authorization.js"() {
    init_functionsRoutes_0_03405564948503348();
  }
});

// ../node_modules/@stacks/transactions/dist/esm/contract-abi.js
var ClarityAbiTypeId;
var init_contract_abi = __esm({
  "../node_modules/@stacks/transactions/dist/esm/contract-abi.js"() {
    init_functionsRoutes_0_03405564948503348();
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
  }
});

// ../node_modules/@stacks/transactions/dist/esm/signer.js
var init_signer = __esm({
  "../node_modules/@stacks/transactions/dist/esm/signer.js"() {
    init_functionsRoutes_0_03405564948503348();
  }
});

// ../node_modules/@stacks/transactions/dist/esm/builders.js
var import_c32check5;
var init_builders = __esm({
  "../node_modules/@stacks/transactions/dist/esm/builders.js"() {
    init_functionsRoutes_0_03405564948503348();
    import_c32check5 = __toESM(require_lib());
  }
});

// ../node_modules/@stacks/transactions/dist/esm/structuredDataSignature.js
var STRUCTURED_DATA_PREFIX;
var init_structuredDataSignature = __esm({
  "../node_modules/@stacks/transactions/dist/esm/structuredDataSignature.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_sha256();
    STRUCTURED_DATA_PREFIX = new Uint8Array([83, 73, 80, 48, 49, 56]);
  }
});

// ../node_modules/@stacks/transactions/dist/esm/message-types.js
var init_message_types = __esm({
  "../node_modules/@stacks/transactions/dist/esm/message-types.js"() {
    init_functionsRoutes_0_03405564948503348();
  }
});

// ../node_modules/@stacks/transactions/dist/esm/index.js
var init_esm3 = __esm({
  "../node_modules/@stacks/transactions/dist/esm/index.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_authorization();
    init_builders();
    init_clarity();
    init_common();
    init_constants2();
    init_contract_abi();
    init_keys2();
    init_postcondition_types();
    init_signature();
    init_signer();
    init_structuredDataSignature();
    init_types();
    init_message_types();
    init_utils3();
  }
});

// ../node_modules/@noble/hashes/esm/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView2(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr2(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function utf8ToBytes3(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes3(data);
  abytes(data);
  return data;
}
function createHasher(hashCons) {
  const hashC = /* @__PURE__ */ __name((msg) => hashCons().update(toBytes2(msg)).digest(), "hashC");
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
var Hash2;
var init_utils4 = __esm({
  "../node_modules/@noble/hashes/esm/utils.js"() {
    init_functionsRoutes_0_03405564948503348();
    __name(isBytes, "isBytes");
    __name(abytes, "abytes");
    __name(aexists, "aexists");
    __name(aoutput, "aoutput");
    __name(clean, "clean");
    __name(createView2, "createView");
    __name(rotr2, "rotr");
    __name(utf8ToBytes3, "utf8ToBytes");
    __name(toBytes2, "toBytes");
    Hash2 = class {
      static {
        __name(this, "Hash");
      }
    };
    __name(createHasher, "createHasher");
  }
});

// ../node_modules/@noble/hashes/esm/_md.js
function setBigUint642(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function Chi2(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj2(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD, SHA256_IV;
var init_md = __esm({
  "../node_modules/@noble/hashes/esm/_md.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_utils4();
    __name(setBigUint642, "setBigUint64");
    __name(Chi2, "Chi");
    __name(Maj2, "Maj");
    HashMD = class extends Hash2 {
      static {
        __name(this, "HashMD");
      }
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
        this.view = createView2(this.buffer);
      }
      update(data) {
        aexists(this);
        data = toBytes2(data);
        abytes(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView2(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
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
        const { buffer, view, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        clean(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint642(view, blockLen - 8, BigInt(this.length * 8), isLE2);
        this.process(view, 0);
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
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
  }
});

// ../node_modules/@noble/hashes/esm/sha2.js
var SHA256_K2, SHA256_W2, SHA2562, sha2562;
var init_sha22 = __esm({
  "../node_modules/@noble/hashes/esm/sha2.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_md();
    init_utils4();
    SHA256_K2 = /* @__PURE__ */ Uint32Array.from([
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
    SHA256_W2 = /* @__PURE__ */ new Uint32Array(64);
    SHA2562 = class extends HashMD {
      static {
        __name(this, "SHA256");
      }
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = SHA256_IV[0] | 0;
        this.B = SHA256_IV[1] | 0;
        this.C = SHA256_IV[2] | 0;
        this.D = SHA256_IV[3] | 0;
        this.E = SHA256_IV[4] | 0;
        this.F = SHA256_IV[5] | 0;
        this.G = SHA256_IV[6] | 0;
        this.H = SHA256_IV[7] | 0;
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
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W2[i] = view.getUint32(offset, false);
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
        clean(SHA256_W2);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean(this.buffer);
      }
    };
    sha2562 = /* @__PURE__ */ createHasher(() => new SHA2562());
  }
});

// ../node_modules/@noble/hashes/esm/sha256.js
var sha2563;
var init_sha2562 = __esm({
  "../node_modules/@noble/hashes/esm/sha256.js"() {
    init_functionsRoutes_0_03405564948503348();
    init_sha22();
    sha2563 = sha2562;
  }
});

// ../packages/xtrata-reconstruction/src/index.ts
var CHUNK_SIZE, EMPTY_HASH, concatBytes3, chunkBytes, assembleChunks, computeExpectedHash, createDiagnostics, updateReadMode, errorMessage, isCostBalanceExceededMessage, ReconstructionContentError, ReconstructionVerificationError, toHex, verifyPayload, resolveDependencies, resolveTotalChunks, safeNumberFromBigInt, sourceIdOf, recordReadError, asTerminalReadError, readSingleChunk, normalizeBatchSize, normalizeConcurrency, runWithConcurrency, readChunksFromSource, readMetaFromSources, readFirstChunkFromSource, selectChunkSource, readTokenUri, createDependencyReaders, verificationForPayload, reconstructXtrataInscription;
var init_src = __esm({
  "../packages/xtrata-reconstruction/src/index.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_sha2562();
    CHUNK_SIZE = 16384;
    EMPTY_HASH = new Uint8Array(32);
    concatBytes3 = /* @__PURE__ */ __name((left, right) => {
      const combined = new Uint8Array(left.length + right.length);
      combined.set(left, 0);
      combined.set(right, left.length);
      return combined;
    }, "concatBytes");
    chunkBytes = /* @__PURE__ */ __name((data, chunkSize = CHUNK_SIZE) => {
      if (chunkSize <= 0) {
        throw new Error("chunkSize must be greater than zero");
      }
      const chunks = [];
      for (let offset = 0; offset < data.length; offset += chunkSize) {
        chunks.push(data.slice(offset, offset + chunkSize));
      }
      return chunks;
    }, "chunkBytes");
    assembleChunks = /* @__PURE__ */ __name((chunks) => {
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      return combined;
    }, "assembleChunks");
    computeExpectedHash = /* @__PURE__ */ __name((chunks) => {
      let runningHash = EMPTY_HASH;
      for (const chunk of chunks) {
        runningHash = new Uint8Array(sha2563(concatBytes3(runningHash, chunk)));
      }
      return runningHash;
    }, "computeExpectedHash");
    createDiagnostics = /* @__PURE__ */ __name((requestedSourceId) => ({
      requestedSourceId,
      metaSourceId: null,
      chunkSourceId: null,
      fallbackUsed: false,
      readMode: "none",
      batchReads: 0,
      singleReads: 0,
      batchFallbacks: 0,
      missingChunks: [],
      errors: []
    }), "createDiagnostics");
    updateReadMode = /* @__PURE__ */ __name((diagnostics) => {
      if (diagnostics.batchReads > 0 && diagnostics.singleReads > 0) {
        diagnostics.readMode = "mixed";
      } else if (diagnostics.batchReads > 0) {
        diagnostics.readMode = "batch";
      } else if (diagnostics.singleReads > 0) {
        diagnostics.readMode = "single";
      } else {
        diagnostics.readMode = "none";
      }
    }, "updateReadMode");
    errorMessage = /* @__PURE__ */ __name((error) => error instanceof Error ? error.message : String(error), "errorMessage");
    isCostBalanceExceededMessage = /* @__PURE__ */ __name((message) => message.toLowerCase().includes("costbalanceexceeded"), "isCostBalanceExceededMessage");
    ReconstructionContentError = class extends Error {
      static {
        __name(this, "ReconstructionContentError");
      }
      code;
      diagnostics;
      constructor(code, message, diagnostics) {
        super(message);
        this.name = "ReconstructionContentError";
        this.code = code;
        this.diagnostics = diagnostics;
      }
    };
    ReconstructionVerificationError = class extends Error {
      static {
        __name(this, "ReconstructionVerificationError");
      }
      verification;
      diagnostics;
      constructor(verification, diagnostics) {
        super(
          `Reconstructed payload verification failed (${verification.reason ?? "hash-mismatch"}): expected ${verification.expectedHashHex}, got ${verification.actualHashHex}`
        );
        this.name = "ReconstructionVerificationError";
        this.verification = verification;
        this.diagnostics = diagnostics;
      }
    };
    toHex = /* @__PURE__ */ __name((bytes2) => Array.from(bytes2).map((entry) => entry.toString(16).padStart(2, "0")).join(""), "toHex");
    verifyPayload = /* @__PURE__ */ __name((bytes2, expectedHash, chunkSize = CHUNK_SIZE) => {
      const chunks = chunkBytes(bytes2, chunkSize);
      const actual = computeExpectedHash(chunks);
      const expectedHex = toHex(expectedHash);
      const actualHex = toHex(actual);
      return {
        ok: expectedHex === actualHex,
        expectedHashHex: expectedHex,
        actualHashHex: actualHex,
        reason: expectedHex === actualHex ? null : "hash-mismatch"
      };
    }, "verifyPayload");
    resolveDependencies = /* @__PURE__ */ __name(async (tokenId, readers, options) => {
      const maxNodes = Math.max(1, options?.maxNodes ?? 512);
      const queue = [tokenId];
      const seen = /* @__PURE__ */ new Set();
      const nodes = [];
      const edges = [];
      let truncated = false;
      while (queue.length > 0) {
        const current = queue.shift();
        const key = current.toString();
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        nodes.push(current);
        if (nodes.length >= maxNodes) {
          truncated = true;
          break;
        }
        const dependencies = await readers.getDependencies(current);
        for (const dep of dependencies) {
          edges.push({ from: current, to: dep });
          const depKey = dep.toString();
          if (!seen.has(depKey)) {
            queue.push(dep);
          }
        }
      }
      return {
        root: tokenId,
        edges,
        nodes,
        truncated
      };
    }, "resolveDependencies");
    resolveTotalChunks = /* @__PURE__ */ __name((meta, chunkSize = CHUNK_SIZE) => {
      if (meta.totalChunks !== void 0 && meta.totalChunks !== null && (meta.totalChunks > 0n || meta.totalSize <= 0n)) {
        return meta.totalChunks;
      }
      if (meta.totalSize <= 0n) {
        return 0n;
      }
      const size = BigInt(chunkSize);
      return (meta.totalSize + size - 1n) / size;
    }, "resolveTotalChunks");
    safeNumberFromBigInt = /* @__PURE__ */ __name((value, code, label, diagnostics) => {
      if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new ReconstructionContentError(
          code,
          `${label} is not safely representable in JavaScript.`,
          diagnostics
        );
      }
      return Number(value);
    }, "safeNumberFromBigInt");
    sourceIdOf = /* @__PURE__ */ __name((source) => source.sourceId ?? null, "sourceIdOf");
    recordReadError = /* @__PURE__ */ __name((diagnostics, error) => {
      diagnostics.errors.push(error);
    }, "recordReadError");
    asTerminalReadError = /* @__PURE__ */ __name((error, diagnostics, options) => {
      if (error instanceof ReconstructionContentError && error.code === "terminal-read-error") {
        return error;
      }
      return options?.isTerminalReadError?.(error) ? new ReconstructionContentError("terminal-read-error", errorMessage(error), diagnostics) : null;
    }, "asTerminalReadError");
    readSingleChunk = /* @__PURE__ */ __name(async (params) => {
      params.diagnostics.singleReads += 1;
      updateReadMode(params.diagnostics);
      try {
        return await params.source.readers.getChunk(params.tokenId, params.index);
      } catch (error) {
        recordReadError(params.diagnostics, {
          sourceId: sourceIdOf(params.source),
          operation: "chunk",
          index: params.index,
          message: errorMessage(error)
        });
        const terminalError = asTerminalReadError(error, params.diagnostics, params.options);
        if (terminalError) {
          throw terminalError;
        }
        return null;
      }
    }, "readSingleChunk");
    normalizeBatchSize = /* @__PURE__ */ __name((batchSize) => {
      if (batchSize === void 0) {
        return 30;
      }
      if (!Number.isFinite(batchSize)) {
        return 30;
      }
      return Math.max(1, Math.min(30, Math.floor(batchSize)));
    }, "normalizeBatchSize");
    normalizeConcurrency = /* @__PURE__ */ __name((concurrency, total) => {
      if (total <= 1) {
        return 1;
      }
      if (concurrency === void 0 || !Number.isFinite(concurrency)) {
        return 1;
      }
      return Math.max(1, Math.min(total, Math.floor(concurrency)));
    }, "normalizeConcurrency");
    runWithConcurrency = /* @__PURE__ */ __name(async (items, concurrency, worker) => {
      if (items.length === 0) {
        return;
      }
      const workerCount = normalizeConcurrency(concurrency, items.length);
      let cursor = 0;
      const workers = Array.from({ length: workerCount }, async () => {
        while (true) {
          const current = cursor;
          cursor += 1;
          if (current >= items.length) {
            return;
          }
          await worker(items[current]);
        }
      });
      await Promise.all(workers);
    }, "runWithConcurrency");
    readChunksFromSource = /* @__PURE__ */ __name(async (params) => {
      const total = safeNumberFromBigInt(
        params.totalChunks,
        "unsafe-chunk-count",
        "Chunk count",
        params.diagnostics
      );
      const chunksByIndex = new Map(params.preloadedChunks);
      const allIndexes = Array.from({ length: total }, (_entry, index) => BigInt(index));
      const batchSize = normalizeBatchSize(params.options?.batchSize);
      const concurrency = normalizeConcurrency(params.options?.concurrency, total);
      const preferBatch = params.options?.preferBatch !== false;
      let terminalReadError = null;
      const throwIfTerminalReadFailed = /* @__PURE__ */ __name(() => {
        if (terminalReadError) {
          throw terminalReadError;
        }
      }, "throwIfTerminalReadFailed");
      const readSingles = /* @__PURE__ */ __name(async (indexes) => {
        await runWithConcurrency(indexes, concurrency, async (index) => {
          throwIfTerminalReadFailed();
          if (chunksByIndex.has(index.toString())) {
            return;
          }
          let chunk;
          try {
            chunk = await readSingleChunk({
              source: params.source,
              tokenId: params.tokenId,
              index,
              diagnostics: params.diagnostics,
              options: params.options
            });
          } catch (error) {
            terminalReadError = asTerminalReadError(error, params.diagnostics, params.options);
            throw error;
          }
          if (chunk && chunk.length > 0) {
            chunksByIndex.set(index.toString(), chunk);
          }
        });
      }, "readSingles");
      const readBatch = /* @__PURE__ */ __name(async (indexes) => {
        throwIfTerminalReadFailed();
        const pendingIndexes = indexes.filter((index) => !chunksByIndex.has(index.toString()));
        if (pendingIndexes.length === 0) {
          return;
        }
        if (!preferBatch || !params.source.readers.getChunkBatch) {
          await readSingles(pendingIndexes);
          return;
        }
        try {
          params.diagnostics.batchReads += 1;
          updateReadMode(params.diagnostics);
          const batch = await params.source.readers.getChunkBatch(params.tokenId, pendingIndexes);
          if (batch.length !== pendingIndexes.length) {
            throw new Error(
              `Batch result length ${batch.length.toString()} did not match request length ${pendingIndexes.length.toString()}.`
            );
          }
          const missingIndexes = [];
          batch.forEach((chunk, index) => {
            const chunkIndex = pendingIndexes[index];
            if (chunk && chunk.length > 0) {
              chunksByIndex.set(chunkIndex.toString(), chunk);
            } else {
              missingIndexes.push(chunkIndex);
            }
          });
          if (missingIndexes.length > 0) {
            params.diagnostics.batchFallbacks += 1;
            await readSingles(missingIndexes);
          }
        } catch (error) {
          const message = errorMessage(error);
          recordReadError(params.diagnostics, {
            sourceId: sourceIdOf(params.source),
            operation: "chunk-batch",
            indexes: [...pendingIndexes],
            message
          });
          const terminalError = asTerminalReadError(error, params.diagnostics, params.options);
          if (terminalError) {
            terminalReadError = terminalError;
            throw terminalError;
          }
          params.diagnostics.batchFallbacks += 1;
          if (pendingIndexes.length === 1 || !isCostBalanceExceededMessage(message)) {
            await readSingles(pendingIndexes);
            return;
          }
          const midpoint = Math.ceil(pendingIndexes.length / 2);
          await readBatch(pendingIndexes.slice(0, midpoint));
          await readBatch(pendingIndexes.slice(midpoint));
        }
      }, "readBatch");
      const batches = [];
      const fetchIndexes = allIndexes.filter((index) => !chunksByIndex.has(index.toString()));
      for (let index = 0; index < fetchIndexes.length; index += batchSize) {
        batches.push(fetchIndexes.slice(index, index + batchSize));
      }
      await runWithConcurrency(batches, concurrency, readBatch);
      const chunks = [];
      const missingChunks = [];
      for (const index of allIndexes) {
        const chunk = chunksByIndex.get(index.toString());
        if (!chunk) {
          missingChunks.push(index);
        } else {
          chunks.push(chunk);
        }
      }
      if (missingChunks.length > 0) {
        params.diagnostics.missingChunks.push(...missingChunks);
        throw new ReconstructionContentError(
          "missing-chunk",
          `Missing chunk ${missingChunks.map((index) => index.toString()).join(", ")}`,
          params.diagnostics
        );
      }
      return chunks;
    }, "readChunksFromSource");
    readMetaFromSources = /* @__PURE__ */ __name(async (params) => {
      for (const source of params.sources) {
        try {
          const meta = await source.readers.getInscriptionMeta(params.tokenId);
          if (meta) {
            params.diagnostics.metaSourceId = sourceIdOf(source);
            params.diagnostics.fallbackUsed = params.diagnostics.metaSourceId !== params.diagnostics.requestedSourceId;
            return { source, meta };
          }
        } catch (error) {
          recordReadError(params.diagnostics, {
            sourceId: sourceIdOf(source),
            operation: "meta",
            message: errorMessage(error)
          });
          const terminalError = asTerminalReadError(error, params.diagnostics, params.options);
          if (terminalError) {
            throw terminalError;
          }
        }
      }
      throw new ReconstructionContentError(
        "metadata-not-found",
        `Inscription meta not found for token ${params.tokenId.toString()}`,
        params.diagnostics
      );
    }, "readMetaFromSources");
    readFirstChunkFromSource = /* @__PURE__ */ __name(async (params) => {
      const chunk = await readSingleChunk({
        source: params.source,
        tokenId: params.tokenId,
        index: 0n,
        diagnostics: params.diagnostics,
        options: params.options
      });
      return chunk && chunk.length > 0 ? chunk : null;
    }, "readFirstChunkFromSource");
    selectChunkSource = /* @__PURE__ */ __name(async (params) => {
      if (params.totalChunks === 0n) {
        params.diagnostics.chunkSourceId = sourceIdOf(params.metaSource);
        return {
          source: params.metaSource,
          preloadedChunks: /* @__PURE__ */ new Map()
        };
      }
      const orderedSources = [
        params.metaSource,
        ...params.sources.filter((source) => source !== params.metaSource)
      ];
      for (const source of orderedSources) {
        const firstChunk = await readFirstChunkFromSource({
          source,
          tokenId: params.tokenId,
          diagnostics: params.diagnostics,
          options: params.options
        });
        if (firstChunk) {
          const chunkSourceId = sourceIdOf(source);
          params.diagnostics.chunkSourceId = chunkSourceId;
          params.diagnostics.fallbackUsed = params.diagnostics.fallbackUsed || chunkSourceId !== params.diagnostics.requestedSourceId;
          return {
            source,
            preloadedChunks: /* @__PURE__ */ new Map([["0", firstChunk]])
          };
        }
      }
      params.diagnostics.missingChunks.push(0n);
      throw new ReconstructionContentError("missing-chunk", "Missing chunk 0", params.diagnostics);
    }, "selectChunkSource");
    readTokenUri = /* @__PURE__ */ __name(async (params) => {
      if (!params.source.readers.getTokenUri) {
        return null;
      }
      try {
        return await params.source.readers.getTokenUri(params.tokenId);
      } catch (error) {
        recordReadError(params.diagnostics, {
          sourceId: sourceIdOf(params.source),
          operation: "token-uri",
          message: errorMessage(error)
        });
        const terminalError = asTerminalReadError(error, params.diagnostics, params.options);
        if (terminalError) {
          throw terminalError;
        }
        return null;
      }
    }, "readTokenUri");
    createDependencyReaders = /* @__PURE__ */ __name((source, diagnostics) => ({
      getDependencies: /* @__PURE__ */ __name(async (tokenId) => {
        try {
          return await source.readers.getDependencies(tokenId);
        } catch (error) {
          recordReadError(diagnostics, {
            sourceId: sourceIdOf(source),
            operation: "dependencies",
            message: errorMessage(error)
          });
          throw error;
        }
      }, "getDependencies")
    }), "createDependencyReaders");
    verificationForPayload = /* @__PURE__ */ __name((params) => {
      const verification = verifyPayload(params.bytes, params.meta.finalHash);
      if (params.bytes.length < params.expectedSize) {
        return {
          ...verification,
          ok: false,
          reason: "short-content"
        };
      }
      return verification;
    }, "verificationForPayload");
    reconstructXtrataInscription = /* @__PURE__ */ __name(async (options) => {
      if (options.sources.length === 0) {
        throw new ReconstructionContentError(
          "metadata-not-found",
          "At least one reconstruction source is required."
        );
      }
      const diagnostics = createDiagnostics(sourceIdOf(options.sources[0]));
      const { source: metaSource, meta } = await readMetaFromSources({
        tokenId: options.tokenId,
        sources: options.sources,
        diagnostics,
        options
      });
      if (options.strict && meta.sealed === false) {
        throw new ReconstructionContentError(
          "unsealed",
          `Inscription ${options.tokenId.toString()} is not sealed.`,
          diagnostics
        );
      }
      const totalChunks = resolveTotalChunks(meta);
      const expectedSize = safeNumberFromBigInt(
        meta.totalSize,
        "unsafe-total-size",
        "Total size",
        diagnostics
      );
      const { source: chunkSource, preloadedChunks } = await selectChunkSource({
        tokenId: options.tokenId,
        metaSource,
        sources: options.sources,
        totalChunks,
        diagnostics,
        options
      });
      const chunks = await readChunksFromSource({
        source: chunkSource,
        tokenId: options.tokenId,
        totalChunks,
        diagnostics,
        preloadedChunks,
        options
      });
      const bytes2 = assembleChunks(chunks);
      const normalizedBytes = bytes2.length > expectedSize ? bytes2.slice(0, expectedSize) : bytes2;
      const verification = verificationForPayload({
        bytes: normalizedBytes,
        meta,
        expectedSize
      });
      if (options.strict && !verification.ok) {
        throw new ReconstructionVerificationError(verification, diagnostics);
      }
      const dependencies = await resolveDependencies(
        options.tokenId,
        createDependencyReaders(metaSource, diagnostics),
        options
      );
      const tokenUri = await readTokenUri({
        tokenId: options.tokenId,
        source: metaSource,
        diagnostics,
        options
      });
      return {
        tokenId: options.tokenId,
        mimeType: meta.mimeType ?? null,
        tokenUri,
        bytes: normalizedBytes,
        chunkCount: totalChunks,
        dependencies,
        verification,
        diagnostics
      };
    }, "reconstructXtrataInscription");
  }
});

// ../src/lib/protocol/clarity.ts
var ClarityParseError, formatType, fail, unwrapResponse, expectOptional, expectTuple, expectList, expectUInt, expectBuffer, expectStringAscii, expectBool, expectPrincipal, getTupleValue;
var init_clarity2 = __esm({
  "../src/lib/protocol/clarity.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_esm3();
    ClarityParseError = class extends Error {
      static {
        __name(this, "ClarityParseError");
      }
      constructor(message) {
        super(message);
        this.name = "ClarityParseError";
      }
    };
    formatType = /* @__PURE__ */ __name((value) => {
      const name = ClarityType[value.type];
      return name ?? `Unknown(${value.type})`;
    }, "formatType");
    fail = /* @__PURE__ */ __name((context, expected, value) => {
      throw new ClarityParseError(
        `Expected ${expected} for ${context}, got ${formatType(value)}`
      );
    }, "fail");
    unwrapResponse = /* @__PURE__ */ __name((value, context) => {
      if (value.type === ClarityType.ResponseOk) {
        return { ok: true, value: value.value };
      }
      if (value.type === ClarityType.ResponseErr) {
        return { ok: false, value: value.value };
      }
      return fail(context, "response", value);
    }, "unwrapResponse");
    expectOptional = /* @__PURE__ */ __name((value, context) => {
      if (value.type === ClarityType.OptionalNone) {
        return null;
      }
      if (value.type === ClarityType.OptionalSome) {
        return value.value;
      }
      return fail(context, "optional", value);
    }, "expectOptional");
    expectTuple = /* @__PURE__ */ __name((value, context) => {
      if (value.type !== ClarityType.Tuple) {
        return fail(context, "tuple", value);
      }
      return value.data;
    }, "expectTuple");
    expectList = /* @__PURE__ */ __name((value, context) => {
      if (value.type !== ClarityType.List) {
        return fail(context, "list", value);
      }
      return value.list;
    }, "expectList");
    expectUInt = /* @__PURE__ */ __name((value, context) => {
      if (value.type !== ClarityType.UInt) {
        return fail(context, "uint", value);
      }
      return value.value;
    }, "expectUInt");
    expectBuffer = /* @__PURE__ */ __name((value, context) => {
      if (value.type !== ClarityType.Buffer) {
        return fail(context, "buffer", value);
      }
      return value.buffer;
    }, "expectBuffer");
    expectStringAscii = /* @__PURE__ */ __name((value, context) => {
      if (value.type !== ClarityType.StringASCII) {
        return fail(context, "string-ascii", value);
      }
      return value.data;
    }, "expectStringAscii");
    expectBool = /* @__PURE__ */ __name((value, context) => {
      if (value.type === ClarityType.BoolTrue) {
        return true;
      }
      if (value.type === ClarityType.BoolFalse) {
        return false;
      }
      return fail(context, "bool", value);
    }, "expectBool");
    expectPrincipal = /* @__PURE__ */ __name((value, context) => {
      if (value.type !== ClarityType.PrincipalStandard && value.type !== ClarityType.PrincipalContract) {
        return fail(context, "principal", value);
      }
      return principalToString(value);
    }, "expectPrincipal");
    getTupleValue = /* @__PURE__ */ __name((tuple, key, context) => {
      const value = tuple[key];
      if (!value) {
        throw new ClarityParseError(`Missing tuple key ${key} for ${context}`);
      }
      return value;
    }, "getTupleValue");
  }
});

// ../src/lib/protocol/types.ts
var CONTRACT_ERROR_CODES, ContractCallError;
var init_types2 = __esm({
  "../src/lib/protocol/types.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    CONTRACT_ERROR_CODES = {
      "100": "ERR_NOT_AUTHORIZED",
      "101": "ERR_NOT_FOUND",
      "102": "ERR_INVALID_BATCH",
      "103": "ERR_HASH_MISMATCH",
      "104": "ERR_ALREADY_SEALED",
      "105": "ERR_METADATA_FROZEN",
      "106": "ERR_WRONG_INDEX",
      "107": "ERR_INVALID_URI",
      "109": "ERR_PAUSED",
      "110": "ERR_INVALID_FEE",
      "111": "ERR_DEPENDENCY_MISSING",
      "116": "ERR_PARENT_MISSING",
      "117": "ERR_PARENT_NOT_OWNED"
    };
    ContractCallError = class extends Error {
      static {
        __name(this, "ContractCallError");
      }
      code;
      errorName;
      constructor(code, name) {
        const message = name ? `Contract error ${name} (u${code.toString()})` : `Contract error u${code.toString()}`;
        super(message);
        this.name = "ContractCallError";
        this.code = code;
        this.errorName = name;
      }
    };
  }
});

// ../src/lib/chunking/hash.ts
var CHUNK_SIZE2, EMPTY_HASH2;
var init_hash = __esm({
  "../src/lib/chunking/hash.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    CHUNK_SIZE2 = 16384;
    EMPTY_HASH2 = new Uint8Array(32);
  }
});

// ../src/lib/protocol/parsers.ts
var estimateTotalChunks, decodeContractError, expectContractOk, parseOptionalString, parseOptionalBuffer, parseInscriptionMetaTuple, parseGetLastTokenId, parseGetTokenUri, parseGetInscriptionMeta, parseGetChunk, parseGetChunkBatch, parseGetDependencies;
var init_parsers = __esm({
  "../src/lib/protocol/parsers.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_clarity2();
    init_types2();
    init_hash();
    estimateTotalChunks = /* @__PURE__ */ __name((totalSize) => {
      if (totalSize <= 0n) {
        return 0n;
      }
      const chunkSize = BigInt(CHUNK_SIZE2);
      return (totalSize + chunkSize - 1n) / chunkSize;
    }, "estimateTotalChunks");
    decodeContractError = /* @__PURE__ */ __name((value, context) => {
      const code = expectUInt(value, context);
      const name = CONTRACT_ERROR_CODES[code.toString()];
      return new ContractCallError(code, name);
    }, "decodeContractError");
    expectContractOk = /* @__PURE__ */ __name((value, context) => {
      const response = unwrapResponse(value, context);
      if (!response.ok) {
        throw decodeContractError(response.value, `${context} error`);
      }
      return response.value;
    }, "expectContractOk");
    parseOptionalString = /* @__PURE__ */ __name((value, context) => {
      const optional = expectOptional(value, context);
      if (!optional) {
        return null;
      }
      return expectStringAscii(optional, context);
    }, "parseOptionalString");
    parseOptionalBuffer = /* @__PURE__ */ __name((value, context) => {
      const optional = expectOptional(value, context);
      if (!optional) {
        return null;
      }
      return expectBuffer(optional, context);
    }, "parseOptionalBuffer");
    parseInscriptionMetaTuple = /* @__PURE__ */ __name((tupleValue, context) => {
      const tuple = expectTuple(tupleValue, context);
      const owner = expectPrincipal(getTupleValue(tuple, "owner", context), `${context}.owner`);
      const creatorEntry = tuple["creator"];
      const creator = creatorEntry === void 0 ? null : expectPrincipal(creatorEntry, `${context}.creator`);
      const mimeType = expectStringAscii(
        getTupleValue(tuple, "mime-type", context),
        `${context}.mime-type`
      );
      const totalSize = expectUInt(
        getTupleValue(tuple, "total-size", context),
        `${context}.total-size`
      );
      const totalChunksEntry = tuple["total-chunks"];
      const totalChunks = totalChunksEntry === void 0 ? estimateTotalChunks(totalSize) : expectUInt(totalChunksEntry, `${context}.total-chunks`);
      const sealed = expectBool(getTupleValue(tuple, "sealed", context), `${context}.sealed`);
      const finalHash = expectBuffer(
        getTupleValue(tuple, "final-hash", context),
        `${context}.final-hash`
      );
      return {
        owner,
        creator,
        mimeType,
        totalSize,
        totalChunks,
        sealed,
        finalHash
      };
    }, "parseInscriptionMetaTuple");
    parseGetLastTokenId = /* @__PURE__ */ __name((value) => expectUInt(expectContractOk(value, "get-last-token-id"), "get-last-token-id"), "parseGetLastTokenId");
    parseGetTokenUri = /* @__PURE__ */ __name((value) => parseOptionalString(expectContractOk(value, "get-token-uri"), "get-token-uri"), "parseGetTokenUri");
    parseGetInscriptionMeta = /* @__PURE__ */ __name((value) => {
      const optional = expectOptional(value, "get-inscription-meta");
      if (!optional) {
        return null;
      }
      return parseInscriptionMetaTuple(optional, "get-inscription-meta");
    }, "parseGetInscriptionMeta");
    parseGetChunk = /* @__PURE__ */ __name((value) => parseOptionalBuffer(value, "get-chunk"), "parseGetChunk");
    parseGetChunkBatch = /* @__PURE__ */ __name((value) => {
      const list = expectList(value, "get-chunk-batch");
      return list.map(
        (entry, index) => parseOptionalBuffer(entry, `get-chunk-batch[${index}]`)
      );
    }, "parseGetChunkBatch");
    parseGetDependencies = /* @__PURE__ */ __name((value) => {
      const list = expectList(value, "get-dependencies");
      return list.map(
        (entry, index) => expectUInt(entry, `get-dependencies[${index}]`)
      );
    }, "parseGetDependencies");
  }
});

// lib/hiro-keys.ts
var HIRO_RETRYABLE_STATUSES, toNonEmpty, splitList, appendUnique, getNumberedHiroKeys, getHiroApiKeys, applyHiroApiKey, shouldRetryWithNextHiroKey;
var init_hiro_keys = __esm({
  "lib/hiro-keys.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    HIRO_RETRYABLE_STATUSES = /* @__PURE__ */ new Set([401, 403, 429]);
    toNonEmpty = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }, "toNonEmpty");
    splitList = /* @__PURE__ */ __name((value) => {
      const normalized = toNonEmpty(value);
      if (!normalized) {
        return [];
      }
      return normalized.split(/[\s,]+/).map((entry) => entry.trim()).filter((entry) => entry.length > 0);
    }, "splitList");
    appendUnique = /* @__PURE__ */ __name((target, values) => {
      values.forEach((value) => {
        if (!target.includes(value)) {
          target.push(value);
        }
      });
    }, "appendUnique");
    getNumberedHiroKeys = /* @__PURE__ */ __name((env) => {
      return Object.entries(env).map(([name, value]) => {
        const match2 = /^HIRO_API_KEY_(\d+)$/.exec(name);
        if (!match2) {
          return null;
        }
        const normalized = toNonEmpty(value);
        if (!normalized) {
          return null;
        }
        return {
          index: Number.parseInt(match2[1], 10),
          value: normalized
        };
      }).filter((entry) => entry !== null).sort((left, right) => left.index - right.index).map((entry) => entry.value);
    }, "getNumberedHiroKeys");
    getHiroApiKeys = /* @__PURE__ */ __name((env) => {
      const keys = [];
      appendUnique(keys, getNumberedHiroKeys(env));
      appendUnique(keys, splitList(env.HIRO_API_KEYS));
      appendUnique(keys, splitList(env.HIRO_API_KEY));
      appendUnique(keys, splitList(env.VITE_HIRO_API_KEY));
      return keys;
    }, "getHiroApiKeys");
    applyHiroApiKey = /* @__PURE__ */ __name((headers, apiKey) => {
      headers.delete("x-hiro-api-key");
      headers.delete("x-api-key");
      if (!apiKey) {
        return;
      }
      headers.set("x-hiro-api-key", apiKey);
      headers.set("x-api-key", apiKey);
    }, "applyHiroApiKey");
    shouldRetryWithNextHiroKey = /* @__PURE__ */ __name((status) => HIRO_RETRYABLE_STATUSES.has(status), "shouldRetryWithNextHiroKey");
  }
});

// runtime/lib.ts
var RUNTIME_MAX_READ_BATCH_SIZE, DEFAULT_RUNTIME_READ_BATCH_SIZE, DEFAULT_RUNTIME_CHUNK_CONCURRENCY, DEFAULT_RUNTIME_CHUNK_RETRIES, MAINNET_BASES, TESTNET_BASES, sanitizeBase, dedupeBases, bytesToHex3, encodeUintArg, encodeUintListArg, asError, createRuntimeUpstreamRequestTracker, isCloudflareSubrequestQuotaError, parseRuntimeNetwork, parseRuntimeContractRef, parseRuntimeTokenId, getRuntimeApiBases, isSameRuntimeContract, callRuntimeReadOnly, fetchRuntimeMeta, fetchRuntimeChunk, fetchRuntimeChunkBatch, fetchRuntimeLastTokenId, fetchRuntimeTokenUri, fetchRuntimeDependencies, wait, parsePositiveInteger, parseNonNegativeInteger, getRuntimeReadConfig, getErrorMessage, isCostBalanceExceeded, formatRuntimeContractId, syncRuntimeUpstreamRequests, attachRuntimeDiagnosticsToError, getRuntimeContentReader, buildRuntimeReconstructionSource, buildRuntimeReconstructionSources, parseRuntimeContractId, fetchRuntimeChunkWithRetry, fetchRuntimeChunkBatchWithRetry, resolveRuntimeMeta, resolveRuntimeContent;
var init_lib = __esm({
  "runtime/lib.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_esm3();
    init_src();
    init_parsers();
    init_module_paths();
    init_hiro_keys();
    RUNTIME_MAX_READ_BATCH_SIZE = 30;
    DEFAULT_RUNTIME_READ_BATCH_SIZE = RUNTIME_MAX_READ_BATCH_SIZE;
    DEFAULT_RUNTIME_CHUNK_CONCURRENCY = 4;
    DEFAULT_RUNTIME_CHUNK_RETRIES = 2;
    MAINNET_BASES = ["https://api.mainnet.hiro.so", "https://stacks-node-api.mainnet.stacks.co"];
    TESTNET_BASES = ["https://api.testnet.hiro.so", "https://stacks-node-api.testnet.stacks.co"];
    sanitizeBase = /* @__PURE__ */ __name((value) => value.trim().replace(/\/+$/, ""), "sanitizeBase");
    dedupeBases = /* @__PURE__ */ __name((values) => {
      const output2 = [];
      for (const value of values) {
        const normalized = sanitizeBase(value);
        if (!normalized || output2.includes(normalized)) {
          continue;
        }
        output2.push(normalized);
      }
      return output2;
    }, "dedupeBases");
    bytesToHex3 = /* @__PURE__ */ __name((bytes2) => Array.from(bytes2).map((entry) => entry.toString(16).padStart(2, "0")).join(""), "bytesToHex");
    encodeUintArg = /* @__PURE__ */ __name((value) => `0x${bytesToHex3(serializeCV(uintCV(value)))}`, "encodeUintArg");
    encodeUintListArg = /* @__PURE__ */ __name((values) => `0x${bytesToHex3(serializeCV(listCV(values.map((value) => uintCV(value)))))}`, "encodeUintListArg");
    asError = /* @__PURE__ */ __name((value) => value instanceof Error ? value : new Error(String(value)), "asError");
    createRuntimeUpstreamRequestTracker = /* @__PURE__ */ __name(() => ({
      attempts: 0
    }), "createRuntimeUpstreamRequestTracker");
    isCloudflareSubrequestQuotaError = /* @__PURE__ */ __name((error) => {
      const message = asError(error).message.toLowerCase();
      return message.includes("subrequest") && (message.includes("too many") || message.includes("limit") || message.includes("quota") || message.includes("exceed")) || message.includes("worker exceeded resource limits");
    }, "isCloudflareSubrequestQuotaError");
    parseRuntimeNetwork = /* @__PURE__ */ __name((value) => {
      const normalized = String(value || "mainnet").trim().toLowerCase();
      return normalized === "testnet" ? "testnet" : "mainnet";
    }, "parseRuntimeNetwork");
    parseRuntimeContractRef = /* @__PURE__ */ __name((value) => parseRuntimeModuleContractId(value), "parseRuntimeContractRef");
    parseRuntimeTokenId = /* @__PURE__ */ __name((value) => {
      if (!value || !/^\d+$/.test(value.trim())) {
        return null;
      }
      try {
        return BigInt(value.trim());
      } catch {
        return null;
      }
    }, "parseRuntimeTokenId");
    getRuntimeApiBases = /* @__PURE__ */ __name((network, env) => {
      const configured = network === "mainnet" ? [
        env.ARCADE_HIRO_API_BASE_MAINNET,
        env.HIRO_API_BASE_MAINNET,
        env.VITE_STACKS_API_MAINNET,
        env.VITE_HIRO_API_MAINNET
      ] : [
        env.ARCADE_HIRO_API_BASE_TESTNET,
        env.HIRO_API_BASE_TESTNET,
        env.VITE_STACKS_API_TESTNET,
        env.VITE_HIRO_API_TESTNET
      ];
      const defaults = network === "mainnet" ? MAINNET_BASES : TESTNET_BASES;
      return dedupeBases(
        configured.filter((value) => typeof value === "string" && value.trim().length > 0).concat(defaults)
      );
    }, "getRuntimeApiBases");
    isSameRuntimeContract = /* @__PURE__ */ __name((left, right) => left.address === right.address && left.contractName === right.contractName, "isSameRuntimeContract");
    callRuntimeReadOnly = /* @__PURE__ */ __name(async (params) => {
      const { env, apiBases } = params;
      const hiroKeys = getHiroApiKeys(env);
      let lastError = null;
      for (const base of apiBases) {
        const endpoint = `${base}/v2/contracts/call-read/${params.contract.address}/${params.contract.contractName}/${params.functionName}`;
        const keyCandidates = base.includes("hiro.so") && hiroKeys.length > 0 ? hiroKeys : [null];
        for (let keyIndex = 0; keyIndex < keyCandidates.length; keyIndex += 1) {
          const keyCandidate = keyCandidates[keyIndex];
          const hasNextKey = keyIndex < keyCandidates.length - 1;
          try {
            const headers = new Headers({
              "Content-Type": "application/json"
            });
            applyHiroApiKey(headers, keyCandidate);
            if (params.upstreamTracker) {
              params.upstreamTracker.attempts += 1;
            }
            const response = await fetch(endpoint, {
              method: "POST",
              headers,
              body: JSON.stringify({
                sender: params.senderAddress,
                arguments: params.functionArgs
              })
            });
            if (!response.ok) {
              lastError = new Error(`HTTP ${response.status} from ${base}`);
              if (hasNextKey && shouldRetryWithNextHiroKey(response.status)) {
                continue;
              }
              break;
            }
            const body = await response.json();
            if (!body || body.okay !== true || typeof body.result !== "string") {
              const cause = body && body.cause ? String(body.cause) : "Invalid read-only response.";
              throw new Error(cause);
            }
            return deserializeCV(body.result);
          } catch (error) {
            lastError = asError(error);
            if (isCloudflareSubrequestQuotaError(error)) {
              throw lastError;
            }
            break;
          }
        }
      }
      throw lastError || new Error("Read-only call failed.");
    }, "callRuntimeReadOnly");
    fetchRuntimeMeta = /* @__PURE__ */ __name(async (params) => {
      const value = await callRuntimeReadOnly({
        env: params.env,
        apiBases: params.apiBases,
        contract: params.contract,
        functionName: "get-inscription-meta",
        functionArgs: [encodeUintArg(params.tokenId)],
        senderAddress: params.contract.address,
        upstreamTracker: params.upstreamTracker
      });
      return parseGetInscriptionMeta(value);
    }, "fetchRuntimeMeta");
    fetchRuntimeChunk = /* @__PURE__ */ __name(async (params) => {
      const value = await callRuntimeReadOnly({
        env: params.env,
        apiBases: params.apiBases,
        contract: params.contract,
        functionName: "get-chunk",
        functionArgs: [encodeUintArg(params.tokenId), encodeUintArg(params.index)],
        senderAddress: params.contract.address,
        upstreamTracker: params.upstreamTracker
      });
      return parseGetChunk(value);
    }, "fetchRuntimeChunk");
    fetchRuntimeChunkBatch = /* @__PURE__ */ __name(async (params) => {
      if (params.indexes.length === 0) {
        return [];
      }
      const value = await callRuntimeReadOnly({
        env: params.env,
        apiBases: params.apiBases,
        contract: params.contract,
        functionName: "get-chunk-batch",
        functionArgs: [encodeUintArg(params.tokenId), encodeUintListArg(params.indexes)],
        senderAddress: params.contract.address,
        upstreamTracker: params.upstreamTracker
      });
      return parseGetChunkBatch(value);
    }, "fetchRuntimeChunkBatch");
    fetchRuntimeLastTokenId = /* @__PURE__ */ __name(async (params) => {
      const value = await callRuntimeReadOnly({
        env: params.env,
        apiBases: params.apiBases,
        contract: params.contract,
        functionName: "get-last-token-id",
        functionArgs: [],
        senderAddress: params.contract.address,
        upstreamTracker: params.upstreamTracker
      });
      return parseGetLastTokenId(value);
    }, "fetchRuntimeLastTokenId");
    fetchRuntimeTokenUri = /* @__PURE__ */ __name(async (params) => {
      const value = await callRuntimeReadOnly({
        env: params.env,
        apiBases: params.apiBases,
        contract: params.contract,
        functionName: "get-token-uri",
        functionArgs: [encodeUintArg(params.tokenId)],
        senderAddress: params.contract.address,
        upstreamTracker: params.upstreamTracker
      });
      return parseGetTokenUri(value);
    }, "fetchRuntimeTokenUri");
    fetchRuntimeDependencies = /* @__PURE__ */ __name(async (params) => {
      const value = await callRuntimeReadOnly({
        env: params.env,
        apiBases: params.apiBases,
        contract: params.contract,
        functionName: "get-dependencies",
        functionArgs: [encodeUintArg(params.tokenId)],
        senderAddress: params.contract.address,
        upstreamTracker: params.upstreamTracker
      });
      return parseGetDependencies(value);
    }, "fetchRuntimeDependencies");
    wait = /* @__PURE__ */ __name((ms) => new Promise((resolve) => {
      setTimeout(resolve, ms);
    }), "wait");
    parsePositiveInteger = /* @__PURE__ */ __name((value, fallback, max) => {
      const parsed = typeof value === "string" && value.trim().length > 0 ? Number.parseInt(value.trim(), 10) : Number.NaN;
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
      }
      return Math.max(1, Math.min(max, parsed));
    }, "parsePositiveInteger");
    parseNonNegativeInteger = /* @__PURE__ */ __name((value, fallback, max) => {
      const parsed = typeof value === "string" && value.trim().length > 0 ? Number.parseInt(value.trim(), 10) : Number.NaN;
      if (!Number.isFinite(parsed) || parsed < 0) {
        return fallback;
      }
      return Math.max(0, Math.min(max, parsed));
    }, "parseNonNegativeInteger");
    getRuntimeReadConfig = /* @__PURE__ */ __name((env) => ({
      batchSize: parsePositiveInteger(
        env.RUNTIME_CONTENT_READ_BATCH_SIZE,
        DEFAULT_RUNTIME_READ_BATCH_SIZE,
        RUNTIME_MAX_READ_BATCH_SIZE
      ),
      concurrency: parsePositiveInteger(
        env.RUNTIME_CONTENT_READ_CONCURRENCY,
        DEFAULT_RUNTIME_CHUNK_CONCURRENCY,
        8
      ),
      retries: parseNonNegativeInteger(
        env.RUNTIME_CONTENT_READ_RETRIES,
        DEFAULT_RUNTIME_CHUNK_RETRIES,
        5
      )
    }), "getRuntimeReadConfig");
    getErrorMessage = /* @__PURE__ */ __name((error) => error instanceof Error ? error.message : String(error), "getErrorMessage");
    isCostBalanceExceeded = /* @__PURE__ */ __name((error) => getErrorMessage(error).toLowerCase().includes("costbalanceexceeded"), "isCostBalanceExceeded");
    formatRuntimeContractId = /* @__PURE__ */ __name((contract) => `${contract.address}.${contract.contractName}`, "formatRuntimeContractId");
    syncRuntimeUpstreamRequests = /* @__PURE__ */ __name((diagnostics, upstreamTracker) => {
      const runtimeDiagnostics = diagnostics;
      runtimeDiagnostics.upstreamRequests = upstreamTracker.attempts;
      return runtimeDiagnostics;
    }, "syncRuntimeUpstreamRequests");
    attachRuntimeDiagnosticsToError = /* @__PURE__ */ __name((error, diagnostics) => {
      if (error && typeof error === "object") {
        error.diagnostics = diagnostics;
      }
    }, "attachRuntimeDiagnosticsToError");
    getRuntimeContentReader = /* @__PURE__ */ __name((reader) => ({
      fetchMeta: reader?.fetchMeta ?? fetchRuntimeMeta,
      fetchChunk: reader?.fetchChunk ?? fetchRuntimeChunk,
      fetchChunkBatch: reader?.fetchChunkBatch ?? fetchRuntimeChunkBatch
    }), "getRuntimeContentReader");
    buildRuntimeReconstructionSource = /* @__PURE__ */ __name((params) => ({
      sourceId: formatRuntimeContractId(params.contract),
      readers: {
        getInscriptionMeta: /* @__PURE__ */ __name(async (tokenId) => {
          const meta = params.metaOverride ?? await params.read.fetchMeta({
            env: params.env,
            apiBases: params.apiBases,
            contract: params.contract,
            tokenId,
            upstreamTracker: params.upstreamTracker
          });
          if (meta) {
            params.metaBySourceId?.set(formatRuntimeContractId(params.contract), meta);
          }
          return meta;
        }, "getInscriptionMeta"),
        getChunk: /* @__PURE__ */ __name((tokenId, index) => fetchRuntimeChunkWithRetry({
          env: params.env,
          apiBases: params.apiBases,
          contract: params.contract,
          tokenId,
          index,
          retries: params.retries,
          upstreamTracker: params.upstreamTracker,
          read: params.read
        }), "getChunk"),
        getChunkBatch: /* @__PURE__ */ __name(async (tokenId, indexes) => {
          const entries = await fetchRuntimeChunkBatchWithRetry({
            env: params.env,
            apiBases: params.apiBases,
            contract: params.contract,
            tokenId,
            indexes,
            retries: params.retries,
            upstreamTracker: params.upstreamTracker,
            read: params.read
          });
          return entries.map((entry) => entry.chunk);
        }, "getChunkBatch"),
        getDependencies: /* @__PURE__ */ __name(async () => [], "getDependencies")
      }
    }), "buildRuntimeReconstructionSource");
    buildRuntimeReconstructionSources = /* @__PURE__ */ __name((params) => {
      const getMetaOverride = /* @__PURE__ */ __name((contract) => params.resolvedMeta && isSameRuntimeContract(params.resolvedMeta.contract, contract) ? params.resolvedMeta.meta : null, "getMetaOverride");
      const sources = [
        buildRuntimeReconstructionSource({
          env: params.env,
          apiBases: params.apiBases,
          contract: params.primaryContract,
          read: params.read,
          retries: params.retries,
          upstreamTracker: params.upstreamTracker,
          metaOverride: getMetaOverride(params.primaryContract),
          metaBySourceId: params.metaBySourceId
        })
      ];
      if (params.fallbackContract && !isSameRuntimeContract(params.primaryContract, params.fallbackContract)) {
        sources.push(
          buildRuntimeReconstructionSource({
            env: params.env,
            apiBases: params.apiBases,
            contract: params.fallbackContract,
            read: params.read,
            retries: params.retries,
            upstreamTracker: params.upstreamTracker,
            metaOverride: getMetaOverride(params.fallbackContract),
            metaBySourceId: params.metaBySourceId
          })
        );
      }
      return sources;
    }, "buildRuntimeReconstructionSources");
    parseRuntimeContractId = /* @__PURE__ */ __name((sourceId) => {
      if (!sourceId) {
        return null;
      }
      return parseRuntimeContractRef(sourceId);
    }, "parseRuntimeContractId");
    fetchRuntimeChunkWithRetry = /* @__PURE__ */ __name(async (params) => {
      let lastError = null;
      for (let attempt = 0; attempt <= params.retries; attempt += 1) {
        try {
          const chunk = await params.read.fetchChunk(params);
          if (!chunk || chunk.length === 0) {
            throw new Error(`Missing chunk ${params.index.toString()}.`);
          }
          return chunk;
        } catch (error) {
          lastError = asError(error);
          if (isCloudflareSubrequestQuotaError(error)) {
            throw lastError;
          }
          if (isCostBalanceExceeded(error)) {
            break;
          }
          if (attempt < params.retries) {
            await wait(150 * Math.pow(2, attempt));
          }
        }
      }
      throw lastError || new Error(`Missing chunk ${params.index.toString()}.`);
    }, "fetchRuntimeChunkWithRetry");
    fetchRuntimeChunkBatchWithRetry = /* @__PURE__ */ __name(async (params) => {
      let lastError = null;
      for (let attempt = 0; attempt <= params.retries; attempt += 1) {
        try {
          const batch = await params.read.fetchChunkBatch(params);
          return params.indexes.map((index, position) => ({
            index,
            chunk: batch[position] ?? null
          }));
        } catch (error) {
          lastError = asError(error);
          if (isCloudflareSubrequestQuotaError(error)) {
            throw lastError;
          }
          if (isCostBalanceExceeded(error)) {
            break;
          }
          if (attempt < params.retries) {
            await wait(150 * Math.pow(2, attempt));
          }
        }
      }
      throw lastError || new Error("Missing chunk batch.");
    }, "fetchRuntimeChunkBatchWithRetry");
    resolveRuntimeMeta = /* @__PURE__ */ __name(async (params) => {
      const read = getRuntimeContentReader(params.read);
      let primaryMeta = null;
      let primaryMetaError = null;
      try {
        primaryMeta = await read.fetchMeta({
          env: params.env,
          apiBases: params.apiBases,
          contract: params.primaryContract,
          tokenId: params.tokenId,
          upstreamTracker: params.upstreamTracker
        });
      } catch (error) {
        primaryMetaError = asError(error);
        if (isCloudflareSubrequestQuotaError(error)) {
          throw primaryMetaError;
        }
      }
      let activeContract = params.primaryContract;
      let activeMeta = primaryMeta;
      if (!activeMeta && params.fallbackContract && !isSameRuntimeContract(params.primaryContract, params.fallbackContract)) {
        const fallbackMeta = await read.fetchMeta({
          env: params.env,
          apiBases: params.apiBases,
          contract: params.fallbackContract,
          tokenId: params.tokenId,
          upstreamTracker: params.upstreamTracker
        });
        if (fallbackMeta) {
          activeContract = params.fallbackContract;
          activeMeta = fallbackMeta;
        }
      }
      if (!activeMeta) {
        throw primaryMetaError || new Error("Inscription metadata not found.");
      }
      return {
        contract: activeContract,
        meta: activeMeta
      };
    }, "resolveRuntimeMeta");
    resolveRuntimeContent = /* @__PURE__ */ __name(async (params) => {
      const read = getRuntimeContentReader(params.read);
      const readConfig = getRuntimeReadConfig(params.env);
      const upstreamTracker = params.upstreamTracker ?? createRuntimeUpstreamRequestTracker();
      const metaBySourceId = /* @__PURE__ */ new Map();
      if (params.resolvedMeta) {
        metaBySourceId.set(
          formatRuntimeContractId(params.resolvedMeta.contract),
          params.resolvedMeta.meta
        );
      }
      const sources = buildRuntimeReconstructionSources({
        env: params.env,
        apiBases: params.apiBases,
        primaryContract: params.primaryContract,
        fallbackContract: params.fallbackContract,
        read,
        retries: readConfig.retries,
        upstreamTracker,
        resolvedMeta: params.resolvedMeta,
        metaBySourceId
      });
      let result;
      try {
        result = await reconstructXtrataInscription({
          tokenId: params.tokenId,
          sources,
          strict: true,
          batchSize: readConfig.batchSize,
          concurrency: readConfig.concurrency,
          isTerminalReadError: isCloudflareSubrequestQuotaError,
          maxNodes: 1
        });
      } catch (error) {
        const diagnostics2 = error.diagnostics;
        if (diagnostics2) {
          attachRuntimeDiagnosticsToError(error, syncRuntimeUpstreamRequests(diagnostics2, upstreamTracker));
        }
        throw error;
      }
      const diagnostics = syncRuntimeUpstreamRequests(result.diagnostics, upstreamTracker);
      const metaSourceId = diagnostics.metaSourceId;
      const meta = metaSourceId ? metaBySourceId.get(metaSourceId) : null;
      if (!meta) {
        throw new Error("Reconstruction metadata was not retained by runtime reader.");
      }
      const contract = parseRuntimeContractId(diagnostics.chunkSourceId) ?? parseRuntimeContractId(diagnostics.metaSourceId) ?? params.resolvedMeta?.contract ?? params.primaryContract;
      return {
        contract,
        meta,
        bytes: result.bytes,
        diagnostics
      };
    }, "resolveRuntimeContent");
  }
});

// runtime/modules/source-transform.ts
var REMAPPABLE_URL_PATTERN, RUNTIME_URL_HELPER, replaceRelativeRuntimeApi, replaceLocationHrefUrlBase, transformRuntimeModuleSource, isTransformableRuntimeModulePath;
var init_source_transform = __esm({
  "runtime/modules/source-transform.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    REMAPPABLE_URL_PATTERN = /^(?:\.\.?\/|\/|https?:\/\/)/i;
    RUNTIME_URL_HELPER = `const __xtrataResolveRuntimeModuleUrl = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    const currentUrl = new URL(import.meta.url);
    const resolvedUrl = new URL(value, currentUrl);
    const runtimePrefix = '/runtime/modules/';
    const workspacePrefix = '/on-chain-modules/workspace/';
    const workspaceRoots = ['/System/', '/Plugins/', '/Samples/', '/Presets/', '/Assets/', '/Themes/', '/Skins/', '/Modules/', '/Instruments/', '/Effects/'];
    if (resolvedUrl.pathname.startsWith(runtimePrefix)) {
      return resolvedUrl.toString();
    }
    const workspaceIndex = currentUrl.pathname.indexOf(workspacePrefix);
    const isWorkspaceAbsolute =
      resolvedUrl.pathname.startsWith(workspacePrefix) ||
      workspaceRoots.some((prefix) => resolvedUrl.pathname.startsWith(prefix));
    if (
      workspaceIndex !== -1 &&
      resolvedUrl.origin === currentUrl.origin &&
      isWorkspaceAbsolute
    ) {
      const target = new URL(currentUrl.origin + currentUrl.pathname.slice(0, workspaceIndex + workspacePrefix.length));
      if (resolvedUrl.pathname.startsWith(workspacePrefix)) {
        target.pathname = target.pathname + resolvedUrl.pathname.slice(workspacePrefix.length);
      } else {
        target.pathname = target.pathname + resolvedUrl.pathname.slice(1);
      }
      target.search = resolvedUrl.search;
      target.hash = resolvedUrl.hash;
      return target.toString();
    }
    if (/^(?:\\.\\.?\\/)/.test(value)) {
      return resolvedUrl.toString();
    }
  } catch (error) {}
  try {
    if (
      typeof window !== 'undefined' &&
      window &&
      typeof window.__xtrataResolveRuntimeAssetUrl === 'function'
    ) {
      const remapped = window.__xtrataResolveRuntimeAssetUrl(value);
      if (typeof remapped === 'string' && remapped) {
        return remapped;
      }
    }
  } catch (error) {}
  return value;
};
const __xtrataResolveRuntimeDocumentBase = () => {
  try {
    if (
      typeof document !== 'undefined' &&
      document &&
      typeof document.baseURI === 'string' &&
      document.baseURI
    ) {
      return document.baseURI;
    }
  } catch (error) {}
  try {
    if (
      typeof window !== 'undefined' &&
      window &&
      window.location &&
      typeof window.location.href === 'string'
    ) {
      return window.location.href;
    }
  } catch (error) {}
  return '';
};`;
    replaceRelativeRuntimeApi = /* @__PURE__ */ __name((source, pattern) => {
      let changed = false;
      const output2 = source.replace(
        pattern,
        (_match, prefix, quote, value, suffix = "") => {
          if (!REMAPPABLE_URL_PATTERN.test(value)) {
            return _match;
          }
          changed = true;
          return `${prefix}__xtrataResolveRuntimeModuleUrl(${quote}${value}${quote})${suffix}`;
        }
      );
      return {
        source: output2,
        changed
      };
    }, "replaceRelativeRuntimeApi");
    replaceLocationHrefUrlBase = /* @__PURE__ */ __name((source) => {
      let changed = false;
      const output2 = source.replace(
        /new URL\(([\s\S]*?),\s*window\.location\.href\s*\)/g,
        (_match, value) => {
          changed = true;
          return `new URL(${value}, __xtrataResolveRuntimeDocumentBase())`;
        }
      );
      return {
        source: output2,
        changed
      };
    }, "replaceLocationHrefUrlBase");
    transformRuntimeModuleSource = /* @__PURE__ */ __name((source) => {
      let transformed = source;
      let changed = false;
      const addModuleRewrite = replaceRelativeRuntimeApi(
        transformed,
        /(\.addModule\s*\(\s*)(['"`])((?:\.\.?\/|\/|https?:\/\/)[^'"`\r\n]+)\2(\s*(?:,\s*[^)]*)?\))/g
      );
      transformed = addModuleRewrite.source;
      changed ||= addModuleRewrite.changed;
      const workerRewrite = replaceRelativeRuntimeApi(
        transformed,
        /(\bnew\s+(?:Worker|SharedWorker)\s*\(\s*)(['"`])((?:\.\.?\/|\/|https?:\/\/)[^'"`\r\n]+)\2(\s*(?:,\s*[^)]*)?\))/g
      );
      transformed = workerRewrite.source;
      changed ||= workerRewrite.changed;
      const documentBaseRewrite = replaceLocationHrefUrlBase(transformed);
      transformed = documentBaseRewrite.source;
      changed ||= documentBaseRewrite.changed;
      if (!changed) {
        return {
          source,
          changed: false
        };
      }
      return {
        source: `${RUNTIME_URL_HELPER}
${transformed}`,
        changed: true
      };
    }, "transformRuntimeModuleSource");
    isTransformableRuntimeModulePath = /* @__PURE__ */ __name((requestedPath) => {
      const extension = requestedPath.split("/").pop()?.split(".").pop()?.trim().toLowerCase() ?? "";
      return extension === "js" || extension === "mjs" || extension === "cjs";
    }, "isTransformableRuntimeModulePath");
  }
});

// runtime/modules/handler.ts
var CORS_HEADERS, INDEX_CONCURRENCY, MAX_INDEX_CACHE_ENTRIES, PRIMARY_DESCENT_WINDOW, PRIMARY_ASCENT_WINDOW, TOKEN_URI_READ_RETRIES, MAX_DEPENDENCY_WALK_VISITS, GENERIC_SCRIPT_MIME_TYPES, textDecoder, textEncoder, modulePathIndexCache, toPathString, pruneModulePathIndexCache, buildIndexCacheKey, getOrCreateModulePathIndex, wait2, normalizeComparableModulePath, buildTokenSearchOrder, fetchIndexedTokenUri, resolveModuleContentType, buildCanonicalModuleUrl, indexResolvedModulePath, resolveModuleTokenIdFromDependencies, resolveModuleTokenId, badResponse, onRuntimeModulesRequest;
var init_handler = __esm({
  "runtime/modules/handler.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_module_paths();
    init_lib();
    init_source_transform();
    CORS_HEADERS = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
      "Cross-Origin-Resource-Policy": "cross-origin"
    };
    INDEX_CONCURRENCY = 1;
    MAX_INDEX_CACHE_ENTRIES = 8;
    PRIMARY_DESCENT_WINDOW = 128n;
    PRIMARY_ASCENT_WINDOW = 24n;
    TOKEN_URI_READ_RETRIES = 3;
    MAX_DEPENDENCY_WALK_VISITS = 128;
    GENERIC_SCRIPT_MIME_TYPES = /* @__PURE__ */ new Set([
      "",
      "application/octet-stream",
      "binary/octet-stream",
      "text/plain"
    ]);
    textDecoder = new TextDecoder();
    textEncoder = new TextEncoder();
    modulePathIndexCache = /* @__PURE__ */ new Map();
    toPathString = /* @__PURE__ */ __name((value) => Array.isArray(value) ? value.join("/") : value || "", "toPathString");
    pruneModulePathIndexCache = /* @__PURE__ */ __name(() => {
      while (modulePathIndexCache.size > MAX_INDEX_CACHE_ENTRIES) {
        const firstKey = modulePathIndexCache.keys().next().value;
        if (!firstKey) {
          return;
        }
        modulePathIndexCache.delete(firstKey);
      }
    }, "pruneModulePathIndexCache");
    buildIndexCacheKey = /* @__PURE__ */ __name((params) => `${params.network}:${params.contract.address}.${params.contract.contractName}:${params.lastTokenId.toString()}`, "buildIndexCacheKey");
    getOrCreateModulePathIndex = /* @__PURE__ */ __name((cacheKey) => {
      const cached = modulePathIndexCache.get(cacheKey);
      if (cached) {
        return cached;
      }
      const index = /* @__PURE__ */ new Map();
      modulePathIndexCache.set(cacheKey, index);
      pruneModulePathIndexCache();
      return index;
    }, "getOrCreateModulePathIndex");
    wait2 = /* @__PURE__ */ __name((ms) => new Promise((resolve) => {
      setTimeout(resolve, ms);
    }), "wait");
    normalizeComparableModulePath = /* @__PURE__ */ __name((value) => {
      const normalized = normalizeModuleTokenUriPath(value);
      if (!normalized) {
        return null;
      }
      const segments = normalized.split("/");
      while (segments[0] === "on-chain-modules" || segments[0] === "workspace") {
        segments.shift();
      }
      return segments.join("/");
    }, "normalizeComparableModulePath");
    buildTokenSearchOrder = /* @__PURE__ */ __name((lastTokenId, entryTokenId) => {
      const appendRange = /* @__PURE__ */ __name((output2, start, end, step) => {
        if (step === 0n) {
          return;
        }
        if (step > 0n) {
          for (let tokenId = start; tokenId <= end; tokenId += step) {
            output2.push(tokenId);
          }
          return;
        }
        for (let tokenId = start; tokenId >= end; tokenId += step) {
          output2.push(tokenId);
          if (tokenId === end) {
            break;
          }
        }
      }, "appendRange");
      const dedupe = /* @__PURE__ */ __name((values) => {
        const seen = /* @__PURE__ */ new Set();
        const output2 = [];
        for (const value of values) {
          const key = value.toString();
          if (seen.has(key)) {
            continue;
          }
          seen.add(key);
          output2.push(value);
        }
        return output2;
      }, "dedupe");
      if (entryTokenId !== null && entryTokenId >= 0n && entryTokenId <= lastTokenId) {
        const tokenIds2 = [];
        const descentFloor = entryTokenId > PRIMARY_DESCENT_WINDOW ? entryTokenId - PRIMARY_DESCENT_WINDOW : 0n;
        appendRange(tokenIds2, entryTokenId, descentFloor, -1n);
        const ascentCeiling = entryTokenId + PRIMARY_ASCENT_WINDOW < lastTokenId ? entryTokenId + PRIMARY_ASCENT_WINDOW : lastTokenId;
        if (entryTokenId + 1n <= ascentCeiling) {
          appendRange(tokenIds2, entryTokenId + 1n, ascentCeiling, 1n);
        }
        if (descentFloor > 0n) {
          appendRange(tokenIds2, descentFloor - 1n, 0n, -1n);
        }
        if (ascentCeiling < lastTokenId) {
          appendRange(tokenIds2, ascentCeiling + 1n, lastTokenId, 1n);
        }
        return dedupe(tokenIds2);
      }
      const tokenIds = [];
      appendRange(tokenIds, 0n, lastTokenId, 1n);
      return dedupe(tokenIds);
    }, "buildTokenSearchOrder");
    fetchIndexedTokenUri = /* @__PURE__ */ __name(async (params) => {
      let lastError = null;
      for (let attempt = 0; attempt < TOKEN_URI_READ_RETRIES; attempt += 1) {
        try {
          return await fetchRuntimeTokenUri({
            env: params.env,
            apiBases: params.apiBases,
            contract: params.contract,
            tokenId: params.tokenId
          });
        } catch (error) {
          lastError = error;
          if (attempt < TOKEN_URI_READ_RETRIES - 1) {
            await wait2(80 * (attempt + 1));
          }
        }
      }
      throw lastError instanceof Error ? lastError : new Error(String(lastError));
    }, "fetchIndexedTokenUri");
    resolveModuleContentType = /* @__PURE__ */ __name((requestedPath, mimeType) => {
      const normalizedMimeType = (mimeType ?? "").trim().toLowerCase();
      const extension = requestedPath.split("/").pop()?.split(".").pop()?.trim().toLowerCase() ?? "";
      if ((extension === "js" || extension === "mjs" || extension === "cjs") && GENERIC_SCRIPT_MIME_TYPES.has(normalizedMimeType)) {
        return "text/javascript; charset=utf-8";
      }
      if (extension === "css" && GENERIC_SCRIPT_MIME_TYPES.has(normalizedMimeType)) {
        return "text/css; charset=utf-8";
      }
      if ((extension === "json" || extension === "map") && GENERIC_SCRIPT_MIME_TYPES.has(normalizedMimeType)) {
        return "application/json; charset=utf-8";
      }
      if ((extension === "html" || extension === "htm") && GENERIC_SCRIPT_MIME_TYPES.has(normalizedMimeType)) {
        return "text/html; charset=utf-8";
      }
      if (extension === "svg" && GENERIC_SCRIPT_MIME_TYPES.has(normalizedMimeType)) {
        return "image/svg+xml";
      }
      if (extension === "wasm" && GENERIC_SCRIPT_MIME_TYPES.has(normalizedMimeType)) {
        return "application/wasm";
      }
      return mimeType || "application/octet-stream";
    }, "resolveModuleContentType");
    buildCanonicalModuleUrl = /* @__PURE__ */ __name((params) => {
      const url = new URL(params.requestUrl);
      url.pathname = `/runtime/modules/${encodeURIComponent(params.network)}/${encodeURIComponent(params.contract.address)}/${encodeURIComponent(params.contract.contractName)}/${encodeURIComponent(params.tokenId.toString())}/${params.requestedPath.split("/").filter(Boolean).map((segment) => encodeURIComponent(segment)).join("/")}`;
      return url.toString();
    }, "buildCanonicalModuleUrl");
    indexResolvedModulePath = /* @__PURE__ */ __name((params) => {
      const normalizedPath = normalizeModuleTokenUriPath(params.tokenUri);
      if (!normalizedPath) {
        return null;
      }
      if (!params.index.has(normalizedPath)) {
        params.index.set(normalizedPath, params.tokenId);
      }
      const comparablePath = normalizeComparableModulePath(normalizedPath) ?? normalizedPath;
      if (!params.index.has(comparablePath)) {
        params.index.set(comparablePath, params.tokenId);
      }
      return {
        normalizedPath,
        comparablePath
      };
    }, "indexResolvedModulePath");
    resolveModuleTokenIdFromDependencies = /* @__PURE__ */ __name(async (params) => {
      const comparableRequestedPath = normalizeComparableModulePath(params.requestedPath) ?? params.requestedPath;
      const candidateIds = [params.entryTokenId];
      const seen = /* @__PURE__ */ new Set();
      let cursor = 0;
      const enqueue = /* @__PURE__ */ __name((tokenId) => {
        const key = tokenId.toString();
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        candidateIds.push(tokenId);
      }, "enqueue");
      seen.add(params.entryTokenId.toString());
      while (cursor < candidateIds.length && cursor < MAX_DEPENDENCY_WALK_VISITS) {
        const tokenId = candidateIds[cursor];
        cursor += 1;
        try {
          const tokenUri = await fetchIndexedTokenUri({
            env: params.env,
            apiBases: params.apiBases,
            contract: params.contract,
            tokenId
          });
          const indexed = indexResolvedModulePath({
            index: params.index,
            tokenId,
            tokenUri
          });
          if (indexed && (indexed.normalizedPath === params.requestedPath || indexed.comparablePath === comparableRequestedPath)) {
            return tokenId;
          }
        } catch {
        }
        try {
          const dependencyIds = await fetchRuntimeDependencies({
            env: params.env,
            apiBases: params.apiBases,
            contract: params.contract,
            tokenId
          });
          dependencyIds.forEach(enqueue);
        } catch {
        }
      }
      return null;
    }, "resolveModuleTokenIdFromDependencies");
    resolveModuleTokenId = /* @__PURE__ */ __name(async (params) => {
      const lastTokenId = await fetchRuntimeLastTokenId({
        env: params.env,
        apiBases: params.apiBases,
        contract: params.contract
      });
      const cacheKey = buildIndexCacheKey({
        network: params.network,
        contract: params.contract,
        lastTokenId
      });
      const index = getOrCreateModulePathIndex(cacheKey);
      const comparableRequestedPath = normalizeComparableModulePath(params.requestedPath) ?? params.requestedPath;
      const cachedTokenId = index.get(params.requestedPath) ?? index.get(comparableRequestedPath);
      if (cachedTokenId !== void 0) {
        return cachedTokenId;
      }
      if (params.entryTokenId !== null) {
        try {
          const dependencyResolved = await resolveModuleTokenIdFromDependencies({
            env: params.env,
            apiBases: params.apiBases,
            contract: params.contract,
            requestedPath: params.requestedPath,
            entryTokenId: params.entryTokenId,
            index
          });
          if (dependencyResolved !== null) {
            return dependencyResolved;
          }
        } catch {
        }
      }
      const tokenIds = buildTokenSearchOrder(lastTokenId, params.entryTokenId);
      let cursor = 0;
      let resolvedTokenId = null;
      let failures = 0;
      const workerCount = Math.min(INDEX_CONCURRENCY, tokenIds.length || 1);
      const workers = Array.from(
        { length: workerCount },
        () => (async () => {
          while (resolvedTokenId === null && cursor < tokenIds.length) {
            const currentIndex = cursor;
            cursor += 1;
            const tokenId = tokenIds[currentIndex];
            try {
              const tokenUri = await fetchIndexedTokenUri({
                env: params.env,
                apiBases: params.apiBases,
                contract: params.contract,
                tokenId
              });
              const indexed = indexResolvedModulePath({
                index,
                tokenId,
                tokenUri
              });
              if (!indexed) {
                continue;
              }
              if (indexed.normalizedPath === params.requestedPath || indexed.comparablePath === comparableRequestedPath) {
                resolvedTokenId = tokenId;
              }
            } catch {
              failures += 1;
            }
          }
        })()
      );
      await Promise.all(workers);
      if (resolvedTokenId === null && failures > 0) {
        throw new Error("Module path lookup failed during token-uri reads.");
      }
      return resolvedTokenId;
    }, "resolveModuleTokenId");
    badResponse = /* @__PURE__ */ __name((status, message) => new Response(message, {
      status,
      headers: CORS_HEADERS
    }), "badResponse");
    onRuntimeModulesRequest = /* @__PURE__ */ __name(async (context) => {
      const { request, params, env } = context;
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: CORS_HEADERS
        });
      }
      if (request.method !== "GET" && request.method !== "HEAD") {
        return badResponse(405, "Method not allowed");
      }
      const network = parseRuntimeNetwork(params.network ?? "mainnet");
      const contractAddress = params.contractAddress?.trim() ?? "";
      const contractName = params.contractName?.trim() ?? "";
      if (!contractAddress || !contractName) {
        return badResponse(400, "Invalid contract parameters");
      }
      const requestedPath = normalizeModuleTokenUriPath(toPathString(params.path), {
        decodeSegments: true
      });
      if (!requestedPath) {
        return badResponse(400, "Invalid module path");
      }
      const apiBases = getRuntimeApiBases(network, env);
      if (apiBases.length === 0) {
        return badResponse(500, "No API base URLs configured for runtime modules");
      }
      const contract = {
        address: contractAddress,
        contractName
      };
      const entryTokenId = parseRuntimeTokenId(params.entryTokenId ?? null);
      try {
        const tokenId = await resolveModuleTokenId({
          env,
          apiBases,
          network,
          contract,
          requestedPath,
          entryTokenId
        });
        if (tokenId === null) {
          return badResponse(404, "Module path not found");
        }
        if (entryTokenId !== null && entryTokenId !== tokenId) {
          const redirectUrl = buildCanonicalModuleUrl({
            requestUrl: request.url,
            network,
            contract,
            tokenId,
            requestedPath
          });
          return new Response(null, {
            status: 307,
            headers: {
              ...CORS_HEADERS,
              Location: redirectUrl,
              "Cache-Control": "public, max-age=300"
            }
          });
        }
        const resolved = await resolveRuntimeContent({
          env,
          apiBases,
          tokenId,
          primaryContract: contract,
          fallbackContract: null
        });
        const contentType = resolveModuleContentType(
          requestedPath,
          resolved.meta.mimeType || "application/octet-stream"
        );
        let body = resolved.bytes;
        let transformedSource = false;
        if (isTransformableRuntimeModulePath(requestedPath)) {
          const rewritten = transformRuntimeModuleSource(textDecoder.decode(resolved.bytes));
          if (rewritten.changed) {
            body = textEncoder.encode(rewritten.source);
            transformedSource = true;
          }
        }
        const headers = new Headers({
          ...CORS_HEADERS,
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
          "X-Xtrata-Runtime-Contract": `${resolved.contract.address}.${resolved.contract.contractName}`,
          "X-Xtrata-Runtime-Network": network,
          "X-Xtrata-Runtime-Token-Id": tokenId.toString(),
          "X-Xtrata-Runtime-Token-Uri-Path": requestedPath
        });
        if (transformedSource) {
          headers.set("X-Xtrata-Runtime-Source-Transform", "relative-runtime-urls");
        }
        return new Response(request.method === "HEAD" ? null : body, {
          status: 200,
          headers
        });
      } catch (error) {
        return badResponse(
          502,
          error instanceof Error ? error.message : "Failed to resolve module path"
        );
      }
    }, "onRuntimeModulesRequest");
  }
});

// runtime/modules/[network]/[contractAddress]/[contractName]/[entryTokenId]/[[path]].ts
var onRequest;
var init_path = __esm({
  "runtime/modules/[network]/[contractAddress]/[contractName]/[entryTokenId]/[[path]].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_handler();
    onRequest = onRuntimeModulesRequest;
  }
});

// runtime/modules/[network]/[contractAddress]/[contractName]/[[path]].ts
var onRequest2;
var init_path2 = __esm({
  "runtime/modules/[network]/[contractAddress]/[contractName]/[[path]].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_handler();
    onRequest2 = onRuntimeModulesRequest;
  }
});

// ../src/data/contract-registry.json
var contract_registry_default;
var init_contract_registry = __esm({
  "../src/data/contract-registry.json"() {
    contract_registry_default = [
      {
        label: "xtrata-v1-1-1",
        address: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X",
        contractName: "xtrata-v1-1-1",
        network: "mainnet",
        protocolVersion: "1.1.1"
      },
      {
        label: "xtrata-v2-1-0",
        address: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X",
        contractName: "xtrata-v2-1-0",
        network: "mainnet",
        protocolVersion: "2.1.0",
        legacyContractId: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1"
      },
      {
        label: "xtrata-v2-1-1",
        address: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X",
        contractName: "xtrata-v2-1-1",
        network: "mainnet",
        protocolVersion: "2.1.1",
        legacyContractId: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0"
      },
      {
        label: "xtrata-v3-2-3",
        address: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X",
        contractName: "xtrata-v3-2-3",
        network: "mainnet",
        protocolVersion: "3.2.3",
        legacyContractId: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0"
      }
    ];
  }
});

// runtime/cache.ts
var RUNTIME_CONTENT_CACHE_BINDING, RUNTIME_CONTENT_CACHE_PREFIX, DEFAULT_RUNTIME_CONTENT_CACHE_LIMIT_BYTES, DEFAULT_RUNTIME_CONTENT_CACHE_SCAN_MAX_PAGES, EDGE_CACHE_ORIGIN, EDGE_METADATA_HEADERS, runtimeBytesToHex, isR2Bucket, getRuntimeContentCacheBucket, toPositiveInteger, getRuntimeContentCacheLimitBytes, getRuntimeContentCacheScanMaxPages, buildRuntimeContentCacheUsage, inspectRuntimeContentCacheUsage, getRuntimeEdgeCache, buildRuntimeEdgeCacheRequest, getEdgeCacheMetadata, hasRuntimeContentCache, getRuntimeContractId, buildRuntimeContentCacheKey, readRuntimeContentCache, deleteRuntimeContentCache, sliceRuntimeStream, writeRuntimeContentCache;
var init_cache = __esm({
  "runtime/cache.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    RUNTIME_CONTENT_CACHE_BINDING = "RUNTIME_CONTENT_CACHE";
    RUNTIME_CONTENT_CACHE_PREFIX = "runtime-content";
    DEFAULT_RUNTIME_CONTENT_CACHE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024;
    DEFAULT_RUNTIME_CONTENT_CACHE_SCAN_MAX_PAGES = 64;
    EDGE_CACHE_ORIGIN = "https://xtrata-runtime-content-cache.local";
    EDGE_METADATA_HEADERS = {
      network: "X-Xtrata-Cache-Meta-Network",
      contractId: "X-Xtrata-Cache-Meta-Contract-Id",
      sourceContractId: "X-Xtrata-Cache-Meta-Source-Contract-Id",
      tokenId: "X-Xtrata-Cache-Meta-Token-Id",
      finalHash: "X-Xtrata-Cache-Meta-Final-Hash",
      totalSize: "X-Xtrata-Cache-Meta-Total-Size",
      totalChunks: "X-Xtrata-Cache-Meta-Total-Chunks",
      tokenUri: "X-Xtrata-Cache-Meta-Token-Uri",
      moduleBaseHref: "X-Xtrata-Cache-Meta-Module-Base-Href",
      createdAt: "X-Xtrata-Cache-Meta-Created-At"
    };
    runtimeBytesToHex = /* @__PURE__ */ __name((bytes2) => Array.from(bytes2).map((entry) => entry.toString(16).padStart(2, "0")).join(""), "runtimeBytesToHex");
    isR2Bucket = /* @__PURE__ */ __name((value) => Boolean(
      value && typeof value === "object" && typeof value.get === "function" && typeof value.put === "function"
    ), "isR2Bucket");
    getRuntimeContentCacheBucket = /* @__PURE__ */ __name((env) => {
      const bucket = env[RUNTIME_CONTENT_CACHE_BINDING];
      return isR2Bucket(bucket) ? bucket : null;
    }, "getRuntimeContentCacheBucket");
    toPositiveInteger = /* @__PURE__ */ __name((value, fallback) => {
      const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : Number.NaN;
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
      }
      return Math.floor(parsed);
    }, "toPositiveInteger");
    getRuntimeContentCacheLimitBytes = /* @__PURE__ */ __name((env) => toPositiveInteger(
      env.RUNTIME_CONTENT_CACHE_LIMIT_BYTES,
      DEFAULT_RUNTIME_CONTENT_CACHE_LIMIT_BYTES
    ), "getRuntimeContentCacheLimitBytes");
    getRuntimeContentCacheScanMaxPages = /* @__PURE__ */ __name((env) => toPositiveInteger(
      env.RUNTIME_CONTENT_CACHE_SCAN_MAX_PAGES,
      DEFAULT_RUNTIME_CONTENT_CACHE_SCAN_MAX_PAGES
    ), "getRuntimeContentCacheScanMaxPages");
    buildRuntimeContentCacheUsage = /* @__PURE__ */ __name((params) => {
      const prefix = `${RUNTIME_CONTENT_CACHE_PREFIX}/`;
      const usageRatio = params.limitBytes > 0 ? params.totalBytes / params.limitBytes : null;
      let warningLevel = "ok";
      let warningMessage = null;
      if (!params.available) {
        warningLevel = "unknown";
        warningMessage = "Runtime inscription cache storage is not configured, so usage cannot be measured.";
      } else if (params.error) {
        warningLevel = "unknown";
        warningMessage = `Runtime inscription cache usage check failed: ${params.error}`;
      } else if (!params.scannedAll) {
        warningLevel = "warning";
        warningMessage = "Runtime inscription cache scan was partial; actual usage may be higher than reported.";
      } else if (usageRatio !== null && usageRatio >= 1) {
        warningLevel = "exceeded";
        warningMessage = "Runtime inscription cache is at or over the reserved storage budget.";
      } else if (usageRatio !== null && usageRatio >= 0.95) {
        warningLevel = "critical";
        warningMessage = "Runtime inscription cache is above 95% of the reserved storage budget.";
      } else if (usageRatio !== null && usageRatio >= 0.8) {
        warningLevel = "warning";
        warningMessage = "Runtime inscription cache is above 80% of the reserved storage budget.";
      }
      return {
        available: params.available,
        binding: params.available ? RUNTIME_CONTENT_CACHE_BINDING : null,
        prefix,
        objectCount: params.objectCount,
        totalBytes: params.totalBytes,
        limitBytes: params.limitBytes,
        usageRatio,
        warningLevel,
        warningMessage,
        scannedAll: params.scannedAll,
        pagesScanned: params.pagesScanned,
        sampleKeys: params.sampleKeys,
        error: params.error
      };
    }, "buildRuntimeContentCacheUsage");
    inspectRuntimeContentCacheUsage = /* @__PURE__ */ __name(async (env) => {
      const limitBytes = getRuntimeContentCacheLimitBytes(env);
      const bucket = getRuntimeContentCacheBucket(env);
      if (!bucket || typeof bucket.list !== "function") {
        return buildRuntimeContentCacheUsage({
          available: false,
          totalBytes: 0,
          objectCount: 0,
          limitBytes,
          scannedAll: true,
          pagesScanned: 0,
          sampleKeys: [],
          error: null
        });
      }
      const prefix = `${RUNTIME_CONTENT_CACHE_PREFIX}/`;
      const maxPages = getRuntimeContentCacheScanMaxPages(env);
      const sampleKeys = [];
      let totalBytes = 0;
      let objectCount = 0;
      let pagesScanned = 0;
      let cursor;
      let truncated = false;
      try {
        do {
          pagesScanned += 1;
          const page = await bucket.list(cursor ? { prefix, cursor } : { prefix });
          for (const object of page.objects) {
            objectCount += 1;
            totalBytes += object.size ?? 0;
            if (sampleKeys.length < 8) {
              sampleKeys.push(object.key);
            }
          }
          cursor = page.cursor || void 0;
          truncated = Boolean(page.truncated);
        } while (truncated && cursor && pagesScanned < maxPages);
        return buildRuntimeContentCacheUsage({
          available: true,
          totalBytes,
          objectCount,
          limitBytes,
          scannedAll: !truncated,
          pagesScanned,
          sampleKeys,
          error: null
        });
      } catch (error) {
        return buildRuntimeContentCacheUsage({
          available: true,
          totalBytes,
          objectCount,
          limitBytes,
          scannedAll: false,
          pagesScanned,
          sampleKeys,
          error: error instanceof Error ? error.message : "R2 list failed"
        });
      }
    }, "inspectRuntimeContentCacheUsage");
    getRuntimeEdgeCache = /* @__PURE__ */ __name(() => {
      const maybeCaches = globalThis.caches;
      return maybeCaches?.default ?? null;
    }, "getRuntimeEdgeCache");
    buildRuntimeEdgeCacheRequest = /* @__PURE__ */ __name((key) => new Request(`${EDGE_CACHE_ORIGIN}/${key}`, {
      method: "GET"
    }), "buildRuntimeEdgeCacheRequest");
    getEdgeCacheMetadata = /* @__PURE__ */ __name((headers) => {
      const metadata = {};
      for (const [key, headerName] of Object.entries(EDGE_METADATA_HEADERS)) {
        const value = headers.get(headerName);
        if (value !== null) {
          metadata[key] = value;
        }
      }
      return metadata;
    }, "getEdgeCacheMetadata");
    hasRuntimeContentCache = /* @__PURE__ */ __name((env) => Boolean(getRuntimeContentCacheBucket(env) || getRuntimeEdgeCache()), "hasRuntimeContentCache");
    getRuntimeContractId = /* @__PURE__ */ __name((contract) => `${contract.address}.${contract.contractName}`, "getRuntimeContractId");
    buildRuntimeContentCacheKey = /* @__PURE__ */ __name((params) => {
      const finalHash = runtimeBytesToHex(params.finalHash);
      if (!finalHash) {
        return null;
      }
      const contractId = getRuntimeContractId(params.contract);
      return [
        RUNTIME_CONTENT_CACHE_PREFIX,
        params.network,
        encodeURIComponent(contractId),
        params.tokenId.toString(),
        finalHash
      ].join("/");
    }, "buildRuntimeContentCacheKey");
    readRuntimeContentCache = /* @__PURE__ */ __name(async (env, key, range) => {
      if (!key) {
        return null;
      }
      const bucket = getRuntimeContentCacheBucket(env);
      if (bucket) {
        const object = range ? await bucket.get(key, {
          range: {
            offset: range.start,
            length: range.length
          }
        }) : await bucket.get(key);
        if (object?.body) {
          return {
            key,
            layer: "r2",
            body: object.body,
            size: typeof object.size === "number" ? object.size : null,
            bodyRange: range ?? null,
            httpMetadata: object.httpMetadata,
            customMetadata: object.customMetadata
          };
        }
      }
      const edgeCache = getRuntimeEdgeCache();
      if (!edgeCache) {
        return null;
      }
      const response = await edgeCache.match(buildRuntimeEdgeCacheRequest(key));
      if (!response?.body) {
        return null;
      }
      const contentLength = response.headers.get("Content-Length");
      const parsedContentLength = contentLength === null ? Number.NaN : Number.parseInt(contentLength, 10);
      const body = range ? sliceRuntimeStream(response.body, range) : response.body;
      return {
        key,
        layer: "edge",
        body,
        size: Number.isFinite(parsedContentLength) ? parsedContentLength : null,
        bodyRange: range ?? null,
        httpMetadata: {
          contentType: response.headers.get("Content-Type") ?? void 0
        },
        customMetadata: getEdgeCacheMetadata(response.headers)
      };
    }, "readRuntimeContentCache");
    deleteRuntimeContentCache = /* @__PURE__ */ __name(async (env, key) => {
      if (!key) {
        return {
          key: null,
          r2Deleted: false,
          edgeDeleted: false
        };
      }
      let r2Deleted = false;
      const bucket = getRuntimeContentCacheBucket(env);
      if (bucket) {
        await bucket.delete(key);
        r2Deleted = true;
      }
      let edgeDeleted = false;
      const edgeCache = getRuntimeEdgeCache();
      if (edgeCache) {
        edgeDeleted = await edgeCache.delete(buildRuntimeEdgeCacheRequest(key));
      }
      return {
        key,
        r2Deleted,
        edgeDeleted
      };
    }, "deleteRuntimeContentCache");
    sliceRuntimeStream = /* @__PURE__ */ __name((stream, range) => new ReadableStream({
      start(controller) {
        const reader = stream.getReader();
        void (async () => {
          let cursor = 0;
          let remaining = range.length;
          try {
            while (remaining > 0) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              const chunkStart = cursor;
              const chunkEnd = cursor + value.length - 1;
              cursor += value.length;
              if (chunkEnd < range.start) {
                continue;
              }
              const offset = Math.max(0, range.start - chunkStart);
              const output2 = value.slice(offset, offset + remaining);
              if (output2.length > 0) {
                controller.enqueue(output2);
                remaining -= output2.length;
              }
            }
            if (remaining > 0) {
              throw new Error("Cached range body ended before the requested range.");
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          } finally {
            if (remaining <= 0) {
              await reader.cancel().catch(() => void 0);
            }
          }
        })();
      }
    }), "sliceRuntimeStream");
    writeRuntimeContentCache = /* @__PURE__ */ __name(async (params) => {
      if (!params.key) {
        return false;
      }
      let wrote = false;
      let lastError = null;
      const bucket = getRuntimeContentCacheBucket(params.env);
      if (bucket) {
        try {
          await bucket.put(params.key, params.bytes, {
            httpMetadata: {
              contentType: params.mimeType
            },
            customMetadata: params.metadata
          });
          wrote = true;
        } catch (error) {
          lastError = error;
        }
      }
      const edgeCache = getRuntimeEdgeCache();
      if (edgeCache) {
        try {
          const headers = new Headers({
            "Content-Type": params.mimeType,
            "Content-Length": params.bytes.length.toString(),
            "Cache-Control": "public, max-age=31536000, immutable"
          });
          if (params.metadata.finalHash) {
            headers.set("ETag", `"${params.metadata.finalHash}"`);
          }
          for (const [key, headerName] of Object.entries(EDGE_METADATA_HEADERS)) {
            const value = params.metadata[key];
            if (value !== void 0) {
              headers.set(headerName, value);
            }
          }
          await edgeCache.put(
            buildRuntimeEdgeCacheRequest(params.key),
            new Response(params.bytes, {
              status: 200,
              headers
            })
          );
          wrote = true;
        } catch (error) {
          lastError = error;
        }
      }
      if (!wrote && lastError) {
        throw lastError;
      }
      return wrote;
    }, "writeRuntimeContentCache");
  }
});

// runtime/html-hiro-rewrite.ts
var HIRO_BASE_REWRITES, RAW_QUERY_PARAMS, isHtmlMimeType, isRawSourceRequested, shouldRewriteHiroBases, normalizeOrigin, rewriteHiroApiBasesInText, rewriteHiroApiBasesInBytes;
var init_html_hiro_rewrite = __esm({
  "runtime/html-hiro-rewrite.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    HIRO_BASE_REWRITES = [
      [/https:\/\/api\.mainnet\.hiro\.so/g, "/hiro/mainnet"],
      [/https:\/\/api\.testnet\.hiro\.so/g, "/hiro/testnet"],
      [/https:\/\/stacks-node-api\.mainnet\.stacks\.co/g, "/hiro/mainnet"],
      [/https:\/\/stacks-node-api\.testnet\.stacks\.co/g, "/hiro/testnet"]
    ];
    RAW_QUERY_PARAMS = ["raw", "rawSource", "noApiRewrite"];
    isHtmlMimeType = /* @__PURE__ */ __name((mimeType) => /^text\/html\b/i.test(String(mimeType || "").trim()), "isHtmlMimeType");
    isRawSourceRequested = /* @__PURE__ */ __name((url) => RAW_QUERY_PARAMS.some((param) => {
      const value = url.searchParams.get(param);
      return value !== null && value !== "0" && value.toLowerCase() !== "false";
    }), "isRawSourceRequested");
    shouldRewriteHiroBases = /* @__PURE__ */ __name((params) => isHtmlMimeType(params.mimeType) && String(params.method || "GET").toUpperCase() === "GET" && !params.isRangeResponse && !isRawSourceRequested(params.requestUrl), "shouldRewriteHiroBases");
    normalizeOrigin = /* @__PURE__ */ __name((origin) => {
      const value = String(origin || "").trim().replace(/\/+$/, "");
      return /^https?:\/\//i.test(value) ? value : "";
    }, "normalizeOrigin");
    rewriteHiroApiBasesInText = /* @__PURE__ */ __name((source, origin) => {
      const proxyOrigin = normalizeOrigin(origin);
      let output2 = source;
      let changed = false;
      for (const [pattern, proxyPath] of HIRO_BASE_REWRITES) {
        if (pattern.test(output2)) {
          pattern.lastIndex = 0;
          output2 = output2.replace(pattern, `${proxyOrigin}${proxyPath}`);
          changed = true;
        }
        pattern.lastIndex = 0;
      }
      return { source: output2, changed };
    }, "rewriteHiroApiBasesInText");
    rewriteHiroApiBasesInBytes = /* @__PURE__ */ __name((bytes2, origin) => {
      let text;
      try {
        text = new TextDecoder("utf-8", { fatal: true }).decode(bytes2);
      } catch (error) {
        return { bytes: bytes2, changed: false };
      }
      const { source, changed } = rewriteHiroApiBasesInText(text, origin);
      if (!changed) {
        return { bytes: bytes2, changed: false };
      }
      return { bytes: new TextEncoder().encode(source), changed: true };
    }, "rewriteHiroApiBasesInBytes");
  }
});

// runtime/content.ts
var RUNTIME_CONTENT_BUILD, textDecoder2, textEncoder2, CORS_HEADERS2, toRuntimeDiagnosticsSummary, isRuntimeContentDebugEnabled, logRuntimeContentDebug, getErrorDiagnostics, asJsonError, buildRuntimeContentHeaders, parseRuntimeRange, shouldHonorRange, sliceBytes, injectRuntimeModuleBaseInBytes, onRequest3;
var init_content = __esm({
  "runtime/content.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_module_paths();
    init_cache();
    init_lib();
    init_html_hiro_rewrite();
    RUNTIME_CONTENT_BUILD = "stream-v1";
    textDecoder2 = new TextDecoder();
    textEncoder2 = new TextEncoder();
    CORS_HEADERS2 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Access-Control-Allow-Headers": "content-type, range, if-range",
      "Access-Control-Expose-Headers": [
        "Content-Type",
        "Content-Length",
        "Accept-Ranges",
        "Content-Range",
        "ETag",
        "Server-Timing",
        "X-Xtrata-Runtime-Cache",
        "X-Xtrata-Runtime-Build",
        "X-Xtrata-Runtime-Contract",
        "X-Xtrata-Runtime-Source-Contract",
        "X-Xtrata-Runtime-Network",
        "X-Xtrata-Runtime-Token-Uri",
        "X-Xtrata-Runtime-Module-Base",
        "X-Xtrata-Runtime-Module-Base-Injected",
        "X-Xtrata-Runtime-Final-Hash",
        "X-Xtrata-Runtime-Total-Size",
        "X-Xtrata-Runtime-Total-Chunks",
        "X-Xtrata-Runtime-Response-Mode",
        "X-Xtrata-Runtime-Read-Batch-Size",
        "X-Xtrata-Runtime-Read-Concurrency",
        "X-Xtrata-Runtime-Read-Retries",
        "X-Xtrata-Runtime-Reconstruction-Read-Mode",
        "X-Xtrata-Runtime-Reconstruction-Fallback",
        "X-Xtrata-Runtime-Reconstruction-Batch-Reads",
        "X-Xtrata-Runtime-Reconstruction-Single-Reads",
        "X-Xtrata-Runtime-Reconstruction-Batch-Fallbacks",
        "X-Xtrata-Runtime-Reconstruction-Errors",
        "X-Xtrata-Runtime-Upstream-Requests",
        "X-Xtrata-Runtime-Prepared-Ms"
      ].join(", "),
      "Cross-Origin-Resource-Policy": "cross-origin"
    };
    toRuntimeDiagnosticsSummary = /* @__PURE__ */ __name((diagnostics) => diagnostics ? {
      requestedSourceId: diagnostics.requestedSourceId,
      metaSourceId: diagnostics.metaSourceId,
      chunkSourceId: diagnostics.chunkSourceId,
      fallbackUsed: diagnostics.fallbackUsed,
      readMode: diagnostics.readMode,
      batchReads: diagnostics.batchReads,
      singleReads: diagnostics.singleReads,
      batchFallbacks: diagnostics.batchFallbacks,
      upstreamRequests: diagnostics.upstreamRequests,
      missingChunks: diagnostics.missingChunks.map((index) => index.toString()),
      errors: diagnostics.errors.map((error) => ({
        sourceId: error.sourceId,
        operation: error.operation,
        index: error.index?.toString(),
        indexes: error.indexes?.map((index) => index.toString()),
        message: error.message
      }))
    } : null, "toRuntimeDiagnosticsSummary");
    isRuntimeContentDebugEnabled = /* @__PURE__ */ __name((env) => {
      const value = env.RUNTIME_CONTENT_DEBUG;
      return value === true || value === "1" || value === "true";
    }, "isRuntimeContentDebugEnabled");
    logRuntimeContentDebug = /* @__PURE__ */ __name((env, phase, details) => {
      if (!isRuntimeContentDebugEnabled(env)) {
        return;
      }
      console.log(`[runtime/content] ${phase}`, details);
    }, "logRuntimeContentDebug");
    getErrorDiagnostics = /* @__PURE__ */ __name((error) => {
      const candidate = error;
      return candidate && candidate.diagnostics ? candidate.diagnostics : null;
    }, "getErrorDiagnostics");
    asJsonError = /* @__PURE__ */ __name((status, message, detail, diagnostics, upstreamRequests) => new Response(
      JSON.stringify({
        error: message,
        detail: detail || null,
        diagnostics: toRuntimeDiagnosticsSummary(diagnostics)
      }),
      {
        status,
        headers: {
          ...CORS_HEADERS2,
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          ...typeof upstreamRequests === "number" ? { "X-Xtrata-Runtime-Upstream-Requests": upstreamRequests.toString() } : {}
        }
      }
    ), "asJsonError");
    buildRuntimeContentHeaders = /* @__PURE__ */ __name((params) => {
      const headers = {
        ...CORS_HEADERS2,
        "Content-Type": params.mimeType,
        "Cache-Control": params.finalHash ? "public, max-age=31536000, immutable" : "public, max-age=60",
        "X-Content-Type-Options": "nosniff",
        "X-Xtrata-Runtime-Cache": params.cacheStatus,
        "X-Xtrata-Runtime-Build": RUNTIME_CONTENT_BUILD,
        "X-Xtrata-Runtime-Contract": params.contractId,
        "X-Xtrata-Runtime-Source-Contract": params.sourceContractId,
        "X-Xtrata-Runtime-Network": params.network,
        "X-Xtrata-Runtime-Token-Uri": params.tokenUri,
        "X-Xtrata-Runtime-Module-Base": params.moduleBaseHref,
        "X-Xtrata-Runtime-Final-Hash": params.finalHash,
        "X-Xtrata-Runtime-Total-Size": params.totalSize.toString(),
        "X-Xtrata-Runtime-Total-Chunks": params.totalChunks.toString(),
        "X-Xtrata-Runtime-Response-Mode": params.responseMode
      };
      if (params.apiRewrite) {
        headers["X-Xtrata-Runtime-Api-Rewrite"] = "hiro-proxy";
      }
      if (params.totalSize <= BigInt(Number.MAX_SAFE_INTEGER)) {
        headers["Accept-Ranges"] = "bytes";
      }
      if (params.contentRange) {
        headers["Content-Range"] = params.contentRange;
        headers.Vary = "Range";
      }
      if (typeof params.readBatchSize === "number") {
        headers["X-Xtrata-Runtime-Read-Batch-Size"] = params.readBatchSize.toString();
      }
      if (typeof params.readConcurrency === "number") {
        headers["X-Xtrata-Runtime-Read-Concurrency"] = params.readConcurrency.toString();
      }
      if (typeof params.readRetries === "number") {
        headers["X-Xtrata-Runtime-Read-Retries"] = params.readRetries.toString();
      }
      if (typeof params.upstreamRequests === "number") {
        headers["X-Xtrata-Runtime-Upstream-Requests"] = params.upstreamRequests.toString();
      }
      if (params.diagnostics) {
        headers["X-Xtrata-Runtime-Reconstruction-Read-Mode"] = params.diagnostics.readMode;
        headers["X-Xtrata-Runtime-Reconstruction-Fallback"] = params.diagnostics.fallbackUsed ? "true" : "false";
        headers["X-Xtrata-Runtime-Reconstruction-Batch-Reads"] = params.diagnostics.batchReads.toString();
        headers["X-Xtrata-Runtime-Reconstruction-Single-Reads"] = params.diagnostics.singleReads.toString();
        headers["X-Xtrata-Runtime-Reconstruction-Batch-Fallbacks"] = params.diagnostics.batchFallbacks.toString();
        headers["X-Xtrata-Runtime-Reconstruction-Errors"] = params.diagnostics.errors.length.toString();
      }
      if (typeof params.preparedMs === "number") {
        headers["X-Xtrata-Runtime-Prepared-Ms"] = params.preparedMs.toFixed(1);
        headers["Server-Timing"] = `runtime_prepare;dur=${params.preparedMs.toFixed(1)}`;
      }
      if (params.finalHash) {
        headers.ETag = `"${params.finalHash}"`;
      }
      if (typeof params.contentLength === "number" && params.contentLength >= 0) {
        headers["Content-Length"] = params.contentLength.toString();
      }
      return headers;
    }, "buildRuntimeContentHeaders");
    parseRuntimeRange = /* @__PURE__ */ __name((headerValue, totalSize) => {
      if (!headerValue) {
        return { status: "none" };
      }
      if (totalSize < 0n || totalSize > BigInt(Number.MAX_SAFE_INTEGER)) {
        return {
          status: "unsatisfiable",
          contentRange: "bytes */*"
        };
      }
      const total = Number(totalSize);
      const normalized = headerValue.trim();
      const prefix = "bytes=";
      if (!normalized.toLowerCase().startsWith(prefix) || normalized.includes(",")) {
        return {
          status: "unsatisfiable",
          contentRange: `bytes */${total}`
        };
      }
      const spec = normalized.slice(prefix.length).trim();
      const separator = spec.indexOf("-");
      if (separator < 0) {
        return {
          status: "unsatisfiable",
          contentRange: `bytes */${total}`
        };
      }
      const startPart = spec.slice(0, separator).trim();
      const endPart = spec.slice(separator + 1).trim();
      const isDigits = /* @__PURE__ */ __name((value) => /^\d+$/.test(value), "isDigits");
      let start;
      let end;
      if (!startPart) {
        if (!isDigits(endPart)) {
          return {
            status: "unsatisfiable",
            contentRange: `bytes */${total}`
          };
        }
        const suffixLength = Number.parseInt(endPart, 10);
        if (suffixLength <= 0 || total === 0) {
          return {
            status: "unsatisfiable",
            contentRange: `bytes */${total}`
          };
        }
        start = Math.max(0, total - suffixLength);
        end = total - 1;
      } else {
        if (!isDigits(startPart) || endPart && !isDigits(endPart)) {
          return {
            status: "unsatisfiable",
            contentRange: `bytes */${total}`
          };
        }
        start = Number.parseInt(startPart, 10);
        end = endPart ? Number.parseInt(endPart, 10) : total - 1;
        if (start >= total || start > end || total === 0) {
          return {
            status: "unsatisfiable",
            contentRange: `bytes */${total}`
          };
        }
        end = Math.min(end, total - 1);
      }
      const length = end - start + 1;
      return {
        status: "valid",
        range: {
          start,
          end,
          length
        },
        contentRange: `bytes ${start}-${end}/${total}`
      };
    }, "parseRuntimeRange");
    shouldHonorRange = /* @__PURE__ */ __name((request, finalHash) => {
      const ifRange = request.headers.get("If-Range")?.trim();
      if (!ifRange || !finalHash) {
        return true;
      }
      return ifRange === finalHash || ifRange === `"${finalHash}"`;
    }, "shouldHonorRange");
    sliceBytes = /* @__PURE__ */ __name((bytes2, range) => bytes2.slice(range.start, range.end + 1), "sliceBytes");
    injectRuntimeModuleBaseInBytes = /* @__PURE__ */ __name((params) => {
      if (!params.moduleBaseHref || !isHtmlMimeType(params.mimeType) || isRawSourceRequested(params.requestUrl)) {
        return { bytes: params.bytes, changed: false };
      }
      let html2;
      try {
        html2 = textDecoder2.decode(params.bytes);
      } catch {
        return { bytes: params.bytes, changed: false };
      }
      const injected = injectHtmlBaseHref(html2, params.moduleBaseHref);
      if (injected === html2) {
        return { bytes: params.bytes, changed: false };
      }
      return {
        bytes: textEncoder2.encode(injected),
        changed: true
      };
    }, "injectRuntimeModuleBaseInBytes");
    onRequest3 = /* @__PURE__ */ __name(async (context) => {
      const { request, env } = context;
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: CORS_HEADERS2
        });
      }
      if (request.method !== "GET" && request.method !== "HEAD") {
        return asJsonError(405, "Method not allowed.");
      }
      const startedAt = performance.now();
      const url = new URL(request.url);
      const contractId = parseRuntimeContractRef(url.searchParams.get("contractId"));
      const fallbackContractId = parseRuntimeContractRef(url.searchParams.get("fallbackContractId"));
      const tokenId = parseRuntimeTokenId(url.searchParams.get("tokenId"));
      const network = parseRuntimeNetwork(url.searchParams.get("network"));
      if (!contractId) {
        return asJsonError(400, "Invalid contractId parameter.");
      }
      if (tokenId === null || tokenId < 0n) {
        return asJsonError(400, "Invalid tokenId parameter.");
      }
      const apiBases = getRuntimeApiBases(network, env);
      if (apiBases.length === 0) {
        return asJsonError(500, "No API base URLs configured for runtime content.");
      }
      const readConfig = getRuntimeReadConfig(env);
      const upstreamTracker = createRuntimeUpstreamRequestTracker();
      try {
        const resolvedMeta = await resolveRuntimeMeta({
          env,
          apiBases,
          tokenId,
          primaryContract: contractId,
          fallbackContract: fallbackContractId,
          upstreamTracker
        });
        const finalHash = runtimeBytesToHex(resolvedMeta.meta.finalHash);
        const cacheKey = resolvedMeta.meta.sealed && finalHash ? buildRuntimeContentCacheKey({
          network,
          contract: resolvedMeta.contract,
          tokenId,
          finalHash: resolvedMeta.meta.finalHash
        }) : null;
        const cacheEnabled = hasRuntimeContentCache(env);
        const requestedRange = shouldHonorRange(request, finalHash) ? parseRuntimeRange(request.headers.get("Range"), resolvedMeta.meta.totalSize) : { status: "none" };
        const range = requestedRange.status === "valid" ? requestedRange.range : null;
        if (requestedRange.status === "unsatisfiable") {
          const resolvedContractId2 = getRuntimeContractId(resolvedMeta.contract);
          return new Response(null, {
            status: 416,
            headers: buildRuntimeContentHeaders({
              mimeType: resolvedMeta.meta.mimeType || "application/octet-stream",
              cacheStatus: cacheEnabled ? "MISS" : "BYPASS",
              network,
              contractId: resolvedContractId2,
              sourceContractId: resolvedContractId2,
              tokenUri: "",
              moduleBaseHref: "",
              finalHash,
              totalSize: resolvedMeta.meta.totalSize,
              totalChunks: resolvedMeta.meta.totalChunks,
              contentLength: 0,
              contentRange: requestedRange.contentRange,
              responseMode: "range",
              readBatchSize: readConfig.batchSize,
              readConcurrency: readConfig.concurrency,
              readRetries: readConfig.retries,
              upstreamRequests: upstreamTracker.attempts,
              preparedMs: performance.now() - startedAt
            })
          });
        }
        const cached = await readRuntimeContentCache(env, cacheKey, range);
        if (cached) {
          const sourceContractId = cached.customMetadata?.sourceContractId ?? getRuntimeContractId(resolvedMeta.contract);
          const cachedModuleBaseHref = cached.customMetadata?.moduleBaseHref ?? buildRuntimeModuleBaseHref({
            network,
            contractId: sourceContractId,
            tokenUriPath: cached.customMetadata?.tokenUri,
            entryTokenId: tokenId
          });
          const rangeContentLength = requestedRange.status === "valid" ? requestedRange.range.length : null;
          const cachedMimeType = resolvedMeta.meta.mimeType || cached.httpMetadata?.contentType || "application/octet-stream";
          let cachedResponseBody = request.method === "HEAD" ? null : cached.body;
          let cachedContentLength = rangeContentLength ?? cached.size;
          let cachedApiRewrite = false;
          let cachedModuleBaseInjected = false;
          if (cachedResponseBody && shouldRewriteHiroBases({
            requestUrl: url,
            mimeType: cachedMimeType,
            method: request.method,
            isRangeResponse: requestedRange.status === "valid"
          })) {
            const cachedBytes = new Uint8Array(
              await new Response(cachedResponseBody).arrayBuffer()
            );
            const rewritten = rewriteHiroApiBasesInBytes(cachedBytes, url.origin);
            cachedResponseBody = rewritten.bytes;
            cachedContentLength = rewritten.bytes.length;
            cachedApiRewrite = rewritten.changed;
          }
          if (cachedResponseBody && request.method === "GET" && requestedRange.status !== "valid") {
            const cachedBytes = new Uint8Array(
              await new Response(cachedResponseBody).arrayBuffer()
            );
            const baseInjected2 = injectRuntimeModuleBaseInBytes({
              bytes: cachedBytes,
              mimeType: cachedMimeType,
              moduleBaseHref: cachedModuleBaseHref,
              requestUrl: url
            });
            cachedResponseBody = baseInjected2.bytes;
            cachedContentLength = baseInjected2.bytes.length;
            cachedModuleBaseInjected = baseInjected2.changed;
          }
          const headers2 = buildRuntimeContentHeaders({
            mimeType: cachedMimeType,
            cacheStatus: "HIT",
            network,
            contractId: getRuntimeContractId(resolvedMeta.contract),
            sourceContractId,
            tokenUri: cached.customMetadata?.tokenUri ?? "",
            moduleBaseHref: cachedModuleBaseHref ?? "",
            finalHash,
            totalSize: resolvedMeta.meta.totalSize,
            totalChunks: resolvedMeta.meta.totalChunks,
            contentLength: cachedContentLength,
            contentRange: requestedRange.status === "valid" ? requestedRange.contentRange : void 0,
            responseMode: request.method === "HEAD" ? "head" : requestedRange.status === "valid" ? "range" : "cache",
            apiRewrite: cachedApiRewrite,
            readBatchSize: readConfig.batchSize,
            readConcurrency: readConfig.concurrency,
            readRetries: readConfig.retries,
            upstreamRequests: upstreamTracker.attempts,
            preparedMs: performance.now() - startedAt
          });
          if (cachedModuleBaseInjected) {
            headers2["X-Xtrata-Runtime-Module-Base-Injected"] = "true";
          }
          return new Response(cachedResponseBody, {
            status: requestedRange.status === "valid" ? 206 : 200,
            headers: headers2
          });
        }
        if (request.method === "HEAD") {
          const resolvedContractId2 = getRuntimeContractId(resolvedMeta.contract);
          return new Response(null, {
            status: requestedRange.status === "valid" ? 206 : 200,
            headers: buildRuntimeContentHeaders({
              mimeType: resolvedMeta.meta.mimeType || "application/octet-stream",
              cacheStatus: cacheEnabled ? "MISS" : "BYPASS",
              network,
              contractId: resolvedContractId2,
              sourceContractId: resolvedContractId2,
              tokenUri: "",
              moduleBaseHref: "",
              finalHash,
              totalSize: resolvedMeta.meta.totalSize,
              totalChunks: resolvedMeta.meta.totalChunks,
              contentLength: requestedRange.status === "valid" ? requestedRange.range.length : resolvedMeta.meta.totalSize <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(resolvedMeta.meta.totalSize) : null,
              contentRange: requestedRange.status === "valid" ? requestedRange.contentRange : void 0,
              responseMode: "head",
              readBatchSize: readConfig.batchSize,
              readConcurrency: readConfig.concurrency,
              readRetries: readConfig.retries,
              upstreamRequests: upstreamTracker.attempts,
              preparedMs: performance.now() - startedAt
            })
          });
        }
        const cacheContractId = getRuntimeContractId(resolvedMeta.contract);
        if (requestedRange.status === "valid") {
          const resolved2 = await resolveRuntimeContent({
            env,
            apiBases,
            tokenId,
            primaryContract: contractId,
            fallbackContract: fallbackContractId,
            resolvedMeta,
            upstreamTracker
          });
          let tokenUri2 = null;
          try {
            tokenUri2 = await fetchRuntimeTokenUri({
              env,
              apiBases,
              contract: resolved2.contract,
              tokenId,
              upstreamTracker
            });
          } catch (error) {
            syncRuntimeUpstreamRequests(resolved2.diagnostics, upstreamTracker);
            if (isCloudflareSubrequestQuotaError(error)) {
              if (error && typeof error === "object") {
                error.diagnostics = resolved2.diagnostics;
              }
              throw error;
            }
            tokenUri2 = null;
          }
          syncRuntimeUpstreamRequests(resolved2.diagnostics, upstreamTracker);
          const resolvedContractId2 = getRuntimeContractId(resolved2.contract);
          const resolvedFinalHash2 = runtimeBytesToHex(resolved2.meta.finalHash);
          const moduleBaseHref2 = buildRuntimeModuleBaseHref({
            network,
            contractId: resolvedContractId2,
            tokenUriPath: tokenUri2,
            entryTokenId: tokenId
          });
          logRuntimeContentDebug(env, "reconstructed-range", {
            network,
            tokenId: tokenId.toString(),
            requestedContractId: getRuntimeContractId(contractId),
            sourceContractId: resolvedContractId2,
            range: requestedRange.contentRange,
            diagnostics: toRuntimeDiagnosticsSummary(resolved2.diagnostics)
          });
          if (cacheKey && resolved2.meta.sealed && resolvedFinalHash2 === finalHash) {
            const cacheWrite = writeRuntimeContentCache({
              env,
              key: cacheKey,
              bytes: resolved2.bytes,
              mimeType: resolved2.meta.mimeType || "application/octet-stream",
              metadata: {
                network,
                contractId: cacheContractId,
                sourceContractId: resolvedContractId2,
                tokenId: tokenId.toString(),
                finalHash: resolvedFinalHash2,
                totalSize: resolved2.meta.totalSize.toString(),
                totalChunks: resolved2.meta.totalChunks.toString(),
                tokenUri: tokenUri2 ?? "",
                moduleBaseHref: moduleBaseHref2,
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              }
            }).catch(() => false);
            if (context.waitUntil) {
              context.waitUntil(cacheWrite);
            } else {
              await cacheWrite;
            }
          }
          return new Response(sliceBytes(resolved2.bytes, requestedRange.range), {
            status: 206,
            headers: buildRuntimeContentHeaders({
              mimeType: resolved2.meta.mimeType || "application/octet-stream",
              cacheStatus: cacheEnabled ? "MISS" : "BYPASS",
              network,
              contractId: cacheContractId,
              sourceContractId: resolvedContractId2,
              tokenUri: tokenUri2 ?? "",
              moduleBaseHref: moduleBaseHref2,
              finalHash: resolvedFinalHash2,
              totalSize: resolved2.meta.totalSize,
              totalChunks: resolved2.meta.totalChunks,
              contentLength: requestedRange.range.length,
              contentRange: requestedRange.contentRange,
              responseMode: "range",
              readBatchSize: readConfig.batchSize,
              readConcurrency: readConfig.concurrency,
              readRetries: readConfig.retries,
              upstreamRequests: upstreamTracker.attempts,
              diagnostics: resolved2.diagnostics,
              preparedMs: performance.now() - startedAt
            })
          });
        }
        const resolved = await resolveRuntimeContent({
          env,
          apiBases,
          tokenId,
          primaryContract: contractId,
          fallbackContract: fallbackContractId,
          resolvedMeta,
          upstreamTracker
        });
        let tokenUri = null;
        try {
          tokenUri = await fetchRuntimeTokenUri({
            env,
            apiBases,
            contract: resolved.contract,
            tokenId,
            upstreamTracker
          });
        } catch (error) {
          syncRuntimeUpstreamRequests(resolved.diagnostics, upstreamTracker);
          if (isCloudflareSubrequestQuotaError(error)) {
            if (error && typeof error === "object") {
              error.diagnostics = resolved.diagnostics;
            }
            throw error;
          }
          tokenUri = null;
        }
        syncRuntimeUpstreamRequests(resolved.diagnostics, upstreamTracker);
        const resolvedContractId = getRuntimeContractId(resolved.contract);
        const resolvedFinalHash = runtimeBytesToHex(resolved.meta.finalHash);
        const moduleBaseHref = buildRuntimeModuleBaseHref({
          network,
          contractId: resolvedContractId,
          tokenUriPath: tokenUri,
          entryTokenId: tokenId
        });
        if (cacheKey && resolved.meta.sealed && resolvedFinalHash === finalHash) {
          const cacheWrite = writeRuntimeContentCache({
            env,
            key: cacheKey,
            bytes: resolved.bytes,
            mimeType: resolved.meta.mimeType || "application/octet-stream",
            metadata: {
              network,
              contractId: cacheContractId,
              sourceContractId: resolvedContractId,
              tokenId: tokenId.toString(),
              finalHash: resolvedFinalHash,
              totalSize: resolved.meta.totalSize.toString(),
              totalChunks: resolved.meta.totalChunks.toString(),
              tokenUri: tokenUri ?? "",
              moduleBaseHref,
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            }
          }).catch(() => false);
          if (context.waitUntil) {
            context.waitUntil(cacheWrite);
          } else {
            await cacheWrite;
          }
        }
        logRuntimeContentDebug(env, "reconstructed-stream", {
          network,
          tokenId: tokenId.toString(),
          requestedContractId: getRuntimeContractId(contractId),
          sourceContractId: resolvedContractId,
          diagnostics: toRuntimeDiagnosticsSummary(resolved.diagnostics)
        });
        const streamMimeType = resolved.meta.mimeType || "application/octet-stream";
        let streamBytes = resolved.bytes;
        let streamApiRewrite = false;
        let streamModuleBaseInjected = false;
        if (shouldRewriteHiroBases({
          requestUrl: url,
          mimeType: streamMimeType,
          method: request.method,
          isRangeResponse: false
        })) {
          const rewritten = rewriteHiroApiBasesInBytes(streamBytes, url.origin);
          streamBytes = rewritten.bytes;
          streamApiRewrite = rewritten.changed;
        }
        const baseInjected = injectRuntimeModuleBaseInBytes({
          bytes: streamBytes,
          mimeType: streamMimeType,
          moduleBaseHref,
          requestUrl: url
        });
        streamBytes = baseInjected.bytes;
        streamModuleBaseInjected = baseInjected.changed;
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(streamBytes);
            controller.close();
          }
        });
        const headers = buildRuntimeContentHeaders({
          mimeType: streamMimeType,
          cacheStatus: cacheEnabled ? "MISS" : "BYPASS",
          network,
          contractId: cacheContractId,
          sourceContractId: resolvedContractId,
          tokenUri: tokenUri ?? "",
          moduleBaseHref: moduleBaseHref ?? "",
          finalHash: resolvedFinalHash,
          totalSize: resolved.meta.totalSize,
          totalChunks: resolved.meta.totalChunks,
          contentLength: streamBytes.length,
          responseMode: "stream",
          apiRewrite: streamApiRewrite,
          readBatchSize: readConfig.batchSize,
          readConcurrency: readConfig.concurrency,
          readRetries: readConfig.retries,
          upstreamRequests: upstreamTracker.attempts,
          diagnostics: resolved.diagnostics,
          preparedMs: performance.now() - startedAt
        });
        if (streamModuleBaseInjected) {
          headers["X-Xtrata-Runtime-Module-Base-Injected"] = "true";
        }
        return new Response(stream, {
          status: 200,
          headers
        });
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        const diagnostics = getErrorDiagnostics(error);
        const subrequestQuotaExhausted = isCloudflareSubrequestQuotaError(error);
        logRuntimeContentDebug(env, "reconstruction-error", {
          network,
          tokenId: tokenId?.toString(),
          requestedContractId: contractId ? getRuntimeContractId(contractId) : null,
          detail,
          upstreamRequests: upstreamTracker.attempts,
          diagnostics: toRuntimeDiagnosticsSummary(diagnostics)
        });
        return asJsonError(
          subrequestQuotaExhausted ? 503 : 502,
          subrequestQuotaExhausted ? "Runtime upstream request limit exhausted." : "Failed to reconstruct runtime content.",
          detail,
          diagnostics,
          upstreamTracker.attempts
        );
      }
    }, "onRequest");
  }
});

// inscription/handler.ts
var registryEntries, defaultMainnetContract, DEFAULT_INSCRIPTION_CONTRACT_ID, DEFAULT_INSCRIPTION_NETWORK, DEFAULT_INSCRIPTION_FALLBACK_CONTRACT_ID, firstParam, normalizeTokenId, getPathContractId, buildRuntimeInscriptionRequest, onInscriptionRequest;
var init_handler2 = __esm({
  "inscription/handler.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_contract_registry();
    init_content();
    init_lib();
    registryEntries = contract_registry_default;
    defaultMainnetContract = registryEntries.slice().reverse().find((entry) => entry.network === "mainnet") ?? registryEntries[0];
    DEFAULT_INSCRIPTION_CONTRACT_ID = defaultMainnetContract ? `${defaultMainnetContract.address}.${defaultMainnetContract.contractName}` : "";
    DEFAULT_INSCRIPTION_NETWORK = defaultMainnetContract?.network || "mainnet";
    DEFAULT_INSCRIPTION_FALLBACK_CONTRACT_ID = defaultMainnetContract?.legacyContractId || "";
    firstParam = /* @__PURE__ */ __name((value) => {
      if (Array.isArray(value)) {
        return firstParam(value[0]);
      }
      return typeof value === "string" ? value.trim() : "";
    }, "firstParam");
    normalizeTokenId = /* @__PURE__ */ __name((value) => firstParam(value).replace(/^#/, ""), "normalizeTokenId");
    getPathContractId = /* @__PURE__ */ __name((params) => {
      const address = firstParam(params.contractAddress);
      const contractName = firstParam(params.contractName);
      if (!address || !contractName) {
        return "";
      }
      const contractId = `${address}.${contractName}`;
      return parseRuntimeContractRef(contractId) ? contractId : "";
    }, "getPathContractId");
    buildRuntimeInscriptionRequest = /* @__PURE__ */ __name((params) => {
      const { request, routeParams = {} } = params;
      const sourceUrl = new URL(request.url);
      const runtimeUrl = new URL("/runtime/content", sourceUrl.origin);
      runtimeUrl.search = sourceUrl.search;
      const tokenId = normalizeTokenId(routeParams.tokenId) || normalizeTokenId(sourceUrl.searchParams.get("tokenId"));
      const pathContractId = getPathContractId(routeParams);
      const queryContractId = sourceUrl.searchParams.get("contractId")?.trim() || "";
      const contractId = pathContractId || queryContractId || DEFAULT_INSCRIPTION_CONTRACT_ID;
      const network = firstParam(routeParams.network) || sourceUrl.searchParams.get("network")?.trim() || DEFAULT_INSCRIPTION_NETWORK;
      runtimeUrl.searchParams.set("contractId", contractId);
      runtimeUrl.searchParams.set("tokenId", tokenId);
      runtimeUrl.searchParams.set("network", network);
      if (!pathContractId && !sourceUrl.searchParams.has("fallbackContractId") && contractId === DEFAULT_INSCRIPTION_CONTRACT_ID && DEFAULT_INSCRIPTION_FALLBACK_CONTRACT_ID) {
        runtimeUrl.searchParams.set(
          "fallbackContractId",
          DEFAULT_INSCRIPTION_FALLBACK_CONTRACT_ID
        );
      }
      return new Request(runtimeUrl.toString(), {
        method: request.method,
        headers: request.headers
      });
    }, "buildRuntimeInscriptionRequest");
    onInscriptionRequest = /* @__PURE__ */ __name(async ({
      request,
      env,
      params,
      waitUntil
    }) => onRequest3({
      request: buildRuntimeInscriptionRequest({
        request,
        routeParams: params
      }),
      env,
      waitUntil
    }), "onInscriptionRequest");
  }
});

// inscription/[network]/[contractAddress]/[contractName]/[tokenId].ts
var onRequest4;
var init_tokenId = __esm({
  "inscription/[network]/[contractAddress]/[contractName]/[tokenId].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_handler2();
    onRequest4 = onInscriptionRequest;
  }
});

// lib/db.ts
async function queryAll(env, query, binds = []) {
  const statement = resolveDb(env).prepare(query);
  if (binds.length > 0) {
    return statement.bind(...binds).all();
  }
  return statement.all();
}
async function run(env, query, binds = []) {
  const statement = resolveDb(env).prepare(query);
  if (binds.length > 0) {
    return statement.bind(...binds).run();
  }
  return statement.run();
}
var resolveDb;
var init_db = __esm({
  "lib/db.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    resolveDb = /* @__PURE__ */ __name((env) => {
      const candidate = env.DB ?? env.D1 ?? env.db;
      if (!candidate || typeof candidate.prepare !== "function") {
        const availableBindings = Object.keys(env).filter((key) => key.trim().length > 0).sort().join(", ");
        throw new Error(
          `Missing D1 binding. Configure D1 as binding \`DB\` for this Pages environment. Available bindings: ${availableBindings || "none"}`
        );
      }
      return candidate;
    }, "resolveDb");
    __name(queryAll, "queryAll");
    __name(run, "run");
  }
});

// index/dependents/[contract].ts
var CORS, json, DEFAULT_LIMIT, MAX_LIMIT, getState, queryDependents, onRequest5;
var init_contract = __esm({
  "index/dependents/[contract].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_lib();
    init_db();
    CORS = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "content-type"
    };
    json = /* @__PURE__ */ __name((body, status = 200, extraHeaders = {}) => new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json", ...CORS, ...extraHeaders }
    }), "json");
    DEFAULT_LIMIT = 100;
    MAX_LIMIT = 500;
    getState = /* @__PURE__ */ __name(async (env, contractId) => {
      const res = await queryAll(
        env,
        "SELECT minted_count, synced_count FROM inscription_index_state WHERE contract = ?",
        [contractId]
      );
      const row = (res.results ?? [])[0];
      return { mintedCount: row?.minted_count ?? 0, syncedCount: row?.synced_count ?? 0 };
    }, "getState");
    queryDependents = /* @__PURE__ */ __name(async (env, contractId, id, limit, offset) => {
      const res = await queryAll(
        env,
        `SELECT d.child_id AS id, i.creator, i.owner, i.token_uri AS tokenUri,
            i.mime, i.total_size AS totalSize, i.sealed, i.final_hash AS finalHash, i.updated_at AS updatedAt
       FROM inscription_dependencies d
       LEFT JOIN inscription_index i
         ON i.contract = d.contract AND i.token_id = d.child_id
      WHERE d.contract = ?1 AND d.dependency_id = ?2
      ORDER BY d.child_id ASC
      LIMIT ?3 OFFSET ?4`,
        [contractId, id, limit + 1, offset]
      );
      return res.results ?? [];
    }, "queryDependents");
    onRequest5 = /* @__PURE__ */ __name(async (context) => {
      const { request, params, env } = context;
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
      if (request.method !== "GET") return json({ error: "Method not allowed." }, 405);
      const contractId = params.contract ?? "";
      const contract = parseRuntimeContractRef(contractId);
      if (!contract) return json({ error: "Invalid contract id." }, 400);
      const url = new URL(request.url);
      const idRaw = Number(url.searchParams.get("id"));
      if (!Number.isInteger(idRaw) || idRaw <= 0) {
        return json({ error: "Missing or invalid id." }, 400);
      }
      const limit = Math.min(MAX_LIMIT, Math.max(1, Number(url.searchParams.get("limit")) || DEFAULT_LIMIT));
      const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
      try {
        const [rows, state] = await Promise.all([
          queryDependents(env, contractId, idRaw, limit, offset),
          getState(env, contractId)
        ]);
        if (context.waitUntil && state.syncedCount < state.mintedCount) {
          const syncUrl = new URL(`/index/${contractId}`, url.origin);
          context.waitUntil(fetch(syncUrl.toString(), { method: "POST" }).then(() => void 0).catch(() => void 0));
        }
        const hasMore = rows.length > limit;
        const page = hasMore ? rows.slice(0, limit) : rows;
        const complete = state.syncedCount >= state.mintedCount && state.mintedCount > 0;
        return json(
          {
            contract: contractId,
            id: idRaw,
            mintedCount: state.mintedCount,
            syncedCount: state.syncedCount,
            complete,
            dependents: page,
            pagination: { limit, offset, hasMore, nextOffset: hasMore ? offset + limit : null }
          },
          200,
          { "Cache-Control": "public, max-age=15, s-maxage=60, stale-while-revalidate=300" }
        );
      } catch (error) {
        return json({ error: error instanceof Error ? error.message : String(error) }, 500);
      }
    }, "onRequest");
  }
});

// index/relations/[contract].ts
var CORS2, json2, MAX_DEPTH, MAX_ROWS, getState2, queryDescendants, queryAncestors, querySiblings, onRequest6;
var init_contract2 = __esm({
  "index/relations/[contract].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_lib();
    init_db();
    CORS2 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "content-type"
    };
    json2 = /* @__PURE__ */ __name((body, status = 200, extraHeaders = {}) => new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json", ...CORS2, ...extraHeaders }
    }), "json");
    MAX_DEPTH = 32;
    MAX_ROWS = 2e3;
    getState2 = /* @__PURE__ */ __name(async (env, contractId) => {
      const res = await queryAll(
        env,
        "SELECT minted_count, synced_count FROM inscription_index_state WHERE contract = ?",
        [contractId]
      );
      const row = (res.results ?? [])[0];
      return { mintedCount: row?.minted_count ?? 0, syncedCount: row?.synced_count ?? 0 };
    }, "getState");
    queryDescendants = /* @__PURE__ */ __name(async (env, contractId, id) => {
      const res = await queryAll(
        env,
        `WITH RECURSIVE descs(id, depth) AS (
       SELECT child_id, 1 FROM inscription_parents
        WHERE contract = ?1 AND parent_id = ?2
       UNION
       SELECT ip.child_id, descs.depth + 1
         FROM inscription_parents ip
         JOIN descs ON ip.parent_id = descs.id
        WHERE ip.contract = ?1 AND descs.depth < ?3
     )
     SELECT id, MIN(depth) AS depth FROM descs
     GROUP BY id ORDER BY depth ASC, id ASC LIMIT ?4`,
        [contractId, id, MAX_DEPTH, MAX_ROWS]
      );
      return res.results ?? [];
    }, "queryDescendants");
    queryAncestors = /* @__PURE__ */ __name(async (env, contractId, id) => {
      const res = await queryAll(
        env,
        `WITH RECURSIVE ancs(id, depth) AS (
       SELECT parent_id, 1 FROM inscription_parents
        WHERE contract = ?1 AND child_id = ?2
       UNION
       SELECT ip.parent_id, ancs.depth + 1
         FROM inscription_parents ip
         JOIN ancs ON ip.child_id = ancs.id
        WHERE ip.contract = ?1 AND ancs.depth < ?3
     )
     SELECT id, MIN(depth) AS depth FROM ancs
     GROUP BY id ORDER BY depth ASC, id ASC LIMIT ?4`,
        [contractId, id, MAX_DEPTH, MAX_ROWS]
      );
      return res.results ?? [];
    }, "queryAncestors");
    querySiblings = /* @__PURE__ */ __name(async (env, contractId, id) => {
      const res = await queryAll(
        env,
        `SELECT DISTINCT child_id AS id FROM inscription_parents
      WHERE contract = ?1
        AND parent_id IN (
          SELECT parent_id FROM inscription_parents WHERE contract = ?1 AND child_id = ?2
        )
        AND child_id <> ?2
      ORDER BY child_id ASC LIMIT ?3`,
        [contractId, id, MAX_ROWS]
      );
      return res.results ?? [];
    }, "querySiblings");
    onRequest6 = /* @__PURE__ */ __name(async (context) => {
      const { request, params, env } = context;
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS2 });
      if (request.method !== "GET") return json2({ error: "Method not allowed." }, 405);
      const contractId = params.contract ?? "";
      const contract = parseRuntimeContractRef(contractId);
      if (!contract) return json2({ error: "Invalid contract id." }, 400);
      const url = new URL(request.url);
      const idRaw = Number(url.searchParams.get("id"));
      if (!Number.isInteger(idRaw) || idRaw <= 0) {
        return json2({ error: "Missing or invalid id." }, 400);
      }
      try {
        const [descendants, ancestors, siblings, state] = await Promise.all([
          queryDescendants(env, contractId, idRaw),
          queryAncestors(env, contractId, idRaw),
          querySiblings(env, contractId, idRaw),
          getState2(env, contractId)
        ]);
        if (context.waitUntil && state.syncedCount < state.mintedCount) {
          const syncUrl = new URL(`/index/${contractId}`, url.origin);
          context.waitUntil(
            fetch(syncUrl.toString(), { method: "POST" }).then(() => void 0).catch(() => void 0)
          );
        }
        const complete = state.syncedCount >= state.mintedCount && state.mintedCount > 0;
        const payload = {
          contract: contractId,
          id: idRaw,
          mintedCount: state.mintedCount,
          syncedCount: state.syncedCount,
          complete,
          parents: ancestors.filter((r) => r.depth === 1).map((r) => r.id),
          children: descendants.filter((r) => r.depth === 1).map((r) => r.id),
          ancestors: ancestors.map((r) => ({ id: r.id, depth: r.depth })),
          descendants: descendants.map((r) => ({ id: r.id, depth: r.depth })),
          siblings: siblings.map((r) => r.id)
        };
        return json2(payload, 200, {
          // Brief browser cache; longer edge TTL with SWR. The edges only change when
          // new children are minted, which the rolling sync picks up.
          "Cache-Control": "public, max-age=15, s-maxage=60, stale-while-revalidate=300"
        });
      } catch (error) {
        return json2({ error: error instanceof Error ? error.message : String(error) }, 500);
      }
    }, "onRequest");
  }
});

// lib/utils.ts
function jsonResponse(payload, status = 200, headers) {
  const responseHeaders = new Headers({ "Content-Type": "application/json" });
  if (headers) {
    const extraHeaders = new Headers(headers);
    extraHeaders.forEach((value, key) => {
      responseHeaders.set(key, value);
    });
  }
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders
  });
}
function badRequest(message) {
  return jsonResponse({ error: message }, 400);
}
function notFound(message = "Not found") {
  return jsonResponse({ error: message }, 404);
}
function serverError(message = "Server error") {
  return jsonResponse({ error: message }, 500);
}
var init_utils5 = __esm({
  "lib/utils.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    __name(jsonResponse, "jsonResponse");
    __name(badRequest, "badRequest");
    __name(notFound, "notFound");
    __name(serverError, "serverError");
  }
});

// lib/collections.ts
var slugPattern, XTRATA_MANAGE_FIXED_RECIPIENT_ADDRESS, normalizeSlug, isValidSlug, staysWithinLimit, parseCollectionMetadata, toNullableString, normalizeCollectionState, isCollectionUploadsLocked, canStageUploadsBeforeDeploy, mergeCollectionMetadata, canonicalizeManageCollectionMetadata, stripDeployPricingLockFromMetadata, canReuseCollectionSlug, toRecord, toFiniteNumber, toBoolean, isCollectionPublicVisible, getCollectionDisplayOrder, sortCollectionsForPublicDisplay, isCollectionPublished;
var init_collections = __esm({
  "lib/collections.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    slugPattern = /^[a-z0-9-]{3,64}$/;
    XTRATA_MANAGE_FIXED_RECIPIENT_ADDRESS = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X";
    normalizeSlug = /* @__PURE__ */ __name((value) => value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"), "normalizeSlug");
    isValidSlug = /* @__PURE__ */ __name((value) => slugPattern.test(value), "isValidSlug");
    staysWithinLimit = /* @__PURE__ */ __name((currentBytes, upcomingBytes, limitBytes) => currentBytes + upcomingBytes <= limitBytes, "staysWithinLimit");
    parseCollectionMetadata = /* @__PURE__ */ __name((value) => {
      if (!value) {
        return null;
      }
      if (typeof value === "object") {
        return value;
      }
      if (typeof value !== "string") {
        return null;
      }
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }, "parseCollectionMetadata");
    toNullableString = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }, "toNullableString");
    normalizeCollectionState = /* @__PURE__ */ __name((value) => String(value ?? "").trim().toLowerCase(), "normalizeCollectionState");
    isCollectionUploadsLocked = /* @__PURE__ */ __name((state) => {
      const normalizedState = normalizeCollectionState(state);
      return normalizedState === "published" || normalizedState === "archived";
    }, "isCollectionUploadsLocked");
    canStageUploadsBeforeDeploy = /* @__PURE__ */ __name((params) => {
      const hasContract = toNullableString(params.contractAddress) !== null;
      return !hasContract && normalizeCollectionState(params.state) === "draft";
    }, "canStageUploadsBeforeDeploy");
    mergeCollectionMetadata = /* @__PURE__ */ __name((existingMetadata, incomingMetadata) => {
      const existing = parseCollectionMetadata(existingMetadata);
      const incoming = incomingMetadata && typeof incomingMetadata === "object" ? incomingMetadata : null;
      if (!existing && !incoming) {
        return null;
      }
      return {
        ...existing ?? {},
        ...incoming ?? {}
      };
    }, "mergeCollectionMetadata");
    canonicalizeManageCollectionMetadata = /* @__PURE__ */ __name((metadata) => {
      const parsed = parseCollectionMetadata(metadata);
      if (!parsed) {
        return null;
      }
      const toRecord2 = /* @__PURE__ */ __name((value) => value && typeof value === "object" ? value : null, "toRecord");
      const coreContractId = toNullableString(parsed.coreContractId);
      const [coreAddress = ""] = coreContractId?.split(".") ?? [];
      const lockedRecipient = coreAddress.trim().toUpperCase() || XTRATA_MANAGE_FIXED_RECIPIENT_ADDRESS;
      const hardcodedDefaults = toRecord2(parsed.hardcodedDefaults);
      const recipients = toRecord2(hardcodedDefaults?.recipients);
      return {
        ...parsed,
        hardcodedDefaults: {
          ...hardcodedDefaults ?? {},
          recipients: {
            ...recipients ?? {},
            marketplace: lockedRecipient,
            operator: lockedRecipient
          }
        }
      };
    }, "canonicalizeManageCollectionMetadata");
    stripDeployPricingLockFromMetadata = /* @__PURE__ */ __name((metadata) => {
      const parsed = parseCollectionMetadata(metadata);
      if (!parsed) {
        return {
          metadata: null,
          changed: false
        };
      }
      if (!Object.prototype.hasOwnProperty.call(parsed, "deployPricingLock")) {
        return {
          metadata: parsed,
          changed: false
        };
      }
      const next = { ...parsed };
      delete next.deployPricingLock;
      return {
        metadata: next,
        changed: true
      };
    }, "stripDeployPricingLockFromMetadata");
    canReuseCollectionSlug = /* @__PURE__ */ __name((params) => {
      const incomingArtist = params.incomingArtistAddress.trim().toUpperCase();
      const existingArtist = toNullableString(params.existingArtistAddress)?.toUpperCase() ?? "";
      if (!incomingArtist || !existingArtist || incomingArtist !== existingArtist) {
        return false;
      }
      if (toNullableString(params.contractAddress)) {
        return false;
      }
      const metadataRecord = parseCollectionMetadata(params.metadata);
      if (toNullableString(metadataRecord?.deployTxId)) {
        return false;
      }
      if (normalizeCollectionState(params.state) === "published") {
        return false;
      }
      return true;
    }, "canReuseCollectionSlug");
    toRecord = /* @__PURE__ */ __name((value) => value && typeof value === "object" ? value : null, "toRecord");
    toFiniteNumber = /* @__PURE__ */ __name((value) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
          return null;
        }
        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : null;
      }
      return null;
    }, "toFiniteNumber");
    toBoolean = /* @__PURE__ */ __name((value) => {
      if (typeof value === "boolean") {
        return value;
      }
      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (normalized === "true" || normalized === "1" || normalized === "yes") {
          return true;
        }
        if (normalized === "false" || normalized === "0" || normalized === "no") {
          return false;
        }
      }
      if (typeof value === "number" && Number.isFinite(value)) {
        if (value === 1) {
          return true;
        }
        if (value === 0) {
          return false;
        }
      }
      return null;
    }, "toBoolean");
    isCollectionPublicVisible = /* @__PURE__ */ __name((metadata) => {
      const metadataRecord = parseCollectionMetadata(metadata);
      const collectionPage = toRecord(metadataRecord?.collectionPage);
      return toBoolean(collectionPage?.showOnPublicPage) === true;
    }, "isCollectionPublicVisible");
    getCollectionDisplayOrder = /* @__PURE__ */ __name((metadata) => {
      const metadataRecord = parseCollectionMetadata(metadata);
      const collectionPage = toRecord(metadataRecord?.collectionPage);
      const rawOrder = toFiniteNumber(collectionPage?.displayOrder);
      if (rawOrder === null) {
        return null;
      }
      return Math.trunc(rawOrder);
    }, "getCollectionDisplayOrder");
    sortCollectionsForPublicDisplay = /* @__PURE__ */ __name((rows) => {
      const copy = [...rows];
      copy.sort((left, right) => {
        const leftOrder = getCollectionDisplayOrder(left.metadata);
        const rightOrder = getCollectionDisplayOrder(right.metadata);
        if (leftOrder !== null && rightOrder !== null && leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }
        if (leftOrder !== null && rightOrder === null) {
          return -1;
        }
        if (leftOrder === null && rightOrder !== null) {
          return 1;
        }
        const leftCreated = toFiniteNumber(left.created_at) ?? 0;
        const rightCreated = toFiniteNumber(right.created_at) ?? 0;
        if (leftCreated !== rightCreated) {
          return rightCreated - leftCreated;
        }
        const leftId = String(left.id ?? "");
        const rightId = String(right.id ?? "");
        return leftId.localeCompare(rightId);
      });
      return copy;
    }, "sortCollectionsForPublicDisplay");
    isCollectionPublished = /* @__PURE__ */ __name((state) => String(state ?? "").trim().toLowerCase() === "published", "isCollectionPublished");
  }
});

// collections/[collectionId]/asset-preview.ts
var toNullableString2, isImageMimeType, PUBLIC_PREVIEW_CACHE_CONTROL, PRIVATE_PREVIEW_CACHE_CONTROL, resolveAssetsBucket, onRequest7;
var init_asset_preview = __esm({
  "collections/[collectionId]/asset-preview.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_db();
    init_collections();
    toNullableString2 = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }, "toNullableString");
    isImageMimeType = /* @__PURE__ */ __name((mimeType) => Boolean(mimeType && mimeType.toLowerCase().startsWith("image/")), "isImageMimeType");
    PUBLIC_PREVIEW_CACHE_CONTROL = "public, max-age=300, s-maxage=900, stale-while-revalidate=3600";
    PRIVATE_PREVIEW_CACHE_CONTROL = "private, no-store, max-age=0";
    resolveAssetsBucket = /* @__PURE__ */ __name((env) => {
      const candidates = [
        { key: "COLLECTION_ASSETS", bucket: env.COLLECTION_ASSETS },
        { key: "ASSETS", bucket: env.ASSETS },
        { key: "R2", bucket: env.R2 }
      ];
      const active = candidates.find(
        (candidate) => candidate.bucket && typeof candidate.bucket.get === "function"
      ) ?? null;
      return {
        bucket: active?.bucket ?? null,
        binding: active?.key ?? null,
        availableBindings: candidates.map((candidate) => candidate.key).filter((key) => env[key] != null)
      };
    }, "resolveAssetsBucket");
    onRequest7 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const requestId = crypto.randomUUID();
      if (request.method !== "GET") {
        return jsonResponse(
          { error: `Method not allowed. Request ID: ${requestId}` },
          405
        );
      }
      const collectionId = toNullableString2(params?.collectionId);
      if (!collectionId) {
        return badRequest(`Collection id missing. Request ID: ${requestId}`);
      }
      const url = new URL(request.url);
      const assetId = toNullableString2(url.searchParams.get("assetId"));
      if (!assetId) {
        return badRequest(`assetId query param is required. Request ID: ${requestId}`);
      }
      const purpose = toNullableString2(url.searchParams.get("purpose"))?.toLowerCase();
      const coverPreviewOnly = purpose === "cover";
      try {
        const result = await queryAll(
          env,
          `SELECT
         a.asset_id,
         a.storage_key,
         a.mime_type,
         c.state as collection_state,
         c.metadata as collection_metadata
       FROM assets a
       JOIN collections c ON c.id = a.collection_id
       WHERE a.collection_id = ? AND a.asset_id = ?
       LIMIT 1`,
          [collectionId, assetId]
        );
        const row = (result.results ?? [])[0];
        if (!row) {
          return notFound("Asset not found for this collection.");
        }
        const storageKey = toNullableString2(row.storage_key);
        const mimeType = toNullableString2(row.mime_type);
        const shouldPublicCache = isCollectionPublished(row.collection_state) && isCollectionPublicVisible(parseCollectionMetadata(row.collection_metadata));
        if (!storageKey) {
          return badRequest(`Asset is missing a storage key. Request ID: ${requestId}`);
        }
        if (coverPreviewOnly && !isImageMimeType(mimeType)) {
          return badRequest(
            `Selected asset is not an image and cannot be used as cover art. Request ID: ${requestId}`
          );
        }
        const resolved = resolveAssetsBucket(env);
        if (!resolved.bucket) {
          return serverError(
            `Missing R2 binding for asset previews. Expected \`COLLECTION_ASSETS\` (fallback: \`ASSETS\` or \`R2\`). Available: ${resolved.availableBindings.length > 0 ? resolved.availableBindings.join(", ") : "none"}. Request ID: ${requestId}`
          );
        }
        const object = await resolved.bucket.get(storageKey);
        if (!object || !object.body) {
          return notFound("Asset content not found in storage.");
        }
        const headers = new Headers();
        headers.set(
          "Content-Type",
          object.httpMetadata?.contentType ?? mimeType ?? "application/octet-stream"
        );
        headers.set(
          "Cache-Control",
          shouldPublicCache ? PUBLIC_PREVIEW_CACHE_CONTROL : PRIVATE_PREVIEW_CACHE_CONTROL
        );
        headers.set("X-Xtrata-Request-Id", requestId);
        headers.set("X-Xtrata-Asset-Binding", resolved.binding ?? "unknown");
        return new Response(object.body, { status: 200, headers });
      } catch (error) {
        return serverError(
          `${error instanceof Error ? error.message : "Failed to load asset preview"} (Request ID: ${requestId})`
        );
      }
    }, "onRequest");
  }
});

// lib/collection-deploy.ts
async function getCollectionDeployReadiness(params) {
  const providedFetcher = params.fetcher;
  const fetcher = providedFetcher ? (input, init) => providedFetcher(input, init) : (input, init) => globalThis.fetch(input, init);
  const queryAllImpl = params.queryAllImpl ?? queryAll;
  const collectionId = params.collectionId.trim();
  if (!collectionId) {
    return {
      ready: false,
      reason: "Collection id missing.",
      collection: null,
      metadata: null,
      deployTxId: null,
      deployTxStatus: null,
      network: null
    };
  }
  const collectionResult = await queryAllImpl(
    params.env,
    "SELECT * FROM collections WHERE id = ?",
    [collectionId]
  );
  const collection = collectionResult.results?.[0] ?? null;
  if (!collection) {
    return {
      ready: false,
      reason: "Collection not found.",
      collection: null,
      metadata: null,
      deployTxId: null,
      deployTxStatus: null,
      network: null
    };
  }
  const contractAddress = toNullableString3(collection.contract_address);
  if (!contractAddress) {
    return {
      ready: false,
      reason: "Deploy the collection contract before uploading artwork.",
      collection,
      metadata: parseMetadata(collection.metadata),
      deployTxId: null,
      deployTxStatus: null,
      network: null
    };
  }
  const metadata = parseMetadata(collection.metadata);
  const networkOrder = resolveNetworkOrder({
    contractAddress,
    coreContractId: toNullableString3(metadata?.coreContractId)
  });
  const apiKeys = getHiroApiKeys(params.env);
  const deployTxId = toNullableString3(metadata?.deployTxId);
  if (!deployTxId) {
    const contractTarget = resolveContractLookupTarget({
      collection,
      contractAddress,
      metadata
    });
    if (!contractTarget) {
      return {
        ready: false,
        reason: "Deployment transaction is not recorded yet. Retry deployment and wait for wallet submission.",
        collection,
        metadata,
        deployTxId: null,
        deployTxStatus: null,
        network: null
      };
    }
    for (const network of networkOrder) {
      const contractSourceUrl = `${hiroBaseByNetwork(network)}/v2/contracts/source/${contractTarget.address}/${contractTarget.contractName}`;
      const response = await fetchWithHiroKeyFallback({
        fetcher,
        url: contractSourceUrl,
        apiKeys
      });
      if (response.status === 404) {
        continue;
      }
      if (!response.ok) {
        return {
          ready: false,
          reason: `Unable to verify deployed contract on Hiro (${response.status}). Try again shortly.`,
          collection,
          metadata,
          deployTxId: null,
          deployTxStatus: null,
          network
        };
      }
      const payload = await response.json();
      if (!toNullableString3(payload.source)) {
        return {
          ready: false,
          reason: "Contract source response from Hiro was empty. Try again shortly.",
          collection,
          metadata,
          deployTxId: null,
          deployTxStatus: null,
          network
        };
      }
      return {
        ready: true,
        reason: `Deployment confirmed from contract source (${contractTarget.contractId}).`,
        collection,
        metadata,
        deployTxId: null,
        deployTxStatus: "success",
        network
      };
    }
    return {
      ready: false,
      reason: "Deployment transaction is not recorded yet. Retry deployment and wait for wallet submission.",
      collection,
      metadata,
      deployTxId: null,
      deployTxStatus: null,
      network: networkOrder[0]
    };
  }
  const txId = normalizeTxId(deployTxId);
  for (const network of networkOrder) {
    const url = `${hiroBaseByNetwork(network)}/extended/v1/tx/${txId}`;
    const response = await fetchWithHiroKeyFallback({
      fetcher,
      url,
      apiKeys
    });
    if (response.status === 404) {
      continue;
    }
    if (!response.ok) {
      return {
        ready: false,
        reason: `Unable to verify deployment on Hiro (${response.status}). Try again shortly.`,
        collection,
        metadata,
        deployTxId: txId,
        deployTxStatus: null,
        network
      };
    }
    const payload = await response.json();
    const txStatus = toNullableString3(payload.tx_status);
    if (!txStatus) {
      return {
        ready: false,
        reason: "Deployment status is unavailable from Hiro. Try again shortly.",
        collection,
        metadata,
        deployTxId: txId,
        deployTxStatus: null,
        network
      };
    }
    if (txStatus === "success") {
      return {
        ready: true,
        reason: "Deployment confirmed.",
        collection,
        metadata,
        deployTxId: txId,
        deployTxStatus: txStatus,
        network
      };
    }
    return {
      ready: false,
      reason: `Deployment transaction status is "${txStatus}". Upload unlocks after success.`,
      collection,
      metadata,
      deployTxId: txId,
      deployTxStatus: txStatus,
      network
    };
  }
  return {
    ready: false,
    reason: "Deployment transaction is not indexed yet. Wait for confirmation, then retry.",
    collection,
    metadata,
    deployTxId: txId,
    deployTxStatus: null,
    network: networkOrder[0]
  };
}
var toNullableString3, parseMetadata, normalizeTxId, CONTRACT_NAME_PATTERN, inferNetworkFromPrincipal, resolveNetworkOrder, hiroBaseByNetwork, normalizePrincipal, parseContractId, deriveExpectedContractName, resolveContractLookupTarget, buildHiroHeaders, fetchWithHiroKeyFallback;
var init_collection_deploy = __esm({
  "lib/collection-deploy.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_db();
    init_hiro_keys();
    toNullableString3 = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }, "toNullableString");
    parseMetadata = /* @__PURE__ */ __name((value) => {
      if (!value) {
        return null;
      }
      if (typeof value === "object") {
        return value;
      }
      if (typeof value !== "string") {
        return null;
      }
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }, "parseMetadata");
    normalizeTxId = /* @__PURE__ */ __name((value) => value.startsWith("0x") ? value : `0x${value}`, "normalizeTxId");
    CONTRACT_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9-_]{0,127}$/;
    inferNetworkFromPrincipal = /* @__PURE__ */ __name((value) => {
      if (!value) {
        return null;
      }
      const principal = value.split(".")[0]?.trim().toUpperCase() ?? "";
      if (principal.startsWith("SP") || principal.startsWith("SM")) {
        return "mainnet";
      }
      if (principal.startsWith("ST") || principal.startsWith("SN")) {
        return "testnet";
      }
      return null;
    }, "inferNetworkFromPrincipal");
    resolveNetworkOrder = /* @__PURE__ */ __name((params) => {
      const inferredFromCore = inferNetworkFromPrincipal(params.coreContractId);
      const inferredFromAddress = inferNetworkFromPrincipal(params.contractAddress);
      const inferred = inferredFromCore ?? inferredFromAddress;
      if (inferred === "testnet") {
        return ["testnet", "mainnet"];
      }
      return ["mainnet", "testnet"];
    }, "resolveNetworkOrder");
    hiroBaseByNetwork = /* @__PURE__ */ __name((network) => network === "testnet" ? "https://api.testnet.hiro.so" : "https://api.mainnet.hiro.so", "hiroBaseByNetwork");
    normalizePrincipal = /* @__PURE__ */ __name((value) => value.trim().replace(/^'+/, ""), "normalizePrincipal");
    parseContractId = /* @__PURE__ */ __name((value) => {
      if (!value) {
        return null;
      }
      const normalized = normalizePrincipal(value);
      const dotIndex = normalized.indexOf(".");
      if (dotIndex <= 0 || dotIndex >= normalized.length - 1) {
        return null;
      }
      const address = normalized.slice(0, dotIndex).trim();
      const contractName = normalized.slice(dotIndex + 1).trim();
      if (!inferNetworkFromPrincipal(address) || !CONTRACT_NAME_PATTERN.test(contractName)) {
        return null;
      }
      return {
        address,
        contractName,
        contractId: `${address}.${contractName}`
      };
    }, "parseContractId");
    deriveExpectedContractName = /* @__PURE__ */ __name((params) => {
      const rawSlug = toNullableString3(params.collection.slug);
      if (!rawSlug) {
        return null;
      }
      const slug = rawSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
      if (!slug) {
        return null;
      }
      const mintType = toNullableString3(params.metadata?.mintType)?.toLowerCase() === "pre-inscribed" ? "pre-inscribed" : "standard";
      const prefix = mintType === "pre-inscribed" ? "xtrata-preinscribed" : "xtrata-collection";
      const seed = (toNullableString3(params.collection.id) ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
      let contractName = `${prefix}-${slug}`;
      if (seed) {
        contractName = `${contractName}-${seed}`;
      }
      contractName = contractName.slice(0, 128).replace(/-+$/g, "");
      return CONTRACT_NAME_PATTERN.test(contractName) ? contractName : null;
    }, "deriveExpectedContractName");
    resolveContractLookupTarget = /* @__PURE__ */ __name((params) => {
      const parsedFromContractAddress = parseContractId(params.contractAddress);
      if (parsedFromContractAddress) {
        return parsedFromContractAddress;
      }
      const parsedFromContractId = parseContractId(toNullableString3(params.metadata?.contractId));
      if (parsedFromContractId) {
        return parsedFromContractId;
      }
      const contractName = toNullableString3(params.metadata?.contractName) ?? deriveExpectedContractName({
        collection: params.collection,
        metadata: params.metadata
      });
      if (!contractName || !CONTRACT_NAME_PATTERN.test(contractName)) {
        return null;
      }
      const principalFromCollection = normalizePrincipal(params.contractAddress);
      if (inferNetworkFromPrincipal(principalFromCollection)) {
        return {
          address: principalFromCollection,
          contractName,
          contractId: `${principalFromCollection}.${contractName}`
        };
      }
      const principalFromMetadata = normalizePrincipal(
        toNullableString3(params.metadata?.contractAddress) ?? ""
      );
      if (!inferNetworkFromPrincipal(principalFromMetadata)) {
        return null;
      }
      return {
        address: principalFromMetadata,
        contractName,
        contractId: `${principalFromMetadata}.${contractName}`
      };
    }, "resolveContractLookupTarget");
    buildHiroHeaders = /* @__PURE__ */ __name((apiKey) => {
      const headers = new Headers();
      applyHiroApiKey(headers, apiKey);
      return headers;
    }, "buildHiroHeaders");
    fetchWithHiroKeyFallback = /* @__PURE__ */ __name(async (params) => {
      const keyCandidates = params.apiKeys.length > 0 ? params.apiKeys : [null];
      for (let i = 0; i < keyCandidates.length; i += 1) {
        const response = await params.fetcher(params.url, {
          headers: buildHiroHeaders(keyCandidates[i])
        });
        const hasNextKey = i < keyCandidates.length - 1;
        if (hasNextKey && shouldRetryWithNextHiroKey(response.status)) {
          continue;
        }
        return response;
      }
      return new Response("Hiro request failed.", { status: 502 });
    }, "fetchWithHiroKeyFallback");
    __name(getCollectionDeployReadiness, "getCollectionDeployReadiness");
  }
});

// collections/[collectionId]/assets.ts
var logAssetDebug, PUBLIC_ASSETS_CACHE_CONTROL, PRIVATE_NO_STORE_CACHE_CONTROL, toNullableString4, resolveAssetsBucket2, clearDeployPricingLock, onRequest8;
var init_assets = __esm({
  "collections/[collectionId]/assets.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_db();
    init_collections();
    init_collection_deploy();
    logAssetDebug = /* @__PURE__ */ __name((requestId, phase, details) => {
      console.log(`[collections/assets][${requestId}] ${phase}`, details);
    }, "logAssetDebug");
    PUBLIC_ASSETS_CACHE_CONTROL = "public, max-age=120, s-maxage=300, stale-while-revalidate=600";
    PRIVATE_NO_STORE_CACHE_CONTROL = "private, no-store, max-age=0";
    toNullableString4 = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }, "toNullableString");
    resolveAssetsBucket2 = /* @__PURE__ */ __name((env) => env.COLLECTION_ASSETS ?? env.ASSETS ?? env.R2 ?? null, "resolveAssetsBucket");
    clearDeployPricingLock = /* @__PURE__ */ __name(async (params) => {
      const result = stripDeployPricingLockFromMetadata(params.metadata);
      if (!result.changed || !result.metadata) {
        return false;
      }
      await run(
        params.env,
        "UPDATE collections SET metadata = ?, updated_at = ? WHERE id = ?",
        [JSON.stringify(result.metadata), Date.now(), params.collectionId]
      );
      logAssetDebug(params.requestId, "pricing-lock.cleared", {
        collectionId: params.collectionId
      });
      return true;
    }, "clearDeployPricingLock");
    onRequest8 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const requestId = crypto.randomUUID();
      const collectionId = params?.collectionId;
      logAssetDebug(requestId, "request.received", {
        method: request.method,
        collectionId: collectionId ?? null
      });
      if (!collectionId) {
        return badRequest("Collection id missing.");
      }
      if (request.method === "GET") {
        try {
          const collectionResult = await queryAll(
            env,
            "SELECT state, metadata FROM collections WHERE id = ? LIMIT 1",
            [collectionId]
          );
          const collectionRow = (collectionResult.results ?? [])[0];
          const isPublicCollection = collectionRow !== void 0 && isCollectionPublished(collectionRow.state) && isCollectionPublicVisible(parseCollectionMetadata(collectionRow.metadata));
          if (!isPublicCollection) {
            await run(
              env,
              "UPDATE assets SET state = ? WHERE collection_id = ? AND expires_at IS NOT NULL AND expires_at < ? AND state = ?",
              ["expired", collectionId, Date.now(), "draft"]
            );
          }
          const result = await queryAll(
            env,
            "SELECT * FROM assets WHERE collection_id = ? ORDER BY created_at DESC",
            [collectionId]
          );
          return jsonResponse(result.results ?? [], 200, {
            "Cache-Control": isPublicCollection ? PUBLIC_ASSETS_CACHE_CONTROL : PRIVATE_NO_STORE_CACHE_CONTROL
          });
        } catch (error) {
          return serverError(error instanceof Error ? error.message : "Failed to load assets");
        }
      }
      if (request.method === "POST") {
        try {
          const readiness = await getCollectionDeployReadiness({
            env,
            collectionId
          });
          const contractAddress = String(readiness.collection?.contract_address ?? "").trim();
          logAssetDebug(requestId, "readiness.checked", {
            ready: readiness.ready,
            reason: readiness.ready ? null : readiness.reason,
            contractAddress: contractAddress || null
          });
          const collectionState = String(readiness.collection?.state ?? "draft").trim().toLowerCase();
          const predeployUploadsAllowed = canStageUploadsBeforeDeploy({
            contractAddress,
            state: collectionState
          });
          if (!readiness.ready && !predeployUploadsAllowed) {
            return badRequest(readiness.reason);
          }
          if (isCollectionUploadsLocked(collectionState)) {
            return badRequest(
              `Uploads are locked while collection state is "${collectionState}".`
            );
          }
          const payload = await request.json();
          const path = String(payload.path ?? "").trim();
          if (!path) {
            return badRequest("path is required.");
          }
          const storageKey = String(payload.storageKey ?? "").trim();
          if (!storageKey) {
            return badRequest("storageKey is required.");
          }
          const mimeType = String(payload.mimeType ?? "application/octet-stream");
          const totalBytes = Number(payload.totalBytes ?? 0);
          const totalChunks = Number(payload.totalChunks ?? 0);
          const expectedHash = String(payload.expectedHash ?? "");
          logAssetDebug(requestId, "payload.received", {
            path,
            totalBytes,
            totalChunks,
            mimeType,
            hasStorageKey: storageKey.length > 0,
            expectedHashLength: expectedHash.length
          });
          const limitBytes = Number(env.MAX_COLLECTION_STORAGE_BYTES ?? 500 * 1024 * 1024);
          const aggregate = await queryAll(
            env,
            "SELECT COALESCE(SUM(total_bytes), 0) as total FROM assets WHERE collection_id = ? AND state != ?",
            [collectionId, "sold-out"]
          );
          const currentBytes = Number(aggregate.results?.[0]?.total ?? 0);
          logAssetDebug(requestId, "storage.limit.checked", {
            currentBytes,
            incomingBytes: totalBytes,
            limitBytes
          });
          if (!staysWithinLimit(currentBytes, totalBytes, limitBytes)) {
            return badRequest(
              `Collection storage limit exceeded. Limit: ${(limitBytes / (1024 * 1024)).toFixed(0)} MB.`
            );
          }
          const ttlMs = Number(env.COLLECTION_ASSET_TTL_MS ?? 3 * 24 * 60 * 60 * 1e3);
          const expiresAt = Date.now() + ttlMs;
          const assetId = crypto.randomUUID();
          await run(
            env,
            `INSERT INTO assets (asset_id, collection_id, path, filename, mime_type, total_bytes, total_chunks, expected_hash, storage_key, edition_cap, state, expires_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              assetId,
              collectionId,
              path,
              payload.filename ?? null,
              mimeType,
              totalBytes,
              totalChunks,
              expectedHash,
              storageKey,
              payload.editionCap ?? null,
              "draft",
              expiresAt,
              Date.now(),
              Date.now()
            ]
          );
          const inserted = await queryAll(
            env,
            "SELECT * FROM assets WHERE asset_id = ?",
            [assetId]
          );
          const row = (inserted.results ?? [])[0];
          await clearDeployPricingLock({
            env,
            collectionId,
            metadata: readiness.collection?.metadata,
            requestId
          });
          logAssetDebug(requestId, "asset.inserted", {
            assetId,
            collectionId,
            storageKey
          });
          return jsonResponse(row, 201);
        } catch (error) {
          logAssetDebug(requestId, "request.error", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack ?? null : null
          });
          return serverError(
            `${error instanceof Error ? error.message : "Failed to add asset"} (Request ID: ${requestId})`
          );
        }
      }
      if (request.method === "DELETE") {
        try {
          const assetId = new URL(request.url).searchParams.get("assetId")?.trim() ?? "";
          if (!assetId) {
            return badRequest("assetId is required.");
          }
          const collectionResult = await queryAll(
            env,
            "SELECT state, metadata FROM collections WHERE id = ? LIMIT 1",
            [collectionId]
          );
          const collectionRow = (collectionResult.results ?? [])[0];
          if (!collectionRow) {
            return notFound("Collection not found.");
          }
          const collectionState = String(collectionRow.state ?? "draft").trim().toLowerCase();
          if (isCollectionUploadsLocked(collectionState)) {
            return badRequest(
              `Uploads are locked while collection state is "${collectionState}".`
            );
          }
          const assetResult = await queryAll(
            env,
            "SELECT * FROM assets WHERE collection_id = ? AND asset_id = ? LIMIT 1",
            [collectionId, assetId]
          );
          const assetRow = (assetResult.results ?? [])[0];
          if (!assetRow) {
            return notFound("Asset not found.");
          }
          const assetState = String(assetRow.state ?? "draft").trim().toLowerCase();
          if (assetState === "sold-out") {
            return badRequest("Minted assets cannot be removed from staging.");
          }
          const reservationCountResult = await queryAll(
            env,
            "SELECT COUNT(*) as total FROM reservations WHERE collection_id = ? AND asset_id = ?",
            [collectionId, assetId]
          );
          const reservationCount = Number(
            reservationCountResult.results?.[0]?.total ?? 0
          );
          if (reservationCount > 0) {
            return badRequest(
              "This asset has reservation history and cannot be removed from staging."
            );
          }
          const pricingLockCleared = await clearDeployPricingLock({
            env,
            collectionId,
            metadata: collectionRow.metadata,
            requestId
          });
          await run(env, "DELETE FROM assets WHERE collection_id = ? AND asset_id = ?", [
            collectionId,
            assetId
          ]);
          const storageKey = toNullableString4(assetRow.storage_key);
          let storageObjectDeleted = false;
          if (storageKey) {
            const remainingRefsResult = await queryAll(
              env,
              "SELECT COUNT(*) as total FROM assets WHERE storage_key = ?",
              [storageKey]
            );
            const remainingRefs = Number(remainingRefsResult.results?.[0]?.total ?? 0);
            if (remainingRefs <= 0) {
              const bucket = resolveAssetsBucket2(env);
              if (bucket) {
                try {
                  await bucket.delete(storageKey);
                  storageObjectDeleted = true;
                } catch (error) {
                  logAssetDebug(requestId, "storage.delete.error", {
                    assetId,
                    storageKey,
                    message: error instanceof Error ? error.message : String(error)
                  });
                }
              }
            }
          }
          logAssetDebug(requestId, "asset.deleted", {
            assetId,
            collectionId,
            pricingLockCleared,
            storageObjectDeleted
          });
          return jsonResponse({
            deleted: true,
            assetId,
            pricingLockCleared,
            storageObjectDeleted
          });
        } catch (error) {
          logAssetDebug(requestId, "request.error", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack ?? null : null
          });
          return serverError(
            `${error instanceof Error ? error.message : "Failed to remove asset"} (Request ID: ${requestId})`
          );
        }
      }
      return jsonResponse({ error: "Method not allowed" }, 405);
    }, "onRequest");
  }
});

// lib/fee-guidance.ts
var MICROSTX_PER_STX, MINING_FEE_ASSUMPTIONS, toPositiveInteger2, formatMicroStx, estimateUploadBatchFeeMicroStx, buildMiningFeeGuidance;
var init_fee_guidance = __esm({
  "lib/fee-guidance.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    MICROSTX_PER_STX = 1e6;
    MINING_FEE_ASSUMPTIONS = Object.freeze({
      beginTxMicroStx: 3e3,
      sealTxMicroStx: 3e3,
      walletDefaultTxMicroStx: 5e5,
      uploadBatchChunkSize: 30,
      perChunkUploadMicroStx: 5e5 / 30,
      lowBallparkMultiplier: 0.75,
      highBallparkMultiplier: 1.35
    });
    toPositiveInteger2 = /* @__PURE__ */ __name((value) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return 0;
      }
      return Math.floor(parsed);
    }, "toPositiveInteger");
    formatMicroStx = /* @__PURE__ */ __name((value) => `${(value / MICROSTX_PER_STX).toFixed(6)} STX`, "formatMicroStx");
    estimateUploadBatchFeeMicroStx = /* @__PURE__ */ __name((chunkCount) => {
      const normalizedChunkCount = toPositiveInteger2(chunkCount);
      if (normalizedChunkCount <= 0) {
        return 0;
      }
      const estimated = MINING_FEE_ASSUMPTIONS.perChunkUploadMicroStx * normalizedChunkCount;
      return Math.max(MINING_FEE_ASSUMPTIONS.beginTxMicroStx, Math.round(estimated));
    }, "estimateUploadBatchFeeMicroStx");
    buildMiningFeeGuidance = /* @__PURE__ */ __name((params) => {
      const chunkCount = toPositiveInteger2(params.largestChunkCount);
      const warnings = [];
      if (chunkCount <= 0) {
        warnings.push(
          "No active artwork files found yet. Upload at least one file to generate mining-fee estimates."
        );
        return {
          available: false,
          chunkCount: 0,
          batchCount: 0,
          assumptions: {
            beginTxMicroStx: MINING_FEE_ASSUMPTIONS.beginTxMicroStx,
            sealTxMicroStx: MINING_FEE_ASSUMPTIONS.sealTxMicroStx,
            walletDefaultTxMicroStx: MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx,
            uploadBatchChunkSize: MINING_FEE_ASSUMPTIONS.uploadBatchChunkSize,
            perChunkUploadMicroStx: MINING_FEE_ASSUMPTIONS.perChunkUploadMicroStx
          },
          table: [],
          uploadBatches: [],
          totals: {
            recommendedMicroStx: 0,
            walletDefaultMicroStx: 0,
            lowBallparkMicroStx: 0,
            highBallparkMicroStx: 0,
            savingsMicroStx: 0
          },
          warnings
        };
      }
      const fullBatchChunkSize = MINING_FEE_ASSUMPTIONS.uploadBatchChunkSize;
      const fullBatchCount = Math.floor(chunkCount / fullBatchChunkSize);
      const remainderChunkCount = chunkCount % fullBatchChunkSize;
      const batchCount = fullBatchCount + (remainderChunkCount > 0 ? 1 : 0);
      const uploadBatches = [];
      if (fullBatchCount > 0) {
        const perTxFee = estimateUploadBatchFeeMicroStx(fullBatchChunkSize);
        const recommendedTotalMicroStx = perTxFee * fullBatchCount;
        const walletDefaultTotalMicroStx = MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx * fullBatchCount;
        uploadBatches.push({
          label: fullBatchCount === 1 ? `Full upload batch (${fullBatchChunkSize} chunks)` : `Full upload batches (${fullBatchChunkSize} chunks each)`,
          batchCount: fullBatchCount,
          chunkCountPerBatch: fullBatchChunkSize,
          totalChunks: fullBatchChunkSize * fullBatchCount,
          recommendedPerTxMicroStx: perTxFee,
          recommendedTotalMicroStx,
          walletDefaultPerTxMicroStx: MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx,
          walletDefaultTotalMicroStx,
          savingsMicroStx: Math.max(
            0,
            walletDefaultTotalMicroStx - recommendedTotalMicroStx
          ),
          note: `Calculated from ~${formatMicroStx(
            MINING_FEE_ASSUMPTIONS.perChunkUploadMicroStx
          )} per chunk.`
        });
      }
      if (remainderChunkCount > 0) {
        const perTxFee = estimateUploadBatchFeeMicroStx(remainderChunkCount);
        const walletDefaultTotalMicroStx = MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx;
        uploadBatches.push({
          label: fullBatchCount > 0 ? `Final upload batch (${remainderChunkCount} chunk${remainderChunkCount === 1 ? "" : "s"})` : `Single upload batch (${remainderChunkCount} chunk${remainderChunkCount === 1 ? "" : "s"})`,
          batchCount: 1,
          chunkCountPerBatch: remainderChunkCount,
          totalChunks: remainderChunkCount,
          recommendedPerTxMicroStx: perTxFee,
          recommendedTotalMicroStx: perTxFee,
          walletDefaultPerTxMicroStx: MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx,
          walletDefaultTotalMicroStx,
          savingsMicroStx: Math.max(0, walletDefaultTotalMicroStx - perTxFee),
          note: remainderChunkCount === 1 ? "This is a one-chunk upload batch. Wallet defaults are often much higher than needed." : `Scaled from ${remainderChunkCount} chunks in the final batch.`
        });
      }
      const uploadRecommendedTotal = uploadBatches.reduce(
        (sum, row) => sum + row.recommendedTotalMicroStx,
        0
      );
      const uploadWalletDefaultTotal = batchCount * MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx;
      const beginRecommended = MINING_FEE_ASSUMPTIONS.beginTxMicroStx;
      const sealRecommended = MINING_FEE_ASSUMPTIONS.sealTxMicroStx;
      const beginWalletDefault = MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx;
      const sealWalletDefault = MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx;
      const recommendedTotal = beginRecommended + uploadRecommendedTotal + sealRecommended;
      const walletDefaultTotal = beginWalletDefault + uploadWalletDefaultTotal + sealWalletDefault;
      const totalTxCount = batchCount + 2;
      const averageRecommendedPerUploadTx = batchCount > 0 ? Math.round(uploadRecommendedTotal / batchCount) : 0;
      const table = [
        {
          step: "begin",
          label: "Begin transaction",
          txCount: 1,
          chunkCount: 0,
          recommendedPerTxMicroStx: beginRecommended,
          recommendedTotalMicroStx: beginRecommended,
          walletDefaultPerTxMicroStx: beginWalletDefault,
          walletDefaultTotalMicroStx: beginWalletDefault,
          savingsMicroStx: Math.max(0, beginWalletDefault - beginRecommended),
          note: "Micro transaction only. This does not carry chunk payload bytes."
        },
        {
          step: "upload",
          label: `Upload batch transaction${batchCount === 1 ? "" : "s"}`,
          txCount: batchCount,
          chunkCount,
          recommendedPerTxMicroStx: batchCount > 0 ? averageRecommendedPerUploadTx : null,
          recommendedTotalMicroStx: uploadRecommendedTotal,
          walletDefaultPerTxMicroStx: batchCount > 0 ? MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx : null,
          walletDefaultTotalMicroStx: uploadWalletDefaultTotal,
          savingsMicroStx: Math.max(0, uploadWalletDefaultTotal - uploadRecommendedTotal),
          note: `Chunk-based estimate using ${chunkCount} chunk${chunkCount === 1 ? "" : "s"} across ${batchCount} batch${batchCount === 1 ? "" : "es"}.`
        },
        {
          step: "seal",
          label: "Seal transaction",
          txCount: 1,
          chunkCount: 0,
          recommendedPerTxMicroStx: sealRecommended,
          recommendedTotalMicroStx: sealRecommended,
          walletDefaultPerTxMicroStx: sealWalletDefault,
          walletDefaultTotalMicroStx: sealWalletDefault,
          savingsMicroStx: Math.max(0, sealWalletDefault - sealRecommended),
          note: "Finalization transaction. Keep extra wallet balance available for protocol fees and mint price."
        },
        {
          step: "total",
          label: "Estimated mining total",
          txCount: totalTxCount,
          chunkCount,
          recommendedPerTxMicroStx: totalTxCount > 0 ? Math.round(recommendedTotal / totalTxCount) : null,
          recommendedTotalMicroStx: recommendedTotal,
          walletDefaultPerTxMicroStx: totalTxCount > 0 ? MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx : null,
          walletDefaultTotalMicroStx: walletDefaultTotal,
          savingsMicroStx: Math.max(0, walletDefaultTotal - recommendedTotal),
          note: "Ballpark only. Wallet may require higher mining fees during congestion."
        }
      ];
      if (beginWalletDefault >= beginRecommended * 25) {
        warnings.push(
          `Wallet default begin fee (${formatMicroStx(
            beginWalletDefault
          )}) is much higher than the suggested micro begin fee (${formatMicroStx(
            beginRecommended
          )}).`
        );
      }
      if (remainderChunkCount === 1) {
        warnings.push(
          `Final upload batch has 1 chunk. Suggested upload mining fee is ~${formatMicroStx(
            estimateUploadBatchFeeMicroStx(1)
          )}, not ${formatMicroStx(MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx)}.`
        );
      }
      warnings.push(
        "If the wallet rejects a lower mining fee, increase it gradually and retry. Protocol fees and mint price are separate from these mining-fee estimates."
      );
      const lowBallparkMicroStx = Math.max(
        beginRecommended + sealRecommended,
        Math.round(recommendedTotal * MINING_FEE_ASSUMPTIONS.lowBallparkMultiplier)
      );
      const highBallparkMicroStx = Math.round(
        recommendedTotal * MINING_FEE_ASSUMPTIONS.highBallparkMultiplier
      );
      return {
        available: true,
        chunkCount,
        batchCount,
        assumptions: {
          beginTxMicroStx: MINING_FEE_ASSUMPTIONS.beginTxMicroStx,
          sealTxMicroStx: MINING_FEE_ASSUMPTIONS.sealTxMicroStx,
          walletDefaultTxMicroStx: MINING_FEE_ASSUMPTIONS.walletDefaultTxMicroStx,
          uploadBatchChunkSize: MINING_FEE_ASSUMPTIONS.uploadBatchChunkSize,
          perChunkUploadMicroStx: MINING_FEE_ASSUMPTIONS.perChunkUploadMicroStx
        },
        table,
        uploadBatches,
        totals: {
          recommendedMicroStx: recommendedTotal,
          walletDefaultMicroStx: walletDefaultTotal,
          lowBallparkMicroStx,
          highBallparkMicroStx,
          savingsMicroStx: Math.max(0, walletDefaultTotal - recommendedTotal)
        },
        warnings
      };
    }, "buildMiningFeeGuidance");
  }
});

// collections/[collectionId]/fee-guidance.ts
var PUBLIC_COLLECTION_CACHE_CONTROL, PRIVATE_NO_STORE_CACHE_CONTROL2, toNullableString5, toNonNegativeNumber, loadCollectionByIdentifier, onRequest9;
var init_fee_guidance2 = __esm({
  "collections/[collectionId]/fee-guidance.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_db();
    init_collections();
    init_fee_guidance();
    PUBLIC_COLLECTION_CACHE_CONTROL = "public, max-age=60, s-maxage=120, stale-while-revalidate=300";
    PRIVATE_NO_STORE_CACHE_CONTROL2 = "private, no-store, max-age=0";
    toNullableString5 = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }, "toNullableString");
    toNonNegativeNumber = /* @__PURE__ */ __name((value) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return 0;
      }
      return Math.floor(parsed);
    }, "toNonNegativeNumber");
    loadCollectionByIdentifier = /* @__PURE__ */ __name(async (env, identifier) => {
      const normalized = identifier.trim();
      if (!normalized) {
        return null;
      }
      const byId = await queryAll(env, "SELECT * FROM collections WHERE id = ?", [normalized]);
      const idMatch = (byId.results ?? [])[0];
      if (idMatch) {
        return idMatch;
      }
      const bySlug = await queryAll(env, "SELECT * FROM collections WHERE slug = ?", [normalized]);
      return (bySlug.results ?? [])[0] ?? null;
    }, "loadCollectionByIdentifier");
    onRequest9 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed" }, 405);
      }
      const collectionIdentifier = params?.collectionId?.trim() ?? "";
      if (!collectionIdentifier) {
        return badRequest("Collection id or slug is required.");
      }
      try {
        const collection = await loadCollectionByIdentifier(env, collectionIdentifier);
        if (!collection) {
          return notFound("Collection not found.");
        }
        const collectionId = toNullableString5(collection.id);
        if (!collectionId) {
          return serverError("Collection record is missing an id.");
        }
        const largestAssetResult = await queryAll(
          env,
          `SELECT asset_id, path, filename, total_bytes, total_chunks, state
       FROM assets
       WHERE collection_id = ?
         AND LOWER(COALESCE(state, 'draft')) != 'expired'
       ORDER BY COALESCE(total_bytes, 0) DESC, COALESCE(total_chunks, 0) DESC, created_at ASC
       LIMIT 1`,
          [collectionId]
        );
        const largestAsset = largestAssetResult.results?.[0] ?? null;
        const assetTotalsResult = await queryAll(
          env,
          `SELECT
         COUNT(*) as total,
         COALESCE(SUM(CASE WHEN LOWER(COALESCE(state, 'draft')) != 'expired' THEN 1 ELSE 0 END), 0) as active_total
       FROM assets
       WHERE collection_id = ?`,
          [collectionId]
        );
        const guidance = buildMiningFeeGuidance({
          largestChunkCount: largestAsset?.total_chunks ?? 0
        });
        const metadata = parseCollectionMetadata(collection.metadata);
        const shouldPublicCache = isCollectionPublished(collection.state) && isCollectionPublicVisible(metadata);
        return jsonResponse(
          {
            collectionId,
            collectionSlug: toNullableString5(collection.slug),
            largestAsset: largestAsset ? {
              assetId: toNullableString5(largestAsset.asset_id),
              path: toNullableString5(largestAsset.path),
              filename: toNullableString5(largestAsset.filename),
              state: toNullableString5(largestAsset.state),
              totalBytes: toNonNegativeNumber(largestAsset.total_bytes),
              totalChunks: toNonNegativeNumber(largestAsset.total_chunks)
            } : null,
            assetCounts: {
              total: toNonNegativeNumber(assetTotalsResult.results?.[0]?.total),
              active: toNonNegativeNumber(assetTotalsResult.results?.[0]?.active_total)
            },
            generatedAt: Date.now(),
            ...guidance
          },
          200,
          {
            "Cache-Control": shouldPublicCache ? PUBLIC_COLLECTION_CACHE_CONTROL : PRIVATE_NO_STORE_CACHE_CONTROL2
          }
        );
      } catch (error) {
        return serverError(
          error instanceof Error ? error.message : "Failed to build fee guidance"
        );
      }
    }, "onRequest");
  }
});

// collections/[collectionId]/oversight.ts
var toNumber, toNullableString6, parseMetadata2, toStateMap, resolveAssetsBucket3, listBucketStats, emptyBucketStats, mapStateCounts, onRequest10;
var init_oversight = __esm({
  "collections/[collectionId]/oversight.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_db();
    toNumber = /* @__PURE__ */ __name((value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }, "toNumber");
    toNullableString6 = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }, "toNullableString");
    parseMetadata2 = /* @__PURE__ */ __name((value) => {
      if (!value) {
        return null;
      }
      if (typeof value === "object") {
        return value;
      }
      if (typeof value !== "string") {
        return null;
      }
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }, "parseMetadata");
    toStateMap = /* @__PURE__ */ __name((rows) => rows.reduce((accumulator, row) => {
      const state = toNullableString6(row.state) ?? "unknown";
      const total = toNumber(row.total);
      accumulator[state] = total;
      return accumulator;
    }, {}), "toStateMap");
    resolveAssetsBucket3 = /* @__PURE__ */ __name((env) => {
      const candidates = [
        { key: "COLLECTION_ASSETS", bucket: env.COLLECTION_ASSETS },
        { key: "ASSETS", bucket: env.ASSETS },
        { key: "R2", bucket: env.R2 }
      ];
      const active = candidates.find(
        (candidate) => candidate.bucket && typeof candidate.bucket.list === "function"
      ) ?? null;
      return {
        binding: active?.key ?? null,
        bucket: active?.bucket ?? null
      };
    }, "resolveAssetsBucket");
    listBucketStats = /* @__PURE__ */ __name(async (bucket, prefix) => {
      const MAX_PAGES = 24;
      const MAX_SAMPLE_KEYS = 8;
      const keys = [];
      const sampleKeys = [];
      let objectCount = 0;
      let totalBytes = 0;
      let scannedPages = 0;
      let cursor;
      let truncated = false;
      do {
        scannedPages += 1;
        const page = await bucket.list(
          cursor ? { prefix, cursor } : { prefix }
        );
        for (const object of page.objects) {
          objectCount += 1;
          totalBytes += object.size ?? 0;
          keys.push(object.key);
          if (sampleKeys.length < MAX_SAMPLE_KEYS) {
            sampleKeys.push(object.key);
          }
        }
        cursor = page.cursor || void 0;
        truncated = Boolean(page.truncated);
      } while (truncated && cursor && scannedPages < MAX_PAGES);
      return {
        available: true,
        binding: null,
        prefix,
        objectCount,
        totalBytes,
        scannedAll: !truncated,
        sampleKeys,
        keys,
        error: null
      };
    }, "listBucketStats");
    emptyBucketStats = /* @__PURE__ */ __name((prefix) => ({
      available: false,
      binding: null,
      prefix,
      objectCount: 0,
      totalBytes: 0,
      scannedAll: true,
      sampleKeys: [],
      keys: [],
      error: null
    }), "emptyBucketStats");
    mapStateCounts = /* @__PURE__ */ __name((rows) => rows.map((row) => ({
      state: toNullableString6(row.state) ?? "unknown",
      total: toNumber(row.total)
    })), "mapStateCounts");
    onRequest10 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed" }, 405);
      }
      const collectionId = toNullableString6(params?.collectionId);
      if (!collectionId) {
        return badRequest("Collection id missing.");
      }
      try {
        const collectionResult = await queryAll(
          env,
          "SELECT * FROM collections WHERE id = ?",
          [collectionId]
        );
        const collection = collectionResult.results?.[0] ?? null;
        if (!collection) {
          return notFound("Collection not found.");
        }
        const metadata = parseMetadata2(collection.metadata);
        const deployTxId = toNullableString6(metadata?.deployTxId);
        const deployAt = toNullableString6(metadata?.deployedAt);
        const assetTotalsResult = await queryAll(
          env,
          `SELECT
         COUNT(*) as total,
         COALESCE(SUM(total_bytes), 0) as total_bytes,
         COALESCE(SUM(total_chunks), 0) as total_chunks,
         COALESCE(SUM(CASE WHEN state NOT IN ('expired', 'sold-out') THEN total_bytes ELSE 0 END), 0) as active_bytes,
         COALESCE(SUM(CASE WHEN state NOT IN ('expired', 'sold-out') THEN 1 ELSE 0 END), 0) as active_assets
       FROM assets
       WHERE collection_id = ?`,
          [collectionId]
        );
        const assetStateRows = await queryAll(
          env,
          "SELECT state, COUNT(*) as total FROM assets WHERE collection_id = ? GROUP BY state",
          [collectionId]
        );
        const assetKeysRows = await queryAll(
          env,
          `SELECT storage_key
       FROM assets
       WHERE collection_id = ?
         AND storage_key IS NOT NULL
         AND TRIM(storage_key) != ''`,
          [collectionId]
        );
        const reservationTotalsResult = await queryAll(
          env,
          "SELECT COUNT(*) as total FROM reservations WHERE collection_id = ?",
          [collectionId]
        );
        const reservationStateRows = await queryAll(
          env,
          "SELECT status as state, COUNT(*) as total FROM reservations WHERE collection_id = ? GROUP BY status",
          [collectionId]
        );
        const bucketPrefix = `${collectionId}/`;
        const { bucket, binding } = resolveAssetsBucket3(env);
        let bucketStats = emptyBucketStats(bucketPrefix);
        bucketStats.binding = binding;
        if (bucket) {
          try {
            const listed = await listBucketStats(bucket, bucketPrefix);
            bucketStats = {
              ...listed,
              binding
            };
          } catch (error) {
            bucketStats = {
              ...bucketStats,
              available: true,
              error: error instanceof Error ? error.message : "Bucket list failed"
            };
          }
        }
        const dbStorageKeys = new Set(
          (assetKeysRows.results ?? []).map((row) => toNullableString6(row.storage_key)).filter((value) => value !== null)
        );
        const bucketKeys = new Set(bucketStats.keys);
        const dbKeysMissingInBucket = Array.from(dbStorageKeys).filter(
          (key) => !bucketKeys.has(key)
        );
        const bucketKeysMissingInDb = Array.from(bucketKeys).filter(
          (key) => !dbStorageKeys.has(key)
        );
        return jsonResponse({
          collection: {
            id: collection.id,
            slug: collection.slug,
            artistAddress: collection.artist_address,
            contractAddress: collection.contract_address,
            displayName: collection.display_name,
            state: collection.state,
            createdAt: toNumber(collection.created_at),
            updatedAt: toNumber(collection.updated_at)
          },
          deploy: {
            txId: deployTxId,
            deployedAt: deployAt,
            contractName: toNullableString6(metadata?.contractName),
            coreContractId: toNullableString6(metadata?.coreContractId)
          },
          settingsPreview: {
            mintType: toNullableString6(metadata?.mintType),
            templateVersion: toNullableString6(metadata?.templateVersion),
            collection: metadata?.collection ?? null,
            hardcodedDefaults: metadata?.hardcodedDefaults ?? null
          },
          db: {
            assets: {
              total: toNumber(assetTotalsResult.results?.[0]?.total),
              active: toNumber(assetTotalsResult.results?.[0]?.active_assets),
              totalBytes: toNumber(assetTotalsResult.results?.[0]?.total_bytes),
              activeBytes: toNumber(assetTotalsResult.results?.[0]?.active_bytes),
              totalChunks: toNumber(assetTotalsResult.results?.[0]?.total_chunks),
              byState: toStateMap(assetStateRows.results ?? []),
              states: mapStateCounts(assetStateRows.results ?? [])
            },
            reservations: {
              total: toNumber(reservationTotalsResult.results?.[0]?.total),
              byState: toStateMap(reservationStateRows.results ?? []),
              states: mapStateCounts(reservationStateRows.results ?? [])
            },
            storageKeysTracked: dbStorageKeys.size
          },
          bucket: {
            available: bucketStats.available,
            binding: bucketStats.binding,
            prefix: bucketStats.prefix,
            objectCount: bucketStats.objectCount,
            totalBytes: bucketStats.totalBytes,
            scannedAll: bucketStats.scannedAll,
            sampleKeys: bucketStats.sampleKeys,
            error: bucketStats.error
          },
          consistency: {
            dbKeysMissingInBucket: dbKeysMissingInBucket.length,
            bucketKeysMissingInDb: bucketKeysMissingInDb.length,
            sampleDbKeysMissingInBucket: dbKeysMissingInBucket.slice(0, 5),
            sampleBucketKeysMissingInDb: bucketKeysMissingInDb.slice(0, 5)
          }
        });
      } catch (error) {
        return serverError(
          error instanceof Error ? error.message : "Failed to build collection oversight"
        );
      }
    }, "onRequest");
  }
});

// collections/[collectionId]/publish.ts
var parseMetadata3, onRequest11;
var init_publish = __esm({
  "collections/[collectionId]/publish.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_db();
    init_collection_deploy();
    parseMetadata3 = /* @__PURE__ */ __name((raw) => {
      if (!raw) {
        return null;
      }
      if (typeof raw === "object") {
        return raw;
      }
      if (typeof raw === "string") {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }
      return null;
    }, "parseMetadata");
    onRequest11 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const collectionId = params?.collectionId;
      if (!collectionId) {
        return badRequest("Collection id missing.");
      }
      if (request.method === "POST") {
        try {
          const payload = await request.json();
          const target = payload.state === "published" ? "published" : "draft";
          if (target === "published") {
            const readiness = await getCollectionDeployReadiness({
              env,
              collectionId
            });
            if (!readiness.ready || !readiness.collection) {
              return badRequest(readiness.reason);
            }
            const collection = readiness.collection;
            const metadata = readiness.metadata ?? parseMetadata3(collection.metadata);
            const mintType = typeof metadata?.mintType === "string" ? metadata.mintType : "standard";
            await run(
              env,
              "UPDATE assets SET state = ? WHERE collection_id = ? AND expires_at IS NOT NULL AND expires_at < ? AND state = ?",
              ["expired", collectionId, Date.now(), "draft"]
            );
            const assetsCountResult = await env.DB.prepare(
              "SELECT COUNT(*) as total FROM assets WHERE collection_id = ? AND state NOT IN (?, ?)"
            ).bind(collectionId, "expired", "sold-out").all();
            const activeAssets = Number(assetsCountResult.results?.[0]?.total ?? 0);
            if (mintType !== "pre-inscribed" && activeAssets <= 0) {
              return badRequest(
                "Upload at least one artwork file in Step 2 before publishing."
              );
            }
          }
          await run(
            env,
            "UPDATE collections SET state = ?, updated_at = ? WHERE id = ?",
            [target, Date.now(), collectionId]
          );
          const select = await env.DB.prepare("SELECT * FROM collections WHERE id = ?").bind(collectionId).all();
          const record = (select.results ?? [])[0];
          return jsonResponse(record);
        } catch (error) {
          return serverError(error instanceof Error ? error.message : "Failed to update state");
        }
      }
      return jsonResponse({ error: "Method not allowed" }, 405);
    }, "onRequest");
  }
});

// collections/[collectionId]/readiness.ts
var onRequest12;
var init_readiness = __esm({
  "collections/[collectionId]/readiness.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_collection_deploy();
    init_collections();
    onRequest12 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed" }, 405);
      }
      const collectionId = params?.collectionId?.trim();
      if (!collectionId) {
        return badRequest("Collection id missing.");
      }
      try {
        const readiness = await getCollectionDeployReadiness({
          env,
          collectionId
        });
        const collectionState = String(readiness.collection?.state ?? "draft").trim().toLowerCase();
        const contractAddress = String(readiness.collection?.contract_address ?? "").trim();
        const uploadsLocked = isCollectionUploadsLocked(collectionState);
        const lockReason = uploadsLocked ? `Uploads are locked while collection state is "${collectionState}".` : null;
        const predeployUploadsReady = canStageUploadsBeforeDeploy({
          contractAddress,
          state: collectionState
        });
        const uploadReady = !uploadsLocked && (readiness.ready || predeployUploadsReady);
        const uploadReason = uploadsLocked ? lockReason : readiness.ready ? readiness.reason : predeployUploadsReady ? "Draft staging enabled before deploy. Upload assets, then lock pricing before deploying." : readiness.reason;
        return jsonResponse({
          collectionId,
          ready: uploadReady,
          reason: uploadReason,
          deployReady: readiness.ready,
          predeployUploadsReady,
          deployTxId: readiness.deployTxId,
          deployTxStatus: readiness.deployTxStatus,
          network: readiness.network,
          collectionState,
          uploadsLocked,
          lockReason
        });
      } catch (error) {
        return serverError(
          error instanceof Error ? error.message : "Failed to evaluate readiness"
        );
      }
    }, "onRequest");
  }
});

// collections/[collectionId]/reserve.ts
var onRequest13;
var init_reserve = __esm({
  "collections/[collectionId]/reserve.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_db();
    onRequest13 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const collectionId = params?.collectionId;
      if (!collectionId) {
        return badRequest("Collection id missing.");
      }
      if (request.method === "GET") {
        try {
          const result = await queryAll(
            env,
            "SELECT * FROM reservations WHERE collection_id = ? ORDER BY created_at DESC",
            [collectionId]
          );
          return jsonResponse(result.results ?? []);
        } catch (error) {
          return serverError(
            error instanceof Error ? error.message : "Failed to load reservations"
          );
        }
      }
      if (request.method === "POST") {
        try {
          const payload = await request.json();
          if (!payload.assetId || !payload.buyerAddress || !payload.hashHex) {
            return badRequest("assetId, buyerAddress, and hashHex are required.");
          }
          const reservationId = crypto.randomUUID();
          const now = Date.now();
          const expiresAt = now + (payload.durationMs ? Number(payload.durationMs) : 12e5);
          await run(
            env,
            `INSERT INTO reservations (reservation_id, collection_id, asset_id, buyer_address, hash_hex, status, tx_id, expires_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [reservationId, collectionId, payload.assetId, payload.buyerAddress, payload.hashHex, "created", payload.txId ?? null, expiresAt, now, now]
          );
          const inserted = await queryAll(
            env,
            "SELECT * FROM reservations WHERE reservation_id = ?",
            [reservationId]
          );
          return jsonResponse(inserted.results?.[0]);
        } catch (error) {
          return serverError(error instanceof Error ? error.message : "Failed to create reservation");
        }
      }
      if (request.method === "PATCH") {
        try {
          const payload = await request.json();
          if (!payload.reservationId || !payload.action) {
            return badRequest("reservationId and action are required.");
          }
          let status = "created";
          if (payload.action === "confirm") {
            status = "confirmed";
          } else if (payload.action === "release") {
            status = "released";
          } else if (payload.action === "cancel") {
            status = "cancelled";
          }
          await run(
            env,
            "UPDATE reservations SET status = ?, tx_id = ?, updated_at = ? WHERE reservation_id = ?",
            [status, payload.txId ?? null, Date.now(), payload.reservationId]
          );
          const select = await queryAll(
            env,
            "SELECT * FROM reservations WHERE reservation_id = ?",
            [payload.reservationId]
          );
          return jsonResponse(select.results?.[0]);
        } catch (error) {
          return serverError(error instanceof Error ? error.message : "Failed to update reservation");
        }
      }
      return jsonResponse({ error: "Method not allowed" }, 405);
    }, "onRequest");
  }
});

// collections/[collectionId]/upload-url.ts
var resolveUploadBucket, availableBindingKeys, ensureReadiness, summarizeCapabilities, logDebug, onRequest14;
var init_upload_url = __esm({
  "collections/[collectionId]/upload-url.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_collection_deploy();
    init_collections();
    resolveUploadBucket = /* @__PURE__ */ __name((env) => {
      const candidates = [
        { key: "COLLECTION_ASSETS", bucket: env.COLLECTION_ASSETS },
        { key: "ASSETS", bucket: env.ASSETS },
        { key: "R2", bucket: env.R2 }
      ];
      const active = candidates.find(({ bucket }) => {
        if (!bucket || typeof bucket !== "object") {
          return false;
        }
        const candidate = bucket;
        return typeof candidate.getUploadUrl === "function" || typeof candidate.put === "function";
      });
      return {
        binding: active?.key ?? null,
        bucket: active?.bucket ?? null,
        capabilities: candidates.map(({ key, bucket }) => {
          const candidate = bucket;
          return {
            key,
            present: Boolean(bucket && typeof bucket === "object"),
            supportsSignedUrl: Boolean(
              candidate && typeof candidate.getUploadUrl === "function"
            ),
            supportsPut: Boolean(candidate && typeof candidate.put === "function"),
            supportsList: Boolean(
              candidate && typeof candidate.list === "function"
            )
          };
        })
      };
    }, "resolveUploadBucket");
    availableBindingKeys = /* @__PURE__ */ __name((env) => Object.keys(env).filter((key) => key.trim().length > 0).sort().join(", "), "availableBindingKeys");
    ensureReadiness = /* @__PURE__ */ __name(async (params) => {
      const readiness = await getCollectionDeployReadiness({
        env: params.env,
        collectionId: params.collectionId
      });
      const collectionState = String(readiness.collection?.state ?? "draft").trim().toLowerCase();
      const contractAddress = String(readiness.collection?.contract_address ?? "").trim();
      const predeployUploadsAllowed = canStageUploadsBeforeDeploy({
        contractAddress,
        state: collectionState
      });
      if (!readiness.ready && !predeployUploadsAllowed) {
        return { ok: false, reason: readiness.reason };
      }
      if (isCollectionUploadsLocked(collectionState)) {
        return {
          ok: false,
          reason: `Uploads are locked while collection state is "${collectionState}".`
        };
      }
      return { ok: true };
    }, "ensureReadiness");
    summarizeCapabilities = /* @__PURE__ */ __name((capabilities) => capabilities.map((item) => {
      const methods = [];
      if (item.supportsSignedUrl) {
        methods.push("getUploadUrl");
      }
      if (item.supportsPut) {
        methods.push("put");
      }
      if (item.supportsList) {
        methods.push("list");
      }
      const methodLabel = methods.length > 0 ? methods.join("|") : "none";
      return `${item.key}:present=${item.present ? "yes" : "no"}:methods=${methodLabel}`;
    }).join("; "), "summarizeCapabilities");
    logDebug = /* @__PURE__ */ __name((requestId, phase, details) => {
      console.log(`[collections/upload-url][${requestId}] ${phase}`, details);
    }, "logDebug");
    onRequest14 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const requestId = crypto.randomUUID();
      const collectionId = params?.collectionId?.trim();
      const startedAt = Date.now();
      const requestEnv = env;
      logDebug(requestId, "request.received", {
        method: request.method,
        collectionId: collectionId || null,
        path: new URL(request.url).pathname
      });
      if (!collectionId) {
        logDebug(requestId, "request.invalid", { reason: "collection id required" });
        return badRequest(`collection id required. Request ID: ${requestId}`);
      }
      try {
        const readiness = await ensureReadiness({
          env: requestEnv,
          collectionId
        });
        logDebug(requestId, "readiness.checked", {
          ready: readiness.ok,
          reason: readiness.ok ? null : readiness.reason
        });
        if (!readiness.ok) {
          return badRequest(`${readiness.reason} (Request ID: ${requestId})`);
        }
        const { bucket, binding, capabilities } = resolveUploadBucket(requestEnv);
        logDebug(requestId, "binding.resolved", {
          selectedBinding: binding,
          capabilities
        });
        if (!bucket) {
          return serverError(
            `Missing R2 binding. Configure bucket binding \`COLLECTION_ASSETS\` for this Pages environment (avoid reserved \`ASSETS\`). Available bindings: ${availableBindingKeys(requestEnv) || "none"}. Capability snapshot: ${summarizeCapabilities(capabilities)}. Request ID: ${requestId}`
          );
        }
        if (request.method === "PUT") {
          if (typeof bucket.put !== "function") {
            return serverError(
              `Upload endpoint is missing bucket.put support on binding \`${binding ?? "unknown"}\`. Capability snapshot: ${summarizeCapabilities(
                capabilities
              )}. Request ID: ${requestId}`
            );
          }
          const url = new URL(request.url);
          const key2 = url.searchParams.get("key")?.trim() ?? "";
          if (!key2) {
            return badRequest(`Missing upload key. Request ID: ${requestId}`);
          }
          if (!key2.startsWith(`${collectionId}/`)) {
            return badRequest(
              `Upload key does not match collection prefix. Request ID: ${requestId}`
            );
          }
          const contentType = request.headers.get("content-type")?.trim() ?? "";
          const body = await request.arrayBuffer();
          if (body.byteLength === 0) {
            return badRequest(`Upload body is empty. Request ID: ${requestId}`);
          }
          logDebug(requestId, "upload.put.start", {
            key: key2,
            contentType: contentType || null,
            byteLength: body.byteLength,
            binding
          });
          await bucket.put(key2, body, {
            httpMetadata: contentType ? { contentType } : void 0
          });
          const durationMs = Date.now() - startedAt;
          logDebug(requestId, "upload.put.complete", {
            key: key2,
            durationMs
          });
          return jsonResponse({
            ok: true,
            key: key2,
            mode: "direct",
            binding,
            requestId,
            durationMs
          });
        }
        if (request.method !== "GET") {
          return jsonResponse(
            { error: `Method not allowed. Request ID: ${requestId}` },
            405
          );
        }
        const key = `${collectionId}/${crypto.randomUUID()}`;
        if (typeof bucket.getUploadUrl === "function") {
          const uploadUrl = await bucket.getUploadUrl({
            method: "PUT",
            key,
            expires: 60 * 5
          });
          const durationMs = Date.now() - startedAt;
          logDebug(requestId, "upload.token.created", {
            mode: "signed",
            key,
            binding,
            durationMs
          });
          return jsonResponse({
            uploadUrl,
            key,
            mode: "signed",
            binding,
            requestId,
            durationMs,
            bindingCapabilities: capabilities
          });
        }
        if (typeof bucket.put === "function") {
          const uploadUrl = `/collections/${collectionId}/upload-url?key=${encodeURIComponent(
            key
          )}`;
          const durationMs = Date.now() - startedAt;
          logDebug(requestId, "upload.token.created", {
            mode: "direct",
            key,
            binding,
            durationMs
          });
          return jsonResponse({
            uploadUrl,
            key,
            mode: "direct",
            binding,
            requestId,
            durationMs,
            bindingCapabilities: capabilities
          });
        }
        return serverError(
          `R2 binding \`${binding ?? "unknown"}\` is present but does not support upload methods. Capability snapshot: ${summarizeCapabilities(
            capabilities
          )}. Request ID: ${requestId}`
        );
      } catch (error) {
        logDebug(requestId, "request.error", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack ?? null : null
        });
        return serverError(
          `${error instanceof Error ? error.message : "Failed to create upload URL"} (Request ID: ${requestId})`
        );
      }
    }, "onRequest");
  }
});

// bnsv2/[network]/[[path]].ts
var DEFAULT_TARGET_BASES, CORS_HEADERS3, toPathString2, getTargetBase, onRequest15;
var init_path3 = __esm({
  "bnsv2/[network]/[[path]].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    DEFAULT_TARGET_BASES = {
      mainnet: "https://api.bnsv2.com",
      testnet: "https://api.bnsv2.com/testnet"
    };
    CORS_HEADERS3 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Access-Control-Allow-Headers": "content-type"
    };
    toPathString2 = /* @__PURE__ */ __name((value) => Array.isArray(value) ? value.join("/") : value || "", "toPathString");
    getTargetBase = /* @__PURE__ */ __name((network, env) => {
      const normalized = String(network || "").trim().toLowerCase();
      if (normalized === "mainnet") {
        return env.BNSV2_API_BASE_MAINNET || env.VITE_BNSV2_API_BASE_MAINNET || env.VITE_BNSV2_API_BASE || DEFAULT_TARGET_BASES.mainnet;
      }
      if (normalized === "testnet") {
        return env.BNSV2_API_BASE_TESTNET || env.VITE_BNSV2_API_BASE_TESTNET || env.VITE_BNSV2_API_BASE || DEFAULT_TARGET_BASES.testnet;
      }
      return null;
    }, "getTargetBase");
    onRequest15 = /* @__PURE__ */ __name(async (context) => {
      const { request, params, env } = context;
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: CORS_HEADERS3
        });
      }
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", {
          status: 405,
          headers: CORS_HEADERS3
        });
      }
      const targetBase = getTargetBase(params.network || "", env);
      if (!targetBase) {
        return new Response("Unsupported network", {
          status: 400,
          headers: CORS_HEADERS3
        });
      }
      const url = new URL(request.url);
      const path = toPathString2(params.path);
      const targetUrl = `${targetBase.replace(/\/+$/, "")}/${path}${url.search}`;
      const headers = new Headers();
      headers.set("accept", request.headers.get("accept") ?? "application/json,*/*;q=0.8");
      headers.set(
        "user-agent",
        request.headers.get("user-agent") ?? "xtrata-bnsv2-proxy/1.0 (+https://xtrata.xyz)"
      );
      const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        redirect: "follow"
      });
      const responseHeaders = new Headers(response.headers);
      Object.entries(CORS_HEADERS3).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders
      });
    }, "onRequest");
  }
});

// lib/hiro-proxy.ts
var DEFAULT_TARGET_BASES2, SAFE_METHODS, HIRO_KEY_COOLDOWN_MS, CALL_READ_FUNCTION_TTLS_MS, CORS_HEADERS4, UPSTREAM_CONTEXT_HEADERS, inFlightSafeRequests, hiroKeyCooldownUntil, cachedProxyResponses, inFlightCacheableRequests, normalizeBase, getTargetBase2, toPathString3, isSafeMethod, serializeHeaders, buildSafeRequestKey, normalizePath, extractCallReadFunctionName, getProxyCachePolicy, getBodyFingerprint, buildCacheableRequestKey, cleanupExpiredProxyResponses, restoreCachedResponse, cacheProxyResponse, withCorsHeaders, cleanupExpiredHiroKeyCooldowns, buildKeyCandidates, noteRetryableHiroKeyFailure, forwardToHiro, proxyHiroRequest;
var init_hiro_proxy = __esm({
  "lib/hiro-proxy.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_hiro_keys();
    DEFAULT_TARGET_BASES2 = {
      mainnet: "https://api.mainnet.hiro.so",
      testnet: "https://api.testnet.hiro.so"
    };
    SAFE_METHODS = /* @__PURE__ */ new Set(["GET", "HEAD"]);
    HIRO_KEY_COOLDOWN_MS = 2 * 6e4;
    CALL_READ_FUNCTION_TTLS_MS = {
      "get-last-token-id": 8e3,
      "get-next-token-id": 8e3,
      "get-inscription-meta": 2e4,
      "get-owner": 2e4,
      "get-token-uri": 3e4,
      "get-svg-data-uri": 3e4,
      "get-svg": 3e4,
      "get-max-supply": 15e3
    };
    CORS_HEADERS4 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "content-type,x-hiro-api-key",
      "Access-Control-Expose-Headers": "x-xtrata-proxy-cache,x-xtrata-hiro-key-present,x-xtrata-hiro-key-count,x-ratelimit-limit,x-ratelimit-remaining,x-ratelimit-reset,cf-cache-status"
    };
    UPSTREAM_CONTEXT_HEADERS = [
      "content-security-policy",
      "content-security-policy-report-only",
      "signature",
      "signature-input"
    ];
    inFlightSafeRequests = /* @__PURE__ */ new Map();
    hiroKeyCooldownUntil = /* @__PURE__ */ new Map();
    cachedProxyResponses = /* @__PURE__ */ new Map();
    inFlightCacheableRequests = /* @__PURE__ */ new Map();
    normalizeBase = /* @__PURE__ */ __name((value) => value.trim().replace(/\/+$/, ""), "normalizeBase");
    getTargetBase2 = /* @__PURE__ */ __name((network, env) => {
      const normalized = String(network || "").trim().toLowerCase();
      if (!normalized) {
        return null;
      }
      if (normalized === "mainnet") {
        return env.ARCADE_HIRO_API_BASE_MAINNET || env.HIRO_API_BASE_MAINNET || env.VITE_STACKS_API_MAINNET || DEFAULT_TARGET_BASES2.mainnet;
      }
      if (normalized === "testnet") {
        return env.ARCADE_HIRO_API_BASE_TESTNET || env.HIRO_API_BASE_TESTNET || env.VITE_STACKS_API_TESTNET || DEFAULT_TARGET_BASES2.testnet;
      }
      return null;
    }, "getTargetBase");
    toPathString3 = /* @__PURE__ */ __name((value) => Array.isArray(value) ? value.join("/") : value || "", "toPathString");
    isSafeMethod = /* @__PURE__ */ __name((method) => SAFE_METHODS.has(String(method || "").toUpperCase()), "isSafeMethod");
    serializeHeaders = /* @__PURE__ */ __name((headers) => (() => {
      const entries = [];
      headers.forEach((value, name) => {
        entries.push([name.toLowerCase(), value.trim()]);
      });
      return entries;
    })().sort((left, right) => {
      if (left[0] < right[0]) {
        return -1;
      }
      if (left[0] > right[0]) {
        return 1;
      }
      if (left[1] < right[1]) {
        return -1;
      }
      if (left[1] > right[1]) {
        return 1;
      }
      return 0;
    }).map(([name, value]) => `${name}:${value}`).join("\n"), "serializeHeaders");
    buildSafeRequestKey = /* @__PURE__ */ __name((params) => `${params.method.toUpperCase()}|${params.targetUrl}|${serializeHeaders(
      params.headers
    )}`, "buildSafeRequestKey");
    normalizePath = /* @__PURE__ */ __name((value) => value.replace(/^\/+/, "").split("?")[0] ?? "", "normalizePath");
    extractCallReadFunctionName = /* @__PURE__ */ __name((path) => {
      const normalized = normalizePath(path);
      const match2 = /^v2\/contracts\/call-read\/[^/]+\/[^/]+\/([^/]+)$/i.exec(normalized);
      if (!match2) {
        return null;
      }
      try {
        return decodeURIComponent(match2[1]).toLowerCase();
      } catch {
        return match2[1].toLowerCase();
      }
    }, "extractCallReadFunctionName");
    getProxyCachePolicy = /* @__PURE__ */ __name((params) => {
      if (params.method !== "POST") {
        return null;
      }
      const functionName = extractCallReadFunctionName(params.path);
      if (!functionName) {
        return null;
      }
      const ttlMs = CALL_READ_FUNCTION_TTLS_MS[functionName];
      if (!ttlMs || ttlMs <= 0) {
        return null;
      }
      return { ttlMs };
    }, "getProxyCachePolicy");
    getBodyFingerprint = /* @__PURE__ */ __name((body) => {
      if (!body || body.byteLength === 0) {
        return "0:0";
      }
      const bytes2 = new Uint8Array(body);
      let hash2 = 2166136261;
      for (let i = 0; i < bytes2.length; i += 1) {
        hash2 ^= bytes2[i];
        hash2 = Math.imul(hash2, 16777619);
      }
      return `${bytes2.length}:${(hash2 >>> 0).toString(16)}`;
    }, "getBodyFingerprint");
    buildCacheableRequestKey = /* @__PURE__ */ __name((params) => `${params.network.toLowerCase()}|${params.method.toUpperCase()}|${params.targetUrl}|${getBodyFingerprint(
      params.body
    )}`, "buildCacheableRequestKey");
    cleanupExpiredProxyResponses = /* @__PURE__ */ __name((now = Date.now()) => {
      cachedProxyResponses.forEach((value, key) => {
        if (value.expiresAt <= now) {
          cachedProxyResponses.delete(key);
        }
      });
    }, "cleanupExpiredProxyResponses");
    restoreCachedResponse = /* @__PURE__ */ __name((cached) => {
      const headers = new Headers(cached.headers);
      headers.set("x-xtrata-proxy-cache", "hit");
      return new Response(cached.body.slice(), {
        status: cached.status,
        headers
      });
    }, "restoreCachedResponse");
    cacheProxyResponse = /* @__PURE__ */ __name(async (params) => {
      if (params.response.status !== 200 || params.ttlMs <= 0) {
        return;
      }
      const bytes2 = new Uint8Array(await params.response.clone().arrayBuffer());
      const headerPairs = [];
      params.response.headers.forEach((value, name) => {
        headerPairs.push([name, value]);
      });
      cachedProxyResponses.set(params.key, {
        status: params.response.status,
        headers: headerPairs,
        body: bytes2,
        expiresAt: Date.now() + params.ttlMs
      });
    }, "cacheProxyResponse");
    withCorsHeaders = /* @__PURE__ */ __name((response) => {
      const responseHeaders = new Headers(response.headers);
      UPSTREAM_CONTEXT_HEADERS.forEach((name) => {
        responseHeaders.delete(name);
      });
      Object.entries(CORS_HEADERS4).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders
      });
    }, "withCorsHeaders");
    cleanupExpiredHiroKeyCooldowns = /* @__PURE__ */ __name((now = Date.now()) => {
      hiroKeyCooldownUntil.forEach((until, key) => {
        if (until <= now) {
          hiroKeyCooldownUntil.delete(key);
        }
      });
    }, "cleanupExpiredHiroKeyCooldowns");
    buildKeyCandidates = /* @__PURE__ */ __name((apiKeys) => {
      if (apiKeys.length === 0) {
        return [null];
      }
      cleanupExpiredHiroKeyCooldowns();
      const now = Date.now();
      const available = apiKeys.filter((key) => {
        const cooldownUntil = hiroKeyCooldownUntil.get(key) ?? 0;
        return cooldownUntil <= now;
      });
      const cooling = apiKeys.filter((key) => {
        const cooldownUntil = hiroKeyCooldownUntil.get(key) ?? 0;
        return cooldownUntil > now;
      });
      return [...available, ...cooling];
    }, "buildKeyCandidates");
    noteRetryableHiroKeyFailure = /* @__PURE__ */ __name((apiKey, status) => {
      if (!apiKey) {
        return;
      }
      if (!shouldRetryWithNextHiroKey(status)) {
        return;
      }
      hiroKeyCooldownUntil.set(apiKey, Date.now() + HIRO_KEY_COOLDOWN_MS);
    }, "noteRetryableHiroKeyFailure");
    forwardToHiro = /* @__PURE__ */ __name(async (params) => {
      const { targetUrl, method, headers, body, env } = params;
      const apiKeys = getHiroApiKeys(env);
      const keyCandidates = buildKeyCandidates(apiKeys);
      let response = null;
      for (let i = 0; i < keyCandidates.length; i += 1) {
        const keyCandidate = keyCandidates[i];
        const attemptHeaders = new Headers(headers);
        applyHiroApiKey(attemptHeaders, keyCandidate);
        let attemptResponse;
        try {
          attemptResponse = await fetch(targetUrl, {
            method,
            headers: attemptHeaders,
            body,
            redirect: "follow"
          });
        } catch {
          if (i < keyCandidates.length - 1) {
            continue;
          }
          break;
        }
        const hasNextKey = i < keyCandidates.length - 1;
        if (hasNextKey && shouldRetryWithNextHiroKey(attemptResponse.status)) {
          noteRetryableHiroKeyFailure(keyCandidate, attemptResponse.status);
          continue;
        }
        response = attemptResponse;
        break;
      }
      if (!response) {
        return new Response("Hiro request failed.", { status: 502 });
      }
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("x-xtrata-hiro-key-present", apiKeys.length > 0 ? "1" : "0");
      responseHeaders.set("x-xtrata-hiro-key-count", String(apiKeys.length));
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      });
    }, "forwardToHiro");
    proxyHiroRequest = /* @__PURE__ */ __name(async (params) => {
      const { request, env } = params;
      const targetBaseRaw = getTargetBase2(params.network, env);
      if (!targetBaseRaw) {
        return new Response("Unknown network", { status: 404 });
      }
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: CORS_HEADERS4
        });
      }
      const url = new URL(request.url);
      const path = toPathString3(params.path);
      const targetBase = normalizeBase(targetBaseRaw);
      const targetUrl = `${targetBase}/${path}${url.search}`;
      const method = request.method.toUpperCase();
      const headers = new Headers(request.headers);
      headers.delete("host");
      headers.delete("origin");
      const body = isSafeMethod(method) ? void 0 : await request.arrayBuffer();
      const load = /* @__PURE__ */ __name(() => forwardToHiro({
        targetUrl,
        method,
        headers,
        body,
        env
      }), "load");
      if (isSafeMethod(method)) {
        const safeKey = buildSafeRequestKey({
          method,
          targetUrl,
          headers
        });
        let inFlight = inFlightSafeRequests.get(safeKey);
        if (!inFlight) {
          inFlight = load();
          inFlightSafeRequests.set(safeKey, inFlight);
          void inFlight.finally(() => {
            inFlightSafeRequests.delete(safeKey);
          });
        }
        const response2 = await inFlight;
        return withCorsHeaders(response2.clone());
      }
      const cachePolicy = getProxyCachePolicy({
        method,
        path
      });
      if (cachePolicy) {
        cleanupExpiredProxyResponses();
        const cacheKey = buildCacheableRequestKey({
          network: params.network,
          targetUrl,
          method,
          body
        });
        const cached = cachedProxyResponses.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
          return withCorsHeaders(restoreCachedResponse(cached));
        }
        let inFlight = inFlightCacheableRequests.get(cacheKey);
        if (!inFlight) {
          inFlight = (async () => {
            const response3 = await load();
            await cacheProxyResponse({
              key: cacheKey,
              response: response3,
              ttlMs: cachePolicy.ttlMs
            });
            return response3;
          })();
          inFlightCacheableRequests.set(cacheKey, inFlight);
          void inFlight.finally(() => {
            inFlightCacheableRequests.delete(cacheKey);
          });
        }
        const response2 = await inFlight;
        return withCorsHeaders(response2.clone());
      }
      const response = await load();
      return withCorsHeaders(response);
    }, "proxyHiroRequest");
  }
});

// hiro/[network]/[[path]].ts
var onRequest16;
var init_path4 = __esm({
  "hiro/[network]/[[path]].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_hiro_proxy();
    onRequest16 = /* @__PURE__ */ __name(async (context) => {
      const { request, params, env } = context;
      return proxyHiroRequest({
        request,
        env,
        network: params.network || "",
        path: params.path
      });
    }, "onRequest");
  }
});

// api/gallery-cache.ts
var CORS_HEADERS5, asRequiredString, asInteger, nullableString, json3, badRequest2, serverError2, onRequestOptions, onRequestGet, onRequestPost;
var init_gallery_cache = __esm({
  "api/gallery-cache.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_db();
    init_utils5();
    CORS_HEADERS5 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "content-type, x-api-key",
      "Cache-Control": "no-store"
    };
    asRequiredString = /* @__PURE__ */ __name((value) => typeof value === "string" && value.trim().length > 0 ? value.trim() : null, "asRequiredString");
    asInteger = /* @__PURE__ */ __name((value) => {
      const numeric = typeof value === "number" ? value : Number(value);
      return Number.isInteger(numeric) ? numeric : null;
    }, "asInteger");
    nullableString = /* @__PURE__ */ __name((value) => typeof value === "string" ? value : value == null ? null : String(value), "nullableString");
    json3 = /* @__PURE__ */ __name((payload, status = 200) => jsonResponse(payload, status, CORS_HEADERS5), "json");
    badRequest2 = /* @__PURE__ */ __name((message) => json3({ error: message }, 400), "badRequest");
    serverError2 = /* @__PURE__ */ __name((message) => json3({ error: message }, 500), "serverError");
    onRequestOptions = /* @__PURE__ */ __name(async () => new Response(null, { status: 204, headers: CORS_HEADERS5 }), "onRequestOptions");
    onRequestGet = /* @__PURE__ */ __name(async ({ request, env }) => {
      try {
        const url = new URL(request.url);
        const collection = asRequiredString(url.searchParams.get("collection"));
        const network = asRequiredString(url.searchParams.get("network"));
        const source = asRequiredString(url.searchParams.get("source"));
        const start = asInteger(url.searchParams.get("start"));
        const end = asInteger(url.searchParams.get("end"));
        if (!collection || !network || !source || start === null || end === null) {
          return badRequest2("Missing required query params: collection, network, source, start, end");
        }
        if (start > end) {
          return badRequest2("Invalid range: start must be less than or equal to end");
        }
        const result = await queryAll(
          env,
          `SELECT
        collection,
        network,
        source_contract,
        id,
        status,
        token_uri,
        resolved_metadata_uri,
        image_field,
        image_uri,
        resolved_image_uri,
        error,
        cached_at
      FROM gallery_cache
      WHERE collection = ?
        AND network = ?
        AND source_contract = ?
        AND id BETWEEN ? AND ?
      ORDER BY id ASC`,
          [collection, network, source, start, end]
        );
        return json3({ items: result.results ?? [] });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Gallery cache read failed";
        console.error("[api/gallery-cache] GET failed", { message });
        return serverError2(message);
      }
    }, "onRequestGet");
    onRequestPost = /* @__PURE__ */ __name(async ({ request, env }) => {
      try {
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== "object") {
          return badRequest2("Expected JSON body");
        }
        const payload = body;
        const collection = asRequiredString(payload.collection);
        const network = asRequiredString(payload.network);
        const sourceContract = asRequiredString(payload.source_contract);
        if (!collection || !network || !sourceContract || !Array.isArray(payload.items)) {
          return badRequest2(
            "Missing required body fields: collection, network, source_contract, items"
          );
        }
        const now = (/* @__PURE__ */ new Date()).toISOString();
        let saved = 0;
        for (const rawItem of payload.items) {
          if (!rawItem || typeof rawItem !== "object") {
            continue;
          }
          const item = rawItem;
          const id = asInteger(item.id);
          if (id === null) {
            continue;
          }
          await run(
            env,
            `INSERT INTO gallery_cache (
          collection,
          network,
          source_contract,
          id,
          status,
          token_uri,
          resolved_metadata_uri,
          image_field,
          image_uri,
          resolved_image_uri,
          error,
          cached_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(collection, network, source_contract, id) DO UPDATE SET
          status = excluded.status,
          token_uri = excluded.token_uri,
          resolved_metadata_uri = excluded.resolved_metadata_uri,
          image_field = excluded.image_field,
          image_uri = excluded.image_uri,
          resolved_image_uri = excluded.resolved_image_uri,
          error = excluded.error,
          cached_at = excluded.cached_at`,
            [
              collection,
              network,
              sourceContract,
              id,
              nullableString(item.status),
              nullableString(item.token_uri),
              nullableString(item.resolved_metadata_uri),
              nullableString(item.image_field),
              nullableString(item.image_uri),
              nullableString(item.resolved_image_uri),
              nullableString(item.error),
              nullableString(item.cached_at) ?? now
            ]
          );
          saved += 1;
        }
        return json3({ ok: true, saved }, 201);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Gallery cache write failed";
        console.error("[api/gallery-cache] POST failed", { message });
        return serverError2(message);
      }
    }, "onRequestPost");
  }
});

// arcade/attest-score.ts
var MAX_GAME_ID, MAX_PLAYER_NAME, MIN_PLAYER_NAME, DEFAULT_EXPIRY_BLOCKS, MAX_EXPIRY_BLOCKS, toAscii, parseMode, parseUnsigned, parseExpiryBlocks, normalizePrivateKey2, pickApiBase, hexToBytes3, bytesToHex4, toArrayBuffer, randomNonce, currentTipHeight, parseBody, onRequest17;
var init_attest_score = __esm({
  "arcade/attest-score.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_esm3();
    init_utils5();
    MAX_GAME_ID = 32;
    MAX_PLAYER_NAME = 12;
    MIN_PLAYER_NAME = 3;
    DEFAULT_EXPIRY_BLOCKS = 30;
    MAX_EXPIRY_BLOCKS = 500;
    toAscii = /* @__PURE__ */ __name((value, maxLen) => {
      const raw = String(value ?? "");
      let out = "";
      for (let i = 0; i < raw.length; i += 1) {
        const code = raw.charCodeAt(i);
        if (code >= 32 && code <= 126) {
          out += raw[i];
          if (out.length >= maxLen) break;
        }
      }
      return out;
    }, "toAscii");
    parseMode = /* @__PURE__ */ __name((value) => {
      if (value === 0 || value === "0" || value === "score") return 0n;
      if (value === 1 || value === "1" || value === "time") return 1n;
      throw new Error("mode must be 0/1 or score/time");
    }, "parseMode");
    parseUnsigned = /* @__PURE__ */ __name((value, label) => {
      const text = String(value ?? "").trim();
      if (!/^[0-9]+$/.test(text)) {
        throw new Error(`${label} must be an unsigned integer`);
      }
      const out = BigInt(text);
      if (out <= 0n) {
        throw new Error(`${label} must be greater than zero`);
      }
      return out;
    }, "parseUnsigned");
    parseExpiryBlocks = /* @__PURE__ */ __name((env) => {
      const raw = String(env.ARCADE_SCORE_ATTESTATION_EXPIRY_BLOCKS ?? DEFAULT_EXPIRY_BLOCKS);
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_EXPIRY_BLOCKS;
      return Math.min(MAX_EXPIRY_BLOCKS, Math.max(1, Math.floor(parsed)));
    }, "parseExpiryBlocks");
    normalizePrivateKey2 = /* @__PURE__ */ __name((value) => {
      const raw = String(value ?? "").trim();
      const key = raw.startsWith("0x") || raw.startsWith("0X") ? raw.slice(2) : raw;
      if (!/^[0-9a-fA-F]+$/.test(key)) {
        throw new Error("ARCADE_SCORE_ATTESTATION_PRIVATE_KEY must be hex");
      }
      if (key.length !== 64 && key.length !== 66) {
        throw new Error("ARCADE_SCORE_ATTESTATION_PRIVATE_KEY must be 32-byte hex (optionally +01 compressed flag)");
      }
      return key;
    }, "normalizePrivateKey");
    pickApiBase = /* @__PURE__ */ __name((network, env) => {
      const normalized = network.toLowerCase();
      if (normalized === "testnet" || normalized === "test") {
        return String(env.ARCADE_HIRO_API_BASE_TESTNET ?? "https://api.testnet.hiro.so");
      }
      if (normalized === "devnet" || normalized === "dev") {
        return String(env.ARCADE_HIRO_API_BASE_DEVNET ?? "http://localhost:3999");
      }
      return String(env.ARCADE_HIRO_API_BASE_MAINNET ?? "https://api.mainnet.hiro.so");
    }, "pickApiBase");
    hexToBytes3 = /* @__PURE__ */ __name((hex) => {
      const clean2 = hex.startsWith("0x") || hex.startsWith("0X") ? hex.slice(2) : hex;
      if (clean2.length % 2 !== 0 || /[^0-9a-fA-F]/.test(clean2)) {
        throw new Error("Invalid hex payload from serializeCV");
      }
      const out = new Uint8Array(clean2.length / 2);
      for (let i = 0; i < clean2.length; i += 2) {
        out[i / 2] = parseInt(clean2.slice(i, i + 2), 16);
      }
      return out;
    }, "hexToBytes");
    bytesToHex4 = /* @__PURE__ */ __name((bytes2) => {
      let out = "";
      for (let i = 0; i < bytes2.length; i += 1) {
        out += Number(bytes2[i]).toString(16).padStart(2, "0");
      }
      return out;
    }, "bytesToHex");
    toArrayBuffer = /* @__PURE__ */ __name((bytes2) => bytes2.buffer.slice(
      bytes2.byteOffset,
      bytes2.byteOffset + bytes2.byteLength
    ), "toArrayBuffer");
    randomNonce = /* @__PURE__ */ __name(() => {
      const bytes2 = new Uint8Array(16);
      crypto.getRandomValues(bytes2);
      let hex = "";
      for (const b of bytes2) {
        hex += b.toString(16).padStart(2, "0");
      }
      return BigInt(`0x${hex}`);
    }, "randomNonce");
    currentTipHeight = /* @__PURE__ */ __name(async (apiBase) => {
      const response = await fetch(`${apiBase.replace(/\/+$/, "")}/v2/info`);
      if (!response.ok) {
        throw new Error(`Hiro info request failed with HTTP ${response.status}`);
      }
      const body = await response.json();
      const tip = Number(body?.stacks_tip_height);
      if (!Number.isFinite(tip) || tip < 0) {
        throw new Error("Unable to resolve stacks_tip_height from Hiro response");
      }
      return BigInt(Math.floor(tip));
    }, "currentTipHeight");
    parseBody = /* @__PURE__ */ __name((body) => {
      const gameId = toAscii(body.gameId, MAX_GAME_ID);
      if (!gameId) {
        throw new Error("gameId is required");
      }
      const playerName = toAscii(body.playerName, MAX_PLAYER_NAME);
      if (playerName.length < MIN_PLAYER_NAME) {
        throw new Error(`playerName must be ${MIN_PLAYER_NAME}-${MAX_PLAYER_NAME} ascii chars`);
      }
      const player = String(body.player ?? "").trim();
      if (!player) {
        throw new Error("player (wallet principal) is required");
      }
      return {
        gameId,
        mode: parseMode(body.mode),
        score: parseUnsigned(body.score, "score"),
        playerName,
        player,
        network: String(body.network ?? "mainnet")
      };
    }, "parseBody");
    onRequest17 = /* @__PURE__ */ __name(async ({ request, env }) => {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed" }, 405);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return badRequest("Invalid JSON body");
      }
      try {
        const parsed = parseBody(body);
        const privateKey = normalizePrivateKey2(env.ARCADE_SCORE_ATTESTATION_PRIVATE_KEY);
        const expiryBlocks = parseExpiryBlocks(env);
        const apiBase = pickApiBase(parsed.network, env);
        const tipHeight = await currentTipHeight(apiBase);
        const expiresAt = tipHeight + BigInt(expiryBlocks);
        const nonce = randomNonce();
        const payload = tupleCV({
          "expires-at": uintCV(expiresAt),
          "game-id": stringAsciiCV(parsed.gameId),
          mode: uintCV(parsed.mode),
          name: stringAsciiCV(parsed.playerName),
          nonce: uintCV(nonce),
          player: principalCV(parsed.player),
          score: uintCV(parsed.score)
        });
        const serialized = serializeCV(payload);
        const payloadBytes = typeof serialized === "string" ? hexToBytes3(serialized) : serialized;
        const digest = await crypto.subtle.digest("SHA-256", toArrayBuffer(payloadBytes));
        const signature = signMessageHashRsv({
          messageHash: bytesToHex4(new Uint8Array(digest)),
          privateKey: createStacksPrivateKey(privateKey)
        }).data;
        return jsonResponse({
          nonce: nonce.toString(),
          expiresAt: expiresAt.toString(),
          signature
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create attestation";
        if (message.includes("required") || message.includes("must be") || message.includes("Invalid") || message.includes("mode must be")) {
          return badRequest(message);
        }
        console.error("[arcade/attest-score] error", {
          message,
          stack: error instanceof Error ? error.stack ?? null : null
        });
        return serverError(message);
      }
    }, "onRequest");
  }
});

// collections/health.ts
var countRows, inspectStorageBindings, onRequest18;
var init_health = __esm({
  "collections/health.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_db();
    init_cache();
    countRows = /* @__PURE__ */ __name(async (env, table) => {
      const result = await queryAll(
        env,
        `SELECT COUNT(*) AS total FROM ${table}`
      );
      return Number(result.results?.[0]?.total ?? 0);
    }, "countRows");
    inspectStorageBindings = /* @__PURE__ */ __name((env) => {
      const keys = [
        "COLLECTION_ASSETS",
        "ASSETS",
        "R2"
      ];
      const capabilities = keys.map((key) => {
        const candidate = env[key];
        return {
          key,
          present: Boolean(candidate && typeof candidate === "object"),
          supportsPut: Boolean(candidate && typeof candidate.put === "function"),
          supportsList: Boolean(candidate && typeof candidate.list === "function"),
          supportsSignedUrl: Boolean(
            candidate && typeof candidate.getUploadUrl === "function"
          )
        };
      });
      const selected = capabilities.find((entry) => entry.supportsSignedUrl || entry.supportsPut) ?? null;
      return {
        selectedBinding: selected?.key ?? null,
        capabilities,
        availableBindings: Object.keys(env).sort()
      };
    }, "inspectStorageBindings");
    onRequest18 = /* @__PURE__ */ __name(async ({ env }) => {
      const requestId = crypto.randomUUID();
      try {
        const collectionsCount = await countRows(env, "collections");
        const assetsCount = await countRows(env, "assets");
        const reservationsCount = await countRows(env, "reservations");
        const storage = inspectStorageBindings(env);
        const runtimeCache = await inspectRuntimeContentCacheUsage(env);
        console.log(`[collections/health][${requestId}] ok`, {
          collectionsCount,
          assetsCount,
          reservationsCount,
          selectedBinding: storage.selectedBinding,
          runtimeCacheBytes: runtimeCache.totalBytes,
          runtimeCacheWarningLevel: runtimeCache.warningLevel
        });
        return jsonResponse({
          collectionsCount,
          assetsCount,
          reservationsCount,
          timestamp: Date.now(),
          requestId,
          storage,
          runtimeCache
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Health check failed";
        console.error(`[collections/health][${requestId}] error`, {
          message,
          stack: error instanceof Error ? error.stack ?? null : null
        });
        return serverError(`${message} (Request ID: ${requestId})`);
      }
    }, "onRequest");
  }
});

// index/page.ts
var CORS3, json4, COLS, onRequest19;
var init_page = __esm({
  "index/page.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_db();
    CORS3 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "content-type"
    };
    json4 = /* @__PURE__ */ __name((body, status = 200) => new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json", ...CORS3 }
    }), "json");
    COLS = "contract, token_id, owner, creator, final_hash, mime, total_size, total_chunks, sealed, token_uri, migration_source";
    onRequest19 = /* @__PURE__ */ __name(async (context) => {
      const { request, env } = context;
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS3 });
      if (request.method !== "GET") return json4({ error: "Method not allowed." }, 405);
      try {
        const url = new URL(request.url);
        const primary = (url.searchParams.get("primary") || "").trim();
        if (!primary) return json4({ error: "Missing primary contract." }, 400);
        const lineage = (url.searchParams.get("lineage") || "").split(",").map((s) => s.trim()).filter((s) => s.length > 0 && s !== primary);
        const contracts = Array.from(/* @__PURE__ */ new Set([primary, ...lineage]));
        const idsParam = url.searchParams.get("ids");
        if (!idsParam) return json4({ error: "Missing ids." }, 400);
        const ids = Array.from(
          new Set(
            idsParam.split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0)
          )
        ).sort((a, b) => a - b).slice(0, 200);
        if (ids.length === 0) return json4({ error: "No valid ids." }, 400);
        const cacheKeyUrl = new URL(url.origin + url.pathname);
        cacheKeyUrl.searchParams.set("primary", primary);
        cacheKeyUrl.searchParams.set("lineage", lineage.join(","));
        cacheKeyUrl.searchParams.set("ids", ids.join(","));
        const edgeCache = globalThis.caches?.default ?? null;
        const cacheRequest = new Request(cacheKeyUrl.toString(), { method: "GET" });
        if (edgeCache) {
          const hit = await edgeCache.match(cacheRequest);
          if (hit) return hit;
        }
        const result = await queryAll(
          env,
          `SELECT ${COLS} FROM inscription_index
        WHERE contract IN (${contracts.map(() => "?").join(",")})
          AND token_id IN (${ids.map(() => "?").join(",")})`,
          [...contracts, ...ids]
        );
        const dbRows = result.results ?? [];
        const byContract = /* @__PURE__ */ new Map();
        for (const row of dbRows) {
          let perContract = byContract.get(row.contract);
          if (!perContract) {
            perContract = /* @__PURE__ */ new Map();
            byContract.set(row.contract, perContract);
          }
          perContract.set(row.token_id, row);
        }
        const tokens = [];
        for (const id of ids) {
          for (const contractId of contracts) {
            const row = byContract.get(contractId)?.get(id);
            if (row) {
              tokens.push({
                id: row.token_id,
                sourceContract: contractId,
                owner: row.owner,
                creator: row.creator,
                finalHash: row.final_hash,
                mime: row.mime,
                totalSize: row.total_size,
                totalChunks: row.total_chunks,
                sealed: row.sealed === 1,
                tokenUri: row.token_uri ?? null,
                migrationSource: row.migration_source
              });
              break;
            }
          }
        }
        if (context.waitUntil) {
          const stateRes = await queryAll(
            env,
            `SELECT contract, minted_count, synced_count, updated_at
           FROM inscription_index_state
          WHERE contract IN (${contracts.map(() => "?").join(",")})`,
            contracts
          );
          const stateByContract = /* @__PURE__ */ new Map();
          for (const r of stateRes.results ?? []) {
            stateByContract.set(r.contract, {
              minted: r.minted_count ?? 0,
              synced: r.synced_count ?? 0,
              updatedAt: r.updated_at ?? 0
            });
          }
          const now = Date.now();
          for (const contractId of contracts) {
            const st = stateByContract.get(contractId);
            const behind = !st || st.synced < st.minted;
            const stale = !st || now - st.updatedAt > 6e4;
            if (behind || stale) {
              const syncUrl = `${url.origin}/index/${encodeURIComponent(contractId)}`;
              context.waitUntil(fetch(syncUrl, { method: "POST" }).then(() => void 0).catch(() => void 0));
            }
          }
        }
        const shouldCacheResponse = tokens.length > 0;
        const response = new Response(JSON.stringify({ primary, lineage, tokens }), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "Cache-Control": shouldCacheResponse ? "public, max-age=15, s-maxage=60, stale-while-revalidate=300" : "no-store",
            ...CORS3
          }
        });
        if (shouldCacheResponse && edgeCache && context.waitUntil) {
          context.waitUntil(edgeCache.put(cacheRequest, response.clone()));
        }
        return response;
      } catch (error) {
        return json4({ error: error instanceof Error ? error.message : String(error) }, 500);
      }
    }, "onRequest");
  }
});

// manage/allowlist.ts
var asTrimmedString, onRequest20;
var init_allowlist = __esm({
  "manage/allowlist.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    asTrimmedString = /* @__PURE__ */ __name((value) => typeof value === "string" ? value.trim() : "", "asTrimmedString");
    onRequest20 = /* @__PURE__ */ __name(async ({ request, env }) => {
      if (request.method !== "GET") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json" }
        });
      }
      const runtimeEnv = env;
      const candidates = [
        {
          key: "ARTIST_ALLOWLIST",
          value: asTrimmedString(runtimeEnv.ARTIST_ALLOWLIST)
        },
        {
          key: "VITE_ARTIST_ALLOWLIST",
          value: asTrimmedString(runtimeEnv.VITE_ARTIST_ALLOWLIST)
        },
        {
          key: "MANAGE_ALLOWLIST",
          value: asTrimmedString(runtimeEnv.MANAGE_ALLOWLIST)
        }
      ];
      const active = candidates.find((candidate) => candidate.value.length > 0) ?? null;
      return new Response(
        JSON.stringify({
          source: active?.key ?? null,
          raw: active?.value ?? "",
          hasValue: !!active
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
    }, "onRequest");
  }
});

// lib/prices.ts
var PUBLIC_PRICE_CACHE_CONTROL, toFinitePositiveNumber, toFinitePositiveNumberish, toUnixMilliseconds, toEntryRecord, toCoinbaseEntryRecord, buildPriceEntry, parseCoinGeckoSpotPayload, buildCoinbasePriceEntry, parseCoinbaseSpotPayload, hasSpotPriceData;
var init_prices = __esm({
  "lib/prices.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    PUBLIC_PRICE_CACHE_CONTROL = "public, max-age=30, s-maxage=60, stale-while-revalidate=300";
    toFinitePositiveNumber = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
        return null;
      }
      return value;
    }, "toFinitePositiveNumber");
    toFinitePositiveNumberish = /* @__PURE__ */ __name((value) => {
      const normalized = typeof value === "string" ? Number.parseFloat(value) : value;
      if (typeof normalized !== "number" || !Number.isFinite(normalized) || normalized <= 0) {
        return null;
      }
      return normalized;
    }, "toFinitePositiveNumberish");
    toUnixMilliseconds = /* @__PURE__ */ __name((value, fallbackMs) => {
      if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
        return fallbackMs;
      }
      return Math.floor(value * 1e3);
    }, "toUnixMilliseconds");
    toEntryRecord = /* @__PURE__ */ __name((value) => {
      if (!value || typeof value !== "object") {
        return null;
      }
      return value;
    }, "toEntryRecord");
    toCoinbaseEntryRecord = /* @__PURE__ */ __name((value) => {
      if (!value || typeof value !== "object") {
        return null;
      }
      return value;
    }, "toCoinbaseEntryRecord");
    buildPriceEntry = /* @__PURE__ */ __name((value, sourceId, fallbackMs, isFallback = false) => {
      const entry = toEntryRecord(value);
      if (!entry) {
        return null;
      }
      const usd = toFinitePositiveNumber(entry.usd);
      if (usd === null) {
        return null;
      }
      return {
        usd,
        updatedAt: toUnixMilliseconds(entry.last_updated_at, fallbackMs),
        sourceId,
        isFallback
      };
    }, "buildPriceEntry");
    parseCoinGeckoSpotPayload = /* @__PURE__ */ __name((payload, generatedAt = Date.now()) => {
      const data = payload && typeof payload === "object" ? payload : {};
      const stx = buildPriceEntry(data["stacks"], "stacks", generatedAt);
      const sbtcDirect = buildPriceEntry(data["sbtc"], "sbtc", generatedAt);
      const bitcoinFallback = buildPriceEntry(
        data["bitcoin"],
        "bitcoin",
        generatedAt,
        true
      );
      const usdc = buildPriceEntry(data["usd-coin"], "usd-coin", generatedAt);
      return {
        provider: "coingecko",
        generatedAt,
        prices: {
          stx,
          sbtc: sbtcDirect ?? bitcoinFallback,
          usdc
        }
      };
    }, "parseCoinGeckoSpotPayload");
    buildCoinbasePriceEntry = /* @__PURE__ */ __name((value, sourceId, fallbackMs, isFallback = false) => {
      const entry = toCoinbaseEntryRecord(value);
      if (!entry?.data || typeof entry.data !== "object") {
        return null;
      }
      const usd = toFinitePositiveNumberish(entry.data.amount);
      if (usd === null) {
        return null;
      }
      const currency = typeof entry.data.currency === "string" ? entry.data.currency.trim() : "";
      if (currency && currency.toUpperCase() !== "USD") {
        return null;
      }
      return {
        usd,
        updatedAt: fallbackMs,
        sourceId,
        isFallback
      };
    }, "buildCoinbasePriceEntry");
    parseCoinbaseSpotPayload = /* @__PURE__ */ __name((payload, generatedAt = Date.now()) => {
      const stx = buildCoinbasePriceEntry(payload.stx, "STX-USD", generatedAt);
      const bitcoin = buildCoinbasePriceEntry(
        payload.bitcoin,
        "BTC-USD",
        generatedAt
      );
      const usdc = buildCoinbasePriceEntry(payload.usdc, "USDC-USD", generatedAt);
      return {
        provider: "coinbase",
        generatedAt,
        prices: {
          stx,
          sbtc: bitcoin ? {
            ...bitcoin,
            isFallback: true
          } : null,
          usdc
        }
      };
    }, "parseCoinbaseSpotPayload");
    hasSpotPriceData = /* @__PURE__ */ __name((snapshot) => Object.values(snapshot.prices).some(
      (entry) => entry !== null && Number.isFinite(entry.usd) && entry.usd > 0
    ), "hasSpotPriceData");
  }
});

// prices/spot.ts
var COINGECKO_PRICE_SOURCE_URL, COINBASE_PRICE_SOURCE_URLS, UPSTREAM_TIMEOUT_MS, ERROR_CACHE_CONTROL, fetchWithTimeout, parseUpstreamJson, fetchCoinGeckoSnapshot, fetchCoinbaseSnapshot, onRequest21;
var init_spot = __esm({
  "prices/spot.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_prices();
    init_utils5();
    COINGECKO_PRICE_SOURCE_URL = "https://api.coingecko.com/api/v3/simple/price?ids=stacks,sbtc,usd-coin,bitcoin&vs_currencies=usd&include_last_updated_at=true";
    COINBASE_PRICE_SOURCE_URLS = {
      stx: "https://api.coinbase.com/v2/prices/STX-USD/spot",
      bitcoin: "https://api.coinbase.com/v2/prices/BTC-USD/spot",
      usdc: "https://api.coinbase.com/v2/prices/USDC-USD/spot"
    };
    UPSTREAM_TIMEOUT_MS = 3e3;
    ERROR_CACHE_CONTROL = "private, no-store, max-age=0";
    fetchWithTimeout = /* @__PURE__ */ __name(async (url, timeoutMs) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);
      try {
        return await fetch(url, {
          headers: {
            Accept: "application/json"
          },
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }
    }, "fetchWithTimeout");
    parseUpstreamJson = /* @__PURE__ */ __name(async (response) => {
      const text = await response.text();
      if (!text.trim()) {
        return null;
      }
      try {
        return JSON.parse(text);
      } catch {
        throw new Error("Price source returned invalid JSON.");
      }
    }, "parseUpstreamJson");
    fetchCoinGeckoSnapshot = /* @__PURE__ */ __name(async () => {
      const upstreamResponse = await fetchWithTimeout(
        COINGECKO_PRICE_SOURCE_URL,
        UPSTREAM_TIMEOUT_MS
      );
      if (!upstreamResponse.ok) {
        throw new Error(`CoinGecko unavailable (${upstreamResponse.status}).`);
      }
      const payload = await parseUpstreamJson(upstreamResponse);
      const snapshot = parseCoinGeckoSpotPayload(payload, Date.now());
      if (!hasSpotPriceData(snapshot)) {
        throw new Error("CoinGecko returned no usable price data.");
      }
      return snapshot;
    }, "fetchCoinGeckoSnapshot");
    fetchCoinbaseSnapshot = /* @__PURE__ */ __name(async () => {
      const responses = await Promise.allSettled([
        fetchWithTimeout(COINBASE_PRICE_SOURCE_URLS.stx, UPSTREAM_TIMEOUT_MS),
        fetchWithTimeout(COINBASE_PRICE_SOURCE_URLS.bitcoin, UPSTREAM_TIMEOUT_MS),
        fetchWithTimeout(COINBASE_PRICE_SOURCE_URLS.usdc, UPSTREAM_TIMEOUT_MS)
      ]);
      const generatedAt = Date.now();
      const [stxPayload, bitcoinPayload, usdcPayload] = await Promise.all([
        responses[0].status === "fulfilled" && responses[0].value.ok ? parseUpstreamJson(responses[0].value) : Promise.resolve(null),
        responses[1].status === "fulfilled" && responses[1].value.ok ? parseUpstreamJson(responses[1].value) : Promise.resolve(null),
        responses[2].status === "fulfilled" && responses[2].value.ok ? parseUpstreamJson(responses[2].value) : Promise.resolve(null)
      ]);
      const snapshot = parseCoinbaseSpotPayload(
        {
          stx: stxPayload,
          bitcoin: bitcoinPayload,
          usdc: usdcPayload
        },
        generatedAt
      );
      if (!hasSpotPriceData(snapshot)) {
        throw new Error("Coinbase returned no usable price data.");
      }
      return snapshot;
    }, "fetchCoinbaseSnapshot");
    onRequest21 = /* @__PURE__ */ __name(async ({ request }) => {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed." }, 405);
      }
      try {
        try {
          const snapshot = await fetchCoinGeckoSnapshot();
          return jsonResponse(snapshot, 200, {
            "Cache-Control": PUBLIC_PRICE_CACHE_CONTROL
          });
        } catch (coinGeckoError) {
          const snapshot = await fetchCoinbaseSnapshot();
          return jsonResponse(snapshot, 200, {
            "Cache-Control": PUBLIC_PRICE_CACHE_CONTROL,
            "X-Price-Source-Fallback": coinGeckoError instanceof Error ? coinGeckoError.message : "coinbase"
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Price refresh failed.";
        return jsonResponse(
          {
            error: message
          },
          502,
          {
            "Cache-Control": ERROR_CACHE_CONTROL
          }
        );
      }
    }, "onRequest");
  }
});

// runtime/cache-purge.ts
var CORS_HEADERS6, jsonResponse2, getConfiguredToken, getBearerToken, getAuthorizationError, onRequest22;
var init_cache_purge = __esm({
  "runtime/cache-purge.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_cache();
    init_lib();
    CORS_HEADERS6 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Cache-Control": "no-store"
    };
    jsonResponse2 = /* @__PURE__ */ __name((status, body) => new Response(JSON.stringify(body), {
      status,
      headers: {
        ...CORS_HEADERS6,
        "Content-Type": "application/json; charset=utf-8"
      }
    }), "jsonResponse");
    getConfiguredToken = /* @__PURE__ */ __name((env) => {
      const value = env.RUNTIME_CACHE_ADMIN_TOKEN;
      return typeof value === "string" && value.trim() ? value.trim() : null;
    }, "getConfiguredToken");
    getBearerToken = /* @__PURE__ */ __name((request) => {
      const value = request.headers.get("Authorization")?.trim() ?? "";
      const prefix = "Bearer ";
      return value.startsWith(prefix) ? value.slice(prefix.length).trim() : null;
    }, "getBearerToken");
    getAuthorizationError = /* @__PURE__ */ __name((request, env) => {
      const configuredToken = getConfiguredToken(env);
      if (!configuredToken) {
        return jsonResponse2(503, {
          error: "Runtime cache purge is not configured."
        });
      }
      if (getBearerToken(request) !== configuredToken) {
        return jsonResponse2(401, {
          error: "Unauthorized."
        });
      }
      return null;
    }, "getAuthorizationError");
    onRequest22 = /* @__PURE__ */ __name(async ({ request, env }) => {
      const runtimeEnv = env;
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: CORS_HEADERS6
        });
      }
      if (request.method !== "POST") {
        return jsonResponse2(405, {
          error: "Method not allowed."
        });
      }
      const authorizationError = getAuthorizationError(request, runtimeEnv);
      if (authorizationError) {
        return authorizationError;
      }
      const url = new URL(request.url);
      const network = parseRuntimeNetwork(url.searchParams.get("network"));
      const contract = parseRuntimeContractRef(url.searchParams.get("contractId"));
      const fallbackContract = parseRuntimeContractRef(url.searchParams.get("fallbackContractId"));
      const tokenId = parseRuntimeTokenId(url.searchParams.get("tokenId"));
      if (!contract) {
        return jsonResponse2(400, {
          error: "Invalid contractId parameter."
        });
      }
      if (tokenId === null || tokenId < 0n) {
        return jsonResponse2(400, {
          error: "Invalid tokenId parameter."
        });
      }
      const apiBases = getRuntimeApiBases(network, runtimeEnv);
      const upstreamTracker = createRuntimeUpstreamRequestTracker();
      try {
        const resolvedMeta = await resolveRuntimeMeta({
          env: runtimeEnv,
          apiBases,
          tokenId,
          primaryContract: contract,
          fallbackContract,
          upstreamTracker
        });
        const cacheKey = buildRuntimeContentCacheKey({
          network,
          contract: resolvedMeta.contract,
          tokenId,
          finalHash: resolvedMeta.meta.finalHash
        });
        const deleted = await deleteRuntimeContentCache(runtimeEnv, cacheKey);
        return jsonResponse2(200, {
          ok: true,
          network,
          contractId: `${resolvedMeta.contract.address}.${resolvedMeta.contract.contractName}`,
          tokenId: tokenId.toString(),
          finalHash: runtimeBytesToHex(resolvedMeta.meta.finalHash),
          key: deleted.key,
          r2Deleted: deleted.r2Deleted,
          edgeDeleted: deleted.edgeDeleted,
          upstreamRequests: upstreamTracker.attempts
        });
      } catch (error) {
        return jsonResponse2(500, {
          error: "Runtime cache purge failed.",
          detail: error instanceof Error ? error.message : String(error),
          upstreamRequests: upstreamTracker.attempts
        });
      }
    }, "onRequest");
  }
});

// collections/[collectionId].ts
var PUBLIC_COLLECTION_CACHE_CONTROL2, PRIVATE_NO_STORE_CACHE_CONTROL3, parseMetadata4, mapRow, toNullableString7, loadCollectionByIdentifier2, resolveAssetsBucket4, chunkValues, deleteBucketPrefix, onRequest23;
var init_collectionId = __esm({
  "collections/[collectionId].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_db();
    init_collection_deploy();
    init_collections();
    PUBLIC_COLLECTION_CACHE_CONTROL2 = "public, max-age=60, s-maxage=120, stale-while-revalidate=300";
    PRIVATE_NO_STORE_CACHE_CONTROL3 = "private, no-store, max-age=0";
    parseMetadata4 = /* @__PURE__ */ __name((value) => {
      if (!value) {
        return null;
      }
      try {
        return JSON.parse(String(value));
      } catch {
        return null;
      }
    }, "parseMetadata");
    mapRow = /* @__PURE__ */ __name((row) => ({
      ...row,
      metadata: parseMetadata4(row.metadata)
    }), "mapRow");
    toNullableString7 = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }, "toNullableString");
    loadCollectionByIdentifier2 = /* @__PURE__ */ __name(async (params) => {
      const normalized = params.identifier.trim();
      if (!normalized) {
        return null;
      }
      const byId = await queryAll(params.env, "SELECT * FROM collections WHERE id = ?", [
        normalized
      ]);
      const idMatch = (byId.results ?? [])[0];
      if (idMatch) {
        return idMatch;
      }
      const bySlug = await queryAll(
        params.env,
        "SELECT * FROM collections WHERE slug = ?",
        [normalized]
      );
      return (bySlug.results ?? [])[0] ?? null;
    }, "loadCollectionByIdentifier");
    resolveAssetsBucket4 = /* @__PURE__ */ __name((env) => env.COLLECTION_ASSETS ?? env.ASSETS ?? env.R2 ?? null, "resolveAssetsBucket");
    chunkValues = /* @__PURE__ */ __name((values, size) => {
      const chunks = [];
      for (let index = 0; index < values.length; index += size) {
        chunks.push(values.slice(index, index + size));
      }
      return chunks;
    }, "chunkValues");
    deleteBucketPrefix = /* @__PURE__ */ __name(async (bucket, prefix) => {
      let removed = 0;
      let cursor = void 0;
      while (true) {
        const listed = await bucket.list({
          prefix,
          cursor
        });
        const keys = listed.objects.map((object) => object.key).filter(Boolean);
        if (keys.length > 0) {
          await bucket.delete(keys);
          removed += keys.length;
        }
        if (!listed.truncated) {
          break;
        }
        cursor = listed.cursor;
      }
      return removed;
    }, "deleteBucketPrefix");
    onRequest23 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const collectionIdentifier = params?.collectionId?.trim() ?? "";
      if (!collectionIdentifier) {
        return badRequest("Collection id or slug is required.");
      }
      if (request.method === "GET") {
        try {
          const record = await loadCollectionByIdentifier2({
            env,
            identifier: collectionIdentifier
          });
          if (!record) {
            return notFound("Collection not found.");
          }
          const mappedRecord = mapRow(record);
          const shouldPublicCache = isCollectionPublished(mappedRecord.state) && isCollectionPublicVisible(mappedRecord.metadata);
          return jsonResponse(mappedRecord, 200, {
            "Cache-Control": shouldPublicCache ? PUBLIC_COLLECTION_CACHE_CONTROL2 : PRIVATE_NO_STORE_CACHE_CONTROL3
          });
        } catch (error) {
          return serverError(
            error instanceof Error ? error.message : "failed to load collection"
          );
        }
      }
      if (request.method === "PATCH") {
        try {
          const existingRecord = await loadCollectionByIdentifier2({
            env,
            identifier: collectionIdentifier
          });
          if (!existingRecord) {
            return notFound("Collection not found.");
          }
          const resolvedCollectionId = String(existingRecord.id ?? "").trim();
          if (!resolvedCollectionId) {
            return serverError("Collection record is missing an id.");
          }
          const currentState = String(existingRecord.state ?? "draft").trim().toLowerCase();
          const payload = await request.json();
          const draftSettingsLocked = currentState === "published" || currentState === "archived";
          if (draftSettingsLocked && (typeof payload.displayName === "string" || typeof payload.artistAddress === "string" || typeof payload.contractAddress === "string")) {
            return badRequest(
              `Draft settings are locked while collection state is "${currentState}".`
            );
          }
          const updates = [];
          const binds = [];
          if (typeof payload.displayName === "string") {
            updates.push("display_name = ?");
            binds.push(payload.displayName.trim());
          }
          if (typeof payload.artistAddress === "string") {
            updates.push("artist_address = ?");
            binds.push(payload.artistAddress.trim());
          }
          if (typeof payload.contractAddress === "string") {
            updates.push("contract_address = ?");
            binds.push(payload.contractAddress.trim());
          }
          if (Object.prototype.hasOwnProperty.call(payload, "metadata")) {
            const mergedMetadata = canonicalizeManageCollectionMetadata(
              mergeCollectionMetadata(existingRecord.metadata, payload.metadata)
            );
            updates.push("metadata = ?");
            binds.push(JSON.stringify(mergedMetadata));
          }
          if (typeof payload.state === "string") {
            updates.push("state = ?");
            binds.push(payload.state);
          }
          if (updates.length === 0) {
            return badRequest("No updatable fields provided.");
          }
          binds.push(Date.now());
          binds.push(resolvedCollectionId);
          const query = `UPDATE collections SET ${updates.join(", ")}, updated_at = ? WHERE id = ?`;
          await run(env, query, binds);
          const updated = await queryAll(
            env,
            "SELECT * FROM collections WHERE id = ?",
            [resolvedCollectionId]
          );
          const record = updated.results?.[0];
          if (!record) {
            return notFound("Collection not found after update.");
          }
          return jsonResponse(mapRow(record));
        } catch (error) {
          return serverError(error instanceof Error ? error.message : "failed to update collection");
        }
      }
      if (request.method === "DELETE") {
        try {
          const record = await loadCollectionByIdentifier2({
            env,
            identifier: collectionIdentifier
          });
          if (!record) {
            return notFound("Collection not found.");
          }
          const resolvedCollectionId = String(record.id ?? "").trim();
          if (!resolvedCollectionId) {
            return serverError("Collection record is missing an id.");
          }
          const state = String(record.state ?? "").trim().toLowerCase();
          if (state === "published") {
            return badRequest(
              "Published (live) collections cannot be deleted from manager history."
            );
          }
          if (state !== "archived") {
            return badRequest("Archive this draft first, then run permanent delete.");
          }
          const readiness = await getCollectionDeployReadiness({
            env,
            collectionId: resolvedCollectionId
          });
          if (readiness.ready) {
            return badRequest(
              "This collection has a confirmed on-chain deployment and cannot be deleted."
            );
          }
          const assetsCountResult = await queryAll(
            env,
            "SELECT COUNT(*) as total FROM assets WHERE collection_id = ?",
            [resolvedCollectionId]
          );
          const reservationsCountResult = await queryAll(
            env,
            "SELECT COUNT(*) as total FROM reservations WHERE collection_id = ?",
            [resolvedCollectionId]
          );
          const assetsCount = Number(assetsCountResult.results?.[0]?.total ?? 0);
          const reservationsCount = Number(
            reservationsCountResult.results?.[0]?.total ?? 0
          );
          let removedBucketObjects = 0;
          const bucket = resolveAssetsBucket4(env);
          if (bucket) {
            const keyRows = await queryAll(
              env,
              "SELECT storage_key FROM assets WHERE collection_id = ? AND storage_key IS NOT NULL AND TRIM(storage_key) != ?",
              [resolvedCollectionId, ""]
            );
            const dbKeys = Array.from(
              new Set(
                (keyRows.results ?? []).map((row) => toNullableString7(row.storage_key)).filter((value) => value !== null)
              )
            );
            for (const chunk of chunkValues(dbKeys, 1e3)) {
              await bucket.delete(chunk);
              removedBucketObjects += chunk.length;
            }
            removedBucketObjects += await deleteBucketPrefix(
              bucket,
              `${resolvedCollectionId}/`
            );
          }
          await run(env, "DELETE FROM reservations WHERE collection_id = ?", [
            resolvedCollectionId
          ]);
          await run(env, "DELETE FROM assets WHERE collection_id = ?", [
            resolvedCollectionId
          ]);
          await run(env, "DELETE FROM collections WHERE id = ?", [resolvedCollectionId]);
          return jsonResponse({
            deleted: true,
            id: resolvedCollectionId,
            removed: {
              assets: assetsCount,
              reservations: reservationsCount,
              bucketObjects: removedBucketObjects
            }
          });
        } catch (error) {
          return serverError(
            error instanceof Error ? error.message : "failed to delete collection"
          );
        }
      }
      return jsonResponse({ error: "Method not allowed" }, 405);
    }, "onRequest");
  }
});

// i/[tokenId].ts
var onRequest24;
var init_tokenId2 = __esm({
  "i/[tokenId].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_handler2();
    onRequest24 = onInscriptionRequest;
  }
});

// index/[contract].ts
var CORS4, json5, toHex2, uintArg, unwrap, asNumber, asString, asUintList, readOkUint, readMintedCount, readLastTokenId, readMintedId, readSummary, readMetaSummary, probeCaps, getState3, readToken, syncTokenParents, syncTokenDependencies, upsertToken, SYNC_LOCK_TTL_MS, sync, runSync, refreshTokens, backfillParentEdges, onRequest25;
var init_contract3 = __esm({
  "index/[contract].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_esm3();
    init_lib();
    init_db();
    init_hiro_keys();
    CORS4 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "content-type"
    };
    json5 = /* @__PURE__ */ __name((body, status = 200) => new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json", ...CORS4 }
    }), "json");
    toHex2 = /* @__PURE__ */ __name((bytes2) => Array.from(bytes2, (b) => b.toString(16).padStart(2, "0")).join(""), "toHex");
    uintArg = /* @__PURE__ */ __name((value) => {
      const serialized = serializeCV(uintCV(value));
      return "0x" + (typeof serialized === "string" ? serialized.replace(/^0x/, "") : toHex2(serialized));
    }, "uintArg");
    unwrap = /* @__PURE__ */ __name((node) => node && typeof node === "object" && "value" in node ? node.value : node, "unwrap");
    asNumber = /* @__PURE__ */ __name((node) => {
      const v = unwrap(node);
      return v === null || v === void 0 ? null : Number(v);
    }, "asNumber");
    asString = /* @__PURE__ */ __name((node) => {
      const v = unwrap(node);
      return typeof v === "string" ? v : v === null || v === void 0 ? null : String(v);
    }, "asString");
    asUintList = /* @__PURE__ */ __name((node) => {
      const v = unwrap(node);
      if (!Array.isArray(v)) return [];
      const out = [];
      for (const el of v) {
        const n = asNumber(el);
        if (n !== null && Number.isInteger(n) && n > 0) out.push(n);
      }
      return out;
    }, "asUintList");
    readOkUint = /* @__PURE__ */ __name(async (env, apiBases, contract, functionName) => {
      const cv = await callRuntimeReadOnly({
        env,
        apiBases,
        contract,
        functionName,
        functionArgs: [],
        senderAddress: contract.address
      });
      return Number(unwrap(unwrap(cvToJSON(cv))));
    }, "readOkUint");
    readMintedCount = /* @__PURE__ */ __name((env, apiBases, contract) => readOkUint(env, apiBases, contract, "get-minted-count"), "readMintedCount");
    readLastTokenId = /* @__PURE__ */ __name((env, apiBases, contract) => readOkUint(env, apiBases, contract, "get-last-token-id"), "readLastTokenId");
    readMintedId = /* @__PURE__ */ __name(async (env, apiBases, contract, index) => {
      const cv = await callRuntimeReadOnly({
        env,
        apiBases,
        contract,
        functionName: "get-minted-id",
        functionArgs: [uintArg(BigInt(index))],
        senderAddress: contract.address
      });
      const json0 = cvToJSON(cv);
      const v = unwrap(unwrap(json0));
      return v === null || v === void 0 ? null : Number(unwrap(v));
    }, "readMintedId");
    readSummary = /* @__PURE__ */ __name(async (env, apiBases, contract, id) => {
      const cv = await callRuntimeReadOnly({
        env,
        apiBases,
        contract,
        functionName: "get-inscription-summary",
        functionArgs: [uintArg(BigInt(id))],
        senderAddress: contract.address
      });
      const okVal = unwrap(cvToJSON(cv));
      const optVal = unwrap(okVal);
      if (optVal === null || optVal === void 0) return null;
      const fields = optVal.value ?? optVal;
      return {
        owner: asString(fields["owner"]),
        creator: asString(fields["creator"]),
        finalHash: asString(fields["final-hash"]),
        mime: asString(fields["mime-type"]),
        totalSize: asNumber(fields["total-size"]),
        totalChunks: asNumber(fields["total-chunks"]),
        sealed: unwrap(fields["sealed"]) === true ? 1 : 0,
        tokenUri: asString(unwrap(fields["token-uri"])),
        // migration-source is (optional { source-contract: principal, source-id: uint }).
        // Store the XIP-002 canonical reference "<contract>:<id>", or null.
        migrationSource: (() => {
          const ms = fields["migration-source"];
          if (!ms) return null;
          const inner = unwrap(ms);
          if (inner === null || inner === void 0) return null;
          const t = inner.value ?? inner;
          const sourceContract = asString(t["source-contract"]);
          const sourceId = asNumber(t["source-id"]);
          return sourceContract != null && sourceId != null ? `${sourceContract}:${sourceId}` : null;
        })(),
        // Direct parents (v3.2.0+ summaries carry this list; empty on older cores).
        parents: asUintList(fields["parents"]),
        // Direct dependencies (existence-only edges; v3.2.0+ summaries carry this).
        dependencies: asUintList(fields["dependencies"])
      };
    }, "readSummary");
    readMetaSummary = /* @__PURE__ */ __name(async (env, apiBases, contract, id) => {
      const cv = await callRuntimeReadOnly({
        env,
        apiBases,
        contract,
        functionName: "get-inscription-meta",
        functionArgs: [uintArg(BigInt(id))],
        senderAddress: contract.address
      });
      const optVal = unwrap(unwrap(cvToJSON(cv)));
      if (optVal === null || optVal === void 0) return null;
      const fields = optVal.value ?? optVal;
      let owner = asString(fields["owner"]);
      if (owner === null) {
        try {
          const oc = await callRuntimeReadOnly({
            env,
            apiBases,
            contract,
            functionName: "get-owner",
            functionArgs: [uintArg(BigInt(id))],
            senderAddress: contract.address
          });
          owner = asString(unwrap(unwrap(cvToJSON(oc))));
        } catch {
          owner = null;
        }
      }
      let tokenUri = null;
      try {
        const tc = await callRuntimeReadOnly({
          env,
          apiBases,
          contract,
          functionName: "get-token-uri",
          functionArgs: [uintArg(BigInt(id))],
          senderAddress: contract.address
        });
        tokenUri = asString(unwrap(unwrap(unwrap(cvToJSON(tc)))));
      } catch {
        tokenUri = null;
      }
      return {
        owner,
        creator: asString(fields["creator"]),
        finalHash: asString(fields["final-hash"]),
        mime: asString(fields["mime-type"]),
        totalSize: asNumber(fields["total-size"]),
        totalChunks: asNumber(fields["total-chunks"]),
        sealed: unwrap(fields["sealed"]) === true ? 1 : 0,
        tokenUri,
        migrationSource: null,
        // v1/v2 cores predate parent/dependency relationships.
        parents: [],
        dependencies: []
      };
    }, "readMetaSummary");
    probeCaps = /* @__PURE__ */ __name(async (env, apiBases, contract) => {
      let hasMintedList = true;
      let hasSummary = true;
      try {
        await readMintedCount(env, apiBases, contract);
      } catch {
        hasMintedList = false;
      }
      try {
        await callRuntimeReadOnly({
          env,
          apiBases,
          contract,
          functionName: "get-inscription-summary",
          functionArgs: [uintArg(1n)],
          senderAddress: contract.address
        });
      } catch {
        hasSummary = false;
      }
      return { hasMintedList, hasSummary };
    }, "probeCaps");
    getState3 = /* @__PURE__ */ __name(async (env, contractId) => {
      const res = await queryAll(env, "SELECT minted_count, synced_count FROM inscription_index_state WHERE contract = ?", [contractId]);
      const row = (res.results ?? [])[0];
      return { mintedCount: row?.minted_count ?? 0, syncedCount: row?.synced_count ?? 0 };
    }, "getState");
    readToken = /* @__PURE__ */ __name((env, apiBases, contract, caps, id) => caps.hasSummary ? readSummary(env, apiBases, contract, id) : readMetaSummary(env, apiBases, contract, id), "readToken");
    syncTokenParents = /* @__PURE__ */ __name(async (env, contractId, childId, parents) => {
      try {
        await run(env, "DELETE FROM inscription_parents WHERE contract = ? AND child_id = ?", [contractId, childId]);
        const now = Date.now();
        for (const parentId of parents) {
          if (!Number.isInteger(parentId) || parentId <= 0 || parentId === childId) continue;
          await run(
            env,
            "INSERT OR IGNORE INTO inscription_parents (contract, child_id, parent_id, updated_at) VALUES (?,?,?,?)",
            [contractId, childId, parentId, now]
          );
        }
      } catch {
      }
    }, "syncTokenParents");
    syncTokenDependencies = /* @__PURE__ */ __name(async (env, contractId, childId, dependencies) => {
      try {
        await run(env, "DELETE FROM inscription_dependencies WHERE contract = ? AND child_id = ?", [contractId, childId]);
        const now = Date.now();
        for (const dependencyId of dependencies) {
          if (!Number.isInteger(dependencyId) || dependencyId <= 0 || dependencyId === childId) continue;
          await run(
            env,
            "INSERT OR IGNORE INTO inscription_dependencies (contract, child_id, dependency_id, updated_at) VALUES (?,?,?,?)",
            [contractId, childId, dependencyId, now]
          );
        }
      } catch {
      }
    }, "syncTokenDependencies");
    upsertToken = /* @__PURE__ */ __name(async (env, contractId, tokenId, s) => {
      await run(
        env,
        `INSERT INTO inscription_index
       (contract, token_id, owner, creator, final_hash, mime, total_size, total_chunks, sealed, token_uri, migration_source, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(contract, token_id) DO UPDATE SET
       owner=excluded.owner, creator=excluded.creator, final_hash=excluded.final_hash,
       mime=excluded.mime, total_size=excluded.total_size, total_chunks=excluded.total_chunks,
       sealed=excluded.sealed, token_uri=excluded.token_uri,
       migration_source=excluded.migration_source, updated_at=excluded.updated_at`,
        [
          contractId,
          tokenId,
          s.owner,
          s.creator,
          s.finalHash,
          s.mime,
          s.totalSize,
          s.totalChunks,
          s.sealed,
          s.tokenUri,
          s.migrationSource,
          Date.now()
        ]
      );
      await syncTokenParents(env, contractId, tokenId, s.parents ?? []);
      await syncTokenDependencies(env, contractId, tokenId, s.dependencies ?? []);
    }, "upsertToken");
    SYNC_LOCK_TTL_MS = 12e4;
    sync = /* @__PURE__ */ __name(async (env, apiBases, contract, contractId, maxPerRun) => {
      const now = Date.now();
      await run(
        env,
        `INSERT OR IGNORE INTO inscription_index_state
       (contract, minted_count, synced_count, updated_at, sync_lock_until)
     VALUES (?,0,0,0,0)`,
        [contractId]
      );
      const lockRes = await run(
        env,
        `UPDATE inscription_index_state SET sync_lock_until = ?
      WHERE contract = ? AND (sync_lock_until IS NULL OR sync_lock_until <= ?)`,
        [now + SYNC_LOCK_TTL_MS, contractId, now]
      );
      const acquired = Number(lockRes?.meta?.changes ?? 0) > 0;
      if (!acquired) {
        return { skipped: true };
      }
      try {
        return await runSync(env, apiBases, contract, contractId, maxPerRun);
      } finally {
        await run(
          env,
          "UPDATE inscription_index_state SET sync_lock_until = 0 WHERE contract = ?",
          [contractId]
        ).catch(() => void 0);
      }
    }, "sync");
    runSync = /* @__PURE__ */ __name(async (env, apiBases, contract, contractId, maxPerRun) => {
      const caps = await probeCaps(env, apiBases, contract);
      const total = caps.hasMintedList ? await readMintedCount(env, apiBases, contract) : await readLastTokenId(env, apiBases, contract);
      const { syncedCount } = await getState3(env, contractId);
      const start = syncedCount;
      const end = Math.min(total, start + maxPerRun);
      let ingested = 0;
      for (let index = start; index < end; index += 1) {
        const tokenId = caps.hasMintedList ? await readMintedId(env, apiBases, contract, index) : index + 1;
        if (tokenId === null) continue;
        const summary = await readToken(env, apiBases, contract, caps, tokenId);
        if (!summary) continue;
        await upsertToken(env, contractId, tokenId, summary);
        ingested += 1;
      }
      const newSynced = end;
      await run(
        env,
        `INSERT INTO inscription_index_state (contract, minted_count, synced_count, updated_at)
     VALUES (?,?,?,?)
     ON CONFLICT(contract) DO UPDATE SET minted_count=excluded.minted_count, synced_count=excluded.synced_count, updated_at=excluded.updated_at`,
        [contractId, total, newSynced, Date.now()]
      );
      const complete = newSynced >= total;
      let refreshed = 0;
      if (complete) {
        const window2 = Number(env.INSCRIPTION_INDEX_REFRESH_WINDOW) || 12;
        const stale = await queryAll(
          env,
          "SELECT token_id FROM inscription_index WHERE contract = ? ORDER BY updated_at ASC LIMIT ?",
          [contractId, window2]
        );
        for (const row of stale.results ?? []) {
          const summary = await readToken(env, apiBases, contract, caps, row.token_id);
          if (summary) {
            await upsertToken(env, contractId, row.token_id, summary);
            refreshed += 1;
          }
        }
      }
      return { mintedCount: total, syncedCount: newSynced, ingested, refreshed, complete };
    }, "runSync");
    refreshTokens = /* @__PURE__ */ __name(async (env, apiBases, contract, contractId, ids) => {
      const caps = await probeCaps(env, apiBases, contract);
      let refreshed = 0;
      for (const id of ids) {
        const summary = await readToken(env, apiBases, contract, caps, id);
        if (summary) {
          await upsertToken(env, contractId, id, summary);
          refreshed += 1;
        }
      }
      return { refreshed, ids };
    }, "refreshTokens");
    backfillParentEdges = /* @__PURE__ */ __name(async (env, apiBases, contract, contractId, params) => {
      const hiroKeyCount = getHiroApiKeys(env).length;
      const hiroApiBases = apiBases.filter((base) => base.includes("hiro.so"));
      const readApiBases = hiroKeyCount > 0 && hiroApiBases.length > 0 ? hiroApiBases : apiBases;
      const caps = await probeCaps(env, readApiBases, contract);
      const rows = await queryAll(
        env,
        `SELECT token_id FROM inscription_index
       WHERE contract = ? AND token_id >= ?
       ORDER BY token_id ASC LIMIT ?`,
        [contractId, params.fromTokenId, params.limit]
      );
      const tokenIds = (rows.results ?? []).map((row) => Number(row.token_id)).filter((id) => Number.isInteger(id) && id > 0);
      let refreshed = 0;
      for (const id of tokenIds) {
        const summary = await readToken(env, readApiBases, contract, caps, id);
        if (summary) {
          await upsertToken(env, contractId, id, summary);
          refreshed += 1;
        }
      }
      const lastTokenId = tokenIds[tokenIds.length - 1] ?? null;
      return {
        refreshed,
        scanned: tokenIds.length,
        fromTokenId: params.fromTokenId,
        lastTokenId,
        nextFromTokenId: lastTokenId === null ? null : lastTokenId + 1,
        complete: tokenIds.length < params.limit,
        upstream: {
          hiroKeyCount,
          hiroOnly: readApiBases === hiroApiBases,
          apiBaseCount: readApiBases.length
        }
      };
    }, "backfillParentEdges");
    onRequest25 = /* @__PURE__ */ __name(async (context) => {
      const { request, params, env } = context;
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS4 });
      const contractId = params.contract ?? "";
      const contract = parseRuntimeContractRef(contractId);
      if (!contract) return json5({ error: "Invalid contract id." }, 400);
      const apiBases = getRuntimeApiBases("mainnet", env);
      if (apiBases.length === 0) return json5({ error: "No API base configured." }, 503);
      try {
        if (request.method === "POST") {
          const url2 = new URL(request.url);
          const parentBackfill = url2.searchParams.get("parents")?.trim().toLowerCase();
          if (parentBackfill === "backfill") {
            const adminToken = env.INDEX_ADMIN_TOKEN;
            if (adminToken && request.headers.get("x-admin-token") !== adminToken) {
              return json5({ error: "Unauthorized." }, 401);
            }
            const fromRaw = Number(url2.searchParams.get("from") ?? 1);
            const limitRaw = Number(url2.searchParams.get("limit") ?? 50);
            const fromTokenId = Number.isInteger(fromRaw) && fromRaw > 0 ? Math.floor(fromRaw) : 1;
            const limit2 = Number.isInteger(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 100) : 50;
            const result2 = await backfillParentEdges(env, apiBases, contract, contractId, {
              fromTokenId,
              limit: limit2
            });
            return json5({ ok: true, ...result2 });
          }
          const idParam = url2.searchParams.get("id");
          if (idParam) {
            const ids = idParam.split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0);
            if (ids.length === 0) return json5({ error: "No valid id(s)." }, 400);
            const result2 = await refreshTokens(env, apiBases, contract, contractId, ids);
            return json5({ ok: true, ...result2 });
          }
          const maxPerRun = Number(env.INSCRIPTION_INDEX_SYNC_BATCH) || 20;
          const result = await sync(env, apiBases, contract, contractId, maxPerRun);
          return json5({ ok: true, ...result });
        }
        const url = new URL(request.url);
        const cols = "token_id, owner, creator, final_hash, mime, total_size, total_chunks, sealed, token_uri, migration_source";
        const idsParam = url.searchParams.get("ids");
        let parsedIds = null;
        let from = 1;
        let limit = 16;
        let order = "ASC";
        if (idsParam) {
          const ids = idsParam.split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0).slice(0, 200);
          if (ids.length === 0) return json5({ error: "No valid ids." }, 400);
          parsedIds = Array.from(new Set(ids)).sort((a, b) => a - b);
        } else {
          from = Math.max(1, Number(url.searchParams.get("from") || "1"));
          limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || "16")));
          order = (url.searchParams.get("order") || "asc").toLowerCase() === "desc" ? "DESC" : "ASC";
        }
        const cacheKeyUrl = new URL(url.origin + url.pathname);
        if (parsedIds) {
          cacheKeyUrl.searchParams.set("ids", parsedIds.join(","));
        } else {
          cacheKeyUrl.searchParams.set("from", String(from));
          cacheKeyUrl.searchParams.set("limit", String(limit));
          cacheKeyUrl.searchParams.set("order", order);
        }
        const edgeCache = globalThis.caches?.default ?? null;
        const cacheRequest = new Request(cacheKeyUrl.toString(), { method: "GET" });
        if (edgeCache) {
          const hit = await edgeCache.match(cacheRequest);
          if (hit) return hit;
        }
        let rows;
        if (parsedIds) {
          rows = await queryAll(
            env,
            `SELECT ${cols} FROM inscription_index
          WHERE contract = ? AND token_id IN (${parsedIds.map(() => "?").join(",")})`,
            [contractId, ...parsedIds]
          );
        } else {
          rows = await queryAll(
            env,
            `SELECT ${cols} FROM inscription_index
          WHERE contract = ? AND token_id >= ?
          ORDER BY token_id ${order} LIMIT ?`,
            [contractId, from, limit]
          );
        }
        const state = await getState3(env, contractId);
        if (context.waitUntil) {
          const stale = await queryAll(env, "SELECT updated_at FROM inscription_index_state WHERE contract = ?", [contractId]);
          const updatedAt = (stale.results ?? [])[0]?.updated_at ?? 0;
          const behind = state.syncedCount < state.mintedCount;
          if (behind || Date.now() - updatedAt > 6e4) {
            const maxPerRun = Number(env.INSCRIPTION_INDEX_SYNC_BATCH) || 20;
            context.waitUntil(sync(env, apiBases, contract, contractId, maxPerRun).catch(() => void 0));
          }
        }
        const payload = {
          contract: contractId,
          mintedCount: state.mintedCount,
          syncedCount: state.syncedCount,
          tokens: (rows.results ?? []).map((r) => ({
            id: r.token_id,
            owner: r.owner,
            creator: r.creator,
            finalHash: r.final_hash,
            mime: r.mime,
            totalSize: r.total_size,
            totalChunks: r.total_chunks,
            sealed: r.sealed === 1,
            tokenUri: r.token_uri ?? null,
            migrationSource: r.migration_source
          }))
        };
        const response = new Response(JSON.stringify(payload), {
          status: 200,
          headers: {
            "content-type": "application/json",
            // max-age: brief browser cache. s-maxage: edge TTL. SWR: serve stale
            // instantly while a background revalidation refreshes the entry.
            "Cache-Control": "public, max-age=15, s-maxage=60, stale-while-revalidate=300",
            ...CORS4
          }
        });
        if (edgeCache && context.waitUntil) {
          context.waitUntil(edgeCache.put(cacheRequest, response.clone()));
        }
        return response;
      } catch (error) {
        return json5({ error: error instanceof Error ? error.message : String(error) }, 500);
      }
    }, "onRequest");
  }
});

// inscription/[tokenId].ts
var onRequest26;
var init_tokenId3 = __esm({
  "inscription/[tokenId].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_handler2();
    onRequest26 = onInscriptionRequest;
  }
});

// explorer/[[path]].ts
var DEFAULT_EXPLORER_BASE, onRequest27;
var init_path5 = __esm({
  "explorer/[[path]].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    DEFAULT_EXPLORER_BASE = "https://explorer.hiro.so";
    onRequest27 = /* @__PURE__ */ __name(async (context) => {
      const { request, params, env } = context;
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
            "Access-Control-Allow-Headers": "content-type"
          }
        });
      }
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", {
          status: 405,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
            "Access-Control-Allow-Headers": "content-type"
          }
        });
      }
      const pathParam = params.path;
      const path = Array.isArray(pathParam) ? pathParam.join("/") : pathParam ?? "";
      const url = new URL(request.url);
      const targetBase = env.STACKS_EXPLORER_BASE || env.VITE_STACKS_EXPLORER_BASE || env.VITE_STACKS_EXPLORER_BASE_MAINNET || DEFAULT_EXPLORER_BASE;
      const targetUrl = `${targetBase.replace(/\/+$/, "")}/${path}${url.search}`;
      const headers = new Headers();
      headers.set("accept", request.headers.get("accept") ?? "text/html,*/*;q=0.8");
      headers.set(
        "user-agent",
        request.headers.get("user-agent") ?? "xtrata-explorer-proxy/1.0 (+https://xtrata.xyz)"
      );
      const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        redirect: "follow"
      });
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("Access-Control-Allow-Origin", "*");
      responseHeaders.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
      responseHeaders.set("Access-Control-Allow-Headers", "content-type");
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders
      });
    }, "onRequest");
  }
});

// g/[[path]].ts
var NFT_ASSET_NAME, SCAN_LIMIT, MAX_MANIFEST_BYTES, mainnetContracts, defaultContractId, json6, hiroFetch, resolveNameToAddress, listNewestHoldings, fetchInscriptionContent, readManifest, findManifests, escapeHtml, renderGalleryPage, html, onRequest28;
var init_path6 = __esm({
  "g/[[path]].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_contract_registry();
    init_content();
    init_hiro_keys();
    NFT_ASSET_NAME = "xtrata-inscription";
    SCAN_LIMIT = 48;
    MAX_MANIFEST_BYTES = 262144;
    mainnetContracts = contract_registry_default.filter((entry) => entry.network === "mainnet").map((entry) => `${entry.address}.${entry.contractName}`);
    defaultContractId = mainnetContracts[mainnetContracts.length - 1] || "";
    json6 = /* @__PURE__ */ __name((body, status = 200, cache = "public, max-age=60") => new Response(JSON.stringify(body, null, 2), {
      status,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": cache }
    }), "json");
    hiroFetch = /* @__PURE__ */ __name(async (env, path) => {
      const headers = new Headers({ accept: "application/json" });
      const keys = getHiroApiKeys(env);
      applyHiroApiKey(headers, keys[0] ?? null);
      return fetch(`https://api.hiro.so${path}`, { headers });
    }, "hiroFetch");
    resolveNameToAddress = /* @__PURE__ */ __name(async (env, name) => {
      const response = await hiroFetch(env, `/v1/names/${encodeURIComponent(name.toLowerCase())}`);
      if (!response.ok) return null;
      const data = await response.json();
      return typeof data.address === "string" && data.address ? data.address : null;
    }, "resolveNameToAddress");
    listNewestHoldings = /* @__PURE__ */ __name(async (env, address) => {
      const identifiers = mainnetContracts.map((id) => `${id}::${NFT_ASSET_NAME}`).join(",");
      const response = await hiroFetch(
        env,
        `/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(address)}&asset_identifiers=${encodeURIComponent(identifiers)}&limit=${SCAN_LIMIT}&unanchored=true`
      );
      if (!response.ok) return [];
      const data = await response.json();
      const holdings = [];
      for (const row of data.results ?? []) {
        const contractId = String(row.asset_identifier ?? "").split("::")[0];
        const tokenId = String(row.value?.repr ?? "").replace(/^u/, "");
        if (contractId && /^\d+$/.test(tokenId)) holdings.push({ tokenId, contractId });
      }
      return holdings.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
    }, "listNewestHoldings");
    fetchInscriptionContent = /* @__PURE__ */ __name(async (env, waitUntil, tokenId, contractId) => {
      const url = new URL("https://internal/runtime/content");
      url.searchParams.set("contractId", contractId || defaultContractId);
      url.searchParams.set("tokenId", tokenId);
      url.searchParams.set("network", "mainnet");
      return onRequest3({
        request: new Request(url.toString()),
        env,
        waitUntil
      });
    }, "fetchInscriptionContent");
    readManifest = /* @__PURE__ */ __name(async (response) => {
      const type = (response.headers.get("content-type") || "").toLowerCase();
      const length = Number(response.headers.get("content-length") || "0");
      const looksJson = type.includes("json") || type.includes("text/plain");
      if (!response.ok || !looksJson || length > MAX_MANIFEST_BYTES) {
        try {
          await response.body?.cancel();
        } catch {
        }
        return null;
      }
      try {
        const text = await response.text();
        if (text.length > MAX_MANIFEST_BYTES) return null;
        const parsed = JSON.parse(text);
        return parsed && typeof parsed === "object" && parsed.xtrataManifest ? parsed : null;
      } catch {
        return null;
      }
    }, "readManifest");
    findManifests = /* @__PURE__ */ __name(async (env, waitUntil, address) => {
      const holdings = await listNewestHoldings(env, address);
      const found = [];
      for (const holding of holdings) {
        const response = await fetchInscriptionContent(env, waitUntil, holding.tokenId, holding.contractId);
        const manifest = await readManifest(response);
        if (manifest) found.push({ ...holding, manifest });
        const hasProfile = found.some((f2) => f2.manifest.xtrataManifest?.kind === "profile");
        const hasGallery = found.some((f2) => ["gallery", "creator-collection"].includes(f2.manifest.xtrataManifest?.kind || ""));
        if (hasProfile && hasGallery) break;
      }
      return found;
    }, "findManifests");
    escapeHtml = /* @__PURE__ */ __name((value) => String(value ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    ), "escapeHtml");
    renderGalleryPage = /* @__PURE__ */ __name((params) => {
      const { manifest, manifestTokenId, curatorName, address } = params;
      const head = manifest.xtrataManifest || {};
      const items = (manifest.items || []).filter((item) => /^\d+$/.test(String(item.tokenId || "")));
      const title = head.title || head.name || "Xtrata Gallery";
      const kind = head.kind === "creator-collection" ? "Owner-attested collection" : "Curated gallery";
      const mode = manifest.display?.mode || "viewing";
      const curator = curatorName || head.bnsName || (address ? `${address.slice(0, 6)}\u2026${address.slice(-4)}` : "unknown");
      const tiles = items.map((item) => {
        const id = escapeHtml(item.tokenId);
        const label = escapeHtml(item.label || `#${item.tokenId}`);
        return `<a class="tile" data-token="${id}" href="/inscription/${id}" target="_blank" rel="noopener"><div class="tile-media"><div class="tile-wait">#${id}</div></div><div class="tile-label">${label}</div></a>`;
      }).join("\n");
      return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} \xB7 Xtrata Gallery</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<style>
  :root{color-scheme:dark;--bg:#0b0e14;--panel:#121723;--line:#243044;--ink:#e6edf6;--mut:#8b9bb4;--acc:#3ea6ff}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  header{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--line)}
  header a.home{flex:none;display:block}
  header img{width:28px;height:28px;border-radius:7px;display:block}
  .crumb{font-weight:800}.crumb a{color:var(--acc);text-decoration:none}
  .badge{margin-left:auto;font-size:11px;color:var(--mut);border:1px solid var(--line);border-radius:999px;padding:3px 10px}
  main{max-width:1180px;margin:0 auto;padding:28px 18px 64px}
  h1{margin:0 0 4px;font-size:26px}
  .meta{color:var(--mut);font-size:13px;margin-bottom:6px}
  .meta b{color:var(--ink)}
  .desc{color:var(--mut);max-width:720px;margin:10px 0 26px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
  .tile{display:block;background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden;color:inherit;text-decoration:none;transition:border-color .12s}
  .tile:hover{border-color:var(--acc)}
  .tile-media{aspect-ratio:1/1;background:#0e131d}
  .tile-media img,.tile-media iframe{width:100%;height:100%;object-fit:cover;border:0;display:block}
  .tile-label{padding:9px 12px;font-size:12.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .tile-wait{display:grid;place-items:center;height:100%;color:var(--mut);font-family:ui-monospace,monospace;font-size:12px;text-align:center}
  footer{padding:18px 20px;color:var(--mut);font-size:12px;text-align:center;border-top:1px solid var(--line)}
  footer a{color:var(--acc)}
</style>
</head>
<body>
<header>
  <a class="home" href="/" title="Xtrata home"><img src="/favicon.svg" alt="Xtrata" /></a>
  <span class="crumb"><a href="/">XTRATA</a> \xB7 Galleries</span>
  <span class="badge">${escapeHtml(kind)} \xB7 manifest #${escapeHtml(manifestTokenId)}</span>
</header>
<main>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">Curated by <b>${escapeHtml(curator)}</b> \xB7 ${items.length} item${items.length === 1 ? "" : "s"} \xB7 ${escapeHtml(mode)} gallery${head.supersedes ? ` \xB7 <a style="color:var(--acc)" href="/g/${escapeHtml(head.supersedes)}">previous version</a>` : ""}</div>
  ${head.description ? `<p class="desc">${escapeHtml(head.description)}</p>` : ""}
  <div class="grid">${tiles || '<p class="meta">This manifest lists no items yet.</p>'}</div>
</main>
<script>
(function(){
  var CORES=['SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3','SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0','SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1'];
  async function resolve(id){
    for(var i=0;i<CORES.length;i++){
      var url='/runtime/content?contractId='+encodeURIComponent(CORES[i])+'&tokenId='+id+'&network=mainnet';
      try{var r=await fetch(url);var t=(r.headers.get('content-type')||'').toLowerCase();
        try{r.body&&r.body.cancel&&r.body.cancel()}catch(e){}
        if(r.ok&&t.indexOf('application/json')===-1)return{url:url,type:t};
      }catch(e){}
    }
    return null;
  }
  var tiles=Array.prototype.slice.call(document.querySelectorAll('.tile[data-token]'));
  var queue=tiles.slice();
  function next(){
    var tile=queue.shift();if(!tile)return;
    var id=tile.getAttribute('data-token');
    resolve(id).then(function(m){
      var box=tile.querySelector('.tile-media');
      if(!m){box.innerHTML='<div class="tile-wait">#'+id+'<br>unreachable</div>';}
      else if(m.type.indexOf('image/')===0){box.innerHTML='<img loading="lazy" src="'+m.url+'" alt="#'+id+'" />';tile.href=m.url;}
      else{box.innerHTML='<iframe loading="lazy" src="'+m.url+'" sandbox="allow-scripts allow-same-origin" title="#'+id+'"></iframe>';tile.href=m.url;}
      next();
    });
  }
  // hydrate 4 tiles at a time
  for(var k=0;k<4;k++)next();
})();
<\/script>
<footer>Galleries are immutable Xtrata manifests \u2014 the newest manifest inscribed by the name's owner is always shown. <a href="/g/${escapeHtml(head.bnsName || "")}?format=json">Raw JSON</a></footer>
</body>
</html>`;
    }, "renderGalleryPage");
    html = /* @__PURE__ */ __name((body, cache) => new Response(body, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": cache }
    }), "html");
    onRequest28 = /* @__PURE__ */ __name(async ({ request, env, params, waitUntil }) => {
      const runtimeEnv = env;
      const wait3 = waitUntil ?? (() => {
      });
      const rawSegments = Array.isArray(params.path) ? params.path : [params.path];
      const segments = rawSegments.filter((s) => typeof s === "string" && s.length > 0).map((s) => decodeURIComponent(s).trim().toLowerCase());
      const url = new URL(request.url);
      const wantsJson = url.searchParams.get("format") === "json";
      if (segments.length === 0) {
        return json6({ error: "Usage: /g/<bns-name>[/<gallery>] or /g/<manifest-id>" }, 400);
      }
      const [first, handle] = segments;
      if (/^\d+$/.test(first)) {
        const response = await fetchInscriptionContent(runtimeEnv, wait3, first, defaultContractId);
        const manifest = await readManifest(response);
        if (!manifest) return json6({ error: `Inscription #${first} is not an Xtrata manifest.` }, 404);
        if (wantsJson) return json6({ manifestTokenId: first, manifest }, 200, "public, max-age=31536000, immutable");
        return html(
          renderGalleryPage({ manifest, manifestTokenId: first, curatorName: manifest.xtrataManifest?.bnsName || null, address: null }),
          "public, max-age=31536000, immutable"
        );
      }
      const name = first.includes(".") ? first : `${first}.btc`;
      const address = await resolveNameToAddress(runtimeEnv, name);
      if (!address) return json6({ error: `Could not resolve ${name} to a Stacks address.` }, 404);
      const found = await findManifests(runtimeEnv, wait3, address);
      const profile = found.find((f2) => f2.manifest.xtrataManifest?.kind === "profile");
      let target = null;
      if (profile && Array.isArray(profile.manifest.galleries) && profile.manifest.galleries.length) {
        const entry = handle ? profile.manifest.galleries.find((g) => g.name === handle) : profile.manifest.galleries.find((g) => g.default) || profile.manifest.galleries[0];
        if (entry && /^\d+$/.test(String(entry.manifestId || ""))) {
          const response = await fetchInscriptionContent(runtimeEnv, wait3, String(entry.manifestId), defaultContractId);
          const manifest = await readManifest(response);
          if (manifest) target = { tokenId: String(entry.manifestId), contractId: defaultContractId, manifest };
        }
      }
      if (!target) {
        target = found.find((f2) => {
          const kind = f2.manifest.xtrataManifest?.kind || "";
          const matchesHandle = !handle || f2.manifest.xtrataManifest?.name === handle;
          return ["gallery", "creator-collection"].includes(kind) && matchesHandle;
        }) || null;
      }
      if (!target) {
        return json6(
          { error: `No gallery manifest found for ${name}${handle ? `/${handle}` : ""}.`, address, hint: 'Inscribe a manifest with an {"xtrataManifest":{"kind":"gallery",\u2026}} envelope \u2014 see /schemas/manifest-envelope.schema.json' },
          404
        );
      }
      if (wantsJson) {
        return json6({ name, address, manifestTokenId: target.tokenId, viaProfile: Boolean(profile), manifest: target.manifest });
      }
      return html(
        renderGalleryPage({ manifest: target.manifest, manifestTokenId: target.tokenId, curatorName: name, address }),
        "public, max-age=60"
      );
    }, "onRequest");
  }
});

// rpc-testnet/[[path]].ts
var onRequest29;
var init_path7 = __esm({
  "rpc-testnet/[[path]].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_hiro_proxy();
    onRequest29 = /* @__PURE__ */ __name(async (context) => {
      const { request, params, env } = context;
      return proxyHiroRequest({
        request,
        env,
        network: "testnet",
        path: params.path
      });
    }, "onRequest");
  }
});

// rpc/[[path]].ts
var onRequest30;
var init_path8 = __esm({
  "rpc/[[path]].ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_hiro_proxy();
    onRequest30 = /* @__PURE__ */ __name(async (context) => {
      const { request, params, env } = context;
      return proxyHiroRequest({
        request,
        env,
        network: "mainnet",
        path: params.path
      });
    }, "onRequest");
  }
});

// collections.ts
var PUBLIC_COLLECTIONS_CACHE_CONTROL, PRIVATE_NO_STORE_CACHE_CONTROL4, mapRow2, onRequest31;
var init_collections2 = __esm({
  "collections.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_utils5();
    init_db();
    init_collections();
    PUBLIC_COLLECTIONS_CACHE_CONTROL = "public, max-age=60, s-maxage=120, stale-while-revalidate=300";
    PRIVATE_NO_STORE_CACHE_CONTROL4 = "private, no-store, max-age=0";
    mapRow2 = /* @__PURE__ */ __name((row) => ({
      ...row,
      metadata: parseCollectionMetadata(row.metadata)
    }), "mapRow");
    onRequest31 = /* @__PURE__ */ __name(async ({ request, env }) => {
      if (request.method === "GET") {
        try {
          const url = new URL(request.url);
          const artistAddress = url.searchParams.get("artistAddress")?.trim() ?? "";
          const includeArchivedParam = url.searchParams.get("includeArchived")?.trim().toLowerCase() ?? "";
          const includeArchived = includeArchivedParam === "1" || includeArchivedParam === "true" || includeArchivedParam === "yes";
          const publishedOnlyParam = url.searchParams.get("publishedOnly")?.trim().toLowerCase() ?? "";
          const publishedOnly = publishedOnlyParam === "1" || publishedOnlyParam === "true" || publishedOnlyParam === "yes";
          const publicVisibleOnlyParam = url.searchParams.get("publicVisibleOnly")?.trim().toLowerCase() ?? "";
          const publicVisibleOnly = publicVisibleOnlyParam === "1" || publicVisibleOnlyParam === "true" || publicVisibleOnlyParam === "yes";
          const result = artistAddress.length > 0 ? await queryAll(
            env,
            includeArchived ? "SELECT * FROM collections WHERE UPPER(artist_address) = UPPER(?) ORDER BY created_at DESC" : "SELECT * FROM collections WHERE UPPER(artist_address) = UPPER(?) AND LOWER(COALESCE(state, 'draft')) != 'archived' ORDER BY created_at DESC",
            [artistAddress]
          ) : await queryAll(
            env,
            includeArchived ? "SELECT * FROM collections ORDER BY created_at DESC" : "SELECT * FROM collections WHERE LOWER(COALESCE(state, 'draft')) != 'archived' ORDER BY created_at DESC"
          );
          const rows = (result.results ?? []).map(mapRow2);
          const filtered = rows.filter((row) => {
            if (publishedOnly && !isCollectionPublished(row.state)) {
              return false;
            }
            if (publicVisibleOnly && !isCollectionPublicVisible(row.metadata)) {
              return false;
            }
            return true;
          });
          const isPublicLiveListRequest = artistAddress.length === 0 && !includeArchived && publishedOnly && publicVisibleOnly;
          const ordered = isPublicLiveListRequest ? sortCollectionsForPublicDisplay(filtered) : filtered;
          return jsonResponse(ordered, 200, {
            "Cache-Control": isPublicLiveListRequest ? PUBLIC_COLLECTIONS_CACHE_CONTROL : PRIVATE_NO_STORE_CACHE_CONTROL4
          });
        } catch (error) {
          return serverError(
            error instanceof Error ? error.message : "failed to load collections"
          );
        }
      }
      if (request.method === "POST") {
        try {
          const payload = await request.json();
          if (typeof payload.artistAddress !== "string" || payload.artistAddress.trim() === "") {
            return badRequest("artistAddress is required.");
          }
          const artistAddress = payload.artistAddress.trim();
          const slugRaw = String(payload.slug ?? "");
          const slug = normalizeSlug(slugRaw);
          if (!isValidSlug(slug)) {
            return badRequest("Slug must be 3-64 lowercase alphanumeric characters or hyphens.");
          }
          const existingSlug = await queryAll(
            env,
            "SELECT * FROM collections WHERE slug = ? LIMIT 1",
            [slug]
          );
          const existingRecord = (existingSlug.results ?? [])[0];
          if (existingRecord) {
            if (canReuseCollectionSlug({
              incomingArtistAddress: artistAddress,
              existingArtistAddress: existingRecord.artist_address,
              contractAddress: existingRecord.contract_address,
              metadata: existingRecord.metadata,
              state: existingRecord.state
            })) {
              const existingId = String(existingRecord.id ?? "").trim();
              if (!existingId) {
                return serverError("Existing slug record is missing an id.");
              }
              const now2 = Date.now();
              const mergedMetadata = canonicalizeManageCollectionMetadata(
                mergeCollectionMetadata(existingRecord.metadata, payload.metadata)
              );
              const metadata2 = mergedMetadata ? JSON.stringify(mergedMetadata) : null;
              await run(
                env,
                "UPDATE collections SET artist_address = ?, contract_address = ?, display_name = ?, metadata = ?, state = ?, updated_at = ? WHERE id = ?",
                [
                  artistAddress,
                  payload.contractAddress ?? null,
                  payload.displayName ?? null,
                  metadata2,
                  "draft",
                  now2,
                  existingId
                ]
              );
              const reused = await queryAll(
                env,
                "SELECT * FROM collections WHERE id = ?",
                [existingId]
              );
              const reusedRecord = (reused.results ?? [])[0];
              return jsonResponse(
                {
                  ...mapRow2(reusedRecord),
                  slugReused: true
                },
                200
              );
            }
            return badRequest(
              `Collection URL slug "${slug}" is already in use. Choose a different collection name.`
            );
          }
          const now = Date.now();
          const id = crypto.randomUUID();
          const metadataRecord = canonicalizeManageCollectionMetadata(payload.metadata);
          const metadata = metadataRecord ? JSON.stringify(metadataRecord) : null;
          await run(
            env,
            "INSERT INTO collections (id, slug, artist_address, contract_address, display_name, metadata, state, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              id,
              slug,
              artistAddress,
              payload.contractAddress ?? null,
              payload.displayName ?? null,
              metadata,
              "draft",
              now,
              now
            ]
          );
          const created = await queryAll(
            env,
            "SELECT * FROM collections WHERE id = ?",
            [id]
          );
          const record = (created.results ?? [])[0];
          return jsonResponse(
            {
              ...mapRow2(record),
              slugReused: false
            },
            201
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : "failed to create collection";
          if (/collections\.slug|UNIQUE constraint failed: collections\.slug/i.test(message)) {
            return badRequest(
              "Collection URL slug is already in use. Choose a different collection name."
            );
          }
          return serverError(message);
        }
      }
      return jsonResponse({ error: "Method not allowed" }, 405);
    }, "onRequest");
  }
});

// warm.ts
var CORE, MAX_IDS, onRequest32;
var init_warm = __esm({
  "warm.ts"() {
    "use strict";
    init_functionsRoutes_0_03405564948503348();
    init_content();
    CORE = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3";
    MAX_IDS = 5;
    onRequest32 = /* @__PURE__ */ __name(async ({ request, env, waitUntil }) => {
      const url = new URL(request.url);
      const idsParam = (url.searchParams.get("ids") || "").split(",").map((value) => value.trim()).filter((value) => /^\d+$/.test(value)).slice(0, MAX_IDS);
      const auto = Math.min(3, Math.max(0, Number(url.searchParams.get("auto") || "0") || 0));
      const ids = [...idsParam];
      if (auto > 0 && ids.length < MAX_IDS) {
        const RECENT_WINDOW = 200;
        const FLOOR = 900;
        for (let index = 0; index < auto; index += 1) {
          ids.push(String(FLOOR + Math.floor(Math.random() * RECENT_WINDOW)));
        }
      }
      if (!ids.length) {
        return new Response(JSON.stringify({ error: "pass ?ids=1065,1101 or ?auto=2" }), {
          status: 400,
          headers: { "content-type": "application/json" }
        });
      }
      const wait3 = waitUntil ?? (() => {
      });
      for (const tokenId of ids) {
        const internal = new URL("https://internal/runtime/content");
        internal.searchParams.set("contractId", CORE);
        internal.searchParams.set("tokenId", tokenId);
        internal.searchParams.set("network", "mainnet");
        wait3(
          onRequest3({
            request: new Request(internal.toString()),
            env,
            waitUntil: wait3
          }).then((response) => response.body?.cancel()).catch(() => void 0)
        );
      }
      return new Response(JSON.stringify({ warming: ids }), {
        status: 202,
        headers: { "content-type": "application/json", "cache-control": "no-store" }
      });
    }, "onRequest");
  }
});

// ../.wrangler/tmp/pages-TAkebc/functionsRoutes-0.03405564948503348.mjs
var routes;
var init_functionsRoutes_0_03405564948503348 = __esm({
  "../.wrangler/tmp/pages-TAkebc/functionsRoutes-0.03405564948503348.mjs"() {
    "use strict";
    init_path();
    init_path2();
    init_tokenId();
    init_contract();
    init_contract2();
    init_asset_preview();
    init_assets();
    init_fee_guidance2();
    init_oversight();
    init_publish();
    init_readiness();
    init_reserve();
    init_upload_url();
    init_path3();
    init_path4();
    init_gallery_cache();
    init_gallery_cache();
    init_gallery_cache();
    init_attest_score();
    init_health();
    init_page();
    init_allowlist();
    init_spot();
    init_cache_purge();
    init_content();
    init_collectionId();
    init_tokenId2();
    init_contract3();
    init_tokenId3();
    init_path5();
    init_path6();
    init_path7();
    init_path8();
    init_collections2();
    init_warm();
    routes = [
      {
        routePath: "/runtime/modules/:network/:contractAddress/:contractName/:entryTokenId/:path*",
        mountPath: "/runtime/modules/:network/:contractAddress/:contractName/:entryTokenId",
        method: "",
        middlewares: [],
        modules: [onRequest]
      },
      {
        routePath: "/runtime/modules/:network/:contractAddress/:contractName/:path*",
        mountPath: "/runtime/modules/:network/:contractAddress/:contractName",
        method: "",
        middlewares: [],
        modules: [onRequest2]
      },
      {
        routePath: "/inscription/:network/:contractAddress/:contractName/:tokenId",
        mountPath: "/inscription/:network/:contractAddress/:contractName",
        method: "",
        middlewares: [],
        modules: [onRequest4]
      },
      {
        routePath: "/index/dependents/:contract",
        mountPath: "/index/dependents",
        method: "",
        middlewares: [],
        modules: [onRequest5]
      },
      {
        routePath: "/index/relations/:contract",
        mountPath: "/index/relations",
        method: "",
        middlewares: [],
        modules: [onRequest6]
      },
      {
        routePath: "/collections/:collectionId/asset-preview",
        mountPath: "/collections/:collectionId",
        method: "",
        middlewares: [],
        modules: [onRequest7]
      },
      {
        routePath: "/collections/:collectionId/assets",
        mountPath: "/collections/:collectionId",
        method: "",
        middlewares: [],
        modules: [onRequest8]
      },
      {
        routePath: "/collections/:collectionId/fee-guidance",
        mountPath: "/collections/:collectionId",
        method: "",
        middlewares: [],
        modules: [onRequest9]
      },
      {
        routePath: "/collections/:collectionId/oversight",
        mountPath: "/collections/:collectionId",
        method: "",
        middlewares: [],
        modules: [onRequest10]
      },
      {
        routePath: "/collections/:collectionId/publish",
        mountPath: "/collections/:collectionId",
        method: "",
        middlewares: [],
        modules: [onRequest11]
      },
      {
        routePath: "/collections/:collectionId/readiness",
        mountPath: "/collections/:collectionId",
        method: "",
        middlewares: [],
        modules: [onRequest12]
      },
      {
        routePath: "/collections/:collectionId/reserve",
        mountPath: "/collections/:collectionId",
        method: "",
        middlewares: [],
        modules: [onRequest13]
      },
      {
        routePath: "/collections/:collectionId/upload-url",
        mountPath: "/collections/:collectionId",
        method: "",
        middlewares: [],
        modules: [onRequest14]
      },
      {
        routePath: "/bnsv2/:network/:path*",
        mountPath: "/bnsv2/:network",
        method: "",
        middlewares: [],
        modules: [onRequest15]
      },
      {
        routePath: "/hiro/:network/:path*",
        mountPath: "/hiro/:network",
        method: "",
        middlewares: [],
        modules: [onRequest16]
      },
      {
        routePath: "/api/gallery-cache",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet]
      },
      {
        routePath: "/api/gallery-cache",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions]
      },
      {
        routePath: "/api/gallery-cache",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost]
      },
      {
        routePath: "/arcade/attest-score",
        mountPath: "/arcade",
        method: "",
        middlewares: [],
        modules: [onRequest17]
      },
      {
        routePath: "/collections/health",
        mountPath: "/collections",
        method: "",
        middlewares: [],
        modules: [onRequest18]
      },
      {
        routePath: "/index/page",
        mountPath: "/index",
        method: "",
        middlewares: [],
        modules: [onRequest19]
      },
      {
        routePath: "/manage/allowlist",
        mountPath: "/manage",
        method: "",
        middlewares: [],
        modules: [onRequest20]
      },
      {
        routePath: "/prices/spot",
        mountPath: "/prices",
        method: "",
        middlewares: [],
        modules: [onRequest21]
      },
      {
        routePath: "/runtime/cache-purge",
        mountPath: "/runtime",
        method: "",
        middlewares: [],
        modules: [onRequest22]
      },
      {
        routePath: "/runtime/content",
        mountPath: "/runtime",
        method: "",
        middlewares: [],
        modules: [onRequest3]
      },
      {
        routePath: "/collections/:collectionId",
        mountPath: "/collections",
        method: "",
        middlewares: [],
        modules: [onRequest23]
      },
      {
        routePath: "/i/:tokenId",
        mountPath: "/i",
        method: "",
        middlewares: [],
        modules: [onRequest24]
      },
      {
        routePath: "/index/:contract",
        mountPath: "/index",
        method: "",
        middlewares: [],
        modules: [onRequest25]
      },
      {
        routePath: "/inscription/:tokenId",
        mountPath: "/inscription",
        method: "",
        middlewares: [],
        modules: [onRequest26]
      },
      {
        routePath: "/explorer/:path*",
        mountPath: "/explorer",
        method: "",
        middlewares: [],
        modules: [onRequest27]
      },
      {
        routePath: "/g/:path*",
        mountPath: "/g",
        method: "",
        middlewares: [],
        modules: [onRequest28]
      },
      {
        routePath: "/rpc-testnet/:path*",
        mountPath: "/rpc-testnet",
        method: "",
        middlewares: [],
        modules: [onRequest29]
      },
      {
        routePath: "/rpc/:path*",
        mountPath: "/rpc",
        method: "",
        middlewares: [],
        modules: [onRequest30]
      },
      {
        routePath: "/collections",
        mountPath: "/",
        method: "",
        middlewares: [],
        modules: [onRequest31]
      },
      {
        routePath: "/warm",
        mountPath: "/",
        method: "",
        middlewares: [],
        modules: [onRequest32]
      }
    ];
  }
});

// ../node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_03405564948503348();

// ../node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_03405564948503348();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod2 = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod2);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
/*! Bundled license information:

@noble/hashes/esm/utils.js:
@noble/hashes/utils.js:
@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/secp256k1/lib/esm/index.js:
  (*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)
*/
