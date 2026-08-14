// The gate model.
//
// Every physically irreversible step in getting X Chess 2 onto mainnet, in
// order, with the rule that matters:
//
//   A STEP IS NOT DONE BECAUSE ITS BUTTON WAS CLICKED. It is done when its
//   effect has been READ BACK OFF CHAIN.
//
// That distinction is the whole point. The failure worth catching is not the
// transaction that fails - that one is loud. It is the transaction that is
// accepted and then does not say what you meant, which looks exactly like
// success until somebody depends on it.
//
// So `verify` is separate from `run`, it always reads, and a step that cannot
// be verified stays open however well its transaction went.
//
// This file is pure: no DOM, no wallet, no network. It is the part that can be
// tested, and tests/gates proves the gating cannot be walked around.

export type Phase =
  | 'preflight'
  | 'contract'
  | 'configure'
  | 'exercise'
  | 'artefact'
  | 'production'
  // The short track's own three, so its headings say what it is doing rather
  // than borrowing names from a sequence it is not running.
  | 'before'
  | 'inscribe'
  | 'after'
  // The wallet matrix's own, for the same reason.
  | 'reading'
  | 'signing'
  | 'refusing';

export type StepState = 'waiting' | 'running' | 'ok' | 'failed' | 'skipped';

export interface StepDef {
  id: string;
  phase: Phase;
  title: string;
  /** What this proves. Shown on the page, because a step nobody understands gets clicked through. */
  why: string;
  /** Steps that must be `ok` first. */
  needs: string[];
  /**
   * True when running this cannot be undone: it spends money, deploys a
   * contract, or inscribes bytes. These get a confirmation of their own.
   */
  irreversible: boolean;
  /** True when a person has to do something outside this page and report back. */
  manual?: boolean;
}

/**
 * The steps.
 *
 * Ordered as the brief's phases L to P require, and no step exists that does not
 * close a line in ops/LAUNCH.md.
 */
