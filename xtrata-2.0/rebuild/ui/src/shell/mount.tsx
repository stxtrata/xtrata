import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { loadConfig } from '../config';
import { ToastProvider } from './ToastContext';
import { WalletProvider } from './WalletContext';
import './theme.css';

/**
 * Shared bootstrap for every MPA entry: resolve config (which pins the wallet
 * network before any provider call), then mount the page inside the shared
 * toast + wallet providers.
 */
export const mountPage = (node: ReactNode, rootId = 'root'): void => {
  loadConfig();
  const container = document.getElementById(rootId);
  if (!container) throw new Error(`missing #${rootId} mount point`);
  createRoot(container).render(
    <StrictMode>
      <ToastProvider>
        <WalletProvider>{node}</WalletProvider>
      </ToastProvider>
    </StrictMode>
  );
};
