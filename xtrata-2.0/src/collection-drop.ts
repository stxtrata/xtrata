import {
  ClarityType,
  FungibleConditionCode,
  PostConditionMode,
  boolCV,
  cvToHex,
  cvToJSON,
  hexToCV,
  makeStandardSTXPostCondition,
  standardPrincipalCV,
  uintCV,
  validateStacksAddress,
  type ClarityValue
} from '@stacks/transactions';
import { connectWallet, disconnectWallet, showContractCall } from './lib/wallet/connect';
import type { WalletSession } from './lib/wallet/types';
import { toStacksNetwork } from './lib/network/stacks';
import { buildTransferPostCondition } from './lib/contract/post-conditions';
import {
  COLLECTION_DROPS_BNS_NAME,
  COLLECTION_DROPS_CONTRACT_ID,
  COLLECTION_DROPS_CONTRACT_NAME,
  COLLECTION_DROPS_DEPLOYER,
  COLLECTION_DROPS_NFT_CONTRACT_ID,
  COLLECTION_DROPS_NFT_CONTRACT_NAME,
  buildCollectionDropArgs,
  collectionDropAccessRole,
  parseCollectionBudget,
  parseCollectionUint,
  readBnsV2Owner,
  validateCollectionCampaignRules,
  type CollectionDropAccessRole
} from './lib/drops/collection-admin';

type LogLevel = 'info' | 'success' | 'warning' | 'error';
type LogEntry = {
  at: string;
  action: string;
  level: LogLevel;
  message: string;
  txId?: string;
};

type LiveState = {
  nextCampaignId: bigint | null;
  sponsor: string | null;
  attestorHash: string | null;
};

const appDetails = {
  name: 'Xtrata Collection Drops',
  icon: `${window.location.origin}/favicon.svg`
};
const connectParams = { appName: appDetails.name, appIcon: appDetails.icon };
const LOG_STORAGE_KEY = 'xtrata:collection-drop:logs:v1';
const HIRO_BASE = '/hiro/mainnet';

let session: WalletSession = { isConnected: false };
let jimBtcOwner: string | null = null;
let accessLookupError: string | null = null;
let busy = false;
let error: string | null = null;
let lastTxId: string | null = null;
let campaignSnapshot = '';
let liveState: LiveState = { nextCampaignId: null, sponsor: null, attestorHash: null };

const formState = {
  engineId: '',
  maxSupply: '1024',
  onePerWallet: true,
  requireBns: true,
  onePerBns: true,
  campaignId: '0',
  operator: '',
  tokenId: '',
  budgetStx: '0.10'
};

const readLogs = (): LogEntry[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.slice(-100) : [];
  } catch {
    return [];
  }
};
let logs = readLogs();

const saveLogs = () => {
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // The in-page audit log remains usable if browser storage is unavailable.
  }
};

const addLog = (action: string, level: LogLevel, message: string, txId?: string | null) => {
  logs = [
    ...logs,
    {
      at: new Date().toISOString(),
      action,
      level,
      message,
      ...(txId ? { txId } : {})
    }
  ].slice(-100);
  saveLogs();
};

const formatLogs = () =>
  logs
    .map((entry) => {
      const tx = entry.txId ? ` | tx ${entry.txId}` : '';
      return `${entry.at} | ${entry.level.toUpperCase()} | ${entry.action} | ${entry.message}${tx}`;
    })
    .join('\n');

const txIdFrom = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as { txId?: unknown; txid?: unknown };
  const value = typeof record.txId === 'string' ? record.txId : record.txid;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

const accessRole = (): CollectionDropAccessRole | null =>
  collectionDropAccessRole(session.address, jimBtcOwner);

const ensureAccess = (action: string) => {
  if (!session.isConnected || !session.address || !accessRole()) {
    error = 'Connect the main Xtrata wallet or the current jim.btc owner wallet.';
    addLog(action, 'error', error);
    render();
    return false;
  }
  return true;
};