export const STEPS: StepDef[] = [
  // ---- preflight ---------------------------------------------------------
  {
    id: 'wallet',
    phase: 'preflight',
    title: 'Find a wallet, and say what kind of page this is',
    why:
      'Which providers are here, whether the Xtrata shim is installed, and whether there is a ' +
      'host bridge. Without a bridge nothing can be signed, and it is better to know that now ' +
      'than to meet it as a failed transaction.',
    needs: [],
    irreversible: false
  },
  {
    id: 'account',
    phase: 'preflight',
    title: 'Connect, and check the account can pay for what follows',
    why:
      'The address that will own the contract, its balance, and its network. A deploy from the ' +
      'wrong account is not recoverable: the contract is at that address forever.',
    needs: ['wallet'],
    irreversible: false
  },
  {
    id: 'name-free',
    phase: 'preflight',
    title: 'Check the contract name is free',
    why:
      'A name can only be used once per address. If it is taken, the deploy fails after the fee ' +
      'has been paid, and if it is taken BY AN EARLIER ATTEMPT the deploy is not what you think.',
    needs: ['account'],
    irreversible: false
  },
  {
    id: 'source',
    phase: 'preflight',
    title: 'Read the source that is about to be deployed, and hash it',
    why:
      'The bytes on this page are what will be on chain forever. The hash shown here must match ' +
      'contractHash in dist/manifest.json, or the artefact and the contract disagree about what ' +
      'the rules are.',
    needs: [],
    irreversible: false
  },

  // ---- the contract ------------------------------------------------------
  {
    id: 'deploy',
    phase: 'contract',
    title: 'Deploy the contract',
    why: 'The first irreversible act. After this the contract exists at this address forever.',
    needs: ['name-free', 'source'],
    irreversible: true
  },
  {
    id: 'deployed',
    phase: 'contract',
    title: 'Read the contract back off chain',
    why:
      'A confirmed transaction is not the same as a contract that says what you meant. This reads ' +
      'the format version, the protocol name, the contract principal it reports for itself, and ' +
      'its solvency, from the chain rather than from this page.',
    needs: ['deploy'],
    irreversible: false
  },

  // ---- configuration -----------------------------------------------------
  {
    id: 'configure',
    phase: 'configure',
    title: 'Set the fee and the sponsorship constants',
    why:
      'The launch values from ADR-0004, measured rather than guessed. Set here rather than ' +
      'compiled in, so a fee regime change never needs a new contract.',
    needs: ['deployed'],
    irreversible: true
  },
  {
    id: 'configured',
    phase: 'configure',
    title: 'Read the configuration back',
    why:
      'Every constant, from the chain. A sponsorship priced from a value nobody checked is a ' +
      'promise that can be under-funded, and every game opened after it inherits the mistake.',
    needs: ['configure'],
    irreversible: false
  },

  // ---- exercising it -----------------------------------------------------
  {
    id: 'standard',
    phase: 'exercise',
    title: 'Open a standard game',
    why: 'The base path: the fee moves, a game id is consumed, and a row appears.',
    needs: ['configured'],
    irreversible: true
  },
  {
    id: 'submit',
    phase: 'exercise',
    title: 'Submit a move to it',
    why:
      'One click, one transaction, one entry. If two entries appear for one click, the page ' +
      'booted twice and every move from here would cost double.',
    needs: ['standard'],
    irreversible: true
  },
  {
    id: 'sponsored',
    phase: 'exercise',
    title: 'Open a sponsored challenge naming a wallet with ZERO STX',
    why:
      'The product. The contract must send the bootstrap to an account that holds nothing, in ' +
      'the same transaction, with no server involved.',
    needs: ['submit'],
    irreversible: true
  },
  {
    id: 'bootstrapped',
    phase: 'exercise',
    title: 'Check the empty wallet actually received the bootstrap',
    why:
      'Read its balance off chain. This is the moment the zero-STX design is either true or not.',
    needs: ['sponsored'],
    irreversible: false
  },
  {
    id: 'rebate',
    phase: 'exercise',
    title: 'Submit a SPONSORED move, signed by the sponsored wallet',
    why:
      'THE step this whole page exists for, and it is driven here rather than reported: the ' +
      'point is to exercise the real path, not to record that somebody once did. Running it ' +
      'asks the wallet to switch to the bootstrapped account, submits from it, and then reads ' +
      'the rebate back. Run it TWICE: once to send, once to verify after it confirms. A ' +
      'sponsored move makes the contract pay STX out, so under deny mode it needs a ' +
      'contract-principal post condition. See risk R1, and ADR-0008 for what happens without one.',
    needs: ['bootstrapped'],
    irreversible: true
  },
  {
    id: 'exhaustion',
    phase: 'exercise',
    title: 'Spend the ALLOWANCE to zero, then move once more',
    why:
      'Running out must not end the game. The allowance reaches zero, the next submission is ' +
      'still stored, and the player simply pays their own gas. ' +
      'READ THE WORD ALLOWANCE LITERALLY: it is rebates-left reaching zero, NOT the balance. ' +
      'The balance cannot be drained by playing, and trying is a trap that has cost real time. ' +
      'At a rebate of 0.010 against a median mainnet fee of 0.003, every move pays the wallet ' +
      'about 0.007 MORE than it costs, so a sponsored player gets richer the longer they play. ' +
      'The fast way to reach this state is not a long game: set-sponsorship with a count of 2, ' +
      'open a NEW sponsored game, and it exhausts in three moves. A sponsorship row captures ' +
      'its rebate and count at funding time, so changing the setting never alters a game already ' +
      'funded.',
    needs: ['rebate'],
    irreversible: true
  },
  {
    id: 'topup',
    phase: 'exercise',
    title: 'Top up the sponsorship from a third account',
    why: 'Anyone may pay. No billing, no account: the payment is the transaction.',
    needs: ['rebate'],
    irreversible: true
  },
  {
    id: 'treasury',
    phase: 'exercise',
    title: 'Try to withdraw more than is free, then withdraw what is',
    why:
      'The solvency invariant, on chain rather than in a test. The over-draw must be REFUSED, ' +
      'and after taking every free microSTX a sponsored game must still pay its rebates.',
    needs: ['rebate'],
    irreversible: true
  },
  {
    id: 'settle',
    phase: 'exercise',
    title: 'Settle an expired sponsorship from an unrelated account',
    why:
      'No keeper and no cron. Anyone may release an expired reserve, and a renounced contract ' +
      'must never be able to strand one.',
    needs: ['topup'],
    irreversible: true
  },
  {
    id: 'ranked',
    phase: 'exercise',
    title: 'Open a ranked game and verify it end to end',
    why:
      'It appears in the ranked index, its rules confirm against the commitment, both players ' +
      'move, and the rating derives from the chain alone.',
    needs: ['rebate'],
    irreversible: true
  },

  // ---- the artefact ------------------------------------------------------
  {
    id: 'build',
    phase: 'artefact',
    title: 'Confirm the built artefact matches this contract',
    why:
      'Paste dist/manifest.json. The contract it names must be the one just deployed, and its ' +
      'contractHash must match the source hashed at preflight. A board built against a different ' +
      'contract shows a different log under the same game number.',
    needs: ['ranked', 'exhaustion', 'treasury', 'settle'],
    irreversible: false
  },
  {
    id: 'matrix',
    phase: 'artefact',
    title: 'Sign off the wallet matrix against this build',
    why:
      'Fourteen rows a machine cannot run. Row 4 is the sponsored move above. The release gate ' +
      'refuses without the build hash written into MATRIX.md.',
    needs: ['build'],
    irreversible: false,
    manual: true
  },
  {
    id: 'inscribe-canary',
    phase: 'artefact',
    title: 'Inscribe the canary artefact',
    why: 'Permanent. Done outside this page, then its inscription id is recorded here.',
    needs: ['matrix'],
    irreversible: true,
    manual: true
  },
  {
    id: 'canary-live',
    phase: 'artefact',
    title: 'Run the whole matrix against the INSCRIPTION',
    why:
      'Not the local build. The legacy project found three permanent bugs that existed only in ' +
      'the inscribed artefact, and none was visible anywhere else.',
    needs: ['inscribe-canary'],
    irreversible: false,
    manual: true
  },

  // ---- production --------------------------------------------------------
  {
    id: 'prod-contract',
    phase: 'production',
    title: 'Deploy the production contract',
    why: 'Only after every canary finding is resolved. Immutable, at that address, forever.',
    needs: ['canary-live'],
    irreversible: true
  },
  {
    id: 'prod-verified',
    phase: 'production',
    title: 'Read the production contract back and record it',
    why: 'Source, identifier, hash, deploy transaction and configuration, into ops/RELEASES.md.',
    needs: ['prod-contract'],
    irreversible: false
  },
  {
    id: 'prod-inscribe',
    phase: 'production',
    title: 'Inscribe the production artefact',
    why:
      'The last irreversible act, and there is no second one. These bytes are the application ' +
      'forever: they cannot be patched, replaced or withdrawn, and every game played from here ' +
      'on is played through them. Nothing below this line is a formality.',
    needs: ['prod-verified'],
    irreversible: true,
    manual: true
  },
  {
    id: 'launch-verified',
    phase: 'production',
    title: 'Run the launch suite against the permanent inscription',
    why:
      'The two acceptance tests in sections 78 and 79 of the brief, against the real thing. ' +
      'Until these pass, X Chess 2 has not launched, whatever is on chain.',
    needs: ['prod-inscribe'],
    irreversible: false,
    manual: true
  }
];

