import { describe, expect, it } from 'vitest';
import {
  addressEnvName,
  exampleEnvTemplate,
  generateFleet,
  generateWizardKey,
  keyEnvName,
  keyFromMnemonic,
  WIZARD_DERIVATION_PATH
} from '../make-wizards.mjs';
import { PERSONA_IDS } from '../personas.mjs';

/** Deterministic stand-in for randomBytes, so the shape can be asserted. */
const fixedRandom = (seed: number) => (length: number) =>
  Buffer.from(Array.from({ length }, (_, index) => (seed + index) % 256));

describe('wizard wallet generation', () => {
  it('makes a compressed mainnet key and its address', () => {
    const { privateKey, address } = generateWizardKey(fixedRandom(1) as never);
    expect(privateKey).toMatch(/^[0-9a-f]{64}01$/);
    expect(privateKey).toHaveLength(66);
    expect(address.startsWith('SP')).toBe(true);
  });

  it('makes a 12-word recovery phrase alongside the key', () => {
    const { mnemonic } = generateWizardKey(fixedRandom(1) as never);
    expect(mnemonic.split(' ')).toHaveLength(12);
  });

  it('the phrase re-derives exactly the key and address it was issued with', () => {
    // The whole point of the phrase: a wizard must be recoverable from it alone
    // after the key has scrolled out of a terminal.
    const issued = generateWizardKey(fixedRandom(7) as never);
    const recovered = keyFromMnemonic(issued.mnemonic);
    expect(recovered.privateKey).toBe(issued.privateKey);
    expect(recovered.address).toBe(issued.address);
  });

  it('derives at the standard first-account path so wallets can import it', () => {
    expect(WIZARD_DERIVATION_PATH).toBe("m/44'/5757'/0'/0/0");
  });

  it('gives every wizard a distinct phrase', () => {
    const phrases = generateFleet().map((wizard) => wizard.mnemonic);
    expect(new Set(phrases).size).toBe(3);
  });

  it('makes one wallet per wizard, all distinct', () => {
    const fleet = generateFleet();
    expect(fleet.map((wizard) => wizard.id)).toEqual(PERSONA_IDS);
    expect(new Set(fleet.map((wizard) => wizard.privateKey)).size).toBe(3);
    expect(new Set(fleet.map((wizard) => wizard.address)).size).toBe(3);
    for (const wizard of fleet) {
      expect(wizard.keyEnv).toBe(keyEnvName(wizard.id));
      expect(wizard.addressEnv).toBe(addressEnvName(wizard.id));
      expect(wizard.address.startsWith('SP')).toBe(true);
    }
  });

  it('never repeats a key across runs', () => {
    const first = generateFleet().map((wizard) => wizard.privateKey);
    const second = generateFleet().map((wizard) => wizard.privateKey);
    expect(first.some((key) => second.includes(key))).toBe(false);
  });
});

describe('.env.wizards.example template', () => {
  const template = exampleEnvTemplate();

  it('contains placeholders only, never key material', () => {
    expect(template).not.toMatch(/=[0-9a-f]{64}01\b/);
    expect(template).not.toMatch(/=SP[0-9A-Z]{38,}/);
    for (const id of PERSONA_IDS) {
      expect(template).toContain(`${keyEnvName(id)}=REPLACE_WITH_`);
      expect(template).toContain(`${addressEnvName(id)}=REPLACE_WITH_`);
    }
  });

  it('is deterministic, so committing it does not churn', () => {
    expect(exampleEnvTemplate()).toBe(template);
  });

  it('documents the safety rails and the kill switch', () => {
    expect(template).toContain('WIZARD_SPEND_CAP_USTX=500000');
    expect(template).toContain('WIZARD_BALANCE_FLOOR_USTX=1000000');
    expect(template).toContain('WIZARD_MAX_TX_FEE_USTX=30000');
    expect(template).toContain('WIZARD_KILL_SWITCH=0');
    expect(template).toContain('gitignored');
  });
});
