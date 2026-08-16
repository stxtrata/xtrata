/**
 * Independence check on the BIP-32 layer.
 *
 * DeOrganized proposed this as a shared gate (builds-with-xtrata#11): neither
 * side ships until the two derivations are checked against each other. Their
 * framing of the seam is right and worth restating, because it decides what is
 * actually comparable.
 *
 * Above the mnemonic the two designs diverge BY DESIGN and should not be
 * reconciled:
 *
 *   theirs  PRF -> HKDF -> entropy -> mnemonic   (deterministic, nothing stored)
 *   ours    random mnemonic, PRF-derived key encrypts the seed (ciphertext stored)
 *
 * Below the mnemonic there is exactly one correct answer, and that is what this
 * file pins: given the same BIP-39 phrase, both sides must produce the same
 * Stacks address. If that ever diverges, one of us strands funds in an account
 * the user cannot see.
 *
 * The verifier is @stacks/wallet-sdk, which shares no code with seed.ts, so this
 * is an independence check rather than a self-consistency one.
 *
 * All phrases below are published BIP-39 test material. Never fund an address
 * derived from them.
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateWallet } from '@stacks/wallet-sdk';
import { accountFromMnemonic, derivationPath } from '../seed';

/**
 * DeOrganized's published vectors, vendored so this runs offline and so a
 * change on their side shows up here as a deliberate update rather than a
 * silent drift.
 *
 * Source: DeOrganized/stacks-passkey-wallet @ 03f19fb, test/vectors/
 * Synthetic material by their own warning. Never fund an address derived here.
 */
const DEORGANIZED = JSON.parse(
  readFileSync(new URL('./fixtures/deorganized-derivation.vectors.json', import.meta.url), 'utf8')
) as {
  salt: string;
  hkdf: { info: string };
  vectors: Array<{
    name: string;
    mnemonic: string;
    stacks: { path: string; address: string };
  }>;
};

/** Published BIP-39 vectors. Synthetic, universally known, never to be funded. */
const VECTORS = [
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  'legal winner thank year wave sausage worth useful legal winner thank yellow',
  'letter advice cage absurd amount doctor acoustic avoid letter advice cage above',
  [
    'abandon abandon abandon abandon abandon abandon abandon abandon',
    'abandon abandon abandon abandon abandon abandon abandon abandon',
    'abandon abandon abandon abandon abandon abandon abandon art'
  ].join(' ')
];

describe('BIP-32 layer agrees with an independent implementation', () => {
  it('uses the Stacks path both sides declare', () => {
    expect(derivationPath(0)).toBe("m/44'/5757'/0'/0/0");
    expect(derivationPath(3)).toBe("m/44'/5757'/3'/0/0");
  });

  for (const phrase of VECTORS) {
    const label = `${phrase.split(' ').length}w "${phrase.split(' ').slice(0, 2).join(' ')}…"`;

    it(`derives the same mainnet address as @stacks/wallet-sdk for ${label}`, async () => {
      const ours = await accountFromMnemonic(phrase, 'mainnet', 0);
      const wallet = await generateWallet({ secretKey: phrase, password: '' });
      const theirs = wallet.accounts[0];

      // wallet-sdk hands back the raw key; ours carries the `01` compressed
      // suffix Stacks expects. Compare the 32-byte scalar, which is the thing
      // BIP-32 actually determines.
      expect(ours.privateKey).toMatch(/^[0-9a-f]{64}01$/);
      expect(ours.privateKey.slice(0, 64)).toBe(theirs.stxPrivateKey.slice(0, 64));
    });

    it(`derives a stable, network-correct address for ${label}`, async () => {
      const mainnet = await accountFromMnemonic(phrase, 'mainnet', 0);
      const testnet = await accountFromMnemonic(phrase, 'testnet', 0);

      expect(mainnet.address).toMatch(/^SP[0-9A-Z]{38,40}$/);
      expect(testnet.address).toMatch(/^ST[0-9A-Z]{38,40}$/);
      // Same key, different version byte. A mismatch here means the network
      // argument is being ignored.
      expect(mainnet.address).not.toBe(testnet.address);

      const again = await accountFromMnemonic(phrase, 'mainnet', 0);
      expect(again.address).toBe(mainnet.address);
    });
  }

  it('account index actually moves the account', async () => {
    const [a, b] = await Promise.all([
      accountFromMnemonic(VECTORS[0], 'mainnet', 0),
      accountFromMnemonic(VECTORS[0], 'mainnet', 1)
    ]);
    expect(a.address).not.toBe(b.address);
    expect(b.path).toBe("m/44'/5757'/1'/0/0");
  });

  it('rejects a phrase with a broken checksum rather than deriving from it', async () => {
    const broken = VECTORS[0].replace(/about$/, 'abandon');
    await expect(accountFromMnemonic(broken, 'mainnet', 0)).rejects.toThrow(/not a valid BIP39/);
  });
});

describe('the shared gate: our derivation vs DeOrganized published vectors', () => {
  it('agrees on the Stacks path', () => {
    for (const v of DEORGANIZED.vectors) {
      expect(v.stacks.path).toBe(derivationPath(0));
    }
  });

  for (const v of DEORGANIZED.vectors) {
    it(`derives their published address for "${v.name}"`, async () => {
      const ours = await accountFromMnemonic(v.mnemonic, 'mainnet', 0);
      expect(ours.address).toBe(v.stacks.address);
    });
  }

  it('their salt universe is deliberately not ours, and that is fine', () => {
    // Above the mnemonic the designs diverge on purpose: they derive entropy
    // from the PRF, we encrypt a random seed with a PRF-derived key. Different
    // constants are expected. Asserted so nobody later "fixes" the mismatch.
    expect(DEORGANIZED.salt).toBe('stacks-passkey-wallet/v1');
    expect(DEORGANIZED.hkdf.info).toBe('stacks-passkey-wallet/bip39-entropy/v1');
  });
});
