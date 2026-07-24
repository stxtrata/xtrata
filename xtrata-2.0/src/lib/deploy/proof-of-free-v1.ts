export const PROOF_OF_FREE_CONTRACT_NAME = 'proof-of-free-v1';
export const PROOF_OF_FREE_BASE_SOURCE_PATH = 'contracts/live/xtrata-drops-v1.1.clar';
export const PROOF_OF_FREE_COLLECTION_SIZE = 1024;
export const PROOF_OF_FREE_ENGINE_CANDIDATE_SHA256 =
  '9434263320d2b013d7a6513210480c4cd881d4546072ae3efa0867caa1626768';

type CvJson = { type?: string; value?: unknown };

export type ProofOfFreeOnChainState = {
  engineId: bigint;
  engineSha256: string;
  campaignId: bigint;
  maxSupply: bigint;
  onePerWallet: boolean;
  requireBns: boolean;
  onePerBns: boolean;
};

export type ProofOfFreeCampaignState = {
  engineId: bigint;
  maxSupply: bigint;
  dropsCreated: bigint;
  onePerWallet: boolean;
  requireBns: boolean;
  onePerBns: boolean;
  active: boolean;
};

const unwrapCv = (node: CvJson | null | undefined): CvJson | null => {
  let current = node ?? null;
  while (
    current &&
    typeof current.type === 'string' &&
    (current.type.startsWith('(optional') || current.type.startsWith('(response'))
  ) {
    current = (current.value as CvJson | null) ?? null;
  }
  return current;
};

export const parseProofOfFreeConfig = (
  value: CvJson | null | undefined
): ProofOfFreeOnChainState | null => {
  const root = unwrapCv(value);
  if (!root || !root.value || typeof root.value !== 'object') return null;
  const data = root.value as Record<string, CvJson>;
  const text = (key: string) => unwrapCv(data[key])?.value;
  const bigint = (key: string) => {
    const raw = text(key);
    try {
      return typeof raw === 'string' ? BigInt(raw) : null;
    } catch {
      return null;
    }
  };
  const hashRaw = text('engine-sha256');
  const engineSha256 =
    typeof hashRaw === 'string' ? hashRaw.replace(/^0x/i, '').toLowerCase() : '';
  const engineId = bigint('engine-id');
  const campaignId = bigint('campaign-id');
  const maxSupply = bigint('max-supply');
  if (
    text('protocol') !== 'proof-of-free/v3' ||
    engineId === null ||
    campaignId === null ||
    maxSupply === null ||
    !/^[0-9a-f]{64}$/.test(engineSha256) ||
    typeof text('one-per-wallet') !== 'boolean' ||
    typeof text('require-bns') !== 'boolean' ||
    typeof text('one-per-bns') !== 'boolean'
  ) {
    return null;
  }
  return {
    engineId,
    engineSha256,
    campaignId,
    maxSupply,
    onePerWallet: text('one-per-wallet') as boolean,
    requireBns: text('require-bns') as boolean,
    onePerBns: text('one-per-bns') as boolean
  };
};

export const parseProofOfFreeCampaign = (
  value: CvJson | null | undefined
): ProofOfFreeCampaignState | null => {
  const root = unwrapCv(value);
  if (!root || !root.value || typeof root.value !== 'object') return null;
  const data = root.value as Record<string, CvJson>;
  const raw = (key: string) => unwrapCv(data[key])?.value;
  const bigint = (key: string) => {
    const value = raw(key);
    try {
      return typeof value === 'string' ? BigInt(value) : null;
    } catch {
      return null;
    }
  };
  const engineId = bigint('engine-id');
  const maxSupply = bigint('max-supply');
  const dropsCreated = bigint('drops-created');
  const onePerWallet = raw('one-per-wallet');
  const requireBns = raw('require-bns');
  const onePerBns = raw('one-per-bns');
  const active = raw('active');
  if (
    engineId === null ||
    maxSupply === null ||
    dropsCreated === null ||
    typeof onePerWallet !== 'boolean' ||
    typeof requireBns !== 'boolean' ||
    typeof onePerBns !== 'boolean' ||
    typeof active !== 'boolean'
  ) {
    return null;
  }
  return {
    engineId,
    maxSupply,
    dropsCreated,
    onePerWallet,
    requireBns,
    onePerBns,
    active
  };
};

