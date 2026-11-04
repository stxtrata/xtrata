/* Xtrata logo, traced from the brand mark onto an 851-unit grid and drawn as vector strokes (no image data). */
const XLOGO = (() => {
  const M = 851, mirror = pts => pts.map(([x, y]) => [M - x, y]);
  const outer = [[31, 244], [229, 244], [405, 439], [227, 634], [31, 634], [100, 559], [196, 559], [304, 438], [197, 320], [100, 320]];
  const inner = [[120, 320], [197, 320], [304, 438], [196, 559], [120, 559], [221, 439]];
  return {
    white: [[[24, 70], [290, 70], [425.5, 218], [561, 70], [827, 70], [827, 186], [606, 186], [425.5, 382], [245, 186], [24, 186]]],
    whiteOpen: [[[24, 112], [273, 112], [425.5, 276], [578, 112], [827, 112]]],
    blue: [outer, inner, mirror(outer), mirror(inner)],
    orange: [[[24, 691], [250, 691], [425.5, 500], [601, 691], [827, 691], [827, 784], [563, 784], [425.5, 635], [288, 784], [24, 784]]],
    depth: [[[38, 192], [68, 238]], [[813, 192], [783, 238]], [[38, 683], [68, 640]], [[813, 683], [783, 640]]]
  };
})();
function xtrataLogo(g, cx, cy, size) {
  const s = size / 851; g.save(); g.translate(cx - size / 2, cy - size / 2); g.scale(s, s); g.lineJoin = 'miter'; g.miterLimit = 6; g.lineCap = 'butt';
  const path = (pts, closed) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (closed) g.closePath(); };
  const metal = (c1, c2, c3, y0, y1) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, c1); gr.addColorStop(.5, c2); gr.addColorStop(1, c3); return gr; };
  g.lineWidth = 6; g.strokeStyle = '#2b4a78aa'; XLOGO.depth.forEach(p => { path(p); g.stroke(); });
  const layers = [['blue', metal('#6593cf', '#4675b6', '#315c95', 240, 640)], ['orange', metal('#f2aa5a', '#e28c3b', '#c9762c', 495, 790)], ['white', metal('#ffffff', '#e2e3e1', '#b9bbb8', 64, 392)]];
  for (const [k, stroke] of layers) {
    g.shadowColor = '#000c'; g.shadowBlur = 10; g.shadowOffsetY = 5; g.lineWidth = 13; g.strokeStyle = stroke;
    XLOGO[k].forEach(p => { path(p, true); g.stroke(); });
    if (k === 'white') XLOGO.whiteOpen.forEach(p => { path(p); g.stroke(); });
    g.shadowColor = 'transparent'; g.lineWidth = 2; g.strokeStyle = '#ffffff33'; XLOGO[k].forEach(p => { path(p, true); g.stroke(); });
  }
  g.restore();
}
