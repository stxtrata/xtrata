import type { Snapshot } from './controller';

/**
 * Four plain steps from nothing to paid plays. Each groups the gates behind it:
 *   Connect      the pay-per-play radio address, the main wallet, access (canary)
 *   Passkey      create or unlock the listening wallet
 *   Link & fund  link it to the main wallet, add funds (or bring it under 1 STX)
 *   Listen       paying switched on, first paid play
 * Shown only while setting up for the first time (see `showSteps`); once set up the panel is one line.
 */
export const STAGES = ['Connect', 'Passkey', 'Link & fund', 'Listen'] as const;
/** Passkey-only listeners have no wallet to connect or link: three steps. */
export const SOLO_STAGES = ['Passkey', 'Add 1 STX', 'Listen'] as const;
export const stagesFor = (solo: boolean): readonly string[] => (solo ? SOLO_STAGES : STAGES);

export interface StageView {
  /** Index of the step to do now; STAGES.length once paid plays are taking place. */
  at: number;
  /** The current step is blocked rather than waiting on the listener. */
  blocked: boolean;
  /** One line under the track: where the listener is and what comes next. */
  caption: string;
}

/** Where a listener stands. Returns null when the panel has nothing to show yet (loading). */
export function stageOf(s: Pick<Snapshot, 'step' | 'payingOn' | 'session' | 'entries' | 'gate'> & { solo?: boolean; depositPending?: boolean }): StageView | null {
  if (s.solo) return soloStageOf(s);
  const n = STAGES.length;
  const view = (at: number, caption: string, blocked = false): StageView => ({ at, blocked, caption: at >= n ? caption : `Step ${at + 1} of ${n} · ${caption}` });
  switch (s.step) {
    case 'off': case 'loading': return null;
    case 'elsewhere': return view(0, 'open the pay-per-play radio');
    case 'connect': return view(0, 'connect your wallet above');
    case 'not-invited': return view(0, 'this wallet is not in the test yet', true);
    case 'wrong-wallet': return view(0, 'connect the wallet this listening wallet belongs to', true);
    case 'unsupported': return view(1, 'this browser cannot make a passkey wallet', true);
    case 'intro': return view(1, 'create your passkey listening wallet');
    case 'locked': return view(1, 'unlock your passkey listening wallet');
    case 'link': return view(2, 'link to your main wallet');
    case 'fund': return view(2, s.depositPending ? 'funds on their way: nothing to do' : 'add up to 1 STX');
    case 'over': return view(2, 'over 1 STX: return the excess', true);
    case 'ready': {
      if (!s.payingOn || !s.session || s.session.playsLeft < 1) return view(3, 'switch paying on');
      const plays = s.entries.filter((e) => e.kind === 'play');
      if (plays.some((e) => e.status === 'confirmed')) return view(n, 'Paid plays are taking place');
      if (plays.some((e) => ['signed', 'pending', 'unknown'].includes(e.status))) return view(3, 'first paid play sent, confirming');
      return view(3, 'listen to a song for 30 seconds');
    }
    default: return null;
  }
}

function soloStageOf(s: Pick<Snapshot, 'step' | 'payingOn' | 'session' | 'entries'> & { depositPending?: boolean }): StageView | null {
  const n = SOLO_STAGES.length;
  const view = (at: number, caption: string, blocked = false): StageView => ({ at, blocked, caption: at >= n ? caption : `Step ${at + 1} of ${n} · ${caption}` });
  switch (s.step) {
    case 'off': case 'loading': return null;
    case 'elsewhere': return view(0, 'open the pay-per-play radio');
    case 'unsupported': return view(0, 'this browser cannot make a passkey wallet', true);
    case 'intro': return view(0, 'create your passkey listening wallet');
    case 'locked': return view(0, 'unlock your passkey listening wallet');
    case 'fund': return view(1, s.depositPending ? 'your funds are on their way: nothing to do' : 'add 1 STX: anyone can send it to your address');
    case 'over': return view(1, 'over 1 STX: return the excess', true);
    case 'ready': {
      if (!s.payingOn || !s.session || s.session.playsLeft < 1) return view(2, 'switch paying on');
      const plays = s.entries.filter((e) => e.kind === 'play');
      if (plays.some((e) => e.status === 'confirmed')) return view(n, 'Paid plays are taking place');
      if (plays.some((e) => ['signed', 'pending', 'unknown'].includes(e.status))) return view(2, 'first paid play sent, confirming');
      return view(2, 'listen to a song for 30 seconds');
    }
    default: return null;
  }
}

/**
 * The steps are for first-time setup only. Someone who has paid before, on this wallet or any other on this
 * device (`heard`), or whose wallet is already linked, sees no track: unlocking, topping up or switching back on is just the one action.
 */
export function showSteps(s: Pick<Snapshot, 'step' | 'entries' | 'linked'> & { solo?: boolean; creditedTo?: string; heard?: boolean }, stage: StageView | null) {
  if (!stage || stage.at >= stagesFor(!!s.solo).length) return false;
  if (s.heard) return false; // this device has played songs already (another wallet or album): a new album wallet is not "setup"

  if (s.step === 'wrong-wallet') return false; // not setup: this device already has a listening wallet, for another wallet
  if (s.entries.some((e) => e.kind === 'play')) return false; // has paid before: not first-time setup
  if (s.creditedTo) return false; // an existing wallet, reached on a new device: nothing to set up
  return !(s.step === 'locked' && s.linked); // a returning, already linked wallet just unlocks
}
