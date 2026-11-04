/* ---------- Faces: which pool, swap or yield record a tile shows. Chosen after the result, with Math.random. ---------- */
let faces = state.grid.map(col => col.map(s => pickFace(s)));

/* Machine Fund and Casino Jackpot adapters. The canonical core owns local jackpot writes.
   TODO(casino-service): replace these adapters with the room's shared ledger once available;
   do not add contributions twice while using the unchanged v2 engine. Practice never calls a service. */
function weekKey(d=new Date()){const t=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())),day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()-(day-1));return t.toISOString().slice(0,10);}
function periodEnd(d=new Date()){const t=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())),day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+8-day);return t.toISOString();}
function weekEndsIn(){return periodEnd().slice(0,10)+' 00:00 UTC';}
const FUND_CONFIG=Object.freeze({type:'W',collections:'all-live',period:'weekly',rate:.01,registry:'https://xtrata.xyz/forever-twins/data/registry.v2.json'});
function holder(){if(!state.fund||typeof state.fund!=='object')state.fund={period:weekKey(),pot:0,last:null,periodEnd:periodEnd()};const h=state.fund;if(h.period!==weekKey()){h.period=weekKey();h.periodEnd=periodEnd();}return h;}
function addHolder(bet,id){if(labRun)return;const h=holder();if(id&&h.lastPaidRound===id)return;h.lastPaidRound=id;h.pot=Math.round((h.pot+bet*FUND_CONFIG.rate)*1e4)/1e4;}
function holderWallets(){return holderMode==='live'?null:({none:0,some:3,all:12})[holderMode];}
const FundService=Object.freeze({readTwins:async()=>null,snapshot:async()=>null,claim:async()=>({available:false,reason:'Claims are not connected in this play-money build.'})}); // TODO(fund-service): verified helper reads, period snapshots and pull claims.
const casinoJackpot=Object.freeze({get(level){return G.meter(state,level);},contribute(level,bet){return {level,bet,contribution:bet*.02,mode:'already-applied-by-canonical-v2'};},settle(level){return {level,meter:G.meter(state,level),mode:'already-settled-by-canonical-v2'};}});
function commitRoundMeta(p){if(!p)return;p.jackpot={level:p.bet,hit:G.evaluate(p.grid,p.bet,p.free?2:1).jackpot||p.features.some(f=>f.type==='chain'&&f.full)};if(!p.free){if(!labRun)casinoJackpot.contribute(p.bet,p.bet);addHolder(p.bet,p.id);}save();}
/* ---------- The screen: 1400 × 960 units, drawn at 2× ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const baseLayer = canvas(1400, 960);
const starField = Array.from({ length: 140 }, () => ({ x: Math.random() * 1400, y: Math.random() * 960, r: Math.random() * 1.8 + .3, s: Math.random() * .8 + .2, tw: Math.random() * 6 }));
(function drawBase(){const g=baseLayer.getContext('2d');g.fillStyle=lin(g,0,0,0,960,['#0b4656','#087c94','#073541']);g.fillRect(0,0,1400,960);
 for(let y=0;y<960;y+=58)for(let x=0;x<1400;x+=58){g.strokeStyle='#bffaff0b';g.lineWidth=1;g.strokeRect(x,y,58,58);}
 round(g,18,18,1364,172,24,'#062d39f5','#7cdce84d',2);
 round(g,RX-12,RY-12,RW+24,RH+24,27,'#def8ed','#73c6d0',5);round(g,RX-5,RY-5,RW+10,RH+10,20,'#033a4c','#d3fff7',2);
 for(let c=0;c<5;c++){g.fillStyle=lin(g,0,RY,0,RY+RH,['#075c73','#0e8ca3','#084f64']);g.fillRect(RX+c*CW,RY,CW-3,RH);}
 g.fillStyle='#041e28';g.fillRect(0,870,1400,90);g.fillStyle='#7cdce84d';g.fillRect(45,872,1310,1);
 text(g,'3 SWAPS = HAPPY HOUR   ·   3 YIELDS = YIELD FARM   ·   5 PAIRS = DEEP LIQUIDITY',700,847,18,'#bcf4ed');})();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000a'); shadeGrad.addColorStop(.14, '#0000'); shadeGrad.addColorStop(.84, '#0000'); shadeGrad.addColorStop(1, '#000a');
let sbtn = [], pressedBtn = '';   // buttons drawn on the screen this frame: tappable in every view; the one held down sinks
function screenButton(id, label, x, y, w, h, act, style = 'gold', sub = '') {
  const hot = scene && scene.hover === id, g = sg, y0 = y, dn = pressedBtn === id; if (dn) y += 5; g.save();
  // a keycap: a dark lip below the button that the face sinks into when held
  if (!dn) round(g, x, y + 5, w, h, h / 2, '#00000088'); else round(g, x, y + 1, w, h, h / 2, '#00000066');
  g.shadowColor = style === 'gold' ? BRASS : ACCENT; g.shadowBlur = dn ? 6 : hot ? 30 : 16;
  round(g, x, y, w, h, h / 2, style === 'gold' ? lin(g, 0, y, 0, y + h, ['#f6e3a6', '#ffb16a', '#a98430']) : style === 'moon' ? lin(g, 0, y, 0, y + h, ['#fbfaf6', '#c9c5b8']) : style === 'doom' ? lin(g, 0, y, 0, y + h, ['#5a5750', '#2a2824']) : '#14120ee8', style === 'ghost' ? '#d9c07acc' : INK, 4); g.restore();
  fitText(g, label, x + w / 2, y + h / 2 - (sub ? 9 : 1), sub ? 26 : 28, w - 30, style === 'ghost' || style === 'doom' ? '#f5fcf7' : INK, '900', HEAD); if (sub) text(g, sub, x + w / 2, y + h / 2 + 18, 13, style === 'ghost' || style === 'doom' ? '#cfc7a6' : '#5a4310', 'Arial', 'center', '800');
  sbtn.push({ id, x, y: y0, w, h, act });
}
function highlightIndex(now) { return !spinning && !scene && !feature() && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
const cellX = c => RX + c * CW + (CW - 176) / 2;
function drawReels(now, opts = {}) {
  const lift = opts.lift || null, dim = opts.dim || 0;
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    if (freeMode) { sg.fillStyle = '#060706aa'; sg.fillRect(RX + c * CW, RY, CW - 3, RH); }
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; const t = tileFor(s, f); if (t) sg.drawImage(t, cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) { if (lift && lift(c, r)) continue; const t = tileFor(state.grid[c][r], faces[c][r]); if (t) sg.drawImage(t, cellX(c), RY + r * RHT + 7, 176, 176); }
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = BRASS; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 16, null, BRASS, 5); sg.restore(); }
  }
  if (dim) { sg.fillStyle = `rgba(4,4,3,${dim})`; sg.fillRect(RX, RY, RW, RH); }
  if (lift) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (lift(c, r)) { const k = lift(c, r), t = tileFor(state.grid[c][r], faces[c][r]); sg.save(); sg.translate(cellX(c) + 88, RY + r * RHT + 95 - k.up); sg.scale(k.scale, k.scale); sg.shadowColor = k.color || BRASS; sg.shadowBlur = 40; if (t) sg.drawImage(t, -88, -88, 176, 176); sg.restore(); }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 18, null, BRASS, 5); sg.save(); sg.shadowColor = BRASS; sg.shadowBlur = 14; sg.lineWidth = 5; sg.strokeStyle = '#f1dc9ad0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning && !scene) { sg.strokeStyle = '#06b6d455'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
/* The tag lights: the cabinet's rows px-tag0 (bottom) to px-tag7 (top). They step in time on wins, sweep during bonuses and all light on the jackpot. */
function updateTags(now, dt) {
  const t = now / 1000, target = new Array(8).fill(0);
  if(RM()){for(let i=0;i<8;i++)target[i]=(scene&&scene.kind==='jackpot')?.8:(scene||freeMode)?.45:.1;}
  else if (scene && scene.kind === 'jackpot') for (let i = 0; i < 8; i++) target[i] = .82 + .18 * Math.sin(t * 13 + i * .7);
  else if (scene || freeMode) { const pos = (t * 8.5) % 14, p = pos <= 7 ? pos : 14 - pos; for (let i = 0; i < 8; i++) target[i] = Math.max(0, 1 - Math.abs(i - p) / 2.2); }
  else if (now < winUntil) { const beat = Math.floor((now - winStart) / 250), s = winPower; for (let i = 0; i < 8; i++) target[i] = (i % 2 === beat % 2) ? s : s * .16; }
  else for (let i = 0; i < 8; i++) target[i] = .1 + .06 * Math.sin(t * 1.3 + i * .8);
  const k = Math.min(1, dt * 16); for (let i = 0; i < 8; i++) tagGlow[i] += (target[i] - tagGlow[i]) * k;
}
let winPower = .6;
function holderLines(){const h=holder(),n=holderWallets();return{pot:fmt(h.pot),period:'ENDS '+h.periodEnd.slice(0,10)+' · MON 00:00 UTC',share:'ONE SHARE PER ELIGIBLE FOREVER TWIN',wallets:n===null?'ELIGIBLE TWINS: CHECKING':fmt(n)+' TWINS · TEST STATE',last:h.last&&h.last.payPerTwin!=null?'LAST PERIOD: '+fmt(h.last.payPerTwin)+' LAYR / TWIN':'LAST PERIOD / TWIN: CHECKING'};}
const topperScreen=canvas(1800,136),tg=topperScreen.getContext('2d');
function drawTop(now,shownBet){const hl=holderLines();
 fitText(sg,'POOL PARTY',270,69,52,350,'#f3fff8','900',HEAD);spaced(sg,'ROOFTOP DEFI CLUB',270,113,12,2.2,'#86dce1');text(sg,'STACKS TOKENS · REAL POOL RECORDS',270,146,11,'#9dc4c9');
 text(sg,'CASINO JACKPOT',700,41,19,'#ffba82');text(sg,fmt(casinoJackpot.get(shownBet)),700,102,60,'#f8fffc','Arial','center','300');text(sg,fmt(shownBet)+' BET LEVEL · LOCAL TEST METER',700,153,13,'#9edbe1');
 text(sg,'MACHINE FUND',1160,38,16,ACCENT);text(sg,hl.pot+' LAYR',1160,73,29,'#fff','Arial','center','400');fitText(sg,hl.period,1160,104,12,360,'#d1eeeb');fitText(sg,hl.last,1160,129,12,360,'#a7d8d7');fitText(sg,hl.wallets,1160,153,11,360,'#81bdc6');
 tg.fillStyle='#042b37';tg.fillRect(0,0,1800,136);text(tg,'CASINO JACKPOT  '+fmt(casinoJackpot.get(shownBet))+' LAYR  ·  BET '+shownBet,900,40,40,'#f3fff8');text(tg,'MACHINE FUND  '+hl.pot+' LAYR  ·  '+hl.period+'  ·  '+hl.last,900,98,24,'#86dce1');
}
function drawPreviewRibbon(){if(!labRun)return;sg.fillStyle='#ffb16a';sg.fillRect(0,0,1400,28);text(sg,'BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR',700,14,20,'#07353e','Arial','center','900');}
// The big-win stamp appears above the pool window.
let burstAt = -1e9;
function drawBurst(now) { const t = (now - burstAt) / 1600; if (t < 0 || t > 1) return; const k = RM() ? 1 : backOut(clamp(t * 4)) * (t > .8 ? 1 - (t - .8) * 5 : 1); sg.save(); sg.globalAlpha = t > .8 ? 1 - (t - .8) * 5 : 1; sg.translate(700, RY + RH / 2); sg.rotate(-.08); sg.scale(k, k); sg.shadowColor = BRASS; sg.shadowBlur = 40;
  round(sg, -250, -88, 500, 176, 20, '#0b0a07f2', BRASS, 8); sg.shadowBlur = 0; round(sg, -238, -76, 476, 152, 12, null, '#ffb16a66', 2);
  sg.save(); sg.shadowColor = '#000'; sg.shadowBlur = 8; fitText(sg, 'BIG WIN', 0, -20, 92, 440, STAKEC, '900', HEAD); sg.restore(); spaced(sg, 'MAKE A SPLASH', 0, 48, 24, 5, BRASS, '900'); sg.restore(); }
