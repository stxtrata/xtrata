// Starting the board, in a page that may or may not already contain one.
//
// The dev page carries the markup, so boot finds it and wires straight up. An
// inscribed page carries almost nothing, so boot injects the shell it was built
// with, then wires up identically.

import { ChessApp, SHELL } from './app.js';
import type { AppOptions, Tab } from './app.js';

/**
 * The one board on this page, if it has already been started.
 *
 * BOOTING TWICE DOES NOT LOOK BROKEN. `mountShell` finds the markup already
 * there and leaves it alone, so the page renders perfectly - but every button
 * now has two listeners, and one click on Submit signs TWO transactions. Two
 * network fees and two entries in a permanent log, for one intended move.
 *
 * The guard that used to be here was `document.currentScript`, meant to separate
 * "classic script" from "module import". Inside a built bundle that is satisfied
 * in BOTH cases - the bundle is a classic script, and currentScript is set for
 * the whole of its synchronous execution - so it started a second board beside
 * the one the bundle's own footer started. Invisible in development, where the
 * page loads as a module.
 *
 * An inscription cannot be corrected. So this is a hard guard rather than a
 * convention: however many times boot is called, there is one board.
 */
interface Running {
  app: ChessApp;
  /** The document it was mounted into. See below for why this is kept. */
  doc: Document;
}

/**
 * Held on the GLOBAL, not in module scope.
 *
 * A module-level variable only guards repeated `boot()` calls within ONE
 * execution of the bundle. It does nothing if the bundle itself runs twice,
 * because each execution of an IIFE gets its own fresh module scope and its own
 * fresh `null`. A duplicated script tag, or a runtime that re-runs the page's
 * scripts, would boot two boards past a module-level guard without noticing.
 *
 * The document is stored alongside, and that is the other half of the problem.
 * `document.open()` removes every listener on the window as well as on the
 * document, but it does NOT remove properties - so a bare "already booted" flag
 * would survive the wipe that removed the listeners, and the page would refuse
 * to re-boot into the new document and sit there dead. Comparing the document
 * distinguishes "booted already, here" from "booted before, into a document
 * that no longer exists".
 */
const SLOT = '__xchessRunning';

function stored(): Running | null {
  try {
    return ((globalThis as Record<string, unknown>)[SLOT] as Running) ?? null;
  } catch {
    return null;
  }
}

function remember(running: Running): void {
  try {
    (globalThis as Record<string, unknown>)[SLOT] = running;
  } catch {
    // Sandboxed pages can refuse window writes. One board per execution is
    // still guaranteed by the module-level fallback below.
  }
}

let local: ChessApp | null = null;

export function mountShell(doc: Document = document): void {
  if (doc.getElementById('board')) return;
  if (!SHELL.html) throw new Error('no board markup in the page and none built in');

  if (SHELL.css) {
    const style = doc.createElement('style');
    style.textContent = SHELL.css;
    doc.head.appendChild(style);
  }
  if (!doc.body) throw new Error('boot ran before the document had a body');
  doc.body.innerHTML = SHELL.html;
}

/**
 * Run once the document has a body.
 *
 * The inscription's single script block sits above the body, so at the moment it
 * executes `document.body` is null and mounting the shell throws. In development
 * the markup is already in the page and the entry point is a module, both of
 * which hide this completely.
 *
 * It is worse under the Xtrata runtime, which builds the document with
 * `document.open()` / `write()` / `close()`. Script timing there is not the
 * timing of an ordinary page load, so "it worked when I opened the file" proves
 * nothing about it.
 *
 * `readyState` is checked rather than always waiting, because if the event has
 * already fired a listener would never run at all.
 */
export function whenReady(doc: Document, run: () => void): void {
  if (doc.readyState === 'loading' && !doc.body) {
    doc.addEventListener('DOMContentLoaded', run, { once: true });
    return;
  }
  run();
}

export function boot(options: AppOptions): ChessApp {
  const doc = options.document ?? document;

  const already = stored();
  if (already && already.doc === doc) return already.app;
  if (local && !already) return local;

  mountShell(doc);

  const app = new ChessApp({ ...options, document: doc });
  local = app;
  remember({ app, doc });

  // Published so a running board can be inspected from a console: which game,
  // what is in flight, what the last read returned. Diagnosing a live board
  // otherwise means guessing, and it costs nothing to be legible.
  try {
    (globalThis as Record<string, unknown>).__xchess = app;
  } catch {
    // Sandboxed pages can refuse window writes. The board still works.
  }

  return app;
}

/** Only for tests, which need a fresh page per case. */
export function resetForTests(): void {
  local = null;
  try {
    delete (globalThis as Record<string, unknown>)[SLOT];
  } catch {
    // Nothing to do; the document comparison still keeps this correct.
  }
}

export function bootedApp(): ChessApp | null {
  return stored()?.app ?? local;
}

export type { AppOptions, Tab };
export { ChessApp, SHELL };

// No auto-start here, on purpose. Every entry point calls boot explicitly: the
// dev page, and the build's own footer. An auto-start had nothing left to do
// except double everything.
