import type { ReactNode } from 'react';
import { NetworkBadge } from './NetworkBadge';
import { NetworkGuardBanner } from './NetworkGuardBanner';
import { ThemeToggle } from './ThemeToggle';
import { ToastViewport } from './ToastContext';
import { WalletButton } from './WalletButton';

export type PageId = 'studio' | 'drops' | 'canary';

const NAV: { id: PageId; href: string; label: string }[] = [
  { id: 'studio', href: '/studio.html', label: 'Collection Studio' },
  { id: 'drops', href: '/drops.html', label: 'Drop Builder' },
  { id: 'canary', href: '/canary.html', label: 'Deployment Canary' }
];

export const Layout = ({
  page,
  title,
  children
}: {
  page: PageId;
  title: string;
  children: ReactNode;
}): JSX.Element => (
  <div className="shell">
    <header className="shell__bar">
      <div className="shell__brand">
        Xtrata <small>Collections &amp; Drops v3</small>
      </div>
      <nav className="shell__nav" aria-label="Sections">
        {NAV.map((entry) => (
          <a key={entry.id} href={entry.href} {...(entry.id === page ? { 'aria-current': 'page' as const } : {})}>
            {entry.label}
          </a>
        ))}
      </nav>
      <NetworkBadge />
      <ThemeToggle />
      <WalletButton />
    </header>
    <main className="shell__main">
      <h1>{title}</h1>
      <NetworkGuardBanner />
      {children}
    </main>
    <ToastViewport />
  </div>
);