export type StepStates = Record<string, StepState>;

export function initialStates(steps: StepDef[] = STEPS): StepStates {
  const out: StepStates = {};
  for (const step of steps) out[step.id] = 'waiting';
  return out;
}

/**
 * May this step be run?
 *
 * Everything it needs must be `ok`, and it must not already be `ok` itself.
 * Re-running a completed irreversible step is how you deploy a second contract
 * by accident.
 */
export function isAvailable(step: StepDef, states: StepStates): boolean {
  if (states[step.id] === 'ok' || states[step.id] === 'running') return false;
  return step.needs.every((need) => states[need] === 'ok');
}

/** Why a step is locked, for the page to show instead of a disabled button. */
export function blockedBy(step: StepDef, states: StepStates, steps: StepDef[] = STEPS): string[] {
  return step.needs
    .filter((need) => states[need] !== 'ok')
    .map((need) => steps.find((s) => s.id === need)?.title ?? need);
}

/**
 * Redoing a step invalidates everything downstream of it.
 *
 * Without this, re-deploying and then skipping the verify would leave every
 * later step marked `ok` against a contract that no longer exists. The states
 * would describe a run that never happened.
 */
export function invalidateFrom(id: string, states: StepStates, steps: StepDef[] = STEPS): StepStates {
  const out = { ...states };
  const dependents = new Set<string>([id]);

  // Transitive: a step depending on a step that depended on this one also goes.
  let changed = true;
  while (changed) {
    changed = false;
    for (const step of steps) {
      if (dependents.has(step.id)) continue;
      if (step.needs.some((need) => dependents.has(need))) {
        dependents.add(step.id);
        changed = true;
      }
    }
  }

  for (const step of dependents) out[step] = 'waiting';
  return out;
}

