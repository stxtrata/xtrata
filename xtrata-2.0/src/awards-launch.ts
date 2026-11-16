/**
 * Music Hero awards: the guided mainnet launch (web/awards-launch.html).
 *
 * Same trust model as the deploy console: the page never sees a key, every transaction is signed in the connected
 * wallet, and that wallet must be xtrata.btc on mainnet. The rules live in src/lib/deploy/awards-launch.ts: this page
 * only shows them, asks the wallet to sign the ONE step they name as next, waits for it to confirm, and reads the chain
 * again. A step is done when the chain shows the expected result, never because something was sent.
 */
import { connectWallet, disconnectWallet, showContractCall, showContractDeploy, showStxTransfer } from './lib/wallet/connect';
import { FungibleConditionCode, makeStandardSTXPostCondition, PostConditionMode, type ClarityValue } from '@stacks/transactions';
import { toStacksNetwork } from './lib/network/stacks';
import type { WalletSession } from './lib/wallet/types';
import { extractWalletTxId } from './lib/deploy/drops-v1-1';
import {
  AWARDS_ID, AWARDS_NAME, CLASSES, classArgs, cleanSignerHash, CORE, DROP, FUND_MINIMUM, hiroReader, inspect, isSignerHash, OWNER, signerArgs, steps, stx, templateArgs, TOTAL_AWARDS,
  type ClassKey, type LaunchState, type StepId
} from './lib/deploy/awards-launch';
import source from '../contracts/live/xtrata-music-awards-v1.0.clar?raw';
import diamond from '../public/awards/diamond.html?raw';
import gold from '../public/awards/gold.html?raw';
import silver from '../public/awards/silver.html?raw';
import bronze from '../public/awards/bronze.html?raw';
import classic from '../public/awards/classic.html?raw';

const HIRO_API = '/hiro/mainnet';
const appDetails = { name: 'Xtrata · Music Hero launch', icon: `${location.origin}/favicon.svg` };
const enc = new TextEncoder();
const templates: Record<ClassKey, Uint8Array> = { diamond: enc.encode(diamond), gold: enc.encode(gold), silver: enc.encode(silver), bronze: enc.encode(bronze), classic: enc.encode(classic) };
const reader = hiroReader(HIRO_API);
const store = { get: (k: string) => { try { return localStorage.getItem('awards-launch.' + k); } catch { return null; } }, set: (k: string, v: string | null) => { try { if (v === null) localStorage.removeItem('awards-launch.' + k); else localStorage.setItem('awards-launch.' + k, v); } catch { /* memory only */ } } };

let session: WalletSession = { isConnected: false };
let state: LaunchState | null = null;
let server: { enabled: boolean; contract?: string; drop?: number } | null = null;
let readError = '';
let reading = false;
let busy = '';
let pending: { step: StepId; txid: string; at: number } | null = (() => { try { const p = JSON.parse(store.get('pending') || 'null'); return p && /^0x[0-9a-f]{64}$/.test(p.txid) ? p : null; } catch { return null; } })();
let signerInput = cleanSignerHash(store.get('signer') || '');
let fundInput = store.get('fund') || '';
const log: { at: number; level: 'info' | 'ok' | 'error'; text: string; txid?: string }[] = [];
const say = (level: 'info' | 'ok' | 'error', text: string, txid?: string) => { log.unshift({ at: Date.now(), level, text, txid }); render(); };
const rightWallet = () => session.isConnected && session.network === 'mainnet' && session.address === OWNER;

async function refresh() {
  if (reading) return;
  reading = true; render();
  try {
    state = await inspect(reader, { templates, source, signerHash: isSignerHash(signerInput) ? signerInput : null });
    readError = '';
    try { const r = await fetch('/radio/awards/config', { cache: 'no-store' }); server = r.ok ? await r.json() : null; if (server && typeof server.enabled !== 'boolean') server = null; } catch { server = null; }
  } catch (e) { readError = (e as Error).message || 'the chain could not be read'; }
  finally { reading = false; render(); }
}

