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
  'mode-sim', 'mode-live', 'sim-panel', 'live-panel', 'new-game', 'flip',
  'copy-pgn', 'manual-form', 'manual-input', 'submit-move', 'clear-move', 'move-hint', 'play-controls', 'bot-move',
  'junk', 'autoplay', 'replay-panel', 'replay-caption', 'play-pause',
  'to-start', 'to-end', 'step-back', 'step-forward', 'seek', 'pace',
  'cap-waits', 'contract-address', 'contract-name', 'network', 'game-select',
  'load-live', 'connect', 'disconnect', 'fee', 'wallet-hint', 'rules-panel', 'rules-white', 'rules-black',
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

export function boot(options = {}) {
  mountShell();

  const elements = {};
  for (const id of IDS) elements[camel(id)] = document.getElementById(id);

  const app = new ChessBoardApp({ ...options, elements });

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

// Auto-start when loaded as a plain script, which is how an inscription runs.
// Under a module import the caller decides when.
if (typeof document !== 'undefined' && document.currentScript) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => boot());
  } else {
    boot();
  }
}
