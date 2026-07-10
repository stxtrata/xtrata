/**
 * Xtrata Deploy Console — browser deploys signed by the admin wallet.
 *
 * Same trust model as the v3.2.3 handover page: the page never sees a key;
 * the connected wallet must be the production deployer, and every deploy is
 * signed physically in the wallet popup. ClarityVersion 3 is passed on the
 * deploy options (verify the wallet honoured it on the explorer after
 * confirmation — Clarity is shown on the contract page).
 *
 * The deployable registry mirrors scripts/mainnet-deploy-contract.mjs, and
 * the preflight applies the same rules in-browser.
 */
import { connectWallet, disconnectWallet, showContractDeploy } from './lib/wallet/connect';
import { toStacksNetwork } from './lib/network/stacks';
import type { WalletSession } from './lib/wallet/types';

const EXPECTED_DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const HIRO_API = 'https://api.hiro.so';

type Deployable = {
  name: string;
  source: string;
  notes: string;
  sponsoredMarket?: boolean;
  paymentToken?: string;
};

const DEPLOYABLE: Deployable[] = [
  {
    name: 'xtrata-market-sponsored-sbtc-v1-0',
    source: 'contracts/live/xtrata-market-sponsored-sbtc-v1.0.clar',
    sponsoredMarket: true,
    paymentToken: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token',
    notes: 'sBTC marketplace with seller-funded fee sponsorship (STX-free buys).'
  },
  {
    name: 'xtrata-market-sponsored-usdcx-v1-0',
    source: 'contracts/live/xtrata-market-sponsored-usdcx-v1.0.clar',
    sponsoredMarket: true,
    paymentToken: 'SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx',
    notes: 'USDCx marketplace with seller-funded fee sponsorship (STX-free buys).'
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
};

type ContractState = {
  entry: Deployable;
  source: string | null;
  preflight: PreflightResult | null;
  txId: string | null;
  error: string | null;
  busy: boolean;
};

let session: WalletSession = { isConnected: false };
const states = new Map<string, ContractState>(
  DEPLOYABLE.map((entry) => [
    entry.name,
    { entry, source: null, preflight: null, txId: null, error: null, busy: false }
  ])
);

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

  let alreadyDeployed = false;
  try {
    const response = await fetch(
      `${HIRO_API}/v2/contracts/interface/${EXPECTED_DEPLOYER}/${entry.name}`
    );
    alreadyDeployed = response.ok;
  } catch {
    // network hiccup: leave as unknown/false — the wallet will reject a duplicate anyway
  }
  if (alreadyDeployed) {
    problems.push(`contract ${EXPECTED_DEPLOYER}.${entry.name} is already deployed`);
  }

  return {
    ok: problems.length === 0,
    problems,
    sha256: await sha256Hex(code),
    bytes: new TextEncoder().encode(code).length,
    alreadyDeployed
  };
};

const loadContract = async (name: string) => {
  const stateEntry = states.get(name)!;
  stateEntry.busy = true;
  stateEntry.error = null;
  render();
  try {
    const response = await fetch(`/${stateEntry.entry.source}`);
    if (!response.ok) {
      throw new Error(`could not fetch /${stateEntry.entry.source} (${response.status})`);
    }
    const code = await response.text();
    stateEntry.source = code;
    stateEntry.preflight = await runPreflight(stateEntry.entry, code);
  } catch (error) {
    stateEntry.error = error instanceof Error ? error.message : String(error);
  } finally {
    stateEntry.busy = false;
    render();
  }
};

const deployContract = (name: string) => {
  const stateEntry = states.get(name)!;
  if (!stateEntry.source || !stateEntry.preflight?.ok) return;
  if (!session.isConnected || session.address !== EXPECTED_DEPLOYER) {
    stateEntry.error = `connect the deployer wallet (${EXPECTED_DEPLOYER}) first`;
    render();
    return;
  }
  stateEntry.busy = true;
  stateEntry.error = null;
  render();
  showContractDeploy({
    contractName: stateEntry.entry.name,
    codeBody: stateEntry.source,
    clarityVersion: 3,
    appDetails,
    network: toStacksNetwork('mainnet'),
    stxAddress: session.address,
    onFinish: (payload) => {
      const txId =
        (payload as { txId?: string; txid?: string }).txId ??
        (payload as { txid?: string }).txid ??
        null;
      stateEntry.txId = txId;
      stateEntry.busy = false;
      if (!txId) {
        stateEntry.error = 'wallet response did not include a transaction id';
      }
      render();
    },
    onCancel: () => {
      stateEntry.busy = false;
      stateEntry.error = 'deploy cancelled in wallet';
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

const el = (tag: string, props: Record<string, unknown> = {}, ...children: (Node | string)[]) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

const goLiveChecklist = () =>
  el(
    'ol',
    {},
    el('li', {}, 'Wait for the deploy to confirm on the explorer.'),
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
      el('div', { className: 'row' }, el('button', { className: 'ghost', onclick: disconnect }, 'Disconnect'))
    );
  } else {
    walletCard.append(
      el('p', {}, 'Connect the admin wallet to unlock deploys.'),
      el('div', { className: 'row' }, el('button', { onclick: connect }, 'Connect wallet'))
    );
  }
  app.append(walletCard);

  for (const stateEntry of states.values()) {
    const { entry, preflight, txId, error, busy } = stateEntry;
    const card = el('div', { className: 'card' });
    card.append(
      el('h2', {}, `${EXPECTED_DEPLOYER.slice(0, 8)}….${entry.name}`),
      el('p', {}, entry.notes)
    );

    const dl = el('dl');
    dl.append(el('dt', {}, 'Source'), el('dd', {}, entry.source));
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
          preflight.ok ? 'OK — safe to sign' : 'FAILED'
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
        textContent: `deploy tx 0x${txId.replace(/^0x/, '').slice(0, 12)}… on the explorer`
      });
      card.append(el('p', { className: 'ok' }, 'Signed and broadcast: ', link));
      if (entry.sponsoredMarket) {
        card.append(el('h2', {}, 'Go-live checklist'), goLiveChecklist());
      }
    }

    const row = el('div', { className: 'row' });
    row.append(
      el(
        'button',
        { className: 'ghost', disabled: busy, onclick: () => void loadContract(entry.name) },
        preflight ? 'Re-run preflight' : 'Load + preflight'
      ),
      el(
        'button',
        {
          disabled:
            busy ||
            !preflight?.ok ||
            !!txId ||
            !session.isConnected ||
            session.address !== EXPECTED_DEPLOYER,
          onclick: () => deployContract(entry.name)
        },
        busy ? 'Working…' : 'Deploy (sign in wallet)'
      )
    );
    card.append(row);
    app.append(card);
  }
};

render();
