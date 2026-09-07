// The cryptography the scanner needs, and nothing else.
//
// Bundled into the standalone page so it has no CDN, no network dependency for
// its own code, and nothing that can rot or be swapped underneath it. The whole
// point of a page you paste a seed into is that you can read what it does; a
// script tag pointing somewhere else defeats that completely.
//
// EVERYTHING HERE IS READ-ONLY BY CONSTRUCTION. There is no signer, no
// transaction builder and no broadcaster in this bundle - not disabled, absent.
// A page that can derive an address cannot spend from it unless somebody also
// ships the code to sign, and that code is deliberately not here.

import { validateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { HDKey } from '@scure/bip32';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { sha256 } from '@noble/hashes/sha256';
import { bech32 } from '@scure/base';
import { secp256k1 } from '@noble/curves/secp256k1.js';
import { c32address } from 'c32check';

/** Mainnet single-signature standard principal. */
const STACKS_MAINNET_P2PKH = 22;

const hash160 = (bytes) => ripemd160(sha256(bytes));

/**
 * Bytes to hex without Buffer.
 *
 * `Buffer` is a Node global and does not exist in a browser. Using it here
 * produced a bundle that derived perfectly under test and threw the moment it
 * ran in the page it was built for - which is the worst possible place for that
 * difference to show up.
 */
const toHex = (bytes) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

const fromHex = (hex) =>
  Uint8Array.from(hex.match(/.{2}/g) ?? [], (pair) => parseInt(pair, 16));

/** A compressed public key -> a Stacks principal. */
export function stacksAddress(publicKey) {
  return c32address(STACKS_MAINNET_P2PKH, toHex(hash160(publicKey)));
}

/** A compressed public key -> a native segwit (P2WPKH) Bitcoin address. */
export function btcAddress(publicKey) {
  return bech32.encode('bc', [0, ...bech32.toWords(hash160(publicKey))]);
}

/**
 * Both Stacks conventions, Leather's first.
 *
 * Leather and Hiro put the account index last; the other shape hardens it. Both
 * are searched because both exist in the wild, and account 0 is the same address
 * under either - which is exactly enough to make a wrong choice look verified.
 */
export const STACKS_PATHS = [
  { name: 'leather', path: (n) => `m/44'/5757'/0'/0/${n}`, label: (n) => `Account ${n + 1}` },
  { name: 'hardened', path: (n) => `m/44'/5757'/${n}'/0/0`, label: (n) => `hardened ${n}` }
];

/** Bitcoin, BIP84. A DIFFERENT shape from Stacks at the same account number. */
export const BTC_PATH = (n) => `m/84'/0'/${n}'/0/0`;

export function isPhrase(text) {
  return validateMnemonic(String(text).trim().replace(/\s+/g, ' '), wordlist);
}

/** 64 hex characters, optionally with the compression byte Stacks appends. */
export function isRawKey(text) {
  return /^[0-9a-fA-F]{64}(01)?$/.test(String(text).trim());
}

/**
 * Accounts from a phrase, or the single account a raw key represents.
 *
 * A raw private key IS one keypair. It has no tree under it, so there is nothing
 * to scan - saying so beats deriving a hundred addresses that cannot exist.
 */
export function accountsFrom(secret, from, count) {
  const text = String(secret).trim().replace(/\s+/g, ' ');

  if (isRawKey(text)) {
    if (from > 0) return [];
    const priv = text.slice(0, 64);
    // BYTES, not hex. noble takes a Uint8Array and refuses a string, which is
    // the sort of thing that only shows up on the one input path nobody used
    // while building it.
    const publicKey = secp256k1.getPublicKey(fromHex(priv), true);
    return [
      {
        index: 0,
        convention: 'raw key',
        account: 'the key itself',
        path: '(no derivation)',
        stacks: stacksAddress(publicKey),
        btc: btcAddress(publicKey)
      }
    ];
  }

  if (!validateMnemonic(text, wordlist)) {
    throw new Error(
      'That is not a valid recovery phrase or private key. A phrase is 12 or 24 ' +
        'lowercase words; a key is 64 hex characters. Nothing has been derived.'
    );
  }

  const root = HDKey.fromMasterSeed(mnemonicToSeedSync(text));
  const out = [];
  for (const shape of STACKS_PATHS) {
    for (let n = from; n < from + count; n++) {
      const node = root.derive(shape.path(n));
      if (!node.privateKey) continue;
      const stacks = stacksAddress(node.publicKey);
      // Bitcoin pairs with the Leather layout only. Pairing a hardened Stacks
      // account with a BIP84 account number would be an invention.
      let btc = null;
      if (shape.name === 'leather') {
        const bitcoin = root.derive(BTC_PATH(n));
        if (bitcoin.publicKey) btc = btcAddress(bitcoin.publicKey);
      }
      out.push({
        index: n,
        convention: shape.name,
        account: shape.label(n),
        path: shape.path(n),
        stacks,
        btc
      });
    }
  }
  return out;
}
