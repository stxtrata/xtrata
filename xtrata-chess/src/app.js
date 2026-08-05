// The board application.
//
// Two modes behind one interface. Simulation runs against MockChain in memory,
// with bots and a griefer available so a whole open board can be exercised
// without a wallet. Live runs against the deployed contract, reading over HTTP
// and writing through an injected wallet.
//
// Both modes do the same thing on every update: read the entire log, replay it
// from the first entry, and draw whatever comes out. There is no incremental
// state to drift.

import { MockChain } from './mock-chain.js';
import { SealedChain } from './sealed-chain.js';
import { LiveChain, describeContractError } from './live-chain.js';
import { replay, toPgn } from './replay.js';
import { BoardView, statusText, shortSender, displaySender } from './board-ui.js';
import { NameResolver, StaticNames } from './bns.js';
import {
  BlockTimes,
  StaticBlockTimes,
  formatClock,
  formatDuration,
  gapAt,
  stampLog
} from './block-time.js';
import { BOTS, mulberry32 } from './bots.js';
import { SimIdentities } from './sim-identities.js';
import { isWellFormedLength } from './protocol.js';
import {
  DEFAULT_RULES,
  describeRules,
  isOpenBoard,
  normaliseRules,
  rulesHash,
  rulesMatchCommitment
} from './rules.js';
import { childPage, engineIdFromLocation } from './child.js';

const REASON_LABEL = {
  malformed: 'not a move',
  'empty-square': 'no piece there',
  'wrong-turn': 'not their turn',
  illegal: 'illegal',
  'game-over': 'game already over',
  // Reasons that only a child board's rules can produce.
  'wrong-player': 'not their side',
  'not-allowed': 'not on the list',
  consecutive: 'two in a row',
  cooldown: 'too soon'
};

export class ChessBoardApp {
  constructor(options = {}) {
    this.elements = options.elements;
    this.mode = 'sim';
    this.chain = new MockChain();
    this.game = null;
    this.state = replay([]);
    this.random = mulberry32(options.seed ?? 1);
    this.simSeed = options.seed ?? 1;
    this.identities = null;
    this.gameRules = null;
    this.committedHash = null;
    this.childGame = null;
    this.engineId = null;
    this.isChild = false;
    this.autoplayTimer = null;
    this.pollTimer = null;
    this.busy = false;
    this.notice = null;
    this.names = null;

    // The raw submissions, exactly as read. Playback re-derives the board from
    // prefixes of this, so what you watch is the chain rather than a recording
    // of it.
    this.rawMoves = [];
    // null means "show the latest position". A number means "show the board as
    // of that many submissions applied".
    this.viewIndex = null;
    this.playTimer = null;

    // Block times, and how playback should use them.
    this.times = null;
    this.stamps = [];
    // 0 means the steady pace. Anything else is a divisor on the real gap, so
    // 1 is true real time and 3600 turns an hour into a second.
    this.pace = 0;
    this.capLongWaits = true;
    this.waiting = null;

    this.board = new BoardView(this.elements.board, (uci) => this.submit(uci));

    this._wire();

    // A sealed game carries its own log, so the page renders with no network at
    // all. This is the mode an inscribed finished game runs in.
    const sealed = options.sealed || globalThis.__XTRATA_CHESS_SEALED__;
    const child = options.child || globalThis.__XTRATA_CHESS_CHILD__;
    // An inscribed open board knows its own contract, so it opens on the game
    // rather than on a form asking where the game is.
    const board = options.board || globalThis.__XTRATA_CHESS_BOARD__;

    if (sealed) this.startSealed(sealed);
    else if (child) this.startChild(child);
    else if (board) this.startConfiguredBoard(board);
    else this.startSimulation();
  }

  async startConfiguredBoard(board) {
    const [address, name] = String(board.contract || '').split('.');
    this.elements.contractAddress.value = address || '';
    if (name) this.elements.contractName.value = name;
    this.elements.network.value = board.network || 'mainnet';
    this.setMode('live');
  }

