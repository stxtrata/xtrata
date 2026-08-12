// The application.
//
// Everything on screen is DERIVED. The board comes from replaying the log, the
// result comes from replay, the ratings come from replaying every eligible game.
// Nothing is stored and nothing is trusted, which is why none of it needs to be.

import { renderBoard, destinationsFrom, promotionChoices, pieceGlyph, pieceName } from './board.js';
import type { PendingMove } from './board.js';
import { Names } from '../chain/bns.js';
import { BlockTimes, formatClock } from '../chain/block-time.js';
import { parseUci } from '../chess/uci.js';
import { KING, WHITE } from '../chess/board.js';
import { SHELL } from './shell.js';
import { Sound } from './audio.js';
import { actorOf, soundFor } from './sounds.js';
import { renderSoundPanel, soundNote, soundToggleLabel } from './sound-panel.js';
import type { SoundPanel } from './sound-panel.js';
import { replay } from '../replay/replay.js';
import type { ReplayState } from '../replay/replay.js';
import { EVENT_STRINGS } from '../replay/events.js';
import {
  DEFAULT_RULES,
  describeRules,
  looksLikePrincipal,
  normaliseRules,
  readyToOpen
} from '../protocol/rules.js';
import type { Rules } from '../protocol/rules.js';
import { rulesHash } from '../protocol/canonical.js';
import { recoverRules } from '../protocol/recover.js';
import { knownRules, linkForGame, rememberRules, rulesFromLink } from '../protocol/known-rules.js';
import { checkEligibility } from '../ratings/eligibility.js';
import { judge, judgeEvent, judgeMove } from './eligibility.js';
import type { Ctx, Verdict } from './eligibility.js';
import { computeRatings, leaderboard } from '../ratings/elo-v1.js';
import type { RatedGame } from '../ratings/elo-v1.js';
import { describeContractError } from '../chain/client.js';
import type {
  Chain,
  ChainReader,
  EntryRow,
  GameRow,
  PendingRow,
  SponsorshipRow
} from '../chain/client.js';

export type Tab = 'play' | 'game' | 'explore' | 'leaderboard' | 'profile';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** A row of the game list, after it has been read and replayed. */
interface ExploreRow {
  id: number;
  ranked: boolean;
  entries: number;
  white: string | null;
  black: string | null;
  confirmed: boolean;
  state: string;
}

/**
 * How often the board re-reads.
 *
 * Short enough that a move appears while somebody is still looking at the
 * board, long enough that a public endpoint is not being hammered. Reads are
 * free and need no wallet, so the only real cost is somebody else's rate limit.
 */
const POLL_MS = 5_000;

/**
 * The other three rates.
 *
 * FAST is for the seconds around a move landing - the only time somebody is
 * really watching. SLOW is for when the board cannot change without the
 * opponent doing something rare. STARVED is the floor when the endpoint's
 * allowance is nearly gone: slower than anyone would like, and never stopped,
 * because a board that stops reading is a board that needs a manual Refresh.
 */
const FAST_POLL_MS = 2_500;
const SLOW_POLL_MS = 15_000;
const STARVED_POLL_MS = 30_000;

/**
 * The rate for a tab nobody is looking at.
 *
 * Reading a hidden tab is normally the wrong thing to do, and this application
 * refused to for exactly that reason. It is done here for one purpose: a game
 * with a quarter of an hour between moves is a game nobody sits and watches, so
 * a sound that only plays while the board is in front is a sound that never
 * plays at the moment it is needed.
 *
 * Slower than anything in the foreground, because nothing here is being
 * watched - the sound is the whole output, and being twenty seconds late to it
 * is imperceptible when the thing it announces took ten minutes to confirm.
 * Only ever used while a live game is loaded AND the person asked for it.
 */
const BACKGROUND_POLL_MS = 20_000;

/**
 * A principal, short enough to read.
 *
 *   SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W  ->  SP1C...KXFF6W
 *
 * The head and the tail are what somebody actually checks against a wallet, and
 * a forty-one character string wrapping over three lines is unreadable as well
 * as ugly. THE FULL VALUE IS NEVER DISCARDED: every element that shows one of
 * these carries it in full, so copying, screen readers and anybody verifying by
 * eye still get all of it.
 *
 * Stacks addresses are NOT a fixed width - roughly a quarter are not 41
 * characters - so anything shorter than the abbreviation is returned whole
 * rather than padded or truncated into something that is not an address.
 */
export function shortPrincipal(address: string): string {
  const value = String(address ?? '');
  if (value.length <= 14) return value;
  return `${value.slice(0, 4)}...${value.slice(-6)}`;
}

export interface AppOptions {
  chain: ChainReader & Partial<Chain>;
  /** Everything a build knows about itself. Shown, so a page can be identified. */
  build?: {
    version?: string;
    contract?: string;
    network?: string;
    /** When it was built, so two dev builds can be told apart. */
    built?: string;
    /** A short hash of the built bytes. The unambiguous answer. */
    hash?: string;
  };
  /** Injected so tests can drive connect without a wallet. */
  connect?: () => Promise<{ address: string } | null>;
  disconnect?: () => Promise<void>;
  /** Why signing is unavailable here, if it is. */
  signingBlocked?: () => 'no-bridge' | 'no-wallet' | null;
  document?: Document;
  /** Injected so tests can hear what the board announced without a speaker. */
  sound?: Sound;
}

/** Ids the shell defines. Every one must exist, or wiring throws. */
const IDS = [
  'build-tag', 'chain-notice', 'sign-notice',
  'tab-play', 'tab-game', 'tab-explore', 'tab-leaderboard', 'tab-profile',
  'view-play', 'view-game', 'view-explore', 'view-leaderboard', 'view-profile',
  'connect', 'disconnect',
  'game-kind', 'rules-white', 'rules-black', 'rules-ranked',
  'rules-summary', 'price-summary', 'rules-problems', 'open-game',
  'join-game', 'load-game',
  'game-label', 'copy-link', 'flip', 'refresh', 'board', 'arrows', 'status', 'move-hint', 'promotion',
  'send-anyway', 'send-anyway-why', 'send-anyway-yes', 'send-anyway-no',
  'override', 'override-why', 'override-yes',
  'game-rules-state', 'game-rules-summary', 'game-rules-hash',
  'claim-rules', 'claim-white', 'claim-black', 'claim-check',
  'players', 'sponsorship', 'top-up',
  'resign', 'offer-draw', 'accept-draw', 'moves',
  'moves-title', 'toggle-skipped', 'skipped-note',
  'verify', 'verify-game',
  'sound-toggle', 'sound-master', 'sound-volume', 'sound-background',
  'sound-reset', 'sound-note', 'sound-list', 'sound-more', 'sound-detail', 'sound-sides',
  'explore-refresh', 'explore-count', 'explore-rows',
  'leaderboard-note', 'leaderboard-rows',
  'profile-who', 'profile-load', 'profile-body',
  'contract-label', 'endpoint-label'
] as const;

type Elements = Record<string, HTMLElement>;

const camel = (id: string): string => id.replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase());

export class ChessApp {
  private readonly doc: Document;
  private readonly chain: ChainReader & Partial<Chain>;
  private readonly options: AppOptions;
  private readonly el: Elements = {};

  private tab: Tab = 'play';
  private address: string | null = null;
  private gameId: number | null = null;
  private game: GameRow | null = null;
  private entries: EntryRow[] = [];
  private rules: Rules = { ...DEFAULT_RULES };
  private rulesConfirmed = false;
  private rulesTried = 0;
  private state: ReplayState | null = null;
  private selected: string | null = null;
  private pendingPromotion: { from: string; to: string } | null = null;
  private flipped = false;
  private busy = false;
  private pending: PendingRow[] = [];
  /**
   * The move this board is in the middle of making.
   *
   * Distinct from the mempool. A mempool entry only exists once a wallet has
   * been opened, signed, and the transaction broadcast - which is seconds, and
   * from the player's side it is seconds of a board that has not moved. So the
   * intended move is drawn the instant the destination is chosen, BEFORE the
   * wallet appears, and it stays drawn until the move shows up in the log.
   *
   * `signing` means a wallet is open. `broadcast` means it was signed and sent
   * and is on its way to a mempool this board has not polled yet. Cancelling
   * clears it, which is what makes a cancelled move vanish from the board
   * rather than lingering as a lie.
   */
  private intent: { from: string; to: string; uci: string; state: 'signing' | 'broadcast' } | null =
    null;
  /**
   * Whether the skipped submissions are shown.
   *
   * Off by default. The move list is what a game IS; the skipped entries are
   * what somebody tried and got charged for. Mixing them makes a game with a
   * few junk submissions unreadable, and the one thing a move list has to do is
   * let you follow the game.
   *
   * They are never hidden, though - only folded. The count is always on screen,
   * because "still stored and still charged" is the honest thing about this
   * design and a board that quietly dropped them would be misrepresenting it.
   */
  private showSkipped = false;
  /**
   * The sponsorship line, remembered against the game and wallet it describes.
   *
   * A cache, and a small one, but the reason it exists is not performance: see
   * drawSponsorship().
   */
  /** When the log was last read, so a refusal can insist on fresh evidence. */
  private lastReadAt = 0;
  /** A submission the player has been warned about and may yet confirm. */
  private pendingForced: string | null = null;
  /**
   * The player has overruled the board about who may move.
   *
   * The board can be wrong about this in two ways it cannot detect: the wallet
   * may sign as an account it was never told about, and a game whose rules it
   * could not confirm is not one it is refereeing. So the lock is always
   * accompanied by a way out, and taking it is remembered for the session.
   */
  private overridden = false;
  private exploreRows: ExploreRow[] = [];
  private sponsorshipText: { key: string; message: string } | null = null;
  /**
   * The sponsorship row itself, against the game and wallet it belongs to.
   *
   * Shared with the post condition, which is the point. `submit` used to read it
   * again on every move, and on a failed read fell back to a rebate of zero -
   * which emits NO condition covering what the contract pays out. A deny-mode
   * transaction with an uncovered transfer ABORTS, so a sponsored player whose
   * read was rate limited got a transaction that could not succeed and still
   * paid its network fee. Reading once and remembering it removes both the extra
   * request and the guess.
   */
  private sponsorship: { key: string; row: SponsorshipRow | null } | null = null;
  /** Names already looked up this session. null means "asked, and no owner". */
  private readonly resolvedNames = new Map<string, string | null>();
  private names: Names | null = null;
  private times: BlockTimes | null = null;
  private poll: ReturnType<typeof setTimeout> | null = null;
  /**
   * Set once stopPolling() has run, and never unset.
   *
   * Each tick schedules the next, so without this a board that was stopped
   * mid-read would carry on scheduling for the life of the page - and there
   * would be no handle left to cancel it with.
   */
  private stopped = false;

  private readonly sound: Sound;
  private soundPanel: SoundPanel | null = null;
  /** The document title before a turn was announced into it. */
  private baseTitle = '';
  /** True while the title is carrying a turn nobody has come back and seen. */
  private flashing = false;

  constructor(options: AppOptions) {
    this.options = options;
    this.chain = options.chain;
    this.doc = options.document ?? document;
    // Built before wiring, because the wiring reads its settings to draw the
    // panel and to label the switch in the top bar.
    this.sound = options.sound ?? new Sound({ document: this.doc });
    const endpoint = (options.chain as { reader?: unknown }).reader;
    if (endpoint) {
      this.names = new Names({ endpoint: endpoint as never, network: options.build?.network as never });
      this.times = new BlockTimes(endpoint as never);
    }
    this.wire();
    this.start();
  }

  // ------------------------------------------------------------------
  // Wiring
  // ------------------------------------------------------------------

