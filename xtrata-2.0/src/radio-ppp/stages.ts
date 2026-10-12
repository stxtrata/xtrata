import type { Snapshot } from './controller';

/**
 * The pay-per-play gates in the order a listener passes them, from opening the radio
 * address to the first paid play. Shown numbered at the top of the panel throughout.
 */
export const STAGES = ['Radio address', 'Connect wallet', 'Access', 'Passkey wallet', 'Link', 'Add funds', 'Switch on', 'First paid play'] as const;

export interface StageView {
  /** Index of the stage to do now; STAGES.length once paid plays are taking place. */
  at: number;
  /** The current stage is blocked rather than waiting on the listener. */
  blocked: boolean;
  /** One line under the track: where the listener is and what comes next. */
  caption: string;
}

/** Where a listener stands. Returns null when the panel has nothing to show yet (loading). */
export function stageOf(s: Pick<Snapshot, 'step' | 'payingOn' | 'session' | 'entries' | 'gate'>): StageView | null {
  const n = STAGES.length;
  const view = (at: number, caption: string, blocked = false): StageView => ({ at, blocked, caption: at >= n ? caption : `Stage ${at + 1} of ${n} · ${caption}` });
  switch (s.step) {
    case 'off': case 'loading': return null;
    case 'elsewhere': return view(0, 'open the pay-per-play radio address');
    case 'connect': return view(1, 'connect your main Stacks wallet above');
    case 'not-invited': return view(2, 'this wallet is not in the canary yet', true);
    case 'unsupported': return view(3, 'this browser cannot make a passkey wallet', true);
    case 'intro': return view(3, 'create your passkey listening wallet');
    case 'locked': return view(3, 'unlock your passkey listening wallet');
    case 'link': return view(4, 'link the listening wallet to your main wallet');
    case 'fund': return view(5, 'add up to 1 STX to the listening wallet');
    case 'over': return view(5, 'over 1 STX: return the excess to keep paying', true);
    case 'ready': {
      if (!s.payingOn || !s.session || s.session.playsLeft < 1) return view(6, 'switch paying on');
      const plays = s.entries.filter((e) => e.kind === 'play');
      if (plays.some((e) => e.status === 'confirmed')) return view(n, 'All stages done · paid plays are taking place');
      if (plays.some((e) => ['signed', 'pending', 'unknown'].includes(e.status))) return view(7, 'first paid play sent, confirming on-chain');
      return view(7, 'listen to a song for 30 seconds');
    }
    default: return null;
  }
}
