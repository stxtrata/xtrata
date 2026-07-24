/**
 * Xtrata Deploy Console — browser deploys signed by the admin wallet.
 *
 * Same trust model as the v3.2.3 handover page: the page never sees a key
 * and the connected wallet must be the production deployer.
 *
 * Wallet-signed deploys are BACK for these contracts: after mainnet tx
 * 0x92046d…7ac4d proved wallets publish at Clarity 4 regardless of the
 * requested version, the sponsored market contracts were ported to
 * Clarity 4 (`as-contract?` with precise with-nft/with-stx allowances,
 * `current-contract`), verified by the full clarinet suite. The wallet's
 * Clarity 4 default now matches the contracts, so physical signing in the
 * wallet is safe again — no mnemonic ever leaves the wallet. The CLI helper
 * remains as a fallback (it pins Clarity 4 for these entries).
 *
 * The deployable registry mirrors scripts/mainnet-deploy-contract.mjs, and
 * the preflight applies the same rules in-browser.
 */
import {
  connectWallet,
  disconnectWallet,
  showContractCall,
  showContractDeploy
} from './lib/wallet/connect';
import {
  boolCV,
  contractPrincipalCV,
  cvToHex,
  cvToJSON,
  hexToCV,
  listCV,
  standardPrincipalCV,
  tupleCV,
  uintCV,
  validateStacksAddress
} from '@stacks/transactions';
import { toStacksNetwork } from './lib/network/stacks';
import type { WalletSession } from './lib/wallet/types';
import {
  DROPS_V11_CONTRACT_NAME,
  DROPS_V11_SOURCE_PATH,
  buildBnsAttestorArg,
  classifyContractInterfaceResponse,
  extractWalletTxId,
  formatDeployLog,
  inspectDropsV11Source,
  type DeployLogEntry,
  type DeployLogLevel
} from './lib/deploy/drops-v1-1';
import {
  PROOF_OF_FREE_COLLECTION_SIZE,
  PROOF_OF_FREE_CONTRACT_NAME,
  PROOF_OF_FREE_ENGINE_CANDIDATE_SHA256,
  generateProofOfFreeContract,
  inspectProofOfFreeSource,
  normalizeProofOfFreeEngine,
  parseProofOfFreeCampaign,
  parseProofOfFreeConfig
} from './lib/deploy/proof-of-free-v1';
import {
  LIVING_SYNTH_COLLECTION_SIZE,
  LIVING_SYNTH_GATEWAY_NAME,
  LIVING_SYNTH_PAGE_COUNT,
  LIVING_SYNTH_REGISTRY_NAME,
  LIVING_SYNTH_XTRATA_NAME,
  deriveLivingSynthGates,
  inspectLivingSynthGatewaySource,
  inspectLivingSynthRegistrySource,
  parseLivingSynthInscriptionMeta,
  parseLivingSynthEdition,
  parseLivingSynthMosaicPage,
  parseOptionalPrincipal,
  parseRecordingFeeStx,
  parseLivingSynthSystemState,
  validateLivingSynthEditionManifest,
  type LivingSynthEditionEntry,
  type LivingSynthSystemState
} from './lib/deploy/living-synth';
// Contract sources are bundled at build time (?raw) — no dev-server fetch,
// so the preflight always hashes exactly what is in the repo. (The previous
// fetch('/contracts/…') could receive the SPA HTML fallback instead.)
import sponsoredStxSource from '../contracts/live/xtrata-market-sponsored-stx-v1.1.clar?raw';
import sponsoredSbtcSource from '../contracts/live/xtrata-market-sponsored-sbtc-v1.1.clar?raw';
import sponsoredUsdcxSource from '../contracts/live/xtrata-market-sponsored-usdcx-v1.1.clar?raw';
import dropsSource from '../contracts/live/xtrata-drops-v1.0.clar?raw';
import dropsV11Source from '../contracts/live/xtrata-drops-v1.1.clar?raw';
import livingSynthGatewaySource from '../contracts/live/xtrata-v3-2-3-gateway.clar?raw';
import livingSynthRegistrySource from '../contracts/live/proof-of-free-living-synth-v1.clar?raw';

const EXPECTED_DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const HIRO_API = 'https://api.hiro.so';

type Deployable = {
  name: string;
  source: string;
  /** contract source bundled at build time */
  code: string;
  notes: string;
  sponsoredMarket?: boolean;
  dropsV11?: boolean;
  proofOfFree?: boolean;
  livingSynthRole?: 'gateway' | 'registry';
  paymentToken?: string;
};

const DEPLOYABLE: Deployable[] = [
  {
    name: LIVING_SYNTH_GATEWAY_NAME,
    source: 'contracts/live/xtrata-v3-2-3-gateway.clar',
    code: livingSynthGatewaySource,
    livingSynthRole: 'gateway',
    notes: 'Read-only ABI gateway locked to the production Xtrata v3.2.3 core.'
  },
  {
    name: LIVING_SYNTH_REGISTRY_NAME,
    source: 'contracts/live/proof-of-free-living-synth-v1.clar',
    code: livingSynthRegistrySource,
    livingSynthRole: 'registry',
    notes: 'Ownership-gated recording child registry and 1,024-cell mosaic state.'
  },
  {
    name: DROPS_V11_CONTRACT_NAME,
    source: DROPS_V11_SOURCE_PATH,
    code: dropsV11Source,
    sponsoredMarket: true,
    dropsV11: true,
    notes:
      'Campaign-aware sponsored drops: immutable collection rules, one-per-wallet/BNS enforcement, and shared identity across every Wizard batch.'
  },
  {
    name: PROOF_OF_FREE_CONTRACT_NAME,
    source: 'generated after the engine inscription is verified',
    code: dropsV11Source,
    sponsoredMarket: true,
    dropsV11: true,
    proofOfFree: true,
    notes:
      'Dedicated Living Synth v3 claim controller. Generated in-browser with the verified engine inscription ID/SHA-256; campaign 0 is fixed to 1,024 with BNS, wallet and BNS-name limits.'
  },
  {
    name: 'xtrata-market-sponsored-stx-v1-1',
    source: 'contracts/live/xtrata-market-sponsored-stx-v1.1.clar',
    code: sponsoredStxSource,
    sponsoredMarket: true,
    notes: 'STX marketplace with seller-funded fee sponsorship (buyers need only the price).'
  },
  {
    name: 'xtrata-market-sponsored-sbtc-v1-1',
    source: 'contracts/live/xtrata-market-sponsored-sbtc-v1.1.clar',
    code: sponsoredSbtcSource,
    sponsoredMarket: true,
    paymentToken: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token',
    notes: 'sBTC marketplace with seller-funded fee sponsorship (STX-free buys).'
  },
  {
    name: 'xtrata-market-sponsored-usdcx-v1-1',
    source: 'contracts/live/xtrata-market-sponsored-usdcx-v1.1.clar',
    code: sponsoredUsdcxSource,
    sponsoredMarket: true,
    paymentToken: 'SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx',
    notes: 'USDCx marketplace with seller-funded fee sponsorship (STX-free buys).'
  },
  {
    name: 'xtrata-drops-v1-0',
    source: 'contracts/live/xtrata-drops-v1.0.clar',
    code: dropsSource,
    sponsoredMarket: true,
    notes: 'Sponsored free-claim drops: creators escrow NFT + fee budget, claimers need zero STX.'
  }
];

const appDetails = {
  name: 'Xtrata Deploy Console',
  icon: `${window.location.origin}/favicon.svg`
};
const connectParams = { appName: appDetails.name, appIcon: appDetails.icon };

type PreflightResult = {
  ok: boolean;
  problems: string[];
  sha256: string;
  bytes: number;
  alreadyDeployed: boolean;
  chainStatus: 'available' | 'deployed' | 'unknown';
};

type ContractState = {
  entry: Deployable;
  source: string | null;
  preflight: PreflightResult | null;
  txId: string | null;
  error: string | null;
  busy: boolean;
  logs: DeployLogEntry[];
};

let session: WalletSession = { isConnected: false };
const LOG_STORAGE_PREFIX = 'xtrata:deploy-console:logs:';

const readStoredLogs = (name: string): DeployLogEntry[] => {
  try {
    const value = window.localStorage.getItem(`${LOG_STORAGE_PREFIX}${name}`);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.slice(-100) : [];
  } catch {
    return [];
  }
};

const states = new Map<string, ContractState>(
  DEPLOYABLE.map((entry) => [
    entry.name,
    {
      entry,
      source: null,
      preflight: null,
      txId: null,
      error: null,
      busy: false,
      logs: readStoredLogs(entry.name)
    }
  ])
);

type LivingSynthConsoleState = {
  systemState: LivingSynthSystemState | null;
  systemStateTested: boolean;
  engineInput: string;
  engineValidatedId: number | null;
  engineMime: string | null;
  engineHash: string | null;
  engineSize: bigint | null;
  feeInput: string;
  feeRecipientInput: string;
  manifestInput: string;
  manifest: LivingSynthEditionEntry[];
  mappingIndex: number;
  mappingReadyEntries: LivingSynthEditionEntry[];
  newOwnerInput: string;
  mosaicAuditPassed: boolean;
  lockConfirmation: string;
  liveConfirmation: string;
  busy: boolean;
  error: string | null;
};