const findString = (value: unknown, predicate: (candidate: string) => boolean): string | null => {
  if (typeof value === 'string') return predicate(value) ? value : null;
  if (!value || typeof value !== 'object') return null;
  for (const child of Object.values(value as Record<string, unknown>)) {
    const found = findString(child, predicate);
    if (found) return found;
  }
  return null;
};

const unwrapResponse = (value: ClarityValue): ClarityValue => {
  if (value.type !== ClarityType.ResponseOk) {
    throw new Error(`Read-only call returned ${JSON.stringify(cvToJSON(value))}`);
  }
  return value.value;
};

const callRead = async (
  contractAddress: string,
  contractName: string,
  functionName: string,
  args: ClarityValue[] = []
) => {
  const response = await fetch(
    `${HIRO_BASE}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: session.address ?? COLLECTION_DROPS_DEPLOYER,
        arguments: args.map((arg) => cvToHex(arg))
      })
    }
  );
  if (!response.ok) throw new Error(`${functionName} returned HTTP ${response.status}`);
  const payload = (await response.json()) as { okay?: boolean; result?: string; cause?: string };
  if (!payload.okay || !payload.result) {
    throw new Error(payload.cause || `${functionName} returned no Clarity result`);
  }
  return hexToCV(payload.result);
};

const resolveJimBtcOwner = async () => {
  accessLookupError = null;
  try {
    const response = await fetch(
      `/bnsv2/mainnet/names/${encodeURIComponent(COLLECTION_DROPS_BNS_NAME)}`,
      {
        cache: 'no-store'
      }
    );
    if (!response.ok) throw new Error(`BNS lookup returned HTTP ${response.status}`);
    jimBtcOwner = readBnsV2Owner(await response.json());
    if (!jimBtcOwner) throw new Error('jim.btc has no active mainnet owner');
  } catch (caught) {
    jimBtcOwner = null;
    accessLookupError = caught instanceof Error ? caught.message : String(caught);
  }
};

const refreshLiveState = async () => {
  if (!ensureAccess('refresh')) return;
  busy = true;
  error = null;
  render();
  try {
    await resolveJimBtcOwner();
    if (!accessRole())
      throw new Error('The connected wallet is no longer on the live access list.');
    const [nextCv, sponsorCv, attestorCv] = await Promise.all([
      callRead(COLLECTION_DROPS_DEPLOYER, COLLECTION_DROPS_CONTRACT_NAME, 'get-next-campaign-id'),
      callRead(COLLECTION_DROPS_DEPLOYER, COLLECTION_DROPS_CONTRACT_NAME, 'get-sponsor'),
      callRead(
        COLLECTION_DROPS_DEPLOYER,
        COLLECTION_DROPS_CONTRACT_NAME,
        'get-bns-attestor-pubkey-hash'
      )
    ]);
    const next = unwrapResponse(nextCv);
    liveState = {
      nextCampaignId: next.type === ClarityType.UInt ? next.value : null,
      sponsor: findString(cvToJSON(sponsorCv), (value) => value.startsWith('SP')),
      attestorHash: findString(cvToJSON(attestorCv), (value) => /^0x[0-9a-f]{40}$/i.test(value))
    };
    addLog('refresh', 'success', 'Verified live Drops v1.1 configuration and campaign counter.');
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
    addLog('refresh', 'error', error);
  } finally {
    busy = false;
    render();
  }
};

const submitCall = (params: {
  action: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions?: Parameters<typeof showContractCall>[0]['postConditions'];
  description: string;
}) => {
  if (!ensureAccess(params.action) || !session.address) return;
  busy = true;
  error = null;
  addLog(params.action, 'info', params.description);
  render();
  showContractCall({
    contractAddress: COLLECTION_DROPS_DEPLOYER,
    contractName: COLLECTION_DROPS_CONTRACT_NAME,
    functionName: params.functionName,
    functionArgs: params.functionArgs,
    appDetails,
    network: toStacksNetwork('mainnet'),
    stxAddress: session.address,
    postConditionMode: PostConditionMode.Deny,
    postConditions: params.postConditions ?? [],
    onFinish: (payload) => {
      lastTxId = txIdFrom(payload);
      busy = false;
      if (lastTxId) {
        addLog(params.action, 'success', 'Wallet signed and broadcast the transaction.', lastTxId);
      } else {
        error = 'Wallet response did not include a transaction id.';
        addLog(params.action, 'error', error);
      }
      render();
    },
    onCancel: () => {
      busy = false;
      error = 'Wallet request cancelled.';
      addLog(params.action, 'warning', error);
      render();
    },
    onError: (caught) => {
      busy = false;
      error = caught instanceof Error ? caught.message : String(caught);
      addLog(params.action, 'error', error);
      render();
    }
  });
};

const createCampaign = () => {
  const validated = validateCollectionCampaignRules({
    engineId: formState.engineId,
    maxSupply: formState.maxSupply,
    onePerWallet: formState.onePerWallet,
    requireBns: formState.requireBns,
    onePerBns: formState.onePerBns
  });
  if (!validated.ok) {
    error = validated.error;
    addLog('create-campaign', 'error', error);
    render();
    return;
  }
  submitCall({
    action: 'create-campaign',
    functionName: 'create-campaign',
    functionArgs: validated.functionArgs,
    description: `Creating an immutable ${validated.maxSupply}-edition campaign for engine inscription #${validated.engineId}.`
  });
};

