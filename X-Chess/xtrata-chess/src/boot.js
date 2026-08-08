// Starting the board, in a page that may or may not already contain one.
//
// The dev page carries the markup, so boot finds it and wires straight up. An
// inscribed page carries almost nothing: a few hundred bytes of configuration
// and a script tag pointing at the engine. In that case boot injects the shell
// it was built with, then wires up identically.
//
// That difference is what makes a child game cheap. If every game had to carry
// its own copy of the board, generating one would cost as much as the original.
// Instead a child is a config block and a dependency, and the engine it depends
// on is inscribed once.

import { ChessBoardApp } from './app.js';

// Filled in at build time for the inscribed engine. Left empty for the dev
// page, which already has both.
export const SHELL = { css: '', html: '' };

const IDS = [
  'board', 'status', 'counts', 'fen', 'notice', 'pending-panel', 'moves', 'log', 'game-label',
  'live-panel', 'new-game', 'flip',
  'copy-pgn', 'start-own', 'manual-form', 'manual-input', 'submit-move', 'clear-move', 'move-hint', 'play-controls', 
  'replay-panel', 'replay-caption', 'play-pause',
  'to-start', 'to-end', 'step-back', 'step-forward', 'seek', 'pace',
  'cap-waits', 'contract-address', 'contract-name', 'network', 'game-select',
  'load-live', 'connect', 'disconnect', 'charge-note', 'wallet-hint',
  'game-rules', 'game-rules-title', 'game-rules-state', 'game-rules-summary',
  'game-rules-hash', 'game-rules-note', 'rules-panel', 'rules-white', 'rules-black',
  'rules-cooldown', 'rules-no-consecutive', 'rules-hash', 'rules-summary',
  'rules-open', 'rules-download', 'rules-reset', 'rules-note'
];

const camel = (id) => id.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());

function mountShell() {
  if (document.getElementById('board')) return;
  if (!SHELL.html) throw new Error('no board markup in the page and none built in');

  if (SHELL.css) {
    const style = document.createElement('style');
    style.textContent = SHELL.css;
    document.head.appendChild(style);
  }
  document.body.innerHTML = SHELL.html;
}

// The one board on this page, if it has already been started.
//
// Booting twice does not look broken. mountShell finds the markup already there
// and leaves it alone, so the page renders perfectly — but every button now has
// two listeners, and one click on Submit move signs two transactions. Two fees,
// two entries in a permanent log, for one intended move.
//
// An inscription cannot be corrected, so this is a guard rather than a
// convention: however many times boot is called, there is one board.
let running = null;

export function boot(options = {}) {
  if (running) return running;

  mountShell();

  const elements = {};
  for (const id of IDS) elements[camel(id)] = document.getElementById(id);

  // The heading's X is inscription #2986, fetched at view time. If that ever
  // fails — no network, a viewer that does not serve /i/, the inscription
  // unreachable — a broken image icon beside the word "Chess" is worse than no
  // image at all. Swap in the letter, which is what the alt text says anyway.
  const logo = document.querySelector('.logo-x');
  if (logo) {
    const useTheLetter = () => {
      const letter = document.createElement('span');
      letter.className = 'logo-x logo-x--text';
      letter.textContent = 'X';
      logo.replaceWith(letter);
    };

    // Both, and the first one matters more than it looks. boot() runs from the
    // bundle's footer, after the document has been parsed, so an image that was
    // going to fail has usually failed already — a 404 resolves at once — and
    // its error event fired before there was anything listening. complete is
    // true for a failed image as well as a loaded one; naturalWidth tells them
    // apart.
    if (logo.complete && logo.naturalWidth === 0) useTheLetter();
    else logo.addEventListener('error', useTheLetter, { once: true });
  }

  const app = new ChessBoardApp({ ...options, elements });
  running = app;

  // Published so the running board can be inspected from a console: which game,
  // what is in flight, what the last read returned. Diagnosing a live board
  // otherwise means guessing, and it costs nothing to be legible.
  try {
    globalThis.__xtrataChess = app;
  } catch {
    // Sandboxed pages can refuse window writes; the board still works.
  }

  return app;
}

// No auto-start here on purpose.
//
// There used to be one, guarded on document.currentScript so it would fire for
// a classic script and not for a module import. Inside the built engine that
// guard is satisfied — the bundle is a classic script, and currentScript is set
// for the whole of its synchronous execution, including this module's body — so
// it started a second board alongside the one the bundle's own footer starts.
//
// Every entry point already calls boot explicitly: index.html for development,
// and both build modes append a call of their own. There was nothing left for
// the auto-start to do except double everything.