const livingSynth: LivingSynthConsoleState = {
  systemState: null,
  systemStateTested: false,
  engineInput: '',
  engineValidatedId: null,
  engineMime: null,
  engineHash: null,
  engineSize: null,
  feeInput: '0.1',
  feeRecipientInput: EXPECTED_DEPLOYER,
  manifestInput: '',
  manifest: [],
  mappingIndex: 0,
  mappingReadyEntries: [],
  newOwnerInput: '',
  mosaicAuditPassed: false,
  lockConfirmation: '',
  liveConfirmation: '',
  busy: false,
  error: null
};

type ProofOfFreeConsoleState = {
  engineInput: string;
  expectedHashInput: string;
  engineValidatedId: number | null;
  engineHash: string | null;
  engineSize: bigint | null;
  engineMime: string | null;
  deploymentVerified: boolean;
  error: string | null;
  busy: boolean;
};

const proofOfFree: ProofOfFreeConsoleState = {
  engineInput: '',
  expectedHashInput: PROOF_OF_FREE_ENGINE_CANDIDATE_SHA256,
  engineValidatedId: null,
  engineHash: null,
  engineSize: null,
  engineMime: null,
  deploymentVerified: false,
  error: null,
  busy: false
};

const addLog = (
  stateEntry: ContractState,
  action: string,
  level: DeployLogLevel,
  message: string,
  txId?: string | null
) => {
  stateEntry.logs = [
    ...stateEntry.logs,
    {
      at: new Date().toISOString(),
      action,
      level,
      message,
      ...(txId ? { txId } : {})
    }
  ].slice(-100);
  try {
    window.localStorage.setItem(
      `${LOG_STORAGE_PREFIX}${stateEntry.entry.name}`,
      JSON.stringify(stateEntry.logs)
    );
  } catch {
    // The on-page log still works when storage is unavailable.
  }
};

const stripComments = (code: string) =>
  code
    .split('\n')
    .map((line) => line.replace(/;;.*$/, ''))
    .join('\n');