  private wire(): void {
    for (const id of IDS) {
      const node = this.doc.getElementById(id);
      // A missing entry used to throw here, so nothing after it ran: the page
      // rendered perfectly and did nothing. Naming the id makes that a
      // one-line fix rather than a hunt.
      if (!node) throw new Error(`the shell is missing #${id}`);
      this.el[camel(id)] = node;
    }

    const on = (key: string, handler: () => void): void => {
      this.el[key].addEventListener('click', () => {
        if (this.busy) return;
        handler();
      });
    };

    for (const tab of ['play', 'game', 'explore', 'leaderboard', 'profile'] as Tab[]) {
      on(camel(`tab-${tab}`), () => this.show(tab));
    }

    on('connect', () => void this.connect());
    on('disconnect', () => void this.disconnect());
    on('openGame', () => void this.openGame());
    on('loadGame', () => void this.loadFromInput());
    on('refresh', () => void this.reload());
    on('verifyGame', () => void this.reverify());
    on('flip', () => {
      this.flipped = !this.flipped;
      this.drawGame();
    });
    on('overrideYes', () => {
      this.overridden = true;
      this.drawGame();
    });
    on('sendAnywayYes', () => {
      const value = this.pendingForced;
      this.clearAnyway();
      if (value) void this.submit(value, true);
    });
    on('sendAnywayNo', () => {
      this.clearAnyway();
      this.selected = null;
      this.drawGame();
    });
    on('claimCheck', () => void this.claimRules());
    on('copyLink', () => void this.copyLink());
    on('resign', () => void this.submit(EVENT_STRINGS.RESIGN));
    on('offerDraw', () => void this.submit(EVENT_STRINGS.DRAW_OFFER));
    on('acceptDraw', () => void this.submit(EVENT_STRINGS.DRAW_ACCEPT));
    on('toggleSkipped', () => {
      this.showSkipped = !this.showSkipped;
      this.drawGame();
    });
    on('topUp', () => void this.topUp());
    on('exploreRefresh', () => void this.loadExplore());
    on('profileLoad', () => void this.loadProfile());

    for (const key of ['gameKind', 'rulesWhite', 'rulesBlack', 'rulesRanked']) {
      this.el[key].addEventListener('input', () => this.drawDraft());
      this.el[key].addEventListener('change', () => this.drawDraft());
    }

    this.wireSound();
  }

  /**
   * The sound controls, and the two things that make them work at all.
   *
   * The panel rows are generated from the voice table rather than written into
   * the shell, so a sound added to the library arrives with its switch, its
   * slider and its preview already attached.
   *
   * `listen()` is the important call. A browser will not make a sound until the
   * page has been touched, and the sound this whole module exists for - your
   * opponent moved - arrives with nobody touching anything. So the first tap
   * anywhere is taken as permission, and until one happens the panel says out
   * loud that it is waiting for one.
   */
  private wireSound(): void {
    this.soundPanel = renderSoundPanel(this.el.soundList, this.sound);
    this.sound.onChange(() => this.drawSound());
    this.sound.listen();

    // NOT routed through `on`, which swallows a click while the board is busy.
    // Reaching for the mute button during a slow submission is precisely when
    // somebody wants it to work.
    this.el.soundToggle.addEventListener('click', () => this.sound.setMaster(!this.sound.enabled));
    // The panel opens on request and stays open for the session. Somebody who
    // has gone looking for the per-voice switches is not helped by having them
    // fold away again on the next redraw.
    this.el.soundMore.addEventListener('click', () => {
      const open = this.el.soundDetail.classList.toggle('hide');
      this.el.soundMore.setAttribute('aria-expanded', String(!open));
      this.el.soundMore.textContent = open ? 'More' : 'Less';
    });
    this.el.soundReset.addEventListener('click', () => {
      this.sound.reset();
      this.soundPanel?.refresh();
    });

    const master = this.el.soundMaster as HTMLInputElement;
    master.addEventListener('change', () => this.sound.setMaster(master.checked));
    const volume = this.el.soundVolume as HTMLInputElement;
    volume.addEventListener('input', () => this.sound.setVolume(Number(volume.value) / 100));
    const sides = this.el.soundSides as HTMLInputElement;
    sides.addEventListener('change', () => {
      this.sound.setSides(sides.checked);
      // Demonstrated rather than described. The switch says Black is pitched
      // lower; hearing the pair back to back is the only way to know whether
      // that is a difference you can actually follow.
      this.sound.audition(this.sound.voiceFor('move'), 'white');
      if (sides.checked) {
        this.doc.defaultView?.setTimeout(
          () => this.sound.audition(this.sound.voiceFor('move'), 'black'),
          260
        );
      }
    });

    const background = this.el.soundBackground as HTMLInputElement;
    background.addEventListener('change', () => {
      this.sound.setBackground(background.checked);
      // Reading a hidden tab starts or stops from this click, not from the next
      // time the tab happens to change state.
      this.scheduleTick(this.nextPollMs());
    });

    this.drawSound();
  }

  /** The controls, brought back in line with the settings. */
  private drawSound(): void {
    const on = this.sound.enabled;
    this.text('soundToggle', soundToggleLabel(this.sound));
    this.el.soundToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    (this.el.soundMaster as HTMLInputElement).checked = on;
    (this.el.soundBackground as HTMLInputElement).checked = this.sound.state.background;
    (this.el.soundBackground as HTMLInputElement).disabled = !on;
    (this.el.soundSides as HTMLInputElement).checked = this.sound.state.sides;
    (this.el.soundSides as HTMLInputElement).disabled = !on;
    const volume = this.el.soundVolume as HTMLInputElement;
    volume.disabled = !on;
    // Not written back while it is the element being dragged: replacing the
    // value under a finger ends the drag.
    if (this.doc.activeElement !== volume) {
      volume.value = String(Math.round(this.sound.state.volume * 100));
    }
    this.text('soundNote', soundNote(this.sound));
    this.soundPanel?.refresh();
  }

  private start(): void {
    const build = this.options.build ?? {};
    // Shown, not buried. During a period of frequent rebuilds the single most
    // useful thing a page can tell you is WHICH BUILD YOU ARE LOOKING AT, and a
    // version alone does not say that when every build is "2.0.0-dev".
    this.text(
      'buildTag',
      [build.version, build.built, build.hash ? `#${build.hash}` : null]
        .filter(Boolean)
        .join(' · ')
    );
    this.text('contractLabel', build.contract ? `contract ${build.contract}` : '');

    const blocked = this.options.signingBlocked?.() ?? null;
    if (blocked) {
      // Said up front rather than discovered as a failed transaction.
      this.notice(
        'signNotice',
        'warn',
        blocked === 'no-bridge'
          ? 'This page can read and replay everything, but it cannot sign. Open it through the Xtrata site to play.'
          : 'No Stacks wallet found. You can read and replay every game; playing needs a wallet.'
      );
      this.el.signNotice.classList.remove('hide');
    }

    this.drawDraft();
    void this.checkContract();
    this.openFromLink();
    this.startPolling();
  }

  /**
   * Open the game the address names, if it names one.
   *
   * `copyLink` has always BUILT a link carrying the game and its rules, and
   * nothing ever read the game back out. So the link worked in the sense that
   * the rules travelled, and failed in the sense that anybody following one
   * landed on the create-a-game form and had to be told the number by hand.
   * That is the entire onboarding path for a new player, and it was the one
   * thing on the page nobody had followed end to end.
   *
   * Parsed by hand rather than with URL, which needs a base and would mean
   * naming a host in an artefact that must never depend on one. Query first,
   * then fragment, because the Xtrata runtime serves an inscription from a path
   * that already carries a query of its own.
   */
  private openFromLink(): void {
    const href = String(this.doc.location?.href ?? '');
    const query = href.includes('?') ? href.slice(href.indexOf('?') + 1).split('#')[0] : '';
    const fragment = href.includes('#') ? href.slice(href.indexOf('#') + 1) : '';
    const raw = new URLSearchParams(query).get('game') ?? new URLSearchParams(fragment).get('game');
    if (raw === null) return;

    const game = Number(raw);
    // A link with a nonsense game number is somebody's typo, not an error to
    // shout about. The create form is a reasonable place to land.
    if (!Number.isInteger(game) || game < 1) return;

    this.show('game');
    void this.load(game);
  }

  /**
   * Keep the board current without anybody pressing Refresh.
   *
   * Chess on a chain has long gaps, and a board that only changes when you
   * reload makes every one of them feel like a fault. Polling is cheap - reads
   * cost nothing and need no wallet - and the mempool means a move shows up the
   * moment it is broadcast rather than when it confirms.
   *
   * Paused when the tab is hidden. Nobody is looking, and a background tab
   * quietly hammering a public endpoint is how a rate limit gets hit. The one
   * exception is background listening, which is asked for explicitly and reads
   * at a third of the rate - see `listeningInBackground`.
   */
  private startPolling(): void {
    this.scheduleTick(this.nextPollMs());
    // Escape closes the promotion picker, because a panel that has taken the
    // board over should give it back the way every other panel does.
    //
    // Registered ONCE and guarded on state, rather than added when the picker
    // opens. A listener added per-open would have to be removed on every one of
    // the five ways the picker closes, and `{ once: true }` is not the shortcut
    // it looks like: it fires on the first KEY, not the first Escape, so one
    // stray keystroke would quietly disarm it.
    this.doc.addEventListener('keydown', (event) => {
      if ((event as KeyboardEvent).key !== 'Escape' || !this.pendingPromotion) return;
      this.hidePromotion();
      this.drawGame();
    });
    this.doc.addEventListener('visibilitychange', () => {
      if (this.doc.visibilityState !== 'visible') return;
      // Coming back IS seeing it, so the title stops shouting.
      this.flashTitle(false);
      this.scheduleTick(0);
    });
  }

  /**
   * Should a hidden tab keep reading?
   *
   * Only when somebody asked for it, sound is on, and there is a live game to
   * announce something about. All three, because this is the one thing in the
   * application that spends a stranger's rate limit on a page nobody is
   * looking at, and each condition is a reason that spending is justified.
   */
  private listeningInBackground(): boolean {
    return this.sound.background && this.gameId !== null && this.state?.status === 'live';
  }

  /**
   * How long until the next read, in milliseconds.
   *
   * A flat interval spends the same amount whether or not anything can happen,
   * which is the wrong way round twice over. When it is YOUR move the position
   * cannot change at all except by the opponent resigning or offering a draw,
   * so reading every five seconds buys almost nothing. When your own move is in
   * flight, five seconds is too SLOW - that is the gap that had somebody
   * pressing Refresh to make their own move appear.
   *
   * So the same budget is spent where it buys something. Total spend is no
   * higher than the flat interval it replaces, and usually lower.
   */
  private nextPollMs(): number {
    const state = this.state;
    let ms = SLOW_POLL_MS;

    if (this.intent || this.pending.length) {
      // Something is on its way. This is the one moment somebody is watching
      // the board rather than glancing at it.
      ms = FAST_POLL_MS;
    } else if (state && state.status === 'live') {
      const mine = this.address ? judgeMove(this.eligibility(state)).tier === 'yes' : false;
      ms = mine ? SLOW_POLL_MS : POLL_MS;
    }

    // A tab nobody is looking at reads slowly, whatever the position says. The
    // only output is a sound, and a sound cannot be early or late in a way
    // anybody can perceive when the thing it announces took minutes to confirm.
    if (this.doc.visibilityState === 'hidden') ms = Math.max(ms, BACKGROUND_POLL_MS);

    // Then stretched by whatever allowance is left. The wallet spends from the
    // same per-IP budget, and a broadcast it cannot afford is a move that
    // cannot be made - but the board must never stop reading altogether, or a
    // confirmed move stays invisible until somebody presses Refresh.
    const left = (this.chain as { reader?: { remaining?: number | null } }).reader?.remaining;
    if (typeof left === 'number') {
      if (left <= 8) ms = Math.max(ms, STARVED_POLL_MS);
      else if (left <= 16) ms = Math.max(ms, ms * 3);
      else if (left <= 28) ms = Math.max(ms, ms * 2);
    }
    return ms;
  }

  private scheduleTick(ms: number): void {
    if (this.stopped) return;
    if (this.poll) clearTimeout(this.poll);
    this.poll = setTimeout(() => void this.tick(), ms);
  }

