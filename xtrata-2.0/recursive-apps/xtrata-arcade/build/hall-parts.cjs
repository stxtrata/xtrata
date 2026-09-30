/*
 * Xtrata Arcade Hall - parts and packs (shared by the Node build and the parent loader)
 *
 * The hall is made of named PARTS (a CSS file, the body markup, each engine
 * module, each game, Three.js, the art, the hall code). Parts are grouped into
 * five PACKS, each inscribed once:
 *
 *   assets  fonts + cabinet art              (~1.6 MB, locked)
 *   three   Three.js                          (~600 KB, locked)
 *   engine  room CSS, kit, music, scores, replay, room, boot   (~150 KB)
 *   games   the 21 cartridges                 (~1.4 MB)
 *   hall    hall CSS, body markup, 3D hall code (~200 KB, changes most)
 *
 * A pack is plain text: a header line, then each part as
 *   "\n/*@xa-part NAME*\/\n" + exact part text
 * so any part can later be replaced by its own inscription.
 *
 * splitRelease() turns a single-file release (v1.x, e.g. inscription #3078)
 * back into the same parts, so an existing release can supply every part a
 * newer parent does not replace.
 *
 * ES5 on purpose: this file is also inlined into the inscribed parent.
 */
(function (root) {
  'use strict';

  var PACKS = {
    assets: ['fonts.css', 'hall-assets.js'],
    three: ['three.js'],
    engine: ['room.css', 'arcade-kit.js', 'arcade-music.js', 'score-client.js', 'arcade-replay.js', 'arcade-room.js', 'engine-boot.js'],
    games: ['game-neon-snake.js', 'game-block-drop.js', 'game-cave-diver.js', 'game-orbit-merge.js', 'game-block-runner.js',
      'game-brick-breaker.js', 'game-rock-drift.js', 'game-stack-tower.js', 'game-road-hopper.js', 'game-tile-tap.js',
      'game-merge-2048.js', 'game-block-defence.js', 'game-maze-muncher.js', 'game-invader-wave.js', 'game-helix-drop.js',
      'game-bubble-pop.js', 'game-swerve.js', 'game-lunar-lander.js', 'game-reflex-tap.js', 'game-mine-sprint.js', 'game-pong-streak.js'],
    hall: ['hall.css', 'hall-body.html', 'hall.js']
  };
  var PACK_ORDER = ['assets', 'three', 'engine', 'games', 'hall'];

  // Load order. CSS goes to <head>, the markup to <body>, scripts run in this order.
  var ORDER = {
    css: ['fonts.css', 'room.css', 'hall.css'],
    html: ['hall-body.html'],
    js: ['arcade-kit.js', 'arcade-music.js', 'score-client.js', 'arcade-replay.js', 'arcade-room.js']
      .concat(PACKS.games, ['engine-boot.js', 'three.js', 'hall-assets.js', 'hall.js'])
  };

  function packOf(part) {
    for (var i = 0; i < PACK_ORDER.length; i++) if (PACKS[PACK_ORDER[i]].indexOf(part) >= 0) return PACK_ORDER[i];
    return null;
  }

  /* ------------------------------------------------------------ packs */
  var PART_MARK = /\n\/\*@xa-part ([A-Za-z0-9._-]+)\*\/\n/;
  function makePack(name, parts) {
    var out = '/*@xa-pack ' + name + ' v1*/';
    PACKS[name].forEach(function (p) {
      var text = parts[p];
      if (typeof text !== 'string') throw new Error('pack ' + name + ' is missing ' + p);
      if (PART_MARK.test(text)) throw new Error(p + ' contains a part marker');
      out += '\n/*@xa-part ' + p + '*/\n' + text;
    });
    return out;
  }
  function parsePack(text) {
    var bits = String(text).split(new RegExp(PART_MARK.source));
    if (bits[0].indexOf('/*@xa-pack ') !== 0) throw new Error('not an arcade pack');
    var parts = {};
    for (var i = 1; i + 1 < bits.length; i += 2) parts[bits[i]] = bits[i + 1];
    return parts;
  }

  /* --------------------------------------------- single-file releases */
  // Big data lines in the hall code (art, sprite sheets) move to hall-assets.js;
  // the hall keeps "const NAME = XA_HALL_ASSETS.NAME;" in their place.
  var ASSET_MIN = 3000;
  var ASSET_LINE = /^((?:const|let|var)\s+([A-Z_][A-Z0-9_]*)\s*=\s*)([\s\S]*);$/;
  function splitAssets(hallJs) {
    var names = [], values = {};
    var lines = hallJs.split('\n').map(function (line) {
      var m = line.length > ASSET_MIN && ASSET_LINE.exec(line);
      if (!m) return line;
      names.push(m[2]); values[m[2]] = m[3];
      return m[1] + 'XA_HALL_ASSETS.' + m[2] + ';';
    });
    var assets = 'window.XA_HALL_ASSETS = window.XA_HALL_ASSETS || {};\n' +
      names.map(function (n) { return 'XA_HALL_ASSETS.' + n + ' = ' + values[n] + ';\n'; }).join('');
    return { hall: lines.join('\n'), assets: assets };
  }
  // Inverse of splitAssets: put the data back inline (single-file builds).
  function inlineAssets(hallJs, assetsJs) {
    var values = {};
    assetsJs.split('\n').forEach(function (line) {
      var m = /^XA_HALL_ASSETS\.([A-Z_][A-Z0-9_]*) = ([\s\S]*);$/.exec(line);
      if (m) values[m[1]] = m[2];
    });
    return hallJs.split('\n').map(function (line) {
      var m = /^((?:const|let|var)\s+[A-Z_][A-Z0-9_]*\s*=\s*)XA_HALL_ASSETS\.([A-Z_][A-Z0-9_]*);$/.exec(line);
      return m && values[m[2]] != null ? m[1] + values[m[2]] + ';' : line;
    }).join('\n');
  }

  // \x3c keeps the HTML comment opener and script tags out of the parent's inline script (HTML parser states).
  var ENGINE_COMMENT = '\n\x3c!-- ============ ENGINE';
  // Single-file release (the v1.x layout) → { parts, skeleton }.
  // The skeleton is the release with each part replaced by "@@part:NAME@@".
  function splitRelease(html) {
    var parts = {}, skeleton = html;
    var styles = [], m, re = /<style>([\s\S]*?)<\/style>/g;
    while ((m = re.exec(html))) styles.push(m[1]);
    if (styles.length !== 3 || styles[0].indexOf('@font-face') < 0 || styles[1].indexOf('room styles') < 0)
      throw new Error('unexpected <style> layout (' + styles.length + ' blocks)');
    ['fonts.css', 'room.css', 'hall.css'].forEach(function (name, i) {
      parts[name] = styles[i];
      skeleton = skeleton.replace('<style>' + styles[i] + '</style>', function () { return '<style>@@part:' + name + '@@</style>'; });
    });
    var b0 = skeleton.indexOf('<body>\n'), b1 = skeleton.indexOf(ENGINE_COMMENT);
    if (b0 < 0 || b1 < 0) throw new Error('unexpected <body> layout');
    b0 += '<body>\n'.length;
    parts['hall-body.html'] = skeleton.slice(b0, b1);
    skeleton = skeleton.slice(0, b0) + '@@part:hall-body.html@@' + skeleton.slice(b1);

    var sre = /<script>([\s\S]*?)<\/script>/g, scripts = [];
    while ((m = sre.exec(skeleton))) scripts.push(m[1]);
    scripts.forEach(function (text) {
      var name = null, body = text, prefix = '';
      var mk = /^\/\* ([a-z0-9-]+\.js) \*\/\n/.exec(text);
      if (mk) { name = mk[1]; prefix = mk[0]; body = text.slice(prefix.length); }
      else if (text.indexOf('Engine boot:') >= 0) name = 'engine-boot.js';
      else if (text.indexOf('Three.js Authors') >= 0) name = 'three.js';
      else if (text.indexOf('GAMES') >= 0 && text.indexOf('THREE.') >= 0) name = 'hall.js';
      if (!name) throw new Error('unrecognised <script> block');
      if (name === 'hall.js') {
        var sp = splitAssets(body);
        body = sp.hall; parts['hall-assets.js'] = sp.assets;
      }
      parts[name] = body;
      skeleton = skeleton.replace('\x3cscript>' + text + '<\/script>', function () { return '\x3cscript>' + prefix + '@@part:' + name + '@@<\/script>'; });
    });
    var missing = ORDER.css.concat(ORDER.html, ORDER.js).filter(function (p) { return typeof parts[p] !== 'string'; });
    if (missing.length) throw new Error('release is missing ' + missing.join(', '));
    return { parts: parts, skeleton: skeleton };
  }

  // Rebuild a single-file release from a skeleton and parts (assets inlined).
  function assembleRelease(skeleton, parts) {
    return skeleton.replace(/@@part:([A-Za-z0-9._-]+)@@/g, function (_, name) {
      if (name === 'hall.js') return inlineAssets(parts['hall.js'], parts['hall-assets.js']);
      if (typeof parts[name] !== 'string') throw new Error('missing part ' + name);
      return parts[name];
    });
  }

  var api = {
    PACKS: PACKS, PACK_ORDER: PACK_ORDER, ORDER: ORDER, packOf: packOf,
    makePack: makePack, parsePack: parsePack,
    splitRelease: splitRelease, assembleRelease: assembleRelease,
    splitAssets: splitAssets, inlineAssets: inlineAssets
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.XAHallParts = api;
})(typeof window !== 'undefined' ? window : this);
