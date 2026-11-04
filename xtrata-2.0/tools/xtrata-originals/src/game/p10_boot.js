/* ---------- Fullscreen: the game screen fills the view; every control except the lever sits on the bottom bar ---------- */
const view = $('view'), vg = view.getContext('2d'), fs = { active: false, api: false, saved: null, saved2: null };
function fsBlit() { if (!fs.active && window.parent !== window) return; vg.drawImage(screen, 0, 0, 1400, 960); }
const fsHostDoc = () => { try { return window.parent.document; } catch (e) { return document; } };
function fsEnter() {
  if (fs.active) return true; const fe = window.frameElement;
  if (fe) { fs.saved = fe.getAttribute('style'); fs.saved2 = [fe.getAttribute('aria-hidden'), fe.getAttribute('tabindex')]; const set = (k, v) => fe.style.setProperty(k, v, 'important'); [['position', 'fixed'], ['left', '0'], ['top', '0'], ['right', '0'], ['bottom', '0'], ['width', '100vw'], ['height', '100%'], ['max-width', 'none'], ['max-height', 'none'], ['display', 'block'], ['visibility', 'visible'], ['opacity', '1'], ['pointer-events', 'auto'], ['z-index', '2147483000'], ['border', '0'], ['transform', 'none'], ['background', '#05070b']].forEach(([k, v]) => set(k, v)); fe.removeAttribute('aria-hidden'); fe.setAttribute('tabindex', '0'); }
  fs.active = true; document.body.classList.add('fs-on'); fs.api = false;
  const el = fe || document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (req) { try { const pr = req.call(el); fs.api = true; if (pr && pr.catch) pr.catch(() => { fs.api = false; }); } catch (e) { fs.api = false; } }
  try { (fe || window).focus(); } catch (e) {} fsLayout(); screenDirty = true; update(); return true;
}
function fsCleanup() {
  if (!fs.active) return; fs.active = false; const fe = window.frameElement; document.body.classList.remove('fs-on');
  if (fe) { if (fs.saved === null) fe.removeAttribute('style'); else fe.setAttribute('style', fs.saved); if (fs.saved2[0] === null) fe.removeAttribute('aria-hidden'); else fe.setAttribute('aria-hidden', fs.saved2[0]); if (fs.saved2[1] === null) fe.removeAttribute('tabindex'); else fe.setAttribute('tabindex', fs.saved2[1]); }
  if (modalOpen()) closeModal(); screenDirty = true; fsLayout();
}
function fsExit() { if (!fs.active) return; const d = fsHostDoc(); try { if ((d.fullscreenElement || d.webkitFullscreenElement) && fs.api) { const ex = d.exitFullscreen || d.webkitExitFullscreen; ex && ex.call(d); } } catch (e) {} fsCleanup(); }
const fsToggle = () => fs.active ? fsExit() : fsEnter();
function fsChange() { const d = fsHostDoc(); if (fs.active && fs.api && !(d.fullscreenElement || d.webkitFullscreenElement) && !document.fullscreenElement) fsCleanup(); }
[fsHostDoc(), document].forEach(d => { try { d.addEventListener('fullscreenchange', fsChange); d.addEventListener('webkitfullscreenchange', fsChange); } catch (e) {} });
function fsLayout() { const bar = $('fsbar'); if (bar) document.documentElement.style.setProperty('--barh', Math.ceil(bar.getBoundingClientRect().height) + 'px'); }
addEventListener('resize', () => { fsLayout(); screenDirty = true; });
function viewPoint(ev) { const r = view.getBoundingClientRect(), k = Math.min(r.width / 1400, r.height / 960), ox = (r.width - 1400 * k) / 2, oy = (r.height - 960 * k) / 2; return [(ev.clientX - r.left - ox) / k, (ev.clientY - r.top - oy) / k]; }
view.addEventListener('pointerdown', ev => { if (modalOpen()) return; const [x, y] = viewPoint(ev); if (x < 0 || y < 0 || x > 1400 || y > 960) return; ev.preventDefault(); screenTap(x, y); });
/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => { if (spinInputBusy()) return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo reels on.' : 'Normal reel speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('fair').onclick = openFair; $('history').onclick = openHistory; $('settings').onclick = openSettings; $('fsExit').onclick = fsExit; $('work').onclick = openWork; $('pot').onclick = openPot;
$('fsBtn').onclick = fsToggle; $('collect').onclick = () => { if (!state.gamble || busy() || locked()) return; state.gamble = 0; save(); toast('Win kept in your balance.'); sound('click'); update(); }; $('testBtn').onclick = () => openTest(); $('labBtn').onclick = () => { if (lab.on) exitLab(); else openLab(); };
$('gBtc').onclick = () => gambleCall('even'); $('gStx').onclick = () => gambleCall('odd');
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); ambient(); save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
$('vol').oninput = e => { state.volume = Number(e.target.value); if (state.muted && state.volume > 0) state.muted = false; audioInit(); save(); update(); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select')) return; if (modalOpen()) return; if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && pres && pres.bonus === 'vault') pickBind(Number(e.key) - 1); else if (e.key.toLowerCase() === 'm') $('sound').click(); else if (e.key.toLowerCase() === 'f') fsToggle(); else if (e.key.toLowerCase() === 'l' && LAB_ALLOWED) { if (lab.on) openLab(); else openLab(); } else if (e.key.toLowerCase() === 's' && pres) skipPres(); else if (e.key === 'Escape') { if (autoLeft) { stopAuto(); status('AUTO-LAYER OFF'); } } });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted) ac.resume().catch(() => {}); });
/* ---------- Frame loop (idle frames capped near 30 fps) ---------- */
let lastHl = -1, lastPoolSize = 0;
function animate(now) {
  if (!pxEngineActive) { requestAnimationFrame(animate); return; }
  requestAnimationFrame(animate); animate.last = now; pump(now);
}
function pump(now = performance.now()) {
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  presTick(now); labTick(now);
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000 || now < winUntil) screenDirty = true;
  const ps = Object.values(pools).reduce((a, p) => a + p.length, 0); if (ps !== lastPoolSize && !spinning) { lastPoolSize = ps; refaceIdle(); screenDirty = true; }
  const animated = spinning || pres || now < winUntil;
  if (spinning ? now - lastDraw > 16 : (screenDirty && now - lastDraw >= (animated ? 30 : 0)) || (animated && now - lastDraw >= 33)) { drawScreen(now); lastDraw = now; }
}
window.__pxPump = () => { if (pxEngineActive) pump(performance.now()); }; // lets a host (or a headless test) drive frames when rAF is throttled
/* ---------- Boot ---------- */
function resume() {
  if (lab.on) { lab.on = false; E = E0; lab.real = null; }
  state = LAYR.openGame(GAME_ID, E); ensureExtras();
  if (state.pending) { lastResult = E.settle(state); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); } // the result was fixed and saved before animating: settle it once, never reroll
  save(); update();
  if (feature()) { startPres(feature().type, { resume: true }); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { startPres('free', { resume: true }); status(`${state.free} SAVED SESSION STEPS · ALL WINS 2×`); }
  else if (state.freeActive) { startPres('free', { resume: true }); toStage('summary'); }
}
update(); liveLabel(); drawScreen(0);
loadBundled().then(() => loadLive()).catch(() => { sources.done = true; if (sources.mintRead === 'pending') sources.mintRead = 'unknown'; liveLabel(); });
let started = false;
function go() { if (started) return; started = true; requestAnimationFrame(() => { requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading') && $('loading').remove(), 550); }); }
go(); fsLayout();
