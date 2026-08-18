// The application.
//
// Everything on screen is DERIVED. The board comes from replaying the log, the
// result comes from replay, the ratings come from replaying every eligible game.
// Nothing is stored and nothing is trusted, which is why none of it needs to be.

import { renderBoard, destinationsFrom, promotionChoices, pieceGlyph, pieceName } from './board.js';
import type { PendingMove } from './board.js';
import { buildPlayer, displayName, nameSourceNote, parsePlayer } from '../protocol/player.js';
import { Names } from '../chain/bns.js';
import { PlayerNames } from '../chain/players.js';
import { YourGames } from '../chain/yours.js';
import { XtrataReader } from '../chain/xtrata.js';
import { ManifestDirectory } from '../chain/directory.js';
import type { Found } from '../chain/directory.js';
import { loadTournament, resultLabel, scoreTournament, verdictLabel } from './tournaments.js';
import { parseTournament, stageOf } from '../protocol/tournament.js';
import { checkpointNote, parseCheckpoint, usable } from '../protocol/checkpoint.js';
import type { Checkpoint } from '../protocol/checkpoint.js';
import type { CheckedGame } from '../protocol/tournament.js';
import type { Tournament } from '../protocol/tournament.js';
import type { TournamentView } from './tournaments.js';
import { pool } from '../chain/pool.js';
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
  checkSender,
  looksLikePrincipal,
  normaliseRules,
  readyToOpen
} from '../protocol/rules.js';
import type { Rules } from '../protocol/rules.js';
import { rulesHash } from '../protocol/canonical.js';
import { recoverRules } from '../protocol/recover.js';
import { knownRules, linkForGame, rememberRules, rulesFromLink } from '../protocol/known-rules.js';
import { checkEligibility, describeIneligibility } from '../ratings/eligibility.js';
import { judge, judgeEvent, judgeMove } from './eligibility.js';
import type { Ctx, Verdict } from './eligibility.js';
import { computeRatings, leaderboard } from '../ratings/elo-v1.js';
import type { RatedGame } from '../ratings/elo-v1.js';
import { describeContractError } from '../chain/client.js';
import { describeOutcome, realTxid, watchTx } from '../chain/tx-status.js';
import type { Endpoint } from '../chain/endpoint.js';
import type {
  Chain,
  ChainReader,
  EntryRow,
  GameRow,
  PendingRow,
  SponsorshipRow
} from '../chain/client.js';

export type Tab =
  | 'play'
  | 'game'
  | 'explore'
  | 'leaderboard'
  | 'tournaments'
  | 'profile'
  | 'help';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * A principal that is nobody, for asking "would this game admit a stranger?".
 *
 * Never displayed and never signed with. The burn address is used precisely
 * because no player can hold it.
 */
const STRANGER = 'SP000000000000000000002Q6VF78';

/** A row of the game list, after it has been read and replayed. */
interface ExploreRow {
  id: number;
  ranked: boolean;
  entries: number;
  white: string | null;
  black: string | null;
  confirmed: boolean;
  state: string;
  /**
   * Whether the connected player can act here, and whether it is their turn.
   *
   * Computed from `checkSender` - the same pure function that decides who may
   * move - so there is one rule and not a second copy of it. Null when nobody
   * is connected, or when the rules could not be confirmed: a board that said
   * "your move" under rules nobody agreed to would be asserting a turn it has
   * no standing to assert.
   */
  mine: 'your-move' | 'waiting' | null;
  /** An unclaimed seat a stranger could walk into. */
  seat: 'open' | null;
  /**
   * Whether the connected player is IN this game. Identity, not turn.
   *
   * A separate question from `mine`, and it has to be: `mine` is about whether
   * you can act right now, so it is null while it is the other player's move and
   * null once the game is over. Filtering "Yours" on it therefore hid every game
   * you were waiting in and every game you had finished — which is most of
   * somebody's games, most of the time.
   *
   * Named by the rules, or having actually submitted: the second is what makes
   * an open-board seat yours once you have taken it. Not merely "the rules would
   * admit you", or every viewer would own every open game.
   */
  participant: boolean;
  /**
   * Whether somebody is paying for moves in this game.
   *
   * THREE STATES, and the third is the honest one. `get-sponsorship` takes
   * `(game uint, who principal)` — it answers about one player you can already
   * name. There is no function that lists a game's sponsorships and no event
   * index to walk, so a game whose sides are "anyone" or "anyone-else" has
   * nobody to ask about and cannot be answered at all. That is `null`, and it
   * means UNKNOWN rather than no.
   *
   * Also null until asked: this costs a chain read per named player, so it is
   * never spent on building the list. See `loadSponsorships`.
   */
  sponsored: boolean | null;
  /**
   * Whether replay reached a result.
   *
   * A field rather than a reading of `state`, which is display text: a filter
   * that parsed a sentence would break the first time the sentence was reworded,
   * and would be wrong in the meantime rather than loudly broken.
   */
  over: boolean;
  /**
   * The result and how it was reached, as fields.
   *
   * Held apart from `state` for the reason that field already gives: `state` is
   * DISPLAY TEXT, and anything that parsed a sentence would break the first time
   * the sentence was reworded and be wrong in the meantime rather than loudly
   * broken. A finished game deserves to say who won, in the names the reader
   * knows, and that cannot be recovered from "1-0 checkmate".
   */
  result: string | null;
  termination: string | null;
  /**
   * The block the last accepted submission landed in, and how long ago that is.
   *
   * THE ONLY HONEST ANSWER TO "HAS THIS GAME BEEN ABANDONED", which is a
   * question the contract cannot answer at all. There is no resignation by
   * absence and no timeout: a game whose player walked away a year ago is,
   * on chain, live and waiting. So the board reports the fact it has - nothing
   * has happened for this long - and lets the reader draw the conclusion.
   *
   * Null on a game with no submissions, or when the chain height could not be
   * read; both mean "cannot say", which is different from "recent".
   */
  quietFor: number | null;
}

/**
 * The ways somebody scans a game list, and what each one is actually asking.
 *
 * Every one of these reads a field the row ALREADY carries, so filtering costs
 * no chain reads at all - there is an assertion in tests/e2e/request-budget
 * that says so. That is the whole reason this is cheap: proposal 14 computed
 * these answers and threw them away, and this only stops throwing them away.
 */
export type ExploreFilter =
  | 'all'
  | 'your-move'
  | 'mine'
  | 'open'
  | 'live'
  | 'over'
  | 'ranked'
  | 'sponsored';

/** Which rows a filter admits. Pure, and tested directly. */
export function matchesFilter(row: ExploreRow, filter: ExploreFilter): boolean {
  switch (filter) {
    case 'your-move':
      return row.mine === 'your-move';
    case 'mine':
      return row.participant;
    case 'sponsored':
      // Strictly true. A row that could not be asked is unknown, and showing it
      // here would be the list asserting something it does not know.
      return row.sponsored === true;
    case 'open':
      return row.seat === 'open';
    case 'live':
      return !row.over;
    case 'over':
      return row.over;
    case 'ranked':
      return row.ranked;
    default:
      return true;
  }
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
 * How much of a game the LIST will read before summarising it.
 *
 * A game's length is chosen by whoever submits to it, and the contract filters
 * on length alone - so an unbounded read here means one hostile game costs
 * twenty round trips for a single row, in a list of twenty-five. Four pages is
 * longer than any game played on this contract so far.
 *
 * Past it the list reads one page, which is enough to recover the rules and
 * name the players, and then says how many submissions there are rather than
 * claiming a position it has not seen all of.
 */
const EXPLORE_ENTRY_LIMIT = 200;

/**
 * How many games the list shows, newest first.
 *
 * A real bound, and one a player meets: their own game falls off it the moment
 * twenty-five newer ones exist. That is why search does a direct lookup rather
 * than filtering what is on screen - and why the count line says the window is
 * there rather than letting it look like the whole contract.
 */
/**
 * The last block for which this board honours a manifest written after the fact.
 *
 * THIS BOARD'S POLICY, not a rule of the format. A manifest compiled after its
 * games is the only way to describe a tournament played before manifests
 * existed — games 13 to 30 among them — and refusing those would make eighteen
 * real games permanently unreadable. Accepting them forever would be worse: an
 * organiser could skip the manifest, play, and write one afterwards, which is
 * the whole thing the rule prevents.
 *
 * So the fallback has an end date. 8,787,816 is the chain tip on the day the
 * rule was written: everything already played is covered, and nothing opened
 * from that block on can be described retrospectively. "It can never happen
 * again" becomes a property of this reader rather than a promise about anyone.
 *
 * Another board is entitled to choose a different number, which is exactly why
 * this is here and not in `packages/protocol/tournament.ts`.
 *
 * Exported because the Tournaments view is not built yet and this is the number
 * it will hand to `honours()`. A policy with no consumer is still a policy, and
 * a test asserts it rather than letting it drift unnoticed until the tab lands.
 */
export const COMPILED_ACCEPTED_BEFORE = 8_787_816;

/** What the tab shows when nobody has typed anything. The exhibition. */
const DEFAULT_TOURNAMENT = 2993;

/**
 * The wallet the board looks in for tournaments.
 *
 * A DIRECTORY, NOT AN AUTHORITY. Everything found here is still checked pairing
 * by pairing against the chain, so this only decides what is worth READING —
 * and being wrong about that costs a few reads and never a wrong standing.
 *
 * It is one address because the alternative is a scan: Xtrata has no way to ask
 * what depends on a token, so a chain of manifests can be followed backward from
 * one you have and never forward to one inscribed after this board was. An
 * address is the only thing that points forward, which is why manifests are sent
 * here.
 */
const TOURNAMENT_DIRECTORY = 'SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S';

/**
 * The one wallet whose rating checkpoints this board will continue from.
 *
 * A DIFFERENT AND STRICTER RULE THAN THE OTHERS, because the stakes are not the
 * same. A tournament manifest is checked pairing by pairing against the chain
 * and a manual is prose, so both can be found in a wallet, labelled by who
 * minted them, and left to the reader. A checkpoint seeds the entire rating
 * table from a claim nobody replayed — so being able to say who wrote it is not
 * enough; it has to be the only person who could have.
 *
 * Which is why this is xtrata.btc rather than the tournament directory: the
 * authority for a board is the authority for what a board takes on trust, and
 * it stays that way until a contract or a later board can do better.
 */
const CHECKPOINT_AUTHORITY = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

/**
 * What a move on this contract actually costs to get mined, in microSTX.
 *
 * MEASURED, NOT ESTIMATED. It is the bottom rung of the tournament runner's fee
 * ladder, and every `submit` that has confirmed on this contract has paid it —
 * forty-one of forty-one in the most recent sample, across roughly a thousand
 * moves in total. The runner climbs when nothing takes the cheap offer, and the
 * climbs are recorded: 98% of moves never leave this rung.
 *
 * Shown rather than sent, because `stx_callContract` has no fee parameter. A
 * board can tell somebody the price and cannot name it.
 */
const MOVE_FEE_USTX = 400;
const MOVE_FEE_STX = (MOVE_FEE_USTX / 1_000_000).toFixed(4);

const EXPLORE_WINDOW = 25;

/**
 * How many entrants may be paired against each other during rules recovery.
 *
 * Quadratic: twelve entrants is 132 ordered pairs, and `recoverRules` caps
 * candidates at 512 before its own search begins. Past this the offer is
 * dropped entirely rather than truncated, because a truncated pair list makes
 * recovery depend on map iteration order — two boards would disagree about
 * whether a game can be confirmed, which is the one property this must not have.
 */
const MAX_PAIRED_ENTRANTS = 12;

/**
 * Above this many tournaments, the picker becomes a list rather than buttons.
 *
 * Six is roughly what fits on one line at a readable size, and buttons past that
 * wrap into a block of similar chips nobody can scan. Chosen from the layout
 * rather than from taste: below it, buttons are one click and everything is
 * visible at once; above it, that stops being true and a list is plainly better.
 */
const MANY_TOURNAMENTS = 6;

/** How many tournaments the picker offers before you ask for the rest. */
const RECENT_TOURNAMENTS = 10;

/**
 * What a tournament is doing, as far as this board has been told.
 *
 * `unknown` is a first-class answer and the most common one. A manifest says
 * which games belong to a tournament and NOTHING about whether they have been
 * played, so state costs a read per game and a replay - twenty-one for
 * Exhibition One alone. Reading that for every tournament in a wallet, to draw a
 * row of buttons, would be hundreds of requests before the reader has asked for
 * anything.
 *
 * So it is learned when a tournament is opened and remembered, and `finished` is
 * remembered FOREVER: every game has a result, results do not change, and a
 * finished tournament is a static document.
 */
type TournamentState = 'planned' | 'running' | 'finished' | 'unknown';
type PickerFilter = 'all' | 'finished' | 'running' | 'planned' | 'unknown';

const STATE_KEY = 'xchess:tstate:';

/**
 * Where an inscription can be read.
 *
 * ABSOLUTE, and the earlier reasoning for a relative `/i/<id>` was wrong. The
 * argument was endpoint.ts's: a host named inside a permanent artefact becomes a
 * dependency that outlives it. That holds for the API this board CANNOT WORK
 * without, and not for a link a person clicks — if this host disappears the
 * board still reads the chain and plays games, and only the link 404s.
 *
 * What relative actually bought was a link that resolves under one gateway and
 * nowhere else: not when the file is opened directly, not on a dev server, not
 * from any other viewer. Tested, and it does not work.
 *
 * So it is spelled out. One constant, so a different canonical viewer is one
 * edit rather than five.
 */
const INSCRIPTION_VIEWER = 'https://xtrata.xyz/i/';

/**
 * The manual, laid out as a page.
 *
 * Named here rather than discovered, because it is one document and this is a
 * link rather than a lookup. A newer manual is found the usual way — by the
 * wallet — and rendered below; this is the designed version of the same text.
 *
 * 3007, and the three before it are why the board LOOKS this one up rather than
 * trusting the number. 3004's in-page links were all broken by the runtime's
 * injected base tag; 3005 fixed those and had a glossary where every wrapped
 * line escaped its column; 3006 was correct but predates the rating checkpoint,
 * so it documents a format this board reads and it does not describe. None can
 * be repaired. They stay on chain and are superseded, which is the only
 * correction an inscription has — and four of them in a row is the argument for
 * the directory, not against it.
 *
 * This constant is the fallback for a board that cannot reach the directory.
 * The directory is what makes the next correction free.
 */
const MANUAL_PAGE = 3007;

/**
 * What a reader can narrow a tournament's games down to.
 *
 * Every one is a property already computed when the tournament was scored, so
 * filtering costs nothing and can never disagree with the rows it hides — which
 * is the failure a filter that re-derived anything would have.
 */
type TournamentFilter = 'all' | 'your-move' | 'live' | 'finished' | 'unverified';

/**
 * The reasons that mean "we cannot say who played this", as opposed to "this
 * game does not qualify".
 *
 * The difference matters to a reader. A game nobody can identify will never
 * become ratable, because the evidence that would settle it was never put on
 * chain — the absent player simply never submitted. A game that is merely
 * ineligible failed a rule, and the rule can be read.
 */
const IDENTITY_REASONS = new Set<string>([
  'no-rules-commitment',
  'rules-do-not-match-commitment',
  'side-not-a-principal'
]);

/**
 * How many games the list reads at once.
 *
 * Three, the same width the name and block-time resolvers use, and chosen for
 * the same reason rather than for throughput: the public rate limit is per
 * address and the wallet spends from the same allowance for its nonce, its fee
 * estimate and the broadcast. A board that empties the bucket loading a list is
 * a board whose player then cannot move.
 */
const EXPLORE_READ_WIDTH = 3;

/**
 * How many ranked games the leaderboard reads at once.
 *
 * The same three, and deliberately not more. This walk is the only one in the
 * board with no window on it, so it is the one place where being greedy scales
 * with the contract rather than with a page.
 */
const LEADERBOARD_READ_WIDTH = 3;

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
 * How often to re-read your games that are not on screen.
 *
 * The open game is refreshed by the poll and costs nothing extra; these are
 * whole games, so they are read on their own clock rather than the poll's. A
 * minute is well inside what anybody notices about a move that took a block to
 * confirm, and it is bounded by `live()` — usually one or two games, never a
 * history.
 */
const WAITING_RECHECK_MS = 60_000;

/**
 * How often to ask whether a tournament in progress has moved.
 *
 * A move takes a block to confirm and a tournament game takes minutes between
 * them, so this is well inside what anybody notices. It costs one read per
 * UNFINISHED game and nothing whatever once they all have results.
 */
const TOURNAMENT_POLL_MS = 30_000;

/**
 * How long a pending move may be shown on memory alone.
 *
 * Chosen against the block time rather than the poll interval: post-Nakamoto a
 * block is roughly twelve seconds, so ninety is several chances for anything
 * real to have landed. A submission still showing as pending after that is one
 * the board has not been able to see for a long time, and continuing to draw it
 * would be an assertion nothing supports.
 */
const PENDING_HOLD_MS = 90_000;

/**
 * Blocks of silence before a live game is worth remarking on.
 *
 * Post-Nakamoto a Stacks block is roughly twelve and a half seconds, so this is
 * about six hours. Correspondence chess is legitimately slow - somebody thinking
 * overnight is playing, not gone - and a threshold that flagged that would be
 * noise. Six hours is long enough that a game which SHOULD be moving is not.
 *
 * The number this is measured against is deliberately not a clock: block heights
 * are on chain and a wall clock is not.
 */
const QUIET_BLOCKS = 1_800;

/** Roughly how long a run of Stacks blocks took, for a reader rather than a machine. */
function describeBlocks(blocks: number): string {
  const minutes = (blocks * 12.5) / 60;
  if (minutes < 90) return `${Math.round(minutes)} min`;
  const hours = minutes / 60;
  if (hours < 36) return `${Math.round(hours)} hr`;
  return `${Math.round(hours / 24)} days`;
}

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
  /** The clock, so staleness can be tested without waiting for it. */
  now?: () => number;
}

