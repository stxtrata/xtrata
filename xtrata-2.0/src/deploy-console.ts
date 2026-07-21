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
import { standardPrincipalCV, validateStacksAddress } from '@stacks/transactions';
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
// Contract sources are bundled at build time (?raw) — no dev-server fetch,
// so the preflight always hashes exactly what is in the repo. (The previous
// fetch('/contracts/…') could receive the SPA HTML fallback instead.)
import sponsoredStxSource from '../contracts/live/xtrata-market-sponsored-stx-v1.1.clar?raw';
import sponsoredSbtcSource from '../contracts/live/xtrata-market-sponsored-sbtc-v1.1.clar?raw';
import sponsoredUsdcxSource from '../contracts/live/xtrata-market-sponsored-usdcx-v1.1.clar?raw';
import dropsSource from '../contracts/live/xtrata-drops-v1.0.clar?raw';
import dropsV11Source from '../contracts/live/xtrata-drops-v1.1.clar?raw';

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
  paymentToken?: string;
};

const DEPLOYABLE: Deployable[] = [
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
    const code = stateEntry.entry.code;
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

  for (const stateEntry of states.values()) {
    const { entry, preflight, txId, error, busy, logs } = stateEntry;
    const card = el('div', { className: entry.dropsV11 ? 'card featured' : 'card' });
    card.append(
      el(
        'h2',
        {},
        entry.dropsV11
          ? 'Drops v1.1 — campaign deployment'
          : `${EXPECTED_DEPLOYER.slice(0, 8)}….${entry.name}`
      ),
      el('p', {}, entry.notes)
    );

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
        { className: 'ghost', disabled: busy, onclick: () => void loadContract(entry.name) },
        preflight ? '1. Re-run preflight / chain check' : '1. Load + preflight'
      )
    );
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
          'Contract is Clarity 4 — matches what the wallet publishes, verified by the clarinet suite. CLI fallback:'
        ),
        el('pre', {}, cliCommand(entry)),
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
      card.append(
        el('h2', {}, 'Go-live checklist'),
        entry.dropsV11 ? dropsV11GoLiveChecklist() : goLiveChecklist()
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