  // A generated board: one game, one rule set, nothing else. It still reads the
  // chain like any live board, and it checks that the rules it was built with
  // are the ones the game actually committed to.
  async startChild(child) {
    this.mode = 'live';
    this.isChild = true;
    this.engineId = child.engine ?? null;
    this.gameRules = normaliseRules(child.rules);

    const el = this.elements;
    el.modeSim.hidden = true;
    el.modeLive.hidden = true;
    el.simPanel.hidden = true;
    el.livePanel.hidden = true;
    el.rulesPanel.hidden = true;
    el.newGame.hidden = true;

    const [address, name] = String(child.contract || '').split('.');
    this.chain = new LiveChain({
      contractAddress: address,
      contractName: name,
      network: child.network || 'mainnet'
    });
    this.names = new NameResolver({ apiUrl: this.chain.apiUrl });
    this.times = new BlockTimes({ apiUrl: this.chain.apiUrl });
    this.game = Number(child.game);

    await this.refresh();
    await this._verifyCommitment();
    this._startPolling();
  }

  // Does the chain agree that this is the referee for this game?
  async _verifyCommitment() {
    if (!this.gameRules || !this.chain.getGame) return;

    try {
      const entry = await this.chain.getGame(this.game);
      if (!entry) {
        this._notify(`Game #${this.game} does not exist on this contract.`, 'error');
        this.render();
        return;
      }

      this.committedHash = entry.rulesHash ?? null;

      if (!rulesMatchCommitment(this.gameRules, this.committedHash)) {
        // Worth stating plainly rather than quietly rendering anyway: a board
        // whose rules do not hash to the commitment is not this game's referee,
        // and anything it shows is its own opinion.
        this._notify(
          `These rules do not match what game #${this.game} committed to on chain. This board is not the referee for this game, and what it shows should not be trusted.`,
          'error'
        );
      }
      this.render();
    } catch (error) {
      this._notify(`Could not check the rules commitment: ${error.message}`, 'warn');
      this.render();
    }
  }

  startSealed(sealed) {
    this.mode = 'sealed';
    this.chain = new SealedChain(sealed);
    this.game = this.chain.game;
    // Whatever names the game carried when it was sealed. No lookups happen
    // here, because a sealed page must render with no network at all.
    this.names = new StaticNames(sealed.names);
    this.times = new StaticBlockTimes(sealed.blockTimes);

    const el = this.elements;
    el.modeSim.hidden = true;
    el.modeLive.hidden = true;
    el.simPanel.hidden = true;
    el.livePanel.hidden = true;
    el.newGame.hidden = true;
    el.playControls.hidden = true;

    this.board.setInteractive(false);
    this.refresh();
  }

  // ------------------------------------------------------------------
  // Wiring
  // ------------------------------------------------------------------

