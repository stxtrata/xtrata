// Generating a child board.
//
// A child game is not a copy of this board. It is a few hundred bytes that say
// which game it renders and under what rules, plus a dependency on the engine
// this board is already running. That is the whole point of the lineage: the
// code is inscribed once and every game after it is nearly free.
//
// The child carries no rules enforcement of its own. It hands the rules to the
// same replay everything else uses, and replay skips whatever they disallow.

import { normaliseRules, rulesHash } from './rules.js';

/**
 * Work out which inscription supplied the running engine.
 *
 * An inscribed page loads it from /i/<id>, so the id is in the script tag that
 * brought us here. Running from a file or a dev server there is no id, and the
 * caller has to supply one before a child can be generated.
 */
export function engineIdFromLocation(doc = globalThis.document) {
  if (!doc) return null;

  const scripts = [...doc.querySelectorAll('script[src]')];
  for (const script of scripts) {
    const match = String(script.getAttribute('src')).match(/\/i\/(\d+)/);
    if (match) return Number(match[1]);
  }

  // A child page records it too, which covers a child generating a grandchild.
  const declared = globalThis.__XTRATA_CHESS_CHILD__?.engine;
  return Number.isFinite(declared) ? Number(declared) : null;
}

/**
 * The complete source of a child inscription.
 *
 * Deliberately readable rather than minified. Someone opening this in an
 * explorer in ten years should be able to see what it claims and check it.
 */
export function childPage({ contract, network, game, rules, engine, title }) {
  const normalised = normaliseRules(rules);
  const hash = rulesHash(normalised);

  const config = {
    contract,
    network,
    game,
    engine,
    rulesHash: hash,
    rules: normalised
  };

  return `<!doctype html>
<meta charset="utf-8">
<title>${escapeHtml(title || `Xtrata Chess · game ${game}`)}</title>
<script>
// This board renders one game, under the rules below and no others.
// The chain holds sha256 of these rules, committed when the game was opened:
//   ${hash}
// Any board whose rules hash differently is not the referee for this game.
window.__XTRATA_CHESS_CHILD__ = ${JSON.stringify(config, null, 2)};
</script>
<script src="/i/${engine}"></script>
`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
