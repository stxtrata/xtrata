# Xtrata Arcade v2 launch canary

One self-contained page that launches the arcade on the contract-driven world, from the root wallet (Xverse or Leather). It
deploys the three world contracts and the games contract, seeds the hall in the registry, inscribes the release with a parent that names the contracts,
proves a real run on a test board, and only then moves the 26 production boards to the new parent. Each step unlocks only when
the one before it has passed, each re-reads the chain rather than trusting the page, and a re-run after "Forget local progress"
sends nothing that is already done.

Wallet connect and signing use the shared canary module (`../collection-v17/wallet.ts`) and follow `docs/WALLET-PLAYBOOK.md`:
providers on the top window, the chooser on every connect, no `sender`, bare-hex arguments, deny mode, abort on an account
mismatch. The steps live in `engine.ts` (no DOM); `main.ts` is the page.

## The launch state

All four bays are plain posters; no lobby, no doors, no casino. Those come later by contract writes (curtains, then the lobby,
then the casino), not by a new inscription.

## Why only the root wallet (review finding H1)

`xtrata-world-v2` makes the wallet that deploys it the root owner **and** the treasury, and a space belongs to whoever is named
when it is created. If another wallet deployed the registry or built the spaces and root were handed to the final owner later,
that owner could not build in the deployer's spaces, and moving a space to it bumps the space's epoch, which drops its scheduled
states and grants. So the canary:

- has one configured root owner per network (`NETWORKS` in the build script: mainnet `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`);
- stops at preflight, with that explanation, when any other wallet is connected (every sending step checks again);
- creates every space with `owner` = that wallet;
- ends by checking `get-root` (owner, no pending owner, treasury as configured), that no address is left as a registry admin
  (the temporary wallet and every address an `admin-set` event ever named), the screen's admin and fee recipient, the posters
  admin and publishers, and the leaderboard owner.

## What it sends

| Contract / inscription | Size | How |
|---|---|---|
| `xtrata-world-v2` (the registry) | 73.3 KB | deploy, Clarity 4 |
| `xtrata-posters-v1` | 21.0 KB | deploy, Clarity 4 |
| `xtrata-screen-v1` | 27.0 KB | deploy, Clarity 4 |
| registry seed | 32 calls | `launchCalls()` from `contracts/arcade-world/ops/lib/v2-plan.mjs`: 24 `register-kind`, `create-space` arcade and hall, both set live, four bay objects (a bay with no state shows posters) |
| `engine` pack | 195 KB, 13 chunks | `mint-single-tx-with-relationships`, child of #55 |
| `hall` pack | 523 KB, 33 chunks | staged route (over the 32-chunk one-transaction limit): `begin-or-get`, two `add-chunk-batch`, `seal-with-relationships`, child of #55 |
| parent (text/html) | ~24 KB, 2 chunks | child of #55, depends on #3078 and both packs; `CONFIG.world = { posters, registry, screen }` and `CONFIG.games = { contract }` |