  _wire() {
    const el = this.elements;

    el.modeSim.addEventListener('click', () => this.setMode('sim'));
    el.modeLive.addEventListener('click', () => this.setMode('live'));

    el.newGame.addEventListener('click', () => this.newGame());
    el.flip.addEventListener('click', () => this.board.setFlipped(!this.board.flipped));

    el.botMove.addEventListener('click', () => this.playBotMove());
    el.junk.addEventListener('click', () => this.playGrief());
    el.autoplay.addEventListener('change', () => this.setAutoplay(el.autoplay.checked));

    el.manualForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = el.manualInput.value.trim();
      if (!value) return;
      el.manualInput.value = '';
      this.submit(value);
    });

    el.connect.addEventListener('click', () => this.connect());
    el.loadLive.addEventListener('click', () => this.startLive());
    el.gameSelect.addEventListener('change', () => {
      this.game = Number(el.gameSelect.value);
      this.refresh();
    });

    el.copyPgn.addEventListener('click', () => this.copyPgn());

    el.playPause.addEventListener('click', () => this.togglePlay());
    el.toStart.addEventListener('click', () => {
      this.pause();
      this.seek(0);
    });
    el.toEnd.addEventListener('click', () => {
      this.pause();
      this.seek(this.rawMoves.length);
    });
    el.stepBack.addEventListener('click', () => this.step(-1));
    el.stepForward.addEventListener('click', () => this.step(1));
    el.seek.addEventListener('input', () => {
      this.pause();
      this.seek(Number(el.seek.value));
    });
    el.pace.addEventListener('change', () => this.setPace(el.pace.value));

    for (const control of [el.rulesWhite, el.rulesBlack, el.rulesCooldown, el.rulesNoConsecutive]) {
      control.addEventListener('input', () => this.renderRules());
      control.addEventListener('change', () => this.renderRules());
    }
    el.rulesOpen.addEventListener('click', () => this.openRuledGame());
    el.rulesDownload.addEventListener('click', () => this.downloadChild());
    el.rulesReset.addEventListener('click', () => {
      el.rulesWhite.value = '';
      el.rulesBlack.value = '';
      el.rulesCooldown.value = '0';
      el.rulesNoConsecutive.checked = false;
      this.childGame = null;
      this.renderRules();
    });
    el.capWaits.addEventListener('change', () => {
      this.capLongWaits = el.capWaits.checked;
      this.setPace(this.pace);
    });
  }

  // ------------------------------------------------------------------
  // Modes
  // ------------------------------------------------------------------

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.setAutoplay(false);
    this._stopPolling();

    this.elements.modeSim.classList.toggle('active', mode === 'sim');
    this.elements.modeLive.classList.toggle('active', mode === 'live');
    this.elements.simPanel.hidden = mode !== 'sim';
    this.elements.livePanel.hidden = mode !== 'live';

    if (mode === 'sim') this.startSimulation();
    else this.startLive();
  }

  startSimulation() {
    this.chain = new MockChain();
    // Real-shaped principals with real-shaped names, so simulation previews
    // exactly what a live board looks like rather than a tidied version of it.
    this.identities = new SimIdentities(this.simSeed++);
    this.names = this.identities;
    // The mock chain keeps its own clock, so simulated games have real gaps to
    // be replayed against.
    this.times = this.chain.blockTimes;
    this.gameRules = null;
    this.childGame = null;
    this.game = this.chain.openGame(this.identities.you).value;
    this.viewIndex = null;
    this.pause();
    this.notice = null;
    this.refresh();
  }

  async startLive() {
    const el = this.elements;
    const contractAddress = el.contractAddress.value.trim();
    if (!contractAddress) {
      this._notify('Enter the contract address to load a live board.', 'warn');
      this.render();
      return;
    }

    try {
      this.chain = new LiveChain({
        contractAddress,
        contractName: el.contractName.value.trim() || undefined,
        network: el.network.value
      });

      // Names are only meaningful against a real chain, and the resolver is
      // per-network because the same principal can hold different names on each.
      this.names = new NameResolver({ apiUrl: this.chain.apiUrl });
      this.times = new BlockTimes({ apiUrl: this.chain.apiUrl });

      const count = await this.chain.getGameCount();
      if (count === 0) {
        this._notify('No games opened on this contract yet.', 'warn');
        this.game = null;
        this.rawMoves = [];
        this.state = replay([]);
        this.render();
        return;
      }

      this._fillGameSelect(count);
      this.game = Number(el.gameSelect.value) || count;
      this.notice = null;
      await this.refresh();
      this._startPolling();
    } catch (error) {
      this._notify(`Could not read the contract: ${error.message}`, 'error');
      this.render();
    }
  }

  _fillGameSelect(count) {
    const el = this.elements.gameSelect;
    const previous = Number(el.value);
    el.innerHTML = '';
    for (let id = count; id >= 1; id--) {
      const option = document.createElement('option');
      option.value = String(id);
      option.textContent = `game #${id}`;
      el.appendChild(option);
    }
    el.value = String(previous >= 1 && previous <= count ? previous : count);
  }

  _startPolling() {
    this._stopPolling();
    this.pollTimer = setInterval(() => {
      if (!this.busy) this.refresh();
    }, 15_000);
  }

  _stopPolling() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = null;
  }

  // ------------------------------------------------------------------
  // Reading
  // ------------------------------------------------------------------

  async refresh() {
    if (this.game === null || this.game === undefined) {
      this.state = replay([]);
      this.render();
      return;
    }

    this.busy = true;
    try {
      const moves = await this.chain.getAllMoves(this.game);
      this.rawMoves = moves;
      this.state = replay(moves, { rules: this.gameRules });
      this.stamps = stampLog(moves, this.times);
    } catch (error) {
      this._notify(`Read failed: ${error.message}`, 'error');
    } finally {
      this.busy = false;
    }
    this.render();
    this._resolveNames();
    this._resolveTimes();
  }

  // ------------------------------------------------------------------
  // Playback
  //
  // A finished game is finished. What is left is watching it, and the only
  // honest way to do that is to replay the log: take the first N submissions,
  // run them through exactly the same replay the live board uses, and draw the
  // result. Nothing is recorded and nothing is interpolated, so a position seen
  // during playback is one the board genuinely passed through.
  // ------------------------------------------------------------------

  get isFinished() {
    return this.state.isGameOver;
  }

  // The state being drawn: a historical prefix while scrubbing, else the latest.
  viewState() {
    if (this.viewIndex === null) return this.state;
    return replay(this.rawMoves.slice(0, this.viewIndex), { rules: this.gameRules });
  }

  seek(index) {
    const clamped = Math.max(0, Math.min(this.rawMoves.length, Math.round(index)));
    this.viewIndex = clamped >= this.rawMoves.length ? null : clamped;
    this.render();
  }

  step(delta) {
    const current = this.viewIndex === null ? this.rawMoves.length : this.viewIndex;
    this.pause();
    this.seek(current + delta);
  }

  // How long to wait before advancing from `index` to `index + 1`.
  //
  // At the steady pace this is a constant. In real time it is the actual gap
  // between the two blocks, divided by the chosen speed. Submissions that
  // shared a block have no gap at all and follow immediately, which is honest:
  // they landed together.
  delayBefore(index) {
    const STEADY = 550;
    if (!this.pace) return { ms: STEADY, real: null, capped: false };

    const gap = gapAt(this.stamps, index + 1);
    if (gap === null) return { ms: STEADY, real: null, capped: false };

    const scaled = (gap / this.pace) * 1000;
    // A minimum so a burst of same-block submissions is still watchable.
    const floored = Math.max(90, scaled);
    const CAP = 8000;
    const capped = this.capLongWaits && floored > CAP;

    return { ms: capped ? CAP : floored, real: gap, capped };
  }

  play() {
    if (this.playTimer) return;
    // Starting from the end rewinds, otherwise pressing play on a finished game
    // would appear to do nothing.
    if (this.viewIndex === null) this.viewIndex = 0;
    this._schedule();
    this.render();
  }

  _schedule() {
    const from = this.viewIndex ?? 0;
    if (from >= this.rawMoves.length) {
      this.viewIndex = null;
      this.pause();
      this.render();
      return;
    }

    const step = this.delayBefore(from);
    this.waiting = step;

    // A chain of timeouts rather than one interval, because each gap differs.
    this.playTimer = setTimeout(() => {
      const next = (this.viewIndex ?? 0) + 1;
      if (next >= this.rawMoves.length) {
        this.viewIndex = null;
        this.waiting = null;
        this.pause();
        this.render();
        return;
      }
      this.viewIndex = next;
      this.render();
      this._schedule();
    }, step.ms);
  }

  pause() {
    if (this.playTimer) clearTimeout(this.playTimer);
    this.playTimer = null;
    this.waiting = null;
  }

  setPace(pace) {
    this.pace = Number(pace) || 0;
    if (this.playTimer) {
      // Take the new speed immediately rather than after the current wait.
      clearTimeout(this.playTimer);
      this.playTimer = null;
      this._schedule();
    }
    this.render();
  }

  togglePlay() {
    if (this.playTimer) {
      this.pause();
      this.render();
    } else {
      this.play();
    }
  }

  // Fire and forget. The board is already drawn from replay; names land later
  // and only cause a redraw if any of them actually resolved.
  _resolveNames() {
    if (!this.names?.resolve) return;
    const senders = this.state.log.map((entry) => entry.sender).filter(Boolean);
    if (!senders.length) return;

    this.names
      .resolve(senders)
      .then((learned) => {
        if (learned) this.render();
      })
      .catch(() => {});
  }

  // Same deal for block times: fire and forget, one lookup per distinct block
  // rather than per move, and a redraw only if something was learned.
  _resolveTimes() {
    if (!this.times?.resolve) return;
    const heights = this.rawMoves
      .map((entry) => entry.height)
      .filter((height) => Number.isFinite(height));
    if (!heights.length) return;

    this.times
      .resolve(heights)
      .then((learned) => {
        if (!learned) return;
        this.stamps = stampLog(this.rawMoves, this.times);
        this.render();
      })
      .catch(() => {});
  }

  // ------------------------------------------------------------------
  // Writing
  // ------------------------------------------------------------------

  async submit(uci) {
    if (this.mode === 'sealed') return;

    if (this.game === null || this.game === undefined) {
      this._notify('Open a game first.', 'warn');
      this.render();
      return;
    }

    // Mirror the contract's filter locally so the obvious case does not cost a
    // transaction to learn.
    if (!isWellFormedLength(uci)) {
      this._notify(
        `"${uci}" is ${uci.length} characters. The contract only stores four or five, so this would be rejected before it reached the log.`,
        'warn'
      );
      this.render();
      return;
    }

    if (this.mode === 'sim') {
      const result = this.chain.submitMove(this.game, uci, this.identities.you);
      this.chain.advance();
      if (!result.ok) this._notify(describeContractError(result.error), 'warn');
      else this._noteOutcome(uci);
      await this.refresh();
      return;
    }

    try {
      this._notify('Confirm the move in your wallet…', 'info');
      this.render();
      const result = await this.chain.submitMove(this.game, uci);
      this._notify(
        result.txid
          ? `Submitted. It lands when the transaction confirms. tx ${shortSender(result.txid)}`
          : 'Submitted.',
        'info'
      );
    } catch (error) {
      if (error.code === 'NO_WALLET') {
        this._notify('No Stacks wallet found. Install Leather or Xverse to play live.', 'error');
      } else {
        this._notify(`Wallet call failed: ${error.message}`, 'error');
      }
    }
    this.render();
  }

  // Say what replay will do with a submission, before the log is re-read.
  _noteOutcome(uci) {
    const legal = this.state.legalMoves.includes(uci.trim().toLowerCase());
    if (this.state.isGameOver) {
      this._notify('The game is already over, so this will be skipped.', 'warn');
    } else if (!legal) {
      this._notify(`"${uci}" is not legal here, so replay will skip it.`, 'warn');
    } else {
      this.notice = null;
    }
  }

  async newGame() {
    if (this.mode === 'sim') {
      this.pause();
      this.viewIndex = null;
      this.identities = new SimIdentities(this.simSeed++);
      this.names = this.identities;
      this.times = this.chain.blockTimes;
      this.game = this.chain.openGame(this.identities.you).value;
      this.notice = null;
      await this.refresh();
      return;
    }

    try {
      this._notify('Confirm the new game in your wallet…', 'info');
      this.render();
      const result = await this.chain.openGame();
      this._notify(
        result.txid
          ? `New game submitted. It appears once confirmed. tx ${shortSender(result.txid)}`
          : 'New game submitted.',
        'info'
      );
    } catch (error) {
      this._notify(`Wallet call failed: ${error.message}`, 'error');
    }
    this.render();
  }

  async connect() {
    try {
      const provider =
        typeof window !== 'undefined'
          ? window.LeatherProvider ||
            window.XverseProviders?.StacksProvider ||
            window.StacksProvider ||
            window.btc
          : null;
      if (!provider) {
        this._notify('No Stacks wallet found. Install Leather or Xverse.', 'error');
        this.render();
        return;
      }
      const result = await provider.request('getAddresses');
      const addresses = result?.result?.addresses || result?.addresses || [];
      const stx = addresses.find((entry) => entry.symbol === 'STX' || entry.address?.startsWith('S'));
      this._notify(stx ? `Connected ${shortSender(stx.address)}` : 'Wallet connected.', 'info');
    } catch (error) {
      this._notify(`Connect failed: ${error.message}`, 'error');
    }
    this.render();
  }

  // ------------------------------------------------------------------
  // Simulation controls
  // ------------------------------------------------------------------

  // The bots decide from the current position, so a second call must not start
  // before the first has been read back. Without this, hammering the button
  // submits the same move several times over and replay skips all but one.
  async _act(fn) {
    if (this._acting) return;
    this._acting = true;
    try {
      await fn();
    } finally {
      this._acting = false;
    }
  }

  async playBotMove() {
    if (this.mode !== 'sim' || this.state.isGameOver) return;
    await this._act(async () => {
      const uci = BOTS.greedy(this.state.chess, this.random);
      if (!uci) return;
      this.chain.submitMove(this.game, uci, this.identities.forSide(this.state.turn));
      this.chain.advance();
      await this.refresh();
    });
  }

  async playGrief() {
    if (this.mode !== 'sim') return;
    await this._act(async () => {
      const uci = BOTS.griefer(this.state.chess, this.random);
      const result = this.chain.submitMove(this.game, uci, this.identities.griefer(this.random()));
      this.chain.advance();
      if (!result.ok) {
        this._notify(
          `"${uci}" — ${describeContractError(result.error)}. Turned away by the contract, so it never reached the log.`,
          'warn'
        );
      }
      await this.refresh();
    });
  }

  setAutoplay(on) {
    this.elements.autoplay.checked = on;
    if (this.autoplayTimer) clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
    if (!on || this.mode !== 'sim') return;

    this.autoplayTimer = setInterval(async () => {
      if (this.state.isGameOver) {
        this.setAutoplay(false);
        return;
      }
      // Roughly one junk submission in four, which is about what the wide open
      // board should expect.
      if (this.random() < 0.25) await this.playGrief();
      else await this.playBotMove();
    }, 700);
  }

  async copyPgn() {
    const pgn = toPgn(this.state, {
      Event: this.mode === 'sim' ? 'Xtrata Open Board (simulation)' : 'Xtrata Open Board',
      Site: this.mode === 'sim' ? 'simulation' : this.chain.contractId || 'chain',
      Round: String(this.game ?? '-')
    });
    try {
      await navigator.clipboard.writeText(pgn);
      this._notify('PGN copied.', 'info');
    } catch {
      this._notify('Could not reach the clipboard.', 'warn');
    }
    this.render();
  }

  _notify(message, level = 'info') {
    this.notice = { message, level };
  }

  // ------------------------------------------------------------------
  // Child boards
  // ------------------------------------------------------------------

  // The rules currently described by the panel.
  draftRules() {
    const el = this.elements;
    return normaliseRules({
      white: el.rulesWhite.value,
      black: el.rulesBlack.value,
      cooldown: el.rulesCooldown.value,
      noConsecutive: el.rulesNoConsecutive.checked
    });
  }

  renderRules() {
    const el = this.elements;
    const rules = this.draftRules();
    const open = isOpenBoard(rules);

    el.rulesSummary.textContent = describeRules(rules);
    el.rulesHash.textContent = open ? 'none — these are the open board rules' : rulesHash(rules);
    el.rulesDownload.disabled = !this.childGame;
    el.rulesDownload.textContent = this.childGame
      ? `Download the board for game #${this.childGame}`
      : 'Download the board';
  }

  async openRuledGame() {
    const rules = this.draftRules();
    const hash = isOpenBoard(rules) ? null : rulesHash(rules);

    if (this.mode === 'sim') {
      const id = this.chain.openGame(this.identities.you, hash).value;
      this.childGame = id;
      this.game = id;
      this.gameRules = rules;
      this._notify(
        `Opened game #${id} in simulation with those rules. On chain this would write the hash and nothing else.`,
        'info'
      );
      await this.refresh();
      this.renderRules();
      return;
    }

    try {
      this._notify('Confirm the new game in your wallet…', 'info');
      this.render();
      const result = await this.chain.openGame(hash);
      this._notify(
        `Game submitted with its rules hash. Once it confirms, note its number and come back to download the board. tx ${shortSender(result.txid)}`,
        'info'
      );
    } catch (error) {
      this._notify(`Wallet call failed: ${error.message}`, 'error');
    }
    this.render();
  }

  downloadChild() {
    const rules = this.draftRules();
    const game = this.childGame ?? this.game;
    if (!game) {
      this._notify('Open the game first, so the board can be bound to its number.', 'warn');
      this.render();
      return;
    }

    const engine = this.engineId ?? engineIdFromLocation();
    if (!engine) {
      this._notify(
        'This board is not running from an inscription, so it does not know which engine a child should depend on. Inscribe the engine first, then generate children from the inscribed board.',
        'warn'
      );
      this.render();
      return;
    }

    const html = childPage({
      contract: this.chain.contractId || 'simulation',
      network: this.mode === 'live' ? this.chain.network : 'simulation',
      game,
      rules,
      engine
    });

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xtrata-chess-game-${game}.html`;
    link.click();
    URL.revokeObjectURL(url);

    this._notify(
      `Board for game #${game} downloaded, ${html.length} bytes. Inscribe it with dependency [${engine}].`,
      'info'
    );
    this.render();
  }

  // ------------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------------

  render() {
    const el = this.elements;
    const finished = this.isFinished;
    const scrubbing = this.viewIndex !== null;
    const view = this.viewState();

    // A finished game accepts nothing more, from anyone, ever. The controls go
    // away rather than sitting there greyed out.
    const playable = this.mode !== 'sealed' && !finished;
    // A sealed game is watchable even if it was sealed mid-play.
    const replayable = finished || this.mode === 'sealed';

    el.playControls.hidden = !playable;
    el.newGame.hidden = this.mode === 'sealed' || this.isChild;
    if (this.mode === 'sim') el.simPanel.hidden = !playable;
    el.replayPanel.hidden = !replayable;

    this.board.setInteractive(playable && !scrubbing);
    this.board.render(view);

    el.status.textContent = scrubbing
      ? `Replaying — submission ${this.viewIndex} of ${this.rawMoves.length}`
      : statusText(this.state);
    el.status.className = `status ${
      scrubbing ? 'replaying' : this.state.outcome ? 'over' : this.state.inCheck ? 'check' : ''
    }`;

    el.fen.textContent = view.fen;

    // Counts always describe the whole game, not the scrubbed prefix, so the
    // header does not appear to rewind along with the board.
    el.counts.innerHTML =
      `<span><strong>${this.state.log.length}</strong> submitted</span>` +
      `<span><strong>${this.state.accepted.length}</strong> played</span>` +
      `<span><strong>${this.state.rejected.length}</strong> skipped</span>`;

    this._renderReplayControls(view);
    if (!el.rulesPanel.hidden) this.renderRules();

    el.moves.innerHTML = this._renderMoves(this.state, view);
    el.log.innerHTML = this._renderLog(this.state);

    if (this.notice) {
      el.notice.hidden = false;
      el.notice.textContent = this.notice.message;
      el.notice.className = `notice ${this.notice.level}`;
    } else {
      el.notice.hidden = true;
    }

    el.gameLabel.textContent = this.game ? `game #${this.game}` : 'no game';
  }

  _renderReplayControls(view) {
    const el = this.elements;
    if (el.replayPanel.hidden) return;

    const total = this.rawMoves.length;
    const at = this.viewIndex === null ? total : this.viewIndex;

    el.seek.max = String(total);
    el.seek.value = String(at);
    el.playPause.textContent = this.playTimer ? '❚❚' : '▶';
    el.playPause.title = this.playTimer ? 'Pause' : 'Play';

    el.pace.value = String(this.pace);
    el.capWaits.checked = this.capLongWaits;
    el.capWaits.parentElement.hidden = !this.pace;

    const outcome = this.state.outcome;
    const span = this.gameDuration();

    if (this.viewIndex === null) {
      el.replayCaption.textContent =
        `Final position. ${outcome ? outcome.result : ''} after ${total} submissions` +
        (span === null ? '.' : ` over ${formatDuration(span)}.`);
      return;
    }

    const parts = [`${at} of ${total} submissions applied, ${view.accepted.length} of them legal`];

    const elapsed = this.elapsedAt(at);
    if (elapsed !== null) parts.push(`${formatClock(elapsed)} into the game`);

    if (this.waiting?.real !== null && this.waiting?.real !== undefined) {
      parts.push(
        `next in ${formatDuration(this.waiting.real)}${this.waiting.capped ? ' (capped)' : ''}`
      );
    }

    el.replayCaption.textContent = `${parts.join(' · ')}.`;
  }

  // Wall-clock seconds from the first submission to the last, or null if the
  // block times are not known.
  gameDuration() {
    const first = this.stamps.find((value) => value !== null);
    const last = [...this.stamps].reverse().find((value) => value !== null);
    if (first === undefined || last === undefined || first === null || last === null) return null;
    return last - first;
  }

  elapsedAt(index) {
    const first = this.stamps.find((value) => value !== null);
    if (first === undefined || first === null || index <= 0) return index <= 0 ? 0 : null;
    const at = this.stamps[Math.min(index, this.stamps.length) - 1];
    return at === null || at === undefined ? null : at - first;
  }

  // One row per ply rather than the usual White/Black pairing, because on an
  // open board every move can come from a different person and who played it is
  // half the point.
  _renderMoves(state, view = state) {
    if (!state.accepted.length) return '<p class="empty">No moves played yet.</p>';

    const upTo = view.accepted.length;

    const rows = state.accepted.map((entry) => {
      const number = Math.floor((entry.ply - 1) / 2) + 1;
      const label = entry.color === 'white' ? `${number}.` : `${number}…`;
      const who = displaySender(entry.sender, this.names);

      // While scrubbing, moves the board has not reached yet are dimmed and the
      // one just played is marked.
      const reached = entry.ply <= upTo;
      const current = entry.ply === upTo && this.viewIndex !== null;

      // Elapsed time from the first submission, so the pace of the game is
      // readable without playing it back.
      const elapsed = this.elapsedAt(entry.seq + 1);
      const at = elapsed === null ? '' : formatClock(elapsed);

      return (
        `<tr class="${reached ? '' : 'ahead'} ${current ? 'current' : ''}">` +
        `<td class="num">${label}</td>` +
        `<td class="dot"><span class="side ${entry.color}"></span></td>` +
        `<td class="san">${escapeHtml(entry.san)}</td>` +
        `<td class="at">${at}</td>` +
        `<td class="who ${who.named ? 'named' : ''}" title="${escapeHtml(who.title)}">` +
        `${escapeHtml(who.label)}</td>` +
        `</tr>`
      );
    });

    return `<table class="movelist"><tbody>${rows.join('')}</tbody></table>`;
  }

  // Every submission, including the ones replay threw away. The rejected
  // entries are the record of what the open board actually attracted, so they
  // are shown rather than hidden.
  _renderLog(state) {
    if (!state.log.length) return '<p class="empty">Nothing submitted yet.</p>';

    return state.log
      .slice()
      .reverse()
      .map((entry) => {
        const ok = entry.status === 'accepted';
        const detail = ok ? entry.san : REASON_LABEL[entry.reason] || entry.reason;
        const who = displaySender(entry.sender, this.names);
        return (
          `<div class="entry ${ok ? 'ok' : 'no'}">` +
          `<span class="seq">${entry.seq}</span>` +
          `<span class="mark">${ok ? '✓' : '✗'}</span>` +
          `<code class="mv">${escapeHtml(entry.uci) || '·'}</code>` +
          `<span class="detail">${escapeHtml(detail)}</span>` +
          `<span class="who ${who.named ? 'named' : ''}" title="${escapeHtml(who.title)}">` +
          `${escapeHtml(who.label)}</span>` +
          `</div>`
        );
      })
      .join('');
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