const loadCampaign = async () => {
  if (!ensureAccess('load-campaign')) return;
  const campaignId = parseCollectionUint(formState.campaignId, 'Campaign ID');
  if (!campaignId.ok) {
    error = campaignId.error;
    render();
    return;
  }
  busy = true;
  error = null;
  render();
  try {
    const cv = await callRead(
      COLLECTION_DROPS_DEPLOYER,
      COLLECTION_DROPS_CONTRACT_NAME,
      'get-campaign',
      [uintCV(campaignId.value)]
    );
    campaignSnapshot = JSON.stringify(cvToJSON(cv), null, 2);
    addLog('load-campaign', 'success', `Loaded campaign ${campaignId.value}.`);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
    addLog('load-campaign', 'error', error);
  } finally {
    busy = false;
    render();
  }
};

const setOperator = () => {
  const campaignId = parseCollectionUint(formState.campaignId, 'Campaign ID');
  if (!campaignId.ok) {
    error = campaignId.error;
    render();
    return;
  }
  const operator = formState.operator.trim();
  if (!operator.startsWith('SP') || !validateStacksAddress(operator)) {
    error = 'Enter a valid mainnet Wizard operator address.';
    addLog('set-operator', 'error', error);
    render();
    return;
  }
  submitCall({
    action: 'set-operator',
    functionName: 'set-campaign-operator',
    functionArgs: [uintCV(campaignId.value), standardPrincipalCV(operator), boolCV(true)],
    description: `Authorising ${operator} as an operator for campaign ${campaignId.value}.`
  });
};

const setCampaignActive = (active: boolean) => {
  const campaignId = parseCollectionUint(formState.campaignId, 'Campaign ID');
  if (!campaignId.ok) {
    error = campaignId.error;
    render();
    return;
  }
  submitCall({
    action: active ? 'resume-campaign' : 'pause-campaign',
    functionName: 'set-campaign-active',
    functionArgs: [uintCV(campaignId.value), boolCV(active)],
    description: `${active ? 'Resuming' : 'Pausing'} campaign ${campaignId.value}.`
  });
};

