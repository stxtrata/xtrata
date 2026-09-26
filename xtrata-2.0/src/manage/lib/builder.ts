import { CHAIN_READ_FAILED_MESSAGE, INVENTORY_NOT_REGISTERED_MESSAGE, type JourneySignals } from './journey';
export const BUILDER_STEPS = [
  { id: 'basics', title: 'Collection basics', description: 'Name your collection and create a draft for your artwork.' },
  { id: 'artwork', title: 'Artwork & metadata', description: 'Upload, preview and validate files, then lock the staged inventory.' },
  { id: 'contract', title: 'Prepare contract', description: 'Deploy your collection contract, then register every uploaded file on it.' },
  { id: 'rules', title: 'Mint rules', description: 'Set how many can be minted and the price collectors pay. Schedules, payouts and allowlists are optional.' },
  { id: 'launch', title: 'Review & launch', description: 'Prepare the mint page, publish it, then open minting to collectors.' },
  { id: 'manage', title: 'Manage collection', description: 'Monitor your collection and review storage retention and cleanup.' }
] as const;
export type BuilderStepId = typeof BUILDER_STEPS[number]['id'];
export function getBuilderGates(s: JourneySignals): Record<BuilderStepId, string | null> {
  const draft = s.hasActiveCollection ? null : 'Create or select a collection draft first.';
  const artwork = s.mintType === 'pre-inscribed' || (s.activeAssetCount > 0 && s.deployPricingLockPresent);
  return {
    basics: s.walletConnected ? null : 'Connect your creator wallet first.',
    artwork: draft,
    contract: draft || (artwork || s.deployReady ? null : 'Upload artwork and lock the staged inventory first.'),
    rules: draft || (s.deployReady ? null : 'Wait for the collection contract to be confirmed.'),
    launch: draft || (!s.deployReady ? 'Confirm your collection contract first.'
      : s.inventoryRegistered === false ? INVENTORY_NOT_REGISTERED_MESSAGE
      : s.chainReadFailed ? CHAIN_READ_FAILED_MESSAGE
      : !s.launchMintPriceConfigured || (s.mintType !== 'pre-inscribed' && !s.launchMaxSupplyConfigured) ? 'Set max supply and the mint price in Mint rules first.' : null),
    manage: draft
  };
}
export function getBuilderCompletion(s: JourneySignals): Record<BuilderStepId, boolean> {
  return { basics: s.hasActiveCollection, artwork: s.mintType === 'pre-inscribed' || s.activeAssetCount > 0 && s.deployPricingLockPresent,
    contract: s.deployReady && s.inventoryRegistered !== false, rules: s.launchMintPriceConfigured && (s.mintType === 'pre-inscribed' || s.launchMaxSupplyConfigured),
    launch: s.published && s.unpaused === true, manage: false };
}