// ---------------------------------------------------------------- one transaction at a time
function sent(step: StepId, payload: unknown) {
  const raw = extractWalletTxId(payload);
  const txid = raw ? (raw.startsWith('0x') ? raw : '0x' + raw).toLowerCase() : '';
  busy = '';
  if (!/^0x[0-9a-f]{64}$/.test(txid)) { say('error', `${step}: the wallet did not return a transaction id. Check the wallet's activity before trying again.`); return; }
  pending = { step, txid, at: Date.now() }; store.set('pending', JSON.stringify(pending));
  say('info', `${step}: sent. Waiting for it to confirm.`, txid);
  void watch();
}
let watching = false;
async function watch() {
  if (watching || !pending) return;
  watching = true;
  try {
    while (pending) {
      const p = pending;
      try {
        const r = await fetch(`${HIRO_API}/extended/v1/tx/${p.txid}`, { cache: 'no-store' });
        if (r.ok) {
          const tx = await r.json() as { tx_status?: string; tx_result?: { repr?: string } };
          if (tx.tx_status === 'success') { pending = null; store.set('pending', null); say('ok', `${p.step}: confirmed (${tx.tx_result?.repr ?? 'ok'}). Reading the chain to verify it.`, p.txid); await refresh(); break; }
          if (tx.tx_status && tx.tx_status !== 'pending') { pending = null; store.set('pending', null); say('error', `${p.step}: the transaction FAILED on chain (${tx.tx_status}: ${tx.tx_result?.repr ?? 'no result'}). Nothing was changed by it. Read the error before trying again.`, p.txid); await refresh(); break; }
        }
      } catch { /* try again */ }
      render();
      await new Promise((ok) => setTimeout(ok, 8000));
    }
  } finally { watching = false; }
}

const common = () => ({ appDetails, network: toStacksNetwork('mainnet'), stxAddress: session.address, onCancel: () => { busy = ''; say('info', 'Cancelled in the wallet. Nothing was sent.'); } });
/** Sign the step the rules name as next, and nothing else. Everything is read again first. */
async function sign(step: StepId) {
  if (busy || pending) return;
  busy = 'Checking the chain once more before opening the wallet…'; render();
  await refresh();
  const list = state ? steps(state, server) : [];
  const now = list.find((s) => s.status === 'next')?.id;
  if (!state || readError) { busy = ''; say('error', `Not signing: ${readError || 'the chain could not be read'}.`); return; }
  if (now !== step) { busy = ''; say('info', `Not signing ${step}: the next step is now ${now ?? 'nothing'}.`); return; }
  if (!rightWallet()) { busy = ''; say('error', `Not signing: connect xtrata.btc (${OWNER}) on mainnet.`); return; }
  busy = 'Approve it in your wallet…'; render();
  const call = (contract: { address: string; name: string }, functionName: string, functionArgs: ClarityValue[], extra: object = {}) =>
    showContractCall({ ...common(), contractAddress: contract.address, contractName: contract.name, functionName, functionArgs, postConditionMode: PostConditionMode.Deny, postConditions: [], onFinish: (p) => sent(step, p), ...extra });
  const awards = { address: OWNER, name: AWARDS_NAME };
  if (step.startsWith('template:')) {
    const t = state.templates.find((x) => `template:${x.plan.key}` === step)!;
    // The wallet may spend at most Xtrata's quoted fee, and nothing else may leave it.
    call(CORE, 'mint-single-tx', templateArgs(t.plan), { postConditions: [makeStandardSTXPostCondition(OWNER, FungibleConditionCode.LessEqual, t.fee)] });
  } else if (step === 'deploy') {
    // Wallets publish at Clarity 4 whatever is asked; the contract is written for it. 0.49 STX sits under Xverse's 0.5 fee cap.
    showContractDeploy({ ...common(), contractName: AWARDS_NAME, codeBody: source, clarityVersion: 4, fee: 490_000n, onFinish: (p) => sent(step, p) });
  } else if (step.startsWith('class:')) {
    const c = state.classes.find((x) => `class:${x.key}` === step)!, t = state.templates.find((x) => x.plan.key === c.key)!;
    if (t.id === null || !t.verified) { busy = ''; say('error', 'Not signing: this class has no verified template.'); return; }
    call(awards, 'set-class', classArgs(c.id, t.id, c.cap));
  } else if (step === 'signer') {
    if (!isSignerHash(signerInput)) { busy = ''; say('error', 'Enter the signer hash first: 40 characters, 0-9 and a-f, as printed by scripts/awards-signer-key.mjs.'); return; }
    call(awards, 'set-signer-hash', signerArgs(signerInput));
  } else if (step === 'fund') {
    const amount = fundAmount();
    if (amount === null) { busy = ''; say('error', `Enter how much to put in: at least ${stx(need())} STX.`); return; }
    showStxTransfer({ ...common(), recipient: AWARDS_ID, amount: amount.toString(), memo: 'music hero awards', postConditionMode: PostConditionMode.Deny, postConditions: [makeStandardSTXPostCondition(OWNER, FungibleConditionCode.Equal, amount)], onFinish: (p) => sent(step, p) });
  } else { busy = ''; render(); }
}
const need = () => { const short = FUND_MINIMUM(state?.recordFee ?? 0n) - (state?.balance ?? 0n); return short > 0n ? short : 0n; };
const fundAmount = (): bigint | null => { const m = /^\s*(\d{1,4})(?:\.(\d{1,6}))?\s*$/.exec(fundInput); if (!m) return null; const v = BigInt(m[1]) * 1_000_000n + BigInt((m[2] ?? '').padEnd(6, '0') || '0'); return v >= need() && v > 0n ? v : null; };