export interface Progress {
  total: number;
  done: number;
  failed: number;
  /** The next step that can actually be run, or null. */
  next: StepDef | null;
  /** True only when every step is ok. */
  complete: boolean;
}

export function progress(states: StepStates, steps: StepDef[] = STEPS): Progress {
  const done = steps.filter((s) => states[s.id] === 'ok').length;
  const failed = steps.filter((s) => states[s.id] === 'failed').length;
  return {
    total: steps.length,
    done,
    failed,
    next: steps.find((s) => isAvailable(s, states)) ?? null,
    complete: done === steps.length
  };
}

export const PHASE_TITLES: Record<Phase, string> = {
  preflight: 'Before anything is spent',
  contract: 'The contract',
  configure: 'Configuration',
  exercise: 'Exercising it on chain',
  artefact: 'The artefact',
  production: 'Production',
  before: 'Rehearsal, before anything is permanent',
  inscribe: 'The inscription',
  after: 'The real thing',
  reading: 'What is here, and who it says you are',
  signing: 'Signing, which spends real money',
  refusing: 'Refusing well, which is most of the work'
};

/**
 * The short track: get one board on chain, tonight.
 *
 * Not a reduced version of the launch sequence - a different question. STEPS
 * above asks "is this safe to launch forever", which is the right question when
 * the contract and the board are both being fixed in place at once. This asks
 * "will these bytes work once inscribed", against a contract that is already
 * deployed and proven.
 *
 * The difference matters because it decides what may be skipped. A board is
 * REPLACEABLE: a bad inscription costs its fee and the next one supersedes it.
 * A contract is not. So everything here is about the bytes, and nothing about
 * the economics - those were settled on chain already.
 *
 * Three things make an inscription dead on arrival, all of them invisible in
 * local development, and all three are what the rehearsal step exists to catch:
 * the bundle booting TWICE so every click signs two transactions, the wallet
 * bridge being absent so the page can read but never play, and the API being
 * unreachable because the runtime's rewrite only touches HTML and the script
 * has to choose the proxy itself.
 */
