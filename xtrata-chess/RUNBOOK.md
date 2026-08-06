# Launch runbook

Everything up to the point where a key is needed is done. What follows needs
your wallet, so it needs you.

Two halves, independent of each other. The contract half puts a playable game on
chain. The inscription half puts the board on chain. Neither blocks the other,
and the contract half is the one that makes the game real.

---

## Before you start

```bash
npm run test:all          # 258 tests, clarinet check clean
node scripts/build.mjs --canary
```

Confirm the canary carries the contract you think it does. The page prints the
hash on load; it must match:

```bash
shasum -a 256 contracts/xtrata-chess-log-v1.clar
```

At the time of writing that is `fae33656a47d948f93348d04d90d5a4f35e8dc7c83d710b75cd9e1f2e5fc3bc9`,
8,311 bytes. If you have edited the contract since, rebuild the canary or it will
deploy the old bytes.

---

## Half one · the contract

Open `dist/xtrata-chess-launch-canary.html` in a browser with Leather or Xverse.
No seed phrase, no environment variables. Work down the steps; each unlocks only
when the one before it has been read back off chain.

**0 · Wallet.** Connect. Check the address is the one you mean to deploy from.
This address becomes half of every game id forever, so it is worth a second look.

**1 · Preflight.** Reads only. Last checked: the name was free and the deployer
held 83.27 STX.

**2 · Deploy.** Type the contract name to confirm. If the wallet refuses the
first parameter shape, try B then C — `stx_deployContract` is the one call here
with no track record in this repo. Then hit *Check and verify source*, and do not
move on until it reports the on-chain source matching byte for byte. A deploy
that lands with different bytes is worse than one that fails.

**3 · Open game #1.** `open-game(none)` — the open board. Verify, and note the
game number it reports.

**4 · First move.** `submit-move(u1, "e2e4")`. Verify. The step passes only when
the log replays to `1. e4`, which is the whole thesis in one line: the chain
holds five characters, and the rules turn them into a position.

**Then:** *Copy report* and keep it. It has every txid, the source hash and the
contract id.

At this point the game is live and anyone can play it, whether or not anything
has been inscribed.

---

## Half two · the inscriptions

Not covered by the canary. This uses the existing Xtrata tooling, which has not
been wired to these artifacts or tested against them.

Sizes are already known, and all three fit the single-transaction route
(`mint-small-single-tx-recursive`, which takes up to 30 chunks of 16,384 bytes):

| artifact | bytes | chunks |
|---|---|---|
| engine | 136,560 | 9 |
| open board | 251 | 1 |
| a child game | ~600 | 1 |

**1 · Inscribe the engine.**

```bash
node scripts/build.mjs --engine
```

Inscribe `dist/xtrata-chess-engine.js`. Record the inscription id — call it `E`.
Everything else depends on it, and it only ever needs inscribing once.

**2 · Build and inscribe the open board**, now that both `E` and the contract
address are known:

```bash
node scripts/build.mjs --board \
  --engine-id E \
  --contract SP…․xtrata-chess-log-v1
```

Seal with `seal-recursive(hash, uri, [E])`. About 250 bytes. It carries its own
contract, so it opens on the game rather than on a form.

**3 · Check it.** Load the board at `/i/<board id>`. It should mount the engine,
read game #1, and show `1. e4` with the sender's address or name beside it.

---

## Afterwards

**Games with their own rules.** From the inscribed board: set the rules, open the
game on chain, download the child page, inscribe it with dependency `[E]`. Around
600 bytes each. The board only knows which engine to point a child at when it is
itself running from an inscription, so generate children from `/i/<board id>`,
not from a local copy.

**Sealing a finished game.** When a game ends, `node scripts/build.mjs --seal
<game>.json` produces a page carrying its own log, names and block times, which
renders with no network at all.

---

## If something goes wrong

**The wallet refuses the deploy on all three shapes.** Fall back to
`scripts/deploy.mjs`, which builds and signs the same transaction from a seed
phrase. Same source, same pinned Clarity 3.

**The deploy confirms but the source hash does not match.** Stop. Do not open a
game on it. The name is spent, so the next attempt needs a new one, and the
contract name is part of every game id.

**A transaction is pending for a long time.** The canary's verify buttons are
safe to press repeatedly; they read, they do not send.

**Someone spams game #1 before you play a move.** Nothing is broken. Junk is
skipped at replay and the log keeps the evidence. If a game genuinely becomes
unusable, open another: games are cheap and the contract hosts any number.

---

## What is still unknown

- No transaction from this project has ever reached a real wallet. The payloads
  are checked against a mock; the wallets themselves are not.
- `stx_deployContract` has no precedent here at all.
- The mnemonic path in `scripts/deploy.mjs` matches the documented derivation but
  has never been run against the real seed. The preflight prints the derived
  address before anything is sent, so one glance settles it.
- What an open board actually attracts is the entire experiment, and nothing in
  simulation answers it.