  private async tick(): Promise<void> {
    const skip =
      (this.doc.visibilityState === 'hidden' && !this.listeningInBackground()) ||
      this.busy ||
      this.gameId === null ||
      // Yield to the wallet. The allowance is per IP and the wallet spends from
      // the same one, for its nonce, its fee estimate and the broadcast itself.
      // Racing it means losing a move, and nothing on the board can change in
      // the seconds a dialog is open.
      this.intent?.state === 'signing';

    if (!skip) {
      try {
        await this.refreshQuietly();
      } catch {
        // A poll that throws must not end the polling. The next one may work.
      }
    }
    // Checked AGAIN, after the await. stopPolling() may have run while this
    // tick was reading, and a tick that rescheduled anyway would mean stopping
    // does not stop - the timer would outlive the board that owns it, forever,
    // because each one schedules the next.
    this.scheduleTick(this.nextPollMs());
  }

  /**
   * Read again soon, because something just happened that will change.
   *
   * Called after a broadcast: a move confirms in a block or two, and the person
   * who just made it is watching for exactly that.
   */
  private pollSoon(): void {
    this.scheduleTick(FAST_POLL_MS);
  }

  /**
   * One read, now.
   *
   * The same read the poller does, so a test can put a move on chain and see
   * what the board makes of it without waiting out a real interval.
   */
  async readNow(): Promise<void> {
    await this.refreshQuietly();
  }

  stopPolling(): void {
    this.stopped = true;
    if (this.poll) clearTimeout(this.poll);
    this.poll = null;
  }

  /**
   * Re-read without disturbing anything.
   *
   * Deliberately does not touch `busy`, show a spinner, or clear a selection: a
   * poll that interrupted somebody mid-move would be worse than no poll. If
   * nothing changed, nothing is redrawn.
   */
  private async refreshQuietly(): Promise<void> {
    if (this.gameId === null) return;
    const game = this.gameId;
    try {
      const [entries, pending] = await Promise.all([
        this.chain.getAllEntries(game),
        this.chain.getPending(game)
      ]);
      if (this.gameId !== game) return; // moved on while we were waiting
      this.lastReadAt = Date.now();

      // A poll may not SHORTEN the log.
      //
      // Several public hosts serve this contract and failover is one way, so a
      // shorter answer is far more likely a host a block behind than a real
      // reorg. Accepting one would rewind the turn and the standing draw offer
      // for the rest of the session - and the gate reads both. The explicit
      // Refresh button still replaces the log wholesale.
      if (entries.length < this.entries.length) return;

      const changed =
        entries.length !== this.entries.length ||
        pending.length !== this.pending.length ||
        pending.some((p, i) => p.txid !== this.pending[i]?.txid);
      if (!changed) return;

      this.entries = entries;
      this.pending = pending;
      this.settleIntent();
      this.adoptRules();
      this.derive();
      void this.resolveLabels();
    } catch {
      // A poll that failed is not worth saying anything about. The next one is
      // a few seconds away, and the board is still showing the last good read.
    }
  }

  /**
   * Names and block times, after the fact.
   *
   * Both are best effort and neither blocks the board: the position is drawn
   * from replay immediately, and the log re-renders when labels arrive.
   */
  private async resolveLabels(): Promise<void> {
    const state = this.state;
    if (!state) return;
    // Everyone the board NAMES, not only everyone who has moved.
    //
    // This used to be the senders alone, which is empty for a game nobody has
    // played yet - so the Players panel showed two raw addresses and never
    // asked what they were called. The people most in need of a readable name
    // are the two at the top of the screen.
    const senders = [
      ...state.log.map((r) => r.sender),
      state.rules.white,
      state.rules.black,
      ...state.rules.allow
    ].filter((s): s is string => Boolean(s));
    const heights = state.log.map((r) => r.height).filter((h): h is number => typeof h === 'number');

    const [gotNames, gotTimes] = await Promise.all([
      this.names?.resolveAll(senders) ?? Promise.resolve(false),
      this.times?.resolveAll(heights) ?? Promise.resolve(false)
    ]);
    if ((gotNames || gotTimes) && this.state) this.drawGame();
  }

  /**
   * Is there a contract at the address this board was built against?
   *
   * Asked once, up front. Without it the first symptom is whatever the visitor
   * happened to try - "loading game 4 failed" - which points at game 4 and at
   * nothing that would help.
   */
  private async checkContract(): Promise<void> {
    try {
      const version = await this.chain.getFormatVersion();
      this.notice('chainNotice', 'info', `Reading ${this.chain.contractId} (format ${version}).`);
      void this.loadExplore();
    } catch (error) {
      this.reportFailure('reading the contract', error);
    }
  }

  // ------------------------------------------------------------------
  // Small helpers
  // ------------------------------------------------------------------

  private text(key: string, value: string): void {
    this.el[key].textContent = value;
  }

  private notice(key: string, kind: 'info' | 'warn' | 'good' | 'loud', message: string): void {
    const node = this.el[key];
    // Every modifier is prefixed with its block. A bare `.info` once gave every
    // notice an icon rule's inline-flex and 15px width.
    node.className = `notice notice--${kind}`;
    node.textContent = message;
  }

  private async guard<T>(what: string, run: () => Promise<T>): Promise<T | null> {
    this.busy = true;
    try {
      return await run();
    } catch (error) {
      this.reportFailure(what, error);
      return null;
    } finally {
      this.busy = false;
    }
  }

  /**
   * Say what went wrong in terms of what the person was doing.
   *
   * Chain unavailability, the chain refusing, and a wallet refusing are three
   * different situations and want three different sentences.
   */
  private reportFailure(what: string, error: unknown): void {
    const err = error as { code?: string | number; message?: string };
    const code = err?.code;

    // Rate limiting is this page's own doing, not the chain's, and saying "the
    // chain is unavailable" would send somebody looking for a problem that does
    // not exist. It also has to name the WALLET, because the allowance is per
    // address and the wallet spends from it too - a broadcast refused this way
    // surfaces in Xverse as "unable to parse node response", which explains
    // nothing at all.
    if (code === 'RATE_LIMITED') {
      this.notice(
        'chainNotice',
        'warn',
        `The public Stacks endpoint is rate limiting this page, so ${what} did not go through. ` +
          'The chain is fine. Your wallet shares the same allowance, so a move may fail to ' +
          'broadcast while this lasts. Wait a minute and try again.'
      );
      return;
    }
    if (code === 'CHAIN_UNAVAILABLE' || code === 'NO_ENDPOINT') {
      this.notice('chainNotice', 'warn', `Could not reach any Stacks endpoint, so ${what} is unavailable. The chain is fine; this page cannot see it.`);
      return;
    }
    if (code === 'NO_WALLET' || code === 'NO_SIGNER') {
      this.notice('chainNotice', 'warn', `Connect a wallet to ${what}.`);
      return;
    }
    if (code === 4001 || /reject|declin|cancel/i.test(String(err?.message))) {
      this.notice('chainNotice', 'info', 'You cancelled that.');
      return;
    }
    // The wallet approved it and then could not broadcast it.
    //
    // -32603 is JSON-RPC for "internal error", and it is what Xverse returns
    // when its own node request fails - it shows "unable to parse node
    // response", which is what a rate-limit or gateway page looks like to
    // something expecting JSON. It is transient: the same move usually goes
    // through on the next attempt.
    //
    // The important half of this message is that NOTHING WAS SENT. A failed
    // broadcast is the one failure here that costs nothing at all, and somebody
    // who has just watched a wallet say "Transaction Failed" has every reason
    // to assume otherwise.
    if (code === -32603 || /internal error|parse node response|broadcast/i.test(String(err?.message ?? ''))) {
      this.notice(
        'chainNotice',
        'warn',
        'Your wallet approved that but could not broadcast it - the public Stacks node did not ' +
          'answer it properly. Nothing was sent and nothing was charged. This is usually ' +
          'transient; try again.'
      );
      return;
    }
    // "No such contract" is a specific answer and deserves a specific message.
    // Buried inside "loading game 4 failed", it reads as a problem with game 4.
    if (/NoSuchContract/i.test(String(err?.message ?? ''))) {
      this.notice(
        'chainNotice',
        'warn',
        `There is no contract at ${this.chain.contractId}. This board was built against a ` +
          'contract that does not exist on this network, so it can read nothing at all. ' +
          'Rebuild it with --contract pointing at a deployed one.'
      );
      return;
    }

    const contractError = /\(err u(\d+)\)/.exec(String(err?.message ?? ''));
    if (contractError) {
      this.notice('chainNotice', 'warn', `${what}: ${describeContractError(Number(contractError[1]))}`);
      return;
    }
    this.notice('chainNotice', 'warn', `${what} failed: ${String(err?.message ?? error)}`);
  }

  // ------------------------------------------------------------------
  // Views
  // ------------------------------------------------------------------

  show(tab: Tab): void {
    this.tab = tab;
    for (const name of ['play', 'game', 'explore', 'leaderboard', 'profile'] as Tab[]) {
      this.el[camel(`view-${name}`)].classList.toggle('hide', name !== tab);
      this.el[camel(`tab-${name}`)].setAttribute('aria-selected', String(name === tab));
    }
    if (tab === 'leaderboard') void this.loadLeaderboard();
  }

  get currentTab(): Tab {
    return this.tab;
  }

  // ------------------------------------------------------------------
  // Creating a game
  // ------------------------------------------------------------------

  private draft(): Partial<Rules> {
    return {
      white: (this.el.rulesWhite as HTMLInputElement).value,
      black: (this.el.rulesBlack as HTMLInputElement).value,
      ranked: (this.el.rulesRanked as HTMLInputElement).checked,
      allow: [],
      cooldown: 0,
      noConsecutive: false
    };
  }

  private drawDraft(): void {
    const draft = this.draft();
    const check = readyToOpen(draft);

    // A name is a lookup, not an identity.
    //
    // The rule set that gets HASHED has to name addresses: a hash of "jim.btc"
    // would be a commitment to something that can change hands, and the game
    // would silently change sides with it. So a name typed here is resolved
    // now, and what the game commits to is whoever owns it at this moment.
    if (check.unresolved.length) void this.resolveNames(check.unresolved);

    this.notice('rulesSummary', 'info', describeRules(normaliseRules(draft)));

    if (check.ready) {
      this.el.rulesProblems.classList.add('hide');
    } else {
      this.el.rulesProblems.classList.remove('hide');
      this.notice('rulesProblems', 'warn', check.problems.map((p) => p.message).join(' '));
    }
    (this.el.openGame as HTMLButtonElement).disabled = !check.ready;

    void this.drawPrice();
  }

