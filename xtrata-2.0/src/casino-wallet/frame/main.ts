/**
 * Entry point for casino-wallet.xtrata.xyz (a separate Cloudflare Pages project, `xtrata-casino-wallet`).
 * Answers bridge requests only from the exact parent origins listed at build time (VITE_CASINO_WALLET_PARENTS).
 */
import { WalletBridgeHost, type WalletHandler } from '../../lib/wallet/passkey/bridge/host';
import { browserPasskey } from '../../listening-wallet/frame/passkey';
import { panelUi } from '../../listening-wallet/frame/ui';
import { CANCELLED_MESSAGE, createCasinoEngine, type CasinoIdleView } from './engine';
import { CASINO_PASSKEY } from './options';
import '../../listening-wallet/frame/wallet.css';

const parents = String(import.meta.env.VITE_CASINO_WALLET_PARENTS || 'https://xtrata.xyz')
  .split(',').map((s) => s.trim()).filter(Boolean);

const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* the wallet still works for this visit */ } }
};

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-4);
function idle(view: CasinoIdleView) {
  const lines = view.state === 'unlocked'
    ? [`Open · ${short(view.address!)}`, view.kind === 'device' ? 'Browser-only wallet · testnet' : 'Passkey wallet · testnet', 'Buys chips at the LAYR exchange without asking until you lock it.']
    : view.state === 'known' ? [`Locked · ${short(view.address!)}`] : ['No casino wallet on this device yet.'];
  $('idle-lines').replaceChildren(...lines.map((l) => Object.assign(document.createElement('p'), { textContent: l })));
  $('idle-lock').hidden = view.state !== 'unlocked';
}

let engine: ReturnType<typeof createCasinoEngine>;
$('idle-lock').addEventListener('click', () => engine.lock());
engine = createCasinoEngine({ passkey: browserPasskey(CASINO_PASSKEY), ui: { ...panelUi(CANCELLED_MESSAGE), idle }, store });

new WalletBridgeHost({
  allowedParentOrigins: parents,
  requireParentSource: true,
  handlers: engine.handlers as unknown as Record<string, WalletHandler>
});

// Leaving the page drops the key (the browser-only key stays in storage; it is reloaded on the next tap).
window.addEventListener('pagehide', () => engine.lock());
