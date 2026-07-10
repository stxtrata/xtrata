/**
 * Xtrata Sponsor Ops — guided go-live console for the sponsored markets.
 *
 * Automates the whole relayer setup as a checklist with live on-chain status;
 * every transaction (funding transfer, set-sponsor) is signed manually in the
 * connected admin wallet. The relayer hot-wallet key is generated locally in
 * the browser (crypto.getRandomValues) and shown ONCE — save it to a password
 * manager; it is never sent anywhere and only ever holds a small STX float.
 *
 * Steps:
 *   1. Relayer hot wallet — generate fresh key (or paste an existing address)
 *   2. Fund it — wallet-signed STX transfer from the admin wallet
 *   3. Authorise — set-sponsor on both sponsored markets (live state shown)
 *   4. Run the relayer — exact command with the key filled in + reachability probe
 *   5. Smoke test — live listing counts + link to /market
 */
import {
  connectWallet,
  disconnectWallet,
  showContractCall,
  showStxTransfer
} from './lib/wallet/connect';
import { toStacksNetwork } from './lib/network/stacks';
import type { WalletSession } from './lib/wallet/types';
import {
  cvToJSON,
  hexToCV,
  standardPrincipalCV,
  getAddressFromPrivateKey,
  TransactionVersion
} from '@stacks/transactions';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const HIRO_API = 'https://api.hiro.so';
const MARKETS = [
  'xtrata-market-sponsored-sbtc-v1-0',
  'xtrata-market-sponsored-usdcx-v1-0'
];
const RECOMMENDED_FLOAT_USTX = 20_000_000n; // 20 STX
const RELAYER_URL = 'http://127.0.0.1:8787';

const appDetails = { name: 'Xtrata Sponsor Ops', icon: `${window.location.origin}/favicon.svg` };
const connectParams = { appName: appDetails.name, appIcon: appDetails.icon };

type OpsState = {
  session: WalletSession;
  relayerKey: string | null; // shown once; kept in memory only
  relayerAddress: string | null;
  balanceUstx: bigint | null;
  sponsors: Record<string, string | null>; // market → current on-chain sponsor
  lastListingIds: Record<string, string | null>;
  relayerUp: boolean | null;
  pendingTx: Record<string, string>; // step key → txid
  errors: Record<string, string>;
  busy: Record<string, boolean>;
};

const state: OpsState = {
  session: { isConnected: false },
  relayerKey: null,
  relayerAddress: localStorage.getItem('xtrata-sponsor-address'),
  balanceUstx: null,
  sponsors: {},
  lastListingIds: {},
  relayerUp: null,
  pendingTx: {},
  errors: {},
  busy: {}
};

// ---------------------------------------------------------------- chain reads