const sha256Hex = async (text: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

const runPreflight = async (entry: Deployable, code: string): Promise<PreflightResult> => {
  const problems: string[] = [];
  const active = stripComments(code);
  if (active.includes('.mock-')) {
    problems.push('active code references a .mock- principal (clarinet stand-in)');
  }
  const localPrincipal = active.match(/[( ]\.[a-z0-9][a-z0-9-]*/);
  if (localPrincipal) {
    problems.push(`active code references a local principal "${localPrincipal[0].trim()}"`);
  }
  if (
    code.includes('use-trait') &&
    !active.includes("'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait")
  ) {
    problems.push('mainnet nft-trait line is not active');
  }
  const allowed = active.match(/ALLOWED-NFT-CONTRACT '(\S+?)\.xtrata/);
  if (allowed && allowed[1] !== EXPECTED_DEPLOYER) {
    problems.push(`ALLOWED-NFT-CONTRACT deployer ${allowed[1]} != expected ${EXPECTED_DEPLOYER}`);
  }
  if (entry.paymentToken && !active.includes(`'${entry.paymentToken}`)) {
    problems.push(`expected payment token '${entry.paymentToken}' not found in active code`);
  }
  if (entry.dropsV11) {
    problems.push(...inspectDropsV11Source(code, EXPECTED_DEPLOYER));
  }
  if (entry.proofOfFree) {
    if (proofOfFree.engineValidatedId === null || !proofOfFree.engineHash) {
      problems.push('Proof of Free engine inscription has not passed the on-chain verification gate');
    } else {
      problems.push(
        ...inspectProofOfFreeSource(
          code,
          EXPECTED_DEPLOYER,
          proofOfFree.engineValidatedId,
          proofOfFree.engineHash
        )
      );
    }
  }
  if (entry.livingSynthRole === 'gateway') {
    problems.push(...inspectLivingSynthGatewaySource(code, EXPECTED_DEPLOYER));
  }
  if (entry.livingSynthRole === 'registry') {
    problems.push(...inspectLivingSynthRegistrySource(code));
  }

  let alreadyDeployed = false;
  let chainStatus: PreflightResult['chainStatus'] = 'unknown';
  try {
    const response = await fetch(
      `${HIRO_API}/v2/contracts/interface/${EXPECTED_DEPLOYER}/${entry.name}`
    );
    chainStatus = classifyContractInterfaceResponse(response.ok, response.status);
    if (chainStatus === 'deployed') {
      alreadyDeployed = true;
    } else if (chainStatus === 'unknown') {
      problems.push(`Hiro contract-name check returned HTTP ${response.status}`);
    }
  } catch {
    problems.push('Hiro contract-name check failed; retry before deploying');
  }

  return {
    ok: problems.length === 0,
    problems,
    sha256: await sha256Hex(code),
    bytes: new TextEncoder().encode(code).length,
    alreadyDeployed,
    chainStatus
  };
};

const loadContract = async (name: string) => {
  const stateEntry = states.get(name)!;
  stateEntry.busy = true;
  stateEntry.error = null;
  addLog(
    stateEntry,
    'preflight',
    'info',
    'Loading the bundled immutable source and checking mainnet state.'
  );
  render();
  try {
    const code = stateEntry.entry.proofOfFree
      ? (() => {
          if (proofOfFree.engineValidatedId === null || !proofOfFree.engineHash) {
            throw new Error('Verify the inscribed engine ID and SHA-256 before generating the contract.');
          }
          return generateProofOfFreeContract(
            stateEntry.entry.code,
            proofOfFree.engineValidatedId,
            proofOfFree.engineHash
          );
        })()
      : stateEntry.entry.code;
    if (!code || code.trimStart().startsWith('<')) {
      throw new Error('bundled contract source is missing or invalid');
    }
    stateEntry.source = code;
    stateEntry.preflight = await runPreflight(stateEntry.entry, code);
    const preflight = stateEntry.preflight;
    if (preflight.ok) {
      addLog(
        stateEntry,
        'preflight',
        'success',
        `${preflight.bytes} bytes; sha256 ${preflight.sha256}; ${
          preflight.chainStatus === 'deployed' ? 'contract is live' : 'contract name is available'
        }.`
      );
    } else {
      addLog(stateEntry, 'preflight', 'error', preflight.problems.join('; '));
    }
  } catch (error) {
    stateEntry.error = error instanceof Error ? error.message : String(error);
    addLog(stateEntry, 'preflight', 'error', stateEntry.error);
  } finally {
    stateEntry.busy = false;
    render();
  }
};

const cliCommand = (entry: Deployable) =>
  `XTRATA_MAINNET_MNEMONIC="..." node scripts/mainnet-deploy-contract.mjs ${entry.name} --broadcast`;

// Contracts here are Clarity 4, matching what wallets publish — safe to sign.
const deployContract = (name: string) => {
  const stateEntry = states.get(name)!;
  if (!stateEntry.source || !stateEntry.preflight?.ok || stateEntry.preflight.alreadyDeployed)
    return;
  if (!session.isConnected || session.address !== EXPECTED_DEPLOYER) {
    stateEntry.error = `connect the deployer wallet (${EXPECTED_DEPLOYER}) first`;
    addLog(stateEntry, 'deploy', 'error', stateEntry.error);
    render();
    return;
  }
  stateEntry.busy = true;
  stateEntry.error = null;
  addLog(
    stateEntry,
    'deploy',
    'info',
    `Opening the wallet for a Clarity 4 publish at 490000 uSTX; source sha256 ${stateEntry.preflight.sha256}.`
  );
  render();
  showContractDeploy({
    contractName: stateEntry.entry.name,
    codeBody: stateEntry.source,
    clarityVersion: 4,
    // 0.49 STX, deliberately under Xverse's 0.5 fee-editor cap: if the deploy
    // sticks in the mempool, a 0.5 STX replacement at the same nonce can still
    // outbid it from the wallet (RBF requires a strictly higher fee).
    fee: 490_000n,
    appDetails,
    network: toStacksNetwork('mainnet'),
    stxAddress: session.address,
    onFinish: (payload) => {
      const txId = extractWalletTxId(payload);
      stateEntry.txId = txId;
      stateEntry.busy = false;
      if (!txId) {
        stateEntry.error = 'wallet response did not include a transaction id';
        addLog(stateEntry, 'deploy', 'error', stateEntry.error);
      } else {
        addLog(
          stateEntry,
          'deploy',
          'success',
          'Deployment submitted. Wait for confirmation, then run preflight again before using admin buttons.',
          txId
        );
      }
      render();
    },
    onCancel: () => {
      stateEntry.busy = false;
      stateEntry.error = 'deploy cancelled in wallet';
      addLog(stateEntry, 'deploy', 'warning', stateEntry.error);
      render();
    }
  });
};

const setSponsor = (name: string, sponsorPrincipal: string) => {
  const stateEntry = states.get(name)!;
  if (!session.isConnected || session.address !== EXPECTED_DEPLOYER) {
    stateEntry.error = `connect the deployer wallet (${EXPECTED_DEPLOYER}) first`;
    addLog(stateEntry, 'set-sponsor', 'error', stateEntry.error);
    render();
    return;
  }
  const principal = sponsorPrincipal.trim();
  if (!principal.startsWith('SP') || !validateStacksAddress(principal)) {
    stateEntry.error = 'enter a valid mainnet principal for the relayer sponsor';
    addLog(stateEntry, 'set-sponsor', 'error', stateEntry.error);
    render();
    return;
  }
  stateEntry.busy = true;
  stateEntry.error = null;
  addLog(stateEntry, 'set-sponsor', 'info', `Opening the wallet to set sponsor ${principal}.`);
  render();
  showContractCall({
    contractAddress: EXPECTED_DEPLOYER,
    contractName: stateEntry.entry.name,
    functionName: 'set-sponsor',
    functionArgs: [standardPrincipalCV(principal)],
    appDetails,
    network: toStacksNetwork('mainnet'),
    stxAddress: session.address,
    onFinish: (payload) => {
      const txId = extractWalletTxId(payload);
      stateEntry.txId = txId;
      stateEntry.busy = false;
      if (txId) {
        addLog(
          stateEntry,
          'set-sponsor',
          'success',
          `Sponsor update submitted for ${principal}.`,
          txId
        );
      } else {
        stateEntry.error = 'wallet response did not include a transaction id';
        addLog(stateEntry, 'set-sponsor', 'error', stateEntry.error);
      }
      render();
    },
    onCancel: () => {
      stateEntry.busy = false;
      stateEntry.error = 'set-sponsor cancelled in wallet';
      addLog(stateEntry, 'set-sponsor', 'warning', stateEntry.error);
      render();
    }
  });
};

const setBnsAttestor = (name: string, hashInput: string) => {
  const stateEntry = states.get(name)!;
  if (!stateEntry.entry.dropsV11) return;
  if (!session.isConnected || session.address !== EXPECTED_DEPLOYER) {
    stateEntry.error = `connect the deployer wallet (${EXPECTED_DEPLOYER}) first`;
    addLog(stateEntry, 'set-bns-attestor', 'error', stateEntry.error);
    render();
    return;
  }
  const normalized = buildBnsAttestorArg(hashInput);
  if (!normalized.ok) {
    stateEntry.error = normalized.error;
    addLog(stateEntry, 'set-bns-attestor', 'error', normalized.error);
    render();
    return;
  }
  stateEntry.busy = true;
  stateEntry.error = null;
  addLog(
    stateEntry,
    'set-bns-attestor',
    'info',
    `Opening the wallet to set BNS attestor hash160 0x${normalized.hex}.`
  );
  render();
  showContractCall({
    contractAddress: EXPECTED_DEPLOYER,
    contractName: stateEntry.entry.name,
    functionName: 'set-bns-attestor-pubkey-hash',
    functionArgs: [normalized.arg],
    appDetails,
    network: toStacksNetwork('mainnet'),
    stxAddress: session.address,
    onFinish: (payload) => {
      const txId = extractWalletTxId(payload);
      stateEntry.txId = txId;
      stateEntry.busy = false;
      if (txId) {
        addLog(
          stateEntry,
          'set-bns-attestor',
          'success',
          `BNS attestor update submitted for 0x${normalized.hex}.`,
          txId
        );
      } else {
        stateEntry.error = 'wallet response did not include a transaction id';
        addLog(stateEntry, 'set-bns-attestor', 'error', stateEntry.error);
      }
      render();
    },
    onCancel: () => {
      stateEntry.busy = false;
      stateEntry.error = 'set-bns-attestor-pubkey-hash cancelled in wallet';
      addLog(stateEntry, 'set-bns-attestor', 'warning', stateEntry.error);
      render();
    }
  });
};

const livingGatewayId = `${EXPECTED_DEPLOYER}.${LIVING_SYNTH_GATEWAY_NAME}`;

const formatMicroStx = (microStx: bigint) => {
  const whole = microStx / 1_000_000n;
  const fraction = (microStx % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, '');
  return fraction ? `${whole}.${fraction} STX` : `${whole} STX`;
};

const callReadJson = async (
  contractAddress: string,
  contractName: string,
  functionName: string,
  args: ReturnType<typeof uintCV>[] = []
) => {
  const response = await fetch(
    `${HIRO_API}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: EXPECTED_DEPLOYER,
        arguments: args.map((arg) => cvToHex(arg))
      })
    }
  );
  if (!response.ok) throw new Error(`${functionName} read failed with HTTP ${response.status}`);
  const payload = (await response.json()) as { okay?: boolean; result?: string; cause?: string };
  if (!payload.okay || !payload.result) {
    throw new Error(`${functionName} read failed: ${payload.cause ?? 'missing result'}`);
  }
  return cvToJSON(hexToCV(payload.result));
};

const testProofOfFreeEngine = async () => {
  const normalized = normalizeProofOfFreeEngine(
    proofOfFree.engineInput,
    proofOfFree.expectedHashInput
  );
  proofOfFree.engineValidatedId = null;
  proofOfFree.engineHash = null;
  proofOfFree.engineSize = null;
  proofOfFree.engineMime = null;
  proofOfFree.deploymentVerified = false;
  if (!normalized.ok) {
    proofOfFree.error = normalized.error;
    render();
    return;
  }
  proofOfFree.busy = true;
  proofOfFree.error = null;
  render();
  try {
    const decoded = await callReadJson(
      EXPECTED_DEPLOYER,
      LIVING_SYNTH_XTRATA_NAME,
      'get-inscription-meta',
      [uintCV(normalized.engineId)]
    );
    const meta = parseLivingSynthInscriptionMeta(decoded);
    if (!meta) throw new Error(`Engine #${normalized.engineId} returned incomplete metadata.`);
    if (!meta.sealed) throw new Error(`Engine #${normalized.engineId} is not sealed.`);
    if (meta.mimeType !== 'text/javascript') {
      throw new Error(`Engine #${normalized.engineId} has unsupported MIME ${meta.mimeType}.`);
    }
    if (meta.totalSize < 1n || meta.totalSize > 131_072n) {
      throw new Error(`Engine #${normalized.engineId} must be 1–131072 bytes.`);
    }
    const chainHash = meta.finalHash.replace(/^0x/i, '').toLowerCase();
    if (chainHash !== normalized.engineSha256) {
      throw new Error(
        `Engine hash mismatch: Xtrata reports ${chainHash}, expected ${normalized.engineSha256}.`
      );
    }
    proofOfFree.engineValidatedId = normalized.engineId;
    proofOfFree.engineHash = chainHash;
    proofOfFree.engineSize = meta.totalSize;
    proofOfFree.engineMime = meta.mimeType;
    const stateEntry = states.get(PROOF_OF_FREE_CONTRACT_NAME)!;
    stateEntry.source = null;
    stateEntry.preflight = null;
    addLog(
      stateEntry,
      'engine-test',
      'success',
      `Xtrata engine #${normalized.engineId} is sealed ${meta.mimeType}, ${meta.totalSize.toString()} bytes, SHA-256 ${chainHash}. Contract generation unlocked.`
    );
  } catch (error) {
    proofOfFree.error = error instanceof Error ? error.message : String(error);
  } finally {
    proofOfFree.busy = false;
    render();
  }
};

const createProofOfFreeCampaign = () => {
  const stateEntry = states.get(PROOF_OF_FREE_CONTRACT_NAME)!;
  if (proofOfFree.engineValidatedId === null || !proofOfFree.engineHash) {
    proofOfFree.error = 'Verify the engine inscription again before creating campaign 0.';
    render();
    return;
  }
  if (!session.isConnected || session.address !== EXPECTED_DEPLOYER) {
    proofOfFree.error = `connect the deployer wallet (${EXPECTED_DEPLOYER}) first`;
    render();
    return;
  }
  stateEntry.busy = true;
  proofOfFree.error = null;
  addLog(
    stateEntry,
    'create-campaign',
    'info',
    `Opening wallet for immutable campaign 0: engine ${proofOfFree.engineValidatedId}, supply ${PROOF_OF_FREE_COLLECTION_SIZE}, one wallet, BNS required, one BNS.`
  );
  render();
  showContractCall({
    contractAddress: EXPECTED_DEPLOYER,
    contractName: PROOF_OF_FREE_CONTRACT_NAME,
    functionName: 'create-campaign',
    functionArgs: [
      uintCV(proofOfFree.engineValidatedId),
      uintCV(PROOF_OF_FREE_COLLECTION_SIZE),
      boolCV(true),
      boolCV(true),
      boolCV(true)
    ],
    appDetails,
    network: toStacksNetwork('mainnet'),
    stxAddress: session.address,
    onFinish: (payload) => {
      const txId = extractWalletTxId(payload);
      stateEntry.txId = txId;
      stateEntry.busy = false;
      if (txId) {
        addLog(
          stateEntry,
          'create-campaign',
          'success',
          'Campaign initialization submitted. It will be campaign 0 and starts inactive.',
          txId
        );
      } else {
        proofOfFree.error = 'wallet response did not include a transaction id';
        addLog(stateEntry, 'create-campaign', 'error', proofOfFree.error);
      }
      render();
    },
    onCancel: () => {
      stateEntry.busy = false;
      proofOfFree.error = 'create-campaign cancelled in wallet';
      addLog(stateEntry, 'create-campaign', 'warning', proofOfFree.error);
      render();
    }
  });
};

const testProofOfFreeDeployment = async () => {
  if (proofOfFree.engineValidatedId === null || !proofOfFree.engineHash) {
    proofOfFree.error = 'Verify the engine inscription before testing the deployed controller.';
    render();
    return;
  }
  const stateEntry = states.get(PROOF_OF_FREE_CONTRACT_NAME)!;
  proofOfFree.busy = true;
  proofOfFree.error = null;
  proofOfFree.deploymentVerified = false;
  render();
  try {
    const [configValue, campaignValue] = await Promise.all([
      callReadJson(EXPECTED_DEPLOYER, PROOF_OF_FREE_CONTRACT_NAME, 'get-collection-config'),
      callReadJson(EXPECTED_DEPLOYER, PROOF_OF_FREE_CONTRACT_NAME, 'get-campaign', [uintCV(0)])
    ]);
    const config = parseProofOfFreeConfig(configValue);
    const campaign = parseProofOfFreeCampaign(campaignValue);
    if (!config) throw new Error('get-collection-config returned an unexpected shape.');
    if (!campaign) throw new Error('Campaign 0 does not exist or returned an unexpected shape.');
    const expectedId = BigInt(proofOfFree.engineValidatedId);
    if (
      config.engineId !== expectedId ||
      config.engineSha256 !== proofOfFree.engineHash ||
      config.campaignId !== 0n ||
      config.maxSupply !== BigInt(PROOF_OF_FREE_COLLECTION_SIZE) ||
      !config.onePerWallet ||
      !config.requireBns ||
      !config.onePerBns
    ) {
      throw new Error('Immutable controller configuration does not match the verified release.');
    }
    if (
      campaign.engineId !== expectedId ||
      campaign.maxSupply !== BigInt(PROOF_OF_FREE_COLLECTION_SIZE) ||
      campaign.dropsCreated !== 0n ||
      !campaign.onePerWallet ||
      !campaign.requireBns ||
      !campaign.onePerBns ||
      campaign.active
    ) {
      throw new Error('Campaign 0 is not the expected empty, inactive, strict launch campaign.');
    }
    proofOfFree.deploymentVerified = true;
    addLog(
      stateEntry,
      'controller-test',
      'success',
      `On-chain config and campaign 0 verified: engine ${config.engineId}, supply ${config.maxSupply}, 0 drops, inactive, BNS/wallet rules locked.`
    );
  } catch (error) {
    proofOfFree.error = error instanceof Error ? error.message : String(error);
    addLog(stateEntry, 'controller-test', 'error', proofOfFree.error);
  } finally {
    proofOfFree.busy = false;
    render();
  }
};

const downloadGeneratedContract = (name: string) => {
  const stateEntry = states.get(name);
  if (!stateEntry?.source) return;
  const blob = new Blob([stateEntry.source], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${name}.clar`;
  link.click();
  URL.revokeObjectURL(link.href);
  addLog(stateEntry, 'source-download', 'success', `Downloaded ${name}.clar for the release evidence bundle.`);
  render();
};

const refreshLivingSynthState = async () => {
  livingSynth.busy = true;
  livingSynth.error = null;
  render();
  try {
    const decoded = await callReadJson(
      EXPECTED_DEPLOYER,
      LIVING_SYNTH_REGISTRY_NAME,
      'get-system-state'
    );
    const parsed = parseLivingSynthSystemState(decoded);
    if (!parsed) throw new Error('get-system-state returned an unexpected Clarity shape');
    livingSynth.systemState = parsed;
    livingSynth.systemStateTested = true;
    livingSynth.mosaicAuditPassed = false;
    livingSynth.feeInput = (Number(parsed.recordingFee) / 1_000_000).toString();
    livingSynth.feeRecipientInput = parsed.feeRecipient;
    addLog(
      states.get(LIVING_SYNTH_REGISTRY_NAME)!,
      'state-test',
      'success',
      `owner ${parsed.contractOwner}; core ${parsed.coreContract ?? 'unlocked'}; engine ${parsed.engineId?.toString() ?? 'unset'} (${parsed.engineHash ?? 'unhashed'}); fee ${formatMicroStx(parsed.recordingFee)} to ${parsed.feeRecipient}; ${parsed.registeredEditions.toString()} editions; ${parsed.paused ? 'paused' : 'live'}.`
    );
  } catch (error) {
    livingSynth.systemState = null;
    livingSynth.systemStateTested = false;
    livingSynth.error = error instanceof Error ? error.message : String(error);
  } finally {
    livingSynth.busy = false;
    render();
  }
};

const setLivingSynthRecordingFee = () => {
  const parsed = parseRecordingFeeStx(livingSynth.feeInput);
  if (!parsed.ok) {
    livingSynth.error = parsed.error;
    render();
    return;
  }
  submitLivingSynthCall('set-recording-fee', 'set-recording-fee', [uintCV(parsed.microStx)]);
};

const setLivingSynthFeeRecipient = () => {
  const recipient = livingSynth.feeRecipientInput.trim();
  if (!recipient.startsWith('SP') || !validateStacksAddress(recipient)) {
    livingSynth.error = 'Enter a valid mainnet STX address for the fee recipient.';
    render();
    return;
  }
  submitLivingSynthCall(
    'set-fee-recipient',
    'set-fee-recipient',
    [standardPrincipalCV(recipient)]
  );
};

const submitLivingSynthCall = (
  action: string,
  functionName: string,
  functionArgs: Parameters<typeof showContractCall>[0]['functionArgs'],
  requiredSigner = livingSynth.systemState?.contractOwner ?? EXPECTED_DEPLOYER
) => {
  const registryState = states.get(LIVING_SYNTH_REGISTRY_NAME)!;
  if (!session.isConnected || session.address !== requiredSigner) {
    livingSynth.error = `connect the required admin wallet (${requiredSigner}) first`;
    render();
    return;
  }
  livingSynth.busy = true;
  livingSynth.error = null;
  addLog(registryState, action, 'info', `Opening wallet for ${functionName}.`);
  render();
  showContractCall({
    contractAddress: EXPECTED_DEPLOYER,
    contractName: LIVING_SYNTH_REGISTRY_NAME,
    functionName,
    functionArgs,
    appDetails,
    network: toStacksNetwork('mainnet'),
    stxAddress: session.address,
    onFinish: (payload) => {
      const txId = extractWalletTxId(payload);
      registryState.txId = txId;
      livingSynth.busy = false;
      livingSynth.systemStateTested = false;
      livingSynth.mosaicAuditPassed = false;
      livingSynth.mappingReadyEntries = [];
      if (txId) {
        addLog(
          registryState,
          action,
          'success',
          `${functionName} submitted. Wait for confirmation, then run the state test again.`,
          txId
        );
      } else {
        livingSynth.error = 'wallet response did not include a transaction id';
        addLog(registryState, action, 'error', livingSynth.error);
      }
      render();
    },
    onCancel: () => {
      livingSynth.busy = false;
      livingSynth.error = `${functionName} cancelled in wallet`;
      addLog(registryState, action, 'warning', livingSynth.error);
      render();
    }
  });
};

const testLivingSynthEngine = async () => {
  const engineId = Number(livingSynth.engineInput);
  livingSynth.engineValidatedId = null;
  livingSynth.engineMime = null;
  livingSynth.engineHash = null;
  livingSynth.engineSize = null;
  if (!Number.isSafeInteger(engineId) || engineId < 0) {
    livingSynth.error = 'Enter a valid Xtrata engine inscription ID.';
    render();
    return;
  }
  livingSynth.busy = true;
  livingSynth.error = null;
  render();
  try {
    const decoded = await callReadJson(
      EXPECTED_DEPLOYER,
      LIVING_SYNTH_XTRATA_NAME,
      'get-inscription-meta',
      [uintCV(engineId)]
    );
    const meta = parseLivingSynthInscriptionMeta(decoded);
    if (!meta) throw new Error(`Engine #${engineId} returned incomplete metadata.`);
    if (meta.mimeType !== 'text/javascript') throw new Error(`Engine #${engineId} has unsupported MIME ${meta.mimeType}.`);
    if (!meta.sealed) throw new Error(`Engine #${engineId} is not sealed.`);
    if (meta.totalSize < 1n || meta.totalSize > 131_072n) throw new Error(`Engine #${engineId} must be 1–131072 bytes.`);
    livingSynth.engineValidatedId = engineId;
    livingSynth.engineMime = meta.mimeType;
    livingSynth.engineHash = meta.finalHash;
    livingSynth.engineSize = meta.totalSize;
    addLog(
      states.get(LIVING_SYNTH_REGISTRY_NAME)!,
      'engine-test',
      'success',
      `Xtrata engine #${engineId} is sealed ${meta.mimeType}, ${meta.totalSize.toString()} bytes, SHA-256 ${meta.finalHash}.`
    );
  } catch (error) {
    livingSynth.error = error instanceof Error ? error.message : String(error);
  } finally {
    livingSynth.busy = false;
    render();
  }
};

const validateLivingSynthManifest = () => {
  const result = validateLivingSynthEditionManifest(livingSynth.manifestInput);
  livingSynth.mappingReadyEntries = [];
  livingSynth.mosaicAuditPassed = false;
  if (!result.ok) {
    livingSynth.manifest = [];
    livingSynth.mappingIndex = 0;
    livingSynth.error = result.problems.join(' ');
  } else {
    livingSynth.manifest = result.entries;
    livingSynth.mappingIndex = 0;
    livingSynth.error = null;
  }
  render();
};

const testNextLivingSynthMapping = async () => {
  const candidates = livingSynth.manifest.slice(livingSynth.mappingIndex, livingSynth.mappingIndex + 25);
  if (candidates.length === 0) return;
  livingSynth.busy = true;
  livingSynth.mappingReadyEntries = [];
  livingSynth.error = null;
  render();
  try {
    const checked = await Promise.all(candidates.map(async (entry) => {
      const [ownerResult, editionResult] = await Promise.all([
        callReadJson(EXPECTED_DEPLOYER, LIVING_SYNTH_XTRATA_NAME, 'get-owner', [uintCV(entry.nftId)]),
        callReadJson(EXPECTED_DEPLOYER, LIVING_SYNTH_REGISTRY_NAME, 'get-edition', [uintCV(entry.edition)])
      ]);
      if (!parseOptionalPrincipal(ownerResult)) throw new Error(`Xtrata NFT #${entry.nftId} does not exist.`);
      const current = parseLivingSynthEdition(editionResult);
      if (!current) throw new Error(`Edition ${entry.edition} returned an invalid state.`);
      if (current.nftId !== null && current.nftId !== entry.nftId) {
        throw new Error(`Edition ${entry.edition} is already mapped to Xtrata #${current.nftId}.`);
      }
      return { entry, registered: current.nftId === entry.nftId };
    }));
    while (checked[0]?.registered) {
      livingSynth.mappingIndex += 1;
      checked.shift();
    }
    livingSynth.mappingReadyEntries = checked.filter(item => !item.registered).map(item => item.entry);
    addLog(
      states.get(LIVING_SYNTH_REGISTRY_NAME)!,
      'mapping-test',
      'success',
      livingSynth.mappingReadyEntries.length > 0
        ? `${livingSynth.mappingReadyEntries.length} empty mappings passed NFT and slot checks; atomic batch registration unlocked.`
        : `${candidates.length} mappings are already confirmed on-chain.`
    );
  } catch (error) {
    livingSynth.error = error instanceof Error ? error.message : String(error);
  } finally {
    livingSynth.busy = false;
    render();
  }
};

const auditLivingSynthMosaic = async () => {
  if (livingSynth.manifest.length === 0) return;
  livingSynth.busy = true;
  livingSynth.error = null;
  livingSynth.mosaicAuditPassed = false;
  render();
  try {
    const expected = new Map(livingSynth.manifest.map((entry) => [entry.edition, entry.nftId]));
    const pages: Array<{ edition: number; nftId: number | null }> = [];
    for (let start = 0; start < LIVING_SYNTH_PAGE_COUNT; start += 4) {
      const batch = await Promise.all(
        Array.from({ length: Math.min(4, LIVING_SYNTH_PAGE_COUNT - start) }, (_, offset) =>
          callReadJson(
            EXPECTED_DEPLOYER,
            LIVING_SYNTH_REGISTRY_NAME,
            'get-mosaic-page',
            [uintCV(start + offset)]
          )
        )
      );
      for (const decoded of batch) {
        const page = parseLivingSynthMosaicPage(decoded);
        if (!page || page.length !== 32) throw new Error('A mosaic page did not contain 32 cells.');
        pages.push(...page);
      }
    }
    if (pages.length !== LIVING_SYNTH_COLLECTION_SIZE) {
      throw new Error(`Mosaic returned ${pages.length} cells instead of ${LIVING_SYNTH_COLLECTION_SIZE}.`);
    }
    for (const [edition, nftId] of expected) {
      const cell = pages.find((candidate) => candidate.edition === edition);
      if (!cell || cell.nftId !== nftId) {
        throw new Error(`Mosaic mismatch at edition ${edition}; expected Xtrata #${nftId}.`);
      }
    }
    livingSynth.mosaicAuditPassed = true;
    addLog(
      states.get(LIVING_SYNTH_REGISTRY_NAME)!,
      'mosaic-audit',
      'success',
      `All 32 pages / ${LIVING_SYNTH_COLLECTION_SIZE} cells decoded; ${expected.size} manifest mappings match.`
    );
  } catch (error) {
    livingSynth.error = error instanceof Error ? error.message : String(error);
  } finally {
    livingSynth.busy = false;
    render();
  }
};

const connect = async () => {
  session = await connectWallet(connectParams);
  render();
};

const disconnect = async () => {
  await disconnectWallet();
  session = { isConnected: false };
  render();
};

const copyLogs = async (name: string) => {
  const stateEntry = states.get(name)!;
  try {
    await navigator.clipboard.writeText(formatDeployLog(stateEntry.logs));
    addLog(stateEntry, 'log', 'success', 'Copied the deployment log to the clipboard.');
  } catch (error) {
    stateEntry.error =
      error instanceof Error ? error.message : 'Unable to copy the deployment log.';
    addLog(stateEntry, 'log', 'error', stateEntry.error);
  }
  render();
};

const clearLogs = (name: string) => {
  const stateEntry = states.get(name)!;
  stateEntry.logs = [];
  try {
    window.localStorage.removeItem(`${LOG_STORAGE_PREFIX}${name}`);
  } catch {
    // The in-memory log is still cleared when storage is unavailable.
  }
  render();
};

const copyLivingSynthLogs = async () => {
  const entries = [
    ...states.get(LIVING_SYNTH_GATEWAY_NAME)!.logs,
    ...states.get(LIVING_SYNTH_REGISTRY_NAME)!.logs
  ].sort((a, b) => a.at.localeCompare(b.at));
  try {
    await navigator.clipboard.writeText(formatDeployLog(entries));
    addLog(
      states.get(LIVING_SYNTH_REGISTRY_NAME)!,
      'log',
      'success',
      'Copied the combined Living Synth deployment log.'
    );
  } catch (error) {
    livingSynth.error = error instanceof Error ? error.message : 'Unable to copy the deployment log.';
  }
  render();
};

const el = (tag: string, props: Record<string, unknown> = {}, ...children: (Node | string)[]) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

const goLiveChecklist = () =>
  el(
    'ol',
    {},
    el('li', {}, 'Deploy confirmed (this card only appears once the contract is live).'),
    el(
      'li',
      {},
      'Call set-sponsor with the relayer hot-wallet principal (until then the sponsor defaults to the deployer).'
    ),
    el(
      'li',
      {},
      'Relayer: add the contract id to SPONSOR_MARKETS and restart the agent-one server with SPONSOR_KEY set.'
    ),
    el(
      'li',
      {},
      'Frontend: add the entry to src/data/market-registry.json with "sponsored": true and "sponsorApi".'
    ),
    el(
      'li',
      {},
      'Smoke test: list with a small deposit, sponsored buy from an STX-empty wallet, verify claim-fee and settle-refund.'
    )
  );

const dropsV11GoLiveChecklist = () =>
  el(
    'ol',
    {},
    el('li', {}, 'Confirm the deployment transaction is successful, then run preflight again.'),
    el('li', {}, 'Set the relayer sponsor principal and wait for that transaction to confirm.'),
    el(
      'li',
      {},
      'Set the 20-byte BNS attestor public-key hash and wait for that transaction to confirm.'
    ),
    el(
      'li',
      {},
      'Add the contract id to the sponsor-service and frontend allowlists before exposing claims.'
    ),
    el(
      'li',
      {},
      'Run the documented testnet rehearsal before mainnet use: campaign creation, 32-item boundary, claim, fee reimbursement, refund, pause, cancellation and recovery.'
    ),
    el(
      'li',
      {},
      'Only then authorise the Wizard operator and create the production campaign with its immutable supply and BNS rules.'
    )
  );

const proofOfFreeGoLiveChecklist = () =>
  el(
    'ol',
    {},
    el('li', {}, 'Engine inscription reconstructed with exact MIME, byte count and SHA-256.'),
    el('li', {}, 'Generated proof-of-free-v1 source downloaded and deployment confirmed.'),
    el('li', {}, 'Sponsor and BNS attestor configured and confirmed on-chain.'),
    el('li', {}, 'Campaign creation returns campaign 0 and get-campaign reports inactive with all rules true.'),
    el(
      'li',
      {},
      'Add the exact contract ID to POF_CONTRACT_ID and SPONSOR_MARKETS, then deploy the Xtrata site.'
    ),
    el(
      'li',
      {},
      'Build/inscribe the 1,024 seeds and escrow them in edition order while campaign 0 remains closed.'
    ),
    el(
      'li',
      {},
      'The contract will reject opening until drops-created is exactly 1,024. Audit registry/master before set-campaign-active.'
    )
  );

const gateBadge = (passed: boolean, readyLabel = 'READY', lockedLabel = 'LOCKED') =>
  el(
    'span',
    { className: `gate-badge ${passed ? 'ok' : 'muted'}` },
    passed ? readyLabel : lockedLabel
  );

const renderLivingSynthDeployment = () => {
  const gatewayState = states.get(LIVING_SYNTH_GATEWAY_NAME)!;
  const registryState = states.get(LIVING_SYNTH_REGISTRY_NAME)!;
  const gatewayDeployed = gatewayState.preflight?.alreadyDeployed === true;
  const registryDeployed = registryState.preflight?.alreadyDeployed === true;
  const gates = deriveLivingSynthGates({
    gatewaySourceReady: gatewayState.preflight?.ok === true,
    gatewayDeployed,
    registrySourceReady: registryState.preflight?.ok === true,
    registryDeployed,
    systemState: livingSynth.systemState,
    expectedGatewayId: livingGatewayId,
    engineValidated:
      livingSynth.engineValidatedId !== null &&
      livingSynth.engineValidatedId === Number(livingSynth.engineInput),
    manifestEntries: livingSynth.manifest.length,
    mosaicAuditPassed: livingSynth.mosaicAuditPassed
  });
  const signerReady = session.isConnected && session.address === EXPECTED_DEPLOYER;
  const adminSigner = livingSynth.systemState?.contractOwner ?? EXPECTED_DEPLOYER;
  const adminSignerReady = session.isConnected && session.address === adminSigner;
  const section = el('section', { className: 'card featured living-deploy' });
  section.append(
    el('p', { className: 'eyebrow' }, 'Special gated deployment'),
    el('h2', {}, 'Proof of Free — Living Synth v1'),
    el(
      'p',
      {},
      'Every irreversible or public step stays locked until the preceding source, chain interface, and state checks pass. All writes still require a physical confirmation in the deployer wallet.'
    )
  );

  const sourceStep = el('div', { className: 'gate-step' });
  sourceStep.append(
    el('div', { className: 'gate-heading' }, el('h2', {}, '1. Gateway source + deployment'), gateBadge(gatewayDeployed, 'CONFIRMED')),
    el('p', {}, `Target: ${livingGatewayId}`),
    el(
      'div',
      { className: 'row' },
      el(
        'button',
        {
          className: 'ghost',
          disabled: livingSynth.busy || gatewayState.busy,
          onclick: () => void loadContract(LIVING_SYNTH_GATEWAY_NAME)
        },
        gatewayState.preflight ? 'Re-test gateway source + chain' : 'Test gateway source + chain'
      )
    )
  );
  if (gatewayState.preflight?.ok && !gatewayDeployed) {
    sourceStep.append(
      el(
        'div',
        { className: 'row' },
        el(
          'button',
          {
            disabled: gatewayState.busy || !signerReady,
            onclick: () => deployContract(LIVING_SYNTH_GATEWAY_NAME)
          },
          'Deploy gateway (wallet)'
        )
      ),
      el('p', { className: 'warn' }, 'Wait for confirmation, then re-test this step. Registry deployment remains locked until the interface is live.')
    );
  }

  const registryStep = el('div', { className: 'gate-step' });
  registryStep.append(
    el('div', { className: 'gate-heading' }, el('h2', {}, '2. Registry source + deployment'), gateBadge(registryDeployed, 'CONFIRMED')),
    el('p', {}, `Target: ${EXPECTED_DEPLOYER}.${LIVING_SYNTH_REGISTRY_NAME}`),
    el(
      'div',
      { className: 'row' },
      el(
        'button',
        {
          className: 'ghost',
          disabled: livingSynth.busy || registryState.busy || !gates.preflightRegistry,
          onclick: () => void loadContract(LIVING_SYNTH_REGISTRY_NAME)
        },
        registryState.preflight ? 'Re-test registry source + chain' : 'Test registry source + chain'
      )
    )
  );
  if (gates.deployRegistry) {
    registryStep.append(
      el(
        'div',
        { className: 'row' },
        el(
          'button',
          {
            disabled: registryState.busy || !signerReady,
            onclick: () => deployContract(LIVING_SYNTH_REGISTRY_NAME)
          },
          'Deploy registry (wallet)'
        )
      )
    );
  }

  const state = livingSynth.systemState;
  const stateStep = el('div', { className: 'gate-step' });
  stateStep.append(
    el('div', { className: 'gate-heading' }, el('h2', {}, '3. Test registry state'), gateBadge(livingSynth.systemStateTested, 'TESTED')),
    el(
      'div',
      { className: 'row' },
      el(
        'button',
        {
          className: 'ghost',
          disabled: livingSynth.busy || !gates.testPristineRegistry,
          onclick: () => void refreshLivingSynthState()
        },
        'Read + test system state'
      )
    )
  );
  if (state) {
    const summary = el('dl');
    summary.append(
      el('dt', {}, 'Gateway'), el('dd', { className: gates.coreLocked ? 'ok' : 'warn' }, state.coreContract ?? 'not locked'),
      el('dt', {}, 'Contract owner'), el('dd', {}, state.contractOwner),
      el('dt', {}, 'Pending owner'), el('dd', {}, state.pendingOwner ?? 'none'),
      el('dt', {}, 'Engine'), el('dd', {}, state.engineId === null ? 'not set' : `#${state.engineId.toString()} / ${state.engineHash ?? 'hash missing'}`),
      el('dt', {}, 'Recording fee'), el('dd', { className: gates.feeReady ? 'ok' : 'fail' }, formatMicroStx(state.recordingFee)),
      el('dt', {}, 'Fee recipient'), el('dd', {}, state.feeRecipient),
      el('dt', {}, 'Editions'), el('dd', {}, state.registeredEditions.toString()),
      el('dt', {}, 'Mode'), el('dd', { className: state.paused ? 'warn' : 'ok' }, state.paused ? 'paused / safe' : 'LIVE')
    );
    stateStep.append(summary);
  }

  const lockStep = el('div', { className: 'gate-step' });
  lockStep.append(
    el('div', { className: 'gate-heading' }, el('h2', {}, '4. Permanently lock gateway'), gateBadge(gates.coreLocked, 'LOCKED ON-CHAIN')),
    el('p', { className: 'warn' }, 'Irreversible. Verify the exact gateway contract ID above, then type LOCK GATEWAY.')
  );
  if (gates.lockGateway) {
    const confirm = el('input', {
      className: 'admin-input mono-input',
      value: livingSynth.lockConfirmation,
      placeholder: 'Type LOCK GATEWAY'
    }) as HTMLInputElement;
    const lockButton = el(
      'button',
      {
        disabled: livingSynth.lockConfirmation !== 'LOCK GATEWAY' || !adminSignerReady,
        onclick: () => submitLivingSynthCall(
          'lock-gateway',
          'lock-core-contract',
          [contractPrincipalCV(EXPECTED_DEPLOYER, LIVING_SYNTH_GATEWAY_NAME)]
        )
      },
      'Lock gateway (wallet)'
    ) as HTMLButtonElement;
    confirm.oninput = () => {
      livingSynth.lockConfirmation = confirm.value;
      lockButton.disabled = confirm.value !== 'LOCK GATEWAY' || !adminSignerReady;
    };
    lockStep.append(el('div', { className: 'row' }, confirm, lockButton));
  }

  const engineStep = el('div', { className: 'gate-step' });
  engineStep.append(
    el('div', { className: 'gate-heading' }, el('h2', {}, '5. Verify + set engine inscription'), gateBadge(gates.engineSet, 'SET ON-CHAIN'))
  );
  if (gates.coreLocked && !gates.engineSet) {
    const engineInput = el('input', {
      className: 'admin-input mono-input',
      inputMode: 'numeric',
      value: livingSynth.engineInput,
      placeholder: 'Xtrata engine inscription ID'
    }) as HTMLInputElement;
    engineInput.oninput = () => {
      livingSynth.engineInput = engineInput.value;
      livingSynth.engineValidatedId = null;
      livingSynth.engineMime = null;
      livingSynth.engineHash = null;
      livingSynth.engineSize = null;
    };
    engineStep.append(
      el(
        'div',
        { className: 'row' },
        engineInput,
        el('button', { className: 'ghost', disabled: livingSynth.busy, onclick: () => void testLivingSynthEngine() }, 'Test inscription'),
        el(
          'button',
          {
            disabled: !gates.setEngine || !adminSignerReady,
            onclick: () => submitLivingSynthCall(
              'set-engine',
              'set-engine',
              [
                contractPrincipalCV(EXPECTED_DEPLOYER, LIVING_SYNTH_GATEWAY_NAME),
                uintCV(livingSynth.engineValidatedId!)
              ]
            )
          },
          'Set tested engine (wallet)'
        )
      )
    );
  }
  if (livingSynth.engineValidatedId !== null) {
    engineStep.append(el('p', { className: 'ok' }, `Test passed: Xtrata #${livingSynth.engineValidatedId}, sealed ${livingSynth.engineMime}, ${livingSynth.engineSize?.toString()} bytes, SHA-256 ${livingSynth.engineHash}.`));
  }

  const feeStep = el('div', { className: 'gate-step' });
  feeStep.append(
    el('div', { className: 'gate-heading' }, el('h2', {}, '6. Verify + configure recording fee'), gateBadge(gates.feeReady, 'VALID ON-CHAIN')),
    el('p', {}, 'Every registered child pays this amount. The contract enforces 0.001–1 STX; its deployment default is 0.1 STX paid to the deployer. Either value can be updated later by the deployer wallet.')
  );
  if (gates.configureFees) {
    const feeInput = el('input', {
      className: 'admin-input mono-input',
      inputMode: 'decimal',
      value: livingSynth.feeInput,
      placeholder: 'Fee in STX (0.001–1)'
    }) as HTMLInputElement;
    feeInput.oninput = () => { livingSynth.feeInput = feeInput.value; };
    const recipientInput = el('input', {
      className: 'admin-input mono-input',
      value: livingSynth.feeRecipientInput,
      placeholder: 'Fee recipient SP…'
    }) as HTMLInputElement;
    recipientInput.oninput = () => { livingSynth.feeRecipientInput = recipientInput.value; };
    feeStep.append(
      el(
        'div',
        { className: 'row' },
        feeInput,
        el('button', { disabled: livingSynth.busy || !adminSignerReady, onclick: setLivingSynthRecordingFee }, 'Set fee (wallet)')
      ),
      el(
        'div',
        { className: 'row' },
        recipientInput,
        el('button', { disabled: livingSynth.busy || !adminSignerReady, onclick: setLivingSynthFeeRecipient }, 'Set recipient (wallet)')
      ),
      el('p', { className: 'muted' }, 'After either transaction confirms, run “Read + test system state” again. Edition registration remains gated on a valid on-chain fee and recipient.')
    );
  }

  const ownershipStep = el('div', { className: 'gate-step' });
  ownershipStep.append(
    el('div', { className: 'gate-heading' }, el('h2', {}, '7. Optional two-step admin handover'), gateBadge(Boolean(state?.pendingOwner), 'PENDING')),
    el('p', {}, 'Ownership cannot move in one transaction. The current owner nominates an address; only that exact address can accept. The current owner can cancel while the handover is pending.')
  );
  if (state) {
    const newOwnerInput = el('input', {
      className: 'admin-input mono-input',
      value: livingSynth.newOwnerInput,
      placeholder: 'New owner SP…'
    }) as HTMLInputElement;
    const proposed = livingSynth.newOwnerInput.trim();
    const proposedValid = proposed.startsWith('SP') && validateStacksAddress(proposed);
    const nominateButton = el('button', {
      disabled: livingSynth.busy || !adminSignerReady || !proposedValid,
      onclick: () => {
        const candidate = livingSynth.newOwnerInput.trim();
        if (!candidate.startsWith('SP') || !validateStacksAddress(candidate)) return;
        submitLivingSynthCall(
          'initiate-owner-transfer',
          'initiate-contract-ownership-transfer',
          [standardPrincipalCV(candidate)]
        );
      }
    }, 'Nominate owner (wallet)') as HTMLButtonElement;
    newOwnerInput.oninput = () => {
      livingSynth.newOwnerInput = newOwnerInput.value;
      const candidate = newOwnerInput.value.trim();
      nominateButton.disabled = livingSynth.busy || !adminSignerReady || !candidate.startsWith('SP') || !validateStacksAddress(candidate);
    };
    ownershipStep.append(
      el(
        'div',
        { className: 'row' },
        newOwnerInput,
        nominateButton
      )
    );
    if (state.pendingOwner) {
      ownershipStep.append(
        el('p', { className: 'warn' }, `Pending owner: ${state.pendingOwner}`),
        el(
          'div',
          { className: 'row' },
          el('button', {
            className: 'ghost',
            disabled: livingSynth.busy || !adminSignerReady,
            onclick: () => submitLivingSynthCall('cancel-owner-transfer', 'cancel-contract-ownership-transfer', [])
          }, 'Cancel handover'),
          el('button', {
            disabled: livingSynth.busy || session.address !== state.pendingOwner,
            onclick: () => submitLivingSynthCall(
              'accept-owner-transfer',
              'accept-contract-ownership',
              [],
              state.pendingOwner!
            )
          }, 'Accept as pending owner')
        )
      );
    }
  }

  const mappingStep = el('div', { className: 'gate-step' });
  mappingStep.append(
    el('div', { className: 'gate-heading' }, el('h2', {}, '8. Validate + register edition mappings'), gateBadge(gates.mappingComplete, 'MANIFEST MATCHED')),
    el('p', {}, 'Paste [{"edition":1,"nftId":123}, …]. The console rejects duplicates and tests NFT existence plus the current edition slot in groups of up to 25, then registers each tested group atomically. A partial claimed-edition manifest is valid when every supplied mapping matches on-chain.')
  );
  if (gates.registerEditions) {
    const manifestInput = el('textarea', {
      className: 'manifest-input mono-input',
      value: livingSynth.manifestInput,
      placeholder: '[{"edition":1,"nftId":123}]'
    }) as HTMLTextAreaElement;
    manifestInput.oninput = () => { livingSynth.manifestInput = manifestInput.value; };
    mappingStep.append(
      manifestInput,
      el('div', { className: 'row' }, el('button', { className: 'ghost', onclick: validateLivingSynthManifest }, 'Validate manifest'))
    );
  }
  if (livingSynth.manifest.length > 0) {
    const entry = livingSynth.manifest[livingSynth.mappingIndex];
    mappingStep.append(
      el('p', { className: 'ok' }, `Manifest valid: ${livingSynth.manifest.length} unique mappings. Leading on-chain confirmations: ${livingSynth.mappingIndex}.`)
    );
    if (entry) {
      mappingStep.append(
        el('p', {}, `Next: edition ${entry.edition} → Xtrata #${entry.nftId}`),
        el(
          'div',
          { className: 'row' },
          el('button', { className: 'ghost', disabled: livingSynth.busy, onclick: () => void testNextLivingSynthMapping() }, 'Test next batch (max 25)'),
          el(
            'button',
            {
              disabled: livingSynth.mappingReadyEntries.length === 0 || !adminSignerReady,
              onclick: () => {
                const entries = livingSynth.mappingReadyEntries;
                livingSynth.mappingReadyEntries = [];
                submitLivingSynthCall(
                  'register-edition-batch',
                  'register-edition-batch',
                  [
                    listCV(entries.map(item => tupleCV({
                      edition: uintCV(item.edition),
                      'nft-id': uintCV(item.nftId)
                    })))
                  ]
                );
              }
            },
            `Register tested batch (${livingSynth.mappingReadyEntries.length})`
          )
        )
      );
    }
  }

  const liveStep = el('div', { className: 'gate-step' });
  liveStep.append(
    el('div', { className: 'gate-heading' }, el('h2', {}, '9. Audit mosaic + go live'), gateBadge(state?.paused === false, 'LIVE')),
    el(
      'div',
      { className: 'row' },
      el(
        'button',
        {
          className: 'ghost',
          disabled: livingSynth.busy || !gates.auditMosaic,
          onclick: () => void auditLivingSynthMosaic()
        },
        'Audit 32 pages / 1,024 cells'
      )
    )
  );
  if (livingSynth.mosaicAuditPassed && state?.paused) {
    const liveInput = el('input', {
      className: 'admin-input mono-input',
      value: livingSynth.liveConfirmation,
      placeholder: 'Type GO LIVE'
    }) as HTMLInputElement;
    const liveButton = el(
      'button',
      {
        disabled: livingSynth.liveConfirmation !== 'GO LIVE' || !gates.goLive || !adminSignerReady,
        onclick: () => submitLivingSynthCall('go-live', 'set-paused', [boolCV(false)])
      },
      'Unpause Living Synth (wallet)'
    ) as HTMLButtonElement;
    liveInput.oninput = () => {
      livingSynth.liveConfirmation = liveInput.value;
      liveButton.disabled = liveInput.value !== 'GO LIVE' || !gates.goLive || !adminSignerReady;
    };
    liveStep.append(
      el('p', { className: 'warn' }, 'The sources, gateway, engine, mapping count, and all mosaic pages have passed. Type GO LIVE to expose owner recording writes.'),
      el('div', { className: 'row' }, liveInput, liveButton)
    );
  }
  if (livingSynth.error) section.append(el('p', { className: 'fail' }, livingSynth.error));
  section.append(sourceStep, registryStep, stateStep, lockStep, engineStep, feeStep, ownershipStep, mappingStep, liveStep);
  const combinedLogs = [...gatewayState.logs, ...registryState.logs].sort((a, b) =>
    a.at.localeCompare(b.at)
  );
  section.append(el('h2', { className: 'log-title' }, 'Living Synth deployment log'));
  if (combinedLogs.length > 0) {
    section.append(
      el('pre', { className: 'deploy-log', textContent: formatDeployLog(combinedLogs) }),
      el(
        'div',
        { className: 'row' },
        el('button', { className: 'ghost', onclick: () => void copyLivingSynthLogs() }, 'Copy combined log')
      )
    );
  } else {
    section.append(el('p', { className: 'muted' }, 'No Living Synth deployment events yet.'));
  }
  return section;
};

const render = () => {
  const app = document.getElementById('app');
  if (!app) return;
  app.replaceChildren();

  // wallet card
  const walletCard = el('div', { className: 'card' });
  walletCard.append(el('h2', {}, 'Signer'));
  if (session.isConnected && session.address) {
    const matches = session.address === EXPECTED_DEPLOYER;
    walletCard.append(
      el(
        'p',
        { className: matches ? 'ok' : 'fail' },
        matches
          ? `Connected as the deployer: ${session.address}`
          : `Connected wallet ${session.address} is NOT the deployer ${EXPECTED_DEPLOYER} — deploys are locked.`
      ),
      el(
        'div',
        { className: 'row' },
        el('button', { className: 'ghost', onclick: disconnect }, 'Disconnect')
      )
    );
  } else {
    walletCard.append(
      el('p', {}, 'Connect the admin wallet to unlock deploys.'),
      el('div', { className: 'row' }, el('button', { onclick: connect }, 'Connect wallet'))
    );
  }
  app.append(walletCard);

  app.append(renderLivingSynthDeployment());

  for (const stateEntry of states.values()) {
    const { entry, preflight, txId, error, busy, logs } = stateEntry;
    if (entry.livingSynthRole) continue;
    const card = el('div', { className: entry.dropsV11 ? 'card featured' : 'card' });
    card.append(
      el(
        'h2',
        {},
        entry.proofOfFree
          ? 'Proof of Free v1 — Living Synth v3 controller'
          : entry.dropsV11
          ? 'Drops v1.1 — campaign deployment'
          : `${EXPECTED_DEPLOYER.slice(0, 8)}….${entry.name}`
      ),
      el('p', {}, entry.notes)
    );

    if (entry.proofOfFree) {
      const engineInput = el('input', {
        className: 'admin-input mono-input',
        placeholder: 'Confirmed engine inscription ID',
        value: proofOfFree.engineInput
      }) as HTMLInputElement;
      const hashInput = el('input', {
        className: 'admin-input mono-input',
        placeholder: 'Expected engine SHA-256',
        value: proofOfFree.expectedHashInput
      }) as HTMLInputElement;
      const invalidateEngineGate = () => {
        proofOfFree.engineInput = engineInput.value;
        proofOfFree.expectedHashInput = hashInput.value;
        proofOfFree.engineValidatedId = null;
        proofOfFree.engineHash = null;
        proofOfFree.deploymentVerified = false;
        stateEntry.source = null;
        stateEntry.preflight = null;
      };
      engineInput.oninput = invalidateEngineGate;
      hashInput.oninput = invalidateEngineGate;
      card.append(
        el(
          'p',
          { className: 'warn' },
          'Engine first: inscribe the exact v3 JavaScript artifact, then enter its Xtrata ID. The expected candidate hash is prefilled; the console reads sealed metadata from Xtrata and will reject any mismatch.'
        ),
        el(
          'p',
          { className: 'muted' },
          'Local artifact: Proof-of-Free/Living-Synth-v3/artifacts/proof-of-free-engine-v3.js'
        ),
        el(
          'div',
          { className: 'row' },
          engineInput,
          hashInput,
          el(
            'button',
            {
              className: 'ghost',
              disabled: proofOfFree.busy,
              onclick: () => void testProofOfFreeEngine()
            },
            proofOfFree.busy ? 'Checking engine…' : '0. Verify inscribed engine'
          )
        )
      );
      if (proofOfFree.engineValidatedId !== null) {
        card.append(
          el(
            'p',
            { className: 'ok' },
            `Verified Xtrata #${proofOfFree.engineValidatedId}: ${proofOfFree.engineMime}, ${proofOfFree.engineSize?.toString()} bytes, SHA-256 ${proofOfFree.engineHash}.`
          )
        );
      }
      if (proofOfFree.error) card.append(el('p', { className: 'fail' }, proofOfFree.error));
    }

    const dl = el('dl');
    dl.append(
      el('dt', {}, 'Contract id'),
      el('dd', {}, `${EXPECTED_DEPLOYER}.${entry.name}`),
      el('dt', {}, 'Source'),
      el('dd', {}, entry.source),
      el('dt', {}, 'Publish version'),
      el('dd', {}, 'Clarity 4')
    );
    if (entry.paymentToken) {
      dl.append(el('dt', {}, 'Payment token'), el('dd', {}, entry.paymentToken));
    }
    if (preflight) {
      dl.append(
        el('dt', {}, 'Bytes / sha256'),
        el('dd', {}, `${preflight.bytes} / ${preflight.sha256}`),
        el('dt', {}, 'Preflight'),
        el(
          'dd',
          { className: preflight.ok ? 'ok' : 'fail' },
          preflight.ok
            ? preflight.alreadyDeployed
              ? 'OK — already deployed'
              : 'OK — ready for wallet deploy'
            : 'FAILED'
        )
      );
    }
    card.append(dl);

    if (preflight && !preflight.ok) {
      card.append(el('pre', {}, preflight.problems.map((problem) => `- ${problem}`).join('\n')));
    }
    if (error) {
      card.append(el('p', { className: 'fail' }, error));
    }
    if (txId) {
      const link = el('a', {
        href: `https://explorer.hiro.so/txid/0x${txId.replace(/^0x/, '')}?chain=mainnet`,
        target: '_blank',
        rel: 'noreferrer',
        textContent: `tx 0x${txId.replace(/^0x/, '').slice(0, 12)}… on the explorer`
      });
      card.append(el('p', { className: 'ok' }, 'Signed and broadcast: ', link));
    }

    const row = el('div', { className: 'row' });
    row.append(
      el(
        'button',
        {
          className: 'ghost',
          disabled:
            busy ||
            (entry.proofOfFree && proofOfFree.engineValidatedId === null),
          onclick: () => void loadContract(entry.name)
        },
        preflight ? '1. Re-run preflight / chain check' : '1. Load + preflight'
      )
    );
    if (entry.proofOfFree && stateEntry.source && preflight?.ok) {
      row.append(
        el(
          'button',
          { className: 'ghost', onclick: () => downloadGeneratedContract(entry.name) },
          'Download generated .clar'
        )
      );
    }
    card.append(row);

    // Deploy: wallet-signed. The contracts are Clarity 4, which is exactly
    // what wallets publish, so physical signing is safe (no key handling).
    if (preflight?.ok && !preflight.alreadyDeployed) {
      card.append(
        el(
          'div',
          { className: 'row' },
          el(
            'button',
            {
              disabled: busy || !session.isConnected || session.address !== EXPECTED_DEPLOYER,
              onclick: () => deployContract(entry.name)
            },
            busy ? 'Working…' : '2. Deploy (sign in wallet)'
          )
        ),
        el(
          'p',
          {},
          entry.proofOfFree
            ? 'Contract is generated from the audited Drops v1.1 base and the verified engine binding. Download the generated source before signing so it is retained in the release evidence bundle.'
            : 'Contract is Clarity 4 — matches what the wallet publishes, verified by the clarinet suite. CLI fallback:'
        ),
        ...(entry.proofOfFree ? [] : [el('pre', {}, cliCommand(entry))]),
        el(
          'p',
          {},
          'After it confirms, hit Re-run preflight — this card flips to the post-deploy admin step.'
        )
      );
    }

    // Post-deploy: wallet-signed admin calls (ordinary contract calls — safe).
    if (preflight?.alreadyDeployed && entry.sponsoredMarket) {
      const sponsorInput = el('input', {
        placeholder: 'Relayer sponsor principal (SP…)',
        className: 'admin-input'
      }) as HTMLInputElement;
      const attestorInput = entry.dropsV11
        ? (el('input', {
            placeholder: 'BNS attestor hash160 (40 hex characters)',
            className: 'admin-input mono-input'
          }) as HTMLInputElement)
        : null;
      card.append(
        el('h2', {}, 'Deployed — post-deploy admin'),
        el(
          'div',
          { className: 'row' },
          sponsorInput,
          el(
            'button',
            {
              disabled: busy || !session.isConnected || session.address !== EXPECTED_DEPLOYER,
              onclick: () => setSponsor(entry.name, sponsorInput.value)
            },
            busy ? 'Working…' : '3. Set sponsor (sign in wallet)'
          )
        )
      );
      if (entry.dropsV11 && attestorInput) {
        card.append(
          el(
            'p',
            { className: 'warn' },
            'Use the hash160 of the compressed public key held by the BNS attestation service—not a private key and not a BNS-name hash.'
          ),
          el(
            'div',
            { className: 'row' },
            attestorInput,
            el(
              'button',
              {
                disabled: busy || !session.isConnected || session.address !== EXPECTED_DEPLOYER,
                onclick: () => setBnsAttestor(entry.name, attestorInput.value)
              },
              busy ? 'Working…' : '4. Set BNS attestor (sign in wallet)'
            )
          )
        );
      }
      if (entry.proofOfFree) {
        card.append(
          el(
            'p',
            { className: 'warn' },
            'Create the campaign only after sponsor and BNS-attestor transactions are confirmed. The contract accepts exactly campaign 0 with engine ID above, supply 1,024, and all three rules true; it starts inactive.'
          ),
          el(
            'div',
            { className: 'row' },
            el(
              'button',
              {
                disabled:
                  busy ||
                  proofOfFree.engineValidatedId === null ||
                  !session.isConnected ||
                  session.address !== EXPECTED_DEPLOYER,
                onclick: () => createProofOfFreeCampaign()
              },
              busy ? 'Working…' : '5. Create locked campaign 0'
            )
          ),
          el(
            'div',
            { className: 'row' },
            el(
              'button',
              {
                className: 'ghost',
                disabled:
                  proofOfFree.busy ||
                  proofOfFree.engineValidatedId === null,
                onclick: () => void testProofOfFreeDeployment()
              },
              proofOfFree.busy ? 'Testing…' : '6. Verify contract + campaign 0'
            ),
            proofOfFree.deploymentVerified
              ? el('span', { className: 'ok' }, 'On-chain controller and closed campaign verified')
              : el('span', { className: 'muted' }, 'Run after campaign transaction confirms')
          )
        );
      }
      card.append(
        el('h2', {}, 'Go-live checklist'),
        entry.proofOfFree
          ? proofOfFreeGoLiveChecklist()
          : entry.dropsV11
            ? dropsV11GoLiveChecklist()
            : goLiveChecklist()
      );
    }

    card.append(el('h2', { className: 'log-title' }, 'Deployment log'));
    if (logs.length > 0) {
      card.append(
        el('pre', { className: 'deploy-log', textContent: formatDeployLog(logs) }),
        el(
          'div',
          { className: 'row' },
          el(
            'button',
            { className: 'ghost', onclick: () => void copyLogs(entry.name) },
            'Copy log'
          ),
          el('button', { className: 'ghost', onclick: () => clearLogs(entry.name) }, 'Clear log')
        )
      );
    } else {
      card.append(
        el(
          'p',
          { className: 'muted' },
          'No events yet. Preflight, wallet submissions, cancellations and transaction IDs will appear here.'
        )
      );
    }
    app.append(card);
  }
};

render();
