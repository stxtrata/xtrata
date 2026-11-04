/* ---------- Test panel (only in the test build). Triggers, twins state, RTP simulation. ---------- */
function setTwins(mode) {
  const live = ['bitcoin-birds', 'megapont-ape-club', 'bitcoin-monkeys'];
  COLS.forEach(c => { c.twinned = mode === 'all' ? true : mode === 'none' ? false : live.includes(c.key); });
  SLOTS.forEach(s => { pools[s].forEach(t => { const col = colByKey(t.key); if (col && t.img) t.tile = nftTile(t.img, col, { ...t, twinned: col.twinned }); }); if (placeholders[s] && !['scatter', 'chain'].includes(s)) placeholders[s] = nameTileFor(s); });
  refaceIdle(); screenDirty = true; try { liveLabel(); } catch (e) {}
}
function testSpin(kind) { closeModal(); if (!window.Genesis21.test.arm(kind)) { toast('Test hooks are off.'); return; } if (state.free || feature() || SC) { toast('Finish the current bonus first.'); return; } setTimeout(() => spinClick(), 200); }
function runRtp(n, out) {
  const m = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rnd = m(21), rng = k => Math.floor(rnd() * k), st = BF.fresh(); st.balance = 1e15; let i = 0, free = 0, jack = 0; const t0 = performance.now();
  const chunk = () => { const end = Math.min(n, i + 50000);
    for (; i < end; i++) { st.bet = BF.bets[i % BF.bets.length]; BF.start(st, rng); const r = BF.settle(st); if (r.jackpotWin) jack++; if (r.triggers.free) free++;
      for (let g = 0; g < 1e5; g++) { const f = BF.feature(st); if (f) { if (f.type === 'vault') { BF.pick(st, 0); BF.pick(st, 1); BF.pick(st, 2); } else while (!BF.featureDone(f)) BF.respin(st); const c = BF.collect(st); if (c.jackpotWin) jack++; continue; } if (st.free > 0) { BF.start(st, rng); const rr = BF.settle(st); if (rr.jackpotWin) jack++; continue; } if (st.freeActive) { BF.endFree(st); continue; } break; } }
    out.textContent = `${i.toLocaleString()} / ${n.toLocaleString()} spins · RTP so far ${(st.paidOut / st.wagered * 100).toFixed(3)}%`;
    if (i < n) setTimeout(chunk, 0); else out.innerHTML = `<b>${n.toLocaleString()} spins, seed 21: RTP ${(st.paidOut / st.wagered * 100).toFixed(3)}%</b> (design 94.38%, ±0.3% expected at this size) · free-spin triggers 1 in ${(n / free).toFixed(0)} · jackpots ${jack} · ${((performance.now() - t0) / 1000).toFixed(1)} s`; };
  chunk();
}
function openTest() {
  showModal('test', 'Test panel.', `<p class="fine">Test build only. Each trigger arms the engine's next spin with fixed reel stops, then spins.</p>
<div class="ab" style="flex-wrap:wrap;gap:8px"><button class="cta" data-t="free">Free spins</button><button class="cta" data-t="vault">Pick bonus</button><button class="cta" data-t="chain">Hold and respin</button><button class="cta" data-t="jackpot">Jackpot</button><button class="cta" data-t="win">Win, then gamble</button></div>
<p><b>Twins state</b></p><div class="ab" style="flex-wrap:wrap;gap:8px"><button class="outline" data-tw="none">None</button><button class="outline" data-tw="some">Some (live)</button><button class="outline" data-tw="all">All nine</button></div>
<p><b>Other</b></p><div class="ab" style="flex-wrap:wrap;gap:8px"><button class="outline" id="tRm">Reduced motion: ${state.reduced ? 'ON' : 'OFF'}</button><button class="outline" id="tRtp">Run RTP simulation (1,000,000 spins)</button><button class="outline" id="tReset">Reset play balance</button></div><p id="tOut" class="fine"></p>`, 'TEST BUILD');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => testSpin(b.dataset.t));
  document.querySelectorAll('[data-tw]').forEach(b => b.onclick = () => { setTwins(b.dataset.tw); $('tOut').textContent = `Twins: ${b.dataset.tw}.`; });
  $('tRm').onclick = () => { state.reduced = !state.reduced; save(); $('tRm').textContent = `Reduced motion: ${state.reduced ? 'ON' : 'OFF'}`; };
  $('tRtp').onclick = () => runRtp(1000000, $('tOut'));
  $('tReset').onclick = () => { try { window.parent.G21Stub ? window.parent.G21Stub.reset() : (LAYR.reset && LAYR.reset()); } catch (e) {} update(); $('tOut').textContent = 'Balance reset.'; };
}