  /**
   * Turn any .btc names in the form into the addresses that own them.
   *
   * Resolved into the fields themselves rather than behind them, so what is
   * about to be committed is what is on screen. A name that does not resolve is
   * left alone and the form stays not-ready: a typo must never be able to
   * commit a game to the wrong side, and "anyone" would be the worst possible
   * guess to make on somebody's behalf.
   */
  /**
   * A link that carries this game's rules.
   *
   * The only way an opponent's board can referee a game before anybody has
   * moved. The chain holds a hash and no players, and the search that recovers
   * a rule set needs somebody to have submitted first - so until then, every
   * other board in the world reads a named game as open to anyone.
   *
   * The rules are checked against the commitment when they arrive, so this is a
   * convenience and never an authority. A doctored link is discarded.
   */
  /**
   * Let somebody name the players, and check them against the commitment.
   *
   * The last resort, and the only one that works from EITHER side of a game
   * that has not started. The chain names the opener and nobody else, so:
   *
   *   - the opener's board cannot find the opponent, because they are nowhere;
   *   - the opponent's board finds them only because it can offer ITSELF as a
   *     candidate, which is the viewer rule;
   *   - and a game opened by a third party is invisible to both.
   *
   * Remembering solves it for games opened from here after this shipped, and a
   * link solves it for whoever is sent one. Neither helps a game that already
   * exists, which is exactly the game somebody is looking at when they notice.
   *
   * So: ask. A typed answer is not trusted - it is hashed against what the game
   * committed and refused if it does not match, which means this cannot be used
   * to make a board referee rules the game never agreed to. It can only find
   * the rules that were already there.
   */
  private async claimRules(): Promise<void> {
    const committed = this.game?.rulesHash ?? null;
    if (!committed) {
      this.notice('chainNotice', 'warn', 'This game committed to no rules, so there is nothing to match.');
      return;
    }

    const field = async (id: string): Promise<string> => {
      const raw = (this.el[id] as HTMLInputElement).value.trim();
      if (!raw) return '';
      if (/\./.test(raw) && this.names) return (await this.names.owner(raw)) ?? raw;
      return raw.toUpperCase();
    };

    const white = await field('claimWhite');
    const black = await field('claimBlack');
    if (!white || !black) {
      this.notice('chainNotice', 'warn', 'Name both players.');
      return;
    }

    // Both orders, because "white" and "black" are easy to swap and the hash
    // will say which way round it was.
    for (const [w, b] of [
      [white, black],
      [black, white]
    ]) {
      for (const ranked of [this.game?.ranked === true, this.game?.ranked !== true]) {
        const candidate = normaliseRules({ ...DEFAULT_RULES, white: w, black: b, ranked });
        if (rulesHash(candidate) !== String(committed).replace(/^0x/i, '').toLowerCase()) continue;

        rememberRules(candidate);
        this.rules = candidate;
        this.rulesConfirmed = true;
        this.derive();
        this.drawGame();
        // Two addresses this board has never seen before. Ask what they are
        // called, or the panel that just started naming the players names them
        // in hex.
        void this.resolveLabels();
        this.notice(
          'chainNotice',
          'good',
          `That matches what game ${this.gameId} committed. This board is refereeing it now, and ` +
            'will remember it. Use Copy link to give your opponent a link that carries it too.'
        );
        return;
      }
    }

    this.notice(
      'chainNotice',
      'warn',
      'Those two do not hash to what this game committed, in either order. Check the addresses - ' +
        'a game commits to the ADDRESS, so a .btc name that has changed hands will not match.'
    );
  }

  private async copyLink(): Promise<void> {
    if (this.gameId === null) return;
    // Built from the page's OWN address and nothing else. A literal host in a
    // permanent artefact is a dependency it can never shed, which is what the
    // serverlessness audit exists to refuse - and it caught this line.
    const href = String(this.doc.location?.href ?? '');
    const absolute = linkForGame(href, this.gameId, this.rules);

    try {
      await (this.doc.defaultView?.navigator?.clipboard?.writeText?.(absolute) ??
        Promise.reject(new Error('no clipboard')));
      this.notice(
        'chainNotice',
        'good',
        `Link copied. It carries this game's rules, so your opponent's board can referee it ` +
          'before either of you has moved. The rules are checked against the chain when they ' +
          'arrive, so the link cannot change what the game agreed to.'
      );
    } catch {
      // No clipboard, which is ordinary in a sandboxed page. Show it instead,
      // because a link nobody can copy is worse than a link on screen.
      this.notice('chainNotice', 'info', `Copy this link for your opponent: ${absolute}`);
    }
  }


  private async resolveNames(names: readonly string[]): Promise<void> {
    if (!this.names) return;
    const fields = [this.el.rulesWhite, this.el.rulesBlack] as HTMLInputElement[];
    let changed = false;

    // "Absent" and "could not ask" are different answers and must not be
    // remembered as the same one. `Names.owner` returns null for both, so a
    // rate limited lookup was cached as "no such name" and the board then told
    // somebody to check the spelling of a name that is perfectly real.
    let unreachable = false;

    for (const wanted of [...new Set(names)]) {
      if (this.resolvedNames.has(wanted)) continue;
      const owner = await this.names.owner(wanted);
      if (owner === null && !(await this.names.reachable())) {
        unreachable = true;
        continue; // NOT remembered, so it is asked again
      }
      this.resolvedNames.set(wanted, owner);
      if (!owner) continue;
      for (const field of fields) {
        if (field.value.trim().toLowerCase() === wanted.toLowerCase()) {
          field.value = owner;
          field.title = `${wanted} resolved to this address`;
          changed = true;
        }
      }
    }

    const missing = names.filter((n) => this.resolvedNames.get(n) === null);
    if (changed) {
      this.notice(
        'rulesProblems',
        'good',
        `${[...this.resolvedNames.entries()]
          .filter(([, owner]) => owner)
          .map(([name, owner]) => `${name} is ${owner}`)
          .join(' \u00b7 ')}. The game commits to the ADDRESS, so it stays with this wallet even if the name moves.`
      );
      this.el.rulesProblems.classList.remove('hide');
      this.drawDraft();
    } else if (unreachable) {
      this.notice(
        'rulesProblems',
        'warn',
        'The name could not be looked up just now, so the lookup will be tried again. ' +
          'This is the public endpoint being busy rather than anything wrong with the name.'
      );
      this.el.rulesProblems.classList.remove('hide');
    } else if (missing.length) {
      this.notice(
        'rulesProblems',
        'warn',
        `${missing.join(', ')} does not resolve to an address. Check the spelling, or type the ` +
          'address itself.'
      );
      this.el.rulesProblems.classList.remove('hide');
    }
  }

  private async drawPrice(): Promise<void> {
    try {
      const kind = (this.el.gameKind as HTMLSelectElement).value;
      const [fee, price] = await Promise.all([
        this.chain.getOpenFee(),
        this.chain.getSponsorPrice()
      ]);
      const packages = kind === 'sponsor-both' ? 2n : kind === 'sponsor-opponent' ? 1n : 0n;
      const total = fee + price.total * packages;

      const stx = (value: bigint): string => (Number(value) / 1_000_000).toFixed(6).replace(/0+$/, '0');
      const parts = [`This costs ${stx(total)} STX.`];
      if (packages > 0n) {
        parts.push(
          `That is ${stx(fee)} to open, plus ${stx(price.total)} per sponsored player ` +
            `(${stx(price.bootstrap)} handed over at once, ${stx(price.liability)} held for rebates, ` +
            `${stx(price.margin)} margin).`
        );
        parts.push('Making a move never costs an X Chess fee; only the network is paid.');
      }
      this.notice('priceSummary', 'loud', parts.join(' '));
    } catch (error) {
      this.notice('priceSummary', 'info', 'Reading the price from the chain.');
      void error;
    }
  }

  private async openGame(): Promise<void> {
    const draft = this.draft();
    const check = readyToOpen(draft);
    if (!check.ready) return;

    const rules = normaliseRules(draft);
    const hash = rulesHash(rules);
    const kind = (this.el.gameKind as HTMLSelectElement).value;

    // A sponsorship has to have somebody to pay.
    //
    // The contract PUSHES the bootstrap to a named wallet in the opening
    // transaction. There is no version of this that works anonymously, and the
    // reason is the same one sponsorship exists for: a wallet holding nothing
    // cannot send a transaction, so it cannot claim anything later either. The
    // gas has to arrive before they do anything, which means somebody has to
    // say where.
    //
    // Caught here rather than at the wallet. Without this the failure is
    // "opening a game failed: not a Stacks address" from the codec, several
    // layers down, after the wallet has already opened.
    const needsNamed =
      kind === 'sponsor-both'
        ? ([['White', rules.white], ['Black', rules.black]] as const)
        : kind === 'sponsor-opponent'
          ? ([['Black', rules.black]] as const)
          : [];
    const unnamed = needsNamed.filter(([, who]) => !looksLikePrincipal(who));
    if (unnamed.length) {
      this.notice(
        'chainNotice',
        'warn',
        `${unnamed.map(([side]) => side).join(' and ')} ${unnamed.length === 1 ? 'is' : 'are'} ` +
          'not a named wallet, and a sponsored game has to have one to pay. The contract hands ' +
          'the gas over in this same transaction, so it needs an address - and a wallet holding ' +
          'nothing could not claim it later anyway, because claiming would cost gas it does not ' +
          'have.\n\nEither name the players, or open a standard game where anyone may play and ' +
          'each side pays for itself.'
      );
      return;
    }

    // Remembered BEFORE the transaction, not after.
    //
    // This is the only moment the full rule set is known for certain, and the
    // chain never learns it - a game commits to the hash and nothing else. If
    // the open succeeds and this page is closed before it confirms, the rules
    // are still here when it reopens. Written even if the wallet is then
    // cancelled, which costs one unused entry in a browser cache.
    rememberRules(rules);

    await this.guard('opening a game', async () => {
      if (kind === 'sponsor-opponent') {
        const opponent = rules.black;
        await this.chain.openSponsoredGame?.(hash, rules.ranked, opponent);
      } else if (kind === 'sponsor-both') {
        await this.chain.openSponsoredBoth?.(hash, rules.ranked, rules.white, rules.black);
      } else {
        await this.chain.openGame?.(hash, rules.ranked);
      }
      this.notice(
        'chainNotice',
        'good',
        'Sent. The game appears once the transaction is in a block; the chain is the record, not ' +
          'this page. When it does, use Copy link to send your opponent a link that carries the ' +
          'rules, so their board can referee this game before either of you has moved.'
      );
      return true;
    });
  }

  // ------------------------------------------------------------------
  // Loading and replaying a game
  // ------------------------------------------------------------------

  /**
   * Open a game by number, and SAY SO while it happens.
   *
   * Reading a game is several round trips to a public endpoint: the row, then
   * its log, then the mempool. On a slow network that is seconds during which
   * the button had gone back to looking untouched and the board still showed
   * the previous game - so it read as a click that did nothing, and the usual
   * response to that is to click again, which starts the whole thing twice.
   */
  private async loadFromInput(): Promise<void> {
    const field = this.el.joinGame as HTMLInputElement;
    const button = this.el.loadGame as HTMLButtonElement;
    const value = Number(field.value);
    if (!Number.isFinite(value) || value < 1) {
      this.notice('chainNotice', 'warn', 'That is not a game number.');
      field.focus();
      return;
    }

    // Said before anything is awaited, so the acknowledgement is instant even
    // when the answer is not.
    button.disabled = true;
    const wasLabel = button.textContent;
    button.textContent = 'Finding\u2026';
    this.notice('chainNotice', 'info', `Looking for game ${value} on ${this.chain.contractId}.`);
    this.show('game');
    this.text('gameLabel', `Game ${value}`);
    this.el.board.classList.add('board--loading');

    try {
      await this.load(value);
    } finally {
      button.disabled = false;
      button.textContent = wasLabel ?? 'Open that game';
      this.el.board.classList.remove('board--loading');
    }
  }

  async load(game: number): Promise<void> {
    // Switching games must not carry a half-finished promotion across. The
    // picker holds squares, and squares mean nothing on a different board.
    this.hidePromotion();
    const loaded = await this.guard(`loading game ${game}`, async () => {
      const row = await this.chain.getGame(game);
      if (!row) {
        this.notice('chainNotice', 'warn', `There is no game ${game}.`);
        return false;
      }
      this.gameId = game;
      this.game = row;
      this.overridden = false;
      const [entries, pending] = await Promise.all([
        this.chain.getAllEntries(game),
        this.chain.getPending(game)
      ]);
      this.entries = entries;
      this.pending = pending;
      this.lastReadAt = Date.now();
      return true;
    });

    if (!loaded) return;
    this.adoptRules();
    // Silently. A game is loaded whole, and every move in it is news only to
    // somebody who has not seen the game before - which is everybody opening
    // it. See `derive`.
    this.derive(true);
    this.show('game');
    void this.resolveLabels();
  }

  private async reload(): Promise<void> {
    if (this.gameId !== null) await this.load(this.gameId);
  }

