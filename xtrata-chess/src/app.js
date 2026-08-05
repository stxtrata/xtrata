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
import { replay, toPgn, REJECTED } from './replay.js';
import { Chess, parseUci, pieceColor } from './engine.js';
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
import {
  isWellFormedLength,
  DEFAULT_CONTRACT,
  FALLBACK_CONTRACT,
  DEFAULT_NETWORK,
  DEFAULT_GAME
} from './protocol.js';
import {
  DEFAULT_RULES,
  describeRules,
  isOpenBoard,
  normaliseRules,
  rulesHash,
  rulesMatchCommitment
} from './rules.js';
import { childPage, engineIdFromLocation } from './child.js';
import { connectWallet, disconnectWallet } from './wallet.js';

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
    this.pendingMove = null;
    this.pendingTimer = null;
    // Moves broadcast by anyone and not yet in a block.
    this.mempool = [];
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

    this.board = new BoardView(this.elements.board, (uci) => this.stage(uci));

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
    else this.startConfiguredBoard({ contract: DEFAULT_CONTRACT, network: DEFAULT_NETWORK });
  }

  async startConfiguredBoard(board) {
    const network = board.network || 'mainnet';
    const wanted = String(board.contract || '');

    // Prefer the current contract; use the previous one when it is not there.
    // Pointing at a contract before it exists should degrade to a working board
    // rather than an error page, and should say which one it settled on.
    const chosen = board.exact
      ? wanted
      : await this._firstDeployed([wanted, FALLBACK_CONTRACT], network);

    const [address, name] = (chosen || wanted).split('.');
    this.elements.contractAddress.value = address || '';
    if (name) this.elements.contractName.value = name;
    this.elements.network.value = network;

    if (chosen && chosen !== wanted) {
      this._notify(
        `${wanted.split('.')[1]} is not deployed yet, so this is showing ${name}.`,
        'warn'
      );
    }
    this.setMode('live');
  }

  async _firstDeployed(candidates, network) {
    const api = network === 'testnet' ? 'https://api.testnet.hiro.so' : 'https://api.mainnet.hiro.so';
    for (const candidate of candidates) {
      const [address, name] = candidate.split('.');
      if (!address || !name) continue;
      try {
        const response = await fetch(`${api}/v2/contracts/interface/${address}/${name}`);
        if (response.ok) return candidate;
      } catch {
        // Unreachable is not the same as absent; try the next and let the
        // ordinary read path report the problem properly.
      }
    }
    return candidates[0];
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
      this.submit(value);
    });
    el.manualInput.addEventListener('input', () => this._describeInput());
    el.clearMove.addEventListener('click', () => {
      el.manualInput.value = '';
      this.board.setStaged(null);
      this._describeInput();
      this.render();
    });

    el.connect.addEventListener('click', () => this.connect());
    el.disconnect.addEventListener('click', () => this.disconnectWallet());
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

    if (mode === 'sim') {
      this.startSimulation();
      return;
    }
    // Coming back to live: fall back to the built-in board if the fields are
    // empty, so the toggle never lands on a blank form.
    if (!this.elements.contractAddress.value.trim()) {
      const [address, name] = DEFAULT_CONTRACT.split('.');
      this.elements.contractAddress.value = address;
      this.elements.contractName.value = name;
      this.elements.network.value = DEFAULT_NETWORK;
    }
    this.startLive();
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
        network: el.network.value,
        senderAddress: this.walletAddress || undefined
      });

      // Names are only meaningful against a real chain, and the resolver is
      // per-network because the same principal can hold different names on each.
      this.names = new NameResolver({ apiUrl: this.chain.apiUrl });
      this.times = new BlockTimes({ apiUrl: this.chain.apiUrl });

      // Read before anything can return early. A contract with no games yet
      // still charges for opening one, and the previous ordering meant an empty
      // board reported that it charged nothing.
      this.contractFee = this.chain.getContractFee ? await this.chain.getContractFee() : 0;

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
      this.game = Number(el.gameSelect.value) || DEFAULT_GAME;
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
    // Game 1 unless the viewer has already chosen another. The newest game is
    // not the interesting one by default; the open board is.
    el.value = String(previous >= 1 && previous <= count ? previous : Math.min(DEFAULT_GAME, count));
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

      // What is in flight matters as much as what has landed: it is the
      // difference between waiting your turn and paying for a move that will be
      // skipped because somebody beat you to it.
      this.mempool = this.chain.getMempool ? await this.chain.getMempool(this.game) : [];

      // What the contract itself charges, which is not the transaction fee and
      // should not be discovered for the first time in a wallet prompt.
      if (this.chain.getContractFee) this.contractFee = await this.chain.getContractFee();
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

  // A broadcast that never confirms must not lock the board permanently, so
  // anything older than this stops counting as in flight.
  livePending() {
    const CUTOFF = 10 * 60 * 1000;
    const now = Date.now();
    return this.mempool.filter(
      (entry) => !entry.receivedAt || now - entry.receivedAt < CUTOFF
    );
  }

  // Poll harder than the idle rate while something of ours is in flight, and
  // stop as soon as it appears in the log.
  _watchPending() {
    if (this.pendingTimer) clearInterval(this.pendingTimer);
    this.pendingTimer = setInterval(async () => {
      if (!this.pendingMove) return this._stopWatching();

      await this.refresh();

      const landed = this.state.log.some(
        (entry) => String(entry.uci).toLowerCase() === this.pendingMove.uci.toLowerCase()
      );
      const tooOld = Date.now() - this.pendingMove.at > 10 * 60 * 1000;

      if (landed) {
        const record = this.state.log.find(
          (entry) => String(entry.uci).toLowerCase() === this.pendingMove.uci.toLowerCase()
        );
        this._notify(
          record.status === 'accepted'
            ? `${record.san} is on the board.`
            : `Your submission landed and was skipped: ${record.reason}. The fee was still paid.`,
          record.status === 'accepted' ? 'info' : 'warn'
        );
        this._clearPending();
      } else if (tooOld) {
        this._notify('That move has not appeared after ten minutes. Check the transaction in the explorer.', 'warn');
        this._clearPending();
      }
      this.render();
    }, 8_000);
  }

  _clearPending() {
    this.pendingMove = null;
    this.board.setPending(null);
    this._stopWatching();
  }

  _stopWatching() {
    if (this.pendingTimer) clearInterval(this.pendingTimer);
    this.pendingTimer = null;
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

    // Somebody's move is already on its way. Sending now means both land in the
    // same block, the second is skipped, and its sender paid for nothing.
    const inFlight = this.livePending();
    if (this.mode === 'live' && inFlight.length) {
      const who = inFlight[0].sender === this.walletAddress ? 'Your' : "Somebody else's";
      this._notify(
        `${who} move (${inFlight[0].mv}) is waiting for a block. Sending now would almost certainly be skipped, so the board is holding until it confirms.`,
        'warn'
      );
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

      // A block takes the better part of a minute. Without this the board sits
      // unchanged after signing and looks like it did nothing.
      this.pendingMove = { uci, txid: result.txid, at: Date.now() };
      this.board.setPending(uci);
      this.elements.manualInput.value = '';
      this._notify(
        result.txid
          ? `Sent. Waiting for it to confirm — tx ${shortSender(result.txid)}`
          : 'Sent. Waiting for it to confirm.',
        'info'
      );
      this._watchPending();
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

  async disconnectWallet() {
    this.walletAddress = null;
    if (this.chain) this.chain.senderAddress = null;
    // Ask the wallet to forget as well, or the next Connect is answered from
    // its own session rather than by asking.
    await disconnectWallet({ onLog: () => {} }).catch(() => {});
    this._renderWallet();
    this._notify('Disconnected. Connect again to sign as a different wallet.', 'info');
    this.render();
  }

  // Keeps the button and the hint agreeing with whether a wallet is attached.
  _renderWallet() {
    const el = this.elements;
    if (this.walletAddress) {
      el.connect.className = 'connected';
      el.connect.textContent = `Connected · ${shortSender(this.walletAddress)}`;
      el.connect.title = this.walletAddress;
      el.disconnect.hidden = false;
    } else {
      el.connect.className = 'go';
      el.connect.textContent = 'Connect wallet';
      el.connect.title = '';
      el.disconnect.hidden = true;
    }
  }

  async connect() {
    try {
      const session = await connectWallet({
        // Always ask. A silent reconnect leaves someone stuck with whichever
        // account they happened to pick first, with no way to change it from
        // here, which is exactly the complaint this fixes.
        forcePrompt: true,
        onLog: (level, message) => this._notify(message, level === 'ok' ? 'info' : level)
      });
      this.walletAddress = session.address;
      // The contract's post condition is written about this address, so the
      // chain has to be told who is signing before a charging call is built.
      if (this.chain) this.chain.senderAddress = session.address;
      this._renderWallet();
      this._notify(
        `Connected ${shortSender(session.address)}${session.via === 'host-session' ? ' (session from the host)' : ''}`,
        'info'
      );
    } catch (error) {
      this._notify(
        error.code === 'NO_WALLET'
          ? 'No Stacks wallet found. Install Leather or Xverse, or open this board inside a wallet browser.'
          : `Connect failed: ${error.message}`,
        'error'
      );
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
  // Choosing a move before sending it
  // ------------------------------------------------------------------

  // Put a move in the box rather than on the chain. Every submission costs a
  // fee and opens a wallet, so the board proposes and the person disposes.
  stage(uci) {
    this.elements.manualInput.value = uci;
    this.board.setStaged(uci);
    this._describeInput();
    this.render();
    this.elements.manualInput.focus();
  }

  // Says what the text in the box would do, as it is typed. Uses the same
  // engine the chain-side replay uses, so the verdict here and the verdict
  // after submitting cannot disagree.
  _describeInput() {
    const el = this.elements;
    const raw = el.manualInput.value.trim();
    const state = this.state;

    if (!raw) {
      el.moveHint.textContent = 'Click a piece and then its destination, or type a move.';
      el.moveHint.className = 'hint';
      el.submitMove.disabled = true;
      this.board.setStaged(null);
      return;
    }

    if (!isWellFormedLength(raw)) {
      el.moveHint.textContent = `${raw.length} characters. The contract only stores four or five, so this would be refused before it reached the log.`;
      el.moveHint.className = 'hint bad';
      el.submitMove.disabled = true;
      this.board.setStaged(null);
      return;
    }

    const uci = raw.toLowerCase();
    const legal = state.legalMoves.includes(uci);

    if (legal) {
      // Show the move in the notation people read, not just the one they type.
      const preview = new Chess(state.fen);
      const applied = preview.moveUci(uci);
      el.moveHint.innerHTML =
        `<strong>${escapeHtml(applied ? applied.san : uci)}</strong> · ` +
        `${escapeHtml(uci.slice(0, 2))} → ${escapeHtml(uci.slice(2, 4))}` +
        (uci.length === 5 ? `, promoting to ${escapeHtml(uci[4].toUpperCase())}` : '') +
        ' · legal, ready to send';
      el.moveHint.className = 'hint good';
      el.submitMove.disabled = false;
      this.board.setStaged(uci);
      return;
    }

    // Not legal: say which kind of not-legal, using the same categories the log
    // will show if it is sent anyway.
    const reason = state.isGameOver
      ? 'this game is over'
      : classifyDraft(state, uci);
    el.moveHint.textContent = `${uci} · ${reason}. It would be stored and then skipped.`;
    el.moveHint.className = 'hint bad';
    el.submitMove.disabled = false;
    this.board.setStaged(null);
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

    const inFlight = this.livePending();
    // Anyone's in-flight move, not just ours. Watching an opponent's move
    // arrive is half the point of a shared board.
    this.board.pending = inFlight.length ? inFlight[0].mv : null;
    this.board.setInteractive(playable && !scrubbing);
    this.board.render(view);

    if (scrubbing) {
      el.status.textContent = `Replaying — submission ${this.viewIndex} of ${this.rawMoves.length}`;
      el.status.className = 'status replaying';
    } else if (inFlight.length) {
      const first = inFlight[0];
      const mine = first.sender === this.walletAddress;
      el.status.textContent = `${mine ? 'Your' : 'A'} move ${first.mv} is in the mempool, waiting for a block`;
      el.status.className = 'status waiting';
    } else {
      el.status.textContent = statusText(this.state);
      el.status.className = `status ${
        this.state.outcome ? 'over' : this.state.inCheck ? 'check' : ''
      }`;
    }

    el.pendingPanel.hidden = inFlight.length === 0;
    if (inFlight.length) {
      el.pendingPanel.innerHTML = inFlight
        .map((entry) => {
          const who = displaySender(entry.sender, this.names);
          const age = entry.receivedAt
            ? ` · ${formatDuration((Date.now() - entry.receivedAt) / 1000)} ago`
            : '';
          return (
            `<div class="inflight">` +
            `<span class="dotpulse"></span>` +
            `<code>${escapeHtml(entry.mv)}</code>` +
            `<span class="who ${who.named ? 'named' : ''}" title="${escapeHtml(who.title)}">${escapeHtml(who.label)}</span>` +
            `<span class="age">broadcast${escapeHtml(age)}</span>` +
            `</div>`
          );
        })
        .join('');
    }

    el.fen.textContent = view.fen;

    // Counts always describe the whole game, not the scrubbed prefix, so the
    // header does not appear to rewind along with the board.
    el.counts.innerHTML =
      `<span><strong>${this.state.log.length}</strong> submitted</span>` +
      `<span><strong>${this.state.accepted.length}</strong> played</span>` +
      `<span><strong>${this.state.rejected.length}</strong> skipped</span>`;

    this._renderReplayControls(view);
    if (!el.rulesPanel.hidden) this.renderRules();

    if (inFlight.length && this.mode === 'live') {
      el.submitMove.disabled = true;
      el.submitMove.textContent = 'Waiting for a block';
    } else if (el.submitMove.textContent === 'Waiting for a block') {
      el.submitMove.textContent = 'Submit move';
      this._describeInput();
    }

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

    // Say what a move costs before anybody signs for one.
    if (el.chargeNote) {
      const charge = Number(this.contractFee) || 0;
      const name = el.contractName.value;
      el.chargeNote.hidden = this.mode !== 'live';
      el.chargeNote.innerHTML = charge
        ? `<strong>${(charge / 1e6).toFixed(6)} STX</strong> per move, set by whoever owns ` +
          `${escapeHtml(name)}, plus the usual network fee. Your wallet will be asked to permit ` +
          `that amount and no more.`
        : `${escapeHtml(name)} charges nothing to play. Only the usual network fee applies.`;
    }
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

// Mirrors replay's rejection categories for a move that has not been sent yet,
// so the board's warning and the log's eventual reason use the same words.
function classifyDraft(state, uci) {
  const parsed = parseUci(uci);
  if (!parsed) return 'not a move';

  const piece = state.chess.board[parsed.from];
  if (!piece) return `there is no piece on ${uci.slice(0, 2)}`;
  if (pieceColor(piece) !== state.chess.turn) {
    return `that is ${state.turn === 'white' ? "Black's" : "White's"} piece, and it is ${state.turn} to move`;
  }
  if (state.legalMoves.some((m) => m.slice(0, 2) === uci.slice(0, 2))) {
    return 'that piece cannot go there';
  }
  return 'that piece has no legal move';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
