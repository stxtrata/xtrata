/**
 * Is a Stacks wallet (Leather, Xverse, Hiro-style) installed in this browser? Read-only and cheap:
 * it only looks for what those wallets inject, and never calls them. Used to decide whether to even
 * show "Connect wallet" to a visitor who has no wallet at all (src/radio-ppp).
 *
 * Extensions inject into the TOP window only; @stacks/connect also defines `AsignaProvider` in every
 * iframe, so it is ignored here (docs/WALLET-PLAYBOOK.md). Extensions can inject after page load, so
 * callers should ask again a few times rather than trust one early "no".
 */
type Injected = Record<string, unknown> & {
  btc_providers?: { id?: string }[];
  webbtc_providers?: { id?: string }[];
  webbtc_stx_providers?: { id?: string }[];
};

const isAsigna = (id: unknown) => typeof id === 'string' && id.toLowerCase().includes('asigna');

export function hasInstalledStacksWallet(win: object | undefined = typeof window === 'undefined' ? undefined : window): boolean {
  if (!win) return false;
  let host = win as Injected;
  try {
    const w = win as Window;
    if (w.top && w.top !== w.self && w.top.location.origin === w.location.origin) host = w.top as unknown as Injected;
  } catch { /* cross-origin parent: use this window */ }
  if (host.LeatherProvider || host.XverseProviders || host.HiroWalletProvider || host.StacksProvider) return true;
  return [host.btc_providers, host.webbtc_providers, host.webbtc_stx_providers]
    .some((list) => Array.isArray(list) && list.some((p) => p?.id && !isAsigna(p.id)));
}
