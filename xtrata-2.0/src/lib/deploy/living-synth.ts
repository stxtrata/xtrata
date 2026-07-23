export const LIVING_SYNTH_GATEWAY_NAME = 'xtrata-v3-2-3-gateway';
export const LIVING_SYNTH_REGISTRY_NAME = 'proof-of-free-living-synth-v1';
export const LIVING_SYNTH_XTRATA_NAME = 'xtrata-v3-2-3';
export const LIVING_SYNTH_COLLECTION_SIZE = 1024;
export const LIVING_SYNTH_PAGE_COUNT = 32;
export const LIVING_SYNTH_MIN_RECORDING_FEE = 1_000n;
export const LIVING_SYNTH_MAX_RECORDING_FEE = 1_000_000n;
export const LIVING_SYNTH_DEFAULT_RECORDING_FEE = 100_000n;

export type LivingSynthSystemState = {
  coreContract: string | null;
  engineId: bigint | null;
  engineHash: string | null;
  contractOwner: string;
  pendingOwner: string | null;
  paused: boolean;
  registeredEditions: bigint;
  globalRevision: bigint;
  recordingFee: bigint;
  feeRecipient: string;
};

export type LivingSynthEditionEntry = {
  edition: number;
  nftId: number;
};

type CvJson = {
  type?: string;
  value?: unknown;
  success?: boolean;
};

const stripComments = (source: string) =>
  source
    .split('\n')
    .map((line) => line.replace(/;;.*$/, ''))
    .join('\n');

const sourceHas = (active: string, fragment: string, message: string, problems: string[]) => {
  if (!active.includes(fragment)) problems.push(message);
};

export const inspectLivingSynthGatewaySource = (source: string, deployer: string): string[] => {
  const active = stripComments(source);
  const problems: string[] = [];
  sourceHas(
    active,
    `(define-constant XTRATA-CORE\n  '${deployer}.${LIVING_SYNTH_XTRATA_NAME}`,
    `XTRATA-CORE must target '${deployer}.${LIVING_SYNTH_XTRATA_NAME}'`,
    problems
  );
  for (const reader of ['get-owner', 'get-parents', 'get-inscription-meta']) {
    sourceHas(
      active,
      `(define-read-only (${reader}`,
      `gateway reader ${reader} is missing`,
      problems
    );
    sourceHas(
      active,
      `(contract-call? '${deployer}.${LIVING_SYNTH_XTRATA_NAME} ${reader}`,
      `gateway reader ${reader} must call the literal production Xtrata contract`,
      problems
    );
  }
  if (active.includes('(contract-call? XTRATA-CORE')) {
    problems.push('gateway readers cannot dynamically call XTRATA-CORE');
  }
  if (active.includes('.mock-')) problems.push('gateway source contains an active mock contract');
  return problems;
};

