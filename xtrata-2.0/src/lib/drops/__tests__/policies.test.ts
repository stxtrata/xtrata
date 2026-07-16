import { describe, expect, it } from 'vitest';
import {
  DEFAULT_DROP_POLICY_RULES,
  hasBnsPolicy,
  normalizeDropBnsName,
  normalizeDropPolicyRules,
  type DropPolicyRules
} from '../policies';

const combinations: DropPolicyRules[] = [false, true].flatMap((onePerWallet) =>
  [false, true].flatMap((requireBnsName) =>
    [false, true].map((onePerBnsName) => ({
      onePerWallet,
      requireBnsName,
      onePerBnsName
    }))
  )
);

describe('drop policy rules', () => {
  it('preserves every toggle combination', () => {
    expect(combinations).toHaveLength(8);
    for (const rules of combinations) {
      expect(normalizeDropPolicyRules(rules)).toEqual(rules);
      expect(hasBnsPolicy(rules)).toBe(rules.requireBnsName || rules.onePerBnsName);
    }
  });

  it('defaults to one-per-wallet only', () => {
    expect(normalizeDropPolicyRules(null)).toEqual(DEFAULT_DROP_POLICY_RULES);
  });

  it('normalizes BNS names used for drop policy claims', () => {
    expect(normalizeDropBnsName(' Alice.BTC ')).toBe('alice.btc');
    expect(normalizeDropBnsName('not a bns name')).toBeNull();
  });
});