// ---------------------------------------------------------------- the page
const h = (tag: string, cls = '', text = '') => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
const button = (label: string, run: () => void, cls = '') => { const b = h('button', cls, label) as HTMLButtonElement; b.type = 'button'; b.onclick = run; return b; };
const txLink = (txid: string) => { const a = h('a', '', txid.slice(0, 10) + '…') as HTMLAnchorElement; a.href = `https://explorer.hiro.so/txid/${txid}?chain=mainnet`; a.target = '_blank'; a.rel = 'noopener'; return a; };
const TITLES = (id: StepId): [string, string] => {
  const [kind, key] = id.split(':') as [string, ClassKey];
  const c = CLASSES.find((x) => x.key === key);
  if (kind === 'template') return [`Inscribe the ${c!.name} template`, `Wallet shows: ${CORE.name} · mint-single-tx · you send at most the fee quoted here.`];
  if (kind === 'class') return [`Set the ${c!.name} class`, `Wallet shows: ${AWARDS_NAME} · set-class · drop ${DROP}, class ${c!.id}, the template number above, cap ${c!.cap}. No STX leaves.`];
  if (id === 'deploy') return ['Deploy the award contract', `Wallet shows: a contract deploy named ${AWARDS_NAME}, fee 0.49 STX. Check the name letter by letter.`];
  if (id === 'signer') return ['Set the note signer', `Wallet shows: ${AWARDS_NAME} · set-signer-hash. No STX leaves.`];
  if (id === 'fund') return ['Fund the contract', `Wallet shows: an STX transfer to ${AWARDS_ID} for exactly the amount you enter.`];
  if (id === 'server') return ['Switch awards on at the server', 'Not a transaction: settings on the xtrata Pages project, then a redeploy.'];
  return ['First real claim', 'Not signed here: claim a record from a throwaway wall player on the radio. This page sees it on chain.'];
};

