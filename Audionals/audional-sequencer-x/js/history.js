// history.js — global undo/redo. Snapshots the whole project on every change
// (debounced, deduped), so step edits, MIDI edits, trims, crossfades, FX, channel
// ops and preset loads are all undoable with ⌘/Ctrl+Z and ⌘/Ctrl+Shift+Z.

import { store } from './state.js';

const MAX_HISTORY = 100;
const DEBOUNCE_MS = 250;

let stack = [];
let index = -1;      // points at the current state
let restoring = false;
let timer = null;
let onChange = null; // UI callback (canUndo, canRedo)

function snapshot() { return JSON.stringify(store.project); }

function notify() { onChange?.(index > 0, index < stack.length - 1); }

export function record(immediate = false) {
  if (restoring) return;
  clearTimeout(timer);
  const doIt = () => {
    const snap = snapshot();
    if (stack[index] === snap) return;      // no real change
    stack = stack.slice(0, index + 1);      // drop redo tail
    stack.push(snap);
    if (stack.length > MAX_HISTORY) stack.shift();
    index = stack.length - 1;
    notify();
  };
  if (immediate) doIt();
  else timer = setTimeout(doIt, DEBOUNCE_MS);
}

function restore(snap) {
  restoring = true;
  try {
    store.loadProject(JSON.parse(snap));
  } finally {
    restoring = false;
  }
  notify();
}

export function undo() {
  clearTimeout(timer);
  // capture any pending change first so we undo from the latest state
  if (!restoring) {
    const snap = snapshot();
    if (stack[index] !== snap) {
      stack = stack.slice(0, index + 1);
      stack.push(snap);
      index = stack.length - 1;
    }
  }
  if (index <= 0) return false;
  index--;
  restore(stack[index]);
  return true;
}

export function redo() {
  if (index >= stack.length - 1) return false;
  index++;
  restore(stack[index]);
  return true;
}

export function initHistory(callback) {
  onChange = callback;
  stack = [snapshot()];
  index = 0;
  store.on('dirty', () => record());
  notify();
}

export function resetHistory() {
  stack = [snapshot()];
  index = 0;
  notify();
}