`assets`, `three` and `games` come from the v1.3 bundle #3078. The parent is written by `build/parent-render.cjs`, the renderer
`modular.mjs build` uses, so it is what the build would write with those ids. A pack or parent whose exact bytes are already
inscribed (for example an engine pack identical to #3110) is found by its chain hash and re-used.

The leaderboard `xtrata-arcade-scores-v2` stays. The new parent is not byte-equivalent to #3111, so every board gets `set-board`
to it; Top 10s and stored replays are kept.

## Build

```bash
npm install                                   # xtrata-2.0 (esbuild, @stacks v6)
(cd contracts/arcade-world && npm install)    # only for the mock-chain test (clarinet-sdk)
npm run build:canary:arcade-v2-launch         # -> canaries/build/arcade-v2-launch-canary.html
```

The build:

- checks `contracts/live/*.clar` are current (`toLive()` of the simnet sources), and that each contract, the core trio, the
  leaderboard and the release (packs + parent shell + parts + bundle + ids) hash to `PINS`;
- makes the testnet variants of the four contracts with `toLive()` and the testnet core in place of the mainnet one, and the
  testnet core trio with the testnet SIP-009 trait, and embeds both networks' sources;
- checks the planner plans the hall only for both roots and that its 24 kinds are exactly the hall's look vocabulary;
- runs `modular.mjs check` and `build`, and checks the renderer passes `CONFIG.world` through unchanged.

### Refreshing the pins

When a contract or the release changes on purpose the build stops and prints the exact replacement line(s) for `PINS` in
`scripts/build-arcade-v2-launch-canary.mjs`, for example:

```
Pins do not match: xtrata-world-v2. If the change is intended, replace these lines in PINS ...:
  'xtrata-world-v2': 'a72774e9…',
```

Paste them and rebuild. `node scripts/build-arcade-v2-launch-canary.mjs --print-pins` prints every current value.

### Testnet

`XA_TESTNET_ROOT` (default: the mainnet root's key on testnet, `ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQPAYDW7J`), `XA_TESTNET_CORE`
(default `<testnet root>.xtrata-v3-2-3`, which the canary can deploy) and `XA_TESTNET_TREASURY` set the testnet configuration at
build time. The testnet contract variants call that core, so the page refuses any other core on testnet.

## Run

Wallet extensions do not inject into `file://`, so serve it:

```bash
cd canaries/build && python3 -m http.server 8080
# open http://localhost:8080/arcade-v2-launch-canary.html
```

Signatures are the root wallet's prompts on mainnet for a fresh launch (the mock-chain test counts them):

| # | Step | Signs | What it proves |
|---|------|-------|----------------|
| 0 | Connect | none (the wallet's connect approval) | Which account; the chooser opens every time |
| 1 | Preflight | none | Pins; connected wallet = root owner (hard stop otherwise); core live; bundle #3078 and #55 checked; fees quoted; balance covers the estimate; what already exists; a real run flown in the v2.0.0 arcade |
| 2 | Deploy | 4 | `xtrata-world-v2`, `xtrata-posters-v1`, `xtrata-screen-v1`, `xtrata-games-v1` at Clarity 4 (each skipped when already there with the pinned source; refused when the name holds other source); sources read back; root owner, treasury and admins are the root wallet |
| 3a | Kinds | 3 | Fund the temporary wallet, make it a KINDS-only admin, remove it again; it signs the 24 `register-kind` itself, each checked to get the planned id |
| 3b | Hall | 8 | `create-space` arcade and hall (owner = root wallet), both live, the four bays; then `verifyManifest()` reads the plan back |
| 3c | Setup | 2 | Treasury, screen fee recipient and poster publishers already at the launch settings (the deployer holds them); the games contract's delay set to the launch value (mainnet: 6 blocks, about an hour; the contract starts at 144, so this is one `set-delay`) and, on mainnet, locked (`lock-delay`, one-way) |
| 3d | Registry read-back | none | The hall's own reader (world.js + world2.js) finds the hall live and four bays that resolve to posters |
| 4 | Engine pack | 1 (0 if already inscribed) | One transaction, child of #55, fee capped by a post-condition |
| 4 | Hall pack | 4 (0 if already inscribed) | Staged route: begin, 2 chunk batches, seal; each fee capped by a post-condition |
| 5 | Parent | 1 (0 if already inscribed) | `CONFIG.world` = the three world contracts and `CONFIG.games` = the games contract, all at the root address |
| 6 | Verify release | none | Every inscription read back (type, size, hash, parents, dependencies); all 41 parts resolve; the parent boots in a hidden frame with the world reader on the registry, posters and screen; xtrata.xyz serves it |
| 7 | Canary board, submit, copycat, close | 1 + 1 + 1 + 1 | As the v1 canary: a real run stored and re-played from chain bytes; a copied run refused with `(err u113)`; the test board closed |
| 7 | Boards | 3 | Fund the temporary wallet, `propose-owner` to it, `accept-owner` back; it signs the 26 `set-board` itself |
| 8 | Ownership | none | Root owner, treasury, no admins, screen and posters roles, games contract admin / delay / lock / not paused / successor, leaderboard owner; explorer links |
| 9 | Audit | none | Everything re-read; the repo and site changes to make |

**30 signatures in all on mainnet** (31 if a hall publisher grant is configured: `NETWORKS.mainnet.hallPublisher`). Tick "sign the
24 kinds with my wallet" to sign the kinds yourself (24 prompts instead of 3).

On a fresh testnet the rehearsal adds step 1b, deploy the core (3: `xtrata-v1-1-1`, `xtrata-v2-1-0`, `xtrata-v3-2-3` at
Clarity 3), and step 1c, the bundle (read from mainnet #3078, hash-checked, staged: begin + 8 uploads + seal) and a stand-in for
#55 (1), and deploys the leaderboard with the other contracts: 39 signatures.

Cost on mainnet (estimates; the wallet sets each network fee): the four deploys about 4 STX at 30 µSTX per byte (the canary
shows the figure; real fees may be lower), the 11 registry calls and 7 board/test calls about 0.02 STX each, the three inscriptions
0.01 STX + 0.001 STX per chunk in core fees (about 0.08 STX) plus their network fees, and floats for the temporary wallet (about
0.5 STX for the kinds, 0.06 STX for the copycat, 0.6 STX for the boards) that are swept back. Preflight refuses to start below its
estimate; keep about 8 STX free.

### The temporary wallet

One throwaway key, kept in this browser and saved to a file before it gets any role. It is the copycat, the KINDS admin for the 24
kinds (removed straight after; "Remove the temporary KINDS admin" does it at any time) and the leaderboard owner for the 26 boards
(handed back straight after; "Return leaderboard ownership to my wallet"). Every role is read from the chain, so any step resumes.
Each kind records the temporary wallet in its `owner` field; neither the contract nor the hall uses that field.

## The headless runner (testnet only)

The build also writes `canaries/build/arcade-v2-launch-runner.mjs`: the same steps (`engine.ts`) for Node, signed with a key file,
for a machine that can reach the Hiro testnet API. It refuses mainnet outright, before anything is read, and every send goes
through the arcade-world ops guard (`contracts/arcade-world/ops/lib/guard.mjs`): `--execute`, `XA_OPS_CONFIRM=broadcast-testnet`,
a key file that is not the mainnet admin wallet's key, and no `ops/KILL` file (checked again before every transaction).

```bash
# the key's address must be the testnet root the canary is built for
XA_TESTNET_ROOT=ST… npm run build:canary:arcade-v2-launch
node canaries/build/arcade-v2-launch-runner.mjs --network testnet --address ST… --list     # the steps
node canaries/build/arcade-v2-launch-runner.mjs --network testnet --address ST…            # dry run: reads, sends nothing
XA_OPS_CONFIRM=broadcast-testnet node canaries/build/arcade-v2-launch-runner.mjs \
  --network testnet --execute --key-file ./testnet-root.key [--yes] [--steps a,b] [--forget] [--full]
```

`--full` adds two testnet-only steps after the launch: `boards26` (the root key registers all 26 arcade boards on the leaderboard, as the
mainnet boards will be) and `testgames` (inscribes the two test games in `recursive-apps/xtrata-arcade/games-extra`, registers their score
boards and adds them to the games contract: 32 more transactions), so the testnet clone looks like the mainnet launch with two extra games.
Both can also be run alone (`--steps connect,boards26,testgames`) and resume from the chain.

It runs connect, preflight, the testnet core and fixtures, the deploys, the registry (kinds through the temporary KINDS admin,
the hall, setup, the read-back with `ops/lib/hallread.mjs`, the hall's own reader in a vm), the packs, the parent, the release
check (without the boot, which needs a browser) and the ownership check: 34 transactions from the root key on a fresh testnet.
The run proof, the board moves and the audit need the embedded arcade and stay in the page; the runner refuses them. Progress and
the temporary wallet's key live in `~/.xtrata-arcade-v2-launch/testnet.json` (mode 600; `--state-dir` to move it). The default
testnet root is the mainnet admin's own key, which the guard never accepts, so build with `XA_TESTNET_ROOT` set to a disposable
key's address.

## After a launch

The audit step prints the ids. Then, in one commit:

- `recursive-apps/xtrata-arcade/parent/ids.json`: the `engine` and `hall` pack ids and the `world` block
  (`posters`, `registry`, `screen`);
- `public/_redirects` (`/arcade`) and the homepage arcade tile: the parent id;
- `src/arcade-submit/arcade-boards.ts`: add the parent id to `ARCADE_INSCRIPTION_IDS`.

## Tests

```bash
npm run build:canary:arcade-v2-launch
NODE_PATH=<dir with playwright> CHROME_PATH=<chromium> node canaries/arcade-v2-launch/mock-chain-test.cjs
TESTNET=1 NODE_PATH=... CHROME_PATH=... node canaries/arcade-v2-launch/mock-chain-test.cjs
node canaries/arcade-v2-launch/runner-test.cjs     # the headless runner, no browser
```

`mock-chain.cjs` is the chain both use; `handle()` answers one HTTP request from the simnet, so the page test puts it behind a
Playwright route and the runner test behind a `fetch` stub. The runner test builds a copy of the canary for a disposable testnet
key (in a temporary folder) and proves: mainnet refused before any read; no `XA_OPS_CONFIRM`, or a KILL file, refused with nothing
sent; a key that is not the root, and a page-only step, refused; a dry run reads and stops at the first send; `--execute` runs the
whole testnet launch (32 root transactions, kinds by the temporary admin, read back by the hall's reader); a re-run sends nothing.

The chain is a clarinet-sdk simnet (`simnet/Clarinet.toml`, no contracts of its own). Every contract runs there as real Clarity at
the address the canary expects: the mainnet core with the two contracts it reads and its SIP-009 trait, the leaderboard, and the
four new contracts once the canary deploys them from the stub wallet. Only the network is mocked (Hiro read-only calls, sources,
balances, nonces, mempool, tx status, contract events, raw broadcasts, the xtrata.xyz gateway), all answered from the simnet; STX
moved by each call is checked against its deny-mode post-conditions. Mainnet mode starts from mainnet as it is (#55, #3078, an
earlier engine #3110 and parent #3111, boards on #3111) and proves: a wrong wallet is refused at preflight with nothing sent; a
fresh run passes every step with the signature counts above; the registry holds exactly the plan; the parent boots from the mock
chain with the registry config and shows four poster bays; a re-run after forgetting local progress sends nothing. Testnet mode
starts from an empty chain and runs the whole rehearsal, core and fixtures included.

## What this cannot cover

- Real wallet signing (extensions need a real browser session), and Leather or Xverse handling a 200 KB single transaction (the hall pack goes by the staged route).
- Real network fees and Hiro's read limits. The simnet has no 30-read cap. The canary's own registry reads use `get-objects-8`
  and the hall's reader uses `get-object-ids` + `get-object-view`; every read either makes stays within 24 reads in the worst case
  (`node contracts/arcade-world/tests/world2-costs.mjs`), so a stock node's 30-read limit is not a risk, but it has not been
  measured against Hiro's API.
- The run is flown by a bot pilot, not a human.
- On testnet the inscribed parent is a mainnet artifact (it reads the mainnet core and Hiro's mainnet API): the canary boots it
  with those reads pointed at the testnet core and API, but opened directly on testnet it will not load. Runs on testnet are flown
  as the root key's mainnet form, because the arcade engine only pilots mainnet-form addresses (the leaderboard checks only the
  hash160, so it accepts them from the ST address).

See `../CANARY-NOTES.md` for notes on writing canaries.