const callRead = async (contractName: string, fn: string, args: string[] = []) => {
  const response = await fetch(
    `${HIRO_API}/v2/contracts/call-read/${DEPLOYER}/${contractName}/${fn}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: DEPLOYER, arguments: args })
    }
  );
  if (!response.ok) throw new Error(`read ${fn} failed (${response.status})`);
  const payload = (await response.json()) as { okay: boolean; result?: string };
  if (!payload.okay || !payload.result) throw new Error(`read ${fn} returned no result`);
  return cvToJSON(hexToCV(payload.result));
};

const refreshChainState = async () => {
  if (state.relayerAddress) {
    try {
      const r = await fetch(`${HIRO_API}/extended/v1/address/${state.relayerAddress}/stx`);
      const j = (await r.json()) as { balance?: string };
      state.balanceUstx = BigInt(j.balance ?? '0');
    } catch {
      state.balanceUstx = null;
    }
  }
  for (const market of MARKETS) {
    try {
      const sponsor = await callRead(market, 'get-sponsor');
      state.sponsors[market] = String(sponsor?.value?.value ?? sponsor?.value ?? '');
    } catch {
      state.sponsors[market] = null;
    }
    try {
      const last = await callRead(market, 'get-last-listing-id');
      state.lastListingIds[market] = String(last?.value?.value ?? '0');
    } catch {
      state.lastListingIds[market] = null;
    }
  }
  // Reachability probe only: the relayer serves same-origin (no CORS), so an
  // opaque no-cors response resolving means "something is listening".
  try {
    await fetch(`${RELAYER_URL}/api/health`, { mode: 'no-cors' });
    state.relayerUp = true;
  } catch {
    state.relayerUp = false;
  }
  render();
};

// ---------------------------------------------------------------- actions

const generateKey = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const key = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('') + '01';
  state.relayerKey = key;
  state.relayerAddress = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
  localStorage.setItem('xtrata-sponsor-address', state.relayerAddress);
  render();
  void refreshChainState();
};

const useExistingAddress = (address: string) => {
  const trimmed = address.trim();
  if (!/^S[PM][A-Z0-9]{38,40}$/.test(trimmed)) {
    state.errors.wallet = 'enter a valid mainnet principal';
    render();
    return;
  }
  state.errors.wallet = '';
  state.relayerKey = null;
  state.relayerAddress = trimmed;
  localStorage.setItem('xtrata-sponsor-address', trimmed);
  render();
  void refreshChainState();
};

const requireAdmin = (stepKey: string) => {
  if (!state.session.isConnected || state.session.address !== DEPLOYER) {
    state.errors[stepKey] = `connect the admin wallet (${DEPLOYER}) first`;
    render();
    return false;
  }
  return true;
};

const fundRelayer = (amountStx: string) => {
  if (!requireAdmin('fund') || !state.relayerAddress) return;
  const amount = BigInt(Math.round(Number(amountStx || '20') * 1_000_000));
  state.busy.fund = true;
  state.errors.fund = '';
  render();
  showStxTransfer({
    recipient: state.relayerAddress,
    amount: amount.toString(),
    memo: 'xtrata sponsor float',
    appDetails,
    network: toStacksNetwork('mainnet'),
    stxAddress: state.session.address,
    onFinish: (payload) => {
      const txId = (payload as { txId?: string; txid?: string }).txId ??
        (payload as { txid?: string }).txid ?? '';
      state.pendingTx.fund = txId;
      state.busy.fund = false;
      render();
    },
    onCancel: () => {
      state.busy.fund = false;
      state.errors.fund = 'transfer cancelled in wallet';
      render();
    }
  });
};

const signSetSponsor = (market: string) => {
  if (!requireAdmin(market) || !state.relayerAddress) return;
  state.busy[market] = true;
  state.errors[market] = '';
  render();
  showContractCall({
    contractAddress: DEPLOYER,
    contractName: market,
    functionName: 'set-sponsor',
    functionArgs: [standardPrincipalCV(state.relayerAddress)],
    appDetails,
    network: toStacksNetwork('mainnet'),
    stxAddress: state.session.address,
    onFinish: (payload) => {
      const txId = (payload as { txId?: string; txid?: string }).txId ??
        (payload as { txid?: string }).txid ?? '';
      state.pendingTx[market] = txId;
      state.busy[market] = false;
      render();
    },
    onCancel: () => {
      state.busy[market] = false;
      state.errors[market] = 'set-sponsor cancelled in wallet';
      render();
    }
  });
};

const connect = async () => {
  state.session = await connectWallet(connectParams);
  render();
};
const disconnect = async () => {
  await disconnectWallet();
  state.session = { isConnected: false };
  render();
};

// ---------------------------------------------------------------- render

const el = (tag: string, props: Record<string, unknown> = {}, ...children: (Node | string)[]) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

const explorerLink = (txId: string) =>
  el('a', {
    href: `https://explorer.hiro.so/txid/0x${txId.replace(/^0x/, '')}?chain=mainnet`,
    target: '_blank',
    rel: 'noreferrer',
    textContent: `tx 0x${txId.replace(/^0x/, '').slice(0, 10)}…`
  });

const formatStx = (ustx: bigint) => `${(Number(ustx) / 1_000_000).toFixed(2)} STX`;

