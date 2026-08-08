import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync('packages/ui/pieces.ts', 'utf8');
const body = src.slice(src.indexOf('PIECE_PATHS: Record<PieceKey, string> = {'));
const paths = {};
for (const m of body.matchAll(/^\s{2}([pnbrqk]):\n?([\s\S]*?)(?=\n\s{2}[pnbrqk]:|\n};)/gm)) {
  const joined = [...m[2].matchAll(/'([^']*)'/g)].map((x) => x[1]).join('');
  if (joined) paths[m[1]] = joined;
}
const keys = ['p','n','b','r','q','k'];
const sq = (k, light, white) => `
<div class="sq ${light?'l':'d'}">
  <svg class="pc ${white?'w':'b'}" viewBox="0 0 45 45" overflow="visible"><path d="${paths[k]}"/></svg>
</div>`;
const ghost = (k, light, kind) => `
<div class="sq ${light?'l':'d'}">
  <svg class="pc gh ${kind}" viewBox="0 0 45 45" overflow="visible"><path d="${paths[k]}"/></svg>
</div>`;
writeFileSync('dist-preview.html', `<!doctype html><meta charset="utf-8"><title>X Chess pieces</title>
<style>
body{background:#12100e;color:#e8e2d9;font:13px ui-sans-serif,system-ui;margin:0;padding:20px}
h2{font-size:12px;color:#d8a24a;letter-spacing:.08em;text-transform:uppercase;margin:22px 0 8px}
.board{display:grid;grid-template-columns:repeat(6,72px);grid-auto-rows:72px;width:max-content;border:1px solid #2e2924;border-radius:6px;overflow:hidden}
.sq{display:flex;align-items:center;justify-content:center;position:relative}
.l{background:#b9a98f}.d{background:#6d5b46}
.pc{width:82%;height:82%;overflow:visible}
.w path{fill:#fff;stroke:#241c12;stroke-width:1.1;stroke-linejoin:round}
.b path{fill:#17130f;stroke:rgba(255,255,255,.34);stroke-width:1.1;stroke-linejoin:round}
.gh path{fill:none;stroke-width:1.8;stroke-linejoin:round;stroke-dasharray:3 2.2}
.signing path{stroke:#d8a24a}
.sent path{stroke:#6fae5f}
.cap{font-size:11px;color:#9a9187;margin:6px 0 0}
.row{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start}
.big{width:150px;height:150px}
</style>
<div class="row">
<div><h2>White on both squares</h2><div class="board">
${keys.map((k,i)=>sq(k,i%2===0,true)).join('')}${keys.map((k,i)=>sq(k,i%2===1,true)).join('')}
</div><p class="cap">pawn · knight · bishop · rook · queen · king</p></div>
<div><h2>Black on both squares</h2><div class="board">
${keys.map((k,i)=>sq(k,i%2===0,false)).join('')}${keys.map((k,i)=>sq(k,i%2===1,false)).join('')}
</div><p class="cap">same six shapes, same sizes</p></div>
</div>
<h2>Ghosts — amber is waiting for your wallet, green is broadcast</h2>
<div class="board">${keys.map((k,i)=>ghost(k,i%2===0,'signing')).join('')}${keys.map((k,i)=>ghost(k,i%2===1,'sent')).join('')}</div>
<h2>Large, to check the drawing</h2>
<div class="row">${keys.map(k=>`<svg class="pc w big" viewBox="0 0 45 45" overflow="visible"><path d="${paths[k]}"/></svg>`).join('')}</div>
`);
console.log('pieces parsed:', Object.keys(paths).join(' '));
