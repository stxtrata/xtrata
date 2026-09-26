/**
 * Read-only preflights for collection mint helper (v1.5–v1.7) admin calls.
 * Rule: never open the wallet for a transaction the contract will reject.
 * Role table generated from the helper source (assert-owner / assert-config-admin /
 * assert-finance-admin / assert-main-xtrata-admin / recipient-editor checks).
 */
export type SignerRole = 'owner' | 'config' | 'finance' | 'recipient-editor' | 'core-admin' | 'pending-owner' | 'any';

const OWNER = new Set([
  'set-operator-admin', 'set-finance-admin', 'initiate-contract-ownership-transfer',
  'cancel-contract-ownership-transfer', 'transfer-contract-ownership', 'set-max-supply',
  'set-artist-recipient', 'finalize'
]);
const FINANCE = new Set(['set-mint-price', 'set-splits']);
const CONFIG = new Set([
  'set-collection-metadata', 'set-reservation-expiry-blocks', 'set-default-token-uri', 'set-default-dependencies',
  'set-registered-token-uri', 'clear-registered-token-uri', 'set-registered-token-uri-batch', 'set-phase',
  'clear-phase', 'set-active-phase', 'set-allowlist-enabled', 'set-max-per-wallet', 'set-allowlist',
  'clear-allowlist', 'set-allowlist-batch', 'set-phase-allowlist', 'clear-phase-allowlist',
  'set-phase-allowlist-batch', 'set-paused', 'release-reservation', 'release-expired-reservation'
]);

export const requiredSignerRole = (functionName: string): SignerRole => {
  if (OWNER.has(functionName)) return 'owner';
  if (FINANCE.has(functionName)) return 'finance';
  if (CONFIG.has(functionName)) return 'config';
  if (functionName === 'set-marketplace-recipient' || functionName === 'set-operator-recipient') return 'recipient-editor';
  if (functionName === 'set-recipient-editor-access') return 'core-admin';
  if (functionName === 'accept-contract-ownership') return 'pending-owner';
  // set-recipients: owner for the artist field; editor flags for the others (checked separately).
  if (functionName === 'set-recipients') return 'owner';
  return 'any';
};

export type ContractRoles = {
  owner: string | null;
  pendingOwner: string | null;
  operatorAdmin: string | null;
  financeAdmin: string | null;
};

const same = (a: string | null | undefined, b: string | null | undefined) =>
  !!a && !!b && a.trim().toUpperCase() === b.trim().toUpperCase();

const short = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;

/**
 * `null` when the connected wallet may make this call (or it cannot be checked
 * from the helper alone), otherwise a plain explanation naming who can.
 * Unknown roles (reads failed) return a "could not check" message rather than
 * guessing.
 */
export function signerPreflight(functionName: string, wallet: string | null, roles: ContractRoles | null): string | null {
  const role = requiredSignerRole(functionName);
  if (role === 'any' || role === 'recipient-editor' || role === 'core-admin') return null;
  if (!wallet) return 'Connect your wallet first.';
  if (!roles || !roles.owner) return 'Could not read who controls this contract. Refresh on-chain status before sending.';
  if (role === 'pending-owner') {
    return same(wallet, roles.pendingOwner) ? null
      : roles.pendingOwner ? `Only the pending owner (${short(roles.pendingOwner)}) can accept ownership.` : 'There is no pending ownership transfer.';
  }
  if (same(wallet, roles.owner)) return null;
  if (role === 'owner') return `This needs the contract owner's wallet (${short(roles.owner)}). The connected wallet can't make this change.`;
  if (role === 'config' && same(wallet, roles.operatorAdmin)) return null;
  if (role === 'finance' && same(wallet, roles.financeAdmin)) return null;
  const alt = role === 'config' ? roles.operatorAdmin : roles.financeAdmin;
  return `This needs the owner (${short(roles.owner)})${alt && !same(alt, roles.owner) ? ` or the ${role === 'config' ? 'operator' : 'finance'} admin (${short(alt)})` : ''}. The connected wallet can't make this change.`;
}

export const BASIS_POINTS = 10_000n;

/** Splits are basis points of the per-mint payout; the remainder goes to the operator recipient. */
export function splitsPreflight(artist: bigint, marketplace: bigint, operator: bigint): string | null {
  const total = artist + marketplace + operator;
  if (total > BASIS_POINTS) return `Splits add up to ${Number(total) / 100}%. They must total 100% or less.`;
  return null;
}

export function splitsWarning(splits: { artist: bigint; marketplace: bigint; operator: bigint } | null, price: bigint | null) {
  if (!splits || price === null || price === 0n) return null;
  const total = splits.artist + splits.marketplace + splits.operator;
  if (total === 0n) return 'Splits are 0/0/0, so 100% of each payout goes to the operator recipient address. Set the artist share if that is not what you want.';
  if (total < BASIS_POINTS) return `Splits add up to ${Number(total) / 100}%; the remaining ${Number(BASIS_POINTS - total) / 100}% goes to the operator recipient address.`;
  return null;
}

/** Contract rule: end 0 = no end; otherwise start must not be after end. */
export function phaseWindowPreflight(start: bigint, end: bigint): string | null {
  if (end !== 0n && start > end) return 'The phase starts after it ends. Set the end block after the start block (or 0 for no end).';
  return null;
}

export type ActivePhaseState = { phaseId: bigint; enabled: boolean; startBlock: bigint; endBlock: bigint } | null;

/** Mints fail (u113/u114) unless the active phase exists, is enabled and the chain is inside its window. */
export function activePhaseOpen(phase: ActivePhaseState, currentBlock: bigint | null): { ok: boolean; hint?: string } {
  if (!phase || phase.phaseId === 0n) return { ok: true };
  if (currentBlock === null) return { ok: false, hint: 'could not read the current block height' };
  if (!phase.enabled) return { ok: false, hint: `phase ${phase.phaseId} is disabled — enable it or clear the active phase` };
  if (currentBlock < phase.startBlock) return { ok: false, hint: `phase ${phase.phaseId} starts at block ${phase.startBlock}` };
  if (phase.endBlock !== 0n && currentBlock > phase.endBlock) return { ok: false, hint: `phase ${phase.phaseId} ended at block ${phase.endBlock}` };
  return { ok: true };
}

/** Finalize only succeeds when sold out with no open reservations, and it is permanent. */
export function finalizePreflight(state: { maxSupply: bigint | null; minted: bigint | null; reserved: bigint | null }): string | null {
  if (state.maxSupply === null || state.minted === null || state.reserved === null)
    return 'Could not read supply and reservations. Refresh on-chain status before finalizing.';
  if (state.maxSupply === 0n) return 'Set max supply first; a collection with no supply cannot be finalized.';
  if (state.minted < state.maxSupply) return `Finalize is only possible once every token is minted (${state.minted} of ${state.maxSupply} so far).`;
  if (state.reserved > 0n) return `Release the ${state.reserved} open reservation(s) first.`;
  return null;
}