function render() {
  const root = document.getElementById('launch')!;
  const top = h('section', 'wallet');
  const ok = rightWallet();
  top.append(h('p', ok ? 'chip done' : 'chip problem', ok ? 'xtrata.btc connected on mainnet' : session.isConnected ? `Wrong wallet: ${session.address ?? '?'} (${session.network ?? '?'})` : 'No wallet connected'));
  top.append(session.isConnected ? button('Disconnect', () => void disconnectWallet().then(() => { session = { isConnected: false }; render(); })) : button('Connect wallet', () => void connectWallet({ appName: appDetails.name, appIcon: appDetails.icon }).then((s) => { session = s; render(); }, (e) => say('error', `Could not connect: ${(e as Error).message}`)), 'primary'));
  top.append(button(reading ? 'Reading…' : 'Check everything again', () => void refresh()));
  if (!ok) top.append(h('p', 'mute', `Only ${OWNER} can run the launch. In Xverse, switch to the xtrata.btc account, then connect.`));
  const list = h('ol', 'steps');
  const all = state ? steps(state, server) : [];
  const done = all.filter((s) => s.status === 'done').length;
  const summary = h('p', 'summary', readError ? `The chain could not be read: ${readError}. Nothing can be signed until it can.` : !state ? 'Reading the chain…' : `${done} of ${all.length} steps verified on chain.${state.core.paused ? ' The Xtrata core is paused: only xtrata.btc can inscribe.' : ''}`);
  if (readError) summary.className = 'summary bad';
  for (const [n, s] of all.entries()) {
    const [title, wallet] = TITLES(s.id);
    const waiting = pending?.step === s.id;
    const li = h('li', `step ${waiting ? 'waiting' : s.status}`);
    const head = h('div', 'head');
    head.append(h('i', '', String(n + 1)), h('b', '', title), h('span', `chip ${waiting ? 'waiting' : s.status}`, waiting ? 'confirming' : s.status === 'done' ? 'verified' : s.status === 'next' ? 'next' : s.status === 'problem' ? 'STOP' : 'locked'));
    li.append(head, h('p', s.status === 'problem' ? 'bad' : 'mute', s.note));
    if (waiting) { const p = h('p', 'mute', 'Sent, waiting for confirmation: '); p.append(txLink(pending!.txid)); li.append(p); }
    if (s.status === 'next' && !waiting) {
      li.append(h('p', 'wallet-line', wallet));
      if (s.id.startsWith('template:') && state) { const t = state.templates.find((x) => `template:${x.plan.key}` === s.id)!; li.append(h('p', 'mute', `File sha256 ${t.plan.sha256.slice(0, 16)}… · Xtrata hash ${t.plan.hash.slice(0, 16)}… · fee ${stx(t.fee)} STX`)); }
      if (s.id === 'signer') {
        const input = h('input') as HTMLInputElement; input.id = 'signer-hash'; input.value = signerInput; input.placeholder = 'Signer hash: 40 hex characters (0x in front is fine)'; input.spellcheck = false;
        input.oninput = () => { signerInput = cleanSignerHash(input.value); store.set('signer', signerInput); };
        li.append(h('p', 'mute', 'Run `node scripts/awards-signer-key.mjs` (it prints only this hash), put the key into Cloudflare as RADIO_AWARDS_SIGNER_KEY, then paste the hash here.'), input);
      }
      if (s.id === 'fund' && state) {
        const input = h('input') as HTMLInputElement; input.id = 'fund-amount'; input.inputMode = 'decimal'; input.value = fundInput || stx(need()); input.placeholder = 'STX to put in';
        if (!fundInput) fundInput = input.value;
        input.oninput = () => { fundInput = input.value; store.set('fund', fundInput); };
        li.append(h('p', 'mute', `A record costs the contract ${stx(state.recordFee)} STX. At least ${stx(need())} STX more is needed for the first claims; all ${TOTAL_AWARDS.toLocaleString()} would need ${stx(state.recordFee * BigInt(TOTAL_AWARDS))} STX. Unused balance can be withdrawn by xtrata.btc.`), input);
      }
      if (s.id === 'server') li.append(h('pre', '', `printf '1' | npx wrangler pages secret put RADIO_AWARDS_ENABLED --project-name xtrata\nprintf '${AWARDS_ID}' | npx wrangler pages secret put RADIO_AWARDS_CONTRACT --project-name xtrata\nprintf '${DROP}' | npx wrangler pages secret put RADIO_AWARDS_DROP --project-name xtrata\nnpx wrangler pages secret put RADIO_AWARDS_SIGNER_KEY --project-name xtrata < ~/.xtrata-awards-signer-key\n# then redeploy, and press "Check everything again"`));
      if (s.id === 'claim') li.append(h('p', 'mute', 'When a wall player has made its plays, claim its record in the radio. Then press "Check everything again": this step turns green when the contract shows a record.'));
      if (!['server', 'claim'].includes(s.id)) { const go = button(busy || 'Sign this step in the wallet', () => void sign(s.id), 'primary'); go.disabled = !ok || !!busy || !!pending || reading; li.append(go); }
    }
    list.append(li);
  }
  const logBox = h('section', 'log');
  logBox.append(h('h2', '', 'What happened'));
  for (const l of log.slice(0, 40)) { const p = h('p', l.level, `${new Date(l.at).toLocaleTimeString()} · ${l.text} `); if (l.txid) p.append(txLink(l.txid)); logBox.append(p); }
  // Keep whatever is being typed: the two inputs are rebuilt, so put the caret back.
  const active = document.activeElement instanceof HTMLInputElement ? document.activeElement.id : '';
  root.replaceChildren(top, summary, list, logBox);
  if (active) (document.getElementById(active) as HTMLInputElement | null)?.focus();
}

render();
void refresh().then(() => { if (pending) void watch(); });
