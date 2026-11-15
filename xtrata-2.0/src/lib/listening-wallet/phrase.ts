/**
 * Players with a backup phrase (version 2 of the listening wallet's key).
 *
 * A version 1 player (derive.ts) IS the passkey's secret: nothing to write down, and nothing that another wallet can
 * open. A version 2 player turns the same passkey secret into an ordinary 24-word BIP39 phrase and derives ordinary
 * Stacks accounts from it, exactly as Leather and Xverse do (`m/44'/5757'/0'/0/<account>`). So:
 *   - nothing is stored anywhere, as before: the same passkey always gives the same 24 words and the same addresses,
 *     and a passkey synced to another device opens the same player there;
 *   - the listener can write the words down inside the wallet box and open the same account in any Stacks wallet,
 *     with no help from Xtrata and without Xtrata ever seeing them.
 *
 * Slot n is account n of the phrase. Slot 0, the player itself, is "Account 1" in those wallets.
 *
 * Version 1 players are untouched: their labels and addresses (derive.ts) never change. Which version a passkey is
 * was fixed when it was made and is carried in its public user id (see `newPhraseUserId`).
 *
 * NEVER EDIT `PHRASE_HKDF_INFO`, the HKDF settings or the path. Changing any of them moves every version 2 player to
 * an address its owner's written-down words do not open. The known-answer test locks them.
 */
import { HDKey } from '@scure/bip32';
import { entropyToMnemonic, mnemonicToSeed } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { getAddressFromPrivateKey, publicKeyToString, pubKeyfromPrivKey, TransactionVersion } from '@stacks/transactions';
import { isSlot, ListeningKeyError, type ListeningIdentity } from './derive';

/** HKDF domain separator for the phrase's entropy. Distinct from every version 1 label. */
export const PHRASE_HKDF_INFO = 'xtrata-radio-listening-phrase-v2';
/** Where Stacks wallets keep their accounts: account n is child n of this node. */
export const PHRASE_ACCOUNTS_PATH = "m/44'/5757'/0'/0";
const MIN_PRF_BYTES = 32;

const toHex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** The 24 words for this passkey secret. A string cannot be wiped: build it only when it is about to be used or shown. */
export async function phraseFromPrf(prfOutput: Uint8Array): Promise<string> {
  if (prfOutput.length < MIN_PRF_BYTES)
    throw new ListeningKeyError('PRF_TOO_SHORT', `Passkey returned ${prfOutput.length} bytes; at least ${MIN_PRF_BYTES} are required.`);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new ListeningKeyError('NO_CRYPTO', 'This browser cannot derive the listening wallet.');
  const key = await subtle.importKey('raw', prfOutput as unknown as BufferSource, 'HKDF', false, ['deriveBits']);
  const entropy = new Uint8Array(await subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: new TextEncoder().encode(PHRASE_HKDF_INFO) }, key, 256));
  try { return entropyToMnemonic(entropy, wordlist); } finally { entropy.fill(0); }
}

/** The accounts node of a version 2 player, held in the wallet origin's memory while unlocked. `wipe()` on lock. */
export interface PhraseBase { readonly accounts: HDKey; wipe(): void }

export async function phraseBase(prfOutput: Uint8Array): Promise<PhraseBase> {
  const seed = await mnemonicToSeed(await phraseFromPrf(prfOutput));
  let master: HDKey | undefined;
  try {
    master = HDKey.fromMasterSeed(seed);
    const accounts = master.derive(PHRASE_ACCOUNTS_PATH);
    return { accounts, wipe: () => { try { accounts.wipePrivateData(); } catch { /* already wiped */ } } };
  } finally {
    seed.fill(0);
    try { master?.wipePrivateData(); } catch { /* nothing to wipe */ }
  }
}

/** Account `slot` of the phrase: an ordinary mainnet Stacks account. */
export function derivePhraseSlot(base: PhraseBase, slot: number): ListeningIdentity {
  if (!isSlot(slot)) throw new ListeningKeyError('SLOT_OUT_OF_RANGE', 'That wallet number is not available.');
  const child = base.accounts.deriveChild(slot);
  try {
    if (!child.privateKey) throw new ListeningKeyError('KEY_OUT_OF_RANGE', 'This passkey produced an unusable key. Create a new listening wallet.');
    const privateKey = toHex(child.privateKey) + '01';
    return { privateKey, publicKey: publicKeyToString(pubKeyfromPrivKey(privateKey)), address: getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet) };
  } finally {
    try { child.wipePrivateData(); } catch { /* nothing to wipe */ }
  }
}

// ---- which version a passkey is: carried in its public user id, fixed when the passkey is made ----
// A version 1 passkey's user id is 16 random bytes. A version 2 one is these four bytes and then 16 random bytes, so
// the two can never be mistaken for each other, on any device, with no record needed.
const PHRASE_ID_PREFIX = [0x58, 0x4d, 0x02, 0x00];
const b64u = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));

/** A fresh public user id for a version 2 passkey (base64url, 27 characters). `random`: its 16 random bytes, when the caller needs them too. */
export function newPhraseUserId(random: Uint8Array = crypto.getRandomValues(new Uint8Array(16))): string {
  if (random.length !== 16) throw new Error('A passkey user id needs 16 random bytes.');
  const id = new Uint8Array(20);
  id.set(PHRASE_ID_PREFIX);
  id.set(random, 4);
  return b64u(id);
}

/** `count` words from the standard list that are none of `not`, for the "which word did you write down?" check. */
export function decoyWords(count: number, not: readonly string[]): string[] {
  const out: string[] = [];
  const pick = new Uint32Array(1);
  while (out.length < count) {
    crypto.getRandomValues(pick);
    const w = wordlist[pick[0] % wordlist.length];
    if (!not.includes(w) && !out.includes(w)) out.push(w);
  }
  return out;
}
export function isPhraseUserId(userId: unknown): boolean {
  if (typeof userId !== 'string' || !/^[A-Za-z0-9_-]{27}$/.test(userId)) return false;
  try { const b = unb64u(userId); return b.length === 20 && PHRASE_ID_PREFIX.every((v, i) => b[i] === v); } catch { return false; }
}