export const inspectLivingSynthRegistrySource = (source: string): string[] => {
  const active = stripComments(source);
  const problems: string[] = [];
  sourceHas(
    active,
    '(define-constant MAX-EDITIONS u1024)',
    'MAX-EDITIONS must be locked to u1024',
    problems
  );
  for (const [fragment, message] of [
    ['(define-constant ENGINE-MIME "text/javascript")', 'engine MIME must be locked to text/javascript'],
    ['(define-constant MAX-RECORDING-BYTES u262144)', 'recordings must be capped at 262144 bytes'],
    ['(define-constant MAX-ENGINE-BYTES u131072)', 'engine must be capped at 131072 bytes'],
    ['(define-constant MAX-EDITION-BATCH u25)', 'edition batches must be capped at 25']
  ]) sourceHas(active, fragment, message, problems);
  sourceHas(
    active,
    '(define-constant RECORDING-MIME "application/json")',
    'recordings must be locked to application/json',
    problems
  );
  for (const [name, value] of [
    ['MIN-RECORDING-FEE', 'u1000'],
    ['MAX-RECORDING-FEE', 'u1000000'],
    ['DEFAULT-RECORDING-FEE', 'u100000']
  ]) {
    sourceHas(
      active,
      `(define-constant ${name} ${value})`,
      `${name} must be locked to ${value}`,
      problems
    );
  }
  for (const fn of [
    'lock-core-contract',
    'set-engine',
    'register-edition',
    'register-edition-batch',
    'register-recording',
    'initiate-contract-ownership-transfer',
    'cancel-contract-ownership-transfer',
    'accept-contract-ownership',
    'set-recording-fee',
    'set-fee-recipient',
    'get-system-state',
    'get-recording-fee',
    'get-fee-recipient',
    'get-recording-count',
    'get-recording-id',
    'get-mosaic-page'
  ]) {
    if (!active.includes(`(${fn}`)) problems.push(`registry function ${fn} is missing`);
  }
  sourceHas(active, '(define-data-var engine-hash (optional (buff 32)) none)', 'registry must pin the engine content hash', problems);
  if (!/\(define-public \(register-recording[\s\S]*?\(expected-fee uint\)/.test(active)) {
    problems.push('register-recording must require the caller-tested expected fee');
  }
  if (active.includes('.mock-')) problems.push('registry source contains an active mock contract');
  return problems;
};

const unwrap = (node: CvJson | null | undefined): CvJson | null => {
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

const tuple = (node: CvJson | null | undefined): Record<string, CvJson> | null => {
  const current = unwrap(node);
  if (!current || typeof current.value !== 'object' || !current.value) return null;
  return current.value as Record<string, CvJson>;
};

const optionalString = (node: CvJson | undefined): string | null => {
  const current = unwrap(node);
  return typeof current?.value === 'string' ? current.value : null;
};

const optionalBigint = (node: CvJson | undefined): bigint | null => {
  const current = unwrap(node);
  if (typeof current?.value !== 'string') return null;
  try {
    return BigInt(current.value);
  } catch {
    return null;
  }
};

const optionalHex = (node: CvJson | undefined): string | null => {
  const current = unwrap(node);
  if (typeof current?.value !== 'string') return null;
  const normalized = current.value.replace(/^0x/, '').toLowerCase();
  return /^[0-9a-f]{64}$/.test(normalized) ? normalized : null;
};

export const parseLivingSynthSystemState = (
  value: CvJson | null | undefined
): LivingSynthSystemState | null => {
  const data = tuple(value);
  if (!data) return null;
  const paused = unwrap(data.paused)?.value;
  const registeredEditions = optionalBigint(data['registered-editions']);
  const globalRevision = optionalBigint(data['global-revision']);
  const recordingFee = optionalBigint(data['recording-fee']);
  const feeRecipient = optionalString(data['fee-recipient']);
  const contractOwner = optionalString(data['contract-owner']);
  if (
    typeof paused !== 'boolean' ||
    registeredEditions === null ||
    globalRevision === null ||
    recordingFee === null ||
    feeRecipient === null ||
    contractOwner === null
  ) {
    return null;
  }
  return {
    coreContract: optionalString(data['core-contract']),
    engineId: optionalBigint(data['engine-id']),
    engineHash: optionalHex(data['engine-hash']),
    contractOwner,
    pendingOwner: optionalString(data['pending-owner']),
    paused,
    registeredEditions,
    globalRevision,
    recordingFee,
    feeRecipient
  };
};

export const parseRecordingFeeStx = (
  input: string
): { ok: true; microStx: bigint } | { ok: false; error: string } => {
  const value = input.trim();
  if (!/^\d+(?:\.\d{1,6})?$/.test(value)) {
    return { ok: false, error: 'Fee must be an STX amount with no more than 6 decimal places.' };
  }
  const [whole, decimals = ''] = value.split('.');
  const microStx = BigInt(whole) * 1_000_000n + BigInt(decimals.padEnd(6, '0'));
  if (microStx < LIVING_SYNTH_MIN_RECORDING_FEE || microStx > LIVING_SYNTH_MAX_RECORDING_FEE) {
    return { ok: false, error: 'Fee must be between 0.001 and 1 STX.' };
  }
  return { ok: true, microStx };
};

export const parseInscriptionMime = (value: CvJson | null | undefined): string | null => {
  const data = tuple(value);
  return data ? optionalString(data['mime-type']) : null;
};

export const parseLivingSynthInscriptionMeta = (
  value: CvJson | null | undefined
): { mimeType: string; totalSize: bigint; sealed: boolean; finalHash: string } | null => {
  const data = tuple(value);
  if (!data) return null;
  const mimeType = optionalString(data['mime-type']);
  const totalSize = optionalBigint(data['total-size']);
  const sealed = unwrap(data.sealed)?.value;
  const finalHash = optionalHex(data['final-hash']);
  if (!mimeType || totalSize === null || typeof sealed !== 'boolean' || !finalHash) return null;
  return { mimeType, totalSize, sealed, finalHash };
};

export const parseOptionalPrincipal = (value: CvJson | null | undefined): string | null =>
  optionalString(value ?? undefined);

export const parseLivingSynthMosaicPage = (
  value: CvJson | null | undefined
): Array<{ edition: number; nftId: number | null }> | null => {
  const current = unwrap(value);
  if (!current || !Array.isArray(current.value)) return null;
  const cells: Array<{ edition: number; nftId: number | null }> = [];
  for (const entry of current.value) {
    const data = tuple(entry as CvJson);
    const edition = optionalBigint(data?.edition);
    const nftId = optionalBigint(data?.['nft-id']);
    if (edition === null || edition > BigInt(Number.MAX_SAFE_INTEGER)) return null;
    cells.push({ edition: Number(edition), nftId: nftId === null ? null : Number(nftId) });
  }
  return cells;
};

export const parseLivingSynthEdition = (
  value: CvJson | null | undefined
): { edition: number; nftId: number | null } | null => {
  const data = tuple(value);
  const edition = optionalBigint(data?.edition);
  const nftId = optionalBigint(data?.['nft-id']);
  if (edition === null || edition > BigInt(Number.MAX_SAFE_INTEGER)) return null;
  return { edition: Number(edition), nftId: nftId === null ? null : Number(nftId) };
};

export const validateLivingSynthEditionManifest = (
  input: string
): { ok: true; entries: LivingSynthEditionEntry[] } | { ok: false; problems: string[] } => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    return { ok: false, problems: ['Manifest must be valid JSON.'] };
  }
  const candidates = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { editions?: unknown }).editions)
      ? (parsed as { editions: unknown[] }).editions
      : null;
  if (!candidates) {
    return { ok: false, problems: ['Manifest must be an array or an object with an editions array.'] };
  }
  if (candidates.length === 0 || candidates.length > LIVING_SYNTH_COLLECTION_SIZE) {
    return {
      ok: false,
      problems: [`Manifest must contain between 1 and ${LIVING_SYNTH_COLLECTION_SIZE} editions.`]
    };
  }
  const problems: string[] = [];
  const entries: LivingSynthEditionEntry[] = [];
  const editions = new Set<number>();
  const nftIds = new Set<number>();
  candidates.forEach((candidate, index) => {
    const item = candidate && typeof candidate === 'object' ? candidate as Record<string, unknown> : {};
    const edition = Number(item.edition);
    const nftId = Number(item.nftId ?? item['nft-id']);
    if (!Number.isSafeInteger(edition) || edition < 1 || edition > LIVING_SYNTH_COLLECTION_SIZE) {
      problems.push(`Entry ${index + 1} has an invalid edition.`);
    }
    if (!Number.isSafeInteger(nftId) || nftId < 0) {
      problems.push(`Entry ${index + 1} has an invalid nftId.`);
    }
    if (editions.has(edition)) problems.push(`Edition ${edition} appears more than once.`);
    if (nftIds.has(nftId)) problems.push(`NFT ${nftId} appears more than once.`);
    editions.add(edition);
    nftIds.add(nftId);
    entries.push({ edition, nftId });
  });
  if (problems.length > 0) return { ok: false, problems };
  return { ok: true, entries: entries.sort((a, b) => a.edition - b.edition) };
};

