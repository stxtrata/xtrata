import { describe, expect, it } from 'vitest';
import { generateNewAccount, generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import { validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { TransactionVersion } from '@stacks/transactions';
import { deriveListeningIdentity } from '../derive';
import { accountFromMnemonic } from '../../wallet/passkey/seed';
import { derivePhraseSlot, isPhraseUserId, newPhraseUserId, PHRASE_ACCOUNTS_PATH, PHRASE_HKDF_INFO, phraseBase, phraseFromPrf } from '../phrase';

const PRF = Uint8Array.from({ length: 32 }, (_, i) => i);
const OTHER = Uint8Array.from({ length: 32 }, (_, i) => 255 - i);

// KNOWN ANSWERS. If one of these changes, every version 2 player has moved to an address its owner's written-down
// words do not open. Do not "fix" the expected values: find what changed in phrase.ts and undo it.
const KNOWN = {
  phrase: 'average unfold gather orchard afraid keep biology verb sadness merry dust worry tube inject tube method screen goose label minor minor crowd very oil',
  slot0: 'SP1SY289GQAHCH7JZ1MSS5VMPNPH8GEK2DPRKKJ6N',
  slot1: 'SP16538G41XMAGHYB0JZAP29R7YBSKDR569QP1SMF',
  slot7: 'SP2C4Q2RETTDCZRXDJXY6GZ7J5K5WXBETG2WGWYJK'
};

describe('players with a backup phrase (version 2 key)', () => {
  it('the labels and the path are locked', () => {
    expect(PHRASE_HKDF_INFO).toBe('xtrata-radio-listening-phrase-v2');
    expect(PHRASE_ACCOUNTS_PATH).toBe("m/44'/5757'/0'/0");
  });

  it('known answers: the same passkey secret always gives these 24 words and these addresses', async () => {
    const phrase = await phraseFromPrf(PRF);
    expect(phrase).toBe(KNOWN.phrase);
    expect(phrase.split(' ')).toHaveLength(24);
    expect(validateMnemonic(phrase, wordlist)).toBe(true);
    const base = await phraseBase(PRF);
    expect(derivePhraseSlot(base, 0).address).toBe(KNOWN.slot0);
    expect(derivePhraseSlot(base, 1).address).toBe(KNOWN.slot1);
    expect(derivePhraseSlot(base, 7).address).toBe(KNOWN.slot7);
  });

  it('the words open the same accounts in the Stacks wallet library that Leather and Xverse build on', async () => {
    const base = await phraseBase(PRF);
    let wallet = await generateWallet({ secretKey: await phraseFromPrf(PRF), password: 'x' });
    for (let n = 0; n < 4; n++) {
      if (n > 0) wallet = generateNewAccount(wallet);
      const theirs = wallet.accounts[n];
      const ours = derivePhraseSlot(base, n);
      expect(ours.address).toBe(getStxAddress({ account: theirs, transactionVersion: TransactionVersion.Mainnet }));
      expect(ours.privateKey).toBe(theirs.stxPrivateKey);
    }
    // And the player itself (slot 0) is the account the repo's own passkey wallet derives from the same words.
    expect((await accountFromMnemonic(await phraseFromPrf(PRF))).address).toBe(derivePhraseSlot(base, 0).address);
  });

  it('is unrelated to the version 1 wallet of the same passkey, and differs per passkey and per slot', async () => {
    const base = await phraseBase(PRF);
    const v1 = await deriveListeningIdentity(PRF);
    expect(derivePhraseSlot(base, 0).address).not.toBe(v1.address);
    expect(await phraseFromPrf(OTHER)).not.toBe(await phraseFromPrf(PRF));
    expect(new Set([0, 1, 2, 3].map((n) => derivePhraseSlot(base, n).address)).size).toBe(4);
  });

  it('refuses a short secret and a slot out of range, and a wiped base gives nothing', async () => {
    await expect(phraseFromPrf(new Uint8Array(16))).rejects.toThrow(/at least 32/);
    const base = await phraseBase(PRF);
    expect(() => derivePhraseSlot(base, -1)).toThrow(/not available/);
    expect(() => derivePhraseSlot(base, 100_001)).toThrow(/not available/);
    base.wipe();
    expect(() => derivePhraseSlot(base, 0)).toThrow();
  });

  it('a version 2 passkey is told apart by its public user id, never by chance', () => {
    const id = newPhraseUserId();
    expect(id).toMatch(/^[A-Za-z0-9_-]{27}$/);
    expect(isPhraseUserId(id)).toBe(true);
    expect(newPhraseUserId()).not.toBe(id);
    // A version 1 id is 16 random bytes (22 characters): never version 2, whatever its bytes.
    expect(isPhraseUserId('WE0CAAAAAAAAAAAAAAAAAA')).toBe(false);
    expect(isPhraseUserId('A'.repeat(27))).toBe(false);
    for (const bad of [undefined, null, '', 5, id + 'A', id.slice(1)]) expect(isPhraseUserId(bad)).toBe(false);
  });
});