/** Ids the shell defines. Every one must exist, or wiring throws. */
const IDS = [
  'build-tag', 'chain-notice', 'sign-notice',
  'tab-play', 'tab-game', 'tab-explore', 'tab-leaderboard', 'tab-tournaments', 'tab-profile',
  'view-play', 'view-game', 'view-explore', 'view-leaderboard', 'view-tournaments', 'view-profile',
  'connect', 'disconnect', 'whoami', 'whoami-name', 'whoami-addr',
  'game-kind', 'rules-white', 'rules-black', 'rules-ranked',
  'rules-white-who', 'rules-black-who',
  'rules-summary', 'price-summary', 'rules-problems', 'open-game',
  'join-game', 'load-game',
  'game-label', 'copy-link', 'flip', 'refresh', 'board', 'arrows', 'status', 'move-hint', 'promotion',
  'send-anyway', 'send-anyway-why', 'send-anyway-yes', 'send-anyway-no',
  'game-rules-state', 'game-rules-summary', 'game-rules-hash',
  'claim-rules', 'claim-white', 'claim-black', 'claim-check',
  'players', 'sponsorship', 'sponsorship-panel', 'top-up',
  'resign', 'offer-draw', 'accept-draw', 'moves',
  'moves-title', 'toggle-skipped', 'skipped-note',
  'verify', 'verify-game',
  'sound-toggle', 'sound-master', 'sound-volume', 'sound-background',
  'sound-reset', 'sound-note', 'sound-list', 'sound-more', 'sound-detail', 'sound-sides',
  'explore-refresh', 'explore-count', 'explore-rows', 'explore-filters', 'explore-waiting',
  'fee-advice', 'tournament-list', 'tournament-refresh', 'tournament-fresh',
  'tournament-filters', 'tournament-who', 'tournament-shown',
  'picker-filters', 'picker-who', 'picker-shown', 'tournament-field',
  'tab-help', 'view-help', 'help-body', 'help-note',
  'explore-search', 'explore-find', 'explore-found',
  'leaderboard-note', 'leaderboard-rows', 'leaderboard-verify',
  'tournament-id', 'tournament-load', 'tournament-note', 'tournament-provenance', 'tournament-body',
  'profile-who', 'profile-load', 'profile-body',
  'claim-name-why', 'claim-name', 'claim-about',
  'claim-build', 'claim-problems', 'claim-manifest',
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
  /** The game count the explorer was last built for, or null if never. */
  private exploreLoadedAt: number | null = null;
  /** Which rows the list is showing. Presentation only; it reads no chain. */
  private exploreFilter: ExploreFilter = 'all';
  /** How many games the contract reported when the list was last built. */
  private exploreTotal = 0;
  /**
   * A game found by number that the window does not contain.
   *
   * Kept beside the list rather than pushed into it, so that clearing the
   * search restores exactly what was there before - and so a row fetched by
   * searching is never mistaken for one the window actually holds.
   */
  private exploreFound: ExploreRow | null = null;
  /** When the list was last built, for the staleness check in show(). */
  private exploreBuiltAt = 0;

  /**
   * How long a game list stays worth showing without rebuilding.
   *
   * Half a minute. Long enough that moving between tabs is free, short enough
   * that "open Explore to see where you owe a move" is a true sentence rather
   * than a hopeful one. It is the whole of what this board can offer WITHOUT a
   * background watcher: it cannot come and find you, but it can be right when
   * you look.
   */
  private static readonly EXPLORE_STALE_MS = 30_000;

  /**
   * How many games the Sponsored filter will ask about.
   *
   * Two reads each at most, so twenty-five games is fifty reads — spent once, by
   * somebody who pressed the button, against a window of twenty-five. It is the
   * whole window rather than a smaller slice because a filter that silently
   * covered half the list would be worse than one that covered none.
   */
  private static readonly SPONSOR_LOOKUP_LIMIT = 25;

  /** Sponsorship by `game|address`, so a filter is asked once and not per draw. */
  private readonly sponsorSeen = new Map<string, boolean>();

  /** Whether the chain has been asked yet, which is not the same as "none found". */
  private sponsorLookedUp = false;

  private now(): number {
    return (this.options.now ?? Date.now)();
  }

  private exploreIsStale(): boolean {
    if (this.exploreLoadedAt === null) return true;
    return this.now() - this.exploreBuiltAt >= ChessApp.EXPLORE_STALE_MS;
  }
  /** True while a broadcast move is being followed to its conclusion. */
  private watching = false;
  private flipped = false;
  private busy = false;
  private pending: PendingRow[] = [];
  /** When the mempool was last read SUCCESSFULLY, which is not every poll. */
  private pendingReadAt = 0;
  /** Alternates, so a quiet board reads the mempool every other poll. */
  private mempoolTurn = false;
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
  /**
   * A move waiting on "send it anyway", AND THE GAME IT WAS ARMED FOR.
   *
   * The game id is not decoration. Held as a bare string, this survived a switch
   * to another game and then submitted into it: warned on game 2, opened game 1,
   * pressed the button, and a black pawn went to g5 in the wrong game - stored,
   * charged, and permanent. Reported from a real board on 2026-08-14.
   */
  private pendingForced: { game: number; value: string } | null = null;
  private exploreRows: ExploreRow[] = [];
  /** Chain tip as of the last list build. Null when it could not be read. */
  private chainHeight: number | null = null;
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
  private tournament: TournamentView | null = null;
  private xtrata: XtrataReader | null = null;
  private players: PlayerNames | null = null;
  private yours: YourGames | null = null;
  private index: ManifestDirectory<Tournament> | null = null;
  /** When the tournament on screen was last read from chain. */
  private tournamentReadAt = 0;
  /** The same question asked of submissions, which is what a row can answer. */
  private tournamentSeenRaw = '';
  private tournamentPoll: ReturnType<typeof setTimeout> | null = null;
  private found: Found<Tournament>[] = [];
  private tournamentFilter: TournamentFilter = 'all';
  /** An address or entrant name to narrow by, from the box beside the filters. */
  private tournamentWho = '';
  private pickerFilter: PickerFilter = 'all';
  /** An entrant to narrow the PICKER by, which costs no reads at all. */
  private pickerWho = '';
  private showAllTournaments = false;
  /**
   * The tournament being read right now, if any.
   *
   * Kept apart from `tournament`, which is what is ON SCREEN. Between clicking
   * and seeing there is half a minute where those are different things, and the
   * button has to follow the click rather than the arrival.
   */
  private tournamentLoading: number | null = null;
  private docs: ManifestDirectory<{ title: string }> | null = null;
  private docsFound: Found<{ title: string }>[] = [];
  private docsAsked = false;
  private checkpoints: ManifestDirectory<Checkpoint> | null = null;
  /** The checkpoint being continued from, and what it is. */
  private checkpoint: { id: number; official: boolean; it: Checkpoint } | null = null;
  private checkpointAsked = false;
  /** Set by Verify, which does the walk a checkpoint lets a reader skip. */
  private verifyEverything = false;
  /**
   * Ids known to be this player's that the window cannot show.
   *
   * Kept apart from `exploreRows` because they are found differently and can
   * outlive a redraw of the list.
   */
  private yoursOutside: number[] = [];
  /** False once discovery hit its page cap, so the set may be short. */
  private yoursComplete = true;
  /**
   * Game ids this board has DERIVED are waiting on the connected player.
   *
   * Kept apart from `exploreRows` so the tab count does not depend on the tab
   * having been opened. Both the background check and the full list write here;
   * `drawWaiting` reads only this.
   */
  private readonly waitingOn = new Set<number>();
  private warmedFor: string | null = null;
  private waitingCheckedAt = 0;
  /** game id -> the manifest that names it. Built from tournaments loaded. */
  private readonly inTournament = new Map<
    number,
    { id: number; name: string; stage?: string | null }
  >();
  /** address -> the name a loaded tournament gave it. The weakest source. */
  private readonly entrantNames = new Map<string, string>();
  /** game id -> the two addresses a loaded manifest says played it. */
  private readonly manifestPairings =
    new Map<number, { white: string; black: string; cooldown: number }>();

  /**
   * Every cooldown any manifest this board has read declares.
   *
   * Candidates are guesses judged by the committed hash, so an extra one costs
   * a hash and confirms nothing false. What it buys is the games of a
   * tournament that had to vary its rules to exist at all — see
   * Tournament.cooldown — which are otherwise unrecoverable from this tab while
   * the Tournaments tab verifies them perfectly well. That split, the same
   * games given two verdicts by two tabs, is the exact bug rememberPairings
   * was written to end.
   */
  private readonly knownCooldowns = new Set<number>([0]);
  /** Every address any loaded manifest has named as an entrant. */
  private readonly knownEntrants = new Set<string>();
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
      // Built here for the same reason as those two: this is the only place the
      // endpoint is in scope, and an inscription reader has nothing to set up.
      this.xtrata = new XtrataReader({
        endpoint: endpoint as never,
        network: (options.build?.network as 'mainnet' | 'testnet') ?? 'mainnet'
      });
      this.players = new PlayerNames({ endpoint: endpoint as never, reader: this.xtrata });
      this.yours = new YourGames({ endpoint: endpoint as never, contractId: this.chain.contractId });
      // One of possibly several directories: a wallet plus what to look for.
      // A profiles directory is the same call with a different address and
      // `parsePlayer`. See packages/chain/directory.ts.
      // The manual, found the same way tournaments are, so a correction is a
      // new inscription rather than a new board.
      this.docs = new ManifestDirectory<{ title: string }>({
        endpoint: endpoint as never,
        reader: this.xtrata,
        address: TOURNAMENT_DIRECTORY,
        kind: 'manual-page',
        // RECOGNISED BY WHAT IT IS, so the newest one wins without this board
        // being rebuilt. The alternative — naming an inscription number here —
        // would freeze the manual at whatever was true the day this went on
        // chain, which is the one thing keeping it separate was meant to avoid.
        parse: (text) => {
          if (!/^\s*<!doctype html/i.test(text)) return null;
          const title = /<title[^>]*>([^<]*X Chess manual[^<]*)<\/title>/i.exec(text);
          return title ? { title: title[1].trim() } : null;
        }
      });
      // Published rating walks, found the same way everything else is.
      this.checkpoints = new ManifestDirectory<Checkpoint>({
        endpoint: endpoint as never,
        reader: this.xtrata,
        address: CHECKPOINT_AUTHORITY,
        kind: 'ratings',
        parse: (text) => {
          const parsed = parseCheckpoint(text);
          return parsed.ok ? parsed.checkpoint : null;
        }
      });
      this.index = new ManifestDirectory<Tournament>({
        endpoint: endpoint as never,
        reader: this.xtrata,
        address: TOURNAMENT_DIRECTORY,
        kind: 'tournament',
        parse: (text) => {
          const parsed = parseTournament(text);
          return parsed.ok ? parsed.tournament : null;
        }
      });
    }
    this.wire();
    // After wire(), which is what puts the element in `this.el`.
    this.drawFeeAdvice();
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

    for (const tab of [
      'play', 'game', 'explore', 'leaderboard', 'tournaments', 'profile', 'help'
    ] as Tab[]) {
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
    on('sendAnywayYes', () => {
      const armed = this.pendingForced;
      this.clearAnyway();
      if (!armed) return;
      // Refused rather than redirected. An override armed on another board is
      // not a decision about this one, and guessing which game somebody meant
      // is the one thing that cannot be undone afterwards.
      if (armed.game !== this.gameId) {
        this.notice(
          'chainNotice',
          'warn',
          `That move was for game ${armed.game}, and you are looking at ` +
            `${this.gameId === null ? 'no game' : `game ${this.gameId}`}. Nothing was sent.`
        );
        return;
      }
      void this.submit(armed.value, true);
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
    on('exploreRefresh', () => void this.reloadExplore());
    on('exploreFind', () => void this.findGame());
    on('leaderboardVerify', () => {
      // One way only. Having verified, a reader should not be quietly put back
      // onto the claim by the next redraw.
      this.verifyEverything = true;
      void this.loadLeaderboard();
    });
    on('tournamentLoad', () => {
      const typed = String((this.el.tournamentId as HTMLInputElement).value ?? '').trim();
      this.clearTournament(
        Number(typed) || null,
        this.found.find((e) => String(e.id) === typed)?.manifest.name
      );
      void this.loadTournamentTab();
    });
    // Same read, said out loud. Refresh and Show do the same work; the two
    // exist because "show me 3001" and "show me 3001 AGAIN" are different
    // intentions and a person with a tournament already on screen should not
    // have to wonder whether pressing Show will do anything.
    on('tournamentRefresh', () => void this.loadTournamentTab({ again: true }));
    // Filtering is local, so it can redraw on every keystroke without asking
    // the chain anything.
    this.el.pickerWho.addEventListener('input', () => {
      this.pickerWho = String((this.el.pickerWho as HTMLInputElement).value ?? '');
      this.showAllTournaments = false;
      this.drawPickerFilters();
      this.drawTournamentList();
    });
    this.el.tournamentWho.addEventListener('input', () => {
      this.tournamentWho = String((this.el.tournamentWho as HTMLInputElement).value ?? '');
      this.drawTournament();
    });
    on('claimBuild', () => this.buildNameClaim());
    on('profileLoad', () => void this.loadProfile());

    for (const key of [
      'gameKind',
      'rulesWhite',
      'rulesBlack',
      'rulesWhiteWho',
      'rulesBlackWho',
      'rulesRanked'
    ]) {
      const redraw = (): void => {
        this.drawSeatFields();
        this.drawDraft();
      };
      this.el[key].addEventListener('input', redraw);
      this.el[key].addEventListener('change', redraw);
    }
    this.drawSeatFields();

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
    // A session restored from a previous visit never passed through connect(),
    // so without this the badge would stay dark until the wallet was clicked.
    if (this.address) void this.warmWaiting();
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

    // The badge, kept true while the page sits open.
    //
    // Two halves, because the two cases cost differently. The game ON SCREEN
    // was just read by the poll above, so its answer is free — and it is the
    // case that matters most, because the move that should clear the badge is
    // usually the one you have this moment made. The others need reading, so
    // they are read rarely.
    this.noteOpenGame();
    await this.recheckWaiting();

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
      // TWO READS A POLL WAS THE AUDIENCE LIMIT, and it is worth being plain
      // about the arithmetic. A spectator polls every five seconds; at two
      // requests each that is twenty-four a minute, against an anonymous
      // allowance of fifty. One person watching one game very nearly exhausts
      // the whole per-IP budget by themselves, which is why a local board
      // watching a live game fails within a minute of opening.
      //
      // The one worth cutting is the mempool, and only that one.
      //
      // Reading the game row first to learn `next-seq` looks like it should let
      // a cached log skip its read entirely, and it does - but `getAllEntries`
      // costs one request either way, so the row read replaces the entries read
      // rather than removing it. Same average, a worse worst case, more code.
      // The log read stays as it was.
      //
      // The mempool only ever answers a question about the next few seconds.
      // Asking on every poll is how a board spends its whole allowance watching
      // for something that has not happened. Asking when something IS in
      // flight, and every other poll otherwise, sees the same moves one beat
      // later for half the cost - and a beat is nothing against a twelve-second
      // block.
      this.mempoolTurn = !this.mempoolTurn;
      const wantMempool = this.pending.length > 0 || this.mempoolTurn;

      const [entries, read] = await Promise.all([
        this.chain.getAllEntries(game),
        wantMempool ? this.chain.getPending(game) : Promise.resolve(null)
      ]);
      if (this.gameId !== game) return; // moved on while we were waiting
      this.lastReadAt = Date.now();
      // A skipped read is `null`, which `heldPending` already means "could not
      // tell" - so a poll that did not ask keeps what it had rather than
      // reporting an empty mempool. That distinction was worth building for a
      // rate limit and turns out to be exactly what a deliberate skip needs.
      const pending = this.heldPending(read, entries);

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
   * What to show as pending, given a mempool read that may not have happened.
   *
   * `null` from `getPending` means the read failed - a 429, which all three
   * mainnet hosts return together, or a host without the extended API. Drawing
   * that as an empty mempool is what made a broadcast move appear when the game
   * was opened and then disappear a few seconds later, which reads as the move
   * having been lost. It had not been. Nobody had asked.
   *
   * So a failed read keeps the last list rather than clearing it, with two
   * corrections, because being wrong in the other direction - a phantom pending
   * move that never lands - is its own kind of lie:
   *
   *   * anything that has since CONFIRMED is dropped, or a landed move would be
   *     drawn twice, once in the log and once below it. Matched on sender and
   *     value because the log does not carry a txid.
   *   * anything held longer than `PENDING_HOLD_MS` is dropped. Past that we are
   *     not remembering the mempool, we are guessing about it - a dropped or
   *     replaced transaction looks exactly like one we cannot see.
   */
  private heldPending(read: PendingRow[] | null, entries: EntryRow[]): PendingRow[] {
    const same = (a: string, b: string): boolean => a.toLowerCase() === b.toLowerCase();
    // A SUBMISSION IN THE LOG IS NOT PENDING, however the mempool answered.
    //
    // This filter used to run only on the path where the mempool was NOT read,
    // so a fresh read was taken verbatim — and an indexer that still lists a
    // transaction it has already mined kept the move "pending" for seconds
    // after it landed. The board then showed the piece on its new square and an
    // arrow still pointing at it from the old one, which reads as a second move
    // on its way rather than the one just made.
    //
    // The log is the authority and the mempool is a hint about what is coming.
    // Once the log has it, the hint is spent.
    const landed = (row: PendingRow): boolean =>
      entries.some((entry) => same(entry.sender, row.sender) && same(entry.value, row.value));

    if (read !== null) {
      this.pendingReadAt = Date.now();
      return read.filter((row) => !landed(row));
    }
    if (!this.pending.length) return [];
    if (Date.now() - this.pendingReadAt > PENDING_HOLD_MS) return [];
    return this.pending.filter((row) => !landed(row));
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
      // NOT the game list. loadExplore reads and replays every listed game -
      // its own comment says that spend is why it never runs on a poll - and
      // running it at boot meant following a shared link paid for a list nobody
      // had asked for, alongside the board's own read. That is the whole
      // onboarding path, and it cost about eighteen requests where three would
      // do. It loads when the tab is opened instead; see show().
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
    for (const name of [
      'play', 'game', 'explore', 'leaderboard', 'tournaments', 'profile', 'help'
    ] as Tab[]) {
      this.el[camel(`view-${name}`)].classList.toggle('hide', name !== tab);
      this.el[camel(`tab-${name}`)].setAttribute('aria-selected', String(name === tab));
    }
    if (tab === 'leaderboard') void this.loadLeaderboard();
    if (tab === 'help') void this.loadHelp();
    // Only on first open. A tournament is a manifest plus a couple of dozen
    // reads, and flicking between tabs should not re-spend that.
    // ONLY THE LIST. Opening the tab used to read a tournament nobody had
    // asked for — the default, Exhibition One — which is twenty-one games,
    // twenty-odd reads and half a minute of somebody else's rate limit spent
    // before the reader has said what they want. It also meant the first thing
    // on screen was the OLDEST event, and the newest sat behind a button
    // labelled with its own name.
    //
    // The directory is cheap and is the thing that lets somebody choose: one
    // holdings call, then reads that are remembered for ever. So that runs, and
    // nothing is scored until a button is pressed or a number is typed.
    if (tab === 'tournaments' && !this.found.length) void this.loadTournamentList();

    // Rebuild the list when it has gone stale, which OPENING THE TAB is the
    // signal for.
    //
    // The comment here used to claim it was memoised on the game count and the
    // code checked only for null, so the list was built once and never again:
    // you could play a move, come back, and be shown the board as it was when
    // you first looked - with a "Your move" badge that had since moved
    // elsewhere. The Refresh button was the only way out, and nothing said so.
    //
    // The staleness window is what keeps this honest without making it
    // expensive. Opening the tab is a deliberate act, and a person doing it
    // wants what is true now; flicking between tabs is not, and should not cost
    // a read per flick.
    if (tab === 'explore' && this.exploreIsStale()) void this.loadExplore();
  }

  get currentTab(): Tab {
    return this.tab;
  }

  // ------------------------------------------------------------------
  // Creating a game
  // ------------------------------------------------------------------

  /**
   * What a side is set to, from the two controls that describe it.
   *
   * The select carries the keywords; `named` is not a value the rules ever see,
   * it only reveals the text field beside it. Returning the raw text when that
   * field is empty rather than a keyword is deliberate: "a specific person,
   * unnamed" is not ready to open, and readyToOpen is what should say so.
   */
  private seat(which: 'White' | 'Black'): string {
    const choice = (this.el[`rules${which}`] as HTMLSelectElement).value;
    if (choice !== 'named') return choice;
    return (this.el[`rules${which}Who`] as HTMLInputElement).value.trim();
  }

  /** Show the address field only for the option that needs one. */
  private drawSeatFields(): void {
    for (const which of ['White', 'Black'] as const) {
      const named = (this.el[`rules${which}`] as HTMLSelectElement).value === 'named';
      this.el[`rules${which}Who`].classList.toggle('hide', !named);
    }
  }

  private draft(): Partial<Rules> {
    return {
      white: this.seat('White'),
      black: this.seat('Black'),
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
    // The text fields, which is where a .btc name can have been typed. The
    // selects hold keywords and a keyword is never resolved.
    const fields = [this.el.rulesWhiteWho, this.el.rulesBlackWho] as HTMLInputElement[];
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
    this.text('gameLabel', this.gameHeading());
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
    //
    // Nor an armed "send anyway", and for a stronger reason: the promotion picker
    // only wastes a click, while "send it anyway" spends money on a permanent
    // submission. It carries its own game id as well, so this is the second of
    // two locks rather than the only one.
    this.hidePromotion();
    this.clearAnyway();
    const loaded = await this.guard(`loading game ${game}`, async () => {
      const row = await this.chain.getGame(game);
      if (!row) {
        this.notice('chainNotice', 'warn', `There is no game ${game}.`);
        return false;
      }
      this.gameId = game;
      this.game = row;
      const [entries, read] = await Promise.all([
        this.chain.getAllEntries(game),
        this.chain.getPending(game)
      ]);
      this.entries = entries;
      // Nothing to hold on to on a first load, so a failed read shows nothing
      // pending - which is all it can honestly show.
      //
      // Filtered by the same rule the poll uses, and through the same function
      // so the two cannot drift. Opening a game moments after a move landed
      // otherwise drew an arrow from a square the piece had already left,
      // because the indexer still listed a transaction it had mined.
      this.pending = this.heldPending(read, entries);
      if (read !== null) this.pendingReadAt = Date.now();
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
  /**
   * The tab says which game it is looking at.
   *
   * WHY THIS IS NOT A NICETY. On 2026-08-14 the same move was submitted to two
   * different games three minutes apart, by the same wallet, and the chain shows
   * it: g7g5 into game 2 at block 8757147 and into game 1 at 8757168. Both were
   * `xtrata.btc v anyone-else`, both black to move, both opened 1.e4. Nothing
   * was wrong with the software - there is no automatic resubmission anywhere,
   * and a duplicate listener fires in the same tick rather than three minutes
   * later. It was two deliberate clicks in a board that could not be told apart
   * from itself.
   *
   * Every tab looked identical, and a browser tab shows a title before it shows
   * anything else. So: `Game 8 - black to move - X Chess`.
   *
   * The order matters. `baseTitle` is what a turn flash restores to, so it has
   * to be recomputed HERE rather than captured once at boot - captured once, the
   * flash would restore whatever game happened to be open first and quietly
   * relabel the tab.
   */
  /**
   * What the board calls the game on screen.
   *
   * Two places used to write this string independently, which is how one of
   * them ends up saying "Game 41" while the other says "Final". One function
   * now, and the tab title uses the same source.
   */
  private gameHeading(): string {
    if (this.gameId === null) return 'no game loaded';
    const stage = this.inTournament.get(this.gameId)?.stage;
    return stage ? `${stage} — Game ${this.gameId}` : `Game ${this.gameId}`;
  }

  private drawTitle(): void {
    // NAMED BY WHAT IT IS, when the board has been told. "Final" in a browser
    // tab is worth more than a number, and somebody with several games open is
    // the person who needs it most.
    const stage = this.gameId === null ? null : this.inTournament.get(this.gameId)?.stage;
    const name =
      this.gameId === null ? 'X Chess' : stage ? `${stage} · Game ${this.gameId}` : `Game ${this.gameId}`;
    const turn =
      this.gameId === null || !this.state
        ? null
        : this.state.status === 'over'
          ? this.state.result
          : `${this.state.turn} to move`;

    this.baseTitle = [name, turn, this.gameId === null ? null : 'X Chess']
      .filter(Boolean)
      .join(' \u00b7 ');
    // A flash in progress owns the title until it is put back. Rewriting it here
    // would drop the (your turn) prefix on the next poll, which is the one
    // moment it exists for.
    if (!this.flashing) this.doc.title = this.baseTitle;
  }

  private flashTitle(on: boolean): void {
    if (!this.baseTitle) this.drawTitle();
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

    this.text('gameLabel', this.gameHeading());
    this.drawTitle();

    const canSubmit =
      Boolean(this.address) && state.status === 'live' && !this.options.signingBlocked?.();

    // The board-wide verdict. Computed once, and it drives BOTH what is
    // clickable and what the board says - so the two cannot drift apart. They
    // used to: the prose already explained that a wrong-side submission would
    // be skipped, while the squares stayed live and the wallet opened anyway.
    const ctx = this.eligibility(state);
    const verdict = judgeMove(ctx);

    // Squares are locked exactly when the board can PROVE the submission is
    // doomed, which is what `no` means and the only thing it means. That covers
    // the reported case - a wallet holding White should not be able to pick up
    // a black piece - and the way past it is to reconnect with the account you
    // meant, which each of those verdicts says in its own sentence.
    //
    // This clause used to also lock on a warning when the rules were confirmed,
    // and pair it with a "Let me try anyway" panel. Both halves are gone: under
    // confirmed rules a doomed submission is now refused outright rather than
    // warned about, so the warning-that-locks no longer exists and the panel had
    // nothing left to appear for. A warning still leaves the squares live.
    const locked = verdict.tier === 'no';

    this.drawWhyNot(canSubmit, verdict);
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
    return this.nameOf(address).name;
  }

  /**
   * The strongest name available for an address, and where it came from.
   *
   * ORDERED BY WHAT STANDS BEHIND IT. A BNS name is owned on chain. A player
   * manifest is a signature from the key being named. A tournament name is an
   * organiser's word.
   *
   * The tournament rung was left out at first, on the reasoning that such a
   * name is only true inside its tournament — which is right in principle and
   * unhelpful in practice. Following a link from the Tournaments tab to game 13
   * showed two truncated addresses for players the board had just finished
   * calling Mason and Wager. If the board knows a name, withholding it is not
   * caution, it is a worse answer; the honest part is saying where it came from,
   * which `nameSourceNote` does in the tooltip.
   */
  private nameOf(address: string): { name: string; source: ReturnType<typeof displayName>['source'] } {
    return displayName({
      address,
      bns: this.names?.peek(address) ?? null,
      player: this.players?.peek(address) ?? null,
      tournament: this.entrantNames.get(address) ?? null
    });
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
      const shown = this.nameOf(address);
      const full =
        shown.source === 'address'
          ? address
          : `${shown.name} - ${address} (${nameSourceNote(shown.source)})`;
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
  /**
   * What a move costs here, said in every game rather than only at signing.
   *
   * A wallet estimates from the whole network and knows nothing about this
   * contract, so it has quoted between eight and fifteen times the price every
   * move here actually confirms at. The board cannot correct that — a network
   * fee is not one of the six parameters `stx_callContract` accepts — so the
   * only thing it can do is make sure nobody meets the number for the first
   * time while a wallet is already open and waiting on them.
   *
   * Written once at start-up. It never changes, and redrawing an unchanging
   * sentence on every board update is how a static note starts costing frames.
   */
  private feeAdviceKey = '';

  private drawFeeAdvice(): void {
    // YOUR OWN pending moves, not everybody's. The status line already counts
    // all of them; this is about the one you can do something about.
    const mine = this.address
      ? this.pending.filter((p) => String(p.sender ?? '').toUpperCase() === this.address!.toUpperCase())
      : [];
    const stuck = mine[0] ?? null;

    // Rebuilt only when it would actually differ. This sits in every game and
    // the board redraws on every poll, so an unconditional rebuild is a static
    // sentence costing frames forever.
    const key = stuck ? `${stuck.txid}:${stuck.nonce}:${stuck.fee}` : 'none';
    if (key === this.feeAdviceKey) return;
    this.feeAdviceKey = key;

    const node = this.el.feeAdvice;
    node.replaceChildren();
    node.classList.toggle('notice--warn', stuck !== null);
    node.classList.toggle('notice--info', stuck === null);

    const line = (className = 'how'): HTMLElement => {
      const span = this.doc.createElement('span');
      span.className = className;
      node.appendChild(span);
      return span;
    };
    const loud = (text: string, into: HTMLElement = node): void => {
      const b = this.doc.createElement('b');
      b.textContent = text;
      into.appendChild(b);
    };
    const key_ = (text: string, into: HTMLElement): void => {
      const em = this.doc.createElement('em');
      em.textContent = text;
      into.appendChild(em);
    };

    if (!stuck) {
      loud(`Moves on this contract cost ${MOVE_FEE_STX} STX.`);
      node.appendChild(
        this.doc.createTextNode(
          ' Your wallet estimates from the whole network rather than from this contract, ' +
            'so it will usually suggest several times more. The fee is yours to set.'
        )
      );
      const how = line();
      how.appendChild(this.doc.createTextNode('Xverse: '));
      key_('Edit', how);
      how.appendChild(this.doc.createTextNode(' then '));
      key_('Custom', how);
      how.appendChild(this.doc.createTextNode(' · Leather: the '));
      key_('Custom', how);
      how.appendChild(this.doc.createTextNode(' tab'));
      return;
    }

    // A MOVE OF YOURS IS IN THE MEMPOOL, so the useful thing is no longer the
    // price — it is the nonce.
    //
    // Replacing a stuck transaction means signing the SAME nonce at a higher
    // fee. Signing a new one takes the next nonce, which queues BEHIND the
    // stuck move rather than replacing it: two fees, and the second cannot
    // confirm until the first does. Both wallets can do the replacement and
    // neither can say which pending transaction is the chess move, because
    // neither knows what this contract is. The board does, so it says the
    // number rather than sending somebody to an explorer to find it.
    const waited = stuck.receivedAt ? Math.round((this.now() - stuck.receivedAt) / 60_000) : null;
    node.appendChild(this.doc.createTextNode(`Your move ${stuck.value} is broadcast and not yet in a block`));
    node.appendChild(this.doc.createTextNode(waited !== null && waited > 0 ? `, ${waited} minute${waited === 1 ? '' : 's'} ago. ` : '. '));
    node.appendChild(this.doc.createTextNode('To replace it, sign again at the '));
    loud(stuck.nonce === null ? 'same nonce' : `same nonce, ${stuck.nonce}`);
    node.appendChild(
      this.doc.createTextNode(
        `, with a fee above ${((stuck.fee ?? MOVE_FEE_USTX) / 1_000_000).toFixed(4)} STX. ` +
          'A new nonce queues behind this one instead of replacing it, and you would pay for both.'
      )
    );

    const how = line();
    how.appendChild(this.doc.createTextNode('Xverse: '));
    key_('Speed Up', how);
    how.appendChild(this.doc.createTextNode(' on the Stacks dashboard, or '));
    key_('Edit nonce', how);
    how.appendChild(this.doc.createTextNode(' when signing · Leather extension: '));
    key_('Activity', how);
    how.appendChild(this.doc.createTextNode(', then increase the fee (Leather desktop cannot)'));
  }

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
          ? `${this.intent.from} to ${this.intent.to} is waiting for your wallet. Nothing has been sent yet. ` +
            // SAID BECAUSE THE BOARD CANNOT DO ANYTHING ELSE ABOUT IT.
            //
            // `stx_callContract` takes six parameters and a network fee is not
            // one of them, so a board signing through a wallet cannot propose a
            // price however much it knows about one — see CallRequest.fee. The
            // wallet therefore falls back to its own estimator, which does not
            // know this contract and has quoted between eight and fifteen times
            // what moves here actually confirm at.
            //
            // The number is not a guess. Every `submit` that has confirmed on
            // this contract paid MOVE_FEE_USTX; the tournament runner has spent
            // it a thousand times over. Telling somebody that, at the moment
            // their wallet is asking, is the only lever left — and it is a real
            // one, because the fee field in every wallet is editable.
            `Your wallet will suggest its own network fee. Moves on this contract confirm at ` +
            `${MOVE_FEE_STX} STX, so you can usually lower it.`
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

      // STOPPED SHORT OF THE GHOST, and pointed at it.
      //
      // A line that runs to the centre of the destination ends underneath the
      // piece it is describing, so the two cues fight: the arrow hides the
      // thing it is pointing at. Backing off by a third of a square leaves the
      // ghost clear and makes the head readable as a head.
      const line = this.doc.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', String(from.x));
      line.setAttribute('y1', String(from.y));
      line.setAttribute('x2', String(to.x));
      line.setAttribute('y2', String(to.y));
      line.setAttribute('class', isSigning ? 'ar--signing' : 'ar--sent');
      // Scaled by the viewBox, so the stroke has to be given in those units.
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      // The head is a marker defined once in the shell, so this is the whole
      // cost of drawing one. Its refX sits it back off the destination square,
      // which keeps it from covering the ghost it is pointing at.
      line.setAttribute('marker-end', isSigning ? 'url(#ah-signing)' : 'url(#ah-sent)');
      svg.appendChild(line);
    }
  }

// ------------------------------------------------------------------
  // Tournaments
  // ------------------------------------------------------------------

  /**
   * Show a tournament, in two passes.
   *
   * The first is one game row each and renders immediately. The second replays
   * every game — 1,700 entries for the exhibition, 340 of them in one game —
   * and only then can the table be scored or the manifest dated, because
   * provenance needs the height of the earliest MOVE and a game row only says
   * when a game was opened.
   */
  /**
   * Ask the chain which tournaments exist, and offer them.
   *
   * WITHOUT THIS THE TAB CAN ONLY SHOW YOU WHAT YOU ALREADY KNEW. It took an
   * inscription number and defaulted to one, so a second tournament was
   * invisible to anybody not told its number — and this board is itself an
   * inscription, so "we will add it later" is not available.
   *
   * Quiet on failure. The typed field still works, so a directory that cannot
   * be read costs a convenience rather than the tab.
   */
  private async loadTournamentList(): Promise<void> {
    if (!this.index) return;
    try {
      this.found = await this.index.list();
    } catch {
      this.found = [];
    }
    this.drawPickerFilters();
    this.drawTournamentList();
  }

  /**
   * When this was read, and whether anything can still change.
   *
   * A tournament tab is a photograph of a chain that moves. Saying when the
   * photograph was taken is the difference between "nothing has happened" and
   * "nothing has been asked" — which look identical and are not.
   */
  private drawTournamentFresh(): void {
    const view = this.tournament;
    const live = (view?.rounds ?? [])
      .flatMap((round) => round.games)
      .filter((game) => game.result === null).length;

    if (!view?.ok || !this.tournamentReadAt) {
      this.text('tournamentFresh', '');
      return;
    }
    const mins = Math.floor((this.now() - this.tournamentReadAt) / 60_000);
    const when = mins < 1 ? 'just now' : `${mins} minute${mins === 1 ? '' : 's'} ago`;
    this.text(
      'tournamentFresh',
      live
        ? `Read ${when}. ${live} game${live === 1 ? '' : 's'} still being played, so this updates itself.`
        : `Read ${when}. Every game has finished, so nothing here will change.`
    );
  }

  /**
   * Watch a tournament that is still being played, without paying to.
   *
   * A tournament on chain changes while somebody is looking at it, and the tab
   * used to be a photograph — Refresh exists for that, and having to press it
   * to find out whether anything happened is the same as not knowing.
   *
   * So this reads ONLY the unfinished games, and only their row, which is one
   * read each and no replay. If nothing moved it costs that and stops. If
   * something did, the full score runs, because the standings are derived and
   * cannot be patched from a row.
   *
   * Nothing at all is read when every game has a result, when the tab is not
   * on screen, or when the page is hidden. A finished tournament is a static
   * document and should cost what one costs.
   */
  private scheduleTournamentPoll(): void {
    if (this.tournamentPoll) clearTimeout(this.tournamentPoll);
    if (this.stopped) return;
    this.tournamentPoll = setTimeout(() => void this.pollTournament(), TOURNAMENT_POLL_MS);
  }

  private async pollTournament(): Promise<void> {
    const view = this.tournament;
    const live = (view?.rounds ?? [])
      .flatMap((round) => round.games)
      .filter((game) => game.result === null);

    // Every reason to do nothing, checked before anything is read.
    if (
      this.tab !== 'tournaments' ||
      this.busy ||
      this.doc.visibilityState === 'hidden' ||
      !view?.ok ||
      !live.length
    ) {
      this.scheduleTournamentPoll();
      return;
    }

    try {
      const rows = await pool(
        EXPLORE_READ_WIDTH,
        live.map((game) => () => this.chain.getGame(game.id).catch(() => null))
      );
      const now = rows
        .map((row, at) => `${live[at].id}:${row?.nextSeq ?? live[at].moves ?? 0}`)
        .join(',');
      // Compared against submissions rather than accepted moves, which is the
      // conservative direction: a submission replay will skip still counts as
      // "something happened", so the worst case is one rescore that changes
      // nothing, and never a board that sat still while the game moved.
      if (now !== this.tournamentSeenRaw) {
        this.tournamentSeenRaw = now;
        await this.loadTournamentTab({ again: true });
      }
    } catch {
      // A poll that fails changes nothing on screen and says nothing about it.
    }
    this.scheduleTournamentPoll();
  }

  /**
   * Does this game survive the current filter?
   *
   * Pure, and every field it reads was computed during scoring. A filter that
   * asked the chain anything would be able to disagree with the row it is
   * hiding, which is the one thing a filter must never do.
   */
  private tournamentShows(game: CheckedGame): boolean {
    const who = this.tournamentWho.trim().toUpperCase();
    if (who) {
      // An address or an entrant name, because a reader has whichever they have.
      // Substring, so a BNS name or a partial address both work; names in a
      // manifest are short and chosen by an organiser, not user input.
      const named =
        game.white.toUpperCase().includes(who) ||
        game.black.toUpperCase().includes(who) ||
        String(game.toMove ?? '').toUpperCase().includes(who);
      if (!named) return false;
    }
    switch (this.tournamentFilter) {
      case 'your-move':
        return Boolean(
          this.address && String(game.toMove ?? '').toUpperCase() === this.address.toUpperCase()
        );
      case 'live':
        return game.result === null;
      case 'finished':
        return game.result !== null;
      case 'unverified':
        return game.verdict !== 'verified';
      default:
        return true;
    }
  }

  /**
   * Take the old tournament off the screen before reading the new one.
   *
   * Scoring is a read and a replay per game, so there are twenty or thirty
   * seconds between asking for a tournament and seeing it. The tab used to
   * spend those showing the PREVIOUS one — standings, rounds, results and all —
   * under a note about loading something else. Everything on screen was true
   * and about a different tournament, which is the most misleading thing a
   * board can be: not blank, not wrong, just answering a question nobody asked
   * any more.
   */
  private clearTournament(id: number | null, name?: string): void {
    this.tournament = null;
    this.tournamentLoading = id;
    this.tournamentReadAt = 0;
    this.tournamentSeenRaw = '';
    this.tournamentFilter = 'all';
    this.tournamentWho = '';
    (this.el.tournamentWho as HTMLInputElement).value = '';
    this.el.tournamentBody.replaceChildren();
    this.el.tournamentFilters.replaceChildren();
    this.el.tournamentField.classList.add('hide');
    this.el.tournamentProvenance.classList.add('hide');
    this.text('tournamentShown', '');
    this.text('tournamentFresh', '');
    this.notice('tournamentNote', 'info', name ? `Reading ${name}…` : 'Reading…');
    // So the button that was just pressed reads as selected while it loads.
    this.drawTournamentList();
  }

  /** What this board has been told about a tournament, or `unknown`. */
  private tournamentState(id: number): TournamentState {
    try {
      const raw = (globalThis as { localStorage?: Storage }).localStorage?.getItem(STATE_KEY + id);
      return raw === 'planned' || raw === 'running' || raw === 'finished' ? raw : 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Remember what a tournament was doing, having just scored it.
   *
   * Only ever called with a fully scored view, because a partial one would
   * record "planned" for a tournament whose games had merely not been fetched.
   */
  private rememberTournamentState(view: TournamentView): void {
    const id = view.tournamentId;
    if (!id || !view.ok || !view.scored) return;
    const games = (view.rounds ?? []).flatMap((round) => round.games);
    if (!games.length) return;
    const state: TournamentState = games.every((g) => g.result !== null)
      ? 'finished'
      : games.some((g) => (g.moves ?? 0) > 0)
        ? 'running'
        : 'planned';
    try {
      (globalThis as { localStorage?: Storage }).localStorage?.setItem(STATE_KEY + id, state);
    } catch {
      // A cache. Losing it costs a filter being less specific, never a wrong row.
    }
  }

  /** The tournaments the picker should offer, after filtering and the cap. */
  private pickerShows(): { shown: Found<Tournament>[]; hidden: number } {
    const who = this.pickerWho.trim().toUpperCase();
    const matching = this.found.filter((entry) => {
      if (this.pickerFilter !== 'all' && this.tournamentState(entry.id) !== this.pickerFilter) {
        return false;
      }
      if (!who) return true;
      // FREE, because the manifest is already parsed. Entrants carry both a
      // name and an address, so a reader can use whichever they have.
      return entry.manifest.entrants.some(
        (e) => e.name.toUpperCase().includes(who) || e.address.toUpperCase().includes(who)
      );
    });
    if (this.showAllTournaments || matching.length <= RECENT_TOURNAMENTS) {
      return { shown: matching, hidden: 0 };
    }
    return {
      shown: matching.slice(0, RECENT_TOURNAMENTS),
      hidden: matching.length - RECENT_TOURNAMENTS
    };
  }

  private drawPickerFilters(): void {
    const node = this.el.pickerFilters;
    node.replaceChildren();
    if (!this.found.length) {
      this.text('pickerShown', '');
      return;
    }

    const options: [PickerFilter, string][] = [
      ['all', 'All'],
      ['finished', 'Finished'],
      ['running', 'Running'],
      ['planned', 'Not started'],
      ['unknown', 'Not opened yet']
    ];
    const was = this.pickerFilter;
    for (const [key, label] of options) {
      this.pickerFilter = key;
      const many = this.pickerShows().shown.length + this.pickerShows().hidden;
      this.pickerFilter = was;
      // A filter that can only ever return nothing is noise on a row of five.
      if (key !== 'all' && many === 0) continue;

      const button = this.doc.createElement('button');
      button.type = 'button';
      button.className = 'tn-pick';
      button.textContent = label;
      const count = this.doc.createElement('span');
      count.className = 'n';
      count.textContent = String(many);
      button.appendChild(count);
      button.setAttribute('aria-pressed', String(this.pickerFilter === key));
      button.addEventListener('click', () => {
        this.pickerFilter = key;
        this.showAllTournaments = false;
        this.drawPickerFilters();
        this.drawTournamentList();
      });
      node.appendChild(button);
    }

    const { shown, hidden } = this.pickerShows();
    // STATE IS LEARNED, NOT READ, and saying so is the difference between a
    // filter that looks broken and one whose limits are understood.
    const unopened = this.found.filter((e) => this.tournamentState(e.id) === 'unknown').length;
    this.text(
      'pickerShown',
      `${shown.length + hidden} of ${this.found.length}` +
        (unopened ? ` · ${unopened} not opened yet, so their state is unknown` : '')
    );
  }

  private drawTournamentFilters(): void {
    const node = this.el.tournamentFilters;
    node.replaceChildren();
    const view = this.tournament;
    if (!view?.ok || !view.rounds?.length) {
      this.text('tournamentShown', '');
      return;
    }
    const games = view.rounds.flatMap((round) => round.games);

    const options: [TournamentFilter, string][] = [
      ['all', 'All'],
      // Offered only when there is somebody to be. A filter that always returns
      // nothing reads as a broken tab rather than an empty answer.
      ...(this.address ? ([['your-move', 'Your move']] as [TournamentFilter, string][]) : []),
      ['live', 'Still playing'],
      ['finished', 'Finished'],
      ...(games.some((g) => g.verdict !== 'verified')
        ? ([['unverified', 'Unverified']] as [TournamentFilter, string][])
        : [])
    ];
    if (!options.some(([key]) => key === this.tournamentFilter)) this.tournamentFilter = 'all';

    for (const [key, label] of options) {
      const button = this.doc.createElement('button');
      button.type = 'button';
      button.className = 'tn-pick';
      button.textContent = label;
      const many = games.filter((g) => {
        const was = this.tournamentFilter;
        this.tournamentFilter = key;
        const shows = this.tournamentShows(g);
        this.tournamentFilter = was;
        return shows;
      }).length;
      const count = this.doc.createElement('span');
      count.className = 'n';
      count.textContent = String(many);
      button.appendChild(count);
      button.setAttribute('aria-pressed', String(this.tournamentFilter === key));
      button.addEventListener('click', () => {
        this.tournamentFilter = key;
        this.drawTournament();
      });
      node.appendChild(button);
    }

    const showing = games.filter((g) => this.tournamentShows(g)).length;
    this.text(
      'tournamentShown',
      showing === games.length
        ? `${games.length} game${games.length === 1 ? '' : 's'}`
        : `${showing} of ${games.length} shown`
    );
  }

  private drawTournamentList(): void {
    const node = this.el.tournamentList;
    node.replaceChildren();
    if (!this.found.length) return;

    // An empty tab with buttons on it does not say that pressing one is the
    // next step, and a reader who has never seen this before should not have to
    // infer it.
    if (!this.tournament) {
      // SAY WHAT WAS NOT LOOKED AT. The directory reads the newest inscriptions
      // in the wallet, which bounds READS rather than tournaments — so once the
      // wallet holds more than that, a list that stopped quietly would read as a
      // complete one, and the older tournaments would look as though they had
      // never been inscribed.
      const scan = this.index?.lastScan;
      const unread = scan ? Math.max(0, scan.held - scan.scanned) : 0;
      this.notice(
        'tournamentNote',
        'info',
        `${this.found.length} tournament${this.found.length === 1 ? '' : 's'} found on chain. ` +
          'Choose one, or type the number of another.' +
          (unread
            ? ` ${unread} older inscription${unread === 1 ? '' : 's'} in that wallet ` +
              'were not read; type a number to open one directly.'
            : '')
      );
    }

    // What the reader ASKED for, which during a load is not what is on screen.
    const showing = this.tournamentLoading ?? this.tournament?.tournamentId ?? null;
    const loading = this.tournamentLoading;
    const { shown, hidden } = this.pickerShows();

    // PILLS DO NOT SCALE, and the point at which they stop is low: about six fit
    // on one line, and past that they wrap into a wall of similar-looking chips
    // that has to be read left to right to find anything. A list is worse for
    // three and better for thirty, so the shape follows the number rather than
    // being chosen once.
    //
    // The typed field beside it is what actually scales, and is why this can
    // stay simple: somebody who knows the number never needs the list at all.
    if (shown.length > MANY_TOURNAMENTS) {
      const picker = this.doc.createElement('select');
      picker.className = 'tn-picker';
      picker.setAttribute('aria-label', 'Tournaments found on chain');
      const first = this.doc.createElement('option');
      first.textContent = `${shown.length} tournaments — choose one`;
      first.value = '';
      picker.appendChild(first);
      for (const entry of shown) {
        const option = this.doc.createElement('option');
        option.value = String(entry.id);
        option.selected = entry.id === showing;
        option.textContent =
          `${entry.manifest.name} · ${entry.id} · ${entry.manifest.games.length} games` +
          (entry.official ? '' : ' · not inscribed by the organiser');
        picker.appendChild(option);
      }
      picker.addEventListener('change', () => {
        if (!picker.value) return;
        (this.el.tournamentId as HTMLInputElement).value = picker.value;
        const chosen = this.found.find((e) => String(e.id) === picker.value);
        this.clearTournament(Number(picker.value), chosen?.manifest.name);
        void this.loadTournamentTab();
      });
      node.appendChild(picker);
      return;
    }

    for (const entry of shown) {
      const button = this.doc.createElement('button');
      button.type = 'button';
      button.className =
        `tn-pick${entry.official ? '' : ' tn-pick--planted'}` +
        (entry.id === loading ? ' tn-pick--loading' : '');
      button.setAttribute('aria-pressed', String(entry.id === showing));
      if (entry.id === loading) button.setAttribute('aria-busy', 'true');
      button.textContent = entry.manifest.name;

      const number = this.doc.createElement('span');
      number.className = 'n';
      number.textContent = String(entry.id);
      button.appendChild(number);

      // SAID, NOT ONLY DRAWN. A dashed border is not an explanation, and the
      // difference here is the one a stranger could exploit: anybody may send
      // an inscription to any wallet, so being held by the organiser is a
      // claim and being minted by them is a fact.
      button.title = entry.official
        ? `${entry.manifest.games.length} games · inscribed by the tournament organiser`
        : `${entry.manifest.games.length} games · in the organiser's wallet but inscribed by ` +
          'somebody else. Every pairing is still checked against the chain.';

      button.addEventListener('click', () => {
        (this.el.tournamentId as HTMLInputElement).value = String(entry.id);
        this.clearTournament(entry.id, entry.manifest.name);
        void this.loadTournamentTab();
      });
      node.appendChild(button);
    }

    // NEVER A SILENT CAP. The rest are one click away and the button says how
    // many, so a short list is never mistaken for a complete one.
    if (hidden) {
      const more = this.doc.createElement('button');
      more.type = 'button';
      more.className = 'tn-pick';
      more.textContent = `${hidden} older`;
      more.title = `Show the other ${hidden}`;
      more.addEventListener('click', () => {
        this.showAllTournaments = true;
        this.drawTournamentList();
      });
      node.appendChild(more);
    }
  }

  private async loadTournamentTab(options: { again?: boolean } = {}): Promise<void> {
    if (!this.xtrata) {
      // No endpoint means no inscription reader, and a tournament is nothing
      // but an inscription. Say that rather than drawing an empty tab.
      this.notice('tournamentNote', 'warn', 'This board has no chain endpoint, so it cannot read a manifest.');
      return;
    }
    const typed = String((this.el.tournamentId as HTMLInputElement).value ?? '').trim();
    const id = Number(typed || DEFAULT_TOURNAMENT);
    if (!Number.isInteger(id) || id < 1) {
      this.notice('tournamentNote', 'warn', 'Type the inscription number of a tournament manifest.');
      return;
    }

    const deps = {
      chain: this.chain,
      reader: this.xtrata!,
      compiledAcceptedBefore: COMPILED_ACCEPTED_BEFORE,
      bnsFor: (address: string) => this.names?.peek(address) ?? null
    };

    await this.guard(`reading tournament ${id}`, async () => {
      // Named when the name is known, because "manifest 2993" is the one thing
      // a reader who just clicked "X Chess Exhibition One" already knows.
      const called = this.found.find((e) => e.id === id)?.manifest.name;
      this.notice(
        'tournamentNote',
        'info',
        options.again
          ? `Reading ${called ?? `manifest ${id}`} again, and every game with it.`
          : `Reading ${called ?? `manifest ${id}`} and checking every pairing against the chain.`
      );
      const view = await loadTournament(id, deps);
      this.tournament = view;
      // Cleared on the unhappy path too, or a manifest that will not parse
      // leaves its button spinning for the rest of the session.
      if (!view.ok) this.tournamentLoading = null;
      this.drawTournament();
      if (!view.ok) return false;

      // Names for everybody, once, before the expensive pass — so the first
      // full paint already reads as people rather than principals.
      await this.names?.resolveAll(view.tournament?.entrants.map((e) => e.address) ?? []);
      this.notice('tournamentNote', 'info', 'Replaying every game to score it. This is the slow part.');
      // Remembered so Explore can say a game belongs to something. The board
              // can only ever know about tournaments it has loaded — see the
              // column, which says nothing rather than "not in a tournament".
              for (const game of view.tournament?.games ?? []) {
                this.inTournament.set(game.id, {
                  id,
                  name: view.tournament!.name,
                  // So a game opened from here can say what it is, and so the
                  // browser tab does. A board that knows a game is a final and
                  // shows it as "Game 41" is withholding the interesting part.
                  stage: stageOf(view.tournament!, game)
                });
              }
              // So a game reached from here can name its players. Two
              // tournaments could name one address differently; the most
              // recently loaded wins, and the tooltip says the name is an
              // organiser's rather than the address's own.
              for (const entrant of view.tournament?.entrants ?? []) {
                this.entrantNames.set(entrant.address, entrant.name);
              }
              // The candidate the Leaderboard cannot guess. See rulesForRanked.
              if (view.tournament) this.rememberPairings(view.tournament);
              this.tournament = await scoreTournament(view, deps);
      this.tournamentLoading = null;
      this.rememberTournamentState(this.tournament);
      this.tournamentReadAt = this.now();
      this.tournamentSeenRaw = '';
      this.drawTournament();
      // So the button for what is now on screen reads as selected.
      this.drawPickerFilters();
      this.drawTournamentList();
      this.drawTournamentFresh();
      this.scheduleTournamentPoll();
      return true;
    });

    // AFTER THE GUARD, so it runs on every path. `guard` catches, so a read
    // that throws never reaches the lines inside — and the button it left
    // highlighted would stay that way for the rest of the session, pointing at
    // a tournament that is not on screen.
    if (this.tournamentLoading !== null) {
      this.tournamentLoading = null;
      this.drawTournamentList();
    }
  }

/**
   * Build the manifest that lets an address name itself.
   *
   * THE BOARD DOES NOT INSCRIBE IT, and cannot: it holds no key and never will,
   * being an inscription itself. So this produces the exact bytes and the person
   * inscribes them from the wallet being named — which is not a limitation, it
   * is the entire mechanism. An inscription made BY an address is that key
   * attesting; one made by anybody else is a stranger writing your name down.
   *
   * The address is taken from the connected wallet rather than typed, because a
   * manifest naming an address you do not control is refused by `attested` and
   * would be 0.3 STX spent on nothing.
   */
  private buildNameClaim(): void {
    const why = this.el.claimNameWhy;
    const problems = this.el.claimProblems;
    const output = this.el.claimManifest;
    problems.classList.add('hide');
    output.classList.add('hide');

    if (!this.address) {
      why.textContent =
        'Connect the wallet you want to name. A name only counts when the address itself ' +
        'inscribes it, so this has to be built for the wallet you are holding.';
      return;
    }

    const draft = {
      address: this.address,
      name: String((this.el.claimName as HTMLInputElement).value ?? '').trim(),
      about: String((this.el.claimAbout as HTMLInputElement).value ?? '').trim()
    };

    // Validated by PARSING WHAT WAS BUILT, rather than by checking the draft
    // against the same rules twice. If the text this produces does not read back
    // as a valid manifest, it is not one, whatever the form thought.
    const text = buildPlayer(draft);
    const parsed = parsePlayer(text);
    if (!parsed.ok) {
      problems.classList.remove('hide');
      problems.textContent = parsed.problems.map((p) => `${p.field}: ${p.says}`).join(' · ');
      return;
    }

    output.classList.remove('hide');
    output.textContent = text;
    why.textContent =
      `Inscribe this from ${this.address} on Xtrata, as text/plain. It costs about 0.3 STX. ` +
      'Once it is on chain this board will call you ' + draft.name +
      ' anywhere it currently shows your address — unless you register a BNS name, which wins.';
  }

  private drawTournament(): void {
    const view = this.tournament;
    const body = this.el.tournamentBody;
    body.replaceChildren();
    this.drawTournamentFilters();
    const banner = this.el.tournamentProvenance;
    banner.classList.add('hide');
    if (!view) return;

    if (!view.ok) {
      this.notice(
        'tournamentNote',
        'warn',
        `That is not a readable tournament manifest. ${view.problems.join(' ')}`
      );
      return;
    }

    const t = view.tournament!;
    this.notice(
      'tournamentNote',
      'info',
      `${t.name} — ${t.format}, ${t.entrants.length} entrants, ${t.games.length} games. ` +
        `Manifest ${view.tournamentId}` +
        (view.lineage.length > 1 ? `, revised ${view.lineage.length - 1} time(s)` : '') +
        (t.engine ? `, engine inscription ${t.engine}.` : '.')
    );

    this.drawTournamentField(t);

    // THE DOCUMENTS THEMSELVES, not just their numbers.
    //
    // Everything defining a tournament is inscribed — the pairings, the engine
    // every player was handed — and until now the board printed the numbers as
    // plain text. A reader had to already know that an inscription can be read,
    // and where, which makes "checkable by a stranger" true in principle and
    // false in practice.
    //
    // Absolute. See INSCRIPTION_VIEWER: a relative path resolves under one
    // gateway and nowhere else, including when this page is opened directly.
    const note = this.el.tournamentNote;
    const read = this.doc.createElement('span');
    read.className = 'tn-read';
    read.appendChild(this.doc.createTextNode(' Read: '));
    const link = (id: number, label: string): void => {
      if (read.childNodes.length > 1) read.appendChild(this.doc.createTextNode(' · '));
      const a = this.doc.createElement('a');
      a.href = `${INSCRIPTION_VIEWER}${id}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = label;
      read.appendChild(a);
    };
    link(view.tournamentId!, `manifest ${view.tournamentId}`);
    if (t.engine) link(t.engine, `engine ${t.engine}`);
    note.appendChild(read);

    // WHICH KIND OF DOCUMENT THIS IS, said before anything derived from it.
    if (view.scored) {
      banner.classList.remove('hide');
      // THE BANNER ENCODES WHICH KIND OF DOCUMENT THIS IS, and looked identical
      // to the descriptive note above it — same notice--info, so the sentence
      // that actually matters read as more of the same prose.
      //
      // The accent carries the meaning rather than merely being different:
      // committed is the strong case, compiled is weaker but accepted, refused
      // is neither. Colour is the accent only; the words say it all anyway, so
      // nobody has to separate two hues to know what they are looking at.
      const kind = !view.honoured ? 'refused' : view.provenance === 'committed' ? 'committed' : 'compiled';
      banner.className = `notice notice--${view.honoured ? 'info' : 'warn'} tn-prov tn-prov--${kind}`;
      banner.textContent = view.says;
      if (!view.honoured) return;
    }

    if (view.table.length) {
      const table = this.doc.createElement('table');
      table.className = 'tn-standings';
      table.innerHTML =
        '<thead><tr><th>Player</th><th class="num">Pts</th><th class="num">P</th>' +
        '<th class="num">W</th><th class="num">D</th><th class="num">L</th></tr></thead>';
      const tbody = this.doc.createElement('tbody');
      // WHO WON, AND ONLY WHEN THAT IS SETTLED.
      //
      // Three conditions, all of them necessary. Every game must have a result,
      // or the table is a running total and the leader is not a winner. Every
      // game must be VERIFIED, because an unverified pairing is not counted in
      // the standings at all and a crown would be awarded from an incomplete
      // table. And the place must be won outright: two players level on points
      // have not finished first and second, they have tied, and a crown handed
      // to whichever sorted higher would be inventing a result the games did
      // not produce.
      const games = (view.rounds ?? []).flatMap((round) => round.games);
      const settled =
        games.length > 0 &&
        games.every((g) => g.result !== null) &&
        games.every((g) => g.verdict === 'verified');
      const crownFor = (at: number): string | null => {
        if (!settled || at > 1) return null;
        const here = view.table[at];
        const next = view.table[at + 1];
        if (!here) return null;
        // Outright, or nothing. A shared place is not a place.
        if (next && next.points === here.points) return null;
        if (at === 1 && view.table[0]?.points === here.points) return null;
        return at === 0 ? '🥇' : '🥈';
      };

      for (const [place, row] of view.table.entries()) {
        const tr = this.doc.createElement('tr');
        const crown = crownFor(place);
        for (const [value, numeric] of [
          [this.tournamentName(t, row.name) + (crown ? ` ${crown}` : ''), false],
          [String(row.points), true], [String(row.played), true],
          [String(row.won), true], [String(row.drawn), true], [String(row.lost), true]
        ] as [string, boolean][]) {
          const td = this.doc.createElement('td');
          td.textContent = value;
          if (numeric) td.className = 'num';
          tr.appendChild(td);
        }

        // THE CHARACTER, WHEN THE MANIFEST NAMES ONE.
        //
        // `TournamentEntrant.entry` has always been in the format — "inscription
        // id of the entry that defines the character" — and nothing has ever
        // written it or shown it. So a tournament's players are six names, and
        // what those names actually DO is a file on the organiser's machine.
        //
        // This is a no-op today, because no manifest carries the field yet. It
        // is here because the board is about to become permanent and this is the
        // half that cannot be added afterwards: a future tournament can start
        // naming character inscriptions the moment it likes, but only a board
        // that already knows to look will ever show them.
        if (crown) {
          (tr.firstChild as HTMLElement | null)?.setAttribute(
            'title',
            crown === '🥇'
              ? 'Won this tournament: every game finished and verified'
              : 'Second: every game finished and verified'
          );
        }

        // THE HANDICAP, MARKED AS DECLARED.
        //
        // Every other thing on this row was recomputed: the points from
        // replayed games, the verdict from the committed rules hash. Depth
        // cannot be. It leaves no trace in a game log — characters deviate
        // from the engine by style, so the setting cannot be read back off the
        // moves — so it is the one number here that rests on the organiser's
        // word.
        //
        // Shown anyway, because a handicap nobody can see is worse than one
        // that is merely unproven, and shown with the distinction on its face
        // rather than in a footnote nobody reads.
        const depth = t.entrants.find((e) => e.name === row.name)?.depth ?? 0;
        if (depth > 0) {
          const mark = this.doc.createElement('span');
          mark.className = 'tn-depth';
          mark.textContent = ` +${depth}`;
          mark.title =
            `Declared, not verified: this seat searches ${depth} ply deeper than the house ` +
            'engine. The manifest says so and nothing on chain can confirm it.';
          tr.firstChild?.appendChild(mark);
        }

        const entry = t.entrants.find((e) => e.name === row.name)?.entry;
        if (typeof entry === 'number' && entry > 0) {
          const link = this.doc.createElement('a');
          link.className = 'tn-entry';
          link.href = `${INSCRIPTION_VIEWER}${entry}`;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'character';
          link.title = `Inscription ${entry}: what this player was told to do`;
          // Beside the name rather than in a column of its own, so a manifest
          // without entries does not leave an empty column explaining nothing.
          tr.firstChild?.appendChild(this.doc.createTextNode(' '));
          tr.firstChild?.appendChild(link);
        }
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      body.appendChild(table);
    } else if (!view.scored) {
      const waiting = this.doc.createElement('p');
      waiting.className = 'tn-live';
      waiting.textContent = 'Pairings checked. Replaying games to score them…';
      body.appendChild(waiting);
    }

    for (const round of view.rounds) {
      const section = this.doc.createElement('div');
      section.className = 'tn-round';
      const heading = this.doc.createElement('h3');
      heading.textContent = `Round ${round.number}`;
      section.appendChild(heading);

      const showing = round.games.filter((game) => this.tournamentShows(game));
      if (!showing.length) continue;
      for (const game of showing) {
        const row = this.doc.createElement('div');
        row.className = 'tn-game';
        row.dataset.game = String(game.id);

        const id = this.doc.createElement('span');
        id.className = 'tn-id';
        id.textContent = String(game.id);

        // THE PAIRING OPENS THE GAME. It is the obvious thing to click and it
        // names what you get, so it is a real button rather than a span with a
        // handler — a keyboard reaches it, a screen reader announces it, and
        // the browser's own focus ring applies.
        //
        // A game that is not on chain has nothing to open, so it stays a span.
        // A control that looks live and does nothing is worse than plain text.
        const pairing = `${game.whoWhite} v ${game.whoBlack}`;
        let who: HTMLElement;
        if (game.verdict === 'missing') {
          who = this.doc.createElement('span');
          who.textContent = pairing;
        } else {
          const open = this.doc.createElement('button');
          open.type = 'button';
          open.className = 'tn-open';
          open.textContent = pairing;
          open.setAttribute('aria-label', `${pairing} — open game ${game.id}`);
          open.addEventListener('click', () => {
            this.show('game');
            void this.load(game.id);
          });
          who = open;
        }

        const result = this.doc.createElement('span');
        result.className = 'tn-result';
        result.textContent = resultLabel(game);

        // A WORD, NOT ONLY A COLOUR. This is the thing a reader came to check,
        // and colour alone fails anyone who cannot separate these two hues.
        const mark = this.doc.createElement('span');
        mark.className = `tn-mark tn-mark--${game.verdict}`;
        mark.textContent = verdictLabel(game);
        if (game.says) mark.title = game.says;

        // HOW FAR ALONG, which is the question a finished result answers and a
        // game in progress does not. "In play" says nothing about whether it
        // started an hour ago or is about to end.
        //
        // Accepted moves, not submissions: the contract stores whatever it is
        // sent, and game 12 holds five copies of one move, each charged and
        // each skipped by replay. Counting those would report a game as further
        // along than it has actually been played.
        const moves = this.doc.createElement('span');
        moves.className = 'tn-moves';
        if (typeof game.moves === 'number') {
          moves.textContent = `${game.moves} move${game.moves === 1 ? '' : 's'}`;
          moves.title =
            'Moves replay accepted. A submission that did not count is stored on ' +
            'chain and charged for, and is not a move.';
        }

        // WHOSE MOVE, in the same word the Explore list uses. It is the same
        // fact, and a second wording would read as a second fact.
        // WHAT THIS GAME IS, when it is something. Placed before the players
        // because "Final" changes how the rest of the row reads.
        if (game.stage) {
          const stage = this.doc.createElement('span');
          stage.className = 'tn-stage';
          stage.textContent = game.stage;
          who.insertBefore(stage, who.firstChild);
          who.insertBefore(this.doc.createTextNode(' '), stage.nextSibling);
        }

        const mineNow =
          this.address && String(game.toMove ?? '').toUpperCase() === this.address.toUpperCase();
        if (mineNow) {
          const yours = this.doc.createElement('span');
          yours.className = 'tn-yours';
          yours.textContent = 'YOUR MOVE';
          yours.title = 'This game is waiting for you';
          who.appendChild(this.doc.createTextNode(' '));
          who.appendChild(yours);
        } else if (game.turn) {
          // WHAT A WATCHER CAME TO SEE. Most people reading a tournament are
          // neither player, and for them "in play" is the least interesting
          // true thing that could be said about a live game.
          const turn = this.doc.createElement('span');
          turn.className = 'tn-turn';
          turn.textContent = `${game.turn} to move`;
          who.appendChild(this.doc.createTextNode(' '));
          who.appendChild(turn);
        }

        row.append(id, who, moves, result, mark);
        section.appendChild(row);
      }
      body.appendChild(section);
    }
  }

  /**
   * Is this tournament played by people, by programs, or both?
   *
   * TWO SIGNALS, and neither is a guess. `kind` says so outright. Failing that,
   * an entrant with an `entry` is one whose play is defined by an inscribed
   * character sheet, which is a program by construction — nobody inscribes a
   * character to describe how a person moves.
   *
   * Anything else is UNKNOWN and stays unknown. The first two exhibitions name
   * no kinds and carry no entries, and they were played entirely by programs;
   * a board that read silence as "human" would state the opposite of the truth
   * about the only two tournaments that exist.
   */
  private tournamentKinds(t: Tournament): { ai: number; human: number; unknown: number } {
    const tally = { ai: 0, human: 0, unknown: 0 };
    for (const entrant of t.entrants) {
      if (entrant.kind === 'ai' || typeof entrant.entry === 'number') tally.ai++;
      else if (entrant.kind === 'human') tally.human++;
      else tally.unknown++;
    }
    return tally;
  }

  /**
   * Say who is playing, and what that means for whether anything happens.
   *
   * The warning is the point. An all-AI tournament is not self-playing: the
   * organiser has to be running the engine for a move to be made, and the
   * games stop dead when they stop. Somebody watching a board that says only
   * "still playing" has no way to tell that from an opponent who is thinking.
   */
  private drawTournamentField(t: Tournament): void {
    const node = this.el.tournamentField;
    node.replaceChildren();
    node.classList.add('hide');

    const { ai, human, unknown } = this.tournamentKinds(t);
    if (unknown === t.entrants.length) return; // Says nothing rather than guessing.

    node.classList.remove('hide');
    node.className = `notice ${ai ? 'notice--warn' : 'notice--info'}`;
    const loud = this.doc.createElement('b');
    loud.textContent =
      ai && !human
        ? 'Every entrant is a program.'
        : ai
          ? `${ai} of ${t.entrants.length} entrants are programs.`
          : 'Every entrant is a person.';
    node.appendChild(loud);
    node.appendChild(
      this.doc.createTextNode(
        ai
          ? ' These games only advance while the organiser is running the engine. ' +
            'A game that has not moved for a long time may be waiting on that rather ' +
            'than on a player.'
          : ' These games advance whenever a player moves.'
      )
    );
  }

  /** BNS if the address has one, else the manifest's name for that entrant. */
  private tournamentName(t: { entrants: Array<{ name: string; address: string }> }, entrant: string): string {
    const address = t.entrants.find((e) => e.name === entrant)?.address;
    return (address ? this.names?.peek(address) : null) ?? entrant;
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
    // Here because this is the one place `pending` is known to be current. The
    // note itself is cheap: it rebuilds only when your own pending move changes.
    this.drawFeeAdvice();
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
    // ABSENT, NOT EMPTY.
    //
    // Almost every game has no sponsorship, and a panel headed "Your
    // sponsorship" saying you have none is a paragraph about a feature the
    // reader is not using, on the screen they came to play chess on. Worse, the
    // button under it could not have worked: `top-up-sponsorship` unwraps an
    // existing row or fails with ERR-NO-SPONSORSHIP (clar:438), so on an
    // unsponsored game it was an offer the contract would have refused.
    //
    // An EXHAUSTED sponsorship still shows. It is not the same as never having
    // had one: somebody who has been playing for free is about to start paying,
    // and meeting that as a surprise fee is worse than a line of text.
    const show = (message: string | null): void => {
      this.el.sponsorshipPanel.classList.toggle('hide', message === null);
      if (message !== null) this.text('sponsorship', message);
    };

    if (!this.address || this.gameId === null) {
      show(null);
      return;
    }
    const key = `${this.gameId}|${this.address}`;
    if (this.sponsorshipText?.key === key) {
      show(this.sponsorshipText.message);
      return;
    }
    const say = (message: string): void => {
      this.sponsorshipText = { key, message };
      show(message);
    };
    try {
      const row = await this.readSponsorship(this.gameId, this.address);
      if (!row) {
        // Remembered as a message so the read is not repeated, and shown as
        // nothing at all.
        this.sponsorshipText = { key, message: '' };
        show(null);
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
    } catch {
      // NOT remembered: a failed read should be retried. Shown as nothing
      // rather than as an apology - a panel that appears only to say it could
      // not read something is noise on a game with no sponsorship, which is
      // almost all of them, and the next poll will say better.
      show(null);
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

  /**
   * Could the contract pay this player for this move?
   *
   * Only ever answered NO with confidence. `maybe-rebate` pays nothing without a
   * Sponsorships row for (game, sender) (clar:490), so a row this board has read
   * and found absent means no money can move - and the transaction can say so,
   * instead of declaring a 0.1 STX ceiling the wallet then reads out to a player
   * who is being charged nothing.
   *
   * Everything else is yes. Unread, unconnected, a different game: all unknown,
   * and unknown must keep the ceiling. The board knows the sponsorship of the
   * account named at CONNECT time and cannot know which account the wallet will
   * sign with, so a wrong no costs the fee of an aborted move.
   */
  private rebatePossible(): boolean {
    if (this.gameId === null || !this.address) return true;
    const key = `${this.gameId}|${this.address}`;
    if (this.sponsorship?.key !== key) return true;
    const row = this.sponsorship.row;
    return row !== null && !row.settled && row.rebatesLeft > 0n;
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
    if (this.gameId === null) return;
    this.pendingForced = { game: this.gameId, value };
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
      // Under a deny-mode post condition every transfer must be covered,
      // including every one the CONTRACT makes to anybody, and an uncovered
      // rebate aborts the whole transaction after the contract has already
      // succeeded - so the player pays the fee and the move does not count.
      //
      // There is NO PRE-SIGNING READ any more. The guard declares the protocol's
      // ceiling, so the board no longer needs to work out what this caller is
      // owed - and could not have known anyway, since the wallet chooses the
      // signer. The sponsorship read that used to be here is kept for the
      // on-screen panel and nothing else.
      const sent = await this.chain.submit!(game, value, {
        expectRebate: this.rebatePossible()
      });

      // Follow it. The board used to say "Sent" and never look again, so a
      // transaction that failed made the move VANISH off the board a poll or
      // two later with no explanation and no mention of the fee - because
      // settleIntent clears the ghost as soon as the value appears in the log
      // OR the mempool, and an aborted transaction reaches the mempool first.
      //
      // Not awaited: nothing downstream waits on a block.
      void this.watchSubmission(sent);

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

  /**
   * Report what became of a broadcast move, and only when something went wrong.
   *
   * Success says nothing: a board that congratulated somebody on every move
   * would be noise, and the reason this exists is the moment a fee is spent for
   * a move that did not count.
   */
  private async watchSubmission(sent: unknown): Promise<void> {
    const txid = (sent as { txid?: string | null } | null)?.txid;
    // A null or all-zero id is not a transaction to ask about. WriteResult.txid
    // is nullable by design, and the runtime emulator answers with zeroes.
    if (!realTxid(txid)) return;

    const endpoint = (this.chain as { reader?: Endpoint }).reader;
    if (!endpoint) return;

    // One at a time, so a fast player cannot start a queue of pollers against
    // an allowance the wallet also spends.
    if (this.watching) return;
    this.watching = true;
    const game = this.gameId;
    try {
      const outcome = await watchTx(endpoint, String(txid), {
        // ADR-0011 decision 4: nothing polls while a wallet dialog is open.
        shouldAsk: () => this.intent?.state !== 'signing'
      });
      // Do not report on a game the player has since left.
      if (this.gameId !== game) return;
      const say = describeOutcome(outcome);
      if (say) {
        this.notice('chainNotice', 'warn', say);
        this.sound.play('refused');
      }
    } finally {
      this.watching = false;
    }
  }

  private async connect(): Promise<void> {
    if (!this.options.connect) return;
    // Said BEFORE anything is awaited. Connecting means asking each provider in
    // turn, and a wallet that never answers is a real case - so without this the
    // board looks like it did not hear the click for as long as the probes take.
    this.notice('chainNotice', 'info', 'Asking your wallet. Approve it if a window opens.');
    await this.guard('connecting', async () => {
      const session = await this.options.connect!();
      if (!session) return false;
      this.address = session.address;
      this.el.connect.classList.add('hide');
      this.el.disconnect.classList.remove('hide');
      this.notice('chainNotice', 'good', `Connected as ${session.address}`);
      (this.el.profileWho as HTMLInputElement).value = session.address;
      this.viewerChanged();
      return true;
    });
  }

  private async disconnect(): Promise<void> {
    await this.options.disconnect?.();
    this.address = null;
    this.el.connect.classList.remove('hide');
    this.el.disconnect.classList.add('hide');
    this.notice('chainNotice', 'info', 'Disconnected.');
    this.viewerChanged();
  }

  /**
   * The connected wallet, said once and left there.
   *
   * Both the name and the address, because they answer different questions: the
   * name is the one a person recognises and the address is the one that has to
   * match what the rules say. Showing only the name would hide exactly the
   * detail that decides whether a move will be accepted.
   *
   * Redrawn when a BNS lookup lands, so a wallet that connects before its name
   * resolves does not stay as a bare address for the rest of the session.
   */
  private drawWhoami(): void {
    const address = this.address;
    this.el.whoami.classList.toggle('hide', !address);
    if (!address) {
      this.text('whoamiName', '');
      this.text('whoamiAddr', '');
      return;
    }
    const name = this.names?.peek(address) ?? null;
    this.text('whoamiName', name ?? 'Connected');
    this.text('whoamiAddr', address);
    this.el.whoamiAddr.setAttribute('title', address);
  }

  /**
   * Somebody else is asking now, so everything answered for a person is stale.
   *
   * Marking the game list stale is enough for somebody who arrives at that tab
   * LATER. It does nothing for somebody already looking at it — and that is the
   * ordinary case, because the reason you connect is usually that you opened
   * Explore, found none of your games, and reached for the wallet.
   *
   * What that left on screen was worse than an empty list. Every row carried
   * `mine: null`, so the games the viewer is actually in were advertised back to
   * them as an open seat, and the "Yours" filter matched nothing. Redrawing the
   * filters is not the same as rebuilding the rows: the button appears,
   * correctly, and then finds nothing.
   *
   * A row found by SEARCH goes with the rest. It was answered for the previous
   * viewer too, and a wrong badge on the one row somebody deliberately asked for
   * is the worst place to keep one.
   */
  private viewerChanged(): void {
    this.drawWhoami();
    // The name usually is not known yet at the moment of connecting, so ask and
    // redraw. Never blocking: the address is already on screen and the name is
    // an improvement to it, not a precondition for it.
    if (this.address && this.names) {
      void this.names.resolve(this.address).then(() => this.drawWhoami());
    }
    this.drawGame();
    this.exploreLoadedAt = null;
    if (this.tab === 'explore') void this.reloadExplore();

    // A different wallet has a different answer, and keeping the old one would
    // show one person another person's games.
    this.waitingOn.clear();
    this.warmedFor = null;
    this.drawWaiting();
    // Not awaited. Nothing on screen waits for it, and it must not delay the
    // address appearing in the top bar.
    if (this.address) void this.warmWaiting();
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
      this.exploreLoadedAt = count;
      this.exploreTotal = count;
      this.exploreBuiltAt = this.now();
      this.notice('chainNotice', 'info', `Reading ${this.chain.contractId}.`);

      // ONE read for the whole list, not one per row. Every row needs the same
      // number to say how long it has been quiet, and a failure here costs the
      // staleness column and nothing else - which is why it is caught rather
      // than allowed to take the list down with it.
      try {
        this.chainHeight = await this.chain.getHeight();
      } catch {
        this.chainHeight = null;
      }

      // Newest first, and bounded: an unbounded walk on a busy contract would
      // make the first paint arbitrarily slow.
      const first = Math.max(1, count - (EXPLORE_WINDOW - 1));
      const ids: number[] = [];
      for (let id = count; id >= first; id--) ids.push(id);

      // AND YOUR OWN, WHEREVER THEY ARE.
      //
      // The window is the newest twenty-five ids, which is a fact about the
      // list and not about anybody's games. A game drops off it as soon as
      // twenty-five newer ones are opened, so the longer a game runs the more
      // certain it is to disappear from the board of the player whose move it
      // is — and the board then said nothing rather than "your move", which is
      // the one thing a chess board must not get wrong.
      //
      // These come from `YourGames`: remembered in this browser, and discovered
      // from your own transaction history, since a move is a transaction you
      // sent. Read exactly like the window ids and replayed exactly the same
      // way, so the turn badge on a game from 2024 is derived from its log
      // rather than from anything remembered about it.
      this.yoursOutside = this.address
        ? (this.yours?.known(this.address) ?? []).filter((id) => id < first && id <= count)
        : [];
      ids.push(...this.yoursOutside);

      // A FEW AT A TIME, because the cost here is latency and not bandwidth.
      // Twenty-five games is fifty-one round trips, and one after another that
      // is about eight seconds at a realistic hundred and fifty milliseconds
      // each - which is the whole of why the list felt slow. Nothing about the
      // reads changes; only whether they wait for each other.
      //
      // Three, matching the name and block-time resolvers, and for the same
      // reason: the rate limit is per address and THE WALLET SPENDS FROM THE
      // SAME ALLOWANCE. A board that empties it in one burst is a board whose
      // player cannot then move.
      const built = await pool(
        EXPLORE_READ_WIDTH,
        ids.map((id) => () => this.buildExploreRow(id))
      );
      // pool preserves input order, so this is still newest-first before the
      // sort below - which is a stable sort and depends on that.
      const found = built.filter((row): row is ExploreRow => row !== null);

      this.noteWaiting(found);

      // REMEMBERED NOW, so it is still findable when it falls off the window.
      // `participant` is set by replay from rules that hash to the game's own
      // commitment, so this records something established rather than guessed —
      // and it is the half that survives the limit transaction history has: a
      // game you were NAMED in but have never moved in is invisible to
      // discovery, and this is the moment it stops needing to be discovered.
      if (this.address && this.yours) {
        for (const row of found) if (row.participant) this.yours.remember(this.address, row.id);
      }

      // Sorted for whoever is looking: games waiting on them, then seats they
      // could take, then the rest in the order the chain gave them. Stable, so
      // two games in the same class keep their newest-first order.
      this.exploreRows = this.sortForViewer(found);
      this.drawExplore();

      // Names for everyone on the list, in one go, then draw again if it
      // learned anything. No further chain reads.
      const players = found.flatMap((r) => [r.white, r.black]).filter((p): p is string => !!p);
      if (await (this.names?.resolveAll(players) ?? Promise.resolve(false))) this.drawExplore();

      // LAST, because it is the slowest part and the list is useful without it.
      // Everything above is remembered locally and paints with no lookup at all;
      // this is the round trip that finds a game this browser has never seen.
      await this.discoverYours(first, count);
      return true;
    });
  }

  /**
   * Games waiting on you first, then seats you could take, then the rest.
   *
   * Stable, so two rows in the same class keep the order they arrived in —
   * which is newest-first for the window, and is why this must not be a plain
   * comparator on id. A game found outside the window sorts by what it needs
   * from you, not by how old it is: a 2024 game where it is your move belongs
   * at the top, which is the entire reason it was fetched.
   */
  private sortForViewer(rows: readonly ExploreRow[]): ExploreRow[] {
    const rank = (row: ExploreRow): number =>
      row.mine === 'your-move' ? 0 : row.seat === 'open' ? 1 : 2;
    return rows
      .map((row, at) => ({ row, at }))
      .sort((a, b) => rank(a.row) - rank(b.row) || a.at - b.at)
      .map((entry) => entry.row);
  }

  /**
   * Ask the chain for games this browser has never seen.
   *
   * Only what is NEW is read. The remembered ids were already in the list
   * before this ran, so a returning player pays one page of history and no game
   * reads at all — and the common case of "nothing has changed" costs a single
   * request.
   *
   * A failure here is deliberately quiet. It leaves the list exactly as it was,
   * which is the whole list as far as this browser knows; saying "could not
   * reach the chain" over a list that is already correct would be alarming
   * about nothing.
   */
  private async discoverYours(first: number, count: number): Promise<void> {
    if (!this.address || !this.yours) return;

    let fresh: number[];
    try {
      const found = await this.yours.discover(this.address);
      this.yoursComplete = found.complete;
      fresh = found.fresh.filter((id) => id <= count && id < first);
    } catch {
      return;
    }
    if (!fresh.length) {
      if (!this.yoursComplete) this.drawExplore();
      return;
    }

    const built = (
      await pool(
        EXPLORE_READ_WIDTH,
        fresh.map((id) => () => this.buildExploreRow(id))
      )
    ).filter((row): row is ExploreRow => row !== null);
    if (!built.length) return;

    this.noteWaiting(built);
    this.yoursOutside = [...new Set([...this.yoursOutside, ...fresh])].sort((a, b) => b - a);
    this.exploreRows = this.sortForViewer([...this.exploreRows, ...built]);
    this.drawExplore();

    const players = built.flatMap((r) => [r.white, r.black]).filter((p): p is string => !!p);
    if (await (this.names?.resolveAll(players) ?? Promise.resolve(false))) this.drawExplore();
  }

  /**
   * The filter buttons, rebuilt whenever the list is drawn.
   *
   * Rebuilt rather than toggled because the SET changes: the two that ask about
   * "you" are absent entirely when nobody is connected. Showing them and
   * returning nothing would read as "you have no games" to somebody who simply
   * has not connected a wallet.
   */
  /**
   * Everything the list knows about one game.
   *
   * Lifted out of the loop so that SEARCH can reuse it verbatim rather than
   * growing a second, slightly different description of the same game - which
   * is how a row found by searching would quietly start disagreeing with the
   * same row found by scrolling.
   */
  /**
   * Who a game's sponsorship can be asked about.
   *
   * The named sides, and nobody else. `get-sponsorship` wants a principal, so
   * "anyone" and "anyone-else" are not questions the chain will take — and a
   * player who claimed an open seat by moving is deliberately NOT included:
   * finding them means reading every submission in the game, which is the walk
   * this whole list is built to avoid.
   */
  private sponsorable(row: ExploreRow): string[] {
    return [row.white, row.black].filter(
      (side): side is string => typeof side === 'string' && /^S[PMTN][0-9A-Z]{20,}$/i.test(side)
    );
  }

  /**
   * Ask the chain who is being paid for, once, when somebody asks to see it.
   *
   * NEVER on the list build. Every other filter reads a field the row already
   * carries and costs nothing; this one cannot, because the answer is only on
   * the chain. So it is spent by the person who pressed the button, once, and
   * cached — and the request-budget test asserts that pressing any OTHER filter
   * still costs zero.
   *
   * Bounded twice over: at most two principals a game, and at most
   * SPONSOR_LOOKUP_LIMIT games. Past that the list says what it did not ask
   * rather than quietly answering for a subset.
   */
  private async loadSponsorships(): Promise<void> {
    const pending = this.exploreRows.filter(
      (row) => row.sponsored === null && this.sponsorable(row).length > 0
    );
    if (!pending.length) return;

    const asking = pending.slice(0, ChessApp.SPONSOR_LOOKUP_LIMIT);
    this.sponsorLookedUp = true;
    await this.guard('reading sponsorships', async () => {
      await pool(
        3,
        asking.map((row) => async () => {
          const found = await Promise.all(
            this.sponsorable(row).map(async (who) => {
              const key = `${row.id}|${who.toUpperCase()}`;
              if (!this.sponsorSeen.has(key)) {
                const seat = await this.chain.getSponsorship(row.id, who);
                // Funded, not spent, and not yet reclaimed. A settled or
                // exhausted reserve pays for nothing, so calling it sponsored
                // would send somebody to a game expecting free moves.
                this.sponsorSeen.set(
                  key,
                  seat !== null && !seat.settled && seat.rebatesLeft > 0n
                );
              }
              return this.sponsorSeen.get(key) === true;
            })
          );
          row.sponsored = found.some(Boolean);
        })
      );
      this.drawExplore();
      return true;
    });
  }

  /** Rebuild the list from the chain, discarding any search result with it. */
  private async reloadExplore(): Promise<void> {
    this.exploreLoadedAt = null;
    this.exploreFound = null;
    this.text('exploreFound', '');
    await this.loadExplore();
  }

  /**
   * Find one game by number, including one the window does not reach.
   *
   * The list shows the newest twenty-five, and a player's game falls off that
   * window the moment twenty-five newer ones exist. A search that only searched
   * what was already on screen would be worse than no search: it would answer
   * "no such game" about a game that plainly exists.
   *
   * So exactly ONE direct lookup when the number is outside the window, and the
   * result says how it was found. One, and never a walk: the number of games is
   * unbounded and a search that scanned would be a way for anybody to make the
   * board spend its whole allowance.
   */
  private async findGame(): Promise<void> {
    const raw = String((this.el.exploreSearch as HTMLInputElement).value ?? '').trim();

    // Clearing the box puts the list back rather than leaving a stale result.
    if (!raw) {
      this.exploreFound = null;
      this.text('exploreFound', '');
      this.drawExplore();
      return;
    }

    const id = Number(raw);
    if (!Number.isInteger(id) || id < 1) {
      // Says what it accepts. Searching by player is a different question with a
      // different answer - the chain has no index of who has played what - and
      // pretending otherwise here would be the overclaim worth avoiding.
      this.exploreFound = null;
      this.text('exploreFound', 'Type a game number. Searching by player is not possible here.');
      this.drawExplore();
      return;
    }

    // Already on screen: no lookup at all.
    if (this.exploreRows.some((row) => row.id === id)) {
      this.exploreFound = null;
      this.exploreFilter = 'all';
      this.text('exploreFound', `Game ${id} is in the list below.`);
      this.drawExplore();
      this.highlightExplore(id);
      return;
    }

    await this.guard(`finding game ${id}`, async () => {
      const row = await this.buildExploreRow(id);
      if (!row) {
        this.exploreFound = null;
        this.text('exploreFound', `There is no game ${id} on this contract.`);
        this.drawExplore();
        return false;
      }
      this.exploreFound = row;

      // NAMES FOR A ROW THAT CAME IN THROUGH THE SIDE DOOR. `loadExplore`
      // resolves every player in the list it just built; this row was fetched
      // one at a time and was never in that list, so nothing had ever asked for
      // its name. Game 2 is `xtrata.btc` everywhere else on the board and a bare
      // principal here, which is how this was spotted — the same game reading
      // two different ways depending on how you arrived at it.
      //
      // Awaited before the draw rather than redrawn after, because there is
      // exactly one row and the lookup is one read.
      await this.names?.resolveAll([row.white, row.black].filter((who): who is string => Boolean(who)));

      // Say how it was found. A row that appeared from outside the window
      // without explanation reads as the window having silently changed.
      this.text('exploreFound', `Game ${id} is outside the newest ${EXPLORE_WINDOW}, fetched directly.`);
      this.exploreFilter = 'all';
      this.drawExplore();
      return true;
    });
  }

  /** Draw attention to a row already on screen. */
  private highlightExplore(id: number): void {
    const row = this.el.exploreRows.querySelector(`[data-game="${id}"]`);
    row?.classList.add('found');
  }

  private async buildExploreRow(id: number): Promise<ExploreRow | null> {
    const game = await this.chain.getGame(id);
    if (!game) return null;

    const row: ExploreRow = {
        id: game.id,
        ranked: game.ranked,
        entries: game.nextSeq,
        white: null,
        black: null,
        confirmed: false,
        state: game.nextSeq === 0 ? 'not started' : 'live',
        mine: null,
        seat: null,
        participant: false,
        sponsored: null,
        over: false,
        result: null,
        termination: null,
        quietFor: null
      };

      try {
        // Recovery runs for an EMPTY game too. A game with no submissions is
        // exactly the kind a stranger can walk up to - the only kind - and it
        // was the one kind the list refused to describe, because both this
        // and the remembered-rules lookup sat inside a "has entries" guard.
        // It costs no extra read: the entries are already fetched below.
        // BOUNDED, because a game's length is attacker-controlled: anybody
        // may submit to any game, and a thousand-entry game costs twenty
        // rate-limited round trips for ONE row of a summary.
        //
        // But a bound must not make the summary WRONG. Past the bound this
        // reads a single page - enough to recover the rules and name the
        // players, since recovery only looks at the first few distinct
        // senders - and then declines to state a position it has not seen all
        // of. Saying "97 moves, open it" is honest; replaying the first fifty
        // and announcing whose turn it is would not be.
        // A game with no entries is whole: there is nothing to have missed.
        const whole = game.nextSeq <= EXPLORE_ENTRY_LIMIT;
        const entries =
          game.nextSeq === 0
            ? []
            : whole
              // The game row is already read, so how many entries exist is
              // already known. A reader with a cache can use that to skip the
              // chain entirely for a game that has not moved since last time.
              ? await this.chain.getAllEntries(id, game.nextSeq)
              : (await this.chain.getPage(id, 0)).filter((e): e is EntryRow => e !== null);
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
        // ONLY WHEN CONFIRMED, and the bug this fixes was visible on screen.
        //
        // `recoverRules` returns DEFAULT_RULES when it cannot confirm anything -
        // an OPEN BOARD - so assigning them here published "anyone v anyone" as
        // the game's players, in the same row that went on to say "rules
        // unconfirmed". The row made two claims that contradict each other and
        // stated the guess as the confident one.
        //
        // It is not a cosmetic difference. A ranked game MUST name two different
        // players - `readyToOpen` refuses to open one otherwise and
        // `checkEligibility` refuses to rate one - so a row reading "anyone v
        // anyone · ranked" describes a game that cannot exist, and invites the
        // reader to conclude the rule is not being applied.
        //
        // The unconfirmed case is common and will get more so: recovery searches
        // the opener and whoever has SUBMITTED, so a game whose second player has
        // not moved yet cannot be confirmed by a stranger at all.
        row.white = rules.confirmed ? rules.rules.white : null;
        row.black = rules.confirmed ? rules.rules.black : null;
        row.confirmed = rules.confirmed;
        row.over = state.status === 'over';
        row.result = state.result;
        row.termination = state.termination;

        // How long nothing has happened. Read from the last entry that
        // actually landed, against a chain height fetched ONCE for the whole
        // list rather than per row.
        const last = entries.length ? entries[entries.length - 1].height : null;
        if (last !== null && this.chainHeight !== null && this.chainHeight > last) {
          row.quietFor = this.chainHeight - last;
        }
        row.state = !whole && game.nextSeq > 0
          ? `${game.nextSeq} submissions, open it to see`
          : state.status === 'over'
            ? `${state.result} ${state.termination}`
            : game.nextSeq === 0
              ? 'not started'
              : `${state.turn} to move`;

        // Are you in this game? Asked of the rules and the record, never of the
        // turn — so it still answers while the other player is thinking, and it
        // still answers after the game is over.
        //
        // NOT GATED ON THE RULES, for the half that does not depend on them.
        // Whether the rules NAME you is only meaningful once they are confirmed,
        // because an unconfirmed guess must never put your address on a game.
        // Whether you SUBMITTED to it is a different kind of fact: it is in the
        // log, you signed it, and no recovery is involved.
        //
        // Sharing one guard hid a game whose rules could not be recovered from
        // the player who had demonstrably moved in it — the "Yours" filter
        // dropped a game they had played, which is exactly the disappearance
        // this whole change is about.
        if (whole && this.address) {
          const me = this.address.toUpperCase();
          const named = rules.confirmed && (rules.rules.white === me || rules.rules.black === me);
          const moved = state.accepted.some(
            (entry) => String(entry.sender ?? '').toUpperCase() === me
          );
          row.participant = named || moved;
        }

        // Only for a game whose rules this board can actually confirm, and
        // only while it is still live. replay reports a turn for a FINISHED
        // game too, so without the status check every game somebody happened
        // to hold the side-to-move in would claim to be waiting for them.
        // No badge from a partial replay. Whose turn it is depends on every
        // move, so a board that has seen fifty of ninety cannot say.
        if (whole && rules.confirmed && state.status !== 'over') {
          if (this.address) {
            const yours = checkSender(rules.rules, {
              sender: this.address,
              turn: state.turn,
              history: state.accepted
            }) === null;
            const theirs = checkSender(rules.rules, {
              sender: this.address,
              turn: state.turn === 'white' ? 'black' : 'white',
              history: state.accepted
            }) === null;
            row.mine = yours ? 'your-move' : theirs ? 'waiting' : null;
          }
          // A seat nobody has claimed: the side to move admits anyone.
          const anyone = checkSender(rules.rules, {
            // Somebody with no history here at all. If the side to move
            // admits them, the seat is genuinely unclaimed.
            sender: STRANGER,
            turn: state.turn,
            history: state.accepted
          }) === null;
          // Not `mine === null`. Whether a seat is free TO YOU is about whether
          // you are already in the game, and `mine` goes null the moment a
          // cooldown or a no-two-in-a-row rule stops you moving - at which point
          // your own game would be advertised back to you as an empty chair.
          if (anyone && !row.participant) row.seat = 'open';
        }
      } catch {
        // A row that will not replay is still a row. Saying less about it
        // beats dropping the game out of the list.
      }
    return row;
  }

  private drawExploreFilters(): void {
    const node = this.el.exploreFilters;
    node.replaceChildren();

    const options: [ExploreFilter, string][] = [
      ['all', 'All'],
      ...(this.address
        ? ([
            ['your-move', 'Your move'],
            ['mine', 'Yours']
          ] as [ExploreFilter, string][])
        : []),
      ['open', 'Open seat'],
      ['live', 'Live'],
      ['over', 'Finished'],
      ['ranked', 'Ranked'],
      ['sponsored', 'Sponsored']
    ];

    // A filter that is no longer offered must not keep filtering. Disconnecting
    // while on "Your move" would otherwise leave an empty list and no visible
    // reason for it.
    if (!options.some(([key]) => key === this.exploreFilter)) this.exploreFilter = 'all';

    for (const [key, label] of options) {
      const button = this.doc.createElement('button');
      button.type = 'button';
      button.className = 'action';
      button.textContent = label;
      button.dataset.filter = key;
      button.setAttribute('aria-pressed', String(this.exploreFilter === key));
      button.addEventListener('click', () => {
        this.exploreFilter = key;
        this.drawExplore();
        // The one filter whose answer is not already on the row. Asked when it
        // is asked for, and only then.
        if (key === 'sponsored') void this.loadSponsorships();
      });
      node.appendChild(button);
    }
  }

  /**
   * How many games are waiting on you, beside the tab name.
   *
   * The row badge only tells somebody who is already looking at the list, and
   * the title flash only covers the game currently open — so a player whose
   * turn came up in an older game had to go looking to find out. That is the
   * failure the window made permanent: the game fell off the list, and nothing
   * anywhere said it was your move.
   *
   * Counted from replayed rows, so it means "this board has confirmed the rules
   * of this game and derived that it is your turn", never a guess. It cannot
   * count a game this browser has never seen, which is the same limit the list
   * has and is stated there rather than implied by a number.
   */
  /**
   * Record what these rows say about whose turn it is.
   *
   * One writer for the badge, whichever pass built the row, so the number
   * cannot depend on the route. Removal matters as much as addition: a game
   * that WAS waiting on you and no longer is must leave the set, or the count
   * only ever climbs.
   */
  private noteWaiting(rows: readonly ExploreRow[]): void {
    for (const row of rows) {
      if (row.mine === 'your-move') this.waitingOn.add(row.id);
      else this.waitingOn.delete(row.id);
      // A finished game of yours never needs reading again. This is what keeps
      // the background check below cheap for somebody with a long history.
      if (row.over && row.participant && this.address) this.yours?.markFinished(this.address, row.id);
    }
  }

  /**
   * Find out what is waiting on you, without being asked to.
   *
   * THE BADGE USED TO REQUIRE OPENING THE TAB IT WAS ON. Which is a strange
   * thing for a notification to ask: you had to go and look at the list to be
   * told there was a reason to look at the list.
   *
   * The reason it was left that way was cost — the list is twenty-five games
   * and fifty-odd reads, and spending that on connect is what starves a wallet
   * of its own rate limit right as somebody wants to move. But the badge never
   * needed the list. It needs YOUR games, which is a different and much smaller
   * question: `YourGames` holds them locally, `finished` removes the ones that
   * can never change again, and what is left is usually one or two.
   *
   * So this reads your live games and nothing else. A returning player with
   * sixty games and two in progress pays for two.
   */
  private async warmWaiting(): Promise<void> {
    const who = this.address;
    if (!who || !this.yours || this.warmedFor === who) return;
    this.warmedFor = who;

    try {
      // Local first, so a returning player's badge is right before any request
      // goes out. Then history, which finds games this browser has never seen.
      let live = this.yours.live(who);
      await this.readWaiting(live);
      const found = await this.yours.discover(who);
      this.yoursComplete = found.complete;
      const done = this.yours.finished(who);
      const extra = found.fresh.filter((id) => !done.has(id) && !live.includes(id));
      if (extra.length) await this.readWaiting(extra);
    } catch {
      // A background check that fails changes nothing on screen. The badge
      // keeps whatever it had, which for a returning player is still right.
      this.warmedFor = null;
    }
  }

  /** Read these games, derive whose turn it is, and update the badge. */
  private async readWaiting(ids: readonly number[]): Promise<void> {
    if (!ids.length) return;
    const built = (
      await pool(
        EXPLORE_READ_WIDTH,
        [...ids].map((id) => () => this.buildExploreRow(id))
      )
    ).filter((row): row is ExploreRow => row !== null);
    this.noteWaiting(built);
    this.drawWaiting();
  }

  /**
   * What the open game says about whose turn it is, at no cost.
   *
   * The poll has already read this game and replayed it, so the badge can be
   * kept honest from state that is in hand. Without it, making the last move of
   * a game left the count sitting at one until something else happened to
   * rebuild it — the board knew the game was over and the number said otherwise.
   *
   * Uses `judgeMove`, which is the same verdict the board uses to decide
   * whether to enable the squares, so the badge cannot disagree with the board
   * it sits above.
   */
  private noteOpenGame(): void {
    const id = this.gameId;
    const state = this.state;
    if (id === null || !state || !this.address) return;

    const before = this.waitingOn.size;
    const over = state.status === 'over';
    const mine = !over && judgeMove(this.eligibility(state)).tier === 'yes';

    if (over) {
      this.waitingOn.delete(id);
      // Over is forever, so this game need never be read again.
      if (this.rulesConfirmed) this.yours?.markFinished(this.address, id);
    } else if (mine) {
      this.waitingOn.add(id);
      this.yours?.remember(this.address, id);
    } else {
      this.waitingOn.delete(id);
    }
    if (this.waitingOn.size !== before) this.drawWaiting();

    // AND THE ROW SAYING THE SAME THING, which is the half this missed.
    //
    // The count beside the tab and the "your move" badge on the row are two
    // renderings of one fact, and only the count was being kept up. So making a
    // move cleared the number and left the badge sitting on the row underneath
    // it — the board contradicting itself on one screen, which is worse than
    // either being stale alone.
    //
    // The row is a snapshot taken when the list was built; the poll has just
    // re-read and replayed this game, so the fresh answer is already in hand and
    // costs nothing. Redrawn only when it actually changed, because the poll
    // runs every few seconds and the list is not cheap to paint.
    const row = this.exploreRows.find((candidate) => candidate.id === id);
    if (!row) return;
    const was = `${row.mine}|${row.over}|${row.result}`;
    row.mine = mine ? 'your-move' : over ? null : row.mine === 'your-move' ? 'waiting' : row.mine;
    row.over = over;
    if (over) {
      row.result = state.result;
      row.termination = state.termination;
      row.seat = null;
    }
    if (`${row.mine}|${row.over}|${row.result}` !== was) this.drawExplore();
  }

  /**
   * Re-read the games that are NOT on screen, occasionally.
   *
   * Occasionally rather than every tick because the poll runs every few seconds
   * and these are whole extra games — the open one is free, these are not. A
   * minute is far inside the time anybody would notice, and a move made
   * elsewhere took a block to confirm anyway.
   *
   * Only live games, so a long history costs nothing: `finished` has already
   * removed everything that can never change again.
   */
  private async recheckWaiting(): Promise<void> {
    if (!this.address || !this.yours) return;
    // A hidden tab does not need a badge it cannot show, and this is spending
    // somebody's rate limit on a page nobody is looking at.
    if (this.doc.visibilityState === 'hidden') return;
    if (this.now() - this.waitingCheckedAt < WAITING_RECHECK_MS) return;
    this.waitingCheckedAt = this.now();

    const ids = this.yours.live(this.address).filter((id) => id !== this.gameId);
    if (!ids.length) return;
    try {
      await this.readWaiting(ids);
    } catch {
      // Keeps whatever the badge had. A failed re-check is not news.
    }
  }

  private drawWaiting(): void {
    const node = this.el.exploreWaiting;
    const waiting = this.waitingOn.size;
    node.textContent = waiting ? String(waiting) : '';
    node.classList.toggle('hide', waiting === 0);
    node.setAttribute(
      'title',
      waiting === 1 ? '1 game is waiting for your move' : `${waiting} games are waiting for your move`
    );
  }

  private drawExplore(): void {
    this.drawExploreFilters();
    this.drawWaiting();
    const rows = this.el.exploreRows;
    rows.replaceChildren();

    // A row fetched by number sits ABOVE the window rather than inside it, and
    // is never filtered away: somebody who asked for game 4 by name should not
    // have it hidden because the current filter is "Live".
    const found = this.exploreFound;
    const showing = this.exploreRows.filter((row) => matchesFilter(row, this.exploreFilter));

    // One writer for this line, in both directions. Written only under the
    // filter branch, switching back to All would leave the filtered sentence
    // behind and the list would look permanently narrowed.
    if (this.exploreFilter === 'all') {
      // Both facts matter: the window is real, so a player's game can fall off
      // it, and the order depends on who is looking.
      const outside = this.yoursOutside.length;
      this.text(
        'exploreCount',
        `${this.exploreTotal} game${this.exploreTotal === 1 ? '' : 's'} on this contract` +
          (this.exploreTotal > EXPLORE_WINDOW ? `, newest ${EXPLORE_WINDOW} shown` : '') +
          // Said because the count above stops being the whole story: the list
          // is no longer "the newest twenty-five" once your own older games are
          // in it, and a reader counting rows would otherwise find more than
          // the sentence admits to.
          (outside ? `, plus ${outside} of yours from further back` : '') +
          (this.address ? ', yours first' : '')
      );
    } else if (this.exploreFilter === 'sponsored') {
      // This one has a third answer and has to say so. A game whose sides are
      // "anyone" cannot be asked about at all, and a list that quietly dropped
      // those would be reporting "not sponsored" for games it never asked.
      const unasked = this.exploreRows.filter((row) => row.sponsored === null).length;
      this.text(
        'exploreCount',
        !this.sponsorLookedUp
          ? 'Asking the chain who is being paid for.'
          : `${showing.length} sponsored, of ${this.exploreRows.length} shown` +
            (unasked
              ? `. ${unasked} could not be asked: a game open to anyone names nobody to ask about.`
              : '.')
      );
    } else {
      // Say when a filter is hiding things, and say it in terms of the filter.
      // A list that silently shortened would read as games having disappeared.
      // WHAT THE FILTER SEARCHED, not just what it found. "Yours" over the
      // newest twenty-five and "Yours" over every game you have ever played are
      // different questions with the same answer shape, and somebody who has
      // played eighty games needs to know which one they are looking at.
      const mine = this.exploreFilter === 'mine' || this.exploreFilter === 'your-move';
      const reach = !mine
        ? ''
        : this.yoursComplete
          ? ' Every game this browser can find is included, however old.'
          : ' Older games may be missing: the search stopped before the end of your history.';
      this.text(
        'exploreCount',
        (showing.length === 0
          ? `No games match that filter, out of ${this.exploreRows.length} shown.`
          : `${showing.length} of ${this.exploreRows.length} shown.`) + reach
      );
    }

    for (const row of found ? [found, ...showing.filter((r) => r.id !== found.id)] : showing) {
      const tr = this.doc.createElement('tr');
      tr.dataset.game = String(row.id);
      if (found && row.id === found.id) tr.classList.add('found');
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
        // Three different silences, and they are not interchangeable. "anyone"
        // is a fact about a game whose open rules this board CONFIRMED. The
        // other two are admissions that it does not know, and printing a rule
        // set in place of one is how the row came to contradict itself.
        players.appendChild(
          text(!row.confirmed ? 'not yet known' : row.entries === 0 ? 'not yet known' : 'anyone', 'muted')
        );
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

      // EVENT. The board can only know about tournaments it has loaded, so this
      // either says something or says nothing — it never says "not in a
      // tournament", because no manifest naming a game is not evidence that
      // none exists. The index points one way only: a manifest names its games,
      // a game names no manifest, and nothing on chain closes that loop.
      const event = this.inTournament.get(row.id);
      if (event) {
        const open = this.doc.createElement('button');
        open.type = 'button';
        open.className = 'tn-open';
        open.textContent = event.name;
        open.setAttribute('aria-label', `${event.name} — open this tournament`);
        open.addEventListener('click', () => {
          (this.el.tournamentId as HTMLInputElement).value = String(event.id);
          this.show('tournaments');
          void this.loadTournamentTab();
        });
        cell(open);
      } else {
        cell(text('', 'muted'));
      }

      cell(text(String(row.entries)));

      // The answer the list already computed and used to throw away: whether
      // this game is waiting for YOU. A correspondence player with four games
      // had to open all four to find out where they owed a move.
      const state = this.doc.createElement('span');
      if (row.over && row.result) {
        // A FINISHED GAME SHOULD NOT READ LIKE A LIVE ONE. "1-0 checkmate" sat
        // in the same weight and colour as "white to move", so a game that had
        // been over for days looked like one waiting for somebody.
        //
        // Three signals rather than one, because any single one can be missed:
        // the score as a badge, the winner BY NAME, and the row itself tinted.
        // The button says Review, since Open on a finished game promises
        // something to do.
        const score =
          row.result === '1/2-1/2' ? '\u00bd\u2013\u00bd' : row.result.replace('-', '\u2013');
        state.appendChild(text(score, 'badge badge--over'));
        state.appendChild(text(' ', ''));

        // THREE CASES, NOT TWO. A decisive result whose winner cannot be NAMED
        // is not a draw, and this printed one as "0-1 drawn by checkmate" - a
        // row contradicting itself in six words.
        //
        // The cause was a fix earlier the same day: `white` and `black` stopped
        // being published for a game whose rules this board could not confirm,
        // which is right, and this branch read "no name" as "no winner". The
        // colour is never in doubt - it is in the result - so an unconfirmed
        // game says which SIDE won and declines only to name them.
        const by = row.termination ? ` by ${row.termination}` : '';
        if (row.result === '1/2-1/2') {
          state.appendChild(text(`drawn${by}`, 'muted'));
        } else {
          const side = row.result === '1-0' ? 'white' : 'black';
          const winner = side === 'white' ? row.white : row.black;
          if (winner) {
            state.appendChild(this.addressNode(winner));
            state.appendChild(text(` won${by}`, 'muted'));
          } else {
            state.appendChild(text(`${side} won${by}`, 'muted'));
          }
        }
        tr.classList.add('over');
      } else {
        if (row.mine === 'your-move') {
          state.appendChild(text('Your move', 'badge badge--turn'));
          state.appendChild(text(' ', ''));
        } else if (row.seat === 'open') {
          state.appendChild(text('Open seat', 'badge'));
          state.appendChild(text(' ', ''));
        }
        state.appendChild(text(row.state));

        // NOT A FORFEIT, AND IT MUST NOT PRETEND TO BE ONE.
        //
        // The contract has no resignation by absence and no clock: a game
        // nobody has touched for a year is, on chain, live and waiting for a
        // move anybody may still play. So a runner that gave up, a player who
        // walked away, and a player thinking hard are the same state here, and
        // the board cannot tell them apart because the difference is not
        // recorded anywhere.
        //
        // What IS recorded is when the last submission landed. Saying how long
        // ago that was is a fact; calling it abandoned would be a guess wearing
        // a badge. The reader can draw the conclusion the board is not entitled
        // to.
        if (row.quietFor !== null && row.quietFor >= QUIET_BLOCKS) {
          state.appendChild(text(' · ', 'muted'));
          state.appendChild(
            text(`quiet for ${describeBlocks(row.quietFor)}`, 'badge badge--quiet')
          );
          tr.classList.add('quiet');
        }
      }
      cell(state);

      const open = this.doc.createElement('button');
      open.className = 'action';
      open.textContent = row.over ? 'Review' : 'Open';
      open.addEventListener('click', () => {
        this.show('game');
        void this.load(row.id);
      });
      cell(open);

      rows.appendChild(tr);
    }
  }

  /**
   * Where the rating walk may start, given what has been published.
   *
   * Returns 0 — the whole walk, exactly as before — unless a checkpoint exists,
   * is about THIS contract, and is not ahead of the chain. Both of those are
   * cheap to check and both are ways a well-formed document can still be about
   * something else.
   *
   * Asked once per session. A checkpoint is an inscription, so it cannot change;
   * only a NEWER one can appear, and that is worth a page load.
   */
  private async checkpointStart(rankedCount: number): Promise<number> {
    if (!this.checkpointAsked && this.checkpoints) {
      this.checkpointAsked = true;
      try {
        const found = await this.checkpoints.list();
        // Newest first, and the first that this board may actually use. A
        // checkpoint for another contract is not an error, it is somebody
        // else's, so it is skipped rather than complained about.
        for (const entry of found) {
          // MINTED BY THE AUTHORITY, not merely sitting in its wallet. Anybody
          // may send an inscription to any address, and everywhere else on this
          // board that is handled by saying who minted it and letting the
          // reader judge. Not here: a checkpoint is believed rather than
          // checked, so a document that only ARRIVED at the right wallet is
          // refused outright and the full walk happens instead.
          if (!entry.official) continue;
          if (usable(entry.manifest, this.chain.contractId, rankedCount).ok) {
            this.checkpoint = { id: entry.id, official: true, it: entry.manifest };
            break;
          }
        }
      } catch {
        // No checkpoint means the full walk, which is what this board did for
        // its whole life before now. Slower, never wrong.
        this.checkpointAsked = false;
      }
    }
    return this.checkpoint?.it.rankedIndex ?? 0;
  }

  /** The table a checkpoint starts everybody from, as rated games cannot be. */
  private checkpointSeed(): RatedGame[] {
    const it = this.checkpoint?.it;
    if (!it) return [];
    // REPLAYED AS GAMES, not spliced in as ratings. `computeRatings` is the only
    // thing that knows how a rating is made, and handing it the same shape it
    // always gets means a checkpoint cannot introduce a second way of counting.
    return it.games.map((game) => ({
      game: game.id,
      white: game.white,
      black: game.black,
      result: game.result,
      terminalHeight: it.block
    }));
  }

  async loadLeaderboard(): Promise<void> {
    // Before the walk, because every row's rules recovery consults them.
    await this.ensureManifestPairings();
    await this.guard('computing ratings', async () => {
      const count = await this.chain.getRankedCount();
      let unfinished = 0;
      let unidentified = 0;
      let ineligible = 0;
      const ineligibleWhy = new Set<string>();

      // ONE GAME AT A TIME, FOREVER, was what this did: three round trips each,
      // sequentially, with no window at all. Nine games is fine. A hundred is
      // about three hundred sequential reads and roughly forty-five seconds, and
      // it grows for the life of the contract - not a thing that gets slowly
      // worse, a thing that stops working.
      //
      // Three at a time, the same width as the explorer and the resolvers, and
      // for the same reason: the rate limit is per address and the wallet spends
      // from it too.
      //
      // The reads themselves are now mostly avoidable rather than merely
      // parallel. `getRankedGame` is a position in an append-only index, cached
      // forever; the entries of a game are immutable and cached; and passing
      // `nextSeq` lets a whole cached log be recognised without asking. What is
      // left on a return visit is one game row each, which is the only part that
      // can have changed.
      //
      // NOTHING DERIVED IS CACHED, unless somebody has published the derivation
      // and this reader has chosen to continue from it.
      //
      // That rule was written when this contract had nine ranked games. It has
      // thirty-eight, and the walk grows for the life of the contract — so the
      // choice is not between recomputing and caching, it is between a board
      // that recomputes and a board people wait for.
      //
      // A checkpoint does not repeal the rule; it makes obeying it OPTIONAL and
      // says so on screen. Everything after `from` is replayed here exactly as
      // before. Everything before it is a claim, labelled as one, with the full
      // walk one button away. See packages/protocol/checkpoint.ts.
      const from = this.verifyEverything ? 0 : await this.checkpointStart(count);

      const judged = await pool(
        LEADERBOARD_READ_WIDTH,
        Array.from({ length: count - from }, (_, at) => async (): Promise<RatedGame | null> => {
          const index = from + at;
          const id = await this.chain.getRankedGame(index);
          if (id === null) return null;
          const row = await this.chain.getGame(id);
          if (!row) return null;

          const entries = await this.chain.getAllEntries(id, row.nextSeq);
          const recovered = this.rulesForRanked(row, entries);
          const state = replay(
            entries.map((e) => ({ mv: e.value, sender: e.sender, seq: e.seq, height: e.height })),
            { rules: recovered }
          );
          const check = checkEligibility(row, state.rules, state);
          if (!check.eligible || state.result === null) {
            // COUNTED BY REASON, because they are not the same thing and the
            // single number said they were. "5 candidates failing verification"
            // covered two games whose players could not be identified and three
            // that are simply still being played — and reported both as though
            // the board had tried to check something and failed. A game in
            // progress has not failed anything; it has not finished.
            //
            // Worth separating because they lead somewhere different. Unfinished
            // resolves itself when somebody moves. Unidentified never resolves,
            // because the missing player never submitted and nothing on chain
            // will ever say who they were.
            //
            // CLASSIFIED FROM THE REASONS, not re-derived. `checkEligibility`
            // has already worked out exactly what is wrong and returns a list;
            // asking a second time — as a first attempt here did — both repeats
            // the work and invents a second opinion that can disagree with the
            // first. It also gets `no-result` wrong, because an unfinished game
            // is ALREADY ineligible for that reason, so "eligible but no result"
            // is a state that never occurs.
            const why = check.reasons;
            if (why.some((r) => IDENTITY_REASONS.has(r))) unidentified++;
            else if (why.length === 1 && why[0] === 'no-result') unfinished++;
            else {
              ineligible++;
              for (const reason of why) ineligibleWhy.add(describeIneligibility(reason));
            }
            return null;
          }
          const terminal = state.accepted.find((e) => e.seq === state.terminalSequence);
          return {
            game: id,
            white: check.white!,
            black: check.black!,
            result: state.result,
            terminalHeight: terminal?.height ?? row.openedAt
          };
        })
      );

      // In index order, which pool preserves. Elo is PATH DEPENDENT: the same
      // games in another order give different ratings, so the order this arrives
      // in is part of the answer rather than a presentation detail.
      const walked: RatedGame[] = judged.filter((game): game is RatedGame => game !== null);

      // ORDER IS PART OF THE ANSWER. Elo is path dependent, so the checkpoint's
      // games go first and in the order it listed them, and the walk's follow.
      const rated: RatedGame[] = [...this.checkpointSeed(), ...walked];

      const table = computeRatings(rated);
      const rows = leaderboard(table);

      // NAMES, WHICH THIS TAB NEVER ASKED FOR. Every row is drawn with
      // `addressNode`, which reads `Names.peek` — a cache lookup and nothing
      // more. Explore fills that cache for its own list and the game view fills
      // it for the players in one game, so a name appeared on the leaderboard
      // only if some other tab had already fetched it. Opening the leaderboard
      // first showed principals for everybody, permanently.
      //
      // Awaited before the rows are built rather than redrawn afterwards: this
      // function has already made several reads per game, so one resolution
      // round is cheap next to them, and it means the first paint is right.
      // Resolution failing is not an error here — `who()` falls back to the
      // principal, which is the truth anyway.
      await this.names?.resolveAll(rows.map((row) => row.principal));

      const seeded = this.checkpoint;
      // Offered only when a claim is actually being relied on. A board doing the
      // whole walk has nothing to verify against.
      this.el.leaderboardVerify.classList.toggle(
        'hide',
        !seeded || this.verifyEverything
      );
      const aside: string[] = [];
      if (unfinished) aside.push(`${unfinished} still being played`);
      if (unidentified) aside.push(
        `${unidentified} whose players cannot be identified from the chain`
      );
      if (ineligible) {
        // NAMED, not just counted. "3 not eligible" invites the reader to
        // assume the board is hiding something; the reasons are computed
        // already and are the interesting part.
        aside.push(`${ineligible} not eligible (${[...ineligibleWhy].join('; ')})`);
      }

      this.notice(
        'leaderboardNote',
        'info',
        `Derived from ${rated.length} verified ranked game${rated.length === 1 ? '' : 's'}` +
          (aside.length ? `. Not counted: ${aside.join(', ')}.` : '.') +
          (seeded && !this.verifyEverything
            ? ` ${checkpointNote(seeded.it, seeded.id)}`
            : ' Nothing here is stored; it is recomputed from the chain each time.')
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
  /** A manifest's pairings as addresses, for anything that needs a candidate. */
  private rememberPairings(tournament: Tournament): void {
    const addressOfName = new Map(tournament.entrants.map((e) => [e.name, e.address]));
    this.knownCooldowns.add(tournament.cooldown ?? 0);
    for (const entrant of tournament.entrants) this.knownEntrants.add(entrant.address.toUpperCase());
    for (const game of tournament.games) {
      const white = addressOfName.get(game.white);
      const black = addressOfName.get(game.black);
      if (white && black) {
        this.manifestPairings.set(game.id, { white, black, cooldown: tournament.cooldown ?? 0 });
      }
    }
  }

  /**
   * Pairings without the tab.
   *
   * The Leaderboard was the tab reporting failures and the Tournaments tab was
   * the one holding the answer, so whether verification succeeded depended on
   * WHICH TAB YOU HAPPENED TO OPEN FIRST — the same games, the same chain, two
   * different verdicts. That is not a gap in what is knowable, it is a gap in
   * plumbing, and the fix is to stop making the reader do the plumbing.
   *
   * Only the manifest is read, not the verification pass the tab runs. Nothing
   * here is trusted: a pairing is a candidate, and `rulesForRanked` still
   * requires it to reproduce the game's own committed hash. So the cheap read
   * is enough, and a manifest that lies changes nothing.
   */
  private manifestPairingsAsked = false;
  private async ensureManifestPairings(): Promise<void> {
    if (this.manifestPairingsAsked || !this.xtrata) return;
    this.manifestPairingsAsked = true;
    try {
      const text = await this.xtrata.text(DEFAULT_TOURNAMENT);
      const parsed = text === null ? null : parseTournament(text);
      if (parsed?.ok && parsed.tournament) this.rememberPairings(parsed.tournament);
    } catch {
      // Asked and could not reach it. Allowed to try again rather than being
      // remembered as "this tournament has no pairings" — the same distinction
      // PlayerNames draws between a failed lookup and a real absence.
      this.manifestPairingsAsked = false;
    }
  }

  private rulesForRanked(row: GameRow, entries: readonly EntryRow[]): Rules {
    // A MANIFEST SUPPLIES THE CANDIDATE RECOVERY CANNOT GUESS.
    //
    // `recoverRules` searches the opener and whoever has submitted, which fails
    // whenever neither is a player or the log is short — and that is why the
    // Leaderboard reported "5 candidates failing verification" while the
    // Tournaments tab verified all twenty-one of the same games. The tab was not
    // doing something cleverer; it had a candidate to test.
    //
    // This is NOT trusting the manifest. A candidate is proposed and the rules
    // hash either reproduces it or it does not, exactly as before. All the
    // manifest does is supply a guess worth checking, which is the one thing
    // recovery could not do for itself.
    const claimed = this.manifestPairings.get(row.id);
    const fromManifest = claimed
      ? normaliseRules({
          ...DEFAULT_RULES,
          white: claimed.white,
          black: claimed.black,
          ranked: true,
          cooldown: claimed.cooldown
        })
      : null;

    // AND THE ENTRANTS, FOR THE GAMES NO MANIFEST NAMES.
    //
    // The five games still failing were round one, played before there was a
    // manifest, so the exact pairing above finds nothing for them. What they
    // have in common is a player who never submitted — a forfeit, an abort —
    // and recovery builds its pair space from whoever HAS submitted, so the
    // absent side is missing from the search entirely. The game is
    // unrecoverable not because the answer is unknowable but because the one
    // address that would settle it never appeared on chain.
    //
    // A manifest names those addresses. Trying every ordered pair of known
    // entrants offers the missing side back to a search that could not reach
    // it. Thirty pairs for six entrants, all local hashing, no reads.
    //
    // Still not trust. Every pair is a guess and the committed hash is the
    // judge, so offering a wrong pair costs one hash and confirms nothing.
    const pairs: Rules[] = [];
    const entrants = [...this.knownEntrants];
    // Bounded because it is quadratic and `recoverRules` has a hard candidate
    // cap it would otherwise eat before reaching its own search.
    if (entrants.length <= MAX_PAIRED_ENTRANTS) {
      for (const white of entrants) {
        for (const black of entrants) {
          if (white === black) continue;
          // At every cooldown a manifest has declared, because a pairing whose
          // tournament varied its rules hashes to none of the default ones.
          for (const cooldown of this.knownCooldowns) {
            pairs.push(normaliseRules({ ...DEFAULT_RULES, white, black, ranked: true, cooldown }));
          }
        }
      }
    }

    const found = recoverRules({
      rulesHash: row.rulesHash,
      openedBy: row.openedBy,
      ranked: row.ranked,
      senders: entries.map((e) => e.sender),
      viewer: this.address,
      candidates: [fromManifest, ...pairs, knownRules(row.rulesHash)].filter((r): r is Rules => r !== null)
    });
    return found.confirmed ? found.rules : { ...DEFAULT_RULES, ranked: true };
  }

  /**
   * The manual, embedded.
   *
   * IT IS A PAGE, so it is shown as one. It runs to seven thousand pixels and
   * carries its own contents sidebar, which is why this is a frame filling the
   * tab rather than a modal: an overlay would put a document with its own
   * navigation inside a box with different navigation, and give the reader two
   * scroll positions to keep track of.
   *
   * The board used to carry a short copy of this text built in. That is gone —
   * two manuals is two things to keep true, and the one that was easiest to
   * update was the one nobody could see.
   */
  private drawHelp(): void {
    const body = this.el.helpBody;
    body.replaceChildren();

    // The newest manual in the directory, else the one this board shipped
    // knowing about. Found rather than named, so a correction is an
    // inscription rather than a new board.
    const found = this.docsFound[0];
    const id = found?.id ?? MANUAL_PAGE;

    // ALWAYS ABOVE THE FRAME, not only when it fails. A frame can be refused by
    // a browser setting this board cannot see, and a reader looking at an empty
    // rectangle has no way to know there was ever anything behind it.
    const bar = this.doc.createElement('div');
    bar.className = 'help-open';
    const link = this.doc.createElement('a');
    link.href = `${INSCRIPTION_VIEWER}${id}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const strong = this.doc.createElement('b');
    strong.textContent = 'Open the manual in a new tab';
    link.appendChild(strong);
    bar.appendChild(link);

    const why = this.doc.createElement('span');
    why.className = 'why';
    why.textContent =
      `Inscription ${id}${found ? '' : ', the copy this board shipped with'}. ` +
      'It is on chain and readable without this page.';
    bar.appendChild(why);
    body.appendChild(bar);

    const frame = this.doc.createElement('iframe');
    frame.className = 'help-frame';
    frame.src = `${INSCRIPTION_VIEWER}${id}`;
    frame.title = 'The X Chess manual';
    // NOT LAZY. Lazy loading defers a frame until it is scrolled near, which is
    // right for an image far down an article and wrong for the only thing in a
    // tab: the reader has already asked for it by opening the tab, and a frame
    // that waits for a scroll it may never get is an empty box. Isolated by
    // comparison — a plain frame and a sandboxed one both render this page; the
    // one that did not was the one told to wait.
    // Enough to render and to run its own contents links, and nothing else. The
    // manual is found by reading a wallet, and anybody may send an inscription
    // to a wallet — so it is treated as a stranger's page even though the
    // directory reports who minted it.
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('referrerpolicy', 'no-referrer');
    body.appendChild(frame);
  }

  private async loadHelp(): Promise<void> {
    this.drawHelp();
    if (this.docsAsked || !this.docs) {
      this.noteHelp();
      return;
    }
    this.docsAsked = true;
    try {
      this.docsFound = await this.docs.list();
    } catch {
      // Allowed to try again: a manual missing because the endpoint was busy is
      // not a manual that does not exist.
      this.docsAsked = false;
    }
    this.drawHelp();
    this.noteHelp();
  }

  private noteHelp(): void {
    const found = this.docsFound[0];
    this.notice(
      'helpNote',
      'info',
      found
        ? `Reading inscription ${found.id}, the newest manual in the organiser's wallet` +
          `${found.official ? '' : ' — inscribed by somebody else, so read it as a stranger would'}.`
        : `Reading inscription ${MANUAL_PAGE}. No newer manual was found in the wallet this ` +
          'board watches, which is normal; a correction would appear here without this page ' +
          'being rebuilt.'
    );
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