const createCampaignDrop = async () => {
  if (!ensureAccess('create-campaign-drop') || !session.address) return;
  const campaignId = parseCollectionUint(formState.campaignId, 'Campaign ID');
  const tokenId = parseCollectionUint(formState.tokenId, 'Inscription ID');
  const budget = parseCollectionBudget(formState.budgetStx);
  if (!campaignId.ok || !tokenId.ok || !budget.ok) {
    if (!campaignId.ok) error = campaignId.error;
    else if (!tokenId.ok) error = tokenId.error;
    else if (!budget.ok) error = budget.error;
    addLog('create-campaign-drop', 'error', error ?? 'Invalid campaign drop values.');
    render();
    return;
  }
  busy = true;
  error = null;
  addLog('create-campaign-drop', 'info', `Checking ownership of inscription #${tokenId.value}.`);
  render();
  try {
    const ownerCv = await callRead(
      COLLECTION_DROPS_DEPLOYER,
      COLLECTION_DROPS_NFT_CONTRACT_NAME,
      'get-owner',
      [uintCV(tokenId.value)]
    );
    const owner = findString(cvToJSON(ownerCv), (value) => value.startsWith('SP'));
    if (!owner || owner.toUpperCase() !== session.address.toUpperCase()) {
      throw new Error(
        owner
          ? `Inscription #${tokenId.value} is owned by ${owner}, not the connected wallet.`
          : `Inscription #${tokenId.value} has no current owner.`
      );
    }
    busy = false;
    submitCall({
      action: 'create-campaign-drop',
      functionName: 'create-campaign-drop',
      functionArgs: buildCollectionDropArgs({
        tokenId: tokenId.value,
        budgetUstx: budget.ustx,
        campaignId: campaignId.value
      }),
      postConditions: [
        buildTransferPostCondition({
          contract: {
            address: COLLECTION_DROPS_DEPLOYER,
            contractName: COLLECTION_DROPS_NFT_CONTRACT_NAME,
            network: 'mainnet'
          },
          senderAddress: session.address,
          tokenId: tokenId.value
        }),
        makeStandardSTXPostCondition(session.address, FungibleConditionCode.Equal, budget.ustx)
      ],
      description: `Escrowing inscription #${tokenId.value} in campaign ${campaignId.value} with ${formState.budgetStx} STX sponsorship budget.`
    });
  } catch (caught) {
    busy = false;
    error = caught instanceof Error ? caught.message : String(caught);
    addLog('create-campaign-drop', 'error', error);
    render();
  }
};

const connect = async () => {
  error = null;
  busy = true;
  render();
  try {
    await resolveJimBtcOwner();
    session = await connectWallet(connectParams);
    if (session.isConnected && session.address) {
      const role = accessRole();
      if (role) {
        addLog('access', 'success', `Access granted to ${role} signer ${session.address}.`);
        busy = false;
        render();
        await refreshLiveState();
        return;
      }
      error = `Access denied for ${session.address}.`;
      addLog('access', 'error', error);
    }
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
    addLog('access', 'error', error);
  } finally {
    busy = false;
    render();
  }
};

const disconnect = async () => {
  await disconnectWallet();
  session = { isConnected: false };
  campaignSnapshot = '';
  render();
};

const el = (tag: string, props: Record<string, unknown> = {}, ...children: (Node | string)[]) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

const input = (params: {
  label: string;
  value: string;
  placeholder?: string;
  onValue: (value: string) => void;
  type?: string;
}) => {
  const control = el('input', {
    value: params.value,
    placeholder: params.placeholder ?? '',
    type: params.type ?? 'text',
    oninput: (event: Event) => params.onValue((event.target as HTMLInputElement).value)
  });
  return el('label', { className: 'field' }, el('span', {}, params.label), control);
};

const checkbox = (label: string, checked: boolean, onValue: (value: boolean) => void) =>
  el(
    'label',
    { className: 'check' },
    el('input', {
      type: 'checkbox',
      checked,
      onchange: (event: Event) => onValue((event.target as HTMLInputElement).checked)
    }),
    el('span', {}, label)
  );

const explorerLink = (txId: string) =>
  el('a', {
    href: `https://explorer.hiro.so/txid/0x${txId.replace(/^0x/, '')}?chain=mainnet`,
    target: '_blank',
    rel: 'noreferrer',
    textContent: `Transaction 0x${txId.replace(/^0x/, '').slice(0, 12)}…`
  });

