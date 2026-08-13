# Errata

What is wrong with each inscription, by id. Append-only.

An inscription cannot be corrected, so the only remedy available is saying so.
This is that list. It is not a bug tracker: it records faults that are PERMANENT
in something already published, and each entry stays after the fault is fixed in
the tree, because the inscription it describes still has it.

Fixed-in-tree is recorded against the commit, so a reader can tell whether the
next inscription will still carry it.

---

## Inscription 2988

2.0.0, built 2026-08-09, build hash `c2861564`, 123,062 bytes. Live on mainnet
since 2026-08-09 at <https://xtrata.xyz/i/2988>, bound to
`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary`.

### Every square on the board is the wrong colour

The light and dark squares are inverted. a1 is drawn light when it must be dark,
h1 is drawn dark against "light square on your right", and both queens appear to
be standing off their own colour — which is how the first two players to use it
reported the fault.

**The pieces are correct and no game's result is affected.** Perft covers 590
million positions and none of this touched it. It is paint.

*Found by* peacelovemusic.btc and 3hunnatheartist.btc, 2026-08-12.
*Fixed in the tree* by `a893ea24`.

### The endpoint failover never comes back

The board keeps three interchangeable chain hosts so that no single company can
take it down, but the failover only ever moved forward. A recovered host was
never returned to and a host earlier in the list was never retried, so after two
bad moments the board was pinned to the last entry — at which point one wobble in
that entry reported "could not reach any Stacks endpoint" with two healthy hosts
untried.

Long sessions drive it, so it presents as the board losing the chain after a
while, or when switching games.

*Found by* the same testers, switching from game 8 to game 1, 2026-08-12.
*Fixed in the tree* by `fb7d2ced`.

### A promotion cannot be cancelled, and can fire a move that was abandoned

The promotion picker had no Cancel and no Escape, and was hidden in only one
place. Changing your mind and picking up another piece left the panel open still
holding the old move, so choosing Queen submitted and **paid a real network fee**
for a move the player had abandoned. Clicking the promoting pawn again — the
obvious way to put it down — was the same trap.

*Fixed in the tree* by `e286dbcd`.

### Reduced motion does not work

The `prefers-reduced-motion` block aimed at an element that does not exist, so it
was inert. A pending move's trace keeps pulsing for somebody who has asked their
device for stillness, for as long as that move sits in the mempool.

*Fixed in the tree* by `cafacb6b`.

### The selected-square ring is invisible on light squares

The ring showing which piece you have picked up is gold, and gold against the
light square measures 1.006:1 — identical luminance. It is distinguishable by hue
alone, and not at all to anyone who cannot make that separation.

*Fixed in the tree* by `cafacb6b`.

### Copy link produces a dead link for anyone who can actually move

The link was built from the bare path with the query discarded. At `/i/2988`
that is harmless. At the runtime address — the only place a player who can SIGN
is standing — it strips the parameters the site needs to open the board at all,
so the recipient lands on "Missing runtime parameters".

This is the whole onboarding path.

*Fixed in the tree* by `f45e0131`.

### A failed move disappears without explanation

The board said "Sent" and never looked again. Because the ghost clears as soon as
the value appears in the log **or the mempool**, and an aborted transaction
reaches the mempool first, a failed move simply vanishes off the board a poll or
two later — with no explanation and no mention that a network fee was spent.

*Fixed in the tree* by `ca4af332`.

### Rule recovery can be frozen by anybody, permanently

`recoverRules` searches every ordered pair of sides drawn from every distinct
sender in a game's log — and anybody may submit to any game. The search is
quadratic: 1,000 distinct senders is 2,012,018 candidates and **fourteen
seconds**, synchronously, on the main thread.

Recovery runs for every game in the explorer and every ranked game on the
leaderboard, so one ranked game stuffed with a few thousand junk submissions
makes the leaderboard unusable for every visitor to 2988, for as long as that
inscription exists. The explorer also fetches every entry of every listed game,
so the same game costs twenty rate-limited round trips for one row.

Nobody has done this. It costs a few thousand five-character submissions.

*Fixed in the tree* by ADR-0015. **2988 keeps it.**

### `?game=` deep links do nothing

`openFromLink` was written on 2026-08-10, the day after this inscription was
built, so 2988 has never been able to read a game number from its address. A link
like `xtrata.xyz/i/2988?game=8` lands on the Play tab.

**Not a defect in the code**, which has been right since `bf8e8b01`. It has
simply never been inscribed.

*Confirmed live* 2026-08-12.

---

*A note on scope: this list covers faults in what was PUBLISHED. Everything above
is fixed in the tree and none of it can reach a player until a new inscription is
made.*
