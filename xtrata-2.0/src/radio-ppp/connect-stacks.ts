/**
 * Opens the Stacks wallet chooser (Xverse or Leather). The radio page's wallet bar (src/radio-likes/wallet.ts) installs
 * the real action on `window`; without it the bar's own button is pressed. Sections that need a connected wallet
 * (albums, releases, replacing a player) offer this button themselves, so nobody has to go looking for the bar.
 */
export function connectStacksWallet(): void {
  const direct = (window as unknown as { XtrataRadioConnectStacks?: () => void }).XtrataRadioConnectStacks;
  if (direct) direct();
  else (document.getElementById('radio-wallet-connect') as HTMLButtonElement | null)?.click();
}