  /**
   * Decide which rules to referee this game under.
   *
   * A board may only enforce rules that hash to what the game committed. Any
   * other rule set would skip submissions every other reader accepts, and the
   * log would stop being a shared record.
   *
   * It used to propose whatever was typed into the create form, which meant a
   * visitor arriving at somebody else's game could never confirm anything - and
   * neither could its creator once the form had been cleared. Every game read
   * as "cannot confirm", and the board refereed nothing.
   *
   * A hash cannot be inverted, but the space of rule sets this application can
   * CREATE is small and every name in it is on chain. So it is searched. See
   * RULES-V1 section 5, which says out loud that this makes a game's rules
   * public - they were never meant to be private.
   */
  private adoptRules(): void {
    // What this browser remembers, and what the link carried. Both are hashed
    // against the commitment inside recoverRules, so neither is trusted - but
    // either one rescues a game whose log is still empty, which the search
    // cannot do at all. Before this, a game opened naming two players read as
    // "anyone can play either colour" until somebody moved.
    const committed = this.game?.rulesHash ?? null;
    const offered = [
      knownRules(committed),
      rulesFromLink(String(this.doc.location?.href ?? ''), committed)
    ].filter((rules): rules is Rules => rules !== null);

    const found = recoverRules({
      rulesHash: committed,
      openedBy: this.game?.openedBy ?? '',
      ranked: this.game?.ranked === true,
      senders: this.entries.map((entry) => entry.sender),
      // A player watching their own game is the participant the chain does not
      // name. Without this, a game between two people opened by one of them is
      // unreadable to BOTH of them until somebody moves.
      viewer: this.address,
      candidates: offered
    });
    this.rules = found.rules;
    this.rulesConfirmed = found.confirmed;
    this.rulesTried = found.tried;
  }

  /**
   * Replay the log into a position.
   *
   * `fresh` means this is the first derivation of a game rather than a change
   * to one already on screen, and it exists for the sound. Opening a forty move
   * game replays forty moves; announcing them would be forty noises for the act
   * of opening a page. So a fresh derivation is silent and becomes the baseline
   * that everything after it is compared against.
   */
  private derive(fresh = false): void {
    const before = fresh ? null : this.state;
    this.state = replay(
      this.entries.map((entry) => ({
        mv: entry.value,
        sender: entry.sender,
        seq: entry.seq,
        height: entry.height
      })),
      { rules: this.rules }
    );
    this.selected = null;
    // A move landed while the picker was open, so the move it was about is no
    // longer the move on offer. Hiding it is the point: nulling alone left a
    // panel on screen whose buttons all returned early.
    this.hidePromotion();
    this.announce(before);
    this.drawGame();
  }

  /**
   * Say out loud what just changed, if anything.
   *
   * The decision of WHICH sound belongs to soundFor, which is pure and compares
   * two replayed states. Everything here is the part that needs a browser: one
   * sound, and the title, which is the half of this that survives a tab being
   * in the background on a browser that has throttled the audio.
   */
  private announce(before: ReplayState | null): void {
    const after = this.state;
    if (!after) return;
    const event = soundFor(before, after, this.address);
    if (!event) return;
    // Who acted, so the sides can be told apart by ear when that is switched
    // on. Null for anything no colour did, which must not be given one.
    this.sound.play(event, actorOf(before, after));
    if (event === 'your-turn' || event === 'check') this.flashTitle(true);
  }

  /**
   * Put the turn in the tab's title, and take it out again when it is seen.
   *
   * Costs nothing and works everywhere, including the browsers that throttle a
   * background tab hard enough to delay the sound. It is also the only part of
   * this that survives the tab being muted.
   */
  private flashTitle(on: boolean): void {
    if (!this.baseTitle) this.baseTitle = this.doc.title || 'X Chess';
    if (on && this.doc.visibilityState === 'hidden') {
      this.flashing = true;
      this.doc.title = `(your turn) ${this.baseTitle}`;
    } else if (!on && this.flashing) {
      this.flashing = false;
      this.doc.title = this.baseTitle;
    }
  }

  get replayState(): ReplayState | null {
    return this.state;
  }

  /** Everything a verdict is computed from, in one place. */
  private eligibility(state: ReplayState): Ctx {
    return {
      state,
      rulesConfirmed: this.rulesConfirmed,
      address: this.address,
      mempoolHasOffer: this.pending.some((row) => row.value === EVENT_STRINGS.DRAW_OFFER)
    };
  }

  // ------------------------------------------------------------------
  // Drawing a game
  // ------------------------------------------------------------------

  private drawGame(): void {
    const state = this.state;
    if (!state || this.gameId === null) return;

    this.text('gameLabel', `Game ${this.gameId}`);

    const canSubmit =
      Boolean(this.address) && state.status === 'live' && !this.options.signingBlocked?.();

    // The board-wide verdict. Computed once, and it drives BOTH what is
    // clickable and what the board says - so the two cannot drift apart. They
    // used to: the prose already explained that a wrong-side submission would
    // be skipped, while the squares stayed live and the wallet opened anyway.
    const ctx = this.eligibility(state);
    const verdict = judgeMove(ctx);

    // Squares are locked when the board is confident AND has been given an
    // address to be confident about. That covers the reported case - a wallet
    // holding White should not be able to pick up a black piece - without ever
    // becoming a trap, because `drawOverride` always offers the way past.
    const locked =
      !this.overridden &&
      verdict.tier !== 'yes' &&
      (verdict.tier === 'no' || (this.rulesConfirmed && Boolean(this.address)));

    this.drawWhyNot(canSubmit, verdict);
    this.drawOverride(verdict, locked);
    this.drawEventButtons(ctx, canSubmit);

    renderBoard(this.el.board, {
      position: state.position,
      legalMoves: state.legalMoves,
      flipped: this.flipped,
      selected: this.selected,
      lastMove: this.lastMoveSquares(),
      // Only a HARD refusal locks the squares. A warning leaves them live, so a
      // board that has guessed wrong about who may move can always be
      // overruled by the person who actually holds the wallet.
      readOnly: !canSubmit || locked,
      pending: this.pendingMoves(),
      signing: this.intent?.state === 'signing' ? `${this.intent.from}${this.intent.to}` : null
    }, {
      onSquare: (square) => this.onSquare(square)
    });

    this.drawArrows(state);
    this.drawStatus(state);
    this.drawRules();
    this.drawMoves(state);
    this.drawPlayers(state);
    void this.drawSponsorship();
  }

  /**
   * Pending submissions, as squares.
   *
   * Only ones that PARSE as a move get a ghost. A pending `resgn` or a pending
   * piece of line noise has no square to draw at, and inventing one would be
   * showing something that is not going to happen.
   */
  private pendingMoves(): PendingMove[] {
    const out: PendingMove[] = [];
    const seen = new Set<string>();

    const add = (from: string, to: string, sender: string | null): void => {
      if (seen.has(`${from}${to}`)) return;
      seen.add(`${from}${to}`);
      out.push({ from, to, sender });
      // A castle is ONE submission and TWO pieces. It is written as a king move
      // of two files - e1g1, e8c8 - and the rook is implied by the rules rather
      // than named, so a board that drew only what the submission says leaves
      // the rook sitting on its corner while the king slides past it. Both are
      // moving, so both get a ghost.
      const rook = this.castlingRook(from, to);
      if (rook && !seen.has(`${rook.from}${rook.to}`)) {
        seen.add(`${rook.from}${rook.to}`);
        out.push({ from: rook.from, to: rook.to, sender });
      }
    };

    // This board's own move first, so it appears the moment it is chosen rather
    // than whenever the next poll happens to run.
    if (this.intent) add(this.intent.from, this.intent.to, this.address);

    for (const row of this.pending) {
      if (!parseUci(row.value)) continue;
      // Deduped: once the mempool shows our own move, it is the same ghost.
      add(row.value.slice(0, 2).toLowerCase(), row.value.slice(2, 4).toLowerCase(), row.sender);
    }
    return out;
  }

  /**
   * The rook half of a castle, if this king move is one.
   *
   * Geometry, not adjudication: a king standing on its own square that moves
   * two files can only be castling, because no other king move goes that far.
   * Whether it is LEGAL is replay's business and this is only about what to
   * draw - a ghost is a claim about where a piece is going, not a ruling.
   */
  private castlingRook(from: string, to: string): { from: string; to: string } | null {
    const state = this.state;
    if (!state) return null;
    const cell = state.position.squares().find((sq) => sq.square === from);
    if (!cell?.piece || cell.piece.type !== KING) return null;

    const rank = from[1];
    if (to[1] !== rank) return null;
    const files = 'abcdefgh';
    const step = files.indexOf(to[0]) - files.indexOf(from[0]);
    if (step === 2) return { from: `h${rank}`, to: `f${rank}` };
    if (step === -2) return { from: `a${rank}`, to: `d${rank}` };
    return null;
  }

  /**
   * Forget an intent once the chain has caught up with it.
   *
   * Either it landed in the log, or the mempool is carrying it - and in both
   * cases the board is drawing it from something real rather than from a local
   * hope. Left alone, a stale intent would keep a ghost on the board forever
   * after a transaction that quietly failed.
   */
  private settleIntent(): void {
    if (!this.intent) return;
    const landed = this.entries.some(
      (entry) => entry.value.toLowerCase() === this.intent!.uci.toLowerCase()
    );
    const inMempool = this.pending.some(
      (row) => row.value.toLowerCase() === this.intent!.uci.toLowerCase()
    );
    if (landed || inMempool) this.intent = null;
  }

  /**
   * How this address should be labelled.
   *
   * A BNS name when there is one, an abbreviated principal otherwise. The
   * principal is always the truth: a name is display metadata, anybody can
   * register one resembling somebody else's, and everything here keeps working
   * when resolution fails.
   */
  private who(address: string | null): string {
    if (!address) return 'unknown';
    return this.names?.peek(address) ?? shortPrincipal(address);
  }

  /**
   * A span showing an address, carrying the whole thing.
   *
   * `title` is set for a mouse and `aria-label` for a screen reader, because
   * title tooltips do not exist on touch - which is exactly where an
   * abbreviation most needs explaining.
   */
  private addressNode(address: string | null, className = 'addr addr--short'): HTMLElement {
    const node = this.doc.createElement('span');
    node.className = className;
    node.textContent = this.who(address);
    if (address) {
      const name = this.names?.peek(address);
      const full = name ? `${name} - ${address}` : address;
      node.title = full;
      node.setAttribute('aria-label', full);
      node.dataset.principal = address;
    }
    return node;
  }

  private lastMoveSquares(): { from: string; to: string } | null {
    const last = [...(this.state?.accepted ?? [])].reverse().find((e) => e.kind === 'move');
    if (!last || last.kind !== 'move') return null;
    return { from: last.uci.slice(0, 2), to: last.uci.slice(2, 4) };
  }

  /**
   * Why the board is not accepting a move.
   *
   * A board whose squares are simply inert tells somebody nothing, and the
   * reasons are all different: not connected, not your turn, not your game,
   * already over. Each wants a different response.
   */
  private drawWhyNot(canSubmit: boolean, verdict: Verdict): void {
    const node = this.el.moveHint;

    const say = (text: string): void => {
      node.textContent = text;
    };

    // A move in flight outranks everything else here: it is what the person is
    // actually waiting on.
    if (this.intent) {
      say(
        this.intent.state === 'signing'
          ? `${this.intent.from} to ${this.intent.to} is waiting for your wallet. Nothing has been sent yet.`
          : `${this.intent.from} to ${this.intent.to} is broadcast. It counts once it is in a block, and only if replay accepts it.`
      );
      return;
    }

    if (this.options.signingBlocked?.() === 'no-bridge') {
      say('This page can read and replay everything, but it cannot sign. Open it through the Xtrata site to play.');
      return;
    }

    // The generic line only when there is nothing sharper to say. It used to
    // come FIRST, which meant the moment the board started refusing anything it
    // would explain itself with "this board cannot submit right now" - the
    // vaguest sentence available, replacing the specific one.
    if (!canSubmit && verdict.tier === 'yes' && this.address) {
      say('This board cannot submit right now.');
      return;
    }

    // Everything else is the verdict's own sentence. One call decided both what
    // is clickable and what is said about it, so they cannot disagree.
    say(verdict.say);
    if (verdict.tier !== 'yes' && !this.rulesConfirmed) {
      node.textContent +=
        ' This board could not confirm this game\u2019s rules, so that is a guess rather than a ruling.';
    }
  }

