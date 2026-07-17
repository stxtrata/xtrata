export type DropPolicyRules = {
  onePerWallet: boolean;
  requireBnsName: boolean;
  onePerBnsName: boolean;
};

export const DEFAULT_DROP_POLICY_RULES: DropPolicyRules = {
  onePerWallet: true,
  requireBnsName: false,
  onePerBnsName: false
};

const BNS_NAME_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;

export const normalizeDropBnsName = (value?: string | null) => {
  const normalized = String(value ?? '').trim().toLowerCase();
  return BNS_NAME_PATTERN.test(normalized) ? normalized : null;
};

export const normalizeDropPolicyRules = (value?: Partial<DropPolicyRules> | null): DropPolicyRules => ({
  onePerWallet: value?.onePerWallet === undefined
    ? DEFAULT_DROP_POLICY_RULES.onePerWallet
    : !!value.onePerWallet,
  requireBnsName: value?.requireBnsName === undefined
    ? DEFAULT_DROP_POLICY_RULES.requireBnsName
    : !!value.requireBnsName,
  onePerBnsName: value?.onePerBnsName === undefined
    ? DEFAULT_DROP_POLICY_RULES.onePerBnsName
    : !!value.onePerBnsName
});

export const hasBnsPolicy = (rules: DropPolicyRules) =>
  rules.requireBnsName || rules.onePerBnsName;

export const hasNonDefaultDropPolicy = (rules: DropPolicyRules) =>
  rules.onePerWallet !== DEFAULT_DROP_POLICY_RULES.onePerWallet ||
  rules.requireBnsName !== DEFAULT_DROP_POLICY_RULES.requireBnsName ||
  rules.onePerBnsName !== DEFAULT_DROP_POLICY_RULES.onePerBnsName;
