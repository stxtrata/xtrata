/**
 * Xtrata Arcade v2 launch canary: the page.
 *
 * The steps live in engine.ts (no DOM). This file connects the web wallet through the shared canary module
 * (`../collection-v17/wallet.ts`, docs/WALLET-PLAYBOOK.md: providers on the top window, the chooser on every connect,
 * no `sender`, bare-hex arguments, deny mode, abort on an account mismatch), renders the steps, and provides the
 * browser-only checks: flying a run in the embedded arcade, running the hall's own registry reader, booting the parent.
 */
import {
  AnchorMode, makeUnsignedContractCall, makeUnsignedSTXTokenTransfer, PostConditionMode,
  type ClarityValue, type PostCondition
} from '@stacks/transactions';
import LAUNCH from 'xa:launch';
import * as E from './engine';
import { toHex } from '../collection-v17/chain';
import * as wallet from '../collection-v17/wallet';
import type { Net, ProviderInfo } from '../collection-v17/wallet';

declare const __BUILD__: string;
declare const __BUILT_AT__: string;

// ---------- tiny DOM helpers ----------
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector(sel) as T;
type Child = Node | string | null | undefined | false | Child[];
const el = (tag: string, attrs: Record<string, any> = {}, ...children: Child[]) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v === true ? '' : v);
  }
  const add = (c: Child) => { if (Array.isArray(c)) c.forEach(add); else if (c !== null && c !== undefined && c !== false) node.append(typeof c === 'string' ? document.createTextNode(c) : c); };
  children.forEach(add);
  return node;
};
const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));
let busy = false;
let label = '';

// ---------- the web wallet as the engine's signer ----------
const progress = (stage: string) => { if (['account-read', 'account-reconnect', 'signing-request'].includes(stage)) hostImpl.log('info', `wallet: ${stage.replace('-', ' ')}`); };
const settle = async (result: wallet.TxResult) => {
  if (result.txRaw && result.txRaw.length > 128) { try { await E.chain.broadcastRaw(result.txRaw); } catch { /* already known */ } }
  return result.txId;
};
const webSigner = (address: string, publicKey: string | null): E.Signer => ({
  address, label: wallet.walletLabel(),
  async call(target: string, fn: string, args: ClarityValue[], pcs: PostCondition[]) {
    const [contractAddress, contractName] = target.split('.');
    const buildUnsigned = publicKey ? async () => {
      const nonce = await E.chain.nonce(address);
      const build = (fee: bigint) => makeUnsignedContractCall({ contractAddress, contractName, functionName: fn, functionArgs: args,
        publicKey, network: E.chain.stacks, nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: pcs });
      const size = (await build(20_000n)).serialize().length;
      return toHex((await build(BigInt(Math.max(20_000, Math.ceil(size * 1.1))))).serialize());
    } : undefined;
    return settle(await wallet.contractCall({ contractAddress, contractName, functionName: fn, functionArgs: args, postConditions: pcs,
      postConditionMode: PostConditionMode.Deny, network: E.network, stxAddress: address, onProgress: progress, buildUnsigned }));
  },
  async deploy(name: string, code: string, clarityVersion: number) {
    return settle(await wallet.deployContract({ contractName: name, codeBody: code, clarityVersion, network: E.network, stxAddress: address, onProgress: progress }));
  },
  async transfer(recipient: string, amount: bigint, memo: string) {
    return settle(await wallet.stxTransfer({ recipient, amount, memo, network: E.network, stxAddress: address, onProgress: progress,
      buildUnsigned: publicKey ? async () => {
        const nonce = await E.chain.nonce(address);
        return toHex((await makeUnsignedSTXTokenTransfer({ recipient, amount, memo, publicKey, network: E.chain.stacks, nonce, fee: 5_000n, anchorMode: AnchorMode.Any })).serialize());
      } : undefined }));
  }
});

// ---------- wallet chooser (opens on every connect) ----------
const chooseWallet = (providers: ProviderInfo[]) => new Promise<string | null>((resolve) => {
  const close = (value: string | null) => { overlay.remove(); document.removeEventListener('keydown', onKey); resolve(value); };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(null); };
  const overlay = el('div', { class: 'chooser', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Choose a wallet' },
    el('div', { class: 'chooser__panel' },
      el('h2', {}, 'Choose a wallet'),
      el('p', { class: 'who' }, `Pick the root owner for ${E.network}: ${E.rootAddr()}`),
      providers.length
        ? providers.map((p) => el('button', { class: 'chooser__item', type: 'button', onclick: () => close(p.id) },
            p.icon ? el('img', { src: p.icon, alt: '' }) : null, el('span', {}, p.name || p.id), el('code', {}, p.id)))
        : el('p', {}, 'No Stacks wallet extension was found in this window. Install or enable Xverse or Leather for this site, then reload.'),
      el('button', { class: 'button ghost', type: 'button', onclick: () => close(null) }, 'Cancel')));
  document.addEventListener('keydown', onKey);
  document.body.append(overlay);
});