  /**
   * The way past a refusal.
   *
   * On screen whenever the board has locked the squares, and never hidden
   * behind the thing it has locked. This is what makes the lock safe: the board
   * cannot know which account the wallet will sign with, so it will sometimes
   * be wrong about whose turn it is, and a player who could not overrule it
   * would be stuck in a game the contract is perfectly willing to accept their
   * move in.
   */
  private drawOverride(verdict: Verdict, locked: boolean): void {
    const node = this.el.override;
    if (!locked || verdict.tier === 'no') {
      node.classList.add('hide');
      return;
    }
    node.classList.remove('hide');
    this.text('overrideWhy', verdict.say);
  }

  /**
   * The three control buttons.
   *
   * Judged SEPARATELY from moves, and the separation is load bearing. Replay
   * applies no turn check to a control event, and neither the cooldown nor the
   * no-consecutive rule reaches one. A board that keyed Resign off the move
   * verdict would refuse a resignation on the opponent's turn - which is when
   * people resign - and a player who cannot concede is stuck in a game with no
   * way out of it.
   */
  private drawEventButtons(ctx: Ctx, canSubmit: boolean): void {
    const buttons: [string, string][] = [
      ['resign', EVENT_STRINGS.RESIGN],
      ['offerDraw', EVENT_STRINGS.DRAW_OFFER],
      ['acceptDraw', EVENT_STRINGS.DRAW_ACCEPT]
    ];
    for (const [id, value] of buttons) {
      const node = this.el[id] as HTMLButtonElement | undefined;
      if (!node) continue;
      const verdict = judgeEvent(ctx, value);
      // Never disabled for want of a connected wallet: a control event moves no
      // money, so the wallet can sign one without this board having been told
      // which account it is.
      node.disabled = verdict.tier === 'no' || Boolean(this.options.signingBlocked?.());
      node.title = verdict.tier === 'yes' ? '' : verdict.say;
      void canSubmit;
    }
  }

  /**
   * A line from where each pending move started to where it is going.
   *
   * Drawn over the grid rather than inside it, because a mark that lived in a
   * square would be clipped by that square. The board is eight units wide in
   * the overlay's own coordinates, so a square is one unit and its centre is
   * half a unit in - no pixel measuring, and it survives any board size.
   *
   * This is the cue that makes a pending move readable at a glance. The ghost
   * says a piece is arriving; the line says where from.
   */
  private drawArrows(state: ReplayState): void {
    const svg = this.el.arrows;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    void state;

    const files = 'abcdefgh';
    const centre = (square: string): { x: number; y: number } | null => {
      const file = files.indexOf(square[0]);
      const rank = Number(square[1]);
      if (file < 0 || !rank) return null;
      // The board is drawn from Black's side when flipped, and the overlay has
      // to agree with it or every arrow points at the wrong square.
      const x = this.flipped ? 7 - file : file;
      const y = this.flipped ? rank - 1 : 8 - rank;
      return { x: x + 0.5, y: y + 0.5 };
    };

    const signing = this.intent?.state === 'signing' ? `${this.intent.from}${this.intent.to}` : null;

    for (const move of this.pendingMoves()) {
      // One line per move, and for a castle that means the king only: two
      // crossing arrows say less than one.
      const from = centre(move.from);
      const to = centre(move.to);
      if (!from || !to) continue;
      const isSigning = signing === `${move.from}${move.to}`;

      const line = this.doc.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', String(from.x));
      line.setAttribute('y1', String(from.y));
      line.setAttribute('x2', String(to.x));
      line.setAttribute('y2', String(to.y));
      line.setAttribute('class', isSigning ? 'ar--signing' : 'ar--sent');
      // Scaled by the viewBox, so the stroke has to be given in those units.
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.appendChild(line);

      const dot = this.doc.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', String(from.x));
      dot.setAttribute('cy', String(from.y));
      dot.setAttribute('r', '0.09');
      dot.setAttribute('fill', 'currentColor');
      dot.setAttribute('class', isSigning ? 'ar--signing' : 'ar--sent');
      svg.appendChild(dot);
    }
  }

  private drawStatus(state: ReplayState): void {
    if (state.status === 'over') {
      const who =
        state.result === '1-0' ? 'White wins' : state.result === '0-1' ? 'Black wins' : 'Drawn';
      this.notice('status', 'loud', `${who} by ${state.termination}. ${state.accepted.length} submissions counted.`);
      return;
    }
    // Check leads, and it makes the whole line loud. It is the one fact that
    // changes which moves are legal, and reading it as the fourth item in a
    // grey list is how a player ends up paying a fee for a move that gets
    // skipped because it left the king attacked.
    const bits = [state.inCheck ? `${state.turn} to move, IN CHECK` : `${state.turn} to move`];
    if (this.pending.length) {
      bits.push(
        `${this.pending.length} submission${this.pending.length === 1 ? '' : 's'} broadcast, not yet in a block`
      );
    }
    if (state.pendingOffer) bits.push(`${state.pendingOffer} has offered a draw`);
    if (state.rejected.length) {
      bits.push(
        `${state.rejected.length} submission${state.rejected.length === 1 ? '' : 's'} did not count`
      );
    }
    this.notice('status', state.inCheck ? 'warn' : 'info', bits.join(' · '));
  }

  private drawRules(): void {
    // Offered exactly when the board has admitted it cannot referee. Hiding it
    // the rest of the time keeps it from reading as something a player is
    // supposed to fill in.
    this.el.claimRules.classList.toggle('hide', this.rulesConfirmed || this.gameId === null);

    if (!this.rulesConfirmed) {
      this.notice(
        'gameRulesState',
        'warn',
        (this.game?.rulesHash
          ? `This board tried ${this.rulesTried} rule sets and none hashes to what this game ` +
            'committed, so it is refereeing nothing. The game was probably opened with rules ' +
            'this build cannot create, such as a wait between moves or a set-up position. '
          : 'This game committed to no rules, so nothing pins what it was and this board is ' +
            'refereeing nothing. ') +
          'The position shown uses the open-board rules and may differ from what the game agreed.'
      );
    } else {
      this.notice(
        'gameRulesState',
        'good',
        `These rules hash to what the game committed on chain, found in ${this.rulesTried} ` +
          `attempt${this.rulesTried === 1 ? '' : 's'}. This board is refereeing them.`
      );
    }
    this.text('gameRulesSummary', describeRules(this.rules, (w) => this.who(w)));
    this.text('gameRulesHash', this.game?.rulesHash ?? 'this game committed to no rules');
  }

  /**
   * The submissions, as a reader wants them.
   *
   * A move number, the piece that moved, what it did, how long into the game it
   * happened, and who played it. A bare `e4` says almost nothing; `1. Pawn e4,
   * 0:00, jim.btc` says what somebody actually wants to know.
   *
   * The clock is relative to the FIRST accepted move, which is 0:00 by
   * definition. Wall-clock time would say when a game was opened rather than
   * how long it has been running, and games here can sit for days.
   */
  /**
   * The moves, and separately the things that were tried and skipped.
   *
   * A move number, the piece, what it did, how long into the game, and who.
   * A bare `e4` says almost nothing; `1. Pawn e4, 0:00, jim.btc` says what
   * somebody actually wants to know.
   *
   * The clock is relative to the FIRST ACCEPTED move, which is 0:00 by
   * definition. Wall-clock time would say when a game was opened rather than
   * how long it has been running, and games here can sit for days.
   */
  private drawMoves(state: ReplayState): void {
    const list = this.el.moves;
    list.replaceChildren();

    const skipped = state.rejected.length;
    const shown = this.showSkipped ? state.log : state.accepted;

    this.text('movesTitle', this.showSkipped ? 'All submissions' : 'Moves');
    (this.el.toggleSkipped as HTMLButtonElement).textContent = this.showSkipped
      ? 'Hide skipped'
      : `Show skipped (${skipped})`;
    (this.el.toggleSkipped as HTMLButtonElement).disabled = skipped === 0;

    // Never hidden, only folded. "Still stored and still charged" is the honest
    // thing about this design, and a board that quietly dropped them would be
    // misrepresenting it.
    this.text(
      'skippedNote',
      skipped === 0
        ? 'Every submission to this game counted.'
        : `${skipped} submission${skipped === 1 ? '' : 's'} did not count. ` +
          'Each was still stored on chain and still cost its sender a network fee.'
    );

    const firstHeight = state.accepted.find((r) => typeof r.height === 'number')?.height ?? null;

    const span = (className: string, text: string): HTMLElement => {
      const node = this.doc.createElement('span');
      node.className = className;
      node.textContent = text;
      return node;
    };

    // Numbered from the accepted moves, so the numbering is the game's and does
    // not shift when the skipped entries are folded in or out.
    const numbers = new Map<number, number>();
    let moveNumber = 0;
    for (const record of state.accepted) {
      if (record.kind === 'move' && record.color === 'white') moveNumber++;
      if (record.kind === 'move') numbers.set(record.seq, moveNumber);
    }

    for (const record of shown) {
      const accepted = record.status === 'accepted';
      const isMove = accepted && record.kind === 'move';

      const li = this.doc.createElement('li');
      li.className = `mv${accepted ? '' : ' mv-rejected'}`;

      const number = isMove && record.color === 'white' ? numbers.get(record.seq) : undefined;
      li.appendChild(span('mv-num', number ? `${number}.` : ''));

      if (isMove) {
        // The same glyph the board uses, so a move in the list and the piece
        // that made it cannot look like different pieces.
        li.appendChild(
          span(`mv-glyph pc pc--${record.color}`, pieceGlyph(record.piece as never))
        );
      } else {
        li.appendChild(span('mv-glyph', accepted ? '\u2691' : '\u00b7'));
      }

      const body = this.doc.createElement('span');
      body.appendChild(span('mv-san', isMove ? record.san : record.raw || '(empty)'));

      if (isMove) {
        // The piece by name as well as by glyph: a glyph is unreadable to a
        // screen reader and ambiguous at small sizes.
        const colour = record.color === 'white' ? WHITE : 1;
        body.appendChild(span('mv-piece', pieceName(record.piece, colour as never).split(' ')[1]));
      } else if (accepted && record.kind === 'event') {
        body.appendChild(span('mv-piece', record.event.replace('-', ' ')));
      } else if (!accepted) {
        body.appendChild(span('mv-reason', record.reason));
      }

      if (typeof record.height === 'number' && firstHeight !== null) {
        const seconds = this.times?.gap(firstHeight, record.height);
        if (seconds !== null && seconds !== undefined && seconds >= 0) {
          body.appendChild(span('mv-clock', formatClock(seconds)));
        }
      }
      li.appendChild(body);

      li.appendChild(this.addressNode(record.sender, 'mv-who'));
      list.appendChild(li);
    }

    // Anything broadcast but not in a block, at the bottom, where it will
    // appear in the log when it lands.
    for (const row of this.pending) {
      const li = this.doc.createElement('li');
      li.className = 'mv mv--pending';
      li.appendChild(span('mv-num', ''));
      li.appendChild(span('mv-glyph', '\u25cc'));
      const body = this.doc.createElement('span');
      body.appendChild(span('mv-san', row.value));
      body.appendChild(span('mv-piece', 'pending'));
      li.appendChild(body);
      li.appendChild(this.addressNode(row.sender, 'mv-who'));
      list.appendChild(li);
    }
  }

