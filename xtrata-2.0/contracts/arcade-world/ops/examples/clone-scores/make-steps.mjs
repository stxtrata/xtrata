import { readFileSync, writeFileSync } from 'node:fs';
const S = process.argv[2], runs = JSON.parse(readFileSync(S + '/gen/runs2.json', 'utf8')).runs;
const find = (n, board, nonce) => runs.find((r) => r.wizard === 'clone-player' + n && r.board === board && r.nonce === nonce) || (() => { throw new Error('no run ' + [n, board, nonce]); })();
const OWNER = 'ST2J1GW1WDZ5ZZ0M37FRD17EHP602TVDVY1HME6XJ';
const sub = (n, board, nonce, note, over = {}) => { const r = find(n, board, nonce); return { as: 'clone-player' + n, contract: 'scores', fn: 'submit-score',
  args: [{ ascii: over.board || board }, { uint: 0 }, { uint: over.score ?? r.score }, { ascii: over.name || ('Clone P' + n) }, { hex: (over.hex || r.hex) }], note: note + ' ' + board + ' ' + (over.score ?? r.score) }; };
const phases = { A: [], B: [], C: [], D: [], E: [], F: [], G: [] };
const cat = { 1: 1001, 2: 2002, 3: 3003, 4: 4004, 5: 5005, 6: 6006, 7: 7007, 8: 8008, 9: 9009, 10: 1010, 11: 1011, 12: 1012 };
for (let n = 1; n <= 10; n++) phases.A.push(sub(n, 'xa_test_catcher', cat[n], 'first score'));
for (let n = 1; n <= 5; n++) phases.A.push(sub(n, 'xa_test_sprint', 500 + n, 'first time'));
phases.A.push(sub(1, 'xa_block_drop', 7001, 'built-in'), sub(2, 'xa_block_drop', 7002, 'built-in'), sub(1, 'xa_rock_drift', 7003, 'built-in'), sub(2, 'xa_rock_drift', 7004, 'built-in'), sub(3, 'xa_block_defence', 7005, 'built-in'));
phases.B.push(sub(11, 'xa_test_catcher', 1011, 'knocks out the lowest'), sub(12, 'xa_test_catcher', 1012, 'knocks out the lowest'));
phases.C.push(sub(9, 'xa_test_catcher', 9009, 'EXPECT REFUSED u109 (knocked out, below the Top 10)'), sub(1, 'xa_test_catcher', 1101, 'improvement 350 to 390'));
phases.D.push(sub(1, 'xa_test_catcher', 1001, 'EXPECT REFUSED u108 (not better than own 390)'),
  sub(1, 'xa_test_catcher', 1102, 'EXPECT REFUSED u104 (score 0)'),
  sub(4, 'xa_test_catcher', 4004, 'EXPECT REFUSED u113 (another wallet\'s replay)', { hex: find(5, 'xa_test_catcher', 5005).hex }),
  sub(2, 'xa_test_catcher', 2002, 'EXPECT REFUSED u104 (above the board maximum)', { score: 100001 }),
  sub(3, 'xa_test_sprint', 603, 'EXPECT REFUSED u108 (slower than own 1.91 s)'),
  sub(2, 'xa_test_catcher', 2002, 'EXPECT REFUSED u102 (no such board)', { board: 'xa_no_such_game' }));
phases.F.push(sub(7, 'xa_test_catcher', 7007, 'EXPECT REFUSED u101 (paused)'));
phases.E.push({ as: 'root-v3', contract: 'scores', fn: 'set-paused', args: [{ bool: true }], note: 'pause' });
phases.G.push({ as: 'root-v3', contract: 'scores', fn: 'set-paused', args: [{ bool: false }], note: 'unpause' });
// admin pause around the last step is done by hand-ordered phase E/F below
for (const [k, steps] of Object.entries(phases)) writeFileSync(`${S}/steps-${k}.json`, JSON.stringify({ owner: OWNER, contracts: { scores: 'xtrata-arcade-scores-v2' }, steps }, null, 1));
console.log(Object.entries(phases).map(([k, v]) => k + ':' + v.length).join(' '));