export const INSCRIBE_STEPS: StepDef[] = [
  {
    id: 'wallet',
    phase: 'before',
    title: 'Find a wallet, and say what kind of page this is',
    why:
      'Which providers are here, whether the Xtrata shim is installed, and whether there is a ' +
      'host bridge. Without a bridge nothing can be signed, and it is better to know that now ' +
      'than from the inscription.',
    needs: [],
    irreversible: false
  },
  {
    id: 'account',
    phase: 'before',
    title: 'Connect, and check the account',
    why: 'The address, its network, and that it can pay for the inscription that follows.',
    needs: ['wallet'],
    irreversible: false
  },
  {
    id: 'deployed',
    phase: 'before',
    title: 'Read the contract these bytes are bound to',
    why:
      'The board names one contract forever. It must exist, on this network, and answer - a ' +
      'board bound to a contract that is not there reads every game as missing, and no amount ' +
      'of re-reading fixes an inscription.',
    needs: ['account'],
    irreversible: false
  },
  {
    id: 'build',
    phase: 'before',
    title: 'Confirm the bytes about to be inscribed',
    why:
      'Paste dist/manifest.json. Its hash must match the file being inscribed and the contract ' +
      'it names must be the one just read back. This is the last moment either can be changed.',
    needs: ['deployed'],
    irreversible: false
  },
  {
    id: 'rehearsal',
    phase: 'before',
    title: 'Rehearse the artefact under the Xtrata runtime',
    why:
      'THE step that earns the money. Serve the exact bytes through the runtime emulator and ' +
      'check the three things that are invisible until they are permanent: that it boots ONCE ' +
      'and not twice, that a wallet bridge is reachable, and that it can read a real game. ' +
      'Run `npm run serve:runtime:framed` and open the address it prints. FRAMED IS NOT AN ' +
      'EXTRA: an inscription can only sign when a host frames it and holds a bridge token, which ' +
      'is how the Xtrata site opens one. Unframed the board reads perfectly and cannot sign at ' +
      'all, so the plain `serve:runtime` rehearses everything except the half this step is for. ' +
      'The runtime addresses the artefact as an INSCRIPTION rather than by filename, so asking ' +
      'it for xchess.html is a 404 - use its root, or /i/9002 for the board alone.',
    needs: ['build'],
    irreversible: false
  },
  {
    id: 'inscribe-board',
    phase: 'inscribe',
    title: 'Inscribe the board',
    why:
      'Permanent, and done outside this page with your own Xtrata tooling. Paste the ' +
      'inscription id back here. Everything before this was rehearsal; everything after is ' +
      'checking the real thing.',
    needs: ['rehearsal'],
    irreversible: true
  },
  {
    id: 'inscription-live',
    phase: 'after',
    title: 'Open the inscription and check it is the build you inscribed',
    why:
      'Not the local build. It must boot once, self-report the version and hash from the ' +
      'manifest above, and load a game from the chain. A board that reads is most of a board.',
    needs: ['inscribe-board'],
    irreversible: false
  },
  {
    id: 'first-move',
    phase: 'after',
    title: 'Play one real move FROM the inscription',
    why:
      'The acceptance test, and the only one that cannot be rehearsed. Sign a submission from ' +
      'the inscribed page itself and watch it land in the log. Reading proves the bytes; this ' +
      'proves the bridge.',
    needs: ['inscription-live'],
    irreversible: true
  }
];

// ---------------------------------------------------------------------------
// The wallet matrix, as steps rather than as a table nobody can run.
//
// `harness/wallets/MATRIX.md` is fourteen rows that have every one said "not
// run" since the day it was written, and the release gate checked it by
// searching the file for that string - so the table's only machine-readable
// property was a phrase whose ABSENCE was treated as proof of work done.
// Editing it to "done" satisfied the gate with no evidence at all.
//
// These are the same fourteen rows, executable. Two rules make the result mean
// something:
//
//   IT USES THE BOARD'S OWN CODE. `connectWallet`, `walletCall`,
//   `contractCallParams` and `guardFor`, imported rather than reimplemented. A
//   page that signs through its own copy proves things about the copy.
//
//   IT RECORDS WHICH PROVIDER SERVED EACH CALL. On a page with three providers
//   "it worked" is not a result; "it worked through window.XverseProviders
//   .BitcoinProvider" is. Every fault found by hand in the last two days was a
//   fault about WHICH provider answered.
//
// Rows 5 to 7 are the same four scenarios on another wallet or another device,
// so they are not steps here - they are this whole track, run again over there,
// and the sign-off records which.
// ---------------------------------------------------------------------------

