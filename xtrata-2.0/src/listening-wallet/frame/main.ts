/**
 * Entry point for wallet.xtrata.xyz (a separate Cloudflare Pages project).
 * Answers bridge requests only from the exact parent origins listed at build time.
 */
import { WalletBridgeHost, type WalletHandler } from '../../lib/wallet/passkey/bridge/host';
import { createListeningEngine, type StorePort } from './engine';
import { browserPasskey } from './passkey';
import { domUi } from './ui';
import './wallet.css';

const parents = String(import.meta.env.VITE_LISTENING_WALLET_PARENTS || 'https://radio.xtrata.xyz')
  .split(',').map((s) => s.trim()).filter(Boolean);

const store: StorePort = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* public records only; losing them is harmless */ } }
};

let engine: ReturnType<typeof createListeningEngine>;
const ui = domUi({
  stop: () => void engine.handlers['listening.stop'](),
  lock: () => engine.lock()
});
engine = createListeningEngine({ passkey: browserPasskey(), ui, store });

new WalletBridgeHost({
  allowedParentOrigins: parents,
  requireParentSource: true,
  handlers: engine.handlers as unknown as Record<string, WalletHandler>
});

// Leaving the page drops the key. Coming back means one passkey tap.
window.addEventListener('pagehide', () => engine.lock());