const render = () => {
  const app = document.getElementById('app');
  if (!app) return;
  app.replaceChildren();
  const role = accessRole();

  const accessCard = el('section', { className: `card ${role ? 'card--success' : ''}` });
  accessCard.append(
    el('p', { className: 'eyebrow' }, 'Restricted campaign operations'),
    el('h2', {}, 'Wallet access'),
    el(
      'dl',
      {},
      el('dt', {}, 'Main Xtrata signer'),
      el('dd', {}, COLLECTION_DROPS_DEPLOYER),
      el('dt', {}, COLLECTION_DROPS_BNS_NAME),
      el(
        'dd',
        { className: jimBtcOwner ? 'ok' : 'warn' },
        jimBtcOwner ??
          (accessLookupError ? `Unavailable: ${accessLookupError}` : 'Resolving current owner…')
      )
    )
  );
  if (session.isConnected && session.address) {
    accessCard.append(
      el(
        'p',
        { className: role ? 'ok' : 'fail' },
        role
          ? `Access granted as ${role}: ${session.address}`
          : `Access denied: ${session.address} is not on the live allowlist.`
      ),
      el('button', { className: 'secondary', disabled: busy, onclick: disconnect }, 'Disconnect')
    );
  } else {
    accessCard.append(
      el(
        'p',
        {},
        'Connect the signing wallet. The page fails closed if jim.btc ownership cannot be verified.'
      ),
      el(
        'button',
        { disabled: busy, onclick: () => void connect() },
        busy ? 'Connecting…' : 'Connect authorised wallet'
      )
    );
  }
  app.append(accessCard);

  if (error) app.append(el('p', { className: 'banner banner--error', role: 'alert' }, error));
  if (lastTxId) {
    app.append(
      el(
        'p',
        { className: 'banner banner--success' },
        'Latest submission: ',
        explorerLink(lastTxId)
      )
    );
  }

  if (!role) {
    app.append(
      el(
        'section',
        { className: 'card card--muted' },
        el('h2', {}, 'Collection pathway locked'),
        el(
          'p',
          {},
          'Campaign creation controls are hidden until an authorised wallet is connected. The public legacy Drops v1.0 pathway remains available separately.'
        ),
        el('a', { href: '/drops', className: 'button-link' }, 'Open legacy Drops v1.0')
      )
    );
    return;
  }

  app.append(
    el(
      'section',
      { className: 'card' },
      el('p', { className: 'eyebrow' }, 'Drops v1.1 only'),
      el('h2', {}, 'Live contract state'),
      el(
        'dl',
        {},
        el('dt', {}, 'Campaign contract'),
        el('dd', {}, COLLECTION_DROPS_CONTRACT_ID),
        el('dt', {}, 'NFT contract'),
        el('dd', {}, COLLECTION_DROPS_NFT_CONTRACT_ID),
        el('dt', {}, 'Next campaign ID'),
        el('dd', {}, liveState.nextCampaignId?.toString() ?? 'Not loaded'),
        el('dt', {}, 'Sponsor'),
        el('dd', {}, liveState.sponsor ?? 'Not loaded'),
        el('dt', {}, 'BNS attestor hash160'),
        el('dd', {}, liveState.attestorHash ?? 'Not loaded')
      ),
      el(
        'button',
        { className: 'secondary', disabled: busy, onclick: () => void refreshLiveState() },
        'Refresh mainnet state'
      )
    )
  );

  const createCard = el('section', { className: 'card' });
  createCard.append(
    el('p', { className: 'eyebrow' }, 'Step 1 · once per collection'),
    el('h2', {}, 'Create immutable campaign'),
    el(
      'p',
      { className: 'warn' },
      'Engine ID, maximum supply and all claim rules are permanent. Confirm the engine inscription before signing.'
    ),
    el(
      'div',
      { className: 'fields' },
      input({
        label: 'Recursive engine inscription ID',
        value: formState.engineId,
        placeholder: 'e.g. 1234',
        onValue: (value) => (formState.engineId = value)
      }),
      input({
        label: 'Maximum supply',
        value: formState.maxSupply,
        onValue: (value) => (formState.maxSupply = value)
      })
    ),
    el(
      'div',
      { className: 'checks' },
      checkbox(
        'One claim per wallet',
        formState.onePerWallet,
        (value) => (formState.onePerWallet = value)
      ),
      checkbox(
        'BNS name required',
        formState.requireBns,
        (value) => (formState.requireBns = value)
      ),
      checkbox(
        'One claim per BNS name',
        formState.onePerBns,
        (value) => (formState.onePerBns = value)
      )
    ),
    el(
      'button',
      { disabled: busy, onclick: createCampaign },
      busy ? 'Waiting…' : 'Create campaign (sign in wallet)'
    )
  );
  app.append(createCard);

  const manageCard = el('section', { className: 'card' });
  manageCard.append(
    el('p', { className: 'eyebrow' }, 'Step 2 · campaign control'),
    el('h2', {}, 'Load and authorise'),
    input({
      label: 'Campaign ID',
      value: formState.campaignId,
      onValue: (value) => (formState.campaignId = value)
    }),
    el(
      'div',
      { className: 'actions' },
      el(
        'button',
        { className: 'secondary', disabled: busy, onclick: () => void loadCampaign() },
        'Load campaign'
      ),
      el(
        'button',
        { className: 'secondary', disabled: busy, onclick: () => setCampaignActive(false) },
        'Pause campaign'
      ),
      el(
        'button',
        { className: 'secondary', disabled: busy, onclick: () => setCampaignActive(true) },
        'Resume campaign'
      )
    ),
    input({
      label: 'Wizard operator mainnet address',
      value: formState.operator,
      placeholder: 'SP…',
      onValue: (value) => (formState.operator = value)
    }),
    el(
      'button',
      { disabled: busy, onclick: setOperator },
      'Authorise Wizard operator (sign in wallet)'
    )
  );
  if (campaignSnapshot) manageCard.append(el('pre', { textContent: campaignSnapshot }));
  app.append(manageCard);

  app.append(
    el(
      'section',
      { className: 'card' },
      el('p', { className: 'eyebrow' }, 'Step 3 · existing inscription canary'),
      el('h2', {}, 'Add inscription to campaign'),
      el(
        'p',
        {},
        'This manually escrows an existing Xtrata v3.2.3 inscription. The later Wizard composition pathway will perform inscription and campaign escrow atomically.'
      ),
      el(
        'div',
        { className: 'fields' },
        input({
          label: 'Inscription ID',
          value: formState.tokenId,
          placeholder: 'Token owned by this wallet',
          onValue: (value) => (formState.tokenId = value)
        }),
        input({
          label: 'Sponsorship budget (STX)',
          value: formState.budgetStx,
          onValue: (value) => (formState.budgetStx = value)
        })
      ),
      el(
        'p',
        { className: 'warn' },
        'Cancellation returns the NFT and unused sponsorship budget to the permanent campaign creator.'
      ),
      el(
        'button',
        { disabled: busy, onclick: () => void createCampaignDrop() },
        'Create campaign drop (sign in wallet)'
      )
    )
  );

  const logCard = el('section', { className: 'card' });
  logCard.append(el('h2', {}, 'Collection-drop audit log'));
  if (logs.length) {
    logCard.append(
      el('pre', { className: 'log', textContent: formatLogs() }),
      el(
        'div',
        { className: 'actions' },
        el(
          'button',
          {
            className: 'secondary',
            onclick: async () => {
              await navigator.clipboard.writeText(formatLogs());
              addLog('log', 'success', 'Copied audit log to clipboard.');
              render();
            }
          },
          'Copy log'
        ),
        el(
          'button',
          {
            className: 'secondary',
            onclick: () => {
              logs = [];
              saveLogs();
              render();
            }
          },
          'Clear log'
        )
      )
    );
  } else {
    logCard.append(el('p', { className: 'muted' }, 'No collection campaign actions recorded yet.'));
  }
  app.append(logCard);
};

void resolveJimBtcOwner().finally(render);