const replaceOnce = (source: string, needle: string, replacement: string) => {
  if (!source.includes(needle)) {
    throw new Error(`Drops v1.1 source shape changed near: ${needle.slice(0, 60)}`);
  }
  return source.replace(needle, replacement);
};

export const normalizeProofOfFreeEngine = (
  engineInput: string,
  hashInput: string
):
  | { ok: true; engineId: number; engineSha256: string }
  | { ok: false; error: string } => {
  const engineId = Number(engineInput.trim());
  if (!Number.isSafeInteger(engineId) || engineId <= 0) {
    return { ok: false, error: 'Engine inscription ID must be a positive safe integer.' };
  }
  const engineSha256 = hashInput.trim().replace(/^0x/i, '').toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(engineSha256)) {
    return { ok: false, error: 'Engine SHA-256 must be exactly 32 bytes of hexadecimal.' };
  }
  return { ok: true, engineId, engineSha256 };
};

export const generateProofOfFreeContract = (
  dropsV11Source: string,
  engineId: number,
  engineSha256: string,
  contractName = PROOF_OF_FREE_CONTRACT_NAME
) => {
  let source = dropsV11Source;
  source = replaceOnce(
    source,
    ';; xtrata-drops-v1.1',
    `;; ${contractName}\n;; Generated dedicated controller for Proof of Free - Living Synth v3.\n;; Engine inscription: ${engineId}\n;; Engine SHA-256: ${engineSha256}`
  );
  source = replaceOnce(
    source,
    '(define-constant NFT-ASSET-NAME "xtrata-inscription")',
    `(define-constant NFT-ASSET-NAME "xtrata-inscription")
(define-constant POF-ENGINE-ID u${engineId})
(define-constant POF-ENGINE-SHA256 0x${engineSha256})
(define-constant POF-MAX-SUPPLY u1024)`
  );
  source = replaceOnce(
    source,
    '(define-read-only (get-next-campaign-id) (ok (var-get next-campaign-id)))',
    `(define-read-only (get-next-campaign-id) (ok (var-get next-campaign-id)))
(define-read-only (get-collection-config)
  (ok {
    protocol: "proof-of-free/v3",
    engine-id: POF-ENGINE-ID,
    engine-sha256: POF-ENGINE-SHA256,
    campaign-id: u0,
    max-supply: POF-MAX-SUPPLY,
    one-per-wallet: true,
    require-bns: true,
    one-per-bns: true
  })
)`
  );
  source = replaceOnce(
    source,
    '  (begin\n    (asserts!\n      (and (> max-supply u0) (<= max-supply MAX-CAMPAIGN-SUPPLY))',
    `  (begin
    ;; Campaign zero is the only campaign and its launch policy is immutable.
    (asserts! (is-eq (var-get next-campaign-id) u0) ERR-INVALID-CAMPAIGN)
    (asserts! (is-eq engine-id POF-ENGINE-ID) ERR-INVALID-CAMPAIGN)
    (asserts! (is-eq max-supply POF-MAX-SUPPLY) ERR-INVALID-CAMPAIGN)
    (asserts! one-per-wallet ERR-INVALID-CAMPAIGN)
    (asserts! require-bns ERR-INVALID-CAMPAIGN)
    (asserts! one-per-bns ERR-INVALID-CAMPAIGN)
    (asserts!
      (and (> max-supply u0) (<= max-supply MAX-CAMPAIGN-SUPPLY))`
  );
  source = replaceOnce(
    source,
    '        active: true,\n        created-at: stacks-block-height',
    '        active: false,\n        created-at: stacks-block-height'
  );
  source = replaceOnce(
    source,
    '        require-bns: require-bns,\n        one-per-bns: one-per-bns\n      })',
    '        require-bns: require-bns,\n        one-per-bns: one-per-bns,\n        active: false\n      })'
  );
  source = replaceOnce(
    source,
    '    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)\n    (map-set AllowedNftContracts nft-principal allowed)',
    `    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    ;; This collection can never accept a substitute NFT implementation.
    (asserts! (and (is-eq nft-principal PRIMARY-NFT-CONTRACT) allowed) ERR-NOT-AUTHORIZED)
    (map-set AllowedNftContracts nft-principal allowed)`
  );
  source = replaceOnce(
    source,
    '      (asserts! (is-eq tx-sender (get creator campaign)) ERR-NOT-AUTHORIZED)\n      (map-set Campaigns campaign-id (merge campaign { active: active }))',
    `      (asserts! (is-eq tx-sender (get creator campaign)) ERR-NOT-AUTHORIZED)
      ;; Opening is impossible until all 1,024 NFTs are escrowed.
      (asserts!
        (or (not active) (is-eq (get drops-created campaign) POF-MAX-SUPPLY))
        ERR-CAMPAIGN-LIMIT
      )
      (map-set Campaigns campaign-id (merge campaign { active: active }))`
  );
  source = replaceOnce(
    source,
    '      (asserts! (get active campaign) ERR-CAMPAIGN-INACTIVE)\n      (asserts! (campaign-operator-allowed campaign-id campaign) ERR-NOT-AUTHORIZED)',
    '      (asserts! (campaign-operator-allowed campaign-id campaign) ERR-NOT-AUTHORIZED)'
  );
  source = replaceOnce(
    source,
    '(define-public (create-drop (nft-contract <nft-trait>) (token-id uint) (fee-budget uint) (group-id uint))\n  (let ((nft-principal (contract-of nft-contract)))\n    (begin',
    `(define-public (create-drop (nft-contract <nft-trait>) (token-id uint) (fee-budget uint) (group-id uint))
  (let ((nft-principal (contract-of nft-contract)))
    (begin
      (asserts! false ERR-CAMPAIGN-CLAIM-REQUIRED)`
  );
  source = replaceOnce(
    source,
    '        (edition (get drops-created campaign))',
    '        (edition (+ (get drops-created campaign) u1))'
  );
  source = replaceOnce(
    source,
    '(define-public (claim (nft-contract <nft-trait>) (drop-id uint))\n  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))',
    `(define-public (claim (nft-contract <nft-trait>) (drop-id uint))
  (begin
    (asserts! false ERR-CAMPAIGN-CLAIM-REQUIRED)
  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))`
  );
  source = replaceOnce(
    source,
    '      (ok true)\n    )\n  )\n)\n\n;; The claimant submits this transaction',
    '      (ok true)\n    )\n  ))\n)\n\n;; The claimant submits this transaction'
  );
  return source;
};