export type LivingSynthGateInput = {
  gatewaySourceReady: boolean;
  gatewayDeployed: boolean;
  registrySourceReady: boolean;
  registryDeployed: boolean;
  systemState: LivingSynthSystemState | null;
  expectedGatewayId: string;
  engineValidated: boolean;
  manifestEntries: number;
  mosaicAuditPassed: boolean;
};

export const deriveLivingSynthGates = (input: LivingSynthGateInput) => {
  const coreLocked = input.systemState?.coreContract === input.expectedGatewayId;
  const engineSet =
    input.systemState?.engineId !== null &&
    input.systemState?.engineId !== undefined &&
    Boolean(input.systemState?.engineHash);
  const feeReady = Boolean(
    input.systemState &&
    input.systemState.recordingFee >= LIVING_SYNTH_MIN_RECORDING_FEE &&
    input.systemState.recordingFee <= LIVING_SYNTH_MAX_RECORDING_FEE &&
    input.systemState.feeRecipient
  );
  const mappingComplete =
    input.manifestEntries > 0 &&
    input.systemState?.registeredEditions === BigInt(input.manifestEntries);
  return {
    deployGateway: input.gatewaySourceReady && !input.gatewayDeployed,
    preflightRegistry: input.gatewayDeployed,
    deployRegistry: input.gatewayDeployed && input.registrySourceReady && !input.registryDeployed,
    testPristineRegistry: input.gatewayDeployed && input.registryDeployed,
    lockGateway: input.registryDeployed && input.systemState !== null && !input.systemState.coreContract,
    setEngine: coreLocked && input.engineValidated && !engineSet,
    configureFees: input.registryDeployed && input.systemState !== null,
    registerEditions: coreLocked && engineSet && feeReady,
    auditMosaic: coreLocked && engineSet && feeReady && mappingComplete,
    goLive:
      coreLocked &&
      engineSet &&
      feeReady &&
      mappingComplete &&
      input.mosaicAuditPassed &&
      input.systemState?.paused === true,
    coreLocked,
    engineSet,
    feeReady,
    mappingComplete
  };
};
