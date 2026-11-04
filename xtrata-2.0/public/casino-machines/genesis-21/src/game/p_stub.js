/* ---------- The screen surface ----------
   The casino draws the cabinet and owns every camera; this page supplies the live 1400x960 screen canvas (drawn at 2x)
   and the controls. Opened on its own, the canvas simply fills the page. No WebGL is needed anywhere in this file. */
const glInfo = 'canvas-2d', softwareGL = true;
let tier = 'high', needsRender = false;
const invalidate = () => { needsRender = true; };
const renderer = { software: true, shadowMap: { needsUpdate: false }, info: { render: { calls: 0 } } };
const screen = canvas(2800, 1920), sg = screen.getContext('2d'); sg.setTransform(2, 0, 0, 2, 0, 0);
const screenTexture = { version: 0, set needsUpdate(v) { if (v) this.version++; } };
const spinPhysical = { position: { z: .18 } }; const lever = true; let leverStart = 0;
function setView(v) { view = v; }
const resolveTier = () => 'high', applyTier = () => {};
const stageEl = $('scene');
screen.style.cssText = 'display:block;width:100%;height:100%;object-fit:contain;touch-action:manipulation'; stageEl.appendChild(screen);
screen.addEventListener('pointerup', e => { audioInit(); const r = screen.getBoundingClientRect(), k = Math.min(r.width / 1400, r.height / 960), ox = r.left + (r.width - 1400 * k) / 2, oy = r.top + (r.height - 960 * k) / 2; const x = (e.clientX - ox) / k, y = (e.clientY - oy) / k; if (x >= 0 && y >= 0 && x <= 1400 && y <= 960 && !$('modal').open) screenTap(x, y); });
