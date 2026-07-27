import { describe, expect, it } from 'vitest';
import {
  SeedError,
  accountFromMnemonic,
  createMnemonic,
  deriveAccount,
  derivationPath,
  isValidMnemonic,
  mnemonicToSeedBytes,
  normaliseMnemonic
} from '../seed';

/** Standard BIP39 all-zero-entropy vector. Public and worthless — never fund it. */
const TEST_MNEMONIC =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon ' +
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

describe('passkey wallet seed', () => {
  describe('createMnemonic', () => {
    it('produces 24 valid words', () => {
      const m = createMnemonic();
      expect(m.split(' ')).toHaveLength(24);
      expect(isValidMnemonic(m)).toBe(true);
    });

    it('does not repeat itself', () => {
      expect(createMnemonic()).not.toBe(createMnemonic());
    });
  });

  describe('normaliseMnemonic', () => {
    it('collapses whitespace, trims and lowercases', () => {
      expect(normaliseMnemonic('  Abandon   ABANDON\nart ')).toBe('abandon abandon art');
    });
  });

  describe('isValidMnemonic', () => {
    it('accepts 24 and 12 word phrases', () => {
      expect(isValidMnemonic(TEST_MNEMONIC)).toBe(true);
      expect(isValidMnemonic('abandon '.repeat(11) + 'about')).toBe(true);
    });

    it('accepts phrases needing normalisation', () => {
      expect(isValidMnemonic(`  ${TEST_MNEMONIC.toUpperCase()}  `)).toBe(true);
    });

    it('rejects a wrong word count', () => {
      expect(isValidMnemonic('abandon abandon art')).toBe(false);
    });

    // The checksum is what catches a single mistyped word.
    it('rejects a bad checksum', () => {
      expect(isValidMnemonic(TEST_MNEMONIC.replace(/art$/, 'zoo'))).toBe(false);
    });

    it('rejects words outside the wordlist', () => {
      expect(isValidMnemonic(TEST_MNEMONIC.replace(/art$/, 'xtrata'))).toBe(false);
    });
  });

  describe('derivationPath', () => {
    // Must match scripts/mainnet-deploy-contract.mjs, or an imported seed lands
    // on a different address in Xverse and the funds look lost.
    it('is the account-hardened Xverse-style path', () => {
      expect(derivationPath(0)).toBe("m/44'/5757'/0'/0/0");
      expect(derivationPath(3)).toBe("m/44'/5757'/3'/0/0");
    });
  });

  describe('deriveAccount', () => {
    // Known-answer locks. If these change, every existing passkey wallet has
    // been silently relocated to an address its owner cannot reach.
    it('derives the expected mainnet address', async () => {
      const acct = await accountFromMnemonic(TEST_MNEMONIC, 'mainnet', 0);
      expect(acct.address).toBe('SP1JAHE8GEHB0MCBGR8J6W0AA7TJEE1XKFTFJMQ5W');
      expect(acct.path).toBe("m/44'/5757'/0'/0/0");
    });

    it('derives the expected testnet address', async () => {
      const acct = await accountFromMnemonic(TEST_MNEMONIC, 'testnet', 0);
      expect(acct.address).toBe('ST1JAHE8GEHB0MCBGR8J6W0AA7TJEE1XKFSD2Q80H');
    });

    it('honours the account index', async () => {
      const acct = await accountFromMnemonic(TEST_MNEMONIC, 'mainnet', 3);
      expect(acct.address).toBe('SP3R9A1TB2PQTFQ46SEQCYN15YZXJ4430WZ67J0J7');
    });

    it('emits a compressed-key suffix Stacks accepts', async () => {
      const { privateKey } = await accountFromMnemonic(TEST_MNEMONIC, 'mainnet', 0);
      expect(privateKey).toHaveLength(66);
      expect(privateKey.endsWith('01')).toBe(true);
    });

    it('is deterministic', async () => {
      const a = await accountFromMnemonic(TEST_MNEMONIC, 'mainnet', 0);
      const b = await accountFromMnemonic(TEST_MNEMONIC, 'mainnet', 0);
      expect(a).toEqual(b);
    });

    it('gives different accounts for different indexes', async () => {
      const a = await accountFromMnemonic(TEST_MNEMONIC, 'mainnet', 0);
      const b = await accountFromMnemonic(TEST_MNEMONIC, 'mainnet', 1);
      expect(a.address).not.toBe(b.address);
    });

    it('is unaffected by casing and spacing of the input phrase', async () => {
      const clean = await accountFromMnemonic(TEST_MNEMONIC, 'mainnet', 0);
      const messy = await accountFromMnemonic(`  ${TEST_MNEMONIC.toUpperCase()}\n`, 'mainnet', 0);
      expect(messy.address).toBe(clean.address);
    });
  });

  describe('mnemonicToSeedBytes', () => {
    it('rejects an invalid phrase rather than deriving a wrong wallet', async () => {
      await expect(mnemonicToSeedBytes('not a real phrase at all')).rejects.toThrow(SeedError);
      await expect(mnemonicToSeedBytes(TEST_MNEMONIC.replace(/art$/, 'zoo'))).rejects.toMatchObject({
        code: 'INVALID_MNEMONIC'
      });
    });

    it('produces 64-byte BIP39 seeds', async () => {
      expect((await mnemonicToSeedBytes(TEST_MNEMONIC)).length).toBe(64);
    });
  });

  // A wiped seed must not still derive the account — proves callers really can
  // zero their buffers and that nothing is cached behind their back.
  it('does not derive a live account from a zeroed seed', async () => {
    const seed = await mnemonicToSeedBytes(TEST_MNEMONIC);
    const before = deriveAccount(seed, 'mainnet', 0);
    seed.fill(0);
    expect(deriveAccount(seed, 'mainnet', 0).address).not.toBe(before.address);
  });
});
