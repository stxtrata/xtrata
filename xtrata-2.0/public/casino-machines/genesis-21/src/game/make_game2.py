import re, sys
s = open('g21-game.js').read()
rd = lambda n: open(n).read()
def rep(s, a, b, n=1):
    if s.count(a) < 1: print('MISSING:', a[:90]); sys.exit(1)
    return s.replace(a, b, n)
def rx(s, pat, b, flags=re.S):
    m = re.search(pat, s, flags)
    if not m: print('NO MATCH:', pat[:90]); sys.exit(1)
    return s[:m.start()] + m.expand(b) + s[m.end():]


# This Is #1: the logo (exact brand SVG) and the real image list
_t1 = open('../brand/this-is-1-logo.svg').read().strip(); _t1i = open('../brand/t1-images.json').read()
s = rep(s, "if (window.__bfUnsupported) return;", "if (window.__bfUnsupported) return;\nconst T1_LOGO_SVG = " + __import__('json').dumps(_t1) + ";\nwindow.G21_T1 = " + __import__('json').dumps(__import__('json').loads(_t1i)) + ";")
# the exact Xtrata mark (brand SVG, never redrawn): drawn as an image
import json as _json
_svg = open('../brand/xtrata-logo.svg').read().strip()
s = rep(s, "if (window.__bfUnsupported) return;", "if (window.__bfUnsupported) return;\nconst XMARK_SVG = " + _json.dumps(_svg) + ";\nconst xtrataLogo = (() => { const img = new Image(), calls = []; let ready = false; const draw = (g, cx, cy, size) => g.drawImage(img, cx - size / 2, cy - size / 2, size, size); img.onload = () => { ready = true; calls.splice(0).forEach(c => draw(...c)); try { screenDirty = true; } catch (e) {} }; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(XMARK_SVG); return (g, cx, cy, size) => { if (ready) draw(g, cx, cy, size); else calls.push([g, cx, cy, size]); }; })();")

# new modules
s = rep(s, "/* ---------- Spinning ---------- */", rd('p_scenes.js') + "\n/* ---------- Spinning ---------- */")
s = rep(s, "// Cached cabinets borrow the room's LAYR account", rd('p_test.js') + "\n" + rd('p_fs.js') + "\n// Cached cabinets borrow the room's LAYR account")

# drawScreen: scene overlay
s = rep(s, "const f = feature(), shownBet = f ? f.bet", "const f = (SC && SC.stage === 'trigger') ? null : feature(), shownBet = f ? f.bet")
s = rep(s, "  screenTexture.needsUpdate = true; screenDirty = false; invalidate();\n}\n// The piece of art shown", "  drawPlaySkip(); drawScene(now); mirrorBar(); fsPoll();\n  screenTexture.needsUpdate = true; screenDirty = false; invalidate();\n}\n// The piece of art shown")
s = rep(s, "const pulse = now - chainFlash < 1000 ||", "const pulse = !!SC || now - chainFlash < 1000 ||")
s = rep(s, "function screenTap(x, y) {", "function screenTap(x, y) { if (sceneTap(x, y) || playSkipTap(x, y)) return;")
s = rep(s, "function spinClick() { if(spinInputBusy())return;", "function spinClick() { if (SC) { const a = pendingAction(); a && a.fn(); return; } if(spinInputBusy())return;")

# finishSpin: jackpot scene, then the usual follow-up
s = rep(s, "if (r.jackpotWin) { particles(110); toast(", "if (r.jackpotWin) { toast(")
s = rx(s, r"(  if \(feature\(\)\) \{ stopAuto\(\); setTimeout\(beginFeature, 550\); return; \}.*?  scheduleAuto\(\);\n)\}", "  const tail = () => {\n\\1  };\n  if (r.jackpotWin) { stopAuto(); flowJackpot(r.jackpotWin, tail); return; }\n  tail();\n}")
s = rx(s, r"if \(!quiet\) \{ sound\('bonus'\); toast\(f\.type === 'chain' \? '[^']*' : '[^']*'\); \}", "if (!quiet) { flowFeature(); return; }")