  private drawPlayers(state: ReplayState): void {
    const node = this.el.players;
    node.replaceChildren();
    const span = (className: string, text: string): HTMLElement => {
      const el = this.doc.createElement('span');
      el.className = className;
      el.textContent = text;
      return el;
    };
    for (const [side, who] of [['White', state.rules.white], ['Black', state.rules.black]] as const) {
      const row = this.doc.createElement('div');
      row.className = 'row';
      const label = this.doc.createElement('strong');
      label.textContent = side;
      // Abbreviated on screen, whole on the element. A name alone should not
      // be trusted, so the principal is always what is really being shown.
      const value =
        who === 'anyone' || who === 'anyone-else'
          ? span('addr', who)
          : this.addressNode(who);
      row.append(label, value);
      node.appendChild(row);
    }
  }

  /**
   * The sponsorship, read at most once per game per wallet.
   *
   * It used to be read on every draw, which meant every five-second poll spent a
   * request on a row that only changes when this board itself submits something.
   * Three reads per poll is thirty-six a minute against a public allowance of
   * fifty, and the allowance is per IP - so the WALLET, which needs it for the
   * nonce, the fee estimate and the broadcast, was left with nothing. The
   * symptom was a move that could not be sent at all.
   *
   * Invalidated by `forgetSponsorship()` after a submit, which is the only thing
   * that changes it.
   */
  private async drawSponsorship(): Promise<void> {
    if (!this.address || this.gameId === null) {
      this.text('sponsorship', 'connect a wallet to see your sponsorship on this game');
      return;
    }
    const key = `${this.gameId}|${this.address}`;
    if (this.sponsorshipText?.key === key) {
      this.text('sponsorship', this.sponsorshipText.message);
      return;
    }
    const say = (message: string): void => {
      this.sponsorshipText = { key, message };
      this.text('sponsorship', message);
    };
    try {
      const row = await this.readSponsorship(this.gameId, this.address);
      if (!row) {
        say('You have no sponsorship on this game, so you pay your own network fees.');
        return;
      }
      if (row.rebatesLeft === 0n || row.settled) {
        // Stated plainly. Running out is an ordinary economic state.
        say(
          'Sponsored transactions remaining: 0. Your sponsorship allowance has been used. ' +
            'The game continues normally. Future transactions require ordinary Stacks network fees.'
        );
        return;
      }
      say(
        `Sponsored transactions remaining: ${row.rebatesLeft}. ` +
          `Each one returns ${(Number(row.rebate) / 1_000_000).toFixed(6)} STX.`
      );
    } catch (error) {
      // NOT remembered: a failed read should be retried, and saying "could not
      // read" forever would be worse than asking again. Rate limiting is named
      // rather than blamed on the chain, because the chain is fine and the
      // person can simply wait.
      const code = (error as { code?: string })?.code;
      this.text(
        'sponsorship',
        code === 'RATE_LIMITED'
          ? 'The public Stacks endpoint is rate limiting this page, so the sponsorship is unread. It will be read again shortly.'
          : 'could not read the sponsorship from the chain'
      );
    }
  }

  /**
   * The sponsorship for a game and wallet, read at most once.
   *
   * A null result is remembered too: "you have no sponsorship" is an answer, and
   * re-asking it every five seconds is exactly the waste this removes. A THROWN
   * read is not remembered, so a rate limit is retried rather than becoming
   * permanent.
   */
  private async readSponsorship(game: number, who: string): Promise<SponsorshipRow | null> {
    const key = `${game}|${who}`;
    if (this.sponsorship?.key === key) return this.sponsorship.row;
    const row = await this.chain.getSponsorship(game, who);
    this.sponsorship = { key, row };
    return row;
  }

  /** Forget the cached sponsorship. Called after anything that spends one. */
  private forgetSponsorship(): void {
    this.sponsorshipText = null;
    this.sponsorship = null;
  }

  // ------------------------------------------------------------------
  // Playing
  // ------------------------------------------------------------------

  private onSquare(square: string): void {
    const state = this.state;
    if (!state) return;

    // Any click on the board ends whatever promotion was being asked about.
    //
    // The ordering is clear / handle / re-open: this runs on entry, and the
    // branch below that opens a fresh picker runs at the end of the same call.
    // Without it, a player who changed their mind and picked up another piece
    // left the picker on screen still holding the ABANDONED move, and choosing
    // Queen submitted it and paid for it.
    this.hidePromotion();

    if (this.selected === null) {
      this.selected = square;
      this.sound.play('select');
      this.drawGame();
      return;
    }
    if (this.selected === square) {
      this.selected = null;
      this.drawGame();
      return;
    }

    const reachable = destinationsFrom(state.legalMoves, this.selected);
    if (!reachable.has(square)) {
      // Not an illegal move - the board disables squares that cannot be played,
      // so this is somebody changing their mind about which piece to pick up.
      this.selected = square;
      this.sound.play('select');
      this.drawGame();
      return;
    }

    const promotions = promotionChoices(state.legalMoves, this.selected, square);
    if (promotions.length) {
      // A promotion must name its piece, so the board has to ask. Submitting
      // `e7e8` would be a submission replay skips.
      this.pendingPromotion = { from: this.selected, to: square };
      // Drop the selection while the picker is up. Leaving the pawn selected
      // left the board live underneath an open panel, so the obvious way to
      // change your mind - click something else - re-selected while the picker
      // still held the old move.
      this.selected = null;
      this.askPromotion(promotions);
      this.drawGame();
      return;
    }

    void this.submit(`${this.selected}${square}`);
  }

  /**
   * Show the move being made, before anything is signed.
   *
   * Called on the way into a submission rather than on the way out. Between
   * choosing a square and a wallet appearing there is a real pause, and a board
   * that does not move during it looks like a board that did not hear the click.
   */
  private showIntent(uci: string): void {
    this.intent = {
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      uci,
      state: 'signing'
    };
    this.selected = null;
    this.drawGame();
  }

  /**
   * Put the promotion picker away.
   *
   * There was no such method, and that was the whole defect. The panel was
   * shown in one place and hidden in exactly one other - inside the per-piece
   * click handler - so every other way out of a promotion left it on screen
   * holding a move.
   *
   * Two things followed. A player who changed their mind and picked up a
   * different piece left the picker open still holding the OLD from/to, and
   * choosing Queen then submitted and PAID FOR a move they had abandoned. And a
   * poll landing the opponent's move cleared `pendingPromotion` without hiding
   * anything, leaving a panel whose every button silently did nothing.
   */
  private hidePromotion(): void {
    this.pendingPromotion = null;
    this.el.promotion.classList.add('hide');
  }

  private askPromotion(choices: string[]): void {
    const node = this.el.promotion;
    const pending = this.pendingPromotion;
    node.classList.remove('hide');
    node.replaceChildren();
    const label = this.doc.createElement('span');
    // Name the pawn. A panel that says which move it is about is a panel you can
    // tell is stale, and this one could previously outlive its own move.
    label.textContent = pending ? `Promote the ${pending.from} pawn on ${pending.to}: ` : 'Promote to: ';
    node.appendChild(label);
    for (const piece of choices) {
      const button = this.doc.createElement('button');
      button.type = 'button';
      button.className = 'action';
      button.textContent = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' }[piece] ?? piece;
      button.addEventListener('click', () => {
        const move = this.pendingPromotion;
        if (!move) return;
        this.hidePromotion();
        void this.submit(`${move.from}${move.to}${piece}`);
      });
      node.appendChild(button);
    }

    // Every chess interface a player has ever used lets them back out of a
    // promotion. Here, backing out previously meant either clicking a piece you
    // did not want or clicking a button that did nothing, with no way to tell
    // which you were getting.
    const cancel = this.doc.createElement('button');
    cancel.type = 'button';
    cancel.className = 'action';
    cancel.textContent = 'Cancel';
    const back = (): void => {
      this.hidePromotion();
      this.drawGame();
    };
    cancel.addEventListener('click', back);
    node.appendChild(cancel);
  }

  /**
   * The verdict, on state that is not stale.
   *
   * Refusing is the expensive direction, so it pays for a read; allowing is not,
   * so it pays for nothing. A `no` computed from a snapshot several seconds old
   * could be refusing a move that became legal when the opponent replied, and
   * the board would have no way of finding out.
   *
   * If the re-read throws, the verdict softens to a warning. An unreachable
   * endpoint - or a rate limit - must never become a lock.
   */
  private async judgeFresh(game: number, value: string): Promise<Verdict> {
    const state = this.state;
    if (!state) return { tier: 'yes', reason: null, say: '' };

    const first = judge(this.eligibility(state), value);
    if (first.tier !== 'no') return first;
    if (Date.now() - this.lastReadAt < POLL_MS) return first;

    try {
      await this.refreshQuietly();
    } catch {
      return { ...first, tier: 'warn' };
    }
    if (this.gameId !== game || !this.state) return { ...first, tier: 'warn' };
    return judge(this.eligibility(this.state), value);
  }

  /**
   * Say what is wrong, and offer to send it anyway.
   *
   * Every soft refusal has this escape hatch, and it is what makes the whole
   * gate safe. The board cannot know which account the wallet will sign with,
   * and it cannot always confirm a game's rules - so it will sometimes be wrong
   * about who may move. One extra click is a reasonable price for being warned;
   * an unplayable game is not.
   */
  private askAnyway(verdict: Verdict, value: string): void {
    this.pendingForced = value;
    const node = this.el.sendAnyway;
    node.classList.remove('hide');
    this.text('sendAnywayWhy', `${verdict.say} Send it anyway?`);
  }

  private clearAnyway(): void {
    this.pendingForced = null;
    this.el.sendAnyway.classList.add('hide');
  }

  private async submit(value: string, forced = false): Promise<void> {
    if (this.gameId === null) return;
    const game = this.gameId;

    // Judged BEFORE anything is drawn and before anything is signed.
    //
    // Drawing the ghost first would put "waiting for your wallet" over the top
    // of the reason the wallet is not opening, and the person would be looking
    // at a board that had moved and a wallet that never appeared.
    if (!forced) {
      const verdict = await this.judgeFresh(game, value);
      if (verdict.tier === 'no') {
        this.notice('chainNotice', 'warn', verdict.say);
        this.sound.play('refused');
        return;
      }
      if (verdict.tier === 'warn') {
        this.askAnyway(verdict, value);
        return;
      }
    }

    // A move first, a wallet second. This is drawn before anything is awaited,
    // so the board moves on the click rather than on the signature.
    if (parseUci(value)) this.showIntent(value);

    const result = await this.guard('submitting', async () => {
      // The rebate has to be known BEFORE signing: under a deny-mode post
      // condition every transfer must be covered, including every one the
      // CONTRACT makes to anybody, and an uncovered rebate aborts the whole
      // transaction after the contract has already succeeded.
      //
      // A FAILED READ IS NOT A ZERO. It used to be: the read was wrapped in
      // `.catch(() => null)`, so a rate-limited or unreachable endpoint produced
      // a rebate of zero, no condition covering the payout, and a transaction
      // that aborts the moment the contract pays. The player was charged the
      // network fee for a move that could never land. Failing here, before the
      // wallet opens, costs nothing at all.
      let rebate = 0n;
      if (this.address) {
        const row = await this.readSponsorship(game, this.address);
        if (row && !row.settled && row.rebatesLeft > 0n && row.reserved >= row.rebate) {
          rebate = row.rebate;
        }
      }

      await (this.chain as Chain & { submit(g: number, v: string, r?: bigint): Promise<unknown> })
        .submit(game, value, rebate);

      this.selected = null;
      this.hidePromotion();
      // A submission is the only thing that consumes a rebate, so this is the
      // only moment the cached sponsorship can have gone stale.
      this.forgetSponsorship();
      this.pollSoon();
      // Broadcast, not confirmed. A separate sound from the one that plays when
      // it lands, because they are separate facts and the gap between them is
      // the thing this board spends most of its effort explaining.
      this.sound.play('sent');
      this.notice(
        'chainNotice',
        'good',
        'Sent. It counts once it is in a block, and only if replay accepts it. ' +
          'A submission that does not count is still stored and still cost its network fee.'
      );
      return true;
    });

    if (result) {
      // Signed and broadcast. The ghost stays until the chain shows it, which
      // is the next poll at the latest.
      if (this.intent) this.intent = { ...this.intent, state: 'broadcast' };
      void this.refreshQuietly();
    } else {
      // Cancelled, refused, or failed. A ghost left behind here would be the
      // board asserting something that is not going to happen.
      this.intent = null;
    }
    this.drawGame();
  }