export const inspectProofOfFreeSource = (
  source: string,
  deployer: string,
  engineId: number,
  engineSha256: string
) => {
  const active = source
    .split('\n')
    .map((line) => line.replace(/;;.*$/, ''))
    .join('\n');
  const required = [
    `(define-constant POF-ENGINE-ID u${engineId})`,
    `(define-constant POF-ENGINE-SHA256 0x${engineSha256})`,
    '(define-constant POF-MAX-SUPPLY u1024)',
    `(define-constant PRIMARY-NFT-CONTRACT '${deployer}.xtrata-v3-2-3)`,
    '(define-read-only (get-collection-config)',
    '(asserts! one-per-wallet ERR-INVALID-CAMPAIGN)',
    '(asserts! require-bns ERR-INVALID-CAMPAIGN)',
    '(asserts! one-per-bns ERR-INVALID-CAMPAIGN)',
    '(or (not active) (is-eq (get drops-created campaign) POF-MAX-SUPPLY))',
    '(edition (+ (get drops-created campaign) u1))'
  ];
  const problems = required
    .filter((needle) => !active.includes(needle))
    .map((needle) => `required Proof of Free source invariant is missing: ${needle}`);
  if (active.includes('(define-constant POF-ENGINE-ID u0)')) {
    problems.push('Proof of Free engine ID must not be zero');
  }
  return problems;
};
