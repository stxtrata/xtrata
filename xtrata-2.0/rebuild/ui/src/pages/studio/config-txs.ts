import type { CollectionTxBuilder, TxDescriptor } from '@xtrata/collections-client';

/**
 * Post-deploy collection configuration.
 *
 * The template bakes in identity, supply policy and the pinned dependencies —
 * the things that must be right at genesis. Everything mutable (phases,
 * allowlists, splits, recipients, pause) is applied afterwards through the
 * client's tx builders, so the same code path a creator uses later to edit a
 * phase is the one that sets it up.
 *
 * The order below is deliberate: money routing before any phase can mint,
 * phases before the active phase points at one, and unpause LAST so the
 * collection is never open with a half-applied configuration.
 */

export type AllowlistMode = 0 | 1 | 2 | 3;

export const ALLOWLIST_MODES: Record<string, AllowlistMode> = {
  inherit: 0,
  public: 1,
  global: 2,
  phase: 3
};

export interface PhaseConfig {
  phaseId: number;
  enabled: boolean;
  /** 0 = no lower bound. */
  startBlock: number;
  /** 0 = open-ended. */
  endBlock: number;
  mintPriceMicroStx: bigint;
  /** 0 = unlimited. */
  maxPerWallet: number;
  /** 0 = no per-phase cap. */
  maxSupply: number;
  allowlistMode: AllowlistMode;
  label: string;
}

export interface SplitsConfig {
  artistRecipient: string;
  marketplaceRecipient: string;
  operatorRecipient: string;
  artistBps: number;
  marketplaceBps: number;
  operatorBps: number;
}

export interface CollectionConfigDraft {
  phases: PhaseConfig[];
  activePhaseId: number;
  splits: SplitsConfig | null;
  /** Wallets granted a global allowlist allowance (creator-only phases). */
  allowlist: { owner: string; allowance: number }[];
  /** Unpause as the final configuration step. */
  unpause: boolean;
}

/** Creator-only preset: free, allowlisted to the creator, no wallet cap. */
export const creatorOnlyPhase = (phaseId = 1): PhaseConfig => ({
  phaseId,
  enabled: true,
  startBlock: 0,
  endBlock: 0,
  mintPriceMicroStx: 0n,
  maxPerWallet: 0,
  maxSupply: 0,
  allowlistMode: ALLOWLIST_MODES['global']!,
  label: 'Creator only'
});

/** Public preset: open to everyone, priced, with a per-wallet cap. */
export const publicMintPhase = (params: {
  phaseId?: number;
  mintPriceMicroStx: bigint;
  maxPerWallet: number;
  startBlock?: number;
  endBlock?: number;
}): PhaseConfig => ({
  phaseId: params.phaseId ?? 2,
  enabled: true,
  startBlock: params.startBlock ?? 0,
  endBlock: params.endBlock ?? 0,
  mintPriceMicroStx: params.mintPriceMicroStx,
  maxPerWallet: params.maxPerWallet,
  maxSupply: 0,
  allowlistMode: ALLOWLIST_MODES['public']!,
  label: 'Public'
});

export const createDefaultConfigDraft = (creator: string): CollectionConfigDraft => ({
  phases: [creatorOnlyPhase()],
  activePhaseId: 1,
  splits: {
    artistRecipient: creator,
    marketplaceRecipient: creator,
    operatorRecipient: creator,
    artistBps: 10_000,
    marketplaceBps: 0,
    operatorBps: 0
  },
  allowlist: [{ owner: creator, allowance: 1_000_000 }],
  unpause: true
});

export const validateConfigDraft = (draft: CollectionConfigDraft): string[] => {
  const errors: string[] = [];
  const seen = new Set<number>();
  for (const phase of draft.phases) {
    if (phase.phaseId <= 0) errors.push('Phase ids must be greater than 0.');
    if (seen.has(phase.phaseId)) errors.push(`Duplicate phase id ${phase.phaseId}.`);
    seen.add(phase.phaseId);
    if (phase.endBlock !== 0 && phase.startBlock > phase.endBlock) {
      errors.push(`Phase ${phase.phaseId}: start block is after its end block.`);
    }
  }
  if (draft.activePhaseId !== 0 && !seen.has(draft.activePhaseId)) {
    errors.push(`Active phase ${draft.activePhaseId} is not one of the configured phases.`);
  }
  if (draft.splits) {
    const total = draft.splits.artistBps + draft.splits.marketplaceBps + draft.splits.operatorBps;
    if (total > 10_000) errors.push('Payout splits may not exceed 10000 bps in total.');
    if (total < 0) errors.push('Payout splits may not be negative.');
  }
  return errors;
};

export interface ConfigTxStep {
  label: string;
  tx: TxDescriptor;
}

/** The ordered configuration transactions for a freshly deployed collection. */
export const buildConfigTxs = (
  builder: CollectionTxBuilder,
  draft: CollectionConfigDraft
): ConfigTxStep[] => {
  const steps: ConfigTxStep[] = [];

  if (draft.splits) {
    steps.push({
      label: 'Set payout recipients',
      tx: builder.setRecipients(
        draft.splits.artistRecipient,
        draft.splits.marketplaceRecipient,
        draft.splits.operatorRecipient
      )
    });
    steps.push({
      label: 'Set payout splits',
      tx: builder.setSplits(
        draft.splits.artistBps,
        draft.splits.marketplaceBps,
        draft.splits.operatorBps
      )
    });
  }

  for (const phase of draft.phases) {
    steps.push({
      label: `Configure phase ${phase.phaseId} (${phase.label})`,
      tx: builder.setPhase({
        phaseId: phase.phaseId,
        enabled: phase.enabled,
        startBlock: phase.startBlock,
        endBlock: phase.endBlock,
        mintPrice: phase.mintPriceMicroStx,
        maxPerWallet: phase.maxPerWallet,
        maxSupply: phase.maxSupply,
        allowlistMode: phase.allowlistMode
      })
    });
  }

  if (draft.allowlist.length > 0) {
    steps.push({
      label: `Allowlist ${draft.allowlist.length} wallet${draft.allowlist.length === 1 ? '' : 's'}`,
      tx: builder.setAllowlistBatch(draft.allowlist)
    });
    steps.push({ label: 'Enable the global allowlist', tx: builder.setAllowlistEnabled(true) });
  }

  steps.push({
    label: `Activate phase ${draft.activePhaseId}`,
    tx: builder.setActivePhase(draft.activePhaseId)
  });

  if (draft.unpause) {
    // Last: minting is blocked for everyone (owner included) while paused, so
    // this is the switch that opens the collection once everything else is set.
    steps.push({ label: 'Unpause the collection', tx: builder.setPaused(false) });
  }

  return steps;
};

/** Closure controls offered on the completion screen. */
export const buildClosureTxs = (
  builder: CollectionTxBuilder,
  options: { closeSupply: boolean; finalize: boolean }
): ConfigTxStep[] => {
  const steps: ConfigTxStep[] = [];
  if (options.closeSupply) {
    steps.push({ label: 'Close supply at the current count', tx: builder.closeSupply() });
  }
  if (options.finalize) {
    steps.push({ label: 'Finalize (freezes all configuration)', tx: builder.finalize() });
  }
  return steps;
};