/* Particles drawn on the screen itself (coins, sparks, confetti), so effects show on the cabinet and in fullscreen alike. */
const fx = [];
function burst(x, y, n, kind = 'coin', spread = 1) { if (RM()) return; for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 6) * spread; fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5 * spread, life: 1, kind, rot: Math.random() * 6, hue: Math.random() }); } }
function drawFx(dt) {
  for (let i = fx.length - 1; i >= 0; i--) { const p = fx[i]; p.x += p.vx; p.y += p.vy; p.vy += .28; p.rot += .15; p.life -= dt * .55; if (p.life <= 0 || p.y > 980) { fx.splice(i, 1); continue; }
    sg.save(); sg.globalAlpha = Math.min(1, p.life * 1.6); sg.translate(p.x, p.y); sg.rotate(p.kind === 'dog' ? Math.sin(p.rot) * .4 : p.rot);
    if (p.kind === 'coin') { sg.scale(Math.abs(Math.cos(p.rot * 1.3)) * .8 + .2, 1); sg.beginPath(); sg.arc(0, 0, 11, 0, 7); sg.fillStyle = '#ffb16a'; sg.fill(); sg.lineWidth = 3; sg.strokeStyle = '#6d5316'; sg.stroke(); }
    else if (p.kind === 'dog') { sg.beginPath(); sg.arc(0, 0, 15, 0, 7); sg.fillStyle = lin(sg, 0, -15, 0, 15, ['#f6e3a6', '#ffb16a', '#a98430']); sg.fill(); sg.lineWidth = 2.5; sg.strokeStyle = '#4a3a10'; sg.stroke(); text(sg, 'LP', 0, 1, 9, '#2a200a', HEAD, 'center', '900'); }
    else if (p.kind === 'star') star(sg, 0, 0, 12, p.hue > .5 ? '#fff3c0' : '#06b6d4');
    else { sg.fillStyle = ['#ffb16a', '#77cdd3', '#06b6d4', '#f97770', '#ffffff'][Math.floor(p.hue * 5)]; sg.fillRect(-6, -3, 12, 6); }
    sg.restore(); }
}
