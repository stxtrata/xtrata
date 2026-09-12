// adapter.ts
import { deserializeTransaction, PostConditionMode as PostConditionMode2, AuthType as AuthType2, PayloadType, addressToString as addressToString2, emptyMessageSignature, isSingleSig } from "@stacks/transactions";

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

// upstream/src/derivation/seed.ts
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";
import { entropyToMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { HDKey } from "@scure/bip32";
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

// upstream/src/derivation/stacks.ts
import { bytesToHex } from "@noble/hashes/utils.js";
import { getAddressFromPrivateKey } from "@stacks/transactions";

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
  const address = getAddressFromPrivateKey(privateKeyHex, network);
  return { address, path: STACKS_PATH };
}

// upstream/src/derivation/bitcoin.ts
import * as btc from "@scure/btc-signer";
function deriveBitcoinAccount(root, network = "mainnet") {
  const path = bitcoinNativeSegwitPath(0, network);
  const node = root.derive(path);
  if (!node.publicKey) {
    throw new KeyDerivationError("Bitcoin derivation produced no public key");
  }
  const encoder = network === "testnet" ? btc.TEST_NETWORK : btc.NETWORK;
  const payment = btc.p2wpkh(node.publicKey, encoder);
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
import { sha256 as sha2562 } from "@noble/hashes/sha2.js";
import { bytesToHex as bytesToHex2, concatBytes, utf8ToBytes as utf8ToBytes2 } from "@noble/hashes/utils.js";
import {
  AuthType,
  PostConditionMode,
  TransactionSigner,
  addressFromVersionHash,
  addressHashModeToVersion,
  addressToString,
  deriveNetworkFromTx,
  getAddressFromPrivateKey as getAddressFromPrivateKey2,
  privateKeyToPublic,
  publicKeyFromSignatureRsv,
  signMessageHashRsv
} from "@stacks/transactions";
function stacksPrivateKeyHex(root) {
  const node = root.derive(STACKS_PATH);
  if (!node.privateKey) throw new KeyDerivationError("Stacks signing key unavailable");
  return `${bytesToHex2(node.privateKey)}01`;
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
  const derivedAddress = getAddressFromPrivateKey2(privateKey, network);
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
  const publicKey = typeof pub === "string" ? pub : bytesToHex2(pub);
  const bytes = transaction.serializeBytes();
  if (transaction.auth.authType === AuthType.Sponsored) {
    return { kind: "origin-signed", transaction: bytes, publicKey };
  }
  return { kind: "complete", transaction: bytes, txid: transaction.txid(), publicKey };
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

// adapter.ts
var TESTNET_CONTRACT = "ST7KN0NNFMEJVKD8AX54QSZ71GA9Q6HY8T1BFHK3.xtrata-v3-2-5-test1";
var hex = (b) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
function readReviewedTransaction(unsignedHex, policy) {
  if (typeof unsignedHex !== "string" || !/^(?:[0-9a-f]{2})+$/i.test(unsignedHex) || unsignedHex.length > 12e5) throw Error("Invalid transaction encoding.");
  if (unsignedHex !== policy.expectedUnsignedHex) throw Error("Transaction differs from the reviewed bytes.");
  const tx = deserializeTransaction(unsignedHex);
  if (tx.transactionVersion !== 128 || tx.chainId !== 2147483648) throw Error("Only the Stacks Testnet chain is permitted.");
  if (tx.postConditionMode !== PostConditionMode2.Deny) throw Error("Deny-mode spending protection is required.");
  if (tx.payload.payloadType !== PayloadType.ContractCall) throw Error("Only reviewed contract calls are permitted.");
  const contract = addressToString2(tx.payload.contractAddress) + "." + tx.payload.contractName.content;
  if (contract !== TESTNET_CONTRACT || contract !== policy.contractId || !policy.functionNames.includes(tx.payload.functionName.content)) throw Error("Contract or function is outside the approved scope.");
  if (!isSingleSig(tx.auth.spendingCondition) || tx.auth.spendingCondition.signature.data !== emptyMessageSignature().data) throw Error("Expected an unsigned single-signature origin.");
  if (tx.auth.spendingCondition.fee > policy.maxMinerFee) throw Error("Miner fee exceeds the approved ceiling.");
  if (tx.auth.authType === AuthType2.Sponsored && tx.auth.spendingCondition.fee !== 0n) throw Error("Sponsored origin fee must be zero; the sponsor pays its separately approved fee.");
  return tx;
}
function signReviewed(prfBytes, unsignedHex, policy) {
  try {
    const tx = readReviewedTransaction(unsignedHex, policy);
    const result = signStacksTransaction(prfBytes, tx);
    const transactionHex = hex(result.transaction);
    const signed = deserializeTransaction(result.transaction);
    signed.verifyOrigin();
    const normalized = deserializeTransaction(result.transaction);
    if (!isSingleSig(normalized.auth.spendingCondition)) throw Error("Unexpected multisig result.");
    normalized.auth.spendingCondition.signature = emptyMessageSignature();
    if (hex(normalized.serializeBytes()) !== unsignedHex.toLowerCase()) throw Error("Signer changed the reviewed transaction.");
    if (result.kind === "origin-signed") return { kind: "origin-signed", transactionHex, publicKey: result.publicKey };
    return { kind: "complete", transactionHex, txid: result.txid, publicKey: result.publicKey };
  } finally {
    prfBytes.fill(0);
  }
}
function publicAccount(prf) {
  try {
    return deriveAddresses(prf, { network: "testnet" }).stacks;
  } finally {
    prf.fill(0);
  }
}
export {
  TESTNET_CONTRACT,
  publicAccount,
  readReviewedTransaction,
  signReviewed
};
