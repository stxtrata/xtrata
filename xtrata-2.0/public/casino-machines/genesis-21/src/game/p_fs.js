/* ---------- Fullscreen mode: the screen fills the view, every control except the lever sits on a bar along the bottom ----------
   This belongs to the game code, so it works the same inside the casino. The bar drives the same actions as the deck buttons.
   A real browser fullscreen is requested where the API exists; elsewhere (iPhone Safari) the same layout is a fixed full-viewport layer. */
var fsOn = false, fsApi = false;
(function () {
  const css = document.createElement('style'); css.textContent = `
#fsBar{display:none}
body.fs header,body.fs .intro,body.fs .session,body.fs footer.console,body.fs .vignette,body.fs #featureBar,body.fs .machine-caption{display:none!important}
body.fs{overflow:hidden}
body.fs main{position:fixed;left:0;right:0;top:0;bottom:var(--fsh,84px)}
body.fs #scene{position:fixed;left:0;right:0;top:0;bottom:var(--fsh,84px)}
body.fs #toast{bottom:calc(var(--fsh,84px) + 14px);top:auto}
body.fs #fsBar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:20;background:#0d0a24;border-top:2px solid #5546ff;padding:8px calc(10px + env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) calc(10px + env(safe-area-inset-left));gap:8px;align-items:stretch;justify-content:center;flex-wrap:wrap}
#fsBar button{min-width:64px;min-height:46px;padding:5px 10px;border-radius:12px;border:1px solid #8d83ff66;background:#1d1566;color:#f3ead6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;line-height:1}
#fsBar button b{font-size:13px;letter-spacing:.08em;font-weight:900}#fsBar button small{font-size:9px;letter-spacing:.1em;color:#b9adff;font-weight:600}
#fsBar .fs-main{width:124px;min-width:124px;flex:none;background:linear-gradient(#6a5bff,#4636e0);border-color:#fff4d8aa}#fsBar .fs-main b{font-size:16px;white-space:nowrap}
/* The MINT button never moves: every width on the bar is fixed, and what appears (Collect, Start, Odd/Even, the win readout) shares one reserved slot beside it. */
#fsBar>*{flex:none}#fsBar button b,#fsBar button small{white-space:nowrap}#fsBar button,#fsBar .fs-win{height:46px;min-height:0}#fsBar .fs-slot button{padding-left:3px;padding-right:3px}#fsBar .fs-slot button b{font-size:12px}
#fsBar .fs-slot{display:flex;gap:8px;width:236px;align-items:stretch}#fsBar .fs-slot>*{flex:1;min-width:0}#fsBar .fs-slot>span{display:flex;gap:8px}#fsBar .fs-slot>span>button{flex:1;min-width:0}
#fsBar .fs-win{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:1px dashed #8d83ff55;border-radius:12px;color:#f6c453}#fsBar .fs-win small{font-size:9px;letter-spacing:.1em;color:#b9adff;font-weight:600}#fsBar .fs-win b{font-size:19px;font-variant-numeric:tabular-nums;overflow:hidden;max-width:100%}
#fsBar [data-fs=auto]{width:124px}
#fsBar .fs-act{min-width:0;background:linear-gradient(#ffd978,#f0b429);color:#2a1a00;border-color:#fff4d8;animation:fsPulse 1.1s infinite}#fsBar .fs-act small{color:#5a3d00}
@keyframes fsPulse{50%{box-shadow:0 0 22px #f6c453}}
#fsBar .fs-bet{display:flex;align-items:center;gap:6px}#fsBar .fs-bet span{width:62px;text-align:center;font-variant-numeric:tabular-nums;font-weight:900;font-size:20px;color:#fff4d8}
#fsBar .fs-bal{display:flex;flex-direction:column;justify-content:center;align-items:flex-end;width:116px;color:#f6c453;font-variant-numeric:tabular-nums}#fsBar .fs-bal small{font-size:9px;letter-spacing:.1em;color:#b9adff}#fsBar .fs-bal b{font-size:19px;max-width:100%;overflow:hidden}
#fsBar .fs-vol{display:flex;align-items:center;gap:6px;color:#b9adff;font-size:9px}#fsBar input[type=range]{width:72px;height:44px;margin:0;accent-color:#f6c453}
#fsBar button.dim{opacity:.55}
#fsBar button[aria-pressed=true]{border-color:#f6c453;color:#f6c453}#fsBar [hidden]{display:none!important}
@media(max-width:820px){#fsBar{gap:6px;padding-top:6px}#fsBar button{min-width:44px;height:44px;padding:4px 7px}#fsBar .fs-win{height:44px}#fsBar .fs-slot button b{font-size:10.5px}#fsBar button b{font-size:11px}#fsBar .fs-main{width:100px;min-width:100px}#fsBar .fs-main b{font-size:13px}#fsBar [data-fs=auto]{width:96px}#fsBar .fs-slot{width:198px}#fsBar .fs-bet span{width:50px;font-size:17px}#fsBar .fs-bal{width:92px}#fsBar .fs-bal b{font-size:16px}#fsBar input[type=range]{width:60px;height:44px}}
@media(prefers-reduced-motion:reduce){#fsBar .fs-act{animation:none}}`; document.head.appendChild(css);
  const bar = document.createElement('div'); bar.id = 'fsBar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Machine controls');
  const B = (a, l, s, cls = '') => `<button type="button" data-fs="${a}" class="${cls}"><b>${l}</b><small>${s}</small></button>`;
  bar.innerHTML = B('spin', 'MINT', 'Spin', 'fs-main') + `<div class="fs-slot">${B('act', '', 'Next step', 'fs-act')}<span id="fsGamble" hidden>${B('odd', 'ODD BLOCK', 'Gamble')}${B('even', 'EVEN BLOCK', 'Gamble')}</span><div class="fs-win" id="fsWinBox"><small>WIN</small><b id="fsWin">0</b></div></div>` +
    `<div class="fs-bet">${B('bm', '−STX', 'Bet −')}<span id="fsBet">100</span>${B('bp', '+STX', 'Bet +')}</div>` + B('auto', 'AUTO-STACK', 'Auto') + B('pays', 'ROADMAP', 'Pays') + B('fair', 'FAIR PLAY', 'Rules') + B('turbo', 'TURBO', 'Turbo') +
    `<div class="fs-vol">${B('sound', 'SOUND', 'Sound')}<input type="range" id="fsVol" min="0" max="100" aria-label="Volume"></div>` + B('history', 'HISTORY', 'Session') + B('test', 'TEST', 'Test panel') + `<div class="fs-bal"><small>LAYR</small><b id="fsBal">0</b></div>` + B('exit', 'EXIT', 'Exit fullscreen');
  document.body.appendChild(bar);
  const act = {
    spin: () => spinClick(), act: () => { const a = pendingAction(); a && a.fn(); }, bm: () => changeBet(-1), bp: () => changeBet(1), auto: () => autoClick(), pays: () => openRules(), fair: () => { openRules(); setTimeout(() => { const e = document.getElementById('fairPlay'); e && e.scrollIntoView(); }, 60); },
    turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), exit: () => fsExit(), odd: () => flowGamble('odd'), even: () => flowGamble('even'), test: () => window.Genesis21 && window.Genesis21.openTest && window.Genesis21.openTest()
  };
  bar.addEventListener('click', e => { const b = e.target.closest('button[data-fs]'); if (!b) return; audioInit(); act[b.dataset.fs] && act[b.dataset.fs](); fsSync(); });
  bar.querySelector('#fsVol').addEventListener('input', e => { state.volume = Number(e.target.value); audioInit(); save(); });
})();
/* The scenes and features change what is waiting (Start, Open, Respin, Collect) while they draw; keep the bar's big button in step. */
var fsLast = '';
function fsPoll() { if (!fsOn) return; const pa = pendingAction(), sig = (pa ? pa.label : '') + '|' + (SC ? SC.kind + SC.stage : '') + '|' + spinning + '|' + !!feature() + '|' + state.free + '|' + state.gamble; if (sig !== fsLast) { fsLast = sig; fsSync(); } }
function fsSync() {
  if (!fsOn) return; const bar = $('fsBar'), q = s => bar.querySelector(s), pa = pendingAction();
  q('[data-fs=spin] b').textContent = $('spinText').textContent || 'MINT'; q('[data-fs=spin] small').textContent = 'Spin'; q('[data-fs=spin]').classList.toggle('dim', !!pa || spinning);
  $('fsBet').textContent = fmt(state.free ? state.freeBet : state.bet); $('fsBal').textContent = fmt(state.balance);
  const a = q('[data-fs=act]'); a.hidden = !pa; if (pa) a.querySelector('b').textContent = pa.label;
  q('[data-fs=auto]').setAttribute('aria-pressed', String(autoLeft > 0)); q('[data-fs=auto] b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-STACK'; q('[data-fs=turbo]').setAttribute('aria-pressed', String(!!state.turbo)); q('[data-fs=sound]').setAttribute('aria-pressed', String(!state.muted));
  const gOn = state.gamble > 0 && !SC && !spinning && !feature(); $('fsGamble').hidden = !gOn; $('fsWinBox').hidden = !!pa || gOn; $('fsWin').textContent = $('lastWin').textContent; q('[data-fs=test]').hidden = !(window.Genesis21 && window.Genesis21.test && window.Genesis21.test.enabled);
  const v = $('fsVol'); if (document.activeElement !== v) v.value = state.volume == null ? 70 : state.volume;
  const h = bar.offsetHeight; if (h) document.body.style.setProperty('--fsh', h + 'px');
}
async function fsEnter() {
  if (fsOn) return true; fsOn = true; document.body.classList.add('fs'); fsApi = false;
  try { if (document.documentElement.requestFullscreen) { await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); fsApi = !!document.fullscreenElement; } } catch (e) { fsApi = false; }
  fsSync(); screenDirty = true; try { window.parent !== window && window.parent.postMessage({ type: 'px-fullscreen', machine: 'genesis-21', on: true }, '*'); } catch (e) {}
  return true;
}
function fsExit() {
  if (!fsOn) return; fsOn = false; document.body.classList.remove('fs'); document.body.style.removeProperty('--fsh'); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); fsApi = false; screenDirty = true;
  try { window.parent !== window && window.parent.postMessage({ type: 'px-fullscreen', machine: 'genesis-21', on: false }, '*'); } catch (e) {}
}
function fullscreen() { fsOn ? fsExit() : fsEnter(); }
document.addEventListener('fullscreenchange', () => { if (fsOn && fsApi && !document.fullscreenElement) { fsOn = false; fsApi = false; document.body.classList.remove('fs'); document.body.style.removeProperty('--fsh'); screenDirty = true; try { window.parent !== window && window.parent.postMessage({ type: 'px-fullscreen', machine: 'genesis-21', on: false }, '*'); } catch (e) {} } });
addEventListener('keydown', e => { if (e.key === 'Escape' && fsOn && !fsApi && !$('modal').open) fsExit(); });
addEventListener('resize', () => fsSync());
const __u = update; update = function () { __u(); fsSync(); };
