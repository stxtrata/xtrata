function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = 'Arial', align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function fitText(ctx, s, x, y, size, maxW, color, font = 'Arial', align = 'center', weight = 'bold') { ctx.font = `${weight} ${size}px ${font}`; const w = ctx.measureText(s).width; text(ctx, s, x, y, w > maxW ? Math.floor(size * maxW / w) : size, color, font, align, weight); }
function spaced(ctx, s, x, y, size, gap, color, weight = '600') { ctx.font = `${weight} ${size}px Arial`; const ws = [...s].map(ch => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; [...s].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'default' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
function loadImage(url, ms = 20000) { return new Promise((res, rej) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.decoding = 'async'; const timer = setTimeout(() => { img.src = ''; rej(Error('timeout')); }, ms); img.onload = () => { clearTimeout(timer); res(img); }; img.onerror = () => { clearTimeout(timer); rej(Error('image failed')); }; img.src = url; }); }
// One band of the Xtrata mark, drawn from the house XLOGO vector trace (the same code as every machine), so the jackpot can assemble it band by band.
function xBand(g, cx, cy, size, band, alpha = 1, dx = 0, dy = 0, glow = 0) {
  const s = size / 851, path = (pts, closed) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (closed) g.closePath(); };
  const grads = { blue: ['#6593cf', '#4675b6', '#315c95', 240, 640], orange: ['#f2aa5a', '#e28c3b', '#c9762c', 495, 790], white: ['#ffffff', '#e2e3e1', '#b9bbb8', 64, 392] }[band];
  g.save(); g.globalAlpha *= alpha; g.translate(cx - size / 2 + dx, cy - size / 2 + dy); g.scale(s, s); g.lineJoin = 'miter'; g.miterLimit = 6; g.lineCap = 'butt';
  const gr = g.createLinearGradient(0, grads[3], 0, grads[4]); gr.addColorStop(0, grads[0]); gr.addColorStop(.5, grads[1]); gr.addColorStop(1, grads[2]);
  g.shadowColor = glow ? grads[0] : '#000c'; g.shadowBlur = glow ? glow / s : 10; g.shadowOffsetY = glow ? 0 : 5; g.lineWidth = 13; g.strokeStyle = gr;
  XLOGO[band].forEach(p => { path(p, true); g.stroke(); }); if (band === 'white') XLOGO.whiteOpen.forEach(p => { path(p); g.stroke(); });
  g.shadowColor = 'transparent'; g.lineWidth = 2; g.strokeStyle = '#ffffff33'; XLOGO[band].forEach(p => { path(p, true); g.stroke(); });
  g.restore();
}
