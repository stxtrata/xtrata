function infinityPath(g, cx, cy, w) { const d = w * .27, r = w * .2, s = r / d, c = Math.sqrt(1 - s * s), px = d - r * s, py = r * c; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + px, cy - py); g.arc(cx + d, cy, r, Math.atan2(-c, -s), Math.atan2(c, -s), false); g.lineTo(cx - px, cy - py); g.arc(cx - d, cy, r, Math.atan2(-c, s), Math.atan2(c, s), true); g.closePath(); }
function drawInfinity(g, cx, cy, w, color = '#39d8ff', stripes = true) {
  const W = Math.ceil(w * 1.1), H = Math.ceil(w * .62), off = canvas(W, H), o = off.getContext('2d');
  o.lineWidth = w * .09; o.lineJoin = 'round'; o.strokeStyle = '#ffffff'; infinityPath(o, W / 2, H / 2, w); o.stroke();
  o.globalCompositeOperation = 'source-in'; o.fillStyle = lin(o, 0, 0, 0, H, ['#bff8ff', color, '#0f8fc4']); o.fillRect(0, 0, W, H);
  if (stripes) { o.globalCompositeOperation = 'destination-out'; const step = Math.max(4, w * .033); for (let y = step * .7; y < H; y += step) o.fillRect(0, y, W, step * .3); }
  g.save(); g.shadowColor = color; g.shadowBlur = w * .06; g.drawImage(off, cx - W / 2, cy - H / 2); g.restore();
}