export const WALLET_STEPS: StepDef[] = [
  {
    id: 'w-survey',
    phase: 'reading',
    title: 'What is on this page',
    why:
      'Every provider, in the order the board would try them, plus whether the Xtrata shim is ' +
      'installed and whether there is a host bridge. This is the context every row below is ' +
      'true or false WITHIN, and a result recorded without it cannot be compared to anything.',
    needs: [],
    irreversible: false
  },
  {
    id: 'w-connect',
    phase: 'reading',
    title: 'Row 1 - connect',
    why: 'The wallet opens and an address comes back, through the board\'s own connectWallet.',
    needs: ['w-survey'],
    irreversible: false
  },
  {
    id: 'w-no-wallet',
    phase: 'refusing',
    title: 'Row 10 - no wallet installed',
    why:
      'Says there is no wallet and does not hang. Run this in a browser with the extensions ' +
      'disabled; it is the one row that is meaningless anywhere else.',
    needs: ['w-survey'],
    irreversible: false,
    manual: true
  },
  {
    id: 'w-locked',
    phase: 'refusing',
    title: 'Row 11 - wallet locked',
    why: 'Waits for the unlock screen and then connects, rather than reporting no wallet.',
    needs: ['w-survey'],
    irreversible: false,
    manual: true
  },
  {
    id: 'w-late',
    phase: 'refusing',
    title: 'Row 14 - a provider that appears late',
    why:
      'Reload and press Connect before the extension has injected. waitForProvider exists for ' +
      'this and nothing has ever exercised it.',
    needs: ['w-survey'],
    irreversible: false,
    manual: true
  },
  {
    id: 'w-network',
    phase: 'refusing',
    title: 'Row 13 - wrong network',
    why: 'Refuses, and says which network it wanted. Switch the wallet to testnet first.',
    needs: ['w-connect'],
    irreversible: false,
    manual: true
  },
  {
    id: 'w-bridge',
    phase: 'refusing',
    title: 'Rows 8 and 9 - framed and unframed',
    why:
      'Framed with a bridge token it signs through the host. Unframed it must refuse UP FRONT ' +
      'with a clear message rather than producing a failed transaction. Both halves, and the ' +
      'unframed half is the one that costs a fee when it is wrong.',
    needs: ['w-survey'],
    irreversible: false
  },
  {
    id: 'w-open',
    phase: 'signing',
    title: 'Row 2 - open a Standard game',
    why: 'One prompt, one transaction, and the 1.00 STX capped by a post condition.',
    needs: ['w-connect'],
    irreversible: true
  },
  {
    id: 'w-move',
    phase: 'signing',
    title: 'Row 3 - submit a move',
    why:
      'One prompt, one transaction, and NOTHING sent. With no sponsorship the transaction now ' +
      'declares that no money moves at all, so the wallet should say nothing about a transfer.',
    needs: ['w-open'],
    irreversible: true
  },
  {
    id: 'w-cancel',
    phase: 'signing',
    title: 'Row 12 - the user cancels',
    why:
      'Reports the cancellation and does NOT go round the provider list asking the same ' +
      'question again. Cancelling is an answer.',
    needs: ['w-connect'],
    irreversible: false
  },
  {
    id: 'w-sponsored',
    phase: 'signing',
    title: 'Row 4 - a SPONSORED move',
    why:
      'The one that has never run anywhere, and the whole product. Under deny mode the ' +
      'contract\'s rebate is a transfer needing its own post condition, in a contract-principal ' +
      'encoding no previous X Chess build ever sent. The bytes match @stacks/transactions, ' +
      'which proves the encoding and not that any wallet accepts it.',
    needs: ['w-open'],
    irreversible: true
  },
  {
    id: 'w-record',
    phase: 'signing',
    title: 'Write the results out',
    why:
      'Emits the rows in the matrix\'s own format, with the build hash, the provider that served ' +
      'each call and every transaction id. Paste it into harness/wallets/MATRIX.md; the release ' +
      'gate reads THAT rather than searching for the absence of a phrase.',
    needs: [],
    irreversible: false
  }
];