const relayerCommand = () =>
  `SPONSOR_KEY=${state.relayerKey ?? '<your saved key>'} \\\nSPONSOR_MARKETS=${MARKETS.map((m) => `${DEPLOYER}.${m}`).join(',')} \\\nnode server/server.mjs`;

const render = () => {
  const app = document.getElementById('app');
  if (!app) return;
  app.replaceChildren();

  // Signer
  const signer = el('div', { className: `card ${state.session.address === DEPLOYER ? 'done' : ''}` });
  signer.append(el('h2', {}, el('span', { className: 'step-num' }, '0'), 'Signer'));
  if (state.session.isConnected && state.session.address) {
    const match = state.session.address === DEPLOYER;
    signer.append(
      el('p', { className: match ? 'ok' : 'fail' },
        match ? `Connected as the admin: ${state.session.address}` : `Connected ${state.session.address} is NOT the admin — actions locked.`),
      el('div', { className: 'row' }, el('button', { className: 'ghost', onclick: disconnect }, 'Disconnect'))
    );
  } else {
    signer.append(el('div', { className: 'row' }, el('button', { onclick: connect }, 'Connect admin wallet')));
  }
  app.append(signer);

  // Step 1: hot wallet
  const hasWallet = !!state.relayerAddress;
  const step1 = el('div', { className: `card ${hasWallet ? 'done' : ''}` });
  step1.append(el('h2', {}, el('span', { className: 'step-num' }, '1'), 'Relayer hot wallet'));
  if (state.relayerKey) {
    step1.append(
      el('p', { className: 'warn' },
        'Save this key NOW (password manager / server env). It is shown once, never stored by this page, and only ever holds a small float.'),
      el('pre', {}, `SPONSOR_KEY = ${state.relayerKey}\naddress     = ${state.relayerAddress}`),
      el('div', { className: 'row' },
        el('button', { className: 'ghost', onclick: () => void navigator.clipboard.writeText(state.relayerKey ?? '') }, 'Copy key'))
    );
  } else if (state.relayerAddress) {
    step1.append(el('p', { className: 'ok' }, `Relayer address: ${state.relayerAddress} (key held elsewhere)`));
  } else {
    step1.append(el('p', {}, 'Generate a fresh key in this browser, or paste the address of an existing relayer wallet.'));
  }
  const addrInput = el('input', { placeholder: 'Existing relayer address (SP…)' }) as HTMLInputElement;
  step1.append(
    el('div', { className: 'row' },
      el('button', { onclick: generateKey }, hasWallet ? 'Generate a NEW key (rotation)' : 'Generate fresh key'),
      addrInput,
      el('button', { className: 'ghost', onclick: () => useExistingAddress(addrInput.value) }, 'Use this address')),
    ...(state.errors.wallet ? [el('p', { className: 'fail' }, state.errors.wallet)] : [])
  );
  app.append(step1);

  // Step 2: fund
  const funded = state.balanceUstx !== null && state.balanceUstx >= RECOMMENDED_FLOAT_USTX / 2n;
  const step2 = el('div', { className: `card ${funded ? 'done' : ''}` });
  step2.append(el('h2', {}, el('span', { className: 'step-num' }, '2'), 'Fund the float'));
  const dl2 = el('dl');
  dl2.append(
    el('dt', {}, 'Current balance'),
    el('dd', { className: funded ? 'ok' : 'warn' },
      state.balanceUstx === null ? '—' : formatStx(state.balanceUstx)),
    el('dt', {}, 'Recommended'),
    el('dd', {}, `${formatStx(RECOMMENDED_FLOAT_USTX)} (each sale fronts ~0.003–0.03 STX and is reimbursed after it confirms)`)
  );
  const amountInput = el('input', { placeholder: '20', style: 'min-width:120px' }) as HTMLInputElement;
  step2.append(
    dl2,
    el('div', { className: 'row' },
      amountInput, el('span', {}, 'STX'),
      el('button', {
        disabled: !hasWallet || !!state.busy.fund,
        onclick: () => fundRelayer(amountInput.value)
      }, state.busy.fund ? 'Waiting for wallet…' : 'Send from admin wallet (sign)')),
    ...(state.pendingTx.fund ? [el('p', { className: 'ok' }, 'Transfer broadcast: ', explorerLink(state.pendingTx.fund))] : []),
    ...(state.errors.fund ? [el('p', { className: 'fail' }, state.errors.fund)] : [])
  );
  app.append(step2);

  // Step 3: authorise
  for (const [index, market] of MARKETS.entries()) {
    const current = state.sponsors[market];
    const authorised = !!current && !!state.relayerAddress && current === state.relayerAddress;
    const card = el('div', { className: `card ${authorised ? 'done' : ''}` });
    card.append(el('h2', {}, el('span', { className: 'step-num' }, `3${index ? 'b' : 'a'}`), `Authorise on ${market}`));
    const dl = el('dl');
    dl.append(
      el('dt', {}, 'Current on-chain sponsor'),
      el('dd', { className: authorised ? 'ok' : 'warn' },
        current === null ? '(could not read)' : authorised ? `${current} ✓ relayer` : `${current} — ${current === DEPLOYER ? 'still the deployer default' : 'not the relayer'}`)
    );
    card.append(
      dl,
      el('div', { className: 'row' },
        el('button', {
          disabled: !hasWallet || authorised || !!state.busy[market],
          onclick: () => signSetSponsor(market)
        }, state.busy[market] ? 'Waiting for wallet…' : authorised ? 'Authorised' : 'set-sponsor (sign)')),
      ...(state.pendingTx[market] ? [el('p', { className: 'ok' }, 'Broadcast: ', explorerLink(state.pendingTx[market]), ' — refresh status once it confirms.')] : []),
      ...(state.errors[market] ? [el('p', { className: 'fail' }, state.errors[market])] : [])
    );
    app.append(card);
  }

  // Step 4: run the relayer
  const step4 = el('div', { className: `card ${state.relayerUp ? 'done' : ''}` });
  step4.append(
    el('h2', {}, el('span', { className: 'step-num' }, '4'), 'Run the relayer'),
    el('p', {}, 'From ', el('code', {}, 'xtrata-agent-one/'), ':'),
    el('pre', {}, relayerCommand()),
    el('div', { className: 'row' },
      el('button', { className: 'ghost', onclick: () => void navigator.clipboard.writeText(relayerCommand().replace(/ \\\n/g, ' ')) }, 'Copy command')),
    el('p', { className: state.relayerUp === null ? '' : state.relayerUp ? 'ok' : 'warn' },
      state.relayerUp === null ? 'Reachability: checking…' : state.relayerUp ? `Something is listening at ${RELAYER_URL}.` : `Nothing reachable at ${RELAYER_URL} yet.`)
  );
  app.append(step4);

  // Step 5: smoke test
  const step5 = el('div', { className: 'card' });
  const listingSummary = MARKETS
    .map((m) => `${m.includes('sbtc') ? 'sBTC' : 'USDCx'}: last listing id ${state.lastListingIds[m] ?? '—'}`)
    .join(' · ');
  step5.append(
    el('h2', {}, el('span', { className: 'step-num' }, '5'), 'Smoke test'),
    el('p', {}, `Live market state — ${listingSummary}`),
    el('p', {},
      'List an inscription on a sponsored market from ',
      el('a', { href: '/market', target: '_self', textContent: 'the Market page' }),
      ' with a small price and the quoted deposit, then buy it from a second wallet holding sBTC/USDCx and ZERO STX ("Buy — no STX needed", one signature, fee 0). Watch the relayer log: SPONSORED → CONFIRMED → CLAIMED → SETTLED; the unused deposit returns to the seller automatically.')
  );
  app.append(step5);

  // refresh
  app.append(
    el('div', { className: 'row' },
      el('button', { className: 'ghost', onclick: () => void refreshChainState() }, 'Refresh on-chain status'))
  );
};

render();
void refreshChainState();
setInterval(() => void refreshChainState(), 30_000);