// ---------- hidden frames ----------
const frameWith = async <T,>(srcdoc: string, ready: (win: any) => boolean, fn: (win: any, errors: string[]) => Promise<T>, timeoutMs: number, what: string): Promise<T> => {
  const frame = el('iframe', { style: 'position:fixed;left:-9999px;top:0;width:900px;height:700px;border:0', title: `${what} (hidden)` }) as HTMLIFrameElement;
  const errors: string[] = [];
  frame.srcdoc = srcdoc;
  document.body.append(frame);
  try {
    const t0 = Date.now();
    let hooked = false;
    for (;;) {
      const win: any = frame.contentWindow;
      if (win && !hooked) { try { win.addEventListener('error', (e: any) => errors.push(String(e.message || e))); hooked = true; } catch { /* not yet */ } }
      let ok = false;
      try { ok = !!win && ready(win); } catch { ok = false; }
      if (ok) break;
      if (Date.now() - t0 > timeoutMs) throw new Error(`${what} did not start in a hidden frame within ${Math.round(timeoutMs / 1000)}s.`);
      await E.sleep(300);
    }
    return await fn(frame.contentWindow, errors);
  } finally { frame.remove(); }
};
const esc = (s: string) => s.replace(/<\/script/gi, '<\\/script');

const hostImpl: E.Host = {
  log(level, msg, txid) {
    const line = el('div', { class: `log-line ${level}` }, el('time', {}, new Date().toLocaleTimeString()), ' ', msg,
      txid ? [' ', el('a', { href: E.chain.txUrl(txid), target: '_blank', rel: 'noopener' }, E.short(txid))] : null);
    $('#log').prepend(line);
    (level === 'error' ? console.warn : console.info)('[arcade-v2-launch]', msg, txid ?? '');
  },
  status(text, tone = 'info') { const s = $('#status'); s.textContent = text; s.dataset.tone = tone; },
  async confirm(msg) { return window.confirm(msg); },
  saveFile(name, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: name }) as HTMLAnchorElement;
    a.click(); URL.revokeObjectURL(a.href);
  },
  storage: {
    get: (k) => localStorage.getItem(k),
    set: (k, v) => localStorage.setItem(k, v),
    remove: (k) => localStorage.removeItem(k)
  },
  async connect() {
    const result = await wallet.connect(E.network, chooseWallet);
    if (!result.isConnected) {
      if (result.wrongNetwork) return { ...webSigner(result.address || '', null), publicKey: null, wrongNetwork: result.wrongNetwork };
      throw new Error('Connection was cancelled or returned no Stacks address.');
    }
    label = wallet.walletLabel();
    return { ...webSigner(result.address, result.publicKey), publicKey: result.publicKey };
  },
  withArcade: (fn) => frameWith(E.RELEASE.single,
    (win) => !!(win.XA && win.XA.replay && win.XA.games && win.XA.games.length && win.document.readyState === 'complete'),
    (win) => fn(win), 60_000, 'The embedded arcade'),
  readHall(registry) {
    // The hall's own reader: score-client.js (Clarity codec), world.js (reads) and world2.js (the v2 schema), as the parent loads them.
    const R = LAUNCH.reader;
    const cfg = { apiBases: E.chain.bases, network: E.network };
    const doc = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>${esc(R['score-client.js'])}</script><script>${esc(R['world.js'])}</script><script>${esc(R['world2.js'])}</script></body></html>`;
    return frameWith(doc, (win) => !!(win.XAScores && win.XAWorld && win.XAWorld2), async (win) => {
      win.XAScores.configure(cfg);
      win.XAWorld2.forget();
      const host = { read: win.XAWorld.read, plain: win.XAWorld.plain, hexList: win.XAWorld.hexList, codec: win.XAScores._codec, registry, path: ['arcade', 'hall'], lobbyPath: null };
      const r = await win.XAWorld2.load(host);
      return JSON.parse(JSON.stringify(r));
    }, 30_000, 'The hall reader');
  },
  bootParent(html, o) {
    // On testnet the parent (a mainnet artifact: it reads the mainnet core and Hiro's mainnet API) is booted with those reads
    // pointed at the testnet core and API, and the gateway switched off. Mainnet boots the bytes as inscribed.
    let doc = html;
    if (o.network === 'testnet') {
      const [ca, cn] = o.core.split('.');
      const shim = `<script>(function(){var f=window.fetch;window.fetch=function(u,i){var s=String(u&&u.url||u);if(/xtrata\\.xyz\\/i\\//.test(s))return Promise.reject(new Error('testnet rehearsal: gateway off'));s=s.split('https://api.mainnet.hiro.so').join(${JSON.stringify(o.apiBase)}).split('/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3/').join(${JSON.stringify(`/${ca}/${cn}/`)});return f.call(this,s,i);};})();</script>`;
      doc = html.replace('<head>', () => `<head>${shim}`);
    }
    return frameWith(doc,
      (win) => !!(win.XA && win.XA.wallState && win.XA.wallState().length >= 27 && win.XAWorld && !win.document.getElementById('xa-load')),
      async (win, errors) => {
        await E.sleep(1500);
        const W = win.XAWorld, cfg = W.config();
        return {
          worldConfig: JSON.parse(JSON.stringify(win.XA_WORLD_CONFIG || null)), mode: W.mode(), enabled: !!W.enabled(),
          registry: cfg.registry, posters: cfg.posters, screen: (win.XA_WORLD_CONFIG || {}).screen || '',
          wall: win.XA.wallState().map((s: any) => ({ head: s.head, shown: s.shown })),
          bays: win.XA.bayState ? JSON.parse(JSON.stringify((win.XA.bayState() || { bays: [] }).bays.map((b: any) => b && b.plan ? { base: b.plan.base } : null))) : null,
          errors
        };
      }, 300_000, 'The parent');
  },
  render() { renderSteps(); }
};

// ---------- rendering ----------
const list = () => E.steps();
const unlocked = (index: number) => list().slice(0, index).every((x) => E.step(x.id).status === 'pass');
const needsWallet = (s: E.Step) => s.who.startsWith('Web wallet');

const renderSteps = () => {
  const root = $('#steps');
  const steps = list();
  root.replaceChildren(...steps.map((s, i) => {
    const st = E.step(s.id);
    const open = unlocked(i);
    const blockedByWallet = needsWallet(s) && i > 0 && !E.connectedSigner();
    const tone = st.status === 'pass' ? 'success' : st.status === 'fail' ? 'error' : st.status === 'running' ? 'warning' : '';
    return el('section', { class: `step${open ? '' : ' locked'}` },
      el('div', { class: 'step__head' },
        el('span', { class: 'step__number' }, String(i)),
        el('div', {}, el('h2', {}, s.title), el('p', { class: 'who' }, s.who)),
        el('span', { class: 'badge', 'data-tone': tone }, st.status === 'todo' ? (open ? 'ready' : 'locked') : st.status)),
      el('div', { class: 'step__body' },
        el('p', {}, s.intro),
        st.note ? el('p', { class: `note ${st.status}` }, st.note) : null,
        st.txs.length ? el('ul', { class: 'txs' }, st.txs.map((t) => el('li', {}, `${t.label} — ${t.status}${t.result ? ` ${t.result}` : ''} `, el('a', { href: E.chain.txUrl(t.txid), target: '_blank', rel: 'noopener' }, E.short(t.txid))))) : null,
        el('div', { class: 'actions' },
          el('button', { class: 'button', type: 'button', 'data-step': s.id, disabled: !open || busy || blockedByWallet, onclick: () => void execute(s) },
            st.status === 'pass' ? `Re-check · ${s.action}` : s.action),
          blockedByWallet && open ? el('span', { class: 'hint' }, 'Reconnect your wallet in step 0 to continue.') : null)));
  }));
  const passed = steps.filter((s) => E.step(s.id).status === 'pass').length;
  $('#summary').textContent = `${passed} of ${steps.length} steps passed`;
};

const execute = async (s: E.Step) => {
  if (busy) return;
  busy = true;
  const st = E.step(s.id);
  st.status = 'running'; st.note = undefined; E.save(); renderSteps();
  hostImpl.status(`${s.title}…`);
  try {
    const note = await s.run();
    st.status = 'pass'; st.note = note || 'passed';
    E.logLine('ok', `${s.title}: ${st.note}`);
    hostImpl.status(`${s.title}: passed`, 'ok');
  } catch (error) {
    st.status = 'fail'; st.note = errText(error);
    E.logLine('error', `${s.title}: ${st.note}`);
    hostImpl.status(`${s.title}: ${st.note}`, 'error');
  } finally {
    busy = false; E.save(); renderSteps(); renderHeader();
  }
};

const renderHeader = () => {
  const net = E.network;
  ($('#network') as HTMLSelectElement).value = net;
  document.body.dataset.network = net;
  $('#net-banner').textContent = net === 'mainnet'
    ? 'MAINNET · real STX · the deploys, the registry and the inscriptions are permanent'
    : `TESTNET REHEARSAL · test STX only · core ${E.NET().core}`;
  const locked = Object.entries(E.state.steps).some(([id, s]) => id !== 'connect' && id !== 'preflight' && s.status === 'pass');
  const core = $('#core') as HTMLInputElement;
  core.value = E.state.core; core.disabled = locked;
  const self = $('#kinds-self') as HTMLInputElement;
  self.checked = !!E.state.kindsSelf;
  const s = E.connectedSigner();
  $('#wallet').textContent = s ? `${label || s.label} · ${E.short(s.address)}${s.address === E.rootAddr() ? ' (root owner)' : ' — NOT the root owner'}` : 'not connected';
  $('#root').textContent = E.rootAddr();
  $('#hot').textContent = `${E.hotAddress()} (key kept in this browser only)`;
  const w = E.worldIds();
  $('#target').textContent = `registry ${w.registry} · posters ${w.posters} · screen ${w.screen}${E.state.inscriptionId ? ` · parent #${E.state.inscriptionId}` : ''}`;
  $('#disconnect').toggleAttribute('hidden', !s);
  renderInscribing();
};

const renderInscribing = () => {
  const built = new Date(__BUILT_AT__);
  const st = E.state;
  const rows: [string, string][] = [
    ['Contracts', `${E.NAMES.world} · ${E.NAMES.posters} · ${E.NAMES.screen} at ${E.short(E.rootAddr())} (Clarity 4)`],
    ['Registry', (() => { try { const c = E.launchPlan().calls; return `${c.length} planned calls (ops/lib/v2-plan.mjs launchCalls): ${c.filter((x) => x.fn === 'register-kind').length} kinds, arcade + hall live, 4 bays that show posters (no lobby)`; } catch (e) { return errText(e); } })()],
    ...E.PACKS.map((f): [string, string] => [`${f.label[0].toUpperCase()}${f.label.slice(1)}`,
      `${f.bytes.length.toLocaleString()} bytes · ${f.chunks.length} chunks · sha256 ${f.sha}${st?.packIds?.[f.key] ? ` · #${st.packIds[f.key]}` : ''}`]),
    ['Parent', `${E.kb(E.parentEstimate())} text/html · CONFIG.world = { posters, registry, screen }${st?.inscriptionId ? ` · #${st.inscriptionId}` : ''}`],
    [`From #${E.RELEASE.bundle.id}`, `${E.RELEASE.fromBundle.join(', ')} (bundle sha256 ${E.short(E.RELEASE.bundle.sha256)}, not re-inscribed on mainnet)`],
    ['Release', E.RELEASE_SHA],
    ['Canary built', `${built.toLocaleString()} (your time) · ${__BUILT_AT__} UTC`],
    ['Build stamp', __BUILD__]
  ];
  $('#inscribing').replaceChildren(
    el('div', { class: 'eyebrow' }, 'This canary launches'),
    el('div', { class: 'big' }, `Xtrata Arcade ${E.VERSION} · the v2 world`),
    el('dl', {}, ...rows.flatMap(([k, v]) => [el('dt', {}, k), el('dd', {}, v)])));
  document.title = `Arcade v2 Launch Canary · ${__BUILD__}`;
};
const restoreLog = () => {
  $('#log').replaceChildren(...E.state.log.map((l) => el('div', { class: `log-line ${l.level}` }, el('time', {}, new Date(l.t).toLocaleTimeString()), ' ', l.msg,
    l.txid ? [' ', el('a', { href: E.chain.txUrl(l.txid), target: '_blank', rel: 'noopener' }, E.short(l.txid))] : null)));
};
const guarded = async (what: string, fn: () => Promise<string>) => {
  if (busy) return;
  busy = true;
  try { hostImpl.status(await fn(), 'ok'); } catch (error) { hostImpl.status(`${what} failed: ${errText(error)}`, 'error'); } finally { busy = false; renderSteps(); }
};

const bind = () => {
  $('#build').textContent = `${__BUILD__} · release sha256 ${E.RELEASE_SHA.slice(0, 16)}… · inscribes ${E.PACKS.map((f) => `${f.key} ${E.kb(f.bytes.length)}`).join(', ')} + parent`;
  $('#network').addEventListener('change', (e) => {
    const net = (e.target as HTMLSelectElement).value as Net;
    try { localStorage.setItem('xtrata-arcade-v2-launch:network', net); } catch { /* ignore */ }
    void wallet.disconnect();
    E.init(net, hostImpl); restoreLog(); renderHeader(); renderSteps();
  });
  $('#core').addEventListener('change', (e) => {
    const v = (e.target as HTMLInputElement).value.trim();
    if (!/^S[PT][0-9A-Z]{20,}\.[a-zA-Z][a-zA-Z0-9-]*$/.test(v)) { hostImpl.status('Enter the core as ADDRESS.contract-name.', 'error'); renderHeader(); return; }
    if (v !== E.NET().core) hostImpl.status(`This canary's contracts were built for the core ${E.NET().core}; preflight will refuse ${v}.`, 'warn');
    E.state.core = v; E.save(); renderHeader();
  });
  $('#kinds-self').addEventListener('change', (e) => { E.state.kindsSelf = (e.target as HTMLInputElement).checked; E.save(); });
  $('#disconnect').addEventListener('click', async () => { await wallet.disconnect(); E.setSigner(null); E.step('connect').status = 'todo'; E.save(); renderHeader(); renderSteps(); E.logLine('info', 'Wallet disconnected.'); });
  $('#export').addEventListener('click', () => hostImpl.saveFile(`xtrata-arcade-v2-launch-${E.network}-${Date.now()}.json`, { ...E.report(), build: __BUILD__, builtAt: __BUILT_AT__ }));
  $('#rescue').addEventListener('click', () => void guarded('Recovery sweep', async () => {
    if (!E.state.root) throw new Error('Connect first so the canary knows where to sweep.');
    return `Temporary wallet holds ${E.stx(await E.sweepHot('production'))}.`;
  }));
  $('#savekey').addEventListener('click', () => hostImpl.saveFile(`xtrata-arcade-v2-temp-wallet-${E.hotAddress().slice(0, 8)}.json`, E.hotKeyFile('saved by hand')));
  $('#revoke').addEventListener('click', () => void guarded('Removing the temporary KINDS admin', async () => {
    E.requireRoot();
    const moved = await E.revokeHotAdmin('kinds');
    return moved ? 'The temporary wallet is no longer a registry admin.' : 'The temporary wallet holds no registry admin role.';
  }));
  $('#handback').addEventListener('click', () => void guarded('Returning leaderboard ownership', async () => {
    E.requireRoot();
    const moved = await E.handBack();
    const left = await E.sweepHot('production');
    return moved ? `Leaderboard ownership is back with your wallet. Temporary wallet holds ${E.stx(left)}.` : `Your wallet already owns the leaderboard. Temporary wallet holds ${E.stx(left)}.`;
  }));
  $('#forget').addEventListener('click', async () => {
    let hotBalance = 0n;
    try { hotBalance = await E.chain.balance(E.hotAddress()); } catch { hostImpl.status('Could not check the temporary wallet balance, so progress was kept. Try again.', 'error'); return; }
    if (hotBalance > 5_000n && !confirm(`The temporary wallet still holds ${E.stx(hotBalance)}. Forgetting progress keeps its key, so you can still sweep it later. Continue?`)) return;
    E.forget(); restoreLog(); renderHeader(); renderSteps(); hostImpl.status('Local progress cleared. On-chain progress is re-read, so re-running resumes it.', 'ok');
  });
};

// ---------- boot ----------
let startNet: Net = 'mainnet';
try { startNet = localStorage.getItem('xtrata-arcade-v2-launch:network') === 'testnet' ? 'testnet' : 'mainnet'; } catch { /* default */ }
E.init(startNet, hostImpl);
wallet.setConnectMessage('Xtrata arcade v2 launch canary');
if (location.protocol === 'file:') $('#file-banner').removeAttribute('hidden');
bind(); restoreLog(); renderHeader(); renderSteps();
