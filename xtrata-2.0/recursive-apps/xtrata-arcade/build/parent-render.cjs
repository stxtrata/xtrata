/*
 * Xtrata Arcade Hall - parent renderer, shared by build/modular.mjs and the
 * arcade launch canary, so the parent the canary inscribes (with the pack ids
 * it has just inscribed) is byte for byte what `modular.mjs build` would write.
 *
 *   parentShell(template, lib)  the template with the parts library inlined;
 *                               the CONFIG slot is left open
 *   parentConfig(ids, packOrder) the CONFIG object for a set of ids
 *   fillParent(shell, config)   the finished parent HTML
 */
'use strict';

var CONFIG_SLOT = '/*@@CONFIG@@*/{}';
var LIB_SLOT = '/*@@HALL_PARTS@@*/';

function parentShell(template, lib) {
  // Inline-script safety: a closing script tag ends the element early and an
  // HTML comment opener can stop it ending at all.
  if (/<\/script|<!--/i.test(lib)) throw new Error('hall-parts.cjs must not contain a closing script tag or an HTML comment opener (use \\x3c)');
  if (template.indexOf(LIB_SLOT) < 0 || template.indexOf(CONFIG_SLOT) < 0) throw new Error('parent template is missing a slot');
  return template.replace(LIB_SLOT, function () { return lib; });
}

function parentConfig(ids, packOrder) {
  var packs = {};
  packOrder.forEach(function (n) { packs[n] = Number((ids.packs || {})[n] || 0); });
  return {
    version: ids.version,
    bundleId: Number(ids.bundleId || 0),
    packs: packs,
    parts: ids.parts || {},
    parentTokenId: Number(ids.parentTokenId || 0)
  };
}

function fillParent(shell, config) {
  if (shell.indexOf(CONFIG_SLOT) < 0) throw new Error('parent shell has no CONFIG slot');
  var json = JSON.stringify(config, null, 2).replace(/\n/g, '\n    ');
  return shell.replace(CONFIG_SLOT, function () { return json; });
}

module.exports = { parentShell: parentShell, parentConfig: parentConfig, fillParent: fillParent };