  private async topUp(): Promise<void> {
    if (this.gameId === null || !this.address) return;
    await this.guard('adding sponsorship', async () =>
      this.chain.topUpSponsorship?.(this.gameId!, this.address!)
    );
  }

  // ------------------------------------------------------------------
  // Wallet
  // ------------------------------------------------------------------

  private async connect(): Promise<void> {
    if (!this.options.connect) return;
    await this.guard('connecting', async () => {
      const session = await this.options.connect!();
      if (!session) return false;
      this.address = session.address;
      this.el.connect.classList.add('hide');
      this.el.disconnect.classList.remove('hide');
      this.notice('chainNotice', 'good', `Connected as ${session.address}`);
      (this.el.profileWho as HTMLInputElement).value = session.address;
      this.drawGame();
      return true;
    });
  }

  private async disconnect(): Promise<void> {
    await this.options.disconnect?.();
    this.address = null;
    this.el.connect.classList.remove('hide');
    this.el.disconnect.classList.add('hide');
    this.notice('chainNotice', 'info', 'Disconnected.');
    this.drawGame();
  }

  get connectedAddress(): string | null {
    return this.address;
  }

  // ------------------------------------------------------------------
  // Explore, leaderboard, profile
  // ------------------------------------------------------------------

  /**
   * Read the whole game again and say what it derived.
   *
   * It used to call reload() and nothing else. The board redrew to exactly what
   * it already showed, which is the correct outcome and looks identical to a
   * button that does not work - and this is the one control whose entire job is
   * to be convincing. A verification that reports nothing has, from the other
   * side of the screen, verified nothing.
   */
  private async reverify(): Promise<void> {
    if (this.gameId === null) return;
    const game = this.gameId;
    const before = this.state;

    await this.guard(`re-deriving game ${game}`, async () => {
      const entries = await this.chain.getAllEntries(game);
      const row = await this.chain.getGame(game);
      if (!row) return false;
      this.game = row;
      this.entries = entries;
      this.lastReadAt = Date.now();
      this.adoptRules();
      this.derive();
      this.drawGame();

      const now = this.state;
      if (!now) return false;

      const agreed =
        before === null ||
        (before.fen === now.fen &&
          before.result === now.result &&
          before.accepted.length === now.accepted.length);

      this.notice(
        'chainNotice',
        agreed ? 'good' : 'warn',
        agreed
          ? `Re-derived game ${game} from ${entries.length} submission` +
            `${entries.length === 1 ? '' : 's'} read fresh from the chain, and got the same ` +
            `answer.\n\n${now.accepted.length} counted, ${now.rejected.length} skipped. ` +
            `${now.status === 'over' ? `Result ${now.result} by ${now.termination}.` : `${now.turn} to move.`}` +
            `\n\nPosition ${now.fen}\n\nNothing here was stored. Every board that reads this ` +
            'log reaches the same position by doing the same work.'
          : `Re-deriving game ${game} produced a DIFFERENT answer from what was on screen. ` +
            'That should be impossible from the same log, so either the log grew while you were ' +
            'looking or this board has a bug worth reporting.'
      );
      return true;
    });
  }

  /**
   * The game list, and what somebody scanning it wants to know.
   *
   * It used to say who OPENED each game, how many entries it had, and whether
   * it was ranked. None of those is the question. The questions are who is
   * playing, under what rules, and whether it is still a game - and the opener
   * is often neither player, so the one name shown was frequently nobody's.
   *
   * Every row is replayed, which costs one read each. That is why it happens
   * when somebody asks for the list and never on a poll: the same spend on a
   * timer is what starved the wallet and stopped a move being broadcast.
   */
  private async loadExplore(): Promise<void> {
    await this.guard('reading the game list', async () => {
      const count = await this.chain.getGameCount();
      this.text('exploreCount', `${count} game${count === 1 ? '' : 's'} on this contract`);
      this.notice('chainNotice', 'info', `Reading ${this.chain.contractId}.`);

      // Newest first, and bounded: an unbounded walk on a busy contract would
      // make the first paint arbitrarily slow.
      const first = Math.max(1, count - 24);
      const found: ExploreRow[] = [];

      for (let id = count; id >= first; id--) {
        const game = await this.chain.getGame(id);
        if (!game) continue;

        const row: ExploreRow = {
          id: game.id,
          ranked: game.ranked,
          entries: game.nextSeq,
          white: null,
          black: null,
          confirmed: false,
          state: game.nextSeq === 0 ? 'not started' : 'live'
        };

        if (game.nextSeq > 0) {
          try {
            const entries = await this.chain.getAllEntries(id);
            const rules = recoverRules({
              rulesHash: game.rulesHash,
              openedBy: game.openedBy,
              ranked: game.ranked,
              senders: entries.map((e) => e.sender),
              viewer: this.address,
              candidates: [knownRules(game.rulesHash)].filter((r): r is Rules => r !== null)
            });
            const state = replay(
              entries.map((e) => ({ mv: e.value, sender: e.sender, seq: e.seq, height: e.height })),
              { rules: rules.rules }
            );
            row.white = rules.rules.white;
            row.black = rules.rules.black;
            row.confirmed = rules.confirmed;
            row.state =
              state.status === 'over'
                ? `${state.result} ${state.termination}`
                : `${state.turn} to move`;
          } catch {
            // A row that will not replay is still a row. Saying less about it
            // beats dropping the game out of the list.
          }
        }
        found.push(row);
      }

      this.exploreRows = found;
      this.drawExplore();

      // Names for everyone on the list, in one go, then draw again if it
      // learned anything. No further chain reads.
      const players = found.flatMap((r) => [r.white, r.black]).filter((p): p is string => !!p);
      if (await (this.names?.resolveAll(players) ?? Promise.resolve(false))) this.drawExplore();
      return true;
    });
  }

  private drawExplore(): void {
    const rows = this.el.exploreRows;
    rows.replaceChildren();

    for (const row of this.exploreRows) {
      const tr = this.doc.createElement('tr');
      const cell = (node: Node): void => {
        const td = this.doc.createElement('td');
        td.appendChild(node);
        tr.appendChild(td);
      };
      const text = (value: string, className = ''): HTMLElement => {
        const span = this.doc.createElement('span');
        if (className) span.className = className;
        span.textContent = value;
        return span;
      };

      cell(text(String(row.id)));

      // Who is PLAYING, which is not who opened it: on a sponsored or
      // third-party game the opener is often neither player.
      const players = this.doc.createElement('span');
      if (row.white && row.black) {
        players.appendChild(this.addressNode(row.white));
        players.appendChild(text(' v ', 'muted'));
        players.appendChild(this.addressNode(row.black));
      } else {
        players.appendChild(text(row.entries === 0 ? 'not yet known' : 'anyone', 'muted'));
      }
      cell(players);

      // Ranked is the rule that changes what a game is FOR. Unconfirmed is
      // worth saying too: it means no board can referee it yet.
      const rules = this.doc.createElement('span');
      rules.appendChild(text(row.ranked ? 'ranked' : 'casual'));
      if (row.entries > 0 && !row.confirmed) {
        rules.appendChild(text(' \u00b7 rules unconfirmed', 'muted'));
      }
      cell(rules);

      cell(text(String(row.entries)));
      cell(text(row.state));

      const open = this.doc.createElement('button');
      open.className = 'action';
      open.textContent = 'Open';
      open.addEventListener('click', () => {
        this.show('game');
        void this.load(row.id);
      });
      cell(open);

      rows.appendChild(tr);
    }
  }

  async loadLeaderboard(): Promise<void> {
    await this.guard('computing ratings', async () => {
      const count = await this.chain.getRankedCount();
      const rated: RatedGame[] = [];
      let skipped = 0;

      for (let index = 0; index < count; index++) {
        const id = await this.chain.getRankedGame(index);
        if (id === null) continue;
        const row = await this.chain.getGame(id);
        if (!row) continue;

        const entries = await this.chain.getAllEntries(id);
        const state = replay(
          entries.map((e) => ({ mv: e.value, sender: e.sender, seq: e.seq, height: e.height })),
          { rules: this.rulesForRanked(row, entries) }
        );
        const check = checkEligibility(row, state.rules, state);
        if (!check.eligible || state.result === null) {
          skipped++;
          continue;
        }
        const terminal = state.accepted.find((e) => e.seq === state.terminalSequence);
        rated.push({
          game: id,
          white: check.white!,
          black: check.black!,
          result: state.result,
          terminalHeight: terminal?.height ?? row.openedAt
        });
      }

      const table = computeRatings(rated);
      const rows = leaderboard(table);

      this.notice(
        'leaderboardNote',
        'info',
        `Derived from ${rated.length} verified ranked game${rated.length === 1 ? '' : 's'}` +
          (skipped ? `, with ${skipped} candidate${skipped === 1 ? '' : 's'} failing verification.` : '.') +
          ' Nothing here is stored; it is recomputed from the chain each time.'
      );

      const body = this.el.leaderboardRows;
      body.replaceChildren();
      for (const row of rows) {
        const tr = this.doc.createElement('tr');
        const cells: [string, boolean][] = [
          [String(row.rank), false],
          [row.principal, false],
          [`${row.rating}${row.provisional ? '?' : ''}`, true],
          [String(row.games), true],
          [String(row.wins), true],
          [String(row.draws), true],
          [String(row.losses), true]
        ];
        for (const [value, numeric] of cells) {
          const td = this.doc.createElement('td');
          if (value === row.principal) td.appendChild(this.addressNode(row.principal));
          else td.textContent = value;
          if (numeric) td.className = 'num';
          tr.appendChild(td);
        }
        body.appendChild(tr);
      }
      return true;
    });
  }

  /**
   * The rules a ranked candidate is checked against.
   *
   * Ranked Standard v1 fixes every field, so the rule set is fully determined by
   * the two players. Recovering them from the commitment is a search over the
   * two principals, which the game row does not carry - so this reads them from
   * whatever the log's participants are and lets the hash confirm or refuse.
   */
  /**
   * The rules a ranked game actually committed to.
   *
   * It used to ignore the game and return an open board with `ranked: true`.
   * That can never hash to the commitment of a game naming two players, so
   * `checkEligibility` refused every real ranked game and the leaderboard read
   * "0 verified ranked games, with 2 candidates failing verification" - about
   * two finished games that were perfectly eligible.
   *
   * It is the same recovery the board does, so a game that is refereed on
   * screen is a game that can be rated. Anything still unrecoverable falls back
   * to the open board and is refused by eligibility, which is correct: a rating
   * must never rest on rules nobody can check.
   */
  private rulesForRanked(row: GameRow, entries: readonly EntryRow[]): Rules {
    const found = recoverRules({
      rulesHash: row.rulesHash,
      openedBy: row.openedBy,
      ranked: row.ranked,
      senders: entries.map((e) => e.sender),
      viewer: this.address,
      candidates: [knownRules(row.rulesHash)].filter((r): r is Rules => r !== null)
    });
    return found.confirmed ? found.rules : { ...DEFAULT_RULES, ranked: true };
  }

  private async loadProfile(): Promise<void> {
    const who = (this.el.profileWho as HTMLInputElement).value.trim().toUpperCase();
    const body = this.el.profileBody;
    body.replaceChildren();
    if (!who) return;

    const line = (label: string, value: string): void => {
      const row = this.doc.createElement('div');
      row.className = 'row';
      const key = this.doc.createElement('strong');
      key.textContent = label;
      const val = this.doc.createElement('span');
      val.textContent = value;
      row.append(key, val);
      body.appendChild(row);
    };

    line('Address', who);
    line('Note', 'Ratings are recomputed from the chain. Open the leaderboard to derive them.');
  }
}

export { SHELL };
