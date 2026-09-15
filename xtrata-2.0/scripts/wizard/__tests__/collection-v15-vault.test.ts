import { describe, it, expect } from 'vitest';
import { encryptWizard, decryptWizard, assertBudget } from '../collection-v15-vault.mjs';
describe('dedicated collection wizard vault and caps', () => {
  it('encrypts and authenticates secrets with fresh randomness', () => {
    const password='test passphrase not a real secret';
    const first=encryptWizard('fake-test-key',password), second=encryptWizard('fake-test-key',password);
    expect(JSON.stringify(first)).not.toContain('fake-test-key');
    expect(first.data).not.toEqual(second.data);
    expect(decryptWizard(first,password)).toBe('fake-test-key');
    expect(()=>decryptWizard(first,'wrong passphrase')).toThrow();
    expect(()=>decryptWizard({...first,data:'00'.repeat(first.data.length/2)},password)).toThrow();
  });
  it('rejects weak passwords and overspending including already reserved fees', () => {
    expect(()=>encryptWizard('fake','short')).toThrow();
    expect(()=>assertBudget(8n,3n,10n,100n,1n)).toThrow();
    expect(()=>assertBudget(0n,3n,0n,100n,1n)).toThrow();
    expect(()=>assertBudget(0n,3n,10n,3n,1n)).toThrow();
    expect(()=>assertBudget(7n,3n,10n,100n,1n)).not.toThrow();
  });
});
