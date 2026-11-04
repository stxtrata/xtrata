#!/usr/bin/env python3
"""Exact long-run RTP of the Block Fortune v2 engine (the engine Rune Pit runs unchanged), from its reel strips.

Enumerates all 32^5 = 33,554,432 reel positions for line pays, scatters, triggers and the centre-row jackpot, then adds
the features in closed form: the pick bonus (3 of 9 independent prizes), hold-and-respin (a Markov chain over locked
cells and respins left), free spins (a DP over spins left and spins awarded, with retriggers and the 24 cap) and the
jackpot meter (2% of every paid bet plus a 500x seed per hit). Usage: python3 exact-rtp.py
"""
import numpy as np
from functools import lru_cache

STRIPS = ['NCNLLCWILBSIMKCKIBKMLVCCBMMLKMIC', 'NWNLBIMKILSICMCMCKLKBVKCBLLMIKLM', 'NCMNWCILKCSCIMLBKKKMMVIIMCKMLBBL',
          'NBNCCBLKMLSKLLIKIICMIVCLCBLKMWMK', 'NCNIMLCIKCSLKLMLBKICBVIWMCKMBMLC']
SYM = 'CLMKIBWSVN'; IDX = {c: i for i, c in enumerate(SYM)}
PAYS = {'C': (6, 16, 50), 'L': (7, 20, 60), 'M': (9, 28, 90), 'K': (13, 38, 140), 'I': (20, 80, 300), 'B': (35, 150, 700), 'W': (80, 400, 2500)}
LINES = [[1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],[2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2],[1,0,1,2,1],[1,2,1,0,1],[0,1,0,1,0],[2,1,2,1,2],[1,1,0,1,1],[1,1,2,1,1],[0,2,0,2,0],[2,0,2,0,2],[0,2,1,2,0]]
SCAT = {3: 2, 4: 5, 5: 10}; VAULT_EV = 3 * sum([1, 2, 2, 3, 4, 5, 8, 10, 15]) / 9; CHAIN_MEAN = sum([1, 2, 3, 5, 10]) / 5
ODDS = 25; FREE, RETRIG, CAP, FMULT = 8, 4, 24, 2; JRATE, JSEED = 0.02, 500

win = np.array([[[IDX[s[(stop + r) % 32]] for r in range(3)] for stop in range(32)] for s in STRIPS])  # [reel, stop, row]
N = 32 ** 5
sum_line = sum_scat = n_free = n_vault = n_jack = 0.0; chain_counts = np.zeros(16)
rest = np.indices((32,) * 4).reshape(4, -1)
scat_pay = np.array([0, 0, 0, 2, 5, 10] + [10] * 10, dtype=float)
for s0 in range(32):  # one reel-1 stop at a time keeps memory near 100 MB
    st = [np.full(rest.shape[1], s0)] + [rest[i] for i in range(4)]
    grid = np.stack([win[c][st[c]] for c in range(5)], axis=1).astype(np.int8)
    M = grid.shape[0]; line_total = np.zeros(M)
    for line in LINES:
        cells = np.stack([grid[:, c, line[c]] for c in range(5)], axis=1)
        best = np.zeros(M)
        for sym, p in PAYS.items():
            t = IDX[sym]; ok = (cells == t) | ((cells == IDX['W']) & (t != IDX['W']))
            run = np.cumprod(ok, axis=1).sum(axis=1)
            best = np.maximum(best, np.array([0, 0, 0] + list(p), dtype=float)[run] / 20)
        line_total += best
    flat = grid.reshape(M, 15)
    sc = (flat == IDX['S']).sum(1); va = (flat == IDX['V']).sum(1); ch = (flat == IDX['N']).sum(1)
    sum_line += line_total.sum(); sum_scat += scat_pay[sc].sum(); n_free += (sc >= 3).sum(); n_vault += (va >= 3).sum()
    n_jack += np.all(grid[:, :, 1] == IDX['B'], axis=1).sum(); chain_counts += np.bincount(ch, minlength=16)[:16]
E_line, E_scat, p_free, p_vault, p_jack = sum_line / N, sum_scat / N, n_free / N, n_vault / N, n_jack / N
chain_dist = {k: chain_counts[k] / N for k in range(5, 16) if chain_counts[k]}

@lru_cache(None)
def chain(n, left):  # returns (E[final locked], P(all 15))
    if n == 15: return (15.0, 1.0)
    if left == 0: return (float(n), 0.0)
    empty = 15 - n; from math import comb
    e = pf = 0.0
    for a in range(empty + 1):
        pr = comb(empty, a) * (1 / ODDS) ** a * (1 - 1 / ODDS) ** (empty - a)
        r = chain(n + a, 3 if a else left - 1); e += pr * r[0]; pf += pr * r[1]
    return (e, pf)
E_chain = sum(p * CHAIN_MEAN * chain(k, 3)[0] for k, p in chain_dist.items())
p_chain = sum(chain_dist.values()); p_full = sum(p * chain(k, 3)[1] for k, p in chain_dist.items())

@lru_cache(None)
def spins(left, awarded):  # expected free spins still to play
    if left == 0: return 0.0
    add = min(RETRIG, CAP - awarded)
    return 1 + p_free * spins(left - 1 + add, awarded + add) + (1 - p_free) * spins(left - 1, awarded)
E_N = spins(FREE, FREE)

per_spin_features = p_vault * VAULT_EV + E_chain                    # pick and hold-and-respin pay at 1x, also in free spins
hits_per_spin = p_jack + p_full                                      # jackpot hits per spin played (paid or free)
base = E_line + E_scat
free = p_free * E_N * (FMULT * base + per_spin_features)
features = per_spin_features
h = hits_per_spin * (1 + p_free * E_N)                               # jackpot hits per paid spin
jackpot = JRATE + JSEED * h
rtp = base + free + features + jackpot
print(f"lines {100*E_line:.3f}%  scatters {100*E_scat:.3f}%  free spins {100*free:.3f}%  (of which features {100*p_free*E_N*per_spin_features:.3f}%)")
print(f"pick {100*p_vault*VAULT_EV:.3f}%  hold-and-respin {100*E_chain:.3f}%  jackpot {100*jackpot:.3f}%")
print(f"RTP {100*rtp:.3f}%   free 1 in {1/p_free:.1f}, pick 1 in {1/p_vault:.1f}, hold 1 in {1/p_chain:.1f}, jackpot 1 in {1/h:,.0f} paid spins, E[free spins] {E_N:.3f}")