# features
s = rep(s, "if (E.featureDone(f)) { collectFeature(); return; }", "if (E.featureDone(f)) { outroFeature(f); return; }")
s = rep(s, "const r = E.pick(state, i); if (!r) return; save();", "const r = E.pick(state, i); if (!r) return; pickAnim[i] = performance.now(); save();")
s = rep(s, "const fr = E.respin(state); save(); chainFlash = performance.now();", "const fr = E.respin(state); save(); chainFlash = performance.now(); fr.added.forEach(i => { lockAnim[i] = performance.now(); }); if (fr.added.length) sting('stamp');")
s = rep(s, "text(sg, `${fmt(f.awards[i] * f.bet)} LAYR`, x + h + (w - h) / 2, y + h / 2 + 32, 19, '#f6c453'); }", "text(sg, `${fmt(f.awards[i] * f.bet)} LAYR`, x + h + (w - h) / 2, y + h / 2 + 32, 19, '#f6c453'); fxReveal(x, y, w, h, i, performance.now()); }")
s = rep(s, "text(sg, fmt(v * f.bet), x + w / 2, y + 134, 20, '#f6c453'); }", "text(sg, fmt(v * f.bet), x + w / 2, y + 134, 20, '#f6c453'); fxStamp(x, y, w, h, i, now); }")
s = rx(s, r"  hideBar\(\); lastResult = null; capsuleFaces = \[\]; update\(\);\n(  if \(feature\(\)\).*?)\n\}\nfunction showFreeBar", "  hideBar(); lastResult = null; capsuleFaces = []; update();\n  const cont = () => {\n\\1\n  };\n  if (c.jackpotWin) flowJackpot(c.jackpotWin, cont); else cont();\n}\nfunction showFreeBar")
s = rx(s, r"function showFreeBar\(retrigger\) \{[^\n]*\n", "function showFreeBar(retrigger) { if (!state.free) return; flowFree(retrigger); }\n")
s = rx(s, r"function showFreeSummary\(\) \{[^\n]*\n", "function showFreeSummary() { if ((SC && SC.stage === 'outro') || $('modal').open || feature()) return; const r = E.endFree(state); if (!r) return; save(); update(); sceneSet('free', 'outro', { total: r.total, count: r.count, bet: r.bet || state.bet, rule: `${fmt(r.total)} LAYR`, done: () => { sceneEnd(); status('MAINNET LAUNCH COMPLETE'); } }); }\n")
i = s.index("function openGamble() {"); j = s.index("function openHistory(){")
s = s[:i] + "function openGamble() { flowGamble(); }\n" + s[j:]

# the bar's Fair Play button scrolls to this heading in the rules
s = rep(s, '<h3>FAIR PLAY</h3>', '<h3 id="fairPlay">FAIR PLAY</h3>')

# keys
s = rep(s, "if (e.code === 'Space') { e.preventDefault(); spinClick(); }", "if (SC) { e.preventDefault(); if (e.code === 'Space' || e.key === 'Enter') { const a = pendingAction(); a && a.fn(); } else if (e.key.toLowerCase() === 's') sceneSkip(); } else if (e.code === 'Space') { e.preventDefault(); spinClick(); }")
s = rx(s, r"function fullscreen\(\) \{[^\n]*\n", "")

# exported interfaces
s = rep(s, "test: Object.freeze({ enabled: testOn,", "openTest: () => openTest(), scene: () => SC ? { kind: SC.kind, stage: SC.stage, dur: SC.dur } : null, skip: () => sceneSkip(), pending: () => { const a = pendingAction(); return a ? a.label : null; }, fullscreen: on => (on === undefined ? fsOn : on ? fsEnter() : fsExit()), isFullscreen: () => fsOn,\n  test: Object.freeze({ enabled: testOn,")
s = rep(s, "action(name){if(pxEngineActive)pxControl(name);},", "action(name){if(pxEngineActive)pxControl(name);},\n  fullscreen(on){return on?fsEnter():fsExit();},isFullscreen(){return fsOn;},skip(){return sceneSkip();},openTest(){return openTest();},")
open('g21-game.js', 'w').write(s)
print('ok', len(s))
