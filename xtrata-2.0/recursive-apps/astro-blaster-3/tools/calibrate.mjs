await import('../release/sim.js');
const A = globalThis.AB3;
export function runHuman(seed, every, maxF = 400000) {
  const st = A.createGame({ seed }); let f = 0, last = { ax: 0, ay: 0, cmd: 0 };
  while (st.phase !== 'over' && f < maxF) {
    let inp;
    if (st.phase !== 'play') inp = A.botInput(st);
    else if (f % every === 0) { inp = A.botInput(st); last = { ax: inp.ax, ay: inp.ay, cmd: 0 }; }
    else inp = last;
    A.step(st, inp); f++;
  }
  return { st, f };
}
const everyList = (process.argv[2] || '6,10').split(',').map(Number);
for (const every of everyList) {
  const rows = [];
  for (const seed of [21, 22, 23, 24, 25, 26]) {
    const { st, f } = runHuman(seed, every);
    rows.push(`L${st.loop}S${st.sector + 1}W${st.wave + 1}${st.flow === 'boss' ? 'B' : ''} ${(f / 3600).toFixed(1)}m ${st.score}`);
  }
  console.log(`react every ${every} frames:`, rows.join(' | '));
}
